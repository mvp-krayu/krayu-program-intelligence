# PSEE Runtime Handoff Contract

stream: PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07
artifact: psee_runtime_handoff_contract
run_classification: MULTI-SOURCE STRUCTURAL RECONSTRUCTION (<=40.4 COMPLIANT)
layer_constraint: <=40.4
generated_date: 2026-04-08

---

## 1. Purpose

This contract governs the consumption of the Runtime Handoff Package (RHP) produced by stream PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07.

It applies to all downstream systems, including LLMs, consuming the WP-03→WP-07 artifacts.

It enforces ≤40.4 boundary conditions at the point of consumption.

---

## 2. Runtime Handoff Package (RHP)

The RHP consists of exactly the following files:

| File | Work Package | Role |
|------|-------------|------|
| normalized_file_inventory.json | WP-03 | File enumeration by type and CEU |
| ceu_registry.json | WP-04 | Canonical evidence unit definitions |
| domain_structure.json | WP-04 | Domain groupings by structural containment |
| overlap_registry.json | WP-05 | Overlap declarations (OVL-*) |
| unknown_space_registry.json | WP-06 | Unknown-space declarations (USP-*) |
| html_influence_map.json | WP-06 | HTML influence classification per element |
| structural_topology.json | WP-07 | Integrated topology: domains + CEUs + overlaps + unknown-space |

Rules:

- All seven files are REQUIRED
- No file may be omitted or substituted
- All files are read-only for consumers
- No file may be passed in partial form

---

## 3. Provenance Model (Mandatory)

This reconstruction draws from three distinct sources. All three are explicitly declared per element across all RHP artifacts.

| Source ID | Description |
|-----------|-------------|
| NORMALIZED_EVIDENCE_MAP | docs/pios/40.2/normalized_evidence_map.md — CEU IDs, file counts, overlap declarations, unknown-space declarations |
| STRUCTURAL_CONTAINMENT | Physical directory structure of extracted source trees — top-level subdirectory enumeration |
| HTML_DOCUMENTED | CEU-01/CEU-02/CEU-03 HTML artifacts — documented labels and named constructs visible in documentation |

Per-element provenance fields present in all RHP artifacts:

- `source_origin` — all contributing sources for this element
- `structural_topology_source` — origin of paths and containment structure
- `documented_taxonomy_source` — origin of labels and named constructs
- `label_provenance` — specific trace of label origin

Enforcement:

- Provenance fields MUST NOT be removed, merged, or inferred
- Multi-source attribution MUST be preserved exactly as declared
- A consumer MUST NOT collapse multi-source origin to a single source

---

## 4. Dual-Lens Rule (Critical)

This reconstruction separates two distinct lenses. Both are present in the RHP. Neither may override or replace the other.

**Structural Lens**
- Content: paths, containment, directory structure, domain groupings, CEU boundaries
- Source: STRUCTURAL_CONTAINMENT + NORMALIZED_EVIDENCE_MAP
- Field: `structural_topology_source`

**Taxonomy Lens**
- Content: labels, named constructs visible in documentation
- Source: HTML_DOCUMENTED + NORMALIZED_EVIDENCE_MAP
- Field: `documented_taxonomy_source`

Rules:

- These lenses MUST remain separate in all downstream usage
- No system may collapse them into a single interpretation
- Labels MUST NOT be used to infer structure
- Structure MUST NOT be used to infer meaning
- Where `structural_topology_source` ≠ `documented_taxonomy_source`, both values must be preserved and referenced independently

---

## 5. Allowed Operations (≤40.4 Safe)

The following operations are permitted against the RHP:

- Structural traversal — enumerate domains, sub-domains, CEUs by containment path
- Grouping by containment — collect elements sharing a directory or CEU
- Filtering by CEU or domain — return subset by CEU ID or domain ID
- Reading provenance fields — return `source_origin`, `structural_topology_source`, `documented_taxonomy_source`, `label_provenance` for any element
- Identifying overlaps — return OVL-* records from overlap_registry.json
- Identifying unknown-space — return USP-* records from unknown_space_registry.json

All allowed operations must be:

- Structure-only
- Provenance-aware
- Traceable to explicit data present in the RHP

---

## 6. Forbidden Operations (Strict)

The following operations are explicitly forbidden:

- Semantic inference — no inferred meaning from paths or labels
- Capability grouping — no grouping of structural elements by inferred function
- Architecture reconstruction beyond structure — no system-design conclusions
- Resolving unknown-space — USP-* entries must remain permanently unresolved
- Inferring function, purpose, or behavior — from any element in the RHP
- Cross-layer interpretation — no 41.x+ layer access, inference, or import
- Merging domains based on meaning — domains may only be related by explicit structural evidence
- Generating narratives about system design — narrative synthesis is forbidden at ≤40.4
- Removing or overwriting provenance fields — source_origin and related fields are immutable

