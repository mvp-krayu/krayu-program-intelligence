# GAUGE Chain Boundary Contract
# COMPUTABLE.CHAIN.TO.GAUGE.01 — Deliverable 2

## Identity

- Contract: COMPUTABLE.CHAIN.TO.GAUGE.01
- Date: 2026-04-14
- Mode: ARCHITECTURE DEFINITION ONLY

---

## A. What GAUGE Consumes

GAUGE consumes exactly these governed artifacts:

| artifact | source | stage produced | API route |
|----------|--------|---------------|-----------|
| `gauge_state.json` | `clients/blueedge/psee/runs/run_01_authoritative/package/` | S4 (currently static) | `/api/gauge` |
| `coverage_state.json` | same package dir | S2a (PSEE pipeline stage 06) | `/api/gauge` |
| `reconstruction_state.json` | same package dir | S2a (PSEE pipeline stage 06) | `/api/gauge` |
| `canonical_topology.json` | `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/` | S3-41.1 | `/api/topology` |
| `signal_registry.json` | `docs/pios/41.4/` | S3-41.4 | `/api/signals` |

GAUGE does NOT consume:
- live telemetry streams
- computed signal values from 40.5
- condition outputs from 40.6
- diagnosis outputs from 40.7
- delivery, feedback, or control layer artifacts (40.8-40.11)
- 43.x binding artifacts
- 44.x projection artifacts
- 42.x ExecLens query responses

---

## B. What GAUGE Must Not Consume

| forbidden consumption | reason |
|-----------------------|--------|
| Direct IG.RUNTIME artifacts | Must pass through PSEE pipeline (IG-PSEE-HANDOFF.0 contract) |
| Raw 40.2/40.3 entity catalog | Not formatted for GAUGE consumption; intermediate artifact |
| 40.5 computed signal values | GAUGE signal block uses 41.4 registry (structural-evidence signals), not computed runtime signals |
| 43.x binding artifacts | LENS layer only |
| 44.x projection artifacts | LENS layer only |
| Any artifact not produced by an authorized stage | No ad-hoc data sourcing |
| Invented or simulated execution state | No fabricated gauge_state.json fields |

---

## C. Where GAUGE Stops

**GAUGE STOP BOUNDARY:**

GAUGE stops at the end of STAGE 4.

Specifically:
- GAUGE reads coverage and reconstruction proof from the PSEE pipeline package
- GAUGE reads structural topology from canonical_topology.json (S3-41.1)
- GAUGE reads signal presence from signal_registry.json (S3-41.4)
- GAUGE reads execution state from gauge_state.json (S4)

GAUGE does NOT require:
- any output from STAGE 5 (40.5-40.11)
- any output from STAGE 6 (43.x, 44.x, 42.x)

The completion score component (0 of 40 points) is not computable without a terminal execution state from STAGE 5. GAUGE correctly reflects this as NOT EVALUATED. This is not a GAUGE defect — it is correct reporting of an absent upstream computation.

**GAUGE is a structural proof surface. It proves what has been computed, not what has not.**

---

## D. Where PiOS Continuation Begins

**PiOS continuation begins at STAGE 5.**

Specifically at: `40.5 — Signal Computation`

PiOS continuation requires:
- Live runtime telemetry from 40.4 surfaces (currently blocked — signals like SIG-001 require live Prometheus scrape from a running backend)
- Computed signal values from `scripts/pios/40.5/build_signal_artifacts.py`
- Condition activation from `scripts/pios/40.6/build_condition_artifacts.py`
- Diagnosis synthesis from `scripts/pios/40.7/build_diagnosis_artifacts.py`

These are NOT required to reach GAUGE.
These ARE required to reach LENS.

**PiOS continuation boundary = the point where static structural proof ends and live execution intelligence begins.**

The current `signal_registry.json` consumed by GAUGE (S3-41.4) contains structural-evidence signals derived from code analysis — not live runtime signals from 40.5. This distinction is critical.

---

## E. Why LENS is Downstream and Separate

**LENS is at STAGE 6. GAUGE is at STAGE 4. They share the same upstream chain but diverge at S5.**

LENS requires:

1. **Computed signal values** (S5 — 40.5) — these require live runtime telemetry. Currently BLOCKED for BlueEdge because the platform is not running in static analysis context.

2. **Signal-to-structure binding** (S6 — 43.x) — deterministic projection of computed signal values onto structural topology nodes. `docs/pios/43.1/signal_to_structure_binding.md` defines this layer as architectural/governance only (no executable binding script yet exists).

3. **Overlay projection** (S6 — 44.x) — structural overlay with signal annotation, projection of intelligent state onto topology surface. Definition only — no executable.

4. **ExecLens query execution** (S6 — 42.x) — runtime execution of golden queries against signal-annotated topology. `scripts/pios/42.1/run_execlens_query.py` exists but depends on complete upstream binding.

GAUGE does NOT render:
- signal propagation paths
- execution failure scenarios
- diagnosis narratives
- condition heat maps
- ExecLens query responses

These belong to LENS. GAUGE is the structural floor. LENS is the intelligence ceiling.

**Merging GAUGE and LENS would corrupt both surfaces.** GAUGE's authority is its independence from execution intelligence. LENS's authority is its dependence on fully computed intelligence. They must not be merged.

---

## F. Topology Truth Source

**Single authoritative source: `canonical_topology.json`**

- Produced by: `scripts/pios/41.1/build_semantic_layer.py`
- Artifact: `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`
- Consumed by: `/api/topology` via `buildCanonicalRenderModel()` (GAUGE.RUNTIME.TOPOLOGY.CONSUMPTION.01)
- No envelope-derived topology allowed in GAUGE

---

## G. Signal Presence Source

**Single authorized source: `docs/pios/41.4/signal_registry.json`**

- registry_id: PIOS-41.4-RUN01-SIGNAL-REGISTRY
- Produced by: `scripts/pios/41.4/build_signals.py` (currently partial — static output used)
- Consumed by: `/api/signals` (GAUGE.RUNTIME.SIGNAL.VISIBILITY.01)
- These are structural-evidence signals, not live runtime signals
- GAUGE signal block shows presence and confidence — not propagation or diagnosis

---

## H. Query Lock Boundary

Discovery Queries are locked at two levels:

| query type | lock | condition to unlock |
|-----------|------|---------------------|
| Structural queries | Access key gate | PiOS Discovery access key (`PIOS-DISCOVERY-DEMO`) |
| Execution queries | Execution layer gate | Terminal execution state (S-13) required — S5 must complete |

No query execution logic exists in GAUGE. Queries are surface-only declarations.
No auto-unlock. No simulation of query execution.

---

## I. Governance Confirmation

GAUGE:
- carries no diagnosis
- carries no narrative
- carries no signal propagation
- carries no condition heat map
- carries no execution failure modeling
- carries no ExecLens rendering

These are all LENS responsibilities, gated behind S5 completion.
