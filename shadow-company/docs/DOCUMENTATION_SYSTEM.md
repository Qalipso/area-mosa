# Documentation System

## Design Principle

Documentation is a **first-class output** of every run, not an afterthought. The Documentation Agent runs unconditionally at the end of every run and is responsible for keeping all project documentation current.

**Rule**: No document is silently overwritten. Every change creates a new version. The previous version is always retrievable.

---

## Documentation Hub Structure

```
/docs
├── README.md                  ← project overview, vision, quick start
├── PRODUCT_BRIEF.md           ← positioning, ICP, problem/solution, differentiation
├── PRD.md                     ← full product requirements, user stories, acceptance criteria
├── ROADMAP.md                 ← what's in v0.1 / v0.2 / v0.3, what's deferred
├── ARCHITECTURE.md            ← system architecture, tech stack, key decisions
├── AGENTS.md                  ← all agents: role, inputs, outputs, tools, memory scope
├── MEMORY_SYSTEM.md           ← memory types, lifecycle, schema
├── WORKFLOWS.md               ← request lifecycle, handoffs, human review
├── API_SPEC.md                ← endpoint list, request/response shapes, auth
├── DATABASE_SCHEMA.md         ← full schema, relationships, design notes
├── UX_FLOWS.md                ← user flows per feature area, edge states
├── DESIGN_SYSTEM.md           ← component library, tokens, spacing, typography
├── TEST_PLAN.md               ← test strategy, test cases per feature
├── SECURITY.md                ← data access, PII, prompt injection, permissions
├── RESEARCH.md                ← market research, user insights, sources
├── COMPETITORS.md             ← competitor matrix, feature comparison, positioning gaps
├── DECISIONS.md               ← ADR-style decision log (auto-generated)
├── CHANGELOG.md               ← what changed, when, in which run
└── CASE_STUDY.md              ← narrative of what was built and why (v0.3+)
```

---

## Agent Responsibilities

| Document | Primary Owner | Triggered By |
|---|---|---|
| README.md | Documentation Agent | Any run that changes vision, scope, or tech stack |
| PRODUCT_BRIEF.md | Documentation Agent (from PM, CEO outputs) | Feature scope change, positioning update |
| PRD.md | Documentation Agent (from PM outputs) | Any feature development run |
| ROADMAP.md | Documentation Agent (from CEO, PM outputs) | Priority changes, scope updates |
| ARCHITECTURE.md | Documentation Agent (from Backend, AI Engineer) | Any architectural decision |
| AGENTS.md | Documentation Agent | Agent config changes (v0.2+) |
| MEMORY_SYSTEM.md | Documentation Agent | Memory architecture changes |
| WORKFLOWS.md | Documentation Agent | Workflow or handoff changes |
| API_SPEC.md | Documentation Agent (from Backend outputs) | Any API change |
| DATABASE_SCHEMA.md | Documentation Agent (from Backend outputs) | Any schema change |
| UX_FLOWS.md | Documentation Agent (from UX outputs) | Any UX flow change |
| DESIGN_SYSTEM.md | Documentation Agent (from UI Designer outputs) | Any component change |
| TEST_PLAN.md | Documentation Agent (from QA outputs) | Any feature with test cases |
| SECURITY.md | Documentation Agent (from Security Agent) | Any security review |
| RESEARCH.md | Documentation Agent (from Research outputs) | Any research run |
| COMPETITORS.md | Documentation Agent (from CI Agent outputs) | Any competitive analysis run |
| DECISIONS.md | Documentation Agent | Every decision logged in any run |
| CHANGELOG.md | Documentation Agent | Every run (unconditional) |
| CASE_STUDY.md | Documentation Agent + Growth Agent | v0.3+; milestone-based |

---

## Versioning

Every document update creates a new record in the `documents` table:

```sql
-- new version created on update
INSERT INTO documents (
  project_id, title, type, content, version,
  created_by_agent_id, linked_run_id,
  previous_version_id, status
)
SELECT
  project_id, title, type, :new_content, version + 1,
  :agent_id, :run_id,
  id, 'published'
FROM documents
WHERE project_id = :project_id AND type = :type AND status = 'published'
ORDER BY version DESC LIMIT 1;

-- then archive previous version
UPDATE documents SET status = 'archived'
WHERE id = :previous_id;
```

