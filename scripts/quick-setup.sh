#!/bin/bash

# Quick Copilot Setup Script
# Runs the essential setup commands in the correct order
# Based on .github/copilot-instructions.md

set -e

echo "🔧 Running Copilot Setup Steps..."
echo "================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "\n${GREEN}▶ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ  $1${NC}"
}

# Essential Commands (Always run in this order)
print_step "Step 1: Install dependencies (required first)"
npm install

print_step "Step 2: Build the project (required before testing)"
npm run build

print_step "Step 3: Run linter (fix issues before committing)"
npm run lint

print_step "Step 4: Format code"
npm run format || print_info "Format warnings (extension files) are safe to ignore"

print_step "Step 5: Run tests"
npm run test

print_step "Step 6: Prepare wallet extensions"
print_info "Preparing MetaMask (works correctly)..."
npm run prepare-metamask

print_info "Preparing Coinbase (currently broken - zip returns invalid files)..."
npm run prepare-coinbase || print_info "Coinbase preparation failed (known issue)"

print_info "Preparing Phantom (currently broken - zip returns invalid files)..."
npm run prepare-phantom || print_info "Phantom preparation failed (known issue)"

print_step "Optional: Clean build artifacts"
npm run clean || print_info "Clean command not available"

echo ""
echo "✅ Copilot setup completed!"
echo "   Development environment is ready for blockchain testing."
echo ""
echo "📖 Next steps:"
echo "   - Review .github/copilot-instructions.md for detailed guidance"
echo "   - Check AGENTS.md, CLAUDE.md, GEMINI.md for AI-specific instructions"
echo "   - Run ./scripts/validate-setup.sh for comprehensive validation"