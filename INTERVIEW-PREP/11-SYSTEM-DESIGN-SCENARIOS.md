# System Design Scenarios for Angular Interviews

## Scenario 1: Real-Time Chat Application

**Requirements:**
- Messages sent/received in real-time
- User presence (online/offline)
- Message persistence
- Group chats support
- Notification system

**Architecture:**

```typescript
// State Management
interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  onlineUsers: Set<string>;
  loading: boolean;
  error: string | null;
}

// WebSocket Service
@Injectable({ providedIn: 'root' })
export class ChatService {
  private ws: WebSocket;
  private messages$ = new Subject<Message>();
  private presenceUpdates$ = new Subject<PresenceUpdate>();

  connect(userId: string): void {
    this.ws = new WebSocket(`wss://api.chat.com/ws?userId=${userId}`);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
  }

  sendMessage(conversationId: string, content: string): void {
    const message = {
      id: generateId(),
      conversationId,
      content,
      timestamp: Date.now(),
      status: 'sending'
    };

    this.messages$.next(message);
    this.ws.send(JSON.stringify(message));
  }

  getMessages(): Observable<Message> {
    return this.messages$.asObservable();
  }

  getPresence(): Observable<PresenceUpdate> {
    return this.presenceUpdates$.asObservable();
  }
}

// Component
@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <div class="conversations">
        <div *ngFor="let conv of conversations$ | async" 
             (click)="selectConversation(conv)">
          {{ conv.name }}
          <span *ngIf="(onlineUsers$ | async)?.has(conv.participantId)">🟢</span>
        </div>
      </div>
      
      <div class="messages">
        <div *ngFor="let msg of messages$ | async; trackBy: trackByMessage"
             [class.sent]="msg.userId === currentUserId">
          {{ msg.content }}
          <span class="timestamp">{{ msg.timestamp | date }}</span>
        </div>
      </div>
      
      <div class="input">
        <textarea #msgInput (keyup.enter)="sendMessage(msgInput.value)"></textarea>
        <button (click)="sendMessage(msgInput.value)">Send</button>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy {
  conversations$: Observable<Conversation[]>;
  messages$: Observable<Message[]>;
  onlineUsers$: Observable<Set<string>>;

  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.conversations$ = this.store.select(selectConversations);
    this.messages$ = this.store.select(selectMessages);
    this.onlineUsers$ = this.store.select(selectOnlineUsers);

    this.chatService.getPresence()
      .pipe(takeUntil(this.destroy$))
      .subscribe(update => {
        this.store.dispatch(updatePresence(update));
      });
  }

  sendMessage(content: string): void {
    if (!content.trim()) return;
    this.chatService.sendMessage(this.currentConversationId, content);
  }

  trackByMessage(index: number, msg: Message): string {
    return msg.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Key Considerations:**
- WebSocket connection management
- Message ordering
- Offline message queuing
- Scalability with message pagination
- Security: Message encryption, authentication

---

## Scenario 2: E-Commerce Product Catalog

**Requirements:**
- Display 10,000+ products
- Filter by category, price, rating
- Search with autocomplete
- Shopping cart
- Order placement

**Optimization Strategies:**

```typescript
// Virtual scrolling for large lists
@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="100" class="products-list">
      <app-product-card 
        *cdkVirtualFor="let product of products$ | async; 
                         trackBy: trackByProduct"
        [product]="product">
      </app-product-card>
    </cdk-virtual-scroll-viewport>
  `
})

// Smart caching strategy
@Injectable({ providedIn: 'root' })
export class ProductService {
  private cache$ = new Map<string, CacheEntry<Product[]>>();

  getProducts(filter: ProductFilter): Observable<Product[]> {
    const cacheKey = JSON.stringify(filter);
    const cached = this.cache$.get(cacheKey);

    if (cached && !this.isExpired(cached)) {
      return of(cached.data);
    }

    return this.http.get<Product[]>('/api/products', { params: filter }).pipe(
      tap(products => {
        this.cache$.set(cacheKey, {
          data: products,
          timestamp: Date.now(),
          ttl: 5 * 60 * 1000 // 5 minutes
        });
      }),
      shareReplay(1)
    );
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }
}

