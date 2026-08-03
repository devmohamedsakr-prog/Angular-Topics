# E-Commerce System - Architecture Interview Questions

## System Design Level

### Q1: How would you architect a scalable e-commerce system using Angular?

**Answer:**
```
Multi-layer architecture:

Presentation Layer (Angular)
├── Components (Product, Cart, Checkout)
├── Pages/Containers (Smart components)
└── Shared UI (Dumb components)

State Management Layer (NgRx)
├── Store (State tree)
├── Actions (Events)
├── Reducers (Pure functions)
└── Effects (Side effects)

Service Layer
├── HTTP Client (API calls)
├── Authentication Service
├── Payment Service
├── Notification Service
└── Real-time Service (WebSocket)

Data Layer
├── Cache Strategy (Lazy, Network-first)
├── Local Storage (Cart, preferences)
├── Session Storage (Temporary data)
└── IndexedDB (Large datasets)

API Layer (Backend integration)
├── REST endpoints
├── WebSocket connections
├── GraphQL (optional)
└── Real-time updates
```

**Key Decisions:**
- **State Management**: Use NgRx for complex flows
- **Module Organization**: Feature modules per business domain
- **Lazy Loading**: Load features on demand
- **Caching**: Implement smart caching strategy
- **Real-time**: WebSocket for order updates

---

### Q2: How do you handle cart persistence in offline scenarios?

**Answer:**
```typescript
@Injectable({ providedIn: 'root' })
export class CartPersistenceService {
  
  // Multi-layer persistence
  private readonly CACHE_KEY = 'cart_v1';
  
  /**
   * Save cart to multiple storage layers
   */
  saveCart(cart: Cart): void {
    // 1. Memory (fast access)
    this.cartInMemory = cart;
    
    // 2. LocalStorage (survives page reload)
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cart));
    
    // 3. IndexedDB (for large datasets)
    this.saveToIndexedDB(cart);
    
    // 4. Server (async when online)
    if (navigator.onLine) {
      this.syncToServer(cart);
    } else {
      // Queue for sync when online
      this.backgroundSync.queueForSync({
        action: 'save_cart',
        data: cart,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Load cart with fallback strategy
   */
  loadCart(): Observable<Cart> {
    return this.cartService.getCart().pipe(
      catchError(error => {
        // If server fails, try IndexedDB
        return this.loadFromIndexedDB();
      }),
      catchError(error => {
        // If IndexedDB fails, try localStorage
        return of(this.loadFromLocalStorage());
      }),
      catchError(error => {
        // If all fail, return empty cart
        return of(this.getEmptyCart());
      })
    );
  }

  /**
   * Sync cart when connection restored
   */
  private syncToServer(cart: Cart): Observable<void> {
    return this.http.post('/api/cart/sync', cart).pipe(
      tap(() => console.log('Cart synced')),
      catchError(error => {
        // Queue for later sync
        this.backgroundSync.queueForSync({
          action: 'sync_cart',
          data: cart
        });
        return of(void 0);
      })
    );
  }
}

// Usage in cart component
export class CartComponent implements OnInit {
  cart$ = this.cartPersistence.loadCart();

  constructor(private cartPersistence: CartPersistenceService) {}

  addItem(product: Product) {
    this.cart$.pipe(
      take(1),
      tap(cart => {
        cart.items.push(product);
        this.cartPersistence.saveCart(cart);
      })
    ).subscribe();
  }
}
```

---

### Q3: How would you implement a real-time order tracking system?

**Answer:**
```typescript
// WebSocket service for real-time updates
@Injectable({ providedIn: 'root' })
export class OrderTrackingService {
  private socket$: WebSocketSubject<any>;
  private orders$ = new BehaviorSubject<Order[]>([]);

  constructor(private webSocketService: WebSocketService) {}

  /**
   * Connect to order updates
   */
  subscribeToOrders(userId: string): Observable<Order[]> {
    this.socket$ = this.webSocketService.connect(
      `wss://api.example.com/orders/${userId}`
    );

    this.socket$.pipe(
      tap(message => {
        const currentOrders = this.orders$.value;
        const updatedOrder = message.data;
        
        // Update existing order or add new
        const index = currentOrders.findIndex(o => o.id === updatedOrder.id);
        if (index >= 0) {
          currentOrders[index] = updatedOrder;
        } else {
          currentOrders.push(updatedOrder);
        }
        
        this.orders$.next([...currentOrders]);
      }),
      catchError(error => {
        // Fallback to polling if WebSocket fails
        return this.pollOrders(userId);
      })
    ).subscribe();

    return this.orders$.asObservable();
  }

  /**
   * Fallback to polling when WebSocket unavailable
   */
  private pollOrders(userId: string): Observable<Order[]> {
    return interval(5000).pipe(
      switchMap(() => this.http.get<Order[]>(`/api/orders/${userId}`)),
      tap(orders => this.orders$.next(orders))
    );
  }

  /**
   * Real-time status updates
   */
  getOrderStatusUpdates(orderId: string): Observable<OrderStatus> {
    return this.socket$.pipe(
      filter(msg => msg.orderId === orderId),
      map(msg => msg.status),
      distinctUntilChanged()
    );
  }
}

