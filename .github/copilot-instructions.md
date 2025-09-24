# Onchain Test Kit

End-to-end testing toolkit for blockchain applications, powered by Playwright. This is a TypeScript/Node.js library that provides wallet automation and blockchain testing capabilities.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Setup
- Install Node.js 14+ (current: Node v20.19.5, npm 10.8.2)
- Enable corepack for yarn 4.9.2: `corepack enable`
- Install dependencies: `npm install` -- takes 60 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
- Install Foundry (external dependency): Manual installation required with `curl -L https://foundry.paradigm.xyz | bash` followed by `foundryup`

### Build and Development
- Build the project: `npm run build` -- takes 2 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Clean build artifacts: `npm run clean` -- instant
- Format code: `npm run format` -- takes 3ms. Uses Biome formatter.
- Check formatting: `npm run format:check` -- takes 3ms
- Lint code: `npm run lint` -- takes 8ms. Uses Biome linter. 
- Fix lint issues: `npm run lint:fix` -- takes 11ms
- Fix unsafe lint issues: `npm run lint:unsafe` -- takes 11ms

### Testing and Examples
- Run tests: `npm run test` -- Currently no tests exist, Playwright returns "No tests found"
- Test configuration: `node example/test-config.js` -- Validates basic configuration setup
- Test fork mode: `node example/fork-mode-example.js` -- Validates fork mode configuration with different networks

### CLI Tools
- Prepare MetaMask: `npm run prepare-metamask` or `node src/cli/prepare-metamask.mjs` -- Placeholder CLI tool
- Prepare Coinbase: `npm run prepare-coinbase` or `node src/cli/prepare-coinbase.mjs` -- Placeholder CLI tool  
- Prepare Phantom: `npm run prepare-phantom` or `node src/cli/prepare-phantom.mjs` -- Placeholder CLI tool

## Validation
- ALWAYS run `npm run build && npm run lint && npm run format:check` before committing changes
- ALWAYS test example scripts: `node example/test-config.js && node example/fork-mode-example.js`
- ALWAYS validate CLI tools work: `npm run prepare-metamask`
- Build and lint are very fast (2 seconds and 8ms respectively) - run them frequently during development

### Manual Testing Scenarios
After making changes, always validate core functionality with these scenarios:

1. **Basic Configuration Test**: Create MetaMask, Coinbase, and Phantom configurations
2. **Fork Mode Test**: Configure local node with fork settings for different networks
3. **Network Configuration Test**: Verify custom network settings work correctly
4. **CLI Tools Test**: Ensure all prepare-* commands execute without errors

## Common Tasks

### Repository Structure
```
├── .github/                 # GitHub configuration (created for instructions)
├── README.md               # Main documentation
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript base config
├── tsconfig.build.json     # TypeScript build config
├── biome.json              # Biome linter/formatter config
├── src/                    # Main source code
│   ├── index.ts           # Main exports
│   ├── configBuilder.ts   # Configuration builder
│   ├── createOnchainTest.ts # Test creation
│   ├── cli/               # CLI tools (prepare-*)
│   ├── wallets/           # Wallet implementations
│   ├── node/              # Node/networking utilities
│   └── contracts/         # Contract utilities
├── example/                # Example usage
│   ├── test-config.js     # Basic configuration example
│   └── fork-mode-example.js # Fork mode example
├── docs/                   # Documentation
│   └── node/              # Node-specific documentation
└── dist/                   # Built output (after npm run build)
```

### Key Files to Check When Making Changes
- Always check `src/index.ts` for exports after adding new functionality
- Always check `package.json` scripts section for build/test commands
- Always check `biome.json` for linting rules
- Always update `README.md` if changing public APIs
- Always test examples in `example/` directory after changes

### Package.json Key Details
```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "packageManager": "yarn@4.9.2",
  "peerDependencies": {
    "@playwright/test": "^1.34.0"
  }
}
```

### Dependencies and External Tools
- **Required**: Node.js 14+, Playwright for testing
- **Recommended**: Foundry for blockchain development (manual install required)
- **Build tools**: TypeScript, Biome (linter/formatter)
- **Package manager**: npm (primary), yarn 4.9.2 (configured but not required)

### Fork Mode and Blockchain Testing
- Fork mode allows testing against real blockchain data by forking mainnet or other networks
- Supports multiple wallet types: MetaMask, Coinbase Wallet, Phantom
- Uses Viem chains for network configuration
- Local Anvil nodes can be configured with custom settings (port, accounts, balance, etc.)

### Development Workflows

#### Making Code Changes
1. Make your changes to files in `src/`
2. Run `npm run build` to compile TypeScript (2 seconds)
3. Run `npm run lint:fix` to auto-fix linting issues (11ms)
4. Test with examples: `node example/test-config.js`
5. Verify exports work: Check `src/index.ts` for proper exports

#### Adding New Wallet Support
1. Create new wallet class in `src/wallets/`
2. Add wallet type to `src/wallets/types.ts`
3. Update `src/configBuilder.ts` to add `.withNewWallet()` method
4. Export new classes in `src/index.ts`
5. Add CLI tool in `src/cli/prepare-newwallet.mjs`
6. Update `package.json` bin section
7. Test with example configuration

#### Adding New Features
1. Implement feature in appropriate `src/` subdirectory
2. Add TypeScript types to relevant `types.ts` file
3. Update configuration builder if needed
4. Export public APIs in `src/index.ts`
5. Add example usage to `example/` directory
6. Update README.md with new feature documentation

### Testing Your Changes
Run this complete validation sequence:
```bash
npm run clean && npm run build && npm run lint && npm run format:check && node example/test-config.js && node example/fork-mode-example.js && npm run prepare-metamask
```

This takes about 5 seconds total and validates the entire development pipeline.

### Fork Mode and Blockchain Testing
- Fork mode allows testing against real blockchain data by forking mainnet or other networks
- Supports multiple wallet types: MetaMask, Coinbase Wallet, Phantom
- Uses Viem chains for network configuration
- Local Anvil nodes can be configured with custom settings (port, accounts, balance, etc.)

## Troubleshooting

### Common Issues
1. **Module type warnings**: Examples show ES module syntax but package.json doesn't specify "type": "module" - this is expected behavior
2. **No tests found**: Repository has Playwright configured but no actual test files exist yet
3. **Foundry installation**: Cannot be automated, requires manual installation via curl command
4. **Yarn lockfile errors**: Use npm install instead, yarn 4.9.2 is configured but not required for development

### Performance Notes
- Build is very fast (2 seconds)
- Linting is extremely fast (8ms)  
- Formatting is extremely fast (3ms)
- Example scripts run instantly
- No long-running operations except dependency installation

### Environment Requirements
- Works on Linux/Unix environments
- Requires internet access for blockchain fork mode (RPC endpoints)
- No special firewall or security requirements identified