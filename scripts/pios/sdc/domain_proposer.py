"""
Semantic Derivation Compiler — Domain Proposer (P2-P4)
Component extraction + capability grouping + domain classification.

Three tiers:
  Tier 1 (deterministic): Pattern-match explicit module listings → DIRECT_EVIDENCE
  Tier 2 (deterministic): Extract technology stack declarations → DERIVED
  Tier 3 (AI-assisted):   Structured LLM call for grouping/classification → INFERRED

Four signals for capability grouping:
  Signal 1: Explicit document groupings (section headings) → DIRECT_EVIDENCE
  Signal 2: Naming pattern analysis (shared roots) → DERIVED
  Signal 3: PATH A structural adjacency → DERIVED
  Signal 4: AI-proposed groupings → INFERRED
"""

import json
import re
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional

from .evidence_parser import (
    EvidenceDocument, GroupBlock, ModuleCard, FrontendPage, ParseResult,
)
from .llm_adapter import call_llm, LLMProviderUnavailable


# ---------------------------------------------------------------------------
# Intermediate structures
# ---------------------------------------------------------------------------

@dataclass
class ProposedComponent:
    component_id: str
    name: str
    description: str
    confidence: str  # DIRECT_EVIDENCE | DERIVED | INFERRED
    evidence_refs: list[dict] = field(default_factory=list)
    capability_id: str = ""
    domain_id: str = ""
    source_tier: int = 0
    cross_domain: bool = False

@dataclass
class ProposedCapability:
    capability_id: str
    name: str
    domain_id: str
    cap_type: str  # CORE | SUPPORTING | ENABLING | INFRASTRUCTURE
    confidence: str
    evidence_refs: list[dict] = field(default_factory=list)
    components: list[str] = field(default_factory=list)
    grouping_signal: int = 0

@dataclass
class ProposedDomain:
    domain_id: str
    name: str
    domain_type: str  # FUNCTIONAL | INFRASTRUCTURE | OPERATIONAL | CROSS-CUTTING | INTEGRATION
    confidence: str
    evidence_refs: list[dict] = field(default_factory=list)
    description: str = ""
    capabilities: list[str] = field(default_factory=list)

@dataclass
class ProposalResult:
    domains: list[ProposedDomain] = field(default_factory=list)
    capabilities: list[ProposedCapability] = field(default_factory=list)
    components: list[ProposedComponent] = field(default_factory=list)
    ai_phase_completed: bool = False
    ai_provider_error: Optional[str] = None
    derivation_log: list[dict] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)


# ---------------------------------------------------------------------------
# Evidence reference builder
# ---------------------------------------------------------------------------

def _evidence_ref(source_file: str, section_id: str, excerpt: str,
                  method: str) -> dict:
    return {
        "source_file": source_file,
        "section_id": section_id,
        "excerpt": excerpt[:200],
        "extraction_method": method,
    }


# ---------------------------------------------------------------------------
# Tier 1: Pattern-match explicit module listings (DIRECT_EVIDENCE)
# ---------------------------------------------------------------------------

def _tier1_extract_components(
    parse_result: ParseResult,
) -> list[ProposedComponent]:
    """Extract components from explicitly listed module cards in evidence."""
    components = []
    comp_idx = 0

    for doc in parse_result.documents:
        for card in doc.module_cards:
            comp_idx += 1
            comp_id = f"COMP-{comp_idx:03d}"
            components.append(ProposedComponent(
                component_id=comp_id,
                name=card.name,
                description=card.description,
                confidence="DIRECT_EVIDENCE",
                evidence_refs=[_evidence_ref(
                    card.source_file, card.section_id,
                    f"{card.name}: {card.description}",
                    "tier1_module_card_extraction"
                )],
                source_tier=1,
            ))

    return components


def _tier1_extract_layer_components(
    parse_result: ParseResult,
    existing_names: set[str],
    start_idx: int,
) -> list[ProposedComponent]:
    """Extract components from architecture layer descriptions (s1, s2, etc.)
    that aren't already captured in s4 module cards."""
    components = []
    comp_idx = start_idx

    for doc in parse_result.documents:
        # all_module_cards includes cards from all sections (s1, s2, etc.)
        for card in doc.all_module_cards:
            if card.section_id == "s4":
                continue
            norm = card.name.lower().strip()
            if norm in existing_names:
                continue
            existing_names.add(norm)
            comp_idx += 1
            comp_id = f"COMP-{comp_idx:03d}"
            components.append(ProposedComponent(
                component_id=comp_id,
                name=card.name,
                description=card.description,
                confidence="DIRECT_EVIDENCE",
                evidence_refs=[_evidence_ref(
                    card.source_file, card.section_id,
                    f"Layer component: {card.name}: {card.description}",
                    "tier1_layer_component_extraction"
                )],
                source_tier=1,
            ))

    return components


