/**
 * Order Tracking Service - E-Commerce System
 * Manages order tracking with WebSocket real-time updates
 */

import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  Subject,
  WebSocketSubject,
  of,
  throwError,
} from 'rxjs';
import {
  map,
  tap,
  catchError,
  switchMap,
  shareReplay,
  retry,
  reconnect,
  filter,
  startWith,
} from 'rxjs/operators';
import {
  OrderStatus,
  OrderStatusEvent,
  TrackingEvent,
  OrderWithTracking,
  RealTimeTrackingUpdate,
  WebSocketMessage,
} from '../models/order-tracking.model';

/**
 * Order tracking service with WebSocket support
 */
@Injectable({
  providedIn: 'root',
})
export class OrderTrackingService implements OnDestroy {
  // API endpoint
  private readonly apiUrl = '/api/orders';
  private readonly wsUrl = 'wss://api.example.com/tracking';

  // State subjects
  private ordersSubject$ = new BehaviorSubject<OrderWithTracking[]>([]);
  public orders$ = this.ordersSubject$.asObservable().pipe(shareReplay(1));

  private selectedOrderSubject$ = new BehaviorSubject<OrderWithTracking | null>(null);
  public selectedOrder$ = this.selectedOrderSubject$.asObservable().pipe(shareReplay(1));

  // WebSocket
  private ws$: WebSocketSubject<WebSocketMessage> | null = null;
  private wsConnected$ = new BehaviorSubject<boolean>(false);
  private subscribedOrders$ = new BehaviorSubject<Set<string>>(new Set());

  // Real-time updates
  private trackingUpdates$ = new Subject<RealTimeTrackingUpdate>();
  public trackingUpdates = this.trackingUpdates$.asObservable();

  // Error handling
  private errorSubject$ = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject$.asObservable();

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.closeWebSocket();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================================
  // ORDER RETRIEVAL
  // ============================================================================

  /**
   * Get all orders for user
   */
  getOrders(): Observable<OrderWithTracking[]> {
    return this.http.get<OrderWithTracking[]>(`${this.apiUrl}`).pipe(
      tap((orders) => {
        this.ordersSubject$.next(orders);
        // Auto-subscribe to WebSocket for all orders
        orders.forEach((order) => this.subscribeToOrder(order.id));
      }),
      catchError((error) => this.handleError('fetching orders', error))
    );
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Observable<OrderWithTracking> {
    return this.http.get<OrderWithTracking>(`${this.apiUrl}/${orderId}`).pipe(
      tap((order) => {
        this.selectedOrderSubject$.next(order);
        this.subscribeToOrder(orderId);
      }),
      catchError((error) => this.handleError('fetching order', error))
    );
  }

  /**
   * Get order by tracking number
   */
  getOrderByTrackingNumber(
    trackingNumber: string
  ): Observable<OrderWithTracking> {
    return this.http
      .get<OrderWithTracking>(`${this.apiUrl}/tracking/${trackingNumber}`)
      .pipe(
        tap((order) => this.subscribeToOrder(order.id)),
        catchError((error) =>
          this.handleError('fetching order by tracking number', error)
        )
      );
  }

  // ============================================================================
  // TRACKING STATUS
  // ============================================================================

  /**
   * Get order status events
   */
  getStatusEvents(orderId: string): Observable<OrderStatusEvent[]> {
    return this.http
      .get<OrderStatusEvent[]>(`${this.apiUrl}/${orderId}/status-events`)
      .pipe(
        catchError((error) => this.handleError('fetching status events', error))
      );
  }

  /**
   * Get tracking events
   */
  getTrackingEvents(orderId: string): Observable<TrackingEvent[]> {
    return this.http
      .get<TrackingEvent[]>(`${this.apiUrl}/${orderId}/tracking-events`)
      .pipe(
        catchError((error) => this.handleError('fetching tracking events', error))
      );
  }

  /**
   * Get current status
   */
  getCurrentStatus(orderId: string): Observable<OrderStatus> {
    return this.getOrder(orderId).pipe(
      map((order) => order.status),
      catchError((error) =>
        this.handleError('fetching current status', error)
      )
    );
  }

  /**
   * Get estimated delivery
   */
  getEstimatedDelivery(orderId: string): Observable<Date> {
    return this.getOrder(orderId).pipe(
      map((order) => order.estimatedDelivery),
      catchError((error) =>
        this.handleError('fetching estimated delivery', error)
      )
    );
  }

  // ============================================================================
  // WEBSOCKET REAL-TIME TRACKING
  // ============================================================================

  /**
   * Connect to WebSocket
   */
  connectToWebSocket(): void {
    if (this.ws$ && this.wsConnected$.value) return;

    try {
      this.ws$ = new WebSocketSubject<WebSocketMessage>({
        url: this.wsUrl,
        openObserver: {
          next: () => {
            console.log('WebSocket connected');
            this.wsConnected$.next(true);
            this.sendPing();
          },
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket disconnected');
            this.wsConnected$.next(false);
            // Attempt reconnect
            setTimeout(() => this.connectToWebSocket(), 5000);
          },
        },
      });

      // Listen for messages
      this.ws$
        .pipe(
          filter((msg) => msg.type === 'update'),
          switchMap((msg) => {
            if (msg.data) {
              this.trackingUpdates$.next(msg.data);
              return this.updateOrderWithTracking(msg.data.orderId, msg.data);
            }
            return of(null);
          }),
          retry({ delay: 5000, count: 3 })
        )
        .subscribe({
          error: (error) => console.error('WebSocket error:', error),
        });
    } catch (error) {
      this.errorSubject$.next('Error connecting to WebSocket');
    }
  }

