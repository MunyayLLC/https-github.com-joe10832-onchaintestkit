# Testing Instructions for Onchain Test Kit

This file provides comprehensive testing guidelines for AI agents working on the Onchain Test Kit project. For general project context, also refer to AGENTS.md and .github/copilot-instructions.md. For specialized guidance, see development.instructions.md and wallet-integration.instructions.md.

## Quick Testing Setup Guide

### 1. Testing Environment Setup
```bash
# ✅ Verify project is ready for testing
npm install && npm run build

# ✅ Prepare wallet extensions for testing
npm run prepare-metamask  # Required for wallet testing
# Note: Coinbase/Phantom currently have known zip download issues

# ✅ Set up test environment variables
export E2E_TEST_SEED_PHRASE="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
# ☝️ This is the test-only seed phrase - never use for real funds!

# ✅ Verify testing setup
npm run test  # Should pass 3 tests in ~729ms
```

### 2. Testing Strategy Overview
This project uses **end-to-end testing** focused on:
- **Wallet automation**: Complex wallet interactions handled seamlessly
- **Fork mode testing**: Real blockchain data for realistic scenarios  
- **Cross-wallet compatibility**: Testing across MetaMask, Coinbase, Phantom
- **Type safety**: TypeScript for compile-time verification

### 3. Agent-Specific Testing Setup

#### For Comprehensive Testing (Claude):
- Focus on edge cases and complex blockchain scenarios
- Design thorough test coverage strategies
- Consider multi-chain and cross-wallet compatibility
- Plan for realistic DeFi testing with fork mode

#### For Rapid Testing (Gemini):
- Start with simple test cases first
- Iterate quickly with `npm run test`
- Focus on common usage patterns
- Optimize for fast test execution

#### For Continuous Testing (GitHub Copilot):
- Use test-driven development patterns
- Let Copilot suggest test completions
- Follow existing test structures for consistency
- Add comprehensive assertions

## Testing Philosophy

### Core Principles
- **End-to-end focus**: Test complete user workflows, not just isolated functions
- **Realistic scenarios**: Use fork mode to test against real blockchain data
- **Wallet automation**: Handle complex wallet interactions seamlessly
- **Cross-wallet compatibility**: Ensure features work across all supported wallets

### Testing Pyramid for Blockchain
```
                    E2E Tests
                 (Fork mode, Real DApps)
                ┌─────────────────┐
                │   Integration   │  
              ┌─────────────────────┐
              │     Unit Tests      │
            ┌───────────────────────┐
            │   Configuration Tests │
          └─────────────────────────┘
```

## Test Structure and Organization

### Directory Layout
```
tests/
├── config/                 # Configuration testing
│   ├── builder.test.ts     # Configuration builder tests
│   └── validation.test.ts  # Parameter validation tests
├── wallets/               # Wallet-specific tests
│   ├── metamask.test.ts   # MetaMask integration tests
│   ├── coinbase.test.ts   # Coinbase Wallet tests
│   └── phantom.test.ts    # Phantom Wallet tests
├── integration/           # End-to-end integration tests
│   ├── dapp-connection.test.ts
│   ├── token-swap.test.ts
│   └── fork-mode.test.ts
└── utils/                 # Test utilities and helpers
    ├── test-configs.ts
    └── mock-dapp.ts
```

### Test Configuration Patterns

#### Basic Test Setup
```typescript
import { createOnchainTest, configure } from '@coinbase/onchaintestkit';
import { baseSepolia } from 'viem/chains';

const test = createOnchainTest(
  configure()
    .withMetaMask()
    .withSeedPhrase({
      seedPhrase: process.env.E2E_TEST_SEED_PHRASE!,
      password: 'PASSWORD',
    })
    .withNetwork({
      name: baseSepolia.name,
      rpcUrl: baseSepolia.rpcUrls.default.http[0],
      chainId: baseSepolia.id,
      symbol: baseSepolia.nativeCurrency.symbol,
    })
    .build()
);
```

#### Fork Mode Testing
```typescript
const forkTest = createOnchainTest(
  configure()
    .withLocalNode({
      fork: 'https://eth-mainnet.g.alchemy.com/v2/api-key',
      forkBlockNumber: 18500000, // Specific block for reproducibility
      chainId: 1,
      accounts: 10,
      balance: '100000000000000000000', // 100 ETH per account
    })
    .withMetaMask()
    .build()
);
```

