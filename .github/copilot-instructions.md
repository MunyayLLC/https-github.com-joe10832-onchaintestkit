# GitHub Copilot Instructions for Onchain Test Kit

This document provides comprehensive setup steps, configuration guidelines, and context for GitHub Copilot when working on the Onchain Test Kit project.

## Quick Setup Guide

### Prerequisites Setup
Before using GitHub Copilot with this project, ensure you have:

1. **Node.js >= 14.0.0** (tested with Node.js 18+)
2. **npm or yarn** package manager (project uses yarn@4.9.2)
3. **Git** for version control
4. **Foundry** for local blockchain development
5. **GitHub Copilot extension** installed in your IDE

### Initial Project Setup
```bash
# 1. Clone and navigate to repository
git clone <repository-url>
cd onchaintestkit

# 2. Install dependencies
npm install

# 3. Verify setup by building
npm run build

# 4. Run tests to confirm everything works
npm run test
```

### GitHub Copilot Configuration
This repository includes specialized instructions for different AI agents:
- **General agents**: See `AGENTS.md` for common patterns
- **Claude-specific**: See `CLAUDE.md` for Claude optimizations  
- **Gemini-specific**: See `GEMINI.md` for Gemini focus areas
- **Specialized instructions**: See `.github/instructions/*.instructions.md`

### Environment Variables Setup
Create a `.env` file with required test credentials:
```bash
cp .env.example .env
# Edit .env to add your E2E_TEST_SEED_PHRASE and any other secrets
nano .env   # Or use your preferred editor (vim, code, etc.)
```

The `.env.example` file includes:
```env
# Test wallet seed phrase (NEVER use real funds)
E2E_TEST_SEED_PHRASE="your-test-seed-phrase-here"

# Optional: RPC URLs for fork mode testing
ETHEREUM_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/your-api-key"
BASE_RPC_URL="https://mainnet.base.org"
```

## Agent Setup and Configuration

### Understanding the Agent Architecture
This repository provides specialized documentation for different AI coding agents:

#### 1. General Agent Instructions (`AGENTS.md`)
- **Purpose**: Common patterns and guidelines for all AI agents
- **Key Features**: Architecture principles, common tasks, build commands
- **Setup Steps**:
  1. Read `AGENTS.md` for project overview
  2. Understand core technologies and patterns
  3. Follow common development tasks workflow

#### 2. GitHub Copilot Integration (this file)
- **Purpose**: Specific guidance for GitHub Copilot users
- **Features**: IDE integration, real-time code suggestions, context-aware assistance
- **Best Practices**:
  - Use descriptive function and variable names for better suggestions
  - Include JSDoc comments to improve context understanding
  - Follow existing patterns for consistent suggestions

#### 3. Claude AI Instructions (`CLAUDE.md`)
- **Purpose**: Advanced analysis and comprehensive planning
- **Strengths**: Deep blockchain testing scenarios, complex problem solving
- **Setup**: Configure Claude with project context from `CLAUDE.md`

#### 4. Gemini AI Instructions (`GEMINI.md`)
- **Purpose**: Rapid development and creative solutions  
- **Strengths**: Quick implementation, user experience focus, performance optimization
- **Setup**: Use Gemini for fast prototyping and iteration

#### 5. Specialized Instructions (`.github/instructions/`)
- **`development.instructions.md`**: Development environment and coding standards
- **`testing.instructions.md`**: Comprehensive testing strategies and patterns
- **`wallet-integration.instructions.md`**: Wallet-specific implementation guidance

### Setting Up Your Agent Workflow

1. **Choose Your Primary Agent**: Select based on your development style and needs
2. **Read Agent-Specific Instructions**: Review the corresponding `.md` file
3. **Configure Context**: Ensure your agent has access to relevant instruction files
4. **Test Integration**: Run build and test commands to verify setup

### Agent-Specific Best Practices

#### For GitHub Copilot Users:
```typescript
// Use descriptive names for better suggestions
const createMetaMaskWalletConfiguration = (seedPhrase: string) => {
  return configure()
    .withMetaMask()
    .withSeedPhrase({ seedPhrase, password: 'PASSWORD' })
    .build();
};

// Add JSDoc for context-aware assistance
/**
 * Handles MetaMask wallet connection approval
 * @param shouldApprove - Whether to approve the connection request
 * @param timeout - Maximum time to wait for popup (default: 30000ms)
 */
```

#### For All Agents:
- **Follow existing patterns**: Use established architectural approaches
- **Test incrementally**: Build and test frequently during development
- **Document changes**: Update relevant documentation files
- **Validate with tools**: Use npm scripts for linting and testing

### Troubleshooting Agent Setup

#### Common Issues:
1. **Agent not recognizing project context**
   - Ensure agent has access to instruction files
   - Verify environment variables are set
   - Check that dependencies are installed

2. **Inconsistent code suggestions**
   - Review agent-specific instruction files
   - Follow established code patterns
   - Use descriptive naming conventions

3. **Build/test failures during development**
   - Run `npm run build` to check TypeScript compliance
   - Execute `npm run lint:fix` to resolve formatting issues
   - Verify wallet preparation scripts have run successfully

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
  .withLocalNode({                   // Local node must come FIRST
    fork: 'https://eth-mainnet.g.alchemy.com/v2/api-key',
    forkBlockNumber: 18500000,       // Use specific blocks
    chainId: 1,
  })
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
    .withLocalNode({
      fork: 'https://eth-mainnet.g.alchemy.com/v2/api-key',
      forkBlockNumber: 18500000, // Specific block for reproducibility
      chainId: 1,
      accounts: 10,
      balance: '100000000000000000000', // 100 ETH
    })
    .withMetaMask()
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

