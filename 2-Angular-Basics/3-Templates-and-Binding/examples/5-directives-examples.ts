/**
 * Directives Examples
 * *ngIf, *ngFor, *ngSwitch, ngClass, ngStyle
 */

import { Component } from '@angular/core';

// ============================================================
// EXAMPLE 1: *ngIf - Conditional Rendering
// ============================================================

@Component({
  selector: 'app-ngif-example',
  template: `
    <div>
      <!-- Basic *ngIf -->
      <div *ngIf="isVisible">This is visible</div>
      
      <!-- With else -->
      <div *ngIf="isLoggedIn; else notLoggedIn">
        Welcome {{ user }}!
      </div>
      <ng-template #notLoggedIn>
        <p>Please log in</p>
      </ng-template>
      
      <!-- With then and else -->
      <div *ngIf="userExists; then hasUser; else noUser"></div>
      <ng-template #hasUser>
        <p>User found</p>
      </ng-template>
      <ng-template #noUser>
        <p>User not found</p>
      </ng-template>
    </div>
  `
})
export class NgIfComponent {
  isVisible = true;
  isLoggedIn = false;
  user = 'John';
  userExists = false;
}

// ============================================================
// EXAMPLE 2: *ngFor - List Rendering
// ============================================================

@Component({
  selector: 'app-ngfor-example',
  template: `
    <div>
      <!-- Basic loop -->
      <ul>
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>
      
      <!-- With index -->
      <ul>
        <li *ngFor="let item of items; let i = index">
          {{ i }}: {{ item }}
        </li>
      </ul>
      
      <!-- With even/odd -->
      <ul>
        <li *ngFor="let item of items; let even = even"
            [class.even]="even" [class.odd]="!even">
          {{ item }}
        </li>
      </ul>
      
      <!-- With first/last -->
      <ul>
        <li *ngFor="let item of items; let first = first; let last = last">
          <span *ngIf="first">>>> </span>
          {{ item }}
          <span *ngIf="last"> <<<</span>
        </li>
      </ul>
      
      <!-- With trackBy -->
      <ul>
        <li *ngFor="let user of users; trackBy: trackByFn">
          {{ user.id }}: {{ user.name }}
        </li>
      </ul>
    </div>
  `
})
export class NgForComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  trackByFn(index: number, user: any) {
    return user.id;
  }
}

// ============================================================
// EXAMPLE 3: Nested *ngFor
// ============================================================

