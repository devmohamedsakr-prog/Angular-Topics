/**
 * Angular Routing - Complete Examples
 * Demonstrates basic routing, guards, parameters, lazy loading, and navigation
 */

import {
  RouterModule,
  Routes,
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  CanDeactivate,
  Resolve,
  RouteReuseStrategy,
  DetachedRouteHandle,
  ActivationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { Injectable, NgModule, Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Basic Routing Configuration
// ============================================================================

/**
 * Simple components for routing
 */
@Component({
  selector: 'app-home',
  template: `<h1>Home Page</h1>`,
})
export class HomeComponent {}

@Component({
  selector: 'app-about',
  template: `<h1>About Page</h1>`,
})
export class AboutComponent {}

@Component({
  selector: 'app-not-found',
  template: `<h1>404 - Page Not Found</h1>`,
})
export class NotFoundComponent {}

/**
 * Basic route configuration
 */
export const basicRoutes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'about', component: AboutComponent },
  { path: '**', component: NotFoundComponent }, // Wildcard - must be last
];

// ============================================================================
// EXAMPLE 2: Route Parameters
// ============================================================================

/**
 * Component with route parameters
 */
@Component({
  selector: 'app-user-detail',
  template: `
    <div>
      <h1>User: {{ userId }}</h1>
      <p>{{ userData$ | async | json }}</p>
      <button (click)="goBack()">Back</button>
    </div>
  `,
})
export class UserDetailComponent implements OnInit, OnDestroy {
  userId: string;
  userData$: Observable<any>;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Get route parameter
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params['id'];
      this.userData$ = this.userService.getUser(this.userId);
    });

    // Alternative: Use snapshot (not reactive)
    // this.userId = this.route.snapshot.params['id'];
  }

  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/**
 * Routes with parameters
 */
export const parameterRoutes: Routes = [
  { path: 'user/:id', component: UserDetailComponent },
  { path: 'user/:id/profile', component: UserDetailComponent },
  { path: 'post/:postId/comment/:commentId', component: UserDetailComponent },
];

// ============================================================================
// EXAMPLE 3: Query Parameters
// ============================================================================

/**
 * Component with query parameters
 */
@Component({
  selector: 'app-search',
  template: `
    <div>
      <input (change)="onSearchChange($event)" placeholder="Search..." />
      <button (click)="resetFilters()">Reset</button>
      <p>Filters: {{ filters$ | async | json }}</p>
    </div>
  `,
})
export class SearchComponent implements OnInit {
  filters$: Observable<any>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Watch query parameters
    this.filters$ = this.route.queryParams;
  }

  onSearchChange(event: any): void {
    const searchTerm = event.target.value;
    // Navigate with query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: searchTerm, page: 1 },
      queryParamsHandling: 'merge', // Merge with existing
    });
  }

  resetFilters(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'merge',
    });
  }
}

/**
 * Routes with query parameters
 */
export const queryParamRoutes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    // query params are not defined here, added dynamically
  },
];

// ============================================================================
// EXAMPLE 4: Route Guards
// ============================================================================

/**
 * Authentication Service
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;

  login(): void {
    this.isAuthenticated = true;
  }

  logout(): void {
    this.isAuthenticated = false;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  canActivate(): boolean {
    return this.isAuthenticated;
  }

  hasRole(role: string): boolean {
    // Check user role
    return role === 'admin';
  }
}

/**
 * CanActivate Guard - prevent access to route
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.auth.canActivate()) {
      return true;
    }

    // Redirect to login
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}

/**
 * CanDeactivate Guard - warn before leaving unsaved changes
 */
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  canDeactivate(
    component: CanComponentDeactivate
  ): boolean | Observable<boolean> {
    return (
      component.canDeactivate() ||
      confirm('You have unsaved changes. Leave anyway?')
    );
  }
}

/**
 * Component using CanDeactivate
 */
@Component({
  selector: 'app-editor',
  template: `
    <textarea [(ngModel)]="content"></textarea>
    <button (click)="save()">Save</button>
  `,
})
export class EditorComponent implements CanComponentDeactivate {
  content = '';
  isSaved = true;

  canDeactivate(): boolean {
    return this.isSaved;
  }

  save(): void {
    console.log('Saved:', this.content);
    this.isSaved = true;
  }
}

/**
 * Role-based Guard
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const requiredRole = route.data['role'];

    if (this.auth.hasRole(requiredRole)) {
      return true;
    }

    this.router.navigate(['/forbidden']);
    return false;
  }
}

// ============================================================================
// EXAMPLE 5: Resolve Guard (Data Preloading)
// ============================================================================

/**
 * Resolve Guard - load data before activating route
 */
@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<any> {
  constructor(private userService: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id = route.paramMap.get('id');
    return this.userService.getUser(id!);
  }
}

/**
 * Component using Resolved data
 */
