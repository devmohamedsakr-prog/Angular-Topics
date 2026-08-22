# Creating & Serving Angular Projects

## Creating a New Project

### Basic Project Creation

```bash
# Create new Angular project
ng new my-app

# Navigate to project
cd my-app

# Start development server
ng serve
```

### Advanced Project Creation

```bash
# Skip git initialization
ng new my-app --skip-git

# Skip npm install
ng new my-app --skip-install

# Create project with specific options
ng new my-app \
  --routing \
  --style=scss \
  --skip-git \
  --package-manager=npm
```

### Project Creation Options

| Option | Purpose | Example |
|--------|---------|---------|
| `--routing` | Add routing module | `ng new app --routing` |
| `--style` | CSS preprocessor | `ng new app --style=scss` |
| `--skip-git` | Don't initialize git | `ng new app --skip-git` |
| `--skip-install` | Don't run npm install | `ng new app --skip-install` |
| `--prefix` | Component selector prefix | `ng new app --prefix=custom` |
| `--package-manager` | Use npm/yarn/pnpm | `ng new app --package-manager=yarn` |
| `--strict` | Enable strict mode | `ng new app --strict` |
| `--inline-style` | Inline component styles | `ng new app --inline-style` |
| `--inline-template` | Inline component templates | `ng new app --inline-template` |

## Serving Your Application

### Start Development Server

```bash
# Start on default port (4200)
ng serve

# With detailed output
ng serve --verbose

# Watch for changes and rebuild
ng serve --watch
```

### Server Configuration

```bash
# Serve on specific port
ng serve --port 4201

# Serve on specific host
ng serve --host 0.0.0.0

# Combined
ng serve --port 4201 --host 192.168.1.100

# Allow external access
ng serve --host 0.0.0.0 --port 4200 --disable-host-check
```

### Development Options

```bash
# Disable browser auto-open
ng serve --open=false

# Enable poll mode for file changes
ng serve --poll 2000

# Build with source maps (enabled by default)
ng serve --source-map

# Serve without rebuilding
ng serve --watch=false

# Open browser automatically
ng serve --open
```

## Project Structure

### Directory Layout

```
my-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts      # Root component
│   │   ├── app.component.html    # Root template
│   │   ├── app.component.scss    # Component styles
│   │   ├── app.component.spec.ts # Component tests
│   │   └── app.module.ts         # Root module
│   ├── assets/                   # Static files
│   ├── environments/             # Environment configs
│   │   ├── environment.ts        # Development
│   │   └── environment.prod.ts   # Production
│   ├── main.ts                   # Application entry point
│   ├── index.html                # HTML root
│   ├── styles.scss               # Global styles
│   └── favicon.ico               # Browser icon
├── angular.json                  # CLI config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tsconfig.app.json             # App TypeScript config
├── karma.conf.js                 # Test config
└── README.md
```

### Recommended Organization

```
src/app/
├── components/           # Reusable components
│   ├── header/
│   └── footer/
├── pages/               # Page/route components
│   ├── home/
│   └── about/
├── services/            # Business logic
│   ├── user.service.ts
│   └── api.service.ts
├── models/              # Interfaces/types
│   └── user.model.ts
├── pipes/               # Custom pipes
│   └── custom-filter.pipe.ts
├── directives/          # Custom directives
│   └── highlight.directive.ts
├── guards/              # Route guards
│   └── auth.guard.ts
├── interceptors/        # HTTP interceptors
│   └── auth.interceptor.ts
└── shared/              # Shared utilities
    └── constants.ts
```

## Working with Projects

### Install Dependencies

```bash
# Install from package.json
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Install Angular update
ng update @angular/core @angular/cli
```

### Development Workflow

```bash
# 1. Start development server
ng serve

# 2. Open http://localhost:4200 in browser

# 3. Edit files - automatically reloads

# 4. Check console for errors

# 5. Make changes and see them live
```

### Environment Setup

#### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

#### Production (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com'
};
```

#### Using Environment
```typescript
import { environment } from '@environments/environment';

export class ConfigService {
  apiUrl = environment.apiUrl;
  isProduction = environment.production;
}
```

## Troubleshooting

### Port Already in Use

```bash
# Use different port
ng serve --port 4300

# Find process using port (Windows)
netstat -ano | findstr :4200

# Find process using port (Mac/Linux)
lsof -i :4200

# Kill process (Mac/Linux)
kill -9 <PID>
```

### Changes Not Reflecting

```bash
# Full rebuild
ng serve --poll=2000

# Clear cache and rebuild
rm -rf .angular/cache
ng serve
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
npm install
```

## Performance Tips

1. **Lazy Loading** - Load modules on demand
2. **OnPush Detection** - Use ChangeDetectionStrategy.OnPush
3. **Tree Shaking** - Remove unused code
4. **Code Splitting** - Automatically done for lazy routes
5. **Minification** - Applied in production

## Best Practices

✅ Use consistent naming conventions  
✅ Organize code by feature/module  
✅ Keep components small and focused  
✅ Use path aliases for imports  
✅ Leverage environment files  
✅ Use `ng generate` for consistency  
✅ Version Node.js with nvm  
✅ Document setup process  

## Key Takeaways

- Use `ng new` for consistent project setup
- `ng serve` provides live reload development
- Understand project structure for better organization
- Use environment files for configuration
- Organize code by feature for maintainability
