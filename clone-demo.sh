#!/usr/bin/env bash
#
# Clone Demo Script - Secure Version
# This script safely clones and sets up demo projects for onchain testing
#

set -euo pipefail

# Enhanced portability - use /usr/bin/env bash for better cross-platform support
# Exit on any command failure, undefined variables, or pipe failures

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Default configuration
readonly DEFAULT_DEMO_DIR="onchain-demo"
readonly DEMO_REPO_URL="https://github.com/coinbase/onchain-kit"

# Critical safety validation: Protected directories that should never be removed
readonly PROTECTED_DIRS=(
    "/"
    "/bin"
    "/boot" 
    "/dev"
    "/etc"
    "/home"
    "/lib"
    "/lib32"
    "/lib64"
    "/mnt"
    "/opt"
    "/proc"
    "/root"
    "/run"
    "/sbin"
    "/srv"
    "/sys"
    "/tmp"
    "/usr"
    "/var"
    "$HOME"
)

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to validate directory path for safety
validate_directory_path() {
    local target_dir="$1"
    
    # Convert to absolute path for comparison
    local abs_path
    abs_path="$(readlink -f "$target_dir" 2>/dev/null || echo "$target_dir")"
    
    # Check if path is empty or contains dangerous patterns
    if [[ -z "$target_dir" ]]; then
        print_status "$RED" "❌ Error: Directory path cannot be empty"
        return 1
    fi
    
    # Check for dangerous patterns
    if [[ "$target_dir" =~ ^[[:space:]]*$ ]]; then
        print_status "$RED" "❌ Error: Directory path cannot contain only whitespace"
        return 1
    fi
    
    # Check against protected directories
    for protected_dir in "${PROTECTED_DIRS[@]}"; do
        if [[ "$abs_path" == "$protected_dir" ]] || [[ "$target_dir" == "$protected_dir" ]]; then
            print_status "$RED" "❌ Error: Cannot remove protected directory: $target_dir"
            print_status "$RED" "   This is a critical system directory and cannot be safely removed."
            return 1
        fi
    done
    
    # Check for parent directory traversal that could affect protected paths
    case "$abs_path" in
        "/")
            print_status "$RED" "❌ Error: Cannot remove root directory"
            return 1
            ;;
        "/home"|"/home/"*)
            if [[ "$abs_path" == "/home" ]]; then
                print_status "$RED" "❌ Error: Cannot remove /home directory"
                return 1
            fi
            ;;
        "/usr"|"/usr/"*)
            if [[ "$abs_path" == "/usr" ]]; then
                print_status "$RED" "❌ Error: Cannot remove /usr directory"
                return 1
            fi
            ;;
    esac
    
    return 0
}

# Function to safely remove directory with comprehensive validation
safe_remove_directory() {
    local target_dir="$1"
    local force_mode="${2:-false}"
    
    print_status "$BLUE" "🔍 Validating directory for safe removal: $target_dir"
    
    # Comprehensive protection against dangerous directory values
    if ! validate_directory_path "$target_dir"; then
        return 1
    fi
    
    # Check if directory exists
    if [[ ! -d "$target_dir" ]]; then
        print_status "$YELLOW" "⚠️  Directory does not exist: $target_dir"
        return 0
    fi
    
    # Additional safety check - ensure we're not in a protected location
    local current_dir
    current_dir="$(pwd)"
    case "$current_dir" in
        "/"|"/home"|"/usr"|"/etc"|"/var"|"/opt")
            print_status "$RED" "❌ Error: Cannot perform removal operations from protected directory: $current_dir"
            return 1
            ;;
    esac
    
    # User confirmation for destructive operations (unless in force mode)
    if [[ "$force_mode" != "true" ]]; then
        print_status "$YELLOW" "⚠️  This will permanently delete: $target_dir"
        print_status "$YELLOW" "   All contents will be lost!"
        echo -n "Do you want to continue? [y/N]: "
        read -r confirmation
        case "$confirmation" in
            [Yy]|[Yy][Ee][Ss])
                print_status "$BLUE" "Proceeding with removal..."
                ;;
            *)
                print_status "$GREEN" "✅ Operation cancelled by user"
                return 0
                ;;
        esac
    fi
    
    # Final safety check before removal
    print_status "$BLUE" "🔒 Performing final safety validation..."
    if ! validate_directory_path "$target_dir"; then
        return 1
    fi
    
    # Perform the actual removal with proper error handling
    print_status "$BLUE" "🗑️  Removing directory: $target_dir"
    if rm -rf "$target_dir"; then
        print_status "$GREEN" "✅ Successfully removed directory: $target_dir"
    else
        print_status "$RED" "❌ Failed to remove directory: $target_dir"
        return 1
    fi
    
    return 0
}

# Function to display usage information
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS] [DEMO_DIRECTORY]

Clone and set up onchain demo projects safely.

