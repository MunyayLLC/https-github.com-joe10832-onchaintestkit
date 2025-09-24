# Wallet Development Instructions

## Overview
This file provides instructions for developing and maintaining wallet integrations within the OnchainTestKit.

## Wallet Implementation Structure

### Required Files
Each wallet implementation should include:
1. `index.ts` - Main wallet class implementation
2. `fixtures.ts` - Playwright fixtures for the wallet
3. Extension preparation scripts in `src/cli/`

### Base Wallet Pattern
All wallets should extend or implement patterns from `BaseWallet`:

```typescript
class WalletImplementation extends BaseWallet {
  // Implement required methods
  async handleAction(action: ActionType): Promise<void> {
    // Action handling logic
  }
}
```

## Action Types

### Common Actions (BaseActionType)
- `CONNECT_TO_DAPP` - Connect wallet to application
- `APPROVE_TRANSACTION` - Approve blockchain transaction
- `REJECT_TRANSACTION` - Reject blockchain transaction  
- `APPROVE_TOKEN` - Approve token spending
- `SWITCH_NETWORK` - Switch to different blockchain network
- `SIGN_MESSAGE` - Sign a message with the wallet

### Wallet-Specific Actions
Each wallet can define additional actions beyond the base set:
- MetaMask: Standard Ethereum operations
- Coinbase: Coinbase-specific features
- Phantom: Solana-specific operations

## Implementation Guidelines

### Error Handling
- Use descriptive error messages
- Include context about the failed operation
- Implement timeout handling for UI operations
- Provide fallback mechanisms where possible

### Selector Management
- Use data attributes when available
- Implement fallback selectors for robustness
- Document selector strategies in code comments
- Regular updates for UI changes

### Extension Management
- Download verification and integrity checks
- Version management for extensions
- Safe extraction and installation procedures
- Cleanup of temporary files

## Testing Considerations

### Page Object Patterns
- Separate page interactions from test logic
- Use descriptive method names for wallet operations
- Implement wait strategies for dynamic content
- Handle popup windows and context switching

### Network Handling
- Test with multiple networks
- Verify network switching functionality
- Handle network-specific transaction formats
- Account for different gas calculation methods

## Maintenance

### Version Updates
- Monitor wallet extension releases
- Update download URLs and checksums
- Test compatibility with new versions
- Document breaking changes

### Browser Compatibility
- Test across different browser versions
- Handle browser-specific behavior differences
- Maintain compatibility with Playwright updates