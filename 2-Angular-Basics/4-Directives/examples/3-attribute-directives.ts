/**
 * Attribute Directives Examples
 * [ngClass], [ngStyle], [(ngModel)] with comprehensive patterns
 */

import { Component, Directive, HostBinding, HostListener, Input } from '@angular/core';

// ============================================================
// EXAMPLE 1: [ngClass] - Single Class
// ============================================================

@Component({
  selector: 'app-ngclass-single',
  template: `
    <div>
      <button [class.active]="isActive" 
              [class.disabled]="isDisabled">
        {{ isActive ? 'Active' : 'Inactive' }}
      </button>
      
      <p [class.highlight]="shouldHighlight">
        Conditional highlight
      </p>
    </div>
  `,
  styles: [`
    .active { background: green; color: white; }
    .disabled { opacity: 0.5; cursor: not-allowed; }
    .highlight { background: yellow; }
  `]
})
export class NgClassSingleComponent {
  isActive = true;
  isDisabled = false;
  shouldHighlight = true;
}

// ============================================================
// EXAMPLE 2: [ngClass] - Object Syntax
// ============================================================

@Component({
  selector: 'app-ngclass-object',
  template: `
    <div>
      <!-- Object with multiple classes -->
      <div [ngClass]="{ 'card': true, 'elevated': isPrimary, 'disabled': isDisabled }">
        Multiple Classes
      </div>
      
      <!-- Computed class object -->
      <button [ngClass]="buttonClasses">
        Dynamic Button
      </button>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ccc; padding: 20px; }
    .elevated { box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    .disabled { opacity: 0.5; }
  `]
})
export class NgClassObjectComponent {
  isPrimary = true;
  isDisabled = false;

  get buttonClasses() {
    return {
      'btn': true,
      'btn-primary': this.isPrimary,
      'btn-large': true,
      'btn-disabled': this.isDisabled
    };
  }
}

// ============================================================
// EXAMPLE 3: [ngClass] - Array Syntax
// ============================================================

@Component({
  selector: 'app-ngclass-array',
  template: `
    <div>
      <!-- Array of classes -->
      <div [ngClass]="['container', 'card', 'shadow']">
        Static array
      </div>
      
      <!-- Dynamic array with conditions -->
      <div [ngClass]="dynamicClasses">
        Dynamic array
      </div>
      
      <!-- Method returning array -->
      <div [ngClass]="getClasses()">
        Method result
      </div>
    </div>
  `
})
export class NgClassArrayComponent {
  isPremium = true;

  get dynamicClasses() {
    const classes = ['base-class'];
    if (this.isPremium) classes.push('premium');
    return classes;
  }

  getClasses() {
    return ['btn', this.isPremium ? 'btn-primary' : 'btn-secondary'];
  }
}

// ============================================================
// EXAMPLE 4: [ngStyle] - Single Style
// ============================================================

@Component({
  selector: 'app-ngstyle-single',
  template: `
    <div>
      <p [style.color]="textColor">Colored text</p>
      <p [style.font-size]="fontSize">Variable font</p>
      <div [style.width.px]="boxWidth">Dynamic width</div>
      <div [style.padding.em]="paddingValue">Dynamic padding</div>
    </div>
  `
})
export class NgStyleSingleComponent {
  textColor = 'blue';
  fontSize = '20px';
  boxWidth = 300;
  paddingValue = 2;
}

// ============================================================
// EXAMPLE 5: [ngStyle] - Object Syntax
// ============================================================

@Component({
  selector: 'app-ngstyle-object',
  template: `
    <div>
      <!-- Object with multiple styles -->
      <div [ngStyle]="{ 'color': textColor, 'font-size': fontSize, 'background-color': bgColor }">
        Multiple styles
      </div>
      
      <!-- Computed style object -->
      <div [ngStyle]="dynamicStyles">
        Dynamic styles
      </div>
    </div>
  `
})
export class NgStyleObjectComponent {
  textColor = 'red';
  fontSize = '18px';
  bgColor = '#f0f0f0';

  get dynamicStyles() {
    return {
      'color': this.textColor === 'dark' ? '#000' : '#fff',
      'background-color': this.textColor === 'dark' ? '#fff' : '#000',
      'padding': '20px',
      'border-radius': '8px'
    };
  }
}

// ============================================================
// EXAMPLE 6: [ngStyle] - Theme Switching
// ============================================================

@Component({
  selector: 'app-ngstyle-theme',
  template: `
    <div [ngStyle]="themeStyles">
      <button (click)="toggleTheme()">
        {{ isDarkTheme ? 'Light' : 'Dark' }} Mode
      </button>
      <p>Current theme: {{ isDarkTheme ? 'Dark' : 'Light' }}</p>
    </div>
  `
})
export class NgStyleThemeComponent {
  isDarkTheme = false;

