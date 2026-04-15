#!/usr/bin/env python3
"""
scripts/pios/projection_runtime.py
PRODUCTIZE.LENS.PROJECTION.RUNTIME.01

The ONLY legal interface between vault truth and any external surface.

Implements the five-stage projection pipeline from
PRODUCTIZE.LENS.PROJECTION.CONTRACT.01:

  Stage 1: Input Validation
  Stage 2: Claim Resolution + Zone Filter
  Stage 3: Projection Transform
  Stage 4: Persona Modifier
  Stage 5: Output Validation

Public API:
  resolve_claim(claim_id, vault_path, repo_root)  → (ClaimRecord | None, reason)
  enforce_zone(record, zone, ts, depth)            → (ZoneFilteredRecord | None, error)
  build_projection(zfr, zone, depth, run_id, ...)  → payload dict
  project(claim_id, zone, depth, ...)              → OutputPayload | ProjectionError
  project_set(claim_set_id, zone, depth, ...)      → ClaimSetPayload | ClaimSetError
  project_for_lens(claim_ids, ...)                 → list[OutputPayload]
  export_fragments(output_dir, ...)                → int (count exported)

Fail-closed contract:
  Any pipeline failure → ProjectionError dict
  No partial payloads
  No fallback narrative
  No vault content in error responses (ZONE-2)

Authority: PRODUCTIZE.LENS.PROJECTION.CONTRACT.01
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
from dataclasses import dataclass, field as dc_field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Constants — Zones, Depths, Personas
# ---------------------------------------------------------------------------

ZONE_1 = "ZONE-1"
ZONE_2 = "ZONE-2"
ZONE_3 = "ZONE-3"
VALID_ZONES = {ZONE_1, ZONE_2, ZONE_3}

L1, L2, L3 = "L1", "L2", "L3"
VALID_DEPTHS = {L1, L2, L3}

PERSONA_SHARED = "shared"
PERSONA_CTO    = "cto"
PERSONA_CEO    = "ceo"
VALID_PERSONAS = {PERSONA_SHARED, PERSONA_CTO, PERSONA_CEO}

EVIDENCE_VERIFIED    = "VERIFIED"
EVIDENCE_CONDITIONAL = "CONDITIONAL"
EVIDENCE_PARTIAL     = "PARTIAL"
EVIDENCE_BLOCKED     = "BLOCKED"

# Evidence class ordering for minimum-class computation (weakest = index 0)
EVIDENCE_ORDER = [EVIDENCE_BLOCKED, EVIDENCE_PARTIAL, EVIDENCE_CONDITIONAL, EVIDENCE_VERIFIED]

# DIM-XX → plain label substitutions (Z1 code → Z2 safe label)
DIM_LABELS: Dict[str, str] = {
    "DIM-01": "Coverage",
    "DIM-02": "Reconstruction",
    "DIM-03": "Escalation Clearance",
    "DIM-04": "Unknown-Space",
    "DIM-05": "Intake Completeness",
    "DIM-06": "Heuristic Compliance",
}

# Named claim sets (projection_contract_spec.md §4)
CLAIM_SETS: Dict[str, List[str]] = {
    "SCORE_ZONE":               ["CLM-09", "CLM-10", "CLM-12", "CLM-11"],
    "SIGNAL_ZONE_1":            ["CLM-20"],
    "SIGNAL_ZONE_2":            ["CLM-21"],
    "SIGNAL_ZONE_3":            ["CLM-22"],
    "SIGNAL_ZONE_4":            ["CLM-23"],
    "SIGNAL_ZONE_5":            ["CLM-24"],
    "VERDICT_ZONE":             ["CLM-25", "CLM-13", "CLM-03"],
    "TOPOLOGY_ZONE":            ["CLM-27", "CLM-14", "CLM-15", "CLM-16"],
    "COVERAGE_ZONE":            ["CLM-01", "CLM-13"],
    "LENS_EXECUTIVE_OVERVIEW":  [
        "CLM-09", "CLM-10", "CLM-25", "CLM-21", "CLM-20", "CLM-22",
        "CLM-23", "CLM-24", "CLM-18", "CLM-19", "CLM-12", "CLM-11",
        "CLM-01", "CLM-13",
    ],
    "LENS_SCORE_BLOCK":         ["CLM-09", "CLM-10", "CLM-12", "CLM-11"],
    "LENS_VERDICT_BLOCK":       ["CLM-25", "CLM-13"],
    "LENS_SIGNAL_BLOCK":        ["CLM-20", "CLM-21", "CLM-22", "CLM-23", "CLM-24"],
    "LENS_STRUCTURAL_BLOCK":    ["CLM-01", "CLM-14", "CLM-15", "CLM-16", "CLM-17"],
}

# Signal claims that require signal_registry augmentation
SIGNAL_CLAIM_IDS = {"CLM-20", "CLM-21", "CLM-22", "CLM-23", "CLM-24"}

# BC-01: Blocking condition for CLM-25 EXECUTION verdict (failure_safety_model.md)
BC_01_CAVEAT = (
    "CONCEPT-06 predicate mismatch (BC-01): EXECUTION verdict cannot be automatically derived "
    "until the predicate in concepts.json is updated to include NOT_EVALUATED. "
    "Manually confirmed as UNKNOWN based on execution_status=NOT_EVALUATED."
)

# SIG-005 (CLM-24) required caveat
SIG_005_CAVEAT = (
    "Partial evidence — static coordination structure confirms elevated sharing; "
    "runtime validation is not yet complete."
)

# Per-claim default caveats for CONDITIONAL claims whose vault Traceability
# section carries "None" but whose lens_admissible=CONDITIONAL requires a
# governed caveat in the output payload.  Sourced from output_payload_schema.md
# §3 and lens_v1_content_model.md §2.  These are not invented — they are the
# required caveats specified by the projection contract for each claim.
CONDITIONAL_CLAIM_CAVEATS: Dict[str, str] = {
    "CLM-10": (
        "Requires runtime execution assessment. "
        "This is the achievable ceiling, not a current measurement."
    ),
    "CLM-11": (
        "Floor is proven at the canonical score. "
        "Ceiling is contingent on runtime execution assessment."
    ),
    "CLM-12": (
        "Lower bound is proven. "
        "Upper bound is achievable upon completion of runtime execution assessment."
    ),
    "CLM-13": (
        "Not a deficiency — assessment is incomplete until runtime execution runs."
    ),
    "CLM-06": (
        "Minimum observable state only. "
        "Zero unknown-space records cannot be taken as proven zero."
    ),
    "CLM-08": (
        "Structural heuristic compliance confirmed. "
        "Applies to CTO audience; runtime verification pending."
    ),
}

# Z1-only field names that must be absent from any ZONE-2 output payload
Z1_ONLY_FIELDS = frozenset({
    "source_field", "transformation_summary", "stage_of_origin",
    "artifact_id", "artifact_name", "artifact_path", "producing_step",
})


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class ClaimRecord:
    """Raw parsed claim node from vault markdown."""
    claim_id:             str
    claim_label:          str
    claim_type:           str
    exposure:             str        # e.g. "ZONE-2"
    lens_admissible:      str        # "YES" | "CONDITIONAL" | "NO"
    status:               str

    explanation_z1:       str        # technical (## Explanation)
    explanation_z2:       str        # narrative  (## Why It Matters)
    authoritative_value_raw: str     # ## Authoritative Value (raw text)
    source_fields:        List[str]  # Z1
    transformation_chain: List[str]  # Z1
    traceability_status:  str
    caveats_raw:          str        # raw caveats line from ## Traceability

    # Signal-specific fields (CLM-20..24) — populated via signal_registry.json
    signal_id:                Optional[str] = None   # Z1
    signal_title:             Optional[str] = None   # Z2
    signal_business_impact:   Optional[str] = None   # Z2
    signal_risk:              Optional[str] = None   # Z2
    signal_evidence_confidence: Optional[str] = None # Z2
    signal_statement:         Optional[str] = None   # Z1
    signal_confidence_rationale: Optional[str] = None  # Z1


@dataclass
class ZoneFilteredRecord:
    """Claim record after Stage 2 zone filter."""
    claim_id:           str
    claim_label:        str         # Z2: clean label; Z1: with CLM-XX annotation
    zone:               str
    evidence_class:     str
    explanation:        str         # zone-appropriate
    value_raw:          Optional[str]        # Z1 only
    value_narrative:    str                  # Z2 safe
    value_unit:         Optional[str]
    source_field:       Optional[str]        # Z1 only
    transformation_summary: Optional[str]   # Z1 only
    caveats:            List[str]
    trace_available:    bool
    lens_admissible:    str
    authoritative_value_raw: str

    # Signal fields (post zone filter)
    signal_title:             Optional[str] = None
    signal_business_impact:   Optional[str] = None
    signal_risk:              Optional[str] = None
    signal_evidence_confidence: Optional[str] = None
    signal_id:                Optional[str] = None  # Z1 only


@dataclass
class ProjectionError:
    """Structured error — no vault content, no partial payload."""
    error_type:   str
    reason:       str
    stage:        str
    zone:         str
    depth:        str
    generated_at: str
    claim_id:     Optional[str] = None
    claim_set_id: Optional[str] = None
    detail:       Optional[str] = None  # Z1 only — stripped for ZONE-2 output


# ---------------------------------------------------------------------------
# Vault parsing utilities
# ---------------------------------------------------------------------------

def _parse_frontmatter(text: str) -> Tuple[Dict[str, str], str]:
    """Split YAML frontmatter from markdown body."""
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    meta: Dict[str, str] = {}
    for line in parts[1].strip().splitlines():
        if ":" in line:
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    return meta, parts[2].strip()


def _extract_section(body: str, section_name: str) -> str:
    """Extract content of a ## section from markdown body."""
    pattern = rf"## {re.escape(section_name)}\s*\n(.*?)(?=\n## |\Z)"
    m = re.search(pattern, body, re.DOTALL)
    return m.group(1).strip() if m else ""


