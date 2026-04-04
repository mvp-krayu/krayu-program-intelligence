#!/usr/bin/env bash
# IG.4 — Git Hygiene Validator
# Usage: ./validate_git_hygiene.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
EXPECTED_BRANCH="work/ig-foundation"
ANCHORS=("pios-core-v0.4-final" "demo-execlens-v1-final" "governance-v1-final")
PASS=0; FAIL=0

echo "=== IG.4 Git Hygiene Validator ==="
echo ""

cd "$REPO_ROOT"

CURRENT=$(git branch --show-current)
[ "$CURRENT" = "$EXPECTED_BRANCH" ] && R="PASS" || R="FAIL"
echo "  $R  Branch: $CURRENT"; [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

for a in "${ANCHORS[@]}"; do
  git rev-parse "$a" > /dev/null 2>&1 && R="PASS" || R="FAIL"
  echo "  $R  Anchor: $a"; [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))
done

DIRTY=$(git diff --name-only HEAD -- docs/pios/40.2/ docs/pios/40.3/ docs/pios/40.4/ 2>/dev/null)
[ -z "$DIRTY" ] && R="PASS" || R="FAIL"
echo "  $R  Baseline docs unmodified"; [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

# IG.3 artifacts not modified (no uncommitted changes to ig3 scripts)
IG3_DIRTY=$(git diff --name-only HEAD -- scripts/pios/ig3/ docs/pios/IG.3/ 2>/dev/null)
[ -z "$IG3_DIRTY" ] && R="PASS" || R="FAIL"
echo "  $R  IG.3 artifacts unmodified"; [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

MAIN_R06=$(git ls-tree -r main --name-only 2>/dev/null | grep "run_06_orchestrated_ingestion" || true | wc -l | tr -d ' ')
[ "$MAIN_R06" = "0" ] && R="PASS" || R="FAIL"
echo "  $R  run_06 not on main"; [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

[ "$CURRENT" != "main" ] && R="PASS" || R="FAIL"
echo "  $R  Not executing on main"; [ "$R" = "PASS" ] && PASS=$((PASS+1)) || FAIL=$((FAIL+1))

echo "  INFO  Stash entries: $(git stash list 2>/dev/null | wc -l | tr -d ' ')"

echo ""
echo "PASS: $PASS / FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "VERDICT: PASS" && exit 0 || echo "VERDICT: FAIL" && exit 1
