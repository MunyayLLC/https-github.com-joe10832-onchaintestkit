import { BrowserContext } from "@playwright/test"
import { ActionOptions, BaseActionType, BaseWallet } from "../BaseWallet"

export enum CoinbaseSpecificActionType {
  ADD_NETWORK = "addNetwork",
}

export class CoinbaseWallet extends BaseWallet {
  constructor(context: BrowserContext) {
    super(context, "Coinbase Wallet")
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
   * Handle Coinbase Wallet connection to DApp
   * Coinbase has different UX patterns from MetaMask
   */
  private async handleConnect(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting connection process`)

      // Wait for Coinbase popup - uses different URL pattern
      const popup = await this.waitForPopup(timeout, "coinbase")
      console.log(`${this.walletName}: Popup detected`)

      if (shouldApprove) {
        // Coinbase-specific selectors and flow
        // Try different possible selectors for Coinbase connect
        try {
          await popup
            .getByTestId("coinbase-connect-approve")
            .click({ timeout: 5000 })
        } catch {
          // Fallback to role-based selection
          await popup
            .getByRole("button", { name: /connect|approve/i })
            .click({ timeout: 10000 })
        }
        console.log(`${this.walletName}: Connection approved`)
      } else {
        await popup
          .getByRole("button", { name: /cancel|reject|decline/i })
          .click()
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
   * Handle Coinbase Wallet disconnection from DApp
   */
  private async handleDisconnect(options: ActionOptions): Promise<void> {
    const { timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting disconnection process`)

      const popup = await this.waitForPopup(timeout, "coinbase")

      await popup.getByRole("button", { name: /disconnect/i }).click()

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Disconnection completed`)
    } catch (error) {
      console.error(`${this.walletName}: Disconnection failed`, error)
      throw error
    }
  }

  /**
   * Handle Coinbase Wallet transaction - may have longer timeout requirements
   */
  private async handleTransaction(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 45000 } = options // Longer default timeout

    try {
      console.log(`${this.walletName}: Starting transaction handling`)

      const popup = await this.waitForPopup(timeout, "coinbase")

      // Coinbase may have simplified gas handling
      if (shouldApprove) {
        await popup.getByRole("button", { name: /send|confirm/i }).click()
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
   * Handle Coinbase Wallet signature request
   */
  private async handleSignature(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting signature handling`)

      const popup = await this.waitForPopup(timeout, "coinbase")

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
   * Handle Coinbase Wallet network switching
   */
  private async handleSwitchNetwork(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, chainId } = options

    try {
      console.log(
        `${this.walletName}: Starting network switch${
          chainId ? ` to chainId ${chainId}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "coinbase")

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
   * Handle adding a new network to Coinbase Wallet
   */
  private async handleAddNetwork(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting add network process`)

      const popup = await this.waitForPopup(timeout, "coinbase")

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
   * Handle token spending approval in Coinbase Wallet
   */
  private async handleTokenApproval(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, amount } = options

    try {
      console.log(
        `${this.walletName}: Starting token approval${
          amount ? ` for amount ${amount}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "coinbase")

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
   * Handle adding a new token to Coinbase Wallet
   */
  private async handleAddToken(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, tokenConfig } = options

    try {
      console.log(
        `${this.walletName}: Starting add token process${
          tokenConfig ? ` for ${tokenConfig.symbol}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "coinbase")

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

export { CoinbaseFixturesBuilder } from "./fixtures"
