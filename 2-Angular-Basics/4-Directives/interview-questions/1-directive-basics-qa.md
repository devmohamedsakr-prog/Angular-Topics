# Directive Basics - Interview Questions & Answers

## Q1: What are Angular Directives? Explain the three types.

**Answer:**
Angular directives are markers on a DOM element (such as an attribute, element name, comment, or CSS class) that tell Angular's HTML compiler to attach a specified behavior to that DOM element or even transform the DOM element and its children.

**Three Types:**

1. **Components** - Directives with a template
   - Have views and logic
   - Example: `@Component({ selector: 'app-header' })`

2. **Structural Directives** - Change DOM structure
   - Add or remove elements
   - Prefix with `*`
   - Examples: `*ngIf`, `*ngFor`, `*ngSwitch`

3. **Attribute Directives** - Change element appearance or behavior
   - Modify existing elements
   - No asterisk
   - Examples: `[ngClass]`, `[ngStyle]`, `[(ngModel)]`, custom directives

```typescript
// Component (has template)
@Component({
  selector: 'app-card',
  template: '<div>Card content</div>'
})
export class CardComponent {}

// Structural (modifies DOM)
<div *ngIf="isVisible">Show when visible</div>
<div *ngFor="let item of items">{{ item }}</div>

// Attribute (modifies behavior/appearance)
<div [ngClass]="className">Class binding</div>
<div [appHighlight]="color">Custom attribute directive</div>
```

---

## Q2: What is the difference between `*ngIf` and `[hidden]`?

**Answer:**

| Feature | `*ngIf` | `[hidden]` |
|---------|---------|-----------|
| DOM Impact | Removes element from DOM | Keeps element in DOM |
| Display | Uses `display: none` internally | Uses CSS `display: none` |
| Performance | Better for hidden content (not rendered) | Slower for large hidden sections |
| Lifecycle | Destroys & recreates component | Component stays alive |
| Use Case | Conditional rendering | Temporary visibility toggle |

```typescript
// ✅ GOOD: Uses *ngIf for large hidden sections
<div *ngIf="showDetails">
  Large component with many children
</div>

// ❌ BAD: Uses [hidden] for performance-critical content
<!-- Component still renders even when hidden -->
<div [hidden]="!showDetails">
  Complex component rendered unnecessarily
</div>

// ✅ GOOD: Uses [hidden] for frequently toggled visibility
<div [hidden]="!isMenuOpen" class="dropdown">
  Quick toggle menu
</div>
```

**When to use:**
- **`*ngIf`**: Conditional logic, large sections, performance-sensitive
- **`[hidden]`**: Quick toggles, frequently changing visibility

---

## Q3: Explain `*ngFor` with TrackBy and why it's important.

**Answer:**
`*ngFor` renders a template for each item in a list. Without `trackBy`, Angular re-renders the entire list when the data changes, which is inefficient.

**TrackBy Benefits:**
- Identifies unique items by a key
- Only re-renders changed items
- Improves performance dramatically
- Preserves form input state

```typescript
// ❌ BAD: No trackBy - recreates all DOM elements
<div *ngFor="let user of users">
  {{ user.name }}
  <input /> <!-- Input state lost on re-render -->
</div>

// ✅ GOOD: With trackBy - only changed items update
<div *ngFor="let user of users; trackBy: trackByFn">
  {{ user.name }}
  <input /> <!-- Input state preserved -->
</div>

// Component
export class MyComponent {
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  // TrackBy function returns unique identifier
  trackByFn(index: number, user: any): number {
    return user.id; // Return unique key
  }

  // Best practice: cache it
  trackBy = this.trackByFn.bind(this);
}
```

**Performance Impact:**
- Without trackBy: O(n) DOM updates
- With trackBy: O(1) or O(k) where k = changed items

---

## Q4: What is a Directive Selector? Explain different selector types.

**Answer:**
A directive selector determines how the directive is used in HTML. Angular supports multiple selector types:

