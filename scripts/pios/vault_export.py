#!/usr/bin/env python3
"""
vault_export.py
PRODUCTIZE.GAUGE.CLIENT.VAULT.EXPORT.IMPLEMENT.01

Evidence Vault Export Builder.

Reads Evidence Vault V3 markdown from:
  clients/<client>/vaults/<run_id>/

Produces static HTML + vault_index.json to:
  app/gauge-product/public/vault/<client>/<run_id>/

Usage:
  vault_export.py --client blueedge --run run_01_authoritative_generated [--debug]
"""

import argparse
import html
import json
import logging
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

VAULT_SECTIONS = {
    'artifacts':       'artifact_id',
    'claims':          'claim_id',
    'entities':        'entity_id',
    'transformations': 'transformation_id',
}

NAV_FOLDER = '00 — Navigation'

ID_RE = re.compile(r'\b(ART-\d+|CLM-\d+|ENT-[\w-]+|TRN-\d+|(?:PSIG-|SIG-)\d+)\b')

SECTION_BY_PREFIX = {
    'ART': 'artifacts',
    'CLM': 'claims',
    'ENT': 'entities',
    'TRN': 'transformations',
}

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

log = logging.getLogger('vault_export')


def _setup_logging(debug: bool) -> None:
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        format='[vault_export] %(levelname)s %(message)s',
        level=level,
        stream=sys.stderr,
    )


# ---------------------------------------------------------------------------
# Frontmatter parser (no PyYAML dep)
# ---------------------------------------------------------------------------

def parse_frontmatter(text: str):
    """Returns (meta_dict, body_str). Handles simple key: value pairs."""
    if not text.startswith('---'):
        return {}, text
    end = text.find('\n---', 3)
    if end == -1:
        return {}, text
    fm_raw = text[3:end].strip()
    body = text[end + 4:].strip()
    meta = {}
    for line in fm_raw.splitlines():
        if ':' in line:
            key, _, val = line.partition(':')
            meta[key.strip()] = val.strip()
    return meta, body


# ---------------------------------------------------------------------------
# Inline markdown processor
# ---------------------------------------------------------------------------

def inline_md(text: str, signal_to_claim: dict) -> str:
    """Convert inline markdown to HTML. Escapes raw text first."""
    text = html.escape(text)

    def replace_wiki(m):
        inner = m.group(1)
        id_match = ID_RE.search(inner)
        if not id_match:
            return inner
        id_str = id_match.group(1)
        prefix = id_str.split('-')[0]
        if prefix == 'SIG':
            claim_id = signal_to_claim.get(id_str)
            if not claim_id:
                return inner
            section = 'claims'
            target_id = claim_id
        else:
            section = SECTION_BY_PREFIX.get(prefix)
            if not section:
                return inner
            target_id = id_str
        href = f'../{section}/{target_id}.html'
        return f'<a href="{href}">{inner}</a>'

    text = re.sub(r'\[\[([^\]]*)\]\]', replace_wiki, text)
    text = re.sub(r'\*\*([^*\n]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'`([^`\n]+)`', r'<code>\1</code>', text)
    return text


def _is_table_sep(cells):
    return all(re.match(r'^[-:\s]+$', c) for c in cells)


# ---------------------------------------------------------------------------
# Markdown body → HTML
# ---------------------------------------------------------------------------

def md_body_to_html(body: str, signal_to_claim: dict) -> str:
    lines = body.splitlines()
    out = []
    in_code = False
    code_buf = []
    code_lang = ''
    in_table = False
    table_first_row = True
    in_list = False

    for line in lines:
        # Code fence
        if line.strip().startswith('```'):
            if not in_code:
                in_code = True
                code_lang = line.strip()[3:].strip()
                code_buf = []
            else:
                in_code = False
                lang_cls = f' class="lang-{html.escape(code_lang)}"' if code_lang else ''
                escaped = '\n'.join(html.escape(l) for l in code_buf)
                out.append(f'<pre><code{lang_cls}>{escaped}</code></pre>')
                code_buf = []
                code_lang = ''
            continue

        if in_code:
            code_buf.append(line)
            continue

        # Close list if no longer a list line
        if in_list and not re.match(r'^[-*] ', line):
            out.append('</ul>')
            in_list = False

        # Close table if no longer a table row
        if in_table and not line.strip().startswith('|'):
            out.append('</table>')
            in_table = False
            table_first_row = True

        # Headings
        hm = re.match(r'^(#{1,3})\s+(.*)', line)
        if hm:
            level = len(hm.group(1))
            text = inline_md(hm.group(2), signal_to_claim)
            out.append(f'<h{level}>{text}</h{level}>')
            continue

        # Table rows
        if line.strip().startswith('|'):
            raw_cells = [c.strip() for c in line.strip('|').split('|')]
            if _is_table_sep(raw_cells):
                continue
            cells = [inline_md(c, signal_to_claim) for c in raw_cells]
            if not in_table:
                in_table = True
                table_first_row = True
                out.append('<table>')
            tag = 'th' if table_first_row else 'td'
            table_first_row = False
            row = ''.join(f'<{tag}>{c}</{tag}>' for c in cells)
            out.append(f'<tr>{row}</tr>')
            continue

        # List items
        if re.match(r'^[-*] ', line):
            if not in_list:
                out.append('<ul>')
                in_list = True
            out.append(f'<li>{inline_md(line[2:], signal_to_claim)}</li>')
            continue

        # Blank line
        if not line.strip():
            out.append('')
            continue

        # Paragraph
        out.append(f'<p>{inline_md(line, signal_to_claim)}</p>')

    # Close open blocks
    if in_list:
        out.append('</ul>')
    if in_code and code_buf:
        escaped = '\n'.join(html.escape(l) for l in code_buf)
        out.append(f'<pre><code>{escaped}</code></pre>')
    if in_table:
        out.append('</table>')

    return '\n'.join(out)