// Component usage
@Component({
  selector: 'app-order-tracking',
  template: `
    <div *ngFor="let order of orders$ | async" class="order-card">
      <h3>Order #{{ order.id }}</h3>
      <div class="status">{{ order.status }}</div>
      <div class="timeline">
        <div [ngClass]="'step-' + order.status">
          <span>Processing</span>
          <span>Shipped</span>
          <span>Delivered</span>
        </div>
      </div>
    </div>
  `
})
export class OrderTrackingComponent implements OnInit {
  orders$: Observable<Order[]>;

  constructor(private orderTracking: OrderTrackingService) {}

  ngOnInit() {
    this.orders$ = this.orderTracking.subscribeToOrders(this.userId);
  }
}
```

---

### Q4: How do you optimize product listing for performance and SEO?

**Answer:**
```typescript
// Product listing with ALL optimizations
@Component({
  selector: 'app-product-listing',
  template: `
    <div class="products-container">
      <!-- SEO Meta Tags -->
      <ng-container *ngIf="currentPage$ | async as page">
        <meta [attr.name]="'description'" 
          [content]="'Browse ' + page.category + ' products | MyStore'">
        <meta [attr.name]="'keywords'" 
          [content]="page.keywords">
      </ng-container>

      <!-- Search & Filter (Responsive) -->
      <form [formGroup]="filterForm" class="filters">
        <input 
          formControlName="search"
          placeholder="Search products..."
          (input)="onSearch($event)">
        
        <select formControlName="category">
          <option *ngFor="let cat of categories$ | async" 
            [value]="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </form>

      <!-- Virtual Scrolling for Performance -->
      <cdk-virtual-scroll-viewport itemSize="350" class="products-grid">
        <app-product-card 
          *cdkVirtualFor="let product of filteredProducts$ | async; trackBy: trackByProductId"
          [product]="product"
          (productClicked)="onProductClick($event)">
        </app-product-card>
      </cdk-virtual-scroll-viewport>

      <!-- Pagination -->
      <mat-paginator 
        [pageSizeOptions]="[20, 50, 100]"
        [pageSize]="pageSize$ | async"
        [length]="totalProducts$ | async"
        (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      padding: 16px;
    }

    /* Responsive */
    @media (max-width: 600px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (min-width: 601px) and (max-width: 1024px) {
      .products-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListingComponent implements OnInit {
  filteredProducts$: Observable<Product[]>;
  categories$: Observable<Category[]>;
  pageSize$ = new BehaviorSubject(20);
  totalProducts$: Observable<number>;
  currentPage$: Observable<Page>;

  filterForm: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private seoService: SeoService,
    private vitalsService: CoreWebVitalsService
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      priceRange: [{ min: 0, max: 1000 }]
    });
  }

  ngOnInit() {
    // Search with debounce to prevent excessive API calls
    this.filteredProducts$ = this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(filters => 
        this.productService.searchProducts(filters)
      ),
      shareReplay(1)
    );

    // Lazy load categories
    this.categories$ = this.productService.getCategories().pipe(
      shareReplay(1)
    );

    // Update SEO for current page
    this.currentPage$.subscribe(page => {
      this.seoService.updateSeoData({
        title: `${page.category} Products | MyStore`,
        description: `Browse our collection of ${page.category} products`,
        image: page.heroImage
      });
    });

    // Monitor Core Web Vitals
    this.vitalsService.vitals$.subscribe(vital => {
      if (vital.rating === 'poor') {
        console.warn(`${vital.name} is poor: ${vital.value}`);
      }
    });
  }

  /**
   * TrackBy for virtual scroll - critical for performance
   */
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    
    // Update URL for bookmarking/sharing
    this.router.navigate([], {
      queryParams: { search: query },
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize$.next(event.pageSize);
    window.scrollTo(0, 0); // Scroll to top
  }
}
```

---

### Q5: How would you handle payment processing securely?

**Answer:**
```typescript
// PCI-compliant payment processing
@Injectable({ providedIn: 'root' })
export class PaymentService {
  
  /**
   * Process payment with Stripe (never handle sensitive data client-side)
   */
  processPayment(amount: number, orderId: string): Observable<PaymentResult> {
    // 1. Create payment intent on backend
    return this.http.post('/api/payments/create-intent', {
      amount,
      orderId
    }).pipe(
      // 2. Get client secret from backend
      switchMap(intent => this.initializeStripe(intent.clientSecret)),
      
      // 3. Confirm payment
      switchMap(result => {
        if (result.paymentIntent.status === 'succeeded') {
          return this.createOrder(orderId);
        } else {
          throw new Error('Payment failed');
        }
      }),
      
      // 4. Handle errors securely
      catchError(error => {
        // Log error securely (never log sensitive data)
        this.errorService.logPaymentError({
          orderId,
          timestamp: new Date(),
          errorType: error.type,
          message: error.message // NO sensitive data
        });
        
        return throwError(() => new Error('Payment processing failed'));
      })
    );
  }

  /**
   * Never store card information on client
   * Use Stripe Elements for secure tokenization
   */
  private initializeStripe(clientSecret: string): Observable<any> {
    // Use Stripe.js library
    const stripe = Stripe(this.stripeKey);
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    
    return new Observable(observer => {
      stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: 'User Name' }
        }
      }).then(result => {
        if (result.error) {
          observer.error(result.error);
        } else {
          observer.next(result);
        }
        observer.complete();
      });
    });
  }

  /**
   * Validate payment before processing
   */
  validatePayment(payment: Payment): ValidationResult {
    const errors: string[] = [];
    
    if (!payment.amount || payment.amount <= 0) {
      errors.push('Invalid amount');
    }
    
    if (!payment.orderId) {
      errors.push('Order ID missing');
    }
    
    if (!payment.customerId) {
      errors.push('Customer information missing');
    }
    
    return { valid: errors.length === 0, errors };
  }
}

// Secure payment HTTP interceptor
@Injectable()
export class PaymentInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only apply to payment endpoints
    if (req.url.includes('/api/payments')) {
      // Add security headers
      const secureReq = req.clone({
        setHeaders: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      });
      
      return next.handle(secureReq).pipe(
        catchError(error => {
          // Log security-relevant errors
          if (error.status === 401 || error.status === 403) {
            console.error('Unauthorized payment attempt');
          }
          return throwError(() => error);
        })
      );
    }
    
    return next.handle(req);
  }
}

// Component usage
@Component({
  selector: 'app-checkout-payment',
  template: `
    <form [formGroup]="paymentForm" (ngSubmit)="onPayment()">
      <!-- Stripe Elements (secure) -->
      <div #cardElement></div>
      
      <button 
        [disabled]="paymentForm.invalid || processing"
        type="submit">
        {{ processing ? 'Processing...' : 'Pay Now' }}
      </button>
      
      <div *ngIf="error" class="error">{{ error }}</div>
    </form>
  `
})
export class CheckoutPaymentComponent {
  paymentForm: FormGroup;
  processing = false;
  error: string | null = null;

  constructor(
    private payment: PaymentService,
    private fb: FormBuilder,
    private order: OrderService
  ) {
    this.paymentForm = this.fb.group({
      amount: [0, Validators.required],
      orderId: ['', Validators.required]
    });
  }

  onPayment() {
    this.processing = true;
    this.error = null;

    const { amount, orderId } = this.paymentForm.value;

    this.payment.processPayment(amount, orderId)
      .subscribe({
        next: (result) => {
          console.log('Payment successful');
          this.processing = false;
        },
        error: (err) => {
          this.error = 'Payment failed. Please try again.';
          this.processing = false;
        }
      });
  }
}
```

---

### Q6: How do you implement state management for complex shopping flows?

See NgRx/State Management examples in Topic #4 and #8.

---

### Q7: How would you test an e-commerce system comprehensively?

See Testing strategy in Topic #1 (E2E Testing) and Topic #6 (Performance).

---

### Q8: What caching strategy would you use for product data?

**Answer:**
Multi-tier caching:
1. **Browser Cache**: Service Worker + Cache API
2. **Memory Cache**: In-memory with TTL
3. **Local Storage**: Persistent across sessions
4. **Server Cache**: Redis/Memcached
5. **CDN Cache**: For static assets

```typescript
@Injectable()
export class ProductCacheService {
  private cache = new Map<string, CachedProduct>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  getProduct(id: string): Observable<Product> {
    const cached = this.cache.get(id);
    
    if (cached && !this.isExpired(cached)) {
      return of(cached.data);
    }

    return this.http.get<Product>(`/api/products/${id}`).pipe(
      tap(product => {
        this.cache.set(id, {
          data: product,
          timestamp: Date.now()
        });
      })
    );
  }

  private isExpired(cached: CachedProduct): boolean {
    return Date.now() - cached.timestamp > this.TTL;
  }
}
```

This comprehensive approach ensures optimal performance, reliability, and user experience for an e-commerce platform.
