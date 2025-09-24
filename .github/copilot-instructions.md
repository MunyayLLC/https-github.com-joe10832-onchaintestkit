# GitHub Copilot Instructions for OnchainTestKit

## Project Overview
OnchainTestKit is an end-to-end testing toolkit for blockchain applications, built on top of Playwright. It provides automated wallet interactions for MetaMask, Coinbase Wallet, and Phantom, along with local blockchain node management and smart contract testing capabilities.

## Key Technologies
- **TypeScript** - Primary language for type safety
- **Playwright** - Browser automation and testing framework
- **Viem** - Ethereum interaction library
- **Ethers.js** - Additional blockchain utilities
- **Node.js** - Runtime environment

## Architecture Components

### Core Modules
- **Wallet Management**: `src/wallets/` - Handles MetaMask, Coinbase, and Phantom wallet automation
- **Test Framework**: `src/createOnchainTest.ts` - Main test creation utility
- **Configuration**: `src/configBuilder.ts` - Fluent API for test configuration
- **Node Management**: `src/node/` - Local blockchain node orchestration
- **Contract Management**: `src/contracts/` - Smart contract interaction utilities

### Wallet Types
1. **MetaMask** (`src/wallets/MetaMask/`) - Browser extension wallet automation
2. **Coinbase** (`src/wallets/Coinbase/`) - Coinbase Wallet browser extension automation
3. **Phantom** (`src/wallets/Phantom/`) - Solana/multi-chain wallet automation

## Development Guidelines

### Code Style
- Use TypeScript with strict type checking
- Follow the existing patterns for wallet fixtures and action handlers
- Maintain consistent error handling across wallet implementations
- Use descriptive variable names that indicate blockchain context

### Testing Patterns
```typescript
// Standard test structure
const test = createOnchainTest(walletConfig);
test('description', async ({ page, walletFixture }) => {
  // Test implementation
});
```

### Wallet Action Types
- `BaseActionType` - Common actions (connect, approve transaction, etc.)
- Wallet-specific action types for specialized operations
- Always handle both approval and rejection scenarios

### Network Configuration
- Use viem chains for network definitions
- Support for fork mode testing against real blockchain data
- Local node management with customizable parameters

## File Naming Conventions
- Wallet implementations: `src/wallets/{WalletName}/index.ts`
- Fixture files: `src/wallets/{WalletName}/fixtures.ts`
- CLI tools: `src/cli/prepare-{wallet}.mjs`
- Type definitions: Use descriptive interfaces ending with `Config` or `Options`

## Common Patterns

### Configuration Builder
```typescript
const config = configure()
  .withWallet() // MetaMask, Coinbase, or Phantom
  .withNetwork(networkConfig)
  .withLocalNode(nodeConfig) // Optional for fork mode
  .build();
```

### Error Handling
- Use descriptive error messages that include context
- Implement timeout handling for wallet operations
- Provide fallback strategies for network operations

## Extension Management
The project includes CLI scripts for downloading and preparing wallet extensions:
- `prepare-metamask.mjs` - MetaMask extension setup
- `prepare-coinbase.mjs` - Coinbase Wallet extension setup
- `prepare-phantom.mjs` - Phantom Wallet extension setup

## Development Workflow
1. Changes should maintain backward compatibility
2. Add appropriate TypeScript types for new features
3. Update relevant documentation in `/docs`
4. Test with multiple wallet types when applicable
5. Consider fork mode implications for new features

## Security Considerations
- Never commit private keys or seed phrases
- Use environment variables for sensitive test data
- Validate wallet extension downloads and checksums
- Implement safe directory operations in CLI scripts

## Documentation
- Main documentation in `/docs` using MDX format
- API documentation should include usage examples
- Update README.md for significant feature additions