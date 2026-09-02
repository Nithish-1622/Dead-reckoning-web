# SIH-2026 IDR Main Backend: Frontend Integration & API Implementation Guide

This document provides a complete guide for integrating all **GET** and **POST** endpoints of the Intelligent Dead Reckoning (IDR) Backend into your existing frontend / landing page.

---

## 🌐 Global API Configuration & Development Setup

### Base URL
```javascript
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
```

### Authentication Header Setup
When `DEV_MODE=True` is enabled in your backend `.env`, authentication headers are optional (requests are automatically authenticated as `dev_admin`). For production or non-dev environments, include the Bearer JWT token in the `Authorization` header:

```javascript
// Generic API fetch helper function
async function apiRequest(endpoint, method = "GET", data = null) {
  const token = localStorage.getItem("jwt_access_token");
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP Error ${response.status}`);
  }
  return response.json();
}
```

---

## 🔐 1. Authentication Endpoints (`/api/v1/auth/`)

### 1.1 `POST /api/v1/auth/register/` (User Registration)
* **Description**: Registers a new system user (ADMIN, ENGINEER, ANALYST).
* **Request JSON Structure**:
```json
{
  "username": "engineer_alex",
  "email": "alex@idr.io",
  "password": "StrongPassword123!",
  "role": "ENGINEER"
}
```
* **Response JSON Structure (201 Created)**:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "username": "engineer_alex",
  "email": "alex@idr.io",
  "role": "ENGINEER",
  "created_at": "2026-09-02T01:00:00Z"
}
```

---

### 1.2 `POST /api/v1/auth/token/` (JWT Login)
* **Description**: Authenticates user credentials and returns JWT Access & Refresh tokens.
* **Request JSON Structure**:
```json
{
  "username": "engineer_alex",
  "password": "StrongPassword123!"
}
```
* **Response JSON Structure (200 OK)**:
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.3 `POST /api/v1/auth/token/refresh/` (JWT Token Refresh)
* **Description**: Obtains a fresh access token using a valid refresh token.
* **Request JSON Structure**:
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
* **Response JSON Structure (200 OK)**:
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.4 `GET /api/v1/auth/me/` (Get Current User Profile)
* **Description**: Retrieves the profile details of the currently authenticated user.
* **Request Headers**: `Authorization: Bearer <access_token>`
* **Response JSON Structure (200 OK)**:
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "username": "engineer_alex",
  "email": "alex@idr.io",
  "role": "ENGINEER",
  "is_active": true
}
```

---

## 📱 2. Edge Device Management (`/api/v1/devices/`)

### 2.1 `GET /api/v1/devices/` (List Edge Devices)
* **Description**: Fetches all registered mobile edge navigation units.
* **Response JSON Structure (200 OK)**:
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "d1e2f3a4-b5c6-7890-1234-56789abcdef0",
      "hardware_id": "HW-EDGE-100284",
      "name": "NavUnit-North-Alpha",
      "device_type": "Mobile Edge Device",
      "firmware_version": "v1.4.2",
      "status": "ONLINE",
      "last_heartbeat": "2026-09-02T01:05:00Z"
    },
    {
      "id": "f8e7d6c5-b4a3-2109-8765-43210fedcba9",
      "hardware_id": "HW-EDGE-100285",
      "name": "NavUnit-South-Beta",
      "device_type": "Mobile Edge Device",
      "firmware_version": "v1.4.2",
      "status": "OFFLINE",
      "last_heartbeat": "2026-09-01T18:30:00Z"
    }
  ]
}
```

---

### 2.2 `POST /api/v1/devices/register/` (Register Device)
* **Description**: Registers a new hardware edge device in the system.
* **Request JSON Structure**:
```json
{
  "hardware_id": "HW-EDGE-100286",
  "name": "NavUnit-Tunnel-Gamma",
  "device_type": "Mobile Edge Device",
  "firmware_version": "v1.5.0"
}
```
* **Response JSON Structure (201 Created)**:
```json
{
  "id": "e9d8c7b6-a5f4-3210-9876-54321abcdef1",
  "hardware_id": "HW-EDGE-100286",
  "name": "NavUnit-Tunnel-Gamma",
  "device_type": "Mobile Edge Device",
  "firmware_version": "v1.5.0",
  "status": "OFFLINE",
  "api_key": "idr_dev_a1b2c3d4e5f67890...",
  "registered_at": "2026-09-02T01:10:00Z"
}
```

