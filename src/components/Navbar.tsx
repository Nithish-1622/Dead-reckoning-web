import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, MenuIcon, XIcon, TerminalIcon, ServerIcon } from './Icons';
import { useTheme } from '../lib/theme';
import { DevConsole } from './DevConsole/DevConsole';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [devConsoleOpen, setDevConsoleOpen] = useState(false);
  const [devConsoleTab, setDevConsoleTab] = useState<
    | 'overview'
    | 'simulation'
    | 'fleet'
    | 'telemetry'
    | 'ml-engine'
    | 'maps'
    | 'config'
    | 'ota'
    | 'datasets'
    | 'security'
  >('overview');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openDashboard = (tab: typeof devConsoleTab = 'overview') => {
    setDevConsoleTab(tab);
    setDevConsoleOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 py-1.5 sm:py-2 shadow-sm'
            : 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 py-1.5 sm:py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo & Wordmark */}
          <a href="#" className="flex items-center group shrink-0 -ml-1.5 sm:-ml-3 md:-ml-4" aria-label="IDR Home">
            <img
              src={theme === 'dark' ? '/idr-logo-light.png' : '/idr-logo-dark.png'}
              alt="IDR - Intelligent Dead Reckoning"
              className="h-10 sm:h-12 md:h-14 lg:h-15 w-auto max-w-[220px] sm:max-w-[300px] md:max-w-[340px] object-contain transition-all group-hover:scale-105 drop-shadow-sm -my-1"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-10 xl:gap-12 text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 tracking-wide">
            <a href="#problem" className="hover:text-black dark:hover:text-white transition-colors py-1">THE PROBLEM</a>
            <a href="#technology" className="hover:text-black dark:hover:text-white transition-colors py-1">TECHNOLOGY</a>
            <a href="#pipeline" className="hover:text-black dark:hover:text-white transition-colors py-1">ARCHITECTURE</a>
            <a href="#monitoring" className="hover:text-black dark:hover:text-white transition-colors py-1">OBSERVABILITY</a>
            <a href="#performance" className="hover:text-black dark:hover:text-white transition-colors py-1">BENCHMARKS</a>
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Polished Glass Live Dashboard CTA Button */}
            <button
              onClick={() => openDashboard('overview')}
              aria-label="Open Live Dashboard"
              className="p-2 px-3.5 rounded-xl bg-gradient-to-b from-white/90 via-white/60 to-neutral-100/70 dark:from-white/[0.12] dark:via-white/[0.06] dark:to-white/[0.02] backdrop-blur-xl border border-neutral-300/80 dark:border-white/15 hover:border-neutral-400 dark:hover:border-white/30 text-neutral-900 dark:text-white transition-all flex items-center gap-2 text-xs font-mono font-bold shadow-xs hover:shadow-sm dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] active:scale-95 group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400"></span>
              </span>
              <ServerIcon className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 group-hover:scale-105 transition-transform" />
              <span>Live Dashboard</span>
            </button>

            {/* Icon-Only Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex items-center justify-center shadow-sm active:scale-95"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-4 h-4 text-neutral-200" />
              ) : (
                <MoonIcon className="w-4 h-4 text-neutral-800" />
              )}
            </button>
          </div>

          {/* Mobile Header Controls */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={() => openDashboard('overview')}
              aria-label="Open Live Dashboard"
              className="p-2 rounded-xl bg-gradient-to-b from-white/90 to-neutral-100/80 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-neutral-300/80 dark:border-white/15 text-neutral-900 dark:text-white flex items-center gap-1.5 shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400"></span>
              </span>
              <ServerIcon className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <XIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white dark:bg-[#0A0A0E] border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 space-y-3 shadow-2xl">
            <nav className="flex flex-col space-y-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              <button
                onClick={() => openDashboard('overview')}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-b from-white/90 to-neutral-100/80 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-neutral-300/80 dark:border-white/15 text-neutral-950 dark:text-white font-bold flex items-center gap-2 text-left shadow-xs"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400"></span>
                </span>
                <ServerIcon className="w-4 h-4" />
                <span>Open Live Dashboard</span>
              </button>
              <a onClick={() => setMobileMenuOpen(false)} href="#problem" className="py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white">The Problem (Outages)</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#technology" className="py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white">Technology & Sensors</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#pipeline" className="py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white">Architecture Flow</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#monitoring" className="py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white">Live Observability</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#performance" className="py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white">Benchmarks</a>
              <a onClick={() => setMobileMenuOpen(false)} href="#install" className="py-3 mt-1 inline-flex justify-center items-center gap-2 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs font-mono">
                <TerminalIcon className="w-3.5 h-3.5" /> Deploy IDR Mobile
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Dev Console / Observatory Dashboard Modal Overlay */}
      <DevConsole
        isOpen={devConsoleOpen}
        onClose={() => setDevConsoleOpen(false)}
        initialTab={devConsoleTab}
      />
    </>
  );
};
