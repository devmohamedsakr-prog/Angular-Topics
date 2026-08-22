/**
 * Component Basics Example
 * Demonstrates component anatomy, decorators, and configuration
 */

import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

// ============================================================
// EXAMPLE 1: Basic Component with Element Selector
// ============================================================

@Component({
  selector: 'app-button',
  template: `<button (click)="onClick()">{{ label }}</button>`,
  styles: [`button { padding: 8px 16px; background: blue; color: white; }`]
})
export class BasicButtonComponent {
  label = 'Click me';

  onClick() {
    console.log('Button clicked');
  }
}

// ============================================================
// EXAMPLE 2: Component with Attribute Selector
// ============================================================

@Component({
  selector: '[appHighlight]',
  template: `<p>{{ text }}</p>`,
  styles: [`p { background: yellow; }`]
})
export class HighlightComponent {
  text = 'Highlighted text';
}

// Usage: <div appHighlight></div>

// ============================================================
// EXAMPLE 3: Component with External Template & Styles
// ============================================================

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  user = {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://via.placeholder.com/150'
  };
}

// Note: In real projects, template and style files would be separate files

// ============================================================
// EXAMPLE 4: Component with Different Encapsulation Strategies
// ============================================================

// Emulated Encapsulation (Default)
@Component({
  selector: 'app-card-emulated',
  template: `<div class="card">Emulated styles</div>`,
  styles: ['.card { border: 1px solid blue; }'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CardEmulatedComponent {}

// None Encapsulation - Styles apply globally
@Component({
  selector: 'app-card-none',
  template: `<div class="card-global">Global styles</div>`,
  styles: ['.card-global { border: 1px solid red; }'],
  encapsulation: ViewEncapsulation.None
})
export class CardNoneComponent {}

// ShadowDom Encapsulation - True CSS isolation
@Component({
  selector: 'app-card-shadow',
  template: `<div class="card-shadow">Shadow DOM styles</div>`,
  styles: ['.card-shadow { border: 1px solid green; }'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CardShadowComponent {}

// ============================================================
// EXAMPLE 5: Component with OnPush Change Detection
// ============================================================

@Component({
  selector: 'app-optimized-list',
  template: `
    <div>
      <h2>Optimized List</h2>
      <div *ngFor="let item of items; trackBy: trackByFn">
        {{ item.name }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedListComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  trackByFn(index: number, item: any) {
    return item.id;
  }
}

// ============================================================
// EXAMPLE 6: Standalone Component (Angular 14+)
// ============================================================

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  `
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}

// ============================================================
// EXAMPLE 7: Component with Typed Properties
// ============================================================

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

@Component({
  selector: 'app-product',
  template: `
    <div>
      <h3>{{ product.name }}</h3>
      <p>Price: ${{ product.price }}</p>
      <p>{{ product.inStock ? 'In Stock' : 'Out of Stock' }}</p>
    </div>
  `
})
export class ProductComponent {
  product: Product = {
    id: 1,
    name: 'Laptop',
    price: 999,
    inStock: true
  };

  discountedPrice(): number {
    return this.product.price * 0.9;
  }
}

// ============================================================
// EXAMPLE 8: Component with Multiple Stylesheets
// ============================================================

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="container">
      <div class="header">Dashboard</div>
      <div class="content">Content here</div>
    </div>
  `,
  styleUrls: [
    './dashboard.component.css',
    './dashboard-theme.css',
    './dashboard-responsive.css'
  ]
})
export class DashboardComponent {}

// ============================================================
// EXAMPLE 9: Component with Class Selector
// ============================================================

@Component({
  selector: '.app-widget',
  template: `<div>Widget Content</div>`,
  styles: [`div { background: lightblue; padding: 10px; }`]
})
export class WidgetComponent {}

// Usage: <div class="app-widget"></div>

// ============================================================
// EXAMPLE 10: Complete Component Configuration
// ============================================================

@Component({
  selector: 'app-complete-example',
  template: `
    <div class="wrapper">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <button (click)="handleAction()">Action</button>
    </div>
  `,
  styles: [`
    .wrapper {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
      font-size: 24px;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
    button {
      background: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated
})
export class CompleteExampleComponent {
  title = 'Complete Component Configuration';
  description = 'This component demonstrates all main configuration options';

  handleAction() {
    console.log('Action performed');
    this.title = 'Action completed!';
  }

  constructor() {
    console.log('Component constructed');
  }

  ngOnInit() {
    console.log('Component initialized');
  }

  ngOnDestroy() {
    console.log('Component destroyed');
  }
}

// ============================================================
// Summary of Component Features
// ============================================================

/**
 * Key Component Features Demonstrated:
 *
 * 1. Element Selector (selector: 'app-component')
 * 2. Attribute Selector (selector: '[appHighlight]')
 * 3. Class Selector (selector: '.app-widget')
 * 4. Template - inline and external
 * 5. Styles - inline and external arrays
 * 6. Encapsulation Strategies:
 *    - ViewEncapsulation.Emulated (default)
 *    - ViewEncapsulation.None
 *    - ViewEncapsulation.ShadowDom
 * 7. Change Detection:
 *    - Default (CheckAlways)
 *    - OnPush (optimized)
 * 8. Standalone Components (no NgModule)
 * 9. Typed Properties and Interfaces
 * 10. Component Class with Methods
 *
 * Best Practices Used:
 * ✅ Clear naming conventions
 * ✅ Type safety with TypeScript
 * ✅ Proper encapsulation
 * ✅ Performance optimization with OnPush
 * ✅ Structured component organization
 * ✅ Lifecycle hook placeholders
 */
