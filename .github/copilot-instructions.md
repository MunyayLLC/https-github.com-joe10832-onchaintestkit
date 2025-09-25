# GitHub Copilot Instructions for Onchain Test Kit

This document provides context and guidelines for GitHub Copilot when working on the Onchain Test Kit project.

## Project Overview

The Onchain Test Kit is an end-to-end testing toolkit for blockchain applications, powered by Playwright. It provides comprehensive wallet automation and testing capabilities for DApps with support for MetaMask, Coinbase Wallet, and Phantom wallets.

### Key Technologies
- **TypeScript**: Primary language for type-safe development
- **Playwright**: Browser automation and testing framework
- **Viem**: TypeScript interface for Ethereum with multi-chain support
- **Biome**: Fast formatter and linter (replaces ESLint/Prettier)
- **Node.js**: Runtime environment (minimum version 14.0.0)

## Architecture

### Core Components

1. **Configuration Builder** (`src/configBuilder.ts`)
   - Fluent API for test configuration
   - Supports MetaMask, Coinbase Wallet, and Phantom
   - Handles network setup and wallet configuration
   - Pattern: Builder pattern with method chaining

2. **Wallet Fixtures** (`src/wallets/*/fixtures.ts`)
   - Playwright test fixtures for each wallet type
   - Provides wallet instances to tests
   - Handles wallet initialization and cleanup

3. **Local Node Manager** (`src/node/LocalNodeManager.ts`)
   - Manages Anvil local blockchain nodes
   - Supports fork mode for testing with real blockchain data
   - Handles node lifecycle (start/stop)

4. **Smart Contract Manager** (`src/contracts/SmartContractManager.ts`)
   - Contract deployment and interaction utilities
   - Type-safe contract interfaces

### Directory Structure
```
src/
├── cli/                    # Command-line tools (wallet preparation scripts)
├── configBuilder.ts        # Main configuration API
├── createOnchainTest.ts    # Test creation utilities
├── wallets/               # Wallet-specific implementations
│   ├── MetaMask/          # MetaMask automation
│   ├── Coinbase/          # Coinbase Wallet automation
│   └── Phantom/           # Phantom Wallet automation
├── node/                  # Local node management
├── contracts/             # Smart contract utilities
└── index.ts               # Main exports
```

## Development Guidelines

### Code Style and Standards

1. **Use TypeScript strictly**
   - Enable strict mode in tsconfig.json
   - Prefer explicit types over `any`
   - Use proper interface definitions

2. **Follow existing patterns**
   - Use the builder pattern for configuration APIs
   - Implement wallet-specific classes extending base interfaces
   - Follow the fixture pattern for Playwright integration

3. **Error Handling**
   - Use descriptive error messages
   - Implement proper error types
   - Handle async operations with try/catch

### API Design Principles

1. **Fluent Interface**: Use method chaining for configuration
   ```typescript
   const config = configure()
     .withMetaMask()
     .withSeedPhrase({ seedPhrase: '...', password: '...' })
     .withNetwork({ name: '...', rpcUrl: '...', chainId: 1 })
     .build();
   ```

2. **Type Safety**: Leverage TypeScript for compile-time safety
   - Use union types for action types
   - Implement proper generic constraints
   - Export necessary types for consumers

3. **Async/Await**: Use modern async patterns
   - Prefer async/await over Promises.then()
   - Handle Promise rejections appropriately

### Testing Patterns

1. **Test Structure**
   ```typescript
   import { createOnchainTest } from '@coinbase/onchaintestkit';
   
   const test = createOnchainTest(
     configure()
       .withMetaMask()
       .withNetwork(...)
       .build()
   );
   
   test('test description', async ({ page, metamask, node }) => {
     // Test implementation
   });
   ```

2. **Wallet Actions**
   ```typescript
   // Connect to DApp
   await metamask.handleAction('connect', { shouldApprove: true });
   
   // Handle transaction
   await metamask.handleAction('transaction', { shouldApprove: true });
   
   // Switch network
   await metamask.handleAction('switchNetwork', { chainId: 1 });
   ```

3. **Fork Mode Testing**
   ```typescript
   const test = createOnchainTest(
     configure()
       .withLocalNode({
         fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
         forkBlockNumber: 18500000, // Specific block for reproducibility
         chainId: 1,
       })
       .withMetaMask()
       .build()
   );
   ```

## Common Patterns and Examples

### Configuration Examples

1. **Basic MetaMask Setup**
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

2. **Fork Mode Configuration**
   ```typescript
   const config = configure()
     .withLocalNode({
       fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
       forkBlockNumber: 18500000,
       chainId: 1,
       accounts: 10,
       balance: '100000000000000000000', // 100 ETH
     })
     .withMetaMask()
     .build();
   ```

