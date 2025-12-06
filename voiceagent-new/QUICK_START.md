# Quick Start - Voice Agent Recruitment

Get your AI voice agent calling candidates in 30-45 minutes.

---

## Choose Your Path

| Path | Time | Cost | Best For |
|------|------|------|----------|
| **A: Vapi + ElevenLabs** | 45 min | ~$0.08/min | Best value |
| **B: ElevenLabs Only** | 30 min | ~$0.12/min | Simplest |

---

## Path A: Vapi + ElevenLabs (Recommended)

### Step 1: Create Accounts (5 min)

- [ ] **Vapi**: [vapi.ai](https://vapi.ai) - Get $10 free credits
- [ ] **ElevenLabs**: [elevenlabs.io](https://elevenlabs.io) - Creator $22/mo
- [ ] **Airtable**: [airtable.com](https://airtable.com) - Free works

### Step 2: Set Up Airtable (10 min)

Create **Candidates** table:
```
Full Name        | Text
Phone Number     | Phone (+1 format)
Email            | Email
Previous Role    | Text
Niche/Industry   | Single Select (IT, Healthcare, Finance...)
Call Status      | Single Select (New, Pending Call, Completed...)
Call Attempts    | Number (default 0)
Do Not Call      | Checkbox
```

Create **Call Records** table:
```
Candidate        | Link to Candidates
Call Date Time   | DateTime
Call Outcome     | Single Select
Recording URL    | URL
Transcript       | Long Text
Interest Level   | Single Select (1-5)
```

Get API token: [airtable.com/create/tokens](https://airtable.com/create/tokens)

### Step 3: Connect ElevenLabs to Vapi (2 min)

1. Vapi Dashboard → **Provider Keys**
2. Add **ElevenLabs** → Paste API key

### Step 4: Create Vapi Assistant (10 min)

1. Vapi → **Assistants** → **Create**
2. Voice: **ElevenLabs** → **Rachel**
3. Model: **gpt-4o-mini**
4. Paste system prompt from `VAPI_SETUP.md`
5. Save → Copy **Assistant ID**

### Step 5: Get Phone Number (2 min)

1. Vapi → **Phone Numbers** → **Buy**
2. Select US → Choose area code
3. Assign to assistant

### Step 6: Set Up n8n (10 min)

1. Import `n8n-vapi-workflow.json`
2. Add credentials (Vapi, Airtable)
3. Replace placeholders:
   - `YOUR_VAPI_ASSISTANT_ID`
   - `YOUR_AIRTABLE_BASE_ID`
   - `YOUR_AGENCY_NAME`
4. Copy webhook URL → Add to Vapi assistant
5. Activate workflow

### Step 7: Test (5 min)

1. Add yourself to Airtable (Call Status: "Pending Call")
2. Vapi → Test → Make outbound call to yourself
3. Verify Airtable updates after call

**Done! Your voice agent is live.**

---

## Path B: ElevenLabs Only (Simpler)

### Step 1: Create Accounts (3 min)

- [ ] **ElevenLabs**: Creator plan $22/mo
- [ ] **Airtable**: Free tier

### Step 2: Set Up Airtable (10 min)

Same as Path A above.

### Step 3: Create ElevenLabs Agent (10 min)

1. ElevenLabs → **Conversational AI** → **Create Agent**
2. Name: RecruitConnect
3. Voice: Rachel
4. Model: Turbo v2.5
5. Paste prompt from `ELEVENLABS_AGENT_PROMPT.md`
6. Enable Phone
7. Copy **Agent ID**

### Step 4: Set Up n8n (10 min)

1. Import `n8n-elevenlabs-workflow.json`
2. Add credentials
3. Replace placeholders
4. Add webhook URL to ElevenLabs
5. Activate

### Step 5: Test (5 min)

Same as Path A.

---

## Checklist Before Going Live

- [ ] Test call to your own phone
- [ ] Verify Airtable updates correctly
- [ ] Check recording is saved
- [ ] Test opt-out ("remove me from list")
- [ ] Test "are you a robot?" response
- [ ] Set up recruiter email notifications

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Call doesn't connect | Check phone format (+1XXXXXXXXXX) |
| No webhook data | Verify URL, check n8n is active |
| Robotic voice | Ensure ElevenLabs is voice provider |
| Slow responses | Use gpt-4o-mini, turbo voice model |

---

## Cost Calculator

| Calls/Month | Vapi+ElevenLabs | ElevenLabs Only |
|-------------|-----------------|-----------------|
| 50 | ~$12 | ~$18 |
| 100 | ~$24 | ~$36 |
| 300 | ~$72 | ~$108 |
| 500 | ~$120 | ~$180 |

*Based on 3 min average call*

---

## Next Steps

1. Run 10 test calls with real candidates
2. Review recordings, adjust prompt
3. Scale up gradually
4. Set up different niches if needed
