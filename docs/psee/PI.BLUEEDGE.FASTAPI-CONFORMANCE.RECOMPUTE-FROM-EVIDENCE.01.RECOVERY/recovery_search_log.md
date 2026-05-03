# Recovery Search Log
## PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01.RECOVERY

**Date:** 2026-05-03
**Target:** `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json`

---

## Search 1 — Git History (file adds)

Command: `git log --all --oneline --diff-filter=A -- "*dom_path_domain_layer*"`

Result: **No commits found.**
The file was never committed to any branch in the git history.

---

## Search 2 — Git History (stream directory)

Command: `git log --all --oneline -- "*RECOMPUTE-FROM-EVIDENCE*"`

Result: **No commits found.**
The stream directory was never committed to any branch.

---

## Search 3 — Git Stash

Command: `git stash list`

Stash entries found:
- `stash@{0}: WIP on work/psee-runtime: 40a5db1 lens: lock e2e pipeline reality and conformance evidence`
- `stash@{1}: On work/psee-runtime: park PSEE runtime spillover after GAUGE.PRODUCT.4`
- `stash@{2}: On feature/i6-i7-canonical-authority: ce4-canonical-compilation-work`

Command: `git show stash@{0}^3 --name-only` (untracked files in stash 0)

**TARGET ARTIFACT FOUND in stash@{0}^3:**
```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json
```

Additional artifacts also found in stash (informational, not restored by this contract):
```
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/conformance_conclusion.md
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/distribution_recoverability.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/evidence_inventory.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/execution_report.md
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/blocked_binding_envelope.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/blocked_signal_recompute.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/report_input_manifest_fastapi_compatible.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/vault_input_manifest_fastapi_compatible.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/condition_correlation_state_fastapi_compatible.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/pressure_zone_state_fastapi_compatible.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/signal_registry_fastapi_compatible.json
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/vault_input_manifest_fastapi_compatible.json
```

---

## Search 4 — Branches

Command: `git branch -a | grep -i "recompute\|fastapi\|conformance"`

Result: No branches named for FastAPI conformance or recompute-from-evidence.

---

## Conclusion

**Recovery mode: DIRECT_RESTORE from stash@{0}^3**
