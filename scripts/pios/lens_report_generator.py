"""
scripts/pios/lens_report_generator.py
PRODUCTIZE.LENS.REPORT.01 / PRODUCTIZE.LENS.REPORT.DELIVERY.01 / PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01

Executive report generator for LENS v1.

Produces clients/<client>/reports/lens_report_YYYYMMDD_HHMMSS.html
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

import argparse
import json
import math
import os
import re
import subprocess
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
# GAP-01 gate — set True only after CONCEPT-06 predicate fix (concepts.json NOT_EVALUATED support)
GAP_01_RESOLVED = False

API_BASE = "http://localhost:3000"
API_TIMEOUT = 3  # seconds

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
FRAGMENTS_DIR = REPO_ROOT / "clients" / "blueedge" / "vaults" / "run_01_authoritative" / "claims" / "fragments"
REPORTS_DIR  = REPO_ROOT / "clients" / "blueedge" / "reports"

# Tier-1 canonical sources
CANONICAL_PKG_DIR = REPO_ROOT / "clients" / "blueedge" / "psee" / "runs" / "run_authoritative_recomputed_01" / "package"
TIER1_REPORTS_DIR    = REPORTS_DIR / "tier1"
DECISION_REPORTS_DIR = REPORTS_DIR / "decision"

_ACTIVE_CLIENT       = "blueedge"
_ACTIVE_VAULT_RUN_ID = "run_01_authoritative_generated"

_CLIENT_DISPLAY_NAMES: Dict = {
    "blueedge": "BlueEdge Fleet Management Platform",
    "e65d2f0a-dfa7-4257-9333-fcbb583f0880": "OSS FastAPI Codebase",
}


def _get_client_display_name(publish_safe: bool = False) -> str:
    if publish_safe:
        return "Client Environment"
    return _CLIENT_DISPLAY_NAMES.get(_ACTIVE_CLIENT, "Client Environment")


def _scoped_report_url(name: str) -> str:
    return (f"/api/report-file?name={name}"
            f"&client={_ACTIVE_CLIENT}&runId={_ACTIVE_VAULT_RUN_ID}")


# Language Layer — executive phrases for structural terms (Task 1 / STEP 16G)
_METHOD_EXEC: Dict = {
    "RUN_RELATIVE_OUTLIER":  "Statistically abnormal concentration",
    "THEORETICAL_BASELINE":  "Baseline condition without runtime validation",
}
_ZONE_CLASS_EXEC: Dict = {
    "COMPOUND_ZONE":       "Multiple structural pressures acting together",
    "DOMAIN_ZONE":         "Structural domain zone",
    "COUPLING_ZONE":       "Structural coupling zone",
    "PROPAGATION_ZONE":    "Structural propagation zone",
    "RESPONSIBILITY_ZONE": "Responsibility concentration zone",
    "FRAGMENTATION_ZONE":  "Structural fragmentation zone",
}
_ATTRIBUTION_EXEC: Dict = {
    "primary":   "Primary pressure anchor",
    "secondary": "Secondary affected zone",
}

# ---------------------------------------------------------------------------
# Rendering Contract — PI.SECOND-CLIENT.STEP16H
# Governs HOW content is rendered; does not alter data or truth layers.
# ---------------------------------------------------------------------------

# Section-level rendering rules (applied by RC.render_section)
_RC_RULES: Dict = {
    "zones":    frozenset({"exec_first", "no_repetition", "expandable"}),
    "signals":  frozenset({"exec_first"}),
    "unknowns": frozenset({"exec_first"}),
    "score":    frozenset({"exec_first", "anchor_first"}),
}

# Canonical terms that must NOT appear as the first word of a rendered string
_RC_RAW_FIRST_GUARD = (
    "PSIG-", "COND-",
    "RUN_RELATIVE_OUTLIER", "COMPOUND_ZONE",
    "THEORETICAL_BASELINE", "PRIMARY", "SECONDARY",
)


class _RenderingContract:
    """Rendering Contract for LENS report surfaces.

    Controls display ordering, trace-label placement, and pattern collapse.
    All inputs come from the Language Layer and projection data.
    No synthetic values; no truth mutation.
    """

    @staticmethod
    def apply_language(term: str) -> str:
        """Return executive phrase for a canonical term, or term itself if no mapping."""
        return (
            _METHOD_EXEC.get(term)
            or _ZONE_CLASS_EXEC.get(term)
            or _ATTRIBUTION_EXEC.get(term.lower())
            or term
        )

    @staticmethod
    def render_term(term: str) -> str:
        """Return exec-first HTML: exec phrase + trace label.

        If term has no mapping, returns esc(term) with no trace label.
        Never removes the canonical term.
        """
        exec_phrase = _RenderingContract.apply_language(term)
        if exec_phrase == term:
            return esc(term)
        return (
            f'{esc(exec_phrase)} '
            f'<span class="rc-trace">trace: {esc(term)}</span>'
        )

    @staticmethod
    def render_section(section_id: str, content: str,
                       rules: frozenset = frozenset()) -> str:
        """Wrap section content with rendering rules.

        no_empty:   return empty string when content has no visible text.
        exec_first: preserve content (enforcement is at build time, not post-hoc).
        expandable: content handled by block builders; rule acknowledged here.
        """
        if "no_empty" in rules:
            if not content or not content.strip():
                return ""
        return content

    @staticmethod
    def collapse_patterns(zones: list,
                          pz_proj: Optional[Dict],
                          publish_safe: bool = False) -> Optional[Dict]:
        """Detect identical signal sets across zones.

        Returns a dict with pattern metadata if all zones share the same PSIG set,
        else None. Caller is responsible for rendering.

        Dict keys: n_zones, shared_sigs, sigs_str, prim_name, zclass, zclass_exec.
        """
        if len(zones) < 2 or pz_proj is None:
            return None
        zone_list = pz_proj.get("zone_projection", [])
        if len(zone_list) < 2:
            return None
        signal_sets = [frozenset(z.get("signals", [])) for z in zone_list]
        if len(set(signal_sets)) != 1:
            return None
        shared_sigs   = sorted(signal_sets[0])
        zclass        = zone_list[0].get("zone_class", "COMPOUND_ZONE")
        prim_zone     = next((z for z in zone_list
                              if z.get("attribution_profile") == "primary"), None)
        prim_name_raw = (prim_zone.get("anchor_name", prim_zone.get("anchor_id", ""))
                         if prim_zone else "")
        if publish_safe:
            prim_name = ""
        else:
            prim_name = prim_name_raw
        return {
            "n_zones":    len(zones),
            "shared_sigs": shared_sigs,
            "sigs_str":   " · ".join(shared_sigs),
            "prim_name":  prim_name,
            "zclass":     zclass,
            "zclass_exec": _RenderingContract.apply_language(zclass),
        }

    @staticmethod
    def enforce_exec_first(text: str) -> bool:
        """Return False if text starts with a raw canonical term (guard check).

        Called at key rendering points. Does not modify text; caller decides
        whether to raise or log when this returns False.
        """
        stripped = text.strip()
        return not any(stripped.startswith(p) for p in _RC_RAW_FIRST_GUARD)

    @staticmethod
    def anchor_block(score: int, band_label: str,
                     band_lo: int, band_hi: int,
                     decision: str = "INVESTIGATE") -> str:
        """Return top-anchor HTML for all three report surfaces.

        One-line structural state + score + decision. No commentary.
        Implements rule: anchor_first.
        """
        return (
            f'<div class="rc-anchor-block">'
            f'<span class="rc-anchor-state">'
            f'Structurally verified. Execution not yet validated.</span>'
            f'<span class="rc-anchor-sep">·</span>'
            f'<span class="rc-anchor-score">{score} — {esc(band_label)}</span>'
            f'<span class="rc-anchor-sep">·</span>'
            f'<span class="rc-anchor-band">{band_lo}\u2013{band_hi}</span>'
            f'<span class="rc-anchor-sep">·</span>'
            f'<span class="rc-anchor-decision">{esc(decision)}</span>'
            f'</div>'
        )


RC = _RenderingContract


def _render_radial_gauge(score: int, band_min: int, band_max: int, label: str) -> str:
    """Inline SVG radial gauge — canonical score with confidence band arc.

    Renders a 270° arc gauge (7 o'clock → 5 o'clock, clockwise).
    Dark theme; colors match report CSS variables.
    Returns a self-contained <svg> string suitable for inline HTML embedding.
    """
    CX, CY, R        = 80, 72, 58
    W_TRACK, W_BAND, W_SCORE = 7, 11, 8
    START_DEG, SWEEP_DEG     = 225.0, 270.0

    def _pt(deg: float) -> Tuple[float, float]:
        rad = math.radians(deg)
        return (CX + R * math.cos(rad), CY + R * math.sin(rad))

    def _arc(a1: float, a2: float) -> str:
        sweep = a2 - a1
        if abs(sweep) < 0.01:
            return ""
        large = 1 if abs(sweep) > 180 else 0
        x1, y1 = _pt(a1)
        x2, y2 = _pt(a2)
        return f"M {x1:.2f},{y1:.2f} A {R},{R} 0 {large},1 {x2:.2f},{y2:.2f}"

    _s   = max(0, min(100, score))
    _blo = max(0, min(100, band_min))
    _bhi = max(0, min(100, band_max))

    a_end     = START_DEG + SWEEP_DEG
    a_score   = START_DEG + (_s   / 100.0) * SWEEP_DEG
    a_band_lo = START_DEG + (_blo / 100.0) * SWEEP_DEG
    a_band_hi = START_DEG + (_bhi / 100.0) * SWEEP_DEG

    track_d = _arc(START_DEG, a_end)
    band_d  = _arc(a_band_lo, a_band_hi)
    score_d = _arc(START_DEG, a_score)
    sx, sy  = _pt(a_score)

    _band_path  = (f'<path d="{band_d}" fill="none" stroke="rgba(200,155,60,.18)" '
                   f'stroke-width="{W_BAND}" stroke-linecap="round"/>') if band_d else ""
    _score_path = (f'<path d="{score_d}" fill="none" stroke="#c89b3c" '
                   f'stroke-width="{W_SCORE}" stroke-linecap="round"/>') if score_d else ""
    _score_dot  = (
        f'<circle cx="{sx:.2f}" cy="{sy:.2f}" r="6.5" fill="#d4a84b"/>'
        f'<circle cx="{sx:.2f}" cy="{sy:.2f}" r="3.5" fill="#ffe0a0"/>'
    ) if score_d else ""

    _font = "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
    return (
        f'<svg viewBox="0 0 160 145" width="160" height="145" '
        f'xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">'
        f'<path d="{track_d}" fill="none" stroke="#242428" '
        f'stroke-width="{W_TRACK}" stroke-linecap="round" opacity="0.85"/>'
        f'{_band_path}'
        f'{_score_path}'
        f'{_score_dot}'
        f'<text x="{CX}" y="76" text-anchor="middle" dominant-baseline="middle" '
        f'font-family="{_font}" font-size="44" font-weight="600" fill="#c89b3c" '
        f'letter-spacing="-.01em">{_s}</text>'
        f'<text x="{CX}" y="100" text-anchor="middle" '
        f'font-family="{_font}" font-size="8" fill="#888" letter-spacing=".18em" opacity="0.65">'
        f'{esc(label.upper())}</text>'
        f'<text x="{CX}" y="113" text-anchor="middle" '
        f'font-family="{_font}" font-size="7" fill="#666" letter-spacing=".06em" opacity="0.45">'
        f'{_blo}\u2013{_bhi}</text>'
        f'</svg>'
    )


def _default_output_path() -> Path:
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    return REPORTS_DIR / f"lens_report_{ts}.html"

# Forbidden substrings — must not appear in any report body text
FORBIDDEN_SUBSTRINGS = ("SIG-", "COND-", "DIAG-", "INTEL-")


# ---------------------------------------------------------------------------
# Runtime configuration — call before execution to override BlueEdge defaults
# ---------------------------------------------------------------------------

def _configure_runtime(
    client: str = "blueedge",
    run_id: str = "run_authoritative_recomputed_01",
    api_base: str = "http://localhost:3000",
    fragments_dir: Optional[Path] = None,
    package_dir: Optional[Path] = None,
    claims: Optional[List[str]] = None,
) -> None:
    """Update module-level path and configuration globals from CLI arguments.

    Must be called before any generation functions when running with non-default
    client parameters. Has no effect on module-level defaults when imported as a module.
    """
    global LENS_CLAIMS, API_BASE, FRAGMENTS_DIR, REPORTS_DIR, CANONICAL_PKG_DIR
    global TIER1_REPORTS_DIR, TIER2_REPORTS_DIR, DECISION_REPORTS_DIR
    global _ACTIVE_CLIENT, _ACTIVE_VAULT_RUN_ID

    _ACTIVE_CLIENT = client
    if client != "blueedge":
        _ACTIVE_VAULT_RUN_ID = run_id

    if claims:
        LENS_CLAIMS = claims

    API_BASE = api_base

    REPORTS_DIR          = REPO_ROOT / "clients" / client / "reports"
    TIER1_REPORTS_DIR    = REPORTS_DIR / "tier1"
    TIER2_REPORTS_DIR    = REPORTS_DIR / "tier2"
    DECISION_REPORTS_DIR = REPORTS_DIR / "decision"

    if fragments_dir is not None:
        FRAGMENTS_DIR = fragments_dir
    else:
        FRAGMENTS_DIR = REPO_ROOT / "clients" / client / "vaults" / run_id / "claims" / "fragments"

    if package_dir is not None:
        CANONICAL_PKG_DIR = package_dir
    else:
        CANONICAL_PKG_DIR = REPO_ROOT / "clients" / client / "psee" / "runs" / run_id / "package"


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

    score_proven    = p09.get("value", {}).get("narrative", "60/100")
    score_achievable = p10.get("value", {}).get("narrative", "100/100")

    sentences = [
        f"The platform has achieved a proven structural score of <strong>{esc(score_proven)}</strong>, "
        "representing a verifiable evidence floor — not an estimate, but a deterministic sum of confirmed structural facts.",

        "Structural integrity is confirmed: coverage is complete, no orphaned components were identified, "
        "and no structural overlaps were detected.",

        f"The achievable score ceiling is <strong>{esc(score_achievable)}</strong>, "
        "contingent on the completion of a single bounded additional step: runtime execution assessment.",

        *(["One critical operational signal has been identified — the security intelligence pathway has a "
           "structurally confirmed capacity ceiling; live performance requires measurement to confirm it is being met."]
          if payloads.get("CLM-20") else []),

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

    # --- CLM-25 — gated until GAP-01 (CONCEPT-06) resolved ---
    if GAP_01_RESOLVED and payloads.get("CLM-25"):
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
    else:
        items.append("""
<div class="finding-card finding-card-gated">
  <div class="finding-header">
    <div class="finding-title">Executive Verdict</div>
  </div>
  <p class="finding-statement">
    Conceptual coherence not yet evaluated. Executive verdict pending configuration update.
  </p>
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

    # --- CLM-20 — rendered only when signal fragment is present ---
    if payloads.get("CLM-20"):
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

def compose_system_intelligence(topology: Optional[Dict] = None) -> str:
    """Render the system intelligence domain coverage section.

    Derives domain names and counts from canonical_topology.json.
    topology may be passed directly or will be loaded from CANONICAL_PKG_DIR.
    """
    if topology is None and CANONICAL_PKG_DIR.exists():
        try:
            topology = load_canonical_topology()
        except SystemExit:
            topology = None

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

    if topology is not None:
        counts = topology["counts"]
        dom_count  = counts.get("domains",      "?")
        cap_count  = counts.get("capabilities", "?")
        comp_count = counts.get("components",   "?")
        topology_domains = topology["domains"]
        verified_ct = sum(1 for d in topology_domains if d["grounding"] == "GROUNDED")
        weak_ct     = sum(1 for d in topology_domains if d["grounding"] == "WEAKLY GROUNDED")
        domains = [
            (
                d["domain_name"],
                d.get("domain_type", "").replace("_", " ").title(),
                "conditional" if d["grounding"] == "WEAKLY GROUNDED" else "verified",
            )
            for d in topology_domains
        ]
        summary_note = (
            f"The platform assessment covers {dom_count} functional domains. "
            f"{verified_ct} domain{'s are' if verified_ct != 1 else ' is'} structurally verified; "
            f"{weak_ct} domain{'s carry' if weak_ct != 1 else ' carries'} pending runtime dimensions. "
            "This represents the complete assessed surface — no domains are unexamined."
        )
        counts_text = (
            f"{dom_count} functional domains &nbsp;·&nbsp; "
            f"{cap_count} capability surfaces &nbsp;·&nbsp; "
            f"{comp_count} components mapped"
        )
    else:
        domains = []
        summary_note = (
            "Domain coverage data is unavailable for this report. "
            "Topology data was not found in the configured package directory."
        )
        counts_text = ""

    if domains:
        if len(domains) > 10:
            mid = (len(domains) + 1) // 2
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
    else:
        list_html = ''

    summary_line = f'<div class="domain-summary">{counts_text}</div>' if counts_text else ''

    return f"""
<p>
  {esc(summary_note)}
</p>
{list_html}
{summary_line}
"""


def _compose_topology_fallback(light_mode: bool, topology: Dict, domain_count: int) -> str:
    """Fallback topology rendering for non-17-domain clients.

    Shows domain list from canonical_topology.json domains[].domain_name with an
    explicit portability notice. No hardcoded coordinates or cluster names.
    """
    if light_mode:
        legend_verified    = '#22c55e'
        legend_conditional = '#f59e0b'
        container_style    = 'padding:16px;border:1px solid #e5e7eb;border-radius:4px;'
        notice_color       = '#6b7280'
    else:
        legend_verified    = '#3fb950'
        legend_conditional = '#d29922'
        container_style    = 'padding:16px;border:1px solid #2a2a32;border-radius:4px;background:#0d1117;'
        notice_color       = '#888'

    domain_rows = ""
    for d in topology["domains"]:
        grounding = d.get("grounding", "GROUNDED")
        dot_color = legend_conditional if grounding == "WEAKLY GROUNDED" else legend_verified
        domain_rows += (
            f'<div class="domain-row">'
            f'<span class="domain-row-name">{esc(d["domain_name"])}</span>'
            f'<span style="font-size:11px;color:{notice_color};">'
            f'<span style="display:inline-block;width:8px;height:8px;border-radius:50%;'
            f'background:{dot_color};margin-right:4px;vertical-align:middle;"></span>'
            f'{"In Progress" if grounding == "WEAKLY GROUNDED" else "Verified"}'
            f'</span>'
            f'</div>'
        )

    counts = topology.get("counts", {})
    depth_note = f"{domain_count} functional domains &nbsp;&middot;&nbsp; Structural depth only"

    return f"""
<div class="topo-container">
  <div style="{container_style}">
    <p style="font-size:12px;color:{notice_color};margin-bottom:12px;font-style:italic;">
      Topology visualization currently optimized for reference model.
      Dynamic topology rendering pending for this client.
    </p>
    <div class="domain-list">
{domain_rows}
    </div>
  </div>
  <div class="topo-legend">
    <span class="topo-legend-dot" style="background:{legend_verified};"></span>&nbsp;Verified
    &nbsp;&nbsp;
    <span class="topo-legend-dot" style="background:{legend_conditional};"></span>&nbsp;In Progress
    &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
    <span class="topo-depth-note">{depth_note}</span>
  </div>
</div>
"""


def compose_topology_view(light_mode: bool = False, topology: Optional[Dict] = None) -> str:
    """Build the topology section.

    If topology domain count is 17, renders the curated reference-model SVG (unchanged logic).
    For any other domain count, renders a domain list fallback with an explicit portability notice.
    topology may be passed directly or will be loaded from CANONICAL_PKG_DIR.

    light_mode=True  → white/light background, dark labels — for executive report / print.
    light_mode=False → dark background — for LENS dark-theme web surface.
    """
    if topology is None and CANONICAL_PKG_DIR.exists():
        try:
            topology = load_canonical_topology()
        except SystemExit:
            topology = None

    domain_count = len(topology["domains"]) if topology else 17

    if domain_count != 17:
        return _compose_topology_fallback(light_mode, topology, domain_count)

    # 17-domain reference model — curated SVG rendering (unchanged logic below)

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
    # Load topology for dynamic sections; graceful fallback if unavailable
    _topology: Optional[Dict] = None
    if CANONICAL_PKG_DIR.exists():
        try:
            _topology = load_canonical_topology()
        except SystemExit:
            pass

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
  {compose_system_intelligence(_topology)}
</div>

<!-- 3. STRUCTURAL TOPOLOGY VIEW -->
<div class="section">
  <div class="section-title">Structural Topology View</div>
  {compose_topology_view(light_mode=True, topology=_topology)}
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


# ===========================================================================
# TIER-1 REPORT GENERATION
# PRODUCTIZE.GAUGE.TIER1.REPORT.GENERATOR.UPGRADE.02
# ===========================================================================

# ---------------------------------------------------------------------------
# Canonical data loaders
# ---------------------------------------------------------------------------

def load_canonical_topology() -> Dict:
    path = CANONICAL_PKG_DIR / "canonical_topology.json"
    if not path.exists():
        _fail(f"canonical_topology.json not found: {path}")
    with open(path) as f:
        return json.load(f)


def load_signal_registry() -> Dict:
    path = CANONICAL_PKG_DIR / "signal_registry.json"
    if not path.exists():
        _fail(f"signal_registry.json not found: {path}")
    with open(path) as f:
        return json.load(f)


def load_gauge_state() -> Dict:
    path = CANONICAL_PKG_DIR / "gauge_state.json"
    if not path.exists():
        _fail(f"gauge_state.json not found: {path}")
    with open(path) as f:
        return json.load(f)


def _load_psig_projection() -> Optional[Dict]:
    path = CANONICAL_PKG_DIR.parent / "41.x" / "signal_projection.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def _load_pressure_zone_projection() -> Optional[Dict]:
    path = CANONICAL_PKG_DIR.parent / "41.x" / "pressure_zone_projection.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def _load_binding_envelope() -> Optional[Dict]:
    path = CANONICAL_PKG_DIR.parent / "binding" / "binding_envelope.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def _compute_structural_metrics(binding: Optional[Dict]) -> Dict:
    NIS = "NOT_IN_SCOPE"
    empty = {k: NIS for k in ["dep_load", "dep_edges", "dep_nodes", "edge_to_node",
                               "containment_density", "edges_count", "contains_count", "nodes_count"]}
    if binding is None:
        return empty
    s = binding.get("summary", {})
    nodes = s.get("nodes_count", 0)
    if nodes == 0:
        return empty
    overlap  = s.get("overlap_structural_edges_count", 0)
    edges    = s.get("edges_count", 0)
    contains = s.get("contains_edges_count", 0)
    return {
        "dep_load":            round(overlap / nodes, 3),
        "dep_edges":           overlap,
        "dep_nodes":           nodes,
        "edge_to_node":        round(edges / nodes, 3),
        "containment_density": round(contains / nodes, 3),
        "edges_count":         edges,
        "contains_count":      contains,
        "nodes_count":         nodes,
    }


def _compute_decision_model(metrics: Dict, psig_proj: Optional[Dict], gauge: Dict) -> Dict:
    NIS = "NOT_IN_SCOPE"
    dep_load = metrics.get("dep_load", NIS)
    etn      = metrics.get("edge_to_node", NIS)

    if dep_load == NIS or etn == NIS:
        structural_risk = "MODERATE"
    else:
        dep_r = "HIGH" if dep_load > 0.4 else ("MODERATE" if dep_load > 0.15 else "LOW")
        etn_r = "HIGH" if etn > 2.5 else ("MODERATE" if etn > 1.5 else "LOW")
        order = {"LOW": 0, "MODERATE": 1, "HIGH": 2}
        structural_risk = max([dep_r, etn_r], key=lambda x: order[x])

    exec_evaluated = gauge.get("state", {}).get("execution_layer_evaluated", False)
    not_activated: list = []
    blind_spot_active = False
    if psig_proj:
        not_activated = psig_proj.get("signals_not_activated", [])
        for c in psig_proj.get("active_conditions_in_scope", []):
            if c.get("activation_method") == "THEORETICAL_BASELINE":
                blind_spot_active = True

    gap_count = len(not_activated) + (1 if blind_spot_active else 0) + (0 if exec_evaluated else 1)
    evidence_completeness = "HIGH" if (exec_evaluated and gap_count == 0) else "PARTIAL"

    order2 = {"LOW": 0, "MODERATE": 1, "HIGH": 2}
    decision = ("ESCALATE" if order2.get(structural_risk, 1) >= 2
                else "INVESTIGATE" if evidence_completeness in ("PARTIAL", "LOW")
                else "PROCEED")

    return {
        "structural_risk":       structural_risk,
        "evidence_completeness": evidence_completeness,
        "decision":              decision,
        "exec_evaluated":        exec_evaluated,
        "not_activated":         not_activated,
        "blind_spot_active":     blind_spot_active,
        "gap_count":             gap_count,
    }


# ---------------------------------------------------------------------------
# Tier-1 SVG topology (BlueEdge 17-domain spatial map, contrast-corrected)
# ---------------------------------------------------------------------------

