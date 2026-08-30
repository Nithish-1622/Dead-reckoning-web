import React, { useState } from 'react';
import { TimerIcon, CheckCircleIcon } from './Icons';

interface TimelineEvent {
  timeStr: string;
  seconds: number;
  phase: string;
  gnssState: 'AVAILABLE' | 'DEGRADING' | 'LOST' | 'ACTIVE' | 'RESTORED' | 'RE-FUSED';
  title: string;
  description: string;
  errorBound: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    timeStr: '00:00',
    seconds: 0,
    phase: 'NOMINAL GNSS',
    gnssState: 'AVAILABLE',
    title: 'Open Sky Multi-Constellation Lock',
    description: 'Vehicle tracks 28 satellites across GPS, GLONASS, Galileo, and BeiDou. EKF fuses carrier phase and IMU.',
    errorBound: '0.8 m error'
  },
  {
    timeStr: '00:01',
    seconds: 1,
    phase: 'TRANSITION',
    gnssState: 'DEGRADING',
    title: 'Tunnel Approach & Signal Attenuation',
    description: 'Satellite carrier-to-noise ratio (C/N0) drops below 24 dB-Hz. Outage detection logic prepares inertial handover.',
    errorBound: '1.2 m error'
  },
  {
    timeStr: '00:02',
    seconds: 2,
    phase: 'OUTAGE TRIGGER',
    gnssState: 'LOST',
    title: 'Total GNSS Blackout (0 Satellites)',
    description: 'Satellite signals completely vanish. Conventional GPS navigators freeze. IDR instantaneously engages dead reckoning.',
    errorBound: '1.4 m error'
  },
  {
    timeStr: '00:03',
    seconds: 3,
    phase: 'INERTIAL PROPAGATION',
    gnssState: 'ACTIVE',
    title: 'Dead Reckoning Engaged at 200 Hz',
    description: 'AI model estimates vehicle longitudinal velocity; strapdown INS integrates yaw rate with road-matching constraints.',
    errorBound: '1.7 m error'
  },
  {
    timeStr: '00:10',
    seconds: 10,
    phase: 'SUSTAINED OUTAGE',
    gnssState: 'ACTIVE',
    title: 'Mid-Tunnel Maneuvering Continuity',
    description: 'Vehicle executes lane changes and tunnel curve transitions. Zero lateral slip kinematic constraints prevent drift.',
    errorBound: '2.1 m error'
  },
  {
    timeStr: '00:20',
    seconds: 20,
    phase: 'SIGNAL REACQUISITION',
    gnssState: 'RESTORED',
    title: 'Tunnel Exit & Satellite Lock Re-acquired',
    description: 'First pseudoranges received. Error-state Kalman filter calculates residual innovation vector without jump.',
    errorBound: '1.3 m error'
  },
  {
    timeStr: '00:21',
    seconds: 21,
    phase: 'SMOOTH RE-FUSION',
    gnssState: 'RE-FUSED',
    title: 'Seamless GNSS + INS Covariance Convergence',
    description: 'Position covariance seamlessly contracts back to sub-meter accuracy with 0ms UI stutter or teleportation.',
    errorBound: '0.9 m error'
  }
];

export const GNSSTransition: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(3);
  const currentEvent = TIMELINE_EVENTS[selectedIdx];

  return (
    <section className="py-20 sm:py-28 bg-neutral-100 dark:bg-[#070709] border-t border-neutral-200 dark:border-neutral-800 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
            <TimerIcon className="w-3.5 h-3.5" />
            <span>CONTINUITY TIMELINE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            Seamless outage transition: Second by second.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-400">
            Navigation must not jump, freeze, or drop frames. Observe how IDR maintains unbroken trajectory continuity through complete satellite signal loss and restoration.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-8 space-y-6 sm:space-y-8 shadow-xl">
          
          {/* Track Bar with horizontal scroll on small mobile */}
          <div className="relative overflow-x-auto pb-2 scrollbar-none">
            <div className="min-w-[480px] sm:min-w-0 relative">
              <div className="h-1 bg-neutral-200 dark:bg-neutral-800 w-full rounded-full absolute top-1/2 -translate-y-1/2" />
              
              <div className="grid grid-cols-7 gap-1 sm:gap-2 relative z-10">
                {TIMELINE_EVENTS.map((event, idx) => {
                  const isSelected = selectedIdx === idx;
                  return (
                    <button
                      key={event.timeStr}
                      onClick={() => setSelectedIdx(idx)}
                      className="flex flex-col items-center group focus:outline-none"
                    >
                      <span className={`text-[10px] sm:text-xs font-mono mb-1.5 sm:mb-2 font-medium transition-colors ${isSelected ? 'text-black dark:text-white font-bold' : 'text-neutral-500'}`}>
                        {event.timeStr}
                      </span>
                      <div
                        className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent scale-110 shadow-md'
                            : 'bg-white dark:bg-[#15151A] text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {event.seconds}s
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 mt-1.5 sm:mt-2 truncate w-full text-center hidden md:block">
                        {event.phase}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Event Showcase */}
          <div className="p-4 sm:p-8 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-200 dark:border-neutral-800 space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="px-2.5 sm:px-3.5 py-1 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono text-[11px] sm:text-xs font-bold shadow-sm">
                  T + {currentEvent.timeStr}
                </div>
                <span className="px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700">
                  {currentEvent.phase}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-neutral-500 text-[11px]">ACCURACY:</span>
                <span className="font-bold text-neutral-950 dark:text-white">{currentEvent.errorBound}</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-lg sm:text-2xl font-bold text-neutral-950 dark:text-white leading-snug">
                {currentEvent.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {currentEvent.description}
              </p>
            </div>

            {/* Guarantee */}
            <div className="pt-3 sm:pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between text-[11px] sm:text-xs font-mono text-neutral-500 gap-2">
              <div className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100 font-bold">
                <CheckCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black dark:text-white shrink-0" />
                <span>Zero positional teleportation</span>
              </div>
              <div className="text-neutral-500 text-[10px] sm:text-[11px]">
                INNOVATION: &lt; 0.04m
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
