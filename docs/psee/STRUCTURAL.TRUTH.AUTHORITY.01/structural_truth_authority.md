# Structural Truth Authority Contract
# STRUCTURAL.TRUTH.AUTHORITY.01

---

## 1. IDENTITY

- Contract: STRUCTURAL.TRUTH.AUTHORITY.01
- Date: 2026-04-14
- Status: AUTHORITATIVE — LOCKED
- Scope: STAGE 2 ONLY — 40.2, 40.3, 40.4
- Authority level: STRUCTURAL PROOF AUTHORITY

**Upstream chain (both required before Stage 2 may begin):**
- BOOTSTRAP.CHAIN.AUTHORITY.01 — Stage 0 intake and source boundary
- IG.HANDOFF.AUTHORITY.01 — Stage 1 IG ingestion and Runtime Handoff Package (RHP)

**Downstream consumer:**
- Semantic Computation — Stage 3 (41.x)

---

## Purpose

This contract defines what constitutes structural proof, which artifacts are authoritative, how outputs must be derived, and what is admissible for downstream semantic computation.

Stage 2 spans three sub-stages, each with a defined input, computation, and output:

- **40.2 — Evidence Classification:** admitted artifacts → classified evidence inventory
- **40.3 — Structural Reconstruction:** classified evidence → entity graph, relationships
- **40.4 — Telemetry Surface Definition:** structural entities → observable telemetry dimensions

The outputs of Stage 2 collectively constitute the structural truth of the source system as recoverable from the admitted evidence. Nothing in Stage 2 may be invented, simulated, or imported from outside the admitted evidence boundary.

---

## 2. INPUT CONTRACT (FROM IG HANDOFF)

### 2.1 Upstream Authority

Stage 2 inputs are governed by IG.HANDOFF.AUTHORITY.01.
The complete admissibility check defined in that contract (AC-01 through AC-12) must pass before Stage 2 may begin.
IG.HANDOFF.AUTHORITY.01 itself depends on BOOTSTRAP.CHAIN.AUTHORITY.01 for the sealed evidence root.
Stage 2 may not bypass or re-evaluate either upstream contract.

### 2.2 Authorized Input Artifacts

Stage 2 may consume ONLY the following artifacts from the sealed RHP:

| artifact | path |
|---------|------|
| source_manifest.json | `docs/pios/IG.RUNTIME/run_<run_id>/source_manifest.json` |
| evidence_boundary.json | `docs/pios/IG.RUNTIME/run_<run_id>/evidence_boundary.json` |
| admissibility_log.json | `docs/pios/IG.RUNTIME/run_<run_id>/admissibility_log.json` |
| layer_index.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/layer_index.json` |
| source_profile.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/source_profile.json` |
| provenance_chain.json | `docs/pios/IG.RUNTIME/run_<run_id>/normalized_intake_structure/provenance_chain.json` |

Stage 2 may read admitted source files whose paths are declared in `admissibility_log.json` with `"decision": "ADMITTED"`. Access is mediated through the RHP admission record — no direct raw source access is permitted.

### 2.3 Input Identity Binding

All Stage 2 inputs must resolve to exactly one `client_uuid` and one `source_version`.
No input from a different `client_uuid` or `source_version` may enter Stage 2 within a single run.

### 2.4 Forbidden Inputs

| forbidden | reason |
|-----------|--------|
| Direct access to raw source tree without admissibility check | Bypasses IG admission decisions |
| Any artifact not listed in `admissibility_log.json` as ADMITTED | Not authorized by IG boundary |
| Any file from outside `clients/<client_uuid>/source/<source_version>/` | Out-of-boundary input |
| Artifacts from a prior Stage 2 run for the same source | Cross-run contamination |
| External files, URLs, or package registry references | Non-RHP input |
| Any semantic, activation, or runtime layer artifact | Wrong layer — not structural evidence |

### 2.5 No External Enrichment Rule

