# Angular Templates & Data Binding - Comprehensive Guide

## Overview

Templates and data binding are core to Angular development. This guide covers all aspects of creating dynamic views with two-way synchronization between component logic and the template.

## 📚 Learning Structure

This folder contains **5 focused explanation files** covering key template and binding concepts.

### Focus Areas

| # | Topic | File | Key Concepts |
|---|-------|------|--------------|
| 1 | **Template Syntax Basics** | `explanation/1-template-syntax-basics.md` | Interpolation, expressions, safe navigation, template variables |
| 2 | **Data Binding** | `explanation/2-data-binding.md` | Property, attribute, class, and style binding |
| 3 | **Event Binding** | `explanation/3-event-binding.md` | Click, keyboard, mouse, form events, $event, event modifiers |
| 4 | **Two-Way Binding** | `explanation/4-two-way-binding.md` | ngModel, synchronized data, custom two-way binding, forms |
| 5 | **Directives & Structural** | `explanation/5-directives-structural.md` | *ngIf, *ngFor, *ngSwitch, ngClass, ngStyle, custom directives |

## 📂 File Organization

```
3-Templates-and-Binding/
├── explanation/
│   ├── 1-template-syntax-basics.md       # Template fundamentals
│   ├── 2-data-binding.md                 # Property/attribute/class/style binding
│   ├── 3-event-binding.md                # Event handling
│   ├── 4-two-way-binding.md              # ngModel and synchronization
│   └── 5-directives-structural.md        # Directives and DOM manipulation
└── README.md                              # This file
```

## 🎯 Quick Navigation

### By Topic

**Getting Started**
1. Start with [Template Syntax Basics](explanation/1-template-syntax-basics.md)
2. Learn [Data Binding](explanation/2-data-binding.md)

**Building Dynamic Views**
1. Master [Event Binding](explanation/3-event-binding.md)
2. Learn [Two-Way Binding](explanation/4-two-way-binding.md)
3. Study [Directives](explanation/5-directives-structural.md)

### By Concept

| Concept | File |
|---------|------|
| Interpolation {{ }} | 1-template-syntax-basics.md |
| Template Expressions | 1-template-syntax-basics.md |
| Safe Navigation ?. | 1-template-syntax-basics.md |
| Property Binding [prop] | 2-data-binding.md |
| Attribute Binding [attr] | 2-data-binding.md |
| Class Binding [class] | 2-data-binding.md |
| Style Binding [style] | 2-data-binding.md |
| Event Binding (event) | 3-event-binding.md |
| Event Modifiers | 3-event-binding.md |
| Two-Way Binding [(ngModel)] | 4-two-way-binding.md |
| Custom Two-Way Binding | 4-two-way-binding.md |
| *ngIf Conditional | 5-directives-structural.md |
| *ngFor Iteration | 5-directives-structural.md |
| *ngSwitch Multi-way | 5-directives-structural.md |
| [ngClass] Dynamic classes | 5-directives-structural.md |
| [ngStyle] Dynamic styles | 5-directives-structural.md |

## 📖 Learning Paths

### Beginner Path (2-3 hours)
Estimated time: 2-3 hours

1. **Template Basics** → 1-template-syntax-basics.md
   - Interpolation and expressions
   - Safe navigation operator
   - Basic template syntax

2. **Data Binding Basics** → 2-data-binding.md (sections: Property Binding)
   - Property binding syntax
   - Common bindings
   - Performance basics

3. **Event Binding** → 3-event-binding.md (sections: Basic Events)
   - Click handlers
   - Input events
   - $event object

### Intermediate Path (4-5 hours)
Estimated time: 4-5 hours

1. **Complete Data Binding** → 2-data-binding.md (complete)
   - Property binding
   - Attribute binding
   - Class binding
   - Style binding

2. **Advanced Event Binding** → 3-event-binding.md (complete)
   - All event types
   - Event modifiers
   - Passing arguments
   - Event patterns

