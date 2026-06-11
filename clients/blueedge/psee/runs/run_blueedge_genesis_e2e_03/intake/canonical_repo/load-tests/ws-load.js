// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — k6 WebSocket Load Test
// Tests real-time fleet tracking under concurrent connections
// Run: k6 run load-tests/ws-load.js
// ══════════════════════════════════════════════════════════════

import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const wsErrors = new Rate('ws_errors');
const wsConnectTime = new Trend('ws_connect_time', true);
const wsMessageLatency = new Trend('ws_message_latency', true);
const wsMessages = new Counter('ws_messages_received');

const WS_URL = __ENV.WS_URL || 'ws://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // 50 concurrent WS connections
    { duration: '2m', target: 100 },   // Ramp to 100
    { duration: '3m', target: 100 },   // Sustain
    { duration: '1m', target: 200 },   // Peak
    { duration: '2m', target: 200 },   // Sustain peak
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    'ws_errors': ['rate<0.05'],
    'ws_connect_time': ['p(95)<2000'],
    'ws_message_latency': ['p(95)<500'],
  },
};

export default function () {
  const connectStart = Date.now();

  const url = `${WS_URL}/socket.io/?EIO=4&transport=websocket`;
  const res = ws.connect(url, {}, function (socket) {
    wsConnectTime.add(Date.now() - connectStart);

    // Subscribe to fleet position updates
    socket.on('open', () => {
      socket.send(JSON.stringify({
        type: 'subscribe',
        channel: 'fleet:positions',
      }));

      // Also subscribe to alerts
      socket.send(JSON.stringify({
        type: 'subscribe',
        channel: 'fleet:alerts',
      }));
    });

    socket.on('message', (msg) => {
      wsMessages.add(1);
      try {
        const data = JSON.parse(msg);
        // Track message latency if timestamp is included
        if (data.timestamp) {
          const latency = Date.now() - new Date(data.timestamp).getTime();
          wsMessageLatency.add(Math.abs(latency));
        }
      } catch {
        // Socket.IO protocol messages (ping/pong)
      }
    });

    socket.on('error', (e) => {
      wsErrors.add(1);
      console.error('WebSocket error:', e);
    });

    socket.on('close', () => {
      // Connection closed
    });

    // Keep connection alive for 30-60 seconds (simulating dashboard view)
    const duration = Math.random() * 30000 + 30000;
    socket.setTimeout(() => {
      // Send a ping before closing
      socket.send('2'); // Socket.IO ping
      socket.close();
    }, duration);
  });

  check(res, {
    'ws connected': (r) => r && r.status === 101,
  });
  wsErrors.add(!res || res.status !== 101);

  sleep(1);
}
