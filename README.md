# Intelligent Dead Reckoning (IDR) — Web Companion & Telemetry Platform

<div align="center">

```
  ██████╗ ███████╗ ██████╗██╗  ██╗    ██████╗ ███████╗ ██████╗██╗  ██╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗ 
  ██╔══██╗██╔════╝██╔════╝██║ ██╔╝    ██╔══██╗██╔════╝██╔════╝██║ ██╔╝██╔═══██╗████╗  ██║██║████╗  ██║██╔════╝ 
  ██║  ██║█████╗  ██║     █████═╝     ██████╔╝█████╗  ██║     █████═╝ ██║   ██║██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
  ██║  ██║██╔══╝  ██║     ██╔═██╗     ██╔══██╗██╔══╝  ██║     ██╔═██╗ ██║   ██║██║╚██╗██║██║██║╚██╗██║██║   ██║
  ██████╔╝███████╗╚██████╗██║ ╚██╗    ██║  ██║███████╗╚██████╗██║ ╚██╗╚██████╔╝██║ ╚████║██║██║ ╚████║╚██████╔╝
  ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝ 
```

**"Seamless vehicle positioning when GNSS disappears — powered by smartphone sensor fusion & edge neural dynamics."**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-black?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-black?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-black?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-black?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)

</div>

---

## 🧭 Executive Summary

**Intelligent Dead Reckoning (IDR)** is a deep-tech navigation architecture designed to maintain unbroken, sub-meter vehicle positioning during GNSS outages (underground tunnels, multi-level flyovers, parking structures, and dense urban canyons) without requiring external wheel encoders or CAN-bus hardware. 

By leveraging the raw tri-axial accelerometer and gyroscope sensors already embedded inside standard smartphones, IDR runs an onboard **Extended Kalman Filter (EKF)** coupled with a quantized **Neural Inertial Velocity Estimator** and **Map-Constraint Graph Engine** to eliminate quadratic drift during satellite blackouts.

This repository hosts the **official product web companion, live fleet observability console, and interactive 3D navigation visualization platform**.

---

## ⚡ Key System Architecture

```
                               ┌────────────────────────────────────────┐
                               │       Smartphone Raw IMU Sensors       │
                               │  (Accelerometer + Gyroscope @ 200Hz)   │
                               └───────────────────┬────────────────────┘
                                                   │
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │       Strapdown Preprocessing          │
                               │  Gravity Nulling & Automatic Alignment │
                               └───────────────────┬────────────────────┘
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                         │                                                   │
                         ▼                                                   ▼
     ┌───────────────────────────────────────┐           ┌───────────────────────────────────────┐
     │      AI Neural Velocity Model         │           │    Strapdown Inertial Integration     │
     │ Quantized ONNX Model (200-800Hz Vibe) │           │     High-Rate Angular Rate & Yaw      │
     └───────────────────┬───────────────────┘           └───────────────────┬───────────────────┘
                         │                                                   │
                         └─────────────────────────┬─────────────────────────┘
                                                   │
                                                   ▼
                               ┌────────────────────────────────────────┐
                               │      Multi-State Extended Kalman       │
                               │      Filter (EKF Sensor Fusion)        │
                               └───────────────────┬────────────────────┘
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                         ▼                                                   ▼
      ┌─────────────────────────────────────┐             ┌─────────────────────────────────────┐
      │       GNSS Available Mode           │             │         GNSS Outage Mode            │
      │  Loose/Tight GNSS+INS Calibration   │             │   Dead Reckoning + Kinematic Slips  │
      └─────────────────────────────────────┘             └──────────────────┬──────────────────┘
                                                                             │
                                                                             ▼
                                                          ┌─────────────────────────────────────┐
                                                          │     Road-Vector Map Matching        │
                                                          │   Topology Bounding & Drift Lock    │
                                                          └─────────────────────────────────────┘
```

---

## ✨ Features & Platform Capabilities

