# Production Build and Optimization

## Building for Production

```bash
# Build for production
ng build --configuration production

# Or with new syntax (Angular 12+)
ng build -c production

# Build with specific environment
ng build --configuration staging
```

## Angular.json Build Configuration

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "outputHashing": "all",
              "aot": true,
              "optimization": true,
              "buildOptimizer": true,
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false
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
  }
}
```

## Optimization Techniques

### 1. Tree Shaking
Removes unused code automatically in production builds.

### 2. Lazy Loading
Load feature modules only when needed:

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule)
  },
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module')
      .then(m => m.FeatureModule)
  }
];
```

### 3. Code Splitting
Angular CLI automatically chunks code for lazy-loaded routes.

### 4. Ahead-of-Time (AOT) Compilation
Compiles templates at build time (default in production).

### 5. Minification and Uglification
Enabled by default in production builds.

## Performance Optimization

### Bundle Analysis

```bash
# Generate bundle statistics
ng build -c production --stats-json

# Analyze with webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/my-app/stats.json
```

### Remove Unused Polyfills

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM"],
    "target": "ES2020"
  }
}
```

### Service Worker

```bash
# Add service worker support
ng add @angular/service-worker
```

```typescript
// app.module.ts
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ]
})
export class AppModule {}
```

## Docker Deployment

```dockerfile
# Dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist/my-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# docker-compose.yml
version: '3'
services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --watch=false --browsers=ChromeHeadless
      
      - name: Build
        run: npm run build -- --configuration production
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: my-project
```

## Environment Configuration

```typescript
// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  apiKey: 'prod-key',
  enableAnalytics: true,
  enableDebug: false
};

// Using in component
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  apiUrl = environment.apiUrl;
  
  log(message: string) {
    if (!environment.production) {
      console.log(message);
    }
  }
}
```

## Server Configuration

### Nginx Configuration

```nginx
# nginx.conf
server {
  listen 80;
  server_name example.com;

  root /usr/share/nginx/html;
  index index.html;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;

  # Cache static assets
  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # SPA routing - redirect to index.html
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
  add_header Content-Security-Policy "default-src 'self';" always;
}
```

## Monitoring and Error Tracking

### Sentry Integration

```bash
npm install --save @sentry/angular
```

```typescript
// main.ts
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "https://your-key@sentry.io/your-project",
  environment: environment.production ? 'production' : 'development',
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

## Performance Metrics

```typescript
// Google Analytics
import { GoogleAnalyticsService } from '@your-lib/google-analytics';

@Component({})
export class AppComponent implements OnInit {
  constructor(private ga: GoogleAnalyticsService) {}

  ngOnInit() {
    // Track performance metrics
    if (performance.timing) {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      this.ga.trackTiming({
        category: 'Page',
        variable: 'Load Time',
        value: pageLoadTime
      });
    }
  }
}
```

## Deployment Checklist

- ✓ Run `ng build --configuration production`
- ✓ Test build locally: `npx serve dist/my-app`
- ✓ Verify bundle size
- ✓ Test with Chrome DevTools in production mode
- ✓ Set environment variables
- ✓ Configure CORS
- ✓ Set security headers
- ✓ Enable HTTPS
- ✓ Configure redirects and 404s
- ✓ Set up monitoring
- ✓ Configure backups
- ✓ Document deployment process

## Key Takeaways

- Production builds are optimized for performance
- AOT compilation and tree-shaking reduce bundle size
- Lazy loading improves initial load time
- Docker enables consistent deployments
- CI/CD pipelines automate testing and deployment
- Server configuration is critical for SPA routing
- Security headers protect against attacks
- Monitoring and analytics provide visibility
