import { NavigationSession, OutageScenario } from './types';

export const OUTAGE_SCENARIOS: OutageScenario[] = [
  {
    id: 'tunnel',
    title: 'Underground Tunnel',
    subtitle: '1.8 km arterial transit tunnel with complete satellite signal blockage',
    environment: 'tunnel',
    durationSec: 85,
    gnssSignalLoss: '100% loss (0/32 sats)',
    conventionalBehavior: 'Navigation pointer freezes at entrance, suddenly teleports upon exit with wrong heading.',
    idrBehavior: 'Continuous velocity estimation via IMU & vehicle dynamics model. Zero position teleportation.',
    maxDriftWithoutDR: '142.0 m accumulated drift',
    idrPositionError: '< 2.8 m bounded error'
  },
  {
    id: 'urban-canyon',
    title: 'Urban Canyon',
    subtitle: 'High-density downtown skyscraper corridor with severe multi-path reflections',
    environment: 'urban-canyon',
    durationSec: 120,
    gnssSignalLoss: 'Erratic multipath (4-6 degraded sats)',
    conventionalBehavior: 'Position jumps between adjacent city blocks, causing erratic rerouting instructions.',
    idrBehavior: 'Map-matching fusion rejects multipath outliers using non-holonomic kinematic constraints.',
    maxDriftWithoutDR: '86.5 m cross-street jumps',
    idrPositionError: '< 1.9 m lane-level precision'
  },
  {
    id: 'parking',
    title: 'Multi-Level Parking Structure',
    subtitle: 'Reinforced concrete facility with subterranean ramp spirals and zero sky view',
    environment: 'parking',
    durationSec: 180,
    gnssSignalLoss: '100% loss through concrete decks',
    conventionalBehavior: 'Total navigation blackout. GPS completely disconnects.',
    idrBehavior: '3D gyroscope integration tracks multi-level helical ramp turns and elevation changes.',
    maxDriftWithoutDR: 'Total signal failure',
    idrPositionError: '< 3.4 m floor & bay accuracy'
  },
  {
    id: 'dense-canopy',
    title: 'Dense Forest Canopy',
    subtitle: 'Mountain roadway with heavy foliage attenuation and intermittent satellite dropouts',
    environment: 'dense-canopy',
    durationSec: 95,
    gnssSignalLoss: 'Severe signal attenuation (-28 dB-Hz)',
    conventionalBehavior: 'High latency speed lag; fails to track tight switchback turns.',
    idrBehavior: 'High-rate (200Hz) IMU tracking catches high-G cornering dynamics accurately.',
    maxDriftWithoutDR: '45.0 m curve overshoot',
    idrPositionError: '< 1.4 m curve fidelity'
  }
];

export const MOCK_NAVIGATION_SESSIONS: NavigationSession[] = [
  {
    id: 'IDR-2026-00142',
    deviceId: 'PIXEL-8-PRO-49A',
    deviceModel: 'Google Pixel 8 Pro (Tensor G3)',
    status: 'DEAD RECKONING ACTIVE',
    startTime: '2026-08-30T14:10:00Z',
    durationSeconds: 1420,
    speedKmh: 52.4,
    headingDeg: 128.6,
    positionErrorMeters: 2.3,
    gnssStatus: 'LOST',
    drConfidencePct: 98.4,
    batteryPct: 87,
    outageCount: 3,
    totalDistanceKm: 14.8,
    maxErrorUnderOutageMeters: 3.1
  },
  {
    id: 'IDR-2026-00141',
    deviceId: 'GALAXY-S24-U12',
    deviceModel: 'Samsung Galaxy S24 Ultra',
    status: 'GNSS LOCKED',
    startTime: '2026-08-30T14:05:12Z',
    durationSeconds: 1710,
    speedKmh: 68.1,
    headingDeg: 284.2,
    positionErrorMeters: 1.1,
    gnssStatus: 'LOCKED',
    drConfidencePct: 99.1,
    batteryPct: 92,
    outageCount: 1,
    totalDistanceKm: 22.4,
    maxErrorUnderOutageMeters: 2.2
  },
  {
    id: 'IDR-2026-00140',
    deviceId: 'XIAOMI-14-PRO-88',
    deviceModel: 'Xiaomi 14 Pro (Snapdragon 8 Gen 3)',
    status: 'CONVERGING',
    startTime: '2026-08-30T13:50:45Z',
    durationSeconds: 2580,
    speedKmh: 34.0,
    headingDeg: 45.0,
    positionErrorMeters: 1.8,
    gnssStatus: 'RECOVERING',
    drConfidencePct: 96.7,
    batteryPct: 76,
    outageCount: 4,
    totalDistanceKm: 31.2,
    maxErrorUnderOutageMeters: 3.8
  },
  {
    id: 'IDR-2026-00139',
    deviceId: 'ONEPLUS-12-71A',
    deviceModel: 'OnePlus 12',
    status: 'GNSS LOCKED',
    startTime: '2026-08-30T13:42:00Z',
    durationSeconds: 3100,
    speedKmh: 42.8,
    headingDeg: 195.4,
    positionErrorMeters: 0.9,
    gnssStatus: 'LOCKED',
    drConfidencePct: 99.4,
    batteryPct: 68,
    outageCount: 2,
    totalDistanceKm: 38.9,
    maxErrorUnderOutageMeters: 1.9
  }
];

export const SYSTEM_BENCHMARK_METRICS = [
  {
    label: 'Position Error (Under Outage)',
    value: '2.4',
    unit: 'm (p95)',
    status: 'nominal' as const,
    description: 'Autonomous positioning accuracy measured over 60s simulated tunnel blackout.'
  },
  {
    label: 'Drift Rate',
    value: '0.8',
    unit: '% dist',
    status: 'nominal' as const,
    description: 'Distance-proportional drift bounded by kinematic & road graph constraints.'
  },
  {
    label: 'Edge Inference Latency',
    value: '3.8',
    unit: 'ms',
    status: 'nominal' as const,
    description: 'Quantized INT8 motion estimation model executing on smartphone NPU/CPU.'
  },
  {
    label: 'IMU Sampling Rate',
    value: '200',
    unit: 'Hz',
    status: 'nominal' as const,
    description: 'High-frequency synchronized accelerometer and gyroscope sampling.'
  },
  {
    label: 'GNSS Re-Fusion Latency',
    value: '110',
    unit: 'ms',
    status: 'nominal' as const,
    description: 'Instantaneous Kalman Filter covariance convergence upon signal reappearance.'
  },
  {
    label: 'Power Consumption',
    value: '< 3.6',
    unit: '% / hr',
    status: 'nominal' as const,
    description: 'Ultra-low battery footprint using optimized vectorized C++ native kernels.'
  }
];
