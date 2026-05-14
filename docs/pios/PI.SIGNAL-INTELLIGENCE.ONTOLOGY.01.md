# PI.SIGNAL-INTELLIGENCE.ONTOLOGY.01
## Signal Intelligence Ontology — Construct Ownership and Lifecycle Registry

**Stream:** PI.SIGNAL-INTELLIGENCE.ONTOLOGY.01
**Contracts:** PI.SECOND-CLIENT.SIGNAL-OWNERSHIP.FORENSICS.01 (FORENSICS_ONLY); PI.SIGNAL-INTELLIGENCE.ONTOLOGY.PERSISTENCE.02 (PERSISTENCE_UPDATE)
**Date:** 2026-04-25
**Branch:** work/psee-runtime
**Scope:** Second-client signal and intelligence construct ownership, lifecycle placement, and CKR integration

---

## Status

COMPLETE — Forensic investigation complete. CKR integrated and resolved via contract-provided governance documents. Persisted via PI.SIGNAL-INTELLIGENCE.ONTOLOGY.PERSISTENCE.02.

---

## CKR — Canonical Construct Authority

CKR (Canonical Knowledge Registry) is the authoritative ontology of the Program Intelligence discipline. All signal, condition, diagnosis, and intelligence constructs are defined at CKR level.

Streams 40.x and 41.x implement and operate on CKR-defined constructs. No stream may redefine CKR constructs locally. Streams may apply or explain concepts for contextual purposes, but conceptual authority remains with the canonical source recorded in the CKR.

**CKR source:** External to current repository working set. Provided via controlled contract context (PI.SIGNAL-INTELLIGENCE.ONTOLOGY.PERSISTENCE.02 inline governance documents: canonical_knowledge_registry.md, governance_master_capsule.md, governance_operating_model.md).

### CKR Pipeline Mapping

| CKR Entry | Construct Name | Pipeline Layer | Implementation Stream |
|-----------|---------------|----------------|-----------------------|
| CKR-004 | Execution Telemetry | L1 Ingestion | 40.4 |
| CKR-005 | Execution Signals | L2 Signal Derivation | 40.5 |
| CKR-006 | Coordination Pressure (CKR-005) | L2 | 40.5 |
| CKR-007 | Dependency Load (CKR-005) | L2 | 40.5 |
| CKR-008 | Change Concentration (CKR-005) | L2 | 40.5 |
| CKR-009 | Structural Volatility (CKR-005) | L2 | 40.5 |
| CKR-010 | Execution Throughput (CKR-005) | L2 | 40.5 |
| CKR-011 | Execution Stability (CKR-005) | L2 | 40.5 |
| CKR-012 | Program Conditions | L2/L3 | 40.6 |
| CKR-013 | Program Diagnosis | L3 | 40.7 |
| CKR-014 | Execution Stability Index (ESI) | L3 | 40.16 |
| CKR-015 | Risk Acceleration Gradient | L3 | 40.16 |
| CKR-016 | Risk Momentum Gradient | L3 | 40.16 |

### CKR Architecture Mapping

| CKR Entry | Architecture Construct | Stream |
|-----------|----------------------|--------|
| CKR-026 | Signal Computation Engine | 40.5 |
| CKR-027 | Condition and Diagnosis Activation Layer | 40.6 |
| CKR-028 | Intelligence Synthesis Layer | 40.7 |

### Layer Authority Rule

```
CKR    — defines WHAT the construct is (ontological authority)
40.x   — defines HOW it is computed (implementation authority)
41.x   — defines HOW it is exposed, packaged, and projected (semantic authority)
```

No layer may override a higher layer's authority. CKR authority overrides both 40.x and 41.x. 40.x authority overrides 41.x for computation claims.

### CKR Resolution

CKR registry has been located and validated via provided governance documents.

All signal and intelligence constructs referenced in 40.5 / 40.6 / 40.7 are governed by CKR entries:

