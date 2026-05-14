# Visual Severity Normalization

## Before Correction

| State | Visual | Problem |
|-------|--------|---------|
| BlueEdge S2 | red "BLOCKED", "13 Critical Blockers" | implies projection failure |
| FastAPI S1 | red "BLOCKED", "3 Critical Blockers" | correctly escalated |

## After Correction

| State | Visual | Rationale |
|-------|--------|-----------|
| BlueEdge S2 | blue "EXPANSION CONSTRAINED", "13 Expansion Gaps" | reflects authorized-but-constrained |
| FastAPI S1 | red "QUALIFICATION INCOMPLETE", "3 Qualification Blockers" | reflects true projection blockage |

## CSS Changes

- `sqo-blocker--high` replaced by `sqo-blocker--constrained` (blue tint)
- `sqo-blocker--operational` added for qualification debt (amber tint)
- `sqo-hero__blockage--expansion` added with blue visual treatment
- `sqo-hero__blockage--remediation` added with amber visual treatment
- `sqo-blocker-dominance--expansion` uses blue border and text
- `sqo-blocker-dominance--projection` preserves red escalation
