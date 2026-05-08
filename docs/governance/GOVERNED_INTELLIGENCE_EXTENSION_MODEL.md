# Governed Intelligence Extension Model

**Document type:** CANONICAL GOVERNANCE DOCTRINE  
**Status:** AUTHORITATIVE — LOCKED  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Date issued:** 2026-05-08  
**Stream:** PI.PSEE-PIOS.GOVERNED-INTELLIGENCE-EXTENSION-MODEL.BASELINE.01

---

## 1. Purpose

This document codifies the mandatory methodology for all future intelligence extensions to the Program Intelligence platform.

It exists to prevent:
- intelligence layers attached without governance accountability
- signal classes added without replay-safe integration
- extensions that bypass readiness gating
- cognitive projection that expands without grounding authority
- drift from the evidence-first, additive-lane discipline that produced the governed baseline

This document is the authoritative reference for how intelligence grows on this platform.

---

## 2. Core Principle

> **"Intelligence attaches THROUGH governance, not around governance."**

Every new intelligence layer — signal class, semantic participation, projection system, or runtime enrichment — must pass through the governed extension lifecycle before it can claim platform authority.

Attaching intelligence around governance produces:
- ungoverned inference
- ungated executive projection
- false-positive risk at CEO surface
- non-reproducible platform states

There are no exceptions to this principle.

---

## 3. Mandatory Extension Lifecycle

Every intelligence extension MUST complete all six stages in order. No stage may be skipped. No stage may be declared complete without a committed artifact.

```
Stage 1: GOVERNED MANIFEST
  ↓
Stage 2: ADDITIVE LANE
  ↓
Stage 3: REPLAY-SAFE INTEGRATION
  ↓
Stage 4: READINESS GATING
  ↓
Stage 5: E2E CERTIFICATION
  ↓
Stage 6: EXECUTIVE COGNITIVE STABILIZATION
```

### Stage 1 — Governed Manifest

A manifest entry MUST be created in `docs/governance/pipeline_execution_manifest.json` before any implementation begins.

The manifest entry must declare:
- lane assignment (A / B / C / D)
- execution mode
- input/output contract
- forbidden patterns
- implementation freeze rules

No implementation work is valid without a manifest entry.

### Stage 2 — Additive Lane

The extension must be assigned to an additive lane that does not mutate existing lanes.

Lane isolation rules (Section 6) apply. No extension may write to an existing lane's output path, modify an existing lane's derivation logic, or claim an existing lane's identity.

### Stage 3 — Replay-Safe Integration

The extension must produce TAXONOMY-01 replay-stable artifacts:

- `signal_value` — never aliased, never normalized
- `activation_state` — immutable after derivation
- `signal_stable_key` — deterministic, hash-anchored
- `derivation_hash` — cryptographic derivation trace
- `derivation_trace.*` — full audit chain

Replay-safe fields must never be overwritten by downstream projection layers.

### Stage 4 — Readiness Gating

The extension's executive projection must pass through `_classify_dpsig_readiness_state()` or an explicitly authorized equivalent gate.

Extensions must not render executive-layer outputs unless `executive_rendering_allowed = true` is asserted by the gate.

False-positive containment rules (C-01, C-02, C-04) apply to all readiness gate implementations.

### Stage 5 — E2E Certification

A full end-to-end validation artifact must be produced and committed before the extension is declared operational.

E2E certification must:
- cover all pipeline stages the extension touches
- assert PASS / FAIL on each check individually
- include a determinism check (re-run produces identical output)
- include a non-regression check (existing certified client behavior unchanged)
- produce a committed JSON artifact under `artifacts/e2e/`

An extension is not operational until its E2E certification artifact is committed.

### Stage 6 — Executive Cognitive Stabilization

The extension's terminology, aliasing, and projection surface must be stabilized before executive rendering is enabled.

Stabilization must define:
- aliasing rules (ALI-XX) for all new identifiers
- qualifier taxonomy entries (Q-XX) for new readiness states
- terminology normalization entries for all new technical labels
- layer classification for each surface element (L1 structural / L2 semantic / L3 executive)

Stabilization is a design artifact. It is not the same as implementation. Implementation requires a separate authorized stream.

---

## 4. Allowed vs Forbidden Extension Behavior

### Allowed

| Behavior | Condition |
|---|---|
| Add new signal class (DPSIG / EXSIG / ORGSIG / FLOWSIG / RISKSIG) | Manifest entry + additive lane + full lifecycle |
| Add new client integration | Format adapter permitted; no derivation formula change |
| Add new semantic cluster to existing client | Requires grounding re-certification |
| Extend qualifier taxonomy (Q-XX) | Requires cognitive stabilization stream |
| Extend aliasing rules (ALI-XX) | Requires cognitive stabilization stream |
| Add new E2E validation checks | Must not invalidate existing PASS checks |
| Add new readiness state | Requires gate amendment contract |

### Forbidden

