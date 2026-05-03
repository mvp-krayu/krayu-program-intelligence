# Workspace Binding Summary
## PI.LENS.RUNTIME-SELECTOR-CLEANUP-AND-WORKSPACE-BINDING.01

**Date:** 2026-05-03

---

## Workspace Button — Before

```js
onClick={() => window.open('/tier2/workspace')}
```

No client or run passed. Workspace page fell back to its own hardcoded constants.

## Workspace Button — After

```js
onClick={() => rt && window.open(
  `/tier2/workspace?client=${encodeURIComponent(rt.client)}&run=${encodeURIComponent(rt.run)}`
)}
```

`rt.client` and `rt.run` come from `RuntimeSelector`'s `runtimes` state — derived from `/api/runtime-list`.
No hardcoded values.

## Button Location

Placed inside `RuntimeSelector`, after the report buttons block.
Single workspace button per page (previously existed in removed `ReportPanel`).

## Scope Note

`/tier2/workspace.js` is not in scope for this stream. The workspace page currently reads its own
constants (`_SC_CLIENT_ID`, `_SC_RUN_ID`) and does not consume URL query params.
Full workspace-side binding is deferred to `PI.LENS.WORKSPACE.DEEP-BINDING.01`.

From `lens.js` perspective, the workspace URL is now correctly parameterized with the selected runtime.
