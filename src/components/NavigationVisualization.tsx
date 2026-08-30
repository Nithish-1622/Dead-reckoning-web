import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  PlayIcon, 
  PauseIcon, 
  RotateCcwIcon, 
  ShieldAlertIcon, 
  CompassIcon, 
  CrosshairIcon 
} from './Icons';
import { GNSSState, DRMode } from '../lib/types';
import { useTheme } from '../lib/theme';

interface NavigationVisualizationProps {
  onStatusChange?: (status: GNSSState) => void;
}

interface CityRoute {
  id: string;
  name: string;
  shortName: string;
  destination: string;
  center: [number, number];
  zoom: number;
  waypoints: {
    lat: number;
    lng: number;
    street: string;
    zone: 'open' | 'urban-canyon' | 'tunnel' | 'recovering';
    speedLimit: number;
    maneuver: string;
  }[];
}

const GOOGLE_MAPS_ROUTES: CityRoute[] = [
  {
    id: 'sf-downtown',
    name: 'San Francisco Broadway Tunnel',
    shortName: 'San Francisco',
    destination: 'Embarcadero via Broadway Tunnel',
    center: [37.7965, -122.4140],
    zoom: 16,
    waypoints: [
      { lat: 37.7930, lng: -122.4225, street: 'Van Ness Avenue', zone: 'open', speedLimit: 45, maneuver: 'Head North on Van Ness Ave' },
      { lat: 37.7960, lng: -122.4230, street: 'Van Ness / Broadway', zone: 'urban-canyon', speedLimit: 40, maneuver: 'In 120m, Turn Right onto Broadway' },
      { lat: 37.7966, lng: -122.4200, street: 'Broadway Street East', zone: 'urban-canyon', speedLimit: 45, maneuver: 'In 250m, Approach Broadway Tunnel' },
      { lat: 37.7970, lng: -122.4172, street: 'Broadway Tunnel West Portal', zone: 'tunnel', speedLimit: 55, maneuver: 'Enter Broadway Tunnel (Subterranean Outage)' },
      { lat: 37.7975, lng: -122.4140, street: 'Broadway Tunnel Arterial', zone: 'tunnel', speedLimit: 58, maneuver: 'Continue in Tunnel for 450m (INS Active)' },
      { lat: 37.7978, lng: -122.4105, street: 'Broadway Tunnel East Portal', zone: 'tunnel', speedLimit: 50, maneuver: 'Prepare to exit Tunnel in 100m' },
      { lat: 37.7980, lng: -122.4080, street: 'Columbus Avenue', zone: 'recovering', speedLimit: 42, maneuver: 'Turn slight right onto Columbus Ave' },
      { lat: 37.7995, lng: -122.4070, street: 'Columbus Ave / Washington Square', zone: 'open', speedLimit: 40, maneuver: 'Continue North on Columbus Ave' },
      { lat: 37.8020, lng: -122.4090, street: 'Powell Street', zone: 'open', speedLimit: 40, maneuver: 'Turn Left onto Powell St' },
      { lat: 37.7990, lng: -122.4150, street: 'Pacific Avenue', zone: 'urban-canyon', speedLimit: 42, maneuver: 'Continue on Pacific Ave toward Van Ness' },
      { lat: 37.7930, lng: -122.4225, street: 'Van Ness Avenue', zone: 'open', speedLimit: 45, maneuver: 'Arriving at Destination' }
    ]
  },
  {
    id: 'nyc-midtown',
    name: 'New York Park Ave Underpass',
    shortName: 'New York',
    destination: 'Midtown East via Park Ave Tunnel',
    center: [40.7525, -73.9772],
    zoom: 16,
    waypoints: [
      { lat: 40.7450, lng: -73.9830, street: 'Park Avenue South', zone: 'open', speedLimit: 45, maneuver: 'Head North on Park Ave South' },
      { lat: 40.7485, lng: -73.9805, street: 'Park Ave / E 34th St', zone: 'urban-canyon', speedLimit: 35, maneuver: 'Approaching High-Rise Canyon' },
      { lat: 40.7510, lng: -73.9785, street: 'Park Ave Underpass Portal', zone: 'tunnel', speedLimit: 50, maneuver: 'Enter Sub-surface Underpass (GNSS Lost)' },
      { lat: 40.7535, lng: -73.9765, street: 'Grand Central Viaduct Tunnel', zone: 'tunnel', speedLimit: 50, maneuver: 'Continue under Grand Central (200Hz INS)' },
      { lat: 40.7555, lng: -73.9750, street: 'Viaduct North Portal', zone: 'recovering', speedLimit: 40, maneuver: 'Exit Viaduct onto Upper Park Ave' },
      { lat: 40.7580, lng: -73.9730, street: 'Park Ave / E 48th St', zone: 'urban-canyon', speedLimit: 40, maneuver: 'Turn Left onto 48th St' },
      { lat: 40.7595, lng: -73.9770, street: 'Madison Avenue', zone: 'open', speedLimit: 45, maneuver: 'Head South on Madison Ave' },
      { lat: 40.7520, lng: -73.9830, street: '5th Avenue', zone: 'open', speedLimit: 40, maneuver: 'Continue on 5th Ave' },
      { lat: 40.7450, lng: -73.9830, street: 'Park Avenue South', zone: 'open', speedLimit: 45, maneuver: 'Arriving at Destination' }
    ]
  },
  {
    id: 'tokyo-shinjuku',
    name: 'Tokyo Shutoko Tunnel C2',
    shortName: 'Tokyo',
    destination: 'Shutoko Underground Route C2',
    center: [35.6905, 139.6995],
    zoom: 16,
    waypoints: [
      { lat: 35.6850, lng: 139.6910, street: 'Koshu Kaido Highway', zone: 'open', speedLimit: 60, maneuver: 'Head East on Koshu Kaido' },
      { lat: 35.6880, lng: 139.6940, street: 'Nishi-Shinjuku Skyscraper Zone', zone: 'urban-canyon', speedLimit: 45, maneuver: 'Approaching High-Rise Canyon' },
      { lat: 35.6900, lng: 139.6970, street: 'Shinjuku Underground Portal', zone: 'tunnel', speedLimit: 60, maneuver: 'Enter Shutoko Subterranean Expressway' },
      { lat: 35.6920, lng: 139.7010, street: 'Shutoko Tunnel Route C2', zone: 'tunnel', speedLimit: 70, maneuver: 'Tunnel Cruising (Dead Reckoning Active)' },
      { lat: 35.6940, lng: 139.7040, street: 'Kabukicho Sub-Surface', zone: 'tunnel', speedLimit: 65, maneuver: 'Keep right toward East Portal' },
      { lat: 35.6960, lng: 139.7070, street: 'Shinjuku East Portal', zone: 'recovering', speedLimit: 50, maneuver: 'Exit Tunnel onto Meiji Dori' },
      { lat: 35.6930, lng: 139.7090, street: 'Meiji Dori Avenue', zone: 'open', speedLimit: 50, maneuver: 'Continue South on Meiji Dori' },
      { lat: 35.6870, lng: 139.7030, street: 'Shinjuku Gyoen Expressway', zone: 'open', speedLimit: 55, maneuver: 'Return via Expressway' },
      { lat: 35.6850, lng: 139.6910, street: 'Koshu Kaido Highway', zone: 'open', speedLimit: 60, maneuver: 'Arriving at Destination' }
    ]
  }
];

