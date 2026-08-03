/**
 * Angular Module Organization & Architecture Examples
 * 
 * Covers:
 * - Core module setup
 * - Shared module patterns
 * - Feature module structure
 * - Lazy loading configuration
 * - Monorepo organization
 * - Service encapsulation
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { 
  FormsModule, 
  ReactiveFormsModule 
} from '@angular/forms';

// ============================================================================
// 1. CORE MODULE - Singleton services
// ============================================================================

/**
 * Core services that should be instantiated only once
 */
export class AuthService {
  constructor() {}
  
  login(credentials: any) {
    // Authentication logic
  }
  
  logout() {
    // Logout logic
  }
}

export class LoggingService {
  log(message: string) {
    console.log(message);
  }
}

/**
 * HTTP Error Interceptor
 */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private logging: LoggingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logging.log(`HTTP Error: ${error.status} - ${error.message}`);
        return throwError(() => error);
      })
    );
  }
}

/**
 * Core Module - Import only once in AppModule
 * Contains singleton services
 */
@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    AuthService,
    LoggingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(auth: AuthService) {
    // Guard against multiple imports
    if (auth) {
      throw new Error('CoreModule is already provided in the root module!');
    }
  }
}

// ============================================================================
// 2. SHARED MODULE - Reusable components and utilities
// ============================================================================

import { Component, Directive, Pipe, PipeTransform } from '@angular/core';

/**
 * Shared Button Component
 */
@Component({
  selector: 'app-shared-button',
  template: `
    <button 
      [class.btn-primary]="type === 'primary'"
      [class.btn-secondary]="type === 'secondary'"
      [disabled]="disabled"
      (click)="onClick()">
      {{ label }}
    </button>
  `,
  styles: [`
    button {
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
  `]
})
export class SharedButtonComponent {
  label = 'Click me';
  type: 'primary' | 'secondary' = 'primary';
  disabled = false;

  onClick() {
    console.log('Button clicked');
  }
}

/**
 * Shared Card Component
 */
@Component({
  selector: 'app-shared-card',
  template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-header {
      padding: 16px;
      border-bottom: 1px solid #ddd;
    }
    .card-body {
      padding: 16px;
    }
  `]
})
export class SharedCardComponent {
  title = 'Card';
}

/**
 * Shared Custom Pipe
 */
@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Format: +1 (555) 123-4567
    return value.replace(/(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3');
  }
}

/**
 * Shared Directive
 */
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: any) {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
}

/**
 * Shared Module - Exported for use in feature modules
 */
@NgModule({
  declarations: [
    SharedButtonComponent,
    SharedCardComponent,
    PhoneFormatPipe,
    HighlightDirective
  ],
  imports: [CommonModule],
  exports: [
    SharedButtonComponent,
    SharedCardComponent,
    PhoneFormatPipe,
    HighlightDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}

// ============================================================================
// 3. FEATURE MODULE - DashboardModule
// ============================================================================

/**
 * Dashboard Component
 */
@Component({
  selector: 'app-dashboard',
  template: `
    <div>
      <h1>Dashboard</h1>
      <app-shared-card title="Statistics">
        <p>Welcome to dashboard</p>
      </app-shared-card>
    </div>
  `
})
export class DashboardComponent {}

/**
 * Dashboard Service - Feature-specific service
 */
@Injectable({
  providedIn: 'DashboardModule'
})
export class DashboardService {
  getStatistics() {
    return { users: 100, revenue: 50000 };
  }
}

/**
 * Dashboard routing
 */
const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

/**
 * Dashboard Feature Module
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(dashboardRoutes)
  ],
  providers: [DashboardService]
})
export class DashboardModule {}

// ============================================================================
// 4. FEATURE MODULE - UsersModule
// ============================================================================

/**
 * Users List Component
 */
@Component({
  selector: 'app-users-list',
  template: `
    <div>
      <h2>Users List</h2>
      <div *ngFor="let user of users">
        <app-shared-card [title]="user.name">
          <p>{{ user.email }}</p>
          <p>{{ user.phone | phoneFormat }}</p>
        </app-shared-card>
      </div>
    </div>
  `
})
export class UsersListComponent {
  users = [
    { name: 'John', email: 'john@example.com', phone: '5551234567' },
    { name: 'Jane', email: 'jane@example.com', phone: '5559876543' }
  ];
}

/**
 * User Detail Component
 */
@Component({
  selector: 'app-user-detail',
  template: `
    <div>
      <h2>User Detail</h2>
      <app-shared-card [title]="user?.name">
        <p>Email: {{ user?.email }}</p>
        <p>Phone: {{ user?.phone | phoneFormat }}</p>
      </app-shared-card>
    </div>
  `
})
export class UserDetailComponent {
  user = { name: 'John', email: 'john@example.com', phone: '5551234567' };
}

/**
 * Users Service - Feature-specific
 */
@Injectable({
  providedIn: 'UsersModule'
})
export class UsersService {
  getUsers() {
    return [];
  }

  getUserById(id: string) {
    return {};
  }
}

/**
 * Users routing with lazy loading
 */
const usersRoutes: Routes = [
  {
    path: '',
    component: UsersListComponent
  },
  {
    path: ':id',
    component: UserDetailComponent
  }
];

/**
 * Users Feature Module
 */
@NgModule({
  declarations: [UsersListComponent, UserDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(usersRoutes)
  ],
  providers: [UsersService]
})
export class UsersModule {}

// ============================================================================
// 5. ROOT MODULE - AppModule
// ============================================================================

/**
 * Root App Component
 */
@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <nav>
        <ul>
          <li><a routerLink="/dashboard">Dashboard</a></li>
          <li><a routerLink="/users">Users</a></li>
          <li><a routerLink="/products">Products</a></li>
        </ul>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    nav { padding: 16px; }
    nav ul { list-style: none; display: flex; gap: 16px; }
    nav a { text-decoration: none; color: #007bff; }
    main { padding: 16px; }
  `]
})
export class AppComponent {
  title = 'Angular Module Organization';
}

