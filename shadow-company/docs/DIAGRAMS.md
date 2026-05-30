# System Diagrams

---

## A. System Overview

```mermaid
graph TD
    U([User]) -->|Request| WS[Project Workspace]
    WS --> |Starts| R[Run Engine]
    R --> |Dispatches| CEO[CEO Agent]
    CEO --> |Goal brief| Orch[Orchestrator]
    Orch --> |Task packets| AT[Agent Team]
    AT <-->|Read / Write| M[(Memory Store)]
    AT --> |Produces| ART[Artifacts]
    ART --> |Assembled by| DOC[Documentation Agent]
    DOC --> |Updates| HUB[Documentation Hub]
    HUB --> |Delivered to| U
    AT --> |Quality check| QA[QA Agent]
    QA --> |Quality report| Orch
```

---

## B. Agent Hierarchy

```mermaid
graph TD
    CEO[CEO Agent] --> Orch[Orchestrator]
    Orch --> PM[Product Manager]
    Orch --> Research[Research Agent]
    Orch --> CI[Competitor Intel]
    Orch --> BA[Business Analyst]
    Orch --> UX[UX Architect]
    Orch --> UI[UI Designer]
    Orch --> FE[Frontend Engineer]
    Orch --> BE[Backend Engineer]
    Orch --> AIE[AI/LLM Engineer]
    Orch --> QA[QA / Test]
    Orch --> SEC[Security & Privacy]
    Orch --> DEV[DevOps]
    Orch --> DOC[Documentation]
    Orch --> GRW[Growth / Marketing]
    Orch --> CD[Customer Discovery]

    style CEO fill:#7C8CFF,color:#000
    style Orch fill:#5BD17E,color:#000
    style QA fill:#F2B65A,color:#000
    style DOC fill:#C4A6FF,color:#000
    style SEC fill:#F2697A,color:#fff
```

---

## C. User Request Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant P as Intent Parser
    participant CEO as CEO Agent
    participant Orch as Orchestrator
    participant Agents as Specialist Agents
    participant QA as QA Agent
    participant Doc as Documentation Agent

    U->>P: "Improve Shadow onboarding"
    P->>P: Classify: feature_development
    P->>CEO: Pass request
    CEO->>CEO: Read project memory
    CEO->>CEO: Produce goal brief
    alt confidence < 0.6
        CEO->>U: Request clarification
        U->>CEO: Clarification
    end
    CEO->>Orch: Scoped goal brief
    Orch->>Orch: Build execution plan
    Orch->>Agents: Dispatch task packets
    Agents->>Agents: Execute (sequential in v0.1)
    Agents->>QA: Artifacts for validation
    QA->>QA: Check acceptance criteria
    alt quality < 0.7
        QA->>Orch: Remediation needed
        Orch->>Agents: Re-run with feedback
    end
    QA->>Doc: Quality report + all artifacts
    Doc->>Doc: Update documentation
    Doc->>U: Run output + artifacts + doc updates
```

---

## D. Memory Architecture

```mermaid
graph LR
    subgraph Memory Types
        SM[Session Memory\nExpires: run end]
        PM[Project Memory\nExpires: project lifecycle]
        UM[User Memory\nExpires: account lifetime]
        AM[Agent Memory\nExpires: role lifetime]
        DM[Decision Memory\nExpires: permanent]
        ArtM[Artifact Memory\nExpires: versioned]
        EM[Eval Memory\nExpires: accumulated]
    end

    subgraph Storage
        PG[(PostgreSQL\nstructured)]
        VEC[(pgvector\nsemantic search)]
    end

    SM --> PG
    PM --> PG
    PM --> VEC
    UM --> PG
    AM --> PG
    DM --> PG
    ArtM --> PG
    EM --> PG
    EM --> VEC

    subgraph Access Pattern
        S[save_to_memory] --> PG
        R[retrieve_memory] --> VEC
        R --> PG
    end
```

---

## E. Documentation Generation Pipeline

```mermaid
graph TD
    R[Run completes] --> DA[Documentation Agent]
    DA --> INV[Inventory artifacts]
    INV --> MAP[Map artifact→document type]
    MAP --> DIFF[Diff against current version]
    DIFF --> GEN[Generate updated sections]
    GEN --> CL[Append CHANGELOG entry]
    CL --> DL[Append DECISIONS.md if decisions made]
    DL --> VER[Version documents\nprevious version archived]
    VER --> FLAG{Significant change?}
    FLAG -->|Yes| HR[Flag for user review]
    FLAG -->|No| DEL[Deliver to user]
    HR --> DEL
