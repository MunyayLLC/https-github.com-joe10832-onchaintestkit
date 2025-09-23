import { configure, createOnchainTest } from "../dist/index.js"

// Example: Fork Mode Configuration
console.log("Fork Mode Example - Creating configuration...")

// Fork from Ethereum mainnet for testing with real data
const forkConfig = configure()
  .withLocalNode({
    fork: "https://eth-mainnet.g.alchemy.com/v2/demo", // Use your own API key
    forkBlockNumber: 18500000, // Optional: fork from specific block for reproducible tests
    chainId: 1,
    port: 8545,
    accounts: 10, // Number of test accounts
    balance: "100000000000000000000", // 100 ETH per account
  })
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: "test test test test test test test test test test test junk",
    password: "testpassword",
  })
  .withNetwork({
    name: "Forked Ethereum Mainnet",
    rpcUrl: "http://localhost:8545",
    chainId: 1,
    symbol: "ETH",
  })
  .build()

console.log("Fork configuration created successfully!")
console.log("Config:", JSON.stringify(forkConfig, null, 2))

// Example: Different Networks
const polygonForkConfig = configure()
  .withLocalNode({
    fork: "https://polygon-mainnet.g.alchemy.com/v2/demo", // Use your own API key
    chainId: 137,
    port: 8546, // Different port for parallel testing
  })
  .withMetaMask()
  .withNetwork({
    name: "Forked Polygon",
    rpcUrl: "http://localhost:8546",
    chainId: 137,
    symbol: "MATIC",
  })
  .build()

console.log("Polygon fork configuration created successfully!")

// Test creating onchain test with fork mode
try {
  const _forkTest = createOnchainTest(forkConfig)
  console.log("Fork mode test created successfully!")
  console.log("You can now test with real mainnet contracts and data!")
} catch (error) {
  console.error("Error creating fork mode test:", error)
}