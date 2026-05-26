# Marketplace Architecture — Domain Cognition Module Pattern

Stream: PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01
Classification: G1 — Architecture-Mutating
Date: 2026-05-26
Runtime anchor: PR #16 — proven SQO execution bridge as first domain cognition module instance

---

## 1. Marketplace is NOT Plugins

Marketplace is domain cognition modules attached to the PI Spine. PR #16 proved what a domain cognition module looks like operationally: not a separate product bolted on, but an interpretation layer that reads PI Core state and projects governed operational meaning to operators.

The distinction matters because of what PR #16 demonstrated:

- **Plugins are optional.** The SQO execution bridge is NOT optional — without it, LENS cannot orchestrate governed authority actions. The domain cognition module is the path through which PI Core intelligence reaches operators.
- **Plugins are additive.** The SQO execution bridge does NOT add features on top of a complete product — it TRANSFORMS PI Core artifacts (promotion_state.json, review_obligations.json, qualification_blockers.json, promotion_event_log.jsonl) into operational meaning through workspace resolution, action derivation, and learning enrichment.
- **Plugins are isolated.** The SQO execution bridge PERMEATES — it operates at the server level (OperatorWorkflowResolver), the adapter level (LensSQOOrchestrationAdapter), the component level (SoftwareIntelligenceField), and the governance level (SQOActionEngine). It is present at every layer from disk artifacts to user interaction.

---

## 2. The Domain Cognition Module Pattern

Every domain cognition module follows the architecture proven by PR #16:

```
PI CORE ARTIFACTS (on disk)
        │ read by
        ▼
WORKSPACE RESOLVER (server-side)
        │ produces
        ▼
ORCHESTRATION ADAPTER (derivation)
        │ computes
        ▼
GOVERNED ACTIONS + LEARNING CONTEXT
        │ rendered by
        ▼
LENS PROJECTION SURFACE (React)
        │ operator action → POST to API
        ▼
AUTHORITY EXECUTION ENGINE (validate → snapshot → apply → persist → replay)
        │ writes to
        ▼
PI CORE ARTIFACTS (append-only event log + state artifacts)
```

### Module Pattern Contract

Every domain cognition module MUST:

1. **Read PI Core corridor outputs.** PR #16 proof: `OperatorWorkflowResolver.resolveAuthorityWorkspace()` reads promotion_state, review_obligations, qualification_blockers, and event_log from disk. The module never writes to PI Core artifacts through LENS.

2. **Produce domain-specific operational projections.** PR #16 proof: `LensSQOOrchestrationAdapter.deriveOrchestrationActions()` transforms raw workspace state into guided action objects with priority, authority requirements, evidence references, and learning context.

3. **Maintain authority execution boundary.** PR #16 proof: mutations flow through `SQOActionEngine.executeAuthorityAction()` with role validation, pre-mutation snapshots, replay validation, and crash rollback. LENS never mutates directly.

4. **Derive learning from operational history.** PR #16 proof: `SQOLearningSignalDerivation.deriveLearningSignals()` reads the append-only event log. Learning is explicit, replayable, auditable, and read-only relative to authority.

5. **Project through LENS personas.** PR #16 proof: `SoftwareIntelligenceField.jsx` renders GuidedActionCard with action metadata, evidence grids, workflow stamps, and learning context. The component is a projection of adapter computation — not an independent intelligence source.

6. **Be replaceable.** Swapping the domain module changes operational vocabulary without changing PI Core artifacts. The same SQO state machine, interpreted through Infrastructure Intelligence instead of Software Intelligence, would produce infrastructure-domain operational cognition.

---

## 3. Software Intelligence as First Module

Software Intelligence is the FIRST domain cognition module — proven, not specified.

