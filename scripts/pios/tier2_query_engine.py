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
from tier2_data import (
    FOCUS_DOMAIN, RUN_ID,
    load_topology, load_signals, load_gauge,
    derive_zones, get_zone,
)

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
# Response envelope builders
# ---------------------------------------------------------------------------

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
    if zone["domain_id"] == FOCUS_DOMAIN:
        return _MISSING_FOCUS
    return []


def _build_unresolved(zone: Dict) -> List[Dict]:
    if zone["domain_id"] == FOCUS_DOMAIN:
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
    return {
        "status":               "ok",
        "zone_id":              zone_id,
        "mode":                 mode,
        "run_id":               RUN_ID,
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
    is_focus = did == FOCUS_DOMAIN

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
# Zone list (--list-zones)
# ---------------------------------------------------------------------------

def list_zones() -> Dict:
    topology = load_topology()
    signals  = load_signals()
    gauge    = load_gauge()
    zones    = derive_zones(topology, signals)

    score   = gauge["score"]["canonical"]
    band    = gauge["score"]["band_label"]
    conf_lo = gauge["confidence"]["lower"]
    conf_hi = gauge["confidence"]["upper"]

    return {
        "status":               "ok",
        "run_id":               RUN_ID,
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
    parser.add_argument("--zone",       help="Zone ID (e.g. ZONE-01)")
    parser.add_argument("--mode",       help="WHY | EVIDENCE | TRACE")
    parser.add_argument("--scope",      default="FULL", help="EVIDENCE scope (default: FULL)")
    parser.add_argument("--list-zones", action="store_true", help="Output zone list as JSON")
    args = parser.parse_args()

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

    if args.mode == "TRACE":
        print(json.dumps({"status": "error", "reason": "MODE_NOT_SUPPORTED"}))
        return

    if args.mode not in ("WHY", "EVIDENCE"):
        print(json.dumps({
            "status": "error",
            "reason": "INVALID_PARAMS",
            "detail": f"mode must be WHY or EVIDENCE, got: {args.mode!r}",
        }))
        sys.exit(1)

    try:
        topology = load_topology()
        signals  = load_signals()
    except Exception as e:
        print(json.dumps({"status": "error", "reason": "CANONICAL_DATA_MISSING", "detail": str(e)}))
        sys.exit(1)

    zone = get_zone(args.zone, topology, signals)
    if zone is None:
        print(json.dumps({"status": "error", "reason": "ZONE_NOT_FOUND", "zone_id": args.zone}))
        sys.exit(1)

    try:
        result   = handle_why(zone) if args.mode == "WHY" else handle_evidence(zone)
        response = build_response(args.zone, args.mode, result, zone)
        print(json.dumps(response))
    except Exception as e:
        print(json.dumps({"status": "error", "reason": "ENGINE_FAILURE", "detail": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
