---
description: Set up dev environment — Homebrew, Git, Node.js, GitHub, Supabase, Vercel, Netlify CLIs + Chrome DevTools MCP
allowed-tools: [Bash, Read, Write, Edit, Glob, Grep, WebFetch, TodoWrite]
---

# Project Environment Setup

You are helping a user who has an app running locally and wants to get it on the internet. They may be completely new to deployment — don't assume they have accounts on GitHub, Supabase, Vercel, or Netlify, or that they know what tokens and API keys are.

## How to Run This Walkthrough

1. **First, scan what's already set up.** Run all the diagnostic checks below silently and build a picture of what's done vs. what's missing.
2. **Present a status summary.** Show the user a simple table of what's ready and what's not.
3. **Ask what they want to do.** Frame it as: "Your app is running locally. To get it on the web, here's what we need to set up. Want to walk through it?" Let them opt in.
4. **Walk through each missing piece one at a time.** Don't dump everything at once. Complete one step, confirm it works, then move to the next.
5. **Use the TodoWrite tool** to track progress so the user can see where they are.

## Phase 1: Foundation Tools (install and go)

These are silent prerequisites — just check and install if missing. No accounts or credentials needed.

### Homebrew

**Check:** `brew --version`

**If missing:** Tell the user to run this in a separate terminal (it needs interactive input):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
On Apple Silicon Macs, they may need to add Homebrew to their PATH afterward — the installer will print instructions.

**Verify:** `brew --version` returns a version number.

### Git

**Check:** `git --version` and `git config user.name` and `git config user.email`

**If missing:** On macOS, `git --version` triggers the Xcode Command Line Tools installer. Tell the user to accept the prompt. Alternatively: `brew install git`.

**If name/email not set:** Ask the user what name and email they'd like to use for commits, then run:
```bash
git config --global user.name "Their Name"
git config --global user.email "their@email.com"
```

### Node.js

**Check:** `node --version` and `npm --version`

**If missing:** `brew install node`

**If version < 18:** Tell the user modern frameworks need Node 18+. Upgrade with `brew upgrade node`.

## Phase 2: Getting Your Code on GitHub

This is the first service that needs an account. Explain why: "GitHub stores your code online. Hosts like Vercel and Netlify pull from GitHub to deploy. So we need this set up first."

### GitHub CLI (`gh`)

**Check:** `gh --version` and `gh auth status`

**If `gh` not installed:** `brew install gh`

**If not logged in:** The user needs a GitHub account and to authenticate. Walk them through it:

