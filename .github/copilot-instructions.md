# GitHub Copilot Setup Instructions

This repository is configured to use GitHub Copilot for enhanced code suggestions and AI-assisted development.

## Setup Steps

1. Ensure you have [GitHub Copilot](https://docs.github.com/en/copilot) enabled in your GitHub account.
2. Review the following instruction files for Copilot agent configurations:
   - `.github/instructions/**/*.instructions.md` (Modular agent instructions)
   - `AGENTS.md` (General agent documentation)
   - `CLAUDE.md` (Claude agent setup and usage)
   - `GEMINI.md` (Gemini agent setup and usage)

## Validation

This repository uses a GitHub Actions workflow to automatically validate the presence of required Copilot and agent instruction files on every push and pull request involving these files. You can also manually trigger the validation via the Actions tab.

### To manually trigger validation
Go to the "Actions" tab, select "Copilot Setup Steps", and click "Run workflow".

## Troubleshooting

If the workflow fails, make sure all required instruction files exist and are properly formatted. For further assistance, consult the documentation or open an issue.