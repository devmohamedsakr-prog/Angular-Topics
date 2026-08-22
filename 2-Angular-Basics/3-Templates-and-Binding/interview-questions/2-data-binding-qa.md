# Templates & Binding Interview Questions - Part 2: Data Binding

## Property & Attribute Binding

### Q1: What's property binding and when do you use it?

**A:** Property binding sets a DOM element's property value using `[propertyName]="expression"` syntax.

```typescript
export class MyComponent {
  imageUrl = 'photo.jpg';
  isDisabled = false;
}
```

```html
<img [src]="imageUrl" />
<button [disabled]="isDisabled">Submit</button>
<input [value]="username" />
```

Use property binding to:
- Set image sources, form values
- Control element state (disabled, hidden)
- Pass data to child components via @Input
- Set innerHTML or textContent

---

### Q2: What's the difference between property binding and attribute binding?

**A:**
- **Property binding** `[prop]` - Sets DOM properties (work with JavaScript)
- **Attribute binding** `[attr.name]` - Sets HTML attributes

```html
<!-- Property binding - sets DOM property -->
<input [value]="username" />

<!-- Attribute binding - sets HTML attribute -->
<button [attr.aria-label]="buttonLabel">OK</button>
<table>
  <tr>
    <th [attr.colspan]="3">Header</th>
  </tr>
</table>
```

**When to use:**
- Most properties exist on DOM elements → use property binding
- Custom HTML attributes → use attribute binding
- ARIA attributes → use attribute binding (no DOM property)
- SVG attributes → use attribute binding

---

### Q3: What are class bindings? How do you use them?

**A:** Class binding dynamically adds or removes CSS classes using `[class.className]` or `[ngClass]`.

**Single class:**
```html
<div [class.active]="isActive">Content</div>
```

**Multiple classes - object syntax:**
```html
<div [ngClass]="{ 'active': isActive, 'error': hasError, 'loading': isLoading }">
  Content
</div>
```

**Multiple classes - array syntax:**
```html
<div [ngClass]="['container', 'card', isActive ? 'active' : 'inactive']">
  Content
</div>
```

**Computed classes:**
```typescript
export class MyComponent {
  get cssClasses() {
    return {
      'btn': true,
      'btn-primary': this.isPrimary,
      'btn-large': this.isLarge
    };
  }
}
```

```html
<button [ngClass]="cssClasses">Button</button>
```

---

### Q4: What are style bindings? Give examples.

**A:** Style binding sets inline CSS styles using `[style.propertyName]` or `[ngStyle]`.

**Single style:**
```html
<div [style.color]="textColor">Red text</div>
<div [style.width.px]="200">200px wide</div>
<div [style.padding.em]="2">2em padding</div>
```

**Multiple styles - object:**
```html
<div [ngStyle]="{ 'color': textColor, 'font-size': fontSize, 'background-color': bgColor }">
  Styled content
</div>
```

**Computed styles:**
```typescript
export class MyComponent {
  get styleObject() {
    return {
      'color': this.theme === 'dark' ? '#fff' : '#000',
      'background-color': this.theme === 'dark' ? '#333' : '#fff',
      'padding': this.spacing + 'px'
    };
  }
}
```

```html
<div [ngStyle]="styleObject">Content</div>
```

---

### Q5: Can you bind to innerHTML? Is it safe?

**A:** You can bind to `[innerHTML]`, but it's **NOT SAFE** for user-provided content (XSS vulnerability).

```typescript
export class MyComponent {
  userContent = '<img src=x onerror="alert(1)">';  // DANGEROUS!
  trustedHtml = '<strong>Bold text</strong>';
}
```

```html
<!-- ❌ NOT SAFE - can execute scripts -->
<div [innerHTML]="userContent"></div>

<!-- ⚠️ ONLY for trusted content -->
<div [innerHTML]="trustedHtml"></div>
```

**Safe approach:**
```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export class MyComponent {
  constructor(private sanitizer: DomSanitizer) {}

  getContent(): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, userInput);
  }
}
```

