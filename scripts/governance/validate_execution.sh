#!/usr/bin/env bash
# GOV.1 — Execution Gate
# Post-execution validator. Must be called before RETURN_CONTRACT.
# Blocks: validator duplication, run namespace duplication, artifact inflation,
#         non-delta artifact production, git hygiene violations, baseline mutation.
#
# Usage:
#   ./validate_execution.sh <repo_root> <stream_id> <target_namespace> [options]
#
# Options:
#   --reference-run <path>   explicit reference run for duplication check
#   --gov-stream             mark as GOV/framework stream (exempts validator-creation check)
#   --baseline-dirs <dirs>   colon-separated baseline dirs to protect (default: built-in set)
#
# Exit codes:
#   0 = PASS
#   1 = FAIL (one or more violations)

set -euo pipefail

# ── ARGS ──────────────────────────────────────────────────────────────────────
REPO_ROOT="${1:-}"
STREAM_ID="${2:-}"
TARGET_NS="${3:-}"
REFERENCE_RUN=""
IS_GOV_STREAM=0
BASELINE_DIRS=""

shift 3 2>/dev/null || true
while [[ $# -gt 0 ]]; do
  case "$1" in
    --reference-run)  REFERENCE_RUN="$2"; shift 2 ;;
    --gov-stream)     IS_GOV_STREAM=1; shift ;;
    --baseline-dirs)  BASELINE_DIRS="$2"; shift 2 ;;
    --artifact-max)   GOVERNANCE_SLOT_MAX_OVERRIDE="$2"; shift 2 ;;
    *) shift ;;
  esac
done

if [ -z "$REPO_ROOT" ] || [ -z "$STREAM_ID" ] || [ -z "$TARGET_NS" ]; then
  echo "ERROR: usage: validate_execution.sh <repo_root> <stream_id> <target_namespace>"
  echo "       optional: --reference-run <path> --gov-stream --baseline-dirs <colon-sep>"
  exit 1
fi

