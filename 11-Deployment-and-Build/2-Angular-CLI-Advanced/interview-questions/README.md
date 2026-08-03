# Angular CLI Advanced Features - Interview Questions

## Beginner Level

### Q1: What is the difference between `ng build` and `ng build --prod`?
**Answer:**
- `ng build`: Creates a development build with source maps, no minification, slower performance
- `ng build --prod`: Creates an optimized production build with:
  - Minification and obfuscation
  - Tree shaking (removes unused code)
  - AOT compilation enabled
  - Source maps disabled
  - Build optimizer enabled
  - Smaller bundle sizes

**Code Example:**
```typescript
// Development build - larger, easier to debug
ng build

// Production build - optimized for performance
ng build --prod
```

---

### Q2: How do you create a new Angular project with strict mode?
**Answer:**
Strict mode enforces stricter TypeScript and Angular compiler checks:

```bash
# Create new project with strict mode
ng new my-app --strict

# Or enable in existing project via tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true
  }
}
```

Strict mode helps catch errors at compile-time before runtime.

---

### Q3: What is lazy loading and how do you configure it with Angular CLI?
**Answer:**
Lazy loading loads feature modules only when needed, reducing initial bundle size:

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(m => m.UsersModule)
  }
];

// Benefits:
// - Smaller initial bundle
// - Faster first page load
// - Only loads feature modules on demand
```

---

### Q4: How do you use environment-specific configurations?
**Answer:**
Create separate environment files and reference them in `angular.json`:

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com'
};

// In app.component.ts
import { environment } from '../environments/environment';

// Use in angular.json fileReplacements
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ]
    }
  }
}

// Usage
ng serve (uses environment.ts)
ng serve --configuration=production (uses environment.prod.ts)
```

---

### Q5: What are performance budgets and why are they important?
**Answer:**
Performance budgets set maximum size limits for app bundles to ensure performance:

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "2mb",
      "maximumError": "5mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "6kb",
      "maximumError": "10kb"
    }
  ]
}
```

Benefits:
- Prevents bundle bloat
- Alerts during development if sizes exceed limits
- Enforces performance standards
- Improves user experience for slower networks

---

## Intermediate Level

### Q6: How do you generate a custom schematic for your project?
**Answer:**
Schematics automate code generation following your project patterns:

```bash
# Install schematic tools
npm install --save-dev @angular-devkit/schematics-cli

# Create schematic
schematics blank --name=custom-component

# Create schematic with schema
{
  "$schema": "http://json-schema.org/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Component name",
      "$default": {
        "$source": "argv",
        "index": 0
      }
    },
    "skipTests": {
      "type": "boolean",
      "default": false
    }
  }
}
```

**Usage in collection.json:**
```json
{
  "schematics": {
    "smart-component": {
      "description": "Generate smart component with forms",
      "factory": "./smart-component/index#smartComponent",
      "schema": "./smart-component/schema.json"
    }
  }
}
```

---

### Q7: What is AOT compilation and how does it improve performance?
**Answer:**
AOT (Ahead-of-Time) compilation pre-compiles the app in the build process:

```typescript
// AOT vs JIT
// JIT (Just-in-Time) - compiles in browser
// AOT (Ahead-of-Time) - pre-compiles during build

// Benefits:
// 1. Faster rendering (no compilation in browser)
// 2. Smaller bundle (compiler not included)
// 3. Detect template errors early
// 4. Better security (templates pre-compiled)

// Enable AOT (default in --prod)
ng build --prod --aot

// Disable if needed (rare)
ng build --aot=false
```

---

### Q8: How do you create and publish a reusable Angular library?
**Answer:**
```bash
# Generate library
ng generate library @myorg/shared-components

# Build library
ng build @myorg/shared-components --prod

# Create package.json in dist
{
  "name": "@myorg/shared-components",
  "version": "1.0.0",
  "peerDependencies": {
    "@angular/common": "^15.0.0",
    "@angular/core": "^15.0.0"
  }
}

