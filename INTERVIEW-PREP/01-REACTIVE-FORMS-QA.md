# Reactive Forms Interview Questions & Answers

## Overview
15 comprehensive interview questions covering reactive forms with practical examples and best practices.

---

## Q1: What are the key differences between template-driven and reactive forms?

**Answer:**

| Aspect | Template-Driven | Reactive |
|--------|-----------------|----------|
| **Setup** | In template with directives | In component class |
| **Validation** | Attributes on form elements | Validators in component |
| **Testing** | Requires DOM interaction | Easier unit testing |
| **Scalability** | Good for simple forms | Better for complex forms |
| **Flexibility** | Limited | Highly flexible |
| **Type Safety** | Weak | Strong (TypeScript) |
| **Async Validation** | Supported but harder | Built-in support |
| **Performance** | Good | Slightly better |

```typescript
// Template-Driven
@Component({
  template: `
    <form #form="ngForm" (ngSubmit)="submit()">
      <input name="email" [(ngModel)]="email" required email>
      <button>Submit</button>
    </form>
  `
})
export class TemplateComponent {
  email: string = '';
  submit() {}
}

// Reactive
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email">
      <button>Submit</button>
    </form>
  `
})
export class ReactiveComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  
  constructor(private fb: FormBuilder) {}
  submit() {}
}
```

---

## Q2: Explain FormControl, FormGroup, and FormBuilder

**Answer:**

```typescript
// FormControl - Single input field
const emailControl = new FormControl('', [
  Validators.required,
  Validators.email
]);

emailControl.setValue('test@example.com');
emailControl.valid; // true/false
emailControl.value; // 'test@example.com'
emailControl.errors; // { required: true } or null

// FormGroup - Group of controls
const form = new FormGroup({
  email: new FormControl('', Validators.required),
  password: new FormControl('', Validators.minLength(8)),
  confirmPassword: new FormControl('')
});

form.valid; // true if all controls valid
form.value; // { email: '', password: '', confirmPassword: '' }
form.get('email')?.setValue('new@example.com');

// FormBuilder - Shorthand for creating forms
const form = this.fb.group({
  email: ['', Validators.required],
  password: ['', [Validators.required, Validators.minLength(8)]],
  confirmPassword: [''],
  address: this.fb.group({
    street: [''],
    city: [''],
    zip: ['']
  }),
  hobbies: this.fb.array([
    this.fb.control('')
  ])
});

// Accessing nested controls
form.get('address.street')?.setValue('123 Main St');
const hobbies = form.get('hobbies') as FormArray;
hobbies.push(this.fb.control(''));
```

---

## Q3: How do you create and use custom validators?

**Answer:**

```typescript
// Synchronous custom validator
function forbiddenNameValidator(control: AbstractControl): ValidationErrors | null {
  const forbidden = /admin/i.test(control.value);
  return forbidden ? { forbiddenName: { value: control.value } } : null;
}

// Usage
const form = this.fb.group({
  username: ['', [Validators.required, forbiddenNameValidator]]
});

// Async validator (for backend validation)
@Injectable({ providedIn: 'root' })
export class EmailValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    
    return this.userService.checkEmailExists(control.value).pipe(
      map(exists => exists ? { emailTaken: true } : null),
      catchError(() => of(null))
    );
  }
}

// Usage
const form = this.fb.group({
  email: ['', Validators.required, [new EmailValidator(this.userService)]]
});

// Validator for matching fields
function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  
  return password === confirmPassword ? null : { passwordMismatch: true };
}