export const NavigationVisualization: React.FC<NavigationVisualizationProps> = ({ onStatusChange }) => {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const carMarkerRef = useRef<L.Marker | null>(null);
  const liveTrailRef = useRef<L.Polyline | null>(null);
  const covarianceCircleRef = useRef<L.Circle | null>(null);

  const [activeCityId, setActiveCityId] = useState<string>('sf-downtown');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.08);
  const [simSpeed, setSimSpeed] = useState(1);
  const [manualOutage, setManualOutage] = useState<boolean | null>(null);
  const [cameraFollow, setCameraFollow] = useState(true);
  const [currentStreet, setCurrentStreet] = useState('Van Ness Avenue');
  const [currentManeuver, setCurrentManeuver] = useState('Head North on Van Ness Ave');
  const [speedLimit, setSpeedLimit] = useState(45);

  const [telemetry, setTelemetry] = useState({
    gnssStatus: 'LOCKED' as GNSSState,
    drMode: 'STANDBY' as DRMode,
    speedKmh: 46.2,
    headingDeg: 358.4,
    positionErrorM: 0.7,
    imuRateHz: 200,
    aiConfidencePct: 99.4,
    satellites: 28,
    covariance: 0.32,
    lat: 37.7945,
    lng: -122.4228
  });

  const currentCity = GOOGLE_MAPS_ROUTES.find((c) => c.id === activeCityId) || GOOGLE_MAPS_ROUTES[0];

  // Spline interpolation between real-world street waypoints
  const getInterpolatedPosition = (t: number) => {
    const wps = currentCity.waypoints;
    const count = wps.length;
    const scaledT = t * (count - 1);
    const index = Math.min(Math.floor(scaledT), count - 2);
    const localT = scaledT - index;

    const p0 = wps[Math.max(0, index - 1)];
    const p1 = wps[index];
    const p2 = wps[index + 1];
    const p3 = wps[Math.min(count - 1, index + 2)];

    const t2 = localT * localT;
    const t3 = t2 * localT;

    const lat = 0.5 * (
      (2 * p1.lat) +
      (-p0.lat + p2.lat) * localT +
      (2 * p0.lat - 5 * p1.lat + 4 * p2.lat - p3.lat) * t2 +
      (-p0.lat + 3 * p1.lat - 3 * p2.lat + p3.lat) * t3
    );

    const lng = 0.5 * (
      (2 * p1.lng) +
      (-p0.lng + p2.lng) * localT +
      (2 * p0.lng - 5 * p1.lng + 4 * p2.lng - p3.lng) * t2 +
      (-p0.lng + 3 * p1.lng - 3 * p2.lng + p3.lng) * t3
    );

    const dLat = p2.lat - p1.lat;
    const dLng = p2.lng - p1.lng;
    const heading = ((Math.atan2(dLng, dLat) * (180 / Math.PI)) + 360) % 360;

    return { lat, lng, heading, currentWp: p1 };
  };

  // Initialize Real-Time Leaflet Map in Monochrome High-Contrast
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentCity.center,
        zoom: currentCity.zoom,
        zoomControl: false,
        attributionControl: false
      });

      const isDark = theme === 'dark';
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Real-time Live Trajectory Trail (High-Contrast White / Black)
      const liveTrail = L.polyline([], {
        color: isDark ? '#FFFFFF' : '#000000',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      liveTrailRef.current = liveTrail;

      // Covariance Uncertainty Error Halo
      const covCircle = L.circle(currentCity.center, {
        radius: 10,
        color: isDark ? '#FFFFFF' : '#000000',
        weight: 1.5,
        dashArray: '3, 3',
        fillColor: isDark ? '#FFFFFF' : '#000000',
        fillOpacity: 0.12
      }).addTo(map);
      covarianceCircleRef.current = covCircle;

      // High-Contrast Monochrome Navigation Arrow Puck Marker
      const carIcon = L.divIcon({
        className: 'gmaps-nav-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
            <div id="gmaps-beam" style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: ${isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)'}; filter: blur(4px);"></div>
            <div style="position: relative; width: 24px; height: 24px; border-radius: 50%; background: ${isDark ? '#FFFFFF' : '#000000'}; border: 2.5px solid ${isDark ? '#000000' : '#FFFFFF'}; box-shadow: 0 3px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
              <svg id="gmaps-arrow" width="12" height="12" viewBox="0 0 24 24" style="transform-origin: center; transform: rotate(0deg); transition: transform 0.08s linear;">
                <polygon points="12 2 22 20 12 16 2 20 12 2" fill="${isDark ? '#000000' : '#FFFFFF'}" />
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const carMarker = L.marker(currentCity.center, { icon: carIcon }).addTo(map);
      carMarkerRef.current = carMarker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeCityId]);

  // Update Tile Theme when user toggles Dark/Light
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const isDark = theme === 'dark';
    const newUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    tileLayerRef.current.setUrl(newUrl);

    if (liveTrailRef.current) {
      liveTrailRef.current.setStyle({
        color: isDark ? '#FFFFFF' : '#000000'
      });
    }
  }, [theme]);

  // Real-time animation driver
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setProgress((prev) => {
          const next = prev + (0.022 * simSpeed * delta);
          return next >= 1 ? 0 : next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simSpeed]);

  // Real-time Position & Navigation calculations
  useEffect(() => {
    const pos = getInterpolatedPosition(progress);
    const isTunnel = pos.currentWp.zone === 'tunnel' || (progress >= 0.32 && progress <= 0.68);
    const isDark = theme === 'dark';

    let gnss: GNSSState = 'LOCKED';
    let dr: DRMode = 'STANDBY';
    let posErr = 0.7;
    let sats = 28;
    let conf = 99.4;
    let cov = 0.32;
    let speed = pos.currentWp.speedLimit + Math.sin(progress * 25) * 3.5;

    if (manualOutage === true || (manualOutage === null && isTunnel)) {
      gnss = 'LOST';
      dr = 'ENGAGED';
      const fraction = manualOutage === true ? 0.6 : (progress - 0.32) / 0.36;
      posErr = 1.1 + fraction * 1.6;
      sats = 0;
      conf = 98.2 - fraction * 2.0;
      cov = 1.2 + fraction * 1.5;
      speed = Math.max(40, speed - 4);
    } else if (manualOutage === null && pos.currentWp.zone === 'urban-canyon') {
      gnss = 'DEGRADING';
      dr = 'STANDBY';
      posErr = 1.3;
      sats = 6;
      conf = 95.8;
      cov = 0.68;
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

    // Update Marker position & arrow heading
    if (carMarkerRef.current) {
      carMarkerRef.current.setLatLng([pos.lat, pos.lng]);
      const arrowElem = document.getElementById('gmaps-arrow');
      const beamElem = document.getElementById('gmaps-beam');
      if (arrowElem) {
        arrowElem.style.transform = `rotate(${pos.heading}deg)`;
      }
      if (beamElem) {
        beamElem.style.backgroundColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)';
      }
    }

    // Dynamic Live History Trail
    if (liveTrailRef.current) {
      const trailPoints: [number, number][] = [];
      const step = 0.006;
      for (let t = Math.max(0, progress - 0.20); t <= progress; t += step) {
        const pt = getInterpolatedPosition(t);
        trailPoints.push([pt.lat, pt.lng]);
      }
      trailPoints.push([pos.lat, pos.lng]);
      liveTrailRef.current.setLatLngs(trailPoints);
      liveTrailRef.current.setStyle({
        color: isDark ? '#FFFFFF' : '#000000',
        dashArray: isTunnel ? '6, 6' : undefined
      });
    }

    // Update Uncertainty Error Halo
    if (covarianceCircleRef.current) {
      covarianceCircleRef.current.setLatLng([pos.lat, pos.lng]);
      const radiusM = isTunnel ? 22 + (posErr * 8) : 10;
      covarianceCircleRef.current.setRadius(radiusM);
      covarianceCircleRef.current.setStyle({
        color: isDark ? '#FFFFFF' : '#000000',
        fillColor: isDark ? '#FFFFFF' : '#000000'
      });
    }

    // Auto-center camera on vehicle
    if (cameraFollow && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([pos.lat, pos.lng], { animate: true, duration: 0.1 });
    }
  }, [progress, manualOutage, cameraFollow, onStatusChange, theme]);

  const handleCityChange = (cityId: string) => {
    setActiveCityId(cityId);
    setProgress(0.08);
    setManualOutage(null);
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-neutral-100 dark:bg-[#0D0D11] border border-neutral-300 dark:border-neutral-800 shadow-xl overflow-hidden transition-all">
      
      {/* Navigation Header Bar (Clean Stack on Mobile) */}
      <div className="p-3.5 sm:p-5 bg-white dark:bg-[#121216] border-b border-neutral-300 dark:border-neutral-800 relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Turn-by-Turn Maneuver Pill */}
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

        {/* Right: City Selector & Status Badge */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800">
          
          {/* City Selector */}
          <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-xl bg-neutral-100 dark:bg-black/50 border border-neutral-300 dark:border-neutral-800 text-[11px] sm:text-xs font-mono">
            {GOOGLE_MAPS_ROUTES.map((city) => (
              <button
                key={city.id}
                onClick={() => handleCityChange(city.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all font-semibold ${
                  activeCityId === city.id
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {city.shortName}
              </button>
            ))}
          </div>

          {/* GNSS Status Badge */}
          <span
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase transition-all shrink-0 ${
              telemetry.gnssStatus === 'LOCKED'
                ? 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white border border-neutral-400 dark:border-neutral-600'
                : telemetry.gnssStatus === 'LOST'
                ? 'bg-black text-white dark:bg-white dark:text-black border border-neutral-700 dark:border-neutral-300 animate-pulse'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700'
            }`}
          >
            {telemetry.gnssStatus === 'LOST' ? 'DR ACTIVE' : `GNSS ${telemetry.gnssStatus}`}
          </span>
        </div>
      </div>

      {/* Real-time Leaflet Map Viewport */}
      <div className="relative w-full h-[320px] sm:h-[450px]">
        
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Speedometer Gauge (Bottom Left) */}
        <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#0D0D12]/95 border border-neutral-300 dark:border-neutral-700 text-center shadow-lg z-20 min-w-[70px] sm:min-w-[90px]">
          <div className="text-[8px] sm:text-[10px] font-mono text-neutral-500 uppercase font-bold">SPEED</div>
          <div className="text-lg sm:text-2xl font-mono font-extrabold text-neutral-950 dark:text-white leading-tight">
            {telemetry.speedKmh}
          </div>
          <div className="text-[8px] sm:text-[10px] font-mono text-neutral-500 font-bold">KM/H</div>
        </div>

        {/* High-Contrast Telemetry Card (Top Left - Compact on Mobile) */}
        <div className="absolute top-3 left-3 sm:top-5 sm:left-5 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#0D0D12]/95 border border-neutral-300 dark:border-neutral-700 text-[10px] sm:text-[11px] font-mono space-y-1.5 sm:space-y-3 shadow-lg max-w-[160px] sm:max-w-[240px] z-20">
          <div className="flex items-center justify-between pb-1 sm:pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-neutral-500 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">Telemetry</span>
            <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700">
              200Hz
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

        {/* Live Status Legend (Hidden on very small screens to avoid clutter) */}
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-[#0D0D12]/95 border border-neutral-300 dark:border-neutral-700 text-[9px] sm:text-[10px] font-mono space-y-1 hidden sm:block shadow-lg z-20">
          <div className="text-neutral-500 text-[8px] uppercase tracking-wider font-semibold">Live Mode</div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-black dark:bg-white"></span>
            <span className="text-neutral-800 dark:text-neutral-200">GPS Locked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-neutral-400 border border-dashed border-neutral-600"></span>
            <span className="text-neutral-800 dark:text-neutral-200">Dead Reckoning</span>
          </div>
        </div>
      </div>

      {/* Navigation Control Dock (Structured Mobile Layout) */}
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
            <span className="hidden xs:inline">{cameraFollow ? 'Follow' : 'Free Pan'}</span>
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
              step="0.002"
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
