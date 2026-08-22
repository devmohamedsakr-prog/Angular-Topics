# Input/Output & Component Communication

## Input Properties (@Input)

Input properties pass data from parent to child components.

### Basic @Input

```typescript
// Child Component
@Component({
  selector: 'app-user-profile',
  template: '<p>{{ user.name }}</p>'
})
export class UserProfileComponent {
  @Input() user: { id: number; name: string };
}

// Parent Component
@Component({
  template: `
    <app-user-profile [user]="currentUser"></app-user-profile>
  `
})
export class ParentComponent {
  currentUser = { id: 1, name: 'Alice' };
}
```

### Input with Default Values

```typescript
@Component({
  selector: 'app-button'
})
export class ButtonComponent {
  @Input() label: string = 'Click me';
  @Input() disabled: boolean = false;
  @Input() type: string = 'primary';
}
```

### Input Aliases

```typescript
@Component({
  selector: 'app-card'
})
export class CardComponent {
  @Input('customTitle') title: string;
}

// Usage
<app-card [customTitle]="'My Title'"></app-card>
```

### Detecting Input Changes with ngOnChanges

```typescript
@Component({
  selector: 'app-config'
})
export class ConfigComponent implements OnChanges {
  @Input() settings: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['settings'] && !changes['settings'].firstChange) {
      console.log('Settings changed!');
      this.applySettings();
    }
  }

  applySettings() {
    // React to changes
  }
}
```

## Output Properties (@Output)

Output properties emit events from child to parent.

### Basic @Output

```typescript
// Child Component
@Component({
  selector: 'app-delete-button',
  template: '<button (click)="onDelete()">Delete</button>'
})
export class DeleteButtonComponent {
  @Output() deleted = new EventEmitter<number>();
  userId = 123;

  onDelete() {
    this.deleted.emit(this.userId);
  }
}

// Parent Component
@Component({
  template: `
    <app-delete-button (deleted)="onUserDeleted($event)"></app-delete-button>
  `
})
export class ParentComponent {
  onUserDeleted(userId: number) {
    console.log('User deleted:', userId);
  }
}
```

### Output with Typed Events

```typescript
@Component({
  selector: 'app-form'
})
export class FormComponent {
  @Output() submitted = new EventEmitter<{ name: string; email: string }>();

  onSubmit() {
    this.submitted.emit({
      name: 'John',
      email: 'john@example.com'
    });
  }
}

// Parent
<app-form (submitted)="handleSubmit($event)"></app-form>
```

### Output Aliases

```typescript
@Component({
  selector: 'app-menu'
})
export class MenuComponent {
  @Output('itemSelected') itemClick = new EventEmitter<string>();

  selectItem(item: string) {
    this.itemClick.emit(item);
  }
}

// Usage
<app-menu (itemSelected)="onItemSelect($event)"></app-menu>
```

## Two-Way Binding

Combines input and output for two-way communication.

### Using [(ngModel)]

```typescript
// Child Component
@Component({
  selector: 'app-text-input'
})
export class TextInputComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(val: string) {
    this.valueChange.emit(val);
  }
}

// Parent - Explicit
<app-text-input [value]="name" (valueChange)="name = $event"></app-text-input>

// Parent - Two-way binding
<app-text-input [(value)]="name"></app-text-input>
```

### Custom Two-Way Binding

```typescript
@Component({
  selector: 'app-toggle'
})
export class ToggleComponent {
  @Input() checked: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  toggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}

// Parent
<app-toggle [(checked)]="isActive"></app-toggle>
```

## Parent-Child Communication Patterns

### Pattern 1: Simple Data Flow

```typescript
// Parent passes data, child displays it
@Component({
  selector: 'app-parent'
})
export class ParentComponent {
  data = { id: 1, name: 'John' };
}

@Component({
  selector: 'app-child'
})
export class ChildComponent {
  @Input() data: any;
}

// Template: <app-child [data]="data"></app-child>
```

### Pattern 2: Event-Based Communication

```typescript
// Child emits events, parent responds
@Component({
  selector: 'app-child'
})
export class ChildComponent {
  @Output() action = new EventEmitter<string>();

  doSomething() {
    this.action.emit('something-happened');
  }
}

@Component({
  selector: 'app-parent'
})
export class ParentComponent {
  onChildAction(action: string) {
    console.log('Child said:', action);
  }
}
```

### Pattern 3: Two-Way Data Binding

```typescript
// Parent updates child, child updates parent
<app-form-control [(ngModel)]="formData.name"></app-form-control>
```

## Input Validation

Validate inputs in ngOnChanges:

```typescript
@Component({
  selector: 'app-rating'
})
export class RatingComponent implements OnInit, OnChanges {
  @Input() rating: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rating']) {
      if (this.rating < 0 || this.rating > 5) {
        console.warn('Rating must be between 0 and 5');
        this.rating = 0;
      }
    }
  }

  ngOnInit() {
    this.validateRating();
  }

  private validateRating() {
    // Validation logic
  }
}
```

## Common Mistakes

### ❌ Modifying Input Properties Directly

```typescript
// Bad - directly modifying input object
@Component({
  selector: 'app-user-list'
})
export class UserListComponent {
  @Input() users: User[] = [];

  removeUser(index: number) {
    this.users.splice(index, 1); // Modifies parent's array!
  }
}
```

### ✅ Emit Event to Parent

```typescript
// Good - emit event for parent to handle
@Component({
  selector: 'app-user-list'
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Output() userRemoved = new EventEmitter<User>();

  removeUser(user: User) {
    this.userRemoved.emit(user); // Parent handles deletion
  }
}
```

## Best Practices

✅ Use @Input for data from parent  
✅ Use @Output for events to parent  
✅ Keep inputs immutable in child  
✅ Emit events instead of modifying parent data  
✅ Use typed inputs and outputs  
✅ Validate inputs in ngOnChanges  
✅ Use descriptive names for inputs/outputs  
✅ Document input and output contracts

## Key Takeaways

- @Input passes data from parent to child
- @Output emits events from child to parent
- Two-way binding combines both patterns
- Always emit events instead of modifying parent data
- Validate all inputs
- Keep components decoupled through clear contracts
