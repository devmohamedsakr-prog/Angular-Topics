# Angular Core Web Vitals & Performance - Interview Questions

## Beginner Level

### Q1: What are Google's Core Web Vitals?
**Answer:**
Three key metrics measuring page experience that Google uses for SEO ranking:

1. **LCP (Largest Contentful Paint)**: Loading performance
   - Time until largest visible element renders
   - Good: < 2.5s

2. **FID (First Input Delay)**: Interactivity
   - Time from user interaction to browser response
   - Good: < 100ms

3. **CLS (Cumulative Layout Shift)**: Visual stability
   - Total unexpected layout shifts
   - Good: < 0.1

**Why important:**
- Affects Google search ranking
- Improves user experience
- Reduces bounce rates
- Better conversion rates

---

### Q2: How do you measure Core Web Vitals?
**Answer:**
Multiple tools available:

1. **Google PageSpeed Insights**
   - Visit insights.google.com
   - Enter your URL
   - Get score and recommendations

2. **Lighthouse (Built-in Chrome DevTools)**
   ```
   F12 → Lighthouse → Generate report
   ```

3. **Web Vitals Library**
   ```typescript
   import { getCLS, getFID, getLCP } from 'web-vitals';
   
   getCLS(metric => console.log('CLS:', metric.value));
   getFID(metric => console.log('FID:', metric.value));
   getLCP(metric => console.log('LCP:', metric.value));
   ```

4. **Chrome DevTools Network tab**
   - Shows waterfall timing
   - Identifies bottlenecks

---

### Q3: What techniques optimize LCP (Largest Contentful Paint)?
**Answer:**
LCP optimization focuses on faster content rendering:

1. **Optimize Images**
   ```html
   <!-- Use compressed, modern formats -->
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="Hero">
   </picture>

   <!-- Lazy load below-fold -->
   <img src="below-fold.jpg" loading="lazy" alt="Below fold">
   ```

2. **Minimize CSS**
   - Inline critical CSS in `<head>`
   - Defer non-critical CSS
   - Remove unused styles

3. **Optimize Fonts**
   ```css
   @font-face {
     font-family: 'Custom';
     src: url('font.woff2') format('woff2');
     font-display: swap; /* Show fallback immediately */
   }
   ```

4. **Reduce JavaScript**
   - Code splitting
   - Lazy load modules
   - Defer non-critical scripts

5. **Use CDN**
   - Serve content from edge locations
   - Reduce latency

---

### Q4: What causes First Input Delay (FID) and how to fix it?
**Answer:**
FID measures browser responsiveness to user interactions.

**Causes:**
- Long JavaScript tasks (> 50ms)
- Heavy computations on main thread
- Large bundles blocking interaction

**Solutions:**

```typescript
// Break long tasks
async processLargeDataset(items: any[]) {
  const chunkSize = 50;
  
  for (let i = 0; i < items.length; i += chunkSize) {
    await new Promise(resolve => {
      requestIdleCallback(() => {
        const chunk = items.slice(i, i + chunkSize);
        chunk.forEach(item => this.process(item));
        resolve(undefined);
      });
    });
  }
}

// Defer non-critical work
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    this.initializeAnalytics();
  });
} else {
  setTimeout(() => this.initializeAnalytics(), 0);
}

// Code splitting
const routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard.module')
      .then(m => m.DashboardModule)
  }
];
```

---

### Q5: How do you prevent Cumulative Layout Shift (CLS)?
**Answer:**
CLS measures unexpected layout changes during page load.

**Causes:**
- Images/videos without dimensions
- Ads/embeds changing size
- Fonts loading differently
- Dynamically injected content

**Solutions:**

```html
<!-- Set explicit dimensions -->
<img src="image.jpg" width="400" height="300" alt="Image">
<video width="640" height="480"></video>

<!-- Reserve space for content -->
<div class="ad-space" style="min-height: 300px">
  <!-- Ad loads here -->
</div>

<!-- Use CSS transforms instead of reflow -->
<!-- ✓ Good - doesn't cause layout shift -->
.animate {
  transform: translateX(10px);
  transition: transform 0.3s;
}

<!-- ✗ Bad - causes layout shift -->
.animate {
  margin-left: 10px;
  transition: margin-left 0.3s;
}
```

**In Angular:**

```typescript
@Component({
  template: `
    <div class="container">
      <!-- Reserve space for dynamic content -->
      <div class="content" [style.min-height.px]="contentHeight">
        <div *ngIf="content">{{ content }}</div>
      </div>
    </div>
  `
})
export class DynamicComponent {
  contentHeight = 200; // Prevents layout shift
  content: string;
}
```

---

## Intermediate Level

### Q6: How do you track Core Web Vitals in Angular?
**Answer:**
Implement monitoring service:

```typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VitalsService {
  private vitals = new Subject<any>();
  vitals$ = this.vitals.asObservable();

  constructor() {
    this.trackVitals();
  }

  private trackVitals(): void {
    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.renderTime || lastEntry.loadTime;
      
      this.vitals.next({ metric: 'LCP', value: lcp });
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // FID
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        const fid = (entry as any).processingDuration;
        this.vitals.next({ metric: 'FID', value: fid });
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // CLS
    let cls = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value;
          this.vitals.next({ metric: 'CLS', value: cls });
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  sendMetricsToAnalytics(metric: any): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.metric, { value: metric.value });
    }
  }
}
```

