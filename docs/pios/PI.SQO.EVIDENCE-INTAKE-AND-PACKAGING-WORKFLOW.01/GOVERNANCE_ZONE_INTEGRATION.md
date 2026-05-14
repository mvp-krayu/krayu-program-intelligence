# Governance Zone Integration

**Stream:** PI.SQO.EVIDENCE-INTAKE-AND-PACKAGING-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how governance zones (SAFE, PRESSURE, RISK, PROHIBITED)
integrate into evidence intake and packaging — constraining intake
volume, packaging strategy, and activation readiness based on
current governance posture.

---

## 2. Zone-Phase Interaction Matrix

### 2.1 Intake Phases by Zone

| Intake Phase | SAFE | PRESSURE | RISK | PROHIBITED |
|-------------|------|----------|------|-----------|
| 1. Source Discovery | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 2. Source Classification | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 3. Trust Assessment | STANDARD | STANDARD | ENHANCED | ENHANCED |
| 4. Evidence Extraction | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 5. Normalization | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 6. Provenance Binding | PERMITTED | PERMITTED | PERMITTED | PERMITTED |
| 7. Intake Registration | PERMITTED | PERMITTED | PERMITTED | PERMITTED |

### 2.2 Packaging Phases by Zone

| Packaging Phase | SAFE | PRESSURE | RISK | PROHIBITED |
|----------------|------|----------|------|-----------|
| 1. Evidence Selection | STANDARD | CONSTRAINED | BLOCKED | BLOCKED |
| 2. Package Strategy | ALL STRATEGIES | CONSERVATIVE | N/A | N/A |
| 3. Entry Assembly | STANDARD | REDUCED BATCH | N/A | N/A |
| 4. Package Validation | STANDARD | ENHANCED | N/A | N/A |
| 5. Replay Binding | STANDARD | STANDARD | N/A | N/A |
| 6. Package Registration | PERMITTED | PERMITTED | BLOCKED | BLOCKED |

### 2.3 Key Insight: Intake vs Packaging

Evidence intake (Phases 1–7) is ALWAYS permitted regardless of
governance zone. Evidence is information — gathering it does not
change governance state.

Evidence packaging (Phases 1–6) is constrained by zone because
packaging creates STAGED packages that consume package count toward
architectural limits. In RISK and PROHIBITED zones, new packaging
is blocked because it would create forward progression pressure.

---

## 3. SAFE Zone Evidence Operations

### 3.1 Intake in SAFE Zone

```
All intake operations proceed normally:
  - No volume constraints on source discovery
  - Standard trust assessment criteria
  - Standard extraction rules
  - No enhanced review requirements
  
Volume guidance:
  - Up to 5 new evidence sources per intake session
  - Up to 20 evidence entries per session
  - Up to 5 packages per iteration
```

### 3.2 Packaging in SAFE Zone

```
All packaging strategies available:
  - SINGLE-DOMAIN: fully supported
  - CLUSTER-ALIGNED: fully supported
  - DOMAIN-GROUPED: fully supported
  - MAXIMAL: available (but rarely needed in SAFE)

Constraints:
  - Standard architectural limits (10 packages, 200 entries)
  - Batch activation limit: 5 packages per iteration
  - No enhanced review requirement
```

---

## 4. PRESSURE Zone Evidence Operations

### 4.1 Intake in PRESSURE Zone

```
Intake proceeds normally with enhanced awareness:
  - Source discovery continues without constraint
  - Trust assessment operates at standard level
  - Operator is informed of current governance pressure
  
Volume guidance:
  - Up to 3 new evidence sources per intake session
  - Up to 10 evidence entries per session (reduced)
  - Enhanced documentation of intake rationale
```

### 4.2 Packaging in PRESSURE Zone

```
Conservative packaging strategy:
  - SINGLE-DOMAIN: supported for ≤ 2 packages
  - CLUSTER-ALIGNED: RECOMMENDED (consolidates package count)
  - DOMAIN-GROUPED: supported
  - MAXIMAL: RECOMMENDED (reduces package count pressure)

Constraints:
  - Reduced batch size: ≤ 3 packages per iteration
  - Enhanced validation: compound pressure check mandatory
  - Package strategy must consider pressure reduction path
  - Operator must review governance zone projection after packaging
```

### 4.3 PRESSURE Zone Packaging Strategy Recommendation

```
IF current_packages >= 6 AND approaching limit:
  RECOMMEND MULTI-DOMAIN or MAXIMAL strategy
  RATIONALE: consolidate entries into fewer packages

IF current_packages <= 5:
  ANY strategy permitted
  RECOMMEND: strategy that minimizes total packages needed
```

---

## 5. RISK Zone Evidence Operations

### 5.1 Intake in RISK Zone