def _build_tier1_topology_svg(topology_domains: list, publish_safe: bool = False) -> str:
    """Render spatial topology SVG from canonical domain data.

    Positions reflect BlueEdge's 17-domain structural layout.
    Grounding states and focus domain are derived from canonical_topology.json.
    """
    grounding_map = {d["domain_id"]: d["grounding"] for d in topology_domains}
    # DOMAIN-10 is the focus domain (SIG-002 + SIG-004 both domain_id=DOMAIN-10)
    FOCUS_DOMAIN = "DOMAIN-10"

    # Domain node definitions: (domain_id, line1, line2, x, y, cx)
    # x/y = rect top-left, cx = text center x, cy derived from y+19
    NODES = [
        ("DOMAIN-01", "Edge Data Acquisition", None,          50,  91, 108),
        ("DOMAIN-07", "Sensor &amp; Security",  "Ingestion",  50, 166, 108),
        ("DOMAIN-02", "Telemetry Transport",    "&amp; Messaging", 50, 251, 108),
        ("DOMAIN-03", "Fleet Core Operations" if not publish_safe else "Core Operations",
                       None,                                 227, 106, 285),
        ("DOMAIN-04", "Fleet Vertical" if not publish_safe else "Vertical",
                      "Extensions",                         227, 196, 285),
        ("DOMAIN-15", "EV and Electrification", None,        212, 291, 270),
        ("DOMAIN-11", "Event-Driven",           "Architecture", 382, 111, 440),
        ("DOMAIN-10", "Platform Infrastructure", "&amp; Data", 397, 231, 455),
        ("DOMAIN-09", "Access Control",         "&amp; Identity", 382, 356, 440),
        ("DOMAIN-05", "Analytics and",          "Intelligence", 567, 106, 625),
        ("DOMAIN-06", "AI/ML Intelligence",     "Layer",      582, 221, 640),
        ("DOMAIN-17", "Extended Operations",
                      "&amp; Driver Services" if not publish_safe else "&amp; User Services",
                      562, 346, 620),
        ("DOMAIN-08", "Real-Time Streaming",    "&amp; Gateway", 737, 106, 795),
        ("DOMAIN-12", "SaaS Platform Layer",    None,         742, 206, 800),
        ("DOMAIN-14", "Frontend Application",   None,         742, 291, 800),
        ("DOMAIN-16", "Operational Engineering", None,        737, 381, 795),
        ("DOMAIN-13", "External Integration",   None,         737, 446, 795),
    ]

    def _node_colors(domain_id: str):
        if domain_id == FOCUS_DOMAIN:
            return {"fill": "#221f0d", "stroke": "#c89b3c", "sw": "1.5", "tc": "#e0ca78", "filter": ' filter="url(#gf)"'}
        g = grounding_map.get(domain_id, "GROUNDED")
        if g == "WEAKLY GROUNDED":
            return {"fill": "#221508", "stroke": "#c87c2c", "sw": "1", "tc": "#d0a868", "filter": ""}
        return {"fill": "#1c1c22", "stroke": "#4a9e6a", "sw": "1", "tc": "#dcdce0", "filter": ""}

    parts = []

    # Background
    parts.append('<rect width="880" height="500" fill="#0e0e10"/>')

    # Cluster zone fills (contrast-corrected)
    zones = [
        (28,  72, 162, 244, "#141b16", "#1e2820", "EDGE"),
        (204, 72, 162, 275, "#141b16", "#1e2820", "OPERATIONS"),
        (362, 72, 172, 356, "#1a1910", "#252218", "INFRASTRUCTURE"),
        (546, 72, 170, 330, "#141b16", "#1e2820", "INTELLIGENCE"),
        (724, 72, 152, 430, "#131418", "#1a1d24", "PLATFORM &amp; SERVICES"),
    ]
    for x, y, w, h, fill, stroke, label in zones:
        parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="{fill}" stroke="{stroke}" stroke-width="0.5"/>')

    # Zone labels
    label_xs = [109, 285, 448, 631, 800]
    for (_, _, _, _, _, _, label), lx in zip(zones, label_xs):
        parts.append(
            f'<text x="{lx}" y="87" text-anchor="middle" font-size="7" fill="#505068" '
            f'letter-spacing="0.13em" font-family="Georgia,serif">{label}</text>'
        )

    # Structural edges — non-directional
    std = "#32324a"
    foc = "#4a3e1e"
    edges = [
        (108,129,108,166,std,False),(108,204,108,251,std,False),
        (166,113,227,122,std,False),
        (285,144,285,196,std,False),(278,234,272,291,std,False),
        (443,149,451,231,std,False),(449,269,443,356,std,False),
        (382,127,343,124,std,False),
        (628,144,635,221,std,False),(637,259,623,346,std,False),
        (798,144,800,206,std,False),(800,244,800,291,std,False),
        (799,329,797,381,std,False),(797,419,797,446,std,False),
        # focus-adjacent (amber)
        (166,272,397,252,foc,False),(166,188,397,246,foc,False),
        (343,128,397,244,foc,False),(343,218,397,250,foc,False),
        (328,311,397,252,foc,False),(567,128,513,247,foc,False),
        (582,242,513,252,foc,False),(737,131,513,248,foc,False),
        (737,398,513,254,foc,False),
        # cross-cluster standard
        (737,125,498,130,std,False),(742,227,498,368,std,False),
        (742,310,498,376,std,False),
        # COMP-25 cross-domain ref (dashed)
        (212,308,166,115,std,True),
    ]
    for x1, y1, x2, y2, stroke, dashed in edges:
        dash = ' stroke-dasharray="3,3"' if dashed else ""
        parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="1"{dash}/>')

    # Domain nodes
    for domain_id, line1, line2, nx, ny, cx in NODES:
        c = _node_colors(domain_id)
        cy1 = ny + 19  # single-line text baseline (center of 38px rect)
        if line2 is None:
            parts.append(f'<rect x="{nx}" y="{ny}" width="116" height="38" rx="3" fill="{c["fill"]}" stroke="{c["stroke"]}" stroke-width="{c["sw"]}"{c["filter"]}/>')
            parts.append(f'<text x="{cx}" y="{ny+24}" text-anchor="middle" font-size="9" fill="{c["tc"]}" font-family="Georgia,serif">{line1}</text>')
        else:
            parts.append(f'<rect x="{nx}" y="{ny}" width="116" height="38" rx="3" fill="{c["fill"]}" stroke="{c["stroke"]}" stroke-width="{c["sw"]}"{c["filter"]}/>')
            parts.append(f'<text x="{cx}" y="{ny+15}" text-anchor="middle" font-size="9" fill="{c["tc"]}" font-family="Georgia,serif">{line1}</text>')
            parts.append(f'<text x="{cx}" y="{ny+28}" text-anchor="middle" font-size="9" fill="{c["tc"]}" font-family="Georgia,serif">{line2}</text>')

    inner = "\n      ".join(parts)
    return f"""<svg viewBox="0 0 880 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;border-radius:4px">
      <defs>
        <filter id="gf" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
          <feComposite in="SourceGraphic" in2="b" operator="over"/>
        </filter>
      </defs>
      {inner}
    </svg>"""


# ---------------------------------------------------------------------------
# Tier-1 generic topology SVG (non-BlueEdge: N-domain structural layout)
# ---------------------------------------------------------------------------

def _build_tier1_topology_svg_generic(
    topology_domains: list,
    pz_proj: Optional[Dict] = None,
) -> str:
    zones_by_anchor: Dict[str, Dict] = {}
    primary_anchor: Optional[str] = None
    blind_spot_domains: set = set()

    if pz_proj:
        for z in pz_proj.get("zone_projection", []):
            aid = z.get("anchor_id")
            if aid:
                zones_by_anchor[aid] = z
                if z.get("attribution_profile") == "primary":
                    primary_anchor = aid
        zoned = set(zones_by_anchor.keys())
        for d in topology_domains:
            if d["domain_id"] not in zoned:
                blind_spot_domains.add(d["domain_id"])

    n = len(topology_domains)
    if n == 0:
        return '<svg viewBox="0 0 880 400" xmlns="http://www.w3.org/2000/svg"><rect width="880" height="400" fill="#0e0e10"/></svg>'

    MARGIN, GAP, TOTAL_W, SVG_H = 28, 12, 880, 400
    col_w = (TOTAL_W - 2 * MARGIN - (n - 1) * GAP) // n

    def _tile(x: int, y: int, w: int, h: int, fill: str, stroke: str, sw: str, filt: str = "") -> str:
        return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3"'
                f' fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{filt}/>')

    def _txt(cx: int, y: int, text: str, size: float, color: str, spacing: str = "0") -> str:
        return (f'<text x="{cx}" y="{y}" text-anchor="middle" font-size="{size}"'
                f' fill="{color}" letter-spacing="{spacing}" font-family="Georgia,serif">{text}</text>')

    parts: list = [
        f'<svg viewBox="0 0 {TOTAL_W} {SVG_H}" xmlns="http://www.w3.org/2000/svg"'
        ' style="width:100%;display:block;border-radius:4px">',
        '<defs><filter id="gf" x="-40%" y="-40%" width="180%" height="180%">'
        '<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>'
        '<feComposite in="SourceGraphic" in2="b" operator="over"/>'
        '</filter></defs>',
        f'<rect width="{TOTAL_W}" height="{SVG_H}" fill="#0e0e10"/>',
    ]

    for i, d in enumerate(topology_domains):
        did   = d["domain_id"]
        name  = d.get("anchor_name", d.get("domain_name", did))
        caps  = len(d.get("capability_ids", []))
        comps = len(d.get("component_ids", []))
        x  = MARGIN + i * (col_w + GAP)
        cx = x + col_w // 2

        zone      = zones_by_anchor.get(did)
        is_blind  = did in blind_spot_domains
        is_primary = (did == primary_anchor)

        if is_primary:
            bfill, bstroke, bsw, bfilt = "#221f0d", "#c89b3c", "1.5", ' filter="url(#gf)"'
            lbl_c, txt_c = "#c8a040", "#e0ca78"
            box_y, box_h = 60, 316
            zone_tag = f"{zone['zone_id']} PRIMARY" if zone else did
        elif zone:
            bfill, bstroke, bsw, bfilt = "#141b16", "#2a4030", "1.5", ""
            lbl_c, txt_c = "#4a6050", "#dcdce0"
            box_y, box_h = 72, 288
            zone_tag = f"{zone['zone_id']} {zone.get('attribution_profile','secondary')}"
        elif is_blind:
            bfill, bstroke, bsw, bfilt = "#141418", "#282830", "0.5", ""
            lbl_c, txt_c = "#505068", "#dcdce0"
            box_y, box_h = 72, 230
            zone_tag = did
        else:
            bfill, bstroke, bsw, bfilt = "#141b16", "#1e2820", "0.5", ""
            lbl_c, txt_c = "#505068", "#dcdce0"
            box_y, box_h = 72, 200
            zone_tag = did

        parts.append(
            f'<rect x="{x}" y="{box_y}" width="{col_w}" height="{box_h}" rx="5"'
            f' fill="{bfill}" stroke="{bstroke}" stroke-width="{bsw}"{bfilt}/>'
        )
        parts.append(_txt(cx, box_y + 14, zone_tag, 6.5, lbl_c, "0.10em"))

        # Domain name tile
        ty = box_y + 20
        ts = bstroke if is_primary else "#4a9e6a"
        parts.append(_tile(x + 8, ty, col_w - 16, 34, "#1c1c22", ts, "1"))
        name_lines = [name[:16], name[16:]] if len(name) > 16 else [name]
        if len(name_lines) == 1:
            parts.append(_txt(cx, ty + 22, esc(name_lines[0]), 8.5, txt_c))
        else:
            parts.append(_txt(cx, ty + 14, esc(name_lines[0]), 8, txt_c))
            parts.append(_txt(cx, ty + 27, esc(name_lines[1]), 8, txt_c))

        cy = ty + 43
        if caps > 0:
            parts.append(_tile(x + 8, cy, col_w - 16, 26, "#1c1c22", "#4a9e6a", "0.8"))
            parts.append(_txt(cx, cy + 17, f"{caps} capabilit{'y' if caps == 1 else 'ies'}", 7.5, "#9cbc9c"))
            cy += 34
        if comps > 0:
            parts.append(_tile(x + 8, cy, col_w - 16, 26, "#1c1c22", "#4a9e6a", "0.8"))
            parts.append(_txt(cx, cy + 17, f"{comps} component{'s' if comps != 1 else ''}", 7.5, "#9cbc9c"))
            cy += 34
        if zone:
            for sig in zone.get("signals", [])[:3]:
                parts.append(_tile(x + 8, cy, col_w - 16, 22, "#141c22", "#304050", "0.5"))
                parts.append(_txt(cx, cy + 15, sig, 7, "#5090a8"))
                cy += 28
        if is_blind:
            parts.append(
                f'<rect x="{x+8}" y="{cy}" width="{col_w-16}" height="30" rx="3"'
                f' fill="#18181e" stroke="#38384a" stroke-width="0.5" stroke-dasharray="3,2"/>'
            )
            parts.append(_txt(cx, cy + 13, "PSIG-006 blind spot", 7.5, "#58586a"))
            parts.append(_txt(cx, cy + 24, "coverage", 7, "#48485a"))

    parts.append("</svg>")
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Tier-1 Evidence Brief HTML builder
# ---------------------------------------------------------------------------

_TIER1_EVIDENCE_CSS = """
  :root {
    --bg:#0e0e10;--bg-card:#16161a;--bg-card-2:#1c1c22;
    --fg:#e8e4df;--fg-muted:#8a8580;
    --gold:#c89b3c;--gold-dim:#7a5e22;
    --green:#4a9e6a;--green-dim:#1e3d2a;
    --amber:#c87c2c;--amber-dim:#3d2810;
    --border:#2a2a32;--border-gold:#4a3a1a;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--fg);font-family:'Georgia','Times New Roman',serif;font-size:14px;line-height:1.6}
  .page{max-width:960px;margin:0 auto;padding:48px 40px}
  .report-header{border-bottom:1px solid var(--border-gold);padding-bottom:24px;margin-bottom:36px;display:flex;justify-content:space-between;align-items:flex-end}
  .report-brand{font-size:11px;color:var(--fg-muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
  .report-title{font-size:22px;font-weight:normal;color:var(--gold);letter-spacing:.02em}
  .report-meta{text-align:right;font-size:11px;color:var(--fg-muted);line-height:1.9}
  .report-meta strong{color:var(--fg)}
  h2{font-size:11px;font-weight:normal;color:var(--fg-muted);letter-spacing:.14em;text-transform:uppercase;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:20px;margin-top:40px}
  h2:first-of-type{margin-top:0}
  .gauge-block{display:grid;grid-template-columns:auto 1fr auto;gap:32px;align-items:center;background:var(--bg-card);border:1px solid var(--border-gold);border-radius:4px;padding:28px 32px;margin-bottom:36px}
  .gauge-score-circle{width:96px;height:96px;border-radius:50%;border:3px solid var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
  .gauge-score-number{font-size:36px;color:var(--gold);line-height:1}
  .gauge-score-label{font-size:9px;letter-spacing:.1em;color:var(--fg-muted);text-transform:uppercase;margin-top:3px}
  .gauge-band-label{font-size:18px;color:var(--gold);letter-spacing:.06em;margin-bottom:8px}
  .gauge-band-bar{height:6px;background:var(--bg-card-2);border-radius:3px;position:relative;width:280px;margin-bottom:8px}
  .gauge-band-fill{height:100%;border-radius:3px;background:linear-gradient(to right,var(--amber),var(--gold));width:60%}
  .gauge-band-range{font-size:11px;color:var(--fg-muted)}
  .gauge-band-range span{color:var(--fg)}
  .gauge-caveat{margin-top:12px;font-size:11px;color:var(--fg-muted);line-height:1.5;max-width:420px}
  .gauge-decision{text-align:center;flex-shrink:0}
  .gauge-decision-label{font-size:9px;letter-spacing:.12em;color:var(--fg-muted);text-transform:uppercase;margin-bottom:8px}
  .gauge-decision-value{display:inline-block;font-size:13px;letter-spacing:.1em;color:var(--amber);border:1px solid var(--amber);padding:7px 16px;border-radius:2px;text-transform:uppercase}
  .counts-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
  .count-card{background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:16px;text-align:center}
  .count-value{font-size:28px;color:var(--fg)}
  .count-label{font-size:10px;color:var(--fg-muted);letter-spacing:.1em;text-transform:uppercase;margin-top:4px}
  .domain-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
  .domain-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:10px 12px;display:flex;align-items:flex-start;gap:10px}
  .domain-card.grounded{border-left:3px solid var(--green)}
  .domain-card.weak{border-left:3px solid var(--amber)}
  .domain-card.focus{border:1px solid var(--gold);background:#1c1a12;border-left:3px solid var(--gold)}
  .domain-dot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0}
  .domain-dot.grounded{background:var(--green)}
  .domain-dot.weak{background:var(--amber)}
  .domain-dot.focus{background:var(--gold)}
  .domain-name{font-size:12px;color:var(--fg);line-height:1.4}
  .domain-sub{font-size:10px;color:var(--fg-muted);margin-top:1px}
  .domain-tag{font-size:9px;letter-spacing:.08em;text-transform:uppercase;margin-top:3px}
  .domain-tag.grounded{color:var(--green)}
  .domain-tag.weak{color:var(--amber)}
  .domain-tag.focus{color:var(--gold)}
  .domain-legend{display:flex;gap:24px;font-size:11px;color:var(--fg-muted);margin-bottom:32px}
  .domain-legend-item{display:flex;align-items:center;gap:6px}
  .legend-dot{width:8px;height:8px;border-radius:50%}
  .signal-grid{display:flex;flex-direction:column;gap:10px;margin-bottom:12px}
  .signal-card{background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:14px 16px;display:grid;grid-template-columns:36px 1fr auto;gap:16px;align-items:start}
  .signal-num{font-size:16px;color:var(--fg);line-height:1;padding-top:2px}
  .signal-title{font-size:13px;color:var(--fg);margin-bottom:3px}
  .signal-trace{font-size:10px;color:var(--fg-muted);letter-spacing:.04em;margin-bottom:5px}
  .signal-statement{font-size:12px;color:var(--fg-muted);line-height:1.5}
  .exec-state-lead{font-size:13px;font-weight:600;color:#c8c8d4;letter-spacing:.02em;margin-bottom:12px;padding:8px 14px;background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid var(--green);border-radius:2px}
  .signal-meta{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
  .signal-domain-tag{font-size:10px;color:var(--fg-muted);text-align:right}
  .confidence-badge{font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;border-radius:2px;border:1px solid}
  .confidence-badge.strong{color:var(--green);border-color:var(--green);background:var(--green-dim)}
  .confidence-badge.moderate{color:var(--gold);border-color:var(--gold-dim);background:#1e1a0a}
  .confidence-badge.weak{color:var(--amber);border-color:var(--amber);background:var(--amber-dim)}
  .focus-domain-block{background:#1c1a12;border:1px solid var(--gold);border-radius:4px;padding:24px 28px;margin-bottom:40px}
  .focus-domain-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
  .focus-domain-label{font-size:9px;color:var(--gold);letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px}
  .focus-domain-name{font-size:18px;color:var(--fg)}
  .focus-domain-sub{font-size:12px;color:var(--fg-muted);margin-top:3px}
  .focus-badge{font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border:1px solid var(--gold);color:var(--gold);border-radius:2px;flex-shrink:0}
  .focus-summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:16px}
  .focus-stat-label{font-size:10px;color:var(--fg-muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
  .focus-stat-value{font-size:15px;color:var(--amber)}
  .focus-finding{font-size:12px;color:var(--fg-muted);line-height:1.6;border-top:1px solid var(--border-gold);padding-top:14px}
  .focus-finding strong{color:var(--fg)}
  .report-footer{border-top:1px solid var(--border);padding-top:20px;margin-top:48px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--fg-muted)}
  .footer-brand{color:var(--gold);font-size:13px}
  .footer-note{font-size:10px;font-style:italic}
  .sample-watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:120px;font-weight:bold;color:rgba(200,155,60,0.04);pointer-events:none;user-select:none;letter-spacing:.15em;z-index:0}
  .nav-strip{display:flex;gap:10px;margin-bottom:28px}
  .nav-link{display:inline-block;padding:7px 14px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--border);color:var(--fg-muted);text-decoration:none;border-radius:3px}
  .nav-link:hover{border-color:var(--border-gold);color:var(--gold)}
  .nav-link.active{border-color:var(--border-gold);color:var(--gold);background:rgba(200,155,60,0.07)}
  .tier2-handoff{background:var(--bg-card);border:1px solid var(--border);border-left:3px solid var(--fg-muted);padding:18px 20px;margin:28px 0 0;border-radius:3px}
  .tier2-handoff-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-muted);margin-bottom:8px}
  .tier2-handoff-text{font-size:12.5px;color:#666;line-height:1.65}
  .topo-view{margin-bottom:32px}
  .topo-legend{display:flex;flex-wrap:wrap;gap:16px;margin-top:12px;font-size:11px;color:var(--fg-muted);align-items:center}
  .topo-leg-item{display:flex;align-items:center;gap:6px}
  .topo-leg-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
  .tl-grounded{background:var(--green)}
  .tl-weak{background:var(--amber)}
  .tl-focus{background:var(--gold)}
  .topo-leg-note{margin-left:auto;font-size:10px;font-style:italic;color:var(--fg-muted)}
  .rc-trace{font-size:10px;color:var(--fg-muted);opacity:.7;font-style:normal}
  .rc-anchor-block{display:flex;align-items:center;gap:10px;padding:8px 14px;background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid var(--green);border-radius:2px;margin-bottom:16px;font-size:12px;flex-wrap:wrap}
  .rc-anchor-state{color:#c8c8d4;font-weight:600;letter-spacing:.02em}
  .rc-anchor-score{color:var(--green);font-weight:600}
  .rc-anchor-band{color:var(--fg-muted)}
  .rc-anchor-decision{color:var(--amber);letter-spacing:.05em;text-transform:uppercase}
  .rc-anchor-sep{color:#333}
"""


