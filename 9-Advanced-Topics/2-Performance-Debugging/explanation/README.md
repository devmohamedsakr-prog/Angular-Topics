# Performance Debugging & Profiling in Angular

## Overview

Performance is critical for user experience. This guide covers identifying bottlenecks, profiling applications, and optimization strategies using browser tools and Angular-specific techniques.

---

## Performance Metrics

### Core Web Vitals

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| **FID** (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

### Performance Metrics to Track

```typescript
// Measure page load time
const perfData = window.performance.timing;
const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
console.log(`Page load time: ${pageLoadTime}ms`);

// Measure specific operations
const startTime = performance.now();
// ... operation ...
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime}ms`);

// Mark and measure
performance.mark('operation-start');
// ... operation ...
performance.mark('operation-end');
performance.measure('operation', 'operation-start', 'operation-end');
```

---

## Browser DevTools

### 1. **Performance Tab (Chrome DevTools)**

**Steps:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Click record button
4. Perform actions
5. Stop recording
6. Analyze results

**Key metrics:**
- **FCP** (First Contentful Paint) - When first content appears
- **LCP** (Largest Contentful Paint) - When main content loads
- **DCL** (DOMContentLoaded) - When DOM is ready
- **Load** - When page fully loads

### 2. **Angular DevTools**

Install Angular DevTools extension to:
- View component tree
- Inspect component properties
- Check change detection cycles
- Profile component execution time

### 3. **Network Tab**

Identify:
- Large bundles
- Slow API calls
- Render-blocking resources
- Caching issues

---

## Change Detection Performance

### 1. **OnPush Strategy** (Most Important)

```typescript
// ❌ Default - checks all components on every event
@Component({
  selector: 'app-item',
  template: `<div>{{ item.name }}</div>`
})
export class ItemComponent {
  @Input() item: any;
}

// ✅ OnPush - only when input changes
@Component({
  selector: 'app-item',
  template: `<div>{{ item.name }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent {
  @Input() item: any;
}
```

**Benefits:**
- Fewer change detection cycles
- Faster rendering
- Better performance with large lists

### 2. **TrackBy Function**

```typescript
// ❌ Bad - recreates all elements on every change
<div *ngFor="let item of items">
  {{ item.name }}
</div>

// ✅ Good - only updates changed items
export class ListComponent {
  items: Item[] = [];

  trackByFn(index: number, item: Item): number {
    return item.id; // Unique identifier
  }
}

<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

### 3. **Manual Change Detection Control**

```typescript
@Component({
  selector: 'app-high-frequency',
  template: `<div>{{ counter }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighFrequencyComponent {
  counter = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Updates 1000 times per second, but only triggers change detection
    // when explicitly called
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.counter++;
        
        // Only update UI every 100 updates
        if (this.counter % 100 === 0) {
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });
        }
      }, 0);
    });
  }
}
```

---

## Bundle Size Optimization

### 1. **Analyze Bundle Size**

```bash
# Generate build stats
ng build --prod --stats-json

# Analyze with webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/app/stats.json
```

### 2. **Code Splitting**

```typescript
// Lazy load features
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

### 3. **Tree Shaking**

```typescript
// ❌ Bad - imports entire library
import * as _ from 'lodash';

// ✅ Good - imports only needed function
import { debounce } from 'lodash-es';
```

---

## Memory Leaks

### 1. **Unsubscribe from Observables**

```typescript
// ❌ Leaks memory
export class Component {
  ngOnInit() {
    this.data$.subscribe(data => {
      this.data = data;
    });
  }
}

// ✅ Proper cleanup
export class Component implements OnDestroy {
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

### 2. **Detach Components**

```typescript
@Component({
  selector: 'app-heavy',
  template: `<div>{{ expensiveComputation() }}</div>`
})
export class HeavyComponent implements OnDestroy {
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Detach from change detection
    this.cdr.detach();
    
    // Reattach on specific events
    setTimeout(() => {
      this.cdr.reattach();
    }, 5000);
  }

  ngOnDestroy() {
    // Always clean up
    this.cdr.detach();
  }
}
```

### 3. **Remove Event Listeners**

```typescript
// ❌ Leaks listener
export class Component {
  ngOnInit() {
    window.addEventListener('scroll', this.onScroll);
  }
}

// ✅ Proper cleanup
export class Component implements OnDestroy {
  onScroll = () => {
    // Handle scroll
  };

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }
}
```

---

## Rendering Performance

### 1. **Virtual Scrolling**

```typescript
// For long lists, only render visible items
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-virtual-list',
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="list">
      <div *cdkVirtualFor="let item of items" class="item">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
export class VirtualListComponent {
  items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }));
}
```

### 2. **Defer Loading with @defer**

```typescript
// Angular 17+ - defer heavy components
@Component({
  template: `
    @defer (on viewport) {
      <app-heavy-component />
    } @placeholder {
      <div>Loading...</div>
    }
  `
})
export class AppComponent {}
```

### 3. **Avoid Expensive Operations in Templates**

```typescript
// ❌ Bad - calls function on every change detection
<div>{{ expensiveFunction() }}</div>

// ✅ Good - pre-computed in component
export class Component {
  result = this.expensiveFunction();
}
<div>{{ result }}</div>

// ✅ Good - use async pipe
export class Component {
  result$ = this.computeResult$();
}
<div>{{ result$ | async }}</div>
```

---

## Timing and Profiling

### 1. **Measure Component Initialization**

```typescript
@Component({
  selector: 'app-profiled'
})
export class ProfiledComponent implements OnInit, OnDestroy {
  ngOnInit() {
    performance.mark('component-init-start');
    
    // Initialization code
    
    performance.mark('component-init-end');
    performance.measure(
      'component-init',
      'component-init-start',
      'component-init-end'
    );
    
    const measure = performance.getEntriesByName('component-init')[0];
    console.log(`Component init took ${measure.duration}ms`);
  }

  ngOnDestroy() {
    // Cleanup
  }
}
```

### 2. **Monitor Change Detection**

```typescript
@Component({
  selector: 'app-monitored'
})
export class MonitoredComponent {
  constructor(private ngZone: NgZone) {
    this.ngZone.onStable.subscribe(() => {
      console.log('Change detection cycle complete');
    });
  }
}
```

---

## Performance Best Practices

1. **Use OnPush change detection**
   - Reduce change detection cycles
   - Better performance with large apps

2. **Use TrackBy in *ngFor**
   - Only updates changed items
   - Critical for performance

3. **Lazy load features**
   - Reduce initial bundle
   - Faster initial load

4. **Unsubscribe from observables**
   - Prevent memory leaks
   - Use `takeUntil` pattern

5. **Virtual scroll long lists**
   - Only render visible items
   - Handles thousands of items

6. **Use async pipe**
   - Auto-unsubscribes
   - Simpler code

7. **Avoid expensive operations in templates**
   - Pre-compute in component
   - Use pipes for formatting

8. **Code split with lazy loading**
   - Reduce initial bundle
   - Load on demand

9. **Use Angular CLI production build**
   - Minification
   - Tree shaking
   - Ahead-of-time compilation

10. **Monitor bundle size**
    - Use webpack-bundle-analyzer
    - Keep dependencies minimal

---

## Summary

Performance optimization involves:
- **Measurement** - Identify actual bottlenecks
- **Analysis** - Use DevTools to understand issues
- **Optimization** - Apply targeted fixes
- **Monitoring** - Track improvements over time

Key areas:
- Change detection strategy
- Bundle size
- Memory management
- Rendering performance
- API response times

Use tools and profiling to identify real issues, then apply targeted optimizations.
