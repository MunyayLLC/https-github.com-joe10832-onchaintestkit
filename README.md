# OnChainTestKit

[![npm version](https://img.shields.io/npm/v/@coinbase/onchaintestkit.svg)](https://www.npmjs.com/package/@coinbase/onchaintestkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**OnChainTestKit** is an end-to-end testing toolkit for blockchain applications, powered by Playwright. It provides comprehensive testing utilities for Web3 applications with native wallet support.

## 🚀 Features

- 🔗 **Blockchain Testing**: Complete E2E testing for blockchain applications
- 🎭 **Playwright Integration**: Built on Playwright for reliable automation
- 🔐 **Multiple Wallets**: Native support for MetaMask, Coinbase Wallet, and Phantom
- 🌐 **Network Support**: Test on mainnet, testnets, or local nodes with fork mode
- 🛠️ **Easy Configuration**: Simple, chainable configuration API
- 📝 **TypeScript Support**: Full TypeScript definitions included

## 📦 Installation

Install OnChainTestKit using your preferred package manager:

```bash
# npm
npm install @coinbase/onchaintestkit

# yarn
yarn add @coinbase/onchaintestkit

# pnpm
pnpm add @coinbase/onchaintestkit
```

### Prerequisites

- Node.js 14.0.0 or higher
- Playwright Test: `npm install --save-dev @playwright/test`

## 🎯 Quick Start

### 1. Prepare Wallet Extensions

```bash
# Prepare MetaMask extension
npm run prepare-metamask

# Or use the CLI directly
npx prepare-metamask
```

### 2. Set Up Environment Variables

```bash
export E2E_TEST_SEED_PHRASE="test test test test test test test test test test test junk"
```

⚠️ **Warning**: Never use real seed phrases or funds for testing!

### 3. Create Your First Test

```typescript
import { configure, createOnchainTest } from '@coinbase/onchaintestkit';
import { test } from '@playwright/test';

const config = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: 'TestPassword123'
  })
  .build();

test('connect wallet and interact', async () => {
  const { page, wallet } = await createOnchainTest(config);
  
  await page.goto('https://your-dapp.com');
  await wallet.connect();
  
  // Your test logic here
});
```

## 🔧 Configuration

### Basic Configuration

```typescript
import { configure } from '@coinbase/onchaintestkit';

const config = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: 'PASSWORD'
  })
  .build();
```

### Fork Mode Testing

Test against a forked mainnet for reproducible tests:

```typescript
const forkConfig = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    forkBlockNumber: 18500000, // Specific block for reproducibility
    chainId: 1,
  })
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: 'PASSWORD'
  })
  .build();
```

### Multi-Network Support

```typescript
import { baseSepolia } from 'viem/chains';

const networkConfig = configure()
  .withMetaMask()
  .withSeedPhrase({ 
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE, 
    password: 'PASSWORD' 
  })
  .withNetwork({
    name: baseSepolia.name,
    rpcUrl: baseSepolia.rpcUrls.default.http[0],
    chainId: baseSepolia.id,
    symbol: baseSepolia.nativeCurrency.symbol,
  })
  .build();
```

## 🔐 Supported Wallets

OnChainTestKit provides native support for popular Web3 wallets:

- **MetaMask** - Most widely used Ethereum wallet
- **Coinbase Wallet** - Coinbase's self-custody wallet
- **Phantom** - Leading Solana wallet with Ethereum support

### Preparing Wallet Extensions

```bash
# MetaMask
npm run prepare-metamask

# Coinbase Wallet
npm run prepare-coinbase

# Phantom
npm run prepare-phantom
```

## 📚 Documentation

- [Full Documentation](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/tree/main/docs)
- [Installation Guide](./docs/installation.md)
- [User Guide](./docs/guide.md)
- [Examples](./example/)
- [API Reference](./docs/)

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit.git
cd https-github.com-joe10832-onchaintestkit

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Format and lint
npm run format
npm run lint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built by Coinbase and powered by Playwright for robust blockchain application testing.

## 🔗 Links

- [GitHub Repository](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit)
- [npm Package](https://www.npmjs.com/package/@coinbase/onchaintestkit)
- [Issue Tracker](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues)

## 💬 Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues)
- 💡 [Request Features](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues)

---

**Note**: Always use test accounts and never use real funds when testing blockchain applications.
