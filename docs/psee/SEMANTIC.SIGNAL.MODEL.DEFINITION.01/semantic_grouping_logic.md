# Semantic Grouping Logic
# SEMANTIC.SIGNAL.MODEL.DEFINITION.01 — Deliverable 3

## Identity

- Contract: SEMANTIC.SIGNAL.MODEL.DEFINITION.01
- Date: 2026-04-13
- Branch: work/psee-runtime
- Mode: STRICT SPECIFICATION — NO CODE CHANGES

---

## Purpose

This document formalizes the repeatable grouping logic for semantic construction at both levels:
- **Section A**: COMPONENT → CAPABILITY (GLC rules)
- **Section B**: CAPABILITY → DOMAIN (GLD rules)

All rules are stated formally with required signals, decision conditions, and edge case handling.

---

## Notation

| symbol | meaning |
|--------|---------|
| C, Ci, Cj | Components (from S1 component inventory) |
| CAP-? | Capability (semantic grouping of components) |
| DOM-? | Domain (semantic grouping of capabilities) |
| s1(C) | S1 signal bundle for component C |
| s2(C) | S2 signal bundle for component C |
| s3(C) | S3 signal bundle for component C |
| s4(C) | S4 signal bundle for component C |
| s5(C) | S5 signal bundle for component C |
| T_coupling | S3 coupling score threshold (default: 0.25) |
| T_coexec | S4 co-execution count threshold (default: 1) |
| T_keyword | S2 minimum shared keyword count for grouping (default: 2) |

---

## Section A — COMPONENT → CAPABILITY Grouping

### Overview

A CAPABILITY is a named functional group of components that serve a common operational purpose. Capability grouping takes the full component inventory (from S1) and produces a minimal, non-overlapping capability assignment for every component.

**Output:** An assignment function `cap_assign: COMP-NN → CAP-NN` such that every component belongs to exactly one capability (unless cross-domain annotated).

---

### GLC-1 — Structural Co-location Rule

**Required signals:** S1

**Condition:**
```
IF s1(Ci).parent_boundary == s1(Cj).parent_boundary
   AND s1(Ci).parent_boundary ≠ repository_root
THEN structural_colocated(Ci, Cj) = TRUE
```

**Weight:** HIGH — structural co-location is the strongest grouping indicator

**Application:**
- Components satisfying GLC-1 are placed in the same initial capability candidate
- GLC-1 candidate groups are refined by subsequent rules

**Override condition:**
- GLC-1 group may be SPLIT if GLC-3 coupling_score < T_coupling AND GLC-2 keyword overlap < T_keyword AND s1 boundary is only a filesystem convention (e.g., components grouped alphabetically, not semantically)
- Split requires evidence of semantic divergence from at least one of GLC-2 or GLC-3

---

### GLC-2 — Naming Cohesion Rule

**Required signals:** S2

**Condition:**
```
shared_keywords(Ci, Cj) = s2(Ci).domain_keywords ∩ s2(Cj).domain_keywords
IF |shared_keywords(Ci, Cj)| >= T_keyword
THEN naming_cohesive(Ci, Cj) = TRUE
```

**Weight:** MEDIUM — naming cohesion supports grouping; ambiguous names reduce weight

**Application:**
- Components satisfying GLC-2 are grouping candidates
- GLC-2 alone is insufficient for capability assignment — must be corroborated by at least one other rule

**Override condition:**
- GLC-2 overridden if shared keyword is platform-generic (appears in >50% of all components)
- Generic keywords must be removed from domain vocabulary before applying this rule (see DR-S2-2 STOPWORD_SET)

---

### GLC-3 — Dependency Coupling Rule

**Required signals:** S3

**Condition:**
```
IF s3(Ci,Cj).coupling_score >= T_coupling
THEN dependency_coupled(Ci, Cj) = TRUE

IF s3(Ci).cluster_id == s3(Cj).cluster_id AND s3(Ci).cluster_id ≠ null
THEN cluster_cohesive(Ci, Cj) = TRUE
```

