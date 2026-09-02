/**
 * SIH-2026 IDR Main Backend: Frontend Integration & API Client
 * Follows frontend_implementation_guide.md specifications
 */

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Token Management
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem('jwt_access_token');
  } catch {
    return null;
  }
};

export const setAccessToken = (token: string): void => {
  try {
    localStorage.setItem('jwt_access_token', token);
  } catch {
    // LocalStorage might be disabled or full
  }
};

export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem('jwt_refresh_token');
  } catch {
    return null;
  }
};

export const setRefreshToken = (token: string): void => {
  try {
    localStorage.setItem('jwt_refresh_token', token);
  } catch {
    // LocalStorage might be disabled or full
  }
};

export const clearTokens = (): void => {
  try {
    localStorage.removeItem('jwt_access_token');
    localStorage.removeItem('jwt_refresh_token');
  } catch {
    // Ignore error
  }
};

// Generic API Request Helper
export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data: any = null,
  customHeaders: Record<string, string> = {},
  signal?: AbortSignal
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    signal,
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.detail ||
      errorData.message ||
      (typeof errorData === 'string' ? errorData : `HTTP Error ${response.status}`);
    throw new Error(errorMessage);
  }

  // Handle empty 204 or no-content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// -------------------------------------------------------------
// 1. Authentication Endpoints (/api/v1/auth/)
// -------------------------------------------------------------
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'ENGINEER' | 'ANALYST';
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiRequest<RegisterResponse>('/auth/register/', 'POST', payload),

  login: async (payload: LoginPayload): Promise<TokenResponse> => {
    const tokens = await apiRequest<TokenResponse>('/auth/token/', 'POST', payload);
    if (tokens.access) setAccessToken(tokens.access);
    if (tokens.refresh) setRefreshToken(tokens.refresh);
    return tokens;
  },

  refreshToken: async (refresh?: string): Promise<RefreshTokenResponse> => {
    const tokenToUse = refresh || getRefreshToken();
    if (!tokenToUse) throw new Error('No refresh token available');
    const res = await apiRequest<RefreshTokenResponse>('/auth/token/refresh/', 'POST', {
      refresh: tokenToUse,
    });
    if (res.access) setAccessToken(res.access);
    return res;
  },

  getMe: () => apiRequest<UserProfile>('/auth/me/', 'GET'),
};

// -------------------------------------------------------------
// 2. Edge Device Management (/api/v1/devices/)
// -------------------------------------------------------------
export interface DeviceItem {
  id: string;
  hardware_id: string;
  name: string;
  device_type: string;
  firmware_version: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | string;
  last_heartbeat?: string;
  registered_at?: string;
  api_key?: string;
}

export interface DeviceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DeviceItem[];
}

export interface DeviceRegisterPayload {
  hardware_id: string;
  name: string;
  device_type: string;
  firmware_version: string;
}

export interface HeartbeatPayload {
  battery_level?: number;
  cpu_usage_pct?: number;
  memory_usage_pct?: number;
  status?: string;
}

export interface HeartbeatResponse {
  status: string;
  timestamp: string;
}

export const devicesApi = {
  listDevices: () => apiRequest<DeviceListResponse | DeviceItem[]>('/devices/', 'GET'),

  registerDevice: (payload: DeviceRegisterPayload) =>
    apiRequest<DeviceItem>('/devices/register/', 'POST', payload),

  getDevice: (id: string) => apiRequest<DeviceItem>(`/devices/${id}/`, 'GET'),

  sendHeartbeat: (id: string, payload: HeartbeatPayload) =>
    apiRequest<HeartbeatResponse>(`/devices/${id}/heartbeat/`, 'POST', payload),
};

// -------------------------------------------------------------
// 3. Sensor Datasets (/api/v1/datasets/)
// -------------------------------------------------------------
export interface DatasetItem {
  id: string;
  name: string;
  description: string;
  dataset_type: string;
  sensor_types?: string[];
  created_at: string;
}

export interface DatasetVersion {
  version: string;
  checksum_sha256: string;
  file_size_bytes: number;
  created_at: string;
}

export interface DatasetDetail extends DatasetItem {
  versions?: DatasetVersion[];
}

export interface DatasetListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DatasetItem[];
}

export const datasetsApi = {
  listDatasets: () => apiRequest<DatasetListResponse | DatasetItem[]>('/datasets/', 'GET'),

  getDataset: (id: string) => apiRequest<DatasetDetail>(`/datasets/${id}/`, 'GET'),
};

