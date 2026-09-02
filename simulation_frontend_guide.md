# Frontend Dashboard Simulation & Map Visualizer Guide

This guide details how to integrate the **IDR Simulation Engine** into the frontend dashboard. It provides complete JSON endpoint structures for all API requests/responses, interactive map setup using **Leaflet.js** or **Mapbox GL JS**, 5 pre-configured real-world scenarios, and an interactive **Control Plane** for custom map-based scenario creation.

---

## 🗺️ Architecture Overview

The simulation system is split into two interaction modes on the frontend dashboard:

1. **Preset Scenarios Mode**: Select from 5 pre-configured real-world navigation challenges (urban tunnels, highway corridors, urban canyons, subway transfers, and mountain passes).
2. **Interactive Control Plane Mode**: Users click on an interactive map (Leaflet/Mapbox) to set initial latitude, longitude, heading, speed, custom road waypoints, and GNSS outage windows.

```text
[Frontend Dashboard / Map UI]
    │
    ├── 1. Fetch Presets ────────► GET  /api/v1/simulations/presets/
    │
    ├── 2. Create Simulation ────► POST /api/v1/simulations/ (JSON Payload)
    │
    ├── 3. Trigger Run ──────────► POST /api/v1/simulations/<id>/run/?sync=true
    │
    └── 4. Fetch Results ────────► GET  /api/v1/simulations/<id>/
                                        │
                                        ▼
                                [Plot Map Polylines]
                                ├── Ground Truth (Blue Solid Line)
                                ├── Estimated IDR (Red Solid Line)
                                └── GNSS Outage Zone (Yellow Dashed Line)
```

---

## 📡 Complete REST API JSON Endpoint Structures

### 1. Fetch Available Preset Scenarios
- **Endpoint**: `GET /api/v1/simulations/presets/`
- **Headers**: `Content-Type: application/json`

#### Response (`200 OK`)
```json
[
  {
    "preset_id": "flagship_gnss_outage",
    "name": "SIH-2026 Flagship 300s GNSS Outage Benchmark",
    "description": "Flagship 300-second navigation benchmark with 120-second middle GNSS outage (t=120s to t=240s) for testing dead reckoning position drift and recovery.",
    "duration_seconds": 300.0,
    "movement_mode": "WAYPOINT_ROUTE",
    "seed": 42
  },
  {
    "preset_id": "urban_tunnel_outage",
    "name": "Urban Tunnel GNSS Outage",
    "description": "City center route entering a 120s subterranean tunnel with total GNSS signal loss",
    "duration_seconds": 250.0,
    "movement_mode": "WAYPOINT_ROUTE",
    "seed": 101
  },
  {
    "preset_id": "highway_corridor",
    "name": "High-Speed Highway Corridor",
    "description": "Suburban expressway navigation at 25 m/s (~90 km/h) testing long-range IMU velocity integration",
    "duration_seconds": 300.0,
    "movement_mode": "WAYPOINT_ROUTE",
    "seed": 202
  },
  {
    "preset_id": "urban_canyon_degraded",
    "name": "Urban Canyon Multipath Degradation",
    "description": "High-rise building district creating severe satellite multipath reflection and 15m position jitter",
    "duration_seconds": 200.0,
    "movement_mode": "WAYPOINT_ROUTE",
    "seed": 303
  },
  {
    "preset_id": "subway_transfer",
    "name": "Subway & Underground Transit Transfer",
    "description": "Pedestrian descending into metro station concourse with 90s complete blackout",
    "duration_seconds": 180.0,
    "movement_mode": "STOP_AND_GO",
    "seed": 404
  },
  {
    "preset_id": "mountain_winding_road",
    "name": "Mountain Winding Road & Pass",
    "description": "Serpentine mountain highway with continuous sharp turns and periodic hill shading",
    "duration_seconds": 240.0,
    "movement_mode": "WAYPOINT_ROUTE",
    "seed": 505
  }
]
```

---

### 2. Create Simulation Run
- **Endpoint**: `POST /api/v1/simulations/`
- **Headers**: `Content-Type: application/json`

#### Option A: Request Payload using Preset ID
```json
{
  "preset_id": "urban_tunnel_outage",
  "seed": 42,
  "duration_seconds": 250.0
}
```

