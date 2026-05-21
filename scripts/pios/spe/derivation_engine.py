"""
SPE Derivation Engine
Contract: PI.PATHB.SEMANTIC-PROPOSITION-ENGINE.01

Six deterministic class derivers producing semantic propositions from PATH A structural artifacts.
All derivation is deterministic — same inputs produce same outputs.
"""

import hashlib
import math
from collections import defaultdict
from datetime import datetime, timezone

from .proposition_schema import (
    SemanticProposition,
    LineageEvent,
    DerivationResult,
)
from .input_loader import SPEInputBundle


def _ts() -> str:
    return datetime.now(timezone.utc).isoformat()


def _lineage_id(counter: list[int]) -> str:
    counter[0] += 1
    return f"SLE-{counter[0]:04d}"


def _prop_id(specimen_id: str, counter: list[int]) -> str:
    counter[0] += 1
    return f"SP-{specimen_id}-{counter[0]:04d}"


def _build_learning_context(learning_events: list[dict], derivation_class: str) -> list[dict]:
    relevant = []
    for le in learning_events:
        cap = le.get("capability_class", "")
        target = le.get("propagation_target", "")
        if cap in ("SEMANTIC_DERIVATION", "SEMANTIC_PROPOSITION") or \
           target == "SEMANTIC_PROPOSITION_ENGINE":
            relevant.append({
                "event_id": le.get("event_id", le.get("id", "unknown")),
                "influence": f"Active during {derivation_class} derivation — no threshold adjustment applied (event at PROPOSED state)",
                "influence_type": "AWARENESS_ONLY",
            })
    return relevant


def _domain_centrality_nodes(bundle: SPEInputBundle, domain: str) -> list[dict]:
    prefix = f"netbox/{domain}/" if domain != "netbox" else "netbox/netbox/"
    return [
        n for n in bundle.centrality_ranking
        if n.get("path", "").startswith(prefix)
    ]


def _median_in_degree(nodes: list[dict]) -> float:
    degrees = sorted(n.get("import_in_degree", 0) for n in nodes)
    if not degrees:
        return 0.0
    mid = len(degrees) // 2
    if len(degrees) % 2 == 0:
        return (degrees[mid - 1] + degrees[mid]) / 2.0
    return float(degrees[mid])


def derive_structural_dominance(
    bundle: SPEInputBundle,
    prop_counter: list[int],
    lineage_counter: list[int],
    ts: str,
) -> tuple[list[SemanticProposition], list[LineageEvent]]:
    propositions = []
    lineage = []
    learning_ctx = _build_learning_context(bundle.learning_events, "STRUCTURAL_DOMINANCE")
    replay_refs = [rc.get("id", "") for rc in bundle.replay_corridors]

    evidence_obj_ids = [eo.get("id", "") for eo in bundle.evidence_objects
                        if eo.get("evidence_class") in ("CENTRALITY", "CODE_GRAPH")]

    for ceu_id, ceu in bundle.confirmed_ceus.items():
        domain = ceu.get("domain", "")
        nodes = _domain_centrality_nodes(bundle, domain)
        if not nodes:
            continue

        top_node = max(nodes, key=lambda n: n.get("import_in_degree", 0))
        top_in = top_node.get("import_in_degree", 0)
        median = _median_in_degree(nodes)

        if median <= 0 or top_in <= 0:
            continue

        ratio = top_in / median
        if ratio < 1.5:
            continue

        prop_id = _prop_id(bundle.spine_objects.get("specimen_id", "unknown"), prop_counter)
        prop = SemanticProposition(
            id=prop_id,
            specimen_id=bundle.spine_objects.get("specimen_id", "unknown"),
            run_id=bundle.spine_objects.get("run_id", "unknown"),
            proposition=(
                f"{ceu_id} exhibits structural gravitational dominance: "
                f"{top_node['path']} concentrates {top_in} inbound imports, "
                f"{ratio:.1f}x the domain median"
            ),
            derivation_tier="DIRECT_EVIDENCE",
            confidence=0.0,
            authority_ceiling="L3",
            evidence_anchors=evidence_obj_ids[:],
            status="CANDIDATE",
            timestamp=ts,
            proposition_class="STRUCTURAL_DOMINANCE",
            ceu_refs=[ceu_id],
            structural_refs={
                "top_node": top_node["path"],
                "import_in_degree": top_in,
                "domain_median_in_degree": median,
                "dominance_ratio": round(ratio, 2),
                "domain_file_count": len(nodes),
                "structural_role": top_node.get("structural_role", "UNKNOWN"),
                "centrality_rank": top_node.get("centrality_rank", 0),
            },
            replay_corridor_refs=replay_refs,
            derivation_rationale=(
                f"Top centrality node in {domain} has {ratio:.1f}x median in-degree. "
                f"Structural role: {top_node.get('structural_role', 'UNKNOWN')}."
            ),
            reconciliation_state="ALIGNED" if ceu.get("reconciliation_finding") == "ALIGNED" else "NOVEL",
        )
        propositions.append(prop)

        lineage.append(LineageEvent(
            event_id=_lineage_id(lineage_counter),
            proposition_id=prop_id,
            event_type="structural_dominance_derivation",
            semantic_type="GROUNDING",
            derivation_class="STRUCTURAL_DOMINANCE",
            evidence={
                "ceu_id": ceu_id,
                "domain": domain,
                "top_node": top_node["path"],
                "in_degree": top_in,
                "median": median,
                "ratio": round(ratio, 2),
            },
            learning_context=learning_ctx,
            timestamp=ts,
        ))

    return propositions, lineage


