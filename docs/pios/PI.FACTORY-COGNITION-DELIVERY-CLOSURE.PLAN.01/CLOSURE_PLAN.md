# Factory → Cognition → Delivery — Closure Plan

**Artifact:** PI.FACTORY-COGNITION-DELIVERY-CLOSURE.PLAN.01
**Status:** PLAN — integration plan for the platform as it exists today. No redesign of PI / SQO / onboarding / THORR.
**Date:** 2026-06-12
**Question:** What must be *connected* so a fresh source snapshot becomes a qualified observation and a commercially usable assessment?
**Grounding:** orchestrator `scripts/pios/run_client_pipeline.py` (read today), cert_05 artifacts. Verb is **RECONNECT, not REBUILD** — every layer exists.

---

## Per-stage integration table

| Stage | Current State (code-grounded) | Required Change | Risk | Effort |
|---|---|---|---|---|
| **1. Structural / DPSIG / CEU / Binding** | EXISTS · INVOKED · default-on. cert_05 ran it fully → `binding_envelope`. | **None.** Works on fresh code-only. | none | — |
| **2. Semantic Derivation (03b · SDC)** | EXISTS · INVOKED but double-gated: (a) `--enable-semantic-derivation` opt-in, (b) requires HTML evidence in `clients/<c>/sqo/evidence/*.html`. Code-only repo has no HTML → skips even with flag. | **None for code-only** (bounded by contract). When the client provides architecture-doc/HTML evidence, pass the flag. Optional enrichment, not a gate. | low | — (optional) |
| **3. Semantic Proposition (03c · SPE)** | EXISTS · INVOKED · runs **deterministically** when `ceu/reconciliation_state.json` + `40.3c` exist (flag only adds AI-*inferred* props). cert_05 **lacks `reconciliation_state.json`** → skipped. | **Wire CEU phase to emit `ceu/reconciliation_state.json`** (via `ceu_reconciliation_seeder.py`, which exists). Then 03c runs and produces `semantic/spe/*`. | low | S |
| **4. Governance** | proposition_review_queue + `governance/` form as part of the SPE/proposition layer. Absent in cert_05 because #3 skipped. | **Follows from #3** — no separate work; governance layer materializes once 03c runs. | low | — (rides #3) |
| **5. Vault (08a/08b)** | EXISTS · INVOKED but conditional on `source_manifest["grounding_state_path"]` resolving to an existing file. cert_05 produced `ceu/grounding_state_v3.json` but 08a skipped (manifest path not bound to the run's own output) → SQO S0 init (08a §10) also skipped. | **Wire `grounding_state_path` to the run's own `ceu/grounding_state_v3.json`** (or have 08a default to it). Unblocks vault + SQO S0 init together. | medium (vault writer assumes 100% coverage shape — verify on code-only) | S–M |
| **6. SQO** | S0 init EXISTS inside 08a §10 (skipped with 08a). S0→S1 = `promotion_action.py` (separate; actor `system:governance_projection` at `structural_onboarding_complete`). S1→S2 = MANUAL operator (L5). | **Unblock S0 init via #5; invoke the S0→S1 auto-promotion at onboarding-complete.** **Preserve S1→S2 manual** (constitutional — see SQO section). | low (S0→S1) / none (S1→S2 untouched) | S |
| **7. Observation / Convergence** | NOT an orchestrator phase. Produced by separate `genesis_compiler.py` / `chronicle_builder_rc08.py`. cert_05 has none. | **Invoke the convergence/observation builder as a post-qualification pipeline step** (call the existing script; do not rebuild). This is the artifact that makes a run a governed *observation*. | medium (subsystem never run from orchestrator on a fresh code-only run) | M |
| **8. LENS Binding** | Two parts: (a) `phase_09` writes `clients/<c>/lens/selector/selector.json` — conditional on a `lens/` dir; (b) the **binding manifest** (`app/execlens-demo/lib/lens-v2/manifests/*.json`) = hand-authored allowlist; no script writes it. | **Auto-generate the manifest** from the run (mechanical); **keep activation an operator approval** (see LENS section). Selector auto-updates once a `lens/` output exists. | low (generation) / governance (approval) | S–M |
| **9. Deliverable Package** | MISSING from pipeline. Capability EXISTS: `app/execlens-demo/lib/lens-v2/AssessmentPackageBuilder.js`. Never invoked for any run. | **Invoke AssessmentPackageBuilder after qualification + observation** to emit the advisory package. | medium (builder is LENS-side; needs a run-driven invocation path) | M |

---

## Gap classification (every skipped layer)

A = deliberate product decision · B = unfinished integration · C = safety/governance boundary · D = technical debt · E = obsolete design

| Skipped layer | Classification | Why |
|---|---|---|
| Semantic Derivation (03b · SDC) | **C** (+ contract-bounded) | AI-assisted enrichment requiring provided HTML evidence. Code-only = bounded engagement per onboarding contract §5/§8. Not a defect; not a gate. |
| Semantic Proposition (03c · SPE) | **B** | Runs deterministically; skipped only because `ceu/reconciliation_state.json` isn't emitted by the fresh CEU phase. Pure input-wiring gap. |
| Governance layer | **B** | Downstream of 03c; materializes once #3 is wired. |
| Vault (08a/08b) | **B** | Wired but its grounding-state input isn't bound to the run's own CEU output. |
| SQO S0 init | **B** | Lives in 08a §10; blocked only because 08a skips (rides #5). |
| SQO S0 → S1 | **A/C (intentional, auto)** | Governed auto-transition (`system:governance_projection` at structural-onboarding-complete). Should fire automatically; currently a separate step not invoked on the fresh path. Wire the invocation; do not change the authority. |
| SQO S1 → S2 | **C (preserve)** | Constitutional operator gate (L5). Intentional. Do **not** automate. |
| Observation / Convergence | **B** | Exists as a separate subsystem (`genesis_compiler.py`), never wired into the orchestrator. |
| LENS selector (phase_09) | **B** | Wired but conditional on a `lens/` output dir. |
| LENS binding manifest | **B (generate) / C (approve)** | Generation is mechanical and should be automated; activation is a governance approval. |
| Deliverable Package | **B** | `AssessmentPackageBuilder` exists; never invoked in the pipeline. |

**No layer classified D (debt) or E (obsolete).** Every gap is B (unfinished integration) or C (intentional boundary). This confirms RECONNECT, not REBUILD.

---

## SQO — which transitions are operator-gated (preserve as-is)

```
S0 → S1   AUTO    (system:governance_projection, at structural-onboarding-complete)
S1 → S2   MANUAL  (operator, L5 — promotion_action.py, s2_advancement_granted)
S2 → S3   MANUAL  (operator, higher governance)
```

This is the **constitutional design and must be preserved.** The closure work is only to ensure **S0 init and the S0→S1 auto-transition fire on the fresh path** (currently blocked by the vault skip + a non-invoked promotion step). **S1→S2 stays manual.** Do not automate governance authority. A fresh code-only specimen should reach **S1 automatically**; S2 remains a deliberate operator act.

---

## LENS Binding — automate generation, keep approval manual

- **Manifest generation: AUTOMATE.** The manifest is a mechanical mapping of `run_id → artifact paths`. Hand-authoring it is error-prone toil with no governance value. The pipeline should emit a *proposed* manifest from the run.
- **Binding activation: OPERATOR ACTION (keep manual).** Adding a run to the LENS allowlist publishes a client's cognition to the projection surface. That is an external-facing governance act and should remain an explicit operator approval — the same separation-of-duties principle as SQO S1→S2.

**Recommendation:** auto-generate the manifest as a `PROPOSED` artifact; the operator approves activation (moves it into the allowlist). Generation = B (integration); approval = C (governance boundary). Not a bug.

---

## Deliverable — first commercially useful closure point

**Your suspicion is correct. S2 is NOT required for the first commercial closure.**

```
Source → Factory (structural/dpsig/ceu/binding)
       → Semantic Proposition (03c, deterministic)
       → Governance layer
       → SQO S0 → S1 (auto)
       → Observation (convergence)
       → Advisory Package (AssessmentPackageBuilder)
```

This yields an **advisory-grade S1 assessment** — exactly what the onboarding contract §8 defines ("Qualification S0/S1 → advisory-grade; governed requires more"). It is commercially usable as an operator-led advisory deliverable. **S2 (QUALIFIED_WITH_DEBT) is an upgrade tier, not a gate** — it requires manual operator promotion and richer evidence. Semantic Derivation (03b/SDC) is *optional enrichment* layered in when the client provides architecture-doc evidence; the S1 commercial closure rests on structural + SPE-proposition cognition, which a code-only repo can produce.

---

## Final output

### 1. Closure roadmap
Connect the existing layers along the S1 advisory path. Six reconnect tasks, no rebuilds, no redesign.

### 2. Ordered implementation sequence
1. **Wire vault grounding input** (`grounding_state_path` → run's `ceu/grounding_state_v3.json`) → unblocks vault **and** SQO S0 init. *(foundation; S–M)*
2. **Emit `ceu/reconciliation_state.json`** in the CEU phase (via existing `ceu_reconciliation_seeder.py`) → unblocks SPE proposition (03c) + governance. *(S)*
3. **Invoke SQO S0→S1 auto-promotion** at onboarding-complete (existing `promotion_action.py` path; preserve S1→S2 manual). *(S)*
4. **Invoke observation/convergence builder** post-qualification (existing `genesis_compiler.py`). *(M)*
5. **Invoke AssessmentPackageBuilder** to emit the advisory package. *(M)*
6. **Auto-generate LENS manifest** as PROPOSED; operator approves activation. *(S–M, parallelizable)*

### 3. Critical path
`#1 (vault input) → #2 (reconciliation_state) → #3 (S0→S1) → #4 (observation) → #5 (package)`.
#1 is the foundation (unblocks vault + SQO together). #6 is parallel and not on the path to a deliverable. Semantic Derivation (03b) is off-path (optional enrichment).

### 4. True defects (must fix — all class B)
- Vault grounding-input not bound to the run's CEU output (#1)
- CEU phase doesn't emit `reconciliation_state.json` (#2)
- SQO S0→S1 auto-promotion not invoked on the fresh path (#3)
- Observation/convergence builder not invoked by the orchestrator (#4)
- AssessmentPackageBuilder never invoked (#5)
- LENS manifest generation is manual toil (#6, generation half)

### 5. Intentional governance boundaries (preserve — NOT defects)
- **SQO S1→S2 manual** operator promotion (L5)
- **LENS binding activation** = operator approval
- **Semantic Derivation (03b)** requires provided evidence; code-only is a contracted bounded result

### Closure definition
The gate closes when a fresh code-only snapshot, through the orchestrator alone, reaches **S1 qualified observation + advisory package**, with LENS binding available on operator approval. That is the commercially usable assessment. S2 and SDC enrichment are upgrades beyond the gate, not part of it.
