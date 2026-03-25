# Closure — 42.27

Stream: 42.27 — Projection-Driven Red Node Activation
Status: COMPLETE
Date: 2026-03-25
Branch: feature/42-27-projection-red-node-activation
Baseline: 9b3a2d2

---

Stream 42.27 completed.

Projection-driven red node activation is now:
- **Governed** — emphasis consumed from 44.2 projection attachment; not computed by 42.x
- **Compliant** — 44.3 E-ATT-007 satisfied: adapter reads, never assigns
- **Propagated** — emphasis field present on all domain/capability/component nodes in adapter output
- **Rendered** — topo-emphasis-red applied when emphasis:high; no effect at current baseline (all none)
- **Validated live** — 3/3 PASS against localhost:3000
- **Ready for promotion**

---

## Outputs Produced

| File | Purpose |
|---|---|
| docs/pios/42.27/adapter_extension_contract.md | 42.7 adapter extension spec and governance compliance |
| docs/pios/42.27/rendering_contract.md | Emphasis rendering rules and CSS class mapping |
| docs/pios/42.27/validation_log.json | 3/3 PASS (live run) |
| docs/pios/42.27/execution_report.md | Pre-flight findings, gap classification, live validation result |
| docs/pios/42.27/changelog.md | Full change record |
| docs/pios/42.27/CLOSURE.md | This file |
| scripts/pios/42.27/validate_red_node_activation.py | 3-test emphasis validator |

---

## Activation State

RED node rendering is **inactive at this baseline** — all 5 projection elements
in docs/pios/44.2/projection_attachment.json carry `"emphasis": "none"`.

Activation occurs upstream: when a projection element is assigned `"emphasis": "high"`
in the 44.2 artifact (governed 44.x process), the corresponding topology node will
render with `topo-emphasis-red` on next page load. No 42.x change required.

---

## Scope Boundary

**Changed in this stream:**
- scripts/pios/42.7/execlens_topology_adapter.py — emphasis field attached to output
- app/execlens-demo/components/TopologyPanel.js — emphasis rendering (3 components)
- app/execlens-demo/styles/globals.css — .topo-emphasis-red CSS block

**Not changed:**
- execlens.js API routing — no modification
- WOW chain render path — unchanged
- Query highlight logic — unchanged
- ENL routes — unchanged
- Any 44.x artifact — read-only consumers only
