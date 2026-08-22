# Templates & Binding Interview Questions - Part 1: Basics

## Template Syntax & Interpolation

### Q1: What is interpolation and how does it work?

**A:** Interpolation is Angular's way of embedding component property values directly into HTML using double curly braces `{{ }}`.

```typescript
export class MyComponent {
  title = 'Hello';
  count = 42;
}
```

```html
<h1>{{ title }}</h1>
<p>Count: {{ count }}</p>
```

Angular evaluates the expression and renders the result as text. It happens during change detection.

---

### Q2: What's the difference between interpolation and property binding?

**A:** 
- **Interpolation** - Converts the expression to a string and inserts it as text content
- **Property binding** - Sets the property value directly

```html
<!-- Interpolation -->
<p>{{ message }}</p>

<!-- Property binding -->
<p [innerText]="message"></p>

<!-- Attribute (NOT property) -->
<button [attr.aria-label]="label">OK</button>
```

Interpolation is primarily for displaying text, while property binding is for setting any element property.

---

### Q3: Can you use function calls in template expressions?

**A:** Technically yes, but it's not recommended. Functions are called **every change detection cycle**, causing performance issues.

```typescript
export class MyComponent {
  expensiveCalculation() {
    return array.reduce(...); // Called constantly!
  }
}
```

```html
<!-- ❌ BAD - function called every change detection -->
<p>{{ expensiveCalculation() }}</p>

<!-- ✅ GOOD - pre-computed -->
<p>{{ cachedValue }}</p>
```

**Best practice:** Pre-compute values in the component class or use getters with `@memo` decorator.

---

### Q4: What is the safe navigation operator and why use it?

**A:** The safe navigation operator `?.` safely accesses properties that might be null or undefined.

```typescript
user: User | null = null;
```

```html
<!-- ❌ BAD - crashes if user is null -->
<p>{{ user.name }}</p>

<!-- ✅ GOOD - returns undefined if user is null -->
<p>{{ user?.name }}</p>

<!-- ✅ GOOD - null coalescing -->
<p>{{ user?.email ?? 'no-email@example.com' }}</p>
```

It prevents "Cannot read property 'name' of null" errors.

---

### Q5: What are template expressions? What's allowed?

**A:** Template expressions are JavaScript-like snippets evaluated within `{{ }}`.

**Allowed:**
```html
{{ 5 + 3 }}
{{ name || 'Guest' }}
{{ user && user.name }}
{{ isActive ? 'Yes' : 'No' }}
{{ getFullName() }}
{{ items[0] }}
```

**NOT allowed:**
```html
<!-- Assignment operators -->
{{ user = 'John' }}

<!-- Creating instances -->
{{ new Date() }}

<!-- Increment/decrement -->
{{ count++ }}

<!-- Regular expressions -->
{{ /\d+/ }}
```

---

### Q6: What's the difference between `??` and `||` operators?

**A:** Both provide defaults, but for different reasons:

```typescript
export class MyComponent {
  count = 0;
  email = null;
}
```

```html
<!-- || - considers falsy values (0, '', false, null, undefined) -->
<p>{{ count || 10 }}</p>  <!-- Output: 10 (0 is falsy) -->

<!-- ?? - only considers null/undefined (null coalescing) -->
<p>{{ count ?? 10 }}</p>  <!-- Output: 0 (not null/undefined) -->

<p>{{ email || 'no-email' }}</p>  <!-- Output: 'no-email' -->
<p>{{ email ?? 'no-email' }}</p>  <!-- Output: 'no-email' -->
```

Use `??` for null coalescing, `||` when you want to replace falsy values.

---

### Q7: How does Angular escape HTML in templates?

**A:** Angular **automatically escapes** text content for security (XSS prevention).

```typescript
export class MyComponent {
  userInput = '<script>alert("XSS")</script>';
}
```

```html
<!-- Automatically escaped -->
<p>{{ userInput }}</p>
<!-- Output: &lt;script&gt;alert("XSS")&lt;/script&gt; -->

<!-- Never shows as executable script -->
```

The interpolation `{{ }}` always escapes HTML. Use `DomSanitizer` if you need to render trusted HTML.

---

### Q8: What's a template reference variable?

**A:** A template reference variable (`#varName`) is a reference to a template element or directive.

```html
<input #input type="text" />
<button (click)="input.focus()">Focus</button>

<input type="email" #email required />
<button [disabled]="!email.value">Submit</button>
```

**In component:**
```typescript
export class MyComponent {
  @ViewChild('input') inputRef: ElementRef;

  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
  }
}
```

---

### Q9: What are pipes? Give examples.

**A:** Pipes are functions that transform data for display using the `|` syntax.

```html
<!-- Built-in pipes -->
<p>{{ message | uppercase }}</p>
<p>{{ message | lowercase }}</p>
<p>{{ date | date: 'short' }}</p>
<p>{{ price | currency }}</p>
<p>{{ 0.5 | percent }}</p>
<p>{{ items | slice:0:3 }}</p>

<!-- Chaining pipes -->
<p>{{ date | date: 'short' | uppercase }}</p>

<!-- Custom pipe -->
<p>{{ text | myCustomPipe }}</p>
```

Pipes don't modify the data, only the display.

---

### Q10: Can you use assignments in templates?

**A:** No, assignment operators are **not allowed** in template expressions.

```html
<!-- ❌ NOT ALLOWED -->
<p>{{ user = 'John' }}</p>
<p>{{ count += 5 }}</p>

<!-- ✅ USE EVENT BINDING INSTEAD -->
<button (click)="user = 'John'">Set User</button>
<button (click)="updateCount(5)">Add 5</button>
```

This prevents accidental state mutations during change detection.

---

## Key Takeaways

✅ Interpolation `{{ }}` converts expressions to strings
✅ Property binding `[prop]` sets properties directly
✅ Keep expressions simple - pre-compute complex values
✅ Use safe navigation `?.` for nullable access
✅ Use `??` for null coalescing, `||` for falsy values
✅ Angular auto-escapes HTML content
✅ Template reference variables access DOM elements
✅ Pipes transform data for display
✅ No assignment operators allowed in expressions
✅ Functions in templates are called constantly (avoid)
