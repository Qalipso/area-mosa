# User Stories and Acceptance Criteria

---

## User Stories

### Project Management

**US-001**  
As a solo founder, I want to create a project with a name and vision statement, so that agents have context before they run.

**US-002**  
As a product builder, I want to view all my past runs per project, so that I can see the history of decisions and artifacts.

**US-003**  
As a user, I want to view a specific run and all its artifacts, so that I can review what was produced and use it.

**US-004**  
As a user, I want project memory to persist between sessions, so that agents don't lose context when I come back to a project.

---

### Agent Execution

**US-005**  
As a user, I want to write a plain-text request and receive a set of structured artifacts as output, so that I don't need to configure a workflow to get useful work done.

**US-006**  
As a user, I want to see which agents participated in a run and what each one produced, so that I can understand how the output was generated.

**US-007**  
As a user, I want the system to flag low-confidence agent outputs, so that I know which outputs need my review.

**US-008**  
As a user, I want to approve, edit, or reject an agent's output and have the agent re-run with my feedback, so that I can improve the result without starting over.

---

### Memory and Context

**US-009**  
As a user, I want agents to reference prior decisions in their outputs, so that I'm not told things that contradict what was already decided.

**US-010**  
As a user, I want to see what is stored in project memory, so that I can review and correct inaccurate information.

**US-011**  
As a user, I want to delete or correct a memory entry, so that stale information doesn't pollute future agent runs.

---

### Documentation

**US-012**  
As a user, I want the PRD to be automatically updated after a feature development run, so that I don't have to manually maintain product documentation.

**US-013**  
As a user, I want to see a CHANGELOG entry for every run, so that I have a clear history of what changed and when.

**US-014**  
As a user, I want decisions made during a run to be logged in an ADR-style format, so that I can understand why architectural and product choices were made.

**US-015**  
As a user, I want to view previous versions of a document, so that I can compare changes over time or roll back to a previous version.

---

### Quality and Research

**US-016**  
As a user, I want the Research Agent to cite sources for every factual claim, so that I can verify the information and trust the output.

**US-017**  
As a user, I want assumptions (unverified claims) to be explicitly labeled, so that I know which information I still need to validate.

**US-018**  
As a user, I want a test plan to be produced for every feature development run, so that I have a clear checklist for validating the implementation.

**US-019**  
As a user, I want the QA Agent to validate that all acceptance criteria are addressed before the run output is delivered, so that incomplete runs are flagged rather than silently delivered.

**US-020**  
As a user, I want a competitor matrix that reflects observable product features, not marketing claims, so that I can make informed positioning decisions.

---

## Acceptance Criteria

### MVP Acceptance Criteria (v0.1)

**Project workspace**
- [ ] User can create a project with name and one-paragraph vision
- [ ] User can see a list of all projects in their workspace
- [ ] User can open a project and see its run history
- [ ] Project vision is stored in project memory and accessible to agents in all subsequent runs

**Agent execution**
- [ ] User can type a plain-text request and submit it
- [ ] System identifies request type (feature_development, research_request, etc.)
- [ ] Orchestrator generates an execution plan visible to the user
- [ ] Each agent produces at least one artifact per run
- [ ] Run status updates in real-time (queued → running → completed)
- [ ] User can see which agents ran and in what order

**Research quality**
- [ ] Research Agent produces research notes with at least one external source citation per factual claim
- [ ] Unverified claims are labeled `[Assumption: unverified]`
- [ ] Research Agent does not produce invented statistics or fake market data
- [ ] Source citations include URL and title (not just paraphrase)

**Memory**
- [ ] Project memory persists across browser sessions
- [ ] Decisions made in a run are saved to decision memory and referenced in subsequent runs
- [ ] User can view all project memory entries
- [ ] User can delete a memory entry

**Documentation**
- [ ] PRD.md is created or updated after every feature development run
- [ ] CHANGELOG.md receives an entry after every run (regardless of run type)
- [ ] DECISIONS.md is updated when any decision is logged
- [ ] Documents are versioned; previous version is accessible
- [ ] No document is silently overwritten

**Output quality**
- [ ] Every user story follows: "As a [who], I want [what], so that [why]"
- [ ] UX flows include at least one empty state and one error state specification
- [ ] PM acceptance criteria are testable (not "it should feel good")
- [ ] QA produces at least one test case per acceptance criterion

---

### Memory Acceptance Criteria (v0.2)

- [ ] Memory retrieval uses vector similarity (not just keyword match)
- [ ] Memory confidence scores are stored and retrieved with entries
- [ ] Entries with confidence < 0.6 are labeled as low-confidence when surfaced to agents
- [ ] User memory persists across projects
- [ ] Agent memory captures recurring patterns per project
- [ ] Eval memory stores prompt outcomes and is used by QA Agent in subsequent runs
- [ ] Memory entries with `expires_at` in the past are archived, not served to agents
- [ ] No PII is stored in memory entries

---

### Documentation Acceptance Criteria (v0.2)

- [ ] All 19 document types can be generated
- [ ] Documentation Agent produces section updates, not full rewrites (unless necessary)
- [ ] Contradiction detection: if new content contradicts existing doc, user is flagged (not auto-resolved)
- [ ] Document diff view shows what changed between versions
- [ ] User can roll back to any previous document version
- [ ] CASE_STUDY.md is generated from project history (v0.3)

---

### Agent Handoff Acceptance Criteria (v0.2)

- [ ] Every handoff packet is self-contained (does not assume implicit context)
- [ ] Open questions from one agent are visible to the receiving agent
- [ ] Confidence scores travel with handoff packets
- [ ] If any handoff has confidence < 0.6, Orchestrator flags before continuing
- [ ] Parallel agent stages are correctly identified and executed concurrently
- [ ] No circular dependencies in execution plans (validated at plan creation)
- [ ] Human review workflow allows: approve, edit, reject + re-run with feedback
- [ ] Security Agent and AI/LLM Engineer outputs always trigger human review gate
