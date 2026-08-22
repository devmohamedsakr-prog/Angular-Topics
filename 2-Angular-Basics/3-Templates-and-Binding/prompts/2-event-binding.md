# Event Binding & Two-Way Binding

**IDE Prompt:** Use this for handling user interactions and two-way data binding.

---

## 🎯 Task: Handle Events and Implement Two-Way Binding

**When to use:** Responding to user clicks, form inputs, and keeping data synchronized.

---

## 📋 Checklist

- [ ] Bind to click events (click)
- [ ] Handle other events (input, submit, change)
- [ ] Pass event object ($event)
- [ ] Implement two-way binding [(ngModel)]
- [ ] Use ngSubmit for forms

---

## 🚀 Step-by-Step Instructions

### Step 1: Click Event Binding (click)

```typescript
export class ClickComponent {
  count = 0;
  
  onClick() {
    this.count++;
    console.log('Clicked!');
  }
}
```

```html
<button (click)="onClick()">Click Me</button>
<p>Clicks: {{ count }}</p>
```

### Step 2: Passing Arguments

```html
<!-- Pass value -->
<button (click)="onClick('Hello')">Say Hello</button>

<!-- Pass event -->
<input (input)="onInput($event)">

<!-- Pass reference -->
<input #myInput (click)="onClick(myInput.value)">
```

```typescript
export class EventComponent {
  onClick(text: string) {
    console.log('Text:', text);
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log('Input:', value);
  }
}
```

### Step 3: Common Events

```html
<!-- Click -->
<button (click)="handleClick()">Click</button>

<!-- Input/Change -->
<input (input)="handleInput($event)">
<input (change)="handleChange($event)">

<!-- Submit -->
<form (ngSubmit)="handleSubmit()">
  <input type="text">
  <button type="submit">Submit</button>
</form>

<!-- Hover -->
<div (mouseenter)="handleHover(true)" (mouseleave)="handleHover(false)">
  Hover me
</div>

<!-- Keyboard -->
<input (keyup)="handleKeyUp($event)">
<input (keyup.enter)="handleEnter()">
<input (keydown.space)="handleSpace()">

<!-- Focus -->
<input (focus)="handleFocus()" (blur)="handleBlur()">
```

### Step 4: Two-Way Binding [(ngModel)]

**First, import FormsModule:**

```typescript
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule]
})
export class AppModule {}
```

**Component:**
```typescript
export class TwoWayComponent {
  name = '';
  email = '';
}
```

**Template:**
```html
<!-- Two-way binding -->
<input [(ngModel)]="name" placeholder="Enter name">
<p>Name: {{ name }}</p>

<input [(ngModel)]="email" type="email">
<p>Email: {{ email }}</p>
```

**How it works:**
```html
<!-- This: -->
<input [(ngModel)]="name">

<!-- Is equivalent to: -->
<input [ngModel]="name" (ngModelChange)="name = $event">
```

### Step 5: Form Submission

```typescript
export class FormComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };

  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Send to server
  }
}
```

```html
<form (ngSubmit)="onSubmit()">
  <div>
    <label>Name:</label>
    <input [(ngModel)]="formData.name" name="name" required>
  </div>

  <div>
    <label>Email:</label>
    <input [(ngModel)]="formData.email" name="email" type="email" required>
  </div>

  <div>
    <label>Message:</label>
    <textarea [(ngModel)]="formData.message" name="message"></textarea>
  </div>

  <button type="submit">Send</button>
</form>
```

### Step 6: Keyboard Events

```html
<!-- Specific key -->
<input (keyup.enter)="search()">
<input (keyup.escape)="cancel()">
<input (keyup.space)="space()">

<!-- Or get all keys -->
<input (keyup)="onKeyUp($event)">
```

```typescript
export class KeyboardComponent {
  search() { console.log('Search'); }
  cancel() { console.log('Cancel'); }
  space() { console.log('Space'); }

  onKeyUp(event: KeyboardEvent) {
    console.log('Key pressed:', event.key);
  }
}
```

### Step 7: Event Object

```html
<input (input)="handleInput($event)">
<button (click)="handleClick($event)">Click</button>
<form (submit)="handleSubmit($event)">
```

```typescript
export class EventObjectComponent {
  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    console.log('Value:', value);
  }

  handleClick(event: MouseEvent) {
    console.log('X:', event.clientX, 'Y:', event.clientY);
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    console.log('Form submitted');
  }
}
```

---

## 💡 Best Practices

✅ Use (ngSubmit) instead of (click) on submit button  
✅ Use template reference for input values  
✅ Prevent default with $event.preventDefault()  
✅ Import FormsModule for [(ngModel)]  
✅ Name attributes required for ngModel in forms  
✅ Use type hints for event objects  

---

## ✅ Verification Checklist

- [ ] Click events work
- [ ] Form submission works
- [ ] Two-way binding syncs data
- [ ] Keyboard events captured
- [ ] Event object accessible
- [ ] No console errors

---

## 🔗 Next Steps

1. Test all events
2. Move to **Prompt #3: Structural Directives**

---

**Estimated Time:** 20-25 minutes  
**Difficulty:** Beginner-Intermediate  
**Prerequisites:** Prompt #1  
**Next:** `3-structural-directives.md`
