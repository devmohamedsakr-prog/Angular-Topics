# Template-Driven Forms in Angular

## Overview

Template-driven forms are a simple way to create forms where most of the logic lives in the template using directives. Angular automatically creates the form model from the template, making them ideal for simple to moderately complex forms.

---

## Comparison: Template-Driven vs Reactive Forms

| Feature | Template-Driven | Reactive |
|---------|-----------------|----------|
| Form Model | Created from template | Created in code |
| Validation | In template | In code |
| Data Flow | Two-way binding | Reactive streams |
| Complexity | Simple to moderate | Moderate to complex |
| Testing | Harder (needs component) | Easier (pure functions) |
| Learning Curve | Easier | Steeper |
| Dynamic Forms | Difficult | Easier |
| Custom Validators | Limited | Powerful |
| Best For | Quick forms | Enterprise apps |

**When to use Template-Driven:**
- Simple forms (login, contact)
- Rapid prototyping
- Less validation logic
- Smaller teams

**When to use Reactive:**
- Complex forms (multi-step, dynamic)
- Heavy validation
- Advanced patterns
- Testing critical

---

## Basic Setup

### Required Imports

```typescript
// app.module.ts
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class AppModule {}
```

---

## Creating Template-Driven Forms

### 1. **Basic Two-Way Binding**

```typescript
// component.ts
@Component({
  selector: 'app-login',
  template: `
    <form>
      <input [(ngModel)]="email" name="email" type="email">
      <input [(ngModel)]="password" name="password" type="password">
      <button (click)="login()">Login</button>
    </form>
  `
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  login() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}
```

### 2. **Form Reference with Template Variable**

```typescript
// Using #form to get form reference
@Component({
  selector: 'app-form',
  template: `
    <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
      <input name="username" [(ngModel)]="username" required>
      <input name="email" [(ngModel)]="email" type="email" required>
      <button type="submit" [disabled]="!myForm.valid">Submit</button>
    </form>
  `
})
export class FormComponent {
  username: string = '';
  email: string = '';

  onSubmit(form: NgForm) {
    console.log('Form valid:', form.valid);
    console.log('Form value:', form.value);
    console.log('Form touched:', form.touched);
    console.log('Form dirty:', form.dirty);
  }
}
```

### 3. **NgForm Control Reference**

```typescript
// Access individual form controls
@Component({
  selector: 'app-form',
  template: `
    <form #myForm="ngForm">
      <input 
        name="username" 
        [(ngModel)]="username" 
        #username="ngModel"
        required
        minlength="3"
      >
      <div *ngIf="username.invalid && username.touched" class="error">
        <p *ngIf="username.errors?.['required']">Username is required</p>
        <p *ngIf="username.errors?.['minlength']">
          Username must be at least 3 characters
        </p>
      </div>

      <input 
        name="email" 
        [(ngModel)]="email" 
        #email="ngModel"
        type="email"
        required
      >
      <div *ngIf="email.invalid && email.touched" class="error">
        <p *ngIf="email.errors?.['required']">Email is required</p>
        <p *ngIf="email.errors?.['email']">Invalid email format</p>
      </div>

      <button type="submit" [disabled]="myForm.invalid">Submit</button>
    </form>
  `
})
export class FormComponent {
  username: string = '';
  email: string = '';
}
```

---

## Form State and Properties

### Understanding Form State

```typescript
@Component({
  selector: 'app-form-state',
  template: `
    <form #myForm="ngForm">
      <input name="name" [(ngModel)]="name" required>
      <input name="email" [(ngModel)]="email" required>

      <div>
        <p>Form Valid: {{ myForm.valid }}</p>
        <p>Form Invalid: {{ myForm.invalid }}</p>
        <p>Form Touched: {{ myForm.touched }}</p>
        <p>Form Untouched: {{ myForm.untouched }}</p>
        <p>Form Dirty: {{ myForm.dirty }}</p>
        <p>Form Pristine: {{ myForm.pristine }}</p>
        <p>Form Submitted: {{ myForm.submitted }}</p>
      </div>
    </form>
  `
})
export class FormStateComponent {}
```