# Resolve target namespace to absolute path
[[ "$TARGET_NS" != /* ]] && TARGET_NS="$REPO_ROOT/$TARGET_NS"

# Derive stream slug: "IG.5" → "ig5", "GOV.1" → "gov1", "EX.2" → "ex2"
STREAM_SLUG=$(echo "$STREAM_ID" | tr '[:upper:]' '[:lower:]' | tr -d '. -')

# Derive governance artifact dir from stream_id
GOV_ARTIFACT_DIR="$REPO_ROOT/docs/pios/${STREAM_ID}"

# Default baseline directories
if [ -z "$BASELINE_DIRS" ]; then
  BASELINE_DIRS="docs/pios/40.2:docs/pios/40.3:docs/pios/40.4"
fi

# Auto-detect GOV stream from ID prefix
echo "$STREAM_ID" | grep -qiE "^GOV\." && IS_GOV_STREAM=1 || true

# ── OUTPUT HELPERS ────────────────────────────────────────────────────────────
PASS=0; FAIL=0
VIOLATIONS=()

pass()  { echo "  PASS  $1"; PASS=$((PASS+1)); }
fail()  { echo "  FAIL  [$2] $1"; FAIL=$((FAIL+1)); VIOLATIONS+=("$2: $1"); }
info()  { echo "  INFO  $1"; }

# ── NORMALIZATION (strips all provenance-only differences) ────────────────────
normalize_file() {
  sed -E \
    -e 's/run_id: .*/run_id: __NORM__/' \
    -e 's/contract: .*/contract: __NORM__/' \
    -e 's/upstream_contract: .*/upstream_contract: __NORM__/' \
    -e 's/date: [0-9]{4}-[0-9]{2}-[0-9]{2}/date: __NORM__/' \
    -e 's/regeneration_context: .*/regeneration_context: __NORM__/' \
    -e 's/adapter_binding: .*/adapter_binding: __NORM__/' \
    -e 's/github_[a-z_]+: .*/github_field: __NORM__/' \
    -e 's/jira_[a-z_]+: .*/jira_field: __NORM__/' \
    -e 's/orchestration_[a-z_]+: .*/orch_field: __NORM__/' \
    -e 's/source_profile_[a-z_]+: .*/profile_field: __NORM__/' \
    -e 's/resolved\.[a-z_]+: .*/resolved_field: __NORM__/' \
    -e 's|runs/run_[a-z0-9_]+/|runs/__RUN__/|g' \
    -e 's/run_[0-9]{2}_[a-z_]+/__RUN__/g' \
    "$1"
}

echo "=== GOV.1 Execution Gate ==="
echo "Stream:     $STREAM_ID  (slug: $STREAM_SLUG)"
echo "Namespace:  $TARGET_NS"
echo "Repo root:  $REPO_ROOT"
[ -n "$REFERENCE_RUN" ] && echo "Reference:  $REFERENCE_RUN"
[ "$IS_GOV_STREAM" -eq 1 ] && echo "Mode:       GOV/framework stream (validator exemption active)"
echo ""

# ── CHECK 1: VALIDATOR DUPLICATION ────────────────────────────────────────────
echo "--- Check 1: Validator reuse (VALIDATOR_DUPLICATION) ---"

if [ "$IS_GOV_STREAM" -eq 1 ]; then
  pass "GOV/framework stream — validator creation in scripts/governance/ is authorized"
else
  # Scan for per-stream validators in any scripts/pios/<slug>/ directory
  PER_STREAM_DIR="$REPO_ROOT/scripts/pios/$STREAM_SLUG"
  if [ -d "$PER_STREAM_DIR" ]; then
    FOUND_VALIDATORS=$(find "$PER_STREAM_DIR" -name "validate_*.sh" 2>/dev/null | sort)
    if [ -n "$FOUND_VALIDATORS" ]; then
      fail "Per-stream validators found in $PER_STREAM_DIR — use scripts/governance/validate_*.sh instead:" \
           "VALIDATOR_DUPLICATION"
      echo "$FOUND_VALIDATORS" | while read -r v; do echo "        $v"; done
    else
      pass "No per-stream validators in scripts/pios/$STREAM_SLUG/"
    fi
  else
    pass "No per-stream scripts directory found (scripts/pios/$STREAM_SLUG/ absent)"
  fi

  # Also scan all pios subdirs — catch any validate_* that don't belong to governance
  ALL_PERSTREAM=$(find "$REPO_ROOT/scripts/pios" -name "validate_*.sh" 2>/dev/null | sort)
  if [ -n "$ALL_PERSTREAM" ]; then
    COUNT=$(echo "$ALL_PERSTREAM" | wc -l | tr -d ' ')
    fail "$COUNT per-stream validate_*.sh scripts exist across scripts/pios/ — consolidation required" \
         "VALIDATOR_DUPLICATION_GLOBAL"
    echo "$ALL_PERSTREAM" | head -5 | while read -r v; do echo "        $v"; done
    [ "$COUNT" -gt 5 ] && echo "        ... ($(echo "$ALL_PERSTREAM" | wc -l | tr -d ' ') total)"
  else
    pass "No per-stream validators across scripts/pios/ (global clean)"
  fi
fi
echo ""

# ── CHECK 2: RUN NAMESPACE DUPLICATION ───────────────────────────────────────
echo "--- Check 2: Run namespace duplication (RUN_DUPLICATION) ---"

RUNS_DIR="$REPO_ROOT/docs/pios/runs"
TARGET_40X_COUNT=0

if [ -d "$TARGET_NS/40.2" ] || [ -d "$TARGET_NS/40.3" ] || [ -d "$TARGET_NS/40.4" ]; then
  TARGET_40X_COUNT=$(find "$TARGET_NS/40.2" "$TARGET_NS/40.3" "$TARGET_NS/40.4" \
                          -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  info "Target namespace has $TARGET_40X_COUNT governed 40.x artifacts"

  if [ "$TARGET_40X_COUNT" -gt 0 ]; then
    DUPLICATION_FOUND=0
    REFERENCE_RUNS=""

    # If reference run provided, check only that; else scan all comparable runs
    if [ -n "$REFERENCE_RUN" ] && [ -d "$REFERENCE_RUN" ]; then
      REFERENCE_RUNS="$REFERENCE_RUN"
    else
      # Find runs with identical file count — candidate duplicates
      for run_dir in "$RUNS_DIR"/*/; do
        [ "$run_dir" = "$TARGET_NS/" ] && continue
        [ ! -d "$run_dir" ] && continue
        ref_count=$(find "$run_dir/40.2" "$run_dir/40.3" "$run_dir/40.4" \
                         -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
        [ "$ref_count" -eq "$TARGET_40X_COUNT" ] && REFERENCE_RUNS="$REFERENCE_RUNS $run_dir"
      done
    fi

    for ref in $REFERENCE_RUNS; do
      [ -z "$ref" ] && continue
      ref_name="$(basename "$ref")"
      # Sample 3 files for efficiency — if all 3 are identical post-normalization, flag duplication
      SAMPLE_FILES=$(find "$ref/40.2" "$ref/40.3" "$ref/40.4" -name "*.md" 2>/dev/null | sort | head -3)
      sample_drift=0
      for f in $SAMPLE_FILES; do
        rel="${f#$ref/}"
        t="$TARGET_NS/$rel"
        [ ! -f "$t" ] && continue
        diff_lines=$(diff <(normalize_file "$f") <(normalize_file "$t") 2>/dev/null | wc -l | tr -d ' ') || true
        [ "$diff_lines" -gt 0 ] && sample_drift=$((sample_drift + diff_lines))
      done

      if [ "$sample_drift" -eq 0 ]; then
        fail "Target namespace is a provenance-only copy of $ref_name — use diff-based verification instead" \
             "RUN_DUPLICATION"
        DUPLICATION_FOUND=1
      else
        pass "Target differs semantically from $ref_name (normalized drift: $sample_drift lines)"
      fi
    done

    [ "$DUPLICATION_FOUND" -eq 0 ] && [ -z "$REFERENCE_RUNS" ] && \
      pass "No comparable runs found for duplication check"
  else
    info "No 40.x artifacts in target namespace — duplication check not applicable"
    pass "Run duplication check: N/A (no 40.x content)"
  fi
else
  info "Target namespace has no 40.x layer directories"
  pass "Run duplication check: N/A (no 40.x structure)"
fi
echo ""

# ── CHECK 3: ARTIFACT INFLATION ───────────────────────────────────────────────
echo "--- Check 3: Governance artifact inflation (ARTIFACT_INFLATION) ---"

GOVERNANCE_SLOT_MAX="${GOVERNANCE_SLOT_MAX_OVERRIDE:-7}"   # default 7-slot; override via --artifact-max N

if [ -d "$GOV_ARTIFACT_DIR" ]; then
  GOV_COUNT=$(find "$GOV_ARTIFACT_DIR" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  info "Governance artifacts in docs/pios/$STREAM_ID/: $GOV_COUNT (max: $GOVERNANCE_SLOT_MAX)"

  if [ "$GOV_COUNT" -gt "$GOVERNANCE_SLOT_MAX" ]; then
    fail "$GOV_COUNT governance artifacts exceed 7-slot GOVERNANCE_PACK standard" \
         "ARTIFACT_INFLATION"
  else
    pass "Governance artifact count within limit: $GOV_COUNT ≤ $GOVERNANCE_SLOT_MAX"
  fi

  # Detect repeated structure blocks — same H2/H3 section headings across >2 files
  ALL_SECTIONS=$(find "$GOV_ARTIFACT_DIR" -name "*.md" -exec grep -h "^## \|^### " {} \; 2>/dev/null | \
                 sort | uniq -c | sort -rn | awk '$1 >= 3 {print $0}')
  if [ -n "$ALL_SECTIONS" ]; then
    REPEATED_COUNT=$(echo "$ALL_SECTIONS" | wc -l | tr -d ' ')
    fail "$REPEATED_COUNT section heading(s) appear ≥3 times across governance artifacts — use templates" \
         "ARTIFACT_INFLATION_STRUCTURE"
    echo "$ALL_SECTIONS" | head -5 | while read -r line; do echo "        $line"; done
  else
    pass "No repeated section headings detected across governance artifacts"
  fi
else
  info "No governance artifact directory found at docs/pios/$STREAM_ID/ — skipping inflation check"
  pass "Artifact inflation: N/A (no governance dir)"
fi
echo ""

# ── CHECK 4: DELTA-ONLY PRODUCTION ────────────────────────────────────────────
echo "--- Check 4: Delta-only artifact production (NON_DELTA_OUTPUT) ---"

if [ -d "$GOV_ARTIFACT_DIR" ] && [ "$GOV_COUNT" -gt 0 ] 2>/dev/null; then
  NON_DELTA_FOUND=0

  # Find the most recent peer stream's governance dir (same family prefix)
  FAMILY_PREFIX=$(echo "$STREAM_ID" | sed 's/\.[0-9]*$//')
  PEER_DIRS=$(find "$REPO_ROOT/docs/pios" -maxdepth 1 -type d -name "${FAMILY_PREFIX}.*" ! -path "$GOV_ARTIFACT_DIR" 2>/dev/null | sort | tail -2)

  for peer_dir in $PEER_DIRS; do
    [ ! -d "$peer_dir" ] && continue
    peer_name="$(basename "$peer_dir")"

    # For each file in target, find same-named file in peer
    while IFS= read -r -d '' art_file; do
      art_name="$(basename "$art_file")"
      # Strip stream-specific prefix to find peer equivalent (e.g., IG.5_FOO.md → look for *_FOO.md)
      base_suffix=$(echo "$art_name" | sed "s/^${STREAM_ID}_//i" | sed "s/^${FAMILY_PREFIX}[0-9]*_//i")
      peer_file=$(find "$peer_dir" -name "*${base_suffix}" 2>/dev/null | head -1)

      if [ -n "$peer_file" ] && [ -f "$peer_file" ]; then
        # Normalize both (strip headers, stream IDs, dates)
        norm_self=$(normalize_file "$art_file" | sed "s/${STREAM_ID}/__STREAM__/gi; s/${STREAM_SLUG}/__STREAM__/gi")
        norm_peer=$(normalize_file "$peer_file" | sed "s/$(basename "$peer_dir")/__STREAM__/gi")
        diff_lines=$(diff <(echo "$norm_self") <(echo "$norm_peer") 2>/dev/null | grep "^[<>]" | wc -l | tr -d ' ') || true
        total_lines=$(wc -l < "$art_file" | tr -d ' ')
        delta_pct=100
        [ "$total_lines" -gt 0 ] && delta_pct=$(( (diff_lines * 100) / total_lines ))

        if [ "$delta_pct" -lt 15 ]; then
          fail "$art_name is <15% different from peer $peer_name/$(basename "$peer_file") — template fill required" \
               "NON_DELTA_OUTPUT"
          NON_DELTA_FOUND=1
        fi
      fi
    done < <(find "$GOV_ARTIFACT_DIR" -name "*.md" -print0 2>/dev/null)
    break  # check against most recent peer only
  done

  [ "$NON_DELTA_FOUND" -eq 0 ] && pass "Governance artifacts contain sufficient delta vs peer stream(s)"
else
  pass "Delta production check: N/A (no governance artifacts or dir)"
fi
echo ""

# ── CHECK 5: GIT HYGIENE ──────────────────────────────────────────────────────
echo "--- Check 5: Git hygiene (GIT_DIRTY) ---"

cd "$REPO_ROOT"
GIT_STATUS=$(git status --porcelain 2>/dev/null || echo "GIT_ERROR")

if [ "$GIT_STATUS" = "GIT_ERROR" ]; then
  fail "git status failed — cannot determine working tree state" "GIT_DIRTY"
else
  # Categorize each dirty file
  UNEXPECTED_FILES=()
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    status_code="${line:0:2}"
    filepath="${line:3}"

    # Determine if this file is within the expected scope of this stream
    expected=0
    # Target namespace
    [[ "$filepath" == "${TARGET_NS#$REPO_ROOT/}"* ]]  && expected=1
    # Governance artifacts for this stream
    [[ "$filepath" == "docs/pios/${STREAM_ID}/"* ]]    && expected=1
    # Governance scripts (always expected in GOV streams; tolerated in others as they're shared)
    [[ "$filepath" == "scripts/governance/"* ]]         && expected=1
    # Per-stream scripts (expected but may trigger validator check)
    [[ "$filepath" == "scripts/pios/${STREAM_SLUG}/"* ]] && expected=1
    # Contract file
    [[ "$filepath" == "claude/"* ]]                     && expected=1

    if [ "$expected" -eq 0 ]; then
      # Truly unexpected — not under any expected scope
      UNEXPECTED_FILES+=("$status_code $filepath")
    fi
  done <<< "$GIT_STATUS"

  if [ ${#UNEXPECTED_FILES[@]} -gt 0 ]; then
    fail "${#UNEXPECTED_FILES[@]} unexpected file(s) outside stream scope in working tree" "GIT_DIRTY"
    for uf in "${UNEXPECTED_FILES[@]}"; do echo "        $uf"; done
  else
    TOTAL_DIRTY=$(echo "$GIT_STATUS" | grep -c "." || echo "0")
    pass "Working tree is scope-clean ($TOTAL_DIRTY file(s) within expected stream scope)"
  fi
fi
echo ""

# ── CHECK 6: BASELINE PROTECTION ─────────────────────────────────────────────
echo "--- Check 6: Baseline protection (BASELINE_MUTATION) ---"

cd "$REPO_ROOT"
IFS=':' read -ra BDIRS <<< "$BASELINE_DIRS"
BASELINE_MUTATED=0

for bdir in "${BDIRS[@]}"; do
  bdir="${bdir#$REPO_ROOT/}"  # normalise to relative
  DIFF_OUT=$(git diff --name-only HEAD -- "$bdir" 2>/dev/null)
  if [ -n "$DIFF_OUT" ]; then
    fail "Baseline directory modified: $bdir" "BASELINE_MUTATION"
    echo "$DIFF_OUT" | while read -r f; do echo "        MODIFIED: $f"; done
    BASELINE_MUTATED=1
  else
    pass "Baseline directory clean: $bdir"
  fi
done

# Verify baseline anchor tags still exist
for anchor in pios-core-v0.4-final demo-execlens-v1-final governance-v1-final; do
  git rev-parse "$anchor" > /dev/null 2>&1 && pass "Baseline anchor intact: $anchor" || \
    fail "Baseline anchor missing: $anchor" "BASELINE_MUTATION"
done
echo ""

# ── SUMMARY ───────────────────────────────────────────────────────────────────
echo "═══════════════════════════════════════════════════"
echo "Stream:     $STREAM_ID"
echo "Namespace:  $TARGET_NS"
echo "PASS:       $PASS"
echo "FAIL:       $FAIL"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "VIOLATIONS:"
  for v in "${VIOLATIONS[@]}"; do echo "  ✗ $v"; done
  echo ""
  echo "EXECUTION GATE: FAIL"
  echo "RETURN_CONTRACT is BLOCKED. Resolve violations before closing stream."
  exit 1
else
  echo ""
  echo "EXECUTION GATE: PASS"
  echo "RETURN_CONTRACT is authorized."
  exit 0
fi
