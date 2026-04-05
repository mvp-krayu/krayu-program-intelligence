#!/usr/bin/env bash
# PSEE-RUNTIME.1 — Deterministic Runtime Pipeline
#
# Usage:
#   run_psee_pipeline.sh <rhp_input_root> <output_root>
#
# Reads:  <rhp_input_root>/  (IG RHP only — read-only)
# Writes: <output_root>/
#
# Produces:
#   operator_case_view.md   — strict structural projection of RHP (deterministic)
#   execution.log           — timestamped receipt of execution
#   manifest.json           — sha256 hashes of produced files
#
# Determinism rule: operator_case_view.md must produce identical sha256 on repeated runs.
# Fail-safe: any input outside <rhp_input_root> is forbidden.

set -euo pipefail

# ── ARGS ──────────────────────────────────────────────────────────────────────
RHP_ROOT="${1:-}"
OUT_ROOT="${2:-}"

if [ -z "$RHP_ROOT" ] || [ -z "$OUT_ROOT" ]; then
  echo "ERROR: usage: run_psee_pipeline.sh <rhp_input_root> <output_root>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"

# Resolve to absolute paths
[[ "$RHP_ROOT" != /* ]] && RHP_ROOT="$REPO_ROOT/$RHP_ROOT"
[[ "$OUT_ROOT"  != /* ]] && OUT_ROOT="$REPO_ROOT/$OUT_ROOT"

# ── FAIL-SAFE: FORBIDDEN INPUT PATHS ─────────────────────────────────────────
for forbidden in \
  "$REPO_ROOT/docs/pios/IG.5" \
  "$REPO_ROOT/docs/pios/IG.6" \
  "$REPO_ROOT/docs/pios/IG.7" \
  "$REPO_ROOT/docs/pios/PSEE.3" \
  "$REPO_ROOT/docs/pios/PSEE.3B" \
  "$REPO_ROOT/docs/pios/PSEE.UI"; do
  if [[ "$RHP_ROOT" == "$forbidden"* ]]; then
    echo "FAIL_SAFE_STOP: forbidden input path — $RHP_ROOT"
    exit 1
  fi
done

# ── REQUIRED RHP FILES ────────────────────────────────────────────────────────
SOURCE_MANIFEST="$RHP_ROOT/source_manifest.json"
EVIDENCE_BOUNDARY="$RHP_ROOT/evidence_boundary.json"
ADMISSIBILITY_LOG="$RHP_ROOT/admissibility_log.json"
LAYER_INDEX="$RHP_ROOT/normalized_intake_structure/layer_index.json"
SOURCE_PROFILE="$RHP_ROOT/normalized_intake_structure/source_profile.json"
PROVENANCE_CHAIN="$RHP_ROOT/normalized_intake_structure/provenance_chain.json"

for f in \
  "$SOURCE_MANIFEST" \
  "$EVIDENCE_BOUNDARY" \
  "$ADMISSIBILITY_LOG" \
  "$LAYER_INDEX" \
  "$SOURCE_PROFILE" \
  "$PROVENANCE_CHAIN"; do
  [ -f "$f" ] || { echo "FAIL_SAFE_STOP: required RHP file missing: $f"; exit 1; }
done

# ── OUTPUT SETUP ──────────────────────────────────────────────────────────────
mkdir -p "$OUT_ROOT"

OPERATOR_VIEW="$OUT_ROOT/operator_case_view.md"
EXEC_LOG="$OUT_ROOT/execution.log"
MANIFEST="$OUT_ROOT/manifest.json"

EXEC_TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# ── READ RHP FIELDS (deterministic extraction via jq) ────────────────────────
SOURCE_RUN="$(jq -r '.source_run'      "$SOURCE_MANIFEST")"
SM_DATE="$(jq -r '.date'               "$SOURCE_MANIFEST")"
BASELINE="$(jq -r '.baseline_commit'   "$SOURCE_MANIFEST")"
SRC_KIND="$(jq -r '.source.kind'       "$SOURCE_MANIFEST")"
SRC_VER="$(jq -r '.source.version'     "$SOURCE_MANIFEST")"
SRC_ANCHOR="$(jq -r '.source.baseline_anchor' "$SOURCE_MANIFEST")"
SRC_ADMIT="$(jq -r '.source.admissibility'     "$SOURCE_MANIFEST")"
SRC_RES="$(jq -r '.source.resolution'          "$SOURCE_MANIFEST")"

L40_2_COUNT="$(jq -r '.layers.L40_2.artifact_count' "$SOURCE_MANIFEST")"
L40_3_COUNT="$(jq -r '.layers.L40_3.artifact_count' "$SOURCE_MANIFEST")"
L40_4_COUNT="$(jq -r '.layers.L40_4.artifact_count' "$SOURCE_MANIFEST")"
TOTAL_ADMITTED="$(jq -r '.total_admitted_artifacts'  "$SOURCE_MANIFEST")"

L40_2_PATH="$(jq -r '.layers.L40_2.source_path' "$SOURCE_MANIFEST")"
L40_3_PATH="$(jq -r '.layers.L40_3.source_path' "$SOURCE_MANIFEST")"
L40_4_PATH="$(jq -r '.layers.L40_4.source_path' "$SOURCE_MANIFEST")"

L40_2_ARTS="$(jq -r '.layers.L40_2.artifacts[]' "$SOURCE_MANIFEST")"
L40_3_ARTS="$(jq -r '.layers.L40_3.artifacts[]' "$SOURCE_MANIFEST")"
L40_4_ARTS="$(jq -r '.layers.L40_4.artifacts[]' "$SOURCE_MANIFEST")"

ADMITTED_CLASS="$(jq -r '.admitted_input_class.class'           "$EVIDENCE_BOUNDARY")"
ADMITTED_ROOT="$(jq -r '.admitted_input_class.root'             "$EVIDENCE_BOUNDARY")"
BOUNDARY_ENFORCEMENT="$(jq -r '.enforcement'                    "$EVIDENCE_BOUNDARY")"

CHAIN_LEN="$(jq '.chain | length'                               "$PROVENANCE_CHAIN")"
INVARIANTS="$(jq -r '.invariants_confirmed[]'                   "$PROVENANCE_CHAIN" | tr '\n' ' ')"

ORCH_GATE="$(jq -r '.provenance.orchestration_gate'             "$SOURCE_MANIFEST")"
ORCH_DETERMINISM="$(jq -r '.provenance.determinism_confirmed'   "$SOURCE_MANIFEST")"

TOTAL_ADMITTED_LOG="$(jq -r '.summary.total'                    "$ADMISSIBILITY_LOG")"
ADMITTED_LOG="$(jq -r '.summary.admitted'                       "$ADMISSIBILITY_LOG")"
EXCLUDED_LOG="$(jq -r '.summary.excluded'                       "$ADMISSIBILITY_LOG")"
DECISION_BASIS="$(jq -r '.summary.decision_basis'               "$ADMISSIBILITY_LOG")"

# Excluded classes (sorted for determinism)
EXCLUDED_CLASSES="$(jq -r '.excluded_input_classes[].class' "$EVIDENCE_BOUNDARY" | sort)"

# ── PRODUCE: operator_case_view.md (DETERMINISTIC — no timestamps) ────────────
cat > "$OPERATOR_VIEW" << OCVEOF
# PSEE Runtime — Operator Case View

stream: PSEE-RUNTIME.1
run_id: run_01
source_date: ${SM_DATE}
source_run: ${SOURCE_RUN}
baseline_commit: ${BASELINE}
rhp_root: ${ADMITTED_ROOT}

---

## System Identity

| Field | Value |
|---|---|
| source_kind | ${SRC_KIND} |
| version | ${SRC_VER} |
| baseline_anchor | ${SRC_ANCHOR} |
| admissibility | ${SRC_ADMIT} |
| resolution | ${SRC_RES} |

---

## Runtime State

| Field | Value |
|---|---|
| current_state | PENDING_PSEE_EXECUTION |
| execution_mode | FULL |
| psee_engine_run | NO |

PANEL-01 (Primary Score): PENDING — PSEE engine not yet executed
PANEL-02 (Dimensions):    PENDING — PSEE engine not yet executed
PANEL-03 (Review Surface): PENDING — PSEE engine not yet executed
PANEL-04 (Portfolio): 1 run registered — scores PENDING

---

## Evidence Layer Summary

total_admitted: ${TOTAL_ADMITTED}
total_excluded: 0
decision_basis: ${DECISION_BASIS}

### L40_2 — Evidence Layer

source_path: ${L40_2_PATH}
artifact_count: ${L40_2_COUNT}
admission_status: ADMITTED

OCVEOF

while IFS= read -r art; do
  echo "- ${art}" >> "$OPERATOR_VIEW"
done <<< "$L40_2_ARTS"

cat >> "$OPERATOR_VIEW" << OCVEOF

### L40_3 — Structural Layer

source_path: ${L40_3_PATH}
artifact_count: ${L40_3_COUNT}
admission_status: ADMITTED

OCVEOF

while IFS= read -r art; do
  echo "- ${art}" >> "$OPERATOR_VIEW"
done <<< "$L40_3_ARTS"

cat >> "$OPERATOR_VIEW" << OCVEOF

### L40_4 — Telemetry Layer

source_path: ${L40_4_PATH}
artifact_count: ${L40_4_COUNT}
admission_status: ADMITTED

OCVEOF

while IFS= read -r art; do
  echo "- ${art}" >> "$OPERATOR_VIEW"
done <<< "$L40_4_ARTS"

cat >> "$OPERATOR_VIEW" << OCVEOF

---

## Execution Boundary

admitted_input_class: ${ADMITTED_CLASS}
enforcement: ${BOUNDARY_ENFORCEMENT}

### Excluded Input Classes

OCVEOF

while IFS= read -r cls; do
  echo "- ${cls}" >> "$OPERATOR_VIEW"
done <<< "$EXCLUDED_CLASSES"

cat >> "$OPERATOR_VIEW" << OCVEOF

---

## Provenance Chain

chain_length: ${CHAIN_LEN}
orchestration_gate: ${ORCH_GATE}
determinism_confirmed: ${ORCH_DETERMINISM}

### Invariants Confirmed

OCVEOF

jq -r '.invariants_confirmed[]' "$PROVENANCE_CHAIN" | sort | while IFS= read -r inv; do
  echo "- ${inv}" >> "$OPERATOR_VIEW"
done

cat >> "$OPERATOR_VIEW" << OCVEOF

---

## Intake Summary

| Metric | Value |
|---|---|
| Total artifacts evaluated | ${TOTAL_ADMITTED_LOG} |
| Admitted | ${ADMITTED_LOG} |
| Excluded | ${EXCLUDED_LOG} |
OCVEOF

# ── PRODUCE: execution.log ─────────────────────────────────────────────────────
FILES_CONSUMED="source_manifest.json evidence_boundary.json admissibility_log.json normalized_intake_structure/layer_index.json normalized_intake_structure/source_profile.json normalized_intake_structure/provenance_chain.json"
FILES_WRITTEN="operator_case_view.md execution.log manifest.json"

cat > "$EXEC_LOG" << EOFLOG
=== PSEE-RUNTIME.1 Execution Log ===
timestamp:     ${EXEC_TIMESTAMP}
branch:        ${BRANCH}
input_root:    ${RHP_ROOT}
output_root:   ${OUT_ROOT}

files_consumed:
EOFLOG

for f in $FILES_CONSUMED; do
  echo "  ${RHP_ROOT}/${f}" >> "$EXEC_LOG"
done

cat >> "$EXEC_LOG" << EOFLOG

files_written:
EOFLOG

for f in $FILES_WRITTEN; do
  echo "  ${OUT_ROOT}/${f}" >> "$EXEC_LOG"
done

echo "" >> "$EXEC_LOG"
echo "exit_status:   0" >> "$EXEC_LOG"
echo "outcome:       RUNTIME_COMPLETE" >> "$EXEC_LOG"

# ── PRODUCE: manifest.json (sha256 of deterministic output files) ──────────────
sha256() {
  shasum -a 256 "$1" | awk '{print $1}'
}

OCV_HASH="$(sha256 "$OPERATOR_VIEW")"
MANIFEST_CONTENT="{
  \"schema_version\": \"1.0\",
  \"stream\": \"PSEE-RUNTIME.1\",
  \"run_id\": \"run_01\",
  \"output_root\": \"${OUT_ROOT}\",
  \"files\": {
    \"operator_case_view.md\": {
      \"path\": \"${OPERATOR_VIEW}\",
      \"sha256\": \"${OCV_HASH}\"
    }
  },
  \"determinism_check_field\": \"operator_case_view.md\"
}"

echo "$MANIFEST_CONTENT" > "$MANIFEST"

echo ""
echo "=== PSEE-RUNTIME.1 Pipeline ==="
echo "Output:   $OUT_ROOT"
echo "Files:"
echo "  operator_case_view.md  sha256=${OCV_HASH}"
echo ""
echo "RUNTIME_COMPLETE"
