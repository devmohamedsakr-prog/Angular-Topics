/**
 * Performance Debugging & Profiling Examples
 * Demonstrates optimization patterns and profiling techniques
 */

import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  OnInit,
  OnDestroy,
  TrackByFunction,
  Input
} from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: OnPush Change Detection Strategy
// ============================================================================

// ❌ Default - checks on every event
@Component({
  selector: 'app-default-detection',
  template: `<div>{{ name }}</div>`
})
export class DefaultDetectionComponent {
  @Input() name: string;

  ngOnInit() {
    console.log('Default detection change detection triggered');
  }
}

// ✅ OnPush - only when input changes
@Component({
  selector: 'app-onpush-detection',
  template: `<div>{{ name }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushDetectionComponent {
  @Input() name: string;

  ngOnInit() {
    console.log('OnPush change detection triggered only on input change');
  }
}

// ============================================================================
// EXAMPLE 2: TrackBy Function in *ngFor
// ============================================================================

interface Item {
  id: number;
  name: string;
  description: string;
}

// ❌ Bad - recreates all DOM elements
@Component({
  selector: 'app-no-trackby',
  template: `
    <div *ngFor="let item of items">
      {{ item.name }}
    </div>
  `
})
export class NoTrackByComponent {
  items: Item[] = [];
}

// ✅ Good - uses TrackBy function
@Component({
  selector: 'app-with-trackby',
  template: `
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithTrackByComponent {
  @Input() items: Item[] = [];

  trackByFn: TrackByFunction<Item> = (index: number, item: Item) => {
    return item.id; // Return unique identifier
  };
}

// ============================================================================
// EXAMPLE 3: Manual Change Detection Control
// ============================================================================

@Component({
  selector: 'app-manual-change-detection',
  template: `
    <div>
      <p>Counter: {{ counter }}</p>
      <p>FPS: {{ fps }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualChangeDetectionComponent implements OnInit, OnDestroy {
  counter = 0;
  fps = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // Run counter update outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      let frameCount = 0;
      let lastTime = performance.now();

      const updateCounter = () => {
        this.counter++;
        frameCount++;

        // Calculate FPS every 60 frames
        if (frameCount >= 60) {
          const now = performance.now();
          const timeDiff = now - lastTime;
          this.fps = Math.round((frameCount * 1000) / timeDiff);

          // Trigger UI update only every 60 frames
          this.ngZone.run(() => {
            this.cdr.markForCheck();
          });

          frameCount = 0;
          lastTime = now;
        }

        requestAnimationFrame(updateCounter);
      };

      updateCounter();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 4: Virtual Scrolling
// ============================================================================

@Component({
  selector: 'app-virtual-scroll',
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="list-viewport">
      <div *cdkVirtualFor="let item of items; trackBy: trackByFn" class="list-item">
        <div>{{ item.id }} - {{ item.name }}</div>
        <small>{{ item.description }}</small>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .list-viewport {
      height: 500px;
      border: 1px solid #ccc;
    }
    .list-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class VirtualScrollComponent implements OnInit {
  items: Item[] = [];

  ngOnInit() {
    // Generate 10,000 items
    this.items = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `Description for item ${i}`
    }));
  }

  trackByFn(index: number, item: Item): number {
    return item.id;
  }
}

// ============================================================================
// EXAMPLE 5: Memory Leak Prevention
// ============================================================================

// ❌ Memory leak - subscription not cleaned up
@Component({
  selector: 'app-memory-leak'
})
export class MemoryLeakComponent implements OnInit {
  data: any;

  constructor(private dataService: any) {}

  ngOnInit() {
    this.dataService.getData().subscribe(data => {
      this.data = data; // Subscription never unsubscribed!
    });
  }
}

// ✅ Proper cleanup - uses takeUntil
@Component({
  selector: 'app-no-memory-leak'
})
export class NoMemoryLeakComponent implements OnInit, OnDestroy {
  data: any;
  private destroy$ = new Subject<void>();

  constructor(private dataService: any) {}

  ngOnInit() {
    this.dataService.getData().pipe(
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

// ============================================================================
// EXAMPLE 6: Performance Measurement
// ============================================================================

@Component({
  selector: 'app-performance-measurement'
})
export class PerformanceMeasurementComponent implements OnInit {
  initTime: number = 0;
  renderTime: number = 0;

  ngOnInit() {
    // Measure initialization time
    performance.mark('app-init-start');

    // Simulate initialization work
    this.initializeComponent();

    performance.mark('app-init-end');
    performance.measure(
      'app-initialization',
      'app-init-start',
      'app-init-end'
    );

    // Get measurement
    const measure = performance.getEntriesByName('app-initialization')[0];
    this.initTime = measure.duration;

    console.log(`Component initialization took ${this.initTime}ms`);
  }

  private initializeComponent() {
    // Simulate expensive initialization
    for (let i = 0; i < 1000000; i++) {
      Math.sqrt(i);
    }
  }
}

// ============================================================================
// EXAMPLE 7: Avoid Expensive Template Operations
// ============================================================================

// ❌ Bad - function called on every change detection
@Component({
  selector: 'app-expensive-template',
  template: `
    <div>{{ expensiveFunction() }}</div>
  `
})
export class ExpensiveTemplateComponent {
  expensiveFunction() {
    console.log('Expensive function called'); // Called many times!
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    return result;
  }
}

// ✅ Good - pre-computed
@Component({
  selector: 'app-precomputed-value',
  template: `
    <div>{{ computedValue }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrecomputedValueComponent implements OnInit {
  computedValue: number = 0;

  ngOnInit() {
    this.computedValue = this.expensiveComputation();
  }

  private expensiveComputation(): number {
    console.log('Expensive computation called once');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    return result;
  }
}

// ============================================================================
// EXAMPLE 8: Component Detachment
// ============================================================================

@Component({
  selector: 'app-detached-component',
  template: `
    <div>{{ data }}</div>
    <button (click)="reattach()">Reattach</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetachedComponent implements OnInit, OnDestroy {
  data: any;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: any
  ) {}

  ngOnInit() {
    // Detach from automatic change detection
    this.cdr.detach();

    // Manually update on specific condition
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.data = data;
      this.cdr.markForCheck(); // Only update when new data arrives
    });
  }

  reattach() {
    this.cdr.reattach();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 9: List Performance Optimization
// ============================================================================

@Component({
  selector: 'app-optimized-list',
  template: `
    <div>
      <div *ngFor="let item of filteredItems; trackBy: trackByFn">
        {{ item.name }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedListComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];

  ngOnInit() {
    // Generate large dataset
    this.items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `Description ${i}`
    }));

    // Pre-filter items instead of doing it in template
    this.filterItems();
  }

  private filterItems() {
    this.filteredItems = this.items.filter(item => item.id % 2 === 0);
  }

  trackByFn(index: number, item: Item): number {
    return item.id;
  }
}

// ============================================================================
// EXAMPLE 10: Monitoring Performance
// ============================================================================

@Component({
  selector: 'app-performance-monitor'
})
export class PerformanceMonitorComponent implements OnInit {
  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Monitor change detection cycles
    let cdCount = 0;

    this.ngZone.onStable.subscribe(() => {
      cdCount++;
      console.log(`Change detection cycle ${cdCount} complete`);
    });

    // Monitor zone stability
    this.ngZone.onUnstable.subscribe(() => {
      console.log('Zone became unstable - async operation started');
    });

    // Monitor performance entries
    this.logPerformanceMetrics();
  }

  private logPerformanceMetrics() {
    const perfData = window.performance.timing;

    const metrics = {
      navigationStart: perfData.navigationStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
      pageLoad: perfData.loadEventEnd - perfData.navigationStart,
      fcp: this.getFirstContentfulPaint(),
      lcp: this.getLargestContentfulPaint()
    };

    console.table(metrics);
  }

  private getFirstContentfulPaint(): number {
    const fcpEntry = performance
      .getEntriesByType('paint')
      .find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  private getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    return lcpEntries.length > 0
      ? lcpEntries[lcpEntries.length - 1].startTime
      : 0;
  }
}

// ============================================================================
// EXAMPLE 11: Async Pipe Usage
// ============================================================================

@Component({
  selector: 'app-with-async-pipe',
  template: `
    <!-- Auto-unsubscribes with async pipe -->
    <div>{{ data$ | async }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WithAsyncPipeComponent {
  data$ = interval(1000); // Returns observable
  // No need to unsubscribe - async pipe handles it!
}

// ============================================================================
// EXAMPLE 12: Defer Rendering Heavy Components
// ============================================================================

@Component({
  selector: 'app-deferred-loading',
  template: `
    <div>
      <p>Main content loaded</p>
      
      <!-- Defer heavy component until visible -->
      <!-- Requires Angular 17+ -->
      <!-- @defer (on viewport) {
        <app-heavy-component />
      } @placeholder {
        <div>Loading heavy component...</div>
      } -->
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeferredLoadingComponent {}
