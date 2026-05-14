# Capability Display Normalization — BLOCK_E

**Contract:** PI.CLIENT-LANGUAGE-LAYER.TIER1-NARRATIVE-FINAL-ALIGNMENT.01  
**Date:** 2026-04-30

## Problem

"Capabilities not modeled in current evidence scope" appeared in two places:
1. Inside the Confirmed list (`_conf_items`) — boundary section, Confirmed side
2. Inside the composition line (structural stats bar) — already corrected in CORRECTION.01

Having "Capabilities not modeled" in the Confirmed section is logically incorrect: the absence of capability modeling is an evidence gap, not a confirmed structural fact. It should not appear on the Confirmed side of the Known vs Unknown boundary.

## Fix

Removed `_cap_label` variable and replaced the `_conf_items[0]` list entry:

```
Before: f'<li>Full structural topology — {counts["domains"]} structural evidence groups (DOM),
         {_cap_label}, {counts["components"]} components</li>'

After:  f'<li>Full structural topology within assessment scope — {counts["domains"]} structural evidence groups (DOM)'
        + (f', {counts["capabilities"]} capabilities' if counts["capabilities"] > 0 else '')
        + f', {counts["components"]} components</li>'
```

When `counts["capabilities"] == 0`: capabilities are omitted from the Confirmed list entirely.  
When `counts["capabilities"] > 0`: capability count is shown normally.

The composition line (structural stats bar) retains "Capabilities not modeled" via a separate conditional — this is correct placement (it is a factual note in the stats summary, not a claim in the Confirmed boundary section).

## Validation

VF-07 PASS — "Capabilities not modeled" absent from Confirmed boundary block
