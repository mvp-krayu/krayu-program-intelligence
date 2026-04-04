#!/usr/bin/env bash
# GOV.0 — Universal Stream Open Gate
# Validates any stream contract before execution is allowed.
# No family-specific hardwiring. Reads registry dynamically.
#
# Usage:
#   ./validate_stream_open.sh <contract_file> [--repo-root <path>]
#
# Exit codes:
#   0 = PASS
#   1 = FAIL (structural violation — execution blocked)
#   2 = FAIL_SAFE_STOP (registry/file integrity violation — execution halted)

set -euo pipefail

# ── ARGS ─────────────────────────────────────────────────────────────────────
CONTRACT_FILE="${1:-}"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-root) REPO_ROOT="$2"; shift 2 ;;
    *) CONTRACT_FILE="$1"; shift ;;
  esac
done

REGISTRY="$REPO_ROOT/docs/governance/FAMILY_REGISTRY.md"
FAMILIES_DIR="$REPO_ROOT/docs/governance/families"
STREAM_SCHEMA="$REPO_ROOT/docs/governance/STREAM_SCHEMA.md"

# ── OUTPUT HELPERS ────────────────────────────────────────────────────────────
PASS=0; FAIL=0; WARNS=()
FAIL_SAFE=0

pass()  { echo "  PASS  $1"; PASS=$((PASS+1)); }
fail()  { echo "  FAIL  $1"; FAIL=$((FAIL+1)); }
warn()  { echo "  WARN  $1"; WARNS+=("$1"); }
fatal() {
  echo ""
  echo "FAIL_SAFE_STOP"
  echo "Reason:  $1"
  echo "Family:  ${DETECTED_FAMILY:-unknown}"
  echo "Stream:  ${STREAM_ID:-unknown}"
  echo "Resolve: ${2:-FAMILY_DISCOVERY or check registry}"
  echo ""
  echo "Registered families:"
  grep -E "^\| [A-Z0-9]+ " "$REGISTRY" 2>/dev/null | grep -v "^| Family" | awk -F'|' '{printf "  %-10s %s\n", $2, $5}' || echo "  (registry unreadable)"
  exit 2
}

# ── PRECONDITION ─────────────────────────────────────────────────────────────
echo "=== GOV.0 Stream Open Gate ==="
echo ""

[ -z "$CONTRACT_FILE" ] && { echo "ERROR: contract file required"; echo "Usage: validate_stream_open.sh <contract_file> [--repo-root <path>]"; exit 1; }
[ -f "$CONTRACT_FILE" ] || { echo "ERROR: contract file not found: $CONTRACT_FILE"; exit 1; }
[ -f "$REGISTRY" ]      || fatal "FAMILY_REGISTRY.md not found at $REGISTRY" "Restore docs/governance/FAMILY_REGISTRY.md"
[ -f "$STREAM_SCHEMA" ] || fatal "STREAM_SCHEMA.md not found" "Restore docs/governance/STREAM_SCHEMA.md"

echo "Contract:   $CONTRACT_FILE"
echo "Registry:   $REGISTRY"
echo "Repo root:  $REPO_ROOT"
echo ""

# ── CONTRACT PARSER ───────────────────────────────────────────────────────────
# Extract value of a block-format field: field name is one line, value follows.
# Handles both "FIELD\nvalue" and "FIELD\n<blank>\nvalue" patterns.
extract_field() {
  local field="$1"
  # Find the line with the field name, grab the next non-empty line
  awk -v f="$field" '
    $0 == f { found=1; next }
    found && /^[[:space:]]*$/ { next }
    found { print; exit }
  ' "$CONTRACT_FILE" | head -1 | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//'
}

# Check if a field exists anywhere in the contract (case-insensitive header match)
field_present() {
  grep -qi "^${1}[[:space:]]*$" "$CONTRACT_FILE" 2>/dev/null
}

# Get full section body after a field marker (multi-line)
extract_section() {
  awk -v f="$1" '
    $0 ~ "^"f"[[:space:]]*$" { found=1; next }
    found && /^[A-Z][A-Z .0-9-]*$/ && length($0) > 2 { exit }
    found { print }
  ' "$CONTRACT_FILE"
}

