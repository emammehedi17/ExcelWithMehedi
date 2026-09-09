import React from 'react';
import { Lock, LogIn, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isSignInPromptOpen, closeSignInPrompt, signIn, authError, isLoading } = useAuth();

  if (!isSignInPromptOpen) return null;

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={closeSignInPrompt}
    >
      <div
        id="auth-modal-container"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="auth-modal-close-btn"
          onClick={closeSignInPrompt}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">ডাটা এডিট করতে সাইন-ইন করুন</h3>
            <p className="text-xs text-slate-500">Google অ্যাকাউন্ট দিয়ে নিরাপদ লগইন</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          অনুগ্রহ করে আপনার Google অ্যাকাউন্ট দিয়ে সাইন-ইন করুন। সাইন-ইন ছাড়া এক্সেল শিটের কোনো ডাটা এডিট করা যাবে না। সাইন-ইন করলে আপনার সকল পরিবর্তন ও হিসাব স্বয়ংক্রিয়ভাবে আপনার অ্যাকাউন্টে ক্লাউডে সংরক্ষিত থাকবে।
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>সাইন-ইন করার সুবিধাসমূহ:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
            <li>যেকোনো সেল ও ফর্মুলা আনলক এবং এডিটিং সুবিধা</li>
            <li>আপনার প্রতিটি কাস্টম পরিবর্তন ক্লাউডে অটো-সেভ</li>
            <li>যেকোনো ডিভাইস থেকে আপনার সংরক্ষিত ডাটা অ্যাক্সেস</li>
          </ul>
        </div>

        {authError && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs mb-4">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            id="google-signin-btn-modal"
            disabled={isLoading}
            onClick={() => signIn()}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>Google দিয়ে সাইন-ইন করুন</span>
          </button>

          <button
            id="auth-modal-cancel-btn"
            onClick={closeSignInPrompt}
            className="w-full py-2 px-4 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            এখনই নয় (শুধু ভিউ মোডে থাকুন)
          </button>
        </div>
      </div>
    </div>
  );
};
