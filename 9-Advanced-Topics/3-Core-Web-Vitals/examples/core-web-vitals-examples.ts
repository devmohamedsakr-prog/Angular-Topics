/**
 * Angular Core Web Vitals & Performance Examples
 * 
 * Covers:
 * - Measuring LCP, FID, CLS
 * - Performance monitoring service
 * - Task scheduling and optimization
 * - Image optimization strategies
 * - Bundle analysis and optimization
 * - Real User Monitoring (RUM)
 */

import { Injectable, Component, OnInit, Renderer2 } from '@angular/core';
import { Subject, Observable } from 'rxjs';

// ============================================================================
// 1. CORE WEB VITALS MONITORING
// ============================================================================

export interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CoreWebVitalsService {
  private vitalsSubject = new Subject<VitalMetric>();
  vitals$ = this.vitalsSubject.asObservable();

  constructor() {
    this.initializeVitalsTracking();
  }

  /**
   * Initialize tracking of all Core Web Vitals
   */
  private initializeVitalsTracking(): void {
    this.trackLCP();
    this.trackFID();
    this.trackCLS();
    this.trackTTFB();
  }

  /**
   * Track Largest Contentful Paint (LCP)
   * Good: < 2.5s, Needs Improvement: 2.5-4s, Poor: > 4s
   */
  private trackLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      const lcp = lastEntry.renderTime || lastEntry.loadTime;
      const rating = this.getRating('lcp', lcp);

      this.vitalsSubject.next({
        name: 'LCP',
        value: lcp,
        rating,
        timestamp: Date.now()
      });

      console.log(`LCP: ${lcp}ms (${rating})`);
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }
  }

  /**
   * Track First Input Delay (FID)
   * Good: < 100ms, Needs Improvement: 100-300ms, Poor: > 300ms
   */
  private trackFID(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        const fid = (entry as any).processingDuration;
        const rating = this.getRating('fid', fid);

        this.vitalsSubject.next({
          name: 'FID',
          value: fid,
          rating,
          timestamp: Date.now()
        });

        console.log(`FID: ${fid}ms (${rating})`);
      });
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }
  }

  /**
   * Track Cumulative Layout Shift (CLS)
   * Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
   */
  private trackCLS(): void {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          const rating = this.getRating('cls', clsValue);

          this.vitalsSubject.next({
            name: 'CLS',
            value: clsValue,
            rating,
            timestamp: Date.now()
          });

          console.log(`CLS: ${clsValue.toFixed(3)} (${rating})`);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }

  /**
   * Track Time to First Byte (TTFB)
   */
  private trackTTFB(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        const ttfb = (entry as any).responseStart - (entry as any).requestStart;
        console.log(`TTFB: ${ttfb}ms`);
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
    } catch (e) {
      console.warn('Navigation timing not supported');
    }
  }

  /**
   * Get rating based on metric thresholds
   */
  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: { [key: string]: [number, number] } = {
      'lcp': [2500, 4000],
      'fid': [100, 300],
      'cls': [0.1, 0.25],
      'ttfb': [600, 1800]
    };

    const [good, needsImprovement] = thresholds[metric] || [0, 0];

    if (value <= good) return 'good';
    if (value <= needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get current vitals summary
   */
  getVitalsSummary(): Observable<VitalMetric[]> {
    return this.vitals$;
  }
}

// ============================================================================
// 2. TASK SCHEDULING - BREAK LONG TASKS
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class TaskSchedulerService {
  /**
   * Schedule non-blocking tasks using requestIdleCallback
   * Falls back to setTimeout for unsupported browsers
   */
  scheduleTask(callback: () => void, priority: 'high' | 'low' = 'low'): void {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(callback, {
        timeout: priority === 'high' ? 1000 : 5000
      });
    } else {
      setTimeout(callback, 0);
    }
  }

  /**
   * Break long task into smaller chunks
   */
  async processLargeDataset(items: any[], processor: (item: any) => void): Promise<void> {
    const chunkSize = 50;

    for (let i = 0; i < items.length; i += chunkSize) {
      await new Promise(resolve => {
        this.scheduleTask(() => {
          const chunk = items.slice(i, i + chunkSize);
          chunk.forEach(processor);
          resolve(undefined);
        });
      });
    }
  }

  /**
   * Schedule microtasks for critical work
   */
  scheduleMicrotask(callback: () => void): void {
    Promise.resolve().then(callback);
  }

  /**
   * Defer non-critical initialization
   */
  deferInitialization(callback: () => void, delay: number = 0): void {
    setTimeout(callback, delay);
  }
}

