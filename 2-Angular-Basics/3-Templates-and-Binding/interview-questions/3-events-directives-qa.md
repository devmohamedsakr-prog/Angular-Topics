# Templates & Binding Interview Questions - Part 3: Events & Directives

## Event Binding

### Q1: How does event binding work?

**A:** Event binding listens for DOM events and calls component methods using `(eventName)="handler()"` syntax.

```typescript
export class MyComponent {
  clickCount = 0;

  onClick() {
    this.clickCount++;
  }
}
```

```html
<button (click)="onClick()">Click me</button>
<p>Clicked {{ clickCount }} times</p>
```

When the button is clicked:
1. Angular listens for the `click` event
2. Calls the component's `onClick()` method
3. Change detection runs
4. Template updates

---

### Q2: What's the $event object?

**A:** `$event` provides access to the DOM event object, containing details about what happened.

```typescript
export class MyComponent {
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Input value:', input.value);
  }

  onClick(event: MouseEvent) {
    console.log('X:', event.clientX);
    console.log('Y:', event.clientY);
    console.log('Button:', event.button);
  }
}
```

```html
<input (input)="onInput($event)" placeholder="Type..." />
<button (click)="onClick($event)">Click</button>
```

**Common $event properties:**
- `target` - Element that triggered event
- `currentTarget` - Element listening to event
- `clientX/Y` - Mouse position (MouseEvent)
- `key` - Key pressed (KeyboardEvent)
- `button` - Mouse button (MouseEvent)

---

### Q3: What are event modifiers?

**A:** Event modifiers control event behavior like propagation or default handling.

```html
<!-- Stop propagation -->
<div (click)="onDivClick()">
  Outer
  <button (click.stop)="onButtonClick()">
    Button (stops propagation)
  </button>
</div>

<!-- Prevent default -->
<a (click.prevent)="handleLink($event)" href="https://example.com">
  Link with prevented default
</a>

<!-- Self - only element itself -->
<div (click.self)="onSelfClick()">
  <button>Button (won't trigger)</button>
</div>

<!-- Once - listener fires only once -->
<button (click.once)="onFirstClick()">Click once</button>

<!-- Passive - improves scroll performance -->
<div (scroll.passive)="onScroll()">
  Scrollable content
</div>
```

---

### Q4: What are key modifiers?

**A:** Key modifiers filter keyboard events by specific keys.

```html
<!-- Specific keys -->
<input (keyup.enter)="onEnter()" placeholder="Press Enter" />
<input (keydown.escape)="onEscape()" placeholder="Press Escape" />
<input (keyup.space)="onSpace()" placeholder="Press Space" />

<!-- Arrow keys -->
<input (keydown.arrowup)="moveUp()" />
<input (keydown.arrowdown)="moveDown()" />

<!-- Combined modifiers -->
<input (keyup.control.s)="save()" placeholder="Ctrl+S" />
<input (keyup.shift.enter)="submit()" />
<input (keydown.alt.a)="selectAll()" />

<!-- Key codes (less common) -->
<input (keyup.13)="onEnter()" />  <!-- 13 = Enter -->
</html>
```

---

### Q5: Can you pass arguments to event handlers?

**A:** Yes, you can pass additional arguments beyond `$event`.

```typescript
export class MyComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  selectItem(item: any, index: number) {
    console.log('Selected:', item.name, 'at', index);
  }

  deleteItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
  }
}
```

```html
<!-- Pass variables -->
<button *ngFor="let item of items; let i = index"
        (click)="selectItem(item, i)">
  {{ item.name }}
</button>

<!-- Pass literal values -->
<button (click)="deleteItem(5)">Delete Item 5</button>

<!-- Mix $event and arguments -->
<input (keyup)="onKeyUp($event, 'name')" />
```

---

### Q6: How do you prevent default behavior?

**A:** Use `event.preventDefault()` or `.prevent` modifier.

```typescript
export class MyComponent {
  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Custom submit logic');
  }

  handleLink(event: MouseEvent) {
    event.preventDefault();
    // Navigate manually
  }
}
```

```html
<!-- Explicit preventDefault -->
<form (submit)="handleSubmit($event)">
  <button type="submit">Submit</button>
</form>

<!-- Or use modifier -->
<form (submit.prevent)="handleSubmit()">
  <button type="submit">Submit</button>
</form>

<a (click.prevent)="handleLink($event)" href="...">
  Link
</a>
```

