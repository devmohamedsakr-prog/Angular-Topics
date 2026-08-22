/**
 * Advanced Patterns & Optimization Example
 * Demonstrates change detection strategies, smart/presentational patterns, and performance
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ============================================================
// EXAMPLE 1: Default Change Detection Strategy
// ============================================================

@Component({
  selector: 'app-default-detection',
  template: `
    <div>
      <p>{{ data }}</p>
      <p>Checks: {{ checkCount }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class DefaultDetectionComponent {
  data = 'Initial data';
  checkCount = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngDoCheck() {
    this.checkCount++;
  }
}

// Note: Checked on every change detection cycle
// Good for: Simple components where performance isn't critical
// Pros: Automatic, simple
// Cons: Slower for large apps

// ============================================================
// EXAMPLE 2: OnPush Change Detection Strategy
// ============================================================

@Component({
  selector: 'app-onpush-detection',
  template: `
    <div>
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <p>Checks: {{ checkCount }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushDetectionComponent {
  @Input() user: any;
  checkCount = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngDoCheck() {
    this.checkCount++;
  }
}

// Only checks when:
// - Input property changes
// - Event occurs in template
// - Manually marked with markForCheck()

// Good for: Presentational components with @Input
// Pros: Better performance, predictable
// Cons: Requires immutable patterns

// ============================================================
// EXAMPLE 3: Manual Change Detection
// ============================================================

@Component({
  selector: 'app-manual-detection'
})
export class ManualDetectionComponent {
  data: any = {};

  constructor(private cdr: ChangeDetectorRef) {}

  loadData() {
    // Simulate async data load
    setTimeout(() => {
      this.data = { id: 1, name: 'Loaded' };
      // Manually trigger change detection
      this.cdr.markForCheck();
    }, 2000);
  }

  forceUpdate() {
    // Force immediate change detection
    this.cdr.detectChanges();
  }

  detachDetection() {
    // Stop automatic change detection
    this.cdr.detach();
  }

  reattachDetection() {
    // Resume automatic change detection
    this.cdr.reattach();
  }
}

// ============================================================
// EXAMPLE 4: Presentational Component (Dumb Component)
// ============================================================

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <img [src]="product.image" [alt]="product.name" />
      <h3>{{ product.name }}</h3>
      <p class="price">${{ product.price }}</p>
      <button (click)="onAddToCart()">Add to Cart</button>
    </div>
  `,
  styles: [`
    .product-card { border: 1px solid #ccc; padding: 10px; }
    .price { font-weight: bold; color: red; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product: Product;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart() {
    this.addToCart.emit(this.product);
  }
}

// Characteristics:
// ✅ Receives all data via @Input
// ✅ Pure presentation logic
// ✅ No service dependencies
// ✅ Emits events for actions
// ✅ Easy to test
// ✅ Reusable

// ============================================================
// EXAMPLE 5: Smart Component (Container Component)
// ============================================================

@Component({
  selector: 'app-product-list'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productService: any) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts()
      .subscribe(
        (data: Product[]) => {
          this.products = data;
          this.loading = false;
        },
        (err: any) => {
          this.error = err.message;
          this.loading = false;
        }
      );
  }

  onAddToCart(product: Product) {
    this.productService.addToCart(product).subscribe(() => {
      console.log('Added to cart:', product.name);
    });
  }
}

// Characteristics:
// ✅ Manages application state
// ✅ Handles API calls
// ✅ Contains business logic
// ✅ Orchestrates child components
// ✅ Handles errors and loading

// ============================================================
// EXAMPLE 6: Smart/Presentational Architecture
// ============================================================

// Presentational Component
@Component({
  selector: 'app-user-list-view',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">{{ error }}</div>
    <div *ngIf="!loading && !error">
      <app-product-card
        *ngFor="let product of products; trackBy: trackByFn"
        [product]="product"
        (addToCart)="onAddToCart($event)">
      </app-product-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListViewComponent {
  @Input() products: Product[];
  @Input() loading: boolean;
  @Input() error: string | null;
  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(product: Product) {
    this.addToCart.emit(product);
  }

  trackByFn(index: number, product: Product): number {
    return product.id;
  }
}

// Container Component
@Component({
  selector: 'app-product-store'
})
export class ProductStoreComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productService: any) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.loading = false;
      },
      (err: any) => {
        this.error = err.message;
        this.loading = false;
      }
    );
  }

  onAddToCart(product: Product) {
    this.productService.addToCart(product).subscribe();
  }
}

// ============================================================
// EXAMPLE 7: Performance Optimization - TrackBy
// ============================================================

@Component({
  selector: 'app-optimized-list'
})
export class OptimizedListComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  // ❌ BAD - No trackBy, recreates DOM on every change
  // <div *ngFor="let item of items">{{ item.name }}</div>

  // ✅ GOOD - With trackBy, reuses DOM elements
  // <div *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</div>

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}

// ============================================================
// EXAMPLE 8: Immutable Data Patterns
// ============================================================

@Component({
  selector: 'app-immutable-example'
})
export class ImmutableExampleComponent {
  users = [
    { id: 1, name: 'Alice', active: true },
    { id: 2, name: 'Bob', active: false }
  ];

  // ❌ BAD - Direct mutation
  // addUser(user: any) {
  //   this.users.push(user); // Direct mutation
  // }

  // ✅ GOOD - Immutable pattern
  addUser(user: any) {
    this.users = [...this.users, user];
  }

  removeUser(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }

  updateUser(id: number, changes: any) {
    this.users = this.users.map(u =>
      u.id === id ? { ...u, ...changes } : u
    );
  }
}

// Benefits:
// ✅ Works with OnPush detection
// ✅ Predictable
// ✅ Easier to test
// ✅ Better for time-travel debugging

// ============================================================
// EXAMPLE 9: Proper Unsubscription
// ============================================================

@Component({
  selector: 'app-subscription-cleanup'
})
export class SubscriptionCleanupComponent implements OnInit, OnDestroy {
  data: any;
  private destroy$ = new Subject<void>();

  constructor(private dataService: any) {}

  ngOnInit() {
    // Method 1: Using takeUntil (RECOMMENDED)
    this.dataService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
      });

    // This automatic cleanup prevents memory leaks
  }

  ngOnDestroy() {
    // Signal all subscriptions to unsubscribe
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================
// EXAMPLE 10: Standalone Components (Angular 14+)
// ============================================================

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standalone-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <button (click)="increment()">+</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandaloneCounterComponent {
  count = 0;

  increment() {
    this.count++;
  }
}

// Benefits of Standalone:
// ✅ No NgModule required
// ✅ Clear dependencies
// ✅ Better tree-shaking
// ✅ Easier testing
// ✅ Modern approach

// ============================================================
// EXAMPLE 11: Content Projection Pattern
// ============================================================

@Component({
  selector: 'app-card-layout',
  template: `
    <div class="card">
      <div class="header">
        <ng-content select="[header]"></ng-content>
      </div>
      <div class="body">
        <ng-content></ng-content>
      </div>
      <div class="footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ccc; }
    .header { background: #f0f0f0; }
    .footer { text-align: right; }
  `]
})
export class CardLayoutComponent {}

// Usage:
/*
<app-card-layout>
  <div header>Header Content</div>
  <p>Main content</p>
  <div footer>Footer</div>
</app-card-layout>
*/

// ============================================================
// EXAMPLE 12: HOC Pattern (Higher-Order Component)
// ============================================================

// Decorator function for adding loading state
export function WithLoadingState(component: any) {
  @Component({
    selector: 'app-with-loading',
    template: `
      <div *ngIf="loading" class="spinner">Loading...</div>
      <div *ngIf="!loading">
        <ng-content></ng-content>
      </div>
    `
  })
  class WithLoadingComponent {
    @Input() loading = false;
  }
  return WithLoadingComponent;
}

// ============================================================
// EXAMPLE 13: Testing Presentational Components
// ============================================================

/**
 * Presentational components are easy to test:
 *
 * - No dependencies to mock
 * - Pure inputs/outputs
 * - Easy to set data and check output
 */

// Test example (conceptual):
/*
describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
  });

  it('should display product info', () => {
    component.product = {
      id: 1,
      name: 'Laptop',
      price: 999,
      image: 'laptop.jpg'
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Laptop');
    expect(compiled.textContent).toContain('999');
  });

  it('should emit addToCart event', () => {
    spyOn(component.addToCart, 'emit');
    component.onAddToCart();
    expect(component.addToCart.emit).toHaveBeenCalled();
  });
});
*/

// ============================================================
// EXAMPLE 14: Component Communication Architecture
// ============================================================

/**
 * PATTERN: Parent -> Child -> Action -> Parent
 *
 * 1. Parent provides data via @Input
 * 2. Child displays data
 * 3. User interacts with child
 * 4. Child emits @Output event
 * 5. Parent handles event
 * 6. Parent updates data
 * 7. @Input on child updates -> Change detection triggered
 */

// ============================================================
// Summary of Advanced Patterns
// ============================================================

/**
 * Change Detection:
 *
 * - Default: Checks all components on every change
 * - OnPush: Only checks when input changes or event occurs
 * - Use OnPush for performance in large apps
 *
 * Smart/Presentational:
 *
 * - Presentational: Pure UI, @Input/@Output, easy to test
 * - Smart: Business logic, manages state, orchestrates children
 * - Split for better organization and testability
 *
 * Performance:
 *
 * ✅ Use OnPush change detection
 * ✅ Use trackBy in *ngFor
 * ✅ Use immutable data patterns
 * ✅ Lazy load large components
 * ✅ Use change detection references carefully
 *
 * Best Practices:
 *
 * ✅ Prefer presentational components when possible
 * ✅ Keep smart components light
 * ✅ Use immutable patterns
 * ✅ Always unsubscribe
 * ✅ Use OnPush by default
 * ✅ Test presentational components thoroughly
 */
