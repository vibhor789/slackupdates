# Voice Agent for Recruitment Database Reactivation

A complete solution for recruitment agencies to reconnect with candidates using AI voice agents powered by ElevenLabs, automated through n8n, with Airtable as the database.

## What This System Does

1. **Automatically calls candidates** from your database who previously applied but weren't placed
2. **Has natural conversations** asking about their current status, availability, and interest
3. **Collects key information**: employment status, salary expectations, location preference, updated skills
4. **Updates your database** in real-time with call outcomes
5. **Alerts recruiters** immediately when a hot lead is identified
6. **Respects compliance**: TCPA-compliant calling hours, easy opt-out, DNC list management

---

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    Airtable     │────▶│       n8n        │────▶│   ElevenLabs    │
│  (Candidates)   │     │  (Orchestrator)  │     │  (Voice Agent)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        ▲                        │                        │
        │                        │                        │
        └────────────────────────┴────────────────────────┘
                    (Webhook: Call Results)
```

---

## Quick Start (30 Minutes Setup)

### Prerequisites
- n8n instance (self-hosted or cloud)
- Airtable account (free tier works)
- ElevenLabs account with Conversational AI access

### Step 1: Set Up Airtable (10 min)

1. Create a new base named "Recruitment Voice Agent"
2. Follow the schema in `AIRTABLE_SCHEMA.md`
3. Create these tables:
   - **Candidates** - Your candidate database
   - **Call Records** - Call history and outcomes
   - **Recruiters** - Your team members
   - **Client Requirements** - Active job openings
   - **Call Campaigns** - Campaign tracking

4. Generate an API token:
   - Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
   - Create token with `data.records:read` and `data.records:write` scopes
   - Save the token securely

### Step 2: Set Up ElevenLabs (10 min)

1. **Create Account**
   - Go to [elevenlabs.io](https://elevenlabs.io)
   - Sign up and choose a plan with Conversational AI access
   - Recommended: Creator plan ($22/mo) or higher

2. **Create Conversational AI Agent**
   - Navigate to Conversational AI in the dashboard
   - Click "Create Agent"
   - Name it "RecruitConnect"

3. **Configure the Agent**
   - **System Prompt**: Copy the full prompt from `ELEVENLABS_AGENT_PROMPT.md`
   - **Voice**: Select "Rachel" or "Josh"
   - **Model**: Turbo v2.5 (lowest latency)
   - **First Message**: Leave blank (we'll set dynamically)

4. **Set Up Phone Integration**
   - Go to Agent Settings > Phone
   - Connect your Twilio account OR use ElevenLabs' built-in phone
   - Configure your outbound caller ID

5. **Configure Webhooks**
   - In Agent Settings > Webhooks
   - Add your n8n webhook URL: `https://your-n8n.com/webhook/elevenlabs-call-complete`
   - Enable "Call Completed" webhook

6. **Copy Your Agent ID**
   - Found in Agent Settings
   - Format: `agent_xxxxxxxxxxxx`

### Step 3: Set Up n8n (10 min)

1. **Import the Workflow**
   - Open n8n
   - Go to Workflows > Import
   - Import `n8n-voice-agent-workflow.json`

2. **Configure Credentials**

   Create these credentials in n8n:

   **Airtable Token API**
   - Name: "Airtable API Token"
   - Token: Your Airtable personal access token

   **HTTP Header Auth (ElevenLabs)**
   - Name: "ElevenLabs API Key"
   - Header Name: `xi-api-key`
   - Header Value: Your ElevenLabs API key

   **SMTP (for email notifications)**
   - Configure your email service

3. **Update Workflow Variables**

   Search and replace these placeholders in the workflow:
   - `YOUR_BASE_ID` → Your Airtable base ID
   - `YOUR_ELEVENLABS_AGENT_ID` → Your agent ID
   - `YOUR_N8N_WEBHOOK_URL` → Your n8n instance URL
   - `YOUR_AGENCY_NAME` → Your agency name
   - `YOUR_CALLBACK_NUMBER` → Your phone number

4. **Activate the Workflow**
   - Toggle the workflow to active
   - The scheduler will start checking for candidates hourly

---

## Detailed Configuration

### Customizing the Voice Agent Prompt

The prompt in `ELEVENLABS_AGENT_PROMPT.md` includes:

1. **Personality traits** - Warm, professional, not pushy
2. **Conversation flow** - Natural opening, qualifying, information gathering
3. **Objection handling** - Responses for common pushback
4. **Data collection** - What information to capture
5. **Compliance** - TCPA guidelines, opt-out handling

**To customize for different niches:**

```
// In the n8n "Prepare Call Data" node, modify the dynamic_variables:

const dynamicVariables = {
  // Change agency name
  agency_name: 'HealthStaff Recruiters',

  // Niche-specific opening
  niche: 'healthcare',

  // Different job details
  job_title: 'Registered Nurse',
  company_name: 'General Hospital',
  job_location: 'Chicago, IL',
  salary_range: '$75,000 - $95,000',

  // Custom callback
  callback_number: '(312) 555-1234'
};
```

