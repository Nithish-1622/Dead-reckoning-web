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
  Building2Icon,
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

export interface CityRoute {
  id: string;
  name: string;
  shortName: string;
  state: string;
  destination: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  // High-density, exact real-world road centerline coordinates [lat, lng]
  roadPath: [number, number][];
  waypoints: {
    lat: number;
    lng: number;
    street: string;
    zone: 'open' | 'urban-canyon' | 'tunnel' | 'recovering';
    speedLimit: number;
    maneuver: string;
  }[];
}

export const COIMBATORE_NAVIGATION_ROUTES: CityRoute[] = [
  {
    id: 'cbe-gandhipuram',
    name: 'Coimbatore — Gandhipuram Flyover & 100ft Road Loop',
    shortName: 'Gandhipuram, CBE',
    state: 'Tamil Nadu',
    destination: 'Cross Cut Rd via Gandhipuram Under-Deck',
    center: [11.0195, 76.9630],
    zoom: 16,
    roadPath: [
      // 1. Dr. Nanjappa Road (Heading North toward Gandhipuram)
      [11.01450, 76.96320],
      [11.01550, 76.96390],
      [11.01660, 76.96470],
      [11.01750, 76.96540], // Gandhipuram Signal
      // 2. Gandhipuram 2-Tier Flyover Sub-Deck (Tunnel / Outage Zone on Sathyamangalam Rd)
      [11.01860, 76.96620], // Enter Flyover Sub-Level (Outage begins)
      [11.01970, 76.96700], // Under Flyover Deck
      [11.02080, 76.96780],
      [11.02190, 76.96860], // North Portal Exit
      // 3. Turn Left onto 100 Feet Road (Heading West)
      [11.02280, 76.96750],
      [11.02340, 76.96580],
      [11.02380, 76.96400], // 100 Feet Road Arterial
      [11.02410, 76.96200],
      [11.02430, 76.96000],
      // 4. Turn Left onto Cross Cut Road (Heading South)
      [11.02350, 76.95920],
      [11.02180, 76.95850], // Cross Cut Road Shopping District
      [11.02000, 76.95780],
      [11.01820, 76.95710], // Brookefields Mall Arterial
      // 5. Return via Dr. Rajendra Prasad Rd back to Dr. Nanjappa Rd
      [11.01680, 76.95850],
      [11.01560, 76.96080],
      [11.01450, 76.96320]  // Loop complete
    ],
    waypoints: [
      { lat: 11.01450, lng: 76.96320, street: 'Dr. Nanjappa Road', zone: 'open', speedLimit: 40, maneuver: 'Head North on Dr. Nanjappa Rd' },
      { lat: 11.01750, lng: 76.96540, street: 'Gandhipuram Central Signal', zone: 'urban-canyon', speedLimit: 35, maneuver: 'Approaching 2-Tier Flyover Underpass' },
      { lat: 11.01860, lng: 76.96620, street: 'Gandhipuram Flyover Under-Deck', zone: 'tunnel', speedLimit: 45, maneuver: 'Enter Flyover Sub-Deck (GNSS Lost)' },
      { lat: 11.02080, lng: 76.96780, street: 'Sathyamangalam Road Corridor', zone: 'tunnel', speedLimit: 48, maneuver: 'Flyover Underpass Transit (200Hz INS Active)' },
      { lat: 11.02190, lng: 76.96860, street: 'GP North Ramp Exit', zone: 'recovering', speedLimit: 40, maneuver: 'Exiting Flyover Deck toward 100 Feet Rd' },
      { lat: 11.02380, lng: 76.96400, street: '100 Feet Road', zone: 'open', speedLimit: 45, maneuver: 'Continue West on 100 Feet Rd' },
      { lat: 11.02180, lng: 76.95850, street: 'Cross Cut Road Hub', zone: 'urban-canyon', speedLimit: 30, maneuver: 'Turn Left onto Cross Cut Rd' },
      { lat: 11.01820, lng: 76.95710, street: 'Brookefields Mall Arterial', zone: 'open', speedLimit: 40, maneuver: 'Arriving at Destination' }
    ]
  },
  {
    id: 'cbe-avinashi',
    name: 'Coimbatore — Avinashi Road Elevated Corridor (SH 52)',
    shortName: 'Avinashi Rd, CBE',
    state: 'Tamil Nadu',
    destination: 'Coimbatore Airport (CJB) Corridor',
    center: [11.0250, 77.0100],
    zoom: 15,
    roadPath: [
      // Avinashi Road Linear Centerline
      [11.01250, 76.98220], // Lakshmi Mills Junction
      [11.01450, 76.98650],
      [11.01650, 76.99050],
      [11.01820, 76.99450], // Nava India Signal
      [11.02050, 76.99950],
      [11.02250, 77.00350],
      [11.02380, 77.00680], // Peelamedu Elevated Expressway Shadow (GNSS Outage begins)
      [11.02550, 77.01050],
      [11.02650, 77.01350], // PSG Tech Main Gate Underpass
      [11.02800, 77.01750],
      [11.02980, 77.02250], // Hope College Under-Deck
      [11.03150, 77.02650],
      [11.03350, 77.03100], // Fun Republic Mall
      [11.03550, 77.03600],
      [11.03780, 77.04250], // KMCH & Coimbatore Airport (CJB) Road
      // Smooth return loop
      [11.03550, 77.03600],
      [11.03150, 77.02650],
      [11.02650, 77.01350],
      [11.02050, 76.99950],
      [11.01250, 76.98220]
    ],
    waypoints: [
      { lat: 11.01250, lng: 76.98220, street: 'Lakshmi Mills Junction', zone: 'open', speedLimit: 50, maneuver: 'Head East on Avinashi Road' },
      { lat: 11.01820, lng: 76.99450, street: 'Nava India Canyon', zone: 'urban-canyon', speedLimit: 45, maneuver: 'Passing Commercial High-Rise Zone' },
      { lat: 11.02380, lng: 77.00680, street: 'Peelamedu Elevated Deck Shadow', zone: 'tunnel', speedLimit: 55, maneuver: 'Elevated Deck Shadow (Zero GNSS Lock)' },
      { lat: 11.02650, lng: 77.01350, street: 'PSG Tech Underpass Zone', zone: 'tunnel', speedLimit: 60, maneuver: 'Dead Reckoning Trajectory Active' },
      { lat: 11.02980, lng: 77.02250, street: 'Hope College Sub-Level Portal', zone: 'recovering', speedLimit: 50, maneuver: 'Signal Restoring near Hope College' },
      { lat: 11.03780, lng: 77.04250, street: 'Coimbatore Airport (CJB) Road', zone: 'open', speedLimit: 60, maneuver: 'Turn Right toward Airport Terminal' }
    ]
  },
  {
    id: 'cbe-rspuram',
    name: 'Coimbatore — RS Puram & DB Road Corridor',
    shortName: 'RS Puram, CBE',
    state: 'Tamil Nadu',
    destination: 'Thadagam Road via DB Road',
    center: [11.0110, 76.9490],
    zoom: 16,
    roadPath: [
      // Diwan Bahadur (DB) Road Centerline
      [11.00550, 76.95350], // DB Road South Entry
      [11.00750, 76.95200],
      [11.00950, 76.95050], // Flower Market Roundabout
      [11.01150, 76.94900], // RS Puram Head Post Office
      [11.01350, 76.94750], // Cowley Brown Road Underpass Shadow
      [11.01550, 76.94600], // Dense commercial canopy
      [11.01750, 76.94450], // Thadagam Road Junction
      // Turn onto Thadagam Road
      [11.01850, 76.94250],
      [11.01750, 76.93950], // TNAU Campus Gate
      [11.01450, 76.94150],
      [11.01050, 76.94550],
      [11.00550, 76.95350]
    ],
    waypoints: [
      { lat: 11.00550, lng: 76.95350, street: 'DB Road South', zone: 'open', speedLimit: 35, maneuver: 'Head North on Diwan Bahadur Rd' },
      { lat: 11.01150, lng: 76.94900, street: 'RS Puram Post Office Signal', zone: 'urban-canyon', speedLimit: 30, maneuver: 'Approaching Dense Commercial Zone' },
      { lat: 11.01350, lng: 76.94750, street: 'Cowley Brown Road Shadow', zone: 'tunnel', speedLimit: 40, maneuver: 'Multipath Shadow Outage (INS Engaged)' },
      { lat: 11.01750, lng: 76.94450, street: 'Thadagam Road Junction', zone: 'recovering', speedLimit: 35, maneuver: 'Reacquiring Satellite Constellation' },
      { lat: 11.01750, lng: 76.93950, street: 'TNAU Campus Gate', zone: 'open', speedLimit: 45, maneuver: 'Arriving at Destination' }
    ]
  }
];

