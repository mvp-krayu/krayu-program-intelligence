#!/usr/bin/env bash
# IG.5 — Source Profile Resolver
# Outermost entrypoint for IG pipeline execution from IG.5 onward.
# Classifies and validates source admissibility, then delegates to IG.4 orchestration.
# MUST NOT invoke bootstrap or 40.x layers directly.
# Usage: ./source_profile_resolver.sh <source_profile_schema>

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
PROFILE_SCHEMA="${1:-}"

[ -z "$PROFILE_SCHEMA" ]   && echo "ERROR: source profile schema required" && exit 1
[ ! -f "$PROFILE_SCHEMA" ] && echo "ERROR: schema not found: $PROFILE_SCHEMA" && exit 1

parse_field() {
  grep -E "^${1}=" "$PROFILE_SCHEMA" | cut -d= -f2- | tr -d '\r' || echo ""
}

RUN_ID="$(parse_field run_id)"
BASELINE_ANCHOR="$(parse_field baseline_anchor)"
BRANCH="$(parse_field branch)"
PROFILE_KIND="$(parse_field profile.kind)"
PROFILE_ADMISSIBILITY="$(parse_field profile.admissibility)"
PROFILE_RESOLUTION="$(parse_field profile.resolution)"
SOURCE_PATH="$(parse_field source_path)"
OUTPUT_ROOT="$(parse_field output_root)"
REFERENCE_RUN="$(parse_field reference_run)"
ORCH_LAUNCHER="$(parse_field orchestration_launcher)"
GITHUB_MODE="$(parse_field github.mode)"
JIRA_MODE="$(parse_field jira.mode)"
RUN_MODE="$(parse_field run.mode)"
EXEC_MODE="$(parse_field execution.mode)"

echo "=== IG.5 Source Profile Resolver ==="
echo "Run ID:            $RUN_ID"
echo "Profile kind:      $PROFILE_KIND"
echo "Admissibility:     $PROFILE_ADMISSIBILITY"
echo "Resolution:        $PROFILE_RESOLUTION"
echo ""

# ── PROFILE VALIDATION ───────────────────────────────────────────────────────
FAIL=0
pass_check() { echo "  PASS  $1"; }
fail_check() { echo "  FAIL  $1"; FAIL=$((FAIL+1)); }

CURRENT_BRANCH="$(git branch --show-current)"
[ "$CURRENT_BRANCH" = "$BRANCH" ]          && pass_check "Branch: $CURRENT_BRANCH"               || fail_check "Branch mismatch: $CURRENT_BRANCH ≠ $BRANCH"
[ "$PROFILE_ADMISSIBILITY" = "GOVERNED" ]  && pass_check "profile.admissibility = GOVERNED"       || fail_check "profile.admissibility must be GOVERNED"
[ "$PROFILE_RESOLUTION" = "DETERMINISTIC" ] && pass_check "profile.resolution = DETERMINISTIC"    || fail_check "profile.resolution must be DETERMINISTIC"
[ "$RUN_MODE" = "SOURCE_PROFILED_INGESTION" ] && pass_check "run.mode = SOURCE_PROFILED_INGESTION" || fail_check "run.mode must be SOURCE_PROFILED_INGESTION"
[ "$JIRA_MODE" = "CAPSULE" ]               && pass_check "jira.mode = CAPSULE"                     || fail_check "jira.mode must be CAPSULE"
[ "$EXEC_MODE" = "CREATE_ONLY" ]           && pass_check "execution.mode = CREATE_ONLY"            || fail_check "execution.mode must be CREATE_ONLY"
[ -f "$ORCH_LAUNCHER" ]                    && pass_check "orchestration_launcher present"           || fail_check "orchestration_launcher not found: $ORCH_LAUNCHER"
[ -x "$ORCH_LAUNCHER" ]                    && pass_check "orchestration_launcher executable"        || fail_check "orchestration_launcher not executable"
echo "$ORCH_LAUNCHER" | grep -q "ig4/orchestration_launcher" && pass_check "Delegation target is IG.4 orchestration" || fail_check "orchestration_launcher must be scripts/pios/ig4/orchestration_launcher.sh"
[ ! -d "$OUTPUT_ROOT" ]                    && pass_check "output_root is fresh"                     || fail_check "output_root exists (CREATE_ONLY): $OUTPUT_ROOT"
[ -d "$REFERENCE_RUN" ]                    && pass_check "reference_run present"                    || fail_check "reference_run not found: $REFERENCE_RUN"

