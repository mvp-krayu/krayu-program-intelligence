# Phase 3 Execution Baseline

**Stream:** PI.GEIOS.NORTHSTAR.PHASE3.EXECUTION-PLANNING.BASELINE.01
**Classification:** G2 — Execution Planning
**Date:** 2026-05-13

---

## 1. Canonical Execution Order

### Phase 3 executes in three waves.

**Wave A — Foundation (parallel, no dependencies)**

| Order | Workstream | What It Does | Estimated Streams |
|-------|-----------|--------------|-------------------|
| A.1 | WS-1: URL Separation | Create `/lens/[client]/[run]` route; preserve `/sqo/...` routes | 1 |
| A.2 | WS-3: Cockpit Consolidation | Group 14 flat sections into 4 navigational groups | 1-2 |
| A.3 | WS-5: Disclosure Sequencing Contract | Define per-persona tier assignments for all LENS zones | 1 |
| A.4 | WS-7: Projection Depth Contract | Define executive-depth vs operator-depth field specifications | 1 |

Wave A streams have zero inter-dependencies. All can execute in parallel.

**Wave B — Derived (depends on Wave A)**

| Order | Workstream | Depends On | What It Does | Estimated Streams |
|-------|-----------|-----------|--------------|-------------------|
| B.1 | WS-6: Severity Hierarchy | WS-5 (needs tier model to know what severity promotes) | Implement severity classification from binding state | 1 |
| B.2 | WS-8: Condition-Driven Layout | WS-5 + WS-6 (needs tiers + severity to compute promotions) | Implement condition-responsive zone promotion | 1 |

Wave B streams have strict dependencies. WS-6 cannot start until WS-5 is complete. WS-8 cannot start until WS-5 and WS-6 are complete.

**Wave C — Integration (depends on Waves A + B)**

| Order | Workstream | Depends On | What It Does | Estimated Streams |
|-------|-----------|-----------|--------------|-------------------|
| C.1 | WS-2: Progressive Disclosure Shell | WS-1 + WS-5 + WS-6 + WS-8 | Rebuild LENS v2 flagship as a shell that consumes all contracts | 2-3 |
| C.2 | WS-4: Cross-Surface Navigation | WS-1 + WS-3 (surfaces must be separated first) | Add governed links between LENS and SQO Cockpit | 1 |

Wave C is the integration wave. WS-2 is the most complex workstream and may require sub-streams.

**Total estimated streams:** 8-11 execution streams across 3 waves.

---

## 2. Dependency Graph

```
WAVE A (parallel, no dependencies)
├── WS-1  URL Separation
├── WS-3  Cockpit Consolidation
├── WS-5  Disclosure Sequencing Contract
└── WS-7  Projection Depth Contract

WAVE B (derived from Wave A)
├── WS-6  Severity Hierarchy ────────── depends on WS-5
└── WS-8  Condition-Driven Layout ───── depends on WS-5, WS-6

WAVE C (integration)
├── WS-2  Progressive Disclosure Shell ── depends on WS-1, WS-5, WS-6, WS-8
└── WS-4  Cross-Surface Navigation ───── depends on WS-1, WS-3
```

### Blocking relationships

| If this fails... | These are blocked... |
|------------------|---------------------|
| WS-1 (URL Separation) | WS-2, WS-4 |
| WS-3 (Cockpit Consolidation) | WS-4 |
| WS-5 (Disclosure Sequencing) | WS-6, WS-8, WS-2 |
| WS-6 (Severity Hierarchy) | WS-8, WS-2 |
| WS-7 (Projection Depth) | None (consumed by WS-2 but not blocking — WS-2 can render with full-depth projections as fallback) |
| WS-8 (Condition-Driven Layout) | WS-2 (partial — WS-2 can render with static layout as fallback) |

### Critical path

```
WS-5 → WS-6 → WS-8 → WS-2
```

This is the longest dependency chain. WS-5 is the keystone — it defines the tier model that all downstream content architecture depends on. If WS-5 is wrong, everything downstream is wrong.

---

## 3. Workstream Ownership Map

### 3.1 Files Owned Per Workstream

