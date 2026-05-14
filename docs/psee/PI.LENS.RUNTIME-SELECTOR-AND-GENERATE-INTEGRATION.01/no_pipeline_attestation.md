# No Pipeline Attestation
## PI.LENS.RUNTIME-SELECTOR-AND-GENERATE-INTEGRATION.01

**Date:** 2026-05-02

---

## Attestation

During execution of PI.LENS.RUNTIME-SELECTOR-AND-GENERATE-INTEGRATION.01:

1. **No pipeline was executed.** `lens_generate.sh` invokes only `lens_report_generator.py` — the renderer, not the pipeline.
2. **No renderer was modified.** `scripts/pios/lens_report_generator.py` — NOT MODIFIED.
3. **No semantic bundle was modified.**
4. **No canonical reports were modified.**
5. **No topology files were modified.**
6. **No FastAPI was involved.**
7. **No broad refactor was performed.**

---

## Files Modified

| File | Change |
|------|--------|
| `app/gauge-product/pages/api/report-file.js` | Added `resolvePseeRunFilePath()` + `source=psee` branch (~40 lines) |
| `app/gauge-product/pages/lens.js` | Added `RuntimeSelector` component + one `lens-band` JSX entry |

## Files Created

| File | Purpose |
|------|---------|
| `app/gauge-product/pages/api/runtime-list.js` | Discovery endpoint |
| `app/gauge-product/pages/api/generate-report.js` | Generate action endpoint |

---

## What `generate-report.js` Invokes

```
execFile('bash', ['scripts/pios/lens_generate.sh', '--client', client, '--run', run], { cwd: REPO_ROOT })
```

This is the wrapper created in PI.LENS.GENERATE.WRAPPER.01 (with path-alignment fix from PI.LENS.GENERATE.WRAPPER-PATH-ALIGNMENT.01). It invokes `lens_report_generator.py` only.
