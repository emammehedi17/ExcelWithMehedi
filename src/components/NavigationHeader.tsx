import React from 'react';
import {
  Search,
  BookOpen,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Sparkles,
  FlaskConical,
} from 'lucide-react';
import { FunctionCategory, FunctionItem } from '../types';
import { CATEGORIES } from '../data/functionsData';

interface NavigationHeaderProps {
  functions: FunctionItem[];
  currentCategory: FunctionCategory;
  onSelectCategory: (cat: FunctionCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'full' | 'paged';
  onToggleViewMode: (mode: 'full' | 'paged') => void;
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  onOpenShortcuts: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  functions,
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  currentPageIndex,
  onPageChange,
  onOpenShortcuts,
}) => {
  const currentFn = functions[currentPageIndex];
  const totalCount = functions.length;

  return (
    <>
      {/* Upper controls card: Non-sticky (scrolls away and hides on scroll) */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs p-3.5 mb-4 space-y-3">
        {/* Top row: View Switcher, Search, and Shortcuts Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* View Mode Toggle */}
          <div className="inline-flex bg-slate-100 p-1 rounded-lg self-start border border-slate-200">
            <button
              onClick={() => onToggleViewMode('full')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'full'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-emerald-700" />
              <span>সম্পূর্ণ ভিউ (Full Scroll)</span>
            </button>
            <button
              onClick={() => onToggleViewMode('paged')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'paged'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>পেজ ভিউ (Topic View)</span>
            </button>
          </div>

          {/* Search Input & Shortcuts CTA */}
          <div className="flex items-center gap-2.5 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ফাংশন বা কীওয়ার্ড খুঁজুন (যেমন: SUM, VLOOKUP, বেতন, IFS)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-lg outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={onOpenShortcuts}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              title="শর্টকাট তালিকা দেখুন"
            >
              <Keyboard className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">শর্টকাট গাইড</span>
            </button>
          </div>
        </div>

        {/* Middle row: Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as FunctionCategory)}
                className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* EXCLUSIVELY STICKY AT TOP-0: Only the Prev, Next, Dropdown, and Topic Counter row */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border border-slate-200 shadow-md py-2.5 px-3 sm:px-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-2 transition-all">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPageIndex - 1)}
            disabled={currentPageIndex <= 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            title="পূর্ববর্তী ফাংশন বা ল্যাব"
          >
            <ChevronLeft className="w-4 h-4 text-emerald-700" />
            <span>পূর্ববর্তী (Prev)</span>
          </button>

          {/* Topic Dropdown */}
          <select
            value={currentPageIndex}
            onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
            className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-emerald-600 rounded-lg outline-none cursor-pointer max-w-[220px] sm:max-w-xs truncate shadow-xs focus:ring-2 focus:ring-emerald-200"
          >
            {functions.map((fn, idx) => (
              <option key={fn.id} value={idx}>
                {idx + 1}. {fn.badge.includes('Lab') ? '🧪 ' : '⚡ '}
                {fn.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onPageChange(currentPageIndex + 1)}
            disabled={currentPageIndex >= totalCount - 1}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            title="পরবর্তী ফাংশন বা ল্যাব"
          >
            <span>পরবর্তী (Next)</span>
            <ChevronRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100/80 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold font-mono shadow-2xs">
            টপিক {totalCount > 0 ? currentPageIndex + 1 : 0} / {totalCount}
          </span>
        </div>
      </div>
    </>
  );
};
