/**
 * RxJS Observables - Complete Examples
 * Demonstrates Observable creation, operators, subjects, and patterns
 */

import {
  Observable,
  Subject,
  BehaviorSubject,
  ReplaySubject,
  AsyncSubject,
  of,
  from,
  interval,
  timer,
  fromEvent,
  throwError,
  EMPTY,
  concat,
  merge,
  combineLatest,
  forkJoin,
  race,
  zip,
  iif,
} from 'rxjs';
import {
  map,
  filter,
  switchMap,
  mergeMap,
  concatMap,
  tap,
  debounceTime,
  throttleTime,
  distinctUntilChanged,
  take,
  takeUntil,
  startWith,
  shareReplay,
  catchError,
  retry,
  timeout,
  finalize,
  withLatestFrom,
  scan,
  reduce,
} from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Creating Observables
// ============================================================================

/**
 * Observable constructor
 */
export function observableConstructor(): Observable<number> {
  return new Observable((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();

    // Cleanup logic
    return () => console.log('Observable cleaned up');
  });
}

/**
 * Using of() - create from values
 */
export function ofExample(): Observable<number> {
  return of(1, 2, 3, 4, 5);
}

/**
 * Using from() - create from array/promise/iterable
 */
export function fromExample(): void {
  // From array
  from([1, 2, 3]).subscribe((val) => console.log(val));

  // From promise
  from(Promise.resolve('resolved')).subscribe((val) => console.log(val));

  // From iterable
  from(new Map([['key', 'value']])).subscribe((val) => console.log(val));
}

/**
 * Using interval() - emit values at intervals
 */
export function intervalExample(): Observable<number> {
  // Emit 0, 1, 2, 3... every 1000ms
  return interval(1000);
}

/**
 * Using timer() - delayed start then interval
 */
export function timerExample(): Observable<number> {
  // Wait 2000ms, then emit 0, 1, 2... every 1000ms
  return timer(2000, 1000);
}

/**
 * Using fromEvent() - create from DOM events
 */
export function fromEventExample(): Observable<Event> {
  const button = document.querySelector('button');
  return fromEvent(button, 'click');
}

// ============================================================================
// EXAMPLE 2: Transformation Operators
// ============================================================================

/**
 * map() - transform values
 */
export function mapExample(): Observable<number> {
  return of(1, 2, 3).pipe(
    map((val) => val * 2) // 2, 4, 6
  );
}

/**
 * filter() - only emit matching values
 */
export function filterExample(): Observable<number> {
  return of(1, 2, 3, 4, 5).pipe(
    filter((val) => val > 2) // 3, 4, 5
  );
}

/**
 * switchMap() - switch to new observable, cancel previous
 */
export function switchMapExample(): Observable<any> {
  return fromEvent(document.querySelector('input'), 'input').pipe(
    map((event: Event) => (event.target as HTMLInputElement).value),
    switchMap((term) => searchAPI(term)) // Cancels previous search
  );
}

/**
 * mergeMap() - merge into single observable, don't cancel
 */
export function mergeMapExample(): Observable<any> {
  return fromEvent(document.querySelector('input'), 'input').pipe(
    map((event: Event) => (event.target as HTMLInputElement).value),
    mergeMap((term) => searchAPI(term)) // Keeps all requests
  );
}

/**
 * concatMap() - sequential mapping, maintains order
 */
export function concatMapExample(): Observable<any> {
  return fromEvent(document.querySelector('input'), 'input').pipe(
    map((event: Event) => (event.target as HTMLInputElement).value),
    concatMap((term) => searchAPI(term)) // Sequential, order guaranteed
  );
}

// ============================================================================
// EXAMPLE 3: Filtering Operators
// ============================================================================

/**
 * debounceTime() - wait before emitting after inactivity
 */
export function debounceExample(): Observable<string> {
  return fromEvent(document.querySelector('input'), 'input').pipe(
    map((event: Event) => (event.target as HTMLInputElement).value),
    debounceTime(300) // Wait 300ms after last emission
  );
}

/**
 * throttleTime() - emit at most once per time period
 */
export function throttleExample(): Observable<Event> {
  return fromEvent(document.querySelector('button'), 'click').pipe(
    throttleTime(1000) // Max once per second
  );
}

/**
 * distinctUntilChanged() - only emit if value changed
 */
