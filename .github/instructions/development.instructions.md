# Development Instructions for Onchain Test Kit

This file provides development-specific instructions for AI agents working on the Onchain Test Kit project.

## Development Environment Setup

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn package manager
- Git for version control
- Foundry for local blockchain development

### Initial Setup Commands
```bash
# Install dependencies
npm install

# Verify setup
npm run build
npm run lint
npm run test

# Prepare wallet extensions
npm run prepare-metamask
npm run prepare-coinbase  
npm run prepare-phantom
```

## Code Quality Standards

### TypeScript Configuration
- Strict mode enabled in tsconfig.json
- No `any` types allowed without explicit justification
- Proper async/await typing with Playwright
- Use discriminated unions for action types

### Linting and Formatting
- Biome for both linting and formatting (replaces ESLint/Prettier)
- Run `npm run lint:fix` before committing
- Follow existing code style patterns
- Use descriptive variable and function names

### Testing Requirements
- All new features must include comprehensive tests
- Integration tests for wallet interactions
- Fork mode tests for DeFi scenarios
- Cross-wallet compatibility testing

## Architecture Guidelines

### Configuration Builder Pattern
```typescript
// Always use the fluent builder pattern for configuration
const config = configure()
  .withWallet() // MetaMask, Coinbase, or Phantom
  .withCredentials() // Seed phrase or private key
  .withNetwork() // Chain configuration
  .withLocalNode() // Optional fork mode
  .build();
```

### Wallet Implementation Structure
```typescript
// Standard wallet implementation pattern
export class WalletImplementation extends BaseWallet {
  async handleAction(action: WalletActionType, options?: ActionOptions): Promise<void> {
    switch (action) {
      case 'connect':
        return this.handleConnect(options);
      case 'transaction':
        return this.handleTransaction(options);
      // ... other actions
    }
  }
}
```

### Test Creation Pattern
```typescript
// Standard test structure
const test = createOnchainTest(walletConfig);

test('descriptive test name', async ({ page, wallet, node }) => {
  // Setup phase
  await page.goto(testUrl);
  
  // Action phase
  await wallet.handleAction('connect', { shouldApprove: true });
  
  // Verification phase
  await expect(page.getByTestId('result')).toBeVisible();
});
```

## Development Workflows

### Adding New Wallet Support
1. Create wallet directory: `src/wallets/NewWallet/`
2. Implement wallet class extending BaseWallet
3. Create Playwright fixtures
4. Add CLI preparation scripts
5. Update configuration builder
6. Add comprehensive tests
7. Update documentation

### Adding New Wallet Actions
1. Define action type in base interfaces
2. Implement in all wallet classes
3. Add parameter validation
4. Create comprehensive tests
5. Update type definitions
6. Document usage examples

### Configuration Changes
1. Maintain backward compatibility
2. Add proper validation
3. Update type definitions
4. Provide migration guides if breaking
5. Update examples and documentation

## Testing Strategies

### Local Development Testing
```typescript
// Use local node for fast iteration
const config = configure()
  .withMetaMask()
  .withLocalNode({
    accounts: 5,
    balance: '100000000000000000000', // 100 ETH
  })
  .build();
```

### Fork Mode Testing
```typescript
// Use specific block numbers for reproducible tests
const config = configure()
  .withMetaMask()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/api-key',
    forkBlockNumber: 18500000, // Specific block
    chainId: 1,
  })
  .build();
```

### Cross-Wallet Testing
```typescript
// Test with all supported wallets
const wallets = ['metamask', 'coinbase', 'phantom'];
wallets.forEach(walletType => {
  const config = configure()
    .withWallet(walletType)
    .withTestCredentials()
    .build();
    
  // Run tests with each wallet
});
```

## Error Handling Best Practices

### Descriptive Error Messages
```typescript
if (!config.wallet) {
  throw new Error('Wallet configuration is required. Use .withMetaMask(), .withCoinbase(), or .withPhantom()');
}
```

### Graceful Degradation
```typescript
try {
  await wallet.handleAction('connect');
} catch (error) {
  if (error.message.includes('timeout')) {
    // Retry with longer timeout
    await wallet.handleAction('connect', { timeout: 30000 });
  } else {
    throw error;
  }
}
```

### Proper Async Error Handling
```typescript
async function handleWalletOperation() {
  try {
    await walletOperation();
  } catch (error) {
    console.error('Wallet operation failed:', error);
    throw new WalletError('Failed to complete wallet operation', error);
  }
}
```

## Performance Considerations

### Test Execution Speed
- Use minimal browser instances
- Cache wallet extensions
- Optimize selector strategies
- Use parallel test execution where safe

### Resource Management
- Clean up browser contexts properly
- Stop local nodes after tests
- Manage memory usage in long test suites
- Use appropriate timeouts

## Documentation Standards

### Code Documentation
- JSDoc comments for public APIs
- Include parameter descriptions and examples
- Document error conditions and edge cases
- Keep documentation current with code changes

### Example Quality
- Provide working, tested examples
- Include common use cases
- Show error handling patterns
- Demonstrate best practices

## Debugging Guidelines

### Common Issues
1. **Extension not found**: Run preparation scripts
2. **Network connection**: Check RPC URLs and rate limits
3. **Timing issues**: Increase timeouts for wallet operations
4. **Type errors**: Ensure proper Playwright types are imported

### Debugging Tools
- Browser developer tools for element inspection
- Playwright trace viewer for test debugging
- Console logs for wallet operation tracking
- Network inspection for RPC call analysis

## Release Considerations

### Backward Compatibility
- Avoid breaking changes in patch releases
- Provide deprecation warnings for removed features
- Include migration guides for major version updates
- Test with existing user configurations

### Version Management
- Follow semantic versioning (semver)
- Update changelog for all releases  
- Tag releases properly
- Test release candidates thoroughly

Remember: The goal is to make blockchain testing accessible, reliable, and efficient for developers working with DApps.