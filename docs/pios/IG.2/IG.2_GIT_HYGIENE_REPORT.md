# IG.2 — Git Hygiene Report

**Stream:** IG.2
**Parent:** IG.1
**Layer:** INGESTION
**Status:** COMPLETE
**Date:** 2026-04-04

---

## 1. VALIDATOR OUTPUT

```
=== IG.2 Git Hygiene Validator ===

  PASS  Active branch: work/ig-foundation (expected: work/ig-foundation)
  PASS  Baseline anchor present: pios-core-v0.4-final
  PASS  Baseline anchor present: demo-execlens-v1-final
  PASS  Baseline anchor present: governance-v1-final
  PASS  Baseline docs (40.2/40.3/40.4) unmodified
  PASS  run_04 not on main branch
  PASS  Not executing on main
  INFO  Stash entries: 1

PASS: 7 / FAIL: 0
VERDICT: PASS
```

---

## 2. FINDINGS

| Check | Result | Detail |
|---|---|---|
| Active branch | PASS | `work/ig-foundation` |
| `pios-core-v0.4-final` anchor | PASS | Tag present and intact |
| `demo-execlens-v1-final` anchor | PASS | Tag present and intact |
| `governance-v1-final` anchor | PASS | Tag present and intact |
| Baseline docs unmodified | PASS | No uncommitted changes to `docs/pios/40.2/`, `40.3/`, `40.4/` |
| run_04 not on main | PASS | `git ls-tree main` does not contain run_04 paths |
| Not executing on main | PASS | Branch is `work/ig-foundation`, not `main` |
| Stash entries | INFO | 1 stash entry present (not a violation) |

---

## 3. GIT HYGIENE VERDICT

**PASS**

All baseline anchors intact. Execution confined to `work/ig-foundation`. No baseline mutations. No unauthorized branch operations.
