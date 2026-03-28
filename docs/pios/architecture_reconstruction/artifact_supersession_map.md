# Artifact Supersession Map

Stream: A.2 — PiOS Architecture Post-Execution Consolidation
Date: 2026-03-28
Source: ASM-v1

---

## Method

Supersession detection is explicit-only. Only artifacts where a successor is directly evidenced by commit history, changelog references, or handover documents are recorded. No implicit or similarity-based supersession is recorded as confirmed.

---

## Confirmed Supersession Pairs

None confirmed at HIGH confidence.

---

## Recorded Supersession Events (MEDIUM/LOW confidence)

### SUP-001 — WOW Chain Rewiring (In-Place Evolution)

| Field | Value |
|---|---|
| Superseded | 42.23 pre-rewiring WOW chain configuration |
| Superseded By | 42.23/rewiring_plan.md (post-rewiring) |
| Type | IN-PLACE-EVOLUTION |
| Confidence | MEDIUM |
| Evidence | rewiring_plan.md explicitly describes architectural rewiring; prior config implicitly superseded |
| Retained For | Lineage tracing — WOW chain evolution record |

### SUP-002 — run_01 → run_02 Advancement (Prospective)

| Field | Value |
|---|---|
| Superseded | 40.2-40.x run_01_blueedge outputs |
| Superseded By | 40.2-40.x run_02_blueedge outputs (in progress) |
| Type | RUN-ADVANCEMENT |
| Confidence | LOW — PROSPECTIVE ONLY |
| Evidence | Commit e52e389 freezes run_01; commits 711dd16, 3e41f2d show run_02 advancing |
| Status | run_01 REMAINS AUTHORITATIVE until run_02 completes equivalent stages |
| Action Required | Future A.3 consolidation pass needed when run_02 completes |

### SUP-003 — Implicit Prior Binding Approach

| Field | Value |
|---|---|
| Superseded | Hypothetical pre-43.1 binding approach |
| Superseded By | N-020 (43.1 signal_to_structure_binding.md) |
| Type | IMPLICIT-SUPERSESSION |
| Confidence | LOW — NO PRIOR ARTIFACT FOUND |
| Status | Unverifiable from available evidence; recorded for architectural decision lineage only |

---

## Non-Superseded Artifacts (29 nodes)

All governance documents, framework specifications, runtime pipeline outputs (40.2-40.11), semantic shaping layer (41.x), binding layer (43.x), projection layer (44.x), consumer execution layer (42.x), CKR, and integration protocols are current canonical artifacts with no detected supersession.

---

## Supersession Pending — run_02 Tracking

When run_02 reaches equivalent completion to run_01 for each pipeline stage, the following supersession events should be confirmed:

| Future Event | Trigger |
|---|---|
| run_01 40.2 outputs → run_02 40.2 | run_02 40.2 completion confirmed |
| run_01 40.3 outputs → run_02 40.3 | run_02 40.3 completion confirmed |
| (continue per pipeline stage) | (per run_02 advancement) |

These events must be confirmed in a future A.3 (or equivalent) consolidation pass after run_02 completes. They are NOT confirmed here.
