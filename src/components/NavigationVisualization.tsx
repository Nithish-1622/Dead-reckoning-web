import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  PlayIcon, 
  PauseIcon, 
  RotateCcwIcon, 
  ShieldAlertIcon, 
  CompassIcon, 
  CrosshairIcon, 
  LayersIcon,
  EyeIcon,
  SatelliteIcon,
  CpuIcon,
  ActivityIcon,
  WifiOffIcon,
} from './Icons';
import { GNSSState, DRMode } from '../lib/types';
import { useTheme } from '../lib/theme';

interface NavigationVisualizationProps {
  onStatusChange?: (status: GNSSState) => void;
}

export type MapViewAngle = '2d' | '3d-cockpit' | '3d-isometric';

export interface RoadSegment {
  id: string;
  name: string;
  type: 'straight' | 'left_turn' | 'right_turn' | 'curved' | 'destination';
  speedLimit: number;
  zone: 'open' | 'urban-canyon' | 'tunnel' | 'recovering';
  maneuver: string;
  polyline: [number, number][]; // High-density [lat, lng]
}

export interface CityRoute {
  id: string;
  name: string;
  shortName: string;
  state: string;
  destination: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  segments: RoadSegment[];
}

export const COIMBATORE_NAVIGATION_ROUTES: CityRoute[] = [
  {
    id: 'cbe-gandhipuram',
    name: 'Coimbatore — Gandhipuram Central Circuit (1.2 km)',
    shortName: 'Gandhipuram, CBE',
    state: 'Tamil Nadu',
    destination: 'Cross Cut Rd via Gandhipuram Under-Deck',
    center: [11.01850, 76.96750],
    zoom: 18,
    segments: [
      {
        id: 'seg-1-nanjappa',
        name: 'Dr. Nanjappa Road (NH 181)',
        type: 'straight',
        speedLimit: 40,
        zone: 'open',
        maneuver: 'Head North on Dr. Nanjappa Rd toward Signal',
        polyline: [
          [11.01450, 76.96770],
          [11.01530, 76.96780],
          [11.01610, 76.96790],
          [11.01690, 76.96800],
          [11.01750, 76.96810]
        ]
      },
      {
        id: 'seg-2-left-turn-gp',
        name: 'Gandhipuram Central Signal Junction',
        type: 'left_turn',
        speedLimit: 25,
        zone: 'urban-canyon',
        maneuver: 'Turn LEFT onto Cross Cut Road',
        polyline: [
          [11.01750, 76.96810],
          [11.01765, 76.96780],
          [11.01780, 76.96740],
          [11.01800, 76.96700]
        ]
      },
      {
        id: 'seg-3-cross-cut-straight',
        name: 'Cross Cut Road Arterial',
        type: 'straight',
        speedLimit: 35,
        zone: 'urban-canyon',
        maneuver: 'Continue Straight on Cross Cut Road High Street',
        polyline: [
          [11.01800, 76.96700],
          [11.01850, 76.96580],
          [11.01900, 76.96460],
          [11.01950, 76.96340],
          [11.02000, 76.96220],
          [11.02060, 76.96080],
          [11.02120, 76.95940],
          [11.02180, 76.95840]
        ]
      },
      {
        id: 'seg-4-right-turn-100ft',
        name: 'Cross Cut & 100 Feet Rd Intersection',
        type: 'right_turn',
        speedLimit: 25,
        zone: 'recovering',
        maneuver: 'Turn RIGHT onto 100 Feet Road',
        polyline: [
          [11.02180, 76.95840],
          [11.02210, 76.95870],
          [11.02235, 76.95930],
          [11.02250, 76.96010]
        ]
      },
      {
        id: 'seg-5-100ft-straight',
        name: '100 Feet Road (Dr. Radhakrishnan Rd)',
        type: 'straight',
        speedLimit: 45,
        zone: 'open',
        maneuver: 'Continue Straight East on 100 Feet Rd',
        polyline: [
          [11.02250, 76.96010],
          [11.02280, 76.96160],
          [11.02310, 76.96320],
          [11.02340, 76.96480],
          [11.02370, 76.96640],
          [11.02400, 76.96800],
          [11.02420, 76.96880]
        ]
      },
      {
        id: 'seg-6-sathy-flyover-curved',
        name: 'Gandhipuram 2-Tier Flyover Under-Deck (NH 948)',
        type: 'curved',
        speedLimit: 45,
        zone: 'tunnel',
        maneuver: 'Enter Flyover Sub-Deck Underpass (200Hz INS Active)',
        polyline: [
          [11.02420, 76.96880],
          [11.02360, 76.96880],
          [11.02270, 76.96870],
          [11.02170, 76.96855],
          [11.02060, 76.96840],
          [11.01950, 76.96825],
          [11.01850, 76.96815],
          [11.01750, 76.96810]
        ]
      },
      {
        id: 'seg-7-destination-return',
        name: 'Gandhipuram Central Hub',
        type: 'destination',
        speedLimit: 35,
        zone: 'open',
        maneuver: 'Looping via Dr. Nanjappa Road to Origin',
        polyline: [
          [11.01750, 76.96810],
          [11.01650, 76.96800],
          [11.01550, 76.96785],
          [11.01450, 76.96770]
        ]
      }
    ]
  },
  {
    id: 'cbe-avinashi',
    name: 'Coimbatore — Avinashi Road Expressway Corridor (1.2 km)',
    shortName: 'Avinashi Rd, CBE',
    state: 'Tamil Nadu',
    destination: 'Peelamedu via Avinashi Rd (SH 52)',
    center: [11.01580, 76.99700],
    zoom: 18,
    segments: [
      {
        id: 'seg-av-1',
        name: 'Avinashi Road (SH 52 Eastbound)',
        type: 'straight',
        speedLimit: 50,
        zone: 'open',
        maneuver: 'Head East on Avinashi Road Corridor',
        polyline: [
          [11.01100, 76.98600],
          [11.01250, 76.98950],
          [11.01400, 76.99300],
          [11.01550, 76.99650],
          [11.01700, 77.00000]
        ]
      },
      {
        id: 'seg-av-2',
        name: 'Nava India Commercial Junction',
        type: 'straight',
        speedLimit: 45,
        zone: 'urban-canyon',
        maneuver: 'Passing High-Rise Commercial Zone',
        polyline: [
          [11.01700, 77.00000],
          [11.01850, 77.00350],
          [11.02000, 77.00700],
          [11.02150, 77.01050]
        ]
      },
      {
        id: 'seg-av-3',
        name: 'Peelamedu Elevated Deck Shadow',
        type: 'curved',
        speedLimit: 55,
        zone: 'tunnel',
        maneuver: 'Elevated Expressway Shadow (200Hz INS Active)',
        polyline: [
          [11.02150, 77.01050],
          [11.02250, 77.01300],
          [11.02320, 77.01500],
          [11.02300, 77.01550],
          [11.02220, 77.01450]
        ]
      },
      {
        id: 'seg-av-4',
        name: 'Avinashi Road (Westbound Return)',
        type: 'destination',
        speedLimit: 50,
        zone: 'open',
        maneuver: 'Returning West toward Lakshmi Mills',
        polyline: [
          [11.02220, 77.01450],
          [11.02000, 77.00700],
          [11.01700, 77.00000],
          [11.01400, 76.99300],
          [11.01100, 76.98600]
        ]
      }
    ]
  },
  {
    id: 'cbe-rspuram',
    name: 'Coimbatore — RS Puram & DB Road (1.0 km)',
    shortName: 'RS Puram, CBE',
    state: 'Tamil Nadu',
    destination: 'Thadagam Road via DB Road',
    center: [11.01000, 76.94850],
    zoom: 18,
    segments: [
      {
        id: 'seg-rs-1',
        name: 'Diwan Bahadur (DB) Road South',
        type: 'straight',
        speedLimit: 35,
        zone: 'open',
        maneuver: 'Head North on Diwan Bahadur Road',
        polyline: [
          [11.00400, 76.95350],
          [11.00550, 76.95230],
          [11.00700, 76.95110],
          [11.00850, 76.94990]
        ]
      },
      {
        id: 'seg-rs-2',
        name: 'RS Puram Head Post Office Hub',
        type: 'straight',
        speedLimit: 30,
        zone: 'urban-canyon',
        maneuver: 'Passing Central Commercial Sector',
        polyline: [
          [11.00850, 76.94990],
          [11.01000, 76.94870],
          [11.01150, 76.94750],
          [11.01300, 76.94630]
        ]
      },
      {
        id: 'seg-rs-3',
        name: 'Cowley Brown Road Canopy',
        type: 'curved',
        speedLimit: 35,
        zone: 'tunnel',
        maneuver: 'Dense Tree Canopy Outage (INS Engaged)',
        polyline: [
          [11.01300, 76.94630],
          [11.01450, 76.94510],
          [11.01600, 76.94390],
          [11.01680, 76.94300],
          [11.01600, 76.94250]
        ]
      },
      {
        id: 'seg-rs-4',
        name: 'DB Road Return Corridor',
        type: 'destination',
        speedLimit: 35,
        zone: 'open',
        maneuver: 'Arriving at Destination Hub',
        polyline: [
          [11.01600, 76.94250],
          [11.01300, 76.94630],
          [11.00900, 76.94950],
          [11.00400, 76.95350]
        ]
      }
    ]
  }
];

