#!/usr/bin/env node

import { execFileSync } from "child_process"
import path from "path"

console.log("Preparing Coinbase Wallet for testing...")

// Execute the shell script for Coinbase Wallet preparation
const scriptPath = path.join(process.cwd(), "src", "cli", "prepare-coinbase.sh")
try {
  execFileSync("chmod", ["+x", scriptPath], {
    stdio: "inherit",
    cwd: process.cwd(),
  })
  execFileSync(scriptPath, [], {
    stdio: "inherit",
    cwd: process.cwd(),
  })
} catch (error) {
  console.error("Failed to prepare Coinbase Wallet:", error.message)
  process.exit(1)
}
