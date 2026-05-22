# AI ASSISTANCE GOVERNANCE CONTRACT

> **Status:** LOCKED — Canonical governance contract for AI participation in Program Intelligence operations.

---

## 1. Purpose

This contract defines how Claude/API AI assistance may participate in Program Intelligence onboarding, governance, and cognitive formation — and what it must never do.

Every AI-assisted action must produce governed, replayable, operator-auditable artifacts. No hidden reasoning. No silent mutation. No authority escalation.

---

## 2. Authority Ceiling

**AI authority ceiling: L3 — ADVISORY_NON_MUTATING**

AI may:
- Produce CANDIDATE artifacts (proposals, suggestions, drafts)
- Inspect evidence and surface observations
- Synthesize governed evidence into explanation (75.x bounded)
- Identify patterns, gaps, anomalies, and Hero Moment candidates

AI may NOT:
- Produce artifacts above CANDIDATE status
- Mutate canonical truth (CSR, promotion state, S-level, lineage)
- Bypass operator review gates
- Self-promote suggestions to accepted status
- Maintain hidden state between sessions that influences decisions

---

## 3. AI Assistance Object Types

Every AI-assisted action produces a governed object logged to the chronicle:

### 3.1 ai_assistance_event

The base envelope for all AI participation. Every AI action wraps in this.

```json
{
  "event_id": "AI-{client}-{run}-{sequence}",
  "event_type": "INSPECTION | PROPOSAL | EXPLANATION | RECONCILIATION | IMPROVEMENT",
  "timestamp": "{utc_iso}",
  "phase": "{pipeline_phase or governance_phase}",
  "input_context": {
    "artifacts_read": ["{paths}"],
    "evidence_refs": ["{evidence_anchors}"],
    "prompt_hash": "{sha256 of input prompt}"
  },
  "output": {
    "object_type": "{ai_suggestion | ai_detected_gap | ai_reconciliation_proposal | ai_chronicle_draft | ai_learning_candidate | ai_assisted_intake_note}",
    "object_ref": "{path to produced artifact}"
  },
  "authority_ceiling": "L3",
  "requires_operator_decision": true,
  "operator_decision": null,
  "replay_trace": {
    "deterministic_inputs": true,
    "model_id": "{claude-opus-4-6 | etc}",
    "temperature": 0
  }
}
```

### 3.2 ai_suggestion

A proposed action, finding, or artifact modification.

```json
{
  "suggestion_id": "SUGG-{sequence}",
  "parent_event": "AI-{event_id}",
  "suggestion_type": "HERO_MOMENT_CANDIDATE | LEARNING_CANDIDATE | ENRICHMENT_STRATEGY | NARRATIVE_DRAFT | INVESTIGATION_PATH | GAP_DETECTION | ANOMALY_FLAG",
  "confidence": "{0.0-1.0}",
  "rationale": "{why this is suggested}",
  "evidence_refs": ["{structural evidence backing}"],
  "status": "PROPOSED | ACCEPTED | REJECTED | DEFERRED",
  "operator_note": null
}
```

### 3.3 ai_detected_gap

An identified deficiency in evidence, coverage, or pipeline capability.

```json
{
  "gap_id": "GAP-AI-{sequence}",
  "parent_event": "AI-{event_id}",
  "gap_type": "EVIDENCE_GAP | ADAPTER_GAP | EXTRACTION_GAP | COVERAGE_GAP | GROUNDING_GAP",
  "severity": "CRITICAL | HIGH | MEDIUM | LOW",
  "description": "{what is missing}",
  "evidence_refs": ["{what evidence points to the gap}"],
  "remediation_suggestion": "{how it might be addressed}",
  "status": "IDENTIFIED | ACKNOWLEDGED | REMEDIATED | ACCEPTED_AS_LIMITATION"
}
```

### 3.4 ai_chronicle_draft

An AI-generated narrative section for chronicle composition.

```json
{
  "draft_id": "DRAFT-{chapter}-{sequence}",
  "parent_event": "AI-{event_id}",
  "chapter_ref": "{chronicle chapter}",
  "semantic_phase": "{EMERGENCE | FORMATION | etc}",
  "authority_level": "75.x",
  "prose": "{narrative text}",
  "proof_refs": ["{spine objects, checkpoints, evidence}"],
  "prohibitions_enforced": 13,
  "status": "DRAFT | REVIEWED | ACCEPTED | REJECTED"
}
```

### 3.5 ai_learning_candidate

An AI-identified learning event candidate from onboarding experience.

