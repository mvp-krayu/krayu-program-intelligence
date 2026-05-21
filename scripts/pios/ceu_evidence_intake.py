#!/usr/bin/env python3
"""
ceu_evidence_intake.py
Contract: PI.SQO.CEU-RECONCILIATION-WORKFLOW.01

Documentation evidence intake for CEU candidate reconciliation.
Extracts structural evidence from the client's source repository and maps
it to CEU candidates, producing governed evidence anchors.

This script implements: "Evidence anchors" in the derivation sequence.
Structure suggests → Human validates → EVIDENCE ANCHORS →
  Compiler derives → Operator reviews → SQO qualifies.

Reads:
  clients/<client>/psee/runs/<run>/ceu/candidate_registry.json
  clients/<client>/psee/runs/<run>/intake/canonical_repo/  (source repository)

Writes:
  clients/<client>/psee/runs/<run>/ceu/evidence_anchors.json

Project type detection:
  DJANGO            — apps.py, models/, api/urls.py extractors
  PYTHON_PACKAGE    — setup.py, README, entry_points, cross-package deps

Evidence types extracted:
  APP_CONFIG        — Django AppConfig class definition
  MODULE_DOCSTRING  — Top-level module docstrings
  MODEL_INVENTORY   — Model class inventory per domain
  URL_NAMESPACE     — API URL namespace definitions
  OFFICIAL_DOCS     — Feature/model documentation matching domain
  MODEL_DOCS        — Per-model documentation pages
  SETUP_PY          — Python package setup.py metadata (name, description, entry_points, scripts)
  PACKAGE_README    — Package-level README content
  CROSS_PACKAGE_DEP — Internal cross-package dependencies (in-requirements.txt)
  REPO_README_MAP   — Repository-level README section mapping to domain

Usage:
    python3 scripts/pios/ceu_evidence_intake.py \\
        --client netbox \\
        --run-id run_github_netbox_20260520_134600

    --dry-run       Compute all results, log what would be written; no files written
    --report-only   Print detailed report; no files written
    --force         Overwrite existing evidence_anchors.json

RULE: No AI/LLM. All extraction is deterministic file reading.
RULE: Evidence is structural extraction, not semantic authoring.
RULE: CREATE_ONLY — abort if output file already exists (unless --force).
RULE: Deterministic — same source repository → same evidence anchors.
"""

from __future__ import annotations

import argparse
import ast
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

CONTRACT_ID = "PI.SQO.CEU-RECONCILIATION-WORKFLOW.01"
ARTIFACT_CLASS = "ceu_evidence_anchors"


def resolve_paths(client: str, run_id: str) -> dict:
    run_dir = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id
    return {
        "run_dir": run_dir,
        "candidate_registry": run_dir / "ceu" / "candidate_registry.json",
        "source_repo": run_dir / "intake" / "canonical_repo",
        "output_dir": run_dir / "ceu",
        "evidence_anchors": run_dir / "ceu" / "evidence_anchors.json",
    }


def load_json(path: Path) -> dict | None:
    if not path.is_file():
        return None
    with open(path) as f:
        return json.load(f)


def find_source_root(source_repo: Path) -> str | None:
    """Detect the source root prefix within the repository."""
    source_inv = source_repo.parent.parent / "intake" / "source_inventory.json"
    if source_inv != source_repo.parent / "source_inventory.json":
        source_inv = source_repo.parent / "source_inventory.json"
    inv = load_json(source_inv)
    if inv and "source_root" in inv:
        return inv["source_root"]
    for candidate in ["netbox", "st2", "src", "lib"]:
        if (source_repo / candidate).is_dir():
            return candidate
    return None


