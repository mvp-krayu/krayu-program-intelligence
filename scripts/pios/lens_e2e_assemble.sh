#!/usr/bin/env bash
# lens_e2e_assemble.sh — LENS E2E assembly, validation and controlled execution
# PI.LENS.REAL-E2E-PIPELINE-ASSEMBLY.01
# PI.LENS.REAL-E2E-PIPELINE.EXECUTION-MODE.01
#
# Usage:
#   bash scripts/pios/lens_e2e_assemble.sh \
#     --client <client> --source <source> --run <run> --mode validate|execute
#
# Modes:
#   validate  — check all 9 stage outputs; report readiness; do NOT execute pipeline
#   execute   — run each stage's known callable producer; classify blocked stages explicitly
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

CLIENT=""
SOURCE=""
RUN=""
MODE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --client) CLIENT="$2"; shift 2 ;;
    --source) SOURCE="$2"; shift 2 ;;
    --run)    RUN="$2";    shift 2 ;;
    --mode)   MODE="$2";   shift 2 ;;
    *) echo "ERROR: unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$CLIENT" || -z "$SOURCE" || -z "$RUN" || -z "$MODE" ]]; then
  echo "ERROR: --client, --source, --run, and --mode are required" >&2
  exit 1
fi

if [[ "$MODE" != "validate" && "$MODE" != "execute" ]]; then
  echo "ERROR: unsupported mode '$MODE' — supported modes: validate, execute" >&2
  exit 1
fi

# ── VALIDATE MODE ─────────────────────────────────────────────────────────────

RUN_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$RUN"
SOURCE_DIR="$REPO_ROOT/clients/$CLIENT/sources/$SOURCE"
SCRIPTS_DIR="$REPO_ROOT/scripts/pios"

declare -A STAGE_STATUS
declare -A STAGE_DETAIL

# ── STAGE 01: Source Manifest ─────────────────────────────────────────────────
S01_MANIFEST="$SOURCE_DIR/source_manifest.json"
if [[ -f "$S01_MANIFEST" ]]; then
  STAGE_STATUS[01]="READY_CALLABLE"
  STAGE_DETAIL[01]="$S01_MANIFEST present; producer: source_intake.py"
else
  STAGE_STATUS[01]="MISSING_INPUT"
  STAGE_DETAIL[01]="$S01_MANIFEST absent"
fi

# ── STAGE 02: Intake Output ───────────────────────────────────────────────────
S02_DIR="$RUN_DIR/intake"
if [[ -d "$S02_DIR" ]]; then
  STAGE_STATUS[02]="READY_CALLABLE"
  STAGE_DETAIL[02]="$S02_DIR present; producer: source_intake.py"
else
  STAGE_STATUS[02]="MISSING_INPUT"
  STAGE_DETAIL[02]="$S02_DIR absent — intake not run for $RUN; producer: source_intake.py PRESENT"
fi

# ── STAGE 03: Structure (40.x canonical topology) ────────────────────────────
S03_FILE="$RUN_DIR/vault/canonical_topology.json"
S03_ALT="$RUN_DIR/semantic/topology/canonical_topology.json"
if [[ -f "$S03_FILE" || -f "$S03_ALT" ]]; then
  STAGE_STATUS[03]="READY_LOCKED_REFERENCE"
  STAGE_DETAIL[03]="canonical_topology.json present (vault or semantic/topology); producer: structural_scanner.py"
else
  STAGE_STATUS[03]="MISSING_INPUT"
  STAGE_DETAIL[03]="canonical_topology.json absent in $RUN_DIR; producer: structural_scanner.py PRESENT"
fi

# ── STAGE 04: CEU Grounding ───────────────────────────────────────────────────
S04_DIR="$RUN_DIR/ceu"
if [[ -d "$S04_DIR" ]]; then
  STAGE_STATUS[04]="READY_CALLABLE"
  STAGE_DETAIL[04]="$S04_DIR present; producer: ceu_grounding.py"
else
  STAGE_STATUS[04]="MISSING_INPUT"
  STAGE_DETAIL[04]="$S04_DIR absent — CEU grounding not run for $RUN; producer: ceu_grounding.py PRESENT"
fi

