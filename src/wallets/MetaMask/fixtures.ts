import { test as base } from "@playwright/test"
import { NodeConfig } from "../../node/types"
import { OnchainFixtures } from "../../types"
import { MetaMaskConfig } from "../types"
import { MetaMask } from "./index"

export function MetaMaskFixturesBuilder(
  _config: MetaMaskConfig,
  _nodeConfig?: NodeConfig,
) {
  return base.extend<OnchainFixtures>({
    metamask: async ({ context }, use) => {
      const metamask = new MetaMask(context)
      await use(metamask)
    },
  })
}
