/**
 * pages/api/language.js
 * PI.SECOND-CLIENT.STEP16F.LANGUAGE-LAYER-EXTENSION.01
 *
 * Language Layer registry API — returns governed term decodes.
 * Source: docs/pios/41.x/language_layer_registry.json
 *
 * GET /api/language
 *   → { status, registry_id, inference_prohibition, entries: [...] }
 *
 * Returns empty entries array if registry absent — never 404.
 */

import fs   from 'fs'
import path from 'path'

const REPO_ROOT       = path.resolve(process.cwd(), '..', '..')
const REGISTRY_PATH   = path.join(
  REPO_ROOT, 'docs', 'pios', '41.x', 'language_layer_registry.json'
)

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (_) {
    return null
  }
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const registry = readJson(REGISTRY_PATH)

  if (!registry) {
    return res.status(200).json({
      status:               'ok',
      registry_id:          'LANGUAGE_LAYER_REGISTRY.01',
      inference_prohibition: 'ACTIVE',
      entries:              [],
    })
  }

  return res.status(200).json({
    status:               'ok',
    registry_id:          registry._registry_id,
    inference_prohibition: registry._inference_prohibition,
    entries:              registry.entries || [],
  })
}