# ── STAGE 05: DOM Layer ───────────────────────────────────────────────────────
S05_FILE=$(find "$RUN_DIR" -name "dom_layer.json" 2>/dev/null | head -1)
if [[ -n "$S05_FILE" ]]; then
  STAGE_STATUS[05]="READY_CALLABLE"
  STAGE_DETAIL[05]="dom_layer.json found at $S05_FILE; producer: dom_layer_generator.py"
else
  STAGE_STATUS[05]="MISSING_INPUT"
  STAGE_DETAIL[05]="dom_layer.json absent in $RUN_DIR; producer: dom_layer_generator.py PRESENT"
fi

# ── STAGE 06: Vault + 41.x Pipeline Output ───────────────────────────────────
S06_VAULT="$RUN_DIR/vault"
S06_41X="$RUN_DIR/41.x"
if [[ -d "$S06_VAULT" && -d "$S06_41X" ]]; then
  STAGE_STATUS[06]="READY_LOCKED_REFERENCE"
  STAGE_DETAIL[06]="vault/ and 41.x/ present under $RUN; producer: run_client_pipeline.py"
else
  # Check for vault in any sibling run under same client
  VAULT_FOUND=$(find "$REPO_ROOT/clients/$CLIENT/psee/runs" -maxdepth 3 -name "vault_manifest.json" 2>/dev/null | head -1)
  if [[ -n "$VAULT_FOUND" ]]; then
    ALT_RUN="$(basename "$(dirname "$(dirname "$VAULT_FOUND")")")"
    STAGE_STATUS[06]="READY_LOCKED_REFERENCE"
    STAGE_DETAIL[06]="vault present in alternate run ($ALT_RUN); 41.x absent from $RUN — locked reference only; producer: run_client_pipeline.py"
  else
    STAGE_STATUS[06]="MISSING_INPUT"
    STAGE_DETAIL[06]="vault/ absent in $RUN and no sibling vault found; producer: run_client_pipeline.py PRESENT"
  fi
fi

# ── STAGE 07: Semantic Bundle ─────────────────────────────────────────────────
S07_MANIFEST="$RUN_DIR/semantic/semantic_bundle_manifest.json"
if [[ -f "$S07_MANIFEST" ]]; then
  STAGE_STATUS[07]="READY_LOCKED_REFERENCE"
  STAGE_DETAIL[07]="semantic_bundle_manifest.json present; producer: lens_report_generator.py"
else
  STAGE_STATUS[07]="MISSING_INPUT"
  STAGE_DETAIL[07]="semantic_bundle_manifest.json absent in $RUN_DIR/semantic/; producer: lens_report_generator.py PRESENT"
fi

# ── STAGE 08: Reports ─────────────────────────────────────────────────────────
S08_DIR="$RUN_DIR/reports"
S08_T1="$S08_DIR/lens_tier1_evidence_brief.html"
S08_GEN="$SCRIPTS_DIR/lens_generate.sh"
if [[ -f "$S08_T1" && -f "$S08_GEN" ]]; then
  STAGE_STATUS[08]="READY_CALLABLE"
  STAGE_DETAIL[08]="lens_tier1_evidence_brief.html present; lens_generate.sh present; producers: lens_generate.sh + lens_report_generator.py"
else
  STAGE_STATUS[08]="MISSING_INPUT"
  STAGE_DETAIL[08]="reports incomplete under $S08_DIR or lens_generate.sh absent"
fi

# ── STAGE 09: Runtime ─────────────────────────────────────────────────────────
S09_LENS="$REPO_ROOT/app/gauge-product/pages/lens.js"
S09_WS="$REPO_ROOT/app/gauge-product/pages/tier2/workspace.js"
if [[ -f "$S09_LENS" && -f "$S09_WS" ]]; then
  STAGE_STATUS[09]="READY_CALLABLE"
  STAGE_DETAIL[09]="lens.js and workspace.js present; producer: lens_demo.sh"
else
  STAGE_STATUS[09]="MISSING_INPUT"
  STAGE_DETAIL[09]="runtime pages absent; check app/gauge-product/pages/"
fi

# ── OVERALL STATUS ────────────────────────────────────────────────────────────
OVERALL="READY"
for STAGE in 01 02 03 04 05 06 07 08 09; do
  S="${STAGE_STATUS[$STAGE]}"
  if [[ "$S" == "MISSING_INPUT" || "$S" == "MISSING_PRODUCER" || "$S" == "BLOCKED" ]]; then
    OVERALL="PARTIAL"
  fi
done