- CKR-005 — Execution Signals (parent construct)
- CKR-006 — Coordination Pressure (signal definition)
- CKR-007 — Dependency Load (signal definition)
- CKR-008 — Change Concentration (signal definition)
- CKR-009 — Structural Volatility (signal definition)
- CKR-010 — Execution Throughput (signal definition)
- CKR-011 — Execution Stability (signal definition)
- CKR-012 — Program Conditions (condition evaluation)
- CKR-013 — Program Diagnosis (diagnosis synthesis)
- CKR-014 — Execution Stability Index / ESI
- CKR-015 — Risk Acceleration Gradient
- CKR-016 — Risk Momentum Gradient

**CKR STATUS: LOCATED** (via contract-provided governance documents)

---

## 1. Forensic Inventory

### Construct Classes Under Investigation

| Construct Class | Instances Found | Source Namespace |
|----------------|-----------------|-----------------|
| SIG-XXX (raw, 40.5) | SIG-001..008 | `scripts/pios/40.5/build_signal_artifacts.py`; `docs/pios/40.5/signal_computation_specification.md` |
| SIG-XXX (intelligence, package) | SIG-001..005 | 41.4 — `signal_registry.json` in CANONICAL_PKG_DIR |
| COND-XXX | COND-001..008 | 40.6 — `docs/pios/40.6/condition_output_set.md` |
| DIAG-XXX | DIAG-006 confirmed | 40.7 — `docs/pios/40.7/intelligence_output_set.md` |
| INTEL-XXX | INTEL-001, INTEL-002 | 40.7 — `docs/pios/40.7/intelligence_output_set.md` |
| ESI (CKR-014) | PES-ESI-01..05 composite | 40.16 — `docs/pios/40.16/esi_derivation_specification.md` |
| RAG (CKR-015) | rate + accel + cross | 40.16 — `docs/pios/40.16/rag_derivation_specification.md` |
| Claims (CLM-XX) | CLM-20..24 (second-client vault) | 41.2 PIE vault |
| graph_state | `graph_state.json` | Phase 4 — `export_graph_state.mjs` |
| tier1 reports | EXEC + LENS HTML | Phase 5 — `lens_report_generator.py` |
| tier2 reports | DIAGNOSTIC HTML | Phase 5 — `lens_report_generator.py` Tier-2 path |
| SSZ/SSI | Provisional structural signals | 43.x — `docs/pios/43.1/signal_to_structure_binding.md` |

### Two Distinct SIG-XXX Namespaces

**NAMESPACE A — 40.5 raw signals (CKR-005 implementation layer):**

SIG-001 = Coordination Pressure (CKR-006) — Backend Service Memory Usage in BlueEdge runtime
SIG-002 = Dependency Load (CKR-007) — static structural telemetry inputs: ST-007, ST-010, ST-012..015
SIG-003 = Change Concentration (CKR-008) — activity telemetry: AT-001..003 (commit event counts)
SIG-004 = Structural Volatility (CKR-009) — static structural inputs: ST-006, ST-007, ST-009..011, ST-022
SIG-005 = Execution Throughput (CKR-010) — Prometheus runtime metrics
SIG-006 [APPLICATION-DOMAIN] = Sensor Bridge Batch Throughput Rate (BlueEdge-specific) — hasi_bridge.py DEFAULT_CONFIG static value = 0.333 rec/sec; COMPLETE for BlueEdge run_01_blueedge; NOT a CKR-011 computation
SIG-006 [DELIVERY-DOMAIN / CKR-011] = Execution Stability — BLOCKED for all clients; requires AT-007, AT-009, DT-007, DT-008 (event-based delivery telemetry); never computed for any client
SIG-007 = ESI (CKR-014) — 40.16 stream; temporal composite
SIG-008 = RAG (CKR-015) — 40.16 stream; requires ≥2 temporal windows

Evidence: `scripts/pios/40.5/build_signal_artifacts.py` GOVERNED_SIGNALS table; `docs/pios/40.5/signal_computation_specification.md`

**NAMESPACE B — 41.4 intelligence signals (package / signal_registry.json):**