def derive_coupling_patterns(
    bundle: SPEInputBundle,
    prop_counter: list[int],
    lineage_counter: list[int],
    ts: str,
) -> tuple[list[SemanticProposition], list[LineageEvent]]:
    propositions = []
    lineage = []
    learning_ctx = _build_learning_context(bundle.learning_events, "COUPLING_PATTERN")
    replay_refs = [rc.get("id", "") for rc in bundle.replay_corridors]
    evidence_obj_ids = [eo.get("id", "") for eo in bundle.evidence_objects
                        if eo.get("evidence_class") in ("CODE_GRAPH", "STRUCTURAL")]

    cross_domain_matrix = defaultdict(lambda: defaultdict(int))
    for rel in bundle.code_graph_relationships:
        if rel.get("relation_type") != "IMPORTS":
            continue
        src = rel.get("source_path", "")
        tgt = rel.get("target_path", "")
        if not src or not tgt:
            continue
        src_parts = src.split("/")
        tgt_parts = tgt.split("/")
        if len(src_parts) < 2 or len(tgt_parts) < 2:
            continue
        src_domain = src_parts[1] if src_parts[0] == "netbox" else src_parts[0]
        tgt_domain = tgt_parts[1] if tgt_parts[0] == "netbox" else tgt_parts[0]
        if src_domain != tgt_domain:
            cross_domain_matrix[src_domain][tgt_domain] += 1

    confirmed_domains = {v.get("domain", ""): k for k, v in bundle.confirmed_ceus.items()}
    specimen_id = bundle.spine_objects.get("specimen_id", "unknown")
    run_id = bundle.spine_objects.get("run_id", "unknown")

    seen_pairs = set()
    for src_domain, targets in sorted(cross_domain_matrix.items()):
        for tgt_domain, count in sorted(targets.items(), key=lambda x: -x[1]):
            pair_key = tuple(sorted([src_domain, tgt_domain]))
            if pair_key in seen_pairs:
                continue

            reverse_count = cross_domain_matrix.get(tgt_domain, {}).get(src_domain, 0)
            total_bidirectional = count + reverse_count

            if total_bidirectional < 20:
                continue

            seen_pairs.add(pair_key)

            src_ceu = confirmed_domains.get(src_domain)
            tgt_ceu = confirmed_domains.get(tgt_domain)
            if not src_ceu or not tgt_ceu:
                continue

            prop_id = _prop_id(specimen_id, prop_counter)
            is_bidirectional = count > 0 and reverse_count > 0

            if is_bidirectional:
                text = (
                    f"{src_ceu} and {tgt_ceu} exhibit bidirectional structural entanglement: "
                    f"{total_bidirectional} cross-domain imports ({count}+{reverse_count})"
                )
            else:
                text = (
                    f"{src_ceu} has unidirectional coupling to {tgt_ceu}: "
                    f"{total_bidirectional} cross-domain imports"
                )

            prop = SemanticProposition(
                id=prop_id,
                specimen_id=specimen_id,
                run_id=run_id,
                proposition=text,
                derivation_tier="DIRECT_EVIDENCE",
                confidence=0.0,
                authority_ceiling="L3",
                evidence_anchors=evidence_obj_ids[:],
                status="CANDIDATE",
                timestamp=ts,
                proposition_class="COUPLING_PATTERN",
                ceu_refs=[src_ceu, tgt_ceu],
                structural_refs={
                    "src_domain": src_domain,
                    "tgt_domain": tgt_domain,
                    "forward_count": count,
                    "reverse_count": reverse_count,
                    "total_bidirectional": total_bidirectional,
                    "is_bidirectional": is_bidirectional,
                },
                replay_corridor_refs=replay_refs,
                derivation_rationale=(
                    f"Cross-domain import matrix shows {total_bidirectional} edges between "
                    f"{src_domain} and {tgt_domain}. "
                    f"{'Bidirectional' if is_bidirectional else 'Unidirectional'} coupling."
                ),
                reconciliation_state="ALIGNED",
            )
            propositions.append(prop)

            lineage.append(LineageEvent(
                event_id=_lineage_id(lineage_counter),
                proposition_id=prop_id,
                event_type="coupling_pattern_derivation",
                semantic_type="RELATIONSHIP",
                derivation_class="COUPLING_PATTERN",
                evidence={
                    "src_domain": src_domain,
                    "tgt_domain": tgt_domain,
                    "forward": count,
                    "reverse": reverse_count,
                    "total": total_bidirectional,
                },
                learning_context=learning_ctx,
                timestamp=ts,
            ))

    total_imports = sum(
        1 for r in bundle.code_graph_relationships if r.get("relation_type") == "IMPORTS"
    )
    total_cross = sum(
        sum(targets.values()) for targets in cross_domain_matrix.values()
    )
    if total_imports > 0 and total_cross > 0:
        ratio = total_cross / total_imports
        prop_id = _prop_id(specimen_id, prop_counter)
        prop = SemanticProposition(
            id=prop_id,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition=(
                f"System-level cross-domain coupling rate: {ratio:.1%} "
                f"({total_cross} of {total_imports} imports cross app boundaries)"
            ),
            derivation_tier="DIRECT_EVIDENCE",
            confidence=0.0,
            authority_ceiling="L3",
            evidence_anchors=evidence_obj_ids[:],
            status="CANDIDATE",
            timestamp=ts,
            proposition_class="COUPLING_PATTERN",
            ceu_refs=list(confirmed_domains.values()),
            structural_refs={
                "total_imports": total_imports,
                "cross_domain_imports": total_cross,
                "cross_domain_ratio": round(ratio, 4),
            },
            replay_corridor_refs=replay_refs,
            derivation_rationale=f"Cross-domain ratio computed from code graph: {total_cross}/{total_imports}.",
            reconciliation_state="ALIGNED",
        )
        propositions.append(prop)

        lineage.append(LineageEvent(
            event_id=_lineage_id(lineage_counter),
            proposition_id=prop_id,
            event_type="system_coupling_ratio_derivation",
            semantic_type="GROUNDING",
            derivation_class="COUPLING_PATTERN",
            evidence={
                "total_imports": total_imports,
                "cross_domain": total_cross,
                "ratio": round(ratio, 4),
            },
            learning_context=learning_ctx,
            timestamp=ts,
        ))

    return propositions, lineage


