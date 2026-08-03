/**
 * Dependency Injection - Complete Patterns & Examples
 * Demonstrates all provider types, hierarchical injection, and advanced patterns
 */

import { Injectable, Injector, InjectionToken, Optional, Self, SkipSelf, Host, Directive, Component, ViewContainerRef } from '@angular/core';

// ============================================================================
// EXAMPLE 1: Class Provider
// ============================================================================

/**
 * Service to be provided
 */
@Injectable()
export class LoggerService {
  log(message: string): void {
    console.log(`[Logger] ${message}`);
  }

  error(message: string): void {
    console.error(`[Logger Error] ${message}`);
  }
}

/**
 * Class Provider - most common
 * Syntax: provide(Service, { useClass: Service })
 */
// In module:
// providers: [LoggerService]  // shorthand for: { provide: LoggerService, useClass: LoggerService }

// ============================================================================
// EXAMPLE 2: Value Provider
// ============================================================================

export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  features: {
    darkMode: boolean;
    notifications: boolean;
  };
}

export const APP_CONFIG: AppConfig = {
  apiUrl: 'https://api.example.com',
  appName: 'MyApp',
  version: '1.0.0',
  features: {
    darkMode: true,
    notifications: true,
  },
};

export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('app.config');

/**
 * Value Provider - inject constant values
 */
// In module:
// providers: [
//   { provide: APP_CONFIG_TOKEN, useValue: APP_CONFIG }
// ]

@Component({
  selector: 'app-header',
  template: `<h1>{{ appName }}</h1>`,
})
export class HeaderComponent {
  appName: string;

  constructor(config: AppConfig) {
    // Will fail - InjectionToken required
    // This is WRONG ❌
  }
}

@Component({
  selector: 'app-header-fixed',
  template: `<h1>{{ appName }}</h1>`,
})
export class HeaderComponentFixed {
  appName: string;

  constructor(@Optional() config: AppConfig) {
    // CORRECT ✅ - Using InjectionToken
  }
}

// Correct usage with InjectionToken:
@Component({
  selector: 'app-config-display',
  template: `<div>API: {{ config.apiUrl }}</div>`,
})
export class ConfigDisplayComponent {
  constructor(private config: AppConfig) {
    // This will work if provided with InjectionToken
  }
}

// ============================================================================
// EXAMPLE 3: Factory Provider
// ============================================================================

/**
 * Factory function creates service instances
 */
export function loggerFactory(isDev: boolean): LoggerService {
  const logger = new LoggerService();

  if (isDev) {
    logger.log('Logger initialized in development mode');
  }

  return logger;
}

/**
 * Factory Provider - create service conditionally
 */
// In module:
// providers: [
//   {
//     provide: LoggerService,
//     useFactory: () => loggerFactory(true),
//     deps: []  // optional dependencies
//   }
// ]

/**
 * Factory with dependencies
 */
export function createUserService(
  http: HttpClient,
  config: AppConfig
): UserService {
  return new UserService(http, config.apiUrl);
}

// In module:
// providers: [
//   {
//     provide: UserService,
//     useFactory: createUserService,
//     deps: [HttpClient, APP_CONFIG_TOKEN]  // inject dependencies
//   }
// ]

// ============================================================================
// EXAMPLE 4: Alias Provider (useExisting)
// ============================================================================

/**
 * Abstract base service
 */
export abstract class LoggerBase {
  abstract log(message: string): void;
}

/**
 * Concrete implementation
 */
@Injectable()
export class ConsoleLogger extends LoggerBase {
  log(message: string): void {
    console.log(message);
  }
}

/**
 * Alias Provider - create multiple tokens pointing to same service
 */
// In module:
// providers: [
//   ConsoleLogger,
//   { provide: LoggerBase, useExisting: ConsoleLogger },
//   { provide: 'Logger', useExisting: ConsoleLogger }  // string token
// ]

@Component({
  selector: 'app-using-alias',
  template: '',
})
export class UsingAliasComponent {
  constructor(
    base: LoggerBase,
    concrete: ConsoleLogger,
    @Optional() stringToken: any // 'Logger'
  ) {
    // All point to same ConsoleLogger instance
    console.log(base === concrete); // true
  }
}

// ============================================================================
// EXAMPLE 5: Hierarchical Injectors
// ============================================================================

/**
 * Root-level singleton service
 */
@Injectable({ providedIn: 'root' })
export class RootService {
  constructor() {
    console.log('RootService created');
  }

  getRootData(): string {
    return 'Root data';
  }
}

/**
 * Module-level service
 */
@Injectable()
export class ModuleService {
  constructor() {
    console.log('ModuleService created');
  }
}

/**
 * Component-level service
 */
@Injectable()
export class ComponentService {
  constructor() {
    console.log('ComponentService created');
  }
}

