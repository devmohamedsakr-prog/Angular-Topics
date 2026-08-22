/**
 * Directive Basics Examples
 * Demonstrates @Directive decorator, selectors, and basic directive concepts
 */

import { Directive, ElementRef, Input, HostBinding, HostListener } from '@angular/core';

// ============================================================
// EXAMPLE 1: Element Selector Directive
// ============================================================

@Directive({
  selector: 'app-highlight'
})
export class HighlightElementDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
  }
}

// Usage: <app-highlight>Content</app-highlight>

// ============================================================
// EXAMPLE 2: Attribute Selector Directive
// ============================================================

@Directive({
  selector: '[appHighlight]'
})
export class HighlightAttributeDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
    el.nativeElement.style.padding = '10px';
  }
}

// Usage: <div appHighlight>Content</div>

// ============================================================
// EXAMPLE 3: Class Selector Directive
// ============================================================

@Directive({
  selector: '.app-highlight'
})
export class HighlightClassDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'lightblue';
  }
}

// Usage: <div class="app-highlight">Content</div>

// ============================================================
// EXAMPLE 4: Directive with @Input
// ============================================================

@Directive({
  selector: '[appColor]'
})
export class ColorDirective {
  @Input() appColor: string = 'yellow';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = this.appColor;
  }
}

// Usage: <div [appColor]="'red'">Content</div>

// ============================================================
// EXAMPLE 5: Directive with @HostBinding
// ============================================================

@Directive({
  selector: '[appAppearance]'
})
export class AppearanceDirective {
  @Input() highlight = false;
  @Input() padding = 10;

  @HostBinding('style.backgroundColor')
  get backgroundColor(): string {
    return this.highlight ? 'yellow' : 'transparent';
  }

  @HostBinding('style.padding.px')
  get paddingValue(): number {
    return this.padding;
  }

  @HostBinding('class.highlighted')
  get isHighlighted(): boolean {
    return this.highlight;
  }
}

// Usage: <div [appAppearance] [highlight]="true" [padding]="20"></div>

// ============================================================
// EXAMPLE 6: Directive with @HostListener
// ============================================================

@Directive({
  selector: '[appClickable]'
})
export class ClickableDirective {
  clickCount = 0;

  @HostListener('click')
  onClick() {
    this.clickCount++;
    console.log(`Clicked ${this.clickCount} times`);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    console.log('Mouse entered');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    console.log('Mouse left');
  }
}

// Usage: <div appClickable>Click me</div>

// ============================================================
// EXAMPLE 7: Directive with Multiple Hosts
// ============================================================

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective {
  @Input() disabled = false;

  @HostBinding('style.opacity')
  get opacity(): number {
    return this.disabled ? 0.5 : 1;
  }

  @HostBinding('style.cursor')
  get cursor(): string {
    return this.disabled ? 'not-allowed' : 'pointer';
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

// Usage: <button appButton [disabled]="isDisabled">Submit</button>

// ============================================================
// EXAMPLE 8: Simple Logging Directive
// ============================================================

@Directive({
  selector: '[appLog]'
})
export class LogDirective {
  @Input() appLog: string = 'Element';

  constructor() {
    console.log(`${this.appLog} created`);
  }

  ngOnInit() {
    console.log(`${this.appLog} initialized`);
  }

  ngOnDestroy() {
    console.log(`${this.appLog} destroyed`);
  }
}

// Usage: <div appLog="MyElement"></div>

// ============================================================
// EXAMPLE 9: Focus Directive
// ============================================================

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.el.nativeElement.focus) {
      this.el.nativeElement.focus();
    }
  }
}

// Usage: <input appAutoFocus />

// ============================================================
// EXAMPLE 10: Directive Selector Variations
// ============================================================

// Attribute selector
@Directive({
  selector: '[appAttribute]'
})
export class AttributeSelectorDirective {}

// Element selector
@Directive({
  selector: 'app-element'
})
export class ElementSelectorDirective {}

// Class selector
@Directive({
  selector: '.app-class'
})
export class ClassSelectorDirective {}

// Multiple selectors
@Directive({
  selector: '[appMulti], .app-multi, app-multi'
})
export class MultiSelectorDirective {}

// Attribute with value
@Directive({
  selector: '[appValue="test"]'
})
export class ValueSelectorDirective {}

// ============================================================
// Summary: Directive Basics
// ============================================================

/**
 * Key Concepts Demonstrated:
 *
 * 1. @Directive Decorator
 *    - Marks a class as a directive
 *    - Requires selector property
 *
 * 2. Selector Types
 *    - Element: selector: 'app-element'
 *    - Attribute: selector: '[appAttribute]'
 *    - Class: selector: '.app-class'
 *
 * 3. ElementRef
 *    - Access to native DOM element
 *    - Use el.nativeElement to manipulate DOM
 *
 * 4. @Input
 *    - Pass data to directive
 *    - @Input() propertyName: type
 *
 * 5. @HostBinding
 *    - Bind to host element properties
 *    - @HostBinding('property') get/set
 *
 * 6. @HostListener
 *    - Listen to host element events
 *    - @HostListener('event') method()
 *
 * 7. Lifecycle Hooks
 *    - ngOnInit - after initialization
 *    - ngAfterViewInit - after view init
 *    - ngOnDestroy - before destruction
 *
 * Best Practices:
 * ✅ Keep directives focused
 * ✅ Use meaningful names
 * ✅ Document with comments
 * ✅ Use TypeScript for type safety
 * ✅ Handle cleanup in ngOnDestroy
 * ✅ Use @HostBinding for styling
 * ✅ Use @HostListener for events
 */
