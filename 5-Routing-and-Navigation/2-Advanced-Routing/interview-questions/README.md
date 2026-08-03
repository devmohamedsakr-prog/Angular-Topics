# Advanced Routing Interview Questions

## Beginner Level

### Q1: What is a route guard and why do we need them?

**Answer:**

Route guards are functions or classes that control navigation to and from routes. They determine whether a user can access a route based on certain conditions.

**Why we need them:**
1. **Security** - Prevent unauthorized access
2. **Validation** - Ensure user data is valid before entering a route
3. **Confirmation** - Ask user to confirm before leaving (unsaved changes)
4. **Pre-loading** - Fetch data before component loads
5. **Business Logic** - Execute custom logic before navigation

**Example:**
```typescript
// Without guard - anyone can access dashboard
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }
];

// With guard - only logged-in users can access
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
];
```

---

### Q2: What are the different types of route guards?

**Answer:**

Angular provides 5 main route guard interfaces:

1. **CanActivate** - Controls access to a route
   - Fired: Before route is activated
   - Use case: Authentication, authorization

2. **CanDeactivate** - Controls if you can leave a route
   - Fired: Before leaving a route
   - Use case: Warn about unsaved changes

3. **CanActivateChild** - Controls access to child routes
   - Fired: Before child routes activate
   - Use case: Protect entire feature module

4. **CanLoad** - Controls lazy loading
   - Fired: Before lazy module is loaded
   - Use case: Prevent module download if unauthorized

5. **Resolve** - Pre-fetches data before activation
   - Fired: Before route activates
   - Use case: Load data from API before showing component

**Quick Comparison:**

| Guard | When Fires | Returns | Use Case |
|-------|-----------|---------|----------|
| CanActivate | Before entering route | boolean/UrlTree | Authentication |
| CanDeactivate | Before leaving route | boolean/Observable | Unsaved changes |
| CanActivateChild | Before child routes | boolean/UrlTree | Feature protection |
| CanLoad | Before loading module | boolean/UrlTree | Lazy load protection |
| Resolve | Before activation | Observable/Promise | Data pre-loading |

---

### Q3: Explain lazy loading and why it matters.

**Answer:**

Lazy loading delays loading module code until it's actually needed. Instead of bundling all code together, modules load on demand.

**Why it matters:**

1. **Smaller Initial Bundle** - App loads faster
2. **Better Performance** - Users only download what they use
3. **Scalability** - Easier to manage large applications
4. **Better UX** - App responsive on first load

**Example:**

```typescript
// Without lazy loading - everything in initial bundle
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'admin', component: AdminComponent }
];
// Initial bundle: 500KB

// With lazy loading - load modules on demand
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
// Initial bundle: 150KB + products module loads when needed
```

**Performance Impact:**
- Initial load: 3x faster
- Products load time: 200ms (after click)
- Admin load time: 150ms (after click)

---

### Q4: What's the difference between route parameters and query parameters?

**Answer:**

**Route Parameters** (`:param`):
- Part of the route path itself
- Required for route matching
- Example: `/user/123` where 123 is the user ID
- Cannot be skipped

```typescript
// Route definition
{ path: 'user/:id', component: UserComponent }

// Navigation
this.router.navigate(['/user', userId]);

// Access in component
this.route.paramMap.subscribe(params => {
  const userId = params.get('id');
});

// URL: /user/123
```

**Query Parameters** (`?param=value`):
- After the `?` in URL
- Optional and not required
- Multiple query params possible
- Can be modified without changing component

```typescript
// Route definition - no special syntax
{ path: 'products', component: ProductsComponent }

// Navigation
this.router.navigate(['/products'], {
  queryParams: { category: 'electronics', sort: 'price' }
});

// Access in component
this.route.queryParamMap.subscribe(params => {
  const category = params.get('category');
  const sort = params.get('sort');
});

// URL: /products?category=electronics&sort=price
```

**When to use each:**

