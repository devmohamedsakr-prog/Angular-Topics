# RxJS Observables - Deep Dive

## What is RxJS?

RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code.

## Observable Basics

An Observable is a lazy Push collection of multiple values:

```typescript
import { Observable } from 'rxjs';

// Creating an Observable
const myObservable = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

// Subscribing to Observable
const subscription = myObservable.subscribe(
  (value) => console.log(value),           // next
  (error) => console.error(error),         // error
  () => console.log('Complete')            // complete
);

// Unsubscribe
subscription.unsubscribe();

// Using observer object
myObservable.subscribe({
  next: (value) => console.log(value),
  error: (error) => console.error(error),
  complete: () => console.log('Done')
});
```

## Creating Observables

### From Values
```typescript
// of - emit values synchronously
const obs1 = of(1, 2, 3);
obs1.subscribe(val => console.log(val));

// from - convert array/iterable to observable
const obs2 = from([1, 2, 3]);

// range - emit sequential numbers
const obs3 = range(1, 5); // 1, 2, 3, 4, 5
```

### From Events
```typescript
import { fromEvent } from 'rxjs';

// Button clicks
const clicks = fromEvent(button, 'click');
clicks.subscribe(() => console.log('Clicked!'));

// Mouse moves
const mouseMoves = fromEvent(document, 'mousemove');

// Keyboard events
const keyPresses = fromEvent(document, 'keydown');
```

### From Promises
```typescript
import { from } from 'rxjs';

const promise = new Promise(resolve => {
  setTimeout(() => resolve('Done!'), 1000);
});

const obs = from(promise);
obs.subscribe(val => console.log(val));
```

### From AJAX
```typescript
import { ajax } from 'rxjs/ajax';

const data$ = ajax.get('/api/users');
data$.subscribe({
  next: response => console.log(response.response),
  error: error => console.error(error)
});
```

### Interval and Timer
```typescript
import { interval, timer } from 'rxjs';

// Emit every 1000ms
const tick$ = interval(1000);

// Emit after 2000ms, then every 1000ms
const delayed$ = timer(2000, 1000);

// Emit after 2000ms only once
const once$ = timer(2000);
```

### Custom Observable
```typescript
const customObservable = new Observable(observer => {
  observer.next('First value');
  
  setTimeout(() => {
    observer.next('Second value');
  }, 1000);

  setTimeout(() => {
    observer.next('Third value');
    observer.complete();
  }, 2000);

  // Cleanup logic
  return () => {
    console.log('Unsubscribed');
  };
});

const subscription = customObservable.subscribe(
  val => console.log(val)
);
```

## Hot vs Cold Observables

### Cold Observable
Starts execution when subscribed, each subscriber gets separate execution:

```typescript
const cold$ = of(1, 2, 3);

const sub1 = cold$.subscribe(x => console.log('Sub1:', x));
const sub2 = cold$.subscribe(x => console.log('Sub2:', x));

// Output:
// Sub1: 1
// Sub1: 2
// Sub1: 3
// Sub2: 1
// Sub2: 2
// Sub2: 3
```

### Hot Observable
Shares single execution among multiple subscribers:

```typescript
const cold$ = of(1, 2, 3);
const hot$ = cold$.pipe(share()); // Makes it hot

const sub1 = hot$.subscribe(x => console.log('Sub1:', x));
const sub2 = hot$.subscribe(x => console.log('Sub2:', x));
```

## Common Operators

### Transformation Operators

```typescript
import { map, switchMap, mergeMap, concatMap, exhaustMap } from 'rxjs/operators';

// map - transform each value
of(1, 2, 3).pipe(
  map(x => x * 2)
).subscribe(x => console.log(x)); // 2, 4, 6

// switchMap - switch to new observable (cancels previous)
fromEvent(button, 'click').pipe(
  switchMap(() => fetchData())
).subscribe();

// mergeMap - merge all observables
of(1, 2, 3).pipe(
  mergeMap(id => fetchUser(id))
).subscribe();

// concatMap - concatenate observables (waits for completion)
of(1, 2, 3).pipe(
  concatMap(id => fetchUser(id))
).subscribe();

// exhaustMap - ignore new emissions until current completes
fromEvent(button, 'click').pipe(
  exhaustMap(() => submit())
).subscribe();
```

### Filtering Operators

