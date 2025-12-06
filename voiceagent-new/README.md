# Voice Agent for Recruitment - Candidate Reactivation System

A complete AI voice agent system for recruitment agencies to reconnect with candidates from old databases. Supports **two platforms**: Vapi (recommended) or ElevenLabs.

## What This System Does

1. **Automatically calls candidates** who previously applied but weren't placed
2. **Has natural conversations** - asks about availability, salary expectations, location
3. **Collects key information** and updates your database in real-time
4. **Alerts recruiters** immediately when hot leads are found
5. **TCPA compliant** - respects calling hours, opt-outs, and DNC lists

---

## Choose Your Platform

| Feature | Vapi + ElevenLabs (Recommended) | ElevenLabs Only |
|---------|--------------------------------|-----------------|
| **Cost/min** | $0.06-0.08 | $0.08-0.12 |
| **Latency** | ~500-700ms (faster) | ~800-1000ms |
| **Voice Quality** | Excellent (ElevenLabs) | Excellent |
| **n8n Integration** | Native node | Webhooks |
| **Setup Time** | 45 min | 30 min |
| **Flexibility** | High | Medium |

**Recommendation:** Use **Vapi + ElevenLabs voices** for best value and performance.

---

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Airtable   │────►│    n8n      │────►│ Vapi/11Labs │────►│   Phone     │
│ (Database)  │     │ (Workflow)  │     │ (Voice AI)  │     │   Call      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ▲                   │                    │
       │                   │                    │
       └───────────────────┴────────────────────┘
                    (Webhook: Results)
```

---

## Quick Start

### Prerequisites
- Airtable account (free works)
- n8n instance (self-hosted or cloud)
- Vapi account OR ElevenLabs account

### Choose Your Setup Guide:

| Platform | Guide | Best For |
|----------|-------|----------|
| **Vapi + ElevenLabs** | [VAPI_SETUP.md](VAPI_SETUP.md) | Best value, fastest |
| **ElevenLabs Only** | [ELEVENLABS_SETUP.md](ELEVENLABS_SETUP.md) | Simplest setup |

---

## Files in This Repository

| File | Description |
|------|-------------|
| `README.md` | This overview |
| `AIRTABLE_SCHEMA.md` | Database structure for Airtable |
| `VAPI_SETUP.md` | Complete Vapi + ElevenLabs setup guide |
| `VAPI_AGENT_CONFIG.md` | Vapi agent prompt and configuration |
| `ELEVENLABS_SETUP.md` | ElevenLabs-only setup guide |
| `ELEVENLABS_AGENT_PROMPT.md` | ElevenLabs agent prompt |
| `n8n-vapi-workflow.json` | n8n workflow for Vapi |
| `n8n-elevenlabs-workflow.json` | n8n workflow for ElevenLabs |
| `QUICK_START.md` | 30-minute setup checklist |

---

## Cost Comparison (100 calls/month, 3 min avg)

| Setup | Monthly Cost | Per Call |
|-------|--------------|----------|
| Vapi + ElevenLabs | ~$20-25 | ~$0.20 |
| ElevenLabs Only | ~$25-35 | ~$0.30 |
| Vapi + PlayHT | ~$15-20 | ~$0.15 |

---

## Features

### Call Management
- Automatic scheduling during business hours (8am-9pm)
- Smart retry logic for no-answers (up to 3 attempts)
- Do Not Call list management
- Call recording and transcripts

### Data Collection
- Current employment status
- Availability to start
- Salary expectations
- Location/remote preference
- Updated skills

### Recruiter Alerts
- Instant email for hot leads (interest level 4-5)
- Call summary with transcript
- One-click access to recording
- Direct link to Airtable record

### Compliance (USA - TCPA)
- Business hours enforcement
- Easy opt-out on every call
- Recording disclosure for 2-party states
- Consent tracking

---

## Sample Conversation Flow

```
Agent: "Hi, is this John?"

John: "Yes, who's this?"

Agent: "Hey John, this is Alex from TechTalent Recruiters. We worked
        together a while back when you were looking for software
        developer positions. I'm calling because we have some exciting
        opportunities that might be a great fit. Are you currently
        open to new opportunities?"

John: "Yeah, I might be interested. What do you have?"

Agent: "Great! We're working with TechCorp who's looking for a Senior
        Software Engineer. It's fully remote and the salary range is
        $120,000 to $150,000. Does that sound interesting?"

John: "That sounds good. I'd need to give 2 weeks notice though."

Agent: "Perfect. And what salary range are you targeting?"

John: "Around $130k would be ideal."

Agent: "Got it. I'll pass your info to our recruitment team and they'll
        reach out within 24-48 hours. Thanks for your time, John!"
```

---

## Support

- **Vapi Docs**: [docs.vapi.ai](https://docs.vapi.ai)
- **ElevenLabs Docs**: [docs.elevenlabs.io](https://docs.elevenlabs.io)
- **n8n Docs**: [docs.n8n.io](https://docs.n8n.io)
- **Airtable API**: [airtable.com/developers](https://airtable.com/developers)

---

## Version

- **v2.0.0** - Added Vapi support, improved prompts, better n8n integration
