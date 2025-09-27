# Gemini AI Instructions for Onchain Test Kit

This document provides specific setup instructions and guidelines for Gemini when working on the Onchain Test Kit project. For general project context, also refer to AGENTS.md and .github/copilot-instructions.md.

## Gemini-Specific Quick Setup

### Rapid Environment Setup
```bash
# Quick setup for immediate development
git clone <repo-url> && cd onchaintestkit
npm install && npm run build && npm run test

# Prepare for testing (fast track)
npm run prepare-metamask  # Only this works currently
export E2E_TEST_SEED_PHRASE="test seed phrase here"
```

### Fast Development Workflow
1. **Quick context absorption**: Scan key files for patterns
2. **Rapid prototyping**: Start with minimal working implementation
3. **Iterative improvement**: Build → test → refine cycle
4. **Performance optimization**: Focus on speed and efficiency

### Gemini's Optimal Development Approach

#### 1. Speed-First Development
- Start with the simplest solution that works
- Use existing patterns as templates for new features
- Prioritize working code over perfect architecture initially
- Refine and optimize in subsequent iterations

#### 2. User Experience Focus
- Make APIs intuitive and easy to use
- Provide clear error messages and helpful debugging
- Minimize configuration complexity
- Optimize for common use cases

#### 3. Creative Problem Solving
- Find innovative approaches to wallet automation challenges
- Explore efficient testing patterns
- Create streamlined development workflows
- Think outside the box for complex scenarios

## Gemini-Specific Strengths and Development Focus

### Leverage Gemini's Capabilities
- **Multi-modal understanding**: Excel at analyzing code structure and visual patterns
- **Rapid prototyping**: Quick iteration on wallet automation solutions
- **Creative problem solving**: Find innovative approaches to complex testing scenarios
- **Efficient code generation**: Generate clean, working code quickly

### Optimal Development Workflow

#### 1. Quick Analysis and Implementation
Gemini excels at:
- Rapid code comprehension and pattern identification
- Fast generation of test scenarios and configurations
- Quick prototyping of wallet integration solutions
- Efficient debugging and problem resolution

#### 2. Focus on Developer Experience
Prioritize:
- Clear, intuitive APIs for test configuration
- Streamlined wallet setup processes
- Helpful error messages and debugging information
- Comprehensive but concise documentation

#### 3. Innovation in Testing Approaches
Explore:
- Creative wallet automation techniques
- Novel testing patterns for blockchain scenarios
- Efficient integration testing strategies
- Performance optimizations for test execution

## Key Development Areas

### Wallet Automation Excellence
```typescript
// Gemini's preferred approach - clean and efficient
const test = createOnchainTest(
  configure()
    .withMetaMask()
    .withSeedPhrase({
      seedPhrase: process.env.E2E_TEST_SEED_PHRASE!,
      password: 'PASSWORD',
    })
    .withNetwork(baseSepolia) // Use predefined chain configs
    .build()
);

// Clear, action-oriented test structure
test('swap tokens with MetaMask', async ({ page, metamask }) => {
  // Setup
  await page.goto('http://localhost:3000');
  
  // Connect wallet efficiently
  await page.getByRole('button', { name: 'Connect Wallet' }).click();
  await metamask.handleAction('connect', { shouldApprove: true });
  
  // Execute swap
  await page.getByTestId('swap-button').click();
  await metamask.handleAction('transaction', { 
    shouldApprove: true,
    gasLimit: '150000' // Sufficient for swap
  });
  
  // Verify results
  await expect(page.getByTestId('success-message')).toBeVisible();
});
```

### Configuration Simplicity
Focus on making complex configurations simple:
```typescript
// Gemini excels at clean configuration patterns
const quickConfig = configure()
  .withMetaMask()
  .withTestNet('base-sepolia') // Simplified network selection
  .withDefaultWallet() // Sensible defaults
  .build();

const forkConfig = configure()
  .withLocalNode({ forkFrom: 'ethereum-mainnet', blockNumber: 'latest' })
  .withMetaMask()
  .build();
```

### Efficient Testing Patterns
- **Parallel execution**: Design tests for concurrent execution
- **Shared setup**: Minimize repetitive configuration
- **Smart defaults**: Reduce boilerplate in common scenarios
- **Fast feedback**: Optimize for quick test iteration

## Gemini's Development Priorities

### 1. User Experience Focus
- **Intuitive APIs**: Make complex blockchain testing accessible
- **Clear documentation**: Provide practical examples and use cases
- **Helpful defaults**: Reduce configuration overhead
- **Smooth onboarding**: Streamline the initial setup process

