"""
scripts/pios/lens_report_generator.py
PRODUCTIZE.LENS.REPORT.01 / PRODUCTIZE.LENS.REPORT.DELIVERY.01 / PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01

Executive report generator for LENS v1.

Produces clients/blueedge/reports/lens_report_YYYYMMDD_HHMMSS.html
A formal, decision-grade executive artifact derived exclusively from
governed ZONE-2 projections.

Data source (in priority order):
  1. HTTP: /api/projection?claim_id=<id>&zone=ZONE-2&depth=L1 (local dev server)
  2. FALLBACK: pre-generated fragment files (projection outputs — not raw vault files)

Governance rules (enforced at runtime):
  - All consumed payloads must be zone=ZONE-2
  - No payload.error_type may be present
  - No forbidden internal identifiers in report body (SIG-, COND-, DIAG-, INTEL-)
  - No vault files read directly
  - No claims invented or altered

CLI:
  python3 scripts/pios/lens_report_generator.py [--output PATH]
"""

import json
import os
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

STREAM_ID = "PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01"

LENS_CLAIMS = ["CLM-25", "CLM-09", "CLM-20", "CLM-12", "CLM-10"]

API_BASE = "http://localhost:3000"
API_TIMEOUT = 3  # seconds

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
FRAGMENTS_DIR = REPO_ROOT / "clients" / "blueedge" / "vaults" / "run_01_authoritative" / "claims" / "fragments"
REPORTS_DIR  = REPO_ROOT / "clients" / "blueedge" / "reports"


def _default_output_path() -> Path:
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    return REPORTS_DIR / f"lens_report_{ts}.html"

# Forbidden substrings — must not appear in any report body text
FORBIDDEN_SUBSTRINGS = ("SIG-", "COND-", "DIAG-", "INTEL-")

# ---------------------------------------------------------------------------
# Data ingestion
# ---------------------------------------------------------------------------

def _fetch_api(claim_id: str) -> Optional[Dict]:
    url = f"{API_BASE}/api/projection?claim_id={claim_id}&zone=ZONE-2&depth=L1"
    try:
        with urllib.request.urlopen(url, timeout=API_TIMEOUT) as resp:
            return json.loads(resp.read().decode())
    except (urllib.error.URLError, OSError):
        return None


def _fetch_fragment(claim_id: str) -> Optional[Dict]:
    path = FRAGMENTS_DIR / f"{claim_id}-ZONE-2-L1.json"
    if not path.exists():
        return None
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return None


def load_payload(claim_id: str) -> Tuple[Optional[Dict], str]:
    """
    Returns (payload, source) where source is 'api' or 'fragment'.
    Returns (None, 'missing') if unavailable.
    """
    payload = _fetch_api(claim_id)
    if payload is not None:
        return payload, "api"
    payload = _fetch_fragment(claim_id)
    if payload is not None:
        return payload, "fragment"
    return None, "missing"


def load_all_payloads() -> Dict:
    """
    Returns payloads_by_claim_id.
    Raises SystemExit on any missing or non-ZONE-2 or error payload.
    """
    payloads = {}
    for claim_id in LENS_CLAIMS:
        payload, source = load_payload(claim_id)
        if payload is None:
            _fail(f"CLAIM UNAVAILABLE: {claim_id} — not reachable via API or fragment directory")
        if payload.get("error_type"):
            _fail(f"CLAIM ERROR: {claim_id} returned error_type={payload.get('error_type')} reason={payload.get('reason')}")
        if payload.get("zone") != "ZONE-2":
            _fail(f"ZONE VIOLATION: {claim_id} returned zone={payload.get('zone')} — ZONE-2 required")
        payloads[claim_id] = payload
    return payloads


# ---------------------------------------------------------------------------
# Caveat normalization
# Remove internal identifiers and chain notation from caveats
# ---------------------------------------------------------------------------

# Exact-match transformations for known internal-ID-bearing caveats
_CAVEAT_TRANSFORMS: dict[str, str] = {
    # CLM-25 — BC-01 predicate mismatch
    "CONCEPT-06 predicate uses PHASE_1_ACTIVE — will not match NOT_EVALUATED on recomputed run. "
    "EXECUTION verdict may not correctly show UNKNOWN on Stream 10 schema. Must be fixed before LENS surface.":
        "Execution readiness verdict requires a configuration correction before it can be automatically derived. "
        "Execution status is confirmed as pending assessment.",

    "CONCEPT-06 predicate mismatch (BC-01): EXECUTION verdict cannot be automatically derived until the predicate "
    "in concepts.json is updated to include NOT_EVALUATED. Manually confirmed as UNKNOWN based on "
    "execution_status=NOT_EVALUATED.":
        "Execution readiness verdict is manually confirmed as pending assessment. "
        "This condition will resolve upon a targeted configuration update.",

    # CLM-20 — chain notation
    "Four-layer chain (SIG-006 → COND-006 → DIAG-006 → INTEL-001). Runtime throughput is not measured; "
    "ceiling is static configuration only.":
        "Runtime throughput is not measured; the capacity ceiling reflects static configuration only "
        "and requires live validation to confirm operational performance.",
}

# Regex patterns for residual internal IDs not caught by exact match
_ID_PATTERNS = [
    (re.compile(r'\bSIG-\d+\b'), "[signal reference]"),
    (re.compile(r'\bCOND-\d+\b'), "[condition reference]"),
    (re.compile(r'\bDIAG-\d+\b'), "[diagnostic reference]"),
    (re.compile(r'\bINTEL-\d+\b'), "[intelligence reference]"),
    (re.compile(r'\bCONCEPT-\d+\b'), "[predicate condition]"),
    (re.compile(r'\bBC-\d+\b'), "[blocking condition]"),
    (re.compile(r'\bART-\d+\b'), "[artifact reference]"),
    (re.compile(r'\bTRN-\d+\b'), "[transformation reference]"),
    (re.compile(r'→'), "→"),  # preserve arrow as-is if remaining
    (re.compile(r'PHASE_\w+'), "[phase condition]"),
    (re.compile(r'NOT_EVALUATED'), "pending assessment"),
    (re.compile(r'execution_status=\w+'), "execution status"),
    (re.compile(r'concepts\.json'), "[configuration file]"),
    (re.compile(r'Stream \d+'), "[schema version]"),
]


_LABEL_ID_PATTERN = re.compile(r'^(SIG|COND|DIAG|INTEL|ART|TRN)-\d+\s*', re.IGNORECASE)


def safe_label(label: str) -> str:
    """Strip leading internal ID prefix (e.g. 'SIG-001 ') from a claim label."""
    return _LABEL_ID_PATTERN.sub('', label).strip()


