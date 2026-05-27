# Implementation Semantics — PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01

Per §5.5 — this stream defines reusable concepts consumed by future streams.

---

## 1. Primitive Inventory

| Name | Source | Purpose | Reuse Status |
|---|---|---|---|
| Execution Bridge Pattern | PR #16 (proven) | LENS → API → validator → engine → persist → event → reload | REUSABLE — all future domain modules follow this pattern |
| Learning Derivation Pattern | PR #16 (proven) | Event log → classify → pattern → signal → enrich → display | REUSABLE — any domain module derives learning from its event history |
| Authority Boundary Pattern | PR #16 (proven) | LENS projects. SQO executes. Learning advises. Operator decides | REUSABLE — constitutional separation for all domain modules |
| Gap Register Pattern | PR #16 (proven) | Honest boundary documentation between verified and pending | REUSABLE — all domain modules document their implementation boundary |
| Domain Cognition Module architecture | CONSTITUTIONAL_DEFINITION.md | PI Core + domain interpretation + LENS projection | REUSABLE — all future domain modules |
| Cognition Function taxonomy (CF-01 through CF-10) | CONSTITUTIONAL_DEFINITION.md §5 | Classification of PI Core → domain module interpretation | REUSABLE — every domain module defines its CF set |
| Persona consumption model | PERSONA_CONSUMPTION_SPEC.md | Per-persona projection differentiation | REUSABLE — pattern for any domain module |
| Pressure-topology integration model | PRESSURE_TOPOLOGY_SPEC.md | Pressure zones → operational topology | REUSABLE — operational cognition topology pattern |

---

## 2. Input Contracts

### Execution Bridge — Input

| Input | Source | Consumed By |
|---|---|---|
| `promotion_state.json` | SQO authority artifacts (disk) | `OperatorWorkflowResolver.resolveAuthorityWorkspace()` |
| `review_obligations.json` | SQO authority artifacts (disk) | `OperatorWorkflowResolver.resolveAuthorityWorkspace()` |
| `qualification_blockers.json` | SQO authority artifacts (disk) | `OperatorWorkflowResolver.resolveAuthorityWorkspace()` |
| `promotion_event_log.jsonl` | Append-only event log (disk) | `SQOLearningSignalDerivation.deriveLearningSignals()` |

### Learning Derivation — Input

| Input | Source | Consumed Fields |
|---|---|---|
| `promotion_event_log.jsonl` | Append-only event log | `action`, `target`, `semantic_disposition`, `timestamp`, `prior_state`, `resulting_state` |

---

## 3. Output Contracts

### Execution Bridge — Output

| Output | Producer | Consumer |
|---|---|---|
| Workspace object | `resolveAuthorityWorkspace()` | `deriveOrchestrationActions()` |
| Guided action array | `deriveOrchestrationActions()` | `SoftwareIntelligenceField.jsx` |
| Learning signals | `deriveLearningSignals()` | `enrichActionsWithLearning()` |
| Learning context on actions | `enrichActionsWithLearning()` | `GuidedActionCard` rendering |
| Authority event | `executeAuthorityAction()` | `promotion_event_log.jsonl` (append) |

### Learning Derivation — Output

| Output | Content | Consumer |
|---|---|---|
| `learning_signals.json` | action_patterns, progression_history, temporal_signals, guidance_signals | `OperatorWorkflowResolver` → workspace → adapter |

---

## 4. Calibration Assumptions

| Assumption | Value | Status |
|---|---|---|
| Learning signal derivation is non-critical | Failure caught by try/catch, does not block action execution | PROVEN — `try { refreshLearningSignals(...) } catch (_) {}` |
| Event log is single-writer | Only `PromotionEventWriter` appends to event log | PROVEN — single `fs.appendFileSync` call |
| Learning never affects authority | Learning context is advisory-only, never changes priority/eligibility | PROVEN — `action.learningContext = null` default, set only by enrichment |
| Page reload re-derives all state | No stale projection after mutation | PROVEN — `window.location.reload()` after action execution |

---

## 5. Extension Points

| Extension | Current State | Future Direction |
|---|---|---|
| Graph-based progression intelligence | Not implemented (GAP-08) | Action dependency graph, corridor projections |
| Prescriptive learning | Not implemented (GAP-04) | Requires separate doctrine review — governance-sensitive |
| Evidence reference enrichment | Empty arrays (GAP-01) | Populate obligation-level evidence refs in LENS fetch payload |
| Confirmation ceremony | Not implemented (GAP-03) | Preview before/after state for critical actions |
| Staleness detection | Field exists, no consumer (GAP-07) | Compare `derived_from_events` against actual log length |

---

## 6. Module Responsibility Map

| File | Responsibility | Layer |
|---|---|---|
| `SQOActionEngine.server.js` | Authority execution — validate, snapshot, apply, persist, replay | Server / Authority |
| `SQOAuthorityValidator.server.js` | Role-action authorization, non-automatable boundaries | Server / Governance |
| `PromotionEventWriter.server.js` | Append-only event emission with semantic disposition | Server / Lineage |
| `SQOLearningSignalDerivation.server.js` | Event log analysis — patterns, progression, temporal, guidance | Server / Learning |
| `OperatorWorkflowResolver.server.js` | Workspace assembly from SQO artifacts + learning signals | Server / Resolution |
| `LensSQOOrchestrationAdapter.js` | Action derivation + learning enrichment from workspace | Adapter / Orchestration |
| `SoftwareIntelligenceField.jsx` | Guided action card rendering + operator interaction | LENS / Projection |
| `SQO_GAP_REGISTER.md` | Implementation boundary documentation | Governance / Boundary |
| `SQO_EXECUTION_BRIDGE_STATUS.md` | Bridge verification record | Governance / Status |
| `SQO_REVERT_SUPERSEDE_DOCTRINE.md` | Mutation governance doctrine | Governance / Doctrine |
