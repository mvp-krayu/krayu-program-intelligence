# Implementation Semantics

**Stream:** PI.LENS.V2.PHASE3.SEVERITY-HIERARCHY-RESOLVER.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `SEVERITY_LEVELS` | SeverityHierarchyResolver.js | Canonical severity level inventory | Shared — consumed by WS-8, WS-2 |
| `SEVERITY_PRECEDENCE` | SeverityHierarchyResolver.js | Numeric ranking for severity comparison | Shared |
| `ZONE_SEVERITY_RULES` | SeverityHierarchyResolver.js | Per-zone derivation rule metadata | Reference |
| `resolveZoneSeverity` | SeverityHierarchyResolver.js | Pure resolver: input → severity map | Shared — keystone function |
| `classifyZone` | SeverityHierarchyResolver.js | Individual zone severity classifier | Internal |
| `resolvePersona` | SeverityHierarchyResolver.js | Derive persona from density/boardroom | Shared |
| `getSeverityPrecedence` | SeverityHierarchyResolver.js | Numeric severity ranking | Shared — consumed by WS-8 |
| `isHigherSeverity` | SeverityHierarchyResolver.js | Severity comparison helper | Shared — consumed by WS-8 |
| `getHighestSeverity` | SeverityHierarchyResolver.js | Find highest severity in map | Shared — consumed by WS-8 |
| `getZonesBySeverity` | SeverityHierarchyResolver.js | Filter zones by severity level | Shared — consumed by WS-8, WS-2 |
| `validateSeverityCoverage` | SeverityHierarchyResolver.js | Verify all zones have rules | Validation |

## 2. Input Contracts

### resolveZoneSeverity(input)

```
Input shape:
{
  renderState: string|null,          // 'BLOCKED', 'EXECUTIVE_READY', etc.
  substrateBinding: {                // from buildLensSubstrateBinding (or null)
    available: boolean,
    trustPosture: { level: string, q_class: string, ... },
    debtVisibility: { has_blocking_debt: boolean, ... },
    structuralBacking: { reconciliation_pct: number, ... },
    evidenceVisibility: { all_valid: boolean, rejected: number, quarantined: number, ... },
    ...
  },
  reconciliationAwareness: {         // from buildReconciliationAwareness (or null)
    available: boolean,
    posture: { tier: string, ... },
    ...
  },
  qualifierClass: string|null,       // 'Q-01', 'Q-02', 'Q-03'
  qualifierVisible: boolean,         // qualifier mandate visibility flag
  evidenceAvailable: boolean,        // are evidence blocks present?
  topologyAvailable: boolean,        // is topology data present?
  densityClass: string,              // 'EXECUTIVE_BALANCED', 'EXECUTIVE_DENSE', etc.
  boardroomMode: boolean,            // boardroom toggle state
}
```

All fields are optional. Null/missing input produces deterministic fallback severity.

### Static Contract Dependencies

- `DisclosureSequencingContract.KNOWN_ZONES` — zone inventory (read-only)
- `DisclosureSequencingContract.getZoneTier` — persona-level suppression check (read-only)

## 3. Output Contracts

### resolveZoneSeverity(input)

```
Output: {
  zones: {
    DeclarationZone: 'CRITICAL' | 'ELEVATED' | 'AMBIENT' | 'SUPPRESSED',
    GovernanceRibbon: 'CRITICAL' | 'ELEVATED' | 'AMBIENT' | 'SUPPRESSED',
    QualifierMandate: 'CRITICAL' | 'ELEVATED' | 'AMBIENT' | 'SUPPRESSED',
    SemanticTrustPostureZone: 'CRITICAL' | 'ELEVATED' | 'AMBIENT' | 'SUPPRESSED',
    ReconciliationAwarenessZone: 'CRITICAL' | 'ELEVATED' | 'AMBIENT' | 'SUPPRESSED',
    IntelligenceField: 'CRITICAL' | 'ELEVATED' | 'AMBIENT' | 'SUPPRESSED',
    StructuralTopologyZone: 'CRITICAL' | 'ELEVATED' | 'AMBIENT' | 'SUPPRESSED',
    EvidenceDepthLayer: 'CRITICAL' | 'ELEVATED' | 'AMBIENT' | 'SUPPRESSED',
  },
  persona: string,     // resolved persona
  timestamp: null,     // reserved for future use
}
```

### validateSeverityCoverage()

```
Output: {
  valid: boolean,
  total: number,
  classified: number,
  unknown: string[],
  zones: {
    [zone]: { hasRule: boolean, inputs: string[] }
  }
}
```

## 4. Severity Semantics

| Level | Meaning | Promotion Readiness |
|-------|---------|-------------------|
| CRITICAL | Blocking condition, immediate awareness required | WS-8 may promote zone |
| ELEVATED | Notable non-blocking condition, awareness warranted | WS-8 may adjust visibility |
| AMBIENT | Informational, no escalation | Default layout |
| SUPPRESSED | No data or intentionally omitted | Zone excluded |

Precedence: CRITICAL(0) > ELEVATED(1) > AMBIENT(2) > SUPPRESSED(3).

## 5. Derivation Rules Per Zone

### DeclarationZone
- renderState BLOCKED or absent → CRITICAL
- All other render states → AMBIENT
- Never SUPPRESSED (persona suppression only)

### GovernanceRibbon
- Trust level NONE or absent → CRITICAL
- Q-02/Q-03 qualifier class → ELEVATED
- Blocking debt present → ELEVATED
- Otherwise → AMBIENT

### QualifierMandate
- Not visible → SUPPRESSED
- Q-03 with blocking debt → CRITICAL
- Q-03 or Q-02 → ELEVATED
- Otherwise → AMBIENT

### SemanticTrustPostureZone
- Substrate unavailable → SUPPRESSED
- Trust absent or NONE → CRITICAL
- HYDRATED with blocking debt → CRITICAL
- HYDRATED or PARTIAL → ELEVATED
- RECONCILED or above → AMBIENT

### ReconciliationAwarenessZone
- Awareness unavailable → SUPPRESSED
- Posture INSUFFICIENT → CRITICAL
- Posture WEAK or MODERATE → ELEVATED
- Posture STRONG → AMBIENT

### IntelligenceField
- renderState BLOCKED → CRITICAL
- All other states → AMBIENT

### StructuralTopologyZone
- No topology data → SUPPRESSED
- Structural backing <50% reconciliation → ELEVATED
- Otherwise → AMBIENT

### EvidenceDepthLayer
- Not INVESTIGATION_DENSE or boardroom mode → SUPPRESSED
- No evidence data → SUPPRESSED
- Evidence integrity failed (all_valid false) → CRITICAL
- Rejected or quarantined items → ELEVATED
- Otherwise → AMBIENT

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| SeverityHierarchyResolver.js | Pure severity classification: input binding → zone severity map, severity comparison helpers, coverage validation |
| DisclosureSequencingContract.js | Zone inventory and persona-level suppression (consumed, not mutated) |

Consumers (future streams):
- WS-8 (ConditionDrivenLayoutResolver) — reads severity to determine zone promotion directives
- WS-2 (ProgressiveDisclosureShell) — reads severity to inform rendering emphasis
