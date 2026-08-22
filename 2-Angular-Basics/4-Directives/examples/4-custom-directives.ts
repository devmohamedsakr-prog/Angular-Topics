/**
 * Custom Directives Examples
 * Building custom @Directive with @Input, @Output, @HostListener, @HostBinding
 */

import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Renderer2 } from '@angular/core';

// ============================================================
// EXAMPLE 1: Simple Custom Directive
// ============================================================

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
}

// Usage: <div appHighlight>Content</div>

// ============================================================
// EXAMPLE 2: Custom Directive with @Input
// ============================================================

@Directive({
  selector: '[appCustomHighlight]'
})
export class CustomHighlightDirective {
  @Input() appCustomHighlight: string = 'yellow';
  @Input() textColor: string = 'black';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = this.appCustomHighlight;
    this.el.nativeElement.style.color = this.textColor;
  }
}

// Usage: <div [appCustomHighlight]="'red'" [textColor]="'white'">Content</div>

// ============================================================
// EXAMPLE 3: Custom Directive with @HostListener & @HostBinding
// ============================================================

@Directive({
  selector: '[appBorder]'
})
export class BorderDirective {
  @Input() borderColor: string = 'blue';
  @Input() borderWidth: number = 2;

  @HostBinding('style.border')
  get border(): string {
    return `${this.borderWidth}px solid ${this.borderColor}`;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.boxShadow = 'none';
  }

  constructor(private el: ElementRef) {}
}

// Usage: <div [appBorder] [borderColor]="'red'" [borderWidth]="3"></div>

// ============================================================
// EXAMPLE 4: Custom Directive with @Output
// ============================================================

@Directive({
  selector: '[appClickCounter]'
})
export class ClickCounterDirective {
  @Output() clickCount = new EventEmitter<number>();
  private count = 0;

  @HostListener('click')
  onClick() {
    this.count++;
    this.clickCount.emit(this.count);
  }
}

// Usage: <div appClickCounter (clickCount)="onCount($event)"></div>

// ============================================================
// EXAMPLE 5: Validation Directive
// ============================================================

@Directive({
  selector: '[appValidateEmail]'
})
export class ValidateEmailDirective {
  @Output() validation = new EventEmitter<boolean>();

  @HostListener('blur')
  onBlur() {
    const value = this.el.nativeElement.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    this.validation.emit(isValid);
  }

  constructor(private el: ElementRef) {}
}

// Usage: <input appValidateEmail (validation)="onValidation($event)" />

// ============================================================
// EXAMPLE 6: Tooltip Directive with ngOnInit
// ============================================================

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input() appTooltip: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltip: HTMLElement | null = null;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTooltip();
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private showTooltip() {
    if (!this.tooltip) {
      this.tooltip = this.renderer.createElement('div');
      this.renderer.addClass(this.tooltip, 'tooltip');
      this.renderer.setProperty(this.tooltip, 'innerText', this.appTooltip);
      this.renderer.appendChild(this.el.nativeElement, this.tooltip);
    }
    this.renderer.addClass(this.tooltip, 'show');
  }

  private hideTooltip() {
    if (this.tooltip) {
      this.renderer.removeClass(this.tooltip, 'show');
    }
  }
}

// Usage: <button [appTooltip]="'Help text'" tooltipPosition="top">Hover me</button>

// ============================================================
// EXAMPLE 7: Focus Trap Directive
// ============================================================

@Directive({
  selector: '[appFocusTrap]'
})
export class FocusTrapDirective {
  private focusableElements: HTMLElement[] = [];

  @HostListener('keydown.tab', ['$event'])
  onTab(event: KeyboardEvent) {
    const currentIndex = this.focusableElements.indexOf(document.activeElement as HTMLElement);
    
    if (event.shiftKey) {
      if (currentIndex === 0) {
        event.preventDefault();
        this.focusableElements[this.focusableElements.length - 1].focus();
      }
    } else {
      if (currentIndex === this.focusableElements.length - 1) {
        event.preventDefault();
        this.focusableElements[0].focus();
      }
    }
  }

  constructor(private el: ElementRef) {
    this.focusableElements = Array.from(
      this.el.nativeElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]')
    );
  }
}

// Usage: <div appFocusTrap>Focusable elements trapped here</div>

// ============================================================
// EXAMPLE 8: Disable Directive
// ============================================================

