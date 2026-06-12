# Phase 0 — Factory Certification Result (NetBox Fresh Ingestion)

**Artifact:** PI.RAW-INGESTION-VALIDATION.NETBOX.01
**Status:** RESOLVED — initial run FAILED, fix applied, re-run GREEN (see §RESOLUTION)
**Date:** 2026-06-12
**Test:** Run the orchestrator for NetBox with a fresh run-id; confirm it builds from `netbox-64d3b11.tar` upward WITHOUT reusing prior run artifacts. Resolves the UNVERIFIED row in PI.CLIENT-ONBOARDING-CONTRACT.01.

---

## Verdict

**FAIL. Fresh raw ingestion is NOT executable today.** The factory does not extract the tar into a fresh run; it reuses a prior run's extracted source, and then the orchestrator fails closed anyway. The UNVERIFIED row resolves to: **raw-ingestion-from-archive is not performed for a fresh run.**

This is the most important commercial finding in the onboarding work. The hard rule was: if the raw ingestion path is not executable today, that is the finding — do not mask it. It is not executable. Stated plainly.

---

## What was executed

```
python3 scripts/pios/run_client_pipeline.py \
  --client netbox --source source_01 --run-id run_netbox_factory_cert_01
```

Fresh run-id, confirmed non-existent before the run.

## What happened, phase by phase

| Phase | Result |
|---|---|
| 0L Learning Registry | PASS — 5 events loaded |
| 1 Source Boundary | PASS — archive present, SHA256 verified (`043d4ca2…`). The tar IS read and integrity-checked. |
| 2 Intake | **The defect.** `source_intake.py` ran, but did NOT extract the tar. It resolved to the **prior run's** canonical_repo and reused it. Then the orchestrator FAILED CLOSED: "source_intake.py completed but outputs not found." |
| 3+ | Never reached. |

## The two findings (confirmed by evidence)

### Finding 1 — Intake reuses prior extraction; the tar is never extracted for a fresh run

Evidence from the fresh run's own artifacts:
- No `canonical_repo` exists in the fresh run: `run_netbox_factory_cert_01/intake/canonical_repo` — **absent**. The tar was not extracted.
- `source_intake_materialization.json`: `materialization_provenance: "EXISTING_INTAKE_PRESENT"`, `resolved_path: "…/run_github_netbox_20260520_134600/intake/canonical_repo"` — it pointed at the **old** run.
- Source inventory (2169 files) was read from the **old** run's extraction, not from the archive.

**Root cause:** `clients/netbox/sources/source_01/source_manifest.json` hardcodes
`extracted_path: clients/netbox/psee/runs/run_github_netbox_20260520_134600/intake/canonical_repo`
— a specific prior run. `source_intake.py` runs in `EXTRACTED_PATH` mode and honors it, preferring existing intake over extracting the archive. A genuinely fresh client (no prior run, no hardcoded `extracted_path`) would have no fallback — and that path (archive → fresh extraction) was **never exercised** and is not demonstrated to exist.

### Finding 2 — Orchestrator fails closed on its own intake output check

Even on the reuse path, `source_intake.py` reported `INTAKE PASS` and wrote five files into the fresh run's `intake/`, but the orchestrator's materialization check declared "outputs not found" and fail-closed at Phase 2. The orchestrator and `source_intake.py` disagree on the expected output contract. So the reuse path does not even complete.

---

## Learning Trace (per the requested stages)

Only Phases 1–2 executed; trace is bounded to them.

| Question | Phase 1 (Boundary) | Phase 2 (Intake) |
|---|---|---|
| Directly extracted from source? | SHA256 of the tar | **Nothing** — tar not extracted; source read from prior run |
| Inferred by PI? | — | path resolution fell back to prior run |
| Reused from doctrine/ontology? | learning registry (5 events, 0 consumable) | intake contract `PI.LENS.SOURCE-INTAKE.GENERIC.01` |
| Learned/promoted during run? | none | none |
| Failed/degraded? | — | **FAIL: reused prior extraction; orchestrator fail-closed** |

Stages 3+ (import graph, evidence, signals, semantics, SQO, Answer Objects, SynthesisContext, LENS) were **never reached.** No NetBox-native cognition was produced by this run. No BlueEdge-specific assumption audit is possible — the run did not progress far enough to expose one.

---

## What this means for the contract and plan

