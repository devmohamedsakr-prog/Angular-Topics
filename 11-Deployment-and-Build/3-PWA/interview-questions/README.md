# Angular PWA (Progressive Web Apps) - Interview Questions

## Beginner Level

### Q1: What is a Progressive Web App (PWA)?
**Answer:**
A Progressive Web App is a web application that uses modern web capabilities to deliver a user experience similar to native mobile apps.

**Key characteristics:**
- Works offline using service workers
- Installable on home screen
- Fast loading with intelligent caching
- Responsive across devices
- Secure (HTTPS only)
- Push notifications support
- App-like experience

**Benefits:**
- No app store friction
- Smaller than native apps
- Updates seamlessly
- Works everywhere browsers exist
- Better performance on slow networks

**Example PWAs:**
- Twitter Lite
- Spotify
- Pinterest
- Forbes
- Starbucks

---

### Q2: What are the three pillars of a Progressive Web App?
**Answer:**

1. **Reliable**
   - Works offline or on poor connections
   - Instant loading
   - Always responsive
   - Implementation: Service workers, caching

2. **Fast**
   - Quick initial load
   - Smooth animations
   - Fast interactions
   - Implementation: Optimization, caching strategies

3. **Engaging**
   - App-like experience
   - Home screen installation
   - Push notifications
   - Full-screen mode
   - Implementation: Web App Manifest, service workers

---

### Q3: What is a Web App Manifest?
**Answer:**
JSON file that defines how your app appears and behaves when installed.

**Key properties:**
```json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "An awesome PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3367D6",
  "icons": [
    { "src": "icon-192x192.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```

**Display modes:**
- `fullscreen`: Complete app experience, no browser UI
- `standalone`: App-like without address bar
- `minimal-ui`: Minimal browser UI
- `browser`: Normal web page in browser tab

---

### Q4: What is a Service Worker and why is it important for PWAs?
**Answer:**
Service Worker is a JavaScript file that runs in the background, separate from the web page.

**Key capabilities:**
- Intercepts network requests
- Manages caching
- Enables offline functionality
- Handles push notifications
- Performs background sync

**Lifecycle:**
```
Install → Activate → Fetch/Message events → Terminate
```

**Importance for PWAs:**
```typescript
// Service Worker intercepts requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

### Q5: How do you add PWA support to an Angular app?
**Answer:**
Use Angular's built-in PWA module:

```bash
# Add PWA support
ng add @angular/pwa

# Creates:
# - manifest.webmanifest
# - ngsw-config.json
# - Service worker files
# - Icons in assets folder
```

**In index.html:**
```html
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#3367D6">
```

**In app.module.ts:**
```typescript
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ]
})
export class AppModule {}
```

---

## Intermediate Level

### Q6: What are the main caching strategies for PWAs?
**Answer:**

1. **Cache First**
   - Check cache first, fallback to network
   - Best for static assets
   - Fast but may serve stale data

```typescript
async cacheFirst(request) {
  const cache = await caches.open('cache-v1');
  const cached = await cache.match(request);
  if (cached) return cached;
  
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}
```

2. **Network First**
   - Try network first, fallback to cache
   - Best for API calls
   - Fresher data, works offline

```typescript
async networkFirst(request) {
  const cache = await caches.open('cache-v1');
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return cache.match(request);
  }
}
```

3. **Stale While Revalidate**
   - Return cached immediately, update in background
   - Best for most content
   - Fast and keeps data fresh

```typescript
async staleWhileRevalidate(request) {
  const cache = await caches.open('cache-v1');
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });
  
  return cached || fetchPromise;
}
```

4. **Network Only**
   - Always fetch from network
   - No offline support
   - Guarantees latest data

---

### Q7: How do you handle app updates in a PWA?
**Answer:**
Use Angular's SwUpdate service:

```typescript
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class UpdateService {
  constructor(private swUpdate: SwUpdate) {
    this.checkForUpdates();
  }

  checkForUpdates(): void {
    // Check periodically (every 1 hour)
    setInterval(() => {
      this.swUpdate.checkForUpdate();
    }, 60 * 60 * 1000);

    // Listen for updates
    this.swUpdate.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') {
        this.promptUserToUpdate();
      }
    });
  }

  promptUserToUpdate(): void {
    const confirmed = confirm('New version available! Refresh?');
    if (confirmed) {
      this.swUpdate.activateUpdate().then(() => {
        window.location.reload();
      });
    }
  }
}
```

---

### Q8: How do you implement install prompts for PWAs?
**Answer:**
Handle the `beforeinstallprompt` event:

```typescript
@Component({
  selector: 'app-install'
})
export class InstallComponent implements OnInit {
  showPrompt = false;
  deferredPrompt: any;

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showPrompt = true;
    });
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const result = await this.deferredPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      console.log('User accepted install');
    }
    
    this.deferredPrompt = null;
    this.showPrompt = false;
  }
}
```

---

### Q9: How do you detect online/offline status?
**Answer:**
Monitor network connectivity changes:

```typescript
@Injectable()
export class NetworkService {
  isOnline$ = new BehaviorSubject(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline$.next(true);
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline$.next(false);
    });
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  private syncOfflineData(): void {
    // Sync queued requests
    console.log('Syncing offline data');
  }
}

// Usage
@Component({
  template: `
    <div *ngIf="!(networkService.isOnline$ | async)">
      You are offline. Some features may be unavailable.
    </div>
  `
})
export class AppComponent {
  constructor(public networkService: NetworkService) {}
}
```

---

### Q10: How do you configure ngsw-config.json for caching?
**Answer:**
Define asset groups and data groups:

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "lazy",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(svg|cur|jpg|jpeg|png|apng|webp|gif|otf|ttf|woff|woff2)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-performance",
      "urls": ["/api/products"],
      "cacheConfig": {
        "strategy": "performance",
        "maxAge": "1d",
        "maxSize": 100
      }
    },
    {
      "name": "api-freshness",
      "urls": ["/api/latest/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxAge": "5m",
        "timeout": "5s"
      }
    }
  ]
}
```

