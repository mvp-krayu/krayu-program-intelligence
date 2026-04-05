#!/usr/bin/env bash
# PSEE-RUNTIME.2 — Gauge View Renderer
#
# Usage:
#   render_gauge_view.sh <rhp_input_root> <runtime_dir>
#
# Reads:   <runtime_dir>/operator_case_view.md   (PSEE.RUNTIME output — read-only)
#          <runtime_dir>/manifest.json            (PSEE.RUNTIME output — read-only)
#          PSEE-GAUGE.0 surface contract files    (read-only)
# Writes:  <runtime_dir>/gauge_view.json          (machine-consumable)
#
# Rules:
#   - deterministic: same inputs → same gauge_view.json
#   - read-only on all inputs
#   - writes only to <runtime_dir>/
#   - no score recomputation
#   - no PSEE.X candidate patterns as active logic
#   - no markdown, no narrative in gauge_view.json

set -euo pipefail

RHP_ROOT="${1:-}"
RUNTIME_DIR="${2:-}"

if [ -z "$RHP_ROOT" ] || [ -z "$RUNTIME_DIR" ]; then
  echo "ERROR: usage: render_gauge_view.sh <rhp_input_root> <runtime_dir>"
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
[[ "$RHP_ROOT"    != /* ]] && RHP_ROOT="$REPO_ROOT/$RHP_ROOT"
[[ "$RUNTIME_DIR" != /* ]] && RUNTIME_DIR="$REPO_ROOT/$RUNTIME_DIR"

# ── FAIL-SAFE: FORBIDDEN INPUT PATHS ─────────────────────────────────────────
for forbidden in \
  "$REPO_ROOT/docs/pios/IG.5" \
  "$REPO_ROOT/docs/pios/IG.6" \
  "$REPO_ROOT/docs/pios/IG.7" \
  "$REPO_ROOT/docs/pios/PSEE.3" \
  "$REPO_ROOT/docs/pios/PSEE.3B" \
  "$REPO_ROOT/docs/pios/PSEE.UI"; do
  if [[ "$RHP_ROOT" == "$forbidden"* ]] || [[ "$RUNTIME_DIR" == "$forbidden"* ]]; then
    echo "FAIL_SAFE_STOP: forbidden input path — $RHP_ROOT / $RUNTIME_DIR"
    exit 1
  fi
done

# ── REQUIRED INPUT FILES ──────────────────────────────────────────────────────
OCV="$RUNTIME_DIR/operator_case_view.md"
MANIFEST="$RUNTIME_DIR/manifest.json"

[ -f "$OCV" ]      || { echo "FAIL_SAFE_STOP: operator_case_view.md not found: $OCV"; exit 1; }
[ -f "$MANIFEST" ] || { echo "FAIL_SAFE_STOP: manifest.json not found: $MANIFEST"; exit 1; }

# ── EXTRACT FIELDS FROM operator_case_view.md (deterministic grep) ────────────
extract_ocv() {
  grep -m1 "^| $1 |" "$OCV" 2>/dev/null | awk -F'|' '{gsub(/^[[:space:]]+|[[:space:]]+$/,"",$3); print $3}' || echo "null"
}

extract_scalar() {
  grep -m1 "^$1: " "$OCV" 2>/dev/null | sed "s/^$1: //" | tr -d '\r' || echo "null"
}

RUN_ID="$(extract_scalar 'run_id')"
SOURCE_DATE="$(extract_scalar 'source_date')"
SOURCE_RUN="$(extract_scalar 'source_run')"
BASELINE_COMMIT="$(extract_scalar 'baseline_commit')"
RHP_ROOT_OCV="$(extract_scalar 'rhp_root')"

SRC_KIND="$(extract_ocv 'source_kind')"
SRC_VERSION="$(extract_ocv 'version')"
SRC_ANCHOR="$(extract_ocv 'baseline_anchor')"
SRC_ADMIT="$(extract_ocv 'admissibility')"
SRC_RES="$(extract_ocv 'resolution')"

CURRENT_STATE="$(extract_ocv 'current_state')"
EXEC_MODE="$(extract_ocv 'execution_mode')"
PSEE_ENGINE="$(extract_ocv 'psee_engine_run')"

TOTAL_ADMITTED="$(extract_scalar 'total_admitted')"
TOTAL_EXCLUDED="$(extract_scalar 'total_excluded')"
ADMITTED_CLASS="$(extract_scalar 'admitted_input_class')"

# Derive system_name and system_version from SRC_VERSION (format: name/version)
SYS_NAME="$(echo "$SRC_VERSION" | cut -d'/' -f1)"
SYS_VER="$(echo "$SRC_VERSION" | cut -d'/' -f2)"

# Suppression rule: PANEL-01 score display suppressed until PSEE engine runs
# Use Python-compatible boolean strings
SUPPRESSION_ACTIVE="True"
if [ "$PSEE_ENGINE" = "YES" ]; then SUPPRESSION_ACTIVE="False"; fi

# ── PRODUCE: gauge_view.json (DETERMINISTIC — no timestamps) ──────────────────
GAUGE_VIEW="$RUNTIME_DIR/gauge_view.json"

python3 - << PYEOF > "$GAUGE_VIEW"
import json

gauge = {
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.2",
  "run_id": "${RUN_ID}",
  "source_date": "${SOURCE_DATE}",
  "source_run": "${SOURCE_RUN}",
  "baseline_commit": "${BASELINE_COMMIT}",
  "rhp_root": "${RHP_ROOT_OCV}",
  "rendering_state": "${CURRENT_STATE}",
  "suppression_active": ${SUPPRESSION_ACTIVE},
  "suppression_rule": "PANEL-01 score display suppressed — PSEE engine not yet executed (gauge_rendering_contract.md §PANEL-01 structural rule)",
  "panel_01": {
    "run_id": "${RUN_ID}",
    "system_name": "${SYS_NAME}",
    "system_version": "${SYS_VER}",
    "score_display": {
      "canonical_score": None,
      "band_label": "PENDING",
      "projected_score": None,
      "projection_caveat": "PENDING — PSEE engine not yet executed. Scores available after PSEE execution completes.",
      "suppressed": True,
      "suppression_reason": "current_state=PENDING_PSEE_EXECUTION"
    },
    "confidence_band": {
      "lower": None,
      "upper": None,
      "variance_factors": [],
      "status": "PENDING"
    },
    "state_indicator": {
      "current_state": "${CURRENT_STATE}",
      "state_label": "PENDING",
      "execution_mode": "${EXEC_MODE}",
      "psee_engine_run": "${PSEE_ENGINE}"
    }
  },
  "panel_02": {
    "panel_02a": [
      {
        "dim_id": "DIM-01",
        "label": "Coverage",
        "value": None,
        "state_label": "PENDING",
        "threshold_line": 90,
        "source_field": "PSEEContext.coverage_percent",
        "authority": "DP-5-02; G-08"
      },
      {
        "dim_id": "DIM-02",
        "label": "Reconstruction",
        "value": None,
        "state_label": "PENDING",
        "threshold_line": None,
        "source_field": "PSEEContext.reconstruction_result",
        "authority": "DP-6-01; G-09; O-07"
      },
      {
        "dim_id": "DIM-03",
        "label": "Escalation Clearance",
        "value": None,
        "state_label": "PENDING",
        "threshold_line": None,
        "source_field": "PSEEContext.escalation_log",
        "authority": "ESC-01..06; escalation_interface_spec.md"
      }
    ],
    "panel_02b": {
      "dim_id": "DIM-04",
      "label": "Unknown-Space",
      "total_count": None,
      "breakdown": {
        "US-CONDITION-01": None,
        "US-CONDITION-02": None,
        "US-CONDITION-03": None
      },
      "state_label": "PENDING",
      "drill_down_link": "RL-01",
      "source_field": "PSEEContext.us_records",
      "authority": "US-CONDITION-01..03; unknown_space_interface.md"
    },
    "panel_02c": [
      {
        "dim_id": "DIM-05",
        "label": "Intake Completeness",
        "state": "PENDING",
        "source_field": "PSEEContext.filter_table",
        "authority": "INV-04; G-05"
      },
      {
        "dim_id": "DIM-06",
        "label": "Heuristic Compliance",
        "state": "PENDING",
        "source_field": "PSEEContext.flags",
        "authority": "HeuristicGuard; heuristic_guard_spec.md",
        "note_if_fail": "Engine implementation defect — see flags"
      }
    ]
  },
  "panel_03": {
    "panel_03a": {
      "title": "Pending Adjudications",
      "count": 0,
      "message": "No pending adjudications.",
      "adjudications": []
    },
    "panel_03b": {
      "title": "Open Review Items",
      "non_canonical_label": "NON-CANONICAL — review context only",
      "review_counter": {
        "us_records": None,
        "open_escalations": 0,
        "future_review_queue": 6,
        "reference_patterns": 3
      },
      "links": [
        {"id": "RL-01", "label": "Unknown-Space Inventory",    "target": "PSEE.X/unknown_space_inventory.md"},
        {"id": "RL-02", "label": "Escalated Positions",        "target": "PSEE.X/unknown_space_inventory.md#section-2"},
        {"id": "RL-03", "label": "Pattern Containment",        "target": "PSEE.X/pattern_containment_matrix.md"},
        {"id": "RL-04", "label": "Future Review Queue",        "target": "PSEE.X/future_review_queue.md"}
      ]
    }
  },
  "panel_04": {
    "table": [
      {
        "run_id": "${RUN_ID}",
        "system_name": "${SYS_NAME}",
        "system_version": "${SYS_VER}",
        "final_state": "${CURRENT_STATE}",
        "canonical_score": None,
        "band": "PENDING",
        "coverage_percent": None,
        "us_record_count": None,
        "open_escalations": 0,
        "source_run": "${SOURCE_RUN}",
        "baseline_anchor": "${SRC_ANCHOR}",
        "admissibility": "${SRC_ADMIT}",
        "resolution": "${SRC_RES}"
      }
    ],
    "sort_options": ["canonical_score", "band"],
    "note": "No aggregation or summarization of scores across rows"
  },
  "intake_summary": {
    "total_admitted": ${TOTAL_ADMITTED},
    "total_excluded": ${TOTAL_EXCLUDED},
    "admitted_input_class": "${ADMITTED_CLASS}",
    "rhp_root": "${RHP_ROOT_OCV}"
  },
  "gauge_authority": {
    "score_model": "PSEE-GAUGE.0/gauge_score_model.md",
    "dimension_model": "PSEE-GAUGE.0/dimension_projection_model.md",
    "confidence_model": "PSEE-GAUGE.0/confidence_and_variance_model.md",
    "projection_spec": "PSEE-GAUGE.0/projection_logic_spec.md",
    "rendering_contract": "PSEE-GAUGE.0/gauge_rendering_contract.md",
    "operator_visibility": "PSEE-GAUGE.0/operator_visibility_contract.md"
  }
}

print(json.dumps(gauge, indent=2))
PYEOF

echo ""
echo "=== PSEE-RUNTIME.2 Gauge Renderer ==="
GAUGE_HASH=$(shasum -a 256 "$GAUGE_VIEW" | awk '{print $1}')
echo "Output:       $GAUGE_VIEW"
echo "sha256:       $GAUGE_HASH"
echo ""
echo "RENDER_COMPLETE"