```typescript
// 1. ATTRIBUTE SELECTOR (most common)
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {}

// Usage: <div appHighlight></div>
// Usage with binding: <div [appHighlight]="'blue'"></div>


// 2. ELEMENT SELECTOR
@Directive({
  selector: 'app-card'
})
export class CardDirective {}

// Usage: <app-card></app-card>


// 3. CLASS SELECTOR
@Directive({
  selector: '.app-highlight'
})
export class ClassHighlightDirective {}

// Usage: <div class="app-highlight"></div>


// 4. ATTRIBUTE WITH VALUE
@Directive({
  selector: '[appRole="admin"]'
})
export class AdminDirective {}

// Usage: <div appRole="admin"></div>


// 5. MULTIPLE SELECTORS (OR logic)
@Directive({
  selector: '[appHighlight], .highlight, app-highlight'
})
export class MultiHighlightDirective {}

// Any of these work:
// <div appHighlight></div>
// <div class="highlight"></div>
// <app-highlight></app-highlight>


// 6. NEGATION SELECTOR
@Directive({
  selector: 'div:not(.no-highlight)'
})
export class NegationDirective {}

// Usage: <div>Highlighted</div>
// Not applied: <div class="no-highlight">Not highlighted</div>
```

**Best Practices:**
- Use **attribute selector** for reusable directives
- Use **element selector** for specific components
- Use **multiple selectors** for flexibility

---

## Q5: What are `@Input` and `@Output` decorators in directives?

**Answer:**
`@Input` and `@Output` are decorators that allow communication between parent and directive.

```typescript
// CUSTOM DIRECTIVE
@Directive({
  selector: '[appClickCounter]'
})
export class ClickCounterDirective {
  // @Input: Parent passes data TO directive
  @Input() maxClicks: number = 10;
  @Input() enableSound: boolean = false;

  // @Output: Directive emits events TO parent
  @Output() clickCountChanged = new EventEmitter<number>();
  @Output() maxReached = new EventEmitter<void>();

  private clickCount = 0;

  @HostListener('click')
  onClick() {
    this.clickCount++;
    this.clickCountChanged.emit(this.clickCount);

    if (this.clickCount >= this.maxClicks) {
      this.maxReached.emit();
    }
  }
}

// USAGE IN COMPONENT
@Component({
  selector: 'app-test',
  template: `
    <div
      [appClickCounter]
      [maxClicks]="5"
      [enableSound]="true"
      (clickCountChanged)="onCountChange($event)"
      (maxReached)="onMaxReached()">
      Click me!
    </div>
  `
})
export class TestComponent {
  onCountChange(count: number) {
    console.log('Clicks:', count);
  }

  onMaxReached() {
    console.log('Max clicks reached!');
  }
}
```

**Key Differences:**
- **@Input**: Property binding (parent → directive)
- **@Output**: Event binding (directive → parent)
- **@Input setter**: Can add logic when value changes
- **@Output emitter**: Must be EventEmitter<T>

---

## Q6: Explain the Directive Lifecycle Hooks.

**Answer:**
Directive lifecycle hooks are called at specific moments during directive initialization, update, and destruction.

```typescript
@Directive({
  selector: '[appLifecycle]'
})
export class LifecycleDirective
  implements OnInit, OnChanges, DoCheck, AfterViewInit, AfterContentInit, OnDestroy {

  @Input() name: string = '';

  constructor() {
    console.log('1. constructor - Directive is being instantiated');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('2. ngOnChanges - Input properties changed');
    if (changes['name']) {
      console.log('Name changed:', changes['name'].currentValue);
    }
  }

  ngOnInit() {
    console.log('3. ngOnInit - Directive initialized, inputs bound');
  }

  ngDoCheck() {
    console.log('4. ngDoCheck - Custom change detection');
  }

  ngAfterContentInit() {
    console.log('5. ngAfterContentInit - Content initialized');
  }

  ngAfterViewInit() {
    console.log('6. ngAfterViewInit - View/child views initialized');
  }

  ngOnDestroy() {
    console.log('7. ngOnDestroy - Directive being destroyed, cleanup here');
  }
}

// EXECUTION ORDER:
// 1. constructor
// 2. ngOnChanges (called before ngOnInit and before each input change)
// 3. ngOnInit (called once after first ngOnChanges)
// 4. ngDoCheck (called on every change detection run)
// 5. ngAfterContentInit (called once after directive content initialized)
// 6. ngAfterViewInit (called once after directive view initialized)
// 7. ngOnDestroy (called before directive is removed from DOM)
```

