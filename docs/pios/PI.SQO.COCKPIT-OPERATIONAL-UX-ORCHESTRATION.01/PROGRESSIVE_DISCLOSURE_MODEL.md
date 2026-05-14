# Progressive Disclosure Model

## Visibility Defaults

| Panel | Visible | Collapsed | Reason |
|-------|---------|-----------|--------|
| qualification_hero | true | false | always visible |
| state_ribbon | true | false | always visible |
| workflow_spine | true | false | always visible |
| immediate_blockers | true | false | blockers always prominent |
| active_workflow | true | false | current workflow always visible |
| rerun_checklist | true | false | operator action visible |
| progression_gates | true | false | progression always visible |
| source_guidance | true | true | expandable on demand |
| deferred_debt | true | true | deferred by default |
| active_debt | true | true | subordinate by default |
| grounding_debt | true | true | S3 expansion deferred |
| label_debt | true | true | enrichment deferred |
| maturity_internals | true | true | forensic detail |
| continuity_internals | true | true | forensic detail |
| evidence_detail | true | true | forensic detail |

## FastAPI Defaults

Visible (above fold): hero, ribbon, spine, 3 critical blockers, R2 workflow, rerun checklist, S2 gates.
Collapsed: S3 grounding (9 items), label enrichment (9 items), maturity/continuity/evidence internals.

## Escalation

Immediate blockers and active workflow are never collapsed regardless of default rules.