- **Contract UNVERIFIED row → resolved to FAIL.** Fresh raw ingestion is not executable; the factory reuses prior extraction and the orchestrator fail-closes.
- **The cognition pipeline (Phases 3+) remains validated** for *existing* runs (BlueEdge/StackStorm this session) — but that is consumption over prior artifacts, exactly the limitation the user flagged. The *factory from raw* is unproven.
- **Track A (Factory Certification) is now the confirmed blocking work.** It is not a verification; it is a fix.

## Required fixes (Track A scope)

1. **Fresh extraction path.** `source_intake.py` must extract the archive into the *current* run's `intake/canonical_repo` when no extraction exists for that run — and must NOT silently inherit another run's `extracted_path`. The manifest's `extracted_path` should be per-run, not a hardcoded prior run.
2. **Manifest decoupling.** `source_manifest.json` must not bake a specific prior run into `extracted_path`. Source identity (archive + SHA256) is run-independent; extraction location is run-specific.
3. **Intake output contract alignment.** The orchestrator's Phase-2 materialization check and `source_intake.py`'s written outputs must agree on what/where the outputs are, so a clean intake does not fail-closed.
4. **Re-run Phase 0** after fixes: fresh run-id must produce its own `canonical_repo` from the tar, with `materialization_provenance: FRESH_EXTRACTION` (or equivalent), and proceed past Phase 2.

## Artifact note

`clients/netbox/psee/runs/run_netbox_factory_cert_01/` is an INCOMPLETE partial run created by this test (intake metadata only, no canonical_repo, no cognition). It is the evidence of this result. It reused the prior run's source and must not be treated as a clean fresh ingestion.

---

## Honest one-line summary

The cognition engine is real and runs on existing artifacts; the **factory that turns a raw client archive into a fresh run does not work yet** — it reuses prior extraction and fails closed. That is the gate. Track A is a fix, not a check.

---

## RESOLUTION — Fix Applied, Re-run GREEN

The defect was fixed at the correct abstraction: **SOURCE_REPO MATERIALIZATION** (tar is just one transport).

### Fix (scripts/pios/source_intake.py)
1. **Current run owns its source.** `materialize_intake` now materializes the source INTO the current run's `intake/canonical_repo`. Idempotency checks only the *current* run; it no longer treats a prior run's extraction as "existing intake."
2. **Cross-run resolution forbidden except REPLAY.** `resolve_inventory_source_path` resolves `CLIENT_RUN` only in fresh mode; a prior run's `extracted_path` is consulted only under `--replay`.
3. **SourceInput kinds defined.** Adapter map: `git_url`→GIT_CLONE (guarded), `archive`→TAR_ARCHIVE, `local_dir`/`pre_extracted`→LOCAL_REPO (new copy adapter). Transport-agnostic; the primitive is materialization, not tar.
4. **Manifest decoupled.** `intake_manifest` now records `materialized_source_repo` (run-specific) instead of echoing the source manifest's hardcoded prior-run `extracted_path`.

### Re-run proof (orchestrator, fresh run-id `run_netbox_factory_cert_04`)
| Stage | Result |
|---|---|
| Phase 1 Source Boundary | PASS — tar SHA256 verified |
| Phase 2 Intake | **PASS — `materialization_provenance: LIVE_MATERIALIZED_FROM_RAW_ARCHIVE`; 2540 entries extracted into the CURRENT run; inventory resolution `CLIENT_RUN`; no cross-run reference** |
| Phase 3 Structural | PASS — 2540 nodes, canonical topology from freshly-materialized source |
| Phase 3.6 Code-Graph Enrichment | PASS — 16,046 relationships, all validations PASS |
| Phase 3.7 Centrality | PASS — 6/6 |
| Artifacts produced | intake, structure, dom, ceu, 41.x, 75.x, binding, vault — full pipeline |
| Source identity | real NetBox Django repo (`netbox/`, `pyproject.toml`, requirements) — NetBox-native, not BlueEdge |

### Verdict
**Phase 0 GREEN.** Fresh raw ingestion is executable: a fresh run materializes its own `source_repo` from the raw archive and proceeds through intake into NetBox-native structural cognition, with no reuse of prior run artifacts and no cross-run leakage. The contract's UNVERIFIED row → **VERIFIED**.

Track A (Factory Certification) gate is cleared for the archive transport. Remaining adapters: `git_url`/GIT_CLONE (network) and `local_dir`/`pre_extracted` (LOCAL_REPO implemented, not yet exercised on a real client).

Certification run: `run_netbox_factory_cert_04` (artifacts gitignored; regenerable). Intermediate test runs cert_01 (the original failure), cert_02/03 (fix iterations) retained as evidence.

---

## FULL-PIPELINE CONFIRMATION (clean run `run_netbox_factory_cert_05`)