## Test Categories and Examples

### 1. Configuration Tests
Test the configuration builder and validation:

```typescript
import { configure } from '@coinbase/onchaintestkit';

describe('Configuration Builder', () => {
  test('should configure MetaMask with seed phrase', () => {
    const config = configure()
      .withMetaMask()
      .withSeedPhrase({ 
        seedPhrase: 'test seed phrase',
        password: 'password' 
      })
      .build();
      
    expect(config.wallets.metamask).toBeDefined();
    expect(config.wallets.metamask?.credentials.type).toBe('seedPhrase');
  });

  test('should validate required network parameters', () => {
    expect(() => {
      configure()
        .withMetaMask()
        .withNetwork({ name: 'Test' }) // Missing required fields
        .build();
    }).toThrow('Network configuration requires rpcUrl and chainId');
  });
});
```

### 2. Wallet Integration Tests
Test wallet-specific functionality:

```typescript
const test = createOnchainTest(walletConfig);

test('should connect MetaMask to DApp', async ({ page, metamask }) => {
  await page.goto('http://localhost:3000');
  
  // Trigger connection
  await page.getByTestId('connect-button').click();
  
  // Handle MetaMask connection
  await metamask.handleAction('connect', { shouldApprove: true });
  
  // Verify connection
  await expect(page.getByTestId('wallet-address')).toBeVisible();
});

test('should handle transaction approval', async ({ page, metamask }) => {
  // Setup: connect wallet first
  await page.goto('http://localhost:3000');
  await page.getByTestId('connect-button').click();
  await metamask.handleAction('connect', { shouldApprove: true });
  
  // Trigger transaction
  await page.getByTestId('send-transaction').click();
  
  // Handle MetaMask transaction
  await metamask.handleAction('transaction', {
    shouldApprove: true,
    gasLimit: '21000',
  });
  
  // Verify transaction success
  await expect(page.getByTestId('transaction-success')).toBeVisible();
});
```

### 3. Fork Mode Integration Tests
Test with real blockchain data:

```typescript
const forkTest = createOnchainTest(forkModeConfig);

forkTest('should swap ETH for USDC on Uniswap', async ({ page, metamask, node }) => {
  // Navigate to Uniswap interface
  await page.goto('https://app.uniswap.org');
  
  // Connect wallet
  await page.getByRole('button', { name: 'Connect' }).click();
  await page.getByText('MetaMask').click();
  await metamask.handleAction('connect', { shouldApprove: true });
  
  // Configure swap
  await page.getByTestId('token-amount-input').fill('0.1'); // 0.1 ETH
  await page.getByTestId('token-selector-out').click();
  await page.getByText('USDC').click();
  
  // Execute swap
  await page.getByTestId('swap-button').click();
  await metamask.handleAction('transaction', { shouldApprove: true });
  
  // Verify swap completion
  await expect(page.getByText('Swap Successful')).toBeVisible();
});
```

### 4. Cross-Wallet Compatibility Tests
Ensure features work across all wallets:

```typescript
const wallets = [
  { name: 'MetaMask', config: metamaskConfig },
  { name: 'Coinbase', config: coinbaseConfig },
  { name: 'Phantom', config: phantomConfig },
];

wallets.forEach(({ name, config }) => {
  const test = createOnchainTest(config);
  
  test(`should connect ${name} wallet`, async ({ page, wallet }) => {
    await page.goto('http://localhost:3000');
    await page.getByTestId('connect-button').click();
    
    // Handle wallet-specific connection
    await wallet.handleAction('connect', { shouldApprove: true });
    
    await expect(page.getByTestId('wallet-connected')).toBeVisible();
  });
});
```

## Advanced Testing Patterns

