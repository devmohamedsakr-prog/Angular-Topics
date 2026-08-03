/**
 * NgRx Store - Complete Examples
 * Demonstrates actions, reducers, selectors, effects, and store patterns
 */

import {
  createAction,
  createReducer,
  on,
  createSelector,
  createFeatureSelector,
  props,
  Action,
  Store,
} from '@ngrx/store';
import { Injectable, Component, OnInit, OnDestroy } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  Effect,
} from '@ngrx/effects';
import { of, Subject } from 'rxjs';
import {
  map,
  switchMap,
  catchError,
  tap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Basic Actions
// ============================================================================

/**
 * Define actions for user feature
 */
export const loadUsers = createAction(
  '[User Page] Load Users'
);

export const loadUsersSuccess = createAction(
  '[User API] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[User API] Load Users Failure',
  props<{ error: string }>()
);

export const addUser = createAction(
  '[User Form] Add User',
  props<{ user: User }>()
);

export const updateUser = createAction(
  '[User Edit] Update User',
  props<{ user: User }>()
);

export const deleteUser = createAction(
  '[User List] Delete User',
  props<{ id: number }>()
);

export const selectUser = createAction(
  '[User] Select User',
  props<{ id: number }>()
);

export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

// ============================================================================
// EXAMPLE 2: State Interface and Initial State
// ============================================================================

/**
 * Define state shape
 */
export interface UserState {
  users: User[];
  selectedUserId: number | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Initial state
 */
export const initialUserState: UserState = {
  users: [],
  selectedUserId: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// ============================================================================
// EXAMPLE 3: Reducer
// ============================================================================

/**
 * Reducer - pure function that handles state changes
 */
export const userReducer = createReducer(
  initialUserState,

  // Load users
  on(loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
    lastUpdated: new Date(),
  })),

  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add user
  on(addUser, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
  })),

  // Update user
  on(updateUser, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
  })),

  // Delete user
  on(deleteUser, (state, { id }) => ({
    ...state,
    users: state.users.filter((u) => u.id !== id),
  })),

  // Select user
  on(selectUser, (state, { id }) => ({
    ...state,
    selectedUserId: id,
  }))
);

// ============================================================================
// EXAMPLE 4: Selectors
// ============================================================================

/**
 * Feature selector - select user feature from root state
 */
export const selectUserState = createFeatureSelector<UserState>('users');

/**
 * Memoized selectors - only recompute when input changes
 */
export const selectUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);

export const selectSelectedUserId = createSelector(
  selectUserState,
  (state: UserState) => state.selectedUserId
);

/**
 * Derived selector - combine multiple selectors
 */
export const selectSelectedUser = createSelector(
  selectUsers,
  selectSelectedUserId,
  (users, selectedId) => users.find((u) => u.id === selectedId) || null
);

/**
 * Selector with filter
 */
export const selectActiveUsers = createSelector(
  selectUsers,
  (users) => users.filter((u) => u.active)
);

/**
 * Selector with projection
 */
export const selectUserNames = createSelector(
  selectUsers,
  (users) => users.map((u) => u.name)
);

/**
 * Selector with props
 */
export const selectUserById = createSelector(
  selectUsers,
  (users, props: { id: number }) => users.find((u) => u.id === props.id) || null
);

// ============================================================================
// EXAMPLE 5: Effects
// ============================================================================

/**
 * Mock UserService
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers() {
    return of([
      { id: 1, name: 'John', email: 'john@example.com', active: true },
      { id: 2, name: 'Jane', email: 'jane@example.com', active: true },
    ]);
  }

  createUser(user: User) {
    return of({ ...user, id: 3 });
  }

  updateUser(user: User) {
    return of(user);
  }

  deleteUser(id: number) {
    return of(null);
  }
}

/**
 * Effects - handle side effects
 */
@Injectable()
export class UserEffects {
  // Load users effect
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map((users) => loadUsersSuccess({ users })),
          catchError((error) =>
            of(loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Add user effect
  addUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addUser),
        tap(({ user }) => {
          this.userService.createUser(user).subscribe();
        })
      ),
    { dispatch: false }
  );

  // Update user effect
  updateUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateUser),
        tap(({ user }) => {
          this.userService.updateUser(user).subscribe();
        })
      ),
    { dispatch: false }
  );

  // Delete user effect
  deleteUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteUser),
        tap(({ id }) => {
          this.userService.deleteUser(id).subscribe();
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}

// ============================================================================
// EXAMPLE 6: Using Store in Components
// ============================================================================

/**
 * User list component
 */
@Component({
  selector: 'app-user-list',
  template: `
    <div>
      <button (click)="loadUsers()">Load Users</button>
      <p *ngIf="loading$ | async">Loading...</p>
      <p *ngIf="error$ | async as error">Error: {{ error }}</p>
      <ul>
        <li *ngFor="let user of (users$ | async)">
          {{ user.name }} - {{ user.email }}
          <button (click)="selectUser(user.id)">Select</button>
          <button (click)="deleteUser(user.id)">Delete</button>
        </li>
      </ul>
    </div>
  `,
})
export class UserListComponent implements OnInit {
  users$ = this.store.select(selectUsers);
  loading$ = this.store.select(selectUserLoading);
  error$ = this.store.select(selectUserError);

  constructor(private store: Store<{ users: UserState }>) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.store.dispatch(loadUsers());
  }

  selectUser(id: number): void {
    this.store.dispatch(selectUser({ id }));
  }

  deleteUser(id: number): void {
    this.store.dispatch(deleteUser({ id }));
  }
}

/**
 * User detail component
 */