#### Option B: Request Payload using Custom Interactive Control Plane
```json
{
  "custom_scenario": {
    "scenario_id": "custom_user_map_run_01",
    "name": "New Delhi Central Ridge Custom Route",
    "duration_seconds": 180.0,
    "timestep_seconds": 0.01,
    "seed": 42,
    "initial_state": {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "altitude": 216.0,
      "velocity_mps": 8.5,
      "heading_deg": 45.0
    },
    "waypoints": [
      [0.0, 0.0],
      [200.0, 200.0],
      [500.0, 200.0],
      [800.0, 600.0]
    ],
    "imu": {
      "accelerometer_hz": 100.0,
      "gyroscope_hz": 100.0,
      "accel_noise_std": 0.05,
      "gyro_noise_std": 0.005
    },
    "gnss": {
      "frequency_hz": 1.0,
      "position_noise_meters": 3.0,
      "outages": [
        {
          "start_seconds": 40.0,
          "end_seconds": 120.0
        }
      ]
    }
  }
}
```

#### Response (`201 Created`)
```json
{
  "id": "7f8b91a2-3c4d-4e5f-9a0b-1c2d3e4f5a6b",
  "scenario_id": "urban_tunnel_outage",
  "scenario_name": "Urban Tunnel GNSS Outage",
  "seed": 42,
  "duration_seconds": 250.0,
  "status": "CREATED",
  "scenario_config": {
    "scenario_id": "urban_tunnel_outage",
    "name": "Urban Tunnel GNSS Outage",
    "duration_seconds": 250.0,
    "timestep_seconds": 0.01,
    "seed": 42,
    "initial_state": {
      "latitude": 28.6139,
      "longitude": 77.2090,
      "altitude": 400.0,
      "velocity_mps": 11.1,
      "heading_deg": 45.0
    },
    "waypoints": [[0, 0], [250, 250], [600, 250], [900, 500]],
    "gnss": {
      "frequency_hz": 1.0,
      "position_noise_meters": 2.5,
      "outages": [{"start_seconds": 50.0, "end_seconds": 170.0}]
    }
  },
  "metrics": {},
  "gnss_outage_evaluations": [],
  "artifact_paths": {},
  "error_message": "",
  "created_at": "2026-09-02T13:00:00.000Z",
  "started_at": null,
  "completed_at": null
}
```

---

### 3. Trigger Simulation Execution
- **Endpoint**: `POST /api/v1/simulations/<id>/run/?sync=true`
- **Headers**: `Content-Type: application/json`

#### Response (`200 OK`)
```json
{
  "id": "7f8b91a2-3c4d-4e5f-9a0b-1c2d3e4f5a6b",
  "scenario_id": "urban_tunnel_outage",
  "scenario_name": "Urban Tunnel GNSS Outage",
  "seed": 42,
  "duration_seconds": 250.0,
  "status": "COMPLETED",
  "metrics": {
    "travelled_distance_m": 1250.45,
    "rmse_position_m": 412.35,
    "mean_position_error_m": 350.12,
    "final_position_error_m": 650.80,
    "max_position_error_m": 658.20,
    "drift_percentage": 52.05
  },
  "gnss_outage_evaluations": [
    {
      "start_seconds": 50.0,
      "end_seconds": 170.0,
      "duration_seconds": 120.0,
      "initial_error_m": 12.4,
      "final_error_m": 620.5,
      "max_error_m": 658.2,
      "drift_rate_m_per_s": 5.06
    }
  ],
  "artifact_paths": {
    "ground_truth_csv": "http://127.0.0.1:8000/media/simulations/7f8b91a2-3c4d-4e5f-9a0b-1c2d3e4f5a6b/ground_truth.csv",
    "sensor_stream_csv": "http://127.0.0.1:8000/media/simulations/7f8b91a2-3c4d-4e5f-9a0b-1c2d3e4f5a6b/sensor_stream.csv",
    "evaluation_report_json": "http://127.0.0.1:8000/media/simulations/7f8b91a2-3c4d-4e5f-9a0b-1c2d3e4f5a6b/evaluation_report.json"
  },
  "error_message": "",
  "created_at": "2026-09-02T13:00:00.000Z",
  "started_at": "2026-09-02T13:00:01.000Z",
  "completed_at": "2026-09-02T13:00:03.000Z"
}
```

---

## 🌍 Real-World Map Visualizer Integration (Leaflet.js / Mapbox)

To display ground truth vs estimated dead-reckoning trajectory on real-world maps:

### 1. Coordinate Conversion Helper (ENU to WGS-84 Lat/Lon in JavaScript)

