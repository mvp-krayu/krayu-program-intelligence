# Claude Bootstrap Doctrine

Stream: PI.CLAUDE-BOOTSTRAP-DOCTRINE.01
Date: 2026-06-06
Classification: Knowledge survival design

---

## 1. What MUST Live in CLAUDE.md

CLAUDE.md is the only file guaranteed to load in every session. Everything in it must earn its place by having changed an outcome. Current CLAUDE.md is 935 lines. Much of it is governance boilerplate that a new Claude instance follows mechanically. The items below are the ones that actually change behavior.

### Tier 1 — Load-Bearing (remove these and outcomes degrade immediately)

**Evidence-first execution.** No evidence → no output. Not "weak output" — no output. This prevents the most common failure: generating plausible conclusions from insufficient data.

**Data correction > prompt patching > output compensation.** The execution priority that prevents the second most common failure: compensating for bad data with instructions instead of fixing the data. §17.3.

**Root Cause Closure Rule (§17.12).** 9 categories of context assembly defect must be audited before attributing output failure to model behavior. This single rule would have saved days of wasted investigation.

**Live Endpoint Validation (§17.13).** CLI proof ≠ UI proof. Same code path ≠ same runtime context. For Next.js: never use `__dirname`-relative paths. Use `resolveRepoRoot()`.

**Completion Hierarchy (§17.10).** Build passes < tests pass < data changed < authority verified < projection aligned < answer changed. Level 6 is completion for cognition work.

**Consumer authority rule.** Consumers project. Consumers do not synthesize. SSE → ConsequenceCompiler is sole cognition authority.

### Tier 2 — Important but survivable without

- Runtime Evidence Projection (§17.14) — business capability framing
- Context Isolation (§17.11) — focused context bundles per question type
- Capability Discovery Before Construction (§17.6) — check existing before building
- Authority-Chain Verification (§17.7) — trace evidence through cognition to projection
- Stream classification (G1/G2/G3)
- Branch-domain enforcement
- AMOps lifecycle

### What should be REMOVED from CLAUDE.md

Nothing should be removed. But the current document mixes operational rules (Tier 1) with governance ceremony (stream boundaries, artifact formats, CLOSURE.md templates). A new Claude instance spends attention budget on ceremony and may miss the operational rules that actually change outcomes. Consider: restructure so Tier 1 items appear first, before any governance template.

---

## 2. What MUST Become SKILLS

Skills are callable execution patterns. The items below are tasks that recur with enough frequency and enough consequence that encoding them as skills prevents rediscovery.

### SKILL: THORR_PROMPT_FORENSICS

**Why it matters:** The most expensive recurring failure was diagnosing THORR output by guessing instead of auditing. This skill forces the audit.

**Trigger:** THORR produces unexpected output.
**Steps:**
1. Save exact prompt sent to model (system prompt + context)
2. Grep for 9 §17.12 defect categories
3. Compare live prompt to expected prompt
4. If defects found → fix context, not prompt instructions
5. If no defects → THEN investigate model behavior

### SKILL: SPECIMEN_QUALIFICATION

**Why it matters:** Connecting THORR/LENS to an unready specimen produces misleading results. This skill gates readiness.

**Trigger:** Before any THORR/LENS wiring to a new specimen.
**Steps:**
1. Check static evidence (code graph exists?)
2. Check runtime evidence (runtime JSON artifacts exist?)
3. Check domain maturity (named domains? business labels?)
4. Check pipeline readiness (synthesize → compile → AF findings → narrative mode)
5. Report readiness level: CODE_CONNECTIVITY_READY / SYSTEM_CONNECTIVITY_READY / NOT_READY

### SKILL: EVIDENCE_TO_COGNITION_AUDIT

**Why it matters:** New evidence types must enter the signal → condition → consequence chain. Evidence that only changes labels without producing conditions is incomplete integration.

**Trigger:** When integrating a new evidence class.
**Steps:** Already defined in SKILLS.md.

### SKILL: EIR_NARRATIVE_MODE_VERIFICATION

**Why it matters:** The dual-mode EIR architecture depends on `determineNarrativeMode()` returning the correct mode. Wiring consumers to wrong-mode output is invisible and damaging.

