# Component Basics & Anatomy

## What is a Component?

A component is a reusable piece of UI with its own logic, template, and styling. Components are the fundamental building blocks of Angular applications.

### Component Characteristics

- **Encapsulated** - Each component has its own template, styles, and logic
- **Reusable** - Can be used multiple times throughout the application
- **Composable** - Can contain other components
- **Decoupled** - Components interact through inputs/outputs

## Component Anatomy

### Basic Component Structure

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',           // CSS selector
  template: `<h1>{{ title }}</h1>`,    // or templateUrl
  styles: [`h1 { color: blue; }`],     // or styleUrls
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class UserCardComponent {
  title = 'User Card';
}
```

## Component Decorator

The `@Component` decorator provides metadata about the component.

### Essential Properties

#### selector
Defines how to use the component in templates:

```typescript
@Component({
  selector: 'app-user-card',      // Element selector
  // or
  selector: '[appUserCard]',       // Attribute selector
  // or
  selector: '.app-user-card',      // Class selector
})
```

Usage:
```html
<!-- Element -->
<app-user-card></app-user-card>

<!-- Attribute -->
<div appUserCard></div>

<!-- Class -->
<div class="app-user-card"></div>
```

#### template vs templateUrl

Inline template:
```typescript
@Component({
  template: `<h1>{{ title }}</h1>`
})
```

External template file:
```typescript
@Component({
  templateUrl: './user-card.component.html'
})
```

#### styles vs styleUrls

Inline styles:
```typescript
@Component({
  styles: [`
    h1 { color: blue; }
    p { font-size: 14px; }
  `]
})
```

External stylesheet:
```typescript
@Component({
  styleUrls: ['./user-card.component.css']
})
```

## View Encapsulation

Controls how component styles are scoped.

### ViewEncapsulation.Emulated (Default)

Styles don't leak out, but can be overridden from parent:

```typescript
@Component({
  selector: 'app-card',
  template: `<div class="card">Content</div>`,
  styles: ['.card { border: 1px solid blue; }'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CardComponent {}
```

### ViewEncapsulation.None

Styles apply globally (no isolation):

```typescript
@Component({
  encapsulation: ViewEncapsulation.None,
  styles: ['.card { border: 1px solid blue; }'] // Affects all .card elements
})
```

### ViewEncapsulation.ShadowDom

True CSS isolation using Shadow DOM (browser-dependent):

```typescript
@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  styles: ['.card { border: 1px solid blue; }'] // Only affects this component
})
```

## Component Class

The class contains the component's logic and properties.

### Basic Properties and Methods

```typescript
@Component({
  selector: 'app-counter',
  template: `
    <p>Count: {{ count }}</p>
    <button (click)="increment()">+</button>
    <button (click)="decrement()">-</button>
  `
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  getValue(): number {
    return this.count;
  }
}
```

### Typed Properties

Always use types for better type safety:

```typescript
export class UserComponent {
  name: string = '';
  age: number = 0;
  isActive: boolean = true;
  tags: string[] = [];
  user: { id: number; name: string } = { id: 1, name: 'John' };
}
```

## Component Configuration

### Complete Component Example

```typescript
import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false // or true for standalone components
})
export class UserProfileComponent {
  // Component logic here
}
```

## Standalone Components (Angular 14+)

Components without NgModules:

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

### Benefits of Standalone Components

- ✅ No NgModule required
- ✅ Simpler for small components
- ✅ Better tree-shaking
- ✅ Easier to test
- ✅ Clearer dependencies

## Component Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Component class | PascalCase | `UserCardComponent` |
| Selector | kebab-case | `app-user-card` |
| File name | kebab-case | `user-card.component.ts` |
| Property | camelCase | `userName` |
| Method | camelCase | `getUserData()` |
| Template file | Same as class | `user-card.component.html` |
| Style file | Same as class | `user-card.component.css` |

## Creating a Component

### Using Angular CLI

```bash
# Basic component
ng generate component user-card

# Standalone component
ng generate component user-card --standalone

# With specific style
ng generate component user-card --style=scss

# Skip spec file
ng generate component user-card --skip-spec

# With custom selector
ng generate component user-card --selector=custom-user
```

### Generated Files

```
user-card/
├── user-card.component.ts       # Component class
├── user-card.component.html     # Template
├── user-card.component.css      # Styles
└── user-card.component.spec.ts  # Tests
```

## Best Practices

✅ Keep components focused and single-purpose  
✅ Use TypeScript types for all properties  
✅ Name components descriptively  
✅ Use external templates/styles for complex components  
✅ Prefer standalone components for simpler use cases  
✅ Use appropriate encapsulation strategy  
✅ Follow Angular naming conventions  
✅ Use CLI generators for consistency

## Key Takeaways

- Components are the core building blocks of Angular apps
- `@Component` decorator provides configuration
- Encapsulation controls style scoping
- Standalone components simplify setup
- CLI generators ensure consistency
- Templates and styles can be inline or external
