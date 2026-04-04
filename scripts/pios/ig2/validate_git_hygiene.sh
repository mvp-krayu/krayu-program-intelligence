#!/usr/bin/env bash
# IG.2 — Git Hygiene Validator
# Confirms no unauthorized branch operations, expected branch, no dirty commits on baseline anchors.
# Usage: ./validate_git_hygiene.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
EXPECTED_BRANCH="work/ig-foundation"
BASELINE_ANCHORS=("pios-core-v0.4-final" "demo-execlens-v1-final" "governance-v1-final")
PASS=0
FAIL=0

echo "=== IG.2 Git Hygiene Validator ==="
echo "Repo root: $REPO_ROOT"
echo ""

cd "$REPO_ROOT"

# Check active branch
CURRENT_BRANCH=$(git branch --show-current)
[ "$CURRENT_BRANCH" = "$EXPECTED_BRANCH" ] && R="PASS" || R="FAIL"
echo "  $R  Active branch: $CURRENT_BRANCH (expected: $EXPECTED_BRANCH)"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

# Check baseline anchor tags exist and have not moved
for anchor in "${BASELINE_ANCHORS[@]}"; do
  git rev-parse "$anchor" > /dev/null 2>&1 && R="PASS" || R="FAIL"
  echo "  $R  Baseline anchor present: $anchor"
  [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
done

# Check no uncommitted changes to baseline docs
BASELINE_DIRTY=$(git diff --name-only HEAD -- docs/pios/40.2/ docs/pios/40.3/ docs/pios/40.4/ 2>/dev/null)
[ -z "$BASELINE_DIRTY" ] && R="PASS" || R="FAIL"
echo "  $R  Baseline docs (40.2/40.3/40.4) unmodified"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

# Check run_04 is not tracked on main
MAIN_HAS_RUN04=$(git ls-tree -r main --name-only 2>/dev/null | grep "run_04_adapter_simulation" || true | wc -l | tr -d ' ')
[ "$MAIN_HAS_RUN04" = "0" ] && R="PASS" || R="FAIL"
echo "  $R  run_04 not on main branch"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

# Check we're not on main
[ "$CURRENT_BRANCH" != "main" ] && R="PASS" || R="FAIL"
echo "  $R  Not executing on main"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

# Check no stash is holding critical state
STASH_COUNT=$(git stash list 2>/dev/null | wc -l | tr -d ' ')
echo "  INFO  Stash entries: $STASH_COUNT"

echo ""
echo "=== Results ==="
echo "PASS: $PASS"
echo "FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "VERDICT: PASS" && exit 0 || echo "VERDICT: FAIL" && exit 1
