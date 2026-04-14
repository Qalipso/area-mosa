# Scaling the Booking Automation to Other Clients

How to reuse the AREA MOSA booking system for new clients from the leads list.

---

## Architecture: One VPS, Many Clients

```
VPS (Hetzner CX23 - EUR 3.49/month)
  |
  +-- Evolution API (Docker)
  |     +-- Instance: area-mosa
  |     +-- Instance: barberia-gs
  |     +-- Instance: peluqueria-yo-divina
  |     +-- Instance: biosmile
  |     ...
  |
  +-- Caddy (reverse proxy + auto SSL)

n8n Cloud ($20/month per client OR self-hosted $0)
  |
  +-- Workspace: area-mosa (2 workflows)
  +-- Workspace: barberia-gs (2 workflows)
  ...

Google Calendar (free, separate calendar per client)
OpenAI API (shared key, ~$2-5/month per client)
```

---

## Per-Client Setup (30 minutes)

### What changes per client:

| Parameter | Example (AREA MOSA) | What to change |
|-----------|---------------------|----------------|
| Business name | AREA MOSA | Barberia GS |
| WhatsApp number | +598 94 786877 | Client's number |
| Evolution instance name | area-mosa | barberia-gs |
| Services list | Haircut, Coloring, Care, Combo | Client's services |
| Working hours | Mon-Fri 9:00-20:00 | Client's hours |
| Address | Cordon, Montevideo | Client's address |
| Master name | Artem | Client's name |
| Languages | RU/ES/EN | ES only (most clients) |
| Google Calendar | primary | New calendar per client |
| n8n webhook path | /webhook/whatsapp-booking | /webhook/barberia-gs-booking |

### What stays the same:

- Evolution API VPS (shared)
- OpenAI API key (shared)
- Workflow structure (same nodes)
- Error handling
- Memory management

---

## Quick Deploy Script

Create a new client in under 5 minutes using this workflow:

### 1. Generate workflow from template

```bash
# Usage: ./new-client.sh <instance-name> <business-name> <phone> <services-json> <hours> <address>

./new-client.sh \
  "barberia-gs" \
  "Barberia GS" \
  "59812345678" \
  '[{"name":"Corte","duration":30},{"name":"Barba","duration":20},{"name":"Corte + Barba","duration":45}]' \
  "Lun-Sab 10:00-20:00, Dom cerrado" \
  "Centro, Montevideo"
```

### 2. Template variables (replace in workflow JSON)

| Placeholder | Description |
|-------------|-------------|
| `{{BUSINESS_NAME}}` | Business name |
| `{{INSTANCE_NAME}}` | Evolution API instance name |
| `{{PHONE_NUMBER}}` | WhatsApp number (digits only) |
| `{{SERVICES_TEXT}}` | Services list for AI prompt |
| `{{WORKING_HOURS}}` | Working hours text |
| `{{ADDRESS}}` | Business address |
| `{{MASTER_NAME}}` | Owner/master name |
| `{{LANGUAGES}}` | Supported languages |
| `{{WEBHOOK_PATH}}` | Unique webhook path |

---

## Pricing Model for Clients

### Tier 1: Basic Website + Booking Bot

**Target:** Leads #1-20 (no website, Instagram/Facebook only)

| Item | Price | Your Cost |
|------|-------|-----------|
| Landing page (like AREA MOSA) | $300-500 | Your time |
| WhatsApp booking bot setup | $200-300 | 30 min setup |
| Monthly maintenance | $30-50/month | ~$5/month real cost |
| **Total first sale** | **$500-800** | |
| **Monthly recurring** | **$30-50** | |

### Tier 2: Redesign + Automation

**Target:** Leads #21-37 (weak website, need automation)

| Item | Price | Your Cost |
|------|-------|-----------|
| Website redesign | $500-800 | Your time |
| WhatsApp booking bot | $300-400 | 30 min setup |
| CRM setup (n8n) | $200-300 | 1 hour |
| Monthly maintenance | $50-80/month | ~$10/month |
| **Total first sale** | **$1,000-1,500** | |
| **Monthly recurring** | **$50-80** | |