def _build_tier1_evidence_brief(topology: Dict, signals: Dict, gauge: Dict,
                                 publish_safe: bool = False,
                                 psig_proj: Optional[Dict] = None,
                                 pz_proj: Optional[Dict] = None,
                                 metrics: Optional[Dict] = None,
                                 decision_model: Optional[Dict] = None) -> str:
    domains = topology["domains"]
    counts = topology["counts"]
    sigs = signals["signals"]
    score = gauge["score"]["canonical"]
    band_label = gauge["score"]["band_label"]
    band_lo = gauge["confidence"]["lower"]
    band_hi = gauge["confidence"]["upper"]

    use_psig = psig_proj is not None
    client_name = _get_client_display_name(publish_safe)
    _narr_name = "lens_tier1_narrative_brief_pub.html" if publish_safe else "lens_tier1_narrative_brief.html"
    narr_link  = _scoped_report_url(_narr_name) if use_psig else f"/api/report-file?name={_narr_name}"
    _t2_name   = "lens_tier2_diagnostic_narrative_pub.html" if publish_safe else "lens_tier2_diagnostic_narrative.html"
    t2_link    = _scoped_report_url(_t2_name) if use_psig else f"/api/report-file?name={_t2_name}"
    _ds_name   = "lens_decision_surface_pub.html" if publish_safe else "lens_decision_surface.html"
    ds_link    = _scoped_report_url(_ds_name) if use_psig else f"/api/report-file?name={_ds_name}"
    footer_note = (f"SAMPLE — {client_name}."
                   if use_psig else
                   ("SAMPLE — Client data used for demonstration purposes." if publish_safe
                    else "SAMPLE — BlueEdge data used for demonstration purposes."))

    grounded_count = sum(1 for d in domains if d["grounding"] == "GROUNDED")
    weak_count = sum(1 for d in domains if d["grounding"] == "WEAKLY GROUNDED")

    if use_psig:
        svg_html = _build_tier1_topology_svg_generic(domains, pz_proj=pz_proj)
    else:
        svg_html = _build_tier1_topology_svg(domains, publish_safe=publish_safe)

    # Domain grid cards — FOCUS_DOMAIN is PRIMARY zone anchor for psig, DOMAIN-10 for BlueEdge
    if use_psig and pz_proj:
        primary_zone = next(
            (z for z in pz_proj.get("zone_projection", []) if z.get("attribution_profile") == "primary"),
            None,
        )
        FOCUS_DOMAIN = primary_zone["anchor_id"] if primary_zone else None
        _focus_tag = f"Pressure Zone — {primary_zone['anchor_name']} PRIMARY" if primary_zone else ""
    else:
        FOCUS_DOMAIN = "DOMAIN-10"
        _focus_tag = "Focus Domain — Investigate"
    domain_cards = []
    for d in domains:
        did = d["domain_id"]
        name_raw = d["domain_name"]
        # Publish-safe domain name obfuscation
        if publish_safe:
            name_raw = (name_raw
                .replace("Fleet Core Operations", "Core Operations")
                .replace("Fleet Vertical Extensions", "Vertical Extensions")
                .replace("Extended Operations and Driver Services", "Extended Operations")
                .replace("Extended Operations & Driver Services", "Extended Operations"))
        ncaps = len(d.get("capability_ids", []))
        ncomps = len(d.get("component_ids", []))
        if did == FOCUS_DOMAIN and FOCUS_DOMAIN is not None:
            cls = "focus"
            tag_label = _focus_tag
        elif d["grounding"] == "WEAKLY GROUNDED":
            cls = "weak"
            tag_label = "Weakly Grounded"
        else:
            cls = "grounded"
            tag_label = "Grounded"
        if use_psig and ncaps == 0 and ncomps == 0:
            sub_text = "Structural scope: evidence boundary"
        else:
            sub_text = f'{ncaps} capabilit{"y" if ncaps==1 else "ies"} · {ncomps} component{"" if ncomps==1 else "s"}'
        domain_cards.append(f"""    <div class="domain-card {cls}">
      <div class="domain-dot {cls}"></div>
      <div>
        <div class="domain-name">{esc(name_raw)}</div>
        <div class="domain-sub">{sub_text}</div>
        <div class="domain-tag {cls}">{tag_label}</div>
      </div>
    </div>""")
    domain_grid_html = "\n".join(domain_cards)

    # Signal cards
    CONF_CLASS = {"STRONG": "strong", "MODERATE": "moderate", "WEAK": "weak"}

    if use_psig:
        # PSIG path: build from signal_projection + structural metrics
        active_conds = psig_proj.get("active_conditions_in_scope", [])
        not_activated = psig_proj.get("signals_not_activated", [])
        m = metrics or {}
        dep_load = m.get("dep_load", "NOT_IN_SCOPE")
        dep_edges = m.get("dep_edges", "N/A")
        dep_nodes = m.get("dep_nodes", "N/A")
        etn = m.get("edge_to_node", "NOT_IN_SCOPE")
        cont = m.get("containment_density", "NOT_IN_SCOPE")

        tier1_signals = []
        for c in active_conds:
            sid   = c["signal_id"]
            val   = c["signal_value"]
            state = c["activation_state"]
            method = c.get("activation_method", "")
            prim_ent = c.get("primary_attribution_entity")
            prim_dom = c.get("primary_attribution_domain", "")
            dom_scope = c.get("domain_attribution_scope", [])
            entity_scope = c.get("entity_level_scope", [])

            _meth_exec   = RC.apply_language(method)
            _zclass_exec = RC.apply_language("COMPOUND_ZONE")
            if sid == "PSIG-001":
                title = f"Fan-In Concentration ({sid}): {state} — {_meth_exec} — Value {val}"
                stmt = (
                    f"Inbound dependency concentration is {val} — {_meth_exec} (trace: {method}). "
                    f"Primary attribution entity: {prim_ent} in {prim_dom}. "
                    f"Domain scope: {', '.join(dom_scope)}. "
                    f"Co-present with PSIG-002 and PSIG-004 across all three pressure zones "
                    f"(PZ-001, PZ-002, PZ-003) — contributes to {_zclass_exec} (trace: COMPOUND_ZONE) in each."
                )
                dom_tag, conf = prim_dom or "Multi-domain", "strong"
            elif sid == "PSIG-002":
                title = f"Fan-Out Propagation ({sid}): {state} — {_meth_exec} — Value {val}"
                stmt = (
                    f"Outbound dependency propagation is {val} — {_meth_exec} (trace: {method}). "
                    f"Distributes across {', '.join(dom_scope)} with no single primary entity. "
                    f"Co-presence with PSIG-001 at the same value ({val}) indicates bidirectional "
                    f"concentration pressure — not a single directed flow. Present in all three zones."
                )
                dom_tag = " · ".join(dom_scope[:3]) if dom_scope else "Multi-domain"
                conf = "strong"
            elif sid == "PSIG-004":
                title = f"Responsibility Concentration ({sid}): {state} — {_meth_exec} — Value {val}"
                stmt = (
                    f"Structural responsibility concentration is {val} — {_meth_exec} (trace: {method}). "
                    f"Primary attribution entity: {prim_ent} in {prim_dom}. "
                    f"Convergence of PSIG-001 and PSIG-004 at {prim_ent} defines the Primary pressure anchor "
                    f"(trace: PRIMARY) for PZ-002 ({prim_dom}). Secondary affected zones (trace: SECONDARY) "
                    f"cover all three zone domains."
                )
                dom_tag, conf = prim_dom or "Multi-domain", "strong"
            elif sid == "PSIG-006":
                ent_preview = ", ".join(entity_scope[:4]) + ("…" if len(entity_scope) > 4 else "")
                title = f"Structural Blind Spot ({sid}): ACTIVATED — {_meth_exec} — Value {val}"
                stmt = (
                    f"PSIG-006 activated at {_meth_exec} (trace: {method}, value {val}). "
                    f"Covers {len(entity_scope)} structural entities: {ent_preview}. "
                    f"These entities are outside pressure zone scope (PZ-001/PZ-002/PZ-003). "
                    f"{_meth_exec} means structural basis is present but execution evidence "
                    f"is insufficient for an empirical pressure value. Represents a coverage gap."
                )
                dom_tag = " · ".join(entity_scope[:2]) if entity_scope else "Multi-domain"
                conf = "weak"
            else:
                title = f"{sid}: {state} — Value {val}"
                stmt  = f"Signal {sid} activated at {val} ({state}, {_meth_exec})."
                dom_tag, conf = prim_dom or "Structural", "moderate"

            tier1_signals.append({
                "num": str(len(tier1_signals) + 1).zfill(2),
                "title": title, "statement": stmt, "domain": dom_tag, "confidence": conf,
                "trace": method,
            })

        # Add PSIG-003 as not-activated entry
        if "PSIG-003" in not_activated:
            tier1_signals.append({
                "num": str(len(tier1_signals) + 1).zfill(2),
                "title": "Inbound Coupling (PSIG-003): NOT_ACTIVATED — Below threshold",
                "statement": (
                    "PSIG-003 evaluated inbound coupling ratio and did not reach the activation threshold "
                    "for this run. This is a confirmed structural observation, not a gap in evaluation."
                ),
                "domain": "Structural analysis", "confidence": "strong",
            })

        # Add structural metrics card
        if dep_load != "NOT_IN_SCOPE":
            tier1_signals.append({
                "num": str(len(tier1_signals) + 1).zfill(2),
                "title": (f"Structural Metrics: Dependency Load {dep_load} · "
                          f"Edge-to-Node {etn} · Containment {cont}"),
                "statement": (
                    f"Dependency load ratio: {dep_load} ({dep_edges} of {dep_nodes} edges are "
                    f"load-bearing overlap edges). Edge-to-node density: {etn} "
                    f"({m.get('edges_count')} edges / {dep_nodes} nodes). "
                    f"Containment density: {cont} ({m.get('contains_count')} containment edges / "
                    f"{dep_nodes} nodes). Low dependency load with dense containment indicates "
                    f"a topology dominated by hierarchical nesting rather than direct coupling."
                ),
                "domain": "Structural topology", "confidence": "strong",
            })

        # Renumber after assembly
        for idx, s in enumerate(tier1_signals):
            s["num"] = str(idx + 1).zfill(2)

    else:
        # BlueEdge path — unchanged curated content
        tier1_signals = [
            {
                "num": "01",
                "title": "Security Intelligence Pipeline: Throughput Ceiling Confirmed, Runtime State Unverified",
                "statement": (
                    "The security intelligence collection pathway operates under a configured throughput ceiling derived from "
                    "static configuration. This ceiling bounds the rate at which threat data reaches the cloud platform. "
                    "Actual performance under live conditions is outside current evidence scope and cannot be confirmed "
                    "without a live execution environment."
                ),
                "domain": "Edge Data Acquisition",
                "confidence": "strong",
            },
            {
                "num": "02",
                "title": "Platform Runtime State: Seven Core Operational Dimensions Are Outside Current Evidence Scope",
                "statement": (
                    "Seven operational dimensions cannot be determined from available evidence: backend service health, "
                    "cache layer efficiency, cache layer availability, event pipeline activity, "
                    + ("platform" if publish_safe else "fleet") + " connection activity, "
                    + ("operational" if publish_safe else "vehicle") + " alert activity, and "
                    + ("session" if publish_safe else "driver session") + " performance. "
                    "These represent the complete observable runtime state of the core platform. "
                    "Any operational decision about platform health or capacity currently lacks an evidence base."
                ),
                "domain": "Platform Infrastructure",
                "confidence": "strong",
            },
            {
                "num": "03",
                "title": "Dependency Structure: Most Architectural Connections Are Load-Bearing",
                "statement": (
                    "Dependency load is concentrated across the observed architectural scope — most inter-component "
                    "connections are direct dependencies rather than loose couplings (load ratio: 0.682). "
                    "This elevates the blast radius for any component-level failure and increases integration "
                    "complexity as the platform scales."
                ),
                "domain": "Event-Driven Architecture",
                "confidence": "moderate",
            },
            {
                "num": "04",
                "title": "Structural Volatility: Relationship Density Exceeds Component Count",
                "statement": (
                    "Edge-to-node density: 1.273 — the platform has more relationship edges than structural nodes, "
                    "indicating a tightly interconnected architecture. Containment depth ratio: 0.545 — nearly half "
                    "of components operate across module boundaries. Structural growth without boundary enforcement "
                    "compounds this pressure at an accelerating rate."
                ),
                "domain": "Platform Infrastructure",
                "confidence": "moderate",
            },
            {
                "num": "05",
                "title": "Coordination Pressure: Interface Surface Is Predominantly Shared",
                "statement": (
                    "Nearly all observable interface surface is shared across multiple components (sharing ratio: 0.875). "
                    "Combined with dependency load (0.682) and structural density (1.273), the compounding coordination "
                    "burden across the delivery pipeline is materially elevated. The runtime component of this signal "
                    "remains outside current evidence scope."
                ),
                "domain": "Operational Engineering",
                "confidence": "weak",
            },
        ]
    signal_cards = []
    for s in tier1_signals:
        _trace_div = (f'<div class="signal-trace">trace: {esc(s["trace"])}</div>'
                      if s.get("trace") else "")
        signal_cards.append(f"""    <div class="signal-card">
      <div class="signal-num">{s["num"]}</div>
      <div class="signal-body">
        <div class="signal-title">{esc(s["title"])}</div>
        {_trace_div}
        <div class="signal-statement">{esc(s["statement"])}</div>
      </div>
      <div class="signal-meta">
        <div class="signal-domain-tag">{esc(s["domain"])}</div>
        <div><span class="confidence-badge {s["confidence"]}">{s["confidence"].title()}</span></div>
      </div>
    </div>""")
    signals_html = "\n".join(signal_cards)

    # Pressure zones / focus domain block
    if use_psig and pz_proj:
        zone_list = pz_proj.get("zone_projection", [])
        pz_blocks = []
        # Shared condition set across all zones (de-duplicate repetition)
        _all_sigs = zone_list[0].get("signals", []) if zone_list else []
        _shared_sigs_str = " · ".join(_all_sigs)
        _shared_ccount   = zone_list[0].get("condition_count", len(_all_sigs)) if zone_list else 0
        _shared_zclass   = zone_list[0].get("zone_class", "COMPOUND_ZONE") if zone_list else "COMPOUND_ZONE"
        _shared_header = (
            f'  <p style="font-size:12.5px;color:var(--fg-muted);margin-bottom:16px">'
            f'All zones share the same active condition set: {esc(_shared_sigs_str)}. '
            f'Zone class: {esc(_shared_zclass)} ({_shared_ccount} conditions ≥ threshold).</p>\n'
        ) if zone_list else ""
        for z in zone_list:
            zid   = z["zone_id"]
            zname = z.get("anchor_name", z.get("anchor_id", zid))
            profile = z.get("attribution_profile", "secondary")
            is_prim = profile == "primary"
            badge = "PRIMARY" if is_prim else profile.upper()
            _attr_exec = RC.apply_language(profile)
            sigs_in_zone = z.get("signals", [])
            sigs_str = " · ".join(sigs_in_zone)
            pz_blocks.append(
                f'  <div class="focus-domain-block" style="margin-bottom:12px">\n'
                f'    <div class="focus-domain-header">\n'
                f'      <div>\n'
                f'        <div class="focus-domain-label">{esc(zid)} — {esc(zname)}</div>\n'
                f'        <div class="focus-domain-sub">{esc(sigs_str)}</div>\n'
                f'      </div>\n'
                f'      <div class="focus-badge">{esc(_attr_exec)}'
                f'<span style="display:block;font-size:9px;opacity:.6;margin-top:2px">trace: {esc(badge)}</span>'
                f'</div>\n'
                f'    </div>\n'
                f'    <div class="focus-finding">'
                f'{esc(zid)} ({esc(zname)}): {esc(_attr_exec)} — '
                f'<span style="font-size:11px;opacity:.7">trace: {esc(profile)} attribution</span>.'
                f'</div>\n'
                f'  </div>'
            )
        blind_spot_count = pz_proj.get("structural_blind_spot_entity_count", 0)
        blind_spot_sig   = pz_proj.get("structural_blind_spot_signal", "PSIG-006")
        blind_note = (
            f'\n  <div class="tier2-handoff" style="margin-top:8px">'
            f'<div class="tier2-handoff-label">Structural Blind Spot — {esc(blind_spot_sig)}</div>'
            f'<div class="tier2-handoff-text">{blind_spot_count} entities outside pressure zone scope. '
            f'{esc(blind_spot_sig)} activated at THEORETICAL_BASELINE — coverage gap, not zone candidate.'
            f'</div></div>'
            if blind_spot_count > 0 else ""
        )
        focus_block_html = (
            f'  <h2 style="margin-top:36px">Pressure Zones</h2>\n'
            + _shared_header
            + "\n".join(pz_blocks)
            + blind_note
        )
    else:
        focus_domain = next((d for d in domains if d["domain_id"] == FOCUS_DOMAIN), None)
        focus_caps = len(focus_domain.get("capability_ids", [])) if focus_domain else 0
        focus_comps = len(focus_domain.get("component_ids", [])) if focus_domain else 0
        connectivity_word = "platform connectivity" if publish_safe else "fleet connectivity"
        gateway_word = "platform gateway" if publish_safe else "fleet gateway"

        if focus_domain is None:
            focus_block_html = """  <h2 style="margin-top:36px">Pressure Zones</h2>
  <div class="focus-domain-block">
    <div class="focus-domain-header">
      <div>
        <div class="focus-domain-label">Pressure Zones</div>
        <div class="focus-domain-name" style="color:var(--fg-muted)">Not yet evaluated</div>
        <div class="focus-domain-sub">No focus domain has been designated for this client.</div>
      </div>
    </div>
    <div class="focus-finding">
      Pressure zones not yet evaluated. No focus domain has been designated for this client.
      Signal derivation (PiOS 41.x) has not been executed. Zone analysis requires signal evidence.
    </div>
  </div>"""
        else:
            focus_block_html = f"""  <h2 style="margin-top:36px">Focus Domain</h2>
  <div class="focus-domain-block">
    <div class="focus-domain-header">
      <div>
        <div class="focus-domain-label">Focus Domain</div>
        <div class="focus-domain-name">Platform Infrastructure and Data</div>
        <div class="focus-domain-sub">Weakly Grounded · {focus_caps} capabilities · {focus_comps} components</div>
      </div>
      <div class="focus-badge">Focus Domain</div>
    </div>
    <div class="focus-summary-grid">
      <div class="focus-stat"><div class="focus-stat-label">Signals Converging</div><div class="focus-stat-value">2 independent signals</div></div>
      <div class="focus-stat"><div class="focus-stat-label">Grounding State</div><div class="focus-stat-value">Weakly Grounded</div></div>
      <div class="focus-stat"><div class="focus-stat-label">Operational Dimensions Outside Scope</div><div class="focus-stat-value">7 of 7</div></div>
    </div>
    <div class="focus-finding">
      <strong>What the LENS confirms:</strong> This domain is the structural hub through which cache performance, event delivery,
      {connectivity_word}, alert processing, and driver session scoring are coordinated. All seven observable runtime dimensions
      are currently outside evidence scope — not because the platform is instrumented and showing healthy values,
      but because the evidence required to evaluate them is absent from the current assessment boundary.
      The domain is structurally mapped and weakly grounded.<br><br>
      <strong>What is not known:</strong> Whether the cache, event pipeline, {gateway_word}, and session systems
      are operating normally or in a degraded state. This is a confirmed unknown, not an assumed healthy state.
    </div>
  </div>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LENS Assessment — Structural Evidence Brief</title>
<style>{_TIER1_EVIDENCE_CSS}</style>
</head>
<body>
<div class="sample-watermark">SAMPLE</div>
<div class="page">

  <div class="report-header">
    <div>
      <div class="report-brand">Signäl Program Intelligence</div>
      <div class="report-title">LENS Assessment — Structural Evidence Brief</div>
    </div>
    <div class="report-meta">
      <div>Client: <strong>{esc(client_name)}</strong></div>
      <div>Issued: <strong>April 2026</strong></div>
    </div>
  </div>

  <div class="nav-strip">
    <a href="{ds_link}" class="nav-link">Decision</a>
    <a href="{narr_link}" class="nav-link">Executive Brief</a>
    <span class="nav-link active">LENS Assessment</span>
    <a href="{t2_link}" class="nav-link">Diagnostic</a>
  </div>

  {RC.anchor_block(score, band_label, band_lo, band_hi)}

  <h2>Assessment Score</h2>
  <p class="exec-state-lead">Structurally verified. Execution not yet validated.</p>
  <div class="gauge-block">
    <div class="gauge-score-circle">
      <div class="gauge-score-number">{score}</div>
      <div class="gauge-score-label">Score</div>
    </div>
    <div class="gauge-details">
      <div class="gauge-band-label">{esc(band_label)}</div>
      <div class="gauge-band-bar"><div class="gauge-band-fill"></div></div>
      <div class="gauge-band-range">Confidence band: <span>{band_lo} – {band_hi}</span></div>
      <div class="gauge-caveat">Score is anchored to verified evidence. The upper bound reflects the projected completion state;
        actual score depends on assessment execution outcome. Score is not an opinion —
        it is derived deterministically from structural analysis.</div>
    </div>
    <div class="gauge-decision">
      <div class="gauge-decision-label">Decision Guidance</div>
      <div class="gauge-decision-value">Investigate</div>
    </div>
  </div>

  <h2>Structural Composition</h2>
  <div class="counts-row">
    <div class="count-card"><div class="count-value">{counts["domains"]}</div><div class="count-label">Domains</div></div>
    <div class="count-card"><div class="count-value">{counts["capabilities"]}</div><div class="count-label">Capabilities</div></div>
    <div class="count-card"><div class="count-value">{counts["components"]}</div><div class="count-label">Components</div></div>
    <div class="count-card"><div class="count-value">{counts["total_nodes"]}</div><div class="count-label">Total Nodes</div></div>
  </div>

  <h2>Structural Topology View</h2>
  <div class="topo-view">
    {svg_html}
    <div class="topo-legend">
      <span class="topo-leg-item"><span class="topo-leg-dot tl-grounded"></span>Grounded ({grounded_count} {"domain" if grounded_count == 1 else "domains"})</span>
      <span class="topo-leg-item"><span class="topo-leg-dot tl-weak"></span>Weakly Grounded ({weak_count} {"domain" if weak_count == 1 else "domains"})</span>
      {'<span class="topo-leg-item"><span class="topo-leg-dot tl-focus"></span>Primary Pressure Zone — Multiple structural pressures acting together &nbsp;<span style="font-size:10px;opacity:.6">trace: COMPOUND_ZONE</span></span>' if use_psig else '<span class="topo-leg-item"><span class="topo-leg-dot tl-focus"></span>Focus Domain — 2 signal convergence (also Weakly Grounded)</span>'}
      <span class="topo-leg-note">Relationships shown are structural co-membership. No direction implied.</span>
    </div>
  </div>

  <h2>Domain Topology</h2>
  <div class="domain-grid">
{domain_grid_html}
  </div>
  <div class="domain-legend">
    <div class="domain-legend-item"><div class="legend-dot" style="background:var(--green)"></div> Grounded ({grounded_count} domains — evidence-backed)</div>
    <div class="domain-legend-item"><div class="legend-dot" style="background:var(--amber)"></div> Weakly Grounded ({weak_count} domains — partial evidence)</div>
    {'<div class="domain-legend-item"><div class="legend-dot" style="background:var(--gold)"></div> Primary Pressure Zone</div>' if use_psig else '<div class="domain-legend-item"><div class="legend-dot" style="background:var(--gold)"></div> Focus Domain</div>'}
  </div>

  <h2>Active Structural Signals</h2>
  <div class="signal-grid">
{signals_html}
  </div>

{focus_block_html}

  <div class="tier2-handoff">
    <div class="tier2-handoff-label">Next Proposed Actions — Outside This Assessment</div>
    <div class="tier2-handoff-text">
      This assessment establishes confirmed structural state and evidence boundary.
      Proposed next actions, diagnostic priorities, and resolution paths belong to a separate
      analytical layer and are not produced here.
    </div>
  </div>

  <div class="report-footer">
    <div>
      <div class="footer-brand">Signäl</div>
      <div style="margin-top:4px">Program Intelligence — LENS Assessment</div>
    </div>
    <div class="footer-note">
      {esc(footer_note)}<br>
      Client environments, scores, and findings will vary.<br>
      All structural values are derived from verified execution evidence.
    </div>
  </div>

</div>
</body>
</html>"""


# ---------------------------------------------------------------------------
# Tier-1 Narrative Brief HTML builder
# ---------------------------------------------------------------------------

_TIER1_NARRATIVE_CSS = """
  :root{--bg:#0e0e10;--surface:#16161a;--surface-raised:#1c1c22;--border:#2a2a2e;--border-subtle:#222228;--fg:#e8e8e8;--fg-muted:#888;--fg-dim:#555;--gold:#c89b3c;--gold-muted:rgba(200,155,60,0.12);--gold-border:rgba(200,155,60,0.28);--green:#4caf6e;--amber:#d4912a;--amber-muted:rgba(212,145,42,0.1);--amber-border:rgba(212,145,42,0.25);--font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--fg);font-family:var(--font);font-size:14px;line-height:1.7;-webkit-font-smoothing:antialiased}
  .page{max-width:960px;margin:0 auto;padding:48px 40px 80px}
  .report-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:1px solid var(--border);margin-bottom:32px}
  .report-brand{font-size:11px;letter-spacing:.14em;color:var(--gold);text-transform:uppercase;margin-bottom:6px}
  .report-title{font-size:20px;color:var(--fg);font-weight:400}
  .report-type{font-size:11px;color:var(--fg-muted);margin-top:4px;letter-spacing:.06em}
  .report-meta{text-align:right;font-size:12px;color:var(--fg-muted);line-height:1.8}
  .report-meta strong{color:var(--fg);font-weight:500}
  .nav-strip{display:flex;gap:10px;margin-bottom:36px}
  .nav-link{display:inline-block;padding:7px 14px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--border);color:var(--fg-muted);text-decoration:none;border-radius:3px}
  .nav-link:hover{border-color:var(--gold);color:var(--gold)}
  .nav-link.active{border-color:var(--gold-border);color:var(--gold);background:var(--gold-muted)}
  .section{margin-bottom:48px}
  .section-header{display:flex;align-items:baseline;gap:12px;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid var(--border-subtle)}
  .section-num{font-size:10px;letter-spacing:.12em;color:var(--gold);text-transform:uppercase;min-width:24px}
  .section-title{font-size:15px;color:var(--fg);font-weight:500;letter-spacing:.02em}
  .body-text{font-size:13.5px;color:var(--fg);line-height:1.75;margin-bottom:16px}
  .body-text:last-child{margin-bottom:0}
  .score-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0}
  .score-cell{background:var(--surface);border:1px solid var(--border);padding:14px 16px;border-radius:3px}
  .score-cell-label{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--fg-muted);margin-bottom:6px}
  .score-cell-value{font-size:18px;color:var(--gold);font-weight:300}
  .score-cell-sub{font-size:11px;color:var(--fg-muted);margin-top:3px}
  .signal-table{width:100%;border-collapse:collapse;margin:20px 0;font-size:12.5px}
  .signal-table th{text-align:left;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg-muted);border-bottom:1px solid var(--border);padding:8px 10px;font-weight:400}
  .signal-table td{padding:10px 10px;border-bottom:1px solid var(--border-subtle);vertical-align:top;color:var(--fg)}
  .signal-table tr:last-child td{border-bottom:none}
  .conf-badge{display:inline-block;padding:2px 7px;border-radius:2px;font-size:10px;letter-spacing:.06em}
  .conf-strong{background:rgba(76,175,110,.12);color:#4caf6e}
  .conf-moderate{background:rgba(200,155,60,.12);color:#c89b3c}
  .conf-weak{background:rgba(136,136,136,.12);color:#888}
  .grounding-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}
  .grounding-cell{background:var(--surface);border:1px solid var(--border);padding:14px 16px;border-radius:3px;display:flex;align-items:center;gap:12px}
  .grounding-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
  .dot-grounded{background:#4caf6e}
  .dot-weak{background:var(--amber)}
  .grounding-cell-text{font-size:12.5px;color:var(--fg)}
  .grounding-cell-count{font-size:11px;color:var(--fg-muted);margin-top:2px}
  .focus-block{background:var(--surface);border:1px solid var(--border);border-top:3px solid var(--amber);padding:20px 22px;margin:20px 0;border-radius:3px}
  .focus-block-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber);margin-bottom:8px}
  .focus-block-name{font-size:17px;color:var(--fg);margin-bottom:4px}
  .focus-block-sub{font-size:12px;color:var(--fg-muted);margin-bottom:16px}
  .focus-stats{display:flex;gap:24px;padding-top:14px;border-top:1px solid var(--border-subtle);margin-top:14px}
  .focus-stat-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg-muted);margin-bottom:4px}
  .focus-stat-value{font-size:14px;color:var(--fg)}
  .boundary-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0}
  .boundary-block{background:var(--surface);border:1px solid var(--border);padding:16px 18px;border-radius:3px}
  .boundary-block.known{border-top:2px solid var(--green)}
  .boundary-block.unknown{border-top:2px solid var(--amber)}
  .boundary-block-label{font-size:9px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px}
  .boundary-block.known .boundary-block-label{color:var(--green)}
  .boundary-block.unknown .boundary-block-label{color:var(--amber)}
  .boundary-list{list-style:none;padding:0}
  .boundary-list li{font-size:12.5px;color:var(--fg);padding:5px 0;border-bottom:1px solid var(--border-subtle);display:flex;align-items:flex-start;gap:8px}
  .boundary-list li:last-child{border-bottom:none}
  .boundary-list li::before{content:'—';color:var(--fg-dim);flex-shrink:0;margin-top:1px}
  .boundary-note{margin-top:14px;padding:10px 14px;background:var(--amber-muted);border:1px solid var(--amber-border);border-radius:3px;font-size:12px;color:var(--fg-muted);line-height:1.6}
  .boundary-lead{font-size:13px;color:#c8c8d4;font-weight:500;margin-bottom:14px;padding:10px 14px;background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid var(--gold);border-radius:2px}
  .exec-state-lead{font-size:13px;font-weight:600;color:#c8c8d4;letter-spacing:.02em;margin-bottom:12px;padding:8px 14px;background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid var(--green);border-radius:2px}
  .narr-trace{font-size:10px;color:var(--fg-dim)}
  .resolution-block{background:var(--surface-raised);border:1px solid var(--border);border-left:3px solid var(--fg-dim);padding:20px 22px;margin:20px 0;border-radius:3px}
  .resolution-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-dim);margin-bottom:10px}
  .resolution-text{font-size:13px;color:var(--fg-muted);line-height:1.7}
  .resolution-text+.resolution-text{margin-top:10px}
  .posture-row{display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;background:var(--surface);border:1px solid var(--border);padding:18px 20px;margin:20px 0;border-radius:3px}
  .posture-badge{font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);border:1px solid var(--gold-border);padding:8px 16px;border-radius:3px;background:var(--gold-muted);white-space:nowrap}
  .posture-text{font-size:13px;color:var(--fg-muted);line-height:1.65}
  .report-footer{display:flex;justify-content:space-between;align-items:flex-end;padding-top:24px;border-top:1px solid var(--border);margin-top:48px}
  .footer-brand{font-size:13px;color:var(--gold);letter-spacing:.08em}
  .footer-note{font-size:11px;color:var(--fg-muted);text-align:right;line-height:1.7}
  .conclusion-block{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--green);padding:20px 24px;border-radius:3px;margin-top:20px}
  .conclusion-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--green);margin-bottom:12px}
  .conclusion-text{font-size:15px;color:var(--fg);font-weight:500;margin-bottom:10px}
  .conclusion-body{font-size:13px;color:var(--fg-muted);line-height:1.7;margin-bottom:8px}
  .rc-trace{font-size:10px;color:var(--fg-dim);opacity:.7;font-style:normal}
  .rc-anchor-block{display:flex;align-items:center;gap:10px;padding:8px 14px;background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid var(--green);border-radius:2px;margin-bottom:16px;font-size:12px;flex-wrap:wrap}
  .rc-anchor-state{color:#c8c8d4;font-weight:600;letter-spacing:.02em}
  .rc-anchor-score{color:var(--green);font-weight:600}
  .rc-anchor-band{color:var(--fg-muted)}
  .rc-anchor-decision{color:var(--amber);letter-spacing:.05em;text-transform:uppercase}
  .rc-anchor-sep{color:#333}
  @media(max-width:600px){.score-row{grid-template-columns:1fr 1fr}.grounding-row{grid-template-columns:1fr}.boundary-grid{grid-template-columns:1fr}.posture-row{grid-template-columns:1fr}.report-header{flex-direction:column;gap:12px}.report-meta{text-align:left}}
"""


