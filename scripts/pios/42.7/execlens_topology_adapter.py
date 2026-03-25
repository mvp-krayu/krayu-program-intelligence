#!/usr/bin/env python3
"""
execlens_topology_adapter.py
PIOS-42.7-RUN01-CONTRACT-v2

ExecLens Structural Topology Adapter — Stream 42.7

Produces a governed structural topology for the landing-page topology panel
by processing all queries through the 42.2 → 42.1 chain, extracting
drill-down entities, computing co-occurrence-based hierarchy (explicit and
deterministic), and resolving vault paths.

Layer chain:
  42.1  computation / traversal / navigation binding
  42.2  narrative rendering (module import boundary)
  42.7  topology projection — this file (read-only, no new computation)

Entity classes projected:
  Domain      → D_NN_*   (01_Domains/ in pie_vault)
  Capability  → C_NN_*   (02_Capabilities/ in pie_vault)
  Component   → CMP_NN_* (03_Components/ in pie_vault)

Hierarchy computation rules (deterministic, inspectable — G7):
  1. For each query, parse drill-down section to extract Domain/Capability/Component links.
  2. Record domain-capability co-occurrence per query.
  3. Record capability-component co-occurrence per query.
  4. For each capability: assign to domain with highest co-occurrence count.
  5. For each component: assign to capability with highest co-occurrence count.
  6. Ties broken by link ID (alphabetical) — deterministic.

Navigation resolution:
  - All entity paths resolved via 42.1 bind_navigation() — no direct 41.x reads.
  - Only resolved paths passed to the output; unresolved entities get path=null.

Vault-relative path transformation (R10):
  Full repo-relative path:   docs/pios/41.2/pie_vault/01_Domains/D_10_X.md
  Vault-relative file target: 01_Domains/D_10_X
  Transformation: strip "docs/pios/41.2/pie_vault/" prefix, strip ".md" suffix.

Rules:
  R1  all data via 42.2 → 42.1 module chain (no direct 41.x file access)
  R2  no synthetic topology; entities absent from governed output are omitted
  R3  deterministic hierarchy via co-occurrence frequency
  R4  read-only; no file writes
  R5  JSON to stdout only

Usage:
  python3 scripts/pios/42.7/execlens_topology_adapter.py
  python3 scripts/pios/42.7/execlens_topology_adapter.py --query GQ-003
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# R1: Import 42.2 rendering path — same pattern as 42.4 and 42.6 adapters
# ---------------------------------------------------------------------------

_42_2_PATH = Path(__file__).resolve().parents[2] / "pios/42.2"
if str(_42_2_PATH) not in sys.path:
    sys.path.insert(0, str(_42_2_PATH))

try:
    import render_executive_narrative as _r42
except ImportError as e:
    print(json.dumps({
        "error": f"TOPOLOGY ADAPTER FAILURE [R1] — cannot import 42.2: {e}",
    }), file=sys.stderr)
    sys.exit(1)

CONTRACT_ID                = "PIOS-42.7-RUN01-CONTRACT-v2"
VAULT_PREFIX               = "docs/pios/41.2/pie_vault/"
PROJECTION_ATTACHMENT_PATH = Path(__file__).resolve().parents[3] / "docs/pios/44.2/projection_attachment.json"

# ---------------------------------------------------------------------------
# Projection emphasis loader (44.2 → 44.3)
# ---------------------------------------------------------------------------

def _load_emphasis_lookup() -> dict:
    """
    Load emphasis values from the 44.2 projection attachment artifact.
    Returns {node_id: emphasis_value} for all attached projection elements.
    Defaults to empty dict (all nodes treated as emphasis:none) if unavailable.
    42.x reads emphasis only — never assigns or modifies (44.3 E-ATT-007).
    """
    try:
        with open(PROJECTION_ATTACHMENT_PATH) as f:
            data = json.load(f)
        return {
            p["node_reference"]["node_id"]: p.get("emphasis", "none")
            for p in data.get("projections", [])
            if p.get("attachment_status") == "ATTACHED"
        }
    except Exception:
        return {}


# ---------------------------------------------------------------------------
# Entity classification helpers
# ---------------------------------------------------------------------------

def entity_type(link: str) -> Optional[str]:
    if link.startswith("D_"):
        return "domain"
    if link.startswith("C_") and not link.startswith("CMP_"):
        return "capability"
    if link.startswith("CMP_"):
        return "component"
    return None


def entity_label(link: str) -> str:
    """Strip numeric prefix and convert underscores to spaces for display."""
    # Remove leading type prefix: D_10_, C_27_, CMP_65_
    stripped = re.sub(r'^(?:CMP|D|C)_\d+_', '', link)
    return stripped.replace('_', ' ')


def vault_relative_path(repo_relative: Optional[str]) -> Optional[str]:
    """Strip vault prefix and .md suffix for Obsidian file target."""
    if not repo_relative:
        return None
    if repo_relative.startswith(VAULT_PREFIX):
        repo_relative = repo_relative[len(VAULT_PREFIX):]
    return repo_relative.rstrip('.md').removesuffix('.md') if repo_relative.endswith('.md') else repo_relative


# Cleaner version using string slicing
def vault_relative_path(repo_relative: Optional[str]) -> Optional[str]:
    """Strip docs/pios/41.2/pie_vault/ prefix and .md suffix for Obsidian file target."""
    if not repo_relative:
        return None
    p = repo_relative
    if p.startswith(VAULT_PREFIX):
        p = p[len(VAULT_PREFIX):]
    if p.endswith('.md'):
        p = p[:-3]
    return p


# ---------------------------------------------------------------------------
# Drill-down parser
# ---------------------------------------------------------------------------

def parse_drilldown_entities(template_section: str) -> dict:
    """
    Parse the drill-down section from a template section string.
    Returns {domains: [link, ...], capabilities: [link, ...], components: [link, ...]}
    All lists contain link IDs only (no brackets).
    Returns empty lists if no drill-down section present.
    """
    # Locate the Drill-down section
    idx = template_section.find('Drill-down')
    if idx == -1:
        return {"domains": [], "capabilities": [], "components": []}

    # Extract from Drill-down to next --- or end
    drilldown = template_section[idx:]
    end_idx   = drilldown.find('\n---')
    if end_idx != -1:
        drilldown = drilldown[:end_idx]

    domains      = []
    capabilities = []
    components   = []

    # Domain line: "- Domain: [[D_...]] / [[D_...]]"
    domain_line = re.search(r'- Domain: (.+)', drilldown)
    if domain_line:
        domains = re.findall(r'\[\[([^\]]+)\]\]', domain_line.group(1))

    # Capability line: "- Capability: [[C_...]] / [[C_...]]"
    cap_line = re.search(r'- Capability: (.+)', drilldown)
    if cap_line:
        capabilities = re.findall(r'\[\[([^\]]+)\]\]', cap_line.group(1))

    # Component lines: "  - [[CMP_...]]"
    # Find section after "- Components:" line
    cmp_idx = drilldown.find('- Components:')
    if cmp_idx != -1:
        cmp_section = drilldown[cmp_idx:]
        components = re.findall(r'\[\[([^\]]+)\]\]', cmp_section)

    return {"domains": domains, "capabilities": capabilities, "components": components}


# ---------------------------------------------------------------------------
# Co-occurrence hierarchy builder
# ---------------------------------------------------------------------------

def build_hierarchy_from_cooccurrence(
    query_entities: list[dict],
    nav_lookup: dict,
) -> list[dict]:
    """
    Build domain → capability → component hierarchy from query co-occurrence data.

    query_entities: list of {query_id, domains, capabilities, components}
    nav_lookup: {link → {resolved, path}} from all navigation bindings

    Returns list of domain dicts:
      {domain_id, domain_label, resolved, path, vault_path,
       capabilities: [{cap_id, cap_label, resolved, path, vault_path,
         components: [{cmp_id, cmp_label, resolved, path, vault_path}]}]}

    Hierarchy rules (explicit, deterministic, G7):
      - domain-capability assignment: most frequent co-occurrence by query count
      - capability-component assignment: most frequent co-occurrence by query count
      - ties broken by alphabetical ID order
    """
    # Collect unique entity IDs
    all_domains  = sorted(set(d for qe in query_entities for d in qe["domains"]))
    all_caps     = sorted(set(c for qe in query_entities for c in qe["capabilities"]))
    all_comps    = sorted(set(c for qe in query_entities for c in qe["components"]))

    # Co-occurrence counts: domain-capability
    dc_count = defaultdict(int)   # (domain_id, cap_id) → count
    for qe in query_entities:
        for d in qe["domains"]:
            for c in qe["capabilities"]:
                dc_count[(d, c)] += 1

    # Co-occurrence counts: capability-component
    cc_count = defaultdict(int)   # (cap_id, cmp_id) → count
    for qe in query_entities:
        for c in qe["capabilities"]:
            for cmp in qe["components"]:
                cc_count[(c, cmp)] += 1

    # Assign each capability to its best-matching domain
    def best_domain_for_cap(cap_id: str) -> Optional[str]:
        counts = {d: dc_count[(d, cap_id)] for d in all_domains if dc_count[(d, cap_id)] > 0}
        if not counts:
            return None
        return max(counts, key=lambda d: (counts[d], d))   # tie: alphabetical

    # Assign each component to its best-matching capability
    def best_cap_for_cmp(cmp_id: str) -> Optional[str]:
        counts = {c: cc_count[(c, cmp_id)] for c in all_caps if cc_count[(c, cmp_id)] > 0}
        if not counts:
            return None
        return max(counts, key=lambda c: (counts[c], c))   # tie: alphabetical

    # Helper: build entity record with nav resolution
    def make_entity(link: str) -> dict:
        nav = nav_lookup.get(link, {})
        resolved   = nav.get("resolved", False)
        path       = nav.get("path")
        return {
            "id":         link,
            "label":      entity_label(link),
            "resolved":   resolved,
            "path":       path,
            "vault_path": vault_relative_path(path),
        }

    # Build domain → capabilities mapping
    domain_caps = defaultdict(list)
    for cap in all_caps:
        best = best_domain_for_cap(cap)
        if best:
            domain_caps[best].append(cap)
        # Capabilities with no domain co-occurrence are omitted (R14)

    # Build capability → components mapping
    cap_comps = defaultdict(list)
    for cmp in all_comps:
        best = best_cap_for_cmp(cmp)
        if best:
            cap_comps[best].append(cmp)

    # Assemble final structure
    result = []
    for dom in all_domains:
        dom_record = make_entity(dom)
        caps_for_dom = []
        for cap in domain_caps[dom]:
            cap_record = make_entity(cap)
            comps_for_cap = [make_entity(cmp) for cmp in cap_comps[cap]]
            cap_record["components"] = comps_for_cap
            caps_for_dom.append(cap_record)
        dom_record["capabilities"] = caps_for_dom
        result.append(dom_record)

    return result


# ---------------------------------------------------------------------------
# Navigation lookup builder
# ---------------------------------------------------------------------------

def build_nav_lookup(all_nav_bindings: list[list[dict]]) -> dict:
    """
    Merge navigation bindings from all queries into a single lookup.
    Keyed by link ID. Resolved entries take precedence over unresolved.
    """
    lookup = {}
    for bindings in all_nav_bindings:
        for nb in bindings:
            link = nb["link"]
            # Prefer resolved entry
            if link not in lookup or nb.get("resolved"):
                lookup[link] = nb
    return lookup


# ---------------------------------------------------------------------------
# Per-query entity extraction helper
# ---------------------------------------------------------------------------

def _entity_ids_for_query(query_id: str, nav_bindings: list[dict]) -> dict:
    """
    Return entity ID sets for a query from its navigation binding link names,
    classified by type.
    (nav_bindings contains all links referenced in the template section.)
    """
    domains  = [nb["link"] for nb in nav_bindings if entity_type(nb["link"]) == "domain"]
    caps     = [nb["link"] for nb in nav_bindings if entity_type(nb["link"]) == "capability"]
    comps    = [nb["link"] for nb in nav_bindings if entity_type(nb["link"]) == "component"]
    return {"query_id": query_id, "domains": domains, "capabilities": caps, "components": comps}


# ---------------------------------------------------------------------------
# Main topology assembly
# ---------------------------------------------------------------------------

def get_topology(highlight_query_id: Optional[str] = None) -> dict:
    """
    Load all queries, extract entities from drill-downs via 42.2 → 42.1,
    build co-occurrence hierarchy, return structured topology JSON.
    """
    _r42._q41.preflight_check()

    # Load all data sources via 42.1
    qsmap     = _r42._q41.load_query_signal_map()
    templates = _r42._q41.load_response_templates()

    query_ids = sorted(q["query_id"] for q in qsmap.get("queries", []))

    query_entity_records = []
    all_nav_bindings     = []
    highlight_entities   = None

    for qid in query_ids:
        template_section = _r42._q41.extract_template_section(qid, templates)
        nav_bindings     = _r42._q41.bind_navigation(template_section)
        all_nav_bindings.append(nav_bindings)

        # Parse drill-down for entity grouping
        entities = parse_drilldown_entities(template_section)
        entities["query_id"] = qid
        query_entity_records.append(entities)

        # Capture highlighted entities for selected query
        if qid == highlight_query_id:
            highlight_entities = {
                "domains":      set(entities["domains"]),
                "capabilities": set(entities["capabilities"]),
                "components":   set(entities["components"]),
            }

    # Build merged nav lookup
    nav_lookup = build_nav_lookup(all_nav_bindings)

    # Build hierarchy
    topology = build_hierarchy_from_cooccurrence(query_entity_records, nav_lookup)

    # Attach highlight flags if a query is selected
    if highlight_entities is not None:
        for dom in topology:
            dom["highlighted"] = dom["id"] in highlight_entities["domains"]
            for cap in dom.get("capabilities", []):
                cap["highlighted"] = cap["id"] in highlight_entities["capabilities"]
                for cmp in cap.get("components", []):
                    cmp["highlighted"] = cmp["id"] in highlight_entities["components"]

    # Attach projection emphasis from 44.2 governed artifact (read-only — 44.3 E-ATT-007)
    emphasis_lookup = _load_emphasis_lookup()
    for dom in topology:
        dom["emphasis"] = emphasis_lookup.get(dom["id"], "none")
        for cap in dom.get("capabilities", []):
            cap["emphasis"] = emphasis_lookup.get(cap["id"], "none")
            for cmp in cap.get("components", []):
                cmp["emphasis"] = emphasis_lookup.get(cmp["id"], "none")

    return {
        "contract_id":        CONTRACT_ID,
        "highlight_query_id": highlight_query_id,
        "topology":           topology,
        "domain_count":       len(topology),
        "capability_count":   sum(len(d["capabilities"]) for d in topology),
        "component_count":    sum(
            len(cap["components"])
            for d in topology
            for cap in d["capabilities"]
        ),
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", default=None, help="Optional query ID for highlighting")
    args = parser.parse_args()

    result = get_topology(highlight_query_id=args.query)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
