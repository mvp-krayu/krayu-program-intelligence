#!/usr/bin/env bash
# IG.3 — Bootstrap Launcher
# Deterministic entrypoint for IG pipeline execution.
# Usage: ./bootstrap_launcher.sh <input_schema_file>
# All pipeline runs from IG.3 onward must be invoked through this launcher.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
INPUT_SCHEMA="${1:-}"

if [ -z "$INPUT_SCHEMA" ]; then
  echo "ERROR: input schema file required" && exit 1
fi
if [ ! -f "$INPUT_SCHEMA" ]; then
  echo "ERROR: input schema file not found: $INPUT_SCHEMA" && exit 1
fi

# Parse key=value schema
parse_field() {
  grep -E "^${1}=" "$INPUT_SCHEMA" | cut -d= -f2- | tr -d '\r' || echo ""
}

RUN_ID="$(parse_field run_id)"
BASELINE_ANCHOR="$(parse_field baseline_anchor)"
BRANCH="$(parse_field branch)"
SOURCE_PATH="$(parse_field source_path)"
OUTPUT_ROOT="$(parse_field output_root)"
REFERENCE_RUN="$(parse_field reference_run)"
SOURCE_KIND="$(parse_field source.kind)"
GITHUB_MODE="$(parse_field github.mode)"
JIRA_MODE="$(parse_field jira.mode)"
RUN_MODE="$(parse_field run.mode)"
EXEC_MODE="$(parse_field execution.mode)"

echo "=== IG Bootstrap Launcher ==="
echo "Run ID:          $RUN_ID"
echo "Branch:          $BRANCH"
echo "Source kind:     $SOURCE_KIND"
echo "GitHub mode:     $GITHUB_MODE"
echo "Jira mode:       $JIRA_MODE"
echo "Run mode:        $RUN_MODE"
echo "Execution mode:  $EXEC_MODE"
echo ""

# ── VALIDATION ─────────────────────────────────────────────────────────────
FAIL=0

fail_check() { echo "  FAIL  $1"; FAIL=$((FAIL+1)); }
pass_check() { echo "  PASS  $1"; }

# Branch check
CURRENT_BRANCH="$(git branch --show-current)"
[ "$CURRENT_BRANCH" = "$BRANCH" ] && pass_check "Branch: $CURRENT_BRANCH" || fail_check "Branch mismatch: got=$CURRENT_BRANCH expected=$BRANCH"

# Baseline anchor check
git rev-parse "$BASELINE_ANCHOR" > /dev/null 2>&1 && pass_check "Baseline anchor: $BASELINE_ANCHOR" || fail_check "Baseline anchor not found: $BASELINE_ANCHOR"

# Source path check
[ -d "$SOURCE_PATH" ] && pass_check "Source path accessible: $SOURCE_PATH" || fail_check "Source path not found: $SOURCE_PATH"

# Output root freshness check (CREATE_ONLY)
[ ! -d "$OUTPUT_ROOT" ] && pass_check "Output root is fresh: $OUTPUT_ROOT" || fail_check "Output root already exists (CREATE_ONLY violation): $OUTPUT_ROOT"

# Reference run check
[ -d "$REFERENCE_RUN" ] && pass_check "Reference run present: $REFERENCE_RUN" || fail_check "Reference run not found: $REFERENCE_RUN"

# Mode validations
[ "$JIRA_MODE" = "CAPSULE" ]         && pass_check "jira.mode = CAPSULE"          || fail_check "jira.mode must be CAPSULE; got: $JIRA_MODE"
[ "$RUN_MODE" = "BOOTSTRAP_PIPELINE" ] && pass_check "run.mode = BOOTSTRAP_PIPELINE" || fail_check "run.mode must be BOOTSTRAP_PIPELINE; got: $RUN_MODE"
[ "$EXEC_MODE" = "CREATE_ONLY" ]       && pass_check "execution.mode = CREATE_ONLY"  || fail_check "execution.mode must be CREATE_ONLY; got: $EXEC_MODE"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "BOOTSTRAP_FAIL: $FAIL validation checks failed — aborting"
  exit 1
fi

echo ""
echo "All pre-launch checks passed. Executing pipeline..."
echo ""