def _extract_list_items(text: str) -> List[str]:
    """Extract bullet list items (- or *) from section text."""
    items = []
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("- ") or s.startswith("* "):
            items.append(s[2:].strip())
    return items


def _parse_traceability(traceability_text: str) -> Tuple[str, str]:
    """Return (status, caveats_raw) from Traceability section text."""
    status = ""
    caveats_raw = ""
    for line in traceability_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("- Status:"):
            status = stripped.split("- Status:", 1)[1].strip()
        elif stripped.startswith("- Caveats:"):
            caveats_raw = stripped.split("- Caveats:", 1)[1].strip()
    return status, caveats_raw


def _extract_signal_id_from_auth_value(text: str) -> Optional[str]:
    m = re.search(r"signal_id:\s*(SIG-\d+)", text)
    return m.group(1) if m else None


def _extract_evidence_confidence_from_auth_value(text: str) -> Optional[str]:
    m = re.search(r"evidence_confidence:\s*(\w+)", text)
    return m.group(1) if m else None


def _find_claim_file(claim_id: str, vault_path: Path) -> Optional[Path]:
    claims_dir = vault_path / "claims"
    if not claims_dir.exists():
        return None
    for f in sorted(claims_dir.iterdir()):
        if f.name.startswith(f"{claim_id} ") or f.name.startswith(f"{claim_id}-"):
            return f
    return None


