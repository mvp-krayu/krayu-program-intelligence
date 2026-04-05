#!/usr/bin/env bash
# PSEE-RUNTIME.3A — Operator Sidecar Validator
#
# Usage:
#   validate_operator_sidecars.sh <runtime_dir>
#
# Validates operator sidecar files meet required schema for engine state materialization.
# Checked fields:
#   operator_inputs.json:
#     phase_b_target.declaration_path   (non-empty string)
#     phase_b_target.artifact_names     (array with ≥1 entry)
#   operator_contact.json:
#     operator_contact.identifier       (non-empty string)
#     operator_contact.escalation_channel (non-empty string)
#
# Exit codes:
#   0 = SIDECAR_VALIDATION_PASS
#   1 = SIDECAR_VALIDATION_FAIL

set -euo pipefail

RUNTIME_DIR="${1:-}"
if [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: validate_operator_sidecars.sh <runtime_dir>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
[[ "$RUNTIME_DIR" != /* ]] && RUNTIME_DIR="$REPO_ROOT/$RUNTIME_DIR"

PASS=0; FAIL=0
VIOLATIONS=()

pass() { echo "  PASS  $1"; PASS=$((PASS+1)); }
fail() { echo "  FAIL  $1"; FAIL=$((FAIL+1)); VIOLATIONS+=("$1"); }

echo "=== Operator Sidecar Validation ==="
echo "Runtime dir: $RUNTIME_DIR"
echo ""

OI="$RUNTIME_DIR/operator_inputs.json"
OC="$RUNTIME_DIR/operator_contact.json"

# ── CHECK 1: operator_inputs.json present ────────────────────────────────────
echo "--- Check 1: operator_inputs.json present ---"
if [ -f "$OI" ]; then
  pass "operator_inputs.json present"
else
  fail "operator_inputs.json missing"
fi
echo ""

# ── CHECK 2: phase_b_target.declaration_path ─────────────────────────────────
echo "--- Check 2: phase_b_target.declaration_path ---"
if [ -f "$OI" ]; then
  DECL_PATH="$(jq -r '.phase_b_target.declaration_path // empty' "$OI" 2>/dev/null || echo "")"
  if [ -n "$DECL_PATH" ] && [ "$DECL_PATH" != "null" ]; then
    pass "phase_b_target.declaration_path: $DECL_PATH"
  else
    fail "phase_b_target.declaration_path missing or empty"
  fi
else
  fail "operator_inputs.json absent — cannot check"
fi
echo ""

# ── CHECK 3: phase_b_target.artifact_names (≥1) ──────────────────────────────
echo "--- Check 3: phase_b_target.artifact_names (≥1 entry) ---"
if [ -f "$OI" ]; then
  ARTIFACT_COUNT="$(jq '.phase_b_target.artifact_names | length' "$OI" 2>/dev/null || echo "0")"
  if [ "$ARTIFACT_COUNT" -ge 1 ]; then
    pass "phase_b_target.artifact_names: $ARTIFACT_COUNT entry/entries"
  else
    fail "phase_b_target.artifact_names empty or missing"
  fi
else
  fail "operator_inputs.json absent — cannot check"
fi
echo ""

# ── CHECK 4: operator_contact.json present ───────────────────────────────────
echo "--- Check 4: operator_contact.json present ---"
if [ -f "$OC" ]; then
  pass "operator_contact.json present"
else
  fail "operator_contact.json missing"
fi
echo ""

# ── CHECK 5: operator_contact.identifier ─────────────────────────────────────
echo "--- Check 5: operator_contact.identifier ---"
if [ -f "$OC" ]; then
  IDENTIFIER="$(jq -r '.operator_contact.identifier // empty' "$OC" 2>/dev/null || echo "")"
  if [ -n "$IDENTIFIER" ] && [ "$IDENTIFIER" != "null" ]; then
    pass "operator_contact.identifier: $IDENTIFIER"
  else
    fail "operator_contact.identifier missing or empty"
  fi
else
  fail "operator_contact.json absent — cannot check"
fi
echo ""

# ── CHECK 6: operator_contact.escalation_channel ─────────────────────────────
echo "--- Check 6: operator_contact.escalation_channel ---"
if [ -f "$OC" ]; then
  ESC_CHANNEL="$(jq -r '.operator_contact.escalation_channel // empty' "$OC" 2>/dev/null || echo "")"
  if [ -n "$ESC_CHANNEL" ] && [ "$ESC_CHANNEL" != "null" ]; then
    pass "operator_contact.escalation_channel: $ESC_CHANNEL"
  else
    fail "operator_contact.escalation_channel missing or empty"
  fi
else
  fail "operator_contact.json absent — cannot check"
fi
echo ""

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════"
echo "PASS: $PASS"
echo "FAIL: $FAIL"

if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo "SIDECAR_VALIDATION_PASS"
  exit 0
else
  echo ""
  echo "VIOLATIONS:"
  for v in "${VIOLATIONS[@]}"; do echo "  ✗ $v"; done
  echo ""
  echo "SIDECAR_VALIDATION_FAIL"
  exit 1
fi