1. **If they don't have a GitHub account:** Tell them to go to https://github.com/signup and create a free account. Wait for them to confirm.
2. **To log in:** Tell them to run this in a separate terminal (Claude Code can't do interactive login):
   ```
   gh auth login
   ```
   Walk them through the prompts: GitHub.com > HTTPS > Yes (authenticate with browser) > Login with a web browser. They'll get a code to enter in the browser.
3. Come back and confirm when done.

**After auth, check if the project has a GitHub remote:**
```bash
git remote -v
```
If no remote exists, offer to create a GitHub repo and push:
```bash
gh repo create <project-name> --source=. --push --private
```
Ask the user if they want the repo to be public or private.

**Verify:** `gh auth status` shows authenticated. `git remote -v` shows a GitHub URL.

## Phase 3: Pick Your Stack

Before going further, ask the user two questions so the rest of the walkthrough only covers what they need:

**Question 1 — Hosting:** "Where do you want to put your app on the internet?"
1. **Vercel** — most popular for Next.js / React apps; tight GitHub integration
2. **Netlify** — popular for static sites and Jamstack; similar GitHub-driven deploys
3. **Both** — set up both (some teams use one for previews, the other for production)
4. **Skip** — don't deploy yet

**Question 2 — Database:** "Does your app use a database?"
- If you're using **Supabase** (Postgres + auth + storage), I'll walk through it.
- If you're using something else or no database at all, we'll skip this section.

Look at the project for clues before asking — `supabase` in `package.json`, a `supabase/` directory, references to `SUPABASE_*` env vars, or `netlify.toml` / `vercel.json` files. Mention what you found: "I see a `netlify.toml` in your repo — looks like you're already on Netlify."

Use the answers to decide which of the next phases to run.

## Phase 4: Database (Supabase)

Skip this phase if the user said no database in Phase 3.

### Supabase CLI

**Check:** `supabase --version`

**If not installed:** `brew install supabase/tap/supabase`

**If they don't have a Supabase account/project:**
1. Tell them to go to https://supabase.com and sign up (free tier available). Wait for confirmation.
2. Once they have an account, they need to create a project (if they haven't already). They can do this from the Supabase dashboard.
3. Once they have a project, they need an access token so Claude Code can manage the database:
   - Go to https://supabase.com/dashboard/account/tokens
   - Click "Generate new token", name it "Claude Code"
   - Copy the token (starts with `sbp_`)

**Store the token without pasting it in chat.** Chat transcripts persist on disk, so a freshly-issued token shouldn't be pasted into the conversation. Instead, tell the user to run this in their own terminal in the project directory, replacing `PASTE_TOKEN_HERE`:
```bash
printf 'SUPABASE_ACCESS_TOKEN=%s\n' 'PASTE_TOKEN_HERE' >> .env.local
```
Then make sure `.env.local` is gitignored (`grep -q '^\.env\.local$' .gitignore || echo '.env.local' >> .gitignore`). Have the user reply "done" when finished.

**Get the project keys:** The app also needs connection details. Tell the user:
- Go to the Supabase dashboard > your project > Settings > API
- You need: the **Project URL** and the **anon (public) key**
- If the app uses server-side operations, also grab the **service_role key**

For the keys (which are less sensitive than the personal access token but still secrets), tell the user to add them to `.env.local` themselves:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  (only if needed)
```

**Verify:** Load the token from `.env.local` and confirm the project appears, without ever printing the token:
```bash
set -a; source .env.local; set +a
supabase projects list 2>&1 | head -5
```

## Phase 5: Hosting

Run **only the branch(es)** the user picked in Phase 3. If they picked "Both", run 5a then 5b.

### Phase 5a: Vercel

Explain: "Vercel is what puts your app on the internet. It connects to your GitHub repo and automatically deploys whenever you push code. It gives you a URL like yourapp.vercel.app."

**Check:** `vercel --version` and `vercel whoami`

**If not installed:** `npm i -g vercel`

**If they don't have a Vercel account:**
1. Tell them to go to https://vercel.com/signup — recommend signing up with their GitHub account (this makes connecting repos easier).
2. Wait for confirmation.

**To log in:** Tell them to run in a separate terminal:
```
vercel login
```
Choose GitHub as the login method (since they just set that up). Complete the browser flow.

**To connect the project:** Tell them to run in a separate terminal, from the project directory:
```
vercel link
```
This connects the local project to Vercel. If they haven't created a Vercel project yet, this will offer to create one.

**Set up environment variables on Vercel:** If the project has `.env.local` with keys that the production app needs (like Supabase URL and anon key), tell the user they need to add those to Vercel too:
- Go to https://vercel.com > their project > Settings > Environment Variables
- Add the same keys (but NOT secrets like `SUPABASE_SERVICE_ROLE_KEY` unless the app needs it server-side in production)
- Or use the CLI: `vercel env add VARIABLE_NAME`

**Verify:** `vercel whoami` shows their username. `vercel ls` shows the project.

### Phase 5b: Netlify

Explain: "Netlify hosts your app on the internet, similar to Vercel. It connects to your GitHub repo and deploys automatically on every push, giving you a URL like yourapp.netlify.app."

**Check:** `netlify --version`

**If not installed:**
```bash
npm i -g netlify-cli
```
If that errors with a permissions issue or installs to a non-PATH directory, retry with an explicit Homebrew prefix (this can happen when an editor like Zed overrides the npm global location):
```bash
npm i -g --prefix=/opt/homebrew netlify-cli
```

**If they don't have a Netlify account:**
1. Tell them to go to https://app.netlify.com/signup — signing up with GitHub makes connecting repos easier.
2. Wait for confirmation.

**Get a Personal Access Token (so Claude Code can run headlessly):**
1. Tell them to open https://app.netlify.com/user/applications#personal-access-tokens
2. Click "New access token", name it "Claude Code", copy the token (starts with `nfp_`)

**Store the token without pasting it in chat.** Chat transcripts persist on disk, so a freshly-issued token shouldn't be pasted into the conversation. Tell the user to run this in their own terminal, replacing `PASTE_TOKEN_HERE`:
```bash
printf 'NETLIFY_AUTH_TOKEN=%s\n' 'PASTE_TOKEN_HERE' >> .env.local
```
And make sure `.env.local` is gitignored. Have the user reply "done" when finished.

**Verify the token works without ever reading its value:**
```bash
set -a; source .env.local; set +a
curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" https://api.netlify.com/api/v1/user
netlify sites:list --json 2>&1 | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d), 'sites visible')"
```
A 200 plus a site count means the token is good.

**To connect the project (analogous to `vercel link`):** Tell them to run in a separate terminal, from the project directory:
```
netlify link
```
This writes `.netlify/state.json` linking the local repo to a Netlify site. If they haven't created a Netlify site yet, run `netlify init` instead — it will create one and connect it to the GitHub repo.

**Set up environment variables on Netlify:** If `.env.local` has keys the production app needs (e.g. Supabase URL/anon), set them on Netlify too:
- Dashboard: https://app.netlify.com > Site > Site configuration > Environment variables
- Or CLI: `netlify env:set NEXT_PUBLIC_SUPABASE_URL https://xxxxx.supabase.co`
- Don't push secrets like `SUPABASE_SERVICE_ROLE_KEY` unless server-side functions need them.

