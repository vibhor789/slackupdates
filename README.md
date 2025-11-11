# Slack Daily Updates to Google Sheets

Automatically fetch daily updates from Slack channels and DMs and push them to Google Sheets at 7 PM EST.

## 🚨 Your Current Issue: Bot Token vs User Token

Your error shows you're using a **USER token** (has `identify` scope), but you need a **BOT token** (starts with `xoxb-`).

n8n cloud's OAuth login gives you a user token, not a bot token. That's why you're getting the `missing_scope` error even though you added the history scopes.

## ✅ Three Solutions Available

### Solution 1: n8n with HTTP Request Nodes (Recommended for n8n users)
Uses HTTP Request nodes instead of Slack OAuth nodes to bypass the token issue.
→ **See `SETUP_INSTRUCTIONS.md`**
→ **Import `n8n-http-workflow.json`**

### Solution 2: Standalone Node.js Script (Most reliable)
A simple script you can run anywhere - your computer, a free cloud service, or GitHub Actions.
→ **See `DEPLOYMENT.md`**
→ **Run `node slack-to-sheets.js`**

### Solution 3: Fix n8n Slack Credential (If you really want to use Slack nodes)
Try using "Access Token" credential type instead of OAuth2.
→ **See below**

---

## Problem: Missing Slack OAuth Scopes

If you're getting `missing_scope` errors like this:

```json
{
  "ok": false,
  "error": "missing_scope",
  "needed": "channels:history,groups:history,mpim:history,im:history",
  "provided": "channels:read,groups:read,im:read,mpim:read,..."
}
```

**The Issue**: Slack separates `:read` scopes (for metadata) from `:history` scopes (for messages).
- `channels:read` = See channel list, names, members
- `channels:history` = Read actual messages in channels

## Solution: Add History Scopes

### Step 1: Configure Slack App Permissions

1. Go to https://api.slack.com/apps
2. Select your app
3. Click "OAuth & Permissions" in left sidebar
4. Under "Bot Token Scopes", add these **4 required scopes**:

   ```
   channels:history    (Read messages in public channels)
   groups:history      (Read messages in private channels)
   mpim:history        (Read messages in group DMs)
   im:history          (Read messages in direct DMs)
   ```

5. **Optional but recommended scopes** for a complete solution:
   ```
   channels:read       (List public channels)
   groups:read         (List private channels)
   mpim:read           (List group DMs)
   im:read             (List DMs)
   users:read          (Get user information)
   users:read.email    (Get user emails)
   ```

### Step 2: Reinstall the App (CRITICAL!)

After adding scopes, you **MUST** reinstall the app:

1. You'll see a yellow banner: "Reinstall your app"
2. Click **"Reinstall to Workspace"**
3. Review and approve the new permissions
4. Copy the new **Bot User OAuth Token** (starts with `xoxb-`)

> ⚠️ **Important**: Just adding scopes doesn't activate them. You MUST reinstall the app!

### Step 3: Update n8n Credentials

1. Go to n8n > Credentials > Slack OAuth2 API
2. Delete old credential and create new one, OR
3. Update the "OAuth Token" field with the new `xoxb-` token
4. Test the connection

### Step 4: Invite Bot to Channels

The bot must be explicitly added to channels:

```
/invite @YourBotName
```

Or click channel details > Integrations > Add apps > Select your bot

For DMs and group DMs, the bot should automatically have access with the `im:history` and `mpim:history` scopes.

## n8n Workflow Overview

The workflow should look like this:

```
[Schedule Trigger] → [Slack Node: Get Conversations] → [Loop over channels]
    → [Slack Node: Get Channel History] → [Format Data]
    → [Google Sheets: Append Row]
```

### Key Slack API Methods to Use

1. **conversations.list** - Get all channels/DMs
   - Scopes needed: `channels:read`, `groups:read`, `im:read`, `mpim:read`

2. **conversations.history** - Get messages from a channel
   - Scopes needed: `channels:history`, `groups:history`, `im:history`, `mpim:history`
   - Parameters:
     - `channel`: Channel ID
     - `oldest`: Unix timestamp (for filtering by date)
     - `limit`: Number of messages to fetch

### Example: Get Last 24 Hours of Messages

```javascript
// In n8n Function node
const yesterday = Math.floor((Date.now() - 86400000) / 1000);

return {
  channel: $input.item.json.id,
  oldest: yesterday.toString(),
  limit: 100
};
```

## Troubleshooting

### Error: "not_in_channel"
- Solution: Invite bot to the channel with `/invite @BotName`

### Error: "missing_scope"
- Solution: Add the required scope to app config and **reinstall** the app

### Error: "token_revoked" or "invalid_auth"
- Solution: Generate a new token and update n8n credentials

### Messages not showing up
- Check the `oldest` parameter (Unix timestamp)
- Verify bot was invited to channel BEFORE the messages were sent
- Bots can only see messages from when they joined onwards

## Google Sheets Setup

1. Create a Google Sheet with columns:
   - Date
   - Time
   - Channel Name
   - User
   - Message
   - Thread (if reply)
   - Reactions
   - Attachments

2. In n8n, use the Google Sheets node with:
   - Operation: Append
   - Map Slack fields to sheet columns

## Recommended n8n Workflow Structure

1. **Schedule Trigger** (Cron: `0 9 * * *` for 9 AM daily)
2. **Slack: Get Conversations** (conversations.list)
3. **Filter** (exclude archived channels)
4. **Slack: Get History** (conversations.history with yesterday's timestamp)
5. **Function: Format Messages** (parse JSON, format timestamps)
6. **Google Sheets: Append** (add to sheet)
7. **Optional: Send summary notification**

## Next Steps

1. ✅ Fix Slack app scopes (add `:history` scopes)
2. ✅ Reinstall app in workspace
3. ✅ Update n8n credentials
4. ✅ Invite bot to all channels
5. ⬜ Build n8n workflow
6. ⬜ Test with single channel
7. ⬜ Deploy for all channels

## Resources

- [Slack OAuth Scopes](https://api.slack.com/scopes)
- [Slack conversations.history API](https://api.slack.com/methods/conversations.history)
- [n8n Slack Integration](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.slack/)