@Directive({
  selector: '[appDisable]'
})
export class DisableDirective {
  @Input() set appDisable(disabled: boolean) {
    if (disabled) {
      this.el.nativeElement.disabled = true;
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
    } else {
      this.el.nativeElement.disabled = false;
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// Usage: <button [appDisable]="isDisabled">Click me</button>

// ============================================================
// EXAMPLE 9: Debounce Click Directive
// ============================================================

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective {
  @Input() debounceTime: number = 500;
  @Output() debounceClick = new EventEmitter<MouseEvent>();

  private lastClickTime = 0;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const now = Date.now();
    if (now - this.lastClickTime >= this.debounceTime) {
      this.lastClickTime = now;
      this.debounceClick.emit(event);
    }
  }
}

// Usage: <button [debounceTime]="1000" (debounceClick)="onSubmit()">Submit</button>

// ============================================================
// EXAMPLE 10: Scroll Position Directive
// ============================================================

@Directive({
  selector: '[appScrollPosition]'
})
export class ScrollPositionDirective {
  @Output() scrollPosition = new EventEmitter<number>();

  @HostListener('scroll')
  onScroll() {
    const scrollTop = this.el.nativeElement.scrollTop;
    this.scrollPosition.emit(scrollTop);
  }

  constructor(private el: ElementRef) {}
}

// Usage: <div appScrollPosition (scrollPosition)="onScroll($event)" style="height: 300px; overflow-y: auto;">

// ============================================================
// EXAMPLE 11: Dynamic Style Directive
// ============================================================

@Directive({
  selector: '[appDynamicStyle]'
})
export class DynamicStyleDirective {
  @Input() set appDynamicStyle(styles: { [key: string]: string | number }) {
    Object.keys(styles).forEach(key => {
      this.renderer.setStyle(this.el.nativeElement, key, styles[key]);
    });
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// Usage: <div [appDynamicStyle]="{ 'color': 'red', 'font-size': '20px' }"></div>

// ============================================================
// EXAMPLE 12: Permission-Based Directive
// ============================================================

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  @Input() set appHasPermission(permission: string) {
    const hasPermission = this.checkPermission(permission);
    if (!hasPermission) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  private checkPermission(permission: string): boolean {
    // In real app, check against user permissions
    const userPermissions = ['read', 'write', 'delete'];
    return userPermissions.includes(permission);
  }
}

// Usage: <button [appHasPermission]="'delete'">Delete</button>

// ============================================================
// EXAMPLE 13: Input Formatter Directive
// ============================================================

@Directive({
  selector: '[appPhoneFormat]'
})
export class PhoneFormatDirective {
  @HostListener('input', ['$event'])
  onInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
      }
    }
    
    event.target.value = value;
  }

  constructor(private el: ElementRef) {}
}

// Usage: <input appPhoneFormat placeholder="Phone number" />

// ============================================================
// EXAMPLE 14: Directive Lifecycle
// ============================================================

@Directive({
  selector: '[appLifecycle]'
})
export class LifecycleDirective {
  constructor(private el: ElementRef) {
    console.log('Constructor called');
  }

  ngOnInit() {
    console.log('ngOnInit called');
  }

  ngOnChanges() {
    console.log('ngOnChanges called');
  }

  ngDoCheck() {
    console.log('ngDoCheck called');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called');
  }
}

// ============================================================
// Summary: Custom Directives
// ============================================================

/**
 * Key Concepts:
 *
 * @Directive Decorator:
 * - selector: CSS selector for directive
 * - Attribute: [appName]
 * - Element: app-name
 * - Class: .app-name
 *
 * ElementRef:
 * - Access to native DOM element
 * - el.nativeElement
 * - Use carefully, avoid direct manipulation
 *
 * Renderer2:
 * - Preferred over direct DOM manipulation
 * - renderer.setStyle()
 * - renderer.addClass()
 * - renderer.createElement()
 *
 * @Input:
 * - Pass data to directive
 * - Can use setters for logic
 * - @Input() set property(val) {}
 *
 * @Output:
 * - Emit events from directive
 * - new EventEmitter<T>()
 * - (directiveEvent)="handler()"
 *
 * @HostBinding:
 * - Bind to host element properties
 * - @HostBinding('style.color')
 * - @HostBinding('class.active')
 *
 * @HostListener:
 * - Listen to host element events
 * - @HostListener('click')
 * - @HostListener('keydown.enter')
 *
 * Best Practices:
 * ✅ Use Renderer2 instead of ElementRef
 * ✅ Keep directives focused
 * ✅ Document inputs/outputs
 * ✅ Clean up in ngOnDestroy
 * ✅ Use TypeScript for type safety
 * ✅ Handle edge cases
 * ✅ Test thoroughly
 */
