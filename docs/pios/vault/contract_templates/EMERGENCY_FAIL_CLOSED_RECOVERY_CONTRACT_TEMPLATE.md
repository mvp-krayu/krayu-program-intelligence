# Emergency Fail-Closed Recovery Contract Template

> **Use this template when architecture memory execution has stopped due to enforcement failure.**

---

## CONTRACT — [STREAM-ID]

### FORMAT CLASS
EXECUTION_SPEC

### STREAM CLASSIFICATION
G1 — Architecture-Mutating (Emergency Recovery)

Recovery streams are G1 because they restore vault state to operational condition.

---

### FAILURE CONTEXT

```
FAILURE TRIGGER
Date of failure: [date]
Triggering stream: [stream-id that failed]
Phase where failure occurred: BOOTSTRAP / PREFLIGHT / EXECUTION / POST-FLIGHT
Severity: CRITICAL / HIGH
Failure description: [what specifically failed]

ENFORCEMENT REPORT (from triggering stream):
[Paste the enforcement report from the failed stream]
```

---

### BLOCKED PHASE ANALYSIS

| Question | Answer |
|---|---|
| What phase was blocked? | [BOOTSTRAP / PREFLIGHT / EXECUTION / POST-FLIGHT] |
| What condition triggered the block? | [specific condition] |
| Is the failure in vault content or vault infrastructure? | [CONTENT / INFRASTRUCTURE] |
| Can the failure be resolved with vault updates alone? | [YES / NO] |
| Does resolution require governance authority? | [YES / NO] |
| Does resolution require code changes? | [YES / NO — if YES, this is not a vault recovery] |

---

### MANDATORY LOAD LIST

Load what is available (some files may be the cause of failure):
- CLAUDE.md v3.0
- docs/governance/runtime/git_structure_contract.md
- docs/pios/vault/00_START_HERE/PIOS_CURRENT_CANONICAL_STATE.md (if available)
- docs/pios/vault/06_CANONICAL_TERMINOLOGY/TERMINOLOGY_LOCK.md (if available)
- docs/pios/vault/operations/FAIL_CLOSED_ARCHITECTURE_MEMORY_ENFORCEMENT.md

If mandatory files are the cause of failure, note which files are unavailable and proceed with recovery scope limited to restoring those files.

---

### RECOVERY PATH

```
RECOVERY PLAN
Severity: [CRITICAL / HIGH]

MINIMUM SAFE RESTORATION:
1. [First thing that must be restored/fixed]
2. [Second thing]
3. [...]

VERIFICATION:
- After restoration, re-run preflight for the original stream
- Preflight must PASS before original stream can resume

GOVERNANCE ESCALATION (if needed):
- [What requires governance stream authority beyond this recovery]
```

---

### RECOVERY SCOPE

| Action | In Scope | Authority |
|---|---|---|
| Restore missing vault files from git | YES | This stream |
| Correct stale canonical state | YES | This stream |
| Correct stale terminology | YES | This stream (if no new definitions needed) |
| Repair broken wiki-links | YES | This stream |
| Resolve term collision | CONDITIONAL | This stream (if clear resolution) / Governance stream (if ambiguous) |
| Rebuild vault from scratch | NO | Governance stream required |
| Resolve competing promotions | NO | Governance stream required |
| Change architectural boundaries | NO | Governance stream required |

---

### FAIL-CLOSED CONDITIONS (EVEN FOR RECOVERY)

Recovery MUST STOP on:
- Recovery would introduce new architectural ambiguity
- Recovery requires choosing between competing canonical claims
- Recovery scope exceeds vault content restoration
- Recovery requires code changes (not a vault recovery)

---

### MANDATORY CLOSURE

Standard sections 1-9 plus Section 10 with:
- Original failure description
- Recovery actions taken
- Verification results (preflight re-run)
- Remaining items requiring governance escalation

### CLOSURE MUST DEMONSTRATE

- Original failure condition resolved
- Preflight can now pass for original or future streams
- No new drift introduced by recovery
- Escalation items documented (if any)

---

### MANDATORY RETURN FORMAT

[Standard 8-item return block]

### POST-RECOVERY

After this stream closes:
- The originally blocked stream may be re-attempted
- Re-attempt must run fresh preflight (do not skip because recovery was completed)
- If preflight still fails → new recovery stream required
