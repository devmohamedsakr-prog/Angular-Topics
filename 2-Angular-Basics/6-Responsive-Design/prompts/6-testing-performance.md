# Testing & Performance Optimization

**IDE Prompt:** Use this when testing responsive design and optimizing performance metrics.

---

## 🎯 Task: Test & Optimize for Core Web Vitals

**When to use:** Before deployment, test all responsive breakpoints and performance metrics.

---

## 📋 Testing Checklist

- [ ] Test on real devices (mobile, tablet, desktop)
- [ ] Test all breakpoints (375px, 768px, 1920px)
- [ ] Test dark mode, reduced motion, touch
- [ ] Run Lighthouse audit
- [ ] Monitor Core Web Vitals
- [ ] Test with slow networks
- [ ] Test keyboard navigation
- [ ] Verify no console errors

---

## 🚀 Testing Patterns

### Pattern 1: Responsive Testing with DevTools

**Steps to test:**

1. **Open DevTools:** `F12` or `Ctrl+Shift+I`
2. **Toggle Device Toolbar:** `Ctrl+Shift+M`
3. **Test Viewports:**
   - iPhone SE: 375x667
   - iPad: 768x1024
   - Desktop: 1920x1080
4. **Check:**
   - Layout doesn't break
   - Text is readable
   - Touch targets 44px+
   - No horizontal scrolling

### Pattern 2: Dark Mode Testing

**In DevTools:**

1. Open DevTools (F12)
2. Click three dots → More tools → Rendering
3. Find "Emulate CSS media feature prefers-color-scheme"
4. Select "dark"
5. Verify colors are readable

**Automated Test:**

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dark-mode-test',
  template: `
    <div class="test-container">
      <p>Dark mode: {{ isDarkMode }}</p>
      <button (click)="testDarkMode()">Test</button>
    </div>
  `,
  styles: [`
    .test-container {
      padding: var(--spacing-lg);
      background: var(--color-bg);
      color: var(--color-text);
    }
  `]
})
export class DarkModeTestComponent implements OnInit {
  isDarkMode = false;

  ngOnInit() {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  testDarkMode() {
    console.log('Dark mode:', this.isDarkMode);
  }
}
```

### Pattern 3: Core Web Vitals Monitoring

**Service:** `src/app/services/web-vitals.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface VitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

@Injectable({
  providedIn: 'root'
})
export class WebVitalsService {
  vitals: VitalsMetric[] = [];

  constructor() {
    this.monitorVitals();
  }

  private monitorVitals() {
    // Largest Contentful Paint - Target: < 2.5s
    getLCP((metric) => {
      this.logMetric('LCP', metric.value, 2500);
    });

    // First Input Delay - Target: < 100ms
    getFID((metric) => {
      this.logMetric('FID', metric.value, 100);
    });

    // Cumulative Layout Shift - Target: < 0.1
    getCLS((metric) => {
      this.logMetric('CLS', metric.value, 0.1);
    });

    // First Contentful Paint - Target: < 1.8s
    getFCP((metric) => {
      this.logMetric('FCP', metric.value, 1800);
    });

    // Time to First Byte - Target: < 600ms
    getTTFB((metric) => {
      this.logMetric('TTFB', metric.value, 600);
    });
  }

  private logMetric(name: string, value: number, target: number) {
    const rating: 'good' | 'needs-improvement' | 'poor' =
      value <= target * 0.75 ? 'good' :
      value <= target * 1.1 ? 'needs-improvement' : 'poor';

    const metric: VitalsMetric = { name, value, rating };
    this.vitals.push(metric);
    console.log(`${name}: ${value.toFixed(2)}ms (${rating})`, metric);
  }

  getReport(): VitalsMetric[] {
    return this.vitals;
  }
}
```

### Pattern 4: Performance Component

```typescript
import { Component, OnInit } from '@angular/core';
import { WebVitalsService } from '../services/web-vitals.service';

@Component({
  selector: 'app-performance-monitor',
  template: `
    <div class="performance-monitor">
      <h2>Performance Metrics</h2>
      <table *ngIf="vitals.length > 0">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let vital of vitals" [class]="'rating-' + vital.rating">
            <td>{{ vital.name }}</td>
            <td>{{ vital.value.toFixed(2) }}ms</td>
            <td>{{ vital.rating }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .performance-monitor {
      padding: var(--spacing-lg);
      background: #f5f5f5;
      border-radius: 8px;
      margin: var(--spacing-lg) 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--spacing-md);
    }

    th, td {
      padding: var(--spacing-sm);
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background: #2196f3;
      color: white;
      font-weight: bold;
    }

    .rating-good {
      background: #c8e6c9;
      color: #1b5e20;
    }

    .rating-needs-improvement {
      background: #fff9c4;
      color: #f57f17;
    }

    .rating-poor {
      background: #ffcccc;
      color: #b71c1c;
    }
  `]
})
export class PerformanceMonitorComponent implements OnInit {
  vitals = this.webVitalsService.vitals;

  constructor(private webVitalsService: WebVitalsService) {}

