# WebSocket Communication Interview Questions

## Beginner Level

### Q1: What are WebSockets and how do they differ from HTTP?

**Answer:**

**WebSockets:**
- Persistent bidirectional connection
- Server can initiate communication
- Low latency
- Continuous data flow
- Maintains open connection

**HTTP:**
- Request-response model
- Client initiates only
- Higher latency
- Connection per request
- Stateless protocol

**Comparison:**

| Feature | HTTP | WebSocket |
|---------|------|-----------|
| Connection | Temporary | Persistent |
| Direction | Client → Server | Bidirectional |
| Latency | Higher | Lower |
| Real-time | Polling required | Native |
| Overhead | Per-request headers | Minimal |
| Use Case | Traditional web | Real-time apps |

**When to use each:**
```typescript
// Use HTTP for:
// - Traditional requests
// - Batch operations
// - File downloads
// - Cache-friendly operations

// Use WebSocket for:
// - Live chat
// - Real-time notifications
// - Live dashboards
// - Collaborative editing
// - Gaming
```

---

### Q2: How do you create a basic WebSocket connection in Angular?

**Answer:**

```typescript
// Step 1: Basic connection
const ws = new WebSocket('ws://localhost:8080');

// Step 2: Handle events
ws.onopen = () => console.log('Connected');
ws.onmessage = (event) => console.log('Message:', event.data);
ws.onerror = (error) => console.error('Error:', error);
ws.onclose = () => console.log('Disconnected');

// Step 3: Send message
ws.send('Hello Server');

// Step 4: Close connection
ws.close();
```

**In a service:**
```typescript
@Injectable()
export class WebSocketService {
  private ws: WebSocket;

  connect(url: string): Observable<any> {
    return new Observable(observer => {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => observer.next({ type: 'open' });
      this.ws.onmessage = (event) => observer.next(JSON.parse(event.data));
      this.ws.onerror = (error) => observer.error(error);
      this.ws.onclose = () => observer.next({ type: 'close' });

      return () => this.ws.close();
    });
  }

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}
```

---

### Q3: How do you handle message types in WebSocket?

**Answer:**

```typescript
// Define message types
interface BaseMessage {
  type: string;
  timestamp: number;
}

interface ChatMessage extends BaseMessage {
  type: 'chat';
  userId: string;
  text: string;
}

interface NotificationMessage extends BaseMessage {
  type: 'notification';
  title: string;
  body: string;
}

// Filter by type
this.wsService.messages$.pipe(
  filter(msg => msg.type === 'chat')
).subscribe((msg: ChatMessage) => {
  console.log('Chat:', msg.text);
});

this.wsService.messages$.pipe(
  filter(msg => msg.type === 'notification')
).subscribe((msg: NotificationMessage) => {
  console.log('Notification:', msg.title);
});
```

---

### Q4: How do you handle connection errors and disconnections?

**Answer:**

```typescript
this.wsService.connect(url).subscribe(
  // Next: handle messages
  message => {
    if (message.type === 'connected') {
      this.isConnected = true;
    } else if (message.type === 'disconnected') {
      this.isConnected = false;
    }
  },
  // Error: handle connection errors
  error => {
    console.error('Connection error:', error);
    this.isConnected = false;
    this.attemptReconnect();
  },
  // Complete: connection closed
  () => {
    console.log('Connection closed');
    this.isConnected = false;
  }
);
```

**Reconnection strategy:**
```typescript
private attemptReconnect() {
  let attempts = 0;
  const maxAttempts = 5;
  const baseDelay = 3000;

  const reconnect = () => {
    if (attempts < maxAttempts) {
      attempts++;
      const delay = baseDelay * Math.pow(2, attempts - 1); // Exponential backoff
      
      console.log(`Reconnecting... (attempt ${attempts}/${maxAttempts})`);
      setTimeout(() => {
        this.wsService.connect(url).subscribe();
      }, delay);
    }
  };

  reconnect();
}
```

---

### Q5: How do you properly clean up WebSocket connections?

**Answer:**

```typescript
@Component({
  selector: 'app-websocket'
})
export class WebSocketComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.wsService.connect(url).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      message => {
        // Handle message
      }
    );
  }

  ngOnDestroy() {
    // Cleanup
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.disconnect();
  }
}
```

**Key points:**
1. Use `takeUntil` to auto-unsubscribe
2. Create `destroy$` subject in component
3. Call `ngOnDestroy` cleanup
4. Prevents memory leaks
5. Closes WebSocket connection

