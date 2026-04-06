# Replay Commands

**Document:** replay_commands.md
**Stream:** PSEE.RECONCILE.1.WP-11

Run all commands from repository root: `/Users/khorrix/Projects/k-pi-core`

---

## blueedge

### Build package

```
python3 scripts/psee/build_runtime_envelope_generic.py --client blueedge --run-id run_01_authoritative
```

Output: `clients/blueedge/psee/runs/run_01_authoritative/package/`

### Run intake

```
python3 scripts/psee/run_intake_replay_generic.py --client blueedge --run-id run_01_authoritative
```

Output: `clients/blueedge/psee/runs/run_01_authoritative/intake/`

---

## client_template_01

### Build package

```
python3 scripts/psee/build_runtime_envelope_generic.py --client client_template_01 --run-id run_01_authoritative
```

Output: `clients/client_template_01/psee/runs/run_01_authoritative/package/`

### Run intake

```
python3 scripts/psee/run_intake_replay_generic.py --client client_template_01 --run-id run_01_authoritative
```

Output: `clients/client_template_01/psee/runs/run_01_authoritative/intake/`

---

## Inspect outputs

```
# Verification outcome
head -1 clients/<client_id>/psee/runs/run_01_authoritative/package/verification.log

# Intake mode
cat clients/<client_id>/psee/runs/run_01_authoritative/intake/intake_result.json | python3 -m json.tool

# Manifest
cat clients/<client_id>/psee/runs/run_01_authoritative/package/package_manifest.json | python3 -m json.tool
```

---

## Success criteria

- Both build commands exit 0 and print `ENVELOPE_BUILT`
- Both intake commands exit 0 and print `INTAKE_COMPLETE`
- `intake_result.json` has `rejected: false` for each client
- `intake_mode` matches `verification_outcome` for each client
