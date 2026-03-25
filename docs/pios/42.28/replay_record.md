# Replay Record — 42.28

Stream: 42.28 — Unified Live Runtime Surface Certification
Date: 2026-03-25

---

## Commands Run (in order)

```bash
# 1. Switch to branch
cd ~/Projects/repos/k-pi
git checkout feature/42-28-runtime-certification

# 2. Verify pre-flight state
git branch --show-current
git status --short
git log --oneline -10

# 3. Read runtime surface
# (read-only inspection of execlens.js, DemoController.js, adapter scripts)

# 4. Check adapter script presence
for s in scripts/pios/42.4/execlens_adapter.py \
         scripts/pios/42.6/execlens_overview_adapter.py \
         scripts/pios/42.7/execlens_topology_adapter.py \
         scripts/pios/42.23/execlens_wowchain_adapter.py \
         scripts/pios/42.13/demo_activate.py \
         scripts/pios/42.15/enl_console_adapter.py \
         scripts/pios/42.16/persona_view_map.py; do
  [ -f "$s" ] && echo "PRESENT: $s" || echo "ABSENT:  $s"
done

# 5. Run baseline snapshot (all routes)
python3 -c "
import json, urllib.request, hashlib
BASE = 'http://localhost:3000/api/execlens'
tests = [
    ('query_GQ003', f'{BASE}?query=GQ-003'),
    ('list', f'{BASE}?list=true'),
    ('overview', f'{BASE}?overview=true'),
    ('topology_highlight', f'{BASE}?topology=true&highlight=GQ-003'),
    ('topology_plain', f'{BASE}?topology=true'),
    ('status', f'{BASE}?status=true'),
    ('enl_GQ003', f'{BASE}?enl=GQ-003'),
    ('persona_exec', f'{BASE}?persona=EXECUTIVE&query=GQ-003'),
    ('persona_cto', f'{BASE}?persona=CTO&query=GQ-003'),
    ('persona_analyst', f'{BASE}?persona=ANALYST&query=GQ-003'),
]
results = []
for name, url in tests:
    try:
        r = urllib.request.urlopen(url, timeout=15)
        body = r.read()
        chk = hashlib.sha256(body).hexdigest()[:16]
        results.append({'test': name, 'url': url, 'status': r.status, 'checksum': chk, 'ok': r.status==200})
    except Exception as e:
        code = getattr(e, 'code', 'ERR')
        results.append({'test': name, 'url': url, 'status': code, 'ok': False, 'error': str(e)[:80]})
print(json.dumps(results, indent=2))
"

# 6. Verify red-node presence
python3 -c "
import json, urllib.request
r = urllib.request.urlopen('http://localhost:3000/api/execlens?topology=true&highlight=GQ-003', timeout=15)
d = json.loads(r.read())
red = []
for dom in d.get('topology', []):
    if dom.get('emphasis') == 'high': red.append(('domain', dom['id']))
    for cap in dom.get('capabilities', []):
        if cap.get('emphasis') == 'high': red.append(('cap', cap['id']))
        for cmp in cap.get('components', []):
            if cmp.get('emphasis') == 'high': red.append(('cmp', cmp['id']))
print('RED nodes:', red)
print('domain_count:', d.get('domain_count'))
print('capability_count:', d.get('capability_count'))
print('component_count:', d.get('component_count'))
"

# 7. Check overview response shape
python3 -c "
import urllib.request, json
r = urllib.request.urlopen('http://localhost:3000/api/execlens?overview=true', timeout=15)
d = json.loads(r.read())
print(json.dumps(list(d.keys()), indent=2))
"

# 8. Run validation script
python3 scripts/pios/42.28/validate_unified_runtime_surface.py

# 9. Stage and commit
git add docs/pios/42.28/ scripts/pios/42.28/
git commit -m "stream 42.28: certify unified live runtime surface and add regression controls"
```

---

## Rerun Order

To reproduce the certification from scratch:

1. Ensure app is running: `cd app/execlens-demo && npm run dev`
2. Run validation: `python3 scripts/pios/42.28/validate_unified_runtime_surface.py`
3. Review: `docs/pios/42.28/validation_log.json`

---

## Validation Rerun Command

```bash
cd ~/Projects/repos/k-pi
python3 scripts/pios/42.28/validate_unified_runtime_surface.py
# Output: docs/pios/42.28/validation_log.json
# Expected: 12/12 PASS
```

Optional custom base:
```bash
python3 scripts/pios/42.28/validate_unified_runtime_surface.py --base http://localhost:3001/api/execlens
```
