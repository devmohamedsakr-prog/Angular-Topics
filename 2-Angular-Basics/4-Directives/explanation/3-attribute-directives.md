# Attribute Directives: ngClass, ngStyle, ngModel

## Overview

Attribute directives modify the appearance and behavior of DOM elements. Unlike structural directives, they don't add or remove elements—they change how existing elements look or behave.

---

## [ngClass] - Dynamic CSS Classes

The `[ngClass]` directive dynamically adds or removes CSS classes based on expressions.

### Single Class Binding

```html
<!-- Single class based on boolean -->
<div [class.active]="isActive">
  Content
</div>

<!-- Multiple single classes -->
<button [class.active]="isActive" 
        [class.disabled]="isDisabled">
  Click
</button>
```

### Object Syntax (Multiple Classes)

```typescript
export class MyComponent {
  isActive = true;
  isSelected = false;
  isDisabled = true;
}
```

```html
<!-- Object with class:condition pairs -->
<div [ngClass]="{ 'active': isActive, 'selected': isSelected, 'disabled': isDisabled }">
  Content
</div>

<!-- Computed object -->
<div [ngClass]="getClasses()">
  Content
</div>
```

```typescript
getClasses() {
  return {
    'btn': true,
    'btn-primary': this.isPrimary,
    'btn-large': this.isLarge,
    'btn-disabled': this.isDisabled
  };
}
```

### Array Syntax

```html
<!-- Array of class names -->
<div [ngClass]="['container', 'card', 'shadow']">
  Content
</div>

<!-- Conditional classes in array -->
<div [ngClass]="['base', isActive ? 'active' : 'inactive']">
  Content
</div>

<!-- Dynamic array -->
<div [ngClass]="getClassArray()">
  Content
</div>
```

```typescript
getClassArray() {
  const classes = ['btn'];
  if (this.isPrimary) classes.push('btn-primary');
  if (this.isLarge) classes.push('btn-large');
  return classes;
}
```

---

## [ngStyle] - Dynamic Inline Styles

The `[ngStyle]` directive dynamically sets inline CSS styles based on expressions.

### Single Style

```html
<!-- Single style binding -->
<p [style.color]="textColor">Red text</p>
<p [style.font-size]="fontSize">Variable size</p>

<!-- With units -->
<div [style.width.px]="200">200px wide</div>
<div [style.padding.em]="2">2em padding</div>
<div [style.margin.%]="10">10% margin</div>
```

### Object Syntax (Multiple Styles)

```typescript
export class MyComponent {
  textColor = 'blue';
  fontSize = '18px';
  backgroundColor = '#f0f0f0';
}
```

```html
<!-- Object with style properties -->
<div [ngStyle]="{ 'color': textColor, 'font-size': fontSize, 'background-color': backgroundColor }">
  Styled content
</div>

<!-- Computed style object -->
<div [ngStyle]="getStyles()">
  Content
</div>
```

```typescript
getStyles() {
  return {
    'color': this.theme === 'dark' ? '#fff' : '#000',
    'background-color': this.theme === 'dark' ? '#333' : '#fff',
    'font-size': this.size + 'px',
    'padding': '10px',
    'border-radius': '4px'
  };
}
```

### Style Units

```html
<!-- Explicit units -->
<div [style.width.px]="100">100px</div>
<div [style.width.%]="50">50%</div>
<div [style.padding.em]="2">2em</div>
<div [style.line-height]="1.5">Unitless</div>

<!-- No unit for unitless properties -->
<div [style.z-index]="10">Z-index (unitless)</div>
<div [style.opacity]="0.5">Opacity (unitless)</div>
```

---

## [(ngModel)] - Two-Way Binding

The `[(ngModel)]` directive creates two-way binding between form inputs and component properties. *Requires FormsModule.*

### Basic Usage

```typescript
import { FormsModule } from '@angular/forms';

export class FormComponent {
  username = '';
  email = '';
  agree = false;
}
```

