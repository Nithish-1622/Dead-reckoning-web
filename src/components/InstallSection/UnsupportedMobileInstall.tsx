import React, { useState } from 'react';
import { SmartphoneIcon, SendIcon, ShieldIcon } from '../Icons';

export const UnsupportedMobileInstall: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-8 shadow-xl text-center max-w-xl mx-auto">
      
      <div className="w-16 h-16 rounded-3xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mx-auto shadow-md">
        <SmartphoneIcon className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700">
          APPLE IOS ENVIRONMENT
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
          IDR is compiled for Android NDK
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          Due to background high-frequency sensor access limitations and custom strapdown math engine dependencies, the standalone IDR application is currently distributed as an Android APK package.
        </p>
      </div>

      {/* Notify Form */}
      <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-3 text-left">
        <label className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 block">
          Get notified when the iOS TestFlight build launches:
        </label>
        
        {submitted ? (
          <div className="p-3.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-neutral-100 font-bold">
            ✓ Thank you! We’ll notify you when iOS TestFlight access opens.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="engineer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 rounded-xl bg-white dark:bg-black/60 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
              required
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 hover:opacity-90"
            >
              <SendIcon className="w-3.5 h-3.5" />
              <span>Notify Me</span>
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-500">
        <ShieldIcon className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
        <span>CoreMotion API integration & TestFlight port in active development.</span>
      </div>

    </div>
  );
};
