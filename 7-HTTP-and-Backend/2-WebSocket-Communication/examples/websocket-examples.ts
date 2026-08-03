/**
 * WebSocket Communication Examples for Angular
 * Demonstrates various patterns and real-world scenarios
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Component, OnInit, OnDestroy as OnDestroyComponent } from '@angular/core';
import { Subject, Observable, BehaviorSubject, interval } from 'rxjs';
import { filter, map, takeUntil, tap, retry } from 'rxjs/operators';

// ============================================================================
// EXAMPLE 1: Basic WebSocket Service
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class BasicWebSocketService {
  private ws: WebSocket;
  private subject = new Subject<any>();

  connect(url: string): Observable<any> {
    return new Observable(observer => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          observer.next({ type: 'open', connected: true });
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            observer.next(message);
          } catch (error) {
            console.error('Failed to parse message:', error);
            observer.next({ type: 'error', error: 'Parse error' });
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          observer.error(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket closed');
          observer.next({ type: 'close', connected: false });
        };

        // Cleanup on unsubscribe
        return () => {
          if (this.ws) {
            this.ws.close();
          }
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }

  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not open');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// ============================================================================
// EXAMPLE 2: Typed WebSocket Service with Message Types
// ============================================================================

export interface BaseMessage {
  type: string;
  timestamp: number;
}

export interface ChatMessage extends BaseMessage {
  type: 'chat';
  userId: string;
  username: string;
  text: string;
}

export interface NotificationMessage extends BaseMessage {
  type: 'notification';
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'error';
}

export interface StatusMessage extends BaseMessage {
  type: 'status';
  status: 'online' | 'offline' | 'away';
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TypedWebSocketService implements OnDestroy {
  private ws: WebSocket;
  private messages$ = new Subject<BaseMessage>();
  private connectionStatus$ = new BehaviorSubject<'connecting' | 'connected' | 'disconnected'>('disconnected');

  connect(url: string): Observable<BaseMessage> {
    this.connectionStatus$.next('connecting');

    return new Observable(observer => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.connectionStatus$.next('connected');
          observer.next({
            type: 'connection',
            timestamp: Date.now()
          } as any);
        };

        this.ws.onmessage = (event) => {
          try {
            const message: BaseMessage = JSON.parse(event.data);
            observer.next(message);
            this.messages$.next(message);
          } catch (error) {
            observer.error(new Error('Invalid message format'));
          }
        };

        this.ws.onerror = (error) => {
          this.connectionStatus$.next('disconnected');
          observer.error(new Error('WebSocket error'));
        };

        this.ws.onclose = () => {
          this.connectionStatus$.next('disconnected');
        };

        return () => {
          if (this.ws) {
            this.ws.close();
          }
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }

  send(message: BaseMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // Get messages filtered by type
  getChatMessages(): Observable<ChatMessage> {
    return this.messages$.pipe(
      filter(msg => msg.type === 'chat'),
      map(msg => msg as ChatMessage)
    );
  }

  getNotifications(): Observable<NotificationMessage> {
    return this.messages$.pipe(
      filter(msg => msg.type === 'notification'),
      map(msg => msg as NotificationMessage)
    );
  }

  getStatusUpdates(): Observable<StatusMessage> {
    return this.messages$.pipe(
      filter(msg => msg.type === 'status'),
      map(msg => msg as StatusMessage)
    );
  }

  getConnectionStatus(): Observable<string> {
    return this.connectionStatus$.asObservable();
  }

  ngOnDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// ============================================================================
// EXAMPLE 3: Reconnecting WebSocket Service
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class ReconnectingWebSocketService {
  private ws: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseReconnectInterval = 3000; // 3 seconds
  private url: string = '';
  private isManualClose = false;

  connect(url: string): Observable<any> {
    this.url = url;
    this.reconnectAttempts = 0;

    return new Observable(observer => {
      const attemptConnection = () => {
        console.log(`Attempting to connect to ${url}`);
        this.isManualClose = false;

        try {
          this.ws = new WebSocket(url);

          this.ws.onopen = () => {
            console.log('Connected successfully');
            this.reconnectAttempts = 0;
            observer.next({ type: 'connected', retries: 0 });
          };

          this.ws.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data);
              observer.next(message);
            } catch (error) {
              console.error('Parse error:', error);
            }
          };

          this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };

          this.ws.onclose = () => {
            if (!this.isManualClose) {
              console.log('Connection closed, attempting to reconnect...');
              this.attemptReconnect(attemptConnection, observer);
            }
          };
        } catch (error) {
          console.error('Connection error:', error);
          this.attemptReconnect(attemptConnection, observer);
        }
      };

      attemptConnection();

      return () => {
        this.isManualClose = true;
        if (this.ws) {
          this.ws.close();
        }
      };
    });
  }

  private attemptReconnect(
    callback: () => void,
    observer: any
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.baseReconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(
        `Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} after ${delay}ms`
      );

      observer.next({
        type: 'reconnecting',
        attempt: this.reconnectAttempts,
        delay: delay
      });

      setTimeout(() => {
        callback();
      }, delay);
    } else {
      const error = new Error('Max reconnection attempts exceeded');
      console.error(error);
      observer.error(error);
    }
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not open, message queued');
    }
  }

  disconnect(): void {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
    }
  }
}

// ============================================================================
// EXAMPLE 4: Message Queue Service
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class QueuedWebSocketService {
  private messageQueue: any[] = [];
  private isConnected = false;
  private connectionStatus$ = new BehaviorSubject<boolean>(false);

  constructor(private wsService: TypedWebSocketService) {
    this.wsService.getConnectionStatus().subscribe(status => {
      this.isConnected = status === 'connected';
      this.connectionStatus$.next(this.isConnected);
      if (this.isConnected) {
        this.flushQueue();
      }
    });
  }

  /**
   * Send message immediately if connected, queue otherwise
   */
  send(message: any): void {
    if (this.isConnected) {
      this.wsService.send(message);
    } else {
      console.log('Queueing message:', message);
      this.messageQueue.push(message);
    }
  }

  /**
   * Flush all queued messages
   */
  private flushQueue(): void {
    console.log(`Flushing ${this.messageQueue.length} queued messages`);
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.wsService.send(message);
      console.log('Sent queued message:', message);
    }
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.messageQueue.length;
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.messageQueue = [];
  }
}

