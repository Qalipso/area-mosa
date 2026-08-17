# Risks and Mitigations

---

## R-01: Hallucination in Agent Outputs

**Category**: Quality  
**Severity**: High  
**When it happens**: Research Agent invents market data, Competitor Intel invents features, PM Agent invents user needs

**Mitigation**:
1. Research Agent must cite sources for every factual claim. Uncited claims are labeled `[Assumption: unverified]`
2. QA Agent validates that factual claims in artifacts link to research sources
3. `is_assumption` flag in `research_sources` table for unverified content
4. System prompt for all agents: "If you don't know, say so explicitly. Do not invent data."
5. Eval memory tracks prompts that produced hallucinations; they are flagged for revision

**Residual risk**: LLMs will still hallucinate. The system catches it; it does not prevent it at the model level.

---

## R-02: Fake or Invented Metrics

**Category**: Quality / Trust  
**Severity**: High  
**When it happens**: Business Analyst invents conversion rates, Research Agent cites fake statistics, Growth Agent uses synthetic social proof

**Mitigation**:
1. Business Analyst Agent: only derives metrics from project memory or explicitly labeled assumptions
2. Prohibited pattern in prompts: "X% of users" without a source
3. `is_assumption` field must be true for any metric not sourced from a real artifact
4. Documentation Agent reviews metrics in artifacts before saving to documentation
5. QA Agent flags any metric without a source reference

**Absolute rule**: No synthetic metrics are ever surfaced to users without an explicit assumption label.

---

## R-03: Agent Output Drift (Documentation Diverges from Reality)

**Category**: Documentation quality  
**Severity**: Medium  
**When it happens**: Documentation is updated in one run but related documents are not; PRD says X but ARCHITECTURE says Y

**Mitigation**:
1. Documentation Agent maps artifact types to affected documents (explicit mapping table)
2. When a document is updated, Documentation Agent checks for related documents that may need updates
3. Contradiction detection: if new artifact contradicts existing doc, flag for human review (not auto-resolve)
4. Version history: always retrievable, so drift can be identified and corrected

**Residual risk**: Cross-document consistency is hard to fully automate. Human review is the final gate.

---

## R-04: Agent Chaos (Agents Contradict Each Other)

**Category**: System reliability  
**Severity**: Medium  
**When it happens**: PM requires X, UX designs against X, Frontend implements Y, no one catches it

**Mitigation**:
1. Orchestrator holds the execution plan — no agent starts without receiving the goal brief and PM requirements
2. Every agent receives a task packet with context from prior agents (not just the original request)
3. QA Agent explicitly checks acceptance criteria from PM against UX and implementation outputs
4. Handoff packets include `open_questions`: unresolved items surface before the next agent runs
5. Confidence scores propagate: if PM output is low confidence, UX starts with a caution flag

---

## R-05: Overengineering the MVP

**Category**: Execution  
**Severity**: High  
**When it happens**: v0.1 scope expands to include all 17 agents, full memory system, parallel execution, integrations

**Mitigation**:
1. v0.1 scope is hard-capped: 5 agents, sequential execution, no vector memory, no integrations
2. Every feature request during v0.1 is evaluated against: "Does this validate the core loop?"
3. "NOT in scope" list is maintained and visible (see MVP_PLAN.md)
4. Weekly scope check: if work takes >6 weeks, cut scope, don't slip timeline

---

## R-06: Privacy and PII Exposure

**Category**: Security / Legal  
**Severity**: High  
**When it happens**: User inputs customer data into a request; Research Agent sends sensitive data to external APIs; Memory stores PII

**Mitigation**:
1. Memory system does not store PII (rule: save behavior patterns, not identity data)
2. Research Agent uses web search — no user data is passed to search queries
3. LLM API calls: user data in prompts must be explicitly reviewed (Security Agent)
4. No third-party analytics on content (only on usage metadata)
5. Data retention policy: session memory deleted on run end; project memory deletable by user
6. v0.1 does not handle customer data — it handles product building data only

**Residual risk**: If users paste customer data into requests, the system cannot fully prevent it. Add PII detection in v0.2.

---

## R-07: Prompt Injection

**Category**: Security  
**Severity**: High  
**When it happens**: User request contains adversarial instructions; competitor content loaded by Research Agent contains injected instructions

