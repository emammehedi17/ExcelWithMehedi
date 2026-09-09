import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  BookOpen,
  Sparkles,
  Search,
  ListOrdered,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { functionsData } from './data/functionsData';
import { FunctionCategory, FunctionItem } from './types';
import { SyntaxDiagram } from './components/SyntaxDiagram';
import { ExcelSimulator } from './components/ExcelSimulator';
import { NavigationHeader } from './components/NavigationHeader';
import { ShortcutsModal } from './components/ShortcutsModal';

export default function App() {
  const [currentCategory, setCurrentCategory] = useState<FunctionCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'full' | 'paged'>('full');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isIndexOpen, setIsIndexOpen] = useState<boolean>(false);

  // Filter functions based on category and search query
  const filteredFunctions = useMemo(() => {
    return functionsData.filter((fn) => {
      // Category filter
      const matchesCategory =
        currentCategory === 'all' ||
        fn.category === currentCategory ||
        (currentCategory === 'lab' && fn.badge.toLowerCase().includes('practice'));

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        fn.name.toLowerCase().includes(q) ||
        fn.title.toLowerCase().includes(q) ||
        fn.desc.toLowerCase().includes(q) ||
        fn.badge.toLowerCase().includes(q) ||
        fn.tokens.some((t) => t.text.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [currentCategory, searchQuery]);

  // Adjust page index if filtered list length changes
  useEffect(() => {
    if (currentPageIndex >= filteredFunctions.length) {
      setCurrentPageIndex(Math.max(0, filteredFunctions.length - 1));
    }
  }, [filteredFunctions.length, currentPageIndex]);

  // Global key listener for '?' to open shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only open if not typing inside an input/textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSelectTopic = (index: number) => {
    setCurrentPageIndex(index);
    if (viewMode === 'full') {
      const targetId = filteredFunctions[index]?.id;
      if (targetId) {
        const el = document.getElementById(`card-${targetId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsIndexOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      {/* Top Banner / Header (Non-sticky: scrolls away with the page) */}
      <header className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                <span>Excel Master Guide</span>
                <span className="hidden sm:inline-block text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  ২০টি সমন্বিত মডিউল (সিঙ্গেল টেবিল গাইড ও ল্যাব)
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                ইন্টারঅ্যাক্টিভ লাইভ ইঞ্জিন ও বাংলা গাইড
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsIndexOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">টপিক ইনডেক্স</span>
            </button>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              title="কীবোর্ড শর্টকাট গাইড (?)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>শর্টকাট (?)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Intro Announcement Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 mb-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>সম্পূর্ণ ফাংশনাল এক্সেল সিমুলেটর ও নোট</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                মাইক্রোসফট এক্সেল মাস্টার গাইড ও প্র্যাকটিস ল্যাব
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                এই গাইডে যোগ ও গড়, সর্বনিম্ন ও সর্বোচ্চ, কাউন্ট, VLOOKUP ও XLOOKUP, Nested IF ও IFS,
                ব্যাংকিং ঋণ ও ইনভেস্টমেন্ট বিশ্লেষণসহ সম্পর্কিত বিষয়গুলোকে সমন্বিত সিঙ্গেল টেবিলে সাজানো হয়েছে।
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-3 sm:p-4 text-xs text-emerald-900 space-y-1 shrink-0 md:max-w-xs shadow-2xs">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <span>💡 প্রো টিপস ও শর্টকাট:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                <li>যেকোনো সেলে <strong>ডাবল-ক্লিক</strong> করে সূত্র এডিট করুন।</li>
                <li>তীরচিহ্ন (<strong>Arrow Keys</strong>) বা <strong>Tab</strong> দিয়ে নেভিগেট করুন।</li>
                <li>নিচের ডান কোণার হ্যান্ডেল ধরে টেনে <strong>AutoFill</strong> করুন।</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Dashboard Navigation Bar */}
        <NavigationHeader
          functions={filteredFunctions}
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setCurrentPageIndex(0);
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCurrentPageIndex(0);
          }}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          currentPageIndex={currentPageIndex}
          onPageChange={(idx) => {
            setCurrentPageIndex(idx);
            if (viewMode === 'full') {
              const targetId = filteredFunctions[idx]?.id;
              if (targetId) {
                const el = document.getElementById(`card-${targetId}`);
                if (el) {
                  const yOffset = -70;
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }
            }
          }}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        {/* Content Layout (Sidebar Drawer + Function Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Collapsible Topic Drawer on Large Screens */}
          {isIndexOpen && (
            <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs sticky top-16 max-h-[85vh] overflow-y-auto space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  টপিক তালিকা ({filteredFunctions.length})
                </span>
                <button
                  onClick={() => setIsIndexOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕ বন্ধ করুন
                </button>
              </div>
              <div className="space-y-1">
                {filteredFunctions.map((fn, idx) => (
                  <button
                    key={fn.id}
                    onClick={() => handleSelectTopic(idx)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      currentPageIndex === idx
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">
                      {idx + 1}. {fn.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      {fn.badge}
                    </span>
                  </button>
                ))}
              </div>
            </aside>
          )}

          {/* Main Function Viewport */}
          <div className={isIndexOpen ? 'lg:col-span-9' : 'lg:col-span-12'}>
            {filteredFunctions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">
                  কোনো ফাংশন বা ল্যাব পাওয়া যায়নি
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  "{searchQuery}" এর সাথে মিলে এমন কোনো ফলাফল নেই। অনুগ্রহ করে অন্য কীওয়ার্ড খুঁজুন
                  অথবা ক্যাটাগরি ফিল্টার পরিবর্তন করুন।
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentCategory('all');
                  }}
                  className="px-4 py-1.5 bg-emerald-700 text-white rounded-md text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  সবগুলো টপিক রিসেট করুন
                </button>
              </div>
            ) : viewMode === 'paged' ? (
              /* Paged Mode: Single Active Card View */
              <div
                key={filteredFunctions[currentPageIndex]?.id}
                className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-xs space-y-5 animate-in fade-in duration-200"
              >
                {/* Header info */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        filteredFunctions[currentPageIndex]?.badge.includes('Lab')
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {filteredFunctions[currentPageIndex]?.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Topic #{currentPageIndex + 1}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                    {filteredFunctions[currentPageIndex]?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {filteredFunctions[currentPageIndex]?.desc}
                  </p>
                </div>

                {/* Syntax Diagram */}
                <SyntaxDiagram
                  tokens={filteredFunctions[currentPageIndex]?.tokens || []}
                  params={filteredFunctions[currentPageIndex]?.params || []}
                />

                {/* Interactive Live Excel Simulator */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      লাইভ এক্সেল ল্যাব (Live Engine)
                    </span>
                    <span className="text-xs text-slate-400">
                      সরাসরি ক্লিক বা ডাবল-ক্লিক করে সূত্র পরীক্ষা করুন
                    </span>
                  </div>
                  <ExcelSimulator data={filteredFunctions[currentPageIndex]} />
                </div>
              </div>
            ) : (
              /* Full Scroll Mode: All Cards Displayed */
              <div className="space-y-8">
                {filteredFunctions.map((fn, idx) => (
                  <article
                    key={fn.id}
                    id={`card-${fn.id}`}
                    className="bg-white border border-slate-200/90 rounded-xl p-5 sm:p-7 shadow-xs space-y-5 scroll-mt-24"
                  >
                    {/* Header info */}
                    <div className="border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            fn.badge.includes('Lab')
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {fn.badge}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          #{idx + 1} of {filteredFunctions.length}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                        {fn.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {fn.desc}
                      </p>
                    </div>

                    {/* Syntax Diagram */}
                    <SyntaxDiagram tokens={fn.tokens} params={fn.params} />

                    {/* Interactive Live Excel Simulator */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          লাইভ এক্সেল ল্যাব (Live Engine)
                        </span>
                        <span className="text-xs text-slate-400">
                          সম্পূর্ণ ইন্টারঅ্যাক্টিভ ও রিয়েলটাইম ক্যালকুলেশন
                        </span>
                      </div>
                      <ExcelSimulator data={fn} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
