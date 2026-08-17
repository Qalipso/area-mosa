# Competitive Landscape

> All statements about competitor behavior are **observations** based on public product surfaces as of writing — not facts, not endorsements. No pricing or usage numbers are stated unless sourced. Where a claim is unverified, it is labeled `[Assumption]`.

---

## Competitor Categories

We group competitors into five categories. Shadow Company overlaps with all five but is identical to none.

### Category 1 — AI Workspace

**Examples**: Claude Projects, ChatGPT Projects, Notion AI

**What they do**: A project container with files, custom instructions, project-scoped chat history, and writing assistance. Context is shared across chats within a project.

**What we take**:
- Project-as-container model
- Custom instructions per project
- Files / knowledge as project context

**Where they stop**:
- No agent specialization (one assistant, not a team)
- No artifact generation as a first-class output (you get messages)
- No decision logs, no structured memory beyond file/context recall
- Output is conversational, not a set of deliverables

---

### Category 2 — AI Teammates / Agent Teams

**Examples**: Relevance AI, Lindy, Gumloop, Zapier Agents

**What they do**: Configurable AI "teammates" or agents that run playbooks, call tools, and integrate with external services. Often trigger-driven (automation-first).

**What we take**:
- Agent-team framing
- Playbook / repeatable-process concept
- Tool and integration model

**Where they stop**:
- Built for **automation of defined processes**, not creative/strategic product work
- Agent roles are thin (a prompt + some tools), not deep responsibility scopes
- No persistent project memory that accumulates product context
- No documentation hub or decision log as an output

---

### Category 3 — Workflow Builders

**Examples**: Dify, n8n

**What they do**: Visual workflow/pipeline builders with RAG knowledge bases, deterministic steps, integrations, logs, and observability.

**What we take**:
- Observability and run logs
- RAG knowledge-base architecture
- Structured, inspectable pipeline thinking
- Deterministic step discipline

**Where they stop**:
- Require technical setup — you **build** the workflow
- Workflows are static; they don't adapt to accumulated project context
- Not artifact-first; output is whatever the workflow emits
- Not a product experience for non-builders

---

### Category 4 — Agent Frameworks

**Examples**: LangGraph, CrewAI, OpenAI Agents SDK, Microsoft Agent Framework

**What they do**: Developer libraries for multi-agent systems: handoffs, structured outputs, guardrails, tracing, session state, checkpoints, memory, evals.

**What we take**:
- Handoff protocol between agents
- Memory scoping per agent
- Eval / quality loop
- Run tracing and checkpoints
- Structured-output discipline

**Where they stop**:
- They are **developer tools**, not end-user products
- Require code to configure and operate
- No opinionated company-of-agents model out of the box
- No documentation hub or product-process awareness

---

### Category 5 — Execution Agents

**Examples**: Manus, Devin

**What they do**: Autonomous agents that produce finished work (files, code, task execution) rather than chat. Engineering-focused.

**What we take**:
- Artifact-first output model (finished work, not conversation)
- Task execution discipline
- File-based deliverables

**Where they stop**:
- Engineering-focused / general-purpose
- Not aware of the **product-building process** (research → PRD → UX → impl → QA → docs)
- No persistent multi-discipline project memory
- No decision log or documentation hub spanning the whole product

---

## Comparison Matrix

| Dimension | AI Workspace | AI Teammates | Workflow Builders | Agent Frameworks | Execution Agents | **Shadow Company** |
|---|---|---|---|---|---|---|
| Artifact-first output | ✗ | partial | partial | partial | ✓ | ✓ |
| Role-based agent team | ✗ | partial | ✗ | ✓ | ✗ | ✓ |
| Persistent project memory | partial | ✗ | partial | partial | ✗ | ✓ |
| Decision log (ADR) | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Documentation hub | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Product-process aware | ✗ | ✗ | ✗ | ✗ | partial | ✓ |
| No code required to use | ✓ | ✓ | partial | ✗ | ✓ | ✓ |
| Observability / run trace | ✗ | partial | ✓ | ✓ | partial | ✓ (v0.3) |

*Matrix reflects observed product surfaces, not benchmarked capability. `partial` = present but limited or not the product's focus.*

---

## Differentiation Thesis

Most competitors do **one** of three things:

1. **AI workspace** — context + chat, no team, no artifacts
2. **Workflow automation** — repeatable processes, requires building
3. **Agent framework** — powerful, but developer-only

Shadow Company's wedge:

> **AI Company OS for building products.** A role-based agent team that turns a request into a set of documented, reviewable artifacts against a persistent project context — with decision logs and an auto-maintained documentation hub.

The combination that no single competitor offers:

```
role-based agents  +  persistent typed memory  +  artifact-first output
+  decision logs  +  auto documentation  +  no-code product experience
```

---

## Positioning Gaps We Exploit

| Gap in the market | How Shadow addresses it |
|---|---|
| Workspaces remember files but not **decisions** | Decision memory + ADR log |
| Agent frameworks are powerful but **need code** | No-code product experience |
| Automation tools handle **process, not judgment** | Strategic agents (CEO, PM, Research) for judgment work |
| Execution agents produce code but lose **product context** | Multi-discipline persistent project memory |
| Everyone produces output; **no one maintains the docs** | Documentation Agent runs every run |

---

## Open Competitive Questions

- Will incumbents (Claude/ChatGPT Projects) add agent teams and close the gap? **[Assumption: plausible within 12–18 months — monitor.]**
- Is "company of agents" a category users want, or a metaphor that confuses? **Needs customer discovery (see Customer Discovery Agent outputs).**
- Where is the durable moat — the memory system, the artifact quality, or the process opinionatedness? **Open.**

---

*This document is maintained by the Competitor Intelligence Agent and updated on every competitive-analysis run. Pricing and feature claims must be sourced and dated.*
