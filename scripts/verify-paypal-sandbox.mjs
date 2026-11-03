#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const res = spawnSync(
  process.execPath,
  ['/Volumes/Dev/paypal-ai-hackathon/scripts/verify-paypal-sandbox.mjs', '--project', 'project_1', ...process.argv.slice(2)],
  { stdio: 'inherit', cwd: process.cwd() }
);
process.exit(res.status ?? 0);
