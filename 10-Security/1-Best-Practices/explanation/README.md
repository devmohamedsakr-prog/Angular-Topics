# Angular Security - Best Practices

## Common Vulnerabilities

### 1. Cross-Site Scripting (XSS)

XSS attacks inject malicious scripts into your application.

```typescript
// ❌ VULNERABLE
@Component({
  template: `<div [innerHTML]="userInput"></div>`
})
export class VulnerableComponent {
  userInput = '<img src=x onerror="alert(\'XSS\')">';
}

// ✓ SAFE - Angular auto-escapes by default
@Component({
  template: `<div>{{ userInput }}</div>`
})
export class SafeComponent {
  userInput = '<img src=x onerror="alert(\'XSS\')">';
  // Displayed as text, not executed
}

// If you need HTML, use sanitization
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  template: `<div [innerHTML]="sanitizedHtml"></div>`
})
export class SanitizedComponent {
  sanitizedHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    const userHtml = '<p>Safe content</p>';
    this.sanitizedHtml = this.sanitizer.sanitize(
      SecurityContext.HTML,
      userHtml
    );
  }
}
```

### 2. Cross-Site Request Forgery (CSRF)

CSRF attacks trick users into making unwanted requests.

```typescript
// ✓ CSRF Protection with HttpClient
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule]
})
export class AppModule {
  // HttpClient automatically includes CSRF token in headers
  // Default token name: 'X-CSRF-TOKEN'
  // Default header name: 'X-CSRF-TOKEN'
}

// Custom CSRF configuration
import { HttpClientXsrfModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    })
  ]
})
export class AppModule {}
```

### 3. Content Security Policy (CSP)

CSP helps prevent various attacks by restricting content sources.

```html
<!-- Add to index.html or server headers -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' fonts.googleapis.com;
  connect-src 'self' api.example.com;
">

<!-- Or via server header (recommended) -->
<!-- Content-Security-Policy: default-src 'self'; script-src 'self' cdn.jsdelivr.net; -->
```

## Authentication and Authorization

### JWT (JSON Web Tokens)

```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  private token$ = new BehaviorSubject<string | null>(this.getToken());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', {
      email,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.token$.next(response.token);
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.token$.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    
    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
  }
}
```

### Auth Interceptor

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      // Clone request and add auth header
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}

// Provide interceptor
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppModule {}
```

### Auth Guard

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

// Role-based guard
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];

    if (this.authService.hasRole(requiredRole)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}

// Usage in routing
const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'admin' } },
  { path: 'login', component: LoginComponent }
];
```

## Secure Data Storage

```typescript
// ❌ AVOID - localStorage is vulnerable
localStorage.setItem('token', token);

// ✓ BETTER - Use httpOnly cookies (set by server)
// Server sets: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

// ✓ SESSION STORAGE (for non-sensitive data)
sessionStorage.setItem('user-preferences', JSON.stringify(preferences));

// ✓ MEMORY (best for sensitive data - lost on page reload)
@Injectable({ providedIn: 'root' })
export class SecureStorageService {
  private storage = new Map<string, any>();

  set(key: string, value: any): void {
    this.storage.set(key, value);
  }

  get(key: string): any {
    return this.storage.get(key);
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}
```

## Input Validation

```typescript
// ❌ INSECURE - No validation
const userInput = req.body.email;
db.saveUser({ email: userInput });

// ✓ SECURE - Validate and sanitize
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({})
export class UserFormComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.pattern(/^[0-9]{10}$/)]),
    website: new FormControl('', [Validators.pattern(/^https?:\/\/.+/)])
  });

  constructor(
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {}

  onSubmit() {
    if (this.form.invalid) return;

    const sanitized = {
      email: this.form.value.email.toLowerCase().trim(),
      phone: this.form.value.phone.replace(/\D/g, ''),
      website: this.sanitizer.sanitize(SecurityContext.URL, this.form.value.website)
    };

    this.userService.createUser(sanitized).subscribe();
  }
}
```

## Secure API Communication

```typescript
// ✓ Use HTTPS
// All API calls should use HTTPS in production

// ✓ CORS configuration (server-side)
// Server should restrict CORS origins

// ✓ API Key rotation
@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  private apiKey$ = new BehaviorSubject<string>(this.loadApiKey());

  constructor(private http: HttpClient) {
    this.rotateApiKeyPeriodically();
  }

  private rotateApiKeyPeriodically() {
    interval(24 * 60 * 60 * 1000).subscribe(() => {
      this.rotateApiKey();
    });
  }

  private rotateApiKey() {
    this.http.post<{ key: string }>('/api/rotate-key', {}).subscribe(
      response => {
        this.saveApiKey(response.key);
        this.apiKey$.next(response.key);
      }
    );
  }

  private loadApiKey(): string {
    // Load from secure storage
    return sessionStorage.getItem('api_key') || '';
  }

  private saveApiKey(key: string) {
    sessionStorage.setItem('api_key', key);
  }
}
```

## Dependency Security

```bash
# Regular audits
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Secure Configuration

```typescript
// environment.prod.ts - Production configuration
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com', // HTTPS only
  enableDebug: false, // Never enable in production
  corsEnabled: false, // Minimize CORS usage
  strictSSL: true,
  contentSecurityPolicy: {
    'default-src': ["'self'"],
    'script-src': ["'self'", 'trusted-cdn.com'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'fonts.googleapis.com']
  }
};

// environment.ts - Development configuration  
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  enableDebug: true
};
```

## Best Practices Checklist

- ✓ Use HTTPS everywhere
- ✓ Store tokens in httpOnly cookies
- ✓ Validate all user input
- ✓ Sanitize HTML content
- ✓ Implement CSRF protection
- ✓ Use CSP headers
- ✓ Keep dependencies updated
- ✓ Implement proper authentication
- ✓ Use role-based access control
- ✓ Log security events
- ✓ Use secure random generators
- ✓ Never commit secrets
- ✓ Use environment variables
- ✓ Implement rate limiting
- ✓ Use security headers

## Key Takeaways

- Angular has built-in XSS protection
- Always validate and sanitize user input
- Use httpOnly cookies for tokens
- Implement authentication guards
- Keep dependencies updated
- Use HTTPS in production
- Implement CSP headers
- Never trust user input
- Use environment-specific configurations