**Key Properties:**

| Property | Description | Example |
|----------|-------------|---------|
| `valid` | Form passes all validation | `myForm.valid` |
| `invalid` | Form fails validation | `myForm.invalid` |
| `touched` | User has interacted with field | `myForm.touched` |
| `untouched` | User hasn't interacted | `myForm.untouched` |
| `dirty` | User has changed value | `myForm.dirty` |
| `pristine` | User hasn't changed value | `myForm.pristine` |
| `submitted` | Form has been submitted | `myForm.submitted` |
| `value` | Current form data | `myForm.value` |
| `errors` | Validation errors object | `myForm.errors` |

---

## Validation in Template-Driven Forms

### 1. **Built-in Validators**

```typescript
@Component({
  selector: 'app-validation',
  template: `
    <form #myForm="ngForm">
      <!-- Required validation -->
      <input 
        name="name" 
        [(ngModel)]="name" 
        #nameControl="ngModel"
        required
      >
      <span *ngIf="nameControl.errors?.['required']">Name is required</span>

      <!-- Length validation -->
      <input 
        name="username" 
        [(ngModel)]="username" 
        #usernameControl="ngModel"
        minlength="3"
        maxlength="20"
      >
      <span *ngIf="usernameControl.errors?.['minlength']">
        Min 3 characters
      </span>

      <!-- Email validation -->
      <input 
        name="email" 
        [(ngModel)]="email" 
        #emailControl="ngModel"
        type="email"
        required
      >
      <span *ngIf="emailControl.errors?.['email']">Invalid email</span>

      <!-- Number validation -->
      <input 
        name="age" 
        [(ngModel)]="age" 
        #ageControl="ngModel"
        type="number"
        min="18"
        max="100"
      >
      <span *ngIf="ageControl.errors?.['min']">Must be at least 18</span>

      <!-- Pattern validation -->
      <input 
        name="phone" 
        [(ngModel)]="phone" 
        #phoneControl="ngModel"
        pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
      >
      <span *ngIf="phoneControl.errors?.['pattern']">
        Format: 123-456-7890
      </span>
    </form>
  `
})
export class ValidationComponent {}
```

### 2. **Custom Validators**

```typescript
// custom-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validator function
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Async validator
export function asyncNameValidator(nameService: NameService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return nameService.checkName(control.value).pipe(
      debounceTime(300),
      map(exists => exists ? { nameExists: true } : null),
      catchError(() => of(null))
    );
  };
}

// Component using custom validator
@Component({
  selector: 'app-custom-validation',
  template: `
    <form #myForm="ngForm">
      <input 
        name="name" 
        [(ngModel)]="name" 
        #nameControl="ngModel"
        [appForbiddenName]="forbiddenNames"
      >
      <span *ngIf="nameControl.errors?.['forbiddenName']">
        This name is forbidden
      </span>
    </form>
  `
})
export class CustomValidationComponent {
  name: string = '';
  forbiddenNames = /admin|root/i;
}

// Directive-based custom validator
@Directive({
  selector: '[appForbiddenName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ForbiddenNameDirective,
      multi: true
    }
  ]
})
export class ForbiddenNameDirective implements Validator {
  @Input('appForbiddenName') forbiddenNames: RegExp;

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const forbidden = this.forbiddenNames.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  }
}
```

---

## Form Submission and Reset

### 1. **Form Submission**