| Behavior | Reason |
|---|---|
| Modify DPSIG Class 4 thresholds without SCRIPT_VERSION increment | Breaks replay-safe derivation |
| Add client-specific logic inside the readiness gate | Violates client-agnostic governance principle |
| Suppress DPSIG evidence from the data layer | Violates evidence-first discipline |
| Bypass readiness gate for any client | Violates false-positive containment |
| Implement cognitive projection without an IMPLEMENTATION stream | Design-only until explicitly authorized |
| Render executive layer output without executive_rendering_allowed = true | Violates readiness gate authority |
| Commit generated HTML reports as governed artifacts | Reports are reproducible; they are not evidence |
| Claim a new baseline without a full freeze stream | Baseline authority requires formal freeze |
| Introduce a new signal class without completing the full 6-stage lifecycle | Ungoverned intelligence |

---

## 5. Manifest Authority Rules

The pipeline execution manifest at `docs/governance/pipeline_execution_manifest.json` is the authoritative record of what runs on this platform.

Rules:
1. No extension may execute without a manifest entry
2. No manifest entry may be modified without an explicit manifest amendment contract
3. Lane assignments in the manifest are permanent once frozen
4. Forbidden patterns in the manifest are hard constraints — not suggestions
5. Implementation freeze rules in the manifest define when a lane's behavior is locked
6. The manifest is a governance artifact, not a runtime configuration file

Violations of manifest authority are treated as platform governance breaches.

---

## 6. Lane Isolation Rules

The lane model (A / B / C / D) enforces additive growth:

| Lane | Purpose |
|---|---|
| A | Deterministic structural intelligence (currently operational) |
| A.5 | Grounding-aware semantic participation (partially operational) |
| B | Agentic semantic orchestration (design-ready, not yet started) |
| C | Reserved — organizational intelligence (future) |
| D | Reserved — flow and risk intelligence (future) |

Rules:
1. A new intelligence class MUST be assigned to a lane before implementation
2. Lanes must not share derivation paths
3. Lane A (DPSIG Class 4) is frozen — no mutation permitted
4. Lane A.5 outputs must not mutate Lane A artifacts
5. Lane B operates above the readiness gate — it does not modify any layer below Layer 3
6. Future lanes (C / D) require explicit lane authorization before any work begins

---

## 7. Replay-Safe Integration Rules

Replay safety is non-negotiable. All governed intelligence extensions must produce artifacts that are deterministically reproducible from the same input.

Rules:
1. TAXONOMY-01 fields (signal_value, activation_state, signal_stable_key, derivation_hash, derivation_trace) are immutable once derived
2. No downstream layer may overwrite TAXONOMY-01 fields
3. Aliasing and normalization operate on L3 projection surfaces only — they never touch L1/L2 data fields
4. A re-run of any derivation script on the same input must produce bit-identical output
5. Format adapters (e.g., BlueEdge structure adapter) are pure translation — no computation
6. Replay artifacts must be independently verifiable without runtime state

---

## 8. Executive Readiness Gate Obligations

The executive readiness gate is the platform's primary false-positive containment mechanism.

Obligations for all extensions:
1. Every new signal class must be classified by readiness state before executive rendering
2. The gate must remain client-agnostic — no client-specific branching in gate logic
3. New readiness states require an explicit gate amendment contract
4. False-positive containment containers are locked — changes require explicit authority
5. The gate must be tested across all certified clients before an extension is declared operational
6. `executive_rendering_allowed = false` must be the default for any new signal class until gating is proven

The readiness gate does not block data-layer evidence. It gates executive projection only.

---

## 9. E2E Certification Obligations

End-to-end certification is the platform's operational proof standard.

Obligations for all extensions:
1. E2E certification artifact must be a committed JSON file under `artifacts/e2e/`
2. Each check must be named and produce an explicit PASS / FAIL verdict
3. The overall verdict must be a single machine-readable string
4. A determinism check must be included: re-run produces identical checksums
5. A non-regression check must be included: existing certified client behavior is unchanged
6. E2E certification is per-client — each client requires its own certification artifact
7. A failed E2E certification does not block data-layer commits — it blocks executive projection only

---

## 10. Cognitive Projection Stabilization Obligations

Before an intelligence extension may render executive-visible output, its projection surface must be stabilized.

Obligations for all extensions:
1. All new identifiers must have ALI-XX aliasing rules before executive rendering
2. All new readiness states must have Q-XX qualifier taxonomy entries
3. All new technical labels must have terminology normalization entries
4. Stabilization must specify the layer classification: L1 (structural truth) / L2 (semantic projection) / L3 (executive cognition)
5. TAXONOMY-01 fields are always KEEP_RAW — they never enter executive aliasing
6. Stabilization is a design artifact (committed to docs/) — it does not authorize implementation
7. Implementation of cognitive projection requires a separate IMPLEMENTATION stream contract

