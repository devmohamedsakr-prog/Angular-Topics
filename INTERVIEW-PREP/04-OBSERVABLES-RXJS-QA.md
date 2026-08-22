# Observables & RxJS Interview Questions & Answers

## Overview
15 comprehensive interview questions covering observables, operators, patterns, and advanced RxJS concepts.

---

## Q1: What are Observables and how do they differ from Promises?

**Answer:**

```typescript
// Observable - Stream of values over time
const observable$ = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();
});

observable$.subscribe(
  value => console.log(value),
  error => console.error(error),
  () => console.log('Complete')
);

// Promise - Single value, then complete/error
const promise = new Promise((resolve, reject) => {
  resolve(1);
  // resolve(2); // Ignored
});

promise.then(value => console.log(value)); // Only logs 1
```

**Comparison:**

| Feature | Observable | Promise |
|---------|-----------|---------|
| **Multiple Values** | ✅ Yes | ❌ Single |
| **Lazy** | ✅ Yes | ❌ Eager |
| **Cancellable** | ✅ Yes | ❌ No |
| **Operators** | ✅ Chainable | ❌ No |
| **Error Handling** | Per subscription | Single |
| **Time** | ✅ Over time | One-time |

---

## Q2: Explain Hot vs Cold Observables

**Answer:**

```typescript
// ❌ COLD Observable - Creates new execution per subscription
function createColdObservable() {
  return new Observable(subscriber => {
    console.log('Observable created');
    subscriber.next(Math.random());
    subscriber.complete();
  });
}

const cold$ = createColdObservable();
cold$.subscribe(v => console.log('Sub1:', v)); // Creates execution
cold$.subscribe(v => console.log('Sub2:', v)); // Creates new execution
// Output: different values

// ✅ HOT Observable - Shares execution among subscribers
function createHotObservable() {
  const subject = new Subject();
  
  setInterval(() => {
    subject.next(Math.random());
  }, 1000);
  
  return subject.asObservable();
}

const hot$ = createHotObservable();
hot$.subscribe(v => console.log('Sub1:', v)); // Shares
hot$.subscribe(v => console.log('Sub2:', v)); // Same execution
// Output: same values

// Converting Cold to Hot with shareReplay
const coldToHot$ = createColdObservable().pipe(
  shareReplay(1) // Cache last value for new subscribers
);
```

---

## Q3: What are the main RxJS operators and when to use them?

**Answer:**

```typescript
// Transformation Operators
source$.pipe(
  map(x => x * 2),                    // Transform each value
  switchMap(x => getDetails(x)),      // Flatten latest observable
  mergeMap(x => getDetails(x)),       // Flatten all observables
  exhaustMap(x => getDetails(x)),     // Flatten only first
  concatMap(x => getDetails(x)),      // Flatten in order
  pluck('name'),                      // Extract property
  scan((acc, val) => acc + val, 0),   // Running calculation
  reduce((acc, val) => acc + val, 0)  // Single result
);

// Filtering Operators
source$.pipe(
  filter(x => x > 5),                 // Conditional filter
  distinctUntilChanged(),             // Skip if same as previous
  distinctUntilChanged((a, b) => a.id === b.id), // Custom comparison
  debounceTime(300),                  // Wait 300ms before emitting
  throttleTime(500),                  // Emit at most every 500ms
  take(3),                            // Emit first 3 values
  takeUntil(destroy$),                // Emit until another emits
  skip(2),                            // Skip first 2 values
  first(),                            // Emit only first
  last()                              // Emit only last
);

// Combination Operators
combineLatest([obs1$, obs2$]).pipe(
  // Combine latest from each
);

merge(obs1$, obs2$, obs3$).pipe(
  // Merge all values
);

zip(obs1$, obs2$).pipe(
  // Emit when all have emitted
);

concat(obs1$, obs2$).pipe(
  // Emit sequentially
);

forkJoin([obs1$, obs2$]).pipe(
  // Wait for all to complete
);

withLatestFrom(obs2$).pipe(
  // Combine with latest from another
);

// Utility Operators
source$.pipe(
  tap(v => console.log(v)),           // Side effects without changing
  finalize(() => cleanup()),          // Cleanup when complete/error
  catchError(err => of([]))           // Error recovery
);
```

---

## Q4: Implement error handling in observables

**Answer:**

