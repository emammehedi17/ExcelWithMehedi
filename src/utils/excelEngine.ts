// Helper functions for Excel coordinate & formula handling

export function colIndexToLetter(colIndex: number): string {
  let colStr = '';
  let temp = colIndex + 1;
  while (temp > 0) {
    const rem = (temp - 1) % 26;
    colStr = String.fromCharCode(65 + rem) + colStr;
    temp = Math.floor((temp - 1) / 26);
  }
  return colStr;
}

export function colLetterToIndex(colLetter: string): number {
  let index = 0;
  const upper = colLetter.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

// Convert 0-indexed grid coordinates (data row 0 is Excel row 2) to cell reference like "B2"
export function coordToCellRef(r: number, c: number): string {
  return `${colIndexToLetter(c)}${r + 2}`;
}

// Parse cell reference like "B2" or "$B$2" or "A1" (Row 1 is headers) into 0-indexed coordinates
// Returns r: -1 for header row (Row 1)
export function cellRefToCoord(ref: string): { r: number; c: number } | null {
  if (!ref) return null;
  const cleaned = ref.replace(/\$/g, '').trim();
  const match = cleaned.match(/^([A-Za-z]+)([0-9]+)$/);
  if (!match) return null;
  const colLetter = match[1];
  const rowNum = parseInt(match[2], 10);
  const c = colLetterToIndex(colLetter);
  const r = rowNum - 2; // Data row 0 is Excel row 2
  return { r, c };
}

// Expand range like "B2:B5" to array of coordinates
export function expandRange(rangeStr: string): { r: number; c: number }[] {
  if (!rangeStr) return [];
  const parts = rangeStr.trim().split(':');
  if (parts.length === 1) {
    const coord = cellRefToCoord(parts[0]);
    return coord && coord.r >= 0 ? [coord] : [];
  }
  const c1 = cellRefToCoord(parts[0]);
  const c2 = cellRefToCoord(parts[1]);
  if (!c1 || !c2) return [];
  
  const minR = Math.max(0, Math.min(c1.r, c2.r));
  const maxR = Math.max(c1.r, c2.r);
  const minC = Math.min(c1.c, c2.c);
  const maxC = Math.max(c1.c, c2.c);
  
  const result: { r: number; c: number }[] = [];
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      result.push({ r, c });
    }
  }
  return result;
}

// Extract cell references & ranges from formula string (for visual color highlighting)
export function extractReferencedCells(formula: string): string[] {
  if (!formula || typeof formula !== 'string' || !formula.startsWith('=')) return [];
  const matches = formula.match(/\b([A-Za-z]+[0-9]+(?::[A-Za-z]+[0-9]+)?)\b/g);
  return matches ? Array.from(new Set(matches)) : [];
}

// Check if a coordinate is within a reference (either single e.g. "B2" or range e.g. "B2:B5")
export function isCoordInReference(r: number, c: number, refString: string): boolean {
  if (!refString) return false;
  if (refString.includes(':')) {
    const coords = expandRange(refString);
    return coords.some(coord => coord.r === r && coord.c === c);
  }
  const single = cellRefToCoord(refString);
  return single !== null && single.r === r && single.c === c;
}

// Helper to safely fetch raw or calculated cell value
function getVal(r: number, c: number, grid: (string | number)[][], visited: Set<string>): any {
  if (!grid[r] || grid[r][c] === undefined) return '';
  const cell = grid[r][c];
  if (typeof cell === 'string' && cell.startsWith('=')) {
    return evaluateFormula(cell, grid, new Set(visited));
  }
  return cell;
}

