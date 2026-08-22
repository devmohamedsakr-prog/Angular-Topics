/**
 * Event Binding Examples
 * Click, keyboard, mouse, form events
 */

import { Component } from '@angular/core';

// ============================================================
// EXAMPLE 1: Click Events
// ============================================================

@Component({
  selector: 'app-click-events',
  template: `
    <div>
      <button (click)="onClick()">Click me</button>
      <p>Clicked {{ clickCount }} times</p>
      
      <button (click)="count = count + 1">Increment inline</button>
      <p>Count: {{ count }}</p>
    </div>
  `
})
export class ClickEventsComponent {
  clickCount = 0;
  count = 0;

  onClick() {
    this.clickCount++;
  }
}

// ============================================================
// EXAMPLE 2: Keyboard Events
// ============================================================

@Component({
  selector: 'app-keyboard-events',
  template: `
    <div>
      <input (keyup)="onKeyUp($event)" placeholder="Press any key" />
      <p>Last key: {{ lastKey }}</p>
      
      <input (keyup.enter)="onEnter($event)" placeholder="Press Enter" />
      <input (keydown.escape)="onEscape()" placeholder="Press Escape" />
      <input (keyup.control.s)="save()" placeholder="Ctrl+S" />
    </div>
  `
})
export class KeyboardEventsComponent {
  lastKey = '';

  onKeyUp(event: KeyboardEvent) {
    this.lastKey = event.key;
  }

  onEnter(event: KeyboardEvent) {
    console.log('Enter pressed');
  }

  onEscape() {
    console.log('Escape pressed');
  }

  save() {
    console.log('Ctrl+S pressed');
  }
}

// ============================================================
// EXAMPLE 3: Mouse Events
// ============================================================

@Component({
  selector: 'app-mouse-events',
  template: `
    <div
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (mousemove)="onMouseMove($event)"
      style="border: 1px solid #ccc; padding: 20px;">
      
      <p>Mouse over this area</p>
      <p *ngIf="mouseOver">Mouse is over the element</p>
      <p>Position: {{ mouseX }}, {{ mouseY }}</p>
      
      <button (click)="onClick()" (dblclick)="onDoubleClick()">
        Click or Double-click
      </button>
    </div>
  `
})
export class MouseEventsComponent {
  mouseOver = false;
  mouseX = 0;
  mouseY = 0;

  onMouseEnter() {
    this.mouseOver = true;
  }

  onMouseLeave() {
    this.mouseOver = false;
  }

  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  onClick() {
    console.log('Clicked');
  }

  onDoubleClick() {
    console.log('Double-clicked');
  }
}

// ============================================================
// EXAMPLE 4: Focus and Blur Events
// ============================================================

@Component({
  selector: 'app-focus-blur-events',
  template: `
    <div>
      <input
        (focus)="onFocus('name')"
        (blur)="onBlur()"
        placeholder="Name" />
      
      <input
        (focus)="onFocus('email')"
        (blur)="onBlur()"
        placeholder="Email" />
      
      <p *ngIf="focused">Currently focused: {{ focusedField }}</p>
    </div>
  `
})
export class FocusBlurEventsComponent {
  focused = false;
  focusedField = '';

  onFocus(fieldName: string) {
    this.focused = true;
    this.focusedField = fieldName;
  }

  onBlur() {
    this.focused = false;
  }
}

// ============================================================
// EXAMPLE 5: Form Events
// ============================================================

@Component({
  selector: 'app-form-events',
  template: `
    <form (submit)="onSubmit($event)" (reset)="onReset()">
      <input
        name="email"
        (change)="onChange($event)"
        placeholder="Email" />
      
      <input name="password" type="password" placeholder="Password" />
      
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    
    <p>Form submitted: {{ submitted }}</p>
    <p>Changed field: {{ changedField }}</p>
  `
})
export class FormEventsComponent {
  submitted = false;
  changedField = '';

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted = true;
    console.log('Form submitted');
  }

  onReset() {
    this.submitted = false;
    this.changedField = '';
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.changedField = input.name;
  }
}

// ============================================================
// EXAMPLE 6: Event Object ($event)
// ============================================================

@Component({
  selector: 'app-event-object',
  template: `
    <div>
      <input (input)="onInput($event)" placeholder="Type something" />
      <p>Input value: {{ inputValue }}</p>
      
      <button (click)="onClick($event)">Click and check console</button>
      
      <textarea (input)="onTextChange($event)" placeholder="Type text"></textarea>
      <p>Textarea: {{ textValue }}</p>
    </div>
  `
})
export class EventObjectComponent {
  inputValue = '';
  textValue = '';

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.inputValue = input.value;
  }

  onClick(event: MouseEvent) {
    console.log('X:', event.clientX);
    console.log('Y:', event.clientY);
    console.log('Button:', event.button);
  }

  onTextChange(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.textValue = textarea.value;
  }
}

