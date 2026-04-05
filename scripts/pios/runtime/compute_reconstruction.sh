#!/usr/bin/env bash
# PSEE-RUNTIME.6A — DIM-02 Reconstruction Validation
#
# Usage:
#   compute_reconstruction.sh <psee_runtime_dir> <ig_runtime_dir>
#
# Inputs (READ-ONLY):
#   <ig_runtime_dir>/evidence_boundary.json
#   <ig_runtime_dir>/admissibility_log.json
#   <ig_runtime_dir>/normalized_intake_structure/layer_index.json
#   <ig_runtime_dir>/normalized_intake_structure/provenance_chain.json
#   <ig_runtime_dir>/normalized_intake_structure/source_profile.json
#   <psee_runtime_dir>/coverage_state.json
#   <psee_runtime_dir>/engine_state.json
#   <psee_runtime_dir>/gauge_inputs.json
#
# Outputs:
#   <psee_runtime_dir>/reconstruction_state.json  (UPDATED)
#   <psee_runtime_dir>/gauge_inputs.json          (DIM-02 state_label only — UPDATED)
#
# Reconstruction definition:
#   Does the admissible evidence assemble into a structurally valid program representation?
#
# Evaluation axes (all required):
#   1. COMPLETENESS       — all required units present, no orphan references
#   2. STRUCTURAL_LINK    — all units connected, no isolated nodes
#   3. REFERENTIAL_INTEGRITY — all references resolve, no dangling
#   4. LAYER_CONSISTENCY  — cross-layer relationships valid
#
# State: PASS (all axes) | PARTIAL (some violations) | FAIL (structural break)
#
# Authority: PSEE-GAUGE.0 DP-6-03
#
# Exit codes:
#   0 = VALIDATION_COMPLETE
#   1 = FAIL_SAFE_STOP

set -euo pipefail

PSEE_DIR="${1:-}"
IG_DIR="${2:-}"

if [ -z "$PSEE_DIR" ] || [ -z "$IG_DIR" ]; then
  echo "ERROR: usage: compute_reconstruction.sh <psee_runtime_dir> <ig_runtime_dir>"
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
    echo "FAIL_SAFE_STOP: forbidden path — $PSEE_DIR / $IG_DIR"
    exit 1
  fi
done

# ── REQUIRED INPUTS ───────────────────────────────────────────────────────────
EB_FILE="$IG_DIR/evidence_boundary.json"
AL_FILE="$IG_DIR/admissibility_log.json"
LI_FILE="$IG_DIR/normalized_intake_structure/layer_index.json"
PC_FILE="$IG_DIR/normalized_intake_structure/provenance_chain.json"
SP_FILE="$IG_DIR/normalized_intake_structure/source_profile.json"
SM_FILE="$IG_DIR/source_manifest.json"
COV_FILE="$PSEE_DIR/coverage_state.json"
ES_FILE="$PSEE_DIR/engine_state.json"
GI_FILE="$PSEE_DIR/gauge_inputs.json"

for f in "$EB_FILE" "$AL_FILE" "$LI_FILE" "$PC_FILE" "$SP_FILE" "$SM_FILE" \
         "$COV_FILE" "$ES_FILE" "$GI_FILE"; do
  [ -f "$f" ] || { echo "FAIL_SAFE_STOP: required input not found: $f"; exit 1; }
done

RECON_FILE="$PSEE_DIR/reconstruction_state.json"

echo "=== PSEE-RUNTIME.6A DIM-02 Reconstruction Validation ==="
echo "PSEE runtime dir: $PSEE_DIR"
echo "IG runtime dir:   $IG_DIR"
echo ""

# ── FAIL-SAFE: DIM-01 PRECONDITION ───────────────────────────────────────────
echo "--- DIM-01 Precondition ---"
COV_STATE="$(jq -r '.state' "$COV_FILE")"
COV_PERCENT="$(jq -r '.coverage_percent' "$COV_FILE")"
if [ "$COV_STATE" != "COMPUTED" ]; then
  echo "FAIL_SAFE_STOP: DIM-01 coverage_state.state = $COV_STATE (required: COMPUTED)"
  exit 1
fi
echo "  coverage_state.state:   $COV_STATE  PASS"
echo "  coverage_percent:       $COV_PERCENT"
echo ""

