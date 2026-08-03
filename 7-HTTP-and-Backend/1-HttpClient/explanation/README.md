# HttpClient - Complete Guide

## Setup HttpClient

```typescript
// Import HttpClientModule
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule]
})
export class AppModule {}

// OR with standalone
@Component({
  imports: [HttpClientModule]
})
export class MyComponent {}
```

## Making HTTP Requests

```typescript
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) {}

  // GET request
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // GET with query parameters
  searchUsers(term: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      params: new HttpParams()
        .set('search', term)
        .set('limit', '10')
    });
  }

  // POST request
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // PUT request (replace)
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // PATCH request (partial update)
  partialUpdate(id: number, partial: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, partial);
  }

  // DELETE request
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// Using the service
@Component({})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => this.users = users,
      error => console.error(error)
    );
  }
}
```

## Request and Response Options

```typescript
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Custom headers
const headers = new HttpHeaders({
  'Authorization': 'Bearer token123',
  'Custom-Header': 'value'
});

this.http.get(url, { headers });

// Query parameters
const params = new HttpParams()
  .set('page', '1')
  .set('limit', '10')
  .set('sort', 'name');

this.http.get(url, { params });

// Observe response metadata
this.http.get(url, { observe: 'response' }).subscribe(response => {
  console.log(response.status);
  console.log(response.headers);
  console.log(response.body);
});

// Report progress
this.http.get(url, { reportProgress: true }).subscribe(event => {
  if (event.type === HttpEventType.DownloadProgress) {
    console.log('Downloaded:', event.loaded, 'bytes');
  }
});
```

## Error Handling

```typescript
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

// Using with error handling
this.userService.getUsers().subscribe(
  users => this.users = users,
  error => this.showErrorMessage(error.message)
);
```

## Retry Logic

```typescript
import { retry, retryWhen, delay, take } from 'rxjs/operators';

// Simple retry - retry 3 times
this.http.get(url).pipe(
  retry(3)
).subscribe();

// Retry with delay
this.http.get(url).pipe(
  retryWhen(errors =>
    errors.pipe(
      delay(1000), // Wait 1 second before retrying
      take(3)      // Retry max 3 times
    )
  )
).subscribe();

// Exponential backoff retry
function retryWithExponentialBackoff(maxRetries: number = 3) {
  return retryWhen(errors =>
    errors.pipe(
      mergeMap((error, index) => {
        if (index < maxRetries) {
          const delayMs = Math.pow(2, index) * 1000; // 1s, 2s, 4s
          return timer(delayMs);
        }
        return throwError(error);
      })
    )
  );
}

// Usage
this.http.get(url).pipe(
  retryWithExponentialBackoff(3)
).subscribe();
```

## File Upload and Download

```typescript
// File upload
uploadFile(file: File): Observable<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', 'File upload');

  return this.http.post<UploadResponse>(
    'https://api.example.com/upload',
    formData,
    { reportProgress: true }
  );
}

// File upload with progress
uploadWithProgress(file: File): Observable<HttpEvent<any>> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(
    'https://api.example.com/upload',
    formData,
    {
      reportProgress: true,
      observe: 'events'
    }
  );
}

// File download
downloadFile(fileName: string): void {
  this.http.get(
    `https://api.example.com/download/${fileName}`,
    { responseType: 'blob' }
  ).subscribe(blob => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  });
}
```

## Typed HTTP Service

```typescript
// Generic HTTP service
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), options);
  }

  post<T>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), data, options);
  }

  put<T>(endpoint: string, data: any, options?: any): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), data, options);
  }

  delete<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), options);
  }

  private buildUrl(endpoint: string): string {
    return `https://api.example.com${endpoint}`;
  }
}

// Specific service using generic API service
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.api.get<User[]>('/users');
  }

  getUser(id: number): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.api.post<User>('/users', user);
  }
}
```

## Response Caching

```typescript
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CachedUserService {
  private users$: Observable<User[]>;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    if (!this.users$) {
      this.users$ = this.http.get<User[]>('https://api.example.com/users').pipe(
        shareReplay(1) // Share single subscription, replay last value
      );
    }
    return this.users$;
  }

  invalidateCache() {
    this.users$ = null;
  }
}

// Or with cache map
@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, Observable<any>>();

  get<T>(key: string, fetcher: () => Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, fetcher().pipe(shareReplay(1)));
    }
    return this.cache.get(key) as Observable<T>;
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}
```

## CORS and Security

```typescript
// CORS configuration (server-side)
// The server must set appropriate CORS headers

// Client-side error handling for CORS
this.http.get(url).subscribe(
  data => console.log(data),
  error => {
    if (error.status === 0) {
      console.error('CORS error or network error');
    }
  }
);

// Credentials with requests
this.http.get(url, {
  withCredentials: true // Include cookies/credentials
}).subscribe();
```

## Best Practices

1. **Use services** - Centralize HTTP logic
2. **Handle errors** - Always provide error handling
3. **Use typing** - Leverage TypeScript for type safety
4. **Implement retry logic** - For network resilience
5. **Cache appropriately** - Reduce unnecessary requests
6. **Unsubscribe properly** - Use takeUntil pattern
7. **Use interceptors** - For cross-cutting concerns
8. **Report progress** - For large file operations

## Key Takeaways

- HttpClient provides typed HTTP communication
- Request options control headers, parameters, and behavior
- Error handling is essential for robust applications
- Caching improves performance
- Retry logic handles transient failures
- File upload/download requires special handling
- Services centralize HTTP logic