def _tier1_extract_frontend_components(
    parse_result: ParseResult,
    start_idx: int,
) -> list[ProposedComponent]:
    """Extract frontend page components."""
    components = []
    comp_idx = start_idx

    for doc in parse_result.documents:
        for page in doc.frontend_pages:
            comp_idx += 1
            comp_id = f"COMP-{comp_idx:03d}"
            components.append(ProposedComponent(
                component_id=comp_id,
                name=page.name,
                description=f"Frontend page: {page.route}" + (
                    f" — {page.description}" if page.description else ""
                ),
                confidence="DIRECT_EVIDENCE",
                evidence_refs=[_evidence_ref(
                    page.source_file, page.section_id,
                    f"{page.route} — {page.name}",
                    "tier1_frontend_page_extraction"
                )],
                source_tier=1,
            ))

    return components


# ---------------------------------------------------------------------------
# Tier 2: Technology stack declarations (DERIVED)
# ---------------------------------------------------------------------------

def _tier2_extract_technology_components(
    parse_result: ParseResult,
    start_idx: int,
) -> list[ProposedComponent]:
    """Extract technology stack components from layer descriptions and stats."""
    components = []
    comp_idx = start_idx
    seen_names = set()

    for doc in parse_result.documents:
        for layer in doc.layers:
            techs = _extract_tech_from_text(
                layer.layer_name + " " + layer.layer_description
            )
            for tech_name, tech_desc in techs:
                if tech_name.lower() in seen_names:
                    continue
                seen_names.add(tech_name.lower())
                comp_idx += 1
                components.append(ProposedComponent(
                    component_id=f"COMP-{comp_idx:03d}",
                    name=tech_name,
                    description=tech_desc,
                    confidence="DERIVED",
                    evidence_refs=[_evidence_ref(
                        doc.file_path, layer.section_id,
                        f"Layer: {layer.layer_label} — {layer.layer_name}",
                        "tier2_technology_stack_extraction"
                    )],
                    source_tier=2,
                ))

    return components


_TECH_PATTERNS = [
    (r'\bApache Kafka\b', "Apache Kafka", "Distributed event streaming platform"),
    (r'\bApache Flink\b', "Apache Flink", "Stream processing framework"),
    (r'\bPostgreSQL\s*\d*\b', "PostgreSQL", "Relational database"),
    (r'\bTimescaleDB\b', "TimescaleDB", "Time-series database extension"),
    (r'\bRedis\s*\d*\b', "Redis", "In-memory cache and pub/sub"),
    (r'\bS3\b.*?\bMinIO\b|MinIO|S3', "S3/MinIO", "Object storage"),
    (r'\bHyperledger\s+Fabric\b', "Hyperledger Fabric", "Permissioned blockchain"),
    (r'\bEthereum\b', "Ethereum L2", "Smart contract platform"),
    (r'\bTensorFlow\b', "TensorFlow", "ML inference serving"),
    (r'\bKubeflow\b', "Kubeflow", "ML workflow orchestration"),
    (r'\bEMQX\b', "EMQX", "MQTT broker"),
]


def _extract_tech_from_text(text: str) -> list[tuple[str, str]]:
    results = []
    for pattern, name, desc in _TECH_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            results.append((name, desc))
    return results


# ---------------------------------------------------------------------------
# Signal 1: Explicit document groupings → capabilities (DIRECT_EVIDENCE)
# ---------------------------------------------------------------------------