---

### Q7: Can you have multiple event handlers on one element?

**A:** Yes, you can bind multiple events on the same element.

```html
<input
  (keyup)="onKeyUp($event)"
  (keydown)="onKeyDown($event)"
  (focus)="onFocus()"
  (blur)="onBlur()"
  (input)="onInput($event)" />
```

Each event triggers independently.

---

### Q8: How do you stop event propagation?

**A:** Use `event.stopPropagation()` or `.stop` modifier.

```typescript
export class MyComponent {
  onParentClick() {
    console.log('Parent clicked');
  }

  onChildClick(event: Event) {
    event.stopPropagation();
    console.log('Child clicked (parent not notified)');
  }
}
```

```html
<!-- Explicit stopPropagation -->
<div (click)="onParentClick()">
  Parent
  <button (click)="onChildClick($event)">
    Child (stops propagation)
  </button>
</div>

<!-- Or use modifier -->
<div (click)="onParentClick()">
  Parent
  <button (click.stop)="onChildClick()">
    Child (stops propagation)
  </button>
</div>
```

---

## Structural Directives

### Q9: What are structural directives? Give examples.

**A:** Structural directives modify the DOM structure by adding/removing elements. They always start with `*`.

**\*ngIf:**
```html
<div *ngIf="isVisible">Show this</div>
<div *ngIf="condition; else elseBlock">Show</div>
<ng-template #elseBlock>Show this instead</ng-template>
```

**\*ngFor:**
```html
<ul>
  <li *ngFor="let item of items; trackBy: trackByFn">
    {{ item }}
  </li>
</ul>
```

**\*ngSwitch:**
```html
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">Active</div>
  <div *ngSwitchDefault>Other</div>
</div>
```

---

### Q10: What's the performance difference between *ngIf and [hidden]?

**A:**
- **\*ngIf** - Removes element from DOM completely (better performance)
- **[hidden]** - Keeps element in DOM, just hides with CSS

```html
<!-- ✅ GOOD - element not in DOM -->
<div *ngIf="show">Content</div>

<!-- ❌ AVOID - element still in DOM but hidden -->
<div [hidden]="!show">Content</div>
```

**Use \*ngIf when:**
- Element is expensive to initialize
- You want to free up memory
- Performance matters

**Use [hidden] when:**
- Toggling frequently (avoid DOM recreation)
- Content needs to be quickly visible

---

### Q11: What is trackBy and why use it?

**A:** `trackBy` tells Angular how to identify list items for optimal change detection.

```typescript
export class MyComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  // Without trackBy - Angular recreates DOM for all items
  // With trackBy - Angular reuses DOM elements by ID

  trackByFn(index: number, item: any) {
    return item.id;  // Unique identifier
  }
}
```

```html
<!-- Without trackBy - slow for large lists -->
<div *ngFor="let item of items">
  {{ item.name }}
</div>

<!-- With trackBy - much faster -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

**Performance impact:** With trackBy, only changed items are updated. Without it, entire list is recreated.

---

### Q12: What's the difference between *ngIf and *ngSwitch?

**A:**
- **\*ngIf** - Single conditional (show/hide one thing)
- **\*ngSwitch** - Multiple conditions (select one of many)

```html
<!-- ngIf - single condition -->
<div *ngIf="isLoggedIn">Welcome</div>

<!-- ngSwitch - multiple conditions -->
<div [ngSwitch]="userRole">
  <div *ngSwitchCase="'admin'">Admin panel</div>
  <div *ngSwitchCase="'user'">User page</div>
  <div *ngSwitchDefault>Guest page</div>
</div>
```

Use `*ngIf` for simple conditions, `*ngSwitch` when you have 3+ branches.

---

## Key Takeaways

✅ Event binding `(event)="handler()"` listens for events
✅ `$event` provides access to DOM event details
✅ Event modifiers `.stop`, `.prevent` control behavior
✅ Key modifiers `.enter`, `.escape` filter keyboard events
✅ Pass arguments to handlers: `(click)="handler(arg)"`
✅ Multiple events on same element are independent
✅ Structural directives `*ngIf`, `*ngFor`, `*ngSwitch` modify DOM
✅ Use `trackBy` with `*ngFor` for performance
✅ Prefer `*ngIf` over `[hidden]` for better performance
✅ `*ngSwitch` better than multiple `*ngIf` for many branches
