# Minimum Semantic Envelope Specification

**Stream:** PI.LENS.V2.SEMANTIC-ENVELOPE-AND-PROVENANCE.BASELINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10

This document defines the minimum viable semantic envelope required
before a client/run can qualify for LENS v2 NextGen Executive
Projection. All thresholds are grounded in the real behavior of the
two reference substrates: BlueEdge (LIVE) and FastAPI (REJECTED).

---

## A. Required minimum artifacts

These are the 6 required artifacts declared in
`docs/governance/runtime/client_run_manifest.schema.json`. The generic
resolver (`GenericSemanticPayloadResolver`) will reject the binding
(`REQUIRED_ARTIFACT_MISSING`) if any is absent.

| Artifact ID | What it provides | Where it comes from |
|-------------|-----------------|---------------------|
| `semantic_topology_model` | Domain registry with named domains, types, business labels, lineage status, zone anchors | Semantic bundle production (above 40.4) |
| `decision_validation` | End-to-end semantic surface checks (VF-XX); zone anchor evidence; signal binding evidence | Decision validation step |
| `reproducibility_verdict` | Deterministic replay confirmation; criteria PASS/FAIL | Reproducibility verification step |
| `semantic_continuity_crosswalk` | DOM-XX → COMP-NN → CAP-NN → business label mappings; lineage per entity | Crosswalk production step |
| `canonical_topology_40_4` | Structural cluster assignment, node membership, structural group formation | PATH A 40.4 pipeline step |
| `dpsig_signal_set` | TAXONOMY-01 pressure signals (CPI, CFA); normalization basis; provenance chain | Lane D DPSIG derivation |

**Minimum viability:** all 6 must be present AND loadable (valid JSON,
no traversal in paths). The resolver does not selectively load — it
fails closed on the first missing required artifact.

---

## B. Optional enrichment artifacts

These artifacts enrich the payload but do not block binding:

| Artifact ID | What it provides | Impact when absent |
|-------------|-----------------|-------------------|
| `structural_topology_log_40_3` | Component relationship detail, edge typing | `NON_BLOCKING` gap; narrative summary references structural topology generically |
| `signal_registry` | PSIG signal entries (Lane A sovereign) | `PSIG_REGISTRY_ABSENT`; propagation summary shows 0 PSIG signals |
| `evidence_trace` | Traceability chains from evidence to topology | `NON_BLOCKING`; evidence_trace_chains count = 0 |
| `vault_readiness` | Vault-level readiness assessment | `NON_BLOCKING`; vault readiness unchecked |
| `semantic_bundle_manifest` | Bundle production metadata | `NON_BLOCKING`; bundle provenance unavailable |
| `rendering_metadata` | Q-class, IP status, gaps, disclosure rules | `INFERENCE_PROHIBITION_PLACEHOLDER`; IP actor shows BINDING PENDING instead of ENFORCED |

**Key optional artifact:** `rendering_metadata` is the most impactful
optional artifact. Without it, the IP (Inference Prohibition) actor
remains at `PLACEHOLDER_BINDING_PENDING`, and the executive surface
shows "INFERENCE PROHIBITION: BINDING PENDING". The rendering metadata
writer requires the 3 semantic artifacts (`decision_validation`,
`reproducibility_verdict`, `semantic_continuity_crosswalk`) to run,
so it is only available for clients at S2 or above.

---

## C. Qualification tiers

### CLASS S0: STRUCTURAL_ONLY

**State:** Static reports only.

**Artifacts present:**
- `canonical_topology_40_4` ✓
- `dpsig_signal_set` ✓
- All semantic artifacts: ABSENT

**Runtime behavior:**
- Pipeline-generated HTML reports available via `/api/report-pack`.
- No LENS v2 executive projection.
- No live binding.
- No semantic payload.

**What the executive sees:**
- Static reports (decision surface, narrative brief, evidence brief,
  diagnostic narrative) rendered from the pipeline.
- No interactive executive intelligence surface.

**Example:** A codebase that completed the 40.x pipeline and report
generation but has no semantic processing.

---

### CLASS S1: STRUCTURAL_LABELS_ONLY

**State:** Thin semantic envelope. Structural topology + DPSIG
signals present, but semantic processing incomplete.

**Artifacts present:**
- `canonical_topology_40_4` ✓
- `dpsig_signal_set` ✓
- `semantic_topology_model` ✓ (but `semantic_level: STRUCTURAL_LABELS_ONLY`)
- Other semantic artifacts: ABSENT

**Runtime behavior:**
- Manifest registered.
- Resolver returns `REJECTED` / `REQUIRED_ARTIFACT_MISSING`.
- `/api/lens-payload` returns 424.
- Page route returns 502 / `LIVE_BINDING_FAILED`.
- Report-pack HTML available via 200 (independent of resolver).

**What the executive sees:**
- `LIVE_BINDING_FAILED` page with structured error.
- Static reports still available independently.
- No executive semantic projection.
- No boardroom mode authorization.

