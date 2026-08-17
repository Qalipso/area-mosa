# Agent Architecture

## Core Principle

**Agent = Role + Inputs + Outputs + Tools + Memory Scope + Quality Criteria**

An agent is not a personality or a chatbot wrapper. It is a defined unit of responsibility with:
- A clear scope it owns
- Defined inputs it accepts
- Defined outputs it must produce
- Tools it can call
- Memory it reads and writes
- Quality criteria that validate its output

---

## Agent Schema

Every agent is defined by this structure:

```
id:              slug (e.g., "pm", "research", "qa")
name:            display name
role:            one-line description of responsibility
triggers:        what initiates this agent
inputs:
  - from_user:   what the user provides
  - from_agents: what other agents provide as handoff
  - from_memory: what it reads from memory
outputs:
  - artifacts:   documents/files produced
  - to_agents:   structured handoff data passed forward
  - to_memory:   what it writes to memory
tools:           list of callable tools
memory_scope:
  reads:         memory types this agent reads
  writes:        memory types this agent writes
quality_criteria:
  - specific, evaluable criteria for output validation
can_handoff_to:  agents this agent may activate next
requires_human_review: false | "on_low_confidence" | "always"
```

---

## Agents

### 1. CEO Agent

```
id: ceo
name: CEO Agent
role: Frames strategic context, defines constraints, makes final calls on trade-offs
```

**Triggers**: Every user request (always runs first), or when an unresolvable conflict arises between agents

**Inputs**:
- `from_user`: raw user request
- `from_memory/project`: current product vision, priorities, known constraints
- `from_memory/decision`: prior decisions that bound the solution space

**Outputs**:
- `artifacts`: goal brief (structured: goal, constraints, success criteria, non-goals)
- `to_agents`: scoped request for Orchestrator with explicit constraints
- `to_memory/decision`: if a strategic trade-off is resolved, logs the decision

**Tools**:
- `read_project_memory`
- `read_decision_log`
- `write_goal_brief`
- `flag_for_human_review`

**Memory Scope**:
- Reads: project memory, decision memory, user memory
- Writes: decision memory

**Quality Criteria**:
- Goal brief has explicit success criteria (not vague)
- Non-goals are listed (scope boundaries)
- Constraints reference prior decisions, not invented ones
- No strategy invented without project memory basis

**Handoffs to**: Orchestrator  
**Human Review**: on_low_confidence (when project memory is empty or conflicting)

---

### 2. Chief of Staff / Orchestrator Agent

```
id: orchestrator
name: Chief of Staff / Orchestrator
role: Decomposes requests into tasks, assigns agents, manages execution flow, collects results
```

**Triggers**: After CEO Agent produces a goal brief

**Inputs**:
- `from_agents/ceo`: scoped goal brief with constraints
- `from_memory/project`: current state of the project (what's done, what's pending)

**Outputs**:
- `artifacts`: execution plan (agents, order, dependencies, expected outputs)
- `to_agents`: task packets dispatched to each assigned agent
- `to_memory/session`: current run plan and state

**Tools**:
- `build_execution_plan`
- `dispatch_task`
- `read_agent_availability` *(v0.2+)*
- `collect_handoff_results`
- `write_run_summary`

**Memory Scope**:
- Reads: session memory, project memory
- Writes: session memory, artifact memory (run plan)

**Quality Criteria**:
- Execution plan has no circular dependencies
- Every task has a defined owner and expected output type
- Plan does not duplicate work already in project memory
- Parallel tasks are correctly identified (no false sequencing)

**Handoffs to**: any specialist agent  
**Human Review**: on_low_confidence (when dependencies are ambiguous)

---

### 3. Product Manager Agent

```
id: pm
name: Product Manager Agent
role: Translates goals into structured product requirements
```

**Triggers**: Dispatched by Orchestrator for any feature or product design request