```typescript
@Component({
  selector: 'app-submit',
  template: `
    <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
      <input name="name" [(ngModel)]="name" required>
      <input name="email" [(ngModel)]="email" type="email" required>
      <button type="submit">Submit</button>
    </form>

    <div *ngIf="submitSuccess" class="success">
      Form submitted successfully!
    </div>
  `
})
export class SubmitComponent {
  name: string = '';
  email: string = '';
  submitSuccess: boolean = false;

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form data:', form.value);
      this.submitSuccess = true;
      
      // Send to server
      this.http.post('/api/form', form.value).subscribe(
        response => {
          console.log('Submitted:', response);
        }
      );
    }
  }
}
```

### 2. **Form Reset**

```typescript
@Component({
  selector: 'app-reset',
  template: `
    <form #myForm="ngForm">
      <input name="name" [(ngModel)]="name" required>
      <input name="email" [(ngModel)]="email" type="email" required>
      
      <button type="submit">Submit</button>
      <button type="button" (click)="resetForm(myForm)">Reset</button>
    </form>
  `
})
export class ResetComponent {
  name: string = '';
  email: string = '';

  resetForm(form: NgForm) {
    form.reset(); // Clears form and resets pristine/untouched state
  }

  // Or reset with specific values
  resetFormWithValues(form: NgForm) {
    form.reset({
      name: 'Default Name',
      email: 'default@example.com'
    });
  }
}
```

---

## Advanced Patterns

### 1. **Nested Form Groups (Using ngModelGroup)**

```typescript
@Component({
  selector: 'app-nested-forms',
  template: `
    <form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
      <!-- Personal Info Group -->
      <fieldset>
        <legend>Personal Information</legend>
        <div ngModelGroup="personal">
          <input 
            name="firstName" 
            [(ngModel)]="firstName" 
            placeholder="First Name"
            required
          >
          <input 
            name="lastName" 
            [(ngModel)]="lastName" 
            placeholder="Last Name"
            required
          >
        </div>
      </fieldset>

      <!-- Address Group -->
      <fieldset>
        <legend>Address</legend>
        <div ngModelGroup="address">
          <input 
            name="street" 
            [(ngModel)]="street" 
            placeholder="Street"
            required
          >
          <input 
            name="city" 
            [(ngModel)]="city" 
            placeholder="City"
            required
          >
          <input 
            name="zip" 
            [(ngModel)]="zip" 
            placeholder="Zip Code"
            required
          >
        </div>
      </fieldset>

      <button type="submit" [disabled]="!myForm.valid">Submit</button>
    </form>
  `
})
export class NestedFormsComponent {
  firstName: string = '';
  lastName: string = '';
  street: string = '';
  city: string = '';
  zip: string = '';

  onSubmit(form: NgForm) {
    console.log(form.value);
    // Output:
    // {
    //   personal: { firstName: '', lastName: '' },
    //   address: { street: '', city: '', zip: '' }
    // }
  }
}
```

### 2. **Dynamic Form Fields**

```typescript
@Component({
  selector: 'app-dynamic-fields',
  template: `
    <form #myForm="ngForm">
      <input name="name" [(ngModel)]="name" required>
      
      <!-- Dynamic fields -->
      <div *ngFor="let field of dynamicFields; let i = index">
        <input 
          [name]="'field_' + i"
          [(ngModel)]="field.value"
          [placeholder]="field.placeholder"
        >
        <button (click)="removeField(i)">Remove</button>
      </div>

      <button type="button" (click)="addField()">Add Field</button>
      <button type="submit" [disabled]="!myForm.valid">Submit</button>
    </form>
  `
})
export class DynamicFieldsComponent {
  name: string = '';
  dynamicFields: { value: string; placeholder: string }[] = [];

  addField() {
    this.dynamicFields.push({
      value: '',
      placeholder: `Field ${this.dynamicFields.length + 1}`
    });
  }

  removeField(index: number) {
    this.dynamicFields.splice(index, 1);
  }
}
```

### 3. **Conditional Fields**

