// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — k6 Load Test Suite
// Run: k6 run load-tests/api-load.js
// Profiles: k6 run --env PROFILE=smoke|load|stress|spike load-tests/api-load.js
// ══════════════════════════════════════════════════════════════

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Custom Metrics ──────────────────────────────────────────
const errorRate = new Rate('errors');
const vehicleLatency = new Trend('vehicle_api_latency', true);
const driverLatency = new Trend('driver_api_latency', true);
const tankerLatency = new Trend('tanker_api_latency', true);
const healthLatency = new Trend('health_api_latency', true);
const authLatency = new Trend('auth_api_latency', true);
const totalRequests = new Counter('total_requests');

// ── Configuration ───────────────────────────────────────────
const BASE_URL = __ENV.API_URL || 'http://localhost:3000';
const API = `${BASE_URL}/api/v1`;

const PROFILES = {
  smoke: {
    stages: [
      { duration: '30s', target: 5 },
      { duration: '1m', target: 5 },
      { duration: '30s', target: 0 },
    ],
  },
  load: {
    stages: [
      { duration: '2m', target: 50 },   // Ramp up
      { duration: '5m', target: 50 },   // Steady state
      { duration: '2m', target: 100 },  // Peak
      { duration: '3m', target: 100 },  // Sustained peak
      { duration: '2m', target: 0 },    // Ramp down
    ],
  },
  stress: {
    stages: [
      { duration: '2m', target: 100 },
      { duration: '5m', target: 200 },
      { duration: '5m', target: 300 },
      { duration: '2m', target: 400 },
      { duration: '5m', target: 400 },  // Breaking point
      { duration: '3m', target: 0 },
    ],
  },
  spike: {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '10s', target: 500 },  // Spike!
      { duration: '1m', target: 500 },
      { duration: '30s', target: 10 },
      { duration: '1m', target: 0 },
    ],
  },
};

const profile = __ENV.PROFILE || 'smoke';
export const options = {
  ...PROFILES[profile],
  thresholds: {
    http_req_failed: ['rate<0.05'],       // <5% errors
    http_req_duration: ['p(95)<500'],     // 95th percentile < 500ms
    'vehicle_api_latency': ['p(95)<300'], // Vehicle API < 300ms
    'tanker_api_latency': ['p(95)<400'],  // Tanker API < 400ms
    'health_api_latency': ['p(95)<100'],  // Health < 100ms
    'errors': ['rate<0.1'],               // <10% error rate
  },
};

// ── Test Data ───────────────────────────────────────────────
const FLEET_TYPES = ['tanker', 'bus', 'taxi'];
const VEHICLE_IDS = ['v-001', 'v-002', 'v-003', 'v-004', 'v-005'];
const DRIVER_IDS = ['d-001', 'd-002', 'd-003', 'd-004', 'd-005'];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Auth Helper ─────────────────────────────────────────────
let authToken = null;

function login() {
  const res = http.post(`${API}/auth/login`, JSON.stringify({
    email: 'admin@blueedge.ae',
    password: 'admin123',
  }), { headers: { 'Content-Type': 'application/json' } });

  authLatency.add(res.timings.duration);
  totalRequests.add(1);

  if (res.status === 200 || res.status === 201) {
    const body = JSON.parse(res.body);
    authToken = body.data?.accessToken || body.accessToken;
  }
  return authToken;
}

function authHeaders() {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  };
}

// ── Setup (runs once) ───────────────────────────────────────
export function setup() {
  const token = login();
  return { token };
}

// ── Main Test Scenario ──────────────────────────────────────
export default function (data) {
  authToken = data.token;
  const headers = authHeaders();

  // Weighted scenarios simulating real traffic patterns
  const scenario = Math.random();

  if (scenario < 0.15) {
    healthCheck();
  } else if (scenario < 0.35) {
    browseFleetOverview(headers);
  } else if (scenario < 0.55) {
    browseVehicles(headers);
  } else if (scenario < 0.70) {
    browseTankerOps(headers);
  } else if (scenario < 0.80) {
    browseDrivers(headers);
  } else if (scenario < 0.90) {
    browseAlerts(headers);
  } else {
    crudOperations(headers);
  }

  sleep(Math.random() * 2 + 0.5); // 0.5–2.5s think time
}

// ── Scenario: Health Check ──────────────────────────────────
function healthCheck() {
  group('Health Check', () => {
    const res = http.get(`${BASE_URL}/health`);
    healthLatency.add(res.timings.duration);
    totalRequests.add(1);
    check(res, {
      'health: status 200': (r) => r.status === 200,
      'health: status ok': (r) => JSON.parse(r.body).status === 'ok',
      'health: latency < 100ms': (r) => r.timings.duration < 100,
    });
    errorRate.add(res.status !== 200);

    // Readiness probe
    const ready = http.get(`${BASE_URL}/health/ready`);
    totalRequests.add(1);
    check(ready, { 'readiness: status 200': (r) => r.status === 200 });

    // Prometheus metrics
    const metrics = http.get(`${BASE_URL}/health/prometheus`);
    totalRequests.add(1);
    check(metrics, {
      'prometheus: status 200': (r) => r.status === 200,
      'prometheus: has metrics': (r) => r.body.includes('blueedge_'),
    });
  });
}

