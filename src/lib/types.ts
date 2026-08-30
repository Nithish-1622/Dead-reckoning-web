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
