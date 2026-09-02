/**
 * Geodetic and Simulation Coordinate Utility Module
 * Implements WGS-84 / ENU (East-North-Up) conversions, geodesy distances,
 * trajectory interpolations, and high-performance CSV streaming parser.
 */

import { PresetScenario, TrajectoryPoint, SimulationMetrics, GNSSOutageEvaluation } from './types';

// WGS-84 Earth Radius in meters
export const WGS84_EARTH_RADIUS = 6378137.0;

/**
 * Converts local ENU offset (east, north in meters) relative to reference (lat0, lon0)
 * into WGS-84 [latitude, longitude] array.
 */
export function enuToGeodetic(
  east: number,
  north: number,
  lat0: number,
  lon0: number
): [number, number] {
  const dLat = (north / WGS84_EARTH_RADIUS) * (180 / Math.PI);
  const latRad = (lat0 * Math.PI) / 180;
  const dLon = (east / (WGS84_EARTH_RADIUS * Math.cos(latRad))) * (180 / Math.PI);
  return [lat0 + dLat, lon0 + dLon];
}

/**
 * Converts WGS-84 [latitude, longitude] relative to reference (lat0, lon0)
 * into local ENU offset [east, north] in meters.
 */
export function geodeticToEnu(
  lat: number,
  lon: number,
  lat0: number,
  lon0: number
): [number, number] {
  const dLatRad = ((lat - lat0) * Math.PI) / 180;
  const dLonRad = ((lon - lon0) * Math.PI) / 180;
  const lat0Rad = (lat0 * Math.PI) / 180;

  const north = dLatRad * WGS84_EARTH_RADIUS;
  const east = dLonRad * WGS84_EARTH_RADIUS * Math.cos(lat0Rad);
  return [east, north];
}

/**
 * Calculates Great-Circle Haversine distance between two coordinates in meters.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return WGS84_EARTH_RADIUS * c;
}

/**
 * Calculates initial bearing / heading in degrees (0 = North, 90 = East, 180 = South, 270 = West)
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

/**
 * High-performance, robust CSV parser for trajectory and sensor stream data.
 */
export function parseTrajectoryCsv(csvText: string): TrajectoryPoint[] {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  const headerLine = lines[0];
  const headers = headerLine
    .split(',')
    .map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));

  const latIdx = headers.findIndex((h) => h === 'latitude' || h === 'lat');
  const lonIdx = headers.findIndex((h) => h === 'longitude' || h === 'lon' || h === 'lng');
  const timeIdx = headers.findIndex((h) => h === 'time_sec' || h === 'timestamp' || h === 'time' || h === 't');
  const estLatIdx = headers.findIndex((h) => h === 'estimated_latitude' || h === 'est_lat' || h === 'dr_lat');
  const estLonIdx = headers.findIndex((h) => h === 'estimated_longitude' || h === 'est_lon' || h === 'dr_lon');
  const velIdx = headers.findIndex((h) => h === 'velocity_mps' || h === 'speed' || h === 'vel');
  const headingIdx = headers.findIndex((h) => h === 'heading_deg' || h === 'heading' || h === 'yaw');
  const outageIdx = headers.findIndex((h) => h === 'is_gnss_outage' || h === 'outage' || h === 'gnss_lost');
  const errorIdx = headers.findIndex((h) => h === 'position_error_m' || h === 'error_m' || h === 'drift_m');

  if (latIdx === -1 || lonIdx === -1) {
    return [];
  }

  const results: TrajectoryPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    const lat = parseFloat(cols[latIdx]);
    const lon = parseFloat(cols[lonIdx]);

    if (isNaN(lat) || isNaN(lon)) continue;

    const time_sec = timeIdx >= 0 && !isNaN(parseFloat(cols[timeIdx])) ? parseFloat(cols[timeIdx]) : i * 0.1;
    const est_lat = estLatIdx >= 0 && !isNaN(parseFloat(cols[estLatIdx])) ? parseFloat(cols[estLatIdx]) : lat;
    const est_lon = estLonIdx >= 0 && !isNaN(parseFloat(cols[estLonIdx])) ? parseFloat(cols[estLonIdx]) : lon;
    const vel = velIdx >= 0 && !isNaN(parseFloat(cols[velIdx])) ? parseFloat(cols[velIdx]) : 12.0;
    const heading = headingIdx >= 0 && !isNaN(parseFloat(cols[headingIdx])) ? parseFloat(cols[headingIdx]) : 0;
    const is_outage = outageIdx >= 0 ? cols[outageIdx].toLowerCase() === 'true' || cols[outageIdx] === '1' : false;
    const error_m = errorIdx >= 0 && !isNaN(parseFloat(cols[errorIdx])) ? parseFloat(cols[errorIdx]) : haversineDistance(lat, lon, est_lat, est_lon);

    results.push({
      time_sec,
      latitude: lat,
      longitude: lon,
      estimated_latitude: est_lat,
      estimated_longitude: est_lon,
      velocity_mps: vel,
      heading_deg: heading,
      is_gnss_outage: is_outage,
      position_error_m: error_m,
    });
  }

  return results;
}

