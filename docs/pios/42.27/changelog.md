# Changelog — 42.27

Stream: 42.27 — Projection-Driven Red Node Activation
Date: 2026-03-25

---

## Entry 001 — 2026-03-25

**Action:** Pre-flight completed.

- Branch confirmed: feature/42-27-projection-red-node-activation
- Emphasis confirmed in 44.x: docs/pios/44.3/projection_emphasis_attribute.md (authoritative)
  and docs/pios/44.2/projection_attachment.json (5 projections, all emphasis:none)
- TopologyPanel.js inspected: no emphasis rendering in hierarchy path
- 42.7 adapter inspected: no emphasis field in output — adapter gap identified
- Gap classified: not upstream blocker; 44.x has emphasis; adapter extension required

---

## Entry 002 — 2026-03-25

**Action:** 42.7 adapter extended to consume projection emphasis.

- PROJECTION_ATTACHMENT_PATH constant added pointing to docs/pios/44.2/projection_attachment.json
- _load_emphasis_lookup() added: reads {node_id: emphasis} from ATTACHED projections
  with graceful fallback (empty dict) on any load failure
- get_topology(): after hierarchy construction, emphasis attached to all domain/capability/component nodes
- 42.x reads emphasis only; no assignment, no modification (44.3 E-ATT-007 compliant)

---

## Entry 003 — 2026-03-25

**Action:** TopologyPanel.js extended with emphasis rendering.

- EntityChip: emphasisHigh = entity.emphasis === 'high'; topo-emphasis-red applied when true
- CapabilityGroup: emphasisHigh = cap.emphasis === 'high'; topo-emphasis-red applied when true
- DomainBlock: emphasisHigh = domain.emphasis === 'high'; topo-emphasis-red applied when true
- Emphasis class independent of highlight class — coexistence permitted
- No client-side emphasis computation or fallback introduced

---

## Entry 004 — 2026-03-25

**Action:** CSS added for red node rendering.

- .topo-emphasis-red added to globals.css following 42.24/42.25 color parity block
- border-color: #ef4444, background: rgba(239, 68, 68, 0.12), color: #fca5a5
- Block comment: "42.27 — projection-driven red node activation"

---

## Entry 005 — 2026-03-25

**Action:** Validation run — 3/3 PASS.

- topology_200: route returns 200 with topology array — PASS
- emphasis_fields_present_and_valid: all nodes carry valid emphasis in closed set — PASS
- emphasis_matches_baseline: emphasis values match 44.2 projection attachment — PASS
- validation_log.json written

---

## Constraints

- No ENL routes modified
- No WOW chain path modified
- No query highlight logic modified
- Emphasis values read-only from 44.2 governed artifact
- No emphasis computed or assigned by 42.x
