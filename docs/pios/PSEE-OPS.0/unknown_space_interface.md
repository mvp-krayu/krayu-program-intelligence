# PSEE-OPS.0 — Unknown-Space Interface

**Stream:** PSEE-OPS.0
**Family:** PSEE-OPS
**Date:** 2026-04-05
**Authority:** PSEE.2/exception_runtime_spec.md §Part 3;
               PSEE.1/psee_decision_contract_v1.md G-02, INV-02;
               PSEE.1/escalation_and_fallback_spec.md §Part 3

---

## Unknown-Space Record Schema

This document defines how `UnknownSpace` (US) records produced by the engine are surfaced to the operator, persisted externally, and prevented from auto-resolution. US records are read-only for operators — they may not be dismissed, resolved, or suppressed.

---

### UnknownSpace Record Schema (Internal Engine Format)

Produced by `UnknownSpaceRecorder` inside the engine (PSEE.2 §G4):

```json
{
  "us_id":              "string",       // "US-NN" sequential (engine-assigned)
  "condition_type":     "US-CONDITION-01|US-CONDITION-02|US-CONDITION-03",
  "description":        "string",       // specific statement of the unknown position
  "affected_entities":  ["string"],     // CEU IDs, file paths, or domain IDs
  "downstream_impact":  "string",       // which consumers must treat this as unknown
  "created_at_state":   "string",       // engine state at time of creation
  "resolution":         null,           // always null; never populated programmatically
  "created_at":         "ISO-8601"
}
```

`resolution` is a permanent null. No engine code path ever sets it. No operator input channel accepts a resolution for a US record. This is INV-02 enforcement.

---

## Externalization Format (Section G Question 5)

US records are externalized in two forms:

### Form 1 — Embedded in normalized_evidence_map (O-02)

Every US record is included in the `normalized_evidence_map` output artifact (O-02) under a top-level `unknown_space` array. This is the primary persistence location — it is part of the governed Phase B output.

```json
{
  "artifact": "normalized_evidence_map",
  "psee_status": "COMPLETE|PARTIAL",
  ...
  "unknown_space": [
    {
      "us_id": "US-01",
      "condition_type": "US-CONDITION-01",
      "description": "...",
      "affected_entities": ["CEU-03", "CEU-07"],
      "downstream_impact": "...",
      "resolution": null
    }
  ]
}
```

### Form 2 — Standalone US Report (operator-facing)

The operator surface writes a standalone `unknown_space_report.json` alongside the output artifacts. This file is:
- a flat array of all US records produced in the run
- decorated with context for operator readability
- explicitly labeled as non-authoritative (the embedded O-02 records are authoritative)

```json
{
  "report_type":        "unknown_space_report",
  "run_id":             "string",
  "stream_id":          "string",
  "total_us_records":   "integer",
  "psee_governance_note": "US records are positions of unresolved information. They are NOT errors. They must NOT be resolved by inference. Downstream consumers must treat them as unknown until explicit evidence is obtained.",
  "records": [
    {
      "us_id":              "US-01",
      "condition_type":     "US-CONDITION-01",
      "description":        "File-level parity between CEU-03 and CEU-07 is unknown. Structural similarity observed; no content comparison performed.",
      "affected_entities":  ["CEU-03", "CEU-07"],
      "downstream_impact":  "OVL record consumers must treat file_level_parity as UNKNOWN.",
      "resolution":         null,
      "resolution_note":    "Resolving this US record requires: a content comparison (diff) between the affected entities. When comparison evidence is available, a new PSEE run with the evidence included will produce a resolved OVL record."
    }
  ]
}
```

---

## Non-Resolution Guarantee

The operator interface provides no mechanism to resolve a US record. Specifically:

| Operator action | Result |
|---|---|
| Submit a `resolution` value for a US record | REJECTED — "US_RECORD_RESOLUTION_NOT_ACCEPTED: US records may not be operator-resolved" |
| Dismiss a US record | REJECTED — no dismiss action exists in the interface |
| Mark a US record as "known" | REJECTED — parity assertions require evidence, not operator declaration (FB-01/FB-02) |
| Request engine to skip US creation | REJECTED — US creation is mandatory per INV-02 |

The only valid path to resolving an unknown position is:
1. Obtain the missing evidence (e.g., perform the content diff)
2. Provide the evidence in the boundary document or corpus for a new PSEE run
3. The new run will detect the resolved position and produce a resolved OVL record (or no US record)

US records from a prior run are NOT carried forward into a new run. Each run produces its own US records from the corpus as-observed.

---

## US Record Presentation Rules

When presenting US records to operators:

**Rule 1 — Present verbatim.** The `description` and `downstream_impact` fields are written by the engine at creation time. They must not be paraphrased, summarized, or interpreted by the operator interface.

**Rule 2 — No severity ranking.** The interface does not rank US records by severity or priority. All US records are equal in governance status. Ranking would constitute interpretation (FB-05 / CLAUDE.md §3.4).

**Rule 3 — No suggested resolutions.** The operator interface does not suggest how to resolve a US record. It states what evidence is needed (the `resolution_note` field is limited to describing the category of evidence required, not a specific resolution value).

**Rule 4 — No aggregation by inference.** US records are presented individually. The interface does not group US records that "seem related" — that would be interpretation without authorization.

---

## US Records in PARTIAL Executions

When the execution reaches S-T3 (PARTIAL), US records are still produced normally. The PARTIAL flag applies to coverage, not to US record completeness. The `unknown_space_report.json` for a PARTIAL execution is stamped:

```
"psee_status": "PARTIAL — coverage=N%; advisory only; US records below are from the partially-covered execution"
```

Downstream consumers of a PARTIAL execution must treat both the coverage gap AND the US records as advisory.

---

## Downstream Consumer Guidance

The `unknown_space_report.json` includes a `downstream_impact` field per record. This field is the engine's explicit instruction to downstream consumers about how the unknown position affects their use of the outputs.

Downstream consumers (40.3 equivalent, 41.x equivalent, or any operator using the PSEE outputs) MUST:
- Read the `unknown_space` array in O-02 before using any CEU or OVL records
- Apply the `downstream_impact` statement to their use of affected records
- Not assert file-level equivalence for any CEU pair with a US record citing US-CONDITION-01

---

#### STATUS

| Check | Result |
|---|---|
| UnknownSpace record schema defined | CONFIRMED |
| Externalization Form 1 (embedded in O-02) defined | CONFIRMED |
| Externalization Form 2 (standalone report) defined | CONFIRMED |
| Non-resolution guarantee defined with rejection rules | CONFIRMED |
| US presentation rules defined (no ranking, no summarizing) | CONFIRMED |
| PARTIAL execution US record handling defined | CONFIRMED |
| Section G Question 5 (US records externalized) answered | CONFIRMED |
| No canonical mutation | CONFIRMED |

**UNKNOWN-SPACE INTERFACE: COMPLETE**
