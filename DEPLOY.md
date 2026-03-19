# AREA MOSA - Deployment Guide

Step-by-step guide to deploy the WhatsApp booking automation for AREA MOSA.

---

## Overview

```
[Client WhatsApp] --> [Evolution API] --> [n8n Cloud] --> [Google Calendar]
                                              |
                                         [OpenAI GPT]
```

**Monthly cost:** ~$22-25/month
- n8n Cloud Starter: $20
- OpenAI GPT-4o-mini: ~$2-5
- Evolution API (self-hosted): $0
- Google Calendar: $0

---

## Step 1: n8n Cloud Account

**Time:** 5 minutes

1. Go to [https://n8n.io/cloud](https://app.n8n.cloud/register)
2. Sign up for Starter plan ($20/month, 2,500 executions)
3. After signup, note your n8n URL: `https://YOUR-NAME.app.n8n.cloud`
4. Go to **Settings > Variables** (left sidebar)
5. Add these 4 variables (leave values empty for now, we fill them in steps below):

| Variable | Description |
|----------|-------------|
| `EVOLUTION_API_URL` | Fill after Step 2 |
| `EVOLUTION_API_KEY` | Fill after Step 2 |
| `GOOGLE_CALENDAR_ID` | Fill after Step 3 |
| `GOOGLE_CALENDAR_ACCESS_TOKEN` | Fill after Step 3 |

---

## Step 2: Evolution API (WhatsApp)

**Time:** 15-20 minutes

### Option A: Self-hosted (free, recommended)

**Requirements:** VPS with Docker (min 1GB RAM, 1 CPU)

**Cheap VPS options:**
- Hetzner Cloud CX22: EUR 3.29/month (2 vCPU, 4GB RAM) - [hetzner.com/cloud](https://hetzner.com/cloud)
- DigitalOcean Droplet: $6/month (1 vCPU, 1GB RAM) - [digitalocean.com](https://digitalocean.com)
- Contabo VPS S: EUR 5.99/month (4 vCPU, 8GB RAM) - [contabo.com](https://contabo.com)

**Install on VPS:**

```bash
# SSH to your VPS
ssh root@YOUR_VPS_IP

# Install Docker (if not installed)
curl -fsSL https://get.docker.com | sh

# Create docker-compose.yml
mkdir -p /opt/evolution-api && cd /opt/evolution-api

cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  evolution-api:
    image: atendai/evolution-api:latest
    restart: always
    ports:
      - "8080:8080"
    environment:
      - AUTHENTICATION_API_KEY=your-secret-api-key-here
      - AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://postgres:postgres@postgres:5432/evolution
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379
      - CACHE_LOCAL_ENABLED=false
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=evolution
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Start
docker compose up -d

# Check it's running
docker compose logs -f evolution-api
```

After startup, Evolution API is available at `http://YOUR_VPS_IP:8080`.

**Recommended:** Set up a reverse proxy (Nginx/Caddy) with SSL:
```bash
# Install Caddy (auto HTTPS)
apt install -y caddy

# /etc/caddy/Caddyfile
# evo.yourdomain.com {
#     reverse_proxy localhost:8080
# }
caddy reload
```

**Create WhatsApp instance:**

```bash
# Create instance "area-mosa"
curl -X POST http://YOUR_VPS_IP:8080/instance/create \
  -H "apikey: your-secret-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "area-mosa",
    "integration": "WHATSAPP-BAILEYS",
    "qrcode": true
  }'
```

**Get QR code:**

```bash
curl http://YOUR_VPS_IP:8080/instance/connect/area-mosa \
  -H "apikey: your-secret-api-key-here"
```

Open the QR code URL in browser, scan with Artem's WhatsApp (+598 94 786877).

**Set webhook to n8n:**

```bash
curl -X POST http://YOUR_VPS_IP:8080/webhook/set/area-mosa \
  -H "apikey: your-secret-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR-NAME.app.n8n.cloud/webhook/whatsapp-booking",
    "webhook_by_events": true,
    "webhook_base64": false,
    "events": ["MESSAGES_UPSERT"]
  }'
```

**Update n8n variables:**
- `EVOLUTION_API_URL` = `https://evo.yourdomain.com` (or `http://YOUR_VPS_IP:8080`)
- `EVOLUTION_API_KEY` = `your-secret-api-key-here`

### Option B: Evolution API Cloud (~$10/month)

1. Go to [https://evolution-api.com](https://evolution-api.com)
2. Sign up and create instance
3. Scan QR code with Artem's WhatsApp
4. Set webhook URL to your n8n webhook
5. Copy API URL and key to n8n variables

---

## Step 3: Google Calendar

**Time:** 10-15 minutes

### 3a. Create Google Cloud Project

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with the Google account that has Artem's calendar
3. Click **Select a project** > **New Project**
4. Name: `area-mosa-booking`
5. Click **Create**

### 3b. Enable Calendar API

1. Go to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click on it > **Enable**

### 3c. Create OAuth2 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: `AREA MOSA Booking`
   - Support email: your email
   - Save
4. Back to Credentials:
   - Application type: **Web application**
   - Name: `n8n Calendar Integration`
   - Authorized redirect URIs: `https://YOUR-NAME.app.n8n.cloud/rest/oauth2-credential/callback`
   - Click **Create**
5. Note the **Client ID** and **Client Secret**

### 3d. Connect in n8n

1. In n8n, go to **Credentials** > **Add Credential**
2. Search for **Google Calendar OAuth2 API**
3. Enter:
   - Client ID: from step 3c
   - Client Secret: from step 3c
4. Click **Sign in with Google**
5. Authorize the app
6. Save credential

### 3e. Get Calendar ID

- For default calendar: use `primary`
- For a specific calendar: Go to Google Calendar > Settings > select calendar > scroll to **Calendar ID** (looks like `abc123@group.calendar.google.com`)

**Update n8n variable:**
- `GOOGLE_CALENDAR_ID` = `primary` (or your specific calendar ID)

### 3f. Access Token for Tool Code nodes

The Tool Code nodes in the workflow use the REST API directly. For this, you need a bearer token:

**Option 1 - OAuth2 Playground (quickest for testing):**
1. Go to [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
2. Select **Google Calendar API v3** > `https://www.googleapis.com/auth/calendar`
3. Click **Authorize APIs**
4. Sign in and allow
5. Click **Exchange authorization code for tokens**
6. Copy the **Access token**

**Option 2 - Service Account (recommended for production):**
1. Go to **Google Cloud Console** > **IAM & Admin** > **Service Accounts**
2. Create service account
3. Download JSON key
4. Share the calendar with the service account email
5. Use the key to generate tokens programmatically

**Update n8n variable:**
- `GOOGLE_CALENDAR_ACCESS_TOKEN` = `ya29.xxx...` (your token)

**Important:** Access tokens expire after 1 hour. For production, implement token refresh using a separate n8n workflow (see Scaling section below).

---

## Step 4: OpenAI API

**Time:** 5 minutes

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up / Log in
3. Go to **API keys** > **Create new secret key**
4. Name: `area-mosa-n8n`
5. Copy the key (starts with `sk-...`)
6. Go to **Billing** > Add payment method > Add $10 credit
7. In n8n, go to **Credentials** > **Add Credential** > **OpenAI API**
8. Paste the API key
9. Save

---

## Step 5: Import Workflows

**Time:** 5 minutes

### 5a. Import Booking Agent

1. In n8n, click **Add workflow**
2. Click **...** menu > **Import from file**
3. Select `n8n/booking-agent-workflow.json`
4. The workflow will open with all nodes
5. **Fix credential references:**
   - Click on **GPT-4o-mini** node > select your OpenAI credential
6. Click **Save**
7. Toggle **Active** to ON

### 5b. Import Reminder Workflow

1. Same process with `n8n/reminder-workflow.json`
2. Click **Save**
3. Toggle **Active** to ON

---

## Step 6: Test

**Time:** 5 minutes

### Test 1: Booking Flow

Send a WhatsApp message to +598 94 786877:

**Russian test:**
```
Привет! Хочу записаться на стрижку
```

**Spanish test:**
```
Hola! Quiero reservar un corte
```

**English test:**
```
Hi! I'd like to book a haircut
```

**Expected behavior:**
1. Bot greets and presents services
2. You choose a service
3. Bot asks for date/time
4. Bot checks calendar
5. Bot confirms booking
6. Calendar event appears in Google Calendar

### Test 2: Reminders

1. Create a test booking for today
2. Wait until 9:00 AM (or trigger the reminder workflow manually in n8n)
3. Verify WhatsApp reminder is received

### Troubleshooting

| Problem | Check |
|---------|-------|
| Bot not responding | Evolution API instance status, webhook URL, n8n workflow active? |
| "Calendar API error" | Access token expired? Refresh it |
| Wrong language | Send a new message in the desired language |
| Double messages | Check Evolution API webhook events (only MESSAGES_UPSERT) |

---

## Maintenance

### Weekly
- Check n8n execution logs for errors
- Verify Evolution API WhatsApp connection (QR code may disconnect)

### Monthly
- Refresh Google Calendar access token (if using OAuth playground)
- Review n8n Cloud usage (2,500 execution limit)
- Check OpenAI billing

### Token Refresh (Production)

Create a separate n8n workflow for automatic Google token refresh:

1. Schedule trigger: every 50 minutes
2. HTTP Request: POST to `https://oauth2.googleapis.com/token` with refresh_token
3. Set Variable: update `GOOGLE_CALENDAR_ACCESS_TOKEN` with new token

This ensures the calendar integration never breaks.

---

## Scaling to Other Clients

See `SCALE.md` for the template system to deploy this for other businesses.
