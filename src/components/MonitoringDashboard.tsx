import React, { useState } from 'react';
import { NavigationSession } from './NavigationSession';
import { ServerIcon } from './Icons';
import { useAnalyticsSummary, useFleetSessions } from '../lib/useApi';

export const MonitoringDashboard: React.FC = () => {
  const { data: analytics } = useAnalyticsSummary();
  const { sessions } = useFleetSessions();
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  const currentSessionId = selectedSessionId || (sessions[0]?.id ?? '');
  const selectedSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  return (
    <section id="monitoring" className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-center py-10 sm:py-14 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 transition-colors relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold">
            <ServerIcon className="w-3.5 h-3.5" />
            <span>OBSERVABILITY SUITE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            Live telemetry & vehicle attitude console.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-400">
            Real-time multi-device session observability. Inspect IMU sampling integrity, attitude rates, battery levels, and dead-reckoning state transitions.
          </p>
        </div>

        {/* Global Summary Statistics (Responsive 2x2 Grid on Mobile, 4-Col on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-neutral-50 dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase font-semibold">ACTIVE SESSIONS</div>
            <div className="text-xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white mt-1">
              {analytics?.online_devices ?? sessions.length}
            </div>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-neutral-50 dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase font-semibold">TELEMETRY STREAM</div>
            <div className="text-xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white mt-1">
              {analytics?.total_telemetry_records ? `${(analytics.total_telemetry_records > 1000 ? (analytics.total_telemetry_records / 1000).toFixed(1) + 'k' : analytics.total_telemetry_records)} rec` : '200 Hz'}
            </div>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-neutral-50 dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase font-semibold">EDGE INFERENCE</div>
            <div className="text-xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white mt-1">3.8 ms</div>
          </div>

          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-neutral-50 dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="text-[9px] sm:text-[10px] font-mono text-neutral-500 uppercase font-semibold">MEAN OUTAGE DRIFT</div>
            <div className="text-xl sm:text-3xl font-extrabold font-mono text-neutral-950 dark:text-white mt-1">
              {analytics?.avg_position_error_m !== undefined ? `±${analytics.avg_position_error_m}m` : '0.82%'}
            </div>
          </div>
        </div>

        {/* Master-Detail Session Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Session Queue List (Left 4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1.5 font-semibold">
              Select Fleet Session:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {sessions.map((session) => {
                const isSelected = session.id === currentSessionId;
                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all border ${
                      isSelected
                        ? 'bg-neutral-100 dark:bg-[#15151C] border-black dark:border-white shadow-sm'
                        : 'bg-white dark:bg-[#0D0D12] border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs font-mono truncate text-neutral-950 dark:text-white">{session.deviceModel}</span>
                      <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        session.gnssStatus === 'LOST'
                          ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                          : 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700'
                      }`}>
                        {session.gnssStatus}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                      <span className={isSelected ? 'text-black dark:text-white font-bold' : 'text-neutral-500'}>
                        {session.deviceId}
                      </span>
                      <span className="text-neutral-950 dark:text-white font-bold">
                        {session.speedKmh} km/h
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector View (Right 8 cols) */}
          <div className="lg:col-span-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-xl">
            {selectedSession && <NavigationSession session={selectedSession} />}
          </div>

        </div>

      </div>
    </section>
  );
};