**Inputs**:
- `from_agents/orchestrator`: task packet (goal, constraints, target area)
- `from_memory/project`: existing PRD, roadmap, MVP scope

**Outputs**:
- `artifacts`: PRD update or new PRD section, user stories, acceptance criteria
- `to_agents`: requirements handoff to UX, Frontend, Backend, AI Engineer
- `to_memory/project`: updated feature scope and priorities

**Tools**:
- `read_project_memory`
- `write_prd_section`
- `generate_user_stories`
- `set_acceptance_criteria`
- `update_roadmap`

**Memory Scope**:
- Reads: project memory, artifact memory (existing PRD)
- Writes: project memory, artifact memory

**Quality Criteria**:
- Every user story has: As a [who], I want [what], so that [why]
- Acceptance criteria are testable (not "it should feel good")
- MVP scope is explicit: what's in, what's deferred
- No requirements invented without either user input or research backing

**Handoffs to**: UX Architect, Frontend Engineer, Backend Engineer, AI/LLM Engineer  
**Human Review**: on_low_confidence

---

### 4. Research Agent

```
id: research
name: Research Agent
role: Produces source-backed market research, user insight, and trend analysis
```

**Triggers**: Dispatched for any request requiring external knowledge or validation

**Inputs**:
- `from_agents/orchestrator`: research brief (what to find, what format)
- `from_memory/project`: what's already known (to avoid redundancy)

**Outputs**:
- `artifacts`: research notes with sources, key findings, labeled assumptions
- `to_agents`: findings handoff to Competitor Intelligence, PM, UX
- `to_memory/project`: key validated insights

**Tools**:
- `web_search`
- `summarize_source`
- `save_research_doc`
- `check_existing_research_memory`
- `label_assumption` *(marks unverified claims)*

**Memory Scope**:
- Reads: project memory, research source memory
- Writes: research source memory, artifact memory

**Quality Criteria**:
- Every factual claim has a source citation or is explicitly labeled as assumption
- No invented statistics or fake market data
- Contradictory sources are flagged, not silently resolved
- Research findings are relevant to the specific request (no generic content)

**Handoffs to**: Competitor Intelligence Agent, PM Agent, UX Architect  
**Human Review**: on_low_confidence (when sources are thin or conflicting)

---

### 5. Competitor Intelligence Agent

```
id: competitor_intel
name: Competitor Intelligence Agent
role: Maintains competitor matrix, identifies positioning gaps, tracks feature parity
```

**Triggers**: Dispatched for competitive research requests or when Research Agent identifies competitors

**Inputs**:
- `from_agents/research`: raw competitor mentions and sources
- `from_memory/project`: existing competitor records

**Outputs**:
- `artifacts`: competitor matrix update, feature comparison, positioning gap analysis
- `to_agents`: competitive context handoff to CEO, PM, Growth Agent
- `to_memory/project`: updated competitor records

**Tools**:
- `web_search`
- `read_competitor_memory`
- `update_competitor_matrix`
- `compare_features`
- `identify_positioning_gap`

**Memory Scope**:
- Reads: project memory, artifact memory (existing competitor docs)
- Writes: artifact memory, project memory

**Quality Criteria**:
- Feature comparisons reference observable product behavior, not marketing copy
- Pricing data is sourced and dated (pricing changes frequently)
- Positioning gaps are stated as observations, not conclusions, unless evidence is strong
- No invented features attributed to competitors

**Handoffs to**: CEO Agent, PM Agent, Growth/Marketing Agent  
**Human Review**: on_low_confidence

---

### 6. Business / Data Analyst Agent

```
id: analyst
name: Business / Data Analyst Agent
role: Defines metrics, funnels, hypotheses, and measurement plans
```

**Triggers**: Dispatched when a request involves metrics, analytics, retention, or hypothesis validation

**Inputs**:
- `from_agents/pm`: requirements and goals
- `from_memory/project`: existing metrics definitions and analytics setup