def _signal1_group_to_capabilities(
    parse_result: ParseResult,
    components: list[ProposedComponent],
) -> list[ProposedCapability]:
    """Map document group headings to capabilities."""
    capabilities = []
    comp_name_to_id = {c.name: c.component_id for c in components}
    cap_idx = 0

    for doc in parse_result.documents:
        for group in doc.groups:
            cap_idx += 1
            cap_id = f"CAP-{cap_idx:03d}"

            member_ids = []
            for mc in group.modules:
                cid = comp_name_to_id.get(mc.name)
                if cid:
                    member_ids.append(cid)
                    for c in components:
                        if c.component_id == cid:
                            c.capability_id = cap_id

            capabilities.append(ProposedCapability(
                capability_id=cap_id,
                name=group.name,
                domain_id="",
                cap_type=_infer_cap_type_from_badge(group),
                confidence="DIRECT_EVIDENCE",
                evidence_refs=[_evidence_ref(
                    doc.file_path, group.section_id,
                    f"Group: {group.name} ({group.count_declared})",
                    "signal1_document_group"
                )],
                components=member_ids,
                grouping_signal=1,
            ))

    return capabilities


def _infer_cap_type_from_badge(group: GroupBlock) -> str:
    badges = {m.badge.upper() for m in group.modules if m.badge}
    if "INFRA" in badges or "INFRASTRUCTURE" in badges:
        return "INFRASTRUCTURE"
    if badges & {"AI", "ML"}:
        return "ENABLING"
    if badges & {"VERT", "VERTICAL"}:
        return "SUPPORTING"
    return "CORE"


# ---------------------------------------------------------------------------
# Signal 1b: Layer-based capability grouping for non-s4 components
# ---------------------------------------------------------------------------

_LAYER_LABEL_TO_CAPABILITY = {
    "Layer 1": "Vehicle Sensor Collection",
    "Layer 2": "SVG Device Hardware Platform",
    "Layer 3": "Stream Processing Infrastructure",
    "Layer 5": "Data Persistence Layer",
}


def _signal1_layer_to_capabilities(
    parse_result: ParseResult,
    layer_components: list[ProposedComponent],
    existing_capabilities: list[ProposedCapability],
) -> list[ProposedCapability]:
    """Group layer-extracted components into capabilities by their layer origin."""
    if not layer_components:
        return []

    # Build map: component name → source layer
    comp_to_layer: dict[str, str] = {}
    for doc in parse_result.documents:
        for layer in doc.layers:
            for mod in layer.modules:
                from .evidence_parser import _strip_emoji
                clean_name = _strip_emoji(mod.name)
                comp_to_layer[clean_name.lower().strip()] = layer.layer_label

    # Group layer components by layer
    layer_groups: dict[str, list[ProposedComponent]] = {}
    for comp in layer_components:
        layer_label = comp_to_layer.get(comp.name.lower().strip(), "")
        matched_layer = ""
        for key in _LAYER_LABEL_TO_CAPABILITY:
            if key.lower() in layer_label.lower():
                matched_layer = key
                break
        if not matched_layer:
            matched_layer = layer_label[:30] if layer_label else "Unknown Layer"
        layer_groups.setdefault(matched_layer, []).append(comp)

    new_caps = []
    cap_idx = len(existing_capabilities)

    for layer_key, members in layer_groups.items():
        if not members:
            continue
        cap_idx += 1
        cap_id = f"CAP-{cap_idx:03d}"
        cap_name = _LAYER_LABEL_TO_CAPABILITY.get(layer_key, f"Layer: {layer_key}")

        member_ids = [c.component_id for c in members]
        for c in members:
            c.capability_id = cap_id

        new_caps.append(ProposedCapability(
            capability_id=cap_id,
            name=cap_name,
            domain_id="",
            cap_type="INFRASTRUCTURE" if "Infrastructure" in cap_name else "CORE",
            confidence="DIRECT_EVIDENCE",
            evidence_refs=[_evidence_ref(
                members[0].evidence_refs[0]["source_file"] if members[0].evidence_refs else "",
                members[0].evidence_refs[0].get("section_id", "") if members[0].evidence_refs else "",
                f"Architecture layer: {layer_key} — {', '.join(c.name for c in members[:5])}",
                "signal1_layer_grouping"
            )],
            components=member_ids,
            grouping_signal=1,
        ))

    return new_caps


# ---------------------------------------------------------------------------
# Signal 2: Naming pattern analysis (DERIVED)
# ---------------------------------------------------------------------------

