# CE.11 — Prohibited Evolution Patterns

**Stream:** CE.11 — Change Governance & Evolution Contract
**Artifact type:** PROHIBITED PATTERNS (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.11
**Status:** GOVERNANCE-DEFINED

---

## 1. PURPOSE

This document enumerates patterns that are explicitly and unconditionally forbidden
in PiOS evolution. Each prohibited pattern is assigned a pattern identifier (PP-NNN)
and specifies the violation type, the specific prohibition, and the corrective path.
Encountering a prohibited pattern is a stream-blocking event.

---

## 2. PROHIBITED PATTERNS

### PP-001 — Semantic modification of CE.4/CE.5 without version event

**Violation type:** GOVERNANCE INTEGRITY VIOLATION

**Prohibited action:**
Modifying the semantics of any CE.4 emission invariant (INV-001..INV-007, §3.3) or
any CE.5 consumption rule (C-001..C-005, PBE-1/PBE-2, T-001/T-002) or CE.5
consumption state vocabulary (AVAILABLE/PARTIAL/BLOCKED) without:
1. A formal versioning decision artifact confirming a MINOR or MAJOR version event
2. A new governing CE stream
3. A fresh VS-CE6 evaluation of the modified contracts

**Why it is prohibited:**
CE.4 and CE.5 are the certified governance foundation for PiOS v0.3 and v0.4
respectively. Silent modification invalidates the certification without trace and
creates an inconsistency between the governance artifacts and the engine behavior.

**Corrective path:** Open a MINOR or MAJOR version event stream; produce a versioning
decision; execute new VS-CE6 → VS-CE10C cycle.

---

### PP-002 — Bypassing VS-CE6 compliance inspection

**Violation type:** CERTIFICATION PROCESS VIOLATION

**Prohibited action:**
Declaring a system EXECUTABLE-PROVEN, or proceeding directly to implementation
(VS-CE8/VS-CE10) and certification closeout (VS-CE10C), without executing a
VS-CE6 compliance inspection that establishes:
1. Which EX-criteria pass and which fail
2. Which gaps exist (gap enumeration)
3. A formal verdict record

**Why it is prohibited:**
VS-CE6 is the diagnostic step that establishes the gap set. Without it, there is
no governed basis for claiming the implementation is correct or complete. CE.8/CE.10
implementations are only valid if they close gaps identified in CE.6.

**Corrective path:** Execute VS-CE6 before any implementation begins.

---

### PP-003 — Partial certification claim

**Violation type:** CERTIFICATION INTEGRITY VIOLATION

**Prohibited action:**
Claiming EXECUTABLE-PROVEN status while one or more compliance domains are in PARTIAL
or FAIL state. This includes:
- Declaring "emission is certified" while propagation is PARTIAL
- Issuing a VS-CE10C artifact with any domain in non-PASS state
- Using CE-stream language implying certification while gaps remain open

**Why it is prohibited:**
Certification is a system-level guarantee. A partially passing system is in
GOVERNANCE-DEFINED ONLY state. Partial certification claims are false and may
cause downstream consumers to rely on unverified guarantees.

**Corrective path:** Close all gaps in all compliance domains before executing
VS-CE10C. The CE.8/CE.9/CE.10 model is the reference for this process.

---

### PP-004 — Silent mixing of certified and uncertified components

**Violation type:** CERTIFICATION INTEGRITY VIOLATION

**Prohibited action:**
Combining, in the same runtime invocation:
- Engine files that belong to the certified baseline (post-CE.10C)
- Engine files or constants that have been modified after CE.10C without
  re-certification

Without explicitly declaring the system in CERTIFICATION-SUSPENDED state.

**Why it is prohibited:**
The certification is bound to an exact codebase state. A mixed system produces
outputs that are governed by the new (uncertified) logic but may be treated as
if they carry the prior certification. This is a silent integrity failure.

**Corrective path:** Declare CERTIFICATION-SUSPENDED before any post-certification
modification; complete VS-CE6 → VS-CE10C before deploying mixed components as
certified.

---

### PP-005 — Heuristic logic outside governance

**Violation type:** GOVERNANCE INTEGRITY VIOLATION

**Prohibited action:**
Introducing any logic into a governed engine file that:
- Derives tier, consumption state, or diagnosis state through means not traceable
  to a specific DEC, INV, or CE rule
- Uses "best guess" or approximate mappings as substitutes for governed definitions
- Implements implicit thresholds without a corresponding DEC-013 binding rule
  definition and DEC-012 binding surface entry

**Why it is prohibited:**
PiOS governed outputs must be deterministically traceable to governance decisions.
Heuristic logic breaks the traceability chain and cannot be certified. The CE.8
interim shim (AVAILABLE→ACTIVE, PARTIAL→ACTIVE) is the canonical example of a
provisional heuristic — it was authorized as temporary (CE.9) and removed at CE.10
precisely because it was not governed.

**Corrective path:** Define the required logic as a governed binding rule (DEC-013)
with an entry in the binding surface (DEC-012). Then implement it as a GC-001 +
GC-002 co-change.

---

### PP-006 — Version promotion via certification

**Violation type:** VERSIONING GOVERNANCE VIOLATION

**Prohibited action:**
Treating a VS-CE10C certification closeout as a version promotion event. This includes:
- Updating version numbers in response to VS-CE10C
- Merging a certification branch to the canonical main/baseline branch without
  an explicit versioning decision stream
- Using "certified" as a synonym for "promoted" or "released"

**Why it is prohibited:**
Certification proves executable compliance within the current version boundary.
Version promotion is a separate governance event that requires new boundary definition,
new versioning decision, and independent certification. Conflating the two allows
a version increment to slip through without the governance work required by
CE.11_VERSIONING_GOVERNANCE.md.

**Corrective path:** Execute versioning decision process per CE.11_VERSIONING_GOVERNANCE.md
before any version promotion.

---

### PP-007 — Gap closure without remediation plan

**Violation type:** CERTIFICATION PROCESS VIOLATION

**Prohibited action:**
Implementing a fix for a CE.6-identified gap without:
1. An authorized VS-CE7 remediation plan that bounds the fix scope
2. A gap-to-fix mapping artifact that explicitly maps each gap to its remediation
3. A declared implementation stream

**Why it is prohibited:**
Unbounded gap closure may over-fix (introduce new behavior beyond gap scope),
under-fix (leave gap partially open), or close gaps in ways that introduce new
violations in adjacent domains. The VS-CE7 plan is the scope constraint. CE.7 and
CE.9 are the reference models for authorized remediation architecture.

**Corrective path:** Execute VS-CE7 before any implementation; produce gap-to-fix
mapping; confine implementation to bounded scope.

---

### PP-008 — Retroactive modification of closed CE streams

**Violation type:** GOVERNANCE RECORD INTEGRITY VIOLATION

**Prohibited action:**
Modifying, overwriting, or deleting any artifact from a closed CE stream
(CE.1 through CE.10C) after the stream has been committed and recorded as CLOSED.

**Why it is prohibited:**
Closed CE streams are the immutable record of the governance history and the
evidentiary basis for current certification. Retroactive modification breaks
the audit chain and invalidates the certification evidence.

**Corrective path:** If a closed stream artifact is found to be incorrect, a
corrective stream (CE.N) MUST be opened to formally record the correction,
reference the original artifact, and document the discrepancy. The original
artifact is not modified.

---

### PP-009 — Unconstrained extension of binding surface without governance

**Violation type:** GOVERNANCE INTEGRITY VIOLATION

**Prohibited action:**
Adding rows to BINDING_SURFACE, adding keys to BINDING_RULES, or modifying threshold
values without a corresponding GC-001 governance event that:
1. Identifies the DEC-013 source for the new/modified rule
2. Identifies the DEC-012 source for the new/modified surface row
3. Commits the governance artifact before or co-commit with the engine change

**Why it is prohibited:**
The binding surface is the instantiated expression of DEC-012. Every row must be
traceable to a governed decision. Expanding it without governance creates uncertified
behavior that cannot be validated against a governed specification.

**Corrective path:** Produce or update DEC-012/DEC-013 governance artifacts as a
GC-001 change; then implement as GC-002 in the same stream.

---

## 3. PROHIBITED PATTERN SUMMARY

| ID | Pattern | Violation Type | Severity |
|---|---|---|---|
| PP-001 | CE.4/CE.5 semantic modification without version event | GOVERNANCE INTEGRITY | CRITICAL |
| PP-002 | Bypassing VS-CE6 compliance inspection | CERTIFICATION PROCESS | CRITICAL |
| PP-003 | Partial certification claim | CERTIFICATION INTEGRITY | CRITICAL |
| PP-004 | Silent mixing of certified/uncertified components | CERTIFICATION INTEGRITY | HIGH |
| PP-005 | Heuristic logic outside governance | GOVERNANCE INTEGRITY | HIGH |
| PP-006 | Version promotion via certification | VERSIONING GOVERNANCE | HIGH |
| PP-007 | Gap closure without remediation plan | CERTIFICATION PROCESS | HIGH |
| PP-008 | Retroactive modification of closed CE streams | RECORD INTEGRITY | HIGH |
| PP-009 | Unconstrained binding surface extension | GOVERNANCE INTEGRITY | HIGH |

All CRITICAL violations are stream-blocking: no further execution may proceed
until the corrective path is followed.