**Reference case:** FastAPI `run_02_oss_fastapi_pipeline`.

**Gap analysis:**
| Missing artifact | Why it blocks S2 |
|-----------------|------------------|
| `decision_validation` | No end-to-end semantic check; zone anchor not identified |
| `reproducibility_verdict` | No replay safety confirmation |
| `semantic_continuity_crosswalk` | No structural-to-business label mapping; Q-class cannot determine semantic continuity |

---

### CLASS S2: PARTIAL_GROUNDING_WITH_STRUCTURAL_CONTINUITY

**State:** Executive projection authorized. Partial structural
grounding with validated semantic continuity.

**Artifacts present:** All 6 required artifacts ✓

**Required semantic conditions:**
- `semantic_topology_model.semantic_level` != `STRUCTURAL_LABELS_ONLY`
- `semantic_topology_model.domains` contains at least 1 domain with
  `lineage_status` EXACT or STRONG
- `semantic_continuity_crosswalk` contains at least 1 mapping
- `decision_validation` contains at least 1 check
- `reproducibility_verdict.verdict` is defined

**Q-class:** Q-02 (per Q02_GOVERNANCE_AMENDMENT.md §4 resolution rule):
- `0 < backed_count/total_count < 1.0`
- `semantic_continuity_status = VALIDATED`
- `evidence_availability = AVAILABLE`

**Runtime behavior:**
- Resolver returns `binding_status: LIVE`, `ok: true`.
- 15-actor registry hydrated.
- IP actor: HYDRATED (if `rendering_metadata` emitted) or
  PLACEHOLDER_BINDING_PENDING (if not yet emitted).
- Page renders full executive intelligence surface.
- Q-02 chip visible with contract-mandated language.
- Unresolved gaps disclosed.

**What the executive sees:**
- Full LENS v2 executive intelligence surface.
- "QUALIFIER Q-02 · Partial Grounding · Structural Continuity" chip.
- Advisory confirmation requirement stated.
- Propagation summary with business-readable domain labels.
- Evidence blocks showing origin/pass-through/receiver triad.

**Reference case:** BlueEdge `run_blueedge_productized_01_fixed`.

---

### CLASS S3: FULL_EXECUTIVE_SEMANTIC_CONTINUITY

**State:** Future target class. Full structural grounding +
validated semantic continuity.

**Required semantic conditions:**
- All S2 conditions met.
- `backed_count == total_count` (all domains structurally backed).
- `semantic_continuity_status = VALIDATED`
- `evidence_availability = AVAILABLE`

**Q-class:** Q-01 (FULL_GROUNDING)

**Runtime behavior:**
- Resolver returns `binding_status: LIVE`, Q-01.
- Q-01 chip NOT rendered (no qualification needed).
- Full executive projection without advisory qualifier.
- No unresolved semantic gaps.

**What the executive sees:**
- Full LENS v2 executive intelligence surface.
- No qualifier chip (full grounding needs no qualification).
- Readiness badge alone is sufficient.

**Reference case:** No client has achieved S3 yet. It requires every
semantic domain to be structurally backed — a significantly higher
bar than S2.

---

## D. Failure states

| Failure state | HTTP | Trigger | Visible surface |
|--------------|------|---------|-----------------|
| `REQUIRED_ARTIFACT_MISSING` | 424 (API) / 502 (page) | Required artifact declared in manifest but absent on disk | `LIVE_BINDING_FAILED · REQUIRED_ARTIFACT_MISSING` |
| `MANIFEST_INVALID` | 502 | Manifest fails schema validation | `LIVE_BINDING_FAILED · MANIFEST_INVALID` |
| `MANIFEST_IDENTITY_MISMATCH` | 502 | Manifest `client`/`run_id` does not match registry key | `LIVE_BINDING_FAILED · MANIFEST_IDENTITY_MISMATCH` |
| `CLIENT_RUN_NOT_ALLOWED` | 404 | Pair not in manifest registry | `LIVE_BINDING_FAILED · CLIENT_RUN_NOT_ALLOWED` |
| `INVALID_PARAM` | 400 | Malformed query parameter (traversal, overlength, non-alphanumeric) | `LIVE_BINDING_FAILED · INVALID_PARAM` |
| `STATIC_REPORT_ONLY` | N/A | Client has report-pack HTML but no manifest registration | Reports available via direct path; no LENS v2 surface |
| `SEMANTIC_GATE_NOT_MET` | — | Semantic artifacts exist but `semantic_level = STRUCTURAL_LABELS_ONLY` | Resolver REJECTED (because decision_validation / crosswalk absent) |
| `INSUFFICIENT_GROUNDING` | — | Resolver succeeds but `backed_count = 0` and `semantic_continuity_status != VALIDATED` | Q-04 (UNAVAILABLE) or Q-03 (SEMANTIC_ONLY) |
| `CROSSWALK_ABSENT` | 424/502 | Crosswalk artifact declared but missing | `REQUIRED_ARTIFACT_MISSING` |
| `EXECUTIVE_PROJECTION_NOT_AUTHORIZED` | — | Q-class is Q-04 (UNAVAILABLE); no rendering metadata | Absence notice; no qualifier chip |