**Best practice:** Avoid `[innerHTML]` with user input. Use `{{ }}` interpolation instead (auto-escaped).

---

### Q6: How do you bind to boolean properties?

**A:** Boolean properties like `disabled`, `hidden`, `checked` are bound like regular properties.

```typescript
export class MyComponent {
  isDisabled = true;
  isChecked = false;
  isHidden = true;
}
```

```html
<!-- Boolean properties -->
<button [disabled]="isDisabled">Submit</button>
<input type="checkbox" [checked]="isChecked" />
<div [hidden]="isHidden">Hidden content</div>

<!-- Prefer *ngIf over [hidden] for better performance -->
<div *ngIf="!isHidden">Content</div>
```

---

### Q7: What's the performance impact of binding to getters?

**A:** Getters are called **every change detection cycle**, which can be slow.

```typescript
export class MyComponent {
  items = [1, 2, 3, 4, 5];

  // ❌ BAD - called constantly during change detection
  get computedValue() {
    console.log('Computing...');
    return this.items.reduce((sum, i) => sum + i, 0);
  }

  // ✅ GOOD - computed once and cached
  cachedValue = this.items.reduce((sum, i) => sum + i, 0);
}
```

```html
<!-- ❌ SLOW -->
<p>{{ computedValue }}</p>

<!-- ✅ FAST -->
<p>{{ cachedValue }}</p>
```

**Solution:** Pre-compute values or use `@memo` decorator/RxJS observables.

---

### Q8: Can you bind to complex objects?

**A:** Yes, but be careful with performance and change detection.

```typescript
export class MyComponent {
  user = {
    name: 'John',
    address: {
      street: '123 Main St',
      city: 'New York'
    }
  };
}
```

```html
<p>Name: {{ user.name }}</p>
<p>City: {{ user.address.city }}</p>
<div [ngClass]="{ 'vip': user.isPremium }"></div>
```

**Performance tips:**
- Use safe navigation for nested properties: `{{ user?.address?.city }}`
- Avoid calling methods on complex objects
- Use OnPush change detection for complex objects
- Consider using observables with async pipe

---

### Q9: What's two-way binding and when is it used?

**A:** Two-way binding synchronizes data between component and template using `[(ngModel)]`.

```typescript
import { FormsModule } from '@angular/forms';

export class MyComponent {
  username = '';
}
```

```html
<!-- Two-way binding -->
<input [(ngModel)]="username" />
<p>You entered: {{ username }}</p>
```

Equivalent to:
```html
<input [ngModel]="username" (ngModelChange)="username = $event" />
```

**When to use:**
- Forms with template-driven approach
- Quick prototypes
- Simple form binding

**When NOT to use:**
- Complex forms (use ReactiveFormsModule instead)
- With validation requirements
- Large forms with many fields

---

### Q10: How do you create custom two-way binding?

**A:** Use `@Input` and `@Output` with specific naming pattern: `propertyName` and `propertyNameChange`.

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

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
    this.count++;
    this.countChange.emit(this.count);
  }

  decrease() {
    this.count--;
    this.countChange.emit(this.count);
  }
}
```

**Using custom two-way binding:**
```html
<!-- Explicit syntax -->
<app-counter [count]="myCount" (countChange)="myCount = $event"></app-counter>

<!-- Two-way binding shorthand -->
<app-counter [(count)]="myCount"></app-counter>
```

---

## Key Takeaways

✅ Property binding `[prop]` sets DOM properties
✅ Attribute binding `[attr.name]` sets HTML attributes
✅ Class binding dynamically manages CSS classes
✅ Style binding sets inline CSS
✅ Avoid `[innerHTML]` with user content (XSS risk)
✅ Pre-compute values for performance
✅ Safe navigation `?.` protects against null
✅ Two-way binding with `[(ngModel)]` synchronizes data
✅ Custom two-way binding needs matching Input/Output names
✅ Use getters carefully (called every cycle)
