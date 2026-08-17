# ADR-000: [Short title of the decision]

> Template for Architecture Decision Records. Copy this file, rename to
> `ADR-NNN-short-slug.md`, increment NNN, and fill in every section.
> Decisions are append-only: never edit an accepted ADR — supersede it with a new one.

---

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-NNN
**Date:** YYYY-MM-DD
**Run:** run_xxxxxx (the run that produced this decision, if any)
**Decided by:** user | agent:{slug} (confirmed by user)

---

## Context

What is the situation that forces a decision? What constraints apply?
Reference prior decisions, project memory, or research that bounds the choice.
State the problem, not the solution.

## Decision

The actual choice made. One or two sentences. Be specific and unambiguous.

## Reason

**Why** this choice — not just what. Tie it to evidence: research findings,
project constraints, user-stated preferences, or prior decisions.
If reasoning relies on an unverified assumption, label it `[Assumption]`.

## Alternatives Considered

- **Option A** — rejected because …
- **Option B** — rejected because …
- **Option C** — rejected because …

(List real alternatives that were actually weighed. "Do nothing" is a valid alternative.)

## Consequences

What does this decision imply for future work?

- Positive: …
- Negative / cost: …
- Follow-up needed: … (e.g. "must monitor query latency as memory grows")

## Links

- Related artifacts: art_xxx, art_yyy
- Related ADRs: ADR-NNN
- Related memory entries: (project / decision memory keys)

---

### Example (filled)

> **ADR-014: Onboarding is 3 steps maximum**
> **Status:** Accepted · **Date:** 2026-05-30 · **Run:** run_abc123 · **Decided by:** CEO Agent (confirmed by user)
>
> **Context:** Onboarding completion is a priority. Research surfaced high drop-off in long flows. Mobile-first constraint applies (per project memory).
>
> **Decision:** Onboarding will be limited to 3 steps. Email is optional until step 3.
>
> **Reason:** Research notes (art_102) indicate steep drop-off beyond 4 steps `[Assumption: figure not from a primary first-party source]`. User has stated onboarding must be "friction-free."
>
> **Alternatives Considered:**
> - 5-step flow with progress bar — rejected: still exceeds the friction budget per research.
> - Single-page onboarding — rejected: too dense for mobile.
>
> **Consequences:** Profile completion deferred to post-onboarding. Email collection needs a separate post-step-3 touchpoint.
>
> **Links:** art_102 (research), art_104 (UX flow), project memory `constraints.mobile_first`.
