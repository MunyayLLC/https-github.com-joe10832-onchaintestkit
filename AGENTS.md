# AI Coding Agents Instructions for Onchain Test Kit

This document provides comprehensive setup instructions and general guidelines for AI coding agents working on the Onchain Test Kit project. For agent-specific instructions, see the corresponding files (CLAUDE.md, GEMINI.md, etc.).

## Quick Agent Setup Guide

### Step 1: Environment Preparation
```bash
# Ensure prerequisites are installed
node --version  # Should be >= 14.0.0 (recommended >= 18.0.0)
npm --version   # Should be present
git --version   # Should be present

# Clone and setup repository
git clone <repository-url>
cd onchaintestkit
npm install
```

### Step 2: Verify Agent Setup
```bash
# Test build process
npm run build

# Verify linting works
npm run lint

# Run tests to confirm functionality
npm run test  # Should pass 3 tests in ~800ms
```

### Step 3: Configure Agent Context
Choose your agent configuration approach:

#### For GitHub Copilot:
- Read `.github/copilot-instructions.md` for IDE integration
- Ensure instruction files are in your workspace
- Use descriptive naming for better suggestions

#### For Claude AI:
- Review `CLAUDE.md` for deep analysis patterns
- Focus on comprehensive planning and edge cases
- Leverage TypeScript excellence and blockchain complexity

#### For Gemini AI:
- Check `GEMINI.md` for rapid development workflows
- Prioritize user experience and performance
- Use quick iteration and creative solutions

#### For Other Agents:
- Follow patterns in this document
- Adapt instructions as needed for your specific agent
- Maintain consistency with established patterns

### Step 4: Agent-Specific Setup
```bash
# Prepare wallet extensions for testing
npm run prepare-metamask    # ✅ Works correctly
npm run prepare-coinbase    # ⚠️ Currently broken (known issue)
npm run prepare-phantom     # ⚠️ Currently broken (known issue)

# Create environment variables file
cp .env.example .env        # If available
# OR create .env manually:
echo 'E2E_TEST_SEED_PHRASE="your test seed phrase here"' > .env
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

### TypeScript Compilation
- Ensure `@playwright/test` is available in dependencies
- Check tsconfig.json includes proper lib configuration for Node.js
- Use proper typing for Playwright fixtures

### Wallet Extension Issues
- Run preparation scripts to download extensions
- Verify extension paths in test configuration
- Check browser compatibility

### Network Configuration
- Validate RPC URLs and chain IDs
- Use proper network configurations from viem
- Handle rate limiting with paid RPC providers

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