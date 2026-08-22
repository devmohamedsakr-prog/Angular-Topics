# NgRx State Management Interview Questions (Quick Reference)

## Q1-Q3: NgRx Basics
```typescript
// 1. Define State
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null
};

// 2. Create Actions
export const loadProducts = createAction('[Products Page] Load Products');
export const loadProductsSuccess = createAction(
  '[Products API] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Products API] Load Products Failure',
  props<{ error: string }>()
);

// 3. Create Reducer
export const productReducer = createReducer(
  initialState,
  on(loadProducts, state => ({ ...state, loading: true })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
```

## Q4-Q6: Effects and Selectors
```typescript
// Effects
@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          map(products => loadProductsSuccess({ products })),
          catchError(error => of(loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}
}

// Selectors
export const selectProductsState = (state: AppState) => state.products;
export const selectProducts = createSelector(
  selectProductsState,
  (state: ProductState) => state.products
);
export const selectLoading = createSelector(
  selectProductsState,
  (state: ProductState) => state.loading
);
export const selectError = createSelector(
  selectProductsState,
  (state: ProductState) => state.error
);

// Memoized selector
export const selectProductById = (id: number) =>
  createSelector(
    selectProducts,
    products => products.find(p => p.id === id)
  );
```

## Q7-Q9: Store Integration
```typescript
// Module setup
@NgModule({
  imports: [
    StoreModule.forRoot({ products: productReducer }),
    EffectsModule.forRoot([ProductEffects])
  ]
})
export class AppModule {}

// Component usage
@Component({...})
export class ProductsComponent implements OnInit {
  products$ = this.store.select(selectProducts);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  selectProduct(id: number): void {
    this.store.select(selectProductById(id)).subscribe(product => {
      console.log(product);
    });
  }
}
```

## Q10-Q12: Advanced Patterns
```typescript
// Entity adapter for normalized state
export const adapter = createEntityAdapter<Product>();

const initialState: EntityState<Product> = adapter.getInitialState();

export const productReducer = createReducer(
  initialState,
  on(loadProductsSuccess, (state, { products }) =>
    adapter.setAll(products, state)
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors(selectProductsState);

// Meta-reducers for logging
export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('Action:', action);
    const result = reducer(state, action);
    console.log('New State:', result);
    return result;
  };
}

@NgModule({
  imports: [StoreModule.forRoot(reducers, { metaReducers: [logger] })]
})
export class AppModule {}
```

## Q13-Q15: Best Practices
```
✅ Keep state normalized
✅ Use selectors for derived state
✅ Use effects for side effects
✅ Keep actions focused
✅ Use typed selectors
✅ Unsubscribe from observables
✅ Use OnPush change detection with NgRx
✅ Test reducers with pure functions
✅ Use DevTools for debugging
```

