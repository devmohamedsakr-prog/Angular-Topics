#!/bin/bash
# Angular CLI Installation & Setup Scripts
# This file contains common installation and setup commands

echo "=== Angular CLI Installation & Setup ==="
echo ""

# ===== INSTALL NODE.JS =====
echo "1. INSTALL NODE.JS"
echo "---"
echo "# Visit nodejs.org and download LTS version"
echo "# Or use package manager:"
echo ""
echo "# macOS (with Homebrew)"
echo "brew install node"
echo ""
echo "# Ubuntu/Debian"
echo "sudo apt-get update && sudo apt-get install nodejs npm"
echo ""
echo "# Windows (with Chocolatey)"
echo "choco install nodejs"
echo ""

# ===== VERIFY NODE INSTALLATION =====
echo "2. VERIFY NODE INSTALLATION"
echo "---"
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
echo ""

# ===== INSTALL ANGULAR CLI GLOBALLY =====
echo "3. INSTALL ANGULAR CLI GLOBALLY"
echo "---"
echo "npm install -g @angular/cli"
echo ""
echo "# Or with yarn"
echo "yarn global add @angular/cli"
echo ""

# ===== VERIFY ANGULAR CLI =====
echo "4. VERIFY ANGULAR CLI INSTALLATION"
echo "---"
echo "ng version"
echo "ng help"
echo ""

# ===== UPDATE ANGULAR CLI =====
echo "5. UPDATE ANGULAR CLI"
echo "---"
echo "# Check for updates"
echo "ng update"
echo ""
echo "# Update to latest version"
echo "npm install -g @angular/cli@latest"
echo ""
echo "# Update to specific version"
echo "npm install -g @angular/cli@17.0.0"
echo ""

# ===== USE NVM FOR NODE VERSION MANAGEMENT =====
echo "6. USE NVM FOR NODE VERSION MANAGEMENT"
echo "---"
echo "# Install NVM (Node Version Manager)"
echo "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
echo ""
echo "# Reload shell"
echo "source ~/.bashrc"
echo ""
echo "# Install specific Node version"
echo "nvm install 18"
echo ""
echo "# Use specific version"
echo "nvm use 18"
echo ""
echo "# Set default version"
echo "nvm alias default 18"
echo ""

# ===== TROUBLESHOOTING =====
echo "7. TROUBLESHOOTING"
echo "---"
echo "# Command not found: reinstall Angular CLI"
echo "npm uninstall -g @angular/cli"
echo "npm install -g @angular/cli@latest"
echo ""
echo "# Permission denied: fix npm permissions"
echo "mkdir ~/.npm-global"
echo "npm config set prefix '~/.npm-global'"
echo "export PATH=~/.npm-global/bin:\$PATH"
echo ""
echo "# Clear npm cache"
echo "npm cache clean --force"
echo ""
echo "# Verify installation"
echo "npm list -g @angular/cli"
echo ""

echo "=== Setup Complete ==="
