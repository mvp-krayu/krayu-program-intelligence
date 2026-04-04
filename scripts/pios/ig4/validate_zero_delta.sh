#!/usr/bin/env bash
# IG.4 — Zero-Delta Comparator (run_06 vs run_05)
# Usage: ./validate_zero_delta.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
R05="$REPO_ROOT/docs/pios/runs/run_05_bootstrap_pipeline"
R06="$REPO_ROOT/docs/pios/runs/run_06_orchestrated_ingestion"
PASS=0; FAIL=0; DRIFT_FILES=()

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
    -e 's/run_05_bootstrap_pipeline/RUN_NORM/g' \
    -e 's/run_06_orchestrated_ingestion/RUN_NORM/g' \
    "$1"
}

echo "=== IG.4 Zero-Delta Comparator ==="
echo "Reference: $R05"
echo "Test run:  $R06"
echo ""

[ -d "$R05" ] && echo "  PASS  run_05 present" && PASS=$((PASS+1)) || { echo "  FAIL  run_05 missing"; FAIL=$((FAIL+1)); }
[ -d "$R06" ] && echo "  PASS  run_06 present" && PASS=$((PASS+1)) || { echo "  FAIL  run_06 missing"; FAIL=$((FAIL+1)); exit 1; }

for f in $(find "$R05/40.2" "$R05/40.3" "$R05/40.4" -name "*.md" 2>/dev/null | sort); do
  rel="${f#$R05/}"
  f6="$R06/$rel"
  if [ ! -f "$f6" ]; then
    echo "  FAIL  MISSING: $rel"; FAIL=$((FAIL+1)); DRIFT_FILES+=("$rel"); continue
  fi
  diff <(normalize "$f") <(normalize "$f6") > /dev/null 2>&1 && PASS=$((PASS+1)) || { echo "  FAIL  DRIFT: $rel"; FAIL=$((FAIL+1)); DRIFT_FILES+=("$rel"); }
done

R05_C=$(find "$R05/40.2" "$R05/40.3" "$R05/40.4" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
R06_C=$(find "$R06/40.2" "$R06/40.3" "$R06/40.4" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
[ "$R05_C" = "$R06_C" ] && echo "  PASS  File count: $R05_C" && PASS=$((PASS+1)) || { echo "  FAIL  Count mismatch: run_05=$R05_C run_06=$R06_C"; FAIL=$((FAIL+1)); }

echo ""
echo "PASS: $PASS / FAIL: $FAIL"
[ ${#DRIFT_FILES[@]} -gt 0 ] && echo "Drift: ${DRIFT_FILES[*]}"
[ "$FAIL" -eq 0 ] && echo "VERDICT: NONE (zero delta)" && exit 0 || echo "VERDICT: DRIFT_DETECTED" && exit 1
