# Canonical Completion Rules

Stream: I.4 — Canonical Completion of Derivative Entities (Graph-Aligned)
Phase: 4 — Canonical Integration / Completion / Readiness
Authority: canonical-layer-model | pios_architecture_whitepaper | program_intelligence_stack
Date: 2026-03-31

---

## 1. Definitions

### 1.1 Canonical Document (Authority Container)

A canonical document is a long-form authority artifact residing in:

```
/docs/governance/architecture/
```

Canonical documents define layer ownership, architectural constraints, placement rules, and governed structural truth. They are the authoritative source against which derivative entities are bound.

Canonical documents in this corpus:
- canonical-layer-model.md
- pios_architecture_whitepaper.md
- pios_whitepaper.md
- pios_technical_appendix.md
- pios_investor_narrative.md
- program_intelligence_stack.md
- pios_architecture_whitepaper.md
- obsidian_index.md

### 1.2 Node (Graph Element)

A node is an atomic structural entity defined in a Phase 3 node file residing in:

```
/docs/governance/derivatives/nodes/
```

Nodes are not canonical documents. A node does not become a canonical document by the fact of its existence. A canonical document is not a node. These are distinct artifact types with distinct purposes.

---

## 2. Canonical Completeness Rules

### CCR-01 — Evidence Primacy Inheritance

A derivative entity is canonically complete only if every claim in its node file is traceable to a Phase 1 inventory entry, a Phase 2 graph or dependency map entry, or an explicit canonical document reference.

No node file may introduce claims that originate only from inference or narrative expansion.

### CCR-02 — Authority Container Binding

A derivative entity MUST have at least one of the following authority_container_status values:

- **bound** — explicit, named reference in one or more canonical documents in governance/architecture/
- **partial** — indirect, conceptual, or layer-class grounding in canonical documents; entity name not explicit
- **missing** — no grounding in any canonical document in governance/architecture/

No other values are permitted.

### CCR-03 — Graph Position Requirement

A derivative entity is structurally complete only if:
- It has a defined primary parent authority node
- It has a defined graph depth (maximum 3)
- All cross-links are enumerated in the Phase 2 graph map
- It has no orphan status

### CCR-04 — Node File Completeness

A derivative entity has a complete node file only if all ten canonical node template sections are present and populated:

1. Definition
2. Classification
3. Role in Program Intelligence
4. Canonical Position
5. Relationships
6. Boundaries
7. Authority Level
8. Public Surface Readiness
9. Graph Links
10. Exclusions

A section with a documented negative ("none") is complete. An absent section is not complete.

### CCR-05 — Boundary Precision Requirement

A derivative entity must have explicit boundary statements that identify:
- What the entity is NOT
- What entities or concepts are NOT contained within it
- Whether the entity can be promoted to top-level (answer for all derivative entities: NO)

---

## 3. Structural Completeness Rules

### SCR-01 — Layer Placement

Any derivative entity that maps to a canonical layer (L0–L8) MUST have its layer placement stated in the node file and consistent with canonical-layer-model.md.

### SCR-02 — No Promotion Rule

No derivative entity may be promoted to a top-level authority node through any stream, contract, or phase of I.4. The following six nodes are the only permitted top-level authority nodes:

- krayu
- program_intelligence
- manifesto
- pios
- portfolio_intelligence
- signal_platform

### SCR-03 — No Orphan Rule

Every derivative entity must resolve under at least one top-level authority node via primary parent or cross-link. Orphan status is a structural violation.

### SCR-04 — Sub-Construct Containment

Sub-constructs (ESI dimensions, PiOS steps) may not be re-classified as standalone authority constructs. Their canonical home is within their named parent entity's node file and authority container.

---

## 4. Authority Binding Rules

### ABR-01 — Binding Requires Named Reference

Authority_container_status = **bound** requires an explicit, named reference to the derivative entity or its direct analogue in a canonical document under governance/architecture/.

Named references include:
- Explicit entity name cited in canonical document
- Explicit placement rule naming the entity (e.g., "ExecLens belongs here as a runtime consumer layer")
- Explicit layer assignment with entity name

### ABR-02 — Partial Binding

Authority_container_status = **partial** is assigned when:
- The entity class or concept is grounded in canonical documents, but the specific name is not present
- The entity maps to a canonical layer or pipeline stage without explicit name binding
- The canonical document describes the entity's function at a class level (e.g., "stability computations belong at L3")

### ABR-03 — Missing Binding

Authority_container_status = **missing** is assigned when:
- No reference to the entity, its concept class, or its function appears in any canonical document under governance/architecture/
- The entity exists only on the public surface (mirror pages) without architectural grounding

### ABR-04 — Drift Supersedes Partial

If a canonical document explicitly states that an entity's current implementation deviates from its canonical home (e.g., DRIFT-001 for SSZ/SSI), the canonical_anchor_context for derived entities must reference the stated canonical home, not the current implementation location.

---

## 5. Publishability Rules

### PBR-01 — Minimum Publishability Conditions

A derivative entity is permitted on a public surface (publish_status: live) only if:
- publish_status in Phase 1 inventory is live OR the entity has no backing page (not applicable)
- authority_container_status is bound OR partial
- node file exists and is complete per CCR-04
- graph position exists per CCR-03
- boundary precision satisfies CCR-05

### PBR-02 — Prohibited Publication Conditions

A derivative entity MUST NOT be published or promoted to a public surface if:
- authority_container_status is missing AND the entity has no prior live backing page
- publish_status in Phase 1 inventory is preview-pending-publish
- node file is absent

### PBR-03 — Existing Surface Exception

An entity with an existing live backing page (publish_status: live) at the mirror surface retains its current publication status regardless of authority_container_status, subject to:
- No misrepresentation of canonical authority level
- No promotion to top-level in page content

---

## 6. Distinction: Canonical Documents vs. Nodes

| Property | Canonical Document | Node |
|----------|--------------------|------|
| Location | governance/architecture/ | governance/derivatives/nodes/ |
| Purpose | Authority container for architectural truth | Graph element — atomic structural entity |
| Authored by | Governed architecture stream | Phase 3 canonical completion process |
| Scope | Long-form narrative + structural specification | Atomic template — 10 sections only |
| Creates authority | Yes — within its domain | No — references authority only |
| Can be a top-level node | N/A — documents are not graph nodes | Only if in the 6-node allowed set |
| Multiplicity | One or more per authority domain | One per derivative entity |

A node file for an entity does not create, replace, or substitute for a canonical document for that entity.

The existence of a node file is a Phase 3 output. The existence of a canonical document is an architecture stream output.

---

## 7. When an Entity May Function as a Stable Public Concept

An entity may function as a stable public concept when ALL of the following are true:

- CCR-01: claims are evidence-traceable
- CCR-02: authority_container_status is bound or partial
- CCR-03: graph position is defined
- CCR-04: node file is complete
- CCR-05: boundary precision is present
- PBR-01: minimum publishability conditions are met

### When an Entity Must Remain Internal / Partial / Non-Publishable

An entity must remain internal or non-publishable when ANY of the following is true:

- authority_container_status is missing AND no prior live backing page exists
- node file is absent or incomplete (fewer than 10 sections present)
- graph position is undefined or would require orphan status
- publish_status in Phase 1 is preview-pending-publish
- entity would require promotion to top-level to be coherent on a public surface