## Example Agent Workflows

### Getting Started with GitHub Copilot
1. **Setup**: Follow the Quick Setup Guide above
2. **Context**: Review project-specific patterns in your IDE
3. **Development**: Use Copilot suggestions within established patterns
4. **Testing**: Run `npm run build && npm run test` frequently

### Example Development Session
```typescript
// 1. Start by importing required modules
import { createOnchainTest, configure } from '@coinbase/onchaintestkit';
import { baseSepolia } from 'viem/chains';

// 2. Create configuration (Copilot will suggest completions)
const config = configure()
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
  .build();

// 3. Create tests with agent assistance
const test = createOnchainTest(config);

test('wallet connection with approval', async ({ page, metamask }) => {
  // Navigate to DApp
  await page.goto('http://localhost:3000');
  
  // Trigger connection (Copilot suggests common patterns)
  await page.getByTestId('connect-button').click();
  
  // Handle wallet interaction
  await metamask.handleAction('connect', { shouldApprove: true });
  
  // Verify result
  await expect(page.getByTestId('wallet-connected')).toBeVisible();
});
```

### Best Practices for All Agents

#### Code Quality Checkpoints:
```bash
# Before committing, always run:
npm run build      # Verify TypeScript compilation
npm run lint:fix   # Fix formatting and style issues  
npm run test       # Ensure tests still pass
```

#### Documentation Updates:
- Update README.md for API changes
- Add JSDoc comments for new public methods
- Include usage examples in complex functions

### Agent-Specific Example Flows

#### Using Claude for Complex Analysis:
1. Analyze blockchain testing scenario requirements
2. Design comprehensive test coverage strategy
3. Consider edge cases and error conditions
4. Implement with detailed documentation

#### Using Gemini for Rapid Development:
1. Quickly prototype new wallet action
2. Implement basic functionality first
3. Iterate and refine based on testing
4. Optimize for performance and clarity

#### Using GitHub Copilot for Daily Development:
1. Write descriptive function signatures
2. Let Copilot suggest implementation patterns
3. Refine suggestions to match project style
4. Add appropriate error handling

## Extended Troubleshooting Guide

### Wallet Setup Issues

#### MetaMask Extension Problems:
```bash
# If MetaMask preparation fails:
rm -rf ./e2e/extensions/metamask
npm run prepare-metamask

# Verify extension exists:
ls -la ./e2e/extensions/metamask/
```

#### Known Extension Issues:
- **Coinbase & Phantom**: Currently return invalid 9-byte zip files
- **Workaround**: Use MetaMask for testing until issue is resolved
- **Status**: These are known upstream issues being investigated

### Development Environment Issues

#### Node.js Version Problems:
```bash
# Check your Node.js version
node --version

# Should be >= 14.0.0, recommended >= 18.0.0
# Update Node.js if needed:
# - Using nvm: nvm install 18 && nvm use 18
# - Using direct install: Download from nodejs.org
```

#### TypeScript Compilation Issues:
```bash
# Clear any cached builds
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

#### Test Execution Problems:
```bash
# Run tests with verbose output
npm run test -- --reporter=list --verbose

# Run specific test file
npm run test tests/specific-test.spec.ts

# Debug test failures
npm run test -- --debug --headed
```

### Agent-Specific Troubleshooting

#### GitHub Copilot Not Providing Good Suggestions:
1. **Check context**: Ensure instruction files are open in workspace
2. **Use descriptive names**: Better function/variable names improve suggestions  
3. **Add comments**: Explain intent for better contextual understanding
4. **Follow patterns**: Stay consistent with existing code structure

#### Claude Analysis Issues:
1. **Provide clear context**: Include relevant code snippets and requirements
2. **Break down complex problems**: Ask specific questions about components
3. **Review existing patterns**: Check CLAUDE.md for best practices

#### Gemini Development Speed Issues:
1. **Start simple**: Begin with minimal working implementation
2. **Iterate quickly**: Use fast feedback cycles with `npm run build`
3. **Focus on core functionality**: Add optimizations in later iterations

### Network and Fork Mode Issues

#### RPC Connection Problems:
```bash
# Test RPC connectivity
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' \
  YOUR_RPC_URL

# For Alchemy URLs, verify API key is valid
# For local testing, use public RPC endpoints
```

#### Fork Mode Debugging:
```typescript
// Enable debug logging
const config = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    forkBlockNumber: 18500000, // Use specific block numbers
    chainId: 1,
    verbose: true, // Enable verbose logging
  })
  .withMetaMask()
  .build();
```

### Performance Optimization

#### Test Execution Speed:
- Use minimal browser instances
- Cache wallet extensions between runs
- Limit blockchain node accounts (default: 10 is usually enough)
- Use specific block numbers instead of 'latest' for reproducibility

#### Resource Management:
- Clean up browser contexts after tests
- Stop local nodes when tests complete
- Monitor memory usage during long test suites
- Use appropriate timeouts for wallet operations

---

**Remember**: This toolkit focuses on making blockchain testing accessible and reliable. When in doubt, start with the simplest configuration that works, then gradually add complexity as needed.

**Remember**: This is a testing toolkit focused on reliability and developer experience. Always prioritize clear APIs, comprehensive error handling, and type safety over performance optimizations.