# ---------------------------------------------------------------------------
# CSS (dark theme, inline in every page)
# ---------------------------------------------------------------------------

VAULT_CSS = (
    ':root{--bg:#0a0a0a;--bg1:#111114;--bg2:#1a1a1e;--border:#222228;'
    '--text:#c4c4c4;--muted:#666;--dim:#555;--accent:#5a9fd4;--strong:#e0e0e0}'
    '*{box-sizing:border-box;margin:0;padding:0}'
    'body{background:var(--bg);color:var(--text);font-family:"Courier New",monospace;'
    'font-size:13px;line-height:1.75;padding:2.5rem 2rem}'
    '.w{max-width:860px;margin:0 auto}'
    '.nav{margin-bottom:2rem;font-size:.78rem}'
    '.nav a{color:var(--muted);text-decoration:none;letter-spacing:.04em}'
    '.nav a:hover{color:var(--accent)}'
    '.meta{background:var(--bg1);border:1px solid var(--border);border-left:2px solid #253040;'
    'padding:1rem 1.25rem;margin-bottom:2rem;font-size:.78rem}'
    '.mrow{display:flex;gap:.75rem;margin-bottom:.3rem}'
    '.mrow:last-child{margin-bottom:0}'
    '.mk{color:var(--muted);min-width:140px;flex-shrink:0;letter-spacing:.02em}'
    '.mv{color:#b0b0b0}'
    '.content h1{color:var(--strong);font-size:.95rem;margin:1.5rem 0 .6rem;letter-spacing:.02em}'
    '.content h2{color:#aaa;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;'
    'border-bottom:1px solid #1e1e24;padding-bottom:.35rem;margin:2rem 0 .75rem}'
    '.content h3{color:#888;font-size:.82rem;margin:1.25rem 0 .45rem;letter-spacing:.02em}'
    '.content p{margin:.7rem 0;line-height:1.75}'
    '.content a{color:var(--accent);text-decoration:none}'
    '.content a:hover{text-decoration:underline}'
    '.content code{background:var(--bg2);border:1px solid var(--border);'
    'padding:.1rem .3rem;font-size:.82em;color:#9ab}'
    '.content pre{background:var(--bg1);border:1px solid var(--border);border-left:2px solid #253040;'
    'padding:.9rem 1rem;overflow-x:auto;margin:1rem 0}'
    '.content pre code{background:none;border:none;padding:0;color:#aab}'
    '.content table{border-collapse:collapse;width:100%;margin:.9rem 0;font-size:.82rem}'
    '.content th,.content td{border:1px solid var(--border);padding:.4rem .7rem;text-align:left}'
    '.content th{background:var(--bg1);color:var(--muted);font-size:.72rem;'
    'letter-spacing:.07em;text-transform:uppercase}'
    '.content ul{padding-left:1.25rem;margin:.7rem 0}'
    '.content li{margin-bottom:.35rem}'
    '.content strong{color:var(--strong)}'
    '.footer{margin-top:3rem;padding-top:.85rem;border-top:1px solid var(--border);'
    'font-size:.72rem;color:var(--dim);letter-spacing:.03em}'
    '.footer .lbl{color:#a03030}'
)


