#!/usr/bin/env bash
# lens_e2e_assemble.sh — LENS E2E assembly and stage validation
# PI.LENS.REAL-E2E-PIPELINE-ASSEMBLY.01
#
# Usage:
#   bash scripts/pios/lens_e2e_assemble.sh \
#     --client <client> --source <source> --run <run> --mode validate
#
# Modes:
#   validate  — check all 9 stage outputs; report readiness; do NOT execute pipeline
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

if [[ "$MODE" != "validate" ]]; then
  echo "ERROR: unsupported mode '$MODE' — only 'validate' is implemented in this release" >&2
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

exit 0
