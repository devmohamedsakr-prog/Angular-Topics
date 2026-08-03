/**
 * Angular PWA (Progressive Web Apps) Examples
 * 
 * Covers:
 * - Service worker setup and caching strategies
 * - Web app manifest configuration
 * - Offline functionality
 * - Installation prompts
 * - Background sync and push notifications
 * - PWA update strategies
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ============================================================================
// 1. WEB APP MANIFEST CONFIGURATION
// ============================================================================

/**
 * manifest.webmanifest - Define app identity and launch settings
 */
export const webAppManifest = {
  name: 'My Progressive Web App',
  short_name: 'MyPWA',
  description: 'A great progressive web app',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#3367D6',
  orientation: 'portrait-primary',
  scope: '/',
  icons: [
    {
      src: '/assets/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/assets/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/assets/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/assets/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/assets/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/assets/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/assets/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/assets/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: '/assets/icons/icon-maskable-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    }
  ],
  screenshots: [
    {
      src: '/assets/screenshots/screenshot1.png',
      sizes: '540x720',
      type: 'image/png',
      form_factor: 'narrow'
    },
    {
      src: '/assets/screenshots/screenshot2.png',
      sizes: '1280x720',
      type: 'image/png',
      form_factor: 'wide'
    }
  ],
  shortcuts: [
    {
      name: 'New Task',
      short_name: 'Task',
      description: 'Create a new task',
      url: '/new-task',
      icons: [
        {
          src: '/assets/icons/task-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        }
      ]
    }
  ],
  categories: ['productivity', 'utilities']
};

// ============================================================================
// 2. SERVICE WORKER REGISTRATION & MANAGEMENT
// ============================================================================

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private destroy$ = new Subject<void>();

  constructor(private swUpdate: SwUpdate) {
    this.setupServiceWorker();
    this.checkForUpdates();
  }

  /**
   * Register service worker
   */
  private setupServiceWorker(): void {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers not supported');
      return;
    }

    navigator.serviceWorker.register('/ngsw-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
        this.setupServiceWorkerEvents(registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }

  /**
   * Setup service worker event listeners
   */
  private setupServiceWorkerEvents(registration: ServiceWorkerRegistration): void {
    // Listen for updates
    if (registration.waiting) {
      this.notifyUpdate(registration.waiting);
    }

    registration.onupdatefound = () => {
      const newWorker = registration.installing!;
      newWorker.onstatechange = () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.notifyUpdate(newWorker);
        }
      };
    };
  }

  /**
   * Check for updates using Angular's SwUpdate
   */
  private checkForUpdates(): void {
    this.swUpdate.versionUpdates
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        console.log('Update event:', event);
        
        if (event.type === 'VERSION_READY') {
          console.log('New app version available');
          this.promptUserToRefresh();
        }
      });
  }

  /**
   * Notify user of update
   */
  private notifyUpdate(worker: ServiceWorker): void {
    console.log('New service worker available');
    // Show notification to user
  }

  /**
   * Prompt user to refresh for new version
   */
  private promptUserToRefresh(): void {
    const shouldRefresh = confirm('New version available! Refresh?');
    if (shouldRefresh) {
      window.location.reload();
    }
  }

  /**
   * Check online/offline status
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Listen to online/offline changes
   */
  subscribeToNetworkStatus() {
    window.addEventListener('online', () => console.log('Back online'));
    window.addEventListener('offline', () => console.log('Gone offline'));
  }

  /**
   * Unregister service worker (rarely needed)
   */
  unregisterServiceWorker(): void {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// 3. INSTALL PROMPT AND APP INSTALLATION
// ============================================================================

/**
 * Component handling app installation prompt
 */
@Component({
  selector: 'app-install-prompt',
  template: `
    <div *ngIf="showInstallPrompt" class="install-banner">
      <div class="install-content">
        <h3>Install App</h3>
        <p>Install our app for faster access and offline support</p>
      </div>
      <div class="install-actions">
        <button (click)="installApp()">Install</button>
        <button (click)="dismissPrompt()">Dismiss</button>
      </div>
    </div>
  `,
  styles: [`
    .install-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      margin: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .install-content h3 {
      margin: 0 0 8px 0;
    }
    .install-content p {
      margin: 0;
      opacity: 0.9;
    }
    .install-actions {
      display: flex;
      gap: 8px;
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    button:first-child {
      background: white;
      color: #667eea;
    }
    button:last-child {
      background: rgba(255,255,255,0.3);
      color: white;
    }
  `]
})
export class InstallPromptComponent implements OnInit {
  showInstallPrompt = false;
  private deferredPrompt: any;

  ngOnInit() {
    this.setupInstallPrompt();
  }

  /**
   * Setup install prompt event listener
   */
  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallPrompt = true;
    });

    window.addEventListener('appinstalled', () => {
      console.log('App installed');
      this.showInstallPrompt = false;
    });
  }

  /**
   * Trigger installation
   */
  installApp(): void {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install prompt');
      } else {
        console.log('User dismissed install prompt');
      }
      this.deferredPrompt = null;
      this.showInstallPrompt = false;
    });
  }

  /**
   * Dismiss install prompt
   */
  dismissPrompt(): void {
    this.showInstallPrompt = false;
  }
}

// ============================================================================
// 4. OFFLINE DETECTION & FALLBACK
// ============================================================================

/**
 * Component showing offline/online status
 */