// ============================================================================
// EXAMPLE 5: Chat Component
// ============================================================================

@Component({
  selector: 'app-websocket-chat',
  template: `
    <div class="chat-container">
      <div class="header">
        <h2>Live Chat</h2>
        <div class="status" [class.connected]="isConnected" [class.disconnected]="!isConnected">
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </div>
      </div>

      <div class="messages-area">
        <div *ngFor="let msg of messages" class="message" [class.own]="msg.userId === currentUserId">
          <div class="message-header">
            <strong>{{ msg.username }}</strong>
            <small>{{ msg.timestamp | date:'HH:mm:ss' }}</small>
          </div>
          <div class="message-body">{{ msg.text }}</div>
        </div>
      </div>

      <div class="input-area">
        <input
          [(ngModel)]="newMessage"
          (keyup.enter)="sendMessage()"
          placeholder="Type message..."
          [disabled]="!isConnected"
        >
        <button (click)="sendMessage()" [disabled]="!isConnected || !newMessage.trim()">
          Send
        </button>
      </div>

      <div class="queue-info" *ngIf="queueSize > 0">
        {{ queueSize }} messages queued
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .status {
      padding: 5px 10px;
      border-radius: 3px;
    }
    .status.connected {
      background-color: #4CAF50;
      color: white;
    }
    .status.disconnected {
      background-color: #f44336;
      color: white;
    }
    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }
    .message.own {
      text-align: right;
    }
  `]
})
export class WebSocketChatComponent implements OnInit, OnDestroyComponent {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  currentUserId: string = 'current-user';
  queueSize: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private wsService: TypedWebSocketService,
    private queueService: QueuedWebSocketService
  ) {}

  ngOnInit() {
    // Connect to WebSocket
    this.wsService.connect('ws://localhost:8080').pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (message) => {
        if (message.type === 'connection') {
          this.isConnected = true;
        }
      },
      (error) => {
        console.error('Connection error:', error);
        this.isConnected = false;
      }
    );

    // Listen for chat messages
    this.wsService.getChatMessages().pipe(
      takeUntil(this.destroy$)
    ).subscribe(msg => {
      this.messages.push(msg);
      this.scrollToBottom();
    });

    // Listen for connection status
    this.wsService.getConnectionStatus().pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => {
      this.isConnected = status === 'connected';
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.isConnected) {
      const message: ChatMessage = {
        type: 'chat',
        userId: this.currentUserId,
        username: 'You',
        text: this.newMessage,
        timestamp: Date.now()
      };

      this.queueService.send(message);
      this.queueSize = this.queueService.getQueueSize();
      this.newMessage = '';
    }
  }

  private scrollToBottom() {
    // Auto-scroll to bottom
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.ngOnDestroy();
  }
}