export function distinctExample(): Observable<number> {
  return of(1, 1, 2, 2, 3, 3, 1, 1).pipe(
    distinctUntilChanged() // 1, 2, 3, 1
  );
}

/**
 * take() - take first N values
 */
export function takeExample(): Observable<number> {
  return interval(1000).pipe(take(3)); // 0, 1, 2 then complete
}

/**
 * takeUntil() - emit until another observable emits
 */
export function takeUntilExample(): Observable<number> {
  const stop$ = new Subject<void>();

  return interval(1000).pipe(takeUntil(stop$));
  // Stop when: stop$.next()
}

// ============================================================================
// EXAMPLE 4: Combination Operators
// ============================================================================

/**
 * combineLatest() - combine latest values from multiple observables
 */
export function combineLatestExample(): Observable<[string, number]> {
  const user$ = of('John');
  const age$ = of(30);

  return combineLatest([user$, age$]).pipe(
    map(([user, age]) => [user, age])
  );
}

/**
 * merge() - combine multiple observables
 */
export function mergeExample(): Observable<Event> {
  const click$ = fromEvent(document.querySelector('button'), 'click');
  const keydown$ = fromEvent(document, 'keydown');

  return merge(click$, keydown$); // Both events merged
}

/**
 * zip() - combine values at same index
 */
export function zipExample(): Observable<[number, string]> {
  const nums$ = of(1, 2, 3);
  const strs$ = of('a', 'b', 'c');

  return zip(nums$, strs$).pipe(
    map(([num, str]) => [num, str])
    // [1, 'a'], [2, 'b'], [3, 'c']
  );
}

/**
 * forkJoin() - wait for all observables to complete
 */
export function forkJoinExample(): Observable<[any, any, any]> {
  return forkJoin([
    of('first'),
    of('second'),
    of('third'),
  ]);
}

/**
 * concat() - sequential concatenation
 */
export function concatExample(): Observable<number> {
  return concat(of(1, 2), of(3, 4)).pipe();
  // 1, 2, 3, 4
}

/**
 * race() - emit from first observable to emit
 */
export function raceExample(): Observable<number> {
  return race(
    timer(1000, 1000), // Slower
    timer(500, 1000) // Faster - wins
  );
}

// ============================================================================
// EXAMPLE 5: Utility Operators
// ============================================================================

/**
 * tap() - side effects, doesn't modify values
 */
export function tapExample(): Observable<number> {
  return of(1, 2, 3).pipe(
    tap((val) => console.log(`Value: ${val}`)), // Log
    map((val) => val * 2) // Transform
  );
}

/**
 * catchError() - handle errors
 */
export function catchErrorExample(): Observable<any> {
  return throwError(() => new Error('Something broke')).pipe(
    catchError((error) => {
      console.error(error);
      return of({ data: 'fallback' }); // Return default
    })
  );
}

/**
 * retry() - retry on error
 */
export function retryExample(): Observable<any> {
  return failingAPI().pipe(
    retry(3), // Retry 3 times
    catchError((error) => of(null))
  );
}

/**
 * timeout() - error if no emission
 */
export function timeoutExample(): Observable<any> {
  return timer(5000).pipe(
    timeout(1000), // Error if takes > 1s
    catchError(() => of('Timeout!'))
  );
}

/**
 * finalize() - cleanup when complete or error
 */
export function finalizeExample(): Observable<number> {
  return of(1, 2, 3).pipe(
    tap((val) => console.log(val)),
    finalize(() => console.log('Completed')) // Cleanup
  );
}

/**
 * startWith() - emit value before sequence
 */
export function startWithExample(): Observable<number> {
  return of(2, 3, 4).pipe(
    startWith(1) // 1, 2, 3, 4
  );
}

/**
 * shareReplay() - share and cache emission
 */
export function shareReplayExample(): Observable<any> {
  return of({ data: 'expensive API call' }).pipe(
    shareReplay(1) // Cache last value for late subscribers
  );
}

// ============================================================================
// EXAMPLE 6: Aggregation Operators
// ============================================================================

/**
 * scan() - running calculation
 */
export function scanExample(): Observable<number> {
  return of(1, 2, 3, 4).pipe(
    scan((acc, val) => acc + val, 0)
    // 1, 3, 6, 10 (cumulative sum)
  );
}

