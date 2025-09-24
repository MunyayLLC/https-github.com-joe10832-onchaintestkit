# Onchain Test Kit

Onchain Test Kit is a TypeScript library for end-to-end testing of blockchain applications, powered by Playwright. It provides testing infrastructure for multiple wallet types (MetaMask, Coinbase Wallet, Phantom) with support for fork mode testing against real blockchain networks.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- **Bootstrap, build, and test the repository:**
  - `npm install` -- installs dependencies. Takes ~60 seconds.
  - `npm run build` -- builds TypeScript to JavaScript. Takes ~1.5 seconds.
  - `npm run lint` -- runs Biome linter. Takes ~0.2 seconds.
  - `npm run format` -- runs Biome formatter. Takes ~0.2 seconds.

- **Development workflow:**
  - ALWAYS run bootstrapping steps first before making changes.
  - Build the project after TypeScript changes: `npm run build`
  - Test your changes by running example configurations: `node example/test-config.js` or `node example/fork-mode-example.js`
  - ALWAYS run `npm run lint` and `npm run format` before committing (CI will fail otherwise).

- **Testing and validation:**
  - No unit tests exist currently - validate changes using example files.
  - Run `node example/test-config.js` to validate basic configuration.
  - Run `node example/fork-mode-example.js` to validate fork mode.
  - ALWAYS manually test wallet configuration creation after making changes to configBuilder.ts.

## Key Dependencies and Requirements

- **Node.js** -- Project uses Node.js 20+. Already available.
- **npm** -- Primary package manager (yarn configuration exists but is incomplete).
- **Foundry/Anvil** -- Required for fork mode but NOT available in this environment. Document fork mode limitations.
- **Playwright** -- Used for browser automation, already included in dependencies.
- **Biome** -- Used for linting and formatting instead of ESLint/Prettier.

## Build Process Details

- **Build command:** `npm run build` 
  - Compiles TypeScript using `tsc -p tsconfig.build.json`
  - Takes ~1.5 seconds
  - Output goes to `dist/` directory
  - NEVER CANCEL this command

- **All available npm scripts:**
  - `npm run clean` -- removes dist directory
  - `npm run build` -- build TypeScript (~1.5s)
  - `npm run format` -- format code with Biome (~0.2s)
  - `npm run format:check` -- check formatting (~0.2s) 
  - `npm run lint` -- lint code with Biome (~0.2s)
  - `npm run lint:fix` -- auto-fix lint issues (~0.2s)
  - `npm run lint:unsafe` -- apply unsafe lint fixes
  - `npm run test` -- run Playwright tests (currently no tests)
  - `npm run prepare-metamask` -- placeholder CLI tool
  - `npm run prepare-coinbase` -- placeholder CLI tool  
  - `npm run prepare-phantom` -- placeholder CLI tool
  - `npm run prepublishOnly` -- runs clean && build for publishing

## Exact Timeout Values and Timing Expectations

- **Build operations - NEVER CANCEL:**
  - `npm install`: ~60 seconds (first time), ~10 seconds (subsequent)
  - `npm run build`: ~1.5 seconds - NEVER CANCEL, use timeout of 60+ seconds
  - `npm run lint`: ~0.2 seconds 
  - `npm run format`: ~0.2 seconds

- **Example validation - NEVER CANCEL:**
  - `node example/test-config.js`: ~2-3 seconds
  - `node example/fork-mode-example.js`: ~2-3 seconds
  - Manual validation scenarios: ~5 seconds

## Validation Scenarios

After making changes to the codebase, ALWAYS run these validation scenarios in order:

1. **Build and Lint Validation (CRITICAL - run first):**
   ```bash
   npm run build && npm run lint && npm run format:check
   ```
   All should complete without errors in ~2 seconds total.

2. **Basic Configuration Test:**
   ```bash
   node example/test-config.js
   ```
   Expected output: "Configuration created successfully!" and "Onchain test created successfully!"

3. **Fork Mode Test:**
   ```bash
   node example/fork-mode-example.js
   ```
   Expected output: Fork and polygon configurations created, "Fork mode test created successfully!"

4. **Complete Manual Test Scenario (COMPREHENSIVE):**
   Create a comprehensive test file that validates all wallet types:
   ```javascript
   import { configure, createOnchainTest, BaseActionType } from './dist/index.js';
   
   // Test all wallet configurations
   const metamaskConfig = configure().withMetaMask().withSeedPhrase({...}).build();
   const coinbaseConfig = configure().withCoinbase().withSeedPhrase({...}).build();
   const phantomConfig = configure().withPhantom().withSeedPhrase({...}).build();
   
   // Test fork mode
   const forkConfig = configure().withLocalNode({fork: "...", chainId: 1}).build();
   
   // Validate test creation
   const tests = [metamaskConfig, coinbaseConfig, phantomConfig, forkConfig]
     .map(config => createOnchainTest(config));
   
   console.log("All validations passed!");
   ```

5. **Configuration API Validation:**
   Test that the fluent builder API works correctly:
   ```bash
   node -e "const {configure} = require('./dist/index.js'); console.log('API check:', typeof configure().withMetaMask)"
   ```
   Should output: "API check: function"

