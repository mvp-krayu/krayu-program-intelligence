# Grouping Logic Classification
# 41X.SEMANTIC.CONSTRUCTION.FORENSICS.01 — Deliverable 3

## Identity

- Contract: 41X.SEMANTIC.CONSTRUCTION.FORENSICS.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT FORENSICS — NO CODE CHANGES

---

## Classification Definitions

| class | definition |
|-------|-----------|
| RULE_BASED | Explicit named rules applied uniformly to all assignments |
| ALGORITHMIC | Logic derived from graph structure, clustering, or computation |
| DECLARATIVE | Explicit mapping table or lookup (A maps to B, stated directly) |
| HEURISTIC | Pattern-based judgment without explicit rules |
| MANUAL | Assignment by authoring judgment; no traceable systematic logic |
| HYBRID | Combination of two or more of the above |

---

## Level A — COMPONENT → CAPABILITY

### Evidence Collected

From `semantic_traceability_map.md`:
- Each COMP-NN entry has `assigned_capability` (a single CAP-NN) and `original_evidence_ref` pointing to `app.module.ts line NN` or a source file
- Examples:
  - COMP-02 (AuthModule) → CAP-23 (JWT Authentication): `app.module.ts line 20; modules/auth/ confirmed`
  - COMP-03 (VehiclesModule) → CAP-07 (Core Fleet Asset Management): `app.module.ts line 23`
  - COMP-73 (sensor_collector.py) → CAP-01 (Vehicle Sensor Collection): SVG agent reading sensors

From `capability_map.md`:
- Each capability has `component_members` list — a declarative assignment
- Members were selected by shared functional purpose (all components that serve the same operation)

From `semantic_elevation_report.md` line 138:
> "All 17 domain names and 42 capability names are derived from evidence in **component_model.md session comments**, intent_inference_map.md, or explicit source code patterns."

From `semantic_domain_model.md` line 16:
> "Domain names derived from evidence in component_model.md and intent_inference_map.md"

From `build_semantic_layer.py` COMPONENTS list (recovered encoding):
- Each component dict has a hardcoded `"cap"` field: `{"id": "COMP-03", "name": "VehiclesModule", "cap": "CAP-07", ...}`
- These assignments are DECLARATIVE — explicitly stated per entry, not computed

### Classification: HYBRID (DECLARATIVE + RULE_BASED)

| dimension | classification | evidence |
|-----------|---------------|---------|
| Primary mechanism | DECLARATIVE | Each component has explicit `assigned_capability` in semantic_traceability_map.md; encoded as `"cap"` field in build_semantic_layer.py |
| Grouping basis | RULE_BASED | Explicit rules applied: (1) components sharing functional purpose are grouped; (2) source code placement (module directory, app.module.ts import group) determines functional role; (3) minimum 1 component per capability |
| Session comment signal | RULE_BASED | app.module.ts session comments group NestJS modules — used as input to capability assignment |
| Edge cases (cross-domain) | HEURISTIC | COMP-25 (OtaModule) cross-domain annotation required judgment call per semantic_elevation_report.md SC-01 |

**Overall classification: HYBRID (DECLARATIVE + RULE_BASED)**

**Confidence: HIGH**

**Evidence:** All 89 component assignments are explicitly documented in `semantic_traceability_map.md` with source evidence. The `build_semantic_layer.py` encodes all 89 `cap` fields as declarations. Grouping rules are stated in `capability_map.md` header ("Minimum 1 component per capability", "Each capability belongs to exactly one domain or annotated cross-domain", "Capability names derived strictly from evidence"). One cross-domain conflict (SC-01) resolved via judgment (HEURISTIC sub-component).

---

## Level B — CAPABILITY → DOMAIN

### Evidence Collected

From `semantic_domain_model.md`:
- Domain Construction Rules Applied (lines 13–18):
  - "Minimum 2 components per domain (single-component domains explicitly justified)"
  - "No domain overlap without cross-domain annotation"
  - "Domain names derived from evidence in component_model.md and intent_inference_map.md"
  - "Domain types: FUNCTIONAL | OPERATIONAL | INFRASTRUCTURE | INTEGRATION | CROSS-CUTTING"
  - "WEAKLY GROUNDED classification applied where components carry WEAKLY_GROUNDED status in structural_traceability_map.md"

