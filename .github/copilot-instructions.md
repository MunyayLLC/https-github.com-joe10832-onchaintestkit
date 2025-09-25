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

## Additional Instructions from user's `.github/instructions`:
# Wallet Integration Instructions for Onchain Test Kit

This file provides specific instructions for AI agents working on wallet integrations in the Onchain Test Kit project.

## Supported Wallets Overview

### Current Wallet Support
- **MetaMask**: Most popular Ethereum wallet with comprehensive feature support
- **Coinbase Wallet**: Coinbase's self-custody wallet with mobile and extension support
- **Phantom**: Leading Solana wallet with multi-chain capabilities

### Wallet Architecture Principles
- **Common interface**: All wallets implement the same action handling interface
- **Extension-based**: Browser extension automation using Playwright
- **Fixture pattern**: Playwright fixtures provide wallet instances to tests
- **Action abstraction**: Complex wallet interactions simplified to action types

## Base Wallet Interface

### Core Action Types
```typescript
type BaseActionType = 
  | 'connect'
  | 'disconnect'
  | 'transaction'
  | 'signature'
  | 'switchNetwork'
  | 'addNetwork'
  | 'tokenApproval'
  | 'addToken';

interface ActionOptions {
  shouldApprove?: boolean;
  timeout?: number;
  gasLimit?: string;
  gasPrice?: string;
  amount?: string;
  chainId?: number;
  networkConfig?: NetworkConfig;
  tokenConfig?: TokenConfig;
}
```

### Standard Implementation Pattern
```typescript
export class WalletImplementation extends BaseWallet {
  constructor(context: BrowserContext, config: WalletConfig) {
    super(context, config);
  }

  async handleAction(
    action: WalletActionType, 
    options: ActionOptions = {}
  ): Promise<void> {
    console.log(`${this.walletName} handleAction: ${action}`, options);
    
    switch (action) {
      case 'connect':
        return this.handleConnect(options);
      case 'transaction':
        return this.handleTransaction(options);
      case 'signature':
        return this.handleSignature(options);
      // ... other actions
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }
}
```

## MetaMask Integration

### MetaMask-Specific Features
- **Most comprehensive**: Supports all base actions plus MetaMask-specific features
- **Popular extensions**: Widely used and well-documented selector patterns
- **Network management**: Built-in support for custom networks and tokens
- **Developer tools**: Rich debugging and inspection capabilities

### MetaMask Action Implementation
```typescript
// Example: MetaMask connection handling
private async handleConnect(options: ActionOptions): Promise<void> {
  const { shouldApprove = true, timeout = 30000 } = options;
  
  // Wait for MetaMask popup
  const popup = await this.waitForPopup(timeout);
  
  if (shouldApprove) {
    // Click Next button
    await popup.getByRole('button', { name: 'Next' }).click();
    // Click Connect button  
    await popup.getByRole('button', { name: 'Connect' }).click();
  } else {
    // Click Cancel or reject
    await popup.getByRole('button', { name: 'Cancel' }).click();
  }
  
  await popup.waitForEvent('close');
}
```

### MetaMask Test Configuration
```typescript
const metamaskConfig = configure()
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

## Coinbase Wallet Integration

### Coinbase Wallet Characteristics
- **Different UX patterns**: Unique popup flows and element selectors
- **Mobile-first design**: Extension mirrors mobile app experience
- **Simplified interface**: Fewer advanced features than MetaMask
- **Coinbase ecosystem**: Integration with Coinbase exchange features

### Coinbase-Specific Actions
```typescript
// Coinbase may have different selector patterns
private async handleConnect(options: ActionOptions): Promise<void> {
  const popup = await this.waitForPopup();
  
  // Coinbase-specific selectors and flow
  await popup.getByTestId('coinbase-connect-approve').click();
  await popup.waitForEvent('close');
}
```

### Coinbase Configuration
```typescript
const coinbaseConfig = configure()
  .withCoinbase()
  .withPrivateKey({
    privateKey: process.env.PRIVATE_KEY!,
    password: 'PASSWORD',
  })
  .withNetwork(ethereumMainnet)
  .build();
```

## Phantom Wallet Integration

### Phantom Wallet Features
- **Multi-chain support**: Solana, Ethereum, and other chains
- **Different architecture**: Solana-first design with Ethereum compatibility
- **Unique transaction patterns**: Solana transaction handling differs from EVM
- **Performance focus**: Optimized for fast transaction processing

### Phantom-Specific Considerations
```typescript
// Phantom may require different action types for Solana vs Ethereum
type PhantomAction = BaseActionType | 'solanaTransaction' | 'signMessage';

private async handleSolanaTransaction(options: ActionOptions): Promise<void> {
  // Solana-specific transaction handling
  const popup = await this.waitForPopup();
  await popup.getByText('Approve').click();
}
```

## Wallet Extension Setup

### Preparation Scripts
Each wallet requires a preparation script to download and setup the extension:

```bash
# MetaMask preparation
src/cli/prepare-metamask.sh    # Download extension
src/cli/prepare-metamask.mjs   # Node.js wrapper

# Coinbase preparation  
src/cli/prepare-coinbase.sh    # Download extension
src/cli/prepare-coinbase.mjs   # Node.js wrapper

# Phantom preparation
src/cli/prepare-phantom.sh     # Download extension  
src/cli/prepare-phantom.mjs    # Node.js wrapper
```

### Extension Configuration
```typescript
// Wallet fixture configuration
const walletFixture = {
  extensionPath: path.join(__dirname, 'extensions/metamask'),
  userDataDir: path.join(__dirname, 'user-data/metamask'),
  headless: false, // Required for wallet extensions
  args: ['--disable-web-security'], // May be needed for local development
};
```

## Cross-Wallet Testing Patterns

### Unified Test Interface
```typescript
// Test that works with any wallet
async function testWalletConnection(wallet: Wallet, page: Page) {
  await page.goto('http://localhost:3000');
  await page.getByTestId('connect-button').click();
  
  // This works regardless of wallet type
  await wallet.handleAction('connect', { shouldApprove: true });
  
  await expect(page.getByTestId('wallet-connected')).toBeVisible();
}

