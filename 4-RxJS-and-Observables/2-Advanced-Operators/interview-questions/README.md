# Advanced RxJS Operators Interview Questions

## Beginner Level

### Q1: What are combination operators and why do we need them?

**Answer:**

Combination operators merge multiple observables into a single stream. They're essential for handling dependent or independent concurrent operations.

**Why we need them:**
1. **Multi-source data** - Combine data from multiple APIs
2. **Dependent operations** - Wait for multiple conditions
3. **User input handling** - Merge different user interactions
4. **Parallel loading** - Load multiple resources together

**Common combination operators:**

| Operator | Waits | Combines | Best For |
|----------|-------|----------|----------|
| `combineLatest` | Yes | Yes | Dependent inputs |
| `merge` | No | No | Multiple events |
| `zip` | Yes | Yes | Paired values |
| `concat` | Yes | No | Sequential ops |
| `withLatestFrom` | Yes* | Yes | Add context |
| `forkJoin` | Yes | Yes | Parallel completion |

*`withLatestFrom` - Primary source triggers emission

**Example:**
```typescript
// Without combination - multiple subscriptions
this.firstName$.subscribe(first => {
  this.lastName$.subscribe(last => {
    this.fullName = `${first} ${last}`;
  });
});

// With combination - single subscription
combineLatest([this.firstName$, this.lastName$]).pipe(
  map(([first, last]) => `${first} ${last}`)
).subscribe(fullName => {
  this.fullName = fullName;
});
```

---

### Q2: What's the difference between `combineLatest` and `merge`?

**Answer:**

| Feature | combineLatest | merge |
|---------|---------------|-------|
| Combines values | ✅ Yes | ❌ No |
| Waits for all | ✅ Yes | ❌ No |
| When emits | Any source | Any source |
| Output type | Array | Single value |
| Use case | Filters/forms | Events |

**Example:**

```typescript
// combineLatest - combines latest values
const obs1 = of('A').pipe(delay(100));
const obs2 = of('B').pipe(delay(200));

combineLatest([obs1, obs2]).subscribe(console.log);
// Output (after 200ms): ['A', 'B']

// merge - emits from any source
merge(obs1, obs2).subscribe(console.log);
// Output:
// 'A' (after 100ms)
// 'B' (after 200ms)
```

**When to use each:**

```typescript
// Use combineLatest for form filters
combineLatest([
  categorySelect.valueChanges,
  priceRangeSlider.valueChanges,
  sortSelect.valueChanges
]).pipe(
  switchMap(([category, price, sort]) => 
    this.getProducts(category, price, sort)
  )
).subscribe();

// Use merge for multiple event sources
merge(
  saveButton.click$,
  keyboardShortcut$,
  menuItem.click$
).subscribe(() => this.save());
```

---

### Q3: What does `zip` do and when would you use it?

**Answer:**

`zip` pairs corresponding values from multiple observables. It's like a zipper closing - it waits for all sources to emit before emitting a combined pair.

**Key characteristics:**
- Waits for all sources to emit
- Pairs nth emission from each source
- Completes when shortest source completes
- Order matters

**Example:**

```typescript
const names = from(['Alice', 'Bob', 'Charlie']);
const ages = from([25, 30, 35]);
const emails = from(['alice@ex.com', 'bob@ex.com', 'charlie@ex.com']);

zip(names, ages, emails).subscribe(
  ([name, age, email]) => {
    console.log(`${name}, ${age}, ${email}`);
  }
);
// Output:
// Alice, 25, alice@ex.com
// Bob, 30, bob@ex.com
// Charlie, 35, charlie@ex.com
```

**When to use:**
```typescript
// Upload multiple files and wait for all
const files = [file1, file2, file3];
const uploads = files.map(f => uploadFile(f));

zip(...uploads).subscribe(results => {
  console.log('All files uploaded:', results);
});

// Load related data in parallel
zip(
  this.apiService.getUser(userId),
  this.apiService.getPosts(userId),
  this.apiService.getComments(userId)
).subscribe(([user, posts, comments]) => {
  this.data = { user, posts, comments };
});
```

