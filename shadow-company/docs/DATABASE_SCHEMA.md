# Database Schema

**Database**: PostgreSQL with pgvector extension  
**Assumption**: This schema is designed for correctness and clarity, not for performance optimization. Indexing strategy should be revisited before production deployment.

---

## Entity Overview

```
Core:           users, workspaces, projects
Agents:         agents, agent_skills, tools, agent_tools
Sessions/Runs:  sessions, runs, run_steps, tasks
Documents:      documents, artifacts
Memory:         memories
Decisions:      decisions
Research:       research_sources, competitors
Quality:        evaluations, test_cases, issues
System:         integrations, permissions
```

---

## Core Tables

```sql
-- Users
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  avatar_url      TEXT,
  settings        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Workspaces (multi-project container, one per user in v0.1)
CREATE TABLE workspaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES users(id),
  name            TEXT NOT NULL,
  plan            VARCHAR(32) DEFAULT 'free',
  -- free | pro | team (v0.2+)
  settings        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Projects (the primary organizing unit)
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  vision          TEXT,
  -- one-paragraph product vision; seed for project memory
  status          VARCHAR(16) DEFAULT 'active',
  -- active | paused | archived
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_projects_workspace ON projects(workspace_id, status);
```

---

## Agent Registry

```sql
-- Agent definitions (system agents + custom in v0.2)
CREATE TABLE agents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID REFERENCES workspaces(id),
  -- NULL = system agent (shared across all workspaces)
  slug            VARCHAR(64) UNIQUE NOT NULL,
  -- 'ceo', 'pm', 'research', etc.
  name            TEXT NOT NULL,
  role            TEXT NOT NULL,
  -- one-line responsibility description
  config          JSONB NOT NULL DEFAULT '{}',
  -- prompt templates, model config, tool list, memory scope config
  is_system       BOOLEAN DEFAULT true,
  -- false = user-created custom agent (v0.2+)
  version         INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Agent skills (many-to-many: agent → skill)
CREATE TABLE agent_skills (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        UUID NOT NULL REFERENCES agents(id),
  skill_name      VARCHAR(128) NOT NULL,
  -- 'competitor_analysis', 'user_research', 'api_design', etc.
  proficiency     NUMERIC(3,2) DEFAULT 1.0,
  -- 0..1; reserved for future skill scoring
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Tool definitions (reusable across agents)
CREATE TABLE tools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(128) UNIQUE NOT NULL,
  -- 'web_search', 'write_prd_section', etc.
  description     TEXT NOT NULL,
  config_schema   JSONB NOT NULL DEFAULT '{}',
  -- JSON Schema for tool parameters
  implementation  VARCHAR(32) NOT NULL DEFAULT 'function',
  -- 'function' | 'api' | 'mcp' (v0.2+)
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Agent ↔ Tool assignments
CREATE TABLE agent_tools (
  agent_id        UUID NOT NULL REFERENCES agents(id),
  tool_id         UUID NOT NULL REFERENCES tools(id),
  config          JSONB DEFAULT '{}',
  -- per-agent tool configuration override
  PRIMARY KEY (agent_id, tool_id)
);
```

---

## Sessions and Runs

```sql
-- Sessions (user-initiated work sessions; may contain multiple runs)
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  status          VARCHAR(16) DEFAULT 'active',
  -- active | completed | abandoned
  created_at      TIMESTAMPTZ DEFAULT now(),
  ended_at        TIMESTAMPTZ
);

-- Runs (a single user request → full pipeline execution)
CREATE TABLE runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES sessions(id),
  project_id      UUID NOT NULL REFERENCES projects(id),
  user_request    TEXT NOT NULL,
  -- verbatim user input
  request_type    VARCHAR(32) NOT NULL,
  -- feature_development | research_request | documentation_update | product_decision | competitive_analysis | architecture_review
  status          VARCHAR(16) DEFAULT 'queued',
  -- queued | running | completed | failed | needs_review
  agents_used     TEXT[] DEFAULT '{}',
  -- ordered list of agent slugs
  output_summary  TEXT,
  -- human-readable summary of what was produced
  quality_score   NUMERIC(3,2),
  -- 0..1; from QA Agent
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_runs_project ON runs(project_id, status);
CREATE INDEX idx_runs_session ON runs(session_id);

-- Run steps (one per agent execution within a run)
CREATE TABLE run_steps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id          UUID NOT NULL REFERENCES runs(id),
  agent_id        UUID NOT NULL REFERENCES agents(id),
  step_order      INTEGER NOT NULL,
  status          VARCHAR(16) DEFAULT 'pending',
  -- pending | running | completed | failed | skipped
  input           JSONB,
  -- task packet received by agent
  output          JSONB,
  -- structured output from agent
  confidence      NUMERIC(3,2),
  artifacts_produced UUID[],
  -- artifact IDs created in this step
  error_message   TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_run_steps_run ON run_steps(run_id, step_order);

-- Tasks (sub-units dispatched by Orchestrator to individual agents)
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id          UUID NOT NULL REFERENCES runs(id),
  run_step_id     UUID REFERENCES run_steps(id),
  assigned_agent_id UUID NOT NULL REFERENCES agents(id),
  title           TEXT NOT NULL,
  description     TEXT,
  status          VARCHAR(16) DEFAULT 'pending',
  -- pending | in_progress | completed | failed | blocked
  dependencies    UUID[] DEFAULT '{}',
  -- task IDs this task depends on
  result          JSONB,
  -- structured result from agent
  created_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ
);
```

