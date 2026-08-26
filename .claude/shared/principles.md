# Shared Principles

> Non-negotiable. If a principle conflicts with a specific agent's instructions, **the principle wins**.
> Read once; agents and commands cite these by number.

## 1. Minimal-change

A bug fix is not a refactor. A one-shot operation doesn't need a helper. Three similar lines are better
than a premature abstraction. Don't design for a backend that doesn't exist yet — build the screen against
`src/lib/mock.ts` as it is, don't invent an API client layer speculatively.

## 2. Read-before-write

Never edit a file you haven't read in this session. Never assume a route/component's shape from its name
or from memory of a similar Lovable/AntD project — this project's conventions are locked in `config.md`
and the existing `routes/*.tsx` files, not in generic AntD-admin templates.

## 3. User-confirmation

The following always require explicit user confirmation before proceeding, even mid-pipeline:

| Operation | Confirm before |
|---|---|
| Destructive operations (`rm -rf`, deleting a route/component wholesale) | Running |
| Branch / PR mutations (push, force-push, merge, close) | Running |
| Anything that would connect the UI to a real, live backend URL | Running |
| Cross-stage progression when a stage reported Critical findings | Proceeding to the next stage |

## 4. `.claude/config.md` is the source of truth

Every path, port, and command an agent needs is either in `config.md` or discoverable by reading the
actual repo — never invented. If `config.md` is stale, fix it there, not by hard-coding the correct value
somewhere else. Product/domain facts that aren't about *this repo's mechanics* live in the three spec
PDFs referenced from `config.md`, not duplicated piecemeal across agent files.

## 5. File-based stage handoff

Pipeline stages may run in different Claude sessions (different terminal, different day). Context windows
are ephemeral; files are durable. Every stage writes its full output to `.claude/outputs/stage-N-*.md` —
the next stage reads that file, not the previous conversation.

## 6. Scope-of-review

A review or test pass only covers `git diff <base>...HEAD` plus new untracked files relevant to the
change. Distinguish issues introduced by this change from pre-existing ones (see `templates.md` for the
reporting format) — don't let scope creep into a general audit unless asked.

## 7. Evidence-based reporting

Numbers, not adjectives. "3 of 12 sidebar screens missing" beats "coverage could be better." Quote the
actual file:line, the actual error message, the actual command output.

## 8. Stay in role

An agent does the job described in its own file and nothing else. `tester` doesn't fix bugs;
`code-reviewer` doesn't implement the fix it suggests; `planner` doesn't write code. Cross-cutting
concerns get routed to the right stage, not absorbed into the current one.

## 9. Fail loud, not silent

If a stage can't complete (missing prior output, a command that doesn't exist in `config.md`, an
ambiguous requirement, a spec field that isn't in the API Specification PDF), stop and say so plainly.
Don't guess and continue as if it worked — and don't silently invent a field/enum that isn't in the spec.