STREAM_ID="$(extract_field 'STREAM ID')"
DETECTED_FAMILY="$(extract_field 'FAMILY')"
FAMILY_RESOLUTION="$(extract_field 'FAMILY RESOLUTION')"
VALIDATION_COVERAGE="$(extract_field 'VALIDATION COVERAGE')"
FALLBACK_MODE="$(extract_field 'FALLBACK MODE')"
ARTIFACT_MODE="$(extract_field 'ARTIFACT MODE')"

# ── CHECK 1: REQUIRED SCHEMA FIELDS ──────────────────────────────────────────
echo "--- Check 1: Required contract schema fields (STREAM_SCHEMA.md §2) ---"

for required_field in "STREAM ID" "FAMILY" "FAMILY RESOLUTION" "VALIDATION COVERAGE" "OBJECTIVE" "DELTA"; do
  field_present "$required_field" && pass "Field present: $required_field" || fail "Missing required field: $required_field"
done

# FAIL-SAFE RULE — allow both spellings
(field_present "FAIL-SAFE RULE" || field_present "FAIL SAFE") && pass "Field present: FAIL-SAFE RULE" || fail "Missing required field: FAIL-SAFE RULE"
echo ""

# ── CHECK 2: STREAM ID FORMAT ─────────────────────────────────────────────────
echo "--- Check 2: Stream ID ---"
if [ -n "$STREAM_ID" ]; then
  pass "STREAM ID declared: $STREAM_ID"
else
  fail "STREAM ID is empty"
fi
echo ""

# ── CHECK 3: FAMILY RESOLUTION AGAINST REGISTRY ───────────────────────────────
echo "--- Check 3: Family registration (FAMILY_REGISTRY.md) ---"

if [ -z "$DETECTED_FAMILY" ]; then
  fail "FAMILY field is empty"
else
  pass "FAMILY declared: $DETECTED_FAMILY"

  # Extract registered families from registry (status REGISTERED only)
  REGISTERED_FAMILIES=$(grep -E "^\| [A-Z0-9]+ .* REGISTERED" "$REGISTRY" 2>/dev/null | awk -F'|' '{gsub(/[[:space:]]/,"",$2); print $2}' || echo "")
  CANDIDATE_FAMILIES=$(grep -E "^\| [A-Z0-9]+ .* CANDIDATE" "$REGISTRY" 2>/dev/null | awk -F'|' '{gsub(/[[:space:]]/,"",$2); print $2}' || echo "")

  IN_REGISTERED=$(echo "$REGISTERED_FAMILIES" | grep -xF "$DETECTED_FAMILY" || echo "")
  IN_CANDIDATE=$(echo "$CANDIDATE_FAMILIES" | grep -xF "$DETECTED_FAMILY" || echo "")

  if [ -n "$IN_REGISTERED" ]; then
    pass "Family REGISTERED: $DETECTED_FAMILY"

    # Check family definition file exists
    FAMILY_FILE="$FAMILIES_DIR/${DETECTED_FAMILY}.md"
    [ -f "$FAMILY_FILE" ] && pass "Family definition file present: families/${DETECTED_FAMILY}.md" || \
      fatal "Family REGISTERED but definition file missing: $FAMILY_FILE" "Restore family definition file or remove registry entry"

    # Check FAMILY RESOLUTION field consistency
    case "$FAMILY_RESOLUTION" in
      KNOWN)  pass "FAMILY RESOLUTION = KNOWN (consistent)" ;;
      "")     fail "FAMILY RESOLUTION is empty (must be KNOWN for registered family)" ;;
      *)      fail "FAMILY RESOLUTION = '$FAMILY_RESOLUTION' (expected KNOWN for registered family)" ;;
    esac

  elif [ -n "$IN_CANDIDATE" ]; then
    fail "Family is CANDIDATE — compressed execution blocked: $DETECTED_FAMILY"
    warn "Switch to FAMILY_DISCOVERY mode before proceeding with this family"
  else
    fatal "Family '$DETECTED_FAMILY' not found in FAMILY_REGISTRY.md" \
          "Run FAMILY_DISCOVERY $DETECTED_FAMILY to begin registration"
  fi