// Helper to flatten route segments into continuous polyline with segment metadata
interface CompiledRoutePoint {
  lat: number;
  lng: number;
  segmentIndex: number;
  segment: RoadSegment;
  cumDistM: number;
}

function compileRoute(route: CityRoute): {
  points: CompiledRoutePoint[];
  totalDistanceM: number;
} {
  const points: CompiledRoutePoint[] = [];
  let cumDist = 0;

  route.segments.forEach((seg, segIdx) => {
    seg.polyline.forEach((pt) => {
      if (points.length > 0) {
        const prev = points[points.length - 1];
        const dLat = (pt[0] - prev.lat) * 111320;
        const dLng = (pt[1] - prev.lng) * 111320 * Math.cos(((pt[0] + prev.lat) * 0.5 * Math.PI) / 180);
        const d = Math.hypot(dLat, dLng);
        cumDist += Math.max(d, 0.0001);
      }
      points.push({
        lat: pt[0],
        lng: pt[1],
        segmentIndex: segIdx,
        segment: seg,
        cumDistM: cumDist,
      });
    });
  });

  return { points, totalDistanceM: cumDist };
}

// Angular difference helper (-180 to +180)
function angleDiff(a: number, b: number): number {
  return ((b - a + 180) % 360) - 180;
}

// Smooth circular angle interpolation
function lerpAngle(current: number, target: number, t: number): number {
  const diff = angleDiff(current, target);
  return (current + diff * t + 360) % 360;
}

