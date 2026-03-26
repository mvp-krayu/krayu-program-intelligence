#!/usr/bin/env python3
"""
validate_persona_required_on_demo_start.py
PIOS-51.6R.4-RUN01-CONTRACT-v1

Validates: persona enforcement at demo start (default CTO if null),
evidence panel blocked when persona null, no null persona while demoActive.

Expected: all PASS
"""

import json, sys, urllib.request, urllib.error
from datetime import datetime
from pathlib import Path

RESULTS = []
BASE_URL = "http://localhost:3000"
REPO_ROOT = Path(__file__).resolve().parents[3]

def check(name, group, passed, detail=""):
    RESULTS.append({"name": name, "group": group,
                    "status": "PASS" if passed else "FAIL", "detail": detail})
    print(f"  [{'PASS' if passed else 'FAIL'}] {name}" + (f" — {detail}" if detail else ""))

def read(path):
    try: return (REPO_ROOT / path).read_text()
    except: return ""

def http_get(path):
    try:
        with urllib.request.urlopen(f"{BASE_URL}{path}", timeout=5) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e: return e.code, {}
    except: return 0, {}

# ── persona_enforcement ────────────────────────────────────────────────────────

print("\n[persona_enforcement]")

idx = read("app/execlens-demo/pages/index.js")

check("index.js has PIOS-51.7 contract",                 "persona_enforcement",
      "PIOS-51.7-RUN01-CONTRACT-v1" in idx)
check("handleStartDemo: hard gate present",              "persona_enforcement",
      "if (!enlPersona) return" in idx)
check("handleStartDemo: no CTO default assignment",      "persona_enforcement",
      "setEnlPersona('CTO')" not in idx)
check("Persona gate annotation present",                 "persona_enforcement",
      "51.7" in idx and "hard gate" in idx)
check("No PERSONA_DEFAULT_FLOW.CTO silent fallback",     "persona_enforcement",
      "PERSONA_DEFAULT_FLOW.CTO" not in idx)
check("No implicit persona in handleStartDemo",          "persona_enforcement",
      idx.count("setEnlPersona(") == 0 or "handleStartDemo" not in idx.split("setEnlPersona(")[0])

# ── evidence_guard ────────────────────────────────────────────────────────────

print("\n[evidence_guard]")

check("Evidence panel: persona null guard present",      "evidence_guard",
      "queryData && enlPersona" in idx and "queryData && !enlPersona" in idx)
check("Evidence panel: blocked message when no persona", "evidence_guard",
      "Evidence requires a selected Persona" in idx)
check("ENLPanel only rendered with persona present",     "evidence_guard",
      idx.count("<ENLPanel") == 1)
check("Evidence guard uses enlPersona (not selectedFlow)","evidence_guard",
      "selectedFlow" not in idx.split("queryData && enlPersona")[0].split("evidence")[-1])

# ── no_new_coupling ───────────────────────────────────────────────────────────

print("\n[no_new_coupling]")

te = read("app/execlens-demo/components/TraversalEngine.js")
dc = read("app/execlens-demo/components/DemoController.js")

check("TraversalEngine.js unchanged",                    "no_new_coupling",
      "51.6R.4" not in te)
check("DemoController.js unchanged",                     "no_new_coupling",
      "51.6R.4" not in dc)
check("No new state variables introduced",               "no_new_coupling",
      idx.count("useState(") <= 14)  # 51.8R guided correction: guidedStepIndex + rawStepActive added — supersedes <= 12
check("No new fetch calls in index.js",                  "no_new_coupling",
      idx.count("fetch(") == 1)
check("selectedFlow logic unchanged",                    "no_new_coupling",
      "setSelectedFlow(null)" in idx and "setSelectedFlow(activeFlow)" in idx)

# ── api_regression ────────────────────────────────────────────────────────────

print("\n[api_regression]")

for path, label in [
    ("/api/execlens?query=GQ-003",                   "query GQ-003"),
    ("/api/execlens?topology=true",                  "topology"),
    ("/api/execlens?status=true",                    "status"),
    ("/api/execlens?persona=EXECUTIVE&query=GQ-003", "persona EXECUTIVE GQ-003"),
    ("/api/execlens?persona=CTO&query=GQ-003",       "persona CTO GQ-003"),
    ("/api/execlens?persona=ANALYST&query=GQ-003",   "persona ANALYST GQ-003"),
]:
    code, _ = http_get(path)
    check(f"route: {label}", "api_regression", code == 200, f"HTTP {code}")

# ── Summary ───────────────────────────────────────────────────────────────────

passed = sum(1 for r in RESULTS if r["status"] == "PASS")
failed = sum(1 for r in RESULTS if r["status"] == "FAIL")
total  = len(RESULTS)

print(f"\nResult: {passed}/{total} PASS")
groups = {}
for r in RESULTS:
    g = r["group"]
    if g not in groups: groups[g] = {"pass": 0, "fail": 0}
    if r["status"] == "PASS": groups[g]["pass"] += 1
    else: groups[g]["fail"] += 1
for g, c in groups.items():
    print(f"  {g}: {c['pass']}/{c['pass']+c['fail']}")

out_path = REPO_ROOT / "docs/pios/51.6R.4/validation_log_persona_required.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.6R.4", "validator": "validate_persona_required_on_demo_start",
       "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
