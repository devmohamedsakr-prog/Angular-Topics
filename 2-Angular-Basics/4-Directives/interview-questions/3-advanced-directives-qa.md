# Advanced Directives - Interview Questions & Answers

## Q1: How do you create a directive that extends another directive?

**Answer:**
You can inherit from a base directive class and override or extend its functionality.

```typescript
// BASE DIRECTIVE
export class BaseStyleDirective {
  @Input() padding: number = 10;
  @Input() margin: number = 10;

  protected applyBaseStyles(el: ElementRef, renderer: Renderer2) {
    renderer.setStyle(el.nativeElement, 'padding', `${this.padding}px`);
    renderer.setStyle(el.nativeElement, 'margin', `${this.margin}px`);
  }
}

// EXTENDED DIRECTIVE - Inherits from BaseStyleDirective
@Directive({
  selector: '[appCard]'
})
export class CardDirective extends BaseStyleDirective implements OnInit {
  @Input() borderRadius: number = 8;
  @Input() shadow: boolean = true;
  @Input() bgColor: string = '#fff';

  ngOnInit() {
    this.applyBaseStyles(this.el, this.renderer);
    this.applyCardStyles();
  }

  private applyCardStyles() {
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', `${this.borderRadius}px`);
    this.renderer.setStyle(this.el.nativeElement, 'background-color', this.bgColor);

    if (this.shadow) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'box-shadow',
        '0 2px 8px rgba(0,0,0,0.1)'
      );
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
    super();
  }
}

// USAGE:
@Component({
  template: `
    <div [appCard]
         [padding]="15"
         [margin]="10"
         [borderRadius]="12"
         [shadow]="true"
         [bgColor]="'#f5f5f5'">
      Card content
    </div>
  `
})
export class AppComponent {}
```

**Multi-Level Inheritance:**
```typescript
// Level 1: Base
export class BaseDirective {
  protected getCommonStyles() {
    return { display: 'block', boxSizing: 'border-box' };
  }
}

// Level 2: Intermediate
export class Intermediate extends BaseDirective {
  @Input() border: string = '1px solid #ccc';

  protected getBorderStyle() {
    return this.border;
  }
}

// Level 3: Final
@Directive({ selector: '[appAdvanced]' })
export class AdvancedDirective extends Intermediate implements OnInit {
  ngOnInit() {
    const styles = this.getCommonStyles();
    const border = this.getBorderStyle();
    // Apply both
  }
}
```

---

## Q2: How do you use RxJS in directives for reactive updates?

**Answer:**
Integrate RxJS observables for reactive data handling and automatic cleanup.

```typescript
import { Subject, interval, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';

@Directive({
  selector: '[appReactive]'
})
export class ReactiveDirective implements OnInit, OnDestroy {
  @Input() debounceMs: number = 300;
  @Output() valueChanged = new EventEmitter<string>();

  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Listen to input events with RxJS
    fromEvent(this.el.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(this.debounceMs),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.valueChanged.emit(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private el: ElementRef) {}
}

// ADVANCED: Multiple Observable Streams
@Directive({
  selector: '[appAdvancedReactive]'
})
export class AdvancedReactiveDirective implements OnInit, OnDestroy {
  @Input() searchTerm$ = new Subject<string>();
  @Input() filters$ = new Subject<any>();
  @Output() results = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Merge multiple observable streams
    merge(
      this.searchTerm$.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.filters$.pipe(
        debounceTime(500)
      )
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.performSearch();
      });
  }

  private performSearch() {
    // Perform search logic
    this.results.emit({});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor() {}
}

// USAGE:
@Component({
  template: `
    <input [appReactive] (valueChanged)="onSearch($event)" />
  `
})
export class AppComponent {
  onSearch(value: string) {
    console.log('Search:', value);
  }
}
```

**Common RxJS Operators in Directives:**
```typescript
// debounceTime - Wait before emitting
.pipe(debounceTime(300))

// distinctUntilChanged - Only emit if value changed
.pipe(distinctUntilChanged())

// debounceTime + distinctUntilChanged - Common pattern
.pipe(
  debounceTime(300),
  distinctUntilChanged()
)

// takeUntil - Unsubscribe automatically on destroy
.pipe(takeUntil(this.destroy$))

// switchMap - Switch to new observable
.pipe(switchMap(value => this.service.search(value)))

// catchError - Handle errors
.pipe(catchError(error => of([])))

// tap - Side effects without changing data
.pipe(tap(value => console.log(value)))
```

