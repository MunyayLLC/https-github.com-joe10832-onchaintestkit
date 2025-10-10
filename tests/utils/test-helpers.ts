import { Page } from "@playwright/test"
import { BaseWallet } from "../../src/wallets/BaseWallet"

/**
 * Test utilities for wallet integration testing
 * These utilities help with common test patterns described in testing instructions
 */

/**
 * Setup DApp connection flow for testing
 * @param page - Playwright page instance
 * @param wallet - Wallet instance (MetaMask, Coinbase, or Phantom)
 */
export async function setupDAppConnection(
  page: Page,
  wallet: BaseWallet,
): Promise<void> {
  await page.goto("http://localhost:3000")
  await page.getByTestId("connect-button").click()
  await wallet.handleAction("connect", { shouldApprove: true })
  // In real tests, this would verify the connection
  // await expect(page.getByTestId('wallet-connected')).toBeVisible();
}

/**
 * Approve token spending for testing
 * @param page - Playwright page instance
 * @param wallet - Wallet instance
 * @param amount - Token amount to approve
 */
export async function approveTokenSpending(
  page: Page,
  wallet: BaseWallet,
  amount: string,
): Promise<void> {
  await page.getByTestId("approve-button").click()
  await wallet.handleAction("tokenApproval", {
    shouldApprove: true,
    amount: amount,
  })
  // In real tests, this would verify the approval
  // await expect(page.getByTestId('approval-success')).toBeVisible();
}

/**
 * Handle wallet transaction flow
 * @param page - Playwright page instance
 * @param wallet - Wallet instance
 * @param options - Transaction options
 */
export async function handleWalletTransaction(
  page: Page,
  wallet: BaseWallet,
  options: {
    shouldApprove?: boolean
    gasLimit?: string
    gasPrice?: string
  } = {},
): Promise<void> {
  await page.getByTestId("send-transaction").click()
  await wallet.handleAction("transaction", {
    shouldApprove: true,
    ...options,
  })
  // In real tests, this would verify the transaction
  // await expect(page.getByTestId('transaction-success')).toBeVisible();
}

/**
 * Switch network in wallet
 * @param page - Playwright page instance
 * @param wallet - Wallet instance
 * @param chainId - Target chain ID
 * @param networkName - Display name of the network
 */
export async function switchWalletNetwork(
  page: Page,
  wallet: BaseWallet,
  chainId: number,
  networkName: string,
): Promise<void> {
  await page.getByTestId("network-switcher").click()
  await page.getByText(networkName).click()

  await wallet.handleAction("switchNetwork", {
    chainId,
    shouldApprove: true,
  })

  // In real tests, this would verify the network switch
  // await expect(page.getByText(`Connected to ${networkName}`)).toBeVisible();
}

/**
 * Add a custom network to wallet
 * @param page - Playwright page instance
 * @param wallet - Wallet instance
 * @param networkConfig - Network configuration
 */
export async function addCustomNetwork(
  page: Page,
  wallet: BaseWallet,
  networkConfig: {
    name: string
    rpcUrl: string
    chainId: number
    symbol: string
    blockExplorerUrl?: string
  },
): Promise<void> {
  await page.getByTestId("add-network-button").click()

  await wallet.handleAction("addNetwork", {
    shouldApprove: true,
    networkConfig,
    requireConfirmation: true,
  })

  // In real tests, this would verify the network was added
  // await expect(page.getByText(`${networkConfig.name} added`)).toBeVisible();
}

/**
 * Test configuration factory for different wallet types
 */
export const testConfigs = {
  /**
   * MetaMask configuration for local testing
   */
  metamaskLocal: {
    walletType: "metamask" as const,
    seedPhrase:
      "test seed phrase for testing purposes only never use with real funds",
    password: "PASSWORD123",
    network: {
      name: "Local Test Network",
      rpcUrl: "http://localhost:8545",
      chainId: 1337,
      symbol: "ETH",
    },
  },

  /**
   * MetaMask configuration for fork mode testing
   */
  metamaskFork: {
    walletType: "metamask" as const,
    seedPhrase:
      "test seed phrase for testing purposes only never use with real funds",
    password: "PASSWORD123",
    fork: {
      rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/api-key",
      forkBlockNumber: 18500000,
      chainId: 1,
    },
  },

  /**
   * Coinbase Wallet configuration
   */
  coinbaseLocal: {
    walletType: "coinbase" as const,
    privateKey:
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    password: "PASSWORD123",
    network: {
      name: "Local Test Network",
      rpcUrl: "http://localhost:8545",
      chainId: 1337,
      symbol: "ETH",
    },
  },

  /**
   * Phantom Wallet configuration
   */
  phantomLocal: {
    walletType: "phantom" as const,
    seedPhrase:
      "test seed phrase for testing purposes only never use with real funds",
    password: "PASSWORD123",
    network: {
      name: "Local Test Network",
      rpcUrl: "http://localhost:8545",
      chainId: 1337,
      symbol: "ETH",
    },
  },
}

/**
 * Common network configurations for testing
 */
export const testNetworks = {
  ethereum: {
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/api-key",
    chainId: 1,
    symbol: "ETH",
    blockExplorerUrl: "https://etherscan.io",
  },
  polygon: {
    name: "Polygon Mainnet",
    rpcUrl: "https://polygon-rpc.com",
    chainId: 137,
    symbol: "MATIC",
    blockExplorerUrl: "https://polygonscan.com",
  },
  base: {
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    chainId: 8453,
    symbol: "ETH",
    blockExplorerUrl: "https://basescan.org",
  },
  baseSepolia: {
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    chainId: 84532,
    symbol: "ETH",
    blockExplorerUrl: "https://sepolia.basescan.org",
  },
}

/**
 * Mock DApp for testing wallet interactions
 */
export class MockDApp {
  constructor(private page: Page) {}

  /**
   * Navigate to the mock DApp
   */
  async navigate(): Promise<void> {
    await this.page.goto("http://localhost:3000")
  }

  /**
   * Trigger wallet connection
   */
  async connectWallet(): Promise<void> {
    await this.page.getByTestId("connect-button").click()
  }

  /**
   * Send a transaction
   */
  async sendTransaction(amount?: string): Promise<void> {
    if (amount) {
      await this.page.getByTestId("amount-input").fill(amount)
    }
    await this.page.getByTestId("send-transaction").click()
  }

  /**
   * Approve token spending
   */
  async approveToken(amount?: string): Promise<void> {
    if (amount) {
      await this.page.getByTestId("approval-amount").fill(amount)
    }
    await this.page.getByTestId("approve-button").click()
  }

  /**
   * Switch network
   */
  async switchNetwork(networkName: string): Promise<void> {
    await this.page.getByTestId("network-switcher").click()
    await this.page.getByText(networkName).click()
  }

  /**
   * Sign a message
   */
  async signMessage(message?: string): Promise<void> {
    if (message) {
      await this.page.getByTestId("message-input").fill(message)
    }
    await this.page.getByTestId("sign-message").click()
  }
}
