# AI Agents Guide for Onchain Test Kit

This document provides guidance for AI agents (including GitHub Copilot, Claude, Gemini, and others) working on the Onchain Test Kit project.

## Project Overview

The Onchain Test Kit is a comprehensive end-to-end testing toolkit for blockchain applications, built on Playwright for reliable browser automation. It specializes in wallet automation and DApp testing with support for multiple wallet providers.

### Core Mission
Enable developers to write reliable, deterministic tests for blockchain applications by providing:
- Simplified wallet automation
- Fork mode testing against real blockchain data
- Type-safe configuration APIs
- Cross-platform compatibility

## Universal Guidelines for All AI Agents

### Code Quality Standards
1. **TypeScript First**: Always use strict TypeScript with explicit typing
2. **Async/Await**: Use modern async patterns consistently
3. **Error Handling**: Implement comprehensive error messages and proper exception handling
4. **Testing**: Every change should include appropriate tests
5. **Documentation**: Keep code comments and user documentation up-to-date

### Architectural Principles
1. **Builder Pattern**: Use fluent interfaces for configuration APIs
2. **Separation of Concerns**: Keep wallet logic, configuration, and testing separate
3. **Extensibility**: Design for easy addition of new wallets and features
4. **Backward Compatibility**: Avoid breaking changes to public APIs
5. **Performance**: Optimize for test execution speed and developer experience

### Development Workflow
1. **Analysis First**: Understand the existing codebase before making changes
2. **Incremental Changes**: Make small, testable modifications
3. **Validation**: Use linting, building, and testing to validate changes
4. **Documentation**: Update all relevant documentation

## Technical Architecture

### Core Components

```
src/
├── configBuilder.ts        # Fluent API for test configuration
├── createOnchainTest.ts    # Test creation and fixture management
├── wallets/               # Wallet-specific implementations
│   ├── MetaMask/          # MetaMask automation
│   ├── Coinbase/          # Coinbase Wallet automation
│   └── Phantom/           # Phantom Wallet automation
├── node/                  # Local blockchain node management
├── contracts/             # Smart contract utilities
└── cli/                   # Wallet preparation scripts
```

### Key Technologies
- **Playwright**: Browser automation and testing framework
- **TypeScript**: Type-safe development
- **Viem**: Ethereum TypeScript interface
- **Biome**: Code formatting and linting
- **Anvil**: Local blockchain simulation

## Common Patterns and APIs

### Configuration Pattern
```typescript
const config = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE!,
    password: 'PASSWORD',
  })
  .withNetwork({
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
    symbol: 'ETH',
  })
  .build();
```

### Test Structure
```typescript
import { createOnchainTest } from '@coinbase/onchaintestkit';

const test = createOnchainTest(config);

test('wallet connection test', async ({ page, metamask, node }) => {
  await page.goto('http://localhost:3000');
  await page.click('[data-testid="connect-wallet"]');
  await metamask.handleAction('connect', { shouldApprove: true });
});
```

### Wallet Actions
```typescript
// Connect to DApp
await metamask.handleAction('connect', { shouldApprove: true });

// Handle transaction
await metamask.handleAction('transaction', { shouldApprove: true });

// Token approval
await metamask.handleAction('tokenApproval', { 
  shouldApprove: true,
  amount: '1000000000000000000'
});

// Network switching
await metamask.handleAction('switchNetwork', { chainId: 1 });
```

## Agent-Specific Considerations

### For Code Generation Agents
- Follow existing code patterns and naming conventions
- Use the established TypeScript types and interfaces
- Implement proper error handling with descriptive messages
- Add JSDoc comments for public APIs

### For Code Analysis Agents
- Pay attention to the builder pattern in configuration
- Understand the fixture system used with Playwright
- Consider the lifecycle of wallet extensions and browser contexts
- Analyze error propagation through async operations

### for Testing Agents
- Focus on both unit tests and integration tests
- Consider edge cases like network failures and wallet errors
- Test cross-browser compatibility when relevant
- Validate fork mode functionality with different blockchain states

### For Documentation Agents
- Keep technical accuracy as the highest priority
- Provide practical examples for all features
- Maintain consistency with existing documentation style
- Consider both beginner and advanced user scenarios

## Development Environment Setup

### Required Tools
```bash
# Node.js version 14 or higher
node --version

# Package installation
npm install

# Playwright browsers (automatically installed)
npx playwright install
```

### Available Commands
```bash
npm run build        # Compile TypeScript
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code
npm run test         # Run tests
npm run clean        # Remove build artifacts

# Wallet preparation
npm run prepare-metamask
npm run prepare-coinbase  
npm run prepare-phantom
```

### Environment Variables
```env
E2E_TEST_SEED_PHRASE="test wallet seed phrase (never use real funds)"
ETHEREUM_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/your-api-key"
BASE_RPC_URL="https://mainnet.base.org"
```

## Common Development Scenarios

### Adding New Wallet Support
1. Create wallet directory: `src/wallets/NewWallet/`
2. Implement wallet class extending `BaseWallet`
3. Create Playwright fixtures for the wallet
4. Add configuration builder method
5. Create CLI preparation scripts
6. Update type definitions and exports
7. Add comprehensive tests
8. Update documentation

### Adding New Action Types
1. Define action type in wallet-specific enum
2. Implement action handler in wallet class
3. Add type definitions and validation
4. Create tests for all supported wallets
5. Update documentation with examples

### Fork Mode Enhancements
1. Understand existing node management in `src/node/`
2. Consider RPC provider compatibility
3. Handle network switching and block number management
4. Test with different fork scenarios
5. Document performance implications

### Bug Fixes and Maintenance
1. Reproduce the issue with a minimal test case
2. Trace the issue through the codebase
3. Fix at the root cause level
4. Add regression tests
5. Verify no breaking changes to public APIs

## Testing Philosophy

### Reliability First
- Tests should be deterministic and repeatable
- Handle timing issues and race conditions
- Clean up browser state between tests
- Use proper waiting mechanisms

### Real-World Scenarios
- Test with actual DApp interfaces when possible
- Use fork mode for realistic blockchain interactions
- Consider gas price fluctuations and network congestion
- Validate error handling with real failure scenarios

### Developer Experience
- Provide clear error messages for configuration issues
- Optimize for fast feedback cycles
- Support parallel test execution
- Make debugging straightforward

## Security Considerations

### Test Environment Safety
- Never use real private keys or seed phrases with actual funds
- Isolate test wallets from production environments
- Use environment variables for sensitive configuration
- Validate that fork mode doesn't expose sensitive data

### Extension Security
- Download wallet extensions from official sources
- Validate extension integrity when possible
- Handle extension updates gracefully
- Consider security implications of automated wallet actions

## Performance Optimization

### Test Execution Speed
- Minimize browser startup time
- Reuse contexts when possible
- Optimize network requests in fork mode
- Use parallel execution for independent tests

### Memory Management
- Clean up browser contexts properly
- Manage local node processes efficiently  
- Handle large blockchain state downloads
- Monitor resource usage in CI environments

## Contributing Guidelines

### Pull Request Process
1. Ensure all tests pass locally
2. Run linting and formatting
3. Update documentation as needed
4. Provide clear commit messages
5. Include examples for new features

### Code Review Checklist
- TypeScript compilation without errors
- All tests passing
- Documentation updated
- No breaking changes (or properly versioned)
- Performance impact considered
- Security implications reviewed

Remember: This toolkit serves the blockchain development community. Prioritize reliability, clear APIs, and comprehensive error handling to help developers build robust DApps with confidence.