#!/usr/bin/env bash
# IG.3 — Zero-Delta Comparator
# Compares run_05_bootstrap_pipeline vs run_04_adapter_simulation after normalization.
# Usage: ./validate_zero_delta.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
R04="$REPO_ROOT/docs/pios/runs/run_04_adapter_simulation"
R05="$REPO_ROOT/docs/pios/runs/run_05_bootstrap_pipeline"
PASS=0
FAIL=0
DRIFT_FILES=()

normalize() {
  sed -E \
    -e 's/run_id: .*/run_id: RUN_NORM/' \
    -e 's/contract: .*/contract: CONTRACT_NORM/' \
    -e 's/upstream_contract: .*/upstream_contract: CONTRACT_NORM/' \
    -e 's/date: .*/date: DATE_NORM/' \
    -e 's/regeneration_context: .*/regeneration_context: REGEN_NORM/' \
    -e 's/adapter_binding: .*/adapter_binding: ADAPTER_NORM/' \
    -e 's/github_[a-z_]+: .*/github_field: NORM/' \
    -e 's/jira_[a-z_]+: .*/jira_field: NORM/' \
    -e 's/run_04_adapter_simulation/RUN_NORM/g' \
    -e 's/run_05_bootstrap_pipeline/RUN_NORM/g' \
    "$1"
}

echo "=== IG.3 Zero-Delta Comparator ==="
echo "Reference: $R04"
echo "Test run:  $R05"
echo ""

[ -d "$R04" ] && echo "  PASS  run_04 present" && PASS=$((PASS+1)) || { echo "  FAIL  run_04 missing"; FAIL=$((FAIL+1)); }
[ -d "$R05" ] && echo "  PASS  run_05 present" && PASS=$((PASS+1)) || { echo "  FAIL  run_05 missing"; FAIL=$((FAIL+1)); exit 1; }

for f in $(find "$R04/40.2" "$R04/40.3" "$R04/40.4" -name "*.md" 2>/dev/null | sort); do
  rel="${f#$R04/}"
  f5="$R05/$rel"
  if [ ! -f "$f5" ]; then
    echo "  FAIL  MISSING in run_05: $rel"; FAIL=$((FAIL+1)); DRIFT_FILES+=("$rel"); continue
  fi
  if diff <(normalize "$f") <(normalize "$f5") > /dev/null 2>&1; then
    PASS=$((PASS+1))
  else
    echo "  FAIL  DRIFT: $rel"; FAIL=$((FAIL+1)); DRIFT_FILES+=("$rel")
  fi
done

R04_COUNT=$(find "$R04/40.2" "$R04/40.3" "$R04/40.4" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
R05_COUNT=$(find "$R05/40.2" "$R05/40.3" "$R05/40.4" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
[ "$R04_COUNT" = "$R05_COUNT" ] && echo "  PASS  File count matches: $R04_COUNT" && PASS=$((PASS+1)) || { echo "  FAIL  Count mismatch: run_04=$R04_COUNT run_05=$R05_COUNT"; FAIL=$((FAIL+1)); }

echo ""
echo "=== Results ==="
echo "PASS: $PASS / FAIL: $FAIL"
[ ${#DRIFT_FILES[@]} -gt 0 ] && echo "Drift files: ${DRIFT_FILES[*]}"
[ "$FAIL" -eq 0 ] && echo "VERDICT: NONE (zero delta)" && exit 0 || echo "VERDICT: DRIFT_DETECTED" && exit 1
