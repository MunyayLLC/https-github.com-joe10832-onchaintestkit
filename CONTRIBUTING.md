# Contributing to OnChainTestKit

Thank you for your interest in contributing to OnChainTestKit! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites

- Node.js 14.0.0 or higher
- npm, yarn, or pnpm
- Git
- Playwright Test

### Setup Development Environment

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/https-github.com-joe10832-onchaintestkit.git
cd https-github.com-joe10832-onchaintestkit
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the project**

```bash
npm run build
```

4. **Prepare wallet extensions**

```bash
npm run prepare-metamask
npm run prepare-coinbase
npm run prepare-phantom
```

5. **Set up environment variables**

```bash
export E2E_TEST_SEED_PHRASE="test test test test test test test test test test test junk"
```

⚠️ **Never use real seed phrases or funds for testing!**

6. **Run tests**

```bash
npm test
```

## 🔄 Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the existing code style and patterns
- Add tests for new features or bug fixes
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git add .
git commit -m "feat: add new wallet support"
# or
git commit -m "fix: resolve connection timeout issue"
# or
git commit -m "docs: update installation guide"
```

#### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to the [repository](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit)
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template with details about your changes
5. Submit the pull request

## 📝 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code structure and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Avoid unnecessary complexity

### Code Quality

- **Write tests**: All new features should include tests
- **Type safety**: Leverage TypeScript's type system
- **Error handling**: Handle errors appropriately
- **Documentation**: Update docs for API changes
- **Performance**: Consider performance implications

### File Organization

```
src/
├── cli/              # CLI tools and scripts
├── contracts/        # Smart contract management
├── node/             # Local node and network interceptor
├── utils/            # Utility functions
├── wallets/          # Wallet implementations
│   ├── BaseWallet.ts
│   ├── Coinbase/
│   ├── MetaMask/
│   └── Phantom/
└── index.ts          # Main exports
```

## 🧪 Testing Guidelines

### Writing Tests

- Place tests in the `tests/` directory
- Mirror the `src/` structure
- Use descriptive test names
- Test edge cases and error conditions
- Keep tests independent and isolated

### Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { configure, createOnchainTest } from '@coinbase/onchaintestkit';

test.describe('Feature Name', () => {
  test('should do something specific', async () => {
    // Arrange
    const config = configure()
      .withMetaMask()
      .build();
    
    // Act
    const result = await someFunction();
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

## 📚 Documentation

### Updating Documentation

When making changes, update relevant documentation:

- **README.md** - Main project overview
- **docs/** - Detailed guides and API reference
- **Code comments** - Inline documentation
- **Examples** - Usage examples in `example/`

### Documentation Style

- Be clear and concise
- Include code examples
- Explain the "why" not just the "what"
- Keep examples up to date
- Use proper markdown formatting

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing issues to avoid duplicates
2. Test with the latest version
3. Verify it's not a configuration issue

### Bug Report Template

Include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, package version
- **Code Sample**: Minimal reproducible example

## 💡 Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature already exists or is planned
2. Open an issue with the `enhancement` label
3. Describe the use case and benefits
4. Provide examples of how it would work

## 🔍 Code Review Process

### What We Look For

- **Correctness**: Does it work as intended?
- **Tests**: Are there adequate tests?
- **Documentation**: Is it well documented?
- **Style**: Does it follow our guidelines?
- **Performance**: Are there performance implications?
- **Security**: Are there security concerns?

### Review Timeline

- Initial review: Within 1-3 business days
- Feedback incorporated: Review continues
- Approved: Ready to merge

## 🚫 What NOT to Contribute

Please avoid:

- ❌ Breaking changes without discussion
- ❌ Large refactors without prior approval
- ❌ Code that fails tests or linting
- ❌ Unrelated changes in a single PR
- ❌ Commits with real secrets or credentials

## 📞 Getting Help

Need help with your contribution?

- 💬 Open a [discussion](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/discussions)
- 📧 Ask questions in your PR
- 📖 Check the [documentation](./docs/)
- 🐛 Open an [issue](https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit/issues)

## 🎉 Recognition

Contributors will be:

- Listed in the project's contributors
- Credited in release notes (for significant contributions)
- Part of a growing community of blockchain testing enthusiasts

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to OnChainTestKit! Every contribution, no matter how small, helps make blockchain testing better for everyone. 🚀
