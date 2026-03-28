# Lens — Runtime Fail-Closed Model

Program: Krayu — Program Intelligence Discipline
Stream: D.3 — Lens Runtime Activation
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[lens_runtime_activation]]
→ [[traversal_runtime_validation]]
→ [[execlens_navigation_contract]]
→ [[lens_runtime_path_enforcement]]
→ [[lens_runtime_operator_mode]]

---

## 1. Purpose

This document defines the fail-closed model as it operates in the Lens runtime after D.3. The fail-closed principle — established in [[traversal_runtime_validation]] §1 — states that where the traversal contract cannot be satisfied, the session surfaces the failure condition and holds at a valid state rather than proceeding through approximation, synthesis, or workaround.

The fail-closed model has two dimensions in the runtime: panel transition failures (blocking unauthorized traversal steps) and absent upstream output failures (surfacing data absence rather than substituting plausible values). This document addresses both.

---

## 2. Pre-D.3 Fail-Closed Mechanisms

The pre-D.3 runtime implements several fail-closed behaviors that already satisfy contract requirements.

The Evidence panel implements the most explicit fail-closed behavior in the existing codebase. Before a demo session starts (not demoActive and not freeMode), the Evidence panel renders a blocked state: "Start Lens Demo" — it is not accessible. When demoActive or freeMode is true but no persona has been selected (!enlPersona), the Evidence panel renders: "Evidence requires a selected Persona." These are governed refusals: the panel does not render partial or synthesized evidence content when the precondition for evidence access has not been met. This behavior aligns with [[traversal_runtime_validation]] §3: "The upstream evidence context must be sufficient to make the destination panel meaningful."

The handleToggle function is blocked entirely during demoActive. When a guided traversal session is active, the user cannot manually toggle any panel. This is a fail-closed behavior at the panel interaction level: during governed traversal, no manual panel override is permitted.

The post-completion lock in handleToggle — after demoComplete is true, only the persona panel may be toggled — is a fail-closed behavior at the session terminus: the governed session is complete and the surface locks down to prevent unauthorized post-completion traversal.

---

## 3. D.3 Fail-Closed Additions

D.3 introduces the validatePanelTransition function in TraversalEngine.js as the formal fail-closed gate for panel transitions. The function returns a structured result object with two fields: `authorized` (boolean) and `reason` (string describing the governance basis for authorization or refusal).

The failure reasons returned by validatePanelTransition are contract-grounded, not generic. A transition that fails because the destination panel is outside the persona's envelope returns the reason "Panel LOCKED: outside PERSONA active depth envelope." A transition that fails because an intermediate panel has not been visited returns the reason "Sequence violation: [intermediate panel] must be ACTIVE before [destination panel] can be reached." A transition that fails because the destination panel has no implementation returns the reason "Panel not implemented in current runtime: [D.2 panel name]."

In all failure cases, validatePanelTransition returns a reason rather than throwing an error or returning a boolean alone. This ensures that failure mode information flows to the surface — the reason is available for display to the user, consistent with [[traversal_runtime_validation]] §7: "The surfaced absence must accurately represent what is absent and why."

---

## 4. Absent Upstream Output Behavior

[[traversal_runtime_validation]] §7 defines the absent upstream output rules: when a traversal step requires an upstream output that is absent, the absence must be surfaced at the current traversal position, not at the destination panel; the surfaced absence must be specific, not generic; the runtime must never synthesize a plausible value.

In the current runtime, absent upstream output handling depends on the API response from the PiOS pipeline. When a query returns no data, the panel components render their no-data states. The NarrativePanel, SignalsPanel, SituationPanel, and EvidencePanel each implement rendering conditions for absent queryData. These conditions do not synthesize plausible content; they surface the absence.

The specific governance requirement — that the absence message identify the upstream dependency rather than presenting a generic "data unavailable" — is not fully implemented in the current panel components. The existing no-data states are functional but not governance-grounded: they do not cite the specific L3 derivation that produced no output, the specific source system gap, or the specific pipeline stage where the absence originates. This is recorded as an open gap: the fail-closed behavior exists (no synthesis), but the specificity requirement of [[traversal_runtime_validation]] §7 is not yet met.

---

## 5. Failure Classification in the Runtime

[[traversal_runtime_validation]] §8 classifies validation failures into three types: blocking (prevents traversal from proceeding), configuration (incorrect state that doesn't block current view but blocks advancement), and boundary (Operator mode boundary failures).

In the post-D.3 runtime, blocking failures are enforced by validatePanelTransition: an unauthorized transition is not executed, the session holds at the current panel, and the failure reason is available for display. Configuration failures — panels in incorrect states — are derivable from computePanelState: if the function returns a state that differs from what the rendering logic would produce, a configuration failure exists. Boundary failures are enforced by the existing Operator mode badge mechanism supplemented by the traversalHistory reset behavior.

The key constraint stated in [[traversal_runtime_validation]] §8 — "No failure class permits the runtime to proceed through the failure by substituting a plausible output or by treating the failure as a non-blocking warning" — is enforced in the D.3 runtime by the return structure of validatePanelTransition and by the existing panel-level no-data rendering behavior.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