# ---------------------------------------------------------------------------
# HTML page assembler
# ---------------------------------------------------------------------------

SKIP_META_FIELDS = {'stream_id', 'status'}


def build_html_page(title: str, meta: dict, body_html: str) -> str:
    esc_title = html.escape(title)
    meta_rows = ''.join(
        f'<div class="mrow"><span class="mk">{html.escape(k)}</span>'
        f'<span class="mv">{html.escape(str(v))}</span></div>'
        for k, v in meta.items()
        if k not in SKIP_META_FIELDS
    )
    return (
        f'<!DOCTYPE html>\n<html lang="en">\n<head>\n'
        f'<meta charset="utf-8">\n'
        f'<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        f'<title>{esc_title} — Evidence Vault</title>\n'
        f'<style>{VAULT_CSS}</style>\n'
        f'</head>\n<body>\n<div class="w">\n'
        f'<div class="nav"><a href="/tier2/workspace">\u2190 Diagnostic Workspace</a></div>\n'
        f'<div class="meta">{meta_rows}</div>\n'
        f'<div class="content">{body_html}</div>\n'
        f'<div class="footer"><span class="lbl">inference_prohibition</span> ACTIVE '
        f'&mdash; Evidence Vault V3 &mdash; READ-ONLY projection</div>\n'
        f'</div>\n</body>\n</html>'
    )


# ---------------------------------------------------------------------------
# Vault scanner
# ---------------------------------------------------------------------------

def _slugify_nav(name: str) -> str:
    slug = re.sub(r'[^\w\s-]', '', name.lower())
    slug = re.sub(r'[\s_]+', '-', slug.strip())
    return f'NAV-{slug}'


def scan_vault(vault_dir: Path):
    """
    Scans vault directory for markdown nodes.

    Returns:
      nodes: list of {section, node_id, meta, body_text, source_path}
      signal_to_claim: {SIG-NNN: CLM-NN}
    """
    nodes = []
    signal_to_claim = {}

    for folder, id_field in VAULT_SECTIONS.items():
        folder_path = vault_dir / folder
        if not folder_path.is_dir():
            log.debug(f'section folder missing: {folder}')
            continue
        for md_file in sorted(folder_path.glob('*.md')):
            text = md_file.read_text(encoding='utf-8')
            meta, body = parse_frontmatter(text)
            node_id = meta.get(id_field, '').strip()
            if not node_id:
                log.warning(f'missing {id_field} in {md_file.name} — skipping')
                continue
            nodes.append({
                'section':     folder,
                'node_id':     node_id,
                'meta':        meta,
                'body_text':   body,
                'source_path': str(md_file.relative_to(vault_dir)),
            })
            if folder == 'claims' and meta.get('claim_type') == 'signal':
                sig_m = re.search(r'(?:PSIG-|SIG-)\d+', meta.get('claim_label', ''))
                if sig_m:
                    signal_to_claim[sig_m.group(0)] = node_id
                    log.debug(f'signal mapping: {sig_m.group(0)} → {node_id}')

    nav_path = vault_dir / NAV_FOLDER
    if nav_path.is_dir():
        for md_file in sorted(nav_path.glob('*.md')):
            text = md_file.read_text(encoding='utf-8')
            meta, body = parse_frontmatter(text)
            node_id = _slugify_nav(md_file.stem)
            nodes.append({
                'section':     'navigation',
                'node_id':     node_id,
                'meta':        meta,
                'body_text':   body,
                'source_path': str(md_file.relative_to(vault_dir)),
            })

    return nodes, signal_to_claim


