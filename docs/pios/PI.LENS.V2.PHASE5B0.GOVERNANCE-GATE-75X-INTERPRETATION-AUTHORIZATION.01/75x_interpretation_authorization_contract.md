# 75.x Interpretation Authorization Contract

> **Authority:** PI.LENS.V2.PHASE5B0.GOVERNANCE-GATE-75X-INTERPRETATION-AUTHORIZATION.01
> **Status:** ACTIVE
> **Scope:** LENS v2 Phase 5B.2+ only

---

## 1. Purpose

This contract formally authorizes bounded interpretive operations for LENS v2 under the 75.x interpretation clause defined in CLAUDE.md §3.4. This authorization does not replace deterministic rendering or investigative authority — it adds a third, bounded authority tier above both.

Structural derivation remains primary. Interpretive authority is additive, not replacement.

---

## 2. Authorization Scope

- **Surface:** LENS v2 runtime (isolated and SQO-embedded flagship routes)
- **Phases:** 5B.2 (Narrative Response Surface) and subsequent
- **Persona:** EXECUTIVE_DENSE only (initial scope)
- **Condition:** Interpretive outputs ONLY when 5B.2+ query types are active
- **Inactive in:** BOARDROOM, INVESTIGATION_DENSE, deterministic rendering, EXECUTIVE_BALANCED (initial scope)

---

## 3. Permitted Operations

The following operations are authorized under bounded interpretive authority:

### 3.1 Evidence-Synthesized Executive Narrative

Synthesis of structural evidence into executive-facing narrative. All synthesis must trace to specific structural evidence items. No freeform generation.

### 3.2 Domain Grounding Explanation

Explanation of what grounding status means for a specific domain — why it is HYDRATED vs RECONCILED, what structural evidence supports the classification.

### 3.3 Blockage Pattern Explanation

Explanation of structural blockage patterns — what is blocked, by what structural condition, and what the structural prerequisites are.

### 3.4 Movement and Trend Explanation

Explanation of measured temporal deltas between epochs — what moved, by how much, in which direction. Derived from temporal analytics data, not projected or predicted.

### 3.5 Dimension Coverage Explanation

Explanation of semantic dimension coverage — which dimensions have structural evidence, which do not, and what the coverage ratio means.

### 3.6 Pattern-Matched Bounded Query Responses

Extension of 5B.1 GUIDED_QUERY_ANSWERS (12 deterministic derive functions) to include evidence-synthesized responses. Query types must be defined and bounded — no open-ended query acceptance.

---

## 4. Absolute Prohibitions

The following operations are NEVER permitted under any interpretive authority. These prohibitions are not overridable by contract, stream, or operator instruction.

1. **No team behavior inference** — the system must not infer how teams operate, collaborate, or dysfunction
2. **No organizational intent inference** — the system must not infer organizational goals, strategies, or motives
3. **No human motive inference** — the system must not infer why people made decisions or took actions
4. **No cultural diagnosis** — the system must not assess, diagnose, or characterize organizational culture
5. **No leadership quality assessment** — the system must not evaluate leadership effectiveness or style
6. **No management effectiveness assessment** — the system must not assess management capability or performance
7. **No personnel attribution** — the system must not attribute outcomes to specific individuals or teams
8. **No behavioral prediction** — the system must not predict future human behavior or decisions
9. **No organizational sentiment** — the system must not assess morale, satisfaction, or organizational feeling
10. **No causal attribution to humans** — the system must not assign cause to human actions or decisions
11. **No remediation prioritization** — the system must not rank or prioritize corrective actions
12. **No "you should" language** — the system must not prescribe, advise, or recommend actions
13. **No ranked next actions** — the system must not produce ordered lists of recommended steps

---

## 5. Evidence Binding Requirement

Every interpretive output MUST:

- Trace to one or more structural evidence items
- Identify the evidence source (domain, artifact, measurement)
- Be reproducible from the same structural evidence
- Produce no output when evidence is absent (fail closed)

Evidence binding is structural, not semantic. An interpretive output is bound to evidence when the evidence is the computational input, not when the output merely references or cites evidence.

---

## 6. Disclosure Requirement

The governance envelope (LensDisclosureShell) MUST distinguish between:

- **DETERMINISTIC** outputs — pure rendering, no selection
- **INVESTIGATIVE** outputs — topology-derived guided traversal, structural adjacency selection
- **INTERPRETIVE** outputs — bounded evidence-synthesized narrative under 75.x authorization

When interpretive outputs are active, the governance envelope MUST:

- Display authority tier: INTERPRETIVE
- Display modified prohibition statement: "Structural derivation primary · bounded interpretive synthesis active · evidence-bound"
- Show interpretive authority status in expanded details

When interpretive outputs are NOT active, the envelope reverts to DETERMINISTIC or INVESTIGATIVE disclosure — identical to current behavior.

---

## 7. Activation and Deactivation

### 7.1 Activation Conditions

Interpretive authority is ACTIVE when:
- 5B.2+ query types are active in the current session
- Persona is EXECUTIVE_DENSE (initial scope)
- User has engaged an interpretive query interaction

### 7.2 Deactivation Conditions

Interpretive authority is INACTIVE when:
- No 5B.2+ query is active
- Persona is BOARDROOM, EXECUTIVE_BALANCED, or INVESTIGATION_DENSE
- User is in deterministic rendering mode
- System is displaying investigative (5B.1) guided queries only

### 7.3 Default State

Default authority tier is INVESTIGATIVE (current behavior). No interpretive output is produced until explicitly activated by 5B.2+ implementation.

---

## 8. Governance Chain

```
CLAUDE.md §3.4 (prohibition)
  └── §3.4.1 (bounded exception — this contract)
        └── 75.x Interpretation Authorization Contract (this document)
              └── LensDisclosureShell authorityTier prop (runtime enforcement)
                    └── 5B.2+ implementation (interpretive query types)
```

Each layer in the chain must be satisfied. No layer may exceed its upstream authority.

---

## 9. Amendment Rules

This contract may be amended ONLY by:
- A G1 governance stream with explicit amendment scope
- Operator authorization
- Full 4_BRAIN_ALIGNMENT validation

Amendments MUST NOT:
- Relax any of the 13 absolute prohibitions
- Remove the evidence binding requirement
- Remove the disclosure requirement
- Expand scope beyond LENS v2

---

## 10. Relationship to Existing Authority

| Authority | Status After This Contract |
|---|---|
| DETERMINISTIC (pure rendering) | UNCHANGED — still primary |
| INVESTIGATIVE (5B.1 guided queries) | UNCHANGED — still active |
| INTERPRETIVE (5B.2+ bounded synthesis) | AUTHORIZED — scoped to §3-7 above |
| §3.4 default prohibition | UNCHANGED — still enforced for all non-LENS-v2 streams |