// ── Scenario: Fleet Overview (Dashboard) ────────────────────
function browseFleetOverview(headers) {
  group('Fleet Overview', () => {
    // Simulate dashboard loading — parallel API calls
    const responses = http.batch([
      ['GET', `${API}/vehicles?limit=10`, null, headers],
      ['GET', `${API}/drivers?limit=10`, null, headers],
      ['GET', `${API}/trips?limit=10&status=active`, null, headers],
      ['GET', `${API}/alerts?limit=5&status=active`, null, headers],
      ['GET', `${API}/fleets`, null, headers],
    ]);

    responses.forEach((res, i) => {
      totalRequests.add(1);
      const labels = ['vehicles', 'drivers', 'trips', 'alerts', 'fleets'];
      check(res, {
        [`overview ${labels[i]}: status 2xx`]: (r) => r.status >= 200 && r.status < 300,
      });
      errorRate.add(res.status >= 400);
    });
  });
}

// ── Scenario: Browse Vehicles ───────────────────────────────
function browseVehicles(headers) {
  group('Vehicles', () => {
    // List with pagination
    const list = http.get(`${API}/vehicles?page=1&limit=25&sort=status`, headers);
    vehicleLatency.add(list.timings.duration);
    totalRequests.add(1);
    check(list, {
      'vehicles list: status 2xx': (r) => r.status >= 200 && r.status < 300,
      'vehicles list: latency < 300ms': (r) => r.timings.duration < 300,
    });
    errorRate.add(list.status >= 400);

    // Search
    const search = http.get(`${API}/vehicles?search=tanker&limit=10`, headers);
    vehicleLatency.add(search.timings.duration);
    totalRequests.add(1);

    // Filter by fleet type
    const filtered = http.get(`${API}/vehicles?fleetType=${randomItem(FLEET_TYPES)}&limit=25`, headers);
    vehicleLatency.add(filtered.timings.duration);
    totalRequests.add(1);

    // Get detail
    const detail = http.get(`${API}/vehicles/${randomItem(VEHICLE_IDS)}`, headers);
    vehicleLatency.add(detail.timings.duration);
    totalRequests.add(1);
  });
}

// ── Scenario: Tanker Operations ─────────────────────────────
function browseTankerOps(headers) {
  group('Tanker Operations', () => {
    const responses = http.batch([
      ['GET', `${API}/tanker/dashboard`, null, headers],
      ['GET', `${API}/tanker/fleet`, null, headers],
      ['GET', `${API}/tanker/deliveries?limit=10`, null, headers],
      ['GET', `${API}/tanker/hazmat`, null, headers],
      ['GET', `${API}/tanker/analytics`, null, headers],
    ]);

    responses.forEach((res, i) => {
      tankerLatency.add(res.timings.duration);
      totalRequests.add(1);
      const labels = ['dashboard', 'fleet', 'deliveries', 'hazmat', 'analytics'];
      check(res, {
        [`tanker ${labels[i]}: status 2xx`]: (r) => r.status >= 200 && r.status < 300,
      });
      errorRate.add(res.status >= 400);
    });
  });
}

// ── Scenario: Browse Drivers ────────────────────────────────
function browseDrivers(headers) {
  group('Drivers', () => {
    const list = http.get(`${API}/drivers?page=1&limit=25`, headers);
    driverLatency.add(list.timings.duration);
    totalRequests.add(1);
    check(list, {
      'drivers list: status 2xx': (r) => r.status >= 200 && r.status < 300,
    });

    const detail = http.get(`${API}/drivers/${randomItem(DRIVER_IDS)}`, headers);
    driverLatency.add(detail.timings.duration);
    totalRequests.add(1);

    // Driver scoring
    const scoring = http.get(`${API}/driver-scoring?limit=10`, headers);
    driverLatency.add(scoring.timings.duration);
    totalRequests.add(1);
  });
}

// ── Scenario: Browse Alerts ─────────────────────────────────
function browseAlerts(headers) {
  group('Alerts', () => {
    const active = http.get(`${API}/alerts?status=active&limit=20`, headers);
    totalRequests.add(1);
    check(active, {
      'alerts: status 2xx': (r) => r.status >= 200 && r.status < 300,
    });
    errorRate.add(active.status >= 400);

    // Safety dashboard
    const safety = http.get(`${API}/safety/dashboard`, headers);
    totalRequests.add(1);

    // Compliance
    const compliance = http.get(`${API}/compliance?limit=10`, headers);
    totalRequests.add(1);
  });
}

// ── Scenario: CRUD Operations ───────────────────────────────
function crudOperations(headers) {
  group('CRUD Operations', () => {
    // Create a trip
    const trip = http.post(`${API}/trips`, JSON.stringify({
      vehicleId: randomItem(VEHICLE_IDS),
      driverId: randomItem(DRIVER_IDS),
      origin: 'JAFZA Terminal 4',
      destination: 'Al Quoz Industrial 3',
      status: 'planned',
    }), headers);
    totalRequests.add(1);
    check(trip, {
      'create trip: status 2xx': (r) => r.status >= 200 && r.status < 300,
    });

    // Update a vehicle
    const update = http.patch(`${API}/vehicles/${randomItem(VEHICLE_IDS)}`, JSON.stringify({
      fuelLevelPercent: Math.floor(Math.random() * 100),
    }), headers);
    totalRequests.add(1);

    // Create an alert
    const alert = http.post(`${API}/alerts`, JSON.stringify({
      vehicleId: randomItem(VEHICLE_IDS),
      type: 'speed_violation',
      severity: 'warning',
      message: `Speed violation on Sheikh Zayed Road`,
    }), headers);
    totalRequests.add(1);
  });
}

// ── Teardown ────────────────────────────────────────────────
export function teardown(data) {
  console.log(`Load test complete. Profile: ${profile}`);
}
