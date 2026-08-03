/**
 * Angular Directives - Complete Examples
 * Demonstrates structural directives, attribute directives, and custom directives
 */

import {
  Directive,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  Renderer2,
  HostListener,
  HostBinding,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Structural Directives (Built-in)
// ============================================================================

/**
 * ngIf - conditionally render elements
 */
@Component({
  selector: 'app-ngif-example',
  template: `
    <div *ngIf="isVisible">This is visible</div>
    <div *ngIf="!isVisible">This is hidden</div>
    <div *ngIf="isLoading; else loaded">Loading...</div>
    <ng-template #loaded>
      <div>Content loaded</div>
    </ng-template>
  `,
})
export class NgIfExampleComponent {
  isVisible = true;
  isLoading = false;
}

/**
 * ngFor - repeat elements for array
 */
@Component({
  selector: 'app-ngfor-example',
  template: `
    <ul>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
    <ul>
      <li *ngFor="let item of items; let i = index">{{ i }}: {{ item }}</li>
    </ul>
    <ul>
      <li *ngFor="let item of items; let first = first; let last = last">
        <span *ngIf="first" class="border">{{ item }}</span>
        <span *ngIf="!first && !last">{{ item }}</span>
        <span *ngIf="last" class="border">{{ item }}</span>
      </li>
    </ul>
    <ul>
      <li *ngFor="let item of items; trackBy: trackByFn">{{ item }}</li>
    </ul>
  `,
})
export class NgForExampleComponent {
  items = ['Item 1', 'Item 2', 'Item 3'];

  trackByFn(index: number, item: string): number {
    return index;
  }
}

/**
 * ngSwitch - conditional rendering
 */
@Component({
  selector: 'app-ngswitch-example',
  template: `
    <div [ngSwitch]="selectedValue">
      <p *ngSwitchCase="'a'">Option A selected</p>
      <p *ngSwitchCase="'b'">Option B selected</p>
      <p *ngSwitchCase="'c'">Option C selected</p>
      <p *ngSwitchDefault>Default option</p>
    </div>
  `,
})
export class NgSwitchExampleComponent {
  selectedValue = 'b';
}

// ============================================================================
// EXAMPLE 2: Attribute Directives (Built-in)
// ============================================================================

/**
 * ngClass - conditionally add CSS classes
 */
@Component({
  selector: 'app-ngclass-example',
  template: `
    <div [ngClass]="'my-class'">String class</div>
    <div [ngClass]="['class1', 'class2']">Array of classes</div>
    <div [ngClass]="classObject">Object of classes</div>
    <div [class.active]="isActive">Active when true</div>
  `,
  styles: [
    `
      .my-class {
        color: blue;
      }
      .class1 {
        font-weight: bold;
      }
      .class2 {
        font-size: 16px;
      }
      .active {
        background: yellow;
      }
    `,
  ],
})
export class NgClassExampleComponent {
  isActive = true;
  classObject = {
    'class1': true,
    'class2': false,
    'class3': true,
  };
}

/**
 * ngStyle - conditionally add inline styles
 */
@Component({
  selector: 'app-ngstyle-example',
  template: `
    <div [ngStyle]="{ color: textColor, fontSize: fontSize + 'px' }">
      Styled div
    </div>
    <div [ngStyle]="styleObject">Object styles</div>
    <div [style.color]="'red'" [style.fontSize.px]="20">
      Individual styles
    </div>
  `,
})
export class NgStyleExampleComponent {
  textColor = 'green';
  fontSize = 18;
  styleObject = {
    backgroundColor: 'lightblue',
    padding: '10px',
    borderRadius: '5px',
  };
}

// ============================================================================
// EXAMPLE 3: Custom Attribute Directives
// ============================================================================

/**
 * Highlight directive - change background color on hover
 */
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @Input() appHighlight = 'yellow'; // Default color

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.appHighlight);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', 'transparent');
  }
}

/**
 * Usage
 */
@Component({
  selector: 'app-highlight-example',
  template: `
    <p appHighlight>Hover me - default yellow</p>
    <p appHighlight="lightblue">Hover me - light blue</p>
    <p appHighlight="lightgreen">Hover me - light green</p>
  `,
})
export class HighlightExampleComponent {}

/**
 * Validation message directive
 */