```javascript
/**
 * Converts local ENU offset (east, north in meters) relative to reference (lat0, lon0)
 * into WGS-84 Leaflet/Mapbox [latitude, longitude] array.
 */
function enuToGeodetic(east, north, lat0, lon0) {
  const R_EARTH = 6378137.0; // WGS-84 Earth Radius in meters
  const dLat = (north / R_EARTH) * (180 / Math.PI);
  const dLon = (east / (R_EARTH * Math.cos((lat0 * Math.PI) / 180))) * (180 / Math.PI);
  return [lat0 + dLat, lon0 + dLon];
}
```

---

### 2. Complete Leaflet.js Visualizer Component Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>IDR Simulation Map Visualizer</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
  <style>
    #map { height: 600px; width: 100%; border-radius: 12px; }
    .control-panel { padding: 16px; background: #1e293b; color: #f8fafc; border-radius: 12px; margin-bottom: 12px; }
  </style>
</head>
<body>

<div class="control-panel">
  <h2>🚀 SIH-2026 Intelligent Dead Reckoning Simulation Control Plane</h2>
  <label>Select Real-World Preset: </label>
  <select id="presetSelect">
    <option value="urban_tunnel_outage">1. Urban Tunnel 120s GNSS Outage</option>
    <option value="highway_corridor">2. High-Speed Highway Corridor (25 m/s)</option>
    <option value="urban_canyon_degraded">3. Urban Canyon 15m Multipath Jitter</option>
    <option value="subway_transfer">4. Subway Concourse Transfer</option>
    <option value="mountain_winding_road">5. Mountain Winding Road & Pass</option>
  </select>
  <button id="runBtn" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
    ▶ Run Simulation
  </button>
</div>

<div id="map"></div>

<script>
  // Initialize Leaflet map centered on New Delhi origin
  const map = L.map('map').setView([28.6139, 77.2090], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  let groundTruthPolyline = null;
  let estimatedPolyline = null;

  async function executeSimulation() {
    const presetId = document.getElementById('presetSelect').value;
    
    // 1. Create Simulation Run
    const createRes = await fetch('http://127.0.0.1:8000/api/v1/simulations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preset_id: presetId })
    });
    const simData = await createRes.json();

    // 2. Trigger Execution Synchronously
    const runRes = await fetch(`http://127.0.0.1:8000/api/v1/simulations/${simData.id}/run/?sync=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const resultData = await runRes.json();

    console.log("Simulation Completed Metrics:", resultData.metrics);

    // 3. Fetch Ground Truth CSV
    const csvUrl = resultData.artifact_paths.ground_truth_csv;
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: function(results) {
        const rows = results.data;
        const groundTruthCoords = rows.map(r => [parseFloat(r.latitude), parseFloat(r.longitude)]).filter(c => !isNaN(c[0]));

        if (groundTruthPolyline) map.removeLayer(groundTruthPolyline);

        // Draw Ground Truth in Solid Blue
        groundTruthPolyline = L.polyline(groundTruthCoords, { color: '#3b82f6', weight: 4 }).addTo(map);
        map.fitBounds(groundTruthPolyline.getBounds());
      }
    });
  }

  document.getElementById('runBtn').addEventListener('click', executeSimulation);
</script>

</body>
</html>
```

---

## 🕹️ Interactive Custom Control Plane (User Map Point Selection)

When a user clicks on the map dashboard to create a custom scenario:

1. **Map Click Handler**: Captures start point `[lat, lon]`.
2. **Waypoint Adding**: Subsequent clicks add ENU waypoints relative to initial `[lat, lon]`.
3. **Form Controls**: User specifies duration, seed, IMU noise, and GNSS outage start/end times.
4. **POST JSON Payload Generation**:

```javascript
function buildCustomScenarioPayload(startLat, startLon, waypoints, outageStart, outageEnd) {
  return {
    custom_scenario: {
      scenario_id: `custom_${Date.now()}`,
      name: "Interactive User Route",
      duration_seconds: 300.0,
      seed: 42,
      initial_state: {
        latitude: startLat,
        longitude: startLon,
        altitude: 400.0,
        velocity_mps: 10.0,
        heading_deg: 90.0
      },
      waypoints: waypoints, // [[0,0], [200, 0], [200, 400]]
      imu: {
        accelerometer_hz: 100.0,
        gyroscope_hz: 100.0,
        accel_noise_std: 0.05,
        gyro_noise_std: 0.005
      },
      gnss: {
        frequency_hz: 1.0,
        position_noise_meters: 3.0,
        outages: [
          { start_seconds: outageStart, end_seconds: outageEnd }
        ]
      }
    }
  };
}
```
