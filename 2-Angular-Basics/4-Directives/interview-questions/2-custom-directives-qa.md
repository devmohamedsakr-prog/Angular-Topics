# Custom Directives - Interview Questions & Answers

## Q1: How do you create a custom directive from scratch?

**Answer:**
Creating a custom directive involves using the `@Directive` decorator, defining inputs/outputs, and implementing logic.

```typescript
// STEP 1: Import necessary modules
import { Directive, ElementRef, Input, HostBinding } from '@angular/core';

// STEP 2: Create the directive class with @Directive decorator
@Directive({
  selector: '[appCustom]'  // How it's used: <div appCustom></div>
})
export class CustomDirective {
  // STEP 3: Define inputs and outputs
  @Input() customColor: string = 'yellow';
  @Input() customPadding: number = 10;

  // STEP 4: Use @HostBinding for styling
  @HostBinding('style.backgroundColor')
  get bgColor(): string {
    return this.customColor;
  }

  @HostBinding('style.padding.px')
  get padding(): number {
    return this.customPadding;
  }

  // STEP 5: Inject ElementRef in constructor
  constructor(private el: ElementRef) {
    console.log('Directive applied to:', this.el.nativeElement);
  }

  // STEP 6: Implement lifecycle hooks if needed
  ngOnInit() {
    console.log('Custom directive initialized');
  }
}

// STEP 7: Register in module
@NgModule({
  declarations: [CustomDirective]
})
export class AppModule {}

// STEP 8: Use in component template
@Component({
  template: `
    <div [appCustom] 
         [customColor]="'blue'" 
         [customPadding]="20">
      Custom styled div
    </div>
  `
})
export class AppComponent {}
```

**Complete Example with Multiple Features:**
```typescript
@Directive({
  selector: '[appCard]'
})
export class CardDirective implements OnInit, OnChanges {
  @Input() cardTitle: string = 'Card';
  @Input() cardElevation: number = 4;
  @Input() isClickable: boolean = false;

  @Output() cardClicked = new EventEmitter<void>();

  @HostBinding('class.card')
  cardClass = true;

  @HostBinding('style.box-shadow')
  get boxShadow(): string {
    return `0 ${this.cardElevation}px ${this.cardElevation * 2}px rgba(0,0,0,0.2)`;
  }

  @HostBinding('style.cursor')
  get cursor(): string {
    return this.isClickable ? 'pointer' : 'default';
  }

  @HostListener('click')
  onClick() {
    if (this.isClickable) {
      this.cardClicked.emit();
    }
  }

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, `elevation-${this.cardElevation}`);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cardElevation']) {
      console.log('Elevation changed:', changes['cardElevation'].currentValue);
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
```

---

## Q2: What is the difference between `@HostListener` and `@HostBinding`?

**Answer:**
- **`@HostListener`**: Listens to events on the host element
- **`@HostBinding`**: Binds properties/classes/styles to the host element

```typescript
@Directive({
  selector: '[appInteractive]'
})
export class InteractiveDirective {
  isActive = false;

  // @HostBinding: One-way binding TO host element
  // Updates host element when property changes
  @HostBinding('class.active')
  get activeClass(): boolean {
    return this.isActive;
  }

  @HostBinding('style.backgroundColor')
  get bgColor(): string {
    return this.isActive ? 'blue' : 'transparent';
  }

  @HostBinding('style.color')
  get textColor(): string {
    return this.isActive ? 'white' : 'black';
  }

  @HostBinding('attr.data-active')
  get dataActive(): string {
    return this.isActive ? 'true' : 'false';
  }

  // @HostListener: Reacts to events FROM host element
  // Calls method when event occurs on host
  @HostListener('click')
  onClick() {
    this.isActive = !this.isActive;
    console.log('Active:', this.isActive);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.toggleHover(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.toggleHover(false);
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    console.log('Enter pressed');
  }

  private toggleHover(isHovering: boolean) {
    console.log('Hovering:', isHovering);
  }
}

// USAGE:
// <div appInteractive>Click me</div>
// When clicked, background turns blue and text turns white
// CSS class 'active' is added to the element
```

