# Role and Authority Model

> **Authority:** This document defines how operator roles project through the cockpit — session semantics, authority-aware rendering, escalation visibility, and governance cognition.

---

## Foundational Principle

RBAC is NOT security enforcement.

RBAC is **governance cognition** — the mechanism by which the operator understands authority boundaries, action availability, and escalation paths.

The cockpit communicates authority through rendering, not through hiding.

---

## Session-Level Declarative Role

### Role Declaration

The operator declares their role at cockpit entry. This is a session-level selection, not per-action input.

```
[Role Selection — Session Entry]

Select your operational role:

  ● Operator          — Full operational authority
  ● Reviewer          — Semantic review authority
  ● Domain Authority  — Structural domain authority
  ● Promotion Authority — Qualification advancement authority
  ● Audit Authority   — Read-only governance audit
```

The selected role persists for the entire session. All cockpit surfaces adapt to this role.

### Role Semantics

| Role | Operational Identity | Authority Scope |
|---|---|---|
| **operator** | Primary operational actor. Can execute all workflow actions. | Full — review, promote, acknowledge, escalate, resolve |
| **reviewer** | Semantic review specialist. Reviews intake, contests interpretations. | Review — accept, reject, contest, partial accept, escalate |
| **domain_authority** | Structural domain owner. Accepts crosswalk and structural mappings. | Domain — review (accept/reject), crosswalk accept, escalate |
| **promotion_authority** | Qualification advancement authority. Approves/denies promotions. | Governance — promote, deny, insufficiency, resolve arbitration |
| **audit_authority** | Read-only governance observer. Full visibility, no action authority. | None — all surfaces visible, all actions displayed as read-only |

### Actor ID

The actor_id format remains `role:identifier` (e.g., `operator:khorrix`).

On role declaration, the operator enters their identifier once. The cockpit constructs the actor_id from `{selectedRole}:{identifier}` for all subsequent actions.

This is DECLARATIVE ONLY. Not production authentication. Not secure identity enforcement.

---

## Authority-Aware Rendering

### Core Rule

**No action is ever hidden.**

Every governed action is always visible. What changes is the rendering posture:

| State | Rendering |
|---|---|
| **Available** | Full action affordance — button, input fields, submit |
| **Role-blocked** | Action visible + "Requires {role}" badge + escalation path |
| **State-blocked** | Action visible + "Prerequisite: {condition}" explanation |
| **Both-blocked** | Action visible + both constraints shown |

### Role-Specific Surface Projection

**Operator (full authority):**
```
REVIEW QUEUE           → Full action controls (accept/reject/contest/partial/escalate)
PROMOTION CONTROLS     → Full controls (request/approve/deny)
INSUFFICIENCY          → Full controls (temporary/permanent acknowledge)
CROSSWALK/RECONCILIATION → Full accept controls
ARBITRATION            → Full escalate/resolve controls
BLOCKER LIST           → Actionable resolution paths
```

**Reviewer:**
```
REVIEW QUEUE           → Full action controls
PROMOTION CONTROLS     → Visible but role-locked: "Requires promotion_authority"
INSUFFICIENCY          → Visible but role-locked: "Requires operator"
CROSSWALK/RECONCILIATION → Visible but role-locked: "Requires domain_authority"
ARBITRATION            → Escalate available, resolve locked: "Requires promotion_authority"
BLOCKER LIST           → Visible, non-actionable for non-review blockers
```

**Domain Authority:**
```
REVIEW QUEUE           → Accept/reject available, contest/partial locked: "Requires reviewer"
PROMOTION CONTROLS     → Visible but role-locked: "Requires promotion_authority"
INSUFFICIENCY          → Visible but role-locked: "Requires operator"
CROSSWALK/RECONCILIATION → Full accept controls
ARBITRATION            → Escalate available, resolve locked
BLOCKER LIST           → Visible, crosswalk-lane blockers actionable
```

