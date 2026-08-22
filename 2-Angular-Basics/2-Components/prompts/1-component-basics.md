# Component Basics

**IDE Prompt:** Use this when creating your first Angular components.

---

## 🎯 Task: Understand and Create Basic Components

**When to use:** Starting to build UI with Angular components.

---

## 📋 Checklist

- [ ] Understand component structure
- [ ] Generate first component
- [ ] Understand @Component decorator
- [ ] Create simple component
- [ ] Test component renders

---

## 🚀 Step-by-Step Instructions

### Step 1: Understand Component Structure

A component has 4 parts:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-component',      // ① CSS selector for this component
  template: '<p>Hello World</p>',     // ② Template (HTML)
  styles: ['p { color: blue; }']      // ③ Styles (CSS)
})
export class MyComponent {             // ④ Class with component logic
  title = 'My Component';
}
```

### Step 2: Generate First Component

```bash
ng generate component components/hello-world

# Short form
ng g c components/hello-world
```

**Files created:**
```
src/app/components/hello-world/
├── hello-world.component.ts       (Class & decorator)
├── hello-world.component.html     (Template)
├── hello-world.component.css      (Styles)
└── hello-world.component.spec.ts  (Tests)
```

### Step 3: Examine Generated Component

**File:** `src/app/components/hello-world/hello-world.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent {
  title = 'Hello World Component';
}
```

**Note:** Uses external files instead of inline

### Step 4: Update Component Template

**File:** `src/app/components/hello-world/hello-world.component.html`

```html
<div class="container">
  <h1>{{ title }}</h1>
  <p>Welcome to my first component!</p>
  <button (click)="handleClick()">Click Me</button>
</div>
```

### Step 5: Add Component Logic

**File:** `src/app/components/hello-world/hello-world.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent {
  title = 'Hello World Component';
  clickCount = 0;

  handleClick() {
    this.clickCount++;
    console.log('Clicked', this.clickCount, 'times');
  }
}
```

### Step 6: Add Component Styles

**File:** `src/app/components/hello-world/hello-world.component.css`

```css
.container {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  max-width: 400px;
  margin: 20px auto;
}

h1 {
  color: #333;
  margin-top: 0;
}

button {
  background: #2196f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #1976d2;
}
```

### Step 7: Use Component in App

**File:** `src/app/app.component.html`

```html
<app-hello-world></app-hello-world>
```

**Or declare in app.module.ts if not standalone:**

```typescript
import { HelloWorldComponent } from './components/hello-world/hello-world.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloWorldComponent  // ← Add here
  ]
})
export class AppModule { }
```

### Step 8: Test Component

```bash
ng serve
```

Visit http://localhost:4200

You should see:
- Component title
- Text
- Clickable button
- Console logs when clicked

---

## 🔧 Component File Structure

### Template Options

**Option 1: Inline Template**
```typescript
@Component({
  selector: 'app-my-component',
  template: '<p>Hello</p>'
})
```

**Option 2: External Template File**
```typescript
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html'
})
```

### Styles Options

**Option 1: Inline Styles**
```typescript
@Component({
  styles: ['p { color: blue; }']
})
```

**Option 2: External Style File**
```typescript
@Component({
  styleUrls: ['./my-component.component.css']
})
```

**Option 3: Multiple Style Files**
```typescript
@Component({
  styleUrls: [
    './my-component.component.css',
    './my-component-theme.css'
  ]
})
```

---

## 💡 Component Best Practices

✅ **Naming:**
- Component name: PascalCase (HelloWorldComponent)
- Selector: kebab-case (app-hello-world)
- File name: kebab-case (hello-world.component.ts)

✅ **Structure:**
- Keep components small (single responsibility)
- One component per file
- Descriptive names
- Organized folder structure

✅ **Properties:**
- Initialize properties with default values
- Use TypeScript types
- Keep properties public for template binding

---

## ✅ Verification Checklist

- [ ] Component generated with `ng g c`
- [ ] Component declared in module (or standalone)
- [ ] Template renders (no errors in console)
- [ ] Styles applied correctly
- [ ] Button click works
- [ ] Console logs appear on click

---

## 📚 Common Component Tasks

| Task | How |
|------|-----|
| Create component | `ng g c components/name` |
| Add @Input | Import, add property, use `[property]="value"` |
| Add @Output | Import EventEmitter, emit event with `(eventName)="handler()"` |
| Two-way binding | Add ngModel, use `[(ngModel)]="property"` |
| Lifecycle hook | Import OnInit, implement, add ngOnInit() |
| Style component | Add CSS to `.component.css` file |
| Access element | Use @ViewChild, @ViewChildren |

---

## 🔗 Next Steps

1. Test component works
2. Move to **Prompt #2: Input & Output**

---

**Estimated Time:** 15-20 minutes  
**Difficulty:** Beginner  
**Prerequisites:** CLI & Setup prompts (folder 1)  
**Next:** `2-input-output.md`
