/**
 * Angular Templates & Data Binding - Complete Examples
 * Demonstrates interpolation, property binding, event binding, two-way binding, and pipes
 */

import { Component, Input, Output, EventEmitter, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

// ============================================================================
// EXAMPLE 1: Interpolation
// ============================================================================

@Component({
  selector: 'app-interpolation',
  template: `
    <div>
      <h1>{{ title }}</h1>
      <p>{{ getGreeting() }}</p>
      <p>{{ 2 + 2 }}</p>
      <p>{{ user?.name }}</p>
      <p>{{ user?.name || 'Unknown' }}</p>
      <p>{{ items | json }}</p>
    </div>
  `,
})
export class InterpolationComponent {
  title = 'Interpolation Example';
  user = { name: 'John' };
  items = [1, 2, 3];

  getGreeting(): string {
    return `Hello, ${new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}!`;
  }
}

// ============================================================================
// EXAMPLE 2: Property Binding
// ============================================================================

@Component({
  selector: 'app-property-binding',
  template: `
    <div>
      <!-- Bind to component property -->
      <button [disabled]="isDisabled">Click Me</button>

      <!-- Bind to input value -->
      <input [value]="inputValue" />

      <!-- Bind to image src -->
      <img [src]="imageUrl" />

      <!-- Bind to CSS classes -->
      <div [class]="cssClass"></div>
      <div [class.active]="isActive"></div>
      <div [ngClass]="classObject"></div>

      <!-- Bind to inline styles -->
      <div [style.color]="textColor"></div>
      <div [style.fontSize.px]="fontSize"></div>
      <div [ngStyle]="styleObject"></div>

      <!-- Bind to custom properties -->
      <app-child [childProperty]="parentData"></app-child>

      <!-- Bind to data attributes -->
      <div [attr.data-testid]="testId"></div>
      <div [attr.aria-label]="ariaLabel"></div>

      <!-- Bind to ARIA attributes -->
      <button [attr.aria-pressed]="isPressed">Toggle</button>
      <div [attr.role]="role"></div>
    </div>
  `,
})
export class PropertyBindingComponent {
  isDisabled = false;
  inputValue = 'Default value';
  imageUrl = '/assets/image.jpg';
  cssClass = 'my-class';
  isActive = true;
  textColor = 'red';
  fontSize = 20;
  testId = 'my-element';
  ariaLabel = 'Clickable button';
  isPressed = false;
  role = 'button';

  classObject = {
    'class-one': true,
    'class-two': false,
    'class-three': true,
  };

  styleObject = {
    color: 'blue',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  parentData = 'Data from parent';
}

@Component({
  selector: 'app-child',
  template: `<div>{{ childProperty }}</div>`,
})
export class ChildComponent {
  @Input() childProperty: string;
}

// ============================================================================
// EXAMPLE 3: Event Binding
// ============================================================================

@Component({
  selector: 'app-event-binding',
  template: `
    <div>
      <!-- Click event -->
      <button (click)="onClick()">Click Me</button>

      <!-- Event with parameter -->
      <button (click)="onItemClick(item)" *ngFor="let item of items">
        {{ item }}
      </button>

      <!-- $event object -->
      <input (keyup)="onKeyUp($event)" />

      <!-- Blur event -->
      <input (blur)="onBlur()" placeholder="Focus and blur" />

      <!-- Mouse events -->
      <div (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
        Hover me
      </div>

      <!-- Submit event -->
      <form (ngSubmit)="onSubmit()">
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </form>

      <!-- Change event -->
      <select (change)="onChange($event)">
        <option>Option 1</option>
        <option>Option 2</option>
      </select>

      <!-- Focus event -->
      <input (focus)="onFocus()" placeholder="Focus on me" />

      <!-- Double click -->
      <button (dblclick)="onDoubleClick()">Double Click</button>

      <!-- Custom events via Output -->
      <app-child-emitter (childEvent)="onChildEvent($event)"></app-child-emitter>
    </div>
  `,
})
export class EventBindingComponent {
  items = ['Item 1', 'Item 2', 'Item 3'];

  onClick(): void {
    console.log('Button clicked');
  }

  onItemClick(item: string): void {
    console.log('Item clicked:', item);
  }

  onKeyUp(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    console.log('Key pressed:', input.value);
  }

  onBlur(): void {
    console.log('Input blurred');
  }

  onMouseEnter(): void {
    console.log('Mouse entered');
  }

  onMouseLeave(): void {
    console.log('Mouse left');
  }

  onSubmit(): void {
    console.log('Form submitted');
  }

  onChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    console.log('Selected:', select.value);
  }

  onFocus(): void {
    console.log('Input focused');
  }

  onDoubleClick(): void {
    console.log('Double clicked');
  }

  onChildEvent(data: any): void {
    console.log('Child event received:', data);
  }
}

@Component({
  selector: 'app-child-emitter',
  template: `<button (click)="emitEvent()">Emit Event</button>`,
})
export class ChildEmitterComponent {
  @Output() childEvent = new EventEmitter<string>();

  emitEvent(): void {
    this.childEvent.emit('Data from child');
  }
}

// ============================================================================
// EXAMPLE 4: Two-Way Binding with ngModel
// ============================================================================

@Component({
  selector: 'app-two-way-binding',
  template: `
    <div>
      <!-- Two-way binding with ngModel -->
      <input [(ngModel)]="name" placeholder="Enter your name" />
      <p>You entered: {{ name }}</p>

      <!-- Two-way binding with custom directive -->
      <input [(appTwoWayBind)]="value" />
      <p>Value: {{ value }}</p>

      <!-- Form control with ngModel -->
      <input [(ngModel)]="email" name="email" />

      <!-- Two-way binding with select -->
      <select [(ngModel)]="selectedOption">
        <option>Choose...</option>
        <option value="opt1">Option 1</option>
        <option value="opt2">Option 2</option>
      </select>
      <p>Selected: {{ selectedOption }}</p>

      <!-- Two-way binding with checkbox -->
      <input type="checkbox" [(ngModel)]="isAgreed" />
      <p>Agreed: {{ isAgreed }}</p>
    </div>
  `,
})
export class TwoWayBindingComponent {
  name = '';
  value = '';
  email = '';
  selectedOption = '';
  isAgreed = false;
}

// ============================================================================
// EXAMPLE 5: Template Variables and References
// ============================================================================

@Component({
  selector: 'app-template-variables',
  template: `
    <div>
      <!-- Template reference variable -->
      <input #nameInput placeholder="Enter name" />
      <button (click)="getName(nameInput.value)">Get Name</button>
      <button (click)="clearInput(nameInput)">Clear</button>

      <!-- Template variable with form -->
      <form #myForm="ngForm">
        <input ngModel name="username" required />
        <button [disabled]="myForm.invalid">Submit</button>
      </form>

      <!-- Template variable with ngFor -->
      <ul>
        <li #item *ngFor="let item of items">{{ item }}</li>
      </ul>
      <button (click)="logItems()">Log Items</button>

      <!-- Template variable with component -->
      <app-child-component #childComp></app-child-component>
      <button (click)="callChildMethod()">Call Child</button>
    </div>
  `,
})
export class TemplateVariablesComponent {
  items = ['Item 1', 'Item 2', 'Item 3'];

  getName(name: string): void {
    console.log('Name:', name);
  }

  clearInput(input: HTMLInputElement): void {
    input.value = '';
  }

  logItems(): void {
    console.log('Items:', this.items);
  }

  callChildMethod(): void {
    // Would call child method if reference was @ViewChild
  }
}

@Component({
  selector: 'app-child-component',
  template: `<div>Child Component</div>`,
})
export class ChildComponentExample {}

// ============================================================================
// EXAMPLE 6: Safe Navigation Operator
// ============================================================================

@Component({
  selector: 'app-safe-navigation',
  template: `
    <div>
      <!-- Safe navigation with optional chaining -->
      <p>{{ user?.name }}</p>
      <p>{{ user?.address?.street }}</p>
      <p>{{ user?.profile?.photo?.url }}</p>

      <!-- With fallback -->
      <p>{{ user?.name || 'Unknown User' }}</p>

      <!-- Safe method calls -->
      <p>{{ user?.getDisplayName?.() }}</p>

      <!-- Safe array access -->
      <p>{{ items?.[0] }}</p>

      <!-- Safe with async pipe -->
      <p>{{ (user$ | async)?.name }}</p>
    </div>
  `,
})
export class SafeNavigationComponent {
  user = { name: 'John', address: null };
  user$: Observable<any> = of({ name: 'Jane' });
  items: string[] = [];
}

// ============================================================================
// EXAMPLE 7: Built-in Pipes
// ============================================================================

@Component({
  selector: 'app-pipes-example',
  template: `
    <div>
      <!-- String pipes -->
      <p>{{ text | uppercase }}</p>
      <p>{{ text | lowercase }}</p>
      <p>{{ text | titlecase }}</p>

      <!-- Number pipes -->
      <p>{{ 1234.5678 | number: '1.0-2' }}</p>
      <p>{{ 0.254 | percent }}</p>
      <p>{{ 1234567 | currency: 'USD' }}</p>

      <!-- Date pipe -->
      <p>{{ date | date: 'short' }}</p>
      <p>{{ date | date: 'medium' }}</p>
      <p>{{ date | date: 'dd-MM-yyyy' }}</p>

      <!-- Array pipes -->
      <p>{{ items | json }}</p>
      <p>{{ items | slice: 0:2 }}</p>

      <!-- Slice pipe for strings -->
      <p>{{ text | slice: 0:5 }}</p>

      <!-- Keyvalue pipe for objects -->
      <div *ngFor="let item of (obj | keyvalue)">
        {{ item.key }}: {{ item.value }}
      </div>

      <!-- Async pipe -->
      <p>{{ data$ | async }}</p>

      <!-- Conditional pipe -->
      <p *ngIf="value; else noValue">{{ value }}</p>
      <ng-template #noValue>
        <p>No value</p>
      </ng-template>
    </div>
  `,
})
export class PipesExampleComponent {
  text = 'Angular Templates';
  date = new Date();
  items = [1, 2, 3, 4, 5];
  obj = { name: 'John', age: 30 };
  data$ = of('Async data');
  value: string | null = null;
}

// ============================================================================
// EXAMPLE 8: Custom Pipes
// ============================================================================

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, search: string): string {
    if (!search) return value;
    const regex = new RegExp(search, 'gi');
    return value.replace(regex, (match) => `<strong>${match}</strong>`);
  }
}

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, length: number = 50): string {
    return value.length > length ? value.substring(0, length) + '...' : value;
  }
}