fi
echo ""

# ── CHECK 4: VALIDATION COVERAGE ──────────────────────────────────────────────
echo "--- Check 4: Validation coverage ---"

case "$VALIDATION_COVERAGE" in
  FULL)
    pass "VALIDATION COVERAGE = FULL"
    ;;
  PARTIAL)
    pass "VALIDATION COVERAGE = PARTIAL"
    # FALLBACK MODE must be declared
    [ -n "$FALLBACK_MODE" ] && pass "FALLBACK MODE declared: $FALLBACK_MODE" || fail "FALLBACK MODE required when VALIDATION COVERAGE = PARTIAL"
    # FAIL-SAFE RULE content must be non-trivial
    FAILSAFE_BODY="$(extract_section 'FAIL-SAFE RULE' 2>/dev/null || extract_section 'FAIL SAFE' 2>/dev/null)"
    FAILSAFE_LEN="${#FAILSAFE_BODY}"
    [ "$FAILSAFE_LEN" -gt 10 ] && pass "FAIL-SAFE RULE has content ($FAILSAFE_LEN chars)" || fail "FAIL-SAFE RULE is empty or placeholder (PARTIAL coverage requires explicit rule)"
    ;;
  NONE)
    fail "VALIDATION COVERAGE = NONE — VALIDATION_DISCOVERY required before compressed execution"
    warn "Invoke VALIDATION_DISCOVERY $DETECTED_FAMILY to define a profile"
    ;;
  "")
    fail "VALIDATION COVERAGE field is empty"
    ;;
  *)
    fail "VALIDATION COVERAGE = '$VALIDATION_COVERAGE' — not a valid value (FULL | PARTIAL | NONE)"
    ;;
esac
echo ""

# ── CHECK 5: ARTIFACT MODE ────────────────────────────────────────────────────
echo "--- Check 5: Artifact mode ---"

case "$ARTIFACT_MODE" in
  PRODUCE|READ|AUDIT|READ-ONLY)
    pass "ARTIFACT MODE declared: $ARTIFACT_MODE"
    ;;
  "")
    fail "ARTIFACT MODE not declared"
    ;;
  *)
    fail "ARTIFACT MODE = '$ARTIFACT_MODE' — unrecognised value (PRODUCE | READ | AUDIT)"
    ;;
esac
echo ""

# ── CHECK 6: PER-STREAM VALIDATOR CREATION ────────────────────────────────────
echo "--- Check 6: Validator reuse policy ---"

# GOV and framework hardening streams are exempt (they create the validators)
IS_FRAMEWORK_STREAM=0
echo "$STREAM_ID $DETECTED_FAMILY" | grep -qiE "^GOV\.|FAMILY: ?GOV|FRAMEWORK|HARDENING" && IS_FRAMEWORK_STREAM=1 || true
[ "$DETECTED_FAMILY" = "GOV" ] && IS_FRAMEWORK_STREAM=1

if [ "$IS_FRAMEWORK_STREAM" -eq 1 ]; then
  pass "Framework/GOV stream — validator creation exempt from reuse check"
