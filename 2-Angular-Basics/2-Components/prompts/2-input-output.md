# Component Input & Output

**IDE Prompt:** Use this when building parent-child component communication.

---

## 🎯 Task: Implement @Input and @Output for Component Communication

**When to use:** Making components reusable and passing data between parent and child.

---

## 📋 Checklist

- [ ] Create child component with @Input
- [ ] Pass data from parent via [property]
- [ ] Create component with @Output
- [ ] Emit events from child to parent
- [ ] Test parent-child communication

---

## 🚀 Step-by-Step Instructions

### Step 1: Create Child Component

```bash
ng generate component components/button-component
```

### Step 2: Add @Input Property

**File:** `src/app/components/button-component/button-component.component.ts`

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-component',
  template: `<button class="btn">{{ label }}</button>`,
  styles: [`
    .btn {
      padding: 10px 20px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ButtonComponentComponent {
  @Input() label: string = 'Click Me';  // ← @Input property
}
```

### Step 3: Use @Input in Parent

**File:** `src/app/app.component.html`

```html
<app-button-component [label]="'Send'"></app-button-component>
<app-button-component [label]="'Save'"></app-button-component>
<app-button-component [label]="'Delete'"></app-button-component>
```

Or with properties:

```typescript
export class AppComponent {
  buttonLabel = 'Submit';
}
```

```html
<app-button-component [label]="buttonLabel"></app-button-component>
```

### Step 4: Add @Output Event

**File:** `src/app/components/button-component/button-component.component.ts`

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-component',
  template: `<button class="btn" (click)="onClick()">{{ label }}</button>`,
  styles: [`
    .btn {
      padding: 10px 20px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn:hover {
      background: #1976d2;
    }
  `]
})
export class ButtonComponentComponent {
  @Input() label: string = 'Click Me';
  @Output() buttonClick = new EventEmitter<void>();  // ← @Output event

  onClick() {
    this.buttonClick.emit();  // ← Emit event to parent
  }
}
```

### Step 5: Handle @Output in Parent

**File:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  clickCount = 0;

  onButtonClick() {
    this.clickCount++;
    console.log('Button clicked', this.clickCount, 'times');
  }
}
```

**File:** `src/app/app.component.html`

```html
<div>
  <p>Button clicked: {{ clickCount }} times</p>
  <app-button-component
    [label]="'Click Me'"
    (buttonClick)="onButtonClick()">
  </app-button-component>
</div>
```

### Step 6: Two-Way Binding Example

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div class="counter">
      <button (click)="decrement()">-</button>
      <span>{{ value }}</span>
      <button (click)="increment()">+</button>
    </div>
  `,
  styles: [`
    .counter {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  `]
})
export class CounterComponent {
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();

  increment() {
    this.value++;
    this.valueChange.emit(this.value);
  }

  decrement() {
    this.value--;
    this.valueChange.emit(this.value);
  }
}
```

**Usage with two-way binding:**

```html
<!-- Manual way -->
<app-counter [value]="count" (valueChange)="count = $event"></app-counter>

<!-- Two-way binding shorthand -->
<app-counter [(value)]="count"></app-counter>
```

### Step 7: Pass Objects via @Input

```typescript
interface Card {
  title: string;
  content: string;
}

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <h3>{{ card.title }}</h3>
      <p>{{ card.content }}</p>
    </div>
  `
})
export class CardComponent {
  @Input() card!: Card;  // ← Accept object
}
```

**Parent usage:**

```typescript
export class AppComponent {
  myCard: Card = {
    title: 'Card Title',
    content: 'Card content'
  };
}
```

```html
<app-card [card]="myCard"></app-card>
```

### Step 8: Test Input & Output

```bash
ng serve
```

Verify:
- Child component receives @Input data
- Parent receives @Output events
- Two-way binding works
- No console errors

---

## 💡 Best Practices

✅ **@Input:**
- Provide default values
- Use TypeScript types
- Document with comments
- Use @Input() setter for complex logic

✅ **@Output:**
- Name with standard format: `eventName + Change` for two-way binding
- Emit specific event objects, not just void
- Document what data is emitted

✅ **Communication:**
- Keep component logic separate
- Parent controls data flow
- Child doesn't modify parent data directly
- Use OnChanges to react to input changes

---

## ✅ Verification Checklist

- [ ] Child component created
- [ ] @Input property works
- [ ] Parent passes data via [property]
- [ ] @Output event defined
- [ ] Child emits event
- [ ] Parent handles event
- [ ] Two-way binding works (if implemented)
- [ ] No console errors

---

## 🔗 Next Steps

1. Test parent-child communication
2. Move to **Prompt #3: Lifecycle Hooks**

---

**Estimated Time:** 20-25 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Prompt #1 (component basics)  
**Next:** `3-lifecycle-hooks.md`
