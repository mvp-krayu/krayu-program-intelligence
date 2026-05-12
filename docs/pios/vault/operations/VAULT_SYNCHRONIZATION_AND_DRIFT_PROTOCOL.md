# Vault Synchronization and Drift Protocol

> **How to detect when the vault has drifted from architectural reality.**

---

## 1. Purpose

The vault is a snapshot of architectural truth at the time of its last update. Code, streams, and runtime surfaces continue to evolve. Without active drift detection, the vault silently becomes a historical artifact rather than an operational memory.

This protocol defines how drift is detected, measured, and corrected.

---

## 2. Drift Categories

### 2.1 Content Drift

The vault says one thing; the code says another.

| Type | Example | Detection |
|---|---|---|
| Status drift | Vault says PROVISIONAL; code treats it as CANONICAL | Compare vault status against actual usage patterns |
| Terminology drift | Vault defines a term one way; code/comments use it differently | Grep codebase for locked terms, compare usage |
| Boundary drift | Vault says layer X owns concept Y; code has it in layer Z | Compare vault ownership claims against file locations |
| Lineage drift | Vault stops at commit X; 50 more commits have landed | Compare vault git references against actual git log |

### 2.2 Structural Drift

The vault is missing sections or has orphaned sections.

| Type | Example | Detection |
|---|---|---|
| Missing concept | New architectural concept exists in code but not in vault | Scan for named concepts in code not present in vault |
| Orphaned page | Vault page describes a concept that no longer exists | Check vault concept references against codebase |
| Broken link | Wiki-link [[target]] has no corresponding page | Scan for unresolved wiki-links |
| Dead cross-reference | Page references a superseded or deleted page | Verify all cross-reference targets exist |

### 2.3 Temporal Drift

The vault's chronology has fallen behind.

| Type | Example | Detection |
|---|---|---|
| Stale canonical state | PIOS_CURRENT_CANONICAL_STATE.md not updated after G1 stream | Check last-modified date against recent G1 closures |
| Missing chronology | New architectural events not recorded in chronology tables | Compare stream closures against chronology entries |
| Stale terminology | New terms in use that aren't in TERMINOLOGY_LOCK.md | Grep for term-like patterns not in lock file |

---

## 3. Drift Detection Methods

### 3.1 Passive Detection (During Preflight)

Every architecture memory preflight includes staleness checks. These catch temporal drift automatically.

See [[ARCHITECTURE_MEMORY_PREFLIGHT]] §3.2.

### 3.2 Active Detection (Periodic Audit)

A dedicated drift detection pass can be run as a governance stream:

```
DRIFT AUDIT PROTOCOL

1. Load PIOS_CURRENT_CANONICAL_STATE.md
2. For each concept listed as CANONICAL or PROVISIONAL:
   a. Verify concept exists in codebase (grep/find)
   b. Verify status matches actual usage
   c. Verify terminology matches TERMINOLOGY_LOCK.md definitions
   d. Verify git lineage is current (last recorded commit vs actual)
3. Scan vault for concepts NOT in PIOS_CURRENT_CANONICAL_STATE.md
4. Scan codebase for architectural patterns NOT in vault
5. Verify all wiki-links resolve
6. Produce DRIFT REPORT
```

### 3.3 Stream-Triggered Detection (Post-Closure)

After every G1 stream closure, verify:

- All mutation delta entries were propagated to vault
- No vault pages reference superseded concepts as active
- Chronology tables include the stream's events

See [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] for integration.

---

## 4. Drift Report Format

```markdown
## Vault Drift Report

### Date: <date>
### Auditor: <stream-id or operator>

### Content Drift
| Concept | Vault State | Actual State | Severity |
|---|---|---|---|
| <concept> | <what vault says> | <what code shows> | HIGH/MEDIUM/LOW |

### Structural Drift
| Issue | Location | Severity |
|---|---|---|
| <issue description> | <vault file> | HIGH/MEDIUM/LOW |

### Temporal Drift
| Indicator | Last Updated | Current Gap | Severity |
|---|---|---|---|
| <what's stale> | <last update date> | <days/streams behind> | HIGH/MEDIUM/LOW |

### Unresolved Wiki-Links
| Source Page | Broken Link |
|---|---|
| <page> | [[<target>]] |

### Summary
- Total drift items: <count>
- HIGH severity: <count>
- Recommended action: SYNC / GOVERNANCE_REVIEW / ACCEPTABLE
```

---

## 5. Drift Severity

| Severity | Meaning | Action |
|---|---|---|
| HIGH | Vault contradicts current architectural truth | Immediate correction required |
| MEDIUM | Vault is incomplete or stale but not contradictory | Correction in next G1 stream |
| LOW | Vault could be more detailed but is not misleading | Correction when convenient |

---

## 6. Drift Correction

### 6.1 Correction Authority

| Drift Type | Who May Correct |
|---|---|
| Content drift (status, terminology) | Governance stream only |
| Structural drift (missing pages) | Any G1 stream may add; governance to restructure |
| Temporal drift (stale dates) | Any G1 stream during post-flight |
| Broken links | Any stream (mechanical fix) |

### 6.2 Correction Process

1. Identify drift (via detection methods above)
2. Classify severity
3. If HIGH: correction is mandatory before next G1 stream proceeds
4. If MEDIUM: correction is mandatory in next G1 stream's post-flight
5. If LOW: correction is recorded but not blocking

### 6.3 Correction Record

Every drift correction MUST be recorded:

```
DRIFT CORRECTION
Date: <date>
Stream: <correcting-stream-id>
Drift item: <description>
Severity: <HIGH/MEDIUM/LOW>
Correction: <what was changed>
Vault files updated: <list>
```

---

## 7. Acceptable Drift

Some drift is expected and non-harmful:

- Git lineage 1-2 commits behind (will be caught at next G1 closure)
- Chronology missing non-architectural commits
- Vault pages with slightly outdated cross-references to non-critical pages

Acceptable drift becomes unacceptable when:
- It would cause a new session to load incorrect architectural state
- It would cause terminology to be used with wrong meaning
- It would cause a superseded concept to be treated as active

---

## 8. Cross-References

- [[ARCHITECTURE_MEMORY_PREFLIGHT]] — passive drift detection during preflight
- [[STREAM_CLOSURE_AND_MEMORY_PROPAGATION]] — stream-triggered drift detection
- [[ONTOLOGY_DRIFT_DETECTION]] — existing vault drift detection (section 11)
- [[FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT]] — enforcement when drift is HIGH severity
- [[TERMINOLOGY_LOCK]] — terminology drift baseline