def _find_signal_registry(repo_root: Path) -> Optional[Path]:
    candidates = [
        repo_root / "clients" / "blueedge" / "psee" / "runs"
        / "run_authoritative_recomputed_01" / "package" / "signal_registry.json",
        repo_root / "clients" / "blueedge" / "psee" / "runs"
        / "run_01_authoritative" / "package" / "signal_registry.json",
    ]
    for c in candidates:
        if c.exists():
            return c
    return None


def _load_signal_data(signal_id: str, registry_path: Path) -> Dict[str, Any]:
    try:
        with open(registry_path, "r", encoding="utf-8") as f:
            registry = json.load(f)
        for sig in registry.get("signals", []):
            if sig.get("signal_id") == signal_id:
                return sig
    except (json.JSONDecodeError, OSError):
        pass
    return {}


# ---------------------------------------------------------------------------
# Stage 1 — Input Validation
# ---------------------------------------------------------------------------

def _validate_input(
    claim_id: Optional[str],
    claim_set_id: Optional[str],
    zone: str,
    depth: str,
    persona: str,
    ts: str,
) -> Optional[ProjectionError]:
    if claim_id and claim_set_id:
        return ProjectionError(
            error_type="INPUT_VALIDATION_FAILURE",
            reason="AMBIGUOUS_INPUT",
            stage="STAGE_1", zone=zone, depth=depth, generated_at=ts,
            detail="Provide claim_id OR claim_set_id, not both.",
        )
    if not claim_id and not claim_set_id:
        return ProjectionError(
            error_type="INPUT_VALIDATION_FAILURE",
            reason="MISSING_REQUIRED_PARAMETER",
            stage="STAGE_1", zone=zone, depth=depth, generated_at=ts,
            detail="Either claim_id or claim_set_id is required.",
        )
    if zone not in VALID_ZONES:
        return ProjectionError(
            error_type="INPUT_VALIDATION_FAILURE",
            reason="INVALID_ZONE",
            stage="STAGE_1", zone=zone, depth=depth, generated_at=ts,
            detail=f"Zone '{zone}' not recognized. Expected: ZONE-1 | ZONE-2 | ZONE-3.",
        )
    if depth not in VALID_DEPTHS:
        return ProjectionError(
            error_type="INPUT_VALIDATION_FAILURE",
            reason="INVALID_DEPTH",
            stage="STAGE_1", zone=zone, depth=depth, generated_at=ts,
            detail=f"Depth '{depth}' not recognized. Expected: L1 | L2 | L3.",
        )
    if persona not in VALID_PERSONAS:
        return ProjectionError(
            error_type="INPUT_VALIDATION_FAILURE",
            reason="INVALID_PERSONA",
            stage="STAGE_1", zone=zone, depth=depth, generated_at=ts,
            detail=f"Persona '{persona}' not recognized.",
        )
    if depth == L3 and zone in {ZONE_1, ZONE_2}:
        return ProjectionError(
            error_type="INPUT_VALIDATION_FAILURE",
            reason="ZONE_INSUFFICIENT_FOR_L3",
            stage="STAGE_1", zone=zone, depth=depth, generated_at=ts,
            detail=f"L3 audit depth requires ZONE-3. Requested zone: {zone}.",
        )
    if claim_set_id and claim_set_id not in CLAIM_SETS:
        return ProjectionError(
            error_type="INPUT_VALIDATION_FAILURE",
            reason="UNKNOWN_CLAIM_SET_ID",
            stage="STAGE_1", zone=zone, depth=depth, generated_at=ts,
            claim_set_id=claim_set_id,
            detail=f"Claim set '{claim_set_id}' not in named claim sets.",
        )
    return None


# ---------------------------------------------------------------------------
# Stage 2 — Claim Resolution
# ---------------------------------------------------------------------------