# ── OUTPUT ────────────────────────────────────────────────────────────────────
echo ""
echo "  LENS E2E ASSEMBLY — VALIDATE MODE"
echo "  ==================================="
echo "  client:  $CLIENT"
echo "  source:  $SOURCE"
echo "  run:     $RUN"
echo ""
printf "  %-8s %-32s %s\n" "STAGE" "STATUS" "DETAIL"
printf "  %-8s %-32s %s\n" "-----" "------" "------"
for STAGE in 01 02 03 04 05 06 07 08 09; do
  printf "  STAGE %s  %-32s %s\n" "$STAGE" "${STAGE_STATUS[$STAGE]}" "${STAGE_DETAIL[$STAGE]}"
done
echo ""
echo "  OVERALL STATUS: $OVERALL"
echo ""

if [[ "$MODE" == "validate" ]]; then
  exit 0
fi

# ── EXECUTE MODE ──────────────────────────────────────────────────────────────
#
# Execution run is isolated from canonical demo run to protect canonical reports.
# Stage 00 (source_extract.py) extracts archive to canonical_repo before intake.
#   PI.LENS.REAL-E2E-PIPELINE.BLOCKER-07-CLOSURE.01 — BLOCKER-07 closed.
# Stage 08 uses explicit vault/semantic/report mapping via lens_report_generator.py.
#   semantic = LOCKED_REFERENCE_INPUT from run_blueedge_productized_01_fixed (never copied).

EXECUTE_RUN_ID="run_blueedge_e2e_execute_01"
EXEC_RUN_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$EXECUTE_RUN_ID"
CANONICAL_RUN_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$RUN"

# ── RUNTIME MAPPING (PI.LENS.REAL-E2E-PIPELINE.FINAL-IDEMPOTENCY-AND-RUNTIME-MAPPING.01) ──
# vault_run  = EXECUTE_RUN_ID (produced by this E2E run)
# semantic   = LOCKED_REFERENCE_INPUT from productized fixed run (read-only, never copied)
# report_run = EXECUTE_RUN_ID (reports written here, not to canonical)
SEMANTIC_RUN_ID="run_blueedge_productized_01_fixed"
EXEC_SEMANTIC_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$SEMANTIC_RUN_ID/semantic"
EXEC_REPORT_DIR="$EXEC_RUN_DIR/reports"

declare -A EXEC_STATUS
declare -A EXEC_EXIT
declare -A EXEC_NOTES

# ── EXECUTE STAGE 00: Source Extraction ───────────────────────────────────────
# Extract archive to canonical_repo if not already present (idempotent via --allow-existing).
echo ""
echo "  [STAGE 00] Source extraction — source_extract.py"
EXEC_EXIT[00]=0
EXEC_CANONICAL_REPO="$EXEC_RUN_DIR/intake/canonical_repo"
if [[ -d "$EXEC_CANONICAL_REPO" ]]; then
  EXEC_STATUS[00]="VALIDATED_ONLY"
  EXEC_NOTES[00]="canonical_repo already present at $EXECUTE_RUN_ID/intake/canonical_repo; extraction skipped"
  echo "  canonical_repo already present — skipping extraction"
else
  python3 "$SCRIPTS_DIR/source_extract.py" \
    --client "$CLIENT" --source "$SOURCE" --run-id "$EXECUTE_RUN_ID" \
    || EXEC_EXIT[00]=$?
  if [[ ${EXEC_EXIT[00]} -eq 0 ]]; then
    EXEC_STATUS[00]="EXECUTED"
    EXEC_NOTES[00]="source_extract.py exited 0; canonical_repo written to $EXECUTE_RUN_ID/intake/canonical_repo"
  else
    EXEC_STATUS[00]="BLOCKED_STAGE_FAILURE"
    EXEC_NOTES[00]="source_extract.py exited ${EXEC_EXIT[00]}; extraction failed"
  fi
fi

# ── EXECUTE STAGE 01: Source Registration (validate-only) ─────────────────────
if [[ ${EXEC_EXIT[00]} -ne 0 ]]; then
  EXEC_STATUS[01]="NOT_ATTEMPTED"
  EXEC_EXIT[01]=-1
  EXEC_NOTES[01]="skipped — stage 00 (extraction) failed"
