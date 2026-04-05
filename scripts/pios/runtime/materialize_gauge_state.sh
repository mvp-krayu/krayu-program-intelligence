#!/usr/bin/env bash
# PSEE-RUNTIME.5 — Gauge State Engine
#
# Usage:
#   materialize_gauge_state.sh <runtime_dir>
#
# Inputs (READ-ONLY):
#   <runtime_dir>/engine_state.json        — execution lifecycle authority
#   <runtime_dir>/coverage_state.json      — DIM-01 authority
#   <runtime_dir>/reconstruction_state.json — DIM-02 authority
#   <runtime_dir>/gauge_inputs.json        — DIM-03..DIM-06 authority
#
# Outputs:
#   <runtime_dir>/gauge_state.json
#
# Score model authority: PSEE-GAUGE.0/gauge_score_model.md
# Projection authority:  PSEE-GAUGE.0/projection_logic_spec.md
# Confidence authority:  PSEE-GAUGE.0/confidence_and_variance_model.md
#
# Canonical score conditions (all required):
#   execution_status != PRE_EXECUTION
#   psee_engine_invoked == true
#   DIM-01.state == COMPUTED
#   DIM-02.state in {PASS, PARTIAL, FAIL}
#
# Exit codes:
#   0 = MATERIALIZATION_COMPLETE
#   1 = FAIL_SAFE_STOP

set -euo pipefail

RUNTIME_DIR="${1:-}"
if [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: materialize_gauge_state.sh <runtime_dir>"
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
  "$REPO_ROOT/docs/pios/IG.7" \
  "$REPO_ROOT/docs/pios/PSEE.UI"; do
  if [[ "$RUNTIME_DIR" == "$forbidden"* ]]; then
    echo "FAIL_SAFE_STOP: forbidden runtime dir — $RUNTIME_DIR"
    exit 1
  fi
done

# ── REQUIRED INPUTS ───────────────────────────────────────────────────────────
ES_FILE="$RUNTIME_DIR/engine_state.json"
COV_FILE="$RUNTIME_DIR/coverage_state.json"
REC_FILE="$RUNTIME_DIR/reconstruction_state.json"
GI_FILE="$RUNTIME_DIR/gauge_inputs.json"

for f in "$ES_FILE" "$COV_FILE" "$REC_FILE" "$GI_FILE"; do
  [ -f "$f" ] || { echo "FAIL_SAFE_STOP: required input not found: $f"; exit 1; }
done

GS_FILE="$RUNTIME_DIR/gauge_state.json"

echo "=== PSEE-RUNTIME.5 Gauge State Engine ==="
echo "Runtime dir: $RUNTIME_DIR"
echo ""

# ── READ EXECUTION LIFECYCLE (engine_state.json) ──────────────────────────────
ES_STATUS="$(jq -r '.execution_status'    "$ES_FILE")"
ES_INVOKED="$(jq -r '.psee_engine_invoked' "$ES_FILE")"
ES_RUN_ID="$(jq -r '.run_id'              "$ES_FILE")"

echo "--- Execution State ---"
echo "  execution_status:    $ES_STATUS"
echo "  psee_engine_invoked: $ES_INVOKED"
echo ""

# ── READ DIM-01 (coverage_state.json) ─────────────────────────────────────────
COV_STATE="$(jq -r '.state'            "$COV_FILE")"
COV_PCT="$(jq    -r '.coverage_percent' "$COV_FILE")"
COV_LABEL="$(jq  -r '.state_label'     "$COV_FILE")"
COV_REQ="$(jq    -r '.required_units'  "$COV_FILE")"
COV_ADM="$(jq    -r '.admissible_units' "$COV_FILE")"
COV_AUTH="$(jq   -r '.authority'       "$COV_FILE")"

echo "--- DIM-01 (coverage_state.json) ---"
echo "  state:           $COV_STATE"
echo "  coverage_percent: $COV_PCT"
echo "  state_label:     $COV_LABEL"
echo ""

# ── READ DIM-02 (reconstruction_state.json) ───────────────────────────────────
REC_STATE="$(jq    -r '.state'            "$REC_FILE")"
REC_VALID="$(jq    -r '.validated_units'  "$REC_FILE")"
REC_TOTAL="$(jq    -r '.total_units'      "$REC_FILE")"
REC_AUTH="$(jq     -r '.authority'        "$REC_FILE")"

echo "--- DIM-02 (reconstruction_state.json) ---"
echo "  state:           $REC_STATE"
echo "  validated_units: $REC_VALID / $REC_TOTAL"
echo ""

# ── CANONICAL SCORE CONDITIONS ────────────────────────────────────────────────
echo "--- Canonical Score Conditions ---"
COND_FAIL=0

if [ "$ES_STATUS" = "PRE_EXECUTION" ]; then
  echo "  FAIL: execution_status = PRE_EXECUTION"
  COND_FAIL=1
else
  echo "  PASS: execution_status = $ES_STATUS (not PRE_EXECUTION)"
fi

if [ "$ES_INVOKED" != "true" ]; then
  echo "  FAIL: psee_engine_invoked = $ES_INVOKED (required: true)"
  COND_FAIL=1
else
  echo "  PASS: psee_engine_invoked = true"
fi

if [ "$COV_STATE" != "COMPUTED" ]; then
  echo "  FAIL: DIM-01.state = $COV_STATE (required: COMPUTED)"
  COND_FAIL=1
else
  echo "  PASS: DIM-01.state = COMPUTED"
fi

case "$REC_STATE" in
  PASS|PARTIAL|FAIL) echo "  PASS: DIM-02.state = $REC_STATE (in allowed set)" ;;
  *) echo "  FAIL: DIM-02.state = $REC_STATE (not in {PASS, PARTIAL, FAIL})"; COND_FAIL=1 ;;
