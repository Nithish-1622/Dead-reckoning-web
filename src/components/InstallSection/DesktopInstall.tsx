import React, { useState } from 'react';
import { 
  LaptopIcon, 
  SendIcon, 
  CopyIcon, 
  CheckIcon, 
  DownloadIcon, 
  ShieldCheckIcon
} from '../Icons';

interface ReleaseVersion {
  version: string;
  tag: 'LATEST STABLE' | 'BETA' | 'ENTERPRISE' | 'LTS';
  releaseDate: string;
  fileSize: string;
  targetSdk: string;
  changelog: string;
  apkUrl: string;
  sha256: string;
}

const MOCK_VERSIONS: ReleaseVersion[] = [
  {
    version: 'v1.4.2',
    tag: 'LATEST STABLE',
    releaseDate: 'August 28, 2026',
    fileSize: '18.4 MB',
    targetSdk: 'Android 11+ (API 30–34)',
    changelog: 'Strapdown quaternion mechanization with ONNX INT8 edge vehicle velocity model & tunnel covariance bounds.',
    apkUrl: 'https://idr-dead-reckoning.app/download/idr-v1.4.2.apk',
    sha256: '9a7f3c2b...8e41a02d'
  },
  {
    version: 'v1.5.0-RC2',
    tag: 'BETA',
    releaseDate: 'August 24, 2026',
    fileSize: '20.2 MB',
    targetSdk: 'Android 13+ (API 33+)',
    changelog: 'Dual-frequency raw pseudorange carrier phase fusion with experimental sub-surface subterranean parking graph matching.',
    apkUrl: 'https://idr-dead-reckoning.app/download/idr-v1.5.0-rc2.apk',
    sha256: '3f8e12ac...5d9081b2'
  },
  {
    version: 'v1.4.0',
    tag: 'ENTERPRISE',
    releaseDate: 'July 15, 2026',
    fileSize: '19.1 MB',
    targetSdk: 'Android 11+ (API 30+)',
    changelog: 'Fleet multi-device MQTT telemetry logging with offline vector road topology tile pre-caching.',
    apkUrl: 'https://idr-dead-reckoning.app/download/idr-v1.4.0.apk',
    sha256: '1a5b82c0...4f7623e9'
  },
  {
    version: 'v1.3.8',
    tag: 'LTS',
    releaseDate: 'May 02, 2026',
    fileSize: '17.8 MB',
    targetSdk: 'Android 10+ (API 29+)',
    changelog: 'Ultra low-power adaptive gyroscope power-gating, reducing battery drain by 18% during extended highway cruises.',
    apkUrl: 'https://idr-dead-reckoning.app/download/idr-v1.3.8.apk',
    sha256: '6c2e91df...7a1190bc'
  }
];

