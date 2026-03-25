# Replay Record — 42.29

Stream: 42.29 — ENL / Persona Runtime Activation & 9-Step DemoController Restoration
Date: 2026-03-25

---

## Commands Run (in order)

```bash
# 1. Switch to branch
cd ~/Projects/repos/k-pi
git checkout feature/42-28-runtime-certification
git checkout -b feature/42-29-enl-persona-runtime
git push -u origin feature/42-29-enl-persona-runtime

# 2. Verify pre-flight
git branch --show-current
git status --short

# 3. Create adapter directories
mkdir -p scripts/pios/42.15 scripts/pios/42.16 scripts/pios/42.13

# 4. Implement adapters
# (created scripts/pios/42.15/enl_console_adapter.py)
# (created scripts/pios/42.16/persona_view_map.py)
# (created scripts/pios/42.13/demo_activate.py)

# 5. Test ENL adapter
python3 scripts/pios/42.15/enl_console_adapter.py --query GQ-003
# Initial: empty enl_signals (signal_registry lookup bug)
# Fix: signal_registry.get(sig_id) instead of registry.get("signals", [])
# Retest: 2 signals, 1 emphasis_node — PASS

# 6. Test persona adapter
python3 scripts/pios/42.16/persona_view_map.py --persona EXECUTIVE --query GQ-003
python3 scripts/pios/42.16/persona_view_map.py --persona ANALYST --query GQ-003

# 7. Update execlens.js (runScriptText → runScript for ENL/persona/status)
# Update DemoController.js (7→9 steps)
# Update index.js (PersonaPanel import, TOTAL_DEMO_STEPS, auto-select step)
# Create PersonaPanel.js
# Append CSS to globals.css

# 8. Run validation
python3 scripts/pios/42.29/validate_unified_demo_complete.py
# Output: docs/pios/42.29/validation_log.json
# Result: 13/13 PASS

# 9. Stage and commit
git add .
git commit -m "stream 42.29: activate ENL/persona runtime and restore 9-step unified demo"
git push
```

---

## Rerun Order

To reproduce from scratch:

1. Ensure app is running: `cd app/execlens-demo && npm run dev`
2. Run validation: `python3 scripts/pios/42.29/validate_unified_demo_complete.py`
3. Review: `docs/pios/42.29/validation_log.json`
4. Expected: 13/13 PASS

---

## Validation Rerun Command

```bash
cd ~/Projects/repos/k-pi
python3 scripts/pios/42.29/validate_unified_demo_complete.py
# Output: docs/pios/42.29/validation_log.json
# Expected: 13/13 PASS
```

Optional custom base:
```bash
python3 scripts/pios/42.29/validate_unified_demo_complete.py --base http://localhost:3001/api/execlens
```

---

## Adapter Smoke Tests

```bash
# ENL adapter
python3 scripts/pios/42.15/enl_console_adapter.py --query GQ-003

# Persona adapters
python3 scripts/pios/42.16/persona_view_map.py --persona EXECUTIVE --query GQ-003
python3 scripts/pios/42.16/persona_view_map.py --persona CTO --query GQ-003
python3 scripts/pios/42.16/persona_view_map.py --persona ANALYST --query GQ-003

# Status adapter
python3 scripts/pios/42.13/demo_activate.py --status
```
