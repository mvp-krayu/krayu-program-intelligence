# Evidence Recoverability and Escalation

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how evidence intake and packaging failures recover, escalate,
quarantine, and fail closed — ensuring no evidence workflow failure
corrupts qualification authority or governance stability.

---

## 2. Evidence Failure Categories

### 2.1 Intake Failure Types

| Category | Examples | Severity | Impact |
|----------|----------|----------|--------|
| Discovery failure | Source not found, location invalid | LOW | No evidence registered — retry with different source |
| Classification failure | Source type indeterminate, format unknown | LOW | No evidence registered — reclassify or obtain alternative |
| Trust failure | Authority unverifiable, hash mismatch, circular authority | MEDIUM | QUARANTINE or PROHIBIT — no registration |
| Extraction failure | Evidence cannot be deterministically extracted | LOW | No evidence registered — reformulate extraction |
| Normalization failure | Schema invalid, hash computation fails | LOW | No evidence registered — fix and retry |
| Provenance failure | Chain incomplete, orphaned entries | LOW | No evidence registered — re-establish provenance |
| Registration failure | Duplicate evidence, gate failure | LOW | No evidence registered — address gate condition |

### 2.2 Packaging Failure Types

| Category | Examples | Severity | Impact |
|----------|----------|----------|--------|
| Selection failure | Entries ineligible, domain saturated | LOW | No package created — revise selection |
| Strategy failure | Strategy exceeds limits, zone blocks packaging | LOW | No package created — adjust strategy |
| Assembly failure | Invalid entries, class unauthorized | LOW | No package created — fix entries |
| Validation failure | Schema invalid, internal conflict, limit exceeded | LOW | No package created — resolve conflicts |
| Replay binding failure | Non-deterministic entries, conflict ambiguity | MEDIUM | Package cannot be replay-bound — investigate |
| Registration failure | Package limit exceeded, duplicate ID | MEDIUM | Package not registered — consolidate or wait |

### 2.3 Post-Registration Failure Types

| Category | Examples | Severity | Impact |
|----------|----------|----------|--------|
| Trust violation | Source authority revoked, material corrupted after registration | HIGH | QUARANTINE package, suspend overlay if activated |
| Lineage break | Source disappears, provenance link invalidated | HIGH | QUARANTINE downstream claims |
| Replay divergence | Evidence-derived state not reproducible | CRITICAL | FREEZE sandbox, G-4 escalation |
| Source conflict | New evidence contradicts existing evidence | MEDIUM | QUARANTINE conflicting entries, operator resolution |

### 2.4 Key Insight: Pre-Registration Failures Are Costless

Intake and packaging failures before registration (Phases 1–6 of
intake, Phases 1–5 of packaging) have ZERO governance state impact.
No evidence has entered the governance boundary. These failures
are freely retryable without recovery operations.

---

## 3. Recovery Mechanisms

### 3.1 Intake Recovery (Phases 1–7)

| Failure | Recovery | Cost |
|---------|---------|------|
| Source not found | Find alternative source | ZERO — retry |
| Classification indeterminate | Provide additional context, reclassify | ZERO — retry |
| Trust criteria fail | Investigate, obtain verification | ZERO — retry (QUARANTINE tracks investigation) |
| Extraction non-deterministic | Restructure source, reformulate extraction | ZERO — retry |
| Schema invalid | Fix entry format, re-normalize | ZERO — retry |
| Provenance incomplete | Re-establish chain, verify links | ZERO — retry |
| Registration gate failure | Address failing condition, re-submit | ZERO — retry |

### 3.2 Packaging Recovery (Phases 1–6)

