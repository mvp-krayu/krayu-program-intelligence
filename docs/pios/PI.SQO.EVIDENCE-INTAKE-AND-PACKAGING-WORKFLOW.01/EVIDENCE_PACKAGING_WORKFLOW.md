# Evidence Packaging Workflow

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the canonical governed workflow by which registered evidence
becomes a replay-safe semantic evidence package (SEP) — the governed
container that crosses the packaging boundary and becomes overlay-ready
operational input.

---

## 2. Packaging Workflow Overview

### 2.1 Six-Phase Packaging Pipeline

```
Phase 1: Evidence Selection
    │   Select registered evidence for packaging
    ▼
Phase 2: Package Strategy
    │   Determine single-domain vs multi-domain packaging
    ▼
Phase 3: Entry Assembly
    │   Assemble evidence into SEP entry format
    ▼
Phase 4: Package Validation
    │   Validate structure, authorization, integrity
    ▼
Phase 5: Replay Binding
    │   Bind package to replay-safe contract
    ▼
Phase 6: Package Registration
    │   Register package in sandbox registry as STAGED
    ▼
[Output: STAGED semantic evidence package — overlay-ready]
```

### 2.2 Packaging Boundary Rule

Evidence crosses the packaging boundary at Phase 6 (Package
Registration). Before Phase 6, evidence is REGISTERED but not
yet a package. After Phase 6, evidence exists as a governed SEP
in STAGED status, available for proposal and activation.

---

## 3. Phase 1: Evidence Selection

### 3.1 Selection Process

```
STEP 1: Review registered evidence inventory
  - List all REGISTERED evidence entries by domain
  - Filter by trust level (TRUSTED or PROVISIONAL only)
  - Filter by target domains matching progression target

STEP 2: Assess packaging readiness
  - For each candidate entry:
    - Evidence basis is explicit and complete?
    - Confidence basis is justified?
    - Semantic class is authorized?
    - Target domain is overlay-eligible (status NONE or PARTIAL)?

STEP 3: Select entries for packaging
  - Group related entries by strategic intent
  - Prioritize entries with higher confidence basis
  - Respect architectural limits:
    - ≤ 200 total entries across all packages
    - ≤ 10 total packages

STEP 4: Record selection rationale
  - Document why these entries were selected
  - Document which entries were deferred and why
  - Generate EVIDENCE_SELECTED intake event
```

### 3.2 Selection Gate (G-SELECT)

| Check | Requirement |
|-------|------------|
| Trust level valid | All selected entries are TRUSTED or PROVISIONAL |
| Confidence basis present | All entries have explicit confidence basis |
| Semantic class authorized | All entries reference authorized class for source type |
| Domain overlay-eligible | Target domains are NONE or PARTIAL (not already FULL) |
| Architectural limits | Selection does not exceed 200 total entries or 10 total packages |

---

## 4. Phase 2: Package Strategy

### 4.1 Strategy Decision

```
DETERMINE packaging strategy based on:

1. Progression phase
   - Early iterations (1-2): SINGLE-DOMAIN recommended
   - Later iterations (3+): MULTI-DOMAIN recommended

2. Domain cluster alignment
   - Same cluster: MULTI-DOMAIN efficient
   - Cross-cluster: SINGLE-DOMAIN safer

3. Revocation granularity need
   - High granularity: SINGLE-DOMAIN (independent revocation)
   - Low granularity: MULTI-DOMAIN (batch revocation acceptable)

4. Package count pressure
   - Below 5 packages: either strategy
   - 5-8 packages: consolidate with MULTI-DOMAIN
   - 8+ packages: MULTI-DOMAIN mandatory (approaching limit)
```

### 4.2 Strategy Patterns

| Strategy | Entries/Package | Domains/Package | Revocation | Best For |
|----------|:--------------:|:---------------:|-----------|---------|
| SINGLE-DOMAIN | 1 | 1 | Independent per domain | First iterations, SAFE zone |
| CLUSTER-ALIGNED | 2–5 | 2–5 (same cluster) | Batch per cluster | Scaled iterations, SAFE/PRESSURE |
| DOMAIN-GROUPED | 2–5 | 2–5 (related domains) | Batch per group | Efficient coverage, approaching limits |
| MAXIMAL | 5–10 | 5–10 | Batch (coarse) | Final iterations, near 10-package limit |

