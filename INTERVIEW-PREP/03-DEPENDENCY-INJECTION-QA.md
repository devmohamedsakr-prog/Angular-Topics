# Dependency Injection Interview Questions & Answers

## Overview
15 comprehensive interview questions covering DI patterns, hierarchical injection, providers, and advanced concepts.

---

## Q1: What is Dependency Injection and why is it important?

**Answer:**

Dependency Injection is a design pattern that deals with how components get hold of their dependencies. The pattern is based on injecting the dependencies into a component rather than having the component create them.

```typescript
// ❌ WITHOUT DI (Tightly Coupled)
class UserService {
  private http = new HttpClient(); // Hard-coded dependency
}

class UserComponent {
  private userService = new UserService(); // Creates dependency
}

// ✅ WITH DI (Loosely Coupled)
@Injectable({ providedIn: 'root' })
class UserService {
  constructor(private http: HttpClient) {} // Injected
}

@Component({...})
class UserComponent {
  constructor(private userService: UserService) {} // Injected
}
```

**Benefits:**
| Benefit | Impact |
|---------|--------|
| **Loose Coupling** | Easy to change implementations |
| **Testability** | Mock dependencies easily |
| **Reusability** | Services work anywhere |
| **Maintainability** | Single responsibility |
| **Flexibility** | Swap implementations at runtime |

---

## Q2: Explain providers and different ways to define them

**Answer:**

```typescript
// 1. Using class provider (most common)
@NgModule({
  providers: [UserService]
  // Shorthand for:
  // providers: [{ provide: UserService, useClass: UserService }]
})

// 2. Using useClass (alternative implementation)
abstract class UserRepository {
  abstract getUsers(): Observable<User[]>;
}

@Injectable()
class HttpUserRepository implements UserRepository {
  constructor(private http: HttpClient) {}
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}

@NgModule({
  providers: [
    { provide: UserRepository, useClass: HttpUserRepository }
  ]
})
class AppModule {}

// 3. Using useValue (constants, config)
const API_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000
};

@NgModule({
  providers: [
    { provide: 'API_CONFIG', useValue: API_CONFIG }
  ]
})

@Injectable()
class ApiService {
  constructor(@Inject('API_CONFIG') private config: any) {}
}

// 4. Using useFactory (dynamic creation)
function createLogger(isDev: boolean) {
  return isDev ? new ConsoleLogger() : new RemoteLogger();
}

@NgModule({
  providers: [
    { 
      provide: Logger,
      useFactory: () => createLogger(environment.development),
      deps: [] // Dependencies for factory
    }
  ]
})

// 5. Using useExisting (aliasing)
@NgModule({
  providers: [
    UserService,
    { provide: 'USER_SERVICE', useExisting: UserService }
  ]
})

// 6. Factory with dependencies
@Injectable()
export class HttpInterceptorProvider {
  constructor(private auth: AuthService) {}
}

@NgModule({
  providers: [
    {
      provide: 'HTTP_INTERCEPTORS',
      useFactory: (auth: AuthService) => new HttpInterceptorProvider(auth),
      deps: [AuthService],
      multi: true
    }
  ]
})
```

---

## Q3: What is hierarchical dependency injection?

**Answer:**

```typescript
// Root level - Singleton (shared across entire app)
@Injectable({ providedIn: 'root' })
export class RootService {
  private id = Math.random();
  getId() { return this.id; }
}

// Module level - Singleton per module
@NgModule({
  providers: [ModuleService]
})
export class FeatureModule {}

// Component level - New instance for each component
@Component({
  selector: 'app-component',
  providers: [ComponentService] // New instance each time
})
export class MyComponent {
  constructor(
    private rootService: RootService,
    private componentService: ComponentService
  ) {}
}

// Hierarchy demonstration
@Injectable({ providedIn: 'root' })
class RootLogger {
  log(msg: string) { console.log('[Root]', msg); }
}

@Component({
  providers: [
    { provide: RootLogger, useClass: ComponentLogger }
  ]
})
class ChildComponent {
  constructor(private logger: RootLogger) {
    // Will use ComponentLogger, not RootLogger
    this.logger.log('Test'); // [Component] Test
  }
}

class ComponentLogger extends RootLogger {
  override log(msg: string) { console.log('[Component]', msg); }
}
```

**Hierarchy Levels:**
1. **Root**: Singleton, shared app-wide (providedIn: 'root')
2. **Platform**: Shared across multiple Angular apps
3. **Module**: Singleton per module
4. **Component**: New instance per component