Re-ran the full orchestrator on a clean fresh run-id to confirm end-to-end depth.

**Result: cognition factory confirmed; pipeline fail-closes at vault construction.**

| Phase | Result |
|---|---|
| 0L Learning Registry | PASS |
| 1 Source Boundary | PASS (tar SHA256) |
| 2 Intake | PASS — `LIVE_MATERIALIZED_FROM_RAW_ARCHIVE`, current-run owned (2174 files) |
| 3 Structural | PASS — 2540 nodes, 24 clusters, 2516 edges (CLU-20 `netbox` = 2129 nodes) |
| 3.5 Relevance | PASS — 1848 PRIMARY / 138 SUPPORT / 554 PERIPHERAL |
| 3.6 Code-Graph Enrichment | PASS — 16,046 relationships, all validations PASS |
| 3.7 Centrality | PASS — `structure/40.3c/structural_centrality.json` produced |
| 4 CEU Grounding | PASS — `ceu/grounding_state_v3.json` |
| 5 Binding Envelope | PASS — `binding/binding_envelope.json` |
| 6+7 Activation/Projection | PASS — `75.x/` activation, `41.x/` projection |
| **8a Vault Construction** | **FAIL — 2ms fast-fail (phase_index 13)** |
| 9 Selector | not reached |

Chronicle: **15 PASS, 1 FAIL**, finalized INCOMPLETE.

### What this confirms
The raw-ingestion → cognition factory executes cleanly from a fresh archive: intake (current-run materialized), structural scan, relevance classification, code-graph enrichment, centrality, CEU grounding, binding envelope, 41.x projection, 75.x activation — all on real NetBox-native source. The Phase-0 intake fix is solid end-to-end through cognition.

### Honest residual gates (not masked)
1. **Phase 8a Vault Construction fail-closes** for a fresh run (2ms — likely a missing input/path in the vault builder). This halts the run before vault + selector.
2. **No selector update (Phase 9)** → the run is not registered in the LENS binding allowlist → LENS bind returns `CLIENT_RUN_NOT_ALLOWED`. So the fresh run is not yet LENS-bindable.
3. **SQO qualification is operator-driven** (the genesis run's S0→S1→S2 were manual `operator:khorrix` advancements) — not auto-produced by the pipeline.

### Verdict — CORRECTED to business objects (phase counts retracted)

Phase counts ("15 PASS / 1 FAIL") are not a product-readiness measure and are retracted as the verdict. The correct measure is business objects produced.

**Highest object produced:** a structural **binding envelope** (`binding/binding_envelope.json` — 30 capability-surface nodes, 17 edges, 10 capability surfaces). A substrate object, not cognition, not an Observation, not a deliverable.

| Business object | cert_05 |
|---|---|
| QualificationState | **NO** (no `sqo/`, no `promotion_state.json`) |
| S-level | **NONE** |
| Answer Objects | **NO** (runtime-produced; no advisory session ran) |
| Observation (governed cognitive output) | **NO** (no `semantic/`, no `convergence/`) |
| Assessment Package | **NO** |
| LENS-consumable | **NO** (`CLIENT_RUN_NOT_ALLOWED`; no manifest; manifest requires semantic/spine/sqo/vault artifacts absent here) |
| THORR-synthesizable | **NO** (no binding, no Answer Objects) |
| Operator advisory session | **NO** (no binding) |

**Three-tier classification:**
- **FACTORY — COMPLETE from raw.** Structural substrate produced (2540 nodes, 16046 relationships, centrality, CEU grounding, 41.x/75.x projection, binding envelope). Zero artifact reuse. This works.
- **COGNITION — NOT PRODUCED.** Run never reached semantic emergence; no SPE propositions, no spine, no SQO qualification, no S-level, vault empty. Structural substrate ≠ governed meaning. No Observation.
- **DELIVERY — ZERO.** No manifest, no LENS binding, no Answer Objects, no THORR surface, no assessment package, no advisory session.

**The honest gate is not "Phase 8a."** It is: a fresh raw run today reaches the FACTORY tier and stops. Everything downstream of structural substrate — semantic emergence, qualification, binding, advisory, packaging — is either un-run or operator-manual. Even the one governed specimen (genesis_e2e_03) reached S2 by *manual operator advancement* and bound to LENS via a *hand-authored manifest*; neither is automatic. The next real work is not a vault-builder patch — it is deciding whether COGNITION (semantic + SQO) and DELIVERY (binding + advisory) are automated for fresh runs, or driven by the operator in the concierge model.
