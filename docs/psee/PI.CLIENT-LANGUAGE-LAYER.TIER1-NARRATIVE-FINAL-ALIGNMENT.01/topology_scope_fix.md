# Topology Scope Qualifier Fix — BLOCK_C

**Contract:** PI.CLIENT-LANGUAGE-LAYER.TIER1-NARRATIVE-FINAL-ALIGNMENT.01  
**Date:** 2026-04-30

## Problem

The Confirmed list in the Known vs Unknown Boundary section read: "Full structural topology — 13 structural evidence groups (DOM), ...". Without a scope qualifier, this implies the topology is complete and total, not constrained to the assessment scope.

Same issue in the non-PSIG path boundary section.

## Fix

**PSIG path (line ~4069):**
```
Before: "Full structural topology — {counts['domains']} structural evidence groups (DOM), ..."
After:  "Full structural topology within assessment scope — {counts['domains']} structural evidence groups (DOM), ..."
```

**Non-PSIG path (line ~4125):**
```
Before: "Full structural topology — {counts['domains']} domains, ..."
After:  "Full structural topology within assessment scope — {counts['domains']} domains, ..."
```

## Validation

VF-04 PASS — "Full structural topology within assessment scope" present; old form absent
