/**
 * Advanced RxJS Operators Examples
 * Demonstrates combination, error handling, and custom operators
 */

import {
  Observable, of, from, interval, throwError, timer, EMPTY,
  combineLatest, merge, zip, concat, forkJoin
} from 'rxjs';
import {
  map, switchMap, mergeMap, concatMap, exhaustMap,
  catchError, retry, timeout, debounceTime, distinctUntilChanged,
  withLatestFrom, tap, filter, take, takeUntil, share, shareReplay
} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// ============================================================================
// EXAMPLE 1: Combination Operators
// ============================================================================

// combineLatest - Combine latest values from multiple observables
export function combineLatestExample() {
  const firstName$ = of('John').pipe(
    tap(v => console.log('First name:', v))
  );
  
  const lastName$ = of('Doe').pipe(
    tap(v => console.log('Last name:', v))
  );

  combineLatest([firstName$, lastName$]).pipe(
    map(([first, last]) => `${first} ${last}`)
  ).subscribe(
    fullName => console.log('Full name:', fullName)
  );
}

// Real-world: Autocomplete with filters
export class AutocompleteService {
  private searchTerm$ = new Observable<string>();
  private selectedCategory$ = new Observable<string>();

  getFilteredResults() {
    return combineLatest([
      this.searchTerm$.pipe(debounceTime(300)),
      this.selectedCategory$
    ]).pipe(
      distinctUntilChanged(),
      switchMap(([term, category]) =>
        this.apiService.search(term, category)
      )
    );
  }

  constructor(private apiService: any) {}
}

// ============================================================================
// EXAMPLE 2: Merge Operator
// ============================================================================

export function mergeExample() {
  const clicks$ = interval(1000).pipe(
    map(() => 'click')
  );

  const keystrokes$ = interval(500).pipe(
    map(() => 'key')
  );

  // Emit from either source
  merge(clicks$, keystrokes$).pipe(
    take(10)
  ).subscribe(
    event => console.log('Event:', event)
  );
}

// Real-world: Handle multiple user interactions
export class UserInteractionService {
  private saveButton$ = new Observable<Event>();
  private deleteButton$ = new Observable<Event>();
  private cancelButton$ = new Observable<Event>();

  getUserActions() {
    return merge(
      this.saveButton$.pipe(map(() => 'save')),
      this.deleteButton$.pipe(map(() => 'delete')),
      this.cancelButton$.pipe(map(() => 'cancel'))
    );
  }
}

// ============================================================================
// EXAMPLE 3: Zip Operator
// ============================================================================

export function zipExample() {
  const names = from(['Alice', 'Bob', 'Charlie']);
  const ages = from([25, 30, 35]);
  const emails = from(['alice@example.com', 'bob@example.com', 'charlie@example.com']);

  zip(names, ages, emails).subscribe(
    ([name, age, email]) => {
      console.log(`${name}, ${age} years old, ${email}`);
    }
  );
}

// Real-world: Parallel file uploads
export class FileUploadService {
  uploadMultipleFiles(files: File[]) {
    const uploads = files.map(file => this.uploadFile(file));

    return zip(...uploads).pipe(
      map((results: any[]) => ({
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      }))
    );
  }

  private uploadFile(file: File) {
    return new Observable<any>(subscriber => {
      // Upload logic
      subscriber.next({ success: true, file: file.name });
      subscriber.complete();
    });
  }
}

// ============================================================================
// EXAMPLE 4: Concat Operator
// ============================================================================

export function concatExample() {
  const first$ = of(1, 2, 3);
  const second$ = of(4, 5, 6);
  const third$ = of(7, 8, 9);

  concat(first$, second$, third$).subscribe(
    value => console.log(value)
    // Output: 1, 2, 3, 4, 5, 6, 7, 8, 9
  );
}

