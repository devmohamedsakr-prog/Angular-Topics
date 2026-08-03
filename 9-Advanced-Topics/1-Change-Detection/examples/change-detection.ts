/**
 * Angular Change Detection - Complete Examples
 * Demonstrates default strategy, OnPush strategy, performance optimization, and manual detection
 */

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Default Change Detection Strategy
// ============================================================================

/**
 * Default strategy - checks entire component tree on any change
 * Performance: Slower for large apps
 */
@Component({
  selector: 'app-default-detection',
  template: `
    <div>
      <p>Counter: {{ counter }}</p>
      <p>Random: {{ getRandom() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `,
  // changeDetection: ChangeDetectionStrategy.Default  // default
})
export class DefaultDetectionComponent {
  counter = 0;

  increment(): void {
    this.counter++;
    console.log('Detected change - entire tree checked');
  }

  getRandom(): number {
    return Math.random();
  }
}

// ============================================================================
// EXAMPLE 2: OnPush Change Detection Strategy
// ============================================================================

/**
 * OnPush strategy - only checks when:
 * - @Input property changes
 * - Event handler fires in component
 * - Observable emits (with async pipe)
 * - Manual change detection triggered
 * Performance: 30-50% faster
 */
@Component({
  selector: 'app-onpush-child',
  template: `
    <div>
      <p>User: {{ user?.name }}</p>
      <p>Random: {{ getRandom() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushChildComponent {
  @Input() user: { id: number; name: string } | null = null;

  getRandom(): number {
    // Only called when component is checked
    return Math.random();
  }
}

@Component({
  selector: 'app-onpush-parent',
  template: `
    <div>
      <app-onpush-child [user]="user"></app-onpush-child>
      <button (click)="updateUser()">Update User</button>
      <button (click)="mutatuser()">Mutate User (Bad)</button>
    </div>
  `,
})
export class OnPushParentComponent {
  user = { id: 1, name: 'John' };

  // ✅ GOOD - creates new reference, triggers OnPush
  updateUser(): void {
    this.user = { ...this.user, name: 'Jane' };
  }

  // ❌ BAD - mutates object, doesn't trigger OnPush
  mutatuser(): void {
    this.user.name = 'Bob'; // Child won't detect change
  }
}

// ============================================================================
// EXAMPLE 3: Immutable Data Patterns with OnPush
// ============================================================================

/**
 * Immutable state management
 */
@Component({
  selector: 'app-immutable-state',
  template: `
    <div>
      <p>Items: {{ items | json }}</p>
      <button (click)="addItem()">Add Item</button>
      <button (click)="removeItem()">Remove Item</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImmutableStateComponent {
  items: string[] = ['Item 1', 'Item 2'];

  addItem(): void {
    // ✅ GOOD - create new array reference
    this.items = [...this.items, `Item ${this.items.length + 1}`];
  }

  removeItem(): void {
    // ✅ GOOD - create new array reference
    this.items = this.items.slice(0, -1);
  }

  // ❌ BAD - mutation won't trigger change detection
  badAddItem(): void {
    this.items.push('Item'); // Won't work with OnPush
  }
}

// ============================================================================
// EXAMPLE 4: OnPush with Observables and Async Pipe
// ============================================================================

/**
 * OnPush with async pipe - automatically marks for check
 */
@Component({
  selector: 'app-async-pipe-detection',
  template: `
    <div>
      <p>Timer: {{ timer$ | async }}</p>
      <p>Data: {{ data$ | async | json }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncPipeDetectionComponent implements OnInit {
  timer$: any;
  data$: any;

  constructor() {
    // Observable with async pipe auto-marks for check
    this.timer$ = interval(1000);
    this.data$ = new BehaviorSubject({ id: 1, name: 'Test' });
  }

  ngOnInit(): void {
    // Component will update automatically when observables emit
  }
}

// ============================================================================
// EXAMPLE 5: Manual Change Detection
// ============================================================================

/**
 * Manually trigger change detection
 */
@Component({
  selector: 'app-manual-detection',
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <p>Async Data: {{ data }}</p>
      <button (click)="updateAsync()">Update Async</button>
      <button (click)="markForCheck()">Mark for Check</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualDetectionComponent {
  count = 0;
  data: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  updateAsync(): void {
    // Async operation outside Angular zone
    setTimeout(() => {
      this.data = { updated: true };
      // Manually mark for check
      this.cdr.markForCheck();
    }, 1000);
  }

  markForCheck(): void {
    // Force change detection
    this.cdr.markForCheck();
  }

  // Detect changes immediately
  detectChanges(): void {
    this.cdr.detectChanges();
  }
}

// ============================================================================
// EXAMPLE 6: Change Detection with NgZone
// ============================================================================

/**
 * Run code outside Angular zone for performance
 */
@Component({
  selector: 'app-ngzone-detection',
  template: `
    <div>
      <p>Position: {{ position | json }}</p>
      <button (click)="startTracking()">Start Mouse Tracking</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgZoneDetectionComponent implements OnInit, OnDestroy {
  position = { x: 0, y: 0 };
  private destroy$ = new Subject<void>();

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Run outside Angular zone - no change detection
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', (e) => {
        this.position = { x: e.clientX, y: e.clientY };
        // Only mark for check periodically (every 100ms)
        // instead of on every mousemove
      });
    });
  }

  startTracking(): void {
    // Mark for check to update view
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 7: Performance Comparison - Default vs OnPush
// ============================================================================

/**
 * Slow component with default detection
 */
@Component({
  selector: 'app-slow-component',
  template: `
    <div>
      <p>{{ expensiveComputation() }}</p>
      <p *ngFor="let item of items">{{ item }}</p>
    </div>
  `,
  // Default - checks on every zone event
})
export class SlowComponent {
  items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

  expensiveComputation(): number {
    console.log('Expensive computation running');
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i);
    }
    return result;
  }
}

