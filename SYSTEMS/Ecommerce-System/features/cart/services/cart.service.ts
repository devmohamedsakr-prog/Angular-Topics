/**
 * Cart Service - E-Commerce System
 * Manages shopping cart with persistence, sync, and state management
 */

import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  Subject,
  of,
  throwError,
  fromEvent,
} from 'rxjs';
import {
  map,
  tap,
  catchError,
  switchMap,
  startWith,
  debounceTime,
  distinctUntilChanged,
  shareReplay,
} from 'rxjs/operators';
import {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  DiscountCode,
  CartPersistence,
} from '../models/cart.model';

/**
 * Local storage key for cart persistence
 */
const CART_STORAGE_KEY = 'app_shopping_cart';
const CART_SYNC_KEY = 'app_cart_sync_pending';

/**
 * Injectable cart service
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  // API endpoint
  private readonly apiUrl = '/api/cart';

  // Cart subject
  private cartSubject$ = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject$.asObservable().pipe(shareReplay(1));

  // Items observables
  public items$ = this.cart$.pipe(
    map((cart) => cart?.items || []),
    shareReplay(1)
  );

  public itemCount$ = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.quantity, 0)),
    shareReplay(1)
  );

  public cartTotal$ = this.cart$.pipe(
    map((cart) => cart?.total || 0),
    shareReplay(1)
  );

  // Sync subject for offline support
  private syncSubject$ = new Subject<void>();

  // Local state
  private isLoading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.initializeCart();
    this.setupOnlineOfflineSync();
  }

  /**
   * Initialize cart from local storage or API
   */
  private initializeCart(): void {
    const savedCart = this.getPersistedCart();
    if (savedCart) {
      this.cartSubject$.next(savedCart);
    } else {
      this.loadCart().subscribe({
        error: (error) => {
          console.error('Error loading cart:', error);
          // Initialize empty cart
          this.cartSubject$.next(this.createEmptyCart());
        },
      });
    }
  }

  /**
   * Setup online/offline sync
   */
  private setupOnlineOfflineSync(): void {
    fromEvent(window, 'online')
      .pipe(
        startWith(navigator.onLine),
        switchMap((isOnline: any) => {
          if (isOnline === true || navigator.onLine) {
            return this.syncCart();
          }
          return of(null);
        })
      )
      .subscribe({
        error: (error) => console.error('Sync error:', error),
      });
  }

  // ============================================================================
  // CART OPERATIONS
  // ============================================================================

  /**
   * Load cart from API
   */
  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}`).pipe(
      tap((cart) => {
        this.cartSubject$.next(cart);
        this.persistCart(cart);
      }),
      catchError((error) => {
        this.error$.next(error.message || 'Error loading cart');
        return throwError(() => error);
      })
    );
  }

  /**
   * Add item to cart
   */
  addItem(request: AddToCartRequest): Observable<Cart> {
    const currentCart = this.cartSubject$.value || this.createEmptyCart();
    this.isLoading$.next(true);

    // Optimistic update for offline support
    const newCart = this.addItemToCart(currentCart, request);
    this.cartSubject$.next(newCart);
    this.persistCart(newCart);

    // Sync with server
    return this.http
      .post<Cart>(`${this.apiUrl}/items`, request)
      .pipe(
        tap((cart) => {
          this.cartSubject$.next(cart);
          this.persistCart(cart);
          this.isLoading$.next(false);
        }),
        catchError((error) => {
          this.error$.next(error.message || 'Error adding item');
          this.isLoading$.next(false);
          // Keep optimistic update for offline
          return of(newCart);
        })
      );
  }

  /**
   * Update cart item
   */
  updateItem(request: UpdateCartItemRequest): Observable<Cart> {
    const currentCart = this.cartSubject$.value;
    if (!currentCart) return throwError(() => new Error('Cart not loaded'));

    // Optimistic update
    const newCart = this.updateItemInCart(currentCart, request);
    this.cartSubject$.next(newCart);
    this.persistCart(newCart);

    // Sync with server
    return this.http
      .patch<Cart>(`${this.apiUrl}/items/${request.itemId}`, request)
      .pipe(
        tap((cart) => {
          this.cartSubject$.next(cart);
          this.persistCart(cart);
        }),
        catchError((error) => {
          this.error$.next(error.message || 'Error updating item');
          return of(newCart);
        })
      );
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): Observable<Cart> {
    const currentCart = this.cartSubject$.value;
    if (!currentCart) return throwError(() => new Error('Cart not loaded'));

    // Optimistic update
    const newCart = this.removeItemFromCart(currentCart, itemId);
    this.cartSubject$.next(newCart);
    this.persistCart(newCart);

    // Sync with server
    return this.http
      .delete<Cart>(`${this.apiUrl}/items/${itemId}`)
      .pipe(
        tap((cart) => {
          this.cartSubject$.next(cart);
          this.persistCart(cart);
        }),
        catchError((error) => {
          this.error$.next(error.message || 'Error removing item');
          return of(newCart);
        })
      );
  }

  /**
   * Clear cart
   */
  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`).pipe(
      tap(() => {
        this.cartSubject$.next(this.createEmptyCart());
        this.removePersistedCart();
      }),
      catchError((error) => {
        this.error$.next(error.message || 'Error clearing cart');
        return throwError(() => error);
      })
    );
  }

  // ============================================================================
  // DISCOUNT/COUPON OPERATIONS
  // ============================================================================

  /**
   * Apply coupon code
   */
  applyCoupon(couponCode: string): Observable<Cart> {
    return this.http
      .post<Cart>(`${this.apiUrl}/coupon`, { code: couponCode })
      .pipe(
        tap((cart) => {
          this.cartSubject$.next(cart);
          this.persistCart(cart);
        }),
        catchError((error) => {
          this.error$.next(
            error.error?.message || 'Invalid or expired coupon'
          );
          return throwError(() => error);
        })
      );
  }

  /**
   * Remove coupon
   */
  removeCoupon(): Observable<Cart> {
    const currentCart = this.cartSubject$.value;
    if (!currentCart) return throwError(() => new Error('Cart not loaded'));

    const updatedCart = {
      ...currentCart,
      couponCode: undefined,
      discount: 0,
      total: currentCart.subtotal + currentCart.tax + currentCart.shipping,
    };

    return this.http.delete<Cart>(`${this.apiUrl}/coupon`).pipe(
      tap((cart) => {
        this.cartSubject$.next(cart);
        this.persistCart(cart);
      }),
      catchError((error) => {
        this.error$.next(error.message || 'Error removing coupon');
        return of(updatedCart);
      })
    );
  }

  /**
   * Update shipping method
   */
  updateShipping(shippingMethodId: string): Observable<Cart> {
    return this.http
      .patch<Cart>(`${this.apiUrl}/shipping`, { shippingMethodId })
      .pipe(
        tap((cart) => {
          this.cartSubject$.next(cart);
          this.persistCart(cart);
        }),
        catchError((error) => {
          this.error$.next(error.message || 'Error updating shipping');
          return throwError(() => error);
        })
      );
  }

  // ============================================================================
  // PERSISTENCE & SYNC
  // ============================================================================

  /**
   * Persist cart to local storage
   */
  private persistCart(cart: Cart): void {
    try {
      const persistence: CartPersistence = {
        cartId: cart.id,
        items: cart.items,
        lastUpdated: Date.now(),
        version: 1,
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(persistence));
    } catch (error) {
      console.error('Error persisting cart:', error);
    }
  }

  /**
   * Get persisted cart from local storage
   */
  private getPersistedCart(): Cart | null {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) return null;

      const persistence: CartPersistence = JSON.parse(stored);
      return {
        id: persistence.cartId,
        userId: null,
        items: persistence.items,
        subtotal: this.calculateSubtotal(persistence.items),
        tax: 0,
        shipping: 0,
        discount: 0,
        total: this.calculateSubtotal(persistence.items),
        createdAt: new Date(),
        updatedAt: new Date(persistence.lastUpdated),
      };
    } catch (error) {
      console.error('Error retrieving persisted cart:', error);
      return null;
    }
  }

  /**
   * Remove persisted cart
   */
  private removePersistedCart(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing persisted cart:', error);
    }
  }

  /**
   * Sync cart (for offline support)
   */
  private syncCart(): Observable<Cart> {
    const currentCart = this.cartSubject$.value;
    if (!currentCart) return of(null as any);

    return this.http.post<Cart>(`${this.apiUrl}/sync`, currentCart).pipe(
      tap((cart) => {
        this.cartSubject$.next(cart);
        this.persistCart(cart);
      }),
      catchError((error) => {
        console.error('Sync error:', error);
        return of(currentCart);
      })
    );
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Add item to cart object
   */
  private addItemToCart(cart: Cart, request: AddToCartRequest): Cart {
    const itemId = `${request.productId}-${request.variantId || 'default'}`;
    const existingItem = cart.items.find((item) => item.id === itemId);

    let items: CartItem[];
    if (existingItem) {
      items = cart.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + request.quantity }
          : item
      );
    } else {
      items = [
        ...cart.items,
        {
          id: itemId,
          productId: request.productId,
          variantId: request.variantId,
          quantity: request.quantity,
          price: 0, // Set from product
          total: 0,
          addedAt: new Date(),
          notes: request.notes,
        },
      ];
    }

    return this.recalculateCart({ ...cart, items });
  }

  /**
   * Update item in cart
   */
  private updateItemInCart(
    cart: Cart,
    request: UpdateCartItemRequest
  ): Cart {
    const items = cart.items.map((item) =>
      item.id === request.itemId
        ? {
            ...item,
            quantity: request.quantity || item.quantity,
            notes: request.notes || item.notes,
          }
        : item
    );

    return this.recalculateCart({ ...cart, items });
  }

  /**
   * Remove item from cart
   */
  private removeItemFromCart(cart: Cart, itemId: string): Cart {
    const items = cart.items.filter((item) => item.id !== itemId);
    return this.recalculateCart({ ...cart, items });
  }

  /**
   * Recalculate cart totals
   */
  private recalculateCart(cart: Cart): Cart {
    const subtotal = this.calculateSubtotal(cart.items);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax + cart.shipping - cart.discount;

    return {
      ...cart,
      subtotal,
      tax,
      total,
      updatedAt: new Date(),
    };
  }

  /**
   * Calculate cart subtotal
   */
  private calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  /**
   * Create empty cart
   */
  private createEmptyCart(): Cart {
    return {
      id: `cart-${Date.now()}`,
      userId: null,
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Get current cart value
   */
  getCurrentCart(): Cart | null {
    return this.cartSubject$.value;
  }

  /**
   * Get loading state
   */
  getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  /**
   * Get error state
   */
  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }
}
