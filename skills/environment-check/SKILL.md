---
name: environment-check
description: This skill should be used when Claude encounters an authentication error, "not logged in", "access token not provided", "not authenticated", permission denied from GitHub CLI, Supabase CLI, or Vercel CLI, or when a tool fails due to missing configuration. Also use when the user asks to "check my setup", "verify my tools", "what's configured", or "diagnose environment".
version: 1.0.0
---

# Environment Check & Recovery

When a CLI tool or service fails due to missing authentication or configuration, guide the user through fixing it instead of giving up.

## Detection Patterns

Recognize these failure signatures and respond with the appropriate fix:

### GitHub CLI (`gh`)
- **"not logged in"** or **"authentication required"**
- Fix: User must run `gh auth login` in a separate terminal (non-TTY)
- Choose: GitHub.com > HTTPS > Login with web browser

### Supabase CLI
- **"Access token not provided"** or **"Supply an access token"**
- Fix: User needs a personal access token from https://supabase.com/dashboard/account/tokens
- Store as `SUPABASE_ACCESS_TOKEN` in `.env.local`
- Use with: `SUPABASE_ACCESS_TOKEN=<token> supabase <command>`
- Alternative for raw SQL: Use the Management API directly:
  ```
  curl -X POST "https://api.supabase.com/v1/projects/<ref>/database/query"
    -H "Authorization: Bearer <token>"
    -d '{"query": "<SQL>"}'
  ```

### Vercel CLI
- **"not logged in"** or **"No credentials found"**
- Fix: User must run `vercel login` in a separate terminal
- After login, may need `vercel link` to connect to the project

### Chrome DevTools MCP
- **MCP tools not available** or **connection refused**
- Fix: Check `.mcp.json` or `~/.claude.json` for chrome-devtools config
- Ensure entry exists: `{"command": "npx", "args": ["chrome-devtools-mcp@latest"]}`
- User must restart Claude Code after config changes

### Supabase RLS / Database Errors
- **"infinite recursion detected in policy"** (error 42P17)
- Fix: RLS policies that query the same table they protect cause recursion. Create a `security definer` function to bypass RLS for permission checks.
- **"permission denied for table"**
- Fix: Check RLS policies. The authenticated user's role may not match any policy.

## Recovery Flow

1. Identify which tool failed and why (parse the error message)
2. Explain the issue clearly to the user in one sentence
3. Give the minimal steps to fix it (prefer the shortest path)
4. For browser-based auth flows, tell the user to use a separate terminal
5. After the user confirms they've completed the step, verify with a test command
6. If the user mentions `/dev-environment-setup`, suggest they run that command for a full environment audit

## Non-TTY Constraints

Claude Code runs in a non-TTY environment. This means:
- Interactive prompts (stdin) don't work
- OAuth browser flows must be done by the user in a separate terminal
- Tokens/keys should be passed via environment variables or flags, not interactive input
- Always check for env vars in `.env.local` before asking the user for credentials
