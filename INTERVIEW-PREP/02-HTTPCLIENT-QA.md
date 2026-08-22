# HttpClient Interview Questions & Answers

## Overview
15 comprehensive interview questions covering HttpClient, interceptors, caching, error handling, and advanced patterns.

---

## Q1: What are the main differences between HttpClientModule and HttpClient?

**Answer:**

HttpClientModule is the module that must be imported, while HttpClient is the service you inject and use.

```typescript
// In app.module.ts - Import the module
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule]
})
export class AppModule {}

// In any component/service - Inject and use HttpClient
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get('/api/users');
  }
}
```

**Key differences:**
| Feature | HttpClientModule | HttpClient |
|---------|-----------------|-----------|
| **Type** | NgModule | Service (Injectable) |
| **Purpose** | Register HTTP system | Make HTTP requests |
| **Import location** | app.module.ts | Services/Components |
| **Configuration** | Provides dependencies | Uses those dependencies |

---

## Q2: Explain HTTP interceptors and how to create one

**Answer:**

```typescript
// Interceptor interface
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    
    console.log('Outgoing request:', req.method, req.url);

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          console.log(`Response received: ${req.url} (${duration}ms)`);
        }
      }),
      catchError(error => {
        console.error('Request error:', error);
        return throwError(() => error);
      })
    );
  }
}

// Register in app.module.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true // Important: allows multiple interceptors
    }
  ]
})
export class AppModule {}

// Common interceptor types:

// 1. Authentication Interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      // Clone request and add authorization header
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req);
  }
}

// 2. Error Handling Interceptor
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              // Handle unauthorized
              this.router.navigate(['/login']);
              break;
            case 403:
              // Handle forbidden
              console.error('Access forbidden');
              break;
            case 404:
              // Handle not found
              console.error('Resource not found');
              break;
            case 500:
              // Handle server error
              console.error('Server error');
              break;
          }
        }
        return throwError(() => error);
      })
    );
  }
}

// 3. Retry Interceptor
@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(3), // Retry 3 times on error
      catchError(error => throwError(() => error))
    );
  }
}
```

---

## Q3: How do you add custom headers using interceptors?

**Answer:**

```typescript
@Injectable()
export class CustomHeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone request and add headers
    const modifiedReq = req.clone({
      setHeaders: {
        'X-Custom-Header': 'CustomValue',
        'Content-Type': 'application/json',
        'X-Request-ID': this.generateRequestId()
      }
    });

    return next.handle(modifiedReq);
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random()}`;
  }
}

// More advanced: Conditional headers
@Injectable()
export class ConditionalHeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = req.headers;

    // Add API key for external API calls
    if (req.url.includes('external-api.com')) {
      headers = headers.set('X-API-Key', 'your-api-key');
    }

    // Add custom header for specific methods
    if (req.method === 'POST' || req.method === 'PUT') {
      headers = headers.set('X-Requested-With', 'XMLHttpRequest');
    }

    const modifiedReq = req.clone({ headers });
    return next.handle(modifiedReq);
  }
}
```

---

## Q4: Implement HTTP request caching

**Answer:**

```typescript
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in ms
}

@Injectable({ providedIn: 'root' })
export class HttpCacheService {
  private cache = new Map<string, CacheEntry>();

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cacheService: HttpCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // Check cache
    const cachedData = this.cacheService.get(req.url);
    if (cachedData) {
      return of(new HttpResponse({ body: cachedData, status: 200 }));
    }

