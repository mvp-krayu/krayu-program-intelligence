/**
 * pages/vault.js
 * PRODUCTIZE.GAUGE.VAULT.ROUTING.RESOLUTION.01
 *
 * Minimal vault resolution surface.
 * Resolves /vault?type=TYPE&id=ID to structured evidence node information.
 *
 * Types: artifact | signal | claim | domain
 * No full vault browsing. No graph navigation. No Obsidian integration.
 * inference_prohibition: ACTIVE on all resolved content.
 */

import path from 'path'
import fs from 'fs'
import Link from 'next/link'

// ---------------------------------------------------------------------------
// Known artifact registry
// ---------------------------------------------------------------------------

const ARTIFACT_REGISTRY = {
  'ART-01': {
    name:       'gauge_state.json',
    description: 'GAUGE score, band label, confidence interval, and domain-level scoring components.',
    sourcePath:  'clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/gauge_state.json',
  },
  'ART-04': {
    name:       'canonical_topology.json',
    description: 'Structural topology of all domains, capabilities, and components with grounding classification.',
    sourcePath:  'clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/canonical_topology.json',
  },
  'ART-05': {
    name:       'signal_registry.json',
    description: 'Bound signals with evidence_confidence ratings, trace_links, and domain associations.',
    sourcePath:  'clients/blueedge/psee/runs/run_authoritative_recomputed_01/package/signal_registry.json',
  },
}

const ARTIFACT_BY_NAME = Object.fromEntries(
  Object.entries(ARTIFACT_REGISTRY).map(([k, v]) => [v.name, k])
)

const VALID_TYPES = new Set(['artifact', 'signal', 'claim', 'domain'])

// ---------------------------------------------------------------------------
// Resolution functions (server-side only — called from getServerSideProps)
// ---------------------------------------------------------------------------

function resolveArtifact(id) {
  const artId = ARTIFACT_REGISTRY[id] ? id : ARTIFACT_BY_NAME[id]
  if (!artId) return { status: 'unrecognized' }
  return { status: 'recognized', artId, ...ARTIFACT_REGISTRY[artId] }
}

function resolveSignal(id, pkgDir) {
  try {
    const raw      = fs.readFileSync(path.join(pkgDir, 'signal_registry.json'), 'utf8')
    const registry = JSON.parse(raw)
    const signals  = registry.signals || []
    const sig      = signals.find(s => s.signal_id === id)
    if (!sig) return { status: 'not_found' }
    return {
      status:              'found',
      signal_id:           sig.signal_id,
      title:               sig.title || '',
      domain_id:           sig.domain_id || '',
      evidence_confidence: sig.evidence_confidence || '',
    }
  } catch {
    return { status: 'registry_unavailable' }
  }
}

function resolveDomain(id, pkgDir) {
  try {
    const raw      = fs.readFileSync(path.join(pkgDir, 'canonical_topology.json'), 'utf8')
    const topology = JSON.parse(raw)
    const domains  = topology.domains || []
    const domain   = domains.find(d => d.domain_id === id)
    if (!domain) return { status: 'not_found' }
    return {
      status:    'found',
      domain_id:  domain.domain_id,
      name:       domain.domain_name || domain.name || '',
      grounding:  domain.grounding  || '',
      cap_count:  (domain.capability_ids || []).length,
    }
  } catch {
    return { status: 'topology_unavailable' }
  }
}

// ---------------------------------------------------------------------------
// SSR
// ---------------------------------------------------------------------------

