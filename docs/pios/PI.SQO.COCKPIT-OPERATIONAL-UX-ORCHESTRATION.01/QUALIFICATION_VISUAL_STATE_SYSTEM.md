# Qualification Visual State System

## Chromatic Palette

| S-State | Palette | Intensity | CSS Class |
|---------|---------|-----------|-----------|
| S0 | neutral | dimmed | sqo-state--neutral |
| S1 | amber | unstable | sqo-state--amber |
| S2 | blue | stabilized | sqo-state--blue |
| S3 | green | governed | sqo-state--green |

## Blocker Visual

| Blocker Class | Severity | Frame | CSS Class |
|--------------|----------|-------|-----------|
| MISSING_QUALIFICATION_ARTIFACTS | critical | escalation | sqo-blocker--critical |
| GROUNDING_GAPS | high | escalation | sqo-blocker--high |
| MIXED_BLOCKERS | high | escalation | sqo-blocker--high |
| NONE | clear | none | sqo-blocker--clear |

## Debt Visual Weight

| Urgency | Weight | Opacity |
|---------|--------|---------|
| IMMEDIATE | dominant | 1.0 |
| ACTIVE | standard | 0.85 |
| DEFERRED | muted | 0.55 |

## Design Constraints

- Color supports cognition, not decoration
- No sci-fi AI theatrics
- No glowing effects
- No copilot aesthetics
- Restrained, operational visual language