_NAME_ROOTS = {
    "Ev": "EV & Energy",
    "V2g": "EV & Energy",
    "Charging": "EV & Energy",
    "Electrification": "EV & Energy",
    "Driver": "Driver Services",
    "Fleet": "Fleet Operations",
    "Vehicle": "Fleet Operations",
    "Hasi": "Security",
    "Auth": "Access Control",
    "Blockchain": "Blockchain",
    "DataMonetization": "Blockchain",
    "Tanker": "Vertical Extensions",
    "Bus": "Vertical Extensions",
    "Taxi": "Vertical Extensions",
    "Coldchain": "Vertical Extensions",
    "Surge": "Vertical Extensions",
}


def _signal2_naming_patterns(
    components: list[ProposedComponent],
    capabilities: list[ProposedCapability],
) -> list[ProposedCapability]:
    """Group ungrouped components by naming root patterns."""
    grouped_comp_ids = set()
    for cap in capabilities:
        grouped_comp_ids.update(cap.components)

    ungrouped = [c for c in components if c.component_id not in grouped_comp_ids
                 and c.source_tier == 1]

    pattern_groups: dict[str, list[ProposedComponent]] = {}
    for comp in ungrouped:
        matched = False
        for root, group_name in _NAME_ROOTS.items():
            if comp.name.startswith(root) or root.lower() in comp.name.lower():
                pattern_groups.setdefault(group_name, []).append(comp)
                matched = True
                break
        if not matched:
            pattern_groups.setdefault("_ungrouped", []).append(comp)

    new_caps = []
    cap_idx = len(capabilities)
    for group_name, members in pattern_groups.items():
        if group_name == "_ungrouped" or len(members) < 2:
            continue
        cap_idx += 1
        cap_id = f"CAP-{cap_idx:03d}"
        member_ids = [c.component_id for c in members]
        for c in members:
            c.capability_id = cap_id
            if c.confidence == "DIRECT_EVIDENCE":
                c.confidence = "DIRECT_EVIDENCE"

        new_caps.append(ProposedCapability(
            capability_id=cap_id,
            name=group_name,
            domain_id="",
            cap_type="CORE",
            confidence="DERIVED",
            evidence_refs=[_evidence_ref(
                members[0].evidence_refs[0]["source_file"] if members[0].evidence_refs else "",
                "",
                f"Naming pattern: {', '.join(c.name for c in members[:5])}",
                "signal2_naming_pattern"
            )],
            components=member_ids,
            grouping_signal=2,
        ))

    return new_caps


# ---------------------------------------------------------------------------
# Signal 3: PATH A structural adjacency (DERIVED)
# ---------------------------------------------------------------------------

def _signal3_structural_adjacency(
    components: list[ProposedComponent],
    capabilities: list[ProposedCapability],
    canonical_topology: Optional[dict],
) -> list[ProposedCapability]:
    """Use PATH A DOM cluster co-occurrence for ungrouped components."""
    if not canonical_topology:
        return []

    grouped_comp_ids = set()
    for cap in capabilities:
        grouped_comp_ids.update(cap.components)

    ungrouped = [c for c in components if c.component_id not in grouped_comp_ids
                 and c.source_tier == 1]
    if not ungrouped:
        return []

    dom_nodes = canonical_topology.get("nodes", [])
    dom_clusters: dict[str, list[str]] = {}
    for node in dom_nodes:
        cluster = node.get("cluster", "unknown")
        dom_clusters.setdefault(cluster, []).append(node.get("label", ""))

    new_caps = []
    cap_idx = len(capabilities)
    ungrouped_names = {c.name.lower().replace("module", "").strip() for c in ungrouped}

    for cluster_id, labels in dom_clusters.items():
        cluster_labels = {l.lower().replace("module", "").strip() for l in labels}
        matched = []
        for comp in ungrouped:
            comp_key = comp.name.lower().replace("module", "").strip()
            if comp_key in cluster_labels:
                matched.append(comp)

        if len(matched) >= 2:
            cap_idx += 1
            cap_id = f"CAP-{cap_idx:03d}"
            member_ids = [c.component_id for c in matched]
            for c in matched:
                c.capability_id = cap_id

            new_caps.append(ProposedCapability(
                capability_id=cap_id,
                name=f"Cluster {cluster_id}",
                domain_id="",
                cap_type="CORE",
                confidence="DERIVED",
                evidence_refs=[_evidence_ref(
                    "", "", f"PATH A cluster {cluster_id}: {', '.join(labels[:5])}",
                    "signal3_structural_adjacency"
                )],
                components=member_ids,
                grouping_signal=3,
            ))

    return new_caps


