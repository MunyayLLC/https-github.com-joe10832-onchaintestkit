/**
 * Utility functions for handling connectors in wallet testing
 */

export interface Connector {
  id: string
  name: string
  type: "injected" | "walletConnect" | "coinbase" | "phantom"
  isExplorerWallet?: boolean
}

/**
 * Sorts connectors by putting explorer wallets first
 * This function already creates a copy of the array internally
 */
export function sortConnectorsByExplorerWallet(
  connectors: Connector[],
): Connector[] {
  // Create a copy internally to avoid mutating the original
  return [...connectors].sort((a, b) => {
    // Explorer wallets come first
    if (a.isExplorerWallet && !b.isExplorerWallet) return -1
    if (!a.isExplorerWallet && b.isExplorerWallet) return 1
    // Then sort by name
    return a.name.localeCompare(b.name)
  })
}

/**
 * Example function that demonstrates the unnecessary spread operation
 * This is the problematic pattern that needs to be fixed
 */
export function sortConnectorsWithUnnecessarySpread(
  connectors: Connector[],
): Connector[] {
  // FIXED: Removed unnecessary spread operation since sortConnectorsByExplorerWallet already creates a copy
  const sorted = sortConnectorsByExplorerWallet(connectors)
  return sorted
}

/**
 * The corrected version without unnecessary spread operation
 */
export function sortConnectorsOptimized(connectors: Connector[]): Connector[] {
  // No spread needed - the function already creates a copy internally
  const sorted = sortConnectorsByExplorerWallet(connectors)
  return sorted
}