---

## Q4: Explain InjectionToken and when to use it

**Answer:**

```typescript
// Problem: Injecting strings or primitives
// ❌ This doesn't work well
@NgModule({
  providers: [
    { provide: 'API_URL', useValue: 'http://localhost:3000' }
  ]
})

// Solution: Use InjectionToken
import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('API_URL');
export const CACHE_CONFIG = new InjectionToken<CacheConfig>('CACHE_CONFIG');
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('FEATURE_FLAGS');

interface CacheConfig {
  ttl: number;
  maxSize: number;
}

interface FeatureFlags {
  enableBeta: boolean;
  enableAnalytics: boolean;
}

@NgModule({
  providers: [
    { provide: API_URL, useValue: 'http://localhost:3000' },
    { provide: CACHE_CONFIG, useValue: { ttl: 5000, maxSize: 100 } },
    { provide: FEATURE_FLAGS, useValue: { enableBeta: true, enableAnalytics: false } }
  ]
})
export class AppModule {}

// Usage
@Injectable()
export class ApiService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(CACHE_CONFIG) private cacheConfig: CacheConfig
  ) {}

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
}

// With factory
export const HttpClient = new InjectionToken<HttpClient>('HttpClient');

@NgModule({
  providers: [
    {
      provide: HttpClient,
      useFactory: (http: HttpClient) => {
        return http; // Can wrap or configure
      },
      deps: [HttpClient]
    }
  ]
})

// Optional InjectionToken
export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>(
  'LOGGER_CONFIG',
  {
    providedIn: 'root',
    factory: () => ({ level: 'info' })
  }
);
```

---

## Q5: How do you create a service factory?

**Answer:**

```typescript
// Logger service with multiple implementations
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

class RemoteLogger implements Logger {
  constructor(private http: HttpClient) {}

  log(message: string): void {
    this.http.post('/api/logs', { message }).subscribe();
  }
}

// Factory function
function loggerFactory(isDev: boolean, http: HttpClient): Logger {
  return isDev ? new ConsoleLogger() : new RemoteLogger(http);
}

// Provider configuration
@NgModule({
  providers: [
    {
      provide: 'Logger',
      useFactory: loggerFactory,
      deps: ['ENVIRONMENT', HttpClient]
    },
    { provide: 'ENVIRONMENT', useValue: !environment.production }
  ]
})
export class AppModule {}

// Usage
@Injectable()
export class AppService {
  constructor(@Inject('Logger') private logger: Logger) {}

  doSomething() {
    this.logger.log('Action performed');
  }
}

// Advanced: Factory with multiple dependencies
export const DATABASE_FACTORY = (
  config: DatabaseConfig,
  logger: Logger,
  auth: AuthService
) => {
  const db = new Database(config);
  logger.log('Database initialized');
  db.setAuth(auth);
  return db;
};

@NgModule({
  providers: [
    {
      provide: Database,
      useFactory: DATABASE_FACTORY,
      deps: [DATABASE_CONFIG, 'Logger', AuthService]
    }
  ]
})
```

---

## Q6: Explain Optional and SkipSelf decorators

**Answer:**

```typescript
// @Optional - Injection is optional, won't error if not provided
@Injectable()
export class ChildService {
  constructor(@Optional() private logger?: Logger) {}

  doSomething() {
    if (this.logger) {
      this.logger.log('Something happened');
    }
  }
}

// @SkipSelf - Skip this level and look up hierarchy
@NgModule({
  providers: [UserService]
})
export class FeatureModule {
  constructor(@SkipSelf() userService: UserService) {
    // This skips FeatureModule's provider and uses root's
  }
}

// Combined: @Optional @SkipSelf
@Component({
  selector: 'app-child',
  providers: [ErrorHandler]
})
export class ChildComponent {
  constructor(
    @Optional() @SkipSelf() private parentErrorHandler?: ErrorHandler
  ) {
    // Look for ErrorHandler in parent, not in this component
  }
}

// Practical example: Theme service inheritance
@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = 'light';
}

@Component({
  selector: 'app-modal',
  providers: [
    { provide: ThemeService, useValue: { theme: 'dark' } }
  ]
})
export class ModalComponent {
  constructor(
    private themeService: ThemeService, // Uses dark theme
    @SkipSelf() private rootTheme: ThemeService // Uses root light theme
  ) {}
}
```

