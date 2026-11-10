# Memory Architecture

## Design Principle

Memory exists to help future decisions, not to record the past.

**Rule**: If a piece of memory could not improve a future agent's response, it should not be saved.

**Anti-pattern**: timestamped logs, chat history, "user did X at 15:43"  
**Pattern**: "User wants no fake metrics in any agent output — enforce in Research and Analyst agents"

---

## Memory Types

### 1. Session Memory

**Scope**: current run only  
**Expires**: end of session  
**Visibility**: all agents in the current run

What to store:
- User's original request (verbatim)
- Goal brief from CEO Agent
- Execution plan from Orchestrator
- Which agents have completed and their outputs
- Open questions within this run
- Confidence scores per agent step

What NOT to store:
- Full LLM completions (store structured outputs only)
- Intermediate reasoning steps
- Duplicate of what's in artifacts

```sql
session_memory {
  run_id, key, value, created_by_agent, created_at
}
```

---

### 2. Project Memory

**Scope**: single project  
**Expires**: project lifecycle (manual archive)  
**Visibility**: all agents with project access

What to store:
- Product vision and value proposition
- Current MVP scope and out-of-scope items
- Active user stories and acceptance criteria
- Architectural constraints and tech stack decisions
- Known user preferences for this project
- Current blockers and open questions
- Key relationships (project uses X service, depends on Y API)

What NOT to store:
- Full document content (store artifact IDs, not content)
- Meeting summaries or conversation logs
- Transient implementation details

```sql
project_memory {
  project_id, category, key, value, confidence,
  importance, source_run_id, created_at, updated_at
}
```

**Example of good project memory**:
```
category: "constraints"
key: "data_model"
value: "All user data must be stored in Supabase. No third-party data stores."
confidence: 1.0
importance: "critical"
```

**Example of bad project memory**:
```
key: "discussion_may_2025"
value: "Team discussed onboarding at the Monday call and decided to revisit in Q3"
```

---

### 3. User Memory

**Scope**: user account (cross-project)  
**Expires**: account lifetime (or explicit reset)  
**Visibility**: agents with user context access

What to store:
- Working style preferences ("user wants concise outputs, not verbose explanations")
- Decision-making patterns ("user prefers to see trade-offs before decisions, not after")
- Communication preferences ("user wants markdown tables, not prose lists")
- Known aversions ("user has rejected synthetic metrics twice — never invent numbers")
- Recurring goals or values ("user prioritizes privacy and data minimalism")

What NOT to store:
- Personal information beyond what affects agent behavior
- Past conversations
- Per-project decisions (those go in project memory)

```sql
user_memory {
  user_id, category, key, value, confidence,
  importance, source, created_at, updated_at
}
```

---

### 4. Agent Memory

**Scope**: specific agent role  
**Expires**: role lifetime (does not reset per run)  
**Visibility**: the agent it belongs to + Orchestrator

What to store:
- Recurring mistakes this agent has made (with correction)
- Successful patterns for this project
- Known limitations ("Research Agent: Wikipedia is not a reliable source for pricing data")
- Project-specific agent preferences ("QA Agent: always include Playwright sketches for auth flows")

