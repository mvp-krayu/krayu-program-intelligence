# Lens — Runtime Persona Activation

Program: Krayu — Program Intelligence Discipline
Stream: D.3 — Lens Runtime Activation
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[lens_runtime_activation]]
→ [[execlens_persona_binding]]
→ [[lens_runtime_state_mapping]]
→ [[lens_runtime_path_enforcement]]

---

## 1. Purpose

This document maps the persona binding defined in [[execlens_persona_binding]] to its runtime implementation in the Lens codebase. It records what the pre-D.3 runtime implements through PERSONA_AUTO_OPEN and PERSONA_GUIDED_FLOWS, what D.3 formalizes through PERSONA_DEPTH_ENVELOPE, and where persona enforcement gaps exist.

Persona in the D.2 contract is a runtime configuration that determines the maximum traversal depth for a session — which panels may be reached and which must remain LOCKED. D.3's contribution to persona activation is making that depth envelope an explicit, queryable constant rather than an implicit consequence of the scripted flow definitions.

---

## 2. Pre-D.3 Persona Implementation

The pre-D.3 runtime implements persona through three mechanisms.

PERSONA_AUTO_OPEN in TraversalEngine.js defines the panels that are opened automatically when a persona is selected. The Exec (EXECUTIVE) persona auto-opens only ['narrative']; the CTO persona auto-opens ['narrative', 'situation', 'signals']; the Analyst persona auto-opens ['narrative', 'signals']. This mechanism determines which panels are visible at the start of a demo session without any traversal steps taken — the approximate runtime equivalent of the entry state panel configuration per persona.

PERSONA_GUIDED_FLOWS in index.js defines the ordered panel sequences that the scripted demo advances through for each persona. These sequences are the closest pre-D.3 approximation of the persona traversal envelope in practice: the panels listed in the guided flow are the panels that a persona session will visit in the scripted order.

The enlPersona state variable in index.js records the active persona for the session. Persona is set by handleStartDemo when the user initiates a guided session and is cleared by handleDemoNext at the final step (the terminal condition sets enlPersona to null). Outside of a demo session, enlPersona is null, which means no persona is active and no depth envelope is in effect.

---

## 3. Persona Depth Envelopes — D.2 Contract

[[execlens_persona_binding]] defines three persona envelopes. In code panel IDs, these envelopes are as follows.

The Exec (EXECUTIVE) envelope includes 'narrative' and 'evidence'. The primary path under Exec is Overview → Signals → Evidence; however Signals ('signals') is the intermediate step. The Exec envelope also includes 'signals' as a reachable panel. The 'situation' (Topology), null (Drift), and null (Remediation) panels are outside the Exec envelope — LOCKED throughout an Exec session.

The CTO envelope includes 'narrative', 'signals', 'situation', and 'evidence'. The primary path, technical deepening path, and the paths that reach these four panels are all within CTO depth. The null (Drift) and null (Remediation) panels would be within CTO depth per D.2 but cannot be reached due to their implementation gap.

The Analyst envelope includes all implemented panels: 'narrative', 'signals', 'situation', 'evidence'. Because Drift and Remediation are not implemented, the Analyst envelope at the code level is identical to the CTO envelope in terms of reachable panels. The distinction is that the Analyst also has access to all four traversal paths and full ENL expansion per [[execlens_persona_binding]] §5, which in the current runtime means access to all guided flows and full traversal transparency in the ENL spine.

---

## 4. PERSONA_DEPTH_ENVELOPE Constant

The PERSONA_DEPTH_ENVELOPE constant introduced by D.3 in TraversalEngine.js formally expresses the three persona envelopes in code. Each persona maps to an object with two fields: `panels` (the array of code panel IDs the persona may reach) and `maxDepth` (the maximum number of traversal steps from Overview the persona may take, corresponding to the depth bounding principle in [[execlens_persona_binding]] §1).

PERSONA_DEPTH_ENVELOPE is used by computePanelState to determine whether a panel should be LOCKED for the active persona. A panel whose ID is not in `persona.panels` is always LOCKED regardless of traversal position, path, or demo state — unless freeMode is true, in which case the traversal contract is suspended and persona LOCKED states do not apply (Operator mode releases all panel constraints per [[execlens_entry_exit_contract]] §4).

---

## 5. Persona Change During Session

The pre-D.3 runtime does not implement persona changes during a live session. The enlPersona value is set at demo start and cleared at demo end. There is no mechanism for the user to change persona mid-session in the current implementation.

D.3 does not introduce mid-session persona change. The rules governing persona changes during a session — defined in [[execlens_persona_binding]] §6 and [[traversal_runtime_validation]] §5 — are recorded in PERSONA_DEPTH_ENVELOPE as a reference for future implementation. The specific rule that a persona downgrade must fail closed (the session must return to the deepest panel permitted by the new persona's envelope) is noted here as a future enforcement requirement.

---

## 6. Non-Alteration Principle — Runtime Expression

[[execlens_persona_binding]] §2 states the non-alteration principle: persona determines the maximum depth of traversal, not the content of any panel. In the runtime, this principle is expressed by the fact that PERSONA_DEPTH_ENVELOPE controls only which panel IDs are in the reachable set — it does not alter any data passed to panel components, does not filter query results, and does not modify the outputs of the PiOS pipeline.

The existing runtime already honors this principle. PERSONA_AUTO_OPEN and PERSONA_GUIDED_FLOWS control panel visibility (depth) without touching panel content. The NarrativePanel, SignalsPanel, SituationPanel, and EvidencePanel components receive the same queryData regardless of persona. D.3 confirms this compliance and formalizes it by making PERSONA_DEPTH_ENVELOPE the explicit mechanism for depth control, separate from any content-rendering concern.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
