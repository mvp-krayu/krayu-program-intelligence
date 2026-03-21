#!/usr/bin/env python3
"""
semantic_activation.py
PIOS-42.11-RUN01-CONTRACT-v1 · run_01_blueedge

Semantic Path Activation Switch — Stream 42.11

This module is the single controlled activation point for the semantic
annotation layer defined in 42.10.

Activation is:
  - explicit   (requires setting ACTIVATION_STATUS = "ACTIVATED")
  - inspectable (get_path_state() is read-only and always honest)
  - reversible  (set ACTIVATION_STATUS = "NOT_ACTIVATED" to restore ENL direct)
  - deterministic (identical state → identical path selection)
  - non-breaking (absent annotations = ENL direct behavior unchanged)

Runtime states:
  SEMANTIC_PATH_INACTIVE   — ACTIVATION_STATUS != "ACTIVATED" (default safe state)
  SEMANTIC_PATH_ACTIVE     — ACTIVATED and all acceptance conditions AC-001..008 pass
  SEMANTIC_PATH_FALLBACK   — ACTIVATED but one or more acceptance conditions fail

Public API:
  ACTIVATION_STATUS            str          "NOT_ACTIVATED" | "ACTIVATED"
  get_path_state()             → dict       Current path state + acceptance results
  annotate_signal(signal_id)   → dict|None  Semantic annotation for a signal; None if inactive
  annotate_query(query_id)     → dict|None  Semantic intent annotation; None if inactive

This module is read-only. It does not modify any ENL, 41.x, or 42.x artifacts.
It does not activate automatically or infer activation from context.

Python 3.9+ standard library only.
"""

import re
from pathlib import Path
from typing import Optional


# ── Activation Switch ──────────────────────────────────────────────────────
#
# This is the SINGLE explicit activation control point for Stream 42.11.
# Default = "NOT_ACTIVATED" — the safe state per RULE-002.
#
# To enable semantic path:
#   Set ACTIVATION_STATUS = "ACTIVATED"
#
# To disable and restore ENL direct behavior:
#   Set ACTIVATION_STATUS = "NOT_ACTIVATED"
#
ACTIVATION_STATUS: str = "NOT_ACTIVATED"


# ── Internal constants ─────────────────────────────────────────────────────

_REPO_ROOT = Path(__file__).resolve().parents[3]
_PATH_41_6 = _REPO_ROOT / "docs/pios/41.6"
_RUN_ID    = "run_01_blueedge"

_REQUIRED_41_6_ARTIFACTS = [
    "enl_semantic_mapping.md",
    "semantic_assimilation_model.md",
    "semantic_construct_registry.md",
    "semantic_projection_output.md",
    "fallback_integrity_spec.md",
    "semantic_validation_report.md",
]

# Path state string constants — exported for use by callers
SEMANTIC_PATH_INACTIVE = "SEMANTIC_PATH_INACTIVE"
SEMANTIC_PATH_ACTIVE   = "SEMANTIC_PATH_ACTIVE"
SEMANTIC_PATH_FALLBACK = "SEMANTIC_PATH_FALLBACK"


# ── Internal helpers ───────────────────────────────────────────────────────

def _read(path: Path) -> str:
    """Read file text; return empty string if not found."""
    try:
        return path.read_text(encoding='utf-8')
    except (OSError, IOError):
        return ''


def _check_acceptance_conditions() -> dict:
    """
    Evaluate acceptance conditions AC-001..008 as specified in 42.10.
    Returns dict mapping AC-ID → bool.
    Called only when ACTIVATION_STATUS == "ACTIVATED".
    """
    results = {}

    # AC-001: all 6 required 41.6 artifacts exist
    results["AC-001"] = all(
        (_PATH_41_6 / a).is_file() for a in _REQUIRED_41_6_ARTIFACTS
    )

    registry_text = _read(_PATH_41_6 / "semantic_construct_registry.md")

    # AC-002: registry has at least 1 semantic construct
    sem_ids_block   = re.findall(r'\|\s*semantic_id\s*\|\s*(SEM-\w+-\d+)', registry_text)
    sem_ids_compact = re.findall(r'^\|\s*(SEM-INTENT-\d+)\s*\|', registry_text, re.MULTILINE)
    results["AC-002"] = len(sem_ids_block + sem_ids_compact) >= 1

    # AC-003: no unanchored constructs (no empty source_enl_id cell)
    empty_source = re.findall(r'\|\s*source_enl_id\s*\|\s*\|', registry_text)
    results["AC-003"] = len(empty_source) == 0

    # AC-004: SEM-OBJ constructs trace to INTEL source objects
    intel_sources = re.findall(r'\|\s*source_enl_id\s*\|\s*(INTEL-\d+)', registry_text)
    results["AC-004"] = len(intel_sources) >= 2

    # AC-005: run_id matches active run
    results["AC-005"] = _RUN_ID in registry_text

    # AC-006: all coverage_state values are canonical
    valid_coverage  = {'computed', 'blocked', 'partial'}
    coverage_values = re.findall(r'\|\s*coverage_state\s*\|\s*(\w+)', registry_text)
    results["AC-006"] = all(v in valid_coverage for v in coverage_values)

    # AC-007: 41.6 fallback_integrity_spec declares VERIFIED
    fallback_spec   = _read(_PATH_41_6 / "fallback_integrity_spec.md")
    results["AC-007"] = 'VERIFIED' in fallback_spec

    # AC-008: semantic_validation_report status is PASS
    validation_report = _read(_PATH_41_6 / "semantic_validation_report.md")
    results["AC-008"] = 'VALIDATION STATUS: PASS' in validation_report

    return results