// -------------------------------------------------------------
// 4. ML Navigation Models (/api/v1/models/)
// -------------------------------------------------------------
export interface MLModelItem {
  id: string;
  name: string;
  architecture: string;
  version: string;
  status: 'APPROVED' | 'PUBLISHED' | 'EVALUATING' | string;
  is_active: boolean;
  mae_position_m?: number;
  download_url?: string;
  checksum_sha256?: string;
  created_at?: string;
}

export interface ModelListResponse {
  count: number;
  results: MLModelItem[];
}

export interface LatestModelResponse {
  id: string;
  name: string;
  version: string;
  architecture: string;
  download_url: string;
  checksum_sha256: string;
}

export interface ModelActionResponse {
  id: string;
  status: string;
  is_active?: boolean;
  message: string;
}

export const modelsApi = {
  listModels: () => apiRequest<ModelListResponse | MLModelItem[]>('/models/', 'GET'),

  getLatestModel: () => apiRequest<LatestModelResponse>('/models/latest/', 'GET'),

  approveModel: (versionId: string) =>
    apiRequest<ModelActionResponse>(`/models/${versionId}/approve/`, 'POST', {}),

  publishModel: (versionId: string) =>
    apiRequest<ModelActionResponse>(`/models/${versionId}/publish/`, 'POST', {}),
};

// -------------------------------------------------------------
// 5. Offline Map Packages (/api/v1/maps/)
// -------------------------------------------------------------
export interface OfflineMapItem {
  id: string;
  name: string;
  bounding_box_geojson?: any;
  file_size_bytes: number;
  zoom_levels: number[];
  download_url?: string;
  checksum_sha256?: string;
  created_at: string;
}

export interface MapListResponse {
  count: number;
  results: OfflineMapItem[];
}

export interface MapLookupPayload {
  latitude: number;
  longitude: number;
  zoom_level: number;
}

export interface MapLookupResponse {
  matching_package: {
    id: string;
    name: string;
    download_url: string;
    checksum_sha256: string;
  };
}

export const mapsApi = {
  listMaps: () => apiRequest<MapListResponse | OfflineMapItem[]>('/maps/', 'GET'),

  lookupMap: (payload: MapLookupPayload) =>
    apiRequest<MapLookupResponse>('/maps/lookup/', 'POST', payload),
};

// -------------------------------------------------------------
// 6. Telemetry & Sensor Ingestion (/api/v1/telemetry/)
// -------------------------------------------------------------
export interface TelemetryRecord {
  timestamp: string;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
  estimated_lat?: number;
  estimated_lon?: number;
}

export interface TelemetryBatchPayload {
  device_id: string;
  session_id: string;
  records: TelemetryRecord[];
}

export interface TelemetryBatchResponse {
  status: string;
  records_ingested: number;
  session_id: string;
}

export interface TelemetrySessionItem {
  session_id: string;
  device_id: string;
  device_name: string;
  record_count: number;
  start_time: string;
  end_time?: string;
}

export interface TelemetrySessionListResponse {
  count: number;
  results: TelemetrySessionItem[];
}

export const telemetryApi = {
  sendBatch: (payload: TelemetryBatchPayload) =>
    apiRequest<TelemetryBatchResponse>('/telemetry/batch/', 'POST', payload),

  listSessions: () =>
    apiRequest<TelemetrySessionListResponse | TelemetrySessionItem[]>('/telemetry/sessions/', 'GET'),
};

// -------------------------------------------------------------
// 7. System Configuration & Sync (/api/v1/config/)
// -------------------------------------------------------------
export interface ConfigProfileItem {
  id: string;
  profile_name: string;
  sampling_rate_hz: number;
  kalman_filter_q_noise: number;
  kalman_filter_r_noise: number;
  is_default: boolean;
}

export interface ConfigListResponse {
  count: number;
  results: ConfigProfileItem[];
}

export interface ConfigSyncPayload {
  device_id: string;
  current_config_version: string;
}

export interface ConfigSyncResponse {
  in_sync: boolean;
  latest_config: {
    profile_name: string;
    config_version: string;
    sampling_rate_hz: number;
  };
}

export const configApi = {
  listConfigs: () => apiRequest<ConfigListResponse | ConfigProfileItem[]>('/config/', 'GET'),

  syncConfig: (payload: ConfigSyncPayload) =>
    apiRequest<ConfigSyncResponse>('/config/sync/', 'POST', payload),
};

