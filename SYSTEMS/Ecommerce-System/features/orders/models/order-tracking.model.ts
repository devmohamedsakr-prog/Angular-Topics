/**
 * Order Tracking Models - E-Commerce System
 * Defines interfaces for order tracking and status updates
 */

/**
 * Order status
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

/**
 * Order status event
 */
export interface OrderStatusEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  timestamp: Date;
  location?: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Tracking event
 */
export interface TrackingEvent {
  id: string;
  orderId: string;
  eventType: 'status' | 'location' | 'delivery' | 'notification';
  title: string;
  description: string;
  timestamp: Date;
  location?: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  estimatedDelivery?: Date;
  metadata?: Record<string, any>;
}

/**
 * Order with tracking
 */
export interface OrderWithTracking {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: any[];
  total: number;
  estimatedDelivery: Date;
  shippingAddress: any;
  trackingNumber: string;
  carrier: string;
  statusEvents: OrderStatusEvent[];
  trackingEvents: TrackingEvent[];
  currentLocation?: string;
  isDelivered: boolean;
  updatedAt: Date;
}

/**
 * Real-time tracking update
 */
export interface RealTimeTrackingUpdate {
  orderId: string;
  trackingNumber: string;
  status: OrderStatus;
  location: string;
  timestamp: Date;
  estimatedDelivery?: Date;
  event: TrackingEvent;
}

/**
 * Order tracking state
 */
export interface OrderTrackingState {
  orders: OrderWithTracking[];
  selectedOrder: OrderWithTracking | null;
  loading: boolean;
  error: string | null;
  liveTracking: Map<string, boolean>;
  lastUpdated: Map<string, Date>;
}

/**
 * WebSocket message
 */
export interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe' | 'update' | 'ping' | 'pong';
  orderId?: string;
  data?: RealTimeTrackingUpdate;
  timestamp: number;
}