SIG-001 = Sensor Bridge Throughput Ceiling — trace: `40.5-SIG-006 → 40.6-COND-006 → 40.7-DIAG-006 → 40.7-INTEL-001 → 41.1 → 41.4`
SIG-002 = Dependency Load Concentration (CKR-007) — trace: `40.5-SIG-002(static) → 40.6 → 40.7 → 41.x`
SIG-003 = Change Concentration Index (CKR-008) — trace: `40.5-SIG-003 → 40.6 → 40.7 → 41.x`
SIG-004 = Structural Volatility Index (CKR-009) — trace: `40.5-SIG-004(static) → 40.6 → 40.7 → 41.x`
SIG-005 = Execution Throughput Deficit (CKR-010) — trace: `40.5-SIG-005 → 40.6 → 40.7 → 41.x`

All 5 package signals: `runtime_required: false`; `generated_from: 40.5/40.6/40.7/41.1/41.2/41.3`

Evidence: `clients/blueedge/.../package/signal_registry.json`; `docs/pios/41.4/evidence_mapping_index.json`; `docs/pios/41.4/executive_signal_report.md`

---

## 2. Classification Matrix

| Construct | CKR Ref | Derivation Type | Runtime Required | Static Computable (Second-Client) | Hardcoded BlueEdge | Canonical Rule |
|-----------|---------|----------------|-----------------|----------------------------------|--------------------|-|
| 40.5 SIG-001 (Coordination Pressure) | CKR-006 | MIXED | YES (AT-005/AT-007) | PARTIAL | NO — generic | CKR-006 / Stream 70 |
| 40.5 SIG-002 (Dependency Load) | CKR-007 | STATIC | NO | YES — ST-007/010/012..015 | NO | CKR-007 / Stream 70 |
| 40.5 SIG-003 (Change Concentration) | CKR-008 | ACTIVITY | PARTIAL | PARTIAL — git commit counts | NO | CKR-008 / Stream 70 |
| 40.5 SIG-004 (Structural Volatility) | CKR-009 | STATIC | NO | YES — ST-006/007/009..011/022 | NO | CKR-009 / Stream 70 |
| 40.5 SIG-005 (Execution Throughput) | CKR-010 | RUNTIME | YES | NO | NO | CKR-010 / Stream 70 |
| 40.5 SIG-006 APPLICATION-DOMAIN (Sensor Bridge Throughput) | — (no CKR; BlueEdge-specific) | STATIC_BLUEEDGE_SPECIFIC | NO | BLOCKED_MISSING_STATIC_EQUIVALENT — no FastAPI hasi_bridge equivalent | YES — hasi_bridge.py specific | None — BlueEdge-specific |
| 40.5 SIG-006 DELIVERY-DOMAIN (Execution Stability) | CKR-011 | BLOCKED_RUNTIME | YES (AT-007/AT-009/DT-007/DT-008) | BLOCKED_RUNTIME | NO | CKR-011 / Stream 70 |
| 40.5 SIG-007 (ESI) | CKR-014 | TEMPORAL COMPOSITE | YES | NO | NO | CKR-014 / Stream 80 / 40.16 spec |
| 40.5 SIG-008 (RAG) | CKR-015 | TEMPORAL COMPOSITE | YES (≥2 windows) | NO | NO | CKR-015 / Stream 75 / 40.16 spec |
| COND-001..005 | CKR-012 | Runtime-gated | YES | NO | NO | CKR-012 / 40.6 / 75.x |
| COND-006 | CKR-012 | Static-gated | NO | YES — COMPLETE from SIG-006 | NO | CKR-012 / 40.6 |
| COND-007, COND-008 | CKR-012 | Runtime-gated | YES | NO | NO | CKR-012 / 40.6 |
| INTEL-001 | CKR-013 | COMPUTED | NO | DERIVABLE — from COND-006 chain | NO | CKR-013 / 40.7 |
| INTEL-002 | CKR-013 | DECLARATION | NO | YES — unknown-space declaration | NO | CKR-013 / 40.7 |
| DIAG-006 | CKR-013 | COMPUTED | NO | DERIVABLE — from COND-006 / INTEL-001 | NO | CKR-013 / 40.7 |
| ESI (40.16) | CKR-014 | TEMPORAL COMPOSITE | YES | NO | NO | CKR-014 / Stream 80 |
| RAG (40.16) | CKR-015 | TEMPORAL COMPOSITE | YES (≥2 windows) | NO | NO | CKR-015 / Stream 75 |
| CLM-20..24 (vault) | — | SIGNAL-TYPE CLAIMS | — | BLOCKED | NO (reference SIG-001..004) | 41.2 PIE vault |
| graph_state.json | — | DERIVED | — | BLOCKED pending vault | NO | Phase 4 |
| SSZ/SSI | — | PROVISIONAL | — | NOT ADMITTED | NO | NOT ADMITTED — `canonical_admission_rule.md` |
| 41.4 SIG-001..005 (package) | CKR-005 (elevated) | SEMANTIC ELEVATION | NO | BLOCKED (source chain not run) | 41.4/build_signals.py BlueEdge-specific | 41.4 spec |