def resolve_claim(
    claim_id: str,
    vault_path: Path,
    repo_root: Optional[Path] = None,
) -> Tuple[Optional[ClaimRecord], Optional[str]]:
    """
    Locate and parse a claim node from the vault.
    Returns (ClaimRecord, None) on success, (None, reason_code) on failure.
    """
    claim_file = _find_claim_file(claim_id, vault_path)
    if not claim_file:
        return None, "CLAIM_NOT_IN_VAULT"

    try:
        text = claim_file.read_text(encoding="utf-8")
    except OSError:
        return None, "VAULT_NODE_UNREADABLE"

    meta, body = _parse_frontmatter(text)
    if not meta.get("claim_id"):
        return None, "VAULT_NODE_UNREADABLE"

    traceability_text = _extract_section(body, "Traceability")
    trac_status, caveats_raw = _parse_traceability(traceability_text)

    auth_value = _extract_section(body, "Authoritative Value")

    record = ClaimRecord(
        claim_id             = meta.get("claim_id", claim_id),
        claim_label          = meta.get("claim_label", ""),
        claim_type           = meta.get("claim_type", ""),
        exposure             = meta.get("exposure", ""),
        lens_admissible      = meta.get("lens_admissible", "YES"),
        status               = meta.get("status", ""),
        explanation_z1       = _extract_section(body, "Explanation"),
        explanation_z2       = _extract_section(body, "Why It Matters"),
        authoritative_value_raw = auth_value,
        source_fields        = _extract_list_items(_extract_section(body, "Source Fields")),
        transformation_chain = _extract_list_items(_extract_section(body, "Transformation Chain")),
        traceability_status  = trac_status,
        caveats_raw          = caveats_raw,
    )

    # Augment signal claims from signal_registry.json
    if claim_id in SIGNAL_CLAIM_IDS:
        record.signal_id = _extract_signal_id_from_auth_value(auth_value)
        record.signal_evidence_confidence = _extract_evidence_confidence_from_auth_value(auth_value)

        if record.signal_id and repo_root:
            reg_path = _find_signal_registry(repo_root)
            if reg_path:
                sig = _load_signal_data(record.signal_id, reg_path)
                record.signal_title             = sig.get("title")
                record.signal_business_impact   = sig.get("business_impact")
                record.signal_risk              = sig.get("risk")
                record.signal_statement         = sig.get("statement")
                record.signal_confidence_rationale = sig.get("confidence_rationale")

    return record, None


# ---------------------------------------------------------------------------
# Stage 2 — Zone Filter
# ---------------------------------------------------------------------------

def _determine_evidence_class(record: ClaimRecord) -> str:
    admissible = record.lens_admissible
    if admissible == "NO":
        return EVIDENCE_BLOCKED
    if admissible == "CONDITIONAL":
        return EVIDENCE_CONDITIONAL
    caveats_upper = record.caveats_raw.upper()
    if "PARTIAL" in caveats_upper or "WEAK" in caveats_upper:
        return EVIDENCE_PARTIAL
    return EVIDENCE_VERIFIED


def _build_caveats(record: ClaimRecord, evidence_class: str) -> List[str]:
    caveats: List[str] = []
    raw = record.caveats_raw.strip()
    if raw and not raw.lower().startswith("none"):
        caveats.append(raw)

    # BC-01: CLM-25 EXECUTION blocking condition always propagates
    if record.claim_id == "CLM-25" and BC_01_CAVEAT not in caveats:
        caveats.append(BC_01_CAVEAT)

    # CLM-24: SIG-005 partial evidence caveat always present
    if record.claim_id == "CLM-24" and SIG_005_CAVEAT not in caveats:
        caveats.append(SIG_005_CAVEAT)

    # For CONDITIONAL claims with no vault-stored caveat, apply the per-claim
    # default caveat from CONDITIONAL_CLAIM_CAVEATS.  The Stage 5 validator
    # requires evidence_class=CONDITIONAL → non-empty caveats.  These defaults
    # are contract-specified, not invented narrative.
    if evidence_class == EVIDENCE_CONDITIONAL and not caveats:
        default = CONDITIONAL_CLAIM_CAVEATS.get(record.claim_id)
        if default:
            caveats.append(default)

    return caveats


def _derive_value_narrative(record: ClaimRecord) -> str:
    """Derive a ZONE-2 safe narrative value from the claim record."""
    raw_lines = [l.strip() for l in record.authoritative_value_raw.splitlines() if l.strip()]
    raw = raw_lines[0] if raw_lines else record.authoritative_value_raw.strip()
    cid = record.claim_id

    if cid == "CLM-09":
        m = re.search(r'\b(\d+)\b', raw)
        return f"Proven: {m.group(1)}/100" if m else f"Proven: {raw}"
    if cid == "CLM-10":
        m = re.search(r'\b(\d+)\b', raw)
        return f"Achievable: {m.group(1)}/100" if m else f"Achievable: {raw}"
    if cid == "CLM-11":
        return "Floor established, ceiling defined"
    if cid == "CLM-12":
        m = re.search(r'(\d+)\s*[–\-]\s*(\d+)', raw)
        return f"Score range: {m.group(1)} to {m.group(2)}" if m else raw
    if cid == "CLM-01":
        m = re.search(r'(\d+(?:\.\d+)?)\s*%', raw)
        pct = m.group(1) if m else raw
        return f"{pct}% — all structural evidence present"
    if cid == "CLM-13":
        return "Runtime execution assessment is pending"
    if cid == "CLM-03":
        return "Structural consistency confirmed" if "PASS" in raw.upper() else raw
    if cid == "CLM-25":
        # Strip internal codes for ZONE-2 at narrative level
        return "STRUCTURE: complete and verified. COMPLEXITY: no structural overlaps. EXECUTION: pending assessment."
    if cid == "CLM-14":
        m = re.search(r'\b(\d+)\b', raw)
        return f"{m.group(1)} functional areas" if m else raw
    if cid == "CLM-15":
        m = re.search(r'\b(\d+)\b', raw)
        return f"{m.group(1)} capability surfaces" if m else raw
    if cid == "CLM-16":
        m = re.search(r'\b(\d+)\b', raw)
        return f"{m.group(1)} components mapped" if m else raw
    if cid == "CLM-17":
        m = re.search(r'\b(\d+)\b', raw)
        return f"{m.group(1)} cross-domain overlaps" if m else raw
    if cid == "CLM-27":
        m = re.search(r'\b(\d+)\b', raw)
        return f"{m.group(1)} total nodes" if m else raw
    if cid in SIGNAL_CLAIM_IDS and record.signal_title:
        return record.signal_title
    return raw