---

### Q7: What is requestIdleCallback and how does it help FID?
**Answer:**
Schedules non-critical tasks during browser idle time:

```typescript
// Schedule task during idle
requestIdleCallback(() => {
  // This runs when browser is idle (no other work)
  this.analyticsService.trackEvent('page_loaded');
}, { timeout: 5000 }); // Timeout fallback

// Use for non-critical initialization
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    this.initializeThirdPartyScripts();
  });
} else {
  // Fallback for browsers that don't support it
  setTimeout(() => {
    this.initializeThirdPartyScripts();
  }, 0);
}

// Break long tasks into smaller chunks
async processBigDataset(data: any[]): Promise<void> {
  const chunkSize = 100;
  
  for (let i = 0; i < data.length; i += chunkSize) {
    await new Promise(resolve => {
      requestIdleCallback(() => {
        const chunk = data.slice(i, i + chunkSize);
        chunk.forEach(item => console.log(item));
        resolve(undefined);
      });
    });
  }
}
```

---

### Q8: How do you implement image optimization for LCP?
**Answer:**
Multiple strategies for faster image loading:

```html
<!-- 1. Use modern formats with fallback -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image-modern.jpg" type="image/jpeg">
  <img src="image-fallback.jpg" alt="Hero image">
</picture>

<!-- 2. Responsive images with srcset -->
<img 
  srcset="
    image-320w.jpg 320w,
    image-640w.jpg 640w,
    image-1280w.jpg 1280w
  "
  sizes="(max-width: 600px) 100vw, 600px"
  src="image-640w.jpg"
  alt="Product">

<!-- 3. Lazy load below-fold images -->
<img 
  src="hero.jpg" 
  loading="eager"
  alt="Hero (above fold)">

<img 
  src="below-fold.jpg" 
  loading="lazy"
  alt="Below fold">

<!-- 4. Set explicit dimensions (prevent CLS) -->
<img 
  src="image.jpg"
  width="400"
  height="300"
  alt="Properly sized">
```

**Angular component example:**
```typescript
@Component({
  selector: 'app-hero',
  template: `
    <img 
      [src]="heroImageSrc"
      [srcset]="heroImageSrcset"
      sizes="(max-width: 600px) 100vw, 600px"
      loading="eager"
      fetchpriority="high"
      width="1200"
      height="600"
      alt="Hero banner">
  `
})
export class HeroComponent {
  heroImageSrc = 'hero-640w.webp';
  heroImageSrcset = `
    hero-320w.webp 320w,
    hero-640w.webp 640w,
    hero-1280w.webp 1280w
  `;
}
```

---

### Q9: How do you analyze bundle size and identify optimization opportunities?
**Answer:**
Tools and processes for bundle analysis:

```bash
# Generate stats
ng build --prod --stats-json

# Analyze with webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/app/stats.json

# Or use source-map-explorer
npm install -g source-map-explorer
source-map-explorer dist/app/main.*.js
```

**Look for:**
- Duplicate dependencies
- Large node_modules
- Unused code
- Heavy third-party libraries

**Solutions:**
```typescript
// 1. Code splitting for routes
const routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule)
  }
];

// 2. Dynamic imports for heavy libraries
async loadChart() {
  const chart = await import('chart.js');
  // Use chart
}

// 3. Use lighter alternatives
// ✗ Avoid: import * as _ from 'lodash'; // 70KB
// ✓ Use: import { sortBy } from 'lodash-es'; // 5KB

// 4. Tree shaking in package.json
{
  "sideEffects": false // Enables tree shaking
}
```

---

### Q10: How do you optimize fonts for web performance?
**Answer:**
Font loading strategy impacts LCP:

```css
/* Display swap - show fallback immediately */
@font-face {
  font-family: 'Custom';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}

/* Font size adjustment */
@supports (font-size-adjust: 0.5) {
  body {
    font-size-adjust: 0.5;
  }
}
```

**HTML optimization:**
```html
<!-- Preload critical fonts -->
<link 
  rel="preload" 
  href="font.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin>

<!-- Use woff2 (most efficient) -->
<link 
  href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"
  rel="stylesheet">

<!-- Self-hosted fonts with optimal parameters -->
<link href="fonts.css" rel="stylesheet">
```

**fonts.css optimization:**
```css
@font-face {
  font-family: 'Open Sans';
  src: url('opensans-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap; /* Critical! */
  unicode-range: U+0000-00FF; /* Latin characters only */
}
```

---

## Advanced Level

### Q11: How do you implement progressive font loading?
**Answer:**
Load fonts in stages for optimal performance:

```css
/* Stage 1: System fonts (instant) */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Stage 2: Web fonts with font-display */
@font-face {
  font-family: 'Custom';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Show fallback until loaded */
}

/* Stage 3: Optimize loaded fonts */
body.fonts-loaded {
  font-family: 'Custom', sans-serif;
}
```

