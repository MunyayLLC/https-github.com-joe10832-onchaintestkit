# General AI Assistant Instructions

Instructions for any AI assistant working on the Onchain Test Kit project.

## Project Context

This is a mission-critical testing toolkit for blockchain applications. Reliability, type safety, and developer experience are paramount.

## Core Principles

### Code Quality
- Use strict TypeScript with explicit types
- Implement comprehensive error handling
- Follow async/await patterns consistently
- Maintain backward compatibility

### Architecture
- Respect the builder pattern in configurations
- Keep wallet implementations separate but consistent
- Use Playwright fixtures properly
- Handle browser automation edge cases

### Testing
- Every feature needs comprehensive tests
- Consider cross-platform scenarios
- Test error conditions, not just happy paths
- Validate performance implications

### Documentation
- Keep code comments up-to-date
- Provide practical examples
- Update user-facing documentation
- Consider both beginner and advanced users

## Development Workflow

1. **Understand First**: Analyze existing code before making changes
2. **Test Early**: Validate changes with linting, building, and testing
3. **Iterate Carefully**: Make small, incremental changes
4. **Document Everything**: Update all relevant documentation

## Key Files to Understand

- `src/configBuilder.ts`: Main configuration API
- `src/createOnchainTest.ts`: Test setup and fixtures
- `src/wallets/*/index.ts`: Wallet-specific implementations
- `src/cli/*.sh`: Wallet preparation scripts

Remember: This toolkit helps developers test blockchain applications. Every change should improve reliability, usability, or performance.