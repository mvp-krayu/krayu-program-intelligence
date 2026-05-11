# Evidence and Overlay Lifecycle

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the governed lifecycle for evidence intake, semantic evidence
packaging, overlay proposal, and overlay review/approval — the
upstream stages that feed sandbox activation.

---

## 2. Evidence Intake Lifecycle

### 2.1 Evidence Source Types

| Source Type | Description | Provenance Chain |
|------------|-------------|-----------------|
| Structural topology | Domain/cluster/edge graph from pipeline | PIPELINE_CERTIFIED, hash-verified |
| Architecture documentation | ADRs, design docs, system descriptions | EXTERNAL, provenance-tracked |
| Capability models | Service capability inventories | EXTERNAL, provenance-tracked |
| Operational runbooks | Runtime operational procedures | EXTERNAL, provenance-tracked |
| API specifications | OpenAPI/gRPC/protocol definitions | EXTERNAL, provenance-tracked |
| Infrastructure configuration | Deployment, orchestration, networking | EXTERNAL, provenance-tracked |

### 2.2 Evidence Intake Process

```
STEP 1: Source Identification
  - Identify potential evidence sources for target domains
  - Record source location, access method, format
  - Assess relevance to target domain coverage

STEP 2: Source Validation
  - Verify source exists and is accessible
  - Verify source format is processable
  - Establish provenance chain (who created, when, authority)

STEP 3: Evidence Extraction
  - Extract domain-relevant evidence from source
  - Map evidence to specific domain(s) in topology model
  - Record structural correspondence basis

STEP 4: Confidence Assessment
  - Assess confidence level of extracted evidence:
    DIRECT_CITATION > STRONG_INFERENCE > CONTEXTUAL_DERIVATION
  - Record confidence basis (what structural correspondence supports the claim)
  - Flag any evidence requiring interpretation (not permitted without 75.x authorization)

STEP 5: Evidence Registration
  - Register evidence in intake inventory
  - Assign provenance tracking identifier
  - Link to target domain(s) and claim type(s)
```

### 2.3 Evidence Quality Gate (G-EVIDENCE)

| Check | Requirement |
|-------|------------|
| Source exists | Source material accessible and readable |
| Provenance established | Creator, date, authority chain documented |
| Confidence basis stated | Structural correspondence explicitly described |
| No interpretation | Evidence is structural, not inferred or summarized |
| Domain mapping valid | Target domain exists in topology model |
| No duplicate evidence | Same claim not already present from another source |

---

## 3. Semantic Evidence Packaging Lifecycle

### 3.1 Package Construction Process

```
STEP 1: Entry Assembly
  - For each piece of evidence, create an overlay entry:
    - claim_type: LINEAGE_UPGRADE | LABEL_ASSIGNMENT | etc.
    - target_domain: DOM-NN
    - semantic_class: TECHNICAL (authorized class)
    - confidence: STRONG_INFERENCE (minimum for activation)
    - evidence_basis: structural correspondence description

STEP 2: Package Organization
  - Group entries into packages by strategic intent:
    - Single-domain packages: 1 entry per package (simple, independently revocable)
    - Multi-domain packages: N entries per package (efficient, batch-revocable)
  - Assign package_id (monotonic sequence)

STEP 3: Package Validation
  - Verify all entries have required fields
  - Verify semantic class is authorized (TECHNICAL only for current scope)
  - Verify confidence basis is explicit
  - Compute package hash

STEP 4: Package Registration
  - Register package in sandbox registry (Phase 0: STAGED status)
  - Create package artifact in sandbox namespace
  - Generate PACKAGE_REGISTERED audit event
```

### 3.2 Package Quality Gate (G-PACKAGE)

| Check | Requirement |
|-------|------------|
| Entry format valid | All required fields present and correctly typed |
| Semantic class authorized | Class within authorized set (TECHNICAL) |
| Confidence explicit | Confidence basis stated, not assumed |
| Hash computed | Package content hash recorded for integrity |
| Target domain valid | Domain exists in topology, overlay-eligible (NONE or PARTIAL) |
| No self-conflict | Entries within package do not conflict |

---

## 4. Overlay Proposal Lifecycle

### 4.1 Proposal Construction