def extract_app_config(domain_path: Path) -> dict | None:
    """Extract Django AppConfig from apps.py."""
    apps_file = domain_path / "apps.py"
    if not apps_file.is_file():
        return None

    content = apps_file.read_text(errors="replace")
    result = {
        "source_path": str(apps_file),
        "evidence_type": "APP_CONFIG",
    }

    name_match = re.search(r'''name\s*=\s*['"]([^'"]+)['"]''', content)
    verbose_match = re.search(r'''verbose_name\s*=\s*['"]([^'"]+)['"]''', content)
    class_match = re.search(r'class\s+(\w+)\(AppConfig\)', content)

    if class_match:
        result["config_class"] = class_match.group(1)
    if name_match:
        result["app_name"] = name_match.group(1)
    if verbose_match:
        result["verbose_name"] = verbose_match.group(1)

    if name_match or class_match:
        return result
    return None


def extract_module_docstring(domain_path: Path) -> dict | None:
    """Extract module-level docstring from __init__.py."""
    init_file = domain_path / "__init__.py"
    if not init_file.is_file():
        return None

    content = init_file.read_text(errors="replace").strip()
    if not content:
        return None

    try:
        tree = ast.parse(content)
        docstring = ast.get_docstring(tree)
        if docstring:
            return {
                "source_path": str(init_file),
                "evidence_type": "MODULE_DOCSTRING",
                "content": docstring.strip(),
            }
    except SyntaxError:
        pass
    return None


def extract_model_inventory(domain_path: Path) -> dict | None:
    """Extract model class names from models/ directory."""
    models_dir = domain_path / "models"
    if not models_dir.is_dir():
        models_file = domain_path / "models.py"
        if models_file.is_file():
            models_dir = None
            model_files = [models_file]
        else:
            return None
    else:
        model_files = sorted(models_dir.glob("*.py"))

    models_found = []
    for mf in model_files:
        if mf.name == "__init__.py":
            continue
        content = mf.read_text(errors="replace")
        for match in re.finditer(r'class\s+(\w+)\(.*Model.*\)', content):
            models_found.append({
                "class_name": match.group(1),
                "source_file": mf.name,
            })

    if not models_found:
        return None

    return {
        "source_path": str(models_dir or model_files[0]),
        "evidence_type": "MODEL_INVENTORY",
        "model_count": len(models_found),
        "models": models_found,
    }


def extract_url_namespace(domain_path: Path) -> dict | None:
    """Extract API URL namespace from api/urls.py."""
    urls_file = domain_path / "api" / "urls.py"
    if not urls_file.is_file():
        return None

    content = urls_file.read_text(errors="replace")
    result = {
        "source_path": str(urls_file),
        "evidence_type": "URL_NAMESPACE",
    }

    ns_match = re.search(r'''app_name\s*=\s*['"]([^'"]+)['"]''', content)
    if ns_match:
        result["app_name"] = ns_match.group(1)

    router_entries = re.findall(r'''router\.register\(\s*['"]([^'"]+)['"]''', content)
    if router_entries:
        result["endpoints"] = router_entries
        result["endpoint_count"] = len(router_entries)

    if ns_match or router_entries:
        return result
    return None


def extract_official_docs(docs_dir: Path, domain: str) -> list[dict]:
    """Extract official documentation matching domain name."""
    anchors = []

    features_dir = docs_dir / "features"
    if features_dir.is_dir():
        for doc_file in sorted(features_dir.glob("*.md")):
            if domain.lower() in doc_file.stem.lower().replace("-", "").replace("_", ""):
                content = doc_file.read_text(errors="replace")
                heading = ""
                for line in content.split("\n"):
                    if line.startswith("# "):
                        heading = line[2:].strip()
                        break
                first_para = ""
                in_para = False
                for line in content.split("\n"):
                    if line.startswith("# "):
                        in_para = True
                        continue
                    if in_para and line.strip() and not line.startswith("#") and not line.startswith("```"):
                        first_para = line.strip()
                        break

                anchors.append({
                    "source_path": str(doc_file),
                    "evidence_type": "OFFICIAL_DOCS",
                    "doc_section": "features",
                    "heading": heading,
                    "summary": first_para[:300] if first_para else "",
                })

    models_docs_dir = docs_dir / "models" / domain
    if models_docs_dir.is_dir():
        model_doc_files = sorted(models_docs_dir.glob("*.md"))
        if model_doc_files:
            model_names = [f.stem for f in model_doc_files]
            anchors.append({
                "source_path": str(models_docs_dir),
                "evidence_type": "MODEL_DOCS",
                "doc_section": "models",
                "documented_models": model_names,
                "documented_model_count": len(model_names),
            })

    return anchors


