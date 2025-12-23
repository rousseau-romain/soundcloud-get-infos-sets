#!/bin/bash

################################################################################
# SoundCloud Playlist Button Extension - Setup Script
#
# This script automates the entire build process:
# 1. Checks system requirements (Node.js, npm)
# 2. Cleans previous builds
# 3. Installs dependencies
# 4. Compiles TypeScript code
# 5. Creates distribution package
#
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
#
# Compatible with: macOS
################################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Minimum required versions
MIN_NODE_VERSION="18.0.0"
MIN_NPM_VERSION="9.0.0"

################################################################################
# Utility functions
################################################################################

print_header() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║   SoundCloud Playlist Button - Automated Setup Script         ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

version_compare() {
    # Compare two semantic versions
    # Returns: 0 if $1 >= $2, 1 otherwise
    printf '%s\n%s\n' "$2" "$1" | sort -V -C
}

################################################################################
# Requirement checks
################################################################################

check_command() {
    if ! command -v "$1" &> /dev/null; then
        print_error "$1 is not installed or not in PATH"
        return 1
    fi
    return 0
}

check_node() {
    print_step "Checking Node.js installation..."

    if ! check_command node; then
        print_error "Node.js is not installed"
        echo ""
        echo "Please install Node.js ≥${MIN_NODE_VERSION} from:"
        echo "  • https://nodejs.org/ (Official)"
        echo "  • brew install node (Homebrew)"
        exit 1
    fi

    local node_version=$(node --version | sed 's/v//')
    print_success "Node.js detected: v${node_version}"

    if ! version_compare "$node_version" "$MIN_NODE_VERSION"; then
        print_warning "Node.js version is below minimum required (${MIN_NODE_VERSION})"
        print_warning "Build may fail. Please upgrade Node.js."
        read -p "Continue anyway? [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

check_npm() {
    print_step "Checking npm installation..."

    if ! check_command npm; then
        print_error "npm is not installed"
        echo ""
        echo "npm is usually bundled with Node.js."
        echo "Please reinstall Node.js from https://nodejs.org/"
        exit 1
    fi

    local npm_version=$(npm --version)
    print_success "npm detected: v${npm_version}"

    if ! version_compare "$npm_version" "$MIN_NPM_VERSION"; then
        print_warning "npm version is below minimum required (${MIN_NPM_VERSION})"
        print_warning "Build may fail. Consider upgrading: npm install -g npm@latest"
    fi
}

check_disk_space() {
    print_step "Checking disk space..."

    # Get available space in MB (macOS)
    local available=$(df -m . | tail -1 | awk '{print $4}')

    if [ "$available" -lt 200 ]; then
        print_warning "Low disk space: ${available}MB available (200MB recommended)"
    else
        print_success "Sufficient disk space: ${available}MB available"
    fi
}

################################################################################
# Build process
################################################################################

clean_build() {
    print_step "Cleaning previous builds..."

    if [ -d "dist" ]; then
        rm -rf dist
        print_success "Removed dist/ directory"
    fi

    # Remove old packages
    if ls soundcloud-ext-v*.zip 1> /dev/null 2>&1; then
        rm soundcloud-ext-v*.zip
        print_success "Removed old package files"
    fi
}

install_dependencies() {
    print_step "Installing npm dependencies..."
    echo ""

    if npm install; then
        echo ""
        print_success "Dependencies installed successfully"
    else
        echo ""
        print_error "Failed to install dependencies"
        echo ""
        echo "Troubleshooting tips:"
        echo "  1. Check your internet connection"
        echo "  2. Clear npm cache: npm cache clean --force"
        echo "  3. Try again with: rm -rf node_modules package-lock.json && npm install"
        exit 1
    fi
}

build_extension() {
    print_step "Compiling TypeScript code..."
    echo ""

    if npm run build; then
        echo ""
        print_success "Build completed successfully"
    else
        echo ""
        print_error "Build failed"
        echo ""
        echo "Troubleshooting tips:"
        echo "  1. Check that all source files are present in src/"
        echo "  2. Verify TypeScript syntax: npx tsc --noEmit"
        echo "  3. Check build.js configuration"
        exit 1
    fi
}

verify_output() {
    print_step "Verifying build output..."

    local missing_files=()

    if [ ! -f "dist/content.js" ]; then
        missing_files+=("dist/content.js")
    fi

    if [ ! -f "dist/options.js" ]; then
        missing_files+=("dist/options.js")
    fi

    if [ ${#missing_files[@]} -ne 0 ]; then
        print_error "Missing compiled files:"
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        exit 1
    fi

    print_success "All output files present"
}

create_package() {
    print_step "Creating distribution package..."
    echo ""

    if npm run package; then
        echo ""
        print_success "Package created successfully"
    else
        echo ""
        print_error "Package creation failed"
        echo ""
        echo "Troubleshooting tips:"
        echo "  1. Check that 'zip' command is available"
        echo "  2. Verify all required files are present (manifest.json, icons, etc.)"
        exit 1
    fi
}

verify_package() {
    print_step "Verifying package contents..."

    # Find the generated ZIP file
    local zipfile=$(ls soundcloud-ext-v*.zip 2>/dev/null | head -1)

    if [ -z "$zipfile" ]; then
        print_error "Package ZIP file not found"
        exit 1
    fi

    print_success "Package found: $zipfile"

    # Check ZIP contents
    local required_files=(
        "manifest.json"
        "options.html"
        "icon-48.png"
        "icon.png"
        "dist/content.js"
        "dist/options.js"
    )

    local missing_in_zip=()

    for file in "${required_files[@]}"; do
        if ! unzip -l "$zipfile" | grep -q "$file"; then
            missing_in_zip+=("$file")
        fi
    done

    if [ ${#missing_in_zip[@]} -ne 0 ]; then
        print_error "Missing files in package:"
        for file in "${missing_in_zip[@]}"; do
            echo "  - $file"
        done
        exit 1
    fi

    print_success "All required files present in package"
}

print_summary() {
    local zipfile=$(ls soundcloud-ext-v*.zip 2>/dev/null | head -1)
    local zipsize=$(du -h "$zipfile" 2>/dev/null | cut -f1)

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    BUILD SUCCESSFUL! ✓                         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}📦 Distribution package:${NC} $zipfile ($zipsize)"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  1. Test the extension locally:"
    echo "     • Chrome: Load unpacked from this directory"
    echo "     • Firefox: Load temporary add-on (manifest.json)"
    echo ""
    echo "  2. Validate (optional):"
    echo "     npm run lint"
    echo ""
    echo "  3. Submit to stores:"
    echo "     • Chrome Web Store: Upload $zipfile"
    echo "     • Firefox Add-ons: Upload $zipfile"
    echo ""
    echo -e "${CYAN}Documentation:${NC}"
    echo "  • BUILD.md - Complete build instructions"
    echo "  • PUBLISHING.md - Store submission guide"
    echo "  • README.md - Usage and development guide"
    echo ""
}

################################################################################
# Main execution
################################################################################

main() {
    print_header

    # System checks
    check_node
    check_npm
    check_disk_space
    echo ""

    # Build process
    clean_build
    install_dependencies
    build_extension
    verify_output
    echo ""

    # Packaging
    create_package
    verify_package

    # Summary
    print_summary
}

# Run main function
main "$@"
