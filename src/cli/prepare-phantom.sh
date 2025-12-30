#!/bin/bash

# Phantom Wallet Extension Preparation Script
# This script downloads and sets up Phantom Wallet extension for testing

set -euo pipefail

# Configuration
PHANTOM_VERSION="24.19.0"
DOWNLOAD_URL="https://github.com/phantom/phantom-wallet/releases/download/v${PHANTOM_VERSION}/phantom-chrome-${PHANTOM_VERSION}.zip"
DEFAULT_TARGET_DIR="./e2e/extensions/phantom"

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

print_info "Phantom Wallet preparation starting..."
print_info "Target directory: $TARGET_DIR"

# Security check: Prevent dangerous directory operations
# Fixed: Use $HOME instead of "~" for proper home directory comparison
if [[ -z "$TARGET_DIR" || "$TARGET_DIR" == "/" || "$TARGET_DIR" == "~" || "$TARGET_DIR" == "$HOME" || "$TARGET_DIR" == "." || "$TARGET_DIR" == ".." ]]; then
    print_error "Invalid or dangerous target directory: $TARGET_DIR"
    print_error "Please specify a safe target directory for Phantom Wallet extension"
    exit 1
fi

# Create target directory if it doesn't exist
print_info "Creating target directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

# Check if Phantom Wallet extension already exists
if [[ -d "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION" ]]; then
    print_warn "Phantom Wallet extension already exists in $TARGET_DIR"
    read -p "Do you want to re-download? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping download, using existing Phantom Wallet extension"
        exit 0
    fi
    rm -rf "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION"
fi

# Download Phantom Wallet extension
print_info "Downloading Phantom Wallet extension v$PHANTOM_VERSION..."
if command -v curl >/dev/null 2>&1; then
    curl -L -o "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION.zip" "$DOWNLOAD_URL"
elif command -v wget >/dev/null 2>&1; then
    wget -O "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION.zip" "$DOWNLOAD_URL"
else
    print_error "Neither curl nor wget found. Please install one of them to download Phantom Wallet extension."
    exit 1
fi

# Extract the extension
print_info "Extracting Phantom Wallet extension..."
if command -v unzip >/dev/null 2>&1; then
    unzip -q "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION.zip" -d "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION"
    rm "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION.zip"
else
    print_error "unzip command not found. Please install unzip to extract the extension."
    exit 1
fi

# Verify extraction
if [[ -d "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION" && -f "$TARGET_DIR/phantom-chrome-$PHANTOM_VERSION/manifest.json" ]]; then
    print_info "Phantom Wallet extension prepared successfully!"
    print_info "Extension location: $TARGET_DIR/phantom-chrome-$PHANTOM_VERSION"
else
    print_error "Failed to extract Phantom Wallet extension properly"
    exit 1
fi

print_info "Phantom Wallet preparation completed successfully!"