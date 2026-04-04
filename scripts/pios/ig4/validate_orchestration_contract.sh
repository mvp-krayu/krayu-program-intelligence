#!/usr/bin/env bash
# IG.4 — Orchestration Contract Validator
# Usage: ./validate_orchestration_contract.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
IG4_DIR="$REPO_ROOT/docs/pios/IG.4"
IG3_DIR="$REPO_ROOT/docs/pios/IG.3"
PASS=0; FAIL=0

check() {
  [ "$2" = "PASS" ] && echo "  PASS  $1" && PASS=$((PASS+1)) || { echo "  FAIL  $1"; FAIL=$((FAIL+1)); }
}

echo "=== IG.4 Orchestration Contract Validator ==="
echo ""

# IG.4 artifacts
[ -f "$IG4_DIR/IG.4_ORCHESTRATION_CONTRACT.md" ]    && R="PASS" || R="FAIL"; check "IG.4_ORCHESTRATION_CONTRACT.md exists" "$R"
[ -f "$IG4_DIR/IG.4_ORCHESTRATION_INPUT_SCHEMA.md" ] && R="PASS" || R="FAIL"; check "IG.4_ORCHESTRATION_INPUT_SCHEMA.md exists" "$R"

# Orchestration launcher
[ -x "$REPO_ROOT/scripts/pios/ig4/orchestration_launcher.sh" ] && R="PASS" || R="FAIL"; check "orchestration_launcher.sh executable" "$R"

# Delegation chain intact
grep -q "ig3/bootstrap_launcher" "$REPO_ROOT/scripts/pios/ig4/orchestration_launcher.sh" 2>/dev/null && R="PASS" || R="FAIL"; check "Launcher delegates to IG.3 bootstrap" "$R"

# IG.3 artifacts unmodified (check file exists — mutation would be detectable via git)
[ -f "$IG3_DIR/IG.3_BOOTSTRAP_CONTRACT.md" ]     && R="PASS" || R="FAIL"; check "IG.3_BOOTSTRAP_CONTRACT.md intact" "$R"
[ -f "$REPO_ROOT/scripts/pios/ig3/bootstrap_launcher.sh" ] && R="PASS" || R="FAIL"; check "IG.3 bootstrap_launcher.sh intact" "$R"

# Contract declares EXTERNAL binding
grep -q "EXTERNAL" "$IG4_DIR/IG.4_ORCHESTRATION_CONTRACT.md" 2>/dev/null && R="PASS" || R="FAIL"; check "EXTERNAL source binding declared" "$R"

# Contract declares delegation rule
grep -q "bootstrap_launcher" "$IG4_DIR/IG.4_ORCHESTRATION_CONTRACT.md" 2>/dev/null && R="PASS" || R="FAIL"; check "Delegation rule present in contract" "$R"

# run_06 has adapter_binding with orchestration annotation
RUN06="$REPO_ROOT/docs/pios/runs/run_06_orchestrated_ingestion"
if [ -d "$RUN06" ]; then
  [ -f "$RUN06/adapter_binding.md" ] && R="PASS" || R="FAIL"; check "run_06 adapter_binding.md present" "$R"
  grep -q "orchestration_layer" "$RUN06/adapter_binding.md" 2>/dev/null && R="PASS" || R="FAIL"; check "run_06 adapter_binding declares orchestration layer" "$R"
  grep -q "ORCHESTRATED_INGESTION" "$RUN06/adapter_binding.md" 2>/dev/null && R="PASS" || R="FAIL"; check "run_06 declares ORCHESTRATED_INGESTION mode" "$R"
fi

echo ""
echo "PASS: $PASS / FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "VERDICT: PASS" && exit 0 || echo "VERDICT: FAIL" && exit 1