// ============================================================================
// 3. IMAGE OPTIMIZATION
// ============================================================================

/**
 * Component with optimized image loading
 */
@Component({
  selector: 'app-optimized-image',
  template: `
    <div class="image-container">
      <!-- Lazy loading with native support -->
      <img 
        [src]="imageSrc"
        [alt]="imageAlt"
        loading="lazy"
        width="300"
        height="200"
        (load)="onImageLoad()">
      
      <!-- Placeholder during loading -->
      <div *ngIf="!imageLoaded" class="placeholder"></div>

      <!-- WebP with fallback -->
      <picture>
        <source srcset="image.webp" type="image/webp">
        <source srcset="image.jpg" type="image/jpeg">
        <img src="image.jpg" alt="Fallback image">
      </picture>

      <!-- Responsive images with srcset -->
      <img 
        [srcset]="responsiveSrcset"
        sizes="(max-width: 600px) 100vw, 600px"
        alt="Responsive image">
    </div>
  `,
  styles: [`
    .image-container {
      position: relative;
      overflow: hidden;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    .placeholder {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      aspect-ratio: 3/2;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class OptimizedImageComponent {
  imageSrc = 'image-compressed.jpg';
  imageAlt = 'Product image';
  imageLoaded = false;
  responsiveSrcset = `
    image-300w.jpg 300w,
    image-600w.jpg 600w,
    image-1200w.jpg 1200w
  `;

  onImageLoad(): void {
    this.imageLoaded = true;
  }
}

// ============================================================================
// 4. BUNDLE ANALYSIS AND CODE SPLITTING
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class BundleOptimizationService {
  /**
   * Analyze bundle size
   * Run: ng build --prod --stats-json
   * Then: webpack-bundle-analyzer dist/*/stats.json
   */
  static analyzeBundle(): string {
    return `
      Commands:
      1. ng build --prod --stats-json
      2. npm install -g webpack-bundle-analyzer
      3. webpack-bundle-analyzer dist/app/stats.json
      
      Look for:
      - Large node_modules
      - Duplicate dependencies
      - Unused libraries
      - Heavy third-party scripts
    `;
  }

  /**
   * Code splitting configuration in angular.json
   */
  static codeSplittingConfig = {
    optimization: {
      scripts: true,
      styles: true,
      fonts: true
    },
    outputHashing: 'all',
    lazyModules: [
      'src/app/feature/lazy.module'
    ]
  };

  /**
   * Tree shaking hints in package.json
   */
  static treeShakingHints = {
    sideEffects: false, // Mark library as side-effect-free
    module: 'dist/index.esm.js', // ES module entry
    main: 'dist/index.js' // CommonJS entry
  };
}

// ============================================================================
// 5. PERFORMANCE MONITORING DASHBOARD
// ============================================================================

/**
 * Component displaying performance metrics
 */
@Component({
  selector: 'app-performance-dashboard',
  template: `
    <div class="performance-dashboard">
      <h2>Core Web Vitals</h2>
      
      <div class="vitals-grid">
        <div class="vital-card" [ngClass]="vital.rating"
             *ngFor="let vital of vitals$ | async">
          <div class="vital-name">{{ vital.name }}</div>
          <div class="vital-value">{{ formatValue(vital) }}</div>
          <div class="vital-rating">{{ vital.rating | titlecase }}</div>
        </div>
      </div>

      <div class="metrics-detail">
        <h3>Performance Metrics</h3>
        <table>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Target</th>
          </tr>
          <tr>
            <td>LCP</td>
            <td>{{ lcp }}ms</td>
            <td>&lt; 2500ms</td>
          </tr>
          <tr>
            <td>FID</td>
            <td>{{ fid }}ms</td>
            <td>&lt; 100ms</td>
          </tr>
          <tr>
            <td>CLS</td>
            <td>{{ cls }}</td>
            <td>&lt; 0.1</td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .performance-dashboard {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin: 16px 0;
    }
    .vital-card {
      background: white;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid #ccc;
    }
    .vital-card.good {
      border-left-color: #4caf50;
    }
    .vital-card.needs-improvement {
      border-left-color: #ff9800;
    }
    .vital-card.poor {
      border-left-color: #f44336;
    }
    .vital-name {
      font-size: 12px;
      color: #666;
    }
    .vital-value {
      font-size: 24px;
      font-weight: bold;
      margin: 8px 0;
    }
    .vital-rating {
      font-size: 12px;
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      margin-top: 16px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #f0f0f0;
      font-weight: 600;
    }
  `]
})
export class PerformanceDashboardComponent implements OnInit {
  vitals$: Observable<any>;
  lcp = 0;
  fid = 0;
  cls = 0;

  constructor(private vitalsService: CoreWebVitalsService) {
    this.vitals$ = this.vitalsService.vitals$;
  }

  ngOnInit() {
    this.vitals$.subscribe(metric => {
      if (metric.name === 'LCP') this.lcp = Math.round(metric.value);
      if (metric.name === 'FID') this.fid = Math.round(metric.value);
      if (metric.name === 'CLS') this.cls = metric.value.toFixed(3);
    });
  }

  formatValue(vital: any): string {
    if (vital.name === 'CLS') {
      return vital.value.toFixed(3);
    }
    return `${Math.round(vital.value)}ms`;
  }
}

// ============================================================================
// 6. PERFORMANCE OPTIMIZATION PATTERNS
// ============================================================================

/**
 * Optimize component with change detection
 */
@Component({
  selector: 'app-optimized-list',
  changeDetection: 'OnPush', // Manual change detection
  template: `
    <div>
      <h3>{{ title }}</h3>
      <div *ngFor="let item of items; trackBy: trackByFn"
           class="list-item">
        <span>{{ item.name }}</span>
        <span>{{ item.value }}</span>
      </div>
    </div>
  `
})
export class OptimizedListComponent {
  title = 'Items';
  items: any[] = [];

  /**
   * TrackBy function for ngFor
   * Improves change detection performance
   */
  trackByFn(index: number, item: any): any {
    return item.id; // Return unique identifier
  }
}

// ============================================================================
// 7. LAZY LOADING AND PREFETCHING
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class ResourceHintService {
  constructor(private renderer: Renderer2) {}

  /**
   * Preload critical resources
   */
  preload(href: string, as: string = 'fetch'): void {
    const link = this.renderer.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    this.renderer.appendChild(document.head, link);
  }

  /**
   * Prefetch non-critical resources
   */
  prefetch(href: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    this.renderer.appendChild(document.head, link);
  }

  /**
   * DNS prefetch for external domains
   */
  dnsPrefetch(hostname: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${hostname}`;
    this.renderer.appendChild(document.head, link);
  }

  /**
   * Preconnect to critical third-party origins
   */
  preconnect(href: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    this.renderer.appendChild(document.head, link);
  }
}

// Usage example:
// constructor(private resourceHints: ResourceHintService) {
//   // Preload critical CSS
//   this.resourceHints.preload('/styles/critical.css', 'style');
//
//   // Prefetch next page bundle
//   this.resourceHints.prefetch('/assets/page2.js');
//
//   // DNS prefetch for API
//   this.resourceHints.dnsPrefetch('api.example.com');
//
//   // Preconnect to CDN
//   this.resourceHints.preconnect('https://cdn.example.com');
// }