**vs forkJoin:**
```typescript
// Both wait for all to complete, but zip pairs nth values
// zip: 1st names with 1st ages, 2nd names with 2nd ages, etc.
zip(names, ages); // [['Alice', 25], ['Bob', 30], ...]

// forkJoin: emits final values only
forkJoin([names, ages]); // [['Charlie'], [35]] (last values)
```

---

### Q4: Explain error handling with `catchError` and `retry`.

**Answer:**

**`catchError`** - Handle errors and recover:
```typescript
this.apiService.getData().pipe(
  catchError(error => {
    console.error('Error:', error);
    // Return fallback
    return of({ default: 'value' });
  })
).subscribe();
```

**`retry`** - Retry on error:
```typescript
this.apiService.getData().pipe(
  retry(3) // Retry 3 times
).subscribe(
  data => console.log('Success'),
  error => console.log('Failed after 3 retries')
);
```

**Combined pattern:**
```typescript
this.apiService.getData().pipe(
  retry(3),                              // Try 3 times
  catchError(error => {                  // Then handle error
    if (error.status === 404) {
      return this.apiService.getBackup(); // Try backup
    }
    return of({ data: 'cache' });        // Use cache
  })
).subscribe();
```

**With delay:**
```typescript
this.apiService.getData().pipe(
  retry({
    count: 3,
    delay: 1000 // Wait 1s between retries
  }),
  catchError(error => {
    console.log('Failed after 3 retries');
    return throwError(() => error);
  })
).subscribe();
```

---

### Q5: What's the difference between `switchMap`, `mergeMap`, and `concatMap`?

**Answer:**

| Operator | Behavior | Concurrency | Order | Use Case |
|----------|----------|------------|-------|----------|
| `switchMap` | Cancel previous | 1 | No | User input |
| `mergeMap` | Run parallel | Multiple | No | Parallel ops |
| `concatMap` | Sequential | 1 | Yes | Order matters |

**Examples:**

```typescript
// switchMap - Cancel previous search
searchTerm$.pipe(
  debounceTime(300),
  switchMap(term => this.search(term))
).subscribe(); // Only latest search result emitted

// mergeMap - Run 2 in parallel, emit as ready
fileIds$.pipe(
  mergeMap(id => this.downloadFile(id), 2) // Max 2 parallel
).subscribe(); // Files emitted as they complete

// concatMap - Process one at a time in order
fileIds$.pipe(
  concatMap(id => this.deleteFile(id)) // Delete one at a time
).subscribe(); // Results in order
```

---

## Intermediate Level

### Q6: How do you implement retry with exponential backoff?

**Answer:**

```typescript
// Exponential backoff: 1s, 2s, 4s, 8s, 16s
this.apiService.getData().pipe(
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
).subscribe();
```

**With jitter (randomness to prevent thundering herd):**
```typescript
retry({
  count: 5,
  delay: (error, retryCount) => {
    const baseDelay = Math.pow(2, retryCount) * 1000;
    const jitter = Math.random() * 1000; // Random 0-1s
    const delayMs = baseDelay + jitter;
    return timer(delayMs);
  }
})
```

---

### Q7: How do you combine multiple observables with dependencies?

**Answer:**

**Using `withLatestFrom` - Add context:**
```typescript
// When button clicked, get current form value
saveButton$.pipe(
  withLatestFrom(formValue$),
  switchMap(([_, form]) => 
    this.apiService.save(form)
  )
).subscribe();
```

**Using `combineLatest` - All affect result:**
```typescript
// Filter resets when any input changes
combineLatest([
  searchInput$.pipe(debounceTime(300)),
  categorySelect$,
  sortSelect$
]).pipe(
  switchMap(([search, category, sort]) =>
    this.apiService.getProducts(search, category, sort)
  )
).subscribe();
```

**Chaining multiple sources:**
```typescript
userId$.pipe(
  switchMap(userId =>
    combineLatest([
      this.apiService.getUser(userId),
      this.apiService.getPosts(userId),
      this.apiService.getComments(userId)
    ])
  ),
  map(([user, posts, comments]) => ({
    user, posts, comments
  }))
).subscribe();
```

---

### Q8: How do you handle sequential operations with `concatMap`?

**Answer:**