# ---------------------------------------------------------------------------
# HTML export writer
# ---------------------------------------------------------------------------

def export_html_nodes(nodes: list, signal_to_claim: dict, out_dir: Path) -> list:
    written = []
    for node in nodes:
        section = node['section']
        node_id = node['node_id']
        meta    = node['meta']
        body    = node['body_text']

        section_dir = out_dir / section
        section_dir.mkdir(parents=True, exist_ok=True)

        title = (
            meta.get('claim_label') or
            meta.get('artifact_name') or
            meta.get('entity_label') or
            meta.get('transformation_name') or
            meta.get('title') or
            node_id
        )

        body_html = md_body_to_html(body, signal_to_claim)
        page      = build_html_page(title, meta, body_html)
        out_path  = section_dir / f'{node_id}.html'
        out_path.write_text(page, encoding='utf-8')
        written.append(out_path)
        log.debug(f'  {section}/{node_id}.html')

    return written


# ---------------------------------------------------------------------------
# vault_index.json builder
# ---------------------------------------------------------------------------

def build_vault_index(nodes: list, signal_to_claim: dict, client: str, run_id: str) -> dict:
    artifacts       = {}
    claims          = {}
    entities        = {}
    transformations = {}
    navigation      = {}

    for node in nodes:
        section = node['section']
        nid     = node['node_id']
        path    = f'{section}/{nid}.html'
        if section == 'artifacts':
            artifacts[nid] = path
        elif section == 'claims':
            claims[nid] = path
        elif section == 'entities':
            entities[nid] = path
        elif section == 'transformations':
            transformations[nid] = path
        elif section == 'navigation':
            navigation[nid] = path

    return {
        'client_id':       client,
        'run_id':          run_id,
        'export_status':   'EXPORTED',
        'exported_at':     datetime.now(timezone.utc).isoformat(),
        'base_url':        f'/vault/{client}/{run_id}',
        'signals':         signal_to_claim,
        'claims':          claims,
        'artifacts':       artifacts,
        'entities':        entities,
        'transformations': transformations,
        'navigation':      navigation,
        'domain_routing': {
            'rule':     'all domain IDs route to topology entity — no per-domain vault nodes',
            'fallback': 'entities/ENT-topology-nodes.html',
        },
        'zone_routing': {
            'rule':     'zone IDs not individually vaulted — route to topology entity node',
            'fallback': 'entities/ENT-topology-nodes.html',
        },
    }


# ---------------------------------------------------------------------------
# Index HTML
# ---------------------------------------------------------------------------

def _index_table_rows(items: dict) -> str:
    return ''.join(
        f'<tr><td>{html.escape(k)}</td>'
        f'<td><a href="{html.escape(v)}">{html.escape(v)}</a></td></tr>'
        for k, v in sorted(items.items())
    )


