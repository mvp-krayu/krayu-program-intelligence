# MANDATORY QUESTIONS — ANSWERED

> **Status:** LOCKED — Answers to the 12 mandatory questions defined in the stream contract.

---

## 1. What is the exact difference between governed semantic replay and cognitive genesis replay?

**Governed semantic replay** operates on already-materialized semantic substrates — SDC outputs, CSR domains, vault claims, topology artifacts. It replays governance over existing artifacts to prove the governance lifecycle transfers. The BlueEdge RC chronicle is the proven reference.

**Cognitive genesis replay** operates from raw onboarding intake — source archives, evidence files, structural extraction. It captures cognition forming from nothing. The genesis replay includes everything semantic replay covers, PLUS the upstream origin layer: source discovery, intake normalization, first topology emergence, first Hero Moments, and the DISCOVERY semantic phase.

Genesis replay is the superset. Semantic replay is a corridor within it.

---

## 2. Where does cognition begin?

Cognition begins at **evidence boundary establishment** — the moment the system first encounters raw client evidence (Pipeline Phase 1: Source Boundary). Before this moment, the system has no understanding of the client. After this moment, structural cognition has begun.

The chronicle must capture this moment. The DISCOVERY semantic phase exists for this purpose.

---

## 3. At what phase can Hero Moments first appear?

Hero Moments can appear as early as **Phase 3 (Structural Extraction)** — when the first topology materializes. The NetBox specimen proves this: all 6 documented Hero Moments emerged from PATH A structural analysis (Phases 3.6–3.7), before any semantic qualification.

In principle, Hero Moments could appear at Phase 1–2 (Intake) if the source structure itself is surprising (e.g., unexpected monorepo layout, generated code ratio, vendor dependency dominance). But the proven first emergence is Phase 3.

---

## 4. How should raw intake be captured as replayable cognition?

Through **chronicle event emission inline during pipeline execution:**

1. Pipeline Phase 1 emits `source_discovery` and `evidence_acquisition` chronicle events
2. Each event captures: what was encountered, what evidence refs ground it, what was ambiguous
3. Events are appended to `chronicle_events.jsonl` (append-only, replay-safe)
4. Phase boundaries freeze `chronicle_checkpoint` artifacts
5. The accumulation is deterministic: same inputs + same registry state → same events

The chronicle does not wait for topology to exist. It observes evidence arriving.

---

## 5. How should AI assistance participate without becoming hidden authority?

Through the **AI Assistance Governance Contract:**

1. Every AI action produces a governed `ai_assistance_event` with input context, evidence refs, and authority ceiling (L3)
2. Every AI suggestion requires `operator_decision_event` before any mutation
3. AI interaction is logged with prompt hash, model ID, and temperature for replay auditability
4. No hidden memory — AI does not carry untracked reasoning between sessions
5. AI authority ceiling is L3 (ADVISORY_NON_MUTATING) — fixed per contract, not negotiable

The key invariant: **AI assistance is not AI authority.** The system's moat is "AI inside bounded enterprise authority workflows without self-authorizing."

---

## 6. What must be logged when Claude/API assists onboarding?

Every AI-assisted action must log:

| Field | Purpose |
|-------|---------|
| `event_id` | Unique identifier for this AI intervention |
| `event_type` | INSPECTION, PROPOSAL, EXPLANATION, RECONCILIATION, IMPROVEMENT |
| `input_context.artifacts_read` | What evidence the AI examined |
| `input_context.evidence_refs` | Structural evidence anchors |
| `input_context.prompt_hash` | SHA256 of input prompt (replay-safe) |
| `output.object_type` | What the AI produced |
| `output.object_ref` | Path to produced artifact |
| `authority_ceiling` | L3 (fixed) |
| `operator_decision` | ACCEPT, REJECT, DEFER, MODIFY |
| `replay_trace.model_id` | Which model |
| `replay_trace.temperature` | Sampling config |
| `timestamp` | UTC ISO |

No hidden mutation. No untracked reasoning influence. No authority escalation.

---

## 7. How do learning events become future capabilities?

Through the **Learning-to-Capability Pipeline:**

```
OBSERVED → PROPOSED → REVIEWED → PROMOTED → CONSUMABLE → CAPABILITY_CANDIDATE → MODULE_CANDIDATE
```