@Component({
  selector: 'app-connection-status',
  template: `
    <div [class.status-banner]="true" [class.offline]="!isOnline">
      <span *ngIf="!isOnline" class="status-icon">⚠️</span>
      <span *ngIf="isOnline" class="status-icon">✓</span>
      {{ isOnline ? 'Online' : 'Offline - Limited functionality' }}
    </div>
  `,
  styles: [`
    .status-banner {
      padding: 8px 16px;
      background: #4caf50;
      color: white;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .status-banner.offline {
      background: #f44336;
    }
    .status-icon {
      font-size: 20px;
    }
  `]
})
export class ConnectionStatusComponent implements OnInit, OnDestroy {
  isOnline = navigator.onLine;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Connection restored');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Connection lost');
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// 5. CACHING STRATEGIES IN SERVICE WORKER
// ============================================================================

/**
 * Service worker caching strategy configuration
 * (This would be in ngsw-config.json)
 */
export const ngswConfig = {
  $schema: './node_modules/@angular/service-worker/config/schema.json',
  index: '/index.html',
  assetGroups: [
    {
      name: 'app',
      installMode: 'prefetch',
      resources: {
        files: [
          '/favicon.ico',
          '/index.html',
          '/*.css',
          '/*.js'
        ]
      }
    },
    {
      name: 'assets',
      installMode: 'lazy',
      updateMode: 'lazy',
      resources: {
        files: [
          '/assets/**',
          '/*.(svg|cur|jpg|jpeg|png|apng|webp|gif|otf|ttf|woff|woff2)'
        ]
      }
    }
  ],
  dataGroups: [
    {
      name: 'api-performance',
      urls: ['/api/products', '/api/users'],
      cacheConfig: {
        strategy: 'performance',
        maxAge: '1d',
        maxSize: 100
      }
    },
    {
      name: 'api-freshness',
      urls: ['/api/latest/**'],
      cacheConfig: {
        strategy: 'freshness',
        maxAge: '10m',
        maxSize: 50,
        timeout: '5s'
      }
    }
  ]
};

// ============================================================================
// 6. CUSTOM SERVICE WORKER FOR CACHING
// ============================================================================

/**
 * Custom caching service for advanced strategies
 */
@Injectable({
  providedIn: 'root'
})
export class CustomCacheService {
  private cacheName = 'app-cache-v1';

  /**
   * Cache First strategy - use cache, fallback to network
   */
  async cacheFirst(request: Request): Promise<Response> {
    const cache = await caches.open(this.cacheName);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      throw new Error('Network request failed');
    }
  }

  /**
   * Network First strategy - try network, fallback to cache
   */
  async networkFirst(request: Request): Promise<Response> {
    const cache = await caches.open(this.cacheName);

    try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request);
      return cached || new Response('Offline');
    }
  }

  /**
   * Stale While Revalidate - return cache, update in background
   */
  async staleWhileRevalidate(request: Request): Promise<Response> {
    const cache = await caches.open(this.cacheName);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then(response => {
      cache.put(request, response.clone());
      return response;
    });

    return cached || fetchPromise;
  }

  /**
   * Precache critical assets
   */
  async precacheAssets(urls: string[]): Promise<void> {
    const cache = await caches.open(this.cacheName);
    await cache.addAll(urls);
  }

  /**
   * Clear old caches
   */
  async clearOldCaches(): Promise<void> {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name !== this.cacheName)
        .map(name => caches.delete(name))
    );
  }
}

// ============================================================================
// 7. BACKGROUND SYNC
// ============================================================================

/**
 * Service for handling background sync
 */
@Injectable({
  providedIn: 'root'
})
export class BackgroundSyncService {
  /**
   * Register background sync event
   */
  async registerSync(tag: string): Promise<void> {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      try {
        await (registration as any).sync.register(tag);
        console.log(`Background sync registered for: ${tag}`);
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  /**
   * Queue data for sync when offline
   */
  queueForSync(data: any): void {
    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    queue.push({
      ...data,
      timestamp: Date.now()
    });
    localStorage.setItem('syncQueue', JSON.stringify(queue));
    
    this.registerSync('background-sync');
  }

  /**
   * Process sync queue (would be in service worker)
   */
  async processSyncQueue(): Promise<void> {
    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');

    for (const item of queue) {
      try {
        // Send to server
        await fetch('/api/sync', {
          method: 'POST',
          body: JSON.stringify(item)
        });
      } catch (error) {
        console.error('Sync failed:', error);
        break;
      }
    }

    localStorage.removeItem('syncQueue');
  }
}

// ============================================================================
// 8. PUSH NOTIFICATIONS
// ============================================================================

/**
 * Service for handling push notifications
 */
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    return Notification.requestPermission();
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const permission = await this.requestPermission();

    if (permission !== 'granted') {
      return null;
    }

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'YOUR_PUBLIC_KEY'
        )
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  /**
   * Show local notification
   */
  showNotification(title: string, options?: NotificationOptions): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
      });
    }
  }

  /**
   * Convert base64 to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

// ============================================================================
// 9. APP SHELL ARCHITECTURE
// ============================================================================

/**
 * App shell component - minimal UI that loads instantly
 */
@Component({
  selector: 'app-shell',
  template: `
    <div class="app-shell">
      <header class="shell-header">
        <h1>Loading...</h1>
      </header>
      <main class="shell-content">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </main>
    </div>
  `,
  styles: [`
    .app-shell { height: 100vh; background: #f5f5f5; }
    .shell-header { padding: 16px; background: white; }
    .shell-content { padding: 16px; }
    .skeleton-card {
      height: 100px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      margin-bottom: 16px;
      border-radius: 8px;
    }
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class AppShellComponent {}
