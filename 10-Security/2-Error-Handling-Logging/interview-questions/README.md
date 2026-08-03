# Error Handling & Logging Interview Questions

## Beginner Level

### Q1: What is error handling and why is it important?

**Answer:**

Error handling is the process of catching, logging, and responding to errors in an application.

**Why it's important:**
- **User experience** - Show friendly messages instead of crashes
- **Debugging** - Log errors for troubleshooting
- **Reliability** - Allow recovery from errors
- **Monitoring** - Track issues in production
- **Security** - Prevent sensitive data leaks

**Example:**
```typescript
// Without error handling - app crashes
const data = JSON.parse(userInput);

// With error handling - graceful degradation
try {
  const data = JSON.parse(userInput);
} catch (error) {
  console.error('Invalid JSON:', error);
  showNotification('Invalid input format');
}
```

---

### Q2: How do you implement global error handling in Angular?

**Answer:**

Use the `ErrorHandler` class to catch all errors globally:

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const logger = this.injector.get(LoggingService);
    
    // Log error
    logger.error(error.message);
    
    // Show user message
    const notificationService = this.injector.get(NotificationService);
    notificationService.showError('An error occurred');
    
    // Send to monitoring
    this.injector.get(ErrorMonitoringService).reportError(error);
  }
}

// app.module.ts
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class AppModule {}
```

---

### Q3: What is an HTTP interceptor and how do you use it for errors?

**Answer:**

An HTTP interceptor intercepts all HTTP requests and responses to add common logic.

```typescript
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorService: ErrorService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different status codes
        if (error.status === 401) {
          this.authService.logout();
        } else if (error.status >= 500) {
          this.errorService.handleServerError(error);
        }
        
        return throwError(() => error);
      })
    );
  }
}

// app.module.ts
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ]
})
export class AppModule {}
```

---

### Q4: What are log levels and why do you need them?

**Answer:**

Log levels categorize the severity of messages:

| Level | Usage | Example |
|-------|-------|---------|
| **DEBUG** | Detailed info for debugging | Variable values, function calls |
| **INFO** | General informational | User logged in, data loaded |
| **WARN** | Warning, may cause issues | Deprecated API, slow response |
| **ERROR** | Error occurred, need attention | Request failed, validation error |
| **FATAL** | Critical error, app may crash | Database connection lost |

**Example:**
```typescript
@Injectable()
export class LoggingService {
  debug(msg: string): void { console.log(msg); }
  info(msg: string): void { console.info(msg); }
  warn(msg: string): void { console.warn(msg); }
  error(msg: string): void { console.error(msg); }
  fatal(msg: string): void { console.error(msg); }
}

// Usage
this.logger.debug('User ID: ' + userId);
this.logger.info('Data loaded');
this.logger.warn('API response slow');
this.logger.error('Login failed');
this.logger.fatal('Database connection lost');
```

---

### Q5: How do you handle specific HTTP error codes?

**Answer:**

```typescript
private handleHttpError(error: HttpErrorResponse): void {
  switch (error.status) {
    case 0:
      // Network error
      this.notificationService.showError('Network error');
      break;
    case 400:
      // Bad request
      this.notificationService.showError('Invalid request');
      break;
    case 401:
      // Unauthorized
      this.authService.logout();
      this.notificationService.showError('Please log in again');
      break;
    case 403:
      // Forbidden
      this.notificationService.showError('Access denied');
      break;
    case 404:
      // Not found
      this.notificationService.showError('Resource not found');
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      // Server error
      this.notificationService.showError('Server error. Please try again later');
      break;
    default:
      this.notificationService.showError(`Error: ${error.message}`);
  }
}
```

---

## Intermediate Level

### Q6: How do you implement retry logic with exponential backoff?

**Answer:**

```typescript
import { retry, timer } from 'rxjs';

this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => {
      // Exponential backoff: 1s, 2s, 4s, 8s
      const delayMs = Math.pow(2, retryCount) * 1000;
      console.log(`Retry ${retryCount + 1} after ${delayMs}ms`);
      return timer(delayMs);
    }
  })
).subscribe();
```

---

### Q7: What is the Circuit Breaker pattern?

**Answer:**

Circuit Breaker prevents cascading failures by stopping requests to a failing service:

**States:**
- **CLOSED** - Requests pass through normally
- **OPEN** - Requests are rejected (circuit is "broken")
- **HALF_OPEN** - Limited requests allowed to test if service recovered

**Implementation:**
```typescript
@Injectable()
export class CircuitBreakerService {
  private state = 'CLOSED';
  private failureCount = 0;
  private readonly FAILURE_THRESHOLD = 5;

