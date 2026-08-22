# Change Detection Interview Questions (Quick Reference)

## Q1-Q3: Change Detection Basics
```typescript
// Default strategy - checks all components
@Component({...})
export class MyComponent {}

// OnPush strategy - only checks on input changes
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  @Input() data: any; // Checked on change
}
```

## Q4-Q6: Manual Change Detection
```typescript
export class MyComponent {
  constructor(private cdr: ChangeDetectorRef) {}

  detectChanges() {
    this.cdr.detectChanges(); // Run detection immediately
  }

  markForCheck() {
    this.cdr.markForCheck(); // Mark for next check
  }

  detach() {
    this.cdr.detach(); // Stop checking
  }

  reattach() {
    this.cdr.reattach(); // Resume checking
  }
}
```

## Q7-Q9: Performance Optimization
```typescript
// Using OnPush with trackBy
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  @Input() items: Item[];

  trackByFn(index: number, item: Item) {
    return item.id;
  }
}

// Using async pipe
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ data$ | async }}`
})
export class AsyncComponent {
  data$ = this.service.getData();

  constructor(private service: DataService) {}
}
```

## Q10-Q12: Change Detection Zone
```typescript
export class MyComponent {
  constructor(private ngZone: NgZone) {}

  outsideAngular() {
    this.ngZone.runOutsideAngular(() => {
      // Code runs outside Angular zone - no change detection
      window.addEventListener('mousemove', () => {});
    });
  }

  backInsideAngular() {
    this.ngZone.run(() => {
      // Triggers change detection
      this.value = 'updated';
    });
  }
}
```

## Q13-Q15: Best Practices
```
✅ Use OnPush for performance
✅ Use trackBy in ngFor
✅ Use async pipe
✅ Detach from zone for high-frequency events
✅ Use immutable patterns
✅ Avoid complex expressions in templates
✅ Use OnDestroy for cleanup
✅ Profile with Chrome DevTools
```