| Pattern Element | PR #16 Implementation |
|---|---|
| Domain | Software systems — codebases, qualification lifecycle |
| Evidence source | SQO authority artifacts (promotion_state, review_obligations, blockers, event_log) |
| Workspace resolution | `OperatorWorkflowResolver.resolveAuthorityWorkspace()` |
| Action orchestration | `LensSQOOrchestrationAdapter.deriveOrchestrationActions()` |
| Learning derivation | `SQOLearningSignalDerivation.deriveLearningSignals()` |
| Learning enrichment | `LensSQOOrchestrationAdapter.enrichActionsWithLearning()` |
| Authority execution | `SQOActionEngine.executeAuthorityAction()` — 12 actions |
| Governance doctrine | Append-only events, compensating corrections, non-automatable boundaries |
| Gap register | GAP-01 through GAP-08 — honest implementation boundary |

### What Makes Software Intelligence Constitutional

Software Intelligence establishes precedent through working code:

1. **The execution bridge pattern.** LENS → API → validator → engine → persist → event → reload. Any future domain module follows this pattern.
2. **The learning derivation pattern.** Event log → classify → pattern → signal → enrich → display. Any future domain module derives learning from its operational history this way.
3. **The authority boundary pattern.** LENS projects. SQO executes. Learning advises. The operator decides. No system actor self-authorizes.
4. **The gap register pattern.** Honest documentation of what is proven vs what is pending. GAP-01 through GAP-08 are the template for future module boundary documentation.

---

## 4. Future Domain Cognition Modules

Each module follows the same PI Core + domain interpretation architecture. The PI Core computation is identical — only the domain interpretation layer changes.

| Module | Domain | Interpretation Focus |
|---|---|---|
| Infrastructure Intelligence | Cloud infrastructure, network topology | Capacity, failover, network coupling |
| Cyber Intelligence | Security posture, threat surface | Attack surface, trust anchors, compliance |
| Regulatory Intelligence | Compliance frameworks, audit governance | Control objectives, evidence packages |
| Supply Chain Intelligence | Software supply chain, dependency governance | Dependency concentration, vendor risk |
| Clinical Intelligence | Healthcare systems, clinical workflows | Clinical pathways, data governance |
| Financial Systems Intelligence | Financial technology, transaction processing | Transaction authority, settlement corridors |

Each would implement the same architecture: workspace resolver → orchestration adapter → authority execution engine → learning derivation → LENS projection. The PI Core artifacts and SQO state machine remain unchanged.

---

## 5. Module Registration Model

Module registration is constitutionally defined; implementation is deferred. The registration schema follows from the proven architecture:

```json
{
  "module_id": "software_intelligence",
  "module_version": "1.0",
  "domain": "software_systems",
  "workspace_resolver": "OperatorWorkflowResolver",
  "orchestration_adapter": "LensSQOOrchestrationAdapter",
  "authority_engine": "SQOActionEngine",
  "learning_derivation": "SQOLearningSignalDerivation",
  "event_log": "promotion_event_log.jsonl",
  "gap_register": "SQO_GAP_REGISTER.md"
}
```

### Registration Rules

1. Only one domain module may be active per specimen at a time
2. Module must declare its workspace resolver, adapter, and authority engine
3. Module must produce a gap register documenting implementation boundaries
4. Module registration does not activate the module — corridor evaluation determines activation

---

## 6. Module Governance

Domain cognition modules that introduce new architectural concepts are G1-governed. PR #16 was G1 — it introduced the execution bridge pattern, the learning derivation pattern, and the gap register pattern.

Implementation streams that consume a constitutionally defined module are G2.

---

## 7. Marketplace Strategic Alignment

This architectural definition respects the frozen commercial identity:

| Frozen Element | Alignment |
|---|---|
| Category: Program Intelligence | Domain modules are WITHIN Program Intelligence |
| Wedge: Structural Execution Visibility | SW-Intel enriches the wedge with operational cognition |
| Product family: Signäl | Domain modules are consumed BY Signäl packages |
| Tier 1A/1B packaging | Domain modules are implementation infrastructure, not product tiers |
| STATIC/TEMPORAL separation | Domain modules operate on STATIC capabilities today |

Marketplace is the governed ecosystem of domain cognition modules. Software Intelligence is the first — proven, not promised.
