# NgRx - State Management Guide

## NgRx Fundamentals

NgRx is a reactive state management framework for Angular based on RxJS and Redux patterns.

## Core Concepts

### Store
Single source of truth containing application state:

```typescript
// Define state
interface AppState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AppState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null
};
```

### Actions
Events that describe what happened:

```typescript
import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction(
  '[Users] Load Users'
);

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>()
);

export const selectUser = createAction(
  '[Users] Select User',
  props<{ userId: number }>()
);
```

### Reducers
Pure functions that produce new state based on actions:

```typescript
import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(UserActions.selectUser, (state, { userId }) => ({
    ...state,
    selectedUser: state.users.find(u => u.id === userId) || null
  }))
);

export { userReducer };
```

### Selectors
Functions to select slices of state:

```typescript
import { createSelector, createFeatureSelector } from '@ngrx/store';

// Feature selector
export const selectUserState = createFeatureSelector<AppState>('users');

// Memoized selectors
export const selectUsers = createSelector(
  selectUserState,
  (state: AppState) => state.users
);

export const selectSelectedUser = createSelector(
  selectUserState,
  (state: AppState) => state.selectedUser
);

export const selectLoading = createSelector(
  selectUserState,
  (state: AppState) => state.loading
);

export const selectError = createSelector(
  selectUserState,
  (state: AppState) => state.error
);

// Combined selectors
export const selectUsersWithSelected = createSelector(
  selectUsers,
  selectSelectedUser,
  (users, selectedUser) => ({
    all: users,
    selected: selectedUser
  })
);

// Parametrized selector
export const selectUserById = createSelector(
  selectUsers,
  (users: User[], props: { id: number }) =>
    users.find(u => u.id === props.id)
);
```

### Effects
Side effects management (API calls, etc):

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../services/user.service';
import * as UserActions from './user.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map(users => UserActions.loadUsersSuccess({ users })),
          catchError(error => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  selectUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserActions.selectUser),
        tap(({ userId }) => console.log('Selected user:', userId))
      ),
    { dispatch: false } // No action dispatched
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}
```

## Setup NgRx

```typescript
// app.module.ts
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { userReducer } from './store/user.reducer';
import { UserEffects } from './store/user.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    StoreModule.forFeature('users', userReducer),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([UserEffects])
  ]
})
export class AppModule {}

// OR standalone
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ users: userReducer }),
    provideEffects([UserEffects])
  ]
});
```

## Using Store in Components

```typescript
import { Store } from '@ngrx/store';
import * as UserSelectors from './store/user.selectors';
import * as UserActions from './store/user.actions';

@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="loading$ | async">Loading...</div>
    <div *ngIf="error$ | async as error" class="error">
      {{ error }}
    </div>
    <ul>
      <li *ngFor="let user of users$ | async">
        {{ user.name }}
        <button (click)="selectUser(user.id)">Select</button>
      </li>
    </ul>
    <div *ngIf="selectedUser$ | async as user">
      Selected: {{ user?.name }}
    </div>
  `
})
export class UserListComponent implements OnInit {
  users$ = this.store.select(UserSelectors.selectUsers);
  selectedUser$ = this.store.select(UserSelectors.selectSelectedUser);
  loading$ = this.store.select(UserSelectors.selectLoading);
  error$ = this.store.select(UserSelectors.selectError);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
  }

  selectUser(userId: number) {
    this.store.dispatch(UserActions.selectUser({ userId }));
  }
}
```

## Entity Adapter

Simplify management of collections:

```typescript
import { createEntityAdapter, EntityState } from '@ngrx/entity';

// State interface
export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: string | null;
}

// Entity adapter
const usersAdapter = createEntityAdapter<User>({
  selectId: (user: User) => user.id
});

// Initial state
const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: null
});

// Reducer with entity adapter
const usersReducer = createReducer(
  initialState,
  on(UserActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.addAll(users, { ...state, loading: false })
  ),
  on(UserActions.addUser, (state, { user }) =>
    usersAdapter.addOne(user, state)
  ),
  on(UserActions.updateUser, (state, { user }) =>
    usersAdapter.updateOne({ id: user.id, changes: user }, state)
  ),
  on(UserActions.deleteUser, (state, { userId }) =>
    usersAdapter.removeOne(userId, state)
  )
);

// Selectors from adapter
export const {
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectTotalUsers
} = usersAdapter.getSelectors();

// Feature selectors
export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUsers = createSelector(
  selectUsersState,
  selectAllUsers
);

export const selectUserEntities = createSelector(
  selectUsersState,
  selectUserEntities
);
```

## Advanced Patterns

### Facade Pattern
Simplify component-store interaction:

```typescript
@Injectable({ providedIn: 'root' })
export class UserFacade {
  users$ = this.store.select(UserSelectors.selectUsers);
  selectedUser$ = this.store.select(UserSelectors.selectSelectedUser);
  loading$ = this.store.select(UserSelectors.selectLoading);
  error$ = this.store.select(UserSelectors.selectError);

  constructor(private store: Store) {}

  loadUsers() {
    this.store.dispatch(UserActions.loadUsers());
  }

  selectUser(userId: number) {
    this.store.dispatch(UserActions.selectUser({ userId }));
  }

  addUser(user: Omit<User, 'id'>) {
    this.store.dispatch(UserActions.addUser({ user }));
  }
}

// Component usage becomes cleaner
@Component({})
export class UserListComponent {
  users$ = this.userFacade.users$;
  loading$ = this.userFacade.loading$;

  constructor(private userFacade: UserFacade) {}

  ngOnInit() {
    this.userFacade.loadUsers();
  }
}
```

### Meta-Reducers
Enhance reducers with cross-cutting concerns:

```typescript
export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('Previous State:', state);
    console.log('Action:', action);
    const result = reducer(state, action);
    console.log('New State:', result);
    return result;
  };
}

// Register meta-reducer
@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers: [logger]
    })
  ]
})
export class AppModule {}
```

## Best Practices

1. **Keep reducers pure** - No side effects
2. **Use selectors for memoization** - Avoid recalculations
3. **Handle loading/error states** - Provide user feedback
4. **Use facade pattern** - Simplify component interaction
5. **Test reducers** - Pure functions are easy to test
6. **Avoid storing derived data** - Calculate in selectors
7. **Use entity adapter** - For collection management
8. **Dispatch actions early** - In ngOnInit or route guards

## Key Takeaways

- NgRx provides predictable state management
- Store is single source of truth
- Actions describe what happened
- Reducers create new state
- Selectors query state efficiently
- Effects handle side effects
- Entity adapter simplifies collection management
- Facade pattern simplifies component interaction
