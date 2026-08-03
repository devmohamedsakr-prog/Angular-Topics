# Angular Module Organization & Architecture - Interview Questions

## Beginner Level

### Q1: What are the different types of modules in Angular?
**Answer:**
Four main module types:

1. **AppModule (Root Module)**
   - Bootstrap point of application
   - Imported only once in main.ts
   - Contains application-wide configuration

2. **Feature Modules**
   - Organize business domain features
   - Lazy-loadable for performance
   - Contains feature-specific components and services

3. **Shared Module**
   - Reusable components, pipes, directives
   - Imported by multiple feature modules
   - Centralized common UI elements

4. **Core Module**
   - Application singleton services
   - Imported only in AppModule
   - Services like authentication, logging

**Example:**
```typescript
// Core Module - imported once in AppModule
@NgModule({ providers: [AuthService, LoggingService] })
export class CoreModule {}

// Shared Module - imported by features
@NgModule({ declarations: [ButtonComponent, CardComponent] })
export class SharedModule {}

// Feature Module - imported via routing
@NgModule({ declarations: [DashboardComponent] })
export class DashboardModule {}
```

---

### Q2: What is lazy loading and how does it improve performance?
**Answer:**
Lazy loading defers loading feature modules until they're needed.

**Benefits:**
- Reduces initial bundle size
- Faster initial page load (First Contentful Paint)
- Only loads features when accessed

**Implementation:**
```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(m => m.UsersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppModule {}
```

**Performance impact:**
- Initial bundle: 500KB (core + shared only)
- Dashboard loads: +150KB (on demand)
- Users loads: +120KB (on demand)
- Total: Same final size but faster start

---

### Q3: What should be in a Shared Module?
**Answer:**
Shared Module contains reusable components and utilities:

**Declarable Items:**
- Common components (Button, Card, Modal)
- Custom pipes (DateFormat, Currency)
- Custom directives (Highlight, Tooltip)

**Imported Items:**
- CommonModule (ngIf, ngFor)
- FormsModule (ngModel)
- ReactiveFormsModule (FormBuilder)

**What NOT to include:**
- Application singleton services (use Core Module)
- Feature-specific components
- HTTP interceptors

**Example:**
```typescript
@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    PhoneFormatPipe,
    HighlightDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    PhoneFormatPipe,
    HighlightDirective,
    CommonModule,
    FormsModule
  ]
})
export class SharedModule {}
```

---

### Q4: What goes in the Core Module?
**Answer:**
Core Module contains singleton services initialized once:

**Included:**
- Authentication service
- Logging/monitoring service
- HTTP interceptors
- Application configuration
- Error handlers

**Rules:**
- Import only in AppModule
- Only one instance throughout app
- Guard against multiple imports
- Don't re-export anything

**Example:**
```typescript
@Injectable()
export class AuthService {
  // Singleton - created once
  getCurrentUser() {}
}

@NgModule({
  imports: [HttpClientModule],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(auth: AuthService) {
    // Prevent multiple imports
    if (auth) {
      throw new Error('CoreModule already provided!');
    }
  }
}

// In AppModule
@NgModule({
  imports: [CoreModule, SharedModule, // ... other modules ]
})
export class AppModule {}
```

---

### Q5: How do you structure a feature module for a complex feature?
**Answer:**
Organize feature module with clear sub-structure:

```
features/users/
├── components/
│   ├── user-list/
│   │   ├── user-list.component.ts
│   │   ├── user-list.component.html
│   │   └── user-list.component.scss
│   ├── user-detail/
│   ├── user-form/
│   └── user-card/
├── services/
│   └── users.service.ts
├── models/
│   └── user.model.ts
├── users-routing.module.ts
└── users.module.ts
```

**Users Module:**
```typescript
@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserFormComponent,
    UserCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UsersRoutingModule
  ],
  providers: [UsersService]
})
export class UsersModule {}

// Services provided at module level = feature-scoped
@Injectable({
  providedIn: 'UsersModule'
})
export class UsersService {}
```

---

## Intermediate Level

### Q6: How do you prevent multiple imports of the Core Module?
**Answer:**
Implement a guard to prevent accidental re-imports:

```typescript
@NgModule({
  providers: [AuthService, LoggingService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already provided. Import only in AppModule.'
      );
    }
  }
}

// Usage in AppModule
@NgModule({
  imports: [
    CoreModule,  // ✓ Correct
    SharedModule,
    // DashboardModule (if imported here, ✗ CoreModule thrown error if imported inside)
  ]
})
export class AppModule {}
```

---

### Q7: How do you create a monorepo structure with multiple apps and shared libraries?
**Answer:**
Organize workspace with apps and libraries:

```bash
# Create workspace without app
ng new workspace --create-application=false

# Generate applications
ng generate application apps/main-app
ng generate application apps/admin-app

# Generate libraries
ng generate library libs/shared-ui
ng generate library libs/shared-services
ng generate library libs/shared-models
```

