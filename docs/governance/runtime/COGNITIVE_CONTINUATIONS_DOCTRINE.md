# Cognitive Continuations Doctrine

**Artifact:** PI.COGNITIVE-CONTINUATIONS.01
**Status:** VALIDATED — 30/30 continuations deterministically derivable
**Date:** 2026-06-09
**Authority:** Derived from THORR cognition audit across 5 surfaces

---

## §1 — Core Doctrine

**Answer → unexplored cognition edges → next valuable inquiry.**

Every THORR answer exposes edges in the cognition graph that haven't been traversed. Cognitive Continuations are the deterministic identification of which unexplored edges are most valuable to the operator next.

This is not prompt suggestion. This is cognition graph traversal.

---

## §2 — Definition

A **Cognitive Continuation** is a next inquiry that:
1. Is deterministically derivable from cognition objects (not LLM-generated)
2. Traverses an unexplored edge in the evidence/cognition/projection graph
3. Produces new understanding when answered (not redundant with the current answer)
4. Can be classified by traversal direction

---

## §3 — Continuation Types

Six traversal directions in the cognition graph:

| Type | Direction | Question Pattern | Graph Operation |
|------|-----------|-----------------|-----------------|
| **CLARIFY** | Deeper into same node | "Why is X the center?" | Node detail expansion |
| **IMPLICATION** | Follow consequence edges forward | "What decisions become harder?" | Consequence graph traversal |
| **CHALLENGE** | Test inverse conditions | "What would weaken this?" | Falsification edge |
| **DESCENT** | Follow evidence edges downward | "Show the runtime signals" | Evidence chain traversal |
| **ADJACENT** | Follow lateral cognition edges | "Does this contribute to EB?" | Surface-to-surface traversal |
| **ASCENT** | Follow projection edges upward | "How does BOARDROOM see this?" | Projection authority traversal |

---

## §4 — Derivation Sources

Continuations derive from cognition objects, not from the answer text:

| Source Object | Continuation Types It Produces |
|--------------|-------------------------------|
| `domain_concentration` | CLARIFY (why this domain?), ADJACENT (other domains?) |
| `execution_center` vs `structural_center` | IMPLICATION (split ownership), CHALLENGE (convergence test) |
| `consequence_themes` | ADJACENT (theme relationships), ASCENT (board projection) |
| `RSIG signals` | DESCENT (show runtime evidence), ADJACENT (EB correlation) |
| `blindness_types` | CLARIFY (which blindness?), IMPLICATION (monitoring gaps) |
| `FALSIFICATION_PATHS` | CHALLENGE (what would disprove?) |
| `domain_narratives` | IMPLICATION (downstream teams), DESCENT (propagation chain) |
| `governance_lifecycle` | ASCENT (board confidence), CHALLENGE (replay status) |
| `projectionAuthority` | ASCENT (P-level projection), CHALLENGE (authority limits) |

---

## §5 — Validation Evidence

Audit across 5 cognition surfaces:

| Surface | Continuations Tested | Deterministic | LLM Required |
|---------|---------------------|---------------|--------------|
| Gravity Divergence | 6 | 6 | 0 |
| Execution Blindness | 6 | 6 | 0 |
| Dependency Amplification | 6 | 6 | 0 |
| Runtime Choke Point | 6 | 6 | 0 |
| Systemic Operational Fragility | 6 | 6 | 0 |
| **Total** | **30** | **30** | **0** |

Every continuation traces to a specific cognition object, condition, signal, domain relationship, or consequence graph traversal.

---

## §6 — Architectural Classification

Cognitive Continuations are a **PI Cognitive Primitive** — a traversal operation over governed cognition objects.

They are NOT:
- Query suggestions (those come from templates)
- Prompt recommendations (those come from LLM generation)
- Autocomplete (that comes from text prediction)
- Navigation aids (those come from UI patterns)

They ARE:
- Deterministic graph traversal exposing unexplored edges
- Classified by traversal direction (6 types)
- Derivable from the same cognition objects that produce findings
- Bounded by the same authority gates that govern projection

---

## §7 — Consumption Model

### THORR (Interactive)

After every answer, THORR emits `cognitive_continuations[]` grouped by type. The operator selects which edge to traverse next. The conversation becomes a guided investigation through the cognition graph.

### BALANCED (Governed)

Governed interpretation calls already implicitly traverse edges (meaning → implication → ownership). Continuations make the traversal explicit and let the operator choose depth.

### OPERATOR (Verification)

Challenge continuations ("What would weaken this?") are verification's natural extension. The falsification paths already exist — continuations connect them to the investigation flow.

### DENSE (Explanation)

Descent and clarify continuations map directly to DENSE's "why is this true?" function. The explanation chain already traverses the same edges — continuations expose which edges remain unexplored.

---

## §8 — Implementation Principle

```
deriveContinuations(answer, cognitionContext) → cognitive_continuations[]
```

Input: the answer just given + the cognition objects it referenced
Output: unexplored edges classified by traversal type
Gate: authority level determines which continuations are available

The function does not generate text. It identifies graph edges. The text is template-derived from the edge type and the cognition objects at each end.

---

## §9 — Lineage

This doctrine derives from:
- THORR interrogation patterns observed across BALANCED interpretation calls
- Projection Constitution §2 (persona traversal questions)
- Falsification paths (OPERATOR §6) — the CHALLENGE type already existed implicitly
- BALANCED interpretation matrix — the ASCENT/DESCENT types already existed implicitly
- Runtime divergence discovery — the ADJACENT type (EB ↔ GD) already existed implicitly

The capability was always present in the cognition graph. This doctrine makes it explicit and classifies the traversal directions.
