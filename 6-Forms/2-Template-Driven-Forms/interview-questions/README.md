# Template-Driven Forms Interview Questions

## Beginner Level

### Q1: What is a template-driven form and how does it differ from reactive forms?

**Answer:**

**Template-Driven Forms:**
- Form logic lives in the template
- Uses `[(ngModel)]` for two-way binding
- Angular creates the form model automatically
- Simpler syntax, less code
- Better for simple forms

**Reactive Forms:**
- Form logic lives in the component code
- Uses `FormBuilder` and `FormGroup`
- You create the form model explicitly
- More control, more verbose
- Better for complex forms

**Quick Comparison:**

```typescript
// Template-Driven
@Component({
  template: `
    <form #form="ngForm" (ngSubmit)="submit(form)">
      <input name="email" [(ngModel)]="email" required>
      <button [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class TemplateComponent {
  email: string = '';
}

// Reactive Equivalent
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="email">
      <button [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class ReactiveComponent {
  form: FormGroup = this.fb.group({
    email: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}
}
```

**When to use each:**

| Scenario | Template-Driven | Reactive |
|----------|-----------------|----------|
| Simple login form | ✅ Yes | ⚠️ Overkill |
| Multi-step form | ❌ No | ✅ Yes |
| Quick prototype | ✅ Yes | ❌ Slower |
| Complex validation | ❌ Difficult | ✅ Easy |
| Unit testing | ❌ Hard | ✅ Easy |
| Dynamic fields | ❌ Difficult | ✅ Easy |

---

### Q2: How do you create a simple template-driven form?

**Answer:**

```typescript
// Step 1: Import FormsModule in module
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule]
})
export class AppModule {}

// Step 2: Create form in template
@Component({
  selector: 'app-login',
  template: `
    <form #form="ngForm" (ngSubmit)="onSubmit(form)">
      <!-- Input with two-way binding -->
      <input
        name="email"
        [(ngModel)]="email"
        type="email"
        required
      >

      <!-- Submit button -->
      <button type="submit" [disabled]="!form.valid">
        Login
      </button>
    </form>
  `
})
export class LoginComponent {
  email: string = '';

  onSubmit(form: NgForm) {
    console.log(form.value); // { email: '...' }
  }
}
```

**Key parts:**
1. `#form="ngForm"` - Get form reference
2. `[(ngModel)]="email"` - Two-way binding
3. `name="email"` - Field name (required!)
4. `(ngSubmit)="onSubmit(form)"` - Handle submission
5. `form.valid` - Check if form is valid

---

### Q3: What does `[(ngModel)]` do?

**Answer:**

`[(ngModel)]` is two-way data binding. It's a combination of:
- `[ngModel]` - Property binding (component → template)
- `(ngModelChange)` - Event binding (template → component)

```typescript
// These are equivalent:
[(ngModel)]="email"

// Is the same as:
[ngModel]="email" (ngModelChange)="email = $event"

// Real-world example:
@Component({
  template: `
    <input [(ngModel)]="email" name="email">
    <p>Email: {{ email }}</p>
  `
})
export class Component {
  email: string = '';
}

// When user types "john@example.com":
// 1. Template binding updates component: email = "john@example.com"
// 2. Display updates: shows "Email: john@example.com"
// 3. If code changes email: template updates automatically
```

**Important:** Every `[(ngModel)]` field MUST have a `name` attribute:

```typescript
// ❌ Wrong - no name attribute
<input [(ngModel)]="email">

// ✅ Correct
<input [(ngModel)]="email" name="email">
```

---

### Q4: How do you access form controls in a template-driven form?

**Answer:**

