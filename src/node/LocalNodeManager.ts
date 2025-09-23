import { NodeConfig } from "./types"

export class LocalNodeManager {
  private config: NodeConfig
  public port = 8545

  constructor(config: NodeConfig = {}) {
    this.config = config
    this.port = config.port || 8545
  }

  async start(): Promise<void> {
    console.log(`Starting local node on port ${this.port}`)
    // Stub implementation - in real implementation this would start an Anvil node
  }

  async stop(): Promise<void> {
    console.log(`Stopping local node on port ${this.port}`)
    // Stub implementation - in real implementation this would stop the Anvil node
  }

  getPort(): number {
    return this.port
  }
}
