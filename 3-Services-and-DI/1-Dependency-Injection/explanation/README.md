# Dependency Injection (DI) in Angular

## What is Dependency Injection?

Dependency Injection is a design pattern that deals with how components get hold of their dependencies. The Angular injector subsystem is in charge of creating instances of services, calling methods, and invoking constructors as needed to bootstrap the app and other services.

## Why Dependency Injection?

1. **Loose Coupling** - Components don't need to know how to create dependencies
2. **Testability** - Easy to mock dependencies in tests
3. **Maintainability** - Easier to change implementations
4. **Flexibility** - Swap implementations without changing consumers

## Providers

Providers tell Angular how to create a service:

```typescript
// 1. Class Provider (Default)
@NgModule({
  providers: [
    UserService // Shorthand for { provide: UserService, useClass: UserService }
  ]
})

// 2. Value Provider
@NgModule({
  providers: [
    { provide: 'API_URL', useValue: 'https://api.example.com' }
  ]
})

// 3. Factory Provider
@NgModule({
  providers: [
    {
      provide: Logger,
      useFactory: (config: Config) => {
        return config.isDev ? new ConsoleLogger() : new RemoteLogger();
      },
      deps: [Config]
    }
  ]
})

// 4. Aliased Provider
@NgModule({
  providers: [
    AppLogger,
    { provide: Logger, useExisting: AppLogger }
  ]
})

// 5. Provider with useClass
@NgModule({
  providers: [
    { provide: UserService, useClass: MockUserService }
  ]
})
```

## Injection Levels

### Root Injector (Application Level)

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  // Available throughout the app as a singleton
}
```

### Module Injector

```typescript
@NgModule({
  providers: [UserService]
})
export class UserModule {}

// Service is available only to this module and its children
```

### Component Injector

```typescript
@Component({
  selector: 'app-user',
  providers: [UserService]
})
export class UserComponent {
  // This instance is unique to this component
}
```

## Providing Dependencies

### Via Constructor

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {
    // HttpClient is injected here
  }
}
```

### Via Inject Function (Angular 14+)

```typescript
export class UserService {
  private http = inject(HttpClient);
  private config = inject(Config);

  getUsers() {
    return this.http.get(`${this.config.apiUrl}/users`);
  }
}
```

### Via InjectionToken

```typescript
// Create token
export const API_URL = new InjectionToken<string>('api.url');

// Provide
@NgModule({
  providers: [
    { provide: API_URL, useValue: 'https://api.example.com' }
  ]
})

// Inject
@Injectable()
export class UserService {
  constructor(@Inject(API_URL) private apiUrl: string) {}
}
```

## Optional Dependencies

```typescript
@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    @Optional() private logger: LoggerService // May be undefined
  ) {}

  getUsers() {
    if (this.logger) {
      this.logger.log('Fetching users');
    }
    return this.http.get('/api/users');
  }
}
```

## Self and SkipSelf

```typescript
// @Self - look only in current component's injector
@Component({
  providers: [UserService]
})
export class UserComponent {
  constructor(@Self() userService: UserService) {
    // This gets the UserService from this component's injector
  }
}

// @SkipSelf - skip current injector and look in parent
@Component({
  selector: 'app-user-detail',
  providers: [UserService]
})
export class UserDetailComponent {
  constructor(@SkipSelf() userService: UserService) {
    // This gets UserService from parent component or module
  }
}
```

## Service Example with DI

```typescript
// Models
export interface User {
  id: number;
  name: string;
  email: string;
}

// Service
@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://api.example.com/users';

  constructor(
    private http: HttpClient,
    @Optional() private logger: LoggerService
  ) {}

  getUsers(): Observable<User[]> {
    this.logger?.log('Fetching users');
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// Component using service
@Component({
  selector: 'app-user-list',
  template: `
    <h1>Users</h1>
    <ul>
      <li *ngFor="let user of users$ | async">
        {{ user.name }} ({{ user.email }})
      </li>
    </ul>
  `
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }
}
```

## Configuration Service Pattern

```typescript
export interface AppConfig {
  apiUrl: string;
  isDev: boolean;
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<AppConfig> {
    return this.http
      .get<AppConfig>('/assets/config.json')
      .toPromise()
      .then(config => {
        this.config = config;
        return config;
      });
  }

  getConfig(): AppConfig {
    return this.config;
  }

  getValue(key: string): any {
    const keys = key.split('.');
    let value: any = this.config;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  }
}
```

## Hierarchical Injector

```typescript
// Root
@NgModule({
  providers: [SharedService]
})
export class AppModule {}

// Module-level
@NgModule({
  providers: [FeatureService]
})
export class FeatureModule {}

// Component-level
@Component({
  providers: [LocalService]
})
export class FeatureComponent {}

// Each level can override parent's services
```

## Testing with DI

```typescript
// Mock service
class MockUserService {
  getUsers() {
    return of([
      { id: 1, name: 'John', email: 'john@example.com' }
    ]);
  }
}

// Test
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    });

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should display users', () => {
    fixture.detectChanges();
    // Test with mock service
  });
});
```

## Best Practices

1. **Provide at root level** - Use `providedIn: 'root'` for singleton services
2. **Use injection tokens** - For non-class dependencies
3. **Keep services focused** - Single responsibility principle
4. **Use readonly injected dependencies** - Prevent accidental reassignment
5. **Consider lazy loading** - Provide services at module level when lazy loaded
6. **Mock dependencies in tests** - Use mock services and useClass provider
7. **Document dependencies** - Make dependencies clear and documented

## Key Takeaways

- DI is a core Angular feature that promotes loose coupling
- Use `providedIn: 'root'` for singleton services
- Providers define how to create service instances
- Injectors are hierarchical (root, module, component)
- Use injection tokens for non-class dependencies
- DI makes testing easier through dependency mocking
