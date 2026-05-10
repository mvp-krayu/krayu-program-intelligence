# Operational Severity Model

## Three-Class Blocker Severity

| Class | Severity | Frame | Color | Example |
|-------|----------|-------|-------|---------|
| A — Projection | critical | escalation | red | Missing S2 qualification artifacts |
| B — Qualification | operational | remediation | amber | Mixed qualification debt |
| C — Expansion | constrained | progression | blue | S3 grounding gaps |

## Severity Rules

- **Red escalation** reserved exclusively for projection blockers and integrity failures
- **Amber remediation** for qualification debt impacting current posture
- **Blue progression** for expansion constraints toward future S-states
- **Green governed** for operationally clear states

## Key Correction

S3 grounding gaps (BlueEdge) were incorrectly rendered with escalation framing
identical to missing qualification artifacts (FastAPI). This conflated:
- projection blockage (cannot authorize projection)
- expansion limitation (projection-authorized, expansion constrained)

These are fundamentally different operational states requiring
distinct visual treatment.
