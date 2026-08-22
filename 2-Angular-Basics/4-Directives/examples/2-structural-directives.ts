/**
 * Structural Directives Examples
 * *ngIf, *ngFor, *ngSwitch with performance optimization
 */

import { Component, Input } from '@angular/core';

// ============================================================
// EXAMPLE 1: *ngIf - Basic Conditional
// ============================================================

@Component({
  selector: 'app-ngif-basic',
  template: `
    <div>
      <!-- Simple condition -->
      <p *ngIf="isVisible">This is visible</p>
      
      <!-- Toggle with button -->
      <button (click)="isVisible = !isVisible">
        {{ isVisible ? 'Hide' : 'Show' }}
      </button>
    </div>
  `
})
export class NgIfBasicComponent {
  isVisible = true;
}

// ============================================================
// EXAMPLE 2: *ngIf with else Template
// ============================================================

@Component({
  selector: 'app-ngif-else',
  template: `
    <div>
      <div *ngIf="isLoggedIn; else notLoggedIn">
        <p>Welcome, {{ username }}!</p>
        <button (click)="logout()">Logout</button>
      </div>
      
      <ng-template #notLoggedIn>
        <p>Please log in</p>
        <button (click)="login()">Login</button>
      </ng-template>
    </div>
  `
})
export class NgIfElseComponent {
  isLoggedIn = false;
  username = 'John';

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }
}

// ============================================================
// EXAMPLE 3: *ngIf with then/else Templates
// ============================================================

@Component({
  selector: 'app-ngif-then-else',
  template: `
    <div>
      <div *ngIf="isPremium; then premiumTemplate; else basicTemplate"></div>
      
      <ng-template #premiumTemplate>
        <h2>Premium Features</h2>
        <ul>
          <li>Advanced Analytics</li>
          <li>Priority Support</li>
          <li>Custom Branding</li>
        </ul>
      </ng-template>
      
      <ng-template #basicTemplate>
        <h2>Basic Features</h2>
        <ul>
          <li>Standard Support</li>
          <li>Basic Analytics</li>
        </ul>
      </ng-template>
    </div>
  `
})
export class NgIfThenElseComponent {
  isPremium = true;
}

// ============================================================
// EXAMPLE 4: *ngFor - Simple Loop
// ============================================================

@Component({
  selector: 'app-ngfor-simple',
  template: `
    <ul>
      <li *ngFor="let item of items">
        {{ item }}
      </li>
    </ul>
  `
})
export class NgForSimpleComponent {
  items = ['Apple', 'Banana', 'Cherry', 'Date'];
}

// ============================================================
// EXAMPLE 5: *ngFor with Index & Context
// ============================================================

@Component({
  selector: 'app-ngfor-context',
  template: `
    <ul>
      <li *ngFor="let item of items; let i = index; let first = first; let last = last"
          [class.first]="first" [class.last]="last">
        {{ i }}: {{ item }}
        <span *ngIf="first">(First)</span>
        <span *ngIf="last">(Last)</span>
      </li>
    </ul>
  `,
  styles: [`
    .first { color: green; font-weight: bold; }
    .last { color: red; }
  `]
})
export class NgForContextComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
}

// ============================================================
// EXAMPLE 6: *ngFor with Even/Odd Styling
// ============================================================

@Component({
  selector: 'app-ngfor-even-odd',
  template: `
    <div class="list">
      <div *ngFor="let item of items; let even = even; let odd = odd"
           [class.even]="even" [class.odd]="odd"
           [style.background-color]="even ? '#f0f0f0' : '#ffffff'">
        {{ item.name }}
      </div>
    </div>
  `,
  styles: [`
    .list { border: 1px solid #ccc; }
    .even { padding: 10px; }
    .odd { padding: 10px; }
  `]
})
export class NgForEvenOddComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' }
  ];
}

// ============================================================
// EXAMPLE 7: *ngFor with TrackBy - Performance
// ============================================================

@Component({
  selector: 'app-ngfor-trackby',
  template: `
    <div>
      <p>Total renders: {{ renderCount }}</p>
      
      <!-- WITH TrackBy (optimized) -->
      <h3>With TrackBy:</h3>
      <div *ngFor="let user of users; trackBy: trackByFn" class="user-card">
        {{ user.id }}: {{ user.name }}
      </div>
      
      <!-- WITHOUT TrackBy (slow) -->
      <h3>Without TrackBy (slow):</h3>
      <div *ngFor="let user of users" class="user-card">
        {{ user.id }}: {{ user.name }}
      </div>
      
      <button (click)="addUser()">Add User</button>
    </div>
  `,
  styles: [`
    .user-card { padding: 10px; border: 1px solid #ddd; margin: 5px; }
  `]
})
export class NgForTrackByComponent {
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
  renderCount = 0;

  trackByFn(index: number, user: any): number {
    return user.id; // Return unique identifier
  }

  addUser() {
    this.users.push({
      id: this.users.length + 1,
      name: `User ${this.users.length + 1}`
    });
    this.renderCount++;
  }
}

// ============================================================
// EXAMPLE 8: Nested *ngFor
// ============================================================

