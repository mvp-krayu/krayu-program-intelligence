#!/usr/bin/env bash
# PSEE-RUNTIME.4C — Coverage and Reconstruction Dimension Materialization
#
# Usage:
#   materialize_coverage_reconstruction.sh <runtime_dir>
#
# Materializes DIM-01 (coverage_percent) and DIM-02 (reconstruction_result) dimension
# states based on engine execution phase, per PSEE-GAUGE.0 dimension availability rules.
#
# Phase gate logic (PSEE-GAUGE.0/dimension_projection_model.md):
#   DIM-01 becomes available at S-10 (Phase 5 entry)
#   DIM-02 becomes available at S-12→S-13 transition (Phase 6 complete)
#
# If phase gate not satisfied:
#   value = null, state = BLOCKED (authoritative — not a stub)
#
# If phase gate satisfied (future path — not reached in current runtime):
#   FAIL_SAFE_STOP: PSEEContext fields must be present in admissible inputs
#
# Produces:
#   coverage_state.json
#   reconstruction_state.json
# Updates (DIM-01 and DIM-02 only):
#   gauge_inputs.json
#
# Exit codes:
#   0 = MATERIALIZATION_COMPLETE
#   1 = FAIL_SAFE_STOP

set -euo pipefail

RUNTIME_DIR="${1:-}"
if [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: materialize_coverage_reconstruction.sh <runtime_dir>"
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

# ── REQUIRED INPUTS ───────────────────────────────────────────────────────────
ES_FILE="$RUNTIME_DIR/engine_state.json"
GI_FILE="$RUNTIME_DIR/gauge_inputs.json"

[ -f "$ES_FILE" ] || { echo "FAIL_SAFE_STOP: engine_state.json not found: $ES_FILE"; exit 1; }
[ -f "$GI_FILE" ] || { echo "FAIL_SAFE_STOP: gauge_inputs.json not found: $GI_FILE"; exit 1; }

COVERAGE_STATE="$RUNTIME_DIR/coverage_state.json"
RECON_STATE="$RUNTIME_DIR/reconstruction_state.json"

# ── READ ENGINE STATE ─────────────────────────────────────────────────────────
ES_STATUS="$(jq -r '.execution_status' "$ES_FILE")"
ES_RUN_ID="$(jq -r '.run_id'           "$ES_FILE")"

echo "=== PSEE-RUNTIME.4C Coverage/Reconstruction Materialization ==="
echo "Runtime dir:      $RUNTIME_DIR"
echo "execution_status: $ES_STATUS"
echo ""

# ── PHASE GATE DEFINITIONS ────────────────────────────────────────────────────
# States at or beyond Phase 5 (S-10) — DIM-01 available
# Authority: PSEE-GAUGE.0/dimension_projection_model.md §DIM-01
PHASE_5_STATES="PHASE_5_ACTIVE PHASE_5_COMPLETE PHASE_6_ACTIVE PHASE_6_COMPLETE S-10 S-11 S-12 S-13 S-T3 COMPLETE"

# States that indicate Phase 6 completion (S-12→S-13) — DIM-02 available
# Authority: PSEE-GAUGE.0/dimension_projection_model.md §DIM-02
PHASE_6_STATES="PHASE_6_COMPLETE S-13 COMPLETE"

phase5_reached() { for s in $PHASE_5_STATES; do [ "$ES_STATUS" = "$s" ] && return 0; done; return 1; }
phase6_reached() { for s in $PHASE_6_STATES; do [ "$ES_STATUS" = "$s" ] && return 0; done; return 1; }

# ── MATERIALIZE DIM-01 (COVERAGE) ────────────────────────────────────────────
echo "--- DIM-01 Coverage ---"

if phase5_reached; then
  # Phase 5 reached: PSEEContext.coverage_percent must be present in admissible inputs
  # If not found in runtime inputs, FAIL_SAFE_STOP — no invention allowed
  echo "FAIL_SAFE_STOP: execution_status=$ES_STATUS indicates Phase 5 reached"
  echo "  PSEEContext.coverage_percent required but not found in admissible runtime inputs"
  echo "  Admissible path: PSEEContext artifact from Phase 5 execution"
  exit 1
fi

DIM01_VALUE_PY="None"
DIM01_STATE="BLOCKED"
DIM01_REASON="Coverage available at Phase 5 (S-10) — engine at ${ES_STATUS} has not reached Phase 5"
DIM01_AUTHORITY="PSEE-GAUGE.0/dimension_projection_model.md §DIM-01 Unavailable conditions"
DIM01_PHASE_GATE_SATISFIED="False"
echo "  BLOCKED — Phase 5 (S-10) not reached"

# ── MATERIALIZE DIM-02 (RECONSTRUCTION) ──────────────────────────────────────
echo "--- DIM-02 Reconstruction ---"

if phase6_reached; then
  echo "FAIL_SAFE_STOP: execution_status=$ES_STATUS indicates Phase 6 reached"
  echo "  PSEEContext.reconstruction_result required but not found in admissible runtime inputs"
  echo "  Admissible path: PSEEContext artifact from Phase 6 (S-12→S-13) execution"
  exit 1
fi

DIM02_VALUE_PY="None"
DIM02_STATE="BLOCKED"
DIM02_REASON="Reconstruction available at Phase 6 (S-12→S-13) — engine at ${ES_STATUS} has not reached Phase 6"
DIM02_AUTHORITY="PSEE-GAUGE.0/dimension_projection_model.md §DIM-02 Unavailable conditions"
DIM02_PHASE_GATE_SATISFIED="False"
echo "  BLOCKED — Phase 6 (S-12→S-13) not reached"
echo ""

# ── WRITE coverage_state.json ─────────────────────────────────────────────────
python3 - << PYEOF > "$COVERAGE_STATE"
import json
state = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.4C",
  "run_id": "${ES_RUN_ID}",
  "dimension": "DIM-01",
  "label": "Coverage",
  "value": ${DIM01_VALUE_PY},
  "state": "${DIM01_STATE}",
  "reason": "${DIM01_REASON}",
  "authority": "${DIM01_AUTHORITY}",
  "engine_status": "${ES_STATUS}",
  "phase_gate": "Phase 5 (S-10)",
  "phase_gate_satisfied": ${DIM01_PHASE_GATE_SATISFIED},
  "source_field": "PSEEContext.coverage_percent",
  "derivation_method": "PHASE_GATE_CHECK — value derivable only when execution_status indicates Phase 5 reached per PSEE-GAUGE.0 dimension_projection_model.md §Dimension Update Timing"
}
print(json.dumps(state, indent=2))
PYEOF