// Hierarchy:
//
// Injector
//   ├── RootService (singleton, shared across app)
//   ├── ModuleService (singleton per module)
//   │   ├── Component1
//   │   │   └── ComponentService (instance per component)
//   │   └── Component2
//   │       └── ComponentService (different instance)

@Component({
  selector: 'app-hierarchical',
  template: `<div>{{ message }}</div>`,
  providers: [ComponentService], // Component-level provider
})
export class HierarchicalComponent {
  message = 'Using hierarchical injection';

  constructor(
    root: RootService, // From root injector
    module: ModuleService, // From module injector
    component: ComponentService // From component injector
  ) {
    console.log('Component created with all services');
  }
}

// ============================================================================
// EXAMPLE 6: Optional Dependencies
// ============================================================================

/**
 * Optional dependency - doesn't fail if not provided
 */
@Injectable()
export class NotificationService {
  private logger?: LoggerService;

  constructor(@Optional() logger: LoggerService) {
    this.logger = logger;
  }

  notify(message: string): void {
    console.log(`Notification: ${message}`);
    this.logger?.log(`Notification sent: ${message}`);
  }
}

// Usage:
// providers: [
//   NotificationService  // Logger not required
// ]

// ============================================================================
// EXAMPLE 7: @Self and @SkipSelf Decorators
// ============================================================================

/**
 * @Self - only look in current component's injector
 */
@Component({
  selector: 'app-self-example',
  template: '',
  providers: [ComponentService],
})
export class SelfExampleComponent {
  constructor(@Self() service: ComponentService) {
    // ✅ WORKS - ComponentService provided in component
    console.log('Got service from component');
  }
}

@Component({
  selector: 'app-self-fail',
  template: '',
  // No providers
})
export class SelfFailComponent {
  constructor(@Self() service: ComponentService) {
    // ❌ FAILS - ComponentService not in component providers
    // Throws: NullInjectorError
  }
}

/**
 * @SkipSelf - skip current component's injector
 */
@Component({
  selector: 'app-skip-self',
  template: '',
  providers: [ModuleService],
})
export class SkipSelfComponent {
  constructor(
    @SkipSelf() service: ModuleService
    // SkipSelf() skips this component's provider
    // Gets parent's ModuleService instead
  ) {
    console.log('Got service from parent');
  }
}

// ============================================================================
// EXAMPLE 8: @Host Decorator
// ============================================================================

/**
 * @Host - look up to host component's injector
 */
@Directive({
  selector: '[appHighlight]',
  providers: [HighlightService],
})
export class HighlightDirective {
  constructor(
    @Host() private service: HighlightService
    // Gets service from host component's injector
  ) {}
}

export class HighlightService {
  highlight(element: HTMLElement): void {
    element.style.backgroundColor = 'yellow';
  }
}

// ============================================================================
// EXAMPLE 9: InjectionToken for Non-Class Dependencies
// ============================================================================

/**
 * Tokens for configuration values
 */
export const API_URL = new InjectionToken<string>('api.url');
export const MAX_RETRIES = new InjectionToken<number>('max.retries');
export const FEATURE_FLAGS = new InjectionToken<Map<string, boolean>>(
  'feature.flags'
);
export const DATABASE_POOL_SIZE = new InjectionToken<number>(
  'database.pool.size',
  {
    providedIn: 'root',
    factory: () => 10,
  }
);

/**
 * Usage in module:
 */
// providers: [
//   { provide: API_URL, useValue: 'https://api.example.com' },
//   { provide: MAX_RETRIES, useValue: 3 },
//   {
//     provide: FEATURE_FLAGS,
//     useValue: new Map([
//       ['darkMode', true],
//       ['notifications', false]
//     ])
//   }
// ]

@Injectable()
export class ConfigurableService {
  constructor(
    @Optional() private apiUrl: API_URL,
    @Optional() private maxRetries: MAX_RETRIES,
    private flags: FEATURE_FLAGS
  ) {}

  getConfig() {
    return {
      apiUrl: this.apiUrl,
      maxRetries: this.maxRetries,
      darkMode: this.flags.get('darkMode'),
    };
  }
}

// ============================================================================
// EXAMPLE 10: Programmatic Injection (Injector API)
// ============================================================================

@Injectable({ providedIn: 'root' })
export class DynamicService {
  private services = new Map<string, any>();

  constructor(private injector: Injector) {}

  /**
   * Get service dynamically by token
   */
  getService<T>(token: any): T {
    return this.injector.get(token);
  }

  /**
   * Create component dynamically with DI
   */
  createComponentDynamically(
    componentClass: any,
    viewRef: ViewContainerRef
  ): void {
    const componentFactory = this.injector.get(any); // In real app: ComponentFactoryResolver
    // Create component instance with DI
  }

