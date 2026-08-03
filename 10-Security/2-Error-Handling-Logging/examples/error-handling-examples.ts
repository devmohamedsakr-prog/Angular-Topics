/**
 * Error Handling & Logging Examples for Angular
 * Demonstrates global error handling, logging strategies, and recovery patterns
 */

import {
  ErrorHandler,
  Injectable,
  Injector,
  NgZone
} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, of, retry, timer } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Global Error Handler
// ============================================================================

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const logger = this.injector.get(LoggingService);
    const notificationService = this.injector.get(NotificationService);

    // Log error
    if (error instanceof HttpErrorResponse) {
      logger.error(
        `HTTP Error ${error.status}: ${error.message}`,
        'HttpError',
        {
          url: error.url,
          status: error.status,
          statusText: error.statusText,
          body: error.error
        }
      );

      // Handle different status codes
      switch (error.status) {
        case 0:
          notificationService.showError('Unable to connect to server');
          break;
        case 400:
          notificationService.showError('Invalid request');
          break;
        case 401:
          notificationService.showError('Authentication failed');
          break;
        case 403:
          notificationService.showError('Access denied');
          break;
        case 404:
          notificationService.showError('Resource not found');
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          notificationService.showError('Server error. Please try again later');
          break;
        default:
          notificationService.showError(`Error: ${error.message}`);
      }
    } else {
      logger.error(
        error.message,
        'ApplicationError',
        { stack: error.stack }
      );
      notificationService.showError('An unexpected error occurred');
    }

    // Send to monitoring service
    this.injector.get(ErrorMonitoringService).reportError(error);
  }
}

// ============================================================================
// EXAMPLE 2: HTTP Error Interceptor
// ============================================================================

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorService: ErrorService,
    private authService: AuthService,
    private logger: LoggingService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // Log request
      tap(() => {
        this.logger.debug(`HTTP ${request.method} ${request.url}`);
      }),
      // Retry once on failure
      retry({
        count: 1,
        delay: (error, retryCount) => {
          this.logger.warn(`Retrying request (attempt ${retryCount})`);
          return timer(1000); // Wait 1 second before retry
        }
      }),
      // Handle errors
      catchError((error: HttpErrorResponse) => {
        this.handleError(error, request);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<any>): void {
    const errorLog = {
      method: request.method,
      url: request.url,
      status: error.status,
      message: error.message,
      timestamp: new Date().toISOString()
    };

    switch (error.status) {
      case 401:
        // Unauthorized - logout user
        this.logger.warn('Unauthorized access - logging out', 'Auth', errorLog);
        this.authService.logout();
        break;

      case 403:
        // Forbidden - user lacks permissions
        this.logger.warn('Forbidden access', 'Auth', errorLog);
        break;

      case 404:
        // Not found
        this.logger.warn('Resource not found', 'Http', errorLog);
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        this.logger.error('Server error', 'Http', errorLog);
        break;

      default:
        this.logger.error('HTTP request failed', 'Http', errorLog);
    }
  }
}

// ============================================================================
// EXAMPLE 3: Logging Service
// ============================================================================

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
  private logLevel = LogLevel.DEBUG;
  private readonly maxLogs = 1000;

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
      return;
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
    this.logToConsole(entry);

    // Send errors to server
    if (level >= LogLevel.ERROR) {
      this.sendToServer(entry);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const style = this.getConsoleStyle(entry.level);
    const prefix = entry.context ? `[${entry.context}]` : '';

    console.log(
      `%c[${levelName}] ${prefix}`,
      style,
      entry.message,
      entry.data
    );
  }

  private getConsoleStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: gray; font-weight: bold';
      case LogLevel.INFO:
        return 'color: blue; font-weight: bold';
      case LogLevel.WARN:
        return 'color: orange; font-weight: bold';
      case LogLevel.ERROR:
        return 'color: red; font-weight: bold';
      case LogLevel.FATAL:
        return 'color: darkred; font-weight: bold; background: yellow';
      default:
        return '';
    }
  }

  private getStackTrace(): string {
    try {
      return new Error().stack || '';
    } catch {
      return '';
    }
  }

  private sendToServer(entry: LogEntry): void {
    // Send to logging backend (Sentry, LogRocket, etc.)
    // Implement based on your monitoring service
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// ============================================================================
// EXAMPLE 4: Circuit Breaker Pattern
// ============================================================================

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

@Injectable()
export class CircuitBreakerService {
  private failureCount = 0;
  private successCount = 0;
  private state: CircuitState = CircuitState.CLOSED;
  private readonly FAILURE_THRESHOLD = 5;
  private readonly SUCCESS_THRESHOLD = 2;
  private readonly TIMEOUT = 30000; // 30 seconds

  constructor(private logger: LoggingService) {}

  call<T>(request: Observable<T>): Observable<T> {
    if (this.state === CircuitState.OPEN) {
      this.logger.warn(
        'Circuit breaker is OPEN - rejecting request',
        'CircuitBreaker'
      );
      return throwError(() => new Error('Circuit breaker is open'));
    }

    return request.pipe(
      tap({
        next: () => this.recordSuccess(),
        error: () => this.recordFailure()
      }),
      catchError(error => {
        if (this.state === CircuitState.HALF_OPEN) {
          this.openCircuit();
        }
        return throwError(() => error);
      })
    );
  }

  private recordSuccess(): void {
    this.failureCount = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      this.logger.debug(
        `Circuit breaker: success ${this.successCount}/${this.SUCCESS_THRESHOLD}`,
        'CircuitBreaker'
      );

      if (this.successCount >= this.SUCCESS_THRESHOLD) {
        this.closeCircuit();
      }
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.logger.debug(
      `Circuit breaker: failure ${this.failureCount}/${this.FAILURE_THRESHOLD}`,
      'CircuitBreaker'
    );

    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      this.openCircuit();
    }
  }

  private openCircuit(): void {
    this.state = CircuitState.OPEN;
    this.logger.warn('Circuit breaker opened', 'CircuitBreaker');

    // Try to recover after timeout
    setTimeout(() => {
      this.halfOpenCircuit();
    }, this.TIMEOUT);
  }

  private halfOpenCircuit(): void {
    this.state = CircuitState.HALF_OPEN;
    this.successCount = 0;
    this.logger.info('Circuit breaker half-opened - testing', 'CircuitBreaker');
  }

  private closeCircuit(): void {
    this.state = CircuitState.CLOSED;
    this.successCount = 0;
    this.failureCount = 0;
    this.logger.info('Circuit breaker closed', 'CircuitBreaker');
  }

  getState(): CircuitState {
    return this.state;
  }
}

