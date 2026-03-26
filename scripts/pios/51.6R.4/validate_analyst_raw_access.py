#!/usr/bin/env python3
"""
validate_analyst_raw_access.py
PIOS-51.6R.4-RUN01-CONTRACT-v1

Validates: Analyst-only raw artifacts access in ENLPanel,
no duplication, no new API calls, read-only display of existing data.

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

# ── raw_artifacts_content ─────────────────────────────────────────────────────

print("\n[raw_artifacts_content]")

enl = read("app/execlens-demo/components/ENLPanel.js")
idx = read("app/execlens-demo/pages/index.js")

check("ENLPanel has PIOS-51.6R.4 contract",              "raw_artifacts_content",
      "PIOS-51.6R.4-RUN01-CONTRACT-v1" in enl)
check("RawArtifactsSection component present",           "raw_artifacts_content",
      "RawArtifactsSection" in enl)
check("View raw artifacts label present",                "raw_artifacts_content",
      "View raw artifacts" in enl)
check("Raw artifacts toggle button present",             "raw_artifacts_content",
      "raw-artifacts-toggle" in enl)
check("Raw artifacts uses useState for toggle",          "raw_artifacts_content",
      "useState" in enl and "raw-artifacts" in enl)
check("raw-artifact-data renders existing evidence",     "raw_artifacts_content",
      "raw-artifact-data" in enl and "sig.evidence" in enl)

# ── analyst_only_guard ────────────────────────────────────────────────────────

print("\n[analyst_only_guard]")

check("Raw artifacts guarded by ANALYST persona",        "analyst_only_guard",
      "persona === 'ANALYST'" in enl)
check("RawArtifactsSection only rendered for ANALYST",   "analyst_only_guard",
      enl.count("RawArtifactsSection") >= 2)  # definition + usage
check("No raw artifacts in PersonaPanel",                "analyst_only_guard",
      read("app/execlens-demo/components/PersonaPanel.js").count("raw-artifact") == 0)
check("No raw artifacts in index.js panels",             "analyst_only_guard",
      "raw-artifact" not in idx)

# ── no_new_data ───────────────────────────────────────────────────────────────

print("\n[no_new_data]")

check("ENLPanel: no new fetch calls",                    "no_new_data",
      "fetch(" not in enl)
check("Raw artifacts: read-only (no setState on data)",  "no_new_data",
      "setSignals" not in enl and "setEvidence" not in enl)
check("Raw artifacts: JSON.stringify read-only display", "no_new_data",
      "JSON.stringify(sig.evidence" in enl)
check("Raw artifacts: uses orderedSignals (existing)",   "no_new_data",
      "orderedSignals" in enl)
check("No new API routes added",                         "no_new_data",
      idx.count("api/execlens") == 1)

# ── css_present ───────────────────────────────────────────────────────────────

print("\n[css_present]")

css = read("app/execlens-demo/styles/globals.css")

check("globals.css PIOS-51.6R.4 block present",         "css_present",
      "PIOS-51.6R.4" in css)
check("globals.css .raw-artifacts-section",              "css_present",
      ".raw-artifacts-section" in css)
check("globals.css .raw-artifacts-toggle",               "css_present",
      ".raw-artifacts-toggle" in css)
check("globals.css .raw-artifact-data",                  "css_present",
      ".raw-artifact-data" in css)

# ── api_regression ────────────────────────────────────────────────────────────

print("\n[api_regression]")

for path, label in [
    ("/api/execlens?query=GQ-003",                   "query GQ-003"),
    ("/api/execlens?persona=ANALYST&query=GQ-003",   "persona ANALYST GQ-003"),
    ("/api/execlens?persona=CTO&query=GQ-003",       "persona CTO GQ-003"),
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

out_path = REPO_ROOT / "docs/pios/51.6R.4/validation_log_analyst_raw.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.6R.4", "validator": "validate_analyst_raw_access",
       "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
