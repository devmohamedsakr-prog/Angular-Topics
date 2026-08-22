/**
 * Input/Output & Component Communication Example
 * Demonstrates @Input, @Output, two-way binding, and parent-child communication
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

// ============================================================
// EXAMPLE 1: Basic @Input Properties
// ============================================================

@Component({
  selector: 'app-greeting',
  template: `<h1>Hello, {{ name }}!</h1>`
})
export class GreetingComponent {
  @Input() name: string = 'Guest';
}

// Usage:
// <app-greeting [name]="'Alice'"></app-greeting>
// <app-greeting name="Bob"></app-greeting>

// ============================================================
// EXAMPLE 2: Multiple @Input Properties
// ============================================================

@Component({
  selector: 'app-button',
  template: `
    <button [disabled]="disabled" [class.primary]="type === 'primary'">
      {{ label }}
    </button>
  `,
  styles: [`
    button.primary { background: blue; color: white; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class CustomButtonComponent {
  @Input() label: string = 'Click me';
  @Input() disabled: boolean = false;
  @Input() type: string = 'default';
}

// Usage:
// <app-button [label]="'Submit'" [type]="'primary'"></app-button>

// ============================================================
// EXAMPLE 3: @Input Aliases
// ============================================================

@Component({
  selector: 'app-card-title'
})
export class CardTitleComponent {
  @Input('headerText') title: string;
}

// Usage:
// <app-card-title [headerText]="'My Title'"></app-card-title>

// ============================================================
// EXAMPLE 4: Typed @Input Properties
// ============================================================

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="user">
      <h2>{{ user.name }}</h2>
      <p>Email: {{ user.email }}</p>
      <span *ngIf="user.isActive">Active</span>
    </div>
  `
})
export class UserProfileComponent {
  @Input() user: User | null = null;
}

// Usage:
// <app-user-profile [user]="currentUser"></app-user-profile>

// ============================================================
// EXAMPLE 5: Basic @Output with EventEmitter
// ============================================================

@Component({
  selector: 'app-delete-button',
  template: `<button (click)="onDelete()">Delete</button>`
})
export class DeleteButtonComponent {
  @Output() deleted = new EventEmitter<void>();

  onDelete() {
    this.deleted.emit();
  }
}

// Parent usage:
// <app-delete-button (deleted)="onItemDeleted()"></app-delete-button>

// ============================================================
// EXAMPLE 6: @Output with Data Emission
// ============================================================

@Component({
  selector: 'app-color-picker',
  template: `
    <div>
      <button (click)="selectColor('red')">Red</button>
      <button (click)="selectColor('blue')">Blue</button>
      <button (click)="selectColor('green')">Green</button>
    </div>
  `
})
export class ColorPickerComponent {
  @Output() colorSelected = new EventEmitter<string>();

  selectColor(color: string) {
    this.colorSelected.emit(color);
  }
}

// Parent usage:
// <app-color-picker (colorSelected)="onColorSelected($event)"></app-color-picker>

// ============================================================
// EXAMPLE 7: @Output Aliases
// ============================================================

@Component({
  selector: 'app-menu-item'
})
export class MenuItemComponent {
  @Output('itemClick') clicked = new EventEmitter<string>();

  onClick(item: string) {
    this.clicked.emit(item);
  }
}

// Usage:
// <app-menu-item (itemClick)="handleMenuClick($event)"></app-menu-item>

// ============================================================
// EXAMPLE 8: Detecting @Input Changes
// ============================================================

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <p>Multiplied: {{ multiplied }}</p>
    </div>
  `
})
export class CounterComponent implements OnChanges {
  @Input() count: number = 0;
  multiplied: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['count']) {
      const currentValue = changes['count'].currentValue;
      this.multiplied = currentValue * 2;
      console.log(`Count changed to ${currentValue}`);
    }
  }
}

// ============================================================
// EXAMPLE 9: Two-Way Binding Pattern
// ============================================================

@Component({
  selector: 'app-text-input'
})
export class TextInputComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}

// Parent - Explicit:
// <app-text-input [value]="name" (valueChange)="name = $event"></app-text-input>

// Parent - Two-way binding:
// <app-text-input [(value)]="name"></app-text-input>

// ============================================================
// EXAMPLE 10: Parent-Child Communication (Complete Pattern)
// ============================================================

// Child Component
@Component({
  selector: 'app-todo-item',
  template: `
    <div class="todo-item">
      <span [class.completed]="todo.completed">{{ todo.title }}</span>
      <button (click)="onComplete()">Complete</button>
      <button (click)="onDelete()">Delete</button>
    </div>
  `,
  styles: [`
    .todo-item { display: flex; gap: 10px; }
    .completed { text-decoration: line-through; }
  `]
})
export class TodoItemComponent {
  @Input() todo: { id: number; title: string; completed: boolean };
  @Output() completed = new EventEmitter<number>();
  @Output() deleted = new EventEmitter<number>();

  onComplete() {
    this.completed.emit(this.todo.id);
  }

  onDelete() {
    this.deleted.emit(this.todo.id);
  }
}

// Parent Component
@Component({
  selector: 'app-todo-list',
  template: `
    <div>
      <h2>Todo List</h2>
      <app-todo-item
        *ngFor="let todo of todos"
        [todo]="todo"
        (completed)="onTodoCompleted($event)"
        (deleted)="onTodoDeleted($event)">
      </app-todo-item>
    </div>
  `
})
export class TodoListComponent {
  todos = [
    { id: 1, title: 'Learn Angular', completed: false },
    { id: 2, title: 'Build components', completed: false }
  ];

  onTodoCompleted(id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = true;
    }
  }

  onTodoDeleted(id: number) {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}

// ============================================================
// EXAMPLE 11: Complex Type Communication
// ============================================================

interface FormData {
  name: string;
  email: string;
  age: number;
  subscribe: boolean;
}

// Form Component (Child)
@Component({
  selector: 'app-signup-form'
})
export class SignupFormComponent {
  @Input() initialData?: FormData;
  @Output() submitted = new EventEmitter<FormData>();

  formData: FormData = {
    name: '',
    email: '',
    age: 0,
    subscribe: false
  };

  ngOnInit() {
    if (this.initialData) {
      this.formData = { ...this.initialData };
    }
  }

  onSubmit() {
    this.submitted.emit(this.formData);
  }
}

// Parent Component
@Component({
  selector: 'app-app'
})
export class AppComponent {
  onFormSubmit(data: FormData) {
    console.log('Form submitted:', data);
  }
}

// ============================================================
// EXAMPLE 12: Input Validation
// ============================================================

@Component({
  selector: 'app-rating'
})
export class RatingComponent implements OnChanges {
  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rating']) {
      const newRating = changes['rating'].currentValue;
      
      // Validate
      if (newRating < 0 || newRating > 5) {
        console.warn('Rating must be between 0 and 5');
        this.rating = Math.max(0, Math.min(5, newRating));
      }
    }
  }

  setRating(value: number) {
    if (value >= 0 && value <= 5) {
      this.rating = value;
      this.ratingChange.emit(value);
    }
  }
}

// ============================================================
// EXAMPLE 13: @Input with Default Value
// ============================================================

@Component({
  selector: 'app-alert'
})
export class AlertComponent {
  @Input() type: string = 'info';
  @Input() message: string = '';
  @Input() dismissible: boolean = true;
  @Input() autoClose: number = 0; // 0 = disabled

  isVisible = true;

  close() {
    this.isVisible = false;
  }

  ngOnInit() {
    if (this.autoClose > 0) {
      setTimeout(() => {
        this.close();
      }, this.autoClose);
    }
  }
}

// ============================================================
// EXAMPLE 14: Emitting Typed Events
// ============================================================

interface DropdownOption {
  id: number;
  label: string;
  value: any;
}

@Component({
  selector: 'app-dropdown'
})
export class DropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Output() optionSelected = new EventEmitter<DropdownOption>();

  selectOption(option: DropdownOption) {
    this.optionSelected.emit(option);
  }
}

// ============================================================
// EXAMPLE 15: Anti-Pattern - DON'T DO THIS
// ============================================================

/**
 * ❌ BAD: Modifying parent data from child
 */

