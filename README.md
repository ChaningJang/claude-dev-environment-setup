# Dev Environment Setup — Claude Code Plugin

## What is this?

You've built an app on your machine. Now you need to get it on the internet — with a real URL, a database, and a way to push updates. This plugin sets up the tools that make that happen:

- **GitHub CLI** — Store and manage your code online. This lets you do it from the terminal instead of the website.
- **Supabase CLI** — Supabase is your database, where the app stores user data. This lets you set up and change the database from your computer.
- **Vercel CLI** — Vercel hosts the app on the internet. This lets you deploy and manage it from the terminal.
- **Chrome DevTools MCP** — Lets Claude open a browser and look at your app directly. It can spot errors, read console logs, and take screenshots without you having to describe the problem.

It assumes you already have code and a coding tool (Claude Code, Cursor, etc.). This gets you the infrastructure around it.

## Prerequisites

Before you install this plugin, you need two things:

1. **Claude Code** — the AI coding tool that runs in your terminal. Install it at [claude.ai/claude-code](https://claude.ai/claude-code). (This also installs Node.js if you don't have it.)
2. **Git** — most Macs have this already. Open Terminal and type `git --version`. If it's not installed, your Mac will prompt you to install Xcode Command Line Tools — say yes.

That's it. This plugin handles everything else.

## Install

Open Terminal and run:

```bash
git clone https://github.com/ChaningJang/claude-dev-environment-setup.git ~/.claude/plugins/dev-environment-setup
```

Then **restart Claude Code**.

## Usage

Type `/setup-project` in Claude Code. It will:

1. Check which tools you already have
2. Walk you through installing and logging into anything that's missing
3. Verify everything works at the end

If something breaks later (like an expired login), Claude will automatically detect the issue and help you fix it.
