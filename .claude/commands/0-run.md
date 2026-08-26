# Stage 0: Run (`/0-run`)

Local dev-server lifecycle — start, check status, build, or lint. Available at any time; not gated to the
plan → implement → review → test → deploy → verify pipeline.

## Execution mode: in-context

The DevOps role runs in the current Claude session (no subagent spawn) — this is a quick utility, not
something that benefits from context isolation.

### Procedure

1. Read `.claude/agents/devops.md` and adopt the persona, principles, and workflow.
2. Parse `$ARGUMENTS` for the sub-action (`start`, `build`, `lint`, `status`; default to `status` if
   empty).
3. Run only the commands documented in `.claude/config.md`.
4. Save the result to `.claude/outputs/stage-0-run.md`.

## Recovery matrix

| Symptom | Cause | Action |
|---|---|---|
| A command in `config.md` doesn't exist / fails immediately | `config.md` is stale | Fix `config.md`, don't invent a workaround command |

## Next stage

None — `/0-run` is a standalone utility, usable before, during, or after any pipeline stage.

Running `/0-run $ARGUMENTS`. Reading `.claude/agents/devops.md` first.