### 4.3 Strategy Constraints

| Constraint | Limit | Source |
|-----------|-------|--------|
| Max entries per package | No hard limit, but ≤ 10 recommended | Operational guidance |
| Max domains per package | No hard limit, but ≤ 5 recommended | Operational guidance |
| Max packages total | 10 (architectural limit) | MULTI_OVERLAY_ACTIVATION_SEQUENCING |
| Max entries total | 200 (architectural limit) | MULTI_OVERLAY_ACTIVATION_SEQUENCING |
| Batch activation max | 5 packages per iteration | MULTI_OVERLAY_ACTIVATION_SEQUENCING |

---

## 5. Phase 3: Entry Assembly

### 5.1 Assembly Process

```
FOR each package in the strategy:

  STEP 1: Create package header
    - package_id: SEP-<client>-<run_id>-<seq> (monotonic)
    - schema_version: "1.0"
    - package_version: 1 (initial)
    - status: "STAGED" (will be set at registration)

  STEP 2: Assemble provenance block
    - source_authority: from registered evidence
    - source_type: from source classification
    - source_hash: from intake registration
    - ingestion_stream: current stream ID
    - ingestion_commit: current git commit
    - ingestion_timestamp: current timestamp

  STEP 3: Assemble evidence entries
    FOR each entry in this package:
      - entry_id: SEP-ENTRY-<seq> (monotonic within package)
      - semantic_class: from registered evidence
      - target_domain: DOM-NN from registered evidence
      - claim_type: determined during extraction
      - claim: { field, proposed_value, evidence_basis }
      - confidence_basis: from registered evidence
      - replay_safe: true

  STEP 4: Compute overlay metadata
    - entry_count: number of entries
    - affected_domains: list of target domains
    - estimated_impact: { grounding_delta, continuity_delta, debt_resolution_count }

  STEP 5: Declare governance properties
    - substrate_mutation: false
    - path_a_mutation: false
    - path_b_mutation: false
    - additive_only: true
    - independently_removable: true
    - replay_safe: true
    - provenance_bound: true
```

### 5.2 Assembly Constraints

| Constraint | Requirement |
|-----------|------------|
| Entry ordering | Entries ordered by entry_id within package |
| Single semantic class per entry | Each entry targets exactly one class |
| No cross-class entries | Entry cannot claim multiple classes |
| Package covers specific domains | Package clearly identifies all affected domains |
| Governance block is immutable | Once assembled, governance properties cannot be modified |

---

## 6. Phase 4: Package Validation

### 6.1 Validation Process

```
STEP 1: Schema validation
  - Verify package conforms to semantic_evidence_package.v1 schema
  - All required fields present and correctly typed
  - No unknown or forbidden fields

STEP 2: Semantic class validation
  - Every entry's semantic_class is in package's semantic_class_authorizations
  - Every authorized class has at least one entry (or justification for empty)
  - No entry references an unauthorized class

STEP 3: Provenance validation
  - source_hash is non-empty
  - source_authority is non-empty and not the processing system
  - ingestion_stream is non-empty
  - Every entry has non-empty evidence_basis
  - Every entry has valid confidence_basis

STEP 4: Integrity validation
  - Compute package_hash = sha256(JSON.stringify(package, sorted_keys))
  - Record hash for future verification
  - Verify no entries are duplicated within package
  - Verify no entries conflict within package (same domain, same field, different value)

STEP 5: Governance validation
  - substrate_mutation = false
  - path_a_mutation = false
  - path_b_mutation = false
  - additive_only = true
  - independently_removable = true
  - replay_safe = true
  - provenance_bound = true
```

### 6.2 Package Validation Gate (G-PACKAGE)