```
STEP 1: Batch Selection
  - Select packages for this iteration's activation batch
  - Respect governance zone constraints:
    SAFE zone: up to 5 new overlays
    PRESSURE zone: up to 3 new overlays (with enhanced review)
    RISK zone: no new overlays (existing only)

STEP 2: Impact Projection
  - For each proposed package, compute:
    - backed_count impact (current → projected)
    - grounding_ratio impact
    - S-state impact (will this push to S3?)
    - Domain coverage change

STEP 3: Coexistence Assessment
  - Check proposed batch against all existing active overlays:
    - Domain overlap: do any proposed overlays target same domain?
    - Dependency: does any proposed overlay depend on another?
    - Conflict: do any proposed overlays make competing claims?
  - Compute coexistence density after activation

STEP 4: Governance Zone Projection
  - Project governance zone after all proposed activations:
    - Overlay saturation ratio
    - Coexistence density
    - Re-evaluation count
    - Dependency depth
  - Verify projected zone ≤ PRESSURE

STEP 5: Proposal Documentation
  - Record full proposal with:
    - Ordered package list
    - Per-package impact projection
    - Coexistence assessment
    - Governance zone projection
    - Risk assessment
```

### 4.2 Proposal Quality Gate (G-PROPOSAL)

| Check | Requirement |
|-------|------------|
| Governance zone | Projected zone ≤ PRESSURE after activation |
| Overlay count | Total active ≤ SAFE threshold (5) or PRESSURE threshold (7) with enhanced review |
| Coexistence | Zero critical conflicts in proposed batch |
| Dependency depth | Projected depth ≤ 2 |
| Entry count | Projected total entries ≤ 200 |
| Batch size | Batch ≤ 5 packages (batch activation limit) |

---

## 5. Overlay Review and Approval Lifecycle

### 5.1 Review Process

```
STEP 1: Proposal Review
  - Operator reviews:
    - Each proposed package (entries, target domains, confidence)
    - Impact projections (backed_count, grounding, S-state)
    - Coexistence assessment (conflicts, dependencies)
    - Governance zone projection

STEP 2: Impact Confirmation
  - Operator confirms understanding of:
    - Qualification state change
    - Governance zone transition (if any)
    - Rollback implications (what happens if revoked)
    - S-state regression risk (if S3 would be achieved)

STEP 3: Authorization Decision
  - APPROVE: All packages in batch authorized for activation
  - APPROVE_PARTIAL: Subset of packages authorized
  - DENY: No packages authorized (reason recorded)
  - DEFER: Decision postponed (packages remain STAGED)

STEP 4: Authorization Recording
  - Record authorization decision with:
    - Authorized packages list
    - Operator identity
    - Timestamp
    - Scope and constraints
    - Escalation level at time of decision
```

### 5.2 Approval Gate (G-APPROVAL)

| Check | Requirement |
|-------|------------|
| Operator authority | Operator has authorization for current escalation level |
| Impact reviewed | Impact preview acknowledged |
| Escalation appropriate | G-0 for SAFE, G-1 for PRESSURE, G-2 for RISK |
| Decision recorded | Authorization decision in audit trail |
| Scope explicit | Which packages, which constraints |

---

## 6. Package Strategy Patterns

### 6.1 Single-Domain Packages (Recommended for Initial Operations)

```
Package: SEP-<client>-<run>-NNN
Entries: 1
Target: 1 domain
Benefit: Independently revocable, simple attribution
Cost: More packages needed, more governance decisions
Best for: First 3–5 overlays, SAFE zone operations
```

### 6.2 Multi-Domain Packages (Recommended for Scaled Operations)

```
Package: SEP-<client>-<run>-NNN
Entries: 3–5
Targets: 3–5 domains (same cluster recommended)
Benefit: Fewer packages, fewer governance decisions, stays within limits
Cost: Batch revocation (cannot revoke single domain within package)
Best for: Iterations 2+, approaching 10-package limit
```

### 6.3 BlueEdge Strategy

| Iteration | Strategy | Packages | Entries | Domains |
|-----------|----------|----------|---------|---------|
| 1 (proven) | Single-domain | 3 | 3 | 3 |
| 2 (planned) | Multi-domain | 1–2 | 3 | 3 |
| 3 (planned) | Multi-domain | 1–2 | 4 | 4 |
| 4 (planned) | Multi-domain | 1 | 3 | 3 |
| Total | Mixed | 6–8 (within 10 limit) | 13 | 13 |

---

## 7. Governance

- Evidence intake follows a 5-step process with provenance tracking
- Evidence packaging follows a 4-step process with hash verification
- Overlay proposals are constrained by governance zone projections
- Approval requires operator review of impact, coexistence, and zone implications
- Package strategy evolves from single-domain to multi-domain as confidence grows
- All evidence is structural (no interpretation without 75.x authorization)
- All packaging decisions are auditable through the governance trail
