# Vapi + ElevenLabs Setup Guide

Complete setup guide for the recommended configuration: Vapi for orchestration + ElevenLabs for voice quality.

## Why Vapi + ElevenLabs?

| Benefit | Details |
|---------|---------|
| **Faster responses** | 500-700ms vs 800-1000ms |
| **Lower cost** | ~$0.06-0.08/min vs $0.12/min |
| **Best voices** | ElevenLabs voice quality |
| **Native n8n** | Official Vapi node in n8n |
| **More features** | Call transfer, SMS, voicemail detection |

---

## Step 1: Create Accounts (5 min)

### Vapi Account
1. Go to [vapi.ai](https://vapi.ai)
2. Click "Get Started" → Sign up
3. You get **$10 free credits** (about 150 minutes)
4. Go to Dashboard → **API Keys** → Copy your API key

### ElevenLabs Account
1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up for **Creator plan** ($22/mo) or start with free
3. Go to Profile → **API Keys** → Copy your API key

### Airtable Account
1. Go to [airtable.com](https://airtable.com)
2. Create account (free tier works)
3. Follow `AIRTABLE_SCHEMA.md` to set up your base
4. Get API token from [airtable.com/create/tokens](https://airtable.com/create/tokens)

---

## Step 2: Connect ElevenLabs to Vapi (5 min)

1. In Vapi Dashboard → **Provider Keys**
2. Click **Add Provider Key**
3. Select **ElevenLabs**
4. Paste your ElevenLabs API key
5. Click **Save**

Now Vapi can use ElevenLabs voices!

---

## Step 3: Create Vapi Assistant (15 min)

### 3.1 Create New Assistant

1. Go to Vapi Dashboard → **Assistants**
2. Click **Create Assistant**
3. Name it: `RecruitConnect`

### 3.2 Configure Voice

1. In Assistant settings → **Voice**
2. Provider: **ElevenLabs**
3. Voice: **Rachel** (or Josh for male)
4. Model: **eleven_turbo_v2_5** (fastest)

Settings:
```
Stability: 0.5
Similarity Boost: 0.75
Style: 0.3
```

### 3.3 Configure Transcriber

1. Go to **Transcriber** settings
2. Provider: **Deepgram**
3. Model: **nova-2** (best accuracy)
4. Language: **en-US**

### 3.4 Configure Model (LLM)

1. Go to **Model** settings
2. Provider: **OpenAI** (or Anthropic)
3. Model: **gpt-4o-mini** (fast + cheap) or **gpt-4o** (better)
4. Temperature: **0.7**
5. Max Tokens: **150**

### 3.5 Add System Prompt

Copy this into the **System Prompt** field:

```
You are Alex, a friendly recruitment coordinator calling on behalf of {{agency_name}}. You're reconnecting with candidates who previously applied.

## YOUR PERSONALITY
- Warm, professional, genuinely helpful
- Conversational and natural - never robotic
- Respectful of time - get to the point
- Empathetic - job searching can be stressful
- Positive but never pushy

## CONTEXT (from variables)
- Candidate: {{candidate_name}}
- Previous Role: {{previous_role}}
- Current Opportunity: {{job_title}} at {{company_name}}
- Location: {{job_location}}
- Salary: {{salary_range}}

## CONVERSATION FLOW

1. OPENING: "Hi, is this {{candidate_name}}?"

2. IF YES: "Hey {{candidate_name}}, this is Alex from {{agency_name}}. We worked together when you applied for {{previous_role}} positions. I'm calling because we have some exciting opportunities. Are you open to hearing about them?"

3. IF INTERESTED, share the opportunity then ask:
   - "Are you currently employed or actively looking?"
   - "How quickly could you start if the right role came along?"
   - "What salary range are you targeting?"
   - "Looking for remote, hybrid, or onsite?"
   - "Any new skills you've picked up recently?"

4. CLOSING IF INTERESTED: "Great! Our team will reach out within 24-48 hours. Thanks for your time!"

5. IF NOT INTERESTED: "No problem! Should I keep you on file for future opportunities?"

6. IF OPT-OUT: "I'll remove you from our list right away. Have a great day!"

## RULES
- Never be pushy - respect "no"
- Always offer opt-out option
- If asked "are you AI?" - be honest: "Yes, I'm an AI assistant helping the recruitment team"
- Keep responses short (1-2 sentences)
- Don't ask for sensitive info (SSN, bank details)

## DATA TO COLLECT
Track these for the webhook:
- call_outcome: interested/not_interested/callback/opted_out
- employment_status: employed_looking/employed_not_looking/unemployed
- availability: immediate/2_weeks/1_month/not_available
- salary_expectation: number or range
- location_preference: remote/hybrid/onsite
- interest_level: 1-5
```

### 3.6 Configure First Message

Set the **First Message** to:
```
Hi, is this {{candidate_name}}?
```

### 3.7 Set Up End Call Phrases

In **Advanced** settings, add end call phrases:
- "goodbye"
- "bye"
- "have a good day"
- "thanks, bye"

### 3.8 Configure Analysis (Important!)

In **Analysis** settings, add this schema to extract call data:

```json
{
  "call_outcome": {
    "type": "string",
    "description": "Result of call: interested, not_interested, callback, no_answer, opted_out"
  },
  "employment_status": {
    "type": "string",
    "description": "Current employment: employed_looking, employed_not_looking, unemployed_looking, freelancing"
  },
  "availability": {
    "type": "string",
    "description": "When can start: immediate, 2_weeks, 1_month, 2_3_months, not_available"
  },
  "salary_expectation": {
    "type": "string",
    "description": "Desired salary range mentioned"
  },
  "location_preference": {
    "type": "string",
    "description": "Work location: remote, hybrid, onsite, flexible"
  },
  "updated_skills": {
    "type": "string",
    "description": "Any new skills or certifications mentioned"
  },
  "interest_level": {
    "type": "number",
    "description": "Interest level 1-5, where 5 is very interested"
  },
  "follow_up_notes": {
    "type": "string",
    "description": "Any important notes for recruiter follow-up"
  },
  "callback_requested": {
    "type": "boolean",
    "description": "Did they request a callback?"
  },
  "callback_time": {
    "type": "string",
    "description": "If callback requested, when?"
  }
}
```

### 3.9 Save and Copy Assistant ID

1. Click **Save**
2. Copy the **Assistant ID** (format: `asst_xxxxxxxxxxxx`)

---

## Step 4: Set Up Phone Number (5 min)

### Option A: Vapi Phone Number (Easiest)

1. Go to Vapi Dashboard → **Phone Numbers**
2. Click **Buy Number**
3. Select country: **United States**
4. Choose area code (match your candidates' region)
5. Click **Purchase** (~$1.50/month)
6. Assign to your assistant

### Option B: Bring Your Own Twilio (More Control)

1. In Vapi → **Phone Numbers** → **Import**
2. Enter your Twilio credentials
3. Import existing number

---

## Step 5: Set Up n8n Workflow (15 min)

### 5.1 Add Vapi Credentials in n8n

1. In n8n → **Credentials** → **Add Credential**
2. Search for **Vapi**
3. Enter your Vapi API key
4. Save

### 5.2 Add Airtable Credentials

1. **Credentials** → **Add Credential**
2. Search for **Airtable**
3. Enter your Personal Access Token
4. Save

### 5.3 Import Workflow

1. Go to **Workflows** → **Import**
2. Import `n8n-vapi-workflow.json`
3. Connect your credentials to each node

### 5.4 Update Variables

Find and replace these in the workflow:
- `YOUR_VAPI_ASSISTANT_ID` → Your assistant ID
- `YOUR_AIRTABLE_BASE_ID` → Your base ID
- `YOUR_AGENCY_NAME` → Your agency name
- `YOUR_CALLBACK_NUMBER` → Your phone number

### 5.5 Set Up Webhook

1. Find the **Webhook** node in the workflow
2. Copy the webhook URL
3. In Vapi Dashboard → Your Assistant → **Server URL**
4. Paste the webhook URL
5. Enable **End of Call Report**

---

## Step 6: Test Your Setup (5 min)

### Test Call to Yourself

1. Add yourself as a test candidate in Airtable:
   - Name: Your Name
   - Phone: Your phone number
   - Call Status: "Pending Call"
   - Niche: IT (or your test niche)

2. In Vapi Dashboard → Your Assistant → **Test**
3. Click **Make Outbound Call**
4. Enter your phone number
5. Answer and have a test conversation

### Verify Data Flow

1. After the test call, check:
   - [ ] Airtable: New record in Call Records
   - [ ] Airtable: Candidate status updated
   - [ ] n8n: Webhook received data
   - [ ] Recording available in Vapi dashboard

---

## Step 7: Go Live

1. **Activate n8n workflow** - Toggle to active
2. **Set candidates to "Pending Call"** in Airtable
3. **Monitor first few calls** in Vapi dashboard
4. **Adjust prompt** based on real conversations

---

## Vapi Pricing Breakdown

| Component | Cost |
|-----------|------|
| Vapi Platform | $0.05/min |
| ElevenLabs Voice | $0.02-0.03/min |
| Deepgram STT | ~$0.01/min |
| OpenAI GPT-4o-mini | ~$0.005/min |
| **Total** | **~$0.08/min** |

Phone costs (additional):
- Vapi number: $1.50/month + $0.01/min
- Or use Twilio: $1.15/month + $0.014/min

---

## Troubleshooting

### Call Not Connecting
- Check phone number format (+1XXXXXXXXXX)
- Verify Vapi has phone number assigned
- Check Vapi account has credits

### Voice Sounds Robotic
- Ensure ElevenLabs is selected as voice provider
- Check API key is valid
- Try different voice (Rachel usually best)

### Webhook Not Receiving
- Verify webhook URL is correct in Vapi
- Check n8n workflow is active
- Test webhook manually with Postman

### Slow Responses
- Switch to gpt-4o-mini (faster than gpt-4o)
- Use eleven_turbo_v2_5 voice model
- Shorten system prompt

---

## Next Steps

- [ ] Test with 10 real candidates
- [ ] Review recordings and adjust prompt
- [ ] Set up recruiter email notifications
- [ ] Create different assistants for different niches
- [ ] Scale up calling volume
