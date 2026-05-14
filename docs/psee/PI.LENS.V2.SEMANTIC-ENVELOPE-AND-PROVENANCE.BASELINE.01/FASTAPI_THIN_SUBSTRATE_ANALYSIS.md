# FastAPI Thin Substrate Analysis

**Stream:** PI.LENS.V2.SEMANTIC-ENVELOPE-AND-PROVENANCE.BASELINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

This document establishes FastAPI `run_02_oss_fastapi_pipeline` as the
canonical thin-substrate reference case. It explains precisely why the
FastAPI substrate did not achieve semantic stabilization, without
characterizing that as a deficiency of FastAPI itself. FastAPI served
exactly the role it was designed for: a control fixture proving that the
system fails closed on thin substrates.

---

## 1. What FastAPI has

FastAPI completed the full PATH A structural pipeline:

| Artifact | Present | Content |
|----------|---------|---------|
| `structure/40.4/canonical_topology.json` | YES | 123 structural nodes, 19 clusters |
| `structure/40.3/structural_topology_log.json` | YES | Component relationships |
| `semantic/topology/semantic_topology_model.json` | YES | 9 domains, `STRUCTURAL_LABELS_ONLY` |
| `semantic/semantic_bundle_manifest.json` | YES | Bundle production metadata |
| `artifacts/dpsig/fastapi/run_02_oss_fastapi_pipeline/dpsig_signal_set.json` | YES | TAXONOMY-01 CPI + CFA signals |
| `vault/signal_registry.json` | YES | PSIG signal entries |
| `vault/evidence_trace.json` | YES | Traceability chains |
| `vault/vault_readiness.json` | YES | Vault readiness assessment |
| `vault/canonical_topology.json` | YES | Vault copy of canonical topology |
| `binding/binding_envelope.json` | YES | Graph model: 29 nodes, 25 edges |
| `ceu/grounding_state_v3.json` | YES | CEU grounding: 9/10 grounded (0.90 ratio) |
| `reports/*.html` | YES | 4 HTML report files + 4 publish variants |

FastAPI has more raw structural data than many enterprise codebases.
Its PATH A pipeline executed cleanly. Its DPSIG signals are valid.
Its reports were generated successfully.

---

## 2. What FastAPI lacks

Three semantic processing artifacts are absent:

| Missing artifact | Purpose | Why absent |
|-----------------|---------|------------|
| `semantic/decision/decision_validation.json` | End-to-end semantic surface checks (VF-01..VF-14); zone anchor evidence | The decision validation step requires a semantically enriched topology with named domains and business labels. FastAPI's topology at `STRUCTURAL_LABELS_ONLY` does not carry enough semantic content for the validation checks to execute meaningfully. |
| `semantic/report_inputs/reproducibility_verdict.json` | Deterministic replay confirmation; structural/decision match | The reproducibility verdict requires decision_validation as an input. Without decision validation, the verdict cannot confirm decision_match. |
| `semantic/crosswalk/semantic_continuity_crosswalk.json` | DOM-XX → COMP-NN → CAP-NN → business label mappings | The crosswalk requires business vocabulary derived from source material. FastAPI's Python source produces clean code structure but minimal organizational vocabulary — no ADRs, no capability models, no ownership mappings in the analyzed scope. |

---

## 3. Why structural labels alone are insufficient

FastAPI's semantic topology model declares `semantic_level: STRUCTURAL_LABELS_ONLY`. This means:

**What is present:**
- 9 domains with identifiers `DOM-01` through `DOM-09`.
- 19 clusters with identifiers `CLU-01` through `CLU-19`.
- `inference_prohibition: true` on every domain.
- No edges between domains.

**What is absent:**
- No business labels (all domains are ID-only).
- No domain types (no FUNCTIONAL / INFRASTRUCTURE / OPERATIONAL typing).
- No zone anchors (all `zone_anchor: false`).
- No lineage status better than NONE (all domains ungrounded).
- No semantic edges connecting domains.

The gap is not in the structural data — it is in the semantic
translation layer. Structural labels tell the resolver "there are 9
groups of code." Business labels tell the resolver "group 3 is
Fleet Operations and group 7 is Platform Infrastructure." Without
business labels:

1. **The resolver cannot build a business-readable semantic domain
   registry.** The executive sees `DOM-01`, `DOM-02`, etc.

2. **The resolver cannot identify a zone anchor.** Without a zone
   anchor, the propagation narrative has no focal point.

3. **The resolver cannot establish lineage.** Without lineage, the
   Q-class resolver sees `backed_count = 0` → Q-03 or Q-04.

4. **The crosswalk cannot be produced.** Without business vocabulary
   in the source material, there is nothing to map structural IDs to.

---

## 4. The CEU paradox

