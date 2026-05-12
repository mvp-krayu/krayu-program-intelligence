# Claude Runtime Self-Application

> **How Claude itself operates under AMOps — the self-hosting operational model.**

---

## 1. Purpose

This document makes explicit what Claude does, when, and how — as an AMOps-governed execution engine. It is the operational bridge between the AMOps protocol stack and Claude's actual session behavior.

Before this document: Claude had a constitution (CLAUDE.md) and skills (SKILLS.md) but no architecture cognition lifecycle. It executed contracts correctly but had no persistent awareness of architectural state across sessions.

After this document: Claude operates as a vault-governed, architecture-aware execution engine with persistent cognition across sessions.

---

## 2. What Claude Loads

### Session Start (Every Architecture-Sensitive Session)

| Load | Source | When |
|---|---|---|
| Execution constitution | CLAUDE.md (v3.0) | ALWAYS (automatic) |
| Branch/domain authority | docs/governance/runtime/git_structure_contract.md | ALWAYS (§12 pre-flight) |
| Canonical architectural state | docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md | G1/G2 streams |
| Locked terminology | docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md | G1/G2 streams |
| Concept-specific vault pages | Per CLAUDE_RUNTIME_LOAD_PROTOCOL.md Phase 4 table | When stream touches those concepts |

### Stream Start (After Classification)

| Classification | Additional Load |
|---|---|
| G1 | Full Phase 4 pages for affected concepts + mutation tracking begins |
| G2 | Phase 4 pages for consumed concepts (recommended) |
| G3 | No additional load |

---

## 3. When Claude Loads

```
SESSION START
  │
  ├─ Load CLAUDE.md (automatic)
  ├─ Load git_structure_contract.md (§12 pre-flight)
  │
  ├─ CONTRACT RECEIVED
  │   ├─ Classify stream: G1 / G2 / G3
  │   │
  │   ├─ [G1/G2] Load PIOS_CURRENT_CANONICAL_STATE.md
  │   ├─ [G1/G2] Load TERMINOLOGY_LOCK.md
  │   ├─ [G1] Load concept-specific pages
  │   │
  │   ├─ Run architecture memory preflight
  │   ├─ Preflight PASS → proceed
  │   ├─ Preflight FAIL → STOP
  │   │
  │   └─ EXECUTE
  │
  └─ NO CONTRACT (operator question)
      ├─ If architecture-related: load canonical state + terminology
      └─ If not: respond normally
```

---

## 4. What Claude Mutates

### During G1 Execution

Claude maintains an **architecture mutation log** — a running record of:

| Mutation Type | Example | Tracking |
|---|---|---|
| New concept | "Created SQO Cockpit surface" | Name, vault section, initial status |
| Status change | "PATH A promoted to CANONICAL" | Concept, old status, new status |
| Terminology | "Defined CORRIDOR as locked term" | Term, definition, collision check |
| Supersession | "LENS v2 supersedes ExecLens" | Old concept, new concept, rationale |
| Boundary change | "New runtime surface at /sqo/" | What changed, old/new state |
| Git lineage | "Commits abc123, def456 created" | Concept, commit hashes |

### During G2 Execution

Claude does NOT track mutations. If Claude discovers it is mutating architecture during G2 execution:
1. STOP
2. Reclassify as G1
3. Run full preflight compatibility check
4. Begin mutation tracking from reclassification point

### What Claude Never Mutates

- Vault state without stream authorization
- Terminology without governance authority
- Concept status without proper promotion protocol
- Lineage without git evidence

---

## 5. How Claude Propagates Mutations

At G1 stream closure, Claude invokes SKILL: ARCHITECTURE_MEMORY_SYNC:

1. **Review mutation log** — verify all changes captured
2. **Formalize mutation delta** — structured format per STREAM_TO_VAULT_MUTATION_PROTOCOL.md
3. **Check terminology collisions** — new terms against TERMINOLOGY_LOCK.md
4. **Update vault files** — in propagation order (terminology → lineage → state → chronology → git → runtime → archive)
5. **Verify propagation** — all delta entries mapped, no orphans, cross-references intact
6. **Produce CLOSURE Section 10** — full propagation record

Vault updates are committed as part of the stream's commit or as a dedicated vault-sync commit.

---

## 6. How Claude Prevents Drift

### Active Prevention (During Execution)

| Drift Type | Prevention |
|---|---|
| Terminology drift | Use TERMINOLOGY_LOCK.md definitions exactly; check new terms against lock |
| Status drift | Verify concept status against PIOS_CURRENT_CANONICAL_STATE.md before referencing |
| Lineage drift | Anchor all architectural claims to vault lineage or git history |
| Chronology drift | Record dates explicitly; never flatten events from different dates |
| Boundary drift | Verify layer/branch ownership against git_structure_contract.md |

