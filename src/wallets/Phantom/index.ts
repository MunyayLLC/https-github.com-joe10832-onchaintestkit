import { BrowserContext } from "@playwright/test"
import { ActionOptions, BaseActionType, BaseWallet } from "../BaseWallet"

export enum PhantomSpecificActionType {
  ADD_NETWORK = "addNetwork",
  SOLANA_TRANSACTION = "solanaTransaction",
  SIGN_MESSAGE = "signMessage",
}

// Additional action types specific to Phantom's multi-chain support
export type PhantomActionType =
  | BaseActionType
  | "solanaTransaction"
  | "signMessage"

export class PhantomWallet extends BaseWallet {
  constructor(context: BrowserContext) {
    super(context, "Phantom")
  }

  async handleAction(
    action: BaseActionType,
    options: ActionOptions = {},
  ): Promise<void> {
    console.log(`${this.walletName} handleAction: ${action}`, options)

    switch (action) {
      case "connect":
        return this.handleConnect(options)
      case "disconnect":
        return this.handleDisconnect(options)
      case "transaction":
        return this.handleTransaction(options)
      case "signature":
        return this.handleSignature(options)
      case "switchNetwork":
        return this.handleSwitchNetwork(options)
      case "addNetwork":
        return this.handleAddNetwork(options)
      case "tokenApproval":
        return this.handleTokenApproval(options)
      case "addToken":
        return this.handleAddToken(options)
      default:
        throw new Error(`Unsupported action: ${action}`)
    }
  }

  /**
   * Handle Phantom-specific action types (including Solana-specific actions)
   */
  async handlePhantomAction(
    action: PhantomActionType,
    options: ActionOptions = {},
  ): Promise<void> {
    console.log(`${this.walletName} handlePhantomAction: ${action}`, options)

    switch (action) {
      case "solanaTransaction":
        return this.handleSolanaTransaction(options)
      case "signMessage":
        return this.handleSignMessage(options)
      default:
        // Delegate to base action handler
        return this.handleAction(action as BaseActionType, options)
    }
  }

  /**
   * Handle Phantom connection to DApp
   * Phantom supports both Solana and Ethereum chains
   */
  private async handleConnect(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, chainId } = options

    try {
      console.log(
        `${this.walletName}: Starting connection process${
          chainId ? ` for chainId ${chainId}` : ""
        }`,
      )

      // Wait for Phantom popup - uses different URL pattern
      const popup = await this.waitForPopup(timeout, "phantom")
      console.log(`${this.walletName}: Popup detected`)

      if (shouldApprove) {
        // Phantom-specific connection flow
        await popup.getByRole("button", { name: /connect|approve/i }).click()
        console.log(`${this.walletName}: Connection approved`)
      } else {
        await popup.getByRole("button", { name: /cancel|reject/i }).click()
        console.log(`${this.walletName}: Connection rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Connection completed`)
    } catch (error) {
      console.error(`${this.walletName}: Connection failed`, error)
      throw error
    }
  }

