# AI Coding Agents Configuration

This directory contains configuration and guidelines for AI coding agents working with the Onchain Test Kit repository. These instructions help coding agents understand the project structure, development workflows, and best practices.

## Overview

The Onchain Test Kit is an end-to-end testing toolkit for blockchain applications, powered by Playwright. This repository supports multiple AI coding agents with specialized instructions to help them work effectively on blockchain testing scenarios.

## Quick Start for Agents

```bash
# 1. Setup the development environment
npm install && npm run build && npm run test

# 2. Prepare wallet extensions for testing
npm run prepare-metamask

# 3. Configure environment variables
cp .env.example .env
# Edit .env to add E2E_TEST_SEED_PHRASE (test-only seed phrase)
```

## Documentation Structure

### Primary Instructions
- **[`.github/copilot-instructions.md`](../copilot-instructions.md)** - Main instructions for GitHub Copilot and general AI agents
- **[`AGENTS.md`](../../AGENTS.md)** - Comprehensive guide for all AI coding agents
- **[`CLAUDE.md`](../../CLAUDE.md)** - Claude AI-specific optimizations and patterns
- **[`GEMINI.md`](../../GEMINI.md)** - Gemini AI rapid development workflows

### Specialized Instructions
- **[`development.instructions.md`](../instructions/development.instructions.md)** - Development environment and coding standards
- **[`testing.instructions.md`](../instructions/testing.instructions.md)** - Comprehensive testing strategies
- **[`wallet-integration.instructions.md`](../instructions/wallet-integration.instructions.md)** - Wallet-specific implementation patterns

## Key Concepts for Agents

### Repository Purpose
This toolkit enables end-to-end testing of blockchain applications with:
- Automated wallet interactions (MetaMask, Coinbase Wallet, Phantom)
- Fork mode testing against real blockchain data
- Type-safe configuration using TypeScript
- Cross-chain testing capabilities

### Core Technologies
- **TypeScript** (strict mode, no `any` types)
- **Playwright** for browser automation
- **Viem** for Ethereum interactions
- **Biome** for linting and formatting
- **Anvil/Foundry** for local blockchain nodes

### Architecture Principles

#### 1. Fluent Configuration API
```typescript
const config = configure()
  .withLocalNode({ fork: rpcUrl, chainId: 1 })
  .withMetaMask()
  .withSeedPhrase({ seedPhrase, password })
  .withNetwork({ name, rpcUrl, chainId, symbol })
  .build();
```

#### 2. Test Creation Pattern
```typescript
const test = createOnchainTest(config);

test('wallet interaction', async ({ page, metamask, node }) => {
  await page.goto('http://localhost:3000');
  await metamask.handleAction('connect', { shouldApprove: true });
  await expect(page.getByTestId('connected')).toBeVisible();
});
```

#### 3. Wallet Action Abstraction
All wallet interactions use a unified action interface:
- `connect` - Connect wallet to DApp
- `transaction` - Approve/reject transactions
- `signature` - Sign messages
- `switchNetwork` - Change networks
- `tokenApproval` - Approve token spending

## Development Guidelines

### Code Quality Standards
- **TypeScript strict mode** - No implicit `any`, proper typing required
- **Biome linting** - Run `npm run lint:fix` before committing
- **Comprehensive testing** - All features require tests
- **Documentation** - Update README and docs for API changes

### Build and Test Workflow
```bash
# Standard development cycle
npm run build        # Compile TypeScript
npm run lint:fix     # Fix formatting and style
npm run test         # Run Playwright tests
```

### Testing Philosophy
- **End-to-end focus** - Test complete user workflows
- **Fork mode realism** - Use real blockchain data when possible
- **Cross-wallet compatibility** - Ensure features work with all supported wallets
- **Type safety** - Leverage TypeScript for compile-time verification

## Agent-Specific Guidance

### For GitHub Copilot
- Use descriptive function/variable names for better suggestions
- Add JSDoc comments for complex functions
- Follow existing patterns for consistent completions
- Read `.github/copilot-instructions.md` for detailed guidance

### For Claude AI
- Focus on comprehensive analysis and edge cases
- Design thorough test coverage strategies
- Consider blockchain complexity and multi-chain scenarios
- Read `CLAUDE.md` for deep analysis patterns

### For Gemini AI
- Start with simple, working implementations
- Iterate quickly with fast feedback cycles
- Focus on user experience and performance
- Read `GEMINI.md` for rapid development workflows

### For Other Agents
- Follow patterns in `AGENTS.md`
- Maintain consistency with established code structure
- Prioritize type safety and comprehensive testing
- Adapt guidelines as needed for your specific capabilities

## Critical Files for Agents

### Core API Surface
- **`src/configBuilder.ts`** - Main configuration API (changes affect all users)
- **`src/createOnchainTest.ts`** - Core test setup logic
- **`src/wallets/*/index.ts`** - Wallet-specific implementations

### Build and CLI
- **`package.json`** - Build scripts and dependencies
- **`tsconfig.json`** - TypeScript configuration
- **`biome.json`** - Linting and formatting rules
- **`src/cli/*.mjs`** - Wallet preparation scripts

### Testing Infrastructure
- **`tests/`** - Test files and fixtures
- **`playwright.config.ts`** - Playwright configuration

## Common Tasks

### Adding Wallet Support
1. Create `src/wallets/NewWallet/` directory
2. Implement wallet class extending BaseWallet
3. Add Playwright fixtures
4. Create CLI preparation script
5. Update configuration builder
6. Add comprehensive tests

### Adding Wallet Actions
1. Define action type in base interfaces
2. Implement in all wallet classes
3. Add parameter validation
4. Create tests for all wallets
5. Update documentation

### Configuration Changes
1. Maintain backward compatibility
2. Add validation for new parameters
3. Update type definitions
4. Provide migration guides if breaking

## Known Issues

### Wallet Extensions
- ✅ **MetaMask** - Works correctly
- ⚠️ **Coinbase Wallet** - Extension download currently broken (upstream issue)
- ⚠️ **Phantom** - Extension download currently broken (upstream issue)

### Environment Requirements
- Node.js >= 14.0.0 (recommended >= 18.0.0)
- Foundry for local blockchain testing
- Test-only seed phrases (NEVER use real funds)

## Best Practices for Agents

### 1. Understand Before Changing
- Read relevant instruction files before making changes
- Build and test to understand current state
- Identify patterns in existing code
- Check for similar implementations

### 2. Make Minimal Changes
- Focus on the specific issue or feature
- Avoid refactoring unrelated code
- Maintain existing patterns and style
- Test changes incrementally

### 3. Maintain Type Safety
- Use proper TypeScript types throughout
- Leverage discriminated unions for action types
- Ensure proper async/await typing
- Avoid using `any` type

### 4. Comprehensive Testing
- Add tests for new functionality
- Test edge cases and error conditions
- Ensure cross-wallet compatibility
- Use fork mode for realistic scenarios

### 5. Documentation
- Update README for API changes
- Add JSDoc comments for public APIs
- Include usage examples
- Keep documentation current

## Getting Help

If you encounter issues or need clarification:
1. Check the relevant instruction files listed above
2. Review existing code for similar patterns
3. Consult CONTRIBUTING.md for contribution guidelines
4. Check README.md for project overview

## Security Considerations

- Never commit real seed phrases or private keys
- Use test-only credentials in .env files
- Validate user inputs in wallet interactions
- Handle sensitive data appropriately

---

**Remember**: This toolkit focuses on making blockchain testing accessible and reliable. Prioritize clear APIs, comprehensive error handling, and type safety over premature optimization.
