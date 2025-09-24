# Onchain Test Kit

End-to-end testing toolkit for blockchain applications, powered by Playwright.

## Overview

This toolkit provides a robust framework for testing blockchain applications, with built-in support for wallet interactions, network management, and common blockchain testing scenarios.

## Quick Start

1. Install dependencies:

Make sure you have yarn:

```bash
npm install -g corepack
yarn set version 4.9.2
```

And then run this to install the dependencies: 

```bash
npm install --save-dev @playwright/test @coinbase/onchaintestkit
# or
yarn add -D @playwright/test @coinbase/onchaintestkit
```

Make sure you have foundry set up too

2. Set up environment variables:

```env
E2E_TEST_SEED_PHRASE="your test wallet seed phrase"
```

3. Create your wallet configuration:

```typescript
// walletConfig/metamaskWalletConfig.ts
import { configure } from 'e2e/onchainTestKit';
import { baseSepolia } from 'viem/chains';

export const DEFAULT_PASSWORD = 'PASSWORD';
export const DEFAULT_SEED_PHRASE = process.env.E2E_TEST_SEED_PHRASE;

export const metamaskWalletConfig = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: DEFAULT_SEED_PHRASE ?? '',
    password: DEFAULT_PASSWORD,
  })
  .withNetwork({
    name: baseSepolia.name,
    rpcUrl: baseSepolia.rpcUrls.default.http[0],
    chainId: baseSepolia.id,
    symbol: baseSepolia.nativeCurrency.symbol,
  })
  .build();
```

4. Write your test:

```typescript
import { metamaskWalletConfig } from 'e2e/walletConfig/metamaskWalletConfig';
import { BaseActionType, createOnchainTest } from './onchainTestKit';

const test = createOnchainTest(metamaskWalletConfig);
const { expect } = test;

test('connect wallet and swap', async ({ page, metamask }) => {
  if (!metamask) throw new Error('MetaMask fixture is required');

  // Connect wallet
  await page.getByTestId('ockConnectButton').click();
  await page
    .getByTestId('ockModalOverlay')
    .first()
    .getByRole('button', { name: 'MetaMask' })
    .click();
  await metamask.handleAction(BaseActionType.CONNECT_TO_DAPP);

  // Verify connection
  await expect(page.getByTestId('wallet-connected')).toBeVisible();
});
```

## Features

- **Playwright Integration**: Built on top of Playwright for reliable browser automation
- **Multiple Wallet Support**: Support for MetaMask, Coinbase Wallet, and Phantom
- **Action Handling**: Simplified wallet action management
  - Connect to DApp
  - Handle transactions
  - Manage token approvals
  - Handle signatures
  - Switch networks
- **Network Management**: Easy network configuration using viem chains
- **Fork Mode**: Test against real blockchain data by forking mainnet or other networks
- **Type Safety**: Full TypeScript support

## Fork Mode

Fork mode allows you to create a local blockchain that mirrors the exact state of a live network, giving you access to real contracts, balances, and data for comprehensive testing.

### What is Fork Mode?

Fork mode creates a local copy of a blockchain network at a specific point in time. Think of it as taking a "snapshot" of mainnet (or any network) and running it locally for testing purposes.

**Why is this powerful?** Instead of deploying your own test contracts, you can test directly against the real contracts that are already deployed on mainnet. This means you can:

- **Test with real DeFi protocols** (Uniswap, Aave, Compound, etc.) - no need to deploy or mock these complex systems
- **Access actual token balances and contract states** - test with the exact same data your users will interact with
- **Reproduce production bugs** in a controlled environment where you can debug safely
- **Test complex scenarios without deployment costs** - no gas fees, no waiting for transactions
- **Validate integrations** with existing protocols before going live

**Perfect for:** Integration testing, debugging production issues, testing with real market conditions, and validating complex multi-protocol interactions.

### Quick Fork Mode Example

```typescript
import { configure, createOnchainTest } from '@coinbase/onchaintestkit';

// Fork Ethereum mainnet for testing with real contracts and liquidity
const test = createOnchainTest(
  configure()
    .withLocalNode({
      fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key', // Your RPC endpoint
      forkBlockNumber: 18500000, // Optional: fork from specific block for reproducible tests
      chainId: 1,
      // Pre-fund test accounts with plenty of ETH for gas and testing
      accounts: 10,
      balance: '100000000000000000000', // 100 ETH per account
    })
    .withMetaMask()
    .withNetwork({
      name: 'Forked Ethereum',
      rpcUrl: 'http://localhost:8545', // Local node will run here
      chainId: 1,
      symbol: 'ETH',
    })
    .build()
);

test('swap tokens on forked Uniswap', async ({ page, metamask }) => {
  // Navigate to Uniswap - this will use the REAL Uniswap contracts!
  await page.goto('https://app.uniswap.org');
  
  // Connect your test wallet
  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  await page.getByText('MetaMask').click();
  await metamask.handleAction(BaseActionType.CONNECT_TO_DAPP);
  
  // Now you can test swaps with real liquidity pools and contracts
  // The local fork has all the same state as mainnet at block 18500000
  await page.getByRole('button', { name: 'Swap' }).click();
  // ... rest of your test logic
});
```

**What's happening here?**
1. **Fork Creation**: We create a local blockchain that copies all data from Ethereum mainnet
2. **Real Contracts**: Your tests interact with the actual Uniswap contracts deployed on mainnet
3. **Test Accounts**: Pre-funded accounts let you test without worrying about gas or token balances
4. **Local Execution**: Everything runs locally, so it's fast and free

For detailed fork mode documentation, see [docs/node/overview.mdx](docs/node/overview.mdx) and [docs/node/configuration.mdx](docs/node/configuration.mdx).

**Learn more:**
- **[Fork Mode Overview](docs/node/overview.mdx)** - Concepts, benefits, and practical examples
- **[Node Configuration](docs/node/configuration.mdx)** - Complete setup guide and troubleshooting
- **[Fork Mode Example](example/fork-mode-example.js)** - Working code examples you can run

## Configuration Builder

The toolkit uses a fluent builder pattern for configuration:

```typescript
const config = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: 'your seed phrase',
    password: 'your password',
  })
  .withNetwork({
    name: 'Network Name',
    rpcUrl: 'RPC URL',
    chainId: 1,
    symbol: 'ETH',
  })
  .build();
```

### Available Methods

- `withMetaMask()`: Initialize MetaMask configuration
- `withCoinbase()`: Initialize Coinbase Wallet configuration
- `withPhantom()`: Initialize Phantom Wallet configuration
- `withLocalNode()`: Configure local Anvil node with optional fork mode
- `withSeedPhrase()`: Configure wallet with seed phrase
- `withNetwork()`: Configure network settings
- `withCustomSetup()`: Add custom setup steps

## Development

- Run `yarn` to install dependencies
- Run `yarn build` to build the project
- Run `yarn format` to format code
- Run `yarn lint` to check for linting issues

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.
