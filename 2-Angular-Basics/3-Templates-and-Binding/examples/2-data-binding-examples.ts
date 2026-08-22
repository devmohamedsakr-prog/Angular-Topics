/**
 * Data Binding Examples
 * Property, attribute, class, and style binding
 */

import { Component } from '@angular/core';

// ============================================================
// EXAMPLE 1: Property Binding
// ============================================================

@Component({
  selector: 'app-property-binding',
  template: `
    <div>
      <img [src]="imageUrl" [alt]="imageAlt" />
      <button [disabled]="isDisabled">Submit</button>
      <input [value]="inputValue" />
      <p [innerText]="message"></p>
    </div>
  `
})
export class PropertyBindingComponent {
  imageUrl = 'https://example.com/image.jpg';
  imageAlt = 'Example Image';
  isDisabled = false;
  inputValue = 'Initial value';
  message = 'Hello World';
}

// ============================================================
// EXAMPLE 2: Attribute Binding
// ============================================================

@Component({
  selector: 'app-attribute-binding',
  template: `
    <div>
      <button [attr.aria-label]="buttonLabel">OK</button>
      <div [attr.data-id]="userId">User: {{ userId }}</div>
      <table>
        <tr>
          <th [attr.colspan]="columnCount">Header</th>
        </tr>
      </table>
    </div>
  `
})
export class AttributeBindingComponent {
  buttonLabel = 'Submit Button';
  userId = 123;
  columnCount = 3;
}

// ============================================================
// EXAMPLE 3: Class Binding - Single Class
// ============================================================