@Component({
  selector: 'app-user-detail',
  template: `
    <div *ngIf="selectedUser$ | async as user">
      <h2>{{ user.name }}</h2>
      <p>Email: {{ user.email }}</p>
      <p>Active: {{ user.active }}</p>
    </div>
  `,
})
export class UserDetailComponent {
  selectedUser$ = this.store.select(selectSelectedUser);

  constructor(private store: Store<{ users: UserState }>) {}
}

// ============================================================================
// EXAMPLE 7: Dispatching Actions with Payload
// ============================================================================

@Component({
  selector: 'app-user-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="name" name="name" placeholder="Name" />
      <input [(ngModel)]="email" name="email" placeholder="Email" />
      <button type="submit">Add User</button>
    </form>
  `,
})
export class UserFormComponent {
  name = '';
  email = '';

  constructor(private store: Store<{ users: UserState }>) {}

  onSubmit(): void {
    const newUser: User = {
      id: Date.now(),
      name: this.name,
      email: this.email,
      active: true,
    };

    this.store.dispatch(addUser({ user: newUser }));
    this.name = '';
    this.email = '';
  }
}

// ============================================================================
// EXAMPLE 8: Multiple Features with NgRx
// ============================================================================

/**
 * Product state
 */
export interface ProductState {
  products: any[];
  loading: boolean;
}

const initialProductState: ProductState = {
  products: [],
  loading: false,
};

// Product actions
export const loadProducts = createAction('[Product Page] Load Products');
export const loadProductsSuccess = createAction(
  '[Product API] Load Products Success',
  props<{ products: any[] }>()
);

// Product reducer
export const productReducer = createReducer(
  initialProductState,
  on(loadProducts, (state) => ({ ...state, loading: true })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
  }))
);

/**
 * Root state combining multiple features
 */
export interface AppState {
  users: UserState;
  products: ProductState;
}

// ============================================================================
// EXAMPLE 9: Advanced Effects Pattern
// ============================================================================

/**
 * Effects with withLatestFrom
 */
@Injectable()
export class AdvancedUserEffects {
  @Effect()
  selectUserAndLoadDetails$ = this.actions$.pipe(
    ofType(selectUser),
    withLatestFrom(this.store.select(selectUsers)),
    switchMap(([{ id }, users]) => {
      const user = users.find((u) => u.id === id);
      // Load additional user details
      return of(loadUsersSuccess({ users }));
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<{ users: UserState }>
  ) {}
}

// ============================================================================
// EXAMPLE 10: Complete Store Setup Example
// ============================================================================

/**
 * COMPLETE NgRx STORE SETUP:
 *
 * 1. Define Actions
 *    - Load action (trigger side effect)
 *    - Success action (success response)
 *    - Failure action (error response)
 *
 * 2. Define State Shape
 *    - interface for type safety
 *    - initialState
 *
 * 3. Create Reducer
 *    - Pure function
 *    - Handle all actions
 *    - Return new state
 *
 * 4. Create Selectors
 *    - Feature selector
 *    - Memoized selectors
 *    - Derived selectors
 *
 * 5. Create Effects
 *    - Handle side effects
 *    - Call services
 *    - Dispatch actions
 *
 * 6. Setup Store Module
 *    - StoreModule.forRoot()
 *    - EffectsModule.forRoot()
 *    - Provide reducers
 *    - Provide effects
 *
 * 7. Use in Components
 *    - store.select(selector)
 *    - store.dispatch(action)
 *    - Subscribe to observables
 */

/**
 * Module setup example
 */
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// @NgModule({
//   imports: [
//     StoreModule.forRoot({
//       users: userReducer,
//       products: productReducer
//     }),
//     EffectsModule.forRoot([UserEffects, ProductEffects])
//   ]
// })
// export class AppStoreModule {}

// ============================================================================
// EXAMPLE 11: Best Practices
// ============================================================================

/**
 * BEST PRACTICES:
 *
 * 1. KEEP STATE FLAT
 *    ✅ { users: [], selectedId: 1 }
 *    ❌ { users: { all: [], selected: {} } }
 *
 * 2. NORMALIZE DATA
 *    ✅ { byId: { 1: {...}, 2: {...} }, allIds: [1, 2] }
 *    ❌ Nested arrays/objects
 *
 * 3. USE SELECTORS
 *    ✅ store.select(selectUsers)
 *    ❌ store.select(state => state.users)
 *
 * 4. KEEP EFFECTS PURE
 *    ✅ Call service, map result, dispatch action
 *    ❌ Modify state directly in effects
 *
 * 5. USE MEMOIZED SELECTORS
 *    - Performance: Only recompute when inputs change
 *    - Memory: Cache results
 *
 * 6. DISPATCH ACTIONS
 *    ✅ store.dispatch(loadUsers())
 *    ❌ Call service directly
 *
 * 7. HANDLE ERRORS
 *    - Always have failure action
 *    - Update state with error message
 *    - Dispatch fallback action if needed
 *
 * 8. TEST EVERYTHING
 *    - Test reducers
 *    - Test selectors
 *    - Test effects
 *    - Use marble testing
 */

// ============================================================================
// EXAMPLE 12: Alternative: Local State with RxJS (No NgRx)
// ============================================================================

/**
 * For smaller apps, local state management can be simpler
 */
@Injectable({ providedIn: 'root' })
export class LocalUserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingSubject.next(true);
    // Call API
    // this.usersSubject.next(users);
    // this.loadingSubject.next(false);
  }

  addUser(user: User): void {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }

  deleteUser(id: number): void {
    const current = this.usersSubject.value;
    this.usersSubject.next(current.filter((u) => u.id !== id));
  }
}

import { BehaviorSubject } from 'rxjs';