// Usage
const form = this.fb.group(
  {
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  },
  { validators: passwordMatchValidator }
);
```

---

## Q4: How do you handle form array and dynamic form controls?

**Answer:**

```typescript
@Component({
  selector: 'app-dynamic-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div formArrayName="items">
        <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i">
          <input formControlName="name" placeholder="Item name">
          <input formControlName="quantity" type="number">
          <button (click)="removeItem(i)">Remove</button>
        </div>
      </div>
      <button (click)="addItem()">Add Item</button>
      <button [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class DynamicFormComponent {
  form = this.fb.group({
    items: this.fb.array([])
  });

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  addItem(): void {
    const itemGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  submit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

---

## Q5: How do you update form values programmatically?

**Answer:**

```typescript
// setValue - Replace entire form value (strict)
this.form.setValue({
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123'
});
// Error if form structure doesn't match exactly

// patchValue - Update specific fields (partial)
this.form.patchValue({
  email: 'new@example.com'
  // Other fields remain unchanged
});

// Marking form as touched/dirty
this.form.markAllAsTouched(); // Mark all controls as touched
this.form.markAsPristine(); // Mark as pristine
this.form.markAsDirty(); // Mark as dirty

// Resetting form
this.form.reset(); // Clear all values
this.form.reset({ email: 'default@example.com' }); // Reset with defaults

// Disable/Enable controls
this.form.get('email')?.disable();
this.form.get('email')?.enable();

// Getting form value (excludes disabled controls by default)
const value = this.form.value;
const valueWithDisabled = this.form.getRawValue();

// Monitoring changes
this.form.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe(value => {
  console.log('Form value changed:', value);
});

this.form.get('email')?.statusChanges.subscribe(status => {
  console.log('Email validation status:', status);
});
```

---

## Q6: How do you implement debounced async validation?

**Answer:**

```typescript
@Injectable({ providedIn: 'root' })
export class DebouncedEmailValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500), // Wait 500ms before checking
      distinctUntilChanged(), // Only check if value changed
      switchMap(email => this.userService.checkEmailExists(email)),
      map(exists => exists ? { emailTaken: true } : null),
      catchError(() => of(null)),
      first() // Complete after first emission
    );
  }
}

// Usage in component
form = this.fb.group({
  email: ['', 
    [Validators.required, Validators.email],
    [this.debounceValidator] // Async validators as 3rd argument
  ]
});

// Monitor validation status
email$ = this.form.get('email')?.statusChanges.pipe(
  map(status => ({
    isValidating: status === 'PENDING',
    isValid: status === 'VALID',
    error: status === 'INVALID'
  }))
);
```

---

## Q7: How do you create a multi-step form wizard?

**Answer:**

```typescript
@Component({
  selector: 'app-form-wizard',
  template: `
    <div [ngSwitch]="currentStep">
      <div *ngSwitchCase="1">
        <app-personal-info [form]="form"></app-personal-info>
      </div>
      <div *ngSwitchCase="2">
        <app-address-info [form]="form"></app-address-info>
      </div>
      <div *ngSwitchCase="3">
        <app-confirmation [form]="form"></app-confirmation>
      </div>
    </div>
    
    <div class="wizard-buttons">
      <button (click)="previousStep()" [disabled]="currentStep === 1">Previous</button>
      <button (click)="nextStep()" [disabled]="!canProceed()">
        {{ currentStep === 3 ? 'Submit' : 'Next' }}
      </button>
    </div>
  `
})
export class FormWizardComponent {
  currentStep = 1;
  
  form = this.fb.group({
    // Step 1
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    
    // Step 2
    street: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
    
    // Step 3
    acceptTerms: [false, Validators.requiredTrue]
  });

  constructor(private fb: FormBuilder) {}

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.form.get('firstName')?.valid &&
               this.form.get('lastName')?.valid &&
               this.form.get('email')?.valid;
      case 2:
        return this.form.get('street')?.valid &&
               this.form.get('city')?.valid &&
               this.form.get('zip')?.valid;
      case 3:
        return this.form.valid;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (this.canProceed()) {
      if (this.currentStep < 3) {
        this.currentStep++;
      } else {
        this.submit();
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submit(): void {
    console.log(this.form.value);
  }
}
```

---

## Q8: How do you handle form submission and error handling?

**Answer:**

```typescript
@Component({
  selector: 'app-form-submit',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email">
      <div *ngIf="submitted && form.get('email')?.invalid">
        {{ getErrorMessage('email') }}
      </div>
      
      <button [disabled]="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
      
      <div *ngIf="submitError" class="error">{{ submitError }}</div>
    </form>
  `
})
export class FormSubmitComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submitted = false;
  isSubmitting = false;
  submitError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  onSubmit(): void {
    this.submitted = true;
    this.submitError = null;

    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;

    this.userService.register(this.form.value).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.isSubmitting = false;
        // Navigate or show success message
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = this.handleError(error);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    
    if (!control?.errors) return '';
    
    if (control.errors['required']) return `${fieldName} is required`;
    if (control.errors['email']) return 'Invalid email format';
    if (control.errors['minlength']) 
      return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    
    return 'Invalid field';
  }

  handleError(error: any): string {
    if (error.status === 400) {
      return error.error.message || 'Invalid input';
    }
    if (error.status === 409) {
      return 'Email already exists';
    }
    return 'An error occurred. Please try again.';
  }
}
```

---

## Q9: How do you implement conditional validation based on other field values?

**Answer:**

```typescript
@Component({
  selector: 'app-conditional-validation',
  template: `
    <form [formGroup]="form">
      <select formControlName="userType">
        <option value="individual">Individual</option>
        <option value="business">Business</option>
      </select>
      
      <input *ngIf="isBusiness()" formControlName="companyName" placeholder="Company Name">
      <input *ngIf="!isBusiness()" formControlName="firstName" placeholder="First Name">
    </form>
  `
})
export class ConditionalValidationComponent implements OnInit {
  form = this.fb.group({
    userType: ['individual'],
    companyName: [''],
    firstName: ['']
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.get('userType')?.valueChanges.subscribe(userType => {
      const companyControl = this.form.get('companyName');
      const firstNameControl = this.form.get('firstName');

      if (userType === 'business') {
        companyControl?.setValidators([Validators.required]);
        firstNameControl?.clearValidators();
      } else {
        companyControl?.clearValidators();
        firstNameControl?.setValidators([Validators.required]);
      }

      companyControl?.updateValueAndValidity();
      firstNameControl?.updateValueAndValidity();
    });
  }

  isBusiness(): boolean {
    return this.form.get('userType')?.value === 'business';
  }
}
```

---

## Q10: How do you save and restore form state?

**Answer:**

```typescript
@Component({
  selector: 'app-form-persistence',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email">
      <input formControlName="name">
      <button>Save</button>
    </form>
  `
})
export class FormPersistenceComponent implements OnInit, OnDestroy {
  form = this.fb.group({
    email: [''],
    name: ['']
  });

  private destroy$ = new Subject<void>();
  private readonly STORAGE_KEY = 'form_state';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Load saved state
    this.loadFormState();

    // Auto-save on changes (debounced)
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe(value => this.saveFormState(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveFormState(value: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
  }

  loadFormState(): void {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.form.patchValue(state);
      } catch (e) {
        console.error('Failed to load form state:', e);
      }
    }
  }

  submit(): void {
    if (this.form.valid) {
      // Clear saved state after successful submission
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Form submitted:', this.form.value);
    }
  }
}
```

---

## Q11: How do you implement cross-field validation with error display?

**Answer:**

```typescript
function passwordsMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('password');
  const confirmPassword = group.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-cross-field-validation',
  template: `
    <form [formGroup]="form">
      <div>
        <input formControlName="password" type="password" placeholder="Password">
      </div>
      
      <div>
        <input formControlName="confirmPassword" type="password" placeholder="Confirm Password">
        <div *ngIf="form.hasError('passwordsMismatch') && submitted" class="error">
          Passwords do not match
        </div>
      </div>
      
      <button (click)="submit()" [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class CrossFieldValidationComponent {
  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordsMatchValidator }
  );

  submitted = false;

  constructor(private fb: FormBuilder) {}

  submit(): void {
    this.submitted = true;
    if (this.form.valid) {
      console.log('Form valid:', this.form.value);
    }
  }
}
```

---

## Q12: How do you handle form reset and cleanup?

**Answer:**

```typescript
@Component({
  selector: 'app-form-cleanup',
  template: `
    <form [formGroup]="form">
      <input formControlName="email">
      <input formControlName="password">
      <button (click)="reset()">Reset</button>
      <button (click)="clear()">Clear All</button>
    </form>
  `
})
export class FormCleanupComponent implements OnDestroy {
  form = this.fb.group({
    email: ['default@example.com'],
    password: ['']
  });

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnDestroy(): void {
    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  reset(): void {
    // Reset to initial values or defaults
    this.form.reset({
      email: 'default@example.com',
      password: ''
    });
  }

  clear(): void {
    // Clear all values
    this.form.reset();
  }

  // Example of cleanup pattern
  setupFormSubscriptions(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$) // Auto-unsubscribe on destroy
      )
      .subscribe(value => {
        // Handle changes
      });
  }
}
```

---

## Q13: How do you implement dependency between form fields?

**Answer:**

```typescript
@Component({
  selector: 'app-field-dependency',
  template: `
    <form [formGroup]="form">
      <select formControlName="country">
        <option value="">Select Country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>
      
      <select formControlName="state" [disabled]="!form.get('country')?.value">
        <option value="">Select State</option>
        <option *ngFor="let state of getStates()" [value]="state">{{ state }}</option>
      </select>
    </form>
  `
})
export class FieldDependencyComponent implements OnInit {
  form = this.fb.group({
    country: [''],
    state: ['']
  });

  stateMap: { [key: string]: string[] } = {
    US: ['California', 'Texas', 'New York'],
    CA: ['Ontario', 'Quebec', 'British Columbia']
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.get('country')?.valueChanges.subscribe(country => {
      const stateControl = this.form.get('state');
      stateControl?.reset(); // Clear previous selection

      if (!country) {
        stateControl?.disable();
      } else {
        stateControl?.enable();
      }
    });
  }

  getStates(): string[] {
    const country = this.form.get('country')?.value;
    return country ? this.stateMap[country] : [];
  }
}
```

---

## Q14: How do you test reactive forms?

**Answer:**

```typescript
describe('ReactiveFormComponent', () => {
  let component: ReactiveFormComponent;
  let fixture: ComponentFixture<ReactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactiveFormComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('email')?.value).toBe('');
  });

  it('should validate email field', () => {
    const emailControl = component.form.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should mark form as invalid when required field is empty', () => {
    component.form.get('email')?.setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('should update form value on patchValue', () => {
    component.form.patchValue({
      email: 'test@example.com'
    });
    expect(component.form.get('email')?.value).toBe('test@example.com');
  });

  it('should handle form submission', () => {
    spyOn(component, 'submit');
    component.form.patchValue({
      email: 'test@example.com'
    });
    
    component.submit();
    expect(component.submit).toHaveBeenCalled();
  });

  it('should trigger valueChanges on form update', (done) => {
    component.form.valueChanges.subscribe(value => {
      expect(value.email).toBe('new@example.com');
      done();
    });
    
    component.form.patchValue({ email: 'new@example.com' });
  });
});
```

---

## Q15: What are best practices for reactive forms?

**Answer:**

```
✅ BEST PRACTICES:

1. Use FormBuilder for cleaner syntax
   - Easier to read and maintain
   - Less boilerplate code

2. Type your form data
   interface UserForm {
     email: string;
     password: string;
   }

3. Use typed FormGroups
   form: FormGroup<{ email: FormControl<string> }>

4. Debounce valueChanges for performance
   - Prevents excessive API calls
   - Better UX with async validation

5. Unsubscribe properly
   - Use takeUntil(destroy$) pattern
   - Prevent memory leaks

6. Separate form creation from initialization
   - Create in constructor/property
   - Setup listeners in ngOnInit

7. Use custom validators
   - Keep validation logic testable
   - Reuse across forms

8. Handle errors gracefully
   - Show user-friendly messages
   - Log technical errors

9. Disable submit button during submission
   - Prevent duplicate submissions
   - Improve UX

10. Save form state
    - Auto-save to localStorage
    - Better UX for multi-step forms

11. Keep form logic in component
    - Easier to test
    - Easier to maintain

12. Use OnPush change detection
    - Better performance
    - Works well with reactive forms
```

---

**Key Takeaway:** Reactive forms provide powerful tools for managing complex form scenarios. Master them for better control and testability in Angular applications.

