# Gemini Instructions for Onchain Test Kit

This document provides specific context and guidelines for Gemini when working on the Onchain Test Kit project.

## Project Overview

The Onchain Test Kit is an end-to-end testing toolkit for blockchain applications, powered by Playwright. It provides comprehensive wallet automation and testing capabilities for DApps with support for MetaMask, Coinbase Wallet, and Phantom wallets.

### Key Technologies
- **TypeScript**: Primary language for type-safe development
- **Playwright**: Browser automation and testing framework  
- **Viem**: TypeScript interface for Ethereum with multi-chain support
- **Biome**: Fast formatter and linter (replaces ESLint/Prettier)
- **Node.js**: Runtime environment (minimum version 14.0.0)

## Gemini-Specific Guidelines

### Multimodal Understanding
Gemini's strength in processing multiple types of information can be leveraged for:

1. **Code and Documentation**: Simultaneously analyze code structure and documentation to understand intent
2. **Visual Testing**: When working with UI components and browser automation, consider visual elements
3. **Pattern Recognition**: Identify patterns across different wallet implementations and testing scenarios
4. **Cross-Reference Analysis**: Connect configuration options with their implementation and testing

### Problem-Solving Approach

1. **Holistic View**: Consider the entire ecosystem from configuration to execution
2. **Multiple Perspectives**: Think about developer experience, testing reliability, and maintenance
3. **Creative Solutions**: Explore innovative approaches to complex testing scenarios
4. **Integration Focus**: Ensure all components work harmoniously together

## Architecture Deep Dive

### Configuration Builder System
The fluent API design allows for intuitive test configuration:

```typescript
const config = configure()
  .withMetaMask()
  .withSeedPhrase({
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

### Wallet Automation Framework
Each wallet has specific automation needs:
- **MetaMask**: Extension-based with popup handling
- **Coinbase Wallet**: Similar to MetaMask but different UI patterns
- **Phantom**: Solana-focused with unique transaction flows

### Testing Infrastructure
- **Playwright Integration**: Browser automation and test execution
- **Local Node Management**: Anvil for blockchain simulation
- **Fork Mode**: Real blockchain data testing
- **Fixture System**: Test setup and teardown

## Development Best Practices for Gemini

### Code Quality
1. **Type Safety**: Utilize TypeScript's full potential for error prevention
2. **Async Patterns**: Properly handle asynchronous operations with async/await
3. **Error Handling**: Implement comprehensive error catching and reporting
4. **Code Reuse**: Identify and extract common patterns into utilities

### Testing Strategy
1. **Comprehensive Coverage**: Test happy paths, edge cases, and error conditions
2. **Isolation**: Ensure tests don't depend on each other
3. **Reproducibility**: Make tests deterministic and environment-independent
4. **Performance**: Optimize for fast feedback cycles

### Documentation
1. **Code Comments**: Explain complex logic and business rules
2. **API Documentation**: Keep public interfaces well-documented
3. **Examples**: Provide clear usage examples for common scenarios
4. **Migration Guides**: Help users upgrade between versions

## Gemini's Analytical Strengths

### Pattern Analysis
When working on this project, use pattern recognition to:
- Identify common wallet interaction patterns
- Spot inconsistencies across different implementations
- Find opportunities for code consolidation
- Recognize testing patterns that can be generalized

### System Integration
Consider how components interact:
- Configuration → Test Setup → Wallet Actions → Verification
- Browser Extensions ↔ Web Applications ↔ Blockchain Networks
- Development Tools ↔ CI/CD ↔ Production Testing

### Problem Decomposition
Break down complex issues:
1. **Root Cause Analysis**: Trace problems to their source
2. **Impact Assessment**: Understand how changes affect the entire system
3. **Solution Design**: Create comprehensive solutions that address all aspects
4. **Risk Evaluation**: Consider potential side effects and mitigation strategies

## Advanced Features and Considerations

### Fork Mode Testing
```typescript
const config = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    forkBlockNumber: 18500000, // Specific block for reproducibility
    chainId: 1,
  })
  .withMetaMask()
  .build();
```

Benefits:
- Test against real contract state
- Validate with actual liquidity and market conditions
- Ensure compatibility with production environments

### Multi-Wallet Scenarios
Consider testing scenarios that involve:
- Wallet switching within a single test
- Different wallets for different user roles
- Cross-wallet compatibility testing
- Performance comparison between wallets

### Network Management
- Dynamic network configuration
- Chain switching during tests
- Gas optimization testing
- Network failure simulation

## Gemini-Specific Development Workflow

### Analysis Phase
1. **Understand Requirements**: Analyze both explicit and implicit needs
2. **Study Existing Code**: Examine patterns and architectural decisions
3. **Identify Constraints**: Consider technical and business limitations
4. **Plan Architecture**: Design solutions that fit the existing system

### Implementation Phase
1. **Incremental Development**: Build features step by step
2. **Continuous Testing**: Validate changes at each step
3. **Integration Focus**: Ensure new code works with existing systems
4. **Performance Monitoring**: Watch for impacts on test execution time

### Validation Phase
1. **Comprehensive Testing**: Test all affected functionality
2. **Documentation Updates**: Ensure all changes are documented
3. **Example Creation**: Provide usage examples for new features
4. **Migration Support**: Help users adapt to changes

## Special Considerations

### Browser Automation Complexity
- Extension loading and initialization
- Popup window management
- iframe and context switching
- Timing and synchronization issues

### Blockchain-Specific Challenges
- Network connectivity and reliability
- Transaction confirmation times
- Gas price fluctuations
- Contract interaction complexity

### Cross-Platform Compatibility
- Operating system differences
- Browser version variations
- Node.js environment differences
- CI/CD pipeline considerations

## Contributing Guidelines for Gemini

### Code Review Process
1. **Holistic Review**: Consider code quality, architecture, and user impact
2. **Testing Verification**: Ensure adequate test coverage
3. **Documentation Check**: Verify documentation completeness
4. **Performance Assessment**: Evaluate impact on execution time

### Feature Development
1. **Requirements Analysis**: Understand the complete picture
2. **Design Discussion**: Collaborate on architectural decisions
3. **Implementation Strategy**: Plan incremental development
4. **Testing Strategy**: Design comprehensive test scenarios

### Maintenance Tasks
1. **Dependency Updates**: Handle version upgrades carefully
2. **Bug Fixes**: Address root causes, not just symptoms
3. **Performance Optimization**: Improve without breaking functionality
4. **Security Updates**: Maintain security best practices

Remember: Gemini's multimodal capabilities and analytical strength make it ideal for understanding complex systems like this testing framework. Use these capabilities to provide comprehensive, well-reasoned solutions that consider all aspects of the system.