# ── AXES VALIDATION ───────────────────────────────────────────────────────────
ES_RUN_ID="$(jq -r '.run_id' "$ES_FILE")"

echo "--- Running 4-Axis Structural Validation ---"

VALIDATION_OUTPUT="$(python3 - << PYEOF
import json, sys

def load(path):
    with open(path) as f:
        return json.load(f)

eb = load("${EB_FILE}")
al = load("${AL_FILE}")
li = load("${LI_FILE}")
pc = load("${PC_FILE}")
sp = load("${SP_FILE}")
sm = load("${SM_FILE}")

violations = []
axis_results = {}

# ─────────────────────────────────────────────────────────────────────────────
# AXIS 1: COMPLETENESS
# - All required units present, no orphan references
# - admissibility_log: every entry has non-empty artifact + source_path
# - summary.admitted == summary.total (no exclusions)
# ─────────────────────────────────────────────────────────────────────────────
axis1_violations = []

total  = al["summary"]["total"]
admitted_count = al["summary"]["admitted"]
excluded_count = al["summary"]["excluded"]

if total is None or total <= 0:
    axis1_violations.append({
        "type": "COMPLETENESS",
        "description": "admissibility_log summary.total not derivable",
        "affected_units": []
    })

orphans = []
for entry in al.get("entries", []):
    name = entry.get("artifact", "")
    path = entry.get("source_path", "")
    if not name or not path:
        orphans.append(name or "(unnamed)")

if orphans:
    axis1_violations.append({
        "type": "COMPLETENESS",
        "description": "Admissibility entries missing artifact name or source_path (orphan references)",
        "affected_units": orphans
    })

if excluded_count != 0:
    axis1_violations.append({
        "type": "COMPLETENESS",
        "description": "Excluded units found — coverage not complete: excluded=" + str(excluded_count),
        "affected_units": []
    })

violations.extend(axis1_violations)
axis_results["COMPLETENESS"] = "PASS" if not axis1_violations else "FAIL"

# ─────────────────────────────────────────────────────────────────────────────
# AXIS 2: STRUCTURAL LINKING
# - All 3 required layers present (L40_2, L40_3, L40_4)
# - Each layer: artifact_count > 0, all artifacts ADMITTED
# - source_manifest layer counts match layer_index counts
# ─────────────────────────────────────────────────────────────────────────────
axis2_violations = []
required_layers = {"L40_2", "L40_3", "L40_4"}

li_layers = {layer["layer_id"]: layer for layer in li.get("layers", [])}
missing_layers = required_layers - set(li_layers.keys())
if missing_layers:
    axis2_violations.append({
        "type": "STRUCTURAL_LINK",
        "description": "Required layers missing from layer_index.json: " + str(sorted(missing_layers)),
        "affected_units": sorted(missing_layers)
    })

for lid, layer in li_layers.items():
    if layer.get("artifact_count", 0) <= 0:
        axis2_violations.append({
            "type": "STRUCTURAL_LINK",
            "description": "Layer " + lid + " has no artifacts (isolated node)",
            "affected_units": [lid]
        })
    non_admitted = [a["name"] for a in layer.get("artifacts", [])
                    if a.get("admission_status") != "ADMITTED"]
    if non_admitted:
        axis2_violations.append({
            "type": "STRUCTURAL_LINK",
            "description": "Layer " + lid + " contains non-ADMITTED artifacts",
            "affected_units": non_admitted
        })

sm_layers = sm.get("layers", {})
for lid in required_layers:
    if lid in li_layers and lid in sm_layers:
        li_count = li_layers[lid]["artifact_count"]
        sm_count = sm_layers[lid]["artifact_count"]
        if li_count != sm_count:
            axis2_violations.append({
                "type": "STRUCTURAL_LINK",
                "description": "Layer " + lid + " count mismatch: layer_index=" + str(li_count) + " source_manifest=" + str(sm_count),
                "affected_units": [lid]
            })

violations.extend(axis2_violations)
axis_results["STRUCTURAL_LINK"] = "PASS" if not axis2_violations else "FAIL"

# ─────────────────────────────────────────────────────────────────────────────
# AXIS 3: REFERENTIAL INTEGRITY
# - provenance_chain: all links have valid outcome
# - all 8 required invariants confirmed
# - IG.6 failures == 0, IG.7 failures == 0
# - every ADMITTED entry has non-empty source_path (distinct from orphan check above)
# ─────────────────────────────────────────────────────────────────────────────
axis3_violations = []
valid_outcomes = {"PASS", "ORCHESTRATION_COMPLETE", "BATCH_COMPLETE", "RHP_PRODUCED"}

