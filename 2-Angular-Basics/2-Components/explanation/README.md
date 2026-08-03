# Angular Components - Deep Dive

## What is a Component?
A component is a reusable piece of UI with its own logic, template, and styling. Components are the building blocks of Angular applications.

## Component Anatomy

```typescript
@Component({
  selector: 'app-user-card',        // CSS selector for component
  template: `<h1>{{ title }}</h1>`, // or templateUrl: './user-card.html'
  styles: [`h1 { color: blue; }`],  // or styleUrls: ['./user-card.css']
  changeDetection: ChangeDetectionStrategy.OnPush, // optimization
  encapsulation: ViewEncapsulation.Emulated // style encapsulation
})
export class UserCardComponent {
  title = 'User Card';
}
```

## Component Lifecycle

### Lifecycle Hooks (in order)

1. **ngOnChanges** - Called before ngOnInit and when input properties change
   ```typescript
   ngOnChanges(changes: SimpleChanges) {
     if (changes['userId']) {
       console.log('User ID changed to', changes['userId'].currentValue);
     }
   }
   ```

2. **ngOnInit** - Called once after component is initialized
   ```typescript
   ngOnInit() {
     this.loadData();
   }
   ```

3. **ngDoCheck** - Called during every change detection cycle
   ```typescript
   ngDoCheck() {
     // Custom change detection logic
   }
   ```

4. **ngAfterContentInit** - Called after content (ng-content) is initialized
   ```typescript
   ngAfterContentInit() {
     console.log(this.contentChild);
   }
   ```

5. **ngAfterContentChecked** - Called after content check
   ```typescript
   ngAfterContentChecked() { }
   ```

6. **ngAfterViewInit** - Called after view and child views are initialized
   ```typescript
   ngAfterViewInit() {
     console.log(this.viewChild);
   }
   ```

7. **ngAfterViewChecked** - Called after view and child views are checked
   ```typescript
   ngAfterViewChecked() { }
   ```

8. **ngOnDestroy** - Called before component is destroyed
   ```typescript
   ngOnDestroy() {
     this.unsubscribe();
   }
   ```

## Input and Output Properties

### @Input - Parent to Child Communication

```typescript
// Child Component
@Component({
  selector: 'app-user',
  template: '<p>{{ user.name }}</p>'
})
export class UserComponent {
  @Input() user: User;
  @Input() isPremium: boolean = false;
  @Input('customName') name: string; // Alias
}

// Parent Component
@Component({
  template: `
    <app-user 
      [user]="currentUser"
      [isPremium]="true"
      [customName]="'John'"
    ></app-user>
  `
})
export class ParentComponent {
  currentUser: User = { id: 1, name: 'Alice' };
}

// Detecting Input Changes
ngOnChanges(changes: SimpleChanges) {
  if (changes['user'] && !changes['user'].firstChange) {
    console.log('User changed from', changes['user'].previousValue);
    console.log('User changed to', changes['user'].currentValue);
  }
}
```

### @Output - Child to Parent Communication

```typescript
// Child Component
@Component({
  selector: 'app-button',
  template: '<button (click)="onClick()">Click</button>'
})
export class ButtonComponent {
  @Output() clicked = new EventEmitter<string>();
  @Output('customClick') customClicked = new EventEmitter(); // Alias

  onClick() {
    this.clicked.emit('Button was clicked!');
  }
}

// Parent Component
@Component({
  template: `
    <app-button 
      (clicked)="onButtonClick($event)"
      (customClick)="onCustomClick($event)"
    ></app-button>
  `
})
export class ParentComponent {
  onButtonClick(message: string) {
    console.log(message);
  }

  onCustomClick(event: any) {
    console.log('Custom event', event);
  }
}
```

## View Encapsulation

Controls how styles apply to a component:

```typescript
// 1. Emulated (Default) - styles don't leak out, but can be overridden
@Component({
  selector: 'app-card',
  template: `<div class="card">Content</div>`,
  styles: ['.card { border: 1px solid blue; }'],
  encapsulation: ViewEncapsulation.Emulated
})

// 2. None - styles apply globally
@Component({
  encapsulation: ViewEncapsulation.None
})

// 3. ShadowDom - true CSS isolation (browser support required)
@Component({
  encapsulation: ViewEncapsulation.ShadowDom
})
```