```

---

## F. Database Entity Relationship

```mermaid
erDiagram
    users ||--o{ workspaces : owns
    workspaces ||--o{ projects : contains
    workspaces ||--o{ agents : "custom agents"
    workspaces ||--o{ integrations : has

    projects ||--o{ sessions : has
    projects ||--o{ documents : has
    projects ||--o{ memories : stores
    projects ||--o{ decisions : tracks
    projects ||--o{ competitors : tracks
    projects ||--o{ research_sources : has
    projects ||--o{ test_cases : has
    projects ||--o{ issues : has
    projects ||--o{ artifacts : produces

    sessions ||--o{ runs : contains
    runs ||--o{ run_steps : has
    runs ||--o{ artifacts : produces

    agents ||--o{ agent_skills : has
    agents ||--o{ agent_tools : uses
    tools ||--o{ agent_tools : used_by

    run_steps }o--|| agents : executed_by
    artifacts }o--|| agents : created_by
    documents }o--|| agents : created_by
    memories }o--o| agents : owned_by
```

---

## G. MVP Workflow (v0.1)

```mermaid
graph TD
    U([User]) -->|Text request| IP[Intent Parser]
    IP --> Orch[Orchestrator\nacts as CEO in v0.1]
    Orch --> PM[PM Agent\nrequirements + user stories]
    PM --> Res[Research Agent\nresearch notes + sources]
    Res --> UX[UX Agent\nuser flow + edge states]
    UX --> DOC[Documentation Agent\nPRD.md + CHANGELOG]
    DOC --> OUT[Run Output]
    OUT --> U

    PM -.->|reads| MEM[(Project Memory)]
    DOC -.->|writes| MEM
    MEM -.->|context for| Orch

    style MEM fill:#161922,stroke:#7C8CFF
```

---

## H. Run Tracing Flow

```mermaid
sequenceDiagram
    participant RE as Run Engine
    participant T as Run Tracer
    participant Orch as Orchestrator
    participant A as Agent
    participant Mem as Memory
    participant Art as Artifact Store

    RE->>T: run.started(run_id, user_request)
    RE->>Orch: goal_brief
    Orch->>T: plan.created(stages, agents)

    loop For each agent in plan
        Orch->>A: task_packet(task_id, input, context)
        A->>T: step.started(agent_id, task_id)
        A->>Mem: memory.read(type, query)
        Mem-->>A: relevant memories
        A->>A: execute (LLM call)
        A->>Art: artifact.save(content, type)
        Art-->>A: artifact_id
        A->>Mem: memory.write(key, value, confidence)
        A->>T: step.completed(artifact_id, confidence)
        A->>Orch: handoff_packet
    end

    Orch->>T: run.completed(quality_score, artifacts[])
```

---

## I. Human Review Flow

```mermaid
graph TD
    A[Agent produces output] --> CONF{Confidence check}
    CONF -->|>= 0.7| NEXT[Pass to next agent]
    CONF -->|< 0.7| FLAG[Flag for human review]

    FLAG --> NOTIF[User notified in UI]
    NOTIF --> DEC{User decision}

    DEC -->|Approve| NEXT
    DEC -->|Edit| EDIT[User edits output]
    EDIT --> NEXT
    DEC -->|Reject + feedback| RERUN[Re-run agent\nwith feedback]
    RERUN --> A

    SPEC[Security / AI Engineer\noutputs] --> ALWAYS[Always human review]
    ALWAYS --> DEC

    QA[QA quality score < 0.7] --> BLOCK[Block run]
    BLOCK --> DEC
```

---

## J. Artifact Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Agent creates artifact

    Draft --> Review: QA Agent validates
    Draft --> Published: If no QA Agent in v0.1

    Review --> Published: QA passes
    Review --> Draft: QA fails - agent reworks

    Published --> Superseded: Newer run produces updated version
    Published --> Archived: Project archived

    Superseded --> [*]: Retained in history, not deleted
    Archived --> [*]: Retained in history, not deleted

    note right of Published
        Version number incremented
        Previous version archived
        User can view all versions
    end note
```

---

*All diagrams use valid Mermaid syntax. Render at mermaid.live or in any Markdown renderer that supports Mermaid.*