---

## Q3: How do you create a directive with composition pattern?

**Answer:**
Use configuration objects to compose directive behavior flexibly.

```typescript
// CONFIG INTERFACE
export interface DirectiveConfig {
  backgroundColor?: string;
  textColor?: string;
  padding?: number;
  borderRadius?: number;
  border?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | '300' | '600';
}

// COMPOSED DIRECTIVE
@Directive({
  selector: '[appCompose]'
})
export class ComposedDirective implements OnInit, OnChanges {
  @Input() appCompose: DirectiveConfig = {};

  ngOnInit() {
    this.applyConfig(this.appCompose);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['appCompose']) {
      this.applyConfig(this.appCompose);
    }
  }

  private applyConfig(config: DirectiveConfig) {
    if (config.backgroundColor) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'background-color',
        config.backgroundColor
      );
    }
    if (config.textColor) {
      this.renderer.setStyle(this.el.nativeElement, 'color', config.textColor);
    }
    if (config.padding) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'padding',
        `${config.padding}px`
      );
    }
    if (config.borderRadius) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'border-radius',
        `${config.borderRadius}px`
      );
    }
    if (config.border) {
      this.renderer.setStyle(this.el.nativeElement, 'border', config.border);
    }
    if (config.fontSize) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'font-size',
        `${config.fontSize}px`
      );
    }
    if (config.fontWeight) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'font-weight',
        config.fontWeight
      );
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// USAGE:
@Component({
  template: `
    <!-- Single config object -->
    <div [appCompose]="cardConfig">
      Card 1
    </div>

    <!-- Dynamic config -->
    <div [appCompose]="getConfig()">
      Card 2
    </div>
  `
})
export class AppComponent {
  cardConfig: DirectiveConfig = {
    backgroundColor: '#fff',
    textColor: '#333',
    padding: 20,
    borderRadius: 8,
    border: '1px solid #ddd',
    fontSize: 16,
    fontWeight: 'normal'
  };

  getConfig(): DirectiveConfig {
    return {
      backgroundColor: '#f0f0f0',
      padding: 15,
      borderRadius: 4
    };
  }
}
```

**Factory Pattern with Composition:**
```typescript
@Directive({
  selector: '[appTheme]'
})
export class ThemeDirective {
  @Input() theme: 'light' | 'dark' | 'auto' = 'light';

  private themeConfigs = {
    light: { background: '#fff', text: '#000' },
    dark: { background: '#333', text: '#fff' },
    auto: { background: '#f5f5f5', text: '#333' }
  };

  ngOnInit() {
    const config = this.themeConfigs[this.theme];
    this.applyTheme(config);
  }

  private applyTheme(config: any) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', config.background);
    this.renderer.setStyle(this.el.nativeElement, 'color', config.text);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
```

---

## Q4: How do you implement directive state management?

**Answer:**
Manage internal state and emit changes to keep parent component in sync.

```typescript
export interface DirectiveState {
  isOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  data: any;
  error: string | null;
}

@Directive({
  selector: '[appState]',
  exportAs: 'state'
})
export class StateDirective {
  @Input() initialState: Partial<DirectiveState> = {};
  @Output() stateChanged = new EventEmitter<DirectiveState>();

  private state: DirectiveState = {
    isOpen: false,
    isLoading: false,
    isError: false,
    data: null,
    error: null,
    ...this.initialState
  };

  // Getters for read access
  get isOpen() {
    return this.state.isOpen;
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get data() {
    return this.state.data;
  }

  get error() {
    return this.state.error;
  }

  // State update methods
  open() {
    this.updateState({ isOpen: true });
  }

  close() {
    this.updateState({ isOpen: false });
  }

  setLoading(loading: boolean) {
    this.updateState({ isLoading: loading });
  }

  setData(data: any) {
    this.updateState({
      data,
      isError: false,
      error: null,
      isLoading: false
    });
  }

  setError(error: string) {
    this.updateState({
      error,
      isError: true,
      isLoading: false,
      data: null
    });
  }

  reset() {
    this.state = {
      isOpen: false,
      isLoading: false,
      isError: false,
      data: null,
      error: null
    };
    this.stateChanged.emit(this.state);
  }

  private updateState(partial: Partial<DirectiveState>) {
    this.state = { ...this.state, ...partial };
    this.stateChanged.emit(this.state);
  }

  getState(): DirectiveState {
    return { ...this.state };
  }
}

// USAGE:
@Component({
  template: `
    <div [appState] #state="state">
      <button (click)="state.open()" *ngIf="!state.isOpen">
        Open
      </button>

      <div *ngIf="state.isOpen">
        <div *ngIf="state.isLoading">Loading...</div>
        <div *ngIf="state.isError" class="error">
          {{ state.error }}
        </div>
        <div *ngIf="state.data">
          {{ state.data }}
        </div>
        <button (click)="state.close()">Close</button>
      </div>
    </div>
  `
})
export class AppComponent {}
```

