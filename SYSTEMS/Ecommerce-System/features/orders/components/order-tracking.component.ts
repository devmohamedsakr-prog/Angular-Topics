/**
 * Order Tracking Component - E-Commerce System
 * Real-time order tracking with WebSocket updates
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, shareReplay, map } from 'rxjs/operators';
import { OrderTrackingService } from '../services/order-tracking.service';
import {
  OrderWithTracking,
  OrderStatus,
  TrackingEvent,
  RealTimeTrackingUpdate,
} from '../models/order-tracking.model';

/**
 * Order tracking component
 */
@Component({
  selector: 'app-order-tracking',
  template: `
    <div class="tracking-container">
      <!-- Header -->
      <header class="tracking-header">
        <h1>Order Tracking</h1>
        <p class="connection-status" [class]="(wsConnected$ | async) ? 'connected' : 'disconnected'">
          {{ (wsConnected$ | async) ? '🟢 Live' : '⚪ Polling' }}
        </p>
      </header>

      <!-- Order Details -->
      <div *ngIf="order$ | async as order" class="order-details">
        <!-- Summary Card -->
        <div class="summary-card">
          <div class="summary-row">
            <span>Order Number:</span>
            <strong>{{ order.orderNumber }}</strong>
          </div>
          <div class="summary-row">
            <span>Status:</span>
            <span class="status-badge" [class]="order.status">
              {{ order.status | titlecase }}
            </span>
          </div>
          <div class="summary-row">
            <span>Tracking Number:</span>
            <strong>{{ order.trackingNumber }}</strong>
          </div>
          <div class="summary-row">
            <span>Carrier:</span>
            <strong>{{ order.carrier }}</strong>
          </div>
          <div class="summary-row">
            <span>Estimated Delivery:</span>
            <strong>{{ order.estimatedDelivery | date: 'MMM dd, yyyy' }}</strong>
          </div>
        </div>

        <!-- Location Map Card -->
        <div class="location-card" *ngIf="order.currentLocation">
          <h2>Current Location</h2>
          <div class="location-info">
            📍 {{ order.currentLocation }}
          </div>
          <p class="updated-time">
            Last update: {{ order.updatedAt | date: 'short' }}
          </p>
        </div>

        <!-- Timeline -->
        <div class="timeline">
          <h2>Delivery Timeline</h2>
          <div class="timeline-container">
            <div
              *ngFor="let event of order.trackingEvents; let last = last"
              class="timeline-item"
              [class.latest]="!last"
            >
              <div class="timeline-marker" [class]="event.eventType"></div>
              <div class="timeline-content">
                <h3>{{ event.title }}</h3>
                <p>{{ event.description }}</p>
                <p *ngIf="event.location" class="location">
                  📍 {{ event.location.city }}, {{ event.location.state }}
                </p>
                <small class="timestamp">
                  {{ event.timestamp | date: 'MMM dd, yyyy HH:mm' }}
                </small>
              </div>
            </div>

            <!-- Delivery stages -->
            <div class="delivery-stages">
              <div class="stage" [class.completed]="isStageCompleted('confirmed')">
                <span>📦 Confirmed</span>
              </div>
              <div class="stage" [class.completed]="isStageCompleted('processing')">
                <span>🔄 Processing</span>
              </div>
              <div class="stage" [class.completed]="isStageCompleted('shipped')">
                <span>🚚 Shipped</span>
              </div>
              <div class="stage" [class.completed]="isStageCompleted('out_for_delivery')">
                <span>🚗 Out for Delivery</span>
              </div>
              <div class="stage" [class.completed]="isStageCompleted('delivered')">
                <span>✅ Delivered</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items">
          <h2>Order Items</h2>
          <div *ngFor="let item of order.items" class="item">
            <span>{{ item.name }}</span>
            <span>x{{ item.quantity }}</span>
            <span>${{ item.price }}</span>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="shipping-address" *ngIf="order.shippingAddress">
          <h2>Shipping Address</h2>
          <p>{{ order.shippingAddress.firstName }}
             {{ order.shippingAddress.lastName }}</p>
          <p>{{ order.shippingAddress.addressLine1 }}</p>
          <p>{{ order.shippingAddress.city }},
             {{ order.shippingAddress.state }}
             {{ order.shippingAddress.zipCode }}</p>
        </div>

        <!-- Actions -->
        <div class="actions">
          <button class="btn btn-primary" (click)="downloadReceipt()">
            📥 Download Receipt
          </button>
          <button class="btn btn-secondary" (click)="printTracking()">
            🖨️ Print Tracking
          </button>
          <button *ngIf="!notificationsEnabled$ | async"
                  class="btn btn-outline"
                  (click)="enableNotifications()">
            🔔 Enable Notifications
          </button>
          <button *ngIf="notificationsEnabled$ | async"
                  class="btn btn-outline"
                  (click)="disableNotifications()">
            🔕 Disable Notifications
          </button>
        </div>
      </div>

      <!-- Real-time Updates Feed -->
      <div class="updates-feed">
        <h2>Live Updates</h2>
        <div *ngIf="(trackingUpdates$ | async) as updates" class="update">
          <span class="update-badge">NEW</span>
          <p>{{ updates.event.title }}: {{ updates.event.description }}</p>
          <small>{{ updates.timestamp | date: 'short' }}</small>
        </div>
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
      .tracking-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 24px;
      }

      .tracking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
        border-bottom: 2px solid #eee;
        padding-bottom: 16px;
      }

      .connection-status {
        font-size: 14px;
        font-weight: 600;
        margin: 0;
      }

      .connection-status.connected {
        color: #28a745;
      }

      .connection-status.disconnected {
        color: #666;
      }

      /* Cards */
      .summary-card,
      .location-card,
      .order-items,
      .shipping-address {
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .summary-row:last-child {
        border-bottom: none;
      }

      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .status-badge.delivered {
        background: #d4edda;
        color: #155724;
      }

      .status-badge.shipped {
        background: #cfe2ff;
        color: #084298;
      }

      .status-badge.processing {
        background: #fff3cd;
        color: #664d03;
      }

      .status-badge.pending {
        background: #e2e3e5;
        color: #383d41;
      }

      .location-info {
        font-size: 18px;
        font-weight: 600;
        padding: 12px;
        background: #f9f9f9;
        border-radius: 4px;
        margin: 12px 0;
      }

      .updated-time {
        margin: 12px 0 0 0;
        color: #666;
        font-size: 12px;
      }

      /* Timeline */
      .timeline {
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
      }

      .timeline-container {
        position: relative;
        padding-left: 40px;
      }

      .timeline-item {
        position: relative;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-left: 2px solid #eee;
      }

      .timeline-item.latest {
        border-left-color: #28a745;
      }

      .timeline-marker {
        position: absolute;
        left: -12px;
        top: 0;
        width: 20px;
        height: 20px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 50%;
      }

      .timeline-item.latest .timeline-marker {
        background: #28a745;
        border-color: #28a745;
      }

      .timeline-content h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
      }

      .timeline-content p {
        margin: 4px 0;
        font-size: 14px;
        color: #666;
      }

      .timestamp {
        color: #999;
        font-size: 12px;
      }

      /* Delivery Stages */
      .delivery-stages {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #eee;
      }

      .stage {
        flex: 1;
        padding: 12px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #f9f9f9;
        font-size: 12px;
        font-weight: 600;
        color: #666;
      }

      .stage.completed {
        background: #d4edda;
        border-color: #28a745;
        color: #155724;
      }

      /* Items & Address */
      .item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .item:last-child {
        border-bottom: none;
      }

      /* Actions */
      .actions {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }

      .btn {
        padding: 8px 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
      }

      .btn-primary {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
        border-color: #6c757d;
      }

      .btn-outline {
        background: white;
        color: #007bff;
        border-color: #007bff;
      }

      /* Updates Feed */
      .updates-feed {
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 20px;
      }

      .update {
        background: #e7f5ff;
        border-left: 4px solid #0066cc;
        padding: 12px;
        border-radius: 4px;
        position: relative;
      }

      .update-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #0066cc;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 700;
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

      .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }

      @media print {
        .actions,
        .updates-feed,
        .error-banner {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .delivery-stages {
          flex-direction: column;
        }

        .summary-row {
          flex-direction: column;
          gap: 4px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  // Observables
  order$: Observable<OrderWithTracking>;
  trackingUpdates$ = this.trackingService.trackingUpdates;
  wsConnected$ = this.trackingService.getConnectionStatus();
  error$ = this.trackingService.error$;
  notificationsEnabled$ = new Observable<boolean>();

  // State
  private orderId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private trackingService: OrderTrackingService,
    private route: ActivatedRoute
  ) {
    this.order$ = new Observable<OrderWithTracking>();
  }

  ngOnInit(): void {
    // Get order ID from route params
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.orderId = params.get('orderId');
        if (this.orderId) {
          this.order$ = this.trackingService
            .getOrder(this.orderId)
            .pipe(shareReplay(1));
        }
      });
  }

  ngOnDestroy(): void {
    if (this.orderId) {
      this.trackingService.unsubscribeFromOrder(this.orderId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Is stage completed
   */
  isStageCompleted(stage: string): boolean {
    // Implementation based on order status
    const completedStages = [
      'confirmed',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
    ];
    // Check if current status is past this stage
    return true; // Simplified
  }

  /**
   * Download receipt
   */
  downloadReceipt(): void {
    // Implementation
    console.log('Downloading receipt...');
  }

  /**
   * Print tracking
   */
  printTracking(): void {
    window.print();
  }

  /**
   * Enable notifications
   */
  enableNotifications(): void {
    if (this.orderId) {
      this.trackingService
        .enableNotifications(this.orderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => console.error('Error enabling notifications:', error),
        });
    }
  }

  /**
   * Disable notifications
   */
  disableNotifications(): void {
    if (this.orderId) {
      this.trackingService
        .disableNotifications(this.orderId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (error) => console.error('Error disabling notifications:', error),
        });
    }
  }

  /**
   * Dismiss error
   */
  dismissError(): void {
    this.trackingService.clearError();
  }
}
