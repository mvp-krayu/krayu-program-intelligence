#!/usr/bin/env bash
# IG.3 — Bootstrap Contract Validator
# Validates that bootstrap contract and input schema artifacts are present and correct.
# Usage: ./validate_bootstrap_contract.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
IG3_DIR="$REPO_ROOT/docs/pios/IG.3"
PASS=0
FAIL=0

check() {
  local name="$1" result="$2"
  if [ "$result" = "PASS" ]; then
    echo "  PASS  $name"; PASS=$((PASS+1))
  else
    echo "  FAIL  $name"; FAIL=$((FAIL+1))
  fi
}

echo "=== IG.3 Bootstrap Contract Validator ==="
echo "Repo root: $REPO_ROOT"
echo ""

# Contract artifacts
[ -f "$IG3_DIR/IG.3_BOOTSTRAP_CONTRACT.md" ]      && R="PASS" || R="FAIL"; check "IG.3_BOOTSTRAP_CONTRACT.md exists" "$R"
[ -f "$IG3_DIR/IG.3_BOOTSTRAP_INPUT_SCHEMA.md" ]  && R="PASS" || R="FAIL"; check "IG.3_BOOTSTRAP_INPUT_SCHEMA.md exists" "$R"

# Launcher exists and is executable
[ -x "$REPO_ROOT/scripts/pios/ig3/bootstrap_launcher.sh" ] && R="PASS" || R="FAIL"; check "bootstrap_launcher.sh is executable" "$R"

# Contract declares all required modes
for mode in "LOCAL_SNAPSHOT" "GITHUB" "CAPSULE" "BOOTSTRAP_PIPELINE" "CREATE_ONLY"; do
  grep -q "$mode" "$IG3_DIR/IG.3_BOOTSTRAP_CONTRACT.md" 2>/dev/null && R="PASS" || R="FAIL"
  check "Mode declared in contract: $mode" "$R"
done

# Zero-delta requirement stated
grep -q "NONE" "$IG3_DIR/IG.3_BOOTSTRAP_CONTRACT.md" 2>/dev/null && R="PASS" || R="FAIL"; check "Zero-delta requirement present" "$R"

# IG.2 inheritance declared
grep -q "IG.2" "$IG3_DIR/IG.3_BOOTSTRAP_CONTRACT.md" 2>/dev/null && R="PASS" || R="FAIL"; check "IG.2 inheritance declared" "$R"

# run_05 namespace has adapter_binding.md if present
RUN05="$REPO_ROOT/docs/pios/runs/run_05_bootstrap_pipeline"
if [ -d "$RUN05" ]; then
  [ -f "$RUN05/adapter_binding.md" ] && R="PASS" || R="FAIL"; check "run_05 adapter_binding.md exists" "$R"
  grep -q "BOOTSTRAP_PIPELINE" "$RUN05/adapter_binding.md" 2>/dev/null && R="PASS" || R="FAIL"; check "run_05 adapter_binding declares BOOTSTRAP_PIPELINE" "$R"
fi

echo ""
echo "=== Results ==="
echo "PASS: $PASS / FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "VERDICT: PASS" && exit 0 || echo "VERDICT: FAIL" && exit 1