else
  echo ""
  echo "  [STAGE 01] Source registration — validate-only"
  EXEC_EXIT[01]=0
  python3 "$SCRIPTS_DIR/source_intake.py" \
    --client "$CLIENT" --source "$SOURCE" --run-id "$EXECUTE_RUN_ID" \
    --validate-only \
    || EXEC_EXIT[01]=$?
  if [[ ${EXEC_EXIT[01]} -eq 0 ]]; then
    EXEC_STATUS[01]="VALIDATED_ONLY"
    EXEC_NOTES[01]="source_intake.py --validate-only exited 0; source boundary and inventory confirmed"
  else
    EXEC_STATUS[01]="BLOCKED_STAGE_FAILURE"
    EXEC_NOTES[01]="source_intake.py --validate-only exited ${EXEC_EXIT[01]}"
  fi
fi

# ── EXECUTE STAGE 02: Intake ───────────────────────────────────────────────────
# Idempotent: if intake artifacts already present, run validate-only; do not rerun write mode.
if [[ ${EXEC_EXIT[01]} -ne 0 ]]; then
  EXEC_STATUS[02]="NOT_ATTEMPTED"
  EXEC_EXIT[02]=-1
  EXEC_NOTES[02]="skipped — stage 01 failed"
else
  echo ""
  echo "  [STAGE 02] Intake — source_intake.py"
  EXEC_INTAKE_MANIFEST="$EXEC_RUN_DIR/intake/intake_manifest.json"
  EXEC_INTAKE_INVENTORY="$EXEC_RUN_DIR/intake/source_inventory.json"
  EXEC_INTAKE_BOUNDARY="$EXEC_RUN_DIR/intake/source_boundary_validation.json"
  if [[ -f "$EXEC_INTAKE_MANIFEST" && -f "$EXEC_INTAKE_INVENTORY" && -f "$EXEC_INTAKE_BOUNDARY" ]]; then
    EXEC_EXIT[02]=0
    python3 "$SCRIPTS_DIR/source_intake.py" \
      --client "$CLIENT" --source "$SOURCE" --run-id "$EXECUTE_RUN_ID" \
      --validate-only \
      || EXEC_EXIT[02]=$?
    if [[ ${EXEC_EXIT[02]} -eq 0 ]]; then
      EXEC_STATUS[02]="VALIDATED_ONLY"
      EXEC_NOTES[02]="intake artifacts already present; validate-only PASS; CREATE_ONLY respected"
    else
      EXEC_STATUS[02]="BLOCKED_STAGE_FAILURE"
      EXEC_NOTES[02]="intake artifacts present but validate-only exited ${EXEC_EXIT[02]}"
    fi
  else
    EXEC_EXIT[02]=0
    python3 "$SCRIPTS_DIR/source_intake.py" \
      --client "$CLIENT" --source "$SOURCE" --run-id "$EXECUTE_RUN_ID" \
      || EXEC_EXIT[02]=$?
    if [[ ${EXEC_EXIT[02]} -eq 0 ]]; then
      EXEC_STATUS[02]="EXECUTED"
      EXEC_NOTES[02]="source_intake.py exited 0; intake artifacts written to $EXECUTE_RUN_ID/intake/"
    else
      EXEC_STATUS[02]="BLOCKED_STAGE_FAILURE"
      EXEC_NOTES[02]="source_intake.py exited ${EXEC_EXIT[02]}"
    fi
  fi
fi

# ── EXECUTE STAGE 03: Structure (40.x) ────────────────────────────────────────
if [[ ${EXEC_EXIT[02]} -ne 0 ]]; then
  EXEC_STATUS[03]="NOT_ATTEMPTED"
  EXEC_EXIT[03]=-1
  EXEC_NOTES[03]="skipped — stage 02 failed or not attempted"