```html
<!-- Text input -->
<input [(ngModel)]="username" placeholder="Username" />
<p>You entered: {{ username }}</p>

<!-- Email input -->
<input type="email" [(ngModel)]="email" placeholder="Email" />

<!-- Checkbox -->
<input type="checkbox" [(ngModel)]="agree" />
<label>I agree to terms</label>
```

### How It Works

```html
<!-- This -->
<input [(ngModel)]="value" />

<!-- Is equivalent to -->
<input [ngModel]="value" (ngModelChange)="value = $event" />
```

### Detect Changes

```typescript
export class MyComponent {
  username = '';

  onUsernameChange(newValue: string) {
    console.log('Changed to:', newValue);
    this.validate(newValue);
  }
}
```

```html
<input [(ngModel)]="username" (ngModelChange)="onUsernameChange($event)" />
```

### ngModelGroup - Field Grouping

```html
<form (ngSubmit)="onSubmit()">
  <!-- Personal info group -->
  <fieldset ngModelGroup="personal">
    <input [(ngModel)]="user.name" name="name" placeholder="Name" />
    <input [(ngModel)]="user.email" name="email" placeholder="Email" />
  </fieldset>

  <!-- Address group -->
  <fieldset ngModelGroup="address">
    <input [(ngModel)]="user.street" name="street" placeholder="Street" />
    <input [(ngModel)]="user.city" name="city" placeholder="City" />
  </fieldset>

  <button type="submit">Submit</button>
</form>
```

---

## Combining Directives

```html
<!-- Combine multiple attribute directives -->
<div
  [ngClass]="{ 'card': true, 'active': isActive }"
  [ngStyle]="{ 'background-color': bgColor, 'padding': '20px' }"
  [(ngModel)]="selectedValue">
  Content
</div>

<!-- With structural directives -->
<div *ngIf="isVisible" [ngClass]="'highlight'" [ngStyle]="styles">
  Content
</div>

<!-- In lists -->
<div *ngFor="let item of items; trackBy: trackByFn"
     [ngClass]="{ 'selected': item.id === selectedId }"
     [ngStyle]="{ 'color': item.color }">
  {{ item.name }}
</div>
```

---

## Performance Considerations

### Cache Computed Values

```typescript
// ❌ BAD - function called every change detection
get classObject() {
  return { 'active': this.compute() };
}
```

```html
<div [ngClass]="classObject">Content</div>
```

```typescript
// ✅ GOOD - computed once and cached
cachedClasses = { 'active': true, 'disabled': false };
```

```html
<div [ngClass]="cachedClasses">Content</div>
```

### Use Simple Expressions

```html
<!-- ❌ AVOID - complex logic -->
<div [ngClass]="{ 'cls1': a && b, 'cls2': c || d, 'cls3': !e && f }">
  Content
</div>

<!-- ✅ GOOD - use component method -->
<div [ngClass]="getClasses()">
  Content
</div>
```

---

## Best Practices

✅ **DO:**
- Use `[ngClass]` for dynamic classes
- Use `[ngStyle]` for dynamic styles
- Cache computed objects/values
- Use object syntax for multiple classes/styles
- Use `[(ngModel)]` for forms (with FormsModule)
- Combine with structural directives appropriately
- Keep expressions simple

❌ **DON'T:**
- Call functions in `[ngClass]` or `[ngStyle]`
- Create objects inline
- Use inline styles instead of CSS classes (use [ngClass])
- Forget FormsModule for [(ngModel)]
- Use `[ngClass]` with overly complex conditions
- Mix too many directives on one element

---

## Key Takeaways

- `[ngClass]` dynamically applies CSS classes
- `[ngStyle]` dynamically sets inline styles
- `[(ngModel)]` creates two-way data binding
- Object syntax preferred for multiple classes/styles
- Always cache computed values for performance
- Combine directives strategically
- FormsModule required for ngModel