**Promotion Authority:**
```
REVIEW QUEUE           → Visible, all items read-only: "Requires reviewer"
PROMOTION CONTROLS     → Full controls (request/approve/deny)
INSUFFICIENCY          → Full controls (temporary/permanent)
CROSSWALK/RECONCILIATION → Visible but role-locked: "Requires domain_authority"
ARBITRATION            → Resolve available, escalate locked
BLOCKER LIST           → Visible, non-actionable for non-governance blockers
```

**Audit Authority:**
```
ALL SURFACES           → Full visibility, zero action controls
ALL ACTIONS            → Rendered as status displays with authority requirements
EVENT TIMELINE         → Full visibility, prominent placement
BLOCKER LIST           → Full visibility, read-only
```

---

## Escalation Visibility

When an action requires a role the operator doesn't have:

```
┌─────────────────────────────────────────────────┐
│  Promotion Request                              │
│                                                 │
│  ⊘ Requires: promotion_authority                │
│  Current role: reviewer                         │
│                                                 │
│  Escalation: Contact a promotion_authority      │
│  actor to request qualification advancement.    │
│                                                 │
│  Authority level: L5 (governance_authority)     │
└─────────────────────────────────────────────────┘
```

The operator ALWAYS understands:
1. What action exists
2. Why they cannot perform it (role constraint vs state constraint)
3. What role IS required
4. The authority level involved
5. The escalation path

---

## Authority Domain Mapping

Actions map to authority domains:

| Authority Domain | Level | Actions | Roles |
|---|---|---|---|
| **semantic_authority** | L4 | review_accept, review_reject, review_contest, review_partial_accept, escalate_arbitration | reviewer, operator |
| **governance_authority** | L5 | promotion_request, promotion_approve, promotion_deny, insufficiency_acknowledge, resolve_arbitration | promotion_authority, operator |
| **structural_authority** | L4/L5 | crosswalk_accept (L4), reconciliation_accept (L5) | domain_authority, operator |

---

## Workflow Resolver Integration

The `resolveOperatorWorkflow` resolver takes `role` as input and produces `roleProjection`:

```javascript
roleProjection: {
  role: 'reviewer',
  roleLabel: 'Reviewer',
  permitted_actions: ['review_accept', 'review_reject', 'review_contest', 'review_partial_accept', 'escalate_arbitration'],
  prohibited_actions: ['promotion_request', 'promotion_approve', 'promotion_deny', 'insufficiency_acknowledge', 'crosswalk_accept', 'reconciliation_accept', 'resolve_arbitration'],
  escalation_targets: [
    { action: 'promotion_request', required_role: 'promotion_authority' },
    { action: 'crosswalk_accept', required_role: 'domain_authority' },
    { action: 'resolve_arbitration', required_role: 'promotion_authority' },
  ],
}
```

Each action in `availableActions` carries `available: boolean` and `reason_if_unavailable` that distinguishes role-blocking from state-blocking.

---

## Role Persistence

| Concern | Decision |
|---|---|
| Storage | React state (session-level, not persisted to disk) |
| Scope | Applies to entire cockpit for the session |
| Default | No default — role must be explicitly declared |
| Change | Operator can re-declare role at any time via session controls |
| URL encoding | Role NOT in URL — this is session context, not navigation state |

---

## Non-Automatable Boundaries

The existing 7 non-automatable boundaries remain enforced:

1. No system actor can promote
2. No system actor can elevate authority
3. No system actor can resolve reviews
4. No system actor can accept crosswalks
5. No system actor can close reconciliation
6. No system actor can advance S-state
7. No system actor can override insufficiency

These are backend enforcement. The cockpit does not render system-actor controls. The `actor_id` always begins with a declared role prefix, never `system:`.

---

## Visual Authority Language

The cockpit uses consistent visual language for authority states:

| Authority State | Visual Treatment |
|---|---|
| Action available | Primary action styling (interactive, prominent) |
| Role-blocked | Muted action with role badge and escalation path |
| State-blocked | Muted action with prerequisite explanation |
| Terminal (permanently unqualifiable) | All progression actions rendered as terminal/closed |
| Read-only (audit_authority) | All actions rendered as status displays |

No action is ever invisible. The authority model is always legible.
