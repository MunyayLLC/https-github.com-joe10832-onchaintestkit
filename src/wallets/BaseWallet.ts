import { BrowserContext, Page } from "@playwright/test"
import { CoinbaseWallet } from "./Coinbase"
import { MetaMask } from "./MetaMask"
import { PhantomWallet } from "./Phantom"

// Core wallet action types as described in wallet integration instructions
export type BaseActionType =
  | "connect"
  | "disconnect"
  | "transaction"
  | "signature"
  | "switchNetwork"
  | "addNetwork"
  | "tokenApproval"
  | "addToken"

// Network configuration interface
export interface NetworkConfig {
  name: string
  rpcUrl: string
  chainId: number
  symbol: string
  blockExplorerUrl?: string
}

// Token configuration interface
export interface TokenConfig {
  address: string
  symbol: string
  decimals: number
  image?: string
}

// Comprehensive action options interface
export interface ActionOptions {
  shouldApprove?: boolean
  timeout?: number
  gasLimit?: string
  gasPrice?: string
  amount?: string
  chainId?: number
  networkConfig?: NetworkConfig
  tokenConfig?: TokenConfig
  requireConfirmation?: boolean
  [key: string]: unknown // Allow additional options
}

export type WalletSetupContext = { localNodePort: number }

export type BaseWalletConfig = {
  type: "metamask" | "coinbase" | "phantom"
  password?: string
  walletSetup?: (
    wallet: MetaMask | CoinbaseWallet | PhantomWallet,
    context: WalletSetupContext,
  ) => Promise<void>
}

export abstract class BaseWallet {
  protected context: BrowserContext
  protected walletName: string

  constructor(context: BrowserContext, walletName = "Unknown") {
    this.context = context
    this.walletName = walletName
  }

  /**
   * Handle wallet actions with comprehensive options support
   * @param action - The action type to perform
   * @param options - Configuration options for the action
   */
  abstract handleAction(
    action: BaseActionType,
    options?: ActionOptions,
  ): Promise<void>

  /**
   * Wait for a wallet popup window to appear
   * @param timeout - Maximum time to wait for popup (default: 30000ms)
   * @param walletIdentifier - String to identify the wallet popup URL
   * @returns Promise that resolves to the popup page
   */
  protected async waitForPopup(
    timeout = 30000,
    walletIdentifier?: string,
  ): Promise<Page> {
    const popup = await this.context.waitForEvent("page", {
      predicate: page => {
        if (walletIdentifier) {
          return page.url().includes(walletIdentifier)
        }
        // Default behavior - any new page that's not the main page
        return page !== this.context.pages()[0]
      },
      timeout,
    })

    await popup.waitForLoadState("domcontentloaded")
    return popup
  }

  /**
   * Handle action with retry logic for better reliability
   * @param action - The action to perform
   * @param options - Action options
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   */
  async handleActionWithRetry(
    action: BaseActionType,
    options: ActionOptions = {},
    maxRetries = 3,
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.handleAction(action, options)
        return // Success
      } catch (error) {
        if (attempt === maxRetries) {
          throw error // Final attempt failed
        }
        console.warn(
          `${this.walletName}: Attempt ${attempt} failed, retrying...`,
        )
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait before retry
      }
    }
  }
}
