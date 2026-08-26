# Stage 6: Verify (`/6-verify`)

Post-deploy health check and change-scoped functional verification.

## Execution mode: subagent spawn (context isolation)

> Verification should not be biased by the deploy session's assumption that everything went well. Use
> the `Agent` tool with `subagent_type: general-purpose`.

### Procedure

1. Verify `.claude/outputs/stage-5-deploy.md` exists. If it reports the CI/CD gate aborted (current
   expected state for this repo), skip the spawn and report that plainly instead.
2. Once a real deploy exists, spawn:

   ```
   Agent(
     subagent_type: "general-purpose",
     description: "Post-deploy verification",
     prompt: "Read .claude/agents/verifier.md and follow it exactly against the deploy described in .claude/outputs/stage-5-deploy.md. Report health check and change verification results, Criticals first."
   )
   ```

3. Save the result to `.claude/outputs/stage-6-verify.md`.

## Recovery matrix

| Symptom | Cause | Action |
|---|---|---|
| `stage-5-deploy.md` shows an aborted CI/CD gate | No deployed environment yet (current state) | Report plainly, don't fabricate a health check |
| Critical finding (once deploys exist) | Deployed change is broken | Recommend rollback; route to `/2-implement` → `/4-test` → `/5-deploy` → `/6-verify` |

## Next stage

None — end of the pipeline. If a rollback is recommended, that re-enters at `/2-implement`.

Checking `.claude/outputs/stage-5-deploy.md` before deciding whether to spawn the verifier.
