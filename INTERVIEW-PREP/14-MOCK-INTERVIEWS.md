# Mock Interview Scripts & Preparation Guide

## Interview Preparation Checklist

Before the interview:
- [ ] Review fundamentals
- [ ] Practice coding challenges
- [ ] Study system design scenarios
- [ ] Prepare questions for interviewer
- [ ] Test technical setup (if remote)
- [ ] Get good sleep

---

## Mock Interview #1: 60-Minute Technical Interview

**Time Allocation:**
- 5 min: Introduction
- 10 min: Technical Q&A
- 25 min: Coding challenge
- 15 min: System design
- 5 min: Questions for interviewer

**Script:**

**INTERVIEWER:** "Hi! Thanks for taking the time to interview with us. Let me start by asking you about Angular fundamentals. Can you explain change detection and the difference between default and OnPush strategies?"

**YOU:** "Of course! Change detection is Angular's mechanism for detecting when data changes and updating the view accordingly. 

With the default strategy, Angular checks every component whenever any event occurs. This is safe but can be inefficient with many components.

OnPush is more performant - Angular only checks when:
1. Input properties change (reference comparison)
2. Events are triggered in the component
3. Observables emit

I use OnPush globally because it encourages better component design and reduces unnecessary checks. Here's an example:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  @Input() data: Data; // Checked on input change
}
```

For performance-critical apps, this can improve performance by 10-20%."

**INTERVIEWER:** "Good. Now, let's move to a coding challenge. Here's the problem: Implement a service that caches HTTP responses with a configurable TTL (time-to-live). The cache should automatically invalidate after TTL expires."

**YOU:** "Let me break this down:
1. I need to store responses with timestamps
2. Check if cached data is still valid
3. Auto-invalidate after TTL

Here's my approach:"

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable({ providedIn: 'root' })
export class CachedHttpService {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(url: string, ttl: number = 5 * 60 * 1000): Observable<T> {
    const cached = this.cache.get(url);
    
    if (cached && !this.isExpired(cached)) {
      console.log('Returning cached data');
      return of(cached.data);
    }

    return this.http.get<T>(url).pipe(
      tap(data => {
        this.cache.set(url, {
          data,
          timestamp: Date.now(),
          ttl
        });
      })
    );
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    const age = Date.now() - entry.timestamp;
    return age > entry.ttl;
  }

  clear(url?: string): void {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }
}
```

**INTERVIEWER:** "Great! Now consider a system design question: How would you design a real-time notification system for an Angular application?"

**YOU:** "I'd consider several components:

1. **WebSocket Connection**
```typescript
@Injectable()
export class NotificationService {
  private ws: WebSocket;
  private notifications$ = new Subject<Notification>();

  connect(): void {
    this.ws = new WebSocket('wss://api.example.com/notifications');
    this.ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.notifications$.next(notification);
    };
  }

  getNotifications(): Observable<Notification> {
    return this.notifications$.asObservable();
  }
}
```

2. **State Management**
- Use NgRx to store notifications
- Dispatch actions when new notifications arrive
- Select notifications by type/status

3. **UI Component**
- Show real-time badge count
- Display notification list
- Mark as read/unread

4. **Error Handling**
- Auto-reconnect on disconnect
- Queue offline notifications
- Exponential backoff retry

The key is handling real-time updates efficiently and gracefully handling connection failures."

**INTERVIEWER:** "Do you have any questions for us?"

**YOU:** "Yes! A few questions:
1. What's your development environment like?
2. What tools do you use for state management?
3. How do you handle testing?
4. What's your approach to performance optimization?
5. What attracted you to this role?"

---

## Mock Interview #2: 45-Minute Behavioral + Technical

**Time Allocation:**
- 5 min: Introduction
- 15 min: Behavioral questions
- 20 min: Technical discussion
- 5 min: Questions

**Common Behavioral Questions:**

**Q1:** "Tell me about a challenging project you worked on. How did you handle it?"

**GOOD ANSWER:** "At my last company, I was tasked with optimizing a product listing page showing 10,000+ items. The initial load time was 8 seconds.

I identified the issues:
- No virtual scrolling
- Default change detection checking all items
- No caching

I implemented:
1. Virtual scrolling with CDK
2. OnPush change detection strategy
3. HTTP response caching with TTL
4. Lazy loading modules

Result: Load time reduced to 2 seconds, 10x improvement in scroll performance.

Key learnings:
- Profile before optimizing
- Focus on high-impact changes
- Document decisions"

**Q2:** "Tell me about a time you made a mistake. How did you handle it?"

**GOOD ANSWER:** "Early in my career, I deployed without proper testing. A memory leak in a component caused production issues.

