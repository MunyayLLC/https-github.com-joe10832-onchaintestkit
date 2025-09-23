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
- **Type Safety**: Full TypeScript support

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
