# Shared Procedures

> Concrete, copy-pasteable steps the agents cite by `§N`. If a command here is wrong, fix it **here** —
> don't work around it in an agent file. Paths are relative to `Draft/ai-route-console/` unless noted.

## §1. Local dev session

There is no auth backend to obtain a token from — the console has no login flow yet. To look at a screen:

```bash
npm run dev
```

Open the printed local URL. If a screen needs data that isn't in `src/lib/mock.ts` yet, that's a plan
step ("extend mock.ts with X"), not something to fetch from a live API.

## §2. Service health check

Only one process exists in this repo:

```bash
curl -sf http://localhost:5173 >/dev/null   # or whatever port `npm run dev` printed — Vite may pick a free port
```

There is no docker-compose stack, no database, no separate backend service to check here.

## §3. Determine change scope

Everything in this repo is one lane: `console-developer`. There is no multi-service split like a
Hasura/NestJS/React repo would have. When mapping a change to a changelog domain, use the *screen* it
belongs to (see `.claude/templates/docs/changelogs/CHANGELOG_TEMPLATE.md`):

| Path | Domain |
|---|---|
| `src/routes/index.tsx` | `dashboard` |
| `src/routes/providers.tsx` | `providers` |
| `src/routes/accounts.tsx` | `accounts` |
| new `src/routes/models*.tsx` | `models` |
| new `src/routes/routes*.tsx` (routing policies) | `routing-policies` |
| new `src/routes/api-keys*.tsx` | `api-keys` |
| new `src/routes/usage*.tsx` | `usage` |
| new `src/routes/logs*.tsx` | `request-logs` |
| new `src/routes/jobs*.tsx` | `async-jobs` |
| new `src/routes/assets*.tsx` | `assets` |
| new `src/routes/audit*.tsx` | `audit-logs` |
| new `src/routes/health*.tsx` | `system-health` |
| `src/components/**`, `src/lib/**` (shared) | `infra` if cross-cutting, else the domain that drove the change |

A change spanning several screens needs a changelog entry in **each** affected domain.

## §4. Build / rebuild

```bash
npm install
npm run lint
npm run build      # includes type-check via tsc, then vite build
```

There is no `pnpm codegen` step here — no GraphQL, no backend to introspect.

## §5. E2E / browser testing protocol

`config.md` → E2E `required: false`, no Playwright installed. Until that changes, "testing a screen"
means: run `npm run dev`, open the route in a browser/preview tool, and visually/functionally confirm it
against the mock data and against the relevant screen spec in `README.md` (sections 1–24) and against the
API Specification PDF for field names. **No unhandled console errors on any screen touched by the
change.**

## §6. Verify a prior stage's output exists

Before a stage that consumes another's output:

```bash
ls -la .claude/outputs/
```

`stage-1-plan.md` must exist before `/2-implement`; `stage-2-implement.md` before `/3-review`. Missing
file → stop and say so, don't reconstruct it from conversation memory.

## §7. Archive previous workrun outputs

`/1-plan` archives before starting a new run:

```bash
SLUG=<short-kebab-slug>
DEST=".claude/history/$(date +%Y-%m-%d)_${SLUG}"
mkdir -p "$DEST" && mv .claude/outputs/stage-*.md "$DEST"/ 2>/dev/null || true
```

## §8. Cross-check a field/enum against the spec

There is no live API to smoke-test against. Instead, before adding a field, enum value, or status string
to `src/lib/mock.ts` or a form, grep the spec text you already have context on, or ask to re-read the
relevant section of `../../API Specification.pdf` / `../../Software Requirements Specification (SRS).pdf`.
Example: before inventing a new provider-account status, check it against FR-PROV-005's fixed list
(`active`, `degraded`, `quota_exhausted`, `reauth_required`, `disabled`, `error`) rather than guessing a
new one.