| Route Parameters | Query Parameters |
|-----------------|------------------|
| Identify resource (user/:id) | Filter/sort data |
| Required for route | Optional settings |
| Part of URL path | After ? in URL |
| /user/123 | /products?page=2 |

---

### Q5: How do you pass data between routes?

**Answer:**

**Method 1: Route Parameters**
```typescript
// Navigate with parameter
this.router.navigate(['/user', userId]);

// Receive in component
this.route.paramMap.subscribe(params => {
  this.userId = params.get('id');
});
```

**Method 2: Query Parameters**
```typescript
// Navigate with query params
this.router.navigate(['/search'], {
  queryParams: { keyword: 'angular', page: 1 }
});

// Receive in component
this.route.queryParamMap.subscribe(params => {
  this.keyword = params.get('keyword');
});
```

**Method 3: Route Data**
```typescript
// In route configuration
{
  path: 'admin',
  component: AdminComponent,
  data: { title: 'Admin Panel', roles: ['admin'] }
}

// Receive in component
this.route.data.subscribe(data => {
  this.title = data['title'];
  this.roles = data['roles'];
});
```

**Method 4: Component State (via service)**
```typescript
// Route configuration with state
this.router.navigate(['/detail'], {
  state: { user: userObject }
});

// Receive in component
constructor() {
  const user = window.history.state?.user;
}
```

**Method 5: Resolve Guard (pre-load data)**
```typescript
// In route
{
  path: 'user/:id',
  component: UserComponent,
  resolve: { user: UserResolver }
}

// In component
this.user = this.route.snapshot.data['user'];
```

---

## Intermediate Level

### Q6: How do you implement a route guard that checks user roles?

**Answer:**

```typescript
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    
    // Get required roles from route data
    const requiredRoles = route.data['roles'] as string[];
    
    // If no roles required, allow
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if user has required role
    const userRole = this.authService.getUserRole();
    
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // User doesn't have role - redirect to access denied
    return this.router.parseUrl('/access-denied');
  }
}

// Route configuration
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'superadmin'] }
  },
  {
    path: 'moderator',
    component: ModeratorComponent,
    canActivate: [RoleGuard],
    data: { roles: ['moderator', 'admin'] }
  }
];
```

**Advanced: Async Role Check**
```typescript
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    
    const requiredRoles = route.data['roles'] as string[];

    // Return observable for async role check
    return this.authService.getUserRole$().pipe(
      map(userRole => {
        if (requiredRoles.includes(userRole)) {
          return true;
        }
        return this.router.parseUrl('/access-denied');
      })
    );
  }
}
```

---

### Q7: How do you handle unsaved changes before navigation?

**Answer:**

```typescript
// Unsaved changes interface
export interface ComponentCanDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

// Guard implementation
@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(
    component: ComponentCanDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

// Component implementation
@Component({
  selector: 'app-form',
  template: `
    <form [formGroup]="form">
      <input formControlName="name">
      <button (click)="save()">Save</button>
    </form>
  `
})
export class FormComponent implements ComponentCanDeactivate {
  form: FormGroup;
  originalValue: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['']
    });
    this.originalValue = this.form.value;
  }

  save() {
    // Save and update original
    this.originalValue = this.form.value;
  }

  canDeactivate(): boolean {
    // If form hasn't changed, allow navigation
    if (JSON.stringify(this.form.value) === JSON.stringify(this.originalValue)) {
      return true;
    }

    // Ask user for confirmation
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
}

// Route configuration
{
  path: 'edit',
  component: FormComponent,
  canDeactivate: [UnsavedChangesGuard]
}
```

---

### Q8: How do you implement a Resolve guard to pre-load data?

**Answer:**