    // Make request and cache response
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.set(req.url, event.body);
        }
      })
    );
  }
}
```

---

## Q5: How do you handle HTTP errors globally?

**Answer:**

```typescript
@Injectable()
export class GlobalErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let message = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      message = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          message = 'Network error. Check your connection.';
          break;
        case 400:
          message = error.error?.message || 'Bad request';
          break;
        case 401:
          message = 'Unauthorized. Please login.';
          this.router.navigate(['/login']);
          break;
        case 403:
          message = 'Access forbidden';
          break;
        case 404:
          message = 'Resource not found';
          break;
        case 409:
          message = 'Conflict. Resource already exists.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        case 503:
          message = 'Service unavailable. Please try again later.';
          break;
        default:
          message = `Error: ${error.statusText}`;
      }

      console.error(`HTTP Error [${error.status}]: ${error.url}`, error);
    }

    this.notificationService.showError(message);
  }
}
```

---

## Q6: Implement retry logic with exponential backoff

**Answer:**

```typescript
@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't retry non-idempotent requests
    if (this.isNonIdempotent(req.method)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          // Exponential backoff: 1s, 2s, 4s
          const delayMs = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying request (attempt ${retryCount + 1}), waiting ${delayMs}ms`);
          return timer(delayMs);
        }
      }),
      catchError(error => throwError(() => error))
    );
  }

  private isNonIdempotent(method: string): boolean {
    return ['POST', 'DELETE', 'PATCH'].includes(method);
  }
}

// Alternative using rxjs operators
export class AdvancedRetryInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            const retryCount = index + 1;
            const maxRetries = 3;

            if (retryCount > maxRetries || !this.isRetryableError(error)) {
              return throwError(() => error);
            }

            const delayMs = Math.pow(2, retryCount) * 1000;
            console.log(`Retry attempt ${retryCount} after ${delayMs}ms`);
            
            return timer(delayMs);
          })
        )
      )
    );
  }

  private isRetryableError(error: any): boolean {
    if (!(error instanceof HttpErrorResponse)) {
      return true; // Retry network errors
    }

    // Don't retry client errors (4xx) except timeouts
    if (error.status >= 400 && error.status < 500) {
      return error.status === 408 || error.status === 429;
    }

    // Retry server errors (5xx)
    return error.status >= 500;
  }
}
```

---

## Q7: How do you handle file uploads with progress tracking?

**Answer:**

```typescript
@Injectable({ providedIn: 'root' })
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, endpoint: string): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const request = new HttpRequest('POST', endpoint, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(request);
  }

  uploadMultipleFiles(files: File[], endpoint: string): Observable<any> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    return this.http.post(endpoint, formData, {
      reportProgress: true
    });
  }
}

@Component({
  selector: 'app-file-upload',
  template: `
    <input type="file" #fileInput (change)="onFileSelected($event)">
    <div *ngIf="uploadProgress$ | async as progress" class="progress-bar">
      {{ progress }}%
    </div>
    <div *ngIf="uploadError$ | async as error" class="error">
      {{ error }}
    </div>
  `
})
export class FileUploadComponent {
  uploadProgress$ = new BehaviorSubject<number>(0);
  uploadError$ = new BehaviorSubject<string | null>(null);

  constructor(private uploadService: FileUploadService) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    this.uploadService.uploadFile(file, '/api/upload').subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round((100 * event.loaded) / event.total);
          this.uploadProgress$.next(progress);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress$.next(100);
          console.log('Upload complete:', event.body);
        }
      },
      error => {
        this.uploadError$.next('Upload failed');
      }
    );
  }
}
```

---

## Q8: Implement request timeout handling

**Answer:**

```typescript
@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly defaultTimeout = 30000; // 30 seconds

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeout = this.getTimeout(req);

    return next.handle(req).pipe(
      timeout(timeout),
      catchError(error => {
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Request timeout'));
        }
        return throwError(() => error);
      })
    );
  }

  private getTimeout(req: HttpRequest<any>): number {
    // Different timeouts for different endpoints
    if (req.url.includes('/upload')) {
      return 60000; // 60 seconds for uploads
    }
    if (req.url.includes('/download')) {
      return 120000; // 120 seconds for downloads
    }
    return this.defaultTimeout;
  }
}

// Alternative: Using timer and takeUntil
export class TimeoutInterceptorAlt implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      takeUntil(
        timer(30000).pipe(
          tap(() => console.warn('Request timeout detected'))
        )
      ),
      catchError(error => throwError(() => error))
    );
  }
}
```

---

## Q9: How do you handle CORS in Angular HttpClient?

**Answer:**

```typescript
// Backend configuration (Node.js/Express example)
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// In Angular - Interceptor to handle CORS
@Injectable()
export class CorsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const corsRequest = req.clone({
      withCredentials: true // Include cookies in cross-origin requests
    });

    return next.handle(corsRequest);
  }
}

// For local development - Use proxy configuration
// proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}

// Run development server with proxy
// ng serve --proxy-config proxy.conf.json
```

---

## Q10: Implement response transformation/mapping

**Answer:**

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>('/api/users').pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`/api/users/${id}`).pipe(
      map(response => this.transformUser(response.data)),
      catchError(() => throwError(() => new Error('User not found')))
    );
  }

  private transformUser(user: any): User {
    return {
      id: user.id,
      name: user.full_name || user.name,
      email: user.email_address || user.email
    };
  }
}

