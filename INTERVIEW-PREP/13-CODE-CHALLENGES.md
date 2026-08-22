# Code Challenge Examples with Solutions

## Challenge 1: Implement a Custom Pipe

**Problem:**
Create a pipe that truncates text to a specified length and adds ellipsis.

**Solution:**

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, length: number = 50, suffix: string = '...'): string {
    if (!value) return value;
    if (value.length <= length) return value;
    return value.substring(0, length) + suffix;
  }
}

// Usage
{{ longText | truncate:30:' →' }}

// Tests
describe('TruncatePipe', () => {
  it('should truncate text', () => {
    const pipe = new TruncatePipe();
    const result = pipe.transform('Hello World', 5);
    expect(result).toBe('Hello...');
  });

  it('should use custom suffix', () => {
    const pipe = new TruncatePipe();
    const result = pipe.transform('Hello World', 5, '→');
    expect(result).toBe('Hello→');
  });
});
```

---

## Challenge 2: Create a Custom Directive for Debounced Input

**Problem:**
Create a directive that emits debounced values from input changes.

**Solution:**

```typescript
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective {
  @Output() debounceClick = new EventEmitter<void>();
  
  private clicks = new Subject<void>();

  constructor() {
    this.clicks.pipe(
      debounceTime(500)
    ).subscribe(() => this.debounceClick.emit());
  }

  @HostListener('click')
  clickEvent(): void {
    this.clicks.next();
  }
}

// Usage
<button appDebounceClick (debounceClick)="save()">Save</button>

// Alternative: Debounce input
@Directive({
  selector: '[appDebounceInput]'
})
export class DebounceInputDirective {
  @Output() debounceInput = new EventEmitter<string>();
  
  private input = new Subject<string>();

  constructor() {
    this.input.pipe(
      debounceTime(300)
    ).subscribe(value => this.debounceInput.emit(value));
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    this.input.next(event.target.value);
  }
}

// Usage
<input appDebounceInput (debounceInput)="search($event)">
```

---

## Challenge 3: Implement Observable Retry Logic

**Problem:**
Retry failed HTTP requests with exponential backoff.

**Solution:**

```typescript
import { retry, timer } from 'rxjs';

@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  getData(): Observable<Data> {
    return this.http.get<Data>('/api/data').pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          const delayMs = Math.pow(2, retryCount) * 1000;
          console.log(`Retry ${retryCount}: ${delayMs}ms`);
          return timer(delayMs);
        }
      })
    );
  }
}

// Test
describe('Retry Logic', () => {
  it('should retry with exponential backoff', fakeAsync(() => {
    spyOn(service.http, 'get').and.returnValues(
      throwError(() => new Error('1st')),
      throwError(() => new Error('2nd')),
      of({ data: 'success' })
    );

    service.getData().subscribe(result => {
      expect(result.data).toBe('success');
    });

    tick(1000); // 2^0 * 1000
    tick(2000); // 2^1 * 1000
    tick(4000); // 2^2 * 1000
  }));
});
```

---

## Challenge 4: Implement Form Validation with Cross-Field Validation

**Problem:**
Create a reactive form with cross-field validation (passwords match).

**Solution:**

```typescript
function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  template: `
    <form [formGroup]="form">
      <input formControlName="password" type="password">
      <input formControlName="confirmPassword" type="password">
      
      <div *ngIf="form.hasError('passwordMismatch') && submitted">
        Passwords don't match
      </div>
      
      <button (click)="submit()" [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class PasswordFormComponent {
  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordMatchValidator }
  );

  submitted = false;

  constructor(private fb: FormBuilder) {}

  submit(): void {
    this.submitted = true;
    if (this.form.valid) {
      console.log('Form valid');
    }
  }
}

// Test
describe('Password Form', () => {
  it('should validate matching passwords', () => {
    component.form.patchValue({
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(component.form.valid).toBe(true);
  });

  it('should invalidate mismatching passwords', () => {
    component.form.patchValue({
      password: 'password123',
      confirmPassword: 'different123'
    });
    expect(component.form.hasError('passwordMismatch')).toBe(true);
  });
});
```

---

## Challenge 5: Implement Observable Polling with Cleanup

**Problem:**
Poll an API endpoint and handle component cleanup properly.

**Solution:**

