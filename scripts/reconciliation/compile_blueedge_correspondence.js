#!/usr/bin/env node

/**
 * BlueEdge wrapper for the parameterized correspondence compiler.
 * Preserved for backward compatibility.
 *
 * Usage: node scripts/reconciliation/compile_blueedge_correspondence.js
 */

'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const script = path.join(__dirname, 'compile_correspondence.js');

execFileSync(process.execPath, [
  script,
  '--client', 'blueedge',
  '--run', 'run_blueedge_productized_01_fixed',
], { stdio: 'inherit' });