// Global transformation interceptor
@Injectable()
export class TransformInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.body) {
          // Transform response body
          const transformed = this.transformResponse(event.body);
          return event.clone({ body: transformed });
        }
        return event;
      })
    );
  }

  private transformResponse(body: any): any {
    // Apply transformations globally if needed
    return body;
  }
}
```

---

## Q11: How do you handle concurrent requests?

**Answer:**

```typescript
@Injectable({ providedIn: 'root' })
export class ConcurrentRequestService {
  constructor(private http: HttpClient) {}

  // Get multiple resources in parallel
  getMultipleUsers(ids: number[]): Observable<User[]> {
    const requests = ids.map(id => 
      this.http.get<User>(`/api/users/${id}`)
    );

    return forkJoin(requests);
  }

  // Race multiple requests
  fastestRequest(endpoints: string[]): Observable<any> {
    const requests = endpoints.map(url => this.http.get(url));
    return race(...requests);
  }

  // Combine results from multiple endpoints
  getDashboardData(): Observable<DashboardData> {
    return combineLatest([
      this.http.get<User[]>('/api/users'),
      this.http.get<Product[]>('/api/products'),
      this.http.get<Order[]>('/api/orders')
    ]).pipe(
      map(([users, products, orders]) => ({
        users,
        products,
        orders,
        timestamp: new Date()
      }))
    );
  }

  // Sequential requests with dependencies
  getOrderWithDetails(orderId: number): Observable<OrderDetails> {
    return this.http.get<Order>(`/api/orders/${orderId}`).pipe(
      switchMap(order =>
        forkJoin([
          of(order),
          this.http.get<User>(`/api/users/${order.userId}`),
          this.http.get<Product[]>(`/api/orders/${orderId}/products`)
        ])
      ),
      map(([order, user, products]) => ({
        order,
        user,
        products
      }))
    );
  }

  // Limit concurrent requests
  limitedConcurrentRequests(ids: number[], limit: number = 3): Observable<User[]> {
    const requests = ids.map(id => 
      this.http.get<User>(`/api/users/${id}`)
    );

    return from(requests).pipe(
      mergeMap(req => req, limit),
      toArray()
    );
  }
}
```

---

## Q12: Implement request cancellation

**Answer:**

```typescript
@Injectable({ providedIn: 'root' })
export class CancellableHttpService {
  private requestSubjects = new Map<string, Subject<void>>();

  constructor(private http: HttpClient) {}

  get<T>(url: string, requestId: string): Observable<T> {
    const abort$ = this.getAbortSignal(requestId);

    return this.http.get<T>(url).pipe(
      takeUntil(abort$),
      finalize(() => this.cleanup(requestId))
    );
  }

  cancel(requestId: string): void {
    const subject = this.requestSubjects.get(requestId);
    if (subject) {
      subject.next();
      subject.complete();
    }
  }

  private getAbortSignal(requestId: string): Subject<void> {
    if (!this.requestSubjects.has(requestId)) {
      this.requestSubjects.set(requestId, new Subject<void>());
    }
    return this.requestSubjects.get(requestId)!;
  }

  private cleanup(requestId: string): void {
    this.requestSubjects.delete(requestId);
  }
}

