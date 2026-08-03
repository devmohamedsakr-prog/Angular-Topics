/**
 * Reactive Forms - Complete Examples
 * Demonstrates FormControl, FormGroup, FormBuilder, FormArray, validation, and patterns
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  AsyncValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, map, takeUntil, switchMap } from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Basic FormControl
// ============================================================================

@Component({
  selector: 'app-form-control-example',
  template: `
    <div>
      <h3>Basic FormControl Example</h3>
      <input [formControl]="emailControl" placeholder="Enter email" />
      <p *ngIf="emailControl.hasError('required')">Email is required</p>
      <p *ngIf="emailControl.hasError('email')">Invalid email format</p>
      <p>Value: {{ emailControl.value }}</p>
      <p>Valid: {{ emailControl.valid }}</p>
    </div>
  `,
})
export class FormControlExampleComponent {
  // Simple FormControl with validation
  emailControl = new FormControl('', [Validators.required, Validators.email]);
}

// ============================================================================
// EXAMPLE 2: FormGroup with Multiple Controls
// ============================================================================

@Component({
  selector: 'app-form-group-example',
  template: `
    <form [formGroup]="userForm">
      <div>
        <label>Name:</label>
        <input formControlName="name" placeholder="Enter name" />
        <p *ngIf="userForm.get('name').hasError('required')">Name is required</p>
      </div>

      <div>
        <label>Email:</label>
        <input formControlName="email" type="email" placeholder="Enter email" />
        <p *ngIf="userForm.get('email').hasError('email')">Invalid email</p>
      </div>

      <div>
        <label>Age:</label>
        <input formControlName="age" type="number" />
        <p *ngIf="userForm.get('age').hasError('min')">Must be 18+</p>
      </div>

      <button [disabled]="!userForm.valid">Submit</button>
      <p>Form valid: {{ userForm.valid }}</p>
      <p>Form value: {{ userForm.value | json }}</p>
    </form>
  `,
})
export class FormGroupExampleComponent {
  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl('', [Validators.required, Validators.min(18)]),
  });
}

// ============================================================================
// EXAMPLE 3: FormBuilder (Recommended Way)
// ============================================================================

@Component({
  selector: 'app-form-builder-example',
  template: `
    <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
      <div formGroupName="personal">
        <h4>Personal Information</h4>
        <input
          formControlName="firstName"
          placeholder="First Name"
          required
        />
        <input formControlName="lastName" placeholder="Last Name" required />
      </div>

      <div formGroupName="contact">
        <h4>Contact Information</h4>
        <input formControlName="email" type="email" placeholder="Email" />
        <input formControlName="phone" placeholder="Phone" />
      </div>

      <button [disabled]="!registrationForm.valid">Register</button>
    </form>
  `,
})
export class FormBuilderExampleComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      personal: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
      contact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
      }),
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
    }
  }
}

// ============================================================================
// EXAMPLE 4: FormArray for Dynamic Controls
// ============================================================================

@Component({
  selector: 'app-form-array-example',
  template: `
    <form [formGroup]="form">
      <h3>Add Multiple Items</h3>

      <div formArrayName="items">
        <div *ngFor="let item of itemsArray.controls; let i = index">
          <input [formControl]="item" placeholder="Item {{ i + 1 }}" />
          <button type="button" (click)="removeItem(i)">Remove</button>
        </div>
      </div>

      <button type="button" (click)="addItem()">Add Item</button>
      <button (ngSubmit)="onSubmit()">Submit</button>

      <p>Items: {{ form.get('items').value | json }}</p>
    </form>
  `,
})
export class FormArrayExampleComponent implements OnInit {
  form: FormGroup;

  get itemsArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      items: this.fb.array([this.createItem()]),
    });
  }

  createItem(): FormControl {
    return this.fb.control('', Validators.required);
  }

  addItem() {
    this.itemsArray.push(this.createItem());
  }

  removeItem(index: number) {
    this.itemsArray.removeAt(index);
  }

  onSubmit() {
    console.log(this.form.value);
  }
}

// ============================================================================
// EXAMPLE 5: Custom Validators
// ============================================================================

// Synchronous custom validator
export function passwordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.value;

  if (!password) {
    return null;
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumeric = /[0-9]/.test(password);

  const isStrong = hasUpperCase && hasLowerCase && hasNumeric;

  return isStrong ? null : { weakPassword: true };
}

// Cross-field validator
export function passwordMatchValidator(
  formGroup: AbstractControl
): ValidationErrors | null {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-custom-validator-example',
  template: `
    <form [formGroup]="form">
      <div>
        <label>Password:</label>
        <input
          formControlName="password"
          type="password"
          placeholder="Min 1 uppercase, 1 lowercase, 1 number"
        />
        <p *ngIf="form.get('password').hasError('weakPassword')">
          Password must contain uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          formControlName="confirmPassword"
          type="password"
          placeholder="Repeat password"
        />
      </div>

      <p *ngIf="form.hasError('passwordMismatch')">Passwords do not match</p>
      <button [disabled]="!form.valid">Set Password</button>
    </form>
  `,
})
export class CustomValidatorExampleComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, passwordStrengthValidator]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }
}

// ============================================================================
// EXAMPLE 6: Async Validators
// ============================================================================

// Simulate checking username availability
export function usernameAsyncValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  if (!control.value) {
    return of(null);
  }

  // Simulate API call with delay
  return of(control.value).pipe(
    debounceTime(300),
    switchMap((username) => {
      // In real app, call actual API
      const takenUsernames = ['admin', 'user', 'test'];
      const isTaken = takenUsernames.includes(username.toLowerCase());

      return of(isTaken ? { usernameTaken: true } : null);
    })
  );
}

@Component({
  selector: 'app-async-validator-example',
  template: `
    <form [formGroup]="form">
      <label>Username:</label>
      <input formControlName="username" placeholder="Choose username" />

      <p *ngIf="form.get('username').pending">Checking availability...</p>
      <p *ngIf="form.get('username').hasError('usernameTaken')" class="error">
        Username already taken
      </p>

      <button [disabled]="!form.valid">Register</button>
    </form>
  `,
})
export class AsyncValidatorExampleComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required, [usernameAsyncValidator]],
    });
  }
}

// ============================================================================
// EXAMPLE 7: Form State Tracking
// ============================================================================

@Component({
  selector: 'app-form-state-example',
  template: `
    <form [formGroup]="form">
      <input formControlName="email" placeholder="Email" />

      <div class="form-info">
        <p>Status: {{ form.status }}</p>
        <p>Valid: {{ form.valid }}</p>
        <p>Dirty: {{ form.dirty }} (user modified)</p>
        <p>Touched: {{ form.touched }} (user interacted)</p>
        <p>Pristine: {{ form.pristine }} (unchanged)</p>
        <p>Untouched: {{ form.untouched }} (no interaction)</p>
        <p>Errors: {{ form.errors | json }}</p>
      </div>

      <button (click)="markAllAsTouched()">Mark As Touched</button>
      <button (click)="reset()">Reset</button>
    </form>
  `,
})
export class FormStateExampleComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  markAllAsTouched() {
    this.form.markAllAsTouched();
  }

  reset() {
    this.form.reset();
  }
}

// ============================================================================
// EXAMPLE 8: Watching Form Changes
// ============================================================================

@Component({
  selector: 'app-watch-form-changes',
  template: `
    <form [formGroup]="form">
      <label>Price:</label>
      <input formControlName="price" type="number" />

      <label>Tax Rate:</label>
      <input formControlName="taxRate" type="number" />

      <p>Total: {{ total }}</p>
    </form>
  `,
})
export class WatchFormChangesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  total = 0;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      price: [100, Validators.required],
      taxRate: [0.1, Validators.required],
    });

    // Watch for changes and calculate total
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        map(({ price, taxRate }) => price * (1 + taxRate)),
        takeUntil(this.destroy$)
      )
      .subscribe((total) => {
        this.total = total;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 9: Conditional Validation
// ============================================================================

@Component({
  selector: 'app-conditional-validation',
  template: `
    <form [formGroup]="form">
      <label>
        <input formControlName="country" />
        Country
      </label>

      <label *ngIf="form.get('country').value === 'US'">
        <input formControlName="zipCode" />
        ZIP Code (required for US)
      </label>

      <button [disabled]="!form.valid">Submit</button>
    </form>
  `,
})
export class ConditionalValidationComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      country: [''],
      zipCode: [''],
    });

    // Add/remove validation based on country selection
    this.form
      .get('country')
      .valueChanges.subscribe((country) => {
        const zipCodeControl = this.form.get('zipCode');

        if (country === 'US') {
          zipCodeControl.setValidators(Validators.required);
        } else {
          zipCodeControl.clearValidators();
        }

        zipCodeControl.updateValueAndValidity();
      });
  }
}

// ============================================================================
// EXAMPLE 10: Setting and Patching Values
// ============================================================================

@Component({
  selector: 'app-set-patch-example',
  template: `
    <form [formGroup]="form">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
      <input formControlName="age" placeholder="Age" />

      <button (click)="setValues()">Set All Values</button>
      <button (click)="patchValues()">Patch Some Values</button>
      <button (click)="resetForm()">Reset</button>
    </form>
  `,
})
export class SetPatchExampleComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      age: [''],
    });
  }

  // setValue: requires ALL controls to be present, replaces entire form
  setValues() {
    this.form.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    });
  }

  // patchValue: can update partial form, only specified controls are updated
  patchValues() {
    this.form.patchValue({
      name: 'Jane Doe',
      // email and age not specified, they keep current values
    });
  }

  resetForm() {
    this.form.reset();
  }
}

// ============================================================================
// EXAMPLE 11: Form Integration with Service
// ============================================================================

export interface UserData {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Mock service
export class UserService {
  saveUser(userData: UserData): Observable<UserData> {
    return of({ ...userData, id: 'new-id' }).pipe();
  }

  getUserById(id: string): Observable<UserData> {
    return of({
      id,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    });
  }
}

@Component({
  selector: 'app-form-service-integration',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
      <input formControlName="age" placeholder="Age" />

      <button [disabled]="!form.valid || isSaving">
        {{ isSaving ? 'Saving...' : 'Save User' }}
      </button>

      <p *ngIf="successMessage" class="success">{{ successMessage }}</p>
      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  `,
})
export class FormServiceIntegrationComponent implements OnInit {
  form: FormGroup;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', Validators.required],
    });

    this.loadUser('123');
  }

  loadUser(id: string) {
    this.userService.getUserById(id).subscribe((user) => {
      this.form.patchValue(user);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.userService.saveUser(this.form.value).subscribe(
        (result) => {
          this.isSaving = false;
          this.successMessage = `User ${result.name} saved successfully!`;
          this.form.reset();
        },
        (error) => {
          this.isSaving = false;
          this.errorMessage = 'Error saving user. Please try again.';
        }
      );
    }
  }
}

// ============================================================================
// EXAMPLE 12: Nested FormGroups with Validation
// ============================================================================

@Component({
  selector: 'app-nested-form-groups',
  template: `
    <form [formGroup]="form">
      <div formGroupName="address">
        <h4>Address</h4>
        <input formControlName="street" placeholder="Street" />
        <input formControlName="city" placeholder="City" />
        <input formControlName="zipCode" placeholder="ZIP" />
        <input formControlName="country" placeholder="Country" />
      </div>

      <div formGroupName="billing">
        <h4>Billing</h4>
        <label>
          <input type="checkbox" formControlName="sameAsAddress" />
          Same as Address
        </label>
      </div>

      <button [disabled]="!form.valid">Submit</button>
      <pre>{{ form.value | json }}</pre>
    </form>
  `,
})
export class NestedFormGroupsComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required],
      }),
      billing: this.fb.group({
        sameAsAddress: [false],
      }),
    });
  }
}