**Outputs**:
- `artifacts`: metrics definition doc, funnel analysis, event tracking plan, hypothesis spec
- `to_agents`: measurement framework handoff to Backend, Frontend
- `to_memory/project`: key metrics and tracking plan

**Tools**:
- `read_project_memory`
- `write_metrics_doc`
- `define_funnel`
- `generate_event_tracking_plan`
- `write_hypothesis`

**Memory Scope**:
- Reads: project memory, artifact memory
- Writes: artifact memory, project memory

**Quality Criteria**:
- Metrics are specific and measurable (not "engagement")
- Funnels have defined entry and exit events
- Hypotheses are stated as: "We believe [X] will cause [Y], measured by [Z]"
- No claimed metrics without an associated measurement method

**Handoffs to**: Frontend Engineer, Backend Engineer  
**Human Review**: on_low_confidence

---

### 7. UX Architect Agent

```
id: ux
name: UX Architect Agent
role: Designs user flows, information architecture, and interaction logic
```

**Triggers**: Dispatched for any feature or product area affecting user experience

**Inputs**:
- `from_agents/pm`: requirements, user stories, acceptance criteria
- `from_agents/research`: user pain points and behavioral insights
- `from_memory/project`: existing UX flows and design system constraints

**Outputs**:
- `artifacts`: user flow (text/structured), IA diagram, empty/error/loading state specs
- `to_agents`: flow handoff to UI Designer, Frontend Engineer
- `to_memory/project`: updated UX flows

**Tools**:
- `read_project_memory`
- `write_user_flow`
- `write_ia_diagram`
- `specify_edge_states` *(empty, error, loading, success)*
- `write_ux_doc`

**Memory Scope**:
- Reads: project memory, artifact memory (existing flows)
- Writes: artifact memory, project memory

**Quality Criteria**:
- Every flow has: entry state, steps, exit states, error states
- Empty states and error states are specified (not left implicit)
- IA reflects actual navigation hierarchy (not aspirational)
- No UX flows that contradict PM requirements

**Handoffs to**: UI Designer, Frontend Engineer  
**Human Review**: on_low_confidence

---

### 8. UI Designer Agent

```
id: ui
name: UI Designer Agent
role: Specifies visual design, component behavior, and design system extensions
```

**Triggers**: Dispatched after UX Architect produces flows

**Inputs**:
- `from_agents/ux`: user flows and IA
- `from_memory/project`: design system, existing component library

**Outputs**:
- `artifacts`: component spec, spacing/typography spec, animation notes, design critique
- `to_agents`: design handoff to Frontend Engineer
- `to_memory/project`: design system updates

**Tools**:
- `read_design_system_memory`
- `write_component_spec`
- `write_design_notes`
- `flag_design_inconsistency`

**Memory Scope**:
- Reads: project memory, artifact memory (design system, existing components)
- Writes: artifact memory

**Quality Criteria**:
- Component specs reference design system tokens (not ad-hoc values)
- Interaction states specified (default, hover, active, disabled, error)
- Animation specs include: trigger, duration, easing, purpose
- Flags when requested design is inconsistent with existing system

**Handoffs to**: Frontend Engineer  
**Human Review**: on_low_confidence

---

### 9. Frontend Engineer Agent

```
id: frontend
name: Frontend Engineer Agent
role: Produces implementation plans, component specs, and API integration requirements
```

**Triggers**: Dispatched for any feature requiring UI implementation

**Inputs**:
- `from_agents/ux`: user flows
- `from_agents/ui`: component and design specs
- `from_agents/pm`: acceptance criteria
- `from_memory/project`: tech stack, existing components, architectural constraints

**Outputs**:
- `artifacts`: frontend implementation plan, component list, state management notes, API contract requirements
- `to_agents`: API requirements handoff to Backend Engineer
- `to_memory/project`: tech decisions made

