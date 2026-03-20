/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  env: {
    // REPO_ROOT: absolute path to repo root, derived from this file's location.
    // next.config.js lives at app/execlens-demo/next.config.js → two levels up = repo root.
    REPO_ROOT: path.resolve(__dirname, '..', '..'),
  },
  // NEXT_PUBLIC_* vars are exposed to browser code.
  // NEXT_PUBLIC_OBSIDIAN_VAULT_NAME: set to your Obsidian vault name to enable
  // obsidian:// deep-link activation for resolved PIE navigation entries.
  // If empty or unset, resolved links show raw paths only (no deep links).
  // Example (shell): NEXT_PUBLIC_OBSIDIAN_VAULT_NAME=krayu-program-intelligence npm run dev
  //
  // Mapping rule (R5/G7 — deterministic and explicit):
  //   obsidian://open?vault=<vault>&file=<adapter nav path minus .md>
  //   adapter nav path originates from docs/pios/41.2/pie_vault/ traversal (42.1 R5)
}

module.exports = nextConfig