def derive_authority_topology(
    bundle: SPEInputBundle,
    prop_counter: list[int],
    lineage_counter: list[int],
    ts: str,
) -> tuple[list[SemanticProposition], list[LineageEvent]]:
    propositions = []
    lineage = []
    learning_ctx = _build_learning_context(bundle.learning_events, "AUTHORITY_TOPOLOGY")
    replay_refs = [rc.get("id", "") for rc in bundle.replay_corridors]
    evidence_obj_ids = [eo.get("id", "") for eo in bundle.evidence_objects
                        if eo.get("evidence_class") in ("CENTRALITY", "CODE_GRAPH")]

    specimen_id = bundle.spine_objects.get("specimen_id", "unknown")
    run_id = bundle.spine_objects.get("run_id", "unknown")

    for candidate in bundle.candidate_list:
        ceu_id = candidate.get("ceu_id", "")
        if ceu_id not in bundle.confirmed_ceus:
            continue

        metrics = candidate.get("structural_metrics", {})
        import_in = metrics.get("cross_domain_import_in", 0)
        inherits_in = metrics.get("inherits_in_degree", 0)

        if import_in == 0 and inherits_in == 0:
            continue

        authority = candidate.get("authority_pattern", {})
        pattern = authority.get("pattern", "IMPORT_DOMINANT")

        has_dual = (inherits_in > 0 and import_in > 0 and
                    (inherits_in >= 1.5 * import_in or import_in >= 1.5 * inherits_in))

        if pattern == "DUAL_AUTHORITY_CROSS_CUTTING" or has_dual:
            import_score = import_in
            inherit_score = inherits_in
            dominant = "inheritance" if inherit_score > import_score else "import"
            ratio = max(inherit_score, import_score) / max(min(inherit_score, import_score), 1)

            recon_ceu = bundle.confirmed_ceus.get(ceu_id, {})
            recon_state = "ALIGNED"
            rationale_suffix = ""
            if recon_ceu.get("last_action") in ("ceu_refine",):
                recon_state = "ALIGNED"
                rationale_suffix = " Authority pattern refined during reconciliation."

            prop_id = _prop_id(specimen_id, prop_counter)
            prop = SemanticProposition(
                id=prop_id,
                specimen_id=specimen_id,
                run_id=run_id,
                proposition=(
                    f"{ceu_id} exhibits dual structural authority: "
                    f"{dominant}-dominant ({inherit_score} inheritance, {import_score} import edges, "
                    f"{ratio:.1f}x ratio)"
                ),
                derivation_tier="DERIVED",
                confidence=0.0,
                authority_ceiling="L3",
                evidence_anchors=evidence_obj_ids[:],
                status="CANDIDATE",
                timestamp=ts,
                proposition_class="AUTHORITY_TOPOLOGY",
                ceu_refs=[ceu_id],
                structural_refs={
                    "import_authority": import_score,
                    "inheritance_authority": inherit_score,
                    "authority_ratio": round(ratio, 2),
                    "dominant_axis": dominant,
                    "authority_pattern": pattern,
                },
                replay_corridor_refs=replay_refs,
                derivation_rationale=(
                    f"Dual authority detected: {dominant} axis dominates at {ratio:.1f}x. "
                    f"Pattern: {pattern}.{rationale_suffix}"
                ),
                reconciliation_state=recon_state,
            )
            propositions.append(prop)

            lineage.append(LineageEvent(
                event_id=_lineage_id(lineage_counter),
                proposition_id=prop_id,
                event_type="authority_topology_derivation",
                semantic_type="GROUNDING" if not rationale_suffix else "REFINEMENT",
                derivation_class="AUTHORITY_TOPOLOGY",
                evidence={
                    "ceu_id": ceu_id,
                    "import_in": import_score,
                    "inherits_in": inherit_score,
                    "pattern": pattern,
                },
                learning_context=learning_ctx,
                timestamp=ts,
            ))

    return propositions, lineage


