# Replay Record — 51.6R.2

Stream: 51.6R.2 — Mode State Guard
Date: 2026-03-26

---

## Commands Run (in order)

```bash
# 1. Branch from 51.6R.1 state
cd ~/Projects/repos/k-pi
git checkout feature/51-6R1-persona-entry-correction
git checkout -b feature/51-6R2-mode-state-guard
git push -u origin feature/51-6R2-mode-state-guard

# 2. Read current index.js state

# 3. Apply four changes to pages/index.js:
#    - Remove PERSONA_DEFAULT_FLOW auto-assign useEffect
#    - Flip PERSONA_AUTO_OPEN guard: !demoActive → only during demo
#    - Add setSelectedFlow(null) to handleDemoExit
#    - Update handleStartDemo: derive activeFlow from persona at start
#    - Update contract header to PIOS-51.6R.2-RUN01-CONTRACT-v1

# 4. Create validation script
# scripts/pios/51.6R.2/validate_mode_state_guard.py

# 5. Run all validators
python3 scripts/pios/51.6R.2/validate_mode_state_guard.py   # 35/35 PASS
python3 scripts/pios/51.6/validate_traversal_sequence.py     # 69/69 PASS
python3 scripts/pios/51.6/validate_persona_invariance.py     # 40/40 PASS
python3 scripts/pios/51.6R.1/validate_entry_correction.py    # 34/34 PASS

# 6. Stage and commit
git add .
git commit -m "stream 51.6R.2: mode state guard — persona isolation and demo exit reset"
git push
```

---

## Rerun Order

1. Ensure app running: `cd app/execlens-demo && npm run dev`
2. Run primary validator: `python3 scripts/pios/51.6R.2/validate_mode_state_guard.py`
3. Run regression validators:
   - `python3 scripts/pios/51.6/validate_traversal_sequence.py`
   - `python3 scripts/pios/51.6/validate_persona_invariance.py`
   - `python3 scripts/pios/51.6R.1/validate_entry_correction.py`
4. Review logs in `docs/pios/51.6R.2/validation_log.json`
5. Expected: 35/35 + 69/69 + 40/40 + 34/34 PASS

---

## Validation Command

```bash
cd ~/Projects/repos/k-pi
python3 scripts/pios/51.6R.2/validate_mode_state_guard.py
# Output: docs/pios/51.6R.2/validation_log.json
# Expected: 35/35 PASS
```
