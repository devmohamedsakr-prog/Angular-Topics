/**
 * Cart View Component - E-Commerce System
 * Displays shopping cart with items, totals, and actions
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  Observable,
  Subject,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import {
  takeUntil,
  map,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import { Cart, CartItem } from '../models/cart.model';

/**
 * Cart view component
 */
@Component({
  selector: 'app-cart-view',
  template: `
    <div class="cart-container">
      <!-- Header -->
      <header class="cart-header">
        <h1>Shopping Cart</h1>
        <a href="/products" class="continue-shopping">← Continue Shopping</a>
      </header>

      <!-- Cart Content -->
      <div class="cart-content" *ngIf="cart$ | async as cart">
        <!-- Empty Cart -->
        <div *ngIf="cart.items.length === 0" class="empty-cart">
          <div class="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <a href="/products" class="btn btn-primary">Browse Products</a>
        </div>

        <!-- Cart Items -->
        <div *ngIf="cart.items.length > 0" class="cart-grid">
          <!-- Items Column -->
          <div class="items-column">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of cart.items; trackBy: trackByItemId">
                  <td class="product-info">
                    <img *ngIf="item.product" [src]="item.product.thumbnail" 
                         [alt]="item.product.name" class="product-image" />
                    <div>
                      <strong>{{ item.product?.name || 'Product' }}</strong>
                      <p *ngIf="item.variant">Variant: {{ item.variant.value }}</p>
                    </div>
                  </td>
                  <td>${{ item.price.toFixed(2) }}</td>
                  <td class="quantity-control">
                    <button (click)="decrementQuantity(item)" 
                            [disabled]="item.quantity <= 1"
                            class="qty-btn">-</button>
                    <input type="number" 
                           [(ngModel)]="item.quantity"
                           min="1"
                           (change)="updateQuantity(item)"
                           class="qty-input" />
                    <button (click)="incrementQuantity(item)" class="qty-btn">+</button>
                  </td>
                  <td class="item-total">${{ item.total.toFixed(2) }}</td>
                  <td>
                    <button (click)="removeItem(item)" 
                            class="btn-remove"
                            aria-label="Remove item">
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Continue Shopping -->
            <div class="actions">
              <button class="btn btn-secondary" [routerLink]="['/products']">
                Continue Shopping
              </button>
              <button class="btn btn-danger" 
                      (click)="clearCart()"
                      [disabled]="!(cart.items | async)?.length">
                Clear Cart
              </button>
            </div>
          </div>

          <!-- Summary Column -->
          <aside class="summary-column">
            <!-- Cart Summary -->
            <div class="summary-card">
              <h2>Order Summary</h2>
              
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${{ cart.subtotal.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Tax (10%):</span>
                <span>${{ cart.tax.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>Shipping:</span>
                <span>${{ cart.shipping.toFixed(2) }}</span>
              </div>

              <div *ngIf="cart.discount > 0" class="summary-row discount">
                <span>Discount:</span>
                <span>-${{ cart.discount.toFixed(2) }}</span>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row total">
                <span>Total:</span>
                <span>${{ cart.total.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Coupon -->
            <div class="coupon-card">
              <h3>Have a coupon?</h3>
              <form [formGroup]="couponForm" (ngSubmit)="applyCoupon()" class="coupon-form">
                <input type="text" 
                       formControlName="coupon"
                       placeholder="Enter coupon code"
                       class="coupon-input" />
                <button type="submit" 
                        class="btn btn-small"
                        [disabled]="!couponForm.valid">
                  Apply
                </button>
              </form>
              <small *ngIf="couponError$ | async as error" class="error">
                {{ error }}
              </small>
            </div>

            <!-- Proceed -->
            <button class="btn btn-primary btn-block" 
                    (click)="proceedToCheckout()"
                    [disabled]="!(cart.items | async)?.length">
              Proceed to Checkout
            </button>

            <!-- Save for Later -->
            <button class="btn btn-outline btn-block"
                    (click)="saveForLater()">
              Save Cart for Later
            </button>

            <!-- Trust Badges -->
            <div class="trust-badges">
              <p>✓ Secure Checkout</p>
              <p>✓ Free Returns</p>
              <p>✓ 24/7 Support</p>
            </div>
          </aside>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="(loading$ | async)" class="loading">
        <div class="spinner"></div>
        <p>Updating cart...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="(error$ | async) as error" class="error-banner">
        <p>{{ error }}</p>
        <button (click)="dismissError()" class="close-btn">×</button>
      </div>
    </div>
  `,
  styles: [
    `
      .cart-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
      }

      .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        border-bottom: 2px solid #eee;
        padding-bottom: 16px;
      }

      .cart-header h1 {
        margin: 0;
        font-size: 28px;
      }

      .continue-shopping {
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
      }

      /* Empty Cart */
      .empty-cart {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }

      .empty-cart h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
      }

      .empty-cart p {
        color: #666;
        margin-bottom: 24px;
      }

      /* Grid Layout */
      .cart-grid {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 24px;
      }

      /* Items Column */
      .items-column {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
      }

      .items-table th {
        text-align: left;
        padding: 12px;
        border-bottom: 2px solid #eee;
        font-weight: 600;
      }

      .items-table td {
        padding: 16px 12px;
        border-bottom: 1px solid #eee;
      }

      .product-info {
        display: flex;
        gap: 12px;
      }

      .product-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
      }

      .quantity-control {
        display: flex;
        gap: 4px;
        align-items: center;
      }

      .qty-btn {
        width: 32px;
        height: 32px;
        padding: 0;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
      }

      .qty-btn:hover:not(:disabled) {
        background: #f5f5f5;
      }

      .qty-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .qty-input {
        width: 50px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 4px;
      }

      .item-total {
        font-weight: 600;
      }

      .btn-remove {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
      }

      .actions {
        display: flex;
        gap: 12px;
        margin-top: 16px;
      }

      /* Summary Column */
      .summary-column {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .summary-card,
      .coupon-card {
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 20px;
      }

      .summary-card h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
      }

      .coupon-card h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 14px;
      }

      .summary-row.discount {
        color: #28a745;
      }

      .summary-divider {
        height: 1px;
        background: #ddd;
        margin: 12px 0;
      }

      .summary-row.total {
        font-size: 18px;
        font-weight: 700;
        padding: 8px 0;
      }

      .coupon-form {
        display: flex;
        gap: 8px;
      }

      .coupon-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .btn-block {
        width: 100%;
      }

      .btn-outline {
        background: white;
        color: #007bff;
        border: 1px solid #007bff;
      }

      .trust-badges {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #666;
      }

      .trust-badges p {
        margin: 4px 0;
      }

      /* Loading & Error */
      .loading {
        text-align: center;
        padding: 40px;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }

      .error-banner {
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 4px;
        padding: 12px 16px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Responsive */
      @media (max-width: 768px) {
        .cart-grid {
          grid-template-columns: 1fr;
        }

        .items-table {
          font-size: 12px;
        }

        .items-table td {
          padding: 8px;
        }

        .product-image {
          width: 40px;
          height: 40px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartViewComponent implements OnInit, OnDestroy {
  // Observables
  cart$ = this.cartService.cart$;
  loading$ = this.cartService.getLoading();
  error$: Observable<string | null>;
  couponError$ = new BehaviorSubject<string | null>(null);

  // Form
  couponForm: FormGroup;

  // State
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.couponForm = this.fb.group({
      coupon: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.error$ = this.cartService.getError();
  }

  ngOnInit(): void {
    // Load cart on init
    this.cartService.loadCart().subscribe({
      error: (error) => console.error('Error loading cart:', error),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Update item quantity
   */
  updateQuantity(item: CartItem): void {
    if (item.quantity < 1) {
      this.removeItem(item);
      return;
    }

    this.cartService
      .updateItem({ itemId: item.id, quantity: item.quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Error updating quantity:', error),
      });
  }

  /**
   * Increment quantity
   */
  incrementQuantity(item: CartItem): void {
    item.quantity++;
    this.updateQuantity(item);
  }

  /**
   * Decrement quantity
   */
  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateQuantity(item);
    }
  }

  /**
   * Remove item from cart
   */
  removeItem(item: CartItem): void {
    this.cartService
      .removeItem(item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Error removing item:', error),
      });
  }

  /**
   * Apply coupon
   */
  applyCoupon(): void {
    const coupon = this.couponForm.get('coupon')?.value;
    if (!coupon) return;

    this.cartService
      .applyCoupon(coupon)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.couponForm.reset();
          this.couponError$.next(null);
        },
        error: (error) => {
          this.couponError$.next(error.message || 'Invalid coupon');
        },
      });
  }

  /**
   * Clear cart
   */
  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService
        .clearCart()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => console.error('Error clearing cart:', error),
        });
    }
  }

  /**
   * Proceed to checkout
   */
  proceedToCheckout(): void {
    const cart = this.cartService.getCurrentCart();
    if (cart && cart.items.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }

  /**
   * Save cart for later
   */
  saveForLater(): void {
    // Implementation for saving cart
    alert('Cart saved! You can continue shopping later.');
  }

  /**
   * Dismiss error
   */
  dismissError(): void {
    // Implementation to dismiss error
  }

  /**
   * TrackBy function
   */
  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  private takeUntil(arg0: Subject<void>) {
    throw new Error('Method not implemented.');
  }
}
