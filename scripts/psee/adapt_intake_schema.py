#!/usr/bin/env python3
"""
PSEE Intake Schema Adapter
Stream: PSEE.RECONCILE.1.WP-15D

PURPOSE
  Convert AUTHORITATIVE_INTAKE (telemetry_baseline.json — VAR_* map) into
  the canonical raw_input structure expected by build_authoritative_input.py.

  STRUCTURAL ADAPTER ONLY.
  No semantic interpretation. No enrichment. No modification of source values.

Entry point:
  adapt_intake_to_canonical(client_uuid, intake_path) -> dict
"""

import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Fields that must NOT appear in a VAR_* telemetry intake file
_FORBIDDEN_INTAKE_FIELDS = {
    "domains", "entities", "relationships", "metrics", "events",
    "signals", "topology", "source_system", "client_uuid",
    "construction_metadata", "structural_metrics",
}

# Forbidden read path fragments
_FORBIDDEN_READ_PREFIXES = ("docs/pios/", "runs/pios/")


def _fail(stage, rule, reason):
    print(f"\nFAIL [{stage}]")
    print(f"  rule:   {rule}")
    print(f"  reason: {reason}")
    print("  action: execution halted")
    sys.exit(1)


def adapt_intake_to_canonical(client_uuid: str, intake_path: str) -> dict:
    """Convert VAR_* telemetry intake to canonical raw_input structure.

    Rules (strict):
    - intake file must exist within client scope
    - all keys must be VAR_* prefixed
    - no forbidden structural fields may be present
    - VAR_* values are copied verbatim into metrics — no transformation
    - domains, entities, relationships, events are set to []
    - source_system is set to "IG"
    - client_uuid is injected from argument — not from file

    Returns canonical dict compatible with build_authoritative_input pipeline.
    """
    # ── PATH VALIDATION ───────────────────────────────────────────────────────
    real_path   = os.path.realpath(os.path.abspath(intake_path))
    client_root = os.path.realpath(os.path.join(REPO_ROOT, "clients", client_uuid))
    if not real_path.startswith(client_root + os.sep):
        _fail("ADAPT_INTAKE", "PATH_SCOPE_VIOLATION",
              f"intake_path {intake_path!r} is outside client scope")

    rel_path = os.path.relpath(real_path, REPO_ROOT)
    for prefix in _FORBIDDEN_READ_PREFIXES:
        if rel_path.startswith(prefix):
            _fail("ADAPT_INTAKE", "FORBIDDEN_READ_PATH",
                  f"intake_path references forbidden path: {rel_path!r}")

    # ── FILE EXISTS ───────────────────────────────────────────────────────────
    if not os.path.isfile(intake_path):
        _fail("ADAPT_INTAKE", "INTAKE_FILE_MISSING",
              f"intake file not found: {intake_path}")

    # ── LOAD ──────────────────────────────────────────────────────────────────
    with open(intake_path) as f:
        raw = json.load(f)

    if not isinstance(raw, dict):
        _fail("ADAPT_INTAKE", "INTAKE_NOT_DICT",
              "intake file root must be a JSON object")

    # ── ASSERT VAR_* ONLY ─────────────────────────────────────────────────────
    non_var = [k for k in raw if not k.startswith("VAR_")]
    if non_var:
        _fail("ADAPT_INTAKE", "NON_VAR_KEYS_PRESENT",
              f"intake file contains non-VAR_* keys: {non_var}")

    # ── ASSERT NO FORBIDDEN STRUCTURAL FIELDS ─────────────────────────────────
    forbidden_found = [k for k in raw if k in _FORBIDDEN_INTAKE_FIELDS]
    if forbidden_found:
        _fail("ADAPT_INTAKE", "FORBIDDEN_FIELDS_IN_INTAKE",
              f"intake file contains forbidden structural fields: {forbidden_found}")

    # ── ASSERT NON-EMPTY ──────────────────────────────────────────────────────
    if not raw:
        _fail("ADAPT_INTAKE", "EMPTY_INTAKE",
              "intake file contains no VAR_* keys")

    # ── CONSTRUCT CANONICAL STRUCTURE ─────────────────────────────────────────
    # VAR_* values copied verbatim — no transformation, no renaming
    canonical = {
        "client_uuid":    client_uuid,
        "source_system":  "IG",
        "domains":        [],
        "entities":       [],
        "relationships":  [],
        "events":         [],
        "metrics":        dict(raw),   # exact copy of VAR_* map
    }

    # ── POST-CONSTRUCTION INTEGRITY CHECK ─────────────────────────────────────
    # Verify no values were modified
    for k, v in raw.items():
        if canonical["metrics"].get(k) != v:
            _fail("ADAPT_INTAKE", "ADAPTER_VALUE_MUTATION",
                  f"value for {k!r} was modified during adaptation")

    # Verify structural fields are empty
    for field in ("domains", "entities", "relationships", "events"):
        if canonical[field]:
            _fail("ADAPT_INTAKE", "ADAPTER_INJECTED_DATA",
                  f"canonical.{field} is non-empty after adaptation")

    return canonical
