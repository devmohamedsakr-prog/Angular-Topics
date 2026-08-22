# Component Lifecycle Hooks

**IDE Prompt:** Use this when managing component initialization, updates, and cleanup.

---

## 🎯 Task: Implement Component Lifecycle Hooks

**When to use:** Handling component initialization, reacting to input changes, and cleanup.

---

## 📋 Checklist

- [ ] Understand component lifecycle phases
- [ ] Implement OnInit hook
- [ ] Implement OnChanges hook
- [ ] Implement OnDestroy hook
- [ ] Handle cleanup (subscriptions)

---

## 🚀 Step-by-Step Instructions

### Step 1: Understand Lifecycle Phases

Components go through these phases:

1. **Constructor** - Component instance created
2. **ngOnChanges** - @Input properties change
3. **ngOnInit** - Component initialized
4. **ngDoCheck** - Custom change detection
5. **ngAfterContentInit** - Content initialized
6. **ngAfterContentChecked** - Content checked
7. **ngAfterViewInit** - View initialized
8. **ngAfterViewChecked** - View checked
9. **ngOnDestroy** - Component destroyed

### Step 2: Implement OnInit

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<p>{{ message }}</p>`
})
export class MyComponent implements OnInit {
  message: string = '';

  // Called when component is created
  constructor() {
    console.log('Constructor called');
    this.message = 'Initializing...';
  }

  // Called after component is initialized
  ngOnInit() {
    console.log('ngOnInit called');
    this.message = 'Component initialized!';
    
    // Good place to:
    // - Fetch data from API
    // - Initialize properties
    // - Subscribe to observables
  }
}
```

### Step 3: Implement OnChanges

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `<p>Count: {{ count }}</p>`
})
export class CounterComponent implements OnChanges {
  @Input() count: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['count']) {
      console.log('Count changed from', changes['count'].previousValue,
                  'to', changes['count'].currentValue);
    }
  }
}
```

### Step 4: Implement OnDestroy

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  template: `<p>Time: {{ seconds }}</p>`
})
export class TimerComponent implements OnInit, OnDestroy {
  seconds = 0;
  subscription!: Subscription;

  ngOnInit() {
    // Subscribe to something
    this.subscription = setInterval(() => {
      this.seconds++;
    }, 1000);
  }

  ngOnDestroy() {
    console.log('Component destroyed, cleaning up...');
    
    // Important: Clean up subscriptions and timers!
    if (this.subscription) {
      clearInterval(this.subscription);
    }
  }
}
```

### Step 5: Observable Subscription Management

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-data-loader',
  template: `<p>{{ data }}</p>`
})
export class DataLoaderComponent implements OnInit, OnDestroy {
  data: string = '';
  subscription!: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Subscribe to observable
    this.subscription = this.dataService.getData().subscribe(result => {
      this.data = result;
      console.log('Data received:', result);
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

### Step 6: Multiple Subscriptions Management

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-multi-subscriber',
  template: `
    <p>User: {{ user }}</p>
    <p>Posts: {{ posts }}</p>
  `
})
export class MultiSubscriberComponent implements OnInit, OnDestroy {
  user: string = '';
  posts: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Subscription 1
    this.dataService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(u => this.user = u);

    // Subscription 2
    this.dataService.getPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(p => this.posts = p);
  }

  ngOnDestroy() {
    // All subscriptions unsubscribe automatically
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Step 7: AfterViewInit Example

```typescript
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-view-init',
  template: `
    <div #myDiv>Content</div>
  `
})
export class ViewInitComponent implements AfterViewInit {
  @ViewChild('myDiv') myDiv!: ElementRef;

  ngAfterViewInit() {
    console.log('View initialized');
    console.log('Div content:', this.myDiv.nativeElement.textContent);
    
    // Now you can access DOM elements
  }
}
```

---

## 💡 When to Use Each Hook

| Hook | Use Case |
|------|----------|
| **OnInit** | Fetch data, initialize properties |
| **OnChanges** | React to @Input changes |
| **DoCheck** | Custom change detection |
| **AfterViewInit** | Access DOM elements, query children |
| **OnDestroy** | Clean up subscriptions, timers |

---

## ✅ Memory Leak Prevention

✅ **Always unsubscribe from observables in ngOnDestroy**

```typescript
// Good: Unsubscribe explicitly
ngOnDestroy() {
  this.subscription.unsubscribe();
}

// Better: Use takeUntil pattern
private destroy$ = new Subject<void>();

ngOnInit() {
  this.observable.pipe(takeUntil(this.destroy$)).subscribe(...)
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// Also good: Async pipe handles unsubscribe
<p>{{ observable$ | async }}</p>
```

---

## ✅ Verification Checklist

- [ ] OnInit implemented
- [ ] Component initializes without errors
- [ ] OnChanges detects input changes
- [ ] Subscriptions clean up in OnDestroy
- [ ] No memory leaks (check DevTools)
- [ ] Timers/intervals cleared

---

## 🔗 Next Steps

1. Test lifecycle hooks
2. Move to **Prompt #4: Advanced Patterns**

---

**Estimated Time:** 20-25 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Prompts #1-2  
**Next:** `4-advanced-patterns.md`
