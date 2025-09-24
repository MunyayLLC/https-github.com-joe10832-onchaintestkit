# API Development Instructions

## Overview
Instructions for developing and maintaining the OnchainTestKit API surface, including public interfaces, configuration options, and extensibility patterns.

## API Design Principles

### Fluent Interface Design
The configuration API uses the builder pattern for intuitive setup:
```typescript
const config = configure()
  .withMetaMask()
  .withSeedPhrase(seedConfig)
  .withNetwork(networkConfig)
  .withLocalNode(nodeConfig)
  .build();
```

### Type Safety
- Use TypeScript's strict mode
- Provide comprehensive type definitions
- Leverage conditional types for configuration validation
- Export all necessary types for external use

### Backward Compatibility
- Maintain stable public APIs
- Use deprecation warnings before removing features
- Provide migration guides for breaking changes
- Version configuration schemas appropriately

## Public API Structure

### Core Exports
```typescript
// Main testing function
export { createOnchainTest } from './createOnchainTest';

// Configuration builder
export { configure } from './configBuilder';

// Action types for wallet interactions
export { BaseActionType, ActionApprovalType } from './wallets/BaseWallet';

// Wallet-specific exports
export { MetaMask } from './wallets/MetaMask';
export { CoinbaseWallet, CoinbaseSpecificActionType } from './wallets/Coinbase';
export { PhantomWallet, PhantomSpecificActionType } from './wallets/Phantom';

// Utility functions
export { setupRpcPortInterceptor } from './node/NetworkInterceptor';
```

### Type Exports
```typescript
// Configuration types
export type {
  WalletConfig,
  NetworkConfig,
  MetaMaskConfig,
  CoinbaseConfig,
  PhantomConfig,
  NodeConfig,
  WalletSetupFn
} from './wallets/types';

// Testing types
export type {
  OnchainFixtures,
  SupportedWallet,
  WalletFixtureOptions
} from './types';
```

## Configuration API

### Builder Pattern Implementation
```typescript
class ConfigBuilder {
  withMetaMask(config?: MetaMaskConfig): ConfigBuilder;
  withCoinbase(config?: CoinbaseConfig): ConfigBuilder;  
  withPhantom(config?: PhantomConfig): ConfigBuilder;
  withSeedPhrase(config: SeedPhraseConfig): ConfigBuilder;
  withNetwork(config: NetworkConfig): ConfigBuilder;
  withLocalNode(config: NodeConfig): ConfigBuilder;
  build(): WalletConfig;
}
```

### Validation Strategy
- Validate configuration at build time
- Provide clear error messages for invalid configurations
- Support partial configurations with sensible defaults
- Allow runtime configuration updates where appropriate

## Extension Points

### Custom Wallet Support
```typescript
interface WalletImplementation {
  setup(): Promise<void>;
  handleAction(action: ActionType): Promise<void>;
  cleanup(): Promise<void>;
}

// Plugin registration pattern
registerWalletType('custom', CustomWalletImpl);
```

### Custom Action Types
```typescript
enum CustomActionType {
  CUSTOM_OPERATION = 'custom_operation'
}

// Extend base action types
type AllActionTypes = BaseActionType | CustomActionType;
```

### Hook System
```typescript
interface TestHooks {
  beforeWalletSetup?: () => Promise<void>;
  afterWalletSetup?: () => Promise<void>;
  beforeTest?: () => Promise<void>;
  afterTest?: () => Promise<void>;
}
```

## Error Handling API

### Error Types
```typescript
class OnchainTestKitError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public context?: Record<string, any>
  ) {
    super(message);
  }
}

enum ErrorCode {
  WALLET_CONNECTION_FAILED = 'wallet_connection_failed',
  TRANSACTION_REJECTED = 'transaction_rejected',
  NETWORK_ERROR = 'network_error',
  CONFIG_INVALID = 'config_invalid'
}
```

### Error Recovery
- Provide retry mechanisms for transient failures
- Clear error messages with actionable suggestions
- Context information for debugging
- Graceful degradation when possible

## Performance Considerations

### Lazy Loading
- Load wallet extensions only when needed
- Defer node startup until required
- Cache expensive operations appropriately
- Implement proper resource cleanup

### Resource Management
```typescript
interface ResourceManager {
  acquire<T>(resource: Resource<T>): Promise<T>;
  release<T>(resource: Resource<T>): Promise<void>;
  cleanup(): Promise<void>;
}
```

## Testing the API

### Contract Testing
- Test public API contracts
- Validate type definitions
- Test error conditions
- Performance benchmarking

### Integration Testing
- Test with real wallet extensions
- Cross-browser compatibility
- Network integration testing
- CI/CD pipeline validation

## Documentation Requirements

### API Documentation
- JSDoc comments for all public APIs
- Usage examples for complex operations
- Migration guides for version updates
- Performance characteristics documentation

### Type Documentation
- Document type relationships
- Provide usage examples for complex types
- Document generic constraints
- Explain conditional type behavior

## Versioning Strategy

### Semantic Versioning
- Major: Breaking API changes
- Minor: New features, backward compatible
- Patch: Bug fixes, no API changes

### Deprecation Process
1. Mark as deprecated with `@deprecated` JSDoc
2. Provide alternative in deprecation notice
3. Log warnings in development mode
4. Remove in next major version

## Security Considerations

### API Surface Security
- Validate all input parameters
- Sanitize configuration values
- Prevent code injection in CLI tools
- Secure handling of sensitive data

### Extension Security
- Verify extension integrity
- Validate extension permissions
- Secure communication channels
- Audit third-party dependencies

This API design ensures OnchainTestKit remains powerful, flexible, and easy to use while maintaining backward compatibility and supporting future extensibility needs.