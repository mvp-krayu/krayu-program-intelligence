# Canonical Narrative Expansion Model

Stream: I.5 — Canonical Narrative Expansion
Phase: 1 — Inventory + Narrative Model Definition
Authority: I.4 canonical artifacts | canonical_completion_rules | derivative_entity_inventory
Date: 2026-03-31

---

## 1. Purpose of the Narrative Layer

The narrative layer is a governed textual elaboration of a derivative entity's canonical structural definition.

It is not a rewrite of the node file.
It is not a marketing surface.
It is not an interpretation layer.

Its function is to translate the structural facts established in:
- Phase 3 node files (governance/derivatives/nodes/)
- Phase 2 graph map (derivative_entity_graph_map.md)
- Phase 2 dependency map (derivative_entity_dependency_map.md)

...into a governed prose form that is usable by downstream surfaces (WEB, CAT, GOV) without loss of canonical precision.

The narrative layer does not originate claims. Every statement in a narrative expansion must trace to a node file section, a graph link, or a dependency map entry.

---

## 2. Narrative Design Principles

### NDP-01 — Canonical-First

No narrative statement may introduce meaning not present in the canonical node file or phase 2 map artifacts. If a claim cannot be traced to a canonical source, it must not be written.

### NDP-02 — Non-Promotional

Narrative content must not use language that implies competitive advantage, market positioning, or commercial benefit. These claims belong to downstream investor or marketing surfaces and must not enter the canonical narrative layer.

### NDP-03 — Graph-Aligned

Every reference to another entity in a narrative expansion must reflect an explicit relationship in the Phase 2 dependency map. Implied relationships that do not appear in the dependency map must not be introduced.

### NDP-04 — Authority-Bounded

Narrative expansion scope is bounded by the entity's authority_container_status:
- **bound** — full narrative scope permitted within the entity's defined role
- **partial** — narrative scope limited to concepts explicitly grounded in architecture docs; no elaboration of indirect or conceptual grounding
- **missing** — narrative scope limited to structural facts in node file only; no authority claims permitted

### NDP-05 — Sub-Construct Containment

Narrative for dimension sub-constructs (ESI dimensions) and step sub-constructs (PiOS steps) must not claim independent authority. The narrative must explicitly reference the parent entity's ownership. No standalone positioning allowed.

### NDP-06 — Determinism

Given the same canonical inputs, narrative expansion must produce the same governed outputs. Stylistic variation is permitted. Semantic variation is not.

### NDP-07 — No Drift by Omission

Omitting a boundary or relationship that exists in the node file is a narrative drift. Narrative expansion must represent boundaries and exclusions as accurately as it represents definitions.

---

## 3. Standard Narrative Structure Template

The following sections are required for every entity narrative expansion, in this order:

```
## [Entity Display Name]

### What It Is
[One to three sentences. Drawn from: node §Definition + node §Role in Program Intelligence.]

### Where It Sits
[One paragraph. Drawn from: node §Canonical Position + node §Authority Level + graph_map depth placement.]

### How It Connects
[Bulleted list of relationships. Drawn from: node §Relationships + dependency_map entries for this entity.]

### What It Is Not
[Two to five statements. Drawn from: node §Boundaries + node §Exclusions.]

### Canonical Source
[Reference list. Format: document name | section | relationship type.]
```

No additional sections may be added without a governance decision.
No section may be omitted.
A section with a documented nil ("none recorded") is complete.

---

## 4. Mapping Rule: Narrative Section → Canonical Source

| Narrative Section | Primary Source | Secondary Source |
|-------------------|---------------|-----------------|
| What It Is | node §Definition | node §Role in Program Intelligence |
| Where It Sits | node §Canonical Position | graph_map §Depth Verification, node §Authority Level |
| How It Connects | node §Relationships | dependency_map §Full Dependency Table (rows for this entity) |
| What It Is Not | node §Boundaries | node §Exclusions |
| Canonical Source | node §Classification (authority codes) | public_surface_readiness_matrix §canonical_source_documents |

Every statement in each narrative section must trace to the primary or secondary source listed above.
Statements that cannot be traced must not be written.

---

## 5. Prohibited Language and Drift Rules

### 5.1 Prohibited Language

| Category | Examples |
|----------|---------|
| Promotional | "best-in-class", "uniquely capable", "market-leading", "powerful", "revolutionary" |
| Speculative authority | "this entity proves", "this demonstrates", "this establishes" |
| Invented relationships | any relationship not in dependency_map |
| Promotion language | "top-level", "authority node" (for derivative entities) |
| Comparative claims | any claim comparing to named competitors or external products |
| Completeness overclaim | "fully defines", "completely governs", "entirely covers" |

### 5.2 Drift Rules

| Rule | Violation |
|------|----------|
| DR-01 | Narrative introduces a claim traceable only to inference, not to a canonical source |
| DR-02 | Narrative omits a boundary stated in node §Boundaries or §Exclusions |
| DR-03 | Narrative references a relationship not in dependency_map |
| DR-04 | Narrative assigns a depth or authority level not matching graph_map |
| DR-05 | Narrative for a sub-construct positions the entity independently from its parent |
| DR-06 | Narrative for a BLOCKED entity is written before the block condition is resolved |

---

## 6. Narrative Depth Levels

| Level | Label | Definition | Applicable When |
|-------|-------|------------|----------------|
| 1 | minimal | What It Is + Where It Sits only — maximum 3 sentences total | Entity is sub-construct or PARTIAL readiness |
| 2 | standard | All five required sections, no elaboration beyond canonical sources | Entity is READY; standard surface use |
| 3 | advanced | All five required sections + §Canonical Source expanded with full traceability chain | Entity is READY with COMPLETE maturity; GOV surface use |

Default depth is **standard** (level 2).

Sub-constructs (ESI dimensions, PiOS steps) must use **minimal** (level 1) unless the parent entity narrative is already at standard or advanced.

BLOCKED entities: no depth level assigned until block is resolved.

---

## 7. Reuse Constraints for Downstream Surfaces

### WEB surface

- Permitted sections: What It Is, Where It Sits, How It Connects (abbreviated), What It Is Not
- Depth: standard (level 2)
- Prohibited: §Canonical Source section (internal governance use only)
- Constraint: narrative content must not be altered for tone or emphasis without a governance decision

### CAT surface (category / positioning)

- Permitted sections: What It Is, Where It Sits
- Depth: minimal (level 1) unless entity is READY with COMPLETE maturity
- Prohibited: §How It Connects, §Canonical Source (CAT surface does not expose relationship graphs)
- Constraint: sub-construct entities must be identified as such in any CAT surface use

### GOV surface (governance / internal)

- All sections permitted
- Depth: advanced (level 3) preferred
- §Canonical Source must be present and complete
- Constraint: GOV narrative may include backlog gap references (from derivative_entity_completion_backlog.md) as footnotes; no other additions

### Cross-surface rule

Narrative content written for one surface must not be repurposed for another without confirming the target surface's permitted sections and depth level. A WEB-formatted narrative is not automatically suitable for GOV use, and vice versa.