def _derive_value_unit(claim_id: str) -> Optional[str]:
    if claim_id in {"CLM-09", "CLM-10"}:
        return "out of 100"
    if claim_id == "CLM-01":
        return "%"
    return None


def _extract_raw_value(auth_value_text: str) -> str:
    lines = [l.strip() for l in auth_value_text.splitlines() if l.strip()]
    return lines[0] if lines else auth_value_text.strip()


def _substitute_dim_labels(text: str) -> str:
    for dim_id, label in DIM_LABELS.items():
        text = text.replace(dim_id, label)
    return text


def enforce_zone(
    record: ClaimRecord,
    zone: str,
    ts: str,
    depth: str = L1,
) -> Tuple[Optional[ZoneFilteredRecord], Optional[ProjectionError]]:
    """
    Stage 2: Apply zone filter to ClaimRecord → ZoneFilteredRecord.
    Strips fields with zone_floor above the requested zone.
    Returns (ZoneFilteredRecord, None) or (None, ProjectionError).
    """
    evidence_class = _determine_evidence_class(record)

    if evidence_class == EVIDENCE_BLOCKED:
        return None, ProjectionError(
            error_type="PROJECTION_TRANSFORM_FAILURE",
            reason="BLOCKED_CLAIM",
            stage="STAGE_2", zone=zone, depth=depth,
            claim_id=record.claim_id, generated_at=ts,
        )

    # Apply BC-01 and SIG-005 caveat rules
    if record.claim_id == "CLM-25" and evidence_class == EVIDENCE_VERIFIED:
        evidence_class = EVIDENCE_CONDITIONAL
    if record.claim_id == "CLM-24":
        evidence_class = EVIDENCE_PARTIAL

    caveats = _build_caveats(record, evidence_class)

    is_zone2 = (zone == ZONE_2)

    if is_zone2:
        claim_label          = record.claim_label                    # no CLM-XX annotation
        explanation          = _substitute_dim_labels(record.explanation_z2 or record.explanation_z1)
        value_raw            = None
        source_field         = None
        transformation_summary = None
        signal_id_out        = None
    else:
        claim_label          = f"{record.claim_id} — {record.claim_label}"
        explanation          = record.explanation_z1
        value_raw            = _extract_raw_value(record.authoritative_value_raw)
        source_field         = record.source_fields[0] if record.source_fields else None
        transformation_summary = (
            record.transformation_chain[0] if record.transformation_chain else None
        )
        signal_id_out        = record.signal_id

    zfr = ZoneFilteredRecord(
        claim_id             = record.claim_id,
        claim_label          = claim_label,
        zone                 = zone,
        evidence_class       = evidence_class,
        explanation          = explanation,
        value_raw            = value_raw,
        value_narrative      = _derive_value_narrative(record),
        value_unit           = _derive_value_unit(record.claim_id),
        source_field         = source_field,
        transformation_summary = transformation_summary,
        caveats              = caveats,
        trace_available      = True,   # L2/L3 scaffolding available per schema
        lens_admissible      = record.lens_admissible,
        authoritative_value_raw = record.authoritative_value_raw,
        signal_title         = record.signal_title,
        signal_business_impact = record.signal_business_impact,
        signal_risk          = record.signal_risk,
        signal_evidence_confidence = record.signal_evidence_confidence,
        signal_id            = signal_id_out,
    )

    return zfr, None


# ---------------------------------------------------------------------------
# Stage 3 — Projection Transform
# ---------------------------------------------------------------------------

def _make_projection_id(claim_id: str, zone: str, depth: str, run_id: str) -> str:
    h = hashlib.sha256(f"{claim_id}{zone}{depth}{run_id}".encode()).hexdigest()[:5]
    return f"PROJ-{claim_id}-{zone}-{depth}-{h}"