// -------------------------------------------------------------
// 8. OTA Updates (/api/v1/ota/)
// -------------------------------------------------------------
export interface OTACheckPayload {
  hardware_id: string;
  current_firmware: string;
  current_model_version?: string;
}

export interface OTACheckResponse {
  update_available: boolean;
  target_firmware?: string;
  firmware_download_url?: string;
  target_model_version?: string;
  model_download_url?: string;
  sha256_checksum?: string;
}

export const otaApi = {
  checkUpdate: (payload: OTACheckPayload) =>
    apiRequest<OTACheckResponse>('/ota/check/', 'POST', payload),
};

// -------------------------------------------------------------
// 9. System Analytics (/api/v1/analytics/)
// -------------------------------------------------------------
export interface AnalyticsSummary {
  total_devices: number;
  online_devices: number;
  total_telemetry_records: number;
  active_model_version: string;
  avg_position_error_m: number;
}

export interface ModelPerformanceAnalytics {
  model_version: string;
  mean_absolute_error_m: number;
  root_mean_squared_error_m: number;
  max_drift_rate_m_per_min: number;
  total_evaluation_hours: number;
}

export const analyticsApi = {
  getSummary: () => apiRequest<AnalyticsSummary>('/analytics/summary/', 'GET'),

  getModelPerformance: () =>
    apiRequest<ModelPerformanceAnalytics>('/analytics/model-performance/', 'GET'),
};

// -------------------------------------------------------------
// 10. Health & Liveness Check (/health/live)
// -------------------------------------------------------------
export interface HealthStatusResponse {
  status: 'healthy' | 'ok' | 'alive' | string;
  uptime_seconds?: number;
  database?: string;
  timestamp?: string;
  version?: string;
  latency_ms?: number;
  url_checked?: string;
}

export const healthApi = {
  checkHealth: async (): Promise<HealthStatusResponse> => {
    const startTime = performance.now();
    const rootUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

    const endpointsToTry = [
      `${rootUrl}/health/live/`,
      `${rootUrl}/health/live`,
      `${API_BASE_URL}/health/live/`,
      `${API_BASE_URL}/health/live`,
      `${rootUrl}/health/`,
      `${rootUrl}/health/life/`,
      `${rootUrl}/health/life`,
      `${API_BASE_URL}/health/`,
    ];

    let lastError: any = null;

    for (const url of endpointsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const latency_ms = Math.round(performance.now() - startTime);
          let data: any = {};
          try {
            data = await res.json();
          } catch {
            data = { status: 'healthy' };
          }
          return {
            status: data.status || 'healthy',
            ...data,
            latency_ms,
            url_checked: url,
          };
        }
      } catch (err) {
        lastError = err;
      }
    }

    // Fallback: Test /api/v1/analytics/summary/ as health probe
    try {
      const summary = await analyticsApi.getSummary();
      const latency_ms = Math.round(performance.now() - startTime);
      return {
        status: 'healthy',
        version: summary.active_model_version,
        latency_ms,
        url_checked: `${API_BASE_URL}/analytics/summary/`,
      };
    } catch {
      throw lastError || new Error(`Backend health probe failed on /health/live (${API_BASE_URL})`);
    }
  },
};

// -------------------------------------------------------------
// 11. Simulation Engine & Control Plane (/api/v1/simulations/)
// -------------------------------------------------------------
import type {
  PresetScenario,
  SimulationCreatePayload,
  SimulationRunResponse,
} from './types';

export const simulationsApi = {
  /**
   * Fetch all 5 pre-configured real-world scenario presets
   */
  listPresets: () =>
    apiRequest<PresetScenario[]>('/simulations/presets/', 'GET'),

  /**
   * Create a new simulation run using preset ID or custom control plane payload
   */
  createSimulation: (payload: SimulationCreatePayload) =>
    apiRequest<SimulationRunResponse>('/simulations/', 'POST', payload),

  /**
   * Trigger execution for a simulation run. Default sync=true waits for results.
   */
  runSimulation: (id: string, sync: boolean = true) =>
    apiRequest<SimulationRunResponse>(
      `/simulations/${id}/run/?sync=${sync}`,
      'POST',
      {}
    ),

  /**
   * Get simulation run details, status, metrics, and artifact download paths
   */
  getSimulation: (id: string) =>
    apiRequest<SimulationRunResponse>(`/simulations/${id}/`, 'GET'),

  /**
   * List recent simulation runs
   */
  listSimulations: () =>
    apiRequest<SimulationRunResponse[] | { count: number; results: SimulationRunResponse[] }>(
      '/simulations/',
      'GET'
    ),
};