## When to Run Each Validation

- **After TypeScript changes:** Always run build + lint + examples
- **After configBuilder.ts changes:** Run all validation scenarios
- **After wallet implementation changes:** Run manual test scenario + examples  
- **Before committing:** Run build + lint + format (CI will fail otherwise)
- **After dependency changes:** Run npm install + build + all examples

## Important Files and Locations

- **Core Configuration:** `src/configBuilder.ts` -- Main fluent API for configuration
- **Test Creation:** `src/createOnchainTest.ts` -- Creates Playwright test instances  
- **Entry Point:** `src/index.ts` -- Main exports for the library
- **Wallet Implementations:** `src/wallets/` -- MetaMask, Coinbase, Phantom wallet classes
- **Node Management:** `src/node/` -- Local node and network interception
- **CLI Tools:** `src/cli/` -- Placeholder preparation scripts for wallets
- **Examples:** `example/` -- Working configuration examples
- **Documentation:** `docs/node/` -- MDX documentation for fork mode

## Fork Mode Limitations

- Fork mode requires Foundry/Anvil which is NOT available in this environment
- LocalNodeManager in `src/node/LocalNodeManager.ts` is a stub implementation
- Fork mode configurations can be created but won't actually start local nodes
- Document this limitation in instructions but still support the configuration API

## Linting and Formatting

- Uses **Biome** (not ESLint/Prettier)
- Configuration in `biome.json`
- ALWAYS run before committing:
  - `npm run lint` -- checks for issues
  - `npm run format` -- fixes formatting
  - `npm run lint:fix` -- auto-fixes linting issues where possible

## Common Tasks

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository root directory listing
```
ls -la
.git/
.github/
.gitignore
README.md
biome.json           # Biome linter/formatter config
docs/                # Documentation (MDX files)
example/             # Working example configurations
package-lock.json    # npm lockfile
package.json         # Project configuration
src/                 # TypeScript source code
tsconfig.build.json  # Build-specific TypeScript config
tsconfig.json        # Main TypeScript config
```

### Source code structure
```
src/
├── configBuilder.ts     # Main fluent configuration API
├── createOnchainTest.ts # Creates Playwright test instances  
├── index.ts            # Main library exports
├── types.ts            # Core type definitions
├── constants.ts        # Project constants
├── wallets/            # Wallet implementations
│   ├── BaseWallet.ts   # Abstract base class & action types
│   ├── types.ts        # Wallet-specific type definitions
│   ├── MetaMask/       # MetaMask wallet implementation
│   ├── Coinbase/       # Coinbase Wallet implementation
│   └── Phantom/        # Phantom Wallet implementation
├── node/               # Local node management
│   ├── LocalNodeManager.ts    # Node lifecycle (stub)
│   ├── NetworkInterceptor.ts  # RPC URL interception
│   └── types.ts               # Node configuration types
├── contracts/          # Smart contract utilities
│   └── SmartContractManager.ts
└── cli/                # CLI preparation tools (placeholders)
    ├── prepare-metamask.mjs
    ├── prepare-coinbase.mjs
    └── prepare-phantom.mjs
```

### Adding new wallet support:
1. Create new wallet class in `src/wallets/NewWallet/`
2. Add fixture builder
3. Update `src/configBuilder.ts` with new builder methods
4. Add exports in `src/index.ts`
5. Test with example configuration

### Modifying configuration API:
1. Update `src/configBuilder.ts`
2. Update TypeScript types in `src/wallets/types.ts`
3. Run build and test with examples
4. Update documentation if needed

### Working with network configuration:
- Check `src/node/NetworkInterceptor.ts` for RPC interception logic
- Local node configurations go through `src/node/LocalNodeManager.ts`
- Network configurations handled in wallet-specific builders

## Package Information

- **Package name:** `@coinbase/onchaintestkit`
- **Current version:** 1.2.0
- **Main entry:** `dist/index.js`
- **Types:** `dist/index.d.ts`
- **CLI binaries:** prepare-metamask, prepare-coinbase, prepare-phantom (placeholders)

## Troubleshooting

- **"Module type not specified" warning:** Normal for example files, can be ignored
- **Yarn commands fail:** Project primarily uses npm, yarn setup is incomplete
- **No tests found:** Expected - project has no Playwright test files currently
- **Fork mode doesn't start nodes:** Expected - Foundry not available in environment

## Architecture Overview

```
src/
├── configBuilder.ts     -- Main configuration API
├── createOnchainTest.ts -- Test instance creation  
├── index.ts            -- Library exports
├── types.ts            -- Core type definitions
├── wallets/            -- Wallet implementations
│   ├── BaseWallet.ts   -- Abstract base class
│   ├── MetaMask/       -- MetaMask implementation
│   ├── Coinbase/       -- Coinbase Wallet implementation  
│   └── Phantom/        -- Phantom Wallet implementation
├── node/               -- Local node management
├── contracts/          -- Smart contract utilities
└── cli/                -- CLI preparation tools
```

The library uses a fluent builder pattern: `configure().withMetaMask().withNetwork().build()`