// Real-world: Sequential searches (recent first, then trending)
export class SearchService {
  getSearchSuggestions(query: string) {
    return concat(
      this.getRecentSearches(query),
      this.getTrendingSearches(query)
    ).pipe(
      distinctUntilChanged(),
      take(10)
    );
  }

  private getRecentSearches(query: string) {
    return of('recent 1', 'recent 2');
  }

  private getTrendingSearches(query: string) {
    return of('trending 1', 'trending 2');
  }
}

// ============================================================================
// EXAMPLE 5: WithLatestFrom
// ============================================================================

export class FormContextService {
  private submitButton$ = new Observable<Event>();
  private form$ = new Observable<any>();

  handleSubmitWithContext() {
    return this.submitButton$.pipe(
      withLatestFrom(this.form$),
      map(([_, formValue]) => ({
        action: 'submit',
        data: formValue,
        timestamp: new Date()
      }))
    );
  }
}

// Real-world: Track user action with mouse position
export class ClickTrackingService {
  private clickButton$ = new Observable<Event>();
  private mousePosition$ = new Observable<{ x: number; y: number }>();

  trackClicksWithPosition() {
    return this.clickButton$.pipe(
      withLatestFrom(this.mousePosition$),
      map(([click, position]) => ({
        action: 'click',
        x: position.x,
        y: position.y,
        timestamp: Date.now()
      }))
    );
  }
}

// ============================================================================
// EXAMPLE 6: ForkJoin - Wait for all
// ============================================================================

@Injectable()
export class DataLoadingService {
  constructor(private http: HttpClient) {}

  loadUserProfile(userId: number) {
    return forkJoin({
      user: this.http.get(`/api/users/${userId}`),
      posts: this.http.get(`/api/users/${userId}/posts`),
      comments: this.http.get(`/api/users/${userId}/comments`),
      followers: this.http.get(`/api/users/${userId}/followers`)
    }).pipe(
      tap(data => console.log('All profile data loaded')),
      timeout(10000),
      catchError(error => {
        console.error('Error loading profile:', error);
        return throwError(() => new Error('Profile load failed'));
      })
    );
  }

  // Load multiple users in parallel
  loadMultipleUsers(userIds: number[]) {
    return forkJoin(
      userIds.map(id => this.http.get(`/api/users/${id}`))
    ).pipe(
      map(users => users as any[]),
      catchError(error => {
        console.error('Error loading users:', error);
        return of([]); // Return empty array on error
      })
    );
  }
}

// ============================================================================
// EXAMPLE 7: Error Handling with catchError
// ============================================================================

@Injectable()
export class RobustApiService {
  constructor(private http: HttpClient) {}

  // Basic error handling
  getDataWithFallback(id: number) {
    return this.http.get(`/api/data/${id}`).pipe(
      catchError(error => {
        console.error('Error:', error);
        return of({ id, data: 'default value' });
      })
    );
  }

