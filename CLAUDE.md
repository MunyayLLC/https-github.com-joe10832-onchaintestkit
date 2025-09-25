# Claude Instructions for Onchain Test Kit

This document provides specific context and guidelines for Claude when working on the Onchain Test Kit project.

## Project Overview

The Onchain Test Kit is an end-to-end testing toolkit for blockchain applications, powered by Playwright. It provides comprehensive wallet automation and testing capabilities for DApps with support for MetaMask, Coinbase Wallet, and Phantom wallets.

### Key Technologies
- **TypeScript**: Primary language for type-safe development
- **Playwright**: Browser automation and testing framework
- **Viem**: TypeScript interface for Ethereum with multi-chain support
- **Biome**: Fast formatter and linter (replaces ESLint/Prettier)
- **Node.js**: Runtime environment (minimum version 14.0.0)

## Claude-Specific Guidelines

### Code Analysis Approach
Claude excels at understanding complex codebases and architectural patterns. When working with this project:

1. **Architectural Understanding**: Focus on the builder pattern in `src/configBuilder.ts` and how it creates fluent APIs
2. **Type Safety**: Leverage TypeScript's type system to understand relationships between components
3. **Error Handling**: Pay special attention to async/await patterns and proper error propagation
4. **Testing Patterns**: Understand how Playwright fixtures work with wallet automation

### Recommended Working Style

1. **Thorough Analysis**: Before making changes, analyze the entire flow from configuration to test execution
2. **Incremental Changes**: Make small, well-tested changes that maintain backward compatibility
3. **Documentation**: Update both code comments and user-facing documentation
4. **Testing**: Always consider edge cases and error scenarios

## Core Architecture Components

### Configuration Builder Pattern
```typescript
// The fluent API allows method chaining for intuitive configuration
const config = configure()
  .withMetaMask()
  .withSeedPhrase({ seedPhrase: '...', password: '...' })
  .withNetwork({ name: '...', rpcUrl: '...', chainId: 1 })
  .build();
```

### Wallet Integration
- Each wallet (MetaMask, Coinbase, Phantom) has its own directory in `src/wallets/`
- Wallet actions are handled through a common interface with specific implementations
- Browser automation is achieved through Playwright's extension loading capabilities

### Node Management
- Local Anvil nodes for testing
- Fork mode support for testing against real blockchain data
- Network configuration and lifecycle management

## Development Workflow

### Building and Testing
```bash
npm run build        # Compile TypeScript
npm run lint         # Check code quality with Biome
npm run test         # Run Playwright tests
npm run format       # Format code
```

### Wallet Preparation
```bash
npm run prepare-metamask   # Setup MetaMask extension
npm run prepare-coinbase   # Setup Coinbase Wallet extension
npm run prepare-phantom    # Setup Phantom extension
```

## Common Patterns for Claude

### When Adding New Features
1. **Understand the Context**: Study existing implementations before creating new ones
2. **Follow Patterns**: Use the established builder pattern for configurations
3. **Type Safety**: Ensure all new code is properly typed
4. **Error Handling**: Implement comprehensive error messages and proper exception handling
5. **Testing**: Create both unit tests and integration tests

### When Debugging Issues
1. **Trace the Flow**: Follow the execution path from configuration through test setup to wallet actions
2. **Check Types**: Verify TypeScript compilation and type compatibility
3. **Test Isolation**: Ensure tests don't interfere with each other
4. **Browser State**: Consider browser extension state and cleanup

### Code Review Considerations
1. **API Consistency**: Ensure new methods follow existing naming conventions
2. **Backward Compatibility**: Avoid breaking changes to public APIs
3. **Performance**: Consider the impact of changes on test execution time
4. **Documentation**: Update README.md and inline documentation as needed

## File-Specific Guidelines

### `src/configBuilder.ts`
- Central configuration API - changes here affect all users
- Maintain fluent interface patterns
- Validate all configuration options
- Provide clear error messages for invalid configurations

### `src/wallets/*/index.ts`
- Implement wallet-specific action handlers
- Follow the BaseWallet interface consistently
- Handle browser automation edge cases
- Provide comprehensive logging for debugging

### `src/createOnchainTest.ts`
- Core test setup and fixture management
- Handle initialization errors gracefully
- Support multiple wallet configurations
- Clean up resources properly

### CLI Scripts (`src/cli/`)
- Cross-platform compatibility is essential
- Provide clear progress indicators
- Handle download failures gracefully
- Support offline development when possible

## Testing Philosophy

This is a testing toolkit, so reliability is paramount:
- **Deterministic**: Tests should be reproducible across environments
- **Isolated**: Each test should be independent
- **Fast**: Optimize for quick feedback cycles
- **Comprehensive**: Cover happy path, error cases, and edge conditions

## Environment Considerations

### Development Environment
- Node.js >= 14.0.0
- Playwright browsers installed
- Proper environment variables configured
- RPC endpoints available for fork mode testing

### CI/CD Considerations
- Browser installation in containerized environments
- Secrets management for test wallets
- Parallel test execution
- Artifact cleanup

Remember: Claude's strength lies in understanding complex systems and relationships. Use this to provide thorough analysis and well-architected solutions that fit seamlessly into the existing codebase.