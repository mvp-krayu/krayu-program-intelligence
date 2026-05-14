# Skills Load Requirements

> **When and how to load SKILLS.md.**

---

## Loading Model

SKILLS.md is NOT auto-loaded. Claude must explicitly read it when skill invocation is required.

## When to Load

| Trigger | Required Skill |
|---|---|
| Product definition or update | 4_BRAIN_ALIGNMENT |
| Commercial packaging artifact | 4_BRAIN_ALIGNMENT |
| Publish-layer artifact | 4_BRAIN_ALIGNMENT |
| Cross-layer claims | 4_BRAIN_ALIGNMENT |
| Evidence interpretation | 4_BRAIN_ALIGNMENT |
| Brain node creation | 4_BRAIN_ALIGNMENT |

## Invocation Protocol

1. Read SKILLS.md (repo root)
2. Locate skill by name
3. Execute all defined steps
4. Return alignment result before producing output

## Fail Conditions

- Skill not invoked when trigger condition met → INVALID
- Any brain omitted → INVALID
- Output produced before alignment result → INVALID
- Any step abbreviated → INVALID

## Cross-References

- [[CLAUDE_LOAD_REQUIREMENTS]] — full load requirements
- [[PREFLIGHT_AND_BRANCH_ENFORCEMENT]] — pre-flight protocol
