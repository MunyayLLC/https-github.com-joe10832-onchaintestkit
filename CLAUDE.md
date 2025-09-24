# Claude AI Instructions for OnchainTestKit

## Project Context
OnchainTestKit is a specialized testing framework for blockchain applications. As Claude, when working on this project, focus on the unique aspects of blockchain testing, wallet automation, and the technical complexities involved.

## Key Understanding Points

### Blockchain Testing Challenges
- **Asynchronous Operations**: Blockchain transactions are inherently asynchronous
- **State Management**: Blockchain state can be complex and interdependent
- **Network Variability**: Different networks have different behaviors and requirements
- **Wallet Integration**: Browser extension wallets have complex UI automation requirements

### Technical Complexity Areas
1. **Browser Extension Automation**: Requires careful handling of popup windows, context switching, and timing
2. **Network Forking**: Advanced feature that requires understanding of blockchain state and RPC providers
3. **Multi-Wallet Support**: Each wallet has unique UI patterns and interaction methods
4. **Gas Management**: Understanding of transaction costs and optimization

## Development Approach

### Code Quality Focus
- **Type Safety**: Leverage TypeScript's type system for blockchain-specific types
- **Error Handling**: Implement robust error handling for network and wallet failures
- **Async Patterns**: Use proper async/await patterns for blockchain operations
- **Resource Management**: Careful management of browser contexts and node processes

### Testing Philosophy
- **Real-World Scenarios**: Prefer tests that simulate actual user workflows
- **Network Isolation**: Ensure tests don't interfere with each other
- **Deterministic Results**: Despite blockchain complexity, tests should be predictable
- **Performance Awareness**: Balance thorough testing with execution speed

## Architectural Considerations

### Modular Design
- **Wallet Abstraction**: Common interface for different wallet types
- **Configuration Flexibility**: Support various testing scenarios through configuration
- **Extension Separation**: Wallet-specific code isolated in separate modules
- **Network Agnostic**: Support multiple blockchain networks through configuration

### Integration Points
- **Playwright Integration**: Deep integration with Playwright's testing framework
- **Viem Integration**: Modern Ethereum library for blockchain interactions
- **Node.js Ecosystem**: Leverage Node.js tools for CLI and build processes

## Problem-Solving Strategies

### Wallet Automation Issues
- **UI Changes**: Wallet extensions frequently update their UI
- **Timing Issues**: Wallet operations often require waiting for confirmations
- **Context Switching**: Managing multiple browser contexts and windows
- **Permission Handling**: Automated handling of wallet permission requests

### Network Testing
- **Fork Mode Complexity**: Understanding when and how to use blockchain forks
- **RPC Provider Reliability**: Handling provider downtime and rate limits
- **Block Number Management**: Choosing appropriate block numbers for consistent testing
- **Gas Price Optimization**: Balancing speed and cost in test environments

### Performance Optimization
- **Node Startup Time**: Optimizing local node configuration for faster test execution
- **Parallel Execution**: Enabling safe parallel test execution
- **Resource Cleanup**: Proper cleanup of blockchain nodes and browser contexts
- **Caching Strategies**: Effective use of caching for repeated operations

## Code Review Focus Areas

### Security Considerations
- **Private Key Management**: Ensure no private keys are committed to code
- **Extension Downloads**: Verify integrity of downloaded wallet extensions
- **Network Endpoints**: Validate RPC endpoints and API keys
- **File Operations**: Secure handling of temporary files and directories

### Maintainability
- **Documentation**: Ensure code is well-documented for complex blockchain concepts
- **Error Messages**: Provide clear, actionable error messages
- **Configuration Validation**: Validate configuration parameters early
- **Backward Compatibility**: Maintain API stability across versions

## Common Patterns to Recognize

### Configuration Patterns
```typescript
// Fluent builder pattern for complex configuration
const config = configure()
  .withWallet()
  .withNetwork()
  .withNode()
  .build();
```

### Wallet Action Patterns
```typescript
// Standardized action handling across wallet types
await wallet.handleAction(ActionType.APPROVE_TRANSACTION);
```

### Fork Mode Patterns
```typescript
// Local node with mainnet fork for realistic testing
.withLocalNode({
  fork: rpcUrl,
  forkBlockNumber: blockNumber,
  accounts: accountCount,
  balance: initialBalance
})
```

## Testing Scenarios to Consider

### DeFi Testing
- Complex multi-step transactions
- Token approvals and transfers
- Liquidity provision and removal
- Cross-protocol interactions

### NFT Testing
- Minting processes
- Marketplace interactions
- Royalty calculations
- Metadata handling

### Governance Testing
- Proposal creation and voting
- Multi-signature workflows
- Access control mechanisms
- Upgrade procedures

## Communication Style

### Technical Discussions
- Use precise blockchain terminology
- Explain complex concepts when introducing new features
- Provide context for technical decisions
- Consider both developer experience and end-user impact

### Code Comments
- Explain "why" not just "what" for complex blockchain operations
- Document timing considerations for async operations
- Explain wallet-specific behaviors and workarounds
- Include references to relevant blockchain concepts

When working on this project, maintain awareness of the evolving blockchain ecosystem, the challenges of browser extension automation, and the need for reliable, fast-executing tests in CI/CD environments.