# Setup Instructions: Slack to Google Sheets Daily Updates

## The Issue You're Facing

Your n8n OAuth connection is using a **USER token** (has `identify` scope), but you need a **BOT token** (starts with `xoxb-`).

n8n cloud's OAuth login authenticates you as a user, not as a bot.

## Solution: Use HTTP Request Nodes

### Step 1: Create Header Auth Credential in n8n

1. In n8n cloud, go to **Credentials** → **New Credential**
2. Search for **"Header Auth"**
3. Configure it:
   - **Name**: `Slack Bot Token`
   - **Name** (field): `Authorization`
   - **Value**: `Bearer xoxb-YOUR-BOT-TOKEN-HERE`

Replace `xoxb-YOUR-BOT-TOKEN-HERE` with your actual bot token from:
- https://api.slack.com/apps → Your App → OAuth & Permissions → Bot User OAuth Token

### Step 2: Import the Workflow

1. Download the file: `n8n-http-workflow.json`
2. In n8n cloud, click **Workflows** → **Import from File**
3. Select the downloaded JSON file
4. Click **Import**

### Step 3: Configure the Workflow

After importing, you need to update:

#### A. HTTP Request Nodes (both of them)
- Click on "Slack API: Get All Channels" node
- Under **Credential for Header Auth**, select the "Slack Bot Token" you created
- Click on "Slack API: Get Channel History" node
- Do the same - select "Slack Bot Token"

#### B. Google Sheets Node
- Click on "Append to Google Sheets" node
- Select your Google Sheets credential (create if needed)
- Update **Document ID** with your Google Sheet ID
- Update **Sheet Name** (default is "Sheet1")

To get your Google Sheet ID:
- Open your Google Sheet
- Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
- Copy the SHEET_ID_HERE part

### Step 4: Prepare Your Google Sheet

Create a Google Sheet with these column headers in row 1:

| Date | Time | Channel | User | Message | Thread Reply | Reactions | Attachments |
|------|------|---------|------|---------|--------------|-----------|-------------|

### Step 5: Test the Workflow

1. Click **"Test workflow"** button in n8n
2. Click **"Execute workflow"**
3. Check for errors
4. Verify data appears in your Google Sheet

### Step 6: Activate

1. Click the **toggle switch** at the top to activate
2. The workflow will now run daily at 7 PM EST

## Troubleshooting

### Error: "missing_scope" still appears
- **Cause**: You're still using a user token
- **Fix**: Make sure the Header Auth credential has `Bearer xoxb-...` (not `xoxp-`)

### Error: "invalid_auth" or "token_revoked"
- **Cause**: Token is incorrect or expired
- **Fix**: Get a fresh bot token from Slack app settings

### Error: "channel_not_found"
- **Cause**: Bot is not in the channel
- **Fix**: Invite bot to channels with `/invite @YourBotName`

### No messages returned
- **Cause**: Bot can only see messages from when it joined onwards
- **Fix**: Bot must be in channel BEFORE messages are sent

### Rate limiting errors
- **Cause**: Too many API calls
- **Fix**: The workflow has a 1-second delay between channel requests (already configured)

## Verifying Your Bot Token Works

Run this test in your terminal or use an online curl tool:

```bash
curl -X GET "https://slack.com/api/auth.test" \
  -H "Authorization: Bearer xoxb-YOUR-TOKEN-HERE"
```

Should return:
```json
{
  "ok": true,
  "url": "https://your-workspace.slack.com/",
  "team": "Your Team",
  "user": "your-bot-name",
  "team_id": "T...",
  "user_id": "U...",
  "bot_id": "B..."
}
```

If you see `"ok": false`, your token is invalid.

## Alternative: Standalone Script

If n8n continues to have issues, see `slack-to-sheets.js` for a Node.js script you can run anywhere.
