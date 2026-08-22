# Angular CLI Installation & Overview

## What is Angular CLI?

The Angular Command Line Interface (CLI) is the official tool for developing, building, and deploying Angular applications. It automates project setup, generates components, services, and other Angular artifacts, and optimizes the build process.

### Key Benefits

- **Automation** - Automates project setup and artifact generation
- **Best Practices** - Generates code following Angular style guide
- **Optimization** - Automatically optimizes builds for production
- **Testing** - Built-in testing and linting support
- **Development** - Hot reload development server for rapid development
- **Scaffolding** - Generate consistent project structure

## Installation

### Prerequisites

You need Node.js (which includes npm) installed on your machine.

### Install Node.js

1. Visit [nodejs.org](https://nodejs.org)
2. Download LTS version
3. Run installer and follow prompts
4. Verify installation:

```bash
node --version
npm --version
```

### Install Angular CLI Globally

Once Node.js is installed, install Angular CLI:

```bash
# Install Angular CLI globally
npm install -g @angular/cli

# Verify installation
ng version

# Check for latest version
npm view @angular/cli versions
```

### Update Angular CLI

```bash
# Check for updates
ng update

# Update to latest version
npm install -g @angular/cli@latest

# Update to specific version
npm install -g @angular/cli@16.0.0
```

### Verify Installation

```bash
# Check CLI version
ng version

# Get help
ng help

# Get version of specific package
ng version @angular/core
```

## Angular CLI Versions

### Version 16+ (Current)

- Standalone components default
- Improved performance
- Better tooling integration
- Signals support

### Version 15

- Stable standalone APIs
- Improved build performance
- Enhanced testing utilities

### Version 14

- Standalone components (experimental)
- Strict mode by default
- Node.js 14+ required

### Compatibility

Check Angular version compatibility with Node.js:

```
Angular 18: Node 18.19+, 20+, 22+
Angular 17: Node 18.13+, 20+, 21+
Angular 16: Node 14.20+, 16+, 18+
Angular 15: Node 14.20+, 16+, 18+
```

## CLI Configuration

### Global Configuration

Angular CLI stores configuration in:
- **`.angularrc`** - Global CLI configuration (root of drive/home)
- **`angular.json`** - Project-specific configuration

### Workspace Structure

```
workspace/
├── angular.json        # CLI configuration
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
├── .editorconfig       # Editor configuration
├── .gitignore          # Git ignore rules
├── src/                # Source code
├── dist/               # Build output
└── node_modules/       # Dependencies
```

## Common Installation Issues

### Issue: Permission Denied

```bash
# Use sudo (not recommended)
sudo npm install -g @angular/cli

# Better: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Issue: Command Not Found

```bash
# Check installation
npm list -g @angular/cli

# Reinstall
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
```

### Issue: Version Conflicts

```bash
# Clear cache
npm cache clean --force

# Reinstall
npm install -g @angular/cli@latest
```

## Best Practices

✅ Keep Angular CLI updated  
✅ Use global installation for CLI, local for projects  
✅ Version your Node.js with nvm (Node Version Manager)  
✅ Check compatibility before updating  
✅ Use `ng update` for version upgrades  
✅ Document Node/Angular versions in README

## Quick Reference

| Command | Purpose |
|---------|---------|
| `ng version` | Check CLI and package versions |
| `ng help` | Show help information |
| `ng new` | Create new project |
| `ng serve` | Start dev server |
| `ng build` | Build for production |
| `ng generate` | Generate components/services/etc |
| `ng test` | Run tests |
| `ng lint` | Check code quality |

## Key Takeaways

- Angular CLI is essential for Angular development
- Install globally for command-line access
- Node.js is required (includes npm)
- Keep CLI and packages updated
- Use `ng version` to check compatibility
- Refer to official docs for specific version requirements
