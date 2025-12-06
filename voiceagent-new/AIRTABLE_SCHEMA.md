# Airtable Schema for Voice Agent Recruitment System

## Overview
This schema is designed for recruitment agencies to manage candidate reactivation calls using an AI voice agent.

---

## Base Structure: "Recruitment Voice Agent"

### Table 1: Candidates (Main Table)

| Field Name | Field Type | Description | Options/Formula |
|------------|------------|-------------|-----------------|
| `Candidate ID` | Auto Number | Unique identifier | Prefix: CND- |
| `Full Name` | Single Line Text | Candidate's full name | Required |
| `Phone Number` | Phone Number | Primary contact (US format) | Required, +1 format |
| `Email` | Email | Candidate email | Optional |
| `Original Application Date` | Date | When they first applied | - |
| `Previous Role Applied` | Single Line Text | What they applied for before | - |
| `Skills` | Multiple Select | Their known skills | Customizable |
| `Last Known Salary` | Currency | Previous salary info | USD |
| `Last Known Location` | Single Line Text | City, State | - |
| `Recruiter Assigned` | Link to Recruiters | Which recruiter owns this | Link to Recruiters table |
| `Niche/Industry` | Single Select | Industry category | IT, Healthcare, Finance, etc. |
| `Call Status` | Single Select | Current status in pipeline | See options below |
| `Call Attempts` | Number | How many times called | Default: 0 |
| `Last Call Date` | Date & Time | When last attempted | - |
| `Next Call Date` | Date & Time | Scheduled retry | - |
| `Do Not Call` | Checkbox | Opted out | Default: unchecked |
| `Notes` | Long Text | General notes | - |
| `Created Date` | Created Time | Auto-generated | - |
| `Call Records` | Link to Call Records | All calls for this candidate | Link to Call Records |

**Call Status Options:**
- `New` - Never called
- `Pending Call` - Queued for calling
- `In Progress` - Currently being called
- `Completed - Interested` - Spoke, wants opportunity
- `Completed - Not Interested` - Spoke, declined
- `Completed - Not Available` - Spoke, not looking
- `No Answer` - Didn't pick up
- `Voicemail Left` - Left a message
- `Wrong Number` - Number invalid
- `Call Back Later` - Requested callback
- `Do Not Call` - Opted out

---

### Table 2: Call Records (Call History)

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `Call ID` | Auto Number | Unique call identifier |
| `Candidate` | Link to Candidates | Who was called |
| `Call Date Time` | Date & Time | When call happened |
| `Call Duration` | Duration | Length of call |
| `Call Outcome` | Single Select | Result of call |
| `Recording URL` | URL | Link to call recording |
| `Transcript` | Long Text | Full conversation transcript |
| `Employment Status` | Single Select | Current employment |
| `Availability` | Single Select | When can they start |
| `Expected Salary` | Currency | What they want |
| `Preferred Location` | Single Line Text | Where they want to work |
| `Remote Preference` | Single Select | Remote/Hybrid/Onsite |
| `Updated Skills` | Long Text | Skills mentioned in call |
| `Interest Level` | Single Select | How interested (1-5) |
| `Follow Up Required` | Checkbox | Needs recruiter attention |
| `Follow Up Notes` | Long Text | What to follow up on |
| `Sentiment` | Single Select | Call sentiment |
| `Recruiter` | Link to Recruiters | Assigned recruiter |
| `ElevenLabs Call ID` | Single Line Text | External reference |

**Call Outcome Options:**
- `Interested - Ready Now`
- `Interested - Available Later`
- `Not Interested - Employed`
- `Not Interested - Other`
- `Call Back Requested`
- `No Answer`
- `Voicemail`
- `Wrong Number`
- `Opted Out`

**Employment Status Options:**
- `Currently Employed - Looking`
- `Currently Employed - Not Looking`
- `Unemployed - Actively Looking`
- `Unemployed - Not Looking`
- `Freelancing/Consulting`
- `Unknown`

**Availability Options:**
- `Immediately`
- `2 Weeks Notice`
- `1 Month Notice`
- `2-3 Months`
- `Not Available`
- `Unknown`

**Remote Preference Options:**
- `Remote Only`
- `Hybrid`
- `Onsite Only`
- `Flexible`

**Interest Level Options:**
- `5 - Very Interested`
- `4 - Interested`
- `3 - Somewhat Interested`
- `2 - Not Very Interested`
- `1 - Not Interested`

**Sentiment Options:**
- `Very Positive`
- `Positive`
- `Neutral`
- `Negative`
- `Very Negative`

---

