#!/usr/bin/env bash
# PSEE-RUNTIME.5A — DIM-01 Coverage Computation
#
# Usage:
#   compute_coverage.sh <psee_runtime_dir> <ig_runtime_dir>
#
# Inputs (READ-ONLY):
#   <ig_runtime_dir>/evidence_boundary.json
#   <ig_runtime_dir>/admissibility_log.json
#   <ig_runtime_dir>/normalized_intake_structure/layer_index.json
#   <ig_runtime_dir>/source_manifest.json
#   <psee_runtime_dir>/engine_state.json
#   <psee_runtime_dir>/gauge_inputs.json
#
# Outputs:
#   <psee_runtime_dir>/coverage_state.json  (UPDATED)
#   <psee_runtime_dir>/gauge_inputs.json    (DIM-01 only — UPDATED)
#
# Coverage definition:
#   coverage_percent =
#     (# admissible source units present in normalized intake)
#     /
#     (# total required source units per evidence boundary)
#     * 100
#
# Authority: PSEE-GAUGE.0/dimension_projection_model.md §DIM-01 (DP-5-02)
#
# Exit codes:
#   0 = COMPUTATION_COMPLETE
#   1 = FAIL_SAFE_STOP

set -euo pipefail

PSEE_DIR="${1:-}"
IG_DIR="${2:-}"

if [ -z "$PSEE_DIR" ] || [ -z "$IG_DIR" ]; then
  echo "ERROR: usage: compute_coverage.sh <psee_runtime_dir> <ig_runtime_dir>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