// ============================================================
// EXAMPLE 7: Event Modifiers
// ============================================================

@Component({
  selector: 'app-event-modifiers',
  template: `
    <div>
      <!-- Stop propagation -->
      <div (click)="onDivClick()" style="border: 1px solid blue; padding: 20px;">
        Outer div
        <button (click.stop)="onButtonClick()">
          Button (stop propagation)
        </button>
      </div>
      
      <!-- Prevent default -->
      <a (click.prevent)="handleLink($event)" href="https://example.com">
        Link with prevented default
      </a>
      
      <!-- Self only -->
      <div (click.self)="onSelfClick()" style="border: 1px solid red; padding: 20px;">
        Click only on me, not children
        <button>Button inside</button>
      </div>
    </div>
  `
})
export class EventModifiersComponent {
  onDivClick() {
    console.log('Div clicked');
  }

  onButtonClick() {
    console.log('Button clicked (propagation stopped)');
  }

  handleLink(event: MouseEvent) {
    console.log('Link clicked (default prevented)');
  }

  onSelfClick() {
    console.log('Self clicked');
  }
}

// ============================================================
// EXAMPLE 8: Passing Arguments to Handlers
// ============================================================

@Component({
  selector: 'app-event-arguments',
  template: `
    <div>
      <button *ngFor="let item of items; let i = index"
              (click)="selectItem(item, i)">
        {{ item.name }}
      </button>
      
      <p>Selected: {{ selectedItem?.name }} at index {{ selectedIndex }}</p>
      
      <button (click)="deleteItem(5)">Delete Item 5</button>
    </div>
  `
})
export class EventArgumentsComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
  selectedItem: any = null;
  selectedIndex = -1;

  selectItem(item: any, index: number) {
    this.selectedItem = item;
    this.selectedIndex = index;
  }

  deleteItem(id: number) {
    console.log('Deleting item:', id);
  }
}

// ============================================================
// EXAMPLE 9: Conditional Event Handlers
// ============================================================

@Component({
  selector: 'app-conditional-events',
  template: `
    <div>
      <input type="text" [(ngModel)]="username" placeholder="Username" />
      
      <button
        [disabled]="!isValid"
        (click)="submit()"
        [class.disabled]="!isValid">
        {{ isValid ? 'Submit' : 'Invalid' }}
      </button>
      
      <button *ngIf="canDelete" (click)="delete()">Delete</button>
    </div>
  `
})
export class ConditionalEventsComponent {
  username = '';
  canDelete = false;

  get isValid() {
    return this.username.length > 3;
  }

  submit() {
    if (this.isValid) {
      console.log('Submitting:', this.username);
    }
  }

  delete() {
    console.log('Deleting');
  }
}

// ============================================================
// EXAMPLE 10: Multiple Event Handlers
// ============================================================

@Component({
  selector: 'app-multiple-handlers',
  template: `
    <input
      (keyup)="onKeyUp($event)"
      (keydown)="onKeyDown($event)"
      (focus)="onFocus()"
      (blur)="onBlur()"
      (input)="onInput($event)"
      placeholder="Multi-event input" />
    
    <p>Events fired: {{ eventCount }}</p>
  `
})
export class MultipleHandlersComponent {
  eventCount = 0;

  onKeyUp(event: KeyboardEvent) {
    this.eventCount++;
  }

  onKeyDown(event: KeyboardEvent) {
    this.eventCount++;
  }

  onFocus() {
    this.eventCount++;
  }

  onBlur() {
    this.eventCount++;
  }

  onInput(event: Event) {
    this.eventCount++;
  }
}

// ============================================================
// EXAMPLE 11: Dynamic Event Binding
// ============================================================

@Component({
  selector: 'app-dynamic-events',
  template: `
    <div>
      <button *ngIf="mode === 'save'" (click)="save()">Save</button>
      <button *ngIf="mode === 'delete'" (click)="delete()">Delete</button>
      <button *ngIf="mode === 'edit'" (click)="edit()">Edit</button>
    </div>
  `
})
export class DynamicEventsComponent {
  mode = 'save';

  save() {
    console.log('Saving');
  }

  delete() {
    console.log('Deleting');
  }

  edit() {
    console.log('Editing');
  }
}

// ============================================================
// Summary: Event Binding Best Practices
// ============================================================

/**
 * ✅ DO:
 * - Use (event)="handler()" syntax
 * - Keep handlers in component class
 * - Use key modifiers for specific keys
 * - Use event modifiers for propagation
 * - Pass $event when needed
 * - Type events properly
 *
 * ❌ DON'T:
 * - Put complex logic in templates
 * - Forget to prevent defaults
 * - Use inline complex logic
 * - Call expensive functions
 * - Forget to handle errors
 */