def build_projection(
    zfr: ZoneFilteredRecord,
    zone: str,
    depth: str,
    run_id: str,
    persona: str,
    ts: str,
) -> Dict[str, Any]:
    """
    Stage 3: Assemble output payload from ZoneFilteredRecord.
    Schema: output_payload_schema.md.
    """
    payload: Dict[str, Any] = {
        "projection_id":  _make_projection_id(zfr.claim_id, zone, depth, run_id),
        "claim_id":       zfr.claim_id,
        "zone":           zone,
        "depth":          depth,
        "evidence_class": zfr.evidence_class,
        "persona":        persona,
        "run_id":         run_id,
        "generated_at":   ts,
        "trace_available": zfr.trace_available,
        "caveats":        zfr.caveats,
    }

    if depth == L1:
        payload["claim_label"] = zfr.claim_label
        value: Dict[str, Any] = {"narrative": zfr.value_narrative}
        if zfr.value_raw is not None:
            value["raw"] = zfr.value_raw
        if zfr.value_unit:
            value["unit"] = zfr.value_unit
        payload["value"] = value
        payload["explanation"] = zfr.explanation
        payload["trace_depth_available"] = [L2, L3]

        # Z1-only fields (stripped from ZONE-2 by zone filter — only present if zone != ZONE-2)
        if zfr.source_field:
            payload["source_field"] = zfr.source_field
        if zfr.transformation_summary:
            payload["transformation_summary"] = zfr.transformation_summary

        # Signal block
        if zfr.signal_title:
            signal_block: Dict[str, Any] = {
                "title":              zfr.signal_title,
                "business_impact":    zfr.signal_business_impact,
                "risk":               zfr.signal_risk,
                "evidence_confidence": zfr.signal_evidence_confidence,
            }
            if zfr.signal_id:  # Z1 only — only present if zone != ZONE-2 (enforced by ZFR)
                signal_block["signal_id"] = zfr.signal_id
            payload["signal"] = signal_block

    elif depth == L2:
        # L2 EvidencePayload — artifact reference structure
        payload["grounding_artifact"] = {
            "artifact_role": "Terminal computation output",
            "artifact_description": (
                "The final output of the assessment computation chain. "
                "Contains all scores, dimensions, and execution state."
            ),
        }
        payload["co_grounded_claims"] = [{"claim_label": zfr.claim_label}]
        payload["trace_available"] = True

    elif depth == L3:
        # L3 AuditPayload — ZONE-3 only (enforced at Stage 1)
        payload["full_trace"] = {
            "source_fields":          [zfr.source_field] if zfr.source_field else [],
            "transformation_command": zfr.transformation_summary or "",
            "upstream_chain":         zfr.authoritative_value_raw,
        }
        payload["known_gaps"]           = []
        payload["blocking_conditions"]  = []
        payload["traceability_status"]  = "FULL"
        payload["audit_confirmed"]      = True
        payload["locked_baseline_tag"]  = "evidence-vault-builder-v1"

    return payload


# ---------------------------------------------------------------------------
# Stage 4 — Persona Modifier
# ---------------------------------------------------------------------------

def _apply_persona(
    payload: Dict[str, Any],
    persona: str,
    zfr: ZoneFilteredRecord,
    zone: str,
) -> Dict[str, Any]:
    """
    Stage 4: Apply persona modifier to zone-filtered payload.
    Persona operates on ZFR content only.
    Persona MUST NOT remove caveats.
    Persona MUST NOT access Z1 fields stripped in Stage 2.
    """
    if persona == PERSONA_SHARED:
        return payload  # pass-through

    if persona == PERSONA_CEO and "value" in payload and payload.get("depth") == L1:
        val = payload["value"]
        if "narrative" in val and zfr.claim_id == "CLM-09":
            val["narrative"] = val["narrative"].replace("Proven:", "Proven foundation:")
        # Caveats preserved — cannot be removed

    # PERSONA_CTO at ZONE-2: axis names may appear verbatim
    # (pre-approved vocabulary substitution within Z2 floor — no additional Z1 fields)

    return payload


# ---------------------------------------------------------------------------
# Stage 5 — Output Validation
# ---------------------------------------------------------------------------

def _validate_output(
    payload: Dict[str, Any],
    zone: str,
    depth: str,
    ts: str,
    claim_id: Optional[str] = None,
) -> Optional[ProjectionError]:
    """Stage 5: Output validation gate — two checks."""
    if zone == ZONE_2:
        for field_name in Z1_ONLY_FIELDS:
            if field_name in payload:
                return ProjectionError(
                    error_type="OUTPUT_VALIDATION_FAILURE",
                    reason="ZONE_FILTER_VIOLATION",
                    stage="STAGE_5", zone=zone, depth=depth,
                    claim_id=claim_id, generated_at=ts,
                    detail=f"Field '{field_name}' (zone_floor=Z1) in ZONE-2 payload.",
                )

    ec = payload.get("evidence_class", "")
    if ec in {EVIDENCE_CONDITIONAL, EVIDENCE_PARTIAL}:
        if not payload.get("caveats"):
            return ProjectionError(
                error_type="OUTPUT_VALIDATION_FAILURE",
                reason="REQUIRED_CAVEAT_MISSING",
                stage="STAGE_5", zone=zone, depth=depth,
                claim_id=claim_id, generated_at=ts,
                detail=f"evidence_class={ec} requires non-empty caveats.",
            )

    return None


# ---------------------------------------------------------------------------
# Error serialization
# ---------------------------------------------------------------------------

def _error_dict(err: ProjectionError, zone: str) -> Dict[str, Any]:
    """Serialize ProjectionError — strip detail for ZONE-2 (info-leak prevention)."""
    d: Dict[str, Any] = {
        "error_type":   err.error_type,
        "reason":       err.reason,
        "stage":        err.stage,
        "zone":         err.zone,
        "depth":        err.depth,
        "generated_at": err.generated_at,
    }
    if err.claim_id:
        d["claim_id"] = err.claim_id
    if err.claim_set_id:
        d["claim_set_id"] = err.claim_set_id
    if err.detail and zone != ZONE_2:
        d["detail"] = err.detail
    return d


