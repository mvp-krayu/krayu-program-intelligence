# Architecture Snapshot

**Stream:** PI.PSEE-PIOS.GOVERNED-DPSIG-BASELINE.FREEZE.01 — Task 4  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)

---

## Platform State at Baseline

### Layer Stack

```
┌──────────────────────────────────────────────────────────────────┐
│  PATH B READINESS SURFACE (deferred)                            │
│  PI.AGENTIC-SEMANTIC-ORCHESTRATION.01 — NOT YET STARTED         │
│  Aliasing design complete; implementation not authorized         │
├──────────────────────────────────────────────────────────────────┤
│  EXECUTIVE COGNITIVE PROJECTION (design frozen)                 │
│  ALI-01..ALI-07 aliasing rules                                  │
│  Q-00..Q-04 qualifier taxonomy                                  │
│  17-term terminology normalization table                        │
│  Three-layer projection model (design only — no implementation) │
├──────────────────────────────────────────────────────────────────┤
│  EXECUTIVE READINESS GATE (operational)                         │
│  _classify_dpsig_readiness_state()                              │
│  5 states: EXECUTIVE_READY → BLOCKED_PENDING_DOMAIN_GROUNDING   │
│  False-positive containment: Rules C-01, C-02, C-04            │
│  Severity taxonomy alignment: _render_sev_label                 │
│  FastAPI: DIAGNOSTIC_ONLY / BlueEdge: EXECUTIVE_READY           │
├──────────────────────────────────────────────────────────────────┤
│  DPSIG PROJECTION WEIGHTING (operational)                       │
│  _compute_dpsig_weights() → cluster_salience_score              │
│  render_apex gate: salience >= 1.0                              │
│  FastAPI: salience=1.6245 (apex) → CRITICAL → SUPPRESSED        │
│  BlueEdge: salience=0.0871 (standard) → ELEVATED → SHOWN        │
├──────────────────────────────────────────────────────────────────┤
│  DPSIG RELATIONAL INTELLIGENCE LAYER (operational)              │
│  derive_relational_signals.py (SCRIPT_VERSION=1.0)              │
│  DPSIG-031: Cluster Pressure Index (CPI)                        │
│  DPSIG-032: Cluster Fan Asymmetry (CFA)                         │
│  Class 4 only — Classes 1/2/3/5/6/7/8 deferred                 │
│  Thresholds: CPI_HIGH=5.0, CFA_DOMINANT=0.60                    │
├──────────────────────────────────────────────────────────────────┤
│  SEMANTIC / DOMAIN PROJECTION PRESERVATION (operational)        │
│  semantic_topology_model.json — grounding + confidence          │
│  EXACT/STRONG/PARTIAL/NONE taxonomy                             │
│  BlueEdge: 5 semantic clusters, 5/17 domains grounded           │
│  FastAPI: STRUCTURAL_LABELS_ONLY, inference_prohibition=True    │
├──────────────────────────────────────────────────────────────────┤
│  STRUCTURAL TRUTH LAYER (sovereign — immutable)                 │
│  canonical_topology.json — cluster/domain structure             │
│  binding_envelope.json — pressure zone bindings                 │
│  signal_registry.json — PSIG activations (PSIG-001..006)        │
│  dpsig_signal_set.json — DPSIG derivations                      │
│  vault_manifest.json — artifact provenance                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## What Is Now Baseline

| Component | Status | Location |
|---|---|---|
| DPSIG Class 4 runtime | OPERATIONAL | `scripts/pios/dpsig/derive_relational_signals.py` |
| Projection weighting | OPERATIONAL | `scripts/pios/lens_report_generator.py` (_compute_dpsig_weights) |
| Executive readiness gate | OPERATIONAL | `scripts/pios/lens_report_generator.py` (_classify_dpsig_readiness_state) |
| Severity taxonomy alignment | OPERATIONAL | `scripts/pios/lens_report_generator.py` (_render_sev_label) |
| Pipeline execution manifest | FROZEN | `docs/governance/pipeline_execution_manifest.json` |
| FastAPI E2E validation | CERTIFIED | `artifacts/e2e/fastapi/run_02_oss_fastapi_pipeline/e2e_validation.json` |
| BlueEdge DPSIG signal set | OPERATIONAL | `artifacts/dpsig/blueedge/run_blueedge_productized_01_fixed/dpsig_signal_set.json` |
| BlueEdge projection validation | CERTIFIED | `artifacts/e2e/blueedge/run_blueedge_productized_01_fixed/dpsig_blueedge_projection_validation.json` |
| Cognitive projection stabilization | DESIGN FROZEN | `docs/psee/PI.PSEE-PIOS.EXECUTIVE-COGNITIVE-PROJECTION.STABILIZATION.01/` |
| LENS report contract | COMPLIANT | Reports generate at PSEE flat path; API/routing operational |

---

## What Remains Deferred

| Component | State | Blocker |
|---|---|---|
| Cognitive projection implementation | DESIGN ONLY | Requires explicit IMPLEMENTATION stream |
| DPSIG Class 1/2/3/5/6/7/8 | NOT STARTED | Deferred post-Class 4 stabilization |
| FastAPI domain grounding | NOT STARTED | No domain grounding contract issued |
| BlueEdge full domain grounding (12/17 NONE) | PARTIAL | 5/17 grounded; remainder deferred |
| Dual-client simultaneous E2E validation | NOT RUN | Individual validations complete |
| Path B — Agentic Semantic Orchestration | NOT STARTED | This baseline is the prerequisite |

---

## What Is Forbidden Without New Governance Amendment

| Action | Forbidden Because |
|---|---|
| Modify DPSIG Class 4 thresholds | Requires SCRIPT_VERSION increment + stream contract |
| Add client-specific logic to gate/renderer | Violates client-agnostic governance principle |
| Suppress DPSIG evidence from data layer | Violates evidence-first discipline |
| Bypass readiness gate for any client | Violates CEO false-positive containment |
| Treat 93098cb as current baseline for new streams | Superseded by governed-dpsig-baseline-v1 |
| Implement cognitive projection without IMPLEMENTATION contract | Design-only at this baseline |
| Issue Path B work before PI.AGENTIC-SEMANTIC-ORCHESTRATION.01 | Premature — design prerequisites not yet issued |
| Commit generated HTML reports | Gitignored by design; reproducible on demand |

---

## Path B Readiness State

The platform is **PATH_B_READY** at the design surface:

- Structural truth layer: immutable and replay-safe
- Readiness gate: operational, tested, certified
- Semantic projection layer: grounding-classified, qualifier-tagged
- Executive cognition layer: aliasing + normalization design complete
- Client-agnostic governance: confirmed across FastAPI + BlueEdge

**Path B may proceed to PI.AGENTIC-SEMANTIC-ORCHESTRATION.01.**

The agentic orchestration layer inherits the full stabilized foundation. It operates above the readiness gate and within the cognitive projection model. It does not modify any layer below Layer 3.