**Common Use Cases:**
```typescript
// Initialize resources
ngOnInit() {
  this.subscription = this.dataService.getData().subscribe(...);
}

// React to input changes
ngOnChanges(changes: SimpleChanges) {
  if (changes['config']) {
    this.updateConfig(changes['config'].currentValue);
  }
}

// Clean up resources
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

---

## Q7: What is `@HostListener` and `@HostBinding`?

**Answer:**
`@HostListener` and `@HostBinding` allow directives to listen to and modify the host element.

```typescript
@Directive({
  selector: '[appHoverEffect]'
})
export class HoverEffectDirective {
  // @HostBinding: Bind to host element properties
  @HostBinding('style.backgroundColor')
  backgroundColor = 'transparent';

  @HostBinding('style.transform')
  transform = 'scale(1)';

  @HostBinding('class.active')
  isActive = false;

  // @HostListener: Listen to host element events
  @HostListener('mouseenter')
  onMouseEnter() {
    this.backgroundColor = 'lightblue';
    this.transform = 'scale(1.05)';
    this.isActive = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.backgroundColor = 'transparent';
    this.transform = 'scale(1)';
    this.isActive = false;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log('Clicked:', event.target);
  }

  // Keyboard events
  @HostListener('keydown.enter')
  onEnter() {
    console.log('Enter pressed');
  }

  @HostListener('keydown.escape')
  onEscape() {
    console.log('Escape pressed');
  }
}

// USAGE:
// <div appHoverEffect>Hover me!</div>
```

**Event Modifiers:**
- `keydown.enter` - Enter key
- `keydown.escape` - Escape key
- `keydown.ctrl` - Ctrl key
- `click` - Click event
- `mouseenter` - Mouse enter
- `mouseleave` - Mouse leave
- `focus` - Focus event
- `blur` - Blur event

---

## Q8: Explain ElementRef vs Renderer2.

**Answer:**
`ElementRef` and `Renderer2` both allow DOM manipulation, but `Renderer2` is the recommended way.

```typescript
// ❌ AVOID: Direct DOM manipulation with ElementRef
@Directive({
  selector: '[appBadStyle]'
})
export class BadStyleDirective {
  constructor(private el: ElementRef) {
    // Direct access to native element - can cause issues
    el.nativeElement.style.color = 'red';
    el.nativeElement.innerHTML = '<b>Dangerous</b>'; // XSS risk!
    el.nativeElement.addEventListener('click', () => {}); // Memory leaks
  }
}

// ✅ GOOD: Use Renderer2 for safe DOM manipulation
@Directive({
  selector: '[appGoodStyle]'
})
export class GoodStyleDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Safe, Angular-aware DOM manipulation
    this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', '<b>Safe</b>');
    this.renderer.listen(this.el.nativeElement, 'click', () => {});
  }
}

// Common Renderer2 Methods:
this.renderer.setStyle(element, 'color', 'red');
this.renderer.addClass(element, 'highlight');
this.renderer.removeClass(element, 'highlight');
this.renderer.setAttribute(element, 'aria-label', 'Button');
this.renderer.removeAttribute(element, 'disabled');
this.renderer.setProperty(element, 'innerText', 'Text');
this.renderer.createElement('div');
this.renderer.appendChild(parent, child);
this.renderer.removeChild(parent, child);
this.renderer.listen(element, 'click', callback);
```

**Why Renderer2?**
- **Security**: Prevents XSS attacks
- **Compatibility**: Works with Server-Side Rendering (SSR)
- **Performance**: Angular can optimize it
- **Platform independence**: Works with different rendering platforms
- **Memory management**: Proper cleanup support

---

## Q9: What is a Custom Directive? How do you create one?

**Answer:**
A custom directive is a reusable class that extends the behavior of HTML elements.

```typescript
// BASIC CUSTOM DIRECTIVE
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() highlightColor: string = 'yellow';

  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = this.highlightColor;
  }
}

