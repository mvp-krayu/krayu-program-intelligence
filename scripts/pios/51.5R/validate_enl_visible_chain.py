#!/usr/bin/env python3
"""
validate_enl_visible_chain.py
PIOS-51.5R-RUN01-CONTRACT-v1

Validation: ENL Visible Chain Materialization Repair
Groups:
  source_structure    — component source checks
  chain_contract      — visible chain contract in ENLPanel.js
  persona_fields      — persona-focused field rules
  api_regression      — all certified routes still return 200
  persona_data        — live persona payload checks

Expected: all PASS
Output: docs/pios/51.5R/validation_log.json
"""

import json
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
    except Exception:
        return ""

def http_get(path):
    try:
        with urllib.request.urlopen(f"{BASE_URL}{path}", timeout=5) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, {}
    except Exception as e:
        return 0, {}

# ── source_structure ─────────────────────────────────────────────────────────

print("\n[source_structure]")

enl = read("app/execlens-demo/components/ENLPanel.js")
css = read("app/execlens-demo/styles/globals.css")
tp  = read("app/execlens-demo/components/TopologyPanel.js")  # 51.8R amendment 5: NavigationPanel relocated

check("ENLPanel.js has PIOS-51.5R contract header",    "source_structure", "PIOS-51.5R-RUN01-CONTRACT-v1" in enl)
check("ENLPanel.js imports NavigationPanel",           "source_structure", "import NavigationPanel" in tp)  # 51.8R amendment 5: NavigationPanel moved to TopologyPanel
check("ENLPanel.js exports ENLPanel function",         "source_structure", "export default function ENLPanel" in enl)
check("ENLPanel.js defines ENL_TRAVERSAL",             "source_structure", "const ENL_TRAVERSAL" in enl)
check("ENLPanel.js defines PERSONA_LENS_FOCUS",        "source_structure", "const PERSONA_LENS_FOCUS" in enl)
check("ENLPanel.js defines FIELD_LABEL",               "source_structure", "const FIELD_LABEL" in enl)
check("ENLPanel.js applyTraversalOrder present",       "source_structure", "function applyTraversalOrder" in enl)
check("ENLPanel.js ChainHeader component",             "source_structure", "function ChainHeader" in enl)
check("ENLPanel.js ChainBreadcrumb component",         "source_structure", "function ChainBreadcrumb" in enl)
check("ENLPanel.js ChainPrimaryField component",       "source_structure", "function ChainPrimaryField" in enl)
check("ENLPanel.js ChainStep component",               "source_structure", "function ChainStep" in enl)
check("ENLPanel.js NavigationPanel rendered last",     "source_structure", "NavigationPanel" in tp and "<details" in tp)  # 51.8R amendment 5: NavigationPanel rendered in TopologyPanel details toggle
check("globals.css PIOS-51.5R block present",          "source_structure", "PIOS-51.5R" in css)
check("globals.css .enl-chain-header",                 "source_structure", ".enl-chain-header" in css)
check("globals.css .enl-chain-step",                   "source_structure", ".enl-chain-step" in css)
check("globals.css .enl-chain-primary-field",          "source_structure", ".enl-chain-primary-field" in css)
check("globals.css .enl-step-number-col",              "source_structure", ".enl-step-number-col" in css)
check("globals.css .enl-step-connector",               "source_structure", ".enl-step-connector" in css)

# ── chain_contract ────────────────────────────────────────────────────────────

print("\n[chain_contract]")

check("ChainStep renders numbered step",               "chain_contract", "stepNum" in enl and "enl-step-num" in enl)
check("ChainStep entry marker present",                "chain_contract", "isEntry" in enl and "enl-chain-step-entry" in enl)
check("ChainStep entry marker text",                   "chain_contract", "▶ Entry" in enl)
check("ChainStep visual connector",                    "chain_contract", "enl-step-connector" in enl)
check("ChainHeader absent when no persona",            "chain_contract", "if (!persona) return null" in enl)
check("ChainBreadcrumb entry node distinguished",      "chain_contract", "enl-breadcrumb-entry" in enl)
check("ChainStep source row is secondary",             "chain_contract", "enl-step-source-row" in enl)
check("ChainPrimaryField handles evidence_chain segs", "chain_contract", "split('→')" in enl or "split(\"→\")" in enl)
check("ChainPrimaryField handles blocking_point",      "chain_contract", "blocking_point" in enl and "enl-chain-field-blocking" in enl)
check("applyTraversalOrder no sort",                   "chain_contract", "sort" not in enl.split("applyTraversalOrder")[1].split("function")[0])

