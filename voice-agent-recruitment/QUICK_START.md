# Quick Start Guide - Voice Agent Recruitment

Get your voice agent up and running in 30 minutes.

---

## Step 1: Airtable Setup (5 min)

1. Go to [airtable.com](https://airtable.com) and create new base
2. Create **Candidates** table with these fields:
   - `Full Name` (Text)
   - `Phone Number` (Phone) - **Required, +1 format**
   - `Email` (Email)
   - `Previous Role Applied` (Text)
   - `Niche/Industry` (Single Select: IT, Healthcare, Finance, etc.)
   - `Call Status` (Single Select: New, Pending Call, In Progress, Completed - Interested, etc.)
   - `Call Attempts` (Number)
   - `Do Not Call` (Checkbox)

3. Create **Call Records** table with:
   - `Candidate` (Link to Candidates)
   - `Call Date Time` (Date Time)
   - `Call Outcome` (Single Select)
   - `Recording URL` (URL)
   - `Transcript` (Long Text)
   - `Interest Level` (Single Select: 1-5)

4. Get your API token: [airtable.com/create/tokens](https://airtable.com/create/tokens)

---

## Step 2: ElevenLabs Setup (10 min)

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Go to **Conversational AI** > **Create Agent**
3. Configure:
   - **Name**: RecruitConnect
   - **Voice**: Rachel (or Josh)
   - **Model**: Turbo v2.5

4. **Paste this system prompt:**

```
You are Alex, a friendly recruitment coordinator calling on behalf of {{agency_name}}.

When the call connects, start with: "Hi, is this {{candidate_name}}?"

If yes: "Hey {{candidate_name}}, this is Alex from {{agency_name}}. We worked together a while back when you applied for {{previous_role}} positions. I'm calling because we have some exciting opportunities in {{niche}} that might be perfect for you. Are you currently open to new opportunities?"

If interested, ask:
1. "Are you currently employed or actively looking?"
2. "If the right opportunity came along, how quickly could you start?"
3. "What salary range are you targeting?"
4. "Are you looking for remote, hybrid, or onsite?"
5. "Any new skills you've picked up recently?"

If not interested: "No problem! Can I keep you on file for future opportunities?"

Always be warm, professional, and respect their time. If they want to opt out, say "I'll remove you from our list right away."
```

5. **Phone Setup**:
   - Go to Agent Settings > Phone
   - Connect Twilio or use ElevenLabs phone
   - Add your webhook: `https://your-n8n.com/webhook/elevenlabs-call-complete`

6. Copy your **Agent ID** from settings

---

## Step 3: n8n Setup (10 min)

1. Import `n8n-voice-agent-workflow.json`

2. Create credentials:
   - **Airtable Token API**: Your token
   - **HTTP Header Auth**: Name=`xi-api-key`, Value=Your ElevenLabs key

3. Replace placeholders:
   - `YOUR_BASE_ID` → Airtable base ID (from URL)
   - `YOUR_ELEVENLABS_AGENT_ID` → agent_xxxxxx
   - `YOUR_N8N_WEBHOOK_URL` → https://your-n8n.com
   - `YOUR_AGENCY_NAME` → Your company name

4. Activate workflow!

---

## Step 4: Test It (5 min)

1. Add a test candidate to Airtable:
   - Name: Your Name
   - Phone: Your phone number
   - Call Status: "Pending Call"
   - Niche/Industry: IT (or your niche)

2. Manually trigger the workflow in n8n

3. Answer the call and have a test conversation

4. Check that Airtable updates with results

---

## You're Live!

The system will now:
- Check for "Pending Call" candidates every hour
- Make calls during business hours (8am-9pm)
- Update Airtable with results
- Email you when hot leads are found

---

## Key Things to Remember

| Do | Don't |
|----|-------|
| Keep calls under 5 minutes | Pressure candidates |
| Offer opt-out every call | Call before 8am or after 9pm |
| Update your job listings | Call opted-out numbers |
| Review recordings regularly | Share recordings externally |

---

## Cost Breakdown

| Service | Starter Budget |
|---------|---------------|
| ElevenLabs Creator | $22/mo |
| Airtable Free | $0 |
| n8n Self-hosted | $0 |
| **Total** | **$22/mo** |

~100 calls included. Each additional call ~$0.30

---

## Need Help?

- Full docs: See `README.md`
- Database schema: See `AIRTABLE_SCHEMA.md`
- Agent prompt: See `ELEVENLABS_AGENT_PROMPT.md`