---

## Intermediate Level

### Q6: How do you implement automatic reconnection?

**Answer:**

```typescript
@Injectable()
export class ReconnectingWebSocketService {
  private ws: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isManualClose = false;

  connect(url: string): Observable<any> {
    return new Observable(observer => {
      const attemptConnection = () => {
        this.isManualClose = false;

        try {
          this.ws = new WebSocket(url);

          this.ws.onopen = () => {
            console.log('Connected');
            this.reconnectAttempts = 0; // Reset attempts
            observer.next({ type: 'connected' });
          };

          this.ws.onmessage = (event) => {
            observer.next(JSON.parse(event.data));
          };

          this.ws.onclose = () => {
            if (!this.isManualClose) {
              this.handleReconnect(attemptConnection, observer);
            }
          };

          this.ws.onerror = () => {
            if (!this.isManualClose) {
              this.handleReconnect(attemptConnection, observer);
            }
          };
        } catch (error) {
          this.handleReconnect(attemptConnection, observer);
        }
      };

      attemptConnection();

      return () => {
        this.isManualClose = true;
        if (this.ws) this.ws.close();
      };
    });
  }

  private handleReconnect(
    callback: () => void,
    observer: any
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(`Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      observer.next({
        type: 'reconnecting',
        attempt: this.reconnectAttempts,
        delay
      });

      setTimeout(callback, delay);
    } else {
      observer.error(new Error('Max reconnect attempts exceeded'));
    }
  }
}
```

---

### Q7: How do you queue messages while disconnected?

**Answer:**

```typescript
@Injectable()
export class QueuedWebSocketService {
  private messageQueue: any[] = [];
  private isConnected = false;

  constructor(private wsService: WebSocketService) {
    // Monitor connection status
    this.wsService.connectionStatus$.subscribe(status => {
      this.isConnected = status === 'connected';
      if (this.isConnected) {
        this.flushQueue();
      }
    });
  }

  send(message: any): void {
    if (this.isConnected) {
      // Send immediately
      this.wsService.send(message);
    } else {
      // Queue for later
      this.messageQueue.push(message);
      console.log(`Message queued. Queue size: ${this.messageQueue.length}`);
    }
  }

  private flushQueue(): void {
    console.log(`Flushing ${this.messageQueue.length} queued messages`);
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.wsService.send(message);
    }
  }

  getQueueSize(): number {
    return this.messageQueue.length;
  }

  clearQueue(): void {
    this.messageQueue = [];
  }
}
```

---

### Q8: How do you handle different message types elegantly?

**Answer:**

```typescript
@Injectable()
export class TypedWebSocketService {
  private messages$ = new Subject<BaseMessage>();

  // Specialized observables for each message type
  chatMessages$ = this.messages$.pipe(
    filter(msg => msg.type === 'chat'),
    map(msg => msg as ChatMessage)
  );

  notifications$ = this.messages$.pipe(
    filter(msg => msg.type === 'notification'),
    map(msg => msg as NotificationMessage)
  );

  statusUpdates$ = this.messages$.pipe(
    filter(msg => msg.type === 'status'),
    map(msg => msg as StatusMessage)
  );

  errors$ = this.messages$.pipe(
    filter(msg => msg.type === 'error'),
    map(msg => msg as ErrorMessage)
  );

  // Usage in component
  @Component({})
  export class ChatComponent implements OnInit {
    constructor(private ws: TypedWebSocketService) {}

    ngOnInit() {
      this.ws.chatMessages$.subscribe(msg => {
        this.messages.push(msg);
      });

      this.ws.notifications$.subscribe(notif => {
        this.showNotification(notif);
      });

      this.ws.statusUpdates$.subscribe(status => {
        this.updateUserStatus(status);
      });
    }
  }
}
```

---

### Q9: How do you implement presence/status tracking?

**Answer:**

```typescript
@Injectable()
export class PresenceService {
  private userPresence$ = new BehaviorSubject<Map<string, UserStatus>>(new Map());

  constructor(private wsService: TypedWebSocketService) {
    this.wsService.statusUpdates$.subscribe(update => {
      const presenceMap = this.userPresence$.value;
      presenceMap.set(update.userId, {
        status: update.status,
        lastSeen: new Date()
      });
      this.userPresence$.next(presenceMap);
    });
  }

  getUserPresence(userId: string): Observable<string> {
    return this.userPresence$.pipe(
      map(map => map.get(userId)?.status || 'offline')
    );
  }

