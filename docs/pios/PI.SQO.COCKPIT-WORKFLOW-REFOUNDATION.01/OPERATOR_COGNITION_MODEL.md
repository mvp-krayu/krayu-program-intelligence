# Operator Cognition Model

> **Authority:** This document defines how operators think about qualification progression. It is the cognitive foundation for all cockpit rendering decisions.

---

## The Cognitive Shift

### Current (V1) Mental Model — Broken

The operator's internal question: **"Which page has the information I need?"**

This produces:
- browse 15 sidebar sections
- mentally reconstruct qualification state from scattered artifacts
- guess which section contains the relevant blocker
- hunt for the action surface that applies
- cross-reference multiple pages to understand progression state

The operator IS the workflow engine. The cockpit merely renders artifacts.

### Target (V2) Mental Model — Correct

The operator's internal question: **"What is my qualification state and what do I do next?"**

This produces:
- posture is immediately visible
- blockers are surfaced in priority order
- available actions are contextual to current state and role
- progression path is computed and displayed
- next governed step is always answered

The cockpit IS the workflow engine. The operator executes governed actions.

---

## Operator Cognition Flow

The operator's cognitive journey follows a fixed sequence. The cockpit must mirror this sequence exactly:

```
1. POSTURE AWARENESS    → Where am I in the qualification journey?
2. PRESSURE AWARENESS   → What is preventing advancement?
3. EVIDENCE AWARENESS   → What evidence supports or contradicts my position?
4. ACTION AWARENESS     → What can I do right now with my authority?
5. OUTCOME AWARENESS    → What state will I reach if I succeed?
```

### 1. Posture Awareness

The operator enters the cockpit and immediately sees:
- Current S-level (S0, S1, S2, S3)
- Current qualification posture (one of 8 states)
- One-sentence operational summary
- Primary guidance ("Review 3 outstanding obligations" / "All blockers resolved, promotion available")

This is not a header. This is the primary operational surface.

### 2. Pressure Awareness

Without navigating, the operator sees:
- Active blocker count and classification
- Unresolved obligation count
- Which lanes are blocked vs clear
- Whether escalation is required
- Whether insufficiency has been determined

The operator must never need to ask "am I blocked?" — the cockpit tells them.

### 3. Evidence Awareness

The operator understands what evidence substrate exists:
- Structural topology (present/absent)
- Semantic intake (candidate CSR status)
- Crosswalk (constructed/missing)
- Reconciliation (complete/in-progress/absent)
- Evidence replay (available/unavailable)
- Vault readiness
- Event lineage

Evidence awareness is contextual — the operator sees what IS available, not what COULD be available in theory.

### 4. Action Awareness

The operator sees available governed actions filtered by:
- Current qualification state (what actions are state-appropriate)
- Current role (what authority the operator has)
- Current blockers (what prerequisites are met)

Actions the operator CANNOT perform are still visible but rendered as authority-bounded. The operator sees:
- The action exists
- They lack the required role
- What role IS required
- The escalation path

This is governance cognition — the operator understands the authority model by seeing it, not by reading documentation.

### 5. Outcome Awareness

The operator understands the consequence of action:
- What state transition becomes possible
- What prerequisites remain
- What the progression path looks like
- Whether the outcome is advancement, lateral movement, or terminal determination

---

## Qualification Progression Cognition

The operator understands qualification as a governed progression:

```
S0 (Unregistered)
  ↓  structural onboarding
S1 (Structural Only)
  ↓  semantic derivation → intake → review
S1 (Semantic Intake Active)
  ↓  crosswalk construction
S1 (Crosswalk Active)
  ↓  reconciliation
S1 (Reconciliation Active)
  ↓  promotion
S2 (Qualified with Debt)
  ↓  debt resolution + authority readiness
S3 (Authority Ready)
```

At each stage, the operator knows:
- Where they are
- What must happen next
- Whether they can perform it
- Who can if they cannot

Terminal paths:
- INSUFFICIENT_EVIDENCE — temporary determination, revisitable
- PERMANENTLY_UNQUALIFIABLE — permanent determination, no further progression

Both are valid governance postures, not error states.

---

## Authority Cognition

The operator understands authority as declared operational posture:

- **Role selection** occurs at cockpit entry (session-level)
- **Role persists** across all navigation within the session
- **Authority boundaries** are always visible, never hidden
- **Escalation paths** are explicit when authority is insufficient
- **Action unavailability** always states WHY (state prerequisite, role constraint, or blocker)

The operator never encounters a hidden wall. Every boundary is explained.

---

## Escalation Cognition

When the operator cannot proceed:

1. The cockpit identifies the blocking condition
2. The cockpit identifies the required authority level
3. The cockpit shows the escalation path (which role, what action)
4. The cockpit does NOT perform the escalation — the operator initiates it

Escalation is a governed cognitive path, not an error recovery mechanism.

---

## Insufficiency Cognition

Insufficiency is a first-class governance posture:

- **Temporary insufficiency** — evidence doesn't support advancement now, but determination may be revisited
- **Permanent insufficiency** — evidence definitively doesn't support further qualification; this is a terminal governance posture

The cockpit must render insufficiency as a clear, governed outcome — not as failure, error, or incompleteness. The operator acknowledges insufficiency through an explicit governed action with mandatory justification.

---

## Progressive Disclosure Philosophy

The cockpit reveals complexity proportional to operator need:

| Disclosure Level | Content | Trigger |
|---|---|---|
| Level 0 | Posture + Primary Guidance + Blocker Summary | Always visible on entry |
| Level 1 | Blocker detail + Available Actions + Obligation queue | One interaction from entry |
| Level 2 | Evidence detail + Qualification substrate + Progression mechanics | Contextual drilldown |
| Level 3 | Forensic artifact inspection + Engineering telemetry | Explicit expert access |

The operator working at Level 0-1 can complete all standard qualification operations without ever reaching Level 2-3.

Level 3 exists for forensic investigation, audit, and engineering validation — not for standard operational workflow.

---

## Anti-Patterns (Explicitly Prohibited)

1. **Archaeological navigation** — operator must browse to find state
2. **Artifact-centric rendering** — artifact existence drives UI, not workflow state
3. **Hidden authority** — action controls disappear instead of explaining boundaries
4. **Undifferentiated depth** — all information at equal prominence regardless of operational relevance
5. **Reconstruction burden** — operator must mentally assemble workflow from scattered pages
6. **Section-first thinking** — "which page?" instead of "what state?"
7. **Silent blocking** — progression blocked without explanation of why or what resolves it
