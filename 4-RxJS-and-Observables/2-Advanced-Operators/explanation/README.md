# Advanced RxJS Operators

## Overview

While basic operators like `map`, `filter`, and `switchMap` handle most tasks, advanced operators enable sophisticated reactive patterns. This guide covers combination operators, error handling, performance optimization, and custom operator creation.

---

## Combination Operators

These operators combine multiple observables into one stream.

### 1. **combineLatest** - Combines latest values

Emits whenever any source observable emits, combining the latest value from each.

```typescript
import { combineLatest } from 'rxjs';

// When either observable emits, both latest values are combined
const obs1 = interval(1000).pipe(map(i => `A${i}`));
const obs2 = interval(1500).pipe(map(i => `B${i}`));

combineLatest([obs1, obs2]).subscribe(values => {
  console.log(values); // ['A0', 'B0'], ['A1', 'B0'], ['A1', 'B1'], etc.
});

// Real-world: Combine user selections
const selectedCategory$ = categorySelect.valueChanges;
const selectedSort$ = sortSelect.valueChanges;

combineLatest([selectedCategory$, selectedSort$]).pipe(
  switchMap(([category, sort]) => 
    this.apiService.getProducts(category, sort)
  )
).subscribe(products => {
  this.products = products;
});
```

**Key Points:**
- Waits for all sources to emit at least once
- Emits whenever ANY source emits
- Returns array of latest values
- Best for dependent inputs

---

### 2. **merge** - Combines and interleaves

Emits values from all sources as they occur. Doesn't combine values.

```typescript
import { merge } from 'rxjs';

// Emit from either source immediately
const clicks$ = fromEvent(button, 'click');
const key$ = fromEvent(document, 'keydown');

merge(clicks$, key$).subscribe(event => {
  console.log('User interaction:', event);
});

// Real-world: Handle multiple user interactions
const userAction$ = merge(
  saveButton.click$.pipe(map(() => 'save')),
  deleteButton.click$.pipe(map(() => 'delete')),
  cancelButton.click$.pipe(map(() => 'cancel'))
);

userAction$.subscribe(action => {
  this.handleAction(action);
});
```

**Key Differences:**

| Operator | Combines Values | Waits | Output |
|----------|-----------------|-------|--------|
| `combineLatest` | Yes | For all | Combined array |
| `merge` | No | None | Single value |
| `concat` | No | Sequential | Single value |
| `zip` | Yes | For all | Combined array |

---

### 3. **zip** - Combines corresponding values

Emits when all sources have emitted, pairing corresponding values.

```typescript
import { zip } from 'rxjs';

// Emit only when both have emitted
const names = from(['Alice', 'Bob', 'Charlie']);
const ages = from([25, 30, 35]);

zip(names, ages).subscribe(pair => {
  console.log(`${pair[0]} is ${pair[1]}`);
});
// Alice is 25
// Bob is 30
// Charlie is 35

// Real-world: Upload multiple files with their progress
const files = [file1, file2, file3];
const uploads = files.map(file => uploadFile$(file));

zip(...uploads).subscribe(results => {
  console.log('All files uploaded:', results);
});
```

**Key Points:**
- Waits for all sources to emit
- Pairs nth emission from all sources
- Completes when shortest source completes
- Best for parallel operations that need all results

---

### 4. **concat** - Sequential combination

Subscribes to sources sequentially, emitting all values before moving to next.

```typescript
import { concat } from 'rxjs';

// Execute sequentially
const obs1 = of(1, 2, 3);
const obs2 = of(4, 5, 6);

concat(obs1, obs2).subscribe(value => {
  console.log(value); // 1, 2, 3, 4, 5, 6
});

// Real-world: Sequential API calls
const searchSequence$ = concat(
  this.apiService.recentSearches$,
  this.apiService.trendingSearches$
);

searchSequence$.subscribe(search => {
  this.suggestions.push(search);
});
```

**Key Characteristics:**
- Sequential: waits for first to complete
- Doesn't combine values
- Best for dependent operations
- Order matters

---

### 5. **withLatestFrom** - Add context