// Helper to evaluate criteria match (e.g. ">=50", "ঢাকা", "<10", "Yes")
function testCriteria(val: any, criteriaStr: string): boolean {
  const cleanCrit = criteriaStr.replace(/^["']|["']$/g, '').trim();
  
  if (cleanCrit.startsWith('>=')) {
    const num = Number(cleanCrit.slice(2));
    return !isNaN(num) && Number(val) >= num;
  }
  if (cleanCrit.startsWith('<=')) {
    const num = Number(cleanCrit.slice(2));
    return !isNaN(num) && Number(val) <= num;
  }
  if (cleanCrit.startsWith('>')) {
    const num = Number(cleanCrit.slice(1));
    return !isNaN(num) && Number(val) > num;
  }
  if (cleanCrit.startsWith('<')) {
    const num = Number(cleanCrit.slice(1));
    return !isNaN(num) && Number(val) < num;
  }
  if (cleanCrit.startsWith('<>') || cleanCrit.startsWith('!=')) {
    const target = cleanCrit.slice(2);
    return String(val).toLowerCase() !== target.toLowerCase();
  }

  // Exact comparison
  const numVal = Number(val);
  const numCrit = Number(cleanCrit);
  if (!isNaN(numVal) && !isNaN(numCrit) && cleanCrit !== '') {
    return numVal === numCrit;
  }
  return String(val).toLowerCase() === cleanCrit.toLowerCase();
}

// Main Formula Evaluation Engine
export function evaluateFormula(
  expr: string | number,
  grid: (string | number)[][],
  visited = new Set<string>()
): string | number {
  if (typeof expr !== 'string' || !expr.startsWith('=')) {
    return expr;
  }

  if (visited.has(expr)) {
    return '#CYCLE!';
  }
  visited.add(expr);

  const raw = expr.substring(1).trim();

  try {
    // 1. TODAY()
    if (/^TODAY\s*\(\s*\)$/i.test(raw)) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    // 2. NOW()
    if (/^NOW\s*\(\s*\)$/i.test(raw)) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const mins = String(now.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${d} ${hours}:${mins} ${ampm}`;
    }

    // 3. YEAR, MONTH, DAY
    const ymdMatch = raw.match(/^(YEAR|MONTH|DAY)\s*\(([^)]+)\)$/i);
    if (ymdMatch) {
      const fn = ymdMatch[1].toUpperCase();
      let arg = ymdMatch[2].trim();
      const cr = cellRefToCoord(arg);
      if (cr && cr.r >= 0) {
        arg = String(getVal(cr.r, cr.c, grid, visited));
      }
      const dt = new Date(arg);
      if (isNaN(dt.getTime())) return '#VALUE!';
      if (fn === 'YEAR') return dt.getFullYear();
      if (fn === 'MONTH') return dt.getMonth() + 1;
      if (fn === 'DAY') return dt.getDate();
    }

    // 4. DATE(y, m, d)
    const dateMatch = raw.match(/^DATE\s*\(([^,]+),([^,]+),([^)]+)\)$/i);
    if (dateMatch) {
      const resolveArg = (arg: string) => {
        const cr = cellRefToCoord(arg.trim());
        return cr && cr.r >= 0 ? Number(getVal(cr.r, cr.c, grid, visited)) : Number(arg);
      };
      const y = resolveArg(dateMatch[1]);
      const m = resolveArg(dateMatch[2]);
      const d = resolveArg(dateMatch[3]);
      if (isNaN(y) || isNaN(m) || isNaN(d)) return '#VALUE!';
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    // 5. DATEDIF(d1, d2, "Y")
    const datedifMatch = raw.match(/^DATEDIF\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)$/i);
    if (datedifMatch) {
      const resolveDate = (arg: string) => {
        const cr = cellRefToCoord(arg.trim());
        const str = cr && cr.r >= 0 ? String(getVal(cr.r, cr.c, grid, visited)) : arg.replace(/["']/g, '');
        return new Date(str);
      };
      const dt1 = resolveDate(datedifMatch[1]);
      const dt2 = resolveDate(datedifMatch[2]);
      const unit = datedifMatch[3].trim().replace(/["']/g, '').toUpperCase();
      if (isNaN(dt1.getTime()) || isNaN(dt2.getTime())) return '#VALUE!';
      
      if (unit === 'Y') {
        let diff = dt2.getFullYear() - dt1.getFullYear();
        const mDiff = dt2.getMonth() - dt1.getMonth();
        if (mDiff < 0 || (mDiff === 0 && dt2.getDate() < dt1.getDate())) {
          diff--;
        }
        return Math.max(0, diff);
      }
      if (unit === 'M') {
        return Math.max(0, (dt2.getFullYear() - dt1.getFullYear()) * 12 + (dt2.getMonth() - dt1.getMonth()));
      }
      if (unit === 'D') {
        const diffTime = dt2.getTime() - dt1.getTime();
        return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      }
      return '#VALUE!';
    }

    // 6. NETWORKDAYS(d1, d2)
    const netwkMatch = raw.match(/^NETWORKDAYS\s*\(([^,]+),\s*([^)]+)\)$/i);
    if (netwkMatch) {
      const resolveDate = (arg: string) => {
        const cr = cellRefToCoord(arg.trim());
        const str = cr && cr.r >= 0 ? String(getVal(cr.r, cr.c, grid, visited)) : arg.replace(/["']/g, '');
        return new Date(str);
      };
      let d1 = resolveDate(netwkMatch[1]);
      let d2 = resolveDate(netwkMatch[2]);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return '#VALUE!';
      if (d1 > d2) { const temp = d1; d1 = d2; d2 = temp; }
      
      let workdays = 0;
      const cur = new Date(d1);
      while (cur <= d2) {
        const day = cur.getDay();
        // In BD context or standard weekend (Friday: 5, Saturday: 6 or Sun: 0)
        // Standard Excel is Sat(6) & Sun(0), in local note it mentions Friday/Saturday weekend
        if (day !== 5 && day !== 6) {
          workdays++;
        }
        cur.setDate(cur.getDate() + 1);
      }
      return workdays;
    }

    // 7. IFERROR(val, val_if_error)
    const iferrMatch = raw.match(/^IFERROR\s*\((.+),\s*([^)]+)\)$/i);
    if (iferrMatch) {
      try {
        const innerFormula = '=' + iferrMatch[1].trim();
        const res = evaluateFormula(innerFormula, grid, new Set(visited));
        const resStr = String(res);
        if (resStr.startsWith('#') || res === Infinity || res === -Infinity || (typeof res === 'number' && isNaN(res))) {
          return iferrMatch[2].trim().replace(/^["']|["']$/g, '');
        }
        return res;
      } catch {
        return iferrMatch[2].trim().replace(/^["']|["']$/g, '');
      }
    }

    // 7.1. ROUND(innerFormula, decimals)
    const roundMatch = raw.match(/^ROUND\s*\((.+),\s*([^)]+)\)$/i);
    if (roundMatch) {
      const innerFormula = '=' + roundMatch[1].trim();
      const res = evaluateFormula(innerFormula, grid, new Set(visited));
      const dec = parseInt(roundMatch[2].trim(), 10) || 0;
      const num = Number(res);
      if (!isNaN(num)) {
        const factor = Math.pow(10, dec);
        return Math.round(num * factor) / factor;
      }
      return res;
    }

    // 8. SUM(range)
    const sumMatch = raw.match(/^SUM\s*\(([^)]+)\)$/i);
    if (sumMatch) {
      const cells = expandRange(sumMatch[1]);
      let total = 0;
      cells.forEach(coord => {
        const v = Number(getVal(coord.r, coord.c, grid, visited));
        if (!isNaN(v)) total += v;
      });
      return Number(total.toFixed(2));
    }

    // 9. AVERAGE(range)
    const avgMatch = raw.match(/^AVERAGE\s*\(([^)]+)\)$/i);
    if (avgMatch) {
      const cells = expandRange(avgMatch[1]);
      let sum = 0;
      let count = 0;
      cells.forEach(coord => {
        const rawV = getVal(coord.r, coord.c, grid, visited);
        if (rawV !== '' && rawV !== null) {
          const v = Number(rawV);
          if (!isNaN(v)) {
            sum += v;
            count++;
          }
        }
      });
      return count > 0 ? Number((sum / count).toFixed(2)) : 0;
    }

    // 10. MIN / MAX / COUNT / COUNTA
    const simpleAgg = raw.match(/^(MIN|MAX|COUNT|COUNTA)\s*\(([^)]+)\)$/i);
    if (simpleAgg) {
      const type = simpleAgg[1].toUpperCase();
      const cells = expandRange(simpleAgg[2]);
      if (type === 'MIN') {
        let minVal = Infinity;
        cells.forEach(coord => {
          const rawV = getVal(coord.r, coord.c, grid, visited);
          if (rawV !== '' && !isNaN(Number(rawV))) {
            const v = Number(rawV);
            if (v < minVal) minVal = v;
          }
        });
        return minVal === Infinity ? 0 : minVal;
      }
      if (type === 'MAX') {
        let maxVal = -Infinity;
        cells.forEach(coord => {
          const rawV = getVal(coord.r, coord.c, grid, visited);
          if (rawV !== '' && !isNaN(Number(rawV))) {
            const v = Number(rawV);
            if (v > maxVal) maxVal = v;
          }
        });
        return maxVal === -Infinity ? 0 : maxVal;
      }
      if (type === 'COUNT') {
        let cnt = 0;
        cells.forEach(coord => {
          const v = getVal(coord.r, coord.c, grid, visited);
          if (v !== '' && v !== null && !isNaN(Number(v))) cnt++;
        });
        return cnt;
      }
      if (type === 'COUNTA') {
        let cnt = 0;
        cells.forEach(coord => {
          const v = getVal(coord.r, coord.c, grid, visited);
          if (v !== '' && v !== null && v !== undefined) cnt++;
        });
        return cnt;
      }
    }

    // 11. COUNTIF(range, criteria)
    const countifMatch = raw.match(/^COUNTIF\s*\(([^,]+),\s*([^)]+)\)$/i);
    if (countifMatch) {
      const cells = expandRange(countifMatch[1].trim());
      let criteria = countifMatch[2].trim();
      const critCr = cellRefToCoord(criteria);
      if (critCr && critCr.r >= 0 && !criteria.startsWith('"') && !criteria.startsWith("'")) {
        criteria = String(getVal(critCr.r, critCr.c, grid, visited));
      }
      let cnt = 0;
      cells.forEach(coord => {
        const v = getVal(coord.r, coord.c, grid, visited);
        if (testCriteria(v, criteria)) cnt++;
      });
      return cnt;
    }

    // 12. SUMIF(range, criteria, [sum_range])
    const sumifMatch = raw.match(/^SUMIF\s*\(([^,]+),\s*([^,]+)(?:,\s*([^)]+))?\)$/i);
    if (sumifMatch) {
      const critCells = expandRange(sumifMatch[1].trim());
      let criteria = sumifMatch[2].trim();
      const critCr = cellRefToCoord(criteria);
      if (critCr && critCr.r >= 0 && !criteria.startsWith('"') && !criteria.startsWith("'")) {
        criteria = String(getVal(critCr.r, critCr.c, grid, visited));
      }
      const sumCells = sumifMatch[3] ? expandRange(sumifMatch[3].trim()) : critCells;
      
      let sum = 0;
      for (let i = 0; i < critCells.length; i++) {
        const checkVal = getVal(critCells[i].r, critCells[i].c, grid, visited);
        if (testCriteria(checkVal, criteria)) {
          const sumTarget = sumCells[i] || critCells[i];
          const num = Number(getVal(sumTarget.r, sumTarget.c, grid, visited));
          if (!isNaN(num)) sum += num;
        }
      }
      return sum;
    }

    // 13. AVERAGEIF(range, criteria, [avg_range])
    const avgifMatch = raw.match(/^AVERAGEIF\s*\(([^,]+),\s*([^,]+)(?:,\s*([^)]+))?\)$/i);
    if (avgifMatch) {
      const critCells = expandRange(avgifMatch[1].trim());
      let criteria = avgifMatch[2].trim();
      const critCr = cellRefToCoord(criteria);
      if (critCr && critCr.r >= 0 && !criteria.startsWith('"') && !criteria.startsWith("'")) {
        criteria = String(getVal(critCr.r, critCr.c, grid, visited));
      }
      const avgCells = avgifMatch[3] ? expandRange(avgifMatch[3].trim()) : critCells;
      
      let sum = 0;
      let count = 0;
      for (let i = 0; i < critCells.length; i++) {
        const checkVal = getVal(critCells[i].r, critCells[i].c, grid, visited);
        if (testCriteria(checkVal, criteria)) {
          const target = avgCells[i] || critCells[i];
          const num = Number(getVal(target.r, target.c, grid, visited));
          if (!isNaN(num)) {
            sum += num;
            count++;
          }
        }
      }
      return count > 0 ? Number((sum / count).toFixed(2)) : 0;
    }

    // 14. SUMIFS, COUNTIFS, AVERAGEIFS
    const multiIfMatch = raw.match(/^(SUMIFS|COUNTIFS|AVERAGEIFS)\s*\((.+)\)$/i);
    if (multiIfMatch) {
      const fnName = multiIfMatch[1].toUpperCase();
      // Split parameters by commas outside of quotes
      const args: string[] = [];
      let current = '';
      let inQuote = false;
      const inner = multiIfMatch[2];
      for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];
        if (ch === '"') inQuote = !inQuote;
        if (ch === ',' && !inQuote) {
          args.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      if (current.trim()) args.push(current.trim());

      if (fnName === 'SUMIFS' || fnName === 'AVERAGEIFS') {
        const valRange = expandRange(args[0]);
        const critPairs: { range: { r: number; c: number }[]; crit: string }[] = [];
        for (let i = 1; i < args.length; i += 2) {
          if (args[i] && args[i + 1] !== undefined) {
            let critVal = args[i + 1].trim();
            const critCr = cellRefToCoord(critVal);
            if (critCr && critCr.r >= 0 && !critVal.startsWith('"') && !critVal.startsWith("'")) {
              critVal = String(getVal(critCr.r, critCr.c, grid, visited));
            }
            critPairs.push({
              range: expandRange(args[i]),
              crit: critVal
            });
          }
        }

        let sum = 0;
        let count = 0;
        for (let rIdx = 0; rIdx < valRange.length; rIdx++) {
          let allMatch = true;
          for (const pair of critPairs) {
            const checkCoord = pair.range[rIdx];
            if (!checkCoord) { allMatch = false; break; }
            const val = getVal(checkCoord.r, checkCoord.c, grid, visited);
            if (!testCriteria(val, pair.crit)) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) {
            const targetVal = Number(getVal(valRange[rIdx].r, valRange[rIdx].c, grid, visited));
            if (!isNaN(targetVal)) {
              sum += targetVal;
              count++;
            }
          }
        }
        if (fnName === 'SUMIFS') return sum;
        return count > 0 ? Number((sum / count).toFixed(2)) : 0;
      }

      if (fnName === 'COUNTIFS') {
        const critPairs: { range: { r: number; c: number }[]; crit: string }[] = [];
        for (let i = 0; i < args.length; i += 2) {
          if (args[i] && args[i + 1] !== undefined) {
            let critVal = args[i + 1].trim();
            const critCr = cellRefToCoord(critVal);
            if (critCr && critCr.r >= 0 && !critVal.startsWith('"') && !critVal.startsWith("'")) {
              critVal = String(getVal(critCr.r, critCr.c, grid, visited));
            }
            critPairs.push({
              range: expandRange(args[i]),
              crit: critVal
            });
          }
        }
        if (critPairs.length === 0) return 0;
        const totalRows = critPairs[0].range.length;
        let count = 0;
        for (let rIdx = 0; rIdx < totalRows; rIdx++) {
          let allMatch = true;
          for (const pair of critPairs) {
            const checkCoord = pair.range[rIdx];
            if (!checkCoord) { allMatch = false; break; }
            const val = getVal(checkCoord.r, checkCoord.c, grid, visited);
            if (!testCriteria(val, pair.crit)) {
              allMatch = false;
              break;
            }
          }
          if (allMatch) count++;
        }
        return count;
      }
    }

    // 15. IFS(cond1, val1, cond2, val2, ...)
    if (/^IFS\s*\(/i.test(raw)) {
      const inner = raw.substring(4, raw.length - 1);
      // Split top-level commas outside quotes
      const parts: string[] = [];
      let cur = '';
      let inQ = false;
      for (let i = 0; i < inner.length; i++) {
        const ch = inner[i];
        if (ch === '"') inQ = !inQ;
        if (ch === ',' && !inQ) {
          parts.push(cur.trim());
          cur = '';
        } else {
          cur += ch;
        }
      }
      if (cur.trim()) parts.push(cur.trim());

      for (let i = 0; i < parts.length; i += 2) {
        const condStr = parts[i];
        const valStr = parts[i + 1];
        if (!valStr) break;

        if (condStr.toUpperCase() === 'TRUE') {
          return valStr.replace(/^["']|["']$/g, '');
        }

        // Evaluate conditional expression
        const resolvedCond = condStr.replace(/\b([A-Za-z]+[0-9]+)\b/g, (m) => {
          const cr = cellRefToCoord(m);
          if (cr && cr.r >= 0) {
            const v = getVal(cr.r, cr.c, grid, visited);
            return typeof v === 'number' ? String(v) : JSON.stringify(v);
          }
          return m;
        });

        try {
          // eslint-disable-next-line no-eval
          if (eval(resolvedCond)) {
            return valStr.replace(/^["']|["']$/g, '');
          }
        } catch {
          // continue
        }
      }
      return '#N/A';
    }

    // 16. VLOOKUP(val, table, col, match)
    const vlkMatch = raw.match(/^VLOOKUP\s*\(([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*([^)]+))?\)$/i);
    if (vlkMatch) {
      let lookupVal = vlkMatch[1].trim();
      const lCoord = cellRefToCoord(lookupVal);
      if (lCoord && lCoord.r >= 0) {
        lookupVal = String(getVal(lCoord.r, lCoord.c, grid, visited));
      } else {
        lookupVal = lookupVal.replace(/^["']|["']$/g, '');
      }

      const tableRange = vlkMatch[2].trim().split(':');
      const start = cellRefToCoord(tableRange[0]);
      const end = cellRefToCoord(tableRange[1]);
      const colIdx = parseInt(vlkMatch[3].trim(), 10) - 1;

      if (start && end) {
        for (let r = start.r; r <= end.r; r++) {
          const keyVal = String(getVal(r, start.c, grid, visited)).toLowerCase();
          if (keyVal === lookupVal.toLowerCase()) {
            return getVal(r, start.c + colIdx, grid, visited);
          }
        }
      }
      return '#N/A';
    }

    // 17. XLOOKUP(val, lookup_arr, return_arr)
    const xlkMatch = raw.match(/^XLOOKUP\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)$/i);
    if (xlkMatch) {
      let lookupVal = xlkMatch[1].trim();
      const lCoord = cellRefToCoord(lookupVal);
      if (lCoord && lCoord.r >= 0) {
        lookupVal = String(getVal(lCoord.r, lCoord.c, grid, visited));
      } else {
        lookupVal = lookupVal.replace(/^["']|["']$/g, '');
      }

      const lookupCells = expandRange(xlkMatch[2].trim());
      const returnCells = expandRange(xlkMatch[3].trim());

      for (let i = 0; i < lookupCells.length; i++) {
        const k = String(getVal(lookupCells[i].r, lookupCells[i].c, grid, visited)).toLowerCase();
        if (k === lookupVal.toLowerCase()) {
          const retCoord = returnCells[i];
          if (retCoord) return getVal(retCoord.r, retCoord.c, grid, visited);
        }
      }
      return '#N/A';
    }

    // 18. General Expressions (IF, AND, OR, YEAR, TODAY, DATEDIF, PMT, FV, RATE, PV, NPER, Arithmetic, Concatenation)
    let jsExpr = raw
      .replace(/\bIF\s*\(/gi, 'EXCEL_IF(')
      .replace(/\bAND\s*\(/gi, 'EXCEL_AND(')
      .replace(/\bOR\s*\(/gi, 'EXCEL_OR(')
      .replace(/\bTODAY\s*\(\s*\)/gi, 'EXCEL_TODAY()')
      .replace(/\bNOW\s*\(\s*\)/gi, 'EXCEL_NOW()')
      .replace(/\bYEAR\s*\(/gi, 'EXCEL_YEAR(')
      .replace(/\bMONTH\s*\(/gi, 'EXCEL_MONTH(')
      .replace(/\bDAY\s*\(/gi, 'EXCEL_DAY(')
      .replace(/\bDATEDIF\s*\(/gi, 'EXCEL_DATEDIF(')
      .replace(/\bPMT\s*\(/gi, 'EXCEL_PMT(')
      .replace(/\bFV\s*\(/gi, 'EXCEL_FV(')
      .replace(/\bRATE\s*\(/gi, 'EXCEL_RATE(')
      .replace(/\bPV\s*\(/gi, 'EXCEL_PV(')
      .replace(/\bNPER\s*\(/gi, 'EXCEL_NPER(')
      .replace(/\bROUND\s*\(/gi, 'EXCEL_ROUND(');

    // Convert literal percentages like 11% or 10.75% to (11/100) or (10.75/100)
    jsExpr = jsExpr.replace(/([0-9]+(?:\.[0-9]+)?)\s*%/g, '($1/100)');

    // Convert Excel string concatenation & (not &&) to +
    jsExpr = jsExpr.replace(/(?<!&)&(?!&)/g, '+');

    // Convert Excel comparison operators (<> to !== and single = to ===)
    jsExpr = jsExpr.replace(/<>/g, '!==');
    jsExpr = jsExpr.replace(/(?<![<>!=:])=(?!=)/g, '===');

    // Replace cell references with their real values
    jsExpr = jsExpr.replace(/\b([A-Za-z]+[0-9]+)\b/g, (match) => {
      if (match.startsWith('EXCEL_')) return match;
      const cr = cellRefToCoord(match);
      if (cr && cr.r >= 0) {
        const v = getVal(cr.r, cr.c, grid, visited);
        if (typeof v === 'number') return String(v);
        if (typeof v === 'string') {
          const trimmed = v.trim();
          if (/^[0-9]+(\.[0-9]+)?%$/.test(trimmed)) {
            return String(parseFloat(trimmed) / 100);
          }
          if (!isNaN(Number(trimmed)) && trimmed !== '') return String(Number(trimmed));
        }
        return JSON.stringify(v);
      }
      return match;
    });

    // Helper functions for eval
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_IF = (cond: any, t: any, f: any) => (cond ? t : f);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_AND = (...args: any[]) => args.every(a => Boolean(a));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_OR = (...args: any[]) => args.some(a => Boolean(a));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_TODAY = () => new Date();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_NOW = () => new Date();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_YEAR = (d: any) => {
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? 0 : dt.getFullYear();
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_MONTH = (d: any) => {
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? 0 : dt.getMonth() + 1;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_DAY = (d: any) => {
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? 0 : dt.getDate();
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_DATEDIF = (d1: any, d2: any, unit: string) => {
      const dt1 = new Date(d1);
      const dt2 = new Date(d2);
      if (isNaN(dt1.getTime()) || isNaN(dt2.getTime())) return 0;
      const u = String(unit).toUpperCase();
      if (u === 'Y') {
        let diff = dt2.getFullYear() - dt1.getFullYear();
        const mDiff = dt2.getMonth() - dt1.getMonth();
        if (mDiff < 0 || (mDiff === 0 && dt2.getDate() < dt1.getDate())) diff--;
        return Math.max(0, diff);
      }
      if (u === 'M') {
        return Math.max(0, (dt2.getFullYear() - dt1.getFullYear()) * 12 + (dt2.getMonth() - dt1.getMonth()));
      }
      if (u === 'D') {
        return Math.max(0, Math.floor((dt2.getTime() - dt1.getTime()) / (1000 * 60 * 60 * 24)));
      }
      return 0;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_ROUND = (val: any, decimals: any = 0) => {
      const d = Number(decimals || 0);
      const factor = Math.pow(10, d);
      return Math.round(Number(val) * factor) / factor;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_PMT = (rate: any, nper: any, pv: any, fv: any = 0, type: any = 0) => {
      const r = Number(rate);
      const n = Number(nper);
      const p = Number(pv);
      const f = Number(fv || 0);
      const t = Number(type || 0);
      if (r === 0) return -(p + f) / n;
      const pvif = Math.pow(1 + r, n);
      return -(p * pvif + f) / ((1 + r * t) * (pvif - 1) / r);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_FV = (rate: any, nper: any, pmt: any, pv: any = 0, type: any = 0) => {
      const r = Number(rate);
      const n = Number(nper);
      const m = Number(pmt);
      const p = Number(pv || 0);
      const t = Number(type || 0);
      if (r === 0) return -(p + m * n);
      const pvif = Math.pow(1 + r, n);
      return -(p * pvif + m * (1 + r * t) * (pvif - 1) / r);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_PV = (rate: any, nper: any, pmt: any, fv: any = 0, type: any = 0) => {
      const r = Number(rate);
      const n = Number(nper);
      const m = Number(pmt);
      const f = Number(fv || 0);
      const t = Number(type || 0);
      if (r === 0) return -(f + m * n);
      const pvif = Math.pow(1 + r, n);
      return -(f + m * (1 + r * t) * (pvif - 1) / r) / pvif;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_NPER = (rate: any, pmt: any, pv: any, fv: any = 0, type: any = 0) => {
      const r = Number(rate);
      const m = Number(pmt);
      const p = Number(pv);
      const f = Number(fv || 0);
      const t = Number(type || 0);
      if (r === 0) return -(p + f) / m;
      const num = m * (1 + r * t) - f * r;
      const den = p * r + m * (1 + r * t);
      return Math.log(num / den) / Math.log(1 + r);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const EXCEL_RATE = (nper: any, pmt: any, pv: any, fv: any = 0, type: any = 0, guess: any = 0.05) => {
      const n = Number(nper);
      const m = Number(pmt);
      const p = Number(pv);
      const f = Number(fv || 0);
      const t = Number(type || 0);
      let rate = Number(guess || 0.05);
      const tol = 1e-8;
      const maxIter = 120;
      for (let i = 0; i < maxIter; i++) {
        let val: number, deriv: number;
        if (Math.abs(rate) < 1e-12) {
          val = p + m * n + f;
          deriv = m * n * (n - 1) / 2 + p * n;
        } else {
          const term = Math.pow(1 + rate, n);
          val = p * term + m * (1 + rate * t) * (term - 1) / rate + f;
          const delta = 1e-6;
          const termD = Math.pow(1 + rate + delta, n);
          const valD = p * termD + m * (1 + (rate + delta) * t) * (termD - 1) / (rate + delta) + f;
          deriv = (valD - val) / delta;
        }
        if (Math.abs(deriv) < 1e-15) break;
        const newRate = rate - val / deriv;
        if (Math.abs(newRate - rate) < tol) return newRate;
        rate = newRate;
      }
      return rate;
    };

    // eslint-disable-next-line no-eval
    const result = eval(jsExpr);
    if (typeof result === 'boolean') return result ? 'TRUE' : 'FALSE';
    if (typeof result === 'number') {
      return Number.isInteger(result) ? result : Number(result.toFixed(2));
    }
    return result;

  } catch {
    return '#ERROR!';
  }
}

// AutoFill adjustment helper
export function adjustFormulaForOffset(formula: string, rowOffset: number, colOffset: number): string {
  if (!formula.startsWith('=')) return formula;
  return formula.replace(/(\$?)([A-Za-z]{1,3})(\$?)([0-9]+)/g, (match, absCol, colLetter, absRow, rowNumStr) => {
    const origRow = parseInt(rowNumStr, 10);
    const origCol = colLetterToIndex(colLetter);
    if (origCol < 0 || isNaN(origRow)) return match;

    const newRow = absRow ? origRow : origRow + rowOffset;
    const newCol = absCol ? origCol : origCol + colOffset;
    if (newRow < 1 || newCol < 0) return match;
    return `${absCol}${colIndexToLetter(newCol)}${absRow}${newRow}`;
  });
}

// Update formula with selected cell reference or cell range
export function applyRangeToFormula(formula: string, newRangeStr: string): string {
  const trimmed = formula.trim();
  if (!trimmed.startsWith('=')) {
    return '=' + newRangeStr;
  }

  // 1. Function pattern with closing parenthesis: e.g. =SUM(B2:E2) or =COUNTIF(B2:E2, ">=80") or =IF(F2>=40, "পাস", "ফেল")
  const fnMatch = trimmed.match(/^=([A-Za-z0-9_]+)\s*\((.*)\)$/);
  if (fnMatch) {
    const fnName = fnMatch[1];
    const innerArgs = fnMatch[2].trim();
    if (innerArgs.includes(',')) {
      const firstComma = innerArgs.indexOf(',');
      const firstArg = innerArgs.slice(0, firstComma).trim();
      const rest = innerArgs.slice(firstComma);
      // If first arg has comparison like F2>=40
      const compMatch = firstArg.match(/^([A-Za-z]+[0-9]+)(.*)$/);
      if (compMatch && compMatch[2]) {
        return `=${fnName}(${newRangeStr}${compMatch[2]}${rest})`;
      }
      return `=${fnName}(${newRangeStr}${rest})`;
    } else {
      return `=${fnName}(${newRangeStr})`;
    }
  }

  // 2. Function pattern with open parenthesis: e.g. =SUM( or =AVERAGE(B2
  const openFnMatch = trimmed.match(/^=([A-Za-z0-9_]+)\s*\((.*)$/);
  if (openFnMatch) {
    const fnName = openFnMatch[1];
    const inner = openFnMatch[2].trim();
    if (inner.includes(',')) {
      const firstComma = inner.indexOf(',');
      const rest = inner.slice(firstComma);
      return `=${fnName}(${newRangeStr}${rest})`;
    } else {
      return `=${fnName}(${newRangeStr})`;
    }
  }

  // 3. Trailing operator or comma: e.g. =B2+, =B2-, =B2*, =B2/, =(
  if (/[\+\-\*\/\,\(]$/.test(trimmed)) {
    return trimmed + newRangeStr;
  }

  // 4. Arithmetic formula with starting cell reference: e.g. =C2*0.5 or =G2-F2
  const arithMatch = trimmed.match(/^=([A-Za-z]+[0-9]+)(\s*[\+\-\*\/].*)$/);
  if (arithMatch) {
    return `=${newRangeStr}${arithMatch[2]}`;
  }

  // 5. Bare '=':
  if (trimmed === '=') {
    return '=' + newRangeStr;
  }

  // 6. Existing single reference or range: e.g. =B2 or =B2:E2
  if (/^=([A-Za-z]+[0-9]+(?::[A-Za-z]+[0-9]+)?)$/i.test(trimmed)) {
    return `=${newRangeStr}`;
  }

  // Fallback
  return `=${newRangeStr}`;
}
