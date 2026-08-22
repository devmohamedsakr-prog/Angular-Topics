/**
 * Component Lifecycle Hooks Example
 * Demonstrates all 8 lifecycle hooks in execution order
 */

import {
  Component,
  Input,
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ============================================================
// EXAMPLE 1: All Lifecycle Hooks with Logging
// ============================================================

@Component({
  selector: 'app-lifecycle-demo',
  template: `
    <div>
      <h2>Lifecycle Hooks Demo</h2>
      <input #input />
      <p>{{ message }}</p>
      <button (click)="triggerChange()">Trigger Change</button>
    </div>
  `
})
export class LifecycleDemoComponent implements
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy {

  @Input() name: string;
  @ViewChild('input') inputRef: ElementRef;

  message = 'Initialization starting...';
  private changeDetectionCount = 0;

  constructor() {
    console.log('1. Constructor called');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('2. ngOnChanges called', changes);
    if (changes['name']) {
      this.message = `Name changed to: ${changes['name'].currentValue}`;
    }
  }

  ngOnInit() {
    console.log('3. ngOnInit called - component initialized');
    this.message = 'Component initialized!';
  }

  ngDoCheck() {
    this.changeDetectionCount++;
    console.log(`4. ngDoCheck called (count: ${this.changeDetectionCount})`);
  }

  ngAfterContentInit() {
    console.log('5. ngAfterContentInit called - content projected');
  }

  ngAfterContentChecked() {
    console.log('6. ngAfterContentChecked called - content checked');
  }

  ngAfterViewInit() {
    console.log('7. ngAfterViewInit called - view initialized');
    if (this.inputRef) {
      this.inputRef.nativeElement.focus();
    }
  }

  ngAfterViewChecked() {
    console.log('8. ngAfterViewChecked called - view checked');
  }

  ngOnDestroy() {
    console.log('9. ngOnDestroy called - cleaning up');
  }

  triggerChange() {
    this.message = 'Change triggered at ' + new Date().toLocaleTimeString();
  }
}

// ============================================================
// EXAMPLE 2: Detecting Input Changes
// ============================================================

interface UserData {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-tracker',
  template: `
    <div>
      <h3>User: {{ user?.name }}</h3>
      <p>Email: {{ user?.email }}</p>
      <div class="changes">
        <p *ngFor="let change of changeLog">{{ change }}</p>
      </div>
    </div>
  `
})
export class UserTrackerComponent implements OnChanges {
  @Input() user: UserData;
  changeLog: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      const chg = changes[propName];
      const prev = JSON.stringify(chg.previousValue);
      const current = JSON.stringify(chg.currentValue);

      if (chg.firstChange) {
        this.changeLog.push(`Initial value for ${propName}: ${current}`);
      } else {
        this.changeLog.push(
          `Changed ${propName} from ${prev} to ${current}`
        );
      }
    }
  }
}

// ============================================================
// EXAMPLE 3: Data Loading in ngOnInit
// ============================================================

@Component({
  selector: 'app-data-loader',
  template: `
    <div>
      <p *ngIf="loading">Loading...</p>
      <div *ngIf="!loading">
        <h3>{{ data.title }}</h3>
        <p>{{ data.description }}</p>
      </div>
    </div>
  `
})
export class DataLoaderComponent implements OnInit {
  data: any = {};
  loading = true;

  constructor(private dataService: any) {}

  ngOnInit() {
    // Simulate API call
    setTimeout(() => {
      this.data = {
        title: 'Data Loaded',
        description: 'This data was loaded in ngOnInit'
      };
      this.loading = false;
    }, 2000);
  }
}

// ============================================================
// EXAMPLE 4: Proper Unsubscription Pattern
// ============================================================

@Component({
  selector: 'app-subscription-manager',
  template: `
    <div>
      <p>{{ dataMessage }}</p>
    </div>
  `
})
export class SubscriptionManagerComponent implements OnInit, OnDestroy {
  dataMessage = '';
  private destroy$ = new Subject<void>();

  constructor(private dataService: any) {}

  ngOnInit() {
    // Method 1: Using takeUntil
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.dataMessage = data;
      });

    // Method 2: Store subscriptions
    // This is shown in next example
  }

  ngOnDestroy() {
    // Complete the destroy subject to trigger takeUntil
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================
// EXAMPLE 5: Managing Multiple Subscriptions
// ============================================================

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-multi-subscription',
  template: `
    <div>
      <p>Updates: {{ updateCount }}</p>
      <p>Errors: {{ errorCount }}</p>
    </div>
  `
})
export class MultiSubscriptionComponent implements OnInit, OnDestroy {
  updateCount = 0;
  errorCount = 0;
  private subscriptions: Subscription[] = [];

  constructor(private eventService: any) {}

