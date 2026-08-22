/**
 * Two-Way Binding Examples
 * ngModel and custom two-way binding
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

// ============================================================
// EXAMPLE 1: Basic ngModel
// ============================================================

@Component({
  selector: 'app-basic-ngmodel',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <input [(ngModel)]="username" placeholder="Username" />
      <p>You entered: {{ username }}</p>
    </div>
  `
})
export class BasicNgModelComponent {
  username = '';
}

// ============================================================
// EXAMPLE 2: ngModel with Different Input Types
// ============================================================

@Component({
  selector: 'app-ngmodel-types',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <!-- Text -->
      <input [(ngModel)]="text" placeholder="Text" />
      <p>Text: {{ text }}</p>
      
      <!-- Number -->
      <input type="number" [(ngModel)]="age" />
      <p>Age: {{ age }}</p>
      
      <!-- Checkbox -->
      <input type="checkbox" [(ngModel)]="agree" />
      <label>I agree</label>
      <p>Agreed: {{ agree }}</p>
      
      <!-- Radio -->
      <label>
        <input type="radio" name="color" value="red" [(ngModel)]="selectedColor" />
        Red
      </label>
      <label>
        <input type="radio" name="color" value="blue" [(ngModel)]="selectedColor" />
        Blue
      </label>
      <p>Color: {{ selectedColor }}</p>
      
      <!-- Textarea -->
      <textarea [(ngModel)]="message"></textarea>
      <p>Message: {{ message }}</p>
    </div>
  `
})
export class NgModelTypesComponent {
  text = '';
  age = 0;
  agree = false;
  selectedColor = 'red';
  message = '';
}

// ============================================================
// EXAMPLE 3: ngModel with Form
// ============================================================

@Component({
  selector: 'app-form-ngmodel',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <div>
        <label>First Name:</label>
        <input [(ngModel)]="formData.firstName" name="firstName" />
      </div>
      
      <div>
        <label>Last Name:</label>
        <input [(ngModel)]="formData.lastName" name="lastName" />
      </div>
      
      <div>
        <label>Email:</label>
        <input type="email" [(ngModel)]="formData.email" name="email" />
      </div>
      
      <div>
        <label>Message:</label>
        <textarea [(ngModel)]="formData.message" name="message"></textarea>
      </div>
      
      <button type="submit">Submit</button>
    </form>
    
    <div *ngIf="submitted">
      <h3>Submitted Data:</h3>
      <pre>{{ formData | json }}</pre>
    </div>
  `
})
export class FormNgModelComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  };
  submitted = false;

  onSubmit() {
    this.submitted = true;
    console.log('Form data:', this.formData);
  }
}

// ============================================================
// EXAMPLE 4: ngModelGroup - Form Grouping
// ============================================================

@Component({
  selector: 'app-ngmodel-group',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <fieldset ngModelGroup="personal">
        <legend>Personal Info</legend>
        <input [(ngModel)]="user.personal.name" name="name" placeholder="Name" />
        <input [(ngModel)]="user.personal.email" name="email" placeholder="Email" />
      </fieldset>
      
      <fieldset ngModelGroup="address">
        <legend>Address</legend>
        <input [(ngModel)]="user.address.street" name="street" placeholder="Street" />
        <input [(ngModel)]="user.address.city" name="city" placeholder="City" />
      </fieldset>
      
      <button type="submit">Submit</button>
    </form>
  `
})
export class NgModelGroupComponent {
  user = {
    personal: { name: '', email: '' },
    address: { street: '', city: '' }
  };

  onSubmit() {
    console.log('User data:', this.user);
  }
}

// ============================================================
// EXAMPLE 5: ngModelChange Event
// ============================================================

@Component({
  selector: 'app-ngmodel-change',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <input
        [(ngModel)]="username"
        (ngModelChange)="onUserNameChange($event)"
        placeholder="Username" />
      
      <p>Username: {{ username }}</p>
      <p>Change log:</p>
      <ul>
        <li *ngFor="let log of changeLog">{{ log }}</li>
      </ul>
    </div>
  `
})
export class NgModelChangeComponent {
  username = '';
  changeLog: string[] = [];

  onUserNameChange(newValue: string) {
    this.changeLog.push(`Changed to: ${newValue} at ${new Date().toLocaleTimeString()}`);
  }
}

// ============================================================
// EXAMPLE 6: Select Dropdown with ngModel
// ============================================================

@Component({
  selector: 'app-select-ngmodel',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <!-- Simple select -->
      <select [(ngModel)]="selectedCountry">
        <option value="">Select a country</option>
        <option value="usa">USA</option>
        <option value="canada">Canada</option>
        <option value="mexico">Mexico</option>
      </select>
      <p>Selected: {{ selectedCountry }}</p>
      
      <!-- Select with objects -->
      <select [(ngModel)]="selectedUser">
        <option *ngFor="let user of users" [ngValue]="user">
          {{ user.name }}
        </option>
      </select>
      <p *ngIf="selectedUser">
        Selected User ID: {{ selectedUser.id }}
      </p>
    </div>
  `
})
export class SelectNgModelComponent {
  selectedCountry = '';
  selectedUser: any = null;
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
}

// ============================================================
// EXAMPLE 7: Custom Two-Way Binding Component
// ============================================================

@Component({
  selector: 'app-custom-counter',
  template: `
    <div>
      <button (click)="decrease()">-</button>
      <span>{{ count }}</span>
      <button (click)="increase()">+</button>
    </div>
  `
})
export class CustomCounterComponent {
  @Input() count: number = 0;
  @Output() countChange = new EventEmitter<number>();

  increase() {
    this.count++;
    this.countChange.emit(this.count);
  }

  decrease() {
    this.count--;
    this.countChange.emit(this.count);
  }
}

// ============================================================
// EXAMPLE 8: Using Custom Two-Way Binding
// ============================================================

@Component({
  selector: 'app-custom-binding-usage',
  template: `
    <div>
      <!-- Explicit syntax -->
      <app-custom-counter
        [count]="myCount"
        (countChange)="myCount = $event">
      </app-custom-counter>
      
      <!-- Two-way binding -->
      <app-custom-counter [(count)]="myCount"></app-custom-counter>
      
      <p>Current count: {{ myCount }}</p>
    </div>
  `,
  standalone: true,
  imports: [CustomCounterComponent]
})
export class CustomBindingUsageComponent {
  myCount = 0;
}

// ============================================================
// EXAMPLE 9: ngModel with Validation
// ============================================================

@Component({
  selector: 'app-ngmodel-validation',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <input
        [(ngModel)]="email"
        (ngModelChange)="validateEmail($event)"
        placeholder="Email" />
      
      <p *ngIf="!isValidEmail && email" class="error">
        Invalid email format
      </p>
      
      <button [disabled]="!isValidEmail">Submit</button>
    </div>
  `
})
export class NgModelValidationComponent {
  email = '';
  isValidEmail = false;

  validateEmail(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isValidEmail = emailRegex.test(value);
  }
}

// ============================================================
// EXAMPLE 10: Multiple Inputs with ngModel
// ============================================================

@Component({
  selector: 'app-multi-inputs',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <h3>User Registration</h3>
      
      <input [(ngModel)]="user.username" placeholder="Username" />
      <input type="email" [(ngModel)]="user.email" placeholder="Email" />
      <input type="password" [(ngModel)]="user.password" placeholder="Password" />
      <input type="password" [(ngModel)]="user.confirmPassword" placeholder="Confirm Password" />
      
      <label>
        <input type="checkbox" [(ngModel)]="user.agreeToTerms" />
        I agree to terms
      </label>
      
      <button (click)="register()">Register</button>
      
      <p *ngIf="registered">Registration successful!</p>
    </div>
  `
})
export class MultiInputsComponent {
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  };
  registered = false;

  register() {
    if (this.user.password === this.user.confirmPassword && this.user.agreeToTerms) {
      this.registered = true;
      console.log('User registered:', this.user.username);
    }
  }
}

// ============================================================
// EXAMPLE 11: ngModel with Getters/Setters
// ============================================================

@Component({
  selector: 'app-ngmodel-getters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <input [(ngModel)]="name" placeholder="Name" />
      <p>Capitalized: {{ capitalizedName }}</p>
      <p>Length: {{ name.length }}</p>
    </div>
  `
})
export class NgModelGettersComponent {
  private _name = '';

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get capitalizedName(): string {
    return this._name.toUpperCase();
  }
}

// ============================================================
// EXAMPLE 12: Reset Form with ngModel
// ============================================================

@Component({
  selector: 'app-form-reset',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="formData.name" name="name" placeholder="Name" />
      <input [(ngModel)]="formData.email" name="email" placeholder="Email" />
      
      <button type="submit">Submit</button>
      <button type="button" (click)="resetForm()">Reset</button>
    </form>
    
    <p *ngIf="submitted">Form submitted successfully!</p>
  `
})
export class FormResetComponent {
  formData = { name: '', email: '' };
  submitted = false;
  originalData = { name: '', email: '' };

  onSubmit() {
    this.submitted = true;
    console.log('Submitted:', this.formData);
  }

  resetForm() {
    this.formData = { ...this.originalData };
    this.submitted = false;
  }
}

// ============================================================
// Summary: Two-Way Binding Best Practices
// ============================================================

/**
 * ✅ DO:
 * - Use FormsModule for ngModel
 * - Use name attribute on form elements
 * - Use ngModelGroup for grouped fields
 * - Validate on (ngModelChange)
 * - Create custom two-way binding for custom components
 *
 * ❌ DON'T:
 * - Forget to import FormsModule
 * - Use ngModel without name in forms
 * - Put complex logic in templates
 * - Use ngModel for complex forms (use ReactiveFormsModule)
 * - Forget to handle null/undefined
 */