@Directive({
  selector: '[appValidationMessage]',
})
export class ValidationMessageDirective {
  @Input() set appValidationMessage(validationError: string | null) {
    if (validationError) {
      this.renderer.addClass(this.el.nativeElement, 'error');
      const message = this.renderer.createText(validationError);
      this.renderer.appendChild(this.el.nativeElement, message);
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

/**
 * Counter directive - count element clicks
 */
@Directive({
  selector: '[appCounter]',
})
export class CounterDirective {
  private clickCount = 0;

  @Output() appCounter = new EventEmitter<number>();

  @HostListener('click')
  onClick(): void {
    this.clickCount++;
    this.appCounter.emit(this.clickCount);
  }
}

/**
 * Usage
 */
@Component({
  selector: 'app-counter-example',
  template: `
    <button appCounter (appCounter)="onCount($event)">
      Clicked: {{ count }}
    </button>
  `,
})
export class CounterExampleComponent {
  count = 0;

  onCount(num: number): void {
    this.count = num;
  }
}

/**
 * Tooltip directive
 */
@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  private tooltip: HTMLElement | null = null;

  @Input() set appTooltip(message: string) {
    this.tooltipMessage = message;
  }

  private tooltipMessage = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltip) {
      this.tooltip = this.renderer.createElement('div');
      this.renderer.addClass(this.tooltip, 'tooltip');
      this.renderer.setProperty(this.tooltip, 'textContent', this.tooltipMessage);
      this.renderer.appendChild(document.body, this.tooltip);

      const rect = this.el.nativeElement.getBoundingClientRect();
      this.renderer.setStyle(this.tooltip, 'left', rect.left + 'px');
      this.renderer.setStyle(this.tooltip, 'top', rect.top - 30 + 'px');
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
  }
}

/**
 * Usage
 */
@Component({
  selector: 'app-tooltip-example',
  template: `
    <button appTooltip="Click to submit">Submit</button>
    <button appTooltip="Reset the form">Reset</button>
  `,
})
export class TooltipExampleComponent {}

// ============================================================================
// EXAMPLE 4: Custom Structural Directives
// ============================================================================

/**
 * *appUnless directive - opposite of *ngIf
 */
@Directive({
  selector: '[appUnless]',
})
export class UnlessDirective {
  private hasView = false;

  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}

/**
 * Usage
 */
@Component({
  selector: 'app-unless-example',
  template: `
    <div *appUnless="false">This is shown (unless false)</div>
    <div *appUnless="true">This is hidden (unless true)</div>
  `,
})
export class UnlessExampleComponent {}

/**
 * *appRepeat directive - repeat N times
 */
@Directive({
  selector: '[appRepeat]',
})
export class RepeatDirective {
  @Input() set appRepeat(count: number) {
    this.viewContainer.clear();
    for (let i = 0; i < count; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: i });
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}

/**
 * Usage
 */
@Component({
  selector: 'app-repeat-example',
  template: `
    <ul>
      <li *appRepeat="5; let i = $implicit">Item {{ i + 1 }}</li>
    </ul>
  `,
})
export class RepeatExampleComponent {}

/**
 * *appDebounce directive - debounce template rendering
 */
@Directive({
  selector: '[appDebounce]',
})
export class DebounceDirective implements OnInit, OnDestroy {
  private hasView = false;
  private subject = new Subject<boolean>();
  private destroy$ = new Subject<void>();

  @Input() set appDebounce(condition: boolean) {
    this.subject.next(condition);
  }

  @Input() debounceTime = 300;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    // Debounce emission
    this.subject
      .pipe(takeUntil(this.destroy$))
      .subscribe((condition) => {
        if (condition && !this.hasView) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        } else if (!condition && this.hasView) {
          this.viewContainer.clear();
          this.hasView = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 5: HostListener and HostBinding
// ============================================================================

/**
 * Host binding directive
 */
@Directive({
  selector: '[appActive]',
})
export class ActiveDirective {
  @HostBinding('class.active') isActive = false;
  @HostBinding('style.backgroundColor') bgColor = 'white';

  @HostListener('click')
  onClick(): void {
    this.isActive = !this.isActive;
    this.bgColor = this.isActive ? 'yellow' : 'white';
  }
}

/**
 * Usage
 */
@Component({
  selector: 'app-active-example',
  template: `<div appActive>Click to toggle active</div>`,
})
export class ActiveExampleComponent {}

/**
 * Keyboard shortcut directive
 */
@Directive({
  selector: '[appKeyboardShortcut]',
})
export class KeyboardShortcutDirective {
  @Input() appKeyboardShortcut = 'enter';

  @Output() keyboardEvent = new EventEmitter<KeyboardEvent>();

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === this.appKeyboardShortcut.toLowerCase()) {
      event.preventDefault();
      this.keyboardEvent.emit(event);
    }
  }
}

/**
 * Usage
 */
@Component({
  selector: 'app-keyboard-example',
  template: `
    <input
      appKeyboardShortcut="enter"
      (keyboardEvent)="onEnter($event)"
      placeholder="Press Enter"
    />
  `,
})
export class KeyboardExampleComponent {
  onEnter(event: KeyboardEvent): void {
    console.log('Enter pressed');
  }
}

// ============================================================================
// EXAMPLE 6: Directive with Dependency Injection
// ============================================================================

/**
 * Logger service
 */
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: string): void {
    console.log(`[Logger] ${message}`);
  }
}

