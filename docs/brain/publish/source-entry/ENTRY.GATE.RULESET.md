---
name: ENTRY.GATE.RULESET
type: brain-module
brain: publish
domain: source-entry
version: 1.0
authority: WEB-CAT-INTEGRATION-01 extension
origin_stream: WEB.SOURCE.ENTRY.CONTROL.01
---

# ENTRY.GATE.RULESET

## Purpose

Define the conditions under which a route may enter governed status. No route is considered valid for the governed system until all gate conditions are satisfied.

---

## Entry Gate Ruleset

**The rule:**

> No route is considered valid for the governed system until it has a complete entry in `route_source_map.yaml` with all required fields populated and `verdict: allowed` or `verdict: provisional` with documented fallback acknowledgment.

### Required Fields for Registration

```yaml
/<route>/:
  source_type:        # one of: canonical_kpi | cat_governed_derivative | base44_snapshot_fallback | compiled_trusted_legacy | bridge_governed
  source_path:        # path to the source document (must exist; verified before entry)
  authority_level:    # e.g. doctrine_core | construct_core | derivative_capability | legacy_baseline | bridge
  CAT_required:       # true | false
  projection_required: # true | false
  allowed_claim_class: # narrative | construct | bridge | commercial_derivative
  fallback_policy:    # required if source_type is fallback
  anchor:             # true | false
  anchor_parent:      # parent route if anchor: true
  publish_status:     # live | preview-pending-publish
  verdict:            # allowed | provisional | blocked
  notes: >            # mandatory: one-paragraph statement of source authority basis
```

### Rejection Conditions — Route Entry is REJECTED if:

- `source_path` does not point to an existing file
- `source_type` is unrecognized or omitted
- `verdict` is `blocked` (route is registered as invalid, not allowed)
- `CAT_required: true` but no CAT artifact chain is documented
- `notes` field is absent
- Route is an anchor fragment (must use `anchor: true` and `anchor_parent`, not a standalone entry)
- Route would duplicate an existing canonical route's subject matter without derivation chain

### Entry Gate Check (Preflight Requirement)

Required before any stream that introduces or touches a route:

```
□ source_path file EXISTS on disk
□ source_type is one of the 5 recognized classes (or bridge_governed for BRIDGE class)
□ notes explain WHY this authority applies
□ verdict is not blocked
□ if CAT_required: true → CAT artifact chain documented
□ route does not duplicate canonical subject without derivation
```

---

## Module C Definition

```
Name: ENTRY.GATE.RULESET
Version: 1.0
Authority: WEB-CAT-INTEGRATION-01 extension
Purpose: Define the conditions under which a route may enter governed status

PRE-CONDITIONS FOR ENTRY (all must be TRUE):
  □ Route has been captured in a push manifest OR has explicit retrospective authority declaration
  □ Route classification has been determined (MODULE B)
  □ Source document exists at declared source_path
  □ route_source_map.yaml entry is complete with all required fields
  □ Entry notes explain source authority basis in one paragraph
  □ If CAT_required: true → CAT artifact chain documented and paths verified
  □ verdict is 'allowed' or 'provisional' with fallback acknowledgment
  □ Route does not create a canonical URL conflict with an existing entry

POST-ENTRY CONDITIONS (route is governed only when):
  □ pages/<route>.md compiled successfully
  □ Eleventy build includes the route
  □ If publish_status: live → route appears in sitemap
  □ If bridge class → Publish Brain controlled claims table entry exists
  □ Internal links from mirror pages may now point to this route

REJECTION — route entry is REJECTED if any of:
  ✗ source_path file does not exist on disk
  ✗ source_type not in recognized class list
  ✗ notes field absent
  ✗ CAT_required: true with no documented artifact chain
  ✗ Route subject duplicates existing canonical entry without derivation
  ✗ Route is an anchor fragment (use anchor:true pattern, not standalone entry)

RETROSPECTIVE ENTRY (for existing ungoverned routes):
  Same rules apply.
  Additionally requires: explicit governance declaration noting the route bypassed
  the standard pipeline, with documented rationale for allowing or blocking.
```

---

*ENTRY.GATE.RULESET — Source Entry Control System | origin: WEB.SOURCE.ENTRY.CONTROL.01 | 2026-04-20*