---

## Q5: How do you use IntersectionObserver in a directive?

**Answer:**
`IntersectionObserver` detects when an element enters/leaves the viewport.

```typescript
@Directive({
  selector: '[appIntersection]'
})
export class IntersectionDirective implements OnInit, OnDestroy {
  @Input() observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  @Output() visibility = new EventEmitter<boolean>();
  @Output() intersected = new EventEmitter<IntersectionObserverEntry>();
  @Output() exited = new EventEmitter<IntersectionObserverEntry>();

  private observer: IntersectionObserver | null = null;

  ngOnInit() {
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

        if (entry.isIntersecting) {
          this.intersected.emit(entry);
        } else {
          this.exited.emit(entry);
        }
      });
    }, this.observerOptions);

    this.observer.observe(this.el.nativeElement);
  }

  constructor(private el: ElementRef) {}
}

// LAZY LOADING DIRECTIVE
@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input() fallback: string = '';
  @Output() loaded = new EventEmitter<void>();

  private observer: IntersectionObserver | null = null;
  private hasLoaded = false;

  ngOnInit() {
    this.setupLazyLoad();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupLazyLoad() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasLoaded) {
          this.loadContent();
          this.hasLoaded = true;
          if (this.observer) {
            this.observer.unobserve(this.el.nativeElement);
          }
        }
      });
    });

    this.observer.observe(this.el.nativeElement);
  }

  private loadContent() {
    const src = this.el.nativeElement.getAttribute('data-src');
    if (src) {
      this.el.nativeElement.src = src;
      this.loaded.emit();
    }
  }

  constructor(private el: ElementRef) {}
}

// USAGE:
@Component({
  template: `
    <!-- Intersection detection -->
    <div [appIntersection]
         (visibility)="onVisibility($event)"
         (intersected)="onIntersected($event)">
      Visible when scrolled into view
    </div>

    <!-- Lazy loading images -->
    <img [appLazyLoad]
         data-src="images/large.jpg"
         (loaded)="onImageLoaded()"
         [fallback]="'placeholder.jpg'" />
  `
})
export class AppComponent {
  onVisibility(isVisible: boolean) {
    console.log('Visible:', isVisible);
  }

  onIntersected(entry: IntersectionObserverEntry) {
    console.log('Intersection ratio:', entry.intersectionRatio);
  }

  onImageLoaded() {
    console.log('Image loaded');
  }
}
```

---

## Q6: How do you create a directive for performance monitoring?

**Answer:**
Track performance metrics like render time, memory usage, and interactions.