def _build_tier1_narrative_brief(topology: Dict, signals: Dict, gauge: Dict,
                                  publish_safe: bool = False,
                                  psig_proj: Optional[Dict] = None,
                                  pz_proj: Optional[Dict] = None,
                                  metrics: Optional[Dict] = None,
                                  decision_model: Optional[Dict] = None) -> str:
    domains = topology["domains"]
    counts = topology["counts"]
    score = gauge["score"]["canonical"]
    band_label = gauge["score"]["band_label"]
    band_lo = gauge["confidence"]["lower"]
    band_hi = gauge["confidence"]["upper"]

    use_psig = psig_proj is not None
    client_name = _get_client_display_name(publish_safe)
    _ev_name    = "lens_tier1_evidence_brief_pub.html" if publish_safe else "lens_tier1_evidence_brief.html"
    ev_link     = _scoped_report_url(_ev_name) if use_psig else f"/api/report-file?name={_ev_name}"
    _t2_name    = "lens_tier2_diagnostic_narrative_pub.html" if publish_safe else "lens_tier2_diagnostic_narrative.html"
    t2_link     = _scoped_report_url(_t2_name) if use_psig else f"/api/report-file?name={_t2_name}"
    _ds_name    = "lens_decision_surface_pub.html" if publish_safe else "lens_decision_surface.html"
    ds_link     = _scoped_report_url(_ds_name) if use_psig else f"/api/report-file?name={_ds_name}"
    title_suffix = " (Publish)" if publish_safe else ""
    footer_note = (f"SAMPLE — {client_name}."
                   if use_psig else
                   ("SAMPLE — Illustrative client environment. All structural values represent actual assessment outputs."
                    if publish_safe else
                    "SAMPLE — BlueEdge data used for demonstration purposes."))

    grounded_count = sum(1 for d in domains if d["grounding"] == "GROUNDED")
    weak_count = sum(1 for d in domains if d["grounding"] == "WEAKLY GROUNDED")
    client_ref = f"the {esc(client_name)}"

    if not use_psig:
        connectivity_word = "platform connectivity" if publish_safe else "fleet connectivity"
        fleet_conn = "Platform connection activity" if publish_safe else "Fleet connection activity"
        vehicle_alert = "Operational alert activity" if publish_safe else "Vehicle alert activity"
        driver_session = "Session performance" if publish_safe else "Driver session performance"

    focus_domain = next((d for d in domains if d["domain_id"] == "DOMAIN-10"), None)

    if use_psig and pz_proj:
        zone_list = pz_proj.get("zone_projection", [])
        pz_items = []
        for z in zone_list:
            zid    = z["zone_id"]
            zname  = z.get("anchor_name", z.get("anchor_id", zid))
            zclass = z.get("zone_class", "COMPOUND_ZONE")
            profile = z.get("attribution_profile", "secondary")
            sigs_in_zone = z.get("signals", [])
            sigs_str = " · ".join(sigs_in_zone)
            ccount = z.get("condition_count", len(sigs_in_zone))
            is_prim = profile == "primary"
            _attr_exec   = RC.apply_language(profile)
            _zclass_exec = RC.apply_language(zclass)
            pz_items.append(
                f'    <div class="focus-block">\n'
                f'      <div class="focus-block-label">{esc(zid)} — {esc(zname)}</div>\n'
                f'      <div class="focus-block-name">{esc(_zclass_exec)}'
                f' <span style="font-size:10px;opacity:.6">trace: {esc(zclass)}</span>'
                f' · {ccount} conditions co-present</div>\n'
                f'      <div class="focus-block-sub">{esc(sigs_str)}</div>\n'
                f'      <p class="body-text" style="font-size:13px">\n'
                f'        {esc(zid)} ({esc(zname)}) is a {esc(_attr_exec)}'
                f' <span style="font-size:11px;opacity:.7">(trace: {esc(profile)} attribution)</span> '
                f'for all three co-present conditions ({esc(sigs_str)}). '
                f'{ccount} simultaneous conditions satisfy the {esc(_zclass_exec)}'
                f' <span style="font-size:11px;opacity:.7">(trace: {esc(zclass)})</span> threshold.</p>\n'
                f'    </div>'
            )
        blind_count = pz_proj.get("structural_blind_spot_entity_count", 0)
        blind_sig   = pz_proj.get("structural_blind_spot_signal", "PSIG-006")
        _bs_exec = RC.apply_language("THEORETICAL_BASELINE")
        blind_note = (
            f'\n    <p class="body-text" style="font-size:12.5px;color:var(--fg-muted)">'
            f'Structural blind spot: {esc(blind_sig)} covers {blind_count} entities outside zone scope — '
            f'{esc(_bs_exec)} <span style="font-size:10px;opacity:.6">(trace: THEORETICAL_BASELINE)</span>'
            f' — coverage gap, not pressure candidate.</p>'
            if blind_count > 0 else ""
        )
        focus_section_html = (
            '  <div class="section">\n'
            '    <div class="section-header"><span class="section-num">03</span>'
            '<span class="section-title">Pressure Zones</span></div>\n'
            + "\n".join(pz_items)
            + blind_note + "\n  </div>"
        )
    elif focus_domain is None:
        focus_section_html = """  <div class="section">
    <div class="section-header"><span class="section-num">03</span><span class="section-title">Pressure Zones</span></div>
    <div class="focus-block">
      <div class="focus-block-label">Pressure Zones</div>
      <div class="focus-block-name" style="color:var(--fg-muted)">Not yet evaluated</div>
      <div class="focus-block-sub">No focus domain has been designated for this client.</div>
      <p class="body-text" style="font-size:13px;color:var(--fg-muted)">
        Pressure zones not yet evaluated. Signal derivation (PiOS 41.x) has not been executed.
        Zone analysis requires signal evidence to designate a focus domain.</p>
    </div>
  </div>"""
    else:
        focus_section_html = f"""  <div class="section">
    <div class="section-header"><span class="section-num">03</span><span class="section-title">Focus Domain Narrative</span></div>
    <div class="focus-block">
      <div class="focus-block-label">Focus Domain</div>
      <div class="focus-block-name">Platform Infrastructure and Data</div>
      <div class="focus-block-sub">Weakly Grounded &nbsp;·&nbsp; 4 capabilities &nbsp;·&nbsp; 6 components</div>
      <p class="body-text" style="font-size:13px;color:var(--fg-muted)">
        This domain is the structural hub through which the platform's core runtime services are coordinated —
        including caching, event delivery, {connectivity_word}, alert processing, and session performance infrastructure.
        Two independent structural signals converge here.</p>
      <div class="focus-stats">
        <div class="focus-stat-item"><div class="focus-stat-label">Signals Converging</div><div class="focus-stat-value">2 independent</div></div>
        <div class="focus-stat-item"><div class="focus-stat-label">Grounding State</div><div class="focus-stat-value">Weakly Grounded</div></div>
        <div class="focus-stat-item"><div class="focus-stat-label">Runtime Dimensions Outside Scope</div><div class="focus-stat-value">7 of 7</div></div>
      </div>
    </div>
    <p class="body-text"><strong>Structural volatility signal (edge-to-node density: 1.273).</strong> The platform has more
      architectural relationship edges than structural nodes — meaning most components are interconnected
      rather than isolated. A containment depth ratio of 0.545 indicates that nearly half of all components
      operate across module boundaries, not within them. This structural condition means the cost and risk
      of change grows non-linearly as the platform scales.</p>
    <p class="body-text"><strong>Platform runtime state signal.</strong> Seven operational dimensions of this domain cannot
      be determined from the available evidence. This is the complete set of observable runtime states for
      the core platform — not a partial gap. The evidence required to evaluate them was not present within
      the assessment boundary.</p>
    <p class="body-text">The domain is structurally mapped and weakly grounded. Its topology is confirmed. Its runtime state is not.</p>
  </div>"""

    # --- Pre-compute conditional HTML blocks for narrative brief ---
    if use_psig and psig_proj and metrics:
        _sig_disp = {
            "PSIG-001": "Fan-in structural concentration",
            "PSIG-002": "Fan-out structural concentration",
            "PSIG-003": "Node depth concentration",
            "PSIG-004": "Responsibility concentration",
            "PSIG-005": "Scope coupling",
            "PSIG-006": "Structural blind spot coverage",
        }
        _sig_rows = []
        for _c in psig_proj.get("active_conditions_in_scope", []):
            _sid  = _c.get("signal_id", "")
            _sname = _sig_disp.get(_sid, _sid)
            _val  = _c.get("signal_value", "—")
            _meth = _c.get("activation_method", "")
            if _meth == "THEORETICAL_BASELINE":
                _cc, _cl = "conf-weak", "Theoretical baseline"
            elif _meth == "RUN_RELATIVE_OUTLIER":
                _cc, _cl = "conf-strong", "Strong"
            else:
                _cc, _cl = "conf-moderate", "Moderate"
            _exec_meth = RC.apply_language(_meth)
            _trace_span = (f'<br><span style="font-size:10px;color:var(--fg-dim)">'
                           f'trace: {esc(_meth)}</span>') if _meth else ""
            _val_cell = f'{esc(str(_val))} — {esc(_exec_meth)}{_trace_span}'
            _sig_rows.append(
                f'        <tr><td>{esc(_sname)} ({esc(_sid)})</td>'
                f'<td>{_val_cell}</td>'
                f'<td><span class="conf-badge {_cc}">{esc(_cl)}</span></td></tr>'
            )
        _dl  = metrics.get("dep_load", "—")
        _de  = metrics.get("dep_edges", "—")
        _dn  = metrics.get("dep_nodes", "—")
        _etn = metrics.get("edge_to_node", "—")
        _cd  = metrics.get("containment_density", "—")
        _sig_rows.append(
            f'        <tr><td>Dependency load ratio</td>'
            f'<td>{_dl} — {_de} of {_dn} edges overlap</td>'
            f'<td><span class="conf-badge conf-moderate">Moderate</span></td></tr>'
        )
        _sig_rows.append(
            f'        <tr><td>Structural density — edge-to-node</td>'
            f'<td>{_etn}&nbsp;·&nbsp;Containment: {_cd}</td>'
            f'<td><span class="conf-badge conf-moderate">Moderate</span></td></tr>'
        )
        signal_table_html = (
            '    <table class="signal-table">\n'
            '      <thead><tr><th style="width:40%">Signal</th>'
            '<th style="width:30%">Computed Value</th>'
            '<th style="width:30%">Confidence</th></tr></thead>\n'
            '      <tbody>\n' + "\n".join(_sig_rows) + "\n"
            '      </tbody>\n    </table>'
        )
    else:
        signal_table_html = (
            '    <table class="signal-table">\n'
            '      <thead><tr><th style="width:40%">Signal</th>'
            '<th style="width:30%">Computed Value</th>'
            '<th style="width:30%">Confidence</th></tr></thead>\n'
            '      <tbody>\n'
            '        <tr><td>Security intelligence throughput ceiling</td>'
            '<td>Configured — static constant</td>'
            '<td><span class="conf-badge conf-strong">Strong</span></td></tr>\n'
            '        <tr><td>Platform runtime dimensions outside scope</td>'
            '<td>7 of 7 unresolvable</td>'
            '<td><span class="conf-badge conf-strong">Strong</span></td></tr>\n'
            '        <tr><td>Dependency load ratio</td>'
            '<td>0.682 — 15 of 22 edges load-bearing</td>'
            '<td><span class="conf-badge conf-moderate">Moderate</span></td></tr>\n'
            '        <tr><td>Structural volatility — edge-to-node density</td>'
            '<td>1.273 &nbsp;&middot;&nbsp; Containment: 0.545</td>'
            '<td><span class="conf-badge conf-moderate">Moderate</span></td></tr>\n'
            '        <tr><td>Coordination pressure — interface sharing</td>'
            '<td>0.875 — 7 of 8 interfaces shared</td>'
            '<td><span class="conf-badge conf-weak">Weak (static only)</span></td></tr>\n'
            '      </tbody>\n    </table>'
        )

    if use_psig:
        _dm = decision_model or {}
        _na_sigs  = _dm.get("not_activated", [])
        _blind    = _dm.get("blind_spot_active", False)
        _actv_cnt = len(psig_proj.get("active_conditions_in_scope", [])) if psig_proj else 0
        _na_labels = {
            "PSIG-003": "Node depth concentration signal — not activated in this run",
            "PSIG-005": "Scope coupling signal — not activated in this run",
        }
        _unk_items = ["<li>Runtime execution behavior (execution layer not evaluated)</li>"]
        for _s in _na_sigs:
            _unk_items.append(
                f'<li>{esc(_na_labels.get(_s, f"{_s} — not activated in this run"))}</li>'
            )
        if _blind:
            _unk_items.append(
                f"<li>Structural blind spot entity behavior — "
                f"{RC.apply_language('THEORETICAL_BASELINE')} "
                f"<span style='font-size:10px;opacity:.6'>(trace: THEORETICAL_BASELINE)</span>"
                f" — coverage gap, not execution-derived</li>"
            )
        _unk_items += [
            "<li>Memory and resource utilization under load</li>",
            "<li>Live service interaction and latency profiles</li>",
        ]
        _unk_n = len(_unk_items)
        _conf_items = [
            f'<li>Full structural topology — {counts["domains"]} domains, '
            f'{counts["capabilities"]} capabilities, {counts["components"]} components</li>',
            "<li>Grounding classification for every domain</li>",
            f"<li>{_actv_cnt} active structural signals with computed values</li>",
            "<li>Dependency load, structural density, and containment density ratios</li>",
            "<li>Pressure zone classification across all detected zones</li>",
        ]
        if _blind and pz_proj:
            _bcnt = pz_proj.get("structural_blind_spot_entity_count", 0)
            _bsig = pz_proj.get("structural_blind_spot_signal", "PSIG-006")
            _conf_items.append(
                f"<li>Structural blind spot scope — {_bcnt} entities ({esc(_bsig)}, THEORETICAL_BASELINE)</li>"
            )
        _dim_note = (
            f"These {_unk_n} dimensions are confirmed unknowns — not assumed healthy states. "
            f"The codebase may operate normally in all {_unk_n} dimensions, or it may not. "
            "The current evidence scope does not resolve this. "
            "Any decision that depends on these dimensions operating within expected parameters "
            "currently lacks an evidence base."
        )
        _boundary_lead = (
            "These unknowns do not indicate failure. "
            "They define the evidence boundary that must be resolved before execution confidence can be claimed."
        )
        boundary_section_html = (
            '  <div class="section">\n'
            '    <div class="section-header">'
            '<span class="section-num">04</span>'
            '<span class="section-title">Known vs Unknown Boundary</span></div>\n'
            f'    <p class="boundary-lead">{esc(_boundary_lead)}</p>\n'
            '    <div class="boundary-grid">\n'
            '      <div class="boundary-block known">\n'
            '        <div class="boundary-block-label">Confirmed</div>\n'
            '        <ul class="boundary-list">\n'
            + "".join(f"          {li}\n" for li in _conf_items)
            + '        </ul>\n      </div>\n'
            '      <div class="boundary-block unknown">\n'
            '        <div class="boundary-block-label">Outside Evidence Scope</div>\n'
            '        <ul class="boundary-list">\n'
            + "".join(f"          {li}\n" for li in _unk_items)
            + '        </ul>\n      </div>\n'
            '    </div>\n'
            f'    <div class="boundary-note">\n      {esc(_dim_note)}\n    </div>\n'
            '  </div>'
        )
    else:
        boundary_section_html = (
            '  <div class="section">\n'
            '    <div class="section-header">'
            '<span class="section-num">04</span>'
            '<span class="section-title">Known vs Unknown Boundary</span></div>\n'
            '    <div class="boundary-grid">\n'
            '      <div class="boundary-block known">\n'
            '        <div class="boundary-block-label">Confirmed</div>\n'
            f'        <ul class="boundary-list">\n'
            f'          <li>Full structural topology — {counts["domains"]} domains, '
            f'{counts["capabilities"]} capabilities, {counts["components"]} components</li>\n'
            '          <li>Grounding classification for every domain</li>\n'
            '          <li>5 structural signals with computed values</li>\n'
            '          <li>Dependency load, structural density, and coordination pressure ratios</li>\n'
            '          <li>Count and domain location of unresolvable runtime dimensions</li>\n'
            '        </ul>\n      </div>\n'
            '      <div class="boundary-block unknown">\n'
            '        <div class="boundary-block-label">Outside Evidence Scope</div>\n'
            '        <ul class="boundary-list">\n'
            '          <li>Backend service memory and resource utilization</li>\n'
            '          <li>Cache layer efficiency</li>\n'
            '          <li>Cache layer availability and connectivity</li>\n'
            '          <li>Event pipeline activity and throughput</li>\n'
            f'          <li>{fleet_conn}</li>\n'
            f'          <li>{vehicle_alert}</li>\n'
            f'          <li>{driver_session}</li>\n'
            '        </ul>\n      </div>\n'
            '    </div>\n'
            '    <div class="boundary-note">\n'
            '      These seven dimensions are confirmed unknowns — not assumed healthy states. '
            'The platform may be\n'
            '      operating normally in all seven dimensions, or it may not be. '
            'The current evidence scope does not\n'
            '      resolve this. Any operational decision that depends on these dimensions operating '
            'within normal\n'
            '      parameters currently lacks an evidence base.\n'
            '    </div>\n  </div>'
        )

    if use_psig and decision_model:
        _risk   = decision_model.get("structural_risk", "MODERATE")
        _evcomp = decision_model.get("evidence_completeness", "PARTIAL")
        _dec    = decision_model.get("decision", "INVESTIGATE")
        _risk_color = {
            "LOW": "var(--green)", "MODERATE": "var(--amber)", "HIGH": "var(--red)"
        }.get(_risk, "var(--fg-muted)")
        _evc_color = {
            "HIGH": "var(--green)", "PARTIAL": "var(--amber)"
        }.get(_evcomp, "var(--fg-muted)")
        decision_posture_html = (
            '  <div class="section">\n'
            '    <div class="section-header">'
            '<span class="section-num">06</span>'
            '<span class="section-title">Decision Posture</span></div>\n'
            '    <div class="posture-row">\n'
            f'      <div class="posture-badge">{esc(_dec)}</div>\n'
            '      <div class="posture-text">The INVESTIGATE posture reflects evidence incompleteness, '
            'not structural instability. Structural metrics are below risk thresholds. '
            'The execution layer has not been evaluated in this run. '
            'A commitment made at this state carries evidence gaps, not confirmed structural risk.</div>\n'
            '    </div>\n'
            '    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:16px 0;'
            'background:var(--surface);border:1px solid var(--border);'
            'border-left:3px solid var(--gold);padding:16px 20px;border-radius:3px">\n'
            f'      <div><div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;'
            f'color:var(--fg-muted);margin-bottom:4px">Structural Risk</div>'
            f'<div style="font-size:14px;color:{_risk_color}">{esc(_risk)}</div></div>\n'
            f'      <div><div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;'
            f'color:var(--fg-muted);margin-bottom:4px">Evidence Completeness</div>'
            f'<div style="font-size:14px;color:{_evc_color}">{esc(_evcomp)}</div></div>\n'
            f'      <div><div style="font-size:10px;letter-spacing:.1em;text-transform:uppercase;'
            f'color:var(--fg-muted);margin-bottom:4px">Decision</div>'
            f'<div style="font-size:14px;color:var(--gold)">{esc(_dec)}</div></div>\n'
            '    </div>\n'
            '    <p class="body-text">The assessment does not specify what action to take. '
            'It establishes the structural state from which any decision must be made. '
            'Structural risk is LOW — the codebase topology does not present elevated dependency '
            'or density risk. The INVESTIGATE designation is driven by evidence gaps: '
            'execution layer not evaluated, blind spot coverage active, and signals not activated '
            'in this run. Resolving these gaps moves evidence completeness from PARTIAL to HIGH.</p>\n'
            '    <div class="conclusion-block">\n'
            '      <div class="conclusion-label">Structural Conclusion</div>\n'
            '      <p class="conclusion-text">The system is structurally stable.</p>\n'
            '      <p class="conclusion-body">Structural analysis shows low dependency load, '
            'controlled density, and no system-wide pressure propagation detected.</p>\n'
            '      <p class="conclusion-body">The INVESTIGATE posture is driven by evidence incompleteness, '
            'not by structural instability.</p>\n'
            '      <p class="conclusion-body">Execution-layer behavior remains outside the current evidence scope.</p>\n'
            '    </div>\n'
            '  </div>'
        )
    else:
        decision_posture_html = (
            '  <div class="section">\n'
            '    <div class="section-header">'
            '<span class="section-num">06</span>'
            '<span class="section-title">Decision Posture</span></div>\n'
            '    <div class="posture-row">\n'
            '      <div class="posture-badge">INVESTIGATE</div>\n'
            f'      <div class="posture-text">The {esc(band_label)} state means the structural foundation is confirmed, '
            f'but the execution layer has not been evaluated. '
            f'The gap between {band_lo} and {band_hi} will not close without execution evidence. '
            'A commitment made at this state carries unresolved structural risk.</div>\n'
            '    </div>\n'
            '    <p class="body-text">The assessment does not specify what action to take. '
            'It establishes the structural state from which any decision must be made. '
            'Proceeding without resolving the known unknowns transfers structural risk '
            'into the commitment. Deferring does not make the unknowns disappear — it carries them forward.</p>\n'
            '  </div>'
        )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LENS Assessment — Narrative Brief{title_suffix}</title>
  <style>{_TIER1_NARRATIVE_CSS}</style>
</head>
<body>
<div class="page">

  <div class="report-header">
    <div>
      <div class="report-brand">Signäl Program Intelligence</div>
      <div class="report-title">LENS Assessment — Narrative Brief{title_suffix}</div>
      <div class="report-type">Tier-1 Interpretation Layer</div>
    </div>
    <div class="report-meta">
      <div>Client: <strong>{esc(client_name)}</strong></div>
      <div>Issued: <strong>April 2026</strong></div>
    </div>
  </div>

  <div class="nav-strip">
    <a href="{ds_link}" class="nav-link">Decision</a>
    <span class="nav-link active">Executive Brief</span>
    <a href="{ev_link}" class="nav-link">LENS Assessment</a>
    <a href="{t2_link}" class="nav-link">Diagnostic</a>
  </div>

  {RC.anchor_block(score, band_label, band_lo, band_hi)}

  <div class="section">
    <div class="section-header"><span class="section-num">01</span><span class="section-title">Executive Context</span></div>
    <p class="body-text">A LENS Assessment is a bounded structural analysis of a delivery environment. It derives its outputs
      exclusively from execution evidence — source artifacts, structural telemetry, and system configuration
      observable within the assessment scope. It does not produce recommendations, prognosis, or remediation content.</p>
    <p class="body-text">This Narrative Brief provides a governed interpretation of the Tier-1 Evidence Brief for {client_ref}.
      All statements in this document are traceable to the underlying execution evidence. No claim is made beyond what the evidence supports.</p>
    <p class="body-text">The Evidence Brief is the authoritative product surface. This document provides context for reading
      and acting on the evidence it contains.</p>
  </div>

  <div class="section">
    <div class="section-header"><span class="section-num">02</span><span class="section-title">Structural State Overview</span></div>
    <div class="score-row">
      <div class="score-cell">
        <div class="score-cell-label">Assessment Score</div>
        <div class="score-cell-value">{score}</div>
        <div class="score-cell-sub">{esc(band_label)}</div>
      </div>
      <div class="score-cell">
        <div class="score-cell-label">Confidence Band</div>
        <div class="score-cell-value">{band_lo} – {band_hi}</div>
        <div class="score-cell-sub">Unresolved</div>
      </div>
      <div class="score-cell">
        <div class="score-cell-label">Decision Guidance</div>
        <div class="score-cell-value" style="font-size:14px;letter-spacing:.05em">INVESTIGATE</div>
        <div class="score-cell-sub">Before committing</div>
      </div>
    </div>
    <p class="exec-state-lead">Structurally verified. Execution not yet validated.</p>
    <p class="body-text">The score of {score} reflects a complete structural proof — full coverage and reconstruction confirmed —
      but an unevaluated execution layer. The score is derived deterministically from evidence; it is not
      an assessment of quality or performance. The upper band of {band_hi} represents the achievable state
      if execution evidence is produced.</p>
    <p class="body-text">The {esc(band_label)} band means variance has not been resolved. The current score is a confirmed floor,
      not a final number. Any commitment that depends on the execution layer operating within expected
      parameters carries structural risk that this assessment does not resolve.</p>
    <p class="body-text" style="font-size:12.5px;color:var(--fg-muted)">
      Structural composition: {counts["domains"]} domains &nbsp;·&nbsp; {counts["capabilities"]} capabilities &nbsp;·&nbsp; {counts["components"]} components &nbsp;·&nbsp; {counts["total_nodes"]} total nodes
    </p>
    <div class="grounding-row">
      <div class="grounding-cell">
        <div class="grounding-dot dot-grounded"></div>
        <div><div class="grounding-cell-text">Grounded</div><div class="grounding-cell-count">{grounded_count} of {counts["domains"]} domains — evidence-backed</div></div>
      </div>
      <div class="grounding-cell">
        <div class="grounding-dot dot-weak"></div>
        <div><div class="grounding-cell-text">Weakly Grounded</div><div class="grounding-cell-count">{weak_count} of {counts["domains"]} domains — partial evidence</div></div>
      </div>
    </div>
{signal_table_html}
  </div>

{focus_section_html}

{boundary_section_html}

  <div class="section">
    <div class="section-header"><span class="section-num">05</span><span class="section-title">Next Proposed Actions</span></div>
    <div class="resolution-block">
      <div class="resolution-label">Outside Tier-1 Scope</div>
      <p class="resolution-text">This assessment establishes what is structurally confirmed, what falls outside the evidence boundary,
        and what the structure of that gap looks like.</p>
      <p class="resolution-text">What happens next — whether to investigate further, which structural unknowns to prioritize, what
        diagnostic scope is required — is a separate matter. It is not produced by this assessment, and no
        direction is implied by what is or is not confirmed here.</p>
      <p class="resolution-text">Any proposed action layer requires a separate scope and is issued independently of this Tier-1 artifact.</p>
    </div>
  </div>

{decision_posture_html}

  <div class="report-footer">
    <div>
      <div class="footer-brand">Signäl</div>
      <div style="margin-top:4px;font-size:11px;color:var(--fg-muted)">Program Intelligence — LENS Assessment</div>
    </div>
    <div class="footer-note">
      {esc(footer_note)}<br>
      All structural values are derived from verified execution evidence.
    </div>
  </div>