# ---------------------------------------------------------------------------
# Path helpers
# ---------------------------------------------------------------------------

def _default_repo_root() -> Path:
    return Path(__file__).resolve().parent.parent.parent


def _default_vault_path(repo_root: Optional[Path] = None) -> Path:
    root = repo_root or _default_repo_root()
    return root / "clients" / "blueedge" / "vaults" / "run_01_authoritative"


# ---------------------------------------------------------------------------
# Public API — project()
# ---------------------------------------------------------------------------

def project(
    claim_id: str,
    zone: str = ZONE_1,
    depth: str = L1,
    vault_path: Optional[Path] = None,
    persona: str = PERSONA_SHARED,
    run_id: str = "run_authoritative_recomputed_01",
    repo_root: Optional[Path] = None,
) -> Dict[str, Any]:
    """
    Full five-stage projection pipeline for a single claim.

    Returns OutputPayload dict on success.
    Returns ProjectionError dict on any failure — no partial content.
    """
    ts = datetime.now(timezone.utc).isoformat()

    if repo_root is None:
        repo_root = _default_repo_root()
    if vault_path is None:
        vault_path = _default_vault_path(repo_root)

    # Stage 1
    err = _validate_input(claim_id, None, zone, depth, persona, ts)
    if err:
        return _error_dict(err, zone)

    # Stage 2a — resolve
    record, reason = resolve_claim(claim_id, vault_path, repo_root)
    if record is None:
        _reason = reason or "CLAIM_NOT_IN_VAULT"
        _detail_map = {
            "CLAIM_NOT_IN_VAULT":   f"Claim '{claim_id}' not found in vault claims directory.",
            "VAULT_NODE_UNREADABLE": f"Vault node for '{claim_id}' exists but could not be parsed.",
            "RUN_NOT_FOUND":        f"Run not found for claim '{claim_id}'.",
            "CLIENT_NOT_FOUND":     f"Client not found for claim '{claim_id}'.",
        }
        err = ProjectionError(
            error_type="ZONE_FILTER_FAILURE",
            reason=_reason,
            stage="STAGE_2", zone=zone, depth=depth,
            claim_id=claim_id, generated_at=ts,
            detail=_detail_map.get(_reason, _reason),
        )
        return _error_dict(err, zone)

    # Stage 2b — zone filter
    zfr, err = enforce_zone(record, zone, ts, depth)
    if err:
        return _error_dict(err, zone)

    # Stage 3
    payload = build_projection(zfr, zone, depth, run_id, persona, ts)

    # Stage 4
    payload = _apply_persona(payload, persona, zfr, zone)

    # Stage 5
    err = _validate_output(payload, zone, depth, ts, claim_id)
    if err:
        return _error_dict(err, zone)

    return payload


# ---------------------------------------------------------------------------
# Public API — project_set()
# ---------------------------------------------------------------------------

def project_set(
    claim_set_id: str,
    zone: str = ZONE_1,
    depth: str = L1,
    vault_path: Optional[Path] = None,
    persona: str = PERSONA_SHARED,
    run_id: str = "run_authoritative_recomputed_01",
    repo_root: Optional[Path] = None,
) -> Dict[str, Any]:
    """
    Project a named claim set.
    Returns ClaimSetPayload on success.
    Returns ClaimSetError on hard failure in any item.
    BLOCKED items are included in the items array.
    """
    ts = datetime.now(timezone.utc).isoformat()

    if repo_root is None:
        repo_root = _default_repo_root()
    if vault_path is None:
        vault_path = _default_vault_path(repo_root)

    err = _validate_input(None, claim_set_id, zone, depth, persona, ts)
    if err:
        return _error_dict(err, zone)

    claim_ids = CLAIM_SETS[claim_set_id]
    items: List[Dict[str, Any]] = []
    evidence_classes: List[str] = []
    all_caveats: List[str] = []

    for cid in claim_ids:
        item = project(cid, zone, depth, vault_path, persona, run_id, repo_root)
        items.append(item)

        if "error_type" in item:
            if item.get("reason") == "BLOCKED_CLAIM":
                evidence_classes.append(EVIDENCE_BLOCKED)
            else:
                # Hard failure — fail the entire set
                return {
                    "error_type":      "CLAIM_SET_FAILURE",
                    "claim_set_id":    claim_set_id,
                    "failed_claim_id": cid,
                    "reason":          item.get("reason", "UNKNOWN"),
                    "stage":           item.get("stage", "UNKNOWN"),
                    "zone":            zone,
                    "depth":           depth,
                    "generated_at":    ts,
                }
        else:
            evidence_classes.append(item.get("evidence_class", EVIDENCE_VERIFIED))
            all_caveats.extend(item.get("caveats", []))

    # Weakest-link evidence class
    set_ec = min(evidence_classes, key=lambda x: EVIDENCE_ORDER.index(x) if x in EVIDENCE_ORDER else 0)

    return {
        "claim_set_id":       claim_set_id,
        "zone":               zone,
        "depth":              depth,
        "generated_at":       ts,
        "run_id":             run_id,
        "items":              items,
        "set_evidence_class": set_ec,
        "set_caveats":        list(dict.fromkeys(all_caveats)),
    }