---

## 3. Stage Ownership Model

**Layer authority is fixed. CKR is the construct authority layer above all implementation layers.**

```
CKR (construct authority — above all layers)
 ├── 40.x = implementation layers of CKR constructs
 └── 41.x = semantic elevation / packaging / projection of 40.x outputs
```

| Stage | Stream | CKR Reference | Role | Owns |
|-------|--------|--------------|------|------|
| 40.2 | Evidence Extraction | CKR-003 (Execution Evidence) | Evidence acquisition | Raw file/repo artifacts |
| 40.3 | Reconstruction | CKR-018/019/020 | Code graph reconstruction | Nodes, edges, module structure |
| 40.4 | Telemetry Build | CKR-004/025 | Structural telemetry | ST-XXX (static), AT-XXX (activity) |
| 40.5 | Signal Derivation | CKR-005/026 (CKR-006..011) | Signal computation | SIG-001..008 (raw); governed by CKR-006..011 |
| 40.6 | Condition Evaluation | CKR-012/027 | Threshold gating | COND-001..008; governed by 75.x |
| 40.7 | Intelligence / Diagnosis | CKR-013/028 | Pattern recognition + declarations | DIAG-XXX, INTEL-XXX |
| 40.16 | ESI/RAG Derivation | CKR-014/015/016 | Composite temporal signals | ESI (PES-01..05), RAG (rate+accel+cross) |
| 41.1 | Domain Model | — | Semantic domain structure | Domain anchors, semantic layer |
| 41.2 | PIE Vault | — | Claim materialization | CLM-XXX, vault_export, `lens_admissible` gating |
| 41.3 | Link Normalization | — | Evidence linkage | Normalized trace links |
| 41.4 | Signal Selection | CKR-005 (elevation) | Intelligence signal packaging | Package SIG-001..005; `signal_registry.json` |
| 43.x | Binding Layer | — | Signal-to-structure projection | SSZ/SSI (PROVISIONAL NOT ADMITTED) |
| Phase 4 | Graph Export | — | Graph state construction | `graph_state.json` |
| Phase 5 | Report Generation | — | Product output | EXEC, LENS, DIAGNOSTIC HTML |

**Signals originate at 40.5, governed by CKR.** Signals are not defined in scripts. Scripts implement CKR-defined constructs. ESI (CKR-014) and RAG (CKR-015) are L3 derivation layer constructs governed by CKR, not "just outputs."

---

## 4. Lifecycle Trace

### Confirmed chain — completed signal path (BlueEdge):

