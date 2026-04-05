#!/usr/bin/env bash
# GOV-AUTOMATION.0 — PSEE-GAUGE.0 Deterministic Validator
#
# Authority: docs/pios/PSEE-GAUGE.0/validation/GOV-AUTOMATION.0/
# Implements 7 checks per GOV-AUTOMATION.0 stream contract
#
# Usage:  bash scripts/governance/validate_psee_gauge.sh [--gauge-dir <path>]
# Exit:   0 = GOV.1 PASS / 1 = GOV.1 FAIL
#
# Rules:
#   - No mutation of repository
#   - No external dependencies
#   - Deterministic output on every run

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────

GAUGE_DIR="${GAUGE_DIR:-docs/pios/PSEE-GAUGE.0}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

# ── Result tracking ────────────────────────────────────────────────────────────

FAIL_COUNT=0
declare -a RESULTS

_pass() {
  local id="$1" desc="$2"
  RESULTS+=("PASS  CHECK-${id}: ${desc}")
}

_fail() {
  local id="$1" desc="$2" reason="$3"
  RESULTS+=("FAIL  CHECK-${id}: ${desc} — ${reason}")
  FAIL_COUNT=$(( FAIL_COUNT + 1 ))
}

# ── CHECK 1 — Artifact Count ───────────────────────────────────────────────────
# Exactly 8 .md files at the root of PSEE-GAUGE.0 (no subdirectories counted)

if [ ! -d "$GAUGE_DIR" ]; then
  echo "ERROR: GAUGE_DIR not found: $GAUGE_DIR" >&2
  exit 1
fi

ARTIFACT_COUNT=$(find "$GAUGE_DIR" -maxdepth 1 -name "*.md" | wc -l | tr -d '[:space:]')

if [ "$ARTIFACT_COUNT" -eq 8 ]; then
  _pass 1 "Artifact count = 8"
else
  _fail 1 "Artifact count" "Expected 8, found ${ARTIFACT_COUNT}"
fi

# ── CHECK 2 — Required Files ───────────────────────────────────────────────────
# All 8 mandated artifacts must be present with exact names

REQUIRED_FILES=(
  "gauge_score_model.md"
  "dimension_projection_model.md"
  "confidence_and_variance_model.md"
  "review_surface_linkage.md"
  "projection_logic_spec.md"
  "operator_visibility_contract.md"
  "gauge_rendering_contract.md"
  "execution_manifest.md"
)

CHECK2_OK=true
MISSING_FILES=()

for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "${GAUGE_DIR}/${f}" ]; then
    MISSING_FILES+=("$f")
    CHECK2_OK=false
  fi
done

if $CHECK2_OK; then
  _pass 2 "All 8 required files present"
else
  _fail 2 "Required files" "Missing: ${MISSING_FILES[*]}"
fi

# ── CHECK 3 — Namespace Integrity ─────────────────────────────────────────────
# No upstream PSEE artifacts may have been modified outside PSEE-GAUGE.0 namespace

UPSTREAM_PATHS=(
  "docs/pios/PSEE.1"
  "docs/pios/PSEE.2"
  "docs/pios/PSEE-OPS.0"
  "docs/pios/PSEE.X"
  "docs/governance"
)

CHECK3_OK=true
DIRTY_PATHS=()

for p in "${UPSTREAM_PATHS[@]}"; do
  if [ -d "$p" ]; then
    MODIFIED=$(git diff --name-only HEAD -- "$p" 2>/dev/null || true)
    if [ -n "$MODIFIED" ]; then
      DIRTY_PATHS+=("$p")
      CHECK3_OK=false
    fi
  fi
done

if $CHECK3_OK; then
  _pass 3 "Namespace integrity: no upstream artifact mutations"
else
  _fail 3 "Namespace integrity" "Upstream paths modified: ${DIRTY_PATHS[*]}"
fi

# ── CHECK 4 — Traceability Markers ────────────────────────────────────────────
# Key traceability markers must be present in their designated artifacts:
#   DP-  → gauge_score_model.md and dimension_projection_model.md (decision point authority)
#   NCB- → review_surface_linkage.md (non-canonical boundary rules)
#   PR-  → projection_logic_spec.md (projection rules)

declare -A TRACE_MAP=(
  ["DP-"]="${GAUGE_DIR}/gauge_score_model.md"
  ["NCB-"]="${GAUGE_DIR}/review_surface_linkage.md"
  ["PR-"]="${GAUGE_DIR}/projection_logic_spec.md"
)

CHECK4_OK=true
TRACE_MISSING=()

for pattern in "${!TRACE_MAP[@]}"; do
  target_file="${TRACE_MAP[$pattern]}"
  if [ -f "$target_file" ]; then
    if ! grep -q "$pattern" "$target_file" 2>/dev/null; then
      TRACE_MISSING+=("'${pattern}' not found in $(basename "$target_file")")
      CHECK4_OK=false
    fi
  else
    TRACE_MISSING+=("target file missing: $target_file")
    CHECK4_OK=false
  fi
done

if $CHECK4_OK; then
  _pass 4 "Traceability markers present (DP-, NCB-, PR-)"
else
  _fail 4 "Traceability markers" "${TRACE_MISSING[*]}"
fi

# ── CHECK 5 — Forbidden CP-xx Pattern Usage ───────────────────────────────────
# CP-[digit] identifiers (actual PSEE.X candidate pattern IDs) must not appear
# in gauge_score_model.md or projection_logic_spec.md.
# These are the primary formula authority files; any CP-xx presence indicates
# a non-canonical authority leak into gauge scoring logic.

FORMULA_AUTHORITY_FILES=(
  "${GAUGE_DIR}/gauge_score_model.md"
  "${GAUGE_DIR}/projection_logic_spec.md"
)