else
  echo ""
  echo "  [STAGE 03] Structure — structural_scanner.py"
  S03_STRUCT_40_2="$EXEC_RUN_DIR/structure/40.2/structural_node_inventory.json"
  S03_STRUCT_40_3="$EXEC_RUN_DIR/structure/40.3/structural_topology_log.json"
  S03_STRUCT_40_4="$EXEC_RUN_DIR/structure/40.4/canonical_topology.json"
  if [[ -f "$S03_STRUCT_40_2" && -f "$S03_STRUCT_40_3" && -f "$S03_STRUCT_40_4" ]]; then
    EXEC_STATUS[03]="VALIDATED_ONLY"
    EXEC_EXIT[03]=0
    EXEC_NOTES[03]="structure artifacts present — skipping WRITE, validation assumed"
    echo "  [IDEMPOTENT] structure artifacts present — skipping WRITE, validation assumed"
  else
    EXEC_EXIT[03]=0
    python3 "$SCRIPTS_DIR/structural_scanner.py" \
      --client "$CLIENT" --source "$SOURCE" --run-id "$EXECUTE_RUN_ID" \
      || EXEC_EXIT[03]=$?
    if [[ ${EXEC_EXIT[03]} -eq 0 ]]; then
      EXEC_STATUS[03]="EXECUTED"
      EXEC_NOTES[03]="structural_scanner.py exited 0; structure/40.x/ artifacts written"
    else
      EXEC_STATUS[03]="BLOCKED_STAGE_FAILURE"
      EXEC_NOTES[03]="structural_scanner.py exited ${EXEC_EXIT[03]}"
    fi
  fi
fi

# ── EXECUTE STAGE 04: CEU Grounding ───────────────────────────────────────────
if [[ ${EXEC_EXIT[03]} -ne 0 ]]; then
  EXEC_STATUS[04]="NOT_ATTEMPTED"
  EXEC_EXIT[04]=-1
  EXEC_NOTES[04]="skipped — stage 03 failed or not attempted"
else
  echo ""
  echo "  [STAGE 04] CEU grounding — ceu_grounding.py"
  EXEC_CEU_GROUNDING="$EXEC_RUN_DIR/ceu/grounding_state_v3.json"
  if [[ -f "$EXEC_CEU_GROUNDING" ]]; then
    EXEC_STATUS[04]="VALIDATED_ONLY"
    EXEC_EXIT[04]=0
    EXEC_NOTES[04]="ceu/grounding_state_v3.json present — skipping WRITE; CREATE_ONLY respected"
    echo "  [IDEMPOTENT] CEU grounding present — skipping WRITE"
  else
    EXEC_EXIT[04]=0
    python3 "$SCRIPTS_DIR/ceu_grounding.py" \
      --client "$CLIENT" --run-id "$EXECUTE_RUN_ID" \
      || EXEC_EXIT[04]=$?
    if [[ ${EXEC_EXIT[04]} -eq 0 ]]; then
      EXEC_STATUS[04]="EXECUTED"
      EXEC_NOTES[04]="ceu_grounding.py exited 0; ceu/grounding_state_v3.json written"
    else
      EXEC_STATUS[04]="BLOCKED_STAGE_FAILURE"
      EXEC_NOTES[04]="ceu_grounding.py exited ${EXEC_EXIT[04]}"
    fi
  fi
fi

# ── EXECUTE STAGE 05: DOM Layer ────────────────────────────────────────────────
if [[ ${EXEC_EXIT[03]} -ne 0 || ${EXEC_EXIT[04]} -ne 0 ]]; then
  EXEC_STATUS[05]="NOT_ATTEMPTED"
  EXEC_EXIT[05]=-1
  EXEC_NOTES[05]="skipped — stage 03 or 04 failed or not attempted"
else
  echo ""
  echo "  [STAGE 05] DOM layer — dom_layer_generator.py"
  EXEC_DOM_LAYER="$EXEC_RUN_DIR/dom/dom_layer.json"
  if [[ -f "$EXEC_DOM_LAYER" ]]; then
    EXEC_STATUS[05]="VALIDATED_ONLY"
    EXEC_EXIT[05]=0
    EXEC_NOTES[05]="dom_layer.json already present at $EXECUTE_RUN_ID/dom/dom_layer.json; generation skipped"
    echo "  dom_layer.json already present — skipping generation"
  else
    EXEC_EXIT[05]=0
    python3 "$SCRIPTS_DIR/dom_layer_generator.py" \
      --client "$CLIENT" --source "$SOURCE" --run-id "$EXECUTE_RUN_ID" \
      || EXEC_EXIT[05]=$?
    if [[ ${EXEC_EXIT[05]} -eq 0 ]]; then
      EXEC_STATUS[05]="EXECUTED"
      EXEC_NOTES[05]="dom_layer_generator.py exited 0; dom/dom_layer.json written"
    else
      EXEC_STATUS[05]="BLOCKED_STAGE_FAILURE"
      EXEC_NOTES[05]="dom_layer_generator.py exited ${EXEC_EXIT[05]}"
    fi
  fi
fi

