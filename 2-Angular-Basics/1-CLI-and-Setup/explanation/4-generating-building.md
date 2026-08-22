# Generating & Building Angular Projects

## Generating Code with CLI

The `ng generate` (or `ng g`) command creates consistent, well-structured code.

### Generate Components

```bash
# Basic component
ng generate component components/user-list
ng g c components/user-list

# Component with routing
ng generate component pages/home --route app

# Component in module
ng generate component user-list --module=app.module

# Component with styles
ng generate component user-list --style=scss

# Component with inline template/styles
ng generate component user-list --inline-template --inline-style

# Skip spec file (tests)
ng generate component user-list --skip-spec

# Standalone component (Angular 14+)
ng generate component user-list --standalone
```

### Generate Services

```bash
# Basic service
ng generate service services/user
ng g s services/user

# Service in module
ng generate service services/user --module=app

# Service with skip spec
ng generate service services/user --skip-spec
```

### Generate Other Artifacts

```bash
# Module
ng generate module modules/admin
ng g m modules/admin --routing

# Directive
ng generate directive directives/highlight
ng g d directives/highlight

# Pipe
ng generate pipe pipes/custom-filter
ng g p pipes/custom-filter

# Guard
ng generate guard guards/auth
ng g g guards/auth

# Interceptor
ng generate interceptor interceptors/auth
ng g i interceptors/auth

# Interface/Model
ng generate interface models/user
ng g i models/user

# Enum
ng generate enum models/role

# Class
ng generate class models/user.model

# Resolver
ng generate resolver resolvers/user
```

### Schematic Options

```bash
# Skip module update
ng generate component user-list --skip-import

# Specify selector prefix
ng generate component user-list --selector=app-users

# Change export location
ng generate service services/user --flat=false

# No decorators for interfaces
ng generate interface models/base
```

## Building Applications

### Development Build

```bash
# Build for development
ng build

# Build with watch mode (auto-rebuild on changes)
ng build --watch

# Build with source maps for debugging
ng build --source-map
```

### Production Build

```bash
# Build for production (optimized)
ng build --configuration production

# Shorthand
ng build -c production

# Build and analyze
ng build --configuration production --stats-json
```

### Build Options

```bash
# Build with different styles
ng build --style=scss

# Build to specific output directory
ng build --output-path=./build

# Include source maps in production
ng build --configuration production --source-map

# Show build progress
ng build --progress

# Build for specific locale (i18n)
ng build --localize
```

## Build Optimization

### Size Budgets

In `angular.json`:

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "2kb",
      "maximumError": "4kb"
    }
  ]
}
```

### Build Strategies

1. **Ahead-of-Time (AOT) Compilation** - Pre-compile templates
2. **Tree Shaking** - Remove unused code
3. **Minification** - Reduce file size
4. **Code Splitting** - Split into chunks
5. **Lazy Loading** - Load modules on demand

### Analyze Bundle Size

```bash
# Build with stats
ng build --stats-json

# Install webpack analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze
webpack-bundle-analyzer dist/my-app/stats.json

# Or use source-map-explorer
npm install --save-dev source-map-explorer
source-map-explorer dist/my-app/**/*.js
```

## Multiple Configurations

### Define Configurations

In `angular.json`:

```json
{
  "build": {
    "configurations": {
      "production": {
        "aot": true,
        "sourceMap": false,
        "optimization": true
      },
      "staging": {
        "aot": true,
        "sourceMap": true,
        "optimization": true
      },
      "development": {
        "aot": false,
        "sourceMap": true,
        "optimization": false
      }
    }
  }
}
```

### Build with Configurations

```bash
# Production
ng build --configuration production

# Staging
ng build --configuration staging

# Development
ng build --configuration development
```

## Build Output

### Distribution Structure

```
dist/my-app/
├── index.html           # Main HTML file
├── main.js              # Main bundle
├── runtime.js           # Runtime bundle
├── polyfills.js         # Polyfills bundle
├── scripts.js           # External scripts
├── styles.css           # Global styles
├── 3rdpartylicenses.txt # Third-party licenses
└── assets/              # Static assets
```

### Main Bundles

- **main.js** - Your application code
- **runtime.js** - Angular runtime
- **polyfills.js** - Browser compatibility
- **styles.css** - Global styles
- **vendor bundles** - Third-party libraries

## Preview Production Build

```bash
# Install serve
npm install -g serve

# Serve production build
serve dist/my-app

# Or use Python
cd dist/my-app
python -m http.server 8000

# Or use Node.js
npx http-server dist/my-app
```

## Incremental Builds

Enable persistent build cache:

```bash
# Set environment variable
export NG_BUILD_CACHE=1

# Windows
set NG_BUILD_CACHE=1

# Or use flag
ng build --cache
```

## Watch Mode

```bash
# Watch and rebuild on changes
ng build --watch

# Watch with specific configuration
ng build --watch --configuration staging

# Watch with polling (for slow file systems)
ng build --watch --poll 2000
```

## Troubleshooting Builds

### Build Fails

```bash
# Clear cache
rm -rf .angular/cache
ng build

# Deep clean
rm -rf node_modules package-lock.json
npm install
ng build
```

### Build Size Too Large

```bash
# Analyze bundle
ng build --stats-json
webpack-bundle-analyzer dist/my-app/stats.json

# Check for unused dependencies
npm list --depth=0

# Remove unused packages
npm uninstall package-name
```

### Memory Issues

```bash
# Increase Node memory
export NODE_OPTIONS=--max-old-space-size=4096

# Windows
set NODE_OPTIONS=--max-old-space-size=4096

# Then build
ng build
```

## CI/CD Build

### For Continuous Integration

```bash
# Build without watch mode
ng build --configuration production

# Build and fail on warnings
ng build --configuration production --stats-json

# Build for specific environment
ng build --configuration production --localize
```

## Best Practices

✅ Always use production build for deployment  
✅ Analyze bundle size regularly  
✅ Set reasonable size budgets  
✅ Use lazy loading for feature modules  
✅ Remove unused dependencies  
✅ Enable strict mode for better optimization  
✅ Test builds locally before deployment  
✅ Use CI/CD for automated builds  

## Key Takeaways

- Use `ng generate` for consistent code structure
- Production builds are optimized and minified
- Bundle size analysis helps identify issues
- Multiple configurations support different environments
- Watch mode speeds up development
- Proper configuration yields smaller, faster apps