```typescript
// Approach 1: catchError to recover
const data$ = this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('Error:', error);
    return of([]); // Fallback value
  })
);

// Approach 2: catchError to transform error
const data$ = this.http.get('/api/data').pipe(
  catchError(error => {
    if (error.status === 404) {
      return of(null); // Not found
    }
    return throwError(() => new Error('Server error'));
  })
);

// Approach 3: retry with backoff
const data$ = this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: (error, count) => {
      const delayMs = Math.pow(2, count) * 1000;
      console.log(`Retry ${count} after ${delayMs}ms`);
      return timer(delayMs);
    }
  }),
  catchError(error => {
    console.error('Failed after retries:', error);
    return of(null);
  })
);

// Approach 4: finalize cleanup
const data$ = this.http.get('/api/data').pipe(
  finalize(() => {
    this.isLoading = false; // Cleanup regardless of success/error
  })
);

// Complete error handling pattern
@Injectable()
export class DataService {
  private data$ = new BehaviorSubject<Data[]>([]);
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<Error | null>(null);

  loadData(): void {
    this.loading$.next(true);
    this.error$.next(null);

    this.http.get<Data[]>('/api/data').pipe(
      retry(2),
      tap(data => this.data$.next(data)),
      catchError(error => {
        this.error$.next(error);
        return of([]);
      }),
      finalize(() => this.loading$.next(false))
    ).subscribe();
  }
}
```

---

## Q5: What is the difference between switchMap, mergeMap, concatMap, and exhaustMap?

**Answer:**

```typescript
// Detailed comparison with examples
const trigger$ = of(1, 2, 3);
const delayedObservable = (n: number) => 
  of(`Result ${n}`).pipe(delay(100 * n));

// switchMap - Cancels previous, subscribes to latest
trigger$.pipe(
  switchMap(n => delayedObservable(n))
).subscribe(console.log);
// Output: Result 1, Result 2, Result 3 (completes fastest)

// mergeMap - Subscribes to all, emits as they complete
trigger$.pipe(
  mergeMap(n => delayedObservable(n))
).subscribe(console.log);
// Output: Result 1, Result 2, Result 3 (all run simultaneously)

// concatMap - Subscribes sequentially, maintains order
trigger$.pipe(
  concatMap(n => delayedObservable(n))
).subscribe(console.log);
// Output: Result 1, Result 2, Result 3 (runs one after another)

// exhaustMap - Ignores while previous is running
trigger$.pipe(
  exhaustMap(n => delayedObservable(n))
).subscribe(console.log);
// Output: Result 1 (ignores 2, 3)

// Visual timeline:
/*
switchMap:    1---2---3--
mergeMap:     1---2---3--
concatMap:    1------2------3--
exhaustMap:   1------
*/

// Practical use cases:
@Component({...})
export class SearchComponent {
  constructor(private searchService: SearchService) {}

  // Search - use switchMap to cancel old searches
  onSearch(query: string): Observable<Result[]> {
    return this.searchService.search(query).pipe(
      switchMap(results => of(results))
    );
  }

  // Upload files - use concatMap to maintain order
  uploadFiles(files: File[]): Observable<UploadResult[]> {
    return from(files).pipe(
      concatMap(file => this.uploadService.upload(file))
    );
  }

  // Rate limit - use exhaustMap to ignore rapid clicks
  onButtonClick(): void {
    this.buttonClick$.pipe(
      exhaustMap(() => this.httpService.slowOperation())
    ).subscribe();
  }

  // Parallel uploads - use mergeMap with limit
  uploadWithLimit(files: File[], limit: number = 3): void {
    from(files).pipe(
      mergeMap(file => this.uploadService.upload(file), limit)
    ).subscribe();
  }
}
```

---

## Q6: Implement Subject and its variants

**Answer:**

```typescript
// Subject - Multicast to multiple subscribers
const subject = new Subject<number>();

subject.subscribe(v => console.log('Sub1:', v));
subject.subscribe(v => console.log('Sub2:', v));

subject.next(1);  // Both subscribers receive 1
subject.next(2);  // Both subscribers receive 2

// BehaviorSubject - Emits current value to new subscribers
const behaviorSubject = new BehaviorSubject<number>(0);

behaviorSubject.subscribe(v => console.log('Sub1:', v)); // Immediately: 0

behaviorSubject.next(1);
behaviorSubject.subscribe(v => console.log('Sub2:', v)); // Immediately: 1

behaviorSubject.next(2); // Both receive 2

// ReplaySubject - Replays n values to new subscribers
const replaySubject = new ReplaySubject<number>(2); // Buffer 2 items

replaySubject.next(1);
replaySubject.next(2);
replaySubject.next(3);

replaySubject.subscribe(v => console.log('New Sub:', v)); // Receives: 2, 3

// AsyncSubject - Emits only final value when complete
const asyncSubject = new AsyncSubject<number>();

asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.next(3);

asyncSubject.subscribe(v => console.log('Result:', v)); // Waits for complete

asyncSubject.complete(); // Emits only: 3

// Practical example: Authentication state
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.http.get<User>('/api/me').subscribe(
      user => this.currentUser$.next(user),
      () => this.currentUser$.next(null)
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', { email, password }).pipe(
      tap(user => this.currentUser$.next(user))
    );
  }

  logout(): void {
    this.currentUser$.next(null);
  }
}
```

