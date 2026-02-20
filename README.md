# Dev Environment Setup — Claude Code Plugin

A Claude Code plugin that helps you set up and troubleshoot your full dev toolchain: **GitHub CLI**, **Supabase CLI**, **Vercel CLI**, and **Chrome DevTools MCP**.

## Install

Run this in your terminal:

```bash
claude plugin add /path/to/dev-environment-setup
```

Or clone and install:

```bash
git clone https://github.com/ChaningJang/claude-dev-environment-setup.git ~/.claude/plugins/dev-environment-setup
```

Then **restart Claude Code**.

## What's Included

### `/setup-project` command

Type `/setup-project` in Claude Code to run a guided setup that:

1. Checks which tools are already configured
2. Walks you through setting up anything that's missing
3. Handles the non-interactive (non-TTY) constraints of Claude Code
4. Verifies everything works at the end

### Auto-detection skill

When Claude encounters errors like "access token not provided" or "not logged in" during normal work, it automatically recognizes the issue and guides you through the fix — instead of just failing.

## Tools Covered

| Tool | What it enables |
|------|----------------|
| **GitHub CLI** (`gh`) | Push code, create PRs, manage issues |
| **Supabase CLI** | Run database migrations, manage project |
| **Vercel CLI** | Deploy, manage env vars, check builds |
| **Chrome DevTools MCP** | Debug in browser — screenshots, console, network |

## Requirements

- [Claude Code](https://claude.ai/claude-code) installed
- macOS (uses Homebrew for CLI installs)
