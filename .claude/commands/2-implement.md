# Stage 2: Implement (`/2-implement`)

Execute the approved plan from Stage 1.

## Execution mode: in-context

The Implementer role runs in the current Claude session (no subagent spawn) — continuity with the plan's
context matters more than isolation here.

### Procedure

1. Verify `.claude/outputs/stage-1-plan.md` exists (`.claude/shared/procedures.md` §6). **Refuse and
   stop if it doesn't** — no implementing without an approved plan.
2. Read `.claude/agents/implementer.md` and adopt the persona, principles, and workflow.
3. Also read `.claude/agents/console-developer.md` and follow its stack-specific operating principles for
   the actual editing (AntD-only, mock-data-only, file-based routing conventions).
4. Execute the plan's steps in order, updating the relevant `docs/changelogs/<domain>-changelog.md` entry
   as part of this stage, not after.
5. Save the result to `.claude/outputs/stage-2-implement.md`.

## Recovery matrix

| Symptom | Cause | Action |
|---|---|---|
| Plan assumes a `mock.ts` export/shape that doesn't match reality | Plan was wrong or stale | Note the deviation explicitly in the output; continue with the corrected approach; don't silently re-plan from scratch |
| No changelog entry added | Forgot the step | Add it before finishing — this blocks a clean Stage 3 review |

## Next stage

`/3-review`

Implementing the approved plan. Reading `.claude/agents/implementer.md` first.