### 1. 🛣️ Exact Road-Snapped 3D Navigation Engine
- **Coimbatore District Road Circuits (Tamil Nadu, India)**:
  - **Gandhipuram Loop**: Dr. Nanjappa Rd → Gandhipuram 2-Tier Flyover Under-Deck (*GNSS Outage begins*) → 100ft Road → Cross Cut Road.
  - **Avinashi Road Elevated Corridor (SH 52)**: Lakshmi Mills → Nava India → Peelamedu Elevated Deck Shadow (*GNSS Blackout*) → PSG Tech Underpass → Hope College → Airport Corridor.
  - **RS Puram DB Road**: DB Road South → Flower Market → RS Puram Head Post Office → Cowley Brown Rd → Thadagam Rd.
- **Strict Linear Snapping**: The locator puck is constrained strictly to the actual street centerline without block cut-throughs.
- **Watermark-Free Vector Tiles**: High-resolution OpenStreetMap tiles styled with high-contrast monochrome dark mode filters.

### 2. 📐 3D Perspective View Angles
- **3D Cockpit View (46° Driving Angle)**: Tilted in-cabin perspective with horizon sky atmospheric gradient overlay and dynamic heading rotation.
- **3D Isometric View (32° Angle)**: Elevated architectural vantage showing multi-tier flyover levels and district road networks.
- **2D Top-Down View**: Flat 90° planar orthographic map view.

### 3. 🏢 3D Building Extrusions
- Procedurally generated and vector-extruded 3D building rooftops (16m to 48m heights), vertical walls, and isometric ground shadows flanking road corridors.
- Instant toggle button (`3D Buildings`) in the map header.

### 4. 🏥 Hospital-Grade High-Frequency Telemetry Stream (`MLEngineSection`)
- **Medical ECG / Patient Monitor Display**: Continuous vertical phosphor sweep scanner line sweeping left-to-right with real-time phosphor decay.
- **Ultra-Dense Ring Buffer (1,200 Datapoints)**: 200 Hz, 400 Hz, or 800 Hz high-frequency multi-harmonic engine vibrations and road transient impulses.
- **3-Channel Oscilloscope Reticle**:
  - `CH1`: Raw Tri-Axial Accelerometer ($\pm 2.0g$).
  - `CH2`: Gyroscope Pitch/Yaw Rate ($\text{deg/s}$).
  - `CH3`: AI Neural Filtered Forward Velocity ($v_{\text{ai}}$).
- **ICU Digital Telemetry HUD**: Live Peak Noise ($\pm 2.14g$), RMS Noise, AI Signal-to-Noise Ratio ($38.6\text{ dB}$), and Latency ($3.6\text{ ms}$).

### 5. 📱 Device-Aware Dual Installation Pipeline
- **Automatic Client Detection (`detectDevice()`)**:
  - **Android Mobile**: Renders direct one-tap APK installation with build version details (`v1.4.2 Latest Stable`).
  - **iOS Mobile**: Explains Android hardware sensor HAL requirements and provides documentation/demo viewer.
  - **Desktop**: Displays high-contrast scannable QR code, Email transfer input, SMS link dispatch, and release archive table.

### 6. 🎨 Pure Deep-Tech Monochrome Design System
- Minimalist aerospace/laboratory visual identity (Pure Black `#000000` & Crisp White `#FFFFFF`).
- Glassmorphism panels, specular top edge highlights, and fully responsive multi-breakpoint layouts.
- Movable full-width edge-to-edge 3D ribbon on desktop, automatically disabled on mobile.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Core Framework** | React 18.3 + TypeScript 5.7 | Type-safe reactive component tree |
| **Build & Bundler** | Vite 6.1 | Ultra-fast HMR and optimized production bundling |
| **Styling & Theme** | Tailwind CSS 3.4 + Custom CSS | Strict monochrome tokens with dark/light mode provider |
| **Mapping Engines** | Leaflet 1.9 + Mapbox GL JS | Dual-engine vector map rendering with 3D extrusions |
| **Visualization** | HTML5 Canvas 2D / WebGL | 200Hz-800Hz hospital-grade medical oscilloscope |
| **Iconography** | Handcrafted Inline SVG Icons | Zero external icon library overhead, maximum performance |

---

## 📂 Project Directory Structure