A learning becomes a CAPABILITY_CANDIDATE when: the same category of learning appears in 3+ specimens, addresses the same structural gap, measurably improves outcomes, generalizes beyond one specimen, and fits the governed replay-safe model.

A capability becomes a MODULE_CANDIDATE when: it has been CONSUMABLE for 5+ onboardings, requires no operator overrides, can be packaged independently, and addresses a recurring customer need.

Every transition from PROPOSED onward requires operator governance. AI proposes; AI does not promote.

---

## 8. When does a repeated capability become a marketplace/module candidate?

When ALL of the following hold:

1. The capability has been observed as a learning in 3+ specimens (CAPABILITY_CANDIDATE threshold)
2. The capability has been CONSUMABLE for 5+ onboardings without operator override
3. The capability can be isolated from the core pipeline as an independent module
4. The capability addresses a recurring customer need with commercial value
5. The capability can operate under governed contracts without pipeline internals
6. An operator has explicitly approved MODULE_CANDIDATE status

Modules and marketplace emerge from repeated governed onboarding patterns. They are not designed prematurely in abstraction.

---

## 9. How does the Chronicle behave when cognition starts at intake?

The Chronicle gains a **DISCOVERY semantic phase** (Chapter 0) before EMERGENCE:

- DISCOVERY captures: source boundary, evidence acquisition, intake ambiguity, first structural signals
- Chronicle events emit inline from Phase 1 onward (not post-hoc)
- Hero Moments are first-class chronicle objects encountered during traversal
- AI interventions are traced in the cognitive lineage
- Z1-Z5 zoom applies to DISCOVERY phase as to all others

The chronicle becomes a runtime artifact that accumulates during onboarding, not a post-hoc compilation. Events exist before the chronicle is compiled. The compilation renders accumulated events as a navigable cognitive traversal instrument.

---

## 10. What must remain human-governed?

These actions require operator authority and must NEVER be automated:

1. **S-state transitions** (S0→S1, S1→S2, S2→S3) — qualification advancement
2. **Proposition acceptance/rejection** — semantic disposition
3. **Learning promotion** (PROPOSED → REVIEWED → PROMOTED) — learning governance
4. **Capability candidacy** — pattern recognition requires operator judgment
5. **Module candidacy** — commercial/architectural judgment
6. **Chronicle certification** — "this chronicle is REPLAY-CERTIFIED"
7. **Arbitration resolution** — contested governance requires human authority
8. **Permanent insufficiency** — determination that evidence does not support progression

The non-automatable boundaries (7 SQO boundaries) remain absolute.

---

## 11. What can safely be AI-assisted?

These actions benefit from AI assistance under governed contracts:

1. **Evidence inspection** — AI examines source structure, topology, evidence files
2. **Gap detection** — AI identifies missing adapters, extraction failures, coverage gaps
3. **Hero Moment candidate surfacing** — AI flags structural surprises for operator review
4. **Narrative drafting** — AI composes chronicle prose from governed objects (75.x bounded)
5. **Enrichment strategy** — AI proposes which weak claims could be strengthened
6. **Learning candidate identification** — AI proposes learning events from friction
7. **Failure diagnosis** — AI explains why a pipeline phase failed
8. **Reconciliation assistance** — AI maps evidence between sources

All AI-assisted actions produce governed objects. All require operator decision before mutation.

---

## 12. What must never become autonomous?

1. **Truth mutation** — client semantic truth must never be silently altered by AI
2. **Qualification advancement** — S-state transitions require operator governance
3. **Governance bypass** — non-automatable boundaries are absolute
4. **Replay lineage overwrite** — lineage is append-only
5. **Hidden reasoning** — all AI influence must be logged
6. **Authority escalation** — L3 ceiling is fixed, not negotiable
7. **Module creation** — marketplace modules emerge from patterns, not AI design
8. **Cortex orchestration** — agentic cognitive orchestration is FUTURE, not autonomous
9. **Cross-client learning transfer** — learnings from one client do not automatically apply to another
10. **Evidence fabrication** — evidence-first: no evidence → no output

The fundamental invariant: **the system governs AI, not the reverse.**
