#!/usr/bin/env node

import { spawnSync } from "child_process"
import path from "path"

console.log("Preparing Coinbase Wallet for testing...")

// Execute the shell script for Coinbase Wallet preparation
const scriptPath = path.join(process.cwd(), "src", "cli", "prepare-coinbase.sh")
try {
  const chmodResult = spawnSync('chmod', ['+x', scriptPath], {
    stdio: "inherit",
    cwd: process.cwd(),
  })
  if (chmodResult.error) {
    throw chmodResult.error
  }
  
  const scriptResult = spawnSync(scriptPath, [], {
    stdio: "inherit",
    cwd: process.cwd(),
  })
  if (scriptResult.error) {
    throw scriptResult.error
  }
} catch (error) {
  console.error("Failed to prepare Coinbase Wallet:", error.message)
  process.exit(1)
}