# ---------------------------------------------------------------------------
# Generic Python package extractors
# ---------------------------------------------------------------------------

def detect_project_type(source_repo: Path) -> str:
    """Detect project type from repository structure."""
    for subdir in source_repo.iterdir():
        if subdir.is_dir() and (subdir / "apps.py").is_file():
            return "DJANGO"
        inner = subdir / subdir.name
        if subdir.is_dir() and inner.is_dir() and (inner / "apps.py").is_file():
            return "DJANGO"
    setup_count = sum(1 for d in source_repo.iterdir()
                      if d.is_dir() and (d / "setup.py").is_file())
    if setup_count >= 2:
        return "PYTHON_PACKAGE"
    if (source_repo / "setup.py").is_file() or (source_repo / "pyproject.toml").is_file():
        return "PYTHON_PACKAGE"
    return "UNKNOWN"


def extract_setup_py(domain_path: Path) -> dict | None:
    """Extract metadata from setup.py (name, description, entry_points, scripts)."""
    setup_file = domain_path / "setup.py"
    if not setup_file.is_file():
        return None

    content = setup_file.read_text(errors="replace")
    result = {
        "source_path": str(setup_file),
        "evidence_type": "SETUP_PY",
    }

    name_match = re.search(
        r'''name\s*=\s*(?:ST2_COMPONENT|['"]([^'"]+)['"])''', content
    )
    st2_comp = re.search(r'''ST2_COMPONENT\s*=\s*['"]([^'"]+)['"]''', content)
    if st2_comp:
        result["package_name"] = st2_comp.group(1)
    elif name_match and name_match.group(1):
        result["package_name"] = name_match.group(1)

    desc_match = re.search(
        r'''description\s*=\s*(?:\(\s*)?['"](.+?)['"]''',
        content, re.DOTALL,
    )
    desc_format = re.search(
        r'''description\s*=\s*['"]\{[^}]*\}[^'"]*['"]\.format''', content
    )
    if desc_match:
        desc = desc_match.group(1).strip()
        desc = re.sub(r'\s+', ' ', desc)
        if desc_format and result.get("package_name"):
            desc = desc.replace("{}", result["package_name"])
            desc = re.sub(r'\{ST2_COMPONENT\}', result.get("package_name", ""), desc)
        result["description"] = desc[:500]

    entry_blocks = re.findall(
        r'''['"]([^'"]+)['"]\s*:\s*\[([^\]]*)\]''',
        content.split("entry_points")[1] if "entry_points" in content else "",
    )
    if entry_blocks:
        ep = {}
        for group, items in entry_blocks:
            entries = re.findall(r'''['"]([^'"]+)['"]''', items)
            if entries:
                ep[group] = entries
        if ep:
            result["entry_points"] = ep

    scripts_match = re.search(r'scripts\s*=\s*\[([^\]]*)\]', content, re.DOTALL)
    if scripts_match:
        scripts = re.findall(r'''['"]([^'"]+)['"]''', scripts_match.group(1))
        if scripts:
            result["scripts"] = [s.split("/")[-1] for s in scripts]
            result["script_count"] = len(scripts)

    find_pkg = re.search(r'find_packages\(', content)
    if find_pkg:
        result["uses_find_packages"] = True

    if len(result) > 2:
        return result
    return None


