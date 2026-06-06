'use strict';

const path = require('path');
const fs = require('fs');

let cached = null;

function resolveRepoRoot() {
  if (cached) return cached;

  const candidates = [
    path.resolve(process.cwd(), '../..'),
    path.resolve(process.cwd(), '..'),
    process.cwd(),
    path.resolve(__dirname, '../../../..'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'clients')) && fs.existsSync(path.join(candidate, 'docs'))) {
      cached = candidate;
      return cached;
    }
  }

  throw new Error('resolveRepoRoot: could not locate repo root (no clients/ + docs/ found). cwd=' + process.cwd() + ' __dirname=' + __dirname);
}

module.exports = { resolveRepoRoot };
