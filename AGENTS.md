# AI Coding Agents Instructions for Onchain Test Kit

This document provides general instructions for AI coding agents working on the Onchain Test Kit project. For agent-specific instructions, see the corresponding files (CLAUDE.md, GEMINI.md, etc.).

## Getting Started as an AI Agent

### Quick Setup Checklist
1. **Environment Verification**:
   ```bash
   node --version    # Must be >= 14.0.0
   npm --version     # Verify npm is available
   ```

2. **Repository Setup**:
   ```bash
   npm install       # Install dependencies
   npm run build     # Verify build works
   npm run test      # Confirm tests pass (3 tests, ~800ms)
   ```

3. **Understanding the Codebase**:
   - Main API: `src/configBuilder.ts` (affects all users)
   - Test creation: `src/createOnchainTest.ts`
   - Wallet implementations: `src/wallets/*/index.ts`
   - CLI tools: `src/cli/*.mjs`

### Agent Workflow Example
```typescript
// 1. Understand the user's requirement
// Example: "Add support for a new wallet action"

// 2. Identify the files to modify
// - src/wallets/base/types.ts (add action type)
// - src/wallets/*/index.ts (implement in all wallets)
// - tests/ (add comprehensive tests)

// 3. Follow existing patterns
const config = configure()
  .withMetaMask()
  .withSeedPhrase({ seedPhrase: "...", password: "..." })
  .withNetwork({ name: "Base", rpcUrl: "...", chainId: 8453 })
  .build();

// 4. Validate with tests
test('new action works correctly', async ({ metamask }) => {
  await metamask.handleAction('newAction', { shouldApprove: true });
  // Verify expected behavior
});
```

## Project Overview

The Onchain Test Kit is an end-to-end testing toolkit for blockchain applications, powered by Playwright. It provides comprehensive wallet automation and testing capabilities for DApps with support for MetaMask, Coinbase Wallet, and Phantom wallets.

### Core Technologies
- **TypeScript**: Primary language for type-safe development
- **Playwright**: Browser automation and testing framework
- **Viem**: TypeScript interface for Ethereum with multi-chain support
- **Biome**: Fast formatter and linter (replaces ESLint/Prettier)
- **Node.js**: Runtime environment (minimum version 14.0.0)

## Key Architecture Principles

### 1. Configuration-First Design
The toolkit uses a fluent builder pattern for configuration:
```typescript
const config = configure()
  .withMetaMask()
  .withSeedPhrase({ seedPhrase: '...', password: '...' })
  .withNetwork({ name: '...', rpcUrl: '...', chainId: 1 })
  .build();
```

### 2. Wallet Abstraction
- Each wallet (MetaMask, Coinbase, Phantom) implements a common interface
- Action handling is standardized across wallet types
- Fixtures provide consistent testing patterns

### 3. Local Node Integration
- Supports Anvil local blockchain nodes
- Fork mode enables testing against real blockchain data
- Network configuration is chain-agnostic using viem

## Development Guidelines

### Code Style
1. **TypeScript strict mode**: All code must compile without `any` types
2. **Builder patterns**: Use method chaining for configuration APIs
3. **Async/await**: Prefer modern async patterns over Promise chains
4. **Error handling**: Use descriptive error messages and proper error types

### Testing Philosophy
- **Realistic scenarios**: Use fork mode to test against real blockchain data
- **Wallet automation**: Handle complex wallet interactions automatically
- **Type safety**: Leverage TypeScript for compile-time verification
- **End-to-end focus**: Test complete user workflows, not just unit functionality

### File Organization
```
src/
├── cli/                    # Command-line tools
├── configBuilder.ts        # Main configuration API
├── createOnchainTest.ts    # Test creation utilities
├── wallets/               # Wallet-specific implementations
├── node/                  # Local node management
├── contracts/             # Smart contract utilities
└── index.ts               # Main exports
```

## Common Development Tasks

### Adding New Wallet Support
1. Create wallet directory: `src/wallets/NewWallet/`
2. Implement wallet class extending base interface
3. Add Playwright fixtures
4. Update configuration builder
5. Add CLI preparation scripts

### Adding New Actions
1. Define action types in wallet interfaces
2. Implement handlers in all wallet classes
3. Add comprehensive tests
4. Update documentation and examples

### Configuration Changes
1. Maintain backward compatibility
2. Add validation for new parameters
3. Update type definitions
4. Provide migration guides for breaking changes

## Build and Test Commands

```bash
npm run build        # Compile TypeScript
npm run lint         # Run Biome linter
npm run test         # Run Playwright tests
npm run format       # Format code with Biome

# Wallet preparation
npm run prepare-metamask
npm run prepare-coinbase
npm run prepare-phantom
```

## Common Issues and Solutions

### Agent Setup Issues

#### 1. "Cannot find module" or TypeScript errors
```bash
# Solution: Ensure all dependencies are installed
npm install
npm run build

# Check peer dependencies
npm ls @playwright/test
```

#### 2. "Extension not found" during wallet tests
```bash
# Solution: Prepare wallet extensions
npm run prepare-metamask  # ✅ Works
npm run prepare-coinbase  # ⚠️ Known issue with zip download
npm run prepare-phantom   # ⚠️ Known issue with zip download

# Workaround: Use MetaMask for testing until other wallets are fixed
```

#### 3. "Network timeout" or RPC errors
```bash
# Solution: Use proper RPC URLs with rate limits
# For fork mode testing, use paid RPC providers (Alchemy, Infura)
# Avoid public endpoints for CI/CD pipelines
```

#### 4. Test flakiness or timing issues
```typescript
// Solution: Use proper waiting strategies
await expect(page.getByTestId('result')).toBeVisible({ timeout: 30000 });
await wallet.handleAction('connect', { timeout: 45000 });
```

### Build and Development Issues

#### TypeScript Compilation
- Ensure `@playwright/test` is available in dependencies
- Check tsconfig.json includes proper lib configuration for Node.js
- Use proper typing for Playwright fixtures

#### Wallet Extension Issues
- Run preparation scripts to download extensions
- Verify extension paths in test configuration
- Check browser compatibility

#### Network Configuration
- Validate RPC URLs and chain IDs
- Use proper network configurations from viem
- Handle rate limiting with paid RPC providers

### Agent-Specific Best Practices

#### For Claude
- Focus on comprehensive analysis and edge cases
- Provide detailed explanations for complex blockchain concepts
- Consider multiple implementation approaches
- Document reasoning behind architectural decisions

#### For Gemini
- Emphasize rapid prototyping and iteration
- Focus on user experience and clear APIs
- Optimize for performance and reliability
- Provide practical, actionable solutions

#### For GitHub Copilot
- Use descriptive function and variable names
- Write clear comments explaining blockchain-specific logic
- Follow established patterns consistently
- Leverage TypeScript types for better suggestions

## Contributing Guidelines

1. **Follow existing patterns**: Use established architectural approaches
2. **Comprehensive testing**: Add tests for all new functionality  
3. **Documentation updates**: Keep README and docs current
4. **Type safety**: Maintain strict TypeScript compliance
5. **Performance considerations**: Optimize for testing speed and reliability

## Key Files for AI Agents

- `src/configBuilder.ts`: Main API surface - changes affect all users
- `src/createOnchainTest.ts`: Core test setup logic  
- `src/wallets/*/index.ts`: Wallet-specific implementations
- `src/cli/*`: Cross-platform preparation scripts

Remember: This is a testing toolkit focused on reliability and ease of use for blockchain DApp testing.