| Workstream | Creates (New) | Modifies (Existing) |
|-----------|---------------|---------------------|
| **WS-1** | `pages/lens/[client]/[run].js` (new route) | `pages/lens-v2-flagship.js` (extract or redirect), `lib/lens-v2/flagshipBinding.js` (shared — no change to binding logic, route reference only) |
| **WS-2** | `components/lens-v2/LensDisclosureShell.jsx` (new shell), `lib/lens-v2/DisclosureShellResolver.js` (new) | `pages/lens/[client]/[run].js` (from WS-1), extract zone components from `pages/lens-v2-flagship.js` into `components/lens-v2/zones/` |
| **WS-3** | `components/sqo-cockpit/SQOSidebarGroupNav.jsx` (new grouped nav) | `lib/sqo-cockpit/SQOCockpitRouteResolver.js` (add group model), `components/sqo-cockpit/SQOWorkspaceShell.jsx` (use grouped nav) |
| **WS-4** | `components/shared/CrossSurfaceLink.jsx` (new) | Zone components (add link targets), `components/sqo-cockpit/SQOWorkspaceShell.jsx` (add LENS link) |
| **WS-5** | `lib/lens-v2/DisclosureSequencingContract.js` (new) | None initially — consumed by WS-2 and WS-6 |
| **WS-6** | `lib/lens-v2/SeverityHierarchyResolver.js` (new) | None initially — consumed by WS-8 and WS-2 |
| **WS-7** | `lib/lens-v2/ProjectionDepthContract.js` (new) | `lib/lens-v2/LensSQOSubstrateConsumer.js` (add depth-aware projection), `lib/lens-v2/flagshipBinding.js` (pass depth parameter) |
| **WS-8** | `lib/lens-v2/ConditionDrivenLayoutResolver.js` (new) | None initially — consumed by WS-2 |

### 3.2 Ownership Boundaries

No workstream may modify another workstream's created files without explicit cross-stream dependency declaration in the stream contract.

Shared files (`flagshipBinding.js`, `LensSQOSubstrateConsumer.js`) are modified by at most one workstream. If a second workstream needs to modify the same shared file, the dependency must be declared and the streams must be sequenced.

### 3.3 Module Authority

| Module | Current Owner | Phase 3 Owner |
|--------|--------------|---------------|
| `flagshipBinding.js` | LENS v2 binding | WS-1 (route), WS-7 (depth param) — sequential |
| `LensSQOSubstrateConsumer.js` | LENS v2 substrate | WS-7 only |
| `SQOCockpitRouteResolver.js` | SQO Cockpit routing | WS-3 only |
| `SQOWorkspaceShell.jsx` | SQO Cockpit shell | WS-3 (grouping), WS-4 (cross-link) — sequential |
| `lens-v2-flagship.js` | LENS v2 page | WS-1 (redirect), WS-2 (extraction) — sequential |
| `globals.css` | Shared styling | Any workstream (additive CSS only, no modification of existing rules) |

---

## 4. Runtime Binding Impact Analysis

### 4.1 Current Binding Architecture

```
getServerSideProps (pages/lens-v2-flagship.js)
  └── resolveFlagshipBinding (lib/lens-v2/flagshipBinding.js)
        ├── resolveBlueEdgePayload → payload
        ├── loadReconciliationLifecycle → lifecycleProjection
        ├── buildReconciliationAwareness → reconciliationAwareness
        ├── loadDomainEnrichmentRationale → rationaleMap
        ├── buildDomainTraceability → domainTraceability
        ├── buildLensSubstrateBinding → substrateBinding
        └── buildNextGenReportBinding → reportBinding

Returns props: {
  livePayload, livePropagationChains, liveBindingError,
  bindingClient, bindingRun,
  reconciliationAwareness, domainTraceability,
  substrateBinding, reportBinding
}
```

### 4.2 Phase 3 Binding Changes

**WS-1 (URL Separation):** No change to binding logic. `resolveFlagshipBinding` moves from being called by `pages/lens-v2-flagship.js` to being called by `pages/lens/[client]/[run].js`. The function signature and return shape are unchanged. `pages/lens-v2-flagship.js` becomes a redirect to the new route.

**WS-7 (Projection Depth):** Adds a `depth` parameter to the binding call chain:

```
resolveFlagshipBinding({ query, res, depth })
  └── buildLensSubstrateBinding(client, runId, depth)
        ├── depth === 'EXECUTIVE' → return compressed fields
        └── depth === 'OPERATOR'  → return full fields (current behavior)
```

The `depth` parameter defaults to `'EXECUTIVE'` for the LENS route and `'OPERATOR'` for the SQO Cockpit route. This means the binding function gains one optional parameter. Existing callers (which pass no depth) get the current full-depth behavior as the default for backward compatibility during migration, then switch to `'EXECUTIVE'` default after WS-7 stabilizes.

**No other workstream modifies the binding.**

### 4.3 SQO Cockpit Binding (Unchanged)

```
getServerSideProps (pages/sqo/client/[client]/run/[run]/index.js)
  └── resolveWorkspaceData (lib/sqo-cockpit/SQOWorkspaceDataResolver.js)
```

SQO Cockpit's data resolution is completely independent of the LENS binding. Phase 3 does not modify `resolveWorkspaceData`. WS-3 (Cockpit Consolidation) changes navigation only, not data resolution.

---

## 5. Rendering Shell Migration Strategy

### 5.1 Current State

`pages/lens-v2-flagship.js` is a ~1850-line monolith containing:
- 15 inline component functions
- `getServerSideProps` with binding resolution
- Full CSS in `<style jsx global>` block
- Density mode state management
- All zone rendering logic

### 5.2 Migration Plan

**Step 1 (WS-1): Route creation, no extraction.**
Create `pages/lens/[client]/[run].js` that calls the same `resolveFlagshipBinding` and renders the same component tree. At this point, two pages exist with identical rendering. The old `lens-v2-flagship.js` page gets a redirect or deprecation notice.

**Step 2 (WS-2, Phase 1): Zone extraction.**
Extract inline components from the monolith into standalone files:

```
components/lens-v2/zones/
  ├── DeclarationZone.jsx
  ├── SemanticTrustPostureZone.jsx
  ├── ReconciliationAwarenessZone.jsx
  ├── IntelligenceField.jsx
  │   ├── BalancedConsequenceField.jsx
  │   ├── DenseTopologyField.jsx
  │   ├── InvestigationTraceField.jsx
  │   └── BoardroomAtmosphericField.jsx
  ├── StructuralTopologyZone.jsx
  ├── EvidenceDepthLayer.jsx
  ├── QualifierMandate.jsx
  └── GovernanceRibbon.jsx
```

Each extracted zone is a direct lift — same props, same rendering. No behavioral change. Validation: build passes, visual parity confirmed.

**Step 3 (WS-2, Phase 2): Shell introduction.**
Replace the monolith's zone rendering block with a `LensDisclosureShell` component that:
- Reads the `DisclosureSequencingContract` for the active persona
- Reads the `SeverityHierarchyResolver` output for the current binding
- Reads the `ConditionDrivenLayoutResolver` output for the current binding
- Renders zones in tier order with expansion gates

The shell is a composition engine. It does not contain zone logic. It reads contracts and renders the appropriate zone components.

**Step 4 (WS-2, Phase 3): CSS migration.**
Move inline `<style jsx global>` CSS from the monolith into `globals.css` or extracted zone-specific CSS modules. The monolith shrinks to a page-level wrapper (~100 lines) that calls the binding and renders the shell.

### 5.3 Parallel Rendering During Migration

During Steps 1-2, both the old monolith and the new route exist. This is intentional — the old route serves as the regression reference. The old route is removed only after WS-2 completes and visual parity is verified.

---

## 6. Route Topology Migration Plan

### 6.1 Current Route Topology

```
/                          → Landing page
/lens-v2-flagship          → LENS v2 (current executive surface)
/sqo                       → SQO client list
/sqo/client/[client]       → SQO client detail
/sqo/client/[client]/run/[run]            → SQO Cockpit overview
/sqo/client/[client]/run/[run]/debt       → SQO Cockpit: Semantic Debt
/sqo/client/[client]/run/[run]/...        → SQO Cockpit: (12 more sections)
/api/report-pack           → Report-pack API
/api/execlens              → ExecLens API (legacy)
/api/lens-payload          → Lens payload API
```

### 6.2 Target Route Topology