| Failure | Recovery | Cost |
|---------|---------|------|
| Selection ineligible | Revise entry selection, change target domains | ZERO — retry |
| Strategy blocked by zone | Wait for zone recovery, or adjust strategy | ZERO — retry when zone permits |
| Package limit exceeded | Consolidate existing packages (revoke + repackage) | MODERATE — requires overlay revocation |
| Entry limit exceeded | Consolidate entries into fewer packages | MODERATE — may require repackaging |
| Replay binding failure | Investigate non-determinism, fix entry | LOW — retry after fix |
| Internal conflict | Resolve conflicting entries within package | ZERO — retry |

### 3.3 Post-Registration Recovery

| Failure | Recovery | Cost |
|---------|---------|------|
| Trust violation (STAGED package) | QUARANTINE package, investigate | LOW — package not yet activated |
| Trust violation (ACTIVATED overlay) | SUSPEND overlay, investigate | MODERATE — qualification impact |
| Lineage break (STAGED) | Re-establish provenance, re-bind | LOW — package not yet activated |
| Lineage break (ACTIVATED) | SUSPEND overlay, re-establish or REVOKE | HIGH — qualification may regress |
| Source conflict | QUARANTINE conflicting entries, operator resolves | MODERATE — affected claims paused |
| Replay divergence | FREEZE sandbox, investigate, recover from last MATCH | CRITICAL — potential iteration loss |

---

## 4. Escalation Model

### 4.1 Evidence-Specific Escalation Triggers

| Trigger | From Level | To Level | Action |
|---------|-----------|----------|--------|
| Source authority unverifiable | G-0 | G-1 | Enhanced review, operator investigation |
| Multiple sources conflict | G-0 | G-1 | Operator resolution required |
| Extraction requires interpretation | G-0 | G-1 | Evidence cannot be used without 75.x authorization |
| Trust violation post-registration | G-0 | G-2 | QUARANTINE, governance review |
| Package replay binding fails | G-1 | G-2 | Package blocked, investigate non-determinism |
| Lineage chain broken (ACTIVATED) | G-1 | G-2 | SUSPEND overlay, investigate |
| Trust violation in ACTIVATED overlay | G-2 | G-3 | Governance review board engagement |
| Evidence causes replay divergence | Any | G-4 | FREEZE, mandatory investigation |
| Evidence source contamination | G-2 | G-4 | Emergency — potential baseline impact |

### 4.2 Escalation Impact on Evidence Pipeline

| Level | Impact on Intake | Impact on Packaging |
|-------|-----------------|-------------------|
| G-0 | Standard operations | Standard operations |
| G-1 | Enhanced review, reduced volume | Enhanced validation |
| G-2 | Intake restricted to assessment only | New packaging blocked |
| G-3 | Intake paused (except investigation) | All packaging blocked |
| G-4 | Pipeline frozen | Pipeline frozen |

### 4.3 De-Escalation Through Recovery

| Current Level | De-Escalation Condition | New Level |
|--------------|------------------------|-----------|
| G-4 | Emergency resolved, root cause identified, replay re-verified | G-3 |
| G-3 | Governance review complete, remediation verified | G-2 |
| G-2 | QUARANTINE resolved, trust restored, lineage verified | G-1 |
| G-1 | Enhanced review conditions resolved, normal operations resume | G-0 |

---

## 5. Quarantine Recovery Protocol

### 5.1 Quarantine Investigation

```
ON evidence quarantine:
  STEP 1: Record quarantine with full context
  STEP 2: Determine scope of quarantine impact:
    - If source quarantined: all entries from that source are affected
    - If entry quarantined: specific package is affected
    - If package quarantined: overlay (if activated) is affected
  STEP 3: Suspend affected downstream artifacts
  STEP 4: Investigate quarantine reason
  STEP 5: Determine resolution path:
    a) Resolve condition → restore trust → resume
    b) Replace evidence → new intake for replacement source
    c) Accept quarantine → remove evidence → revoke affected overlays
    d) Upgrade to PROHIBITED → permanent rejection
```

### 5.2 Quarantine Resolution Timeline

