"""
scripts/pios/tier2_query_engine.py
TIER2.RUNTIME.QUERY.ENGINE.01

Tier-2 live query engine — WHY and EVIDENCE modes.
Called by app/gauge-product/pages/api/query.js via execFile.

CLI:
  python3 tier2_query_engine.py --zone ZONE-01 --mode WHY
  python3 tier2_query_engine.py --zone ZONE-01 --mode EVIDENCE [--scope FULL]
  python3 tier2_query_engine.py --zone ZONE-01 --mode TRACE   → MODE_NOT_SUPPORTED
  python3 tier2_query_engine.py --list-zones

Response invariants (enforced in build_response):
  - inference_prohibition: "ACTIVE" always present
  - uncertainty.unresolved always non-empty for WEAKLY GROUNDED zones
  - evidence_basis.missing populated whenever evidence gaps exist
  - No advisory content in any field
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Dict, List

# Ensure tier2_data is importable regardless of CWD
sys.path.insert(0, str(Path(__file__).resolve().parent))
import tier2_data

# ---------------------------------------------------------------------------
# Constant evidence text blocks
# ---------------------------------------------------------------------------

_UNRESOLVED_FOCUS: List[Dict] = [
    {
        "element": "Seven runtime operational dimensions",
        "reason": (
            "Absence of live instrumentation prevents resolution of: backend service memory usage, "
            "cache efficiency, cache availability, event pipeline activity, fleet connection activity, "
            "vehicle alert activity, and driver session performance. Prometheus metrics scrape and "
            "WebSocket/event-stream telemetry are required to resolve these dimensions."
        ),
    },
    {
        "element": "Propagation extent to adjacent domains",
        "reason": (
            "Cross-domain structural connections are component-confirmed but not topology-edge-confirmed. "
            "Full propagation scope cannot be declared without live traversal data."
        ),
    },
]

_UNRESOLVED_NO_SIGNALS: List[Dict] = [
    {
        "element": "Complete structural state of domain",
        "reason": (
            "Absence of any signal coverage prevents characterization of capability-level or "
            "component-level structural state within this domain."
        ),
    },
]

_UNRESOLVED_PARTIAL: List[Dict] = [
    {
        "element": "Full signal confidence resolution",
        "reason": "Not all signals in zone scope have achieved full evidence closure.",
    },
]

_MISSING_FOCUS: List[Dict] = [
    {
        "item": "Live Prometheus metrics scrape",
        "impact": (
            "Backend service memory usage, cache efficiency, and cache availability cannot be "
            "confirmed without runtime instrumentation."
        ),
    },
    {
        "item": "WebSocket and event-stream telemetry",
        "impact": (
            "Event pipeline activity, fleet connection activity, vehicle alert activity, and "
            "driver session performance require live data to resolve."
        ),
    },
]

_MISSING_NO_SIGNALS: List[Dict] = [
    {
        "item": "Any signal coverage for this domain",
        "impact": (
            "Domain structural state cannot be classified beyond grounding status without at least "
            "one bound signal."
        ),
    },
]

# ---------------------------------------------------------------------------
# Interpretation exposure — loaded once per process, indexes built on demand
# ---------------------------------------------------------------------------

_EXPOSURE_INDEX: Dict = {}


def _load_exposure_index() -> Dict:
    """Load interpretation_exposure.json and return lookup indexes.

    Indexes:
      by_zone_id:  zone_id  → primary EXP item (source_type='zone', binding_context=None)
      by_signal_id: signal_id → EXP item (source_type='signal')
      by_cond_id:  condition_id → EXP item (source_type='condition')

    Returns empty dicts if file is absent — interpretation is optional.
    Caches result on first call; never reloads within a process.
    """
    global _EXPOSURE_INDEX
    if _EXPOSURE_INDEX:
        return _EXPOSURE_INDEX

    exposure_path = (
        tier2_data.REPO_ROOT / "docs" / "pios" / "41.x" / "interpretation_exposure.json"
    )
    result: Dict = {"by_zone_id": {}, "by_signal_id": {}, "by_cond_id": {}}

    if not exposure_path.exists():
        _EXPOSURE_INDEX = result
        return _EXPOSURE_INDEX

    try:
        exp = json.loads(exposure_path.read_text())
        for item in exp.get("exposure_items", []):
            src   = item.get("source_ref", {})
            stype = item.get("source_type")
            ctx   = item.get("binding_context")
            if stype == "zone" and ctx is None and src.get("zone_id"):
                result["by_zone_id"][src["zone_id"]] = item
            elif stype == "signal" and src.get("signal_id"):
                result["by_signal_id"][src["signal_id"]] = item
            elif stype == "condition" and src.get("condition_id"):
                result["by_cond_id"][src["condition_id"]] = item
    except Exception:
        pass

    _EXPOSURE_INDEX = result
    return _EXPOSURE_INDEX


_EXEC_LINE_STOP: frozenset = frozenset({
    "a", "an", "the", "of", "in", "on", "at", "to", "for", "from", "by", "with",
    "this", "that", "it", "its", "is", "are", "was", "were", "be", "been", "being",
    "and", "or", "but", "not", "no", "as", "than", "more", "many", "much", "far",
    "which", "who", "how", "where", "when", "while", "other", "another", "any",
    "each", "all", "both", "one", "has", "have", "had", "per",
})


def _derive_executive_line(text: str) -> str:
    """Derive a deterministic executive summary line from interpretation text.

    Steps:
    1. Take first sentence (up to ". "); truncate at subordinate markers (; — :)
    2. Remove duplicate content tokens (keep last occurrence; skip stop words)
    Deterministic: same input always yields same output. No new terms added.
    """
    if not text:
        return text
    dot = text.find(". ")
    first = text[:dot] if dot != -1 else text
    for marker in ["; ", " \u2014 ", ": "]:
        pos = first.find(marker)
        if pos != -1:
            first = first[:pos]
    first = first.strip()

    words = first.split()
    seen: dict = {}
    for i, w in enumerate(words):
        key = w.lower().rstrip(".,;!?")
        if key not in _EXEC_LINE_STOP:
            seen.setdefault(key, []).append(i)

    remove = {idx for indices in seen.values() if len(indices) > 1 for idx in indices[:-1]}
    return " ".join(w for i, w in enumerate(words) if i not in remove)


def _make_interpretation(exp_item) -> Dict:
    """Extract the standard interpretation attachment dict from an exposure item.

    Returns None if exp_item is None — callers must guard before attaching.
    """
    if exp_item is None:
        return None
    rp  = exp_item.get("render_payload", {})
    biz = rp.get("business_expression", "")
    return {
        "behavioral_meaning":            rp.get("behavioral_meaning", ""),
        "system_expression":             rp.get("system_expression", ""),
        "business_expression":           biz,
        "executive_interpretation_line": _derive_executive_line(biz),
        "interpretation_ref":            exp_item.get("interpretation_ref", {}).get("registry_entry_id"),
        "binding_id":                    exp_item.get("binding_id"),
        "exposure_id":                   exp_item.get("exposure_id"),
    }


# ---------------------------------------------------------------------------
# Response envelope builders
# ---------------------------------------------------------------------------

def _build_vault_targets(zone: Dict) -> List[Dict]:
    """Deterministic vault node references for EVIDENCE responses.

    Always includes the two source artifact nodes; adds one entry per
    bound signal so the workspace can link directly to vault signal nodes.
    """
    targets: List[Dict] = [
        {"type": "artifact", "id": "ART-04", "label": "canonical_topology.json"},
        {"type": "artifact", "id": "ART-05", "label": "signal_registry.json"},
    ]
    for s in zone["domain_sigs"]:
        targets.append({
            "type":  "signal",
            "id":    s["signal_id"],
            "label": s.get("title", s["signal_id"]),
        })
    return targets


def _build_available(zone: Dict) -> List[Dict]:
    result = []
    for s in zone["domain_sigs"]:
        for link in s.get("trace_links", []):
            result.append({
                "signal_id":           s["signal_id"],
                "trace_link":          link,
                "evidence_confidence": s.get("evidence_confidence", "UNKNOWN"),
            })
    return result


def _build_missing(zone: Dict) -> List[Dict]:
    if not zone["domain_sigs"]:
        return _MISSING_NO_SIGNALS
    if zone["domain_id"] == tier2_data.FOCUS_DOMAIN:
        return _MISSING_FOCUS
    return []


def _build_unresolved(zone: Dict) -> List[Dict]:
    if zone["domain_id"] == tier2_data.FOCUS_DOMAIN:
        return _UNRESOLVED_FOCUS
    if not zone["domain_sigs"]:
        return _UNRESOLVED_NO_SIGNALS
    return _UNRESOLVED_PARTIAL


def build_response(zone_id: str, mode: str, result: Dict, zone: Dict) -> Dict:
    unresolved = _build_unresolved(zone)
    if not unresolved:
        raise ValueError(
            f"build_response: unresolved is empty for {zone_id} — "
            "invariant violation: WEAKLY GROUNDED zones must have non-empty unresolved list"
        )
    response: Dict = {
        "status":               "ok",
        "zone_id":              zone_id,
        "mode":                 mode,
        "run_id":               tier2_data.RUN_ID,
        "inference_prohibition": "ACTIVE",
        "result":               result,
        "evidence_basis": {
            "available": _build_available(zone),
            "missing":   _build_missing(zone),
        },
        "uncertainty": {
            "unresolved": unresolved,
        },
    }
    if mode == "EVIDENCE":
        response["vault_targets"] = _build_vault_targets(zone)
    return response

# ---------------------------------------------------------------------------
# WHY handler
# ---------------------------------------------------------------------------

def _zt_contribution(zt: str, is_focus: bool, sig_count: int) -> str:
    return {
        "pressure_concentration": (
            "Focus domain with bound signals — structural pressure is concentrated and "
            "multiple operational dimensions cannot be resolved from static evidence alone"
        ),
        "evidence_gap": (
            "No signals are bound to this domain — structural state cannot be classified "
            "beyond grounding status"
        ),
        "signal_conflict": (
            "Signals with conflicting evidence confidence levels (STRONG and WEAK) exist "
            "within the same domain scope"
        ),
        "structural_inconsistency": (
            "Signal coverage is present but not all structural conditions within the domain "
            "are fully resolved"
        ),
    }.get(zt, zt)


def handle_why(zone: Dict) -> Dict:
    did    = zone["domain_id"]
    zt     = zone["zone_type"]
    domain = zone["domain"]
    sigs   = zone["domain_sigs"]
    caps   = domain.get("capability_ids", [])
    is_focus = did == tier2_data.FOCUS_DOMAIN

    rationale: List[Dict] = []

    if is_focus:
        rationale.append({
            "factor":      "focus_domain",
            "value":       True,
            "source":      "canonical_topology.json: domain_id matches designated focus domain",
            "contribution": (
                "Focus domain is always a zone candidate; structural pressure concentrates "
                "at the focus domain when signals are present"
            ),
        })

    rationale.append({
        "factor":      "grounding",
        "value":       domain["grounding"],
        "source":      "canonical_topology.json: domain.grounding",
        "contribution": (
            "WEAKLY GROUNDED status indicates structural conditions that cannot be fully "
            "resolved from available static evidence"
        ),
    })

    rationale.append({
        "factor":      "signal_count",
        "value":       len(sigs),
        "source":      "signal_registry.json: signals filtered by domain_id",
        "contribution": (
            "Signal presence combined with focus domain status triggers pressure_concentration"
            if is_focus and sigs
            else "No signals bound — triggers evidence_gap classification"
            if not sigs
            else "Signal presence contributes to zone type determination"
        ),
    })

    if sigs:
        confs   = [s.get("evidence_confidence", "UNKNOWN") for s in sigs]
        highest = ("STRONG" if "STRONG" in confs
                   else "MODERATE" if "MODERATE" in confs else "WEAK")
        rationale.append({
            "factor":      "highest_evidence_confidence",
            "value":       highest,
            "source":      "signal_registry.json: signal.evidence_confidence (highest in zone)",
            "contribution": "Determines zone confidence rating",
        })
        for s in sigs:
            rationale.append({
                "factor": f"signal_{s['signal_id']}",
                "value": {
                    "title":               s.get("title", ""),
                    "evidence_confidence": s.get("evidence_confidence"),
                },
                "source":      f"signal_registry.json: signal_id={s['signal_id']}",
                "contribution": "Bound signal contributing to zone classification",
            })

    rationale.append({
        "factor": "zone_type_trigger",
        "value":  zt,
        "source": (
            f"derived from: grounding=WEAKLY GROUNDED, "
            f"focus_domain={is_focus}, signal_count={len(sigs)}"
        ),
        "contribution": _zt_contribution(zt, is_focus, len(sigs)),
    })

    return {
        "zone_type":  zt,
        "severity":   zone["severity"],
        "confidence": zone["confidence"],
        "traceability": zone["traceability"],
        "classification_rationale": rationale,
        "structural_scope": {
            "capability_count": len(caps),
            "capability_ids":   caps,
            "source": "canonical_topology.json: domain.capability_ids",
        },
    }

# ---------------------------------------------------------------------------
# TRACE handler
# ---------------------------------------------------------------------------

def handle_trace(zone: Dict, topology: Dict) -> Dict:
    """Build structural propagation paths from canonical containment + signal binding.

    No graph traversal engine. No invented nodes. Two path types only:
      FORWARD  — structural containment: domain → capabilities
      EVIDENCE — signal-backed chain: domain → signal node

    Weakly-grounded capabilities carry inferred_declaration (required by contract).
    """
    zone_id      = zone["zone_id"]
    did          = zone["domain_id"]
    domain       = zone["domain"]
    sigs         = zone["domain_sigs"]
    cap_ids      = domain.get("capability_ids", [])

    if zone["traceability"] == "NOT_TRACEABLE":
        return {
            "paths":   [],
            "message": "No traceable propagation paths identified from available evidence.",
        }

    caps_by_id = {c["capability_id"]: c for c in topology.get("capabilities", [])}
    paths: List[Dict] = []
    n = 0

    # Path: domain → grounded capabilities (structural fact, no inferred_declaration)
    grounded = [cid for cid in cap_ids
                if not caps_by_id.get(cid, {}).get("weakly_grounded", False)]
    if grounded:
        n += 1
        paths.append({
            "path_id":          f"{zone_id}-P{n}",
            "node_chain":       [did] + grounded,
            "path_type":        "FORWARD",
            "evidence_support": "PARTIAL",
        })

    # Path: domain → weakly grounded capability (one path per; inferred_declaration required)
    for cid in cap_ids:
        cap = caps_by_id.get(cid, {})
        if cap.get("weakly_grounded"):
            n += 1
            paths.append({
                "path_id":    f"{zone_id}-P{n}",
                "node_chain": [did, cid],
                "path_type":  "FORWARD",
                "evidence_support": "WEAK",
                "inferred_declaration": (
                    f"This path is inferred. {cid} ({cap.get('capability_name', cid)}) "
                    f"is weakly grounded within {did} — structural state cannot be "
                    "confirmed from available evidence."
                ),
            })

    # Paths: domain → signal (one evidence path per bound signal)
    for s in sigs:
        n += 1
        paths.append({
            "path_id":          f"{zone_id}-P{n}",
            "node_chain":       [did, s["signal_id"]],
            "path_type":        "EVIDENCE",
            "evidence_support": s.get("evidence_confidence", "WEAK"),
        })

    return {"paths": paths}


def build_trace_response(zone_id: str, zone: Dict, trace_data: Dict) -> Dict:
    unresolved = _build_unresolved(zone)
    if not unresolved:
        raise ValueError(
            f"build_trace_response: unresolved is empty for {zone_id} — invariant violation"
        )
    response: Dict = {
        "status":                "ok",
        "zone_id":               zone_id,
        "mode":                  "TRACE",
        "run_id":                tier2_data.RUN_ID,
        "inference_prohibition": "ACTIVE",
        "trace":                 trace_data["paths"],
        "evidence_basis": {
            "available": _build_available(zone),
            "missing":   _build_missing(zone),
        },
        "uncertainty": {
            "unresolved": unresolved,
        },
    }
    if "message" in trace_data:
        response["message"] = trace_data["message"]
    return response


# ---------------------------------------------------------------------------
# EVIDENCE handler
# ---------------------------------------------------------------------------

def handle_evidence(zone: Dict) -> Dict:
    sigs        = zone["domain_sigs"]
    total_links = 0

    signal_coverage: List[Dict] = []
    for s in sigs:
        links       = s.get("trace_links", [])
        total_links += len(links)
        signal_coverage.append({
            "signal_id":           s["signal_id"],
            "title":               s.get("title", ""),
            "domain_id":           s.get("domain_id", ""),
            "evidence_confidence": s.get("evidence_confidence", "UNKNOWN"),
            "trace_link_count":    len(links),
            "trace_links":         links,
            "source":              (
                f"signal_registry.json: signal_id={s['signal_id']}, trace_links field"
            ),
        })

    return {
        "signal_coverage":    signal_coverage,
        "total_trace_links":  total_links,
        "signals_with_links": sum(1 for s in sigs if s.get("trace_links")),
        "signals_total":      len(sigs),
    }

# ---------------------------------------------------------------------------
# 41.x projection data loading
# ---------------------------------------------------------------------------

def _load_projection_artifact(client_id: str, run_id: str, filename: str) -> Dict:
    """Load one artifact from the run-scoped 41.x projection package.

    Fails closed — raises FileNotFoundError if artifact is absent.
    No fallback to BlueEdge or any other client.
    """
    path = (
        tier2_data.REPO_ROOT
        / "clients" / client_id / "psee" / "runs" / run_id / "41.x"
        / filename
    )
    if not path.exists():
        raise FileNotFoundError(
            f"41.x artifact not found — expected: "
            f"clients/{client_id}/psee/runs/{run_id}/41.x/{filename}"
        )
    return json.loads(path.read_text())


def list_zones_from_projection(client_id: str, run_id: str) -> Dict:
    """Build zone list from run-scoped 41.x pressure_zone_projection.json.

    Source: clients/<client>/psee/runs/<run_id>/41.x/
    No derivation from canonical_topology or signal_registry.
    No fallback to BlueEdge.
    Fails closed if 41.x artifacts are absent.
    """
    projection = _load_projection_artifact(client_id, run_id, "pressure_zone_projection.json")
    signals    = _load_projection_artifact(client_id, run_id, "signal_projection.json")

    sig_by_cond = {s["condition_id"]: s for s in signals.get("active_conditions_in_scope", [])}

    zones = []
    for z in projection.get("zone_projection", []):
        conditions = [
            {
                "condition_id":     c,
                "signal_id":        sig_by_cond.get(c, {}).get("signal_id", "UNKNOWN"),
                "activation_state": sig_by_cond.get(c, {}).get("activation_state", "UNKNOWN"),
            }
            for c in z.get("conditions", [])
        ]
        zones.append({
            "zone_id":             z["zone_id"],
            "zone_type":           z["zone_type"],
            "zone_class":          z["zone_class"],
            "anchor_id":           z["anchor_id"],
            "anchor_name":         z["anchor_name"],
            "attribution_profile": z.get("attribution_profile"),
            "condition_count":     z["condition_count"],
            "conditions":          conditions,
            "member_entity_ids":   z.get("member_entity_ids", []),
        })

    return {
        "status":                "ok",
        "run_id":                run_id,
        "client_id":             client_id,
        "projection_source":     "41.x",
        "projection_contract":   projection.get("projection_contract"),
        "inference_prohibition": "ACTIVE",
        "focus_domain_selected": projection.get("focus_domain_selected", False),
        "ranking_applied":       projection.get("ranking_applied", False),
        "combination_signature": signals.get("combination_signature", {}),
        "zones":                 zones,
        "total_zones":           len(zones),
    }


# ---------------------------------------------------------------------------
# 41.x projection zone query handlers (WHY / EVIDENCE / TRACE)
# ---------------------------------------------------------------------------

_PROJECTION_UNRESOLVED = [
    {
        "element": "focus domain selection",
        "reason": "No focus domain has been selected; pressure zones are not ranked",
    },
    {
        "element": "canonical topology",
        "reason": "Projection data is structural only; no canonical_topology used",
    },
]

_PROJECTION_CLASS_CONTRIBUTION = {
    "COMPOUND_ZONE":      "condition_count >= 3 — three structural conditions co-present",
    "COUPLING_ZONE":      "PSIG-001 + PSIG-002 co-present — coupling condition pair",
    "PROPAGATION_ZONE":   "PSIG-002 + PSIG-004 co-present — propagation condition pair",
    "RESPONSIBILITY_ZONE":"PSIG-001 + PSIG-004 co-present — responsibility condition pair",
    "FRAGMENTATION_ZONE": "PSIG-006 present — structural blind-spot activated",
}


def get_projection_zone_data(zone_id: str, client_id: str, run_id: str):
    """Load a single zone and its condition records from the 41.x projection package.

    Returns (zone_record, sig_by_cond, combo_sig).
    zone_record is None if zone_id is not found.
    Raises FileNotFoundError if 41.x artifacts are absent.
    """
    projection = _load_projection_artifact(client_id, run_id, "pressure_zone_projection.json")
    signals    = _load_projection_artifact(client_id, run_id, "signal_projection.json")

    zone_record = next(
        (z for z in projection.get("zone_projection", []) if z["zone_id"] == zone_id),
        None,
    )
    sig_by_cond = {
        s["condition_id"]: s
        for s in signals.get("active_conditions_in_scope", [])
    }
    combo_sig = signals.get("combination_signature", {})

    return zone_record, sig_by_cond, combo_sig


def handle_projection_why(zone: Dict, sig_by_cond: Dict) -> Dict:
    """WHY mode for a 41.x projection zone.

    Derives classification rationale solely from 41.x projection artifacts.
    No canonical_topology usage. No signal_registry usage.
    """
    rationale: List[Dict] = [
        {
            "factor":      "zone_class_trigger",
            "value":       zone["zone_class"],
            "source":      "41.x/pressure_zone_projection.json: zone_class",
            "contribution": _PROJECTION_CLASS_CONTRIBUTION.get(zone["zone_class"], zone["zone_class"]),
        },
        {
            "factor":      "attribution_profile",
            "value":       zone.get("attribution_profile"),
            "source":      "41.x/pressure_zone_projection.json: attribution_profile",
            "contribution": (
                "Zone carries primary attribution — anchor domain is the highest-signal entity"
                if zone.get("attribution_profile") == "primary"
                else "Zone carries secondary attribution — conditions attributed via co-located entity"
            ),
        },
        {
            "factor":      "embedded_pair_rules",
            "value":       zone.get("embedded_pair_rules", []),
            "source":      "41.x/pressure_zone_projection.json: embedded_pair_rules",
            "contribution": "Pair-wise structural rules embedded in this compound zone",
        },
    ]

    for cond_id in zone.get("conditions", []):
        cond = sig_by_cond.get(cond_id, {})
        rationale.append({
            "factor": f"condition_{cond_id}",
            "value": {
                "signal_id":        cond.get("signal_id"),
                "activation_state": cond.get("activation_state"),
                "signal_value":     cond.get("signal_value"),
            },
            "source":      f"41.x/signal_projection.json: condition_id={cond_id}",
            "contribution": "Activated structural condition contributing to zone class",
        })

    result: Dict = {
        "zone_class":        zone["zone_class"],
        "zone_type":         zone["zone_type"],
        "anchor": {
            "anchor_id":   zone["anchor_id"],
            "anchor_name": zone["anchor_name"],
        },
        "attribution_profile": zone.get("attribution_profile"),
        "condition_count":     zone["condition_count"],
        "structural_scope": {
            "capability_count":  0,
            "capability_ids":    [],
            "member_entity_ids": zone.get("member_entity_ids", []),
            "candidate_ids":     zone.get("candidate_ids", []),
            "source":            "41.x/pressure_zone_projection.json: member_entity_ids, candidate_ids",
        },
        "classification_rationale": rationale,
    }
    interp = _make_interpretation(_load_exposure_index()["by_zone_id"].get(zone["zone_id"]))
    if interp:
        result["interpretation"] = interp
    return result


def handle_projection_evidence(zone: Dict, sig_by_cond: Dict, combo_sig: Dict) -> Dict:
    """EVIDENCE mode for a 41.x projection zone.

    Returns PSIG condition records from 41.x signal_projection only.
    No canonical_topology usage. No signal_registry usage.
    """
    idx             = _load_exposure_index()
    signal_coverage: List[Dict] = []
    for cond_id in zone.get("conditions", []):
        cond = sig_by_cond.get(cond_id, {})
        entry: Dict = {
            "condition_id":     cond_id,
            "signal_id":        cond.get("signal_id", "UNKNOWN"),
            "signal_authority": cond.get("signal_authority", "PROVISIONAL_CKR_CANDIDATE"),
            "activation_state": cond.get("activation_state", "UNKNOWN"),
            "signal_value":     cond.get("signal_value"),
            "activation_method": cond.get("activation_method"),
            "attribution_role": zone.get("attribution_profile"),
            "source":           f"41.x/signal_projection.json: condition_id={cond_id}",
        }
        cond_interp = _make_interpretation(idx["by_cond_id"].get(cond_id))
        if cond_interp:
            entry["interpretation"] = cond_interp
        signal_coverage.append(entry)

    result: Dict = {
        "signal_coverage":      signal_coverage,
        "total_conditions":     len(signal_coverage),
        "combination_signature": combo_sig.get("primary", ""),
        "source":               "41.x projection only — no canonical_topology or signal_registry used",
    }
    zone_exp = idx["by_zone_id"].get(zone["zone_id"])
    if zone_exp:
        result["interpretation_trace"] = {
            "registry_path":  "docs/pios/41.x/interpretation_registry.json",
            "binding_path":   "docs/pios/41.x/interpretation_binding.json",
            "evidence_status": "registry_bound",
        }
    return result


def handle_projection_trace(zone: Dict, sig_by_cond: Dict) -> List[Dict]:
    """TRACE mode for a 41.x projection zone.

    Returns PZ → PSIG → condition origin chains.
    No traversal outside projection data.
    """
    zone_id = zone["zone_id"]
    idx     = _load_exposure_index()
    paths: List[Dict] = []

    for i, cond_id in enumerate(zone.get("conditions", []), 1):
        cond   = sig_by_cond.get(cond_id, {})
        sig_id = cond.get("signal_id", "UNKNOWN")
        path: Dict = {
            "path_id":          f"{zone_id}-P{i}",
            "node_chain":       [zone_id, sig_id, cond_id],
            "path_type":        "EVIDENCE",
            "evidence_support": cond.get("activation_state", "UNKNOWN"),
            "activation_method": cond.get("activation_method"),
            "source":           "41.x/pressure_zone_projection.json + signal_projection.json",
        }
        sig_exp = idx["by_signal_id"].get(sig_id)
        if sig_exp:
            path["interpretation_ref"] = sig_exp["interpretation_ref"]["registry_entry_id"]
            path["binding_id"]         = sig_exp["binding_id"]
        paths.append(path)

    return paths


def build_projection_query_response(
    zone_id: str, mode: str, result, run_id: str
) -> Dict:
    response: Dict = {
        "status":                "ok",
        "zone_id":               zone_id,
        "mode":                  mode,
        "run_id":                run_id,
        "inference_prohibition": "ACTIVE",
        "evidence_basis": {
            "source":                   "41.x projection only",
            "canonical_topology_used":  False,
            "signal_registry_used":     False,
        },
        "uncertainty": {
            "unresolved": _PROJECTION_UNRESOLVED,
        },
    }
    if mode == "TRACE":
        response["trace"] = result
    else:
        response["result"] = result
    return response


# ---------------------------------------------------------------------------
# Zone list (--list-zones)
# ---------------------------------------------------------------------------

def list_zones() -> Dict:
    topology = tier2_data.load_topology()
    signals  = tier2_data.load_signals()
    gauge    = tier2_data.load_gauge()
    zones    = tier2_data.derive_zones(topology, signals)

    score   = gauge["score"]["canonical"]
    band    = gauge["score"]["band_label"]
    conf_lo = gauge["confidence"]["lower"]
    conf_hi = gauge["confidence"]["upper"]

    return {
        "status":               "ok",
        "run_id":               tier2_data.RUN_ID,
        "inference_prohibition": "ACTIVE",
        "context": {
            "score":      score,
            "band":       band,
            "confidence": f"{conf_lo}–{conf_hi}",
        },
        "zones": [
            {
                "zone_id":          z["zone_id"],
                "domain_id":        z["domain_id"],
                "domain_name":      z["domain_name"],
                "zone_type":        z["zone_type"],
                "severity":         z["severity"],
                "confidence":       z["confidence"],
                "traceability":     z["traceability"],
                "capability_count": len(z["domain"].get("capability_ids", [])),
                "signal_count":     len(z["domain_sigs"]),
            }
            for z in zones
        ],
        "total_zones": len(zones),
    }

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Tier-2 query engine — WHY and EVIDENCE modes")
    parser.add_argument("--client",       default="blueedge",
                        help="Client ID for canonical package path (default: blueedge)")
    parser.add_argument("--run-id",       default="run_authoritative_recomputed_01",
                        help="Run ID for canonical package path (default: run_authoritative_recomputed_01)")
    parser.add_argument("--focus-domain", default="DOMAIN-10",
                        help="Focus domain ID for zone classification (default: DOMAIN-10)")
    parser.add_argument("--zone",       help="Zone ID (e.g. ZONE-01)")
    parser.add_argument("--mode",       help="WHY | EVIDENCE | TRACE")
    parser.add_argument("--scope",      default="FULL", help="EVIDENCE scope (default: FULL)")
    parser.add_argument("--list-zones",  action="store_true", help="Output zone list as JSON")
    parser.add_argument("--projection",  action="store_true",
                        help="Use run-scoped 41.x projection artifacts (no BlueEdge fallback)")
    args = parser.parse_args()

    # 41.x projection mode — short-circuits before canonical data loading.
    # No tier2_data.configure() call; no BlueEdge package is touched.
    if args.projection:
        if args.list_zones:
            try:
                print(json.dumps(list_zones_from_projection(args.client, args.run_id)))
            except FileNotFoundError as e:
                print(json.dumps({
                    "status": "NOT_AVAILABLE",
                    "reason": "41X_ARTIFACT_MISSING",
                    "detail": str(e),
                }))
                sys.exit(1)
            except Exception as e:
                print(json.dumps({
                    "status": "error",
                    "reason": "PROJECTION_ENGINE_FAILURE",
                    "detail": str(e),
                }))
                sys.exit(1)
            return
        # Zone query (WHY / EVIDENCE / TRACE) for projection zones
        if not args.zone:
            print(json.dumps({
                "status": "error",
                "reason": "INVALID_PARAMS",
                "detail": "zone_id required for zone query",
            }))
            sys.exit(1)

        if args.mode not in ("WHY", "EVIDENCE", "TRACE"):
            print(json.dumps({
                "status": "error",
                "reason": "INVALID_PARAMS",
                "detail": f"mode must be WHY, EVIDENCE, or TRACE, got: {args.mode!r}",
            }))
            sys.exit(1)

        try:
            zone_record, sig_by_cond, combo_sig = get_projection_zone_data(
                args.zone, args.client, args.run_id
            )
        except FileNotFoundError as e:
            print(json.dumps({
                "status": "NOT_AVAILABLE",
                "reason": "41X_ARTIFACT_MISSING",
                "detail": str(e),
            }))
            sys.exit(1)
        except Exception as e:
            print(json.dumps({
                "status": "error",
                "reason": "PROJECTION_ENGINE_FAILURE",
                "detail": str(e),
            }))
            sys.exit(1)

        if zone_record is None:
            print(json.dumps({
                "status": "error",
                "reason": "ZONE_NOT_FOUND",
                "zone_id": args.zone,
            }))
            sys.exit(1)

        try:
            if args.mode == "WHY":
                result = handle_projection_why(zone_record, sig_by_cond)
            elif args.mode == "EVIDENCE":
                result = handle_projection_evidence(zone_record, sig_by_cond, combo_sig)
            else:
                result = handle_projection_trace(zone_record, sig_by_cond)
            print(json.dumps(
                build_projection_query_response(args.zone, args.mode, result, args.run_id)
            ))
        except Exception as e:
            print(json.dumps({
                "status": "error",
                "reason": "PROJECTION_ENGINE_FAILURE",
                "detail": str(e),
            }))
            sys.exit(1)
        return

    tier2_data.configure(
        client_id=args.client,
        run_id=args.run_id,
        focus_domain=args.focus_domain,
    )

    if args.list_zones:
        try:
            print(json.dumps(list_zones()))
        except Exception as e:
            print(json.dumps({"status": "error", "reason": "CANONICAL_DATA_MISSING", "detail": str(e)}))
            sys.exit(1)
        return

    if not args.zone:
        print(json.dumps({"status": "error", "reason": "INVALID_PARAMS", "detail": "zone_id required"}))
        sys.exit(1)

    if args.mode not in ("WHY", "EVIDENCE", "TRACE"):
        print(json.dumps({
            "status": "error",
            "reason": "INVALID_PARAMS",
            "detail": f"mode must be WHY, EVIDENCE, or TRACE, got: {args.mode!r}",
        }))
        sys.exit(1)

    try:
        topology = tier2_data.load_topology()
        signals  = tier2_data.load_signals()
    except Exception as e:
        print(json.dumps({"status": "error", "reason": "CANONICAL_DATA_MISSING", "detail": str(e)}))
        sys.exit(1)

    zone = tier2_data.get_zone(args.zone, topology, signals)
    if zone is None:
        print(json.dumps({"status": "error", "reason": "ZONE_NOT_FOUND", "zone_id": args.zone}))
        sys.exit(1)

    try:
        if args.mode == "TRACE":
            trace_data = handle_trace(zone, topology)
            response   = build_trace_response(args.zone, zone, trace_data)
        else:
            result   = handle_why(zone) if args.mode == "WHY" else handle_evidence(zone)
            response = build_response(args.zone, args.mode, result, zone)
        print(json.dumps(response))
    except Exception as e:
        print(json.dumps({"status": "error", "reason": "ENGINE_FAILURE", "detail": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
