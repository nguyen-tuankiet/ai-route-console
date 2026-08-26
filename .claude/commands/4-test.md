# Stage 4: Test (`/4-test`)

Two independent test passes, run in parallel and merged: static/build, and visual/functional.

## Execution mode: subagent spawn (context isolation)

> **Always spawn subagents.** Use the `Agent` tool with `subagent_type: general-purpose`, both calls in a
> single message so they run concurrently.

### Procedure

1. Verify `.claude/outputs/stage-3-review.md` exists and reports **0 open Criticals**
   (`.claude/shared/procedures.md` §6). Stop and route to `/2-implement` if not.
2. Spawn both agents in parallel, in one message:

   ```
   Agent(
     subagent_type: "general-purpose",
     description: "Static/build checks",
     prompt: "Read .claude/agents/tester.md and follow it exactly against the changes described in .claude/outputs/stage-2-implement.md. Return Part A of the Stage 4 report."
   )
   Agent(
     subagent_type: "general-purpose",
     description: "Visual/functional tests",
     prompt: "Read .claude/agents/qa-engineer.md and follow it exactly against the changes described in .claude/outputs/stage-2-implement.md. Return Part B of the Stage 4 report."
   )
   ```

3. Merge both parts into `.claude/outputs/stage-4-test.md`, using the universal report header.

## Recovery matrix

| Symptom | Cause | Action |
|---|---|---|
| Lint or build fails | Bug in the implementation | Route to `/2-implement`, then re-run `/4-test` |
| A rendered screen doesn't match `mock.ts`/spec | Implementation bug | Route to `/2-implement`, then re-run `/4-test` |

## Next stage

`/5-deploy` — only once all checks report Pass.

Spawning tester and qa-engineer in parallel against `.claude/outputs/stage-2-implement.md`.