| Quarantine Type | Expected Resolution | Maximum Duration |
|----------------|-------------------|-----------------|
| Authority verification pending | Short (days) | 30 days before escalation |
| Source material re-acquisition | Medium (days–weeks) | 60 days before forced decision |
| Source conflict resolution | Variable | No fixed deadline — operator decision |
| Interpretation boundary | Long (may require 75.x authorization) | Until governance authorization |
| Material corruption | Variable | Until replacement obtained or PROHIBITED |

---

## 6. Fail-Closed Conditions

### 6.1 Evidence-Specific Fail-Closed Rules

| # | Condition | Gate | Action |
|---|-----------|------|--------|
| EFC-01 | Circular authority detected (TC-05) | G-TRUST | PROHIBIT source, fail closed |
| EFC-02 | Source hash mismatch after registration | G-PROVENANCE | QUARANTINE, escalate to G-2 |
| EFC-03 | Evidence requires interpretation (no 75.x) | G-EXTRACT | BLOCK extraction, escalate to G-1 |
| EFC-04 | Package exceeds 10-package limit | G-PKG-REGISTER | BLOCK registration |
| EFC-05 | Entries exceed 200-entry limit | G-PKG-REGISTER | BLOCK registration |
| EFC-06 | Replay divergence in evidence-derived state | G-REPLAY-BIND | FREEZE, escalate to G-4 |
| EFC-07 | Lineage chain break in ACTIVATED overlay | G-PROVENANCE | SUSPEND overlay, escalate to G-2 |
| EFC-08 | PROHIBITED source re-submitted | G-TRUST | REJECT, flag as repeat submission |
| EFC-09 | QUARANTINED evidence packaged without resolution | G-PKG-REGISTER | BLOCK registration |
| EFC-10 | Evidence disclosure incomplete for publication | G-REGISTER | BLOCK publication gate |

### 6.2 Fail-Closed Severity

| Severity | Conditions | Response |
|----------|-----------|----------|
| CRITICAL | EFC-06 | Immediate freeze, G-4 escalation |
| HIGH | EFC-02, EFC-07 | Quarantine/suspend, G-2 escalation |
| STANDARD | EFC-01, EFC-03, EFC-04, EFC-05, EFC-08, EFC-09, EFC-10 | Block action, operator notification |

---

## 7. Recovery Guarantees

### 7.1 Always-Recoverable Properties

| Property | Guarantee |
|----------|----------|
| Intake inventory | ALWAYS restorable (append-only, never deleted) |
| Trust assessments | ALWAYS traceable (audit trail preserved) |
| Provenance chains | ALWAYS reconstructable (source hashes retained) |
| Quarantine history | ALWAYS preserved (resolution records retained) |
| Package versions | ALWAYS available (immutable, versioned) |

### 7.2 Recovery Cost by Scenario

| Scenario | Recovery Cost | Pipeline Impact |
|----------|-------------|-----------------|
| Intake failure (Phases 1–7) | ZERO | Retry at failed phase |
| Packaging failure (Phases 1–6) | ZERO | Retry at failed phase |
| Trust violation (STAGED package) | LOW | Remove package, re-intake if possible |
| Trust violation (ACTIVATED overlay) | MODERATE | Suspend overlay, qualification may regress |
| Lineage break (ACTIVATED) | HIGH | May require overlay revocation + re-intake |
| Source contamination (ACTIVATED) | HIGH | May require full iteration rollback |
| Replay divergence | MAXIMUM | Sandbox freeze + investigation + recovery |

---

## 8. Governance

- Pre-registration failures are costless — freely retryable
- Post-registration failures require proportional recovery operations
- 10 evidence-specific fail-closed conditions prevent unsafe progression
- 9 escalation triggers map evidence failures to governance levels
- Quarantine investigation protocol ensures structured resolution
- Recovery guarantees ensure intake inventory and provenance are always restorable
- Every failure, quarantine, and recovery action is audit-logged
- Fail-closed prevents any unsafe evidence from influencing qualification