```
/                          → Landing page
/lens/[client]/[run]       → LENS v2 (executive surface, new canonical route)
/lens-v2-flagship          → REDIRECT to /lens/blueedge/run_blueedge_productized_01_fixed
/sqo                       → SQO client list (unchanged)
/sqo/client/[client]       → SQO client detail (unchanged)
/sqo/client/[client]/run/[run]            → SQO Cockpit overview (unchanged)
/sqo/client/[client]/run/[run]/[section]  → SQO Cockpit sections (unchanged)
/api/report-pack           → Report-pack API (unchanged)
/api/execlens              → ExecLens API (unchanged)
/api/lens-payload          → Lens payload API (unchanged)
```

### 6.3 Migration Sequence

1. **Create** `pages/lens/[client]/[run].js` — new route, same binding, same rendering
2. **Verify** new route renders identically to `lens-v2-flagship`
3. **Convert** `lens-v2-flagship.js` to redirect: `return { redirect: { destination: '/lens/blueedge/run_blueedge_productized_01_fixed', permanent: false } }` in `getServerSideProps`
4. **Update** any internal links that reference `/lens-v2-flagship` to use `/lens/[client]/[run]`
5. **Retain** redirect for backward compatibility indefinitely (low cost)

### 6.4 SQO Route Changes

**None.** SQO Cockpit routes do not change in Phase 3. The existing `/sqo/client/[client]/run/[run]/[section]` pattern remains canonical. WS-3 changes navigation within the cockpit (sidebar grouping), not the URL structure.

---

## 7. Disclosure Sequencing Contract — Implementation Strategy

### 7.1 What It Is

A declarative data structure that specifies, per persona, which zones belong to which disclosure tier.

### 7.2 Implementation Approach

Create `lib/lens-v2/DisclosureSequencingContract.js`:

```javascript
const DISCLOSURE_TIERS = {
  EXECUTIVE_BALANCED: {
    tier0: ['DeclarationZone', 'GovernanceRibbon'],
    tier1: ['SemanticTrustPostureZone', 'ReconciliationAwarenessZone'],
    tier2: ['IntelligenceField', 'StructuralTopologyZone'],
    tier3: ['EvidenceDepthLayer'],
  },
  EXECUTIVE_DENSE: {
    tier0: ['DeclarationZone', 'GovernanceRibbon'],
    tier1: ['SemanticTrustPostureZone', 'ReconciliationAwarenessZone', 'IntelligenceField'],
    tier2: ['StructuralTopologyZone'],
    tier3: ['EvidenceDepthLayer'],
  },
  INVESTIGATION_DENSE: {
    tier0: ['DeclarationZone', 'GovernanceRibbon'],
    tier1: ['SemanticTrustPostureZone', 'ReconciliationAwarenessZone', 'IntelligenceField'],
    tier2: ['StructuralTopologyZone', 'EvidenceDepthLayer'],
    tier3: [],
  },
  BOARDROOM: {
    tier0: ['DeclarationZone'],
    tier1: ['IntelligenceField'],
    tier2: [],
    tier3: [],
  },
};
```

### 7.3 Tier Semantics

| Tier | Behavior | User Action to Reveal |
|------|----------|----------------------|
| Tier 0 | Always rendered, always visible | None — the default reading surface |
| Tier 1 | Rendered and visible by default, collapsible | None to see; click to collapse |
| Tier 2 | Rendered but collapsed by default | Click expansion gate to reveal |
| Tier 3 | Not rendered until investigation entry | Explicit mode transition |

### 7.4 Contract Properties

- **Static:** The contract does not change at runtime. Same persona always produces same tier assignments.
- **Overridable by severity:** WS-6 and WS-8 may promote a zone from its default tier to a higher tier when severity conditions exist. The contract defines the default; severity resolves the runtime override.
- **Extensible:** New zones added in future phases register themselves in the contract. If a zone is not in the contract, it defaults to Tier 2 (collapsed).

### 7.5 Validation

| Check | Criteria |
|-------|---------|
| Every existing zone appears in every persona | PASS — no zone is silently dropped |
| Tier 0 always includes DeclarationZone | PASS — governance requirement |
| GovernanceRibbon always visible | PASS — governance requirement |
| BOARDROOM has minimal tiers | PASS — minimal chrome contract |
| Contract is a static export (no function calls, no binding access) | PASS — deterministic |

---

