# Performance Debugging & Profiling Interview Questions

## Beginner Level

### Q1: What are the Core Web Vitals and why do they matter?

**Answer:**

Core Web Vitals are metrics that Google uses to measure user experience:

| Metric | What It Measures | Good | Needs Work | Poor |
|--------|------------------|------|-----------|------|
| **LCP** | When main content loads | < 2.5s | 2.5-4s | > 4s |
| **FID** | Response to user interaction | < 100ms | 100-300ms | > 300ms |
| **CLS** | Unexpected layout shifts | < 0.1 | 0.1-0.25 | > 0.25 |

**Why they matter:**
- Google uses them for search ranking
- Direct impact on user experience
- Affects conversion rates
- Users leave slow sites

**Example:**
```typescript
// Measure LCP (Largest Contentful Paint)
const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
const lcp = lcpEntries[lcpEntries.length - 1].startTime;
console.log(`LCP: ${lcp}ms`);

// Measure FID (First Input Delay)
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
  });
}).observe({ entryTypes: ['first-input'] });
```

---

### Q2: What is OnPush change detection and when should you use it?

**Answer:**

**OnPush:** Only checks component when:
1. Input properties change
2. Event occurs in template
3. Manual detection triggered

**Default:** Checks on every event (slower)

**Example:**
```typescript
// ❌ Default - slow
@Component({
  selector: 'app-item',
  template: `<div>{{ item.name }}</div>`
})
export class ItemComponent {
  @Input() item: Item;
}

// ✅ OnPush - fast
@Component({
  selector: 'app-item',
  template: `<div>{{ item.name }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
  @Input() item: Item;
}
```

**When to use:**
- Presentational components
- Components with @Input properties
- Large lists/tables
- High-frequency events

**Benefits:**
- Fewer change detection cycles
- 30-50% performance improvement
- Works great with immutable data

---

### Q3: What is the TrackBy function and why is it important?

**Answer:**

TrackBy tells Angular which item in list corresponds to DOM element, preventing unnecessary DOM recreation.

```typescript
// ❌ Bad - recreates all DOM elements
<div *ngFor="let item of items">{{ item.name }}</div>

// ✅ Good - updates only changed items
export class ListComponent {
  items: Item[];

  trackByFn(index: number, item: Item): number {
    return item.id;
  }
}

<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

**Impact:**
- Fewer DOM operations
- Preserves form input state
- 50-80% faster with large lists
- Critical for performance

---

### Q4: How do you measure performance in Angular?

**Answer:**

```typescript
// Using Performance API
performance.mark('operation-start');
// ... do work ...
performance.mark('operation-end');
performance.measure('operation', 'operation-start', 'operation-end');

const measure = performance.getEntriesByName('operation')[0];
console.log(`Operation took ${measure.duration}ms`);

// Measure page load
const perfData = window.performance.timing;
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
console.log(`Page load: ${pageLoadTime}ms`);

// In component
@Component({})
export class MyComponent implements OnInit {
  ngOnInit() {
    performance.mark('init-start');
    // Initialization code
    performance.mark('init-end');
    performance.measure('init', 'init-start', 'init-end');
  }
}
```

---

### Q5: How do you prevent memory leaks with observables?

**Answer:**

**Pattern: Use `takeUntil`**
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Alternative: Async pipe**
```typescript
@Component({
  template: `<div>{{ data$ | async }}</div>`
})
export class MyComponent {
  data$ = this.dataService.getData();
  // Auto-unsubscribes!
}
```

**Common memory leak causes:**
- Forgotten subscriptions
- Event listeners not removed
- Timer intervals not cleared
- Detached components not cleaned

---

## Intermediate Level

### Q6: How do you profile a slow Angular application?

**Answer:**

**Step 1: Use Chrome DevTools Performance Tab**
- Open DevTools (F12)
- Go to Performance tab
- Click record
- Perform slow action
- Stop and analyze

**Step 2: Look for:**
- Yellow/red areas = frame drops
- Long tasks = expensive operations
- Scripting time = JavaScript
- Rendering time = DOM updates

**Step 3: Identify bottlenecks**
```typescript
// Use PerformanceObserver for real metrics
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

**Step 4: Fix identified issues**
- Use OnPush where possible
- Implement TrackBy
- Lazy load modules
- Virtual scroll

---

### Q7: How do you optimize change detection?

**Answer:**

**1. Use OnPush strategy**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**2. Control change detection manually**
```typescript
constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

ngOnInit() {
  this.ngZone.runOutsideAngular(() => {
    // Heavy operations outside zone
    setInterval(() => {
      // Only update UI when needed
      this.ngZone.run(() => {
        this.cdr.markForCheck();
      });
    }, 1000);
  });
}
```

**3. Detach component**
```typescript
this.cdr.detach(); // Stop change detection
// Do work
this.cdr.reattach(); // Resume
```

---

### Q8: What are memory leak patterns to avoid?

**Answer:**

**Pattern 1: Unsubscribed Observable**
```typescript
// ❌ Leaks
ngOnInit() {
  this.data$.subscribe(data => this.data = data);
}