// -------------------------------------------------------------
// Pre-configured SIH-2026 Simulation Benchmark Presets
// -------------------------------------------------------------
export const STATIC_PRESET_SCENARIOS: PresetScenario[] = [
  {
    preset_id: 'flagship_gnss_outage',
    name: 'SIH-2026 Flagship 300s GNSS Outage Benchmark',
    description:
      'Flagship 300-second navigation benchmark with 120-second middle GNSS outage (t=120s to t=240s) for testing dead reckoning position drift and recovery.',
    duration_seconds: 300.0,
    movement_mode: 'WAYPOINT_ROUTE',
    seed: 42,
  },
  {
    preset_id: 'urban_tunnel_outage',
    name: 'Urban Tunnel GNSS Outage',
    description:
      'City center route entering a 120s subterranean tunnel with total GNSS signal loss and high IMU vibration.',
    duration_seconds: 250.0,
    movement_mode: 'WAYPOINT_ROUTE',
    seed: 101,
  },
  {
    preset_id: 'highway_corridor',
    name: 'High-Speed Highway Corridor',
    description:
      'Suburban expressway navigation at 25 m/s (~90 km/h) testing long-range IMU velocity integration and scale factor stability.',
    duration_seconds: 300.0,
    movement_mode: 'WAYPOINT_ROUTE',
    seed: 202,
  },
  {
    preset_id: 'urban_canyon_degraded',
    name: 'Urban Canyon Multipath Degradation',
    description:
      'High-rise building district creating severe satellite multipath reflection, pseudorange jumps, and 15m position jitter.',
    duration_seconds: 200.0,
    movement_mode: 'WAYPOINT_ROUTE',
    seed: 303,
  },
  {
    preset_id: 'subway_transfer',
    name: 'Subway & Underground Transit Transfer',
    description:
      'Pedestrian descending into metro station concourse with 90s complete blackout, sharp 90-degree turns, and pedestrian dead reckoning.',
    duration_seconds: 180.0,
    movement_mode: 'STOP_AND_GO',
    seed: 404,
  },
  {
    preset_id: 'mountain_winding_road',
    name: 'Mountain Winding Road & Pass',
    description:
      'Serpentine mountain highway with continuous sharp hairpin turns, elevation changes, and periodic hill shading.',
    duration_seconds: 240.0,
    movement_mode: 'WAYPOINT_ROUTE',
    seed: 505,
  },
];

/**
 * Generates high-fidelity simulated trajectories for all presets and custom runs.
 * Used when running standalone demo or as immediate frontend preview before/during network fetch.
 */