/**
 * reduce() - single final value after complete
 */
export function reduceExample(): Observable<number> {
  return of(1, 2, 3, 4).pipe(
    reduce((acc, val) => acc + val, 0)
    // 10 (only after complete)
  );
}

// ============================================================================
// EXAMPLE 7: Subjects
// ============================================================================

/**
 * Subject - multicast observable
 */
@Injectable({ providedIn: 'root' })
export class EventService {
  private eventSubject = new Subject<Event>();
  readonly event$ = this.eventSubject.asObservable();

  emit(event: Event): void {
    this.eventSubject.next(event);
  }
}

/**
 * BehaviorSubject - always has current value
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  readonly user$ = this.userSubject.asObservable();

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}

export interface User {
  id: number;
  name: string;
}

/**
 * ReplaySubject - replay N last values to new subscribers
 */
export function replayExample(): ReplaySubject<number> {
  const subject = new ReplaySubject<number>(2); // Replay last 2

  subject.next(1);
  subject.next(2);
  subject.next(3);

  // New subscriber gets: 2, 3 (skips 1)
  return subject;
}

/**
 * AsyncSubject - emit only last value when complete
 */
export function asyncSubjectExample(): AsyncSubject<number> {
  const subject = new AsyncSubject<number>();

  subject.next(1);
  subject.next(2);
  subject.next(3);
  subject.complete();

  // Subscribers get: 3 (only last value)
  return subject;
}

// ============================================================================
// EXAMPLE 8: Complex Patterns
// ============================================================================

/**
 * Search with debounce and error handling
 */
export function searchExample(searchTerm$: Observable<string>): Observable<any> {
  return searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) =>
      searchAPI(term).pipe(
        retry(2),
        catchError(() => of([]))
      )
    )
  );
}

/**
 * Polling with stop signal
 */
export function pollingExample(stop$: Observable<void>): Observable<any> {
  return interval(5000).pipe(
    switchMap(() => fetchData()),
    takeUntil(stop$)
  );
}

/**
 * Request with loading state
 */
export function loadingStateExample(
  request$: Observable<any>
): Observable<{ loading: boolean; data: any; error: any }> {
  return request$.pipe(
    startWith({ loading: true, data: null, error: null }),
    switchMap(() =>
      fetchData().pipe(
        map((data) => ({ loading: false, data, error: null })),
        catchError((error) =>
          of({ loading: false, data: null, error })
        )
      )
    )
  );
}

/**
 * Conditional observable
 */
export function conditionalExample(
  isLoggedIn: boolean
): Observable<any> {
  return iif(
    () => isLoggedIn,
    fetchUserData(),
    of({ message: 'Please login' })
  );
}

// ============================================================================
// EXAMPLE 9: Higher-order Operators
// ============================================================================

/**
 * withLatestFrom() - combine with latest value
 */
export function withLatestFromExample(): Observable<[number, string]> {
  const clicks$ = fromEvent(document, 'click');
  const latest$ = of('value');

  return clicks$.pipe(
    withLatestFrom(latest$),
    map(([click, latest]) => [1, latest])
  );
}

// ============================================================================
// EXAMPLE 10: Complete Service Example
// ============================================================================

@Injectable({ providedIn: 'root' })
export class CompleteDataService {
  private dataSubject = new BehaviorSubject<any>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new Subject<string>();

  readonly data$ = this.dataSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  constructor() {}

  loadData(id: number): Observable<any> {
    this.loadingSubject.next(true);

    return fetchDataById(id).pipe(
      tap((data) => this.dataSubject.next(data)),
      catchError((error) => {
        this.errorSubject.next(error.message);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  refresh(): void {
    const current = this.dataSubject.value;
    if (current) {
      this.loadData(current.id).subscribe();
    }
  }
}

// ============================================================================
// Mock API functions
// ============================================================================

function searchAPI(term: string): Observable<any> {
  return of([{ name: 'result 1' }, { name: 'result 2' }]);
}

function failingAPI(): Observable<any> {
  return throwError(() => new Error('API failed'));
}

function fetchData(): Observable<any> {
  return of({ data: 'fetched' });
}

function fetchDataById(id: number): Observable<any> {
  return of({ id, data: `data for ${id}` });
}

import { Injectable } from '@angular/core';
