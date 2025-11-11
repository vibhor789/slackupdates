# Deployment Guide: Node.js Script

If n8n isn't working, you can deploy this Node.js script to run automatically at 7 PM EST daily.

## Option 1: Deploy to Render (Free, Recommended)

Render offers free cron jobs that are perfect for this.

### Steps:

1. **Push this code to GitHub**
   ```bash
   git add .
   git commit -m "Add Slack to Sheets script"
   git push
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create a Cron Job**
   - Dashboard → "New" → "Cron Job"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `slack-to-sheets`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node slack-to-sheets.js`
     - **Schedule**: `0 19 * * *` (7 PM UTC) or `0 0 * * *` (Midnight UTC = 7 PM EST)

4. **Set Environment Variables**
   - In Render dashboard, add:
     - `SLACK_BOT_TOKEN`: Your xoxb- token
     - `GOOGLE_SHEET_ID`: Your sheet ID
     - Paste your Google credentials JSON as `GOOGLE_CREDENTIALS_JSON`

5. **Update script to use env JSON** (modify slack-to-sheets.js):
   ```javascript
   // Add this at the top
   if (process.env.GOOGLE_CREDENTIALS_JSON) {
     const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
     // Use credentials directly
   }
   ```

## Option 2: Deploy to Railway (Free Tier)

1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub repo
4. Add environment variables
5. Add cron schedule in `railway.json`:
   ```json
   {
     "deploy": {
       "cron": "0 19 * * *"
     }
   }
   ```

## Option 3: Run on Your Computer with Cron/Task Scheduler

### On Linux/Mac (using cron):

1. Install dependencies:
   ```bash
   npm install
   ```

2. Edit crontab:
   ```bash
   crontab -e
   ```

3. Add this line (runs at 7 PM daily):
   ```
   0 19 * * * cd /path/to/slackupdates && /usr/bin/node slack-to-sheets.js >> slack-sync.log 2>&1
   ```

### On Windows (using Task Scheduler):

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 7:00 PM
4. Action: Start a program
   - Program: `C:\Program Files\nodejs\node.exe`
   - Arguments: `slack-to-sheets.js`
   - Start in: `C:\path\to\slackupdates`

## Option 4: GitHub Actions (Free)

Create `.github/workflows/slack-sync.yml`:

```yaml
name: Slack to Sheets Sync

on:
  schedule:
    # Runs at 7 PM EST (midnight UTC)
    - cron: '0 0 * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run sync script
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
          GOOGLE_SHEET_ID: ${{ secrets.GOOGLE_SHEET_ID }}
          GOOGLE_CREDENTIALS_JSON: ${{ secrets.GOOGLE_CREDENTIALS_JSON }}
        run: |
          echo "$GOOGLE_CREDENTIALS_JSON" > google-credentials.json
          node slack-to-sheets.js
```

Then add secrets in GitHub repo settings:
- `SLACK_BOT_TOKEN`
- `GOOGLE_SHEET_ID`
- `GOOGLE_CREDENTIALS_JSON`

## Setup Google Service Account (Required for Node.js script)

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable Google Sheets API:
   - APIs & Services → Library → Search "Google Sheets API" → Enable
4. Create Service Account:
   - APIs & Services → Credentials → Create Credentials → Service Account
   - Name it "slack-to-sheets"
   - Click Create → Continue → Done
5. Create Key:
   - Click on the service account
   - Keys tab → Add Key → Create new key → JSON
   - Download the JSON file
   - Save as `google-credentials.json` in your project
6. Share Google Sheet with Service Account:
   - Open your Google Sheet
   - Click Share
   - Add the service account email (looks like: slack-to-sheets@project.iam.gserviceaccount.com)
   - Give it Editor access

## Testing Before Deployment

1. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values

3. Run test script:
   ```bash
   npm test
   ```

4. If tests pass, run the main script:
   ```bash
   npm start
   ```

## Troubleshooting

### Script runs but no data in sheet
- Check that service account has Editor access to the sheet
- Verify GOOGLE_SHEET_ID is correct
- Check sheet name is "Sheet1" or update in script

### Slack errors
- Ensure bot token starts with `xoxb-`
- Verify all history scopes are added
- Check bot is invited to channels

### Time zone issues
- Adjust cron schedule for your timezone
- EST = UTC-5 (winter) or UTC-4 (summer/EDT)
- 7 PM EST = Midnight UTC (winter) or 11 PM UTC (summer)