// ============================================================================
// EXAMPLE 5: Error Recovery Service
// ============================================================================

@Injectable()
export class ErrorRecoveryService {
  constructor(
    private logger: LoggingService,
    private circuitBreaker: CircuitBreakerService
  ) {}

  // Retry with exponential backoff
  retryWithBackoff<T>(
    request: Observable<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Observable<T> {
    return request.pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          const delayMs = initialDelay * Math.pow(2, retryCount);
          this.logger.warn(
            `Retrying after ${delayMs}ms (attempt ${retryCount + 1}/${maxRetries})`,
            'Retry'
          );
          return timer(delayMs);
        }
      }),
      catchError(error => {
        this.logger.error(
          `Request failed after ${maxRetries} retries`,
          'Retry',
          { error: error.message }
        );
        return throwError(() => error);
      })
    );
  }

  // Use fallback value on error
  withFallback<T>(
    request: Observable<T>,
    fallback: T
  ): Observable<T> {
    return request.pipe(
      catchError(error => {
        this.logger.warn(
          'Using fallback value',
          'Fallback',
          { error: error.message }
        );
        return of(fallback);
      })
    );
  }

  // Use circuit breaker
  withCircuitBreaker<T>(request: Observable<T>): Observable<T> {
    return this.circuitBreaker.call(request);
  }

  // Combined strategy: circuit breaker + retry + fallback
  resilientCall<T>(
    request: Observable<T>,
    fallback: T,
    maxRetries: number = 2
  ): Observable<T> {
    return this.withCircuitBreaker(
      this.retryWithBackoff(request, maxRetries)
    ).pipe(
      catchError(error => {
        this.logger.error('All recovery strategies failed', 'Resilient', {
          error: error.message
        });
        return of(fallback);
      })
    );
  }
}

// ============================================================================
// EXAMPLE 6: Notification Service
// ============================================================================

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable()
export class NotificationService {
  private notifications: Notification[] = [];

  showSuccess(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration: number = 5000): void {
    this.show(message, 'error', duration);
  }

  showWarning(message: string, duration: number = 4000): void {
    this.show(message, 'warning', duration);
  }

  showInfo(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  private show(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info',
    duration: number
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    this.notifications.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random()}`;
  }
}

// ============================================================================
// EXAMPLE 7: Error Monitoring Service
// ============================================================================

@Injectable()
export class ErrorMonitoringService {
  constructor(private logger: LoggingService) {}

  reportError(error: Error | HttpErrorResponse): void {
    const errorReport = {
      timestamp: new Date().toISOString(),
      message: error.message,
      type: error instanceof HttpErrorResponse ? 'HttpError' : 'ApplicationError',
      ...(error instanceof HttpErrorResponse && {
        status: error.status,
        url: error.url,
        statusText: error.statusText
      }),
      ...(!(error instanceof HttpErrorResponse) && {
        stack: error.stack
      }),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logger.error(
      'Error reported to monitoring service',
      'Monitoring',
      errorReport
    );

    // Send to backend monitoring service
    this.sendToMonitoringBackend(errorReport);
  }

  private sendToMonitoringBackend(errorReport: any): void {
    // Implementation depends on your monitoring service
    // Examples: Sentry, LogRocket, New Relic, etc.
  }
}

// Stub services for examples
@Injectable()
export class ErrorService {
  logError(message: string): void {
    console.error(message);
  }
}

@Injectable()
export class AuthService {
  logout(): void {
    console.log('Logging out user');
  }
}