```typescript
// Resolver
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User> {
    const userId = route.paramMap.get('id');

    return this.userService.getUser(userId).pipe(
      // Handle error - return default user or throw
      catchError(error => {
        console.error('Error loading user:', error);
        return throwError(() => new Error('Could not load user'));
      })
    );
  }
}

// Route configuration
{
  path: 'user/:id',
  component: UserDetailComponent,
  resolve: {
    user: UserResolver
  }
}

// Component using resolved data
@Component({
  selector: 'app-user-detail',
  template: `
    <div *ngIf="user">
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
    </div>
  `
})
export class UserDetailComponent implements OnInit {
  user: User;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Data is already loaded before component initializes
    this.user = this.route.snapshot.data['user'];
  }
}
```

**Benefits:**
- No loading spinner needed (data preloaded)
- Consistent component initialization
- Error handling before component loads
- No race conditions

---

### Q9: What's the difference between `CanActivate` and `CanLoad`?

**Answer:**

| Feature | CanActivate | CanLoad |
|---------|-----------|---------|
| Fires | Before route activates | Before module is lazy loaded |
| Module loaded | Already loaded | Can prevent loading |
| Use case | Route protection | Lazy module protection |
| Download | Component already downloaded | Can prevent download |
| Efficiency | Less efficient for lazy routes | More efficient (prevent download) |

**Example:**

```typescript
// CanActivate - fires after module loads
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
    // Admin module WILL be downloaded, but CanActivate prevents entry
  }
];

// CanLoad - fires before module loads
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthGuard]
    // Admin module WON'T be downloaded if user not authorized
  }
];
```

**Implementation:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

---

### Q10: How do you implement a preloading strategy?

**Answer:**

```typescript
// Strategy 1: Selective preloading (only marked routes)
@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}

// Strategy 2: Delayed preloading (wait then preload)
@Injectable({
  providedIn: 'root'
})
export class DelayedPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      // Wait 5 seconds then preload
      return timer(5000).pipe(mergeMap(() => load()));
    }
    return of(null);
  }
}

// Strategy 3: All modules (preload everything)
// Use built-in: PreloadAllModules

// Apply strategy to router
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadingStrategy
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// Mark routes to preload
const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
    data: { preload: true } // Will be preloaded
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    // Won't be preloaded (not marked)
  }
];
```

---

## Advanced Level

### Q11: How do you implement route animations?

**Answer:**

```typescript
// route-animation.ts
import { trigger, transition, style, animate, group } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimation', [
  transition('HomePage <=> ProductsPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [
      style({ left: '100%' })
    ]),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ left: '-100%' }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease-out', style({ left: '0%' }))
      ])
    ])
  ])
]);

// app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <div [@routeAnimation]="prepareRoute(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  animations: [slideInAnimation]
})
export class AppComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}

// Routes with animation data
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'HomePage' }
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { animation: 'ProductsPage' }
  }
];
```

---

### Q12: How do you handle nested routes with multiple outlet slots?

**Answer:**

```typescript
// Template with named outlets
<ng-container *ngIf="role === 'admin'">
  <router-outlet name="sidebar"></router-outlet>
</ng-container>

<router-outlet></router-outlet> <!-- Primary outlet -->
<router-outlet name="footer"></router-outlet>

// Route configuration with multiple outlets
const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        outlet: 'primary'
      },
      {
        path: 'sidebar',
        component: AdminSidebarComponent,
        outlet: 'sidebar'
      },
      {
        path: 'footer',
        component: FooterComponent,
        outlet: 'footer'
      }
    ]
  }
];

// Navigation to multiple outlets
this.router.navigate([
  {
    outlets: {
      primary: ['admin', 'dashboard'],
      sidebar: ['admin', 'sidebar'],
      footer: ['footer']
    }
  }
]);
```

---

### Q13: How do you track and respond to all navigation events?

**Answer:**

```typescript
@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="loading" class="spinner"></div>
  `
})
export class AppComponent implements OnInit {
  loading = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart || event instanceof NavigationEnd),
      tap(event => {
        if (event instanceof NavigationStart) {
          this.loading = true;
          console.log('Started navigation to:', event.url);
        } else if (event instanceof NavigationEnd) {
          this.loading = false;
          console.log('Ended navigation to:', event.urlAfterRedirects);
        }
      })
    ).subscribe();
  }
}