  getAllPresence(): Observable<Map<string, UserStatus>> {
    return this.userPresence$.asObservable();
  }

  broadcastStatus(status: 'online' | 'away' | 'offline'): void {
    this.wsService.send({
      type: 'status',
      status,
      timestamp: Date.now()
    });
  }
}
```

---

## Advanced Level

### Q10: How do you implement message acknowledgment?

**Answer:**

```typescript
interface AcknowledgableMessage {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

interface Acknowledgment {
  messageId: string;
  status: 'received' | 'processed';
  timestamp: number;
}

@Injectable()
export class AcknowledgedWebSocketService {
  private pendingAcks = new Map<string, {
    resolve: () => void;
    reject: () => void;
    timeout: any;
  }>();

  send(message: any, timeout = 5000): Observable<Acknowledgment> {
    return new Observable(observer => {
      const messageId = this.generateId();
      const fullMessage: AcknowledgableMessage = {
        id: messageId,
        type: message.type,
        data: message.data,
        timestamp: Date.now()
      };

      const timer = setTimeout(() => {
        this.pendingAcks.delete(messageId);
        observer.error(new Error('Acknowledgment timeout'));
      }, timeout);

      this.pendingAcks.set(messageId, {
        resolve: () => observer.complete(),
        reject: () => observer.error(new Error('Rejected')),
        timeout: timer
      });

      this.wsService.send(fullMessage);
    });
  }

  handleAcknowledgment(ack: Acknowledgment): void {
    const pending = this.pendingAcks.get(ack.messageId);
    if (pending) {
      clearTimeout(pending.timeout);
      pending.resolve();
      this.pendingAcks.delete(ack.messageId);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random()}`;
  }
}
```

---

### Q11: How do you implement heartbeat/keep-alive?

**Answer:**

```typescript
@Injectable()
export class HeartbeatWebSocketService {
  private heartbeatInterval: any;
  private heartbeatTimeout: any;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly HEARTBEAT_TIMEOUT = 5000; // 5 seconds

  constructor(private wsService: WebSocketService) {}

  startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.HEARTBEAT_INTERVAL);
  }

  private sendHeartbeat(): void {
    if (this.wsService.isConnected()) {
      this.wsService.send({
        type: 'heartbeat',
        timestamp: Date.now()
      });

      // Set timeout for heartbeat response
      this.heartbeatTimeout = setTimeout(() => {
        console.warn('Heartbeat timeout, reconnecting...');
        this.wsService.reconnect();
      }, this.HEARTBEAT_TIMEOUT);
    }
  }

  handleHeartbeatResponse(): void {
    clearTimeout(this.heartbeatTimeout);
  }

  stopHeartbeat(): void {
    clearInterval(this.heartbeatInterval);
    clearTimeout(this.heartbeatTimeout);
  }
}
```

---

### Q12: What are best practices for WebSocket security?

**Answer:**

**1. Use WSS (Secure WebSocket)**
```typescript
// ✅ Good - use wss:// for production
this.wsService.connect('wss://api.example.com/ws');

// ❌ Bad - ws:// transmits data unencrypted
this.wsService.connect('ws://api.example.com/ws');
```

**2. Authentication**
```typescript
connect(url: string, token: string): Observable<any> {
  const wsUrl = `${url}?token=${token}`;
  return this.wsService.connect(wsUrl);
}
```

**3. Message validation**
```typescript
private validateMessage(msg: any): boolean {
  // Check message structure
  if (!msg.type || typeof msg.type !== 'string') {
    return false;
  }
  // Check message size
  if (JSON.stringify(msg).length > 1024 * 100) {
    return false;
  }
  return true;
}
```

**4. Rate limiting**
```typescript
private messageCount = 0;
private readonly MAX_MESSAGES_PER_SECOND = 10;

private checkRateLimit(): boolean {
  this.messageCount++;
  if (this.messageCount > MAX_MESSAGES_PER_SECOND) {
    console.warn('Rate limit exceeded');
    return false;
  }
  
  setTimeout(() => this.messageCount--, 1000);
  return true;
}
```

---

## Summary

**Key Concepts:**
1. Persistent bidirectional communication
2. Real-time data exchange
3. Reconnection strategies
4. Message queuing
5. Connection management
6. Type-safe messaging

**Best Practices:**
1. Use WSS in production
2. Implement reconnection logic
3. Queue messages when disconnected
4. Use typed messages
5. Implement heartbeat
6. Proper error handling
7. Clean up on component destroy
8. Monitor connection status
