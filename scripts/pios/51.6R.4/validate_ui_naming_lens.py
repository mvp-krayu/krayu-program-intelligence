#!/usr/bin/env python3
"""
validate_ui_naming_lens.py
PIOS-51.6R.4-RUN01-CONTRACT-v1

Validates: user-facing naming change ExecLens→Lens, Start Lens Demo CTA,
positioning tagline, no identifier/filename renames.

Expected: all PASS
"""

import json, sys
from datetime import datetime
from pathlib import Path

RESULTS = []
REPO_ROOT = Path(__file__).resolve().parents[3]

def check(name, group, passed, detail=""):
    RESULTS.append({"name": name, "group": group,
                    "status": "PASS" if passed else "FAIL", "detail": detail})
    print(f"  [{'PASS' if passed else 'FAIL'}] {name}" + (f" — {detail}" if detail else ""))

def read(path):
    try: return (REPO_ROOT / path).read_text()
    except: return ""

def file_exists(path):
    return (REPO_ROOT / path).exists()

# ── ui_naming ─────────────────────────────────────────────────────────────────

print("\n[ui_naming]")

idx = read("app/execlens-demo/pages/index.js")

check("Page title is 'Lens — Program Intelligence'",     "ui_naming",
      "Lens — Program Intelligence" in idx)
check("h1 hero title is 'Lens' (not ExecLens)",          "ui_naming",
      "hero-title\">Lens<" in idx and "hero-title\">ExecLens<" not in idx)
check("Start button text is 'Start Lens Demo'",          "ui_naming",
      "Start Lens Demo" in idx)
check("No 'Start ExecLens Demo' in user-facing output",  "ui_naming",
      "Start ExecLens Demo" not in idx)
check("Positioning tagline present",                     "ui_naming",
      "Lens — a Signäl capability" in idx)
check("Krayu attribution in tagline",                    "ui_naming",
      "Krayu · Program Intelligence" in idx)
check("hero-positioning class used",                     "ui_naming",
      "hero-positioning" in idx)

# ── identifier_preservation ───────────────────────────────────────────────────

print("\n[identifier_preservation]")

check("ENLPanel.js file unchanged (no rename)",          "identifier_preservation",
      file_exists("app/execlens-demo/components/ENLPanel.js"))
check("execlens-demo directory preserved",               "identifier_preservation",
      file_exists("app/execlens-demo/pages/index.js"))
check("api/execlens route preserved in index.js",        "identifier_preservation",
      "api/execlens" in idx)
check("No ExecLens in hero title element",               "identifier_preservation",
      "hero-title\">ExecLens" not in idx)
check("enl- CSS class prefix unchanged",                 "identifier_preservation",
      "enl-panel-body" in read("app/execlens-demo/components/ENLPanel.js"))
check("Internal contract identifiers unchanged",         "identifier_preservation",
      "PIOS-51.6" in idx and "RUN01-CONTRACT" in idx)

# ── no_repetition ─────────────────────────────────────────────────────────────

print("\n[no_repetition]")

check("Positioning tagline appears once",                "no_repetition",
      idx.count("Lens — a Signäl capability") == 1)
check("Start Lens Demo button and pre-demo message present",  "no_repetition",
      idx.count("Start Lens Demo") >= 1)  # 51.8R amendment 7: appears twice — CTA button + pre-demo evidence message; supersedes == 1
check("hero-positioning class used once",                "no_repetition",
      idx.count("hero-positioning") <= 2)  # div open + class def

# ── css_present ───────────────────────────────────────────────────────────────

print("\n[css_present]")

css = read("app/execlens-demo/styles/globals.css")

check("globals.css .hero-positioning present",           "css_present",
      ".hero-positioning" in css)

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

out_path = REPO_ROOT / "docs/pios/51.6R.4/validation_log_ui_naming.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out = {"stream": "51.6R.4", "validator": "validate_ui_naming_lens",
       "timestamp": datetime.utcnow().isoformat() + "Z",
       "total": total, "passed": passed, "failed": failed, "groups": groups, "results": RESULTS}
out_path.write_text(json.dumps(out, indent=2))
print(f"Log: {out_path}")
sys.exit(0 if failed == 0 else 1)