---

### 2.3 `GET /api/v1/devices/<id>/` (Device Detail)
* **Description**: Retrieves single device health and metadata.
* **Response JSON Structure (200 OK)**:
```json
{
  "id": "d1e2f3a4-b5c6-7890-1234-56789abcdef0",
  "hardware_id": "HW-EDGE-100284",
  "name": "NavUnit-North-Alpha",
  "device_type": "Mobile Edge Device",
  "firmware_version": "v1.4.2",
  "status": "ONLINE",
  "last_heartbeat": "2026-09-02T01:05:00Z",
  "registered_at": "2026-09-01T10:00:00Z"
}
```

---

### 2.4 `POST /api/v1/devices/<id>/heartbeat/` (Send Device Heartbeat)
* **Description**: Endpoint hit by edge units to report status and metrics.
* **Request JSON Structure**:
```json
{
  "battery_level": 88.5,
  "cpu_usage_pct": 34.2,
  "memory_usage_pct": 45.0,
  "status": "ONLINE"
}
```
* **Response JSON Structure (200 OK)**:
```json
{
  "status": "HEARTBEAT_ACKNOWLEDGED",
  "timestamp": "2026-09-02T01:05:00Z"
}
```

---

## 📊 3. Sensor Datasets (`/api/v1/datasets/`)