# ── EXECUTE STAGE 06: 75.x / 41.x Pipeline ────────────────────────────────────
# BLOCKER-02 resolved: run_client_pipeline.py phases 2-4 now use CLIENT_RUN path fallback.
# All FastAPI conformance artifacts present as of PI.BLUEEDGE.FASTAPI-CONFORMANCE.ARTIFACT-SWEEP.01.
echo ""
echo "  [STAGE 06] Pipeline — run_client_pipeline.py"
EXEC_EXIT[06]=0
python3 "$SCRIPTS_DIR/run_client_pipeline.py" \
  --client "$CLIENT" --source "$SOURCE" --run-id "$EXECUTE_RUN_ID" \
  || EXEC_EXIT[06]=$?
if [[ ${EXEC_EXIT[06]} -eq 0 ]]; then
  EXEC_STATUS[06]="EXECUTED"
  EXEC_NOTES[06]="run_client_pipeline.py exited 0; vault and pipeline outputs written"
else
  EXEC_STATUS[06]="BLOCKED_STAGE_FAILURE"
  EXEC_NOTES[06]="run_client_pipeline.py exited ${EXEC_EXIT[06]}"
fi

# ── EXECUTE STAGE 07: Semantic Bundle (locked reference) ──────────────────────
echo ""
echo "  [STAGE 07] Semantic bundle — READY_LOCKED_REFERENCE"
S07_MANIFEST="$EXEC_SEMANTIC_DIR/semantic_bundle_manifest.json"
if [[ -f "$S07_MANIFEST" ]]; then
  EXEC_STATUS[07]="READY_LOCKED_REFERENCE"
  EXEC_EXIT[07]=0
  EXEC_NOTES[07]="semantic_bundle_manifest.json present in $SEMANTIC_RUN_ID; LOCKED_REFERENCE_INPUT; no copy"
  echo "  [LOCKED_REFERENCE] semantic bundle from $SEMANTIC_RUN_ID"
else
  EXEC_STATUS[07]="BLOCKED_STAGE_FAILURE"
  EXEC_EXIT[07]=1
  EXEC_NOTES[07]="semantic_bundle_manifest.json absent in $SEMANTIC_RUN_ID ($EXEC_SEMANTIC_DIR)"
fi

# ── EXECUTE STAGE 08: Reports ─────────────────────────────────────────────────
# lens_report_generator.py called with explicit vault/semantic/report mapping.
# vault = EXEC_RUN_DIR/vault (produced by stage 06)
# semantic = EXEC_SEMANTIC_DIR (LOCKED_REFERENCE_INPUT from productized fixed run, read-only)
# reports written to EXEC_REPORT_DIR (execution run only; canonical reports untouched)
echo ""
echo "  [STAGE 08] Reports — lens_report_generator.py (explicit mapping)"
EXEC_VAULT_FOR_EXEC="$EXEC_RUN_DIR/vault"
if [[ ${EXEC_EXIT[07]} -ne 0 ]]; then
  EXEC_STATUS[08]="NOT_ATTEMPTED"
  EXEC_EXIT[08]=-1
  EXEC_NOTES[08]="skipped — stage 07 (semantic locked reference) failed"
elif [[ ! -d "$EXEC_VAULT_FOR_EXEC" ]]; then
  EXEC_STATUS[08]="BLOCKED_STAGE_FAILURE"
  EXEC_EXIT[08]=-1
  EXEC_NOTES[08]="vault absent from $EXECUTE_RUN_ID — stage 06 must succeed first"
else
  EXEC_EXIT[08]=0
  python3 "$SCRIPTS_DIR/lens_report_generator.py" \
    --client "$CLIENT" \
    --run-id "$EXECUTE_RUN_ID" \
    --package-dir "$EXEC_VAULT_FOR_EXEC" \
    --semantic-bundle-dir "$EXEC_SEMANTIC_DIR" \
    --output-dir "$EXEC_REPORT_DIR" \
    || EXEC_EXIT[08]=$?
  if [[ ${EXEC_EXIT[08]} -eq 0 ]]; then
    EXEC_STATUS[08]="EXECUTED"
    EXEC_NOTES[08]="lens_report_generator.py exited 0; reports written to $EXECUTE_RUN_ID/reports/ using semantic from $SEMANTIC_RUN_ID"
  else
    EXEC_STATUS[08]="BLOCKED_STAGE_FAILURE"
    EXEC_NOTES[08]="lens_report_generator.py exited ${EXEC_EXIT[08]}; renderer/data mismatch — renderer NOT patched"
  fi