**Weight:** MEDIUM-HIGH — coupling evidence is directly observable; coupling clusters are strong grouping signals

**Application:**
- Components satisfying dependency_coupled OR cluster_cohesive are grouping candidates
- Hub components (S3.is_hub = TRUE) are EXCLUDED from coupling-based grouping for their hub role; they are assigned based on their primary functional role (determined by S2 + S5)

**Hub Handling:**
```
IF s3(C).is_hub == TRUE AND s3(C).hub_type == SHARED_SERVICE:
  Assign C to SHARED_PLATFORM_SERVICE capability
  Record cross_cutting = TRUE
  Do NOT use C's coupling edges to group other components
```

---

### GLC-4 — Execution Co-participation Rule

**Required signals:** S4 (requires PEG)

**Condition:**
```
IF s4_available == TRUE:
  IF s4(Ci,Cj).coexec_score >= T_coexec
  THEN execution_coparticipant(Ci, Cj) = TRUE
  IF s4(Ci,Cj).coexec_score >= T_strong_coexec
  THEN strong_execution_coparticipant(Ci, Cj) = TRUE
ELSE:
  GLC-4 = ABSENT for this execution (grouping proceeds on GLC-1..3 only)
```

**Weight:** HIGH — execution co-participation provides quantitative operational evidence

**Application:**
- Strong co-execution pairs are high-confidence grouping candidates
- Single-path co-execution is a supporting signal
- Components sharing all their execution paths are candidates for the same capability

---

### GLC-5 — Intent Alignment Rule

**Required signals:** S5 (derived from S1–S4)

**Condition:**
```
IF s5(Ci).inferred_intent_label == s5(Cj).inferred_intent_label
   AND s5(Ci).confidence >= MEDIUM
   AND s5(Cj).confidence >= MEDIUM
   AND AT LEAST ONE of (GLC-1 || GLC-2 || GLC-3 || GLC-4) is also satisfied
THEN intent_aligned(Ci, Cj) = TRUE
```

**Weight:** MEDIUM — S5 alone is insufficient; must corroborate at least one S1–S4 rule

**Critical constraint:** GLC-5 NEVER overrides a rejection from GLC-1..4. It can elevate a weak grouping candidate to confirmed; it cannot create a grouping against evidence.

---

### COMP → CAP Decision Flow

```
STEP 1: Apply GLC-1 (Structural Co-location)
  → Form initial candidate groups by shared parent boundary

STEP 2: Apply GLC-3 (Dependency Coupling)
  → Identify coupling clusters
  → Identify hub components; handle separately

STEP 3: Apply GLC-2 (Naming Cohesion)
  → Validate candidate groups with naming evidence
  → Split GLC-1 groups where naming diverges significantly

STEP 4: Apply GLC-4 (Execution Co-participation)  [if S4 available]
  → Validate groupings with execution evidence
  → Merge small groups that share strong execution paths

STEP 5: Apply GLC-5 (Intent Alignment)  [with corroboration requirement]
  → Disambiguate remaining unclear assignments
  → Confirm or flag uncertain groupings

STEP 6: Resolve Outstanding Components
  → Components with zero grouping signals: assign ISOLATED capability (1:1)
  → Components with conflicting signals: record conflict; apply resolution rules below
  → Components that are pure infrastructure: assign to INFRASTRUCTURE capability cluster

STEP 7: Assign Canonical CAP Identifiers
  → Name each capability using S2 vocabulary of member components
  → If no S2 vocabulary: use S5 intent label
  → Record all signal evidence per capability
```

---

### Signal Sufficiency Matrix (COMP → CAP)

| evidence_level | required_rules | confidence |
|---------------|---------------|-----------|
| DIRECT_EVIDENCE | GLC-1 + one of (GLC-2, GLC-3, GLC-4) | HIGH |
| DERIVED | GLC-3 + GLC-2 (no GLC-1 corroboration) | MEDIUM |
| INFERRED | GLC-5 + one other rule (GLC-1..4) | MEDIUM |
| WEAKLY_GROUNDED | GLC-5 only OR single signal only | LOW — flag required |
| UNASSIGNABLE | Zero rules satisfied | REJECT — cannot assign |

