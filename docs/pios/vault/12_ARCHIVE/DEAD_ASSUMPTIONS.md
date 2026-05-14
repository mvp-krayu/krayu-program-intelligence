# Dead Assumptions

> **Assumptions that guided past architectural decisions and were later invalidated.**

---

## Invalidated Assumptions

### "ExecLens is the system's primary runtime surface"

**When assumed:** 2026-03-21 → 2026-05-08
**Invalidated by:** LENS v2 + SQO Cockpit creation (2026-05-09-10)
**Why it died:** ExecLens's panel-based model couldn't support the semantic richness of HYDRATED output or the qualification complexity of SQO.

### "Layers are either compliant or in violation"

**When assumed:** 2026-03-22 (canonical layer model)
**Invalidated by:** HYDRATED state formalization (2026-05-10)
**Why it died:** Binary compliance could not express graduated trustworthiness. HYDRATED output is operationally valuable without being fully structurally grounded — it's not "in violation," it's "at a known trustworthiness level."

### "Single-client architecture is sufficient"

**When assumed:** Through 2026-05-09
**Invalidated by:** GenericSemanticPayloadResolver + FastAPI onboarding (2026-05-10)
**Why it died:** Commercial viability required multi-client capability. Manifest-driven architecture replaced client-specific resolution.

### "All governance operations need equal rigor"

**When assumed:** Through 2026-05-10
**Invalidated by:** Strategic roadmap governance tiering recommendation (2026-05-12)
**Why it died:** Full governance (pre-flight, RETURN, CLOSURE, validation log) for CSS changes is overhead that destroys velocity without protecting against risk.

### "Vault = Obsidian file navigation"

**When assumed:** 2026-03-21 (ExecLens era)
**Invalidated by:** Structural evidence vault concept (2026-05-01+)
**Why it died:** "Vault" naturally evolved to mean structural evidence backing as grounding became a central concern. The Obsidian navigation use was never formally deprecated — it just faded.

### "Commercialization follows execution"

**When assumed:** governance_master_capsule.md (Stream 30 after Stream 50/60)
**Invalidated by:** Reality — commercialization concepts never executed as formal streams
**Why it died:** Commercial positioning moved to brain/product governance rather than following the 00-60 stream architecture.

### "Guided demo choreography is the right UX model"

**When assumed:** 51.x streams (2026-03-26 → 2026-03-29)
**Invalidated by:** SQO Cockpit independent sections (2026-05-10)
**Why it died:** 6 out of 18 streams being repairs proved the guided model was too brittle. Independent sections are more maintainable.

## Why Dead Assumptions Matter

Dead assumptions are architecture memory:
- They explain WHY superseded concepts existed
- They prevent re-discovery of failed paths
- They document the reasoning that was later disproven
- They protect against "we should try X" when X was already tried and failed

## Cross-References

- [[SUPERSEDED_CONCEPTS]] — the concepts built on these assumptions
- [[FAILED_ARCHITECTURAL_PATHS]] — the paths these assumptions led to