# ── WRITE reconstruction_state.json ──────────────────────────────────────────
python3 - << PYEOF > "$RECON_STATE"
import json
state = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.4C",
  "run_id": "${ES_RUN_ID}",
  "dimension": "DIM-02",
  "label": "Reconstruction",
  "value": ${DIM02_VALUE_PY},
  "state": "${DIM02_STATE}",
  "reason": "${DIM02_REASON}",
  "authority": "${DIM02_AUTHORITY}",
  "engine_status": "${ES_STATUS}",
  "phase_gate": "Phase 6 (S-12→S-13)",
  "phase_gate_satisfied": ${DIM02_PHASE_GATE_SATISFIED},
  "source_field": "PSEEContext.reconstruction_result",
  "validation_method": "PHASE_GATE_CHECK — value derivable only when execution_status indicates Phase 6 completion (S-12→S-13) per PSEE-GAUGE.0 dimension_projection_model.md §Dimension Update Timing"
}
print(json.dumps(state, indent=2))
PYEOF

# ── UPDATE gauge_inputs.json (DIM-01 and DIM-02 only) ────────────────────────
TMPFILE="$(mktemp "${GI_FILE}.tmp.XXXXXX")"

jq \
  --arg state01  "$DIM01_STATE" \
  --arg reason01 "$DIM01_REASON" \
  --arg auth01   "$DIM01_AUTHORITY" \
  --arg state02  "$DIM02_STATE" \
  --arg reason02 "$DIM02_REASON" \
  --arg auth02   "$DIM02_AUTHORITY" \
  '.panel_02["DIM-01"].value         = null
   | .panel_02["DIM-01"].state_label = $state01
   | .panel_02["DIM-01"].reason      = $reason01
   | .panel_02["DIM-01"].authority   = $auth01
   | .panel_02["DIM-02"].value       = null
   | .panel_02["DIM-02"].state_label = $state02
   | .panel_02["DIM-02"].reason      = $reason02
   | .panel_02["DIM-02"].authority   = $auth02' \
  "$GI_FILE" > "$TMPFILE"

mv "$TMPFILE" "$GI_FILE"

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "--- Output ---"
CS_HASH=$(shasum -a 256 "$COVERAGE_STATE" | awk '{print $1}')
RS_HASH=$(shasum -a 256 "$RECON_STATE"    | awk '{print $1}')
GI_HASH=$(shasum -a 256 "$GI_FILE"        | awk '{print $1}')
echo "coverage_state.json:       $CS_HASH"
echo "reconstruction_state.json: $RS_HASH"
echo "gauge_inputs.json:         $GI_HASH"
echo ""
echo "MATERIALIZATION_COMPLETE"
