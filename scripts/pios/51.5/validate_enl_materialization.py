#!/usr/bin/env python3
"""
validate_enl_materialization.py
PIOS-51.5-RUN01-CONTRACT-v1

Validation: ENL Materialization in Unified Demo Surface
Groups:
  source_structure    — component + index.js source checks
  api_regression      — all certified routes still return 200
  enl_traversal       — ENL traversal contracts in ENLPanel.js
  persona_lift        — persona callback lift checks

Expected: all PASS
Output: docs/pios/51.5/validation_log.json
"""

import json
import subprocess
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

RESULTS = []
BASE_URL = "http://localhost:3000"
REPO_ROOT = Path(__file__).resolve().parents[3]

def check(name, group, passed, detail=""):
    RESULTS.append({
        "name":   name,
        "group":  group,
        "status": "PASS" if passed else "FAIL",
        "detail": detail,
    })
    status = "PASS" if passed else "FAIL"
    print(f"  [{status}] {name}" + (f" — {detail}" if detail else ""))

def read(path):
    try:
        return (REPO_ROOT / path).read_text()
    except Exception as e:
        return ""

def http_get(path):
    try:
        with urllib.request.urlopen(f"{BASE_URL}{path}", timeout=5) as r:
            return r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 0, str(e)

# ── source_structure ─────────────────────────────────────────────────────────

print("\n[source_structure]")

enl = read("app/execlens-demo/components/ENLPanel.js")
pp  = read("app/execlens-demo/components/PersonaPanel.js")
idx = read("app/execlens-demo/pages/index.js")

check("ENLPanel.js has PIOS-51.5 contract header",    "source_structure", "PIOS-51.5-RUN01-CONTRACT-v1" in enl)
check("ENLPanel.js imports NavigationPanel",           "source_structure", "import NavigationPanel" in enl)
check("ENLPanel.js exports ENLPanel function",         "source_structure", "export default function ENLPanel" in enl)
check("ENLPanel.js accepts persona prop",              "source_structure", "persona," in enl or "{ signals, navigation, persona" in enl)
check("ENLPanel.js accepts personaData prop",          "source_structure", "personaData" in enl)
check("ENLPanel.js defines ENL_TRAVERSAL static rules","source_structure", "ENL_TRAVERSAL" in enl)
check("ENLPanel.js defines EXECUTIVE traversal",       "source_structure", "EXECUTIVE" in enl and "Impact-First" in enl)
check("ENLPanel.js defines CTO traversal",             "source_structure", "CTO" in enl and "Evidence-Grounded" in enl)
check("ENLPanel.js defines ANALYST traversal",         "source_structure", "ANALYST" in enl and "Gap-First" in enl)
check("ENLPanel.js applyTraversalOrder no computation","source_structure", "applyTraversalOrder" in enl and "enl_signals" in enl)
check("ENLPanel.js TraversalPath component",           "source_structure", "function TraversalPath" in enl)
check("ENLPanel.js TraversalEvidenceEntry component",  "source_structure", "function TraversalEvidenceEntry" in enl)
check("ENLPanel.js traversal-entry-point marker",      "source_structure", "traversal-entry-point" in enl and "traversal-entry-marker" in enl)

check("PersonaPanel.js has PIOS-51.5 contract header","source_structure", "PIOS-51.5-RUN01-CONTRACT-v1" in pp)
check("PersonaPanel.js onPersonaChange prop",         "source_structure", "onPersonaChange" in pp)
check("PersonaPanel.js onPersonaDataChange prop",     "source_structure", "onPersonaDataChange" in pp)
check("PersonaPanel.js calls onPersonaChange on reset","source_structure", "onPersonaChange?.(null)" in pp or "onPersonaChange(null)" in pp)
check("PersonaPanel.js calls onPersonaDataChange success","source_structure", "onPersonaDataChange?.(data)" in pp or "onPersonaDataChange(data)" in pp)

check("index.js has PIOS-51.5 contract header",       "source_structure", "PIOS-51.5-RUN01-CONTRACT-v1" in idx)
check("index.js enlPersona state",                    "source_structure", "enlPersona" in idx)
check("index.js enlPersonaData state",                "source_structure", "enlPersonaData" in idx)
check("index.js passes persona to ENLPanel",          "source_structure", "persona={enlPersona}" in idx)
check("index.js passes personaData to ENLPanel",      "source_structure", "personaData={enlPersonaData}" in idx)
check("index.js passes onPersonaChange to PersonaPanel","source_structure", "onPersonaChange={setEnlPersona}" in idx)
check("index.js passes onPersonaDataChange to PersonaPanel","source_structure", "onPersonaDataChange={setEnlPersonaData}" in idx)