| Check | Requirement |
|-------|------------|
| Schema valid | Package conforms to SEP v1 schema |
| Semantic class authorized | All entries reference authorized classes |
| Provenance complete | Full provenance chain from source to entry |
| Hash computed | Package integrity hash recorded |
| No internal conflicts | No entries within package contradict each other |
| Governance assertions true | All governance properties correctly declared |
| Entry count within limits | Total entries (across all packages) ≤ 200 |
| Package count within limits | Total packages (across all active + staged) ≤ 10 |

---

## 7. Phase 5: Replay Binding

### 7.1 Replay Binding Process

```
STEP 1: Verify replay-safe attestation
  - Every entry has replay_safe: true
  - Every entry has deterministic evidence_basis
  - Package hash is computed from deterministic serialization

STEP 2: Bind to overlay application order
  - Package will be applied in package_id sequence order
  - Entries will be applied in entry_id sequence order within package
  - Application order is deterministic (monotonic IDs)

STEP 3: Verify conflict resolution determinism
  - If any entry targets same domain+field as existing overlay:
    - Conflict resolution rules are deterministic (later wins, higher confidence wins)
    - Conflicts are recorded (no silent overwrite)

STEP 4: Bind to rollback contract
  - Package removal restores prior state exactly
  - Package is independently removable
  - No dependency on other packages (unless explicit)

STEP 5: Record replay binding
  - Persist replay binding attestation
  - Generate REPLAY_BINDING_COMPLETE intake event
```

### 7.2 Replay Binding Gate (G-REPLAY-BIND)

| Check | Requirement |
|-------|------------|
| All entries replay-safe | replay_safe: true on every entry |
| Application order deterministic | Package and entry IDs are monotonic |
| Conflict resolution deterministic | Rules are explicit, no ambiguity |
| Rollback contract bound | Package is independently removable |
| Replay binding recorded | Attestation persisted in package |

---

## 8. Phase 6: Package Registration

### 8.1 Registration Process

```
STEP 1: Final pre-registration validation
  - All 5 prior phases complete
  - All gates passed
  - Package hash verified

STEP 2: Register in sandbox registry
  - Set status: STAGED
  - Record package_id in package_registry.json
  - Persist package artifact to:
    artifacts/sqo/<client>/<run_id>/semantic_evidence_packages/

STEP 3: Generate registration event
  - PACKAGE_REGISTERED audit event
  - Package available for proposal workflow

STEP 4: Update governance state
  - Update total package count
  - Update total entry count
  - Verify architectural limits not exceeded
```

### 8.2 Registration Gate (G-PKG-REGISTER)

| Check | Requirement |
|-------|------------|
| All prior gates passed | G-SELECT, G-PACKAGE, G-REPLAY-BIND |
| Package hash verified | Stored hash matches computed hash |
| Architectural limits | Package count ≤ 10, entry count ≤ 200 |
| No duplicate package_id | Package ID is unique in registry |
| Status is STAGED | Package does not bypass to ACTIVATED |

---

## 9. Package Versioning

### 9.1 Version Rules

| Rule | Description |
|------|------------|
| Monotonic versioning | Package versions increment: v1, v2, v3... |
| Immutable versions | Once persisted, a version cannot be modified |
| New version = new intake | Changing package content requires new version |
| Prior versions retained | All versions remain for audit trail |
| Only latest version activatable | Earlier versions become superseded |

### 9.2 Version Lifecycle

```
SEP-<client>-<run>-001.v1.json  →  STAGED → ACTIVATED → REVOKED
SEP-<client>-<run>-001.v2.json  →  STAGED → ACTIVATED (supersedes v1)
```

---

## 10. Governance

- 6-phase packaging pipeline transforms registered evidence into STAGED SEPs
- 5 packaging-specific gates ensure no ungoverned packages enter sandbox
- Package strategy adapts to progression phase and governance zone
- All packages are versioned, immutable, and independently attributable
- Replay binding ensures deterministic overlay application
- Architectural limits (10 packages, 200 entries) enforced at registration
- No package may bypass STAGED status to reach ACTIVATED directly
- Every packaging phase produces an auditable event
