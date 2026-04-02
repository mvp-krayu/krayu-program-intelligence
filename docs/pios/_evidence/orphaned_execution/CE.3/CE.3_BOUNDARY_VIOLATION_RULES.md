# CE.3 — Boundary Violation Rules

**Stream:** CE.3 — PiOS Interface Contracts
**Program:** Krayu — Program Intelligence Discipline
**Date:** 2026-04-01
**Authority:** CE.2, CE.3_INTERFACE_CONTRACTS.md, canonical-layer-model.md (00.2)

---

## 1. Illegal Layer Crossings

The following layer crossings are explicitly forbidden. Any occurrence is a boundary violation.

| Violation ID | Description | Direction | Rule Violated |
|---|---|---|---|
| BV-01 | 41.x accessing 40.4 directly | Downstream bypasses Core | I1: 40.4 is Core-only input |
| BV-02 | 42.x accessing 40.4 directly | Downstream bypasses Core and Semantic | I1, I3 |
| BV-03 | 42.x accessing Core outputs (40.5–40.11) directly | Bypasses L5 assembly | I3.1 |
| BV-04 | Core (40.5–40.11) accessing 41.x outputs | Forward dependency inversion | ER-06 |
| BV-05 | Core accessing 42.x behavior | Forward dependency inversion | ER-06 |
| BV-06 | 42.x feeding state back into Core | Reverse flow | I3.5 |
| BV-07 | 41.x feeding modified outputs back into Core | Reverse flow | I2.5 |
| BV-08 | 40.5 accessing 40.1–40.3 ingestion artifacts directly | Back-channel pre-Core access | ER-05 |
| BV-09 | SSZ/SSI computation at L6 (e.g., utils/ssz.js) | L6 absorbing L3 derivation responsibility | DRIFT-001; I3.5 |
| BV-10 | Semantic interpretation generated inside Core | L4 logic inside L3 boundary | CE.2 §5 |
| BV-11 | Narrative text generated inside Core | L7 logic inside L3 boundary | CE.2 §5 |
| BV-12 | Signal recomputation inside 41.x or 42.x | Downstream computing what belongs at L3 | I2.5, I3.5 |
| BV-13 | PARTIAL/UNDEFINED flags stripped by any layer | Suppression of explicit gap state | PSR-01, OC-02 |
| BV-14 | Presentation layer (42.x) replacing UNDEFINED with synthetic value | Silent PARTIAL suppression | I3.5 |
| BV-15 | Contract prose acting as architecture authority | L8 absorbing L3/L4 ownership | Canonical §2.4 |

---

## 2. Forbidden Data Flows

| Flow ID | Forbidden Flow | Reason |
|---|---|---|
| FF-01 | Raw 40.4 telemetry → 41.x (bypassing Core) | 41.x must consume Core outputs, not raw telemetry |
| FF-02 | Raw 40.4 telemetry → 42.x (bypassing Core and Semantic) | 42.x consumes only L5 payloads |
| FF-03 | Core ESI/RAG values → 42.x (bypassing L5 assembly) | 42.x requires L5-assembled payloads, not raw derivation |
| FF-04 | 42.x rendered state → 40.5–40.11 | No reverse signal injection from rendering layer |
| FF-05 | 41.x semantic framing → modifying 40.7 diagnosis artifact | Semantic shaping must not alter Core derivation truth |
| FF-06 | Demo sequencing (L7) → generating new signals | Demo packaging must not invent system-level signal data |
| FF-07 | Governance contracts (L8) → defining derivation behavior | Contracts constrain; they do not compute |
| FF-08 | ESI/RAG values injected by L5 assembly without L3 provenance | All signal values in L5 must trace to 40.5 |

---

## 3. Violation Detection Rules

| Detection ID | What to Check | How to Detect |
|---|---|---|
| VD-01 | 40.4 artifact access outside Core | Verify no 41.x/42.x script imports or reads 40.4 files directly |
| VD-02 | Signal values in 41.x or 42.x without Core provenance | Check that every ESI/RAG/PES value in downstream artifacts declares a run_id traceable to Core ESI manifest |
| VD-03 | PARTIAL/UNDEFINED flags absent in downstream outputs | Validate that PARTIAL and UNDEFINED flags from Core ESI manifest are present in all derived downstream artifacts |
| VD-04 | SSZ/SSI computation outside L3 | Search for computeSSZ / computeSSI patterns outside scripts/pios/40.x/ scope |
| VD-05 | Core output artifacts modified by downstream layer | SHA-256 of Core outputs in docs/pios/40.16/ must match identity lock |
| VD-06 | Semantic interpretation inside Core layer scripts | No natural language generation, ranking, or causal claims in 40.5–40.11 scripts |
| VD-07 | Reverse flow from 42.x to Core | No 42.x script writes to docs/pios/40.5/–40.11/ or reads them for state input |
| VD-08 | Input contract hash mismatch | 40.11 validates SHA-256 of 40.4 artifacts against input_contract_lock.json |
| VD-09 | Run ID absent or inconsistent across artifact chain | All artifacts from a single run must carry identical run_id |
| VD-10 | DRIFT-001 active in production paths | utils/ssz.js derivation logic must not be exercised for canonical signal production |

---

## 4. Enforcement Expectations

| Enforcement Point | Mechanism | Owner |
|---|---|---|
| I1 (Ledger → Core) | Input contract lock SHA-256 verification at 40.11; validate_input_contract.py | 40.11 / L8 |
| I2 (Core → Semantic) | Loop closure assertion; run_id consistency check; PARTIAL flag presence check | 40.11 / CE.3 validation |
| I3 (Semantic → Delivery) | L5 payload schema validation; PARTIAL flag presence check in rendered outputs | 43.x / 44.x contracts |
| All boundaries | validate_identity_lock.py; validate_baseline.py; validate_input_contract.py | L8 governance scripts |
| DRIFT-001 (BV-09) | DA-01/DA-02 audit in validate_manifest.py; explicit SSZ/SSI search in DA-01 | 40.16 validation |

---

## 5. Violation Response Protocol

On any detected boundary violation:

1. HALT execution at the detecting layer
2. Declare the violation by ID (BV-xx or FF-xx) in the 40.11 integrity record or equivalent governance log
3. Do NOT propagate outputs produced after the violation point
4. Do NOT silently recover or route around the violation
5. Produce an explicit violation report referencing: violation ID, layer, artifact, field

Silent recovery from boundary violations is forbidden.
