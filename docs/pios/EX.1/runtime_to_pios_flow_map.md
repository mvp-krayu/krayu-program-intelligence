# EX.1 — Runtime to PiOS Flow Map

**Stream:** EX.1 — Runtime Binding & Verification
**Artifact type:** RUNTIME TO PIOS FLOW MAP
**Date:** 2026-04-03
**Authority:** EX.1

---

## 1. LAYER ARCHITECTURE

Per `docs/governance/runtime/reference_boundary_contract.md` (LOCKED):

```
L0  External / Ledger / Raw Input
L1  Ingestion / Normalization
L2  PiOS Core (40.x) — Deterministic Derivation Engine
L3  Semantic / Narrative / Delivery (41.x / 42.x)
L4  Category / Web / External Surfaces
```

The ExecLens demo runtime operates at **L3** (semantic layer).
PiOS v0.4 certified engine operates at **L2** (40.5 → 40.6).

---

## 2. WHAT THE RUNTIME ACTUALLY READS

```
Browser (index.js)
    │
    ▼ HTTP GET /api/execlens?query=GQ-NNN
Next.js API Route (pages/api/execlens.js)
    │
    ├─────────────────────────────────────────────────────────────┐
    │ ?query / ?list                                              │ ?overview
    ▼                                                             ▼
scripts/pios/42.4/execlens_adapter.py           scripts/pios/42.6/execlens_overview_adapter.py
    │                                                             │
    ▼ import                                                      ▼ import
scripts/pios/42.2/render_executive_narrative.py ← ← ← ← ← ← ← ←┘
    │
    ▼ calls
scripts/pios/42.1/run_execlens_query.py
    │
    ├──── docs/pios/41.5/query_signal_map.json        [L3 artifact]
    ├──── docs/pios/41.4/signal_registry.json          [L3 artifact]
    ├──── docs/pios/41.4/evidence_mapping_index.json   [L3 artifact]
    ├──── docs/pios/41.5/query_response_templates.md   [L3 artifact]
    └──── docs/pios/41.2/pie_vault/                    [L3 artifact]

scripts/pios/42.7/execlens_topology_adapter.py
    │
    └──── docs/pios/42.22/sample_runtime_output.json  [L3 artifact]
         docs/pios/44.2/projection_attachment.json    [L3 artifact]
```

**DEAD PATHS (adapters referenced but non-existent):**
```
?status=true → scripts/pios/42.13/demo_activate.py         [MISSING — dead]
?enl=GQ-NNN  → scripts/pios/42.15/enl_console_adapter.py  [MISSING — dead]
?persona=X   → scripts/pios/42.16/persona_view_map.py      [MISSING — dead]
```

---

## 3. WHAT THE RUNTIME DOES NOT READ (PIOS V0.4 ENGINE PATH)

```
PiOS v0.4 Engine (NOT in runtime execution path)
    │
    ├── pios/core/v0.1/engine/compute_signals.py        [L2 — NOT INVOKED]
    │       ↓
    │   runs/pios/40.5/ce10_validation/signal_output.json
    │       • 8 signals with CE.4 `state` ∈ {PARTIAL, BLOCKED, COMPLETE}
    │       • partiality_reasons, blocking_class, traceability
    │       [UNTRACKED — NOT READ BY RUNTIME]
    │
    └── pios/core/v0.1/engine/activate_conditions.py    [L2 — NOT INVOKED]
            ↓
        runs/pios/40.6/ce10_validation/condition_output.json
            • 8 conditions with `condition_coverage_state` ∈ {STABLE, BLOCKED}
            • 8 diagnoses with `diagnosis_activation_state` ∈ {INACTIVE, BLOCKED}
            • ce5_consumption_records: 8
            • ce5_traceability_records: 8
            [UNTRACKED — NOT READ BY RUNTIME]
```

---

## 4. DATA FLOW BY SIGNAL FIELD