**Trigger:** Before generating EIR for any specimen.
**Steps:**
1. Run `determineNarrativeMode()` with specimen evidence
2. Verify returned mode matches expected mode
3. If STRUCTURAL_INTELLIGENCE → verify criteria that failed
4. If EXECUTION_BLINDNESS → verify all 4 activation criteria passed
5. Log result before proceeding

---

## 3. What MUST Become Constitutional Documents

Constitutional documents are locked references that do not change per session. They are loaded when their domain is relevant.

### Already constitutional (in vault or docs/governance)

- Git Structure Contract — branch/domain ownership
- Terminology Lock — canonical vocabulary
- PIOS Current Canonical State — what exists and at what maturity

### Must become constitutional

**Runtime Cognition Contract.** 6 primitives, 4 blindness classes, 8 evidence categories. Currently in `docs/pios/PI.RUNTIME-COGNITION-CONTRACT.01/`. Should be elevated to vault as a constitutional document because it defines what PI can conclude from runtime evidence — independent of any specimen.

**EIR Activation Contract.** The 4 criteria for EXECUTION_BLINDNESS mode. Currently in `docs/pios/PI.EIR-EXECUTION-BLINDNESS.01/ACTIVATION_CONTRACT.md`. Should be elevated to vault because it governs which narrative the customer receives — a high-consequence decision.

**THORR Corridor Definitions.** The 5 corridor frameworks (CTO, Board, PE, Transformation, GOD). Currently in `docs/pios/PI.EXECUTION-BLINDNESS-COMMERCIAL.01/`. Should persist as the sales playbook — not per-session knowledge.

### Must NOT become constitutional (still hypotheses)

- Center-of-mass divergence as a PI law (only 1 specimen fully proven)
- Execution Blindness as a universal category (proven on 2, needs customer validation)
- Adapter architecture (evidence-class-based model not yet tested beyond forensic grep)

---

## 4. What MUST Become Executable Validation Routines

These are scripts or functions that can be RUN to verify system state, not just read.

### `determineNarrativeMode()` — already exists

In `ConsequenceNativeEIR.js`. Takes boardroom, VLC, architecturalFindings, synthesisResult. Returns STRUCTURAL_INTELLIGENCE or EXECUTION_BLINDNESS with reason. This is the single acceptance gate for new specimens.

### Prompt capture utility — should exist

A function that saves the exact system prompt sent to the Anthropic API for any THORR request. Currently requires manual instrumentation (the diagnostic capture I added and removed during the `resolveRepoRoot` investigation). Should be a toggleable diagnostic mode.

### Specimen readiness check — should exist

A script that takes (client, runId) and reports: static evidence (Y/N), runtime evidence (Y/N), domain count, domain label quality, VLC scope, AF count, narrative mode. Currently done manually via node -e commands. Should be a single CLI command.

### Evidence class coverage report — should exist

A function that takes a specimen and reports which of the 8 evidence categories have artifacts. Currently done by listing the runtime_connectivity directory. Should report coverage percentage and missing layers.

---

## 5. What MUST Become Repository Structure

### Already correct

```
/docs/pios/<STREAM-ID>/          — stream outputs
/docs/governance/                — governance documents
/docs/pios/vault/                — constitutional state
/app/execlens-demo/              — runtime/demo code
/clients/<client>/psee/runs/     — specimen evidence
/scripts/pios/                   — validators
```

### Should be added

```
/docs/pios/vault/07_RUNTIME_COGNITION/
  RUNTIME_COGNITION_CONTRACT.md          — 6 primitives, 4 blindness, 8 evidence classes
  EIR_ACTIVATION_CONTRACT.md             — 4 criteria for EXECUTION_BLINDNESS mode
  RUNTIME_COGNITION_VALIDATION_MATRIX.md — pass/fail criteria per primitive

/docs/commercial/
  THORR_CTO_CORRIDOR.md
  THORR_BOARD_CORRIDOR.md
  THORR_PE_CORRIDOR.md
  THORR_TRANSFORMATION_CORRIDOR.md
  THORR_GOD_CORRIDOR.md
  EXECUTION_BLINDNESS_COMMERCIAL_MODEL.md
```

The commercial documents currently live inside stream output directories. They should be accessible without knowing which stream produced them.

