# Event Binding

## Overview

Event binding connects user interactions to component methods. Angular listens for specific events and executes handler methods.

## Basic Event Binding

### Event Binding Syntax

```typescript
export class EventComponent {
  clickCount = 0;
  message = 'No input yet';

  onClick() {
    this.clickCount++;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.message = input.value;
  }
}
```

```html
<!-- Event binding: (eventName)="handler()" -->
<button (click)="onClick()">Click me</button>
<p>Clicked {{ clickCount }} times</p>

<!-- With event parameter -->
<input (input)="onInput($event)" placeholder="Type..." />
<p>{{ message }}</p>
```

## Common Events

### Mouse Events

```typescript
export class MouseComponent {
  position = '';
  entered = false;

  onMouseMove(event: MouseEvent) {
    this.position = `X: ${event.clientX}, Y: ${event.clientY}`;
  }

  onMouseEnter() {
    this.entered = true;
  }

  onMouseLeave() {
    this.entered = false;
  }

  onDoubleClick() {
    console.log('Double clicked');
  }
}
```

```html
<!-- Mouse events -->
<div (mousemove)="onMouseMove($event)">
  Position: {{ position }}
</div>

<div (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
  {{ entered ? 'Mouse inside' : 'Mouse outside' }}
</div>

<button (dblclick)="onDoubleClick()">Double click</button>
<button (mousedown)="onMouseDown()" (mouseup)="onMouseUp()">Hold</button>
```

### Keyboard Events

```typescript
export class KeyboardComponent {
  inputValue = '';
  pressedKey = '';

  onKeyUp(event: KeyboardEvent) {
    this.pressedKey = event.key;
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      console.log('Enter pressed');
    }
  }
}
```

```html
<!-- Keyboard events -->
<input (keyup)="onKeyUp($event)" placeholder="Press any key" />
<p>Last key: {{ pressedKey }}</p>

<input (keyup.enter)="onEnter($event)" placeholder="Press Enter" />

<!-- Specific key modifiers -->
<input (keyup.escape)="onEscape()" />
<input (keyup.control.s)="save()" placeholder="Ctrl+S" />
<input (keydown.arrowup)="moveUp()" />
```

### Focus & Blur Events

```typescript
export class FocusComponent {
  isFocused = false;
  currentField = '';

  onFocus(fieldName: string) {
    this.isFocused = true;
    this.currentField = fieldName;
  }

  onBlur() {
    this.isFocused = false;
  }
}
```

```html
<!-- Focus events -->
<input (focus)="onFocus('email')" (blur)="onBlur()" 
       placeholder="Email" />
<p *ngIf="currentField === 'email' && isFocused">Email is focused</p>

<input (focus)="onFocus('password')" (blur)="onBlur()" 
       type="password" placeholder="Password" />
```

### Form Events

```typescript
export class FormComponent {
  formData = { name: '', email: '' };
  submitted = false;

  onSubmit(form: HTMLFormElement) {
    console.log('Form submitted');
    this.submitted = true;
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Changed:', input.value);
  }

  onReset() {
    this.formData = { name: '', email: '' };
    this.submitted = false;
  }
}
```

```html
<!-- Form events -->
<form (submit)="onSubmit($event)" (reset)="onReset()">
  <input (change)="onChange($event)" name="email" />
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
```

## Event Object ($event)

The `$event` variable provides access to the DOM event.

### Accessing Event Properties

```typescript
export class EventObjectComponent {
  keyCode = 0;
  target = '';

  onKeyDown(event: KeyboardEvent) {
    this.keyCode = event.keyCode;
  }

  onClick(event: MouseEvent) {
    console.log('Button:', event.button);
    console.log('Position:', event.clientX, event.clientY);
    console.log('Alt key:', event.altKey);
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.target = input.value;
  }
}
```

```html
<!-- Using $event -->
<input (keydown)="onKeyDown($event)" />
<p>Key code: {{ keyCode }}</p>

<div (click)="onClick($event)">
  Click anywhere
</div>

<input (input)="onInput($event)" />
<p>Typed: {{ target }}</p>
```

## Event Modifiers

Control how events are handled with modifiers.

### Key Modifiers

```html
<!-- Specific keys -->
<input (keyup.enter)="onEnter()" placeholder="Press Enter" />
<input (keyup.escape)="onEscape()" placeholder="Press Escape" />
<input (keyup.space)="onSpace()" placeholder="Press Space" />
<input (keyup.arrowup)="moveUp()" />
<input (keyup.arrowdown)="moveDown()" />

<!-- Combined key modifiers -->
<input (keyup.control.enter)="save()" placeholder="Ctrl+Enter" />
<input (keyup.shift.space)="select()" placeholder="Shift+Space" />
<input (keydown.alt.s)="search()" placeholder="Alt+S" />

<!-- Key codes (less common) -->
<input (keyup.13)="onEnter()" />  <!-- 13 = Enter -->
<input (keyup.27)="onEscape()" /> <!-- 27 = Escape -->
```

