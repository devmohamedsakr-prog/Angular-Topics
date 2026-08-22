# Advanced Component Patterns

**IDE Prompt:** Use this when building advanced component patterns and best practices.

---

## 🎯 Task: Implement Advanced Component Patterns

**When to use:** Building smart containers, presentational components, and reusable patterns.

---

## 📋 Checklist

- [ ] Understand smart vs dumb components
- [ ] Build container (smart) component
- [ ] Build presentational (dumb) component
- [ ] Implement component composition
- [ ] Use ViewChild and ContentChild

---

## 🚀 Step-by-Step Instructions

### Step 1: Smart vs Dumb Components Pattern

**Dumb (Presentational) Component** - Just displays data:

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <button (click)="onAction()">{{ actionLabel }}</button>
    </div>
  `,
  styles: [`
    .card {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
  `]
})
export class CardComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() actionLabel: string = 'Action';
  @Output() action = new EventEmitter<void>();

  onAction() {
    this.action.emit();
  }
}
```

**Smart (Container) Component** - Handles logic:

```typescript
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-card-container',
  template: `
    <app-card
      [title]="cardData?.title"
      [content]="cardData?.content"
      [actionLabel]="'Learn More'"
      (action)="handleAction()">
    </app-card>
  `
})
export class CardContainerComponent implements OnInit {
  cardData: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getCard().subscribe(data => {
      this.cardData = data;
    });
  }

  handleAction() {
    console.log('Action triggered');
  }
}
```

### Step 2: ViewChild - Access Child Component

```typescript
import { Component, ViewChild } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-parent',
  template: `
    <app-counter #myCounter></app-counter>
    <button (click)="resetCounter()">Reset</button>
  `
})
export class ParentComponent {
  @ViewChild('myCounter') counter!: CounterComponent;

  resetCounter() {
    this.counter.reset();  // Call child method
  }
}
```

### Step 3: ContentChild - Access Projected Content

```typescript
import { Component, ContentChild } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="header">
        <ng-content select="[cardHeader]"></ng-content>
      </div>
      <div class="body">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @ContentChild('headerElement') header!: any;

  ngAfterContentInit() {
    console.log('Header element:', this.header);
  }
}
```

**Usage:**

```html
<app-card>
  <div cardHeader>My Header</div>
  <p>Card body content</p>
</app-card>
```

### Step 4: Component Composition

```typescript
// Service component
@Component({
  selector: 'app-user-info',
  template: `
    <div class="user">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  `
})
export class UserInfoComponent {
  @Input() user: any;
}

// List component using composition
@Component({
  selector: 'app-user-list',
  template: `
    <div class="list">
      <app-user-info
        *ngFor="let user of users"
        [user]="user">
      </app-user-info>
    </div>
  `
})
export class UserListComponent {
  @Input() users: any[] = [];
}

// Container component
@Component({
  selector: 'app-users-page',
  template: `<app-user-list [users]="users"></app-user-list>`
})
export class UsersPageComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }
}
```

### Step 5: Reusable Form Component

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label>Email:</label>
        <input formControlName="email" type="email" required>
      </div>
      <div>
        <label>Password:</label>
        <input formControlName="password" type="password" required>
      </div>
      <button type="submit" [disabled]="!form.valid">Login</button>
    </form>
  `
})
export class LoginFormComponent {
  @Output() formSubmit = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }
  }
}
```

### Step 6: Query Child Components

```typescript
import { Component, ViewChildren, QueryList } from '@angular/core';
import { ItemComponent } from './item/item.component';

@Component({
  selector: 'app-list',
  template: `
    <div *ngFor="let item of items">
      <app-item #itemRef [item]="item"></app-item>
    </div>
  `
})
export class ListComponent {
  @ViewChildren('itemRef') items!: QueryList<ItemComponent>;

  ngAfterViewInit() {
    // Access all child components
    this.items.forEach(item => {
      console.log('Item:', item);
    });

    // Listen to changes in children
    this.items.changes.subscribe(() => {
      console.log('Items changed');
    });
  }
}
```

### Step 7: Component Inheritance

```typescript
// Base component
@Component({
  selector: 'app-base-component',
  template: ''
})
export class BaseComponent {
  title: string = '';

  logTitle() {
    console.log(this.title);
  }
}

// Child component inherits
@Component({
  selector: 'app-card',
  template: `<h2>{{ title }}</h2>`
})
export class CardComponent extends BaseComponent {
  constructor() {
    super();
    this.title = 'Card Component';
  }
}
```

---

## 💡 Best Practices

✅ **Component Organization:**
- One component per file
- Keep components small
- Separate concerns (logic vs presentation)

✅ **Reusability:**
- Make components generic
- Accept data via @Input
- Emit events via @Output
- Document expected inputs/outputs

✅ **Performance:**
- Use OnPush change detection
- Unsubscribe from observables
- Lazy load components
- Use trackBy in *ngFor

---

## ✅ Verification Checklist

- [ ] Smart/dumb pattern understood
- [ ] ViewChild accesses child component
- [ ] ContentChild accesses projected content
- [ ] Component composition works
- [ ] Form component emits data
- [ ] No memory leaks
- [ ] All patterns tested

---

## 🔗 Next Steps

You've completed Components fundamentals! Next explore:
- Templates & Binding (3-Templates-and-Binding/prompts/)
- Directives (4-Directives/prompts/)

---

**Estimated Time:** 25-30 minutes  
**Difficulty:** Intermediate-Advanced  
**Prerequisites:** Prompts #1-3  
**Result:** Advanced component patterns mastered