**Comparison Table:**

| Feature | @HostListener | @HostBinding |
|---------|---------------|--------------|
| Direction | Incoming (event → directive) | Outgoing (directive → element) |
| Listens to | Host element events | - |
| Binds to | - | Host element properties |
| Example | `@HostListener('click')` | `@HostBinding('style.color')` |
| Calls | Method | Getter/setter |
| Updates | Directive state | Host element DOM |

---

## Q3: How do you use `@Input` with setter logic in directives?

**Answer:**
Input setters allow you to execute code whenever an input property changes.

```typescript
@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective {
  private _minLength = 0;
  private _maxLength = 999;
  private _pattern: RegExp | null = null;
  private _isRequired = false;

  // Input with setter - executes code when value changes
  @Input()
  set minLength(value: number) {
    this._minLength = value;
    console.log('Min length set to:', value);
  }

  @Input()
  set maxLength(value: number) {
    this._maxLength = value;
  }

  @Input()
  set pattern(value: string | RegExp) {
    this._pattern = typeof value === 'string' ? new RegExp(value) : value;
  }

  @Input()
  set isRequired(value: boolean) {
    this._isRequired = value;
    this.updateUI();
  }

  @Output() validationError = new EventEmitter<string>();

  @HostListener('blur')
  onBlur() {
    this.validate();
  }

  private validate() {
    const value = this.el.nativeElement.value;

    // Check required
    if (this._isRequired && !value) {
      this.validationError.emit('Field is required');
      return;
    }

    // Check length
    if (value.length < this._minLength) {
      this.validationError.emit(`Minimum ${this._minLength} characters required`);
      return;
    }

    if (value.length > this._maxLength) {
      this.validationError.emit(`Maximum ${this._maxLength} characters allowed`);
      return;
    }

    // Check pattern
    if (this._pattern && !this._pattern.test(value)) {
      this.validationError.emit('Invalid format');
      return;
    }
  }

  private updateUI() {
    const required = this._isRequired ? '*' : '';
    this.renderer.setProperty(
      this.el.nativeElement,
      'placeholder',
      `Enter value${required}`
    );
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// USAGE:
@Component({
  template: `
    <input
      [appValidate]
      [minLength]="3"
      [maxLength]="20"
      [pattern]="'^[a-zA-Z]+$'"
      [isRequired]="true"
      (validationError)="onError($event)" />
  `
})
export class AppComponent {
  onError(error: string) {
    console.log('Validation error:', error);
  }
}
```

**Advanced Setter Pattern:**
```typescript
@Directive({
  selector: '[appTheme]'
})
export class ThemeDirective {
  @Input()
  set appTheme(theme: string) {
    this.applyTheme(theme);
  }

  private applyTheme(theme: string) {
    // Remove old theme classes
    this.renderer.removeClass(this.el.nativeElement, 'theme-light');
    this.renderer.removeClass(this.el.nativeElement, 'theme-dark');
    this.renderer.removeClass(this.el.nativeElement, 'theme-auto');

    // Add new theme class
    this.renderer.addClass(this.el.nativeElement, `theme-${theme}`);

    // Additional logic
    if (theme === 'dark') {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#333');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
```

---

## Q4: Explain `@HostListener` with event modifiers and `$event`.

**Answer:**
`@HostListener` can listen to specific events and pass event data using `$event`.