// Bad Child Component
@Component({
  selector: 'app-bad-child'
})
export class BadChildComponent {
  @Input() user: any;

  modifyUser() {
    // DON'T DO THIS - directly modifying parent data
    this.user.name = 'Changed';
  }
}

/**
 * ✅ GOOD: Emit event for parent to handle
 */

// Good Child Component
@Component({
  selector: 'app-good-child'
})
export class GoodChildComponent {
  @Input() user: any;
  @Output() userChanged = new EventEmitter<any>();

  modifyUser() {
    // GOOD - parent decides what to do
    this.userChanged.emit({ ...this.user, name: 'Changed' });
  }
}

// ============================================================
// Summary of Input/Output Patterns
// ============================================================

/**
 * Key Concepts:
 *
 * @Input:
 * - Pass data from parent to child
 * - Use typed interfaces
 * - Provide defaults
 * - Detect changes in ngOnChanges
 *
 * @Output:
 * - Emit events from child to parent
 * - Use EventEmitter
 * - Keep events focused
 * - Emit appropriate data
 *
 * Two-Way Binding [(ngModel)]:
 * - Requires @Input and @Output with specific naming
 * - Property name and propertyChange pattern
 * - Emulate with [property]="value" (event)="value = $event"
 *
 * Best Practices:
 * ✅ Keep inputs and outputs strongly typed
 * ✅ Emit events instead of modifying parent
 * ✅ Validate all inputs
 * ✅ Use descriptive names
 * ✅ Document input/output contracts
 * ✅ Avoid circular dependencies
 */
