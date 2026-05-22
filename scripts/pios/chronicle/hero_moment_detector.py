"""
HeroMomentDetector — structural hero moment candidate detection.

Contract: PI.GENESIS.GEN-2.HERO-MOMENT-GENESIS-INTEGRATION.01

Detects hero moment candidates from structural centrality (40.3c) and
code-graph (40.3s) evidence. All candidates are CANDIDATE governance state
— operator review required for CONFIRMED.

Detection heuristics derived from NetBox reference specimens (HM-01 through HM-06).
"""

import json
import math
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


def detect_hero_moments(
    client_id: str,
    run_id: str,
    centrality_path: Optional[Path] = None,
    code_graph_path: Optional[Path] = None,
) -> list[dict]:
    """Detect hero moment candidates from structural evidence.

    Returns list of hero moment objects per HERO_MOMENT_GENESIS_MODEL.md §5.
    All returned at governance_state: CANDIDATE.
    """
    candidates = []
    seq = 0

    if centrality_path and centrality_path.exists():
        centrality = _load_json(centrality_path)
        if centrality:
            seq, new = _detect_from_centrality(client_id, run_id, centrality, seq)
            candidates.extend(new)

    if code_graph_path and code_graph_path.exists():
        code_graph = _load_json(code_graph_path)
        if code_graph:
            seq, new = _detect_from_code_graph(client_id, run_id, code_graph, seq)
            candidates.extend(new)

    return candidates


def _detect_from_centrality(
    client_id: str, run_id: str, centrality: dict, seq: int
) -> tuple[int, list[dict]]:
    """Detect hero moments from 40.3c structural centrality data."""
    candidates = []
    ranking = centrality.get("centrality_ranking", [])
    if not ranking:
        return seq, candidates

    metrics = centrality.get("project_metrics", {})
    total_files = metrics.get("total_files", len(ranking))
    threshold_high = max(3, math.ceil(total_files * 0.20))

    in_degrees = [f.get("in_degree", 0) for f in ranking]
    if not in_degrees:
        return seq, candidates

    mean_in = sum(in_degrees) / len(in_degrees)
    variance = sum((x - mean_in) ** 2 for x in in_degrees) / len(in_degrees)
    std_in = math.sqrt(variance) if variance > 0 else 0
    outlier_threshold = mean_in + 2 * std_in

    for entry in ranking:
        in_deg = entry.get("in_degree", 0)
        file_path = entry.get("path", entry.get("file", ""))
        role = entry.get("structural_role", "")

        # HM Type 1: Gravitational Dominance — in_degree exceeds mean + 2σ
        if in_deg > outlier_threshold and in_deg >= threshold_high:
            seq += 1
            candidates.append(_make_hero_moment(
                client_id, run_id, seq,
                hero_type="AUTHORITY_SURPRISE",
                discovery_phase="Phase 3.7 — Structural Centrality Derivation",
                description=(
                    f"Gravitational dominance: {file_path} has {in_deg} inbound edges "
                    f"(threshold: {outlier_threshold:.0f}, role: {role})"
                ),
                evidence_refs=[file_path],
                metric_name="in_degree",
                observed=in_deg,
                expected_range=f"0–{outlier_threshold:.0f} (mean + 2σ)",
                deviation=round(in_deg - outlier_threshold, 1),
            ))

        # HM Type 2: Role Anomaly — ISOLATED_LEAF or low-definition file with high in_degree
        defines = entry.get("defines_classes", 0) + entry.get("defines_functions", 0)
        if in_deg >= threshold_high and defines <= 2 and role not in ("RE_EXPORT_HUB",):
            seq += 1
            candidates.append(_make_hero_moment(
                client_id, run_id, seq,
                hero_type="AUTHORITY_SURPRISE",
                discovery_phase="Phase 3.7 — Structural Centrality Derivation",
                description=(
                    f"Enumeration coupling multiplier: {file_path} has {in_deg} inbound edges "
                    f"but only {defines} definitions (potential passive data hub)"
                ),
                evidence_refs=[file_path],
                metric_name="in_degree_vs_definitions",
                observed=in_deg,
                expected_range=f"<{threshold_high} for files with ≤2 definitions",
                deviation=in_deg - threshold_high,
            ))

    # HM Type 3: Dual Authority — different files dominate import vs inheritance
    import_leader = _find_leader(ranking, "import_in_degree")
    inherit_leader = _find_leader(ranking, "inherits_in_degree")

    import_leader_path = (import_leader.get("path", import_leader.get("file", "")) if import_leader else "")
    inherit_leader_path = (inherit_leader.get("path", inherit_leader.get("file", "")) if inherit_leader else "")

    if (import_leader and inherit_leader
            and import_leader_path != inherit_leader_path
            and import_leader.get("import_in_degree", 0) >= threshold_high
            and inherit_leader.get("inherits_in_degree", 0) >= threshold_high):
        seq += 1
        candidates.append(_make_hero_moment(
            client_id, run_id, seq,
            hero_type="TOPOLOGY_SURPRISE",
            discovery_phase="Phase 3.7 — Structural Centrality Derivation",
            description=(
                f"Dual authority structure: import leader is {import_leader_path} "
                f"({import_leader.get('import_in_degree', 0)} imports) but inheritance leader is "
                f"{inherit_leader_path} ({inherit_leader.get('inherits_in_degree', 0)} inheritance edges)"
            ),
            evidence_refs=[import_leader_path, inherit_leader_path],
            metric_name="authority_divergence",
            observed=1,
            expected_range="0 (same file leads both hierarchies)",
            deviation=1,
        ))

    return seq, candidates


