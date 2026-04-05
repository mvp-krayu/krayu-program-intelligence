#!/usr/bin/env bash
# PSEE-RUNTIME.GAUGE-V1 — CLI Execution Gauge View
#
# Usage:
#   view_gauge_cli.sh <runtime_dir>
#
# Reads (READ-ONLY):
#   gauge_api_payload.json
#
# Exit codes:
#   0 = VIEW_COMPLETE
#   1 = FAIL_SAFE_STOP

set -euo pipefail

RUNTIME_DIR="${1:-}"
if [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: view_gauge_cli.sh <runtime_dir>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
[[ "$RUNTIME_DIR" != /* ]] && RUNTIME_DIR="$REPO_ROOT/$RUNTIME_DIR"

PAYLOAD="$RUNTIME_DIR/gauge_api_payload.json"
[ -f "$PAYLOAD" ] || { echo "FAIL_SAFE_STOP: gauge_api_payload.json not found: $PAYLOAD"; exit 1; }

# ── READ ──────────────────────────────────────────────────────────────────────
LABEL="$(jq -r '.label'                    "$PAYLOAD")"
G_VER="$(jq  -r '.gauge_version'           "$PAYLOAD")"
RUN="$(jq    -r '.run_id'                  "$PAYLOAD")"
STATUS="$(jq -r '.execution_status'        "$PAYLOAD")"
SCORE_AVAIL="$(jq -r '.score_available'    "$PAYLOAD")"
SCORE_MSG="$(jq  -r '.score_unavailable_reason' "$PAYLOAD")"

COV_STATE="$(jq  -r '.dimensions.coverage.state'          "$PAYLOAD")"
COV_REASON="$(jq -r '.dimensions.coverage.reason'         "$PAYLOAD")"
COV_GATE="$(jq   -r '.dimensions.coverage.phase_gate'     "$PAYLOAD")"

REC_STATE="$(jq  -r '.dimensions.reconstruction.state'    "$PAYLOAD")"
REC_REASON="$(jq -r '.dimensions.reconstruction.reason'   "$PAYLOAD")"
REC_GATE="$(jq   -r '.dimensions.reconstruction.phase_gate' "$PAYLOAD")"

# ── RENDER ────────────────────────────────────────────────────────────────────
echo "╔══════════════════════════════════════════════════════════════════╗"
printf "║  %-64s║\n" "$LABEL  [${G_VER}]"
echo "╠══════════════════════════════════════════════════════════════════╣"
printf "║  Run:             %-47s║\n" "$RUN"
printf "║  Execution Phase: %-47s║\n" "$STATUS"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║  DIMENSIONS                                                      ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
printf "║  DIM-01  Coverage         [ %-37s]║\n" "$COV_STATE"
printf "║    Gate:   %-54s║\n" "$COV_GATE"
printf "║    Reason: %-54s║\n" "${COV_REASON:0:54}"
echo "╠══════════════════════════════════════════════════════════════════╣"
printf "║  DIM-02  Reconstruction   [ %-37s]║\n" "$REC_STATE"
printf "║    Gate:   %-54s║\n" "$REC_GATE"
printf "║    Reason: %-54s║\n" "${REC_REASON:0:54}"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║  SCORE                                                           ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
if [ "$SCORE_AVAIL" = "false" ]; then
  printf "║  %-64s║\n" "canonical_score:  -- (suppressed)"
  printf "║  %-64s║\n" "projected_score:  -- (suppressed)"
  printf "║  %-64s║\n" ""
  printf "║  %-64s║\n" "$SCORE_MSG"
fi
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "VIEW_COMPLETE"