# ── SOURCE ADMISSIBILITY CHECK ───────────────────────────────────────────────
echo ""
echo "--- Source admissibility check (profile.kind = $PROFILE_KIND) ---"

case "$PROFILE_KIND" in
  LOCAL_SNAPSHOT)
    [ -d "$SOURCE_PATH" ] && pass_check "Source directory exists: $SOURCE_PATH" || fail_check "Source directory not found: $SOURCE_PATH"
    # Resolve version from directory name
    RESOLVED_VERSION="$(basename "$(dirname "$SOURCE_PATH")")/$(basename "$SOURCE_PATH")"
    RESOLVED_KIND="LOCAL_SNAPSHOT"
    RESOLVED_PATH="$SOURCE_PATH"
    pass_check "Profile resolved: kind=LOCAL_SNAPSHOT version=$RESOLVED_VERSION"
    ;;
  GITHUB_REPOSITORY)
    command -v gh > /dev/null 2>&1 && pass_check "GitHub CLI present" || fail_check "GitHub CLI required for GITHUB_REPOSITORY profile"
    gh auth status > /dev/null 2>&1 && pass_check "GitHub CLI authenticated" || fail_check "GitHub CLI not authenticated"
    [ -d "$SOURCE_PATH" ] && pass_check "Source directory exists" || fail_check "Source directory not found: $SOURCE_PATH"
    RESOLVED_VERSION="$(git -C "$SOURCE_PATH/.." rev-parse HEAD 2>/dev/null || echo unknown)"
    RESOLVED_KIND="GITHUB_REPOSITORY"
    RESOLVED_PATH="$SOURCE_PATH"
    pass_check "Profile resolved: kind=GITHUB_REPOSITORY sha=$RESOLVED_VERSION"
    ;;
  *)
    fail_check "Unknown profile.kind: $PROFILE_KIND (must be LOCAL_SNAPSHOT or GITHUB_REPOSITORY)"
    RESOLVED_KIND="UNKNOWN"; RESOLVED_VERSION="unknown"; RESOLVED_PATH="$SOURCE_PATH"
    ;;
esac

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "RESOLVER_FAIL: $FAIL checks failed — aborting"
  exit 1
fi

echo ""
echo "Profile resolved. Translating to orchestration schema and delegating..."
echo ""

# ── TRANSLATE TO ORCHESTRATION INPUT SCHEMA ─────────────────────────────────
ORCH_SCHEMA="$(mktemp /tmp/ig5_orch_XXXXXX.schema)"
trap "rm -f $ORCH_SCHEMA" EXIT

cat > "$ORCH_SCHEMA" <<ORCHEOF
# IG.5 → IG.4 Translated Orchestration Schema
# Auto-generated by source_profile_resolver.sh — DO NOT EDIT

run_id=$RUN_ID
baseline_anchor=$BASELINE_ANCHOR
branch=$BRANCH
source_path=$RESOLVED_PATH
output_root=$OUTPUT_ROOT
reference_run=$REFERENCE_RUN
bootstrap_launcher=$(dirname "$(dirname "$ORCH_LAUNCHER")")/ig3/bootstrap_launcher.sh
source.kind=$RESOLVED_KIND
source.binding=EXTERNAL
github.mode=$GITHUB_MODE
jira.mode=$JIRA_MODE
run.mode=ORCHESTRATED_INGESTION
execution.mode=$EXEC_MODE
ORCHEOF

# ── DELEGATE TO IG.4 ORCHESTRATION ──────────────────────────────────────────
echo "Delegating to: $ORCH_LAUNCHER"
bash "$ORCH_LAUNCHER" "$ORCH_SCHEMA"

# ── ANNOTATE adapter_binding.md WITH PROFILE CONTEXT ────────────────────────
if [ -f "$OUTPUT_ROOT/adapter_binding.md" ]; then
  cat >> "$OUTPUT_ROOT/adapter_binding.md" <<PROFEOF

---

## Source Profile Layer (IG.5)

source_profile_layer: IG.5
profile.kind: $PROFILE_KIND
profile.admissibility: $PROFILE_ADMISSIBILITY
profile.resolution: $PROFILE_RESOLUTION
resolved.kind: $RESOLVED_KIND
resolved.version: $RESOLVED_VERSION
source_profiled_run_mode: $RUN_MODE
PROFEOF
fi

echo ""
echo "PROFILE_RESOLVER_COMPLETE — run_id: $RUN_ID"