3. **Two-Way Binding** → 4-two-way-binding.md (sections: ngModel basics)
   - ngModel with different inputs
   - Form binding
   - Change detection

### Advanced Path (3-4 hours)
Estimated time: 3-4 hours

1. **Custom Two-Way Binding** → 4-two-way-binding.md (complete)
   - Creating custom binding
   - ngModelGroup
   - Form groups

2. **Structural Directives** → 5-directives-structural.md (sections: *ngIf, *ngFor)
   - Conditional rendering
   - List rendering with trackBy
   - Performance optimization

3. **Advanced Directives** → 5-directives-structural.md (complete)
   - *ngSwitch
   - ngClass and ngStyle
   - Custom directives
   - ng-template and ng-container

## 🎓 Key Concepts Overview

### Template Syntax

**Interpolation** - Display component data in template
```html
<p>{{ message }}</p>
<p>{{ user.name }}</p>
<p>{{ count * 2 }}</p>
```

**Safe Navigation** - Protect against null/undefined
```html
<p>{{ user?.name }}</p>
<p>{{ user?.address?.city }}</p>
```

### Data Binding Types

**Property Binding** - Set element properties
```html
<img [src]="imagePath" />
<button [disabled]="isDisabled">Click</button>
```

**Event Binding** - Respond to user actions
```html
<button (click)="onClick()">Click</button>
<input (keyup)="onKeyUp($event)" />
```

**Two-Way Binding** - Synchronize data
```html
<input [(ngModel)]="username" />
```

**Attribute Binding** - Set HTML attributes
```html
<button [attr.aria-label]="label">OK</button>
```

**Class Binding** - Toggle CSS classes
```html
<div [class.active]="isActive"></div>
<div [ngClass]="{ active: isActive }"></div>
```

**Style Binding** - Set inline styles
```html
<div [style.color]="textColor"></div>
<div [ngStyle]="{ color: textColor, fontSize: size }"></div>
```

### Structural Directives

**Conditional** - Show/hide based on condition
```html
<div *ngIf="condition">Show this</div>
<div *ngIf="condition; else elseBlock">Show</div>
```

**Iteration** - Repeat for each item
```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item }}
</div>
```

**Switch** - Select one of many options
```html
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">Active</div>
</div>
```

## 📋 Common Tasks

### Display Data
```html
<h1>{{ title }}</h1>
<p>{{ user?.name }}</p>
<p>Total: {{ items.length }}</p>
```

### Handle Events
```html
<button (click)="onClick()">Click</button>
<input (keyup.enter)="onEnter($event)" />
<form (ngSubmit)="onSubmit()">
```

### Two-Way Binding
```html
<input [(ngModel)]="name" />
<textarea [(ngModel)]="message"></textarea>
<input type="checkbox" [(ngModel)]="isActive" />
```

### Dynamic Styling
```html
<div [class.active]="isActive"></div>
<div [style.color]="textColor"></div>
<button [disabled]="!isValid">Submit</button>
```

### Conditional Rendering
```html
<div *ngIf="isLoggedIn">Welcome back</div>
<div *ngIf="!items || items.length === 0">No items</div>
```

### List Rendering
```html
<ul>
  <li *ngFor="let item of items; trackBy: trackByFn">
    {{ item.name }}
  </li>
</ul>
```

## 🏆 Best Practices

### ✅ DO

✅ **Use safe navigation for potentially null values**
```html
<p>{{ user?.name }}</p>  <!-- Good -->
<p>{{ user.name }}</p>   <!-- Bad - may crash -->
```

✅ **Use trackBy with *ngFor**
```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item }}
</div>
```

✅ **Keep template expressions simple**
```html
<p>{{ user.age }}</p>           <!-- Good -->
<p>{{ calculateAge(user) }}</p> <!-- Okay -->
<p>{{ user?.profile?.address?.city }}</p> <!-- Complex -->
```

✅ **Use ngModel for form binding**
```typescript
imports: [FormsModule]
```
```html
<input [(ngModel)]="email" name="email" />
```