For each field that appears in the runtime surface, this table traces its origin:

| Runtime Field | Source in Runtime | Traceable to PiOS Engine? | Governance Reference |
|---|---|---|---|
| `signal_id` | 41.4/signal_registry.json | Shared ID namespace | CE.4 signal set |
| `title` | 41.4/signal_registry.json (narrative) | Not directly | L3 semantic elevation |
| `statement` | 41.4/signal_registry.json (narrative) | Partially (thresholds extracted) | L3 |
| `evidence_confidence` | 41.4/signal_registry.json | NOT CE.4 vocabulary | L3-specific |
| `domain_id`, `capability_id` | 41.4/signal_registry.json | Not in PiOS engine | L3 |
| `emission_state` (CE.4) | **ABSENT from runtime** | — | CE.4 INV-001..INV-007 |
| `consumption_state` (CE.5) | **ABSENT from runtime** | — | CE.5 CSM-1, C-001..C-003 |
| `condition_coverage_state` (CE.2) | **ABSENT from runtime** | — | CE.2 DEC-009 |
| `diagnosis_activation_state` (CE.2) | **ABSENT from runtime** | — | CE.2 DEC-014 |
| `partiality_reasons` (CE.4) | **ABSENT from runtime** | — | CE.4 INV-005 |
| `blocking_class` (CE.4) | **ABSENT from runtime** | — | CE.4 INV-004 |
| `ce5_consumption_records` | **ABSENT from runtime** | — | CE.5 PBE-2 |
| `ce5_traceability_records` | **ABSENT from runtime** | — | CE.5 T-001/T-002 |
| `signal_state: "computed"` (42.22) | 42.22/sample_runtime_output.json | Non-governed value | BIND-002 |

---

## 5. LAYER BOUNDARY ANALYSIS

### L2 → L3 Handoff Assessment

The `reference_boundary_contract.md` defines:
- L2 (PiOS Core) owns truth derivation
- L3 (41.x/42.x) owns semantic elevation
- L3 is **forbidden** from "creating new signals, altering computed values, recomputing logic outside Core"

**Current state of the L2 → L3 handoff:**

The 41.4 signal registry was generated with `run_reference: run_01_blueedge` and `generated_date: 2026-03-20`. It is a static pre-computed L3 artifact. There is no live pathway from the L2 PiOS v0.4 engine to the L3 41.4 artifacts.

The L3 runtime:
- DOES NOT alter CE.4 signal values (values are read from pre-computed static files)
- DOES NOT recompute L2 logic
- DOES silently omit all CE.4/CE.5/CE.2 governed state fields (BIND-001, BIND-003, BIND-006)

### L3 → Runtime Handoff Assessment

The 42.x adapters correctly enforce:
- R3 (no synthetic data) ✓
- R4 (fail closed on invalid query) ✓
- deterministic extraction rules ✓
- no direct 41.x file access via 42.4 (accessed through 42.1) ✓

Violations:
- 42.22 uses `signal_state: "computed"` — not CE.4 vocabulary (BIND-002)
- Missing adapters 42.13, 42.15, 42.16 (BIND-007)

---

## 6. PROPAGATION PATH EXISTENCE CHECK

Per EX.H1 SB-007, the inspection surface MUST expose:
- Signal-level traceability ← **NOT STRUCTURALLY POSSIBLE** (BIND-001, BIND-003)
- CE.5 consumption records ← **NOT STRUCTURALLY POSSIBLE** (BIND-003)
- Propagation states ← **NOT STRUCTURALLY POSSIBLE** (BIND-006)
- Diagnosis states ← **NOT STRUCTURALLY POSSIBLE** (BIND-006)
- Structural gap visibility (Type 2) ← **NOT STRUCTURALLY POSSIBLE** (BIND-003)

The runtime currently has no structural path to any CE.4/CE.5/CE.2 governed output.
All of these exist in the CE.10 validation run archives (untracked).