Combines primary observable with latest from other observables (doesn't trigger emission).

```typescript
import { withLatestFrom } from 'rxjs';

// Only emits when primary source emits
const clicks$ = fromEvent(button, 'click');
const mousePos$ = fromEvent(document, 'mousemove').pipe(
  map(event => ({ x: event.clientX, y: event.clientY }))
);

clicks$.pipe(
  withLatestFrom(mousePos$),
  map(([click, pos]) => ({
    click: 'Clicked',
    position: pos
  }))
).subscribe(data => {
  console.log('Click at:', data.position);
});

// Real-world: Add context to action
const submitButton$ = fromEvent(submitBtn, 'click');
const currentForm$ = this.form.valueChanges;

submitButton$.pipe(
  withLatestFrom(currentForm$),
  switchMap(([_, formValue]) => 
    this.apiService.submitForm(formValue)
  )
).subscribe();
```

---

### 6. **forkJoin** - Wait for all to complete

Like `Promise.all()`, emits single value with array of final emissions.

```typescript
import { forkJoin } from 'rxjs';

// Wait for all to complete
const user$ = this.apiService.getUser(userId);
const posts$ = this.apiService.getUserPosts(userId);
const comments$ = this.apiService.getUserComments(userId);

forkJoin([user$, posts$, comments$]).subscribe(
  ([user, posts, comments]) => {
    console.log('All data loaded');
    this.user = user;
    this.posts = posts;
    this.comments = comments;
  }
);

// Error handling - fails if ANY observable errors
forkJoin([user$, posts$, comments$]).subscribe(
  results => console.log('Success'),
  error => console.log('One request failed:', error)
);

// With named results
forkJoin({
  user: this.apiService.getUser(userId),
  posts: this.apiService.getUserPosts(userId),
  comments: this.apiService.getUserComments(userId)
}).subscribe(({ user, posts, comments }) => {
  console.log('User:', user);
  console.log('Posts:', posts);
  console.log('Comments:', comments);
});
```

**Key Characteristics:**
- Waits for all sources to complete
- Emits array of final values
- Fails if ANY source errors
- Best for parallel independent operations

---

## Error Handling Operators

### 1. **catchError** - Handle and recover

```typescript
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

this.apiService.getData().pipe(
  catchError(error => {
    console.error('Error:', error);
    // Return fallback value
    return of({ default: 'value' });
  })
).subscribe(data => {
  this.data = data;
});

// Re-throw with additional context
this.apiService.getData().pipe(
  catchError(error => {
    console.error('API call failed', error);
    return throwError(() => new Error('Data load failed'));
  })
).subscribe();

// Real-world: Retry with fallback
this.apiService.getData().pipe(
  retry(3),
  catchError(error => {
    console.log('Request failed after 3 retries');
    return of(this.getCachedData());
  })
).subscribe();
```

### 2. **retry** - Retry on error

```typescript
import { retry } from 'rxjs/operators';

// Retry 3 times before failing
this.apiService.getData().pipe(
  retry(3)
).subscribe(
  data => console.log('Success:', data),
  error => console.log('Failed after 3 retries')
);

// Retry with delay
this.apiService.getData().pipe(
  retry({
    count: 3,
    delay: 1000 // Wait 1 second between retries
  })
).subscribe();

// Exponential backoff
this.apiService.getData().pipe(
  retry({
    count: 5,
    delay: (error, retryCount) => {
      const delayMs = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s, 16s, 32s
      console.log(`Retry ${retryCount + 1} after ${delayMs}ms`);
      return timer(delayMs);
    }
  })
).subscribe();
```

### 3. **retryWhen** - Advanced retry logic

```typescript
import { retryWhen, delay, take } from 'rxjs/operators';

this.apiService.getData().pipe(
  retryWhen(errors => 
    errors.pipe(
      mergeMap((error, i) => {
        if (i < 3 && error.status === 503) {
          // Retry on 503 Service Unavailable
          return timer((i + 1) * 1000);
        }
        return throwError(() => error);
      })
    )
  )
).subscribe();
```

### 4. **timeout** - Fail if no emission

```typescript
import { timeout } from 'rxjs/operators';

// Fail if no value emitted within 5 seconds
this.apiService.getData().pipe(
  timeout(5000),
  catchError(error => {
    if (error.name === 'TimeoutError') {
      console.log('Request timeout');
    }
    return throwError(() => error);
  })
).subscribe();
```

---

## Advanced Pattern Operators

### 1. **switchMap** - Cancel previous, start new

```typescript
import { switchMap } from 'rxjs/operators';

// When search changes, cancel previous search
searchInput.valueChanges.pipe(
  debounceTime(300),
  switchMap(searchTerm => 
    this.apiService.search(searchTerm)
  )
).subscribe(results => {
  this.searchResults = results;
});

// Real-world: Navigation to different user profile
this.route.params.pipe(
  switchMap(params => 
    this.apiService.getUserProfile(params['userId'])
  )
).subscribe(profile => {
  this.profile = profile;
});
```

### 2. **mergeMap** - Run in parallel

```typescript
import { mergeMap } from 'rxjs/operators';

// Run multiple requests in parallel
userIds$.pipe(
  mergeMap(userId => 
    this.apiService.getUser(userId),
    2 // Limit to 2 concurrent requests
  )
).subscribe(user => {
  this.users.push(user);
});
```

### 3. **concatMap** - Sequential processing

```typescript
import { concatMap } from 'rxjs/operators';

// Process sequentially, waiting for each to complete
fileIds$.pipe(
  concatMap(fileId => 
    this.apiService.deleteFile(fileId)
  )
).subscribe();
```

### 4. **exhaustMap** - Ignore during execution

```typescript
import { exhaustMap } from 'rxjs/operators';

// Ignore clicks while request is pending
saveButton.click$.pipe(
  exhaustMap(() => 
    this.apiService.save(this.data)
  )
).subscribe();
```

---

## Custom Operators

### Creating Custom Operators

```typescript
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Simple custom operator
export function doubleNumbers() {
  return map((value: number) => value * 2);
}

// Usage
of(1, 2, 3).pipe(
  doubleNumbers()
).subscribe(console.log); // 2, 4, 6

// Advanced custom operator with error handling
export function validatePositive() {
  return (source: Observable<number>) => {
    return source.pipe(
      tap(value => {
        if (value < 0) {
          throw new Error('Value must be positive');
        }
      }),
      catchError(error => {
        console.error('Validation error:', error);
        return throwError(() => error);
      })
    );
  };
}

// Custom operator with configuration
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

// Usage
this.apiService.getData().pipe(
  retryWithDelay(2000, 3)
).subscribe();

// Complex custom operator: Rate limiting
export function rateLimit(requests: number, windowMs: number) {
  return (source: Observable<any>) => {
    return source.pipe(
      throttleTime(windowMs / requests),
      map(value => ({ ...value, timestamp: Date.now() }))
    );
  };
}
```

---

## Practical Pattern: Request Caching

```typescript
export function cache() {
  let cache: any;
  let hasValue = false;

  return (source: Observable<any>) => {
    return new Observable(subscriber => {
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

// Usage
this.apiService.getConfig().pipe(
  cache()
).subscribe(config => {
  this.config = config;
});
```

---

## Best Practices

1. **Use `switchMap` for user-driven changes**
   - Cancels previous requests when new one comes in
   - Best for search, autocomplete, navigation

2. **Use `mergeMap` for parallel operations**
   - Processes multiple requests concurrently
   - Use `concurrency` parameter to limit

3. **Use `concatMap` for sequential operations**
   - Maintains order, waits for each to complete
   - Best for file uploads, deletes

4. **Handle errors explicitly**
   - Always include `catchError`
   - Provide fallback values or user feedback

5. **Unsubscribe properly**
   - Use `takeUntil` with destroy subject
   - Or use `async` pipe in templates

6. **Combine operators efficiently**
   - Debounce before switchMap
   - Filter before expensive operations

---

## Summary

Advanced RxJS operators enable sophisticated reactive patterns:

- **Combination**: `combineLatest`, `merge`, `zip`, `concat`, `forkJoin`
- **Error Handling**: `catchError`, `retry`, `timeout`
- **Transformation**: `switchMap`, `mergeMap`, `concatMap`, `exhaustMap`
- **Custom**: Create reusable operator patterns

Master these patterns to build scalable, reactive Angular applications.
