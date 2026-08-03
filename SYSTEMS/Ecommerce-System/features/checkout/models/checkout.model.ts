/**
 * Checkout Models - E-Commerce System
 * Defines interfaces for checkout process, shipping, and payment
 */

/**
 * Shipping address
 */
export interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

/**
 * Shipping method
 */
export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  isAvailable: boolean;
}

/**
 * Payment method
 */
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe';
  name: string;
  lastFour?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

/**
 * Credit card details
 */
export interface CreditCardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
  billingAddress: ShippingAddress;
  saveCard: boolean;
}

/**
 * Checkout step
 */
export enum CheckoutStep {
  SHIPPING = 1,
  PAYMENT = 2,
  REVIEW = 3,
  CONFIRMATION = 4,
}

/**
 * Checkout state
 */
export interface CheckoutState {
  currentStep: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  shippingMethod: ShippingMethod | null;
  paymentMethod: PaymentMethod | null;
  creditCard: CreditCardDetails | null;
  orderId: string | null;
  isProcessing: boolean;
  error: string | null;
  completedSteps: CheckoutStep[];
}

/**
 * Order
 */
export interface Order {
  id: string;
  userId: string | null;
  orderNumber: string;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
}

/**
 * Order confirmation
 */
export interface OrderConfirmation {
  orderId: string;
  orderNumber: string;
  total: number;
  estimatedDelivery: Date;
  confirmationEmail: string;
  receiptUrl: string;
}
