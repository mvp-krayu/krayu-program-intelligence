#!/usr/bin/env bash
# GOV — Shared Git Hygiene Validator
# No hardcoded branches, run names, or stream dirs.
#
# Usage:
#   validate_git_hygiene.sh [--repo-root <path>] [--expected-branch <branch>]
#                           [--run-namespace <name>] [--protected-dirs <dir1:dir2:...>]
#
# Options:
#   --expected-branch    Exact branch name required (omit to skip branch check)
#   --run-namespace      Run dir name to verify is NOT on main (e.g. run_05_bootstrap_pipeline)
#   --protected-dirs     Colon-separated list of paths to check for uncommitted changes
#                        Default: docs/pios/40.2:docs/pios/40.3:docs/pios/40.4
#
# Exit codes:
#   0 = PASS
#   1 = FAIL

set -euo pipefail

# ── DEFAULTS ──────────────────────────────────────────────────────────────────
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
EXPECTED_BRANCH=""
RUN_NAMESPACE=""
PROTECTED_DIRS_RAW="docs/pios/40.2:docs/pios/40.3:docs/pios/40.4"
BASELINE_ANCHORS=("pios-core-v0.4-final" "demo-execlens-v1-final" "governance-v1-final")

# ── ARGS ──────────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-root)       REPO_ROOT="$2";         shift 2 ;;
    --expected-branch) EXPECTED_BRANCH="$2";   shift 2 ;;
    --run-namespace)   RUN_NAMESPACE="$2";     shift 2 ;;
    --protected-dirs)  PROTECTED_DIRS_RAW="$2"; shift 2 ;;
    *) echo "ERROR: unknown option $1"; exit 1 ;;
  esac
done

# ── MAIN ──────────────────────────────────────────────────────────────────────
PASS=0; FAIL=0

echo "=== Shared Git Hygiene Validator ==="
echo "Repo root: $REPO_ROOT"
echo ""

cd "$REPO_ROOT"

CURRENT_BRANCH=$(git branch --show-current)

# Branch check (only if --expected-branch was supplied)
if [ -n "$EXPECTED_BRANCH" ]; then
  [ "$CURRENT_BRANCH" = "$EXPECTED_BRANCH" ] && R="PASS" || R="FAIL"
  echo "  $R  Active branch: $CURRENT_BRANCH (expected: $EXPECTED_BRANCH)"
  [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
else
  echo "  INFO  Active branch: $CURRENT_BRANCH (no expected-branch constraint)"
fi

# Not on main
[ "$CURRENT_BRANCH" != "main" ] && R="PASS" || R="FAIL"
echo "  $R  Not executing on main"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

# Baseline anchor tags
for anchor in "${BASELINE_ANCHORS[@]}"; do
  git rev-parse "$anchor" > /dev/null 2>&1 && R="PASS" || R="FAIL"
  echo "  $R  Baseline anchor present: $anchor"
  [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
done

# Protected dirs — no uncommitted changes
IFS=':' read -ra PROTECTED_DIRS <<< "$PROTECTED_DIRS_RAW"
for dir in "${PROTECTED_DIRS[@]}"; do
  DIRTY=$(git diff --name-only HEAD -- "$dir" 2>/dev/null || true)
  [ -z "$DIRTY" ] && R="PASS" || R="FAIL"
  echo "  $R  No uncommitted changes in: $dir"
  [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
done

# Run namespace not on main (only if --run-namespace supplied)
if [ -n "$RUN_NAMESPACE" ]; then
  MAIN_HAS=$(git ls-tree -r main --name-only 2>/dev/null | grep "$RUN_NAMESPACE" || true | wc -l | tr -d ' ')
  [ "$MAIN_HAS" = "0" ] && R="PASS" || R="FAIL"
  echo "  $R  Run namespace not on main: $RUN_NAMESPACE"
  [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
fi

# Stash info (advisory only)
STASH_COUNT=$(git stash list 2>/dev/null | wc -l | tr -d ' ')
echo "  INFO  Stash entries: $STASH_COUNT"

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo ""
echo "=== Results ==="
echo "PASS: $PASS / FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "VERDICT: PASS" && exit 0 || echo "VERDICT: FAIL" && exit 1