## 8. Severity Hierarchy — Derivation Strategy

### 8.1 What It Is

A pure function that reads the substrate binding and returns a severity classification per zone.

### 8.2 Implementation Approach

Create `lib/lens-v2/SeverityHierarchyResolver.js`:

```javascript
function resolveSeverityHierarchy(substrateBinding) {
  if (!substrateBinding || !substrateBinding.available) {
    return { available: false, zones: {} };
  }
  return {
    available: true,
    zones: {
      SemanticTrustPostureZone: deriveTrustSeverity(substrateBinding.trustPosture),
      ReconciliationAwarenessZone: deriveReconciliationSeverity(substrateBinding.structuralBacking),
      IntelligenceField: 'AMBIENT',  // always informational context
      StructuralTopologyZone: 'AMBIENT',  // always informational context
      EvidenceDepthLayer: 'AMBIENT',  // investigation only
    },
  };
}
```

### 8.3 Severity Derivation Rules

| Zone | CRITICAL | ELEVATED | AMBIENT |
|------|----------|----------|---------|
| SemanticTrustPostureZone | trust_level == NONE | trust_level == HYDRATED | trust_level >= PARTIAL |
| ReconciliationAwarenessZone | reconciliation_pct < 50 | reconciliation_pct < 80 | reconciliation_pct >= 80 |
| SemanticDebtSection (within zones) | blocking_count > 0 | total_items > 5 | total_items <= 5, no blocking |
| TemporalNarrative (within zones) | degradation_detected | persistent_unresolved > 0 | trend positive/stable |
| UnresolvedDisclosure | unresolved_count > 3 | unresolved_count > 0 | unresolved_count == 0 |

### 8.4 Properties

- **Pure function:** Same binding always produces same severity map. No side effects.
- **Server-side computable:** Can run in `getServerSideProps` to include severity in page props, avoiding client-side recomputation.
- **Binding-coupled:** Consumes `substrateBinding` shape directly. No additional data loading.

---

## 9. Projection Depth — Implementation Strategy

### 9.1 What It Is

A per-persona specification that declares which fields from each binding section are included at each depth.

### 9.2 Implementation Approach

Create `lib/lens-v2/ProjectionDepthContract.js`:

The contract defines two depth levels: EXECUTIVE and OPERATOR.

```javascript
const DEPTH_CONTRACTS = {
  trustPosture: {
    EXECUTIVE: ['level', 'label', 'color', 's_state', 'q_class', 'grounding_pct'],
    OPERATOR: '*',  // all fields
  },
  debtVisibility: {
    EXECUTIVE: ['total_items', 'blocking_count', 'has_blocking_debt', 'exposure_color'],
    OPERATOR: '*',
  },
  structuralBacking: {
    EXECUTIVE: ['total_domains', 'reconciled', 'reconciliation_pct', 'unresolved_count'],
    OPERATOR: '*',
  },
  temporalVisibility: {
    EXECUTIVE: ['trend', 'trend_color', 'degradation_detected'],
    OPERATOR: '*',
  },
  // ... similar for other sections
};
```

### 9.3 Application Strategy

Option A (recommended): **Apply at binding construction time.**
`buildLensSubstrateBinding(client, runId, depth)` reads the depth contract and returns only the fields specified for that depth. The LENS route calls with `depth='EXECUTIVE'`. The SQO Cockpit binding is unaffected (it uses `resolveWorkspaceData`, not `buildLensSubstrateBinding`).

Option B (fallback): **Apply at rendering time.**
The full binding is passed to the page, and each zone reads the depth contract to decide which fields to render. This is simpler to implement but means the client receives more data than it displays.

**Recommendation:** Option A. Projection depth is a data contract, not a rendering preference. The executive surface should never receive fields it doesn't display. This is consistent with the principle "surfaces do not compute" — projecting from full to compressed is computation that belongs in the binding, not the renderer.

### 9.4 Migration Strategy

Phase 1: Create the depth contract module. No behavioral change.
Phase 2: Add `depth` parameter to `buildLensSubstrateBinding`. Default to full depth (backward compatible).
Phase 3: LENS route passes `depth='EXECUTIVE'`. Executive surface receives compressed binding.
Phase 4: Validate that executive rendering is correct with compressed binding.

---

