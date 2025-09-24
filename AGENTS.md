# OnchainTestKit Agent Instructions

## Project Description
OnchainTestKit is a comprehensive end-to-end testing toolkit for blockchain applications. It provides automated wallet interactions, local blockchain node management, and comprehensive testing utilities built on top of Playwright.

## Architecture Overview

### Core Components
1. **Wallet Automation** - Automated interactions with MetaMask, Coinbase Wallet, and Phantom
2. **Test Framework** - Playwright-based testing infrastructure with blockchain-specific fixtures
3. **Node Management** - Local blockchain node orchestration with fork mode support
4. **Configuration System** - Fluent API for test setup and configuration

### Key Features
- Multi-wallet support (MetaMask, Coinbase, Phantom)
- Fork mode testing against real blockchain data
- Network switching and management
- Transaction handling and approval automation
- Smart contract interaction utilities
- Type-safe TypeScript implementation

## Development Guidelines

### Code Organization
- `src/wallets/` - Wallet-specific implementations and fixtures
- `src/node/` - Local node management and network utilities
- `src/contracts/` - Smart contract interaction helpers
- `src/cli/` - Command-line tools for wallet extension preparation
- `docs/` - Documentation in MDX format
- `example/` - Example implementations and demos

### Technology Stack
- **TypeScript** - Primary language with strict typing
- **Playwright** - Browser automation framework
- **Viem** - Modern Ethereum library
- **Ethers.js** - Additional blockchain utilities
- **Node.js** - Runtime environment

### Testing Patterns
```typescript
const test = createOnchainTest(config);
test('test name', async ({ page, wallet }) => {
  // Test implementation with wallet automation
});
```

## Wallet Integration

### Supported Wallets
1. **MetaMask** - Most popular Ethereum wallet
2. **Coinbase Wallet** - Coinbase's self-custody wallet
3. **Phantom** - Leading Solana and multi-chain wallet

### Action Types
- Connection management (connect/disconnect)
- Transaction handling (approve/reject)
- Token operations (approve/transfer)
- Network switching
- Message signing

### Extension Management
CLI tools for downloading and preparing wallet extensions:
- `prepare-metamask` - MetaMask extension setup
- `prepare-coinbase` - Coinbase Wallet extension setup  
- `prepare-phantom` - Phantom Wallet extension setup

## Configuration System

### Builder Pattern
```typescript
const config = configure()
  .withWallet() // Choose wallet type
  .withSeedPhrase(seedPhraseConfig)
  .withNetwork(networkConfig)
  .withLocalNode(nodeConfig) // Optional for fork mode
  .build();
```

### Network Configuration
- Support for any EVM-compatible network
- Custom RPC endpoints
- Network switching capabilities
- Fork mode for testing against live data

## Fork Mode Testing

### Benefits
- Test against real contract state
- Access to live liquidity and data
- Realistic testing scenarios
- No need for complex test data setup

### Configuration
```typescript
.withLocalNode({
  fork: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY',
  forkBlockNumber: 18500000,
  chainId: 1,
  accounts: 10,
  balance: '1000000000000000000000' // 1000 ETH per account
})
```

## Best Practices

### Security
- Never commit private keys or seed phrases
- Use environment variables for sensitive data
- Validate extension downloads
- Implement safe file operations

### Performance
- Optimize node configurations
- Use appropriate timeouts
- Minimize network calls
- Implement proper cleanup

### Testing
- Use descriptive test names
- Implement proper assertions
- Handle error conditions
- Use appropriate test isolation

## Common Use Cases

### DeFi Protocol Testing
- Liquidity provision testing
- Swap functionality
- Lending/borrowing operations
- Yield farming scenarios

### NFT Marketplace Testing
- Minting processes
- Trading functionality
- Auction mechanisms
- Royalty handling

### Multi-signature Wallets
- Proposal creation
- Approval workflows
- Execution testing
- Access control verification

## Troubleshooting

### Common Issues
1. **Extension not loading** - Check preparation scripts
2. **Network connection issues** - Verify RPC endpoints
3. **Transaction failures** - Check gas settings and balances
4. **Test timeouts** - Adjust timeout values
5. **Port conflicts** - Use different ports for parallel tests

### Debugging Tools
- Playwright debugging features
- Browser developer tools
- Network request monitoring
- Extension console logging

## Contributing

### Pull Request Guidelines
- Maintain backward compatibility
- Add appropriate TypeScript types
- Update documentation
- Include test coverage
- Follow existing code style

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Update documentation
5. Submit pull request

This toolkit enables comprehensive testing of blockchain applications with real-world scenarios while maintaining the reliability and speed needed for continuous integration workflows.