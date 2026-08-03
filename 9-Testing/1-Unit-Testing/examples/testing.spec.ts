/**
 * Angular Unit Testing - Complete Examples
 * Demonstrates Jasmine, Karma, TestBed, mocks, spies, and testing patterns
 */

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
  waitForAsync,
} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  Component,
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Basic Component Testing with TestBed
// ============================================================================

/**
 * Simple component to test
 */
@Component({
  selector: 'app-counter',
  template: `
    <div>
      <p id="count">Count: {{ count }}</p>
      <button id="increment" (click)="increment()">+</button>
      <button id="decrement" (click)="decrement()">-</button>
      <button id="reset" (click)="reset()">Reset</button>
    </div>
  `,
})
export class CounterComponent {
  count = 0;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    this.count--;
  }

  reset(): void {
    this.count = 0;
  }
}

/**
 * Component test suite
 */
describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    // Configure testing module
    await TestBed.configureTestingModule({
      declarations: [CounterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    // Create component instance
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize count to 0', () => {
    expect(component.count).toBe(0);
  });

  it('should increment count', () => {
    component.increment();
    expect(component.count).toBe(1);
  });

  it('should decrement count', () => {
    component.count = 5;
    component.decrement();
    expect(component.count).toBe(4);
  });

  it('should reset count', () => {
    component.count = 10;
    component.reset();
    expect(component.count).toBe(0);
  });

  it('should display count in template', () => {
    component.count = 5;
    fixture.detectChanges();

    const countElement = fixture.debugElement.query(By.css('#count'));
    expect(countElement.nativeElement.textContent).toContain('5');
  });

  it('should increment when button clicked', () => {
    const button = fixture.debugElement.query(By.css('#increment'));
    button.nativeElement.click();
    fixture.detectChanges();

    expect(component.count).toBe(1);
  });
});

// ============================================================================
// EXAMPLE 2: Testing with Inputs and Outputs
// ============================================================================

/**
 * Component with @Input and @Output
 */
@Component({
  selector: 'app-button',
  template: `<button (click)="handleClick()">{{ label }}</button>`,
})
export class ButtonComponent {
  import { EventEmitter, Input, Output } from '@angular/core';
  @Input() label = 'Click me';
  @Output() clicked = new EventEmitter<void>();

  handleClick(): void {
    this.clicked.emit();
  }
}

describe('ButtonComponent with Inputs/Outputs', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should display label from Input', () => {
    component.label = 'Custom Label';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.textContent).toContain('Custom Label');
  });

  it('should emit clicked event', (done) => {
    component.clicked.subscribe(() => {
      expect(true).toBe(true);
      done();
    });

    component.handleClick();
  });

  it('should emit clicked event when button is clicked', () => {
    spyOn(component.clicked, 'emit');
    const button = fixture.debugElement.query(By.css('button'));

    button.nativeElement.click();

    expect(component.clicked.emit).toHaveBeenCalled();
  });
});

// ============================================================================
// EXAMPLE 3: Service Testing with Mocks and Spies
// ============================================================================

/**
 * Service to test
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get('/api/users');
  }

  getUserById(id: number) {
    return this.http.get(`/api/users/${id}`);
  }

  createUser(user: any) {
    return this.http.post('/api/users', user);
  }
}

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests remain
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    service.getUsers().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const request = httpMock.expectOne('/api/users');
    expect(request.request.method).toBe('GET');
    request.flush(mockUsers);
  });

  it('should fetch single user', () => {
    const mockUser = { id: 1, name: 'John' };

    service.getUserById(1).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const request = httpMock.expectOne('/api/users/1');
    expect(request.request.method).toBe('GET');
    request.flush(mockUser);
  });

  it('should create user', () => {
    const newUser = { name: 'New User', email: 'new@example.com' };
    const response = { id: 3, ...newUser };

    service.createUser(newUser).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = httpMock.expectOne('/api/users');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newUser);
    request.flush(response);
  });

  it('should handle errors', () => {
    service.getUsers().subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error.status).toBe(404);
      }
    );

    const request = httpMock.expectOne('/api/users');
    request.flush('Error message', { status: 404, statusText: 'Not Found' });
  });
});

// ============================================================================
// EXAMPLE 4: Async Testing (fakeAsync, tick, waitForAsync)
// ============================================================================

@Component({
  selector: 'app-async-component',
  template: `<div>{{ data }}</div>`,
})
export class AsyncComponent {
  data: string = '';

  constructor(private service: UserService) {}

  loadData(): void {
    this.service.getUsers().subscribe(() => {
      this.data = 'Loaded';
    });
  }
}

describe('Async Testing', () => {
  let component: AsyncComponent;
  let fixture: ComponentFixture<AsyncComponent>;
  let service: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [AsyncComponent],
      providers: [{ provide: UserService, useValue: serviceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AsyncComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  // Using fakeAsync and tick
  it('should load data (fakeAsync)', fakeAsync(() => {
    service.getUsers.and.returnValue(of([{ id: 1, name: 'John' }]));

    component.loadData();
    tick(); // Execute pending timers

    expect(component.data).toBe('Loaded');
  }));

  // Using waitForAsync (formerly async)
  it('should load data (waitForAsync)', waitForAsync(() => {
    service.getUsers.and.returnValue(
      of([{ id: 1, name: 'John' }]).pipe(delay(100))
    );

    component.loadData();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.data).toBe('Loaded');
    });
  }));

  // Using done callback
  it('should load data (done callback)', (done) => {
    service.getUsers.and.returnValue(of([{ id: 1, name: 'John' }]));

    component.loadData();

    setTimeout(() => {
      expect(component.data).toBe('Loaded');
      done();
    }, 100);
  });
});

// ============================================================================
// EXAMPLE 5: Spies and Mocks
// ============================================================================

describe('Spies and Mocks', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
  });

  // Spy on method
  it('should spy on increment method', () => {
    spyOn(component, 'increment');

    component.increment();

    expect(component.increment).toHaveBeenCalled();
    expect(component.increment).toHaveBeenCalledTimes(1);
  });

  // Spy with return value
  it('should spy with return value', () => {
    spyOn(component, 'increment').and.returnValue(undefined);

    component.increment();

    expect(component.increment).toHaveBeenCalled();
  });

  // Spy with fake implementation
  it('should spy with fake implementation', () => {
    spyOn(component, 'increment').and.callFake(() => {
      component.count += 5;
    });

    component.increment();

    expect(component.count).toBe(5);
  });

  // Spy on property
  it('should spy on property', () => {
    Object.defineProperty(component, 'count', {
      get: jasmine.createSpy('count').and.returnValue(10),
    });

    expect(component.count).toBe(10);
  });
});

// ============================================================================
// EXAMPLE 6: Component with Dependency Injection
// ============================================================================

@Component({
  selector: 'app-user-list',
  template: `
    <div>
      <ul>
        <li *ngFor="let user of users">{{ user.name }}</li>
      </ul>
    </div>
  `,
})
export class UserListComponent {
  users: any[] = [];

  constructor(private userService: UserService) {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
}

describe('UserListComponent with DI', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [{ provide: UserService, useValue: serviceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should load users on init', () => {
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    userService.getUsers.and.returnValue(of(mockUsers));

    component.loadUsers();
    fixture.detectChanges();

    expect(component.users).toEqual(mockUsers);
  });

  it('should display users in template', () => {
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    userService.getUsers.and.returnValue(of(mockUsers));

    component.loadUsers();
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('li'));
    expect(listItems.length).toBe(2);
    expect(listItems[0].nativeElement.textContent).toContain('John');
  });
});

// ============================================================================
// EXAMPLE 7: Testing with ActivatedRoute
// ============================================================================

@Component({
  selector: 'app-user-detail',
  template: `<div>User ID: {{ userId }}</div>`,
})
export class UserDetailComponent {
  userId: number | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });
  }
}

describe('UserDetailComponent with ActivatedRoute', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  beforeEach(async () => {
    const activatedRouteSpy = {
      params: of({ id: 123 }),
    };

    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get user id from route', () => {
    expect(component.userId).toBe(123);
  });

  it('should display user id', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('123');
  });
});

// ============================================================================
// EXAMPLE 8: Testing with NO_ERRORS_SCHEMA
// ============================================================================

describe('Component with NO_ERRORS_SCHEMA', () => {
  it('should ignore unknown elements', async () => {
    @Component({
      selector: 'app-test',
      template: `<app-unknown-component></app-unknown-component>`,
    })
    class TestComponent {}

    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

// ============================================================================
// EXAMPLE 9: Common Matchers
// ============================================================================

describe('Common Jasmine Matchers', () => {
  it('should use toBe for identity', () => {
    const obj = { a: 1 };
    expect(obj).toBe(obj);
  });

  it('should use toEqual for deep equality', () => {
    expect({ a: 1 }).toEqual({ a: 1 });
  });

  it('should use toContain', () => {
    expect([1, 2, 3]).toContain(2);
  });

  it('should use toThrow', () => {
    expect(() => {
      throw new Error('Test error');
    }).toThrowError('Test error');
  });

  it('should use toBeTruthy/toBeFalsy', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
  });

  it('should use toBeNull/toBeDefined', () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });

  it('should use toBeGreaterThan', () => {
    expect(5).toBeGreaterThan(3);
  });

  it('should use toMatch for regex', () => {
    expect('hello').toMatch(/h/);
  });

  it('should use not to negate', () => {
    expect(1).not.toBe(2);
  });
});

// ============================================================================
// EXAMPLE 10: Test Coverage Best Practices
// ============================================================================

/**
 * TESTING BEST PRACTICES:
 *
 * 1. ARRANGE-ACT-ASSERT pattern
 *    - Arrange: Set up test data/conditions
 *    - Act: Call the function/method
 *    - Assert: Check results
 *
 * 2. ONE ASSERTION PER TEST when possible
 *    - Easier to debug failures
 *    - Clearer intent
 *
 * 3. USE DESCRIPTIVE TEST NAMES
 *    ✅ "should increment count when increment is called"
 *    ❌ "test increment"
 *
 * 4. MOCK EXTERNAL DEPENDENCIES
 *    - Don't call real APIs
 *    - Use jasmine.createSpyObj()
 *    - Use HttpClientTestingModule
 *
 * 5. TEST EDGE CASES
 *    - Empty arrays
 *    - Null values
 *    - Error conditions
 *
 * 6. AIM FOR 80%+ CODE COVERAGE
 *    - High coverage catches bugs
 *    - But coverage ≠ good tests
 *
 * 7. AVOID TESTING FRAMEWORK CODE
 *    - Don't test Angular internals
 *    - Focus on component logic
 *
 * 8. KEEP TESTS INDEPENDENT
 *    - Don't share state between tests
 *    - Use beforeEach/afterEach
 *    - Tests can run in any order
 *
 * 9. USE beforeEach FOR SETUP
 *    - Common initialization
 *    - Reduces duplication
 *
 * 10. USE afterEach FOR CLEANUP
 *     - Verify HTTP mocks
 *     - Clean up subscriptions
 *     - Reset spies
 */
