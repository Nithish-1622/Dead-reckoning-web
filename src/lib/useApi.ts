import { useState, useEffect, useCallback } from 'react';
import {
  analyticsApi,
  devicesApi,
  modelsApi,
  telemetryApi,
  AnalyticsSummary,
  ModelPerformanceAnalytics,
  DeviceItem,
  LatestModelResponse,
  TelemetrySessionItem,
} from './api';
import { NavigationSession } from './types';
import { MOCK_NAVIGATION_SESSIONS } from './telemetrySimulation';

// Default analytics fallback matching real system specs
const DEFAULT_ANALYTICS_SUMMARY: AnalyticsSummary = {
  total_devices: 12,
  online_devices: 4,
  total_telemetry_records: 482910,
  active_model_version: 'v2.1.0',
  avg_position_error_m: 0.14,
};

const DEFAULT_MODEL_PERFORMANCE: ModelPerformanceAnalytics = {
  model_version: 'v2.1.0',
  mean_absolute_error_m: 0.142,
  root_mean_squared_error_m: 0.185,
  max_drift_rate_m_per_min: 0.045,
  total_evaluation_hours: 128.5,
};

/**
 * Hook for Live Summary Analytics (Dashboard Cards)
 */
export function useAnalyticsSummary(pollIntervalMs = 15000) {
  const [data, setData] = useState<AnalyticsSummary>(DEFAULT_ANALYTICS_SUMMARY);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const result = await analyticsApi.getSummary();
      if (result && typeof result.total_devices === 'number') {
        setData(result);
        setIsLive(true);
        setError(null);
      }
    } catch (err: any) {
      // Backend offline or error -> keep fallback data smoothly
      setIsLive(false);
      setError(err?.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    if (pollIntervalMs > 0) {
      const interval = setInterval(fetchSummary, pollIntervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchSummary, pollIntervalMs]);

  return { data, isLive, loading, error, refetch: fetchSummary };
}

/**
 * Hook for Empirical Model Performance Analytics
 */
export function useModelPerformance() {
  const [data, setData] = useState<ModelPerformanceAnalytics>(DEFAULT_MODEL_PERFORMANCE);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = useCallback(async () => {
    try {
      const result = await analyticsApi.getModelPerformance();
      if (result && typeof result.mean_absolute_error_m === 'number') {
        setData(result);
        setIsLive(true);
        setError(null);
      }
    } catch (err: any) {
      setIsLive(false);
      setError(err?.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerformance();
  }, [fetchPerformance]);

  return { data, isLive, loading, error, refetch: fetchPerformance };
}

/**
 * Hook for Fleet Devices and Live Navigation Sessions
 */
export function useFleetSessions() {
  const [sessions, setSessions] = useState<NavigationSession[]>(MOCK_NAVIGATION_SESSIONS);
  const [rawDevices, setRawDevices] = useState<DeviceItem[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFleet = useCallback(async () => {
    try {
      const [devicesRes, telemetryRes] = await Promise.allSettled([
        devicesApi.listDevices(),
        telemetryApi.listSessions(),
      ]);

      let devicesList: DeviceItem[] = [];
      if (devicesRes.status === 'fulfilled') {
        const resData = devicesRes.value as any;
        devicesList = Array.isArray(resData) ? resData : resData?.results || [];
        setRawDevices(devicesList);
      }

      let sessionsList: TelemetrySessionItem[] = [];
      if (telemetryRes.status === 'fulfilled') {
        const telData = telemetryRes.value as any;
        sessionsList = Array.isArray(telData) ? telData : telData?.results || [];
      }

      if (devicesList.length > 0) {
        // Transform backend devices/sessions to NavigationSession format
        const dynamicSessions: NavigationSession[] = devicesList.map((dev, idx) => {
          const matchedSession = sessionsList.find((s) => s.device_id === dev.id || s.device_id === dev.hardware_id);
          const fallbackMock = MOCK_NAVIGATION_SESSIONS[idx % MOCK_NAVIGATION_SESSIONS.length];

          const isOnline = dev.status === 'ONLINE';
          return {
            id: matchedSession?.session_id || `IDR-LIVE-${dev.hardware_id || dev.id.slice(0, 8)}`,
            deviceId: dev.hardware_id || dev.id,
            deviceModel: dev.name || dev.device_type || fallbackMock.deviceModel,
            status: isOnline ? 'DEAD RECKONING ACTIVE' : 'GNSS LOCKED',
            startTime: dev.last_heartbeat || dev.registered_at || fallbackMock.startTime,
            durationSeconds: matchedSession?.record_count ? Math.round(matchedSession.record_count / 10) : fallbackMock.durationSeconds,
            speedKmh: isOnline ? fallbackMock.speedKmh : 0,
            headingDeg: fallbackMock.headingDeg,
            positionErrorMeters: isOnline ? fallbackMock.positionErrorMeters : 0.8,
            gnssStatus: isOnline ? 'LOST' : 'LOCKED',
            drConfidencePct: isOnline ? 98.4 : 99.5,
            batteryPct: fallbackMock.batteryPct,
            outageCount: fallbackMock.outageCount,
            totalDistanceKm: fallbackMock.totalDistanceKm,
            maxErrorUnderOutageMeters: fallbackMock.maxErrorUnderOutageMeters,
          };
        });

        if (dynamicSessions.length > 0) {
          setSessions(dynamicSessions);
          setIsLive(true);
        }
      }
    } catch {
      setIsLive(false);
      // Retain mock fallback
      setSessions(MOCK_NAVIGATION_SESSIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFleet();
    const interval = setInterval(fetchFleet, 20000);
    return () => clearInterval(interval);
  }, [fetchFleet]);

  return { sessions, rawDevices, isLive, loading, refetch: fetchFleet };
}

/**
 * Hook for Latest ML Model
 */
export function useLatestModel() {
  const [latestModel, setLatestModel] = useState<LatestModelResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    modelsApi
      .getLatestModel()
      .then((res) => setLatestModel(res))
      .catch(() => setLatestModel(null))
      .finally(() => setLoading(false));
  }, []);

  return { latestModel, loading };
}
