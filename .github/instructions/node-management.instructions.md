# Node Management Instructions

## Overview
Instructions for managing local blockchain nodes and fork mode testing within OnchainTestKit.

## Local Node Configuration

### Basic Node Setup
```typescript
const config = configure()
  .withLocalNode({
    port: 8545,
    chainId: 1337,
    accounts: 10,
    balance: '100000000000000000000', // 100 ETH per account
    gasPrice: '20000000000', // 20 gwei
    gasLimit: '30000000'
  })
  .build();
```

### Fork Mode Configuration
```typescript
const config = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
    forkBlockNumber: 18500000, // Optional: specific block number
    chainId: 1,
    port: 8545,
    accounts: 5,
    balance: '1000000000000000000000' // 1000 ETH per account
  })
  .build();
```

## Node Management Patterns

### Lifecycle Management
- Node startup and shutdown handling
- Port management and conflicts
- Process cleanup on test completion
- Resource monitoring

### Network Interception
Use `setupRpcPortInterceptor` for dynamic port management:
```typescript
import { setupRpcPortInterceptor } from '@coinbase/onchaintestkit';

// Setup automatic port forwarding
setupRpcPortInterceptor(page, actualPort);
```

## Fork Mode Best Practices

### Block Number Selection
- Use recent but stable block numbers
- Account for state that tests depend on
- Consider contract deployment block numbers
- Balance between freshness and stability

### RPC Provider Selection
- Use reliable providers (Alchemy, Infura, QuickNode)
- Implement rate limiting awareness
- Handle provider downtime gracefully
- Consider geographic latency

### State Management
- Pre-fund test accounts appropriately
- Set up required contract state
- Handle state dependencies between tests
- Clean up or isolate test state

## Performance Optimization

### Node Configuration
```typescript
// Optimized for fast testing
const config = configure()
  .withLocalNode({
    fork: rpcUrl,
    accounts: 3, // Fewer accounts for faster startup
    balance: '100000000000000000000', // Sufficient for testing
    gasPrice: '1000000000', // 1 gwei for speed
    blockTime: 0, // Instant mining
    gasLimit: '30000000'
  })
  .build();
```

### Memory Management
- Monitor node memory usage
- Restart nodes for long test suites
- Use appropriate cache settings
- Clean up blockchain state

## Network Configuration

### Multi-Network Support
```typescript
// Support multiple networks in configuration
const config = configure()
  .withNetwork({
    name: 'Local Fork',
    rpcUrl: 'http://localhost:8545',
    chainId: 1,
    symbol: 'ETH'
  })
  .build();
```

### Network Switching
- Handle network switching in tests
- Verify network state after switches
- Test cross-network scenarios
- Handle network-specific features

## Debugging

### Node Issues
- Check port availability
- Monitor node logs
- Verify fork URL accessibility
- Check account funding

### Network Problems
- Validate RPC connectivity
- Monitor transaction pool
- Check block production
- Verify network parameters

## Common Configurations

### DeFi Testing
```typescript
// Configuration for DeFi protocol testing
const config = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY',
    forkBlockNumber: 18500000, // Block with good DeFi state
    chainId: 1,
    accounts: 10,
    balance: '10000000000000000000000', // 10,000 ETH for large operations
    gasLimit: '30000000' // High gas limit for complex transactions
  })
  .build();
```

### NFT Testing
```typescript
// Configuration for NFT marketplace testing
const config = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY',
    forkBlockNumber: 18500000,
    chainId: 1,
    accounts: 5,
    balance: '100000000000000000000', // 100 ETH per account
    gasPrice: '20000000000' // Standard gas price
  })
  .build();
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Use different ports for parallel tests
2. **Fork URL issues**: Verify API key and URL format
3. **Block number problems**: Use recent but stable blocks
4. **Memory issues**: Restart nodes periodically
5. **Network timeouts**: Increase timeout values
6. **State inconsistencies**: Use proper test isolation