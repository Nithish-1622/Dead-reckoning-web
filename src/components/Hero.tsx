import React from 'react';
import { ArrowRightIcon, TerminalIcon, CpuIcon, CheckIcon } from './Icons';
import { NavigationVisualization } from './NavigationVisualization';
import { ThreeDimensionalBackground } from './ThreeDimensionalBackground';
import { detectDevice } from '../lib/deviceDetection';

export const Hero: React.FC = () => {
  const deviceType = detectDevice();

  return (
    <section id="product" className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      
      {/* 3D Interactive Gyroscope & Celestial Satellite Background */}
      <ThreeDimensionalBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Hero Header */}
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-7">
          
          {/* Top Monochrome Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 shadow-sm text-neutral-900 dark:text-neutral-100 text-[11px] sm:text-xs font-mono font-bold tracking-wide max-w-full truncate">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black dark:bg-white animate-pulse shrink-0" />
            <span className="truncate">AI SENSOR-FUSION | ZERO EXTERNAL HARDWARE</span>
          </div>

          {/* High-Contrast Gradient Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight sm:tracking-[-0.035em] leading-[1.12] sm:leading-[1.06] font-sans bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-500 dark:from-white dark:via-[#F4F4F6] dark:to-[#9E9EA8] bg-clip-text text-transparent drop-shadow-sm select-none">
            Navigation that keeps moving when GNSS disappears.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal px-2 sm:px-0">
            Intelligent Dead Reckoning transforms standard smartphones into industrial-grade inertial navigation systems. Continuous tracking through tunnels, urban canyons, and parking structures.
          </p>

          {/* High-Contrast Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-2 sm:px-0">
            <a
              href="#install"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg group font-mono"
            >
              <TerminalIcon className="w-4 h-4" />
              <span>
                {deviceType === 'android-mobile'
                  ? 'Download Android APK'
                  : deviceType === 'ios-mobile'
                  ? 'View iOS Support'
                  : 'Deploy to Hardware'}
              </span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#pipeline"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs border border-neutral-300 dark:border-neutral-700 transition-all font-semibold"
            >
              <span>Explore 8-Stage Math Pipeline</span>
            </a>
          </div>

          {/* Feature Badges */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-mono text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-neutral-950 dark:text-white shrink-0" /> 200 Hz Strapdown IMU
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-neutral-950 dark:text-white shrink-0" /> 100% On-Device Edge ML
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-neutral-950 dark:text-white shrink-0" /> Zero Cloud Telemetry
            </span>
          </div>

        </div>

        {/* Live Map Navigation Console */}
        <div className="mt-10 sm:mt-14 relative">
          <NavigationVisualization />
        </div>

        {/* Minimalist Monochrome Partner & Hardware Ribbon */}
        <div className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-neutral-200 dark:border-neutral-800 text-center space-y-4 sm:space-y-5">
          <p className="text-[10px] sm:text-xs font-mono text-neutral-500 uppercase tracking-widest font-semibold">
            ENGINEERED & TESTED ON COMMERCIAL SMARTPHONE SILICON
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-10 text-[11px] sm:text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 text-left sm:text-center">
            <div className="flex items-center gap-2">
              <CpuIcon className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0" />
              <span>Qualcomm NDK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:text-white shrink-0" />
              <span>Android HAL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:text-white shrink-0" />
              <span>ONNX INT8</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:text-white shrink-0" />
              <span>OSM Graph</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