Any of the above constitutes a ≤40.4 boundary violation.

---

## 7. Unknown-Space Handling

The `unknown_space_registry.json` is the authoritative record of all USP-* entries.

Rules:

- All USP-* entries MUST remain permanently unresolved
- Systems MAY reference unknown-space entries (e.g., "USP-01 is declared for OVL-01")
- Systems MUST NOT:
  - interpret unknown-space as resolvable
  - expand the definition of an unknown-space entry
  - resolve unknown-space by inference
  - replace unknown-space with a derived value

Unknown-space is a structural fact, not a gap to be filled.

---

## 8. Overlap Handling

The `overlap_registry.json` defines all OVL-* relationships.

Rules:

- `file_level_parity` MUST remain `UNKNOWN` for all OVL-* entries unless explicitly resolved in a separate authorized stream with its own commit record
- No inference of equivalence between overlapping units is allowed
- Canonical preference assignments (`canonical_for_isolated_evidence`, `canonical_for_integrated_context`) are for evidence selection only — they do not resolve parity
- Consumers MUST NOT treat OVL-01 or OVL-02 as confirming structural identity between overlapping units

---

## 9. Immutability Constraints

The following artifacts are immutable within ≤40.4 scope:

| Artifact | Immutable Scope |
|----------|----------------|
| structural_topology.json | All domain definitions, source_origin assignments, overlap and unknown-space references |
| domain_structure.json | All domain groupings, sub-domain containment, label_provenance |
| ceu_registry.json | All CEU definitions, source_origin, path assignments |

Allowed:
- Read
- Reference

Forbidden:
- Modify
- Reinterpret
- Extend with inferred fields

Modification requires a new authorized stream with explicit version declaration.

---

## 10. LLM Usage Constraints

LLMs interacting with this RHP are restricted to the following operations:

**Permitted:**
- Traversal — navigate domain/CEU hierarchy by structural containment
- Filtering — return elements matching a specified CEU ID, domain ID, or source_origin
- Formatting — present RHP data in a different display format without altering values
- Extraction — return specific fields from specific elements

**Forbidden:**
- Infer meaning — no assignment of purpose, function, or architectural role
- Assign purpose — no labeling of elements beyond what is declared in the RHP
- Synthesize architecture — no construction of system-design narratives
- Resolve unknown-space — USP-* entries are not resolvable by LLM inference
- Collapse provenance — multi-source attribution must be preserved; LLMs must not flatten to a single source

LLM outputs derived from this RHP must be traceable to specific RHP fields. Any output not traceable to an explicit RHP field is a violation.

---

## 11. Query Patterns (Controlled)

The following query types are safe and explicitly permitted:

| Query Pattern | Permitted | Basis |
|---------------|-----------|-------|
| "List CEUs under domain X" | YES | Structural traversal |
| "Show structural path for CEU-X" | YES | Path read from ceu_registry.json |
| "Return overlaps for CEU-X" | YES | OVL-* lookup from overlap_registry.json |
| "Identify unknown-space references in domain X" | YES | USP-* lookup from unknown_space_registry.json |
| "Return provenance sources for element Y" | YES | source_origin read |
| "What does domain X do?" | NO | Infers function — FORBIDDEN |
| "Group capabilities by theme" | NO | Semantic grouping — FORBIDDEN |
| "Resolve the overlap between CEU-08 and CEU-10" | NO | Resolves unknown-space — FORBIDDEN |
| "What architecture pattern does this represent?" | NO | Architecture synthesis — FORBIDDEN |
| "Merge backend and platform domains" | NO | Domain merging by meaning — FORBIDDEN |

Rule: All queries must resolve to explicit data present in the RHP. No derived interpretation is allowed.

---

## 12. Governance Statement

- This contract enforces ≤40.4 boundary conditions at the point of RHP consumption
- This contract is REQUIRED for any downstream execution using the WP-03→WP-07 artifacts, including LLM usage
- Any violation of this contract invalidates the downstream execution and requires a governance correction record
- This contract does not supersede the git_structure_contract.md or reference_boundary_contract.md — it operates within them

---

## 13. Execution Constraint

- This document defines consumption rules only
- It does NOT introduce new data
- It does NOT modify any existing RHP artifact
- It does NOT extend the evidence boundary
- It does NOT resolve any declared unknown-space
- It does NOT make claims about layers above ≤40.4