## ViewChild and ViewChildren

Access child components/elements:

```typescript
@Component({
  template: `
    <input #searchInput />
    <app-user-card #userCard [user]="user"></app-user-card>
  `
})
export class ParentComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild(UserCardComponent) userCard: UserCardComponent;
  @ViewChildren(UserCardComponent) userCards: QueryList<UserCardComponent>;

  ngAfterViewInit() {
    // Access DOM element
    this.searchInput.nativeElement.focus();
    
    // Access component properties/methods
    console.log(this.userCard.user);
    this.userCard.refresh();
    
    // Listen to QueryList changes
    this.userCards.changes.subscribe(() => {
      console.log('User cards changed');
    });
  }
}
```

## ContentChild and ContentChildren

Access content projected into component:

```typescript
// Child Component (receives content via ng-content)
@Component({
  selector: 'app-card',
  template: `
    <div class="header">
      <ng-content select="[cardHeader]"></ng-content>
    </div>
    <div class="body">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent implements AfterContentInit {
  @ContentChild('titleTemplate') titleTemplate: TemplateRef<any>;
  @ContentChildren(UserComponent) users: QueryList<UserComponent>;

  ngAfterContentInit() {
    console.log(this.users.length);
  }
}

// Parent Component
@Component({
  template: `
    <app-card>
      <div cardHeader>My Title</div>
      <app-user [user]="user1"></app-user>
      <app-user [user]="user2"></app-user>
    </app-card>
  `
})
export class ParentComponent {}
```

## Change Detection Strategies

### Default (CheckAlways)
Runs change detection every time:
```typescript
@Component({
  selector: 'app-default',
  changeDetection: ChangeDetectionStrategy.Default
})
```

### OnPush
Only checks when inputs change or events occur:
```typescript
@Component({
  selector: 'app-optimized',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  @Input() data: any;

  constructor(private cdr: ChangeDetectorRef) {}

  onButtonClick() {
    // Must manually trigger change detection
    this.cdr.markForCheck();
  }
}
```

## Standalone Components

Angular 14+ allows components without NgModules:

```typescript
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // Required dependencies
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

## Smart vs Presentational Components

### Presentational Component
- Receives all data via @Input
- Communicates via @Output events
- No dependencies injection
- Highly reusable

```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    <div>
      <h2>{{ user.name }}</h2>
      <button (click)="onDelete()">Delete</button>
    </div>
  `
})
export class UserProfileComponent {
  @Input() user: User;
  @Output() deleted = new EventEmitter<number>();

  onDelete() {
    this.deleted.emit(this.user.id);
  }
}
```

### Smart Component (Container)
- Handles business logic
- Manages state and services
- Passes data to presentational children
- Specific to feature

```typescript
@Component({
  selector: 'app-user-container',
  template: `
    <app-user-profile 
      [user]="user$ | async"
      (deleted)="onDelete($event)"
    ></app-user-profile>
  `
})
export class UserContainerComponent implements OnInit {
  user$: Observable<User>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user$ = this.userService.getUser(123);
  }

  onDelete(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => {
      // Handle deletion
    });
  }
}
```

## Best Practices

1. **Single Responsibility** - Each component should do one thing
2. **Use OnPush for performance** - Reduce unnecessary change detection
3. **Unsubscribe on destroy** - Prevent memory leaks
4. **Use trackBy with *ngFor** - Improve performance with large lists
5. **Keep templates simple** - Move logic to component class
6. **Use presentational components** - Improve reusability
7. **Input validation** - Validate all inputs
8. **Avoid console.log in production** - Use logging service

## Key Takeaways

- Components are the fundamental building blocks of Angular apps
- Lifecycle hooks allow you to react to component state changes
- Input/Output enable parent-child communication
- Change detection strategies optimize performance
- Presentational vs smart components improves code organization
- ViewChild/ContentChild provide access to child elements
