import React from 'react';
import { SmartphoneIcon, DownloadIcon, ArrowRightIcon } from './Icons';
import { detectDevice } from '../lib/deviceDetection';

export const FinalCTA: React.FC = () => {
  const deviceType = detectDevice();

  return (
    <section className="min-h-[50vh] flex flex-col justify-center py-12 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors relative scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
          <SmartphoneIcon className="w-3.5 h-3.5 text-blue-500" />
          <span>READY FOR IN-CABIN DEPLOYMENT</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
          Experience Sub-Meter Dead Reckoning
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-mono">
          Deploy IDR on your smartphone today. Zero external hardware, 100% on-device edge processing, and uninterrupted navigation during complete GNSS outages.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#install"
            className="px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-sm flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Download for {deviceType === 'ios-mobile' ? 'iOS' : 'Android'}</span>
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};