3. **Multi-Wallet Setup**
   ```typescript
   const config = configure()
     .withCoinbase() // or .withPhantom()
     .withPrivateKey({
       privateKey: process.env.PRIVATE_KEY!,
       password: 'PASSWORD',
     })
     .withNetwork({
       name: 'Ethereum Mainnet',
       rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
       chainId: 1,
       symbol: 'ETH',
     })
     .build();
   ```

### Wallet Action Patterns

1. **DApp Connection Flow**
   ```typescript
   test('connect wallet to dapp', async ({ page, metamask }) => {
     await page.goto('http://localhost:3000');
     await page.click('[data-testid="connect-wallet"]');
     await metamask.handleAction('connect', { shouldApprove: true });
   });
   ```

2. **Transaction Handling**
   ```typescript
   test('handle transaction approval', async ({ page, metamask }) => {
     // Trigger transaction in DApp
     await page.click('[data-testid="send-transaction"]');
     
     // Handle MetaMask transaction popup
     await metamask.handleAction('transaction', { 
       shouldApprove: true,
       gasLimit: '21000',
       gasPrice: '20000000000',
     });
   });
   ```

3. **Token Operations**
   ```typescript
   test('approve token spending', async ({ page, metamask }) => {
     await page.click('[data-testid="approve-token"]');
     await metamask.handleAction('tokenApproval', {
       shouldApprove: true,
       amount: '1000000000000000000', // 1 token
     });
   });
   ```

## Build and Development Commands

### Available Scripts
```bash
npm run build        # Compile TypeScript to JavaScript
npm run lint         # Run Biome linter
npm run lint:fix     # Fix linting issues automatically
npm run format       # Format code with Biome
npm run test         # Run Playwright tests
npm run clean        # Remove build artifacts

# Wallet preparation scripts
npm run prepare-metamask   # Download and setup MetaMask extension
npm run prepare-coinbase   # Download and setup Coinbase Wallet extension
npm run prepare-phantom    # Download and setup Phantom extension
```

### Development Workflow
1. Install dependencies: `npm install`
2. Run linter: `npm run lint`
3. Build project: `npm run build`
4. Run tests: `npm run test`

## Environment Setup

### Required Environment Variables
```env
# Test wallet seed phrase (for testing only, never use real funds)
E2E_TEST_SEED_PHRASE="your test wallet seed phrase"

# Optional: RPC URLs for fork mode testing
ETHEREUM_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/your-api-key"
BASE_RPC_URL="https://mainnet.base.org"
```

### Dependencies
- Node.js >= 14.0.0
- npm or yarn
- Playwright browsers (installed automatically)

## Common Issues and Solutions

### Build Issues
1. **TypeScript Errors**: Ensure all dependencies are installed and `@playwright/test` is available
2. **Console Errors**: The project uses Node.js console, ensure proper tsconfig.json setup

### Testing Issues
1. **Wallet Extension Not Found**: Run appropriate preparation script (`npm run prepare-metamask`)
2. **Network Connection**: Ensure RPC URLs are valid and accessible
3. **Fork Mode Issues**: Check block numbers and RPC provider limits

### Performance
1. **Fork Mode Optimization**: Use specific block numbers and limit accounts
2. **Parallel Testing**: Use different ports for multiple test runners
3. **RPC Rate Limits**: Use paid providers for heavy testing

## Contributing Guidelines

### Code Changes
1. Follow existing architectural patterns
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Run linting and formatting before committing

### Pull Request Process
1. Ensure all tests pass
2. Update README.md if needed
3. Add examples for new features
4. Include migration guide for breaking changes

### Testing Requirements
- All new wallet actions must have corresponding tests
- Fork mode features should include integration tests
- Configuration changes require validation tests

## File-Specific Guidance

### `src/configBuilder.ts`
- Main API surface - changes here affect all users
- Maintain backward compatibility when possible
- Use builder pattern consistently
- Validate configuration parameters

### `src/wallets/*/index.ts`
- Implement wallet-specific action handling
- Follow consistent error handling patterns
- Support all common DApp interactions
- Use proper typing for action parameters

### `src/createOnchainTest.ts`
- Core test setup logic
- Handle fixture lifecycle properly
- Provide clear error messages for setup failures
- Support multiple wallet configurations

### CLI Scripts (`src/cli/`)
- Handle cross-platform compatibility
- Provide clear progress feedback
- Include proper error handling
- Support different installation targets

Remember: This is a testing toolkit - prioritize reliability, clear APIs, and comprehensive error handling over performance optimizations.