# WebSocket Communication in Angular

## Overview

WebSockets provide persistent, bidirectional communication between client and server. Unlike HTTP's request-response model, WebSockets maintain an open connection for real-time data exchange. This enables use cases like live notifications, collaborative editing, live chat, and real-time dashboards.

---

## HTTP vs WebSocket

| Feature | HTTP | WebSocket |
|---------|------|-----------|
| Communication | Request-Response | Bidirectional |
| Connection | Temporary | Persistent |
| Latency | Higher | Lower |
| Overhead | Per request headers | Minimal after handshake |
| Real-time | Polling required | Native |
| Use case | Traditional web | Real-time apps |

---

## WebSocket Basics

### 1. **Native WebSocket API**

```typescript
// Create WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

// Connection opened
ws.onopen = (event) => {
  console.log('Connected');
  ws.send('Hello Server');
};

// Received message
ws.onmessage = (event) => {
  console.log('Message from server:', event.data);
};

// Connection closed
ws.onclose = (event) => {
  console.log('Disconnected');
};

// Error occurred
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Send message
ws.send('Some message');

// Close connection
ws.close();
```

---

## WebSocket Service in Angular

### 1. **Basic WebSocket Service**

```typescript
// websocket.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket;
  private subject = new Subject<any>();

  constructor() {}

  connect(url: string): Observable<any> {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.subject.next({ type: 'open' });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.subject.next(message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.subject.error(error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.subject.next({ type: 'close' });
    };

    return this.subject.asObservable();
  }

  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  isConnected(): boolean {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}
```

### 2. **Typed WebSocket Service**

```typescript
// typed-websocket.service.ts
export interface Message {
  type: string;
  data: any;
  timestamp: number;
}

export interface ChatMessage extends Message {
  type: 'chat';
  data: {
    userId: string;
    username: string;
    text: string;
  };
}

export interface NotificationMessage extends Message {
  type: 'notification';
  data: {
    title: string;
    body: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TypedWebSocketService {
  private ws: WebSocket;
  private messages$ = new Subject<Message>();

  connect(url: string): Observable<Message> {
    return new Observable(observer => {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => observer.next({
        type: 'open',
        data: null,
        timestamp: Date.now()
      });

      this.ws.onmessage = (event) => {
        try {
          const message: Message = JSON.parse(event.data);
          observer.next(message);
        } catch (error) {
          observer.error(new Error('Invalid message format'));
        }
      };

      this.ws.onerror = (error) => {
        observer.error(new Error('WebSocket error'));
      };

      this.ws.onclose = () => observer.next({
        type: 'close',
        data: null,
        timestamp: Date.now()
      });

      return () => {
        if (this.ws) this.ws.close();
      };
    });
  }

  send(message: Message): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}
```

---

## RxJS Integration

### 1. **Observable WebSocket Service**

```typescript
// observable-websocket.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObservableWebSocketService implements OnDestroy {
  private wsSubject: Subject<any> = new Subject();
  private connectionStatus$ = new BehaviorSubject<'connecting' | 'connected' | 'disconnected'>('disconnected');
  private ws: WebSocket;

  connect(url: string): Observable<any> {
    return new Observable(observer => {
      this.connectionStatus$.next('connecting');

      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          console.log('Connected');
          this.connectionStatus$.next('connected');
          observer.next({ type: 'connected' });
        };

        this.ws.onmessage = (event) => {
          observer.next(JSON.parse(event.data));
        };

        this.ws.onerror = (error) => {
          console.error('Error:', error);
          this.connectionStatus$.next('disconnected');
          observer.error(error);
        };

        this.ws.onclose = () => {
          console.log('Disconnected');
          this.connectionStatus$.next('disconnected');
          observer.next({ type: 'disconnected' });
        };
      } catch (error) {
        observer.error(error);
      }

      return () => {
        if (this.ws) {
          this.ws.close();
        }
      };
    }).pipe(
      shareReplay(1) // Share single connection
    );
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // Filter messages by type
  getMessagesByType<T>(type: string): Observable<T> {
    return this.wsSubject.pipe(
      filter(msg => msg.type === type),
      map(msg => msg.data as T)
    );
  }

  getConnectionStatus(): Observable<'connecting' | 'connected' | 'disconnected'> {
    return this.connectionStatus$.asObservable();
  }

  ngOnDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
```

---

## Using WebSocket in Components

### 1. **Chat Component**

