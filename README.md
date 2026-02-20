# Dev Environment Setup — Claude Code Plugin

## What is this?

You've built an app on your machine. Now you need to get it on the internet — with a real URL, a database, and a way to push updates. This plugin sets up the tools that make that happen:

- **GitHub CLI** — Store and manage your code online. This lets you do it from the terminal instead of the website.
- **Supabase CLI** — Supabase is your database, where the app stores user data. This lets you set up and change the database from your computer.
- **Vercel CLI** — Vercel hosts the app on the internet. This lets you deploy and manage it from the terminal.
- **Chrome DevTools MCP** — Lets Claude open a browser and look at your app directly. It can spot errors, read console logs, and take screenshots without you having to describe the problem.

It assumes you already have code and a coding tool (Claude Code, Cursor, etc.). This gets you the infrastructure around it.

## Install

Clone the plugin into your Claude Code plugins directory:

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
