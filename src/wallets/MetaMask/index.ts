import { BrowserContext } from "@playwright/test"
import { ActionOptions, BaseActionType, BaseWallet } from "../BaseWallet"

export enum MetaMaskSpecificActionType {
  ADD_NETWORK = "addNetwork",
}

export class MetaMask extends BaseWallet {
  private context: BrowserContext

  constructor(context: BrowserContext) {
    super()
    this.context = context
  }

  async handleAction(
    action: BaseActionType | string,
    options: ActionOptions = {},
  ): Promise<void> {
    console.log(`MetaMask handleAction: ${action}`, options)
    // Basic stub implementation - in real implementation this would handle MetaMask interactions
  }
}

export { MetaMaskFixturesBuilder } from "./fixtures"
