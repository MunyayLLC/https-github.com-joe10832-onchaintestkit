import { BrowserContext } from "@playwright/test"
import { ActionOptions, BaseActionType, BaseWallet } from "../BaseWallet"

export enum MetaMaskSpecificActionType {
  ADD_NETWORK = "addNetwork",
  IMPORT_TOKEN = "importToken",
}

export class MetaMask extends BaseWallet {
  constructor(context: BrowserContext) {
    super(context, "MetaMask")
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
   * Handle MetaMask connection to DApp
   */
  private async handleConnect(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting connection process`)

      // Wait for MetaMask popup
      const popup = await this.waitForPopup(timeout, "extension")
      console.log(`${this.walletName}: Popup detected`)

      if (shouldApprove) {
        // Try different possible button texts and selectors for MetaMask connection
        try {
          // Look for Next button first (account selection)
          await popup
            .getByRole("button", { name: /next/i })
            .click({ timeout: 5000 })
          console.log(`${this.walletName}: Next button clicked`)
        } catch {
          // Next button not found, continue
          console.log(
            `${this.walletName}: No Next button found, proceeding to connect`,
          )
        }

        // Click Connect button
        await popup
          .getByRole("button", { name: /connect/i })
          .click({ timeout: 10000 })
        console.log(`${this.walletName}: Connect button clicked`)
      } else {
        // Click Cancel or reject
        const cancelButton = popup.getByRole("button", {
          name: /cancel|reject/i,
        })
        await cancelButton.click()
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
   * Handle MetaMask disconnection from DApp
   */
  private async handleDisconnect(options: ActionOptions): Promise<void> {
    const { timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting disconnection process`)

      const popup = await this.waitForPopup(timeout, "extension")

      // Look for disconnect button
      await popup.getByRole("button", { name: /disconnect/i }).click()

      await popup.waitForEvent("close", { timeout })
      console.log(`${this.walletName}: Disconnection completed`)
    } catch (error) {
      console.error(`${this.walletName}: Disconnection failed`, error)
      throw error
    }
  }

  /**
   * Handle MetaMask transaction approval/rejection
   */
  private async handleTransaction(options: ActionOptions): Promise<void> {
    const {
      shouldApprove = true,
      timeout = 30000,
      gasLimit,
      gasPrice,
    } = options

    try {
      console.log(`${this.walletName}: Starting transaction handling`)

      const popup = await this.waitForPopup(timeout, "extension")

      // Handle advanced gas options if specified
      if (gasLimit || gasPrice) {
        try {
          // Click on advanced/edit gas options
          await popup
            .getByRole("button", { name: /edit|advanced/i })
            .click({ timeout: 5000 })

          if (gasLimit) {
            const gasLimitInput = popup.locator(
              'input[data-testid="gas-limit-input"], input[placeholder*="gas limit"]',
            )
            await gasLimitInput.fill(gasLimit)
          }

          if (gasPrice) {
            const gasPriceInput = popup.locator(
              'input[data-testid="gas-price-input"], input[placeholder*="gas price"]',
            )
            await gasPriceInput.fill(gasPrice)
          }
        } catch {
          console.log(
            `${this.walletName}: Gas options not available or already set`,
          )
        }
      }

      if (shouldApprove) {
        // Click Confirm button
        await popup.getByRole("button", { name: /confirm|send/i }).click()
        console.log(`${this.walletName}: Transaction confirmed`)
      } else {
        // Click Reject button
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
   * Handle MetaMask signature request
   */
  private async handleSignature(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000 } = options

    try {
      console.log(`${this.walletName}: Starting signature handling`)

      const popup = await this.waitForPopup(timeout, "extension")

      if (shouldApprove) {
        // Click Sign button
        await popup.getByRole("button", { name: /sign/i }).click()
        console.log(`${this.walletName}: Signature approved`)
      } else {
        // Click Cancel button
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
   * Handle MetaMask network switching
   */
  private async handleSwitchNetwork(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, chainId } = options

    try {
      console.log(
        `${this.walletName}: Starting network switch${
          chainId ? ` to chainId ${chainId}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "extension")

      if (shouldApprove) {
        // Click Switch network button
        await popup.getByRole("button", { name: /switch|approve/i }).click()
        console.log(`${this.walletName}: Network switch approved`)
      } else {
        // Click Cancel button
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
   * Handle adding a new network to MetaMask
   */
  private async handleAddNetwork(options: ActionOptions): Promise<void> {
    const {
      shouldApprove = true,
      timeout = 30000,
      requireConfirmation = false,
    } = options

    try {
      console.log(`${this.walletName}: Starting add network process`)

      const popup = await this.waitForPopup(timeout, "extension")

      if (shouldApprove) {
        // Click Approve/Add button
        await popup.getByRole("button", { name: /approve|add/i }).click()
        console.log(`${this.walletName}: Network addition approved`)

        // Handle additional confirmation if required
        if (requireConfirmation) {
          try {
            await popup
              .getByRole("button", { name: /switch|confirm/i })
              .click({ timeout: 5000 })
            console.log(`${this.walletName}: Network addition confirmed`)
          } catch {
            console.log(
              `${this.walletName}: No additional confirmation required`,
            )
          }
        }
      } else {
        // Click Cancel button
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
   * Handle token spending approval
   */
  private async handleTokenApproval(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, amount } = options

    try {
      console.log(
        `${this.walletName}: Starting token approval${
          amount ? ` for amount ${amount}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "extension")

      // Handle spending cap modification if amount is specified
      if (amount && shouldApprove) {
        try {
          // Look for edit spending cap or custom amount option
          await popup
            .getByRole("button", { name: /edit|custom/i })
            .click({ timeout: 5000 })

          const amountInput = popup.locator(
            'input[data-testid="custom-spending-cap"], input[placeholder*="amount"]',
          )
          await amountInput.fill(amount)

          // Confirm the custom amount
          await popup
            .getByRole("button", { name: /save|next/i })
            .click({ timeout: 5000 })
        } catch {
          console.log(`${this.walletName}: Custom amount setting not available`)
        }
      }

      if (shouldApprove) {
        // Click Approve button
        await popup.getByRole("button", { name: /approve|confirm/i }).click()
        console.log(`${this.walletName}: Token approval confirmed`)
      } else {
        // Click Reject button
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
   * Handle adding a new token to MetaMask
   */
  private async handleAddToken(options: ActionOptions): Promise<void> {
    const { shouldApprove = true, timeout = 30000, tokenConfig } = options

    try {
      console.log(
        `${this.walletName}: Starting add token process${
          tokenConfig ? ` for ${tokenConfig.symbol}` : ""
        }`,
      )

      const popup = await this.waitForPopup(timeout, "extension")

      if (shouldApprove) {
        // Click Add token button
        await popup.getByRole("button", { name: /add|import/i }).click()
        console.log(`${this.walletName}: Token addition approved`)
      } else {
        // Click Cancel button
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

export { MetaMaskFixturesBuilder } from "./fixtures"