**JavaScript implementation:**
```typescript
const fontObserver = new FontFaceSetLoadingEvent('loading');

document.fonts.ready.then(() => {
  document.documentElement.classList.add('fonts-loaded');
});

// Or use FontFaceSet API
Promise.all([
  document.fonts.load('400 1em Open Sans'),
  document.fonts.load('700 1em Open Sans')
]).then(() => {
  document.documentElement.classList.add('fonts-ready');
});
```

---

### Q12: How do you implement real-time performance monitoring?
**Answer:**
Send metrics to analytics service:

```typescript
@Injectable({ providedIn: 'root' })
export class PerformanceMonitoringService {
  constructor(private http: HttpClient) {
    this.monitorMetrics();
  }

  private monitorMetrics(): void {
    // Collect after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.captureMetrics();
      }, 0);
    });
  }

  private captureMetrics(): void {
    const metrics = {
      lcp: this.getLCP(),
      fid: this.getFID(),
      cls: this.getCLS(),
      ttfb: this.getTTFB(),
      fcp: this.getFCP(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.sendMetrics(metrics);
  }

  private getLCP(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const lastEntry = lcpEntries[lcpEntries.length - 1];
      return lastEntry.renderTime || lastEntry.loadTime;
    }
    return 0;
  }

  private getFID(): number {
    const fidEntries = performance.getEntriesByType('first-input');
    if (fidEntries.length > 0) {
      return (fidEntries[0] as any).processingDuration;
    }
    return 0;
  }

  private getCLS(): number {
    let cls = 0;
    const clsEntries = performance.getEntriesByType('layout-shift');
    clsEntries.forEach(entry => {
      if (!(entry as any).hadRecentInput) {
        cls += (entry as any).value;
      }
    });
    return cls;
  }

  private getTTFB(): number {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries.length > 0) {
      const navTiming = navEntries[0] as PerformanceNavigationTiming;
      return navTiming.responseStart - navTiming.requestStart;
    }
    return 0;
  }

  private getFCP(): number {
    const fcpEntries = performance.getEntriesByName('first-contentful-paint');
    if (fcpEntries.length > 0) {
      return fcpEntries[0].startTime;
    }
    return 0;
  }

  private sendMetrics(metrics: any): void {
    this.http.post('/api/metrics', metrics).subscribe(
      () => console.log('Metrics sent'),
      error => console.error('Failed to send metrics', error)
    );
  }
}
```

---

### Q13: How do you optimize third-party scripts impact on performance?
**Answer:**
Minimize third-party script blocking:

```html
<!-- 1. Defer non-critical scripts -->
<script src="analytics.js" defer></script>

<!-- 2. Use async for non-dependent scripts -->
<script src="tracker.js" async></script>

<!-- 3. Use web worker for heavy computation -->
<script>
  if ('Worker' in window) {
    const worker = new Worker('heavy-computation.js');
    worker.postMessage(data);
  }
</script>
```

**Sandbox third-party scripts:**
```typescript
// Load in iframe for isolation
<iframe 
  src="third-party-widget.html"
  sandbox
  allow="camera; microphone"
  style="width: 100%; height: 300px;">
</iframe>
```

**Monitor impact:**
```typescript
// Measure before/after third-party load
const before = performance.now();
loadThirdPartyScript('widget.js').then(() => {
  const after = performance.now();
  const impact = after - before;
  console.log(`Third-party impact: ${impact}ms`);
});
```

---

### Q14: How do you set up performance budgets?
**Answer:**
Enforce size and speed limits:

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
    },
    {
      "type": "bundle",
      "name": "main",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    }
  ]
}
```

**Automate checking:**
```bash
# Build fails if budget exceeded
ng build --prod

# Output:
# ✗ bundle/main exceeds maximum budget of 500kb by 50kb
```

---

### Q15: How do you audit and improve Lighthouse scores?
**Answer:**
Comprehensive audit process:

```bash
# Generate Lighthouse report
lighthouse https://example.com --view

# Save report
lighthouse https://example.com --output-path=./report.html

# Throttle for realistic mobile scenario
lighthouse https://example.com --throttle-method=simulate
```

**Key areas to optimize:**

1. **Performance** (target: 90+)
   - Minimize main thread work
   - Reduce JavaScript
   - Optimize images

2. **Accessibility** (target: 90+)
   - Color contrast
   - ARIA labels
   - Keyboard navigation

3. **Best Practices** (target: 90+)
   - HTTPS everywhere
   - No console errors
   - Security headers

4. **SEO** (target: 90+)
   - Meta tags
   - Mobile-friendly
   - Structured data

5. **PWA** (target: 90+)
   - Web manifest
   - Service worker
   - Offline support

**Continuous monitoring:**
```typescript
// Schedule weekly Lighthouse runs
setInterval(() => {
  runLighthouse().then(result => {
    if (result.score < 80) {
      alertTeam('Lighthouse score dropped!');
    }
  });
}, 7 * 24 * 60 * 60 * 1000); // Weekly
```
