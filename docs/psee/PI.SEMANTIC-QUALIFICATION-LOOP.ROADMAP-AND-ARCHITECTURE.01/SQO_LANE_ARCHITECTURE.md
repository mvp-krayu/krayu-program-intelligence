# SQO Lane Architecture

**Stream:** PI.SEMANTIC-QUALIFICATION-LOOP.ROADMAP-AND-ARCHITECTURE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

---

## 1. Lane model

### Lane A: Deterministic Structural Substrate

**Status:** OPERATIONAL (frozen at governed-dpsig-baseline-v1)

**Produces:**
- Canonical topology (40.4)
- Structural topology log (40.3)
- Condition correlation / pressure zones (75.x)
- Signal projection (41.x)
- Signal registry (vault)
- Evidence trace (vault)
- Binding envelope (READ ONLY)
- CEU grounding state
- HTML reports

**Governance:** Protected artifacts are immutable. Thresholds locked. Execution order frozen. Mutation requires explicit Lane A contract.

**SQO interaction:** READ ONLY. SQO reads Lane A outputs. SQO never writes to Lane A artifacts.

---

### Lane D: DPSIG Semantic Contextualization

**Status:** GOVERNED_DESIGN (Class 4 operational; Classes 1-8 deferred)

**Produces:**
- dpsig_signal_set.json (TAXONOMY-01 replay-safe)
- CPI (Cluster Pressure Index) per cluster
- CFA (Cluster Fan Asymmetry) per cluster
- Normalization basis
- Derivation context (hashes, provenance)
- Provenance chain

**Governance:** Writes exclusively to `artifacts/dpsig/`. Never writes to `vault/signal_registry.json`. TAXONOMY-01 fields immutable once derived.

**SQO interaction:** READ ONLY. SQO reads DPSIG outputs for signal contextualization. SQO never modifies DPSIG derivation.

---

### PATH B: Projection / Runtime Cognition

**Status:** OPERATIONAL (via LENS v2 flagship surface)

**Produces:**
- Canonical semantic payload (lens_semantic_payload schema)
- 15-actor hydration registry
- Q-class resolution
- Rendering metadata (vault artifact)
- Executive projection surface

**Governance:** Governed by Q02_GOVERNANCE_AMENDMENT.md. Manifest-driven, client-agnostic. No semantic fabrication.

**SQO interaction:** SQO is an UPSTREAM ADVISOR to PATH B. SQO advises on semantic readiness. PATH B decides on projection authorization. SQO never directly modifies PATH B runtime behavior.

---

### SQO Lane: Semantic Qualification Operations (NEW)

**Status:** PROPOSED (this document establishes the architecture)

**Purpose:** Govern the progressive semantic maturation of client substrates from S0 through S3+.

**Produces:**
- Qualification state assessments
- Semantic maturity scores
- Enrichment recommendations
- Semantic debt inventories
- Continuity gap analyses
- Upload guidance
- Qualification progression history
- Governance disclosures

**Governance:** CREATE_ONLY + ADDITIVE_ONLY. No mutation of any existing lane.

---

## 2. SQO boundary contract

### SQO MAY:

| Capability | Description | Governance constraint |
|-----------|-------------|----------------------|
| Enrich | Add semantic annotations, business labels, domain descriptions | Additive only; never overwrite existing labels |
| Annotate | Attach qualification metadata to existing artifacts | Separate annotation layer; never modify source artifact |
| Qualify | Assess and record semantic qualification state | Deterministic from artifact evidence |
| Contextualize | Map structural identifiers to business vocabulary | Requires evidence linkage; no AI generation |
| Recommend | Suggest enrichment actions to improve qualification | Advisory only; never auto-execute |
| Gate | Determine projection authorization based on qualification | Implements existing gating rules; no new gates without governance stream |
| Disclose | Surface qualification state, gaps, and limitations | Mandatory; never suppress |
| Stabilize | Ensure semantic assertions survive replay | Replay-safe persistence; deterministic |

### SQO MUST NEVER:

| Prohibition | Reason |
|------------|--------|
| Mutate Lane A truth | Lane A is frozen. Protected artifacts are immutable. |
| Modify certified replay artifacts | TAXONOMY-01 fields are immutable once derived. |
| Alter deterministic topology outputs | Canonical topology is the structural ground truth. |
| Modify authoritative evidence chains | Evidence trace, vault readiness are Lane A sovereign. |
| Invent semantic assertions | AXIOM-01: no semantic invention. |
| Generate business labels without evidence | AXIOM-02: semantic qualification must remain evidence-linked. |
| Override Q-class resolution | Q-class is a deterministic pure function. No manual override. |
| Bypass projection gating | AXIOM-05: projection authorization must be governance-disclosed. |
| Create synthetic grounding | Grounding is a structural property, not a semantic annotation. |
| Mutate binding_envelope.json | READ ONLY for all consumers (IRC-05). |
| Write to vault/signal_registry.json | PSIG sovereign (IRC-03). |

---

## 3. SQO artifact topology

```
SQO outputs live under a separate artifact namespace:

artifacts/sqo/<client>/<run_id>/
├── qualification_state.json        # Current S-state + evidence
├── qualification_history.json      # Progression log
├── semantic_debt_inventory.json    # Unresolved gaps + remediation paths
├── enrichment_recommendations.json # Suggested actions
├── continuity_assessment.json      # Crosswalk gap analysis
├── maturity_score.json             # Composite semantic maturity metric
└── governance_disclosure.json      # What the executive must know
```

**Path convention:** `artifacts/sqo/` is a NEW namespace, parallel to `artifacts/dpsig/`. No overlap with existing paths.

**Persistence rules:**
- All SQO artifacts are additive-only (new versions append; old versions retained).
- All SQO artifacts are replay-safe (same input → same output).
- All SQO artifacts carry provenance linkage to the source evidence.
- No SQO artifact may reference data not traceable to Lane A, Lane D, or the semantic processing pipeline.

---

## 4. Lane interaction model

```
Lane A (structural)  ──read──→  SQO (qualification)
Lane D (DPSIG)       ──read──→  SQO (qualification)
Semantic pipeline    ──read──→  SQO (qualification)
                                    │
                                    │ advise
                                    ▼
                               PATH B (projection)
                                    │
                                    │ render
                                    ▼
                            Executive surface
```

**Data flow rules:**
1. SQO reads Lane A, Lane D, and semantic pipeline outputs.
2. SQO produces qualification assessments.
3. SQO advises PATH B on projection readiness.
4. PATH B makes the final projection authorization decision.
5. PATH B renders the executive surface with SQO-sourced disclosures.

**No reverse flow.** PATH B never writes to SQO. SQO never writes to Lane A or Lane D. The data flow is strictly directional.

---

## 5. Lane A preservation guarantees

| Guarantee | Mechanism |
|-----------|-----------|
| No structural mutation | SQO writes only to `artifacts/sqo/`; never to `clients/*/structure/` |
| No DPSIG mutation | SQO reads `artifacts/dpsig/`; never writes to it |
| No pipeline rerun | SQO does not invoke pipeline scripts |
| No binding mutation | SQO never writes to `binding_envelope.json` |
| No threshold mutation | SQO has no access to 75.x threshold values |
| No signal mutation | SQO never writes to `vault/signal_registry.json` |
| No topology mutation | SQO reads canonical topology; never modifies it |

These guarantees are hard constraints, not guidelines. Violation of any guarantee invalidates the SQO stream.