OPTIONS:
    -h, --help          Show this help message
    -f, --force         Force removal without confirmation prompts
    -c, --clean         Clean existing demo directory before cloning
    -r, --repo URL      Specify custom repository URL (default: $DEMO_REPO_URL)
    
DEMO_DIRECTORY:
    Directory name for the demo (default: $DEFAULT_DEMO_DIR)
    Must be a safe, non-system directory path.

EXAMPLES:
    $0                           # Clone to default directory
    $0 my-demo                   # Clone to custom directory  
    $0 --clean my-demo          # Clean existing and clone
    $0 --repo https://github.com/user/repo demo  # Custom repo

SAFETY FEATURES:
    ✓ Enhanced portability with improved shebang declaration
    ✓ Critical safety validation before directory removal operations
    ✓ Comprehensive protection against dangerous directory values
    ✓ User confirmation for destructive operations
    ✓ Protected system directories validation

EOF
}

# Main function
main() {
    local demo_dir="$DEFAULT_DEMO_DIR"
    local repo_url="$DEMO_REPO_URL"
    local force_mode="false"
    local clean_mode="false"
    
    print_status "$BLUE" "🚀 Onchain Test Kit - Demo Clone Script"
    print_status "$BLUE" "   Enhanced with security and safety features"
    echo
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -f|--force)
                force_mode="true"
                shift
                ;;
            -c|--clean)
                clean_mode="true"
                shift
                ;;
            -r|--repo)
                if [[ -z "${2:-}" ]]; then
                    print_status "$RED" "❌ Error: --repo requires a URL argument"
                    exit 1
                fi
                repo_url="$2"
                shift 2
                ;;
            -*)
                print_status "$RED" "❌ Error: Unknown option $1"
                show_usage
                exit 1
                ;;
            *)
                demo_dir="$1"
                shift
                ;;
        esac
    done
    
    # Validate demo directory argument
    if ! validate_directory_path "$demo_dir"; then
        print_status "$RED" "❌ Error: Invalid or unsafe directory path: $demo_dir"
        exit 1
    fi
    
    # Clean existing directory if requested
    if [[ "$clean_mode" == "true" ]] && [[ -d "$demo_dir" ]]; then
        print_status "$YELLOW" "🧹 Cleaning existing directory..."
        if ! safe_remove_directory "$demo_dir" "$force_mode"; then
            print_status "$RED" "❌ Failed to clean existing directory"
            exit 1
        fi
    fi
    
    # Check if directory already exists
    if [[ -d "$demo_dir" ]]; then
        print_status "$YELLOW" "⚠️  Directory already exists: $demo_dir"
        if [[ "$force_mode" != "true" ]]; then
            echo -n "Do you want to remove it and continue? [y/N]: "
            read -r confirmation
            case "$confirmation" in
                [Yy]|[Yy][Ee][Ss])
                    if ! safe_remove_directory "$demo_dir" "$force_mode"; then
                        exit 1
                    fi
                    ;;
                *)
                    print_status "$GREEN" "✅ Operation cancelled by user"
                    exit 0
                    ;;
            esac
        else
            if ! safe_remove_directory "$demo_dir" "$force_mode"; then
                exit 1
            fi
        fi
    fi
    
    # Clone the repository
    print_status "$BLUE" "📁 Cloning repository..."
    print_status "$BLUE" "   Repository: $repo_url"
    print_status "$BLUE" "   Directory: $demo_dir"
    
    if git clone "$repo_url" "$demo_dir"; then
        print_status "$GREEN" "✅ Successfully cloned repository"
    else
        print_status "$RED" "❌ Failed to clone repository"
        exit 1
    fi
    
    # Change to demo directory
    cd "$demo_dir" || {
        print_status "$RED" "❌ Failed to change to demo directory"
        exit 1
    }
    
    # Set up the demo
    print_status "$BLUE" "⚙️  Setting up demo environment..."
    
    # Check if package.json exists and install dependencies
    if [[ -f "package.json" ]]; then
        print_status "$BLUE" "📦 Installing dependencies..."
        if command -v yarn &> /dev/null; then
            yarn install
        elif command -v npm &> /dev/null; then
            npm install
        else
            print_status "$YELLOW" "⚠️  Neither yarn nor npm found. Please install dependencies manually."
        fi
    fi
    
    # Success message
    print_status "$GREEN" "🎉 Demo setup completed successfully!"
    print_status "$GREEN" "   Directory: $(pwd)"
    print_status "$GREEN" "   You can now start exploring the demo."
    
    echo
    print_status "$BLUE" "📚 Next steps:"
    print_status "$BLUE" "   1. cd $demo_dir"
    print_status "$BLUE" "   2. Read the README.md for usage instructions"
    print_status "$BLUE" "   3. Run the example tests or start the demo application"
}

# Script entry point with error handling
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi