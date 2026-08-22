# Unit Testing Interview Questions (Quick Reference)

## Q1-Q3: TestBed Configuration
```typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [HttpClientTestingModule],
      providers: [UserService]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Q4-Q6: Component Testing
```typescript
describe('Component tests', () => {
  it('should display message', () => {
    component.message = 'Hello';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Hello');
  });

  it('should handle click', () => {
    spyOn(component, 'onClick');
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();
    expect(component.onClick).toHaveBeenCalled();
  });

  it('should use service', () => {
    const service = TestBed.inject(UserService);
    spyOn(service, 'getUser').and.returnValue(of({ id: 1, name: 'John' }));
    component.ngOnInit();
    expect(component.user).toEqual({ id: 1, name: 'John' });
  });
});
```

## Q7-Q9: HttpClient Testing
```typescript
describe('HttpClient tests', () => {
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
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'User 1' }];
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should handle errors', () => {
    service.getUsers().subscribe(
      () => fail('Should error'),
      error => expect(error.status).toBe(500)
    );

    httpMock.expectOne('/api/users').error(
      new ErrorEvent('Network'), { status: 500 }
    );
  });
});
```

## Q10-Q12: Async Testing
```typescript
describe('Async tests', () => {
  it('should use async', async () => {
    const data = await service.loadData().toPromise();
    expect(data).toBeDefined();
  });

  it('should use fakeAsync', fakeAsync(() => {
    let result: any;
    service.delayedData().subscribe(data => result = data);
    tick(1000);
    expect(result).toBeDefined();
  });

  it('should use done', (done) => {
    service.data$.subscribe(data => {
      expect(data).toBeDefined();
      done();
    });
  });

  it('should use waitForAsync', waitForAsync(() => {
    let result: any;
    service.data$.subscribe(data => result = data);
    expect(result).toBeDefined();
  }));
});
```

## Q13-Q15: Best Practices
```
✅ Test behavior, not implementation
✅ Use AAA pattern (Arrange, Act, Assert)
✅ Mock external dependencies
✅ Use spy functions
✅ Test error cases
✅ Keep tests simple and focused
✅ Use beforeEach for setup
✅ Clean up with afterEach
✅ Aim for >80% coverage
```

