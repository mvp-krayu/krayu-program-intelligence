# Lens — Runtime Path Enforcement

Program: Krayu — Program Intelligence Discipline
Stream: D.3 — Lens Runtime Activation
Authority: [[execlens_traversal_binding]], [[pios_traversal_contract]], [[canonical/canonical-layer-model]]
Date: 2026-03-28

---

## Navigation (Obsidian)

→ [[lens_runtime_activation]]
→ [[execlens_navigation_contract]]
→ [[lens_runtime_state_mapping]]
→ [[lens_runtime_fail_closed]]

---

## 1. Purpose

This document maps the four traversal paths defined in [[execlens_navigation_contract]] §3–§6 to their runtime enforcement mechanisms in the Lens codebase. It identifies which path elements are enforced by the existing PERSONA_GUIDED_FLOWS and scripted demo logic, which elements are formalized by D.3 additions, and where path enforcement gaps exist.

Path enforcement in the D.3 context means the runtime reliably prevents traversal steps that are not authorized by the active path and reliably permits traversal steps that are. Enforcement is not about restricting users arbitrarily; it is about ensuring that when a panel becomes ACTIVE, the traversal history establishes the context that makes that panel's content interpretable and traceable.

---

## 2. Panel Sequence Map

The four D.2 traversal paths translate to runtime panel sequences as follows. The left column is the D.2 canonical sequence; the right column is the sequence in code panel IDs.

The Primary Path — Overview → Signals → Evidence — maps to the runtime sequence 'narrative' → 'signals' → 'evidence'. This path corresponds to the EXECUTIVE PERSONA_GUIDED_FLOW in index.js, which defines the guided step order as ['narrative', 'signals', 'evidence']. The Executive guided flow is the closest existing runtime expression of the primary path.

The Technical Deepening Path — Overview → Topology → Evidence — maps to the runtime sequence 'narrative' → 'situation' → 'evidence'. No PERSONA_GUIDED_FLOW directly implements this sequence; the CTO flow begins at 'signals' rather than 'narrative' and includes 'situation' as an intermediate step, which is a partial alignment but not a clean path match. The structural_analysis TRAVERSAL_FLOW (ANSWER → STRUCTURE → SIGNAL → EVIDENCE) includes 'situation' in its sequence, which represents Topology engagement, but the ordering differs from the D.2 Technical Deepening path.

The Drift Explanation Path — Overview → Signals → Drift → Remediation (conditional) → Evidence — cannot be enforced in the current runtime because Drift and Remediation have no panel implementations (D2_PANEL_MAP returns null for both). The path is defined in D2_PATH_MAP as a constant but its enforcement requires Drift panel implementation in a future stream.

The Product Bridge Path — Overview → Topology → Evidence — maps to the same runtime sequence as Technical Deepening: 'narrative' → 'situation' → 'evidence'. The distinction between the two paths is in traversal intent, not panel sequence; the runtime cannot enforce intent-level distinctions, only sequence-level ones. Both paths are recorded in D2_PATH_MAP and are available for future rendering use.

---

## 3. D2_PATH_MAP Constant

The D2_PATH_MAP constant introduced by D.3 in TraversalEngine.js is the formal runtime expression of the four traversal paths. It maps each path identifier to its label, its D.2 canonical panel sequence, and its code panel ID sequence. It is used by validatePanelTransition to check whether a proposed panel transition is a valid next step on the active path.

The primary and technical deepening paths are fully expressed in D2_PATH_MAP and their code sequences are derivable from D2_PANEL_MAP. The drift explanation and product bridge paths are expressed in D2_PATH_MAP with their canonical sequences; the drift path's null-mapped panels are present in the sequence to record the contract requirement even though they cannot be enforced.

---

## 4. Path Enforcement via validatePanelTransition

The validatePanelTransition function introduced by D.3 in TraversalEngine.js enforces path sequencing by checking whether the proposed destination panel is a valid next step from the current traversal position. The function's logic proceeds as follows.

First, the function checks that the destination panel is within the active persona's depth envelope. A destination outside the envelope returns a LOCKED failure regardless of the path.

Second, the function checks that the destination panel is the valid next step from the current traversal position on the active path. The "current position" is derived from traversalHistory — the most recently entered panel. The "valid next step" is the panel that follows the current position in D2_PATH_MAP for the active path. If the destination is not the immediate next step (skipping an intermediate panel), the function returns a sequence violation failure.

Third, the function checks that the transition from the current panel to the destination panel does not require a prior traversal step that has not been taken. This is the "no HIDDEN→ACTIVE" rule from [[execlens_panel_state_model]] §4: if the destination has not yet passed through AVAILABLE in the current session, the transition is not permitted.

If all three checks pass, the function returns an authorized result and the transition may proceed.

---

## 5. Pre-D.3 Path Enforcement Mechanisms

Before D.3, path enforcement is implemented through the scripted demo mechanism in index.js. The handleDemoNext function advances the guided step index through PERSONA_GUIDED_FLOWS, which define the panel sequences for each persona's scripted traversal. Because the demo only advances panels in the scripted order, users in guided demo mode cannot skip panels or enter panels out of sequence.

The handleToggle function blocks panel interactions during demoActive, which prevents the user from manually toggling panels during the scripted sequence. This is the primary path enforcement mechanism in the pre-D.3 runtime.

D.3 does not remove or modify this enforcement mechanism. validatePanelTransition is available as a formal validation layer for the freeMode (Operator mode) and pre-demo state, where the scripted sequence does not enforce order. In those contexts, validatePanelTransition provides the validation that the scripted sequence does not.

---

## 6. Acknowledged Path Enforcement Gaps

The Drift Explanation path cannot be traversed in the current runtime. No governing response (warning, block, or alternate path) is surfaced when a drift condition is present, because there is no drift condition detection in the current codebase. This gap means that the drift explanation path defined in [[execlens_navigation_contract]] §5 is structurally inert: it exists in D2_PATH_MAP and is available for future activation but does not produce any runtime behavior.

The CTO PERSONA_GUIDED_FLOW begins at 'signals' rather than 'narrative', which diverges from D.2 path sequencing (every path begins at Overview). This divergence is a feature of the 51.8.R baseline. D.3 does not correct it; D.3 records it here as a known divergence. Future stream resolution of this divergence must update PERSONA_GUIDED_FLOWS with explicit 51.8.R governance rationale.

The Analyst PERSONA_GUIDED_FLOW begins at 'evidence', which contradicts [[execlens_navigation_contract]] §3 ("Evidence without the signal context that makes it meaningful is raw lineage without interpretive anchor") and [[execlens_entry_exit_contract]] §2 ("no panel other than Overview may be in EXPANDED state at entry"). This is also a 51.8.R feature; the Analyst flow is intentionally evidence-first to support audit-oriented traversal. D.3 records this as a known baseline-sanctioned divergence.

---

*Authority: [[execlens_traversal_binding]] (D.2) | [[pios_traversal_contract]] (D.1) | [[canonical/canonical-layer-model]] (Stream 00.2)*
