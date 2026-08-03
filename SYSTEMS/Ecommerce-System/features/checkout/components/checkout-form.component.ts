/**
 * Checkout Form Component - E-Commerce System
 * Multi-step checkout wizard with address, shipping, and payment
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
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  takeUntil,
  tap,
  shareReplay,
} from 'rxjs/operators';
import { CheckoutService } from '../services/checkout.service';
import { CartService } from '../../cart/services/cart.service';
import {
  CheckoutStep,
  CheckoutState,
  ShippingAddress,
  ShippingMethod,
  PaymentMethod,
} from '../models/checkout.model';

/**
 * Checkout form component
 */
@Component({
  selector: 'app-checkout-form',
  template: `
    <div class="checkout-container">
      <!-- Header -->
      <header class="checkout-header">
        <h1>Checkout</h1>
        <div class="progress-bar">
          <div class="progress-step" 
               [class.active]="currentStep === 1"
               [class.completed]="isStepCompleted(1)">
            1. Shipping
          </div>
          <div class="progress-step"
               [class.active]="currentStep === 2"
               [class.completed]="isStepCompleted(2)">
            2. Payment
          </div>
          <div class="progress-step"
               [class.active]="currentStep === 3"
               [class.completed]="isStepCompleted(3)">
            3. Review
          </div>
          <div class="progress-step"
               [class.active]="currentStep === 4"
               [class.completed]="isStepCompleted(4)">
            4. Confirmation
          </div>
        </div>
      </header>

      <div class="checkout-content" *ngIf="state$ | async as state">
        <!-- Step 1: Shipping Address -->
        <section *ngIf="state.currentStep === 1" class="checkout-step">
          <h2>Shipping Address</h2>
          <form [formGroup]="shippingForm" (ngSubmit)="submitShipping()">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  class="form-input"
                />
                <span *ngIf="getError('firstName')" class="error">
                  {{ getError('firstName') }}
                </span>
              </div>

              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="phone">Phone *</label>
                <input
                  id="phone"
                  type="tel"
                  formControlName="phone"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="company">Company</label>
              <input
                id="company"
                type="text"
                formControlName="company"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="address">Address *</label>
              <input
                id="address"
                type="text"
                formControlName="addressLine1"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="address2">Address Line 2</label>
              <input
                id="address2"
                type="text"
                formControlName="addressLine2"
                class="form-input"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">City *</label>
                <input
                  id="city"
                  type="text"
                  formControlName="city"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="state">State *</label>
                <input
                  id="state"
                  type="text"
                  formControlName="state"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="zip">ZIP Code *</label>
                <input
                  id="zip"
                  type="text"
                  formControlName="zipCode"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="country">Country *</label>
              <select id="country" formControlName="country" class="form-input">
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
              </select>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!shippingForm.valid"
              >
                Continue to Shipping Method
              </button>
            </div>
          </form>
        </section>

        <!-- Step 2: Shipping Method -->
        <section *ngIf="state.currentStep === 2" class="checkout-step">
          <h2>Select Shipping Method</h2>
          <div *ngIf="shippingMethods$ | async as methods" class="methods-list">
            <div
              *ngFor="let method of methods"
              class="method-card"
              [class.selected]="state.shippingMethod?.id === method.id"
              (click)="selectShippingMethod(method)"
            >
              <div class="method-header">
                <h3>{{ method.name }}</h3>
                <span class="price">${{ method.price.toFixed(2) }}</span>
              </div>
              <p class="description">{{ method.description }}</p>
              <p class="delivery">
                Estimated delivery: {{ method.estimatedDays }} business days
              </p>
            </div>
          </div>

          <div class="form-actions">
            <button
              class="btn btn-secondary"
              (click)="goToStep(1)"
            >
              Back
            </button>
            <button
              class="btn btn-primary"
              (click)="goToStep(3)"
              [disabled]="!state.shippingMethod"
            >
              Continue to Payment
            </button>
          </div>
        </section>

        <!-- Step 3: Payment -->
        <section *ngIf="state.currentStep === 3" class="checkout-step">
          <h2>Payment Method</h2>

          <!-- Saved Payment Methods -->
          <div *ngIf="(savedPaymentMethods$ | async) as methods" class="methods-list">
            <h3>Saved Payment Methods</h3>
            <div
              *ngFor="let method of methods"
              class="method-card payment-card"
              [class.selected]="state.paymentMethod?.id === method.id"
              (click)="selectPaymentMethod(method)"
            >
              <span class="badge">{{ method.type }}</span>
              <p>{{ method.name }}</p>
              <p *ngIf="method.lastFour">**** {{ method.lastFour }}</p>
            </div>
          </div>

          <!-- Credit Card Form -->
          <h3>New Credit Card</h3>
          <form [formGroup]="cardForm" class="card-form">
            <div class="form-group">
              <label for="cardName">Cardholder Name *</label>
              <input
                id="cardName"
                type="text"
                formControlName="cardholderName"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="cardNumber">Card Number *</label>
              <input
                id="cardNumber"
                type="text"
                formControlName="cardNumber"
                placeholder="1234 5678 9012 3456"
                class="form-input"
                (input)="formatCardNumber($event)"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="expiry">Expiry Date *</label>
                <input
                  id="expiry"
                  type="text"
                  formControlName="expiry"
                  placeholder="MM/YY"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="cvc">CVC *</label>
                <input
                  id="cvc"
                  type="text"
                  formControlName="cvc"
                  placeholder="123"
                  class="form-input"
                  maxlength="4"
                />
              </div>
            </div>

            <label class="checkbox">
              <input type="checkbox" formControlName="saveCard" />
              Save card for future purchases
            </label>
          </form>

          <div class="form-actions">
            <button class="btn btn-secondary" (click)="goToStep(2)">
              Back
            </button>
            <button
              class="btn btn-primary"
              (click)="submitPayment()"
              [disabled]="!canSubmitPayment()"
            >
              Review Order
            </button>
          </div>
        </section>

        <!-- Step 4: Review & Confirm -->
        <section *ngIf="state.currentStep === 4" class="checkout-step review">
          <h2>Review Your Order</h2>

          <!-- Cart Summary -->
          <div class="order-summary">
            <h3>Order Items</h3>
            <div *ngIf="(cart$ | async) as cart">
              <div *ngFor="let item of cart.items" class="summary-item">
                <span>{{ item.product?.name }}</span>
                <span>x{{ item.quantity }}</span>
                <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Summary -->
          <div class="order-summary" *ngIf="state.shippingAddress">
            <h3>Shipping Address</h3>
            <p>{{ state.shippingAddress.firstName }}
               {{ state.shippingAddress.lastName }}</p>
            <p>{{ state.shippingAddress.addressLine1 }}</p>
            <p>{{ state.shippingAddress.city }},
               {{ state.shippingAddress.state }}
               {{ state.shippingAddress.zipCode }}</p>
          </div>

          <!-- Totals -->
          <div *ngIf="(cart$ | async) as cart" class="order-totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${{ cart.subtotal.toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>${{ (state.shippingMethod?.price || 0).toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span>${{ cart.tax.toFixed(2) }}</span>
            </div>
            <div class="total-row final">
              <span>Total:</span>
              <span>${{ (cart.total + (state.shippingMethod?.price || 0)).toFixed(2) }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" (click)="goToStep(3)">
              Back
            </button>
            <button
              class="btn btn-success"
              (click)="placeOrder()"
              [disabled]="state.isProcessing"
            >
              {{ state.isProcessing ? 'Processing...' : 'Place Order' }}
            </button>
          </div>
        </section>

        <!-- Step 5: Confirmation -->
        <section *ngIf="state.currentStep === 5" class="checkout-step confirmation">
          <div class="success-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p *ngIf="orderConfirmation$ | async as confirmation">
            Order #{{ confirmation.orderNumber }} has been placed successfully.
          </p>
          <p>You will receive a confirmation email shortly.</p>

          <div class="form-actions">
            <button class="btn btn-primary" routerLink="/orders">
              View Order
            </button>
            <button class="btn btn-secondary" routerLink="/products">
              Continue Shopping
            </button>
          </div>
        </section>
      </div>

      <!-- Error Banner -->
      <div *ngIf="(error$ | async) as error" class="error-banner">
        <p>{{ error }}</p>
        <button (click)="dismissError()" class="close-btn">×</button>
      </div>
    </div>
  `,
  styles: [
    `
      .checkout-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 24px;
      }

      .checkout-header {
        margin-bottom: 32px;
      }

      .progress-bar {
        display: flex;
        gap: 16px;
        margin-top: 16px;
      }

      .progress-step {
        flex: 1;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 4px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: #666;
      }

      .progress-step.active {
        background: #007bff;
        color: white;
      }

      .progress-step.completed {
        background: #28a745;
        color: white;
      }

      .checkout-step {
        margin-top: 32px;
        padding: 24px;
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-label,
      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        font-size: 14px;
      }

      .form-input,
      select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .methods-list {
        display: grid;
        gap: 12px;
        margin-top: 16px;
      }

      .method-card {
        padding: 16px;
        border: 2px solid #eee;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .method-card:hover {
        border-color: #007bff;
      }

      .method-card.selected {
        border-color: #007bff;
        background: #f0f8ff;
      }

      .method-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .method-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .price {
        font-weight: 700;
        color: #28a745;
      }

      .description,
      .delivery {
        margin: 4px 0;
        font-size: 12px;
        color: #666;
      }

      .form-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        justify-content: space-between;
      }

      .order-summary {
        background: #f9f9f9;
        padding: 16px;
        border-radius: 4px;
        margin-bottom: 16px;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }

      .order-totals {
        background: #f9f9f9;
        padding: 16px;
        border-radius: 4px;
        margin-bottom: 16px;
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
      }

      .total-row.final {
        border-top: 2px solid #eee;
        padding-top: 12px;
        font-weight: 700;
        font-size: 18px;
      }

      .confirmation {
        text-align: center;
      }

      .success-icon {
        font-size: 64px;
        margin-bottom: 16px;
      }

      .error-banner {
        background: #fff3cd;
        border: 1px solid #ffc107;
        padding: 12px 16px;
        border-radius: 4px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .checkbox {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .badge {
        display: inline-block;
        background: #007bff;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .progress-bar {
          flex-wrap: wrap;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutFormComponent implements OnInit, OnDestroy {
  // Forms
  shippingForm: FormGroup;
  cardForm: FormGroup;

  // Observables
  state$ = this.checkoutService.state$;
  error$ = this.checkoutService.error$;
  cart$ = this.cartService.cart$;
  shippingMethods$: Observable<ShippingMethod[]>;
  savedPaymentMethods$ = this.checkoutService.getSavedPaymentMethods();
  orderConfirmation$: Observable<any>;

  // State
  currentStep = 1;
  private destroy$ = new Subject<void>();

  constructor(
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.shippingForm = this.createShippingForm();
    this.cardForm = this.createCardForm();
    this.shippingMethods$ = new Observable<ShippingMethod[]>();
    this.orderConfirmation$ = new Observable();
  }

  ngOnInit(): void {
    this.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.currentStep = state.currentStep;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create shipping form
   */
  private createShippingForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      company: [''],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  /**
   * Create card form
   */
  private createCardForm(): FormGroup {
    return this.fb.group({
      cardholderName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expiry: ['', Validators.required],
      cvc: ['', Validators.required],
      saveCard: [false],
    });
  }

  /**
   * Submit shipping
   */
  submitShipping(): void {
    if (this.shippingForm.valid) {
      const address: ShippingAddress = {
        id: `addr-${Date.now()}`,
        ...this.shippingForm.value,
        isDefault: false,
      };
      this.checkoutService.setShippingAddress(address);
      this.shippingMethods$ = this.checkoutService.getShippingMethods(address);
      this.checkoutService.nextStep();
    }
  }

  /**
   * Select shipping method
   */
  selectShippingMethod(method: ShippingMethod): void {
    this.checkoutService.setShippingMethod(method);
  }

  /**
   * Select payment method
   */
  selectPaymentMethod(method: PaymentMethod): void {
    this.checkoutService.setPaymentMethod(method);
  }

  /**
   * Submit payment
   */
  submitPayment(): void {
    // Validate and save card
    this.checkoutService.nextStep();
  }

  /**
   * Format card number
   */
  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
  }

  /**
   * Can submit payment
   */
  canSubmitPayment(): boolean {
    const state = this.checkoutService.getCurrentState();
    return !!(state.paymentMethod || this.cardForm.valid);
  }

  /**
   * Place order
   */
  placeOrder(): void {
    this.checkoutService
      .createOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (confirmation) => {
          this.orderConfirmation$ = of(confirmation);
          this.checkoutService.nextStep();
        },
        error: (error) => console.error('Error placing order:', error),
      });
  }

  /**
   * Go to step
   */
  goToStep(step: number): void {
    this.checkoutService.goToStep(step);
  }

  /**
   * Is step completed
   */
  isStepCompleted(step: number): boolean {
    return this.checkoutService.isStepCompleted(step);
  }

  /**
   * Get form error
   */
  getError(fieldName: string): string | null {
    const control = this.shippingForm.get(fieldName);
    if (control && control.invalid && control.touched) {
      return 'This field is required';
    }
    return null;
  }

  /**
   * Dismiss error
   */
  dismissError(): void {
    this.checkoutService.clearError();
  }

  private of(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
