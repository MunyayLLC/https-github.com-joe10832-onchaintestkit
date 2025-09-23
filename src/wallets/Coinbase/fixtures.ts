import { test as base } from "@playwright/test"
import { NodeConfig } from "../../node/types"
import { OnchainFixtures } from "../../types"
import { CoinbaseConfig } from "../types"
import { CoinbaseWallet } from "./index"

export function CoinbaseFixturesBuilder(
  _config: CoinbaseConfig,
  _nodeConfig?: NodeConfig,
) {
  return base.extend<OnchainFixtures>({
    coinbase: async ({ context }, use) => {
      const coinbase = new CoinbaseWallet(context)
      await use(coinbase)
    },
  })
}
