#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COMMAND_FILE = 'dev-environment-setup.md';

function main() {
  // Check if claude CLI exists
  try {
    execSync('claude --version', { encoding: 'utf8', stdio: 'pipe' });
  } catch {
    console.error('Claude Code is not installed. Install it at https://claude.ai/claude-code');
    process.exit(1);
  }

  const homeDir = process.env.HOME || process.env.USERPROFILE;
  const commandsDir = path.join(homeDir, '.claude', 'commands');
  const source = path.join(__dirname, '..', 'commands', COMMAND_FILE);
  const dest = path.join(commandsDir, COMMAND_FILE);

  // Ensure source file exists
  if (!fs.existsSync(source)) {
    console.error(`Source command file not found: ${source}`);
    process.exit(1);
  }

  // Create ~/.claude/commands/ if it doesn't exist
  fs.mkdirSync(commandsDir, { recursive: true });

  // Copy the slash command file
  fs.copyFileSync(source, dest);

  console.log('Installed /dev-environment-setup slash command for Claude Code.\n');
  console.log(`  Copied to: ${dest}\n`);
  console.log('Type /dev-environment-setup in Claude Code to get started.');
}

main();