  /**
   * Subscribe to order tracking
   */
  subscribeToOrder(orderId: string): void {
    this.connectToWebSocket();

    const currentSubs = this.subscribedOrders$.value;
    if (!currentSubs.has(orderId)) {
      currentSubs.add(orderId);
      this.subscribedOrders$.next(new Set(currentSubs));

      if (this.ws$) {
        this.ws$.next({
          type: 'subscribe',
          orderId,
          timestamp: Date.now(),
        });
      }
    }
  }

  /**
   * Unsubscribe from order tracking
   */
  unsubscribeFromOrder(orderId: string): void {
    const currentSubs = this.subscribedOrders$.value;
    if (currentSubs.has(orderId)) {
      currentSubs.delete(orderId);
      this.subscribedOrders$.next(new Set(currentSubs));

      if (this.ws$) {
        this.ws$.next({
          type: 'unsubscribe',
          orderId,
          timestamp: Date.now(),
        });
      }

      // Close WebSocket if no subscriptions
      if (currentSubs.size === 0) {
        this.closeWebSocket();
      }
    }
  }

  /**
   * Close WebSocket connection
   */
  closeWebSocket(): void {
    if (this.ws$) {
      this.ws$.complete();
      this.ws$ = null;
      this.wsConnected$.next(false);
    }
  }

  /**
   * Send ping to keep connection alive
   */
  private sendPing(): void {
    if (this.ws$ && this.wsConnected$.value) {
      this.ws$.next({
        type: 'ping',
        timestamp: Date.now(),
      });

      // Send ping every 30 seconds
      setTimeout(() => this.sendPing(), 30000);
    }
  }

  /**
   * Update order with tracking data
   */
  private updateOrderWithTracking(
    orderId: string,
    update: RealTimeTrackingUpdate
  ): Observable<void> {
    const orders = this.ordersSubject$.value;
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex !== -1) {
      const updatedOrder = {
        ...orders[orderIndex],
        status: update.status,
        currentLocation: update.location,
        estimatedDelivery: update.estimatedDelivery || orders[orderIndex].estimatedDelivery,
        trackingEvents: [
          update.event,
          ...orders[orderIndex].trackingEvents,
        ],
        updatedAt: update.timestamp,
      };

      const updatedOrders = [
        ...orders.slice(0, orderIndex),
        updatedOrder,
        ...orders.slice(orderIndex + 1),
      ];

      this.ordersSubject$.next(updatedOrders);

      // Update selected order if it's the same
      if (this.selectedOrderSubject$.value?.id === orderId) {
        this.selectedOrderSubject$.next(updatedOrder);
      }
    }

    return of(void 0);
  }

  // ============================================================================
  // POLLING FALLBACK (for environments without WebSocket)
  // ============================================================================

  /**
   * Poll for order updates (fallback)
   */
  pollOrderUpdates(
    orderId: string,
    intervalMs: number = 60000
  ): Observable<OrderWithTracking> {
    return new Observable((observer) => {
      const pollInterval = setInterval(() => {
        this.getOrder(orderId).subscribe({
          next: (order) => observer.next(order),
          error: (error) => observer.error(error),
        });
      }, intervalMs);

      return () => clearInterval(pollInterval);
    });
  }

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  /**
   * Enable delivery notifications
   */
  enableNotifications(orderId: string): Observable<{ enabled: boolean }> {
    return this.http
      .post<{ enabled: boolean }>(
        `${this.apiUrl}/${orderId}/notifications`,
        { enabled: true }
      )
      .pipe(
        catchError((error) => this.handleError('enabling notifications', error))
      );
  }

  /**
   * Disable delivery notifications
   */
  disableNotifications(orderId: string): Observable<{ enabled: boolean }> {
    return this.http
      .post<{ enabled: boolean }>(
        `${this.apiUrl}/${orderId}/notifications`,
        { enabled: false }
      )
      .pipe(
        catchError((error) => this.handleError('disabling notifications', error))
      );
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Is order delivered
   */
  isOrderDelivered(orderId: string): Observable<boolean> {
    return this.getOrder(orderId).pipe(
      map((order) => order.isDelivered),
      catchError(() => of(false))
    );
  }

  /**
   * Get tracking history
   */
  getTrackingHistory(
    orderId: string
  ): Observable<{ status: OrderStatus; timestamp: Date; location?: string }[]> {
    return this.getStatusEvents(orderId).pipe(
      map((events) =>
        events.map((event) => ({
          status: event.status,
          timestamp: event.timestamp,
          location: event.location,
        }))
      ),
      catchError(() => of([]))
    );
  }

  /**
   * Handle errors
   */
  private handleError(action: string, error: any): Observable<never> {
    console.error(`${action} error:`, error);
    const errorMessage = error?.error?.message || error?.message || `Error ${action}`;
    this.errorSubject$.next(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Get WebSocket connection status
   */
  getConnectionStatus(): Observable<boolean> {
    return this.wsConnected$.asObservable();
  }

  /**
   * Get subscribed orders
   */
  getSubscribedOrders(): Observable<Set<string>> {
    return this.subscribedOrders$.asObservable();
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorSubject$.next(null);
  }
}
