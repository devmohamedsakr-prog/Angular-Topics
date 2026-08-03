# Advanced Routing in Angular

## Overview

While basic routing handles simple page navigation, advanced routing features enable complex application architectures. This includes route guards for access control, lazy loading for performance, nested/child routes for modular components, and advanced navigation techniques.

---

## Route Guards

Route guards protect routes by controlling whether a user can access them. They run before navigation completes and can allow, deny, or redirect users.

### 1. **CanActivate Guard** (Before entering a route)

Determines if a route can be activated. Commonly used for authentication and authorization.

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isLoggedIn()) {
      return true; // Allow access
    }
    
    // Redirect to login
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false; // Deny access
  }
}

// Role-based access guard
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
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const requiredRoles = route.data['roles'] as string[];
    const userRole = this.authService.getUserRole();
    
    if (requiredRoles.includes(userRole)) {
      return true;
    }
    
    // Redirect to access denied page
    this.router.navigate(['/access-denied']);
    return false;
  }
}

// app-routing.module.ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  }
];
```

### 2. **CanDeactivate Guard** (Before leaving a route)

Confirms if you can leave a route. Useful for unsaved changes warnings.

```typescript
// unsaved-changes.guard.ts
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

// form.component.ts
import { Component } from '@angular/core';
import { CanComponentDeactivate } from './unsaved-changes.guard';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  template: `
    <form [formGroup]="form">
      <input formControlName="name">
      <button (click)="save()">Save</button>
    </form>
  `
})
export class FormComponent implements CanComponentDeactivate {
  form: FormGroup;
  isDirty = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['']
    });
    
    this.form.valueChanges.subscribe(() => {
      this.isDirty = true;
    });
  }

  save() {
    // Save logic
    this.isDirty = false;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.isDirty) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }
}

// app-routing.module.ts
const routes: Routes = [
  {
    path: 'edit',
    component: FormComponent,
    canDeactivate: [UnsavedChangesGuard]
  }
];
```

### 3. **CanActivateChild Guard** (Before entering child routes)

Protects all child routes. Useful for protecting entire feature modules.

```typescript
// feature-access.guard.ts
@Injectable({
  providedIn: 'root'
})
export class FeatureAccessGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.hasFeatureAccess(route.data['feature'])) {
      return true;
    }
    
    this.router.navigate(['/access-denied']);
    return false;
  }
}

// app-routing.module.ts
const routes: Routes = [
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivateChild: [FeatureAccessGuard],
    data: { feature: 'user-management' },
    children: [
      { path: 'list', component: UserListComponent },
      { path: 'detail/:id', component: UserDetailComponent },
      { path: 'edit/:id', component: UserEditComponent }
    ]
  }
];
```

### 4. **Resolve Guard** (Pre-fetch data before activation)

Fetches data before a route activates. Ensures data is available when component loads.

```typescript
// user.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

interface User {
  id: number;
  name: string;
  email: string;
}

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
    return this.userService.getUser(userId);
  }
}

// user-detail.component.ts
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
    // Data is already resolved and available
    this.user = this.route.snapshot.data['user'];
  }
}

// app-routing.module.ts
const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetailComponent,
    resolve: {
      user: UserResolver
    }
  }
];
```

---

## Lazy Loading

Lazy loading delays loading module code until it's needed, reducing initial bundle size.

### Basic Lazy Loading

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
    canActivate: [AuthGuard]
  }
];

// products/products.module.ts
@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule {}

// products/products-routing.module.ts
const routes: Routes = [
  {
    path: '',
    component: ProductListComponent
  },
  {
    path: ':id',
    component: ProductDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}
```

### Preloading Strategies

```typescript
// custom-preloading-strategy.ts
import { PreloadAllModules, PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

// Strategy 1: Preload all modules
export class AppPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    } else {
      return of(null);
    }
  }
}

// Strategy 2: Preload with delay
export class DelayedPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      // Preload after 5 seconds of inactivity
      return timer(5000).pipe(mergeMap(() => load()));
    }
    return of(null);
  }
}

// app-routing.module.ts
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: AppPreloadingStrategy
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
    data: { preload: true }
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { preload: true }
  }
];
```

---

## Nested/Child Routes

Organize routes hierarchically with child routes under parent routes.

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        component: UserManagementComponent,
        children: [
          {
            path: '',
            component: UserListComponent
          },
          {
            path: ':id/edit',
            component: UserEditComponent
          },
          {
            path: 'new',
            component: UserCreateComponent
          }
        ]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: 'general',
            component: GeneralSettingsComponent
          },
          {
            path: 'security',
            component: SecuritySettingsComponent
          }
        ]
      }
    ]
  }
];

// admin-layout.component.ts
@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="admin-container">
      <nav>
        <a routerLink="users" routerLinkActive="active">Users</a>
        <a routerLink="settings" routerLinkActive="active">Settings</a>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {}

// Navigation
// /admin/users -> Shows UserListComponent
// /admin/users/1/edit -> Shows UserEditComponent
// /admin/settings/general -> Shows GeneralSettingsComponent
```

---

## Route Parameters

### 1. **Route Parameters** (Part of URL)

```typescript
const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetailComponent
  },
  {
    path: 'post/:id/comment/:commentId',
    component: CommentDetailComponent
  }
];

// user-detail.component.ts
@Component({
  selector: 'app-user-detail',
  template: `<h1>User: {{ userId }}</h1>`
})
export class UserDetailComponent implements OnInit {
  userId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Method 1: Snapshot (not recommended for dynamic routes)
    this.userId = +this.route.snapshot.paramMap.get('id');