  // Cascading fallbacks
  getDataWithCascadingFallback(id: number) {
    return this.http.get(`/api/data/${id}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          return this.http.get(`/api/data/default`);
        }
        return of({ data: 'local default' });
      })
    );
  }

  // Error with retry
  getDataWithRetry(id: number) {
    return this.http.get(`/api/data/${id}`).pipe(
      retry({
        count: 3,
        delay: 1000
      }),
      catchError(error => {
        if (error.status >= 500) {
          return of({ data: 'server error, using cache' });
        }
        return throwError(() => error);
      })
    );
  }

  // Exponential backoff retry
  getDataWithExponentialBackoff(id: number) {
    return this.http.get(`/api/data/${id}`).pipe(
      retry({
        count: 5,
        delay: (error, retryCount) => {
          const delayMs = Math.pow(2, retryCount) * 1000;
          console.log(`Retry ${retryCount + 1} after ${delayMs}ms`);
          return timer(delayMs);
        }
      }),
      catchError(error => {
        console.error('Failed after all retries');
        return throwError(() => error);
      })
    );
  }

  // Timeout handling
  getDataWithTimeout(id: number) {
    return this.http.get(`/api/data/${id}`).pipe(
      timeout(5000),
      catchError(error => {
        if (error.name === 'TimeoutError') {
          console.log('Request timed out');
          return of({ data: 'timeout, using cache' });
        }
        return throwError(() => error);
      })
    );
  }
}

// ============================================================================
// EXAMPLE 8: Mapping Operators (switchMap, mergeMap, concatMap)
// ============================================================================

@Injectable()
export class SearchComponent {
  private searchTerm$ = new Observable<string>();

  // SwitchMap - Cancel previous, start new
  searchWithSwitchMap() {
    return this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.performSearch(term)),
      catchError(error => {
        console.error('Search failed');
        return of([]);
      })
    );
  }

  // MergeMap - Run in parallel with concurrency limit
  downloadMultipleFiles(fileIds: number[]) {
    return from(fileIds).pipe(
      mergeMap(
        id => this.downloadFile(id),
        2 // Limit to 2 concurrent downloads
      ),
      tap(file => console.log('Downloaded:', file)),
      catchError(error => {
        console.error('Download error:', error);
        return EMPTY;
      })
    );
  }

  // ConcatMap - Sequential processing
  deleteMultipleFiles(fileIds: number[]) {
    return from(fileIds).pipe(
      concatMap(id => this.deleteFile(id)),
      tap(id => console.log('Deleted:', id))
    );
  }

  // ExhaustMap - Ignore during execution
  saveWithExhaustMap() {
    return new Observable<void>(subscriber => {
      // Save button clicks
      subscriber.next();
    }).pipe(
      exhaustMap(() => this.saveData()),
      catchError(error => {
        console.error('Save failed');
        return EMPTY;
      })
    );
  }

  private performSearch(term: string) {
    return of([]);
  }

  private downloadFile(id: number) {
    return of({ id, name: 'file.txt' });
  }

  private deleteFile(id: number) {
    return of(id);
  }

  private saveData() {
    return of({ success: true });
  }
}

// ============================================================================
// EXAMPLE 9: Custom Operators
// ============================================================================

// Custom operator: Double numbers
export function doubleNumbers() {
  return map((value: number) => value * 2);
}

// Custom operator: Filter and transform
export function filterPositive() {
  return filter((value: number) => value > 0);
}

// Custom operator: Validate and handle errors
export function validatePositive() {
  return (source: Observable<number>) => {
    return new Observable(subscriber => {
      source.subscribe({
        next: value => {
          if (value < 0) {
            subscriber.error(new Error('Value must be positive'));
          } else {
            subscriber.next(value);
          }
        },
        error: err => subscriber.error(err),
        complete: () => subscriber.complete()
      });
    });
  };
}

// Custom operator: Retry with delay
export function retryWithDelay(delayMs: number, maxRetries: number) {
  return (source: Observable<any>) => {
    return source.pipe(
      retry({
        count: maxRetries,
        delay: () => timer(delayMs)
      })
    );
  };
}

// Custom operator: Rate limiting
export function rateLimit(maxRequests: number, windowMs: number) {
  return (source: Observable<any>) => {
    let requestCount = 0;
    let windowStart = Date.now();

    return source.pipe(
      tap(() => {
        const now = Date.now();
        if (now - windowStart > windowMs) {
          requestCount = 0;
          windowStart = now;
        }
        requestCount++;

        if (requestCount > maxRequests) {
          throw new Error('Rate limit exceeded');
        }
      })
    );
  };
}

// Custom operator: Caching
export function cache<T>() {
  let cache: T;
  let hasValue = false;

  return (source: Observable<T>) => {
    return new Observable<T>(subscriber => {
      if (hasValue) {
        subscriber.next(cache);
        subscriber.complete();
      } else {
        source.subscribe({
          next: value => {
            cache = value;
            hasValue = true;
            subscriber.next(value);
          },
          error: err => subscriber.error(err),
          complete: () => subscriber.complete()
        });
      }
    });
  };
}

// Custom operator: Retry with exponential backoff
export function retryExponential(maxRetries: number = 3) {
  return (source: Observable<any>) => {
    return source.pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          const delayMs = Math.pow(2, retryCount) * 1000;
          console.log(`Retry ${retryCount + 1}/${maxRetries} after ${delayMs}ms`);
          return timer(delayMs);
        }
      })
    );
  };
}

// ============================================================================
// EXAMPLE 10: Complex Real-World Scenario
// ============================================================================

@Injectable()
export class ProductListService {
  private searchTerm$ = new Observable<string>();
  private category$ = new Observable<string>();
  private sortBy$ = new Observable<string>();
  private pageSize$ = new Observable<number>();

  getFilteredProducts() {
    return combineLatest([
      this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
      this.category$.pipe(distinctUntilChanged()),
      this.sortBy$.pipe(distinctUntilChanged()),
      this.pageSize$
    ]).pipe(
      // Switch to new search when filters change
      switchMap(([search, category, sort, pageSize]) =>
        this.searchProducts(search, category, sort, pageSize)
      ),
      // Retry failed requests
      retry({
        count: 3,
        delay: 1000
      }),
      // Handle errors
      catchError(error => {
        console.error('Search failed:', error);
        return of([]);
      }),
      // Cache results
      shareReplay(1)
    );
  }

  private searchProducts(
    search: string,
    category: string,
    sort: string,
    pageSize: number
  ) {
    return new Observable<any[]>(subscriber => {
      // Simulate API call
      setTimeout(() => {
        subscriber.next([
          { id: 1, name: 'Product 1' },
          { id: 2, name: 'Product 2' }
        ]);
        subscriber.complete();
      }, 1000);
    });
  }
}

// ============================================================================
// EXAMPLE 11: Error Recovery Patterns
// ============================================================================

export class ErrorRecoveryService {
  constructor(private http: HttpClient) {}

  // Try primary, fallback to secondary
  getDataWithFallback(primaryUrl: string, fallbackUrl: string) {
    return this.http.get<any>(primaryUrl).pipe(
      catchError(() => this.http.get<any>(fallbackUrl)),
      catchError(() => of({ data: 'offline data' }))
    );
  }

  // Retry with different strategies
  smartRetry() {
    return this.http.get('/api/data').pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          // Exponential backoff for server errors
          if (error.status >= 500) {
            return timer(Math.pow(2, retryCount) * 1000);
          }
          // No retry for client errors
          if (error.status >= 400) {
            return throwError(() => error);
          }
          // Linear backoff for network errors
          return timer(retryCount * 500);
        }
      })
    );
  }

  // Timeout with fallback
  getDataWithTimeoutFallback(url: string) {
    return this.http.get<any>(url).pipe(
      timeout(5000),
      catchError(error => {
        if (error.name === 'TimeoutError') {
          return of({ data: 'cached data' });
        }
        return throwError(() => error);
      })
    );
  }
}

// ============================================================================
// EXAMPLE 12: Observable Usage Patterns
// ============================================================================

// Share result among multiple subscribers
export function shareResultExample(
  http: HttpClient,
  url: string
) {
  return http.get<any>(url).pipe(
    shareReplay(1) // Cache for future subscribers
  );
}

// Ensure cleanup with takeUntil
export function takeUntilExample(
  destroy$: Observable<void>,
  http: HttpClient,
  url: string
) {
  return http.get<any>(url).pipe(
    takeUntil(destroy$)
  );
}

// Unsubscribe pattern in component
export class ComponentWithCleanup {
  private destroy$ = new Observable<void>();

  loadData(http: HttpClient, url: string) {
    return http.get<any>(url).pipe(
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    // Component cleanup
  }
}
