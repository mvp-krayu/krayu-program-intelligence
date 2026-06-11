#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Blue Edge Fleet — Load Test Runner
# Prerequisites: k6 (https://k6.io/docs/get-started/installation)
# ══════════════════════════════════════════════════════════════

set -e

API_URL="${API_URL:-http://localhost:3000}"
WS_URL="${WS_URL:-ws://localhost:3000}"
PROFILE="${1:-smoke}"
OUTPUT_DIR="load-tests/results"

mkdir -p "$OUTPUT_DIR"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "══════════════════════════════════════════════════════════"
echo "  Blue Edge Fleet — Load Test"
echo "  Profile:  $PROFILE"
echo "  API:      $API_URL"
echo "  Time:     $(date)"
echo "══════════════════════════════════════════════════════════"

# ── Pre-flight: Health Check ─────────────────────────────────
echo ""
echo "▶ Pre-flight health check..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" != "200" ]; then
  echo "  ✗ API not responding (HTTP $HTTP_CODE). Start the server first."
  exit 1
fi
echo "  ✓ API healthy"

# ── Run API Load Test ────────────────────────────────────────
echo ""
echo "▶ Running API load test (profile: $PROFILE)..."
k6 run \
  --env API_URL="$API_URL" \
  --env PROFILE="$PROFILE" \
  --out json="$OUTPUT_DIR/api-$PROFILE-$TIMESTAMP.json" \
  --summary-export="$OUTPUT_DIR/api-$PROFILE-$TIMESTAMP-summary.json" \
  load-tests/api-load.js

echo ""
echo "  ✓ API test complete → $OUTPUT_DIR/api-$PROFILE-$TIMESTAMP-summary.json"

# ── Run WebSocket Load Test (only for load/stress profiles) ──
if [ "$PROFILE" = "load" ] || [ "$PROFILE" = "stress" ]; then
  echo ""
  echo "▶ Running WebSocket load test..."
  k6 run \
    --env WS_URL="$WS_URL" \
    --out json="$OUTPUT_DIR/ws-$PROFILE-$TIMESTAMP.json" \
    --summary-export="$OUTPUT_DIR/ws-$PROFILE-$TIMESTAMP-summary.json" \
    load-tests/ws-load.js

  echo "  ✓ WebSocket test complete → $OUTPUT_DIR/ws-$PROFILE-$TIMESTAMP-summary.json"
fi

# ── Summary ──────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════════"
echo "  Results saved to: $OUTPUT_DIR/"
echo "  API summary:      api-$PROFILE-$TIMESTAMP-summary.json"
if [ "$PROFILE" = "load" ] || [ "$PROFILE" = "stress" ]; then
echo "  WS summary:       ws-$PROFILE-$TIMESTAMP-summary.json"
fi
echo ""
echo "  Profiles available:"
echo "    smoke   — 5 VUs, 2 min     (quick validation)"
echo "    load    — 50→100 VUs, 14 min (normal load)"
echo "    stress  — 100→400 VUs, 22 min (breaking point)"
echo "    spike   — 10→500 VUs, 3 min  (spike test)"
echo "══════════════════════════════════════════════════════════"