// ✅ Fixed
ngOnInit() {
  this.data$.pipe(takeUntil(this.destroy$)).subscribe(...);
}
```

**Pattern 2: Event Listeners**
```typescript
// ❌ Leaks
ngOnInit() {
  window.addEventListener('scroll', this.onScroll);
}

// ✅ Fixed
ngOnInit() {
  window.addEventListener('scroll', this.onScroll);
}
ngOnDestroy() {
  window.removeEventListener('scroll', this.onScroll);
}
```

**Pattern 3: Timers**
```typescript
// ❌ Leaks
ngOnInit() {
  setInterval(() => { /* work */ }, 1000);
}

// ✅ Fixed
private destroy$ = new Subject();
ngOnInit() {
  interval(1000).pipe(takeUntil(this.destroy$)).subscribe(...);
}
```

---

### Q9: How do you reduce bundle size?

**Answer:**

**1. Lazy load modules**
```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

**2. Tree shaking - import only what you need**
```typescript
// ❌ Imports entire library
import * as _ from 'lodash';

// ✅ Imports only needed function
import { debounce } from 'lodash-es';
```

**3. Remove unused dependencies**
```bash
npm list
npm prune
```

**4. Analyze bundle**
```bash
ng build --prod --stats-json
webpack-bundle-analyzer dist/stats.json
```

---

### Q10: How do you use virtual scrolling?

**Answer:**

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="list">
      <div *cdkVirtualFor="let item of items; trackBy: trackByFn">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
export class ListComponent {
  // 10,000 items but only 10-20 rendered at a time
  items: Item[] = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }));

  trackByFn(index: number, item: Item) {
    return item.id;
  }
}
```

---

## Advanced Level

### Q11: How do you implement performance monitoring?

**Answer:**

```typescript
@Injectable()
export class PerformanceMonitoringService {
  private readonly MAX_DURATION = 3000; // ms

  constructor(private ngZone: NgZone) {}

  monitorChangeDetection() {
    let cdCycles = 0;
    let lastTime = performance.now();

    this.ngZone.onStable.subscribe(() => {
      const now = performance.now();
      const duration = now - lastTime;

      cdCycles++;
      if (duration > this.MAX_DURATION) {
        console.warn(`Slow CD cycle: ${duration}ms`);
      }

      lastTime = now;
    });
  }

  monitorLongTasks() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > this.MAX_DURATION) {
          console.warn(`Long task: ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
  }

  getCoreMetrics() {
    return {
      lcp: this.getLCP(),
      fid: this.getFID(),
      cls: this.getCLS(),
      pageLoadTime: this.getPageLoadTime()
    };
  }

  private getLCP(): number {
    const entries = performance.getEntriesByType('largest-contentful-paint');
    return entries.length > 0 ? entries[entries.length - 1].startTime : 0;
  }

  private getFID(): number {
    let fid = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        fid = Math.max(fid, entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });
    return fid;
  }

  private getCLS(): number {
    let cls = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
    return cls;
  }

  private getPageLoadTime(): number {
    const perfData = window.performance.timing;
    return perfData.loadEventEnd - perfData.navigationStart;
  }
}
```

---

### Q12: What are the best practices for performance?

**Answer:**

**1. Use OnPush change detection by default**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**2. Implement TrackBy in all *ngFor**
```typescript
<div *ngFor="let item of items; trackBy: trackByFn">
```

**3. Lazy load modules**
```typescript
loadChildren: () => import('./module').then(m => m.Module)
```

**4. Unsubscribe from observables**
```typescript
.pipe(takeUntil(this.destroy$))
```

**5. Virtual scroll for long lists**
```typescript
<cdk-virtual-scroll-viewport>
```

**6. Avoid expensive template operations**
```typescript
// Pre-compute instead of calling functions
computedValue = this.expensive();
```

**7. Use async pipe**
```typescript
{{ data$ | async }}
```

**8. Code splitting with lazy loading**
```typescript
loadChildren: () => import(...)
```

**9. Tree shake unused code**
```typescript
import { func } from 'lib-es';
```

**10. Monitor performance continuously**
```typescript
this.performanceMonitor.monitorChangeDetection();
```

---

## Summary

**Performance is about:**
1. Measurement - identify real bottlenecks
2. Analysis - understand root causes
3. Optimization - targeted fixes
4. Monitoring - track improvements

**Top impacts:**
- OnPush change detection
- TrackBy in lists
- Lazy loading
- Unsubscribing from observables
- Virtual scrolling

Use tools and data-driven approach. Measure before and after. Focus on what matters most to users.
