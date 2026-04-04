#!/usr/bin/env bash
# IG.3 — Git Hygiene Validator
# Usage: ./validate_git_hygiene.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
EXPECTED_BRANCH="work/ig-foundation"
BASELINE_ANCHORS=("pios-core-v0.4-final" "demo-execlens-v1-final" "governance-v1-final")
PASS=0
FAIL=0

echo "=== IG.3 Git Hygiene Validator ==="
echo "Repo root: $REPO_ROOT"
echo ""

cd "$REPO_ROOT"

CURRENT_BRANCH=$(git branch --show-current)
[ "$CURRENT_BRANCH" = "$EXPECTED_BRANCH" ] && R="PASS" || R="FAIL"
echo "  $R  Active branch: $CURRENT_BRANCH"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

for anchor in "${BASELINE_ANCHORS[@]}"; do
  git rev-parse "$anchor" > /dev/null 2>&1 && R="PASS" || R="FAIL"
  echo "  $R  Anchor: $anchor"
  [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
done

BASELINE_DIRTY=$(git diff --name-only HEAD -- docs/pios/40.2/ docs/pios/40.3/ docs/pios/40.4/ 2>/dev/null)
[ -z "$BASELINE_DIRTY" ] && R="PASS" || R="FAIL"
echo "  $R  Baseline docs unmodified"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

MAIN_HAS_R05=$(git ls-tree -r main --name-only 2>/dev/null | grep "run_05_bootstrap_pipeline" || true | wc -l | tr -d ' ')
[ "$MAIN_HAS_R05" = "0" ] && R="PASS" || R="FAIL"
echo "  $R  run_05 not on main"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

[ "$CURRENT_BRANCH" != "main" ] && R="PASS" || R="FAIL"
echo "  $R  Not executing on main"
[ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

echo "  INFO  Stash entries: $(git stash list 2>/dev/null | wc -l | tr -d ' ')"

echo ""
echo "=== Results ==="
echo "PASS: $PASS / FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "VERDICT: PASS" && exit 0 || echo "VERDICT: FAIL" && exit 1