### 2. Performance Optimization
- **Fast test execution**: Optimize wallet automation speed
- **Efficient resource usage**: Minimize browser resource consumption
- **Smart caching**: Cache wallet extensions and configurations
- **Parallel processing**: Enable concurrent test execution

### 3. Reliability Engineering
- **Robust automation**: Handle wallet edge cases gracefully
- **Retry mechanisms**: Build in resilience for flaky operations
- **Clear error reporting**: Provide actionable error messages
- **Comprehensive testing**: Cover edge cases and error paths

## Code Generation Guidelines

### TypeScript Best Practices
```typescript
// Gemini's preferred TypeScript style - clear and typed
interface WalletConfig {
  readonly type: 'metamask' | 'coinbase' | 'phantom';
  readonly network: NetworkConfig;
  readonly credentials: WalletCredentials;
}

// Use discriminated unions for action types
type WalletAction = 
  | { type: 'connect'; shouldApprove: boolean }
  | { type: 'transaction'; shouldApprove: boolean; gasLimit?: string }
  | { type: 'switchNetwork'; chainId: number };

// Clear async patterns
async function handleWalletAction(
  action: WalletAction, 
  wallet: Wallet
): Promise<void> {
  switch (action.type) {
    case 'connect':
      return wallet.connect(action.shouldApprove);
    case 'transaction':
      return wallet.approveTransaction(action);
    case 'switchNetwork':
      return wallet.switchNetwork(action.chainId);
  }
}
```

### Testing Pattern Optimization
```typescript
// Efficient test organization
describe('Wallet Integration', () => {
  // Shared configuration for performance
  const testConfig = configure()
    .withMetaMask()
    .withNetwork(baseSepolia)
    .build();

  const test = createOnchainTest(testConfig);

  // Parallel-safe tests
  test('connect wallet', async ({ page, metamask }) => {
    // Implementation
  });

  test('handle transaction', async ({ page, metamask }) => {
    // Implementation  
  });

  test('switch networks', async ({ page, metamask }) => {
    // Implementation
  });
});
```

## Innovation Opportunities

### 1. Advanced Automation
- **Smart selectors**: Dynamic element selection strategies
- **Predictive actions**: Anticipate wallet popup behaviors
- **Context awareness**: Adapt to different DApp patterns
- **Error recovery**: Automatic retry with different strategies

### 2. Enhanced Configuration
- **Template system**: Pre-configured setups for common scenarios
- **Environment detection**: Auto-configure based on project context
- **Migration tools**: Automated updates for configuration changes
- **Validation helpers**: Real-time configuration validation

### 3. Developer Tools Integration
- **IDE extensions**: Enhanced development experience
- **Debug utilities**: Advanced debugging and inspection tools
- **Performance monitoring**: Built-in test performance analytics
- **CI/CD integration**: Streamlined continuous testing workflows

## Common Tasks for Gemini

### Quick Feature Implementation
1. **Analyze requirements**: Understand the feature scope quickly
2. **Identify patterns**: Find similar implementations for reference  
3. **Prototype solution**: Create working implementation rapidly
4. **Iterate and refine**: Improve based on testing and feedback
5. **Document thoroughly**: Provide clear usage examples

### Debugging Workflow
1. **Reproduce issue**: Create minimal test case
2. **Analyze symptoms**: Quick diagnosis of root causes
3. **Generate fixes**: Implement solutions efficiently
4. **Verify resolution**: Comprehensive testing of fixes
5. **Prevent regression**: Add tests to prevent future issues

### Code Quality Assurance
- **Type safety**: Ensure strict TypeScript compliance
- **Performance**: Optimize for fast test execution
- **Reliability**: Handle edge cases and error conditions
- **Maintainability**: Write clear, well-documented code

## Collaboration Style

### Communication Approach
- **Concise explanations**: Clear and to-the-point technical communication
- **Visual examples**: Use code examples to illustrate concepts
- **Practical solutions**: Focus on actionable implementations
- **Quick iterations**: Rapid feedback and improvement cycles

### Code Review Focus
- **Functionality**: Does the code work as expected?
- **Performance**: Is it optimized for test execution speed?
- **Clarity**: Is the implementation easy to understand?
- **Integration**: Does it fit well with existing patterns?

## Gemini's Project Contributions

Excel in:
- **Rapid development**: Quick implementation of new features
- **Creative solutions**: Innovative approaches to testing challenges  
- **User experience**: Making complex blockchain testing accessible
- **Performance optimization**: Efficient and fast test execution

Focus on delivering practical, high-quality solutions that make blockchain testing more accessible and efficient for developers.