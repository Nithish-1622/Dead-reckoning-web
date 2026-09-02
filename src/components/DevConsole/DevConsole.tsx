import React, { useState, useEffect, useCallback } from 'react';
import {
  ServerIcon,
  XIcon,
  SmartphoneIcon,
  ActivityIcon,
  CpuIcon,
  DownloadIcon,
  ShieldCheckIcon,
  TerminalIcon,
  SparklesIcon,
  ZapIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
  InfoIcon,
} from '../Icons';
import {
  API_BASE_URL,
  analyticsApi,
  devicesApi,
  modelsApi,
  mapsApi,
  telemetryApi,
  configApi,
  otaApi,
  authApi,
  datasetsApi,
  healthApi,
  HealthStatusResponse,
  AnalyticsSummary,
  ModelPerformanceAnalytics,
  DeviceItem,
  MLModelItem,
  LatestModelResponse,
  OfflineMapItem,
  TelemetrySessionItem,
  ConfigProfileItem,
  DatasetItem,
  UserProfile,
  OTACheckResponse,
  getAccessToken,
  clearTokens,
} from '../../lib/api';

import { SimulationStudio } from '../SimulationStudio/SimulationStudio';

interface ObservatoryPlatformProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: TabType;
}

type TabType =
  | 'overview'
  | 'simulation'
  | 'fleet'
  | 'telemetry'
  | 'ml-engine'
  | 'maps'
  | 'config'
  | 'ota'
  | 'datasets'
  | 'security';

