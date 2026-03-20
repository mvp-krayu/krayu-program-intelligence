# PIOS-42.7-RUN01-CONTRACT-v2
## ExecLens — Final Landing Surface Consolidation (Topology Panel + Obsidian Corrections)

**Run:** run_01_blueedge
**Layer:** 42.7 — Final landing-page projection and correction
**Status:** PASS — all 22 validation checks passed

---

## Deliverables

| Deliverable | Path |
|-------------|------|
| Topology adapter | `scripts/pios/42.7/execlens_topology_adapter.py` |
| TopologyPanel component | `app/execlens-demo/components/TopologyPanel.js` |
| Shared Obsidian utility | `app/execlens-demo/utils/obsidian.js` |
| NavigationPanel correction | `app/execlens-demo/components/NavigationPanel.js` |
| API route update | `app/execlens-demo/pages/api/execlens.js` |
| index.js update | `app/execlens-demo/pages/index.js` |
| CSS additions | `app/execlens-demo/styles/globals.css` (`.topo-*` classes) |
| Validator | `scripts/pios/42.7/validate_topology_panel.py` |

---

## Objectives Delivered

| Objective | Delivered |
|-----------|-----------|
| D1 Obsidian deep-link correction | Corrected vault-relative path: strip `docs/pios/41.2/pie_vault/` prefix + `.md` suffix. Shared via `utils/obsidian.js`. |
| D2 Topology panel | Domain → Capability → Component hierarchy rendered beneath overview gauges |
| D3 Preservation | Hero, pipeline strip, overview gauges, query selector, execution surface all intact |
| D4 Validation | 22 checks covering topology integrity and Obsidian path correctness |

---

## Landing Page Order (post-42.7)

1. Hero (eyebrow, title, subtitle, pipeline strip, meta)
2. Overview gauge strip (42.6 — unchanged)
3. **Structural topology panel (42.7 — NEW)**
4. Query selector
5. Active query bar
6. Executive panel
7. Template renderer (parsed sections, tables, wiki-links, drill-down)
8. Signal gauge cards
9. Evidence panel
10. Navigation panel

---

## Topology Structure (run_01_blueedge)

| Domain | Capabilities | Components |
|--------|-------------|------------|
| D_01_Edge_Data_Acquisition | C_02_Network_Security_Intelligence_Collection | CMP_74_hasi_bridge_py, CMP_75_HASI_v1_0_0 |
| D_10_Platform_Infrastructure_and_Data | C_27_Caching_Layer | CMP_27_GatewaysModule, CMP_64_RedisCacheModule, CMP_81_Redis_7 |
| D_10_Platform_Infrastructure_and_Data | C_29_Platform_Monorepo_Container | CMP_01_blueedge_platform_Monorepo ⚠ |
| D_11_Event_Driven_Architecture | C_30_Domain_Event_Bus | CMP_65_FleetEventsModule |
| D_16_Operational_Engineering | C_40_Delivery_and_Quality_Infrastructure | CMP_88_CI_CD_Workflows ⚠, CMP_89_Docker_Compose_Orchestration |

⚠ = unresolved in vault (path=null, non-clickable)

**Totals:** 4 domains · 5 capabilities · 9 components

---

## Hierarchy Computation Rule (G7 — explicit, deterministic, inspectable)

All groupings derived from co-occurrence analysis across all 10 query drill-downs:

1. For each query, parse drill-down to extract Domain / Capability / Component link sets.
2. Count domain-capability co-occurrences across queries.
3. Count capability-component co-occurrences across queries.
4. Each capability assigned to its highest-count domain (tie: alphabetical max).
5. Each component assigned to its highest-count capability (tie: alphabetical max).

**Note on CMP_65_FleetEventsModule**: tied at 4 co-occurrences each with C_27 and C_30 → assigned to C_30 (alphabetical max: `C_30 > C_27`). Fully deterministic and traceable.

No semantic inference used. No vault file reads for hierarchy computation.

---

## Obsidian Deep-Link Correction (R10)