---

## 6. What MUST Never Depend on Chat History

### Cognition architecture

The relationship between SW-Intel and Runtime Cognition (sibling modules, not parent-child) must be in the vault. If a new Claude instance reads only the code, it might conclude Runtime Cognition is a subsystem of SW-Intel — which was the wrong conclusion I initially proposed and Kurt corrected.

### Execution Blindness definition

"The condition where a system can fail while the organization believes it is healthy." This definition, the three blindness classes (Boundary, Silence, Coupling), and the synthesis nature (emerges from the gap between SW-Intel and Runtime Cognition) must be in a constitutional document. A new Claude instance without this knowledge would rediscover it — or worse, propose something different.

### The operating discipline

§17.12 (root cause closure), §17.13 (live endpoint validation), §17.14 (business capability framing) must remain in CLAUDE.md. These are execution disciplines that prevent specific, expensive failure modes. They cannot be rediscovered from code alone.

### Commercial positioning

"Governed operational intelligence, not governed code analysis." This positioning, the buyer analysis, and the corridor frameworks must persist outside chat. They represent months of commercial discovery that cannot be reconstructed from the codebase.

---

## 7. Which Discoveries Are Stable Enough to Institutionalize

| Discovery | Status | Institutionalize? |
|---|---|---|
| Execution Blindness as category | Proven on 2 specimens, 5 corridors validated | YES — with "candidate category" qualifier until customer validation |
| Runtime Cognition as first-class module | Proven, cross-specimen validated, all 7 constitutional tests passed | YES |
| 6 cognition primitives | 4 PROVEN, 2 LIKELY across specimens | YES for Tier 1 (4 proven). HOLD for Tier 2 until pipeline-validated on StackStorm |
| EIR dual-mode architecture | Implemented, rendering at 8.8/10 | YES |
| THORR 5-corridor framework | All 5 productized, question sets defined | YES |
| Measurement Boundary Discovery as engine | Validated through category analysis | YES — as internal description of what PI does |
| Evidence-class-based adapter model | Designed, not tested beyond BlueEdge | HOLD — institutionalize after StackStorm extraction validates the model |
| Center-of-mass divergence as general property | Observed on 1, predicted on 2, counterexample confirmed | HOLD — institutionalize after 2nd pipeline-proven specimen |
| `resolveRepoRoot()` pattern | Proven fix for Next.js __dirname issue | YES — mandatory for any server-side file resolution |

---

## 8. Which Discoveries Are Still Hypotheses

| Hypothesis | Evidence Level | What Would Confirm | What Would Falsify |
|---|---|---|---|
| Execution Blindness is commercially purchasable | Zero paying customers | First customer says "I didn't know this" AND pays | First customer says "I already knew all of this" |
| StackStorm activates EXECUTION_BLINDNESS through live pipeline | Source-observed, not pipeline-processed | `determineNarrativeMode()` returns EXECUTION_BLINDNESS from extracted evidence | Returns STRUCTURAL_INTELLIGENCE (gravity coincides or insufficient evidence) |
| Evidence-class-based adapters scale to 3+ technology families | Designed for 2 (NestJS proven, AMQP mapped) | Django or Go extraction produces evidence in existing categories without new classes | New technology requires a genuinely new evidence category not in the taxonomy |
| Gravity divergence is architecture-dependent, not universal | 1 proven (BlueEdge partial), 1 predicted (StackStorm total), 1 counterexample (FastAPI none) | 3rd specimen with divergence AND counterexample without | 2nd specimen with full evidence but no divergence |
| SILENT_FAILURE_EXPOSURE as a formal condition class | Observed as blindness class, not formalized as condition | Formal condition definition with measurable criteria | Cannot define measurable criteria that distinguish silence from normal operation |

---

## 9. If Recreating Effectiveness in 30 Minutes, What to Load First

**Minute 0-5: CLAUDE.md**
The constitution. Tier 1 rules load automatically. The new Claude instance knows: evidence first, data correction before compensation, §17.12 audit rule, completion hierarchy, consumer authority.

**Minute 5-10: Runtime Cognition Contract + EIR Activation Contract**
Two documents that define what PI can conclude (6 primitives, 4 blindness classes) and when EIR changes mode (4 activation criteria). Without these, the new instance would need to rediscover the cognition architecture.

