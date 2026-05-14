# Implementation Semantics

**Stream:** PI.LENS.V2.PHASE3.DISCLOSURE-SEQUENCING-CONTRACT.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `KNOWN_ZONES` | DisclosureSequencingContract.js | Canonical zone inventory (8 zones) | Shared — consumed by WS-6, WS-8, WS-2 |
| `KNOWN_PERSONAS` | DisclosureSequencingContract.js | Canonical persona inventory (4 modes) | Shared — consumed by WS-6, WS-8, WS-2 |
| `TIER_NAMES` | DisclosureSequencingContract.js | Disclosure tier name constants | Shared |
| `DISCLOSURE_TIERS` | DisclosureSequencingContract.js | Per-persona tier assignments for all zones | Shared — keystone data structure |
| `ZONE_METADATA` | DisclosureSequencingContract.js | Per-zone conditional rendering documentation | Reference |
| `getDisclosureTiers` | DisclosureSequencingContract.js | Retrieve tier assignments for a persona | Shared |
| `getZoneTier` | DisclosureSequencingContract.js | Retrieve tier of a zone in a persona | Shared |
| `getDisclosureSequence` | DisclosureSequencingContract.js | Retrieve ordered zone sequence for rendering | Shared — consumed by WS-2 shell |
| `validateZoneCoverage` | DisclosureSequencingContract.js | Verify all zones assigned in all personas | Validation |

## 2. Input Contracts

### DisclosureSequencingContract

This module has NO runtime inputs. It is a static data structure.

It does NOT consume:
- Substrate bindings
- Payload data
- Filesystem artifacts
- API responses
- AI outputs

## 3. Output Contracts

### getDisclosureTiers(persona)

```
Input:  persona: string ('EXECUTIVE_BALANCED' | 'EXECUTIVE_DENSE' | 'INVESTIGATION_DENSE' | 'BOARDROOM')
Output: { tier0: string[], tier1: string[], tier2: string[], tier3: string[], suppressed?: string[] } | null
```

### getZoneTier(zone, persona)

```
Input:  zone: string, persona: string
Output: 'tier0' | 'tier1' | 'tier2' | 'tier3' | 'suppressed' | null
```

### getDisclosureSequence(persona)

```
Input:  persona: string
Output: Array<{ zone: string, tier: string }>  (ordered by tier, excludes suppressed)
```

### validateZoneCoverage()

```
Input:  none
Output: {
  valid: boolean,
  personas: {
    [persona]: {
      assigned: number,
      total: number,
      complete: boolean,
      missing: string[],
      unknown: string[],
    }
  }
}
```

## 4. Tier Semantics

| Tier | Behavior | User Action |
|------|----------|-------------|
| tier0 | Always visible, no expansion required | None |
| tier1 | Visible by default, collapsible | None to see; click to collapse |
| tier2 | Collapsed by default, expandable | Click expansion gate |
| tier3 | Investigation-depth only | Explicit investigation entry |
| suppressed | Not rendered for this persona | Not available |

## 5. Suppression Semantics

Suppression is persona-specific, not data-specific. A suppressed zone is architecturally excluded from a persona's rendering tree — it never appears regardless of data state.

Currently, only BOARDROOM mode uses suppression (5 zones suppressed for minimal chrome).

Suppression differs from tier3 (investigation-only) in that tier3 zones are available via explicit investigation entry, while suppressed zones are not available at all in that persona.

## 6. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| DisclosureSequencingContract.js | Static declarative specification of per-persona tier assignments, zone metadata, accessor functions, and coverage validation |

Consumers (future streams):
- WS-6 (SeverityHierarchyResolver) — reads tier assignments to determine what severity can promote
- WS-8 (ConditionDrivenLayoutResolver) — reads default tiers, produces promotion directives
- WS-2 (ProgressiveDisclosureShell) — reads disclosure sequence to render zones in tier order