/**
 * App Routes with Lazy Loading
 */
const appRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

/**
 * Root Application Module
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    RouterModule.forRoot(appRoutes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// ============================================================================
// 6. MONOREPO STRUCTURE EXAMPLE
// ============================================================================

/**
 * Monorepo workspace structure
 * 
 * workspace/
 * ├── angular.json
 * ├── tsconfig.json
 * ├── apps/
 * │   ├── main-app/
 * │   │   ├── src/
 * │   │   ├── angular.json
 * │   │   └── tsconfig.app.json
 * │   ├── admin-app/
 * │   │   ├── src/
 * │   │   ├── angular.json
 * │   │   └── tsconfig.app.json
 * │   └── mobile-app/
 * └── libs/
 *     ├── shared-ui/
 *     │   ├── src/
 *     │   ├── ng-package.json
 *     │   └── tsconfig.lib.json
 *     ├── shared-services/
 *     │   ├── src/
 *     │   ├── ng-package.json
 *     │   └── tsconfig.lib.json
 *     └── shared-models/
 *         ├── src/
 *         ├── ng-package.json
 *         └── tsconfig.lib.json
 */

export const monorepoExample = {
  // tsconfig.json with path mappings
  tsconfig: {
    compilerOptions: {
      paths: {
        '@myorg/shared-ui': ['libs/shared-ui/src/public-api.ts'],
        '@myorg/shared-services': ['libs/shared-services/src/public-api.ts'],
        '@myorg/shared-models': ['libs/shared-models/src/public-api.ts'],
        '@main-app/*': ['apps/main-app/src/app/*'],
        '@admin-app/*': ['apps/admin-app/src/app/*']
      }
    }
  }
};

// ============================================================================
// 7. FEATURE MODULE WITH COMPONENTS & FORMS
// ============================================================================

/**
 * Products List Component with Form
 */
@Component({
  selector: 'app-products-list',
  template: `
    <div>
      <h2>Products</h2>
      <form [formGroup]="filterForm" (ngSubmit)="onFilter()">
        <input formControlName="category" placeholder="Category">
        <app-shared-button label="Filter" type="primary"></app-shared-button>
      </form>
      <div *ngFor="let product of products">
        <app-shared-card [title]="product.name">
          <p>Price: ${{ product.price }}</p>
        </app-shared-card>
      </div>
    </div>
  `
})
export class ProductsListComponent {
  filterForm = new (require('@angular/forms').FormBuilder)().group({
    category: ['']
  });

  products = [
    { name: 'Product 1', price: 99.99 },
    { name: 'Product 2', price: 149.99 }
  ];

  onFilter() {
    console.log('Filter applied:', this.filterForm.value);
  }
}

/**
 * Products Service
 */
@Injectable({
  providedIn: 'ProductsModule'
})
export class ProductsService {
  getProducts() {
    return [];
  }
}

/**
 * Products Module
 */
@NgModule({
  declarations: [ProductsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductsListComponent
      }
    ])
  ],
  providers: [ProductsService]
})
export class ProductsModule {}
