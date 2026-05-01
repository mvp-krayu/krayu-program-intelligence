# Signal Activation Consistency Fix — BLOCK_A

**Contract:** PI.CLIENT-LANGUAGE-LAYER.TIER1-NARRATIVE-FINAL-ALIGNMENT.01  
**Date:** 2026-04-30

## Problem

The Decision Posture paragraph read: "signals not activated in this run". This phrasing failed to distinguish the not-activated signals from the 3 already-active signals, creating ambiguity — a reader might interpret the sentence as referring to all signals, not the additional (inactive) subset.

Similarly, the Outside Evidence Scope list items for PSIG-003 and PSIG-005 used "not activated in this run" without "additional signal" qualifier.

## Fix

**Paragraph (line ~4198):**
```
Before: "...and signals not activated in this run."
After:  "...and additional signals not activated in this run."
```

**_na_labels dict (lines ~4040-4041):**
```
Before: "Node depth concentration signal — not activated in this run"
After:  "Node depth concentration signal — additional signal, not activated in this run"

Before: "Scope coupling signal — not activated in this run"
After:  "Scope coupling signal — additional signal, not activated in this run"
```

**Fallback label (line ~4046):**
```
Before: f"{_s} — not activated in this run"
After:  f"{_s} — additional signal, not activated in this run"
```

## Validation

VF-01 PASS — "additional signals not activated" present; "and signals not activated" absent  
VF-08 PASS — "additional signal, not activated in this run" present in Outside Evidence Scope
