# Angular CLI and Setup

## Angular CLI Overview
The Angular Command Line Interface (CLI) is the official tool for developing, building, and deploying Angular applications. It automates project setup, generates components, and optimizes the build process.

## Installation

```bash
# Install Node.js first (includes npm)
# Then install Angular CLI globally
npm install -g @angular/cli

# Verify installation
ng version

# Check for updates
ng update
```

## Creating a New Project

```bash
# Create new Angular project with routing and styling
ng new my-app
# Answer prompts:
# - Add routing? Yes
# - Which stylesheet format? (CSS, SCSS, SASS, LESS)

# Navigate to project
cd my-app

# Start development server
ng serve

# Serve on specific port
ng serve --port 4201

# Serve with host configuration
ng serve --host 0.0.0.0
```

## Project Structure

```
my-app/
├── src/
│   ├── app/                      # Main application folder
│   │   ├── app.component.ts      # Root component
│   │   ├── app.component.html    # Root template
│   │   ├── app.component.css     # Root styles
│   │   ├── app.module.ts         # Root module (if using NgModules)
│   │   └── app.routing.module.ts # Routing configuration
│   ├── assets/                   # Static assets
│   ├── environments/             # Environment configs
│   │   ├── environment.ts        # Development
│   │   └── environment.prod.ts   # Production
│   ├── main.ts                   # Application entry point
│   ├── index.html                # HTML root file
│   └── styles.css                # Global styles
├── angular.json                  # CLI configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md
```

## Common CLI Commands

### Generating Components, Services, etc.

```bash
# Generate component
ng generate component components/user-list
ng g c components/user-list # shorthand

# Generate service
ng generate service services/user
ng g s services/user

# Generate module
ng generate module modules/admin
ng g m modules/admin

# Generate routing module
ng generate module modules/admin --routing

# Generate directive
ng generate directive directives/highlight
ng g d directives/highlight

# Generate pipe
ng generate pipe pipes/custom-filter
ng g p pipes/custom-filter

# Generate guard
ng generate guard guards/auth
ng g g guards/auth

# Generate interceptor
ng generate interceptor interceptors/auth
ng g i interceptors/auth

# Generate interface
ng generate interface models/user
ng g i models/user

# Generate enum
ng generate enum models/role
```

### Building

```bash
# Build for production
ng build

# Build with specific configuration
ng build --configuration production

# Build with source maps for debugging
ng build --source-map

# Analyze bundle size
ng build --stats-json
# Use Webpack Bundle Analyzer
webpack-bundle-analyzer dist/my-app/stats.json
```

### Testing and Quality

```bash
# Run unit tests
ng test

# Run tests with code coverage
ng test --code-coverage

# Run E2E tests
ng e2e

# Lint code
ng lint
```

### Deployment

```bash
# Build for production
ng build --configuration production

# Preview production build locally
npx serve dist/my-app
```

## Angular.json Configuration

Key sections:

```json
{
  "projects": {
    "my-app": {
      "prefix": "app",           // Component selector prefix
      "root": "",
      "sourceRoot": "src",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/my-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/assets"],
            "styles": ["src/styles.css"],
            "scripts": []
          }
        },
        "serve": {},
        "test": {},
        "lint": {},
        "extract-i18n": {}
      }
    }
  }
}
```

## TypeScript Configuration (tsconfig.json)

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "alwaysStrict": true,
    "lib": ["ES2020", "DOM"],
    "module": "ES2020",
    "target": "ES2020",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "paths": {
      "@app/*": ["src/app/*"],
      "@environments/*": ["src/environments/*"],
      "@shared/*": ["src/app/shared/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false
  }
}
```

## Environment Configuration

### environment.ts (Development)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### environment.prod.ts (Production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com'
};
```

### Using Environment Configuration
```typescript
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  apiUrl = environment.apiUrl;
  
  isProduction = environment.production;
}
```

## Development Workflow Tips

### File Organization
- Keep components in `src/app/components/`
- Services in `src/app/services/`
- Models/Interfaces in `src/app/models/`
- Pipes in `src/app/pipes/`
- Guards in `src/app/guards/`
- Interceptors in `src/app/interceptors/`

### Path Aliases
Use path aliases in tsconfig.json for cleaner imports:

```typescript
// Before
import { UserService } from '../../../services/user.service';

// After
import { UserService } from '@app/services/user.service';
```

### Workspace Configuration
For monorepo setup with multiple apps:

```bash
ng generate application admin-app
ng generate library shared-lib

# Build library
ng build shared-lib

# Build specific app
ng build admin-app
```

## Performance Tips

1. **Code Splitting** - CLI automatically chunks code for lazy-loaded modules
2. **Tree Shaking** - Remove unused code in production builds
3. **Ahead-of-Time (AOT) Compilation** - Enabled by default in production
4. **Minification and Uglification** - Automatically applied in production
5. **Source Maps** - Use selectively in production for debugging

## Best Practices

1. **Use strict mode** - Catch more errors at compile time
2. **Use path aliases** - Improve code readability and maintainability
3. **Organize code logically** - Follow Angular style guide structure
4. **Use Angular CLI generators** - Maintains consistency and best practices
5. **Version dependencies carefully** - Use package-lock.json or yarn.lock
6. **Keep angular.json clean** - Only include necessary scripts and assets
7. **Use environment files** - Different configurations for different builds

## Troubleshooting

### Port already in use
```bash
ng serve --port 4300
```

### Clear cache and dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Fix peer dependency warnings
```bash
npm install --legacy-peer-deps
```

### Update Angular
```bash
ng update @angular/cli @angular/core
```

## Key Takeaways

- Angular CLI is essential for Angular development
- Use generators to maintain consistency
- Understand project structure for better organization
- Configure environment files for different deployments
- Leverage CLI build optimizations for performance
- Follow Angular style guide conventions