### Passive Detection (During Preflight)

- Staleness check: canonical state age, terminology age, last vault commit
- Compatibility check: planned work vs current canonical state
- If stale (>30 days): WARN
- If very stale (>90 days): STOP

### Periodic Detection (Governance Audit)

- SKILL: VAULT_DRIFT_AUDIT produces a drift report
- Triggered by governance streams or operator request

---

## 7. How Claude Handles Stale State

| Staleness | Claude's Response |
|---|---|
| <30 days | Normal operation — state is fresh |
| 30-90 days | WARN in preflight — proceed with explicit acknowledgment |
| >90 days | STOP — vault too stale for safe execution; governance stream required |
| State contradicts code | STOP — HIGH severity drift; correction required before proceeding |

When stale state is detected, Claude:
1. Logs the staleness finding in execution_report.md
2. If proceeding (WARN): explicitly notes which vault claims may be outdated
3. If stopping (FAIL): identifies what must be updated and by whom

---

## 8. How Claude Handles Supersession

When Claude encounters a superseded concept:

1. **Recognition:** Claude checks SUPERSEDED_CONCEPTS.md and concept status in vault lineage pages
2. **Current replacement:** Claude identifies the replacement concept and uses it
3. **Lineage preservation:** Claude does not delete superseded concept references — they remain in archive
4. **Terminology update:** If the superseded concept's term is still in TERMINOLOGY_LOCK.md, Claude uses the current definition (which should note the supersession)
5. **Communication:** Claude refers to superseded concepts using past tense: "ExecLens (superseded by LENS v2)"

Claude MUST NOT:
- Treat superseded concepts as active
- Use superseded terminology without noting the supersession
- Reference superseded concepts as if they are current architectural truth

---

## 9. How Claude Handles Canonical Ambiguity

When Claude encounters ambiguity about canonical status:

| Scenario | Response |
|---|---|
| Concept not in vault | Do not assume canonical — check git history for evidence |
| Concept in vault as EMERGING | May reference but must note instability |
| Concept in vault as PROVISIONAL | May use but note it is not yet promoted |
| Two concepts claim same architectural space | STOP — governance stream required to resolve |
| Vault and code disagree | STOP — drift detected; flag for correction |

Claude's default for ambiguity is **fail closed**:
- Do not resolve ambiguity by choosing one interpretation
- Do not invent a reconciliation
- Report the ambiguity and stop

---

## 10. Self-Hosting: AMOps Operating Itself

This document, the vault, CLAUDE.md, SKILLS.md, and all AMOps protocols are themselves under AMOps governance.

Changes to the operational infrastructure are **G1 by definition**:

| Changed Artifact | Classification | Vault Obligation |
|---|---|---|
| CLAUDE.md | G1 | Full mutation tracking + propagation |
| SKILLS.md | G1 | Full mutation tracking + propagation |
| Any vault page | G1 | Full mutation tracking + propagation |
| Any AMOps protocol | G1 | Full mutation tracking + propagation |
| Stream protocol changes | G1 | Full mutation tracking + propagation |

This creates a self-maintaining cycle:
1. AMOps governs how streams mutate architecture
2. Changes to AMOps are streams that mutate architecture
3. Therefore AMOps changes are governed by AMOps
4. The vault records AMOps changes like any other architectural mutation

---

## 11. Operational Summary

```
Claude's Operating Model (AMOps-Native):

BEFORE any G1/G2 work:
  → Load canonical state
  → Load terminology
  → Load concept-specific pages (if needed)
  → Run preflight
  → Classify stream

DURING G1 work:
  → Track all architecture mutations in real-time
  → Use locked terminology exactly
  → Verify claims against vault lineage
  → Detect drift as it occurs

AT G1 closure:
  → Formalize mutation delta
  → Propagate to vault (in order)
  → Verify propagation
  → Produce CLOSURE Section 10
  → Commit vault updates

IF anything fails:
  → STOP
  → Report violation
  → Do not proceed
```

---

## 12. Cross-References

- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — full AMOps lifecycle
- [[CLAUDE_RUNTIME_LOAD_PROTOCOL]] — load phases and context budget
- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — preflight checklist
- [[STREAM_TO_VAULT_MUTATION_PROTOCOL]] — mutation tracking and delta format
- [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] — closure-time propagation
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — enforcement triggers
- [[CHATGPT_AND_CLAUDE_CONSTRAINT_MODEL]] — shared constraint model
- [[PIOS_CLAUDE_RUNTIME_BOOT]] — anti-pollution directives
