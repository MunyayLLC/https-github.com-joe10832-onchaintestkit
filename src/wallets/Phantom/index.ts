import { BrowserContext } from "@playwright/test"
import { ActionOptions, BaseActionType, BaseWallet } from "../BaseWallet"

export enum PhantomSpecificActionType {
  ADD_NETWORK = "addNetwork",
}

export class PhantomWallet extends BaseWallet {
  private context: BrowserContext

  constructor(context: BrowserContext) {
    super()
    this.context = context
  }

  async handleAction(
    action: BaseActionType | string,
    options: ActionOptions = {},
  ): Promise<void> {
    console.log(`Phantom handleAction: ${action}`, options)
    // Basic stub implementation - in real implementation this would handle Phantom interactions
  }
}

export { PhantomFixturesBuilder } from "./fixtures"