```typescript
// Delete files one at a time, in order
fileIds$.pipe(
  concatMap(fileId => 
    this.apiService.deleteFile(fileId).pipe(
      tap(id => console.log(`Deleted: ${id}`))
    )
  )
).subscribe();

// Upload files sequentially (important for dependencies)
files$.pipe(
  concatMap(file =>
    this.uploadFile(file).pipe(
      map(result => ({
        file: file.name,
        url: result.url,
        timestamp: new Date()
      }))
    )
  )
).subscribe(result => {
  this.uploadedFiles.push(result);
});
```

**When to use vs mergeMap:**
```typescript
// Use concatMap when order matters
// Example: Delete, then create
concatMap(id => 
  this.delete(id).pipe(
    switchMap(() => this.create(newData))
  )
);

// Use mergeMap when order doesn't matter
// Example: Download multiple files (any order)
mergeMap(fileId => this.download(fileId), 3);
```

---

### Q9: What's a custom operator and how do you create one?

**Answer:**

A custom operator is a function that takes an observable and returns a new observable with custom logic.

**Simple custom operator:**
```typescript
export function doubleNumbers() {
  return map((value: number) => value * 2);
}

// Usage
of(1, 2, 3).pipe(
  doubleNumbers()
).subscribe(console.log); // 2, 4, 6
```

**Operator with configuration:**
```typescript
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
  retryWithDelay(1000, 3)
).subscribe();
```

**Complex operator - Caching:**
```typescript
export function cache<T>() {
  let cache: T;
  let hasValue = false;

  return (source: Observable<T>) => {
    return new Observable<T>(subscriber => {
      if (hasValue) {
        // Return cached value immediately
        subscriber.next(cache);
        subscriber.complete();
      } else {
        // First time - fetch and cache
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
  cache() // Only fetches first time
).subscribe(config => {
  this.config = config;
});
```

---

### Q10: How do you prevent memory leaks with observables?

**Answer:**

**Pattern 1: Use `takeUntil`**
```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**Pattern 2: Use async pipe (auto-unsubscribe)**
```typescript
@Component({
  template: `
    <div>{{ data$ | async }}</div>
  `
})
export class MyComponent {
  data$ = this.apiService.getData();
}
```

**Pattern 3: Manual unsubscribe**
```typescript
export class MyComponent {
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.data$.subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

**Pattern 4: Use `shareReplay`**
```typescript
// Share single subscription among multiple subscribers
private config$ = this.apiService.getConfig().pipe(
  shareReplay(1) // Cache for new subscribers
);
```

---

## Advanced Level

### Q11: How do you implement a smart retry strategy?

**Answer:**

```typescript
export function smartRetry() {
  return (source: Observable<any>) => {
    return source.pipe(
      retry({
        count: 5,
        delay: (error, retryCount) => {
          // Different strategies based on error type
          if (error.status >= 500) {
            // Server error - exponential backoff
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Server error, retry after ${delay}ms`);
            return timer(delay);
          } else if (error.status === 429) {
            // Rate limit - longer wait
            return timer(retryCount * 5000);
          } else if (error.status >= 400) {
            // Client error - don't retry
            throw error;
          } else {
            // Network error - linear backoff
            return timer(retryCount * 1000);
          }
        }
      })
    );
  };
}
```

---

### Q12: How do you handle concurrent requests with limits?

**Answer:**

```typescript
// Limit concurrency to 3
from(fileIds).pipe(
  mergeMap(
    id => this.downloadFile(id),
    3 // Max 3 concurrent
  )
).subscribe();

// Rate limiting
from(requests).pipe(
  mergeMap(
    req => this.executeRequest(req),
    1 // One at a time
  ),
  throttleTime(100) // 100ms between requests
).subscribe();
```

---

## Summary

**Key Concepts:**
1. Combination operators merge multiple streams
2. Error handling with `catchError` and `retry`
3. Mapping operators: `switchMap`, `mergeMap`, `concatMap`
4. Custom operators for reusable logic
5. Memory leak prevention with `takeUntil`
6. Advanced patterns like exponential backoff

**Best Practices:**
1. Use `switchMap` for user-driven changes
2. Use `mergeMap` with concurrency limits for parallel ops
3. Use `concatMap` when order matters
4. Always handle errors with `catchError`
5. Always unsubscribe or use `async` pipe
6. Use `shareReplay` to cache and share results
7. Create custom operators for complex logic
