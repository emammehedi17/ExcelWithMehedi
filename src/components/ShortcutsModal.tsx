import React from 'react';
import { X, Keyboard, Check, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      group: 'সেল সিলেকশন ও এডিটিং (Editing & Selection)',
      items: [
        { key: 'Double Click', desc: 'সেলে সরাসরি ইন-প্লেস এডিট মোড চালু করে (In-place edit mode)' },
        { key: 'F2', desc: 'নির্বাচিত সেলের এডিট মোড টগল করে (Toggle cell editing mode)' },
        { key: 'Enter', desc: 'মান সেভ করে নিচের সারিতে যায় (Commit & move down one row)' },
        { key: 'Shift + Enter', desc: 'মান সেভ করে উপরের সারিতে যায় (Commit & move up one row)' },
        { key: 'Tab', desc: 'মান সেভ করে ডানের কলামে যায় (Commit & move right one col)' },
        { key: 'Shift + Tab', desc: 'মান সেভ করে বামের কলামে যায় (Commit & move left one col)' },
        { key: 'Escape', desc: 'চলমান এডিট বাতিল করে পূর্বের মানে ফিরে যায় (Cancel cell edit)' },
        { key: 'Delete / Backspace', desc: 'নির্বাচিত সেলের ডেটা মুছে ফেলে (Clear selected cell)' },
      ],
    },
    {
      group: 'নেভিগেশন ও কপি-পেস্ট (Navigation & Clipboard)',
      items: [
        { key: 'Arrow Keys (↑ ↓ ← →)', desc: 'শীটের চারদিকে সেলে নেভিগেট করে (Navigate cells)' },
        { key: 'Ctrl + Z', desc: 'পূর্বের অ্যাকশন বাতিল বা আনডু করে (Undo last action)' },
        { key: 'Ctrl + Y', desc: 'বাতিলকৃত অ্যাকশন পুনরায় ফিরিয়ে আনে (Redo)' },
        { key: 'Ctrl + C', desc: 'নির্বাচিত সেলের মান বা সূত্র কপি করে (Copy cell data)' },
        { key: 'Ctrl + V', desc: 'কপিকৃত মান বা সূত্র পেস্ট করে (Paste into cell)' },
        { key: 'Drag Handle (AutoFill)', desc: 'নিচের ডান কোণা টেনে স্বয়ংক্রিয় সিরিজ বা সূত্র পূরণ (AutoFill)' },
      ],
    },
    {
      group: 'এডভান্সড ফিচার ও ভিউ (Advanced & Formula)',
      items: [
        { key: 'Formula Bar Edit', desc: 'উপরের fx বারে ক্লিক করে সূত্র পরিবর্তন ও রিয়েলটাইম আপডেট' },
        { key: 'Formula Highlighting', desc: 'সূত্র লেখার সময় সংশ্লিষ্ট সেলগুলো স্বয়ংক্রিয় কালার বর্ডারে হাইলাইট হয়' },
        { key: 'Show Formulas Toggle', desc: 'সম্পূর্ণ শিটের মান ও সূত্রের রূপান্তর দেখতে রিবনের বাটন ব্যবহার করুন' },
        { key: 'Copy Table', desc: 'এক ক্লিকে সম্পূর্ণ শিটের ডাটা Excel বা Google Sheets-এ পেস্টের জন্য কপি' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/80 rounded-lg">
              <Keyboard className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg">এক্সেল কীবোর্ড শর্টকাট গাইড (Shortcuts)</h3>
              <p className="text-xs text-emerald-200 font-normal">
                লাইভ সিমুলেটরে কাজ করার পূর্ণাঙ্গ শর্টকাট সহায়িকা
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {group.group}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-700">{item.desc}</span>
                    </div>
                    <kbd className="self-start sm:self-auto px-2 py-1 text-xs font-semibold font-mono text-slate-800 bg-white border border-slate-300 rounded shadow-2xs whitespace-nowrap">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>টিপস: সেলে ডাবল-ক্লিক করে সরাসরি টাইপ করুন বা F2 চাপুন</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-md transition-colors shadow-xs"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