---

### Outlier Handling (COMP → CAP)

| outlier_type | condition | resolution |
|-------------|-----------|-----------|
| ISOLATED_COMPONENT | No signals connect to any other component | Create 1:1 capability (component is entire capability) |
| CROSS_DOMAIN_COMPONENT | Strong signals to two different capability groups | Apply cross-domain annotation; assign to primary group; record secondary |
| HUB_COMPONENT | S3.is_hub = SHARED_SERVICE | Assign to SHARED_SERVICES capability; cross-cutting annotation |
| WEAKLY_EVIDENCED_COMPONENT | Only S5 signals, low confidence | Assign to best candidate; flag WEAKLY_GROUNDED |
| ORPHAN_COMPONENT | Test-only or build-only component | Assign to ENGINEERING_SUPPORT capability |

---

### Capability Naming Rules

```
1. Capability name MUST derive from S2 keyword vocabulary of member components
   OR from S5 inferred_intent_label (only if S2 insufficient)
2. Capability name MUST NOT be purely a component name (unless 1:1 capability)
3. Capability name SHOULD be a noun phrase describing functional purpose
4. Capability name MAY NOT introduce vocabulary absent from S1–S5 signal bundle
```

---

## Section B — CAPABILITY → DOMAIN Grouping

### Overview

A DOMAIN is a named semantic grouping of capabilities that serve a common program purpose. Domain grouping takes the capability inventory and produces a non-overlapping domain assignment for every capability.

**Output:** An assignment function `dom_assign: CAP-NN → DOM-NN` such that every capability belongs to exactly one domain (unless cross-domain annotated).

**Minimum domain size:** 2 components (across all capabilities in the domain) — unless single-component domain is explicitly justified by strong S1 structural evidence.

---

### GLD-1 — Execution Domain Cohesion Rule

**Required signals:** S4 (requires PEG)

**Condition:**
```
IF s4_available == TRUE:
  For each capability pair (CAP-A, CAP-B):
    shared_paths = EP-NN paths containing members of both CAP-A and CAP-B
    IF |shared_paths| >= T_coexec_cap (default: 2)
    THEN execution_domain_cohesive(CAP-A, CAP-B) = TRUE
ELSE:
  GLD-1 = ABSENT
```

**Weight:** HIGH — shared execution paths reveal operational coupling that transcends module boundaries

**Application:**
- Capabilities sharing multiple execution paths are domain grouping candidates
- Execution path-based domains tend to be OPERATIONAL or FUNCTIONAL domains

---

### GLD-2 — Dependency Topology Rule

**Required signals:** S3

**Condition:**
```
For each capability pair (CAP-A, CAP-B):
  cap_coupling_score(CAP-A, CAP-B) =
    Σ s3(Ci,Cj).coupling_score for all Ci ∈ CAP-A, Cj ∈ CAP-B
    / (|CAP-A| × |CAP-B|)

IF cap_coupling_score(CAP-A, CAP-B) >= T_cap_coupling (default: 0.15)
THEN dependency_domain_cohesive(CAP-A, CAP-B) = TRUE
```

**Weight:** MEDIUM — inter-capability coupling indicates domain-level dependency