@Component({
  selector: 'app-custom-pipes',
  template: `
    <div>
      <p [innerHTML]="text | highlight: 'Angular'"></p>
      <p>{{ longText | truncate: 20 }}</p>
    </div>
  `,
})
export class CustomPipesComponent {
  text = 'Angular is a framework';
  longText =
    'This is a very long text that needs to be truncated for display purposes';
}

// ============================================================================
// EXAMPLE 9: Structural Directives in Templates
// ============================================================================

@Component({
  selector: 'app-structural-directives',
  template: `
    <div>
      <!-- ngIf -->
      <div *ngIf="showContent">This is shown conditionally</div>
      <div *ngIf="!showContent">Content is hidden</div>

      <!-- ngIf with else -->
      <div *ngIf="isLoggedIn; else notLoggedIn">Welcome back!</div>
      <ng-template #notLoggedIn>
        <div>Please log in</div>
      </ng-template>

      <!-- ngIf with then/else -->
      <div *ngIf="isLoading; then loading; else content"></div>
      <ng-template #loading>
        <p>Loading...</p>
      </ng-template>
      <ng-template #content>
        <p>Content loaded</p>
      </ng-template>

      <!-- ngFor -->
      <ul>
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>

      <!-- ngFor with index -->
      <ul>
        <li *ngFor="let item of items; let i = index">
          {{ i }}: {{ item }}
        </li>
      </ul>

      <!-- ngFor with first/last -->
      <div *ngFor="let item of items; let first = first; let last = last">
        <div *ngIf="first" class="border-top">{{ item }}</div>
        <div *ngIf="!first && !last">{{ item }}</div>
        <div *ngIf="last" class="border-bottom">{{ item }}</div>
      </div>

      <!-- ngSwitch -->
      <div [ngSwitch]="selectedValue">
        <p *ngSwitchCase="'a'">Option A</p>
        <p *ngSwitchCase="'b'">Option B</p>
        <p *ngSwitchDefault>Default option</p>
      </div>
    </div>
  `,
})
export class StructuralDirectivesComponent {
  showContent = true;
  isLoggedIn = true;
  isLoading = false;
  items = ['Item 1', 'Item 2', 'Item 3'];
  selectedValue = 'a';
}

// ============================================================================
// EXAMPLE 10: Attribute Binding Summary
// ============================================================================

@Component({
  selector: 'app-binding-summary',
  template: `
    <div>
      <!-- Property binding (one-way down) -->
      <div [property]="value"></div>

      <!-- Event binding (one-way up) -->
      <button (event)="onEvent()"></button>

      <!-- Two-way binding (property + event) -->
      <input [(ngModel)]="value" />

      <!-- String interpolation (one-way down) -->
      <div>{{ value }}</div>

      <!-- Attribute binding -->
      <div [attr.attribute]="value"></div>

      <!-- Class binding -->
      <div [class.className]="condition"></div>
      <div [ngClass]="classObject"></div>

      <!-- Style binding -->
      <div [style.property]="'value'"></div>
      <div [ngStyle]="styleObject"></div>
    </div>
  `,
})
export class BindingSummaryComponent {
  value = '';
  condition = true;
  classObject = {};
  styleObject = {};
}
