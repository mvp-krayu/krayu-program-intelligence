# Pipeline Evolution Reconstruction (git-sourced, not artifact-inferred)

**Artifact:** PI.FACTORY-COGNITION-DELIVERY-CLOSURE.01 / EVOLUTION_RECONSTRUCTION
**Status:** RECONSTRUCTION — evidence from git history, discovery registry, and orchestrator phase list (not from artifact presence)
**Date:** 2026-06-12
**Question:** Did multiple pipelines emerge intentionally, or is this one evolving pipeline whose integration into the fresh onboarding path was never completed?

> **Corrects** the "two distinct pipeline lineages / different code paths" statement in NETBOX_FRESH_RUN_FORENSIC_AUDIT.md §P2. That statement inferred architecture from artifact presence. Git shows **one** orchestrator.

---

## Layer-by-layer evolution

| Layer | 1. Introduced (commit) | 2. First specimen | 3. Intent | 4. Superseded? | 5. Canonical now? | 6. Invoked by fresh orchestrator? |
|---|---|---|---|---|---|---|
| **GENESIS semantics (SPE)** | 2026-05-21 `4e699fb` (Phase 9 SPE, 6 derivation classes) | BlueEdge | platform-wide | no | yes | **DEFINED but OPT-IN** — `phase_03b/03c`, gated by `--enable-semantic-derivation` (default OFF → "remaining S1 structural-only, return True") |
| **governance** | 2026-05-20 `3d71aaa` (PI Evolution Model: spine + accumulation) | BlueEdge | platform-wide | no | yes | partial — proposition/governance layer tied to semantic (off by default); `governance/` not produced on a default fresh run |
| **SQO** | 2026-05-19 `22d54ce` (operator authority workflow) | BlueEdge | platform-wide | no | yes | **NO** — 0 orchestrator phases; produced by *separate* `promotion_action.py` (operator-driven; S1 auto `system:governance_projection`, S2 manual operator) |
| **runtime cognition** (SignalSynthesisEngine / ConsequenceCompiler) | 2026-05-27 `b57b7ab` / `5fc603f` | BlueEdge | platform-wide | no | yes | **partial** — substrate (DPSIG/41.x/75.x) is produced by the orchestrator; the cognition compilers run **LENS-side at bind**, never pipeline-persisted (by design) |
| **RSIG** (runtime signal) | concept 2026-03 (`runtime_signal`, stream 42.x); RSIG literal 2026-05-31 `a965890` | BlueEdge | platform-wide | runtime-intake (42.x) largely dormant | partial | **NO** — requires runtime evidence; a code-only fresh run has no runtime substrate |
| **DPSIG** | 2026-05-07 `b7b09c1` (architecture) / mapper 05-09 `134f224` | BlueEdge | platform-wide | no | yes | **YES** — `phase_03_9_dpsig_derivation` (ran in cert_05) |
| **execution blindness** | 2026-06-07 `569f1be` (CognitionContractModel) | BlueEdge (dev) | platform-wide | no | yes (frozen market problem) | runtime LENS-side only; not a pipeline phase |
| **gravity divergence** | 2026-05-30 `8b61bdd` (Structural Boundary Divergence slice) | BlueEdge | platform-wide | no | yes | runtime LENS-side only; not a pipeline phase |
| **observation (convergence)** | 2026-05-20 `3d71aaa` (Evolution Model) | BlueEdge | platform-wide | no | yes | **NO** — 0 orchestrator phases; produced by *separate* `genesis_compiler.py` / `chronicle_builder_rc08.py` |
| **vault** | signal_registry 2026-03-19 `ae32333`; evidence_trace 2026-04-25 `577d916` | BlueEdge (run_01/02) | platform-wide | evolved | yes | **DEFINED but CONDITIONAL** — `phase_08a/08b`; skips/fails when LENS vault inputs (grounding/semantic) absent ("S1 structural-only specimen … no LENS vault inputs → SKIP") |

**Orchestrator itself:** `run_client_pipeline.py` introduced 2026-05-01 `1fee518` ("canonical E2E orchestrator + BlueEdge validated fixup") — built around BlueEdge.

**Specimen timeline:** BlueEdge is the development specimen from 2026-03 onward; nearly every layer was first exercised on it. StackStorm (`st2_20260520`) and NetBox-Historical (`20260520`) were both onboarded 2026-05-20 — generalization tests run during the May development window, *after* SQO (05-19) and *around* semantic SPE (05-21), with the governed chain completed via enabled flags + the separate SQO/genesis scripts. NetBox-Fresh (`cert_05`, 2026-06-12) is a clean orchestrator-only run with **default flags**.

---

## Answer: one evolving pipeline, integration never completed in the fresh path

**Not multiple intentional pipelines.** The evidence is decisive:

1. There is **one** orchestrator (`run_client_pipeline.py`, since 2026-05-01), which grew by absorbing phases over May–June.
2. The governed cognition chain is **partially integrated** into it:
   - **DPSIG / structural / centrality / CEU / binding / 41.x / 75.x** — fully integrated, run by default. ✓
   - **Semantic (SPE)** — integrated as phases `03b/03c` but **opt-in** (flag default OFF). Skipped on the fresh path.
   - **Vault** — integrated as `08a/08b` but **conditional** on cognition inputs that the default fresh path doesn't produce. Skips/fails.
   - **SQO qualification** — **never integrated**; a separate operator workflow (`promotion_action.py`).
   - **Observation / convergence** — **never integrated**; separate genesis/chronicle scripts.
   - **Runtime findings** (blindness, divergence, consequences, domain cognition) — LENS-side runtime, never pipeline-persisted (by design).
3. The **historical specimen runs look complete** because the missing pieces were supplied during per-specimen development as enabled flags (semantic) and separate scripted/operator steps (SQO promotion, genesis/chronicle). The **fresh run exposes** that the orchestrator alone, with defaults, does not chain them.

So the "Substrate → Semantic" gap from the prior audit is refined: semantic is **present but default-off**; SQO and observation are **present but out-of-orchestrator** (separate subsystems). The fresh onboarding path was never wired to invoke the full governed chain by default.

### Implication for closure (no action taken here)

Closing the gate is **integration, not construction.** The layers exist and are canonical; they were built and validated (mostly on BlueEdge) and partially absorbed into the orchestrator. The closure work is to decide, per layer, whether the fresh path should:
- **enable** it by default (semantic flag),
- **repair its conditional gate** (vault inputs),
- or **invoke the separate subsystem** in-sequence (SQO promotion, genesis/observation),

and to make explicit which layers are intentionally operator-gated (SQO S2, LENS binding are MANUAL for *every* specimen — not a fresh-path defect).

This is consistent with the standing capability-discovery discipline: **the work is RECONNECT, not REBUILD.**
