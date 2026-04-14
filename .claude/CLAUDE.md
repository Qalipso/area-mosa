# AREA MOSA - Project Instructions

Hair salon WhatsApp booking automation (Montevideo, Uruguay).

## Architecture

```
WhatsApp (Evolution API v2.3.7) :8080
       |
       v (webhook POST)
n8n Workflow :5678 (/webhook/whatsapp-booking)
       |
       v
AI Agent (GPT-4o-mini)
  |         |         |
  v         v         v
Get       Check     Create      Send
Services  Calendar  Booking     WhatsApp
(Code)    (Code)    (Code)      (HTTP)
               |
               v
        Google Calendar API (JWT auth)
```

## Docker Services

| Container | Image | Port | Purpose |
|-----------|-------|------|---------|
| evo_api | evoapicloud/evolution-api:v2.3.7 | 8080 | WhatsApp gateway |
| n8n | docker.n8n.io/n8nio/n8n:latest | 5678 | Workflow engine |
| postgres | postgres:15-alpine | 5432 (internal) | DB for evo + n8n |
| redis | redis:7-alpine | 6379 (internal) | Cache for evo |

Network: `area-mosa-net` (bridge). Inter-container: use container names (e.g. `http://evo_api:8080`).

## Key File Paths

| File | Purpose |
|------|---------|
| `docker/docker-compose.yml` | All 4 services |
| `docker/.env` | Evolution API env vars |
| `docker/service-account.json` | Google SA credentials |
| `docker/init-db.sql` | Creates `n8n` database |
| `n8n/booking-agent-workflow.json` | Main booking workflow |
| `n8n/README.md` | Setup instructions |
| `index.html` | Salon website |
| `style.css` | Website styles |
| `app.js` | Translations (RU/ES/EN) + logic |

## Critical n8n Sandbox Limitations

These cause runtime errors if violated:

1. **No `fetch` in Code nodes** — use `require('https')` with `NODE_FUNCTION_ALLOW_BUILTIN`
2. **No `$helpers` in toolCode nodes** — LangChain tool nodes cannot access `$helpers.httpRequest`
3. **No `$('NodeName')` in toolCode nodes** — cannot reference other nodes' output
4. **No `$input` in toolCode nodes** — tool receives input via `$fromAI()` parameters only
5. **Allowed builtins**: `crypto,fs,path,https,url,querystring` (set in docker-compose)

Pattern: Each tool must be **fully self-contained** — generate its own JWT, make its own HTTP requests.

## Google Calendar

- **Calendar ID**: `ae4d71467b7b1970bac78ebbfc075f2c3451427a3bf7cdddce921bbce0b92344@group.calendar.google.com`
- **Calendar Name**: "Area Mosa"
- **Timezone**: America/Montevideo
- **Service Account**: `area-mosa-calendar@neon-webbing-484620-f7.iam.gserviceaccount.com`
- **Auth**: JWT → access_token via `https://oauth2.googleapis.com/token`
- **Scope**: `https://www.googleapis.com/auth/calendar`
- **SA key file**: `/home/node/service-account.json` (inside n8n container)

## Evolution API

- **Instance**: `area-mosa`
- **API Key**: `area-mosa-evo-key`
- **Webhook**: `http://n8n:5678/webhook/whatsapp-booking` (internal)
- **WhatsApp number**: +598 94 786877
- **Message format**: Data nested under `$json.body` — e.g. `$json.body.data.message.conversation`

## Workflow Update Cycle

```bash
# 1. Copy workflow into container
docker cp n8n/booking-agent-workflow.json n8n:/tmp/workflow.json

# 2. Import (overwrites existing)
docker exec n8n n8n import:workflow --input=/tmp/workflow.json

# 3. Activate
docker exec n8n n8n update:workflow --id=area-mosa-booking-agent --active=true

# 4. Restart to pick up changes
docker restart n8n
```

## Deployment (Website)

```bash
cd /home/edu/Automatization-AI/area-mosa
npx vercel --prod --yes
```

Live URL: https://area-mosa.vercel.app

## Date Injection

GPT-4o-mini does not know the current date. It is injected via prompt template:
```
$now.format('yyyy-MM-dd') + ', dayOfWeek=' + $now.format('EEEE')
```

## Working Hours

Mon-Fri 9:00-20:00, Saturday by appointment, Sunday closed.

## Services

| ID | RU | ES | EN | Duration |
|----|----|----|-----|----------|
| haircut | Стрижка | Corte | Haircut | 45 min |
| coloring | Окрашивание | Coloracion | Coloring | 90 min |
| care | Уход за волосами | Cuidado capilar | Hair Care | 60 min |
| combo | Комбо | Combo | Combo | 120 min |