```
Intake permitted with enhanced trust assessment:
  - Source discovery permitted (assessment does not change state)
  - Trust assessment criteria are ENHANCED:
    - PROVISIONAL sources require additional justification
    - CONTEXTUAL_DERIVATION confidence requires operator sign-off
    - All intake events flagged with RISK zone context
  
Volume guidance:
  - Intake for assessment purposes only
  - No expectation of near-term activation
  - Operator informed: evidence will be held until zone ≤ PRESSURE
```

### 5.2 Packaging in RISK Zone

```
NEW PACKAGING BLOCKED:
  - No new packages may be registered
  - Existing STAGED packages remain STAGED (not revoked)
  - Operator may prepare evidence for future packaging
    (selection and strategy planning only)

Rationale:
  - RISK zone means no new activations permitted
  - Registering new packages creates false progression expectation
  - Evidence remains available for packaging when zone recovers
```

---

## 6. PROHIBITED Zone Evidence Operations

### 6.1 Intake in PROHIBITED Zone

```
Intake permitted for future recovery:
  - Source discovery permitted
  - Trust assessment operates at ENHANCED level
  - Evidence registered for future use after zone recovery
  - No expectation of any near-term activation

Volume guidance:
  - Minimal intake — focus is on zone recovery
  - Evidence held in inventory until zone ≤ PRESSURE
```

### 6.2 Packaging in PROHIBITED Zone

```
ALL PACKAGING BLOCKED:
  - No new packages may be registered
  - Focus is exclusively on zone recovery
  - Existing STAGED packages remain STAGED
  - Operator MUST focus on reducing zone pressure first
```

---

## 7. Zone Transition Impact on Evidence Pipeline

### 7.1 Mid-Intake Zone Change

```
IF zone worsens DURING intake:
  Intake in progress: CONTINUE (intake does not change state)
  Registration in progress: COMPLETE registration (atomic operation)
  Packaging in progress: HALT if zone enters RISK or PROHIBITED

IF zone improves DURING intake:
  Intake in progress: CONTINUE
  Previously blocked packaging: MAY RESUME if zone ≤ PRESSURE
```

### 7.2 Mid-Packaging Zone Change

```
IF zone worsens to RISK or PROHIBITED DURING packaging:
  Package not yet registered: HALT — defer registration
  Package registered but not yet proposed: Package remains STAGED
  Package in proposal stage: HALT proposal — fail closed

IF zone improves from RISK to PRESSURE DURING packaging:
  Previously blocked packaging: MAY RESUME
  Conservative packaging strategy applies
```

### 7.3 Zone Recovery Evidence Resume

```
ON zone recovery from RISK/PROHIBITED to PRESSURE or SAFE:
  1. Review all REGISTERED evidence held during zone restriction
  2. Verify evidence is still current (freshness re-check)
  3. Re-assess trust levels (may have changed during wait)
  4. Resume packaging workflow with appropriate zone strategy
  5. Generate EVIDENCE_PIPELINE_RESUMED audit event
```

---

## 8. Zone-Aware Evidence Volume Limits

### 8.1 Per-Zone Guidance

| Zone | Sources/Session | Entries/Session | Packages/Iteration |
|------|:--------------:|:---------------:|:------------------:|
| SAFE | ≤ 5 | ≤ 20 | ≤ 5 |
| PRESSURE | ≤ 3 | ≤ 10 | ≤ 3 |
| RISK | Assessment only | Assessment only | 0 (blocked) |
| PROHIBITED | Minimal | Minimal | 0 (blocked) |

### 8.2 Volume Enforcement

Volume limits are GUIDANCE, not hard gates. The hard gates are:
- 10 packages (architectural limit — always enforced)
- 200 entries (architectural limit — always enforced)
- Zone-appropriate batch size at proposal time (governance gate)

---

## 9. Governance Zone Projection at Packaging

### 9.1 Pre-Packaging Zone Projection

Before packaging, compute projected zone after activation:

```
projected_zone = evaluateGovernanceZone(
  current_packages + proposed_packages,
  current_entries + proposed_entries,
  current_dependencies + proposed_dependencies,
  current_coexistence + projected_coexistence
)

IF projected_zone > PRESSURE:
  → HALT packaging
  → Report: "Packaging would project zone to RISK — reduce scope or consolidate"

IF projected_zone == PRESSURE AND current_zone == SAFE:
  → WARN operator of zone transition
  → Proceed with enhanced review
```

---

## 10. Governance

- Evidence intake is ALWAYS permitted regardless of zone (does not change state)
- Evidence packaging is constrained by zone (RISK/PROHIBITED = blocked)
- SAFE zone permits all strategies with standard limits
- PRESSURE zone requires conservative strategy with reduced batch size
- RISK zone blocks new packaging — intake only for future use
- PROHIBITED zone blocks all packaging — focus on recovery
- Zone changes during intake or packaging trigger appropriate halts
- Zone projection before packaging prevents unintended zone transitions
- Volume guidance scales down with zone pressure
