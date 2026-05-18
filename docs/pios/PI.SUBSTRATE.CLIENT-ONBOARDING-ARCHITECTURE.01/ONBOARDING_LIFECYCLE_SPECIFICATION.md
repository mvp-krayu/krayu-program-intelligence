# Client Onboarding Lifecycle Specification

**Stream:** PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01
**Maturity:** SPECIFIED_NOT_IMPLEMENTED (lifecycle model). Individual phases vary — see maturity table.
**Purpose:** 8-phase model from client registration to SQO qualification assessment. Automated vs advisory per phase. S0→S1 and S1→S2+ gate formalization.

---

## 1. Lifecycle Overview

| Phase | Name | Automated? | Duration | Maturity |
|---|---|---|---|---|
| 0 | Client Registration | YES | Minutes | OPERATIONAL (client.yaml + source_manifest.json pattern exists) |
| 1 | Evidence Acquisition | PARTIAL | Hours–days | OPERATIONAL (source_intake.py exists) |
| 2 | PATH A Execution | YES | Minutes | OPERATIONAL (structural_scanner.py + ceu_grounding.py + run_client_pipeline.py) |
| 3 | Semantic Ontology Authoring (CSR) | NO — advisory | Days–weeks | SPECIFIED_NOT_IMPLEMENTED |
| 4 | Semantic Topology Generation (from CSR) | YES — deterministic | Seconds | OPERATIONAL (BlueEdge via build_semantic_layer.py), SPECIFIED_NOT_IMPLEMENTED (generic) |
| 5 | Crosswalk Construction | PARTIAL — auto-proposal + human review | Hours | SPECIFIED_NOT_IMPLEMENTED |
| 6 | Reconciliation Compilation | YES | Seconds | OPERATIONAL (ReconciliationCorrespondenceCompiler.js) |
| 7 | LENS Manifest Registration | YES | Minutes | OPERATIONAL (manifests/index.js + ClientRunManifestSchema.js) |
| 8 | SQO Qualification Assessment | YES | Seconds | OPERATIONAL (SQOCockpitStateResolver.js + 18 qualification engines) |

---

## 2. Phase Details

### Phase 0: Client Registration

**Action:** Create per-client configuration artifacts.

**Artifacts produced:**
- `clients/{client_id}/client.yaml` — client identity, pipeline configuration
- `clients/{client_id}/sources/source_01/source_manifest.json` — source evidence reference

**Automated:** YES — file creation from template.

**Existing pattern:** `clients/blueedge/client.yaml` (10 lines), `clients/blueedge/sources/source_01/source_manifest.json`.

### Phase 1: Evidence Acquisition

**Action:** Acquire and ingest source evidence (codebase archive, repository access, or artifact package).

**Artifacts produced:**
- Source archive or repository clone in `clients/{client_id}/sources/source_01/`
- Intake artifacts via `source_intake.py`

**Partially automated:** Source intake script handles extraction and validation. Evidence acquisition itself depends on client engagement (they provide the source material).

### Phase 2: PATH A Execution

**Action:** Execute structural topology derivation pipeline.

**Steps:**
1. `source_intake.py` — verify/extract source evidence
2. `structural_scanner.py` — produce structural node inventory (40.2), topology log (40.3), canonical topology (40.4)
3. `ceu_grounding.py` — ground structural nodes against CEU registry
4. `run_client_pipeline.py` Phases 1-4 — verify structural artifacts

**Artifacts produced:**
- `structural_node_inventory.json` — all structural nodes
- `structural_topology_log.json` — topology analysis
- `canonical_topology.json` — DOM clusters
- `grounding_state_v3.json` — CEU grounding results

**Automated:** YES — fully deterministic from source evidence.

**Gate:** S0→S1 (see §3).

### Phase 3: Semantic Ontology Authoring (CSR)

**Action:** Advisory team constructs the Client Semantic Registry through governed process.

**Steps:**
1. Evidence review (structural topology as input)
2. DOMAIN identification (human judgment)
3. Capability classification (human judgment)
4. Component mapping (human judgment + structural evidence)
5. Review gate (formal approval)
6. Version and lock

**Artifacts produced:**
- `clients/{client_id}/semantic/client_semantic_registry.json`

**NOT automated:** This is the irreducible human judgment step. Semantic ontology authoring requires domain expertise and cannot be derived from source code structure alone.

**NOT required for S1.** A client at S1 has structural-only projection. CSR is required for S1→S2+ advancement.

### Phase 4: Semantic Topology Generation (from CSR)

**Action:** Deterministically generate `semantic_topology_model.json` from CSR.

**Input:** `client_semantic_registry.json`
**Output:** `semantic_topology_model.json`

**Automated:** YES — deterministic generation from CSR. Same CSR → same topology model.

**Current implementation:** `build_semantic_layer.py` (BlueEdge-specific). Future: parameterized generator reading from CSR.

### Phase 5: Crosswalk Construction

**Action:** Construct DOM↔DOMAIN crosswalk bridge.

**Steps:**
1. Auto-derivation algorithm proposes mappings (see CROSSWALK_AUTO_DERIVATION_SPECIFICATION.md)
2. Irresolvability detection flags potential 1:N DOMs
3. Human review gate accepts/rejects/modifies proposals
4. Final crosswalk assembled

**Artifacts produced:**
- `semantic_continuity_crosswalk.json`

**Partially automated:** Algorithm proposes; human decides. See CROSSWALK_AUTO_DERIVATION_SPECIFICATION.md for full specification.

### Phase 6: Reconciliation Compilation

**Action:** Run reconciliation correspondence compiler.

