# OnChainTestKit

[![npm version](https://img.shields.io/npm/v/@coinbase/onchaintestkit.svg)](https://www.npmjs.com/package/@coinbase/onchaintestkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

End-to-end testing toolkit for blockchain applications, powered by Playwright.

---

## Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Supported Wallets](#-supported-wallets)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- **🔗 Blockchain Testing** - Comprehensive E2E testing for Web3 applications
- **🎭 Playwright Powered** - Built on Playwright for reliable, fast automation
- **🔐 Multi-Wallet Support** - Native integration with MetaMask, Coinbase Wallet, and Phantom
- **🌐 Network Flexibility** - Test on mainnet, testnets, or forked local nodes
- **🛠️ Simple Configuration** - Intuitive, chainable API for easy setup
- **📝 TypeScript First** - Full type definitions for enhanced developer experience

---

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

- **Node.js** 14.0.0 or higher
- **Playwright Test**: Install as dev dependency
  ```bash
  npm install --save-dev @playwright/test
  ```

---

## 🎯 Quick Start

### Step 1: Prepare Wallet Extensions

```bash
# Prepare MetaMask extension
npm run prepare-metamask

# Alternatively, use npx
npx prepare-metamask
```

### Step 2: Configure Environment

Set up your test environment variables:

```bash
export E2E_TEST_SEED_PHRASE="test test test test test test test test test test test junk"
```

> ⚠️ **Security Warning**: Only use test seed phrases. Never use real wallet credentials or funds.

### Step 3: Write Your First Test

```typescript
import { configure, createOnchainTest } from '@coinbase/onchaintestkit';
import { test } from '@playwright/test';

// Configure test environment
const config = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: 'TestPassword123'
  })
  .build();

// Write your test
test('should connect wallet and interact with dApp', async () => {
  const { page, wallet } = await createOnchainTest(config);
  
  // Navigate to your dApp
  await page.goto('https://your-dapp.com');
  
  // Connect wallet
  await wallet.connect();
  
  // Add your test logic here
});
```

---

## 🔧 Configuration

### Basic Configuration

Simple wallet configuration for testing:

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

Test against a forked version of mainnet for deterministic, reproducible tests:

```typescript
const forkConfig = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    forkBlockNumber: 18500000, // Pin to specific block for consistency
    chainId: 1,
  })
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: 'PASSWORD'
  })
  .build();
```

### Multi-Network Configuration

Configure custom networks for comprehensive testing:

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

---

## 🔐 Supported Wallets

OnChainTestKit provides first-class support for the most popular Web3 wallets:

| Wallet | Description | Command |
|--------|-------------|---------|
| **MetaMask** | Most widely used Ethereum wallet | `npm run prepare-metamask` |
| **Coinbase Wallet** | Coinbase's self-custody solution | `npm run prepare-coinbase` |
| **Phantom** | Leading Solana wallet with Ethereum support | `npm run prepare-phantom` |

### Preparing Wallet Extensions

```bash
# Prepare all wallets at once
npm run prepare-metamask && npm run prepare-coinbase && npm run prepare-phantom

# Or prepare individually as needed
npm run prepare-metamask
npm run prepare-coinbase
npm run prepare-phantom
```

---

## 📚 Documentation

Explore comprehensive guides and resources:

- **[Installation Guide](./docs/installation.md)** - Detailed setup instructions
- **[User Guide](./docs/guide.md)** - Complete usage documentation
- **[Examples](./example/)** - Working code examples
- **[API Reference](./docs/)** - Full API documentation

---

## 🧪 Testing

Run the complete test suite:

```bash
npm test
```

---

## 🤝 Contributing

We welcome contributions from the community! See our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Setting up your development environment
- Code style guidelines
- Submitting pull requests
- Reporting bugs and requesting features

### Quick Development Setup

```bash
# Clone and navigate to repository
git clone https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit.git
cd https-github.com-joe10832-onchaintestkit

# Install dependencies and build
npm install
npm run build

# Run tests
npm test

# Code quality checks
npm run format
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ by Coinbase and powered by Playwright for robust blockchain testing.

---

## 🔗 Resources

- **[GitHub Repository](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit)** - Source code and development
- **[npm Package](https://www.npmjs.com/package/@coinbase/onchaintestkit)** - Package registry
- **[Issue Tracker](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues)** - Bug reports and feature requests

---

## 💬 Support

Need help? We're here for you:

- 📖 **[Documentation](./docs/)** - Comprehensive guides and tutorials
- 🐛 **[Report Issues](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues)** - Found a bug? Let us know
- 💡 **[Request Features](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues)** - Have an idea? Share it with us

---

<div align="center">

**⚠️ Important**: Always use test accounts and never use real funds when testing blockchain applications.

</div>