  call<T>(request: Observable<T>): Observable<T> {
    if (this.state === 'OPEN') {
      return throwError(() => new Error('Circuit is open'));
    }

    return request.pipe(
      tap(() => {
        this.failureCount = 0; // Reset on success
      }),
      catchError(error => {
        this.failureCount++;
        if (this.failureCount >= this.FAILURE_THRESHOLD) {
          this.state = 'OPEN';
          // Recover after 30 seconds
          setTimeout(() => { this.state = 'HALF_OPEN'; }, 30000);
        }
        return throwError(() => error);
      })
    );
  }
}
```

---

### Q8: How do you prevent sensitive data in logs?

**Answer:**

```typescript
@Injectable()
export class LoggingService {
  private sensitivePatterns = [
    /password/gi,
    /token/gi,
    /secret/gi,
    /api[_-]?key/gi,
    /credit[_-]?card/gi,
    /ssn/gi,
    /email/gi
  ];

  sanitizeData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitiveField(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  private sanitizeString(str: string): string {
    return this.sensitivePatterns.reduce(
      (acc, pattern) => acc.replace(pattern, '[REDACTED]'),
      str
    );
  }

  private isSensitiveField(key: string): boolean {
    return this.sensitivePatterns.some(pattern => pattern.test(key));
  }

  log(message: string, data?: any): void {
    const sanitized = this.sanitizeData(data);
    console.log(message, sanitized);
  }
}
```

---

### Q9: How do you structure error messages for users?

**Answer:**

**Good error messages:**
1. **Clear** - Explain what went wrong
2. **Actionable** - Tell user what to do
3. **Specific** - Be concrete, not generic
4. **Friendly** - Use natural language

**Examples:**

```typescript
// ❌ Bad
showError('Error 500');
showError('Request failed');

// ✅ Good
showError('Unable to save changes. Please check your internet connection and try again.');
showError('Your password is too short. It must be at least 8 characters.');
showError('Account not found. Please check the username and try again.');
```

---

### Q10: How do you monitor errors in production?

**Answer:**

**Using Sentry (popular error tracking service):**
```typescript
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
  tracesSampleRate: 1.0
});

@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      useValue: new Sentry.ErrorHandler()
    }
  ]
})
export class AppModule {}
```

**Benefits:**
- Automatic error capture
- Source maps for debugging
- Error alerts and notifications
- Error tracking over time
- Performance monitoring

---

## Advanced Level

### Q11: How do you implement structured logging?

**Answer:**

```typescript
export interface LogEntry {
  timestamp: Date;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context?: string;
  data?: any;
  requestId?: string;
  userId?: string;
  userAgent?: string;
  url?: string;
}

@Injectable()
export class StructuredLoggingService {
  private requestId = this.generateRequestId();

  log(entry: Partial<LogEntry>): void {
    const fullEntry: LogEntry = {
      timestamp: new Date(),
      level: entry.level || 'INFO',
      message: entry.message,
      context: entry.context,
      data: entry.data,
      requestId: this.requestId,
      userId: this.getCurrentUserId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...entry
    };

    // Send to server
    this.sendToServer(fullEntry);
    
    // Log locally
    console.log(JSON.stringify(fullEntry));
  }

  private sendToServer(entry: LogEntry): void {
    // Send structured log to backend
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random()}`;
  }

  private getCurrentUserId(): string {
    // Get from auth service
    return '';
  }
}
```

---

### Q12: How do you handle errors in observables?

**Answer:**

```typescript
// Handle with catchError
this.data$.pipe(
  catchError(error => {
    console.error('Error:', error);
    return of(defaultValue);
  })
).subscribe();

// Retry before catching
this.data$.pipe(
  retry(3),
  catchError(error => {
    console.error('Failed after 3 retries:', error);
    return of(defaultValue);
  })
).subscribe();

// Log and rethrow
this.data$.pipe(
  catchError(error => {
    this.logger.error('Operation failed', error);
    return throwError(() => error); // Re-throw
  })
).subscribe();
```

---

## Summary

**Error handling best practices:**
1. Use global ErrorHandler
2. Use HTTP interceptors
3. Structure logging with levels
4. Sanitize sensitive data
5. Show user-friendly messages
6. Implement retry logic
7. Use Circuit Breaker for cascading failures
8. Monitor errors in production
9. Track error patterns
10. Alert on critical errors