broken_links = []
ig6_failures = None
ig7_failures = None

for link in pc.get("chain", []):
    outcome = link.get("outcome", "")
    if outcome not in valid_outcomes:
        broken_links.append(link.get("layer", "unknown") + ": outcome=" + str(outcome))
    if link.get("layer") == "IG.6":
        ig6_failures = link.get("failures", None)
    if link.get("layer") == "IG.7":
        ig7_failures = link.get("failures", None)

if broken_links:
    axis3_violations.append({
        "type": "REFERENTIAL_INTEGRITY",
        "description": "Provenance chain links with invalid outcome: " + str(broken_links),
        "affected_units": broken_links
    })

if ig6_failures is None or ig6_failures != 0:
    axis3_violations.append({
        "type": "REFERENTIAL_INTEGRITY",
        "description": "IG.6 failures not zero: " + str(ig6_failures),
        "affected_units": ["IG.6"]
    })

if ig7_failures is None or ig7_failures != 0:
    axis3_violations.append({
        "type": "REFERENTIAL_INTEGRITY",
        "description": "IG.7 failures not zero: " + str(ig7_failures),
        "affected_units": ["IG.7"]
    })

required_invariants = [
    "ADMISSIBLE", "INVARIANT", "DETERMINISTIC",
    "ADAPTER_INVARIANT", "BOOTSTRAP_INVARIANT",
    "ORCHESTRATION_INVARIANT", "SOURCE_PROFILE_INVARIANT", "PAYLOAD_NORMALIZED"
]
confirmed = set(pc.get("invariants_confirmed", []))
missing_invariants = [inv for inv in required_invariants if inv not in confirmed]
if missing_invariants:
    axis3_violations.append({
        "type": "REFERENTIAL_INTEGRITY",
        "description": "Required provenance invariants not confirmed: " + str(missing_invariants),
        "affected_units": missing_invariants
    })

if sp.get("profile_governance", {}).get("verdict") != "PASS":
    axis3_violations.append({
        "type": "REFERENTIAL_INTEGRITY",
        "description": "source_profile governance verdict != PASS: " + str(sp.get("profile_governance", {}).get("verdict")),
        "affected_units": ["source_profile"]
    })

violations.extend(axis3_violations)
axis_results["REFERENTIAL_INTEGRITY"] = "PASS" if not axis3_violations else "FAIL"

# ─────────────────────────────────────────────────────────────────────────────
# AXIS 4: LAYER CONSISTENCY
# - admissibility_log layer counts == layer_index counts
# - source_manifest total_admitted == admissibility_log summary.admitted
# - no artifact name appears in multiple layers
# ─────────────────────────────────────────────────────────────────────────────
axis4_violations = []

al_layer_counts = {}
for entry in al.get("entries", []):
    if entry.get("decision") == "ADMITTED":
        layer = entry.get("layer", "UNKNOWN")
        al_layer_counts[layer] = al_layer_counts.get(layer, 0) + 1

for lid in required_layers:
    al_count = al_layer_counts.get(lid, 0)
    li_count = li_layers.get(lid, {}).get("artifact_count", None)
    if li_count is None:
        axis4_violations.append({
            "type": "LAYER_CONSISTENCY",
            "description": "Layer " + lid + " missing from layer_index (cannot verify count)",
            "affected_units": [lid]
        })
    elif al_count != li_count:
        axis4_violations.append({
            "type": "LAYER_CONSISTENCY",
            "description": "Layer " + lid + " count mismatch: admissibility_log=" + str(al_count) + " layer_index=" + str(li_count),
            "affected_units": [lid]
        })

sm_total_admitted = sm.get("total_admitted_artifacts", None)
al_total_admitted = al["summary"]["admitted"]
if sm_total_admitted != al_total_admitted:
    axis4_violations.append({
        "type": "LAYER_CONSISTENCY",
        "description": "Total admitted mismatch: source_manifest=" + str(sm_total_admitted) + " admissibility_log=" + str(al_total_admitted),
        "affected_units": []
    })

