# Angular Unit Testing - Complete Guide

## Testing Setup

```typescript
// karma.conf.js - Test runner configuration
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: false // Run tests in order
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

## Component Testing

```typescript
// user.component.ts
@Component({
  selector: 'app-user',
  template: `
    <h1>{{ user?.name }}</h1>
    <p>{{ user?.email }}</p>
    <button (click)="onDelete()">Delete</button>
  `
})
export class UserComponent {
  @Input() user: User;
  @Output() deleted = new EventEmitter<number>();

  onDelete() {
    this.deleted.emit(this.user.id);
  }
}

// user.component.spec.ts
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    component.user = { id: 1, name: 'John', email: 'john@example.com' };
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toBe('John');
  });

  it('should emit deleted event when delete clicked', () => {
    component.user = { id: 1, name: 'John', email: 'john@example.com' };
    spyOn(component.deleted, 'emit');

    component.onDelete();

    expect(component.deleted.emit).toHaveBeenCalledWith(1);
  });

  it('should display email', fakeAsync(() => {
    component.user = { id: 1, name: 'John', email: 'john@example.com' };
    fixture.detectChanges();
    tick();

    const p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toBe('john@example.com');
  }));
});
```

## Service Testing

```typescript
// user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}

// user.service.spec.ts
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

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
  });

  it('should fetch users', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch single user', () => {
    const mockUser: User = { id: 1, name: 'John', email: 'john@example.com' };

    service.getUser(1).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(user.id).toBe(1);
    });

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should handle HTTP error', () => {
    service.getUsers().subscribe(
      () => fail('Should have failed'),
      error => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne('/api/users');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
```

## Testing Directives

```typescript
// highlight.directive.spec.ts
describe('HighlightDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  @Component({
    template: `<div appHighlight="yellow">Test</div>`
  })
  class HostComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HighlightDirective, HostComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
  });

  it('should apply background color', () => {
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');
    expect(element.style.backgroundColor).toBe('yellow');
  });
});
```

## Testing with Mocks and Spies

```typescript
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should load users on init', () => {
    const mockUsers = [{ id: 1, name: 'John', email: 'john@example.com' }];
    userService.getUsers.and.returnValue(of(mockUsers));

    fixture.detectChanges();

    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });
});
```

## Async Testing

```typescript
describe('AsyncComponent', () => {
  let component: AsyncComponent;
  let fixture: ComponentFixture<AsyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsyncComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsyncComponent);
    component = fixture.componentInstance;
  });

  // Using async
  it('should load data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.data).toBeDefined();
  });

  // Using fakeAsync and tick
  it('should wait for timer', fakeAsync(() => {
    let value = 0;
    component.delayedValue.subscribe(v => value = v);

    tick(1000);
    expect(value).toBe(42);
  }));

  // Using done callback
  it('should handle promises', (done) => {
    component.promiseValue.then(value => {
      expect(value).toBe('success');
      done();
    });
  });
});
```

## Testing Pipes

```typescript
// uppercase.pipe.spec.ts
describe('UppercasePipe', () => {
  it('should transform text to uppercase', () => {
    const pipe = new UppercasePipe();
    expect(pipe.transform('hello')).toBe('HELLO');
    expect(pipe.transform('angular')).toBe('ANGULAR');
  });

  it('should handle empty string', () => {
    const pipe = new UppercasePipe();
    expect(pipe.transform('')).toBe('');
  });
});
```

## Testing Forms

```typescript
describe('LoginForm', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create form', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    const email = component.form.get('email');
    email.setValue('');
    expect(email.hasError('required')).toBeTruthy();

    email.setValue('invalid-email');
    expect(email.hasError('email')).toBeTruthy();

    email.setValue('valid@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('should submit form', () => {
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    spyOn(component, 'onSubmit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
```

## Code Coverage

```bash
# Run tests with coverage
ng test --code-coverage

# Coverage report
# Coverage will be generated in coverage/ directory
# Open coverage/index.html in browser to view report

# Set coverage thresholds in karma.conf.js
coverageReporter: {
  dir: require('path').join(__dirname, './coverage'),
  subdir: '.',
  reporters: [{ type: 'html' }],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

## Best Practices

1. **Test behavior, not implementation** - Focus on what not how
2. **Use AAA pattern** - Arrange, Act, Assert
3. **Keep tests isolated** - No dependencies between tests
4. **Mock external dependencies** - Use spies and mocks
5. **Test error cases** - Not just happy path
6. **Use fixtures** - Consistent test setup
7. **Clean up after tests** - Verify no outstanding requests
8. **Test async code properly** - Use async, fakeAsync, tick
9. **Aim for high coverage** - But not 100% (diminishing returns)
10. **Keep tests maintainable** - Clear and readable

## Key Takeaways

- TestBed configures testing module
- HttpTestingController mocks HTTP requests
- Jasmine provides testing framework and utilities
- Spies track function calls and return values
- Async utilities handle asynchronous code
- Code coverage identifies untested code
- Proper mocking isolates units under test