export const NavigationVisualization: React.FC<NavigationVisualizationProps> = ({ onStatusChange }) => {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const carMarkerRef = useRef<L.Marker | null>(null);
  const liveTrailRef = useRef<L.Polyline | null>(null);
  const buildingsLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeCityId, setActiveCityId] = useState<string>('cbe-gandhipuram');
  const [viewAngle, setViewAngle] = useState<MapViewAngle>('3d-cockpit');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.08);
  const [simSpeed, setSimSpeed] = useState(1);
  const [manualOutage, setManualOutage] = useState<boolean | null>(null);
  const [cameraFollow, setCameraFollow] = useState(true);
  const [show3DBuildings, setShow3DBuildings] = useState(true);
  const [currentStreet, setCurrentStreet] = useState('Dr. Nanjappa Road, Coimbatore');
  const [currentManeuver, setCurrentManeuver] = useState('Head North on Dr. Nanjappa Rd');
  const [speedLimit, setSpeedLimit] = useState(40);

  const [telemetry, setTelemetry] = useState({
    gnssStatus: 'LOCKED' as GNSSState,
    drMode: 'STANDBY' as DRMode,
    speedKmh: 42.4,
    headingDeg: 15.0,
    positionErrorM: 0.7,
    imuRateHz: 200,
    aiConfidencePct: 99.4,
    satellites: 28,
    covariance: 0.32,
    lat: 11.0145,
    lng: 76.9632
  });

  const currentCity = COIMBATORE_NAVIGATION_ROUTES.find((c) => c.id === activeCityId) || COIMBATORE_NAVIGATION_ROUTES[0];

  // Exact Linear Road Snapping (Lat/Lng strictly along road centerline vectors)
  const getRoadSnappedPosition = (t: number) => {
    const path = currentCity.roadPath;
    const totalSegments = path.length - 1;
    const clampedT = Math.max(0, Math.min(0.9999, t));
    const scaledT = clampedT * totalSegments;
    const segmentIdx = Math.floor(scaledT);
    const localT = scaledT - segmentIdx;

    const p1 = path[segmentIdx]; // [lat, lng]
    const p2 = path[segmentIdx + 1]; // [lat, lng]

    const lat = p1[0] + (p2[0] - p1[0]) * localT;
    const lng = p1[1] + (p2[1] - p1[1]) * localT;

    // Calculate heading angle from road vector
    const dLat = p2[0] - p1[0];
    const dLng = p2[1] - p1[1];
    const heading = ((Math.atan2(dLng, dLat) * (180 / Math.PI)) + 360) % 360;

    // Closest waypoint for maneuver info
    const wps = currentCity.waypoints;
    const wpIdx = Math.min(Math.floor(clampedT * wps.length), wps.length - 1);
    const currentWp = wps[wpIdx];

    return { lat, lng, heading, currentWp };
  };

  // Generate 3D Extrusion Buildings along the Coimbatore road corridor
  const create3DBuildingPolygons = (map: L.Map, isDark: boolean) => {
    const buildingGroup = L.layerGroup();
    const path = currentCity.roadPath;

    path.forEach((pt, i) => {
      if (i % 2 === 0) {
        const offsetLat = (Math.sin(i * 1.6) * 0.0007) + 0.0006;
        const offsetLng = (Math.cos(i * 1.6) * 0.0007) + 0.0006;
        const heightM = 16 + (i % 5) * 8; // 16m to 48m heights

        const bLat = pt[0] + offsetLat;
        const bLng = pt[1] + offsetLng;
        const size = 0.00045;

        // 1. Isometric Building Base Shadow
        const basePolygon: [number, number][] = [
          [bLat, bLng],
          [bLat + size, bLng],
          [bLat + size, bLng + size],
          [bLat, bLng + size]
        ];

        L.polygon(basePolygon, {
          color: isDark ? '#FFFFFF' : '#000000',
          weight: 1,
          opacity: isDark ? 0.35 : 0.25,
          fillColor: isDark ? '#141420' : '#E2E2EC',
          fillOpacity: isDark ? 0.85 : 0.75
        }).addTo(buildingGroup);

        // 2. Extruded Top Roof
        const roofShift = heightM * 0.000006;
        const roofPolygon: [number, number][] = [
          [bLat + roofShift, bLng + roofShift],
          [bLat + size + roofShift, bLng + roofShift],
          [bLat + size + roofShift, bLng + size + roofShift],
          [bLat + roofShift, bLng + size + roofShift]
        ];

        L.polygon(roofPolygon, {
          color: isDark ? '#FFFFFF' : '#000000',
          weight: 1.2,
          opacity: isDark ? 0.6 : 0.45,
          fillColor: isDark ? '#222232' : '#C8C8D8',
          fillOpacity: isDark ? 0.95 : 0.85
        }).addTo(buildingGroup);

        // 3. Wall Lines connecting Base to Roof
        for (let v = 0; v < 4; v++) {
          L.polyline([basePolygon[v], roofPolygon[v]], {
            color: isDark ? '#FFFFFF' : '#000000',
            weight: 0.8,
            opacity: isDark ? 0.4 : 0.3
          }).addTo(buildingGroup);
        }
      }
    });

    buildingGroup.addTo(map);
    buildingsLayerRef.current = buildingGroup;
  };

  // Initialize Map strictly snapped to Coimbatore roads
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const isDark = theme === 'dark';
    const map = L.map(mapContainerRef.current, {
      center: currentCity.center,
      zoom: currentCity.zoom,
      zoomControl: false,
      attributionControl: false
    });

    // Official OpenStreetMap High-Resolution Vector Tiles (Zero Watermark / Zero API Key required)
    const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, { 
      maxZoom: 19,
      className: isDark ? 'dark-map-tiles' : ''
    }).addTo(map);

    // 3D Building Extrusion Layer
    if (show3DBuildings) {
      create3DBuildingPolygons(map, isDark);
    }

    // Dynamic Live Trajectory Trail
    const liveTrail = L.polyline([], {
      color: isDark ? '#FFFFFF' : '#000000',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    liveTrailRef.current = liveTrail;

    // High-Contrast 3D Navigation Arrow Puck Marker
    const carIcon = L.divIcon({
      className: 'gmaps-nav-marker',
      html: `
        <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)'}; filter: blur(4px);"></div>
          <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: ${isDark ? '#FFFFFF' : '#000000'}; border: 2.5px solid ${isDark ? '#000000' : '#FFFFFF'}; box-shadow: 0 4px 14px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
            <svg id="cbe-nav-arrow" width="14" height="14" viewBox="0 0 24 24" style="transform-origin: center; transform: rotate(0deg); transition: transform 0.08s linear;">
              <polygon points="12 2 22 20 12 16 2 20 12 2" fill="${isDark ? '#000000' : '#FFFFFF'}" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker(currentCity.center, { icon: carIcon }).addTo(map);
    carMarkerRef.current = marker;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeCityId, theme, show3DBuildings]);

  // Real-time animation driver
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

  // Position calculation strictly along the road path
  useEffect(() => {
    const pos = getRoadSnappedPosition(progress);
    const isTunnel = pos.currentWp.zone === 'tunnel' || (progress >= 0.20 && progress <= 0.55);

    let gnss: GNSSState = 'LOCKED';
    let dr: DRMode = 'STANDBY';
    let posErr = 0.7;
    let sats = 28;
    let conf = 99.4;
    let cov = 0.32;
    let speed = pos.currentWp.speedLimit + Math.sin(progress * 25) * 2.5;

    if (manualOutage === true || (manualOutage === null && isTunnel)) {
      gnss = 'LOST';
      dr = 'ENGAGED';
      const fraction = manualOutage === true ? 0.6 : (progress - 0.20) / 0.35;
      posErr = 1.1 + fraction * 1.5;
      sats = 0;
      conf = 98.2 - fraction * 2.0;
      cov = 1.2 + fraction * 1.5;
      speed = Math.max(35, speed - 3);
    } else if (manualOutage === null && pos.currentWp.zone === 'urban-canyon') {
      gnss = 'DEGRADING';
      dr = 'STANDBY';
      posErr = 1.2;
      sats = 6;
      conf = 96.0;
      cov = 0.65;
    } else if (manualOutage === null && pos.currentWp.zone === 'recovering') {
      gnss = 'RECOVERING';
      dr = 'CONVERGING';
      posErr = 0.9;
      sats = 24;
      conf = 98.9;
      cov = 0.45;
    }

    setCurrentStreet(pos.currentWp.street);
    setCurrentManeuver(pos.currentWp.maneuver);
    setSpeedLimit(pos.currentWp.speedLimit);

    setTelemetry({
      gnssStatus: gnss,
      drMode: dr,
      speedKmh: Math.round(speed * 10) / 10,
      headingDeg: Math.round(pos.heading * 10) / 10,
      positionErrorM: Math.round(posErr * 10) / 10,
      imuRateHz: 200,
      aiConfidencePct: Math.round(conf * 10) / 10,
      satellites: sats,
      covariance: Math.round(cov * 100) / 100,
      lat: Math.round(pos.lat * 100000) / 100000,
      lng: Math.round(pos.lng * 100000) / 100000
    });

    if (onStatusChange) {
      onStatusChange(gnss);
    }

    // Update marker location & rotate arrow to exact road heading
    if (carMarkerRef.current) {
      carMarkerRef.current.setLatLng([pos.lat, pos.lng]);
      const arrowElem = document.getElementById('cbe-nav-arrow');
      if (arrowElem) {
        arrowElem.style.transform = `rotate(${pos.heading}deg)`;
      }
    }

    // Dynamic Trail strictly along previous road segments
    if (liveTrailRef.current) {
      const trailCoords: [number, number][] = [];
      const step = 0.005;
      for (let t = Math.max(0, progress - 0.25); t <= progress; t += step) {
        const pt = getRoadSnappedPosition(t);
        trailCoords.push([pt.lat, pt.lng]);
      }
      trailCoords.push([pos.lat, pos.lng]);
      liveTrailRef.current.setLatLngs(trailCoords);
    }

    // Camera follow
    if (cameraFollow && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([pos.lat, pos.lng], { animate: true, duration: 0.15 });
    }
  }, [progress, manualOutage, cameraFollow, onStatusChange]);

  const handleCityChange = (cityId: string) => {
    setActiveCityId(cityId);
    setProgress(0.08);
    setManualOutage(null);
  };

  // Helper to compute cardinal direction from heading
  const getCardinalDirection = (deg: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
    return directions[idx];
  };

  // Compute 3D Perspective CSS Transform based on active view angle
  const getMapTransformStyle = () => {
    if (viewAngle === '3d-cockpit') {
      return {
        transform: 'perspective(850px) rotateX(46deg) scale(1.22)',
        transformOrigin: '50% 90%',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0) 97%)',
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0) 97%)',
        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
      };
    }
    if (viewAngle === '3d-isometric') {
      return {
        transform: 'perspective(1000px) rotateX(32deg) rotateY(-8deg) scale(1.10)',
        transformOrigin: '50% 50%',
        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
      };
    }
    return {
      transform: 'none',
      transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
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

          {/* Toggle 3D Buildings Pill */}
          <button
            onClick={() => setShow3DBuildings(!show3DBuildings)}
            className={`p-1.5 px-2.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
              show3DBuildings
                ? 'bg-black text-white dark:bg-white dark:text-black border-transparent font-bold'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
            }`}
            title="Toggle 3D Extrusion Building Heights"
          >
            <Building2Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D Buildings</span>
          </button>

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
