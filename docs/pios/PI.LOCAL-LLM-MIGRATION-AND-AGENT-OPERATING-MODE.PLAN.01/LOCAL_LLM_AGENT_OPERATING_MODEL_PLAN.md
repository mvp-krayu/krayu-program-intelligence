# Local LLM Migration & Agent Operating Mode — Plan

**Artifact:** PI.LOCAL-LLM-MIGRATION-AND-AGENT-OPERATING-MODE.PLAN.01
**Status:** PLAN — not implementation. No code, no migration, no Sentinel/PSA pilot authorized by this document.
**Date:** 2026-06-12
**Origin:** Architect-posture / authority-separation assessment (this session) + PI.AMOPS-PROPAGATION-DEBT-AUDIT.01.
**Governing rule:** This plan exists so the insight is not lost. **Execution remains focused on the current onboarding/pipeline gate.** Local LLM work and agent-governance work are DEFERRED behind Factory → Cognition → Delivery closure.

> **HARD CONSTRAINT:** Nothing in §§2–5 (target model, backends, THORR migration, agent gate) may begin until §6 (Track A pipeline closure) is signed off. This document is a map, not a start gun.

---

## 1. Current Problem

Claude (this operating model) currently performs five roles in one undifferentiated cognitive process:

- **PI Software Architect** — classifies architecture, owns canonical meaning
- **Implementation Orchestrator** — decomposes and sequences work
- **Implementation Agent** — writes code, tests, artifacts
- **AMOps Steward** — propagates mutations to vault/registry/terminology
- **THORR-like synthesis/projection assistant** — produces narrative/answers

This produces two structurally distinct failures.

### A. Authority collapse: producer = classifier = certifier

The same process that *produces* an architectural change also *classifies* it and *certifies* its propagation. This is the exact configuration SQO declares illegal (the producer cannot self-promote; S1→S2 requires a separate L5 authority). It is the root cause of the Investigation Runtime / Answer Objects / AMOps propagation breaches — not a discipline lapse but a **loss of architect posture**: mutations emerged and were processed as implementation because no separate authority was perceiving them as architecture (`Discovery → Implementation` with no stewardship between). See PI.AMOPS-PROPAGATION-DEBT-AUDIT.01.

### B. Cost / runtime collapse

Premium Anthropic/Claude-Code tokens are spent on **every** role, including roles that are bounded, repeatable, or purely deterministic and should run on cheaper, local, or backend-agnostic engines. Product synthesis (THORR) and projection are tied to Claude Code as their runtime LLM when they should be backend-agnostic consumers of already-governed context. The operating model is both **structurally wrong** (no separation of duties) and **economically wrong** (premium cost for non-premium roles).

These two problems share one fix: **separate the roles, then let each role choose the cheapest backend that meets its bar.**

---

## 2. Target Operating Model

Role-separated authorities, each bounded by a ceiling above it (the SQO authority-ceiling pattern applied to the agent itself). The answer is *more authorities with ceilings*, not more CLAUDE.md.

```
Founder            — constitutional ceiling / final authority
   ▲ (escalation; SQO S2→S3 analogue)
PI Software Architect Agent (PSA)
   ▲ (projection of verdict, not authorship)
Implementation Orchestrator (IO)
   ▲
Implementation Agents (IA)

THORR / Synthesis Runtime   — product synthesis; consumes governed outputs; backend-agnostic
LENS                        — projection surface; consumes governed outputs only
```

| Role | Authority | May NOT |
|---|---|---|
| **Founder** | Constitutional decisions, new-authority creation, final ceiling on PSA | — |
| **PI Software Architect (PSA)** | Architecture-memory authority: classify G1/G2/G3, mutation maturity (A0→A3), write canonical state / terminology / registry, certify propagation, hold the commit gate | Write feature code; ship-incentive absent |
| **Mutation Sentinel** | Detect candidate mutations on the change-stream via signature + novelty channels; raise to PSA | Classify, certify, or suppress its own findings |
| **Implementation Orchestrator (IO)** | Decompose work, route to executors, enforce gates, escalate boundary-crossings | Classify mutations; certify memory |
| **Implementation Agents (IA)** | Code, test, refactor within bounded task; report what changed | Mutate architecture memory; classify own output |
| **THORR / Synthesis Runtime** | Product synthesis/projection for users from governed SynthesisContext | Browse code, mutate architecture, hold AMOps authority, perform hidden discovery |
| **LENS** | Projection surface | Synthesize cognition (consumes governed outputs only — Consumer Authority Consolidation) |

**Mutation qualification ladder (PSA-owned):** A0 Unrecognized → A1 Detected (auto, Sentinel) → A2 Classified (PSA authority) → A3 Propagated & Certified (PSA authority). The producer reaches A1; it cannot self-promote to A2/A3.

