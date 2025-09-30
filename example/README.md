# Onchain Test Kit Examples

This directory contains practical examples demonstrating how to set up and use the Onchain Test Kit with different configurations and agents.

## Quick Setup for Examples

### Prerequisites
```bash
# Ensure you're in the project root
cd /path/to/onchaintestkit

# Install dependencies and build
npm install
npm run build

# Prepare wallet extensions
npm run prepare-metamask  # Required for testing

# Set up environment variables
cp .env.example .env
# Edit .env to add your test seed phrase:
# E2E_TEST_SEED_PHRASE="test test test test test test test test test test test junk"
nano .env   # Or use your preferred editor (vim, code, etc.)
```

### Running the Examples

#### Fork Mode Example
Demonstrates testing against forked Ethereum mainnet:
```bash
node example/fork-mode-example.js
```

#### Test Configuration Example  
Shows basic test setup patterns:
```bash
node example/test-config.js
```

## Agent-Specific Example Usage

### With GitHub Copilot
1. Open this directory in your IDE with Copilot enabled
2. Review the example patterns to understand the project structure
3. Use Copilot suggestions when modifying examples
4. Follow the existing configuration patterns for consistent results

### With Claude AI
1. Analyze the fork-mode-example.js for comprehensive blockchain testing patterns
2. Consider edge cases like network failures, block number selection, and gas optimization
3. Plan comprehensive test scenarios using the provided patterns
4. Focus on cross-chain compatibility and wallet-specific behaviors

### With Gemini AI
1. Start with the simplest example (test-config.js) for rapid understanding
2. Quickly prototype new test scenarios based on existing patterns
3. Iterate and optimize for performance and user experience
4. Focus on creating streamlined, efficient test configurations

## Example Patterns

### Basic Configuration
```typescript
import { configure, createOnchainTest } from '@coinbase/onchaintestkit';

const config = configure()
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: process.env.E2E_TEST_SEED_PHRASE,
    password: 'PASSWORD'
  })
  .build();
```

### Fork Mode Configuration
```typescript
const forkConfig = configure()
  .withLocalNode({
    fork: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    forkBlockNumber: 18500000, // Specific block for reproducibility
    chainId: 1,
  })
  .withMetaMask()
  .build();
```

### Multi-Network Configuration
```typescript
import { baseSepolia } from 'viem/chains';

const networkConfig = configure()
  .withMetaMask()
  .withSeedPhrase({ seedPhrase: '...', password: '...' })
  .withNetwork({
    name: baseSepolia.name,
    rpcUrl: baseSepolia.rpcUrls.default.http[0],
    chainId: baseSepolia.id,
    symbol: baseSepolia.nativeCurrency.symbol,
  })
  .build();
```

## Common Issues and Solutions

### Extension Not Found
```bash
# Ensure MetaMask extension is prepared
npm run prepare-metamask

# Verify extension exists
ls -la ./e2e/extensions/metamask/
```

### Environment Variables Missing
```bash
# Set required environment variables
cp .env.example .env
# Edit .env to add your test seed phrase:
# E2E_TEST_SEED_PHRASE="your test seed phrase"
nano .env   # Or use your preferred editor (vim, code, etc.)

# Never use real funds - test phrases only!
```

### Build Issues
```bash
# Clean and rebuild if having issues
npm run clean
npm run build
npm run test
```

## Next Steps

After running these examples:
1. **Review the main documentation**: Check README.md for comprehensive setup
2. **Read agent instructions**: See AGENTS.md, CLAUDE.md, or GEMINI.md for agent-specific guidance
3. **Explore instruction files**: Check `.github/instructions/` for specialized development guidance
4. **Start building**: Create your own test configurations based on these patterns

For more detailed setup instructions, see:
- `.github/copilot-instructions.md` - Comprehensive GitHub Copilot setup
- `AGENTS.md` - General agent setup and configuration
- `.github/instructions/development.instructions.md` - Development environment setup
- `.github/instructions/testing.instructions.md` - Testing setup and strategies