# ---------------------------------------------------------------------------
# Domain classification — deterministic signals first, AI for coherence
# ---------------------------------------------------------------------------

_BADGE_TO_DOMAIN_TYPE = {
    "CORE": "FUNCTIONAL",
    "VERT": "FUNCTIONAL",
    "VERTICAL": "FUNCTIONAL",
    "AI": "FUNCTIONAL",
    "BC": "FUNCTIONAL",
    "SAAS": "OPERATIONAL",
    "INFRA": "INFRASTRUCTURE",
    "SEC": "CROSS-CUTTING",
    "SECURITY": "CROSS-CUTTING",
    "NEW": "FUNCTIONAL",
    "V22": "FUNCTIONAL",
}

_GROUP_NAME_TO_DOMAIN = {
    "Core Fleet Management": ("Fleet Core Operations", "FUNCTIONAL"),
    "Fleet Verticals": ("Fleet Vertical Extensions", "FUNCTIONAL"),
    "SVG Hardware & Security": ("Sensor and Security Ingestion", "FUNCTIONAL"),
    "AI / Machine Learning": ("AI/ML Intelligence Layer", "FUNCTIONAL"),
    "Blockchain & Data": ("Blockchain and Data Provenance", "FUNCTIONAL"),
    "Operations & Compliance": ("Operational Engineering", "FUNCTIONAL"),
    "EV & Energy": ("EV and Electrification", "FUNCTIONAL"),
    "SaaS & Multi-Tenant": ("SaaS Platform Layer", "OPERATIONAL"),
    "Integration & Ecosystem": ("External Integration", "INTEGRATION"),
    "People & Access": ("Access Control and Identity", "CROSS-CUTTING"),
    "Lifecycle & Market": ("Extended Operations and Driver Services", "FUNCTIONAL"),
    "Infrastructure & Shared": ("Platform Infrastructure and Data", "INFRASTRUCTURE"),
    "Cold Chain & V2G": ("Specialized Vertical Operations", "FUNCTIONAL"),
    # Layer-derived capabilities
    "Vehicle Sensor Collection": ("Edge Data Acquisition", "FUNCTIONAL"),
    "SVG Device Hardware Platform": ("Edge Data Acquisition", "FUNCTIONAL"),
    "Stream Processing Infrastructure": ("Telemetry Transport and Messaging", "INFRASTRUCTURE"),
    "Data Persistence Layer": ("Platform Infrastructure and Data", "INFRASTRUCTURE"),
}


def _classify_domains_deterministic(
    capabilities: list[ProposedCapability],
    groups: list[GroupBlock],
) -> list[ProposedDomain]:
    """Signal 1: Map document section structure to domains.
    Multiple capabilities can map to the same domain — they get merged."""
    domain_by_name: dict[str, ProposedDomain] = {}
    domain_idx = 0
    cap_by_group: dict[str, list[ProposedCapability]] = {}

    for cap in capabilities:
        if cap.grouping_signal == 1:
            cap_by_group.setdefault(cap.name, []).append(cap)

    for group_name, (domain_name, domain_type) in _GROUP_NAME_TO_DOMAIN.items():
        caps = cap_by_group.get(group_name, [])
        if not caps:
            continue

        if domain_name in domain_by_name:
            existing = domain_by_name[domain_name]
            for cap in caps:
                cap.domain_id = existing.domain_id
            existing.capabilities.extend(c.capability_id for c in caps)
        else:
            domain_idx += 1
            domain_id = f"DOMAIN-{domain_idx:02d}"

            for cap in caps:
                cap.domain_id = domain_id

            domain_by_name[domain_name] = ProposedDomain(
                domain_id=domain_id,
                name=domain_name,
                domain_type=domain_type,
                confidence="DIRECT_EVIDENCE",
                evidence_refs=[_evidence_ref(
                    caps[0].evidence_refs[0]["source_file"] if caps[0].evidence_refs else "",
                    "",
                    f"Section group: {group_name} → {domain_name}",
                    "signal1_section_structure"
                )],
                capabilities=[c.capability_id for c in caps],
            )

    return list(domain_by_name.values())


# ---------------------------------------------------------------------------
# AI-assisted domain classification (Signal 4 — INFERRED)
# ---------------------------------------------------------------------------

