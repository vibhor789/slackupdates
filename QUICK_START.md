# Quick Start Guide

## Choose Your Solution

### 🚀 Fastest: n8n HTTP Workflow (5 minutes)

**Best for**: You already have n8n cloud and want to keep using it

1. Get your Slack bot token:
   - https://api.slack.com/apps → Your App → OAuth & Permissions
   - Copy "Bot User OAuth Token" (starts with `xoxb-`)

2. Create Header Auth credential in n8n:
   - Credentials → New → "Header Auth"
   - Name: `Authorization`
   - Value: `Bearer xoxb-YOUR-TOKEN`

3. Import workflow:
   - Download `n8n-http-workflow.json`
   - n8n → Import from File
   - Select the Header Auth credential in both HTTP nodes
   - Update Google Sheet ID
   - Activate!

📄 **Detailed Guide**: `SETUP_INSTRUCTIONS.md`

---

### 🛠️ Most Reliable: Node.js Script (15 minutes)

**Best for**: Want full control, or n8n keeps having issues

1. Setup Google Service Account:
   - https://console.cloud.google.com
   - Enable Google Sheets API
   - Create Service Account → Download JSON key
   - Share your Google Sheet with service account email

2. Configure environment:
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your tokens
   ```

3. Test:
   ```bash
   npm test
   ```

4. Deploy to run daily at 7 PM EST:
   - **Render.com** (recommended, free): See DEPLOYMENT.md
   - **GitHub Actions** (free): See DEPLOYMENT.md
   - **Your computer**: Use cron/Task Scheduler

📄 **Detailed Guide**: `DEPLOYMENT.md`

---

### 🔧 Try This: Fix n8n Slack Credential (2 minutes)

**Best for**: One more attempt before switching to HTTP nodes

1. In n8n, delete your current Slack credential

2. Create new credential:
   - Look for "Slack" credential type (not OAuth2)
   - Or try "Access Token" option if available
   - Paste your `xoxb-` token directly

3. Update your Slack nodes to use this credential

If this doesn't work, use Solution 1 (HTTP nodes) instead.

---

## What You Need

### For n8n Solutions:
- ✅ Slack bot token (`xoxb-...`)
- ✅ Google Sheet ID
- ✅ n8n cloud account

### For Node.js Solution:
- ✅ Slack bot token (`xoxb-...`)
- ✅ Google Service Account JSON key
- ✅ Google Sheet ID
- ✅ Node.js 18+ installed (for local testing)
- ✅ Deployment platform account (Render/Railway/GitHub)

---

## Required Slack Scopes (Already in Your App)

Make sure these are in your Slack app under "Bot Token Scopes":

**History scopes** (to read messages):
- ✅ `channels:history`
- ✅ `groups:history`
- ✅ `im:history`
- ✅ `mpim:history`

**Read scopes** (to list channels):
- ✅ `channels:read`
- ✅ `groups:read`
- ✅ `im:read`
- ✅ `mpim:read`

**Optional** (for user info):
- ✅ `users:read`

---

## Quick Test: Is Your Bot Token Valid?

Run this in terminal or use an online curl tool:

```bash
curl -X GET "https://slack.com/api/auth.test" \
  -H "Authorization: Bearer xoxb-YOUR-TOKEN-HERE"
```

**Good response**:
```json
{
  "ok": true,
  "url": "https://yourworkspace.slack.com/",
  "user": "your-bot-name",
  "bot_id": "B..."
}
```

**Bad response**:
```json
{
  "ok": false,
  "error": "invalid_auth"
}
```

If you get `"ok": false`, regenerate your token:
- Slack App → OAuth & Permissions → Reinstall App

---

## My Recommendation

Based on your situation (n8n cloud with OAuth issues):

1. **Try n8n HTTP Workflow first** (5 min setup)
   - If it works, you're done!
   - If not, move to option 2

2. **Use Node.js Script deployed to Render** (15 min setup)
   - More reliable
   - Free forever
   - Easy to modify
   - No dependency on n8n

---

## Need Help?

1. Check the error messages in the workflow/script logs
2. Verify bot token starts with `xoxb-`
3. Confirm bot is invited to channels (`/invite @BotName`)
4. Check Google Sheet is shared with service account (Node.js) or your Google credential works (n8n)
5. Review timezone settings (EST vs UTC)

## Files in This Repository

- `README.md` - Complete documentation
- `QUICK_START.md` - This file
- `SETUP_INSTRUCTIONS.md` - n8n HTTP workflow setup
- `DEPLOYMENT.md` - Node.js script deployment options
- `n8n-http-workflow.json` - Import-ready n8n workflow
- `slack-to-sheets.js` - Standalone Node.js script
- `test-connection.js` - Test Slack and Google connections
- `package.json` - Node.js dependencies
- `.env.example` - Environment variables template