@Component({
  selector: 'app-user-resolved',
  template: `<div>{{ user | json }}</div>`,
})
export class UserResolvedComponent implements OnInit {
  user: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Data already resolved
    this.user = this.route.snapshot.data['user'];
  }
}

/**
 * Routes with Resolve
 */
export const resolveRoutes: Routes = [
  {
    path: 'user/:id',
    component: UserResolvedComponent,
    resolve: { user: UserResolver },
  },
];

// ============================================================================
// EXAMPLE 6: Lazy Loading
// ============================================================================

/**
 * Feature module (lazy loaded)
 */
@Component({
  selector: 'app-admin-dashboard',
  template: `<h1>Admin Dashboard</h1>`,
})
export class AdminDashboardComponent {}

@Component({
  selector: 'app-admin-users',
  template: `<h1>Manage Users</h1>`,
})
export class AdminUsersComponent {}

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [{ path: 'users', component: AdminUsersComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
})
export class AdminModule {}

/**
 * Main routes with lazy loading
 */
export const lazyLoadingRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
  },
];

// ============================================================================
// EXAMPLE 7: Nested Routing
// ============================================================================

/**
 * Parent component with router outlet
 */
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <nav>
        <a routerLink="overview">Overview</a>
        <a routerLink="analytics">Analytics</a>
        <a routerLink="settings">Settings</a>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class DashboardComponent {}

@Component({
  selector: 'app-overview',
  template: `<h2>Overview</h2>`,
})
export class OverviewComponent {}

@Component({
  selector: 'app-analytics',
  template: `<h2>Analytics</h2>`,
})
export class AnalyticsComponent {}

@Component({
  selector: 'app-settings',
  template: `<h2>Settings</h2>`,
})
export class SettingsComponent {}

/**
 * Nested routes
 */
export const nestedRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];

// ============================================================================
// EXAMPLE 8: Programmatic Navigation
// ============================================================================

@Component({
  selector: 'app-navigation',
  template: `
    <button (click)="navigateHome()">Home</button>
    <button (click)="navigateUser(5)">Go to User 5</button>
    <button (click)="navigateWithParams()">Search</button>
    <button (click)="goBack()">Back</button>
    <button (click)="goForward()">Forward</button>
  `,
})
export class NavigationComponent {
  constructor(private router: Router) {}

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  navigateUser(id: number): void {
    this.router.navigate(['/user', id]);
  }

  navigateWithParams(): void {
    this.router.navigate(['/search'], {
      queryParams: { term: 'angular', sort: 'date' },
    });
  }

  goBack(): void {
    window.history.back();
  }

  goForward(): void {
    window.history.forward();
  }
}

// ============================================================================
// EXAMPLE 9: Router Events
// ============================================================================

@Injectable({ providedIn: 'root' })
export class RouterEventService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
    this.listenToRouterEvents();
  }

  private listenToRouterEvents(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart =>
            event instanceof NavigationStart
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationStart) => {
        console.log('Navigation started to:', event.url);
      });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        console.log('Navigation ended:', event.url);
      });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationError =>
            event instanceof NavigationError
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationError) => {
        console.error('Navigation error:', event.error);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 10: Active Route Styling
// ============================================================================

@Component({
  selector: 'app-nav-menu',
  template: `
    <nav>
      <a routerLink="/home" routerLinkActive="active">Home</a>
      <a routerLink="/about" routerLinkActive="active">About</a>
      <a routerLink="/contact" routerLinkActive="active">Contact</a>
    </nav>
  `,
  styles: [
    `
      .active {
        color: blue;
        font-weight: bold;
      }
    `,
  ],
})
export class NavMenuComponent {}

// ============================================================================
// EXAMPLE 11: Complete Routing Configuration
// ============================================================================

export const completRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
  {
    path: 'user/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver },
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { title: 'Search Results' },
  },
  {
    path: 'editor',
    component: EditorComponent,
    canDeactivate: [UnsavedChangesGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
  },
  { path: '**', component: NotFoundComponent },
];

// ============================================================================
// EXAMPLE 12: Custom Route Reuse Strategy
// ============================================================================

/**
 * Cache routes by path
 */
@Injectable({ providedIn: 'root' })
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private routeCache = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return true;
  }

  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle
  ): void {
    this.routeCache.set(route.routeConfig?.path || '', handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.routeCache.has(route.routeConfig?.path || '');
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.routeCache.get(route.routeConfig?.path || '')!;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

// ============================================================================
// Mock User Service
// ============================================================================

@Injectable({ providedIn: 'root' })
export class UserService {
  getUser(id: string): Observable<any> {
    return of({ id, name: `User ${id}`, email: `user${id}@example.com` });
  }
}

// ============================================================================
// Module Configuration
// ============================================================================

@NgModule({
  imports: [RouterModule.forRoot(completRoutes)],
  providers: [
    AuthGuard,
    RoleGuard,
    UnsavedChangesGuard,
    UserResolver,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
  ],
})
export class RoutingModule {}

import { NavigationStart } from '@angular/router';