---

## Advanced Level

### Q11: How do you implement background sync in PWAs?
**Answer:**
Queue actions for sync when connection returns:

```typescript
@Injectable()
export class BackgroundSyncService {
  constructor(private http: HttpClient) {}

  /**
   * Register background sync tag
   */
  async registerSync(tag: string): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      try {
        await (registration as any).sync.register(tag);
      } catch (error) {
        console.error('Sync registration failed', error);
      }
    }
  }

  /**
   * Queue action for sync
   */
  queueForSync(action: any): void {
    const queue = JSON.parse(localStorage.getItem('sync-queue') || '[]');
    queue.push({ ...action, timestamp: Date.now() });
    localStorage.setItem('sync-queue', JSON.stringify(queue));
    
    this.registerSync('sync-data');
  }

  /**
   * Process sync queue (in service worker)
   */
  async processSyncQueue(): Promise<void> {
    const queue = JSON.parse(localStorage.getItem('sync-queue') || '[]');

    for (const item of queue) {
      try {
        await this.http.post('/api/sync', item).toPromise();
      } catch (error) {
        console.error('Sync failed', error);
        return; // Stop on first failure
      }
    }

    localStorage.removeItem('sync-queue');
  }
}

// In service worker (sw.js)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(processSyncQueue());
  }
});
```

---

### Q12: How do you implement push notifications in PWAs?
**Answer:**
Setup notifications with service worker:

```typescript
@Injectable()
export class PushNotificationService {
  constructor(private http: HttpClient) {}

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission !== 'granted') {
      return Notification.requestPermission();
    }

    return 'granted';
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(): Promise<void> {
    const permission = await this.requestPermission();
    if (permission !== 'granted') return;

    const registration = await navigator.serviceWorker.ready;
    
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array('PUBLIC_KEY')
      });

      // Send subscription to server
      await this.http.post('/api/notifications/subscribe', subscription)
        .toPromise();
    } catch (error) {
      console.error('Push subscription failed', error);
    }
  }

  /**
   * Show local notification
   */
  showNotification(title: string, options?: NotificationOptions): void {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, options);
    });
  }

  private urlBase64ToUint8Array(base64: string): Uint8Array {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const base64Str = (base64 + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64Str);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// In service worker
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        badge: data.badge
      })
    );
  }
});
```

---

### Q13: How do you implement App Shell architecture?
**Answer:**
Minimal UI that loads instantly, app content loads async:

```typescript
// app.component.ts - App Shell
@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <app-sidebar></app-sidebar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}

// In angular.json - build app shell
{
  "architect": {
    "app-shell": {
      "builder": "@angular-devkit/build-angular:app-shell",
      "options": {
        "browserTarget": "app:build",
        "serverTarget": "app:server",
        "route": "shell"
      }
    }
  }
}

// Build command
ng run app:app-shell

// Benefits:
// - Instant UI for known structure
// - Reduces Time to First Byte
// - Better perceived performance
// - Works offline
```

---

### Q14: How do you precache critical assets in PWAs?
**Answer:**
Specify assets to install immediately:

```json
{
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/index.html",
          "/styles/main.css",
          "/scripts/app.js",
          "/assets/logo.png",
          "/assets/icons/icon-192x192.png"
        ]
      }
    }
  ]
}
```

**Prefetch vs Lazy:**
- `prefetch`: Download immediately on service worker installation
- `lazy`: Download only when accessed

**Strategies:**
```typescript
// Prefetch critical API endpoints
const criticalAssets = [
  '/api/config',
  '/api/user',
  '/assets/app-data.json'
];

@Injectable()
export class PrecacheService {
  async precacheAssets(urls: string[]): Promise<void> {
    const cache = await caches.open('precache-v1');
    await cache.addAll(urls);
  }
}
```

---

### Q15: How do you test PWAs locally and debug service workers?
**Answer:**
Tools and techniques for PWA testing:

```bash
# Build production
ng build --prod

# Serve locally with HTTPS
npm install -g http-server
http-server -c-1 -o -p 8443 --https -S dist/app
```

**Debug in Chrome DevTools:**
```
1. Open DevTools (F12)
2. Go to Application tab
3. Service Workers section:
   - View registered workers
   - Unregister workers
   - Check offline mode
   - View cache storage

4. Cache Storage:
   - Inspect cached responses
   - Delete caches
   - Update caches

5. Manifest:
   - View manifest.webmanifest
   - Validate manifest

6. Network throttling:
   - Simulate slow networks
   - Test offline mode
```

**Lighthouse PWA Audit:**
```bash
# Run Lighthouse
npm install -g lighthouse
lighthouse https://localhost:8443 --view

# Checks:
# - Web App Manifest
# - HTTPS
# - Service Worker
# - Installability
# - Network connectivity
# - Performance metrics
```

**Testing offline:**
```typescript
// In Chrome DevTools
1. Application → Service Workers
2. Check "Offline" checkbox
3. Reload page
4. Should work without network

// Or programmatically
await caches.delete('cache-name');
// Clear specific cache
```

**Lighthouse PWA Score Checklist:**
- ✓ Web app manifest exists
- ✓ HTTPS enabled
- ✓ Service worker registered
- ✓ App can be installed
- ✓ Viewport meta tag
- ✓ Icons present
- ✓ Works offline
- ✓ Responsive design
- ✓ Color scheme
- ✓ No console errors
