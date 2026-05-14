# Implementation Semantics

**Stream:** PI.LENS.V2.PHASE3.CONDITION-DRIVEN-LAYOUT.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `DIRECTIVE_TYPES` | ConditionDrivenLayoutResolver.js | Directive type constants | Reference |
| `resolveLayoutDirectives` | ConditionDrivenLayoutResolver.js | Main resolver: input → layout directives | Shared — consumed by WS-2 |
| `getEffectiveSequence` | ConditionDrivenLayoutResolver.js | Ordered zone sequence post-directives | Shared — consumed by WS-2 |
| `validateDirectiveCoverage` | ConditionDrivenLayoutResolver.js | Coverage validation | Validation |

## 2. Input Contracts

### resolveLayoutDirectives(input, preResolvedSeverity)

```
input: same shape as resolveZoneSeverity (see SeverityHierarchyResolver)
preResolvedSeverity: optional — result from resolveZoneSeverity (avoids re-resolution)
```

### Static Contract Dependencies

- DisclosureSequencingContract: KNOWN_ZONES, getZoneTier, getDisclosureTiers (read-only)
- SeverityHierarchyResolver: resolveZoneSeverity, resolvePersona, SEVERITY_LEVELS (read-only)

## 3. Output Contracts

### resolveLayoutDirectives

```
Output: {
  effectiveTiers: { [zone]: 'tier0'|'tier1'|'tier2'|'tier3'|'suppressed' },
  promotions: Array<{ zone, from, to, severity }>,
  suppressions: Array<{ zone, reason: 'persona'|'severity', defaultTier }>,
  escalationBanner: { active: boolean, criticalCount: number, zones: string[] },
  diagnostics: { persona, severityMap, promotionCount, suppressionCount, totalZones, activeZones },
}
```

### getEffectiveSequence

```
Input:  directives from resolveLayoutDirectives
Output: Array<{ zone: string, tier: string, promoted: boolean }>
        Ordered by tier (tier0 first), excludes suppressed.
```

## 4. Directive Semantics

| Severity | Action | Result |
|----------|--------|--------|
| CRITICAL | Promote to tier0 | Zone becomes always-visible |
| ELEVATED | Retain default tier | Advisory metadata only |
| AMBIENT | Retain default tier | No action |
| SUPPRESSED | Explicit suppression | Zone excluded from sequence |

Suppression reasons:
- `persona`: zone is suppressed by DisclosureSequencingContract for active persona
- `severity`: zone severity is SUPPRESSED (no data or context-excluded)

## 5. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| ConditionDrivenLayoutResolver.js | Combines disclosure tiers + severity into layout directives |
| DisclosureSequencingContract.js | Default tier assignments (consumed, not mutated) |
| SeverityHierarchyResolver.js | Zone severity classification (consumed, not mutated) |

Consumer:
- WS-2 (ProgressiveDisclosureShell) — reads directives to render zones with correct tier behavior