### Previous behavior (42.4/42.5 — incorrect)
```
buildObsidianLink(vaultName, "docs/pios/41.2/pie_vault/01_Domains/D_11_X.md")
→ obsidian://open?vault=pie_vault&file=docs%2Fpios%2F41.2%2Fpie_vault%2F01_Domains%2FD_11_X
                                         ^^^^ wrong: full repo-relative path
```

### Corrected behavior (42.7 — utils/obsidian.js)
```
buildObsidianLink(vaultName, "docs/pios/41.2/pie_vault/01_Domains/D_11_X.md")
→ strip "docs/pios/41.2/pie_vault/" prefix → "01_Domains/D_11_X.md"
→ strip ".md" suffix                        → "01_Domains/D_11_X"
→ obsidian://open?vault=pie_vault&file=01_Domains%2FD_11_X
                                         ^^^^ correct: vault-relative path
```

### Verification (V9)
```
D_11_Event_Driven_Architecture vault_path = 01_Domains/D_11_Event_Driven_Architecture
Obsidian URL = obsidian://open?vault=pie_vault&file=01_Domains%2FD_11_Event_Driven_Architecture
```

---

## Visual Modes

### Landing mode (no query selected)
- Full 4-domain topology grid visible
- No entity highlighting
- Hint text: "Select a query to highlight relevant domains, capabilities, and components."

### Selected mode (query active)
- Topology remains visible; entities matching the query's drill-down are highlighted
- Highlighting is deterministic: driven by `?topology=true&highlight=GQ-NNN`
- Highlight flags set per-entity in adapter JSON (not computed in the browser)
- Same query selection → identical highlighted state

---

## Boundary Declarations

- **Reads:** signal registry, query signal map, response templates, pie_vault navigation — all via 42.1 (through 42.2 import)
- **Writes:** none — read-only layer
- **Upstream layers untouched:** 42.1, 42.2, 42.4, 42.5, 42.6 computation semantics unchanged
- **Canonical docs:** untouched outside contract record

---

## Validation Summary

```
PIOS-42.7-RUN01-CONTRACT-v2 — Topology Panel Validation
============================================================
AC-01  topology adapter exists
AC-02  TopologyPanel.js exists
AC-03  utils/obsidian.js exists
AC-04  API route references ADAPTER_42_7
AC-05  API route dispatches ?topology=true
AC-06  API route supports highlight param
AC-07  index.js imports TopologyPanel
AC-08  TopologyPanel between LandingGaugeStrip and QuerySelector
V1    hero, LandingGaugeStrip, QuerySelector present in index.js
V2    topology array has 4 domains
V3    4 governed domains present
V4    all entity IDs follow governed naming (D_/C_/CMP_)
V5    no cross-domain edge arrays found
V6    GQ-003 highlights correct 6 entities (deterministic)
V7    obsidian.js reads vault name from NEXT_PUBLIC_OBSIDIAN_VAULT_NAME
V8    obsidian.js applies VAULT_PREFIX strip + .md strip
V9    D_11 vault_path = 01_Domains/D_11_Event_Driven_Architecture
V10   CMP_01 is unresolved with path=null
V11   TemplateRenderer.js still exists (no regression)
V12   42.1 and 42.2 adapter files present (not mutated)
V13   .topo-panel and .topo-domains-grid present in globals.css
V14   adapter output is deterministic (two runs identical)

Result: 22/22 checks passed
STATUS: PASS
```

---

## Full Stream Validation Chain

| Stream | Validator | Result |
|--------|-----------|--------|
| 42.4 | validate_demo_surface.py | 20/20 PASS |
| 42.5 | validate_demo_refinement.py | 18/18 PASS |
| 42.6 | validate_overview_adapter.py | 20/20 PASS |
| 42.7 | validate_topology_panel.py | 22/22 PASS |

**Total:** 80/80 checks passed across the full 42.x stream chain.

---

## Handover to 42.8

Stream 42.8 — Demo Choreography / Presentation Flow / Stakeholder Runbook

Surface is now:
- Premium, dark, technical, evidence-first
- Architecturally anchored (topology shows BlueEdge structure)
- Obsidian-connected (corrected deep links)
- Query-interactive (topology highlighting on selection)
- Governance-complete (every element traceable to adapter output)
