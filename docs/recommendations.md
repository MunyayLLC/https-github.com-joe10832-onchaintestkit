# Best Practices & Recommendations

This guide provides best practices and recommendations for using OnChainTestKit effectively in your blockchain application testing.

## General Testing Best Practices

### Use Test Networks

Always test against testnets or forked networks, never mainnet with real funds:

```typescript
import { configure, createOnchainTest } from '@coinbase/onchaintestkit';
import { baseSepolia } from 'viem/chains';

const config = configure()
  .withMetaMask()
  .withNetwork({
    name: baseSepolia.name,
    rpcUrl: baseSepolia.rpcUrls.default.http[0],
    chainId: baseSepolia.id,
    symbol: baseSepolia.nativeCurrency.symbol,
  })
  .build();
```

### Use Test Seed Phrases

Never use seed phrases with real funds. Generate dedicated test seed phrases:

```typescript
const config = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: 'test-password'
  })
  .build();
```

⚠️ **Security Warning**: Never commit seed phrases to version control. Always use environment variables.

### Isolate Test Environments

Each test should be independent and not rely on the state from previous tests:

```typescript
test.beforeEach(async ({ page, wallet }) => {
  // Reset wallet state
  await wallet.reset();
  
  // Navigate to a fresh instance
  await page.goto('http://localhost:3000');
});
```

## Wallet-Specific Recommendations

### MetaMask

**Recommended for**: General Ethereum-compatible testing

- Use the latest stable version
- Configure network settings before test execution
- Handle popup windows properly with Playwright's context management

```typescript
const config = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: 'test-password'
  })
  .build();
```

### Coinbase Wallet

**Recommended for**: Testing Coinbase-specific features and integrations

- Ensure proper extension installation using `prepare-coinbase` CLI
- Test wallet connection flows thoroughly
- Verify transaction signing behavior

```bash
npm run prepare-coinbase
```

### Phantom

**Recommended for**: Solana application testing

- Verify Solana network connectivity
- Test with Solana devnet or testnet
- Handle Phantom-specific transaction formats

```bash
npm run prepare-phantom
```

## Network Configuration

### Fork Mode for Reproducible Tests

Use fork mode to test against a specific block state for reproducible results:

```typescript
const config = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    forkBlockNumber: 18500000, // Pin to specific block
    chainId: 1,
  })
  .withMetaMask()
  .build();
```

**Benefits**:
- Reproducible test results
- Test against real mainnet state without risk
- Faster execution than live networks

### RPC Endpoint Selection

Choose reliable RPC endpoints for consistent test performance:

```typescript
// Good: Use dedicated RPC providers
const rpcUrl = process.env.ALCHEMY_RPC_URL;

// Avoid: Public RPCs may have rate limits
const publicRpc = 'https://eth.public-rpc.com';
```

**Recommended Providers**:
- Alchemy
- Infura
- QuickNode
- Ankr

## Security Best Practices

### Environment Variables

Store sensitive information securely:

```bash
# .env.example
E2E_TEST_SEED_PHRASE="test test test test test test test test test test test junk"
ALCHEMY_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
```

```typescript
// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const config = configure()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: process.env.TEST_WALLET_PASSWORD
  })
  .build();
```

### Secrets Management in CI/CD

Use your CI/CD platform's secret management:

```yaml
# GitHub Actions example
env:
  E2E_TEST_SEED_PHRASE: ${{ secrets.TEST_SEED_PHRASE }}
  ALCHEMY_RPC_URL: ${{ secrets.ALCHEMY_RPC_URL }}
```

## Performance Optimization

### Parallel Test Execution

Configure Playwright for parallel execution:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: 4, // Adjust based on your machine
  fullyParallel: true,
});
```

### Reuse Browser Contexts

Reuse browser contexts when possible to reduce overhead:

```typescript
import { test as base } from '@playwright/test';

const test = base.extend({
  // Extend with persistent context
});
```

### Smart Waiting Strategies

Use explicit waits instead of arbitrary timeouts:

```typescript
// Good: Wait for specific condition
await page.waitForSelector('[data-testid="wallet-connected"]', {
  timeout: 30000
});

// Avoid: Arbitrary delays
await page.waitForTimeout(5000);
```

## CI/CD Integration

### GitHub Actions Setup

Example workflow for running tests:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Prepare wallets
        run: npm run prepare-metamask
      
      - name: Run tests
        run: npm test
        env:
          E2E_TEST_SEED_PHRASE: ${{ secrets.TEST_SEED_PHRASE }}
```

### Test Retries

Configure retries for flaky network conditions:

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
```

## Common Pitfalls to Avoid

### ❌ Don't: Use Real Funds

```typescript
// NEVER do this
const seedPhrase = "real seed phrase with funds";
```

### ✅ Do: Use Test Accounts

```typescript
// Always use test accounts
const seedPhrase = process.env.E2E_TEST_SEED_PHRASE;
```

### ❌ Don't: Hardcode Configuration

```typescript
// Avoid hardcoding
const chainId = 1;
const rpcUrl = "https://mainnet.infura.io/v3/...";
```

### ✅ Do: Use Configuration Files

```typescript
// Use environment-based configuration
const config = {
  chainId: process.env.CHAIN_ID,
  rpcUrl: process.env.RPC_URL,
};
```

### ❌ Don't: Ignore Test Cleanup

```typescript
test('transfer tokens', async ({ wallet }) => {
  await wallet.sendTransaction(...);
  // Test ends without cleanup
});
```

### ✅ Do: Clean Up After Tests

```typescript
test('transfer tokens', async ({ wallet }) => {
  await wallet.sendTransaction(...);
  
  // Clean up
  await wallet.reset();
});
```

## Debugging Tips

### Enable Verbose Logging

```bash
DEBUG=pw:api npm test
```

### Capture Screenshots and Videos

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },
});
```

### Use Playwright Inspector

```bash
PWDEBUG=1 npm test
```

## Testing Strategies

### Test Pyramid Approach

1. **Unit Tests**: Test individual wallet methods and utilities
2. **Integration Tests**: Test wallet interactions with smart contracts
3. **E2E Tests**: Test complete user flows with OnChainTestKit

### Critical Test Scenarios

Always test these core scenarios:

```typescript
test.describe('Critical Wallet Flows', () => {
  test('should connect wallet successfully', async ({ page, wallet }) => {
    await wallet.connect();
    expect(await wallet.isConnected()).toBe(true);
  });

  test('should sign transactions', async ({ page, wallet }) => {
    const tx = await wallet.sendTransaction({...});
    expect(tx.hash).toBeDefined();
  });

  test('should handle rejected transactions', async ({ page, wallet }) => {
    await expect(wallet.rejectTransaction()).resolves.toBeTruthy();
  });

  test('should switch networks', async ({ page, wallet }) => {
    await wallet.switchNetwork(baseSepolia.id);
    expect(await wallet.getCurrentChainId()).toBe(baseSepolia.id);
  });
});
```

## Performance Benchmarks

Monitor test execution times and optimize slow tests:

```typescript
test('performance benchmark', async ({ page, wallet }) => {
  const startTime = Date.now();
  
  await wallet.connect();
  await wallet.sendTransaction({...});
  
  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(30000); // 30 seconds max
});
```

## Further Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Web3 Testing Guide](https://ethereum.org/en/developers/docs/testing/)
- [OnChainTestKit Examples](/examples)
- [GitHub Repository](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit)

---

**Need Help?** Open an issue on [GitHub](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues) or check our [Contributing Guide](/contributing).