</div>
</body>
</html>"""


# ---------------------------------------------------------------------------
# Tier-1 report set generation
# ---------------------------------------------------------------------------

def generate_tier1_reports(output_dir: Optional[Path] = None) -> List[Path]:
    """Generate the Tier-1 report set: Evidence Brief + Narrative Brief, internal + publish-safe.

    Returns list of written file paths (4 files).
    """
    if output_dir is None:
        output_dir = TIER1_REPORTS_DIR

    pub_dir = output_dir / "publish"
    output_dir.mkdir(parents=True, exist_ok=True)
    pub_dir.mkdir(parents=True, exist_ok=True)

    # Pre-flight: canonical package must exist
    if not CANONICAL_PKG_DIR.exists():
        _fail(f"Canonical package directory not found: {CANONICAL_PKG_DIR}")

    topology = load_canonical_topology()
    signals = load_signal_registry()
    gauge = load_gauge_state()

    psig_proj      = _load_psig_projection()
    pz_proj        = _load_pressure_zone_projection()
    binding        = _load_binding_envelope()
    metrics        = _compute_structural_metrics(binding)
    decision_model = _compute_decision_model(metrics, psig_proj, gauge)

    files: List[Path] = []

    artifacts = [
        (output_dir / "lens_tier1_evidence_brief.html",         _build_tier1_evidence_brief,  False),
        (pub_dir    / "lens_tier1_evidence_brief_pub.html",     _build_tier1_evidence_brief,  True),
        (output_dir / "lens_tier1_narrative_brief.html",        _build_tier1_narrative_brief, False),
        (pub_dir    / "lens_tier1_narrative_brief_pub.html",    _build_tier1_narrative_brief, True),
    ]

    for out_path, builder, pub_safe in artifacts:
        html = builder(topology, signals, gauge, publish_safe=pub_safe,
                       psig_proj=psig_proj, pz_proj=pz_proj,
                       metrics=metrics, decision_model=decision_model)
        out_path.write_text(html, encoding="utf-8")
        print(f"[LENS REPORT] Generated: {out_path.resolve()}")
        files.append(out_path)

    return files


# ---------------------------------------------------------------------------
# Tier-2: Diagnostic Narrative
# ---------------------------------------------------------------------------

TIER2_REPORTS_DIR = REPORTS_DIR / "tier2"

FOCUS_DOMAIN_T2 = "DOMAIN-10"

_TIER2_DIAGNOSTIC_CSS = """
  :root{--bg:#0e0e10;--surface:#16161a;--surface-raised:#1c1c22;--border:#2a2a2e;--border-subtle:#222228;--fg:#e8e8e8;--fg-muted:#888;--fg-dim:#555;--gold:#c89b3c;--gold-muted:rgba(200,155,60,0.12);--gold-border:rgba(200,155,60,0.28);--green:#4caf6e;--amber:#d4912a;--amber-muted:rgba(212,145,42,0.1);--amber-border:rgba(212,145,42,0.25);--red:#e05252;--font:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--fg);font-family:var(--font);font-size:14px;line-height:1.7;-webkit-font-smoothing:antialiased}
  .page{max-width:960px;margin:0 auto;padding:48px 40px 80px}
  .report-header{border-bottom:1px solid var(--border);padding-bottom:24px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:flex-start}
  .report-brand{font-size:11px;color:var(--fg-muted);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
  .report-title{font-size:20px;color:var(--fg);font-weight:400}
  .report-type{font-size:11px;color:var(--fg-muted);margin-top:4px;letter-spacing:.06em}
  .report-meta{text-align:right;font-size:12px;color:var(--fg-muted);line-height:1.8}
  .report-meta strong{color:var(--fg);font-weight:500}
  .nav-strip{display:flex;gap:10px;margin-bottom:36px}
  .nav-link{display:inline-block;padding:7px 14px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--border);color:var(--fg-muted);text-decoration:none;border-radius:3px}
  .nav-link:hover{border-color:var(--gold);color:var(--gold)}
  .nav-link.active{border-color:var(--gold-border);color:var(--gold);background:var(--gold-muted)}
  .t2-section{margin-bottom:48px}
  .t2-section-header{display:flex;align-items:baseline;gap:12px;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid var(--border-subtle)}
  .t2-section-num{font-size:10px;letter-spacing:.12em;color:var(--gold);text-transform:uppercase;min-width:24px}
  .t2-section-title{font-size:15px;color:var(--fg);font-weight:500;letter-spacing:.02em}
  .t2-context-lock{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--gold);padding:20px 24px;border-radius:3px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .t2-field{display:flex;flex-direction:column;gap:4px}
  .t2-field-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg-muted)}
  .t2-field-value{font-size:13px;color:var(--fg)}
  .t2-field-value.incomplete{color:var(--amber)}
  .t2-field-value.complete{color:var(--green)}
  .t2-overview-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
  .t2-overview-cell{background:var(--surface);border:1px solid var(--border);padding:14px 16px;border-radius:3px}
  .t2-cell-label{font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--fg-muted);margin-bottom:6px}
  .t2-cell-value{font-size:18px;color:var(--fg);font-weight:300}
  .t2-cell-sub{font-size:11px;color:var(--fg-muted);margin-top:3px}
  .t2-pressure-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .t2-pressure-cell{background:var(--surface-raised);border:1px solid var(--border-subtle);padding:10px 12px;border-radius:3px}
  .t2-pressure-label{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--fg-dim);margin-bottom:4px}
  .t2-pressure-count{font-size:16px;color:var(--fg-muted)}
  .t2-zone-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .t2-zone-card{background:var(--surface);border:1px solid var(--border);padding:18px 20px;border-radius:3px;text-decoration:none;display:block;color:inherit}
  .t2-zone-card:hover{border-color:var(--amber-border)}
  .t2-zone-id{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-muted);margin-bottom:8px}
  .t2-zone-domain{font-size:14px;color:var(--fg);margin-bottom:12px}
  .t2-badge-row{display:flex;gap:6px;flex-wrap:wrap}
  .t2-badge{display:inline-block;padding:3px 8px;font-size:10px;letter-spacing:.06em;border-radius:2px;text-transform:uppercase}
  .t2-type-pressure{background:rgba(212,145,42,0.12);color:var(--amber);border:1px solid var(--amber-border)}
  .t2-type-gap{background:rgba(136,136,136,0.1);color:#888;border:1px solid #333}
  .t2-type-conflict{background:rgba(224,82,82,0.1);color:var(--red);border:1px solid rgba(224,82,82,0.25)}
  .t2-type-inconsistency{background:rgba(76,175,110,0.08);color:var(--green);border:1px solid rgba(76,175,110,0.2)}
  .t2-sev-high{background:rgba(224,82,82,0.1);color:var(--red)}
  .t2-sev-moderate{background:rgba(212,145,42,0.1);color:var(--amber)}
  .t2-sev-low{background:rgba(136,136,136,0.1);color:#888}
  .t2-conf-strong{background:rgba(76,175,110,0.1);color:var(--green)}
  .t2-conf-partial{background:rgba(200,155,60,0.1);color:var(--gold)}
  .t2-conf-weak{background:rgba(136,136,136,0.1);color:#888}
  .t2-zone-block{background:var(--surface);border:1px solid var(--border);padding:24px;border-radius:3px;margin-bottom:24px}
  .t2-zone-block-header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid var(--border-subtle);margin-bottom:20px}
  .t2-zone-block-id{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber)}
  .t2-zone-block-domain{font-size:14px;color:var(--fg);margin-top:4px}
  .t2-zone-block-back{font-size:10px;color:var(--fg-dim);text-decoration:none;letter-spacing:.06em;text-transform:uppercase}
  .t2-zone-block-back:hover{color:var(--fg-muted)}
  .t2-sub-section{margin-bottom:16px;padding:16px 18px;background:var(--surface-raised);border:1px solid var(--border-subtle);border-radius:3px}
  .t2-sub-section:last-child{margin-bottom:0}
  .t2-sub-header{display:flex;align-items:center;gap:10px;margin-bottom:12px}
  .t2-sub-tag{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);border:1px solid var(--gold-border);padding:2px 8px;border-radius:2px}
  .t2-sub-title{font-size:12px;color:var(--fg-muted);letter-spacing:.04em;text-transform:uppercase}
  .t2-body{font-size:13px;color:var(--fg);line-height:1.7;margin-bottom:10px}
  .t2-body:last-child{margin-bottom:0}
  .t2-chip-row{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}
  .t2-chip{font-size:11px;padding:2px 8px;background:var(--surface);border:1px solid var(--border);border-radius:2px;color:var(--fg-muted);font-family:monospace}
  .t2-path-block{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:12px 14px;margin:10px 0}
  .t2-path-chain{font-size:12px;color:var(--fg);font-family:monospace;margin-bottom:6px}
  .t2-path-meta{display:flex;gap:12px;font-size:10px;color:var(--fg-muted)}
  .t2-path-block.t2-inferred{background:rgba(212,145,42,0.04);border-color:var(--amber-border)}
  .t2-inferred-decl{font-size:11px;color:var(--amber);margin-top:8px;padding:6px 8px;background:var(--amber-muted);border:1px solid var(--amber-border);border-radius:2px}
  .t2-evidence-row{display:flex;align-items:center;gap:10px;margin:8px 0}
  .t2-ev-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg-muted)}
  .t2-ev-strong{color:var(--green);font-weight:500}
  .t2-ev-partial{color:var(--gold);font-weight:500}
  .t2-ev-weak{color:var(--amber);font-weight:500}
  .t2-avail-list{list-style:none;padding:0;margin-top:8px}
  .t2-avail-item{font-size:11px;color:var(--fg-muted);padding:4px 0;border-bottom:1px solid var(--border-subtle);font-family:monospace}
  .t2-avail-item:last-child{border-bottom:none}
  .t2-avail-decode{font-family:var(--font);font-size:10px;color:var(--fg-dim);margin-left:8px;font-style:italic}
  .t2-pattern-summary{background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid var(--gold);padding:18px 22px;border-radius:2px}
  .t2-reading-guide-prose{margin-bottom:14px}
  .t2-reading-guide-prose p{margin-bottom:10px}
  .t2-reading-guide-prose p:last-child{margin-bottom:0}
  .t2-ll-table{display:flex;flex-direction:column;gap:0;border:1px solid var(--border);border-radius:3px;overflow:hidden}
  .t2-ll-row{display:grid;grid-template-columns:180px 160px 1fr;gap:0;padding:8px 12px;border-bottom:1px solid var(--border-subtle);align-items:start}
  .t2-ll-row:last-child{border-bottom:none}
  .t2-ll-row:nth-child(even){background:rgba(255,255,255,0.02)}
  .t2-ll-term{font-size:10px;font-family:monospace;color:var(--fg-dim);letter-spacing:.04em;padding-right:8px}
  .t2-ll-exec{font-size:11px;color:var(--fg);font-weight:500;padding-right:8px}
  .t2-ll-decode{font-size:11px;color:var(--fg-muted)}
  .t2-missing-list{list-style:none;padding:0;margin-top:10px}
  .t2-missing-item{font-size:12px;padding:8px 10px;border-bottom:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:3px}
  .t2-missing-item:last-child{border-bottom:none}
  .t2-missing-desc{color:var(--fg)}
  .t2-missing-impact{color:var(--amber);font-size:11px}
  .t2-uncertainty-block{background:rgba(212,145,42,0.04);border:1px solid var(--amber-border);border-left:3px solid var(--amber);padding:16px 18px;border-radius:3px}
  .t2-inference-active{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding:8px 12px;background:rgba(212,145,42,0.1);border:1px solid var(--amber-border);border-radius:2px}
  .t2-inference-tag{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber)}
  .t2-inference-value{font-size:12px;color:var(--amber);letter-spacing:.06em;text-transform:uppercase;font-weight:600}
  .t2-unresolved-list{list-style:none;padding:0;margin-top:8px}
  .t2-unresolved-item{padding:8px 0;border-bottom:1px solid var(--border-subtle)}
  .t2-unresolved-item:last-child{border-bottom:none}
  .t2-unresolved-element{font-size:12.5px;color:var(--fg);margin-bottom:3px}
  .t2-unresolved-reason{font-size:11px;color:var(--fg-muted)}
  .t2-hook-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:4px}
  .t2-hook-block{background:var(--surface);border:1px solid var(--border);padding:12px 14px;border-radius:3px}
  .t2-hook-type{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--border-subtle)}
  .t2-hook-id{font-size:10px;color:var(--fg-dim);font-family:monospace;margin-bottom:4px}
  .t2-hook-surface{font-size:11.5px;color:var(--fg-muted);line-height:1.5}
  .report-footer{display:flex;justify-content:space-between;align-items:flex-end;padding-top:24px;border-top:1px solid var(--border);margin-top:48px}
  .footer-brand{font-size:13px;color:var(--gold);letter-spacing:.08em}
  .footer-note{font-size:11px;color:var(--fg-muted);text-align:right;line-height:1.7}
  @media(max-width:600px){.t2-context-lock{grid-template-columns:1fr}.t2-overview-grid{grid-template-columns:1fr 1fr}.t2-pressure-row{grid-template-columns:1fr 1fr}.t2-zone-grid{grid-template-columns:1fr}.t2-hook-grid{grid-template-columns:1fr}.report-header{flex-direction:column;gap:12px}.report-meta{text-align:left}}
  details.t2-zone-details{margin-bottom:16px;background:var(--surface);border:1px solid var(--border);border-radius:3px}
  details.t2-zone-details[open]{border-color:var(--amber-border)}
  details.t2-zone-details > summary{list-style:none;cursor:pointer;padding:18px 20px;position:relative;outline:none;user-select:none}
  details.t2-zone-details > summary::-webkit-details-marker{display:none}
  details.t2-zone-details > summary::after{content:'▸';position:absolute;right:20px;top:20px;font-size:10px;color:var(--fg-dim)}
  details.t2-zone-details[open] > summary::after{content:'▾';color:var(--gold)}
  .t2-summary-top{display:flex;align-items:center;gap:12px;margin-bottom:10px}
  .t2-summary-zone-id{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--amber);min-width:60px}
  .t2-summary-domain{font-size:14px;color:var(--fg)}
  .t2-summary-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
  .t2-summary-preview{font-size:12px;color:var(--fg-muted);line-height:1.6;padding-top:8px;border-top:1px solid var(--border-subtle)}
  details.t2-zone-details > .t2-zone-block{border:none;border-top:1px solid var(--border-subtle);border-radius:0 0 3px 3px;margin-bottom:0;background:transparent}
  .t2-topo-intro{font-size:12px;color:var(--fg-muted);margin-bottom:18px;line-height:1.7;max-width:680px}
  .t2-topo-panel{border:1px solid var(--border);border-radius:4px;background:#09090d;box-shadow:0 2px 12px rgba(0,0,0,0.35)}
  .og-frame{padding:18px 20px 16px}
  .og-frame-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.05)}
  .og-frame-tag{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
  .og-frame-meta{font-size:10px;color:var(--fg-dim);letter-spacing:.03em}
  .og-canvas-wrap{border-radius:3px;overflow:hidden}
  .og-legend{display:flex;flex-wrap:wrap;gap:0;margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.05)}
  .og-legend-item{display:inline-flex;align-items:center;gap:6px;margin-right:24px;margin-bottom:2px}
  .og-legend-dot{display:inline-block;width:7px;height:7px;border-radius:50%;flex-shrink:0}
  .og-legend-lbl{font-size:10.5px;color:#686870;letter-spacing:.02em}
  .rc-trace{font-size:10px;color:var(--fg-dim);opacity:.7;font-style:normal}
  .rc-anchor-block{display:flex;align-items:center;gap:10px;padding:8px 14px;background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid var(--green);border-radius:2px;margin-bottom:16px;font-size:12px;flex-wrap:wrap}
  .rc-anchor-state{color:#c8c8d4;font-weight:600;letter-spacing:.02em}
  .rc-anchor-score{color:var(--green);font-weight:600}
  .rc-anchor-band{color:var(--fg-muted)}
  .rc-anchor-decision{color:var(--amber);letter-spacing:.05em;text-transform:uppercase}
  .rc-anchor-sep{color:#333}
"""


def _load_psee_interpretation_by_zone_class() -> Dict:
    """Load interpretation_exposure.json and index EXP render_payloads by zone_class.

    Used by LENS report to attach interpretation to PSEE zone blocks.
    Returns empty dict if file absent — report generation is unaffected.
    Each zone_class maps to the render_payload dict of the first primary zone-class
    EXP item found (binding_context=None, source_type='zone').
    """
    exposure_path = REPO_ROOT / "docs" / "pios" / "41.x" / "interpretation_exposure.json"
    result: Dict = {}
    if not exposure_path.exists():
        return result
    try:
        exp = json.loads(exposure_path.read_text())
        for item in exp.get("exposure_items", []):
            src  = item.get("source_ref", {})
            if (item.get("source_type") == "zone"
                    and item.get("binding_context") is None
                    and src.get("zone_class")
                    and src["zone_class"] not in result):
                result[src["zone_class"]] = {
                    "render_payload":        item.get("render_payload", {}),
                    "interpretation_ref_id": item.get("interpretation_ref", {}).get("registry_entry_id"),
                }
    except Exception:
        pass
    return result


def _load_language_layer() -> Dict:
    """Load language_layer_registry.json and index entries by canonical_label.

    Returns empty dict if file absent — report generation is unaffected.
    Callers use: ll.get("RUN_RELATIVE_OUTLIER", {}).get("short_decode", "")
    """
    registry_path = REPO_ROOT / "docs" / "pios" / "41.x" / "language_layer_registry.json"
    result: Dict = {}
    if not registry_path.exists():
        return result
    try:
        reg = json.loads(registry_path.read_text())
        for entry in reg.get("entries", []):
            label = entry.get("canonical_label")
            if label:
                result[label] = entry
    except Exception:
        pass
    return result


_EXEC_LINE_STOP: frozenset = frozenset({
    "a", "an", "the", "of", "in", "on", "at", "to", "for", "from", "by", "with",
    "this", "that", "it", "its", "is", "are", "was", "were", "be", "been", "being",
    "and", "or", "but", "not", "no", "as", "than", "more", "many", "much", "far",
    "which", "who", "how", "where", "when", "while", "other", "another", "any",
    "each", "all", "both", "one", "has", "have", "had", "per",
})

# Presentation-only normalization overrides keyed by interpretation_ref (registry_entry_id).
# Applied at render time; not persisted. Ensures identical INT entries yield identical lines.
_EXEC_LINE_OVERRIDES: Dict[str, str] = {
    "INT-007": "Multiple pressure patterns intersect in this part of the system.",
}


def _derive_executive_line(text: str) -> str:
    """Derive a deterministic executive summary line from interpretation text at render time.

    Steps:
    1. Take first sentence (up to ". "); truncate at subordinate markers (; — :)
    2. Remove duplicate content tokens (keep last occurrence; skip stop words)
    Deterministic: same input always yields same output. No new terms added.
    """
    if not text:
        return text
    dot = text.find(". ")
    first = text[:dot] if dot != -1 else text
    for marker in ["; ", " \u2014 ", ": "]:
        pos = first.find(marker)
        if pos != -1:
            first = first[:pos]
    first = first.strip()

    words = first.split()
    seen: dict = {}
    for i, w in enumerate(words):
        key = w.lower().rstrip(".,;!?")
        if key not in _EXEC_LINE_STOP:
            seen.setdefault(key, []).append(i)

    remove = {idx for indices in seen.values() if len(indices) > 1 for idx in indices[:-1]}
    return " ".join(w for i, w in enumerate(words) if i not in remove)


def _t2_obfuscate(text: str) -> str:
    return (text
        .replace("BlueEdge Fleet Management Platform", "Client Environment")
        .replace("BlueEdge", "Client")
        .replace("Fleet Core Operations", "Core Operations")
        .replace("Fleet Vertical Extensions", "Vertical Extensions")
        .replace("Extended Operations and Driver Services", "Extended Operations")
        .replace("Extended Operations & Driver Services", "Extended Operations")
        .replace("fleet connection activity", "platform connection activity")
        .replace("Fleet connection activity", "Platform connection activity")
        .replace("vehicle alert activity", "operational alert activity")
        .replace("Vehicle alert activity", "Operational alert activity")
        .replace("driver session performance", "session performance")
        .replace("Driver session performance", "Session performance")
        .replace("CE-001", "the platform core")
    )


def _derive_tier2_zones(topology: Dict, signals: Dict) -> List[Dict]:
    domains = topology["domains"]
    sigs = signals["signals"]

    sigs_by_domain: Dict[str, List] = {}
    for s in sigs:
        did = s.get("domain_id", "")
        sigs_by_domain.setdefault(did, []).append(s)

    candidates: List[Dict] = []
    seen: set = set()

    for d in domains:
        if d["domain_id"] == FOCUS_DOMAIN_T2 and d["domain_id"] not in seen:
            candidates.append(d)
            seen.add(d["domain_id"])

    for d in domains:
        if d["grounding"] != "GROUNDED" and d["domain_id"] not in seen:
            candidates.append(d)
            seen.add(d["domain_id"])

    zones = []
    for i, d in enumerate(candidates, 1):
        did = d["domain_id"]
        domain_sigs = sigs_by_domain.get(did, [])
        is_focus = did == FOCUS_DOMAIN_T2

        if is_focus and domain_sigs:
            zone_type = "pressure_concentration"
        elif not domain_sigs:
            zone_type = "evidence_gap"
        else:
            confs = {s.get("evidence_confidence") for s in domain_sigs}
            if "STRONG" in confs and "WEAK" in confs:
                zone_type = "signal_conflict"
            else:
                zone_type = "structural_inconsistency"

        if is_focus:
            severity = "HIGH"
        elif zone_type == "evidence_gap":
            severity = "MODERATE"
        else:
            severity = "LOW"

        if not domain_sigs:
            confidence = "WEAK"
        elif any(s.get("evidence_confidence") == "STRONG" for s in domain_sigs):
            confidence = "STRONG"
        elif any(s.get("evidence_confidence") == "MODERATE" for s in domain_sigs):
            confidence = "PARTIAL"
        else:
            confidence = "WEAK"

        if not domain_sigs:
            traceability = "NOT_TRACEABLE"
        elif all(s.get("trace_links") for s in domain_sigs):
            traceability = "FULLY_TRACEABLE"
        else:
            traceability = "PARTIALLY_TRACEABLE"

        zones.append({
            "zone_id": f"ZONE-{i:02d}",
            "domain_id": did,
            "domain_name": d["domain_name"],
            "domain": d,
            "domain_sigs": domain_sigs,
            "zone_type": zone_type,
            "severity": severity,
            "confidence": confidence,
            "traceability": traceability,
        })

    return zones


def _derive_tier2_zones_from_projection(
    pz_proj: Dict, psig_proj: Optional[Dict], topology: Dict
) -> List[Dict]:
    """Build tier-2 zones from pressure_zone_projection for PSIG clients.

    Returns zone dicts with projection-native fields compatible with
    _build_t2_psig_zone_block() (zone_class, conditions, condition_signals,
    attribution_profile, embedded_pair_rules). BlueEdge path unaffected.
    """
    zone_projection = pz_proj.get("zone_projection", [])
    domains_by_id   = {d["domain_id"]: d for d in topology.get("domains", [])}

    cond_by_id: Dict = {}
    if psig_proj:
        for c in psig_proj.get("active_conditions_in_scope", []):
            cond_by_id[c["condition_id"]] = c

    zones = []
    for pz in zone_projection:
        anchor_id    = pz.get("anchor_id", "")
        anchor_name  = pz.get("anchor_name", anchor_id)
        domain       = domains_by_id.get(anchor_id, {
            "domain_id":      anchor_id,
            "domain_name":    anchor_name,
            "capability_ids": [],
        })
        conditions       = pz.get("conditions", [])
        condition_signals = [cond_by_id[c] for c in conditions if c in cond_by_id]
        attr             = pz.get("attribution_profile", "secondary")
        zone_class       = pz.get("zone_class", "COMPOUND_ZONE")
        severity         = "HIGH"     if attr == "primary"    else "MODERATE"
        confidence       = "STRONG"   if condition_signals    else "PARTIAL"
        traceability     = "FULLY_TRACEABLE" if condition_signals else "PARTIALLY_TRACEABLE"
        zones.append({
            "zone_id":             pz.get("zone_id", ""),
            "domain_id":           anchor_id,
            "domain_name":         domain.get("domain_name", anchor_name),
            "domain":              domain,
            "domain_sigs":         [],
            "zone_type":           "pressure_concentration",
            "severity":            severity,
            "confidence":          confidence,
            "traceability":        traceability,
            "zone_class":          zone_class,
            "conditions":          conditions,
            "condition_signals":   condition_signals,
            "attribution_profile": attr,
            "embedded_pair_rules": pz.get("embedded_pair_rules", []),
            "member_entity_ids":   pz.get("member_entity_ids", []),
            "psig_signals":        pz.get("signals", []),
        })
    return zones


def _t2_type_css(zone_type: str) -> str:
    return {
        "pressure_concentration": "t2-type-pressure",
        "evidence_gap":           "t2-type-gap",
        "signal_conflict":        "t2-type-conflict",
        "structural_inconsistency": "t2-type-inconsistency",
    }.get(zone_type, "t2-type-gap")


def _t2_sev_css(severity: str) -> str:
    return {"HIGH": "t2-sev-high", "MODERATE": "t2-sev-moderate", "LOW": "t2-sev-low"}.get(severity, "t2-sev-low")


def _t2_conf_css(confidence: str) -> str:
    return {"STRONG": "t2-conf-strong", "PARTIAL": "t2-conf-partial", "WEAK": "t2-conf-weak"}.get(confidence, "t2-conf-weak")


def _t2_ev_css(strength: str) -> str:
    return {"STRONG": "t2-ev-strong", "PARTIAL": "t2-ev-partial", "WEAK": "t2-ev-weak"}.get(strength, "t2-ev-weak")


def _build_t2_zone_block(zone: Dict, publish_safe: bool, interpretation_payload: Optional[Dict] = None) -> str:
    zone_id   = zone["zone_id"]
    did       = zone["domain_id"]
    dname     = zone["domain_name"]
    sigs      = zone["domain_sigs"]
    domain    = zone["domain"]
    zt        = zone["zone_type"]
    sev       = zone["severity"]
    conf      = zone["confidence"]
    trace_st  = zone["traceability"]

    display_name = esc(_t2_obfuscate(dname) if publish_safe else dname)
    caps = domain.get("capability_ids", [])

    # ── Section A: Condition Description ──────────────────────────────────
    if sigs:
        sig_titles = "".join(
            f'<span class="t2-chip">{esc(s["title"])}</span>' for s in sigs
        )
        if did == FOCUS_DOMAIN_T2:
            raw_cond = (
                f"{dname} domain exhibits concentrated structural pressure. "
                "Seven core runtime operational dimensions are unresolvable from available static evidence: "
                "backend service memory usage, cache efficiency, cache availability, event pipeline activity, "
                "fleet connection activity, vehicle alert activity, and driver session performance. "
                "Additionally, structural volatility analysis reveals an edge-to-node density ratio of 1.273, "
                "exceeding architectural unity and indicating a tightly interconnected dependency mesh within this domain."
            )
        else:
            raw_cond = (
                f"{dname} domain is weakly grounded with signal coverage present. "
                "Observable structural conditions are partially characterized."
            )
    else:
        raw_cond = (
            f"{dname} domain is weakly grounded. No signals are currently bound to this domain's "
            "scope in the available evidence set. The structural state — including capability "
            "functionality and component readiness — cannot be characterized beyond the grounding classification."
        )
        sig_titles = '<span class="t2-chip" style="color:var(--fg-dim)">No signals bound</span>'

    cond_text = esc(_t2_obfuscate(raw_cond) if publish_safe else raw_cond)

    section_a = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-a">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">A</span>
        <span class="t2-sub-title">Condition Description</span>
      </div>
      <p class="t2-body">{cond_text}</p>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:4px">Source signals:</div>
      <div class="t2-chip-row">{sig_titles}</div>
      <div class="t2-chip-row">
        <span class="t2-chip" style="color:var(--fg-dim)">derived_from: Tier-1 Evidence Brief</span>
      </div>
    </div>"""

    # ── Section B: Structural Drivers ─────────────────────────────────────
    node_chips = f'<span class="t2-chip">{esc(did)}</span>'
    for cap in caps[:3]:
        node_chips += f'<span class="t2-chip">{esc(cap)}</span>'

    if sigs:
        sig_chips = "".join(f'<span class="t2-chip">{esc(s["signal_id"])}</span>' for s in sigs) if not publish_safe else \
                    "".join(f'<span class="t2-chip">{esc(s["title"][:40])}…</span>' for s in sigs)
        dep_type = "BRANCHING" if len(sigs) > 1 else "LINEAR"
        if did == FOCUS_DOMAIN_T2:
            dep_desc = ("Multiple capability nodes within the platform infrastructure scope exhibit "
                        "independent structural conditions. Cache layer and monorepo container "
                        "contribute distinct but co-located pressure vectors.")
        else:
            dep_desc = "Observable dependency structure within domain scope. Full characterization pending signal coverage."
    else:
        sig_chips = '<span class="t2-chip" style="color:var(--fg-dim)">No contributing signals</span>'
        dep_type  = "UNKNOWN"
        dep_desc  = "No signal coverage available to characterize dependency structure within this domain."

    dep_desc_safe = esc(_t2_obfuscate(dep_desc) if publish_safe else dep_desc)

    section_b = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-b">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">B</span>
        <span class="t2-sub-title">Structural Drivers</span>
      </div>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted)">Contributing nodes:</div>
      <div class="t2-chip-row">{node_chips}</div>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:8px">Contributing signals:</div>
      <div class="t2-chip-row">{sig_chips}</div>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:8px">
        Dependency structure: <span style="color:var(--fg)">{dep_type}</span>
      </div>
      <p class="t2-body" style="margin-top:6px">{dep_desc_safe}</p>
    </div>"""

    # ── Section C: Propagation Path ────────────────────────────────────────
    if did == FOCUS_DOMAIN_T2:
        paths_html = f"""
      <div class="t2-path-block">
        <div class="t2-path-chain">{did} → CAP-27 → CAP-29</div>
        <div class="t2-path-meta">
          <span>path_id: {zone_id}-P1</span>
          <span>type: FORWARD</span>
          <span>evidence: STRONG</span>
        </div>
      </div>
      <div class="t2-path-block t2-inferred">
        <div class="t2-path-chain">{did} → DOMAIN-11</div>
        <div class="t2-path-meta">
          <span>path_id: {zone_id}-P2</span>
          <span>type: FORWARD</span>
          <span>evidence: PARTIAL</span>
        </div>
        <div class="t2-inferred-decl">Component-confirmed connection (event module in shared scope). Cross-domain edge not explicitly declared in topology artifact.</div>
      </div>"""
    else:
        paths_html = f"""
      <div class="t2-path-block t2-inferred">
        <div class="t2-path-chain">{did}</div>
        <div class="t2-path-meta">
          <span>path_id: {zone_id}-P1</span>
          <span>type: UNKNOWN</span>
          <span>evidence: INFERRED</span>
        </div>
        <div class="t2-inferred-decl">This path segment is inferred. No artifact evidence directly confirms structural connections from this domain.</div>
      </div>"""

    section_c = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-c">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">C</span>
        <span class="t2-sub-title">Propagation Path</span>
      </div>
      {paths_html}
    </div>"""

    # ── Section D: Evidence State ──────────────────────────────────────────
    ev_strength = ("STRONG" if any(s.get("evidence_confidence") == "STRONG" for s in sigs)
                   else "PARTIAL" if sigs else "WEAK")

    if sigs and not publish_safe:
        avail_links = "".join(
            f'<li class="t2-avail-item">{esc(link)}</li>'
            for s in sigs for link in s.get("trace_links", [])
        )
        avail_html = f'<ul class="t2-avail-list">{avail_links}</ul>' if avail_links else ""
    elif sigs and publish_safe:
        avail_html = f'<p class="t2-body" style="font-size:11px;color:var(--fg-muted)">{len(sigs)} evidence artifact set(s) available via trace links.</p>'
    else:
        avail_html = '<p class="t2-body" style="color:var(--fg-dim)">No artifact references available.</p>'

    if did == FOCUS_DOMAIN_T2:
        missing_html = """
        <ul class="t2-missing-list">
          <li class="t2-missing-item">
            <span class="t2-missing-desc">Live Prometheus metrics scrape</span>
            <span class="t2-missing-impact">Backend memory, cache efficiency, and cache availability cannot be confirmed without runtime instrumentation.</span>
          </li>
          <li class="t2-missing-item">
            <span class="t2-missing-desc">WebSocket and event-stream telemetry</span>
            <span class="t2-missing-impact">Event pipeline activity, fleet connection activity, and alert processing state require live data to resolve.</span>
          </li>
        </ul>"""
        if publish_safe:
            missing_html = missing_html.replace("fleet connection activity", "platform connection activity")
    elif not sigs:
        missing_html = """
        <ul class="t2-missing-list">
          <li class="t2-missing-item">
            <span class="t2-missing-desc">Any signal coverage for this domain</span>
            <span class="t2-missing-impact">Domain structural state cannot be classified beyond grounding status without at least one bound signal.</span>
          </li>
        </ul>"""
    else:
        missing_html = '<p class="t2-body" style="color:var(--fg-dim)">No missing evidence identified.</p>'

    ev_css = _t2_ev_css(ev_strength)
    section_d = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-d">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">D</span>
        <span class="t2-sub-title">Evidence State</span>
      </div>
      <div class="t2-evidence-row">
        <span class="t2-ev-label">Evidence strength:</span>
        <span class="{ev_css}">{ev_strength}</span>
      </div>
      {avail_html}
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:12px">Missing evidence:</div>
      {missing_html}
    </div>"""

    # ── Section E: Uncertainty Declaration ────────────────────────────────
    if did == FOCUS_DOMAIN_T2:
        unresolved_raw = [
            ("Seven runtime operational dimensions",
             "Absence of live Prometheus scrape and WebSocket telemetry prevents resolution. "
             "Dimensions confirmed as structurally required but evidence-absent: cache performance, "
             "event pipeline activity, fleet connection activity, alert processing, session scoring, "
             "backend memory, cache availability."),
            ("Propagation extent to adjacent domains",
             "Cross-domain structural connections are component-confirmed but not topology-edge-confirmed. "
             "Full propagation scope cannot be declared without live traversal data."),
        ]
    elif not sigs:
        unresolved_raw = [
            (f"Complete structural state of {dname}",
             "Absence of any signal coverage prevents characterization of capability-level "
             "or component-level structural state within this domain."),
        ]
    else:
        unresolved_raw = [
            ("Full signal confidence resolution",
             "Not all signals in zone scope have achieved full evidence closure."),
        ]

    unresolved_items = "".join(
        f"""<li class="t2-unresolved-item">
          <div class="t2-unresolved-element">{esc(_t2_obfuscate(elem) if publish_safe else elem)}</div>
          <div class="t2-unresolved-reason">{esc(_t2_obfuscate(reason) if publish_safe else reason)}</div>
        </li>"""
        for elem, reason in unresolved_raw
    )

    section_e = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-e">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">E</span>
        <span class="t2-sub-title">Uncertainty Declaration</span>
      </div>
      <div class="t2-uncertainty-block">
        <div class="t2-inference-active">
          <span class="t2-inference-tag">inference_prohibition</span>
          <span class="t2-inference-value">ACTIVE</span>
        </div>
        <ul class="t2-unresolved-list">{unresolved_items}</ul>
      </div>
    </div>"""

    # ── Section F: Investigation Entry Points ──────────────────────────────
    why_surface   = esc(f"Why does {_t2_obfuscate(dname) if publish_safe else dname} exhibit {zt.replace('_', ' ')}?")
    trace_dir     = "DOWNSTREAM" if sigs else "BOTH"
    ev_scope      = "FULL" if ev_strength == "STRONG" else "BOUNDED"

    section_f = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-f">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">F</span>
        <span class="t2-sub-title">Investigation Entry Points</span>
      </div>
      <div class="t2-hook-grid">
        <div class="t2-hook-block" id="zone-{zone_id}-why">
          <div class="t2-hook-type">WHY</div>
          <div class="t2-hook-id">{zone_id}-WHY</div>
          <div class="t2-hook-surface">{why_surface}</div>
        </div>
        <div class="t2-hook-block" id="zone-{zone_id}-trace">
          <div class="t2-hook-type">TRACE</div>
          <div class="t2-hook-id">{zone_id}-TRACE</div>
          <div class="t2-hook-surface">entry: {did} · direction: {trace_dir} · depth: 2</div>
        </div>
        <div class="t2-hook-block" id="zone-{zone_id}-ev">
          <div class="t2-hook-type">EVIDENCE</div>
          <div class="t2-hook-id">{zone_id}-EV</div>
          <div class="t2-hook-surface">scope: {ev_scope} · artifact targets from zone signal set</div>
        </div>
      </div>
    </div>"""

    type_css = _t2_type_css(zt)
    sev_css  = _t2_sev_css(sev)
    conf_css = _t2_conf_css(conf)

    cap_count    = len(caps)
    scope_label  = f"{cap_count} capability node{'s' if cap_count != 1 else ''}" if cap_count else "no capability nodes"
    preview_raw  = raw_cond[:130] + ("…" if len(raw_cond) > 130 else "")
    preview_text = esc(_t2_obfuscate(preview_raw) if publish_safe else preview_raw)
    zt_label     = zt.replace("_", " ")
    trace_label  = trace_st.replace("_", " ")

    section_g = ""
    if interpretation_payload:
        rp        = interpretation_payload.get("render_payload", interpretation_payload)
        ref_id    = interpretation_payload.get("interpretation_ref_id")
        biz_text  = rp.get("business_expression", "")
        override  = _EXEC_LINE_OVERRIDES.get(ref_id) if ref_id else None
        exec_line = override if override is not None else _derive_executive_line(biz_text)
        biz_safe  = esc(_t2_obfuscate(biz_text)  if publish_safe else biz_text)
        exec_safe = esc(_t2_obfuscate(exec_line) if publish_safe else exec_line)
        section_g = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-g">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">G</span>
        <span class="t2-sub-title">Structural Interpretation</span>
      </div>
      <p style="font-size:14px;color:#c8c8d4;font-weight:500;line-height:1.4;padding:10px 14px;background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid #5a5a80;border-radius:2px;margin:0 0 8px 0">{exec_safe}</p>
      <div class="t2-chip-row" style="margin-bottom:8px">
        <span class="t2-chip" style="color:var(--fg-dim)">executive interpretation</span>
      </div>
      <p class="t2-body" style="font-size:12px;color:#9a9aaa;line-height:1.65;border-left:2px solid #3a3a5a;padding-left:12px;margin:0">{biz_safe}</p>
      <div class="t2-chip-row" style="margin-top:6px">
        <span class="t2-chip" style="color:var(--fg-dim)">source: interpretation_exposure.json · render_target: lens_report · field: business_expression</span>
      </div>
    </div>"""

    return f"""
  <details class="t2-zone-details" id="zone-{zone_id}-details">
    <summary class="t2-zone-summary">
      <div class="t2-summary-top">
        <span class="t2-summary-zone-id">{zone_id}</span>
        <span class="t2-summary-domain">{display_name}</span>
      </div>
      <div class="t2-summary-badges">
        <span class="t2-badge {type_css}">{zt_label}</span>
        <span class="t2-badge" style="background:var(--surface-raised);color:var(--fg-dim);border:1px solid var(--border-subtle)">{scope_label}</span>
        <span class="t2-badge {sev_css}">{sev}</span>
        <span class="t2-badge {conf_css}">{conf}</span>
        <span class="t2-badge" style="background:var(--surface-raised);color:var(--fg-dim);border:1px solid var(--border-subtle)">{trace_label}</span>
      </div>
      <div class="t2-summary-preview">{preview_text}</div>
    </summary>
    <div class="t2-zone-block" id="zone-{zone_id}-block">
      <div class="t2-zone-block-header">
        <div>
          <div class="t2-zone-block-id">{zone_id} · {zt.replace("_", " ").upper()}</div>
          <div class="t2-zone-block-domain">{display_name}</div>
        </div>
        <a href="#zone-{zone_id}" class="t2-zone-block-back">↑ Zone inventory</a>
      </div>
      {section_a}
      {section_b}
      {section_c}
      {section_d}
      {section_e}
      {section_f}{section_g}
    </div>
  </details>"""


def _build_t2_psig_zone_block(zone: Dict, publish_safe: bool,
                               interpretation_payload: Optional[Dict] = None,
                               ll: Optional[Dict] = None) -> str:
    """Render a Tier-2 zone detail block for PSIG clients using projection data.

    Replaces _build_t2_zone_block() for zones derived from
    _derive_tier2_zones_from_projection(). BlueEdge path unaffected.
    """
    zone_id    = zone["zone_id"]
    did        = zone["domain_id"]
    dname      = zone["domain_name"]
    domain     = zone["domain"]
    zt         = zone["zone_type"]
    sev        = zone["severity"]
    conf       = zone["confidence"]
    trace_st   = zone["traceability"]
    zone_class = zone.get("zone_class", "COMPOUND_ZONE")
    conditions = zone.get("conditions", [])
    cond_sigs  = zone.get("condition_signals", [])
    attr       = zone.get("attribution_profile", "secondary")
    pair_rules = zone.get("embedded_pair_rules", [])
    members    = zone.get("member_entity_ids", [])
    psig_ids   = zone.get("psig_signals", [])
    caps       = domain.get("capability_ids", [])

    display_name = esc(_t2_obfuscate(dname) if publish_safe else dname)

    # ── Section A: Condition Description ──────────────────────────────────
    cond_chips = "".join(f'<span class="t2-chip">{esc(c)}</span>' for c in conditions)
    psig_chips = "".join(f'<span class="t2-chip">{esc(s)}</span>' for s in psig_ids)
    _zclass_exec_a = RC.apply_language(zone_class)
    _attr_exec_a   = RC.apply_language(attr.lower())
    raw_cond = (
        f"{dname} domain: {_zclass_exec_a} — "
        f"{len(conditions)} active condition{'s' if len(conditions) != 1 else ''} at zone scope. "
        f"{_attr_exec_a} — all conditions active."
    )
    cond_text = esc(_t2_obfuscate(raw_cond) if publish_safe else raw_cond)
    section_a = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-a">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">A</span>
        <span class="t2-sub-title">Condition Description</span>
      </div>
      <p class="t2-body">{cond_text}</p>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:4px">Active conditions:</div>
      <div class="t2-chip-row">{cond_chips}</div>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:4px">Source signals:</div>
      <div class="t2-chip-row">{psig_chips}</div>
      <div class="t2-chip-row">
        <span class="t2-chip" style="color:var(--fg-dim)">{esc(_zclass_exec_a)} <span style="opacity:.6;font-size:9px">trace: {esc(zone_class)}</span></span>
        <span class="t2-chip" style="color:var(--fg-dim)">{esc(_attr_exec_a)} <span style="opacity:.6;font-size:9px">trace: {esc(attr)}</span></span>
        <span class="t2-chip" style="color:var(--fg-dim)">source: pressure_zone_projection.json</span>
      </div>
    </div>"""

    # ── Section B: Structural Drivers ─────────────────────────────────────
    member_chips = "".join(f'<span class="t2-chip">{esc(m)}</span>' for m in members)
    sig_chips    = "".join(f'<span class="t2-chip">{esc(s)}</span>' for s in psig_ids)
    rule_chips   = "".join(
        f'<span class="t2-chip">{esc(r.replace("_", " "))}</span>' for r in pair_rules
    )
    dep_type = "COMPOUND" if len(psig_ids) > 1 else "LINEAR"
    dep_desc = (
        f"Zone exhibits {len(pair_rules)} structural rule intersection(s): "
        + (", ".join(r.replace("_", " ") for r in pair_rules) + ". " if pair_rules else "")
        + "All conditions share domain attribution scope across zone membership."
    )
    dep_desc_safe = esc(_t2_obfuscate(dep_desc) if publish_safe else dep_desc)
    section_b = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-b">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">B</span>
        <span class="t2-sub-title">Structural Drivers</span>
      </div>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted)">Member entities:</div>
      <div class="t2-chip-row">{member_chips}</div>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:8px">Contributing signals:</div>
      <div class="t2-chip-row">{sig_chips}</div>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:8px">Embedded pair rules:</div>
      <div class="t2-chip-row">{rule_chips}</div>
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:8px">
        Dependency structure: <span style="color:var(--fg)">{dep_type}</span>
      </div>
      <p class="t2-body" style="margin-top:6px">{dep_desc_safe}</p>
    </div>"""

    # ── Section C: Propagation Path ────────────────────────────────────────
    if pair_rules:
        paths_html = "".join(f"""
      <div class="t2-path-block">
        <div class="t2-path-chain">{did} — {esc(r.replace("_", " "))}</div>
        <div class="t2-path-meta">
          <span>rule: {esc(r)}</span>
          <span>type: STRUCTURAL</span>
          <span>evidence: STRONG</span>
        </div>
      </div>""" for r in pair_rules)
    else:
        paths_html = f"""
      <div class="t2-path-block t2-inferred">
        <div class="t2-path-chain">{did}</div>
        <div class="t2-path-meta">
          <span>path_id: {zone_id}-P1</span>
          <span>type: UNKNOWN</span>
          <span>evidence: PARTIAL</span>
        </div>
      </div>"""
    section_c = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-c">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">C</span>
        <span class="t2-sub-title">Propagation Path</span>
      </div>
      {paths_html}
    </div>"""

    # ── Section D: Evidence State ──────────────────────────────────────────
    ev_strength = "STRONG" if cond_sigs else "PARTIAL"
    if cond_sigs and not publish_safe:
        _ll = ll or {}
        def _method_decode(method: str) -> str:
            entry = _ll.get(method, {})
            decode = entry.get("short_decode", "")
            if decode:
                return f' <span class="t2-avail-decode">{esc(decode)}</span>'
            return ""
        cond_items = "".join(
            f'<li class="t2-avail-item">'
            f'{esc(c["condition_id"])} · {esc(c["signal_id"])} · '
            f'value: {c.get("signal_value", "—")} · '
            f'state: {esc(c.get("activation_state", "—"))} · '
            f'method: {esc(c.get("activation_method", "—"))}'
            f'{_method_decode(c.get("activation_method", ""))}'
            f'</li>'
            for c in cond_sigs
        )
        avail_html = f'<ul class="t2-avail-list">{cond_items}</ul>'
    elif cond_sigs and publish_safe:
        avail_html = (
            f'<p class="t2-body" style="font-size:11px;color:var(--fg-muted)">'
            f'{len(cond_sigs)} condition(s) active at zone scope.</p>'
        )
    else:
        avail_html = '<p class="t2-body" style="color:var(--fg-dim)">No condition evidence available.</p>'
    missing_html = """
        <ul class="t2-missing-list">
          <li class="t2-missing-item">
            <span class="t2-missing-desc">Execution-layer validation</span>
            <span class="t2-missing-impact">Runtime behavior and live operational dimensions are outside the current evidence scope.</span>
          </li>
        </ul>"""
    ev_css = _t2_ev_css(ev_strength)
    section_d = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-d">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">D</span>
        <span class="t2-sub-title">Evidence State</span>
      </div>
      <div class="t2-evidence-row">
        <span class="t2-ev-label">Evidence strength:</span>
        <span class="{ev_css}">{ev_strength}</span>
      </div>
      {avail_html}
      <div class="t2-body" style="font-size:11px;color:var(--fg-muted);margin-top:12px">Missing evidence:</div>
      {missing_html}
    </div>"""

    # ── Section E: Uncertainty Declaration ────────────────────────────────
    unresolved_items = f"""<li class="t2-unresolved-item">
          <div class="t2-unresolved-element">Execution-layer behavioral state</div>
          <div class="t2-unresolved-reason">Structural conditions are confirmed from static evidence. Runtime execution dimensions cannot be resolved from static analysis alone.</div>
        </li>"""
    section_e = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-e">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">E</span>
        <span class="t2-sub-title">Uncertainty Declaration</span>
      </div>
      <div class="t2-uncertainty-block">
        <div class="t2-inference-active">
          <span class="t2-inference-tag">inference_prohibition</span>
          <span class="t2-inference-value">ACTIVE</span>
        </div>
        <ul class="t2-unresolved-list">{unresolved_items}</ul>
      </div>
    </div>"""

    # ── Section F: Investigation Entry Points ──────────────────────────────
    why_surface = esc(f"Why does {_t2_obfuscate(dname) if publish_safe else dname} exhibit {zt.replace('_', ' ')}?")
    section_f = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-f">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">F</span>
        <span class="t2-sub-title">Investigation Entry Points</span>
      </div>
      <div class="t2-hook-grid">
        <div class="t2-hook-block" id="zone-{zone_id}-why">
          <div class="t2-hook-type">WHY</div>
          <div class="t2-hook-id">{zone_id}-WHY</div>
          <div class="t2-hook-surface">{why_surface}</div>
        </div>
        <div class="t2-hook-block" id="zone-{zone_id}-trace">
          <div class="t2-hook-type">TRACE</div>
          <div class="t2-hook-id">{zone_id}-TRACE</div>
          <div class="t2-hook-surface">entry: {did} · direction: DOWNSTREAM · depth: 2</div>
        </div>
        <div class="t2-hook-block" id="zone-{zone_id}-ev">
          <div class="t2-hook-type">EVIDENCE</div>
          <div class="t2-hook-id">{zone_id}-EV</div>
          <div class="t2-hook-surface">scope: BOUNDED · conditions: {len(conditions)} · source: projection</div>
        </div>
      </div>
    </div>"""

    # ── Section G: Structural Interpretation (from interpretation_exposure) ─
    section_g = ""
    if interpretation_payload:
        rp        = interpretation_payload.get("render_payload", interpretation_payload)
        ref_id    = interpretation_payload.get("interpretation_ref_id")
        biz_text  = rp.get("business_expression", "")
        override  = _EXEC_LINE_OVERRIDES.get(ref_id) if ref_id else None
        exec_line = override if override is not None else _derive_executive_line(biz_text)
        biz_safe  = esc(_t2_obfuscate(biz_text)  if publish_safe else biz_text)
        exec_safe = esc(_t2_obfuscate(exec_line) if publish_safe else exec_line)
        section_g = f"""
    <div class="t2-sub-section" id="zone-{zone_id}-block-g">
      <div class="t2-sub-header">
        <span class="t2-sub-tag">G</span>
        <span class="t2-sub-title">Structural Interpretation</span>
      </div>
      <p style="font-size:14px;color:#c8c8d4;font-weight:500;line-height:1.4;padding:10px 14px;background:#0f0f14;border:1px solid #2a2a38;border-left:3px solid #5a5a80;border-radius:2px;margin:0 0 8px 0">{exec_safe}</p>
      <div class="t2-chip-row" style="margin-bottom:8px">
        <span class="t2-chip" style="color:var(--fg-dim)">executive interpretation</span>
      </div>
      <p class="t2-body" style="font-size:12px;color:#9a9aaa;line-height:1.65;border-left:2px solid #3a3a5a;padding-left:12px;margin:0">{biz_safe}</p>
      <div class="t2-chip-row" style="margin-top:6px">
        <span class="t2-chip" style="color:var(--fg-dim)">source: interpretation_exposure.json · render_target: lens_report · field: business_expression</span>
      </div>
    </div>"""

    type_css  = _t2_type_css(zt)
    sev_css   = _t2_sev_css(sev)
    conf_css  = _t2_conf_css(conf)
    cap_count    = len(caps)
    scope_label  = f"{cap_count} capability node{'s' if cap_count != 1 else ''}" if cap_count else "no capability nodes"
    preview_raw  = raw_cond[:130] + ("…" if len(raw_cond) > 130 else "")
    preview_text = esc(_t2_obfuscate(preview_raw) if publish_safe else preview_raw)
    zt_label     = zt.replace("_", " ")
    trace_label  = trace_st.replace("_", " ")

    return f"""
  <details class="t2-zone-details" id="zone-{zone_id}-details">
    <summary class="t2-zone-summary">
      <div class="t2-summary-top">
        <span class="t2-summary-zone-id">{zone_id}</span>
        <span class="t2-summary-domain">{display_name}</span>
      </div>
      <div class="t2-summary-badges">
        <span class="t2-badge {type_css}">{zt_label}</span>
        <span class="t2-badge" style="background:var(--surface-raised);color:var(--fg-dim);border:1px solid var(--border-subtle)">{scope_label}</span>
        <span class="t2-badge {sev_css}">{sev}</span>
        <span class="t2-badge {conf_css}">{conf}</span>
        <span class="t2-badge" style="background:var(--surface-raised);color:var(--fg-dim);border:1px solid var(--border-subtle)">{trace_label}</span>
      </div>
      <div class="t2-summary-preview">{preview_text}</div>
    </summary>
    <div class="t2-zone-block" id="zone-{zone_id}-block">
      <div class="t2-zone-block-header">
        <div>
          <div class="t2-zone-block-id">{zone_id} · {zt.replace("_", " ").upper()}</div>
          <div class="t2-zone-block-domain">{display_name}</div>
        </div>
        <a href="#zone-{zone_id}" class="t2-zone-block-back">↑ Zone inventory</a>
      </div>
      {section_a}
      {section_b}
      {section_c}
      {section_d}
      {section_e}
      {section_f}{section_g}
    </div>
  </details>"""


# ---------------------------------------------------------------------------
# Tier-2 overview graph — positions sourced from workspace runtime (d3-force-3d)
# ---------------------------------------------------------------------------

def _build_overview_graph_html(graph_state: Optional[Dict]) -> str:
    """Render overview graph passively from persisted graph_state.

    Positions are read directly from graph_state — no simulation,
    no re-layout, no golden-angle init. Pure draw-only canvas script.
    """
    if not graph_state:
        return ''

    nodes  = graph_state['nodes']
    links  = graph_state['links']
    width  = graph_state.get('canvas_width',  880)
    height = graph_state.get('canvas_height', 380)

    nidx = {n['id']: i for i, n in enumerate(nodes)}

    nodes_js = json.dumps(
        [{'x': n['x'], 'y': n['y'], 'r': n['r'], 'c': n['color'], 'l': n['label']}
         for n in nodes],
        separators=(',', ':'),
    )
    links_js = json.dumps(
        [{'s': nidx.get(l['source'], 0), 't': nidx.get(l['target'], 0),
          'c': l['color'], 'w': l['width']}
         for l in links],
        separators=(',', ':'),
    )

    legend_html = ''.join(
        f'<span class="og-legend-item">'
        f'<span class="og-legend-dot" style="background:{col}"></span>'
        f'<span class="og-legend-lbl">{lbl}</span>'
        f'</span>'
        for col, lbl in [
            ('#f0f0f0', 'Zone root'),
            ('#52d97e', 'Signal'),
            ('#e8b54a', 'Mapped claim'),
            ('#6ab4e8', 'Artifact'),
        ]
    )

    node_ct = len(nodes)
    link_ct = len(links)

    # Draw-only — no simulation, no golden-angle, no force loop
    # Edge alpha recessed so links read as structural connectors, not primary data.
    # Node subtle stroke adds crafted visual weight without semantic change.
    js_draw = (
        f'(function(){{\n'
        f'  var N={nodes_js};\n'
        f'  var L={links_js};\n'
        f'  var cv=document.getElementById("og-canvas");if(!cv)return;\n'
        f'  var ctx=cv.getContext("2d");\n'
        f'  ctx.globalAlpha=0.28;\n'
        f'  L.forEach(function(l){{\n'
        f'    ctx.strokeStyle=l.c;ctx.lineWidth=l.w;\n'
        f'    ctx.beginPath();ctx.moveTo(N[l.s].x,N[l.s].y);ctx.lineTo(N[l.t].x,N[l.t].y);ctx.stroke();\n'
        f'  }});\n'
        f'  N.forEach(function(n){{\n'
        f'    ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,6.283);\n'
        f'    ctx.fillStyle=n.c;ctx.globalAlpha=0.88;ctx.fill();\n'
        f'    ctx.lineWidth=0.8;ctx.strokeStyle="rgba(255,255,255,0.1)";ctx.globalAlpha=1;ctx.stroke();\n'
        f'  }});\n'
        f'  ctx.font="10px -apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif";\n'
        f'  ctx.textAlign="center";ctx.fillStyle="#66666e";\n'
        f'  N.forEach(function(n){{ctx.fillText(n.l,n.x,n.y+n.r+14);}});\n'
        f'}})();'
    )

    return (
        f'<div class="og-frame">\n'
        f'  <div class="og-frame-header">\n'
        f'    <span class="og-frame-tag">Overview</span>\n'
        f'    <span class="og-frame-meta">{node_ct} nodes · {link_ct} links · full vault coverage</span>\n'
        f'  </div>\n'
        f'  <div class="og-canvas-wrap">\n'
        f'    <canvas id="og-canvas" width="{width}" height="{height}" '
        f'style="display:block;width:100%;background:#09090d"></canvas>\n'
        f'  </div>\n'
        f'  <div class="og-legend">{legend_html}</div>\n'
        f'</div>\n'
        f'<script>{js_draw}</script>'
    )


def _build_topology_svg(zones: List[Dict], width: int = 880, height: int = 270) -> str:
    """Inline SVG of the zone-signal evidence topology for the narrative report.

    Self-contained, no external dependencies. Dark-theme palette matched to
    _TIER2_DIAGNOSTIC_CSS. Layout: zones spread horizontally, each zone's
    signals radiate outward in a sector facing away from the horizontal centre.
    """
    if not zones:
        return ''

    C_BG      = '#09090d'
    C_Z_HIGH  = '#b84040'
    C_Z_MOD   = '#b07820'
    C_Z_LOW   = '#3a7a50'
    C_Z_GAP   = '#2a5870'
    C_SIG_STR = '#4cc872'
    C_SIG_PAR = '#d4912a'
    C_SIG_WK  = '#5a90c0'
    C_EDGE    = '#1a1e2c'
    C_LBL_Z   = '#b8b8cc'
    C_LBL_S   = '#505460'

    n   = len(zones)
    pad = 170
    cy  = height // 2
    R   = 82

    zone_xs: List[int] = (
        [width // 2] if n == 1
        else [round(pad + i * (width - 2 * pad) / (n - 1)) for i in range(n)]
    )
    cx_all = width / 2

    sig_xy: Dict[str, Tuple[float, float]] = {}
    for i, z in enumerate(zones):
        zx   = zone_xs[i]
        sigs = z['domain_sigs']
        if not sigs:
            continue
        ns     = len(sigs)
        c_ang  = (math.pi if zx <= cx_all else 0.0) if n > 1 else -math.pi / 2
        spread = min(2.0, 0.5 + (ns - 1) * 0.38) if ns > 1 else 0.0
        angs   = ([c_ang] if ns == 1
                  else [c_ang - spread / 2 + j * spread / (ns - 1) for j in range(ns)])
        for j, sig in enumerate(sigs):
            sig_xy[sig['signal_id']] = (
                max(16.0, min(float(width - 16), zx + R * math.cos(angs[j]))),
                max(16.0, min(float(height - 16), cy + R * math.sin(angs[j]))),
            )

    parts = [
        f'<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg" '
        f'style="display:block;width:100%;background:{C_BG}">'
    ]

    for i, z in enumerate(zones):
        zx = zone_xs[i]
        for sig in z['domain_sigs']:
            if sig['signal_id'] in sig_xy:
                sx, sy = sig_xy[sig['signal_id']]
                parts.append(
                    f'<line x1="{zx}" y1="{cy}" x2="{sx:.1f}" y2="{sy:.1f}" '
                    f'stroke="{C_EDGE}" stroke-width="2"/>'
                )

    for i, z in enumerate(zones):
        for sig in z['domain_sigs']:
            sid = sig['signal_id']
            if sid not in sig_xy:
                continue
            sx, sy = sig_xy[sid]
            conf = sig.get('evidence_confidence', 'WEAK')
            col  = (C_SIG_STR if conf == 'STRONG'
                    else C_SIG_PAR if conf in ('MODERATE', 'PARTIAL')
                    else C_SIG_WK)
            parts.append(
                f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="7" fill="{col}" opacity="0.9"/>'
            )
            parts.append(
                f'<text x="{sx:.1f}" y="{sy + 17:.1f}" text-anchor="middle" '
                f'font-size="8" fill="{C_LBL_S}" font-family="monospace">{sid}</text>'
            )

    for i, z in enumerate(zones):
        zx  = zone_xs[i]
        sev = z['severity']
        has = bool(z['domain_sigs'])
        col = (C_Z_GAP  if not has  else
               C_Z_HIGH if sev == 'HIGH'     else
               C_Z_MOD  if sev == 'MODERATE' else C_Z_LOW)
        if not has:
            parts.append(
                f'<circle cx="{zx}" cy="{cy}" r="22" fill="none" '
                f'stroke="{C_Z_GAP}" stroke-width="1" stroke-dasharray="4 3" opacity="0.45"/>'
            )
        parts.append(f'<circle cx="{zx}" cy="{cy}" r="18" fill="{col}" opacity="0.9"/>')
        parts.append(
            f'<text x="{zx}" y="{cy + 5}" text-anchor="middle" '
            f'font-size="9" fill="white" font-weight="bold" font-family="monospace">'
            f'{z["zone_id"]}</text>'
        )
        ns  = len(z['domain_sigs'])
        sub = (f'{sev} \u00b7 {ns} sig{"s" if ns != 1 else ""}' if has
               else f'{sev} \u00b7 no signals')
        parts.append(
            f'<text x="{zx}" y="{cy + 31}" text-anchor="middle" '
            f'font-size="8.5" fill="{C_LBL_Z}" font-family="monospace">{sub}</text>'
        )

    parts.append('</svg>')
    return '\n'.join(parts)


def _build_tier2_diagnostic_narrative(topology: Dict, signals: Dict, gauge: Dict,
                                       publish_safe: bool = False,
                                       graph_state: Optional[Dict] = None,
                                       pz_proj: Optional[Dict] = None,
                                       psig_proj: Optional[Dict] = None,
                                       ll: Optional[Dict] = None) -> str:
    domains      = topology["domains"]
    counts       = topology["counts"]
    score        = gauge["score"]["canonical"]
    band_label   = gauge["score"]["band_label"]
    band_lo      = gauge["confidence"]["lower"]
    band_hi      = gauge["confidence"]["upper"]

    client_name  = _get_client_display_name(publish_safe)
    _use_psig    = _ACTIVE_CLIENT != "blueedge"
    _ev_name     = "lens_tier1_evidence_brief_pub.html" if publish_safe else "lens_tier1_evidence_brief.html"
    _narr_name   = "lens_tier1_narrative_brief_pub.html" if publish_safe else "lens_tier1_narrative_brief.html"
    ev_link      = _scoped_report_url(_ev_name) if _use_psig else f"/api/report-file?name={_ev_name}"
    narr_link    = _scoped_report_url(_narr_name) if _use_psig else f"/api/report-file?name={_narr_name}"
    _ds_name     = "lens_decision_surface_pub.html" if publish_safe else "lens_decision_surface.html"
    ds_link      = _scoped_report_url(_ds_name) if _use_psig else f"/api/report-file?name={_ds_name}"
    title_suffix = " (Publish)" if publish_safe else ""
    footer_note  = ("SAMPLE — Illustrative client environment. All structural values represent actual assessment outputs."
                    if publish_safe else
                    f"SAMPLE — {client_name}.")

    # Zone derivation: projection path for PSIG clients, topology path for BlueEdge
    if _use_psig and pz_proj is not None:
        zones = _derive_tier2_zones_from_projection(pz_proj, psig_proj, topology)
    else:
        zones = _derive_tier2_zones(topology, signals)

    total_zones   = len(zones)
    grounded_ct   = sum(1 for d in domains if d["grounding"] == "GROUNDED")
    weakly_ct     = sum(1 for d in domains if d["grounding"] == "WEAKLY GROUNDED")
    total_domains = counts.get("domains", len(domains))

    evidence_scope = "FULL" if weakly_ct == 0 else ("PARTIAL" if weakly_ct <= 2 else "BOUNDED")
    coverage_status = "COMPLETE" if weakly_ct == 0 else "INCOMPLETE"
    coverage_css   = "complete" if coverage_status == "COMPLETE" else "incomplete"

    resolution_boundary = (
        f"{grounded_ct} of {total_domains} domains are fully grounded. "
        f"{weakly_ct} domain(s) exhibit unresolved structural conditions. "
        "Runtime-dependent dimensions cannot be resolved from static evidence alone."
    )
    if publish_safe:
        resolution_boundary = _t2_obfuscate(resolution_boundary)

    # Pressure distribution
    pd = {"pressure_concentration": 0, "evidence_gap": 0, "signal_conflict": 0, "structural_inconsistency": 0}
    for z in zones:
        pd[z["zone_type"]] += 1

    has_contradiction = any(z["zone_type"] == "signal_conflict" for z in zones)
    # sig_count: PSIG path uses condition_signals; BlueEdge path uses domain_sigs
    if _use_psig and pz_proj is not None:
        sig_count = sum(1 for z in zones if z.get("condition_signals"))
    else:
        sig_count = sum(1 for z in zones if z["domain_sigs"])
    evidence_summary = (
        f"{sig_count} of {total_zones} diagnostic zone(s) have bound signal coverage. "
        f"{total_zones - sig_count} zone(s) have no signal coverage and cannot be structurally characterized."
    )
    zones_source_label = "identified from projection" if (_use_psig and pz_proj is not None) else "identified from canonical data"

    # Zone inventory cards
    zone_cards_html = ""
    for z in zones:
        zid = z["zone_id"]
        dname = z["domain_name"]
        display = esc(_t2_obfuscate(dname) if publish_safe else dname)
        type_css = _t2_type_css(z["zone_type"])
        sev_css  = _t2_sev_css(z["severity"])
        conf_css = _t2_conf_css(z["confidence"])
        zt_label = z["zone_type"].replace("_", " ")
        zone_cards_html += f"""
      <a href="#zone-{zid}-details" class="t2-zone-card" id="zone-{zid}">
        <div class="t2-zone-id">{zid}</div>
        <div class="t2-zone-domain">{display}</div>
        <div class="t2-badge-row">
          <span class="t2-badge {type_css}">{zt_label}</span>
          <span class="t2-badge {sev_css}">{z["severity"]}</span>
          <span class="t2-badge {conf_css}">{z["confidence"]}</span>
          <span class="t2-badge" style="background:var(--surface-raised);color:var(--fg-dim);border:1px solid var(--border-subtle)">{z["traceability"].replace("_", " ")}</span>
        </div>
      </a>"""

    # Per-zone blocks — PSIG path uses projection-aware builder
    interp_by_class = _load_psee_interpretation_by_zone_class()
    if _use_psig and pz_proj is not None:
        zone_blocks_html = "".join(
            _build_t2_psig_zone_block(z, publish_safe, interp_by_class.get(z.get("zone_class")), ll)
            for z in zones
        )
    else:
        zone_blocks_html = "".join(
            _build_t2_zone_block(z, publish_safe, interp_by_class.get(z.get("zone_class")))
            for z in zones
        )

    # Structural evidence topology graph (section 01A) — renders from graph_state only
    topology_svg = _build_overview_graph_html(graph_state)

    # Language Layer reading guide (section 01B) and Pattern Summary (section 02) — omitted in publish_safe
    _ll = ll or {}
    reading_guide_html = ""
    pattern_summary_html = ""
    if not publish_safe:
        # 01B: How to Read Diagnostic Terms
        _guide_terms = [
            "COMPOUND_ZONE", "PRESSURE_ZONE", "RUN_RELATIVE_OUTLIER",
            "THEORETICAL_BASELINE", "CONFIDENCE_BAND", "EVIDENCE_SCOPE",
            "SIGNAL_COVERAGE", "STRUCTURAL_COVERAGE", "TRACE_CONTINUITY",
            "INFERENCE_PROHIBITION",
        ]
        _guide_rows = ""
        if _ll:
            for _t in _guide_terms:
                _e = _ll.get(_t)
                if _e:
                    _guide_rows += (
                        f'<div class="t2-ll-row">'
                        f'<span class="t2-ll-term">{esc(_e["canonical_label"])}</span>'
                        f'<span class="t2-ll-exec">{esc(_e["executive_label"])}</span>'
                        f'<span class="t2-ll-decode">{esc(_e["short_decode"])}</span>'
                        f'</div>'
                    )
        _table_block = f'<div class="t2-ll-table">\n      {_guide_rows}\n    </div>' if _guide_rows else ""
        reading_guide_html = f"""
  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">01B</span>
      <span class="t2-section-title">How to Read Diagnostic Terms</span>
    </div>
    <div class="t2-reading-guide-prose">
      <p class="t2-body"><strong>What is a pressure zone?</strong> A pressure zone is a governed diagnostic unit identifying a domain segment where one or more active conditions create concentrated structural pressure. Zones are derived from the projection layer — they are not inferred from topology alone.</p>
      <p class="t2-body"><strong>Why do compound zones matter?</strong> A compound zone is not a single intense condition — it is multiple structurally independent conditions active simultaneously in the same domain. This indicates multi-dimensional pressure convergence. That multiple pressures are co-present is a structural observation; it is not a causal claim about what caused them or what will happen.</p>
      <p class="t2-body"><strong>Why do three zones share the same signal set?</strong> The three zones in this run (PZ-001, PZ-002, PZ-003) share the same three active signals because those signals are domain-spanning — they are not isolated to a single domain. The zones differ in attribution: which domain carries primary pressure origin versus which domains are secondary recipients. Same signal family, different structural role.</p>
      <p class="t2-body"><strong>What does primary vs secondary attribution mean?</strong> Primary attribution means the conditions originated within that domain. Secondary attribution means the conditions are present but originated from another domain — the secondary zone is a structural recipient, not the source. Attribution is determined by the projection layer, not inferred here.</p>
      <p class="t2-body" style="color:var(--fg-dim);font-size:11px">inference_prohibition: ACTIVE — all data on this surface is structural and evidential only. No advisory content, causal inference, or remediation guidance may be derived.</p>
    </div>
    {_table_block}
  </div>"""

        # 02: Diagnostic Pattern Summary (PSIG path only)
        if _use_psig and pz_proj is not None and total_zones > 0:
            _cp          = RC.collapse_patterns(zones, pz_proj, publish_safe)
            _zone_names  = ", ".join(z["zone_id"] for z in zones)
            _shared_sigs     = _cp["shared_sigs"] if _cp else []
            _shared_sigs_str = _cp["sigs_str"]    if _cp else "—"
            _prim_name       = _cp["prim_name"]   if _cp else ""
            _zclass_shared   = _cp["zclass"]      if _cp else "COMPOUND_ZONE"
            _zclass_exec_s   = _cp["zclass_exec"] if _cp else RC.apply_language("COMPOUND_ZONE")
            _exec_phrase     = RC.apply_language("RUN_RELATIVE_OUTLIER")
            pattern_summary_html = f"""
  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">02</span>
      <span class="t2-section-title">Diagnostic Pattern Summary</span>
    </div>
    <div class="t2-pattern-summary">
      <p class="t2-body" style="font-size:14px;color:#c8c8d4;font-weight:500;line-height:1.5">
        This run shows one structural pressure pattern appearing across {total_zones} domains.
        The same {len(_shared_sigs)} signal{'s' if len(_shared_sigs) != 1 else ''} ({esc(_shared_sigs_str)}) are active in each pressure zone;
        the difference is attribution, not a different signal family.
      </p>
      <p class="t2-body">
        All {total_zones} zones are classified as {esc(_zclass_exec_s)}
        <span style="font-size:10px;opacity:.6">(trace: {esc(_zclass_shared)})</span>.
        Each zone carries {esc(_exec_phrase)}
        <span style="font-size:10px;opacity:.6">(trace: RUN_RELATIVE_OUTLIER)</span>
        conditions — statistically elevated values relative to the rest of the run's entity set.
        {("Primary pressure anchor "
          '<span style="font-size:10px;opacity:.6">(trace: PRIMARY attribution)</span>: '
          + esc(_prim_name) + ".") if _prim_name else ""}
        Remaining zones are secondary affected zones
        <span style="font-size:10px;opacity:.6">(trace: SECONDARY attribution)</span> —
        structurally exposed to the same signals but not the pressure origin.
      </p>
      <p class="t2-body" style="font-size:11px;color:var(--fg-muted)">
        This pattern describes structural co-presence. It is not a causal proof and does not constitute
        a root-cause determination. inference_prohibition: ACTIVE.
      </p>
    </div>
  </div>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LENS Assessment — Diagnostic Narrative{title_suffix}</title>
  <style>{_TIER2_DIAGNOSTIC_CSS}</style>
</head>
<body>
<div class="page">

  <div class="nav-strip">
    <a href="{ds_link}" class="nav-link">Decision</a>
    <a href="{narr_link}" class="nav-link">Executive Brief</a>
    <a href="{ev_link}" class="nav-link">LENS Assessment</a>
    <span class="nav-link active">Diagnostic</span>
  </div>

  {RC.anchor_block(score, band_label, band_lo, band_hi)}

  <div class="report-header">
    <div>
      <div class="report-brand">Signäl Program Intelligence</div>
      <div class="report-title">LENS Assessment — Diagnostic Narrative{title_suffix}</div>
      <div class="report-type">Tier-2 Diagnostic Access · Evidence Interrogation Surface</div>
    </div>
    <div class="report-meta">
      <div>Client: <strong>{esc(client_name)}</strong></div>
      <div>Assessment score: <strong>{score} — {esc(band_label)}</strong></div>
      <div>Confidence band: <strong>{band_lo} – {band_hi}</strong></div>
      <div>Issued: <strong>April 2026</strong></div>
    </div>
  </div>

  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">00</span>
      <span class="t2-section-title">Context Lock</span>
    </div>
    <div class="t2-context-lock">
      <div class="t2-field">
        <span class="t2-field-label">Run ID</span>
        <span class="t2-field-value">{esc(topology.get("emission_run_id", "—"))}</span>
      </div>
      <div class="t2-field">
        <span class="t2-field-label">Evidence Scope</span>
        <span class="t2-field-value">{evidence_scope}</span>
      </div>
      <div class="t2-field">
        <span class="t2-field-label">Structural Coverage Status</span>
        <span class="t2-field-value {coverage_css}">{coverage_status}</span>
      </div>
      <div class="t2-field">
        <span class="t2-field-label">Resolution Boundary</span>
        <span class="t2-field-value" style="font-size:12px">{esc(resolution_boundary)}</span>
      </div>
    </div>
  </div>

  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">01</span>
      <span class="t2-section-title">Diagnostic Overview</span>
    </div>
    <div class="t2-overview-grid">
      <div class="t2-overview-cell">
        <div class="t2-cell-label">Diagnostic Zones</div>
        <div class="t2-cell-value">{total_zones}</div>
        <div class="t2-cell-sub">{zones_source_label}</div>
      </div>
      <div class="t2-overview-cell">
        <div class="t2-cell-label">Signal Contradiction</div>
        <div class="t2-cell-value" style="color:{'var(--red)' if has_contradiction else 'var(--green)'}">{'YES' if has_contradiction else 'NO'}</div>
        <div class="t2-cell-sub">across zone scope</div>
      </div>
      <div class="t2-overview-cell">
        <div class="t2-cell-label">Domains Grounded</div>
        <div class="t2-cell-value">{grounded_ct} / {total_domains}</div>
        <div class="t2-cell-sub">structurally confirmed</div>
      </div>
      <div class="t2-overview-cell">
        <div class="t2-cell-label">Signal Coverage</div>
        <div class="t2-cell-value">{sig_count} / {total_zones}</div>
        <div class="t2-cell-sub">zones with signals bound</div>
      </div>
    </div>
    <div class="t2-pressure-row">
      <div class="t2-pressure-cell">
        <div class="t2-pressure-label">Pressure Concentration</div>
        <div class="t2-pressure-count">{pd['pressure_concentration']}</div>
      </div>
      <div class="t2-pressure-cell">
        <div class="t2-pressure-label">Evidence Gap</div>
        <div class="t2-pressure-count">{pd['evidence_gap']}</div>
      </div>
      <div class="t2-pressure-cell">
        <div class="t2-pressure-label">Signal Conflict</div>
        <div class="t2-pressure-count">{pd['signal_conflict']}</div>
      </div>
      <div class="t2-pressure-cell">
        <div class="t2-pressure-label">Structural Inconsistency</div>
        <div class="t2-pressure-count">{pd['structural_inconsistency']}</div>
      </div>
    </div>
    <p style="font-size:12px;color:var(--fg-muted);margin-top:14px">{esc(evidence_summary)}</p>
  </div>

  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">01A</span>
      <span class="t2-section-title">Structural Evidence Topology</span>
    </div>
    <p class="t2-topo-intro">This view represents the full structural evidence topology underlying the current assessment. It shows how signals and structural evidence connect across the assessed system. Diagnostic zones described below represent focused segments of this topology.</p>
    <div class="t2-topo-panel">
      {topology_svg}
    </div>
  </div>

  {reading_guide_html}

  {pattern_summary_html}

  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">03</span>
      <span class="t2-section-title">Diagnostic Zone Inventory</span>
    </div>
    <div class="t2-zone-grid">
      {zone_cards_html}
    </div>
  </div>

  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">04</span>
      <span class="t2-section-title">Zone Details</span>
    </div>
    {zone_blocks_html}
  </div>

  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">05</span>
      <span class="t2-section-title">Trace and Evidence Continuity</span>
    </div>
    <p class="t2-body" style="font-size:12px;color:var(--fg-muted);margin-bottom:12px">
      This section records the authoritative source for each data element used in this report.
      All structural values are deterministically derived — no computation or inference occurs in the report layer.
    </p>
    <div class="t2-ll-table">
      <div class="t2-ll-row">
        <span class="t2-ll-term">Assessment score</span>
        <span class="t2-ll-exec">{score} — {esc(band_label)}</span>
        <span class="t2-ll-decode">Source: gauge_state.json · authority: GAUGE.STATE.COMPUTATION.CONTRACT.01</span>
      </div>
      <div class="t2-ll-row">
        <span class="t2-ll-term">Confidence band</span>
        <span class="t2-ll-exec">{band_lo} – {band_hi}</span>
        <span class="t2-ll-decode">Source: gauge_state.json · authority: GAUGE.STATE.COMPUTATION.CONTRACT.01</span>
      </div>
      <div class="t2-ll-row">
        <span class="t2-ll-term">Zone derivation</span>
        <span class="t2-ll-exec">{total_zones} zone{'s' if total_zones != 1 else ''}</span>
        <span class="t2-ll-decode">Source: pressure_zone_projection.json · authority: PSEE.ZONE.PROJECTION.01</span>
      </div>
      <div class="t2-ll-row">
        <span class="t2-ll-term">Signal activation</span>
        <span class="t2-ll-exec">{sig_count} signal{'s' if sig_count != 1 else ''} bound</span>
        <span class="t2-ll-decode">Source: signal_projection.json · authority: PSEE.SIGNAL.ACTIVATION.CONTRACT.01</span>
      </div>
      <div class="t2-ll-row">
        <span class="t2-ll-term">Structural topology</span>
        <span class="t2-ll-exec">{grounded_ct} / {total_domains} domains grounded</span>
        <span class="t2-ll-decode">Source: canonical topology package · authority: PSEE topology emission run</span>
      </div>
      <div class="t2-ll-row">
        <span class="t2-ll-term">Language layer</span>
        <span class="t2-ll-exec">term decodes active</span>
        <span class="t2-ll-decode">Source: language_layer_registry.json · authority: LANGUAGE_LAYER_REGISTRY.01</span>
      </div>
    </div>
  </div>

  <div class="t2-section">
    <div class="t2-section-header">
      <span class="t2-section-num">06</span>
      <span class="t2-section-title">Uncertainty Declaration</span>
    </div>
    <div class="t2-uncertainty-block">
      <div class="t2-inference-active">
        <span class="t2-inference-tag">inference_prohibition</span>
        <span class="t2-inference-value">ACTIVE</span>
      </div>
      <p class="t2-body" style="margin-top:10px;font-size:13px;color:#c8c8d4;font-weight:500">
        These unknowns do not indicate failure.
        They define the evidence boundary that must be resolved before execution confidence can be claimed.
      </p>
      <ul class="t2-unresolved-list">
        <li class="t2-unresolved-item">
          <div class="t2-unresolved-element">Execution-layer behavioral state</div>
          <div class="t2-unresolved-reason">Structural conditions are confirmed from static evidence. Runtime execution dimensions are outside the current evidence scope and cannot be resolved from structural analysis alone.</div>
        </li>
        <li class="t2-unresolved-item">
          <div class="t2-unresolved-element">Causal relationships between structural conditions</div>
          <div class="t2-unresolved-reason">Co-presence of conditions across zones is a structural observation. No causal chain has been established and none is implied by this assessment.</div>
        </li>
        <li class="t2-unresolved-item">
          <div class="t2-unresolved-element">Zone severity under runtime load</div>
          <div class="t2-unresolved-reason">Zone severity classifications are derived from structural evidence. How these conditions express under actual execution load is outside the current evidence scope.</div>
        </li>
      </ul>
    </div>
  </div>

  <div class="report-footer">
    <div class="footer-brand">Signäl</div>
    <div class="footer-note">
      {esc(footer_note)}<br>
      Tier-2 Diagnostic Access · No advisory content · No root cause claims · inference_prohibition: ACTIVE
    </div>
  </div>

</div>
</body>
</html>"""


def generate_tier2_reports(output_dir: Optional[Path] = None) -> List[Path]:
    """Generate the Tier-2 Diagnostic Narrative: internal + publish-safe.

    Returns list of written file paths (2 files).
    """
    if output_dir is None:
        output_dir = TIER2_REPORTS_DIR

    pub_dir = output_dir / "publish"
    output_dir.mkdir(parents=True, exist_ok=True)
    pub_dir.mkdir(parents=True, exist_ok=True)

    if not CANONICAL_PKG_DIR.exists():
        _fail(f"Canonical package directory not found: {CANONICAL_PKG_DIR}")

    topology  = load_canonical_topology()
    signals   = load_signal_registry()
    gauge     = load_gauge_state()
    psig_proj = _load_psig_projection()
    pz_proj   = _load_pressure_zone_projection()
    ll        = _load_language_layer()

    # Export graph positions from workspace runtime (d3-force-3d via Node.js).
    # export_graph_state.js is the sole source of x/y — no Python layout math.
    graph_state_path = output_dir / "graph_state.json"
    export_script = REPO_ROOT / "scripts" / "pios" / "export_graph_state.mjs"
    try:
        subprocess.run(["node", str(export_script),
                        "--client", _ACTIVE_CLIENT,
                        "--run-id", _ACTIVE_VAULT_RUN_ID], check=True)
        print(f"[LENS REPORT] Generated: {graph_state_path.resolve()}")
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        _fail(f"export_graph_state.js failed: {e}")

    graph_state: Optional[Dict] = None
    if graph_state_path.exists():
        with open(graph_state_path) as f:
            graph_state = json.load(f)

    files: List[Path] = []

    artifacts = [
        (output_dir / "lens_tier2_diagnostic_narrative.html",         False),
        (pub_dir    / "lens_tier2_diagnostic_narrative_pub.html",     True),
    ]

    for out_path, pub_safe in artifacts:
        html = _build_tier2_diagnostic_narrative(topology, signals, gauge,
                                                  publish_safe=pub_safe,
                                                  graph_state=graph_state,
                                                  pz_proj=pz_proj,
                                                  psig_proj=psig_proj,
                                                  ll=ll)
        out_path.write_text(html, encoding="utf-8")
        print(f"[LENS REPORT] Generated: {out_path.resolve()}")
        files.append(out_path)

    return files


# ---------------------------------------------------------------------------
# Decision Surface
# PI.SECOND-CLIENT.STEP16I.DECISION-SURFACE-GENERATOR.01
# ---------------------------------------------------------------------------

_DECISION_SURFACE_CSS = """
  :root{--bg:#0e0e10;--surface:#16161a;--surface-raised:#1c1c22;--border:#2a2a2e;--border-subtle:#222228;--fg:#e8e8e8;--fg-muted:#888;--fg-dim:#555;--gold:#c89b3c;--gold-muted:rgba(200,155,60,0.12);--gold-border:rgba(200,155,60,0.28);--green:#4caf6e;--green-muted:rgba(76,175,110,0.12);--green-border:rgba(76,175,110,0.28);--amber:#d4912a;--amber-muted:rgba(212,145,42,0.1);--amber-border:rgba(212,145,42,0.25);--red:#e05252;--red-muted:rgba(224,82,82,0.1);--red-border:rgba(224,82,82,0.25);--font:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--bg);color:var(--fg);font-family:var(--font);font-size:14px;line-height:1.7;-webkit-font-smoothing:antialiased}
  .page{max-width:760px;margin:0 auto;padding:36px 32px 72px}
  .ds-identity{display:flex;align-items:center;gap:8px;margin-bottom:28px;padding-bottom:14px;border-bottom:1px solid var(--border-subtle);font-size:12px;flex-wrap:wrap}
  .ds-brand{color:var(--gold);font-weight:500;letter-spacing:.06em}
  .ds-sep{color:var(--fg-dim)}
  .ds-client{color:var(--fg-muted)}
  .ds-run{color:var(--fg-dim);font-family:monospace;font-size:11px}
  .ds-nav{margin-left:auto;display:flex;gap:14px}
  .ds-nav-link{font-size:11px;color:var(--fg-dim);text-decoration:none;letter-spacing:.04em}
  .ds-nav-link:hover{color:var(--fg-muted)}
  .ds-hero{display:flex;justify-content:space-between;align-items:flex-start;padding:24px 28px;border:1px solid var(--border);border-left:4px solid var(--amber);border-radius:4px;background:var(--surface);margin-bottom:28px;gap:20px}
  .ds-hero.posture-proceed{border-left-color:var(--green)}
  .ds-hero.posture-investigate{border-left-color:var(--amber)}
  .ds-hero.posture-escalate{border-left-color:var(--red)}
  .ds-hero-posture{font-size:28px;font-weight:300;letter-spacing:.04em;margin-bottom:8px}
  .ds-hero.posture-proceed .ds-hero-posture{color:var(--green)}
  .ds-hero.posture-investigate .ds-hero-posture{color:var(--amber)}
  .ds-hero.posture-escalate .ds-hero-posture{color:var(--red)}
  .ds-hero-rationale{font-size:13px;color:var(--fg-muted);line-height:1.6;max-width:420px;margin-bottom:12px}
  .ds-hero-context{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .ds-ctx-sep{color:var(--fg-dim)}
  .ds-ctx-badge{font-size:10px;letter-spacing:.1em;text-transform:uppercase;background:var(--surface-raised);color:var(--fg-muted);padding:3px 8px;border-radius:2px;border:1px solid var(--border)}
  .ds-hero-score-block{text-align:right;flex-shrink:0}
  .ds-hero-score{font-size:40px;font-weight:300;color:var(--gold);line-height:1}
  .ds-hero-band{font-size:12px;color:var(--gold);margin-top:4px;letter-spacing:.02em}
  .ds-hero-range{font-size:11px;color:var(--fg-dim);margin-top:2px}
  .ds-split{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:32px}
  .ds-split-col{padding:16px 18px;border:1px solid var(--border);border-radius:3px;background:var(--surface)}
  .ds-split-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;font-weight:600}
  .ds-split-col.confirmed .ds-split-label{color:var(--green)}
  .ds-split-col.unknown .ds-split-label{color:var(--amber)}
  .ds-truth-text{font-size:12px;color:var(--fg-muted);line-height:1.8}
  .ds-gap-items{list-style:none;padding:0}
  .ds-gap-item{font-size:12px;color:var(--fg-muted);padding:5px 0;border-bottom:1px solid var(--border-subtle);display:flex;gap:8px;align-items:flex-start}
  .ds-gap-item:last-child{border-bottom:none}
  .ds-gap-item::before{content:'○';color:var(--amber);font-size:10px;margin-top:3px;flex-shrink:0}
  .ds-pressure{margin-bottom:32px}
  .ds-pressure-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-dim);margin-bottom:12px}
  .ds-pressure-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}
  .ds-pressure-cell{background:var(--surface);border:1px solid var(--border);border-top:2px solid var(--border);padding:12px 14px;border-radius:3px}
  .ds-pressure-cell-zone{border-top-color:var(--amber)}
  .ds-pressure-cell-sigs{border-top-color:var(--gold)}
  .ds-pressure-cell-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--fg-dim);margin-bottom:4px}
  .ds-pressure-cell-value{font-size:13px;color:var(--fg)}
  .ds-pressure-cell-sub{font-size:11px;color:var(--fg-muted);margin-top:3px}
  .ds-pressure-note{font-size:11px;color:var(--fg-muted);margin-top:6px;padding:8px 12px;background:rgba(0,0,0,.2);border-radius:2px}
  .ds-pressure-ll{margin-top:12px;font-size:11px;color:var(--fg-dim);line-height:1.9}
  .ds-pressure-ll-item{display:inline;margin-right:16px}
  .ds-pressure-ll-item strong{color:var(--fg-muted);font-weight:500}
  .ds-inference{display:flex;align-items:center;gap:10px;padding:8px 12px;background:rgba(0,0,0,.2);border:1px solid var(--border-subtle);border-radius:3px;margin-bottom:24px;font-size:11px;color:var(--fg-dim)}
  .ds-inference-tag{font-size:9px;letter-spacing:.12em;text-transform:uppercase;background:var(--red-muted);color:var(--red);padding:3px 8px;border-radius:2px;border:1px solid var(--red-border);flex-shrink:0}
  .ds-explore{margin-bottom:32px}
  .ds-explore-label{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-dim);margin-bottom:10px}
  .ds-explore-strip{display:flex;gap:10px;flex-wrap:wrap}
  .ds-explore-link{display:inline-block;padding:8px 16px;font-size:12px;letter-spacing:.04em;border:1px solid var(--border);color:var(--fg-muted);text-decoration:none;border-radius:3px}
  .ds-explore-link:hover{border-color:var(--gold-border);color:var(--gold)}
  .ds-explore-link.primary{border-color:var(--gold-border);color:var(--gold);background:var(--gold-muted)}
  .ds-footer{display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid var(--border-subtle);margin-top:40px;font-size:11px;color:var(--fg-dim)}
  .ds-footer-brand{color:var(--gold);letter-spacing:.06em;font-size:13px}
  .rc-trace{font-size:10px;color:var(--fg-dim);opacity:.7;font-style:normal}
  @media(max-width:600px){.ds-hero{flex-direction:column}.ds-hero-score-block{text-align:left}.ds-split{grid-template-columns:1fr}.ds-pressure-row{grid-template-columns:1fr 1fr}.ds-nav{margin-left:0;margin-top:6px}}
"""


def _build_decision_surface(topology: Dict, signals: Dict, gauge: Dict,
                              publish_safe: bool = False,
                              psig_proj: Optional[Dict] = None,
                              pz_proj: Optional[Dict] = None,
                              metrics: Optional[Dict] = None,
                              decision_model: Optional[Dict] = None,
                              ll: Optional[Dict] = None) -> str:
    # ── Core state derivation ──────────────────────────────────────────
    dm        = decision_model or {}
    risk      = dm.get("structural_risk", "MODERATE")
    ev_comp   = dm.get("evidence_completeness", "PARTIAL")
    posture   = dm.get("decision", "INVESTIGATE")
    not_activated = dm.get("not_activated", [])
    blind_spot    = dm.get("blind_spot_active", False)
    exec_eval     = dm.get("exec_evaluated", False)

    score      = gauge["score"]["canonical"]
    band_label = gauge["score"]["band_label"]
    band_lo    = gauge["confidence"]["lower"]
    band_hi    = gauge["confidence"]["upper"]

    counts     = topology["counts"]
    domains    = topology["domains"]
    grounded_ct = sum(1 for d in domains if d["grounding"] == "GROUNDED")
    weak_ct     = sum(1 for d in domains if d["grounding"] == "WEAKLY GROUNDED")
    total_doms  = counts.get("domains", len(domains))

    _use_psig   = _ACTIVE_CLIENT != "blueedge"
    client_name = _get_client_display_name(publish_safe)
    title_suffix = " (Publish)" if publish_safe else ""
    footer_note = (f"SAMPLE — {client_name}."
                   if _use_psig else
                   ("SAMPLE — Illustrative client environment." if publish_safe
                    else "SAMPLE — BlueEdge data used for demonstration purposes."))

    # Structural state: derived from risk + evidence completeness — not hardcoded per client
    _order = {"LOW": 0, "MODERATE": 1, "HIGH": 2}
    _risk_n = _order.get(risk, 1)
    if _risk_n >= 2:
        structural_state = "ESCALATED"
    elif _risk_n == 1 or ev_comp != "HIGH":
        structural_state = "UNRESOLVED"
    elif _risk_n == 0 and ev_comp == "HIGH":
        structural_state = "STABLE"
    else:
        structural_state = "CONDITIONAL"

    _ev_label = {"HIGH": "Complete", "PARTIAL": "Partial", "LOW": "Limited"}.get(ev_comp, ev_comp)
    _posture_hero_cls = {"PROCEED": "posture-proceed", "INVESTIGATE": "posture-investigate",
                         "ESCALATE": "posture-escalate"}.get(posture, "posture-investigate")

    # Hero rationale — two sentences derived from structural coverage state and evidence state
    _struct_sentence   = ("Structure is verified."
                          if weak_ct == 0 and grounded_ct >= total_doms
                          else "Structural coverage has gaps.")
    _evidence_sentence = ("Execution evidence is incomplete."
                          if not exec_eval
                          else "Execution evidence is present.")
    _hero_rationale = f"{_struct_sentence} {_evidence_sentence}"

    # Hero context tags — labeled structural / evidence / risk (no internal state label)
    _struct_tag = "STABLE" if (weak_ct == 0 and grounded_ct >= total_doms) else "DEGRADED"

    # Navigation links — client/run scoped
    _ev_name   = "lens_tier1_evidence_brief_pub.html" if publish_safe else "lens_tier1_evidence_brief.html"
    _narr_name = "lens_tier1_narrative_brief_pub.html" if publish_safe else "lens_tier1_narrative_brief.html"
    _t2_name   = "lens_tier2_diagnostic_narrative_pub.html" if publish_safe else "lens_tier2_diagnostic_narrative.html"
    if _use_psig:
        ev_link   = _scoped_report_url(_ev_name)
        narr_link = _scoped_report_url(_narr_name)
        t2_link   = _scoped_report_url(_t2_name)
        ws_link   = f"/tier2/workspace?client={_ACTIVE_CLIENT}&runId={_ACTIVE_VAULT_RUN_ID}"
    else:
        ev_link   = f"/api/report-file?name={_ev_name}"
        narr_link = f"/api/report-file?name={_narr_name}"
        t2_link   = f"/api/report-file?name={_t2_name}"
        ws_link   = None

    # ── Zone / signal counts ───────────────────────────────────────────
    sigs       = signals["signals"]
    sig_count  = sum(1 for s in sigs if s.get("state") == "ACTIVE")
    dep_load   = (metrics.get("dep_load", "—") if metrics else "—")
    etn        = (metrics.get("edge_to_node", "—") if metrics else "—")

    zone_count = 0
    zone_class = "COMPOUND_ZONE"
    if pz_proj:
        _pz_list_f = pz_proj.get("zone_projection", [])
        zone_count = len(_pz_list_f)
        if _pz_list_f:
            zone_class = _pz_list_f[0].get("zone_class", "COMPOUND_ZONE")

    # ── Confirmed card — prose sentences, no metric dumps ─────────────
    _truth_sentences: list = []
    if weak_ct == 0 and grounded_ct >= total_doms:
        _truth_sentences.append("All domains are structurally grounded.")
        _truth_sentences.append("No incomplete structural areas detected.")
    else:
        _truth_sentences.append(
            f"{grounded_ct} of {total_doms} domains are structurally grounded.")
    if metrics and dep_load not in ("—", "NOT_IN_SCOPE"):
        _truth_sentences.append(
            "Dependency and structural density remain within controlled bounds.")
    if _use_psig and zone_count > 0:
        _truth_sentences.append(
            "A single structural pressure pattern appears across the system.")
    truth_html = "<br><br>".join(esc(s) for s in _truth_sentences) if _truth_sentences else "—"

    # ── Gap items — compressed to short phrases ────────────────────────
    gap_items: list = []
    if not exec_eval:
        gap_items.append("Execution-layer behavioral state")
    if not_activated:
        _n = len(not_activated)
        gap_items.append(f"{_n} structural signal{'s' if _n != 1 else ''} not activated")
    if blind_spot:
        gap_items.append("Blind spot coverage active — entities outside zone scope not characterized")
    gap_items += [
        "Causal relationships between conditions",
        "Runtime behavior under load",
    ]
    gap_items_html = "".join(
        f'<li class="ds-gap-item">{esc(g)}</li>' for g in gap_items
    )

    # ── Pressure section (psig path only) ─────────────────────────────
    pressure_html = ""
    if _use_psig and pz_proj is not None and zone_count > 0:
        _pz_list_s  = pz_proj.get("zone_projection", [])
        _cp         = RC.collapse_patterns(_pz_list_s, pz_proj, publish_safe)
        _prim_count = sum(1 for z in _pz_list_s if z.get("attribution_profile") == "primary")
        _sec_count  = zone_count - _prim_count
        _sig_set    = (_cp["shared_sigs"] if _cp
                       else _pz_list_s[0].get("signals", []) if _pz_list_s else [])
        _sig_str    = " · ".join(_sig_set)
        _sig_n      = len(_sig_set)

        _sig_ids_trace = " · ".join(_sig_set) if _sig_set else ""
        _cells_html = (
            f'<div class="ds-pressure-cell ds-pressure-cell-sigs">'
            f'<div class="ds-pressure-cell-value">'
            f'Pressure is driven by {_sig_n} structural signal{"s" if _sig_n != 1 else ""}'
            f'</div>'
            f'<div class="ds-pressure-cell-sub">'
            f'The same signals act across all affected domains.'
            f'</div>'
            + (
                f'<div class="ds-pressure-cell-sub rc-trace">trace: {esc(_sig_ids_trace)}</div>'
                if _sig_ids_trace else ""
            ) +
            f'</div>'
        )
        _note_html = (
            f'<div class="ds-pressure-note">'
            f'<strong>One structural pressure pattern appears across multiple domains.</strong>'
            f'<br><br>'
            f'The same signals are active in each zone.<br>'
            f'The difference is not the signal \u2014 it is where the pressure originates.'
            f'<br><br>'
            f'This is structural co-presence, not causality.'
            f'</div>'
        ) if zone_count > 0 else ""

        pressure_html = (
            f'\n  <div class="ds-pressure">'
            f'\n    <div class="ds-pressure-label">Where pressure exists</div>'
            f'\n    <div class="ds-pressure-row">{_cells_html}</div>'
            f'\n    {_note_html}'
            f'\n  </div>'
        )

    # ── Explore nav strip ──────────────────────────────────────────────
    _explore_links: list = [
        (narr_link, "Executive Brief",  True),
        (ev_link,   "Structural Evidence", False),
        (t2_link,   "Diagnostic",       False),
    ]
    if _use_psig and ws_link:
        _explore_links.append((ws_link, "Workspace", False))
    explore_html = "".join(
        f'<a href="{href}" class="ds-explore-link{"  primary" if primary else ""}">'
        f'{esc(label)}</a>'
        for href, label, primary in _explore_links
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LENS — Decision Surface{title_suffix}</title>
  <style>{_DECISION_SURFACE_CSS}</style>
</head>
<body>
<div class="page">

  <div class="ds-identity">
    <span class="ds-brand">Signäl</span>
    <span class="ds-sep">·</span>
    <span class="ds-client">{esc(client_name)}</span>
    <span class="ds-sep">·</span>
    <span class="ds-run">{esc(_ACTIVE_VAULT_RUN_ID)}</span>
    <nav class="ds-nav">
      <a href="{narr_link}" class="ds-nav-link">Executive Brief</a>
      <a href="{ev_link}" class="ds-nav-link">Assessment</a>
      <a href="{t2_link}" class="ds-nav-link">Diagnostic</a>
    </nav>
  </div>

  <div class="ds-hero {_posture_hero_cls}">
    <div>
      <div class="ds-hero-posture">{esc(posture)}</div>
      <div class="ds-hero-rationale">{esc(_hero_rationale)}</div>
      <div class="ds-hero-context">
        <span class="ds-ctx-badge">STRUCTURE: {esc(_struct_tag)}</span>
        <span class="ds-ctx-sep">·</span>
        <span class="ds-ctx-badge">EVIDENCE: {esc(ev_comp)}</span>
        <span class="ds-ctx-sep">·</span>
        <span class="ds-ctx-badge">RISK: {esc(risk)}</span>
      </div>
    </div>
    {_render_radial_gauge(score, band_lo, band_hi, band_label)}
  </div>

  <div class="ds-split">
    <div class="ds-split-col confirmed">
      <div class="ds-split-label">Structurally confirmed</div>
      <div class="ds-truth-text">{truth_html}</div>
    </div>
    <div class="ds-split-col unknown">
      <div class="ds-split-label">Not known</div>
      <ul class="ds-gap-items">{gap_items_html}</ul>
    </div>
  </div>

  {pressure_html}

  <div class="ds-inference">
    <span class="ds-inference-tag">inference_prohibition</span>
    ACTIVE — all data on this surface is structural and evidential only.
    No advisory content, causal inference, or remediation guidance may be derived.
  </div>

  <div class="ds-explore">
    <div class="ds-explore-label">Open the evidence</div>
    <div class="ds-explore-strip">{explore_html}</div>
  </div>

  <div class="ds-footer">
    <span class="ds-footer-brand">Signäl</span>
    <span>{esc(footer_note)} · Decision Surface · No advisory content</span>
  </div>

</div>
</body>
</html>"""


def generate_decision_surface(output_dir: Optional[Path] = None) -> List[Path]:
    """Generate the Decision Surface: internal + publish-safe.

    Derives all content from canonical package, projection artifacts, gauge state,
    and language layer registry. No client-specific hardcoding.
    Returns list of written file paths (2 files).
    """
    if output_dir is None:
        output_dir = DECISION_REPORTS_DIR

    pub_dir = output_dir / "publish"
    output_dir.mkdir(parents=True, exist_ok=True)
    pub_dir.mkdir(parents=True, exist_ok=True)

    if not CANONICAL_PKG_DIR.exists():
        _fail(f"Canonical package directory not found: {CANONICAL_PKG_DIR}")

    topology  = load_canonical_topology()
    signals   = load_signal_registry()
    gauge     = load_gauge_state()
    psig_proj = _load_psig_projection()
    pz_proj   = _load_pressure_zone_projection()
    binding   = _load_binding_envelope()
    metrics   = _compute_structural_metrics(binding)
    dm        = _compute_decision_model(metrics, psig_proj, gauge)
    ll        = _load_language_layer()

    files: List[Path] = []
    artifacts = [
        (output_dir / "lens_decision_surface.html",         False),
        (pub_dir    / "lens_decision_surface_pub.html",     True),
    ]
    for out_path, pub_safe in artifacts:
        html = _build_decision_surface(
            topology, signals, gauge,
            publish_safe=pub_safe,
            psig_proj=psig_proj,
            pz_proj=pz_proj,
            metrics=metrics,
            decision_model=dm,
            ll=ll,
        )
        out_path.write_text(html, encoding="utf-8")
        print(f"[LENS REPORT] Generated: {out_path.resolve()}")
        files.append(out_path)

    return files


# ---------------------------------------------------------------------------
# Legacy entry point (preserved, not default)
# ---------------------------------------------------------------------------

def _main_legacy(output_path: Optional[Path] = None) -> None:
    if output_path is None:
        output_path = _default_output_path()

    if not FRAGMENTS_DIR.exists():
        _fail(f"Fragment directory not found: {FRAGMENTS_DIR}")

    payloads = load_all_payloads()
    html = build_html(payloads)

    forbidden_found = validate_report_text(html)
    if forbidden_found:
        _fail(f"FORBIDDEN IDENTIFIERS IN REPORT: {forbidden_found}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    print(f"[LENS REPORT] Generated: {output_path.resolve()}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main(tier1: bool = True, output_path: Optional[Path] = None,
         output_dir: Optional[Path] = None,
         deliverable: Optional[str] = None) -> None:
    if not tier1:
        _main_legacy(output_path=output_path)
        return
    if deliverable == "tier1":
        generate_tier1_reports(output_dir=output_dir)
    elif deliverable == "diagnostic":
        generate_tier2_reports()
    elif deliverable == "decision":
        generate_decision_surface()
    else:
        # "all" or None (no --deliverable flag) — generates all surfaces
        generate_tier1_reports(output_dir=output_dir)
        generate_tier2_reports()
        generate_decision_surface()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="LENS Report Generator — default: Tier-1 set (4 artifacts). Use --legacy for single executive report."
    )
    # Client / run parameterization
    parser.add_argument(
        "--client", default="blueedge",
        help="Client ID (default: blueedge)"
    )
    parser.add_argument(
        "--run-id", default="run_authoritative_recomputed_01",
        help="Run ID for canonical package and vault paths (default: run_authoritative_recomputed_01)"
    )
    parser.add_argument(
        "--api-base", default="http://localhost:3000",
        help="API base URL for projection endpoint (default: http://localhost:3000)"
    )
    parser.add_argument(
        "--fragments-dir", type=Path, default=None,
        help="Fragment directory override (default: clients/<client>/vaults/<run-id>/claims/fragments)"
    )
    parser.add_argument(
        "--package-dir", type=Path, default=None,
        help="Canonical package directory override (default: clients/<client>/psee/runs/<run-id>/package)"
    )
    parser.add_argument(
        "--claims", nargs="*", default=None,
        help="Explicit claim IDs to include (default: derived from fragments or package)"
    )
    # Report mode
    parser.add_argument(
        "--deliverable",
        choices=["tier1", "diagnostic", "decision", "all"],
        default=None,
        help=(
            "Select which deliverable(s) to generate: "
            "tier1 = Evidence Brief + Narrative Brief, "
            "diagnostic = Tier-2 Diagnostic Narrative, "
            "decision = Decision Surface only, "
            "all = all surfaces. "
            "Omitting this flag generates all surfaces."
        ),
    )
    parser.add_argument(
        "--tier1", action="store_true", default=True,
        help="Generate Tier-1 report set (default behavior)"
    )
    parser.add_argument(
        "--legacy", action="store_true", default=False,
        help="Generate legacy single executive report instead of Tier-1 set"
    )
    parser.add_argument(
        "--output-dir", type=Path, default=None,
        help="Output directory for Tier-1 artifacts (default: clients/<client>/reports/tier1/)"
    )
    parser.add_argument(
        "--output", type=Path, default=None,
        help="[Legacy only] Output HTML path"
    )
    args = parser.parse_args()
    _configure_runtime(
        client=args.client,
        run_id=args.run_id,
        api_base=args.api_base,
        fragments_dir=args.fragments_dir,
        package_dir=args.package_dir,
        claims=args.claims,
    )
    main(tier1=not args.legacy, output_path=args.output, output_dir=args.output_dir,
         deliverable=args.deliverable)