**PSA memory load contract (AQ-001 applied to architecture memory):** PSA does not "load the vault." It loads a *mutation-scoped* minimum set determined by mutation class, governed by an `ARCHITECTURE_MEMORY_MANIFEST` (terminology lock, discovery registry, sectioned canonical state, boundary/authority contracts, the Sentinel signature set). This prevents attention dilution and memory degradation. *(Design detail — not implemented by this plan.)*

**Mutation Sentinel — two channels:** signature channel (precision; known mutation classes) + novelty channel (recall; anomalous-vs-normal-change-distribution, catches the *unknown* mutation class — where PiOS's biggest discoveries live). Signatures and novelty thresholds are PSA-owned, Founder-auditable, and **not tunable by IO/IA** (no signal suppression — §17.3/§17.16 doctrine). PSA mints new signatures from novelty-channel hits (governed candidate capture).

---

## 3. LLM Backend Strategy

Define a **provider abstraction** so any role can swap its engine without behavior change.

### LLMProvider interface (design sketch — NOT to be implemented in this plan)

```
LLMProvider
  id: anthropic | openai | local | ollama | vllm | lmstudio | hosted-open
  capabilities: { max_context, reasoning_tier, streaming, tool_use, json_mode }
  invoke(request: { system, messages, tools?, schema?, budget }) -> response
  cost_profile: { input_per_1k, output_per_1k, latency_p50, privacy_class }
```

Each runtime role declares a **requirement profile**:

```
RoleRuntimeProfile
  reasoning_depth: low | medium | high | constitutional
  context_size: small | bounded | large
  latency_tolerance: realtime | interactive | batch
  privacy_sensitivity: low | medium | high
  cost_sensitivity: low | medium | high
  acceptable_model_class: [list]
```

A **routing policy** maps `RoleRuntimeProfile → LLMProvider`. No role hardcodes a provider; the policy resolves it.

### Role classification by backend suitability

| Class | Roles | Profile | Backend direction |
|---|---|---|---|
| **A — High-authority / high-reasoning / low-frequency** | Founder advisory, PSA constitutional adjudication | constitutional reasoning, large context, batch-ok, high privacy | **May remain premium** initially; migrate last, only if proven safe |
| **B — Medium-reasoning / bounded context / repeatable** | Mutation Sentinel, Implementation Orchestrator, AMOps checks | medium reasoning, bounded context, interactive | **Candidate for local/cheaper** model |
| **C — Projection / synthesis / product Q&A** | THORR | medium-high reasoning over *governed* context, interactive, cost-sensitive | **Strong candidate for backend-agnostic local/hosted** — consumes governed SynthesisContext, does not rediscover architecture |
| **D — Deterministic / non-LLM** | pipeline checks, artifact validation, lineage checks, source materialization, phase gates | n/a | **No LLM at all** |

Principle: push everything as far down (cheaper/local/deterministic) as its bar allows; keep premium only where reasoning authority genuinely requires it. Authority class (A) migrates **last**, never first (§8).

---

## 4. THORR — First Migration Candidate

THORR is the easiest early target *because of what it is not*:

- THORR should not be Claude Code.
- THORR should not own architecture.
- THORR consumes a strong input contract: SynthesisContext + Answer Objects + evidence + persona + authority ceiling.
- Once that input contract is strong, the backing model is replaceable — weak local answers become **measurable** against governed context, not mysterious.

### THORR target contract

```
INPUT:  SynthesisContext + persona + question/intent + authority ceiling + evidence citations
OUTPUT: answer (bounded by authority ceiling, grounded in cited evidence)

THORR MUST NOT:
  - browse the codebase
  - mutate architecture
  - hold AMOps authority
  - perform hidden discovery
```

If THORR's answer quality drops on a local model, the failure is attributable: either the SynthesisContext was insufficient (fix the context) or the model is under-capable for the bar (route up). Because THORR consumes *governed* context rather than rediscovering architecture, this is the lowest-risk migration in the system. **Deferred behind Track A and provider abstraction — see roadmap.**

---

## 5. Agent Gate Pilot (Sentinel / PSA)

The control-flow gate that would have prevented the breaches:

```
implement → sentinel scan → PSA adjudication → propagation → commit gate
                                                  │
                          commit cannot be emitted until PSA returns A3
```

The gate must live in **control flow (Workflow/orchestration), not in prose** — an instruction to the executor is bypassable; a gate the executor cannot edit is not. Falsification test on first build: re-introduce a stripped Investigation-like primitive and confirm the commit step **cannot emit** until PSA classifies it.

**Status: BLOCKED / DEFERRED until Factory → Cognition → Delivery closure is resolved.**

**Reason:** Building agent governance before the core onboarding pipeline is commercially coherent optimizes the engineering operating model while the product path remains incomplete. Wrong order.

---

## 6. Immediate Priority — Finish Pipeline / Onboarding / NetBox (Track A)

This remains the only active execution track. Before any local-LLM or agent-pilot work, resolve:

- [ ] fresh source materialization confirmed (DONE — `e4abce5`, LIVE_MATERIALIZED_FROM_RAW_ARCHIVE; carry forward)
- [ ] NetBox reaches not only structural substrate but **cognition layers** (open: fresh cert_05 stops at FACTORY tier)
- [ ] determine which cognition stages are AUTO / MANUAL / ABSENT / UNKNOWN (DONE — CROSS_SPECIMEN_AUTOMATION_MATRIX; keep current)
- [ ] compare BlueEdge / StackStorm / NetBox correctly (DONE — matrix; StackStorm = control)
- [ ] restore VAULT lineage clarity (DONE — AMOps full propagation `b1669af`; keep current)
- [ ] identify highest persisted object per run (DONE — fresh run highest = structural binding envelope)
- [ ] resolve **Factory → Cognition → Delivery transition map** (OPEN — the core gate)
- [ ] produce an **operator-led client assessment path** (OPEN — Track B concierge)

**The gate question that must be answerable before broad local-LLM work begins:**

> Can a fresh source snapshot become a qualified observation and client deliverable?

Today the honest answer is **no for a fresh run** (FACTORY only; COGNITION semantic layer not invoked; SQO/binding operator-manual). Closing that is the prerequisite, captured as `PI.FACTORY-COGNITION-DELIVERY-CLOSURE.01`.

---

## 7. Sequenced Roadmap

| Phase | Work | Gate / dependency | Output |
|---|---|---|---|
| **Phase 0 — Current Gate** | Finish NetBox / onboarding / pipeline closure (Factory → Cognition → Delivery) | none — active now | `PI.FACTORY-COGNITION-DELIVERY-CLOSURE.01` |
| **Phase 1 — Manual Commercial Path** | Operator-led onboarding: source → run → qualification → package → advisory. No portal. | Phase 0 signed | First operator-led client assessment |
| **Phase 2 — LLM Provider Abstraction** | Provider interface, config, routing policy, test harness. **No behavior change.** | Phase 0 signed | `LLMProvider` + routing policy (inert) |
| **Phase 3 — THORR Backend-Agnostic Runtime** | Move THORR synthesis off Claude-Code assumptions. Anthropic provider first, then local. | Phase 2 complete | THORR on provider abstraction |
| **Phase 4 — Local THORR Evaluation** | Same SynthesisContext through Anthropic vs local. Score: faithfulness, evidence grounding, persona fidelity, authority compliance, hallucination rate, cost/latency. | Phase 3 complete | THORR backend scorecard + go/no-go |
| **Phase 5 — Mutation Sentinel / PSA Pilot** | Build the control-flow gate; falsification test first. | Phase 0 closure **and** Phase 3 | Gate pilot + falsification result |
| **Phase 6 — Broader Local Agent Migration** | Move low-risk agents local: Sentinel novelty scan, artifact summarizer, contract checker, AMOps propagation checker. Keep PSA premium until proven safe. | Phase 5 proven | Role-by-role backend migration |

Sequencing invariant: **Phases 2–6 are blocked on Phase 0.** Phase 5 additionally blocked on Phase 3. Authority-class (A) roles migrate last (Phase 6+), never first.

---

## 8. Non-Negotiable Boundaries

1. Do **not** migrate architecture authority (PSA / Founder) to a local LLM first.
2. Do **not** let a local LLM mutate canonical state.
3. Do **not** let THORR become an architect (no code browsing, no architecture mutation, no hidden discovery).
4. Do **not** let executor agents classify their own mutations (producer ≠ classifier).
5. Do **not** let LLM migration distract from the NetBox/product pipeline gate.
6. Do **not** optimize token cost by weakening governance. Cost is reduced by *separating roles and routing each to its cheapest sufficient backend* — never by removing a gate.

---

## 9. Decision Required

**Immediate next work is NOT local LLM implementation.**

**Immediate next work is: finish Factory → Cognition → Delivery closure** (Phase 0 / Track A), answering "Can a fresh source snapshot become a qualified observation and client deliverable?"

**Parallel, as architecture *planning* only (no implementation):** the LLM provider abstraction and agent operating model are now captured in this document. They are not to be built until the current product gate is closed.

Recommendation: proceed to scope `PI.FACTORY-COGNITION-DELIVERY-CLOSURE.01` as the next active stream. This plan is the durable record of the operating-model insight; it waits.

---

## 10. Status

- This is a **plan**. No code. No local-LLM integration. No Sentinel/PSA pilot. No THORR rewrite. Temporal remains locked.
- Insight is preserved here so it is not lost to context compaction.
- Active execution returns to the onboarding/pipeline gate (Phase 0).