```typescript
import { filter, take, takeUntil, distinct, debounceTime, throttleTime } from 'rxjs/operators';

// filter - only emit matching values
of(1, 2, 3, 4, 5).pipe(
  filter(x => x > 2)
).subscribe(x => console.log(x)); // 3, 4, 5

// take - emit first n values
of(1, 2, 3, 4, 5).pipe(
  take(3)
).subscribe(x => console.log(x)); // 1, 2, 3

// takeUntil - emit until another observable emits
const stop$ = new Subject<void>();
interval(100).pipe(
  takeUntil(stop$)
).subscribe(x => console.log(x));

setTimeout(() => stop$.next(), 500);

// debounceTime - wait after value stops changing
fromEvent(input, 'input').pipe(
  debounceTime(500),
  map((e: Event) => (e.target as HTMLInputElement).value),
  distinctUntilChanged()
).subscribe(value => console.log('Searching for:', value));

// throttleTime - emit at most once per interval
fromEvent(document, 'mousemove').pipe(
  throttleTime(100)
).subscribe(event => console.log(event));
```

### Combination Operators

```typescript
import { combineLatest, merge, zip, withLatestFrom, concat } from 'rxjs';

// combineLatest - combine latest from each observable
const age$ = of(27);
const name$ = of('John');
combineLatest([age$, name$]).subscribe(
  ([age, name]) => console.log(`${name} is ${age}`)
);

// merge - merge multiple observables
const clicks$ = fromEvent(button1, 'click');
const touches$ = fromEvent(button2, 'click');
merge(clicks$, touches$).subscribe(() => console.log('Button pressed'));

// zip - combine one-to-one
zip(of(1, 2, 3), of('a', 'b', 'c')).subscribe(
  ([num, letter]) => console.log(num, letter)
);
// Output: [1,'a'], [2,'b'], [3,'c']

// withLatestFrom - combine with latest value
clicks$.pipe(
  withLatestFrom(data$),
  map(([click, data]) => data)
).subscribe();

// concat - concatenate in sequence
concat(of(1, 2), of(3, 4)).subscribe(x => console.log(x));
// Output: 1, 2, 3, 4
```

### Utility Operators

```typescript
import { tap, startWith, finalize, shareReplay, async } from 'rxjs/operators';

// tap - side effects without changing values
of(1, 2, 3).pipe(
  tap(x => console.log('Before:', x)),
  map(x => x * 2),
  tap(x => console.log('After:', x))
).subscribe();

// startWith - emit value before source
of(1, 2, 3).pipe(
  startWith(0)
).subscribe(x => console.log(x)); // 0, 1, 2, 3

// finalize - cleanup when observable completes or errors
of(1, 2, 3).pipe(
  finalize(() => console.log('Complete or error occurred'))
).subscribe();

// shareReplay - share single execution, replay n values
const data$ = fetchData().pipe(shareReplay(1));

// catchError - handle errors
of(1, 2, 3, null).pipe(
  map(x => x.toString()),
  catchError(error => of('Error handled'))
).subscribe();
```

## Subjects

A Subject is both an Observable and an Observer:

```typescript
import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';

// Subject - multicast, starts empty
const subject = new Subject<number>();
subject.subscribe(x => console.log('Sub1:', x));
subject.subscribe(x => console.log('Sub2:', x));
subject.next(1); // Both subscribers see 1

// BehaviorSubject - always has current value
const behavior$ = new BehaviorSubject<string>('initial');
behavior$.subscribe(x => console.log(x)); // 'initial'
behavior$.next('updated');

// ReplaySubject - remembers previous n values
const replay$ = new ReplaySubject(2); // Remember last 2
replay$.next(1);
replay$.next(2);
replay$.next(3);
replay$.subscribe(x => console.log(x)); // 2, 3

// AsyncSubject - emits last value when completed
const async$ = new AsyncSubject<number>();
async$.next(1);
async$.next(2);
async$.next(3);
async$.subscribe(x => console.log(x)); // 3
async$.complete();
```

## In Angular Components

```typescript
@Component({
  template: `
    <input (keyup)="onSearch($event)" />
    <div>{{ result$ | async }}</div>
  `
})
export class SearchComponent implements OnDestroy {
  private searchInput$ = new Subject<string>();
  result$ = this.searchInput$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.searchService.search(term)),
    startWith('')
  );

  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchService) {}

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput$.next(input.value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Best Practices

1. **Always unsubscribe** - Use `takeUntil` pattern with destroy$ Subject
2. **Use async pipe** - Automatically unsubscribes in templates
3. **Share observables** - Use `share()` or `shareReplay()` to avoid duplicate subscriptions
4. **Combine operators** - Use `pipe()` to chain operations
5. **Handle errors** - Use `catchError` for error handling
6. **Use subjects carefully** - Prefer observables over subjects when possible
7. **Leverage BehaviorSubject** - When current state is needed
8. **Use marble testing** - For testing complex observable chains

## Key Takeaways

- Observables are lazy, only execute when subscribed
- RxJS provides powerful operators for transforming data
- Subjects enable multicast communication
- Angular integrates RxJS deeply throughout the framework
- Proper unsubscription prevents memory leaks
- Operators enable functional, declarative programming patterns