Stage 2 must not introduce any information not present in the admitted evidence set.
No external knowledge, documentation, or inference beyond what the evidence directly supports may enter Stage 2 outputs.

---

## 3. 40.2 — EVIDENCE CLASSIFICATION AUTHORITY

### 3.1 Purpose

40.2 classifies every admitted artifact from the RHP into a typed evidence inventory. Classification makes the admitted artifact set navigable, traceable, and consistent for structural reconstruction in 40.3.

### 3.2 Authoritative Outputs

| artifact | path | role |
|---------|------|------|
| `evidence_classification_map.md` | `docs/pios/40.2/evidence_classification_map.md` | Complete table mapping every admitted artifact to its evidence class and domain |
| `normalized_evidence_map.md` | `docs/pios/40.2/normalized_evidence_map.md` | Normalized view of the evidence set with overlap declarations and unknown-space records |
| `evidence_surface_inventory.md` | `docs/pios/40.2/evidence_surface_inventory.md` | Per-CEU (Canonical Evidence Unit) inventory of admitted surfaces with source references |

### 3.3 Required Structure Per Output

**evidence_classification_map.md** must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- Classification basis declaration (which evidence classes are recognized)
- Classification table with columns: Evidence Unit, Domain, Class, Subclass, Priority
- One row per admitted artifact from `admissibility_log.json`
- No admitted artifact may be absent from the table (no orphan evidence)

**normalized_evidence_map.md** must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- Per-CEU sections, each containing: CEU identifier, source path(s), evidence class, overlap declarations (if any), unknown-space flags (if any)
- Explicit overlap declarations (OVL-xx) where the same logical entity is covered by multiple sources; canonical selection must be declared
- Explicit unknown-space records (US-xx) where structural coverage is absent or partial

**evidence_surface_inventory.md** must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- Enumeration of all Canonical Evidence Units (CEU-xx) with: CEU identifier, path, evidence class, structural coverage assessment
- Explicit tally: total CEUs, total admitted files per CEU

### 3.4 Classification Rules

| rule | description |
|------|-------------|
| EXHAUSTIVE | Every artifact in `admissibility_log.json` with `"decision": "ADMITTED"` must appear in the classification map |
| DETERMINISTIC | Same admitted set → same classification — no stochastic or session-dependent classification |
| EVIDENCE-ONLY | Classification is derived from artifact content and path; no external taxonomy or inferred class |
| NO ORPHANS | An admitted artifact that does not appear in the classification map is an orphan — this is a FAIL condition |
| NO INVENTED ARTIFACTS | Only artifacts present in the RHP admitted set may be classified; no synthetic CEUs |

---

## 4. 40.3 — STRUCTURAL RECONSTRUCTION AUTHORITY

### 4.1 Purpose

40.3 reconstructs the structural entity graph of the source system from the classified evidence produced by 40.2. Every entity, relationship, and structural observation must trace to a classified evidence unit.

### 4.2 Authoritative Outputs

| artifact | path | role |
|---------|------|------|
| `entity_catalog.md` | `docs/pios/40.3/entity_catalog.md` | Canonical register of all structural entities by tier |
| `dependency_map.md` | `docs/pios/40.3/dependency_map.md` | Directed dependency graph between entities |
| `interface_map.md` | `docs/pios/40.3/interface_map.md` | Interface definitions and inter-entity contracts |
| `program_execution_graph.md` | `docs/pios/40.3/program_execution_graph.md` | Execution path graph derived from entities + dependencies + interfaces |
| `reconstruction/` | `docs/pios/40.3/reconstruction/` | Full entity reconstruction corpus (per-entity files) |

### 4.3 Required Structure Per Output

**entity_catalog.md** must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- Entity classification scheme declaring all recognized tiers (e.g. system component, module, subsystem, schema, agent) with their prefix codes
- One entry per entity with: entity_id (prefixed), entity_name, tier, evidence source (CEU reference), classification notes
- No entity without a CEU reference

