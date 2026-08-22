# Two-Way Binding & ngModel

## Overview

Two-way binding synchronizes data between component properties and form inputs. When the user enters data, the component property updates automatically, and when the property changes, the view updates.

## Two-Way Binding Syntax

### ngModel Directive

Two-way binding uses the `[(ngModel)]` syntax, which combines property binding and event binding.

```typescript
import { FormsModule } from '@angular/forms';

export class TwoWayComponent {
  username = '';
  email = '';
  bio = '';
  newsletter = false;
}
```

```html
<!-- Two-way binding: [(ngModel)]="property" -->
<input [(ngModel)]="username" placeholder="Username" />
<p>You entered: {{ username }}</p>

<input type="email" [(ngModel)]="email" placeholder="Email" />

<textarea [(ngModel)]="bio" placeholder="Tell us about yourself"></textarea>

<input type="checkbox" [(ngModel)]="newsletter" />
<label>Subscribe to newsletter</label>
```

### Module Requirement

To use `[(ngModel)]`, import `FormsModule`:

```typescript
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TwoWayComponent],
  imports: [CommonModule, FormsModule]
})
export class MyModule {}
```

Or in standalone components:

```typescript
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `<input [(ngModel)]="name" />`
})
export class FormComponent {
  name = '';
}
```

## How Two-Way Binding Works

### Equivalent Syntax

Two-way binding `[(ngModel)]="value"` is equivalent to:

```html
<!-- Explicitly written -->
<input [ngModel]="value" (ngModelChange)="value = $event" />

<!-- Same as -->
<input [(ngModel)]="value" />
```

### Breaking Down the Syntax

The `[( )]` syntax is called "banana-in-a-box":

- `[ ]` - Property binding (input data to component)
- `( )` - Event binding (output data from component)
- Combined `[( )]` - Two-way binding

## ngModel with Different Input Types

### Text Input

```typescript
export class TextInputComponent {
  name = 'John';
  message = 'Hello';
}
```

```html
<!-- Text input -->
<input type="text" [(ngModel)]="name" />
<p>Name: {{ name }}</p>

<!-- Text area -->
<textarea [(ngModel)]="message" rows="5" cols="40"></textarea>
<p>{{ message }}</p>
```

### Number Input

```typescript
export class NumberInputComponent {
  age = 25;
  quantity = 1;
  rating = 5;
}
```

```html
<!-- Number input -->
<input type="number" [(ngModel)]="age" />
<p>Age: {{ age }}</p>

<input type="number" [(ngModel)]="quantity" min="1" max="100" />

<input type="range" [(ngModel)]="rating" min="1" max="5" />
<p>Rating: {{ rating }} stars</p>
```

### Checkbox

```typescript
export class CheckboxComponent {
  isActive = false;
  agreeToTerms = false;
  selectedItems = [false, true, false];
}
```

```html
<!-- Checkbox -->
<input type="checkbox" [(ngModel)]="isActive" />
<label>Active: {{ isActive }}</label>

<!-- Multiple checkboxes -->
<label *ngFor="let item of items; let i = index">
  <input type="checkbox" [(ngModel)]="selectedItems[i]" />
  {{ item.label }}
</label>
```

### Radio Button

```typescript
export class RadioComponent {
  selectedColor = 'red';
  gender = 'male';
}
```

```html
<!-- Radio buttons -->
<label>
  <input type="radio" name="color" value="red" [(ngModel)]="selectedColor" />
  Red
</label>
<label>
  <input type="radio" name="color" value="blue" [(ngModel)]="selectedColor" />
  Blue
</label>
<label>
  <input type="radio" name="color" value="green" [(ngModel)]="selectedColor" />
  Green
</label>
<p>Selected: {{ selectedColor }}</p>
```

### Select Dropdown

```typescript
export class SelectComponent {
  selectedCountry = '';
  selectedOption = null;
  countries = [
    { id: 1, name: 'USA' },
    { id: 2, name: 'Canada' },
    { id: 3, name: 'Mexico' }
  ];
}
```

```html
<!-- Select dropdown -->
<select [(ngModel)]="selectedCountry">
  <option value="">Select a country</option>
  <option value="usa">USA</option>
  <option value="canada">Canada</option>
  <option value="mexico">Mexico</option>
</select>
<p>Selected: {{ selectedCountry }}</p>

<!-- With object binding -->
<select [(ngModel)]="selectedOption">
  <option *ngFor="let country of countries" [ngValue]="country">
    {{ country.name }}
  </option>
</select>
<p *ngIf="selectedOption">Selected ID: {{ selectedOption.id }}</p>
```

## ngModel with Forms

### Form Structure

