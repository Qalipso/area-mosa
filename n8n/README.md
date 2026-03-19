# AREA MOSA - WhatsApp Booking Automation (n8n)

Automated appointment booking and reminders via WhatsApp for AREA MOSA hair salon.

## Architecture

```
Client (WhatsApp) --> Evolution API --> n8n Webhook --> AI Agent (GPT-4o-mini)
                                                            |
                                                    Google Calendar
                                                    (check / create)
                                                            |
                                                     Evolution API
                                                            |
                                              Client (WhatsApp response)
```

## Workflows

### 1. `booking-agent-workflow.json` - Main Booking Agent

AI-powered conversational booking assistant that:
- Receives WhatsApp messages via Evolution API webhook
- Detects language (Russian / Spanish / English) automatically
- Presents 4 services: Haircut, Coloring, Hair Care, Combo
- Checks Google Calendar availability
- Creates calendar events for confirmed bookings
- Responds in the client's language

### 2. `reminder-workflow.json` - Daily Appointment Reminders

Runs daily at 9:00 AM (Montevideo time):
- Fetches today's appointments from Google Calendar
- Sends WhatsApp reminders to each client
- Trilingual messages (RU/ES/EN) based on booking language

## Setup

### Prerequisites

- n8n Cloud account ($20/month Starter plan) or self-hosted n8n
- Evolution API instance (self-hosted or cloud)
- Google Calendar (with OAuth2 or API key)
- OpenAI API key (for GPT-4o-mini)

### Step 1: Import Workflows

1. Go to n8n dashboard
2. Click "Add workflow" > "Import from file"
3. Import `booking-agent-workflow.json`
4. Import `reminder-workflow.json`

### Step 2: Set Environment Variables

Go to n8n Settings > Variables and add:

| Variable | Description | Example |
|----------|-------------|---------|
| `EVOLUTION_API_URL` | Evolution API base URL | `https://evo.yourdomain.com` |
| `EVOLUTION_API_KEY` | Evolution API authentication key | `your-api-key-here` |
| `GOOGLE_CALENDAR_ID` | Google Calendar ID | `primary` or `email@gmail.com` |
| `GOOGLE_CALENDAR_ACCESS_TOKEN` | OAuth2 access token for Calendar API | `ya29.xxx...` |

### Step 3: Configure Credentials

In n8n Credentials, add:
- **OpenAI API** - your API key for GPT-4o-mini

### Step 4: Set Up Evolution API

1. Deploy Evolution API (Docker recommended)
2. Create an instance named `area-mosa`
3. Scan QR code with the salon WhatsApp (+598 94 786877)
4. Set webhook URL to: `YOUR_N8N_URL/webhook/whatsapp-booking`
5. Enable event: `MESSAGES_UPSERT`

### Step 5: Set Up Google Calendar

1. Create a Google Cloud project
2. Enable Google Calendar API
3. Create OAuth2 credentials
4. Authorize and get access token
5. Create a dedicated calendar "AREA MOSA Bookings" (optional)

### Step 6: Activate Workflows

1. Open each workflow in n8n
2. Toggle "Active" switch to ON
3. Test by sending a WhatsApp message to +598 94 786877

## Services Configuration

| Service | Duration | RU | ES | EN |
|---------|----------|----|----|-----|
| Haircut | ~45 min | Стрижка | Corte | Haircut |
| Coloring | ~90 min | Окрашивание | Coloracion | Coloring |
| Hair Care | ~60 min | Уход за волосами | Cuidado capilar | Hair Care |
| Combo | ~120 min | Комбо | Combo | Combo |

Working hours: Mon-Fri 9:00-20:00, Saturday by appointment, Sunday closed.

## Monthly Costs

| Service | Cost |
|---------|------|
| n8n Cloud (Starter) | $20 |
| OpenAI API (GPT-4o-mini) | ~$2-5 |
| Evolution API (self-hosted) | $0 |
| Google Calendar | $0 |
| **Total** | **~$22-25/month** |

## Troubleshooting

**Bot not responding:**
- Check Evolution API instance status (QR code still connected?)
- Verify webhook URL is correct in Evolution API settings
- Check n8n execution logs for errors

**Calendar not creating events:**
- Verify `GOOGLE_CALENDAR_ACCESS_TOKEN` is not expired
- Check Calendar API is enabled in Google Cloud Console
- Verify calendar ID is correct

**Wrong language detection:**
- The AI agent detects language from the first message
- If detection is wrong, the client can switch by writing in another language
