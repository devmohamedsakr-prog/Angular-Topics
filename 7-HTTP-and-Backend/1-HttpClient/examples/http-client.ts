/**
 * HttpClient - Complete Examples
 * Demonstrates GET, POST, PUT, DELETE, interceptors, error handling, and retry logic
 */

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import {
  catchError,
  retry,
  timeout,
  tap,
  shareReplay,
  switchMap,
  finalize,
  retryWhen,
  delay,
  take,
} from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Basic HTTP Requests (GET, POST, PUT, DELETE)
// ============================================================================

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly apiUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) {}

  // GET request
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      timeout(10000), // 10 second timeout
      retry(2) // Retry up to 2 times on failure
    );
  }

  // GET with parameters
  searchUsers(searchTerm: string, limit: number): Observable<User[]> {
    const params = new HttpParams()
      .set('search', searchTerm)
      .set('limit', limit.toString());

    return this.http.get<User[]>(this.apiUrl, { params });
  }

  // GET single item
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // POST request
  createUser(user: Omit<User, 'id'>): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<User>(this.apiUrl, user, { headers }).pipe(
      tap((createdUser) => console.log('User created:', createdUser)),
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(() => error);
      })
    );
  }

  // PUT request (full update)
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      tap((updated) => console.log('User updated:', updated))
    );
  }

  // PATCH request (partial update)
  partialUpdateUser(
    id: number,
    updates: Partial<User>
  ): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, updates);
  }

  // DELETE request
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('User deleted:', id))
    );
  }

  // HEAD request (check if resource exists)
  userExists(id: number): Observable<HttpResponse<void>> {
    return this.http.head<void>(`${this.apiUrl}/${id}`, {
      observe: 'response',
    });
  }
}

// ============================================================================
// EXAMPLE 2: Request/Response Interceptor
// ============================================================================

/**
 * Add authentication token to all requests
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get auth token
    const token = this.authService.getToken();

    // Add token to request
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req);
  }
}

/**
 * Log all HTTP requests and responses
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const start = Date.now();

    console.log(`[HTTP] ${req.method} ${req.url}`);

    return next.handle(req).pipe(
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - start;
          console.log(
            `[HTTP] ${req.method} ${req.url} completed in ${elapsed}ms`
          );
        }
      }),
      catchError((error) => {
        const elapsed = Date.now() - start;
        console.error(
          `[HTTP] ${req.method} ${req.url} failed after ${elapsed}ms`
        );
        return throwError(() => error);
      })
    );
  }
}

/**
 * Add request/response headers
 */
@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Add custom headers
    req = req.clone({
      setHeaders: {
        'X-Client-Version': '1.0.0',
        'X-Request-ID': this.generateRequestId(),
      },
    });

    return next.handle(req);
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// EXAMPLE 3: Error Handling Interceptor
// ============================================================================

/**
 * Handle HTTP errors globally
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private errorService: ErrorService
  ) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          console.error('Client-side error:', error.error);
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

          // Handle specific status codes
          switch (error.status) {
            case 400:
              this.errorService.showError('Bad Request: Invalid data');
              break;

            case 401:
              this.errorService.showError('Unauthorized: Please login');
              this.router.navigate(['/login']);
              break;

            case 403:
              this.errorService.showError('Forbidden: Access denied');
              this.router.navigate(['/forbidden']);
              break;

            case 404:
              this.errorService.showError('Not Found: Resource does not exist');
              break;

            case 409:
              this.errorService.showError('Conflict: Resource already exists');
              break;

            case 429:
              this.errorService.showError(
                'Too Many Requests: Please try again later'
              );
              break;

            case 500:
              this.errorService.showError('Server Error: Please try again');
              break;

            case 503:
              this.errorService.showError('Service Unavailable: Try again later');
              break;

            default:
              this.errorService.showError(errorMessage);
          }
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

// ============================================================================
// EXAMPLE 4: Retry Logic with Exponential Backoff
// ============================================================================

/**
 * Retry with exponential backoff strategy
 */
