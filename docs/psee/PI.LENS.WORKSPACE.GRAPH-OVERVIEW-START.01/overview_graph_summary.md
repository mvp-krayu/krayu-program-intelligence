# Overview Graph Summary
## PI.LENS.WORKSPACE.GRAPH-OVERVIEW-START.01

**Date:** 2026-05-03

---

## Problem

Workspace could start in zone/evidence focus (showing "zone evidence focus" label and filtered graph) due to sessionStorage restoring a previous zone+mode+qsData selection.

Root: `isOverview = !activeZone && !activeMode && !activeQsData`
When sessionStorage restored `activeZone` and `activeMode`, `isOverview = false` → VaultGraph received `isOverview=false` → filtered graph, wrong label.

## Fix

**Removed:** sessionStorage restore effect and persist effect.  
**Result:** `activeZone`, `activeMode`, `activeQsData` are always `null` on page load → `isOverview = true`.

**Fixed:** `graphLabel` — was `'full vault structure'` when `isOverview=true`; now `'OVERVIEW'`.

## Initial State (after fix)

| Property | Value |
|----------|-------|
| `activeZone` | `null` |
| `activeMode` | `null` |
| `activeQsData` | `null` |
| `isOverview` | `true` |
| `graphZone` | `zonesData?.zones?.[0]` (PZ-001) |
| `graphQs` | `null` |
| `graphLabel` | `'OVERVIEW'` |
| VaultGraph `isOverview` | `true` |

## Graph Rendering in OVERVIEW Mode

VaultGraph with `isOverview=true`:
- All nodes use BRIGHT style (fully visible, no muting)
- All links use `LINK_COLOR_BASE` (full structure visible)
- 18 nodes: PZ-001 (zone) + SIG-001..SIG-005 + CLM-20..CLM-24 + ART-01..ART-07
- 17 links — full topology
- Header hint: `"18 nodes · full vault structure"` (from `buildHint` in VaultGraph)

## Transition Behavior (unchanged)

Clicking WHY / EVIDENCE / TRACE on a ZoneCard:
- fires `handleActivate(zone, mode, data)` → sets `activeZone`, `activeMode`, `activeQsData`
- `isOverview` becomes `false`
- graph transitions to filtered mode, label changes to mode-specific text

Clicking "Overview" button (`handleReset`):
- resets all to null → `isOverview = true` → label returns to 'OVERVIEW'
