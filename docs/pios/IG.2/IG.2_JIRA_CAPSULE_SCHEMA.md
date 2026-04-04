# IG.2 — Jira Capsule Schema

**Stream:** IG.2
**Parent:** IG.1
**Layer:** INGESTION
**Status:** ACTIVE
**Date:** 2026-04-04

---

## 1. PURPOSE

This document defines the deterministic Jira capsule used by the IG.2 Jira adapter in CAPSULE mode. The capsule is static and baseline-equivalent — it produces the same output on every invocation and introduces zero semantic delta to the 40.x artifact set.

---

## 2. CAPSULE PROPERTIES

| Property | Value |
|---|---|
| Mode | CAPSULE (static; no live Jira connection) |
| Determinism | CONFIRMED — schema is fixed and versioned |
| Delta | ZERO — capsule data does not appear in 40.x content |
| Version | v1.0 |

---

## 3. NOTIONAL PROJECT STRUCTURE

The capsule simulates a Jira project for the Krayu Program Intelligence Discipline.

| Field | Value |
|---|---|
| Project key | `KRAYU` |
| Project type | Software |
| Epic hierarchy | Program stream → Epic → Story |

---

## 4. STREAM-TO-EPIC MAPPING

| Stream | Notional Epic ID | Epic Summary |
|---|---|---|
| IG.1 (Ingestion Foundation) | KRAYU-E001 | Baseline re-ingestion and invariance verification |
| IG.1A | KRAYU-S001 | Bootstrap interface definition |
| IG.1B | KRAYU-S002 | Baseline binding |
| IG.1C | KRAYU-S003 | Re-ingestion execution |
| IG.1C-AC | KRAYU-S004 | Admissibility check |
| IG.1D | KRAYU-S005 | Invariance comparison |
| IG.1R | KRAYU-S006 | Methodology correction (CE-003 drift) |
| IG.1D-R | KRAYU-S007 | Invariance re-check |
| IG.1E | KRAYU-S008 | Determinism re-run |
| IG.2 | KRAYU-S009 | Adapter simulation |

---

## 5. CAPSULE RECORD FORMAT

Each capsule record is a static key-value map. No live Jira API calls are made.

```
jira_capsule_version: v1.0
jira_project: KRAYU
jira_mode: CAPSULE
jira_epic: KRAYU-E001
jira_story: KRAYU-S009
jira_status: IN_PROGRESS
jira_assignee: mvp-krayu
jira_sprint: IG-Sprint-1
```

---

## 6. CAPSULE BINDING RULES

| Rule | Value |
|---|---|
| Capsule is READ-ONLY | YES — no writes to Jira system |
| Capsule record appears in | adapter_binding.md only |
| Capsule record NOT in | any 40.2, 40.3, or 40.4 artifact |
| Same capsule record for all runs | YES — deterministic |

---

## 7. DETERMINISM PROOF

The capsule schema is fully determined by:
1. This document (static definition)
2. The stream ID (IG.2)

Given the same stream ID, the capsule always returns the same record. No external state, no timestamps, no random values.

**Determinism: CONFIRMED**