def derive_tier_grounding(
    bundle: SPEInputBundle,
    prop_counter: list[int],
    lineage_counter: list[int],
    ts: str,
) -> tuple[list[SemanticProposition], list[LineageEvent]]:
    propositions = []
    lineage = []
    learning_ctx = _build_learning_context(bundle.learning_events, "TIER_GROUNDING")
    replay_refs = [rc.get("id", "") for rc in bundle.replay_corridors]
    evidence_obj_ids = [eo.get("id", "") for eo in bundle.evidence_objects]

    specimen_id = bundle.spine_objects.get("specimen_id", "unknown")
    run_id = bundle.spine_objects.get("run_id", "unknown")

    recon_candidates = bundle.reconciliation_state.get("candidates", {})

    for ceu_id, ceu in bundle.confirmed_ceus.items():
        tier = ceu.get("tier", "UNKNOWN")
        domain = ceu.get("domain", "")
        evidence_count = ceu.get("evidence_count", 0)
        finding = ceu.get("reconciliation_finding", "ALIGNED")

        registry_entry = None
        for c in bundle.candidate_list:
            if c.get("ceu_id") == ceu_id:
                registry_entry = c
                break

        file_count = registry_entry.get("file_count", 0) if registry_entry else ceu.get("file_count", 0)
        metrics = registry_entry.get("structural_metrics", {}) if registry_entry else {}

        was_reclassified = ceu.get("last_action") in ("ceu_reclassify",)
        was_refined = ceu.get("last_action") in ("ceu_refine",)

        if was_reclassified:
            tier_label = f"{tier} (reclassified)"
            derivation_tier = "DERIVED"
            semantic_type = "REFINEMENT"
        elif was_refined:
            tier_label = f"{tier} (refined)"
            derivation_tier = "DERIVED"
            semantic_type = "REFINEMENT"
        else:
            tier_label = tier
            derivation_tier = "DIRECT_EVIDENCE"
            semantic_type = "GROUNDING"

        prop_id = _prop_id(specimen_id, prop_counter)
        prop = SemanticProposition(
            id=prop_id,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition=(
                f"{ceu_id} is structurally grounded as {tier_label}: "
                f"{file_count} files, {evidence_count} evidence anchors, "
                f"reconciliation {finding}"
            ),
            derivation_tier=derivation_tier,
            confidence=0.0,
            authority_ceiling="L3",
            evidence_anchors=evidence_obj_ids[:2],
            status="CANDIDATE",
            timestamp=ts,
            proposition_class="TIER_GROUNDING",
            ceu_refs=[ceu_id],
            structural_refs={
                "tier": tier,
                "file_count": file_count,
                "evidence_count": evidence_count,
                "reconciliation_finding": finding,
                "was_reclassified": was_reclassified,
                "was_refined": was_refined,
                **{k: v for k, v in metrics.items() if isinstance(v, (int, float))},
            },
            replay_corridor_refs=replay_refs,
            derivation_rationale=(
                f"Tier {tier} grounded by {evidence_count} evidence anchors and "
                f"{file_count} structural files. Finding: {finding}."
            ),
            reconciliation_state="ALIGNED" if finding == "ALIGNED" else "NOVEL",
        )
        propositions.append(prop)

        lineage.append(LineageEvent(
            event_id=_lineage_id(lineage_counter),
            proposition_id=prop_id,
            event_type="tier_grounding_derivation",
            semantic_type=semantic_type,
            derivation_class="TIER_GROUNDING",
            evidence={
                "ceu_id": ceu_id,
                "tier": tier,
                "file_count": file_count,
                "evidence_count": evidence_count,
                "finding": finding,
            },
            learning_context=learning_ctx,
            timestamp=ts,
        ))

    return propositions, lineage