export const DevConsole: React.FC<ObservatoryPlatformProps> = ({ isOpen, onClose, initialTab }) => {
  // Authentication State Flow
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAccessToken());
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Auth form fields
  const [loginUsername, setLoginUsername] = useState('engineer_alex');
  const [loginPassword, setLoginPassword] = useState('StrongPassword123!');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'ENGINEER' | 'ADMIN' | 'ANALYST'>('ENGINEER');

  // Active Observatory Tab & Health Check States
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'overview');

  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingHealth, setCheckingHealth] = useState<boolean>(false);
  const [healthStatus, setHealthStatus] = useState<HealthStatusResponse | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Live Backend Data States (Fetched directly from endpoints)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [modelPerf, setModelPerf] = useState<ModelPerformanceAnalytics | null>(null);
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [models, setModels] = useState<MLModelItem[]>([]);
  const [latestModel, setLatestModel] = useState<LatestModelResponse | null>(null);
  const [mapsList, setMapsList] = useState<OfflineMapItem[]>([]);
  const [telemetrySessions, setTelemetrySessions] = useState<TelemetrySessionItem[]>([]);
  const [configProfiles, setConfigProfiles] = useState<ConfigProfileItem[]>([]);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [otaStatus, setOtaStatus] = useState<OTACheckResponse | null>(null);

  // Spatial Map Search Form State
  const [mapSearchLat, setMapSearchLat] = useState('28.55');
  const [mapSearchLon, setMapSearchLon] = useState('77.20');
  const [mapSearchResult, setMapSearchResult] = useState<any>(null);

  // New Device Form State
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceHwId, setNewDeviceHwId] = useState('');

  // Primary Data Fetcher function (Queries all endpoints)
  const fetchBackendData = useCallback(async () => {
    setLoading(true);
    setBackendError(null);

    try {
      // 1. Current user profile
      const userPromise = authApi.getMe().catch(() => null);

      // 2. Analytics Summary
      const summaryPromise = analyticsApi.getSummary().catch((err) => {
        console.warn('Analytics summary error:', err);
        return null;
      });

      // 3. Model Performance Metrics
      const perfPromise = analyticsApi.getModelPerformance().catch(() => null);

      // 4. Devices List
      const devicesPromise = devicesApi.listDevices().catch(() => []);

      // 5. Models List & Latest Model
      const modelsPromise = modelsApi.listModels().catch(() => []);
      const latestModelPromise = modelsApi.getLatestModel().catch(() => null);

      // 6. Maps List
      const mapsPromise = mapsApi.listMaps().catch(() => []);

      // 7. Telemetry Sessions
      const telemetryPromise = telemetryApi.listSessions().catch(() => []);

      // 8. Config Profiles
      const configPromise = configApi.listConfigs().catch(() => []);

      // 9. Datasets List
      const datasetsPromise = datasetsApi.listDatasets().catch(() => []);

      // 10. OTA Check
      const otaPromise = otaApi.checkUpdate({
        hardware_id: 'HW-EDGE-100284',
        current_firmware: 'v1.4.2',
        current_model_version: 'v2.0.0',
      }).catch(() => null);

      // 11. Health / Life Check
      const healthPromise = healthApi.checkHealth().catch(() => null);

      const [
        userRes,
        summaryRes,
        perfRes,
        devRes,
        modRes,
        latestModRes,
        mapRes,
        telRes,
        cfgRes,
        dataRes,
        otaRes,
        healthRes,
      ] = await Promise.all([
        userPromise,
        summaryPromise,
        perfPromise,
        devicesPromise,
        modelsPromise,
        latestModelPromise,
        mapsPromise,
        telemetryPromise,
        configPromise,
        datasetsPromise,
        otaPromise,
        healthPromise,
      ]);

      let isAnyOnline = false;

      if (healthRes) {
        setHealthStatus(healthRes);
        isAnyOnline = true;
      }

      if (userRes) {
        setCurrentUser(userRes);
        setIsAuthenticated(true);
        isAnyOnline = true;
      }

      if (summaryRes) {
        setAnalytics(summaryRes);
        isAnyOnline = true;
      }

      if (perfRes) {
        setModelPerf(perfRes);
        isAnyOnline = true;
      }

      if (devRes) {
        const rawDev = devRes as any;
        const devList = Array.isArray(rawDev) ? rawDev : rawDev?.results || [];
        setDevices(devList);
        if (devList.length > 0) isAnyOnline = true;
      }

      if (modRes) {
        const rawMod = modRes as any;
        const modList = Array.isArray(rawMod) ? rawMod : rawMod?.results || [];
        setModels(modList);
        if (modList.length > 0) isAnyOnline = true;
      }

      if (latestModRes) {
        setLatestModel(latestModRes);
      }

      if (mapRes) {
        const rawMap = mapRes as any;
        const mapList = Array.isArray(rawMap) ? rawMap : rawMap?.results || [];
        setMapsList(mapList);
      }

      if (telRes) {
        const rawTel = telRes as any;
        const telList = Array.isArray(rawTel) ? rawTel : rawTel?.results || [];
        setTelemetrySessions(telList);
      }

      if (cfgRes) {
        const rawCfg = cfgRes as any;
        const cfgList = Array.isArray(rawCfg) ? rawCfg : rawCfg?.results || [];
        setConfigProfiles(cfgList);
      }

      if (dataRes) {
        const rawData = dataRes as any;
        const dataList = Array.isArray(rawData) ? rawData : rawData?.results || [];
        setDatasets(dataList);
      }

      if (otaRes) {
        setOtaStatus(otaRes);
      }

      setBackendOnline(isAnyOnline);
    } catch (err: any) {
      setBackendOnline(false);
      setBackendError(err?.message || 'Failed to communicate with backend server at ' + API_BASE_URL);
    } finally {
      setLoading(false);
    }
  }, []);

  // Manual Health Check Trigger (/health/live)
  const handleVerifyHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await healthApi.checkHealth();
      setHealthStatus(res);
      setBackendOnline(true);
      showNotification(`Backend /health/live check passed: ${res.status.toUpperCase()} (${res.latency_ms} ms)`);
      fetchBackendData();
    } catch (err: any) {
      setBackendOnline(false);
      showNotification(`Backend /health/live failed: ${err?.message || 'Host unreachable'}`);
    } finally {
      setCheckingHealth(false);
    }
  };

  // On open, verify token & start live data fetching with automatic polling
  useEffect(() => {
    if (!isOpen) return;

    fetchBackendData();

    // Live continuous polling interval every 4 seconds
    const interval = setInterval(() => {
      fetchBackendData();
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, fetchBackendData]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Login Handler (Direct POST /api/v1/auth/token/)
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const tokenRes = await authApi.login({
        username: loginUsername,
        password: loginPassword,
      });

      if (tokenRes.access) {
        const user = await authApi.getMe();
        setCurrentUser(user);
        setIsAuthenticated(true);
        showNotification(`Authenticated as ${user.username} (${user.role})`);
        fetchBackendData();
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please verify credentials or backend availability.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Registration Handler (Direct POST /api/v1/auth/register/)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const regRes = await authApi.register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });

      // Automatically login after successful registration
      await authApi.login({
        username: regUsername,
        password: regPassword,
      });

      setCurrentUser({
        id: regRes.id,
        username: regRes.username,
        email: regRes.email,
        role: regRes.role,
        is_active: true,
      });
      setIsAuthenticated(true);
      showNotification(`Registered and authenticated operator ${regRes.username}!`);
      fetchBackendData();
    } catch (err: any) {
      setAuthError(err?.message || 'Registration failed. Please check field requirements.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    setCurrentUser(null);
    setIsAuthenticated(false);
    showNotification('Operator session logged out.');
  };

  // Device Provisioning (Direct POST /api/v1/devices/register/)
  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName || !newDeviceHwId) return;

    try {
      const newDev = await devicesApi.registerDevice({
        hardware_id: newDeviceHwId,
        name: newDeviceName,
        device_type: 'Mobile Edge Device',
        firmware_version: 'v1.5.0',
      });
      showNotification(`Registered hardware unit "${newDev.name}" (${newDev.hardware_id})!`);
      setNewDeviceName('');
      setNewDeviceHwId('');
      fetchBackendData();
    } catch (err: any) {
      showNotification(`Registration error: ${err?.message || 'Failed to register unit'}`);
    }
  };

  // Send Heartbeat (Direct POST /api/v1/devices/<id>/heartbeat/)
  const handleSendHeartbeat = async (deviceId: string) => {
    try {
      const res = await devicesApi.sendHeartbeat(deviceId, {
        battery_level: 94.0,
        cpu_usage_pct: 28.5,
        memory_usage_pct: 42.0,
        status: 'ONLINE',
      });
      showNotification(`Heartbeat acknowledged: ${res.status || 'OK'} at ${res.timestamp || new Date().toLocaleTimeString()}`);
      fetchBackendData();
    } catch (err: any) {
      showNotification(`Heartbeat error: ${err?.message || 'Failed'}`);
    }
  };

  // Model Publishing (Direct POST /api/v1/models/<id>/publish/)
  const handlePublishModel = async (modelId: string) => {
    try {
      const res = await modelsApi.publishModel(modelId);
      showNotification(`Model ${modelId} activated: ${res.message || 'Published to edge nodes'}`);
      fetchBackendData();
    } catch (err: any) {
      showNotification(`Model publish error: ${err?.message || 'Failed'}`);
    }
  };

  // Model Approval (Direct POST /api/v1/models/<id>/approve/)
  const handleApproveModel = async (modelId: string) => {
    try {
      const res = await modelsApi.approveModel(modelId);
      showNotification(`Model approved: ${res.message || 'Approved for rollout'}`);
      fetchBackendData();
    } catch (err: any) {
      showNotification(`Model approval error: ${err?.message || 'Failed'}`);
    }
  };

  // Map Lookup Action (Direct POST /api/v1/maps/lookup/)
  const handleMapLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await mapsApi.lookupMap({
        latitude: parseFloat(mapSearchLat) || 28.55,
        longitude: parseFloat(mapSearchLon) || 77.2,
        zoom_level: 14,
      });
      setMapSearchResult(res.matching_package);
      showNotification(`Map package located: ${res.matching_package?.name || 'Match found'}`);
    } catch (err: any) {
      showNotification(`Map lookup error: ${err?.message || 'Package not found for coordinates'}`);
    }
  };

  // Ingest Telemetry Sample (Direct POST /api/v1/telemetry/batch/)
  const handleIngestTelemetry = async () => {
    try {
      const targetDeviceId = devices[0]?.id || 'd1e2f3a4-b5c6-7890-1234-56789abcdef0';
      const res = await telemetryApi.sendBatch({
        device_id: targetDeviceId,
        session_id: `sess-${Math.floor(100000 + Math.random() * 900000)}`,
        records: [
          {
            timestamp: new Date().toISOString(),
            ax: 0.012,
            ay: -0.005,
            az: 9.806,
            gx: 0.001,
            gy: 0.002,
            gz: -0.001,
            estimated_lat: 28.5501,
            estimated_lon: 77.2005,
          },
        ],
      });
      showNotification(`Telemetry batch ingested: ${res.records_ingested} records (Session: ${res.session_id})`);
      fetchBackendData();
    } catch (err: any) {
      showNotification(`Telemetry ingest error: ${err?.message || 'Failed'}`);
    }
  };

  // Push OTA Update Check (Direct POST /api/v1/ota/check/)
  const handlePushOTACheck = async () => {
    try {
      const targetHwId = devices[0]?.hardware_id || 'HW-EDGE-100284';
      const res = await otaApi.checkUpdate({
        hardware_id: targetHwId,
        current_firmware: devices[0]?.firmware_version || 'v1.4.2',
        current_model_version: analytics?.active_model_version || 'v2.0.0',
      });
      setOtaStatus(res);
      showNotification(`OTA Status: ${res.update_available ? 'Update Available (' + res.target_firmware + ')' : 'Hardware is Up to Date'}`);
    } catch (err: any) {
      showNotification(`OTA Check error: ${err?.message || 'Failed'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-white dark:bg-[#06060A] flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100 animate-in fade-in duration-200">
      
      {/* Dynamic Top Control Header */}
      <div className="px-3.5 sm:px-6 py-2.5 bg-white dark:bg-[#0A0A0E] border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between gap-3 relative z-30 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Icon-Only Landing Page Navigation Button */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800 transition-colors flex items-center justify-center shrink-0 active:scale-95"
            title="Return to Landing Page (ESC)"
            aria-label="Return to Landing Page"
          >
            <span className="text-sm font-mono font-bold leading-none">←</span>
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>

          {/* Structured & Compact Dashboard Brand Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs shrink-0">
              <ServerIcon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xs sm:text-sm font-mono font-bold tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
                  IDR MISSION CONTROL & LIVE DASHBOARD
                </h1>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/80 shrink-0">
                  {isAuthenticated ? 'AUTHENTICATED' : 'AUTH GATEWAY'}
                </span>
              </div>
              <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                Connected Backend: <code className="text-neutral-700 dark:text-neutral-300">{API_BASE_URL}</code>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              {/* Live Backend /health/live Status Badge / Probe Button */}
              <button
                onClick={handleVerifyHealth}
                disabled={checkingHealth}
                title="Probe backend /health/live status and latency"
                className="h-8 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-medium flex items-center gap-2 transition-colors active:scale-95"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    checkingHealth
                      ? 'bg-blue-500 animate-spin'
                      : backendOnline
                      ? 'bg-emerald-500 animate-ping'
                      : 'bg-amber-500'
                  }`}
                />
                <span className="text-neutral-800 dark:text-neutral-200">
                  {checkingHealth
                    ? 'Testing...'
                    : backendOnline
                    ? `LIVE ${healthStatus?.latency_ms ? `(${healthStatus.latency_ms}ms)` : ''}`
                    : 'Probe Health'}
                </span>
              </button>

              {/* Sync Trigger Button */}
              <button
                onClick={fetchBackendData}
                disabled={loading}
                title="Fetch latest data from all backend endpoints"
                className="h-8 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <ActivityIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Fetch Live</span>
              </button>

              {/* Log Out Button */}
              <button
                onClick={handleLogout}
                className="h-8 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 font-mono text-xs font-medium transition-colors"
              >
                Log Out
              </button>
            </>
          )}

          {/* Close Dashboard Button */}
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors shrink-0 active:scale-95"
            aria-label="Close Dashboard"
            title="Close Dashboard (ESC)"
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Notification Toast Banner */}
      {actionNotice && (
        <div className="px-6 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono flex items-center justify-between animate-in slide-in-from-top duration-150 shrink-0">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <span className="text-[10px] opacity-75">Live backend response</span>
        </div>
      )}

      {/* Backend Offline Warning Banner */}
      {!backendOnline && (
        <div className="px-6 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-mono flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 font-bold">
            <span>⚠</span>
            <span>
              Target backend server at <code>{API_BASE_URL}</code>: {backendError || 'Currently connecting or offline.'}
            </span>
          </div>
          <button
            onClick={fetchBackendData}
            className="underline font-bold hover:opacity-80"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW 1: AUTHENTICATION / LOGIN GATEWAY (If not authenticated) */}
      {/* ------------------------------------------------------------- */}
      {!isAuthenticated ? (
        <div className="flex-grow flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto bg-neutral-100/80 dark:bg-[#06060A]">
          <div className="w-full max-w-4xl rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            
            {/* Left Column: Mission Control Identity Brief (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#08080C] to-[#0D0E17] text-white p-7 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800 relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                
                {/* Status Pill & Header */}
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>EDGE TELEMETRY GATEWAY</span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="p-2.5 rounded-2xl bg-white text-black shadow-lg shrink-0">
                      <ShieldCheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold font-mono tracking-tight text-white">
                        IDR MISSION CONTROL
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        Hardware & Neural Fusion Console
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed font-mono">
                  Authorized operator gateway to live inertial dead-reckoning telemetry, 200 Hz sensor fusion, and active ONNX edge model weights.
                </p>

                {/* Streamlined Capability Badges */}
                <div className="space-y-2.5 pt-1">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <ActivityIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-xs font-mono">
                      <span className="font-bold text-white block">200 Hz Strapdown IMU Fusion</span>
                      <span className="text-[11px] text-neutral-400">Micro-vibration & kinematic speed regression</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <CpuIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="text-xs font-mono">
                      <span className="font-bold text-white block">Active Neural Engine ({analytics?.active_model_version || 'v2.1.0'})</span>
                      <span className="text-[11px] text-neutral-400">MAE ±{modelPerf?.mean_absolute_error_m || '0.14'}m on-device inference</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <TerminalIcon className="w-4 h-4 text-purple-400 shrink-0" />
                    <div className="text-xs font-mono">
                      <span className="font-bold text-white block">Zero-Trust Operator Clearance</span>
                      <span className="text-[11px] text-neutral-400">Encrypted JWT tokens & fleet access control</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Connection Status Strip */}
              <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400 relative z-10">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="truncate max-w-[180px]">{API_BASE_URL}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300 font-bold text-[10px]">
                  TLS 1.3
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Login / Register Form (7 Cols) */}
            <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-between space-y-6 bg-white dark:bg-[#0D0D12]">
              
              <div className="space-y-6">
                {/* Top Mode Switcher Header */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                      OPERATOR CLEARANCE
                    </div>
                    <h4 className="text-base sm:text-lg font-bold font-mono text-neutral-950 dark:text-white mt-0.5">
                      {authMode === 'login' ? 'Operator Sign In' : 'Register Operator Clearance'}
                    </h4>
                  </div>

                  {/* Mode Switcher Pill */}
                  <div className="p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-1 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        authMode === 'login'
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setAuthError(null);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        authMode === 'register'
                          ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      Register
                    </button>
                  </div>
                </div>

                {/* Error Notification Banner */}
                {authError && (
                  <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-mono flex items-center gap-2">
                    <span className="font-bold text-red-500">⚠</span>
                    <span>{authError}</span>
                  </div>
                )}

                {/* 1. Login Mode Form */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 block">
                        OPERATOR USERNAME:
                      </label>
                      <input
                        type="text"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        required
                        placeholder="engineer_alex"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-inner"
                      />
                      <div className="text-[10px] font-mono text-neutral-500 pt-0.5">
                        Default dev credentials: <span className="text-neutral-900 dark:text-neutral-300 font-bold">engineer_alex / alexpass123</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 block">
                        PASSWORD:
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 rounded-2xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-all shadow-inner"
                      />
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
                      >
                        {authLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Authenticating with Backend...</span>
                          </>
                        ) : (
                          <>
                            <span>Authenticate & Enter Live Dashboard</span>
                            <ArrowUpRightIcon className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoginSubmit()}
                        className="w-full py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-bold hover:border-black dark:hover:border-white transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <SparklesIcon className="w-4 h-4 text-emerald-500" />
                        <span>One-Click Dev Access (engineer_alex)</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. Register Mode Form */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 block">
                          USERNAME:
                        </label>
                        <input
                          type="text"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          required
                          placeholder="engineer_sarah"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 block">
                          EMAIL ADDRESS:
                        </label>
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required
                          placeholder="sarah@idr.io"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 block">
                          PASSWORD:
                        </label>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          placeholder="StrongPassword123!"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white text-neutral-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 block">
                          CLEARANCE ROLE:
                        </label>
                        <select
                          value={regRole}
                          onChange={(e: any) => setRegRole(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white text-neutral-900 dark:text-white"
                        >
                          <option value="ENGINEER">ENGINEER (Telemetry Ops)</option>
                          <option value="ADMIN">ADMIN (Full Fleet Control)</option>
                          <option value="ANALYST">ANALYST (Observability)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
                      >
                        {authLoading ? 'Provisioning Operator...' : 'Register Clearance & Enter Live Dashboard'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Clean Footer Note */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>IDR Dead Reckoning Core v1.4.2</span>
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Secure Bearer Session</span>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* VIEW 2: AUTHENTICATED OBSERVATORY DASHBOARD CONSOLE           */
        /* ------------------------------------------------------------- */
        <div className="flex flex-1 overflow-hidden w-full">
          
          {/* Left Sleek Compact Sidebar (270px Fixed) */}
          <aside className="w-64 lg:w-[270px] shrink-0 border-r border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-[#07070B] flex flex-col justify-between overflow-y-auto p-3 space-y-4">
            <div className="space-y-4">
              
              {/* Group 1: Navigation & Simulation */}
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase px-2 py-1">
                  NAVIGATION
                </div>
                {[
                  { id: 'overview' as const, label: 'Cockpit Overview', icon: ServerIcon, badge: 'LIVE' },
                  { id: 'simulation' as const, label: 'Simulation Studio', icon: SparklesIcon, badge: '5 BENCH' },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  const isSimulation = tab.id === 'simulation';
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                          : isSimulation
                          ? 'text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/90 dark:border-blue-800/70 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/40'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40 hover:text-neutral-950 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-3.5 h-3.5 shrink-0 stroke-[1.75] ${isSimulation && !isSelected ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950'
                            : isSimulation
                            ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                            : tab.badge === 'LIVE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Group 2: Edge Fleet & Telemetry */}
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase px-2 py-1">
                  FLEET & SENSORS
                </div>
                {[
                  { id: 'fleet' as const, label: 'Hardware Fleet', icon: SmartphoneIcon, count: devices.length },
                  { id: 'telemetry' as const, label: 'Telemetry Stream', icon: ActivityIcon, count: telemetrySessions.length },
                  { id: 'datasets' as const, label: 'Sensor Datasets', icon: InfoIcon, count: datasets.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40 hover:text-neutral-950 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-3.5 h-3.5 shrink-0 stroke-[1.75]" />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950' : 'text-neutral-500 dark:text-neutral-400'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Group 3: Neural & Algorithms */}
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase px-2 py-1">
                  NEURAL & ENGINE
                </div>
                {[
                  { id: 'ml-engine' as const, label: 'ML Models & Weights', icon: CpuIcon, badge: analytics?.active_model_version || 'v2.1' },
                  { id: 'config' as const, label: 'Kalman & Sync', icon: ShieldCheckIcon, count: configProfiles.length },
                  { id: 'maps' as const, label: 'Vector Road Maps', icon: DownloadIcon, count: mapsList.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40 hover:text-neutral-950 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-3.5 h-3.5 shrink-0 stroke-[1.75]" />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.badge && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950' : 'text-neutral-500 dark:text-neutral-400'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                      {tab.count !== undefined && (
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-950' : 'text-neutral-500 dark:text-neutral-400'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Group 4: Operations */}
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase px-2 py-1">
                  OPERATIONS
                </div>
                {[
                  { id: 'ota' as const, label: 'OTA Firmware', icon: TerminalIcon },
                  { id: 'security' as const, label: 'Operator Clearance', icon: ShieldCheckIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40 hover:text-neutral-950 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className="w-3.5 h-3.5 shrink-0 stroke-[1.75]" />
                        <span className="truncate">{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Compact Professional Operator Footer */}
            {currentUser && (
              <div className="pt-2.5 border-t border-neutral-200 dark:border-neutral-800/70 p-2 rounded-lg bg-white dark:bg-[#0B0B0F] border border-neutral-200/70 dark:border-neutral-800/50 shadow-2xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                    {currentUser.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs font-mono text-neutral-900 dark:text-neutral-100 truncate leading-tight">
                      {currentUser.username}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 truncate leading-none mt-0.5">
                      {currentUser.role}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Log out operator"
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 text-[10px] font-mono"
                >
                  Exit
                </button>
              </div>
            )}
          </aside>

          {/* Right Main Observatory Canvas (Fluid Flex-1) */}
          <main className="flex-1 overflow-y-auto bg-neutral-100/40 dark:bg-[#050508] p-4 sm:p-6 lg:p-7 space-y-5">
            
            {/* 1. OVERVIEW COCKPIT TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                
                {/* 4 Professional KPI Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A0A0E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase font-medium">
                      <span>ACTIVE FLEET</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-950 dark:text-white">
                      {analytics?.online_devices ?? devices.filter((d) => d.status === 'ONLINE').length}{' '}
                      <span className="text-xs text-neutral-400 font-normal">
                        / {analytics?.total_devices ?? devices.length}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      ● Live Stream Ingestion
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A0A0E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase font-medium">
                      <span>TELEMETRY INGESTION</span>
                      <ActivityIcon className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-950 dark:text-white">
                      {analytics?.total_telemetry_records
                        ? (analytics.total_telemetry_records > 1000 ? (analytics.total_telemetry_records / 1000).toFixed(1) + 'k' : analytics.total_telemetry_records)
                        : telemetrySessions.reduce((acc, s) => acc + s.record_count, 0) || '0'}{' '}
                      <span className="text-xs text-neutral-400 font-normal">logs</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      200 Hz IMU buffer
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A0A0E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase font-medium">
                      <span>ACTIVE MODEL ERROR</span>
                      <CpuIcon className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-950 dark:text-white">
                      ±{modelPerf?.mean_absolute_error_m ?? analytics?.avg_position_error_m ?? '0.14'}{' '}
                      <span className="text-xs text-neutral-400 font-normal">m</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      RMSE {modelPerf?.root_mean_squared_error_m ?? '0.18'} m
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#0A0A0E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase font-medium">
                      <span>MAX DRIFT RATE</span>
                      <ShieldCheckIcon className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-neutral-950 dark:text-white">
                      {modelPerf?.max_drift_rate_m_per_min ?? '0.045'}{' '}
                      <span className="text-xs text-neutral-400 font-normal">m/min</span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      128.5 hrs logged
                    </div>
                  </div>
                </div>

                {/* Simulation Studio Launchpad & Live Pulse Actions (7/5 Split) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  
                  {/* Left (7 Cols): Highlighted Simulation Studio Launchpad */}
                  <div className="lg:col-span-7 p-5 rounded-xl bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 dark:from-blue-950/40 dark:via-[#0A0A0E] dark:to-blue-950/20 border-2 border-blue-500/40 dark:border-blue-500/50 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
                    <div className="space-y-1.5 relative z-10">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 uppercase">
                        <SparklesIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>SIMULATION STUDIO & MAP ENGINE • FEATURED</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold font-mono text-neutral-950 dark:text-white">
                        5 Navigation Outage Benchmarks
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 font-mono leading-relaxed">
                        Evaluate dead-reckoning accuracy across pre-configured multi-level tunnels, urban canyons, and satellite dropouts in real time.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-blue-200/80 dark:border-blue-900/60 relative z-10">
                      <span className="text-[11px] font-mono text-blue-800 dark:text-blue-300 font-medium">
                        Leaflet & Mapbox Tile Engine
                      </span>
                      <button
                        onClick={() => setActiveTab('simulation')}
                        className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 active:scale-98 transition-all shadow-sm shadow-blue-500/30"
                      >
                        <ZapIcon className="w-3.5 h-3.5 text-amber-300" />
                        <span>Launch Simulation Studio →</span>
                      </button>
                    </div>
                  </div>

                  {/* Right (5 Cols): Live Ingestion Trigger */}
                  <div className="lg:col-span-5 p-5 rounded-xl bg-white dark:bg-[#0A0A0E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                        <TerminalIcon className="w-3.5 h-3.5 text-emerald-500" />
                        <span>TELEMETRY INGESTION</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold font-mono text-neutral-950 dark:text-white">
                        Transmit IMU Sample
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono leading-relaxed">
                        Emit synchronized 200 Hz accelerometer/gyro stream to <code className="text-neutral-700 dark:text-neutral-300">/api/v1/telemetry/batch/</code>.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
                      <button
                        onClick={handleIngestTelemetry}
                        className="w-full py-1.5 px-3.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                      >
                        <ActivityIcon className="w-3.5 h-3.5" />
                        <span>Send Telemetry Pulse</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Fleet Status & Active Neural Model Side-by-Side (50/50) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                  
                  {/* Hardware Edge Units Card */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#0A0A0E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-3.5 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/60">
                        <div className="flex items-center gap-2 font-mono font-bold text-xs text-neutral-950 dark:text-white">
                          <SmartphoneIcon className="w-3.5 h-3.5 text-neutral-400" />
                          <span>EDGE HARDWARE FLEET</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('fleet')}
                          className="text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white font-medium"
                        >
                          Fleet ({devices.length}) →
                        </button>
                      </div>

                      {devices.length === 0 ? (
                        <div className="p-5 rounded-lg bg-neutral-50 dark:bg-black/20 border border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-2">
                          <p className="text-xs font-mono text-neutral-400">No active hardware edge units registered.</p>
                          <button
                            onClick={() => setActiveTab('fleet')}
                            className="px-3 py-1 rounded-md bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-mono text-xs font-semibold"
                          >
                            + Provision Device
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {devices.slice(0, 3).map((dev) => (
                            <div
                              key={dev.id}
                              className="p-2.5 rounded-lg bg-neutral-50/60 dark:bg-black/30 border border-neutral-200/60 dark:border-neutral-800/50 flex items-center justify-between text-xs font-mono"
                            >
                              <div>
                                <div className="font-semibold text-neutral-950 dark:text-white">{dev.name}</div>
                                <div className="text-[10px] text-neutral-400">
                                  {dev.hardware_id} • FW {dev.firmware_version}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  dev.status === 'ONLINE'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                                }`}>
                                  {dev.status}
                                </span>
                                <button
                                  onClick={() => handleSendHeartbeat(dev.id)}
                                  className="px-2 py-0.5 rounded bg-neutral-200/80 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-[10px]"
                                >
                                  Ping
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span>Gateway Polling</span>
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">200 Hz WebSocket</span>
                    </div>
                  </div>

                  {/* Active Neural Model Card */}
                  <div className="p-5 rounded-xl bg-white dark:bg-[#0A0A0E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xs space-y-3.5 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/60">
                        <div className="flex items-center gap-2 font-mono font-bold text-xs text-neutral-950 dark:text-white">
                          <CpuIcon className="w-3.5 h-3.5 text-neutral-400" />
                          <span>EDGE NEURAL MODEL</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                          {latestModel?.version || analytics?.active_model_version || 'v2.1.0'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-neutral-50/60 dark:bg-black/30 border border-neutral-200/60 dark:border-neutral-800/50 space-y-2 text-xs font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Model Name:</span>
                          <span className="font-semibold text-neutral-950 dark:text-white">
                            {latestModel?.name || models[0]?.name || 'idr_dead_reckoning_lstm'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Architecture:</span>
                          <span className="font-semibold text-neutral-950 dark:text-white">
                            {latestModel?.architecture || models[0]?.architecture || 'LSTM-ResNet Hybrid'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Inference Latency:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">3.8 ms (ONNX INT8)</span>
                        </div>
                        <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/40 flex justify-between items-center text-[10px]">
                          <span className="text-neutral-400">SHA-256:</span>
                          <code className="text-neutral-600 dark:text-neutral-300 truncate max-w-[160px]">
                            {latestModel?.checksum_sha256 || models[0]?.checksum_sha256 || '8f434346648f...'}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span>Quantization: INT8 TensorRT</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">● Edge Deployed</span>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. IDR SIMULATION ENGINE TAB */}
            {activeTab === 'simulation' && (
              <div className="space-y-6">
                <SimulationStudio isEmbedded={true} />
              </div>
            )}

            {/* 3. FLEET & DEVICES TAB */}
            {activeTab === 'fleet' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-neutral-950 dark:text-white">Edge Navigation Device Fleet</h3>
                      <p className="text-xs text-neutral-500 font-mono">Live units fetched from <code>/api/v1/devices/</code></p>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                      {devices.length} Registered Units
                    </span>
                  </div>

                  <form onSubmit={handleRegisterDevice} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="Unit Name (e.g. NavUnit-Metro-Delta)"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                      required
                      className="px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white"
                    />
                    <input
                      type="text"
                      placeholder="Hardware ID (e.g. HW-EDGE-100290)"
                      value={newDeviceHwId}
                      onChange={(e) => setNewDeviceHwId(e.target.value)}
                      required
                      className="px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono focus:outline-none focus:border-black dark:focus:border-white"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
                    >
                      <SmartphoneIcon className="w-3.5 h-3.5" />
                      <span>Provision Device</span>
                    </button>
                  </form>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl overflow-x-auto">
                  {devices.length === 0 ? (
                    <div className="p-8 text-center font-mono text-neutral-500 text-xs">
                      No devices returned from backend. Use the form above to register edge navigation units.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 pb-2">
                          <th className="pb-3 font-bold">UNIT NAME</th>
                          <th className="pb-3 font-bold">HARDWARE ID</th>
                          <th className="pb-3 font-bold">STATUS</th>
                          <th className="pb-3 font-bold">FIRMWARE</th>
                          <th className="pb-3 font-bold">LAST HEARTBEAT</th>
                          <th className="pb-3 font-bold text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {devices.map((device) => (
                          <tr key={device.id} className="hover:bg-neutral-50 dark:hover:bg-black/30 transition-colors">
                            <td className="py-3.5 font-bold text-neutral-950 dark:text-white">{device.name}</td>
                            <td className="py-3.5">
                              <code className="text-[11px] text-neutral-700 dark:text-neutral-300">{device.hardware_id}</code>
                            </td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                device.status === 'ONLINE'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                              }`}>
                                {device.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-neutral-600 dark:text-neutral-400">{device.firmware_version}</td>
                            <td className="py-3.5 text-neutral-500 text-[10px]">
                              {device.last_heartbeat ? new Date(device.last_heartbeat).toLocaleTimeString() : 'N/A'}
                            </td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => handleSendHeartbeat(device.id)}
                                className="px-3 py-1 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-[10px] hover:opacity-80 transition-all"
                              >
                                Send Heartbeat
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* 3. TELEMETRY & OUTAGES TAB */}
            {activeTab === 'telemetry' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-neutral-950 dark:text-white">Logged Telemetry Sessions</h3>
                      <p className="text-xs text-neutral-500 font-mono">Live sessions fetched from <code>/api/v1/telemetry/sessions/</code></p>
                    </div>
                    <button
                      onClick={handleIngestTelemetry}
                      className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center gap-1.5"
                    >
                      <ActivityIcon className="w-3.5 h-3.5" /> Ingest Batch Sample
                    </button>
                  </div>

                  {telemetrySessions.length === 0 ? (
                    <div className="p-8 text-center font-mono text-neutral-500 text-xs">
                      No telemetry sessions recorded yet. Hit "Ingest Batch Sample" to push sensor packets.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {telemetrySessions.map((session) => (
                        <div
                          key={session.session_id}
                          className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 space-y-3 font-mono text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-950 dark:text-white">{session.session_id}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">
                              {session.record_count} Records
                            </span>
                          </div>
                          <div className="text-neutral-500 text-[11px]">
                            Device: <span className="text-neutral-900 dark:text-white font-bold">{session.device_name || session.device_id}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 pt-2">
                            <span>Start: {session.start_time}</span>
                            <span>IMU Ingestion Verified</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. ML MODELS TAB */}
            {activeTab === 'ml-engine' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-neutral-950 dark:text-white">Dead Reckoning ML Navigation Models</h3>
                      <p className="text-xs text-neutral-500 font-mono">Models fetched from <code>/api/v1/models/</code></p>
                    </div>
                  </div>

                  {models.length === 0 ? (
                    <div className="p-8 text-center font-mono text-neutral-500 text-xs">
                      No ML models registered in backend database.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {models.map((mod) => (
                        <div
                          key={mod.id}
                          className={`p-5 rounded-2xl border transition-all space-y-3 font-mono text-xs ${
                            mod.is_active
                              ? 'bg-neutral-50 dark:bg-[#15151F] border-black dark:border-white shadow-md'
                              : 'bg-white dark:bg-black/40 border-neutral-200 dark:border-neutral-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-neutral-950 dark:text-white">{mod.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800">
                                {mod.version}
                              </span>
                              {mod.is_active && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                                  ACTIVE FOR EDGE
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {mod.status !== 'APPROVED' && mod.status !== 'PUBLISHED' && (
                                <button
                                  onClick={() => handleApproveModel(mod.id)}
                                  className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-xs"
                                >
                                  Approve Model
                                </button>
                              )}
                              {!mod.is_active && (
                                <button
                                  onClick={() => handlePublishModel(mod.id)}
                                  className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-80"
                                >
                                  Publish as Active Model
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-neutral-600 dark:text-neutral-400">
                            <div>Architecture: <span className="font-bold text-neutral-950 dark:text-white">{mod.architecture}</span></div>
                            <div>Mean Position Error (MAE): <span className="font-bold text-emerald-600 dark:text-emerald-400">{mod.mae_position_m !== undefined ? mod.mae_position_m + ' m' : 'N/A'}</span></div>
                            <div>Status: <span className="font-bold text-neutral-950 dark:text-white">{mod.status}</span></div>
                          </div>

                          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
                            <span className="truncate max-w-[280px]">Checksum: <code>{mod.checksum_sha256}</code></span>
                            <span className="text-neutral-700 dark:text-neutral-300 font-bold">{mod.download_url}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. OFFLINE MAPS TAB */}
            {activeTab === 'maps' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-neutral-950 dark:text-white">Spatial Map Package Lookup</h3>
                      <p className="text-xs text-neutral-500 font-mono">Direct lookup via <code>/api/v1/maps/lookup/</code></p>
                    </div>
                  </div>

                  <form onSubmit={handleMapLookup} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Latitude (e.g. 28.55)"
                      value={mapSearchLat}
                      onChange={(e) => setMapSearchLat(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Longitude (e.g. 77.20)"
                      value={mapSearchLon}
                      onChange={(e) => setMapSearchLon(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-black/50 border border-neutral-300 dark:border-neutral-700 text-xs font-mono focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                      <span>Lookup Offline Package</span>
                    </button>
                  </form>

                  {mapSearchResult && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs font-mono space-y-1">
                      <div className="font-bold text-emerald-900 dark:text-emerald-200">
                        ✓ Matching Package: {mapSearchResult.name} (ID: {mapSearchResult.id})
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-400 text-[11px]">
                        Download URL: {mapSearchResult.download_url}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                  <h4 className="text-xs font-mono font-bold uppercase text-neutral-500">
                    Registered Vector Tile Packages ({mapsList.length})
                  </h4>
                  {mapsList.length === 0 ? (
                    <div className="p-6 text-center font-mono text-neutral-500 text-xs">
                      No offline map packages registered in backend.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mapsList.map((mp) => (
                        <div
                          key={mp.id}
                          className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-950 dark:text-white">{mp.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">
                              {(mp.file_size_bytes / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          </div>
                          <div className="text-neutral-500 text-[11px]">
                            Zoom Levels: {mp.zoom_levels?.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. CONFIG TAB */}
            {activeTab === 'config' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                  <div>
                    <h3 className="text-base font-bold text-neutral-950 dark:text-white">System & Kalman Filter Noise Profiles</h3>
                    <p className="text-xs text-neutral-500 font-mono">Live configurations fetched from <code>/api/v1/config/</code></p>
                  </div>

                  {configProfiles.length === 0 ? (
                    <div className="p-6 text-center font-mono text-neutral-500 text-xs">
                      No configuration profiles returned from backend.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {configProfiles.map((cfg) => (
                        <div
                          key={cfg.id}
                          className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-950 dark:text-white">{cfg.profile_name}</span>
                            {cfg.is_default && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black">
                                DEFAULT ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                            <div>Sampling Rate: <span className="font-bold text-neutral-900 dark:text-white">{cfg.sampling_rate_hz} Hz</span></div>
                            <div>Q-Noise: <span className="font-bold text-neutral-900 dark:text-white">{cfg.kalman_filter_q_noise}</span></div>
                            <div>R-Noise: <span className="font-bold text-neutral-900 dark:text-white">{cfg.kalman_filter_r_noise}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 7. OTA UPDATES TAB */}
            {activeTab === 'ota' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-neutral-950 dark:text-white">Over-The-Air (OTA) Release Dispatch</h3>
                      <p className="text-xs text-neutral-500 font-mono">Live verification via <code>/api/v1/ota/check/</code></p>
                    </div>
                    <button
                      onClick={handlePushOTACheck}
                      className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs flex items-center gap-1.5"
                    >
                      <TerminalIcon className="w-3.5 h-3.5" /> Check OTA Updates
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-950 dark:text-white">Target Production Firmware:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {otaStatus?.target_firmware || 'v1.5.0 STABLE'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-950 dark:text-white">Target ML Weight Engine:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {otaStatus?.target_model_version || 'v2.1.0 (LSTM-ResNet)'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Update Available: {otaStatus?.update_available ? 'YES (Ready for rollout)' : 'SYNCED'}</span>
                      <code className="text-[10px] text-neutral-600 dark:text-neutral-400 truncate max-w-[200px]">
                        {otaStatus?.sha256_checksum || 'e3b0c44298fc1c149afbf4c8...'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. DATASETS TAB */}
            {activeTab === 'datasets' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                  <div>
                    <h3 className="text-base font-bold text-neutral-950 dark:text-white">Sensor Training & Ground Truth Datasets</h3>
                    <p className="text-xs text-neutral-500 font-mono">Fetched from <code>/api/v1/datasets/</code></p>
                  </div>

                  {datasets.length === 0 ? (
                    <div className="p-6 text-center font-mono text-neutral-500 text-xs">
                      No datasets recorded in backend.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {datasets.map((d) => (
                        <div
                          key={d.id}
                          className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-950 dark:text-white">{d.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">
                              {d.dataset_type}
                            </span>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-400 text-xs">{d.description}</p>
                          <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-200 dark:border-neutral-800 flex justify-between">
                            <span>Sensors: {d.sensor_types?.join(', ') || 'ACCEL, GYRO, GNSS'}</span>
                            <span>Created: {d.created_at}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 9. SECURITY & AUTH TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0D0D12] border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xl">
                  <div>
                    <h3 className="text-base font-bold text-neutral-950 dark:text-white">Operator Security & Access Control</h3>
                    <p className="text-xs text-neutral-500 font-mono">Live profile from <code>/api/v1/auth/me/</code></p>
                  </div>

                  {currentUser ? (
                    <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Operator ID:</span>
                        <code className="text-neutral-950 dark:text-white font-bold">{currentUser.id}</code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Role & Clearances:</span>
                        <span className="font-bold text-neutral-950 dark:text-white">{currentUser.role} (AUTHORIZED)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">API Endpoint Authorization:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {getAccessToken() ? 'JWT Bearer Token Active' : 'DEV AUTO AUTH'}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                        <button
                          onClick={handleLogout}
                          className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all text-xs"
                        >
                          Revoke Session & Log Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center font-mono text-neutral-500 text-xs">
                      No active operator session. Please login to authenticate.
                    </div>
                  )}
                </div>
              </div>
            )}

          </main>
        </div>
      )}

    </div>
  );
};