FastAPI has a CEU grounding ratio of 0.90 (9/10 grounded) — higher
than BlueEdge's domain-level grounding ratio of 4/17.

This is not contradictory. CEU grounding and semantic domain grounding
measure different things:

- **CEU grounding** measures whether structural components have been
  linked to the canonical topology (an L1 structural measure). FastAPI's
  clean code structure produces high CEU grounding because its modules
  map clearly to structural nodes.

- **Semantic domain grounding** measures whether semantic domains
  (business-level abstractions above the structural topology) have
  verified structural correspondence (an L4 semantic measure). FastAPI
  has 0 grounded semantic domains because the semantic processing
  pipeline did not produce domain-level lineage.

High CEU grounding proves: "the structural data is clean."
Low semantic grounding proves: "the semantic translation has not
been performed."

The system correctly treats these as independent dimensions. A
codebase can have perfect structural integrity and zero semantic
richness. Semantic richness requires semantic processing, which
requires richer source material.

---

## 5. What would move FastAPI from S1 → S2

To move FastAPI from CLASS S1 (STRUCTURAL_LABELS_ONLY) to CLASS S2
(PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY), the following minimum
additions are needed:

### Step 1: Enrich the semantic topology

The semantic bundle producer must run with enough source context to:
- Assign business labels to at least some clusters (e.g., "Routing
  Layer", "Dependency Injection", "Schema Validation").
- Assign domain types (e.g., FUNCTIONAL for routing, INFRASTRUCTURE
  for injection).
- Establish at least 1 domain with lineage_status EXACT or STRONG.

**Source material needed:** FastAPI's own documentation (`docs/`,
README, docstrings) could provide business vocabulary. Architecture
documentation or ADRs would provide richer domain naming.

### Step 2: Produce the crosswalk

Once business labels exist in the semantic topology, the crosswalk
producer can map:
- `DOM-01` → `COMP-01` → `CAP-01` → "Routing Layer"
- `DOM-02` → `COMP-02` → `CAP-02` → "Dependency Injection"
- etc.

The crosswalk requires at least 1 mapping for
`semantic_continuity_status = VALIDATED`.

### Step 3: Run decision validation

With a semantically enriched topology, the decision validation step
can execute its checks (VF-01..VF-14). At minimum:
- VF-05 (zone anchor identification) requires at least 1 zone anchor.
- VF-01 (score/band derivation) requires the topology to be scored.

### Step 4: Produce reproducibility verdict

With decision validation in place, the reproducibility verdict can
confirm deterministic replay.

### Step 5: Emit rendering_metadata

With all 3 semantic artifacts present, the rendering_metadata writer
can run:
```
REPO_ROOT=$(pwd) node scripts/pios/.../emit_rendering_metadata.js \
  --client fastapi --run run_02_oss_fastapi_pipeline
```

The writer will resolve the Q-class from the enriched topology and
emit the vault artifact.

### Step 6: Verify

```
curl http://localhost:3002/lens-v2-flagship?client=fastapi&run=run_02_oss_fastapi_pipeline
```

If S2 conditions are met, the resolver returns LIVE with Q-02.
No code changes needed — the manifest is already registered.

---

## 6. Why this is a feature, not a bug

FastAPI's thin substrate status proves three critical properties:

1. **The system does not fabricate richness.** FastAPI has structural
   data, DPSIG signals, and CEU grounding. If the system were willing
   to fabricate, it could generate synthetic business labels, produce
   an artificial crosswalk, and emit a Q-02 rendering. It does not.

2. **The fail-closed behavior is honest.** The API returns 424 with
   `REQUIRED_ARTIFACT_MISSING`. The page returns 502 with structured
   error. No fixture fallback. No synthetic data.

3. **The configuration-only onboarding path works end-to-end.**
   FastAPI was onboarded with 1 manifest JSON + 1 registry line.
   No UI changes. No resolver changes. No API changes. The system
   correctly evaluates the substrate and fails closed on the semantic
   gap.

FastAPI is not "failing." It is correctly classified as S1 — a
structurally sound codebase that has not yet been through semantic
enrichment. When its source material is enriched and the semantic
pipeline re-runs, the system will automatically recognize the richer
substrate and produce a LIVE binding. No code changes required.

---

## 7. Canonical reference status

FastAPI `run_02_oss_fastapi_pipeline` is the canonical thin-substrate
reference for:

- **Testing:** The `fastapi-onboarding.test.js` suite (34 tests)
  validates fail-closed behavior against this substrate.
- **Regression:** Any resolver change must preserve REJECTED behavior
  for substrates with missing required artifacts.
- **Documentation:** This analysis is the canonical explanation of
  what S1 means and why it is insufficient for executive projection.
- **Onboarding model:** FastAPI proves that onboarding is bounded
  to manifest + registry. The semantic gap is a property of the
  substrate, not the runtime.
