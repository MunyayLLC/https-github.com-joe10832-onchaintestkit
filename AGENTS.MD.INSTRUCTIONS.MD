# AGENTS.MD.INSTRUCTIONS.MD

Purpose
This file provides concrete, actionable instructions and templates for maintainers to set up, validate, and govern AI agents referenced from AGENTS.md (e.g., CLAUDE, GEMINI). Use this as the single-source-of-truth for operational steps and CI validation related to repository agents.

Placement & usage
- Place this file in the repository root or in the same directory as AGENTS.md (recommended).
- Reference this file from AGENTS.md and in the repository README.
- Treat it as an operational runbook — keep it concise, versioned, and reviewed.

Required files
Ensure the branch/repo contains:
- .github/copilot-instructions.md
- AGENTS.md
- CLAUDE.md
- GEMINI.md
- this file: AGENTS.MD.INSTRUCTIONS.MD
Validation workflows will check for these filenames and basic formatting.

Secrets (recommended names)
Define repository (or org) secrets in Settings → Secrets → Actions:
- CLAUDE_API_KEY
- GEMINI_API_KEY (or GEMINI_API_TOKEN)
- Optional: AGENT_LOG_LEVEL (for limited debug metadata)
- Optional: AGENT_API_ENDPOINT (if using a proxied endpoint)

Security rules (must)
- Never commit secrets or credentials to the repository.
- Limit secret scope (org vs repo) to the minimal necessary.
- Require human-in-the-loop approval for any automated agent PRs that modify production code.
- Audit agent access and rotate keys periodically.

Validation & CI (how to validate)
1. Local quick checks (before pushing)
   - Ensure files exist and are properly named:
     - .github/copilot-instructions.md
     - AGENTS.md
     - CLAUDE.md
     - GEMINI.md
     - AGENTS.MD.INSTRUCTIONS.MD
   - Run Markdown lint:
     - Example (node): npx markdownlint-cli "**/*.md"
     - Example (Python): pip install markdownlint; markdownlint README.md
   - Run a lightweight script to validate agent files:
     - ./scripts/validate-agents.sh

2. Example validate-agents.sh (suggested)
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   MISSING=0
   for f in .github/copilot-instructions.md AGENTS.md CLAUDE.md GEMINI.md AGENTS.MD.INSTRUCTIONS.MD; do
     if [[ ! -f "$f" ]]; then
       echo "ERROR: Missing $f"
       MISSING=1
     fi
   done
   if [[ $MISSING -eq 1 ]]; then
     echo "One or more required files are missing."
     exit 2
   fi
   # Optional: simple MD lint if installed
   if command -v markdownlint >/dev/null 2>&1; then
     markdownlint . || { echo "markdownlint failures"; exit 3; }
   fi
   echo "Agent validation passed."
   ```
   - Place the script at ./scripts/validate-agents.sh and make it executable.

3. GitHub Actions workflow (example)
   - Create a workflow .github/workflows/validate-agents.yml with a job that:
     - Checks out the repo
     - Runs the validate-agents.sh script
     - Fails the job on missing files or lint errors
   - Minimal example:
     ```yaml
     name: Validate Agents
     on:
       pull_request:
       push:
         branches:
           - main
     jobs:
       validate:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v4
           - name: Run agent validation
             run: |
               chmod +x ./scripts/validate-agents.sh || true
               ./scripts/validate-agents.sh
     ```

PR and repo workflow guidance
- Branch name convention: feature/agent-<agentname>-setup or copilot-setup-steps
- PR title recommendation: Add Copilot setup instructions and agent templates
- PR body template:
  - Short summary of changes
  - Files added/updated list
  - Notes for maintainers (required secrets, validation steps)
  - Manual steps required before enabling integrations (secrets, approvals)
- Require at least one maintainer code review for PRs that:
  - Add or change agent configuration files
  - Add automation that calls external agents

How to add a new agent (step-by-step)
1. Create <AGENTNAME>.md describing:
   - Purpose
   - Setup steps (secrets, endpoints)
   - Usage examples
   - Security & governance notes
2. Add an entry to AGENTS.md with recommended secret names and purpose.
3. Add or update AGENTS.MD.INSTRUCTIONS.MD if special validation is needed.
4. Run local validation script and push branch.
5. Open a PR and request review from security/ops maintainers.
6. After approval, add secrets in Settings → Secrets → Actions and run Actions validation.

Governance checklist (pre-enable)
Before enabling an agent integration or storing its secret:
- [ ] Confirm secret names and scopes
- [ ] Document expected usage and retention rules
- [ ] Add required reviewers to PRs that change agent files
- [ ] Ensure Actions workflows are configured to limit exposure of secrets
- [ ] Confirm SLAs and rate limits for the agent provider

Troubleshooting
- If validate-agents.sh fails: check for typos in filenames and run markdownlint locally.
- If CI fails on missing secrets: verify secret names in Settings → Secrets → Actions (note: secrets are not visible in PR logs).
- If an agent returns unexpected content: treat suggestions as untrusted until reviewed.

Maintainer responsibilities
- Keep AGENTS.md and this instructions file up-to-date whenever adding or removing agents.
- Periodically audit secrets and agent usage.
- Ensure that any agent-created automation has opt-out flags and requires human approval for production changes.

Appendix — example quick commands
- Create branch and add file locally:
  ```bash
  git fetch origin
  git checkout -b copilot-setup-steps origin/main
  # add/modify files (AGENTS.md, AGENTS.MD.INSTRUCTIONS.MD, etc.)
  git add AGENTS.md AGENTS.MD.INSTRUCTIONS.MD .github/copilot-instructions.md CLAUDE.md GEMINI.md
  git commit -m "Update AGENTS.md and add instructions for maintainers"
  git push -u origin copilot-setup-steps
  gh pr create --base main --head copilot-setup-steps --title "Add Copilot setup instructions and agent templates" --body-file ./pr-body.md
  ```
- Mark PR ready for review (if draft):
  ```bash
  gh pr ready 220 --repo MunyayLLC/https-github.com-joe10832-onchaintestkit
  ```

Contact & ownership
- Assign one or two maintainers as agents owners to review agent changes and manage secrets.
- Add a CODEOWNERS entry if you want automatic reviewer assignment for agent-related files.

End of file.