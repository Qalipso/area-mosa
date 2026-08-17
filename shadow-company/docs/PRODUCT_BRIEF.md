# Product Brief — Shadow Company

## Vision

Shadow Company is an AI Company OS: a workspace where users build products by directing a coordinated team of role-based AI agents, each with a defined scope, inputs, outputs, and memory. The system produces artifacts — not answers — and accumulates project knowledge over time.

---

## Problem Statement

Building a product requires moving across many disciplines: research, product thinking, design, engineering, QA, documentation. Most people working on products today either:

1. **Use AI as a chat tool** — get answers, lose context, repeat work every session
2. **Hire people they can't afford** — a researcher, a PM, a designer, an engineer, a QA person
3. **Use workflow automation** — good for repetitive tasks, not for creative/strategic work
4. **Use agent frameworks** — require engineering effort to set up, not a product experience

The result: important product decisions are made without research, documentation is an afterthought, context is lost between sessions, and work is redone constantly.

**Shadow Company aims to close this gap** for founders and small product teams who need structured, artifact-producing AI work at the level of a small company.

---

## Solution

A **project workspace** where:

- Every project has persistent **memory** (vision, decisions, constraints, history)
- Every user request is handled by a **team of specialized agents** with clear roles
- Every run produces **concrete artifacts** (PRDs, UX flows, API specs, test plans)
- Every significant decision is **logged with context** (why, what alternatives, what trade-offs)
- All outputs accumulate in a **documentation hub** that grows with the project

The experience: write a request like *"improve the onboarding flow"*, get back a research summary, competitor comparison, UX flow, implementation plan, test cases, and updated documentation — from agents that already know your product's context.

---

## Positioning

**Shadow Company** is not:
- A better ChatGPT (no persistent work, no artifacts)
- A Zapier alternative (not for automation of repetitive tasks)
- A developer tool like LangGraph or CrewAI (no code to write to use it)
- A Notion AI plugin (not document-first, not just writing assistance)

**Shadow Company** is:
> An AI-powered operating system for product teams that turns requests into structured, documented, reviewable work — by running a team of specialized agents against a persistent project context.

---

## Target Users (ICP)

**Primary:**
- Solo technical founders building a product (0–5 person team)
- Product managers at early-stage startups who need to move fast without a full team
- Independent builders who want to ship with AI-augmented process

**Secondary:**
- Consultants and agencies who want to productize their client delivery process
- Technical writers / docs leads who want to automate documentation from work sessions

**Not primary (out of scope for v0.1):**
- Enterprise teams with complex permissions and compliance requirements
- Non-technical users who cannot evaluate agent outputs critically

---

## Core Use Cases

### 1. Feature development sprint
User: *"We need to add a referral system to Shadow."*
→ PM writes requirements → Research checks similar systems → UX creates flow → Frontend + Backend plan implementation → AI Engineer specifies any LLM behavior → QA writes test plan → Docs Agent creates PRD + implementation spec.

### 2. Competitor analysis run
User: *"Who are our main competitors and where are we better/worse?"*
→ Research Agent pulls competitor data → Competitor Intelligence Agent builds comparison matrix → Business Analyst adds positioning analysis → CEO frames strategic implications → Docs Agent creates COMPETITORS.md update.

### 3. Product decision
User: *"Should we build memory server-side or client-side?"*
→ CEO frames decision criteria → Backend Engineer analyzes tradeoffs → AI Engineer adds LLM-specific constraints → Docs Agent creates ADR → Decision memory updated.

### 4. Onboarding improvement
User: *"Our onboarding drop-off is too high."* *(assumption: no real analytics yet)*
→ Research Agent reviews onboarding patterns → Competitor Intelligence checks competitor onboarding → UX Architect redesigns flow → UI Designer specifies components → Frontend plans implementation → QA writes test cases.

### 5. Documentation catch-up
User: *"Our docs are out of date — update them to reflect what we built last sprint."*
→ Documentation Agent reads recent run history + artifacts → generates updated README, architecture notes, changelog.

---

## Competitive Landscape

> Full breakdown — including a comparison matrix and positioning gaps — lives in [COMPETITORS.md](COMPETITORS.md). Summary below.

### Category 1: AI Workspace (Claude Projects, ChatGPT Projects, Notion AI)
**What they have**: project files, custom instructions, chat history, writing assistance  
**Gap**: no agent specialization, no artifact generation, no decision logs, no memory system beyond file context

**Take**: project workspace concept, custom instructions per project

### Category 2: AI Teammates (Relevance AI, Lindy, Gumloop, Zapier Agents)
**What they have**: team of AI agents, playbooks, integrations, automation triggers  
**Gap**: built for automation of defined processes, not for creative/strategic product work; agent roles are thin

**Take**: agent team framing, playbook concept, tool integrations

### Category 3: Workflow Builders (Dify, n8n)
**What they have**: visual workflow builder, RAG, deterministic steps, logs, observability  
**Gap**: requires technical setup; workflows are static, not adaptive to project context

**Take**: observability and run logs, RAG knowledge base architecture, structured pipeline thinking

### Category 4: Agent Frameworks (LangGraph, CrewAI, OpenAI Agents SDK)
**What they have**: handoffs, structured outputs, guardrails, tracing, session state, checkpoints, memory, evals  
**Gap**: developer tools, not end-user products; require code to configure

**Take**: handoff protocol, memory scoping, eval system, run tracing, structured output discipline

### Category 5: Execution Tools (Manus, Devin)
**What they have**: finished work not chat, artifact generation, file outputs, task execution  
**Gap**: engineering-focused; general-purpose rather than product-process-aware

**Take**: artifact-first output model, task execution discipline, file-based deliverables

---

## Differentiation

| Dimension | Shadow Company |
|---|---|
| **Output model** | Artifact-first (documents, specs, plans) — not message-first |
| **Agent model** | Role = inputs + outputs + tools + memory scope (not personas) |
| **Memory** | 7-type persistent memory system — project context accumulates |
| **Decision log** | ADR-style decisions captured with reason, alternatives, consequences |
| **Documentation** | Auto-generated and maintained as part of every run |
| **UX** | Non-technical interface — no workflow building required |
| **Quality** | QA agent validates outputs before delivery; eval memory tracks improvements |

---

*Document status: initial draft — pre-implementation. All assumptions are labeled.*
