# Testing Framework Instructions

## Overview
Instructions for working with the OnchainTestKit testing framework and creating effective blockchain application tests.

## Test Structure

### Basic Test Setup
```typescript
import { createOnchainTest } from '@coinbase/onchaintestkit';
import { walletConfig } from './config';

const test = createOnchainTest(walletConfig);
const { expect } = test;

test('test description', async ({ page, walletFixture }) => {
  // Test implementation
});
```

### Configuration Patterns
Use the fluent configuration API:
```typescript
const config = configure()
  .withMetaMask() // or .withCoinbase() or .withPhantom()
  .withSeedPhrase({
    seedPhrase: process.env.TEST_SEED_PHRASE,
    password: 'test_password'
  })
  .withNetwork({
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
    symbol: 'ETH'
  })
  .build();
```

## Test Categories

### Connection Tests
- Verify wallet connection to DApp
- Test connection rejection scenarios
- Validate wallet state after connection

### Transaction Tests
- Test transaction approval flows
- Verify transaction parameters
- Test transaction rejection
- Validate gas estimation
- Test network-specific transaction formats

### Token Operations
- Token approval processes
- Token transfer operations
- Token balance verification
- Multi-token scenarios

### Network Operations
- Network switching functionality
- Multi-network test scenarios
- Custom network addition
- Network-specific feature testing

## Best Practices

### Test Data Management
- Use environment variables for sensitive data
- Generate deterministic test data
- Clean up test state between runs
- Use proper test isolation

### Assertions
- Verify blockchain state changes
- Check wallet UI state
- Validate transaction receipts
- Test error conditions

### Fork Mode Testing
```typescript
const config = configure()
  .withLocalNode({
    fork: 'https://mainnet.infura.io/v3/YOUR_KEY',
    forkBlockNumber: 18500000,
    chainId: 1,
    accounts: 10,
    balance: '1000000000000000000000' // 1000 ETH
  })
  .build();
```

### Performance Optimization
- Reuse wallet connections where possible
- Minimize network calls
- Use appropriate timeouts
- Parallel test execution strategies

## Common Patterns

### DApp Integration
```typescript
test('interact with DApp', async ({ page, wallet }) => {
  await page.goto('https://app.example.com');
  
  // Connect wallet
  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  await wallet.handleAction(BaseActionType.CONNECT_TO_DAPP);
  
  // Perform operation
  await page.getByTestId('swap-button').click();
  await wallet.handleAction(BaseActionType.APPROVE_TRANSACTION);
  
  // Verify result
  await expect(page.getByText('Transaction confirmed')).toBeVisible();
});
```

### Multi-Wallet Testing
- Test scenarios with different wallet types
- Compare behavior across wallets
- Ensure consistent user experiences

## Debugging

### Test Failures
- Use Playwright's debugging tools
- Capture screenshots at failure points
- Log wallet extension console messages
- Monitor network requests

### Extension Issues
- Verify extension installation
- Check extension permissions
- Monitor extension background processes
- Review extension logs

## Environment Setup

### Prerequisites
- Node.js >= 14.0.0
- Playwright installed
- Wallet extensions prepared using CLI tools
- Environment variables configured

### CI/CD Considerations
- Headless testing setup
- Extension management in CI
- Test data security
- Parallel execution limits