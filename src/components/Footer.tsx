import React from 'react';
import { CrosshairIcon, ArrowUpRightIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-100 dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors py-16 text-xs font-mono text-neutral-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-sm">
                <CrosshairIcon className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm tracking-widest text-neutral-950 dark:text-white uppercase font-mono">
                IDR // Dead Reckoning
              </div>
            </div>

            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              Companion engineering platform for on-device smartphone dead reckoning. Maintaining continuous vehicle positioning when GNSS line-of-sight is lost.
            </p>

            <div className="text-[11px] text-neutral-400 pt-2 font-mono">
              BUILD: v1.4.2-RELEASE-NDK26 | SYSTEM COMPATIBLE: ANDROID 11+
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-neutral-950 dark:text-white uppercase tracking-wider">
              TECHNOLOGY
            </div>
            <ul className="space-y-2">
              <li><a href="#product" className="hover:text-black dark:hover:text-white transition-colors">Simulation Console</a></li>
              <li><a href="#problem" className="hover:text-black dark:hover:text-white transition-colors">Outage Matrix</a></li>
              <li><a href="#technology" className="hover:text-black dark:hover:text-white transition-colors">Sensor Chassis</a></li>
              <li><a href="#pipeline" className="hover:text-black dark:hover:text-white transition-colors">8-Stage Flow</a></li>
            </ul>
          </div>

          {/* Verification & Benchmarks */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-neutral-950 dark:text-white uppercase tracking-wider">
              BENCHMARKS
            </div>
            <ul className="space-y-2">
              <li><a href="#performance" className="hover:text-black dark:hover:text-white transition-colors">Empirical Metrics</a></li>
              <li><a href="#monitoring" className="hover:text-black dark:hover:text-white transition-colors">Fleet Observability</a></li>
              <li><a href="#pipeline" className="hover:text-black dark:hover:text-white transition-colors">ONNX INT8 Speed</a></li>
              <li><a href="#install" className="hover:text-black dark:hover:text-white transition-colors">APK Gateway</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-neutral-950 dark:text-white uppercase tracking-wider">
              RESOURCES
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#install" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                  <span>Download APK</span> <ArrowUpRightIcon className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                  <span>Strapdown INS Math</span> <ArrowUpRightIcon className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#monitoring" className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                  <span>Privacy Architecture</span> <ArrowUpRightIcon className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Intelligent Dead Reckoning Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">100% Local Inference</span>
            <span>Zero Cloud Telemetry Tracking</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
