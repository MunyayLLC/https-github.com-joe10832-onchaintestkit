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

```bash
cp .env.example .env
# Edit .env to add your E2E_TEST_SEED_PHRASE and any other secrets
nano .env   # Or use your preferred editor (vim, code, etc.)
```

3. Create your wallet configuration:

```typescript
// walletConfig/metamaskWalletConfig.ts
import { configure } from '@coinbase/onchaintestkit';
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
import { BaseActionType, createOnchainTest } from '@coinbase/onchaintestkit';

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

## Copilot Setup Steps

For AI coding agents and automated development workflows, this project includes automated setup steps that ensure your development environment is properly configured.

### Quick Setup Commands

```bash
# Quick setup (recommended)
npm run copilot:setup

# Full setup with validation
npm run copilot:full-setup

# Validation only
npm run copilot:validate
```

### Manual Setup (Essential Commands)

Run these commands in order for manual setup:

```bash
# 1. Install dependencies (required first)
npm install

# 2. Build the project (required before testing)  
npm run build

# 3. Run linter (fix issues before committing)
npm run lint
npm run lint:fix  # Auto-fix issues

# 4. Format code
npm run format

# 5. Run tests
npm run test

# 6. Prepare wallet extensions
npm run prepare-metamask    # ✅ Works correctly
npm run prepare-coinbase    # ⚠️  Currently broken (known issue)
npm run prepare-phantom     # ⚠️  Currently broken (known issue)
```

### GitHub Actions Integration

The project includes automated workflows for continuous integration:

- **`.github/workflows/copilot-setup.yml`** - Automated setup validation
- **`.github/workflows/development.yml`** - Development workflow with code quality checks
- **`.github/workflows/manual-setup-test.yml`** - Manual testing workflow

### Setup Scripts

- **`scripts/quick-setup.sh`** - Runs essential setup commands in the correct order
- **`scripts/validate-setup.sh`** - Comprehensive validation of the development environment

### For AI Coding Agents

See these instruction files for detailed guidance:
- **`.github/copilot-instructions.md`** - GitHub Copilot instructions
- **`.github/instructions/`** - Specialized instruction files
- **`AGENTS.md`** - General AI agent instructions  
- **`CLAUDE.md`** - Claude-specific instructions
- **`GEMINI.md`** - Gemini-specific instructions

## Development

- Run `npm install` to install dependencies
- Run `npm run build` to build the project
- Run `npm run format` to format code
- Run `npm run lint` to check for linting issues
- Run `npm run copilot:setup` for automated setup

## GitHub Copilot and AI Agent Setup

This repository includes comprehensive documentation for AI-powered development:

### Quick Setup Guides
- **[AI Agent Configuration Hub](.github/agents/README.md)** - Centralized guide for all AI coding agents
- **[GitHub Copilot Setup](.github/copilot-instructions.md)** - Complete setup guide with troubleshooting and example workflows
- **[General AI Agents](AGENTS.md)** - Setup instructions for all AI coding agents
- **[Claude AI Setup](CLAUDE.md)** - Claude-specific setup and optimization
- **[Gemini AI Setup](GEMINI.md)** - Gemini-specific rapid development workflows

### Specialized Instructions
- **[Development Setup](.github/instructions/development.instructions.md)** - Development environment and coding standards
- **[Testing Setup](.github/instructions/testing.instructions.md)** - Comprehensive testing strategies
- **[Wallet Integration](.github/instructions/wallet-integration.instructions.md)** - Wallet-specific setup and patterns

### Examples and Patterns
- **[Example Code](example/README.md)** - Practical examples with agent-specific usage guidance
- **[API Documentation](docs/)** - Detailed configuration and usage documentation

### Quick Start for AI Agents
```bash
# 1. Basic setup
npm install && npm run build && npm run test

# 2. Prepare wallet testing
npm run prepare-metamask
cp .env.example .env
# Edit .env to add your E2E_TEST_SEED_PHRASE and any other secrets
nano .env   # Or use your preferred editor (vim, code, etc.)

# 3. Choose your agent documentation and start coding!
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.