// ============================================================================
// EXAMPLE 6: Notifications Component
// ============================================================================

@Component({
  selector: 'app-websocket-notifications',
  template: `
    <div class="notifications">
      <div
        *ngFor="let notif of notifications; let i = index"
        class="notification"
        [class]="'notification-' + notif.severity"
      >
        <div class="notification-header">
          <strong>{{ notif.title }}</strong>
          <button (click)="dismissNotification(i)">×</button>
        </div>
        <div class="notification-body">{{ notif.body }}</div>
        <div class="notification-time">{{ notif.timestamp | date:'HH:mm:ss' }}</div>
      </div>
    </div>
  `
})
export class WebSocketNotificationsComponent implements OnInit, OnDestroyComponent {
  notifications: NotificationMessage[] = [];
  private destroy$ = new Subject<void>();
  private dismissTimers: Map<number, any> = new Map();

  constructor(private wsService: TypedWebSocketService) {}

  ngOnInit() {
    this.wsService.getNotifications().pipe(
      takeUntil(this.destroy$)
    ).subscribe(notif => {
      this.notifications.unshift(notif);
      this.autoDismiss(notif);
    });
  }

  private autoDismiss(notif: NotificationMessage) {
    // Auto-dismiss after duration based on severity
    const duration = notif.severity === 'error' ? 7000 : 5000;
    const timer = setTimeout(() => {
      this.notifications = this.notifications.filter(n => n !== notif);
    }, duration);

    this.dismissTimers.set(notif.timestamp, timer);
  }

  dismissNotification(index: number) {
    const notif = this.notifications[index];
    if (this.dismissTimers.has(notif.timestamp)) {
      clearTimeout(this.dismissTimers.get(notif.timestamp));
      this.dismissTimers.delete(notif.timestamp);
    }
    this.notifications.splice(index, 1);
  }

  ngOnDestroy() {
    this.dismissTimers.forEach(timer => clearTimeout(timer));
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 7: Status Indicator Component
// ============================================================================

@Component({
  selector: 'app-websocket-status',
  template: `
    <div class="status-container">
      <div class="status-indicator" [class.online]="userStatus === 'online'"
           [class.away]="userStatus === 'away'"
           [class.offline]="userStatus === 'offline'">
      </div>
      <span>{{ userStatus }}</span>
    </div>
  `,
  styles: [`
    .status-container {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    .status-indicator.online {
      background-color: #4CAF50;
    }
    .status-indicator.away {
      background-color: #FFC107;
    }
    .status-indicator.offline {
      background-color: #f44336;
    }
  `]
})
export class WebSocketStatusComponent implements OnInit, OnDestroyComponent {
  userStatus: 'online' | 'away' | 'offline' = 'offline';
  private destroy$ = new Subject<void>();

  constructor(private wsService: TypedWebSocketService) {}

  ngOnInit() {
    this.wsService.getStatusUpdates().pipe(
      takeUntil(this.destroy$)
    ).subscribe(status => {
      this.userStatus = status.status;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// EXAMPLE 8: Server Push Service
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class ServerPushService {
  private wsService: BasicWebSocketService;
  private pushNotifications$ = new Subject<any>();

  constructor() {
    this.wsService = new BasicWebSocketService();
  }

  startListening(url: string): Observable<any> {
    return this.wsService.connect(url).pipe(
      filter(msg => msg.type === 'push'),
      tap(msg => this.pushNotifications$.next(msg))
    );
  }

  getPushNotifications(): Observable<any> {
    return this.pushNotifications$.asObservable();
  }

  stopListening() {
    this.wsService.disconnect();
  }
}
