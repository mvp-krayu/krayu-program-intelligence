#!/usr/bin/env bash
# IG.2 — Zero-Delta Comparator
# Compares run_04_adapter_simulation vs run_03_blueedge_repeat after provenance normalization.
# Verifies zero semantic delta (NONE level per IG.1D comparison rules).
# Usage: ./validate_zero_delta.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
R03="$REPO_ROOT/docs/pios/runs/run_03_blueedge_repeat"
R04="$REPO_ROOT/docs/pios/runs/run_04_adapter_simulation"
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
    -e 's/run_03_blueedge_repeat/RUN_NORM/g' \
    -e 's/run_04_adapter_simulation/RUN_NORM/g' \
    "$1"
}

echo "=== IG.2 Zero-Delta Comparator ==="
echo "Reference: $R03"
echo "Test run:  $R04"
echo ""

# Check both namespaces exist
[ -d "$R03" ] && echo "  PASS  run_03 namespace present" && PASS=$((PASS+1)) || { echo "  FAIL  run_03 missing"; FAIL=$((FAIL+1)); }
[ -d "$R04" ] && echo "  PASS  run_04 namespace present" && PASS=$((PASS+1)) || { echo "  FAIL  run_04 missing"; FAIL=$((FAIL+1)); exit 1; }

# Compare all governed artifacts (40.2, 40.3, 40.4)
for f in $(find "$R03/40.2" "$R03/40.3" "$R03/40.4" -name "*.md" 2>/dev/null | sort); do
  rel="${f#$R03/}"
  f4="$R04/$rel"
  if [ ! -f "$f4" ]; then
    echo "  FAIL  MISSING in run_04: $rel"
    FAIL=$((FAIL+1))
    DRIFT_FILES+=("$rel")
    continue
  fi
  if diff <(normalize "$f") <(normalize "$f4") > /dev/null 2>&1; then
    PASS=$((PASS+1))
  else
    echo "  FAIL  DRIFT: $rel"
    FAIL=$((FAIL+1))
    DRIFT_FILES+=("$rel")
  fi
done

# Check file counts match
R03_COUNT=$(find "$R03/40.2" "$R03/40.3" "$R03/40.4" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
R04_COUNT=$(find "$R04/40.2" "$R04/40.3" "$R04/40.4" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
[ "$R03_COUNT" = "$R04_COUNT" ] && echo "  PASS  File count matches: $R03_COUNT" && PASS=$((PASS+1)) || { echo "  FAIL  File count mismatch: run_03=$R03_COUNT run_04=$R04_COUNT"; FAIL=$((FAIL+1)); }

echo ""
echo "=== Results ==="
echo "PASS: $PASS"
echo "FAIL: $FAIL"
if [ ${#DRIFT_FILES[@]} -gt 0 ]; then
  echo "Drift files: ${DRIFT_FILES[*]}"
fi
[ "$FAIL" -eq 0 ] && echo "VERDICT: NONE (zero delta)" && exit 0 || echo "VERDICT: DRIFT_DETECTED" && exit 1