```
[CKR-004/40.4] ST-XXX structural telemetry (static code analysis)
        ↓
[APPLICATION-DOMAIN/40.5] SIG-006 = Sensor Bridge Batch Throughput Rate = 0.333 rec/sec (BlueEdge SA-001 hasi_bridge.py static config; NOT CKR-011 Execution Stability)
        ↓
[CKR-012/40.6] COND-006 = Execution Stability Condition = COMPLETE
        ↓
[CKR-013/40.7] DIAG-006 = Diagnosis node (from COND-006)
               INTEL-001 = computed intelligence (from DIAG-006)
               INTEL-002 = unknown-space declaration (static)
        ↓
[41.1] Semantic anchor (domain model — BlueEdge 17-domain; second-client equivalent ABSENT)
        ↓
[41.4] Package SIG-001 = Sensor Bridge Throughput Ceiling (trace_link: 40.5-SIG-006/INTEL-001)
        ↓
[41.2] CLM-20 = "Signal SIG-001 not found" (GAP-VAULT-02 — placeholder content)
        ↓
[Phase 4] graph_state.json = BLOCKED (vault incomplete)
        ↓
[Phase 5] EXEC/LENS HTML = Phase 1 COMPLETE (structural only, signals: [])
           DIAGNOSTIC HTML = BLOCKED (Phase 4 not run)
```

### Static-derivable paths for second-client (authorized, not yet executed):

```
[CKR-004/40.4] ST-007 (import coupling), ST-010..015 (dependency metrics)
        ↓  [CKR-007 rule]
[CKR-007/40.5] SIG-002 = Dependency Load — COMPUTABLE without runtime

[CKR-004/40.4] ST-006 (volatility index), ST-007, ST-009..011, ST-022
        ↓  [CKR-009 rule]
[CKR-009/40.5] SIG-004 = Structural Volatility — COMPUTABLE without runtime
```

### Runtime-blocked paths (second-client):

```
[BLOCKED] SIG-001 (CKR-006) — requires AT-005/AT-007 program activity telemetry
[BLOCKED] SIG-003 (CKR-008) — requires AT-001..003 commit time-series windows
[BLOCKED] SIG-005 (CKR-010) — requires Prometheus runtime metrics
[BLOCKED] ESI (CKR-014) — requires PES-ESI-01..05 (program delivery execution cadence)
[BLOCKED] RAG (CKR-015) — requires ≥2 temporal delivery windows
```

---

## 5. BlueEdge vs Second-Client Gap

| Construct | CKR Ref | BlueEdge State | Second-Client State | Gap Type |
|-----------|---------|---------------|---------------------|----------|
| 40.4 telemetry | CKR-004 | COMPLETE | PRESENT — `binding_envelope.json` (45 nodes, 62 edges, 5 domain telemetry, 30 caps) | READY |
| 40.5 SIG-002 (CKR-007) | CKR-007 | COMPLETE | NOT RUN — inputs exist | EXECUTION GAP |
| 40.5 SIG-004 (CKR-009) | CKR-009 | COMPLETE | NOT RUN — inputs exist | EXECUTION GAP |
| 40.5 SIG-006 APPLICATION-DOMAIN (Sensor Bridge Throughput) | — | COMPLETE (hasi_bridge.py static; BlueEdge-specific) | BLOCKED — no FastAPI equivalent for hasi_bridge config | PRODUCER GAP (BlueEdge-specific) |
| 40.5 SIG-006 DELIVERY-DOMAIN (CKR-011 Execution Stability) | CKR-011 | BLOCKED_RUNTIME (AT-007/AT-009/DT-007/DT-008 absent; never computed for any client) | BLOCKED_RUNTIME | RUNTIME GAP |
| 40.5 SIG-001/003/005 | CKR-006/008/010 | PENDING (runtime) | BLOCKED | RUNTIME GAP |
| ESI (CKR-014) | CKR-014 | spec exists | BLOCKED (no activity data) | RUNTIME GAP |
| RAG (CKR-015) | CKR-015 | spec exists | BLOCKED | RUNTIME GAP |
| 40.6 COND-006 | CKR-012 | COMPLETE | NOT RUN | EXECUTION GAP |
| 40.7 INTEL-001 | CKR-013 | COMPLETE | NOT RUN | EXECUTION GAP |
| 41.1 domain model | — | BlueEdge 17-domain hardcoded | NOT BUILT — no second-client equivalent | PRODUCER GAP |
| 41.4 signal selection | — | COMPLETE (5 signals) | NOT RUN — `build_signals.py` is BlueEdge-specific | PRODUCER GAP |
| 41.2 vault (CLM-20..24) | — | N/A | PLACEHOLDER — "Signal SIG-001 not found" | CONTENT GAP (GAP-VAULT-02) |
| signal_registry.json | CKR-033 | 5 signals, full content | `signals: []`, `NOT_EVALUATED` | ROOT CONTENT GAP |
| `canonical_topology.json` | CKR-020 | 17 domains (DOMAIN-01..17) | 5 domains (DOM-01..05) ALL GROUNDED | PRESENT — Phase 1 confirmed |

