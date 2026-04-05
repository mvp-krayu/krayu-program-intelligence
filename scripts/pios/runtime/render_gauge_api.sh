#!/usr/bin/env bash
# PSEE-RUNTIME.GAUGE-V1 — Execution Gauge API Payload Renderer
#
# Usage:
#   render_gauge_api.sh <runtime_dir>
#
# Reads (READ-ONLY — frozen inputs):
#   engine_state.json
#   gauge_inputs.json
#   coverage_state.json
#   reconstruction_state.json
#
# Produces:
#   gauge_api_payload.json
#
# API contract: gauge-v1-truthful
# Name: "Execution Gauge — Phase-Aware"
# Suppresses canonical_score and projected_score when DIM-01 or DIM-02 = BLOCKED
#
# Exit codes:
#   0 = RENDER_COMPLETE
#   1 = FAIL_SAFE_STOP

set -euo pipefail

RUNTIME_DIR="${1:-}"
if [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: render_gauge_api.sh <runtime_dir>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
[[ "$RUNTIME_DIR" != /* ]] && RUNTIME_DIR="$REPO_ROOT/$RUNTIME_DIR"

# ── FAIL-SAFE: FORBIDDEN PATHS ────────────────────────────────────────────────
for forbidden in \
  "$REPO_ROOT/docs/pios/PSEE.3" \
  "$REPO_ROOT/docs/pios/PSEE.3B" \
  "$REPO_ROOT/docs/pios/IG.5" \
  "$REPO_ROOT/docs/pios/IG.6" \
  "$REPO_ROOT/docs/pios/IG.7"; do
  if [[ "$RUNTIME_DIR" == "$forbidden"* ]]; then
    echo "FAIL_SAFE_STOP: forbidden runtime dir — $RUNTIME_DIR"
    exit 1
  fi
done

# ── REQUIRED INPUTS (READ-ONLY) ───────────────────────────────────────────────
ES_FILE="$RUNTIME_DIR/engine_state.json"
GI_FILE="$RUNTIME_DIR/gauge_inputs.json"
COV_FILE="$RUNTIME_DIR/coverage_state.json"
REC_FILE="$RUNTIME_DIR/reconstruction_state.json"

[ -f "$ES_FILE"  ] || { echo "FAIL_SAFE_STOP: engine_state.json not found: $ES_FILE"; exit 1; }
[ -f "$GI_FILE"  ] || { echo "FAIL_SAFE_STOP: gauge_inputs.json not found: $GI_FILE"; exit 1; }
[ -f "$COV_FILE" ] || { echo "FAIL_SAFE_STOP: coverage_state.json not found: $COV_FILE"; exit 1; }
[ -f "$REC_FILE" ] || { echo "FAIL_SAFE_STOP: reconstruction_state.json not found: $REC_FILE"; exit 1; }

OUTPUT="$RUNTIME_DIR/gauge_api_payload.json"

# ── READ INPUTS ───────────────────────────────────────────────────────────────
ES_STATUS="$(jq -r '.execution_status' "$ES_FILE")"
ES_RUN_ID="$(jq -r '.run_id'           "$ES_FILE")"

COV_STATE="$(jq -r '.state'            "$COV_FILE")"
COV_REASON="$(jq -r '.reason'          "$COV_FILE")"
COV_GATE="$(jq  -r '.phase_gate'       "$COV_FILE")"
COV_AUTH="$(jq  -r '.authority'        "$COV_FILE")"

REC_STATE="$(jq -r '.state'            "$REC_FILE")"
REC_REASON="$(jq -r '.reason'          "$REC_FILE")"
REC_GATE="$(jq  -r '.phase_gate'       "$REC_FILE")"
REC_AUTH="$(jq  -r '.authority'        "$REC_FILE")"

# ── SCORE AVAILABILITY ────────────────────────────────────────────────────────
# score_available = false when DIM-01 OR DIM-02 = BLOCKED
if [ "$COV_STATE" = "BLOCKED" ] || [ "$REC_STATE" = "BLOCKED" ]; then
  SCORE_AVAILABLE_PY="False"
  SCORE_LABEL="Score unavailable — execution phase not reached"
else
  SCORE_AVAILABLE_PY="True"
  SCORE_LABEL="Score available"
fi

# ── WRITE gauge_api_payload.json ──────────────────────────────────────────────
python3 - << PYEOF > "$OUTPUT"
import json

payload = {
  "gauge_version": "v1-truthful",
  "label": "Execution Gauge — Phase-Aware",
  "stream": "PSEE-RUNTIME.GAUGE-V1",
  "run_id": "${ES_RUN_ID}",
  "execution_status": "${ES_STATUS}",
  "score_available": ${SCORE_AVAILABLE_PY},
  "score_unavailable_reason": "${SCORE_LABEL}",
  "dimensions": {
    "coverage": {
      "dimension": "DIM-01",
      "state": "${COV_STATE}",
      "reason": "${COV_REASON}",
      "phase_gate": "${COV_GATE}",
      "authority": "${COV_AUTH}"
    },
    "reconstruction": {
      "dimension": "DIM-02",
      "state": "${REC_STATE}",
      "reason": "${REC_REASON}",
      "phase_gate": "${REC_GATE}",
      "authority": "${REC_AUTH}"
    }
  },
  "suppressed_fields": [
    "canonical_score",
    "projected_score"
  ],
  "suppression_reason": "DIM-01 or DIM-02 = BLOCKED — score components not derivable at current execution phase"
}
print(json.dumps(payload, indent=2))
PYEOF

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "=== PSEE-RUNTIME.GAUGE-V1 API Payload Render ==="
echo "Runtime dir:      $RUNTIME_DIR"
echo "execution_status: $ES_STATUS"
echo "score_available:  $SCORE_AVAILABLE_PY"
echo "DIM-01 state:     $COV_STATE"
echo "DIM-02 state:     $REC_STATE"
HASH=$(shasum -a 256 "$OUTPUT" | awk '{print $1}')
echo "gauge_api_payload.json: $HASH"
echo ""
echo "RENDER_COMPLETE"