@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Don't retry non-idempotent requests (POST, PUT, DELETE)
    const isIdempotent =
      req.method === 'GET' ||
      req.method === 'HEAD' ||
      req.method === 'OPTIONS';

    if (!isIdempotent) {
      return next.handle(req);
    }

    // Retry with exponential backoff
    return next.handle(req).pipe(
      retryWhen((errors) =>
        errors.pipe(
          switchMap((error, index) => {
            // Don't retry on client errors (4xx)
            if (error instanceof HttpErrorResponse && error.status < 500) {
              return throwError(() => error);
            }

            // Don't retry more than 3 times
            if (index >= 2) {
              return throwError(() => error);
            }

            // Exponential backoff: 1s, 2s, 4s
            const backoffDelay = Math.pow(2, index) * 1000;
            console.log(
              `Retrying request (attempt ${index + 1}) after ${backoffDelay}ms`
            );
            return new Observable((subscriber) =>
              setTimeout(() => subscriber.next(null), backoffDelay)
            );
          })
        )
      ),
      catchError((error) => {
        console.error('Request failed after retries:', error);
        return throwError(() => error);
      })
    );
  }
}

// ============================================================================
// EXAMPLE 5: Caching Service
// ============================================================================

/**
 * HTTP response caching service
 */
@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache$ = new Map<string, Observable<unknown>>();

  get<T>(
    http: HttpClient,
    url: string,
    options?: { params?: HttpParams }
  ): Observable<T> {
    const key = `${url}?${this.serializeParams(options?.params)}`;

    if (!this.cache$.has(key)) {
      const response$ = http.get<T>(url, options).pipe(
        shareReplay(1), // Share cached response
        catchError((error) => {
          // Remove from cache on error
          this.cache$.delete(key);
          return throwError(() => error);
        })
      );

      this.cache$.set(key, response$);
    }

    return this.cache$.get(key) as Observable<T>;
  }

  invalidate(url?: string): void {
    if (url) {
      // Invalidate specific URL
      const keysToDelete = Array.from(this.cache$.keys()).filter((key) =>
        key.startsWith(url)
      );
      keysToDelete.forEach((key) => this.cache$.delete(key));
    } else {
      // Invalidate all cache
      this.cache$.clear();
    }
  }

  private serializeParams(params?: HttpParams): string {
    if (!params) return '';
    return params.keys().map((key) => `${key}=${params.get(key)}`).join('&');
  }
}

// ============================================================================
// EXAMPLE 6: Progress Tracking for File Upload
// ============================================================================

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  uploadProgress$ = new BehaviorSubject<number>(0);

  uploadFile(file: File, url: string): Observable<HttpEvent<unknown>> {
    const formData = new FormData();
    formData.append('file', file);

    const request = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(request).pipe(
      tap((event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round((100 * event.loaded) / event.total);
          this.uploadProgress$.next(progress);
        }
      }),
      finalize(() => this.uploadProgress$.next(0))
    );
  }

  constructor(private http: HttpClient) {}
}

// ============================================================================
// EXAMPLE 7: Service with Loading State
// ============================================================================

@Injectable({ providedIn: 'root' })
export class DataService {
  private loading$ = new BehaviorSubject<boolean>(false);
  private data$ = new BehaviorSubject<unknown>(null);
  private error$ = new BehaviorSubject<string | null>(null);

  readonly loading = this.loading$.asObservable();
  readonly data = this.data$.asObservable();
  readonly error = this.error$.asObservable();

  constructor(private http: HttpClient) {}

  fetchData(url: string): Observable<unknown> {
    this.loading$.next(true);
    this.error$.next(null);

    return this.http.get(url).pipe(
      tap((data) => {
        this.data$.next(data);
        this.loading$.next(false);
      }),
      catchError((error) => {
        this.error$.next(error.message);
        this.loading$.next(false);
        return throwError(() => error);
      })
    );
  }
}

// ============================================================================
// EXAMPLE 8: Streaming Response
// ============================================================================