```typescript
@Directive({
  selector: '[appKeyboard]'
})
export class KeyboardDirective {
  @Output() keyPressed = new EventEmitter<string>();
  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() submitted = new EventEmitter<void>();

  // Listen to click event
  @HostListener('click')
  onClick() {
    console.log('Element clicked');
  }

  // Listen to click and pass event
  @HostListener('click', ['$event'])
  onClickWithEvent(event: MouseEvent) {
    this.clicked.emit(event);
    console.log('Clicked at:', event.clientX, event.clientY);
  }

  // Keyboard events
  @HostListener('keydown.enter')
  onEnter() {
    this.submitted.emit();
  }

  @HostListener('keydown.escape')
  onEscape() {
    console.log('Escape pressed');
  }

  @HostListener('keydown.space')
  onSpace() {
    console.log('Space pressed');
  }

  // Keyboard with modifier
  @HostListener('keydown.ctrl.a')
  onCtrlA() {
    console.log('Ctrl+A pressed');
  }

  @HostListener('keydown.shift.enter')
  onShiftEnter() {
    console.log('Shift+Enter pressed');
  }

  // Generic key event
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    this.keyPressed.emit(key);
    console.log('Key pressed:', key);
  }

  // Mouse events
  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    console.log('Mouse entered');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    console.log('Mouse at:', event.clientX, event.clientY);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    console.log('Mouse released');
  }

  // Scroll event
  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    console.log('Scrolled to:', scrollTop);
  }

  // Input/Focus events
  @HostListener('focus')
  onFocus() {
    console.log('Element focused');
  }

  @HostListener('blur')
  onBlur() {
    console.log('Element blurred');
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log('Input value:', value);
  }
}

// USAGE:
@Component({
  template: `
    <input
      appKeyboard
      (keyPressed)="onKey($event)"
      (clicked)="onClick($event)"
      (submitted)="onSubmit()" />
  `
})
export class AppComponent {
  onKey(key: string) {
    console.log('Key:', key);
  }

  onClick(event: MouseEvent) {
    console.log('Click:', event);
  }

  onSubmit() {
    console.log('Submitted');
  }
}
```

**Event Modifier Syntax:**
```
keydown.enter      // Enter key
keydown.escape     // Escape key
keydown.space      // Space key
keydown.ctrl       // Ctrl key
keydown.shift      // Shift key
keydown.alt        // Alt key
keydown.meta       // Command/Windows key

mouseenter         // Mouse enters
mouseleave         // Mouse leaves
mousemove          // Mouse moves
mousedown          // Mouse pressed
mouseup            // Mouse released

focus              // Element focused
blur               // Element blurred
input              // Input value changed
change             // Value changed (form)

scroll             // Scroll event
```

---

## Q5: How do you create a reusable tooltip directive?

**Answer:**
A tooltip directive dynamically creates and shows tooltip content on hover.

```typescript
@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input() appTooltip: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipDelay: number = 200;
  @Input() tooltipBgColor: string = 'rgba(0, 0, 0, 0.8)';
  @Input() tooltipTextColor: string = 'white';

  private tooltipElement: HTMLElement | null = null;
  private showTimeout: any;
  private hideTimeout: any;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    clearTimeout(this.showTimeout);
    this.hide();
  }

  @HostListener('click')
  onClick() {
    this.hide();
  }

  ngOnInit() {
    this.createTooltip();
  }

  ngOnDestroy() {
    this.destroyTooltip();
  }

  private createTooltip() {
    this.tooltipElement = this.renderer.createElement('div');
    
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'background-color', this.tooltipBgColor);
    this.renderer.setStyle(this.tooltipElement, 'color', this.tooltipTextColor);
    this.renderer.setStyle(this.tooltipElement, 'padding', '8px 12px');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '12px');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '9999');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s');

    this.renderer.setProperty(this.tooltipElement, 'innerText', this.appTooltip);
    this.renderer.appendChild(document.body, this.tooltipElement);
  }

  private show() {
    if (!this.tooltipElement) return;

    this.positionTooltip();
    this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
  }

  private hide() {
    if (!this.tooltipElement) return;

    this.hideTimeout = setTimeout(() => {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    }, 100);
  }

  private positionTooltip() {
    if (!this.tooltipElement) return;

    const hostElement = this.el.nativeElement;
    const rect = hostElement.getBoundingClientRect();
    let left = rect.left;
    let top = rect.top;

    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const gap = 5;

    switch (this.tooltipPosition) {
      case 'top':
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        top = rect.top - tooltipRect.height - gap;
        break;
      case 'bottom':
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        top = rect.bottom + gap;
        break;
      case 'left':
        left = rect.left - tooltipRect.width - gap;
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        left = rect.right + gap;
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
    }

    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
  }

  private destroyTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
    clearTimeout(this.showTimeout);
    clearTimeout(this.hideTimeout);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// USAGE:
@Component({
  template: `
    <button
      [appTooltip]="'This is a helpful tooltip'"
      tooltipPosition="top"
      [tooltipDelay]="300">
      Hover me
    </button>

    <button
      [appTooltip]="'Delete this item?'"
      tooltipPosition="right"
      [tooltipBgColor]="'red'"
      [tooltipTextColor]="'white'">
      Delete
    </button>
  `
})
export class AppComponent {}
```