export function synthesizeSimulationRun(
  presetId: string = 'urban_tunnel_outage',
  customConfig?: any
): {
  trajectory: TrajectoryPoint[];
  metrics: SimulationMetrics;
  gnssOutageEvaluations: GNSSOutageEvaluation[];
  summary: {
    origin: [number, number];
    destination: [number, number];
    totalDuration: number;
    outageWindow: [number, number];
  };
} {
  // Preset Coordinate Centers (Real-world geographic landmarks)
  const presetsMeta: Record<
    string,
    {
      origin: [number, number];
      duration: number;
      outage: [number, number];
      speedMps: number;
      enuWaypoints: [number, number][];
      driftFactor: number;
    }
  > = {
    flagship_gnss_outage: {
      origin: [28.6139, 77.209], // New Delhi Central
      duration: 300,
      outage: [120, 240],
      speedMps: 13.5,
      enuWaypoints: [
        [0, 0],
        [400, 300],
        [900, 500],
        [1500, 700],
        [2200, 1100],
        [2800, 1500],
      ],
      driftFactor: 0.12,
    },
    urban_tunnel_outage: {
      origin: [28.6289, 77.2185], // Connaught Place Tunnel Corridor
      duration: 250,
      outage: [50, 170],
      speedMps: 11.2,
      enuWaypoints: [
        [0, 0],
        [250, 250],
        [600, 250],
        [1100, 450],
        [1600, 600],
        [2000, 850],
      ],
      driftFactor: 0.08,
    },
    highway_corridor: {
      origin: [28.4595, 77.0266], // NH-48 Expressway Gurgaon
      duration: 300,
      outage: [60, 220],
      speedMps: 25.0,
      enuWaypoints: [
        [0, 0],
        [1200, 800],
        [2800, 1900],
        [4500, 3100],
        [6500, 4400],
      ],
      driftFactor: 0.05,
    },
    urban_canyon_degraded: {
      origin: [19.076, 72.8777], // Mumbai BKC Urban Financial Center
      duration: 200,
      outage: [40, 160],
      speedMps: 9.0,
      enuWaypoints: [
        [0, 0],
        [150, 200],
        [400, 250],
        [450, 550],
        [700, 650],
        [950, 850],
      ],
      driftFactor: 0.18,
    },
    subway_transfer: {
      origin: [13.0827, 80.2707], // Chennai Central Underground Metro
      duration: 180,
      outage: [30, 140],
      speedMps: 2.2, // Pedestrian
      enuWaypoints: [
        [0, 0],
        [40, 60],
        [80, 70],
        [90, 130],
        [140, 150],
        [180, 200],
      ],
      driftFactor: 0.04,
    },
    mountain_winding_road: {
      origin: [11.4102, 76.695], // Ooty Ghats Mountain Hairpins
      duration: 240,
      outage: [40, 180],
      speedMps: 10.0,
      enuWaypoints: [
        [0, 0],
        [180, 120],
        [120, 280],
        [320, 360],
        [240, 520],
        [450, 680],
        [380, 850],
      ],
      driftFactor: 0.14,
    },
  };

  let config = presetsMeta[presetId] || presetsMeta['urban_tunnel_outage'];

  if (customConfig) {
    const startLat = customConfig.initial_state?.latitude || 28.6139;
    const startLon = customConfig.initial_state?.longitude || 77.209;
    const dur = customConfig.duration_seconds || 240;
    const waypoints = customConfig.waypoints?.length
      ? customConfig.waypoints
      : [
          [0, 0],
          [200, 200],
          [500, 200],
          [800, 600],
        ];
    const outage = customConfig.gnss?.outages?.[0] || {
      start_seconds: 40,
      end_seconds: 120,
    };

    config = {
      origin: [startLat, startLon],
      duration: dur,
      outage: [outage.start_seconds, outage.end_seconds],
      speedMps: customConfig.initial_state?.velocity_mps || 10.0,
      enuWaypoints: waypoints,
      driftFactor: (customConfig.imu?.accel_noise_std || 0.05) * 2.0,
    };
  }

  const [lat0, lon0] = config.origin;
  const totalDuration = config.duration;
  const dt = 0.5; // 2Hz sample points for smooth visualizer polyline
  const numSteps = Math.floor(totalDuration / dt);

  // Convert ENU waypoints to Geodetic Path segments
  const waypointsGeo = config.enuWaypoints.map(([e, n]) =>
    enuToGeodetic(e, n, lat0, lon0)
  );

  // Calculate segment cumulative distances
  const segmentLengths: number[] = [0];
  let totalLength = 0;
  for (let i = 0; i < waypointsGeo.length - 1; i++) {
    const d = haversineDistance(
      waypointsGeo[i][0],
      waypointsGeo[i][1],
      waypointsGeo[i + 1][0],
      waypointsGeo[i + 1][1]
    );
    totalLength += d;
    segmentLengths.push(totalLength);
  }

  const trajectory: TrajectoryPoint[] = [];
  let currentDriftEast = 0;
  let currentDriftNorth = 0;
  let maxError = 0;
  let sumSquaredError = 0;
  let sumError = 0;

  for (let step = 0; step <= numSteps; step++) {
    const t = step * dt;
    const progress = Math.min(1.0, t / totalDuration);
    const currentDist = progress * totalLength;

    // Find active segment
    let segIdx = 0;
    while (
      segIdx < segmentLengths.length - 1 &&
      segmentLengths[segIdx + 1] < currentDist
    ) {
      segIdx++;
    }

    const segStartDist = segmentLengths[segIdx];
    const segEndDist =
      segmentLengths[Math.min(segIdx + 1, segmentLengths.length - 1)] || totalLength;
    const segLen = Math.max(0.001, segEndDist - segStartDist);
    const segT = Math.min(1.0, Math.max(0.0, (currentDist - segStartDist) / segLen));

    const pA = waypointsGeo[Math.min(segIdx, waypointsGeo.length - 1)];
    const pB = waypointsGeo[Math.min(segIdx + 1, waypointsGeo.length - 1)];

    // Interpolate Ground Truth position
    const gtLat = pA[0] + (pB[0] - pA[0]) * segT;
    const gtLon = pA[1] + (pB[1] - pA[1]) * segT;

    const heading = calculateBearing(pA[0], pA[1], pB[0], pB[1]);
    const isOutage = t >= config.outage[0] && t <= config.outage[1];

    // Dead Reckoning Integration Simulation with Realistic Kinematic Inertial Drift
    if (isOutage) {
      const outageTime = t - config.outage[0];
      // Quadratic inertial error growth with small stochastic noise
      const accelBias = 0.015 * config.driftFactor;
      const driftSpeed = accelBias * outageTime;
      const noise = (Math.sin(t * 0.4) + Math.cos(t * 0.7)) * 0.05;

      currentDriftEast += (Math.cos((heading * Math.PI) / 180) * driftSpeed + noise) * dt;
      currentDriftNorth += (-Math.sin((heading * Math.PI) / 180) * driftSpeed + noise) * dt;
    } else if (t > config.outage[1]) {
      // EKF GNSS Re-convergence Phase: exponential decay back to nominal GNSS accuracy
      const reconvergeTime = t - config.outage[1];
      const decay = Math.exp(-reconvergeTime / 4.0); // 4 second convergence
      currentDriftEast *= decay;
      currentDriftNorth *= decay;
    } else {
      // Normal GNSS Lock: 1-2m jitter
      currentDriftEast = Math.sin(t * 2.0) * 0.8;
      currentDriftNorth = Math.cos(t * 1.7) * 0.8;
    }

    const [estLat, estLon] = enuToGeodetic(
      currentDriftEast,
      currentDriftNorth,
      gtLat,
      gtLon
    );

    const posError = haversineDistance(gtLat, gtLon, estLat, estLon);
    if (posError > maxError) maxError = posError;
    sumSquaredError += posError * posError;
    sumError += posError;

    trajectory.push({
      time_sec: Math.round(t * 100) / 100,
      latitude: gtLat,
      longitude: gtLon,
      altitude_m: 216.0 + Math.sin(t * 0.05) * 8.0,
      velocity_mps: config.speedMps + Math.sin(t * 0.1) * 0.8,
      heading_deg: Math.round(heading),
      is_gnss_outage: isOutage,
      estimated_latitude: estLat,
      estimated_longitude: estLon,
      position_error_m: Math.round(posError * 100) / 100,
    });
  }

  const rmse = Math.sqrt(sumSquaredError / Math.max(1, trajectory.length));
  const meanError = sumError / Math.max(1, trajectory.length);
  const lastPoint = trajectory[trajectory.length - 1];
  const finalError = lastPoint?.position_error_m || 1.2;
  const driftPct = (maxError / Math.max(1, totalLength)) * 100;

  const outageDuration = config.outage[1] - config.outage[0];
  const outageDriftRate = maxError / Math.max(1, outageDuration);

  const metrics: SimulationMetrics = {
    travelled_distance_m: Math.round(totalLength * 100) / 100,
    rmse_position_m: Math.round(rmse * 100) / 100,
    mean_position_error_m: Math.round(meanError * 100) / 100,
    final_position_error_m: Math.round(finalError * 100) / 100,
    max_position_error_m: Math.round(maxError * 100) / 100,
    drift_percentage: Math.round(driftPct * 100) / 100,
  };

  const gnssOutageEvaluations: GNSSOutageEvaluation[] = [
    {
      start_seconds: config.outage[0],
      end_seconds: config.outage[1],
      duration_seconds: outageDuration,
      initial_error_m: 1.8,
      final_error_m: Math.round(maxError * 0.95 * 100) / 100,
      max_error_m: Math.round(maxError * 100) / 100,
      drift_rate_m_per_s: Math.round(outageDriftRate * 100) / 100,
    },
  ];

  return {
    trajectory,
    metrics,
    gnssOutageEvaluations,
    summary: {
      origin: config.origin,
      destination: [
        trajectory[trajectory.length - 1].latitude,
        trajectory[trajectory.length - 1].longitude,
      ],
      totalDuration,
      outageWindow: config.outage,
    },
  };
}