From `semantic_elevation_report.md` (per-domain coherence evidence):
- "DOMAIN-03 — HIGH — unified by app.module.ts session comment 'Core domains (7 modules, 66 endpoints)' and foundational data dependency"
- "DOMAIN-06 — HIGH — all classified AI/ML in app.module.ts session comment and IIM-04"
- "DOMAIN-09 — HIGH — JWT backend auth, frontend auth state, and API versioning unified by platform access governance; R-013 confirms global auth application; IIM-03a confirms non-optional enforcement"
- "DOMAIN-12 — HIGH — explicitly unified by app.module.ts 'Session 23: Multi-Tenant SaaS' comment; IIM-06 confirms SaaS commercial packaging"
- "DOMAIN-13 — HIGH — app.module.ts 'Session 24: Integration Layer' comment; IIM-07 confirms enterprise integration intent"
- "DOMAIN-16 — HIGH — R-036/R-037 confirm observability coupling; IIM-09 confirms engineering maturity intent"

From `build_semantic_layer.py` CAPABILITIES list:
- Each capability dict has a hardcoded `"domain"` field: `{"id": "CAP-01", "name": "Vehicle Sensor Collection", "domain": "DOMAIN-01", ...}`
- These are DECLARATIVE assignments per capability

### Classification: HYBRID (DECLARATIVE + RULE_BASED + HEURISTIC)

| dimension | classification | evidence |
|-----------|---------------|---------|
| Primary mechanism | DECLARATIVE | Each capability has explicit `parent_domain` in capability_map.md; encoded as `"domain"` field in build_semantic_layer.py |
| Construction rules | RULE_BASED | Minimum 2 components per domain; no overlap without annotation; domain types are closed set (FUNCTIONAL/OPERATIONAL/INFRASTRUCTURE/INTEGRATION/CROSS-CUTTING) |
| Session comment signals | RULE_BASED + DECLARATIVE | app.module.ts session comments directly categorize module groups → domain grouping follows the developer-provided categorization |
| Intent validation | RULE_BASED | IIM entries validate that domain grouping reflects actual platform intent (not invented meaning) |
| Domain boundary decisions | HEURISTIC | Domain splits (e.g., separating DOMAIN-07 Sensor Ingestion from DOMAIN-01 Edge Acquisition) required judgment about operational vs. functional distinction |

**Overall classification: HYBRID (DECLARATIVE + RULE_BASED + HEURISTIC)**

**Confidence: HIGH**

**Evidence:** All 42 capability domain assignments are explicitly stated in `capability_map.md` and encoded in `build_semantic_layer.py`. Domain construction rules are formally stated in `semantic_domain_model.md`. IIM references provide validation evidence per domain. Session comment citations in `semantic_elevation_report.md` provide categorical evidence for key domain groupings. The HEURISTIC component is documented via the SC-01 conflict resolution (cross-domain annotation for COMP-25) and the `semantic_elevation_report.md` per-domain coherence table.

---

## Summary

| level | classification | confidence | primary_signal |
|-------|---------------|-----------|----------------|
| COMPONENT → CAPABILITY | HYBRID (DECLARATIVE + RULE_BASED) | HIGH | app.module.ts line references; source file placement; functional purpose grouping rules |
| CAPABILITY → DOMAIN | HYBRID (DECLARATIVE + RULE_BASED + HEURISTIC) | HIGH | app.module.ts session comments; IIM-NN intent validation; domain construction rules |

### Was grouping algorithmic?

NO. No clustering algorithm, graph analysis, or computational method is evidenced. The 40.3 `program_execution_graph.md` and `dependency_map.md` informed the understanding of component relationships but were not algorithmically processed to produce domain/capability assignments.

### Was grouping manual?

PARTIALLY. The initial assignments appear to have been made by human judgment during the 41.1 execution (run_03_blueedge_derivation_validation), guided by:
1. Source code structure (app.module.ts import order and session comments)
2. Explicit construction rules (stated in semantic_domain_model.md header)
3. Intent inference map (IIM-NN) for validation

The `build_semantic_layer.py` recovery script encodes these decisions as dicts — preserving the result of the human-guided declarative assignment, not the process that produced it.

### Where is grouping logic implemented?

In the repository today: `scripts/pios/41.1/build_semantic_layer.py` — COMPONENTS list (`cap` field) and CAPABILITIES list (`domain` field). These are the persisted encoding of the grouping decisions.

No transformation script computing assignments exists. The grouping logic is documented (rules in MD artifacts + evidence citations) but not programmatically implemented in a way that derives assignments from inputs.