  get themeStyles() {
    return {
      'background-color': this.isDarkTheme ? '#333' : '#fff',
      'color': this.isDarkTheme ? '#fff' : '#000',
      'padding': '20px',
      'min-height': '100vh',
      'transition': 'all 0.3s ease'
    };
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}

// ============================================================
// EXAMPLE 7: [(ngModel)] - Basic Two-Way Binding
// ============================================================

@Component({
  selector: 'app-ngmodel-basic',
  template: `
    <div>
      <!-- Text input -->
      <input [(ngModel)]="username" placeholder="Username" />
      <p>Username: {{ username }}</p>
      
      <!-- Number input -->
      <input type="number" [(ngModel)]="age" placeholder="Age" />
      <p>Age: {{ age }}</p>
      
      <!-- Checkbox -->
      <input type="checkbox" [(ngModel)]="agree" />
      <label>I agree to terms: {{ agree }}</label>
    </div>
  `
})
export class NgModelBasicComponent {
  username = '';
  age = 0;
  agree = false;
}

// ============================================================
// EXAMPLE 8: [(ngModel)] - With Change Detection
// ============================================================

@Component({
  selector: 'app-ngmodel-change',
  template: `
    <div>
      <input [(ngModel)]="email"
             (ngModelChange)="onEmailChange($event)"
             placeholder="Email" />
      
      <p>Email: {{ email }}</p>
      <p *ngIf="isValid" class="valid">✓ Valid email</p>
      <p *ngIf="!isValid && email" class="invalid">✗ Invalid email</p>
    </div>
  `,
  styles: [`
    .valid { color: green; }
    .invalid { color: red; }
  `]
})
export class NgModelChangeComponent {
  email = '';
  isValid = false;

  onEmailChange(value: string) {
    this.email = value;
    this.isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}

// ============================================================
// EXAMPLE 9: Combined Directives
// ============================================================

@Component({
  selector: 'app-combined-directives',
  template: `
    <div>
      <div *ngFor="let item of items; trackBy: trackByFn"
           [ngClass]="{ 'selected': item.selected, 'disabled': !item.active }"
           [ngStyle]="{ 'opacity': item.active ? 1 : 0.5 }"
           (click)="item.selected = !item.selected">
        {{ item.name }}
      </div>
    </div>
  `,
  styles: [`
    .selected { background: lightblue; }
    .disabled { pointer-events: none; }
  `]
})
export class CombinedDirectivesComponent {
  items = [
    { id: 1, name: 'Item 1', selected: false, active: true },
    { id: 2, name: 'Item 2', selected: false, active: true },
    { id: 3, name: 'Item 3', selected: false, active: false }
  ];

  trackByFn(index: number, item: any) {
    return item.id;
  }
}

// ============================================================
// EXAMPLE 10: Form with ngModel and Validation
// ============================================================

@Component({
  selector: 'app-form-ngmodel',
  template: `
    <form (ngSubmit)="onSubmit()">
      <div>
        <label>Name:</label>
        <input [(ngModel)]="formData.name" name="name" required />
      </div>
      
      <div>
        <label>Email:</label>
        <input type="email" [(ngModel)]="formData.email" name="email" required />
      </div>
      
      <div>
        <label>Message:</label>
        <textarea [(ngModel)]="formData.message" name="message"></textarea>
      </div>
      
      <button type="submit" [disabled]="!isFormValid">Submit</button>
    </form>
    
    <div *ngIf="submitted" class="success">
      Form submitted successfully!
    </div>
  `,
  styles: [`
    .success { color: green; }
  `]
})
export class FormNgModelComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };
  submitted = false;

  get isFormValid(): boolean {
    return this.formData.name.length > 0 && 
           this.formData.email.includes('@');
  }

  onSubmit() {
    if (this.isFormValid) {
      this.submitted = true;
      console.log('Form data:', this.formData);
    }
  }
}

// ============================================================
// EXAMPLE 11: Custom Directive with Attribute Binding
// ============================================================

@Directive({
  selector: '[appCardHighlight]'
})
export class CardHighlightDirective {
  @Input() appCardHighlight: string = 'yellow';

  @HostBinding('style.backgroundColor')
  get bgColor(): string {
    return this.appCardHighlight;
  }

  @HostBinding('style.padding')
  padding = '20px';

  @HostBinding('class.highlighted')
  isHighlighted = true;
}

// ============================================================
// EXAMPLE 12: Performance - Cached vs Computed
// ============================================================

@Component({
  selector: 'app-performance',
  template: `
    <div>
      <!-- ✅ GOOD: Cached styles -->
      <div [ngStyle]="cachedStyles">Cached</div>
      
      <!-- ❌ BAD: Recomputed every change detection -->
      <!-- <div [ngStyle]="getComputedStyles()">Computed</div> -->
    </div>
  `
})
export class PerformanceComponent {
  // Pre-computed and cached
  cachedStyles = {
    'color': 'blue',
    'font-size': '16px',
    'padding': '10px'
  };

  // Avoid: Called every change detection
  getComputedStyles() {
    return {
      'color': 'blue',
      'font-size': '16px'
    };
  }
}

// ============================================================
// Summary: Attribute Directives
// ============================================================

/**
 * Key Directives:
 *
 * [ngClass]:
 * - Single: [class.name]="bool"
 * - Object: [ngClass]="obj"
 * - Array: [ngClass]="arr"
 *
 * [ngStyle]:
 * - Single: [style.prop]="value"
 * - Object: [ngStyle]="obj"
 * - Units: [style.width.px]="200"
 *
 * [(ngModel)]:
 * - Requires FormsModule
 * - Two-way binding
 * - Use (ngModelChange) for side effects
 *
 * Best Practices:
 * ✅ Cache computed values
 * ✅ Use object syntax for multiple
 * ✅ Combine with *ngFor and trackBy
 * ✅ Use for styling, not logic
 * ✅ Consider performance
 */