---

## Q6: How do you create a directive for form validation?

**Answer:**
A validation directive can check input validity and display error messages.

```typescript
@Directive({
  selector: '[appValidate]',
  exportAs: 'appValidate'
})
export class ValidateDirective {
  @Input() validationType: 'email' | 'phone' | 'date' | 'number' = 'email';
  @Input() customPattern?: RegExp;
  @Input() required: boolean = false;
  @Input() minLength?: number;
  @Input() maxLength?: number;

  @Output() validationChange = new EventEmitter<{
    valid: boolean;
    errors: string[];
  }>();

  private patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9-+().\s]{10,}$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    number: /^-?[0-9]*\.?[0-9]+$/
  };

  @HostListener('blur')
  onBlur() {
    this.validate();
  }

  @HostListener('input')
  onInput() {
    this.validate();
  }

  private validate() {
    const value = this.el.nativeElement.value;
    const errors: string[] = [];
    let isValid = true;

    // Check required
    if (this.required && !value) {
      errors.push('This field is required');
      isValid = false;
    }

    if (value) {
      // Check min length
      if (this.minLength && value.length < this.minLength) {
        errors.push(`Minimum ${this.minLength} characters required`);
        isValid = false;
      }

      // Check max length
      if (this.maxLength && value.length > this.maxLength) {
        errors.push(`Maximum ${this.maxLength} characters allowed`);
        isValid = false;
      }

      // Check pattern
      const pattern = this.customPattern || this.patterns[this.validationType];
      if (!pattern.test(value)) {
        errors.push(`Invalid ${this.validationType} format`);
        isValid = false;
      }
    }

    // Update UI
    this.updateValidationUI(isValid, errors);
    this.validationChange.emit({ valid: isValid, errors });
  }

  private updateValidationUI(isValid: boolean, errors: string[]) {
    if (!isValid) {
      this.renderer.addClass(this.el.nativeElement, 'ng-invalid');
      this.renderer.removeClass(this.el.nativeElement, 'ng-valid');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'ng-invalid');
      this.renderer.addClass(this.el.nativeElement, 'ng-valid');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// USAGE:
@Component({
  template: `
    <div>
      <input
        [appValidate]="'email'"
        #emailValidation="appValidate"
        required
        (validationChange)="onValidationChange($event)"
        placeholder="Email" />
      
      <div *ngIf="validationError" class="error">
        {{ validationError }}
      </div>
    </div>
  `,
  styles: [`
    .error { color: red; font-size: 12px; }
    .ng-invalid { border: 1px solid red; }
    .ng-valid { border: 1px solid green; }
  `]
})
export class AppComponent {
  validationError = '';

  onValidationChange(result: any) {
    this.validationError = result.errors[0] || '';
  }
}
```

---

## Q7: How do you combine multiple directives on one element?

**Answer:**
You can apply multiple directives to a single element - they work together.

```typescript
// Multiple directives on single element
@Component({
  template: `
    <input
      appSearchInput
      appValidate="email"
      appDebounce="300"
      appHighlight="yellow"
      [pattern]="emailPattern"
      (search)="onSearch($event)"
      (validationChange)="onValidation($event)"
      (debounceClick)="onDebounce()"
      placeholder="Search..." />
  `
})
export class AppComponent {
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  onSearch(query: string) {
    console.log('Search:', query);
  }

  onValidation(result: any) {
    console.log('Validation:', result);
  }

  onDebounce() {
    console.log('Debounced');
  }
}

// Order matters sometimes - more specific directives should be listed first
// All directives are applied left to right
```