_DOMAIN_PROPOSAL_SYSTEM = """You are a semantic domain classifier for enterprise software platforms.
Given a list of software capabilities with their components, propose domain groupings.

Rules:
1. Each domain groups related capabilities by business function
2. Domain types: FUNCTIONAL, INFRASTRUCTURE, OPERATIONAL, CROSS-CUTTING, INTEGRATION
3. Every capability must belong to exactly one domain
4. Prefer fewer, coherent domains over many fragmented ones
5. Output valid JSON only — no markdown, no explanation

Output format:
{
  "domains": [
    {
      "name": "Domain Name",
      "type": "FUNCTIONAL",
      "description": "One-line description",
      "capability_ids": ["CAP-001", "CAP-002"],
      "rationale": "Why these capabilities form a coherent domain"
    }
  ]
}"""


def _classify_domains_ai(
    capabilities: list[ProposedCapability],
    components: list[ProposedComponent],
    existing_domains: list[ProposedDomain],
) -> tuple[list[ProposedDomain], bool, Optional[str]]:
    """Signal 2 (AI): Classify unassigned capabilities into domains."""
    assigned_cap_ids = set()
    for d in existing_domains:
        assigned_cap_ids.update(d.capabilities)

    unassigned = [c for c in capabilities if c.capability_id not in assigned_cap_ids]
    if not unassigned:
        return [], True, None

    cap_descriptions = []
    comp_by_cap = {}
    for comp in components:
        comp_by_cap.setdefault(comp.capability_id, []).append(comp)

    for cap in unassigned:
        members = comp_by_cap.get(cap.capability_id, [])
        member_str = ", ".join(m.name for m in members[:10])
        cap_descriptions.append(
            f"- {cap.capability_id}: {cap.name} (components: {member_str})"
        )

    if not cap_descriptions:
        return [], True, None

    user_prompt = (
        "Classify these capabilities into domains:\n\n"
        + "\n".join(cap_descriptions)
        + "\n\nExisting domains (already assigned, do not reassign):\n"
        + "\n".join(f"- {d.domain_id}: {d.name}" for d in existing_domains)
        + "\n\nPropose domains for the unassigned capabilities above."
    )

    try:
        response = call_llm(
            system_prompt=_DOMAIN_PROPOSAL_SYSTEM,
            user_prompt=user_prompt,
            temperature=0.0,
        )
        result = response.parse_json()
    except LLMProviderUnavailable as e:
        return [], False, str(e)
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        return [], False, f"LLM response parse error: {e}"

    new_domains = []
    domain_idx = len(existing_domains)
    unassigned_ids = {c.capability_id for c in unassigned}

    for d in result.get("domains", []):
        domain_idx += 1
        domain_id = f"DOMAIN-{domain_idx:02d}"
        cap_ids = [cid for cid in d.get("capability_ids", []) if cid in unassigned_ids]

        if not cap_ids:
            continue

        for cap in capabilities:
            if cap.capability_id in cap_ids:
                cap.domain_id = domain_id

        new_domains.append(ProposedDomain(
            domain_id=domain_id,
            name=d.get("name", f"Domain {domain_idx}"),
            domain_type=d.get("type", "FUNCTIONAL"),
            confidence="INFERRED",
            description=d.get("description", ""),
            evidence_refs=[_evidence_ref(
                "", "",
                f"AI-proposed: {d.get('rationale', 'no rationale')[:200]}",
                "signal4_ai_domain_classification"
            )],
            capabilities=cap_ids,
        ))

    return new_domains, True, None


# ---------------------------------------------------------------------------
# Frontend domain assignment
# ---------------------------------------------------------------------------

