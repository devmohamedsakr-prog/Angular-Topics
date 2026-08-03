# Change Detection - Deep Dive

## Change Detection Basics

Change detection is the process Angular uses to determine if data has changed and needs to update the view.

## How Change Detection Works

1. Angular detects an event (click, HTTP response, timer, etc)
2. Zone.js notifies Angular about the event
3. Angular runs change detection from root component down
4. Component properties are compared with previous values
5. If changed, template is updated
6. Process repeats for child components

## Change Detection Strategies

### Default Strategy
Checks every component every time:

```typescript
@Component({
  selector: 'app-default',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultComponent {
  // Checked on every change detection cycle
}
```

### OnPush Strategy
Only checks when:
- @Input property reference changes
- Component event fires
- Async pipe receives new value

```typescript
@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  @Input() user: User;

  constructor(private cdr: ChangeDetectorRef) {}

  onClick() {
    // Must manually trigger check
    this.cdr.markForCheck();
  }

  updateUser(newUser: User) {
    // OnPush detects this change
    this.user = newUser;
  }

  addPropertyToUser() {
    // OnPush doesn't detect this
    this.user.name = 'New Name';
  }

  addPropertyCorrectly() {
    // Create new object for OnPush to detect
    this.user = { ...this.user, name: 'New Name' };
  }
}
```

## ChangeDetectorRef

Manual control over change detection:

```typescript
@Component({})
export class ManualChangeDetectionComponent {
  count = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  increment() {
    this.count++;
    // Manually trigger change detection
    this.cdr.markForCheck();
  }

  detachAndReattach() {
    // Detach from change detection
    this.cdr.detach();

    // Do expensive operations
    this.performCalculations();

    // Reattach to change detection
    this.cdr.reattach();
  }

  forceCheck() {
    // Check this component and children
    this.cdr.detectChanges();
  }
}
```

## Zone.js

Zone.js intercepts async operations and triggers change detection:

```typescript
import { NgZone } from '@angular/core';

@Component({})
export class ZoneComponent {
  constructor(private ngZone: NgZone) {}

  expensiveOperation() {
    // Run outside Angular zone
    this.ngZone.runOutsideAngular(() => {
      // Change detection won't trigger for these operations
      this.heavyCalculation();
      
      setInterval(() => {
        this.updateProgress();
        // Change detection won't happen here
      }, 100);
    });
  }

  updateAfterExpensiveOp() {
    this.ngZone.runOutsideAngular(() => {
      // Heavy operation outside zone
      this.heavyCalculation();
    });

    // Run back inside zone to trigger change detection
    this.ngZone.run(() => {
      // Update UI
      this.displayResults();
    });
  }

  preventMultipleDetections() {
    // Run multiple operations, then detect once
    this.ngZone.runOutsideAngular(() => {
      operation1();
      operation2();
      operation3();
    });

    this.ngZone.run(() => {
      // Trigger change detection once for all operations
    });
  }
}
```

## Performance Optimization Strategies

### 1. Immutable Data

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImmutableComponent {
  @Input() items: Item[];

  addItem(item: Item) {
    // OnPush detects this (new array reference)
    this.items = [...this.items, item];
  }

  updateItem(index: number, updated: Item) {
    // OnPush detects this (new array reference)
    this.items = [
      ...this.items.slice(0, index),
      updated,
      ...this.items.slice(index + 1)
    ];
  }

  removeItem(index: number) {
    // OnPush detects this (new array reference)
    this.items = this.items.filter((_, i) => i !== index);
  }
}
```

### 2. TrackBy with *ngFor

```typescript
@Component({
  template: `
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackByComponent {
  @Input() items: Item[];

  trackByFn(index: number, item: Item): any {
    return item.id; // Return unique identifier
  }

  // Better with function
  trackById = (index: number, item: Item): number => item.id;
}
```

### 3. Detach and Manual Update

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.Default
})
export class ManualUpdateComponent implements OnInit {
  data: any;

  constructor(private cdr: ChangeDetectorRef, private dataService: DataService) {}

  ngOnInit() {
    // Detach from automatic change detection
    this.cdr.detach();

    // Manually subscribe and trigger detection
    this.dataService.getData().subscribe(data => {
      this.data = data;
      // Only detect when we have new data
      this.cdr.detectChanges();
    });
  }
}
```

### 4. Async Pipe with OnPush

```typescript
@Component({
  template: `
    <div>{{ data$ | async }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyncPipeComponent {
  data$: Observable<any>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Async pipe automatically marks for check
    this.data$ = this.dataService.getData();
  }
}
```

## Change Detection Events

```typescript
@Component({})
export class ChangeDetectionEventsComponent {
  constructor(private cdr: ChangeDetectorRef) {}

  ngDoCheck() {
    // Called during every change detection cycle
    console.log('Change detection running');
  }

  ngAfterContentChecked() {
    // Called after checking component content
  }

  ngAfterViewChecked() {
    // Called after checking component view
  }

  // Listening to change detection events
  detectChangeDetection() {
    const subscription = this.cdr.changes.subscribe(
      (value: ChangeDetectionRef) => {
        console.log('Change detected', value);
      }
    );
  }
}
```

## Performance Monitoring

```typescript
@Injectable({ providedIn: 'root' })
export class ChangeDetectionMonitor {
  private isDetecting = false;

  monitorChangeDetection() {
    const originalDetectChanges = ChangeDetectorRef.prototype.detectChanges;

    ChangeDetectorRef.prototype.detectChanges = function() {
      console.time('Change Detection');
      originalDetectChanges.call(this);
      console.timeEnd('Change Detection');
    };
  }

  // Measure specific operations
  measureChangeDetection<T>(operation: () => T): T {
    console.time('Operation with Change Detection');
    const result = operation();
    console.timeEnd('Operation with Change Detection');
    return result;
  }
}
```

## Best Practices

1. **Use OnPush by default** - More predictable and performant
2. **Immutable data structures** - Works well with OnPush
3. **Use trackBy with *ngFor** - Especially important for lists
4. **Run outside zone for heavy operations** - Use ngZone.runOutsideAngular()
5. **Avoid frequent property changes** - Batch updates
6. **Use async pipe** - Automatically handles change detection
7. **Monitor performance** - Use DevTools and profiling
8. **Test change detection** - Verify component updates correctly

## Common Pitfalls

```typescript
// ❌ WRONG - Won't detect with OnPush
updateArray() {
  this.items.push(newItem);
}

// ✓ CORRECT - Creates new reference
updateArray() {
  this.items = [...this.items, newItem];
}

// ❌ WRONG - Expensive change detection
runExpensiveOperation() {
  // Triggers change detection multiple times
  for (let i = 0; i < 1000; i++) {
    this.data = computeValue(i);
  }
}

// ✓ CORRECT - Run outside zone
runExpensiveOperation() {
  this.ngZone.runOutsideAngular(() => {
    for (let i = 0; i < 1000; i++) {
      this.data = computeValue(i);
    }
  });
  
  this.ngZone.run(() => {
    // Update UI once
  });
}
```

## Key Takeaways

- Change detection is how Angular updates views
- Default strategy checks all components every cycle
- OnPush strategy only checks on input changes
- Immutable data works well with OnPush
- Zone.js controls when change detection runs
- Manual control available via ChangeDetectorRef
- Performance monitoring helps identify bottlenecks
- Proper strategy selection is critical for app performance
