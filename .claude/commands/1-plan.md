# Stage 1: Plan (`/1-plan`)

Analyze a user requirement and produce a concrete implementation plan. No code is written at this stage.

## Execution mode: in-context

The Planner role runs in the current Claude session (no subagent spawn) — planning benefits from the full
conversational context of what the user actually asked for.

### Procedure

0. **Archive previous run** if `.claude/outputs/stage-1-plan.md` (or any `stage-*.md`) already exists.
   Follow `.claude/shared/procedures.md` §7 — move prior outputs to `.claude/history/<date>_<slug>/`.
1. Read `.claude/agents/planner.md` and adopt the persona, principles, and workflow.
2. Follow the agent's procedure to analyze `$ARGUMENTS` against the actual repo state — the relevant
   sections of the three spec PDFs (`config.md`'s "Tài liệu nguồn" list), `src/lib/mock.ts`, and existing
   sibling routes.
3. Note that all implementation work in this repo routes through `console-developer` — there is only one
   lane.
4. Save the plan to `.claude/outputs/stage-1-plan.md`.
5. **Wait for explicit user approval** before suggesting `/2-implement`.

## Recovery matrix

| Symptom | Cause | Action |
|---|---|---|
| Requirement asks for a field/enum not in the spec PDFs | Underspecified or a genuinely new decision | Flag it explicitly in the plan's Risks section; ask via `AskUserQuestion` rather than inventing one |
| Requirement implies a real backend call | Misunderstanding of current repo state | Note in the plan that this stays mock-data-only per `config.md` |
| Genuinely ambiguous on a load-bearing point | Underspecified requirement | Ask via `AskUserQuestion` before finishing the plan |

## Next stage

`/2-implement` — only after the user has explicitly approved this plan.

Starting planning for `$ARGUMENTS`. Reading `.claude/agents/planner.md` first.
