# Stage 5: Deploy (`/5-deploy`)

Ship an approved, tested change.

## Execution mode: in-context

The Deployer role runs in the current Claude session (no subagent spawn) — deploy needs continuous user
confirmation at each step, which doesn't fit a spawned-and-forgotten subagent.

### Procedure

0. **Step 0 gate — CI/CD check.** Read `.claude/config.md` → CI/CD section. **`enabled: false` is the
   current state of this repo — abort here** with a clear "CI/CD not configured for ai-route-console yet"
   message. Do not attempt a manual deploy workaround.
1. Read `.claude/agents/deployer.md` and adopt the persona, principles, and workflow.
2. Verify `.claude/outputs/stage-3-review.md` (0 Criticals) and `.claude/outputs/stage-4-test.md` (all
   Pass) both exist and pass their gates.
3. Follow the deploy checklist in `.claude/shared/templates.md`, confirming with the user before every
   push/PR/merge action (principles.md §3). Note the repo root's `AGENTS.md` warning about Lovable sync —
   don't rewrite published git history.
4. Save the result to `.claude/outputs/stage-5-deploy.md`.

## Recovery matrix

| Symptom | Cause | Action |
|---|---|---|
| CI/CD disabled | Not yet wired up (current state) | Abort with the warning |
| Open Critical from stage 3, or failing check from stage 4 | Gate not met | Abort; route back to `/2-implement` |
| User declines a confirmation | Their call | Stop that specific action; report what was and wasn't done |

## Next stage

`/6-verify` — once the deploy is live (currently never, until CI/CD exists).

Checking the CI/CD gate in `.claude/config.md` before proceeding.
