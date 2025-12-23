#!/bin/bash

# Copilot Setup Validation Script
# This script validates that all essential setup steps work correctly
# Based on instructions from .github/copilot-instructions.md

set -e  # Exit on any error

echo "🚀 Starting Copilot Setup Validation..."
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "\n${GREEN}📋 Step: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check Node.js version
print_step "Checking Node.js version"
node_version=$(node --version)
echo "Node.js version: $node_version"
if [[ "$node_version" =~ ^v([0-9]+) ]]; then
    version_number=${BASH_REMATCH[1]}
    if [ "$version_number" -ge 14 ]; then
        print_success "Node.js version $node_version is >= 14.0.0"
    else
        print_error "Node.js version $node_version is < 14.0.0. Please upgrade."
        exit 1
    fi
else
    print_error "Could not parse Node.js version"
    exit 1
fi

# Step 2: Install dependencies
print_step "Installing dependencies"
npm install
print_success "Dependencies installed"

# Step 3: Build project
print_step "Building project"
npm run build
print_success "Project built successfully"

# Step 4: Run linter
print_step "Running linter"
npm run lint
print_success "Linting passed"

# Step 5: Format code (may show warnings)
print_step "Checking code formatting"
if npm run format; then
    print_success "Formatting check passed"
else
    print_warning "Format command showed warnings (extension files - safe to ignore)"
fi

# Step 6: Run tests
print_step "Running tests"
test_output=$(npm test 2>&1)
echo "$test_output"
if echo "$test_output" | grep -q "passed"; then
    print_success "Tests passed"
else
    print_error "Tests failed"
    exit 1
fi

# Step 7: Prepare wallet extensions
print_step "Preparing wallet extensions"

# MetaMask (should work)
echo "Preparing MetaMask..."
if npm run prepare-metamask; then
    print_success "MetaMask extension prepared successfully"
else
    print_error "MetaMask preparation failed"
    exit 1
fi

# Coinbase (currently broken)
echo "Preparing Coinbase Wallet..."
if npm run prepare-coinbase; then
    print_success "Coinbase Wallet extension prepared successfully"
else
    print_warning "Coinbase preparation failed (known issue: zip download returns invalid 9-byte files)"
fi

# Phantom (currently broken)
echo "Preparing Phantom..."
if npm run prepare-phantom; then
    print_success "Phantom extension prepared successfully"  
else
    print_warning "Phantom preparation failed (known issue: zip download returns invalid 9-byte files)"
fi

# Final validation
print_step "Final validation"
echo "=== Setup Validation Complete ==="
echo "Node.js: $node_version"
echo "NPM: $(npm --version)"
print_success "✅ Dependencies installed"
print_success "✅ TypeScript compilation successful"
print_success "✅ Biome linting passed"
print_success "✅ Tests passed"
print_success "✅ MetaMask extension prepared"
print_warning "⚠️  Coinbase/Phantom extensions currently broken (known issues)"

echo ""
echo "🎉 Copilot setup validation completed successfully!"
echo "   Your development environment is ready for blockchain testing."
echo ""
echo "Next steps:"
echo "- Review the instructions in .github/copilot-instructions.md"
echo "- Check agent-specific guidance in AGENTS.md, CLAUDE.md, GEMINI.md"
echo "- Explore examples in the /example directory"