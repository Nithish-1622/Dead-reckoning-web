import React, { useState } from 'react';
import { detectDevice } from '../../lib/deviceDetection';
import { DeviceType } from '../../lib/types';
import { MobileInstall } from './MobileInstall';
import { DesktopInstall } from './DesktopInstall';
import { UnsupportedMobileInstall } from './UnsupportedMobileInstall';
import { DownloadIcon, LaptopIcon, SmartphoneIcon, TabletIcon } from '../Icons';

export const InstallSection: React.FC = () => {
  const detected = detectDevice();
  const [deviceOverride, setDeviceOverride] = useState<DeviceType | null>(null);

  const activeDevice = deviceOverride || detected;

  return (
    <section id="install" className="py-28 bg-neutral-100 dark:bg-[#070709] border-t border-neutral-200 dark:border-neutral-800 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
              <DownloadIcon className="w-3.5 h-3.5" />
              <span>INSTALLATION GATEWAY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
              Deploy IDR to your hardware.
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              The companion web platform acts as your gateway. The standalone Android APK delivers pure on-device inertial dead reckoning.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="p-1.5 rounded-2xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 flex items-center gap-1 text-xs font-mono shadow-md">
            <span className="text-[10px] text-neutral-500 px-2 uppercase font-bold">MODE:</span>
            
            <button
              onClick={() => setDeviceOverride('android-mobile')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs ${
                activeDevice === 'android-mobile'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <SmartphoneIcon className="w-3.5 h-3.5" /> Android
            </button>

            <button
              onClick={() => setDeviceOverride('desktop')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs ${
                activeDevice === 'desktop'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <LaptopIcon className="w-3.5 h-3.5" /> Desktop
            </button>

            <button
              onClick={() => setDeviceOverride('ios-mobile')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-xs ${
                activeDevice === 'ios-mobile'
                  ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <TabletIcon className="w-3.5 h-3.5" /> iOS
            </button>
          </div>
        </div>

        {/* Dynamic Component Dispatch */}
        <div className="max-w-4xl mx-auto">
          {activeDevice === 'android-mobile' && <MobileInstall />}
          {activeDevice === 'ios-mobile' && <UnsupportedMobileInstall />}
          {activeDevice === 'desktop' && <DesktopInstall />}
          {activeDevice === 'tablet' && <DesktopInstall />}
        </div>

      </div>
    </section>
  );
};