@Component({
  selector: 'app-ngfor-nested',
  template: `
    <div *ngFor="let category of categories">
      <h3>{{ category.name }}</h3>
      <ul>
        <li *ngFor="let item of category.items">
          {{ item }}
        </li>
      </ul>
    </div>
  `
})
export class NgForNestedComponent {
  categories = [
    { name: 'Fruits', items: ['Apple', 'Banana', 'Orange'] },
    { name: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach'] },
    { name: 'Meats', items: ['Chicken', 'Beef', 'Pork'] }
  ];
}

// ============================================================
// EXAMPLE 9: *ngSwitch - Multi-way Branching
// ============================================================

@Component({
  selector: 'app-ngswitch-basic',
  template: `
    <div>
      <select [(ngModel)]="status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
      
      <div [ngSwitch]="status">
        <div *ngSwitchCase="'active'" class="status-active">
          ✓ Active - System is operational
        </div>
        
        <div *ngSwitchCase="'inactive'" class="status-inactive">
          ✗ Inactive - System is offline
        </div>
        
        <div *ngSwitchCase="'pending'" class="status-pending">
          ⏳ Pending - System is loading
        </div>
        
        <div *ngSwitchDefault class="status-unknown">
          ? Unknown status
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-active { color: green; }
    .status-inactive { color: red; }
    .status-pending { color: orange; }
    .status-unknown { color: gray; }
  `]
})
export class NgSwitchBasicComponent {
  status = 'active';
}

// ============================================================
// EXAMPLE 10: *ngSwitch with Objects
// ============================================================

@Component({
  selector: 'app-ngswitch-objects',
  template: `
    <div [ngSwitch]="userRole">
      <div *ngSwitchCase="role.ADMIN">
        <h3>Admin Panel</h3>
        <p>Full access to system</p>
      </div>
      
      <div *ngSwitchCase="role.MODERATOR">
        <h3>Moderator Dashboard</h3>
        <p>Limited access</p>
      </div>
      
      <div *ngSwitchCase="role.USER">
        <h3>User Profile</h3>
        <p>Basic access</p>
      </div>
      
      <div *ngSwitchDefault>
        <h3>Guest</h3>
        <p>Limited access</p>
      </div>
    </div>
  `
})
export class NgSwitchObjectsComponent {
  userRole = 'admin';
  
  role = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user'
  };
}

// ============================================================
// EXAMPLE 11: *ngFor with Filter and Sort
// ============================================================

@Component({
  selector: 'app-ngfor-filter',
  template: `
    <div>
      <input [(ngModel)]="searchTerm" placeholder="Search..." />
      
      <ul>
        <li *ngFor="let item of filteredItems; trackBy: trackByFn">
          {{ item.name }} - {{ item.price }}
        </li>
      </ul>
    </div>
  `
})
export class NgForFilterComponent {
  items = [
    { id: 1, name: 'Apple', price: '$1' },
    { id: 2, name: 'Banana', price: '$0.50' },
    { id: 3, name: 'Cherry', price: '$2' }
  ];
  searchTerm = '';

  get filteredItems() {
    return this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
}

// ============================================================
// EXAMPLE 12: Performance Comparison
// ============================================================

@Component({
  selector: 'app-performance-comparison',
  template: `
    <div>
      <!-- ✅ GOOD: Uses trackBy, only changed items update -->
      <div *ngFor="let item of items; trackBy: trackByFn">
        {{ item.name }}
      </div>
      
      <!-- ❌ BAD: No trackBy, entire list recreates -->
      <!-- <div *ngFor="let item of items">
        {{ item.name }}
      </div> -->
      
      <!-- ✅ GOOD: Remove from DOM with *ngIf -->
      <div *ngIf="show">Content</div>
      
      <!-- ❌ BAD: Keep in DOM but hide with [hidden] -->
      <!-- <div [hidden]="!show">Content</div> -->
    </div>
  `
})
export class PerformanceComparisonComponent {
  items = [{ id: 1, name: 'Item 1' }];
  show = true;

  trackByFn(index: number, item: any) {
    return item.id;
  }
}

// ============================================================
// Summary: Structural Directives
// ============================================================

/**
 * Key Concepts:
 *
 * *ngIf:
 * - Adds/removes element from DOM
 * - Use else/then for templates
 * - Better than [hidden] for performance
 *
 * *ngFor:
 * - Repeats element for each item
 * - Context: index, first, last, even, odd, count
 * - ALWAYS use trackBy for performance
 *
 * *ngSwitch:
 * - Selects one of many templates
 * - Use for 3+ conditions instead of nested *ngIf
 * - Has default case with *ngSwitchDefault
 *
 * Performance Tips:
 * ✅ Use trackBy with *ngFor
 * ✅ Use *ngIf instead of [hidden]
 * ✅ Cache filtered/sorted arrays
 * ✅ Use ng-container to avoid extra elements
 * ✅ Keep templates simple
 *
 * Best Practices:
 * ✅ One structural directive per element
 * ✅ Use safe navigation with ?
 * ✅ Use ng-template for complex logic
 * ✅ Consider performance impact
 */
