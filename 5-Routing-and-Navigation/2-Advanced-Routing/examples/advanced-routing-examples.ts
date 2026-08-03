/**
 * Advanced Routing Examples for Angular Applications
 * Demonstrates route guards, lazy loading, nested routes, and navigation techniques
 */

// ============================================================================
// EXAMPLE 1: Complete Route Guards Setup
// ============================================================================

// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  getUserRole(): string {
    return this.currentUser.value?.roles[0] || 'user';
  }

  hasRole(role: string): boolean {
    return this.currentUser.value?.roles.includes(role) || false;
  }

  login(email: string, password: string): Observable<User> {
    // Simulate API call
    const user: User = {
      id: 1,
      name: 'John Doe',
      email,
      roles: ['user']
    };
    this.currentUser.next(user);
    return new Observable(observer => {
      observer.next(user);
      observer.complete();
    });
  }

  logout() {
    this.currentUser.next(null);
  }
}

// ============================================================================
// EXAMPLE 2: Authentication Guard
// ============================================================================

// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
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
      return true;
    }

    // Store the requested URL for redirecting after login
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  }
}

// ============================================================================
// EXAMPLE 3: Role-Based Access Guard
// ============================================================================

// role.guard.ts
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
    
    if (!requiredRoles) {
      return true; // No role requirement
    }

    const userRole = this.authService.getUserRole();

    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // User doesn't have required role
    this.router.navigate(['/access-denied']);
    return false;
  }
}

// ============================================================================
// EXAMPLE 4: Unsaved Changes Guard
// ============================================================================

// unsaved-changes.guard.ts
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(
    component: ComponentCanDeactivate
  ): Observable<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

// form-edit.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentCanDeactivate } from './unsaved-changes.guard';

@Component({
  selector: 'app-form-edit',
  template: `
    <form [formGroup]="form">
      <input formControlName="name" placeholder="Name">
      <input formControlName="email" placeholder="Email">
      <button (click)="save()">Save</button>
    </form>
  `
})
export class FormEditComponent implements ComponentCanDeactivate {
  form: FormGroup;
  originalFormValue: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      email: ['']
    });

    this.originalFormValue = this.form.value;

    this.form.valueChanges.subscribe(() => {
      // Form has changed
    });
  }

  save() {
    // Save changes
    this.originalFormValue = this.form.value;
  }

  canDeactivate(): boolean {
    if (this.form.value !== this.originalFormValue) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }
}

// ============================================================================
// EXAMPLE 5: Data Resolver
// ============================================================================

// user.resolver.ts
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
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

    return this.userService.getUser(userId).pipe(
      catchError(error => {
        console.error('Error loading user:', error);
        return of(null);
      })
    );
  }
}

