# Angular Templates and Data Binding

## Template Syntax Overview

Angular templates are HTML with Angular-specific syntax. They combine regular HTML with Angular directives, binding syntax, and template expressions.

## Interpolation

Interpolation allows you to embed component property values into HTML:

```typescript
// Component
export class MyComponent {
  title = 'Hello World';
  count = 42;
  user = { name: 'John', age: 30 };
}

// Template
<h1>{{ title }}</h1>
<p>Count: {{ count }}</p>
<p>User: {{ user.name }}</p>

// Expressions (computed values)
<p>Double: {{ count * 2 }}</p>
<p>Greeting: {{ 'Hello ' + user.name }}</p>
<p>Formatted: {{ count > 0 ? 'Positive' : 'Non-positive' }}</p>
```

### Interpolation vs Property Binding

```typescript
// Interpolation - for displaying text
<p>{{ message }}</p>

// Property binding - for setting element properties
<img [src]="imageUrl" />
<button [disabled]="isDisabled">Click me</button>

// Attribute binding - when property doesn't exist
<button [attr.aria-label]="buttonLabel">Accessible Button</button>

// Class binding
<div [class.active]="isActive"></div>
<div [class]="cssClasses"></div>
<div [ngClass]="{ active: isActive, selected: isSelected }"></div>

// Style binding
<div [style.color]="textColor"></div>
<div [style.width.px]="boxWidth"></div>
<div [ngStyle]="{ color: textColor, fontSize: fontSize + 'px' }"></div>
```

## Event Binding

Respond to user actions:

```typescript
// Component
export class ButtonComponent {
  clickCount = 0;

  onClick() {
    this.clickCount++;
  }

  onKeyup(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log('Input value:', input.value);
  }

  onSubmit(form: any) {
    console.log('Form data:', form);
  }
}

// Template
<button (click)="onClick()">Click me</button>
<p>Clicked {{ clickCount }} times</p>

<input (keyup)="onKeyup($event)" />

<form (ngSubmit)="onSubmit(myForm)">
  <input type="text" />
  <button type="submit">Submit</button>
</form>

// Accessing event object
<input (keyup.enter)="onEnter($event)" />
<div (click)="onClick($event)">Click</div>

// Event modifiers
<input (keyup.enter)="onEnter()" />
<input (keydown.ctrl.s)="save()" />
<div (click.stop)="onClick()">Stop propagation</div>
</form>
```

## Two-Way Binding

Synchronize component property with form input:

```typescript
// Component
import { FormsModule } from '@angular/forms';

export class FormComponent {
  username = '';
  email = '';

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Email:', this.email);
  }
}

// Template (requires FormsModule)
<input [(ngModel)]="username" placeholder="Username" />
<p>You entered: {{ username }}</p>

<input [(ngModel)]="email" placeholder="Email" />

<button (click)="onSubmit()">Submit</button>

// Two-way binding is equivalent to:
<input [ngModel]="username" (ngModelChange)="username = $event" />

// Creating custom two-way binding
@Component({
  selector: 'app-counter',
  template: `
    <button (click)="decrease()">-</button>
    <span>{{ count }}</span>
    <button (click)="increase()">+</button>
  `
})
export class CounterComponent {
  @Input() count: number = 0;
  @Output() countChange = new EventEmitter<number>();

  increase() {
    this.countChange.emit(this.count + 1);
  }

  decrease() {
    this.countChange.emit(this.count - 1);
  }
}

// Usage with two-way binding
<app-counter [(count)]="myCount"></app-counter>
```

## Built-in Directives

### Structural Directives

```typescript
// *ngIf - conditional rendering
<div *ngIf="isVisible">Visible content</div>
<div *ngIf="isVisible; else hideBlock">Show this</div>
<ng-template #hideBlock>Hidden content</ng-template>

<div *ngIf="user; then userBlock; else guestBlock"></div>
<ng-template #userBlock>Welcome {{ user.name }}</ng-template>
<ng-template #guestBlock>Please login</ng-template>

// *ngFor - list rendering
<ul>
  <li *ngFor="let item of items">{{ item }}</li>
</ul>

<ul>
  <li *ngFor="let item of items; let i = index">
    {{ i }}: {{ item }}
  </li>
</ul>

<ul>
  <li *ngFor="let item of items; trackBy: trackByFn">
    {{ item.id }}: {{ item.name }}
  </li>
</ul>

// trackBy implementation
trackByFn(index: number, item: any): any {
  return item.id;
}

// *ngSwitch - multi-way branching
<div [ngSwitch]="currentStatus">
  <div *ngSwitchCase="'active'">Active status</div>
  <div *ngSwitchCase="'inactive'">Inactive status</div>
  <div *ngSwitchDefault>Unknown status</div>
</div>
```

