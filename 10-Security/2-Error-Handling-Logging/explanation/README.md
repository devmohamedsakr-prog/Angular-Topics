# Error Handling & Logging in Angular

## Overview

Proper error handling and logging are critical for debugging, monitoring, and maintaining production applications. This guide covers centralized error handling, logging strategies, error recovery, and monitoring practices.

---

## Error Types

### 1. **Application Errors**
- Logic errors in components/services
- Validation errors
- Business logic violations

### 2. **Network Errors**
- HTTP request failures
- Timeout errors
- Connection issues

### 3. **Runtime Errors**
- JavaScript exceptions
- Type errors
- Reference errors

### 4. **User Errors**
- Invalid input
- Unsupported operations
- Permission denied

---

## Global Error Handler

### ErrorHandler Service

```typescript
// error.handler.ts
import { ErrorHandler, Injectable, Injector } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const chunkFailedMessage = /Loading chunk \d+ failed/g.regexp;
    
    if (chunkFailedMessage.test(error.message)) {
      // Handle chunk loading errors
      window.location.reload();
    }

    // Log the error
    const logger = this.injector.get(LoggingService);
    logger.error('Global error:', error);

    // Show user-friendly message
    const notificationService = this.injector.get(NotificationService);
    
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        notificationService.showError('Session expired. Please login again.');
      } else if (error.status === 403) {
        notificationService.showError('You do not have permission to perform this action.');
      } else if (error.status >= 500) {
        notificationService.showError('Server error. Please try again later.');
      } else {
        notificationService.showError(`Error: ${error.message}`);
      }
    } else {
      notificationService.showError('An unexpected error occurred. Please try again.');
    }

    // Send error to monitoring service
    this.injector.get(ErrorMonitoringService).reportError(error);
  }
}

// app.module.ts
@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ]
})
export class AppModule {}
```

---

## HTTP Error Interceptor

```typescript
// http-error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

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
      retry(1), // Retry once on failure
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;

          // Handle specific status codes
          switch (error.status) {
            case 401:
              // Unauthorized - redirect to login
              this.authService.logout();
              break;
            case 403:
              // Forbidden - user doesn't have permission
              break;
            case 404:
              // Not found
              break;
            case 500:
            case 502:
            case 503:
            case 504:
              // Server errors
              break;
          }
        }

        this.errorService.logError(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
```

---

## Logging Service

### Structured Logging

```typescript
// logging.service.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  stackTrace?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private logs: LogEntry[] = [];
  private logLevel = LogLevel.INFO;
  private maxLogs = 1000;

  debug(message: string, context?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: any): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: any): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  fatal(message: string, context?: string, data?: any): void {
    this.log(LogLevel.FATAL, message, context, data);
  }

  private log(
    level: LogLevel,
    message: string,
    context?: string,
    data?: any
  ): void {
    if (level < this.logLevel) {
      return; // Don't log if below threshold
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      data,
      stackTrace: this.getStackTrace()
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Log to console in development
    if (!environment.production) {
      this.logToConsole(entry);
    }

    // Send to server if error or fatal
    if (level >= LogLevel.ERROR) {
      this.sendToServer(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const style = this.getConsoleStyle(entry.level);
    console.log(
      `%c[${LogLevel[entry.level]}]`,
      style,
      `${entry.context ? entry.context + ' - ' : ''}${entry.message}`,
      entry.data
    );
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: gray';
      case LogLevel.INFO:
        return 'color: blue';
      case LogLevel.WARN:
        return 'color: orange';
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return 'color: red';
      default:
        return '';
    }
  }

  private getStackTrace(): string {
    return new Error().stack || '';
  }

  private sendToServer(entry: LogEntry): void {
    // Send to logging backend (Sentry, LogRocket, etc.)
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}
```

---

## Error Recovery Strategies

### 1. **Retry with Exponential Backoff**

```typescript
import { retry, timer } from 'rxjs';

this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => {
      const delayMs = Math.pow(2, retryCount) * 1000;
      console.log(`Retrying after ${delayMs}ms`);
      return timer(delayMs);
    }
  })
).subscribe();
```

### 2. **Fallback Values**

```typescript
this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('API call failed, using fallback');
    return of(DEFAULT_DATA);
  })
).subscribe(data => {
  this.data = data;
});
```

### 3. **Circuit Breaker Pattern**

```typescript
@Injectable()
export class CircuitBreakerService {
  private failureCount = 0;
  private successCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly FAILURE_THRESHOLD = 5;
  private readonly SUCCESS_THRESHOLD = 2;

  call<T>(request: Observable<T>): Observable<T> {
    if (this.state === 'OPEN') {
      return throwError(() => new Error('Circuit breaker is open'));
    }

    return request.pipe(
      tap({
        next: () => this.onSuccess(),
        error: () => this.onFailure()
      }),
      catchError(error => {
        if (this.state === 'HALF_OPEN') {
          this.state = 'OPEN';
        }
        return throwError(() => error);
      })
    );
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.SUCCESS_THRESHOLD) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      this.state = 'OPEN';
      // Try to recover after delay
      setTimeout(() => {
        this.state = 'HALF_OPEN';
      }, 30000);
    }
  }
}
```

---

## Error Monitoring

### Sentry Integration

```typescript
// sentry.ts
import * as Sentry from "@sentry/angular";
import { ErrorHandler, NgZone } from '@angular/core';

Sentry.init({
  dsn: environment.sentryDsn,
  environment: environment.production ? 'production' : 'development',
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.exception) {
      const error = event.exception.values?.[0]?.value;
      if (error?.includes('password') || error?.includes('token')) {
        return null;
      }
    }
    return event;
  }
});

export const sentryErrorHandler = (zone: NgZone): ErrorHandler => {
  return new Sentry.ErrorHandler({
    showDialog: false,
    integration: new Sentry.CaptureConsole({
      levels: ['warn', 'error']
    })
  });
};

// app.module.ts
@NgModule({
  providers: [
    {
      provide: ErrorHandler,
      useFactory: sentryErrorHandler,
      deps: [NgZone]
    }
  ]
})
export class AppModule {}
```

---

## Best Practices

1. **Centralize error handling**
   - Use ErrorHandler
   - Use HTTP interceptors
   - Consistent error messages

2. **Log appropriately**
   - Different log levels
   - Structured logging
   - Don't log sensitive data

3. **Handle errors gracefully**
   - Show user-friendly messages
   - Provide recovery options
   - Log technical details

4. **Monitor in production**
   - Use error tracking service
   - Track error patterns
   - Alert on critical errors

5. **Distinguish error types**
   - User errors → friendly messages
   - System errors → technical details
   - Network errors → retry logic

6. **Don't swallow errors**
   - Log all errors
   - Re-throw when appropriate
   - Let errors bubble when needed

7. **Test error scenarios**
   - Mock error responses
   - Test error handlers
   - Verify recovery flows

---

## Summary

Effective error handling:
- **Centralized** - Single point of handling
- **Structured** - Organized logging
- **Recoverable** - Fallbacks and retries
- **Monitored** - Tracking and alerting
- **User-friendly** - Clear messages
- **Debuggable** - Detailed logs

Key patterns:
- Global error handler
- HTTP interceptor
- Structured logging
- Error recovery strategies
- Monitoring integration