```json
{
  "learning_id": "LRNE-AI-{sequence}",
  "parent_event": "AI-{event_id}",
  "category": "{TIER_CLASSIFICATION_GAP | EVIDENCE_TYPE_GAP | etc}",
  "capability_class": "{SEMANTIC_DERIVATION | EVIDENCE_INTAKE | etc}",
  "description": "{what was learned}",
  "evidence_refs": ["{evidence of the learning}"],
  "propagation_target": "{what pipeline component benefits}",
  "status": "PROPOSED"
}
```

### 3.6 operator_decision_event

The operator's response to any AI-produced object.

```json
{
  "decision_id": "OPD-{sequence}",
  "ai_event_ref": "AI-{event_id}",
  "object_ref": "{suggestion/gap/draft/learning being decided}",
  "decision": "ACCEPT | REJECT | DEFER | MODIFY",
  "operator": "{operator_id}",
  "rationale": "{optional}",
  "timestamp": "{utc_iso}",
  "modifications": "{if decision is MODIFY, what changed}"
}
```

---

## 4. Allowed AI Actions by Phase

| Phase | Allowed AI Actions | Required Logging |
|-------|-------------------|-----------------|
| Source Intake | Inspect archive structure, flag anomalies | ai_assistance_event + ai_detected_gap |
| Pipeline Execution | Diagnose failures, explain outcomes | ai_assistance_event |
| Structural Analysis | Surface Hero Moment candidates, explain topology | ai_suggestion (HERO_MOMENT_CANDIDATE) |
| Semantic Derivation | SDC extraction (Phase 3b, explicit opt-in) | ai_assistance_event (deterministic) |
| Proposition Derivation | Quality assessment, confidence validation | ai_assistance_event |
| Governance Review | Explain findings, contextualize disputes | ai_assistance_event (EXPLANATION) |
| Enrichment | Propose strategy, map evidence | ai_suggestion (ENRICHMENT_STRATEGY) |
| Chronicle Composition | Draft narrative from governed objects | ai_chronicle_draft |
| Learning Capture | Identify learning candidates | ai_learning_candidate |

---

## 5. Forbidden AI Actions (Non-Negotiable)

| # | Forbidden Action | Enforcement |
|---|-----------------|-------------|
| F01 | Mutate promotion_state.json | Write protection — operator-only |
| F02 | Mutate canonical CSR | Write protection — operator-only |
| F03 | Change S-level | Non-automatable boundary |
| F04 | Accept/reject propositions | Non-automatable boundary |
| F05 | Promote learning events beyond PROPOSED | Operator lifecycle gate |
| F06 | Generate chronicle without proof refs | 75.x enforcement |
| F07 | Maintain hidden session state | Replay-safe contract |
| F08 | Self-escalate authority above L3 | Authority ceiling enforcement |
| F09 | Create marketplace modules | Premature — modules emerge from patterns |
| F10 | Overwrite replay lineage | Append-only enforcement |
| F11 | Fabricate evidence | Evidence-first doctrine |
| F12 | Infer human motive/behavior | 13 absolute prohibitions |

---

## 6. Replay-Safe AI Interaction Contract

Every AI interaction must satisfy:

1. **Input reproducibility:** Same prompt + same evidence → same structured output
2. **Prompt logging:** SHA256 hash of input prompt stored in ai_assistance_event
3. **Model identification:** Model ID and temperature logged
4. **No hidden memory:** AI does not carry unlogged context between sessions
5. **Deterministic preference:** Temperature 0 preferred. Sampling only where documented.
6. **Audit trail:** Complete chain from input → AI output → operator decision → mutation (if any)

---

## 7. AI Assistance Maturity Model

| Maturity | Description | Current State |
|----------|-------------|---------------|
| M0: Manual | No AI assistance. Operator executes all phases manually. | SURPASSED |
| M1: Advisory | AI inspects and explains. All actions manual. | OPERATIONAL (Phase 3b, current) |
| M2: Proposal | AI proposes suggestions and candidates. Operator decides. | SPECIFIED (this contract) |
| M3: Pattern | AI applies learned patterns. Operator approves batches. | FUTURE — requires learning promotion |
| M4: Governed Automation | AI executes proven capabilities. Operator handles novelty. | FUTURE — requires capability promotion |
| M5: Marketplace | AI agents participate as governed marketplace consumers. | FUTURE — requires Cortex architecture |

**Current target: M2 (Proposal).** Move to M3 only after learning promotion pipeline is operational and operator-validated.

---

## 8. Enforcement

This contract is enforced by:

1. **CLAUDE.md §3.4:** No interpretation without authorization
2. **CLAUDE.md §16.5:** Fail-closed architecture memory enforcement
3. **Non-automatable boundaries:** 7 SQO boundaries hold
4. **L3 authority ceiling:** AI proposes, never self-authorizes
5. **Replay-safe logging:** All AI actions produce auditable artifacts
6. **Operator governance:** Every AI output requires human decision before mutation
