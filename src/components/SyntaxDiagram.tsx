import React from 'react';
import { TokenItem, ParamItem } from '../types';

interface SyntaxDiagramProps {
  tokens: TokenItem[];
  params: ParamItem[];
}

export const SyntaxDiagram: React.FC<SyntaxDiagramProps> = ({ tokens, params }) => {
  const getChipStyle = (cls: string) => {
    switch (cls) {
      case 'c-fn':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'c-p1':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'c-p2':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'c-p3':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'c-p4':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCardBorder = (cls: string) => {
    switch (cls) {
      case 'c-fn':
        return 'border-t-blue-500 text-blue-600';
      case 'c-p1':
        return 'border-t-amber-500 text-amber-600';
      case 'c-p2':
        return 'border-t-rose-500 text-rose-600';
      case 'c-p3':
        return 'border-t-emerald-500 text-emerald-600';
      case 'c-p4':
        return 'border-t-purple-500 text-purple-600';
      default:
        return 'border-t-slate-400 text-slate-600';
    }
  };

  return (
    <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 sm:p-5 mb-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
          সিনট্যাক্স ডায়াগ্রাম ও বিবরণ (Syntax Breakdown)
        </span>
        <span className="text-xs text-slate-400 font-mono">Formula Structure</span>
      </div>

      {/* Syntax Tokens */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tokens.map((token, idx) => (
          <span
            key={idx}
            className={`px-3 py-1.5 rounded-md font-mono text-sm sm:text-base font-semibold border shadow-2xs transition-transform hover:-translate-y-0.5 ${getChipStyle(
              token.class
            )}`}
          >
            {token.text}
          </span>
        ))}
      </div>

      {/* Param Explanation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {params.map((param, idx) => (
          <div
            key={idx}
            className={`bg-white border border-slate-200 border-t-3 rounded-md p-3 shadow-2xs ${getCardBorder(
              param.class
            )}`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono mb-1">
              <span>↓</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                {param.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              {param.meaning}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