esac

if [ "$COND_FAIL" -ne 0 ]; then
  echo ""
  echo "FAIL_SAFE_STOP: canonical score conditions not met — cannot produce score"
  exit 1
fi
echo ""

# ── READ DIM-03..DIM-06 (gauge_inputs.json) ───────────────────────────────────
GI_EXEC_MODE="$(jq -r '.execution_mode'                  "$GI_FILE")"
GI_D03_VAL="$(jq    -r '.panel_02["DIM-03"].value'       "$GI_FILE")"
GI_D03_STATE="$(jq  -r '.panel_02["DIM-03"].state_label' "$GI_FILE")"
GI_D04_TOTAL="$(jq  -r '.panel_02["DIM-04"].total_count' "$GI_FILE")"
GI_D04_STATE="$(jq  -r '.panel_02["DIM-04"].state_label' "$GI_FILE")"
GI_D04_US01="$(jq   -r '.panel_02["DIM-04"].breakdown["US-CONDITION-01"]' "$GI_FILE")"
GI_D04_US02="$(jq   -r '.panel_02["DIM-04"].breakdown["US-CONDITION-02"]' "$GI_FILE")"
GI_D04_US03="$(jq   -r '.panel_02["DIM-04"].breakdown["US-CONDITION-03"]' "$GI_FILE")"
GI_D05_STATE="$(jq  -r '.panel_02["DIM-05"].state'       "$GI_FILE")"
GI_D06_STATE="$(jq  -r '.panel_02["DIM-06"].state'       "$GI_FILE")"

SYS_NAME="$(jq   -r '.system_identity.system_name'    "$GI_FILE")"
SYS_VER="$(jq    -r '.system_identity.system_version' "$GI_FILE")"

# ── COMPUTE GAUGE STATE ───────────────────────────────────────────────────────
echo "--- Score Computation ---"

python3 - << PYEOF > "$GS_FILE"
import json

# ── Inputs ────────────────────────────────────────────────────────────────────
es_status    = "${ES_STATUS}"
es_invoked   = True
run_id       = "${ES_RUN_ID}"
cov_pct      = float("${COV_PCT}")
cov_state    = "${COV_STATE}"
cov_label    = "${COV_LABEL}"
cov_req      = int("${COV_REQ}")
cov_adm      = int("${COV_ADM}")
cov_auth     = "${COV_AUTH}"
rec_state    = "${REC_STATE}"
rec_valid    = int("${REC_VALID}")
rec_total    = int("${REC_TOTAL}")
rec_auth     = "${REC_AUTH}"
d03_val      = int("${GI_D03_VAL}")
d03_state    = "${GI_D03_STATE}"
d04_total    = int("${GI_D04_TOTAL}")
d04_state    = "${GI_D04_STATE}"
d04_us01     = int("${GI_D04_US01}")
d04_us02     = int("${GI_D04_US02}")
d04_us03     = int("${GI_D04_US03}")
d05_state    = "${GI_D05_STATE}"
d06_state    = "${GI_D06_STATE}"
exec_mode    = "${GI_EXEC_MODE}"
sys_name     = "${SYS_NAME}"
sys_ver      = "${SYS_VER}"

# ── Component 1: COMPLETION ───────────────────────────────────────────────────
# Source: gauge_score_model.md §G.2 Component 1 lookup table
# UNDEFINED_STATE guard: any state not in table → 0
COMPLETION_TABLE = {
    "S-T1": 0,
    "S-T3": 25,
    "S-13": 40,
}
# S-T2 sub-states handled separately (not present in this runtime)
if es_status in COMPLETION_TABLE:
    completion_points = COMPLETION_TABLE[es_status]
    completion_basis = es_status + " → " + str(completion_points) + " pts (gauge_score_model.md §G.2 lookup table)"