What I did:
1. Acknowledged the mistake immediately
2. Worked on fix without blaming
3. Implemented proper testing (unit + E2E)
4. Set up monitoring for memory leaks
5. Documented the learning

This taught me the importance of testing and monitoring."

**Q3:** "Tell me about your experience with team collaboration."

**GOOD ANSWER:** "I've consistently worked in teams and believe communication is key.

Example: On a recent project, we had a disagreement on state management approach. Instead of pushing my view, I:
1. Suggested a spike to evaluate both options
2. Documented pros/cons
3. Presented findings to the team
4. Let the team decide

We chose NgRx based on team consensus, and it worked great. I've learned that team harmony often matters more than technical perfection."

---

## Mock Interview #3: System Design Focus

**Scenario:** "Design a real-time collaborative document editor like Google Docs."

**YOUR APPROACH:**

**1. Gather Requirements:**
- Multiple users editing simultaneously
- Real-time cursor positions
- Operational Transformation for conflict resolution
- Document versioning
- Auto-save
- Undo/redo

**2. Architecture:**

```
Client (Angular) ←→ WebSocket ←→ Server (Node.js)
         ↓              ↓           ↓
   Local State      Message Queue   Document DB
   (OT) Engine       Persistence    Version History
```

**3. Implementation Details:**

```typescript
// Client-side OT engine
@Injectable()
export class CollaborativeEditorService {
  private doc$ = new BehaviorSubject<string>('');
  private version = 0;

  applyLocalChange(change: Change): void {
    const transformedChange = this.applyOT(change);
    this.version++;
    this.sendToServer(transformedChange);
  }

  private applyOT(change: Change): Change {
    // Operational Transformation logic
    return change;
  }
}

// WebSocket for real-time sync
@Injectable()
export class RealtimeSyncService {
  connect(): Observable<Change> {
    return new Observable(subscriber => {
      const ws = new WebSocket('wss://editor.example.com');
      ws.onmessage = (event) => {
        const change = JSON.parse(event.data);
        subscriber.next(change);
      };
    });
  }
}
```

**4. Challenges & Solutions:**

| Challenge | Solution |
|-----------|----------|
| Conflict resolution | Operational Transformation |
| Offline support | Local queue + replay on reconnect |
| Large documents | Lazy load chunks |
| Real-time cursors | Separate cursor position channel |
| Performance | Debounce updates, batch operations |

---

## Interview Q&A Repository

### React to Unexpected Questions

**Q:** "What's your weakest area?"

**GOOD:** "I'm still developing my expertise in performance profiling. I understand the basics but want to master Chrome DevTools and Lighthouse. I've started taking courses and practicing regularly."

**Q:** "Why should we hire you?"

**GOOD:** "I bring:
1. 5+ years Angular experience
2. Track record of delivering on time
3. Strong collaboration skills
4. Continuous learning mindset
5. Ownership mentality

Most importantly, I genuinely enjoy Angular development and building great products."

---

## Post-Interview Checklist

After the interview:
- [ ] Send thank you email within 24 hours
- [ ] Reiterate interest in the role
- [ ] Mention specific points from conversation
- [ ] Offer to clarify anything
- [ ] Ask about timeline

**Example Email:**

"Hi [Name],

Thank you for taking the time to meet with me today. I really enjoyed our discussion about real-time systems and the collaborative editor design challenge. Your insights about scaling to millions of users were particularly valuable.

I'm very interested in this opportunity and believe my experience with performance optimization and state management aligns well with your team's needs.

Please let me know if you have any questions or need clarification on anything we discussed.

Best regards,
[Your Name]"

---

## Key Interview Principles

1. **Listen Carefully** - Understand the question before answering
2. **Think Out Loud** - Explain your reasoning
3. **Ask for Clarification** - Better than making assumptions
4. **Use Examples** - Show, don't just tell
5. **Discuss Trade-offs** - Not all solutions are perfect
6. **Be Honest** - Don't fake expertise
7. **Show Enthusiasm** - Be genuine about interest
8. **Follow Up** - Stay in touch after interview

---

## Resources for Preparation

**Coding Practice:**
- LeetCode (medium difficulty)
- HackerRank
- CodeSignal

**System Design:**
- Designing Data-Intensive Applications
- System Design Interview books

**Angular Deep Dive:**
- Angular official documentation
- Advanced Angular course (Udemy/Pluralsight)

**General Interview Prep:**
- "Cracking the Coding Interview" book
- Mock interview platforms
- Practice with friends

---

**Good Luck! 🚀**

Remember: Interviewers want to see how you think and solve problems, not just if you know everything.

