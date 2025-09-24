#!/usr/bin/env node

import { execFileSync } from "child_process"
import path from "path"

console.log("Preparing MetaMask for testing...")

// Execute the shell script for MetaMask preparation
const scriptPath = path.join(process.cwd(), "src", "cli", "prepare-metamask.sh")
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
  console.error("Failed to prepare MetaMask:", error.message)
  process.exit(1)
}