```typescript
@Directive({
  selector: '[appPerformance]'
})
export class PerformanceDirective implements OnInit, OnDestroy {
  @Input() trackRenderTime: boolean = true;
  @Input() trackInteractions: boolean = true;
  @Output() performanceMetrics = new EventEmitter<{
    renderTime: number;
    interactionCount: number;
  }>();

  private renderStartTime = 0;
  private interactionCount = 0;
  private metrics = {
    renderTime: 0,
    interactionCount: 0
  };

  ngOnInit() {
    this.renderStartTime = performance.now();

    if (this.trackInteractions) {
      this.trackUserInteractions();
    }
  }

  ngAfterViewInit() {
    if (this.trackRenderTime) {
      const renderEndTime = performance.now();
      this.metrics.renderTime = renderEndTime - this.renderStartTime;
      console.log(`Render time: ${this.metrics.renderTime}ms`);
    }
  }

  ngOnDestroy() {
    this.emitMetrics();
  }

  private trackUserInteractions() {
    ['click', 'input', 'change', 'keypress'].forEach(event => {
      this.renderer.listen(this.el.nativeElement, event, () => {
        this.interactionCount++;
        this.metrics.interactionCount = this.interactionCount;
      });
    });
  }

  private emitMetrics() {
    this.performanceMetrics.emit(this.metrics);
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}

// USAGE:
@Component({
  template: `
    <div [appPerformance]
         [trackRenderTime]="true"
         [trackInteractions]="true"
         (performanceMetrics)="onMetrics($event)">
      Content
    </div>
  `
})
export class AppComponent {
  onMetrics(metrics: any) {
    console.log('Render time:', metrics.renderTime, 'ms');
    console.log('Interactions:', metrics.interactionCount);
  }
}
```

---

## Q7: How do you create a directive with async loading pattern?

**Answer:**
Combine directives with async data loading and state management.

```typescript
@Directive({
  selector: '[appAsync]'
})
export class AsyncDirective implements OnInit, OnDestroy {
  @Input() asyncData: Observable<any>;
  @Output() loaded = new EventEmitter<any>();
  @Output() error = new EventEmitter<Error>();
  @Output() loading = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();

  ngOnInit() {
    if (!this.asyncData) return;

    this.loading.emit(true);

    this.asyncData
      .pipe(
        tap(data => {
          this.loading.emit(false);
          this.loaded.emit(data);
        }),
        catchError(err => {
          this.loading.emit(false);
          this.error.emit(err);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor() {}
}

// USAGE:
@Component({
  template: `
    <div [appAsync]="dataSource$"
         (loading)="isLoading = $event"
         (loaded)="onDataLoaded($event)"
         (error)="onError($event)">

      <div *ngIf="isLoading">Loading...</div>
      <div *ngIf="!isLoading">Content loaded</div>
    </div>
  `
})
export class AppComponent {
  dataSource$ = this.http.get('/api/data');
  isLoading = false;

  onDataLoaded(data: any) {
    console.log('Data:', data);
  }

  onError(error: Error) {
    console.error('Error:', error);
  }

  constructor(private http: HttpClient) {}
}
```

---

## Q8: How do you test directives?

**Answer:**
Test directives by creating test components and verifying their behavior.

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

// Test component
@Component({
  template: `
    <div [appHighlight]="'yellow'" #highlighted>
      Test content
    </div>
  `
})
class TestComponent {}

// Test suite
describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightDirective, TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.query(By.directive(HighlightDirective));
  });

  it('should highlight element', () => {
    fixture.detectChanges();
    const nativeElement = element.nativeElement;

    expect(nativeElement.style.backgroundColor).toBe('yellow');
  });

  it('should respond to input changes', () => {
    const component = fixture.componentInstance;
    const directive = element.injector.get(HighlightDirective);

    directive.color = 'red';
    fixture.detectChanges();

    expect(element.nativeElement.style.backgroundColor).toBe('red');
  });

  it('should emit events', (done) => {
    const directive = element.injector.get(HighlightDirective);

    directive.clicked.subscribe(() => {
      expect(true).toBe(true);
      done();
    });

    element.nativeElement.click();
  });
});
```

---

## Q9: What are best practices for directive performance?

**Answer:**
Optimize directives for better performance and user experience.

```typescript
// ✅ GOOD: Optimized directive
@Directive({
  selector: '[appOptimized]'
})
export class OptimizedDirective implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  
  // Cache computed values
  private computedValue: string;
  private lastInputHash: string;

  // Use ChangeDetectionStrategy
  @HostBinding('class.active')
  get isActive(): boolean {
    return this.computedValue === 'active';
  }

  ngOnInit() {
    this.memoize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.memoize();
    }
  }

  ngOnDestroy() {
    // Cleanup
  }

  private memoize() {
    const hash = JSON.stringify(this.data);
    
    // Only recompute if data changed
    if (hash !== this.lastInputHash) {
      this.lastInputHash = hash;
      this.computedValue = this.compute();
    }
  }

  private compute(): string {
    // Expensive computation
    return '';
  }

  constructor() {}
}