def _detect_from_code_graph(
    client_id: str, run_id: str, code_graph: dict, seq: int
) -> tuple[int, list[dict]]:
    """Detect hero moments from 40.3s code-graph data."""
    candidates = []
    relationships = code_graph.get("relationships", [])
    if not relationships:
        return seq, candidates

    imports = [r for r in relationships if r.get("relation_type") == "IMPORTS"]
    if len(imports) < 10:
        return seq, candidates

    # HM Type 4: Cross-Domain Coupling Rate
    cross_domain = 0
    for imp in imports:
        src = imp.get("source_path", "")
        tgt = imp.get("target_path", "")
        if src and tgt:
            src_domain = _extract_domain(src)
            tgt_domain = _extract_domain(tgt)
            if src_domain and tgt_domain and src_domain != tgt_domain:
                cross_domain += 1

    cross_rate = cross_domain / len(imports) if imports else 0
    if cross_rate > 0.50:
        seq += 1
        candidates.append(_make_hero_moment(
            client_id, run_id, seq,
            hero_type="COUPLING_SURPRISE",
            discovery_phase="Phase 3.6 — Code-Graph Structural Enrichment",
            description=(
                f"High cross-domain coupling: {cross_domain}/{len(imports)} imports "
                f"({cross_rate:.1%}) cross module boundaries"
            ),
            evidence_refs=[],
            metric_name="cross_domain_import_rate",
            observed=round(cross_rate, 3),
            expected_range="<0.50 (less than half of imports cross boundaries)",
            deviation=round(cross_rate - 0.50, 3),
        ))

    # HM Type 5: Bidirectional Entanglement
    domain_pairs: dict[tuple[str, str], int] = {}
    for imp in imports:
        src = imp.get("source_path", "")
        tgt = imp.get("target_path", "")
        if src and tgt:
            s_dom = _extract_domain(src)
            t_dom = _extract_domain(tgt)
            if s_dom and t_dom and s_dom != t_dom:
                pair = (s_dom, t_dom)
                domain_pairs[pair] = domain_pairs.get(pair, 0) + 1

    for (a, b), count_ab in domain_pairs.items():
        count_ba = domain_pairs.get((b, a), 0)
        if count_ab >= 10 and count_ba >= 10:
            pair_key = tuple(sorted([a, b]))
            if pair_key == (a, b):
                seq += 1
                candidates.append(_make_hero_moment(
                    client_id, run_id, seq,
                    hero_type="COUPLING_SURPRISE",
                    discovery_phase="Phase 3.6 — Code-Graph Structural Enrichment",
                    description=(
                        f"Bidirectional entanglement: {a} ↔ {b} "
                        f"({count_ab} + {count_ba} = {count_ab + count_ba} mutual imports)"
                    ),
                    evidence_refs=[],
                    metric_name="bidirectional_import_count",
                    observed=count_ab + count_ba,
                    expected_range="<20 mutual imports between domain pairs",
                    deviation=count_ab + count_ba - 20,
                ))

    return seq, candidates


# ── Helpers ──────────────────────────────────────────────────────────────────

def _make_hero_moment(
    client_id: str, run_id: str, seq: int,
    hero_type: str, discovery_phase: str, description: str,
    evidence_refs: list[str], metric_name: str,
    observed, expected_range: str, deviation,
) -> dict:
    """Construct a hero moment object per HERO_MOMENT_GENESIS_MODEL.md §5."""
    return {
        "hero_moment_id": f"HM-{client_id}-{seq:03d}",
        "client": client_id,
        "run_id": run_id,
        "discovery_phase": discovery_phase,
        "hero_type": hero_type,
        "s_level_at_discovery": "S1",
        "path_at_discovery": "PATH_A",
        "description": description,
        "evidence_refs": evidence_refs,
        "structural_metric": {
            "metric_name": metric_name,
            "observed_value": observed,
            "expected_range": expected_range,
            "deviation": deviation,
        },
        "governance_state": "CANDIDATE",
        "operator_note": None,
        "learning_event_ref": None,
        "replay_safe": True,
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z",
    }


def _extract_domain(path: str) -> Optional[str]:
    """Extract the top-level domain from a file path.

    For paths like 'netbox/dcim/models/device.py', returns 'dcim'.
    For paths like 'src/flask/app.py', returns 'flask'.
    Skips common non-domain prefixes.
    """
    parts = path.replace("\\", "/").split("/")
    skip = {"src", "lib", "pkg", "packages", "apps", "modules"}
    for i, part in enumerate(parts):
        if part.lower() not in skip and not part.startswith("."):
            if i + 1 < len(parts) and not parts[i + 1].endswith(".py"):
                return parts[i + 1] if len(parts) > i + 2 else parts[i]
            elif i + 1 < len(parts):
                return parts[i]
    return parts[0] if parts else None


def _find_leader(ranking: list[dict], metric_key: str) -> Optional[dict]:
    """Find the file with highest value for a given metric."""
    best = None
    best_val = -1
    for entry in ranking:
        val = entry.get(metric_key, 0)
        if val > best_val:
            best_val = val
            best = entry
    return best


def _load_json(path: Path) -> Optional[dict]:
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None