```typescript
// chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ChatMessage {
  username: string;
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <div class="messages">
        <div *ngFor="let msg of messages" class="message">
          <strong>{{ msg.username }}</strong>: {{ msg.text }}
          <small>{{ msg.timestamp | date:'HH:mm:ss' }}</small>
        </div>
      </div>

      <div class="input-area">
        <input
          [(ngModel)]="newMessage"
          (keyup.enter)="sendMessage()"
          placeholder="Type message..."
        >
        <button (click)="sendMessage()">Send</button>
      </div>

      <p *ngIf="!isConnected" class="status disconnected">
        Disconnected
      </p>
      <p *ngIf="isConnected" class="status connected">
        Connected
      </p>
    </div>
  `
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isConnected: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    // Connect to WebSocket
    this.wsService.connect('ws://localhost:8080').pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (message) => {
        if (message.type === 'chat') {
          this.messages.push({
            username: message.username,
            text: message.text,
            timestamp: new Date(message.timestamp)
          });
        } else if (message.type === 'connected') {
          this.isConnected = true;
        } else if (message.type === 'disconnected') {
          this.isConnected = false;
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      }
    );
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.wsService.send({
        type: 'chat',
        username: 'currentUser',
        text: this.newMessage,
        timestamp: Date.now()
      });
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.disconnect();
  }
}
```

### 2. **Live Notifications Component**

```typescript
// notifications.component.ts
@Component({
  selector: 'app-notifications',
  template: `
    <div class="notifications">
      <div *ngFor="let notif of notifications" class="notification" [@slideIn]>
        <strong>{{ notif.title }}</strong>
        <p>{{ notif.body }}</p>
        <button (click)="dismissNotification(notif.id)">X</button>
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    this.wsService.connect('ws://localhost:8080').pipe(
      filter(msg => msg.type === 'notification'),
      takeUntil(this.destroy$)
    ).subscribe(notification => {
      this.notifications.push({
        id: Date.now(),
        ...notification.data
      });

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        this.dismissNotification(notification.data.id);
      }, 5000);
    });
  }

  dismissNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Advanced Patterns

### 1. **Reconnection Strategy**

```typescript
// reconnecting-websocket.service.ts
@Injectable({
  providedIn: 'root'
})
export class ReconnectingWebSocketService {
  private ws: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private subject = new Subject<any>();

  connect(url: string): Observable<any> {
    return new Observable(observer => {
      const attemptConnection = () => {
        try {
          this.ws = new WebSocket(url);

          this.ws.onopen = () => {
            console.log('Connected');
            this.reconnectAttempts = 0;
            observer.next({ type: 'connected' });
          };

          this.ws.onmessage = (event) => {
            observer.next(JSON.parse(event.data));
          };

          this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };

          this.ws.onclose = () => {
            console.log('Disconnected, attempting to reconnect...');
            this.attemptReconnect(attemptConnection, observer);
          };
        } catch (error) {
          observer.error(error);
        }
      };

      attemptConnection();

      return () => {
        if (this.ws) this.ws.close();
      };
    }).pipe(
      shareReplay(1)
    );
  }

  private attemptReconnect(
    callback: () => void,
    observer: any
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        callback();
      }, this.reconnectInterval * this.reconnectAttempts); // Exponential backoff
    } else {
      observer.error(new Error('Max reconnect attempts reached'));
    }
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}
```

### 2. **Message Queuing**

```typescript
@Injectable({
  providedIn: 'root'
})
export class QueuedWebSocketService {
  private messageQueue: any[] = [];
  private isConnected = false;

  constructor(private wsService: WebSocketService) {
    this.wsService.getConnectionStatus().subscribe(status => {
      this.isConnected = status === 'connected';
      if (this.isConnected) {
        this.flushQueue();
      }
    });
  }

  send(message: any): void {
    if (this.isConnected) {
      this.wsService.send(message);
    } else {
      // Queue message for later
      this.messageQueue.push(message);
    }
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.wsService.send(message);
    }
  }
}
```

---

## Best Practices

1. **Always handle disconnections gracefully**
   - Implement reconnection logic
   - Show connection status to user
   - Queue messages while disconnected

2. **Use typed messages**
   - Enforce message structure
   - Easier debugging
   - Better IDE support

3. **Clean up on component destroy**
   - Unsubscribe from observables
   - Close WebSocket connections
   - Prevent memory leaks

4. **Handle errors properly**
   - Distinguish between connection errors and message errors
   - Implement retry logic
   - Log errors for debugging

5. **Message filtering and routing**
   - Use filter operators to separate message types
   - Create dedicated subjects for different event types
   - Make code more maintainable

6. **Performance considerations**
   - Don't send too frequently
   - Batch messages when possible
   - Close connection when not needed

---

## Common WebSocket Libraries

### 1. **Socket.IO** (Recommended for Angular)

```typescript
// socket-io.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  connect(url: string): void {
    this.socket = io(url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  on<T>(event: string): Observable<T> {
    return new Observable(observer => {
      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
```

### 2. **RxJS with WebSocket**

```typescript
// rxjs-websocket.service.ts
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class RxJSWebSocketService {
  private subject = webSocket('ws://localhost:8080');

  connect() {
    return this.subject.asObservable();
  }

  send(msg: any) {
    this.subject.next(msg);
  }
}
```

---

## Summary

WebSocket Communication enables real-time features:

1. **Persistent connections** for continuous data flow
2. **Bidirectional communication** for immediate updates
3. **Lower latency** compared to polling
4. **Better performance** with minimal overhead

Key patterns:
- Observable-based services
- Automatic reconnection
- Message queuing
- Type safety
- Proper cleanup

Use WebSockets for: chat, notifications, live updates, collaborative editing, gaming, dashboards.

Avoid for: simple data fetching, batch operations, non-real-time scenarios.