All failure states are fail-closed. No fixture fallback. No synthetic
data. No AI generation.

---

## E. Gating rules

### Rule G-01: Manifest registration gate

A client/run must be registered in the manifest registry
(`app/execlens-demo/lib/lens-v2/manifests/index.js`) before any
runtime behavior is authorized. Unregistered pairs receive 404.

### Rule G-02: Required artifact gate

All 6 required artifacts must be present and loadable. The loader
checks them in declaration order and returns REJECTED on the first
failure. There is no partial loading.

### Rule G-03: Q-class resolution gate

The Q-class is resolved deterministically from
`(backed_count, total_count, semantic_continuity_status,
evidence_availability)`. No override is permitted. No manual
Q-class assignment.

### Rule G-04: IP hydration gate

The Inference Prohibition actor is HYDRATED only when
`rendering_metadata.json` is present, valid, and declares
`inference_prohibition_status: ENFORCED`. Otherwise, IP remains at
PLACEHOLDER_BINDING_PENDING.

### Rule G-05: Disclosure gate

For Q-02 and Q-03, the executive surface MUST display the
contract-mandated qualifier language. For Q-04, an explicit absence
notice MUST be rendered. No qualifier chip may be suppressed.

### Rule G-06: No semantic fabrication gate

The system MUST NEVER invent semantic richness. If the crosswalk is
absent, the labels remain structural IDs. If the decision validation
is absent, the resolver rejects the binding. If domains are ungrounded,
they are disclosed as unresolved gaps.

---

## F. Client guidance model

### What clients must provide for S1 → S2 transition

To move from CLASS S1 (structural labels only) to CLASS S2 (partial
grounding with structural continuity), a client must provide source
material that enables the semantic processing pipeline to produce:

1. **Semantic domain assignment with business labels.** The pipeline
   needs enough contextual evidence in the source material to name
   domains beyond structural cluster IDs.

2. **Semantic continuity crosswalk.** The pipeline needs mappings
   from structural identifiers (DOM-XX) to business vocabulary.

**Source material that increases semantic richness:**

| Material type | How it helps |
|--------------|-------------|
| Architecture Decision Records (ADRs) | Provides rationale for structural groupings; enables business-label assignment |
| Component documentation | Maps code modules to business capabilities |
| Ownership mappings | Identifies who owns which components; enables organizational domain typing |
| Capability models | Defines business capabilities served by each structural group |
| Dependency descriptions | Enriches edge typing beyond CONTAINS/IMPORTS |
| Operational runbooks | Maps structural topology to operational workflows |
| API documentation | Provides functional domain vocabulary |
| Organizational vocabulary | Supplies business labels for crosswalk production |
| Delivery narratives | Maps feature areas to structural components |
| Incident material | Reveals which domains carry operational risk |
| PMO artifacts | Maps programs to structural components |
| Jira/issue tracker semantics | Provides project-to-component mappings |
| Confluence/wiki pages | Supplies contextual narrative for domain naming |
| Roadmap structures | Identifies capability evolution trajectories |
| Architecture narratives | Provides system-level vocabulary for domain typing |

**The key insight:** semantic richness is not a system property — it is
a property of the source material. A codebase with no documentation
beyond its package structure will produce structural labels only. A
codebase with rich ADRs, capability models, and ownership mappings will
produce named semantic domains with business labels.

The system never invents richness. It extracts, contextualizes,
validates, and projects richness that already exists in the source
material.

### What clients need for S2 → S3 transition

S3 requires ALL semantic domains to be structurally backed
(`backed_count == total_count`). This means every semantic domain
must have a verified structural correspondence.

To achieve this, the client's source material must be rich enough for
the grounding pipeline to establish EXACT or STRONG lineage for every
domain. This typically requires:

- Complete dependency graph coverage (no orphan modules).
- Clear architectural boundaries (each module belongs to exactly one
  business capability).
- Verified component-to-capability mappings across the entire
  codebase.
- No "synthetic" domains that exist only as semantic projections
  without structural backing.

S3 is a significantly higher bar than S2. Most enterprise codebases
will initially qualify as S2 (partial grounding) because some semantic
domains will be derived from organizational knowledge rather than
direct structural correspondence.

---

## Governance rule

The system must never invent semantic richness.

If semantic continuity is insufficient, projection authorization
degrades gracefully:

```
S3 → S2 → S1 → S0

Full grounding    → Partial grounding    → Structural labels only → Static reports only
Q-01              → Q-02                 → REJECTED (no binding)  → No registration
No qualifier chip → Qualifier chip shown → LIVE_BINDING_FAILED    → Pipeline reports only
```

There is no upgrade path that bypasses the semantic processing
pipeline. There is no manual override that forces a Q-class. There is
no admin flag that promotes S1 to S2.

The only way to increase semantic richness is to provide richer source
material and re-run the semantic processing pipeline.
