# Template Syntax Basics

## Overview

Angular templates are HTML enhanced with Angular-specific syntax. They combine regular HTML with directives, binding syntax, and template expressions to create dynamic views.

## What is a Template?

A template is the view associated with a component. It defines how Angular renders the component's data and responds to user interactions.

```typescript
@Component({
  selector: 'app-welcome',
  template: `<h1>{{ greeting }}</h1>`,  // Inline template
  // OR
  templateUrl: './welcome.component.html'  // External template
})
export class WelcomeComponent {
  greeting = 'Welcome to Angular!';
}
```

## Interpolation

Interpolation displays component property values as text in HTML using double curly braces `{{ }}`.

### Basic Interpolation

```html
<!-- Simple property -->
<h1>{{ title }}</h1>

<!-- Nested property -->
<p>{{ user.name }}</p>
<p>{{ config.app.version }}</p>

<!-- Array access -->
<p>{{ items[0] }}</p>
```

### Template Expressions

Interpolation can contain expressions that evaluate dynamically:

```html
<!-- Arithmetic -->
<p>Total: {{ 10 + 20 }}</p>
<p>Double: {{ count * 2 }}</p>

<!-- String concatenation -->
<p>{{ 'Hello ' + name }}</p>

<!-- Ternary operator -->
<p>Status: {{ active ? 'Online' : 'Offline' }}</p>

<!-- Logical operators -->
<p>{{ user && user.name }}</p>
<p>{{ items?.length }}</p>

<!-- Method calls -->
<p>{{ getFullName() }}</p>
<p>{{ formatDate(today) }}</p>
```

### Component Class

```typescript
export class MyComponent {
  title = 'My App';
  count = 42;
  active = true;
  name = 'Alice';
  user = { name: 'Bob', age: 30 };
  items = [1, 2, 3, 4, 5];
  today = new Date();

  getFullName() {
    return this.user.name + ' Smith';
  }

  formatDate(date: Date) {
    return date.toLocaleDateString();
  }
}
```

## Template Comments

Document your templates with HTML comments:

```html
<!-- This is a single-line comment -->

<!-- 
  This is a multi-line comment
  explaining complex template logic
-->

<!-- TODO: Add error handling here -->
<!-- FIXME: Performance issue - optimize loop -->
```

## Interpolation vs Binding

Understand the difference between interpolation and property binding:

```html
<!-- Interpolation - for text content -->
<p>{{ message }}</p>

<!-- Property binding - for element properties -->
<img [src]="imageUrl" />
<button [disabled]="isDisabled">Click</button>

<!-- Attribute binding - for HTML attributes -->
<button [attr.aria-label]="label">Accessible</button>

<!-- Both can achieve similar results -->
<p>{{ count }}</p>
<p [textContent]="count"></p>
```

## Safe Navigation Operator

Protect against null/undefined values:

```html
<!-- Safe navigation with dot notation -->
<p>{{ user?.name }}</p>
<p>{{ user?.address?.city }}</p>

<!-- Safe navigation with array access -->
<p>{{ items?.[0] }}</p>

<!-- Optional chaining with methods -->
<p>{{ user?.getFullName?.() }}</p>

<!-- Null coalescing fallback -->
<p>{{ user?.email ?? 'no-email@example.com' }}</p>

<!-- Combining operators -->
<p>{{ user?.profile?.avatar?.url ?? 'default.jpg' }}</p>
```

## Template Expressions Rules

### What's Allowed

✅ Simple property access
✅ Basic operators (+, -, *, /, %)
✅ Comparison operators (==, !=, <, >, <=, >=)
✅ Logical operators (&&, ||, !)
✅ Ternary operator (? :)
✅ Template literals with backticks
✅ Method calls
✅ Array/object creation
✅ Pipe operator (|)

### What's NOT Allowed

❌ Assignments (=, +=, -=, etc.)
❌ Creating instances (new operator)
❌ Chaining expressions with comma
❌ Regular expressions
❌ Increment/decrement (++, --)
❌ Destructuring

## Complex Template Expressions

```typescript
export class DataComponent {
  data = {
    items: [
      { id: 1, name: 'Item 1', active: true },
      { id: 2, name: 'Item 2', active: false },
      { id: 3, name: 'Item 3', active: true }
    ]
  };

  getActiveCount() {
    return this.data.items.filter(i => i.active).length;
  }

  getTotal(prices: number[]) {
    return prices.reduce((sum, price) => sum + price, 0);
  }
}
```

