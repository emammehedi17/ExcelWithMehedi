import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Undo2,
  Redo2,
  Copy,
  Plus,
  RotateCcw,
  Code2,
  Check,
  X,
  Sparkles,
  Maximize2,
  Lock,
  Unlock,
  Cloud,
  LogIn
} from 'lucide-react';
import { FunctionItem } from '../types';
import {
  colIndexToLetter,
  coordToCellRef,
  cellRefToCoord,
  evaluateFormula,
  extractReferencedCells,
  isCoordInReference,
  adjustFormulaForOffset,
} from '../utils/excelEngine';
import { useAuth } from '../context/AuthContext';
import { loadUserSheet, saveUserSheet, resetUserSheet } from '../firebase';

interface ExcelSimulatorProps {
  data: FunctionItem;
}

export const ExcelSimulator: React.FC<ExcelSimulatorProps> = ({ data }) => {
  const { currentUser, openSignInPrompt } = useAuth();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle');
  const [isCustomLoaded, setIsCustomLoaded] = useState<boolean>(false);
  const [gridVersion, setGridVersion] = useState<number>(0);

  // Grid data state
  const [grid, setGrid] = useState<(string | number)[][]>(() =>
    JSON.parse(JSON.stringify(data.rows))
  );
  const [cols, setCols] = useState<string[]>(() =>
    JSON.parse(JSON.stringify(data.cols))
  );
  const [headers, setHeaders] = useState<string[]>(() =>
    JSON.parse(JSON.stringify(data.headers))
  );

  // Active cell & editing state
  const initialCoord = cellRefToCoord(data.activeCell) || { r: 0, c: 0 };
  const [activeCoord, setActiveCoord] = useState<{ r: number; c: number }>({
    r: Math.max(0, initialCoord.r),
    c: Math.max(0, initialCoord.c),
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');
  const [showFormulas, setShowFormulas] = useState<boolean>(false);

  // Undo / Redo history
  const [history, setHistory] = useState<string[]>(() => [
    JSON.stringify({
      grid: data.rows,
      cols: data.cols,
      headers: data.headers,
    }),
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AutoFill Drag State & Synchronous Ref
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartCoord, setDragStartCoord] = useState<{ r: number; c: number } | null>(null);
  const [dragTargetCoord, setDragTargetCoord] = useState<{ r: number; c: number } | null>(null);
  const autoFillDragRef = useRef<{
    isDragging: boolean;
    start: { r: number; c: number };
    target: { r: number; c: number };
  } | null>(null);
  const justFinishedAutoFillRef = useRef<boolean>(false);

  // Formula Range Selection & Drag State (when editing a formula with '=')
  const [isSelectingFormulaRange, setIsSelectingFormulaRange] = useState<boolean>(false);
  const [formulaRangeStart, setFormulaRangeStart] = useState<{ r: number; c: number } | null>(null);
  const [formulaRangeEnd, setFormulaRangeEnd] = useState<{ r: number; c: number } | null>(null);

  // Cursor Ribbon & Active Input Tracker
  const lastCursorPosRef = useRef<{ start: number; end: number; input: 'cell' | 'formula' }>({
    start: 0,
    end: 0,
    input: 'cell',
  });

  // Session for drag-selecting cell ranges without duplicate insertions
  const formulaInsertionSessionRef = useRef<{
    prefix: string;
    suffix: string;
    startCoord: { r: number; c: number };
  } | null>(null);

  // DOM Refs
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cellInputRef = useRef<HTMLInputElement>(null);
  const formulaInputRef = useRef<HTMLInputElement>(null);

  // Helper to record cursor ribbon position on input interaction
  const updateCursorPos = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement>, inputType: 'cell' | 'formula') => {
      const input = e.currentTarget;
      if (input) {
        const s = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        lastCursorPosRef.current = {
          start: s,
          end,
          input: inputType,
        };
      }
    },
    []
  );

  // Push new state into history
  const pushHistory = useCallback(
    (newGrid: (string | number)[][], newCols = cols, newHeaders = headers) => {
      const stateStr = JSON.stringify({
        grid: newGrid,
        cols: newCols,
        headers: newHeaders,
      });
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, stateStr];
      });
      setHistoryIndex((prev) => prev + 1);
      setGridVersion((v) => v + 1);
    },
    [cols, headers, historyIndex]
  );

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const state = JSON.parse(history[nextIndex]);
      setGrid(state.grid);
      setCols(state.cols);
      setHeaders(state.headers);
      setHistoryIndex(nextIndex);
      setGridVersion((v) => v + 1);
      setIsEditing(false);
      showToast('Undo সম্পন্ন হয়েছে');
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const state = JSON.parse(history[nextIndex]);
      setGrid(state.grid);
      setCols(state.cols);
      setHeaders(state.headers);
      setHistoryIndex(nextIndex);
      setGridVersion((v) => v + 1);
      setIsEditing(false);
      showToast('Redo সম্পন্ন হয়েছে');
    }
  }, [history, historyIndex]);

  // Initial load from Firestore if user is authenticated
  useEffect(() => {
    let isMounted = true;
    if (currentUser) {
      setSyncStatus('loading');
      loadUserSheet(currentUser.uid, data.id)
        .then((savedGrid) => {
          if (!isMounted) return;
          if (savedGrid && Array.isArray(savedGrid) && savedGrid.length > 0) {
            setGrid(savedGrid);
            setIsCustomLoaded(true);
            setHistory([
              JSON.stringify({
                grid: savedGrid,
                cols: data.cols,
                headers: data.headers,
              }),
            ]);
            setHistoryIndex(0);
            setSyncStatus('saved');
          } else {
            const fresh = JSON.parse(JSON.stringify(data.rows));
            setGrid(fresh);
            setIsCustomLoaded(false);
            setHistory([
              JSON.stringify({
                grid: fresh,
                cols: data.cols,
                headers: data.headers,
              }),
            ]);
            setHistoryIndex(0);
            setSyncStatus('idle');
          }
        })
        .catch((err) => {
          console.error('Error loading saved user sheet:', err);
          if (!isMounted) return;
          const fresh = JSON.parse(JSON.stringify(data.rows));
          setGrid(fresh);
          setSyncStatus('idle');
        });
    } else {
      const fresh = JSON.parse(JSON.stringify(data.rows));
      setGrid(fresh);
      setIsCustomLoaded(false);
      setHistory([
        JSON.stringify({
          grid: fresh,
          cols: data.cols,
          headers: data.headers,
        }),
      ]);
      setHistoryIndex(0);
      setSyncStatus('idle');
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser, data.id, data.rows, data.cols, data.headers]);

  // Debounced auto-save to Firestore when user edits grid
  useEffect(() => {
    if (!currentUser || gridVersion === 0) return;
    setSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await saveUserSheet(currentUser.uid, data.id, grid);
        setSyncStatus('saved');
        setIsCustomLoaded(true);
      } catch (err) {
        console.error('Save to firebase error:', err);
        setSyncStatus('error');
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [grid, gridVersion, currentUser, data.id]);

  // Reset to initial template state & clear user's custom sheet in Firestore
  const handleReset = () => {
    handleResetToDefault();
  };

  const handleResetToDefault = async () => {
    const freshGrid = JSON.parse(JSON.stringify(data.rows));
    const freshCols = JSON.parse(JSON.stringify(data.cols));
    const freshHeaders = JSON.parse(JSON.stringify(data.headers));
    setGrid(freshGrid);
    setCols(freshCols);
    setHeaders(freshHeaders);
    setIsEditing(false);
    const initC = cellRefToCoord(data.activeCell) || { r: 0, c: 0 };
    setActiveCoord({ r: Math.max(0, initC.r), c: Math.max(0, initC.c) });
    setHistory([
      JSON.stringify({
        grid: freshGrid,
        cols: freshCols,
        headers: freshHeaders,
      }),
    ]);
    setHistoryIndex(0);
    setIsCustomLoaded(false);
    if (currentUser) {
      setSyncStatus('saving');
      try {
        await resetUserSheet(currentUser.uid, data.id);
        setSyncStatus('idle');
        showToast('ডিফল্ট টেমপ্লেটে ফিরিয়ে আনা হয়েছে ও ক্লাউড ডাটা রিসেট হয়েছে');
      } catch (err) {
        console.error(err);
        setSyncStatus('error');
      }
    } else {
      showToast('শিটটি প্রাথমিক অবস্থায় রিসেট করা হয়েছে');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Get current active raw cell value
  const getRawCellValue = useCallback(
    (r: number, c: number): string => {
      if (grid[r] && grid[r][c] !== undefined) {
        return String(grid[r][c]);
      }
      return '';
    },
    [grid]
  );

  // Start editing cell
  const startEditing = useCallback(
    (r: number, c: number, initialChar?: string) => {
      if (!currentUser) {
        openSignInPrompt();
        return;
      }
      setActiveCoord({ r, c });
      setIsEditing(true);
      setFormulaRangeStart(null);
      setFormulaRangeEnd(null);
      setIsSelectingFormulaRange(false);
      formulaInsertionSessionRef.current = null;
      const val = initialChar !== undefined ? initialChar : getRawCellValue(r, c);
      setEditValue(val);
      lastCursorPosRef.current = {
        start: val.length,
        end: val.length,
        input: 'cell',
      };
      setTimeout(() => {
        if (cellInputRef.current) {
          cellInputRef.current.focus();
          if (initialChar === undefined) {
            cellInputRef.current.setSelectionRange(val.length, val.length);
          }
        }
      }, 20);
    },
    [getRawCellValue]
  );

  // Commit editing changes
  const commitEdit = useCallback(
    (direction?: 'down' | 'up' | 'right' | 'left' | 'none') => {
      const { r, c } = activeCoord;
      const trimmed = editValue.trim();
      let finalVal: string | number = trimmed;
      if (!trimmed.startsWith('=') && !isNaN(Number(trimmed)) && trimmed !== '') {
        finalVal = Number(trimmed);
      }

      const currentVal = grid[r]?.[c];
      if (finalVal !== currentVal) {
        const newGrid = grid.map((rowArr, rowIdx) => {
          if (rowIdx !== r) return rowArr;
          const newRow = [...rowArr];
          newRow[c] = finalVal;
          return newRow;
        });
        setGrid(newGrid);
        pushHistory(newGrid);
      }

      setIsEditing(false);
      setFormulaRangeStart(null);
      setFormulaRangeEnd(null);
      setIsSelectingFormulaRange(false);
      formulaInsertionSessionRef.current = null;

      // Move active coordinate based on navigation key
      if (direction === 'down' && r < grid.length - 1) {
        setActiveCoord({ r: r + 1, c });
      } else if (direction === 'up' && r > 0) {
        setActiveCoord({ r: r - 1, c });
      } else if (direction === 'right' && c < cols.length - 1) {
        setActiveCoord({ r, c: c + 1 });
      } else if (direction === 'left' && c > 0) {
        setActiveCoord({ r, c: c - 1 });
      }
    },
    [activeCoord, editValue, grid, cols.length, pushHistory]
  );

  // Cancel edit
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setFormulaRangeStart(null);
    setFormulaRangeEnd(null);
    setIsSelectingFormulaRange(false);
    formulaInsertionSessionRef.current = null;
    setEditValue(getRawCellValue(activeCoord.r, activeCoord.c));
  }, [activeCoord, getRawCellValue]);

  // Handle cell mouse down (selection or formula range drag)
  const handleCellMouseDown = (e: React.MouseEvent, r: number, c: number) => {
    const isEditingFormula = isEditing && editValue.trim().startsWith('=');
    if (isEditingFormula) {
      if (activeCoord.r === r && activeCoord.c === c) {
        // User clicked inside current formula cell: let normal text / cursor selection happen
        return;
      }
      // Clicked on another cell to insert reference or drag a range into the formula
      e.preventDefault();
      e.stopPropagation();

      // Determine insertion point at cursor ribbon without deleting previous text
      const currentVal = editValue;
      let s = lastCursorPosRef.current.start;
      let end = lastCursorPosRef.current.end;

      if (typeof s !== 'number' || s < 0 || s > currentVal.length) {
        s = currentVal.length;
      }
      if (typeof end !== 'number' || end < s || end > currentVal.length) {
        end = s;
      }

      // Preserve previous text before cursor and any text after cursor
      const prefix = currentVal.slice(0, s);
      const suffix = currentVal.slice(end);
      const ref = coordToCellRef(r, c);

      // Save insertion session for smooth drag selection
      formulaInsertionSessionRef.current = {
        prefix,
        suffix,
        startCoord: { r, c },
      };

      setIsSelectingFormulaRange(true);
      setFormulaRangeStart({ r, c });
      setFormulaRangeEnd({ r, c });

      const newVal = prefix + ref + suffix;
      setEditValue(newVal);

      const nextCaretPos = prefix.length + ref.length;
      lastCursorPosRef.current = {
        start: nextCaretPos,
        end: nextCaretPos,
        input: lastCursorPosRef.current.input,
      };
    }
  };

  // Handle cell mouse enter (AutoFill drag OR formula range drag)
  const handleCellMouseEnter = (r: number, c: number) => {
    // 1. AutoFill Drag
    if (autoFillDragRef.current?.isDragging) {
      updateAutoFillTarget(r, c);
      return;
    }

    // 2. Range drag while editing formula
    if (isSelectingFormulaRange && formulaInsertionSessionRef.current) {
      setFormulaRangeEnd({ r, c });
      const { prefix, suffix, startCoord } = formulaInsertionSessionRef.current;
      const minR = Math.min(startCoord.r, r);
      const maxR = Math.max(startCoord.r, r);
      const minC = Math.min(startCoord.c, c);
      const maxC = Math.max(startCoord.c, c);
      const rangeStr =
        minR === maxR && minC === maxC
          ? coordToCellRef(minR, minC)
          : `${coordToCellRef(minR, minC)}:${coordToCellRef(maxR, maxC)}`;

      const newVal = prefix + rangeStr + suffix;
      setEditValue(newVal);

      const nextCaretPos = prefix.length + rangeStr.length;
      lastCursorPosRef.current = {
        start: nextCaretPos,
        end: nextCaretPos,
        input: lastCursorPosRef.current.input,
      };
    }
  };

  // Handle cell click (select)
  const handleCellClick = (r: number, c: number) => {
    if (justFinishedAutoFillRef.current) {
      return;
    }
    const isEditingFormula = isEditing && editValue.trim().startsWith('=');
    if (isEditingFormula) {
      // In formula edit mode, cell referencing was already handled by handleCellMouseDown
      return;
    }
    if (isEditing) {
      if (activeCoord.r === r && activeCoord.c === c) {
        // User clicked in current cell being edited: DO NOT EXIT EDIT MODE!
        return;
      }
      commitEdit('none');
    }
    setActiveCoord({ r, c });
  };

  // Handle cell double click (enter in-place edit)
  const handleCellDoubleClick = (r: number, c: number) => {
    startEditing(r, c);
  };

  // Copy cell content to clipboard
  const copyActiveCell = useCallback(() => {
    const rawVal = getRawCellValue(activeCoord.r, activeCoord.c);
    navigator.clipboard.writeText(rawVal);
    showToast(`কপি হয়েছে: "${rawVal}"`);
  }, [activeCoord, getRawCellValue]);

  // Paste into active cell
  const pasteIntoActiveCell = useCallback(async () => {
    if (!currentUser) {
      openSignInPrompt();
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (text !== undefined) {
        const trimmed = text.trim();
        let finalVal: string | number = trimmed;
        if (!trimmed.startsWith('=') && !isNaN(Number(trimmed)) && trimmed !== '') {
          finalVal = Number(trimmed);
        }
        const { r, c } = activeCoord;
        const newGrid = grid.map((rowArr, rowIdx) => {
          if (rowIdx !== r) return rowArr;
          const newRow = [...rowArr];
          newRow[c] = finalVal;
          return newRow;
        });
        setGrid(newGrid);
        pushHistory(newGrid);
        showToast('পেস্ট সম্পন্ন হয়েছে');
      }
    } catch {
      showToast('ক্লিপবোর্ড অ্যাক্সেস করা যায়নি');
    }
  }, [activeCoord, grid, pushHistory, currentUser, openSignInPrompt]);

  // Delete / Clear active cell
  const deleteActiveCell = useCallback(() => {
    if (!currentUser) {
      openSignInPrompt();
      return;
    }
    const { r, c } = activeCoord;
    if (grid[r]?.[c] === '' || grid[r]?.[c] === undefined) return;
    const newGrid = grid.map((rowArr, rowIdx) => {
      if (rowIdx !== r) return rowArr;
      const newRow = [...rowArr];
      newRow[c] = '';
      return newRow;
    });
    setGrid(newGrid);
    pushHistory(newGrid);
    showToast('সেল ক্লিয়ার করা হয়েছে');
  }, [activeCoord, grid, pushHistory, currentUser, openSignInPrompt]);

  // Global & cell keydown handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Shortcuts when editing
      if (isEditing) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitEdit(e.shiftKey ? 'up' : 'down');
        } else if (e.key === 'Tab') {
          e.preventDefault();
          commitEdit(e.shiftKey ? 'left' : 'right');
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelEdit();
        }
        return;
      }

      // Shortcuts when selecting
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          return;
        }
        if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          handleRedo();
          return;
        }
        if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          copyActiveCell();
          return;
        }
        if (e.key.toLowerCase() === 'v') {
          e.preventDefault();
          if (!currentUser) {
            openSignInPrompt();
            return;
          }
          pasteIntoActiveCell();
          return;
        }
      }

      if (e.key === 'F2') {
        e.preventDefault();
        if (!currentUser) {
          openSignInPrompt();
          return;
        }
        startEditing(activeCoord.r, activeCoord.c);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          if (activeCoord.r > 0) setActiveCoord((prev) => ({ ...prev, r: prev.r - 1 }));
        } else {
          if (activeCoord.r < grid.length - 1) setActiveCoord((prev) => ({ ...prev, r: prev.r + 1 }));
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          if (activeCoord.c > 0) setActiveCoord((prev) => ({ ...prev, c: prev.c - 1 }));
        } else {
          if (activeCoord.c < cols.length - 1) setActiveCoord((prev) => ({ ...prev, c: prev.c + 1 }));
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeCoord.r > 0) setActiveCoord((prev) => ({ ...prev, r: prev.r - 1 }));
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeCoord.r < grid.length - 1) setActiveCoord((prev) => ({ ...prev, r: prev.r + 1 }));
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeCoord.c > 0) setActiveCoord((prev) => ({ ...prev, c: prev.c - 1 }));
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (activeCoord.c < cols.length - 1) setActiveCoord((prev) => ({ ...prev, c: prev.c + 1 }));
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (!currentUser) {
          openSignInPrompt();
          return;
        }
        deleteActiveCell();
        return;
      }

      // Typing any printable character starts editing
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (!currentUser) {
          e.preventDefault();
          openSignInPrompt();
          return;
        }
        startEditing(activeCoord.r, activeCoord.c, e.key);
      }
    },
    [
      isEditing,
      commitEdit,
      cancelEdit,
      handleUndo,
      handleRedo,
      copyActiveCell,
      pasteIntoActiveCell,
      startEditing,
      activeCoord,
      grid.length,
      cols.length,
      deleteActiveCell,
      currentUser,
      openSignInPrompt,
    ]
  );

  // Synchronize formula bar with active cell
  useEffect(() => {
    if (!isEditing) {
      const val = getRawCellValue(activeCoord.r, activeCoord.c);
      setEditValue(val);
    }
  }, [activeCoord, isEditing, getRawCellValue]);

  // Copy whole table to clipboard as TSV and HTML
  const copyWholeTable = () => {
    let tsv = headers.join('\t') + '\n';
    grid.forEach((row) => {
      const evaluatedRow = row.map((cell) => evaluateFormula(cell, grid));
      tsv += evaluatedRow.join('\t') + '\n';
    });

    let html = '<table border="1"><thead><tr>';
    headers.forEach((h) => (html += `<th>${h}</th>`));
    html += '</tr></thead><tbody>';
    grid.forEach((row) => {
      html += '<tr>';
      row.forEach((cell) => {
        const val = evaluateFormula(cell, grid);
        html += `<td>${val}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';

    const item = new ClipboardItem({
      'text/plain': new Blob([tsv], { type: 'text/plain' }),
      'text/html': new Blob([html], { type: 'text/html' }),
    });

    navigator.clipboard.write([item]).then(
      () => showToast('✓ সম্পূর্ণ টেবিল কপি হয়েছে (Excel-এ পেস্ট করতে পারবেন)'),
      () => showToast('কপি ব্যর্থ হয়েছে')
    );
  };

  // Add row
  const handleAddRow = (insertIndex: number) => {
    if (!currentUser) {
      openSignInPrompt();
      return;
    }
    const emptyRow = Array(cols.length).fill('');
    const newGrid = [...grid];
    newGrid.splice(insertIndex + 1, 0, emptyRow);
    setGrid(newGrid);
    pushHistory(newGrid);
    showToast(`সারি ${insertIndex + 3} যুক্ত হয়েছে`);
  };

  // Add column
  const handleAddCol = (insertIndex: number) => {
    if (!currentUser) {
      openSignInPrompt();
      return;
    }
    const nextLetter = colIndexToLetter(cols.length);
    const newCols = [...cols, nextLetter];
    const newHeaders = [...headers];
    newHeaders.splice(insertIndex + 1, 0, 'New Col');
    const newGrid = grid.map((row) => {
      const r = [...row];
      r.splice(insertIndex + 1, 0, '');
      return r;
    });
    setCols(newCols);
    setHeaders(newHeaders);
    setGrid(newGrid);
    pushHistory(newGrid, newCols, newHeaders);
    showToast(`কলাম ${nextLetter} যুক্ত হয়েছে`);
  };

  // AutoFill Mouse Event Handlers
  const handleAutoFillMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      openSignInPrompt();
      return;
    }
    autoFillDragRef.current = {
      isDragging: true,
      start: { r: activeCoord.r, c: activeCoord.c },
      target: { r: activeCoord.r, c: activeCoord.c },
    };
    setIsDragging(true);
    setDragStartCoord({ ...activeCoord });
    setDragTargetCoord({ ...activeCoord });
  };

  // Update AutoFill target coordinate, locking to row or column like Excel
  const updateAutoFillTarget = useCallback(
    (targetR: number, targetC: number) => {
      const drag = autoFillDragRef.current;
      if (!drag || !drag.isDragging) return;

      const sr = drag.start.r;
      const sc = drag.start.c;

      let finalR = sr;
      let finalC = sc;
      const rowDiff = Math.abs(targetR - sr);
      const colDiff = Math.abs(targetC - sc);

      if (rowDiff >= colDiff) {
        finalR = targetR;
        finalC = sc;
      } else {
        finalR = sr;
        finalC = targetC;
      }

      finalR = Math.max(0, Math.min(grid.length - 1, finalR));
      finalC = Math.max(0, Math.min(cols.length - 1, finalC));

      drag.target = { r: finalR, c: finalC };
      setDragTargetCoord({ r: finalR, c: finalC });
    },
    [grid.length, cols.length]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!autoFillDragRef.current?.isDragging) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const td = el?.closest('td[data-row]');
      if (td) {
        const r = parseInt(td.getAttribute('data-row') || '0', 10);
        const c = parseInt(td.getAttribute('data-col') || '0', 10);
        updateAutoFillTarget(r, c);
      }
    },
    [updateAutoFillTarget]
  );

  const executeAutoFill = useCallback(
    (sr: number, sc: number, er: number, ec: number) => {
      const baseVal = getRawCellValue(sr, sc);
      const newGrid = grid.map((rArr) => [...rArr]);

      const minR = Math.min(sr, er);
      const maxR = Math.max(sr, er);
      const minC = Math.min(sc, ec);
      const maxC = Math.max(sc, ec);

      // Analyze base value pattern
      const isFormula = typeof baseVal === 'string' && baseVal.startsWith('=');
      const isNum = !isNaN(Number(baseVal)) && baseVal !== '' && typeof baseVal !== 'boolean';
      let strPrefix = '';
      let strNum = 0;
      let zeroPadLength = 0;

      if (!isFormula && !isNum && typeof baseVal === 'string') {
        const match = baseVal.match(/^(.*?)(\d+)$/);
        if (match) {
          strPrefix = match[1];
          strNum = parseInt(match[2], 10);
          zeroPadLength = match[2].length;
        }
      }

      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          if (r === sr && c === sc) continue;
          const rOffset = r - sr;
          const cOffset = c - sc;
          const stepOffset = rOffset !== 0 ? rOffset : cOffset;

          let filledVal: string | number = baseVal;
          if (isFormula) {
            filledVal = adjustFormulaForOffset(baseVal, rOffset, cOffset);
          } else if (isNum) {
            filledVal = Number(baseVal) + stepOffset;
          } else if (strPrefix !== '') {
            const nextNum = strNum + stepOffset;
            const padded = String(nextNum).padStart(zeroPadLength, '0');
            filledVal = `${strPrefix}${padded}`;
          }

          if (newGrid[r]) {
            newGrid[r][c] = filledVal;
          }
        }
      }

      setGrid(newGrid);
      pushHistory(newGrid);
      setActiveCoord({ r: er, c: ec });
      showToast('অটোফিল (AutoFill) সফলভাবে সম্পন্ন হয়েছে');
    },
    [getRawCellValue, grid, pushHistory]
  );

  const handleMouseUp = useCallback(() => {
    const drag = autoFillDragRef.current;
    if (!drag || !drag.isDragging) {
      setIsDragging(false);
      setDragStartCoord(null);
      setDragTargetCoord(null);
      return;
    }

    const { start, target } = drag;
    autoFillDragRef.current = null;
    setIsDragging(false);
    setDragStartCoord(null);
    setDragTargetCoord(null);

    justFinishedAutoFillRef.current = true;
    setTimeout(() => {
      justFinishedAutoFillRef.current = false;
    }, 150);

    if (start.r !== target.r || start.c !== target.c) {
      executeAutoFill(start.r, start.c, target.r, target.c);
    }
  }, [executeAutoFill]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Window mouseup listener when dragging formula range
  useEffect(() => {
    if (isSelectingFormulaRange) {
      const handleGlobalFormulaMouseUp = () => {
        setIsSelectingFormulaRange(false);
        setFormulaRangeStart(null);
        setFormulaRangeEnd(null);
        formulaInsertionSessionRef.current = null;
        const targetInput =
          lastCursorPosRef.current.input === 'formula'
            ? formulaInputRef.current
            : cellInputRef.current;
        if (targetInput) {
          targetInput.focus();
          const pos = lastCursorPosRef.current.start;
          try {
            targetInput.setSelectionRange(pos, pos);
          } catch (_) {}
        }
      };

      window.addEventListener('mouseup', handleGlobalFormulaMouseUp);
      return () => {
        window.removeEventListener('mouseup', handleGlobalFormulaMouseUp);
      };
    }
  }, [isSelectingFormulaRange]);

  // Active referenced cells for visual color feedback in formula editing mode
  const activeFormulaReferences = useMemo(() => {
    if (isEditing && editValue.trim().startsWith('=')) {
      return extractReferencedCells(editValue);
    }
    return [];
  }, [isEditing, editValue]);

  // Active cell reference string
  const activeCellRef = coordToCellRef(activeCoord.r, activeCoord.c);

  // Check if cell is in drag selection preview
  const isCellInDragPreview = (r: number, c: number) => {
    if (!isDragging || !dragStartCoord || !dragTargetCoord) return false;
    const minR = Math.min(dragStartCoord.r, dragTargetCoord.r);
    const maxR = Math.max(dragStartCoord.r, dragTargetCoord.r);
    const minC = Math.min(dragStartCoord.c, dragTargetCoord.c);
    const maxC = Math.max(dragStartCoord.c, dragTargetCoord.c);
    return r >= minR && r <= maxR && c >= minC && c <= maxC;
  };

  // Check if cell is in active formula range selection
  const isCellInFormulaRange = (r: number, c: number) => {
    if (!formulaRangeStart || !formulaRangeEnd) return false;
    const minR = Math.min(formulaRangeStart.r, formulaRangeEnd.r);
    const maxR = Math.max(formulaRangeStart.r, formulaRangeEnd.r);
    const minC = Math.min(formulaRangeStart.c, formulaRangeEnd.c);
    const maxC = Math.max(formulaRangeStart.c, formulaRangeEnd.c);
    return r >= minR && r <= maxR && c >= minC && c <= maxC;
  };

  return (
    <div
      ref={gridContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="excel-window bg-white border border-slate-300 rounded-lg overflow-hidden shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-shadow"
    >
      {/* 1. Green Excel Title Bar */}
      <div className="bg-[#107c41] text-white h-8 px-3 flex items-center justify-between select-none text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white text-[#107c41] font-black rounded-xs flex items-center justify-center text-[10px] font-sans">
            X
          </div>
          <span className="font-semibold tracking-wide">Excel Master</span>
          <span className="text-emerald-200">|</span>
          <span className="text-emerald-100 truncate max-w-xs">{data.name}</span>
        </div>

        {/* Quick Access Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
            className={`p-1 rounded hover:bg-white/20 transition-colors ${
              historyIndex <= 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
            className={`p-1 rounded hover:bg-white/20 transition-colors ${
              historyIndex >= history.length - 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="প্রাথমিক অবস্থায় রিসেট করুন"
            className="p-1 rounded hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="h-3 w-px bg-white/30 mx-1" />
          <div className="flex gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-300/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-300/80 inline-block" />
          </div>
        </div>
      </div>

      {/* 2. Ribbon Tabs & Toolbar */}
      <div className="bg-slate-100 border-b border-slate-200 select-none text-xs">
        <div className="flex border-b border-slate-200 px-2 pt-1 gap-1">
          <span className="bg-[#107c41] text-white px-3 py-1 font-bold rounded-t-sm">
            FILE
          </span>
          <span className="bg-white text-slate-800 border-t border-x border-slate-200 px-3 py-1 font-semibold rounded-t-sm">
            HOME
          </span>
          <span className="text-slate-600 px-3 py-1 hover:bg-slate-200/60 rounded-t-sm cursor-pointer">
            FORMULAS
          </span>
          <span className="text-slate-600 px-3 py-1 hover:bg-slate-200/60 rounded-t-sm cursor-pointer">
            DATA
          </span>
        </div>

        {/* Home Toolbar */}
        <div className="flex flex-wrap items-center justify-between p-2 bg-white gap-2 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Table Button */}
            <button
              onClick={copyWholeTable}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded transition-colors shadow-2xs cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-700" />
              <span>Copy Table (Excel/Sheets)</span>
            </button>

            {/* Toggle Show Formulas */}
            <button
              onClick={() => setShowFormulas((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
                showFormulas
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="সম্পূর্ণ শিটের সূত্র দেখতে টগল করুন"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showFormulas ? 'Showing Formulas (=)' : 'Show Formulas'}</span>
            </button>

            {/* Quick Actions */}
            <div className="h-4 w-px bg-slate-200" />
            <button
              onClick={() => handleAddRow(activeCoord.r)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
              title="নতুন সারি যুক্ত করুন"
            >
              <Plus className="w-3 h-3" />
              <span>Add Row</span>
            </button>
            <button
              onClick={() => handleAddCol(activeCoord.c)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
              title="নতুন কলাম যুক্ত করুন"
            >
              <Plus className="w-3 h-3" />
              <span>Add Col</span>
            </button>
          </div>

          {/* Auth Status & Cloud Sync Badge */}
          <div className="flex items-center gap-2">
            {!currentUser ? (
              <button
                onClick={openSignInPrompt}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded text-xs transition-colors cursor-pointer"
                title="ডাটা এডিট ও নিজের অ্যাকাউন্টে সেভ করতে সাইন-ইন করুন"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-medium">রিড-অনলি মোড • </span>
                <span className="font-bold underline text-emerald-800">গুগল দিয়ে সাইন-ইন</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs">
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-900">এডিটিং সক্রিয়</span>

                {syncStatus === 'saving' && (
                  <span className="flex items-center gap-1 text-slate-500 font-normal">
                    <Cloud className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                    <span>সেভ হচ্ছে...</span>
                  </span>
                )}
                {syncStatus === 'saved' && (
                  <span className="flex items-center gap-1 text-emerald-700 font-normal">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ক্লাউডে সংরক্ষিত</span>
                  </span>
                )}
                {syncStatus === 'loading' && (
                  <span className="text-slate-500 font-normal">লোড হচ্ছে...</span>
                )}
                {isCustomLoaded && (
                  <button
                    onClick={handleResetToDefault}
                    className="text-[11px] text-slate-500 hover:text-rose-600 underline cursor-pointer ml-1"
                    title="কাস্টম পরিবর্তন মুছে মূল টেমপ্লেটে ফিরিয়ে আনুন"
                  >
                    (ডিফল্টে রিসেট)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Formula Bar Area */}
      <div className="flex items-center h-8 bg-white border-b border-slate-200 px-2 gap-2 text-xs">
        {/* Name Box */}
        <div className="w-16 h-6 border border-slate-300 bg-slate-50 font-mono font-bold text-slate-800 flex items-center justify-center rounded-xs shadow-2xs">
          {activeCellRef}
        </div>

        {/* Function Action Icons */}
        <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
          {isEditing ? (
            <>
              <button
                onClick={cancelEdit}
                className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                title="Cancel Edit (Escape)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => commitEdit('none')}
                className="p-1 hover:bg-emerald-50 text-emerald-600 rounded"
                title="Commit Edit (Enter)"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <span className="font-serif italic font-bold text-slate-500 px-1 text-sm">
              fx
            </span>
          )}
        </div>

        {/* Formula Input Box */}
        <input
          ref={formulaInputRef}
          type="text"
          value={editValue}
          readOnly={!currentUser}
          onChange={(e) => {
            if (!currentUser) {
              openSignInPrompt();
              return;
            }
            setEditValue(e.target.value);
            if (!isEditing) setIsEditing(true);
            updateCursorPos(e, 'formula');
          }}
          onSelect={(e) => updateCursorPos(e, 'formula')}
          onKeyUp={(e) => updateCursorPos(e, 'formula')}
          onClick={(e) => {
            e.stopPropagation();
            if (!currentUser) {
              openSignInPrompt();
              return;
            }
            updateCursorPos(e, 'formula');
          }}
          onMouseDown={(e) => {
            if (!currentUser) {
              e.preventDefault();
              openSignInPrompt();
              return;
            }
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            updateCursorPos(e, 'formula');
          }}
          onFocus={(e) => {
            if (!currentUser) {
              e.currentTarget.blur();
              openSignInPrompt();
              return;
            }
            if (!isEditing) {
              setIsEditing(true);
              setEditValue(getRawCellValue(activeCoord.r, activeCoord.c));
            }
            updateCursorPos(e, 'formula');
          }}
          onKeyDown={(e) => {
            if (!currentUser) {
              e.preventDefault();
              openSignInPrompt();
              return;
            }
            if (e.key === 'Enter') {
              e.preventDefault();
              commitEdit('down');
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancelEdit();
            }
          }}
          placeholder={
            !currentUser
              ? 'এডিট করতে প্রথমে গুগল দিয়ে সাইন-ইন করুন (রিড-অনলি মোড)'
              : 'সূত্রের মান লিখুন (যেমন: =SUM(B2:E2))'
          }
          className={`flex-1 h-7 px-2 font-mono text-sm font-semibold border rounded-xs outline-none transition-colors ${
            !currentUser
              ? 'bg-slate-100/60 text-slate-500 cursor-pointer border-slate-200 hover:border-amber-400'
              : 'text-slate-900 border-transparent focus:border-emerald-600 focus:bg-emerald-50/20'
          }`}
        />
      </div>

      {/* 4. Interactive Spreadsheet Table Canvas */}
      <div className="relative overflow-x-auto max-h-[460px] bg-slate-50 select-none">
        <table className="w-full min-w-[620px] border-collapse table-fixed text-xs font-sans">
          {/* Column Header (A, B, C...) */}
          <thead>
            <tr>
              <th className="w-10 bg-slate-100 border border-slate-300 text-slate-500 font-semibold p-1 text-center" />
              {cols.map((colLetter, cIdx) => (
                <th
                  key={cIdx}
                  style={{ width: data.colWidths[cIdx] || '110px' }}
                  className="group relative bg-slate-100 border border-slate-300 text-slate-700 font-semibold p-1.5 text-center transition-colors"
                >
                  <span>{colLetter}</span>
                  {/* Quick Add Col Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddCol(cIdx);
                    }}
                    className="absolute right-0 top-0 bottom-0 w-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer shadow-xs z-10"
                    title={`কলাম ${colLetter}-এর ডানে নতুন কলাম যুক্ত করুন`}
                  >
                    +
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Header Row (Row 1 logical) */}
            <tr className="bg-slate-50">
              <th className="w-10 bg-slate-100 border border-slate-300 text-slate-500 font-semibold text-center p-1">
                1
              </th>
              {headers.map((hText, cIdx) => (
                <td
                  key={cIdx}
                  className="border border-slate-300 bg-slate-100/90 font-bold text-slate-800 p-1.5 text-center truncate"
                >
                  {hText}
                </td>
              ))}
            </tr>

            {/* Data Rows (Row 2, Row 3...) */}
            {grid.map((rowVals, rIdx) => {
              const excelRowNum = rIdx + 2;
              return (
                <tr key={rIdx} className="hover:bg-slate-100/40">
                  {/* Row Number Header */}
                  <th className="group relative w-10 bg-slate-100 border border-slate-300 text-slate-500 font-semibold text-center p-1">
                    <span>{excelRowNum}</span>
                    {/* Quick Add Row Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddRow(rIdx);
                      }}
                      className="absolute left-0 right-0 bottom-0 h-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer shadow-xs z-10"
                      title={`সারি ${excelRowNum}-এর নিচে নতুন সারি যুক্ত করুন`}
                    >
                      +
                    </button>
                  </th>

                  {/* Row Cells */}
                  {rowVals.map((rawCellVal, cIdx) => {
                    const isSelected = activeCoord.r === rIdx && activeCoord.c === cIdx;
                    const isEditingCell = isSelected && isEditing;
                    const isCellFormula =
                      typeof rawCellVal === 'string' && rawCellVal.startsWith('=');
                    const isEditingFormula = isEditingCell && editValue.trim().startsWith('=');
                    const evaluatedVal = evaluateFormula(rawCellVal, grid);
                    const cellRef = coordToCellRef(rIdx, cIdx);

                    const inDragPreview = isCellInDragPreview(rIdx, cIdx);
                    const inFormulaRange = isCellInFormulaRange(rIdx, cIdx);
                    const isReferencedInCurrentFormula =
                      activeFormulaReferences.length > 0 &&
                      activeFormulaReferences.some((refStr) => isCoordInReference(rIdx, cIdx, refStr)) &&
                      !(activeCoord.r === rIdx && activeCoord.c === cIdx);

                    return (
                      <td
                        key={cIdx}
                        data-row={rIdx}
                        data-col={cIdx}
                        data-ref={cellRef}
                        onMouseDown={(e) => handleCellMouseDown(e, rIdx, cIdx)}
                        onMouseEnter={() => handleCellMouseEnter(rIdx, cIdx)}
                        onClick={() => handleCellClick(rIdx, cIdx)}
                        onDoubleClick={() => handleCellDoubleClick(rIdx, cIdx)}
                        className={`relative border border-slate-300 p-1.5 text-center text-slate-900 cursor-cell transition-colors select-none ${
                          isSelected
                            ? 'outline-2 outline-emerald-700 bg-white z-20 shadow-xs'
                            : 'bg-white hover:bg-slate-50'
                        } ${
                          isCellFormula && !isSelected && !inFormulaRange && !isReferencedInCurrentFormula
                            ? 'bg-emerald-50/40 font-semibold text-emerald-950'
                            : ''
                        } ${
                          inDragPreview ? 'bg-emerald-100/70 outline-2 outline-dashed outline-emerald-600 ring-2 ring-emerald-500/30 z-20 font-medium' : ''
                        } ${
                          isReferencedInCurrentFormula && !inFormulaRange && !isSelected
                            ? 'outline-2 outline-blue-400 bg-blue-50/50 text-blue-950 font-medium z-10'
                            : ''
                        } ${
                          inFormulaRange ? 'outline-2 outline-dashed outline-blue-500 bg-blue-50/70 text-blue-950 z-30 font-semibold' : ''
                        }`}
                      >
                        {/* Cell Display / In-place Editor */}
                        {isEditingCell ? (
                          isEditingFormula ? (
                            /* Formula Editor Field (Only the Formula Field Itself) */
                            <div
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onMouseUp={(e) => e.stopPropagation()}
                              className="absolute z-50 left-0 -top-1 min-w-[280px] sm:min-w-[360px] max-w-xl select-text"
                            >
                              <input
                                ref={cellInputRef}
                                type="text"
                                value={editValue}
                                onChange={(e) => {
                                  setEditValue(e.target.value);
                                  updateCursorPos(e, 'cell');
                                }}
                                onSelect={(e) => updateCursorPos(e, 'cell')}
                                onKeyUp={(e) => updateCursorPos(e, 'cell')}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateCursorPos(e, 'cell');
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseUp={(e) => {
                                  e.stopPropagation();
                                  updateCursorPos(e, 'cell');
                                }}
                                onFocus={(e) => updateCursorPos(e, 'cell')}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    commitEdit(e.shiftKey ? 'up' : 'down');
                                  } else if (e.key === 'Tab') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    commitEdit(e.shiftKey ? 'left' : 'right');
                                  } else if (e.key === 'Escape') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    cancelEdit();
                                  }
                                }}
                                placeholder="=AVERAGE(B2:E2)"
                                className="w-full font-mono text-xl sm:text-2xl font-bold text-emerald-950 bg-white border-2 border-emerald-600 rounded-lg shadow-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-300 transition-all select-text cursor-text"
                                autoFocus
                              />
                            </div>
                          ) : (
                            /* Normal Cell Inline Editor */
                            <input
                              ref={cellInputRef}
                              type="text"
                              value={editValue}
                              onChange={(e) => {
                                setEditValue(e.target.value);
                                updateCursorPos(e, 'cell');
                              }}
                              onSelect={(e) => updateCursorPos(e, 'cell')}
                              onKeyUp={(e) => updateCursorPos(e, 'cell')}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCursorPos(e, 'cell');
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onMouseUp={(e) => {
                                e.stopPropagation();
                                updateCursorPos(e, 'cell');
                              }}
                              onFocus={(e) => updateCursorPos(e, 'cell')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  commitEdit(e.shiftKey ? 'up' : 'down');
                                } else if (e.key === 'Tab') {
                                  e.preventDefault();
                                  commitEdit(e.shiftKey ? 'left' : 'right');
                                } else if (e.key === 'Escape') {
                                  e.preventDefault();
                                  cancelEdit();
                                }
                              }}
                              className="w-full h-full min-h-[26px] bg-white text-slate-900 px-1 py-0.5 outline-none border-2 border-emerald-600 rounded-xs text-xs sm:text-sm font-medium text-center shadow-xs"
                              autoFocus
                            />
                          )
                        ) : (
                          <span
                            className={`block truncate ${
                              isCellFormula && showFormulas ? 'font-mono text-emerald-800' : ''
                            }`}
                            title={String(rawCellVal)}
                          >
                            {showFormulas ? rawCellVal : evaluatedVal}
                          </span>
                        )}

                        {/* Excel AutoFill Handle */}
                        {isSelected && !isEditing && (
                          <div
                            onMouseDown={handleAutoFillMouseDown}
                            className="autofill-handle absolute -bottom-2 -right-2 w-5 h-5 flex items-center justify-center cursor-crosshair z-30 group"
                            title="AutoFill: ড্র্যাগ করে সূত্র বা সিরিজ পূরণ করুন (+)"
                          >
                            <div className="w-2.5 h-2.5 bg-emerald-700 border border-white rounded-xs shadow-xs group-hover:scale-125 group-hover:bg-emerald-800 transition-transform flex items-center justify-center pointer-events-none">
                              <span className="text-[7px] text-white font-bold leading-none select-none">+</span>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Drag Boundary Overlay Box */}
        {isDragging && dragStartCoord && dragTargetCoord && (
          <div className="pointer-events-none absolute border-2 border-dashed border-emerald-600 bg-emerald-500/10 z-10 transition-all duration-75" />
        )}
      </div>

      {/* 5. Sheet Tab Bar */}
      <div className="bg-slate-100 border-t border-slate-300 flex items-center h-8 px-3 gap-2 select-none text-xs">
        <div className="bg-white border border-slate-300 border-b-white border-t-2 border-t-emerald-700 px-4 py-1 font-semibold text-emerald-900 rounded-t-sm shadow-2xs">
          Sheet1
        </div>
        <span className="text-slate-400 text-sm cursor-pointer hover:text-slate-600">+</span>
      </div>

      {/* 6. Excel Status Bar */}
      <div className="bg-[#107c41] text-white h-6 px-3 flex items-center justify-between select-none text-[11px] font-sans">
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wider">
            {isEditing ? 'EDIT' : 'READY'}
          </span>
          <span className="text-emerald-200">|</span>
          <span className="text-emerald-100">সেল: {activeCellRef}</span>
          {toastMessage && (
            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] animate-fade-in font-medium">
              {toastMessage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-emerald-100">
            মান: {evaluateFormula(getRawCellValue(activeCoord.r, activeCoord.c), grid)}
          </span>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-emerald-200" />
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