**Version history is accessible**: Users can view any previous version from the UI.  
**Rollback**: User can promote an archived version back to published (creates a new version entry).

---

## Changelog Entry Format

Every run appends a CHANGELOG entry:

```markdown
## [Run run_abc123] 2025-05-30

**Request**: "Improve Shadow onboarding"

**Agents**: CEO, Orchestrator, Research, Competitor Intel, PM, UX, Frontend, Backend, AI Engineer, QA, Documentation

**Artifacts produced**:
- product_brief (art_101)
- competitor_matrix update (art_102)
- prd_section: onboarding (art_103)
- ux_flow: onboarding_v2 (art_104)
- impl_plan: frontend_onboarding (art_105)
- api_spec: /onboarding (art_106)
- test_plan: onboarding (art_107)

**Documents updated**: PRD.md, UX_FLOWS.md, API_SPEC.md, TEST_PLAN.md, COMPETITORS.md

**Decisions made**:
- ADR-014: Onboarding is 3 steps max (see DECISIONS.md)

**Quality**: PASSED (score: 0.91)
```

---

## Decision Log Format (DECISIONS.md)

```markdown
# Decision Log

---

## ADR-014: Onboarding is 3 steps maximum

**Status**: Accepted  
**Date**: 2025-05-30  
**Run**: run_abc123  
**Decided by**: CEO Agent (confirmed by user)

### Decision
Onboarding will be limited to 3 steps. Email is optional until step 3.

### Reason
Research shows >60% drop-off rates in onboarding flows with >4 steps (source: research_notes_art_102). 
User has previously stated: "Onboarding must be friction-free."

### Alternatives Considered
- 5-step onboarding with progress indicator — rejected: still too many steps per research findings
- Single-page onboarding — rejected: too much information density for mobile

### Consequences
- Profile completion must be deferred to post-onboarding
- Email collection strategy needs a separate touchpoint post-step-3

---
```

---

## Documentation Generation Pipeline

When Documentation Agent runs:

1. **Inventory**: Read all artifacts from current run
2. **Map**: Determine which documents each artifact affects
3. **Diff**: Compare artifact content to current document version
4. **Generate**: Write updated document sections (not full rewrites unless necessary)
5. **Changelog**: Append changelog entry
6. **Decision log**: Append any decisions from decision memory
7. **Version**: Save new document versions, archive previous
8. **Flag**: Mark significantly changed docs for user notification

**Mapping rules** (artifact type → document type):
```
product_brief       → PRODUCT_BRIEF.md, README.md
prd_section         → PRD.md
user_story          → PRD.md
ux_flow             → UX_FLOWS.md
component_spec      → DESIGN_SYSTEM.md
api_spec            → API_SPEC.md
db_schema_delta     → DATABASE_SCHEMA.md
impl_plan           → ARCHITECTURE.md (frontend section)
security_review     → SECURITY.md
competitor_matrix   → COMPETITORS.md
research_notes      → RESEARCH.md
decision            → DECISIONS.md, CHANGELOG.md
test_plan           → TEST_PLAN.md
deployment_plan     → ARCHITECTURE.md (infra section)
prompt_spec         → ARCHITECTURE.md (AI section)
```

---

## Documentation Quality Rules

1. **No invented content**: Documentation Agent only writes what artifacts support
2. **No silent overwrite**: Every change is versioned
3. **Assumptions labeled**: Any claim not backed by an artifact is labeled `[Assumption]`
4. **Contradictions flagged**: If new artifact contradicts existing doc, flag for human review — do not silently resolve
5. **Changelog is complete**: Every run gets a changelog entry, no exceptions
6. **Decision log is permanent**: Decisions are never deleted, only superseded

---

## What Documentation Agent Does NOT Do

- It does not invent content not present in artifacts
- It does not summarize or editorialize beyond what agents produced
- It does not delete previous versions
- It does not approve its own outputs (flagged changes wait for user review)
- It does not update CASE_STUDY.md until v0.3

---

*v0.1 scope: README.md, PRD.md, DECISIONS.md, CHANGELOG.md, API_SPEC.md, DATABASE_SCHEMA.md. Other docs added incrementally as agents produce relevant artifacts.*
