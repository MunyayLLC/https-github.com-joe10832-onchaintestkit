# Claude AI Instructions for Onchain Test Kit

This document provides specific instructions for Claude when working on the Onchain Test Kit project. For general project context, also refer to AGENTS.md and .github/copilot-instructions.md.

## Quick Setup for Claude

### Initial Configuration Steps
1. **Load project context**: Familiarize yourself with the repository structure and existing patterns
2. **Review dependencies**: Understand the TypeScript, Playwright, and Viem ecosystem
3. **Study wallet patterns**: Examine existing wallet implementations for consistency
4. **Test setup**: Verify you can run the build and test pipeline

### Claude's Optimal Usage Workflow
```typescript
// 1. Analyze requirements thoroughly
// Example: Adding a new wallet action for token swaps

// 2. Research existing patterns
// Check how similar actions are implemented across wallets
// Review test patterns for comprehensive coverage

// 3. Plan implementation
interface SwapActionOptions {
  shouldApprove: boolean;
  tokenIn: string;
  tokenOut: string;
  amount: string;
  slippage?: string;
}

// 4. Implement with error handling
async handleSwapAction(options: SwapActionOptions): Promise<void> {
  try {
    const popup = await this.waitForPopup();
    // Handle swap-specific UI interactions
    await popup.getByTestId('swap-confirm').click();
  } catch (error) {
    throw new WalletActionError('Swap action failed', error);
  }
}

// 5. Add comprehensive tests
test('token swap approval flow', async ({ page, metamask }) => {
  // Test happy path
  // Test rejection path  
  // Test error conditions
  // Test with different token pairs
});
```

## Claude-Specific Strengths and Focus Areas

### Leverage Claude's Capabilities
- **Code reasoning**: Use detailed analysis for complex blockchain testing scenarios
- **Pattern recognition**: Identify and maintain consistent architectural patterns
- **Comprehensive explanations**: Provide thorough documentation for complex wallet interactions
- **Edge case consideration**: Think through various blockchain and wallet edge cases

### Preferred Development Approach

#### 1. Analytical Problem Solving
When approaching tasks:
- Analyze the full context of blockchain testing requirements
- Consider wallet-specific behaviors and limitations  
- Think through async patterns and timing issues
- Plan for cross-browser compatibility

#### 2. Detailed Implementation Planning
Before making changes:
- Review existing wallet implementations for patterns
- Consider impact on all supported wallets (MetaMask, Coinbase, Phantom)
- Plan for both unit tests and integration tests
- Think through fork mode implications

#### 3. Comprehensive Error Handling
- Anticipate wallet connection timeouts
- Handle network switching failures gracefully
- Provide clear error messages for debugging
- Consider retry mechanisms for flaky operations

## Key Areas of Focus

### Blockchain Testing Complexity
- **Fork mode testing**: Understanding of mainnet forking for realistic testing
- **Multi-wallet scenarios**: Handling different wallet behaviors consistently
- **Network switching**: Chain-specific configurations and transitions
- **Transaction handling**: Gas estimation, approval flows, and error states

### TypeScript Excellence
- Maintain strict typing throughout the codebase
- Use proper generic constraints for wallet actions
- Implement discriminated unions for action types
- Ensure proper async/await typing with Playwright

### Testing Architecture
```typescript
// Preferred pattern for Claude to follow
const test = createOnchainTest(
  configure()
    .withMetaMask()
    .withLocalNode({
      fork: 'https://mainnet.base.org',
      forkBlockNumber: specificBlockNumber, // Always use specific blocks
      accounts: 5, // Reasonable number for testing
    })
    .withNetwork(baseMainnet) // Use viem chain configs
    .build()
);

test('descriptive test name explaining the scenario', async ({ page, metamask, node }) => {
  // Clear setup phase
  await page.goto('http://localhost:3000');
  
  // Explicit wallet interactions
  await page.getByTestId('connect-button').click();
  await metamask.handleAction('connect', { shouldApprove: true });
  
  // Verify expected outcomes
  await expect(page.getByTestId('wallet-address')).toBeVisible();
});
```

### Configuration Builder Patterns
When extending the configuration builder:
- Use method chaining consistently
- Validate parameters at build time
- Provide helpful error messages
- Maintain backward compatibility

## Common Scenarios for Claude

### 1. Wallet Integration Issues
When debugging wallet problems:
- Check extension preparation scripts first
- Verify browser context configuration
- Review timing issues in wallet popups
- Consider wallet-specific quirks and behaviors

### 2. Fork Mode Configuration
For mainnet forking scenarios:
- Always specify exact block numbers for reproducibility
- Use appropriate RPC providers with sufficient rate limits  
- Consider the cost implications of fork testing
- Plan for realistic token balances and contract states

### 3. Multi-Chain Testing
When working with multiple networks:
- Use viem chain configurations consistently
- Handle network switching edge cases
- Test with realistic gas prices and block times
- Consider chain-specific wallet behaviors

## Code Quality Expectations

### Documentation Standards
- Add JSDoc comments for public APIs
- Include usage examples in complex functions
- Document edge cases and error conditions
- Update README.md for API changes

### Testing Requirements
- Write integration tests for new wallet actions
- Test with all supported wallets when adding features
- Include fork mode tests for DeFi interactions
- Verify cross-browser compatibility

### Performance Considerations
- Optimize for test execution speed
- Minimize unnecessary blockchain calls
- Use efficient selectors in Playwright tests
- Cache wallet extensions properly

## Debugging Guidelines

### Common Issues and Solutions

1. **TypeScript Compilation Errors**
   - Check that Node.js types are available
   - Verify Playwright test types are imported correctly
   - Ensure proper async/await typing

2. **Wallet Extension Problems**
   - Run preparation scripts to download extensions
   - Check file permissions on extension directories
   - Verify browser compatibility

3. **Network Configuration Issues**
   - Validate RPC URLs are accessible
   - Check chain ID matches network configuration
   - Ensure sufficient rate limits for fork mode

### Effective Debugging Process
1. Reproduce the issue with minimal test case
2. Check browser developer tools for errors
3. Review wallet extension logs
4. Analyze network requests and blockchain calls
5. Test with different networks and configurations

## Collaboration Guidelines

### Code Review Focus
- Verify TypeScript strict compliance
- Check wallet action consistency across implementations
- Ensure test coverage for new features
- Review documentation completeness

### Communication Style
- Provide detailed explanations for complex blockchain concepts
- Include code examples in technical discussions
- Consider multiple perspectives on architectural decisions
- Document reasoning behind implementation choices

## Claude's Role in the Project

As Claude, you excel at:
- **Deep analysis** of complex blockchain testing scenarios
- **Comprehensive planning** for feature implementations
- **Thoughtful consideration** of edge cases and error conditions  
- **Clear documentation** of complex technical concepts

Focus on leveraging these strengths while maintaining the project's focus on reliability, type safety, and comprehensive testing capabilities for blockchain DApps.