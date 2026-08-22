# Project Structure & Configuration

## Angular.json Configuration

The `angular.json` file contains all CLI and project configuration.

### File Structure

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "my-app": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {},
        "serve": {},
        "test": {},
        "lint": {},
        "extract-i18n": {}
      }
    }
  }
}
```

### Build Configuration

```json
{
  "architect": {
    "build": {
      "builder": "@angular-devkit/build-angular:browser",
      "options": {
        "outputPath": "dist/my-app",
        "index": "src/index.html",
        "main": "src/main.ts",
        "polyfills": ["zone.js"],
        "tsConfig": "tsconfig.app.json",
        "inlineStyleLanguage": "scss",
        "assets": [
          "src/favicon.ico",
          "src/assets"
        ],
        "styles": ["src/styles.scss"],
        "scripts": []
      },
      "configurations": {
        "production": {
          "budgets": [
            {
              "type": "initial",
              "maximumWarning": "500kb",
              "maximumError": "1mb"
            }
          ],
          "outputHashing": "all",
          "aot": true,
          "sourceMap": false
        },
        "development": {
          "buildOptimizer": false,
          "optimization": false,
          "vendorChunk": true,
          "extractLicenses": false,
          "sourceMap": true,
          "namedChunks": true
        }
      }
    }
  }
}
```

### Serve Configuration

```json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "configurations": {
      "production": {
        "buildTarget": "my-app:build:production"
      },
      "development": {
        "buildTarget": "my-app:build:development"
      }
    },
    "defaultConfiguration": "development"
  }
}
```

## TypeScript Configuration

### tsconfig.json (Root)

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "strictBindCallApply": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "lib": ["ES2022", "DOM"],
    "module": "ES2022",
    "target": "ES2022",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "moduleResolution": "node",
    "paths": {
      "@app/*": ["src/app/*"],
      "@environments/*": ["src/environments/*"],
      "@shared/*": ["src/app/shared/*"],
      "@components/*": ["src/app/components/*"],
      "@services/*": ["src/app/services/*"],
      "@models/*": ["src/app/models/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

### tsconfig.app.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.d.ts"]
}
```

### tsconfig.spec.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
```

## Environment Files

### Development (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableDebug: true,
  logLevel: 'debug'
};
```

### Production (environment.prod.ts)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  enableDebug: false,
  logLevel: 'error'
};
```

### Staging (environment.staging.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://staging-api.example.com',
  enableDebug: true,
  logLevel: 'info'
};
```

## Using Configurations

### In angular.json

```json
{
  "serve": {
    "configurations": {
      "production": {},
      "staging": {}
    }
  }
}
```

### Build with Configuration

```bash
# Build for production
ng build --configuration production

# Build for staging
ng build --configuration staging

# Serve with staging config
ng serve --configuration staging
```

## Package.json Scripts

### Common Scripts

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  }
}
```

### Custom Scripts

```json
{
  "scripts": {
    "dev": "ng serve --open",
    "build:prod": "ng build --configuration production",
    "build:staging": "ng build --configuration staging",
    "analyze": "ng build --stats-json && webpack-bundle-analyzer",
    "test:coverage": "ng test --code-coverage",
    "test:watch": "ng test --watch"
  }
}
```

## Other Configuration Files

### .editorconfig

```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

### .browserslistrc

```
last 1 Chrome version
last 1 Firefox version
last 2 Edge major versions
last 2 Safari major versions
last 2 iOS major versions
Firefox ESR
```

### .gitignore

```
# Dependencies
node_modules/
npm-debug.log*

# Build
dist/
/out-tsc

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Angular
.angular/
.angular/cache/

# OS
.DS_Store
Thumbs.db
```

## Path Aliases Configuration

### In tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["src/app/*"],
      "@components/*": ["src/app/components/*"],
      "@services/*": ["src/app/services/*"],
      "@models/*": ["src/app/models/*"],
      "@shared/*": ["src/app/shared/*"],
      "@environments/*": ["src/environments/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

### Usage in Code

```typescript
// Before (relative paths)
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../models/user.model';

// After (path aliases)
import { UserService } from '@services/user.service';
import { UserModel } from '@models/user.model';
```

## Strict Mode Configuration

### Benefits

- Catch errors at compile time
- Require explicit types
- Safer null/undefined handling
- Better overall code quality

### Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "strictBindCallApply": true,
    "noImplicitThis": true
  }
}
```

## Best Practices

✅ Use path aliases for clean imports  
✅ Enable strict mode for type safety  
✅ Configure separate environments  
✅ Use meaningful configuration names  
✅ Document custom configurations  
✅ Version control configuration files  
✅ Use consistent TypeScript settings  

## Key Takeaways

- `angular.json` controls all CLI behavior
- `tsconfig.json` controls TypeScript compilation
- Environment files manage configuration per build
- Path aliases improve code readability
- Strict mode catches errors early
- Proper configuration is foundation for scalable apps
