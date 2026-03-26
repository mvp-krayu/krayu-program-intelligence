# Replay Record — 51.5R

Stream: 51.5R — ENL Visible Chain Materialization Repair
Date: 2026-03-26

---

## Commands Run (in order)

```bash
# 1. Verify branch
cd ~/Projects/repos/k-pi
git branch --show-current    # → feature/51-5-enl-materialization
git log --oneline -1         # → cb31c09 stream 51.5: ENL materialization

# 2. Inspect live API payloads to understand data shape
curl -s "http://localhost:3000/api/execlens?persona=EXECUTIVE&query=GQ-003" | python3 -m json.tool
curl -s "http://localhost:3000/api/execlens?persona=CTO&query=GQ-003" | python3 -m json.tool
curl -s "http://localhost:3000/api/execlens?persona=ANALYST&query=GQ-003" | python3 -m json.tool
curl -s "http://localhost:3000/api/execlens?query=GQ-003" | python3 -m json.tool

# 3. Rewrite ENLPanel.js
cat <<'JSEOF' > app/execlens-demo/components/ENLPanel.js
# (full ENLPanel.js with PERSONA_LENS_FOCUS, ChainHeader, ChainBreadcrumb,
#  ChainPrimaryField, ChainStep, ENLPanel)
JSEOF

# 4. Append chain CSS to globals.css
cat <<'CSSEOF' >> app/execlens-demo/styles/globals.css
# (PIOS-51.5R chain CSS block)
CSSEOF

# 5. Create validation script
cat <<'PYEOF' > scripts/pios/51.5R/validate_enl_visible_chain.py
# (66-test validator)
PYEOF

# 6. Run validation
python3 scripts/pios/51.5R/validate_enl_visible_chain.py
# Result: 66/66 PASS

# 7. Write governance docs
# docs/pios/51.5R/enl_visible_chain_contract.md
# docs/pios/51.5R/enl_visible_chain_definition.md
# docs/pios/51.5R/persona_chain_matrix.md
# docs/pios/51.5R/execution_report.md
# docs/pios/51.5R/regression_report.md
# docs/pios/51.5R/file_changes.json
# docs/pios/51.5R/replay_record.md
# docs/pios/51.5R/CLOSURE.md

# 8. Stage and commit
git add .
git commit -m "stream 51.5R: ENL visible chain materialization repair"
git push
```

---

## Rerun Order

1. Ensure app running: `cd app/execlens-demo && npm run dev`
2. Run validation: `python3 scripts/pios/51.5R/validate_enl_visible_chain.py`
3. Review: `docs/pios/51.5R/validation_log.json`
4. Expected: 66/66 PASS

---

## Validation Command

```bash
cd ~/Projects/repos/k-pi
python3 scripts/pios/51.5R/validate_enl_visible_chain.py
# Output: docs/pios/51.5R/validation_log.json
# Expected: 66/66 PASS
```