else
  # Check if DELTA or STREAM-SPECIFIC INSTRUCTIONS mention creating per-stream validate_ scripts
  STREAM_ID_SLUG=$(echo "$STREAM_ID" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9')
  # Exclude lines referencing scripts/governance/ — those are shared scripts, not per-stream creation
  VALIDATOR_CREATION=$(grep -iE "create.*validat|validat.*script|validate_[a-z].*\.sh|scripts/pios/[a-z0-9]+/validate_" "$CONTRACT_FILE" 2>/dev/null | grep -v "scripts/governance/" || echo "")

  if [ -n "$VALIDATOR_CREATION" ]; then
    # Check if shared parameterized equivalents exist (GOV.2 created these)
    SHARED_ZERO_DELTA="$REPO_ROOT/scripts/governance/validate_zero_delta.sh"
    SHARED_GIT_HYGIENE="$REPO_ROOT/scripts/governance/validate_git_hygiene.sh"
    SHARED_CONTRACT="$REPO_ROOT/scripts/governance/validate_contract.sh"

    SHARED_EXISTS=0
    [ -f "$SHARED_ZERO_DELTA" ] && SHARED_EXISTS=1
    [ -f "$SHARED_GIT_HYGIENE" ] && SHARED_EXISTS=1
    [ -f "$SHARED_CONTRACT" ]    && SHARED_EXISTS=1

    if [ "$SHARED_EXISTS" -eq 1 ]; then
      # Shared scripts exist — per-stream creation is now a hard violation (GOV.2 promotion)
      fail "Contract creates per-stream validators but shared scripts exist in scripts/governance/ — use those instead (SKILLS.md rule 7)"
    else
      warn "Contract creates per-stream validators — no shared scripts found yet; acceptable for first instantiation"
    fi
  else
    pass "No per-stream validator creation detected"
  fi
fi
echo ""

# ── CHECK 7: DELTA-ONLY FORM ──────────────────────────────────────────────────
echo "--- Check 7: Delta-only form (STREAM_SCHEMA.md §6) ---"

# Detect restated family-invariant content
RESTATEMENT_HITS=()
for forbidden in "STANDARD INVARIANTS" "STATE VOCABULARIES" "STANDARD ARTIFACT SLOTS" "HANDOVER EXPECTATIONS" "KNOWN EXCLUSIONS" "COMPRESSION ELIGIBILITY"; do
  grep -qi "^## $forbidden\|^$forbidden$" "$CONTRACT_FILE" 2>/dev/null && RESTATEMENT_HITS+=("$forbidden") || true
done

if [ ${#RESTATEMENT_HITS[@]} -gt 0 ]; then
  fail "Contract restates family-level content that belongs in the family definition file:"
  for hit in "${RESTATEMENT_HITS[@]}"; do echo "        Restated: $hit"; done
else
  pass "No family-invariant restatement detected"
fi

# Line count heuristic — contracts > 120 lines are likely over-narrating
CONTRACT_LINES=$(wc -l < "$CONTRACT_FILE" | tr -d ' ')
if [ "$CONTRACT_LINES" -gt 120 ]; then
  warn "Contract is $CONTRACT_LINES lines — may contain non-delta narration (target: ≤80 lines for compressed streams)"
else
  pass "Contract length: $CONTRACT_LINES lines (within delta-only target)"
fi
echo ""

# ── CHECK 8: FAIL-SAFE RULE SUBSTANCE ─────────────────────────────────────────
echo "--- Check 8: Fail-safe rule substance ---"

FAILSAFE_CONTENT=$(grep -A3 -iE "^FAIL.SAFE RULE[[:space:]]*$" "$CONTRACT_FILE" 2>/dev/null | tail -3 || echo "")
PLACEHOLDER_HITS=0
if echo "$FAILSAFE_CONTENT" | grep -qiE "^\{\{|^none$|^tbd$|^n/a$" 2>/dev/null; then PLACEHOLDER_HITS=1; fi

if [ "$PLACEHOLDER_HITS" -gt 0 ]; then
  fail "FAIL-SAFE RULE contains placeholder content — must declare explicit trigger condition and engine response"
elif [ -z "$FAILSAFE_CONTENT" ]; then
  fail "FAIL-SAFE RULE body is empty"
else
  pass "FAIL-SAFE RULE has substantive content"
fi
echo ""

# ── SUMMARY ────────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════"
echo "Stream:    ${STREAM_ID:-unknown}"
echo "Family:    ${DETECTED_FAMILY:-unknown}"
echo "PASS:      $PASS"
echo "FAIL:      $FAIL"

if [ ${#WARNS[@]} -gt 0 ]; then
  echo "WARNINGS:  ${#WARNS[@]}"
  for w in "${WARNS[@]}"; do echo "  ! $w"; done
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "STREAM OPEN GATE: PASS"
  echo "Execution is authorized."
  exit 0
else
  echo "STREAM OPEN GATE: FAIL"
  echo "Execution is BLOCKED. Resolve $FAIL failure(s) before proceeding."
  exit 1
fi
