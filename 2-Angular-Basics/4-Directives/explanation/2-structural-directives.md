# Structural Directives: *ngIf, *ngFor, *ngSwitch

## *ngIf - Conditional Rendering

The `*ngIf` directive adds or removes a DOM element based on an expression.

### Basic Syntax

```typescript
export class MyComponent {
  isVisible = true;
}
```

```html
<!-- Show/hide based on condition -->
<div *ngIf="isVisible">This is visible</div>

<!-- Show when condition is true, hide when false -->
<button *ngIf="!isDisabled">Submit</button>

<!-- Show one of two templates -->
<div *ngIf="user; else noUser">
  Welcome {{ user.name }}
</div>
<ng-template #noUser>
  <p>Please log in</p>
</ng-template>
```

### With then/else Templates

```html
<!-- Full if/then/else -->
<div *ngIf="isPremium; then premiumTemplate; else basicTemplate"></div>

<ng-template #premiumTemplate>
  <p>Premium features available</p>
</ng-template>

<ng-template #basicTemplate>
  <p>Upgrade to premium</p>
</ng-template>
```

### How *ngIf Works

```html
<!-- Template -->
<div *ngIf="condition">Content</div>

<!-- Translates to -->
<ng-template [ngIf]="condition">
  <div>Content</div>
</ng-template>
```

### Performance: *ngIf vs [hidden]

```html
<!-- ✅ *ngIf - element removed from DOM -->
<div *ngIf="show">Content</div>

<!-- ❌ [hidden] - element stays in DOM, just hidden -->
<div [hidden]="!show">Content</div>
```

Use `*ngIf` when you want to remove element from DOM completely (better for performance).
Use `[hidden]` when you frequently toggle visibility (avoid DOM recreation).

---

## *ngFor - List Rendering

The `*ngFor` directive repeats DOM elements for each item in a collection.

### Basic Syntax

```typescript
export class MyComponent {
  items = ['Item 1', 'Item 2', 'Item 3'];
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
}
```

```html
<!-- Simple loop -->
<ul>
  <li *ngFor="let item of items">{{ item }}</li>
</ul>

<!-- With index -->
<ul>
  <li *ngFor="let item of items; let i = index">
    {{ i }}: {{ item }}
  </li>
</ul>

<!-- With even/odd -->
<ul>
  <li *ngFor="let item of items; let even = even; let odd = odd"
      [class.even]="even">
    {{ item }}
  </li>
</ul>

<!-- With first/last -->
<ul>
  <li *ngFor="let item of items; let first = first; let last = last">
    <span *ngIf="first">>>> </span>
    {{ item }}
    <span *ngIf="last"> <<<</span>
  </li>
</ul>
```

### Loop Context Variables

```html
<!-- Available context variables -->
<div *ngFor="let item of items; let i = index; let even = even; let odd = odd; 
             let first = first; let last = last; let count = count">
  
  Index: {{ i }} / {{ count }}
  Even: {{ even }}, Odd: {{ odd }}
  First: {{ first }}, Last: {{ last }}
</div>
```

### Nested Loops

```html
<div *ngFor="let category of categories">
  <h3>{{ category.name }}</h3>
  <ul>
    <li *ngFor="let item of category.items">
      {{ item }}
    </li>
  </ul>
</div>
```

### TrackBy - Performance Optimization

Without `trackBy`, Angular recreates DOM for all items when list changes.

```typescript
export class MyComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  trackByFn(index: number, item: any) {
    return item.id;  // Unique identifier
  }
}
```

```html
<!-- Without trackBy - DOM recreated for all items -->
<div *ngFor="let item of items">
  {{ item.name }}
</div>

<!-- With trackBy - only changed items updated -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

**Performance impact:** With large lists, `trackBy` can be 10x+ faster.

---

## *ngSwitch - Multi-way Branching

The `*ngSwitch` directive selects one of several nested templates to display.

### Basic Syntax

```typescript
export class MyComponent {
  status = 'active';  // 'active', 'inactive', 'pending'
}
```

```html
<!-- Switch on value -->
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">
    <span class="badge-green">Active</span>
  </div>
  
  <div *ngSwitchCase="'inactive'">
    <span class="badge-red">Inactive</span>
  </div>
  
  <div *ngSwitchCase="'pending'">
    <span class="badge-yellow">Pending</span>
  </div>
  
  <div *ngSwitchDefault>
    <span class="badge-gray">Unknown</span>
  </div>
</div>
```

### Multiple Cases with Same Template

```html
<div [ngSwitch]="userType">
  <div *ngSwitchCase="'admin'">Admin privileges</div>
  <div *ngSwitchCase="'moderator'">Moderator privileges</div>
  <div *ngSwitchDefault>User privileges</div>
</div>
```

### Nested Switch

```html
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">
    <div [ngSwitch]="priority">
      <div *ngSwitchCase="1">High priority</div>
      <div *ngSwitchCase="2">Medium priority</div>
      <div *ngSwitchDefault>Low priority</div>
    </div>
  </div>
</div>
```

---

## Comparing Structural Directives

| Feature | *ngIf | *ngFor | *ngSwitch |
|---------|-------|--------|-----------|
| Purpose | Conditional | Iteration | Multi-way branching |
| Use When | Show/hide element | Repeat for each item | Select one of many |
| Multiple Per Element | No | No | No |
| Performance | Fast (removes DOM) | Use trackBy | Fast |
| Best For | Boolean conditions | Lists/arrays | Many options |

---

## Best Practices

✅ **DO:**
- Use `trackBy` with `*ngFor` on large lists
- Use `*ngIf` for conditional rendering
- Use `*ngSwitch` for 3+ branches instead of nested `*ngIf`
- Keep templates inside directives simple
- Use `ng-template` for complex template logic
- Use `ng-container` to avoid extra DOM elements

❌ **DON'T:**
- Mix multiple structural directives on one element
- Use `[hidden]` for expensive components
- Forget `trackBy` function
- Nest `*ngIf` more than 2-3 levels
- Put complex logic in templates
- Use `*ngSwitch` for simple boolean

---

## Key Takeaways

- `*ngIf` adds/removes element based on condition
- `*ngFor` repeats element for each item
- `trackBy` dramatically improves *ngFor performance
- `*ngSwitch` selects one of many templates
- Always use safe navigation (`?.`) in structural directives
- Only one structural directive per element
- Prefer `*ngIf` over `[hidden]` for better performance
- Use `ng-container` to group elements without adding DOM
