import { test as base } from "@playwright/test"
import { NodeConfig } from "../../node/types"
import { OnchainFixtures } from "../../types"
import { PhantomConfig } from "../types"
import { PhantomWallet } from "./index"

export function PhantomFixturesBuilder(
  _config: PhantomConfig,
  _nodeConfig?: NodeConfig,
) {
  return base.extend<OnchainFixtures>({
    phantom: async ({ context }, use) => {
      const phantom = new PhantomWallet(context)
      await use(phantom)
    },
  })
}
