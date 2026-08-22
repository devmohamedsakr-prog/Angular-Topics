# Testing, Deployment & Best Practices

## Testing with Angular CLI

### Unit Testing

```bash
# Run unit tests
ng test

# Run once (no watch)
ng test --watch=false

# Run with code coverage
ng test --code-coverage

# Run specific test file
ng test --include='**/user.service.spec.ts'

# Run with specific browser
ng test --browsers=Chrome
```

### E2E Testing

```bash
# Run end-to-end tests
ng e2e

# Run specific test suite
ng e2e --suite=login

# Run with specific browser
ng e2e --browsers=chrome
```

### Code Coverage

```bash
# Generate coverage report
ng test --code-coverage

# Coverage output
coverage/
├── index.html          # HTML report
├── lcov.info          # LCOV format
└── lcov-report/       # Detailed report
```

### Test Configuration

In `karma.conf.js`:

```javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher')
    ],
    client: {
      jasmine: {
        random: false  // Run tests in order
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

## Linting

### Run Linter

```bash
# Lint all files
ng lint

# Lint specific file
ng lint src/app/user.service.ts

# Fix issues automatically
ng lint --fix

# Show more details
ng lint --verbose
```

### ESLint Configuration

In `.eslintrc.json`:

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "parserOptions": {
        "project": ["tsconfig.json"],
        "createDefaultProgram": true
      },
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ]
      }
    }
  ]
}
```

## Deployment

### Build for Production

```bash
# Create optimized build
ng build --configuration production

# Output in dist/my-app/
```

### Deploy to Static Host (Vercel, Netlify, GitHub Pages)

```bash
# Install deployment tool
npm install -g vercel

# Deploy
vercel

# Or for GitHub Pages
npm run build
npx angular-cli-ghpages --dir=dist/my-app
```

### Deploy to Traditional Server

```bash
# Copy dist folder to server
scp -r dist/my-app/ user@server:/var/www/html/

# Or with rsync
rsync -av dist/my-app/ user@server:/var/www/html/
```

### Configure for Subpath

If deploying to `example.com/app/`:

In `angular.json`:

```json
{
  "build": {
    "options": {
      "baseHref": "/app/"
    }
  }
}
```

### Docker Deployment

```dockerfile
# Build stage
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist/my-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Best Practices

### Code Organization

✅ Organize by feature, not by type  
✅ Keep components small and focused  
✅ Use shared module for common utilities  
✅ Create barrel exports (index.ts) for modules  
✅ Follow Angular style guide naming conventions

### Performance

✅ Enable production mode in builds  
✅ Use OnPush change detection  
✅ Implement lazy loading for routes  
✅ Use trackBy function in *ngFor  
✅ Unsubscribe from observables  
✅ Avoid memory leaks with destroy pattern

### Security

✅ Always use production builds  
✅ Keep dependencies updated  
✅ Use strict mode for type safety  
✅ Sanitize user input (Angular handles in templates)  
✅ Use HttpClient for secure communication  
✅ Store sensitive data securely

### Testing

✅ Write unit tests for services  
✅ Test components with mocked dependencies  
✅ Aim for 80%+ code coverage  
✅ Write E2E tests for critical flows  
✅ Test error scenarios  
✅ Mock external dependencies

### Development Workflow

✅ Use version control (git)  
✅ Create feature branches  
✅ Write meaningful commit messages  
✅ Use linting and formatting (Prettier, ESLint)  
✅ Document API and components  
✅ Set up CI/CD pipeline  
✅ Use pre-commit hooks

### Deployment

✅ Automate builds and deployments  
✅ Test builds in CI before deploy  
✅ Keep main/master deployable  
✅ Use environment-specific configurations  
✅ Monitor application after deployment  
✅ Have rollback plan ready  
✅ Use CDN for static assets

## Common Workflows

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Run tests
npm test

# Check linting
npm run lint
```

### Before Commit

```bash
# Format code
npx prettier --write "src/**/*.ts"

# Lint
ng lint --fix

# Run tests
ng test --watch=false

# Build to verify
ng build
```

### Before Deployment

```bash
# Full rebuild
npm install

# Run all checks
ng lint
ng test --watch=false

# Build for production
ng build --configuration production

# Analyze size
ng build --configuration production --stats-json
webpack-bundle-analyzer dist/my-app/stats.json

# Test production build locally
serve dist/my-app
```

## Troubleshooting Deployment

### Blank Page After Deploy

- Check browser console for errors
- Verify baseHref is correct
- Check network requests
- Enable source maps temporarily

### 404 Errors on Refresh

- Configure server for SPA (single-page application)
- All routes should redirect to index.html

### Nginx Configuration

```nginx
server {
  listen 80;
  server_name example.com;

  root /usr/share/nginx/html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache busting for long-lived assets
  location ~* \.(?:css|js|svg|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Don't cache HTML
  location ~* \.(?:html)$ {
    expires 0;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }
}
```

### Apache Configuration

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Key Takeaways

- Use `ng test` for unit tests and coverage
- Production builds are optimized and minified
- Follow Angular style guide conventions
- Automate testing and deployment
- Monitor applications after deployment
- Keep security and performance in mind
- Document processes for team consistency