export async function getServerSideProps(context) {
  const { type, id } = context.query

  if (!type || !id) {
    return { props: { error: 'MISSING_PARAMS', type: type || null, id: id || null, resolved: null } }
  }

  if (!VALID_TYPES.has(type)) {
    return { props: { error: 'INVALID_TYPE', type, id, resolved: null } }
  }

  const pkgDir = path.join(
    process.cwd(), '..', '..',
    'clients', 'blueedge', 'psee', 'runs', 'run_authoritative_recomputed_01', 'package'
  )

  let resolved = null
  switch (type) {
    case 'artifact': resolved = resolveArtifact(id);            break
    case 'signal':   resolved = resolveSignal(id, pkgDir);      break
    case 'claim':    resolved = { status: 'not_materialized' }; break
    case 'domain':   resolved = resolveDomain(id, pkgDir);      break
  }

  return { props: { error: null, type, id, resolved } }
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

const STATUS_META = {
  recognized:           { label: 'Recognized',           cls: 'vlt-status-ok'   },
  found:                { label: 'Found',                 cls: 'vlt-status-ok'   },
  unrecognized:         { label: 'Unrecognized',          cls: 'vlt-status-warn' },
  not_found:            { label: 'Not Found',             cls: 'vlt-status-warn' },
  not_materialized:     { label: 'Not Materialized',      cls: 'vlt-status-warn' },
  registry_unavailable: { label: 'Registry Unavailable',  cls: 'vlt-status-err'  },
  topology_unavailable: { label: 'Topology Unavailable',  cls: 'vlt-status-err'  },
}

function StatusBadge({ status }) {
  const { label, cls } = STATUS_META[status] || { label: status, cls: '' }
  return <span className={`vlt-status-badge ${cls}`}>{label}</span>
}

function Field({ label, value, mono }) {
  return (
    <div className="vlt-field">
      <span className="vlt-field-label">{label}</span>
      {mono
        ? <code className="vlt-field-code">{value}</code>
        : <span className="vlt-field-value">{value}</span>
      }
    </div>
  )
}

// ---------------------------------------------------------------------------
// Resolution panels per type
// ---------------------------------------------------------------------------

function ArtifactPanel({ id, resolved }) {
  if (resolved.status === 'unrecognized') {
    return (
      <div className="vlt-panel">
        <div className="vlt-panel-row">
          <StatusBadge status="unrecognized" />
          <span className="vlt-panel-note">
            Artifact reference recognized but not materialized in Vault.
          </span>
        </div>
      </div>
    )
  }
  return (
    <div className="vlt-panel">
      <div className="vlt-panel-row">
        <StatusBadge status="recognized" />
        <span className="vlt-panel-id">{resolved.artId}</span>
        <span className="vlt-panel-name">{resolved.name}</span>
      </div>
      <Field label="Description" value={resolved.description} />
      <Field label="Source path" value={resolved.sourcePath} mono />
    </div>
  )
}

function SignalPanel({ id, resolved }) {
  if (resolved.status === 'registry_unavailable') {
    return (
      <div className="vlt-panel">
        <div className="vlt-panel-row">
          <StatusBadge status="registry_unavailable" />
          <span className="vlt-panel-note">Signal registry could not be loaded from canonical package.</span>
        </div>
      </div>
    )
  }
  if (resolved.status === 'not_found') {
    return (
      <div className="vlt-panel">
        <div className="vlt-panel-row">
          <StatusBadge status="not_found" />
          <span className="vlt-panel-note">Signal {id} not found in signal registry.</span>
        </div>
      </div>
    )
  }
  return (
    <div className="vlt-panel">
      <div className="vlt-panel-row">
        <StatusBadge status="found" />
        <span className="vlt-panel-id">{resolved.signal_id}</span>
        <span className="vlt-panel-name">{resolved.title}</span>
      </div>
      <Field label="Domain"              value={resolved.domain_id}           mono />
      <Field label="Evidence confidence" value={resolved.evidence_confidence} />
      <div className="vlt-panel-note vlt-note-muted">
        Full signal node not yet materialized in Vault. Source: signal_registry.json
      </div>
    </div>
  )
}

function ClaimPanel() {
  return (
    <div className="vlt-panel">
      <div className="vlt-panel-row">
        <StatusBadge status="not_materialized" />
        <span className="vlt-panel-note">Claim node not yet materialized in Vault.</span>
      </div>
    </div>
  )
}

function DomainPanel({ id, resolved }) {
  if (resolved.status === 'topology_unavailable') {
    return (
      <div className="vlt-panel">
        <div className="vlt-panel-row">
          <StatusBadge status="topology_unavailable" />
          <span className="vlt-panel-note">Canonical topology could not be loaded.</span>
        </div>
      </div>
    )
  }
  if (resolved.status === 'not_found') {
    return (
      <div className="vlt-panel">
        <div className="vlt-panel-row">
          <StatusBadge status="not_found" />
          <span className="vlt-panel-note">Domain {id} not found in canonical topology.</span>
        </div>
      </div>
    )
  }
  return (
    <div className="vlt-panel">
      <div className="vlt-panel-row">
        <StatusBadge status="found" />
        <span className="vlt-panel-id">{resolved.domain_id}</span>
        <span className="vlt-panel-name">{resolved.name}</span>
      </div>
      <Field label="Grounding"    value={resolved.grounding}         />
      <Field label="Capabilities" value={String(resolved.cap_count)} />
      <div className="vlt-panel-note vlt-note-muted">
        Domain-level Vault navigation not yet implemented. Source: canonical_topology.json
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Error page
// ---------------------------------------------------------------------------

function ErrorPage({ error, type, id }) {
  const messages = {
    MISSING_PARAMS: `Both type and id parameters are required. Example: /vault?type=artifact&id=ART-04`,
    INVALID_TYPE:   `Unknown type: "${type}". Valid types: artifact, signal, claim, domain.`,
  }
  return (
    <div className="vlt-page">
      <div className="vlt-header">
        <span className="vlt-header-title">Evidence Vault</span>
      </div>
      <div className="vlt-error-block">
        <div className="vlt-error-label">{error}</div>
        <div className="vlt-error-detail">{messages[error] || 'Unexpected error.'}</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VaultPage({ error, type, id, resolved }) {
  if (error) return <ErrorPage error={error} type={type} id={id} />

  return (
    <div className="vlt-page">
      <div className="vlt-header">
        <Link href="/tier2/workspace" className="vlt-back-link">← Workspace</Link>
        <span className="vlt-header-title">Evidence Vault</span>
      </div>

      <div className="vlt-node-header">
        <span className="vlt-node-type">{type}</span>
        <span className="vlt-node-id">{id}</span>
      </div>

      <div className="vlt-section-label">Resolution Status</div>

      {type === 'artifact' && <ArtifactPanel id={id} resolved={resolved} />}
      {type === 'signal'   && <SignalPanel   id={id} resolved={resolved} />}
      {type === 'claim'    && <ClaimPanel />}
      {type === 'domain'   && <DomainPanel   id={id} resolved={resolved} />}

      <div className="vlt-prohibition">
        <span className="vlt-prohibition-label">inference_prohibition</span>
        <span className="vlt-prohibition-value">ACTIVE</span>
      </div>
    </div>
  )
}