def _assign_frontend_domain(
    frontend_components: list[ProposedComponent],
    capabilities: list[ProposedCapability],
    domains: list[ProposedDomain],
) -> tuple[Optional[ProposedDomain], Optional[ProposedCapability]]:
    """Create a Frontend Application domain for frontend page components."""
    if not frontend_components:
        return None, None

    domain_idx = len(domains) + 1
    domain_id = f"DOMAIN-{domain_idx:02d}"
    cap_id = f"CAP-{len(capabilities) + 1:03d}"

    for comp in frontend_components:
        comp.capability_id = cap_id
        comp.domain_id = domain_id

    cap = ProposedCapability(
        capability_id=cap_id,
        name="Frontend Application Pages",
        domain_id=domain_id,
        cap_type="CORE",
        confidence="DIRECT_EVIDENCE",
        evidence_refs=[_evidence_ref(
            frontend_components[0].evidence_refs[0]["source_file"]
            if frontend_components[0].evidence_refs else "",
            "s13",
            f"{len(frontend_components)} frontend pages extracted",
            "tier1_frontend_page_grouping"
        )],
        components=[c.component_id for c in frontend_components],
        grouping_signal=1,
    )

    domain = ProposedDomain(
        domain_id=domain_id,
        name="Frontend Application",
        domain_type="FUNCTIONAL",
        confidence="DIRECT_EVIDENCE",
        evidence_refs=[_evidence_ref(
            "", "s13",
            f"Section 13: All 61 Pages — explicit frontend listing",
            "signal1_section_structure"
        )],
        capabilities=[cap_id],
    )

    return domain, cap


# ---------------------------------------------------------------------------
# Infrastructure domain for Tier 2 tech components
# ---------------------------------------------------------------------------

def _assign_tech_infrastructure(
    tech_components: list[ProposedComponent],
    capabilities: list[ProposedCapability],
    domains: list[ProposedDomain],
) -> tuple[list[ProposedDomain], list[ProposedCapability]]:
    """Group technology stack components into infrastructure domains."""
    if not tech_components:
        return [], []

    new_domains = []
    new_caps = []

    # Group tech components by rough category
    streaming = []
    storage = []
    other = []

    for comp in tech_components:
        name_lower = comp.name.lower()
        if any(k in name_lower for k in ["kafka", "flink", "emqx", "mqtt"]):
            streaming.append(comp)
        elif any(k in name_lower for k in ["postgres", "timescale", "redis", "s3", "minio"]):
            storage.append(comp)
        else:
            other.append(comp)

    groups = [
        ("Streaming and Messaging Infrastructure", "INFRASTRUCTURE", streaming),
        ("Data Storage Infrastructure", "INFRASTRUCTURE", storage),
        ("Platform Technology Services", "INFRASTRUCTURE", other),
    ]

    for group_name, dtype, members in groups:
        if not members:
            continue

        domain_idx = len(domains) + len(new_domains) + 1
        domain_id = f"DOMAIN-{domain_idx:02d}"
        cap_idx = len(capabilities) + len(new_caps) + 1
        cap_id = f"CAP-{cap_idx:03d}"

        for comp in members:
            comp.capability_id = cap_id
            comp.domain_id = domain_id

        cap = ProposedCapability(
            capability_id=cap_id,
            name=group_name,
            domain_id=domain_id,
            cap_type="INFRASTRUCTURE",
            confidence="DERIVED",
            evidence_refs=[_evidence_ref(
                "", "",
                f"Tech stack: {', '.join(c.name for c in members)}",
                "tier2_technology_grouping"
            )],
            components=[c.component_id for c in members],
            grouping_signal=2,
        )

        domain = ProposedDomain(
            domain_id=domain_id,
            name=group_name,
            domain_type=dtype,
            confidence="DERIVED",
            evidence_refs=[_evidence_ref(
                "", "",
                f"Technology stack declarations in layer descriptions",
                "tier2_technology_domain"
            )],
            capabilities=[cap_id],
        )

        new_caps.append(cap)
        new_domains.append(domain)

    return new_domains, new_caps


# ---------------------------------------------------------------------------
# Propagate domain_id from capabilities down to components
# ---------------------------------------------------------------------------