```typescript
@Component({
  selector: 'app-conditional-fields',
  template: `
    <form #myForm="ngForm">
      <select name="userType" [(ngModel)]="userType" required>
        <option value="">Select Type</option>
        <option value="individual">Individual</option>
        <option value="business">Business</option>
      </select>

      <!-- Show for individuals -->
      <div *ngIf="userType === 'individual'">
        <input name="ssn" [(ngModel)]="ssn" placeholder="SSN">
      </div>

      <!-- Show for businesses -->
      <div *ngIf="userType === 'business'">
        <input name="ein" [(ngModel)]="ein" placeholder="EIN">
        <input name="companyName" [(ngModel)]="companyName" placeholder="Company">
      </div>

      <button type="submit">Submit</button>
    </form>
  `
})
export class ConditionalFieldsComponent {
  userType: string = '';
  ssn: string = '';
  ein: string = '';
  companyName: string = '';
}
```

---

## Form Events

### Available Events

```typescript
@Component({
  selector: 'app-form-events',
  template: `
    <form #myForm="ngForm" 
          (ngSubmit)="onSubmit(myForm)"
          (reset)="onReset()">
      
      <input 
        name="name"
        [(ngModel)]="name"
        (change)="onFieldChange('name', $event)"
        (blur)="onFieldBlur('name')"
        (focus)="onFieldFocus('name')"
        (input)="onFieldInput('name', $event)"
      >

      <p>Current value: {{ name }}</p>
      <p>Last event: {{ lastEvent }}</p>

      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  `
})
export class FormEventsComponent {
  name: string = '';
  lastEvent: string = '';

  onFieldChange(fieldName: string, event: Event) {
    this.lastEvent = `Change on ${fieldName}`;
  }

  onFieldBlur(fieldName: string) {
    this.lastEvent = `Blur on ${fieldName}`;
  }

  onFieldFocus(fieldName: string) {
    this.lastEvent = `Focus on ${fieldName}`;
  }

  onFieldInput(fieldName: string, event: Event) {
    this.lastEvent = `Input on ${fieldName}`;
  }

  onSubmit(form: NgForm) {
    this.lastEvent = 'Form submitted';
  }

  onReset() {
    this.lastEvent = 'Form reset';
  }
}
```

---

## Best Practices

1. **Always use form reference**
   - Use `#form="ngForm"` to access form state

2. **Show errors only after interaction**
   - Check `touched` or `dirty` before showing errors

3. **Disable submit until valid**
   - `[disabled]="!form.valid"`

4. **Use meaningful names**
   - `name` attribute must match variable name

5. **Group related fields**
   - Use `ngModelGroup` for organization

6. **Clear validation messages**
   - Show specific error messages for each validation

7. **Handle submission properly**
   - Use `(ngSubmit)` on form, not click on button

8. **Reset forms completely**
   - Use `form.reset()` to reset touched/pristine states

---

## Comparison with Reactive Forms

### Template-Driven Example
```typescript
@Component({
  template: `
    <form #form="ngForm" (ngSubmit)="submit(form)">
      <input name="name" [(ngModel)]="name" required>
      <button [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class TemplateFormComponent {
  name: string = '';
  
  submit(form: NgForm) {
    console.log(form.value);
  }
}
```

### Reactive Forms Equivalent
```typescript
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="name">
      <button [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class ReactiveFormComponent {
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      name: ['', Validators.required]
    });
  }

  submit() {
    console.log(this.form.value);
  }
}
```

---

## Summary

Template-driven forms are ideal for:
- Simple, straightforward forms
- Quick prototyping
- Forms with minimal custom logic
- Teams new to Angular

Key concepts:
1. Use `[(ngModel)]` for two-way binding
2. Reference form with `#form="ngForm"`
3. Access controls with `#control="ngModel"`
4. Validate with built-in or custom validators
5. Show errors conditionally based on state
6. Use `(ngSubmit)` for form submission
7. Reset with `form.reset()`

For more complex scenarios or better testability, consider Reactive Forms instead.
