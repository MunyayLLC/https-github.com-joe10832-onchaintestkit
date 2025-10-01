import { expect, test } from "@playwright/test"
import { configure } from "../../src/configBuilder"

test.describe("Configuration Builder", () => {
  test("should configure MetaMask with seed phrase", () => {
    const config = configure()
      .withMetaMask()
      .withSeedPhrase({
        seedPhrase: "test seed phrase for testing purposes only",
        password: "PASSWORD123",
      })
      .withNetwork({
        name: "Base Sepolia",
        rpcUrl: "https://sepolia.base.org",
        chainId: 84532,
        symbol: "ETH",
      })
      .build()

    expect(config.wallets.metamask).toBeDefined()
    expect(config.wallets.metamask?.type).toBe("metamask")
    expect(config.wallets.metamask?.password).toBe("PASSWORD123")
  })

  test("should configure Coinbase Wallet with private key", () => {
    const config = configure()
      .withCoinbase()
      .withPrivateKey({
        privateKey:
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        password: "PASSWORD123",
        name: "Test Account",
      })
      .withNetwork({
        name: "Base Sepolia",
        rpcUrl: "https://sepolia.base.org",
        chainId: 84532,
        symbol: "ETH",
      })
      .build()

    expect(config.wallets.coinbase).toBeDefined()
    expect(config.wallets.coinbase?.type).toBe("coinbase")
    expect(config.wallets.coinbase?.password).toBe("PASSWORD123")
  })

  test("should configure Phantom Wallet", () => {
    const config = configure()
      .withPhantom()
      .withSeedPhrase({
        seedPhrase: "test seed phrase for testing purposes only",
        password: "PASSWORD123",
      })
      .withNetwork({
        name: "Ethereum Mainnet",
        rpcUrl: "https://ethereum.rpc.url",
        chainId: 1,
        symbol: "ETH",
      })
      .build()

    expect(config.wallets.phantom).toBeDefined()
    expect(config.wallets.phantom?.type).toBe("phantom")
  })

  test("should configure local node with fork mode", () => {
    const config = configure()
      .withLocalNode({
        fork: "https://eth-mainnet.g.alchemy.com/v2/api-key",
        forkBlockNumber: 18500000,
        chainId: 1,
        accounts: 10,
        balance: "100000000000000000000", // 100 ETH
      })
      .withMetaMask()
      .build()

    expect(config.nodeConfig).toBeDefined()
    expect(config.nodeConfig?.fork).toBe(
      "https://eth-mainnet.g.alchemy.com/v2/api-key",
    )
    expect(config.nodeConfig?.forkBlockNumber).toBe(18500000)
  })

  test("should throw error when wallet type is not specified", () => {
    expect(() => {
      configure().build()
    }).toThrow("Wallet type must be specified")
  })

  test("should allow chaining multiple configuration methods", () => {
    const config = configure()
      .withLocalNode({
        accounts: 5,
        balance: "1000000000000000000000", // 1000 ETH
      })
      .withMetaMask()
      .withSeedPhrase({
        seedPhrase: "test seed phrase for testing purposes only",
        password: "PASSWORD123",
      })
      .withNetwork({
        name: "Test Network",
        rpcUrl: "https://test.rpc.url",
        chainId: 1337,
        symbol: "TEST",
      })
      .build()

    expect(config.wallets.metamask).toBeDefined()
    expect(config.nodeConfig).toBeDefined()
    expect(config.nodeConfig?.accounts).toBe(5)
  })
})
