---
description: Set up dev environment — GitHub, Supabase, Vercel CLIs + Chrome DevTools MCP
allowed-tools: [Bash, Read, Write, Edit, Glob, Grep, WebFetch, TodoWrite]
---

# Project Environment Setup

Walk the user through setting up the full development and deployment toolchain for this project. The goal is to ensure Claude Code can: push code to GitHub, deploy to Vercel, run SQL on Supabase, and debug in the browser via Chrome DevTools MCP.

## Setup Order

The tools must be configured in this order because of dependencies:

1. **GitHub CLI** (needed first — Vercel deploys from GitHub)
2. **Supabase CLI** (independent, but needed for DB migrations)
3. **Vercel CLI** (needs GitHub repo linked)
4. **Chrome DevTools MCP** (independent, for browser debugging)
5. **Environment variables** (.env.local for local dev, Vercel for production)

## Step-by-Step Process

For each tool below, first CHECK if it's already configured before asking the user to set it up. Run the diagnostic command, report the status, and only proceed with setup if needed. Use the TodoWrite tool to track progress through each step.

### Step 1: GitHub CLI (`gh`)

**Check:**
```bash
gh --version
gh auth status
```

**If not installed:** Tell the user to run `brew install gh`.

**If not authenticated:** Run `gh auth login` — but since Claude Code is non-TTY, tell the user:
1. Run `gh auth login` in a separate terminal
2. Choose: GitHub.com > HTTPS > Yes (authenticate with browser) > Login with a web browser
3. Come back and confirm when done

**Verify:** Run `gh auth status` and confirm authenticated user and repo access. Also verify the current project remote: `git remote -v`.

### Step 2: Supabase CLI

**Check:**
```bash
supabase --version
SUPABASE_ACCESS_TOKEN=<token> supabase projects list 2>&1 | head -5
```

**If not installed:** Tell the user to run `brew install supabase/tap/supabase`.

**If not authenticated:** The Supabase CLI needs an access token for non-TTY use. Tell the user:
1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token", name it "Claude Code"
3. Copy the token (starts with `sbp_`)
4. Share it here or add it to `.env.local` as `SUPABASE_ACCESS_TOKEN=sbp_...`

**Important:** Store the token in `.env.local` so it persists across sessions. Add `SUPABASE_ACCESS_TOKEN` to `.env.local` if the user provides it.

**Verify:** Run `supabase projects list` with the token and confirm the project appears.

**How Claude uses it:** To run SQL migrations against the remote database:
```bash
curl -s -X POST "https://api.supabase.com/v1/projects/<ref>/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "<SQL>"}'
```

### Step 3: Vercel CLI

**Check:**
```bash
vercel --version
vercel whoami 2>&1
```

**If not installed:** Tell the user to run `npm i -g vercel`.

**If not authenticated:** Tell the user:
1. Run `vercel login` in a separate terminal
2. Choose their login method (GitHub recommended since the repo is on GitHub)
3. Complete the browser auth flow
4. Come back and confirm when done

**If not linked to project:** Run `vercel link` — but in non-TTY, tell the user:
1. Run `vercel link` in a separate terminal in the project directory
2. Select the existing project when prompted
3. Come back and confirm when done

**Verify:** Run `vercel whoami` and `vercel inspect` or `vercel ls` to confirm the project is linked.

### Step 4: Chrome DevTools MCP

**Check:** Look for `chrome-devtools` in the MCP server configuration:
```bash
cat ~/.claude.json | grep -A5 "chrome-devtools" 2>/dev/null
```

Also check project-level:
```bash
cat .mcp.json 2>/dev/null
```

**If not configured:** Create or update `.mcp.json` in the project root:
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

**Important:** After adding MCP config, tell the user they need to restart Claude Code for the MCP server to connect.

**Verify:** Try calling `mcp__chrome-devtools__list_pages` — if it works, Chrome DevTools MCP is connected.

### Step 5: Environment Variables

**Check .env.local exists and has required keys:**
```bash
grep -c "NEXT_PUBLIC_SUPABASE_URL\|NEXT_PUBLIC_SUPABASE_ANON_KEY\|SUPABASE_SERVICE_ROLE_KEY" .env.local
```

**Required variables for local dev (.env.local):**
- `NEXT_PUBLIC_SUPABASE_URL` — From Supabase dashboard > Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — From Supabase dashboard > Settings > API
- `SUPABASE_SERVICE_ROLE_KEY` — From Supabase dashboard > Settings > API (keep secret!)
- `SUPABASE_ACCESS_TOKEN` — The token from Step 2 (for CLI/API access)

**Required variables for Vercel production:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Tell the user which variables are missing and where to find them. Never display secret values — just confirm they exist.

**Verify Vercel env vars:** If Vercel CLI is linked, check:
```bash
vercel env ls 2>&1
```

## Final Verification

After all steps, run a comprehensive status check:

```
GitHub:    gh auth status
Supabase:  supabase projects list (with token)
Vercel:    vercel whoami
MCP:       list_pages (Chrome DevTools)
Env:       .env.local keys present
```

Present a summary table showing each tool's status (configured/not configured) and any remaining action items.

## Important Notes

- Never display or log secret keys, tokens, or passwords
- If a tool requires browser-based auth (OAuth), tell the user to do it in a separate terminal since Claude Code is non-TTY
- Store tokens in `.env.local` (gitignored) so they persist
- After any MCP config changes, remind the user to restart Claude Code
- If the user only wants to set up specific tools, skip the others