---

## Q7: How do you test services with dependency injection?

**Answer:**

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'User 1' }];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    req.flush(mockUsers);
  });
});

// Testing with mocked dependencies
describe('ProductService with mocked HttpClient', () => {
  let service: ProductService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(ProductService);
  });

  it('should fetch products', () => {
    const mockProducts = [{ id: 1, name: 'Product 1' }];
    httpClientSpy.get.and.returnValue(of(mockProducts));

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith('/api/products');
  });
});

// Testing with TestBed overrides
describe('Service with overrides', () => {
  let service: MyService;
  let mockDependency: any;

  beforeEach(() => {
    mockDependency = jasmine.createSpyObj('Dependency', ['method']);

    TestBed.configureTestingModule({
      providers: [MyService, Dependency]
    }).overrideProvider(Dependency, { useValue: mockDependency });

    service = TestBed.inject(MyService);
  });

  it('should use mocked dependency', () => {
    mockDependency.method.and.returnValue('mocked');
    
    expect(service.callDependency()).toBe('mocked');
    expect(mockDependency.method).toHaveBeenCalled();
  });
});
```

---

## Q8: How do you implement a singleton pattern with DI?

**Answer:**

```typescript
// Method 1: Use providedIn: 'root' (recommended)
@Injectable({ providedIn: 'root' })
export class SingletonService {
  private id = Math.random();
  getId() { return this.id; }
}

// Method 2: Provide in module
@NgModule({
  providers: [SingletonService] // Singleton at module level
})
export class AppModule {}

// Method 3: Prevent multiple instantiation
@Injectable({ providedIn: 'root' })
export class StrictSingletonService {
  private static instance: StrictSingletonService;

  private constructor() {}

  static getInstance(): StrictSingletonService {
    if (!StrictSingletonService.instance) {
      StrictSingletonService.instance = new StrictSingletonService();
    }
    return StrictSingletonService.instance;
  }
}

// Verification
@Component({...})
export class AppComponent {
  constructor(
    s1: SingletonService,
    s2: SingletonService
  ) {
    console.log(s1.getId() === s2.getId()); // true - Same instance
  }
}
```

---

## Q9: How do you use environment-specific providers?

**Answer:**

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com'
};

// app.module.ts
import { environment } from '../environments/environment';

@NgModule({
  providers: [
    { provide: 'API_URL', useValue: environment.apiUrl },
    { 
      provide: 'LOGGER_LEVEL',
      useValue: environment.production ? 'error' : 'debug'
    }
  ]
})
export class AppModule {}

// Usage
@Injectable()
export class ApiService {
  constructor(@Inject('API_URL') private apiUrl: string) {}

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
}

// Build command
// ng build --configuration production
```

---

## Q10: Explain multi-value providers

**Answer:**

```typescript
// Multiple interceptors example
export const HTTP_INTERCEPTOR_1 = new InjectionToken('HTTP_INTERCEPTOR_1');
export const HTTP_INTERCEPTOR_2 = new InjectionToken('HTTP_INTERCEPTOR_2');

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true // Add to array instead of replacing
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}

// Without multi:true, last provider would override previous ones
// With multi:true, all are added to an array

// Usage in component
@Injectable()
export class InterceptorService {
  constructor(
    @Inject(HTTP_INTERCEPTORS) private interceptors: HttpInterceptor[]
  ) {
    console.log(interceptors.length); // 3
  }
}
```

---

## Q11: How do you create a custom @Injectable decorator?

**Answer:**

```typescript
// Custom decorator factory
export function CustomInjectable(config: { singleton: boolean }) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    if (config.singleton) {
      return class extends constructor {
        private static instance: any;

        constructor(...args: any[]) {
          if (CustomInjectable.instance) {
            return CustomInjectable.instance;
          }
          super(...args);
          CustomInjectable.instance = this;
        }
      };
    }
    return constructor;
  };
}

// Usage
@CustomInjectable({ singleton: true })
export class CustomService {}

// Advanced: With metadata
export function Service(name: string) {
  return function(target: any) {
    Reflect.defineMetadata('service:name', name, target);
    Injectable()(target);
  };
}

@Service('userService')
export class UserService {
  // service metadata: 'userService'
}
```

---

## Q12: Explain lazy-loaded module dependency injection

**Answer:**

