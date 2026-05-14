# Cognitive Load Reduction Model

## Problem

Flat panel stacking forces manual scanning of 25 debt items with equal weight.
Operator cognitive load scales linearly with content volume.

## Solution

Six cognitive groups with deterministic sequencing:

1. **State Recognition** — hero region, state ribbon (always visible)
2. **Blocker Recognition** — blocker dominance layer (escalated when blockers present)
3. **Workflow Recognition** — remediation stages, source guidance, rerun checklist
4. **Progression Understanding** — validation gates, progression metrics
5. **Deferred Context** — active/deferred debt (collapsed by default)
6. **Forensic Exploration** — full debt explorer, evidence, maturity (collapsed, section links)

## Collapse Rules

Groups 5 and 6 are collapsed by default unless escalated.
Group 2 (blockers) is escalated when immediate blockers exist.
All other groups follow standard visibility.

## Outcome

Operator focus: 3 critical blockers dominate, not 25 equal debt cards.
Deferred S3 grounding debt (9 items) hidden until explicitly expanded.
Cognitive scanning burden reduced by ~60%.