### Event Propagation Modifiers

```html
<!-- Stop event propagation -->
<div (click)="onDivClick()">
  Outer div
  <button (click.stop)="onButtonClick()">
    Stop propagation
  </button>
</div>

<!-- Prevent default behavior -->
<a (click.prevent)="handleLink($event)" href="https://example.com">
  Link with prevented default
</a>

<!-- Self - only direct element -->
<div (click.self)="onSelfClick()">
  <button>Button</button>  <!-- Won't trigger onSelfClick -->
</div>

<!-- Once - listener fires only once -->
<button (click.once)="onFirstClick()">
  Click once
</button>

<!-- Passive - improves scroll performance -->
<div (scroll.passive)="onScroll()">
  Scrollable content
</div>
```

## Passing Arguments

Pass data to event handlers.

### With Template Variables

```typescript
export class ArgumentsComponent {
  selectedItem = '';
  selectedIndex = -1;

  selectItem(item: string, index: number) {
    this.selectedItem = item;
    this.selectedIndex = index;
  }

  deleteItem(id: number) {
    console.log('Delete item:', id);
  }
}
```

```html
<!-- Passing variables -->
<button *ngFor="let item of items; let i = index"
        (click)="selectItem(item, i)">
  {{ item }}
</button>
<p>Selected: {{ selectedItem }} at index {{ selectedIndex }}</p>

<!-- Passing computed values -->
<button (click)="deleteItem(123)">Delete</button>
<button (click)="selectItem('First Item', 0)">Select First</button>
```

### With $event and Destructuring

```typescript
export class DestructuringComponent {
  formData = { name: '', email: '', phone: '' };

  onInputChange(field: string, event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData = { ...this.formData, [field]: input.value };
  }
}
```

```html
<!-- Event and custom parameters -->
<input (change)="onInputChange('name', $event)" placeholder="Name" />
<input (change)="onInputChange('email', $event)" placeholder="Email" />

<!-- Multiple parameters -->
<button (click)="handleClick('save', 123, true)">Save</button>
```

## Event Handler Patterns

### Inline Handlers

```html
<!-- Simple inline logic -->
<button (click)="message = 'Clicked!'">Click</button>
<p>{{ message }}</p>

<!-- Inline with expression -->
<button (click)="count = count + 1">Increment</button>
<button (click)="items = []">Clear</button>
```

### Method Handlers

```html
<!-- Handler method -->
<button (click)="handleClick()">Click</button>

<!-- With parameters -->
<button (click)="deleteItem(item.id)">Delete</button>

<!-- With multiple events -->
<input (keyup)="onKeyUp($event)"
       (keydown)="onKeyDown($event)"
       (focus)="onFocus()"
       (blur)="onBlur()" />
```

### Conditional Handlers

```html
<!-- Only call handler under certain conditions -->
<button [disabled]="!isValid" (click)="submit()">
  Submit
</button>

<button (click)="toggle()">
  {{ isOpen ? 'Close' : 'Open' }}
</button>
```

## Event Binding Best Practices

✅ **Use descriptive handler names**
```html
<!-- Good -->
<button (click)="onDeleteUser()">Delete</button>

<!-- Avoid -->
<button (click)="delete()">Delete</button>
```

✅ **Keep handlers in component class**
```typescript
// Good - handler in component
onSubmit(form: FormData) {
  this.service.submit(form).subscribe(...);
}
```

```html
<!-- Good - simple call -->
<button (click)="onSubmit(form)">Submit</button>

<!-- Avoid - inline logic -->
<button (click)="service.submit(); message = 'Sent'">Submit</button>
```

✅ **Handle events properly**
```typescript
// Good - prevent default for forms
onLinkClick(event: MouseEvent) {
  event.preventDefault();
  // Handle navigation
}
```

❌ **Avoid expensive operations in handlers**
```typescript
// Bad - slow operation blocks UI
onScroll(event: Event) {
  this.items = this.allItems.filter(/* complex logic */);
}

// Good - use debounce or throttle
@HostListener('scroll', ['$event'])
onScroll(event: Event) {
  if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
  this.scrollTimeout = setTimeout(() => {
    this.items = this.allItems.filter(/* complex logic */);
  }, 300);
}
```

## Key Takeaways

- **Event binding** - `(eventName)="handler()"`
- **$event** - Access DOM event object
- **Key modifiers** - `(keyup.enter)`, `(click.stop)`
- **Event propagation** - Use `.stop`, `.prevent`, `.self`
- **Keep handlers simple** - Move complex logic to methods
- **Type events properly** - Use KeyboardEvent, MouseEvent, etc.
- **Handle errors** - Gracefully handle event failures