**Application:**
- High inter-capability coupling supports domain grouping
- Low coupling is a domain boundary signal (capabilities that don't depend on each other are likely in different domains)

---

### GLD-3 — Naming Convergence Rule

**Required signals:** S2

**Condition:**
```
For each capability pair (CAP-A, CAP-B):
  cap_vocabulary(CAP-A) = union of all s2(C).domain_keywords for C ∈ CAP-A
  cap_vocabulary(CAP-B) = union of all s2(C).domain_keywords for C ∈ CAP-B
  
  shared_domain_vocabulary = cap_vocabulary(CAP-A) ∩ cap_vocabulary(CAP-B)
  
  IF |shared_domain_vocabulary| >= T_domain_keyword (default: 3)
  THEN naming_domain_convergent(CAP-A, CAP-B) = TRUE
```

**Weight:** MEDIUM — shared vocabulary indicates semantic alignment

**Application:**
- Higher threshold than GLC-2 (T_domain_keyword ≥ 3) because domain-level grouping requires stronger naming evidence than capability-level grouping

---

### GLD-4 — Intent Grouping Rule

**Required signals:** S5 (derived from S1–S4)

**Condition:**
```
For each capability pair (CAP-A, CAP-B):
  cap_domain_candidates(CAP-X) = majority_vote(s5(C).domain_candidate for C ∈ CAP-X)
  
  IF cap_domain_candidates(CAP-A) == cap_domain_candidates(CAP-B)
     AND cap_domain_candidates(CAP-A) ≠ UNKNOWN
     AND AT LEAST ONE of (GLD-1 || GLD-2 || GLD-3) is also satisfied
  THEN intent_domain_convergent(CAP-A, CAP-B) = TRUE
```

**Weight:** MEDIUM — S5 domain classification supports grouping under constraint; cannot be sole basis

**Critical constraint:** Same as GLC-5 — GLD-4 NEVER creates a domain grouping without S1–S4 corroboration.

---

### CAP → DOMAIN Decision Flow

```
STEP 1: Determine Domain Type for each Capability
  → Apply S5 domain_candidate typing: FUNCTIONAL / OPERATIONAL / INFRASTRUCTURE / INTEGRATION / CROSS_CUTTING
  → All capabilities of same type are initial domain candidates

STEP 2: Apply GLD-2 (Dependency Topology)
  → Compute cap_coupling_score for all capability pairs
  → Identify capability clusters via coupling threshold

STEP 3: Apply GLD-3 (Naming Convergence)
  → Validate clusters with shared vocabulary
  → Split large clusters where vocabulary diverges

STEP 4: Apply GLD-1 (Execution Domain Cohesion)  [if S4 available]
  → Validate clusters with execution evidence
  → Merge small clusters sharing strong execution coverage

STEP 5: Apply GLD-4 (Intent Grouping)  [with corroboration requirement]
  → Validate domain groupings with S5 intent labels
  → Disambiguate domain type for borderline capabilities

STEP 6: Enforce Domain Construction Rules
  → Minimum 2 components per domain (enforce or justify exception)
  → Identify cross-domain capabilities (strong signals in 2+ domains)
  → Assign domain types from closed set
  → Apply WEAKLY_GROUNDED classification where structural evidence weak

STEP 7: Assign Canonical DOM Identifiers
  → Name each domain using dominant S2 vocabulary + S5 intent label
  → Record domain type: FUNCTIONAL / OPERATIONAL / INFRASTRUCTURE / INTEGRATION / CROSS_CUTTING
  → Record all evidence per domain
```

---

### Domain Construction Rules

| rule_id | rule | condition |
|---------|------|-----------|
| DCR-1 | Minimum component count | Every domain must contain ≥2 components (via its capabilities); single-component domains require explicit justification recorded in evidence |
| DCR-2 | Closed domain types | domain_type ∈ {FUNCTIONAL, OPERATIONAL, INFRASTRUCTURE, INTEGRATION, CROSS_CUTTING}; no other types permitted |
| DCR-3 | No implicit overlap | A capability belongs to exactly one domain unless annotated cross-domain |
| DCR-4 | Cross-domain annotation | Cross-domain capabilities must record: primary_domain, secondary_domain, cross_domain_reason (signal evidence for both assignments) |
| DCR-5 | Weakly grounded propagation | If ≥50% of a domain's components are WEAKLY_GROUNDED, the domain inherits WEAKLY_GROUNDED classification |
| DCR-6 | Domain naming from evidence | Domain names must derive from S2 vocabulary or S5 intent labels of member capabilities; no external vocabulary introduction |
| DCR-7 | Infrastructure isolation | Components classified SHARED_SERVICE (S3 hub) belong to INFRASTRUCTURE or CROSS_CUTTING domains; they do not drive FUNCTIONAL domain creation |

---

### Signal Sufficiency Matrix (CAP → DOMAIN)

| evidence_level | required_rules | confidence |
|---------------|---------------|-----------|
| DIRECT_EVIDENCE | GLD-1 + one of (GLD-2, GLD-3) | HIGH |
| DERIVED | GLD-2 + GLD-3 (no GLD-1) | MEDIUM |
| INFERRED | GLD-4 + one other rule | MEDIUM |
| WEAKLY_GROUNDED | GLD-4 only OR single signal only | LOW — flag required |
| UNASSIGNABLE | Zero rules satisfied | REJECT — cross-domain investigation required |

---

### Boundary Conditions (CAP → DOMAIN)

| boundary_condition | condition | resolution |
|-------------------|-----------|-----------|
| CROSS_DOMAIN_CAPABILITY | Strong GLD signals pointing to 2+ different domains | Apply DCR-4 cross-domain annotation |
| ORPHAN_CAPABILITY | No domain grouping signals found | Create 1:1 domain (capability is sole member); flag ISOLATED |
| OVER_CLUSTERING | Single domain would contain >60% of all capabilities | Force domain split: identify capability sub-clusters using GLD-1 or GLD-3; split into sub-domains |
| UNDER_CLUSTERING | All domains have 1 capability each | Investigate: may indicate over-fine capability granularity; re-apply GLD-3 with reduced T_domain_keyword |
| INFRASTRUCTURE_ISOLATION | All infrastructure capabilities cluster together | Valid: assign as single INFRASTRUCTURE domain or multiple if structurally distinct |

---

## Combined Grouping Logic Decision Tree

```
Given: Component inventory from S1

LEVEL 1 — COMP → CAP:

  For each component C:
    signals = [GLC-1(C), GLC-2(C), GLC-3(C), GLC-4(C), GLC-5(C)]
    
    IF GLC-1 AND (GLC-2 OR GLC-3 OR GLC-4):
      assignment_confidence = DIRECT_EVIDENCE
    ELIF GLC-3 AND GLC-2:
      assignment_confidence = DERIVED
    ELIF GLC-5 AND (GLC-1 OR GLC-2 OR GLC-3 OR GLC-4):
      assignment_confidence = INFERRED
    ELIF GLC-5 only:
      assignment_confidence = WEAKLY_GROUNDED [FLAG]
    ELSE:
      assignment_confidence = UNASSIGNABLE [REJECT or ISOLATED]
    
    Record: cap_assign(C) = CAP-?, confidence, signal_refs

LEVEL 2 — CAP → DOMAIN:

  For each capability CAP-X:
    signals = [GLD-1(CAP-X), GLD-2(CAP-X), GLD-3(CAP-X), GLD-4(CAP-X)]
    
    IF GLD-1 AND (GLD-2 OR GLD-3):
      assignment_confidence = DIRECT_EVIDENCE
    ELIF GLD-2 AND GLD-3:
      assignment_confidence = DERIVED
    ELIF GLD-4 AND (GLD-1 OR GLD-2 OR GLD-3):
      assignment_confidence = INFERRED
    ELIF GLD-4 only:
      assignment_confidence = WEAKLY_GROUNDED [FLAG]
    ELSE:
      assignment_confidence = UNASSIGNABLE [cross-domain investigation]
    
    Record: dom_assign(CAP-X) = DOM-?, confidence, signal_refs
```

---

## Grouping Logic Alignment with 40.x / 41.x Layers

| layer | role | interface with grouping logic |
|-------|------|------------------------------|
| 40.x (Structural) | Produces S1, S3 raw data; produces PEG for S4 | S1 extraction reads 40.x entity_catalog; S4 reads 40.x program_execution_graph |
| 41.x (Semantic) | Consumes grouping logic output | cap_assign() → semantic_traceability_map.md; dom_assign() → semantic_domain_model.md and capability_map.md |
| build_semantic_layer.py | Recovery encoding of grouping decisions | Encodes DOMAINS, CAPABILITIES, COMPONENTS dicts; can be re-derived from grouping logic output |