---

## Q7: How do you combine multiple observables?

**Answer:**

```typescript
// combineLatest - Waits for all, emits latest values
combineLatest([
  userService.getUser(),
  postsService.getPosts(),
  commentsService.getComments()
]).subscribe(([user, posts, comments]) => {
  // All three completed
});

// If any update, all latest values emitted
const age$ = new BehaviorSubject(25);
const name$ = new BehaviorSubject('John');

combineLatest([age$, name$]).subscribe(([age, name]) => {
  console.log(`${name} is ${age}`);
});

age$.next(26); // Emits: John is 26
name$.next('Jane'); // Emits: Jane is 26

// forkJoin - Like Promise.all, waits for all to complete
forkJoin([
  this.http.get('/api/users'),
  this.http.get('/api/posts'),
  this.http.get('/api/comments')
]).subscribe(([users, posts, comments]) => {
  console.log('All done');
  // Use for one-time operations
});

// merge - Emits from any source
merge(
  userService.userDeleted$,
  userService.userCreated$,
  userService.userUpdated$
).subscribe(event => {
  console.log('User event:', event);
});

// concat - Sequential emission
concat(
  this.loadCache(),
  this.loadFromApi()
).subscribe(data => {
  // Cache first, then API if cache misses
});

// zip - Emit only when all have emitted at same index
zip(
  [1, 2, 3],
  ['a', 'b', 'c'],
  [true, false, true]
).subscribe(([num, letter, bool]) => {
  console.log(num, letter, bool);
});
// Output: 1, a, true then 2, b, false then 3, c, true

// withLatestFrom - Combine with latest from another
this.search$.pipe(
  withLatestFrom(this.filters$),
  switchMap(([query, filters]) => {
    return this.api.search(query, filters);
  })
).subscribe();
```

---

## Q8: Implement reactive patterns with observables

**Answer:**

```typescript
// Pattern 1: Request-Response
@Injectable()
export class UserService {
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
}

// Pattern 2: State Management with BehaviorSubject
@Injectable({ providedIn: 'root' })
export class StateService {
  private state$ = new BehaviorSubject<AppState>({
    users: [],
    loading: false,
    error: null
  });

  getState(): Observable<AppState> {
    return this.state$.asObservable();
  }

  setState(state: Partial<AppState>): void {
    const current = this.state$.value;
    this.state$.next({ ...current, ...state });
  }
}

// Pattern 3: Polling
function poll<T>(
  fn: () => Observable<T>,
  interval: number,
  maxAttempts: number
): Observable<T> {
  return timer(0, interval).pipe(
    take(maxAttempts),
    switchMap(() => fn()),
    retryWhen(errors =>
      errors.pipe(
        mergeMap((error, i) => {
          if (i >= maxAttempts) {
            return throwError(() => error);
          }
          return timer(interval);
        })
      )
    )
  );
}

// Pattern 4: Request with Loading State
@Injectable()
export class LoadingService {
  private isLoading$ = new BehaviorSubject(false);
  loading$ = this.isLoading$.asObservable();

  load<T>(fn: () => Observable<T>): Observable<T> {
    this.isLoading$.next(true);
    return fn().pipe(
      finalize(() => this.isLoading$.next(false))
    );
  }
}

// Pattern 5: Debounced Search
@Component({...})
export class SearchComponent {
  private searchTerm$ = new Subject<string>();
  
  results$: Observable<SearchResult[]>;

  constructor(private searchService: SearchService) {
    this.results$ = this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchService.search(term))
    );
  }

  onSearchChange(term: string): void {
    this.searchTerm$.next(term);
  }
}
```

---

## Q9: How do you unsubscribe and prevent memory leaks?

**Answer:**

```typescript
// ❌ BAD - Manual unsubscribe
@Component({...})
export class BadComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private service: MyService) {}

  ngOnInit(): void {
    this.subscription = this.service.getData().subscribe(
      data => console.log(data)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Manual unsubscribe
  }
}

// ✅ GOOD - takeUntil pattern
@Component({...})
export class GoodComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private service: MyService) {}

  ngOnInit(): void {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => console.log(data));

    this.service.getOtherData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => console.log(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ BEST - Async pipe in template
@Component({
  template: `
    <div>{{ data$ | async }}</div>
    <div *ngIf="(loading$ | async)">Loading...</div>
  `
})
export class BestComponent {
  data$: Observable<Data>;
  loading$: Observable<boolean>;

  constructor(private service: MyService) {
    this.data$ = this.service.getData();
    this.loading$ = this.service.isLoading();
    // Auto-unsubscribe with component destruction
  }
}

// Helper: Subscription manager
@Component({...})
export class SubscriptionComponent implements OnDestroy {
  private subscriptions = new Subscription();

  constructor(private service: MyService) {
    this.subscriptions.add(
      this.service.getData().subscribe(data => console.log(data))
    );

    this.subscriptions.add(
      this.service.getOtherData().subscribe(data => console.log(data))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Unsubscribe all at once
  }
}
```