[[ "$PSEE_DIR" != /* ]] && PSEE_DIR="$REPO_ROOT/$PSEE_DIR"
[[ "$IG_DIR"   != /* ]] && IG_DIR="$REPO_ROOT/$IG_DIR"

# ── FAIL-SAFE: FORBIDDEN PATHS ────────────────────────────────────────────────
for forbidden in \
  "$REPO_ROOT/docs/pios/PSEE.3" \
  "$REPO_ROOT/docs/pios/PSEE.3B" \
  "$REPO_ROOT/docs/pios/IG.5" \
  "$REPO_ROOT/docs/pios/IG.6" \
  "$REPO_ROOT/docs/pios/IG.7"; do
  if [[ "$PSEE_DIR" == "$forbidden"* ]] || [[ "$IG_DIR" == "$forbidden"* ]]; then
    echo "FAIL_SAFE_STOP: forbidden path referenced — $PSEE_DIR / $IG_DIR"
    exit 1
  fi
done

# ── REQUIRED INPUTS ───────────────────────────────────────────────────────────
EB_FILE="$IG_DIR/evidence_boundary.json"
AL_FILE="$IG_DIR/admissibility_log.json"
LI_FILE="$IG_DIR/normalized_intake_structure/layer_index.json"
SM_FILE="$IG_DIR/source_manifest.json"
ES_FILE="$PSEE_DIR/engine_state.json"
GI_FILE="$PSEE_DIR/gauge_inputs.json"

for f in "$EB_FILE" "$AL_FILE" "$LI_FILE" "$SM_FILE" "$ES_FILE" "$GI_FILE"; do
  [ -f "$f" ] || { echo "FAIL_SAFE_STOP: required input not found: $f"; exit 1; }
done

COV_FILE="$PSEE_DIR/coverage_state.json"

echo "=== PSEE-RUNTIME.5A DIM-01 Coverage Computation ==="
echo "PSEE runtime dir: $PSEE_DIR"
echo "IG runtime dir:   $IG_DIR"
echo ""

# ── BOUNDARY SCOPE VERIFICATION ───────────────────────────────────────────────
echo "--- Evidence Boundary ---"
EB_SOURCE_RUN="$(jq -r '.admitted_input_class.source_run' "$EB_FILE")"
EB_ENFORCEMENT="$(jq -r '.enforcement' "$EB_FILE")"
echo "  source_run:   $EB_SOURCE_RUN"
echo "  enforcement:  $EB_ENFORCEMENT"

AL_SOURCE_RUN="$(jq -r '.source_run' "$AL_FILE")"
if [ "$EB_SOURCE_RUN" != "$AL_SOURCE_RUN" ]; then
  echo "FAIL_SAFE_STOP: evidence_boundary source_run ($EB_SOURCE_RUN) != admissibility_log source_run ($AL_SOURCE_RUN)"
  exit 1
fi
echo "  Boundary/log source_run: MATCH"
echo ""

# ── DERIVE REQUIRED UNITS ─────────────────────────────────────────────────────
# required_units = admissibility_log.summary.total
# This is the full set of source artifacts the evidence boundary covers.
echo "--- Required Units (from admissibility_log.json boundary enumeration) ---"
REQUIRED_UNITS="$(jq '.summary.total' "$AL_FILE")"
if [ -z "$REQUIRED_UNITS" ] || [ "$REQUIRED_UNITS" = "null" ] || [ "$REQUIRED_UNITS" -le 0 ]; then
  echo "FAIL_SAFE_STOP: required_units not derivable from admissibility_log.json summary.total"
  exit 1
fi
echo "  required_units: $REQUIRED_UNITS"
echo ""

# ── DERIVE ADMISSIBLE UNITS WITH EXPLICIT CROSS-REFERENCE ─────────────────────
# Step 1: Collect all ADMITTED entries from admissibility_log (with artifact name)
# Step 2: Cross-reference against layer_index.json and source_manifest.json root_artifacts
# Step 3: Count = admissible_units (only units with explicit match)
echo "--- Admissible Units (explicit cross-reference, no fuzzy matching) ---"

COMPUTE_RESULT="$(python3 - << PYEOF
import json, sys

al_file = "${AL_FILE}"
li_file = "${LI_FILE}"
sm_file = "${SM_FILE}"

with open(al_file)  as f: al  = json.load(f)
with open(li_file)  as f: li  = json.load(f)
with open(sm_file)  as f: sm  = json.load(f)

# Build reference sets from normalized_intake_structure/layer_index.json
layer_names = set()
for layer in li.get("layers", []):
    for art in layer.get("artifacts", []):
        if art.get("admission_status") == "ADMITTED":
            layer_names.add(art["name"])

# Build reference set from source_manifest.json root_artifacts
root_names = set(sm.get("root_artifacts", {}).get("artifacts", []))

present_names = layer_names | root_names

# Cross-reference: only count ADMITTED entries with explicit match in present_names
admissible_units = 0
matched = []
unmatched = []
for entry in al.get("entries", []):
    if entry.get("decision") == "ADMITTED":
        name = entry["artifact"]
        if name in present_names:
            admissible_units += 1
            matched.append(name)
        else:
            unmatched.append(name)

if unmatched:
    print("FAIL_SAFE_STOP: " + str(len(unmatched)) + " ADMITTED entries have no match in normalized intake: " + str(unmatched))
    sys.exit(1)

print("ADMISSIBLE_UNITS=" + str(admissible_units))
print("MATCHED=" + str(len(matched)))
print("LAYER_SET=" + str(len(layer_names)))
print("ROOT_SET=" + str(len(root_names)))
PYEOF
)"

if echo "$COMPUTE_RESULT" | grep -q "FAIL_SAFE_STOP"; then
  echo "$COMPUTE_RESULT"
  exit 1
fi

ADMISSIBLE_UNITS="$(echo "$COMPUTE_RESULT" | grep '^ADMISSIBLE_UNITS=' | cut -d= -f2)"
MATCHED="$(echo "$COMPUTE_RESULT" | grep '^MATCHED=' | cut -d= -f2)"
LAYER_SET="$(echo "$COMPUTE_RESULT" | grep '^LAYER_SET=' | cut -d= -f2)"
ROOT_SET="$(echo "$COMPUTE_RESULT" | grep '^ROOT_SET=' | cut -d= -f2)"

echo "  Layer artifacts present (layer_index.json ADMITTED): $LAYER_SET"
echo "  Root artifacts present (source_manifest.json):       $ROOT_SET"
echo "  ADMITTED entries cross-referenced:                   $MATCHED"
echo "  admissible_units:                                    $ADMISSIBLE_UNITS"
echo ""

# ── FAIL-SAFE: DIVISION GUARD ─────────────────────────────────────────────────
if [ "$REQUIRED_UNITS" -le 0 ]; then
  echo "FAIL_SAFE_STOP: required_units=$REQUIRED_UNITS — division not well-defined"
  exit 1
fi

if [ -z "$ADMISSIBLE_UNITS" ] || [ "$ADMISSIBLE_UNITS" = "null" ]; then
  echo "FAIL_SAFE_STOP: admissible_units not derivable"
  exit 1
fi

# ── COMPUTE COVERAGE PERCENT ──────────────────────────────────────────────────
echo "--- Coverage Computation ---"
COVERAGE_RESULT="$(python3 - << PYEOF
import json

required   = $REQUIRED_UNITS
admissible = $ADMISSIBLE_UNITS

coverage_percent = round(admissible / required * 100, 2)

# State label per PSEE-GAUGE.0/dimension_projection_model.md §DIM-01
if coverage_percent >= 90:
    state_label = "FULL"
elif coverage_percent >= 60:
    state_label = "PARTIAL"
else:
    state_label = "LOW"

print(f"COVERAGE_PERCENT={coverage_percent}")
print(f"STATE_LABEL={state_label}")
PYEOF
)"

COVERAGE_PERCENT="$(echo "$COVERAGE_RESULT" | grep '^COVERAGE_PERCENT=' | cut -d= -f2)"
STATE_LABEL_GAUGE="$(echo "$COVERAGE_RESULT" | grep '^STATE_LABEL=' | cut -d= -f2)"
ES_RUN_ID="$(jq -r '.run_id' "$ES_FILE")"

echo "  required_units:   $REQUIRED_UNITS"
echo "  admissible_units: $ADMISSIBLE_UNITS"
echo "  coverage_percent: $COVERAGE_PERCENT"
echo "  state_label:      $STATE_LABEL_GAUGE"
echo ""

# ── WRITE coverage_state.json ─────────────────────────────────────────────────
python3 - << PYEOF > "$COV_FILE"
import json

state = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.5A",
  "run_id": "${ES_RUN_ID}",
  "dimension": "DIM-01",
  "label": "Coverage",
  "coverage_percent": ${COVERAGE_PERCENT},
  "state": "COMPUTED",
  "state_label": "${STATE_LABEL_GAUGE}",
  "required_units": ${REQUIRED_UNITS},
  "admissible_units": ${ADMISSIBLE_UNITS},
  "method": "IG.RUNTIME admissible coverage computation",
  "source_artifacts": [
    "evidence_boundary.json",
    "admissibility_log.json",
    "normalized_intake_structure/layer_index.json",
    "source_manifest.json"
  ],
  "authority": "PSEE-GAUGE.0 DP-5-02",
  "derivation": "coverage_percent = admissible_units / required_units * 100 = ${ADMISSIBLE_UNITS} / ${REQUIRED_UNITS} * 100 = ${COVERAGE_PERCENT}"
}
print(json.dumps(state, indent=2))
PYEOF

# ── UPDATE gauge_inputs.json (DIM-01 only) ────────────────────────────────────
TMPFILE="$(mktemp "${GI_FILE}.tmp.XXXXXX")"

jq \
  --argjson value "${COVERAGE_PERCENT}" \
  --arg     state  "COMPUTED" \
  --arg     reason "Coverage computed from IG.RUNTIME evidence: ${ADMISSIBLE_UNITS}/${REQUIRED_UNITS} admissible units" \
  --arg     auth   "PSEE-GAUGE.0 DP-5-02 via PSEE-RUNTIME.5A" \
  '.panel_02["DIM-01"].value        = $value
   | .panel_02["DIM-01"].state_label = $state
   | .panel_02["DIM-01"].reason     = $reason
   | .panel_02["DIM-01"].authority  = $auth' \
  "$GI_FILE" > "$TMPFILE"

mv "$TMPFILE" "$GI_FILE"

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "--- Output ---"
CS_HASH=$(shasum -a 256 "$COV_FILE" | awk '{print $1}')
GI_HASH=$(shasum -a 256 "$GI_FILE"  | awk '{print $1}')
echo "coverage_state.json: $CS_HASH"
echo "gauge_inputs.json:   $GI_HASH"
echo ""
echo "COMPUTATION_COMPLETE"
echo "  coverage_percent = $COVERAGE_PERCENT (required=$REQUIRED_UNITS admissible=$ADMISSIBLE_UNITS)"