@Component({
  selector: 'app-single-class-binding',
  template: `
    <div>
      <div [class.active]="isActive">Active State</div>
      <div [class.error]="hasError">Error State</div>
      <button [class.loading]="isLoading">
        {{ isLoading ? 'Loading...' : 'Submit' }}
      </button>
    </div>
  `,
  styles: [`
    .active { color: green; font-weight: bold; }
    .error { color: red; background: #ffe0e0; }
    .loading { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class SingleClassBindingComponent {
  isActive = true;
  hasError = false;
  isLoading = false;
}

// ============================================================
// EXAMPLE 4: Class Binding - Multiple Classes with ngClass
// ============================================================

@Component({
  selector: 'app-multiple-class-binding',
  template: `
    <div>
      <!-- Object syntax -->
      <div [ngClass]="{ active: isActive, error: hasError, loading: isLoading }">
        Multiple classes
      </div>
      
      <!-- Array syntax -->
      <div [ngClass]="['container', isActive ? 'active' : 'inactive']">
        Array syntax
      </div>
      
      <!-- Computed object -->
      <div [ngClass]="classMap">
        Computed classes
      </div>
    </div>
  `
})
export class MultipleClassBindingComponent {
  isActive = true;
  hasError = false;
  isLoading = false;

  get classMap() {
    return {
      'btn': true,
      'btn-primary': this.isActive,
      'btn-secondary': !this.isActive,
      'btn-disabled': this.isLoading
    };
  }
}

// ============================================================
// EXAMPLE 5: Style Binding - Single Style
// ============================================================

@Component({
  selector: 'app-single-style-binding',
  template: `
    <div>
      <p [style.color]="textColor">Colored text</p>
      <p [style.font-size]="fontSize">Variable font size</p>
      <div [style.width.px]="boxWidth">{{ boxWidth }}px wide</div>
      <div [style.padding.em]="2">2em padding</div>
    </div>
  `
})
export class SingleStyleBindingComponent {
  textColor = 'red';
  fontSize = '20px';
  boxWidth = 200;
}

// ============================================================
// EXAMPLE 6: Style Binding - Multiple Styles with ngStyle
// ============================================================

@Component({
  selector: 'app-multiple-style-binding',
  template: `
    <div>
      <!-- Object syntax -->
      <div [ngStyle]="{ 
        'color': textColor, 
        'font-size': fontSize + 'px',
        'background-color': backgroundColor
      }">
        Multiple styles
      </div>
      
      <!-- Computed object -->
      <div [ngStyle]="styleMap">
        Computed styles
      </div>
    </div>
  `
})
export class MultipleStyleBindingComponent {
  textColor = 'blue';
  fontSize = 18;
  backgroundColor = '#f0f0f0';

  get styleMap() {
    return {
      'color': this.textColor,
      'font-size': this.fontSize + 'px',
      'padding': '10px',
      'border': '1px solid #ccc',
      'border-radius': '4px'
    };
  }
}

// ============================================================
// EXAMPLE 7: Combining Multiple Bindings
// ============================================================

@Component({
  selector: 'app-combined-bindings',
  template: `
    <div>
      <button 
        [disabled]="!isValid"
        [class.success]="isValid"
        [style.background-color]="isValid ? 'green' : 'gray'"
        [attr.aria-label]="buttonLabel">
        {{ isValid ? 'Submit' : 'Invalid' }}
      </button>
    </div>
  `
})
export class CombinedBindingsComponent {
  isValid = true;
  buttonLabel = 'Submit the form';
}

// ============================================================
// EXAMPLE 8: Binding to HTML Content
// ============================================================

@Component({
  selector: 'app-html-content-binding',
  template: `
    <div>
      <!-- Text content (safe) -->
      <p [textContent]="plainText"></p>
      <p [innerText]="plainText"></p>
      
      <!-- HTML content (NOT RECOMMENDED for user input) -->
      <!-- <div [innerHTML]="htmlContent"></div> -->
      
      <!-- Safe version -->
      <div [innerHTML]="trustedHtml"></div>
    </div>
  `
})
export class HtmlContentBindingComponent {
  plainText = 'This is plain text';
  htmlContent = '<strong>Bold text</strong>'; // UNSAFE
  trustedHtml = '<em>Emphasized text</em>'; // Should be sanitized
}

// ============================================================
// EXAMPLE 9: Binding with Expressions
// ============================================================

@Component({
  selector: 'app-expression-binding',
  template: `
    <div>
      <input [value]="firstName + ' ' + lastName" />
      <button [disabled]="count <= 0">Count: {{ count }}</button>
      <div [style.opacity]="isVisible ? 1 : 0.3">Content</div>
    </div>
  `
})
export class ExpressionBindingComponent {
  firstName = 'John';
  lastName = 'Doe';
  count = 5;
  isVisible = true;
}

// ============================================================
// EXAMPLE 10: Binding to Component Properties
// ============================================================

@Component({
  selector: 'app-component-property',
  template: `
    <app-child 
      [data]="myData"
      [isActive]="isActive">
    </app-child>
  `
})
export class ComponentPropertyComponent {
  myData = { id: 1, name: 'Item' };
  isActive = true;
}

// Child component
@Component({
  selector: 'app-child',
  template: `
    <div>
      <p>Data: {{ data?.name }}</p>
      <p>Active: {{ isActive }}</p>
    </div>
  `
})
export class ChildComponent {
  @Input() data: any;
  @Input() isActive: boolean;
}

// ============================================================
// EXAMPLE 11: Dynamic Class List
// ============================================================

@Component({
  selector: 'app-dynamic-class-list',
  template: `
    <div>
      <div [ngClass]="getClasses()">Dynamic classes</div>
      <div [ngClass]="classList">From array</div>
    </div>
  `
})
export class DynamicClassListComponent {
  classList = ['card', 'elevated', 'shadow'];

  getClasses() {
    return ['base-class', this.isActive ? 'active' : 'inactive'];
  }

  isActive = true;
}

// ============================================================
// EXAMPLE 12: Performance - Cached Computations
// ============================================================

@Component({
  selector: 'app-cached-binding',
  template: `
    <div>
      <!-- ✅ GOOD - Cached -->
      <div [ngClass]="cachedClasses">
        Cached classes
      </div>
      
      <!-- ✅ GOOD - Simple property -->
      <div [style.color]="textColor">
        Color text
      </div>
    </div>
  `
})
export class CachedBindingComponent {
  isActive = true;
  isLoading = false;
  textColor = 'blue';

  // Computed once, not on every change detection
  get cachedClasses() {
    return {
      'active': this.isActive,
      'loading': this.isLoading
    };
  }
}

// ============================================================
// EXAMPLE 13: Input() and Two-Way Binding Preparation
// ============================================================

import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bindable-component',
  template: `
    <div [style.color]="color" [class.highlighted]="highlight">
      {{ content }}
    </div>
  `
})
export class BindableComponent {
  @Input() color = 'black';
  @Input() highlight = false;
  @Input() content = '';
}

// Usage
@Component({
  selector: 'app-binding-parent',
  template: `
    <app-bindable-component
      [color]="'red'"
      [highlight]="true"
      content="Hello">
    </app-bindable-component>
  `
})
export class BindingParentComponent {}

// ============================================================
// Summary: Data Binding Best Practices
// ============================================================

/**
 * ✅ DO:
 * - Use property binding for properties [prop]="value"
 * - Use attribute binding for attributes [attr.name]="value"
 * - Use [ngClass] for multiple classes
 * - Use [ngStyle] for multiple styles
 * - Cache computed values
 * - Use trackBy with ngClass/ngStyle
 *
 * ❌ DON'T:
 * - Use string interpolation for attributes {{attr}}
 * - Call functions in bindings
 * - Use [innerHTML] with user input
 * - Create objects inline
 * - Use complex expressions
 */