**Root gap:** `signal_registry.json` has `signals: []` because the 40.5 → 40.6 → 40.7 → 41.4 chain has never been executed for second-client. This single gap propagates to all downstream constructs.

**Minimum viable derivation scope** (static-only, no runtime required):
- 40.5: SIG-002 (CKR-007), SIG-004 (CKR-009) — derivable from `binding_envelope.json`; SIG-006 (CKR-011) EXCLUDED — BLOCKED_RUNTIME (requires AT-007/AT-009/DT-007/DT-008 event-based delivery telemetry; never computed for any client)
- 40.6: BLOCKED — no threshold rules exist for CKR-007 or CKR-009 (Stream 75.x authority required); COND-006 chain excluded (upstream SIG-006 APPLICATION-DOMAIN is BlueEdge-specific with no second-client equivalent)
- 40.7: BLOCKED — upstream conditions blocked
- 41.1: NEW client-parameterized semantic layer required (5 domains, not 17)
- 41.4: NEW client-parameterized signal selection required

---

## 6. Canonical Verdicts

---

**SIG-XXX (CKR-005, 40.5 namespace) belongs to:**
OWNER: Stream 40.5 — `scripts/pios/40.5/build_signal_artifacts.py` (CKR-026: Signal Computation Engine)
EVIDENCE: `docs/pios/40.5/signal_computation_specification.md` GOVERNED_SIGNALS table assigns SIG-001..008 to CKR-006..011/014/015; governed by Stream 70 (Execution Signal Science); produces to `docs/pios/40.5/`

**SIG-XXX (CKR-005 elevated, 41.4 package namespace) belongs to:**
OWNER: Stream 41.4 — semantic elevation layer; NOT signal derivation
EVIDENCE: `docs/pios/41.4/executive_signal_report.md` — `generated_from: 40.5/40.6/40.7/41.1/41.2/41.3`; `evidence_mapping_index.json` — full trace chains; `signal_registry.json` — `trace_links` reference 40.5/40.6/40.7 contract IDs

**COND-XXX (CKR-012) belongs to:**
OWNER: Stream 40.6 (CKR-027: Condition and Diagnosis Activation Layer)
EVIDENCE: `docs/pios/40.6/condition_output_set.md`; governed by 75.x threshold model; COND-006 COMPLETE from SIG-006; COND-001..005/007/008 BLOCKED

**DIAG-XXX (CKR-013) belongs to:**
OWNER: Stream 40.7 (CKR-028: Intelligence Synthesis Layer)
EVIDENCE: `docs/pios/40.7/intelligence_output_set.md`; DIAG-006 produced from COND-006

**INTEL-XXX (CKR-013) belongs to:**
OWNER: Stream 40.7 (CKR-028: Intelligence Synthesis Layer)
EVIDENCE: `docs/pios/40.7/intelligence_output_set.md`; INTEL-001 computed; INTEL-002 unknown-space declaration

**ESI (CKR-014) belongs to:**
OWNER: Stream 40.16 — `scripts/pios/40.16/run_esi_derivation.py`; `docs/pios/40.16/esi_derivation_specification.md`
EVIDENCE: Composite from PES-ESI-01..05; reads 40.4 activity/delivery telemetry; outputs to `docs/pios/40.16/`; DRIFT-001 active (current execution at L6/utils/ssz.js — not at authoritative L3 layer)

