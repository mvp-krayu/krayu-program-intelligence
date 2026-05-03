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
# Stage 08 (lens_generate.sh) requires vault AND semantic co-located in same run.
#   With stage 06 blocked, vault is absent in execution run; classified BLOCKED_STAGE_FAILURE.

EXECUTE_RUN_ID="run_blueedge_e2e_execute_01"
EXEC_RUN_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$EXECUTE_RUN_ID"
CANONICAL_RUN_DIR="$REPO_ROOT/clients/$CLIENT/psee/runs/$RUN"

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
if [[ ${EXEC_EXIT[01]} -ne 0 ]]; then
  EXEC_STATUS[02]="NOT_ATTEMPTED"
  EXEC_EXIT[02]=-1
  EXEC_NOTES[02]="skipped — stage 01 failed"
else
  echo ""
  echo "  [STAGE 02] Intake — source_intake.py"
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

# ── EXECUTE STAGE 03: Structure (40.x) ────────────────────────────────────────
if [[ ${EXEC_EXIT[02]} -ne 0 ]]; then
  EXEC_STATUS[03]="NOT_ATTEMPTED"
  EXEC_EXIT[03]=-1
  EXEC_NOTES[03]="skipped — stage 02 failed or not attempted"
else
  echo ""
  echo "  [STAGE 03] Structure — structural_scanner.py"
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

# ── EXECUTE STAGE 04: CEU Grounding ───────────────────────────────────────────
if [[ ${EXEC_EXIT[03]} -ne 0 ]]; then
  EXEC_STATUS[04]="NOT_ATTEMPTED"
  EXEC_EXIT[04]=-1
  EXEC_NOTES[04]="skipped — stage 03 failed or not attempted"
else
  echo ""
  echo "  [STAGE 04] CEU grounding — ceu_grounding.py"
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

# ── EXECUTE STAGE 05: DOM Layer ────────────────────────────────────────────────
if [[ ${EXEC_EXIT[03]} -ne 0 || ${EXEC_EXIT[04]} -ne 0 ]]; then
  EXEC_STATUS[05]="NOT_ATTEMPTED"
  EXEC_EXIT[05]=-1
  EXEC_NOTES[05]="skipped — stage 03 or 04 failed or not attempted"
else
  echo ""
  echo "  [STAGE 05] DOM layer — dom_layer_generator.py"
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

# ── EXECUTE STAGE 06: 75.x / 41.x Pipeline ────────────────────────────────────
# KNOWN BLOCKED: run_client_pipeline.py Phase 2 requires source_manifest["extracted_path"]
# (clients/6a6fcdbc.../psee/intake/canonical_repo) which is absent.
# Path contract mismatch: generic pipeline writes to new run dir; orchestrator
# expects UUID canonical path from source_manifest. Will fail at phase 2.
echo ""
echo "  [STAGE 06] Pipeline — run_client_pipeline.py (KNOWN BLOCKED_STAGE_06)"
EXEC_EXIT[06]=0
python3 "$SCRIPTS_DIR/run_client_pipeline.py" \
  --client "$CLIENT" --source "$SOURCE" --run-id "$EXECUTE_RUN_ID" \
  || EXEC_EXIT[06]=$?
if [[ ${EXEC_EXIT[06]} -eq 0 ]]; then
  EXEC_STATUS[06]="EXECUTED"
  EXEC_NOTES[06]="run_client_pipeline.py exited 0 — unexpected success; verify vault output"
else
  EXEC_STATUS[06]="BLOCKED_STAGE_06"
  EXEC_NOTES[06]="run_client_pipeline.py exited ${EXEC_EXIT[06]}; path contract mismatch: source_manifest[extracted_path] (UUID) absent; generic stage 02 output not recognized by phase 2"
fi

# ── EXECUTE STAGE 07: Semantic Bundle (locked reference) ──────────────────────
echo ""
echo "  [STAGE 07] Semantic bundle — READY_LOCKED_REFERENCE"
S07_MANIFEST="$CANONICAL_RUN_DIR/semantic/semantic_bundle_manifest.json"
if [[ -f "$S07_MANIFEST" ]]; then
  EXEC_STATUS[07]="READY_LOCKED_REFERENCE"
  EXEC_EXIT[07]=0
  EXEC_NOTES[07]="semantic_bundle_manifest.json present in $RUN; validate-only; no rebuild"