**Tools**:
- `read_project_memory`
- `write_implementation_plan`
- `write_component_list`
- `write_api_requirements`
- `flag_tech_debt`

**Memory Scope**:
- Reads: project memory, artifact memory (tech stack, existing impl)
- Writes: artifact memory, decision memory (if tech choice made)

**Quality Criteria**:
- Implementation plan references real components (not generic "build a button")
- State management approach justified by project constraints
- API requirements are specific (endpoint, method, request/response shape)
- Loading, error, and empty states accounted for in plan

**Handoffs to**: Backend Engineer, QA/Test Agent  
**Human Review**: on_low_confidence

---

### 10. Backend Engineer Agent

```
id: backend
name: Backend Engineer Agent
role: Designs API contracts, database changes, service logic, and integration specs
```

**Triggers**: Dispatched when a feature requires server-side work

**Inputs**:
- `from_agents/frontend`: API requirements
- `from_agents/pm`: data model requirements
- `from_memory/project`: existing DB schema, API structure, auth model

**Outputs**:
- `artifacts`: API spec (endpoints, request/response), DB schema changes, service design notes
- `to_agents`: API contract handoff to Frontend, data schema handoff to AI Engineer
- `to_memory/project`: DB schema updates, API structure updates

**Tools**:
- `read_project_memory`
- `write_api_spec`
- `write_db_schema_delta`
- `write_service_design`
- `flag_breaking_change`

**Memory Scope**:
- Reads: project memory, artifact memory (existing schema and API)
- Writes: artifact memory, decision memory (if schema decision made)

