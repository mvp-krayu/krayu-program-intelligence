/**
 * utils/obsidian.js
 * PIOS-42.7-RUN01-CONTRACT-v2
 *
 * Shared Obsidian deep-link construction utility.
 *
 * Vault-relative path transformation rule (R10 — deterministic, inspectable):
 *
 *   Input (repo-relative):   docs/pios/41.2/pie_vault/01_Domains/D_10_X.md
 *   Output (vault-relative): 01_Domains/D_10_X
 *
 *   Step 1: strip VAULT_PREFIX = "docs/pios/41.2/pie_vault/"
 *   Step 2: strip trailing ".md" extension
 *   Step 3: build obsidian://open?vault=<vault>&file=<vault-relative path>
 *
 * Rules:
 *   - vaultName from NEXT_PUBLIC_OBSIDIAN_VAULT_NAME env var only
 *   - path must be a resolved adapter navigation path
 *   - returns null if vaultName or path missing
 *   - never guesses alternate roots or vault structures
 */

// The vault root relative to the repository root.
// This prefix is stripped deterministically from all adapter-supplied paths.
const VAULT_PREFIX = 'docs/pios/41.2/pie_vault/'

/**
 * Build a corrected Obsidian deep-link URI.
 *
 * @param {string|null} vaultName  - Configured vault name (from env).
 * @param {string|null} repoPath   - Repo-relative path from adapter (e.g. docs/pios/41.2/pie_vault/01_Domains/D_10_X.md).
 * @returns {string|null}          - Valid obsidian:// URI, or null if inputs missing.
 */
export function buildObsidianLink(vaultName, repoPath) {
  if (!vaultName || !repoPath) return null

  // Strip vault prefix (R10: explicit, deterministic, lossless)
  let vaultRelative = repoPath.startsWith(VAULT_PREFIX)
    ? repoPath.slice(VAULT_PREFIX.length)
    : repoPath

  // Strip .md extension
  if (vaultRelative.endsWith('.md')) {
    vaultRelative = vaultRelative.slice(0, -3)
  }

  return `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(vaultRelative)}`
}