@Injectable({ providedIn: 'root' })
export class StreamingService {
  /**
   * Download file as blob
   */
  downloadFile(url: string, filename: string): Observable<void> {
    return this.http
      .get(url, { responseType: 'blob' })
      .pipe(
        tap((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(url);
        }),
        switchMap(() => new Observable<void>((sub) => sub.next()))
      );
  }

  /**
   * Stream Server-Sent Events
   */
  streamEvents(url: string): Observable<string> {
    return new Observable((observer) => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      eventSource.onerror = () => {
        observer.error('Stream error');
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }

  constructor(private http: HttpClient) {}
}

// ============================================================================
// EXAMPLE 9: Polling Service
// ============================================================================

@Injectable({ providedIn: 'root' })
export class PollingService {
  /**
   * Poll endpoint at regular intervals
   */
  poll<T>(url: string, intervalMs: number = 5000): Observable<T> {
    return new Observable((subscriber) => {
      let timeoutId: any;

      const pollOnce = () => {
        this.http.get<T>(url).subscribe(
          (data) => {
            subscriber.next(data);
            timeoutId = setTimeout(pollOnce, intervalMs);
          },
          (error) => {
            subscriber.error(error);
          }
        );
      };

      pollOnce();

      return () => clearTimeout(timeoutId);
    });
  }

  constructor(private http: HttpClient) {}
}

// ============================================================================
// EXAMPLE 10: Request Timeout Configuration
// ============================================================================

@Injectable({ providedIn: 'root' })
export class TimeoutService {
  /**
   * Request with custom timeout
   */
  getWithTimeout<T>(url: string, timeoutMs: number = 10000): Observable<T> {
    return this.http.get<T>(url).pipe(
      timeout(timeoutMs),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          return throwError(
            () => new Error(`Request timeout after ${timeoutMs}ms`)
          );
        }
        return throwError(() => error);
      })
    );
  }

  constructor(private http: HttpClient) {}
}

// ============================================================================
// Mock Services (for examples)
// ============================================================================

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
}

@Injectable({ providedIn: 'root' })
export class ErrorService {
  showError(message: string): void {
    console.error('Error:', message);
    // In real app: show toast notification
  }
}

import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

// ============================================================================
// EXAMPLE 11: Complete Service with All Patterns
// ============================================================================

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://api.example.com/products';
  private loading$ = new BehaviorSubject<boolean>(false);
  private cache$ = new Map<string, Observable<Product[]>>();

  readonly loading = this.loading$.asObservable();

  constructor(private http: HttpClient, private cache: CacheService) {}

  /**
   * Get products with caching
   */
  getProducts(): Observable<Product[]> {
    const cacheKey = this.apiUrl;

    if (!this.cache$.has(cacheKey)) {
      this.loading$.next(true);

      const products$ = this.http.get<Product[]>(this.apiUrl).pipe(
        timeout(15000),
        retry(2),
        tap(() => this.loading$.next(false)),
        catchError((error) => {
          this.loading$.next(false);
          console.error('Failed to fetch products:', error);
          return throwError(() => error);
        }),
        shareReplay(1)
      );

      this.cache$.set(cacheKey, products$);
    }

    return this.cache$.get(cacheKey)!;
  }

  /**
   * Get product by ID
   */
  getProduct(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        timeout(10000),
        catchError((error) => {
          console.error('Failed to fetch product:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Create product with validation
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    if (!product.name || !product.price) {
      return throwError(() => new Error('Invalid product data'));
    }

    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap((created) => {
        console.log('Product created:', created);
        this.invalidateCache();
      }),
      catchError((error) => {
        console.error('Failed to create product:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update product
   */
  updateProduct(id: number, updates: Partial<Product>): Observable<Product> {
    return this.http
      .patch<Product>(`${this.apiUrl}/${id}`, updates)
      .pipe(
        tap(() => this.invalidateCache()),
        catchError((error) => {
          console.error('Failed to update product:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Delete product
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('Product deleted:', id);
        this.invalidateCache();
      }),
      catchError((error) => {
        console.error('Failed to delete product:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Invalidate cache
   */
  private invalidateCache(): void {
    this.cache$.clear();
  }
}