## 10. Condition-Driven Layout — Implementation Strategy

### 10.1 What It Is

A pure function that reads the binding and severity map, and returns layout directives: which zones are promoted, demoted, or annotated.

### 10.2 Implementation Approach

Create `lib/lens-v2/ConditionDrivenLayoutResolver.js`:

```javascript
function resolveConditionLayout(severityMap, disclosureContract, persona) {
  const directives = {
    promotions: [],
    escalationBanner: null,
    suppressions: [],
  };

  // Promote CRITICAL zones to Tier 0
  for (const [zone, severity] of Object.entries(severityMap.zones)) {
    if (severity === 'CRITICAL') {
      const defaultTier = findDefaultTier(zone, disclosureContract, persona);
      if (defaultTier > 0) {
        directives.promotions.push({ zone, fromTier: defaultTier, toTier: 0 });
      }
    }
  }

  // Generate escalation banner if any CRITICAL
  const criticalZones = Object.entries(severityMap.zones)
    .filter(([_, s]) => s === 'CRITICAL');
  if (criticalZones.length > 0) {
    directives.escalationBanner = {
      severity: 'CRITICAL',
      zones: criticalZones.map(([z]) => z),
    };
  }

  return directives;
}
```

### 10.3 Layout Directive Types

| Directive | Effect |
|-----------|--------|
| `promotion` | Zone moves from its default tier to a higher tier |
| `escalationBanner` | A summary banner renders at the top of the page listing critical conditions |
| `suppression` | Zone is marked SUPPRESSED and does not render (used when zone has no relevant data) |

### 10.4 Properties

- **Pure function:** Same inputs always produce same directives.
- **Composable:** Reads severity map (from WS-6) and disclosure contract (from WS-5). Does not access the binding directly.
- **Non-destructive:** Directives are additive mutations on the default disclosure contract. The default layout is always recoverable by ignoring directives.

---

## 11. Validation and Stabilization Plan

### 11.1 Per-Workstream Validation

| Workstream | Validation Method |
|-----------|-------------------|
| WS-1 (URL Separation) | New route renders identically to old route. Build passes. Old route redirects. |
| WS-2 (Disclosure Shell) | Visual parity with monolith. Tiers expand/collapse correctly. All zones reachable. |
| WS-3 (Cockpit Consolidation) | All 14 sections accessible via grouped navigation. No section lost. Build passes. |
| WS-4 (Cross-Surface Navigation) | Links navigate between LENS and SQO. Client/run context preserved. |
| WS-5 (Disclosure Sequencing) | Contract is static. Every zone appears in every persona. Build passes. |
| WS-6 (Severity Hierarchy) | Pure function returns correct severity for known binding states. Unit-testable. |
| WS-7 (Projection Depth) | Executive depth returns subset of fields. Operator depth returns all fields. No rendering breakage. |
| WS-8 (Condition-Driven Layout) | Promotions activate for known CRITICAL conditions. Default layout unchanged when no severity. |

### 11.2 Cross-Workstream Integration Validation

After each wave completes:

| Wave | Integration Check |
|------|-------------------|
| Wave A | LENS route works. Cockpit groups work. Contract modules export correctly. Depth contract module loads. Build passes. |
| Wave B | Severity resolver produces correct output for BlueEdge binding. Layout resolver produces correct directives for known conditions. No rendering change yet (consumers not wired). |
| Wave C | Shell renders zones in tier order. Severity promotions visible. Depth projections correct. Cross-surface links work. Full visual regression against monolith baseline. |

### 11.3 Baseline Comparison Protocol

Before Wave C begins, capture the current LENS v2 rendering (screenshot or DOM snapshot) for BlueEdge as the visual regression baseline. After WS-2 completes, compare:

- All zones present (no zone lost)
- All data values match (no field dropped unintentionally)
- Disclosure tiers behave correctly (Tier 0 visible, Tier 2 collapsed)
- Severity promotions activate when conditions warrant
- Calm state (no severity) renders as expected

---

## 12. Rollback and Failure Containment Strategy

### 12.1 Rollback Boundaries

Each workstream is independently revertable by git revert of its commits. Workstreams do not share commits.

### 12.2 Failure Containment Per Workstream