else
  EXEC_STATUS[07]="BLOCKED_STAGE_FAILURE"
  EXEC_EXIT[07]=1
  EXEC_NOTES[07]="semantic_bundle_manifest.json absent in $RUN"
fi

# ── EXECUTE STAGE 08: Reports ─────────────────────────────────────────────────
# lens_generate.sh requires vault AND semantic in same BASE_DIR (same --run).
# vault is absent from execution run (stage 06 blocked).
# semantic is in canonical run only (READY_LOCKED_REFERENCE, no copy).
# → BLOCKED_STAGE_FAILURE: co-location requirement unmet.
echo ""
echo "  [STAGE 08] Reports — lens_generate.sh"
EXEC_VAULT_FOR_EXEC="$EXEC_RUN_DIR/vault"
EXEC_SEMANTIC_FOR_EXEC="$EXEC_RUN_DIR/semantic"
if [[ -d "$EXEC_VAULT_FOR_EXEC" && -d "$EXEC_SEMANTIC_FOR_EXEC" ]]; then
  EXEC_EXIT[08]=0
  bash "$SCRIPTS_DIR/lens_generate.sh" \
    --client "$CLIENT" --run "$EXECUTE_RUN_ID" \
    || EXEC_EXIT[08]=$?
  if [[ ${EXEC_EXIT[08]} -eq 0 ]]; then
    EXEC_STATUS[08]="EXECUTED"
    EXEC_NOTES[08]="lens_generate.sh exited 0; reports written to $EXECUTE_RUN_ID/reports/"
  else
    EXEC_STATUS[08]="BLOCKED_STAGE_FAILURE"
    EXEC_NOTES[08]="lens_generate.sh exited ${EXEC_EXIT[08]}"
  fi
else
  EXEC_STATUS[08]="BLOCKED_STAGE_FAILURE"
  EXEC_EXIT[08]=-1
  if [[ ! -d "$EXEC_VAULT_FOR_EXEC" && ! -d "$EXEC_SEMANTIC_FOR_EXEC" ]]; then
    EXEC_NOTES[08]="vault and semantic both absent from execution run $EXECUTE_RUN_ID; stage 06 blocked; semantic is READY_LOCKED_REFERENCE in $RUN only — copy not authorized"
  elif [[ ! -d "$EXEC_VAULT_FOR_EXEC" ]]; then
    EXEC_NOTES[08]="vault absent from $EXECUTE_RUN_ID (stage 06 blocked); lens_generate.sh requires vault in same run"
  else
    EXEC_NOTES[08]="semantic absent from $EXECUTE_RUN_ID; semantic is READY_LOCKED_REFERENCE in $RUN only"
  fi
fi

# ── EXECUTE STAGE 09: Runtime Package Validation ──────────────────────────────
echo ""
echo "  [STAGE 09] Runtime package — validate"
S09_LENS="$REPO_ROOT/app/gauge-product/pages/lens.js"
S09_WS="$REPO_ROOT/app/gauge-product/pages/tier2/workspace.js"
S09_DEMO="$SCRIPTS_DIR/lens_demo.sh"
S09_REPORTS_DIR="$CANONICAL_RUN_DIR/reports"
S09_SEMANTIC_DIR="$CANONICAL_RUN_DIR/semantic"
S09_PASS=true
S09_NOTES=()
[[ -f "$S09_LENS" ]]       || { S09_PASS=false; S09_NOTES+=("lens.js absent"); }
[[ -f "$S09_WS" ]]         || { S09_PASS=false; S09_NOTES+=("workspace.js absent"); }
[[ -f "$S09_DEMO" ]]       || { S09_PASS=false; S09_NOTES+=("lens_demo.sh absent"); }
[[ -d "$S09_REPORTS_DIR" ]] || { S09_PASS=false; S09_NOTES+=("reports/ absent in $RUN"); }
[[ -d "$S09_SEMANTIC_DIR" ]] || { S09_PASS=false; S09_NOTES+=("semantic/ absent in $RUN"); }
if $S09_PASS; then
  EXEC_STATUS[09]="VALIDATED_ONLY"
  EXEC_EXIT[09]=0
  EXEC_NOTES[09]="lens.js, workspace.js, lens_demo.sh, reports/, semantic/ all present; runtime package validated"
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
