# Advanced Directives & Best Practices

## Advanced Directive Features

### Directive Composition

Combine multiple directives for more powerful functionality:

```typescript
@Directive({
  selector: '[appValidated]'
})
export class ValidatedDirective {
  constructor(private el: ElementRef) {}
}

@Directive({
  selector: '[appRequired]'
})
export class RequiredDirective {
  constructor(private el: ElementRef) {}
}
```

```html
<!-- Use together -->
<input appValidated appRequired />
```

### Directive Providers

Directives can provide services:

```typescript
import { Directive, Provider } from '@angular/core';

export class MyService {
  getValue() { return 'value'; }
}

@Directive({
  selector: '[appMyDirective]',
  providers: [MyService]  // Provide service
})
export class MyDirective {
  constructor(private service: MyService) {
    console.log(this.service.getValue());
  }
}
```

---

## Advanced @HostListener Usage

### Listen to Multiple Events

```typescript
@Directive({
  selector: '[appClickHandler]'
})
export class ClickHandlerDirective {
  @HostListener('click', ['$event'])
  @HostListener('touchstart', ['$event'])
  onClick(event: Event) {
    console.log('Clicked or touched');
  }
}
```

### Event Filtering with Key Modifiers

```typescript
@Directive({
  selector: '[appKeyHandler]'
})
export class KeyHandlerDirective {
  @HostListener('keydown.enter')
  onEnter() {
    console.log('Enter pressed');
  }

  @HostListener('keydown.control.shift.s')
  onCtrlShiftS() {
    console.log('Ctrl+Shift+S pressed');
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    console.log('Escape pressed anywhere in document');
  }
}
```

---

## Advanced @HostBinding Usage

### Binding Multiple Properties

```typescript
@Directive({
  selector: '[appCard]'
})
export class CardDirective {
  @Input() elevation = 1;
  @Input() disabled = false;

  @HostBinding('class.card')
  hasCardClass = true;

  @HostBinding('class.card-elevated')
  get isElevated() {
    return this.elevation > 0;
  }

  @HostBinding('class.card-disabled')
  get isDisabled() {
    return this.disabled;
  }

  @HostBinding('style.box-shadow')
  get boxShadow() {
    return `0 ${this.elevation * 2}px ${this.elevation * 4}px rgba(0,0,0,0.1)`;
  }
}
```

**Usage:**
```html
<div appCard [elevation]="3" [disabled]="false">
  Card content
</div>
```

---

## Directive Queries

### Access Child Directives

```typescript
import { Directive, ContentChild, ViewChild } from '@angular/core';

@Directive({
  selector: '[appForm]'
})
export class FormDirective {
  @ContentChild(MyDirective) myDirective: MyDirective;

  ngAfterContentInit() {
    console.log(this.myDirective);
  }
}
```

### Access Multiple Children

```typescript
import { Directive, ContentChildren, QueryList } from '@angular/core';

@Directive({
  selector: '[appMenu]'
})
export class MenuDirective {
  @ContentChildren(MenuItemDirective) items: QueryList<MenuItemDirective>;

  ngAfterContentInit() {
    this.items.forEach(item => {
      console.log(item);
    });
  }
}
```

---

## Directive Inheritance

Create a base directive for shared behavior:

```typescript
@Directive()
export class BaseHighlightDirective {
  protected highlightColor = 'yellow';

  constructor(protected el: ElementRef) {
    this.setHighlight();
  }

  protected setHighlight() {
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
  }
}

@Directive({
  selector: '[appErrorHighlight]'
})
export class ErrorHighlightDirective extends BaseHighlightDirective {
  protected highlightColor = 'red';
}

@Directive({
  selector: '[appSuccessHighlight]'
})
export class SuccessHighlightDirective extends BaseHighlightDirective {
  protected highlightColor = 'green';
}
```

---

## Directives with RxJS

Handle subscriptions properly:

```typescript
import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appObservable]'
})
export class ObservableDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private service: MyService) {}

  ngOnInit() {
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log(data);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Directive Configuration

Flexible directive configuration:

```typescript
export interface HighlightConfig {
  color: string;
  bold: boolean;
  size: 'small' | 'medium' | 'large';
}

@Directive({
  selector: '[appConfigurable]'
})
export class ConfigurableDirective {
  @Input() config: HighlightConfig;

  ngOnInit() {
    if (!this.config) {
      this.config = { color: 'yellow', bold: false, size: 'medium' };
    }
    this.apply();
  }

  private apply() {
    this.el.nativeElement.style.backgroundColor = this.config.color;
    this.el.nativeElement.style.fontWeight = this.config.bold ? 'bold' : 'normal';
  }

  constructor(private el: ElementRef) {}
}
```

**Usage:**
```html
<div [appConfigurable]="{ color: 'red', bold: true, size: 'large' }">
  Content
</div>
```

---

## Performance Optimization

### Lazy Evaluation

```typescript
@Directive({
  selector: '[appLazy]'
})
export class LazyDirective {
  private _condition: boolean;

  @Input()
  set appLazy(value: boolean) {
    this._condition = value;
    this.updateView();
  }

  private updateView() {
    // Only update when needed
    if (this._condition) {
      // Do work
    }
  }
}
```

### Caching

```typescript
@Directive({
  selector: '[appCached]'
})
export class CachedDirective {
  private cache: Map<string, any> = new Map();

  compute(key: string): any {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const result = this.doCompute(key);
    this.cache.set(key, result);
    return result;
  }

  private doCompute(key: string): any {
    // Expensive computation
    return key.toUpperCase();
  }
}
```

---

## Testing Directives

### Basic Directive Test

```typescript
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appHighlight [appHighlight]="'red'"></div>`
})
class TestComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightDirective, TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.query(By.css('div'));
  });

  it('should highlight element', () => {
    fixture.detectChanges();
    expect(element.nativeElement.style.backgroundColor).toBe('red');
  });
});
```

---

## Common Directives Patterns

| Pattern | Purpose | Example |
|---------|---------|---------|
| **Behavior** | Add interactions | Click handlers, keyboard support |
| **Styling** | Dynamic appearance | Themes, conditional styles |
| **Validation** | Input validation | Format, required, pattern |
| **Access Control** | Permissions | Show/hide based on roles |
| **Instrumentation** | Monitoring | Track events, analytics |
| **Content** | Manipulate content | Truncate, translate, format |

---

## Anti-Patterns to Avoid

❌ **Over-complication**
```typescript
// Too many responsibilities in one directive
@Directive({
  selector: '[appDoEverything]'
})
export class DoEverythingDirective {
  // Handles styling, validation, events, api calls, etc.
}
```

✅ **Single Responsibility**
```typescript
// Each directive has one job
@Directive({ selector: '[appValidate]' })
export class ValidateDirective { }

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective { }
```

❌ **Memory Leaks**
```typescript
// Forgot to unsubscribe
ngOnInit() {
  this.service.data$.subscribe(data => {
    // Handle data
  }); // Never unsubscribed!
}
```

✅ **Proper Cleanup**
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // Handle data
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

---

## Best Practices Summary

✅ Keep directives focused
✅ Use @Input for configuration
✅ Use @Output for events
✅ Handle cleanup in ngOnDestroy
✅ Use @HostBinding for styling
✅ Use @HostListener for events
✅ Test directives independently
✅ Document with JSDoc comments
✅ Follow naming conventions
✅ Consider performance implications
✅ Use TypeScript for type safety
✅ Follow Angular style guide

---

## Key Takeaways

- Advanced directives combine multiple features
- Use composition for shared behavior
- Properly manage subscriptions
- Consider performance and caching
- Test directives thoroughly
- Keep directives simple and focused
- Document custom directives
- Follow Angular patterns and conventions