**Method 1: Using form reference**
```typescript
@Component({
  template: `
    <form #form="ngForm">
      <input name="email" [(ngModel)]="email" required>
      <button [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class Component {
  @ViewChild('form') form!: NgForm;
}
```

**Method 2: Using control reference**
```typescript
@Component({
  template: `
    <form>
      <input
        name="email"
        [(ngModel)]="email"
        #emailControl="ngModel"
        required
      >
      <div *ngIf="emailControl.invalid && emailControl.touched">
        Email is invalid
      </div>
    </form>
  `
})
export class Component {
  email: string = '';
}
```

**Method 3: Access in component**
```typescript
@Component({
  template: `
    <form #form="ngForm">
      <input name="email" [(ngModel)]="email">
      <button (click)="checkForm()">Check</button>
    </form>
  `
})
export class Component {
  @ViewChild('form') form!: NgForm;

  checkForm() {
    console.log(this.form.value);        // { email: '...' }
    console.log(this.form.valid);        // true/false
    console.log(this.form.get('email')); // Get email control
  }
}
```

---

### Q5: What are the form and control states in template-driven forms?

**Answer:**

**Form States:**

| State | Description | Use Case |
|-------|-------------|----------|
| `valid` | All controls pass validation | Disable submit button |
| `invalid` | At least one control fails | Show error message |
| `touched` | User has focused a field | Show validation errors |
| `untouched` | User hasn't focused any field | Hide validation messages |
| `dirty` | User has changed a value | Show "unsaved changes" |
| `pristine` | User hasn't changed anything | Enable reset button |
| `submitted` | Form has been submitted | Show submission feedback |

**Example:**
```typescript
@Component({
  template: `
    <form #form="ngForm" (ngSubmit)="submit(form)">
      <input name="name" [(ngModel)]="name" required>

      <!-- Show error only after user touches field -->
      <div *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
        Name is required
      </div>

      <!-- Show unsaved warning -->
      <div *ngIf="form.dirty && !form.submitted">
        You have unsaved changes
      </div>

      <!-- Disable submit if form invalid -->
      <button [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class Component {
  name: string = '';

  submit(form: NgForm) {
    if (form.valid) {
      // Form is valid and submitted
    }
  }
}
```

---

## Intermediate Level

### Q6: How do you validate template-driven forms?

**Answer:**

**1. Built-in Validators**
```typescript
<input
  name="email"
  [(ngModel)]="email"
  type="email"      <!-- Email format -->
  required          <!-- Required -->
  minlength="5"     <!-- Minimum length -->
  maxlength="50"    <!-- Maximum length -->
  pattern="[a-z]"   <!-- Regex pattern -->
  min="0"           <!-- Minimum value (number) -->
  max="100"         <!-- Maximum value (number) -->
>
```

**2. Showing Errors**
```typescript
@Component({
  template: `
    <input
      name="email"
      [(ngModel)]="email"
      #emailCtrl="ngModel"
      type="email"
      required
      minlength="5"
    >

    <!-- Show errors for invalid/touched field -->
    <div *ngIf="emailCtrl.invalid && emailCtrl.touched" class="error">
      <p *ngIf="emailCtrl.errors?.['required']">Email is required</p>
      <p *ngIf="emailCtrl.errors?.['email']">Invalid email format</p>
      <p *ngIf="emailCtrl.errors?.['minlength']">Minimum 5 characters</p>
    </div>
  `
})
export class Component {}
```

**3. Custom Validators with Directive**
```typescript
// custom-validator.directive.ts
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appNoSpaces]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: NoSpacesDirective,
    multi: true
  }]
})
export class NoSpacesDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const hasSpaces = /\s/.test(control.value);
    return hasSpaces ? { noSpaces: true } : null;
  }
}

// Usage
@Component({
  template: `
    <input
      name="username"
      [(ngModel)]="username"
      appNoSpaces
    >
  `
})
export class Component {}
```

---

### Q7: How do you handle form submission in template-driven forms?

**Answer:**

```typescript
@Component({
  selector: 'app-form',
  template: `
    <form #form="ngForm" (ngSubmit)="onSubmit(form)">
      <input name="name" [(ngModel)]="name" required>
      <input name="email" [(ngModel)]="email" type="email" required>

      <!-- Use ngSubmit on form, not click on button -->
      <button type="submit" [disabled]="!form.valid">Submit</button>

      <!-- Show success message -->
      <div *ngIf="successMessage" class="success">
        {{ successMessage }}
      </div>

      <!-- Show error message -->
      <div *ngIf="errorMessage" class="error">
        {{ errorMessage }}
      </div>
    </form>
  `
})
export class FormComponent {
  name: string = '';
  email: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    // Check if form is valid
    if (!form.valid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    // Reset messages
    this.successMessage = '';
    this.errorMessage = '';

    // Send to server
    this.http.post('/api/form', form.value).subscribe(
      (response) => {
        this.successMessage = 'Form submitted successfully!';
        form.reset(); // Clear form
      },
      (error) => {
        this.errorMessage = 'Error submitting form';
      }
    );
  }
}
```

**Key points:**
1. Use `(ngSubmit)` on `<form>`, not `(click)` on button
2. Type attribute must be `submit`
3. Check `form.valid` before processing
4. Use `form.value` to get form data
5. Use `form.reset()` to clear form

---

### Q8: How do you reset a template-driven form?

**Answer:**

```typescript
@Component({
  template: `
    <form #form="ngForm">
      <input name="name" [(ngModel)]="name">
      <input name="email" [(ngModel)]="email">

      <!-- Reset button -->
      <button type="button" (click)="resetForm(form)">
        Reset
      </button>
    </form>
  `
})
export class Component {
  name: string = '';
  email: string = '';

  // Option 1: Simple reset
  resetForm(form: NgForm) {
    form.reset();
  }

  // Option 2: Reset with specific values
  resetFormWithValues(form: NgForm) {
    form.reset({
      name: 'Default Name',
      email: 'default@example.com'
    });
  }

  // Option 3: Reset individual fields
  resetField(form: NgForm) {
    form.get('name')?.reset();
  }
}
```

**What `form.reset()` does:**
1. Clears all values to `null`
2. Resets `dirty` to `false`
3. Resets `touched` to `false`
4. Resets `valid`/`invalid` states

---

### Q9: How do you create nested form groups in template-driven forms?

**Answer:**

```typescript
@Component({
  selector: 'app-nested-form',
  template: `
    <form #form="ngForm" (ngSubmit)="submit(form)">
      <!-- Personal group -->
      <h3>Personal Info</h3>
      <div ngModelGroup="personal">
        <input name="firstName" [(ngModel)]="firstName" required>
        <input name="lastName" [(ngModel)]="lastName" required>
      </div>

      <!-- Address group -->
      <h3>Address</h3>
      <div ngModelGroup="address">
        <input name="street" [(ngModel)]="street" required>
        <input name="city" [(ngModel)]="city" required>
        <input name="zip" [(ngModel)]="zip" required>
      </div>

      <button type="submit" [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class Component {
  firstName: string = '';
  lastName: string = '';
  street: string = '';
  city: string = '';
  zip: string = '';

  submit(form: NgForm) {
    console.log(form.value);
    // Output:
    // {
    //   personal: { firstName: '', lastName: '' },
    //   address: { street: '', city: '', zip: '' }
    // }
  }
}
```

**Benefits:**
- Organized form structure
- Easier to manage related fields
- Cleaner form data object

---

### Q10: How do you handle conditional fields in template-driven forms?

**Answer:**

```typescript
@Component({
  selector: 'app-conditional-form',
  template: `
    <form #form="ngForm">
      <!-- Type selection -->
      <select name="userType" [(ngModel)]="userType">
        <option value="individual">Individual</option>
        <option value="business">Business</option>
      </select>

      <!-- Common field -->
      <input name="name" [(ngModel)]="name" required>

      <!-- Show only for individuals -->
      <div *ngIf="userType === 'individual'">
        <input name="ssn" [(ngModel)]="ssn" placeholder="Social Security Number">
      </div>

      <!-- Show only for businesses -->
      <div *ngIf="userType === 'business'">
        <input name="ein" [(ngModel)]="ein" placeholder="EIN">
        <input name="companyName" [(ngModel)]="companyName" placeholder="Company Name">
      </div>

      <button type="submit" [disabled]="!form.valid">Submit</button>
    </form>
  `
})
export class Component {
  userType: string = 'individual';
  name: string = '';
  ssn: string = '';
  ein: string = '';
  companyName: string = '';
}
```

---

## Advanced Level

### Q11: How do you implement async validators in template-driven forms?

**Answer:**

```typescript
// async-validator.directive.ts
import { Directive, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, first } from 'rxjs/operators';

@Directive({
  selector: '[appUniqueName]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: UniqueNameDirective,
    multi: true
  }]
})
export class UniqueNameDirective implements Validator {
  constructor(private nameService: NameService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }

    return control.valueChanges.pipe(
      debounceTime(500),
      first(),
      map(value => {
        return this.nameService.checkName(value);
      }),
      map(exists => exists ? { nameExists: true } : null),
      catchError(() => of(null))
    );
  }
}

// Usage
@Component({
  template: `
    <form #form="ngForm">
      <input
        name="username"
        [(ngModel)]="username"
        appUniqueName
        #usernameCtrl="ngModel"
      >

      <!-- Show pending validation -->
      <div *ngIf="usernameCtrl.pending">Checking availability...</div>

      <!-- Show error -->
      <div *ngIf="usernameCtrl.errors?.['nameExists']">
        This name is already taken
      </div>
    </form>
  `
})
export class Component {
  username: string = '';
}
```

---

### Q12: How do you compare form-driven approaches?

**Answer:**

**Template-Driven Pros:**
- Simpler syntax
- Less boilerplate
- Easier learning curve
- Good for simple forms

**Template-Driven Cons:**
- Harder to test
- Limited validation options
- Difficult for dynamic forms
- Logic scattered in template

**When to refactor to Reactive:**
- Form has complex validation
- Need dynamic form generation
- Unit testing is critical
- Multiple related forms

---

## Summary

**Key Concepts:**
1. `[(ngModel)]` creates two-way binding
2. `#form="ngForm"` gets form reference
3. Form states: valid, touched, dirty, submitted
4. Built-in validators work with directives
5. Custom validators via directives
6. Nested groups with `ngModelGroup`
7. Conditional fields with `*ngIf`
8. Async validators check server-side rules

**Best Practices:**
1. Every input needs a `name` attribute
2. Show errors only after field touched
3. Disable submit until form valid
4. Use `form.reset()` to clear form
5. Handle submission with `(ngSubmit)`
6. Use `form.value` for form data
7. Group related fields logically
8. Keep templates clean and readable

**When to use Template-Driven:**
- Simple to moderate complexity
- Quick prototyping
- Less validation logic
- Small teams

**When to use Reactive:**
- Complex validation rules
- Dynamic form generation
- Heavy unit testing
- Enterprise applications