def _load_signal_registry() -> dict:
    """
    Parse 41.6 semantic construct registry into a lookup keyed by source_enl_id.
    Returns dict: source_enl_id → annotation dict.
    Called only when path state is ACTIVE.
    """
    registry_text = _read(_PATH_41_6 / "semantic_construct_registry.md")
    signal_map = {}

    # Parse full block entries (SEM-OBJ, SEM-PAT, SEM-STATE, SEM-STMT)
    # Each block is separated by --- and contains | field | value | rows
    blocks = re.split(r'^-{3,}$', registry_text, flags=re.MULTILINE)
    for block in blocks:
        sem_match = re.search(r'\|\s*semantic_id\s*\|\s*(SEM-\w+-\d+)', block)
        if not sem_match:
            continue
        sem_id = sem_match.group(1)

        source_match = re.search(r'\|\s*source_enl_id\s*\|\s*([\w-]+)', block)
        if not source_match:
            continue
        source_enl_id = source_match.group(1)

        construct_match = re.search(r'\|\s*construct_type\s*\|\s*([\w-]+)', block)
        construct_type  = construct_match.group(1) if construct_match else None

        norm_match      = re.search(r'\|\s*normalization_level\s*\|\s*([\w-]+)', block)
        normalization_level = norm_match.group(1) if norm_match else None

        signal_map[source_enl_id] = {
            "semantic_id":          sem_id,
            "construct_type":       construct_type,
            "normalization_level":  normalization_level,
            "source_enl_id":        source_enl_id,
        }

    # Parse compact SEM-INTENT rows:
    # | SEM-INTENT-NNN | GQ-NNN | `intent_label` | DOMAIN | STRENGTH |
    intent_rows = re.findall(
        r'^\|\s*(SEM-INTENT-\d+)\s*\|\s*(GQ-\d+)\s*\|\s*`?([^|`\n]+?)`?\s*\|',
        registry_text, re.MULTILINE
    )
    for sem_id, query_id, intent_label in intent_rows:
        signal_map[query_id.strip()] = {
            "semantic_id":          sem_id.strip(),
            "construct_type":       "SEM-INTENT",
            "normalization_level":  None,
            "source_enl_id":        query_id.strip(),
            "intent_label":         intent_label.strip(),
        }

    return signal_map


# ── Public API ─────────────────────────────────────────────────────────────

def get_path_state() -> dict:
    """
    Inspect the current semantic path state. Read-only. No side effects.

    Returns:
        {
          "path_state":          str,   # SEMANTIC_PATH_INACTIVE | ACTIVE | FALLBACK
          "activation_status":   str,   # NOT_ACTIVATED | ACTIVATED
          "acceptance_results":  dict,  # AC-001..008 → bool (empty when INACTIVE)
          "fallback_triggers":   list,  # failed AC-IDs (empty when not FALLBACK)
          "run_id":              str,
        }

    Runtime honesty rules (RULE-005):
      - INACTIVE:  activation was never set; ENL direct is normal operation
      - ACTIVE:    activation set AND all AC-001..008 pass
      - FALLBACK:  activation set BUT one or more AC-001..008 fail; silent ENL direct
    """
    if ACTIVATION_STATUS != "ACTIVATED":
        return {
            "path_state":         SEMANTIC_PATH_INACTIVE,
            "activation_status":  ACTIVATION_STATUS,
            "acceptance_results": {},
            "fallback_triggers":  [],
            "run_id":             _RUN_ID,
        }

    results = _check_acceptance_conditions()
    failed  = [ac for ac, passed in sorted(results.items()) if not passed]
    path_state = SEMANTIC_PATH_ACTIVE if not failed else SEMANTIC_PATH_FALLBACK

    return {
        "path_state":         path_state,
        "activation_status":  ACTIVATION_STATUS,
        "acceptance_results": results,
        "fallback_triggers":  failed,
        "run_id":             _RUN_ID,
    }


def annotate_signal(signal_id: str) -> Optional[dict]:
    """
    Return the semantic annotation for a given ENL signal_id.

    When path is ACTIVE: returns annotation dict with semantic_id, construct_type,
    normalization_level, source_enl_id. Returns None if signal has no construct.

    When path is INACTIVE or FALLBACK: returns None.
    Callers must treat None as "no semantic annotation available" —
    ENL-derived fields are unchanged in all cases.
    """
    state = get_path_state()
    if state["path_state"] != SEMANTIC_PATH_ACTIVE:
        return None
    registry = _load_signal_registry()
    return registry.get(signal_id)


def annotate_query(query_id: str) -> Optional[dict]:
    """
    Return the semantic intent annotation for a given query_id.

    When path is ACTIVE: returns annotation dict for the matching SEM-INTENT construct.
    When path is INACTIVE or FALLBACK: returns None.
    """
    state = get_path_state()
    if state["path_state"] != SEMANTIC_PATH_ACTIVE:
        return None
    registry = _load_signal_registry()
    return registry.get(query_id)