def extract_package_readme(domain_path: Path) -> dict | None:
    """Extract README content from a package directory."""
    for name in ["README.md", "README.rst", "README.txt", "README"]:
        readme = domain_path / name
        if readme.is_file():
            content = readme.read_text(errors="replace")
            lines = content.strip().split("\n")
            heading = ""
            first_para = ""
            for line in lines:
                stripped = line.strip()
                if not heading and stripped and not stripped.startswith(("[![", "![", "---", "===")):
                    if stripped.startswith("# "):
                        heading = stripped[2:].strip()
                    elif len(lines) > 1 and lines[lines.index(line) + 1].strip().startswith(("===", "---")):
                        heading = stripped
                    else:
                        heading = stripped
                    continue
                if heading and stripped and not stripped.startswith(("#", "[![", "![", "---", "===")):
                    first_para = stripped
                    break

            return {
                "source_path": str(readme),
                "evidence_type": "PACKAGE_README",
                "format": name.split(".")[-1] if "." in name else "txt",
                "heading": heading[:200],
                "summary": first_para[:500],
                "line_count": len(lines),
            }
    return None


def extract_cross_package_deps(domain_path: Path, all_domains: list[str]) -> dict | None:
    """Extract internal cross-package dependencies from in-requirements.txt."""
    req_file = domain_path / "in-requirements.txt"
    if not req_file.is_file():
        return None

    content = req_file.read_text(errors="replace")
    lines = [l.strip() for l in content.split("\n")
             if l.strip() and not l.strip().startswith("#")]

    internal_deps = []
    external_deps = []
    for line in lines:
        pkg_name = re.split(r'[@>=<!\[; ]', line)[0].strip().lower()
        is_internal = False
        for domain in all_domains:
            if pkg_name == domain.lower() or pkg_name.replace("-", "") == domain.lower().replace("-", ""):
                internal_deps.append({
                    "package": pkg_name,
                    "domain": domain,
                    "spec": line,
                })
                is_internal = True
                break
            if pkg_name.startswith(domain.lower().split("/")[0][:3]):
                git_match = re.search(r'git\+https?://github\.com/\S+', line)
                if git_match:
                    internal_deps.append({
                        "package": pkg_name,
                        "spec": line,
                        "external_repo": True,
                    })
                    is_internal = True
                    break
        if not is_internal:
            external_deps.append(pkg_name)

    if not internal_deps and not external_deps:
        return None

    return {
        "source_path": str(req_file),
        "evidence_type": "CROSS_PACKAGE_DEP",
        "internal_dependencies": internal_deps,
        "internal_dep_count": len(internal_deps),
        "external_dep_count": len(external_deps),
        "total_deps": len(internal_deps) + len(external_deps),
    }


def extract_repo_readme_mapping(source_repo: Path, domain: str) -> dict | None:
    """Map repository-level README sections to a domain name."""
    for name in ["README.md", "README.rst"]:
        readme = source_repo / name
        if readme.is_file():
            content = readme.read_text(errors="replace")
            domain_lower = domain.lower().replace("_", "").replace("-", "")

            sections = []
            current_heading = None
            current_content = []
            for line in content.split("\n"):
                if line.startswith("# ") or line.startswith("## ") or line.startswith("### "):
                    if current_heading:
                        text = " ".join(current_content).strip()
                        heading_clean = current_heading.lower().replace(" ", "").replace("-", "").replace("_", "")
                        if domain_lower in heading_clean or domain_lower in text.lower().replace(" ", "")[:200]:
                            sections.append({
                                "heading": current_heading,
                                "summary": text[:300] if text else "",
                            })
                    hashes = len(line.split(" ")[0])
                    current_heading = line.lstrip("#").strip()
                    current_content = []
                elif line.startswith("* **") or line.startswith("- **"):
                    bold_match = re.match(r'[*-]\s+\*\*([^*]+)\*\*\s*(.*)', line)
                    if bold_match:
                        term = bold_match.group(1).lower().replace(" ", "").replace("-", "")
                        if domain_lower in term or term in domain_lower:
                            desc = bold_match.group(2).strip(" -–—")
                            sections.append({
                                "heading": f"{current_heading} > {bold_match.group(1)}",
                                "summary": desc[:300] if desc else "",
                                "match_type": "inline_definition",
                            })
                        current_content.append(line)
                else:
                    current_content.append(line)

            if current_heading:
                text = " ".join(current_content).strip()
                heading_clean = current_heading.lower().replace(" ", "").replace("-", "").replace("_", "")
                if domain_lower in heading_clean or domain_lower in text.lower().replace(" ", "")[:200]:
                    sections.append({
                        "heading": current_heading,
                        "summary": text[:300] if text else "",
                    })

            if sections:
                return {
                    "source_path": str(readme),
                    "evidence_type": "REPO_README_MAP",
                    "matched_sections": sections,
                    "section_count": len(sections),
                }
    return None