### Test Utilities and Helpers
```typescript
// test-utils.ts
export async function setupDAppConnection(page: Page, wallet: Wallet) {
  await page.goto('http://localhost:3000');
  await page.getByTestId('connect-button').click();
  await wallet.handleAction('connect', { shouldApprove: true });
  await expect(page.getByTestId('wallet-connected')).toBeVisible();
}

export async function approveTokenSpending(
  page: Page, 
  wallet: Wallet, 
  amount: string
) {
  await page.getByTestId('approve-button').click();
  await wallet.handleAction('tokenApproval', {
    shouldApprove: true,
    amount: amount,
  });
  await expect(page.getByTestId('approval-success')).toBeVisible();
}
```

### Parameterized Tests
```typescript
const networkConfigs = [
  { name: 'Ethereum Mainnet', chainId: 1 },
  { name: 'Base', chainId: 8453 },
  { name: 'Arbitrum', chainId: 42161 },
];

networkConfigs.forEach(({ name, chainId }) => {
  const config = configure()
    .withMetaMask()
    .withNetwork({ name, chainId })
    .build();
    
  const test = createOnchainTest(config);
  
  test(`should switch to ${name}`, async ({ page, metamask }) => {
    await setupDAppConnection(page, metamask);
    
    await page.getByTestId('network-switcher').click();
    await page.getByText(name).click();
    
    await metamask.handleAction('switchNetwork', { chainId });
    
    await expect(page.getByText(`Connected to ${name}`)).toBeVisible();
  });
});
```

## Performance Testing Guidelines

### Test Execution Speed
- Use parallel execution where safe: `test.parallel()`
- Cache wallet extensions between tests
- Use efficient selector strategies
- Minimize page loads and navigation

### Resource Management
```typescript
test.afterEach(async ({ context }) => {
  // Clean up browser context
  await context.close();
});

test.afterAll(async ({ node }) => {
  // Stop local node
  if (node) {
    await node.stop();
  }
});
```

### Fork Mode Optimization
```typescript
// Use specific block numbers for consistent performance
const config = configure()
  .withLocalNode({
    fork: rpcUrl,
    forkBlockNumber: specificBlock, // Not 'latest'
    accounts: 3, // Minimal number needed
  })
  .build();
```

## Error Handling in Tests

### Expected Errors
```typescript
test('should handle connection rejection', async ({ page, metamask }) => {
  await page.goto('http://localhost:3000');
  await page.getByTestId('connect-button').click();
  
  // Reject connection
  await metamask.handleAction('connect', { shouldApprove: false });
  
  // Verify rejection handling
  await expect(page.getByText('Connection rejected')).toBeVisible();
});
```

### Error Recovery Testing
```typescript
test('should retry on network timeout', async ({ page, metamask }) => {
  // Simulate network issue
  await page.route('**/api/transaction', route => 
    route.abort('failed')
  );
  
  await page.getByTestId('send-transaction').click();
  
  // Should handle error and show retry option
  await expect(page.getByText('Network error')).toBeVisible();
  await expect(page.getByTestId('retry-button')).toBeVisible();
});
```

## Test Data Management

### Environment Variables
```env
# Required for all tests
E2E_TEST_SEED_PHRASE="test seed phrase here"

# Optional for fork mode tests
ETHEREUM_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/api-key"
BASE_RPC_URL="https://mainnet.base.org"
```

### Test Data Factories
```typescript
export const testConfigs = {
  metamaskLocal: configure()
    .withLocalNode()
    .withMetaMask()
    .withSeedPhrase({ 
      seedPhrase: process.env.E2E_TEST_SEED_PHRASE!,
      password: 'PASSWORD'
    })
    .build(),
    
  metamaskFork: configure()
    .withLocalNode({
      fork: process.env.ETHEREUM_RPC_URL!,
      forkBlockNumber: 18500000,
    })
    .withMetaMask()
    .build(),
};
```

## CI/CD Testing Considerations

### Parallel Test Execution
- Use different ports for local nodes
- Isolate browser contexts properly
- Manage shared test resources
- Handle test dependencies correctly

### Environment Setup
```bash
# CI pipeline test setup
npm install
npm run prepare-metamask
npm run prepare-coinbase
npm run prepare-phantom
npm run build
npm run test
```

### Test Reporting
- Generate detailed test reports
- Include failure screenshots
- Log wallet interaction traces
- Report performance metrics

Remember: The goal is comprehensive coverage of real-world blockchain testing scenarios while maintaining test reliability and execution speed.