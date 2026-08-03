# Best Practices for Angular Development

Proven patterns and strategies for maintainable, scalable, and performant Angular applications.

## Table of Contents

1. [Component Best Practices](#component-best-practices)
2. [Service Patterns](#service-patterns)
3. [State Management](#state-management)
4. [Performance Optimization](#performance-optimization)
5. [Security Practices](#security-practices)
6. [Testing Best Practices](#testing-best-practices)
7. [Error Handling](#error-handling)
8. [Code Organization](#code-organization)

---

## Component Best Practices

### 1. Use OnPush Change Detection

```typescript
// ✅ GOOD: Improves performance by 30-50%
@Component({
  selector: 'app-user-card',
  template: `<div>{{ user.name }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user: User;
}

// ❌ BAD: Default strategy checks entire component tree
@Component({...})
export class UserCardComponent {
  @Input() user: User;
}
```

### 2. Implement OnDestroy for Cleanup

```typescript
// ✅ GOOD: Prevents memory leaks
@Component({...})
export class DataComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.items$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(items => {
      console.log(items);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ❌ BAD: Subscription never cleaned up
@Component({...})
export class DataComponent {
  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.data.items$.subscribe(...);
    // No cleanup = memory leak!
  }
}
```

### 3. Use Standalone Components (Angular 14+)

```typescript
// ✅ GOOD: Simpler, no NgModule needed
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<div>{{ user.name }}</div>`,
})
export class ProfileComponent {
  @Input() user: User;
}

// ❌ OLD: Requires NgModule
@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule]
})
export class UserModule { }
```

### 4. Lazy Load Routes

```typescript
// ✅ GOOD: Only loads when route is accessed
const routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];

// ❌ BAD: Loads everything upfront
const routes = [
  { path: 'admin', component: AdminComponent }
];
```

### 5. Use Smart/Dumb Components

```typescript
// ✅ Smart Component (Container)
@Component({
  selector: 'app-user-container',
  template: `
    <app-user-list [users]="users$ | async"></app-user-list>
  `,
})
export class UserContainerComponent implements OnInit {
  users$ = this.userService.getUsers();

  constructor(private userService: UserService) {}
}

// ✅ Dumb Component (Presentational)
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let user of users">{{ user.name }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  @Input() users: User[];
}
```

---

## Service Patterns

### 1. Singleton Services with providedIn

```typescript
// ✅ GOOD: Tree-shakeable singleton
@Injectable({ providedIn: 'root' })
export class UserService {
  // Only one instance application-wide
}

// ❌ OLD: Added to module providers
@Injectable()
export class UserService {}

@NgModule({
  providers: [UserService]
})
export class AppModule {}
```

### 2. Observable Subjects Pattern

```typescript
// ✅ GOOD: Reactive communication
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  readonly notifications = this.notifications$.asObservable();

  notify(message: string, type: 'success' | 'error'): void {
    const notification = { message, type, id: Date.now() };
    const current = this.notifications$.value;
    this.notifications$.next([...current, notification]);
  }

  removeNotification(id: number): void {
    const current = this.notifications$.value;
    this.notifications$.next(current.filter(n => n.id !== id));
  }
}

// Usage
constructor(private notifications: NotificationService) {}

onError(error: string) {
  this.notifications.notify(error, 'error');
}

// Subscribe
this.notifications.notifications.subscribe(list => {
  this.alerts = list;
});
```

### 3. Service with Caching

```typescript
// ✅ GOOD: Cache prevents redundant API calls
@Injectable({ providedIn: 'root' })
export class ProductService {
  private cache$ = new Map<string, Observable<Product[]>>();

  getProducts(category: string): Observable<Product[]> {
    if (!this.cache$.has(category)) {
      this.cache$.set(
        category,
        this.http.get<Product[]>(`/api/products?category=${category}`)
          .pipe(shareReplay(1)) // Share cached result
      );
    }
    return this.cache$.get(category);
  }

  invalidateCache(category: string): void {
    this.cache$.delete(category);
  }
}
```

### 4. Data Service with Error Handling

```typescript
// ✅ GOOD: Comprehensive error handling
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      retry(2), // Retry failed requests twice
      timeout(10000), // 10 second timeout
      catchError(error => {
        this.errorHandler.handle(error);
        return throwError(() => new Error('Failed to fetch data'));
      })
    );
  }
}
```

---

## State Management

### 1. NgRx Store Pattern

```typescript
// ✅ Actions
export const loadUsers = createAction(
  '[User Page] Load Users'
);

export const loadUsersSuccess = createAction(
  '[User API] Load Users Success',
  props<{ users: User[] }>()
);

// ✅ Reducer
export const usersReducer = createReducer(
  initialState,
  on(loadUsers, (state) => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  }))
);

// ✅ Effects
@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map(users => loadUsersSuccess({ users })),
          catchError(error => of(loadUsersFailure({ error })))
        )
      )
    )
  );
}

// ✅ Component
export class UserListComponent {
  users$ = this.store.select(selectUsers);
  loading$ = this.store.select(selectLoading);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(loadUsers());
  }
}
```

### 2. Local State Management (No NgRx)

```typescript
// ✅ Service-based state for simple cases
@Injectable({ providedIn: 'root' })
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([]);
  readonly todos = this.todos$.asObservable();

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false
    };
    this.todos$.next([...this.todos$.value, newTodo]);
  }

  toggleTodo(id: number): void {
    const updated = this.todos$.value.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.todos$.next(updated);
  }
}
```

---

## Performance Optimization

### 1. Virtual Scrolling for Large Lists

```typescript
// ✅ GOOD: Renders only visible items
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-large-list',
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="list">
      <div *cdkVirtualFor="let item of items" class="item">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  imports: [ScrollingModule]
})
export class LargeListComponent {
  items = Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
}
```

### 2. Image Optimization

```typescript
// ✅ GOOD: Responsive images with multiple formats
<picture>
  <source srcset="image.webp" type="image/webp" />
  <source srcset="image.jpg" type="image/jpeg" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

// ✅ Use native lazy loading
<img src="image.jpg" loading="lazy" alt="Description" />
```

### 3. Change Detection Optimization

```typescript
// ✅ Combine OnPush with async pipe
@Component({
  selector: 'app-user',
  template: `<div>{{ (user$ | async)?.name }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {
  @Input() userId: string;
  user$: Observable<User>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user$ = this.userId$.pipe(
      switchMap(id => this.userService.getUser(id))
    );
  }
}
```

### 4. Unsubscribe Properly

```typescript
// ✅ Using async pipe (auto-unsubscribe)
<div>{{ data$ | async }}</div>

// ✅ Using takeUntil
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(...);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// ✅ Using first() for one-time requests
this.userService.getUser(id)
  .pipe(first())
  .subscribe(user => this.user = user);
```

---

## Security Practices

### 1. Input Sanitization

```typescript
// ✅ GOOD: Sanitize user input
import { DomSanitizer, SecurityContext } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

render(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}

// ✅ Use [innerText] instead of [innerHTML] when possible
<div [innerText]="userInput"></div>

// ❌ DANGEROUS: Direct innerHTML
<div [innerHTML]="userInput"></div>
```

### 2. CSRF Protection

```typescript
// ✅ Angular automatically handles CSRF tokens
// HttpClient reads XSRF-TOKEN and adds X-XSRF-TOKEN header

// If needed, configure:
HttpClientModule.withXsrfConfiguration({
  cookieName: 'XSRF-TOKEN',
  headerName: 'X-XSRF-TOKEN'
})
```

### 3. Secure Environment Variables

```typescript
// ✅ environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com', // No secrets!
};

// ❌ NEVER store secrets in code
export const API_KEY = 'secret-key-here';

// ✅ Use backend proxy for sensitive operations
// Frontend -> Proxy (Node.js) -> External API
```

---

## Testing Best Practices

### 1. Unit Test with Mocks

```typescript
// ✅ GOOD: Isolated, fast tests
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'John' }];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

### 2. Component Testing with Fixtures

```typescript
// ✅ GOOD: Test component interaction
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display users', () => {
    component.users = [{ id: 1, name: 'John' }];
    fixture.detectChanges();

    const elem = fixture.nativeElement.querySelector('.user');
    expect(elem.textContent).toContain('John');
  });
});
```

### 3. E2E Testing

```typescript
// ✅ GOOD: User-centric testing
describe('User Dashboard', () => {
  it('should display user profile after login', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button:contains("Login")').click();

    cy.url().should('include', '/dashboard');
    cy.get('.user-name').should('contain', 'John Doe');
  });
});
```

---

## Error Handling

### 1. Global Error Handler

```typescript
// ✅ Custom ErrorHandler
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private injector: Injector,
    private logger: LoggerService
  ) {}

  handleError(error: Error | HttpErrorResponse) {
    const logger = this.injector.get(LoggerService);
    const chunkFailedMessage = /Loading chunk \d+ failed/g;

    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    }

    logger.error(error);
  }
}

// Register in app.module.ts
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
]
```

### 2. HTTP Error Interceptor

```typescript
// ✅ Handle HTTP errors globally
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.router.navigate(['/forbidden']);
        } else if (error.status >= 500) {
          console.error('Server error:', error);
        }
        return throwError(() => error);
      })
    );
  }
}
```

---

## Code Organization

### 1. Folder Structure

```
src/
├── app/
│   ├── core/                  # Singleton services
│   │   ├── auth/
│   │   ├── error-handler/
│   │   └── interceptors/
│   ├── shared/                # Reusable components
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── services/
│   ├── features/              # Feature modules
│   │   ├── users/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── users.module.ts
│   │   └── products/
│   ├── layouts/               # Page layouts
│   ├── app.component.ts
│   └── app.module.ts
├── assets/
├── styles/
├── environments/
└── index.html
```

### 2. Module Organization

```typescript
// ✅ Feature module with lazy loading
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent
  ]
})
export class UserModule {}

// Register with lazy loading
const routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(m => m.UserModule)
  }
];
```

---

## Summary Checklist

- [ ] Components use OnPush change detection
- [ ] Services use `providedIn: 'root'`
- [ ] Subscriptions are properly cleaned up
- [ ] Error handling is comprehensive
- [ ] Security best practices followed
- [ ] Performance optimized (lazy loading, virtual scroll)
- [ ] Tests cover 80%+ of code
- [ ] Code follows Angular style guide
- [ ] No console.log in production
- [ ] Accessibility compliance verified