export const DesktopInstall: React.FC = () => {
  const [shareTab, setShareTab] = useState<'email' | 'sms'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<ReleaseVersion>(MOCK_VERSIONS[0]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedVersion.apkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSentNotice(`Download link for ${selectedVersion.version} sent to ${emailInput}!`);
      setEmailInput('');
      setTimeout(() => setSentNotice(null), 4000);
    }
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.trim()) {
      setSentNotice(`Download SMS for ${selectedVersion.version} sent to ${phoneInput}!`);
      setPhoneInput('');
      setTimeout(() => setSentNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Pairing Gateway Card */}
      <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-6 sm:space-y-8 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black text-white dark:bg-white dark:text-black shadow-sm">
              <LaptopIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-neutral-950 dark:text-white">Desktop Pairing & Dispatch Gateway</h3>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-mono">Transfer the standalone APK directly to your smartphone</p>
            </div>
          </div>
          <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-[11px] sm:text-xs font-mono text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 font-bold">
            Selected: {selectedVersion.version} ({selectedVersion.tag})
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          
          {/* QR Code Card */}
          <div className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-3 text-center">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-neutral-300 shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedVersion.apkUrl)}`}
                alt={`Scan QR code to install IDR app ${selectedVersion.version}`}
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                loading="lazy"
              />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-xs font-mono text-neutral-950 dark:text-white">
                Scan with phone camera ({selectedVersion.version})
              </div>
              <p className="text-[11px] text-neutral-500 max-w-[200px]">
                Direct high-speed download link for the signed APK package ({selectedVersion.fileSize}).
              </p>
            </div>
          </div>

          {/* Email & SMS Transfer Forms */}
          <div className="space-y-5">
            
            {/* Share Method Switcher Tabs (Email / SMS) */}
            <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <button
                onClick={() => setShareTab('email')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  shareTab === 'email'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Send via Email
              </button>
              <button
                onClick={() => setShareTab('sms')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  shareTab === 'sms'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Send via SMS
              </button>
            </div>

            {/* Notification alert */}
            {sentNotice && (
              <div className="p-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-neutral-950 dark:text-white shrink-0" />
                <span>{sentNotice}</span>
              </div>
            )}

            {/* Email Form */}
            {shareTab === 'email' && (
              <form onSubmit={handleSendEmail} className="space-y-2">
                <label className="text-xs font-mono text-neutral-800 dark:text-neutral-200 font-bold block">
                  Send {selectedVersion.version} download link to your Email:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="engineer@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="flex-grow px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 hover:opacity-90"
                  >
                    <SendIcon className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            )}

            {/* SMS Form */}
            {shareTab === 'sms' && (
              <form onSubmit={handleSendSms} className="space-y-2">
                <label className="text-xs font-mono text-neutral-800 dark:text-neutral-200 font-bold block">
                  Send {selectedVersion.version} download link via SMS:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    required
                    className="flex-grow px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0 hover:opacity-90"
                  >
                    <SendIcon className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            )}

            {/* Direct URL copy */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-mono text-neutral-800 dark:text-neutral-200 font-bold block">
                Direct Download URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedVersion.apkUrl}
                  className="flex-grow px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-[11px] sm:text-xs font-mono text-neutral-500 select-all min-w-0"
                />
                <button
                  onClick={handleCopy}
                  className="p-2.5 sm:p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-700 transition-all shrink-0"
                  title="Copy URL"
                >
                  {copied ? <CheckIcon className="w-4 h-4 text-black dark:text-white" /> : <CopyIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <a
                href={selectedVersion.apkUrl}
                download
                className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4 font-bold"
              >
                <DownloadIcon className="w-3.5 h-3.5" /> Direct desktop download ({selectedVersion.version}, {selectedVersion.fileSize})
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Mock Version Archive & Release History Table */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase font-bold">RELEASE ARCHIVE</div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white mt-0.5">Available Build Versions</h3>
          </div>
          <div className="text-xs font-mono text-neutral-500">
            Select a version to update pairing & download package
          </div>
        </div>

        {/* Version List */}
        <div className="space-y-3">
          {MOCK_VERSIONS.map((v) => {
            const isSelected = selectedVersion.version === v.version;
            return (
              <div
                key={v.version}
                onClick={() => setSelectedVersion(v)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-[#15151C] border-black dark:border-white shadow-md'
                    : 'bg-neutral-50 dark:bg-black/30 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <div className="space-y-1.5 flex-grow">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold font-mono text-sm text-neutral-950 dark:text-white">{v.version}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      v.tag === 'LATEST STABLE'
                        ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                        : v.tag === 'BETA'
                        ? 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white border-neutral-400'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                    }`}>
                      {v.tag}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">• {v.releaseDate}</span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                    {v.changelog}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-neutral-500 pt-1">
                    <span>Target: {v.targetSdk}</span>
                    <span>Size: {v.fileSize}</span>
                    <span className="hidden sm:inline">SHA: {v.sha256}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  <a
                    href={v.apkUrl}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center gap-1.5 hover:opacity-90 shadow-sm"
                  >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    <span>Download APK</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100 font-bold">
            <ShieldCheckIcon className="w-4 h-4 text-black dark:text-white" />
            <span>Cryptographically Signed Release Packages</span>
          </div>
          <span>ARM64-v8a Compiled</span>
        </div>

      </div>

    </div>
  );
};
