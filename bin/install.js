#!/usr/bin/env node

const { execSync } = require('child_process');

const MARKETPLACE = 'ChaningJang/claude-dev-environment-setup';
const PLUGIN = 'dev-environment-setup';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', env: { ...process.env, CLAUDECODE: '' } }).trim();
  } catch (e) {
    return e.stderr || e.stdout || '';
  }
}

function main() {
  // Check if claude CLI exists
  const claudeVersion = run('claude --version');
  if (!claudeVersion || claudeVersion.includes('not found')) {
    console.error('Claude Code is not installed. Install it at https://claude.ai/claude-code');
    process.exit(1);
  }

  console.log('Setting up dev-environment-setup plugin for Claude Code...\n');

  // Add marketplace
  console.log('  Adding plugin marketplace...');
  const addResult = run(`claude plugin marketplace add ${MARKETPLACE}`);
  if (addResult.includes('already')) {
    console.log('  Marketplace already added.');
  } else {
    console.log('  Marketplace added.');
  }

  // Install plugin
  console.log('  Installing plugin...');
  const installResult = run(`claude plugin install ${PLUGIN}`);
  if (installResult.includes('already installed')) {
    console.log('  Plugin already installed.');
  } else {
    console.log('  Plugin installed.');
  }

  console.log('\nDone! Restart Claude Code, then type /dev-environment-setup to get started.');
}

main();