DOMAIN_DOC_ALIASES = {
    "dcim": ["dcim", "devices-cabling", "facilities", "power-tracking"],
    "ipam": ["ipam", "vlan-management"],
    "circuits": ["circuits"],
    "virtualization": ["virtualization"],
    "vpn": ["vpn-tunnels", "l2vpn-overlay"],
    "wireless": ["wireless"],
    "tenancy": ["tenancy", "resource-ownership", "contacts"],
    "extras": ["customization", "event-rules", "journaling", "context-data",
               "configuration-rendering", "notifications", "search"],
    "core": ["background-jobs", "synchronized-data", "change-logging"],
    "users": ["authentication-permissions", "user-preferences"],
}


def extract_aliased_docs(docs_dir: Path, domain: str) -> list[dict]:
    """Extract docs that map to a domain via known aliases."""
    aliases = DOMAIN_DOC_ALIASES.get(domain, [])
    anchors = []
    features_dir = docs_dir / "features"
    if not features_dir.is_dir():
        return anchors

    for alias in aliases:
        doc_file = features_dir / f"{alias}.md"
        if doc_file.is_file():
            content = doc_file.read_text(errors="replace")
            heading = ""
            first_para = ""
            in_para = False
            for line in content.split("\n"):
                if line.startswith("# ") and not heading:
                    heading = line[2:].strip()
                    in_para = True
                    continue
                if in_para and line.strip() and not line.startswith("#") and not line.startswith("```"):
                    first_para = line.strip()
                    break

            already = any(a["source_path"] == str(doc_file) for a in anchors)
            if not already:
                anchors.append({
                    "source_path": str(doc_file),
                    "evidence_type": "OFFICIAL_DOCS",
                    "doc_section": "features",
                    "heading": heading,
                    "summary": first_para[:300] if first_para else "",
                    "alias_mapping": alias,
                })

    return anchors