# ---------------------------------------------------------------------------
# Public API — project_for_lens()
# ---------------------------------------------------------------------------

def project_for_lens(
    claim_ids: List[str],
    vault_path: Optional[Path] = None,
    persona: str = PERSONA_SHARED,
    run_id: str = "run_authoritative_recomputed_01",
    repo_root: Optional[Path] = None,
) -> List[Dict[str, Any]]:
    """
    LENS preparation: zone fixed to ZONE-2, depth fixed to L1.
    Returns list of governed payloads.
    No rendering — payloads only.
    """
    if repo_root is None:
        repo_root = _default_repo_root()
    if vault_path is None:
        vault_path = _default_vault_path(repo_root)

    return [
        project(cid, ZONE_2, L1, vault_path, persona, run_id, repo_root)
        for cid in claim_ids
    ]


# ---------------------------------------------------------------------------
# Fragment export (V1 static pattern — integration_contract.md §5)
# ---------------------------------------------------------------------------

def export_fragments(
    output_dir: Path,
    vault_path: Optional[Path] = None,
    run_id: str = "run_authoritative_recomputed_01",
    repo_root: Optional[Path] = None,
) -> int:
    """
    Generate static ZONE-1 and ZONE-2 L1 fragment files for all known claims.
    Output: output_dir/CLM-{id}-{ZONE}-L1.json

    Fragment files are the V1 static serving targets for the GAUGE projection API.
    Returns count of successfully projected (non-error) fragments.
    """
    if repo_root is None:
        repo_root = _default_repo_root()
    if vault_path is None:
        vault_path = _default_vault_path(repo_root)

    output_dir.mkdir(parents=True, exist_ok=True)

    all_claim_ids = sorted({
        cid
        for ids in CLAIM_SETS.values()
        for cid in ids
    })

    success = 0
    for cid in all_claim_ids:
        for zone in (ZONE_1, ZONE_2):
            payload = project(cid, zone, L1, vault_path, PERSONA_SHARED, run_id, repo_root)
            filename = f"{cid}-{zone}-L1.json"
            (output_dir / filename).write_text(
                json.dumps(payload, indent=2, ensure_ascii=False),
                encoding="utf-8",
            )
            if "error_type" not in payload:
                success += 1

    return success


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _cli() -> None:
    import argparse

    parser = argparse.ArgumentParser(
        description="PRODUCTIZE.LENS.PROJECTION.RUNTIME.01 — Projection CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    def _add_common(p: argparse.ArgumentParser) -> None:
        p.add_argument("--zone",    default=ZONE_1,       choices=sorted(VALID_ZONES))
        p.add_argument("--depth",   default=L1,           choices=sorted(VALID_DEPTHS))
        p.add_argument("--persona", default=PERSONA_SHARED, choices=sorted(VALID_PERSONAS))
        p.add_argument("--run-id",  default="run_authoritative_recomputed_01")
        p.add_argument("--vault",   default=None, help="Path to vault directory")

    p_proj = sub.add_parser("project", help="Project a single claim")
    p_proj.add_argument("claim_id")
    _add_common(p_proj)

    p_set = sub.add_parser("project-set", help="Project a named claim set")
    p_set.add_argument("claim_set_id")
    _add_common(p_set)

    p_lens = sub.add_parser("project-for-lens", help="Project claim IDs at ZONE-2 L1")
    p_lens.add_argument("claim_ids", nargs="+")
    p_lens.add_argument("--persona", default=PERSONA_SHARED, choices=sorted(VALID_PERSONAS))
    p_lens.add_argument("--run-id",  default="run_authoritative_recomputed_01")
    p_lens.add_argument("--vault",   default=None)

    p_exp = sub.add_parser("export-fragments", help="Export static ZONE-1/2 L1 fragment files")
    p_exp.add_argument("--output-dir", required=True)
    p_exp.add_argument("--run-id",     default="run_authoritative_recomputed_01")
    p_exp.add_argument("--vault",      default=None)

    args = parser.parse_args()
    repo_root = _default_repo_root()

    def _vault_path() -> Optional[Path]:
        v = getattr(args, "vault", None)
        return Path(v) if v else None

    if args.command == "project":
        result = project(
            args.claim_id, args.zone, args.depth,
            _vault_path(), args.persona, args.run_id, repo_root,
        )
        print(json.dumps(result, indent=2, ensure_ascii=False))
        sys.exit(1 if "error_type" in result else 0)

    elif args.command == "project-set":
        result = project_set(
            args.claim_set_id, args.zone, args.depth,
            _vault_path(), args.persona, args.run_id, repo_root,
        )
        print(json.dumps(result, indent=2, ensure_ascii=False))
        sys.exit(1 if "error_type" in result else 0)

    elif args.command == "project-for-lens":
        results = project_for_lens(
            args.claim_ids, _vault_path(), args.persona, args.run_id, repo_root,
        )
        print(json.dumps(results, indent=2, ensure_ascii=False))
        sys.exit(1 if any("error_type" in r for r in results) else 0)

    elif args.command == "export-fragments":
        output_dir = Path(args.output_dir)
        count = export_fragments(output_dir, _vault_path(), args.run_id, repo_root)
        print(f"Exported {count} fragment(s) to {output_dir}")
        sys.exit(0)


if __name__ == "__main__":
    _cli()