**Verify:** `netlify status` shows the linked site. `netlify env:list` shows the configured variables.

## Phase 6: Browser Debugging (Chrome DevTools MCP)

Explain: "This lets Claude open a browser and look at your app directly — to spot visual bugs, read console errors, and take screenshots. It's optional but really helpful for debugging."

Ask: **"Want to set up Chrome DevTools so Claude can see your app in the browser?"**

### Chrome DevTools MCP (only if the user opts in)

**Check:** Look for `chrome-devtools` in MCP config:
```bash
cat ~/.claude.json 2>/dev/null | grep "chrome-devtools"
cat .mcp.json 2>/dev/null | grep "chrome-devtools"
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

**Important:** Tell the user they need to restart Claude Code after this change for the MCP server to connect.

**Verify:** After restart, try `mcp__chrome-devtools__list_pages`.

## Phase 7: Environment Variables Check

**Only run this if earlier steps didn't already cover it.** Check if the project has a `.env.example` or `.env.local.example` file. If so, compare it against `.env.local` and flag any missing keys. If there's no example file, search for `process.env.` in the code.

If anything is missing:
- List the variable names (not values)
- If you can tell where a value comes from, say where to find it
- Ask if they want help filling them in now or later

If Vercel is linked, also run `vercel env ls` and mention any local keys that aren't set in production. If Netlify is linked, run `netlify env:list` for the same.

## Final Summary

After completing all steps (or when the user says they're done), present a summary:

```
Homebrew:      brew --version
Git:           git --version + config
Node.js:       node --version (18+)
GitHub:        gh auth status + remote
Supabase:      supabase projects list (if applicable)
Vercel:        vercel whoami (if applicable)
Netlify:       netlify status (if applicable)
Chrome MCP:    .mcp.json configured (if applicable)
Env vars:      .env.local complete (if applicable)
```

Show a clear table with status for each. Mark skipped items as "skipped" not "missing". List any remaining action items.

## Important Notes

- **Never have the user paste a freshly-issued token into chat.** Chat transcripts are written to disk; a token in the transcript should be considered exposed and rotated. Always have them write the token directly to `.env.local` from their own terminal using the `printf ... >> .env.local` pattern.
- Never display, log, or `cat` secret keys, tokens, or passwords. Verify by hitting an authenticated endpoint and checking the response, not by printing the secret.
- If a tool requires interactive input (OAuth, login), tell the user to run it in a separate terminal — Claude Code is non-TTY.
- Make sure `.env.local` is gitignored before writing secrets to it.
- After any MCP config changes, remind the user to restart Claude Code.
- Let the user skip anything they don't need — not every project uses Supabase, needs both hosts, or wants Chrome DevTools.
- Keep explanations simple and jargon-free — assume the user is new to all of this.
