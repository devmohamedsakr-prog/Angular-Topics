/**
 * Template-Driven Forms Examples for Angular
 * Demonstrates various patterns and validation techniques
 */

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// ============================================================================
// EXAMPLE 1: Simple Login Form
// ============================================================================

@Component({
  selector: 'app-login-form',
  template: `
    <div class="form-container">
      <h2>Login</h2>
      <form #loginForm="ngForm" (ngSubmit)="onLogin(loginForm)">
        <!-- Email Field -->
        <div class="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            [(ngModel)]="email"
            #emailControl="ngModel"
            required
            email
            placeholder="Enter your email"
          >
          <div *ngIf="emailControl.invalid && emailControl.touched" class="error">
            <p *ngIf="emailControl.errors?.['required']">Email is required</p>
            <p *ngIf="emailControl.errors?.['email']">Please enter a valid email</p>
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            [(ngModel)]="password"
            #passwordControl="ngModel"
            required
            minlength="6"
            placeholder="Enter your password"
          >
          <div *ngIf="passwordControl.invalid && passwordControl.touched" class="error">
            <p *ngIf="passwordControl.errors?.['required']">Password is required</p>
            <p *ngIf="passwordControl.errors?.['minlength']">
              Password must be at least 6 characters
            </p>
          </div>
        </div>

        <!-- Remember Me -->
        <div class="form-group">
          <label>
            <input
              type="checkbox"
              name="rememberMe"
              [(ngModel)]="rememberMe"
            >
            Remember me
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="!loginForm.valid"
          class="btn-primary"
        >
          Login
        </button>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 15px;
    }
    .error {
      color: red;
      font-size: 0.9em;
    }
    .error-message {
      color: red;
      margin-top: 10px;
    }
    .success-message {
      color: green;
      margin-top: 10px;
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  onLogin(form: NgForm) {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.valid) {
      const credentials = {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe
      };

      this.http.post('/api/login', credentials).subscribe(
        (response: any) => {
          this.successMessage = 'Login successful!';
          this.email = '';
          this.password = '';
          form.reset();
        },
        (error) => {
          this.errorMessage = 'Invalid email or password';
        }
      );
    }
  }
}

// ============================================================================
// EXAMPLE 2: Registration Form with Validation
// ============================================================================

@Component({
  selector: 'app-registration-form',
  template: `
    <div class="form-container">
      <h2>Register</h2>
      <form #regForm="ngForm" (ngSubmit)="onRegister(regForm)">
        <!-- Username -->
        <div class="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            [(ngModel)]="username"
            #usernameCtrl="ngModel"
            required
            minlength="3"
            maxlength="20"
            pattern="^[a-zA-Z0-9_-]+$"
          >
          <div *ngIf="usernameCtrl.invalid && usernameCtrl.touched" class="error">
            <p *ngIf="usernameCtrl.errors?.['required']">Username required</p>
            <p *ngIf="usernameCtrl.errors?.['minlength']">Min 3 characters</p>
            <p *ngIf="usernameCtrl.errors?.['maxlength']">Max 20 characters</p>
            <p *ngIf="usernameCtrl.errors?.['pattern']">Only alphanumeric, dash, underscore</p>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            [(ngModel)]="email"
            #emailCtrl="ngModel"
            required
            email
          >
          <div *ngIf="emailCtrl.invalid && emailCtrl.touched" class="error">
            <p *ngIf="emailCtrl.errors?.['required']">Email required</p>
            <p *ngIf="emailCtrl.errors?.['email']">Invalid email</p>
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            [(ngModel)]="password"
            #passwordCtrl="ngModel"
            required
            minlength="8"
            (change)="onPasswordChange()"
          >
          <div *ngIf="passwordCtrl.invalid && passwordCtrl.touched" class="error">
            <p *ngIf="passwordCtrl.errors?.['required']">Password required</p>
            <p *ngIf="passwordCtrl.errors?.['minlength']">Min 8 characters</p>
          </div>
          <div class="password-strength" *ngIf="password">
            <span [ngClass]="getPasswordStrengthClass()">
              {{ getPasswordStrength() }}
            </span>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            [(ngModel)]="confirmPassword"
            #confirmCtrl="ngModel"
            required
          >
          <div *ngIf="confirmCtrl.touched && password !== confirmPassword" class="error">
            <p>Passwords must match</p>
          </div>
        </div>

        <!-- Age -->
        <div class="form-group">
          <label>Age:</label>
          <input
            type="number"
            name="age"
            [(ngModel)]="age"
            #ageCtrl="ngModel"
            min="18"
            max="120"
          >
          <div *ngIf="ageCtrl.invalid && ageCtrl.touched" class="error">
            <p *ngIf="ageCtrl.errors?.['min']">Must be at least 18</p>
            <p *ngIf="ageCtrl.errors?.['max']">Must be 120 or less</p>
          </div>
        </div>

        <!-- Terms -->
        <div class="form-group">
          <label>
            <input
              type="checkbox"
              name="agreeTerms"
              [(ngModel)]="agreeTerms"
              #termsCtrl="ngModel"
              required
            >
            I agree to terms and conditions
          </label>
          <div *ngIf="termsCtrl.invalid && termsCtrl.touched" class="error">
            <p>You must agree to continue</p>
          </div>
        </div>

        <!-- Submit -->
        <button type="submit" [disabled]="!regForm.valid">Register</button>
        <button type="reset" (click)="resetForm(regForm)">Clear</button>
      </form>
    </div>
  `
})
export class RegistrationFormComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  age: number | null = null;
  agreeTerms: boolean = false;

  getPasswordStrength(): string {
    if (!this.password) return '';
    if (this.password.length < 8) return 'Weak';
    if (this.password.length < 12) return 'Medium';
    if (/[A-Z]/.test(this.password) && /[0-9]/.test(this.password)) return 'Strong';
    return 'Medium';
  }

  getPasswordStrengthClass(): any {
    const strength = this.getPasswordStrength();
    return {
      'strength-weak': strength === 'Weak',
      'strength-medium': strength === 'Medium',
      'strength-strong': strength === 'Strong'
    };
  }

  onPasswordChange() {
    // Trigger password strength calculation
  }

  resetForm(form: NgForm) {
    form.reset();
  }

  onRegister(form: NgForm) {
    if (form.valid && this.password === this.confirmPassword) {
      console.log('Registration data:', form.value);
    }
  }
}

// ============================================================================
// EXAMPLE 3: Nested Form Groups
// ============================================================================

@Component({
  selector: 'app-nested-form',
  template: `
    <form #profileForm="ngForm" (ngSubmit)="onSubmit(profileForm)">
      <h3>Personal Information</h3>
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

      <h3>Address</h3>
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
          name="state"
          [(ngModel)]="state"
          placeholder="State"
          required
        >
        <input
          name="zip"
          [(ngModel)]="zip"
          placeholder="Zip Code"
          required
        >
      </div>

      <h3>Contact</h3>
      <div ngModelGroup="contact">
        <input
          name="phone"
          [(ngModel)]="phone"
          placeholder="Phone"
          required
        >
        <input
          name="website"
          [(ngModel)]="website"
          placeholder="Website"
          type="url"
        >
      </div>

      <button type="submit" [disabled]="!profileForm.valid">
        Save Profile
      </button>

      <p *ngIf="profileForm.valid">
        Form Data: {{ profileForm.value | json }}
      </p>
    </form>
  `
})
export class NestedFormComponent {
  firstName: string = '';
  lastName: string = '';
  street: string = '';
  city: string = '';
  state: string = '';
  zip: string = '';
  phone: string = '';
  website: string = '';

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Profile data:', form.value);
      // Output structure:
      // {
      //   personal: { firstName, lastName },
      //   address: { street, city, state, zip },
      //   contact: { phone, website }
      // }
    }
  }
}

// ============================================================================
// EXAMPLE 4: Dynamic Form Fields
// ============================================================================

@Component({
  selector: 'app-dynamic-form',
  template: `
    <form #dynamicForm="ngForm" (ngSubmit)="onSubmit(dynamicForm)">
      <div>
        <h3>Education</h3>
        <button type="button" (click)="addEducation()">
          + Add Education
        </button>
      </div>

      <div *ngFor="let edu of educations; let i = index" class="education-item">
        <h4>Education {{ i + 1 }}</h4>
        <div ngModelGroup="education_{{ i }}">
          <input
            name="school"
            [(ngModel)]="edu.school"
            placeholder="School/University"
            required
          >
          <input
            name="degree"
            [(ngModel)]="edu.degree"
            placeholder="Degree"
            required
          >
          <input
            name="year"
            [(ngModel)]="edu.year"
            type="number"
            placeholder="Graduation Year"
            required
          >
        </div>
        <button type="button" (click)="removeEducation(i)">Remove</button>
      </div>

      <button type="submit" [disabled]="!dynamicForm.valid">
        Submit
      </button>
    </form>
  `
})
export class DynamicFormComponent {
  educations: any[] = [];

  addEducation() {
    this.educations.push({
      school: '',
      degree: '',
      year: new Date().getFullYear()
    });
  }

  removeEducation(index: number) {
    this.educations.splice(index, 1);
  }

  onSubmit(form: NgForm) {
    console.log('Educations:', form.value);
  }
}

// ============================================================================
// EXAMPLE 5: Conditional Fields
// ============================================================================

@Component({
  selector: 'app-conditional-form',
  template: `
    <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)">
      <div class="form-group">
        <label>Are you a student?</label>
        <select name="studentStatus" [(ngModel)]="isStudent" required>
          <option [value]="true">Yes</option>
          <option [value]="false">No</option>
        </select>
      </div>

      <!-- Show if student -->
      <div *ngIf="isStudent === true" class="form-group">
        <label>School/University:</label>
        <input
          type="text"
          name="schoolName"
          [(ngModel)]="schoolName"
          placeholder="School name"
          required
        >
        <label>Graduation Year:</label>
        <input
          type="number"
          name="gradYear"
          [(ngModel)]="gradYear"
          placeholder="Graduation year"
          required
        >
      </div>

      <!-- Show if not student -->
      <div *ngIf="isStudent === false" class="form-group">
        <label>Job Title:</label>
        <input
          type="text"
          name="jobTitle"
          [(ngModel)]="jobTitle"
          placeholder="Your job title"
          required
        >
        <label>Years of Experience:</label>
        <input
          type="number"
          name="experience"
          [(ngModel)]="experience"
          placeholder="Years of experience"
          required
        >
      </div>

      <button type="submit" [disabled]="!contactForm.valid">Submit</button>
    </form>
  `
})
export class ConditionalFormComponent {
  isStudent: boolean | null = null;
  schoolName: string = '';
  gradYear: number | null = null;
  jobTitle: string = '';
  experience: number | null = null;

  onSubmit(form: NgForm) {
    console.log('Form data:', form.value);
  }
}

// ============================================================================
// EXAMPLE 6: Form with Programmatic Updates
// ============================================================================

@Component({
  selector: 'app-programmatic-form',
  template: `
    <form #userForm="ngForm">
      <input name="name" [(ngModel)]="user.name" placeholder="Name">
      <input name="email" [(ngModel)]="user.email" type="email" placeholder="Email">
      <textarea name="bio" [(ngModel)]="user.bio" placeholder="Bio"></textarea>

      <button type="button" (click)="loadUser()">Load User</button>
      <button type="button" (click)="updateUser()">Save User</button>
      <button type="button" (click)="resetForm(userForm)">Reset</button>

      <div *ngIf="userForm.dirty" class="warning">
        You have unsaved changes
      </div>

      <div>
        <p>Form Status: {{ userForm.valid ? 'Valid' : 'Invalid' }}</p>
        <p>Form Dirty: {{ userForm.dirty }}</p>
        <p>Form Touched: {{ userForm.touched }}</p>
      </div>
    </form>
  `
})
export class ProgrammaticFormComponent {
  user = {
    name: '',
    email: '',
    bio: ''
  };

  loadUser() {
    // Simulate API call
    this.user = {
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Software developer'
    };
  }

  updateUser() {
    console.log('Saving user:', this.user);
  }

  resetForm(form: NgForm) {
    form.reset();
    this.user = { name: '', email: '', bio: '' };
  }
}

// ============================================================================
// EXAMPLE 7: Contact Form with Multiple Controls
// ============================================================================

@Component({
  selector: 'app-contact-form',
  template: `
    <form #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)">
      <h2>Contact Us</h2>

      <div class="form-group">
        <label>Name:</label>
        <input
          name="name"
          [(ngModel)]="name"
          #nameCtrl="ngModel"
          required
        >
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          [(ngModel)]="email"
          #emailCtrl="ngModel"
          required
          email
        >
      </div>

      <div class="form-group">
        <label>Subject:</label>
        <select name="subject" [(ngModel)]="subject" required>
          <option value="">Select Subject</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="support">Support</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label>Priority:</label>
        <div>
          <label>
            <input type="radio" name="priority" value="low" [(ngModel)]="priority">
            Low
          </label>
          <label>
            <input type="radio" name="priority" value="medium" [(ngModel)]="priority">
            Medium
          </label>
          <label>
            <input type="radio" name="priority" value="high" [(ngModel)]="priority">
            High
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Message:</label>
        <textarea
          name="message"
          [(ngModel)]="message"
          #messageCtrl="ngModel"
          required
          minlength="10"
          rows="5"
        ></textarea>
        <div *ngIf="messageCtrl.errors?.['minlength'] && messageCtrl.touched">
          Message must be at least 10 characters
        </div>
      </div>

      <button type="submit" [disabled]="!contactForm.valid">Send</button>
    </form>
  `
})
export class ContactFormComponent {
  name: string = '';
  email: string = '';
  subject: string = '';
  priority: string = 'medium';
  message: string = '';

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Contact data:', form.value);
    }
  }
}

// ============================================================================
// EXAMPLE 8: Password Match Validation
// ============================================================================

@Component({
  selector: 'app-password-match-form',
  template: `
    <form #passwordForm="ngForm" (ngSubmit)="onSubmit(passwordForm)">
      <input
        type="password"
        name="password"
        [(ngModel)]="password"
        #passwordCtrl="ngModel"
        required
        minlength="6"
      >

      <input
        type="password"
        name="confirmPassword"
        [(ngModel)]="confirmPassword"
        #confirmCtrl="ngModel"
        required
      >

      <div *ngIf="confirmCtrl.touched && password !== confirmPassword" class="error">
        Passwords do not match
      </div>

      <button
        type="submit"
        [disabled]="!passwordForm.valid || password !== confirmPassword"
      >
        Set Password
      </button>
    </form>
  `
})
export class PasswordMatchFormComponent {
  password: string = '';
  confirmPassword: string = '';

  onSubmit(form: NgForm) {
    if (form.valid && this.password === this.confirmPassword) {
      console.log('Password set successfully');
    }
  }
}
