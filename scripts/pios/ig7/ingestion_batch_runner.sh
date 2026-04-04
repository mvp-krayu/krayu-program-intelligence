#!/usr/bin/env bash
# IG.7 — Ingestion Batch Runner
# Thin wrapper over IG.6 orchestrator. Calls orchestrator first; only proceeds
# to payload normalization if orchestrator exits 0 (ORCHESTRATION_COMPLETE).
#
# FAIL-SAFE: any run that bypasses IG.6 orchestrator → FAIL_SAFE_STOP.
#
# Usage:
#   ./ingestion_batch_runner.sh <run_input.json>
#
# Exit codes:
#   0 = BATCH_COMPLETE (orchestration validated, payload normalized)
#   1 = BATCH_FAIL or FAIL_SAFE_STOP

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
INPUT_JSON="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── ENTRY CHECKS ─────────────────────────────────────────────────────────────
[ -z "$INPUT_JSON" ] && {
  echo "FAIL_SAFE_STOP: run input JSON required"
  echo "Usage: ingestion_batch_runner.sh <run_input.json>"
  exit 1
}
[[ "$INPUT_JSON" == /* ]] || INPUT_JSON="$REPO_ROOT/$INPUT_JSON"
[ -f "$INPUT_JSON" ] || { echo "FAIL_SAFE_STOP: input file not found: $INPUT_JSON"; exit 1; }

# ── RESOLVE PATHS ─────────────────────────────────────────────────────────────
IG6_ORCHESTRATOR="$REPO_ROOT/scripts/pios/ig6/ingestion_orchestrator.sh"
IG7_NORMALIZER="$SCRIPT_DIR/ingestion_payload_normalizer.sh"

[ -f "$IG6_ORCHESTRATOR" ] && [ -x "$IG6_ORCHESTRATOR" ] || {
  echo "FAIL_SAFE_STOP: IG.6 orchestrator not found or not executable: $IG6_ORCHESTRATOR"
  exit 1
}
[ -f "$IG7_NORMALIZER" ] && [ -x "$IG7_NORMALIZER" ] || {
  echo "FAIL_SAFE_STOP: IG.7 payload normalizer not found or not executable: $IG7_NORMALIZER"
  exit 1
}

echo "=== IG.7 Ingestion Batch Runner ==="
echo "Input:        $INPUT_JSON"
echo "Orchestrator: $IG6_ORCHESTRATOR"
echo "Normalizer:   $IG7_NORMALIZER"
echo ""

# ── STEP 1: IG.6 ORCHESTRATION GATE ──────────────────────────────────────────
# FAIL-SAFE: payload generation is only permitted through the governed
# orchestration path. If the orchestrator fails, no normalization occurs.

echo "--- Step 1: IG.6 Orchestration Gate ---"
ORCH_OUT="$(bash "$IG6_ORCHESTRATOR" "$INPUT_JSON" 2>&1)" || {
  echo ""
  echo "FAIL_SAFE_STOP"
  echo "Reason:  IG.6 orchestrator returned non-zero — orchestration gate failed"
  echo "Resolve: Fix orchestration errors before payload normalization can proceed"
  echo ""
  echo "Orchestrator output:"
  echo "$ORCH_OUT"
  exit 1
}

# Verify orchestrator emitted ORCHESTRATION_COMPLETE
echo "$ORCH_OUT" | grep -q "ORCHESTRATION_COMPLETE" || {
  echo ""
  echo "FAIL_SAFE_STOP"
  echo "Reason:  Orchestrator exited 0 but ORCHESTRATION_COMPLETE not found in output"
  echo "Resolve: Inspect orchestrator output — unexpected execution path"
  echo ""
  echo "Orchestrator output:"
  echo "$ORCH_OUT"
  exit 1
}

# Surface orchestrator summary lines
echo "$ORCH_OUT" | grep -E "^(ORCHESTRATION_COMPLETE|PASS:|FAIL:|Stream:|Run ID:)" | sed 's/^/  /'
echo "  PASS  Orchestration gate: ORCHESTRATION_COMPLETE"
echo ""

# ── STEP 2: EXTRACT RUN NAMESPACE ─────────────────────────────────────────────
echo "--- Step 2: Resolve run namespace ---"

OUTPUT_ROOT="$(python3 - "$INPUT_JSON" "output_root" << 'PYEOF'
import json, sys
try:
    data = json.load(open(sys.argv[1]))
    keys = sys.argv[2].split(".")
    v = data
    for k in keys:
        v = v[k]
    print(v if v is not None else "")
except Exception:
    print("")
PYEOF
)"

RUN_ID="$(python3 - "$INPUT_JSON" "run_id" << 'PYEOF'
import json, sys
try:
    data = json.load(open(sys.argv[1]))
    keys = sys.argv[2].split(".")
    v = data
    for k in keys:
        v = v[k]
    print(v if v is not None else "")
except Exception:
    print("")
PYEOF
)"

[[ "$OUTPUT_ROOT" == /* ]] && RUN_DIR="$OUTPUT_ROOT" || RUN_DIR="$REPO_ROOT/$OUTPUT_ROOT"

[ -d "$RUN_DIR" ] || {
  echo "  FAIL  Run namespace not found: $RUN_DIR"
  echo ""
  echo "FAIL_SAFE_STOP"
  echo "Reason: run namespace absent after successful orchestration"
  exit 1
}

echo "  PASS  Run namespace: $(basename "$RUN_DIR")"
echo ""

# ── STEP 3: PAYLOAD NORMALIZATION ─────────────────────────────────────────────
echo "--- Step 3: Payload normalization ---"

NORM_OUT="$(bash "$IG7_NORMALIZER" "$RUN_DIR" 2>&1)" || {
  echo ""
  echo "FAIL_SAFE_STOP"
  echo "Reason:  Payload normalizer returned non-zero — inconsistent payload structure"
  echo "Resolve: Inspect normalizer output for schema violations"
  echo ""
  echo "Normalizer output:"
  echo "$NORM_OUT"
  exit 1
}

echo "$NORM_OUT" | grep -E "^  (PASS|FAIL|INFO)" | head -20
echo ""

# Verify normalizer emitted NORMALIZATION_COMPLETE
echo "$NORM_OUT" | grep -q "NORMALIZATION_COMPLETE" || {
  echo "FAIL_SAFE_STOP"
  echo "Reason:  NORMALIZATION_COMPLETE not confirmed — payload structure inconsistent"
  exit 1
}

echo "  PASS  Normalization gate: NORMALIZATION_COMPLETE"
echo ""

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════"
echo "Stream:     IG.7"
echo "Run ID:     $RUN_ID"
echo ""
echo "BATCH_COMPLETE"
echo "Orchestration validated. Payload normalized. Run is governed and deterministic."
exit 0