CHECK5_OK=true
CP5_VIOLATIONS=()

for f in "${FORMULA_AUTHORITY_FILES[@]}"; do
  if [ -f "$f" ]; then
    # Match CP- followed by a digit: catches CP-01..CP-99 (actual PSEE.X IDs)
    # Does NOT match "CP-xx" (literal placeholder text used in prohibition statements)
    HITS=$(grep -n "CP-[0-9]" "$f" 2>/dev/null || true)
    if [ -n "$HITS" ]; then
      CP5_VIOLATIONS+=("$(basename "$f")")
      CHECK5_OK=false
    fi
  fi
done

if $CHECK5_OK; then
  _pass 5 "No CP-xx usage in score and projection formula files"
else
  _fail 5 "Forbidden CP-xx usage" "CP-[digit] found in: ${CP5_VIOLATIONS[*]}"
fi

# ── CHECK 6 — PSEE.X Boundary ─────────────────────────────────────────────────
# CP-[digit] identifiers must not appear in the three formula authority files
# (score, dimension, projection). These files define gauge computation logic.
# PSEE.X content is permitted only in review_surface_linkage.md (the designated
# review surface) and in documentary/negation contexts elsewhere.

FORMULA_FILES=(
  "${GAUGE_DIR}/gauge_score_model.md"
  "${GAUGE_DIR}/dimension_projection_model.md"
  "${GAUGE_DIR}/projection_logic_spec.md"
)

CHECK6_OK=true
CP6_VIOLATIONS=()

for f in "${FORMULA_FILES[@]}"; do
  if [ -f "$f" ]; then
    HITS=$(grep -n "CP-[0-9]" "$f" 2>/dev/null || true)
    if [ -n "$HITS" ]; then
      CP6_VIOLATIONS+=("$(basename "$f")")
      CHECK6_OK=false
    fi
  fi
done

if $CHECK6_OK; then
  _pass 6 "PSEE.X boundary: no CP-xx in formula authority files"
else
  _fail 6 "PSEE.X boundary violation" "CP-xx found in formula files: ${CP6_VIOLATIONS[*]}"
fi

# ── CHECK 7 — No UI / Commercial Leakage ──────────────────────────────────────
# Content artifacts must contain no frontend code constructs or commercial language.
# Scope: 7 content artifacts (execution_manifest.md excluded — governance record
#        that legitimately names downstream technologies in handover section).
# Detection: actual code patterns and commercial terminology, not documentary
#            mentions of what is excluded.

CONTENT_FILES=(
  "${GAUGE_DIR}/gauge_score_model.md"
  "${GAUGE_DIR}/dimension_projection_model.md"
  "${GAUGE_DIR}/confidence_and_variance_model.md"
  "${GAUGE_DIR}/review_surface_linkage.md"
  "${GAUGE_DIR}/projection_logic_spec.md"
  "${GAUGE_DIR}/operator_visibility_contract.md"
  "${GAUGE_DIR}/gauge_rendering_contract.md"
)

# Frontend code patterns — actual code constructs, not documentation
FORBIDDEN_CODE_PATTERNS=(
  "import React"
  "from 'react'"
  'from "react"'
  "React\."
  "useState("
  "useEffect("
  "className="
  "<div>"
  "<span>"
  "<button>"
  "<input"
  "\.css\""
  "\.scss\""
  "style={"
)

# Commercial language patterns
FORBIDDEN_COMMERCIAL_PATTERNS=(
  "pricing"
  "revenue"
  "monetiz"
  "go-to-market"
  "market-leading"
  "enterprise-grade"
  "ROI\b"
)

CHECK7_OK=true
C7_VIOLATIONS=()

for f in "${CONTENT_FILES[@]}"; do
  if [ -f "$f" ]; then
    for pattern in "${FORBIDDEN_CODE_PATTERNS[@]}" "${FORBIDDEN_COMMERCIAL_PATTERNS[@]}"; do
      HITS=$(grep -n "$pattern" "$f" 2>/dev/null || true)
      if [ -n "$HITS" ]; then
        C7_VIOLATIONS+=("$(basename "$f") [pattern: $pattern]")
        CHECK7_OK=false
      fi
    done
  fi
done

if $CHECK7_OK; then
  _pass 7 "No UI/commercial leakage in content artifacts"
else
  _fail 7 "UI/commercial leakage" "Found violations: ${C7_VIOLATIONS[*]}"
fi

# ── Final Output ───────────────────────────────────────────────────────────────

TOTAL_CHECKS=${#RESULTS[@]}
PASS_COUNT=$(( TOTAL_CHECKS - FAIL_COUNT ))

printf "\n"
printf "═══════════════════════════════════════════════════════════\n"
printf "GOV-AUTOMATION.0 — PSEE-GAUGE.0 Validator\n"
printf "Validated:  %s\n" "$GAUGE_DIR"
printf "Run at:     %s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf "═══════════════════════════════════════════════════════════\n"
printf "\n"

for r in "${RESULTS[@]}"; do
  printf "  %s\n" "$r"
done

printf "\n"
printf "───────────────────────────────────────────────────────────\n"
printf "  Checks run:  %d\n" "$TOTAL_CHECKS"
printf "  PASS:        %d\n" "$PASS_COUNT"
printf "  FAIL:        %d\n" "$FAIL_COUNT"
printf "───────────────────────────────────────────────────────────\n"
printf "\n"

if [ "$FAIL_COUNT" -eq 0 ]; then
  printf "  GOV.1 PASS — PSEE-GAUGE.0 validation complete\n\n"
  exit 0
else
  printf "  GOV.1 FAIL — %d check(s) failed. PSEE-GAUGE.0 non-compliant.\n\n" "$FAIL_COUNT"
  exit 1
fi
