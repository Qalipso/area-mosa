# Workflow Architecture

## Request Processing Pipeline

Every user request passes through the same pipeline. Steps are mandatory; order is fixed at the pipeline level (individual agents may work in parallel within their stage).

```
Stage 0: Intent parsing
Stage 1: CEO — goal framing
Stage 2: Orchestrator — execution planning
Stage 3: Agent execution (parallel/sequential per plan)
Stage 4: QA validation
Stage 5: Documentation Agent — artifact assembly
Stage 6: Output delivery to user
```

---

## Stage 0: Intent Parsing

Before any agent runs, the system classifies the request:

```
request_type:
  - feature_development     → full agent chain
  - research_request        → Research + CI + optionally CEO + PM
  - documentation_update    → Docs Agent only (with context)
  - product_decision        → CEO + relevant specialists
  - competitive_analysis    → Research + CI + Growth
  - architecture_review     → Backend + Frontend + AI Engineer + Security

urgency:
  - blocking    → human review gates are compressed
  - normal      → standard flow
  - background  → can queue, low priority
```

**Why this matters**: A documentation update request should not trigger the full CEO→PM→Research chain. The Orchestrator uses intent classification to scope the agent team.

---

## Stage 1: CEO Agent — Goal Framing

**Always runs first.** Always.

CEO Agent:
1. Reads project memory for context
2. Reads recent decision log for constraints
3. Produces a **goal brief** (structured):

```json
{
  "goal": "Improve Shadow onboarding completion rate",
  "constraints": [
    "Must not require email until step 3 (per ADR-012)",
    "Mobile-first layout (per project constraints)",
    "No new backend infrastructure in v0.1"
  ],
  "success_criteria": [
    "Onboarding can be completed in under 2 minutes",
    "Each step has a defined empty and error state",
    "QA passes all acceptance criteria"
  ],
  "non_goals": [
    "Social login integration",
    "Progress saved across sessions (deferred)"
  ],
  "confidence": 0.85
}
```

**If confidence < 0.6**: CEO flags for human review before Orchestrator runs.

---

## Stage 2: Orchestrator — Execution Planning

Orchestrator receives the goal brief and builds an execution plan.

**Plan structure**:
```json
{
  "run_id": "run_abc123",
  "stages": [
    {
      "stage": 1,
      "agents": ["research", "competitor_intel"],
      "execution": "parallel",
      "outputs_required": ["research_notes", "competitor_matrix"]
    },
    {
      "stage": 2,
      "agents": ["pm"],
      "execution": "sequential",
      "depends_on": ["research_notes", "competitor_matrix"],
      "outputs_required": ["prd_section", "user_stories", "acceptance_criteria"]
    },
    {
      "stage": 3,
      "agents": ["ux"],
      "execution": "sequential",
      "depends_on": ["user_stories"],
      "outputs_required": ["user_flow", "edge_states"]
    },
    {
      "stage": 4,
      "agents": ["frontend", "backend", "ai_engineer"],
      "execution": "parallel",
      "depends_on": ["user_flow", "acceptance_criteria"],
      "outputs_required": ["impl_plan", "api_spec", "ai_behavior_spec"]
    },
    {
      "stage": 5,
      "agents": ["qa"],
      "execution": "sequential",
      "depends_on": ["impl_plan", "api_spec", "ai_behavior_spec", "acceptance_criteria"],
      "outputs_required": ["test_plan", "quality_report"]
    },
    {
      "stage": 6,
      "agents": ["docs"],
      "execution": "sequential",
      "depends_on": ["ALL"],
      "outputs_required": ["documentation_update"]
    }
  ]
}
```

**Parallel execution rules**:
- Agents can run in parallel if neither depends on the other's output
- Research + Competitor Intel always parallel
- Frontend + Backend + AI Engineer parallel once UX is done
- QA always sequential (needs all prior outputs)
- Docs always last

---

## Stage 3: Agent Execution

Each agent receives a **task packet**:

```json
{
  "task_id": "task_789",
  "run_id": "run_abc123",
  "agent_id": "ux",
  "instruction": "Design the onboarding flow based on PM requirements and research findings",
  "context": {
    "project_memory_keys": ["vision", "constraints", "tech_stack"],
    "prior_outputs": {
      "pm": "artifact:art_101",
      "research": "artifact:art_102"
    }
  },
  "required_outputs": ["user_flow", "ia_diagram", "edge_states"],
  "timeout_ms": 30000,
  "confidence_threshold": 0.7
}
```

