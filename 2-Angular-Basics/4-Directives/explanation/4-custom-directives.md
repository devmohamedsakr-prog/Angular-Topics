# Creating Custom Directives

## Why Create Custom Directives?

Custom directives let you encapsulate reusable behaviors and apply them to any element. They're useful for:
- Domain-specific logic
- Reusable component behaviors
- Cross-cutting concerns
- Abstracting complex DOM operations
- Creating libraries

---

## Basic Custom Directive Structure

```typescript
import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appMyDirective]'
})
export class MyDirective {
  constructor(private el: ElementRef) {
    // el.nativeElement gives access to DOM
  }
}
```

---

## Example 1: Highlight Directive

```typescript
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';  // Default color

  constructor(private el: ElementRef) {
    this.setHighlight();
  }

  private setHighlight() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }

  ngOnInit() {
    this.setHighlight();
  }
}
```

**Usage:**
```html
<!-- Default highlight (yellow) -->
<p appHighlight>Highlighted text</p>

<!-- Custom color -->
<p [appHighlight]="'red'">Red highlight</p>
<p appHighlight="'blue'">Blue highlight</p>
```

---

## Example 2: Tooltip Directive

```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input() appTooltip = '';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip() {
    const tooltip = document.createElement('div');
    tooltip.textContent = this.appTooltip;
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
    
    const rect = this.el.nativeElement.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 30) + 'px';
  }

  private hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
  }
}
```

**Usage:**
```html
<button appTooltip="Click to submit">Submit</button>
<a appTooltip="Go to home page">Home</a>
```

---

## Example 3: Click Outside Directive

```typescript
import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.isInside(event.target as HTMLElement)) {
      this.clickOutside.emit();
    }
  }

  private isInside(element: HTMLElement): boolean {
    return element.closest('[appClickOutside]') !== null;
  }
}
```

**Usage:**
```html
<div appClickOutside (clickOutside)="onClickOutside()">
  Click outside to close
</div>
```

---

## Example 4: Directive with Input & Output

```typescript
import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appButtonLoading]'
})
export class ButtonLoadingDirective {
  @Input() isLoading = false;
  @Output() clicked = new EventEmitter<void>();

  @HostListener('click')
  onClick() {
    if (!this.isLoading) {
      this.clicked.emit();
    }
  }

  @HostListener('class', ['$event'])
  setClass() {
    if (this.isLoading) {
      // Disable button while loading
      (this as any).disabled = true;
    } else {
      (this as any).disabled = false;
    }
  }
}
```

**Usage:**
```html
<button [appButtonLoading]="isLoading" (clicked)="onSubmit()">
  {{ isLoading ? 'Loading...' : 'Submit' }}
</button>
```

---

## Example 5: Directive with Dependency Injection

```typescript
import { Directive, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimInput]'
})
export class TrimInputDirective implements OnInit {
  constructor(private control: NgControl) {}

  ngOnInit() {
    if (this.control && this.control.control) {
      this.control.control.valueChanges.subscribe(value => {
        const trimmed = value?.trim?.() || '';
        if (trimmed !== value) {
          this.control.control.setValue(trimmed);
        }
      });
    }
  }
}
```

**Usage:**
```html
<input appTrimInput [(ngModel)]="username" />
```

---

## Directive Lifecycle Hooks

```typescript
import { Directive, OnInit, OnDestroy, DoCheck, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appLifecycle]'
})
export class LifecycleDirective implements OnInit, OnDestroy, DoCheck, OnChanges {
  constructor() {
    console.log('Constructor');
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }

  ngDoCheck() {
    console.log('ngDoCheck');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
  }
}
```

---

## @HostListener and @HostBinding

### @HostListener - Listen to Events

```typescript
@Directive({
  selector: '[appClickCount]'
})
export class ClickCountDirective {
  clicks = 0;

  @HostListener('click')
  onClick() {
    this.clicks++;
    console.log(`Clicked ${this.clicks} times`);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    console.log('Mouse entered');
  }

  @HostListener('keydown.enter')
  onEnterKey() {
    console.log('Enter pressed');
  }
}
```

### @HostBinding - Modify Host Element

```typescript
import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  @HostBinding('style.backgroundColor')
  backgroundColor: string;

  @HostBinding('style.cursor')
  cursor = 'pointer';

  @HostBinding('class.highlight')
  isHighlighted = true;

  ngOnInit() {
    this.backgroundColor = this.appHighlight;
  }
}
```

---

## Directive with @Input @Output

```typescript
import { Directive, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective {
  @Input() minLength = 0;
  @Input() maxLength = 100;
  @Output() isValid = new EventEmitter<boolean>();

  validate(value: string): boolean {
    const valid = value.length >= this.minLength && value.length <= this.maxLength;
    this.isValid.emit(valid);
    return valid;
  }
}
```

---

## Common Directive Patterns

### Conditional Directive

```typescript
@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {}

  @Input()
  set appUnless(condition: boolean) {
    if (!condition) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

**Usage:**
```html
<!-- Show when condition is false (opposite of *ngIf) -->
<div *appUnless="hasPermission">
  Access denied
</div>
```

---

## Best Practices

✅ **DO:**
- Keep directives focused and single-purpose
- Use @Input for configuration
- Use @Output for events
- Document your directive
- Follow naming conventions (app prefix)
- Use lifecycle hooks appropriately
- Test directives independently
- Handle cleanup in ngOnDestroy

❌ **DON'T:**
- Create overly complex directives
- Directly manipulate DOM (use @HostBinding)
- Forget to unsubscribe
- Create too many @Inputs/@Outputs
- Use directives for styling (use [ngClass])
- Hard-code values
- Export private helpers

---

## Key Takeaways

- Directives encapsulate reusable behaviors
- Use `@Directive` decorator
- Selector determines how to use directive
- `@Input` for configuration
- `@Output` for events
- `@HostListener` for event listening
- `@HostBinding` for host element binding
- Follow Angular style guide
- Keep directives simple and focused
