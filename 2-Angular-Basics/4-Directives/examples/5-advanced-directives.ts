/**
 * Advanced Directives Examples
 * Composition, inheritance, RxJS integration, performance, testing patterns
 */

import { 
  Directive, Input, Output, EventEmitter, HostListener, HostBinding, 
  ElementRef, Renderer2, OnInit, OnDestroy, OnChanges, SimpleChanges 
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// ============================================================
// EXAMPLE 1: Base Directive with Inheritance
// ============================================================

export class BaseStyleDirective {
  @Input() padding: number = 10;
  @Input() margin: number = 10;

  protected applyStyles() {
    console.log('Applying base styles');
  }
}

@Directive({
  selector: '[appExtendedStyle]'
})
export class ExtendedStyleDirective extends BaseStyleDirective implements OnInit {
  @Input() borderRadius: number = 5;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    this.applyStyles();
    this.renderer.setStyle(
      this.el.nativeElement,
      'border-radius',
      `${this.borderRadius}px`
    );
  }
}

// ============================================================
// EXAMPLE 2: Directive Composition Pattern
// ============================================================

interface DirectiveConfig {
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
  borderRadius?: number;
}

@Directive({
  selector: '[appComposite]'
})
export class CompositeDirective implements OnInit {
  @Input() appComposite: DirectiveConfig = {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.applyConfig(this.appComposite);
  }

  private applyConfig(config: DirectiveConfig) {
    if (config.backgroundColor) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', config.backgroundColor);
    }
    if (config.textColor) {
      this.renderer.setStyle(this.el.nativeElement, 'color', config.textColor);
    }
    if (config.padding) {
      this.renderer.setStyle(this.el.nativeElement, 'padding', `${config.padding}px`);
    }
    if (config.borderRadius) {
      this.renderer.setStyle(this.el.nativeElement, 'border-radius', `${config.borderRadius}px`);
    }
  }
}

// Usage: <div [appComposite]="{ backgroundColor: 'blue', padding: 20 }"></div>

// ============================================================
// EXAMPLE 3: Directive with RxJS Subject
// ============================================================

@Directive({
  selector: '[appSearchInput]'
})
export class SearchInputDirective implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();

  private subject$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  @HostListener('input', ['$event'])
  onInput(event: any) {
    this.subject$.next(event.target.value);
  }

  ngOnInit() {
    this.subject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.search.emit(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private el: ElementRef) {}
}

// Usage: <input appSearchInput (search)="onSearch($event)" />

// ============================================================
// EXAMPLE 4: Directive with OnChanges
// ============================================================

@Directive({
  selector: '[appReactive]'
})
export class ReactiveDirective implements OnChanges {
  @Input() condition: boolean = false;
  @Input() color: string = 'black';
  @Output() changed = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['condition']) {
      console.log('Condition changed:', changes['condition'].currentValue);
      this.changed.emit(changes['condition'].currentValue);
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// Usage: <div [appReactive] [condition]="isActive" (changed)="onChange($event)"></div>

// ============================================================
// EXAMPLE 5: Directive Factory Pattern
// ============================================================

type DirectiveType = 'primary' | 'secondary' | 'danger' | 'success';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective implements OnInit {
  @Input() appButton: DirectiveType = 'primary';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.applyButtonStyle();
  }

  private applyButtonStyle() {
    const styles = this.getStylesForType(this.appButton);
    Object.keys(styles).forEach(key => {
      this.renderer.setStyle(this.el.nativeElement, key, styles[key]);
    });
  }

  private getStylesForType(type: DirectiveType) {
    const styleMap = {
      primary: { 'background-color': 'blue', 'color': 'white' },
      secondary: { 'background-color': 'gray', 'color': 'white' },
      danger: { 'background-color': 'red', 'color': 'white' },
      success: { 'background-color': 'green', 'color': 'white' }
    };
    return styleMap[type] || styleMap['primary'];
  }
}