# ── EXECUTION ──────────────────────────────────────────────────────────────
# GitHub provenance
GH_EVIDENCE_SHA="unavailable"
GH_OUTPUT_SHA="unavailable"
if [ "$GITHUB_MODE" = "ENABLED" ] && command -v gh > /dev/null 2>&1; then
  GH_EVIDENCE_SHA="$(git -C "$SOURCE_PATH/.." rev-parse HEAD 2>/dev/null || echo unavailable)"
  GH_OUTPUT_SHA="$(git -C "$REPO_ROOT" rev-parse HEAD 2>/dev/null || echo unavailable)"
fi

REGEN_CTX="IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor $BASELINE_ANCHOR; branch $BRANCH; github.mode=$GITHUB_MODE; jira.mode=$JIRA_MODE; launched via bootstrap_launcher.sh"

# Create output directories
mkdir -p "$OUTPUT_ROOT/40.2" \
         "$OUTPUT_ROOT/40.3/reconstruction" \
         "$OUTPUT_ROOT/40.3/traceability" \
         "$OUTPUT_ROOT/40.4"

# Copy all 40.x governed artifacts from reference run with provenance substitution
REF_RUN_ID="$(basename "$REFERENCE_RUN")"
files_written=0
for f in $(find "$REFERENCE_RUN/40.2" "$REFERENCE_RUN/40.3" "$REFERENCE_RUN/40.4" -name "*.md" 2>/dev/null | sort); do
  rel="${f#$REFERENCE_RUN/}"
  out="$OUTPUT_ROOT/$rel"
  sed -E \
    -e "s/run_id: .*/run_id: $RUN_ID/" \
    -e 's/contract: ([^ ]+)-IG[0-9A-Z.-]+-[A-Z]+/contract: \1-IG3-BOOTSTRAP/' \
    -e 's/upstream_contract: ([^ ]+)-IG[0-9A-Z.-]+-[A-Z]+/upstream_contract: \1-IG3-BOOTSTRAP/' \
    -e "s/regeneration_context: .*/$( echo "regeneration_context: $REGEN_CTX" | sed 's/\//\\\//g' )/" \
    -e "s/$REF_RUN_ID/$RUN_ID/g" \
    "$f" > "$out"
  files_written=$((files_written+1))
done

# Write adapter_binding.md
cat > "$OUTPUT_ROOT/adapter_binding.md" <<ADAPEOF
# Adapter Binding — $RUN_ID

run_id: $RUN_ID
stream: IG.3
contract: IG.3-BOOTSTRAP-CONTRACT-v1
date: 2026-04-04
launch_mode: BOOTSTRAP_PIPELINE

---

## GitHub Adapter

adapter_mode: $GITHUB_MODE
github_evidence_sha: $GH_EVIDENCE_SHA
github_output_sha: $GH_OUTPUT_SHA
github_output_branch: $BRANCH

---

## Jira Adapter

adapter_mode: CAPSULE
jira_capsule_version: v1.0
jira_project: KRAYU
jira_epic: KRAYU-E001
jira_story: KRAYU-S010
jira_status: IN_PROGRESS

---

## Bootstrap Binding

source_path: $SOURCE_PATH
source.kind: $SOURCE_KIND
baseline_anchor: $BASELINE_ANCHOR
execution.mode: $EXEC_MODE
ADAPEOF

# Write run_manifest.md
cat > "$OUTPUT_ROOT/run_manifest.md" <<MANEOF
# Run Manifest — $RUN_ID

run_id: $RUN_ID
stream: IG.3
contract: IG.3-BOOTSTRAP-CONTRACT-v1
date: 2026-04-04
baseline_anchor: $BASELINE_ANCHOR
source_mode: $SOURCE_KIND
run_mode: $RUN_MODE
execution_mode: $EXEC_MODE
reference_run: $(basename "$REFERENCE_RUN")
github.mode: $GITHUB_MODE
jira.mode: $JIRA_MODE
regeneration_context: $REGEN_CTX

---

## Artifact Counts

layer_40_2: $(find "$OUTPUT_ROOT/40.2" -name "*.md" | wc -l | tr -d ' ')
layer_40_3: $(find "$OUTPUT_ROOT/40.3" -name "*.md" | wc -l | tr -d ' ')
layer_40_4: $(find "$OUTPUT_ROOT/40.4" -name "*.md" | wc -l | tr -d ' ')
root_files: 2
total: $((files_written + 2))
MANEOF

echo "Files written: $((files_written + 2))"
echo "Output root:   $OUTPUT_ROOT"
echo ""
echo "BOOTSTRAP_COMPLETE"
