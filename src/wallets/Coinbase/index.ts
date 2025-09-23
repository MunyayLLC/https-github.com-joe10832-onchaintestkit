import { BrowserContext } from "@playwright/test"
import { ActionOptions, BaseActionType, BaseWallet } from "../BaseWallet"

export enum CoinbaseSpecificActionType {
  ADD_NETWORK = "addNetwork",
}

export class CoinbaseWallet extends BaseWallet {
  private context: BrowserContext

  constructor(context: BrowserContext) {
    super()
    this.context = context
  }

  async handleAction(
    action: BaseActionType | string,
    options: ActionOptions = {},
  ): Promise<void> {
    console.log(`Coinbase handleAction: ${action}`, options)
    // Basic stub implementation - in real implementation this would handle Coinbase interactions
  }
}

export { CoinbaseFixturesBuilder } from "./fixtures"