// ❌ BAD: Inefficient directive
@Directive({
  selector: '[appBad]'
})
export class BadDirective {
  @HostBinding('style.color')
  get color(): string {
    // Called on every change detection
    return this.expensiveComputation();
  }

  private expensiveComputation(): string {
    // Heavy logic recomputed constantly
    return 'red';
  }
}

// BEST PRACTICES:
// 1. Cache computed values
// 2. Use memoization
// 3. Avoid heavy operations in getters
// 4. Use trackBy with *ngFor
// 5. Unsubscribe from observables
// 6. Use OnPush change detection when possible
// 7. Lazy load when needed
// 8. Profile and monitor performance
```

---

## Q10: What are common directive antipatterns to avoid?

**Answer:**
Know what not to do when building directives.

```typescript
// ❌ ANTIPATTERN 1: Memory leaks
@Directive({
  selector: '[appMemoryLeak]'
})
export class MemoryLeakDirective implements OnInit {
  ngOnInit() {
    // Subscription never cleaned up - memory leak!
    this.service.getData().subscribe(data => {
      console.log(data);
    });
  }

  constructor(private service: any) {}
}

// ✅ CORRECT:
@Directive({
  selector: '[appGood]'
})
export class GoodDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private service: any) {}
}

// ❌ ANTIPATTERN 2: Direct DOM manipulation
@Directive({
  selector: '[appDirect]'
})
export class DirectDirective {
  constructor(private el: ElementRef) {
    // Direct access - unsafe!
    el.nativeElement.style.color = 'red';
    el.nativeElement.innerHTML = '<b>Unsafe</b>'; // XSS risk!
  }
}

// ✅ USE Renderer2:
@Directive({
  selector: '[appSafe]'
})
export class SafeDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Safe!
    this.renderer.setStyle(el.nativeElement, 'color', 'red');
    this.renderer.setProperty(el.nativeElement, 'textContent', 'Safe');
  }
}

// ❌ ANTIPATTERN 3: Multiple responsibilities
@Directive({
  selector: '[appDoEverything]'
})
export class DoEverythingDirective {
  // Too many responsibilities - validation, styling, tracking, logging
  // Violates Single Responsibility Principle
}

// ✅ SINGLE RESPONSIBILITY:
@Directive({ selector: '[appValidate]' })
export class ValidateDirective { }

@Directive({ selector: '[appStyle]' })
export class StyleDirective { }

@Directive({ selector: '[appTrack]' })
export class TrackDirective { }

// ❌ ANTIPATTERN 4: Inefficient change detection
@Directive({
  selector: '[appInefficient]'
})
export class InefficientDirective {
  @HostBinding('style.color')
  get color(): string {
    // Called on every change detection
    return this.expensiveOperation();
  }
}

// ✅ CACHE RESULTS:
@Directive({
  selector: '[appEfficient]'
})
export class EfficientDirective implements OnChanges {
  private cachedColor: string;

  @HostBinding('style.color')
  get color(): string {
    return this.cachedColor;
  }

  ngOnChanges() {
    this.cachedColor = this.expensiveOperation();
  }
}
```

---

## Summary: Advanced Directive Patterns

| Pattern | Purpose | Use Case |
|---------|---------|----------|
| Inheritance | Extend base behavior | Reusable base directives |
| Composition | Flexible config | Multiple style variations |
| RxJS | Reactive updates | Async data, debouncing |
| State Management | Track state | Modal, accordion, tabs |
| IntersectionObserver | Viewport detection | Lazy loading, analytics |
| Performance | Monitor metrics | Optimization tracking |
| Async Loading | Handle async data | API calls, data loading |

## Key Takeaways

✅ Always implement `OnDestroy` and clean up subscriptions
✅ Use `takeUntil(destroy$)` for RxJS streams
✅ Prefer `Renderer2` over direct `ElementRef` access
✅ Cache computed values instead of recomputing
✅ Consider composition over inheritance
✅ Monitor and optimize performance
✅ Avoid common antipatterns (memory leaks, direct DOM manipulation)
✅ Test directives thoroughly with test components
✅ Keep directives focused and single-responsibility
✅ Use IntersectionObserver for viewport detection
