# Advanced Patterns & Optimization

## Change Detection Strategies

Change detection determines when Angular updates the view.

### Default Strategy (CheckAlways)

Angular checks component and all children on every event/async operation.

```typescript
@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent {
  data: any;

  constructor(private service: DataService) {}

  ngOnInit() {
    this.service.getData().subscribe(data => {
      this.data = data; // Triggers change detection
    });
  }
}
```

**Pros**: Simple, automatic
**Cons**: Slower for large apps, unnecessary checks

### OnPush Strategy

Only checks when inputs change or events occur in component.

```typescript
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['user']
})
export class UserCardComponent {
  @Input() user: User;
  
  template: `<h2>{{ user.name }}</h2>`
}

// Parent - only triggers child check when user changes
@Component({
  template: `<app-user-card [user]="currentUser"></app-user-card>`
})
export class ParentComponent {
  currentUser: User;
}
```

**Pros**: Better performance, predictable
**Cons**: More complex, requires immutable patterns

### Manual Change Detection

```typescript
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {
  data: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  loadData() {
    this.data = []; // Won't trigger UI update automatically
    this.cdr.markForCheck(); // Manual trigger
  }

  forceUpdate() {
    this.cdr.detectChanges(); // Force immediate check
  }
}
```

## Smart vs Presentational Components

### Presentational Component (Dumb)

Receives data via @Input, emits actions via @Output.

```typescript
@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngFor="let user of users">
      <h3>{{ user.name }}</h3>
      <button (click)="onDelete(user)">Delete</button>
    </div>
  `
})
export class UserListComponent {
  @Input() users: User[];
  @Output() userDeleted = new EventEmitter<User>();

  onDelete(user: User) {
    this.userDeleted.emit(user);
  }
}
```

**Characteristics**:
- Receives all data via @Input
- Pure presentation logic
- No service dependencies
- Emits events for actions
- Easy to test
- Reusable

### Smart Component (Container)

Manages data, handles business logic, orchestrates presentational components.

```typescript
@Component({
  selector: 'app-user-management',
  template: `
    <app-user-list 
      [users]="users$ | async"
      (userDeleted)="deleteUser($event)">
    </app-user-list>
  `
})
export class UserManagementComponent implements OnInit {
  users$ = this.userService.getUsers();

  constructor(private userService: UserService) {}

  deleteUser(user: User) {
    this.userService.deleteUser(user.id).subscribe(() => {
      // Handle deletion
    });
  }
}
```

**Characteristics**:
- Manages application state
- Handles API calls
- Contains business logic
- Orchestrates child components
- Handles errors and loading

### Pattern Benefits

```
Smart Component (Container)
      |
      | @Input/@Output
      |
Presentational Component (Presentational)
```

✅ Separation of concerns
✅ Easier testing
✅ Better reusability
✅ Predictable data flow

## Performance Optimization

### 1. Use OnPush Strategy

```typescript
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() data: any;
}
```

### 2. Use Immutable Data

```typescript
// Bad - mutable
user.name = 'John';

// Good - immutable
user = { ...user, name: 'John' };

// With arrays
users = [...users, newUser];
users = users.filter(u => u.id !== id);
```

### 3. Unsubscribe Properly

```typescript
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

### 4. Track by Function

```typescript
@Component({
  template: `
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  `
})
export class ListComponent {
  items: any[];

  trackByFn(index: number, item: any) {
    return item.id; // Unique identifier
  }
}
```

### 5. Lazy Loading Components

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component')
      .then(m => m.DashboardComponent)
  }
];
```

### 6. Code Splitting

```typescript
// Lazy load feature module
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module')
    .then(m => m.AdminModule)
}
```

## Standalone Components (Angular 14+)

No NgModule required.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form>
      <input [(ngModel)]="name" name="name" />
      <button>Submit</button>
    </form>
  `
})
export class FormComponent {
  name = '';
}
```

**Benefits**:
- No NgModule needed
- Clear dependencies
- Better tree-shaking
- Easier testing
- Modern approach

## Component Composition Patterns

### 1. Parent-Child

```typescript
@Component({
  template: `
    <app-header></app-header>
    <app-content></app-content>
    <app-footer></app-footer>
  `
})
export class LayoutComponent {}
```

### 2. Content Projection

```typescript
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {}

// Usage
<app-card>
  <h2>Title</h2>
  <p>Content</p>
</app-card>
```

### 3. Named Slots

```typescript
@Component({
  selector: 'app-layout',
  template: `
    <div>
      <ng-content select="[header]"></ng-content>
      <ng-content select="[body]"></ng-content>
      <ng-content select="[footer]"></ng-content>
    </div>
  `
})
export class LayoutComponent {}

// Usage
<app-layout>
  <div header>Header</div>
  <div body>Body</div>
  <div footer>Footer</div>
</app-layout>
```

### 4. Higher-Order Component Pattern

```typescript
function withLoading<T>(component: Type<T>) {
  @Component({
    selector: 'app-with-loading',
    template: `
      <div *ngIf="loading">Loading...</div>
      <ng-container *ngIf="!loading">
        <ng-content></ng-content>
      </ng-container>
    `
  })
  class WithLoadingComponent {
    loading = false;
  }
  return WithLoadingComponent;
}
```

## Testing Considerations

### Presentational Component Test

```typescript
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent]
    }).compileComponents();
  });

  it('should display users', () => {
    component.users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Alice');
  });

  it('should emit userDeleted on button click', () => {
    spyOn(component.userDeleted, 'emit');
    component.users = [{ id: 1, name: 'Alice' }];
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(component.userDeleted.emit).toHaveBeenCalled();
  });
});
```

## Common Anti-Patterns to Avoid

❌ Modifying parent data from child
```typescript
// Bad
this.parentData.name = 'Changed'; // Direct mutation
```

✅ Emit event instead
```typescript
// Good
this.nameChanged.emit('New Name');
```

❌ Heavy computation in template
```typescript
// Bad
{{ expensiveFunction() }}
```

✅ Compute in component
```typescript
// Good
{{ computedValue }}
```

❌ Unsubscribe memory leaks
```typescript
// Bad
this.service.data$.subscribe(data => {}); // Never unsubscribed
```

✅ Proper cleanup
```typescript
// Good
this.service.data$
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {});
```

## Best Practices Summary

✅ Use OnPush change detection  
✅ Use presentational components for UI  
✅ Keep smart components for logic  
✅ Always unsubscribe  
✅ Use immutable data patterns  
✅ Track by function in *ngFor  
✅ Lazy load large features  
✅ Use standalone components where appropriate  
✅ Test presentational components thoroughly  
✅ Avoid direct parent manipulation

## Key Takeaways

- OnPush strategy improves performance
- Smart/presentational pattern enhances testability
- Immutable data ensures predictable updates
- Proper cleanup prevents memory leaks
- Standalone components simplify architecture
- Component composition enables reusability
- Testing is easier with separated concerns