# ── persona_fields ────────────────────────────────────────────────────────────

print("\n[persona_fields]")

check("PERSONA_LENS_FOCUS EXECUTIVE primary=business_impact", "persona_fields",
      "EXECUTIVE:" in enl and "business_impact" in enl)
check("PERSONA_LENS_FOCUS CTO primary=risk",                  "persona_fields",
      "CTO:" in enl and "'risk'" in enl)
check("PERSONA_LENS_FOCUS CTO secondary=evidence_chain",      "persona_fields",
      "'evidence_chain'" in enl)
check("PERSONA_LENS_FOCUS ANALYST primary=evidence_chain",    "persona_fields",
      "ANALYST:" in enl and "'evidence_chain'" in enl)
check("PERSONA_LENS_FOCUS ANALYST secondary=blocking_point",  "persona_fields",
      "'blocking_point'" in enl)
check("ChainPrimaryField business_impact reads signal.business_impact", "persona_fields",
      "signal.business_impact" in enl)
check("ChainPrimaryField risk reads signal.risk",             "persona_fields",
      "signal.risk" in enl)
check("ChainPrimaryField evidence_chain reads ev.evidence_chain", "persona_fields",
      "ev?.evidence_chain" in enl or "ev.evidence_chain" in enl)
check("ChainPrimaryField blocking_point reads ev.blocking_point", "persona_fields",
      "ev?.blocking_point" in enl or "ev.blocking_point" in enl)
check("No-persona fallback shows evidence_chain",             "persona_fields",
      "!focus" in enl and "evidence_chain" in enl)

# ── api_regression ─────────────────────────────────────────────────────────────

print("\n[api_regression]")

ROUTES = [
    ("/api/execlens?query=GQ-001",                   "query GQ-001"),
    ("/api/execlens?query=GQ-002",                   "query GQ-002"),
    ("/api/execlens?query=GQ-003",                   "query GQ-003"),
    ("/api/execlens?topology=true",                  "topology"),
    ("/api/execlens?status=true",                    "status"),
    ("/api/execlens?enl=GQ-001",                     "enl GQ-001"),
    ("/api/execlens?enl=GQ-003",                     "enl GQ-003"),
    ("/api/execlens?persona=EXECUTIVE&query=GQ-003", "persona EXECUTIVE GQ-003"),
    ("/api/execlens?persona=CTO&query=GQ-003",       "persona CTO GQ-003"),
    ("/api/execlens?persona=ANALYST&query=GQ-003",   "persona ANALYST GQ-003"),
    ("/api/execlens?persona=EXECUTIVE&query=GQ-001", "persona EXECUTIVE GQ-001"),
    ("/api/execlens?persona=CTO&query=GQ-002",       "persona CTO GQ-002"),
]

for path, label in ROUTES:
    code, _ = http_get(path)
    check(f"route: {label}", "api_regression", code == 200, f"HTTP {code}")

# ── persona_data ───────────────────────────────────────────────────────────────

print("\n[persona_data]")

for persona in ("EXECUTIVE", "CTO", "ANALYST"):
    code, data = http_get(f"/api/execlens?persona={persona}&query=GQ-003")
    check(f"{persona} GQ-003 returns 200",            "persona_data", code == 200)
    check(f"{persona} has enl_signals array",         "persona_data",
          isinstance(data.get("enl_signals"), list))
    check(f"{persona} has framing_label",             "persona_data",
          bool(data.get("framing_label")))
    check(f"{persona} has lens field",                "persona_data",
          bool(data.get("lens")))

# Check that business_impact / risk / evidence_chain fields exist in query payload
code2, qdata = http_get("/api/execlens?query=GQ-003")
sigs = qdata.get("signals", [])
if sigs:
    sig0 = sigs[0]
    check("query signal has business_impact field",   "persona_data", "business_impact" in sig0)
    check("query signal has risk field",              "persona_data", "risk" in sig0)
    check("query signal.evidence has evidence_chain", "persona_data",
          "evidence_chain" in sig0.get("evidence", {}))
    check("query signal.evidence has blocking_point", "persona_data",
          "blocking_point" in sig0.get("evidence", {}))
else:
    check("query GQ-003 signals present",             "persona_data", False, "no signals in payload")

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
    "stream":    "51.5R",
    "timestamp": datetime.utcnow().isoformat() + "Z",
    "total":     total,
    "passed":    passed,
    "failed":    failed,
    "groups":    groups,
    "results":   RESULTS,
}

out_path = REPO_ROOT / "docs/pios/51.5R/validation_log.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")

sys.exit(0 if failed == 0 else 1)
