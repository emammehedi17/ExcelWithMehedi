export interface TokenItem {
  text: string;
  class: 'c-fn' | 'c-p1' | 'c-p2' | 'c-p3' | 'c-p4' | string;
}

export interface ParamItem {
  name: string;
  meaning: string;
  class: 'c-fn' | 'c-p1' | 'c-p2' | 'c-p3' | 'c-p4' | string;
}

export type FunctionCategory = 
  | 'all'
  | 'math'
  | 'stat'
  | 'logical'
  | 'lookup'
  | 'financial'
  | 'advanced'
  | 'date'
  | 'lab';

export interface FunctionItem {
  id: string;
  templateVersion?: number;
  badge: string;
  category: FunctionCategory;
  name: string;
  title: string;
  desc: string;
  tokens: TokenItem[];
  params: ParamItem[];
  activeCell: string;
  cols: string[];
  colWidths: string[];
  headers: string[];
  rows: (string | number)[][];
}

export interface CellCoord {
  col: number; // 0-indexed
  row: number; // 0-indexed (row 0 corresponds to data row 0, which is Excel Row 2)
}

export interface CellRange {
  start: CellCoord;
  end: CellCoord;
}