---

## Q8: What is directive exportAs and when do you use it?

**Answer:**
`exportAs` exposes a directive instance as a template variable so you can access its properties and methods.

```typescript
@Directive({
  selector: '[appCounter]',
  exportAs: 'appCounter'  // Export directive instance
})
export class CounterDirective {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  reset() {
    this.count = 0;
  }
}

// USAGE: Access directive via template reference
@Component({
  template: `
    <div
      appCounter
      #counter="appCounter">
      <p>Count: {{ counter.count }}</p>
      <button (click)="counter.increment()">+</button>
      <button (click)="counter.decrement()">-</button>
      <button (click)="counter.reset()">Reset</button>
    </div>
  `
})
export class AppComponent {}

// REAL-WORLD EXAMPLE: Form validation directive
@Directive({
  selector: '[appForm]',
  exportAs: 'form'
})
export class FormDirective {
  @Input() fields: any[] = [];

  isValid(): boolean {
    return this.fields.every(f => f.valid);
  }

  getErrors(): any[] {
    return this.fields.filter(f => !f.valid);
  }

  submit() {
    if (this.isValid()) {
      console.log('Form submitted');
    }
  }
}

@Component({
  template: `
    <form appForm #myForm="form">
      <input appValidate="email" />
      <input appValidate="phone" />
      
      <button 
        [disabled]="!myForm.isValid()"
        (click)="myForm.submit()">
        Submit
      </button>
      
      <div *ngIf="!myForm.isValid()">
        <p *ngFor="let error of myForm.getErrors()">
          {{ error }}
        </p>
      </div>
    </form>
  `
})
export class AppComponent {}
```

---

## Q9: How do you prevent memory leaks in directives?

**Answer:**
Always clean up subscriptions and event listeners in `ngOnDestroy`.

```typescript
@Directive({
  selector: '[appRxjs]'
})
export class RxjsDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Subscribe with takeUntil for automatic cleanup
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data);
      });

    // Manual event listener
    this.el.nativeElement.addEventListener('click', this.clickHandler);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    // Remove event listeners
    this.el.nativeElement.removeEventListener('click', this.clickHandler);
  }

  private clickHandler = () => {
    console.log('Clicked');
  };

  constructor(private el: ElementRef, private dataService: any) {}
}

// ANTI-PATTERN: Memory leak
@Directive({
  selector: '[appBad]'
})
export class BadDirective implements OnInit {
  ngOnInit() {
    // ❌ No cleanup - memory leak
    this.dataService.getData().subscribe(data => {
      console.log(data);
    });

    // ❌ Event listener not removed
    this.el.nativeElement.addEventListener('click', () => {
      console.log('Clicked');
    });
  }

  constructor(private el: ElementRef, private dataService: any) {}
}
```

---

## Summary Table

| Feature | Purpose | Example |
|---------|---------|---------|
| @Input | Receive data | `@Input() color: string` |
| @Output | Emit events | `@Output() clicked = new EventEmitter()` |
| @HostListener | Listen to events | `@HostListener('click')` |
| @HostBinding | Bind to host | `@HostBinding('style.color')` |
| @Input setter | React to changes | `@Input() set value(v) { }` |
| exportAs | Export instance | `exportAs: 'myDirective'` |
| Renderer2 | Safe DOM access | `this.renderer.setStyle()` |
| ngOnDestroy | Cleanup | `ngOnDestroy() { }` |

## Key Takeaways

✅ Always use `Renderer2` instead of direct `ElementRef` access
✅ Use `@HostListener` for events, `@HostBinding` for properties
✅ Implement `ngOnDestroy` and clean up subscriptions
✅ Use `takeUntil(destroy$)` for RxJS subscriptions
✅ Export directives with `exportAs` for template access
✅ Combine multiple directives on single elements
✅ Test directives thoroughly
