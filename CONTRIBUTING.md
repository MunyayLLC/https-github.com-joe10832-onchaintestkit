# Contributing to Onchain Test Kit

Thank you for your interest in contributing to Onchain Test Kit! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- Git

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone <repository-url>
   cd onchaintestkit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify the setup**
   ```bash
   npm run build
   npm run lint
   npm run test
   ```

## Development Workflow

### Code Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes following the coding guidelines**
   - Follow TypeScript best practices
   - Use the existing architectural patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Validate your changes**
   ```bash
   npm run lint        # Check code style
   npm run build       # Ensure it compiles
   npm run test        # Run tests
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new wallet action support"
   ```

### Testing

#### Running Tests
```bash
npm run test                    # Run all tests
npm run test -- --grep="MetaMask"  # Run specific tests
```

#### Writing Tests
- Place tests in the `tests/` directory
- Follow existing test patterns
- Use descriptive test names
- Test both success and error cases

#### Test Requirements
- All new features must have corresponding tests
- Wallet actions must be tested with all supported wallets
- Configuration changes require validation tests
- Fork mode features need integration tests

### Code Style

#### TypeScript Guidelines
- Use strict TypeScript settings
- Prefer explicit types over `any`
- Use proper interface definitions
- Follow existing naming conventions

#### Formatting and Linting
- Use Biome for formatting and linting
- Run `npm run format` before committing
- Fix linting issues with `npm run lint:fix`
- Follow existing code organization patterns

### Commit Messages

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test additions/modifications
- `refactor:` for code refactoring
- `chore:` for maintenance tasks

Examples:
```
feat: add Phantom wallet support for Solana
fix: handle MetaMask connection timeout
docs: update fork mode configuration examples
test: add integration tests for token approval flow
```

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   npm run test
   ```

2. **Verify linting passes**
   ```bash
   npm run lint
   ```

3. **Build successfully**
   ```bash
   npm run build
   ```

4. **Update documentation** if your changes affect the API

### PR Guidelines

1. **Write a clear PR title and description**
   - Explain what the PR does
   - Reference any related issues
   - Include breaking change notes if applicable

2. **Keep PRs focused**
   - One feature/fix per PR
   - Avoid mixing unrelated changes

3. **Include examples**
   - Add code examples for new features
   - Update README.md with usage examples

4. **Add tests**
   - Include comprehensive tests
   - Test edge cases and error conditions

### Review Process

- All PRs require review from maintainers
- Address feedback promptly
- Keep discussions constructive and respectful
- Be patient during the review process

## Architecture Guidelines

### Adding New Wallet Support

1. **Create wallet directory**
   ```
   src/wallets/NewWallet/
   ├── index.ts        # Main wallet implementation
   ├── fixtures.ts     # Playwright fixtures
   └── types.ts        # Wallet-specific types
   ```

2. **Implement required interfaces**
   - Extend base wallet class
   - Implement all required action handlers
   - Follow existing patterns

3. **Update configuration builder**
   - Add `.withNewWallet()` method
   - Update type definitions
   - Add validation logic

4. **Add CLI preparation script**
   ```bash
   src/cli/prepare-newwallet.sh
   src/cli/prepare-newwallet.mjs
   ```

### Adding New Actions

1. **Define action types**
   ```typescript
   type NewAction = 'newActionType';
   type WalletActions = ExistingActions | NewAction;
   ```

2. **Implement handlers**
   - Add to all wallet implementations
   - Include proper error handling
   - Add parameter validation

3. **Add tests**
   - Test with all supported wallets
   - Include success and failure cases
   - Test parameter edge cases

### Configuration Changes

1. **Maintain backward compatibility**
   - Add new options as optional
   - Provide sensible defaults
   - Document migration steps for breaking changes

2. **Validate inputs**
   - Check required parameters
   - Validate network configurations
   - Provide helpful error messages

## Documentation

### API Documentation
- Update inline JSDoc comments
- Include parameter descriptions
- Add usage examples
- Document error conditions

### README Updates
- Add new features to the feature list
- Update configuration examples
- Include troubleshooting information
- Update installation instructions if needed

### Example Updates
- Add examples for new features
- Keep examples simple and focused
- Test examples to ensure they work
- Update existing examples if APIs change

## Testing Guidelines

### Test Organization
```
tests/
├── config/         # Configuration testing
├── wallets/        # Wallet-specific tests
├── integration/    # End-to-end tests
└── utils/          # Test utilities
```

### Test Patterns

#### Configuration Tests
```typescript
import { configure } from '../src/configBuilder';

test('should configure MetaMask with seed phrase', () => {
  const config = configure()
    .withMetaMask()
    .withSeedPhrase({ seedPhrase: 'test', password: 'password' })
    .build();
    
  expect(config.wallets.metamask).toBeDefined();
});
```

#### Integration Tests
```typescript
import { createOnchainTest } from '../src';

const test = createOnchainTest(/* config */);

test('should connect and perform transaction', async ({ page, metamask }) => {
  // Test implementation
});
```

### Fork Mode Testing

When testing fork mode functionality:
- Use specific block numbers for reproducibility
- Mock RPC calls when possible
- Test with different network configurations
- Validate error handling for connection issues

## Release Process

### Version Management
- Follow semantic versioning (semver)
- Update package.json version
- Create changelog entries
- Tag releases properly

### Breaking Changes
- Document breaking changes thoroughly
- Provide migration guides
- Update examples
- Consider deprecation warnings

## Getting Help

### Resources
- Check existing documentation
- Look at example implementations
- Review test cases for patterns
- Search existing issues

### Communication
- Open GitHub issues for bugs and feature requests
- Use discussions for questions and ideas
- Tag maintainers when needed
- Be respectful and constructive

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines

Thank you for contributing to Onchain Test Kit!