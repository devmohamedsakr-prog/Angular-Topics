# Component Lifecycle

## What is Component Lifecycle?

Component lifecycle refers to the sequence of phases a component goes through from its creation to its destruction. Angular provides lifecycle hooks that allow you to run code at key moments in the component's lifecycle.

## Lifecycle Hooks (In Order)

### 1. ngOnChanges

Called **before ngOnInit** and whenever input properties change.

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user',
  template: '<p>{{ user.name }}</p>'
})
export class UserComponent implements OnChanges {
  @Input() user: { id: number; name: string };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      const change = changes['user'];
      console.log('Previous:', change.previousValue);
      console.log('Current:', change.currentValue);
      console.log('First change:', change.firstChange);
    }
  }
}
```

**When to use**:
- Respond to input changes
- Perform calculations based on new inputs
- Log input changes for debugging

### 2. ngOnInit

Called **once** after component is initialized and inputs are set.

```typescript
@Component({
  selector: 'app-user-list',
  template: '<div>{{ users | json }}</div>'
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    // Load data
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }
}
```

**When to use**:
- Load initial data from services
- Initialize component properties
- Set up subscriptions
- Perform one-time setup

### 3. ngDoCheck

Called during **every change detection cycle**.

```typescript
@Component({
  selector: 'app-counter',
  template: '<p>{{ count }}</p>'
})
export class CounterComponent implements DoCheck {
  count = 0;

  ngDoCheck() {
    console.log('Change detection ran, count:', this.count);
  }
}
```

**When to use**:
- Custom change detection logic
- Detect changes Angular can't see
- **Warning**: Called very frequently, use sparingly

### 4. ngAfterContentInit

Called **after content (ng-content) is initialized**.

```typescript
@Component({
  selector: 'app-card',
  template: `
    <div class="header">
      <ng-content select="[cardHeader]"></ng-content>
    </div>
  `
})
export class CardComponent implements AfterContentInit {
  @ContentChild('titleTemplate') titleTemplate: TemplateRef<any>;

  ngAfterContentInit() {
    console.log('Content initialized:', this.titleTemplate);
  }
}
```

**When to use**:
- Access projected content
- Initialize content-related properties
- Perform calculations on projected content

### 5. ngAfterContentChecked

Called **after content check** during every change detection cycle.

```typescript
export class CardComponent implements AfterContentChecked {
  ngAfterContentChecked() {
    // Runs after content is checked
  }
}
```

**When to use**:
- Rarely used
- After every content check (frequent)

### 6. ngAfterViewInit

Called **after view and child views are initialized**.

```typescript
@Component({
  selector: 'app-parent',
  template: `
    <input #searchInput />
    <app-child #childComponent></app-child>
  `
})
export class ParentComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(ChildComponent) childComponent: ChildComponent;

  ngAfterViewInit() {
    // Access view children
    this.searchInput.nativeElement.focus();
    this.childComponent.initialize();
  }
}
```

**When to use**:
- Access DOM elements
- Access child components
- Call methods on child components
- Initialize view-related logic

### 7. ngAfterViewChecked

Called **after view check** during every change detection cycle.

```typescript
export class ParentComponent implements AfterViewChecked {
  ngAfterViewChecked() {
    // Runs after view is checked
  }
}
```

**When to use**:
- Rarely used
- After every view check (frequent)

### 8. ngOnDestroy

Called **before component is destroyed**.

```typescript
@Component({
  selector: 'app-user-detail'
})
export class UserDetailComponent implements OnDestroy {
  private subscription: Subscription;

  constructor(private userService: UserService) {
    this.subscription = this.userService.userUpdated$.subscribe(data => {
      // Handle updates
    });
  }

  ngOnDestroy() {
    // Clean up
    this.subscription.unsubscribe();
  }
}
```

**When to use**:
- Unsubscribe from observables
- Clean up timers/intervals
- Release resources
- Prevent memory leaks

## Lifecycle Execution Order

```
1. Constructor
   ↓
2. ngOnChanges (if inputs exist)
   ↓
3. ngOnInit
   ↓
4. ngDoCheck
   ↓
5. ngAfterContentInit
   ↓
6. ngAfterContentChecked
   ↓
7. ngAfterViewInit
   ↓
8. ngAfterViewChecked
   ↓
(Change detection cycle repeats 4-8)
   ↓
9. ngOnDestroy (on component removal)
```

## Implementing Lifecycle Interfaces

### Single Interface

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<p>Example</p>'
})
export class ExampleComponent implements OnInit {
  ngOnInit() {
    console.log('Initialized');
  }
}
```

### Multiple Interfaces

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-example'
})
export class ExampleComponent implements OnInit, OnDestroy {
  ngOnInit() {
    console.log('Initialized');
  }

  ngOnDestroy() {
    console.log('Destroyed');
  }
}
```

## Common Patterns

### Unsubscription Pattern

```typescript
export class DataComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  ngOnInit() {
    const sub1 = this.service.data$.subscribe(data => {
      // Handle data
    });
    const sub2 = this.service.updates$.subscribe(update => {
      // Handle updates
    });
    
    this.subscriptions.push(sub1, sub2);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
```

### Using takeUntil

```typescript
import { takeUntil } from 'rxjs/operators';

export class DataComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Detecting Input Changes

```typescript
export class ConfigComponent implements OnChanges {
  @Input() config: any;
  @Input() theme: string;

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chg = changes[propName];
      const cur = JSON.stringify(chg.currentValue);
      const prev = JSON.stringify(chg.previousValue);
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
  }
}
```

## Performance Considerations

### Avoid Heavy Operations in DoCheck

❌ **Bad** - Called for every change detection
```typescript
ngDoCheck() {
  // Heavy calculation runs hundreds of times
  this.complexCalculation();
}
```

✅ **Good** - Use ngOnInit instead
```typescript
ngOnInit() {
  this.result = this.complexCalculation();
}
```

### Unsubscribe to Prevent Memory Leaks

❌ **Bad** - Memory leak
```typescript
ngOnInit() {
  this.service.data$.subscribe(data => {
    this.data = data;
  }); // Never unsubscribed
}
```

✅ **Good** - Properly cleaned up
```typescript
ngOnInit() {
  this.subscription = this.service.data$.subscribe(data => {
    this.data = data;
  });
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

## Best Practices

✅ Always implement ngOnDestroy to clean up  
✅ Use ngOnInit for initialization, not constructor  
✅ Use takeUntil for observable cleanup  
✅ Avoid heavy operations in DoCheck  
✅ Use ngAfterViewInit for DOM access  
✅ Detect input changes in ngOnChanges  
✅ Unsubscribe from all subscriptions  
✅ Be aware of lifecycle hook performance impact

## Key Takeaways

- Components have 8 lifecycle hooks in a specific order
- ngOnInit is called once after component initialization
- ngOnChanges detects when inputs change
- ngOnDestroy is crucial for cleanup
- Proper cleanup prevents memory leaks
- Lifecycle hooks enable precise control over component behavior
- Use appropriate hooks for different tasks
