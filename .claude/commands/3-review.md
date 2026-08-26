# Stage 3: Review (`/3-review`)

Two independent reviews of the implemented change, run in parallel and merged: correctness/security/spec-
fidelity, and maintainability/convention/design-brief fit.

## Execution mode: subagent spawn (context isolation)

> **Always spawn subagents.** Reviewers must not be tainted by the implementation session's chatter,
> rationalizations, or assumptions. Use the `Agent` tool with `subagent_type: general-purpose`, both
> calls in a single message so they run concurrently.

### Procedure

1. Verify `.claude/outputs/stage-2-implement.md` exists (`.claude/shared/procedures.md` §6). Stop if it
   doesn't.
2. Spawn both agents in parallel, in one message:

   ```
   Agent(
     subagent_type: "general-purpose",
     description: "Correctness/security/spec-fidelity review",
     prompt: "Read .claude/agents/code-reviewer.md and follow it exactly to review the changes described in .claude/outputs/stage-2-implement.md. Return Part A of the Stage 3 report."
   )
   Agent(
     subagent_type: "general-purpose",
     description: "Maintainability/design-brief review",
     prompt: "Read .claude/agents/cto.md and follow it exactly to review the changes described in .claude/outputs/stage-2-implement.md. Return Part B of the Stage 3 report."
   )
   ```

3. Merge both parts into `.claude/outputs/stage-3-review.md`, using the universal report header from
   `.claude/shared/templates.md`.

**Merge rules:**
- On a severity conflict for the same finding, take the higher severity.
- On a topical conflict (both flag the same code but frame it differently), `code-reviewer` wins on
  correctness/security/spec-fidelity framing, `cto` wins on maintainability/design-brief framing —
  present both framings rather than picking one.
- Do not invent findings that neither subagent reported.

## Recovery matrix

| Symptom | Cause | Action |
|---|---|---|
| ≥1 Critical finding | Spec violation, secret leak, or design-brief violation | **Blocks progression.** Route to `/2-implement` to fix, then re-run `/3-review` |
| Only Major/Minor findings | Non-blocking | Note them; user decides whether to fix now or file as follow-up |

## Next stage

`/4-test` — only once 0 Criticals remain.

Spawning code-reviewer and cto in parallel against `.claude/outputs/stage-2-implement.md`.
