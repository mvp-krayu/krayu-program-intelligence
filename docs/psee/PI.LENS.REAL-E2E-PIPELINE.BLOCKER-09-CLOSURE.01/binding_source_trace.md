# Binding Source Trace
## PI.LENS.REAL-E2E-PIPELINE.BLOCKER-09-CLOSURE.01

**Date:** 2026-05-03
**Contract:** PI.LENS.REAL-E2E-PIPELINE.BLOCKER-09-CLOSURE.01

---

## Required Artifact

```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/binding_envelope_fastapi_compatible.json
```

---

## Search Performed

| Location | Result |
|----------|--------|
| `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/` | Directory absent |
| `clients/blueedge/psee/runs/*/binding/binding_envelope.json` | 3 files found |
| `clients/blueedge/psee/runs/*/vault/binding_envelope.json` | 3 files found |
| Any `*binding_envelope_fastapi_compatible*` anywhere | 0 files |

---

## Governed Source Identified

`clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/binding/binding_envelope.json`

**Contract ID:** `PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01`
**Artifact field:** `binding_envelope_fastapi_compatible`
**Generated date:** `2026-04-29`
**SHA256:** `fa508036d5b048b50c4b4fd1e6385521f63821d86c750fdc00f15b1d5547bc33`

Signal values confirmed match source_manifest.json note:
- PSIG-001 = 5.663 ✓
- PSIG-002 = 3.2098 ✓
- PSIG-004 = 2.1822 ✓
- PSIG-006 = THEORETICAL_BASELINE (value: 0) ✓

---

## Copy Action

Source: `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/binding/binding_envelope.json`
Destination: `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/binding_envelope_fastapi_compatible.json`

Method: `cp` (no content modification)
SHA256 post-copy: `fa508036d5b048b50c4b4fd1e6385521f63821d86c750fdc00f15b1d5547bc33` (matches source)

---

## Authority

The source file's `contract_id` and `artifact` fields self-identify this as
the canonical `binding_envelope_fastapi_compatible` artifact produced by
`PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01`. It was
stored as `binding_envelope.json` in the canonical orchestrated fixup run.
The governed copy restores it to the expected contract path.