```html
<!-- Complex expressions -->
<p>Active items: {{ data.items.filter(i => i.active).length }}</p>
<p>First item: {{ data.items[0]?.name }}</p>
<p>Active count: {{ getActiveCount() }}</p>

<!-- Computed values -->
<p>{{ getTotal([10, 20, 30]) }}</p>

<!-- Chained operations -->
<p>{{ (items | slice:0:3)[0] }}</p>
```

## Template Whitespace

Angular handles whitespace in templates intelligently:

```html
<!-- Extra whitespace is collapsed in text nodes -->
<p>This    has     extra     spaces</p>  <!-- Result: "This has extra spaces" -->

<!-- Use &nbsp; for deliberate spaces -->
<p>Space&nbsp;preserved</p>

<!-- Whitespace in tags is preserved -->
<div>
  Text with
  line breaks
</div>

<!-- Use pre tag for exact formatting -->
<pre>
  Line 1
  Line 2
</pre>
```

## Text Encoding & Special Characters

Angular automatically escapes text content:

```typescript
export class TextComponent {
  // HTML entities are safe
  script = '<script>alert("XSS")</script>';
  html = '<strong>Bold</strong>';
}
```

```html
<!-- Automatically escaped - displayed as text -->
<p>{{ script }}</p>  <!-- Output: &lt;script&gt;alert("XSS")&lt;/script&gt; -->
<p>{{ html }}</p>    <!-- Output: &lt;strong&gt;Bold&lt;/strong&gt; -->

<!-- Use bypassSecurityTrustHtml only for trusted content -->
<!-- NOT RECOMMENDED for user input -->
```

## Performance Considerations

### Keep Expressions Simple

```typescript
export class PerformanceComponent {
  items = [1, 2, 3, 4, 5];

  // ❌ BAD - Called every change detection
  expensiveFilter() {
    console.log('Filtering...');
    return this.items.filter(i => i > 2);
  }

  // ✅ GOOD - Computed once
  filteredItems = this.items.filter(i => i > 2);
}
```

```html
<!-- ❌ Avoid: function called constantly -->
<div *ngFor="let item of expensiveFilter()">
  {{ item }}
</div>

<!-- ✅ Good: use pre-computed property -->
<div *ngFor="let item of filteredItems">
  {{ item }}
</div>
```

### Avoid Template Side Effects

```typescript
export class BadComponent {
  items = [];

  // ❌ BAD - Side effect in template expression
  addItem() {
    this.items.push('new item');
    return this.items;
  }
}
```

```html
<!-- ❌ DON'T DO THIS -->
<div>{{ addItem() }}</div>  <!-- Modifies state during rendering -->
```

## Best Practices

✅ **Keep expressions simple** - Move complex logic to component class
✅ **Use safe navigation** - Always protect null/undefined access
✅ **Avoid function calls** - Pre-compute values in component
✅ **Cache computed values** - Avoid recalculating every change detection
✅ **Use trackBy with loops** - Improve performance with *ngFor
✅ **Escape user input** - Angular does this automatically
✅ **Use template variables** - Reference elements cleanly
✅ **Comment complex expressions** - Help future developers understand
✅ **Test template expressions** - Ensure they work correctly
✅ **Use type safety** - Leverage TypeScript for component properties

## Common Mistakes

❌ **Missing safe navigation**
```html
<!-- Bad -->
<p>{{ user.name }}</p>

<!-- Good -->
<p>{{ user?.name }}</p>
```

❌ **Expensive function calls**
```html
<!-- Bad -->
<p>{{ calculateExpensiveValue() }}</p>

<!-- Good -->
<p>{{ cachedValue }}</p>
```

❌ **Wrong operator precedence**
```html
<!-- Bad - ambiguous -->
<p>{{ a || b && c }}</p>

<!-- Good - clear -->
<p>{{ (a) || (b && c) }}</p>
```

## Key Takeaways

- Templates use `{{ }}` for interpolation
- Expressions can contain properties, operators, and method calls
- Safe navigation (`?.`) protects against null/undefined
- Keep expressions simple for performance
- Angular automatically escapes text content
- Function calls in templates happen frequently (avoid)
- Template expressions follow TypeScript rules
