import React from 'react';
import { CrosshairIcon, DownloadIcon, LaptopIcon, SmartphoneIcon, ArrowRightIcon } from './Icons';
import { detectDevice } from '../lib/deviceDetection';

export const FinalCTA: React.FC = () => {
  const deviceType = detectDevice();

  return (
    <section className="py-28 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        <div className="w-14 h-14 rounded-3xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mx-auto shadow-xl">
          <CrosshairIcon className="w-7 h-7" />
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight font-sans">
            Experience unbreakable vehicle navigation.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Zero proprietary hardware. Zero external antennas. Deploy IDR to your phone and never lose positional context again.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#install"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm shadow-lg active:scale-95 transition-all group font-mono hover:opacity-90"
          >
            {deviceType === 'android-mobile' ? (
              <DownloadIcon className="w-4 h-4" />
            ) : deviceType === 'ios-mobile' ? (
              <SmartphoneIcon className="w-4 h-4" />
            ) : (
              <LaptopIcon className="w-4 h-4" />
            )}
            <span>
              {deviceType === 'android-mobile'
                ? 'Download APK Package'
                : deviceType === 'ios-mobile'
                ? 'View iOS Support Status'
                : 'Deploy to Smartphone'}
            </span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#problem"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs border border-neutral-300 dark:border-neutral-700 transition-all font-semibold"
          >
            Review Blackout Scenarios
          </a>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-500">
          <span>• 100% On-Device Inertial Fusion</span>
          <span>• OpenStreetMap Graph Matched</span>
          <span>• Zero Telemetry Cloud Upload</span>
        </div>

      </div>
    </section>
  );
};