  ngOnInit() {
    setTimeout(() => {
      this.vitals = this.webVitalsService.getReport();
    }, 5000);
  }
}
```

### Pattern 5: Lighthouse Audit Script

**Component:** `src/app/components/lighthouse-report/lighthouse-report.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-lighthouse-report',
  template: `
    <div class="lighthouse-section">
      <h2>Lighthouse Audit Instructions</h2>
      <ol>
        <li>Open DevTools: F12</li>
        <li>Go to "Lighthouse" tab</li>
        <li>Select device: Mobile or Desktop</li>
        <li>Click "Analyze page load"</li>
        <li>Wait for report</li>
        <li>Check scores:
          <ul>
            <li>Performance: > 90</li>
            <li>Accessibility: > 90</li>
            <li>Best Practices: > 90</li>
            <li>SEO: > 90</li>
          </ul>
        </li>
      </ol>

      <div class="benchmark">
        <h3>Targets</h3>
        <p><strong>Performance:</strong></p>
        <ul>
          <li>LCP (Largest Contentful Paint): < 2.5s ✅ Good</li>
          <li>FID (First Input Delay): < 100ms ✅ Good</li>
          <li>CLS (Cumulative Layout Shift): < 0.1 ✅ Good</li>
        </ul>

        <p><strong>Accessibility:</strong></p>
        <ul>
          <li>Color contrast: 4.5:1 minimum</li>
          <li>Touch targets: 44px minimum</li>
          <li>Keyboard navigation: Working</li>
          <li>Alt text: On all images</li>
        </ul>

        <p><strong>Best Practices:</strong></p>
        <ul>
          <li>HTTPS enabled</li>
          <li>No console errors</li>
          <li>Images have correct aspect ratio</li>
          <li>No deprecated APIs</li>
        </ul>

        <p><strong>SEO:</strong></p>
        <ul>
          <li>Mobile friendly</li>
          <li>Viewport configured</li>
          <li>Meta description present</li>
          <li>Structured data valid</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .lighthouse-section {
      padding: var(--spacing-lg);
      background: #f9f9f9;
      border-radius: 8px;
      max-width: 800px;
      margin: var(--spacing-lg) auto;
    }

    ol {
      font-size: var(--font-size-base);
      line-height: 1.8;
    }

    li {
      margin: var(--spacing-sm) 0;
    }

    .benchmark {
      background: white;
      padding: var(--spacing-lg);
      border-radius: 8px;
      margin-top: var(--spacing-lg);
      border-left: 4px solid #2196f3;
    }

    h3 {
      margin-top: 0;
      color: #2196f3;
    }

    ul {
      list-style: none;
      padding-left: var(--spacing-lg);
    }

    ul li:before {
      content: '✓ ';
      color: #4caf50;
      font-weight: bold;
      margin-right: var(--spacing-sm);
    }
  `]
})
export class LighthouseReportComponent {}
```

---

## 🔧 Performance Optimization Steps

### Step 1: Run Lighthouse Audit

1. Build: `ng build --prod`
2. Serve: `ng serve --prod`
3. DevTools > Lighthouse > Analyze

### Step 2: Fix Performance Issues

**Common issues and fixes:**

```
Issue: LCP too slow (> 2.5s)
→ Optimize hero image
→ Minimize JavaScript
→ Use faster fonts

Issue: CLS (layout shift > 0.1)
→ Set dimensions on images
→ Reserve space for ads
→ Use aspect-ratio

Issue: FID too slow (> 100ms)
→ Reduce JavaScript
→ Defer non-critical scripts
→ Use requestIdleCallback
```

### Step 3: Test with Network Throttling

**In DevTools:**

1. Open DevTools (F12)
2. Network tab
3. Click throttle dropdown
4. Select "Slow 4G" or "Fast 3G"
5. Reload page
6. Note load times

### Step 4: Monitor in Production

**Add Web Vitals monitoring:**

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { WebVitalsService } from './services/web-vitals.service';

@Component({
  selector: 'app-root',
  template: `...`
})
export class AppComponent implements OnInit {
  constructor(private webVitals: WebVitalsService) {}

  ngOnInit() {
    console.log('Web Vitals:', this.webVitals.getReport());
  }
}
```

---

## ✅ Final Deployment Checklist

**Performance:**
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse score > 90

**Responsive:**
- [ ] Mobile (375px) - works
- [ ] Tablet (768px) - works
- [ ] Desktop (1920px) - works
- [ ] No horizontal scrolling

**Accessibility:**
- [ ] Dark mode tested
- [ ] Reduced motion tested
- [ ] Touch targets 44px+
- [ ] Keyboard navigation works
- [ ] Alt text on images
- [ ] Color contrast 4.5:1+

**Images:**
- [ ] Responsive images (srcset)
- [ ] Lazy loading enabled
- [ ] Modern formats (WebP)
- [ ] Aspect ratios set

**Browser:**
- [ ] Chrome/Edge tested
- [ ] Firefox tested
- [ ] Safari tested
- [ ] No console errors

---

## 📊 Performance Targets

```
Desktop:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Score: > 90

Mobile:
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Score: > 90
```

---

## 🔗 Verification

- Run: `ng build --prod`
- Serve: `ng serve --prod`
- DevTools > Lighthouse > Analyze
- Check all scores > 90

---

## 📚 Reference Files

- `explanation/5-testing-performance.md` - Testing theory
- `interview-questions/3-responsive-testing-qa.md` - Q&A

---

**Estimated Time:** 30-40 minutes  
**Difficulty:** Advanced  
**Prerequisites:** All previous prompts completed