// Run with all wallets
[metamaskConfig, coinbaseConfig, phantomConfig].forEach(config => {
  const test = createOnchainTest(config);
  test(`wallet connection with ${config.walletType}`, async ({ page, wallet }) => {
    await testWalletConnection(wallet, page);
  });
});
```

### Wallet-Specific Edge Cases
```typescript
// Handle wallet-specific behaviors
async function handleWalletSpecifics(wallet: Wallet, action: string) {
  if (wallet instanceof MetaMask) {
    // MetaMask might need additional confirmation for certain actions
    if (action === 'addNetwork') {
      await wallet.handleAction('addNetwork', { requireConfirmation: true });
    }
  } else if (wallet instanceof CoinbaseWallet) {
    // Coinbase might have different timeout requirements
    await wallet.handleAction(action, { timeout: 45000 });
  }
}
```

## Error Handling and Debugging

### Common Wallet Issues
1. **Extension not found**: Check preparation script execution
2. **Popup timeout**: Increase timeout values for slower systems
3. **Element not found**: Wallet UI may have changed, update selectors
4. **Network issues**: RPC configuration problems

### Debugging Strategies
```typescript
// Add debugging information
private async handleConnect(options: ActionOptions): Promise<void> {
  console.log(`${this.walletName}: Starting connection process`);
  
  try {
    const popup = await this.waitForPopup(options.timeout);
    console.log(`${this.walletName}: Popup detected`);
    
    await popup.getByRole('button', { name: 'Connect' }).click();
    console.log(`${this.walletName}: Connect button clicked`);
    
    await popup.waitForEvent('close');
    console.log(`${this.walletName}: Connection completed`);
  } catch (error) {
    console.error(`${this.walletName}: Connection failed`, error);
    throw error;
  }
}
```

### Error Recovery
```typescript
// Implement retry logic for flaky operations
async handleActionWithRetry(
  action: WalletActionType,
  options: ActionOptions,
  maxRetries: number = 3
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await this.handleAction(action, options);
      return; // Success
    } catch (error) {
      if (attempt === maxRetries) {
        throw error; // Final attempt failed
      }
      console.warn(`${this.walletName}: Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
    }
  }
}
```

## Performance Optimization

### Extension Caching
- Cache downloaded extensions to avoid repeated downloads
- Share extension installations across test runs
- Use persistent user data directories when appropriate

### Popup Handling Optimization
```typescript
// Optimize popup detection
private async waitForPopup(timeout: number = 30000): Promise<Page> {
  const popup = await this.context.waitForEvent('page', {
    predicate: (page) => page.url().includes(this.walletIdentifier),
    timeout
  });
  
  await popup.waitForLoadState('domcontentloaded');
  return popup;
}
```

### Selector Optimization
```typescript
// Use efficient selectors
const selectors = {
  connectButton: 'button[data-testid="connect-button"]', // Preferred
  connectButtonText: 'button:has-text("Connect")', // Fallback
  connectButtonGeneric: 'button >> nth=0', // Last resort
};
```

## Adding New Wallet Support

### Implementation Checklist
1. **Create wallet directory**: `src/wallets/NewWallet/`
2. **Implement wallet class**: Extend BaseWallet
3. **Create fixtures**: Playwright fixture configuration
4. **Add preparation scripts**: Download and setup scripts
5. **Update configuration builder**: Add `.withNewWallet()` method
6. **Write comprehensive tests**: Cover all supported actions
7. **Update documentation**: README, examples, and guides
8. **Test cross-wallet compatibility**: Ensure consistency

### Example New Wallet Structure
```
src/wallets/NewWallet/
├── index.ts           # Main wallet implementation
├── fixtures.ts        # Playwright fixtures
├── types.ts          # Wallet-specific types
└── selectors.ts      # UI element selectors
```

## Best Practices Summary

### Code Quality
- Use TypeScript strict mode
- Implement proper error handling
- Add comprehensive logging
- Follow consistent patterns across wallets

### Testing
- Test with real DApps when possible
- Include edge cases and error conditions
- Verify cross-wallet compatibility
- Use fork mode for comprehensive testing

### Maintainability
- Keep wallet implementations isolated
- Use shared utilities for common functionality
- Document wallet-specific quirks and workarounds
- Regular testing with wallet updates

Remember: Each wallet has unique characteristics and UI patterns. The key is to provide a consistent interface while handling wallet-specific implementation details appropriately.

# Testing Instructions for Onchain Test Kit

This file provides comprehensive testing guidelines for AI agents working on the Onchain Test Kit project.

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
    .withMetaMask()
    .withLocalNode({
      fork: 'https://eth-mainnet.g.alchemy.com/v2/api-key',
      forkBlockNumber: 18500000, // Specific block for reproducibility
      chainId: 1,
      accounts: 10,
      balance: '100000000000000000000', // 100 ETH per account
    })
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
    .withMetaMask()
    .withSeedPhrase({ 
      seedPhrase: process.env.E2E_TEST_SEED_PHRASE!,
      password: 'PASSWORD'
    })
    .withLocalNode()
    .build(),
    
  metamaskFork: configure()
    .withMetaMask()
    .withLocalNode({
      fork: process.env.ETHEREUM_RPC_URL!,
      forkBlockNumber: 18500000,
    })
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