css = read("app/execlens-demo/styles/globals.css")
check("globals.css has PIOS-51.5 block",              "source_structure", "PIOS-51.5" in css)
check("globals.css traversal-evidence-entry",         "source_structure", ".traversal-evidence-entry" in css)
check("globals.css enl-traversal-header",             "source_structure", ".enl-traversal-header" in css)
check("globals.css traversal-entry-point",            "source_structure", ".traversal-entry-point" in css)

# ── api_regression ───────────────────────────────────────────────────────────

print("\n[api_regression]")

ROUTES = [
    ("/api/execlens?query=GQ-001",                          "query GQ-001"),
    ("/api/execlens?query=GQ-002",                          "query GQ-002"),
    ("/api/execlens?query=GQ-003",                          "query GQ-003"),
    ("/api/execlens?topology=true",                         "topology"),
    ("/api/execlens?status=true",                           "status"),
    ("/api/execlens?enl=GQ-001",                            "enl GQ-001"),
    ("/api/execlens?enl=GQ-003",                            "enl GQ-003"),
    ("/api/execlens?persona=EXECUTIVE&query=GQ-003",        "persona EXECUTIVE GQ-003"),
    ("/api/execlens?persona=CTO&query=GQ-003",              "persona CTO GQ-003"),
    ("/api/execlens?persona=ANALYST&query=GQ-003",          "persona ANALYST GQ-003"),
    ("/api/execlens?persona=EXECUTIVE&query=GQ-001",        "persona EXECUTIVE GQ-001"),
    ("/api/execlens?persona=CTO&query=GQ-002",              "persona CTO GQ-002"),
]

for path, label in ROUTES:
    code, body = http_get(path)
    check(f"route: {label}", "api_regression", code == 200, f"HTTP {code}")

# ── enl_traversal ─────────────────────────────────────────────────────────────

print("\n[enl_traversal]")

check("ENL_TRAVERSAL has exactly 3 personas",         "enl_traversal", enl.count("'Impact-First") + enl.count('"Impact-First') >= 1 and "EXECUTIVE" in enl and "CTO" in enl and "ANALYST" in enl)
check("applyTraversalOrder returns input unchanged when no personaData", "enl_traversal", "return signals" in enl)
check("applyTraversalOrder uses enl_signals order (no sort)",           "enl_traversal", "enl_signals.map" in enl and "sort" not in enl.split("applyTraversalOrder")[1].split("function")[0])
check("ENLPanel renders NavigationPanel last",         "enl_traversal", enl.rfind("NavigationPanel") > enl.index("traversal-evidence-list"))
check("TraversalPath absent when no persona",          "enl_traversal", "if (!persona) return null" in enl)

# ── persona_lift ──────────────────────────────────────────────────────────────

print("\n[persona_lift]")

check("PersonaPanel resets persona on queryId change", "persona_lift", "setSelectedPersona(null)" in pp and "onPersonaChange?.(null)" in pp)
check("PersonaPanel resets personaData on queryId change", "persona_lift", "setPersonaData(null)" in pp and "onPersonaDataChange?.(null)" in pp)
check("PersonaPanel clears personaData at fetch start", "persona_lift", "setPersonaData(null)\n    onPersonaDataChange?.(null)" in pp or "onPersonaDataChange?.(null)" in pp)
check("PersonaPanel calls onPersonaChange on button click","persona_lift", "handlePersonaSelect" in pp and "onPersonaChange?." in pp)
check("PersonaPanel clears both on fetch error",       "persona_lift", "onPersonaChange?.(null)" in pp and pp.count("onPersonaChange?.(null)") >= 2)

# ── Summary ───────────────────────────────────────────────────────────────────

passed = sum(1 for r in RESULTS if r["status"] == "PASS")
failed = sum(1 for r in RESULTS if r["status"] == "FAIL")
total  = len(RESULTS)

print(f"\nResult: {passed}/{total} PASS")

groups = {}
for r in RESULTS:
    g = r["group"]
    if g not in groups:
        groups[g] = {"pass": 0, "fail": 0}
    if r["status"] == "PASS":
        groups[g]["pass"] += 1
    else:
        groups[g]["fail"] += 1

for g, c in groups.items():
    print(f"  {g}: {c['pass']}/{c['pass']+c['fail']}")

out = {
    "stream":    "51.5",
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "total":     total,
    "passed":    passed,
    "failed":    failed,
    "groups":    groups,
    "results":   RESULTS,
}

out_path = REPO_ROOT / "docs/pios/51.5/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")

sys.exit(0 if failed == 0 else 1)