---

## Documents and Artifacts

```sql
-- Documents (living documentation in the documentation hub)
CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  title           TEXT NOT NULL,
  type            VARCHAR(64) NOT NULL,
  -- readme | prd | architecture | api_spec | ux_flow | design_system |
  -- test_plan | research | competitor_matrix | decision_log | changelog |
  -- security_review | product_brief | roadmap | case_study
  content         TEXT NOT NULL,
  version         INTEGER DEFAULT 1,
  created_by_agent_id UUID REFERENCES agents(id),
  linked_run_id   UUID REFERENCES runs(id),
  status          VARCHAR(16) DEFAULT 'draft',
  -- draft | published | archived
  previous_version_id UUID REFERENCES documents(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_documents_project ON documents(project_id, type, status);

-- Artifacts (outputs produced within a run; raw material for documents)
CREATE TABLE artifacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  run_id          UUID NOT NULL REFERENCES runs(id),
  type            VARCHAR(64) NOT NULL,
  -- product_brief | prd_section | user_story | ux_flow | component_spec |
  -- api_spec | db_schema_delta | impl_plan | test_plan | security_review |
  -- competitor_matrix | research_notes | decision | prompt_spec | deployment_plan
  name            TEXT NOT NULL,
  content         TEXT NOT NULL,
  format          VARCHAR(16) DEFAULT 'markdown',
  -- markdown | json | sql | yaml
  created_by_agent_id UUID REFERENCES agents(id),
  status          VARCHAR(16) DEFAULT 'draft',
  -- draft | reviewed | published | superseded
  version         INTEGER DEFAULT 1,
  superseded_by   UUID REFERENCES artifacts(id),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_artifacts_project ON artifacts(project_id, type, status);
CREATE INDEX idx_artifacts_run ON artifacts(run_id);
```

---

## Memory

```sql
CREATE TABLE memories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  project_id      UUID REFERENCES projects(id),
  agent_id        UUID REFERENCES agents(id),
  user_id         UUID REFERENCES users(id),

  type            VARCHAR(32) NOT NULL,
  -- session | project | user | agent | decision | artifact | eval

  category        VARCHAR(64),
  -- 'constraints' | 'preferences' | 'decisions' | 'patterns' | 'tech_stack' | etc.

  key             TEXT NOT NULL,
  value           TEXT NOT NULL,

  source          TEXT,
  -- 'user_explicit' | 'agent:{slug}' | 'run:{run_id}'

  confidence      NUMERIC(3,2) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  importance      VARCHAR(16) NOT NULL,
  -- low | medium | high | critical

  last_used_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  visibility      VARCHAR(32) DEFAULT 'project',
  -- session | agent | project | workspace | user

  status          VARCHAR(16) DEFAULT 'active',
  -- active | archived | superseded | flagged

  embedding       VECTOR(1536),
  -- pgvector embedding for semantic search
  -- dimension matches text-embedding-3-small (OpenAI); adjust per model

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_memories_project ON memories(project_id, type, status);
CREATE INDEX idx_memories_agent ON memories(agent_id, project_id);
CREATE INDEX idx_memories_user ON memories(user_id, type);
CREATE INDEX idx_memories_expiry ON memories(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_memories_embedding ON memories USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
-- ivfflat is approximate; use hnsw for higher recall if needed
```

---

## Decisions

```sql
CREATE TABLE decisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  title           TEXT NOT NULL,
  decision        TEXT NOT NULL,
  reason          TEXT NOT NULL,
  alternatives    JSONB DEFAULT '[]',
  -- [{"option": "...", "rejected_because": "..."}]
  consequences    JSONB DEFAULT '[]',
  -- ["...", "..."]
  status          VARCHAR(16) DEFAULT 'accepted',
  -- proposed | accepted | deprecated | superseded
  created_by      TEXT NOT NULL,
  -- 'user' | 'agent:{slug}'
  linked_run_id   UUID REFERENCES runs(id),
  superseded_by   UUID REFERENCES decisions(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_decisions_project ON decisions(project_id, status);
```

