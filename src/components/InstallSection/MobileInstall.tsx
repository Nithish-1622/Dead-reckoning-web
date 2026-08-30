import React, { useState } from 'react';
import { DownloadIcon, ShieldCheckIcon, CheckCircleIcon, SmartphoneIcon } from '../Icons';

interface ReleaseVersion {
  version: string;
  tag: string;
  fileSize: string;
  changelog: string;
  apkUrl: string;
}

const MOBILE_VERSIONS: ReleaseVersion[] = [
  {
    version: 'v1.4.2',
    tag: 'LATEST STABLE',
    fileSize: '18.4 MB',
    changelog: 'Strapdown quaternion mechanization with ONNX INT8 velocity model.',
    apkUrl: 'https://idr-dead-reckoning.app/download/idr-v1.4.2.apk'
  },
  {
    version: 'v1.5.0-RC2',
    tag: 'BETA PREVIEW',
    fileSize: '20.2 MB',
    changelog: 'Dual-frequency raw pseudorange carrier phase fusion.',
    apkUrl: 'https://idr-dead-reckoning.app/download/idr-v1.5.0-rc2.apk'
  },
  {
    version: 'v1.3.8',
    tag: 'LTS BATTERY OPTIMIZED',
    fileSize: '17.8 MB',
    changelog: 'Adaptive gyroscope power-gating (18% battery savings).',
    apkUrl: 'https://idr-dead-reckoning.app/download/idr-v1.3.8.apk'
  }
];

export const MobileInstall: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<ReleaseVersion>(MOBILE_VERSIONS[0]);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.location.href = selectedVersion.apkUrl;
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto px-1 sm:px-0">
      
      {/* Primary Mobile Download Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xl text-center">
        
        <div className="w-14 h-14 rounded-3xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mx-auto shadow-md">
          <SmartphoneIcon className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700">
            ANDROID ENVIRONMENT DETECTED
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
            Install IDR Mobile {selectedVersion.version}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            High-performance 200Hz inertial dead-reckoning engine compiled with Android NDK ({selectedVersion.fileSize}).
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 px-6 rounded-2xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50 font-mono"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>{downloading ? 'Preparing Download...' : `Download APK (${selectedVersion.version})`}</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-500">
            <ShieldCheckIcon className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
            <span>SHA-256 Verified | Zero Telemetry Tracking</span>
          </div>
        </div>

        {/* Sideload Guide */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 text-left space-y-2 text-xs font-mono">
          <div className="font-bold text-neutral-950 dark:text-white flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-black dark:text-white shrink-0" /> 3-Step Sideload Instructions:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-neutral-600 dark:text-neutral-400 pl-1">
            <li>Tap "Download APK" above to save the package.</li>
            <li>Open the downloaded APK file from notifications.</li>
            <li>Select "Install" (enable unknown sources if prompted).</li>
          </ol>
        </div>

      </div>

      {/* Mobile Version Archive Switcher */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
        <div className="text-xs font-mono font-bold text-neutral-950 dark:text-white uppercase">
          Select Version Build:
        </div>

        <div className="space-y-2.5">
          {MOBILE_VERSIONS.map((v) => {
            const isSelected = selectedVersion.version === v.version;
            return (
              <button
                key={v.version}
                onClick={() => setSelectedVersion(v)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-[#15151C] border-black dark:border-white shadow-sm'
                    : 'bg-neutral-50 dark:bg-black/30 border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-xs text-neutral-950 dark:text-white">{v.version}</span>
                    <span className="text-[10px] font-mono text-neutral-500 font-semibold">{v.tag}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{v.fileSize}</div>
                </div>
                <div className="text-xs font-mono font-bold text-neutral-950 dark:text-white shrink-0">
                  {isSelected ? '✓ Active' : 'Select'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
