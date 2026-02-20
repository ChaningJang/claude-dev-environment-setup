#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PLUGIN_DIR = path.join(require('os').homedir(), '.claude', 'plugins', 'dev-environment-setup');

// Files to copy (relative to this package)
const FILES = [
  '.claude-plugin/plugin.json',
  'commands/setup-project.md',
  'skills/environment-check/SKILL.md',
];

function main() {
  console.log('Installing Claude Code dev-environment-setup plugin...\n');

  // The package root is one level up from bin/
  const packageRoot = path.join(__dirname, '..');

  // Create plugin directory structure
  for (const file of FILES) {
    const src = path.join(packageRoot, file);
    const dest = path.join(PLUGIN_DIR, file);
    const destDir = path.dirname(dest);

    if (!fs.existsSync(src)) {
      console.error(`  Missing file: ${file}`);
      process.exit(1);
    }

    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`  Copied ${file}`);
  }

  console.log(`\nPlugin installed to ${PLUGIN_DIR}`);
  console.log('\nRestart Claude Code, then type /setup-project to get started.');
}

main();