**Input:** 5 artifacts (crosswalk, semantic topology, canonical topology, signal registry, prior correspondence)
**Output:** `reconciliation_correspondence.v1.json`

**Automated:** YES — fully deterministic. `ReconciliationCorrespondenceCompiler.js` is client-agnostic.

### Phase 7: LENS Manifest Registration

**Action:** Register client/run in LENS manifest system.

**Steps:**
1. Add entry to `REGISTRY` in `manifests/index.js`
2. Create client manifest file (e.g., `{client}.{run_id}.json`)
3. Validate against `ClientRunManifestSchema.js`

**Automated:** YES — one-line registry entry + manifest file creation.

### Phase 8: SQO Qualification Assessment

**Action:** Run SQO state machine to determine qualification state.

**Automated:** YES — `SQOCockpitStateResolver.js` + 18 qualification engines compute S-state from data.

---

## 3. S0→S1 Gate (Commercially Critical)

**S0→S1 represents structural onboarding completion.** PATH A alone can produce a structurally grounded but semantically incomplete LENS projection.

### Gate Requirements

| Requirement | Source | Verification |
|---|---|---|
| Source evidence acquired | Phase 1 output | Source archive/repository exists |
| Structural scan complete | Phase 2 output | `structural_node_inventory.json` exists, node count > 0 |
| CEU grounding complete | Phase 2 output | `grounding_state_v3.json` exists |
| Canonical topology built | Phase 2 output | `canonical_topology.json` exists, DOM count > 0 |
| Pipeline Phases 1-4 PASS | Phase 2 output | `run_client_pipeline.py` reports PASS for structural phases |

### What S1 Delivers

- Structural DOM topology (interactive SVG)
- Structural signals (from DOM-level analysis)
- GAUGE score (from structural coverage)
- Structural zones render (IntelligenceField, StructuralTopologyZone)
- Evidence boundary activation
- Basic SQO cockpit (structural sections)

### What S1 Does NOT Deliver

- Semantic DOMAIN labels
- Crosswalk mapping
- Reconciliation correspondence
- Grounding ratio / Q-class
- Semantic zones (ReconciliationAwarenessZone, SemanticTrustPostureZone)
- Full guided interrogation (semantic-dependent queries)

### CSR is NOT Required for S1

CSR is required for semantic qualification maturity progression (S1→S2+). S1 is the **structural-only** state. FastAPI's current state IS S1.

---

## 4. S1→S2+ Gate

**S1→S2+ represents semantic qualification completion.** Requires CSR + crosswalk + reconciliation.

### Gate Requirements

| Requirement | Source | Verification |
|---|---|---|
| CSR constructed and approved | Phase 3 output | `client_semantic_registry.json` exists, status APPROVED or LOCKED |
| Semantic topology generated | Phase 4 output | `semantic_topology_model.json` exists |
| Crosswalk constructed | Phase 5 output | `semantic_continuity_crosswalk.json` exists |
| Reconciliation compiled | Phase 6 output | `reconciliation_correspondence.v1.json` exists |
| LENS manifest registered | Phase 7 output | Client/run in REGISTRY, manifest file valid |

### S-State Determination (S2+)

S-state is computed from reconciliation data:
- **S2_QUALIFIED_WITH_DEBT:** Reconciliation exists, Q-class ≤ Q-02, debt items registered
- **S2_FULLY_QUALIFIED:** Reconciliation exists, Q-class ≥ Q-03, no critical debt
- **S3:** Full operational maturity (authority not yet issued — see project memory)

---

## 5. SQO 15-Stage Lifecycle Integration

The 8-phase onboarding lifecycle maps to the existing SQO 15-stage lifecycle:

| Onboarding Phase | SQO Lifecycle Stage | Notes |
|---|---|---|
| 0 — Registration | 1 — Client Registration | Direct mapping |
| 1 — Evidence Acquisition | 2 — Evidence Intake | source_intake.py |
| 2 — PATH A Execution | 3 — Structural Analysis, 4 — CEU Grounding, 5 — DOM Compression | Pipeline Phases 1-4 |
| 3 — Semantic Ontology Authoring | 6 — Semantic Domain Construction | NEW advisory stage |
| 4 — Semantic Topology Generation | 7 — Semantic Topology Generation | Deterministic from CSR |
| 5 — Crosswalk Construction | 8 — Crosswalk Bridge, 9 — Irresolvability Detection | Auto-proposal + review |
| 6 — Reconciliation | 10 — Correspondence Compilation, 11 — Confidence Assessment | Automated |
| 7 — LENS Registration | 12 — Manifest Registration, 13 — Payload Validation | Automated |
| 8 — SQO Assessment | 14 — S-State Computation, 15 — Q-Class Determination | Automated |

The 8-phase model is a coarser view. The 15-stage lifecycle provides operational detail within each phase.

---

## 6. Non-Goals

This lifecycle specification does NOT:
- Generalize BlueEdge semantics automatically
- Implement AI semantic discovery
- Attempt automatic semantic ontology discovery from source code
- Remove human governance from ontology construction
- Eliminate advisory qualification
- Define implementation code

---

## GIT_LINEAGE

| Field | Value |
|---|---|
| Created by | PI.SUBSTRATE.CLIENT-ONBOARDING-ARCHITECTURE.01 |
| Derived from | BLUEEDGE_CANONICAL_TRUTH_CERTIFICATION.md (operational chain), SQO_EVOLUTION.md (state machine), run_client_pipeline.py (9-phase orchestrator) |
| Verification date | 2026-05-18 |
| Maturity | SPECIFIED_NOT_IMPLEMENTED (lifecycle model) |
