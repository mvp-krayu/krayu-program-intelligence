# Future Governance Discipline

> **Investigation discipline, vault discipline, traceback discipline, and anti-rediscovery discipline — based on everything now learned.**

---

## 1. Future Investigation Discipline

### When Bottom-Up Forensics IS Allowed

Bottom-up forensics (reading code, tracing artifacts, reconstructing chains from runtime truth) is allowed when:

| Condition | Why Allowed |
|---|---|
| **Initial client onboarding** | No existing ontology to trace top-down from. The system must discover the client's structural and semantic reality from evidence artifacts. |
| **Bug investigation** | Runtime behavior diverges from expected output. Bottom-up trace from symptom to root cause is the correct diagnostic method. |
| **New capability implementation** | When building a new capability (e.g., a new L0 adapter, a new derive function), understanding the current code is necessary. |
| **Vault page creation for undocumented capability** | When a vault page needs to be written for an existing capability that was never canonicalized. The vault page is the OUTPUT of the forensics, not the INPUT. |
| **Explicit contract authorization** | When a stream contract explicitly says "investigate X through artifact forensics." |

### When Bottom-Up Forensics is NOT Allowed

| Condition | Why Not Allowed | What To Do Instead |
|---|---|---|
| **Understanding the operational ontology** | The ontology is now canonicalized. Loading vault pages provides the understanding. Forensics produces the same answer at much higher cost. | Load vault. If vault is insufficient, fix the vault — don't re-excavate. |
| **Determining whether a capability exists** | The vault records what exists. If the vault says "NOT IMPLEMENTED" but the capability exists, the vault is stale — fix the staleness. | Check vault. If stale, update vault. |
| **Rediscovering architectural decisions** | Decisions are recorded in stream closures and vault pages. Re-deriving them from code produces the same decision without the context of why it was made. | Load the relevant stream closure or vault page. |
| **Understanding the dual-path ontology** | This is now canonicalized. PATH A/PATH B/crosswalk/reconciliation are documented. | Load the master operational document (when created) or recovery stream artifacts. |

### The Test

**Before starting bottom-up forensics, ask:**

> "Does a vault page, stream artifact, or governance document already answer this question?"

If YES → load it.
If NO → perform forensics, then WRITE the answer into a vault page so the next session doesn't repeat the work.

---

## 2. Future Vault Discipline

### Vault Page Lifecycle

```
CREATED ──→ OPERATIONAL ──→ STALE ──→ UPDATED or SUPERSEDED
                                │
                                └──→ (if not detected) ──→ REDISCOVERY LOOP
```

### Staleness Detection Rules

A vault page becomes stale when:

| Trigger | Detection Method |
|---|---|
| **Capability implemented that page says is absent** | G1 stream closure MUST check vault pages in the affected domain and flag staleness |
| **Vault page age > 30 days without verification** | AMOps preflight reports age warning (already in CLAUDE.md §16.5) |
| **Runtime behavior contradicts vault claims** | Any stream encountering a vault contradiction MUST flag it in execution_report.md |
| **New stream discovers information the vault should have contained** | The stream's closure MUST include a "vault gap" section identifying what was missing |

### Staleness Response Protocol

When staleness is detected:

1. **Flag it** — record in the current stream's execution report with specific vault page and specific claim that is stale
2. **Do NOT silently work around it** — loading a stale vault page and ignoring the staleness perpetuates the problem
3. **Fix it** — either in the current stream (if G1-classified and in scope) or by issuing a separate vault update stream
4. **Verify the fix** — the updated vault page must be loaded by the next stream that touches the domain

### Vault Update Rules

| Rule | Rationale |
|---|---|
| Vault updates are G1 by definition | Vault is live operational cognition — updating it IS architecture mutation |
| Vault updates require pre-flight | Load current vault state before modifying it |
| Vault updates must not introduce new concepts without governance | Updating "NOT IMPLEMENTED" to "OPERATIONAL" is a status change, not concept creation. Adding a new architectural concept requires a full G1 stream. |
| Vault pages must carry "last verified" dates | So staleness detection is possible |
| Recovery stream findings must propagate to vault | If a recovery stream produces architectural understanding, that understanding must reach vault — otherwise the recovery was expensive forensics with no durable output |

### The Anti-Hoarding Rule

**Stream artifacts are NOT vault cognition.**

Recovery streams produce analysis documents. These documents live in `docs/pios/<stream-id>/`. They are stream artifacts — evidence of what was discovered, not operational cognition.

If the analysis documents contain architectural understanding that the vault needs, that understanding must be extracted into vault pages. Otherwise, the vault remains ignorant of what recovery discovered, and future streams re-discover the same things.

**The pattern that caused the crosswalk/reconciliation gap:**

```
1. ReconciliationCorrespondenceCompiler was implemented (stream work)
2. The stream produced CLOSURE.md (stream artifact)
3. The vault page was NOT updated (vault remained stale)
4. Future streams loaded the stale vault page
5. Future streams did not know the compiler existed
6. A recovery stream had to rediscover the compiler's existence
7. The recovery stream produced analysis documents (stream artifacts)
8. The vault page is STILL stale (as of this assessment)
```

**The fix:** Step 3 must include vault update. G1 stream closures MUST include Section 10 (Architecture Memory Propagation) — this is already in CLAUDE.md §16.4. The fix is enforcement, not new governance.

---

## 3. Future Top-Down Traceback Discipline

### When Top-Down Traceback is Mandatory

Top-down traceback (starting from the executive projection and walking backward through the chain to source evidence) is mandatory when:

| Situation | Why Mandatory |
|---|---|
| **Debugging executive projection output** | The projection is the final output. Walking backward reveals where the chain breaks. |
| **Validating a new capability's integration** | A new capability must be traceable forward (source → ... → projection) AND backward (projection → ... → source). |
| **Assessing architectural coherence** | Top-down traceback reveals whether the chain is continuous or has gaps. |
| **Any claim about "what LENS shows"** | Every LENS output must trace to structural evidence. Claims about LENS output without traceback are unverified. |

### The Traceback Protocol

For any executive projection claim, the traceback must cover:

```
1. LENS executive projection (what is rendered)
2. Zone derive function (what computes the rendered value)
3. Payload resolver (what loads the data)
4. Semantic hydrator (what classifies the data)
5. Semantic topology model (where the domain definitions come from)
6. Crosswalk (how structural and semantic are bridged)
7. Reconciliation (how correspondence is assessed)
8. Structural topology / evidence artifacts (what the claim rests on)
```

If ANY layer in the chain is missing documentation, the traceback is incomplete and must be flagged.

### The Anti-Shortcut Rule

**Do NOT assume intermediate layers.**

The crosswalk/reconciliation gap arose because the chain was assumed to be:

```
structure → semantic topology → LENS
```

The actual chain is:

```
structure ──┐
            ├── crosswalk bridge ──→ reconciliation ──→ hydrator ──→ LENS
semantic ───┘
```

Skipping the crosswalk/reconciliation layers produced an incorrect architectural understanding. The anti-shortcut rule: trace every link. Don't assume adjacency.

---

## 4. Future Anti-Rediscovery Discipline

### The Rediscovery Cost Model

Each rediscovery cycle costs:
- Full context window for forensic investigation
- Risk of producing slightly different conclusions than the original discovery
- Opportunity cost (the session could have been building, not rediscovering)
- Risk of NOT reaching the same depth as the original investigation

### The Anti-Rediscovery Protocol

| Step | Action | When |
|---|---|---|
| 1 | **G1 stream closures propagate to vault** | Every G1 closure (CLAUDE.md §16.4 — already mandated) |
| 2 | **Recovery stream findings propagate to vault** | Every recovery stream closure must include a "vault propagation" section |
| 3 | **Stale vault pages are fixed when detected** | Not deferred — staleness compounds |
| 4 | **Master operational document is maintained** | When created, it becomes the first-load reference for operational understanding |
| 5 | **New capabilities are documented in vault when implemented** | Not when rediscovered — when implemented |
| 6 | **Vault pages carry "last verified" metadata** | Enables staleness detection |

### The Rediscovery Detection Test

If a session spends more than 30 minutes discovering something that should have been in vault, that is a rediscovery event. Response:

1. Complete the discovery (can't stop mid-investigation)
2. Write the finding into vault (fix the gap)
3. Record the rediscovery event in the stream's execution report
4. Assess why the vault was insufficient (staleness? missing page? missing concept?)
5. Fix the root cause (update vault page, create new vault page, fix staleness detection)

### How Future Ontology Drift Should Be Detected

**Ontology drift** = the system's actual operational behavior diverges from what the vault describes.

Detection mechanisms:

| Mechanism | How It Works |
|---|---|
| **G1 post-flight vault comparison** | After a G1 stream completes, compare the architecture mutation delta against existing vault pages. If the mutation contradicts a vault page, the vault is drifting. |
| **Runtime vs vault spot-checks** | Periodically verify that vault claims match runtime reality. The crosswalk/reconciliation staleness was this type of drift — vault said "NOT IMPLEMENTED" while runtime had a full implementation. |
| **Stream pre-flight vault load** | Loading vault pages before execution surfaces contradictions between vault claims and observed reality. If a stream detects a contradiction, it must flag it. |
| **TERMINOLOGY_LOCK collision check** | G1 preflight already checks planned terms against TERMINOLOGY_LOCK (CLAUDE.md §12.3). This prevents terminology drift. |

### How Stale Vault Cognition Should Be Handled

1. **Detection:** Any mechanism above detects staleness
2. **Classification:** Is the staleness a status change (capability exists that page says doesn't) or a conceptual change (the architecture has evolved beyond what the page describes)?
3. **Status change:** Can be fixed inline by updating the vault page with current state. Requires G1 classification but minimal scope.
4. **Conceptual change:** Requires a full vault page rewrite or new vault page. The old page is either updated or superseded (moved to 12_ARCHIVE).
5. **Verification:** After update, the next stream loading the page should confirm the update resolved the staleness.
6. **Never defer:** Stale vault pages compound. Every session that loads a stale page inherits the staleness. Fix immediately or schedule for the next session.

---

## 5. Specific Current Actions Required

Based on this assessment, the following governance actions are needed:

| # | Action | Priority | Type |
|---|---|---|---|
| 1 | Fix `CROSSWALK_AND_RECONCILIATION.md` staleness | CRITICAL | Vault update (G1) |
| 2 | Create master operational document (`OPERATIONAL_ONTOLOGY.md`) | HIGH | Vault creation (G1) |
| 3 | Add dual-path ontology and 17/4/13 semantics to vault | HIGH | Vault creation (G1) — could be part of master document |
| 4 | Add CEU registry governance protocol | MEDIUM | Governance creation (G1) |
| 5 | Create pipeline phase numbering reconciliation document | LOW | Documentation (G2) |
| 6 | Document run_end_to_end.py | LOW | Documentation (G2) |

Actions 1 and 2 are the minimum required to stop rediscovery cycles.