What NOT to store:
- Run-specific state (that's session memory)
- User preferences (that's user memory)

```sql
agent_memory {
  agent_id, project_id, category, key, value,
  confidence, importance, created_at, updated_at
}
```

---

### 5. Decision Memory

**Scope**: project  
**Expires**: permanent (decisions should not disappear)  
**Visibility**: CEO Agent, Orchestrator, all relevant specialist agents

Format: ADR-style (Architecture Decision Record)

Required fields:
- `title`: what was decided
- `decision`: the actual choice made
- `reason`: why this choice was made (not just what)
- `alternatives`: what else was considered and why rejected
- `consequences`: what this decision implies for future work
- `status`: proposed | accepted | deprecated | superseded
- `created_by`: which agent or human made this decision
- `linked_run_id`: which run produced this decision

**Example**:
```
title: "Memory storage: PostgreSQL + pgvector, not a dedicated vector DB"
decision: "Use pgvector extension in existing PostgreSQL instance"
reason: "Reduces infrastructure complexity for v0.1; single DB to manage; 
         query performance acceptable for initial scale (assumption: <100k memories)"
alternatives: ["Pinecone — rejected: adds vendor dependency", 
               "Qdrant — rejected: separate service to deploy"]
consequences: ["Must monitor query latency as memory grows",
               "May need to migrate to dedicated vector DB at scale"]
status: accepted
```

---

### 6. Artifact Memory

**Scope**: project  
**Expires**: versioned (old versions retained, not deleted)  
**Visibility**: Documentation Agent, Orchestrator, relevant agents

What to store:
- Index of all artifacts created (not the content itself)
- Artifact ID, type, title, current version, status
- Which run created it, which agent created it
- Whether it's current or superseded

```sql
artifact_index {
  artifact_id, project_id, type, title, version,
  status, created_by_agent_id, created_in_run_id,
  created_at, superseded_by
}
```

---

### 7. Eval Memory

**Scope**: project  
**Expires**: accumulated (grows over time)  
**Visibility**: QA Agent, AI/LLM Engineer Agent, Orchestrator

What to store:
- Prompts that produced quality outputs (with context)
- Prompts that failed (with failure mode)
- Agent configurations that led to quality issues
- Test cases that consistently catch bugs
- Known edge cases for this project's domain

```sql
eval_memory {
  project_id, agent_id, run_id,
  eval_type, input_hash, outcome, score,
  notes, created_at
}
```

---

## Memory Lifecycle

### Save
- Agent calls `save_to_memory(type, key, value, confidence, importance)`
- System checks: does this improve future decisions? (heuristic: importance >= "medium" required)
- System checks: does a similar entry already exist? If yes, update rather than duplicate
- Confidence and importance scores are required (no defaults)

### Retrieve
- Agent calls `retrieve_memory(type, query, top_k)`
- For semantic queries: vector similarity search against embeddings
- For structured queries: direct key lookup
- Returns entries with confidence scores — agent decides how much to trust them

### Update
- Agent calls `update_memory(id, value, reason)`
- Old value is archived, not deleted (audit trail)
- Confidence may be revised (up or down based on new evidence)

### Delete / Expire
- Session memory: auto-deleted on run completion (or archived to audit log)
- Expired entries (expires_at passed): moved to archive, not hard-deleted
- Manual deletion: user-only action via UI, requires confirmation

---

## Confidence and Importance Scoring

### Confidence (0.0–1.0)
How certain is this memory?
- `1.0`: directly stated by user or derived from source
- `0.8`: inferred from strong evidence
- `0.6`: reasonable inference, some uncertainty
- `< 0.6`: hypothesis — should be labeled as such in outputs

### Importance (low / medium / high / critical)
How much would losing this affect future decisions?
- `critical`: losing this would cause agents to make wrong architectural choices
- `high`: losing this would reduce output quality significantly
- `medium`: losing this would cause minor redundancy or re-work
- `low`: nice to have, but not essential

**Threshold rule**: Only `medium` or higher importance items are saved to long-term memory.

---

## Memory Schema (Full)

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
  -- 'constraints' | 'preferences' | 'decisions' | 'patterns' | etc.

  key             TEXT NOT NULL,
  value           TEXT NOT NULL,
  source          TEXT,
  -- run_id, agent_id, or 'user_explicit'

  confidence      NUMERIC(3,2) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  importance      VARCHAR(16) NOT NULL,
  -- low | medium | high | critical

  last_used_at    TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  visibility      VARCHAR(32) DEFAULT 'project',
  -- session | agent | project | workspace | user

  status          VARCHAR(16) DEFAULT 'active',
  -- active | archived | superseded | flagged

  embedding_id    TEXT,
  -- reference to vector store entry

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_memories_project ON memories(project_id, type, status);
CREATE INDEX idx_memories_agent ON memories(agent_id, project_id);
CREATE INDEX idx_memories_expiry ON memories(expires_at) WHERE expires_at IS NOT NULL;
```

---

## What NOT to Save

| Don't save | Why | Alternative |
|---|---|---|
| Full LLM completions | Tokens, noise, not searchable | Save structured output only |
| Chat history | Not decision-relevant | Save key decisions from the session |
| Timestamps of user actions | Not useful for future decisions | Only save behavior patterns |
| Intermediate reasoning | Changes per run, not stable | Save conclusions |
| Duplicate information | Increases noise in retrieval | Check before saving, update if exists |
| Low-confidence guesses | Pollutes retrieval quality | Label as hypothesis or don't save |
| User PII | Privacy risk | Save behavior patterns, not identity data |

---

*v0.1 simplification: Session memory is in-process only (no persistence). Project memory and Decision memory are persisted. Other types are v0.2.*