---

## Research and Competitors

```sql
CREATE TABLE research_sources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  run_id          UUID REFERENCES runs(id),
  url             TEXT,
  title           TEXT NOT NULL,
  summary         TEXT NOT NULL,
  relevance_score NUMERIC(3,2),
  is_assumption   BOOLEAN DEFAULT false,
  -- true if claim is not source-backed
  created_by_agent_id UUID REFERENCES agents(id),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE competitors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  name            TEXT NOT NULL,
  url             TEXT,
  features        JSONB DEFAULT '{}',
  pricing         JSONB DEFAULT '{}',
  -- {plan_name: price, ...}; NULL if pricing is not public
  positioning     TEXT,
  strengths       TEXT[],
  weaknesses      TEXT[],
  last_updated    TIMESTAMPTZ DEFAULT now(),
  updated_by_agent_id UUID REFERENCES agents(id)
);
```

---

## Quality

```sql
CREATE TABLE evaluations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id          UUID NOT NULL REFERENCES runs(id),
  run_step_id     UUID REFERENCES run_steps(id),
  agent_id        UUID REFERENCES agents(id),
  criteria        TEXT NOT NULL,
  -- what was being evaluated
  score           NUMERIC(3,2) NOT NULL,
  passed          BOOLEAN NOT NULL,
  details         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE test_cases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  title           TEXT NOT NULL,
  type            VARCHAR(16) NOT NULL,
  -- unit | integration | e2e | acceptance
  steps           TEXT NOT NULL,
  expected        TEXT NOT NULL,
  actual          TEXT,
  status          VARCHAR(16) DEFAULT 'pending',
  -- pending | passed | failed | skipped
  linked_run_id   UUID REFERENCES runs(id),
  created_by_agent_id UUID REFERENCES agents(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE issues (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  title           TEXT NOT NULL,
  description     TEXT,
  severity        VARCHAR(16) NOT NULL,
  -- low | medium | high | critical
  type            VARCHAR(32) NOT NULL,
  -- bug | quality_issue | security_risk | missing_requirement
  status          VARCHAR(16) DEFAULT 'open',
  -- open | in_progress | resolved | wont_fix
  created_by_agent_id UUID REFERENCES agents(id),
  linked_run_id   UUID REFERENCES runs(id),
  assigned_to     TEXT,
  -- 'user' | 'agent:{slug}'
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## System

```sql
CREATE TABLE integrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  type            VARCHAR(64) NOT NULL,
  -- 'openai' | 'anthropic' | 'github' | 'linear' (v0.2+)
  config          JSONB DEFAULT '{}',
  -- encrypted at rest; never log
  status          VARCHAR(16) DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE permissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  role            VARCHAR(32) NOT NULL,
  -- owner | admin | member | viewer (v0.2+; v0.1 is single-user)
  resource_type   VARCHAR(64),
  resource_id     UUID,
  -- NULL = workspace-level permission
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

---

## Key Relationships

```
users
  └── workspaces (1:many)
       ├── projects (1:many)
       │    ├── sessions (1:many)
       │    │    └── runs (1:many)
       │    │         ├── run_steps (1:many)
       │    │         └── artifacts (1:many)
       │    ├── documents (1:many, versioned)
       │    ├── memories (1:many, typed)
       │    ├── decisions (1:many)
       │    ├── research_sources (1:many)
       │    ├── competitors (1:many)
       │    ├── test_cases (1:many)
       │    └── issues (1:many)
       ├── agents (1:many, custom agents)
       └── integrations (1:many)

agents (system, shared)
  ├── agent_skills (1:many)
  └── agent_tools (many:many via tools)
```

---

## Design Notes

1. **UUIDs everywhere**: Avoids enumerable IDs, supports distributed generation
2. **JSONB for config**: Agent configs, tool schemas, and competitor features are schema-flexible; use JSONB not TEXT
3. **Versioned documents**: `previous_version_id` creates a linked list — never hard-delete versions
4. **pgvector for memory**: Memory retrieval is semantic; embeddings stored alongside structured data
5. **Soft deletes**: Nothing in this schema is hard-deleted (use `status = 'archived'`)
6. **Assumption labels**: `is_assumption` on research_sources enforces honesty about unverified claims

---

*v0.1 tables: users, workspaces, projects, agents, agent_skills, tools, agent_tools, sessions, runs, run_steps, tasks, documents, artifacts, memories (project + decision types only), decisions. Other tables added in v0.2.*
