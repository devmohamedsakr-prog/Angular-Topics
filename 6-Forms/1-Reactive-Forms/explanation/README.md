# Reactive Forms - Advanced Guide

## What are Reactive Forms?

Reactive Forms (also known as Model-driven Forms) provide a reactive, model-driven approach to handling form inputs. They are more scalable and testable than template-driven forms.

## Setting Up Reactive Forms

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule]
})
export class AppModule {}

// Or with standalone components
@Component({
  imports: [ReactiveFormsModule]
})
export class MyComponent {}
```

## FormControl

The most basic unit of a reactive form:

```typescript
import { FormControl, Validators } from '@angular/forms';

@Component({
  template: `
    <input [formControl]="name" />
    <div *ngIf="name.hasError('required') && name.touched">
      Name is required
    </div>
  `
})
export class FormControlComponent {
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor() {
    // Subscribe to value changes
    this.name.valueChanges.subscribe(value => {
      console.log('Name changed:', value);
    });

    // Set value programmatically
    this.name.setValue('John');
    this.name.patchValue('Jane'); // Partial update

    // Get value
    console.log(this.name.value);

    // Check validity
    console.log(this.name.valid);
    console.log(this.name.errors);
    console.log(this.name.touched);
    console.log(this.name.dirty);
  }
}
```

## FormGroup

Group multiple FormControls:

```typescript
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="firstName" placeholder="First Name" />
      <input formControlName="lastName" placeholder="Last Name" />
      
      <div *ngIf="form.get('firstName').hasError('required')">
        First name is required
      </div>

      <button [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class FormGroupComponent {
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      // Output: { firstName: 'John', lastName: 'Doe' }
    }
  }
}
```

## FormBuilder

Convenient way to create FormGroups:

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({})
export class UserFormComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      address: this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.pattern(/^\\d{5}$/)]
      }),
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

## FormArray

Manage a collection of FormControls/FormGroups:

```typescript
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div formArrayName="skills">
        <div *ngFor="let skill of skills.controls; let i = index" [formGroupName]="i">
          <input formControlName="name" placeholder="Skill name" />
          <input formControlName="level" placeholder="Level" type="number" />
          <button (click)="removeSkill(i)">Remove</button>
        </div>
      </div>
      <button (click)="addSkill()">Add Skill</button>
      <button [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class DynamicFormComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      skills: this.formBuilder.array([
        this.createSkill()
      ])
    });
  }

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  createSkill(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      level: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  addSkill() {
    this.skills.push(this.createSkill());
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  onSubmit() {
    console.log(this.form.value);
    // Output: { skills: [ { name: 'Angular', level: 8 }, ... ] }
  }
}
```

## Built-in Validators

```typescript
import { Validators } from '@angular/forms';

// Common validators
const firstName = new FormControl('', [
  Validators.required,        // Cannot be empty
  Validators.minLength(3),    // Minimum 3 characters
  Validators.maxLength(50),   // Maximum 50 characters
  Validators.pattern(/^[a-zA-Z]*$/), // Only letters
  Validators.email,           // Valid email format
  Validators.min(0),          // Minimum value
  Validators.max(100),        // Maximum value
  Validators.requiredTrue     // Must be true
]);
```

## Custom Validators

```typescript
// Function-based validator
function ageValidator(control: AbstractControl): ValidationErrors | null {
  const age = control.value;
  if (!age) return null; // Don't validate empty values
  
  return age >= 18 ? null : { ageTooYoung: true };
}

// Async validator
function emailTakenValidator(service: EmailService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    
    return service.checkEmailTaken(control.value).pipe(
      map(isTaken => isTaken ? { emailTaken: true } : null),
      catchError(() => of(null))
    );
  };
}

// Usage
const form = this.formBuilder.group({
  age: ['', [Validators.required, ageValidator]],
  email: ['', [Validators.required], [emailTakenValidator(this.emailService)]]
});

// Cross-field validator
function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  
  return password === confirm ? null : { passwordMismatch: true };
}

// Usage
const form = this.formBuilder.group(
  {
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  },
  { validators: passwordMatchValidator }
);
```

## Form State Properties

```typescript
const form = new FormGroup({
  name: new FormControl('')
});

// Form state properties
form.valid;        // true if all controls are valid
form.invalid;      // opposite of valid
form.pristine;     // true if user hasn't interacted
form.dirty;        // opposite of pristine
form.touched;      // true if field lost focus
form.untouched;    // opposite of touched
form.value;        // Current form value
form.errors;       // Form-level errors
form.status;       // 'VALID', 'INVALID', 'PENDING'
form.disabled;     // true if form or control is disabled
```

## Disabling/Enabling Form Controls

```typescript
// Disable control
const control = new FormControl('', Validators.required);
control.disable();

// Enable control
control.enable();

// Update disabled state
const form = this.formBuilder.group({
  country: [''],
  state: [{ value: '', disabled: true }]
});

// When country changes, enable/disable state
form.get('country').valueChanges.subscribe(country => {
  const stateControl = form.get('state');
  if (country === 'US') {
    stateControl.enable();
  } else {
    stateControl.disable();
  }
});
```

## Watch Form Changes

```typescript
@Component({})
export class FormChangesComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: ['']
    });
  }

  ngOnInit() {
    // Watch all form changes
    this.form.valueChanges.subscribe(value => {
      console.log('Form changed:', value);
    });

    // Watch specific field changes
    this.form.get('email').valueChanges.subscribe(email => {
      console.log('Email changed:', email);
    });

    // Watch status changes
    this.form.statusChanges.subscribe(status => {
      console.log('Form status:', status); // 'VALID' or 'INVALID'
    });

    // Debounce changes
    this.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.saveForm(value);
      });
  }

  saveForm(value: any) {
    // Auto-save form
  }
}
```

## Setting and Patching Values

```typescript
const form = this.formBuilder.group({
  name: [''],
  email: [''],
  address: this.formBuilder.group({
    street: [''],
    city: ['']
  })
});

// Set all values (strict)
form.setValue({
  name: 'John',
  email: 'john@example.com',
  address: {
    street: '123 Main',
    city: 'NYC'
  }
});

// Patch some values (partial update)
form.patchValue({
  name: 'Jane',
  address: {
    city: 'LA'
  }
});

// Reset form
form.reset();

// Reset with initial values
form.reset({
  name: 'John',
  email: 'john@example.com'
});
```

## Form Submission

```typescript
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" />
      <input formControlName="password" type="password" />
      
      <div *ngIf="submitted && form.invalid" class="error">
        Form is invalid
      </div>

      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  form: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.authService.login(this.form.value).subscribe(
      response => {
        console.log('Login successful');
      },
      error => {
        console.error('Login failed');
      }
    );
  }
}
```

## Best Practices

1. **Use FormBuilder** - Cleaner than manual FormControl creation
2. **Validate early** - Provide real-time feedback to users
3. **Use async validators wisely** - They can be slow
4. **Disable form during submission** - Prevent double-submission
5. **Clear validation errors** - When user starts typing
6. **Test forms thoroughly** - Use test utilities from @angular/forms
7. **Handle errors gracefully** - Show meaningful error messages
8. **Use typed forms** - Angular 14+ supports typed FormGroups

## Key Takeaways

- Reactive forms provide programmatic, scalable form handling
- FormControl, FormGroup, FormArray build form structure
- Validators ensure data integrity
- Custom validators handle complex validation logic
- ValueChanges and statusChanges enable reactive form handling
- FormBuilder simplifies form creation
- Reactive forms are highly testable
