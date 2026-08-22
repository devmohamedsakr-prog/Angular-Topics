# Build & Deploy Application

**IDE Prompt:** Use this when building for production and deploying.

---

## 🎯 Task: Build Production Bundle and Deploy

**When to use:** Ready to deploy application to production.

---

## 📋 Checklist

- [ ] Build for production
- [ ] Optimize bundle
- [ ] Verify build output
- [ ] Deploy to hosting
- [ ] Verify deployment

---

## 🚀 Step-by-Step Instructions

### Step 1: Production Build

```bash
# Standard production build
ng build --configuration production

# Build output goes to: dist/my-awesome-app/
```

**Build Output:**
```
✔ Browser application bundle generation complete.
✔ Indexed 100 at 1.23 MB.

Build at: 2024-08-22T10:30:45.123Z - Hash: a1b2c3d4e5f6
Initial Chunk Files: main, polyfills, etc.

Lazy Chunk Files: components

Build complete. Watching for file changes...
```

### Step 2: Verify Build Output

```bash
# Check build directory
ls -la dist/my-awesome-app/

# Expected files:
# - index.html (main HTML file)
# - main.{hash}.js (main bundle)
# - polyfills.{hash}.js (polyfills)
# - runtime.{hash}.js (runtime)
# - styles.{hash}.css (global styles)
# - assets/ (static files)
```

### Step 3: Test Production Build Locally

```bash
# Install http-server globally
npm install -g http-server

# Serve production build
http-server dist/my-awesome-app/ -p 8080

# Visit: http://localhost:8080
```

### Step 4: Deploy to Netlify

**Option A: Command Line**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist/my-awesome-app/
```

**Option B: Drag & Drop**

1. Go to https://app.netlify.com
2. Drag `dist/my-awesome-app/` folder to deploy
3. Done! (automatic preview + production)

### Step 5: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 6: Deploy to GitHub Pages

**File:** `angular.json`

```json
{
  "build": {
    "options": {
      "baseHref": "/my-repo-name/"
    }
  }
}
```

**Build:**
```bash
ng build --configuration production --base-href=/my-repo-name/
```

**Deploy using gh-pages:**
```bash
npm install --save-dev angular-cli-ghpages

# Deploy
ngh --dir=dist/my-awesome-app/
```

### Step 7: Environment-Specific Builds

**File:** `src/environments/environment.ts` (development)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

**File:** `src/environments/environment.prod.ts` (production)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com'
};
```

**Use in component:**

```typescript
import { environment } from '../../environments/environment';

export class AppComponent {
  apiUrl = environment.apiUrl;
}
```

### Step 8: Optimize Build Size

**Update angular.json:**

```json
{
  "build": {
    "options": {
      "optimization": true,
      "buildOptimizer": true,
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false
    }
  }
}
```

### Step 9: Monitor Build Performance

```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Build with stats
ng build --stats-json

# Analyze
webpack-bundle-analyzer dist/my-awesome-app/stats.json
```

---

## 🔧 Deployment Hosting Options

| Platform | Cost | Ease | Features |
|----------|------|------|----------|
| **Netlify** | Free tier | Very Easy | Auto deploy from git, CDN |
| **Vercel** | Free tier | Very Easy | Optimized for JS frameworks |
| **GitHub Pages** | Free | Easy | Static hosting with git |
| **Firebase** | Free tier | Medium | Real-time DB + hosting |
| **AWS** | Pay-as-you-go | Medium | Scalable, full control |
| **DigitalOcean** | $5/month | Medium | VPS with full control |

---

## ✅ Deployment Checklist

**Before Deployment:**
- [ ] Build completes without errors
- [ ] No console warnings/errors
- [ ] All tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] Production build tested locally
- [ ] Environment variables configured
- [ ] API endpoints are production URLs

**After Deployment:**
- [ ] Application loads at deployed URL
- [ ] All pages/features work
- [ ] API calls to correct endpoint
- [ ] No 404 errors
- [ ] DevTools console clean
- [ ] Lighthouse score checked

---

## 📊 Build Optimization Tips

1. **Use lazy loading:** Load components only when needed
2. **Tree shaking:** Remove unused code automatically
3. **AOT compilation:** Faster rendering, smaller bundle
4. **Minification:** Reduce file sizes
5. **Compression:** Enable gzip on server
6. **CDN:** Serve static files from CDN

---

## 🔗 Next Steps

Application is now deployed and live!

---

**Estimated Time:** 20-30 minutes  
**Difficulty:** Intermediate-Advanced  
**Prerequisites:** Prompts #1-3 completed  
**Result:** Live deployed application