// Debounced search with request cancellation
@Component({
  template: `
    <input #search (input)="onSearch(search.value)">
    <div *ngIf="(suggestions$ | async) as suggestions">
      <div *ngFor="let suggestion of suggestions">{{ suggestion }}</div>
    </div>
  `
})
export class SearchComponent {
  suggestions$: Observable<string[]>;
  private searchTerm$ = new Subject<string>();

  constructor(private productService: ProductService) {
    this.suggestions$ = this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.productService.getAutocomplete(term)),
      shareReplay(1)
    );
  }

  onSearch(term: string): void {
    this.searchTerm$.next(term);
  }
}
```

**Performance Metrics:**
- Load time: <2s
- Time to interactive: <3s
- Largest contentful paint: <2s

---

## Scenario 3: Real-Time Dashboard

**Requirements:**
- Display metrics updated every second
- Multiple data sources
- User-customizable widgets
- Responsive charts

**Architecture:**

```typescript
// Polling strategy
@Injectable()
export class DashboardService {
  getMetrics(): Observable<Metrics> {
    return interval(1000).pipe(
      switchMap(() => this.http.get<Metrics>('/api/metrics')),
      shareReplay(1)
    );
  }
}

// Component with multiple subscriptions
@Component({
  template: `
    <div class="dashboard">
      <widget-card title="Revenue" [data]="revenue$ | async"></widget-card>
      <widget-card title="Users" [data]="users$ | async"></widget-card>
      <widget-card title="Orders" [data]="orders$ | async"></widget-card>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  revenue$: Observable<number>;
  users$: Observable<number>;
  orders$: Observable<number>;

  private destroy$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const metrics$ = this.dashboardService.getMetrics();

    this.revenue$ = metrics$.pipe(
      map(m => m.revenue),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );

    this.users$ = metrics$.pipe(
      map(m => m.users),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );

    this.orders$ = metrics$.pipe(
      map(m => m.orders),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Scenario 4: Multi-Tenant SaaS Application

**Requirements:**
- Multiple organizations
- Role-based access control
- Data isolation
- Custom branding per tenant

**Implementation:**

```typescript
// Tenant context
@Injectable({ providedIn: 'root' })
export class TenantService {
  private currentTenant$ = new BehaviorSubject<Tenant | null>(null);

  setTenant(tenant: Tenant): void {
    this.currentTenant$.next(tenant);
  }

  getTenant(): Observable<Tenant> {
    return this.currentTenant$.pipe(filter(t => t !== null));
  }
}

// Route guard for tenant validation
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private tenantService: TenantService) {}

  canActivate(): Observable<boolean> {
    return this.tenantService.getTenant().pipe(
      map(tenant => !!tenant),
      catchError(() => of(false))
    );
  }
}

// HTTP interceptor for tenant headers
@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private tenantService: TenantService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.tenantService.getTenant().pipe(
      take(1),
      switchMap(tenant => {
        const modifiedReq = req.clone({
          setHeaders: { 'X-Tenant-ID': tenant.id }
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
```

---

## Scenario 5: Real-Time Collaborative Editor

**Requirements:**
- Multiple users editing simultaneously
- Operational transformation (OT) for conflict resolution
- Real-time cursor positions
- Version history

**Key Implementation Points:**
- WebSocket for real-time updates
- Operational Transformation for conflict resolution
- Delta compression for bandwidth optimization
- Debounced auto-save

```typescript
// OT Service
@Injectable()
export class CollaborativeEditorService {
  private doc$ = new BehaviorSubject<Document>({});
  private version = 0;

  applyOperation(op: Operation): void {
    const currentDoc = this.doc$.value;
    const newDoc = this.transform(currentDoc, op);
    this.doc$.next(newDoc);
  }

  private transform(doc: any, op: Operation): any {
    // Implement OT algorithm
    return doc;
  }
}
```

---

**Interview Tips:**
1. Always discuss trade-offs
2. Consider scalability from start
3. Mention caching strategies
4. Discuss error handling
5. Address security concerns
6. Think about monitoring
7. Plan for future growth

