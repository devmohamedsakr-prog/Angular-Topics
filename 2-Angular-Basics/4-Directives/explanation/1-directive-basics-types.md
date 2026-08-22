# Directive Basics & Types

## What are Directives?

Directives are markers on a DOM element (such as an attribute, element name, comment or CSS class) that tell Angular's HTML compiler to attach a specified behavior to that DOM element or even transform the DOM and its children.

Angular comes with a built-in set of directives like:
- `@NgIf` - adds/removes DOM elements based on expression
- `@NgFor` - repeats a DOM element for each item in a list
- `@NgSwitch` - conditionally swaps DOM elements
- `@NgClass` - dynamically binds one or more CSS classes
- `@NgStyle` - dynamically binds one or more inline styles
- `@NgModel` - binds the value of HTML controls to a property on the component

## Types of Directives

Angular directives fall into three categories based on their purpose:

### 1. Structural Directives

Structural directives **change the layout** by adding and removing DOM elements. They modify the DOM structure itself.

**Characteristics:**
- Always preceded by `*` (asterisk) in templates
- Only one structural directive per host element
- Examples: `*ngIf`, `*ngFor`, `*ngSwitch`

```html
<!-- *ngIf removes/adds element -->
<div *ngIf="condition">Content</div>

<!-- *ngFor repeats element -->
<div *ngFor="let item of items">{{ item }}</div>

<!-- *ngSwitch selects element -->
<div [ngSwitch]="value">
  <div *ngSwitchCase="'a'">A</div>
</div>
```

### 2. Attribute Directives

Attribute directives **change the appearance or behavior** of a DOM element, component, or another directive.

**Characteristics:**
- Look like regular HTML attributes (but with power!)
- Appear within element tags
- Most common in templates
- Examples: `[ngClass]`, `[ngStyle]`, `[ngModel]`, `[(ngModel)]`

```html
<!-- ngClass changes CSS classes -->
<div [ngClass]="{ active: isActive }">Content</div>

<!-- ngStyle sets inline styles -->
<div [ngStyle]="{ color: textColor }">Content</div>

<!-- ngModel binds to form control -->
<input [(ngModel)]="value" />
```

### 3. Component Directives

Components are technically directives with a template. They're the most common type of directive.

```typescript
@Component({
  selector: 'app-my-component',
  template: `<p>My Component</p>`
})
export class MyComponent {}
```

```html
<!-- Using component directive -->
<app-my-component></app-my-component>
```

## How Directives Work

### Structural Directive Mechanism

When Angular encounters a structural directive like `*ngIf`:

1. Angular converts the `*ngIf` to a `<ng-template>` element
2. The directive receives the template as input
3. The directive creates/destroys element instances based on expression
4. Template is instantiated when condition is true

```html
<!-- Written -->
<div *ngIf="isVisible">Content</div>

<!-- Converted to -->
<ng-template [ngIf]="isVisible">
  <div>Content</div>
</ng-template>
```

### Attribute Directive Mechanism

Attribute directives receive the element as input and can:
- Read/write element properties
- Modify element style
- Add/remove CSS classes
- Listen to events
- Inject services

```typescript
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
  }
}
```

```html
<p appHighlight>Highlighted</p>
```

## Selector Types

Directives use different selector formats:

```typescript
// Element selector
@Directive({ selector: 'app-directive' })
// Usage: <app-directive></app-directive>

// Attribute selector
@Directive({ selector: '[appDirective]' })
// Usage: <div appDirective></div>

// Class selector
@Directive({ selector: '.app-directive' })
// Usage: <div class="app-directive"></div>

// Attribute with value
@Directive({ selector: '[appDirective=value]' })
// Usage: <div appDirective="value"></div>

// Multiple conditions
@Directive({ selector: 'div.app-directive' })
// Usage: <div class="app-directive"></div>
```

## Directive Lifecycle

Directives follow the same lifecycle as components:

1. **Constructor** - Called when directive is instantiated
2. **ngOnInit** - Called after initialization
3. **ngDoCheck** - Called during change detection
4. **ngOnDestroy** - Called before directive is destroyed

```typescript
@Directive({
  selector: '[appMyDirective]'
})
export class MyDirective implements OnInit, OnDestroy {
  constructor(private el: ElementRef) {
    console.log('Constructor');
  }

  ngOnInit() {
    console.log('Init');
    this.el.nativeElement.style.color = 'blue';
  }

  ngOnDestroy() {
    console.log('Destroyed');
  }
}
```

## Built-in Directives vs Custom

### Built-in Directives
- Provided by Angular
- Available in CommonModule
- Optimized and tested
- Cover common scenarios
- Examples: `*ngIf`, `*ngFor`, `[ngClass]`, `[ngStyle]`, `[(ngModel)]`

### Custom Directives
- Written by developers
- Domain-specific logic
- Reusable across components
- Can be packaged in libraries
- Examples: `[appHighlight]`, `[appTooltip]`, `[appClickOutside]`

## When to Use Each Type

### Use Structural Directives When:
- You need to add/remove elements from DOM
- Conditional rendering based on state
- Looping through collections
- Multiple branching scenarios

### Use Attribute Directives When:
- You want to change appearance (colors, sizes)
- Add behavior to existing elements
- Handle user interactions
- Modify element properties/attributes
- Share logic across multiple components

### Create Custom Directives When:
- Built-in directives don't meet needs
- Logic is reusable across components
- Want to abstract complex behavior
- Creating a library/package
- Need domain-specific functionality

## Key Differences Summary

| Feature | Structural | Attribute | Component |
|---------|-----------|-----------|-----------|
| DOM Modification | Adds/removes | Modifies | Has own template |
| Selector | Element, attribute | Attribute, class | Element |
| Syntax | `*directive` | `[directive]` | Custom tag |
| Template Required | Yes | No | Yes |
| Example | `*ngIf`, `*ngFor` | `[ngClass]`, `[ngStyle]` | `<app-comp>` |

## Best Practices

✅ **DO:**
- Use structural directives for DOM manipulation
- Use attribute directives for behavior/appearance
- Keep directives focused and single-purpose
- Document directive inputs and outputs
- Use TypeScript for type safety
- Test directives independently
- Follow Angular style guide

❌ **DON'T:**
- Mix multiple structural directives on one element
- Create overly complex directives
- Hard-code values in directives
- Forget to unsubscribe in ngOnDestroy
- Use component lifecycle hooks incorrectly
- Create custom directives for simple styling (use ngClass/ngStyle)

## Key Takeaways

- **Directives** are markers that tell Angular to do something with DOM elements
- **Structural directives** (`*ngIf`, `*ngFor`) modify DOM structure
- **Attribute directives** (`[ngClass]`, `[ngStyle]`) modify appearance/behavior
- **Components** are directives with templates
- Choose the right directive type for your use case
- Understand selector syntax and lifecycle
- Built-in directives cover most common scenarios
- Create custom directives for reusable logic
