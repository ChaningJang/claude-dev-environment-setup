#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const HOME = require('os').homedir();
const PLUGIN_DIR = path.join(HOME, '.claude', 'plugins', 'dev-environment-setup');
const REGISTRY_FILE = path.join(HOME, '.claude', 'plugins', 'installed_plugins.json');

// Files to copy (relative to this package)
const FILES = [
  '.claude-plugin/plugin.json',
  'commands/dev-environment-setup.md',
  'skills/environment-check/SKILL.md',
];

function registerPlugin() {
  let registry = { version: 2, plugins: {} };

  if (fs.existsSync(REGISTRY_FILE)) {
    try {
      registry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
    } catch {
      // Corrupted file, start fresh
    }
  }

  registry.plugins['dev-environment-setup'] = {
    name: 'dev-environment-setup',
    installPath: PLUGIN_DIR,
    scope: 'user',
    version: '1.0.2',
  };

  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2) + '\n');
}

function main() {
  const alreadyInstalled = fs.existsSync(path.join(PLUGIN_DIR, '.claude-plugin', 'plugin.json'));

  if (alreadyInstalled) {
    console.log('Plugin is already installed. Updating files...\n');
  } else {
    console.log('Installing Claude Code dev-environment-setup plugin...\n');
  }

  // The package root is one level up from bin/
  const packageRoot = path.join(__dirname, '..');

  // Copy plugin files
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

  // Register with Claude Code
  registerPlugin();
  console.log('  Registered plugin with Claude Code');

  console.log(`\nDone! Restart Claude Code, then type /dev-environment-setup to get started.`);
}

main();
