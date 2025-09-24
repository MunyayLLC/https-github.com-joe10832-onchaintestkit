#!/bin/bash

# Coinbase Wallet Extension Preparation Script
# This script downloads and sets up Coinbase Wallet extension for testing

set -euo pipefail

# Configuration
COINBASE_VERSION="2.28.0"
DOWNLOAD_URL="https://github.com/coinbase/coinbase-wallet-extension/releases/download/v${COINBASE_VERSION}/coinbase-wallet-${COINBASE_VERSION}.zip"
DEFAULT_TARGET_DIR="./e2e/extensions/coinbase"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if TARGET_DIR is provided as argument
TARGET_DIR="${1:-$DEFAULT_TARGET_DIR}"

print_info "Coinbase Wallet preparation starting..."
print_info "Target directory: $TARGET_DIR"

# Security check: Prevent dangerous directory operations
# Fixed: Use $HOME instead of "~" for proper home directory comparison
if [[ -z "$TARGET_DIR" || "$TARGET_DIR" == "/" || "$TARGET_DIR" == "$HOME" || "$TARGET_DIR" == "." || "$TARGET_DIR" == ".." ]]; then
    print_error "Invalid or dangerous target directory: $TARGET_DIR"
    print_error "Please specify a safe target directory for Coinbase Wallet extension"
    exit 1
fi

# Create target directory if it doesn't exist
print_info "Creating target directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

# Check if Coinbase Wallet extension already exists
if [[ -d "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION" ]]; then
    print_warn "Coinbase Wallet extension already exists in $TARGET_DIR"
    read -p "Do you want to re-download? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping download, using existing Coinbase Wallet extension"
        exit 0
    fi
    rm -rf "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION"
fi

# Download Coinbase Wallet extension
print_info "Downloading Coinbase Wallet extension v$COINBASE_VERSION..."
if command -v curl >/dev/null 2>&1; then
    curl -L -o "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION.zip" "$DOWNLOAD_URL"
elif command -v wget >/dev/null 2>&1; then
    wget -O "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION.zip" "$DOWNLOAD_URL"
else
    print_error "Neither curl nor wget found. Please install one of them to download Coinbase Wallet extension."
    exit 1
fi

# Extract the extension
print_info "Extracting Coinbase Wallet extension..."
if command -v unzip >/dev/null 2>&1; then
    unzip -q "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION.zip" -d "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION"
    rm "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION.zip"
else
    print_error "unzip command not found. Please install unzip to extract the extension."
    exit 1
fi

# Verify extraction
if [[ -d "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION" && -f "$TARGET_DIR/coinbase-wallet-$COINBASE_VERSION/manifest.json" ]]; then
    print_info "Coinbase Wallet extension prepared successfully!"
    print_info "Extension location: $TARGET_DIR/coinbase-wallet-$COINBASE_VERSION"
else
    print_error "Failed to extract Coinbase Wallet extension properly"
    exit 1
fi

print_info "Coinbase Wallet preparation completed successfully!"