**Quality Criteria**:
- API spec follows REST conventions (or project's existing convention)
- DB changes are additive where possible; breaking changes explicitly flagged
- Auth and permissions modeled for every endpoint
- No schema changes without considering migration impact

**Handoffs to**: Frontend Engineer, AI/LLM Engineer, DevOps Agent  
**Human Review**: on_low_confidence

---

### 11. AI / LLM Engineer Agent

```
id: ai_engineer
name: AI/LLM Engineer Agent
role: Designs prompt architecture, tool calling, memory retrieval, and eval strategy
```

**Triggers**: Dispatched for any request involving AI behavior, prompts, memory, or model outputs

**Inputs**:
- `from_agents/pm`: requirements for AI-driven features
- `from_agents/backend`: data structures the AI layer will use
- `from_memory/project`: existing prompt library, memory schema, eval history

**Outputs**:
- `artifacts`: prompt spec, tool call definition, memory retrieval design, eval criteria, hallucination risk notes
- `to_agents`: AI behavior spec handoff to Backend, QA
- `to_memory/eval`: prompt performance notes, known failure modes

**Tools**:
- `read_project_memory`
- `write_prompt_spec`
- `write_tool_call_definition`
- `write_memory_retrieval_design`
- `write_eval_criteria`
- `flag_hallucination_risk`

**Memory Scope**:
- Reads: project memory, eval memory, agent memory
- Writes: artifact memory, eval memory

**Quality Criteria**:
- Prompts specify: role, task, constraints, output format
- Tool calls specify: function signature, input validation, failure behavior
- Memory retrieval strategy accounts for context window limits
- Eval criteria are specific and measurable (not "check if it sounds good")
- Hallucination risks are documented, not ignored

**Handoffs to**: Backend Engineer, QA/Test Agent  
**Human Review**: always (AI behavior changes are high-stakes)

---

### 12. QA / Test Agent

```
id: qa
name: QA/Test Agent
role: Produces test plans, edge case analysis, and acceptance criteria validation
```

**Triggers**: Dispatched at the end of every run; also triggered when agent outputs need validation

**Inputs**:
- `from_agents/*`: all artifacts from the current run
- `from_agents/pm`: acceptance criteria
- `from_memory/project`: existing test plans, known bugs

**Outputs**:
- `artifacts`: test plan, edge case list, Playwright test sketches, regression check notes
- `to_agents`: quality report back to Orchestrator; bug reports to relevant agents
- `to_memory/eval`: test outcomes and known failure modes

**Tools**:
- `read_all_run_artifacts`
- `validate_acceptance_criteria`
- `write_test_plan`
- `write_edge_cases`
- `write_playwright_test_sketch`
- `flag_quality_issue`

**Memory Scope**:
- Reads: session memory (current run artifacts), eval memory
- Writes: artifact memory, eval memory

**Quality Criteria**:
- Every acceptance criterion has at least one test case
- Edge cases include: empty states, permission boundaries, concurrent operations, API failures
- Test plan distinguishes unit, integration, and E2E tests
- Quality report does not pass if acceptance criteria are unvalidated

**Handoffs to**: Orchestrator (with quality report)  
**Human Review**: on_low_confidence

---

### 13. Security & Privacy Agent

```
id: security
name: Security & Privacy Agent
role: Reviews data access, prompt injection risks, PII handling, and permission models
```

**Triggers**: Dispatched for any run touching user data, auth, AI inputs, or integrations

**Inputs**:
- `from_agents/backend`: API spec, DB schema, auth model
- `from_agents/ai_engineer`: prompt design, tool calls
- `from_memory/project`: existing security decisions

**Outputs**:
- `artifacts`: security review notes, PII handling spec, prompt injection risk assessment
- `to_agents`: security flags to Backend, AI Engineer, DevOps
- `to_memory/decision`: security decisions and their rationale

**Tools**:
- `review_api_spec_for_security`
- `review_prompt_for_injection`
- `check_pii_exposure`
- `write_security_review`
- `flag_security_risk`

**Memory Scope**:
- Reads: artifact memory (current run specs), decision memory
- Writes: decision memory, artifact memory

**Quality Criteria**:
- Every endpoint reviewed for: auth requirement, permission scope, rate limiting need
- Prompt injection risks documented for any user-controlled input
- PII is identified and handling described (not assumed safe)
- No "probably fine" assessments — explicit clear or flag

**Handoffs to**: Backend Engineer, AI/LLM Engineer, DevOps Agent  
**Human Review**: always (security decisions require human sign-off)

---

### 14. DevOps Agent

```
id: devops
name: DevOps Agent
role: Plans deployment, CI/CD, monitoring, and environment requirements
```

**Triggers**: Dispatched when a run produces backend changes or infrastructure requirements

**Inputs**:
- `from_agents/backend`: services and APIs to deploy
- `from_memory/project`: existing infrastructure, environment configs

**Outputs**:
- `artifacts`: deployment plan, CI/CD spec, monitoring requirements, cost estimate notes
- `to_memory/project`: infrastructure decisions

**Tools**:
- `read_project_memory`
- `write_deployment_plan`
- `write_cicd_spec`
- `write_monitoring_requirements`
- `estimate_infra_cost` *(assumption: rough order-of-magnitude only)*

**Memory Scope**:
- Reads: project memory, artifact memory
- Writes: artifact memory, decision memory

**Quality Criteria**:
- Deployment plan covers: environments, migration steps, rollback procedure
- CI/CD spec includes: test gates, build steps, deploy triggers
- Monitoring plan includes: what to alert on, not just what to log
- Cost estimates clearly labeled as rough assumptions

**Handoffs to**: Backend Engineer, Documentation Agent  
**Human Review**: on_low_confidence

---

### 15. Documentation Agent

```
id: docs
name: Documentation Agent
role: Creates and maintains all project documentation; runs after every session
```

**Triggers**: Always runs at the end of every run; also triggered on explicit documentation requests

**Inputs**:
- `from_agents/*`: all artifacts from the current run
- `from_memory/project`: existing documentation state
- `from_memory/decision`: decisions made in this run

**Outputs**:
- `artifacts`: updated documentation files (README, PRD, ARCHITECTURE, API docs, etc.)
- `to_memory/artifact`: updated documentation index

**Tools**:
- `read_all_run_artifacts`
- `update_readme`
- `update_prd`
- `update_architecture_doc`
- `update_api_doc`
- `write_changelog_entry`
- `write_decision_log`
- `create_new_doc`

**Memory Scope**:
- Reads: session memory, artifact memory, decision memory
- Writes: artifact memory

**Quality Criteria**:
- No documentation created without a corresponding artifact to base it on
- Changelog entries are specific (what changed, not "updated stuff")
- Decision logs include: decision, reason, alternatives considered, consequences
- Docs are versioned — previous version is never silently overwritten

**Handoffs to**: (terminal node — no handoff)  
**Human Review**: on_low_confidence

---

### 16. Growth / Marketing Agent

```
id: growth
name: Growth / Marketing Agent
role: Produces positioning, messaging, ICP analysis, and launch planning
```

**Triggers**: Dispatched for marketing, launch, positioning, or content requests

**Inputs**:
- `from_agents/competitor_intel`: competitor positioning
- `from_agents/pm`: product capabilities and differentiators
- `from_memory/project`: existing messaging, ICP definition

**Outputs**:
- `artifacts`: positioning statement, landing page copy outline, ICP definition, launch checklist
- `to_memory/project`: updated positioning and ICP

**Tools**:
- `read_project_memory`
- `write_positioning_doc`
- `write_landing_copy`
- `define_icp`
- `write_launch_checklist`

**Memory Scope**:
- Reads: project memory, artifact memory
- Writes: artifact memory, project memory

**Quality Criteria**:
- Positioning is differentiating (not "AI-powered platform")
- ICP has: job title, company size, key problem, why they'd pay
- Copy does not use invented metrics or fake social proof
- Launch checklist is specific and sequenced

**Handoffs to**: Documentation Agent  
**Human Review**: on_low_confidence

---

### 17. Customer Discovery Agent

```
id: customer_discovery
name: Customer Discovery Agent
role: Produces interview scripts, objection maps, and feedback synthesis frameworks
```

**Triggers**: Dispatched for customer research, validation, or discovery requests

**Inputs**:
- `from_agents/pm`: assumptions to validate
- `from_memory/project`: existing customer knowledge

**Outputs**:
- `artifacts`: interview script, objection analysis, willingness-to-pay notes, demo flow
- `to_memory/project`: customer insight updates

**Tools**:
- `read_project_memory`
- `write_interview_script`
- `write_objection_map`
- `write_demo_flow`
- `synthesize_feedback`

**Memory Scope**:
- Reads: project memory, user memory
- Writes: project memory, artifact memory

**Quality Criteria**:
- Interview questions are open-ended (not leading)
- Objection map distinguishes: real objections vs. excuses vs. timing
- Willingness-to-pay notes are based on actual signals, not guesses
- Feedback synthesis distinguishes: validated beliefs vs. hypotheses

**Handoffs to**: PM Agent, CEO Agent  
**Human Review**: on_low_confidence

---

## Agent Communication Protocol

Agents communicate via structured **handoff packets**:

```json
{
  "from_agent": "ux",
  "to_agent": "frontend",
  "run_id": "run_abc123",
  "task_id": "task_456",
  "handoff_type": "flow_complete",
  "payload": {
    "artifact_ids": ["art_789", "art_790"],
    "key_decisions": ["Onboarding is 3 steps max", "Email is optional on step 1"],
    "open_questions": ["Should step 2 be skippable?"],
    "confidence": 0.85
  }
}
```

**Confidence scoring** (0.0–1.0):
- `< 0.6`: flag for human review before proceeding
- `0.6–0.8`: proceed with human review flag attached to output
- `> 0.8`: proceed, no mandatory review

---

*All agents in v0.1 are implemented as LLM calls with structured prompts and output schemas. Tool calls are real functions — not simulated. Agents do not invent data.*
