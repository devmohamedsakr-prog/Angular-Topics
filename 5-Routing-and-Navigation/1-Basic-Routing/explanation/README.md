# Angular Routing - Complete Guide

## Router Module Setup

```typescript
// app.routes.ts (Standalone API - Angular 14+)
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { AboutComponent } from './pages/about.component';
import { UserComponent } from './pages/user.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'users/:id', component: UserComponent },
  { path: '**', component: NotFoundComponent } // Wildcard route (must be last)
];

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});

// OR using NgModule (traditional)
// app.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // ... more routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: [AppComponent]
})
export class AppModule {}
```

## Basic Routing

```typescript
// Component with navigation
@Component({
  selector: 'app-navigation',
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
      <a [routerLink]="['/users', userId]">User Profile</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class NavigationComponent {
  userId = 123;
}

// Programmatic navigation
@Component({
  template: `
    <button (click)="navigateHome()">Go Home</button>
  `
})
export class ButtonComponent {
  constructor(private router: Router) {}

  navigateHome() {
    this.router.navigate(['/']);
  }

  navigateToUser(id: number) {
    this.router.navigate(['/users', id]);
  }
}
```

## Route Parameters

```typescript
// Route definition with parameters
const routes: Routes = [
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'posts/:id/comments/:commentId', component: CommentComponent }
];

// Reading route parameters
@Component({
  template: `
    <h1>User {{ userId }}</h1>
    <button (click)="goToNext()">Next User</button>
  `
})
export class UserDetailComponent implements OnInit {
  userId: number;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Method 1: Subscribe to params (recommended)
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.loadUser(this.userId);
    });

    // Method 2: Snapshot (one-time read)
    this.userId = this.route.snapshot.params['id'];
  }

  goToNext() {
    this.router.navigate(['/users', this.userId + 1]);
  }
}
```

## Query Parameters

```typescript
// Passing query parameters
this.router.navigate(['/search'], { queryParams: { q: 'angular', sort: 'date' } });
// URL: /search?q=angular&sort=date

this.router.navigate(['/users'], { queryParams: { page: 2, pageSize: 10 } });

// Reading query parameters
@Component({
  template: `
    <p>Search term: {{ searchTerm }}</p>
    <p>Sort by: {{ sortBy }}</p>
  `
})
export class SearchComponent implements OnInit {
  searchTerm: string;
  sortBy: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Method 1: Subscribe (recommended)
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.sortBy = params['sort'] || 'relevance';
    });

    // Method 2: Snapshot
    this.searchTerm = this.route.snapshot.queryParams['q'];
  }
}
```

## Fragment Navigation

```typescript
// Navigation with fragment
this.router.navigate(['/page'], { fragment: 'section1' });
// URL: /page#section1

// Reading fragment
this.route.fragment.subscribe(fragment => {
  console.log('Fragment:', fragment);
});
```

## Route Configuration

```typescript
const routes: Routes = [
  // Simple route
  { path: '', component: HomeComponent },

  // Path with component
  { path: 'about', component: AboutComponent },

  // Route with route-level data
  { 
    path: 'admin',
    component: AdminComponent,
    data: { title: 'Admin Dashboard' }
  },

  // Lazy loaded module
  {
    path: 'feature',
    loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule)
  },

  // Route with children (nested routes)
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  },

  // Wildcard route (must be last)
  { path: '**', component: NotFoundComponent }
];

// Accessing route data
@Component({})
export class AdminComponent implements OnInit {
  title: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.title = data['title'];
    });
  }
}
```

## Active Route Styling

```typescript
@Component({
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        Home
      </a>
      <a routerLink="/about" routerLinkActive="active">
        About
      </a>
      <a routerLink="/contact" routerLinkActive="active">
        Contact
      </a>
    </nav>
  `,
  styles: [`
    a.active {
      font-weight: bold;
      color: blue;
    }
  `]
})
export class NavigationComponent {}
```

## Router Events

```typescript
@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="loading" class="spinner">Loading...</div>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  loading = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
      } else if (event instanceof NavigationError) {
        this.loading = false;
        console.error('Navigation error:', event.error);
      }
    });
  }
}

// Import navigation events
import { 
  NavigationStart, 
  NavigationEnd, 
  NavigationError,
  NavigationCancel 
} from '@angular/router';
```

## Nested Routes (Outlet)

```typescript
// Parent component with nested router-outlet
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <aside>
        <nav>
          <a routerLink="overview">Overview</a>
          <a routerLink="analytics">Analytics</a>
          <a routerLink="reports">Reports</a>
        </nav>
      </aside>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DashboardComponent {}

// Routes configuration
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  }
];
```

## Multi-level Nested Routes

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
        children: [
          { path: '', component: UserListComponent },
          { path: ':id', component: UserDetailComponent },
          { path: ':id/edit', component: UserEditComponent }
        ]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', component: SettingsOverviewComponent },
          { path: 'account', component: AccountSettingsComponent }
        ]
      }
    ]
  }
];

// Navigation to nested routes
this.router.navigate(['/admin/users', userId, 'edit']);
// URL: /admin/users/123/edit
```

## Default and Wildcard Routes

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },

  // Default redirect
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Wildcard (must be last)
  { path: '**', component: PageNotFoundComponent }
];

// Redirect route
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'old-path', redirectTo: 'new-path' },
  { path: '**', component: NotFoundComponent }
];
```

## RouteReuseStrategy

```typescript
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

// Custom route reuse strategy
export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedRoutes: Map<string, DetachedRouteHandle> = new Map();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRoutes.set(route.url[0].path, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRoutes.has(route.url[0].path);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.storedRoutes.get(route.url[0].path);
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

// Provide custom strategy
@NgModule({
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ]
})
export class AppModule {}
```

## Best Practices

1. **Use lazy loading** - Load feature modules only when needed
2. **Implement route guards** - Protect routes from unauthorized access
3. **Use trackBy in loops** - Improve performance with *ngFor in routing
4. **Handle 404s** - Provide user-friendly not found page
5. **Use relative paths** - More maintainable in nested routes
6. **Clear data after navigation** - Prevent memory leaks
7. **Unsubscribe from routes** - Clean up subscriptions
8. **Use routerLink for navigation** - Better than programmatic navigation

## Key Takeaways

- Router enables single-page app navigation
- Route parameters and query strings pass data between routes
- Router outlet displays current route component
- Nested routes enable complex navigation structures
- Guards protect routes from unauthorized access
- Lazy loading improves initial load time
- Route reuse strategies optimize performance
