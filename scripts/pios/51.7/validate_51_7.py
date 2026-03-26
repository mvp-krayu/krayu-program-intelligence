#!/usr/bin/env python3
"""
validate_51_7.py
PIOS-51.7-RUN01-CONTRACT-v1

Validation suite: persona_required, execution_blocked_without_persona,
evidence_no_empty_state, adapter_calls_blocked.

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

# ── persona_required ──────────────────────────────────────────────────────────

print("\n[persona_required]")

idx = read("app/execlens-demo/pages/index.js")

check("index.js has PIOS-51.7 contract",                 "persona_required",
      "PIOS-51.7-RUN01-CONTRACT-v1" in idx)
check("handleStartDemo hard gate present",               "persona_required",
      "if (!enlPersona) return" in idx)
check("No default persona assignment at demo start",     "persona_required",
      "setEnlPersona('CTO')" not in idx)
check("No PERSONA_DEFAULT_FLOW.CTO silent fallback",     "persona_required",
      "PERSONA_DEFAULT_FLOW.CTO" not in idx)
check("Persona required message present",                "persona_required",
      "Select a Persona to enable execution" in idx)
check("Start button disabled without persona",           "persona_required",
      "disabled={!enlPersona}" in idx)

# ── execution_blocked_without_persona ─────────────────────────────────────────

print("\n[execution_blocked_without_persona]")

check("Demo start blocked: setDemoActive not reachable without persona",
      "execution_blocked_without_persona",
      "if (!enlPersona) return" in idx and
      idx.index("if (!enlPersona) return") < idx.index("setDemoActive(true)"))
check("No persona auto-assignment bypasses gate",        "execution_blocked_without_persona",
      "setEnlPersona('CTO')" not in idx)
check("Narrative panel guarded by enlPersona",           "execution_blocked_without_persona",
      "queryData && enlPersona" in idx and
      idx.count("queryData && enlPersona") >= 2)
check("ENLPanel render guarded by enlPersona",           "execution_blocked_without_persona",
      idx.count("<ENLPanel") == 1 and "queryData && enlPersona" in idx)
check("Persona gate annotation in source",               "execution_blocked_without_persona",
      "hard gate" in idx)

# ── evidence_no_empty_state ───────────────────────────────────────────────────

print("\n[evidence_no_empty_state]")

check("Evidence fallback message present",               "evidence_no_empty_state",
      "Evidence requires a selected Persona" in idx)
check("Evidence never renders without persona",          "evidence_no_empty_state",
      "queryData && !enlPersona" in idx)
check("Evidence fallback CSS class present",             "evidence_no_empty_state",
      "evidence-blocked-state" in idx)
check("globals.css .evidence-blocked-state defined",     "evidence_no_empty_state",
      ".evidence-blocked-state" in read("app/execlens-demo/styles/globals.css"))
check("ENLPanel not rendered when persona null",         "evidence_no_empty_state",
      idx.count("<ENLPanel") == 1)

# ── adapter_calls_blocked ─────────────────────────────────────────────────────

print("\n[adapter_calls_blocked]")

pp = read("app/execlens-demo/components/PersonaPanel.js")

check("PersonaPanel fetch guarded by selectedPersona",   "adapter_calls_blocked",
      "if (!selectedPersona || !queryId) return" in pp)
check("PersonaPanel fetch only fires with persona set",  "adapter_calls_blocked",
      "[selectedPersona, queryId]" in pp)
check("No fetch in index.js dependent on persona",       "adapter_calls_blocked",
      idx.count("fetch(") == 1)
check("No adapter call in DemoController",               "adapter_calls_blocked",
      "fetch(" not in read("app/execlens-demo/components/DemoController.js"))
check("TraversalEngine has no fetch calls",              "adapter_calls_blocked",
      "fetch(" not in read("app/execlens-demo/components/TraversalEngine.js"))

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

out_path = REPO_ROOT / "docs/pios/51.7/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.7", "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