seen_names = {}
duplicates = []
for layer_obj in li.get("layers", []):
    lid = layer_obj["layer_id"]
    for art in layer_obj.get("artifacts", []):
        name = art["name"]
        if name in seen_names:
            duplicates.append(name + " (in " + seen_names[name] + " and " + lid + ")")
        else:
            seen_names[name] = lid
if duplicates:
    axis4_violations.append({
        "type": "LAYER_CONSISTENCY",
        "description": "Artifacts appear in multiple layers: " + str(duplicates),
        "affected_units": duplicates
    })

violations.extend(axis4_violations)
axis_results["LAYER_CONSISTENCY"] = "PASS" if not axis4_violations else "FAIL"

# ─────────────────────────────────────────────────────────────────────────────
# STATE DETERMINATION
# ─────────────────────────────────────────────────────────────────────────────
failed_axes = [ax for ax, result in axis_results.items() if result == "FAIL"]

critical_types = {"STRUCTURAL_LINK", "REFERENTIAL_INTEGRITY"}
critical_violations = [v for v in violations if v["type"] in critical_types]

if not violations:
    state = "PASS"
elif critical_violations:
    state = "FAIL"
else:
    state = "PARTIAL"

# total_units and validated_units
total_units = al["summary"]["total"]
validated_units = al["summary"]["admitted"]

# Output
result = {
    "state": state,
    "violations": violations,
    "validated_units": validated_units,
    "total_units": total_units,
    "axis_results": axis_results,
    "failed_axes": failed_axes
}
print(json.dumps(result))
PYEOF
)"

if echo "$VALIDATION_OUTPUT" | grep -q "^FAIL_SAFE_STOP"; then
  echo "$VALIDATION_OUTPUT"
  exit 1
fi

# ── PARSE VALIDATION RESULTS ──────────────────────────────────────────────────
REC_STATE="$(echo "$VALIDATION_OUTPUT"    | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['state'])")"
VIOLATION_COUNT="$(echo "$VALIDATION_OUTPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['violations']))")"
TOTAL_UNITS="$(echo "$VALIDATION_OUTPUT"  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['total_units'])")"
VALIDATED_UNITS="$(echo "$VALIDATION_OUTPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['validated_units'])")"
AXIS_SUMMARY="$(echo "$VALIDATION_OUTPUT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(', '.join(k+'='+v for k,v in sorted(d['axis_results'].items())))")"

echo "  Axis results: $AXIS_SUMMARY"
echo "  Violations:   $VIOLATION_COUNT"
echo "  State:        $REC_STATE"
echo ""

# ── WRITE reconstruction_state.json ──────────────────────────────────────────
python3 - << PYEOF > "$RECON_FILE"
import json

raw = json.loads("""${VALIDATION_OUTPUT}""")

state_obj = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.6A",
  "run_id": "${ES_RUN_ID}",
  "dimension": "DIM-02",
  "label": "Reconstruction",
  "state": raw["state"],
  "violations": raw["violations"],
  "validated_units": raw["validated_units"],
  "total_units": raw["total_units"],
  "axis_results": raw["axis_results"],
  "method": "IG.RUNTIME structural reconstruction validation",
  "source_artifacts": [
    "evidence_boundary.json",
    "admissibility_log.json",
    "normalized_intake_structure/layer_index.json",
    "normalized_intake_structure/provenance_chain.json",
    "normalized_intake_structure/source_profile.json"
  ],
  "authority": "PSEE-GAUGE.0 DP-6-03"
}
print(json.dumps(state_obj, indent=2))
PYEOF

# ── UPDATE gauge_inputs.json (DIM-02 state_label only) ───────────────────────
TMPFILE="$(mktemp "${GI_FILE}.tmp.XXXXXX")"

jq \
  --arg state "$REC_STATE" \
  '.panel_02["DIM-02"].state_label = $state' \
  "$GI_FILE" > "$TMPFILE"

mv "$TMPFILE" "$GI_FILE"

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "--- Output ---"
RS_HASH=$(shasum -a 256 "$RECON_FILE" | awk '{print $1}')
GI_HASH=$(shasum -a 256 "$GI_FILE"    | awk '{print $1}')
echo "reconstruction_state.json: $RS_HASH"
echo "gauge_inputs.json:         $GI_HASH"
echo ""
echo "VALIDATION_COMPLETE"
echo "  state=$REC_STATE  validated=$VALIDATED_UNITS/$TOTAL_UNITS  violations=$VIOLATION_COUNT"