### Table 3: Recruiters

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `Recruiter ID` | Auto Number | Unique identifier |
| `Name` | Single Line Text | Recruiter name |
| `Email` | Email | For notifications |
| `Phone` | Phone Number | Contact number |
| `Niche/Specialty` | Multiple Select | Industries they handle |
| `Active` | Checkbox | Currently active |
| `Candidates` | Link to Candidates | Their candidates |
| `Notification Preferences` | Multiple Select | How to notify |

---

### Table 4: Client Requirements (Job Openings)

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `Requirement ID` | Auto Number | Unique identifier |
| `Job Title` | Single Line Text | Position name |
| `Client Company` | Single Line Text | Hiring company |
| `Niche/Industry` | Single Select | Industry category |
| `Required Skills` | Multiple Select | Must-have skills |
| `Experience Level` | Single Select | Junior/Mid/Senior |
| `Salary Range Min` | Currency | Minimum salary |
| `Salary Range Max` | Currency | Maximum salary |
| `Location` | Single Line Text | Job location |
| `Remote Option` | Single Select | Remote/Hybrid/Onsite |
| `Job Description` | Long Text | Full description |
| `Active` | Checkbox | Currently hiring |
| `Priority` | Single Select | High/Medium/Low |
| `Recruiter` | Link to Recruiters | Assigned recruiter |
| `Created Date` | Created Time | When added |

---

### Table 5: Call Campaigns

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `Campaign ID` | Auto Number | Unique identifier |
| `Campaign Name` | Single Line Text | Descriptive name |
| `Niche/Industry` | Single Select | Target industry |
| `Target Requirement` | Link to Client Requirements | Job to pitch |
| `Start Date` | Date | Campaign start |
| `End Date` | Date | Campaign end |
| `Status` | Single Select | Active/Paused/Completed |
| `Total Candidates` | Count | Candidates in campaign |
| `Calls Made` | Rollup | Total calls |
| `Interested Count` | Rollup | Interested candidates |
| `Conversion Rate` | Formula | % interested |
| `Recruiter` | Link to Recruiters | Campaign owner |

---

## Views to Create

### Candidates Table Views:

1. **Ready to Call** - Filter: Call Status = "Pending Call" AND Do Not Call = unchecked
2. **Hot Leads** - Filter: Call Status = "Completed - Interested"
3. **Need Follow Up** - Filter: Call Status = "Call Back Later" AND Next Call Date <= TODAY()
4. **By Niche** - Grouped by Niche/Industry
5. **My Candidates** - Filtered by current user (recruiter)

### Call Records Views:

1. **Today's Calls** - Filter: Call Date Time is today
2. **Needs Review** - Filter: Follow Up Required = checked
3. **High Interest** - Filter: Interest Level >= 4
4. **By Outcome** - Grouped by Call Outcome

---

## Automations to Set Up in Airtable

### 1. Update Candidate Status After Call
- **Trigger:** When record created in Call Records
- **Action:** Update linked Candidate's Call Status based on Call Outcome

### 2. Notify Recruiter of Hot Lead
- **Trigger:** When Call Record created with Interest Level >= 4
- **Action:** Send email to linked Recruiter

### 3. Schedule Retry for No Answer
- **Trigger:** When Call Outcome = "No Answer"
- **Action:** Set Next Call Date to +1 day, increment Call Attempts

### 4. Mark Do Not Call
- **Trigger:** When Call Outcome = "Opted Out"
- **Action:** Check Do Not Call on Candidate

---

## Sample Data Structure (JSON for n8n)

```json
{
  "candidate": {
    "id": "rec123abc",
    "name": "John Smith",
    "phone": "+14155551234",
    "niche": "IT",
    "previous_role": "Software Developer",
    "last_salary": 85000,
    "location": "San Francisco, CA",
    "skills": ["JavaScript", "Python", "React"]
  },
  "requirement": {
    "title": "Senior Software Engineer",
    "company": "TechCorp Inc",
    "salary_range": "$120,000 - $150,000",
    "location": "Remote",
    "skills_needed": ["JavaScript", "Node.js", "AWS"]
  },
  "recruiter": {
    "name": "Sarah Johnson",
    "email": "sarah@agency.com",
    "phone": "+14155559999"
  }
}
```

---

## API Access Setup

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create new token with scopes:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
3. Add your base to the token
4. Copy token for n8n integration

---

## Quick Setup Checklist

- [ ] Create new Airtable base named "Recruitment Voice Agent"
- [ ] Create Candidates table with all fields
- [ ] Create Call Records table with all fields
- [ ] Create Recruiters table
- [ ] Create Client Requirements table
- [ ] Create Call Campaigns table
- [ ] Set up views for each table
- [ ] Create automations
- [ ] Generate API token
- [ ] Import existing candidate data
- [ ] Test with sample record