```typescript
export class FormComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    agreeToTerms: false
  };

  submitted = false;

  onSubmit() {
    this.submitted = true;
    console.log('Form data:', this.formData);
  }

  onReset() {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      agreeToTerms: false
    };
    this.submitted = false;
  }
}
```

```html
<!-- Form with ngModel -->
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

  <div>
    <input type="checkbox" [(ngModel)]="formData.agreeToTerms" 
           name="agreeToTerms" />
    <label>I agree to terms</label>
  </div>

  <button type="submit">Submit</button>
  <button type="reset" (click)="onReset()">Reset</button>
</form>

<div *ngIf="submitted">
  <h3>Form Data Submitted:</h3>
  <pre>{{ formData | json }}</pre>
</div>
```

## ngModelGroup

Group related form fields using `ngModelGroup`:

```typescript
export class AddressFormComponent {
  user = {
    name: '',
    address: {
      street: '',
      city: '',
      country: ''
    }
  };
}
```

```html
<!-- Group related fields -->
<form (ngSubmit)="onSubmit()">
  <input [(ngModel)]="user.name" name="name" placeholder="Name" />

  <fieldset ngModelGroup="address">
    <input [(ngModel)]="user.address.street" name="street" 
           placeholder="Street" />
    <input [(ngModel)]="user.address.city" name="city" 
           placeholder="City" />
    <input [(ngModel)]="user.address.country" name="country" 
           placeholder="Country" />
  </fieldset>

  <button type="submit">Submit</button>
</form>
```

## Creating Custom Two-Way Binding

Custom components can support two-way binding using `@Input` and `@Output`:

### Custom Component

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="decrease()">-</button>
    <span>{{ count }}</span>
    <button (click)="increase()">+</button>
  `
})
export class CounterComponent {
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
```

### Using Custom Two-Way Binding

```typescript
export class ParentComponent {
  myCount = 5;
}
```

```html
<!-- Parent explicit syntax -->
<app-counter [count]="myCount" (countChange)="myCount = $event">
</app-counter>

<!-- Parent two-way binding -->
<app-counter [(count)]="myCount"></app-counter>

<p>Count is: {{ myCount }}</p>
```

## ngModel Change Detection

### Detecting Changes

```typescript
export class ChangeDetectionComponent {
  username = '';
  changeLog: string[] = [];

  onUsernameChange() {
    this.changeLog.push(`Changed to: ${this.username}`);
  }
}
```

```html
<!-- Detect changes with (ngModelChange) -->
<input [(ngModel)]="username" 
       (ngModelChange)="onUsernameChange()" />

<ul>
  <li *ngFor="let change of changeLog">{{ change }}</li>
</ul>
```

### Separate Events

```html
<!-- Update property on keyup -->
<input [ngModel]="username" 
       (ngModelChange)="username = $event"
       (keyup)="onKeyUp($event)" />
```

## ngModel with Validation

### Basic Validation

```typescript
export class ValidationComponent {
  email = '';
  isValid = false;

  onEmailChange(value: string) {
    this.email = value;
    this.isValid = this.email.includes('@');
  }
}
```

```html
<input [(ngModel)]="email" 
       (ngModelChange)="onEmailChange($event)"
       placeholder="Enter email" />

<p *ngIf="!isValid" class="error">
  Invalid email format
</p>

<button [disabled]="!isValid">Submit</button>
```

## Best Practices

✅ **Always use FormsModule for ngModel**
```typescript
imports: [FormsModule]
```

✅ **Use name attribute in forms**
```html
<input [(ngModel)]="value" name="uniqueName" />
```

✅ **Keep ngModel bindings simple**
```typescript
// Good - use object property
formData.email = value;

// Avoid - complex nested paths
this.deeply.nested.config.email = value;
```

✅ **Use (ngModelChange) for side effects**
```typescript
onValueChange(newValue: string) {
  this.value = newValue;
  this.validate();
}
```

## Two-Way Binding vs Reactive Forms

### Template-Driven with ngModel

```html
<input [(ngModel)]="name" name="name" />
```

### Reactive Forms (More Powerful)

```typescript
form = this.fb.group({
  name: ['', Validators.required]
});
```

```html
<input [formControl]="form.get('name')" />
```

## Performance Considerations

⚠️ **ngModel watches every input event**
- For large forms, consider ReactiveFormsModule
- ReactiveFormsModule provides better performance
- Use `(ngModelChange)` for expensive operations judiciously

## Key Takeaways

- **Two-way binding** - `[(ngModel)]="property"`
- **Works with** - text, number, checkbox, radio, select, textarea
- **Requires** - FormsModule import
- **Custom support** - Use @Input + @Output pattern
- **Validation** - Use (ngModelChange) for custom logic
- **Forms** - Use ngModelGroup for field grouping
- **Performance** - Consider ReactiveFormsModule for complex forms
