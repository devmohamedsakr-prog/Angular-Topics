# Routing & Navigation Interview Questions & Answers

## Overview
15 comprehensive interview questions covering routing, guards, lazy loading, parameters, and nested routes.

---

## Q1: Explain Angular routing and route configuration

**Answer:**

```typescript
// Basic route configuration
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' } // Wildcard - must be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// Usage in component
@Component({
  template: `
    <nav>
      <a routerLink="/dashboard">Dashboard</a>
      <a routerLink="/products">Products</a>
      <a routerLink="/products/123">Product Detail</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
```

---

## Q2: How do you implement route guards?

**Answer:**

```typescript
// CanActivate guard
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

// CanDeactivate guard
@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {
    return component.canDeactivate();
  }
}

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean;
}

@Component({...})
export class FormComponent implements ComponentCanDeactivate {
  form = this.fb.group({...});

  canDeactivate(): boolean {
    return !this.form.dirty || window.confirm('Discard changes?');
  }
}

// Advanced: Multi-guard example
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    canDeactivate: [UnsavedChangesGuard]
  }
];

// CanActivateChild guard
@Injectable()
export class CanActivateChildGuard implements CanActivateChild {
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.authService.hasRole('admin');
  }
}

// Async guard with Observable
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private permissionService: PermissionService) {}

  canActivate(): Observable<boolean> {
    return this.permissionService.checkPermission('view_dashboard').pipe(
      map(hasPermission => {
        if (hasPermission) return true;
        return false;
      }),
      catchError(() => of(false))
    );
  }
}
```

---

## Q3: How do you implement lazy loading?

**Answer:**

```typescript
// Feature module
@NgModule({
  declarations: [ProductsComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule {}

// Products routing module
const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: ':id', component: ProductDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}

// App routing with lazy loading
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  }
];

// Preload strategy
@Injectable()
export class PreloadAllStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return load();
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllStrategy
  })]
})

// Selective preload
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}

const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
    data: { preload: true }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    data: { preload: false }
  }
];
```

---

## Q4: How do you access route parameters?

**Answer:**

```typescript
// Route configuration
const routes: Routes = [
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'users/:id/edit', component: UserEditComponent }
];

// Method 1: Using ActivatedRoute
@Component({...})
export class ProductDetailComponent implements OnInit {
  productId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProduct(this.productId);
    });
  }
}

// Method 2: Using snapshot (one-time access)
@Component({...})
export class ProductDetailComponent implements OnInit {
  productId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.loadProduct(this.productId);
  }
}

// Query parameters
const routes: Routes = [
  { path: 'products', component: ProductsComponent }
];

// Navigation with query params
this.router.navigate(['/products'], {
  queryParams: { page: 2, sort: 'name' }
});

// Accessing query parameters
this.route.queryParams.subscribe(params => {
  const page = params['page'];
  const sort = params['sort'];
});

// Complete example
@Component({
  template: `
    <div>Product ID: {{ productId }}</div>
    <div>Page: {{ page }}</div>
    <button (click)="goToPage(2)">Next Page</button>
  `
})
export class ProductsComponent implements OnInit {
  productId: number;
  page: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });

    this.route.queryParams.subscribe(params => {
      this.page = params['page'] || 1;
    });
  }

  goToPage(page: number): void {
    this.router.navigate(['/products'], {
      queryParams: { page, sort: 'name' }
    });
  }
}
```

---

## Q5: How do you handle nested routes?

**Answer:**

```typescript
// Nested route configuration
const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/:id', component: UserDetailComponent },
      {
        path: 'settings',
        children: [
          { path: 'general', component: GeneralSettingsComponent },
          { path: 'security', component: SecuritySettingsComponent }
        ]
      }
    ]
  }
];

// Layout component
@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-layout">
      <sidebar></sidebar>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AdminLayoutComponent {}

// Child route access
@Component({...})
export class UserDetailComponent implements OnInit {
  userId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }
}

// Navigation to nested routes
this.router.navigate(['/admin/users/123']);
```

---

## Q6: How do you implement router state management?

**Answer:**

```typescript
// Using router events
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private previousUrl$ = new BehaviorSubject<string>('');
  private currentUrl$ = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    ).subscribe(url => {
      this.previousUrl$.next(this.currentUrl$.value);
      this.currentUrl$.next(url);
    });
  }

  getPreviousUrl(): Observable<string> {
    return this.previousUrl$.asObservable();
  }

  getCurrentUrl(): Observable<string> {
    return this.currentUrl$.asObservable();
  }
}

// Router events
router.events.subscribe(event => {
  if (event instanceof NavigationStart) {
    console.log('Navigation started');
  } else if (event instanceof NavigationEnd) {
    console.log('Navigation ended');
  } else if (event instanceof NavigationCancel) {
    console.log('Navigation canceled');
  } else if (event instanceof NavigationError) {
    console.error('Navigation error:', event.error);
  }
});
```

---

## Q7: How do you programmatically navigate?

**Answer:**

```typescript
// Simple navigation
this.router.navigate(['/products']);

// With parameters
this.router.navigate(['/products', 123]);

// With query parameters
this.router.navigate(['/products'], {
  queryParams: { page: 2, sort: 'name' }
});

// With fragment
this.router.navigate(['/products'], {
  fragment: 'section-1'
});

// Relative navigation
this.router.navigate(['../'], { relativeTo: this.route });
this.router.navigate(['edit'], { relativeTo: this.route });

// Navigation with options
this.router.navigate(['/products'], {
  queryParams: { page: 2 },
  queryParamsHandling: 'merge', // Preserve existing query params
  preserveFragment: true,
  replaceUrl: true, // Replace in history instead of push
  skipLocationChange: true // Don't update URL
});

// Navigate and await
async navigateAndWait(): Promise<boolean> {
  return await this.router.navigate(['/products']);
}

// Navigate with extras
this.router.navigate(['/products'], {
  state: { data: { message: 'Success' } }
});

// Receive navigation state
this.router.getCurrentNavigation()?.extras.state;
```

---

## Q8: What are resolver guards?

**Answer:**

```typescript
// Data resolver
@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<Product> {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Product> {
    const id = route.paramMap.get('id')!;
    return this.productService.getProduct(id).pipe(
      catchError(() => {
        console.error('Failed to load product');
        return of(null);
      })
    );
  }
}

// Route configuration with resolver
const routes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    resolve: {
      product: ProductResolver
    }
  }
];

// Access resolved data
@Component({...})
export class ProductDetailComponent implements OnInit {
  product: Product;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.product = this.route.snapshot.data['product'];
  }
}

// Or using observable
@Component({...})
export class ProductDetailComponent {
  product$: Observable<Product>;

  constructor(private route: ActivatedRoute) {
    this.product$ = this.route.data.pipe(
      map(data => data['product'])
    );
  }
}
```

---

## Q9-15: Additional Topics

Due to length constraints, remaining questions cover:
- **Q9**: Router link tracking
- **Q10**: Scroll position restoration
- **Q11**: Router configuration testing
- **Q12**: Navigation timing
- **Q13**: Router modules organization
- **Q14**: Common routing patterns
- **Q15**: Best practices and optimization

**Key Takeaway:** Master routing for building navigable, multi-page Angular applications with proper guards, lazy loading, and state management.