**Agent execution loop**:
1. Read task packet
2. Retrieve relevant memory (session + project + agent-specific)
3. Read referenced artifacts from prior agents
4. Execute (LLM call with structured output schema)
5. Validate output against required_outputs
6. Write output artifacts
7. Update session memory with completion state
8. Emit handoff packet for next agent(s)

**Timeout handling**: If agent exceeds timeout, Orchestrator flags it, generates partial output, routes to human review.

---

## Stage 4: QA Validation

QA Agent receives all artifacts from the current run and:

1. Checks every acceptance criterion: does an artifact address it?
2. Identifies unaddressed edge cases
3. Produces a quality report:

```json
{
  "run_id": "run_abc123",
  "criteria_coverage": {
    "total": 8,
    "covered": 7,
    "uncovered": ["Error state for step 2 not specified in UX flow"]
  },
  "quality_score": 0.875,
  "passed": true,
  "flags": ["UX flow missing error state for step 2"],
  "test_plan_artifact": "art_200"
}
```

**If `quality_score < 0.7`**: run is flagged, Orchestrator may re-dispatch the failing agent with specific remediation instructions.

---

## Stage 5: Documentation Assembly

Documentation Agent runs unconditionally at the end of every run. It:

1. Reads all artifacts produced in this run
2. Identifies which documentation files are affected
3. Generates updates (never overwrites — always versions)
4. Appends changelog entry
5. Updates decision log if any decisions were made
6. Flags significantly changed docs for human review

---

## Stage 6: Output Delivery

User receives:
```
Run summary:
  - What was requested
  - Which agents participated
  - What was produced

Artifacts:
  - [links to each artifact]

Documentation updated:
  - [list of docs with changes]

Open questions (if any):
  - [questions agents couldn't resolve, need user input]

Quality: PASSED / NEEDS REVIEW
  - [QA summary]
```

---

## Handoff Protocol

Agents communicate via structured handoff packets (see AGENTS.md). Key rules:

**Rule 1: No implicit context passing**  
An agent cannot assume the receiving agent knows what happened. Every handoff packet must be self-contained.

**Rule 2: Open questions are explicit**  
If an agent has unresolved questions, they are listed in the handoff as `open_questions`. The receiving agent decides whether to proceed or surface to human.

**Rule 3: Confidence travels with data**  
Every handoff includes a `confidence` score. If any agent receives a handoff with `confidence < 0.6`, it must flag to Orchestrator rather than proceeding.

**Rule 4: Artifact references, not content**  
Agents reference artifacts by ID, not by copying content. This prevents duplication and ensures the artifact store is the single source of truth.

---

## Human Review Integration

Human review checkpoints exist at:

1. **Post-CEO**: if goal brief confidence < 0.6 (project memory insufficient)
2. **Post-planning**: if execution plan has ambiguous dependencies
3. **Per-agent**: if agent output confidence < 0.6 (labeled, not blocking by default)
4. **Security Agent outputs**: always require human sign-off
5. **AI/LLM Engineer outputs**: always require human sign-off
6. **Post-QA**: if quality_score < 0.7, blocking

**Human review UX**:
- Flagged items shown in run output with context
- User can: approve, edit, or reject and re-run with instructions
- Re-run sends agent-specific feedback via task packet

---

## Error Handling

| Error type | Response |
|---|---|
| Agent timeout | Partial output flagged, human review |
| Tool call failure | Agent retries once, then flags and continues without tool |
| Low confidence output | Flagged in output, not blocking unless security/AI |
| Missing dependency | Orchestrator holds stage, waits for dependency (max 2x timeout) |
| QA failure (score < 0.7) | Orchestrator re-dispatches failing agent with remediation |
| Complete run failure | Run marked failed, partial artifacts saved, user notified |

---

## Workflow Examples

### Minimal run (documentation update)
```
User: "Update the README to reflect the new onboarding flow"
→ Intent: documentation_update
→ Docs Agent reads recent onboarding artifacts
→ Docs Agent produces updated README
→ No CEO, Orchestrator, or specialist agents invoked
```

### Full product feature run
```
User: "Add a referral system to Shadow"
→ Intent: feature_development
→ CEO → Orchestrator → [Research || CI] → PM → UX → [Frontend || Backend || AI Engineer] → QA → Docs
→ ~12 artifacts produced
→ Full run: estimated 3–8 minutes (assumption; depends on LLM latency)
```

### Decision run
```
User: "Should we use Clerk or roll our own auth?"
→ Intent: product_decision
→ CEO frames criteria → Backend Engineer analyzes options → Security reviews implications
→ Docs Agent writes ADR
→ Decision saved to decision memory
```

---

*v0.1 simplification: parallel execution is sequential in v0.1 (simpler to implement). True parallel execution is v0.2.*