def build_evidence_anchors(
    candidate_registry: dict,
    source_repo: Path,
) -> dict:
    """Build evidence anchors for all CEU candidates."""

    candidates = candidate_registry.get("candidates", [])
    source_root_name = None

    for candidate in candidates:
        domain = candidate.get("domain", "")
        domain_path = source_repo / domain
        if not domain_path.is_dir():
            for subdir in source_repo.iterdir():
                if subdir.is_dir() and (subdir / domain).is_dir():
                    source_root_name = subdir.name
                    break
            break

    if source_root_name:
        effective_root = source_repo / source_root_name
    else:
        effective_root = source_repo

    project_type = detect_project_type(effective_root)
    docs_dir = source_repo / "docs"
    all_domains = [c.get("domain", "") for c in candidates]

    anchors = []
    anchor_id = 0
    domain_summary = {}

    def append_anchor(evidence: dict, ceu_id: str, domain: str, domain_anchors: list):
        nonlocal anchor_id
        anchor_id += 1
        evidence["anchor_id"] = f"EA-{anchor_id:04d}"
        evidence["ceu_id"] = ceu_id
        evidence["domain"] = domain
        domain_anchors.append(evidence)

    for candidate in candidates:
        domain = candidate.get("domain", "")
        ceu_id = candidate.get("ceu_id", "")
        domain_path = effective_root / domain
        domain_anchors = []

        if project_type == "DJANGO":
            app_config = extract_app_config(domain_path)
            if app_config:
                append_anchor(app_config, ceu_id, domain, domain_anchors)

            module_doc = extract_module_docstring(domain_path)
            if module_doc:
                append_anchor(module_doc, ceu_id, domain, domain_anchors)

            model_inv = extract_model_inventory(domain_path)
            if model_inv:
                append_anchor(model_inv, ceu_id, domain, domain_anchors)

            url_ns = extract_url_namespace(domain_path)
            if url_ns:
                append_anchor(url_ns, ceu_id, domain, domain_anchors)

            official = extract_official_docs(docs_dir, domain)
            for doc in official:
                append_anchor(doc, ceu_id, domain, domain_anchors)

            aliased = extract_aliased_docs(docs_dir, domain)
            for doc in aliased:
                existing_paths = {a["source_path"] for a in domain_anchors}
                if doc["source_path"] not in existing_paths:
                    append_anchor(doc, ceu_id, domain, domain_anchors)

        if project_type in ("PYTHON_PACKAGE", "UNKNOWN"):
            setup = extract_setup_py(domain_path)
            if setup:
                append_anchor(setup, ceu_id, domain, domain_anchors)

            readme = extract_package_readme(domain_path)
            if readme:
                append_anchor(readme, ceu_id, domain, domain_anchors)

            cross_deps = extract_cross_package_deps(domain_path, all_domains)
            if cross_deps:
                append_anchor(cross_deps, ceu_id, domain, domain_anchors)

            repo_map = extract_repo_readme_mapping(source_repo, domain)
            if repo_map:
                append_anchor(repo_map, ceu_id, domain, domain_anchors)

        module_doc = extract_module_docstring(domain_path)
        if module_doc and not any(a["evidence_type"] == "MODULE_DOCSTRING" for a in domain_anchors):
            append_anchor(module_doc, ceu_id, domain, domain_anchors)

        anchors.extend(domain_anchors)
        type_counts = {}
        for a in domain_anchors:
            t = a["evidence_type"]
            type_counts[t] = type_counts.get(t, 0) + 1
        domain_summary[ceu_id] = {
            "domain": domain,
            "total_anchors": len(domain_anchors),
            "evidence_types": type_counts,
        }

    return {
        "contract_id": CONTRACT_ID,
        "artifact_class": ARTIFACT_CLASS,
        "client_id": candidate_registry.get("client_id", "unknown"),
        "run_id": candidate_registry.get("run_id", "unknown"),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_repository": str(source_repo),
        "effective_source_root": str(effective_root),
        "project_type": project_type,
        "total_anchors": len(anchors),
        "candidate_count": len(candidates),
        "domain_summary": domain_summary,
        "anchors": anchors,
        "governance": {
            "extraction_method": "DETERMINISTIC_FILE_READING",
            "no_semantic_authoring": True,
            "no_ai_llm": True,
            "replayable": True,
        },
    }