def _propagate_domain_to_components(
    components: list[ProposedComponent],
    capabilities: list[ProposedCapability],
):
    """Set domain_id on components from their capability's domain assignment."""
    cap_to_domain = {cap.capability_id: cap.domain_id for cap in capabilities}
    for comp in components:
        if not comp.domain_id and comp.capability_id:
            comp.domain_id = cap_to_domain.get(comp.capability_id, "")


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def propose_domains(
    parse_result: ParseResult,
    canonical_topology: Optional[dict] = None,
    enable_ai: bool = False,
) -> ProposalResult:
    """
    Full domain proposal pipeline: Tier 1 → Tier 2 → Signal 1-3 → (AI Signal 4).
    """
    result = ProposalResult()

    # --- Tier 1: Explicit module listings ---
    backend_components = _tier1_extract_components(parse_result)
    result.derivation_log.append({
        "phase": "tier1_backend", "components_extracted": len(backend_components)
    })

    # Tier 1b: Layer-level components (hardware, firmware from s1/s2 not in s4)
    existing_names = {c.name.lower().strip() for c in backend_components}
    layer_components = _tier1_extract_layer_components(
        parse_result, existing_names, start_idx=len(backend_components)
    )
    result.derivation_log.append({
        "phase": "tier1_layers", "components_extracted": len(layer_components)
    })

    frontend_components = _tier1_extract_frontend_components(
        parse_result, start_idx=len(backend_components) + len(layer_components)
    )
    result.derivation_log.append({
        "phase": "tier1_frontend", "components_extracted": len(frontend_components)
    })

    # --- Tier 2: Technology stack ---
    tech_components = _tier2_extract_technology_components(
        parse_result,
        start_idx=len(backend_components) + len(layer_components) + len(frontend_components)
    )
    result.derivation_log.append({
        "phase": "tier2_technology", "components_extracted": len(tech_components)
    })

    all_components = backend_components + layer_components + frontend_components + tech_components

    # --- Signal 1: Document group → capabilities (DIRECT_EVIDENCE) ---
    capabilities = _signal1_group_to_capabilities(parse_result, backend_components)
    result.derivation_log.append({
        "phase": "signal1_groups", "capabilities_created": len(capabilities)
    })

    # --- Signal 1b: Layer-based grouping for non-s4 components ---
    layer_caps = _signal1_layer_to_capabilities(
        parse_result, layer_components, capabilities
    )
    capabilities.extend(layer_caps)
    result.derivation_log.append({
        "phase": "signal1_layers", "capabilities_created": len(layer_caps)
    })

    # --- Signal 2: Naming patterns (DERIVED) ---
    all_tier1 = backend_components + layer_components
    naming_caps = _signal2_naming_patterns(all_tier1, capabilities)
    capabilities.extend(naming_caps)
    result.derivation_log.append({
        "phase": "signal2_naming", "capabilities_created": len(naming_caps)
    })

    # --- Signal 3: PATH A structural adjacency (DERIVED) ---
    structural_caps = _signal3_structural_adjacency(
        all_tier1, capabilities, canonical_topology
    )
    capabilities.extend(structural_caps)
    result.derivation_log.append({
        "phase": "signal3_structural", "capabilities_created": len(structural_caps)
    })

    # --- Frontend domain ---
    fe_domain, fe_cap = _assign_frontend_domain(
        frontend_components, capabilities,
        []  # domains not yet created — will renumber later
    )

    # --- Domain classification: deterministic first ---
    groups = []
    for doc in parse_result.documents:
        groups.extend(doc.groups)

    domains = _classify_domains_deterministic(capabilities, groups)
    result.derivation_log.append({
        "phase": "domain_deterministic", "domains_created": len(domains)
    })

    # --- AI-assisted domain classification ---
    if enable_ai:
        ai_domains, ai_ok, ai_error = _classify_domains_ai(
            capabilities, all_components, domains
        )
        domains.extend(ai_domains)
        result.ai_phase_completed = ai_ok
        result.ai_provider_error = ai_error
        result.derivation_log.append({
            "phase": "domain_ai",
            "domains_created": len(ai_domains),
            "ai_ok": ai_ok,
            "ai_error": ai_error,
        })
    else:
        result.ai_phase_completed = False
        result.ai_provider_error = "AI phases disabled (--enable-semantic-derivation not set)"

    # --- Add frontend domain ---
    if fe_domain and fe_cap:
        fe_domain.domain_id = f"DOMAIN-{len(domains) + 1:02d}"
        fe_cap.domain_id = fe_domain.domain_id
        for comp in frontend_components:
            comp.domain_id = fe_domain.domain_id
            comp.capability_id = fe_cap.capability_id
        domains.append(fe_domain)
        capabilities.append(fe_cap)

    # --- Tech infrastructure domains ---
    tech_domains, tech_caps = _assign_tech_infrastructure(
        tech_components, capabilities, domains
    )
    domains.extend(tech_domains)
    capabilities.extend(tech_caps)

    # --- Propagate domain assignments down ---
    _propagate_domain_to_components(all_components, capabilities)

    result.domains = domains
    result.capabilities = capabilities
    result.components = all_components

    return result