// user.service.ts
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`).pipe(
      delay(500) // Simulate network delay
    );
  }
}

// user-detail.component.ts
@Component({
  selector: 'app-user-detail',
  template: `
    <div *ngIf="user; else loading">
      <h1>{{ user.name }}</h1>
      <p>Email: {{ user.email }}</p>
      <p>Role: {{ user.role }}</p>
    </div>
    <ng-template #loading>
      <p>Loading...</p>
    </ng-template>
  `
})
export class UserDetailComponent implements OnInit {
  user: User;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Data is already resolved by the resolver
    this.user = this.route.snapshot.data['user'];
  }
}

// ============================================================================
// EXAMPLE 6: Complete Routing Configuration
// ============================================================================

// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Public routes
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // Protected routes - require authentication
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  // Admin routes - require admin role
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    canActivateChild: [RoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'users',
        component: UserManagementComponent,
        data: { roles: ['admin'] },
        children: [
          {
            path: '',
            component: UserListComponent
          },
          {
            path: ':id',
            component: UserDetailComponent,
            resolve: { user: UserResolver }
          },
          {
            path: ':id/edit',
            component: UserEditComponent,
            canDeactivate: [UnsavedChangesGuard],
            resolve: { user: UserResolver }
          }
        ]
      },
      {
        path: 'settings',
        component: AdminSettingsComponent,
        data: { roles: ['admin'] }
      }
    ]
  },

  // Feature module with lazy loading
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then(m => m.ProductsModule),
    data: { preload: true }
  },

  // User profile routes
  {
    path: 'profile',
    component: ProfileLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ProfileViewComponent,
        resolve: { user: UserResolver }
      },
      {
        path: 'edit',
        component: ProfileEditComponent,
        canDeactivate: [UnsavedChangesGuard]
      },
      {
        path: 'settings',
        component: ProfileSettingsComponent
      }
    ]
  },

  // Wildcard route - must be last
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// ============================================================================
// EXAMPLE 7: Feature Module Routing
// ============================================================================

// products/products.module.ts
@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductCreateComponent,
    ProductEditComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule {}

// products/products-routing.module.ts
const productRoutes: Routes = [
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
    path: 'create',
    component: ProductCreateComponent,
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: ':id/edit',
    component: ProductEditComponent,
    canDeactivate: [UnsavedChangesGuard],
    resolve: { product: ProductResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(productRoutes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {}

// ============================================================================
// EXAMPLE 8: Navigation with Parameters
// ============================================================================

// product-list.component.ts
@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <input [(ngModel)]="searchTerm" (change)="search()">
      <select [(ngModel)]="sortBy" (change)="sort()">
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>

      <div *ngFor="let product of products">
        <h3 (click)="viewProduct(product.id)">{{ product.name }}</h3>
        <button (click)="editProduct(product.id)">Edit</button>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  sortBy: string = 'name';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // Read query parameters
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('q') || '';
      this.sortBy = params.get('sort') || 'name';
      this.loadProducts();
    });
  }

  search() {
    // Update URL with new query parameters
    this.router.navigate(['/products'], {
      queryParams: {
        q: this.searchTerm,
        sort: this.sortBy
      },
      queryParamsHandling: 'merge'
    });
  }

  sort() {
    this.router.navigate(['/products'], {
      queryParams: { sort: this.sortBy },
      queryParamsHandling: 'merge'
    });
  }

  viewProduct(id: number) {
    // Navigate to product detail with route parameter
    this.router.navigate(['/products', id]);
  }

  editProduct(id: number) {
    // Navigate with route parameter and preserve query params
    this.router.navigate(['/products', id, 'edit'], {
      queryParamsHandling: 'preserve'
    });
  }

  loadProducts() {
    this.productService.search(this.searchTerm, this.sortBy).subscribe(
      products => this.products = products
    );
  }
}

// ============================================================================
// EXAMPLE 9: Route Navigation Events
// ============================================================================

// app.component.ts
@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <div *ngIf="loading" class="spinner">Loading...</div>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/products" routerLinkActive="active">Products</a>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {
  loading = false;

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
        console.log('Navigation started to:', event.url);
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
        console.log('Navigation ended:', event.urlAfterRedirects);
        window.scrollTo(0, 0);
      } else if (event instanceof NavigationCancel) {
        this.loading = false;
        console.log('Navigation cancelled');
      } else if (event instanceof NavigationError) {
        this.loading = false;
        console.error('Navigation error:', event.error);
      }
    });
  }
}

// ============================================================================
// EXAMPLE 10: Relative Navigation
// ============================================================================

// user-detail.component.ts
@Component({
  selector: 'app-user-detail',
  template: `
    <div>
      <h1>{{ user.name }}</h1>
      <button (click)="goToEdit()">Edit</button>
      <button (click)="goToList()">Back to List</button>
    </div>
  `
})
export class UserDetailComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.route.snapshot.data['user'];
  }

  goToEdit() {
    // Relative navigation - from /admin/users/1 to /admin/users/1/edit
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  goToList() {
    // Relative navigation - from /admin/users/1 to /admin/users
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}

// ============================================================================
// EXAMPLE 11: Conditional Navigation
// ============================================================================

// checkout.component.ts
@Component({
  selector: 'app-checkout',
  template: `
    <div>
      <button (click)="completeCheckout()">Complete Checkout</button>
    </div>
  `
})
export class CheckoutComponent {
  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  completeCheckout() {
    if (!this.authService.isLoggedIn()) {
      // Redirect to login
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' }
      });
      return;
    }

    this.orderService.createOrder().subscribe(
      order => {
        // Navigate to confirmation with order ID
        this.router.navigate(['/order-confirmation', order.id]);
      },
      error => {
        // Handle error - navigate to error page
        this.router.navigate(['/error'], {
          queryParams: { message: error.message }
        });
      }
    );
  }
}

// ============================================================================
// EXAMPLE 12: Deep Linking with Query Strings
// ============================================================================

// email-list.component.ts
@Component({
  selector: 'app-email-list',
  template: `
    <div>
      <input [(ngModel)]="filter" (change)="updateFilter()">
      <select [(ngModel)]="page" (change)="updatePage()">
        <option value="1">Page 1</option>
        <option value="2">Page 2</option>
        <option value="3">Page 3</option>
      </select>

      <div *ngFor="let email of emails" (click)="selectEmail(email.id)">
        {{ email.subject }}
      </div>
    </div>
  `
})
export class EmailListComponent implements OnInit {
  emails: Email[] = [];
  filter: string = '';
  page: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    // Initialize from query parameters
    this.route.queryParamMap.subscribe(params => {
      this.filter = params.get('filter') || '';
      this.page = parseInt(params.get('page') || '1', 10);
      this.loadEmails();
    });
  }

  updateFilter() {
    this.router.navigate(['/emails'], {
      queryParams: {
        filter: this.filter,
        page: 1
      }
    });
  }

  updatePage() {
    this.router.navigate(['/emails'], {
      queryParams: {
        filter: this.filter,
        page: this.page
      }
    });
  }

  selectEmail(id: number) {
    this.router.navigate(['/emails', id], {
      queryParamsHandling: 'preserve'
    });
  }

  loadEmails() {
    this.emailService.getEmails(this.filter, this.page).subscribe(
      emails => this.emails = emails
    );
  }
}

// ============================================================================
// EXAMPLE 13: Route Reuse Strategy
// ============================================================================

// custom-route-reuse-strategy.ts
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: Map<string, DetachedRouteHandle> = new Map();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Store routes marked with reuse: true
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getRouteKey(route);
    this.handlers.set(key, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getRouteKey(route);
    return this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getRouteKey(route);
    return this.handlers.get(key) || null;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    return route.routeConfig?.path || '';
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

// ============================================================================
// EXAMPLE 14: Preloading Strategy
// ============================================================================

// custom-preloading.strategy.ts
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}

export class DelayedPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      // Preload after 5 seconds
      return timer(5000).pipe(mergeMap(() => load()));
    }
    return of(null);
  }
}

// app-routing.module.ts
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadingStrategy
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

// Mark routes for preloading
const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
    data: { preload: true }
  }
];
