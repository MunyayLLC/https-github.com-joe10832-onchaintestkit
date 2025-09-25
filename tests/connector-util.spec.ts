import { expect, test } from "@playwright/test"
import {
  type Connector,
  sortConnectorsByExplorerWallet,
  sortConnectorsOptimized,
  sortConnectorsWithoutUnnecessarySpread,
} from "../src/utils/ConnectorUtil"

test.describe("ConnectorUtil", () => {
  const mockConnectors: Connector[] = [
    {
      id: "metamask",
      name: "MetaMask",
      type: "injected",
      isExplorerWallet: false,
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      type: "coinbase",
      isExplorerWallet: true,
    },
    {
      id: "phantom",
      name: "Phantom",
      type: "phantom",
      isExplorerWallet: false,
    },
    {
      id: "explorer1",
      name: "Explorer Wallet 1",
      type: "walletConnect",
      isExplorerWallet: true,
    },
    {
      id: "explorer2",
      name: "A Explorer Wallet",
      type: "walletConnect",
      isExplorerWallet: true,
    },
  ]

  test("sortConnectorsByExplorerWallet should create a copy internally", () => {
    const original = [...mockConnectors]
    const sorted = sortConnectorsByExplorerWallet(mockConnectors)

    // Original array should not be mutated
    expect(mockConnectors).toEqual(original)

    // Explorer wallets should come first
    const explorerWallets = sorted.filter(c => c.isExplorerWallet)
    const nonExplorerWallets = sorted.filter(c => !c.isExplorerWallet)

    expect(explorerWallets.length).toBe(3)
    expect(nonExplorerWallets.length).toBe(2)

    // First connectors should be explorer wallets
    expect(sorted.slice(0, 3).every(c => c.isExplorerWallet)).toBe(true)
    // Last connectors should be non-explorer wallets
    expect(sorted.slice(3).every(c => !c.isExplorerWallet)).toBe(true)
  })

  test("corrected approach should work correctly", () => {
    const original = [...mockConnectors]

    // Both methods should produce the same result
    const withSpread = sortConnectorsWithoutUnnecessarySpread(mockConnectors)
    const optimized = sortConnectorsOptimized(mockConnectors)

    expect(withSpread).toEqual(optimized)

    // Original should remain unchanged in both cases
    expect(mockConnectors).toEqual(original)
  })

  test("demonstrate performance difference (conceptual)", () => {
    // This test demonstrates the concept - both functions use the corrected approach
    // but we compare them for consistency
    const connectors = Array.from({ length: 1000 }, (_, i) => ({
      id: `connector-${i}`,
      name: `Connector ${i}`,
      type: "injected" as const,
      isExplorerWallet: i % 3 === 0,
    }))

    // The corrected version (without unnecessary spread) for comparison:
    // This function calls sortConnectorsByExplorerWallet directly which creates one copy
    const start1 = Date.now()
    const withSpread = sortConnectorsWithoutUnnecessarySpread(connectors)
    const time1 = Date.now() - start1

    // The optimized version creates only one copy:
    // 1. sortConnectorsByExplorerWallet creates the copy internally
    const start2 = Date.now()
    const optimized = sortConnectorsOptimized(connectors)
    const time2 = Date.now() - start2

    // Results should be identical
    expect(withSpread).toEqual(optimized)

    // Log the performance difference (both should perform similarly)
    console.log(`Without spread: ${time1}ms, Optimized: ${time2}ms`)

    // Both versions should perform similarly since they use the corrected approach
    expect(time2).toBeLessThanOrEqual(time1 + 5) // Allow 5ms tolerance
  })
})