**angular.json structure:**
```json
{
  "projects": {
    "main-app": { "root": "apps/main-app" },
    "admin-app": { "root": "apps/admin-app" },
    "@myorg/shared-ui": { "root": "libs/shared-ui" },
    "@myorg/shared-services": { "root": "libs/shared-services" },
    "@myorg/shared-models": { "root": "libs/shared-models" }
  }
}
```

**tsconfig.json paths:**
```json
{
  "compilerOptions": {
    "paths": {
      "@myorg/shared-ui": ["libs/shared-ui/src/public-api.ts"],
      "@myorg/shared-services": ["libs/shared-services/src/public-api.ts"],
      "@myorg/shared-models": ["libs/shared-models/src/public-api.ts"]
    }
  }
}
```

**Benefits:**
- Code reuse across apps
- Easier maintenance
- Shared dependencies
- Scalable structure

---

### Q8: How do you manage circular dependencies between modules?
**Answer:**
Identify and break circular dependencies:

**Problem:**
```typescript
// shared.module.ts
import { DashboardModule } from './dashboard.module';

// dashboard.module.ts
import { SharedModule } from './shared.module';
// Circular dependency!
```

**Solutions:**

1. **Use a third module:**
```typescript
// common.module.ts - has shared declarations
@NgModule({
  declarations: [SharedButtonComponent]
})
export class CommonModule {}

// shared.module.ts
import { CommonModule } from './common.module';

// dashboard.module.ts
import { CommonModule } from './common.module';
```

2. **Move shared code to separate module:**
```typescript
// ui.module.ts - only UI components
export class UiModule {}

// services.module.ts - only services
export class ServicesModule {}

// feature.module.ts - imports both
@NgModule({
  imports: [UiModule, ServicesModule]
})
export class FeatureModule {}
```

3. **Use barrels (index.ts) properly:**
```typescript
// shared/index.ts
export * from './components';
export * from './pipes';
export * from './directives';

// feature/component.ts
import { ButtonComponent } from '../shared'; // Clean import
```

---

### Q9: How do you provide services at module, component, and application level?
**Answer:**
Different provision scopes create different instances:

```typescript
// 1. Application Level - Singleton across app
@Injectable({
  providedIn: 'root'
})
export class AuthService {}

// 2. Module Level - Shared within module
@Injectable({
  providedIn: DashboardModule
})
export class DashboardService {}

// 3. Component Level - Instance per component
@Component({
  selector: 'app-dashboard',
  providers: [ComponentService]
})
export class DashboardComponent {}

// In CoreModule
@NgModule({
  providers: [AuthService]
})
export class CoreModule {}

// In Feature Module
@NgModule({
  providers: [FeatureService]
})
export class FeatureModule {}

// Usage shows different instances:
@Component({
  providers: [ComponentService]
})
export class MyComponent {
  constructor(
    private auth: AuthService,     // Singleton
    private feature: FeatureService, // Module-scoped
    private component: ComponentService // Component instance
  ) {}
}
```

---

### Q10: How do you export and structure public APIs from modules?
**Answer:**
Use barrel files (index.ts) for clean public APIs:

```typescript
// dashboard/components/index.ts
export { DashboardListComponent } from './dashboard-list/dashboard-list.component';
export { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';

// dashboard/services/index.ts
export { DashboardService } from './dashboard.service';

// dashboard/models/index.ts
export { Dashboard } from './dashboard.model';
export { DashboardFilter } from './dashboard-filter.model';

// dashboard/index.ts (Public API)
export * from './dashboard.module';
export * from './components';
export * from './services';
export * from './models';

// In other modules
import { DashboardModule, DashboardService, Dashboard } from '@myapp/dashboard';
```

---

## Advanced Level

### Q11: How do you implement a barrel-exported component library as an npm package?
**Answer:**
Create publishable library with proper exports:

```bash
ng generate library @myorg/ui-components
```

**Package structure:**
```
libs/ui-components/
├── src/
│   ├── lib/
│   │   ├── button/
│   │   │   ├── button.component.ts
│   │   │   └── button.component.spec.ts
│   │   ├── card/
│   │   ├── modal/
│   │   └── ui-components.module.ts
│   ├── public-api.ts
│   └── index.ts
├── package.json
├── ng-package.json
└── tsconfig.lib.json
```

**public-api.ts (Main export file):**
```typescript
export * from './lib/ui-components.module';
export { ButtonComponent } from './lib/button/button.component';
export { CardComponent } from './lib/card/card.component';
export { ModalComponent } from './lib/modal/modal.component';
```

**ng-package.json:**
```json
{
  "$schema": "node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/@myorg/ui-components",
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
```

**Build and publish:**
```bash
ng build @myorg/ui-components --prod
npm publish dist/@myorg/ui-components
```

