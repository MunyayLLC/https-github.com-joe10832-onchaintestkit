# Copilot Setup Steps - Implementation Guide

This document explains the automated copilot setup implementation for the Onchain Test Kit project.

## Overview

The "Copilot Setup Steps" feature provides automated workflows and scripts that ensure development environments are properly configured according to the guidelines in `.github/copilot-instructions.md`.

## Components Implemented

### 1. GitHub Actions Workflows (`.github/workflows/`)

#### `copilot-setup.yml`
- **Purpose**: Main CI/CD workflow that runs on push/PR
- **Triggers**: Push to main/develop/copilot branches, PRs to main/develop
- **Features**: 
  - Runs all essential setup commands in correct order
  - Handles known broken wallet preparations gracefully
  - Includes validation job
  - Uses Node.js 18 with npm caching

#### `development.yml` 
- **Purpose**: Development-focused workflow for code quality
- **Features**:
  - Separate jobs for linting, building, testing
  - Wallet preparation testing
  - Test artifact upload on failure
  - Dependency separation for faster execution

#### `manual-setup-test.yml`
- **Purpose**: Manual testing workflow with configurable options
- **Features**:
  - Workflow dispatch triggers
  - Options to test wallet preparation and run full validation
  - Detailed summary reporting

### 2. Setup Scripts (`scripts/`)

#### `quick-setup.sh`
- **Purpose**: Automated execution of essential setup commands
- **Features**:
  - Follows exact order from copilot-instructions.md
  - Colored output for better visibility
  - Graceful handling of known issues
  - Error handling with `set -e`

#### `validate-setup.sh`
- **Purpose**: Comprehensive environment validation
- **Features**:
  - Node.js version checking (>=14.0.0 requirement)
  - Step-by-step validation with detailed output
  - Known issue reporting for broken wallet preparations
  - Success/warning/error status indicators

### 3. Package.json Integration

Added convenient npm commands:
```json
{
  "copilot:setup": "./scripts/quick-setup.sh",
  "copilot:validate": "./scripts/validate-setup.sh", 
  "copilot:full-setup": "npm run copilot:setup && npm run copilot:validate"
}
```

### 4. Documentation Updates

#### README.md
- Added "Copilot Setup Steps" section
- Quick reference for setup commands
- Links to instruction files for AI agents
- Integration with existing documentation

#### GitHub Issue Template (`.github/ISSUE_TEMPLATE/setup.yml`)
- Structured template for setup issues
- Checkboxes for common setup steps
- Environment and version information collection
- Links to relevant documentation

## Essential Commands Automated

Based on `.github/copilot-instructions.md`, these commands are automated:

1. `npm install` - Install dependencies (required first)
2. `npm run build` - Build project (required before testing)
3. `npm run lint` - Run linter (fix issues before committing)
4. `npm run format` - Format code (may show extension file warnings)
5. `npm run test` - Run tests
6. `npm run prepare-metamask` - Prepare MetaMask (works correctly)
7. `npm run prepare-coinbase` - Prepare Coinbase (known broken, gracefully handled)
8. `npm run prepare-phantom` - Prepare Phantom (known broken, gracefully handled)

## Usage Examples

### For Developers
```bash
# Quick setup
npm run copilot:setup

# Full setup with validation
npm run copilot:full-setup

# Validation only
npm run copilot:validate
```

### For CI/CD
The workflows automatically trigger on:
- Push to main, develop, or copilot/** branches
- Pull requests to main or develop branches
- Manual dispatch for testing

### For AI Coding Agents
The setup follows the instructions in:
- `.github/copilot-instructions.md` - Main instructions
- `.github/instructions/*.instructions.md` - Specialized guidance
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` - Agent-specific instructions

## Error Handling

### Known Issues Handled
1. **Coinbase/Phantom preparation fails**: Gracefully continues with warnings
2. **Format command warnings**: Expected for extension files, safely ignored
3. **Node.js version**: Validates >=14.0.0 requirement
4. **Missing dependencies**: Clear error messages with resolution steps

### Validation Features
- Pre-flight checks for Node.js version
- Step-by-step validation with clear success/failure indicators
- Comprehensive error reporting
- Links to troubleshooting resources

## Integration with Existing Infrastructure

### Builds on Existing Foundation
- Leverages existing npm scripts
- Uses established biome linting/formatting setup
- Integrates with Playwright testing infrastructure
- Respects existing wallet preparation scripts

### Maintains Compatibility
- No breaking changes to existing APIs
- Backward compatible with existing development workflows
- Additive approach - enhances rather than replaces existing tools

## Future Enhancements

Potential improvements:
1. **Wallet Preparation Fix**: Address broken Coinbase/Phantom downloads
2. **Performance Optimization**: Parallel execution where safe
3. **Environment Detection**: Adaptive behavior for different environments
4. **Setup Analytics**: Track setup success rates and common issues
5. **Interactive Setup**: Guide users through setup with prompts

## Success Criteria

✅ **Implemented Successfully:**
- Automated setup workflows in GitHub Actions
- Local setup scripts with proper error handling
- Integration with package.json for easy access
- Documentation updates in README
- Issue template for setup problems
- Maintains all existing functionality
- Follows exact command sequence from instructions
- Handles known issues gracefully

The implementation provides a robust foundation for automated onchain test kit setup while maintaining flexibility for different use cases and environments.