**Minute 10-15: Capability Delta Assessment + Category Validation**
Two documents that explain what PI became (governed operational intelligence, not code analysis) and why Execution Blindness is the category (not Measurement Boundary Discovery). Without these, the new instance would propose the wrong commercial framing.

**Minute 15-20: THORR Corridor Synthesis + Commercial Model**
The framework summary (one analysis, five projections) and the first commercial offer (Execution Blindness Discovery, €15-25K). Without these, the new instance would start from scratch on commercialization.

**Minute 20-25: Operating Forensics**
The retrospective. What worked, what failed, what to never repeat. Especially: every "model behavior" attribution was wrong, ChatGPT steers / Claude executes, no FORBIDDEN instructions.

**Minute 25-30: BlueEdge specimen exploration**
Read the AF findings, the VLC, the runtime topology. The new instance now has the evidence that produced every discovery. It can verify claims against data instead of trusting documents.

---

## 10. Minimum Bootstrap Package — 80% of Current Capability

### The package (11 items)

| # | Document | Purpose | Lines |
|---|---|---|---|
| 1 | CLAUDE.md | Execution constitution | ~950 |
| 2 | Runtime Cognition Contract | 6 primitives, 4 blindness, 8 evidence classes | ~250 |
| 3 | EIR Activation Contract | Dual-mode trigger criteria | ~130 |
| 4 | Capability Delta Assessment | What PI became, before vs after | ~190 |
| 5 | Category Validation | Execution Blindness = category, MBD = engine | ~235 |
| 6 | Corridor Synthesis | One analysis, five projections, framework proven | ~215 |
| 7 | Commercial Model | First SKU, buyer analysis, conversion path | ~280 |
| 8 | Operating Forensics | What worked, what failed, what to never repeat | ~370 |
| 9 | Validation Matrix | Pass/fail criteria for new specimens | ~275 |
| 10 | CTO Corridor | First productized corridor (representative) | ~250 |
| 11 | BlueEdge AF findings (5 findings, ~100 lines via pipeline query) | The evidence | ~100 |

**Total: ~3,245 lines. Approximately 45 minutes of reading for a new Claude instance.**

### What this package provides (80%)

- Knows what PI is and what it became
- Knows the cognition architecture (Runtime Cognition + SW-Intel → Execution Blindness)
- Knows the commercial positioning (category, engine, evidence, projection)
- Knows the execution discipline (evidence first, no model attribution, no compensation)
- Knows the corridor framework (5 audiences, one analysis)
- Knows how to validate new specimens (validation matrix)
- Knows the BlueEdge evidence (AF-001..005)
- Can answer THORR questions with correct context assembly
- Can generate EIR in correct narrative mode
- Can advise on specimen readiness and adapter strategy

### What this package does NOT provide (remaining 20%)

- Detailed code knowledge of PIContextAssembler.js, ConsequenceCompiler.js, SignalSynthesisEngine.js
- LENS component architecture and rendering specifics
- EIR HTML rendering details (AssessmentPackageBuilder.js)
- Specific file paths, function signatures, and implementation patterns
- Historical context of how each discovery was made (the journey, not the destination)
- ChatGPT's strategic reasoning that produced key steering corrections

The 20% gap is acceptable because: code can be read from the repository, implementation patterns can be discovered by reading the files, and ChatGPT's steering will continue in future sessions. The 80% — the architectural decisions, commercial positioning, execution discipline, and validation framework — cannot be reconstructed from the code alone.

### Loading sequence

```
1. CLAUDE.md                          → execution discipline
2. Runtime Cognition Contract          → what PI can conclude
3. EIR Activation Contract             → when narrative changes
4. Capability Delta + Category Valid.  → what PI is commercially
5. Corridor Synthesis + Commercial     → how to sell it
6. Operating Forensics                 → what to never repeat
7. Validation Matrix                   → how to prove new specimens
8. CTO Corridor                       → representative product
9. BlueEdge evidence                   → ground truth
```

A new Claude instance loading these 9 documents in this order would be operationally effective within its first interaction. Not identical to the current instance — but 80% of the way there, with the remaining 20% discoverable from the repository.