// ADVANCED CUSTOM DIRECTIVE
@Directive({
  selector: '[appValidation]'
})
export class ValidationDirective implements OnInit, OnChanges {
  @Input() appValidation: 'email' | 'phone' | 'url' = 'email';
  @Input() pattern?: RegExp;
  @Output() validation = new EventEmitter<boolean>();

  private patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{10}$/,
    url: /^https?:\/\//
  };

  ngOnInit() {
    this.setupValidation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appValidation']) {
      this.setupValidation();
    }
  }

  private setupValidation() {
    const pattern = this.pattern || this.patterns[this.appValidation];
    
    this.el.nativeElement.addEventListener('blur', () => {
      const isValid = pattern.test(this.el.nativeElement.value);
      this.validation.emit(isValid);
    });
  }

  constructor(private el: ElementRef) {}
}

// REGISTER DIRECTIVE
@NgModule({
  declarations: [HighlightDirective, ValidationDirective]
})
export class AppModule {}

// USAGE
@Component({
  template: `
    <div [appHighlight] [highlightColor]="'lightblue'">
      Highlighted content
    </div>
    
    <input
      [appValidation]="'email'"
      (validation)="onValidation($event)"
      placeholder="Enter email" />
  `
})
export class AppComponent {
  onValidation(isValid: boolean) {
    console.log('Email valid:', isValid);
  }
}
```

---

## Q10: How do you pass data to a directive using `@Input` with alias?

**Answer:**
You can use an alias to make the directive API cleaner and more intuitive.

```typescript
// Directive with Input alias
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  // Without alias: [appHighlight] and [color]
  // With alias: Just use [appHighlight] for color too
  @Input() set appHighlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

  @Input() set textColor(color: string) {
    this.el.nativeElement.style.color = color;
  }

  constructor(private el: ElementRef) {}
}

// USAGE WITH ALIAS
// Instead of: <div appHighlight [color]="'red'">Content</div>
// Use cleaner: <div [appHighlight]="'red'" [textColor]="'white'">Content</div>
// Or even better: <div appHighlight="red">Content</div>

// EXAMPLE: Input Setter with Logic
@Directive({
  selector: '[appTheme]'
})
export class ThemeDirective {
  private theme: string = 'light';

  @Input()
  set appTheme(value: string) {
    this.setTheme(value);
  }

  private setTheme(theme: string) {
    this.renderer.addClass(this.el.nativeElement, `theme-${theme}`);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// USAGE:
// <div [appTheme]="'dark'"></div>
// <div [appTheme]="'light'"></div>
```

---

## Summary of Key Concepts

| Concept | Purpose |
|---------|---------|
| Selector | How to use directive in HTML |
| @Input | Pass data to directive |
| @Output | Emit events from directive |
| @HostListener | Listen to host element events |
| @HostBinding | Bind to host element properties |
| ElementRef | Access to native DOM (avoid) |
| Renderer2 | Safe DOM manipulation |
| Lifecycle | Hooks during directive lifecycle |

## Common Interview Questions Checklist

- ✅ Types of directives (components, structural, attribute)
- ✅ *ngIf vs [hidden]
- ✅ *ngFor with trackBy
- ✅ Directive selectors
- ✅ @Input and @Output
- ✅ Lifecycle hooks
- ✅ @HostListener and @HostBinding
- ✅ ElementRef vs Renderer2
- ✅ Creating custom directives
- ✅ @Input with setters and aliases
