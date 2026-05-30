# Shadow Company — AI Company OS

**Working title:** Shadow Company / AI Company OS / Agentic Product Studio
**Status:** Pre-MVP — initial documentation
**Owner:** edu
**Last updated:** 2026-05-30

> Build products with a team of specialized AI agents. Not a chatbot. Not a workflow builder. An operating system for product work.

---

## What This Is

Shadow Company is a workspace where a user runs a **mini AI company** against a project.

Not a chat. Not a workflow builder. A product studio where agents (CEO, PM, Research, UX, Frontend, Backend, AI Engineer, QA, Docs) collaborate through structured handoffs, produce **artifacts** (PRD, research notes, UX flow, implementation plan, test plan, decision log), and write everything back into a persistent **project memory** and **documentation hub**.

```
Agents + Memory + Docs + Runs + Decisions + Artifacts = AI Company OS
```

> Naming note: "Shadow Company" is the product name here. It is distinct from **Agent Studio**, a separate runtime/observability harness project. Don't conflate the two.

## The Core Idea

Most AI tools give you a chat. Shadow gives you a company.

```
User request
  → CEO frames goal + constraints
  → Orchestrator builds execution plan
  → Specialist agents execute in parallel/sequence
  → QA validates outputs
  → Documentation Agent assembles artifacts
  → User gets a set of documents, not a message
```

## Who It's For

- **Solo founders** who need to move fast across product, engineering, and design
- **Small product teams** (1–5 people) working on early-stage products
- **Technical PMs** who want structured artifacts, not ad-hoc answers
- **Builders** who think in systems and want their AI context to accumulate

## What Makes It Different

| Capability | Chat AI | Workflow Tools | Agent Frameworks | Shadow Company |
|---|---|---|---|---|
| Produces artifacts | ✗ | partial | partial | ✓ |
| Persistent project memory | ✗ | ✗ | partial | ✓ |
| Role-based agents | ✗ | ✗ | ✓ | ✓ |
| Decision logs | ✗ | ✗ | ✗ | ✓ |
| Documentation hub | ✗ | ✗ | ✗ | ✓ |
| Non-technical UX | ✓ | partial | ✗ | ✓ |

---

## Folder Layout

```
shadow-company/
├── README.md                       # this file
├── docs/
│   ├── PRODUCT_BRIEF.md            # executive summary, vision, positioning
│   ├── AGENTS.md                   # full agent registry — roles, I/O, tools, memory scope
│   ├── MEMORY_SYSTEM.md            # memory types, lifecycle, confidence/importance scoring
│   ├── WORKFLOWS.md                # orchestration pipeline, handoffs, human review
│   ├── DATABASE_SCHEMA.md          # entities, relationships, columns
│   ├── DOCUMENTATION_SYSTEM.md     # documentation hub, versioning, ownership
│   ├── MVP_PLAN.md                 # v0.1 → v0.3 scope and acceptance criteria
│   ├── USER_STORIES.md             # user stories + acceptance criteria per phase
│   ├── COMPETITORS.md              # competitive landscape, what to take, differentiation
│   ├── DIAGRAMS.md                 # 10 Mermaid diagrams
│   └── RISKS.md                    # risks, mitigations, open questions
└── decisions/
    └── ADR-000-template.md         # ADR template for decision logging
```

## How to Read These Docs

1. Start with `docs/PRODUCT_BRIEF.md` — the **why**.
2. Read `docs/AGENTS.md` + `docs/WORKFLOWS.md` — **how agents collaborate**.
3. Read `docs/MEMORY_SYSTEM.md` + `docs/DOCUMENTATION_SYSTEM.md` — **what persists**.
4. Read `docs/DATABASE_SCHEMA.md` — the **contract** a backend dev needs.
5. Read `docs/MVP_PLAN.md` + `docs/USER_STORIES.md` — **what to build first**.
6. Read `docs/COMPETITORS.md` — **the landscape**.
7. Read `docs/DIAGRAMS.md` — **visual overview**.
8. Read `docs/RISKS.md` last — **things that will go wrong**.

## Honesty Disclaimers

- **No market sizing numbers** in this document set. Where we make claims about competitor behavior, they are based on public product surfaces as of writing and labeled as observations, not facts.
- All metrics, conversion rates, or "% of users who…" statements are **assumptions** unless backed by a primary source.
- All tech stack choices are **preliminary** and subject to change after v0.1 validation.
- Everything below the MVP plan is **roadmap intent, not commitment**.

## Next Implementation Steps

See the bottom of `docs/MVP_PLAN.md` — a checklist a developer can pick up.

---

**Stack** *(planned, not decided)*: Next.js, PostgreSQL + pgvector, OpenAI/Anthropic APIs.
