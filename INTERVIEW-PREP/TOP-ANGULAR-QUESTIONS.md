# Top Angular Interview Questions - All Systems

## Table of Contents
1. [Fundamental Concepts](#fundamental-concepts)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Performance & Optimization](#performance--optimization)
4. [Testing & Quality](#testing--quality)
5. [E-Commerce System Questions](#e-commerce-system-questions)
6. [Healthcare System Questions](#healthcare-system-questions)
7. [Advanced Patterns](#advanced-patterns)

---

## Fundamental Concepts

### Q1: What is Angular and why use it over other frameworks?

**Answer:**
Angular is a comprehensive TypeScript-based framework for building scalable web applications.

**Why Angular:**
- Full framework (not just a library)
- Strong typing with TypeScript
- Built-in features (routing, forms, HTTP, testing)
- Dependency injection system
- Reactive programming with RxJS
- PWA support out of the box
- Enterprise-grade tooling
- Large ecosystem and community

**Comparison:**
| Feature | Angular | React | Vue |
|---------|---------|-------|-----|
| Type | Framework | Library | Framework |
| Language | TypeScript | JavaScript | JavaScript |
| Learning | Steep | Moderate | Easy |
| Scalability | Excellent | Good | Good |
| Tooling | Built-in | Community | Built-in |
| PWA | Native | External | External |

---

### Q2: Explain dependency injection in Angular

**Answer:**
Dependency Injection is a software design pattern that deals with how components get hold of their dependencies.

```typescript
// Without DI (tightly coupled)
class UserService {
  getData() { return []; }
}

class UserComponent {
  private userService = new UserService(); // Direct dependency
  users = this.userService.getData();
}

// With DI (loosely coupled)
@Injectable({ providedIn: 'root' })
class UserService {
  getData() { return []; }
}

@Component({
  selector: 'app-users'
})
export class UserComponent {
  constructor(private userService: UserService) {} // Injected dependency
  users = this.userService.getData();
}

// Benefits:
// 1. Loose coupling
// 2. Easy testing (mock dependencies)
// 3. Single responsibility
// 4. Testability
// 5. Maintainability
```

**Injection Levels:**
```typescript
// Root level - singleton
@Injectable({ providedIn: 'root' })
export class AppService {}

// Module level
@NgModule({
  providers: [ModuleService]
})

// Component level
@Component({
  providers: [ComponentService]
})
```

---

### Q3: What is RxJS and Observables?

**Answer:**
RxJS is a library for reactive programming using Observables, making it easy to compose asynchronous or callback-based code.

```typescript
// Observable basics
const observable$ = new Observable(observer => {
  observer.next('Value 1');
  observer.next('Value 2');
  observer.complete();
});

// Subscribe
observable$.subscribe({
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('Done')
});

// Common operators
source$
  .pipe(
    map(x => x * 2),           // Transform
    filter(x => x > 5),        // Filter
    debounceTime(300),         // Delay
    distinctUntilChanged(),    // Unique
    switchMap(x => callAPI(x)) // Flatten
  )
  .subscribe(result => console.log(result));

// Combination operators
combineLatest([obs1$, obs2$])    // Combine latest
merge(obs1$, obs2$)              // Merge
zip(obs1$, obs2$)                // Zip
concat(obs1$, obs2$)             // Concatenate
forkJoin([obs1$, obs2$])         // All complete
```

---

## Architecture & Design Patterns

### Q4: Explain Angular module system and feature modules

**Answer:**
```typescript
// App Module (root)
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// Core Module (singleton services)
@NgModule({
  declarations: [],
  providers: [
    AuthService,
    LoggingService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('CoreModule is already loaded');
    }
  }
}

// Shared Module (reusable components)
@NgModule({
  declarations: [ButtonComponent, CardComponent, ModalComponent],
  imports: [CommonModule, FormsModule],
  exports: [ButtonComponent, CardComponent, ModalComponent, CommonModule]
})
export class SharedModule {}

// Feature Module (lazy-loaded)
@NgModule({
  declarations: [ProductsComponent, ProductDetailComponent],
  imports: [CommonModule, ProductRoutingModule, SharedModule],
  providers: [ProductService]
})
export class ProductsModule {}

// Lazy loading in routing
const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./products/products.module')
      .then(m => m.ProductsModule)
  }
];
```

---

### Q5: How do you handle state management in Angular?

**Answer:**
```typescript
// NgRx (Recommended for large apps)
// 1. State
export interface AppState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// 2. Actions
export const loadProducts = createAction('[Products Page] Load Products');
export const loadProductsSuccess = createAction(
  '[Products API] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Products API] Load Products Failure',
  props<{ error: string }>()
);

// 3. Reducer
const initialState: AppState = {
  products: [],
  loading: false,
  error: null
};

export const productReducer = createReducer(
  initialState,
  on(loadProducts, state => ({ ...state, loading: true })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

// 4. Effects
@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          map(products => loadProductsSuccess({ products })),
          catchError(error => of(loadProductsFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}
}

// 5. Selectors
export const selectProducts = (state: AppState) => state.products;
export const selectLoading = (state: AppState) => state.loading;
export const selectError = (state: AppState) => state.error;

// Usage in component
@Component({...})
export class ProductsComponent {
  products$ = this.store.select(selectProducts);
  loading$ = this.store.select(selectLoading);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(loadProducts());
  }
}
```

---

## Performance & Optimization

### Q6: What techniques improve Angular app performance?

**Answer:**
```typescript
// 1. OnPush Change Detection
@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComponent {}

// 2. Lazy Loading
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  }
];

// 3. TrackBy in ngFor
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

trackByFn(index: number, item: any) {
  return item.id; // Return unique identifier
}

// 4. Virtual Scrolling
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let item of items">{{ item }}</div>
</cdk-virtual-scroll-viewport>

// 5. Async Pipe (auto-unsubscribe)
{{ data$ | async }}

// 6. Unsubscribe management
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.process(data));
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// 7. Code splitting
const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboard.module') },
  { path: 'users', loadChildren: () => import('./users.module') }
];

// 8. Image optimization
<img 
  src="image.jpg"
  srcset="image-300w.jpg 300w, image-600w.jpg 600w"
  loading="lazy">

// 9. Tree shaking
// In package.json: "sideEffects": false

// 10. Bundlesize monitoring
ng build --prod --stats-json
webpack-bundle-analyzer dist/*/stats.json
```

---

## Testing & Quality

### Q7: How do you test Angular components?

**Answer:**
```typescript
// Unit testing with Jasmine/Karma
describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let service: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      providers: [
        {
          provide: ProductService,
          useValue: { getProduct: () => of({ id: 1, name: 'Test' }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ProductService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product', () => {
    fixture.detectChanges();
    expect(component.product$.subscribe(p => {
      expect(p.name).toBe('Test');
    }));
  });

  it('should call service on init', () => {
    spyOn(service, 'getProduct').and.returnValue(of({}));
    component.ngOnInit();
    expect(service.getProduct).toHaveBeenCalled();
  });
});

// E2E testing with Cypress
describe('Product Listing', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should display products', () => {
    cy.get('.product-card').should('have.length.greaterThan', 0);
  });

  it('should filter products', () => {
    cy.get('input[placeholder="Search"]').type('laptop');
    cy.get('.product-card').should('have.length', 5);
  });

  it('should add to cart', () => {
    cy.get('.product-card').first().find('button').click();
    cy.get('.cart-badge').should('contain', '1');
  });
});
```

---

## E-Commerce System Questions

### Q8: Design a shopping cart system

**Answer:**
See SYSTEMS/Ecommerce-System/interview-questions/architecture-questions.md - Q2

### Q9: How do you handle real-time inventory updates?

**Answer:**
```typescript
@Injectable({ providedIn: 'root' })
export class InventoryService {
  private inventory$ = new BehaviorSubject<Inventory>({});

  constructor(private websocket: WebSocketService) {
    // Connect to real-time inventory updates
    this.websocket.connect('wss://api.store.com/inventory').subscribe(
      update => this.handleInventoryUpdate(update)
    );
  }

  private handleInventoryUpdate(update: InventoryUpdate) {
    const currentInventory = this.inventory$.value;
    currentInventory[update.productId] = update.quantity;
    this.inventory$.next({ ...currentInventory });
  }

  getInventory(productId: string): Observable<number> {
    return this.inventory$.pipe(
      map(inv => inv[productId] || 0),
      distinctUntilChanged()
    );
  }

  isInStock(productId: string): Observable<boolean> {
    return this.getInventory(productId).pipe(
      map(qty => qty > 0)
    );
  }
}
```

### Q10: How do you optimize checkout process?

**Answer:**
- Progressive form validation
- Auto-save form state
- Lazy load payment methods
- Prefetch shipping options
- Cache pricing data
- Use service workers for offline support

---

## Healthcare System Questions

### Q11: How do you ensure HIPAA compliance?

**Answer:**
See SYSTEMS/Healthcare-System/interview-questions/security-questions.md - Q1-Q4

### Q12: How do you implement secure telemedicine?

**Answer:**
```typescript
// WebRTC for secure video calls
@Injectable({ providedIn: 'root' })
export class TelemedicineService {
  private peerConnection: RTCPeerConnection;

  async initiateTelehealth(patientId: string) {
    // Create peer connection with encryption
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
    });

    // Enable encryption
    const config: RTCConfiguration = {
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    };

    // Add media stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
      video: { width: 1280, height: 720 }
    });

    stream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, stream);
    });

    // Create and send offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    
    // Send to other party
    await this.signaling.sendOffer(patientId, offer);
  }
}
```

---

## Advanced Patterns

### Q13: Explain observable patterns and when to use each

**Answer:**

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Subject** | Manual emission | Event bus |
| **BehaviorSubject** | Current value + stream | Form state |
| **ReplaySubject** | Replay n values | Cached data |
| **AsyncSubject** | Single final value | Async operation result |

```typescript
// Subject - Event emitter
const clicks = new Subject<ClickEvent>();
clicks.subscribe(e => console.log(e));
clicks.next({ x: 10, y: 20 });

// BehaviorSubject - Current value tracking
const user$ = new BehaviorSubject<User | null>(null);
user$.subscribe(user => console.log(user)); // Immediately logs current user

// ReplaySubject - Buffer values
const buffer = new ReplaySubject(2); // Replay last 2
buffer.next('A');
buffer.next('B');
buffer.next('C');
buffer.subscribe(v => console.log(v)); // Logs B, C

// AsyncSubject - Only emit last value on complete
const async = new AsyncSubject();
async.next(1);
async.next(2);
async.next(3);
async.complete();
async.subscribe(v => console.log(v)); // Logs 3 only
```

---

### Q14: How do you handle errors in Angular?

**Answer:**
```typescript
// Global error handler
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logger: LoggingService) {}

  handleError(error: Error) {
    console.error('Error caught:', error);
    
    if (error instanceof TypeError) {
      this.logger.logError('Type Error', error);
    } else if (error instanceof ReferenceError) {
      this.logger.logError('Reference Error', error);
    } else {
      this.logger.logError('Unknown Error', error);
    }
  }
}

// HTTP error interceptor
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              this.handleUnauthorized();
              break;
            case 403:
              this.handleForbidden();
              break;
            case 404:
              this.handleNotFound();
              break;
            default:
              this.handleError(error);
          }
        }
        return throwError(() => error);
      })
    );
  }
}

// Reactive error handling
data$.pipe(
  catchError(error => {
    console.error('Operation failed', error);
    return of([]); // Fallback value
  }),
  retry(3), // Retry 3 times
  timeout(5000) // 5 second timeout
)
```

---

### Q15: How do you structure a large Angular application?

**Answer:**
```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   ├── http-interceptors/
│   │   ├── services/
│   │   └── core.module.ts
│   ├── shared/
│   │   ├── components/
│   │   ├── pipes/
│   │   ├── directives/
│   │   └── shared.module.ts
│   ├── features/
│   │   ├── products/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   ├── models/
│   │   │   ├── products.module.ts
│   │   │   └── products-routing.module.ts
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── admin/
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
├── assets/
├── styles/
├── environments/
└── index.html
```

---

## General Advice for Interviews

1. **Understand principles**: Know WHY not just HOW
2. **Code examples**: Always provide working code snippets
3. **Performance**: Discuss optimization in every answer
4. **Testing**: Mention how you'd test your solution
5. **Security**: Consider security implications
6. **Error handling**: Don't ignore error cases
7. **Real-world**: Reference actual project experience
8. **Trade-offs**: Discuss pros and cons

---

Good luck with your interviews! Remember to:
- Ask clarifying questions
- Think aloud
- Discuss trade-offs
- Show your thinking process
- Provide practical examples