fi

# ── EXECUTE STAGE 09: Runtime Package Validation ──────────────────────────────
# vault from execution run; semantic from locked reference run; reports from execution run.
echo ""
echo "  [STAGE 09] Runtime package — validate"
S09_LENS="$REPO_ROOT/app/gauge-product/pages/lens.js"
S09_WS="$REPO_ROOT/app/gauge-product/pages/tier2/workspace.js"
S09_DEMO="$SCRIPTS_DIR/lens_demo.sh"
S09_PASS=true
S09_NOTES=()
[[ -f "$S09_LENS" ]]                      || { S09_PASS=false; S09_NOTES+=("lens.js absent"); }
[[ -f "$S09_WS" ]]                        || { S09_PASS=false; S09_NOTES+=("workspace.js absent"); }
[[ -f "$S09_DEMO" ]]                      || { S09_PASS=false; S09_NOTES+=("lens_demo.sh absent"); }
[[ -d "$EXEC_VAULT_FOR_EXEC" ]]           || { S09_PASS=false; S09_NOTES+=("vault/ absent in $EXECUTE_RUN_ID"); }
[[ -d "$EXEC_SEMANTIC_DIR" ]]             || { S09_PASS=false; S09_NOTES+=("semantic/ absent in $SEMANTIC_RUN_ID"); }
[[ -f "$EXEC_REPORT_DIR/lens_tier1_evidence_brief.html" ]]      || { S09_PASS=false; S09_NOTES+=("lens_tier1_evidence_brief.html absent"); }
[[ -f "$EXEC_REPORT_DIR/lens_tier1_narrative_brief.html" ]]     || { S09_PASS=false; S09_NOTES+=("lens_tier1_narrative_brief.html absent"); }
[[ -f "$EXEC_REPORT_DIR/lens_tier2_diagnostic_narrative.html" ]] || { S09_PASS=false; S09_NOTES+=("lens_tier2_diagnostic_narrative.html absent"); }
[[ -f "$EXEC_REPORT_DIR/lens_decision_surface.html" ]]          || { S09_PASS=false; S09_NOTES+=("lens_decision_surface.html absent"); }
if $S09_PASS; then
  EXEC_STATUS[09]="VALIDATED"
  EXEC_EXIT[09]=0
  EXEC_NOTES[09]="lens.js, workspace.js, lens_demo.sh, vault, semantic (locked ref), and all 4 HTML reports present; runtime package validated"
else
  EXEC_STATUS[09]="BLOCKED_STAGE_FAILURE"
  EXEC_EXIT[09]=1
  EXEC_NOTES[09]="${S09_NOTES[*]}"
fi

# ── EXECUTE OVERALL STATUS ─────────────────────────────────────────────────────
EXEC_OVERALL="COMPLETE"
for STAGE in 00 01 02 03 04 05 06 07 08 09; do
  S="${EXEC_STATUS[$STAGE]}"
  if [[ "$S" == "BLOCKED_STAGE_06" || "$S" == "BLOCKED_STAGE_FAILURE" ]]; then
    EXEC_OVERALL="PARTIAL"
  fi
  if [[ "$S" == "NOT_ATTEMPTED" ]]; then
    EXEC_OVERALL="PARTIAL"
  fi
done

# ── EXECUTE OUTPUT ─────────────────────────────────────────────────────────────
echo ""
echo "  LENS E2E ASSEMBLY — EXECUTE MODE"
echo "  ==================================="
echo "  client:       $CLIENT"
echo "  source:       $SOURCE"
echo "  ref run:      $RUN"
echo "  execute run:  $EXECUTE_RUN_ID"
echo ""
printf "  %-8s %-40s %-6s %s\n" "STAGE" "STATUS" "EXIT" "NOTES"
printf "  %-8s %-40s %-6s %s\n" "-----" "------" "----" "-----"
for STAGE in 00 01 02 03 04 05 06 07 08 09; do
  printf "  STAGE %s  %-40s %-6s %s\n" "$STAGE" "${EXEC_STATUS[$STAGE]}" "${EXEC_EXIT[$STAGE]}" "${EXEC_NOTES[$STAGE]}"
done
echo ""
echo "  OVERALL STATUS: $EXEC_OVERALL"
echo ""

exit 0
