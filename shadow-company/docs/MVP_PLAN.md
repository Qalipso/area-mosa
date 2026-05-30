# MVP Plan

## Philosophy

Build the smallest system that validates the core loop:  
**User writes a request → agents produce structured artifacts → documentation is updated → context persists.**

Everything else is additive. The goal of v0.1 is not to build the full product — it is to validate that the artifact-first, memory-persistent agent loop is actually useful.

---

## v0.1 — Core Loop

**Target**: 4–6 weeks of engineering  
**Goal**: Validate that the end-to-end agent pipeline produces useful artifacts from a real user request

### What's in v0.1

**Project workspace**
- Create a project (name, vision, one-paragraph description)
- View project run history
- View artifacts per run

**Agent registry (5 agents only)**
- `orchestrator` — plans agent chain for the request
- `pm` — writes requirements and user stories
- `research` — produces research notes (web_search tool)
- `ux` — writes user flows and edge states
- `docs` — assembles and saves documentation

**Session and run mechanics**
- User writes a request in text
- System runs agents sequentially (not parallel in v0.1)
- Run status: queued → running → completed / failed
- Run history visible per project

**Memory system (minimal)**
- `project_memory`: vision, constraints, key decisions (structured key-value, no embeddings)
- `decision_memory`: decisions logged as ADRs
- No session memory persistence (in-process only)
- No user memory, no agent memory, no eval memory in v0.1

**Documentation hub (minimal)**
- Auto-generate: `PRD.md`, `DECISIONS.md`, `CHANGELOG.md`
- Manual view of each document with version history
- No README or ARCHITECTURE auto-generation yet

**Artifact output**
- Each agent produces a text artifact (markdown)
- Artifacts are stored and viewable per run
- No file download in v0.1 (copy to clipboard)

**QA validation (manual only)**
- No QA Agent in v0.1
- User manually reviews agent outputs
- Human review flags surfaced as "Review required" labels

### v0.1 Tech Stack (Assumption)

| Component | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Team familiarity; SSR useful for docs |
| Database | PostgreSQL | Reliable, supports JSONB, pgvector later |
| ORM | Drizzle ORM | Type-safe, lightweight |
| Auth | Clerk | Fast to implement, not the core product |
| LLM | OpenAI GPT-4o | Best structured output support |
| Hosting | Vercel (frontend) + Railway (Postgres) | Fast to deploy |
| Memory in v0.1 | Postgres only (no vector) | pgvector added in v0.2 |

*All choices are assumptions. Validate before committing.*

### v0.1 First User Scenario

```
User: "I want to improve Shadow onboarding"

1. Orchestrator plans: [pm → research → ux → docs]
2. PM Agent writes requirements and user stories
3. Research Agent pulls onboarding patterns and competitor examples
4. UX Agent writes the onboarding flow with empty/error states
5. Documentation Agent saves: PRD.md update, CHANGELOG entry

Output to user:
- product requirements (markdown)
- user stories with acceptance criteria
- research notes with sources
- UX flow (text, structured)
- updated PRD.md
- CHANGELOG entry
- DECISIONS.md entry (if any decisions were made)
```

### v0.1 NOT in scope

- CEO Agent (Orchestrator acts as CEO in v0.1)
- Frontend, Backend, AI Engineer, QA, Security, DevOps, Growth, Customer Discovery agents
- Parallel agent execution
- Vector-based memory retrieval
- Human review workflow (just flags in v0.1)
- Custom agent builder
- Multi-user / team features
- Billing
- Integrations (GitHub, Linear, Slack)
- Real code generation or execution
- File export

### v0.1 Acceptance Criteria

- [ ] User can create a project with name and vision
- [ ] User can write a request and receive artifact outputs
- [ ] Research Agent produces cited sources (no invented data)
- [ ] PM Agent produces user stories with `As a / I want / So that` format
- [ ] UX Agent produces flows with empty + error states
- [ ] Documentation Agent saves PRD.md and CHANGELOG
- [ ] Run history is viewable
- [ ] Project memory persists across runs (key decisions not lost)
- [ ] No hardcoded or invented content in any agent output

---

## v0.2 — Memory + Full Agent Team

**Target**: 6–8 weeks after v0.1  
**Goal**: Add the remaining agents, real memory retrieval, parallel execution, and human review workflow

### What's added in v0.2

**Additional agents**: CEO, Frontend Engineer, Backend Engineer, AI/LLM Engineer, QA/Test, Competitor Intelligence, Business/Data Analyst, Security, DevOps

**Memory upgrades**:
- pgvector for semantic memory retrieval
- Session memory persistence (survives browser refresh)
- User memory (cross-project preferences)
- Agent memory (role-specific patterns)
- Eval memory (QA outcomes)

**Parallel execution**:
- Orchestrator runs independent agents in parallel
- Reduces run time significantly

**Human review workflow**:
- Flagged items shown with context
- User can approve / edit / re-run
- Re-run with specific feedback sent to agent

**Documentation hub (full)**:
- All 19 document types
- Version diff view
- Document search

**Artifact improvements**:
- File export (PDF, markdown)
- Artifact linking (artifact references other artifacts)

### v0.2 Acceptance Criteria

- [ ] All 17 agents functional
- [ ] Memory retrieval uses vector similarity (not just keyword)
- [ ] Parallel agent stages reduce run time by at least 30% (assumption: needs measurement)
- [ ] Human review workflow allows edit + re-run
- [ ] All 19 document types auto-generated
- [ ] User memory persists preferences across projects

---

## v0.3 — Observability + Quality Loop

**Target**: 6–10 weeks after v0.2  
**Goal**: Close the quality loop — agents improve over time; system is observable and debuggable

### What's added in v0.3

**Eval system**:
- Per-run quality scoring (automated)
- Prompt performance tracking
- Known failure mode catalog
- Eval memory drives agent improvement

**Run observability**:
- Full run trace view (which agent, what input, what output, how long)
- Per-step confidence scores visible to user
- Token usage per run
- Cost per run (assumption: rough estimates only)

**Case study generator**:
- Documentation Agent + Growth Agent produce a case study from project history
- Narrative of what was built, why, what was learned

**Custom agent configuration** (limited):
- User can adjust agent instructions per project (not full agent builder)

### v0.3 Acceptance Criteria

- [ ] Run trace view shows per-agent inputs and outputs
- [ ] Quality score is computed and stored per run
- [ ] Eval memory is referenced by QA Agent in subsequent runs
- [ ] Case study can be generated from project history
- [ ] Token and cost estimates shown per run

---

## What NOT to Build in v1 (Any Version)

| Feature | Why not |
|---|---|
| Custom agent builder | High engineering cost; validate core loop first |
| External integrations (Slack, Linear, GitHub) | Adds complexity before core is validated |
| Real code generation/execution | Requires sandboxing, testing, safety work — separate product |
| Multi-user collaboration | Permissions, presence, conflicts — significant work |
| Billing and plans | Premature before product-market fit signal |
| Mobile app | Web first |
| Agent marketplace | Third-party trust and quality issues |
| AI-powered roadmap prioritization | Risk of misleading recommendations without real data |

---

## Risk Per Phase

| Phase | Primary risk | Mitigation |
|---|---|---|
| v0.1 | Agent outputs are generic and unhelpful | Tight output schemas; curated test requests; user feedback loop from day 1 |
| v0.2 | Memory retrieval produces noisy results | Confidence thresholds; importance filtering; manual memory review |
| v0.3 | Eval system over-optimizes for measurable metrics | Human review of eval criteria; don't automate decisions that need judgment |

---

*All timeline estimates are assumptions. Adjust based on team size and complexity discovered during implementation.*