```typescript
@Component({...})
export class PollingComponent implements OnInit, OnDestroy {
  data$: Observable<any>;
  private destroy$ = new Subject<void>();
  
  private readonly POLL_INTERVAL = 5000; // 5 seconds

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.data$ = interval(this.POLL_INTERVAL).pipe(
      switchMap(() => this.dataService.getData()),
      takeUntil(this.destroy$),
      shareReplay(1)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Manual polling with backoff
  startPolling(maxAttempts: number = 5): Observable<any> {
    return this.poll(
      () => this.dataService.getData(),
      this.POLL_INTERVAL,
      maxAttempts
    );
  }

  private poll<T>(
    fn: () => Observable<T>,
    interval: number,
    maxAttempts: number
  ): Observable<T> {
    return timer(0, interval).pipe(
      take(maxAttempts),
      switchMap(() => fn()),
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            if (index >= maxAttempts - 1) {
              return throwError(() => error);
            }
            return timer(interval * Math.pow(2, index));
          })
        )
      ),
      takeUntil(this.destroy$)
    );
  }
}
```

---

## Challenge 6: Implement Memoization with Observable

**Problem:**
Cache function results for expensive computations.

**Solution:**

```typescript
@Injectable({ providedIn: 'root' })
export class CachedComputationService {
  private cache$ = new Map<string, Observable<any>>();

  compute(id: string, expensive: () => Observable<any>): Observable<any> {
    if (!this.cache$.has(id)) {
      this.cache$.set(id, expensive().pipe(shareReplay(1)));
    }
    return this.cache$.get(id)!;
  }

  clear(id?: string): void {
    if (id) {
      this.cache$.delete(id);
    } else {
      this.cache$.clear();
    }
  }
}

// Usage
export class DataComponent {
  result$ = this.computeService.compute('complex', () =>
    this.complexCalculation()
  );

  constructor(private computeService: CachedComputationService) {}

  private complexCalculation(): Observable<any> {
    return new Observable(subscriber => {
      // Expensive computation
      subscriber.next(result);
      subscriber.complete();
    });
  }
}

// Test
describe('Memoization', () => {
  it('should cache results', () => {
    let callCount = 0;
    
    const expensive = () => {
      callCount++;
      return of('result');
    };

    service.compute('key', expensive).subscribe();
    service.compute('key', expensive).subscribe();

    expect(callCount).toBe(1); // Called once due to cache
  });
});
```

---

## Challenge 7: Create State Management Reducer

**Problem:**
Implement a reducer for managing shopping cart state.

**Solution:**

```typescript
// State
interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

// Actions
export const addToCart = createAction(
  '[Cart] Add Item',
  props<{ item: Product }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove Item',
  props<{ itemId: string }>()
);

export const clearCart = createAction(
  '[Cart] Clear Cart'
);

// Reducer
export const cartReducer = createReducer(
  { items: [], total: 0, loading: false },
  on(addToCart, (state, { item }) => ({
    ...state,
    items: [...state.items, { ...item, quantity: 1 }],
    total: state.total + item.price
  })),
  on(removeFromCart, (state, { itemId }) => {
    const item = state.items.find(i => i.id === itemId);
    return {
      ...state,
      items: state.items.filter(i => i.id !== itemId),
      total: state.total - (item?.price || 0)
    };
  }),
  on(clearCart, () => ({
    items: [],
    total: 0,
    loading: false
  }))
);

// Test
describe('Cart Reducer', () => {
  it('should add item to cart', () => {
    const product = { id: '1', name: 'Test', price: 10 };
    const newState = cartReducer(
      { items: [], total: 0, loading: false },
      addToCart({ item: product })
    );

    expect(newState.items.length).toBe(1);
    expect(newState.total).toBe(10);
  });
});
```

---

## Challenge 8: Performance: Virtual Scrolling Implementation

**Problem:**
Display 10,000 items efficiently using virtual scrolling.

**Solution:**

```typescript
@Component({
  selector: 'app-virtual-list',
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="virtual-list">
      <app-item 
        *cdkVirtualFor="let item of items; trackBy: trackByFn"
        [item]="item">
      </app-item>
    </cdk-virtual-scroll-viewport>
  `
})
export class VirtualListComponent {
  @Input() items: any[] = [];

  trackByFn(index: number, item: any): any {
    return item.id;
  }
}

// Module
@NgModule({
  imports: [ScrollingModule], // from @angular/cdk/scrolling
  declarations: [VirtualListComponent]
})
export class VirtualScrollModule {}
```

---

**Interview Tips for Code Challenges:**
1. Start with a working solution
2. Optimize for performance later
3. Add proper error handling
4. Include unit tests
5. Ask clarifying questions
6. Explain your thought process
7. Consider edge cases
8. Discuss trade-offs