### Tier 3: Full Automation

**Target:** Leads #38-50 (need complex automation)

| Item | Price | Your Cost |
|------|-------|-----------|
| Full website | $800-1,200 | Your time |
| WhatsApp bot + CRM | $400-600 | 1-2 hours |
| Custom n8n workflows | $400-800 | 2-4 hours |
| Monthly maintenance | $80-150/month | ~$15/month |
| **Total first sale** | **$1,600-2,600** | |
| **Monthly recurring** | **$80-150** | |

---

## Revenue Projections

### Conservative (5 clients in 3 months):

| Month | New Clients | Setup Revenue | Monthly Recurring |
|-------|-------------|---------------|-------------------|
| 1 | 2 | $1,000-1,600 | $60-100 |
| 2 | 2 | $1,000-1,600 | $120-200 |
| 3 | 1 | $500-800 | $150-250 |
| **Total Q1** | **5** | **$2,500-4,000** | **$150-250/month** |

### Infrastructure cost for 5 clients:

| Service | Monthly |
|---------|---------|
| VPS (shared Evolution API) | $3.49 |
| OpenAI API (shared, 5 clients) | ~$15 |
| n8n Cloud (if per-client) | $100 (5x$20) |
| **OR n8n self-hosted** | **$0** (run on same VPS) |
| **Total** | **$18.49-118/month** |

**Profit margin per client:** 80-90% (if self-hosting n8n)

---

## Scaling Path

### Phase 1: First 5 Clients (Month 1-3)
- Use AREA MOSA as demo ("look at this working system")
- Walk through Cordon/Pocitos/Centro districts (see leads list)
- Manual setup per client (~30 min each)
- One shared VPS for Evolution API

### Phase 2: 10-20 Clients (Month 3-6)
- Self-host n8n on same VPS (save $20/month per client)
- Create proper deployment scripts (automated)
- Build client dashboard (simple admin panel)
- Consider dedicated VPS for stability

### Phase 3: 20+ Clients (Month 6+)
- White-label the system
- Hire a sales person for outreach
- Build self-service onboarding portal
- Multi-country expansion (Buenos Aires, Santiago)

---

## Self-Hosting n8n (Save $20/client/month)

When you have 3+ clients, self-hosting saves money:

```bash
# Add to the same VPS docker-compose.yml:
services:
  # ... existing evolution-api, postgres, redis ...

  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.yourdomain.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.yourdomain.com
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=postgres
      - DB_POSTGRESDB_PASSWORD=postgres
      - N8N_ENCRYPTION_KEY=your-encryption-key-here
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

volumes:
  n8n_data:
```

Cost comparison (10 clients):
- n8n Cloud: $200/month (10 x $20)
- Self-hosted: $7.49/month (VPS upgrade to CX33 for more RAM)

---

## Client Onboarding Checklist

For each new client:

- [ ] Collect: business name, phone, services, hours, address
- [ ] Create Evolution API instance + scan QR code
- [ ] Create Google Calendar (or use client's existing)
- [ ] Generate workflow JSON from template
- [ ] Import and configure in n8n
- [ ] Test: send WhatsApp message, verify booking flow
- [ ] Train client: show them the calendar, explain bot behavior
- [ ] Set up billing: monthly recurring payment

---

## Files Structure (per client)

```
Automatization-AI/
  area-mosa/           <-- Client 1 (template)
    index.html
    style.css
    app.js
    n8n/
      booking-agent-workflow.json
      reminder-workflow.json
      README.md
    DEPLOY.md
    SCALE.md

  barberia-gs/         <-- Client 2 (clone)
    index.html
    style.css
    app.js
    n8n/
      booking-agent-workflow.json
      reminder-workflow.json

  templates/           <-- Reusable templates
    website/
      index.html       <-- Template with {{placeholders}}
      style.css
      app.js
    n8n/
      booking-agent-template.json
      reminder-template.json
    new-client.sh       <-- Generator script
```