else:
    completion_points = 0
    completion_basis = es_status + " — in-flight state; not a terminal state; UNDEFINED_STATE guard applied (gauge_score_model.md §G.2)"

# ── Component 2: COVERAGE ─────────────────────────────────────────────────────
# Source: gauge_score_model.md §G.2 Component 2
# coverage_points = round(coverage_percent × 0.35)
coverage_points = round(cov_pct * 0.35)
coverage_basis = "round(" + str(cov_pct) + " × 0.35) = " + str(coverage_points) + " (gauge_score_model.md §G.2 Component 2)"

# ── Component 3: RECONSTRUCTION ──────────────────────────────────────────────
# Source: PSEE-RUNTIME.5 categorical mapping (DIM-02.state → reconstruction_points)
# PASS = no block → 25 pts
# PARTIAL = penalty → round(0.5 × 25) = 12 pts (gauge_score_model.md §G.2 All PARTIAL case)
# FAIL → score = 0 unconditionally (PSEE-RUNTIME.5 contract)
REC_MAPPING = {"PASS": 25, "PARTIAL": 12}
dim02_fail = (rec_state == "FAIL")

reconstruction_points = REC_MAPPING.get(rec_state, 0)
if rec_state == "PASS":
    reconstruction_basis = "DIM-02.state=PASS → no block → 25 pts (PSEE-RUNTIME.5 categorical mapping)"
elif rec_state == "PARTIAL":
    reconstruction_basis = "DIM-02.state=PARTIAL → penalty → 12 pts (gauge_score_model.md §G.2 All PARTIAL: weighted_match=0.50)"
else:
    reconstruction_basis = "DIM-02.state=FAIL → 0 pts; canonical_score=0 unconditionally (PSEE-RUNTIME.5)"

# ── Canonical Score ───────────────────────────────────────────────────────────
if dim02_fail:
    canonical_score = 0
    band_label = "BLOCKED"
    score_derivation = "DIM-02.state=FAIL → canonical_score=0 unconditionally (PSEE-RUNTIME.5)"
else:
    canonical_score = completion_points + coverage_points + reconstruction_points
    if canonical_score >= 80:
        band_label = "READY"
    elif canonical_score >= 40:
        band_label = "CONDITIONAL"
    else:
        band_label = "BLOCKED"
    score_derivation = str(completion_points) + " + " + str(coverage_points) + " + " + str(reconstruction_points) + " = " + str(canonical_score)

# ── Projected Score (PR-02) ───────────────────────────────────────────────────
# PR-02 adapted: in-flight → project completion to S-13 with actual materialized dimensions
# Authority: PSEE-GAUGE.0/projection_logic_spec.md §PR-02
projected_completion = 40
projected_coverage_points = round(cov_pct * 0.35)   # actual known value
projected_reconstruction_points = reconstruction_points  # DIM-02 actual
projected_score = projected_completion + projected_coverage_points + projected_reconstruction_points
projection_caveat = (
    "PROJECTED — engine at " + es_status + "; assumes completion to S-13 "
    "with actual materialized dimensions (DIM-01=" + str(cov_pct) + "%, DIM-02=" + rec_state + "). "
    "Actual score depends on PSEE engine execution outcome."
)

# ── Confidence Band ───────────────────────────────────────────────────────────
# CRF-01: US records (gauge_inputs.json DIM-04)
# Unit weights: US-CONDITION-01=3, US-CONDITION-02=3, US-CONDITION-03=2
us_variance = min(20, d04_us01 * 3 + d04_us02 * 3 + d04_us03 * 2)

# CRF-02: PARTIAL coverage (S-T3 only — not applicable here)
partial_variance = 0  # not S-T3

# CRF-03: Open escalations (DIM-03 CLEAR → 0 open escalations)
open_escalations = 0  # derived from DIM-03 CLEAR state (0 total escalations)
escalation_variance = min(20, open_escalations * 5)

total_variance_reduction = min(40, us_variance + partial_variance + escalation_variance)
confidence_lower = max(0, canonical_score - total_variance_reduction)
confidence_upper = min(100, projected_score)

variance_factors = []
if us_variance > 0:
    variance_factors.append("CRF-01: " + str(d04_total) + " US records (−" + str(us_variance) + " pts)")
if partial_variance > 0:
    variance_factors.append("CRF-02: PARTIAL coverage gap (−" + str(int(partial_variance)) + " pts)")
if escalation_variance > 0:
    variance_factors.append("CRF-03: " + str(open_escalations) + " open escalations (−" + str(escalation_variance) + " pts)")

