# GitHub Copilot Instructions for Onchain Test Kit

This document provides context and guidelines for GitHub Copilot when working on the Onchain Test Kit project.

## Project Overview

The Onchain Test Kit is an **end-to-end testing toolkit for blockchain applications**, powered by Playwright. It provides comprehensive wallet automation and testing capabilities for DApps with support for MetaMask, Coinbase Wallet, and Phantom wallets.

### Key Technologies
- **TypeScript**: Primary language with strict mode enabled (no `any` types)
- **Playwright**: Browser automation framework for wallet testing
- **Viem**: TypeScript interface for Ethereum with multi-chain support  
- **Biome**: Fast formatter and linter (replaces ESLint/Prettier)
- **Node.js**: Runtime environment (minimum version 14.0.0)
- **Anvil/Foundry**: Local blockchain nodes for fork mode testing

## Build and Development Commands

### Essential Commands (Always run in this order)
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

# 6. Clean build artifacts
npm run clean
```

### Wallet Preparation (Required for testing)
```bash
# MetaMask - WORKS CORRECTLY
npm run prepare-metamask

# Coinbase & Phantom - CURRENTLY BROKEN (zip download issues)  
npm run prepare-coinbase    # ⚠️ Known issue: zip download fails
npm run prepare-phantom     # ⚠️ Known issue: zip download fails
```

### Validated Build Process
1. **Always run `npm install` first** - Dependencies must be installed
2. **Build compiles without errors** - TypeScript strict mode enforced
3. **Tests pass (3 tests run in ~800ms)** - Basic functionality verified
4. **Linting passes** - Biome checks complete successfully
5. **Format command works** but tries to format extension files (ignorable errors)

### Known Issues & Workarounds
- **Coinbase/Phantom preparation fails**: Zip download returns invalid files (9 bytes)
- **Format command shows errors**: MetaMask extension files cause formatting errors (safe to ignore)
- **Node version**: Requires >= 14.0.0, tested with Node.js 18+

## Architecture & Project Layout

### Core Components
```
src/
├── cli/                    # Wallet preparation scripts
├── configBuilder.ts        # Main API (fluent builder pattern)
├── createOnchainTest.ts    # Test creation utilities  
├── wallets/               # Wallet implementations (MetaMask/Coinbase/Phantom)
├── node/                  # Local blockchain node management
├── contracts/             # Smart contract utilities
└── index.ts               # Main exports
```

### Key Files for Code Changes
- **`src/configBuilder.ts`**: Main API surface, affects all users
- **`src/createOnchainTest.ts`**: Core test setup logic
- **`src/wallets/*/index.ts`**: Wallet-specific implementations  
- **`src/cli/*.mjs`**: Cross-platform preparation scripts

## Configuration Patterns

### Fluent Builder API (Core Pattern)
```typescript
const config = configure()
  .withMetaMask()                    // or .withCoinbase() / .withPhantom()
  .withSeedPhrase({                  // or .withPrivateKey()
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE!,
    password: 'PASSWORD',
  })
  .withNetwork({
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
    symbol: 'ETH',
  })
  .withLocalNode({                   // Optional: fork mode
    fork: 'https://eth-mainnet.g.alchemy.com/v2/api-key',
    forkBlockNumber: 18500000,       // Use specific blocks
    chainId: 1,
  })
  .build();
```

### Test Creation Pattern
```typescript
import { createOnchainTest, configure } from '@coinbase/onchaintestkit';

const test = createOnchainTest(config);

test('wallet integration test', async ({ page, metamask, node }) => {
  // 1. Setup phase
  await page.goto('http://localhost:3000');
  
  // 2. Wallet interaction
  await page.getByTestId('connect-button').click();
  await metamask.handleAction('connect', { shouldApprove: true });
  
  // 3. Verification
  await expect(page.getByTestId('wallet-connected')).toBeVisible();
});
```

## Development Guidelines

### TypeScript Standards
- **Strict mode enforced**: No `any` types allowed
- **Use discriminated unions** for wallet action types
- **Proper async/await typing** with Playwright
- **Builder pattern** for all configuration APIs

### Testing Philosophy  
- **End-to-end focus**: Test complete user workflows
- **Fork mode for realism**: Test against real blockchain data
- **Cross-wallet compatibility**: Support MetaMask, Coinbase, Phantom
- **Type safety**: Leverage TypeScript for compile-time verification

### Code Style (Biome Configuration)
- **Semicolons**: As needed
- **Quotes**: Double quotes
- **Indent**: 2 spaces
- **Format before commit**: Run `npm run lint:fix`

## Environment Setup

### Required Environment Variables
```env
# Test wallet seed phrase (for testing only, never real funds)
E2E_TEST_SEED_PHRASE="your test seed phrase"

# Optional: RPC URLs for fork mode
ETHEREUM_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/api-key"
BASE_RPC_URL="https://mainnet.base.org"
```

### Dependencies
- Node.js >= 14.0.0
- npm or yarn (uses yarn@4.9.2 as package manager)
- Playwright browsers (installed automatically)

## Common Patterns & Examples

### Wallet Actions
```typescript
// Connection
await wallet.handleAction('connect', { shouldApprove: true });

// Transaction  
await wallet.handleAction('transaction', { 
  shouldApprove: true,
  gasLimit: '21000',
});

// Network switching
await wallet.handleAction('switchNetwork', { chainId: 1 });

// Token approval
await wallet.handleAction('tokenApproval', {
  shouldApprove: true,
  amount: '1000000000000000000', // 1 token
});
```

### Fork Mode Testing (High-value scenarios)
```typescript
const forkTest = createOnchainTest(
  configure()
    .withMetaMask()
    .withLocalNode({
      fork: 'https://eth-mainnet.g.alchemy.com/v2/api-key',
      forkBlockNumber: 18500000, // Specific block for reproducibility
      chainId: 1,
      accounts: 10,
      balance: '100000000000000000000', // 100 ETH
    })
    .build()
);
```

## Troubleshooting

### Common Build Issues
1. **TypeScript errors**: Ensure `@playwright/test` is installed as peer dependency
2. **Missing dependencies**: Always run `npm install` first
3. **Permission errors**: Ensure Node.js >= 14.0.0

### Testing Issues
1. **Extension not found**: Run `npm run prepare-metamask` (others currently broken)
2. **Network timeouts**: Check RPC URLs and rate limits
3. **Fork mode issues**: Use specific block numbers, not 'latest'

### Performance Tips
- Use specific block numbers in fork mode (not 'latest')
- Limit accounts in local node configuration
- Cache wallet extensions between test runs
- Use efficient Playwright selectors

---

**Remember**: This is a testing toolkit focused on reliability and developer experience. Always prioritize clear APIs, comprehensive error handling, and type safety over performance optimizations.