### 3.1 `GET /api/v1/datasets/` (List Datasets)
* **Description**: Lists all recorded IMU / GNSS navigation dataset packages.
* **Response JSON Structure (200 OK)**:
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
      "name": "imu_gnss_tunnel_run_01",
      "description": "High-frequency IMU and GNSS raw sensor logs during tunnel navigation.",
      "dataset_type": "IMU_GNSS_LOG",
      "sensor_types": ["ACCELEROMETER", "GYROSCOPE", "GNSS"],
      "created_at": "2026-09-02T00:30:00Z"
    }
  ]
}
```

---

### 3.2 `GET /api/v1/datasets/<id>/` (Dataset Details & Versions)
* **Description**: Gets dataset metadata along with stored versions and checksums.
* **Response JSON Structure (200 OK)**:
```json
{
  "id": "c1d2e3f4-5678-90ab-cdef-1234567890ab",
  "name": "imu_gnss_tunnel_run_01",
  "description": "High-frequency IMU and GNSS raw sensor logs during tunnel navigation.",
  "dataset_type": "IMU_GNSS_LOG",
  "versions": [
    {
      "version": "1.0.0",
      "checksum_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "file_size_bytes": 1048576,
      "created_at": "2026-09-02T00:30:00Z"
    }
  ]
}
```

---

## 🤖 4. ML Navigation Models (`/api/v1/models/`)

### 4.1 `GET /api/v1/models/` (List ML Models)
* **Description**: Returns all registered dead-reckoning ML model versions.
* **Response JSON Structure (200 OK)**:
```json
{
  "count": 1,
  "results": [
    {
      "id": "m1f2e3d4-5678-90ab-cdef-1234567890ab",
      "name": "idr_dead_reckoning_lstm",
      "architecture": "LSTM-ResNet-Hybrid",
      "version": "v2.1.0",
      "status": "APPROVED",
      "is_active": true,
      "mae_position_m": 0.142,
      "created_at": "2026-09-01T20:00:00Z"
    }
  ]
}
```

---

### 4.2 `GET /api/v1/models/latest/` (Get Latest Active Model for Edge)
* **Description**: Retrieves the currently active model version for deployment.
* **Response JSON Structure (200 OK)**:
```json
{
  "id": "m1f2e3d4-5678-90ab-cdef-1234567890ab",
  "name": "idr_dead_reckoning_lstm",
  "version": "v2.1.0",
  "architecture": "LSTM-ResNet-Hybrid",
  "download_url": "/media/models/idr_dead_reckoning_lstm_v2.1.0.tflite",
  "checksum_sha256": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
}
```

---

### 4.3 `POST /api/v1/models/<version_id>/approve/` (Approve Model)
* **Description**: Approves a model version for production deployment.
* **Request JSON Structure**: `{}`
* **Response JSON Structure (200 OK)**:
```json
{
  "id": "m1f2e3d4-5678-90ab-cdef-1234567890ab",
  "status": "APPROVED",
  "message": "Model version approved for deployment"
}
```

---

### 4.4 `POST /api/v1/models/<version_id>/publish/` (Publish Model)
* **Description**: Sets the specified model as the active version.
* **Request JSON Structure**: `{}`
* **Response JSON Structure (200 OK)**:
```json
{
  "id": "m1f2e3d4-5678-90ab-cdef-1234567890ab",
  "status": "PUBLISHED",
  "is_active": true,
  "message": "Model version published as active edge model"
}
```

---

## 🗺️ 5. Offline Map Packages (`/api/v1/maps/`)

### 5.1 `GET /api/v1/maps/` (List Offline Maps)
* **Description**: Lists offline `.mbtiles` packages with vector tile metadata.
* **Response JSON Structure (200 OK)**:
```json
{
  "count": 1,
  "results": [
    {
      "id": "map12345-6789-abcd-ef01-234567890abc",
      "name": "Sector-North-Grid-7",
      "bounding_box_geojson": {
        "type": "Polygon",
        "coordinates": [[[77.10, 28.50], [77.30, 28.50], [77.30, 28.70], [77.10, 28.70], [77.10, 28.50]]]
      },
      "file_size_bytes": 52428800,
      "zoom_levels": [10, 11, 12, 13, 14, 15, 16],
      "created_at": "2026-09-01T15:00:00Z"
    }
  ]
}
```

---

### 5.2 `POST /api/v1/maps/lookup/` (Spatial Map Package Lookup)
* **Description**: Finds matching offline map package covering coordinates.
* **Request JSON Structure**:
```json
{
  "latitude": 28.55,
  "longitude": 77.20,
  "zoom_level": 14
}
```
* **Response JSON Structure (200 OK)**:
```json
{
  "matching_package": {
    "id": "map12345-6789-abcd-ef01-234567890abc",
    "name": "Sector-North-Grid-7",
    "download_url": "/media/maps/sector_north_grid_7.mbtiles",
    "checksum_sha256": "9a01b2c3d4e5f67890..."
  }
}
```

---

## 📡 6. Telemetry & Sensor Ingestion (`/api/v1/telemetry/`)

### 6.1 `POST /api/v1/telemetry/batch/` (Batch Telemetry Ingest)
* **Description**: Ingests offline sensor reading batches from edge devices.
* **Request JSON Structure**:
```json
{
  "device_id": "d1e2f3a4-b5c6-7890-1234-56789abcdef0",
  "session_id": "sess-992011",
  "records": [
    {
      "timestamp": "2026-09-02T01:00:00.125Z",
      "ax": 0.012,
      "ay": -0.005,
      "az": 9.806,
      "gx": 0.001,
      "gy": 0.002,
      "gz": -0.001,
      "estimated_lat": 28.5501,
      "estimated_lon": 77.2005
    }
  ]
}
```
* **Response JSON Structure (202 Accepted)**:
```json
{
  "status": "ACCEPTED",
  "records_ingested": 1,
  "session_id": "sess-992011"
}
```

---

### 6.2 `GET /api/v1/telemetry/sessions/` (List Telemetry Sessions)
* **Description**: Lists recorded telemetry sessions across all devices.
* **Response JSON Structure (200 OK)**:
```json
{
  "count": 1,
  "results": [
    {
      "session_id": "sess-992011",
      "device_id": "d1e2f3a4-b5c6-7890-1234-56789abcdef0",
      "device_name": "NavUnit-North-Alpha",
      "record_count": 1500,
      "start_time": "2026-09-02T01:00:00Z",
      "end_time": "2026-09-02T01:25:00Z"
    }
  ]
}
```

---

## ⚙️ 7. System Configuration & Sync (`/api/v1/config/`)

### 7.1 `GET /api/v1/config/` (List Config Profiles)
* **Response JSON Structure (200 OK)**:
```json
{
  "count": 1,
  "results": [
    {
      "id": "cfg1122-3344-5566-7788-99aabbccddeef",
      "profile_name": "High-Precision-Tunnel-Profile",
      "sampling_rate_hz": 100,
      "kalman_filter_q_noise": 0.001,
      "kalman_filter_r_noise": 0.01,
      "is_default": true
    }
  ]
}
```

---

### 7.2 `POST /api/v1/config/sync/` (Device Config Sync Check)
* **Request JSON Structure**:
```json
{
  "device_id": "d1e2f3a4-b5c6-7890-1234-56789abcdef0",
  "current_config_version": "v1.0"
}
```
* **Response JSON Structure (200 OK)**:
```json
{
  "in_sync": true,
  "latest_config": {
    "profile_name": "High-Precision-Tunnel-Profile",
    "config_version": "v1.0",
    "sampling_rate_hz": 100
  }
}
```

---

## 🚀 8. OTA Updates (`/api/v1/ota/`)

### 8.1 `POST /api/v1/ota/check/` (Check OTA Updates)
* **Request JSON Structure**:
```json
{
  "hardware_id": "HW-EDGE-100284",
  "current_firmware": "v1.4.2",
  "current_model_version": "v2.0.0"
}
```
* **Response JSON Structure (200 OK)**:
```json
{
  "update_available": true,
  "target_firmware": "v1.5.0",
  "firmware_download_url": "/media/ota/firmware_v1.5.0.bin",
  "target_model_version": "v2.1.0",
  "model_download_url": "/media/models/idr_dead_reckoning_lstm_v2.1.0.tflite",
  "sha256_checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

---

## 📈 9. System Analytics (`/api/v1/analytics/`)

### 9.1 `GET /api/v1/analytics/summary/` (Dashboard Stats)
* **Response JSON Structure (200 OK)**:
```json
{
  "total_devices": 12,
  "online_devices": 9,
  "total_telemetry_records": 482910,
  "active_model_version": "v2.1.0",
  "avg_position_error_m": 0.14
}
```

---

### 9.2 `GET /api/v1/analytics/model-performance/` (Model Accuracy Analytics)
* **Response JSON Structure (200 OK)**:
```json
{
  "model_version": "v2.1.0",
  "mean_absolute_error_m": 0.142,
  "root_mean_squared_error_m": 0.185,
  "max_drift_rate_m_per_min": 0.045,
  "total_evaluation_hours": 128.5
}
```

---

## 🎨 10. Copy-Paste Landing Page Dashboard Integration Code

Add this script to your landing page or dashboard HTML to dynamically fetch and display live backend data:

```html
<!-- Live Analytics Dashboard Cards -->
<div id="analytics-dashboard" class="grid grid-cols-4 gap-4 p-6">
  <div class="card">
    <h3>Total Devices</h3>
    <p id="total-devices">Loading...</p>
  </div>
  <div class="card">
    <h3>Online Devices</h3>
    <p id="online-devices">Loading...</p>
  </div>
  <div class="card">
    <h3>Telemetry Records</h3>
    <p id="telemetry-records">Loading...</p>
  </div>
  <div class="card">
    <h3>Avg Position Error</h3>
    <p id="position-error">Loading...</p>
  </div>
</div>

<!-- Devices Table -->
<div class="p-6">
  <h2>Edge Navigation Units</h2>
  <table class="table-auto w-full">
    <thead>
      <tr>
        <th>Name</th>
        <th>Hardware ID</th>
        <th>Status</th>
        <th>Firmware</th>
      </tr>
    </thead>
    <tbody id="devices-list">
      <tr><td colspan="4">Loading devices...</td></tr>
    </tbody>
  </table>
</div>

<script>
  const API_BASE = "http://127.0.0.1:8000/api/v1";

  // 1. Load Summary Analytics into Landing Page
  async function loadSummaryStats() {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary/`);
      const data = await res.json();
      
      document.getElementById("total-devices").innerText = data.total_devices;
      document.getElementById("online-devices").innerText = data.online_devices;
      document.getElementById("telemetry-records").innerText = data.total_telemetry_records.toLocaleString();
      document.getElementById("position-error").innerText = `${data.avg_position_error_m} m`;
    } catch (err) {
      console.error("Failed to load analytics summary:", err);
    }
  }

  // 2. Load Edge Devices Table
  async function loadDevices() {
    try {
      const res = await fetch(`${API_BASE}/devices/`);
      const data = await res.json();
      const tbody = document.getElementById("devices-list");
      tbody.innerHTML = "";

      const devices = data.results || data;
      devices.forEach(device => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${device.name}</td>
          <td><code>${device.hardware_id}</code></td>
          <td><span class="badge ${device.status === 'ONLINE' ? 'bg-green' : 'bg-gray'}">${device.status}</span></td>
          <td>${device.firmware_version}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Failed to load devices:", err);
    }
  }

  // Initialize on landing page load
  document.addEventListener("DOMContentLoaded", () => {
    loadSummaryStats();
    loadDevices();
  });
</script>
```