def build_index_html(vi: dict) -> str:
    client      = html.escape(vi['client_id'])
    run         = html.escape(vi['run_id'])
    exported_at = html.escape(vi['exported_at'])
    counts = (
        f'<div class="mrow"><span class="mk">artifacts</span><span class="mv">{len(vi["artifacts"])}</span></div>'
        f'<div class="mrow"><span class="mk">claims</span><span class="mv">{len(vi["claims"])}</span></div>'
        f'<div class="mrow"><span class="mk">signals mapped</span><span class="mv">{len(vi["signals"])}</span></div>'
        f'<div class="mrow"><span class="mk">entities</span><span class="mv">{len(vi["entities"])}</span></div>'
        f'<div class="mrow"><span class="mk">transformations</span><span class="mv">{len(vi["transformations"])}</span></div>'
    )
    sections = {
        'Artifacts':       vi['artifacts'],
        'Claims':          vi['claims'],
        'Entities':        vi['entities'],
        'Transformations': vi['transformations'],
        'Navigation':      vi['navigation'],
    }
    tables = ''.join(
        f'<h2 class="content" style="margin:.75rem 0 .4rem">{html.escape(label)}</h2>'
        f'<table class="content"><tr><th>ID</th><th>Path</th></tr>{_index_table_rows(items)}</table>'
        for label, items in sections.items()
        if items
    )
    return (
        f'<!DOCTYPE html>\n<html lang="en">\n<head>\n'
        f'<meta charset="utf-8">\n'
        f'<title>Evidence Vault \u2014 {client} / {run}</title>\n'
        f'<style>{VAULT_CSS}</style>\n'
        f'</head>\n<body>\n<div class="w">\n'
        f'<div class="meta">'
        f'<div class="mrow"><span class="mk">client</span><span class="mv">{client}</span></div>'
        f'<div class="mrow"><span class="mk">run</span><span class="mv">{run}</span></div>'
        f'<div class="mrow"><span class="mk">export_status</span><span class="mv">EXPORTED</span></div>'
        f'<div class="mrow"><span class="mk">exported_at</span><span class="mv">{exported_at}</span></div>'
        f'{counts}</div>\n'
        f'{tables}\n'
        f'<div class="footer"><span class="lbl">inference_prohibition</span> ACTIVE '
        f'&mdash; Evidence Vault V3 &mdash; READ-ONLY projection</div>\n'
        f'</div>\n</body>\n</html>'
    )


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def validate_export(vi: dict) -> list:
    errors = []
    if len(vi['claims']) < 27:
        errors.append(f'expected ≥27 claims, got {len(vi["claims"])}')
    if len(vi['artifacts']) < 7:
        errors.append(f'expected ≥7 artifacts, got {len(vi["artifacts"])}')
    if len(vi['signals']) == 0:
        errors.append('no signal→claim mappings found')
    return errors


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description='Evidence Vault Export Builder — PRODUCTIZE.GAUGE.CLIENT.VAULT.EXPORT.IMPLEMENT.01'
    )
    parser.add_argument('--client',    required=True, help='Client identifier (e.g. blueedge)')
    parser.add_argument('--run',       required=True, help='Vault run directory name')
    parser.add_argument('--repo-root', dest='repo_root',
                        help='Repository root (default: auto-detected from script location)')
    parser.add_argument('--debug',     action='store_true')
    args = parser.parse_args()

    _setup_logging(args.debug)

    repo_root = (
        Path(args.repo_root).resolve()
        if args.repo_root
        else Path(__file__).resolve().parent.parent.parent
    )

    vault_dir = repo_root / 'clients' / args.client / 'vaults' / args.run
    out_dir   = repo_root / 'app' / 'gauge-product' / 'public' / 'vault' / args.client / args.run

    log.info(f'vault source : {vault_dir}')
    log.info(f'output dir   : {out_dir}')

    if not vault_dir.is_dir():
        log.error(f'vault not found: {vault_dir}')
        sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)

    log.info('scanning vault...')
    nodes, signal_to_claim = scan_vault(vault_dir)
    log.info(f'  {len(nodes)} nodes, {len(signal_to_claim)} signal→claim mappings')

    log.info('exporting HTML...')
    written = export_html_nodes(nodes, signal_to_claim, out_dir)
    log.info(f'  {len(written)} HTML files written')

    log.info('building vault_index.json...')
    vi = build_vault_index(nodes, signal_to_claim, args.client, args.run)
    (out_dir / 'vault_index.json').write_text(json.dumps(vi, indent=2), encoding='utf-8')

    log.info('building index.html...')
    (out_dir / 'index.html').write_text(build_index_html(vi), encoding='utf-8')

    errors = validate_export(vi)
    if errors:
        for e in errors:
            log.error(f'VALIDATION FAIL: {e}')
        sys.exit(1)

    log.info('VALIDATION PASS')
    print(json.dumps({
        'status':    'EXPORTED',
        'client':    args.client,
        'run':       args.run,
        'claims':    len(vi['claims']),
        'artifacts': len(vi['artifacts']),
        'signals':   len(vi['signals']),
        'entities':  len(vi['entities']),
        'out_dir':   str(out_dir),
    }))


if __name__ == '__main__':
    main()
