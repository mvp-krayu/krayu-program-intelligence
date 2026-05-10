# SQO Cockpit State Model

PI.SQO.COCKPIT-UX-ARCHITECTURE.01

---

## State 1: NO_CLIENT_SELECTED

**Visual posture:** Empty cockpit shell. Client/run selector prominent.

**Primary user action:** Select a client and run from the manifest registry.

**Governance warning:** None.

**Next operational step:** Select a registered client/run to load qualification data.

---

## State 2: CLIENT_REGISTERED_NO_SQO

**Visual posture:** Client/run header visible. All cockpit sections show "Qualification data unavailable." Degradation notice prominent.

**Primary user action:** Initiate first SQO assessment (run qualification state detection, debt detection, maturity scoring).

**Governance warning:** "No SQO assessment has been performed for this client/run. Qualification state unknown."

**Next operational step:** Run SQO assessment pipeline to produce initial artifacts.

---

## State 3: S0_STRUCTURAL_ONLY

**Visual posture:** Minimal qualification display. S0 badge. Most sections degraded. Report-pack-only notice.

**Primary user action:** Assess what structural evidence exists and what source material would enable S1.

**Governance warning:** "S0: Structural only. No semantic intelligence available. Report-pack access only."

**Next operational step:** Identify minimum source material for S0→S1 transition.

---

## State 4: S1_ONBOARDING_REQUIRED

**Visual posture:** Active onboarding view. S1 badge. Debt section prominent with missing artifacts. Remediation section shows R2 pathway. Source material requirements highlighted.

**Primary user action:** Identify missing semantic artifacts and prepare for semantic pipeline re-run.

**Governance warning:** "S1: Structural labels only. Projection not authorized. Missing required semantic artifacts."

**Next operational step:** Gather required source material → prepare re-run checklist → execute semantic pipeline re-run.

**Reference case:** FastAPI — S1, 25 debt items, 12 blocking, primary pathway R2.

---

## State 5: S2_QUALIFIED_WITH_DEBT

**Visual posture:** Active maturation view. S2 badge. Maturity section prominent. Debt section shows grounding gaps. Progression section shows S2→S3 pathway. Handoff section shows "QUALIFIED" but with remaining work.

**Primary user action:** Address remaining grounding debt to progress toward S3.

**Governance warning:** "S2: Projection authorized with qualification. Advisory confirmation required. Grounding debt remains."

**Next operational step:** Identify ungrounded domains → gather structural grounding evidence → prepare R4 pathway execution.

**Reference case:** BlueEdge — S2, 15 debt items, 13 blocking, primary pathway R4.

---

## State 6: S3_FULLY_GOVERNABLE

**Visual posture:** Clean qualification display. S3 badge. All sections healthy. Handoff section shows "READY." Governance section clean.

**Primary user action:** Prepare PATH B handoff package.

**Governance warning:** "S3: Semantically governable. Full projection authorization available."

**Next operational step:** Assemble handoff package → submit to PATH B → enable governed projection in LENS.

---

## State 7: ARTIFACT_STALE

**Visual posture:** Warning overlay on all sections. Staleness indicator on affected artifacts. Freshness timestamp visible.

**Primary user action:** Re-run SQO assessment to refresh stale artifacts.

**Governance warning:** "Qualification artifacts are stale. Re-assessment recommended before operational decisions."

**Next operational step:** Verify source artifacts unchanged → re-run SQO assessment → confirm qualification state.

---

## State 8: REPLAY_FAILED

**Visual posture:** Error state on Replay section. Failed checks highlighted. Certification section shows NOT_CERTIFIED.

**Primary user action:** Investigate replay failure cause. Determine if source artifacts changed.

**Governance warning:** "Replay verification failed. Qualification state may not be deterministically reproducible. Handoff blocked."

**Next operational step:** Inspect failed replay checks → determine cause → re-run assessment if source changed → re-verify.

---

## State 9: HANDOFF_READY

**Visual posture:** Handoff section prominent with green "READY" indicator. Package contents preview available. Export action available.

**Primary user action:** Assemble and export PATH B handoff package.

**Governance warning:** None (all prerequisites met).

**Next operational step:** Export handoff package → submit to PATH B for qualification envelope building.

---

## State 10: HANDOFF_BLOCKED

**Visual posture:** Handoff section shows red "BLOCKED" indicator. Blocking conditions listed. Required actions highlighted.

**Primary user action:** Resolve blocking conditions.

**Governance warning:** "Handoff blocked. See blocking conditions below."

**Next operational step:** Varies by blocking condition — may require S-state progression, certification resolution, or replay repair.

**Blocking condition examples:**
- S-state below S2 → progress to S2 first
- Certification NOT_CERTIFIED → resolve certification failure
- Replay FAILED → resolve replay failure
- Critical debt unresolved → address blocking debt