    // Method 2: Observable (recommended)
    this.route.paramMap.subscribe(params => {
      this.userId = +params.get('id');
      // Fetch user data
    });
  }
}

// Navigation
this.router.navigate(['/user', userId]);
this.router.navigate(['/post', postId, 'comment', commentId]);
```

### 2. **Query Parameters** (After ?)

```typescript
const routes: Routes = [
  {
    path: 'products',
    component: ProductListComponent
  }
];

// product-list.component.ts
@Component({
  selector: 'app-product-list',
  template: `
    <input [(ngModel)]="searchTerm" (change)="search()">
    <div *ngFor="let product of products">{{ product.name }}</div>
  `
})
export class ProductListComponent implements OnInit {
  searchTerm: string = '';
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Method 1: Snapshot
    this.searchTerm = this.route.snapshot.queryParamMap.get('q') || '';

    // Method 2: Observable
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('q') || '';
      this.loadProducts();
    });
  }

  search() {
    this.router.navigate(['/products'], {
      queryParams: { q: this.searchTerm }
    });
  }

  loadProducts() {
    this.productService.search(this.searchTerm).subscribe(
      products => this.products = products
    );
  }
}

// URL: /products?q=laptop&sort=price&page=2
// Access: queryParamMap.get('q'), queryParamMap.get('sort'), etc.

// Navigation
this.router.navigate(['/products'], {
  queryParams: { q: 'laptop', sort: 'price', page: 1 }
});

// Preserve existing query params
this.router.navigate(['/products'], {
  queryParams: { q: 'new-search' },
  queryParamsHandling: 'merge' // or 'preserve'
});
```

### 3. **Fragment** (URL hash)

```typescript
// Navigation to section
this.router.navigate(['/docs'], {
  fragment: 'routing'
});
// URL: /docs#routing

// Access fragment
this.route.fragment.subscribe(fragment => {
  if (fragment === 'routing') {
    this.scrollToRouting();
  }
});
```

---

## Advanced Navigation Techniques

### 1. **Navigation Events**

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="isLoading" class="spinner"></div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.isLoading = false;
        window.scrollTo(0, 0);
      } else if (event instanceof NavigationError) {
        this.isLoading = false;
        console.error('Navigation error:', event.error);
      }
    });
  }
}
```

### 2. **Programmatic Navigation**

```typescript
// Simple navigation
this.router.navigate(['/products']);

// Navigation with parameters
this.router.navigate(['/user', userId, 'edit']);

// Navigation with query parameters
this.router.navigate(['/search'], {
  queryParams: { keyword: 'angular', page: 1 }
});

// Relative navigation
this.router.navigate(['../edit'], { relativeTo: this.route });

// Replace history entry
this.router.navigate(['/dashboard'], {
  replaceUrl: true // Back button won't go to previous page
});

// Preserve or merge query parameters
this.router.navigate(['/products'], {
  queryParams: { new: 'param' },
  queryParamsHandling: 'merge'
});
```

### 3. **Conditional Navigation**

```typescript
async navigateToUserDetail(userId: number) {
  try {
    // Check if user exists
    const user = await this.userService.getUser(userId).toPromise();
    
    if (user) {
      this.router.navigate(['/user', userId]);
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.log('Error loading user');
  }
}
```

---

## Route Reuse Strategy

Control how Angular handles component instances when navigating.

```typescript
// custom-route-reuse-strategy.ts
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: Map<string, DetachedRouteHandle> = new Map();

  // Determine if route should be stored
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data['reuse'] === true;
  }

  // Store the route
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.handlers.set(route.routeConfig.path as string, handle);
  }

  // Determine if stored route should be reused
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.handlers.has(route.routeConfig.path as string);
  }

  // Retrieve and return stored route
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const handle = this.handlers.get(route.routeConfig.path as string);
    return handle || null;
  }

  // Allow component reuse
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

// app.module.ts
@NgModule({
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ]
})
export class AppModule {}

// Mark routes to reuse
const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
    data: { reuse: true }
  }
];
```

---

## Route Animation

Add animations when navigating between routes.

```typescript
// route-animation.ts
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
    sequence([
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
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

// Mark routes with animation data
const routes: Routes = [
  {
    path: '',
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

## Best Practices

1. **Always use Observable for dynamic data**
   - Subscribe to `paramMap`, `queryParamMap` when data changes dynamically
   - Don't use snapshot for routes that can be revisited

2. **Organize routes by feature**
   - Use lazy loading for large modules
   - Create routing modules per feature

3. **Implement route guards for security**
   - CanActivate for authentication
   - CanDeactivate for unsaved changes
   - Resolve for data pre-loading

4. **Use relative navigation for nested routes**
   - More maintainable than absolute paths
   - Easier to reorganize route structure

5. **Handle navigation errors**
   - Subscribe to NavigationError events
   - Provide user feedback
   - Implement fallback routes

6. **Preserve query parameters strategically**
   - Use `queryParamsHandling: 'merge'` when needed
   - Clear query params when appropriate

7. **Preload critical routes**
   - Mark important modules for preloading
   - Implement custom preloading strategies

8. **Monitor route changes**
   - Use filter to track specific events
   - Log navigation for debugging

---

## Summary

Advanced routing features enable complex, enterprise-level applications:

- **Route Guards**: Control access and protect routes
- **Lazy Loading**: Optimize performance by loading modules on demand
- **Nested Routes**: Organize routes hierarchically
- **Route Parameters**: Pass data through URL
- **Navigation Events**: Monitor and react to route changes
- **Route Reuse**: Optimize component lifecycle
- **Animations**: Enhance user experience

Master these techniques to build scalable, performant Angular applications.