# Publish to npm
npm publish dist/@myorg/shared-components
```

**ng-package.json:**
```json
{
  "$schema": "node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
```

---

### Q9: What is tree shaking and how does Angular CLI use it?
**Answer:**
Tree shaking removes unused code during bundle optimization:

```typescript
// Example: Removing unused exports

// lib.ts
export function usedFunction() { }
export function unusedFunction() { }

// app.ts
import { usedFunction } from './lib';
usedFunction();

// After tree shaking, unusedFunction is removed from bundle
// Saves space in final bundle
```

Requirements for tree shaking:
- ES6 modules (not CommonJS)
- Mark unused code as side-effect-free in package.json:
```json
{
  "sideEffects": false
}
```

---

### Q10: How do you analyze and optimize bundle size?
**Answer:**
```bash
# Generate stats file
ng build --prod --stats-json

# Analyze with webpack-bundle-analyzer
npm install webpack-bundle-analyzer --save-dev
webpack-bundle-analyzer dist/*/stats.json

# Optimization strategies:
# 1. Enable lazy loading for feature modules
# 2. Remove unused libraries (npm audit)
# 3. Use ng-packagr for libraries
# 4. Tree shake unused code
# 5. Compress images and assets
# 6. Split large components into smaller ones
```

**Code optimization example:**
```typescript
// Before: Large bundle
import * as _ from 'lodash'; // 70KB
const sorted = _.sortBy(data, 'name');

// After: Smaller bundle
import { sortBy } from 'lodash-es'; // 5KB
const sorted = sortBy(data, 'name');
```

---

## Advanced Level

### Q11: How do you set up a monorepo workspace with multiple applications and libraries?
**Answer:**
Create organized structure with shared code:

```bash
# Create workspace
ng new my-workspace --create-application=false

# Generate applications
ng generate application apps/main-app
ng generate application apps/admin-app

# Generate libraries
ng generate library libs/shared-ui
ng generate library libs/shared-services
```

**angular.json structure:**
```json
{
  "projects": {
    "main-app": { "root": "apps/main-app" },
    "admin-app": { "root": "apps/admin-app" },
    "@myorg/shared-ui": { "root": "libs/shared-ui" },
    "@myorg/shared-services": { "root": "libs/shared-services" }
  }
}
```

**tsconfig.json path mappings:**
```json
{
  "compilerOptions": {
    "paths": {
      "@myorg/shared-ui": ["libs/shared-ui/src/public-api.ts"],
      "@myorg/shared-services": ["libs/shared-services/src/public-api.ts"]
    }
  }
}
```

Benefits:
- Code reuse across applications
- Easier maintenance
- Shared dependencies
- Better organization

---

### Q12: How do you implement differential loading for better browser compatibility?
**Answer:**
Differential loading creates separate bundles for modern and legacy browsers:

```bash
# Automatic in production build
ng build --prod

# Creates:
# - Modern bundle (ES2015+, smaller)
# - Legacy bundle (ES5, larger, for older browsers)

# In index.html, browser chooses correct bundle:
# <script type="module" src="main-es2015.js"></script>
# <script noModule src="main-es5.js"></script>
```

**Benefits:**
- Modern browsers get smaller bundles
- Legacy browsers still supported
- Automatic browser detection
- Better performance overall

---

### Q13: How do you configure and use custom webpack configuration with Angular CLI?

**Answer:**
Use `@angular-builders/custom-webpack` to extend webpack config:

```bash
npm install --save-dev @angular-builders/custom-webpack
```

**angular.json:**
```json
{
  "architect": {
    "build": {
      "builder": "@angular-builders/custom-webpack:browser",
      "options": {
        "customWebpackConfig": {
          "path": "./extra-webpack.config.js"
        }
      }
    }
  }
}
```

**extra-webpack.config.js:**
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.custom$/,
        use: 'custom-loader'
      }
    ]
  },
  plugins: [
    new CustomPlugin()
  ]
};
```

Use cases:
- Custom loaders for specific file types
- Additional webpack plugins
- Performance optimizations
- Special build requirements

---

### Q14: How do you manage dependencies and optimize vendor chunk in production?
**Answer:**
Optimize how vendor dependencies are bundled:

```json
{
  "architect": {
    "build": {
      "options": {
        "vendorChunk": false,
        "extractLicenses": true,
        "buildOptimizer": true
      },
      "configurations": {
        "production": {
          "fileReplacements": [...],
          "outputHashing": "all"
        }
      }
    }
  }
}
```

**Optimization techniques:**
```typescript
// 1. Use ES modules for better tree shaking
import { sortBy } from 'lodash-es'; // ✓ Good
import * as _ from 'lodash'; // ✗ Avoid

// 2. Lazy load heavy libraries
async loadChart() {
  const chart = await import('chart.js');
  // Use chart
}

// 3. Check dependency sizes
npm list --depth=0
npm audit
```

---

### Q15: How do you implement code splitting and chunk optimization for large applications?
**Answer:**
Break app into smaller downloadable chunks:

```typescript
// Feature module lazy loading
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module')
      .then(m => m.ReportsModule)
  }
];

// Common chunk optimization
{
  "architect": {
    "build": {
      "options": {
        "commonChunk": true
      }
    }
  }
}
```

**Advanced splitting with preload/prefetch:**
```html
<!-- Preload critical chunk -->
<link rel="preload" href="chunk.js" as="script">

<!-- Prefetch non-critical chunk -->
<link rel="prefetch" href="dashboard-chunk.js" as="script">
```

**Bundle analysis:**
```bash
ng build --prod --stats-json
webpack-bundle-analyzer dist/*/stats.json
```

Chunk optimization reduces:
- Initial bundle size
- Time to interactive
- Memory usage
- Browser startup time
