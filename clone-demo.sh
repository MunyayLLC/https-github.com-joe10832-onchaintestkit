#!/usr/bin/env bash

# clone-demo.sh - Safe demo project cloning script
# This script clones demo projects and sets up the development environment
# with comprehensive safety measures for directory operations

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEMO_DIR="onchain-testkit-demos"
DEFAULT_REPO="https://github.com/MunyayLLC/https-github.com-joe10832-onchaintestkit.git"

# Safety: Define dangerous directories that should never be removed
DANGEROUS_PATHS=(
    "/"
    "/home"
    "/usr"
    "/bin"
    "/sbin"
    "/etc"
    "/var"
    "/boot"
    "/root"
    "/sys"
    "/proc"
    "/dev"
    "/lib"
    "/lib64"
    "/opt"
    "/mnt"
    "/media"
    "$HOME"
    ""
    "."
    ".."
)

# Function: Print colored output
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function: Print error and exit
error_exit() {
    print_message "$RED" "ERROR: $1"
    exit 1
}

# Function: Print warning
warn() {
    print_message "$YELLOW" "WARNING: $1"
}

# Function: Print info
info() {
    print_message "$BLUE" "INFO: $1"
}

# Function: Print success
success() {
    print_message "$GREEN" "SUCCESS: $1"
}