| Workstream | If It Fails... | Containment |
|-----------|----------------|-------------|
| WS-1 | New route doesn't render | Remove new route page. Old `lens-v2-flagship` still works. Zero user impact. |
| WS-2 | Shell renders incorrectly | Revert shell. Fall back to monolith (old route or extracted-but-unconsumed zones). |
| WS-3 | Grouped navigation breaks | Revert grouping changes. Flat navigation still works. |
| WS-4 | Cross-links navigate to wrong surface | Remove link components. Each surface works independently. |
| WS-5 | Contract has wrong tier assignments | Update contract data structure. No code logic to debug — it's declarative. |
| WS-6 | Severity misclassified | Fix derivation rules. Pure function — unit-testable in isolation. |
| WS-7 | Executive depth drops required fields | Revert depth parameter. Binding returns full depth (pre-WS-7 behavior). |
| WS-8 | Layout promotions fire incorrectly | Disable condition resolver. Shell renders default layout (pre-WS-8 behavior). |

### 12.3 Graceful Degradation Principle

Every content architecture primitive (WS-5, WS-6, WS-7, WS-8) is designed so that the system renders correctly without it. If the disclosure contract is absent, all zones render (current behavior). If severity is absent, no promotions fire (current behavior). If depth is absent, full depth is used (current behavior). If condition layout is absent, default layout applies (current behavior).

This means Phase 3 can be partially deployed. Waves A and B can ship without Wave C. Wave C can ship without WS-8. The system is always in a valid rendering state.

---

## 13. Stream Partitioning Strategy

### 13.1 Partitioning Rules

Each workstream maps to 1-3 execution streams. A workstream becomes multiple streams only when:
- A migration step requires a stabilization checkpoint before the next step
- The workstream modifies files that another workstream depends on

### 13.2 Recommended Partitioning

| Workstream | Streams | Rationale |
|-----------|---------|-----------|
| WS-1 | 1 stream | Simple route creation + redirect. No stabilization checkpoint needed. |
| WS-2 | 3 streams | (a) Zone extraction from monolith. (b) Shell implementation. (c) CSS migration. Each is a stabilization checkpoint. |
| WS-3 | 1-2 streams | (a) Group model in route resolver + sidebar component. (b) Optional: sidebar styling refinement. |
| WS-4 | 1 stream | Link components + integration. Small scope. |
| WS-5 | 1 stream | Declarative contract creation. No logic. |
| WS-6 | 1 stream | Pure function creation + tests. |
| WS-7 | 1 stream | Depth contract + binding parameter addition. |
| WS-8 | 1 stream | Pure function creation + tests. |

**Total: 10-12 execution streams.**

### 13.3 Stream Naming Convention

```
PI.LENS.V2.PHASE3.<WORKSTREAM-NAME>.<STEP>.01

Examples:
PI.LENS.V2.PHASE3.URL-SEPARATION.01
PI.LENS.V2.PHASE3.DISCLOSURE-SEQUENCING-CONTRACT.01
PI.LENS.V2.PHASE3.SEVERITY-HIERARCHY-RESOLVER.01
PI.LENS.V2.PHASE3.PROGRESSIVE-SHELL.ZONE-EXTRACTION.01
PI.LENS.V2.PHASE3.PROGRESSIVE-SHELL.SHELL-IMPLEMENTATION.01
PI.LENS.V2.PHASE3.PROGRESSIVE-SHELL.CSS-MIGRATION.01
PI.LENS.V2.PHASE3.COCKPIT-CONSOLIDATION.01
PI.LENS.V2.PHASE3.CROSS-SURFACE-NAVIGATION.01
PI.LENS.V2.PHASE3.PROJECTION-DEPTH-CONTRACT.01
PI.LENS.V2.PHASE3.CONDITION-DRIVEN-LAYOUT.01
```

---

## 14. Phase 3 Completion Criteria

Phase 3 is COMPLETE when ALL of the following are true:

### Container Architecture

- [ ] LENS v2 accessible at `/lens/[client]/[run]`
- [ ] Old `lens-v2-flagship` redirects to new route
- [ ] SQO Cockpit sections grouped into 4 navigational categories
- [ ] Cross-surface navigation links work bidirectionally
- [ ] Client/run context preserved across surface transitions

### Content Architecture