### Multiple Niches Configuration

For agencies handling multiple industries, the system automatically:
1. Reads the candidate's niche from Airtable
2. Fetches matching job requirements
3. Customizes the pitch accordingly

**Example niches to set up:**
- IT / Technology
- Healthcare / Medical
- Finance / Accounting
- Engineering
- Sales / Marketing
- Administrative
- Skilled Trades

### Call Scheduling Logic

The workflow includes smart scheduling:

```javascript
// Business hours check (TCPA compliance)
if ($now.hour >= 8 && $now.hour < 20) {
  // Safe to call
}

// Retry logic for no-answers
if (callAttempts < 3 && lastCallOutcome === 'no_answer') {
  nextCallDate = now + 24 hours;
}

// Never call opted-out candidates
if (doNotCall === true) {
  skip;
}
```

---

## API Endpoints

### Manual Call Trigger
Trigger a single call via API:

```bash
curl -X POST https://your-n8n.com/webhook/manual-call-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "rec123abc"
  }'
```

### Bulk Call Trigger
Queue multiple candidates:

```bash
curl -X POST https://your-n8n.com/webhook/bulk-call-trigger \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_ids": ["rec123", "rec456", "rec789"],
    "campaign_id": "camp001"
  }'
```

---

## Cost Estimation

### ElevenLabs Pricing (as of 2024)

| Plan | Monthly Cost | Included Minutes | Extra Per Minute |
|------|-------------|------------------|------------------|
| Creator | $22 | ~100 min | $0.30 |
| Pro | $99 | ~500 min | $0.24 |
| Scale | $330 | ~2000 min | $0.18 |

**Average call duration**: 2-3 minutes
**Calls per $100**: ~300-400 calls (Pro plan)

### Airtable Pricing

| Plan | Monthly Cost | Records |
|------|-------------|---------|
| Free | $0 | 1,000 per base |
| Plus | $10/user | 5,000 per base |
| Pro | $20/user | 50,000 per base |

### n8n Pricing

| Plan | Monthly Cost | Executions |
|------|-------------|------------|
| Self-hosted | $0 (hosting costs) | Unlimited |
| Cloud Starter | $20 | 2,500 |
| Cloud Pro | $50 | 10,000 |

### Total Monthly Cost Example

For 500 calls/month:
- ElevenLabs Pro: $99
- Airtable Plus: $10
- n8n Cloud Starter: $20
- **Total: ~$129/month**

Cost per placed candidate (if 5% conversion): ~$2.58/lead

---

## Compliance Checklist (USA - TCPA)

- [ ] Only call between 8am-9pm local time
- [ ] Have prior express consent from original application
- [ ] Provide easy opt-out option on every call
- [ ] Maintain internal Do Not Call list
- [ ] Check against National DNC Registry (if applicable)
- [ ] Display accurate caller ID
- [ ] Keep records of consent for 5 years
- [ ] Two-party consent states: Add recording disclosure

**Two-party consent states** (require disclosure):
California, Connecticut, Delaware, Florida, Illinois, Maryland, Massachusetts, Michigan, Montana, Nevada, New Hampshire, Oregon, Pennsylvania, Vermont, Washington

---

## Troubleshooting

### Call Not Initiating
1. Check ElevenLabs API key is valid
2. Verify phone number format (+1XXXXXXXXXX)
3. Confirm agent ID is correct
4. Check ElevenLabs account has credits

### Webhook Not Receiving Data
1. Verify webhook URL is publicly accessible
2. Check n8n workflow is active
3. Confirm webhook path matches: `/webhook/elevenlabs-call-complete`
4. Test with manual webhook trigger

### Airtable Not Updating
1. Verify API token has write permissions
2. Check base ID and table names match exactly
3. Confirm field names match (case-sensitive)
4. Check for rate limiting (5 requests/second)

### Poor Call Quality
1. Increase ElevenLabs stability setting
2. Use higher-quality voice model
3. Shorten response length in prompt
4. Check for background noise issues

---

## Files in This Package

| File | Description |
|------|-------------|
| `README.md` | This setup guide |
| `AIRTABLE_SCHEMA.md` | Complete database structure |
| `ELEVENLABS_AGENT_PROMPT.md` | Voice agent system prompt |
| `n8n-voice-agent-workflow.json` | n8n workflow to import |
| `QUICK_START.md` | Condensed setup instructions |

---

## Support & Resources

- **ElevenLabs Docs**: [docs.elevenlabs.io](https://docs.elevenlabs.io)
- **n8n Docs**: [docs.n8n.io](https://docs.n8n.io)
- **Airtable API**: [airtable.com/developers](https://airtable.com/developers)

---

## Version History

- **v1.0.0** - Initial release with full outbound calling system
