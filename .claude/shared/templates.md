# Shared Report Templates

> Canonical output formats every pipeline stage uses. Copy the relevant block into
> `.claude/outputs/stage-N-*.md`; don't invent a new shape per run.

## Universal report header

```markdown
# Stage N — <Stage Name>

- **Date**: <YYYY-MM-DD>
- **Scope**: <files/diff this run covers — see principles.md §6>
- **Agent(s)**: <agent name(s)>
- **Prior stage input**: `.claude/outputs/stage-(N-1)-*.md`
```

## Severity classification (shared across review, test, verify)

| Severity | Meaning |
|---|---|
| **Critical** | A field/enum/status that contradicts the SRS or API Specification, a screen that silently loses user input, an AntD-bypass that breaks accessibility (raw `<button>`/`<input>` instead of the component), a secret-looking value (API key, token) rendered in full instead of masked. Blocks progression. |
| **Major** | Wrong behavior on a common path (broken filter, broken pagination, mock data shape mismatch with what the spec defines), but not data-destructive or a spec violation. |
| **Minor** | Cosmetic, edge-case, or a convention violation (naming, missing `head()` meta, inconsistent spacing) with no functional impact. |

## Test-case table format

> Test cases are written in **English**, regardless of the user-facing language of the product.

| # | Type | Scenario | Expected | Result |
|---|---|---|---|---|
| TC-1 | Happy | ... | ... | Pass/Fail |

`Type` values: `Happy`, `Validation`, `Edge`, `Empty state`, `Error state`.

## Bug report format

```markdown
### BR-01 — <one-line title>

- **Severity**: Critical | Major | Minor
- **Found in**: <Stage 3 review | Stage 4 test | Stage 6 verify>
- **Affected files**: `<file:line>`
- **Reproduction**:
  1. <step 1>
  2. <step 2>
- **Expected**: <what should happen, cite the spec section if applicable>
- **Actual**: <what actually happened, including the exact error message>
- **Evidence**: <screenshot path, console output>
- **Suggested fix**: <one or two sentences; do not implement — flag for `/2-implement`>
- **Routing**: → `/2-implement` to fix, then `/3-review` → `/4-test`
```

## Recovery-flow table format

| Failure at | Route back to | Then re-run |
|---|---|---|
| `/3-review` finds Critical | `/2-implement` | `/3-review` → `/4-test` |
| `/4-test` finds Critical | `/2-implement` | `/4-test` |
| `/6-verify` finds Major regression | `/2-implement` | `/4-test` → `/5-deploy` → `/6-verify` |

## Maintainability score (used by `cto`)

| Dimension | Score (1–10) |
|---|---|
| Naming / readability | |
| Consistency with existing routes/components | |
| Fidelity to spec (field names, enums, sidebar structure) | |
| Doc/changelog completeness | |

Use whole numbers. Don't grade a change you produced above 8 without explicit justification.

## Refactor-suggestion format

```markdown
**Before:**
​```tsx
<snippet>
​```
**After:**
​```tsx
<snippet>
​```
**Why:** <one sentence — what invariant or readability problem this fixes>
```

## Deploy checklist (used by `deployer`)

- [ ] `/3-review` has 0 open Criticals
- [ ] `/4-test` all Pass (or explicitly N/A per `config.md`'s E2E state)
- [ ] `config.md` → CI/CD `enabled: true` (if `false`, abort — see `5-deploy.md`)
- [ ] Changelog entry added in the same commit
- [ ] User confirmed the push/PR/merge action (principles.md §3)

## End-to-end pipeline summary table

| Stage | Command | Input | Output | Gate to proceed |
|---|---|---|---|---|
| 1 | `/1-plan` | requirement | `stage-1-plan.md` | user approval |
| 2 | `/2-implement` | approved plan | `stage-2-implement.md` + code | plan exists |
| 3 | `/3-review` | diff | `stage-3-review.md` | — |
| 4 | `/4-test` | diff | `stage-4-test.md` | 0 Criticals from stage 3 |
| 5 | `/5-deploy` | tested change | `stage-5-deploy.md` | all tests Pass, CI/CD enabled |
| 6 | `/6-verify` | deployed change | `stage-6-verify.md` | deploy succeeded |
