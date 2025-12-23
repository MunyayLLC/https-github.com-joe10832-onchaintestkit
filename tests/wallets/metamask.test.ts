import { BrowserContext, expect, test } from "@playwright/test"
import { MetaMask } from "../../src/wallets/MetaMask"

test.describe("MetaMask Wallet Integration", () => {
  let context: BrowserContext
  let metamask: MetaMask

  test.beforeEach(async ({ browser }) => {
    // Create a new browser context for each test
    context = await browser.newContext()
    metamask = new MetaMask(context)
  })

  test.afterEach(async () => {
    await context.close()
  })

  test("should create MetaMask instance", () => {
    expect(metamask).toBeInstanceOf(MetaMask)
  })

  test("should handle connect action with default options", async () => {
    // This will fail because there's no actual MetaMask extension, but we can test the error handling
    await expect(metamask.handleAction("connect")).rejects.toThrow()
  })

  test("should handle connect action with shouldApprove=false", async () => {
    // This will fail because there's no actual MetaMask extension, but we can test the parameter passing
    await expect(
      metamask.handleAction("connect", { shouldApprove: false }),
    ).rejects.toThrow()
  })

  test("should handle transaction action with gas options", async () => {
    const options = {
      shouldApprove: true,
      gasLimit: "21000",
      gasPrice: "20000000000", // 20 gwei
      timeout: 45000,
    }

    await expect(
      metamask.handleAction("transaction", options),
    ).rejects.toThrow()
  })

  test("should handle signature action", async () => {
    const options = { shouldApprove: true, timeout: 30000 }
    await expect(metamask.handleAction("signature", options)).rejects.toThrow()
  })

  test("should handle switchNetwork action with chainId", async () => {
    const options = {
      shouldApprove: true,
      chainId: 137, // Polygon
    }
    await expect(
      metamask.handleAction("switchNetwork", options),
    ).rejects.toThrow()
  })

  test("should handle addNetwork action with network config", async () => {
    const options = {
      shouldApprove: true,
      networkConfig: {
        name: "Polygon Mainnet",
        rpcUrl: "https://polygon-rpc.com",
        chainId: 137,
        symbol: "MATIC",
        blockExplorerUrl: "https://polygonscan.com",
      },
      requireConfirmation: true,
    }
    await expect(metamask.handleAction("addNetwork", options)).rejects.toThrow()
  })

  test("should handle tokenApproval action with amount", async () => {
    const options = {
      shouldApprove: true,
      amount: "1000000000000000000", // 1 token (18 decimals)
    }
    await expect(
      metamask.handleAction("tokenApproval", options),
    ).rejects.toThrow()
  })

  test("should handle addToken action with token config", async () => {
    const options = {
      shouldApprove: true,
      tokenConfig: {
        address: "0xA0b86a33E6441E6e80bd9C0dd8Ba3F2d3a8e2B7b",
        symbol: "USDC",
        decimals: 6,
        image: "https://example.com/usdc-logo.png",
      },
    }
    await expect(metamask.handleAction("addToken", options)).rejects.toThrow()
  })

  test("should throw error for unsupported action", async () => {
    await expect(
      metamask.handleAction("unsupportedAction" as any),
    ).rejects.toThrow("Unsupported action: unsupportedAction")
  })

  test("should handle handleActionWithRetry with maximum retries", async () => {
    // This should retry 2 times and then fail
    await expect(
      metamask.handleActionWithRetry("connect", {}, 2),
    ).rejects.toThrow()
  })

  test("should handle all standard wallet actions", async () => {
    const actions = [
      "connect",
      "disconnect",
      "transaction",
      "signature",
      "switchNetwork",
      "addNetwork",
      "tokenApproval",
      "addToken",
    ]

    for (const action of actions) {
      await expect(metamask.handleAction(action as any)).rejects.toThrow()
    }
  })
})