- [ ] Disclosure Sequencing Contract exists with tier assignments for all 4 personas
- [ ] Severity Hierarchy Resolver classifies all zones from binding state
- [ ] Projection Depth Contract defines EXECUTIVE and OPERATOR depths
- [ ] Condition-Driven Layout Resolver promotes CRITICAL zones to Tier 0
- [ ] All 4 content primitives are pure functions or static data structures

### Shell Architecture

- [ ] LENS v2 renders through LensDisclosureShell, not monolith
- [ ] All zones extracted into standalone component files
- [ ] Shell consumes disclosure contract, severity resolver, and condition layout
- [ ] Tier 0 zones always visible
- [ ] Tier 2 zones collapsed by default, expandable
- [ ] Tier 3 zones available only via investigation entry
- [ ] Severity promotions override default tier assignments when CRITICAL conditions exist
- [ ] Executive depth projection delivers compressed field set

### Governance

- [ ] No new architectural layers introduced
- [ ] No new semantic primitives introduced
- [ ] No AI mediation introduced
- [ ] No new locked terminology introduced
- [ ] Surfaces do not compute — all projections pre-compiled server-side
- [ ] SQO Cockpit section count has not increased
- [ ] Build passes with zero errors
- [ ] Visual parity verified against pre-Phase 3 baseline for default conditions

---

## 15. ADR-Style Implementation Recommendation

### ADR: Phase 3 Execution Strategy

**Status:** PROPOSED

**Context:**
Phase 3 architecture has stabilized around 8 workstreams organized into container architecture (audience separation, navigation), content architecture (disclosure sequencing, severity hierarchy, projection depth, condition-driven layout), and shell architecture (progressive disclosure shell). The previous assessment and rebuttal established the primitives; this stream establishes the execution plan.

**Decision:**
Execute Phase 3 in three waves with strict dependency enforcement:
- **Wave A** (4 parallel workstreams): URL separation, cockpit consolidation, disclosure contract, projection depth contract. These are foundational and can run concurrently.
- **Wave B** (2 sequential workstreams): Severity hierarchy, then condition-driven layout. These depend on Wave A's disclosure contract.
- **Wave C** (2 workstreams): Progressive disclosure shell (depends on A+B), cross-surface navigation (depends on A). Wave C is the integration layer.

Each workstream produces independently revertable artifacts. The system is always in a valid rendering state, even if Phase 3 is only partially deployed.

**Rationale:**
1. **Wave A parallelism** maximizes throughput. All four workstreams create new modules with no cross-dependencies.
2. **Wave B sequencing** respects the data flow: severity classification needs tiers to know what to promote; condition layout needs severity to know what is critical.
3. **Wave C integration** comes last because it consumes all upstream contracts. Building the shell before the contracts are stable wastes work.
4. **Graceful degradation** means each primitive has a fallback: no contract → all zones visible; no severity → no promotions; no depth → full fields; no condition layout → static composition. Partial deployment is valid.
5. **Independent revertability** means any failing workstream can be rolled back without cascading failures.

**Consequences:**
- Phase 3 requires 10-12 execution streams, estimated at 3 waves of work.
- WS-5 (Disclosure Sequencing Contract) is the keystone. If it ships with wrong tier assignments, WS-6, WS-8, and WS-2 all produce wrong results. It should be validated carefully and early.
- WS-2 (Progressive Disclosure Shell) is the most complex workstream (3 sub-streams). It should not begin until Wave A and Wave B are complete.
- The old `lens-v2-flagship.js` monolith persists as a regression reference until WS-2 completes. It is not deleted until visual parity is verified.
- SQO Cockpit routes, data resolution, and rendering are not modified. Only navigation organization changes.

**Risks:**
- WS-7 modifies `buildLensSubstrateBinding` with a new parameter. If the depth contract omits a field that a zone requires, rendering breaks. Mitigation: default to full depth during migration; switch to executive depth only after validation.
- WS-2 zone extraction from the monolith may reveal implicit dependencies between zones (shared state, CSS coupling). Mitigation: extraction is a separate stream from shell introduction — problems surface during extraction before the shell is built.
- WS-3 cockpit consolidation may break deep-linked URLs if section aliases change. Mitigation: cockpit routes do not change — only sidebar navigation presentation changes.
