# Angular Directives - Deep Dive

## What are Directives?

Directives are markers on a DOM element that tell Angular to do something to that element or its children. Angular ships with a set of built-in directives like NgIf, NgFor, and NgClass.

## Types of Directives

### 1. Structural Directives

Modify the DOM structure by adding/removing elements.

#### *ngIf

```typescript
// Component
export class MyComponent {
  isVisible = true;
  user: any = { name: 'John' };

  toggle() {
    this.isVisible = !this.isVisible;
  }
}

// Template
<div *ngIf="isVisible">This is visible</div>

<!-- With else -->
<div *ngIf="user; else noUser">
  Welcome {{ user.name }}
</div>
<ng-template #noUser>
  <p>Please log in</p>
</ng-template>

<!-- With then and else -->
<div *ngIf="isVisible; then visibleBlock; else hiddenBlock"></div>
<ng-template #visibleBlock>
  <p>Visible</p>
</ng-template>
<ng-template #hiddenBlock>
  <p>Hidden</p>
</ng-template>
```

#### *ngFor

```typescript
// Component
export class ListComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}

// Template - basic
<ul>
  <li *ngFor="let item of items">
    {{ item.name }}
  </li>
</ul>

<!-- With index -->
<ul>
  <li *ngFor="let item of items; let i = index">
    {{ i }}: {{ item.name }}
  </li>
</ul>

<!-- With first and last -->
<ul>
  <li *ngFor="let item of items; let first = first; let last = last"
      [class.first]="first" [class.last]="last">
    {{ item.name }}
  </li>
</ul>

<!-- With even and odd -->
<ul>
  <li *ngFor="let item of items; let even = even; let odd = odd"
      [class.even]="even" [class.odd]="odd">
    {{ item.name }}
  </li>
</ul>

<!-- With trackBy (performance optimization) -->
<ul>
  <li *ngFor="let item of items; trackBy: trackByFn">
    {{ item.name }}
  </li>
</ul>

<!-- Nested *ngFor -->
<div *ngFor="let group of groups">
  <h3>{{ group.title }}</h3>
  <ul>
    <li *ngFor="let item of group.items">
      {{ item.name }}
    </li>
  </ul>
</div>
```

#### *ngSwitch

```typescript
// Component
export class StatusComponent {
  status: 'active' | 'inactive' | 'pending' = 'active';
}

// Template
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">
    <span class="badge badge-success">Active</span>
  </div>
  <div *ngSwitchCase="'inactive'">
    <span class="badge badge-danger">Inactive</span>
  </div>
  <div *ngSwitchCase="'pending'">
    <span class="badge badge-warning">Pending</span>
  </div>
  <div *ngSwitchDefault>
    <span class="badge badge-secondary">Unknown</span>
  </div>
</div>
```

### 2. Attribute Directives

Modify appearance or behavior of elements without changing DOM structure.

#### Built-in Attribute Directives

```typescript
// Component
export class StyleComponent {
  isActive = true;
  isBold = false;
  fontSize = '16px';
  classes = 'container active';
  styles = {
    color: 'blue',
    'font-size': '18px'
  };
  classMap = {
    active: this.isActive,
    bold: this.isBold
  };
}

// ngClass - add/remove CSS classes
<div [ngClass]="'active'">Single class</div>
<div [ngClass]="['active', 'highlight']">Multiple classes</div>
<div [ngClass]="{ active: isActive, bold: isBold }">Object form</div>
<div [ngClass]="classMap">Dynamic object</div>

// ngStyle - set inline styles
<div [ngStyle]="{ color: 'red', 'font-size': '20px' }">Red text</div>
<div [ngStyle]="styles">Dynamic styles</div>
<div [ngStyle]="{ 'background-color': isActive ? 'green' : 'gray' }">
  Conditional style
</div>

// ngModel - two-way binding
<input [(ngModel)]="text" />
<p>{{ text }}</p>

<!-- With validation -->
<input [(ngModel)]="email" name="email" #emailControl="ngModel" required />
<div *ngIf="emailControl.invalid && emailControl.touched">
  Email is required
</div>
```

### 3. Custom Directives

Create your own directives:

#### Attribute Directive

```typescript
import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

// Simple highlight directive
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight: string = 'yellow'; // Default highlight color

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(el.nativeElement, 'background-color', this.appHighlight);
  }
}

// Usage
<p appHighlight>Default yellow highlight</p>
<p [appHighlight]="'green'">Green highlight</p>

// Advanced highlight directive with hover
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight: string = 'yellow';
  @Input() highlightColor: string = 'blue';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight(this.highlightColor);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight(this.appHighlight);
  }

  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}

// Usage
<p [appHighlight]="'yellow'" [highlightColor]="'orange'">
  Yellow by default, orange on hover
</p>
```

#### Structural Directive

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

// Repeat directive - repeats element N times
@Directive({
  selector: '[appRepeat]'
})
export class RepeatDirective {
  @Input() set appRepeat(times: number) {
    this.viewContainer.clear();
    for (let i = 0; i < times; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}

// Usage
<p *appRepeat="3">This repeats 3 times</p>

// If-else directive
@Directive({
  selector: '[appIfElse]'
})
export class IfElseDirective {
  private hasView = false;

  @Input() set appIfElse(condition: boolean) {
    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  @Input() set appIfElseElse(templateRef: TemplateRef<any>) {
    this.elseTemplateRef = templateRef;
  }

  private elseTemplateRef: TemplateRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}

// Usage
<div *appIfElse="isVisible; else: notVisible">
  Visible content
</div>
<ng-template #notVisible>
  Hidden content
</ng-template>
```

## Directive Communication

### Sharing Data with Directives

```typescript
@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input() appTooltip: string; // Tooltip text
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @HostListener('mouseenter')
  showTooltip() {
    console.log(`Showing: ${this.appTooltip}`);
  }

  @HostListener('mouseleave')
  hideTooltip() {
    console.log('Hiding tooltip');
  }
}

// Usage
<button [appTooltip]="'Save changes'" tooltipPosition="top">
  Save
</button>
```

## Using HostBinding and HostListener

```typescript
@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {
  @HostBinding('class.focused') isFocused = false;
  @HostBinding('style.outline') outline = 'none';

  @HostListener('focus')
  onFocus() {
    this.isFocused = true;
    this.outline = '2px solid blue';
  }

  @HostListener('blur')
  onBlur() {
    this.isFocused = false;
    this.outline = 'none';
  }
}

// Usage
<input appFocus />
```

## Directive Best Practices

1. **Keep directives focused** - Do one thing well
2. **Use HostListener and HostBinding** - Better than direct DOM access
3. **Document inputs and outputs** - Make API clear
4. **Use Renderer2** - For DOM manipulation (safer than direct access)
5. **Test directives thoroughly** - They affect many elements
6. **Avoid side effects** - Keep directives pure where possible
7. **Use descriptive names** - Prefix with app (e.g., [appHighlight])

## Common Directive Patterns

### Click-outside Directive

```typescript
@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }

  constructor(private el: ElementRef) {}
}

// Usage
<div (appClickOutside)="onClickOutside()">
  Click outside to close
</div>
```

## Key Takeaways

- Directives are markers that tell Angular to do something to an element
- Structural directives (*ngIf, *ngFor, *ngSwitch) modify DOM structure
- Attribute directives (ngClass, ngStyle, ngModel) modify element behavior
- Custom directives extend Angular functionality
- Use Renderer2 for safe DOM manipulation
- Keep directives focused and testable
