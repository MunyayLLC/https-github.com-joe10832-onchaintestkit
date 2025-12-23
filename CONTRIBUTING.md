# Contributing to OnChainTestKit

Thank you for your interest in contributing to OnChainTestKit! We value contributions from the community and appreciate your time and effort.

---

## Table of Contents

- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Code Style Guidelines](#-code-style-guidelines)
- [Testing Guidelines](#-testing-guidelines)
- [Documentation](#-documentation)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)
- [Code Review Process](#-code-review-process)
- [Getting Help](#-getting-help)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 14.0.0 or higher
- **npm**, yarn, or pnpm
- **Git**
- **Playwright Test**

### Development Environment Setup

Follow these steps to set up your local development environment:

#### 1. Fork and Clone

```bash
git clone https://github.com/YOUR-USERNAME/https-github.com-joe10832-onchaintestkit.git
cd https-github.com-joe10832-onchaintestkit
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Build the Project

```bash
npm run build
```

#### 4. Prepare Wallet Extensions

```bash
npm run prepare-metamask
npm run prepare-coinbase
npm run prepare-phantom
```

#### 5. Configure Environment

```bash
export E2E_TEST_SEED_PHRASE="test test test test test test test test test test test junk"
```

> ⚠️ **Security Warning**: Never use real seed phrases or funds for testing!

#### 6. Verify Setup

```bash
npm test
```

---

## 🔄 Development Workflow

### 1. Create a Feature Branch

Always work on a dedicated branch for your changes:

```bash
# For new features
git checkout -b feature/descriptive-feature-name

# For bug fixes
git checkout -b fix/descriptive-bug-name

# For documentation
git checkout -b docs/descriptive-doc-change
```

### 2. Make Your Changes

Follow these principles while making changes:

- ✅ Write clean, maintainable code
- ✅ Follow existing code structure and patterns
- ✅ Add tests for new features or bug fixes
- ✅ Update documentation for API changes
- ✅ Keep commits atomic and focused

### 3. Test Your Changes

Run comprehensive checks before committing:

```bash
# Run all tests
npm test

# Check code style
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Build to verify compilation
npm run build
```

### 4. Commit Your Changes

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
git add .
git commit -m "type: brief description of changes"
```

**Commit Types:**

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add support for Phantom wallet` |
| `fix` | Bug fix | `fix: resolve connection timeout issue` |
| `docs` | Documentation only | `docs: update installation guide` |
| `style` | Code style/formatting | `style: apply consistent indentation` |
| `refactor` | Code restructuring | `refactor: simplify config builder` |
| `test` | Test additions/changes | `test: add wallet integration tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `perf` | Performance improvement | `perf: optimize wallet loading` |

**Example Commits:**

```bash
git commit -m "feat: add multi-chain support for Base network"
git commit -m "fix: resolve MetaMask extension loading error"
git commit -m "docs: add fork mode configuration examples"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Submit a Pull Request

1. Navigate to the [repository](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit)
2. Click **"New Pull Request"**
3. Select your feature branch
4. Fill out the PR template completely
5. Link any related issues
6. Submit for review

---

## 📝 Code Style Guidelines

### TypeScript/JavaScript Standards

**Code Organization:**

```typescript
// 1. External imports first
import { test, expect } from '@playwright/test';

// 2. Internal imports second
import { configure, createOnchainTest } from '@coinbase/onchaintestkit';

// 3. Type definitions
interface WalletConfig {
  seedPhrase: string;
  password: string;
}

// 4. Implementation
export function setupWallet(config: WalletConfig) {
  // Implementation
}
```

**Best Practices:**

- ✅ Use TypeScript for all new code
- ✅ Leverage TypeScript's type system fully
- ✅ Use meaningful, descriptive names
- ✅ Add JSDoc comments for public APIs
- ✅ Keep functions small and focused (< 50 lines)
- ✅ Prefer pure functions when possible
- ✅ Handle errors explicitly

**Example:**

```typescript
/**
 * Configures a wallet for testing
 * @param seedPhrase - Test wallet seed phrase
 * @param password - Wallet password
 * @returns Configured wallet instance
 * @throws {Error} If seed phrase is invalid
 */
export function configureWallet(
  seedPhrase: string,
  password: string
): WalletInstance {
  if (!seedPhrase || seedPhrase.split(' ').length !== 12) {
    throw new Error('Invalid seed phrase: must be 12 words');
  }
  
  return new WalletInstance({ seedPhrase, password });
}
```

### Code Quality Checklist

- ☑️ **Type Safety** - No `any` types without justification
- ☑️ **Error Handling** - All errors handled appropriately
- ☑️ **Documentation** - Public APIs have JSDoc comments
- ☑️ **Testing** - New code includes tests
- ☑️ **Performance** - No obvious performance issues

### Project Structure

```
src/
├── cli/                  # CLI tools and commands
│   ├── prepare-coinbase.mjs
│   ├── prepare-metamask.mjs
│   └── prepare-phantom.mjs
├── contracts/            # Smart contract utilities
│   └── SmartContractManager.ts
├── node/                 # Local node management
│   ├── LocalNodeManager.ts
│   ├── NetworkInterceptor.ts
│   └── types.ts
├── utils/                # Shared utilities
│   └── ConnectorUtil.ts
├── wallets/              # Wallet implementations
│   ├── BaseWallet.ts
│   ├── types.ts
│   ├── Coinbase/
│   ├── MetaMask/
│   └── Phantom/
├── configBuilder.ts      # Configuration builder
├── constants.ts          # Shared constants
├── createOnchainTest.ts  # Test creation
├── index.ts              # Public API exports
└── types.ts              # Shared types
```

---

## 🧪 Testing Guidelines

### Writing Tests

**Test Organization:**

- Place tests in the `tests/` directory
- Mirror the `src/` directory structure
- Use descriptive test file names (`*.test.ts` or `*.spec.ts`)

**Test Structure:**

```typescript
import { test, expect } from '@playwright/test';
import { configure, createOnchainTest } from '@coinbase/onchaintestkit';

test.describe('Wallet Connection', () => {
  test('should connect MetaMask wallet successfully', async () => {
    // Arrange - Set up test conditions
    const config = configure()
      .withMetaMask()
      .withSeedPhrase({
        seedPhrase: process.env.E2E_TEST_SEED_PHRASE!,
        password: 'TestPassword123'
      })
      .build();
    
    // Act - Perform the action
    const { page, wallet } = await createOnchainTest(config);
    await page.goto('https://test-dapp.com');
    await wallet.connect();
    
    // Assert - Verify the outcome
    expect(await wallet.isConnected()).toBe(true);
  });
  
  test('should handle connection rejection gracefully', async () => {
    // Test error scenarios
  });
});
```

**Testing Best Practices:**

- ✅ Test one thing per test
- ✅ Use descriptive test names
- ✅ Test both success and failure paths
- ✅ Keep tests independent and isolated
- ✅ Clean up resources after tests
- ✅ Use meaningful assertions

---

## 📚 Documentation

### When to Update Documentation

Update documentation when you:

- Add new features or APIs
- Change existing behavior
- Fix bugs that affect usage
- Add new configuration options

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview and quick start |
| `CONTRIBUTING.md` | Contribution guidelines (this file) |
| `docs/` | Detailed guides and API reference |
| `example/` | Working code examples |
| JSDoc comments | Inline API documentation |

### Documentation Style

**Writing Guidelines:**

- ✅ Be clear and concise
- ✅ Include code examples
- ✅ Explain the "why" behind decisions
- ✅ Keep examples up to date
- ✅ Use proper markdown formatting
- ✅ Add links to related documentation

**Example:**

```markdown
## Configuring Fork Mode

Fork mode allows you to test against a snapshot of mainnet at a specific block:

\```typescript
const config = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY',
    forkBlockNumber: 18500000 // Pin to specific block
  })
  .build();
\```

This ensures reproducible tests by using a consistent blockchain state.
```

---

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

1. ✅ **Search existing issues** - Check if it's already reported
2. ✅ **Test with latest version** - Verify bug exists in current release
3. ✅ **Verify configuration** - Ensure your setup is correct
4. ✅ **Create minimal reproduction** - Isolate the issue

### Bug Report Template

Include the following information:

**Description**
Clear and concise description of the bug.

**Steps to Reproduce**
1. Configure wallet with...
2. Run test with...
3. Observe error...

**Expected Behavior**
What should happen?

**Actual Behavior**
What actually happens?

**Environment**
- OS: [e.g., macOS 13.0, Ubuntu 22.04]
- Node version: [e.g., v18.16.0]
- Package version: [e.g., 1.2.0]
- Wallet: [e.g., MetaMask 11.0.0]

**Code Sample**
```typescript
// Minimal reproducible example
```

**Additional Context**
Screenshots, error messages, or other relevant information.

---

## 💡 Suggesting Features

We welcome feature suggestions! To propose a new feature:

1. ✅ **Check existing issues** - See if it's already suggested
2. ✅ **Open an issue** - Use the `enhancement` label
3. ✅ **Describe the use case** - Explain the problem it solves
4. ✅ **Provide examples** - Show how it would work
5. ✅ **Consider alternatives** - Discuss other approaches

---

## 🔍 Code Review Process

### Review Criteria

Reviewers evaluate submissions based on:

| Aspect | What We Check |
|--------|---------------|
| **Correctness** | Does it work as intended? No bugs? |
| **Tests** | Are there adequate tests? Do they pass? |
| **Documentation** | Is it well documented? |
| **Style** | Does it follow our guidelines? |
| **Performance** | Are there performance implications? |
| **Security** | Are there security concerns? |
| **Breaking Changes** | Is backward compatibility maintained? |

### Review Timeline

- **Initial Review**: Within 1-3 business days
- **Feedback**: Maintainers provide constructive feedback
- **Iteration**: Make requested changes
- **Approval**: Once approved, PR will be merged

---

## 🚫 What NOT to Contribute

Please avoid:

- ❌ **Breaking changes** without prior discussion
- ❌ **Large refactors** without approval
- ❌ **Failing tests** or linting errors
- ❌ **Unrelated changes** in a single PR
- ❌ **Real credentials** or secrets in code
- ❌ **Dependencies** without justification

---

## 📞 Getting Help

Need assistance with your contribution?

- 💬 **[Discussions](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/discussions)** - Ask questions and share ideas
- 📧 **PR Comments** - Ask questions directly in your pull request
- 📖 **[Documentation](./docs/)** - Check the comprehensive guides
- 🐛 **[Issues](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues)** - Report problems or request features

---

## 🎉 Recognition

Contributors are valued members of our community:

- ✨ Listed in project contributors
- 📝 Credited in release notes (for significant contributions)
- 🌟 Part of our blockchain testing community

---

## 📄 License

By contributing to OnChainTestKit, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing to OnChainTestKit!**

Every contribution, no matter the size, helps make blockchain testing better for everyone. 🚀

</div>
