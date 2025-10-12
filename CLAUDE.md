# CLAUDE.md

## Claude Agent Setup and Usage

The Claude agent can be used for advanced code suggestions, explanations, and code review.

### Setup

1. Ensure you have access to the Claude agent platform or API.
2. Configure any required API keys or credentials using repository secrets (Settings → Secrets → Actions).
   - Example secret name: CLAUDE_API_KEY
3. Update your workflows or instructions to utilize the Claude agent as needed. Example:
   - Use secrets in a workflow step: env: CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}

### Usage

- Use Claude for enhanced code completion, reasoning, and documentation.
- Example integration pattern:
  1. Prepare a minimal request payload in a workflow or script.
  2. Call Claude API with the repository/issue/test context.
  3. Validate responses and apply suggestions under maintainer review.

### Security & Governance

- Store API keys in repository/organization secrets only.
- Log minimal metadata; avoid persisting sensitive code or secrets sent to an external service.
- Review the agent's privacy and retention policies before automating uploads of source code.

For additional help, open an issue or discussion.