**Consumer usage:**
```typescript
import { UiComponentsModule, ButtonComponent, CardComponent } from '@myorg/ui-components';

@NgModule({
  imports: [UiComponentsModule]
})
export class AppModule {}
```

---

### Q12: How do you implement feature module state management with NgRx?
**Answer:**
Organize NgRx files by feature module:

```
features/dashboard/
├── store/
│   ├── dashboard.state.ts
│   ├── dashboard.actions.ts
│   ├── dashboard.reducer.ts
│   ├── dashboard.effects.ts
│   └── dashboard.selectors.ts
├── components/
├── services/
├── dashboard-routing.module.ts
└── dashboard.module.ts
```

**Store setup:**
```typescript
// dashboard.state.ts
export interface DashboardState {
  data: Dashboard[];
  loading: boolean;
  error: string | null;
}

// dashboard.actions.ts
export const loadDashboards = createAction(
  '[Dashboard] Load Dashboards'
);

export const loadDashboardsSuccess = createAction(
  '[Dashboard] Load Dashboards Success',
  props<{ data: Dashboard[] }>()
);

// dashboard.reducer.ts
export const dashboardReducer = createReducer(
  initialState,
  on(loadDashboards, state => ({ ...state, loading: true })),
  on(loadDashboardsSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false
  }))
);

// dashboard.effects.ts
@Injectable()
export class DashboardEffects {
  loadDashboards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDashboards),
      switchMap(() =>
        this.api.getDashboards().pipe(
          map(data => loadDashboardsSuccess({ data }))
        )
      )
    )
  );
}

// dashboard.module.ts
@NgModule({
  imports: [
    StoreModule.forFeature('dashboard', dashboardReducer),
    EffectsModule.forFeature([DashboardEffects])
  ]
})
export class DashboardModule {}
```

---

### Q13: How do you handle module initialization and cleanup (OnInit/OnDestroy for modules)?
**Answer:**
Use APP_INITIALIZER and ngModuleFactory for setup/teardown:

```typescript
// Initialize module on app startup
export function initializeApp(): () => Promise<void> {
  return () => {
    console.log('App initialized');
    return Promise.resolve();
  };
}

// Cleanup on module destroy
@Injectable()
export class ModuleCleanupService {
  constructor(@Optional() private ngZone: NgZone) {}

  cleanup(): void {
    console.log('Module cleanup');
    // Perform cleanup: unsubscribe, release resources
  }
}

// CoreModule with initialization
@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true
    },
    ModuleCleanupService
  ]
})
export class CoreModule {
  constructor(cleanup: ModuleCleanupService) {
    // On destroy (app closes)
    if (platform.injector.get(NgZone)) {
      window.addEventListener('beforeunload', () => {
        cleanup.cleanup();
      });
    }
  }
}
```

---

### Q14: How do you implement feature module with preloading strategy?
**Answer:**
Optimize lazy loading with preloading:

```typescript
// Custom preloading strategy
@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(
    route: Route,
    load: () => Observable<any>
  ): Observable<any> {
    // Preload routes marked with data.preload
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}

// Routes with preloading hints
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule),
    data: { preload: true } // Preload this
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(m => m.UsersModule),
    data: { preload: false } // Don't preload
  },
  {
    path: 'analytics',
    loadChildren: () => import('./analytics/analytics.module')
      .then(m => m.AnalyticsModule)
    // No data = don't preload
  }
];

// AppModule
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingStrategy
    })
  ]
})
export class AppModule {}

// Built-in strategies:
// PreloadAllModules - preload all lazy modules
// NoPreloading - don't preload (default)
```

---

### Q15: How do you debug module dependencies and find circular imports?
**Answer:**
Use tools and techniques to identify issues:

```typescript
// 1. Enable source maps for debugging
ng serve --source-map

// 2. Check bundle composition
ng build --stats-json
webpack-bundle-analyzer dist/*/stats.json

// 3. Use madge to detect circular dependencies
npm install --save-dev madge
madge --circular src/

// 4. Log module imports
@NgModule({})
export class DashboardModule {
  constructor() {
    console.log('DashboardModule loaded');
  }
}

// 5. Add DEBUG option
ng build --configuration=development

// 6. Check module tree with diagnostic
import { ɵgetDebugNodeByIndex } from '@angular/core';

// 7. Use import cost extension in VS Code
// Shows bundle impact of imports in real-time

// Example output:
// import { HeavyComponent } from './heavy'; // 150KB
// import { SharedButton } from '@shared/button'; // 5KB
```

**Common circular patterns:**
```typescript
// ✗ DON'T - Circular
// dashboard.module.ts imports shared.module
// shared.module.ts imports dashboard.module

// ✓ DO - Third module
// common.module.ts (shared declarations)
// dashboard.module.ts imports common.module
// shared.module.ts imports common.module

// ✓ DO - Separate by concern
// ui.module.ts (UI components only)
// services.module.ts (Services only)
// dashboard.module.ts imports both
```