**dependency_map.md** must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- Dependency type taxonomy (recognized dependency classes with definitions)
- One entry per dependency with: dependency_id, from (entity_id), to (entity_id), dependency_type, evidence source (CEU reference + artifact path), strength assessment
- No dependency without an evidence reference

**interface_map.md** must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- One entry per interface with: interface_id, owning entity (entity_id), consumers (entity_id list), protocol or contract type, evidence source
- No interface without an owning entity in the entity catalog

**program_execution_graph.md** must contain:
- Header: `run_id`, `stream`, `contract`, `date`
- Execution path entries each with: path_id, entry_point entity, terminal entity or condition, intermediate entities (ordered), evidence basis
- Derivation note: all execution paths must be reconstructable from entity_catalog + dependency_map + interface_map

**reconstruction/** must contain:
- One file per structural entity (or per entity tier grouping)
- Each file contains the full reconstruction record for that entity: evidence sources, observable properties, structural relationships, classification

### 4.4 Structural Reconstruction Rules

| rule | description |
|------|-------------|
| EVIDENCE TRACE | Every entity must reference at least one classified evidence unit (CEU-xx) from 40.2 |
| DERIVABLE RELATIONSHIPS | Every dependency and interface must be derivable from the classified evidence; invented or assumed links are forbidden |
| GRAPH CONSISTENCY | An entity referenced in `dependency_map.md` or `interface_map.md` must appear in `entity_catalog.md` |
| PEG DERIVABILITY | `program_execution_graph.md` must be fully reconstructable from `entity_catalog.md`, `dependency_map.md`, and `interface_map.md` with no additional inputs |
| NO ORPHAN ENTITIES | An entity in the reconstruction corpus that has no entry in `entity_catalog.md` is an orphan — FAIL condition |
| CIRCULAR DEPENDENCY DECLARATION | If a circular dependency exists, it must be explicitly declared in `dependency_map.md`; it may not be silently omitted |
| NO INVENTED ENTITIES | Entities not recoverable from classified evidence may not be added to the catalog |

---

## 5. 40.4 — TELEMETRY SURFACE AUTHORITY

### 5.1 Purpose

40.4 defines which structural entities produce observable telemetry dimensions and specifies the schema those dimensions must conform to. Telemetry dimensions are the observational bridge between structure and signal computation (Stage 5, 40.5).

### 5.2 Authoritative Outputs

| artifact | path | role |
|---------|------|------|
| `telemetry_surface_definition.md` | `docs/pios/40.4/telemetry_surface_definition.md` | Maps structural entities to telemetry surfaces with evidence traceability |
| `telemetry_dimension_catalog.md` | `docs/pios/40.4/telemetry_dimension_catalog.md` | All observable telemetry dimensions with category, source entity, and availability status |
| `telemetry_schema.md` | `docs/pios/40.4/telemetry_schema.md` | Mandatory schema for all telemetry metrics |

### 5.3 Required Structure Per Output

**telemetry_surface_definition.md** must contain:
- Header: `stream`, `input` references (40.3 reconstruction, 40.2 evidence map), `date`
- Definition rule statement
- Per-surface entries with: Surface ID, Entity name, Entity ID (from 40.3 entity_catalog), PEG Node reference, Evidence Source (CEU reference)
- Observable dimension classes per surface (e.g. Structural, Activity, Delivery)
- Every surface must reference an entity_id in 40.3 `entity_catalog.md`

**telemetry_dimension_catalog.md** must contain:
- Header: `run_id`, `stream`, `contract`, `upstream_contract`, `date`
- Dimension category taxonomy
- One entry per dimension with: dimension_id (DIM-xx), name, category code, source entity (entity_id), observation method, temporal reference, availability status
- Availability status must be one of: `STATIC`, `RUNTIME`, `BLOCKED`

**telemetry_schema.md** must contain:
- Header: `stream`, `input` references, `date`
- Schema rule statement
- Metric record schema with all required fields: metric_id, dimension_id, entity_id, temporal_reference, value, unit, availability_status, evidence_source
- Explicit statement that no metric is valid without temporal classification or evidence reference

### 5.4 Telemetry Dimension Classification Rules

| status | meaning |
|--------|---------|
| `STATIC` | Dimension is fully derivable from structural evidence without live runtime access; value is deterministic given the admitted evidence set |
| `RUNTIME` | Dimension requires live telemetry from a running system (e.g. Prometheus scrape, event stream, live API call); value is not derivable from static analysis |
| `BLOCKED` | Dimension is `RUNTIME` and live access is currently unavailable; the dimension is declared but no value is produced |

**Rules:**

| rule | description |
|------|-------------|
| STRUCTURAL TRACE | Every dimension must reference a structural entity from 40.3 `entity_catalog.md` |
| NO SIMULATED RUNTIME | A RUNTIME dimension may not be assigned a simulated or estimated value in place of actual telemetry |
| BLOCKED IS VALID | A BLOCKED dimension is a valid structural truth state; it records what cannot be observed, not what does not exist |
| SCHEMA COMPLIANCE | Every telemetry metric produced must conform to `telemetry_schema.md` |
| NO EXTRA DIMENSIONS | Dimensions not traceable to structural entities are forbidden; telemetry cannot introduce entities that 40.3 did not establish |

---

## 6. STRUCTURAL PROOF CRITERIA

### 6.1 PASS Conditions

Stage 2 is COMPLETE and its output is valid for Stage 3 consumption if and only if ALL of the following are satisfied:

| condition | check |
|-----------|-------|
| SP-01 | All 3 authoritative 40.2 artifacts exist and are non-empty |
| SP-02 | All 5 authoritative 40.3 artifacts exist and are non-empty (`reconstruction/` directory contains ≥1 file) |
| SP-03 | All 3 authoritative 40.4 artifacts exist and are non-empty |
| SP-04 | Every admitted artifact in `admissibility_log.json` appears in `evidence_classification_map.md` |
| SP-05 | Every entity in `entity_catalog.md` references at least one CEU from 40.2 |
| SP-06 | Every dependency in `dependency_map.md` references two entity_ids that exist in `entity_catalog.md` |
| SP-07 | Every interface in `interface_map.md` references an owning entity_id that exists in `entity_catalog.md` |
| SP-08 | Every telemetry surface in `telemetry_surface_definition.md` references an entity_id that exists in `entity_catalog.md` |
| SP-09 | Every dimension in `telemetry_dimension_catalog.md` references a structural entity from `entity_catalog.md` |
| SP-10 | No dimension in `telemetry_dimension_catalog.md` has availability_status `RUNTIME` or `BLOCKED` with a non-null simulated value |
| SP-11 | Full traceability chain is present: RHP admitted artifacts → classification (CEU) → entity → telemetry dimension |
| SP-12 | No circular dependency is present without an explicit declaration in `dependency_map.md` |

**PASS:** SP-01 through SP-12 all satisfied.

**Stage 3 may not begin until the PASS condition is confirmed.**

### 6.2 Traceability Chain Requirement

The minimum required traceability chain for any telemetry dimension is:

```
admissibility_log.json (ADMITTED entry)
  → evidence_classification_map.md (CEU classification)
    → entity_catalog.md (entity with CEU reference)
      → telemetry_surface_definition.md (surface from entity)
        → telemetry_dimension_catalog.md (dimension from surface)
```

Any break in this chain is a FAIL condition.

---

## 7. DERIVATION RULES

### 7.1 Derived, Not Copied

All Stage 2 outputs must be derived from the admitted evidence. No output may be:
- manually copied from a prior run
- carried over from a non-RHP source
- populated with values not recoverable from the admitted evidence

### 7.2 No Manual Enrichment

Stage 2 processes may not introduce human judgement, external knowledge, or domain expertise that supplements the admitted evidence.

Permitted: Applying a defined classification taxonomy to admitted artifact content.
Forbidden: Adding entities, relationships, or dimensions because an analyst believes they should exist based on domain knowledge not present in the evidence.

### 7.3 No External Data Injection

No data source outside the RHP and the Stage 0 evidence root may influence Stage 2 outputs. This includes: external documentation, vendor specifications, public API docs, dependency changelogs, and any artifact not admitted by IG.

### 7.4 Determinism Rule

Same RHP → same Stage 2 outputs.

Given an identical RHP (same `run_id`, same admitted artifact set, same content), Stage 2 must produce identical outputs across runs. Any Stage 2 process that produces different outputs from the same RHP is non-deterministic and its outputs are invalid.

### 7.5 No Stage Collapse

Stage 2 must not absorb responsibilities from adjacent stages:
- Stage 2 does not perform semantic grouping or domain assignment (Stage 3 responsibility)
- Stage 2 does not produce signals or diagnoses (Stage 5 responsibility)
- Stage 2 does not perform GAUGE materialization (Stage 4 responsibility)

### 7.6 Blocking Is Correct

If a structural element cannot be established from the admitted evidence, it must be declared absent or unknown — not invented. A partial structural truth with explicit unknowns is more valid than a complete structural truth with invented content.

---

## 8. OUTPUT CONTRACT (TO STAGE 3)

### 8.1 Authorized Stage 3 Input Surface

Stage 3 (Semantic Computation — 41.x) may consume ONLY the following Stage 2 outputs:

| authorized artifact | path |
|--------------------|------|
| entity_catalog.md | `docs/pios/40.3/entity_catalog.md` |
| dependency_map.md | `docs/pios/40.3/dependency_map.md` |
| interface_map.md | `docs/pios/40.3/interface_map.md` |
| program_execution_graph.md | `docs/pios/40.3/program_execution_graph.md` |
| telemetry_dimension_catalog.md | `docs/pios/40.4/telemetry_dimension_catalog.md` |

### 8.2 What Stage 3 Must Not Consume

| forbidden | reason |
|-----------|--------|
| `evidence_classification_map.md` | Raw classification — Stage 3 consumes reconstructed structure, not classification artifacts |
| `normalized_evidence_map.md` | Raw evidence map — same reason |
| `evidence_surface_inventory.md` | Raw surface inventory — same reason |
| `telemetry_surface_definition.md` | Intermediate surface definition — Stage 3 uses the dimension catalog, not the surface map |
| `telemetry_schema.md` | Schema definition — not a data artifact |
| `reconstruction/` corpus files | Per-entity reconstruction detail — Stage 3 works from the catalogs, not raw reconstruction |
| Any RHP artifact | Stage 3 may not bypass Stage 2 and consume IG outputs directly |
| Any Stage 0 source file | Same reason |

### 8.3 Immutability of Stage 2 Outputs

Stage 2 outputs are immutable once the Stage 2 PASS condition (Section 6) is confirmed.
Stage 3 must not modify any artifact listed in Section 8.1.
Stage 3 produces its own outputs in `docs/pios/41.x/`; it never writes back into `docs/pios/40.x/`.

### 8.4 Stage 3 Pre-Consumption Check

Before Stage 3 begins, it must confirm:

1. All 5 authorized artifacts exist at their defined paths
2. Each artifact is non-empty
3. `entity_catalog.md` contains at least one entity entry
4. `telemetry_dimension_catalog.md` contains at least one dimension entry

If any check fails, Stage 3 must halt with the appropriate rejection code.

---

## 9. REJECTION CONDITIONS

Stage 2 outputs must be rejected and Stage 3 must not begin on any of the following:

| code | condition |
|------|-----------|
| `S2_INPUT_NOT_RHP` | Stage 2 consumed an artifact not authorized by IG.HANDOFF.AUTHORITY.01 |
| `S2_ORPHAN_EVIDENCE` | An admitted artifact in `admissibility_log.json` has no entry in `evidence_classification_map.md` |
| `S2_ORPHAN_ENTITY` | An entity in the reconstruction corpus has no entry in `entity_catalog.md` |
| `S2_ENTITY_NO_EVIDENCE` | An entity in `entity_catalog.md` carries no CEU reference traceable to 40.2 classification |
| `S2_RELATIONSHIP_NO_EVIDENCE` | A dependency in `dependency_map.md` carries no CEU or artifact evidence reference |
| `S2_RELATIONSHIP_UNKNOWN_ENTITY` | A dependency references an entity_id not present in `entity_catalog.md` |
| `S2_INTERFACE_UNKNOWN_ENTITY` | An interface in `interface_map.md` references an entity_id not in `entity_catalog.md` |
| `S2_DIMENSION_NO_STRUCTURE` | A telemetry dimension in `telemetry_dimension_catalog.md` does not trace to an entity in `entity_catalog.md` |
| `S2_SIMULATED_RUNTIME_VALUE` | A RUNTIME or BLOCKED dimension has been assigned a non-null simulated or estimated value |
| `S2_CIRCULAR_UNDECLARED` | A circular dependency exists in `dependency_map.md` without an explicit circular declaration |
| `S2_DUPLICATE_ENTITY` | Two entries in `entity_catalog.md` share the same entity_id |
| `S2_DUPLICATE_DIMENSION` | Two entries in `telemetry_dimension_catalog.md` share the same dimension_id |
| `S2_MAP_MISMATCH` | An entity_id referenced in `telemetry_surface_definition.md` does not exist in `entity_catalog.md` |
| `S2_ARTIFACT_MISSING` | Any of the 11 authoritative Stage 2 artifacts is absent |
| `S2_ARTIFACT_EMPTY` | An authoritative Stage 2 artifact exists but contains no substantive content (empty file or header-only) |
| `S2_TRACEABILITY_BREAK` | The traceability chain (RHP admitted → CEU → entity → surface → dimension) is broken at any point |
| `S2_EXTERNAL_INPUT` | Stage 2 consumed a file not in the RHP or Stage 0 evidence root |
| `S2_NON_DETERMINISTIC` | Stage 2 produced outputs that differ from a prior run on an identical RHP |
| `S2_PEG_NOT_DERIVABLE` | `program_execution_graph.md` contains paths that cannot be reconstructed from `entity_catalog.md`, `dependency_map.md`, and `interface_map.md` |
| `S2_SCHEMA_VIOLATION` | A telemetry metric does not conform to `telemetry_schema.md` (missing required field or invalid field type) |

---

## 10. GOVERNANCE RULES

**G1 — No RHP, No Structural Truth**
Stage 2 may not begin without a valid, sealed RHP that has passed all conditions defined in IG.HANDOFF.AUTHORITY.01.
The RHP is the sole authorized input surface for Stage 2.

**G2 — No Classification, No Reconstruction**
40.3 structural reconstruction may not begin before 40.2 evidence classification is complete.
An entity may not be created in Stage 2 unless it appears in the classification map.
Reconstruction is downstream of classification — not parallel to it.

**G3 — No Evidence Trace, No Entity**
Every structural entity, dependency, and interface must carry at least one traceable reference to a classified evidence unit from 40.2.
An entity that cannot be traced to admitted evidence is not a structural truth — it is an invention.
Inventions are not permitted in Stage 2.

**G4 — No Structure, No Telemetry**
40.4 telemetry surfaces and dimensions may only be declared for entities established in 40.3.
Telemetry extraction cannot introduce structural concepts that reconstruction did not establish.
A dimension without a structural anchor is not a telemetry dimension — it is speculation.

**G5 — Structural Outputs Are Immutable Input to Stage 3**
Once Stage 2 PASS is confirmed, the 5 authorized outputs listed in Section 8.1 are sealed.
Stage 3 reads them; it does not modify them.
No downstream stage may alter `entity_catalog.md`, `dependency_map.md`, `interface_map.md`, `program_execution_graph.md`, or `telemetry_dimension_catalog.md`.
Corrections require a new Stage 2 run.

---

## 11. STAGE BOUNDARY CONFIRMATION

### 11.1 Stage 2 End Condition

Stage 2 ends at: confirmation of SP-01 through SP-12 (Section 6).
Stage 2 output is the 5 authorized artifacts enumerated in Section 8.1.
No artifact outside that set is an authorized handoff to Stage 3.

### 11.2 Stage 3 Start Condition

Stage 3 (Semantic Computation — 41.x) begins at: reading the 5 authorized outputs from Section 8.1.
Stage 3 does not re-classify evidence.
Stage 3 does not re-reconstruct entities.
Stage 3 accepts Stage 2 outputs as sealed structural truth.

### 11.3 What Stage 2 Does Not Do

Stage 2 DOES NOT:

| prohibited activity | owner |
|--------------------|-------|
| Assign domains, capabilities, or semantic groups to entities | Stage 3 (41.x) |
| Produce topology nodes or semantic layer structures | Stage 3 (41.x) |
| Compute signal values or signal presence indicators | Stage 5 (40.5) |
| Produce conditions, diagnoses, or intelligence outputs | Stage 5 (40.6–40.7) |
| Perform GAUGE materialization or package assembly | Stage 4 (PSEE pipeline) |
| Produce binding artifacts (signal-to-structure) | Stage 6 (43.x) |
| Produce overlay projections | Stage 6 (44.x) |

### 11.4 Stage 2 and Stage 5 Relationship

40.4 telemetry dimensions are the interface between Stage 2 and Stage 5.
Stage 5 consumes `telemetry_dimension_catalog.md` to compute signal values.
BLOCKED dimensions in 40.4 are the exact and correct record of what Stage 5 cannot compute until live telemetry becomes available.
Stage 2 must not attempt to resolve BLOCKED status — that is a Stage 5 responsibility gated on live runtime access.

### 11.5 Upstream Boundary

Stage 2 begins at: RHP admissibility confirmation per IG.HANDOFF.AUTHORITY.01 (AC-01 through AC-12).
Stage 2 does not re-run IG ingestion.
Stage 2 does not re-validate the Stage 0 evidence root.
Both upstream contracts (BOOTSTRAP.CHAIN.AUTHORITY.01 and IG.HANDOFF.AUTHORITY.01) must be satisfied before Stage 2 may begin.

---

## Validation at Definition Time

| check | status |
|-------|--------|
| C1 — structural_truth_authority.md exists | PASS |
| C2 — input contract explicit | PASS — Section 2 (6 RHP artifacts, forbidden inputs, no-enrichment rule, input identity binding; upstream chain: BOOTSTRAP + IG) |
| C3 — 40.2 outputs fully defined | PASS — Section 3 (3 artifacts, required structure, classification rules) |
| C4 — 40.3 outputs fully defined | PASS — Section 4 (5 artifacts, required structure, reconstruction rules) |
| C5 — 40.4 outputs fully defined | PASS — Section 5 (3 artifacts, required structure, STATIC/RUNTIME/BLOCKED taxonomy) |
| C6 — structural proof criteria explicit | PASS — Section 6 (SP-01 through SP-12, traceability chain) |
| C7 — derivation rules explicit | PASS — Section 7 (derived-not-copied, no enrichment, no external data, determinism, no stage collapse) |
| C8 — S3 consumption boundary explicit | PASS — Section 8 (5 authorized artifacts, 8 forbidden inputs, immutability, pre-consumption check) |
| C9 — ≥15 rejection conditions listed | PASS — Section 9 (20 named rejection codes) |
| C10 — governance rules present | PASS — Section 10 (G1–G5) |
| C11 — stage boundary confirmation explicit | PASS — Section 11 (end condition, start condition, 7 prohibited activities, S5 relationship, upstream boundary) |
| C12 — no implementation details | PASS — no script names, no runtime commands |
| C13 — no other file modified | PASS |
