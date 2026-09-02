export type DeviceType = 'android-mobile' | 'ios-mobile' | 'tablet' | 'desktop';

export type GNSSState = 'LOCKED' | 'DEGRADING' | 'LOST' | 'RECOVERING';
export type DRMode = 'STANDBY' | 'ENGAGED' | 'CONVERGING';

export interface TelemetryData {
  timestamp: number;
  gnssStatus: GNSSState;
  drMode: DRMode;
  positionErrorMeters: number;
  speedKmh: number;
  headingDeg: number;
  imuSampleRateHz: number;
  aiConfidencePct: number;
  driftRatePct: number;
  covarianceM2: number;
  accel: { x: number; y: number; z: number };
  gyro: { x: number; y: number; z: number };
  satellitesInView: number;
  batteryPct: number;
}

export interface NavigationSession {
  id: string;
  deviceId: string;
  deviceModel: string;
  status: 'DEAD RECKONING ACTIVE' | 'GNSS LOCKED' | 'CONVERGING' | 'COMPLETED';
  startTime: string;
  durationSeconds: number;
  speedKmh: number;
  headingDeg: number;
  positionErrorMeters: number;
  gnssStatus: GNSSState;
  drConfidencePct: number;
  batteryPct: number;
  outageCount: number;
  totalDistanceKm: number;
  maxErrorUnderOutageMeters: number;
}

export interface SystemMetric {
  label: string;
  value: string;
  unit: string;
  status: 'nominal' | 'warning' | 'alert' | 'active';
  description: string;
  isBenchmarkDemo?: boolean;
}

export interface OutageScenario {
  id: string;
  title: string;
  subtitle: string;
  environment: 'tunnel' | 'urban-canyon' | 'parking' | 'dense-canopy';
  durationSec: number;
  gnssSignalLoss: string;
  conventionalBehavior: string;
  idrBehavior: string;
  maxDriftWithoutDR: string;
  idrPositionError: string;
}

// -------------------------------------------------------------
// Simulation Engine Types (SIH-2026 Benchmark Suite)
// -------------------------------------------------------------
export interface PresetScenario {
  preset_id: string;
  name: string;
  description: string;
  duration_seconds: number;
  movement_mode: 'WAYPOINT_ROUTE' | 'STOP_AND_GO' | string;
  seed: number;
}

export interface GNSSOutageWindow {
  start_seconds: number;
  end_seconds: number;
}

export interface CustomScenarioInitialState {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity_mps: number;
  heading_deg: number;
}

export interface CustomScenarioIMUConfig {
  accelerometer_hz: number;
  gyroscope_hz: number;
  accel_noise_std: number;
  gyro_noise_std: number;
}

export interface CustomScenarioGNSSConfig {
  frequency_hz: number;
  position_noise_meters: number;
  outages: GNSSOutageWindow[];
}

export interface CustomScenarioPayload {
  scenario_id: string;
  name: string;
  duration_seconds: number;
  timestep_seconds: number;
  seed: number;
  initial_state: CustomScenarioInitialState;
  waypoints: [number, number][]; // Local ENU [east, north] relative offsets in meters
  imu: CustomScenarioIMUConfig;
  gnss: CustomScenarioGNSSConfig;
}

export interface SimulationCreatePayload {
  preset_id?: string;
  seed?: number;
  duration_seconds?: number;
  custom_scenario?: CustomScenarioPayload;
}

export interface SimulationMetrics {
  travelled_distance_m?: number;
  rmse_position_m?: number;
  mean_position_error_m?: number;
  final_position_error_m?: number;
  max_position_error_m?: number;
  drift_percentage?: number;
}

export interface GNSSOutageEvaluation {
  start_seconds: number;
  end_seconds: number;
  duration_seconds: number;
  initial_error_m: number;
  final_error_m: number;
  max_error_m: number;
  drift_rate_m_per_s: number;
}

export interface SimulationArtifactPaths {
  ground_truth_csv?: string;
  sensor_stream_csv?: string;
  evaluation_report_json?: string;
}

export interface SimulationRunResponse {
  id: string;
  scenario_id?: string;
  scenario_name?: string;
  seed?: number;
  duration_seconds?: number;
  status: 'CREATED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | string;
  scenario_config?: any;
  metrics?: SimulationMetrics;
  gnss_outage_evaluations?: GNSSOutageEvaluation[];
  artifact_paths?: SimulationArtifactPaths;
  error_message?: string;
  created_at?: string;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface TrajectoryPoint {
  time_sec: number;
  latitude: number;
  longitude: number;
  altitude_m?: number;
  velocity_mps?: number;
  heading_deg?: number;
  is_gnss_outage?: boolean;
  estimated_latitude?: number;
  estimated_longitude?: number;
  position_error_m?: number;
}

