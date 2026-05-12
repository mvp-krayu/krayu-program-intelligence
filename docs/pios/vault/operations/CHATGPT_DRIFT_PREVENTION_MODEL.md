# ChatGPT Drift Prevention Model

> **How ChatGPT becomes and remains constrained by canonical vault authority.**

---

## 1. Purpose

ChatGPT participates in architectural reasoning, stream design, and governance discussion. Unlike Claude (which has file-system access and executes contracts), ChatGPT operates conversationally with no direct vault access.

This creates a drift risk: ChatGPT may reason about architecture using training-data assumptions, stale context, or local reinterpretation — producing outputs that diverge from vault truth.

This document defines the constraints that prevent ChatGPT drift.

---

## 2. Core Constraint: Vault Authority Over Training Data

ChatGPT's training data contains general knowledge about software architecture, governance models, and terminology. This knowledge is **not authoritative** for the PiOS system.

**Rule:** When vault state has been loaded into a ChatGPT session, vault definitions override any training-data assumption.

| Source | Authority |
|---|---|
| Vault page loaded into session | AUTHORITATIVE |
| ChatGPT training data | NOT AUTHORITATIVE — may inform questions but not answers |
| Prior ChatGPT session context | NOT AUTHORITATIVE — sessions do not persist |
| Operator verbal description | INFORMATIONAL — not authoritative unless backed by vault |

---

## 3. Drift Prevention Mechanisms

### 3.1 Local Reinterpretation Prevention

**Risk:** ChatGPT simplifies, paraphrases, or reinterprets vault definitions to fit conversational flow.

**Prevention:**
- When vault pages are loaded, ChatGPT MUST use locked term definitions verbatim
- ChatGPT MUST NOT simplify "HYDRATED" to "partially complete" or "not yet grounded"
- ChatGPT MUST NOT merge PATH A and PATH B into a single "grounding path"
- ChatGPT MUST NOT describe superseded concepts as active alternatives

**Operator enforcement:** When loading TERMINOLOGY_LOCK.md into ChatGPT session, explicitly instruct: "Use these definitions exactly. Do not paraphrase."

### 3.2 Terminology Lock Enforcement

**Risk:** ChatGPT invents new terms or uses existing terms with different meanings.

**Prevention:**
- TERMINOLOGY_LOCK.md loaded into session provides the authoritative term set
- If ChatGPT uses a term not in TERMINOLOGY_LOCK.md, it MUST flag it as provisional
- If ChatGPT's proposed term collides with a locked term, the locked definition wins
- New term proposals from ChatGPT are EMERGING — never CANONICAL until governance stream promotes them

**Operator enforcement:** Cross-check ChatGPT's term usage against TERMINOLOGY_LOCK.md. Flag deviations.

### 3.3 Chronology Preservation

**Risk:** ChatGPT flattens architectural chronology — treating events from different dates/strata as simultaneous or interchangeable.

**Prevention:**
- When discussing architectural evolution, ChatGPT MUST maintain stratum ordering (S1→S2→S3→S4→S5)
- Events must be referenced with approximate dates, not as timeless facts
- "ExecLens was superseded by LENS v2" is correct. "ExecLens and LENS v2 are alternatives" is drift.

**Operator enforcement:** Load STREAM_EVOLUTION_CHRONOLOGY.md when discussing architectural history.

### 3.4 Canonicality Enforcement

**Risk:** ChatGPT treats EMERGING or PROVISIONAL concepts as established truth.

**Prevention:**
- PIOS_CURRENT_CANONICAL_STATE.md provides current status for all tracked concepts
- ChatGPT MUST qualify references to non-CANONICAL concepts with their status
- "SQO (CANONICAL)" vs "runtime overlay (PROVISIONAL, prototype-stage)"
- ChatGPT MUST NOT promote concepts — promotion authority belongs to governance streams

**Operator enforcement:** Challenge ChatGPT when it references a concept without status qualification.

### 3.5 Branch Awareness

**Risk:** ChatGPT proposes work on the wrong branch or assumes all work happens in one place.

**Prevention:**
- Load git_structure_contract.md into session when discussing branch strategy
- ChatGPT MUST reference branch domains correctly (feature/pios-core owns L1-L4, feature/runtime-demo owns L6-L7, etc.)
- ChatGPT MUST NOT propose cross-domain execution

