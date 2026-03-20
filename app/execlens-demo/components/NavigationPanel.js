/**
 * NavigationPanel.js
 * PIOS-42.7-RUN01-CONTRACT-v2  (corrects Obsidian path logic from 42.5)
 *
 * Governed enhancements:
 *
 *   1. Coverage gauge (O1):
 *      - Source: resolvedCount and navigation.length from adapter output (no computation)
 *      - Bar fill = resolvedCount / navigation.length (deterministic ratio)
 *      - Label shows exact counts (N/M)
 *
 *   2. Obsidian deep-link activation — corrected in 42.7 (R10):
 *      - Triggered only when NEXT_PUBLIC_OBSIDIAN_VAULT_NAME is configured
 *      - Link formula (R10/G7 — vault-relative, deterministic):
 *          strip vault root prefix from repo-relative path, strip .md suffix
 *          build: obsidian://open?vault=<vault>&file=<vault-relative path>
 *      - Path logic shared via utils/obsidian.js (VAULT_PREFIX transformation)
 *      - If vault not configured: shows raw path only (no link)
 *      - Unresolved links: remain marked ⚠, never linked
 *
 * All values from adapter props. No synthetic data. No fabricated links.
 */

import { buildObsidianLink } from '../utils/obsidian'

// ---------------------------------------------------------------------------
// Navigation coverage gauge (O1)
// Source: resolvedCount / navigation.length — both integers from adapter output
// ---------------------------------------------------------------------------

function CoverageGauge({ resolved, total }) {
  if (!total) return null
  const pct = Math.round((resolved / total) * 100)
  return (
    <div className="coverage-gauge-wrap">
      <div className="coverage-gauge-label">
        Vault coverage
        <span className="coverage-gauge-counts">{resolved} / {total} resolved</span>
      </div>
      <div className="coverage-gauge-track">
        <div
          className="coverage-gauge-fill"
          style={{ width: `${pct}%` }}
          title={`${pct}% resolved (${resolved}/${total})`}
        />
      </div>
      {resolved < total && (
        <div className="coverage-gauge-unresolved">
          {total - resolved} unresolved — source: docs/pios/41.2/pie_vault/
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Individual nav link entry
// ---------------------------------------------------------------------------

function NavLinkEntry({ nb, vaultName }) {
  const obsidianHref = nb.resolved
    ? buildObsidianLink(vaultName, nb.path)
    : null

  return (
    <div className="nav-link-entry">
      <span className={nb.resolved ? 'nav-resolved-icon' : 'nav-unresolved-icon'}>
        {nb.resolved ? '✓' : '⚠'}
      </span>
      <div>
        <div className="nav-link-name">[[{nb.link}]]</div>

        {nb.resolved && nb.path && (
          <>
            <div className="nav-link-path">{nb.path}</div>
            {obsidianHref ? (
              <a
                className="obsidian-link"
                href={obsidianHref}
                title={`Open in Obsidian: ${nb.path}`}
              >
                Open in Obsidian ↗
              </a>
            ) : (
              <div className="obsidian-link-hint">
                Set NEXT_PUBLIC_OBSIDIAN_VAULT_NAME to enable Obsidian links
              </div>
            )}
          </>
        )}

        {!nb.resolved && (
          <div className="nav-link-unresolved">UNRESOLVED in vault</div>
        )}
      </div>
    </div>
  )
}

function NavGroup({ label, entries, vaultName }) {
  if (!entries || entries.length === 0) return null
  return (
    <div>
      <div className="nav-group-label">{label}</div>
      {entries.map(nb => (
        <NavLinkEntry key={nb.link} nb={nb} vaultName={vaultName} />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// NavigationPanel
// ---------------------------------------------------------------------------

export default function NavigationPanel({ navigation }) {
  if (!navigation || navigation.length === 0) return null

  // Obsidian vault name — from Next.js NEXT_PUBLIC_* env (set in next.config.js)
  // Empty string treated as "not configured" → no deep links rendered
  const vaultName = process.env.NEXT_PUBLIC_OBSIDIAN_VAULT_NAME || null

  const resolvedCount   = navigation.filter(n => n.resolved).length
  const unresolvedCount = navigation.length - resolvedCount

  const domains = navigation.filter(n => n.link.startsWith('D_'))
  const caps    = navigation.filter(n => n.link.startsWith('C_'))
  const comps   = navigation.filter(n => n.link.startsWith('CMP_'))
  const other   = navigation.filter(n =>
    !n.link.startsWith('D_') && !n.link.startsWith('C_') && !n.link.startsWith('CMP_')
  )

  return (
    <div className="panel">
      <div className="panel-title">
        Navigation Map  [{navigation.length} links]
        {vaultName && (
          <span className="obsidian-vault-label"> · Obsidian: {vaultName}</span>
        )}
      </div>

      <CoverageGauge resolved={resolvedCount} total={navigation.length} />

      <NavGroup label="Domains"      entries={domains} vaultName={vaultName} />
      <NavGroup label="Capabilities" entries={caps}    vaultName={vaultName} />
      <NavGroup label="Components"   entries={comps}   vaultName={vaultName} />
      <NavGroup label="Other"        entries={other}   vaultName={vaultName} />
    </div>
  )
}
