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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN (50%): Desktop Pairing & Dispatch Gateway                     */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl flex flex-col justify-between h-full">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black shadow-sm shrink-0">
              <LaptopIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white">
                Desktop Pairing & Dispatch Gateway
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-mono">
                Transfer the standalone APK directly to your smartphone
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-[11px] font-mono text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 font-bold shrink-0">
            Active: {selectedVersion.version}
          </div>
        </div>

        {/* QR Code + Dispatch Methods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center flex-grow py-1">
          
          {/* QR Code Container (5 cols on sm+) */}
          <div className="sm:col-span-5 flex flex-col items-center p-4 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-2 text-center">
            <div className="p-2 rounded-2xl bg-white border border-neutral-300 shadow-sm">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(selectedVersion.apkUrl)}`}
                alt={`Scan QR code to install IDR app ${selectedVersion.version}`}
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
                loading="lazy"
              />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-xs font-mono text-neutral-950 dark:text-white">
                Scan with camera
              </div>
              <p className="text-[10px] text-neutral-500 font-mono">
                Signed APK ({selectedVersion.fileSize})
              </p>
            </div>
          </div>

          {/* Transfer Dispatch Form (7 cols on sm+) */}
          <div className="sm:col-span-7 space-y-3.5">
            
            {/* Switcher Tabs (Email / SMS) */}
            <div className="flex items-center gap-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <button
                onClick={() => setShareTab('email')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
                  shareTab === 'email'
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Send via Email
              </button>
              <button
                onClick={() => setShareTab('sms')}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
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
              <div className="p-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <CheckIcon className="w-3.5 h-3.5 text-neutral-950 dark:text-white shrink-0" />
                <span>{sentNotice}</span>
              </div>
            )}

            {/* Email Form */}
            {shareTab === 'email' && (
              <form onSubmit={handleSendEmail} className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-800 dark:text-neutral-200 font-bold block">
                  Send {selectedVersion.version} link to Email:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="engineer@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="flex-grow px-3 py-2 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center gap-1 shadow-sm transition-all shrink-0 hover:opacity-90"
                  >
                    <SendIcon className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            )}

            {/* SMS Form */}
            {shareTab === 'sms' && (
              <form onSubmit={handleSendSms} className="space-y-1.5">
                <label className="text-[11px] font-mono text-neutral-800 dark:text-neutral-200 font-bold block">
                  Send {selectedVersion.version} link via SMS:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    required
                    className="flex-grow px-3 py-2 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center gap-1 shadow-sm transition-all shrink-0 hover:opacity-90"
                  >
                    <SendIcon className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            )}

            {/* Direct URL Copy Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-800 dark:text-neutral-200 font-bold block">
                Direct Download Link:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={selectedVersion.apkUrl}
                  className="flex-grow px-3 py-2 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono text-neutral-500 select-all min-w-0"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-700 transition-all shrink-0"
                  title="Copy URL"
                >
                  {copied ? <CheckIcon className="w-3.5 h-3.5 text-black dark:text-white" /> : <CopyIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Quick Desktop Download Link */}
            <div className="pt-0.5">
              <a
                href={selectedVersion.apkUrl}
                download
                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4 font-bold"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>Direct download ({selectedVersion.version}, {selectedVersion.fileSize})</span>
              </a>
            </div>

          </div>

        </div>

        {/* Security / Architecture Footer */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100 font-semibold">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>Signed Release Package</span>
          </div>
          <span>ARM64-v8a • SHA: {selectedVersion.sha256}</span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN (50%): Available Build Versions List                         */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-3.5 shadow-xl flex flex-col justify-between h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase font-bold">RELEASE ARCHIVE</div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white mt-0.5">
              Available Build Versions
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 font-bold">
            {MOCK_VERSIONS.length} BUILDS
          </span>
        </div>

        {/* Structured Version Cards List */}
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
          {MOCK_VERSIONS.map((v) => {
            const isSelected = selectedVersion.version === v.version;
            return (
              <div
                key={v.version}
                onClick={() => setSelectedVersion(v)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-[#15151C] border-black dark:border-white shadow-md ring-1 ring-black/10 dark:ring-white/20'
                    : 'bg-neutral-50 dark:bg-black/30 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                {/* Version Title + Tag Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-sm text-neutral-950 dark:text-white">
                      {v.version}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        v.tag === 'LATEST STABLE'
                          ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                          : v.tag === 'BETA'
                          ? 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white border-neutral-400'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {v.tag}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                    {v.releaseDate}
                  </span>
                </div>

                {/* Changelog Description */}
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                  {v.changelog}
                </p>

                {/* Meta Specs & Download Button */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60 dark:border-neutral-800/60 text-[10px] font-mono text-neutral-500">
                  <div className="flex items-center gap-2.5">
                    <span>{v.fileSize}</span>
                    <span>•</span>
                    <span className="truncate max-w-[110px]">{v.targetSdk}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="text-[10px] font-bold text-neutral-950 dark:text-white flex items-center gap-1">
                        <CheckIcon className="w-3 h-3 text-emerald-500" /> Selected
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 hover:text-black dark:hover:text-white underline">
                        Select
                      </span>
                    )}

                    <a
                      href={v.apkUrl}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 px-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-[10px] flex items-center gap-1 hover:opacity-90 shadow-sm"
                      title="Direct Download APK"
                    >
                      <DownloadIcon className="w-3 h-3" />
                      <span>APK</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