def derive_hero_moment_grounding(
    bundle: SPEInputBundle,
    prop_counter: list[int],
    lineage_counter: list[int],
    ts: str,
) -> tuple[list[SemanticProposition], list[LineageEvent]]:
    propositions = []
    lineage = []
    learning_ctx = _build_learning_context(bundle.learning_events, "HERO_MOMENT_GROUNDING")
    replay_refs = [rc.get("id", "") for rc in bundle.replay_corridors]
    evidence_obj_ids = [eo.get("id", "") for eo in bundle.evidence_objects]

    specimen_id = bundle.spine_objects.get("specimen_id", "unknown")
    run_id = bundle.spine_objects.get("run_id", "unknown")

    confirmed_domains = {v.get("domain", ""): k for k, v in bundle.confirmed_ceus.items()}

    for hm in bundle.hero_moments:
        hm_id = hm.get("id", "")
        discovery = hm.get("discovery", "")
        surprise_class = hm.get("surprise_class", "UNKNOWN")
        hm_evidence = hm.get("evidence_anchors", [])

        related_ceus = []
        discovery_lower = discovery.lower()
        for domain, ceu_id in confirmed_domains.items():
            if domain.lower() in discovery_lower or ceu_id.lower() in discovery_lower:
                related_ceus.append(ceu_id)

        if not related_ceus:
            related_ceus = list(confirmed_domains.values())[:2]

        prop_id = _prop_id(specimen_id, prop_counter)
        prop = SemanticProposition(
            id=prop_id,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition=f"Structural surprise ({surprise_class}): {discovery[:200]}",
            derivation_tier="DERIVED",
            confidence=0.0,
            authority_ceiling="L3",
            evidence_anchors=hm_evidence or evidence_obj_ids[:2],
            status="CANDIDATE",
            timestamp=ts,
            proposition_class="HERO_MOMENT_GROUNDING",
            ceu_refs=related_ceus,
            structural_refs={
                "surprise_class": surprise_class,
                "hero_moment_id": hm_id,
            },
            hero_moment_refs=[hm_id],
            replay_corridor_refs=replay_refs,
            derivation_rationale=f"Semantic grounding of hero moment ({surprise_class}). Cross-referenced with CEU evidence.",
            reconciliation_state="NOVEL",
        )
        propositions.append(prop)

        lineage.append(LineageEvent(
            event_id=_lineage_id(lineage_counter),
            proposition_id=prop_id,
            event_type="hero_moment_grounding_derivation",
            semantic_type="GROUNDING",
            derivation_class="HERO_MOMENT_GROUNDING",
            evidence={
                "hero_moment_id": hm_id,
                "surprise_class": surprise_class,
                "related_ceus": related_ceus,
            },
            learning_context=learning_ctx,
            timestamp=ts,
        ))

    return propositions, lineage