  /**
   * Handle Phantom disconnection from DApp
   */
  private async handleDisconnect(options: ActionOptions): Promise<void> {
    const { timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting disconnection process`)

      const popup = await this.waitForPopup(timeout, "phantom")

      await popup.getByRole("button", { name: /disconnect/i }).click()

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Disconnection completed`)
    } catch (error) {
      console.error(`${this.walletName}: Disconnection failed`, error)
      throw error
    }
  }

  /**
   * Handle Phantom transaction (Ethereum-style)
   * Optimized for fast transaction processing
   */
  private async handleTransaction(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting EVM transaction handling`)

      const popup = await this.waitForPopup(timeout, "phantom")

      if (shouldApprove) {
        await popup
          .getByRole("button", { name: /approve|confirm|send/i })
          .click()
        console.log(`${this.walletName}: Transaction confirmed`)
      } else {
        await popup.getByRole("button", { name: /reject|cancel/i }).click()
        console.log(`${this.walletName}: Transaction rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Transaction handling completed`)
    } catch (error) {
      console.error(`${this.walletName}: Transaction handling failed`, error)
      throw error
    }
  }

  /**
   * Handle Solana-specific transaction
   * Different from EVM transactions - Solana-first design
   */
  private async handleSolanaTransaction(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting Solana transaction handling`)

      const popup = await this.waitForPopup(timeout, "phantom")

      if (shouldApprove) {
        // Solana-specific transaction handling
        await popup.getByText("Approve").click()
        console.log(`${this.walletName}: Solana transaction approved`)
      } else {
        await popup.getByText("Reject").click()
        console.log(`${this.walletName}: Solana transaction rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Solana transaction completed`)
    } catch (error) {
      console.error(`${this.walletName}: Solana transaction failed`, error)
      throw error
    }
  }

  /**
   * Handle Phantom signature request
   */
  private async handleSignature(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting signature handling`)

      const popup = await this.waitForPopup(timeout, "phantom")

      if (shouldApprove) {
        await popup.getByRole("button", { name: /sign/i }).click()
        console.log(`${this.walletName}: Signature approved`)
      } else {
        await popup.getByRole("button", { name: /cancel|reject/i }).click()
        console.log(`${this.walletName}: Signature rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Signature handling completed`)
    } catch (error) {
      console.error(`${this.walletName}: Signature handling failed`, error)
      throw error
    }
  }

  /**
   * Handle Phantom-specific message signing (different from signature)
   */
  private async handleSignMessage(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting message signing`)

      const popup = await this.waitForPopup(timeout, "phantom")

      if (shouldApprove) {
        await popup.getByText(/sign message/i).click()
        console.log(`${this.walletName}: Message signing approved`)
      } else {
        await popup.getByText(/cancel|reject/i).click()
        console.log(`${this.walletName}: Message signing rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Message signing completed`)
    } catch (error) {
      console.error(`${this.walletName}: Message signing failed`, error)
      throw error
    }
  }

  /**
   * Handle Phantom network switching (multi-chain support)
   */
  private async handleSwitchNetwork(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, chainId } = options

    try {
      console.log(
        `${this.walletName}: Starting network switch${
          chainId ? ` to chainId ${chainId}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "phantom")

      if (shouldApprove) {
        await popup.getByRole("button", { name: /switch|approve/i }).click()
        console.log(`${this.walletName}: Network switch approved`)
      } else {
        await popup.getByRole("button", { name: /cancel|reject/i }).click()
        console.log(`${this.walletName}: Network switch rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Network switch completed`)
    } catch (error) {
      console.error(`${this.walletName}: Network switch failed`, error)
      throw error
    }
  }

  /**
   * Handle adding a new network to Phantom
   */
  private async handleAddNetwork(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting add network process`)

      const popup = await this.waitForPopup(timeout, "phantom")

      if (shouldApprove) {
        await popup.getByRole("button", { name: /approve|add/i }).click()
        console.log(`${this.walletName}: Network addition approved`)
      } else {
        await popup.getByRole("button", { name: /cancel|reject/i }).click()
        console.log(`${this.walletName}: Network addition rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Add network completed`)
    } catch (error) {
      console.error(`${this.walletName}: Add network failed`, error)
      throw error
    }
  }

  /**
   * Handle token spending approval in Phantom
   */
  private async handleTokenApproval(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, amount } = options

    try {
      console.log(
        `${this.walletName}: Starting token approval${
          amount ? ` for amount ${amount}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "phantom")

      if (shouldApprove) {
        await popup.getByRole("button", { name: /approve|confirm/i }).click()
        console.log(`${this.walletName}: Token approval confirmed`)
      } else {
        await popup.getByRole("button", { name: /reject|cancel/i }).click()
        console.log(`${this.walletName}: Token approval rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Token approval completed`)
    } catch (error) {
      console.error(`${this.walletName}: Token approval failed`, error)
      throw error
    }
  }

  /**
   * Handle adding a new token to Phantom
   */
  private async handleAddToken(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, tokenConfig } = options

    try {
      console.log(
        `${this.walletName}: Starting add token process${
          tokenConfig ? ` for ${tokenConfig.symbol}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "phantom")

      if (shouldApprove) {
        await popup.getByRole("button", { name: /add|import/i }).click()
        console.log(`${this.walletName}: Token addition approved`)
      } else {
        await popup.getByRole("button", { name: /cancel|reject/i }).click()
        console.log(`${this.walletName}: Token addition rejected`)
      }

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Add token completed`)
    } catch (error) {
      console.error(`${this.walletName}: Add token failed`, error)
      throw error
    }
  }
}

export { PhantomFixturesBuilder } from "./fixtures"
