# Angular CLI Advanced Features

## Overview

The Angular CLI provides powerful tools beyond basic commands. This guide covers custom schematics, builders, configuration, environment management, and performance optimization.

---

## Configuration & Environments

### angular.json Structure

```json
{
  "projects": {
    "app": {
      "projectType": "application",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {"type": "bundle", "maximumWarning": "2mb", "maximumError": "5mb"}
              ],
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "aot": true
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "sourceMap": true,
              "aot": false
            }
          }
        }
      }
    }
  }
}
```

### Multiple Environments

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  logLevel: 'debug'
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  logLevel: 'error'
};

// app.module.ts
import { environment } from './environments/environment';

if (!environment.production) {
  enableDebugTools(componentRef);
}
```

---

## Custom Schematics

### Creating a Schematic

```bash
# Create new schematic collection
ng schematics ng-add --name @myorg/my-lib

# Create custom schematic
ng generate @schematics/schematics:schematic --name generate-component
```

### Schematic Template

```typescript
// src/generate-component/index.ts
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  template,
  mergeWith
} from '@angular-devkit/schematics';

export function generateComponent(options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const sourceTemplates = url('./files');
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        camelize: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      })
    ]);
    return mergeWith(sourceParametrizedTemplates);
  };
}
```

### Using Custom Schematic

```bash
# Install schematic
npm install @myorg/my-lib

# Use schematic
ng generate @myorg/my-lib:generate-component --name my-component
```

---

## Custom Builders

### Creating a Builder

```typescript
// src/builders/my-builder/index.ts
import { createBuilder } from '@angular-devkit/build-angular';
import { BuilderContext, BuilderOutput } from '@angular-devkit/build-angular';
import { Observable, from } from 'rxjs';

export function execute(
  options: any,
  context: BuilderContext
): Observable<BuilderOutput> {
  return from((async () => {
    context.reportStatus(`Starting custom build...`);
    
    try {
      // Custom build logic
      const result = await runCustomBuild(options);
      
      context.reportStatus(`Build complete.`);
      return { success: true };
    } catch (error) {
      context.reportStatus(`Build failed: ${error}`);
      return { success: false, error: error.message };
    }
  })());
}

async function runCustomBuild(options: any): Promise<any> {
  // Implementation
  return {};
}
```

---

## Build Optimization

### Production Build

```bash
# Optimized production build
ng build --prod

# With additional optimizations
ng build --prod --aot --build-optimizer --source-map=false
```

### Bundle Analysis

```bash
# Generate stats
ng build --prod --stats-json

# Analyze bundle
npx webpack-bundle-analyzer dist/stats.json
```

### Code Splitting

```typescript
// angular.json
"optimization": {
  "scripts": true,
  "styles": true,
  "fonts": true
},
"outputHashing": "all"
```

---

## Development Server Configuration

### Proxy Configuration

```json
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

```bash
# Use proxy
ng serve --proxy-config proxy.conf.json
```

### HTTPS Development

```bash
# Generate certificate
openssl req -new -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Use HTTPS
ng serve --ssl --ssl-key key.pem --ssl-cert cert.pem
```

---

## Package & Publish

### Library Creation

```bash
# Generate library
ng generate library my-lib

# Build library
ng build my-lib

# Publish to npm
npm publish dist/my-lib
```

### Packaging

```bash
# Create distribution
ng build --prod

# Bundle for distribution
tar -czf app-dist.tar.gz dist/
```

---

## Testing Configuration

### Test Setup

```bash
# Run tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run specific test file
ng test --include='**/my-component.spec.ts'

# E2E tests
ng e2e
```

---

## Performance Monitoring

### Build Analysis

```bash
# Show build statistics
ng build --stats-json

# Analyze build time
ng build --profile
```

### Watch Mode Optimization

```bash
# Watch specific files
ng serve --poll 2000

# Watch with specific configuration
ng serve --configuration development
```

---

## Best Practices

1. **Use configuration files** - Consistent builds across environments
2. **Implement custom schematics** - Enforce project standards
3. **Optimize production builds** - Minimize bundle size
4. **Use environment-specific settings** - Different configs per environment
5. **Analyze bundles regularly** - Monitor size growth
6. **Configure proxy** - Simplify API development
7. **Use code splitting** - Improve load times
8. **Monitor build performance** - Catch regressions early

---

## Summary

Angular CLI advanced features enable:
- Custom workflows with schematics
- Optimized production builds
- Environment-specific configurations
- Library creation and distribution
- Performance monitoring and analysis

Master these tools to build scalable, well-organized Angular applications.