```typescript
// Feature module (lazy-loaded)
@Injectable({ providedIn: 'lazy' }) // Only available in this module
export class LazyService {
  constructor() { console.log('LazyService created'); }
}

@Component({...})
export class LazyComponent {
  constructor(private service: LazyService) {}
  // Service only available here, not in app
}

@NgModule({
  declarations: [LazyComponent],
  imports: [CommonModule],
  providers: [LazyService]
})
export class LazyModule {}

// Routing configuration
const routes: Routes = [
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
  }
];

// Benefits:
// - Service only instantiated when module is loaded
// - Separate instances for each lazy module
// - Better memory usage
// - Module isolation
```

---

## Q13: How do you handle circular dependencies?

**Answer:**

```typescript
// ❌ Circular dependency problem
@Injectable()
export class ServiceA {
  constructor(private serviceB: ServiceB) {} // ServiceB depends on ServiceA
}

@Injectable()
export class ServiceB {
  constructor(private serviceA: ServiceA) {} // Circular!
}

// ✅ Solution 1: Restructure - Create intermediary service
@Injectable()
export class CommonService {
  // Shared logic
}

@Injectable()
export class ServiceA {
  constructor(private common: CommonService) {}
}

@Injectable()
export class ServiceB {
  constructor(private common: CommonService) {}
}

// ✅ Solution 2: Use forwardRef
import { forwardRef } from '@angular/core';

@Injectable()
export class ServiceA {
  constructor(@Inject(forwardRef(() => ServiceB)) private serviceB: ServiceB) {}
}

@Injectable()
export class ServiceB {
  constructor(private serviceA: ServiceA) {}
}

// ✅ Solution 3: Lazy injection
@Injectable()
export class ServiceA {
  constructor(private injector: Injector) {}

  getServiceB() {
    return this.injector.get(ServiceB); // Resolve when needed
  }
}

@Injectable()
export class ServiceB {
  constructor(private serviceA: ServiceA) {}
}
```

---

## Q14: Best practices for dependency injection

**Answer:**

```
✅ BEST PRACTICES:

1. Always use TypeScript types
   - Better IntelliSense
   - Compile-time checking
   - Type safety

2. Prefer providedIn: 'root'
   - Tree-shakeable
   - Simpler configuration
   - Best for most cases

3. Keep service responsibilities focused
   - Single Responsibility Principle
   - Easier to test
   - Reusable

4. Use InjectionToken for primitives
   - Type-safe
   - Better for config values
   - Prevents accidental usage

5. Test with TestBed
   - Mock dependencies
   - Override providers
   - Verify interactions

6. Avoid circular dependencies
   - Restructure code
   - Use lazy injection if needed
   - Consider service hierarchy

7. Use @Optional and @SkipSelf wisely
   - @Optional for truly optional dependencies
   - @SkipSelf for hierarchy navigation
   - Improves flexibility

8. Keep factories simple
   - Handle complex logic separately
   - Keep factory functions pure
   - Document non-obvious behavior

9. Leverage hierarchy
   - Root for app-wide singletons
   - Module for feature singletons
   - Component for local instances

10. Document provider configuration
    - Explain why each provider exists
    - Note interdependencies
    - Help future maintainers
```

---

## Q15: How do you dynamically provide services at runtime?

**Answer:**

```typescript
@Injectable({ providedIn: 'root' })
export class DynamicServiceProvider {
  private services = new Map<string, any>();

  register<T>(token: InjectionToken<T>, instance: T): void {
    this.services.set(token.toString(), instance);
  }

  get<T>(token: InjectionToken<T>): T {
    return this.services.get(token.toString());
  }

  exists<T>(token: InjectionToken<T>): boolean {
    return this.services.has(token.toString());
  }
}

// Usage
const PLUGIN_A = new InjectionToken<PluginInterface>('plugin-a');
const PLUGIN_B = new InjectionToken<PluginInterface>('plugin-b');

@Component({...})
export class AppComponent implements OnInit {
  constructor(private provider: DynamicServiceProvider) {}

  ngOnInit() {
    // Register plugins at runtime
    this.provider.register(PLUGIN_A, new PluginA());
    this.provider.register(PLUGIN_B, new PluginB());
  }

  usePlugin(pluginToken: InjectionToken<PluginInterface>) {
    const plugin = this.provider.get(pluginToken);
    plugin.execute();
  }
}
```

---

**Key Takeaway:** Mastering dependency injection enables you to write testable, maintainable, and scalable Angular applications. Understand the hierarchy and use the appropriate provider strategy for each scenario.