/**
 * Directive using service
 */
@Directive({
  selector: '[appLogClick]',
})
export class LogClickDirective {
  @Input() appLogClick = 'Element clicked';

  @HostListener('click')
  onClick(): void {
    this.logger.log(this.appLogClick);
  }

  constructor(private logger: LoggerService) {}
}

/**
 * Usage
 */
@Component({
  selector: 'app-log-example',
  template: `
    <button appLogClick="Submit button clicked">Submit</button>
    <button appLogClick="Reset button clicked">Reset</button>
  `,
})
export class LogExampleComponent {}

// ============================================================================
// EXAMPLE 7: Complex Structural Directive - Virtual Scroll
// ============================================================================

/**
 * Virtual scroll directive - render only visible items
 */
@Directive({
  selector: '[appVirtualScroll]',
})
export class VirtualScrollDirective implements OnInit, OnDestroy {
  @Input() items: any[] = [];
  @Input() itemHeight = 50;
  @Input() visibleItems = 5;

  private visibleItemsSubject = new Subject<any[]>();
  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.renderVisibleItems(0);
  }

  private renderVisibleItems(startIndex: number): void {
    this.viewContainer.clear();
    const endIndex = Math.min(startIndex + this.visibleItems, this.items.length);

    for (let i = startIndex; i < endIndex; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, {
        $implicit: this.items[i],
        index: i,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 8: Directive with @ViewChild
// ============================================================================

/**
 * Focus directive - auto-focus input
 */
@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    setTimeout(() => {
      (this.el.nativeElement as HTMLElement).focus();
    }, 100);
  }
}

/**
 * Usage
 */
@Component({
  selector: 'app-autofocus-example',
  template: `<input appAutoFocus placeholder="Auto-focused" />`,
})
export class AutoFocusExampleComponent {}

// ============================================================================
// EXAMPLE 9: Accessibility Directive
// ============================================================================

/**
 * Accessibility directive - add ARIA attributes
 */
@Directive({
  selector: '[appAccessible]',
})
export class AccessibleDirective {
  @Input() set appAccessible(label: string) {
    this.renderer.setAttribute(this.el.nativeElement, 'aria-label', label);
    this.renderer.setAttribute(this.el.nativeElement, 'role', 'button');
    this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
  }

  @HostListener('keydown.enter')
  @HostListener('keydown.space')
  onKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    this.el.nativeElement.click();
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

/**
 * Usage
 */
@Component({
  selector: 'app-accessible-example',
  template: `<div appAccessible="Click me">Accessible button</div>`,
})
export class AccessibleExampleComponent {}

// ============================================================================
// EXAMPLE 10: Complete Directive Module
// ============================================================================

import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    HighlightDirective,
    ValidationMessageDirective,
    CounterDirective,
    TooltipDirective,
    UnlessDirective,
    RepeatDirective,
    DebounceDirective,
    ActiveDirective,
    KeyboardShortcutDirective,
    LogClickDirective,
    VirtualScrollDirective,
    AutoFocusDirective,
    AccessibleDirective,
  ],
  exports: [
    HighlightDirective,
    ValidationMessageDirective,
    CounterDirective,
    TooltipDirective,
    UnlessDirective,
    RepeatDirective,
    DebounceDirective,
    ActiveDirective,
    KeyboardShortcutDirective,
    LogClickDirective,
    VirtualScrollDirective,
    AutoFocusDirective,
    AccessibleDirective,
  ],
})
export class DirectivesModule {}