  /**
   * Check if service is available
   */
  hasService(token: any): boolean {
    try {
      this.injector.get(token);
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// EXAMPLE 11: Multi-Providers
// ============================================================================

/**
 * Token for multiple values
 */
export const LOG_HANDLERS = new InjectionToken<LogHandler[]>('log.handlers');

export interface LogHandler {
  handle(message: string): void;
}

export class ConsoleLogHandler implements LogHandler {
  handle(message: string): void {
    console.log(message);
  }
}

export class FileLogHandler implements LogHandler {
  handle(message: string): void {
    // In real app: write to file
    console.log(`[File] ${message}`);
  }
}

/**
 * Multi-provider - multiple values for same token
 */
// In module:
// providers: [
//   { provide: LOG_HANDLERS, useClass: ConsoleLogHandler, multi: true },
//   { provide: LOG_HANDLERS, useClass: FileLogHandler, multi: true }
// ]

@Injectable()
export class MultiProviderService {
  constructor(@Inject(LOG_HANDLERS) private handlers: LogHandler[]) {}

  log(message: string): void {
    // All handlers execute
    this.handlers.forEach((handler) => handler.handle(message));
  }
}

// ============================================================================
// EXAMPLE 12: Lazy Singleton Pattern
// ============================================================================

/**
 * Lazy initialization - create service only when first needed
 */
@Injectable({ providedIn: 'root' })
export class LazySingletonService {
  private static instance: LazySingletonService;
  private initialized = false;

  private constructor() {}

  static getInstance(): LazySingletonService {
    if (!LazySingletonService.instance) {
      LazySingletonService.instance = new LazySingletonService();
    }
    return LazySingletonService.instance;
  }

  initialize(): void {
    if (!this.initialized) {
      console.log('Initializing expensive resource');
      // Expensive initialization
      this.initialized = true;
    }
  }
}

// ============================================================================
// EXAMPLE 13: Service Locator Pattern (Anti-pattern but shown for reference)
// ============================================================================

/**
 * Service Locator - NOT RECOMMENDED
 * Shows how to use Injector manually (avoid this)
 */
@Injectable({ providedIn: 'root' })
export class ServiceLocator {
  constructor(private injector: Injector) {}

  getService<T>(token: any): T {
    // ❌ BAD: Makes dependencies implicit, hard to test
    return this.injector.get(token);
  }
}

// Better approach: Inject dependencies directly
@Injectable({ providedIn: 'root' })
export class BetterService {
  constructor(
    // ✅ GOOD: Dependencies explicit, easy to test
    private logger: LoggerService,
    private http: HttpClient
  ) {}
}

// ============================================================================
// EXAMPLE 14: Custom Injector for Testing
// ============================================================================

/**
 * Example of creating custom injector in tests
 */
export function createTestInjector() {
  // In real tests, use TestBed:
  // TestBed.configureTestingModule({
  //   providers: [UserService, { provide: HttpClient, useClass: MockHttpClient }]
  // });
  // const injector = TestBed.inject(Injector);
  // const userService = injector.get(UserService);
}

// ============================================================================
// EXAMPLE 15: Complete Service with All Patterns
// ============================================================================

export const BASE_URL = new InjectionToken<string>('base.url');
export const API_KEY = new InjectionToken<string>('api.key');

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl: string;
  private apiKey: string;

  constructor(
    @Inject(BASE_URL) baseUrl: string,
    @Optional() @Inject(API_KEY) apiKey: string,
    @SkipSelf() @Optional() parent: UserService,
    private logger: LoggerService,
    private http: HttpClient
  ) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || 'default-key';

    if (parent) {
      console.log('UserService inherited from parent');
    }
  }

  getUsers(): Observable<User[]> {
    this.logger.log('Fetching users');
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }
}

export interface User {
  id: number;
  name: string;
  email: string;
}

import { HttpClient } from '@angular/common/http';
import { Inject, Optional as AngularOptional } from '@angular/core';
import { Observable } from 'rxjs';

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

/**
 * DO:
 * ✅ Use providedIn: 'root' for singleton services
 * ✅ Use InjectionToken for non-class values
 * ✅ Use @Optional() for optional dependencies
 * ✅ Use @Self() or @SkipSelf() when needed
 * ✅ Inject dependencies in constructor
 * ✅ Use factory providers for complex setup
 * ✅ Provide at lowest level (component > module > root)
 *
 * DON'T:
 * ❌ Use Service Locator pattern
 * ❌ Inject Injector unless necessary
 * ❌ Create services outside Angular DI
 * ❌ Provide service at multiple levels without reason
 * ❌ Use string tokens (use InjectionToken instead)
 * ❌ Mix manual instantiation with DI
 * ❌ Create circular dependencies
 */
