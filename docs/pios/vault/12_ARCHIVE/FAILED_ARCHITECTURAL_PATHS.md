# Failed Architectural Paths

> **Paths the system tried that didn't work — and why.**

---

## Documented Failures

### Panel-Based Guided Choreography

**What was tried:** Sequential panel progression with persona gates and guided demo flow (51.x era).

**Why it failed:** 6 out of 18 streams were repairs. Each persona change cascaded through panel states. The guided model created coupling where independence was needed.

**What replaced it:** SQO Cockpit with independently accessible sections and S-state-driven visibility.

**Lesson:** Don't couple navigation flow to data presentation. Let data drive state; let users drive navigation.

### Two-Pipeline Confusion

**What was tried:** The system had parallel extraction pipelines — the original BlueEdgeSemanticCandidateExtractor and the later ExplicitEvidenceRebaseExtractor — running simultaneously.

**Why it failed:** It was unclear which pipeline was authoritative. Child routes referenced the pre-rebase extractor while parent routes used rebase data. Source class governance couldn't be enforced across two pipelines.

**What replaced it:** Evidence rebase unification (dc5f9b2) — child routes rebound to the single rebase chain.

**Lesson:** When superseding an extraction pipeline, rebind consumers immediately. Don't leave the old pipeline active.

### Lane Ambiguity

**What was tried:** Multiple processing "lanes" without clear lane governance (pre-2026-05-06).

**Why it failed:** Without explicit lane separation, computation leaked between concerns. Work that should have been PATH A structural verification was mixed with PATH B semantic reconstruction.

**What replaced it:** Lane governance lock (3fa0ad2) — 4-lane separation with mandatory upstream context.

**Lesson:** Name the lanes before building them. Unnamed lanes drift into ambiguity.

### Semantic Overlay Drift

**What was tried:** Early SQO overlay integration into LENS v2 (70fe57f).

**Why it failed:** The overlay was treated as a live runtime feature when it was actually a prototype. It created governance confusion about what was production vs experimental.

**What replaced it:** Reclassification of runtime overlay as prototype (f5e3db4) with explicit boundary separation.

**Lesson:** Mark prototypes as prototypes. Don't integrate experimental features into production surfaces without governance designation.

### work/psee-runtime Branch Violation

**What was tried:** Operating the work/psee-runtime branch for runtime work.

**Why it failed:** work/psee-runtime is outside the authorized branch set defined in git_structure_contract.md. Work should have been on feature/runtime-demo or a properly scoped work/* branch.

**What replaced it:** Flag-and-proceed approach — violation acknowledged, work continued with awareness.

**Lesson:** Branch naming matters. Verify branch authorization before accumulating work.

## Why Failures Are Architecture Memory

Every failure teaches something. Without documenting failures:
- The same approach gets re-attempted
- The reasoning for current architecture is lost
- "Why don't we just..." questions have no answer
- Decision rationale becomes verbal tradition instead of documented truth

## Cross-References

- [[DEAD_ASSUMPTIONS]] — the assumptions behind these failures
- [[SUPERSEDED_CONCEPTS]] — what replaced the failed approaches
- [[HISTORICAL_SNAPSHOT_INDEX]] — snapshots preserving failed-path state