### Attribute Directives

```typescript
// ngClass - dynamic CSS classes
<div [ngClass]="'active'"></div>
<div [ngClass]="['active', 'disabled']"></div>
<div [ngClass]="{ active: isActive, disabled: isDisabled }"></div>

// ngStyle - dynamic inline styles
<div [ngStyle]="{ color: 'red', 'font-size': '20px' }"></div>
<div [ngStyle]="styles"></div>

// ngModel - two-way binding
<input [(ngModel)]="text" />

// ngModelGroup - form grouping
<form (ngSubmit)="onSubmit(myForm)">
  <fieldset ngModelGroup="address">
    <input [(ngModel)]="address.street" name="street" />
    <input [(ngModel)]="address.city" name="city" />
  </fieldset>
</form>

// ngForm - form tracking
<form #myForm="ngForm">
  <input name="username" [(ngModel)]="username" />
  <button [disabled]="myForm.invalid">Submit</button>
</form>
```

## Template Variables

Use template reference variables to access elements or directives:

```typescript
// Element reference
<input #input1 />
<button (click)="input1.focus()">Focus</button>

// Directive reference
<form #myForm="ngForm">
  <input name="email" [(ngModel)]="email" required />
  <button [disabled]="myForm.invalid">Submit</button>
</form>

// Component reference
<app-counter #counter></app-counter>
<button (click)="counter.reset()">Reset</button>
```

## Template Expressions

Expressions in templates can use operators and methods:

```typescript
// Operators
{{ count + 1 }}
{{ name || 'Anonymous' }}
{{ isActive && 'Yes' || 'No' }}
{{ index > 0 ? 'visible' : 'hidden' }}

// Pipe operators
{{ date | date: 'short' }}
{{ price | currency: 'USD' }}
{{ name | uppercase }}
{{ items | slice:0:3 }}
{{ items | filter:'active' }}

// Method calls (avoid in templates)
{{ getValue() }} <!-- Avoid for performance -->
{{ calculate(x, y) }}

// Safe navigation operator
{{ user?.name }}
{{ items?.[0] }}
{{ getUser()?.address?.city }}
```

## Safe Navigation and Non-Null Assertion

```typescript
// Safe navigation operator - safe if null/undefined
<p>{{ user?.name }}</p>

// Non-null assertion - assert value is not null (use sparingly)
<p>{{ user!.name }}</p>

// null coalescing operator
{{ user?.email ?? 'no-email@example.com' }}

// Optional chaining with arrays
<p>{{ items?.[0] }}</p>
```

## Template Syntax Best Practices

1. **Keep expressions simple** - Use component methods for complex logic
2. **Use trackBy with *ngFor** - Improves performance with large lists
3. **Avoid function calls in templates** - They're called every change detection
4. **Use safe navigation** - Protect against null/undefined values
5. **Use template reference variables** - Avoid querying DOM directly
6. **Prefer *ngIf over hidden display** - Better performance
7. **Use async pipe** - Automatically unsubscribes from observables
8. **Template comments** - Use `<!-- comment -->` for documentation

## Common Mistakes to Avoid

```typescript
// ❌ WRONG - Function called every change detection
<p>{{ expensiveCalculation() }}</p>

// ✓ CORRECT - Calculate once in component
<p>{{ cachedValue }}</p>

// ❌ WRONG - Subscribing in template without unsubscribing
<p>{{ observable.subscribe(v => v) }}</p>

// ✓ CORRECT - Use async pipe
<p>{{ observable | async }}</p>

// ❌ WRONG - Mutable operations change reference
<button [disabled]="items.push(item)">Add</button>

// ✓ CORRECT - Create new array
<button (click)="addItem()">Add</button>

// ❌ WRONG - Nested property binding without safe nav
<p>{{ user.address.city }}</p>

// ✓ CORRECT - Use safe navigation
<p>{{ user?.address?.city }}</p>
```

## Key Takeaways

- Templates use Angular-specific syntax with HTML
- Data binding connects component properties to template
- Structural directives (*ngIf, *ngFor) control DOM structure
- Attribute directives modify element behavior
- Two-way binding with [(ngModel)] synchronizes data
- Template expressions should be simple and performant
- Use safe navigation to handle null/undefined values