```
Deck-Reckoning-web/
├── public/                     # Static public assets
├── src/
│   ├── components/             # Modular UI components
│   │   ├── Icons.tsx           # Handcrafted SVG icon library (Zero external icon bloat)
│   │   ├── Navbar.tsx          # Sticky responsive header with theme switcher & mobile drawer
│   │   ├── Hero.tsx            # Hero presentation with deep-tech value proposition
│   │   ├── NavigationVisualization.tsx # 3D Mapbox/Leaflet Coimbatore navigation engine
│   │   ├── ThreeDimensionalBackground.tsx # Desktop edge-to-edge movable 3D monochrome ribbon
│   │   ├── ProblemSection.tsx  # Environmental outage breakdowns (Tunnels, Urban Canyons)
│   │   ├── ArchitectureFlow.tsx# Multi-stage sensor fusion pipeline architecture diagram
│   │   ├── SensorEngine.tsx    # Smartphone sensor HAL and zero-external-hardware chassis
│   │   ├── MLEngineSection.tsx # Hospital-grade 200Hz-800Hz ECG sensor stream & waveform studio
│   │   ├── GNSSTransition.tsx  # Real-time GNSS outage timeline & covariance convergence
│   │   ├── MapMatching.tsx     # Vector graph snapping & non-holonomic kinematic bounding
│   │   ├── PerformanceMetrics.tsx # Deep-tech verified benchmark metrics & latency statistics
│   │   ├── MonitoringDashboard.tsx # Fleet observability suite & active session manager
│   │   ├── NavigationSession.tsx   # Vehicle attitude telemetry & live sensor oscilloscope
│   │   ├── FinalCTA.tsx        # Device-adaptive conversion CTA
│   │   ├── Footer.tsx          # System links, version metadata, and legal attribution
│   │   └── InstallSection/     # Device-aware installation module
│   │       ├── InstallSection.tsx          # Root dispatcher
│   │       ├── DesktopInstall.tsx          # QR Code + Email/SMS dispatch + release table
│   │       ├── MobileInstall.tsx           # Android one-tap direct APK download
│   │       └── UnsupportedMobileInstall.tsx # iOS compatibility guide
│   ├── lib/
│   │   ├── deviceDetection.ts  # Hardware & browser environment detection
│   │   ├── telemetrySimulation.ts # Real-time mathematical simulation models & mock sessions
│   │   ├── theme.tsx           # Dark/Light mode context provider
│   │   └── types.ts            # Complete TypeScript interface definitions
│   ├── App.tsx                 # Root application composition
│   ├── index.css               # Global CSS design tokens, glassmorphism & dark map filters
│   └── main.tsx                # Application bootstrap entry point
├── .env.example                # Sample environment variable template
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # Strict TypeScript compiler options
├── tailwind.config.js          # Tailwind CSS theme configuration
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** / **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Nithish-1622/Dead-reckoning-web.git
   cd Dead-reckoning-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   ```bash
   cp .env.example .env
   ```
   *(Note: The platform is fully functional out of the box with zero required API keys using the built-in OpenStreetMap vector engine).*

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at:
   - **Localhost**: `http://localhost:3000/`
   - **Network / Mobile Testing**: `http://<your-lan-ip>:3000/`

---

## 🧪 Production Build & Verification

To compile the production bundle:

```bash
npm run build
```

To preview the built production artifacts:

```bash
npm run preview
```

---

## 📊 Telemetry Data Models

```typescript
export interface NavigationSession {
  id: string;
  deviceId: string;
  deviceModel: string;
  status: 'GNSS LOCK' | 'DEAD RECKONING ACTIVE' | 'DEGRADED';
  speedKmh: number;
  headingDeg: number;
  position: [number, number];
  positionErrorMeters: number;
  gnssStatus: 'LOCKED' | 'DEGRADING' | 'LOST' | 'RECOVERING';
  drConfidencePct: number;
  batteryPct: number;
  timestamp: string;
}
```

---

## 📄 License & Attribution

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed by the **Intelligent Dead Reckoning (IDR) Engineering Team**.
