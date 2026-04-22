/**
 * pages/vault.js
 * PRODUCTIZE.GAUGE.CLIENT.VAULT.EXPORT.IMPLEMENT.01
 *
 * Vault resolution surface.
 * Reads vault_index.json from public/vault/<client>/<run>/.
 * Resolves type+id → static HTML page URL, then redirects.
 * If vault is not exported, shows explicit "VAULT NOT EXPORTED" state.
 *
 * NO fake rendering. NO simulated node content. NO placeholder fallback.
 * inference_prohibition: ACTIVE
 */

import path from 'path'
import fs from 'fs'
import Link from 'next/link'

// ---------------------------------------------------------------------------
// Vault index location (single authoritative run)
// ---------------------------------------------------------------------------

const CLIENT   = 'blueedge'
const RUN_ID   = 'run_01_authoritative_generated'
const INDEX_PATH = path.join(
  process.cwd(), 'public', 'vault', CLIENT, RUN_ID, 'vault_index.json'
)

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------

function resolveLink(type, id, vi) {
  if (!vi) return { status: 'VAULT_INDEX_NOT_FOUND', url: null }
  if (vi.export_status !== 'EXPORTED') return { status: 'VAULT_NOT_EXPORTED', url: null }

  let exportPath = null

  if (type === 'artifact') {
    exportPath = vi.artifacts?.[id]
  } else if (type === 'signal') {
    const claimId = vi.signals?.[id]
    if (claimId) exportPath = vi.claims?.[claimId]
  } else if (type === 'claim') {
    exportPath = vi.claims?.[id]
  } else if (type === 'domain' || type === 'zone') {
    exportPath = vi.domain_routing?.fallback
  } else if (type === 'entity') {
    exportPath = vi.entities?.[id]
  } else {
    return { status: 'INVALID_TYPE', url: null }
  }

  if (!exportPath) return { status: 'NOT_FOUND', url: null }
  return { status: 'RESOLVED', url: `${vi.base_url}/${exportPath}` }
}

// ---------------------------------------------------------------------------
// SSR
// ---------------------------------------------------------------------------

export async function getServerSideProps({ query }) {
  const { type, id } = query

  if (!type || !id) {
    return { props: { error: 'MISSING_PARAMS', type: type || null, id: id || null } }
  }

  let vi = null
  try {
    vi = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'))
  } catch {
    return { props: { error: 'VAULT_INDEX_NOT_FOUND', type, id } }
  }

  const { status, url } = resolveLink(type, id, vi)

  if (status === 'RESOLVED') {
    return { redirect: { destination: url, permanent: false } }
  }

  return { props: { error: status, type, id } }
}

// ---------------------------------------------------------------------------
// Error page (shown when vault is not exported or resolution fails)
// ---------------------------------------------------------------------------

const ERROR_MESSAGES = {
  VAULT_INDEX_NOT_FOUND: 'Vault index not found. Run: pios vault export --client blueedge --run run_01_authoritative_generated',
  VAULT_NOT_EXPORTED:    'Vault has not been exported for this run. Export required before vault links resolve.',
  INVALID_TYPE:          'Unknown vault node type.',
  NOT_FOUND:             'Node not found in vault index.',
  MISSING_PARAMS:        'Both type and id parameters are required.',
}

export default function VaultPage({ error, type, id }) {
  return (
    <div className="vlt-page">
      <div className="vlt-header">
        <Link href="/tier2/workspace" className="vlt-back-link">← Workspace</Link>
        <span className="vlt-header-title">Evidence Vault</span>
      </div>

      {type && id && (
        <div className="vlt-node-header">
          <span className="vlt-node-type">{type}</span>
          <span className="vlt-node-id">{id}</span>
        </div>
      )}

      <div className="vlt-error-block">
        <div className="vlt-error-label">{error}</div>
        <div className="vlt-error-detail">
          {ERROR_MESSAGES[error] || 'Unexpected error.'}
        </div>
      </div>

      <div className="vlt-prohibition">
        <span className="vlt-prohibition-label">inference_prohibition</span>
        <span className="vlt-prohibition-value">ACTIVE</span>
      </div>
    </div>
  )
}