# Function: Validate directory path for safety
validate_directory_safety() {
    local dir_path="$1"
    local normalized_path
    
    # Normalize the path (resolve . and .. and remove trailing slashes)
    normalized_path=$(cd "$(dirname "$dir_path")" 2>/dev/null && pwd)/$(basename "$dir_path") 2>/dev/null || echo "$dir_path"
    normalized_path=${normalized_path%/}  # Remove trailing slash
    
    # Check if path is empty or just whitespace
    if [[ -z "${dir_path// }" ]]; then
        error_exit "Directory path cannot be empty or contain only whitespace"
    fi
    
    # Check against dangerous paths
    for dangerous in "${DANGEROUS_PATHS[@]}"; do
        if [[ "$normalized_path" == "$dangerous" ]] || [[ "$dir_path" == "$dangerous" ]]; then
            error_exit "Refusing to remove dangerous directory: $dir_path (normalized: $normalized_path)"
        fi
    done
    
    # Ensure path is not too short (additional safety)
    if [[ ${#normalized_path} -lt 3 ]]; then
        error_exit "Directory path too short for safety: $dir_path"
    fi
    
    # Ensure path doesn't contain only slashes
    if [[ "$dir_path" =~ ^/+$ ]]; then
        error_exit "Directory path contains only slashes: $dir_path"
    fi
    
    return 0
}

# Function: Safe directory removal with confirmation
safe_remove_directory() {
    local dir_path="$1"
    local force_flag="${2:-false}"
    
    # Validate directory safety first
    validate_directory_safety "$dir_path"
    
    # Check if directory exists
    if [[ ! -d "$dir_path" ]]; then
        info "Directory does not exist: $dir_path"
        return 0
    fi
    
    # Get absolute path for additional verification
    local abs_path
    abs_path=$(cd "$dir_path" && pwd) 2>/dev/null || abs_path="$dir_path"
    
    # Double-check the absolute path for safety
    validate_directory_safety "$abs_path"
    
    # Require confirmation unless force flag is set
    if [[ "$force_flag" != "true" ]]; then
        print_message "$YELLOW" "About to remove directory: $dir_path"
        print_message "$YELLOW" "Absolute path: $abs_path"
        read -p "Are you sure you want to proceed? (y/N): " -r
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            info "Directory removal cancelled by user"
            return 0
        fi
    fi
    
    # Perform the removal with additional safety checks
    if [[ -d "$dir_path" ]]; then
        info "Removing directory: $dir_path"
        rm -rf "$dir_path"
        success "Directory removed successfully: $dir_path"
    fi
}

# Function: Clone repository safely
clone_repository() {
    local repo_url="$1"
    local target_dir="$2"
    
    info "Cloning repository: $repo_url"
    info "Target directory: $target_dir"
    
    if ! git clone "$repo_url" "$target_dir"; then
        error_exit "Failed to clone repository: $repo_url"
    fi
    
    success "Repository cloned successfully to: $target_dir"
}

# Function: Setup project dependencies
setup_project() {
    local project_dir="$1"
    
    info "Setting up project in: $project_dir"
    
    cd "$project_dir" || error_exit "Failed to change to project directory: $project_dir"
    
    # Check if package.json exists
    if [[ -f "package.json" ]]; then
        info "Installing npm dependencies..."
        if command -v yarn >/dev/null 2>&1; then
            yarn install || error_exit "Failed to install dependencies with yarn"
        else
            npm install || error_exit "Failed to install dependencies with npm"
        fi
        success "Dependencies installed successfully"
    else
        info "No package.json found, skipping dependency installation"
    fi
    
    # Run build if build script exists
    if [[ -f "package.json" ]] && grep -q '"build"' package.json; then
        info "Building project..."
        if command -v yarn >/dev/null 2>&1; then
            yarn build || warn "Build failed, but continuing..."
        else
            npm run build || warn "Build failed, but continuing..."
        fi
    fi
}

# Function: Display help
show_help() {
    echo "Usage: $0 [OPTIONS] [REPOSITORY_URL]"
    echo
    echo "Clone and set up onchain testkit demo projects safely"
    echo
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -d, --directory DIR     Specify demo directory name (default: $DEMO_DIR)"
    echo "  -f, --force             Force removal without confirmation"
    echo "  -c, --clean             Clean existing directory before cloning"
    echo "  --no-setup              Skip project setup after cloning"
    echo
    echo "Arguments:"
    echo "  REPOSITORY_URL          Git repository to clone (default: $DEFAULT_REPO)"
    echo
    echo "Examples:"
    echo "  $0                                          # Clone default repository"
    echo "  $0 --clean                                  # Clean and clone default repository"
    echo "  $0 -d my-demo https://github.com/user/repo # Clone specific repository to custom directory"
    echo
}

# Main function
main() {
    local repo_url="$DEFAULT_REPO"
    local demo_dir="$DEMO_DIR"
    local force_flag=false
    local clean_flag=false
    local setup_flag=true
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -d|--directory)
                demo_dir="$2"
                shift 2
                ;;
            -f|--force)
                force_flag=true
                shift
                ;;
            -c|--clean)
                clean_flag=true
                shift
                ;;
            --no-setup)
                setup_flag=false
                shift
                ;;
            -*)
                error_exit "Unknown option: $1. Use --help for usage information."
                ;;
            *)
                repo_url="$1"
                shift
                ;;
        esac
    done
    
    # Validate demo directory name
    if [[ -z "$demo_dir" ]]; then
        error_exit "Demo directory name cannot be empty"
    fi
    
    # Additional safety check for directory name
    validate_directory_safety "$demo_dir"
    
    print_message "$BLUE" "Onchain TestKit Demo Cloning Script"
    print_message "$BLUE" "===================================="
    
    info "Repository: $repo_url"
    info "Target directory: $demo_dir"
    
    # Clean existing directory if requested
    if [[ "$clean_flag" == "true" ]]; then
        if [[ -d "$demo_dir" ]]; then
            warn "Cleaning existing directory: $demo_dir"
            safe_remove_directory "$demo_dir" "$force_flag"
        fi
    fi
    
    # Check if directory already exists
    if [[ -d "$demo_dir" ]]; then
        error_exit "Directory already exists: $demo_dir. Use --clean to remove it first."
    fi
    
    # Clone the repository
    clone_repository "$repo_url" "$demo_dir"
    
    # Setup project if requested
    if [[ "$setup_flag" == "true" ]]; then
        setup_project "$demo_dir"
        
        success "Demo project setup complete!"
        info "To get started:"
        info "  cd $demo_dir"
        info "  npm start  # or yarn start"
    else
        success "Repository cloned successfully!"
        info "To get started:"
        info "  cd $demo_dir"
        info "  npm install  # or yarn install"
        info "  npm run build  # or yarn build"
    fi
    
    print_message "$GREEN" "Done! Happy coding with Onchain TestKit! 🚀"
}

# Trap to handle script interruption
trap 'error_exit "Script interrupted"' INT TERM

# Run main function with all arguments
main "$@"