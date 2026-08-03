/**
 * Checkout Service - E-Commerce System
 * Manages checkout process, payment, and order creation
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  throwError,
} from 'rxjs';
import {
  tap,
  catchError,
  shareReplay,
} from 'rxjs/operators';
import {
  CheckoutStep,
  CheckoutState,
  ShippingAddress,
  ShippingMethod,
  PaymentMethod,
  CreditCardDetails,
  Order,
  OrderConfirmation,
} from '../models/checkout.model';

/**
 * Injectable checkout service
 */
@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  // API endpoint
  private readonly apiUrl = '/api/checkout';

  // State subject
  private stateSubject$ = new BehaviorSubject<CheckoutState>(
    this.getInitialState()
  );
  public state$ = this.stateSubject$.asObservable().pipe(shareReplay(1));

  // Error subject
  private errorSubject$ = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject$.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get initial checkout state
   */
  private getInitialState(): CheckoutState {
    return {
      currentStep: CheckoutStep.SHIPPING,
      shippingAddress: null,
      shippingMethod: null,
      paymentMethod: null,
      creditCard: null,
      orderId: null,
      isProcessing: false,
      error: null,
      completedSteps: [],
    };
  }

  /**
   * Get current state
   */
  getCurrentState(): CheckoutState {
    return this.stateSubject$.value;
  }

  /**
   * Set shipping address
   */
  setShippingAddress(address: ShippingAddress): void {
    const currentState = this.getCurrentState();
    const newState: CheckoutState = {
      ...currentState,
      shippingAddress: address,
      completedSteps: [
        ...new Set([...currentState.completedSteps, CheckoutStep.SHIPPING]),
      ],
    };
    this.stateSubject$.next(newState);
  }

  /**
   * Get saved addresses
   */
  getSavedAddresses(): Observable<ShippingAddress[]> {
    return this.http
      .get<ShippingAddress[]>(`${this.apiUrl}/addresses`)
      .pipe(
        catchError((error) => this.handleError('fetching addresses', error))
      );
  }

  /**
   * Save new address
   */
  saveAddress(address: Partial<ShippingAddress>): Observable<ShippingAddress> {
    return this.http
      .post<ShippingAddress>(`${this.apiUrl}/addresses`, address)
      .pipe(
        tap((saved) => this.setShippingAddress(saved)),
        catchError((error) => this.handleError('saving address', error))
      );
  }

  /**
   * Validate address
   */
  validateAddress(address: ShippingAddress): Observable<boolean> {
    return this.http
      .post<{ valid: boolean }>(`${this.apiUrl}/validate-address`, address)
      .pipe(
        tap((result) => {
          if (!result.valid) {
            this.errorSubject$.next('Invalid shipping address');
          }
        }),
        catchError((error) => {
          this.errorSubject$.next('Error validating address');
          return throwError(() => error);
        })
      );
  }

  // ============================================================================
  // SHIPPING METHODS
  // ============================================================================

  /**
   * Get available shipping methods
   */
  getShippingMethods(address: ShippingAddress): Observable<ShippingMethod[]> {
    return this.http
      .post<ShippingMethod[]>(
        `${this.apiUrl}/shipping-methods`,
        address
      )
      .pipe(
        catchError((error) => this.handleError('fetching shipping methods', error))
      );
  }

  /**
   * Set shipping method
   */
  setShippingMethod(method: ShippingMethod): void {
    const currentState = this.getCurrentState();
    const newState: CheckoutState = {
      ...currentState,
      shippingMethod: method,
      completedSteps: [
        ...new Set([...currentState.completedSteps, CheckoutStep.SHIPPING]),
      ],
    };
    this.stateSubject$.next(newState);
  }

  // ============================================================================
  // PAYMENT METHODS
  // ============================================================================

  /**
   * Get saved payment methods
   */
  getSavedPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http
      .get<PaymentMethod[]>(`${this.apiUrl}/payment-methods`)
      .pipe(
        catchError((error) => this.handleError('fetching payment methods', error))
      );
  }

  /**
   * Set payment method
   */
  setPaymentMethod(method: PaymentMethod): void {
    const currentState = this.getCurrentState();
    const newState: CheckoutState = {
      ...currentState,
      paymentMethod: method,
      completedSteps: [
        ...new Set([...currentState.completedSteps, CheckoutStep.PAYMENT]),
      ],
    };
    this.stateSubject$.next(newState);
  }

  /**
   * Validate credit card
   */
  validateCreditCard(card: CreditCardDetails): Observable<boolean> {
    return this.http
      .post<{ valid: boolean }>(`${this.apiUrl}/validate-card`, card)
      .pipe(
        tap((result) => {
          if (!result.valid) {
            this.errorSubject$.next('Invalid credit card');
          }
        }),
        catchError((error) => {
          this.errorSubject$.next('Error validating card');
          return throwError(() => error);
        })
      );
  }

  /**
   * Save credit card (tokenized for security)
   */
  saveCreditCard(
    card: CreditCardDetails
  ): Observable<PaymentMethod> {
    // Never send raw card data - tokenize in production
    const tokenized = {
      ...card,
      cardNumber: card.cardNumber.slice(-4),
    };

    return this.http
      .post<PaymentMethod>(
        `${this.apiUrl}/payment-methods`,
        tokenized
      )
      .pipe(
        tap((method) => this.setPaymentMethod(method)),
        catchError((error) => this.handleError('saving card', error))
      );
  }

  // ============================================================================
  // ORDER PLACEMENT
  // ============================================================================

  /**
   * Process payment
   */
  processPayment(
    amount: number,
    method: PaymentMethod
  ): Observable<{ success: boolean; transactionId: string }> {
    return this.http
      .post<{ success: boolean; transactionId: string }>(
        `${this.apiUrl}/process-payment`,
        { amount, paymentMethodId: method.id }
      )
      .pipe(
        tap(() => {
          const currentState = this.getCurrentState();
          const newState: CheckoutState = {
            ...currentState,
            completedSteps: [
              ...new Set([
                ...currentState.completedSteps,
                CheckoutStep.PAYMENT,
              ]),
            ],
          };
          this.stateSubject$.next(newState);
        }),
        catchError((error) => {
          const message = error.error?.message || 'Payment failed';
          this.errorSubject$.next(message);
          return throwError(() => error);
        })
      );
  }

  /**
   * Create order
   */
  createOrder(): Observable<OrderConfirmation> {
    const state = this.getCurrentState();

    if (!state.shippingAddress || !state.shippingMethod) {
      return throwError(() => new Error('Incomplete checkout info'));
    }

    const orderData = {
      shippingAddress: state.shippingAddress,
      shippingMethod: state.shippingMethod,
      paymentMethod: state.paymentMethod,
    };

    return this.http
      .post<OrderConfirmation>(`${this.apiUrl}/orders`, orderData)
      .pipe(
        tap((confirmation) => {
          const currentState = this.getCurrentState();
          const newState: CheckoutState = {
            ...currentState,
            orderId: confirmation.orderId,
            currentStep: CheckoutStep.CONFIRMATION,
            completedSteps: [
              CheckoutStep.SHIPPING,
              CheckoutStep.PAYMENT,
              CheckoutStep.REVIEW,
              CheckoutStep.CONFIRMATION,
            ],
          };
          this.stateSubject$.next(newState);
        }),
        catchError((error) => {
          const message = error.error?.message || 'Error creating order';
          this.errorSubject$.next(message);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Observable<Order> {
    return this.http
      .get<Order>(`${this.apiUrl}/orders/${orderId}`)
      .pipe(
        catchError((error) => this.handleError('fetching order', error))
      );
  }

  // ============================================================================
  // CHECKOUT FLOW
  // ============================================================================

  /**
   * Go to step
   */
  goToStep(step: CheckoutStep): void {
    const currentState = this.getCurrentState();
    if (currentState.completedSteps.includes(step) || step === CheckoutStep.SHIPPING) {
      const newState: CheckoutState = {
        ...currentState,
        currentStep: step,
      };
      this.stateSubject$.next(newState);
    } else {
      this.errorSubject$.next('Complete previous steps first');
    }
  }

  /**
   * Next step
   */
  nextStep(): void {
    const currentState = this.getCurrentState();
    const nextStep = currentState.currentStep + 1;

    if (nextStep <= CheckoutStep.CONFIRMATION) {
      this.goToStep(nextStep);
    }
  }

  /**
   * Previous step
   */
  previousStep(): void {
    const currentState = this.getCurrentState();
    const prevStep = currentState.currentStep - 1;

    if (prevStep >= CheckoutStep.SHIPPING) {
      this.goToStep(prevStep);
    }
  }

  /**
   * Reset checkout
   */
  resetCheckout(): void {
    this.stateSubject$.next(this.getInitialState());
    this.errorSubject$.next(null);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Handle HTTP errors
   */
  private handleError(action: string, error: any): Observable<never> {
    console.error(`${action} error:`, error);
    const errorMessage = error?.error?.message || error?.message || `Error ${action}`;
    this.errorSubject$.next(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorSubject$.next(null);
  }

  /**
   * Get step status
   */
  isStepCompleted(step: CheckoutStep): boolean {
    return this.getCurrentState().completedSteps.includes(step);
  }

  /**
   * Can proceed to step
   */
  canProceedToStep(step: CheckoutStep): boolean {
    const currentState = this.getCurrentState();
    return (
      currentState.completedSteps.includes(step) ||
      step === CheckoutStep.SHIPPING
    );
  }
}
