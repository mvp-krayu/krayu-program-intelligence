# Decision Diff Summary
## PI.LENS.DECISION-SURFACE.PARITY-REOPEN.01

**Date:** 2026-05-02

---

## Summary

The wrapper-generated Decision Surface is missing 7 content elements, all traceable to a single root cause: `pz_proj=None` and `psig_proj=None` due to the 41.x projection files being unreachable from the symlink-based `--package-dir` path.

---

## Diff by Section

### Missing in Generated — EPB Block (3,372 byte deficit)

The entire `ds-epb` section is absent. Canonical contains:

```html
<div class="ds-epb">
  <div class="ds-epb-section-title">Where pressure exists</div>
  <div class="ds-epb-grid">
    <div class="ds-epb-card">
      <div class="ds-epb-card-title">Structural Pressure Signals</div>
      <div class="ds-epb-card-main">3 signals are simultaneously active across the system.</div>
      <div class="ds-epb-card-trace">PSIG-001 · PSIG-002 · PSIG-004</div>
      <div class="ds-epb-card-support">All active pressure signals share the same affected domain scope.</div>
      <div class="ds-epb-card-close">This indicates a shared structural pressure pattern.</div>
    </div>
    <div class="ds-epb-visual">
      <canvas id="ds-signal-trace" ...></canvas>
      <script>(...graph animation...)</script>
    </div>
  </div>
  <div class="ds-epb-connector"></div>
  <div class="ds-epb-synthesis">
    <strong>A single structural pressure pattern spans multiple domains.</strong>...
  </div>
</div>
```

Generated has empty whitespace in this position.

---

### Missing Truth Text Sentence

Canonical truth text (3 sentences):
1. "Structural evidence is complete for the current evidence layer. Semantic domain coverage: 5/17 domains have structural backing. 12 semantic domains remain projection-only."
2. "The active pressure pattern is centered on Platform Infrastructure and Data, backed by backend_app_root (DOM-04)."
3. **"A single structural pressure pattern appears across the system."** ← ABSENT in generated

Generated truth text (2 sentences only — missing sentence 3).

---

### Missing Gap Items

Canonical gap items (5):
1. "Execution-layer behavioral state" — present in generated ✓
2. **"2 structural signals not activated"** ← ABSENT in generated
3. **"Blind spot coverage active — entities outside zone scope not characterized"** ← ABSENT in generated
4. "Causal relationships between conditions" — present in generated ✓
5. "Runtime behavior under load" — present in generated ✓

Generated gap items (3): items 2 and 3 absent.

---

## Unchanged Sections

- Hero block (INVESTIGATE, score 60, CONDITIONAL, badges, rationale) — identical content
- CSS / head — byte-identical
- Navigation links — volatile run-id only
- Explore links — volatile run-id only
- Footer — identical
- Inference prohibition — identical

---

## Diff Classification

| Category | Value |
|----------|-------|
| Byte diff type | STRUCTURAL_CONTENT_DIFF |
| Prior classification | VOLATILE_METADATA_ONLY (INCORRECT for wrapper-generated output) |
| Non-allowed diffs | MULTIPLE (content, not metadata) |
| Parity status | FAIL |
