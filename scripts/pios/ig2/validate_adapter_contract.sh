#!/usr/bin/env bash
# IG.2 — Adapter Contract Validator
# Validates that adapter bindings are correct and mode declarations are present.
# Usage: ./validate_adapter_contract.sh [repo_root]

set -euo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
IG2_DIR="$REPO_ROOT/docs/pios/IG.2"
PASS=0
FAIL=0

check() {
  local name="$1"
  local result="$2"
  if [ "$result" = "PASS" ]; then
    echo "  PASS  $name"
    PASS=$((PASS+1))
  else
    echo "  FAIL  $name"
    FAIL=$((FAIL+1))
  fi
}

echo "=== IG.2 Adapter Contract Validator ==="
echo "Repo root: $REPO_ROOT"
echo ""

# Check adapter contract file exists
[ -f "$IG2_DIR/IG.2_ADAPTER_CONTRACT.md" ] && R="PASS" || R="FAIL"
check "IG.2_ADAPTER_CONTRACT.md exists" "$R"

# Check Jira capsule schema exists
[ -f "$IG2_DIR/IG.2_JIRA_CAPSULE_SCHEMA.md" ] && R="PASS" || R="FAIL"
check "IG.2_JIRA_CAPSULE_SCHEMA.md exists" "$R"

# Check GitHub mode declaration
if [ -f "$IG2_DIR/IG.2_ADAPTER_CONTRACT.md" ]; then
  grep -q "GitHub.*ENABLED\|ENABLED.*GitHub" "$IG2_DIR/IG.2_ADAPTER_CONTRACT.md" && R="PASS" || R="FAIL"
  check "GitHub adapter mode declared" "$R"
fi

# Check Jira mode declaration
if [ -f "$IG2_DIR/IG.2_ADAPTER_CONTRACT.md" ]; then
  grep -q "Jira.*CAPSULE\|CAPSULE.*Jira" "$IG2_DIR/IG.2_ADAPTER_CONTRACT.md" && R="PASS" || R="FAIL"
  check "Jira adapter mode (CAPSULE) declared" "$R"
fi

# Check zero-delta requirement documented
if [ -f "$IG2_DIR/IG.2_ADAPTER_CONTRACT.md" ]; then
  grep -q "ZERO" "$IG2_DIR/IG.2_ADAPTER_CONTRACT.md" && R="PASS" || R="FAIL"
  check "Zero-delta requirement present" "$R"
fi

# Check GitHub CLI available (ENABLED mode requires real access)
which gh > /dev/null 2>&1 && gh auth status > /dev/null 2>&1 && R="PASS" || R="FAIL"
check "GitHub CLI authenticated" "$R"

# Check adapter_binding.md exists in run_04 if present
RUN04="$REPO_ROOT/docs/pios/runs/run_04_adapter_simulation"
if [ -d "$RUN04" ]; then
  [ -f "$RUN04/adapter_binding.md" ] && R="PASS" || R="FAIL"
  check "run_04 adapter_binding.md exists" "$R"
fi

echo ""
echo "=== Results ==="
echo "PASS: $PASS"
echo "FAIL: $FAIL"
[ "$FAIL" -eq 0 ] && echo "VERDICT: PASS" && exit 0 || echo "VERDICT: FAIL" && exit 1