// Usage: <button [appButton]="'danger'">Delete</button>

// ============================================================
// EXAMPLE 6: Performance-Optimized Directive
// ============================================================

@Directive({
  selector: '[appPerfOptimized]'
})
export class PerfOptimizedDirective implements OnInit {
  @Input() data: any[] = [];

  private memo: Map<string, any> = new Map();
  private lastHash = '';

  ngOnInit() {
    this.processData();
  }

  private processData() {
    const hash = this.hashData(this.data);
    
    // Only reprocess if data changed
    if (hash !== this.lastHash) {
      this.lastHash = hash;
      this.memo.clear();
      // Process logic here
    }
  }

  private hashData(data: any[]): string {
    return JSON.stringify(data);
  }

  constructor(private el: ElementRef) {}
}

// ============================================================
// EXAMPLE 7: Validation Directive with Error Messages
// ============================================================

@Directive({
  selector: '[appValidate]'
})
export class ValidateDirective implements OnInit {
  @Input() appValidate: 'email' | 'phone' | 'url' | 'number' = 'email';
  @Input() customPattern?: RegExp;
  @Output() validationResult = new EventEmitter<{ valid: boolean; message: string }>();

  private patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{10}$/,
    url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    number: /^[0-9]+(\.[0-9]+)?$/
  };

  @HostListener('blur')
  onBlur() {
    this.validate();
  }

  ngOnInit() {
    this.setupValidation();
  }

  private setupValidation() {
    console.log(`Validation setup for: ${this.appValidate}`);
  }

  private validate() {
    const value = this.el.nativeElement.value;
    const pattern = this.customPattern || this.patterns[this.appValidate];
    const valid = pattern.test(value);

    this.validationResult.emit({
      valid,
      message: valid ? 'Valid input' : `Invalid ${this.appValidate}`
    });
  }

  constructor(private el: ElementRef) {}
}

// Usage: <input [appValidate]="'email'" (validationResult)="onValidation($event)" />

// ============================================================
// EXAMPLE 8: Observer Pattern Directive
// ============================================================

@Directive({
  selector: '[appObservable]'
})
export class ObservableDirective {
  @Output() visibility = new EventEmitter<boolean>();

  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.setupObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.visibility.emit(entry.isIntersecting);
      });
    });

    this.observer.observe(this.el.nativeElement);
  }

  constructor(private el: ElementRef) {}
}

// Usage: <div appObservable (visibility)="onVisibilityChange($event)"></div>

// ============================================================
// EXAMPLE 9: Conditional Structural Directive
// ============================================================

@Directive({
  selector: '[appIf]'
})
export class IfDirective {
  @Input()
  set appIf(condition: boolean) {
    if (condition) {
      if (!this.hasView) {
        this.container.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      if (this.hasView) {
        this.container.clear();
        this.hasView = false;
      }
    }
  }

  private hasView = false;

  constructor(
    private templateRef: any,
    private container: any
  ) {}
}

// ============================================================
// EXAMPLE 10: Accessibility Directive
// ============================================================

@Directive({
  selector: '[appAccessible]'
})
export class AccessibleDirective implements OnInit {
  @Input() role: string = 'button';
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';

  ngOnInit() {
    this.el.nativeElement.setAttribute('role', this.role);
    if (this.ariaLabel) {
      this.el.nativeElement.setAttribute('aria-label', this.ariaLabel);
    }
    if (this.ariaDescribedBy) {
      this.el.nativeElement.setAttribute('aria-describedby', this.ariaDescribedBy);
    }
  }

  constructor(private el: ElementRef) {}
}

// Usage: <div [appAccessible] role="alert" [ariaLabel]="'Error message'"></div>

// ============================================================
// EXAMPLE 11: Analytics Directive
// ============================================================

@Directive({
  selector: '[appTrack]'
})
export class TrackDirective {
  @Input() trackEvent: string = '';
  @Input() trackData: any = {};

