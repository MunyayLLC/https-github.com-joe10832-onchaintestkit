#!/usr/bin/env node

import { execFileSync } from "child_process"
import path from "path"

console.log("Preparing Phantom Wallet for testing...")

// Execute the shell script for Phantom Wallet preparation
const scriptPath = path.join(process.cwd(), "src", "cli", "prepare-phantom.sh")
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
  console.error("Failed to prepare Phantom Wallet:", error.message)
  process.exit(1)
}