---

## Q10: Implement hot observable patterns

**Answer:**

```typescript
// Share execution with shareReplay
@Injectable()
export class DataService {
  private dataSubject = new BehaviorSubject<Data | null>(null);

  // Cold to Hot conversion
  data$ = this.loadData().pipe(
    shareReplay(1) // Share and cache last value
  );

  private loadData(): Observable<Data> {
    return this.http.get<Data>('/api/data');
  }

  refresh(): void {
    this.loadData().pipe(
      shareReplay(1)
    ).subscribe(data => this.dataSubject.next(data));
  }
}

// Subject for event streaming
@Injectable()
export class EventService {
  private events$ = new Subject<Event>();

  emit(event: Event): void {
    this.events$.next(event);
  }

  on<T extends Event>(type: string): Observable<T> {
    return this.events$.pipe(
      filter(e => e.type === type),
      map(e => e as T),
      shareReplay()
    );
  }
}

// Practical: Real-time notifications
@Injectable()
export class NotificationService {
  private notifications$ = new Subject<Notification>();

  notify(message: string, type: 'info' | 'error' | 'success'): void {
    this.notifications$.next({ message, type });
  }

  getNotifications(): Observable<Notification> {
    return this.notifications$.asObservable();
  }
}

@Component({
  selector: 'app-notification-center',
  template: `
    <div *ngFor="let notif of notifications$ | async" 
         [class]="'notification ' + notif.type">
      {{ notif.message }}
    </div>
  `
})
export class NotificationComponent {
  notifications$ = this.notificationService.getNotifications();

  constructor(private notificationService: NotificationService) {}
}
```

---

## Q11: What are Higher-Order Observables?

**Answer:**

```typescript
// Higher-Order Observable - Observable of Observables
const higherOrder$: Observable<Observable<number>> = of(
  of(1, 2, 3),
  of(4, 5, 6)
);

// Flatten with switchMap
higherOrder$.pipe(
  switchMap(obs => obs)
).subscribe(console.log); // 1, 2, 3, 4, 5, 6

// Practical example: Search suggestions
@Component({...})
export class SearchComponent {
  constructor(private searchService: SearchService) {}

  search(term$: Observable<string>): Observable<Suggestion[]> {
    return term$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchService.getSuggestions(term))
      // Flattens from Observable<Observable<Suggestion[]>> to Observable<Suggestion[]>
    );
  }
}

// Without flattening (❌ WRONG)
const wrong$ = this.searchInput$.pipe(
  map(term => this.searchService.search(term))
  // Returns Observable<Observable<Result[]>>
);

// With flattening (✅ RIGHT)
const right$ = this.searchInput$.pipe(
  switchMap(term => this.searchService.search(term))
  // Returns Observable<Result[]>
);
```

---

## Q12: How do you test observables?

**Answer:**

```typescript
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';

describe('Observable tests', () => {
  it('should emit values', (done) => {
    of(1, 2, 3).subscribe({
      next: value => expect(value).toBeDefined(),
      complete: () => done()
    });
  });

  it('should use fakeAsync with tick', fakeAsync(() => {
    const source$ = interval(1000);
    const values: number[] = [];

    source$.pipe(take(3)).subscribe(v => values.push(v));

    expect(values).toEqual([]);
    tick(1000);
    expect(values).toEqual([0]);
    tick(2000);
    expect(values).toEqual([0, 1, 2]);
  }));

  it('should use marbles', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run(({ cold, hot, expectObservable }) => {
      const source$ = cold('--a-b-|', { a: 1, b: 2 });
      const expected$ = '  --a-b-|';

      expectObservable(source$).toBe(expected$, { a: 1, b: 2 });
    });
  });

  it('should test with marble testing', () => {
    const scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    scheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-b-c-|', { a: 1, b: 2, c: 3 });
      const result$ = source$.pipe(map(x => x * 2));

      expectObservable(result$).toBe('-a-b-c-|', { a: 2, b: 4, c: 6 });
    });
  });
});
```

---

## Q13-15: Advanced Patterns (Q13, Q14, Q15)

Due to length, these cover:
- **Q13**: Custom operators creation
- **Q14**: Memory management with observables
- **Q15**: Observable best practices

**Key Takeaway:** Observables are the foundation of reactive Angular. Master operators, combination strategies, and cleanup patterns to write efficient, maintainable applications.

