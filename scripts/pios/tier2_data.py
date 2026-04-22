"""
scripts/pios/tier2_data.py
TIER2.RUNTIME.QUERY.ENGINE.01

Shared canonical data access module for Tier-2 query engine.
Imported by tier2_query_engine.py.

All outputs are deterministic given fixed canonical inputs.
No advisory content. No inference beyond evidence.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent

CANONICAL_PKG_DIR = (
    REPO_ROOT
    / "clients" / "blueedge" / "psee"
    / "runs" / "run_authoritative_recomputed_01" / "package"
)

FOCUS_DOMAIN = "DOMAIN-10"
RUN_ID       = "run_authoritative_recomputed_01"


def load_topology() -> Dict:
    return json.loads((CANONICAL_PKG_DIR / "canonical_topology.json").read_text())


def load_signals() -> Dict:
    return json.loads((CANONICAL_PKG_DIR / "signal_registry.json").read_text())


def load_gauge() -> Dict:
    return json.loads((CANONICAL_PKG_DIR / "gauge_state.json").read_text())


def derive_zones(topology: Dict, signals: Dict) -> List[Dict]:
    """Deterministic zone derivation from canonical inputs.

    Ordering: focus domain first, then remaining WEAKLY GROUNDED domains
    sorted by insertion order in topology (HIGH before MODERATE before LOW severity).
    """
    domains = topology["domains"]
    sigs    = signals["signals"]

    sigs_by_domain: Dict[str, List] = {}
    for s in sigs:
        did = s.get("domain_id", "")
        sigs_by_domain.setdefault(did, []).append(s)

    candidates: List[Dict] = []
    seen: set = set()

    for d in domains:
        if d["domain_id"] == FOCUS_DOMAIN and d["domain_id"] not in seen:
            candidates.append(d)
            seen.add(d["domain_id"])

    for d in domains:
        if d["grounding"] != "GROUNDED" and d["domain_id"] not in seen:
            candidates.append(d)
            seen.add(d["domain_id"])

    zones: List[Dict] = []
    for i, d in enumerate(candidates, 1):
        did        = d["domain_id"]
        domain_sigs = sigs_by_domain.get(did, [])
        is_focus   = did == FOCUS_DOMAIN

        if is_focus and domain_sigs:
            zone_type = "pressure_concentration"
        elif not domain_sigs:
            zone_type = "evidence_gap"
        else:
            confs = {s.get("evidence_confidence") for s in domain_sigs}
            if "STRONG" in confs and "WEAK" in confs:
                zone_type = "signal_conflict"
            else:
                zone_type = "structural_inconsistency"

        severity = (
            "HIGH"     if is_focus
            else "MODERATE" if zone_type == "evidence_gap"
            else "LOW"
        )

        if not domain_sigs:
            confidence = "WEAK"
        elif any(s.get("evidence_confidence") == "STRONG" for s in domain_sigs):
            confidence = "STRONG"
        elif any(s.get("evidence_confidence") == "MODERATE" for s in domain_sigs):
            confidence = "PARTIAL"
        else:
            confidence = "WEAK"

        if not domain_sigs:
            traceability = "NOT_TRACEABLE"
        elif all(s.get("trace_links") for s in domain_sigs):
            traceability = "FULLY_TRACEABLE"
        else:
            traceability = "PARTIALLY_TRACEABLE"

        zones.append({
            "zone_id":     f"ZONE-{i:02d}",
            "domain_id":   did,
            "domain_name": d["domain_name"],
            "domain":      d,
            "domain_sigs": domain_sigs,
            "zone_type":   zone_type,
            "severity":    severity,
            "confidence":  confidence,
            "traceability": traceability,
        })

    return zones


def get_zone(zone_id: str, topology: Dict, signals: Dict) -> Optional[Dict]:
    for z in derive_zones(topology, signals):
        if z["zone_id"] == zone_id:
            return z
    return None