// All navigation events:
export enum NavigationEventType {
  NavigationStart = 'start',           // Navigation started
  NavigationEnd = 'end',                // Navigation succeeded
  NavigationCancel = 'cancel',          // Navigation cancelled
  NavigationError = 'error',            // Navigation failed
  Scroll = 'scroll',                    // User scrolled
  GuardsCheckStart = 'guards_start',   // Guards check started
  GuardsCheckEnd = 'guards_end',       // Guards check ended
  ActivationStart = 'activate_start',  // Activation started
  ActivationEnd = 'activate_end'       // Activation ended
}
```

---

### Q14: How do you implement route caching/reuse strategies?

**Answer:**

```typescript
@Injectable({
  providedIn: 'root'
})
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: Map<string, DetachedRouteHandle> = new Map();

  // Store route in cache when leaving
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const path = route.routeConfig?.path || '';
    this.handlers.set(path, handle);
  }

  // Retrieve route from cache
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path || '';
    return this.handlers.has(path);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = route.routeConfig?.path || '';
    return this.handlers.get(path) || null;
  }

  // Allow reuse if same route
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

// Mark routes to cache
const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
    data: { reuse: true } // Component will be cached
  }
];

// App module
@NgModule({
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CacheRouteReuseStrategy
    }
  ]
})
export class AppModule {}
```

**Benefits:**
- Preserves component state
- Faster navigation
- Form data retained
- Scroll position preserved

---

### Q15: How would you architect routing for a large-scale application?

**Answer:**

```typescript
// Project structure
src/
├── app/
│   ├── app.routing.module.ts          // Root routing
│   ├── app.component.ts
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── role.guard.ts
│   │   │   └── unsaved-changes.guard.ts
│   │   ├── services/
│   │   ├── interceptors/
│   │   └── core.module.ts
│   ├── shared/
│   │   ├── components/
│   │   └── shared.module.ts
│   ├── features/
│   │   ├── admin/
│   │   │   ├── admin.routing.module.ts
│   │   │   ├── admin.module.ts
│   │   │   ├── pages/
│   │   │   └── services/
│   │   ├── products/
│   │   │   ├── products.routing.module.ts
│   │   │   ├── products.module.ts
│   │   │   ├── pages/
│   │   │   └── services/
│   │   └── user/
│   │       ├── user.routing.module.ts
│   │       ├── user.module.ts
│   │       └── pages/

// Root routing (app.routing.module.ts)
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule),
        data: { preload: true }
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [RoleGuard],
        data: { roles: ['admin'] }
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

// Feature module routing (products.routing.module.ts)
const routes: Routes = [
  {
    path: '',
    component: ProductsLayoutComponent,
    children: [
      {
        path: '',
        component: ProductListComponent
      },
      {
        path: ':id',
        component: ProductDetailComponent,
        resolve: { product: ProductResolver }
      },
      {
        path: ':id/edit',
        component: ProductEditComponent,
        canDeactivate: [UnsavedChangesGuard],
        resolve: { product: ProductResolver }
      }
    ]
  }
];

// Benefits of this architecture:
// 1. Scalable - easy to add new features
// 2. Lazy loaded - better performance
// 3. Organized - clear separation of concerns
// 4. Secure - guards and resolvers centralized
// 5. Maintainable - each feature is self-contained
```

---

## Summary

**Key Concepts:**
1. Route guards control access and navigation
2. Lazy loading improves performance
3. Route parameters are required; query params are optional
4. Multiple outlet slots enable complex layouts
5. Preloading strategies optimize user experience
6. Caching strategies preserve component state
7. Navigation events enable tracking and logging
8. Proper architecture scales with application size

**Best Practices:**
1. Use guards for security and validation
2. Lazy load feature modules
3. Pre-resolve data before component loads
4. Organize routes by feature, not by type
5. Use named outlets for complex layouts
6. Implement error handling for failed navigation
7. Cache important routes to preserve state
8. Monitor navigation events for analytics
