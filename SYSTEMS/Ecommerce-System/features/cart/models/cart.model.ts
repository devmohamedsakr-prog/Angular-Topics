/**
 * Cart Models - E-Commerce System
 * Defines interfaces for shopping cart, items, and checkout process
 */

import { Product, ProductVariant } from '../../products/models/product.model';

/**
 * Cart item interface
 */
export interface CartItem {
  id: string; // Unique item ID (product + variant combination)
  productId: string;
  product?: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number; // Price at time of adding
  discount?: number; // Discount percentage or amount
  total: number; // price * quantity - discount
  addedAt: Date;
  notes?: string;
}

/**
 * Shopping cart interface
 */
export interface Cart {
  id: string;
  userId: string | null; // null for guest
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // For guest carts
  metadata?: Record<string, any>;
}

/**
 * Add to cart request
 */
export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variantId?: string;
  notes?: string;
}

/**
 * Update cart item request
 */
export interface UpdateCartItemRequest {
  itemId: string;
  quantity?: number;
  notes?: string;
}

/**
 * Coupon/Discount code
 */
export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount?: number;
  expiresAt: Date;
  isActive: boolean;
}

/**
 * Cart state for state management
 */
export interface CartState {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  syncPending: boolean; // For offline support
  lastSynced: Date | null;
}

/**
 * Cart persistence (local storage)
 */
export interface CartPersistence {
  cartId: string;
  items: CartItem[];
  lastUpdated: number; // timestamp
  version: number; // For migration
}