✅ **Use ng-container to avoid extra elements**
```html
<ng-container *ngFor="let item of items">
  <span>{{ item }}</span>
</ng-container>
```

### ❌ DON'T

❌ **Don't call functions in templates**
```html
<p>{{ expensiveCalculation() }}</p>  <!-- Bad - called constantly -->
```

❌ **Don't use complex expressions**
```html
<!-- Bad - complex logic -->
<p *ngIf="user && user.permissions && user.permissions.includes('admin')">
  Admin
</p>

<!-- Good - compute in component -->
<p *ngIf="isAdmin">Admin</p>
```

❌ **Don't forget to unsubscribe**
```typescript
// Good - use async pipe
<p>{{ data$ | async }}</p>

// Or unsubscribe manually
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

❌ **Don't use [hidden] instead of *ngIf**
```html
<!-- Bad - element still in DOM -->
<div [hidden]="!show">Content</div>

<!-- Good - element removed from DOM -->
<div *ngIf="show">Content</div>
```

## 📊 Template Syntax Reference

### Interpolation
```html
{{ expression }}
{{ property }}
{{ property?.nestedProperty }}
{{ property || defaultValue }}
{{ property ?? defaultValue }}
```

### Property Binding
```html
[property]="value"
[property]="expression"
[innerHTML]="htmlContent"
[textContent]="text"
```

### Attribute Binding
```html
[attr.name]="value"
[attr.data-*]="value"
[attr.aria-*]="value"
```

### Class Binding
```html
[class]="className"
[class.className]="boolean"
[ngClass]="{ className: boolean }"
[ngClass]="classArray"
```

### Style Binding
```html
[style.property]="value"
[style.property.unit]="value"
[ngStyle]="{ property: value }"
```

### Event Binding
```html
(event)="handler()"
(event)="handler($event)"
(event.modifier)="handler()"
(keyup.enter)="handler()"
```

### Two-Way Binding
```html
[(ngModel)]="property"
[(ngModel)]="property" (ngModelChange)="onChanged($event)"
```

### Structural Directives
```html
*ngIf="condition"
*ngIf="condition; else templateName"
*ngIf="condition; then templateName; else templateName"
*ngFor="let item of items"
*ngFor="let item of items; let i = index; trackBy: trackByFn"
[ngSwitch]="expression"
*ngSwitchCase="caseValue"
*ngSwitchDefault
```

## 🔗 Related Guides

- **Components** - Container for templates
- **Directives** - Extend template with custom behavior
- **Services** - Share data and logic
- **Reactive Forms** - Advanced form handling
- **RxJS** - Observable data streams

## 📈 Progression

```
1. Template Syntax Basics
   ↓ (understand interpolation)
2. Data Binding
   ↓ (connect component to view)
3. Event Binding
   ↓ (respond to user input)
4. Two-Way Binding
   ↓ (synchronize data)
5. Directives & Structural
   ↓ (control DOM structure)
```

## 💡 Key Takeaways

1. **Templates use Angular syntax** - `{{ }}`, `[]`, `()`, `[()]`
2. **Data flows one way by default** - Component → Template
3. **Two-way binding with ngModel** - `[(ngModel)]="property"`
4. **Events are easy** - `(event)="handler()"`
5. **Safe navigation is important** - Use `?.` operator
6. **Directives control DOM** - *ngIf, *ngFor, *ngSwitch
7. **Classes and styles are dynamic** - [ngClass], [ngStyle]
8. **TrackBy improves performance** - Always use with *ngFor
9. **Expressions should be simple** - Move logic to component
10. **Templates are type-checked** - Use strict mode

## 📞 Need Help?

- Review the **explanation files** for detailed concepts
- Check the **Quick Navigation** table for specific topics
- Cross-reference **best practices** section
- Study **common mistakes** in each file

---

**Last Updated**: August 2026
**Pattern**: Following Angular best practices & style guide
**Version**: 1.0 (Refactored from monolithic structure)