**Operator enforcement:** Verify ChatGPT's branch references against git_structure_contract.md.

### 3.6 Lineage Awareness

**Risk:** ChatGPT fabricates lineage ("this concept probably came from...") without vault evidence.

**Prevention:**
- All lineage claims MUST trace to vault lineage pages or git history
- ChatGPT MUST distinguish between "vault says X originated from commit abc123" and "I believe X was influenced by..."
- Fabricated lineage is a governance violation

**Operator enforcement:** When ChatGPT makes lineage claims, ask "which vault page or commit supports this?"

---

## 4. Session Bootstrap Protocol

For ChatGPT sessions involving architectural reasoning:

### Minimum Load (Architectural Awareness)

```
LOAD INTO SESSION:
1. PIOS_CURRENT_CANONICAL_STATE.md (canonical state)
2. TERMINOLOGY_LOCK.md (locked definitions)

INSTRUCT:
"These are the authoritative architectural definitions. Use them exactly.
Do not paraphrase, simplify, or reinterpret. If you need to use a term
not in the terminology lock, flag it as provisional."
```

### Extended Load (Architectural Design)

```
LOAD INTO SESSION (in addition to minimum):
3. Concept-specific vault pages for the topic under discussion
4. STREAM_EVOLUTION_CHRONOLOGY.md (if discussing history)
5. git_structure_contract.md (if discussing branches)
6. SEMANTIC_COLLISIONS.md (if discussing terminology)

INSTRUCT:
"These provide the full architectural context. All proposals must be
grounded in this state. Do not propose changes that contradict current
canonical state without explicitly flagging the contradiction."
```

### Verification

After loading, verify ChatGPT has absorbed the context:

```
VERIFY:
"Before we proceed, confirm:
- What is the current S-state for BlueEdge?
- What does HYDRATED mean in this system?
- What superseded ExecLens?
- What are the 5 evolutionary strata?"

If ChatGPT answers incorrectly → re-load vault pages.
```

---

## 5. Drift Detection in ChatGPT Output

### Signals of Drift

| Signal | Example | Drift Type |
|---|---|---|
| Paraphrased definitions | "HYDRATED means partially complete" | Terminology drift |
| Missing status qualifiers | "The overlay system" (without noting PROVISIONAL) | Canonicality drift |
| Flattened chronology | "ExecLens and LENS v2 coexist" | Chronology drift |
| Fabricated lineage | "This probably evolved from the early dashboard work" | Lineage fabrication |
| Wrong branch scope | "We can add this to the governance branch" (for Core work) | Branch drift |
| Invented terminology | "The semantic pipeline" (not a locked term) | Terminology invention |

### Drift Response

1. Identify the drifted claim
2. Cite the correct vault source
3. Re-load the relevant vault page if needed
4. Have ChatGPT acknowledge the correction before continuing

---

## 6. ChatGPT Output Authority Levels

| Output Type | Authority | Vault Obligation |
|---|---|---|
| Architectural analysis (with vault loaded) | INFORMATIONAL — useful but not authoritative | None |
| Stream contract draft | DRAFT — requires Claude execution to become governed | None |
| Term proposal | EMERGING — requires governance stream for promotion | None |
| Lineage claim | UNVERIFIED — requires vault/git cross-check | Operator must verify |
| Concept proposal | EMERGING — requires stream execution to validate | None |
| Governance recommendation | ADVISORY — requires governance stream to enact | None |

Nothing ChatGPT produces becomes architectural truth until it flows through a governed stream and is propagated to the vault.

---

## 7. Cross-References

- [[CHATGPT_AND_CLAUDE_CONSTRAINT_MODEL]] — shared constraint model for both AI systems
- [[TERMINOLOGY_LOCK]] — the authoritative term definitions ChatGPT must use
- [[PIOS_CURRENT_CANONICAL_STATE]] — the canonical state ChatGPT must load
- [[SEMANTIC_COLLISIONS]] — collision risks ChatGPT should be aware of
- [[ARCHITECTURE_MEMORY_OPERATIONS_MODEL]] — AMOps lifecycle ChatGPT participates in