/**
 * Fast component with OnPush detection
 */
@Component({
  selector: 'app-fast-component',
  template: `
    <div>
      <p>{{ expensiveComputation() }}</p>
      <p *ngFor="let item of items">{{ item }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FastComponent {
  @Input() items: string[] = [];

  expensiveComputation(): number {
    console.log('Expensive computation running (less frequently)');
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i);
    }
    return result;
  }
}

// ============================================================================
// EXAMPLE 8: Detached Change Detection
// ============================================================================

/**
 * Detach and reattach change detection
 */
@Component({
  selector: 'app-detached-detection',
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <p>Status: {{ isDetached ? 'Detached' : 'Attached' }}</p>
      <button (click)="toggleDetach()">Toggle Detach</button>
      <button (click)="increment()">Increment</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetachedDetectionComponent {
  count = 0;
  isDetached = false;

  constructor(private cdr: ChangeDetectorRef) {}

  toggleDetach(): void {
    if (this.isDetached) {
      this.cdr.reattach();
      this.isDetached = false;
    } else {
      this.cdr.detach();
      this.isDetached = true;
    }
  }

  increment(): void {
    this.count++;
    // When detached, view won't update automatically
    if (!this.isDetached) {
      this.cdr.markForCheck();
    }
  }
}

// ============================================================================
// EXAMPLE 9: Smart Parent/Child with OnPush
// ============================================================================

/**
 * Smart parent using OnPush
 */
@Component({
  selector: 'app-smart-parent',
  template: `
    <div>
      <h2>Smart Parent (OnPush)</h2>
      <app-smart-child [data]="data$ | async"></app-smart-child>
      <button (click)="updateData()">Update Data</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartParentComponent {
  data$ = new BehaviorSubject({ id: 1, name: 'Initial' });

  updateData(): void {
    // Create new reference
    const current = this.data$.value;
    this.data$.next({ ...current, name: 'Updated' });
  }
}

/**
 * Dumb child using OnPush
 */
@Component({
  selector: 'app-smart-child',
  template: `<p>{{ data | json }}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartChildComponent {
  @Input() data: any;
}

// ============================================================================
// EXAMPLE 10: Change Detection Debugging
// ============================================================================

/**
 * Debug change detection with logging
 */
@Component({
  selector: 'app-debug-detection',
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugDetectionComponent implements OnInit {
  count = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Log when ngDoCheck is called
    this.logChanges();
  }

  increment(): void {
    this.count++;
  }

  private logChanges(): void {
    const originalCheck = this.cdr.markForCheck;
    this.cdr.markForCheck = function () {
      console.log('markForCheck called');
      return originalCheck.call(this);
    };
  }

  // Use Angular DevTools to debug further
  // 1. Install Angular DevTools Chrome extension
  // 2. Open DevTools → Profiler
  // 3. Record change detection cycles
  // 4. Analyze component tree updates
}

// ============================================================================
// EXAMPLE 11: Best Practices Summary
// ============================================================================

/**
 * BEST PRACTICES:
 *
 * 1. USE OnPush BY DEFAULT
 *    - Better performance
 *    - Forces immutable patterns
 *    - Easier to reason about
 *
 * 2. USE IMMUTABLE PATTERNS
 *    ✅ const newArray = [...oldArray, newItem]
 *    ✅ const newObj = { ...oldObj, prop: value }
 *    ✅ Observable with async pipe
 *    ❌ array.push(item)
 *    ❌ obj.prop = value
 *
 * 3. USE ASYNC PIPE WITH OnPush
 *    - Auto-marks for check
 *    - Handles unsubscription
 *    - Cleaner code
 *
 * 4. USE NgZone FOR PERFORMANCE
 *    - Run expensive operations outside zone
 *    - Manual markForCheck when needed
 *    - Reduces unnecessary checks
 *
 * 5. PROFILE BEFORE OPTIMIZING
 *    - Use Chrome DevTools Performance tab
 *    - Use Angular DevTools Profiler
 *    - Measure actual impact
 *
 * 6. AVOID COMMON PITFALLS
 *    - Don't mutate objects/arrays with OnPush
 *    - Don't forget to mark for check after async
 *    - Don't mix Change Detection strategies
 *    - Don't rely on Default strategy
 */

// ============================================================================
// EXAMPLE 12: Performance Monitoring
// ============================================================================

/**
 * Monitor change detection performance
 */
@Component({
  selector: 'app-performance-monitor',
  template: `
    <div>
      <p>Check Count: {{ checkCount }}</p>
      <p>Render Time: {{ renderTime }}ms</p>
      <button (click)="triggerDetection()">Trigger Detection</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceMonitorComponent {
  checkCount = 0;
  renderTime = 0;

  constructor(private cdr: ChangeDetectorRef) {
    this.monitorPerformance();
  }

  private monitorPerformance(): void {
    // Mark start of detection
    const originalDetect = this.cdr.detectChanges;
    this.cdr.detectChanges = () => {
      const start = performance.now();
      this.checkCount++;

      originalDetect.call(this);

      this.renderTime = Math.round(performance.now() - start);
    };
  }

  triggerDetection(): void {
    this.cdr.detectChanges();
  }
}

// ============================================================================
// EXAMPLE 13: Complete Component with All Patterns
// ============================================================================

@Component({
  selector: 'app-complete-detection',
  template: `
    <div>
      <h3>Data: {{ (data$ | async)?.name }}</h3>
      <p>Manual updates: {{ manualCount }}</p>
      <p>Detection cycles: {{ detectionCycles }}</p>
      <button (click)="updateData()">Update Data</button>
      <button (click)="manualUpdate()">Manual Update</button>
      <button (click)="markForCheck()">Mark for Check</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteDetectionComponent implements OnInit, OnDestroy {
  data$ = new BehaviorSubject({ id: 1, name: 'Initial' });
  manualCount = 0;
  detectionCycles = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Auto-update from observable
    this.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.detectionCycles++;
      });
  }

  updateData(): void {
    // Create new reference for OnPush detection
    const current = this.data$.value;
    this.data$.next({ ...current, name: `Updated ${Date.now()}` });
  }

  manualUpdate(): void {
    this.manualCount++;
    this.cdr.markForCheck();
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
