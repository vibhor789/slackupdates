# ElevenLabs Only Setup Guide

Simpler setup using only ElevenLabs Conversational AI (no Vapi).

## When to Use This Option

| Use ElevenLabs Only If... |
|---------------------------|
| You want the simplest setup |
| You're just testing the concept |
| Voice quality is #1 priority |
| You don't need advanced call features |

---

## Step 1: Create Accounts (5 min)

### ElevenLabs
1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up → Choose **Creator plan** ($22/mo)
3. Go to Profile → **API Keys** → Copy key

### Airtable
1. Go to [airtable.com](https://airtable.com)
2. Create account (free works)
3. Set up base per `AIRTABLE_SCHEMA.md`
4. Get API token: [airtable.com/create/tokens](https://airtable.com/create/tokens)

---

## Step 2: Create Conversational AI Agent (15 min)

### 2.1 Create Agent

1. ElevenLabs Dashboard → **Conversational AI**
2. Click **Create Agent**
3. Name: `RecruitConnect`

### 2.2 Configure Voice

- **Voice**: Rachel (warm, professional)
- **Model**: eleven_turbo_v2_5 (fastest)
- **Stability**: 0.5
- **Similarity**: 0.75

### 2.3 Add System Prompt

Copy the full prompt from `ELEVENLABS_AGENT_PROMPT.md` into the System Prompt field.

### 2.4 Configure First Message

Set to: `Hi, is this {{candidate_name}}?`

### 2.5 Set Up Phone

1. Go to Agent → **Settings** → **Phone**
2. Click **Enable Phone Calling**
3. ElevenLabs will assign you a number
4. Or connect your Twilio account for custom number

### 2.6 Configure Webhook

1. Agent Settings → **Webhooks**
2. Add your n8n webhook URL:
   ```
   https://your-n8n.com/webhook/elevenlabs-call-complete
   ```
3. Enable: **Call Completed**

### 2.7 Copy Agent ID

Found in Agent Settings → Format: `agent_xxxxxxxxxxxx`

---

## Step 3: Set Up n8n (10 min)

### 3.1 Add Credentials

**ElevenLabs API Key:**
1. n8n → Credentials → Add
2. Type: HTTP Header Auth
3. Name: `xi-api-key`
4. Value: Your ElevenLabs API key

**Airtable:**
1. Credentials → Add → Airtable Token API
2. Paste your Personal Access Token

### 3.2 Import Workflow

1. Workflows → Import
2. Select `n8n-elevenlabs-workflow.json`

### 3.3 Update Placeholders

Find and replace:
- `YOUR_BASE_ID` → Your Airtable base ID
- `YOUR_ELEVENLABS_AGENT_ID` → Your agent ID
- `YOUR_N8N_WEBHOOK_URL` → Your n8n URL
- `YOUR_AGENCY_NAME` → Your company name
- `YOUR_CALLBACK_NUMBER` → Your phone

### 3.4 Activate

Toggle workflow to active.

---

## Step 4: Test (5 min)

1. Add test candidate in Airtable:
   - Full Name: Your Name
   - Phone: Your phone (+1 format)
   - Call Status: "Pending Call"
   - Niche/Industry: IT

2. Go to ElevenLabs → Your Agent → **Test**

3. Click **Make Call** → Enter your number

4. Answer and test the conversation

5. Verify:
   - [ ] Call connected
   - [ ] Voice sounds natural
   - [ ] Webhook received in n8n
   - [ ] Airtable updated
   - [ ] Recording saved

---

## ElevenLabs Pricing

| Plan | Price | Minutes | Per Extra Min |
|------|-------|---------|---------------|
| Creator | $22/mo | ~100 | $0.30 |
| Pro | $99/mo | ~500 | $0.24 |
| Scale | $330/mo | ~2000 | $0.18 |

**Cost per 3-min call:**
- Creator: ~$0.36
- Pro: ~$0.30
- Scale: ~$0.24

---

## Limitations vs Vapi

| Feature | ElevenLabs | Vapi |
|---------|------------|------|
| Latency | 800-1000ms | 500-700ms |
| Call transfer | Limited | Yes |
| SMS | No | Yes |
| n8n integration | Webhooks | Native node |
| Cost/min | Higher | Lower |

---

## Troubleshooting

### Voice Sounds Robotic
- Check you're using eleven_turbo_v2_5
- Adjust stability to 0.5
- Try different voice (Josh instead of Rachel)

### Webhook Not Working
- Verify URL is publicly accessible
- Check n8n workflow is active
- Test webhook manually

### Calls Not Connecting
- Verify phone number format (+1XXXXXXXXXX)
- Check ElevenLabs has phone enabled
- Confirm account has credits

### Slow Responses
- Use turbo model
- Shorten system prompt
- Reduce max tokens

---

## Next Steps

1. Run 10 test calls
2. Review recordings
3. Adjust prompt based on feedback
4. Consider upgrading to Vapi for lower costs at scale