export const NavigationVisualization: React.FC<NavigationVisualizationProps> = ({ onStatusChange }) => {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const carMarkerRef = useRef<L.Marker | null>(null);

  const [activeCityId, setActiveCityId] = useState<string>('cbe-gandhipuram');
  const [viewAngle, setViewAngle] = useState<MapViewAngle>('3d-cockpit');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.02);
  const [simSpeed, setSimSpeed] = useState(1);
  const [manualOutage, setManualOutage] = useState<boolean | null>(null);
  const [cameraFollow, setCameraFollow] = useState(true);
  const [currentStreet, setCurrentStreet] = useState('Dr. Nanjappa Road (NH 181)');
  const [currentManeuver, setCurrentManeuver] = useState('Head North on Dr. Nanjappa Rd toward Signal');
  const [speedLimit, setSpeedLimit] = useState(40);

  // Filtered smoothed vehicle state
  const smoothStateRef = useRef({
    lat: 11.01450,
    lng: 76.96770,
    heading: 8.0,
    speed: 40.0,
    segmentIdx: 0,
    isInitialized: false,
  });

  const [telemetry, setTelemetry] = useState({
    gnssStatus: 'LOCKED' as GNSSState,
    drMode: 'STANDBY' as DRMode,
    speedKmh: 40.0,
    headingDeg: 8.0,
    positionErrorM: 0.7,
    imuRateHz: 200,
    aiConfidencePct: 99.4,
    satellites: 28,
    covariance: 0.32,
    lat: 11.0145,
    lng: 76.9677,
  });

  const currentCity = COIMBATORE_NAVIGATION_ROUTES.find((c) => c.id === activeCityId) || COIMBATORE_NAVIGATION_ROUTES[0];
  const compiledRoute = compileRoute(currentCity);

  // Map-matched road progression engine
  const getRoadMatchedVehicleState = (t: number) => {
    const { points, totalDistanceM } = compiledRoute;
    if (points.length < 2) {
      return {
        lat: currentCity.center[0],
        lng: currentCity.center[1],
        heading: 0,
        segment: currentCity.segments[0],
        speedLimit: 40,
      };
    }

    const clampedT = Math.max(0, Math.min(0.9999, t));
    const targetDistance = clampedT * totalDistanceM;

    // Locate road segment polyline index
    let idx = 0;
    while (idx < points.length - 2 && points[idx + 1].cumDistM < targetDistance) {
      idx++;
    }

    const p1 = points[idx];
    const p2 = points[idx + 1];
    const segDist = p2.cumDistM - p1.cumDistM;
    const localRatio = segDist > 0 ? (targetDistance - p1.cumDistM) / segDist : 0;

    // Strict linear interpolation along road centerline
    const rawLat = p1.lat + (p2.lat - p1.lat) * localRatio;
    const rawLng = p1.lng + (p2.lng - p1.lng) * localRatio;

    // Strict tangent heading along road vector
    const dLat = p2.lat - p1.lat;
    const dLng = p2.lng - p1.lng;
    const rawHeading = ((Math.atan2(dLng, dLat) * (180 / Math.PI)) + 360) % 360;

    // Look-ahead heading for smooth turning transitions at intersections
    let lookAheadHeading = rawHeading;
    if (idx < points.length - 2) {
      const p3 = points[idx + 2];
      const dLatNext = p3.lat - p2.lat;
      const dLngNext = p3.lng - p2.lng;
      const nextHeading = ((Math.atan2(dLngNext, dLatNext) * (180 / Math.PI)) + 360) % 360;
      if (localRatio > 0.70) {
        const turnWeight = (localRatio - 0.70) / 0.30;
        lookAheadHeading = lerpAngle(rawHeading, nextHeading, turnWeight);
      }
    }

    return {
      lat: rawLat,
      lng: rawLng,
      heading: lookAheadHeading,
      segment: p1.segment,
      speedLimit: p1.segment.speedLimit,
    };
  };

  // Initialize Map strictly at street navigation zoom (18)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const isDark = theme === 'dark';
    const firstPoint = currentCity.segments[0].polyline[0];

    const map = L.map(mapContainerRef.current, {
      center: firstPoint,
      zoom: 18,
      minZoom: 16,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // High-Resolution OpenStreetMap Vector Tiles with street labels and road markings
    const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, { 
      maxZoom: 19,
      className: isDark ? 'dark-map-tiles' : ''
    }).addTo(map);

    // High-Contrast 3D Navigation Arrow Puck Marker
    const carIcon = L.divIcon({
      className: 'gmaps-nav-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: ${isDark ? 'rgba(56, 189, 248, 0.40)' : 'rgba(2, 132, 199, 0.30)'}; filter: blur(4px);"></div>
          <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: ${isDark ? '#080E1A' : '#FFFFFF'}; border: 2.5px solid ${isDark ? '#38BDF8' : '#0284C7'}; box-shadow: 0 4px 14px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center;">
            <svg id="cbe-nav-arrow" width="18" height="18" viewBox="0 0 24 24" style="transform-origin: center; transform: rotate(0deg); transition: transform 0.08s linear;">
              <polygon points="12 2 22 20 12 16 2 20 12 2" fill="${isDark ? '#38BDF8' : '#0284C7'}" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const marker = L.marker(firstPoint, { icon: carIcon }).addTo(map);
    carMarkerRef.current = marker;
    mapInstanceRef.current = map;

    smoothStateRef.current = {
      lat: firstPoint[0],
      lng: firstPoint[1],
      heading: 8.0,
      speed: 40.0,
      segmentIdx: 0,
      isInitialized: true,
    };

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeCityId, theme]);

  // Real-time continuous animation loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setProgress((prev) => {
          const next = prev + (0.016 * simSpeed * delta);
          return next >= 1 ? 0 : next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simSpeed]);

  // Map matching & continuous navigation state update
  useEffect(() => {
    const rawState = getRoadMatchedVehicleState(progress);
    const seg = rawState.segment;
    const isTunnel = seg.zone === 'tunnel' || (progress >= 0.65 && progress <= 0.88);

    // Apply continuous exponential smoothing to eliminate micro-jitter
    const smooth = smoothStateRef.current;
    if (!smooth.isInitialized) {
      smooth.lat = rawState.lat;
      smooth.lng = rawState.lng;
      smooth.heading = rawState.heading;
      smooth.isInitialized = true;
    } else {
      smooth.lat = smooth.lat + (rawState.lat - smooth.lat) * 0.40;
      smooth.lng = smooth.lng + (rawState.lng - smooth.lng) * 0.40;
      smooth.heading = lerpAngle(smooth.heading, rawState.heading, 0.35);
    }

    let gnss: GNSSState = 'LOCKED';
    let dr: DRMode = 'STANDBY';
    let posErr = 0.7;
    let sats = 28;
    let conf = 99.4;
    let cov = 0.32;
    let speed = seg.speedLimit + Math.sin(progress * 25) * 2.0;

    if (manualOutage === true || (manualOutage === null && isTunnel)) {
      gnss = 'LOST';
      dr = 'ENGAGED';
      const fraction = manualOutage === true ? 0.6 : (progress - 0.65) / 0.23;
      posErr = 1.1 + Math.max(0, fraction) * 1.5;
      sats = 0;
      conf = 98.2 - Math.max(0, fraction) * 2.0;
      cov = 1.2 + Math.max(0, fraction) * 1.5;
      speed = Math.max(30, speed - 2);
    } else if (manualOutage === null && seg.zone === 'urban-canyon') {
      gnss = 'DEGRADING';
      dr = 'STANDBY';
      posErr = 1.2;
      sats = 6;
      conf = 96.0;
      cov = 0.65;
    } else if (manualOutage === null && seg.zone === 'recovering') {
      gnss = 'RECOVERING';
      dr = 'CONVERGING';
      posErr = 0.9;
      sats = 24;
      conf = 98.9;
      cov = 0.45;
    }

    setCurrentStreet(seg.name);
    setCurrentManeuver(seg.maneuver);
    setSpeedLimit(seg.speedLimit);

    setTelemetry({
      gnssStatus: gnss,
      drMode: dr,
      speedKmh: Math.round(speed * 10) / 10,
      headingDeg: Math.round(smooth.heading * 10) / 10,
      positionErrorM: Math.round(posErr * 10) / 10,
      imuRateHz: 200,
      aiConfidencePct: Math.round(conf * 10) / 10,
      satellites: sats,
      covariance: Math.round(cov * 100) / 100,
      lat: Math.round(smooth.lat * 100000) / 100000,
      lng: Math.round(smooth.lng * 100000) / 100000,
    });

    if (onStatusChange) {
      onStatusChange(gnss);
    }

    // Update marker location & rotate arrow to exact road heading
    if (carMarkerRef.current) {
      carMarkerRef.current.setLatLng([smooth.lat, smooth.lng]);
      const arrowElem = document.getElementById('cbe-nav-arrow');
      if (arrowElem) {
        arrowElem.style.transform = `rotate(${smooth.heading}deg)`;
      }
    }

    // Camera follow at street level (instant zero-lag tracking locked to vehicle)
    if (cameraFollow && mapInstanceRef.current) {
      mapInstanceRef.current.setView([smooth.lat, smooth.lng], mapInstanceRef.current.getZoom(), { animate: false });
    }
  }, [progress, manualOutage, cameraFollow, onStatusChange]);

  const handleCityChange = (cityId: string) => {
    setActiveCityId(cityId);
    setProgress(0.02);
    setManualOutage(null);
    smoothStateRef.current.isInitialized = false;
  };

  // Helper to compute cardinal direction from heading
  const getCardinalDirection = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
    return directions[idx];
  };

  // Compute Perspective Transform grounded strictly on the road surface
  const getMapTransformStyle = () => {
    if (viewAngle === '3d-cockpit') {
      return {
        transform: 'perspective(1000px) rotateX(24deg) scale(1.08)',
        transformOrigin: '50% 65%',
        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
      };
    }
    if (viewAngle === '3d-isometric') {
      return {
        transform: 'perspective(1200px) rotateX(18deg) rotateY(-5deg) scale(1.04)',
        transformOrigin: '50% 50%',
        transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
      };
    }
    return {
      transform: 'none',
      transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
    };
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-neutral-100 dark:bg-[#07070C] border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden transition-all">
      
      {/* Top Banner (Turn Maneuver + Coimbatore Circuits) */}
      <div className="p-3.5 sm:p-5 bg-white dark:bg-[#0D0D12] border-b border-neutral-300 dark:border-neutral-800 relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Turn-by-Turn Maneuver */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-black text-white dark:bg-white dark:text-black shadow-sm shrink-0">
            <CompassIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs text-neutral-500 font-mono flex items-center gap-1.5 truncate">
              <span className="font-semibold text-neutral-900 dark:text-neutral-200 truncate">{currentStreet}</span>
              <span>•</span>
              <span className="font-bold text-neutral-900 dark:text-white shrink-0">{speedLimit} km/h</span>
            </div>
            <div className="font-bold text-xs sm:text-sm md:text-base text-neutral-950 dark:text-white mt-0.5 tracking-tight truncate">
              {currentManeuver}
            </div>
          </div>
        </div>

        {/* Right: Coimbatore Circuit Tabs + 3D View Angle Mode Switcher & GNSS Badge */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800">
          
          {/* Circuit Tabs (Coimbatore focus) */}
          <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-xl bg-neutral-100 dark:bg-black/50 border border-neutral-300 dark:border-neutral-800 text-[11px] sm:text-xs font-mono overflow-x-auto max-w-full">
            {COIMBATORE_NAVIGATION_ROUTES.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCityChange(city.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all whitespace-nowrap font-semibold ${
                  activeCityId === city.id
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {city.shortName}
              </button>
            ))}
          </div>

          {/* 3D View Mode Angle Selector (3D Cockpit / 3D Isometric / 2D Overhead) */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono">
            <button
              onClick={() => setViewAngle('3d-cockpit')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                viewAngle === '3d-cockpit'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
              title="3D In-Cabin Driving Pitch Angle"
            >
              <EyeIcon className="w-3.5 h-3.5" />
              <span>3D Cockpit</span>
            </button>

            <button
              onClick={() => setViewAngle('3d-isometric')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                viewAngle === '3d-isometric'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
              title="3D Isometric Vantage Angle"
            >
              <LayersIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D Iso</span>
            </button>

            <button
              onClick={() => setViewAngle('2d')}
              className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                viewAngle === '2d'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
              }`}
              title="2D Overhead Ortho View"
            >
              <span>2D Top</span>
            </button>
          </div>

          {/* GNSS Status Badge */}
          <span
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase transition-all shrink-0 ${
              telemetry.gnssStatus === 'LOCKED'
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                : telemetry.gnssStatus === 'LOST'
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 animate-pulse'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
            }`}
          >
            {telemetry.gnssStatus === 'LOST' ? '⚡ DR ACTIVE (INS ONLY)' : `GNSS ${telemetry.gnssStatus}`}
          </span>
        </div>
      </div>

      {/* Real-time Map Viewport with 3D Perspective Angles */}
      <div className="relative w-full h-[400px] sm:h-[540px] overflow-hidden bg-[#050811]">
        
        {/* ================================================================= */}
        {/* 3D COCKPIT AEROSPACE SKY HORIZON & HEADS-UP DISPLAY (HUD)         */}
        {/* ================================================================= */}
        {viewAngle === '3d-cockpit' && (
          <div className="absolute inset-x-0 top-0 h-52 z-20 pointer-events-none select-none overflow-hidden">
            {/* 1. Deep Midnight Cybernetic Sky Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#04060E] via-[#080E20]/90 to-transparent" />
            
            {/* 2. Cyber Horizon Grid with Luminous Cyan Vanishing Line */}
            <div className="absolute top-32 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
            <div className="absolute top-28 inset-x-0 h-8 bg-cyan-500/5 blur-xl pointer-events-none" />

            {/* 3. Distant Skyline Vector Silhouette */}
            <svg
              className="absolute top-20 inset-x-0 w-full h-12 opacity-25 text-cyan-400"
              preserveAspectRatio="none"
              viewBox="0 0 1000 80"
            >
              <polygon
                points="0,80 0,55 60,40 120,60 180,30 240,50 320,20 400,45 480,15 560,40 640,25 720,50 800,35 880,55 940,30 1000,45 1000,80"
                fill="currentColor"
              />
            </svg>

            {/* 4. Horizon Cockpit HUD Header Strip */}
            <div className="relative z-10 px-3 sm:px-6 pt-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              
              {/* Left Wing: GNSS Orbital Radar & Dual Frequency L1/L5 */}
              <div className="hidden md:flex md:col-span-4 items-center gap-3 p-2.5 rounded-2xl bg-black/75 backdrop-blur-md border border-neutral-700/60 shadow-xl font-mono text-[11px] text-white">
                <div className="relative w-11 h-11 rounded-full border border-cyan-500/40 bg-cyan-950/30 flex items-center justify-center shrink-0 overflow-hidden">
                  {/* Radar Concentric Rings */}
                  <div className="absolute inset-1 rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-2.5 rounded-full border border-cyan-500/15" />
                  {/* Center Dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                  {/* Satellite Blips */}
                  {telemetry.satellites > 0 ? (
                    <>
                      <div className="absolute top-2 left-3 w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="absolute bottom-2.5 right-3 w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      <div className="absolute top-4 right-2 w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                      <div className="absolute bottom-3 left-2 w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/60">
                      <WifiOffIcon className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    </div>
                  )}
                  {/* Sweeping Scanner Line */}
                  <div className="absolute inset-0 origin-center animate-spin" style={{ animationDuration: '3s' }}>
                    <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent to-cyan-400" />
                  </div>
                </div>

                <div className="min-w-0 flex-grow">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-0.5">
                    <span className="font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <SatelliteIcon className="w-3 h-3" />
                      GNSS CONSTELLATION
                    </span>
                    <span className="font-bold text-white">
                      {telemetry.satellites > 0 ? `${telemetry.satellites}/32 SATS` : '0 SATS'}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-neutral-200 flex items-center justify-between">
                    <span>BAND: L1/L5 DUAL</span>
                    <span className={telemetry.satellites === 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}>
                      {telemetry.satellites === 0 ? 'BLACKOUT' : 'LOCKED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Wing: Digital Compass Heading Ribbon Tape */}
              <div className="col-span-12 md:col-span-4 flex flex-col items-center">
                {/* Compass Tape Box */}
                <div className="w-full max-w-[280px] p-2 rounded-2xl bg-black/80 backdrop-blur-md border border-neutral-700/60 shadow-2xl flex flex-col items-center font-mono">
                  {/* Digital Bearing Display */}
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                    <CrosshairIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-cyan-400 text-sm tracking-wider font-extrabold">
                      {telemetry.headingDeg.toFixed(0).padStart(3, '0')}°
                    </span>
                    <span className="text-neutral-400 text-[11px] font-semibold">
                      {getCardinalDirection(telemetry.headingDeg)}
                    </span>
                  </div>

                  {/* Horizontal Compass Tick Tape */}
                  <div className="relative w-full h-5 overflow-hidden flex items-center justify-center border-t border-b border-neutral-800 bg-neutral-950/60 rounded px-2">
                    {/* Fixed Center Index Marker */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-cyan-400 z-20 shadow-[0_0_8px_#06b6d4]">
                      <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-cyan-400 -mt-0.5 -ml-1" />
                    </div>

                    {/* Scrolling Degree Tape */}
                    <div
                      className="flex items-center gap-4 text-[9px] text-neutral-400 font-bold transition-transform duration-100 ease-linear"
                      style={{
                        transform: `translateX(${-((telemetry.headingDeg % 360) * 2.2) + 20}px)`,
                      }}
                    >
                      {[-360, 0, 360].map((base) =>
                        [
                          { deg: 0, label: 'N' },
                          { deg: 45, label: 'NE' },
                          { deg: 90, label: 'E' },
                          { deg: 135, label: 'SE' },
                          { deg: 180, label: 'S' },
                          { deg: 225, label: 'SW' },
                          { deg: 270, label: 'W' },
                          { deg: 315, label: 'NW' },
                        ].map((pt) => (
                          <div key={`${base}-${pt.deg}`} className="flex items-center gap-1 shrink-0">
                            <span className={pt.label === 'N' ? 'text-red-400 font-extrabold' : 'text-neutral-300'}>
                              {pt.label}
                            </span>
                            <span className="text-[8px] text-neutral-600">{(pt.deg + base + 360) % 360}°</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Wing: 200Hz INS Kalman Filter State Matrix */}
              <div className="hidden md:flex md:col-span-4 items-center justify-between gap-3 p-2.5 rounded-2xl bg-black/75 backdrop-blur-md border border-neutral-700/60 shadow-xl font-mono text-[11px] text-white">
                <div className="space-y-1 min-w-0 flex-grow">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-0.5">
                    <span className="font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <CpuIcon className="w-3 h-3" />
                      200Hz INS KALMAN
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                      TIGHTLY-COUPLED
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <div>
                      <span className="text-neutral-500 text-[8px] block">DRIFT</span>
                      <span className="font-bold text-neutral-100">±{telemetry.positionErrorM}m</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[8px] block">AI CONF</span>
                      <span className="font-bold text-emerald-400">{telemetry.aiConfidencePct}%</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[8px] block">COV (P)</span>
                      <span className="font-bold text-neutral-100">{telemetry.covariance}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center shrink-0">
                  <ActivityIcon className="w-4 h-4 text-cyan-400 mx-auto animate-pulse" />
                  <span className="text-[8px] font-bold text-cyan-300 block mt-0.5">200 Hz</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3D Atmospheric Sky Horizon Gradient when in 3D Isometric Mode */}
        {viewAngle === '3d-isometric' && (
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-neutral-900/60 dark:from-black/80 to-transparent pointer-events-none z-20" />
        )}

        {/* Map Container with 3D Matrix Perspective Angle */}
        <div 
          ref={mapContainerRef} 
          style={getMapTransformStyle()}
          className="w-full h-full z-10" 
        />

        {/* Speedometer Gauge (Bottom Left) */}
        <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-black/85 backdrop-blur-md border border-neutral-700/70 text-center shadow-2xl z-20 min-w-[75px] sm:min-w-[95px] text-white font-mono">
          <div className="text-[8px] sm:text-[10px] text-neutral-400 uppercase font-bold">SPEED</div>
          <div className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
            {telemetry.speedKmh}
          </div>
          <div className="text-[8px] sm:text-[10px] text-cyan-400 font-bold">KM/H</div>
        </div>

        {/* High-Contrast Telemetry Card (For 3D Iso & 2D Top Views) */}
        {viewAngle !== '3d-cockpit' && (
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#0D0D12]/95 border border-neutral-300 dark:border-neutral-700 text-[10px] sm:text-[11px] font-mono space-y-1.5 sm:space-y-3 shadow-lg max-w-[160px] sm:max-w-[240px] z-20">
            <div className="flex items-center justify-between pb-1 sm:pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                {viewAngle === '3d-isometric' ? '3D Isometric' : '2D Overhead'}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700">
                200Hz INS
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:gap-x-3 sm:gap-y-2">
              <div>
                <div className="text-neutral-500 text-[8px] sm:text-[10px]">ERR</div>
                <div className="font-bold text-xs sm:text-sm text-neutral-950 dark:text-white">
                  ±{telemetry.positionErrorM}m
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-[8px] sm:text-[10px]">SATS</div>
                <div className={`font-bold text-xs sm:text-sm ${telemetry.satellites === 0 ? 'text-black dark:text-white underline' : 'text-neutral-950 dark:text-white'}`}>
                  {telemetry.satellites > 0 ? `${telemetry.satellites}/32` : '0 (LOST)'}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-[8px] sm:text-[10px]">HEADING</div>
                <div className="font-bold text-xs sm:text-sm text-neutral-950 dark:text-white">
                  {telemetry.headingDeg}°
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-[8px] sm:text-[10px]">AI CONF</div>
                <div className="font-bold text-xs sm:text-sm text-neutral-950 dark:text-white">
                  {telemetry.aiConfidencePct}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Coordinate Footer on Map */}
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 p-2 sm:p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-neutral-700/70 text-[9px] sm:text-[10px] font-mono shadow-2xl z-20 hidden xs:block text-white">
          <span className="text-neutral-400">COIMBATORE GPS: </span>
          <span className="font-bold text-cyan-300">{telemetry.lat.toFixed(4)}° N, {telemetry.lng.toFixed(4)}° E</span>
        </div>
      </div>

      {/* Navigation Control Dock */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-white dark:bg-[#121216] border-t border-neutral-300 dark:border-neutral-800 relative z-30">
        
        {/* Playback action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white transition-all active:scale-95 shadow-sm"
            title={isPlaying ? 'Pause Navigation' : 'Resume Navigation'}
          >
            {isPlaying ? <PauseIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <PlayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>
          
          <button
            onClick={() => {
              setProgress(0.08);
              setManualOutage(null);
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white transition-all active:scale-95 shadow-sm"
            title="Restart Route"
          >
            <RotateCcwIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          
          {/* Recenter Camera */}
          <button
            onClick={() => setCameraFollow(!cameraFollow)}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all flex items-center gap-1 border ${
              cameraFollow
                ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
            }`}
          >
            <CrosshairIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">{cameraFollow ? 'Follow Vehicle' : 'Free Pan'}</span>
          </button>

          {/* Force Outage Toggle */}
          <button
            onClick={() => setManualOutage((prev) => (prev === true ? null : true))}
            className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all flex items-center gap-1 border ${
              manualOutage === true
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent font-bold'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            <ShieldAlertIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{manualOutage === true ? 'Outage Active' : 'Force Outage'}</span>
          </button>
        </div>

        {/* Scrubber & Speed Controls */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 flex-grow sm:flex-grow-0">
            <span className="text-neutral-500 text-[10px]">ROUTE:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              onChange={(e) => {
                setProgress(parseFloat(e.target.value));
                setManualOutage(null);
              }}
              className="flex-grow sm:w-28 h-1.5 bg-neutral-300 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${
                  simSpeed === s
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