def derive_cluster_architecture(
    bundle: SPEInputBundle,
    prop_counter: list[int],
    lineage_counter: list[int],
    ts: str,
) -> tuple[list[SemanticProposition], list[LineageEvent]]:
    propositions = []
    lineage = []
    learning_ctx = _build_learning_context(bundle.learning_events, "CLUSTER_ARCHITECTURE")
    replay_refs = [rc.get("id", "") for rc in bundle.replay_corridors]
    evidence_obj_ids = [eo.get("id", "") for eo in bundle.evidence_objects
                        if eo.get("evidence_class") == "STRUCTURAL"]

    specimen_id = bundle.spine_objects.get("specimen_id", "unknown")
    run_id = bundle.spine_objects.get("run_id", "unknown")

    confirmed_domains = {v.get("domain", ""): k for k, v in bundle.confirmed_ceus.items()}

    node_id_to_path = {}
    for entry in bundle.centrality_ranking:
        nid = entry.get("node_id", "")
        path = entry.get("path", "")
        if nid and path:
            node_id_to_path[nid] = path

    for cluster in bundle.topology_clusters:
        cluster_id = cluster.get("cluster_id", cluster.get("id", ""))
        raw_nodes = cluster.get("nodes", cluster.get("members", cluster.get("node_ids", [])))
        node_count = cluster.get("node_count", len(raw_nodes) if isinstance(raw_nodes, list) else 0)

        if node_count < 3:
            continue

        ceu_distribution = defaultdict(int)
        if isinstance(raw_nodes, list):
            for node in raw_nodes:
                if isinstance(node, str):
                    path = node_id_to_path.get(node, node) if node.startswith("NODE-") else node
                else:
                    path = node.get("path", "")
                parts = path.split("/")
                if len(parts) >= 2:
                    domain = parts[1] if parts[0] == "netbox" else parts[0]
                    if domain in confirmed_domains:
                        ceu_distribution[confirmed_domains[domain]] += 1

        distinct_ceus = len(ceu_distribution)
        dominant_ceu = max(ceu_distribution, key=ceu_distribution.get) if ceu_distribution else None
        dominant_share = ceu_distribution[dominant_ceu] / node_count if dominant_ceu and node_count > 0 else 0

        if distinct_ceus <= 1 and dominant_share > 0.9:
            kind = "aligned"
            text = (
                f"Cluster {cluster_id} is {dominant_ceu}-aligned: "
                f"{node_count} nodes, {dominant_share:.0%} from single CEU"
            )
        elif distinct_ceus >= 3:
            kind = "cross-cutting"
            text = (
                f"Cluster {cluster_id} is cross-cutting: "
                f"{node_count} nodes spanning {distinct_ceus} CEUs"
            )
        else:
            kind = "mixed"
            text = (
                f"Cluster {cluster_id} spans {distinct_ceus} CEUs: "
                f"{node_count} nodes, dominant {dominant_ceu} at {dominant_share:.0%}"
            )

        prop_id = _prop_id(specimen_id, prop_counter)
        prop = SemanticProposition(
            id=prop_id,
            specimen_id=specimen_id,
            run_id=run_id,
            proposition=text,
            derivation_tier="DERIVED",
            confidence=0.0,
            authority_ceiling="L3",
            evidence_anchors=evidence_obj_ids[:2],
            status="CANDIDATE",
            timestamp=ts,
            proposition_class="CLUSTER_ARCHITECTURE",
            ceu_refs=list(ceu_distribution.keys()) or ([dominant_ceu] if dominant_ceu else []),
            structural_refs={
                "cluster_id": cluster_id,
                "node_count": node_count,
                "ceu_distribution": dict(ceu_distribution),
                "distinct_ceu_count": distinct_ceus,
                "cluster_kind": kind,
                "dominant_ceu": dominant_ceu,
                "dominant_share": round(dominant_share, 3) if dominant_share else 0,
            },
            replay_corridor_refs=replay_refs,
            derivation_rationale=f"Cluster {cluster_id}: {kind} with {distinct_ceus} CEUs and {node_count} nodes.",
            reconciliation_state="NOVEL",
        )
        propositions.append(prop)

        lineage.append(LineageEvent(
            event_id=_lineage_id(lineage_counter),
            proposition_id=prop_id,
            event_type="cluster_architecture_derivation",
            semantic_type="GROUNDING" if kind == "aligned" else "RELATIONSHIP",
            derivation_class="CLUSTER_ARCHITECTURE",
            evidence={
                "cluster_id": cluster_id,
                "node_count": node_count,
                "ceu_distribution": dict(ceu_distribution),
                "kind": kind,
            },
            learning_context=learning_ctx,
            timestamp=ts,
        ))

    return propositions, lineage


def derive_all(bundle: SPEInputBundle) -> DerivationResult:
    ts = _ts()
    prop_counter = [0]
    lineage_counter = [0]
    all_props = []
    all_lineage = []

    derivers = [
        derive_structural_dominance,
        derive_coupling_patterns,
        derive_authority_topology,
        derive_tier_grounding,
        derive_hero_moment_grounding,
        derive_cluster_architecture,
    ]

    for deriver in derivers:
        props, events = deriver(bundle, prop_counter, lineage_counter, ts)
        all_props.extend(props)
        all_lineage.extend(events)

    hash_dicts = []
    for p in sorted(all_props, key=lambda x: x.id):
        d = p.to_dict()
        d.pop("timestamp", None)
        d.pop("confidence", None)
        hash_dicts.append(d)
    derivation_hash = hashlib.sha256(
        str(hash_dicts).encode("utf-8")
    ).hexdigest()

    return DerivationResult(
        propositions=all_props,
        lineage_events=all_lineage,
        learning_events=[],
        derivation_hash=derivation_hash,
        input_hash=bundle.input_hash,
        specimen_id=bundle.spine_objects.get("specimen_id", "unknown"),
        run_id=bundle.spine_objects.get("run_id", "unknown"),
    )