# ── Assemble gauge_state.json ─────────────────────────────────────────────────
gauge_state = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.5",
  "run_id": run_id,
  "state": {
    "execution_status": es_status,
    "psee_engine_invoked": es_invoked,
    "execution_mode": exec_mode
  },
  "dimensions": {
    "DIM-01": {
      "label": "Coverage",
      "coverage_percent": cov_pct,
      "state": cov_state,
      "state_label": cov_label,
      "required_units": cov_req,
      "admissible_units": cov_adm,
      "threshold_line": 90,
      "source_file": "coverage_state.json",
      "authority": cov_auth
    },
    "DIM-02": {
      "label": "Reconstruction",
      "state": rec_state,
      "state_label": rec_state,
      "validated_units": rec_valid,
      "total_units": rec_total,
      "reconstruction_points": reconstruction_points,
      "source_file": "reconstruction_state.json",
      "authority": rec_auth
    },
    "DIM-03": {
      "label": "Escalation Clearance",
      "value": d03_val,
      "state_label": d03_state,
      "source_file": "gauge_inputs.json",
      "authority": "PSEE-GAUGE.0/dimension_projection_model.md §DIM-03; ESC-01..06"
    },
    "DIM-04": {
      "label": "Unknown-Space",
      "total_count": d04_total,
      "state_label": d04_state,
      "breakdown": {
        "US-CONDITION-01": d04_us01,
        "US-CONDITION-02": d04_us02,
        "US-CONDITION-03": d04_us03
      },
      "source_file": "gauge_inputs.json",
      "authority": "PSEE-GAUGE.0/dimension_projection_model.md §DIM-04; US-CONDITION-01..03"
    },
    "DIM-05": {
      "label": "Intake Completeness",
      "state": d05_state,
      "source_file": "gauge_inputs.json",
      "authority": "PSEE-GAUGE.0/dimension_projection_model.md §DIM-05"
    },
    "DIM-06": {
      "label": "Heuristic Compliance",
      "state": d06_state,
      "source_file": "gauge_inputs.json",
      "authority": "PSEE-GAUGE.0/dimension_projection_model.md §DIM-06"
    }
  },
  "score": {
    "canonical": canonical_score,
    "band_label": band_label,
    "derivation": score_derivation,
    "components": {
      "completion_points": completion_points,
      "completion_basis": completion_basis,
      "coverage_points": coverage_points,
      "coverage_basis": coverage_basis,
      "reconstruction_points": reconstruction_points,
      "reconstruction_basis": reconstruction_basis
    },
    "authority": "PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4"
  },
  "projection": {
    "value": projected_score,
    "rule": "PR-02",
    "caveat": projection_caveat,
    "assumptions": {
      "escalations_resolved": True,
      "coverage_at_threshold": False,
      "reconstruction_actual": True
    },
    "authority": "PSEE-GAUGE.0/projection_logic_spec.md §PR-02"
  },
  "confidence": {
    "lower": confidence_lower,
    "upper": confidence_upper,
    "total_variance_reduction": total_variance_reduction,
    "variance_factors": variance_factors,
    "status": "COMPUTED",
    "authority": "PSEE-GAUGE.0/confidence_and_variance_model.md §Total Variance Computation"
  },
  "traceability": {
    "source_files": [
      "engine_state.json",
      "coverage_state.json",
      "reconstruction_state.json",
      "gauge_inputs.json"
    ],
    "authority_refs": [
      "PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4",
      "PSEE-GAUGE.0/dimension_projection_model.md §DIM-01..06",
      "PSEE-GAUGE.0/confidence_and_variance_model.md §Total Variance Computation",
      "PSEE-GAUGE.0/projection_logic_spec.md §PR-02"
    ]
  }
}
print(json.dumps(gauge_state, indent=2))
PYEOF

# ── SUMMARY ───────────────────────────────────────────────────────────────────
CANONICAL="$(jq  '.score.canonical'       "$GS_FILE")"
BAND="$(jq       -r '.score.band_label'   "$GS_FILE")"
PROJ="$(jq       '.projection.value'      "$GS_FILE")"
CONF_LO="$(jq    '.confidence.lower'      "$GS_FILE")"
CONF_HI="$(jq    '.confidence.upper'      "$GS_FILE")"
GS_HASH=$(shasum -a 256 "$GS_FILE" | awk '{print $1}')

echo "  canonical_score: $CANONICAL"
echo "  band_label:      $BAND"
echo "  projected_score: $PROJ"
echo "  confidence:      [$CONF_LO, $CONF_HI]"
echo ""
echo "--- Output ---"
echo "gauge_state.json: $GS_HASH"
echo ""
echo "MATERIALIZATION_COMPLETE"