The current cognitive projection design is at `docs/psee/PI.PSEE-PIOS.EXECUTIVE-COGNITIVE-PROJECTION.STABILIZATION.01/`. It is design-frozen. Implementation is not yet authorized.

---

## 11. Path Transition Rules

### Path A — Deterministic Structural Intelligence

State: OPERATIONAL  
Content: DPSIG Class 4 (CPI + CFA), SCRIPT_VERSION=1.0  
Transition rule: No further work authorized without explicit stream contract. Thresholds are LOCKED.

### Path A.5 — Grounding-Aware Semantic Participation

State: PARTIALLY OPERATIONAL  
Content: BlueEdge 5/17 domains grounded; FastAPI STRUCTURAL_LABELS_ONLY  
Transition rule: Domain grounding expansion requires a grounding contract per client. No inference without grounding evidence. FastAPI remains BLOCKED until a grounding contract is issued.

### Path B — Agentic Semantic Orchestration

State: DESIGN_READY — implementation not yet started  
Stream: PI.AGENTIC-SEMANTIC-ORCHESTRATION.01 (prerequisite: governed-dpsig-baseline-v1)  
Transition rule:
- May not begin until governed-dpsig-baseline-v1 is the active baseline
- Must load GOVERNED_INTELLIGENCE_EXTENSION_MODEL.md at stream start
- Operates above the readiness gate — does not modify Layer 1 or Layer 2
- Must complete the full 6-stage extension lifecycle
- Must not introduce client-specific logic in gate or renderer

Path B prerequisite is now met. PI.AGENTIC-SEMANTIC-ORCHESTRATION.01 may be contracted.

---

## 12. Future Signal-Class Expansion Model

The platform recognizes the following future signal classes. None are authorized for implementation until their manifest entry and extension lifecycle are explicitly contracted.

### DPSIG — Deterministic Pressure Signal

Current state: Class 4 operational (CPI, CFA)  
Deferred: Classes 1/2/3/5/6/7/8  
Expansion rule: Each new DPSIG class requires its own stream contract, manifest entry, and full 6-stage lifecycle. Class 4 thresholds are immutable.

### EXSIG — Executive Signal

Current state: NOT STARTED  
Purpose: Executive-layer signals derived from readiness gate outputs  
Expansion rule: Requires manifest entry, additive lane assignment, and readiness gate amendment before any implementation.

### ORGSIG — Organizational Signal

Current state: NOT STARTED  
Purpose: Signals derived from organizational topology (team structure, ownership boundaries)  
Expansion rule: Requires manifest entry, additive lane assignment, and organizational data grounding contract before any implementation.

### FLOWSIG — Flow Signal

Current state: NOT STARTED  
Purpose: Signals derived from data/control flow topology  
Expansion rule: Requires manifest entry, additive lane assignment, and flow topology evidence before any implementation.

### RISKSIG — Risk Signal

Current state: NOT STARTED  
Purpose: Signals derived from risk topology (vulnerability, dependency exposure)  
Expansion rule: Requires manifest entry, additive lane assignment, and risk evidence grounding contract before any implementation.

**No signal class may be implemented without completing the mandatory extension lifecycle (Section 3) in full.**

---

## 13. Mandatory Stream Loading Rules

Every stream that introduces, modifies, or extends any of the following must load this document at stream start:

- new intelligence layers
- semantic participation systems
- signal classes (DPSIG / EXSIG / ORGSIG / FLOWSIG / RISKSIG)
- projection systems
- readiness gate logic
- executive cognitive stabilization artifacts
- runtime enrichment layers

Loading means:
1. Read this document in full
2. Read `docs/governance/pipeline_execution_manifest.json`
3. Confirm active baseline tag from `docs/governance/governance_baselines.json`
4. Declare compliance in the stream's pre-flight

Failure to load before execution is a governance breach.

See `docs/governance/STREAM_GOVERNANCE_LOAD_TEMPLATE.md` for the standard stream preamble.

---

## 14. Governance Freeze Rules

A governance freeze captures a platform state as authoritative for future streams.

Rules:
1. A baseline freeze requires a formal freeze stream (PI.*.BASELINE.FREEZE.*)
2. The freeze stream must produce: GIT_STATE_INSPECTION, BASELINE_CONTENT_INVENTORY, GOVERNANCE_FREEZE_SUMMARY, ARCHITECTURE_SNAPSHOT, BASELINE_CERTIFICATION, FINAL_BASELINE_VERDICT
3. The freeze must be anchored by an annotated git tag on the platform-state commit (not the freeze-document commit)
4. The baseline registry (`docs/governance/governance_baselines.json`) must be updated with the new baseline entry
5. The new baseline supersedes the previous baseline for all new streams from its issue date
6. Freeze rules do not retroactively invalidate work done under the prior baseline
7. Any modification to frozen behavior requires a new governance amendment with explicit authority

The current authoritative baseline is `governed-dpsig-baseline-v1` at commit 092e251.