**RAG (CKR-015) belongs to:**
OWNER: Stream 40.16 — `docs/pios/40.16/rag_derivation_specification.md`
EVIDENCE: Requires ≥2 temporal delivery windows; rate + acceleration + cross components; same producer layer as ESI (CKR-014)

**CLM-XX (vault claims) belongs to:**
OWNER: Stream 41.2 PIE vault
EVIDENCE: Second-client vault holds CLM-20..24 with `claim_type: signal`, `lens_admissible: YES`; content is "Signal SIG-001 not found" / "NOT_AVAILABLE" (GAP-VAULT-02); claims are downstream of 41.4; empty because `signal_registry.json` has `signals: []`

**graph_state.json belongs to:**
OWNER: Phase 4 — `export_graph_state.mjs`
EVIDENCE: Reads vault output + binding envelope; requires vault materialization (Phase 3); absent for second-client; GAP-CODE-01 must be resolved before Phase 4

**SSZ/SSI belong to:**
OWNER: Stream 43.x (PROVISIONAL NOT ADMITTED)
EVIDENCE: `docs/governance/canonical_admission_rule.md` — SSZ/SSI explicitly PROVISIONAL NOT ADMITTED; `docs/pios/43.1/signal_to_structure_binding.md` confirms binding layer role

---

**Authorized insertion point for second-client signal and intelligence derivation:**

**STAGE:** 40.5 — `scripts/pios/40.5/build_signal_artifacts.py`
**LAYER:** L2 — Signal derivation (structural telemetry → computed signals)
**CKR AUTHORITY:** CKR-005 (Execution Signals), CKR-026 (Signal Computation Engine)

**REQUIRED INPUTS:**
- `binding_envelope.json` — PRESENT (45 nodes, 62 edges, 5 domain telemetry records, 30 capability surfaces)
- ST-XXX structural telemetry records from 40.4 — PRESENT in `binding_envelope.json` L1-ST signals
- CKR-006..011 governing rules — LOCATED via contract-provided governance documents

**REQUIRED PRODUCER:**
- `scripts/pios/40.5/build_signal_artifacts.py` — must be client-parameterized
- Requires new contract. See Contract Naming Correction below.

**MINIMUM VIABLE OUTPUTS (static-only, no runtime):**
- `clients/<client>/psee/runs/<run>/40.5/` — SIG-002 (CKR-007), SIG-004 (CKR-009) from ST-XXX inputs; SIG-006 (CKR-011) EXCLUDED — BLOCKED_RUNTIME
- 40.6 and 40.7: BLOCKED — no threshold rules for CKR-007/CKR-009; Stream 75.x threshold contract required before conditions can activate
- 41.x chain and `signal_registry.json` population require upstream condition resolution

**EVIDENCE:**
- `docs/pios/40.5/signal_validation_report.md` — SIG-002 inputs ST-007/010/012..015, SIG-004 inputs ST-006/007/009..011/022: all confirmed STATIC
- `clients/e65d2f0a.../package/binding_envelope.json` — PRESENT with structural telemetry sufficient for static signal computation
- `docs/pios/41.4/evidence_mapping_index.json` — confirms SIG-002 and SIG-004 trace to static telemetry only

**PRODUCER GAP CONSTRAINT:** 41.1 (`build_semantic_layer.py`) is BlueEdge-specific (17-domain hardcoded). Second-client requires client-parameterized equivalent for 5 domains (DOM-01..DOM-05). This does not block 40.5 signal derivation but DOES block 41.4 signal selection/packaging.

---

### Contract Naming Correction

`PI.SECOND-CLIENT.SIGNAL-DERIVATION.41X.01` — **MISLEADING**

This label implies 41.x ownership of signal derivation. Signals are derived at 40.x (CKR-026). 41.x performs semantic elevation only.