  @HostListener('click')
  onClick() {
    this.sendAnalytics();
  }

  private sendAnalytics() {
    console.log(`Event: ${this.trackEvent}`, this.trackData);
    // Send to analytics service
  }

  constructor() {}
}

// Usage: <button [appTrack] trackEvent="button_click" [trackData]="{ buttonName: 'submit' }">

// ============================================================
// EXAMPLE 12: Error Handling Directive
// ============================================================

@Directive({
  selector: '[appErrorHandler]'
})
export class ErrorHandlerDirective {
  @Input() onError?: (error: any) => void;
  @Output() error = new EventEmitter<Error>();

  @HostListener('click')
  onClick() {
    try {
      // Protected operation
    } catch (err) {
      this.handleError(err as Error);
    }
  }

  private handleError(error: Error) {
    console.error('Directive error:', error);
    this.error.emit(error);
    
    if (this.onError) {
      this.onError(error);
    }
  }

  constructor() {}
}

// ============================================================
// EXAMPLE 13: State Management in Directive
// ============================================================

interface DirectiveState {
  isLoading: boolean;
  isError: boolean;
  data: any;
}

@Directive({
  selector: '[appStateful]'
})
export class StatefulDirective {
  @Input() initialState: DirectiveState = {
    isLoading: false,
    isError: false,
    data: null
  };

  private state: DirectiveState = { ...this.initialState };

  @Output() stateChanged = new EventEmitter<DirectiveState>();

  updateState(partial: Partial<DirectiveState>) {
    this.state = { ...this.state, ...partial };
    this.stateChanged.emit(this.state);
  }

  getState(): DirectiveState {
    return { ...this.state };
  }
}

// ============================================================
// EXAMPLE 14: Testing-Friendly Directive
// ============================================================

@Directive({
  selector: '[appTestable]'
})
export class TestableDirective {
  @Input() testId: string = '';
  @Output() testEvent = new EventEmitter<any>();

  @HostListener('click')
  onClick() {
    this.testEvent.emit({ testId: this.testId, timestamp: Date.now() });
  }

  ngOnInit() {
    // Set test attribute for E2E testing
    this.el.nativeElement.setAttribute('data-test-id', this.testId);
  }

  getTestData() {
    return {
      testId: this.testId,
      element: this.el.nativeElement
    };
  }

  constructor(private el: ElementRef) {}
}

// Usage: <button [appTestable] testId="submit-btn" (testEvent)="onTest($event)">Submit</button>

// ============================================================
// Summary: Advanced Directives
// ============================================================

/**
 * Advanced Patterns:
 *
 * 1. Inheritance
 *    - Extend base directive class
 *    - Override methods
 *    - Reuse common logic
 *
 * 2. Composition
 *    - Combine multiple directives
 *    - Config object pattern
 *    - Flexible behavior
 *
 * 3. RxJS Integration
 *    - Subject for reactive updates
 *    - debounceTime, distinctUntilChanged
 *    - Memory management with takeUntil
 *
 * 4. Performance
 *    - Memoization
 *    - Hash comparison
 *    - Lazy initialization
 *
 * 5. Factory Pattern
 *    - Type-based styling
 *    - Configurable behavior
 *    - Type safety with TypeScript
 *
 * 6. Accessibility
 *    - ARIA attributes
 *    - Semantic HTML
 *    - Keyboard support
 *
 * 7. Testing
 *    - Test IDs
 *    - Emit test events
 *    - Expose test utilities
 *
 * 8. State Management
 *    - Internal state tracking
 *    - State emission
 *    - Immutable updates
 *
 * Best Practices:
 * ✅ Keep directives single-responsibility
 * ✅ Use RxJS for reactive patterns
 * ✅ Clean up with takeUntil
 * ✅ Use Renderer2, not ElementRef
 * ✅ Test directives thoroughly
 * ✅ Document complex logic
 * ✅ Consider performance impact
 * ✅ Handle edge cases
 */