**Mitigation**:
1. AI/LLM Engineer Agent explicitly reviews prompt designs for injection vectors
2. Web search results are summarized by Research Agent — not passed raw into downstream prompts
3. User input is parameterized, not concatenated directly into system prompts
4. Security Agent reviews any flow where external content reaches LLM prompts

---

## R-08: Tool Failure Cascades

**Category**: Reliability  
**Severity**: Medium  
**When it happens**: web_search fails, LLM API is down, artifact save fails — one failure blocks the whole run

**Mitigation**:
1. Tool call failures: agent retries once, then continues with explicit "tool unavailable" note in output
2. LLM API timeout: Orchestrator sets per-step timeout; timed-out steps produce partial output with flag
3. Artifact save failure: run is marked failed, partial artifacts retained, user notified
4. Circuit breaker: if 3 consecutive tool calls fail, agent stops and flags for human review

---

## R-09: Context Window Exhaustion

**Category**: Technical  
**Severity**: Medium  
**When it happens**: Project memory + current run context + all prior agent outputs exceed LLM context window

**Mitigation**:
1. Agents receive structured summaries, not full artifact content (artifact references, not dumps)
2. Memory retrieval returns top-k by relevance, not all memories
3. Run context is compressed by Orchestrator before each agent step
4. Monitor: if context window usage exceeds 80%, log and alert (measurement tool, not threshold enforcement)
5. v0.2: pgvector allows semantic retrieval of only the most relevant memory chunks

---

## R-10: Cost Overrun (LLM API Costs)

**Category**: Business  
**Severity**: Medium (for users), Low (for v0.1 internal use)  
**When it happens**: Full 17-agent run on a complex request uses significant tokens

**Mitigation**:
1. Per-run cost estimate shown to user before run starts (in v0.2)
2. Agents use smallest capable model for each task (not GPT-4o for all steps)
3. Memory compression reduces repeated context tokens
4. Run tracing includes token usage per agent step
5. User can set cost limit per run (v0.2 feature)

**Assumption**: Token costs will decline over time; cost sensitivity may decrease.

---

## R-11: Low Agent Output Quality (Generic, Unhelpful)

**Category**: Product  
**Severity**: High  
**When it happens**: Agent outputs are so generic they're not useful ("create a good UX flow" → "make it user-friendly")

**Mitigation**:
1. Agents receive task packets with specific context — not just the raw user request
2. Output schemas enforce structure (user stories must have As/Want/So format; flows must have edge states)
3. QA Agent validates against acceptance criteria before output is delivered
4. Eval memory accumulates prompts that produced high-quality outputs
5. User feedback on run quality is collected and used to improve prompts

---

## R-12: Loss of Trust from Incorrect Technical Advice

**Category**: Trust / Legal  
**Severity**: Medium  
**When it happens**: Backend Agent recommends an insecure auth pattern; AI Engineer Agent recommends a prompt design that causes hallucinations; user implements it without review

**Mitigation**:
1. All technical recommendations are labeled as plans, not implementations
2. Security Agent always reviews Backend + AI Engineer outputs
3. Human review is mandatory for Security and AI Engineer outputs
4. System UI: "These are plans, not implementations. Review before building."
5. No agent output is labeled as "approved for production" without explicit human sign-off

---

## Risk Summary

| Risk | Severity | Likelihood | Owner |
|---|---|---|---|
| Hallucination | High | High | Prompt design + QA Agent |
| Fake metrics | High | Medium | Prompt design + source requirement |
| Documentation drift | Medium | High | Documentation Agent + contradiction detection |
| Agent chaos | Medium | Medium | Orchestrator + handoff protocol |
| Overengineering MVP | High | High | Product discipline |
| PII exposure | High | Low (v0.1) | Memory rules + data retention policy |
| Prompt injection | High | Low | Security Agent + prompt parameterization |
| Tool failure cascade | Medium | Medium | Retry logic + circuit breaker |
| Context exhaustion | Medium | Medium | Memory retrieval limits + compression |
| Cost overrun | Medium | Low (v0.1) | Token monitoring + user limits |
| Generic output quality | High | High | Output schemas + QA Agent |
| Incorrect technical advice | Medium | Medium | Human review gate |

---

*Risks are reviewed and updated after each development phase. This is a living document.*
