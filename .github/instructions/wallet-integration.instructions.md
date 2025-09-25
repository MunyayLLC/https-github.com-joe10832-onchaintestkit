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