Recommended contract names:
- `PI.SECOND-CLIENT.SIGNAL-DERIVATION.40X.01` — if scope is exclusively 40.5→40.6→40.7
- `PI.SECOND-CLIENT.SIGNAL-INTELLIGENCE.CHAIN.40X-41X.01` — if scope spans full derivation-through-packaging chain

---

## 7. Non-Negotiable Invariants

1. No signal, condition, diagnosis, or intelligence construct may be authored without a governing CKR entry.
2. 40.x derives signals. 41.x elevates and packages. Neither layer defines constructs. CKR defines constructs.
3. `signal_registry.json` (`signals: []`) for second-client is evidence-correct state. It must not be manually populated without executing the authorized derivation chain.
4. ESI (CKR-014) and RAG (CKR-015) require temporal program execution data. They are not derivable from static code analysis alone and must not be fabricated.
5. 41.4/build_signals.py is BlueEdge-specific. A second-client equivalent requires an authorized contract.
6. SSZ/SSI (43.x) are PROVISIONAL NOT ADMITTED. They must not be treated as canonical signal outputs.
7. **All signals, conditions, diagnosis outputs, and intelligence constructs must reference CKR identifiers at first occurrence, in compliance with governance rules (governance_master_capsule.md — CANONICAL KNOWLEDGE REGISTRY COMPLIANCE).**

---

## 8. Unresolved Items

| Item | Nature | Evidence of Gap | Resolution Path |
|------|--------|----------------|-----------------|
| 41.x producer gap (second-client) | `build_semantic_layer.py` and `build_signals.py` are BlueEdge-specific | `scripts/pios/41.1/build_semantic_layer.py` hardcodes 17-domain BlueEdge structure | New client-parameterized 41.x producers required; authorized by new contract |
| 40.5 signal computation contract for second-client | No contract authorizing 40.5 execution for second-client | `signal_computation_specification.md` documents BlueEdge run_01_blueedge only | Issue `PI.SECOND-CLIENT.SIGNAL-DERIVATION.40X.01` or `PI.SECOND-CLIENT.SIGNAL-INTELLIGENCE.CHAIN.40X-41X.01` |
| DRIFT-001 (ESI at L6 vs. L3) | ESI computation at wrong layer (`utils/ssz.js` L6 vs. authoritative L3) | `docs/pios/40.16/esi_derivation_specification.md` — active drift noted | Resolve before second-client ESI (CKR-014) derivation proceeds |
| AT-XXX activity telemetry availability (second-client) | AT-001..003 and AT-005/007 required for SIG-001/003; availability for second-client repo not confirmed | `binding_envelope.json` has L1-ST signals; AT-XXX column presence not confirmed | Confirm AT-XXX availability during 40.5 contract execution |
| CG-01: Focus domain selection | No canonical rule; DOMAIN-10 hardcoded | STEP 14E-F confirmed | Requires parameterization + PiOS 41.x execution |
| CG-02: Pressure zone designation | No canonical rule; strictly downstream of CG-01 | STEP 14E-G confirmed | Downstream of CG-01 resolution |
| APPLICATION-DOMAIN SIG-006 second-client identity | BlueEdge SIG-006 (Sensor Bridge Throughput, hasi_bridge.py) has no defined equivalent for second-client (FastAPI OSS stack); `binding_envelope.json` SIG-006 entry is confirmed BlueEdge template contamination | `clients/e65d2f0a.../binding/binding_envelope.json` — SIG-006 provenance: `hasi_bridge.py DEFAULT_CONFIG` | Requires second-client application forensics to determine if equivalent sensor/integration config exists |
| CKR-011 (Execution Stability) event-based blocker | CKR-011 requires AT-007, AT-009, DT-007, DT-008 event-based delivery telemetry; never computed for any client | `docs/pios/40.5/signal_validation_report.md` — SIG-006 BLOCKED; `build_signal_artifacts.py` GOVERNED_SIGNALS: `"temporal": "event-based"` | Requires program delivery event stream before CKR-011 can be derived for any client |