  ngOnInit() {
    // Subscribe to multiple sources
    const sub1 = this.eventService.updates$.subscribe(() => {
      this.updateCount++;
    });

    const sub2 = this.eventService.errors$.subscribe(() => {
      this.errorCount++;
    });

    // Store all subscriptions
    this.subscriptions.push(sub1, sub2);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

// ============================================================
// EXAMPLE 6: View Access in AfterViewInit
// ============================================================

@Component({
  selector: 'app-view-accessor',
  template: `
    <input #nameInput placeholder="Enter name" />
    <button (click)="clearInput()">Clear</button>
    <p>Input value: {{ inputValue }}</p>
  `
})
export class ViewAccessorComponent implements AfterViewInit {
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;
  inputValue = '';

  ngAfterViewInit() {
    // Safe to access view now
    if (this.nameInput) {
      this.nameInput.nativeElement.focus();
      this.nameInput.nativeElement.value = 'Initial value';
    }
  }

  clearInput() {
    this.inputValue = this.nameInput.nativeElement.value;
    this.nameInput.nativeElement.value = '';
  }
}

// ============================================================
// EXAMPLE 7: Cleanup with Timers
// ============================================================

@Component({
  selector: 'app-timer-cleanup',
  template: `
    <div>
      <p>Elapsed: {{ seconds }}s</p>
      <button (click)="stop()">Stop Timer</button>
    </div>
  `
})
export class TimerCleanupComponent implements OnInit, OnDestroy {
  seconds = 0;
  private timerInterval: any;

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      this.seconds++;
    }, 1000);
  }

  ngOnDestroy() {
    // Important: Clean up timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  stop() {
    clearInterval(this.timerInterval);
  }
}

// ============================================================
// EXAMPLE 8: Custom Change Detection
// ============================================================

@Component({
  selector: 'app-custom-detection',
  template: `
    <div>
      <p>Detections: {{ detectionCount }}</p>
      <input (input)="onInput($event)" />
    </div>
  `
})
export class CustomDetectionComponent implements DoCheck {
  detectionCount = 0;
  previousInputValue = '';

  ngDoCheck() {
    this.detectionCount++;
    console.log('Custom change detection check #' + this.detectionCount);
  }

  onInput(event: any) {
    this.previousInputValue = event.target.value;
  }
}

// ============================================================
// EXAMPLE 9: Complete Lifecycle Component
// ============================================================

@Component({
  selector: 'app-complete-lifecycle',
  template: `
    <div class="container">
      <h2>{{ title }}</h2>
      <div class="status">
        <p>Status: {{ status }}</p>
        <p>Events logged: {{ eventLog.length }}</p>
      </div>
      <ul class="event-log">
        <li *ngFor="let event of eventLog">{{ event }}</li>
      </ul>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .event-log { max-height: 200px; overflow-y: auto; }
    li { padding: 5px; }
  `]
})
export class CompleteLifecycleComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() title = 'Lifecycle Component';
  status = 'Initializing';
  eventLog: string[] = [];
  private destroy$ = new Subject<void>();
  private eventSub: any;

  constructor(private eventService?: any) {
    this.log('Constructor');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.log(`ngOnChanges: ${JSON.stringify(Object.keys(changes))}`);
  }

  ngOnInit() {
    this.log('ngOnInit');
    this.status = 'Initialized';

    // Setup subscriptions with proper cleanup
    if (this.eventService) {
      this.eventService.events$
        .pipe(takeUntil(this.destroy$))
        .subscribe((event: any) => {
          this.log(`Event received: ${event}`);
        });
    }
  }

  ngAfterViewInit() {
    this.log('ngAfterViewInit');
    this.status = 'Ready';
  }

  ngOnDestroy() {
    this.log('ngOnDestroy');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.eventLog.push(`[${timestamp}] ${message}`);
    console.log(message);
  }
}

// ============================================================
// Summary of Lifecycle Hooks
// ============================================================

/**
 * Lifecycle Execution Order:
 *
 * 1. Constructor - Called before any hook
 * 2. ngOnChanges - When @Input changes
 * 3. ngOnInit - Once after initialization
 * 4. ngDoCheck - Every change detection cycle
 * 5. ngAfterContentInit - After projected content init
 * 6. ngAfterContentChecked - After projected content checked
 * 7. ngAfterViewInit - After view initialized
 * 8. ngAfterViewChecked - After view checked
 * 9. ngOnDestroy - Before component destroyed
 *
 * Important Patterns:
 * ✅ Load data in ngOnInit
 * ✅ Access DOM in ngAfterViewInit
 * ✅ Unsubscribe in ngOnDestroy
 * ✅ Detect changes in ngOnChanges
 * ✅ Use takeUntil for observable cleanup
 */