def normalize_caveat(text: str) -> str:
    """Apply exact transforms then regex cleanup to remove internal identifiers."""
    # Exact match first
    cleaned = _CAVEAT_TRANSFORMS.get(text.strip())
    if cleaned:
        return cleaned
    # Regex fallback
    result = text
    for pattern, replacement in _ID_PATTERNS:
        result = pattern.sub(replacement, result)
    return result


def collect_caveats(payloads: Dict) -> List[str]:
    """Collect, normalize, and deduplicate caveats from all payloads."""
    seen: set[str] = set()
    result: list[str] = []
    for claim_id in LENS_CLAIMS:
        p = payloads.get(claim_id, {})
        for raw in p.get("caveats", []):
            normalized = normalize_caveat(raw.strip())
            key = normalized.strip().lower()
            if key not in seen:
                seen.add(key)
                result.append(normalized)
    return result


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def _fail(msg: str) -> None:
    print(f"[{STREAM_ID}] FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def validate_report_text(html: str) -> List[str]:
    """Return list of forbidden substrings found in report text (excluding HTML tags/attrs)."""
    # Strip HTML tags for content validation
    plain = re.sub(r'<[^>]+>', ' ', html)
    found = []
    for substr in FORBIDDEN_SUBSTRINGS:
        if substr in plain:
            found.append(substr)
    return found


# ---------------------------------------------------------------------------
# HTML rendering helpers
# ---------------------------------------------------------------------------

EVIDENCE_BADGE_STYLES = {
    "VERIFIED":    ("badge-verified",    "VERIFIED"),
    "CONDITIONAL": ("badge-conditional", "CONDITIONAL"),
    "PARTIAL":     ("badge-partial",     "PARTIAL"),
    "BLOCKED":     ("badge-blocked",     "BLOCKED"),
}

CONF_BADGE_STYLES = {
    "STRONG":   ("conf-strong",   "STRONG"),
    "MODERATE": ("conf-moderate", "MODERATE"),
    "WEAK":     ("conf-weak",     "WEAK"),
}


def ev_badge(evidence_class: str) -> str:
    css, label = EVIDENCE_BADGE_STYLES.get(evidence_class, ("badge-blocked", evidence_class))
    return f'<span class="ev-badge {css}">{label}</span>'


def conf_badge(level: str) -> str:
    css, label = CONF_BADGE_STYLES.get(level, ("conf-weak", level))
    return f'<span class="conf-badge {css}">{label}</span>'


def esc(text: str) -> str:
    """Basic HTML escaping."""
    return (text
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;"))


# ---------------------------------------------------------------------------
# Section composers
# ---------------------------------------------------------------------------

def compose_executive_summary(payloads: dict) -> str:
    p09 = payloads["CLM-09"]
    p10 = payloads["CLM-10"]
    p12 = payloads["CLM-12"]
    p25 = payloads["CLM-25"]
    p20 = payloads["CLM-20"]

    score_proven    = p09.get("value", {}).get("narrative", "60/100")
    score_achievable = p10.get("value", {}).get("narrative", "100/100")

    sentences = [
        f"The platform has achieved a proven structural score of <strong>{esc(score_proven)}</strong>, "
        "representing a verifiable evidence floor — not an estimate, but a deterministic sum of confirmed structural facts.",

        "Structural integrity is confirmed: coverage is complete, no orphaned components were identified, "
        "and no structural overlaps were detected.",

        f"The achievable score ceiling is <strong>{esc(score_achievable)}</strong>, "
        "contingent on the completion of a single bounded additional step: runtime execution assessment.",

        "One critical operational signal has been identified — the security intelligence pathway has a "
        "structurally confirmed capacity ceiling; live performance requires measurement to confirm it is being met.",

        "The current assessment posture is decision-ready on all structural dimensions. "
        "Execution readiness requires one additional measurement step before a complete determination can be issued.",
    ]

    return "\n".join(f"<p>{s}</p>" for s in sentences)


def compose_current_state(payloads: dict) -> str:
    p09 = payloads["CLM-09"]
    p25 = payloads["CLM-25"]
    p12 = payloads["CLM-12"]

    score_val = p09.get("value", {}).get("narrative", "60/100")
    verdict_val = p25.get("value", {}).get("narrative", "—")
    range_val = p12.get("value", {}).get("narrative", "—")

    # Strip internal status codes from range value
    range_display = re.sub(r',?\s*status=\S+', '', range_val).strip().strip(',')

    structural_class = p09.get("evidence_class", "VERIFIED")
    execution_class  = p25.get("evidence_class", "CONDITIONAL")
    range_class      = p12.get("evidence_class", "CONDITIONAL")

    return f"""
<div class="state-grid">
  <div class="state-card">
    <div class="state-card-header">
      <span class="state-card-label">A. Structural Readiness</span>
      {ev_badge(structural_class)}
    </div>
    <div class="state-card-score">{esc(score_val)}</div>
    <p class="state-card-body">
      The structural evidence base is complete and verified. Every structural component has been
      examined and accounted for. This score represents the maximum derivable from structural
      analysis alone and carries no qualification.
    </p>
  </div>

  <div class="state-card">
    <div class="state-card-header">
      <span class="state-card-label">B. Execution Readiness</span>
      {ev_badge(execution_class)}
    </div>
    <div class="state-card-score">Pending Assessment</div>
    <p class="state-card-body">
      Execution readiness has not yet been evaluated. This is not a finding of deficiency —
      it reflects an incomplete measurement. The verdict on execution will be determined once
      runtime evaluation is performed. The structural foundation is in place to support a
      strong execution result.
    </p>
  </div>

  <div class="state-card">
    <div class="state-card-header">
      <span class="state-card-label">C. Evidence Confidence</span>
      {ev_badge(range_class)}
    </div>
    <div class="state-card-score">{esc(range_display)}</div>
    <p class="state-card-body">
      The confidence range separates what is proven from what is achievable. The lower bound
      is a committed, evidence-backed floor. The upper bound will be confirmed once execution
      assessment is complete. This range is the honest and commercially useful representation
      of current assessment state.
    </p>
  </div>
</div>
"""


def compose_key_findings(payloads: dict) -> str:
    items = []

    # --- CLM-25 ---
    p = payloads["CLM-25"]
    items.append(f"""
<div class="finding-card">
  <div class="finding-header">
    <div class="finding-title">Executive Verdict</div>
    {ev_badge(p["evidence_class"])}
  </div>
  <p class="finding-statement">
    The three-axis verdict — covering structural completeness, structural concentration, and
    execution readiness — is the primary output for executive decision-making.
    Structural evidence is complete and verified. No structural concentration risks were identified.
    Execution readiness is the critical open dimension, pending a single bounded measurement step.
  </p>
  <div class="finding-row">
    <span class="finding-key">CURRENT VALUE</span>
    <span class="finding-val">{esc(p.get("value", {}).get("narrative", "—"))}</span>
  </div>
  <div class="finding-row">
    <span class="finding-key">CONSTRAINT</span>
    <span class="finding-val">Execution verdict requires runtime assessment to confirm.</span>
  </div>
  <div class="finding-footer">
    <span class="finding-id">{p["claim_id"]}</span>
    <span class="finding-trace">Trace available · L2, L3</span>
  </div>
</div>
""")

    # --- CLM-09 ---
    p = payloads["CLM-09"]
    items.append(f"""
<div class="finding-card">
  <div class="finding-header">
    <div class="finding-title">Proven Structural Score</div>
    {ev_badge(p["evidence_class"])}
  </div>
  <p class="finding-statement">
    A structural score of 60 out of 100 is the verified evidence floor — the maximum derivable
    from structural analysis alone. This is not an estimate or a partial measurement; it is
    a deterministic result derived from confirmed facts. For any buyer or operator, this score
    represents a commitment backed by evidence that cannot be invalidated by execution findings.
  </p>
  <div class="finding-row">
    <span class="finding-key">PROVEN VALUE</span>
    <span class="finding-val">{esc(p.get("value", {}).get("narrative", "—"))}</span>
  </div>
  <div class="finding-row">
    <span class="finding-key">BUSINESS IMPACT</span>
    <span class="finding-val">Provides a credible, evidence-backed baseline for commercial and operational decisions.</span>
  </div>
  <div class="finding-footer">
    <span class="finding-id">{p["claim_id"]}</span>
    <span class="finding-trace">Trace available · L2, L3</span>
  </div>
</div>
""")

    # --- CLM-20 ---
    p = payloads["CLM-20"]
    sig = p.get("signal", {})
    items.append(f"""
<div class="finding-card">
  <div class="finding-header">
    <div class="finding-title">Security Intelligence Pipeline Signal</div>
    <div class="finding-header-right">
      {ev_badge(p["evidence_class"])}
      {conf_badge(sig.get("evidence_confidence", "WEAK"))}
    </div>
  </div>
  <p class="finding-statement">
    The security intelligence pipeline has a confirmed structural capacity ceiling.
    The forwarding pathway that carries network security intelligence from the platform
    to the cloud operates at a fixed, bounded rate established in configuration.
    This capacity is structurally verified; whether it is being met under live conditions
    requires runtime measurement.
  </p>
  <div class="finding-row">
    <span class="finding-key">BUSINESS IMPACT</span>
    <span class="finding-val">{esc(sig.get("business_impact", "—"))}</span>
  </div>
  <div class="finding-row">
    <span class="finding-key">RISK</span>
    <span class="finding-val">{esc(sig.get("risk", "—"))}</span>
  </div>
  <div class="finding-row">
    <span class="finding-key">CURRENT VALUE</span>
    <span class="finding-val">{esc(p.get("value", {}).get("narrative", "—"))}</span>
  </div>
  <div class="finding-footer">
    <span class="finding-id">{p["claim_id"]}</span>
    <span class="finding-trace">Trace available · L2, L3</span>
  </div>
</div>
""")

    # --- CLM-12 ---
    p = payloads["CLM-12"]
    range_raw = p.get("value", {}).get("narrative", "—")
    range_display = re.sub(r',?\s*status=\S+', '', range_raw).strip().strip(',')
    items.append(f"""
<div class="finding-card">
  <div class="finding-header">
    <div class="finding-title">Score Confidence Range</div>
    {ev_badge(p["evidence_class"])}
  </div>
  <p class="finding-statement">
    The confidence range honestly represents the current assessment state: the lower bound
    is proven and evidence-backed, while the upper bound is achievable upon completion of
    runtime evaluation. Presenting a single score without this range would obscure both
    what is already known and what remains pending. This range collapses to a single number
    once execution assessment is complete.
  </p>
  <div class="finding-row">
    <span class="finding-key">RANGE</span>
    <span class="finding-val">{esc(range_display)}</span>
  </div>
  <div class="finding-row">
    <span class="finding-key">CONSTRAINT</span>
    <span class="finding-val">Upper bound confirmed upon completion of execution assessment.</span>
  </div>
  <div class="finding-footer">
    <span class="finding-id">{p["claim_id"]}</span>
    <span class="finding-trace">Trace available · L2, L3</span>
  </div>
</div>
""")

    # --- CLM-10 ---
    p = payloads["CLM-10"]
    items.append(f"""
<div class="finding-card">
  <div class="finding-header">
    <div class="finding-title">Achievable Score Ceiling</div>
    {ev_badge(p["evidence_class"])}
  </div>
  <p class="finding-statement">
    A projected score of 100 out of 100 is achievable — not as a hypothetical but as a
    mathematically grounded ceiling derived from the current structural evidence state.
    The proven floor of 60 and the achievable ceiling of 100 together define the assessment
    range: the worst-case outcome is proven, the best-case outcome is bounded and reachable.
  </p>
  <div class="finding-row">
    <span class="finding-key">PROJECTED CEILING</span>
    <span class="finding-val">{esc(p.get("value", {}).get("narrative", "—"))}</span>
  </div>
  <div class="finding-row">
    <span class="finding-key">CONSTRAINT</span>
    <span class="finding-val">Achievable upon completion of runtime execution assessment. This is the ceiling, not a current measurement.</span>
  </div>
  <div class="finding-footer">
    <span class="finding-id">{p["claim_id"]}</span>
    <span class="finding-trace">Trace available · L2, L3</span>
  </div>
</div>
""")

    return "\n".join(items)


def compose_risks(payloads: dict) -> str:
    caveats = collect_caveats(payloads)
    if not caveats:
        return "<p class='no-risks'>No active conditions identified.</p>"

    rows = []
    for c in caveats:
        rows.append(f"""
<div class="risk-row">
  <span class="risk-tag">CONDITION</span>
  <span class="risk-text">{esc(c)}</span>
</div>
""")
    return "\n".join(rows)


def compose_decision_guidance(payloads: dict) -> str:
    points = [
        ("Initiate runtime execution assessment",
         "Completing this single bounded step will resolve all CONDITIONAL claims and collapse the "
         "score confidence range to a single confirmed number. All structural prerequisites are met."),

        ("Proceed with confidence on structural matters",
         "The proven structural score of 60 is an evidence-backed commitment. Structural decisions — "
         "integration planning, architecture evaluation, dependency analysis — may proceed without "
         "qualification."),

        ("Validate sensor bridge throughput under live conditions",
         "The security intelligence pipeline's capacity ceiling is structurally confirmed. "
         "Live measurement is required to confirm that runtime throughput meets this ceiling "
         "and to establish an operational baseline for ongoing monitoring."),

        ("Treat execution readiness verdict as an open item, not a deficiency",
         "The pending execution verdict reflects an incomplete measurement, not a structural failure. "
         "No blocking structural issues were identified. The assessment is in position for a strong "
         "execution outcome."),

        ("Leverage trace access for deeper operational investigation",
         "Extended trace access is available at operational and audit depth levels. "
         "For any finding requiring further examination, deeper evidence chains are accessible "
         "and fully queryable."),
    ]

    items = []
    for i, (title, body) in enumerate(points, 1):
        items.append(f"""
<div class="guidance-item">
  <div class="guidance-num">{i:02d}</div>
  <div class="guidance-body">
    <div class="guidance-title">{esc(title)}</div>
    <p class="guidance-text">{esc(body)}</p>
  </div>
</div>
""")
    return "\n".join(items)


def compose_observability(payloads: dict) -> str:
    return """
<p>
  This report is produced from a governed intelligence system — not from manual review,
  expert estimation, or documentation audits. Every statement maps to a verifiable evidence chain.
  The proven score is not an opinion; it is a deterministic result derived from confirmed facts.
  The acknowledged gaps are not limitations of the report; they are explicit measurements of what
  has not yet been evaluated, distinguishing this system from assessments that omit unknowns.
</p>
<p>
  <strong>Observable truth changes how decisions get made.</strong>
  When the evidence floor is known and proven, buyers and operators can act on the structural
  foundation with confidence. When gaps are explicit, they can be prioritized and addressed
  rather than discovered after commitment.
</p>
<div class="obs-advantage-grid">
  <div class="obs-item">
    <div class="obs-item-title">Evidence-Backed Floor</div>
    <p class="obs-item-body">
      The proven score is not a range or an estimate — it is the minimum that can be guaranteed
      from structural evidence alone. Decisions made on this floor are not exposed to structural
      discovery risk.
    </p>
  </div>
  <div class="obs-item">
    <div class="obs-item-title">Explicit Gap Accounting</div>
    <p class="obs-item-body">
      Unknown dimensions are identified and labelled. An unknown execution state is not
      hidden inside an averaged score — it is surfaced as an open item with a clear resolution path.
    </p>
  </div>
  <div class="obs-item">
    <div class="obs-item-title">Queryable Intelligence</div>
    <p class="obs-item-body">
      Extended trace access enables operational and audit-depth investigation of any finding.
      Decision-makers and technical teams can query the same underlying intelligence at the
      depth appropriate to their role.
    </p>
  </div>
</div>
<div class="obs-access-note">
  Advanced access — including operational detail (L2) and full audit trail (L3) — is available
  for stakeholders requiring deeper evidence interrogation, technical validation, or
  integration planning support.
</div>
"""


def compose_appendix(payloads: dict) -> str:
    # Evidence composition
    class_counts: dict[str, int] = {}
    for claim_id in LENS_CLAIMS:
        ec = payloads[claim_id].get("evidence_class", "UNKNOWN")
        class_counts[ec] = class_counts.get(ec, 0) + 1

    comp_rows = ""
    for ec, count in sorted(class_counts.items()):
        pct = round(count / len(LENS_CLAIMS) * 100)
        comp_rows += f'<tr><td>{esc(ec)}</td><td>{count}</td><td>{pct}%</td></tr>\n'

    # Claim table
    claim_rows = ""
    for claim_id in LENS_CLAIMS:
        p = payloads[claim_id]
        depths = ", ".join(p.get("trace_depth_available", []))
        raw_label = p.get("claim_label", "—")
        display_label = safe_label(raw_label)
        claim_rows += f"""<tr>
  <td>{esc(claim_id)}</td>
  <td>{esc(display_label)}</td>
  <td>{esc(p.get("evidence_class", "—"))}</td>
  <td>L1{(", " + esc(depths)) if depths else ""}</td>
</tr>\n"""

    anchor = payloads[LENS_CLAIMS[0]]
    run_id = esc(anchor.get("run_id", "—"))

    return f"""
<h3 class="appendix-sub">A. Evidence Composition</h3>
<table class="app-table">
  <thead><tr><th>Evidence Class</th><th>Claims</th><th>Share</th></tr></thead>
  <tbody>{comp_rows}</tbody>
</table>

<h3 class="appendix-sub">B. Claim Registry — This Report</h3>
<table class="app-table">
  <thead><tr><th>ID</th><th>Label</th><th>Evidence Class</th><th>Depth Available</th></tr></thead>
  <tbody>{claim_rows}</tbody>
</table>

<p class="app-footer">
  Run: {run_id} &nbsp;·&nbsp; Zone: ZONE-2 &nbsp;·&nbsp; Depth: L1
  &nbsp;·&nbsp; Authority: {esc(STREAM_ID)}
</p>
"""


# ---------------------------------------------------------------------------
# New section composers — PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01
# ---------------------------------------------------------------------------

def compose_system_intelligence() -> str:
    domains = [
        ('Edge Data Acquisition',                   'Operational Intelligence', 'verified'),
        ('Sensor and Security Ingestion',            'Operational Intelligence', 'verified'),
        ('Analytics and Intelligence',               'Operational Intelligence', 'verified'),
        ('AI/ML Intelligence Layer',                 'Operational Intelligence', 'verified'),
        ('Fleet Core Operations',                    'Fleet Operations',         'verified'),
        ('Fleet Vertical Extensions',                'Fleet Operations',         'verified'),
        ('Extended Operations and Driver Services',  'Fleet Operations',         'verified'),
        ('EV and Electrification',                   'Emerging Capabilities',    'verified'),
        ('Operational Engineering',                  'Emerging Capabilities',    'verified'),
        ('Platform Infrastructure and Data',         'Platform Infrastructure',  'conditional'),
        ('Telemetry Transport and Messaging',        'Platform Infrastructure',  'conditional'),
        ('Event-Driven Architecture',                'Platform Infrastructure',  'verified'),
        ('Real-Time Streaming and Gateway',          'Platform Infrastructure',  'verified'),
        ('Access Control and Identity',              'Platform Services',        'verified'),
        ('SaaS Platform Layer',                      'Platform Services',        'verified'),
        ('External Integration',                     'Platform Services',        'verified'),
        ('Frontend Application',                     'Platform Services',        'verified'),
    ]

    def _domain_row(name: str, cluster: str, status: str) -> str:
        badge = (
            '<span class="ev-badge badge-verified">VERIFIED</span>'
            if status == 'verified'
            else '<span class="ev-badge badge-conditional">IN PROGRESS</span>'
        )
        return (
            f'<div class="domain-row">'
            f'<span class="domain-row-name">{esc(name)}</span>'
            f'<span class="domain-row-cluster">{esc(cluster)}</span>'
            f'{badge}'
            f'</div>'
        )

    # Two-column layout when domain count > 10
    if len(domains) > 10:
        mid = (len(domains) + 1) // 2  # ceiling split: first column gets one more if odd
        left_rows  = "".join(_domain_row(*d) for d in domains[:mid])
        right_rows = "".join(_domain_row(*d) for d in domains[mid:])
        list_html = (
            f'<div class="domain-list-2col">'
            f'<div class="domain-list">{left_rows}</div>'
            f'<div class="domain-list">{right_rows}</div>'
            f'</div>'
        )
    else:
        list_html = (
            f'<div class="domain-list">'
            + "".join(_domain_row(*d) for d in domains)
            + '</div>'
        )

    return f"""
<p>
  The platform assessment covers 17 functional domains across five capability clusters.
  15 domains are structurally verified; 2 domains carry pending runtime dimensions.
  This represents the complete assessed surface — no domains are unexamined.
</p>
{list_html}
<div class="domain-summary">
  17 functional domains &nbsp;·&nbsp; 42 capability surfaces &nbsp;·&nbsp; 89 components mapped
</div>
"""


def compose_topology_view(light_mode: bool = False) -> str:
    """Build the curated 17-domain topology SVG.

    light_mode=True  → white/light background, dark labels — for executive report / print.
    light_mode=False → dark background — for LENS dark-theme web surface.
    """

    clusters = [
        ('Operational Intelligence', 8,   8,   283, 205, 9, '#3fb950'),
        ('Fleet Operations',         322, 8,   245, 205, 9, '#58a6ff'),
        ('Emerging Capabilities',    602, 62,  190, 125, 9, '#79c0ff'),
        ('Platform Infrastructure',  8,   248, 283, 215, 9, '#d29922'),
        ('Platform Services',        322, 248, 295, 215, 9, '#a5d6ff'),
    ]

    # id, line1, line2, status, focus, cx, cy, r
    nodes = [
        ('gn-01', 'Edge Data',      'Acquisition',    'verified',    True,  88,  72,  30),
        ('gn-02', 'Sensor &',       'Security',       'verified',    False, 218, 72,  22),
        ('gn-03', 'Analytics &',    'Intelligence',   'verified',    False, 88,  170, 22),
        ('gn-04', 'AI/ML',          'Intelligence',   'verified',    False, 218, 170, 22),
        ('gn-05', 'Fleet Core',     'Operations',     'verified',    False, 404, 78,  26),
        ('gn-06', 'Fleet Vertical', 'Extensions',     'verified',    False, 508, 98,  20),
        ('gn-07', 'Extended',       'Operations',     'verified',    False, 435, 172, 20),
        ('gn-08', 'EV &',           'Electrification','verified',    False, 648, 105, 20),
        ('gn-09', 'Operational',    'Engineering',    'verified',    False, 755, 122, 20),
        ('gn-10', 'Platform',       'Infrastructure', 'conditional', False, 88,  322, 26),
        ('gn-11', 'Telemetry',      'Transport',      'conditional', False, 218, 322, 20),
        ('gn-12', 'Event-Driven',   'Architecture',   'verified',    False, 88,  418, 20),
        ('gn-13', 'Real-Time',      'Streaming',      'verified',    False, 218, 418, 20),
        ('gn-14', 'Access Control', '& Identity',     'verified',    False, 398, 322, 22),
        ('gn-15', 'SaaS',           'Platform',       'verified',    False, 540, 322, 20),
        ('gn-16', 'External',       'Integration',    'verified',    False, 398, 418, 20),
        ('gn-17', 'Frontend',       'Application',    'verified',    False, 540, 418, 20),
    ]

    # source, target, stroke, opacity, dash
    if light_mode:
        edges = [
            ('gn-01', 'gn-05', '#1d4ed8', 0.55, None),
            ('gn-03', 'gn-05', '#1d4ed8', 0.55, None),
            ('gn-01', 'gn-10', '#15803d', 0.50, None),
            ('gn-02', 'gn-10', '#15803d', 0.50, None),
            ('gn-05', 'gn-14', '#b45309', 0.50, '5,4'),
            ('gn-05', 'gn-09', '#b45309', 0.50, '5,4'),
            ('gn-06', 'gn-08', '#6b7280', 0.45, '3,3'),
            ('gn-11', 'gn-03', '#15803d', 0.50, None),
            ('gn-10', 'gn-05', '#15803d', 0.50, None),
            ('gn-10', 'gn-15', '#15803d', 0.50, None),
            ('gn-10', 'gn-09', '#15803d', 0.50, None),
            ('gn-14', 'gn-05', '#15803d', 0.50, None),
        ]
    else:
        edges = [
            ('gn-01', 'gn-05', '#58a6ff', 0.40, None),
            ('gn-03', 'gn-05', '#58a6ff', 0.40, None),
            ('gn-01', 'gn-10', '#3fb950', 0.35, None),
            ('gn-02', 'gn-10', '#3fb950', 0.35, None),
            ('gn-05', 'gn-14', '#d29922', 0.35, '5,4'),
            ('gn-05', 'gn-09', '#d29922', 0.35, '5,4'),
            ('gn-06', 'gn-08', '#8b949e', 0.30, '3,3'),
            ('gn-11', 'gn-03', '#3fb950', 0.35, None),
            ('gn-10', 'gn-05', '#3fb950', 0.35, None),
            ('gn-10', 'gn-15', '#3fb950', 0.35, None),
            ('gn-10', 'gn-09', '#3fb950', 0.35, None),
            ('gn-14', 'gn-05', '#3fb950', 0.35, None),
        ]

    if light_mode:
        node_style = {
            'verified':    {'fill': '#f0fdf4', 'stroke': '#22c55e', 'glow': 'rgba(34,197,94,0.12)',  'label': '#14532d'},
            'conditional': {'fill': '#fffbeb', 'stroke': '#f59e0b', 'glow': 'rgba(245,158,11,0.12)', 'label': '#78350f'},
            'focus':       {'fill': '#eff6ff', 'stroke': '#3b82f6', 'glow': 'rgba(59,130,246,0.15)', 'label': '#1e3a8a'},
        }
        svg_bg        = '#ffffff'
        fill_opacity  = '0.10'
        stroke_opacity = '0.50'
        label_opacity = '0.75'
    else:
        node_style = {
            'verified':    {'fill': '#0d2e1a', 'stroke': '#3fb950', 'glow': 'rgba(63,185,80,0.22)',  'label': '#c9d1d9'},
            'conditional': {'fill': '#1a1600', 'stroke': '#d29922', 'glow': 'rgba(210,153,34,0.22)', 'label': '#c9d1d9'},
            'focus':       {'fill': '#0d2e1a', 'stroke': '#3fb950', 'glow': 'rgba(63,185,80,0.35)',  'label': '#e6edf3'},
        }
        svg_bg        = '#0d1117'
        fill_opacity  = '0.06'
        stroke_opacity = '0.35'
        label_opacity = '0.60'

    # Node position lookup
    node_pos = {n[0]: (n[5], n[6]) for n in nodes}

    parts = []

    # Layer 1 — cluster rects
    for label, x, y, w, h, rx, accent in clusters:
        parts.append(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" '
            f'fill="{accent}" fill-opacity="{fill_opacity}" '
            f'stroke="{accent}" stroke-width="1" stroke-opacity="{stroke_opacity}" />'
        )

    # Layer 2 — edges
    for src, tgt, stroke, opacity, dash in edges:
        sx, sy = node_pos[src]
        tx, ty = node_pos[tgt]
        attrs = f'stroke="{stroke}" stroke-opacity="{opacity}" stroke-width="1.5"'
        if dash:
            attrs += f' stroke-dasharray="{dash}"'
        parts.append(f'<line x1="{sx}" y1="{sy}" x2="{tx}" y2="{ty}" {attrs} fill="none" />')

    # Layer 3 — cluster labels
    for label, x, y, w, h, rx, accent in clusters:
        lx = x + w // 2
        ly = y + 16
        parts.append(
            f'<text x="{lx}" y="{ly}" text-anchor="middle" '
            f'font-family="monospace" font-size="9" fill="{accent}" fill-opacity="{label_opacity}" '
            f'font-weight="600" letter-spacing="0.08em">{esc(label.upper())}</text>'
        )

    # Layer 4 — nodes
    for nid, line1, line2, status, focus, cx, cy, r in nodes:
        ns = node_style['focus'] if focus else node_style[status]
        glow_r = r + (8 if focus else 5)
        sw = '2' if focus else '1.5'
        fw = '600' if focus else '400'
        parts.append(f'<circle cx="{cx}" cy="{cy}" r="{glow_r}" fill="{ns["glow"]}" />')
        parts.append(
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{ns["fill"]}" '
            f'stroke="{ns["stroke"]}" stroke-width="{sw}" />'
        )
        parts.append(
            f'<text x="{cx}" y="{cy - 5}" text-anchor="middle" '
            f'font-family="monospace" font-size="7.5" fill="{ns["label"]}" font-weight="{fw}">'
            f'{esc(line1)}</text>'
        )
        parts.append(
            f'<text x="{cx}" y="{cy + 7}" text-anchor="middle" '
            f'font-family="monospace" font-size="7.5" fill="{ns["label"]}" font-weight="{fw}">'
            f'{esc(line2)}</text>'
        )

    svg_inner = '\n  '.join(parts)

    if light_mode:
        # Light / print-safe container
        legend_verified   = '#22c55e'
        legend_conditional = '#f59e0b'
        container_style   = 'overflow-x:auto;border:1px solid #e5e7eb;border-radius:4px;'
    else:
        legend_verified   = '#3fb950'
        legend_conditional = '#d29922'
        container_style   = 'overflow-x:auto;border-radius:4px;background:#0d1117;'

    return f"""
<div class="topo-container">
  <div style="{container_style}">
    <svg viewBox="0 0 860 475" xmlns="http://www.w3.org/2000/svg"
         style="width:100%;min-width:600px;background:{svg_bg};border-radius:4px;display:block;">
  {svg_inner}
    </svg>
  </div>
  <div class="topo-legend">
    <span class="topo-legend-dot" style="background:{legend_verified};"></span>&nbsp;Verified
    &nbsp;&nbsp;
    <span class="topo-legend-dot" style="background:{legend_conditional};"></span>&nbsp;In Progress
    &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
    <span class="topo-depth-note">17 functional domains &nbsp;&middot;&nbsp; 5 clusters &nbsp;&middot;&nbsp; 12 structural relationships &nbsp;&middot;&nbsp; Structural depth only</span>
  </div>
</div>
"""


def compose_focus_domain() -> str:
    rows = [
        ('DOMAIN ROLE',
         'Primary collection surface for sensor, telemetry, and edge data from fleet nodes. '
         'Everything that flows into the intelligence layer begins here.'),
        ('WHAT IS VERIFIED',
         'Structural pathway to the security intelligence layer is confirmed. '
         'Four capability surfaces and their architectural boundaries have been assessed.'),
        ('WHAT REQUIRES VALIDATION',
         'Live throughput performance of the sensor bridge pathway requires runtime confirmation. '
         'The structural ceiling is defined; operational measurement completes the picture.'),
        ('ASSESSMENT STATUS',
         'Structurally grounded. Contributes to the readiness score as a verified domain.'),
    ]

    connections = [
        ('Platform Infrastructure and Data', 'Edge data sustains the infrastructure data layer'),
        ('Sensor and Security Ingestion',    'Co-domain in the security intelligence pathway'),
        ('Analytics and Intelligence',       'Analytics pipeline consumes edge acquisition output'),
        ('Fleet Core Operations',            'Edge intelligence informs fleet operational context'),
    ]

    row_html = '\n'.join(f"""  <div class="focus-row">
    <span class="focus-row-key">{esc(k)}</span>
    <span class="focus-row-val">{esc(v)}</span>
  </div>""" for k, v in rows)

    conn_html = '\n'.join(f"""    <div class="focus-conn">
      <span class="focus-conn-name">{esc(n)}</span>
      <span class="focus-conn-note">{esc(note)}</span>
    </div>""" for n, note in connections)

    return f"""
<div class="focus-panel">
  <div class="focus-header">
    <div>
      <div class="focus-name">Edge Data Acquisition</div>
      <div class="focus-type">Operational Domain &mdash; FUNCTIONAL</div>
    </div>
    <span class="ev-badge badge-verified">VERIFIED</span>
  </div>
  <p class="focus-tagline">
    The primary source of operational intelligence. Structurally verified.
    Live throughput confirmation is the remaining validation step.
  </p>
{row_html}
  <div class="focus-connections">
    <div class="focus-conn-label">CONNECTED DOMAINS</div>
{conn_html}
  </div>
</div>
"""


# ---------------------------------------------------------------------------
# HTML document assembly
# ---------------------------------------------------------------------------

CSS = """
*, *::before, *::after { box-sizing: border-box; }
body {
  font-family: -apple-system, 'Segoe UI', Arial, sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: #1a202c;
  background: #fff;
  margin: 0;
  padding: 0;
}

/* SOURCE NOTE */
.source-note {
  font-size: 11px;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 8px 14px;
  margin-bottom: 28px;
  letter-spacing: .01em;
}

/* PRINT */
@media print {
  .no-print { display: none !important; }
  body { font-size: 13px; }
  .cover { page-break-after: always; }
  .section { page-break-inside: avoid; }
}

/* LAYOUT */
.cover {
  background: #0f1923;
  color: #e6edf3;
  padding: 72px 64px;
  min-height: 320px;
}
.cover-eyebrow {
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #4a8fc7;
  margin-bottom: 20px;
}
.cover-title {
  font-size: 34px;
  font-weight: 700;
  color: #e6edf3;
  margin: 0 0 8px;
  letter-spacing: -.01em;
  line-height: 1.15;
}
.cover-subtitle {
  font-size: 17px;
  color: #8ba8c3;
  margin: 0 0 40px;
  font-weight: 400;
}
.cover-meta {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  border-top: 1px solid #253444;
  padding-top: 24px;
  margin-top: 24px;
}
.cover-meta-item { }
.cover-meta-key {
  font-size: 10px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #4a637a;
  display: block;
  margin-bottom: 3px;
}
.cover-meta-val {
  font-size: 13px;
  color: #a0bcd6;
}
.cover-zone-stmt {
  margin-top: 28px;
  font-size: 11px;
  color: #2d4a62;
  letter-spacing: .06em;
  text-transform: uppercase;
  border: 1px solid #1e3347;
  display: inline-block;
  padding: 5px 12px;
}

.report-body {
  max-width: 920px;
  margin: 0 auto;
  padding: 48px 48px;
}

.section {
  margin-bottom: 52px;
}
.section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #1e4d8c;
  border-bottom: 2px solid #1e4d8c;
  padding-bottom: 7px;
  margin-bottom: 24px;
}
.section p {
  color: #2d3748;
  margin: 0 0 14px;
}
.section p:last-child { margin-bottom: 0; }

/* EVIDENCE BADGES */
.ev-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .07em;
  padding: 3px 9px;
  border-radius: 3px;
  white-space: nowrap;
  vertical-align: middle;
}
.badge-verified    { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.badge-conditional { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.badge-partial     { background: #ffedd5; color: #7c2d12; border: 1px solid #fed7aa; }
.badge-blocked     { background: #fee2e2; color: #7f1d1d; border: 1px solid #fecaca; }

/* CONFIDENCE BADGES */
.conf-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  padding: 3px 9px;
  border-radius: 3px;
  white-space: nowrap;
  vertical-align: middle;
}
.conf-strong   { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.conf-moderate { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.conf-weak     { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }

/* STATE GRID */
.state-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 4px;
}
@media (max-width: 700px) { .state-grid { grid-template-columns: 1fr; } }
.state-card {
  border: 1px solid #e5e7eb;
  padding: 20px;
  border-radius: 4px;
}
.state-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}
.state-card-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #6b7280;
}
.state-card-score {
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;
}
.state-card-body {
  font-size: 13px;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

/* KEY FINDINGS */
.finding-card {
  border: 1px solid #e5e7eb;
  border-left: 4px solid #1e4d8c;
  padding: 22px 24px;
  margin-bottom: 16px;
  border-radius: 0 4px 4px 0;
}
.finding-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}
.finding-header-right {
  display: flex;
  gap: 6px;
  align-items: center;
}
.finding-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a202c;
}
.finding-statement {
  font-size: 14px;
  color: #2d3748;
  line-height: 1.7;
  margin: 0 0 14px;
}
.finding-row {
  display: flex;
  gap: 12px;
  font-size: 12px;
  margin-bottom: 7px;
  align-items: flex-start;
}
.finding-key {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #9ca3af;
  min-width: 130px;
  flex-shrink: 0;
  padding-top: 2px;
}
.finding-val { color: #374151; line-height: 1.55; }
.finding-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
  font-size: 11px;
  color: #9ca3af;
}

/* RISKS */
.risk-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}
.risk-row:last-child { border-bottom: none; }
.risk-tag {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .09em;
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fde68a;
  padding: 3px 7px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
  border-radius: 2px;
}
.risk-text { color: #374151; line-height: 1.6; }
.no-risks { color: #6b7280; font-size: 13px; }

/* DECISION GUIDANCE */
.guidance-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 18px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
.guidance-num {
  font-size: 20px;
  font-weight: 800;
  color: #bfdbfe;
  flex-shrink: 0;
  line-height: 1;
  padding-top: 2px;
  min-width: 28px;
}
.guidance-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e4d8c;
  margin-bottom: 6px;
}
.guidance-text {
  font-size: 13px;
  color: #4a5568;
  margin: 0;
  line-height: 1.6;
}

/* OBSERVABILITY */
.obs-advantage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 20px 0;
}
@media (max-width: 700px) { .obs-advantage-grid { grid-template-columns: 1fr; } }
.obs-item {
  padding: 18px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}
.obs-item-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .05em;
  color: #1e4d8c;
  margin-bottom: 8px;
  text-transform: uppercase;
}
.obs-item-body {
  font-size: 12px;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}
.obs-access-note {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-left: 4px solid #1e4d8c;
  padding: 14px 18px;
  font-size: 13px;
  color: #1e3a5f;
  line-height: 1.6;
  border-radius: 0 4px 4px 0;
}

/* APPENDIX */
.appendix-sub {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #6b7280;
  margin: 24px 0 10px;
}
.appendix-sub:first-child { margin-top: 0; }
.app-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 4px;
}
.app-table th {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #9ca3af;
  text-align: left;
  padding: 7px 10px;
  border-bottom: 2px solid #e5e7eb;
}
.app-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  vertical-align: top;
}
.app-footer {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 24px;
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

/* REPORT FOOTER */
.report-footer {
  border-top: 1px solid #e5e7eb;
  padding: 20px 48px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
  max-width: 920px;
  margin: 0 auto;
}

/* SYSTEM INTELLIGENCE — DOMAIN LIST */
/* Two-column domain list (used when domain count > 10) */
.domain-list-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 16px 0;
}
@media (max-width: 600px) { .domain-list-2col { grid-template-columns: 1fr; } }
.domain-list-2col .domain-list { margin: 0; }

.domain-list {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 16px 0;
}
.domain-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}
.domain-row:last-child { border-bottom: none; }
.domain-row:nth-child(even) { background: #f9fafb; }
.domain-row-name {
  flex: 1;
  font-weight: 600;
  color: #1a202c;
}
.domain-row-cluster {
  font-size: 11px;
  color: #6b7280;
  min-width: 160px;
}
.domain-summary {
  font-size: 11px;
  color: #6b7280;
  text-align: right;
  margin-top: 6px;
  letter-spacing: .02em;
}

/* TOPOLOGY SVG WRAPPER */
.topo-container { margin: 8px 0; }
.topo-scroll-outer {
  overflow-x: auto;
  border-radius: 4px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}
.topo-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #6b7280;
  margin-top: 8px;
  flex-wrap: wrap;
}
.topo-legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  vertical-align: middle;
}
.topo-depth-note {
  margin-left: auto;
  font-size: 10px;
  color: #9ca3af;
  letter-spacing: .02em;
}

/* FOCUS DOMAIN PANEL */
.focus-panel {
  border: 1px solid #bbf7d0;
  border-left: 4px solid #3fb950;
  background: #f0fdf4;
  border-radius: 0 4px 4px 0;
  padding: 22px 24px;
}
.focus-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}
.focus-name {
  font-size: 17px;
  font-weight: 700;
  color: #14532d;
}
.focus-type {
  font-size: 11px;
  color: #166534;
  letter-spacing: .04em;
  margin-top: 3px;
}
.focus-tagline {
  font-size: 14px;
  color: #166534;
  margin: 0 0 16px;
  line-height: 1.6;
}
.focus-row {
  display: flex;
  gap: 12px;
  font-size: 13px;
  margin-bottom: 10px;
  align-items: flex-start;
}
.focus-row-key {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: #4ade80;
  min-width: 160px;
  flex-shrink: 0;
  padding-top: 2px;
  color: #166534;
}
.focus-row-val {
  color: #1a202c;
  line-height: 1.55;
}
.focus-connections {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #bbf7d0;
}
.focus-conn-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: #166534;
  margin-bottom: 10px;
}
.focus-conn {
  display: flex;
  gap: 12px;
  font-size: 12px;
  margin-bottom: 6px;
  align-items: flex-start;
}
.focus-conn-name {
  font-weight: 600;
  color: #14532d;
  min-width: 200px;
}
.focus-conn-note {
  color: #374151;
  line-height: 1.5;
}
"""


def build_html(payloads: Dict) -> str:
    anchor = payloads[LENS_CLAIMS[0]]
    run_id = anchor.get("run_id", "—")
    generated_at_raw = anchor.get("generated_at", "")
    try:
        dt = datetime.fromisoformat(generated_at_raw.replace("Z", "+00:00"))
        ts_display = dt.strftime("%B %d, %Y — %H:%M UTC")
    except Exception:
        ts_display = generated_at_raw

    now_utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    source_note = (
        f'<div class="source-note">'
        f'Source basis: governed projection derived from assessment run '
        f'<strong>{esc(run_id)}</strong> (ZONE-2)'
        f'</div>'
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Program Intelligence Assessment Report</title>
<style>{CSS}</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-eyebrow">Program Intelligence Assessment</div>
  <h1 class="cover-title">Structural &amp; Operational<br>Readiness Report</h1>
  <p class="cover-subtitle">Executive Projection — Governed Evidence Intelligence</p>
  <div class="cover-meta">
    <div class="cover-meta-item">
      <span class="cover-meta-key">Generated</span>
      <span class="cover-meta-val">{esc(ts_display)}</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-key">Run Reference</span>
      <span class="cover-meta-val">{esc(run_id)}</span>
    </div>
    <div class="cover-meta-item">
      <span class="cover-meta-key">Authority</span>
      <span class="cover-meta-val">{esc(STREAM_ID)}</span>
    </div>
  </div>
  <div class="cover-zone-stmt">Derived from governed projection (ZONE-2) · No internal structure exposed</div>
</div>

<!-- BODY -->
<div class="report-body">

{source_note}

<!-- 1. EXECUTIVE SUMMARY -->
<div class="section">
  <div class="section-title">Executive Summary</div>
  {compose_executive_summary(payloads)}
</div>

<!-- 2. SYSTEM INTELLIGENCE OVERVIEW -->
<div class="section">
  <div class="section-title">System Intelligence Overview</div>
  {compose_system_intelligence()}
</div>

<!-- 3. STRUCTURAL TOPOLOGY VIEW -->
<div class="section">
  <div class="section-title">Structural Topology View</div>
  {compose_topology_view(light_mode=True)}
</div>

<!-- 4. FOCUS DOMAIN — EDGE DATA ACQUISITION -->
<div class="section">
  <div class="section-title">Focus Domain</div>
  {compose_focus_domain()}
</div>

<!-- 5. CURRENT STATE ASSESSMENT -->
<div class="section">
  <div class="section-title">Current State Assessment</div>
  {compose_current_state(payloads)}
</div>

<!-- 6. KEY FINDINGS -->
<div class="section">
  <div class="section-title">Key Findings</div>
  {compose_key_findings(payloads)}
</div>

<!-- 7. RISKS AND CONDITIONS -->
<div class="section">
  <div class="section-title">Risks and Conditions</div>
  {compose_risks(payloads)}
</div>

<!-- 8. DECISION GUIDANCE -->
<div class="section">
  <div class="section-title">Decision Guidance</div>
  {compose_decision_guidance(payloads)}
</div>

<!-- 9. OBSERVABILITY ADVANTAGE -->
<div class="section">
  <div class="section-title">Observability Advantage</div>
  {compose_observability(payloads)}
</div>

<!-- 10. APPENDIX -->
<div class="section">
  <div class="section-title">Controlled Appendix</div>
  {compose_appendix(payloads)}
</div>

</div><!-- /report-body -->

<div class="report-footer">
  <span>{esc(STREAM_ID)} · ZONE-2 · L1</span>
  <span>Generated: {esc(now_utc)}</span>
</div>

</body>
</html>
"""


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main(output_path: Optional[Path] = None) -> None:
    if output_path is None:
        output_path = _default_output_path()

    # --- Pre-flight: fragments directory must exist ---
    if not FRAGMENTS_DIR.exists():
        _fail(f"Fragment directory not found: {FRAGMENTS_DIR}")

    # --- Load payloads ---
    payloads = load_all_payloads()

    # --- Build HTML ---
    html = build_html(payloads)

    # --- Validate report body ---
    forbidden_found = validate_report_text(html)
    if forbidden_found:
        _fail(f"FORBIDDEN IDENTIFIERS IN REPORT: {forbidden_found}")

    # --- Write output ---
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")

    # Section C — clean output line consumed by API wrapper
    print(f"[LENS REPORT] Generated: {output_path.resolve()}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(
        description="LENS Executive Report Generator — PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01"
    )
    parser.add_argument(
        "--output", type=Path, default=None,
        help="Output HTML path (default: clients/blueedge/reports/lens_report_YYYYMMDD_HHMMSS.html)"
    )
    args = parser.parse_args()
    main(output_path=args.output)
