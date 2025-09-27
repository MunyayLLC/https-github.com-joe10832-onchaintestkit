# GitHub Copilot Instructions for Onchain Test Kit

This document provides context and guidelines for GitHub Copilot when working on the Onchain Test Kit project.

## Table of Contents
1. [Quick Start Setup](#quick-start-setup-for-github-copilot)
2. [Project Overview](#project-overview)
3. [Build and Development Commands](#build-and-development-commands)
4. [Architecture & Project Layout](#architecture--project-layout)
5. [Configuration Patterns](#configuration-patterns)
6. [Development Guidelines](#development-guidelines)
7. [Environment Setup](#environment-setup)
8. [Common Patterns & Examples](#common-patterns--examples)
9. [Troubleshooting](#troubleshooting)
10. [Understanding Agent Instructions Structure](#understanding-agent-instructions-structure)
11. [Example Workflows for AI Agents](#example-workflows-for-ai-agents)

## Quick Start Setup for GitHub Copilot

### Step 1: Repository Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/coinbase/onchaintestkit.git
   cd onchaintestkit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify setup**:
   ```bash
   npm run build && npm run test
   ```

### Step 2: GitHub Copilot Configuration
1. **Enable Copilot** in your IDE (VS Code, IntelliJ, etc.)
2. **Load project context**: Open the repository in your IDE to let Copilot understand the codebase
3. **Review instructions**: Familiarize yourself with this file and the specialized instruction files in `.github/instructions/`

### Step 3: AI Agent Setup (Optional)
For advanced AI assistance, review the agent-specific documentation:
- **Claude**: See `CLAUDE.md` for Claude-specific instructions and focus areas
- **Gemini**: See `GEMINI.md` for Gemini-specific strengths and workflows
- **General**: See `AGENTS.md` for common AI agent guidelines

### Step 4: Environment Configuration
1. **Set required environment variables**:
   ```bash
   # Create .env file (never commit this)
   echo "E2E_TEST_SEED_PHRASE=your-test-seed-phrase-here" > .env
   ```

2. **Prepare wallet extensions** (required for testing):
   ```bash
   npm run prepare-metamask  # ✅ Works correctly
   npm run prepare-coinbase  # ⚠️ Currently has known issues
   npm run prepare-phantom   # ⚠️ Currently has known issues
   ```

### Step 5: Verify Setup
```bash
# Run the complete setup verification
npm run build
npm run lint
npm run test

# If all pass, you're ready to contribute!
```

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

# Coinbase & Phantom - CURRENTLY BROKEN (zip download returns invalid 9-byte files)  
npm run prepare-coinbase    # ⚠️ Known issue: zip download returns invalid 9-byte files
npm run prepare-phantom     # ⚠️ Known issue: zip download returns invalid 9-byte files
```

### Validated Build Process
1. **Always run `npm install` first** - Dependencies must be installed
2. **Build compiles without errors** - TypeScript strict mode enforced
3. **Tests pass (3 tests run in ~800ms)** - Basic functionality verified
4. **Linting passes** - Biome checks complete successfully
5. **Format command works** but tries to format extension files (ignorable errors)

### Known Issues & Workarounds
- **Coinbase/Phantom preparation fails**: Zip download returns invalid 9-byte files
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

## Understanding Agent Instructions Structure

### Main Documentation Files
- **`.github/copilot-instructions.md`** (this file): Primary GitHub Copilot configuration and context
- **`AGENTS.md`**: General instructions for all AI coding agents
- **`CLAUDE.md`**: Claude-specific instructions and focus areas
- **`GEMINI.md`**: Gemini-specific strengths and development priorities
- **`CONTRIBUTING.md`**: Human contributor guidelines (also useful for agents)

### Specialized Instruction Files (`.github/instructions/`)
Located in `.github/instructions/`, these provide deep, specialized guidance:

1. **`development.instructions.md`**: 
   - Development environment setup
   - Code quality standards  
   - Architecture guidelines
   - Build and deployment workflows

2. **`testing.instructions.md`**:
   - Comprehensive testing strategies
   - Test structure and organization
   - Fork mode testing patterns
   - Cross-wallet compatibility testing

3. **`wallet-integration.instructions.md`**:
   - Wallet-specific implementation patterns
   - Extension setup and configuration
   - Action handling and debugging
   - Cross-wallet testing approaches

### How to Use These Instructions

#### For New Contributors
1. Start with this file (`.github/copilot-instructions.md`) for project overview
2. Review `AGENTS.md` for general development patterns
3. Check agent-specific files (`CLAUDE.md`, `GEMINI.md`) if using those tools
4. Dive into specialized instructions based on your task:
   - Building features? → `development.instructions.md`
   - Writing tests? → `testing.instructions.md`
   - Working with wallets? → `wallet-integration.instructions.md`

#### For AI Agents
- **Primary context**: Load this file for main project understanding
- **Task-specific**: Reference specialized instruction files for detailed guidance
- **Agent-specific**: Follow your agent's specific documentation (CLAUDE.md, GEMINI.md, etc.)

#### Best Practices for Extending Instructions
- **Keep consistency**: Follow the established patterns and tone
- **Be specific**: Include concrete examples and code snippets
- **Test examples**: Ensure all code examples work with the current codebase
- **Cross-reference**: Link related sections between files
- **Update regularly**: Keep instructions current with code changes

## Example Workflows for AI Agents

### Workflow 1: Adding a New Wallet Action
```typescript
// 1. Define the action type
type NewActionType = 'signMessage' | 'personalSign';

// 2. Add to base wallet interface
interface ActionOptions {
  message?: string;
  shouldApprove?: boolean;
}

// 3. Implement in all wallet classes
async handleAction(action: WalletActionType, options: ActionOptions): Promise<void> {
  switch (action) {
    case 'signMessage':
      return this.handleSignMessage(options);
    // ... other cases
  }
}

// 4. Add comprehensive tests
test('sign message action', async ({ wallet }) => {
  await wallet.handleAction('signMessage', {
    message: 'Hello World',
    shouldApprove: true
  });
});
```

### Workflow 2: Adding Fork Mode Support for New Chain
```typescript
// 1. Research the chain configuration
const optimismConfig = {
  name: 'Optimism',
  chainId: 10,
  rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/api-key',
  forkBlockNumber: 110000000, // Specific block for reproducibility
};

// 2. Create configuration pattern
const optimismFork = configure()
  .withMetaMask()
  .withLocalNode({
    fork: optimismConfig.rpcUrl,
    forkBlockNumber: optimismConfig.forkBlockNumber,
    chainId: optimismConfig.chainId,
  })
  .withNetwork(optimismConfig)
  .build();

// 3. Add example test
test('test on Optimism fork', async ({ page, metamask, node }) => {
  await page.goto('https://app.uniswap.org');
  // Test with real Optimism contracts and liquidity
});
```

### Workflow 3: Debugging Wallet Issues
```typescript
// 1. Add comprehensive logging
class WalletDebugger {
  static async debugWalletAction(wallet: Wallet, action: string) {
    console.log(`Starting ${action} on ${wallet.constructor.name}`);
    
    try {
      await wallet.handleAction(action);
      console.log(`✅ ${action} completed successfully`);
    } catch (error) {
      console.error(`❌ ${action} failed:`, error);
      // Take screenshot for debugging
      await this.captureDebugInfo(wallet, error);
      throw error;
    }
  }
}

// 2. Create diagnostic test
test('diagnose wallet connection issues', async ({ page, wallet }) => {
  await WalletDebugger.debugWalletAction(wallet, 'connect');
});
```

### Troubleshooting Common Agent Issues

#### Issue: "Agent suggestions not relevant to blockchain context"
**Solution**: Ensure you're loading the correct context files and understanding the wallet automation patterns.

#### Issue: "Generated tests are flaky"
**Solution**: Use proper waiting strategies and timeouts specifically for blockchain operations:
```typescript
// Good: Specific timeouts for wallet operations
await wallet.handleAction('connect', { timeout: 30000 });
await expect(page.getByTestId('balance')).toBeVisible({ timeout: 45000 });
```

#### Issue: "Agent doesn't understand fork mode implications"
**Solution**: Review the fork mode examples in the documentation and understand that fork mode creates local blockchain instances with real mainnet data.