def print_report(evidence: dict):
    print("=" * 72)
    print("  CEU EVIDENCE INTAKE REPORT")
    print("=" * 72)
    print(f"  Client:     {evidence['client_id']}")
    print(f"  Run:        {evidence['run_id']}")
    print(f"  Candidates: {evidence['candidate_count']}")
    print(f"  Anchors:    {evidence['total_anchors']}")
    print()
    print("-" * 72)
    print("  EVIDENCE PER CANDIDATE")
    print("-" * 72)
    print(f"{'CEU ID':<20} {'Domain':<20} {'Anchors':>8}  Evidence Types")
    print("-" * 90)
    for ceu_id, info in evidence["domain_summary"].items():
        types_str = ", ".join(f"{k}={v}" for k, v in info["evidence_types"].items())
        print(f"{ceu_id:<20} {info['domain']:<20} {info['total_anchors']:>8}  {types_str}")

    print()
    print("-" * 72)
    print("  EVIDENCE TYPE DISTRIBUTION")
    print("-" * 72)
    type_totals = {}
    for anchor in evidence["anchors"]:
        t = anchor["evidence_type"]
        type_totals[t] = type_totals.get(t, 0) + 1
    for t, count in sorted(type_totals.items(), key=lambda x: -x[1]):
        print(f"  {t:<25} {count}")

    gaps = []
    project_type = evidence.get("project_type", "UNKNOWN")
    for ceu_id, info in evidence["domain_summary"].items():
        if info["total_anchors"] == 0:
            gaps.append(ceu_id)
        elif project_type == "DJANGO":
            if "APP_CONFIG" not in info["evidence_types"] and "MODULE_DOCSTRING" not in info["evidence_types"]:
                gaps.append(f"{ceu_id} (no app_config or docstring)")
        elif project_type == "PYTHON_PACKAGE":
            if "SETUP_PY" not in info["evidence_types"] and "PACKAGE_README" not in info["evidence_types"]:
                gaps.append(f"{ceu_id} (no setup.py or readme)")
    if gaps:
        print()
        print("-" * 72)
        print("  EVIDENCE GAPS")
        print("-" * 72)
        for g in gaps:
            print(f"  ⚠  {g}")

    print()


def main():
    parser = argparse.ArgumentParser(description="CEU Evidence Intake")
    parser.add_argument("--client", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--report-only", action="store_true")
    parser.add_argument("--force", action="store_true",
                        help="Overwrite existing evidence_anchors.json")
    args = parser.parse_args()

    paths = resolve_paths(args.client, args.run_id)

    if not paths["run_dir"].is_dir():
        print(f"FAIL: Run directory not found: {paths['run_dir']}", file=sys.stderr)
        sys.exit(1)

    candidate_registry = load_json(paths["candidate_registry"])
    if not candidate_registry:
        print(f"FAIL: candidate_registry.json not found: {paths['candidate_registry']}", file=sys.stderr)
        sys.exit(1)

    if not paths["source_repo"].is_dir():
        print(f"FAIL: Source repository not found: {paths['source_repo']}", file=sys.stderr)
        sys.exit(1)

    print(f"CEU Evidence Intake ({ARTIFACT_CLASS})")
    print(f"  Client: {args.client}")
    print(f"  Run:    {args.run_id}")
    print(f"  Source: candidate_registry ({candidate_registry.get('candidate_count', 0)} candidates)")
    print(f"  Repo:   {paths['source_repo']}")

    evidence = build_evidence_anchors(candidate_registry, paths["source_repo"])

    print_report(evidence)

    if args.report_only or args.dry_run:
        if args.dry_run:
            print(f"  DRY RUN — would write: {paths['evidence_anchors']}")
        return

    if paths["evidence_anchors"].is_file() and not args.force:
        print(f"FAIL: Output already exists (CREATE_ONLY): {paths['evidence_anchors']}", file=sys.stderr)
        print(f"  Use --force to overwrite", file=sys.stderr)
        sys.exit(1)

    paths["output_dir"].mkdir(parents=True, exist_ok=True)
    with open(paths["evidence_anchors"], "w") as f:
        json.dump(evidence, f, indent=2)
    overwritten = " (overwritten)" if args.force and paths["evidence_anchors"].is_file() else ""
    print(f"  evidence_anchors.json written{overwritten}: {paths['evidence_anchors'].relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