@Component({
  selector: 'app-nested-ngfor',
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
export class NestedNgForComponent {
  categories = [
    { name: 'Fruits', items: ['Apple', 'Banana', 'Cherry'] },
    { name: 'Vegetables', items: ['Carrot', 'Broccoli', 'Spinach'] },
    { name: 'Meats', items: ['Chicken', 'Beef', 'Pork'] }
  ];
}

// ============================================================
// EXAMPLE 4: *ngSwitch - Multi-Way Branching
// ============================================================

@Component({
  selector: 'app-ngswitch-example',
  template: `
    <div [ngSwitch]="status">
      <div *ngSwitchCase="'active'">
        <span class="badge-green">Active</span>
      </div>
      <div *ngSwitchCase="'inactive'">
        <span class="badge-red">Inactive</span>
      </div>
      <div *ngSwitchCase="'pending'">
        <span class="badge-yellow">Pending</span>
      </div>
      <div *ngSwitchDefault>
        <span class="badge-gray">Unknown</span>
      </div>
    </div>
  `
})
export class NgSwitchComponent {
  status = 'active';
}

// ============================================================
// EXAMPLE 5: [ngClass] - Single Class
// ============================================================

@Component({
  selector: 'app-ngclass-single',
  template: `
    <div>
      <div [class.active]="isActive">Active state</div>
      <div [class.error]="hasError">Error state</div>
      <button [class.loading]="isLoading" [disabled]="isLoading">
        {{ isLoading ? 'Loading...' : 'Submit' }}
      </button>
    </div>
  `,
  styles: [`
    .active { color: green; font-weight: bold; }
    .error { color: red; background: #ffe0e0; }
    .loading { opacity: 0.6; }
  `]
})
export class NgClassSingleComponent {
  isActive = true;
  hasError = false;
  isLoading = false;
}

// ============================================================
// EXAMPLE 6: [ngClass] - Multiple Classes
// ============================================================

@Component({
  selector: 'app-ngclass-multiple',
  template: `
    <div>
      <!-- Object syntax -->
      <button [ngClass]="{ 'btn': true, 'btn-primary': isPrimary, 'btn-large': isLarge }">
        Button
      </button>
      
      <!-- Array syntax -->
      <div [ngClass]="['container', isPrimary ? 'primary' : 'secondary']">
        Array syntax
      </div>
      
      <!-- Computed classes -->
      <div [ngClass]="getClasses()">
        Computed classes
      </div>
    </div>
  `,
  styles: [`
    .btn { padding: 10px 20px; }
    .btn-primary { background: blue; color: white; }
    .btn-large { font-size: 18px; }
  `]
})
export class NgClassMultipleComponent {
  isPrimary = true;
  isLarge = false;

  getClasses() {
    return {
      'active': this.isPrimary,
      'large': this.isLarge,
      'disabled': !this.isPrimary
    };
  }
}

// ============================================================
// EXAMPLE 7: [ngStyle] - Single Style
// ============================================================

@Component({
  selector: 'app-ngstyle-single',
  template: `
    <div>
      <p [style.color]="textColor">Colored text</p>
      <p [style.font-size]="fontSize">Variable font size</p>
      <div [style.width.px]="boxWidth">{{ boxWidth }}px wide</div>
    </div>
  `
})
export class NgStyleSingleComponent {
  textColor = 'red';
  fontSize = '20px';
  boxWidth = 200;
}

// ============================================================
// EXAMPLE 8: [ngStyle] - Multiple Styles
// ============================================================

@Component({
  selector: 'app-ngstyle-multiple',
  template: `
    <div>
      <!-- Object syntax -->
      <div [ngStyle]="{ 'color': textColor, 'font-size': fontSize, 'background-color': backgroundColor }">
        Multiple styles
      </div>
      
      <!-- Computed styles -->
      <div [ngStyle]="getStyles()">
        Computed styles
      </div>
    </div>
  `
})
export class NgStyleMultipleComponent {
  textColor = 'blue';
  fontSize = '18px';
  backgroundColor = '#f0f0f0';

  getStyles() {
    return {
      'color': this.textColor,
      'font-size': this.fontSize,
      'padding': '10px',
      'border': '1px solid #ccc'
    };
  }
}

// ============================================================
// EXAMPLE 9: Combining Directives
// ============================================================

@Component({
  selector: 'app-combined-directives',
  template: `
    <div *ngIf="items && items.length > 0">
      <ul>
        <li *ngFor="let item of items; let i = index"
            [ngClass]="{ 'even': i % 2 === 0, 'odd': i % 2 !== 0 }"
            [ngStyle]="{ 'color': i % 2 === 0 ? 'blue' : 'green' }">
          {{ i }}: {{ item.name }}
        </li>
      </ul>
    </div>
    <div *ngIf="!items || items.length === 0">
      No items found
    </div>
  `,
  styles: [`
    .even { background: #f0f0f0; }
    .odd { background: white; }
  `]
})
export class CombinedDirectivesComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
}

// ============================================================
// EXAMPLE 10: ng-template and ng-container
// ============================================================

@Component({
  selector: 'app-ng-template-container',
  template: `
    <div>
      <!-- ng-container - no extra DOM element -->
      <ng-container *ngFor="let item of items">
        <span>{{ item }}</span>
      </ng-container>
      
      <!-- ng-template - for conditional content -->
      <ng-template #successMsg>
        <p>Operation successful!</p>
      </ng-template>
      
      <div *ngIf="success; then successMsg"></div>
    </div>
  `
})
export class NgTemplateContainerComponent {
  items = ['Item 1', 'Item 2', 'Item 3'];
  success = true;
}

// ============================================================
// EXAMPLE 11: Complex ngClass and ngStyle
// ============================================================

@Component({
  selector: 'app-complex-directives',
  template: `
    <div [ngClass]="getCardClasses()" [ngStyle]="getCardStyles()">
      <h3>{{ title }}</h3>
      <p [ngClass]="{ 'text-muted': !active }">{{ description }}</p>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ccc; padding: 20px; border-radius: 4px; }
    .card-active { border-color: green; }
    .card-error { border-color: red; background: #ffe0e0; }
    .text-muted { color: #999; }
  `]
})
export class ComplexDirectivesComponent {
  title = 'Card Title';
  description = 'Card description';
  active = true;
  hasError = false;

  getCardClasses() {
    return {
      'card': true,
      'card-active': this.active && !this.hasError,
      'card-error': this.hasError
    };
  }

  getCardStyles() {
    return {
      'background-color': this.active ? '#fff' : '#f5f5f5',
      'box-shadow': this.active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
    };
  }
}

// ============================================================
// EXAMPLE 12: Directive Performance with trackBy
// ============================================================

@Component({
  selector: 'app-directive-performance',
  template: `
    <div>
      <!-- ✅ GOOD - with trackBy -->
      <ul>
        <li *ngFor="let user of users; trackBy: trackByFn">
          {{ user.id }}: {{ user.name }}
        </li>
      </ul>
      
      <!-- ❌ BAD - without trackBy (recreates DOM) -->
      <!-- <ul>
        <li *ngFor="let user of users">
          {{ user.id }}: {{ user.name }}
        </li>
      </ul> -->
    </div>
  `
})
export class DirectivePerformanceComponent {
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  trackByFn(index: number, user: any) {
    return user.id;
  }
}

// ============================================================
// Summary: Directive Best Practices
// ============================================================

/**
 * ✅ DO:
 * - Use *ngIf for conditional rendering
 * - Use *ngFor for list rendering
 * - Always use trackBy with *ngFor
 * - Use ng-container to avoid extra elements
 * - Use [ngClass] for dynamic classes
 * - Use [ngStyle] for dynamic styles
 * - Combine directives effectively
 *
 * ❌ DON'T:
 * - Use [hidden] instead of *ngIf
 * - Forget trackBy in *ngFor
 * - Create unnecessary wrapper elements
 * - Use complex logic in templates
 * - Nest too many directives
 */