@Component({
  selector: 'app-search',
  template: `
    <input #searchInput (input)="onSearch($event)">
    <button (click)="cancelSearch()">Cancel</button>
    <ul>
      <li *ngFor="let result of results$ | async">{{ result.name }}</li>
    </ul>
  `
})
export class SearchComponent implements OnInit, OnDestroy {
  results$ = new Observable<any[]>();
  private searchId = 'search-request';
  private destroy$ = new Subject<void>();

  constructor(private httpService: CancellableHttpService) {}

  ngOnInit(): void {
    // Initialize results
  }

  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    
    if (!query) {
      this.cancelSearch();
      return;
    }

    this.results$ = this.httpService.get(
      `/api/search?q=${query}`,
      this.searchId
    );
  }

  cancelSearch(): void {
    this.httpService.cancel(this.searchId);
  }

  ngOnDestroy(): void {
    this.cancelSearch();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Q13: How do you test HttpClient services?

**Answer:**

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should fetch users', () => {
    const mockUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('User 1');
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should handle errors', () => {
    service.getUsers().subscribe(
      () => fail('Should have failed'),
      error => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('/api/users');
    req.error(new ErrorEvent('Network error'), { status: 500 });
  });

  it('should send POST request with data', () => {
    const newUser = { id: 3, name: 'User 3' };

    service.createUser(newUser).subscribe(user => {
      expect(user.id).toBe(3);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(newUser);
  });
});
```

---

## Q14: Best practices for HttpClient usage

**Answer:**

```
✅ BEST PRACTICES:

1. Always unsubscribe
   - Use takeUntil() pattern
   - Use async pipe when possible

2. Create dedicated services
   - Encapsulate API logic
   - Easier to test
   - Reusable across components

3. Use interceptors wisely
   - Auth headers
   - Error handling
   - Logging
   - LIMIT: 2-3 interceptors per app

4. Handle errors gracefully
   - Provide user feedback
   - Log technical errors
   - Fallback values

5. Implement caching
   - Cache GET requests
   - Invalidate when needed
   - Consider cache size

6. Set appropriate timeouts
   - Different for different operations
   - Prevent hanging requests
   - Show timeout errors to users

7. Use shareReplay for multiple subscribers
   - Prevent duplicate requests
   - Better performance

8. Type your responses
   - Use interfaces for API contracts
   - Enables intellisense
   - Easier refactoring

9. Avoid nested subscriptions
   - Use switchMap, mergeMap, etc.
   - Better for performance
   - Easier to read

10. Test with HttpTestingController
    - Mock HTTP responses
    - Verify request details
    - Test error scenarios

11. Use proper HTTP methods
    - GET for retrieval
    - POST for creation
    - PUT/PATCH for updates
    - DELETE for deletion

12. Consider response transformation
    - Transform API responses to application format
    - Decouple from backend API
    - Easier API migrations
```

---

## Q15: How do you secure HTTP requests?

**Answer:**

```typescript
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Add authorization token
    const token = this.tokenService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 2. Add security headers
    req = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Security-Policy': "default-src 'self'"
      }
    });

    // 3. Refresh token if needed
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.handleUnauthorized(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorized(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.tokenService.refreshToken().pipe(
      switchMap(newToken => {
        const newReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next.handle(newReq);
      }),
      catchError(() => {
        // Redirect to login
        window.location.href = '/login';
        return throwError(() => new Error('Authentication failed'));
      })
    );
  }
}

// Token service for managing JWT tokens securely
@Injectable({ providedIn: 'root' })
export class TokenService {
  private token: string | null = null;

  getToken(): string | null {
    if (!this.token) {
      // Load from secure storage, NOT localStorage
      this.token = sessionStorage.getItem('auth_token');
    }
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('auth_token');
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ token: string }>('/api/refresh-token', {}).pipe(
      tap(response => this.setToken(response.token)),
      map(response => response.token)
    );
  }
}
```

---

**Key Takeaway:** Master HttpClient for efficient backend communication. Use interceptors for cross-cutting concerns, implement proper error handling, and always prioritize security.

