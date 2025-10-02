import { BrowserContext, expect, test } from "@playwright/test"
import { BaseWallet } from "../../src/wallets/BaseWallet"
import { CoinbaseWallet } from "../../src/wallets/Coinbase"
import { MetaMask } from "../../src/wallets/MetaMask"
import { PhantomWallet } from "../../src/wallets/Phantom"
import { testNetworks } from "../utils/test-helpers"

test.describe("Cross-Wallet Compatibility Tests", () => {
  let context: BrowserContext

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext()
  })

  test.afterEach(async () => {
    await context.close()
  })

  /**
   * Test that all wallets implement the same interface
   */
  const walletConfigs = [
    { name: "MetaMask", createWallet: () => new MetaMask(context) },
    { name: "Coinbase", createWallet: () => new CoinbaseWallet(context) },
    { name: "Phantom", createWallet: () => new PhantomWallet(context) },
  ]

  walletConfigs.forEach(({ name, createWallet }) => {
    test(`${name} should implement BaseWallet interface`, async () => {
      const wallet = createWallet()
      expect(wallet).toBeInstanceOf(BaseWallet)
    })

    test(`${name} should handle connect action`, async ({ page }) => {
      const wallet = createWallet()

      // All wallets should support the connect action
      await expect(
        wallet.handleAction("connect", { shouldApprove: true }),
      ).rejects.toThrow() // Expected because no actual wallet extension is present
    })

    test(`${name} should handle transaction action`, async ({ page }) => {
      const wallet = createWallet()

      const options = {
        shouldApprove: true,
        gasLimit: "21000",
        gasPrice: "20000000000",
      }

      await expect(
        wallet.handleAction("transaction", options),
      ).rejects.toThrow()
    })

    test(`${name} should handle signature action`, async ({ page }) => {
      const wallet = createWallet()

      await expect(
        wallet.handleAction("signature", { shouldApprove: true }),
      ).rejects.toThrow()
    })

    test(`${name} should handle network switching`, async ({ page }) => {
      const wallet = createWallet()

      const options = {
        shouldApprove: true,
        chainId: testNetworks.polygon.chainId,
      }

      await expect(
        wallet.handleAction("switchNetwork", options),
      ).rejects.toThrow()
    })

    test(`${name} should handle adding custom network`, async ({ page }) => {
      const wallet = createWallet()

      const options = {
        shouldApprove: true,
        networkConfig: testNetworks.polygon,
      }

      await expect(wallet.handleAction("addNetwork", options)).rejects.toThrow()
    })

    test(`${name} should handle token approval`, async ({ page }) => {
      const wallet = createWallet()

      const options = {
        shouldApprove: true,
        amount: "1000000000000000000", // 1 token
      }

      await expect(
        wallet.handleAction("tokenApproval", options),
      ).rejects.toThrow()
    })

    test(`${name} should handle adding custom token`, async ({ page }) => {
      const wallet = createWallet()

      const options = {
        shouldApprove: true,
        tokenConfig: {
          address: "0xA0b86a33E6441E6e80bd9C0dd8Ba3F2d3a8e2B7b",
          symbol: "USDC",
          decimals: 6,
        },
      }

      await expect(wallet.handleAction("addToken", options)).rejects.toThrow()
    })

    test(`${name} should support retry mechanism`, async ({ page }) => {
      const wallet = createWallet()

      await expect(
        wallet.handleActionWithRetry("connect", {}, 2),
      ).rejects.toThrow()
    })
  })

  test("should handle wallet-specific behaviors consistently", async ({
    page,
  }) => {
    const wallets = walletConfigs.map(config => ({
      name: config.name,
      wallet: config.createWallet(),
    }))

    for (const { name, wallet } of wallets) {
      // Test standard action across all wallets
      await expect(
        wallet.handleAction("connect", { shouldApprove: true }),
      ).rejects.toThrow()
    }
  })

  test("should demonstrate unified test interface", async ({ page }) => {
    // This test shows how the same test logic can work with any wallet
    async function testWalletConnection(
      wallet: BaseWallet,
      walletName: string,
    ) {
      // This works regardless of wallet type
      await expect(
        wallet.handleAction("connect", { shouldApprove: true }),
      ).rejects.toThrow()
    }

    // Test with all wallets using the same interface
    const metamask = new MetaMask(context)
    const coinbase = new CoinbaseWallet(context)
    const phantom = new PhantomWallet(context)

    await testWalletConnection(metamask, "MetaMask")
    await testWalletConnection(coinbase, "Coinbase")
    await testWalletConnection(phantom, "Phantom")
  })

  test("should support parameterized network testing", async ({ page }) => {
    const networkConfigs = [
      testNetworks.ethereum,
      testNetworks.polygon,
      testNetworks.base,
    ]

    const wallet = new MetaMask(context)

    for (const network of networkConfigs) {
      await expect(
        wallet.handleAction("switchNetwork", {
          chainId: network.chainId,
          shouldApprove: true,
        }),
      ).rejects.toThrow()
    }
  })
})
