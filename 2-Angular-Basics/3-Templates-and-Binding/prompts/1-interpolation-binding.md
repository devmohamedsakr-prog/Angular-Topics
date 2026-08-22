# Interpolation & Property Binding

**IDE Prompt:** Use this when displaying data and binding to element properties.

---

## 🎯 Task: Master Data Display and Property Binding

**When to use:** Displaying component data in templates and binding to HTML elements.

---

## 📋 Checklist

- [ ] Use interpolation {{ }}
- [ ] Bind to element properties [property]
- [ ] Bind to attributes [attr.name]
- [ ] Bind to classes [class]
- [ ] Bind to styles [style]
- [ ] Test all bindings

---

## 🚀 Step-by-Step Instructions

### Step 1: Interpolation {{ }}

**Component:**
```typescript
@Component({
  selector: 'app-greeting',
  template: '<h1>{{ title }}</h1>'
})
export class GreetingComponent {
  title = 'Hello Angular!';
}
```

**Works with:**
- Properties: `{{ name }}`
- Methods: `{{ getName() }}`
- Expressions: `{{ count + 1 }}`
- Ternary: `{{ isActive ? 'Active' : 'Inactive' }}`
- Pipes: `{{ date | date: 'short' }}`

### Step 2: Property Binding [property]

```html
<!-- Bind image src -->
<img [src]="imageUrl" [alt]="imageName">

<!-- Bind disabled state -->
<button [disabled]="isDisabled">Click</button>

<!-- Bind element properties -->
<input [value]="inputText" [placeholder]="placeholderText">

<!-- Bind aria attributes -->
<div [attr.aria-label]="ariaLabel"></div>
```

**Component:**
```typescript
export class MyComponent {
  imageUrl = 'assets/image.jpg';
  imageName = 'My Image';
  isDisabled = false;
  inputText = 'Enter text';
  placeholderText = 'Type here...';
  ariaLabel = 'Accessible button';
}
```

### Step 3: Class Binding [class]

**Single class:**
```html
<div [class.active]="isActive">Content</div>

<!-- Renders: class="active" when isActive is true -->
```

**Multiple classes:**
```html
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">
  Content
</div>

<!-- Or with array: -->
<div [ngClass]="['class1', 'class2', isActive ? 'active' : '']">
  Content
</div>
```

### Step 4: Style Binding [style]

**Single style:**
```html
<div [style.color]="textColor">Colored text</div>
<div [style.background-color]="bgColor">Background</div>
```

**Multiple styles:**
```html
<div [ngStyle]="{ 'color': textColor, 'background': bgColor, 'font-size': fontSize }">
  Styled text
</div>
```

**Component:**
```typescript
export class StyleComponent {
  textColor = 'red';
  bgColor = 'lightblue';
  fontSize = '18px';
}
```

### Step 5: Pipes - Format Data

**Built-in pipes:**
```html
<!-- Date pipe -->
<p>{{ today | date }}</p>
<p>{{ today | date: 'short' }}</p>
<p>{{ today | date: 'dd/MM/yyyy' }}</p>

<!-- Number pipe -->
<p>{{ price | number: '2.2-2' }}</p>

<!-- Currency pipe -->
<p>{{ price | currency }}</p>
<p>{{ price | currency: 'USD' }}</p>

<!-- Uppercase/Lowercase -->
<p>{{ text | uppercase }}</p>
<p>{{ text | lowercase }}</p>

<!-- Percent pipe -->
<p>{{ 0.25 | percent }}</p>

<!-- JSON pipe (for debugging) -->
<p>{{ object | json }}</p>

<!-- Slice pipe -->
<p>{{ text | slice: 0:5 }}</p>

<!-- Async pipe (unwraps observables) -->
<p>{{ observable$ | async }}</p>
```

**Component:**
```typescript
export class PipeComponent {
  today = new Date();
  price = 1234.56;
  text = 'hello world';
  object = { name: 'John', age: 30 };
}
```

### Step 6: Safe Navigation Operator ?.

```html
<!-- Without safe navigation - error if user is null -->
<p>{{ user.name }}</p>

<!-- With safe navigation - no error -->
<p>{{ user?.name }}</p>

<!-- Nested objects -->
<p>{{ user?.profile?.address?.city }}</p>

<!-- With *ngIf to be safe -->
<p *ngIf="user">{{ user.name }}</p>
```

### Step 7: Template Reference Variables #

```html
<!-- Create reference to input -->
<input #nameInput type="text" placeholder="Enter name">
<button (click)="greet(nameInput.value)">Greet</button>

<!-- Use in template -->
<p>{{ nameInput.value }}</p>

<!-- Reference component -->
<app-counter #counter></app-counter>
<button (click)="resetCounter(counter)">Reset</button>
```

**Component:**
```typescript
export class TemplateRefComponent {
  greet(name: string) {
    console.log('Hello', name);
  }

  resetCounter(counter: CounterComponent) {
    counter.reset();
  }
}
```

### Step 8: Chaining Pipes

```html
<!-- Multiple pipes -->
<p>{{ date | date: 'short' | uppercase }}</p>
<p>{{ price | currency | lowercase }}</p>
<p>{{ text | slice: 0:10 | uppercase }}</p>
```

---

## 💡 Best Practices

✅ Keep expressions simple (move logic to component)  
✅ Use safe navigation (?.) for optional properties  
✅ Use pipes to format data  
✅ Use [property] instead of .property =  
✅ Use [class] and [style] for dynamic styling  
✅ Document complex expressions

---

## ✅ Verification Checklist

- [ ] Interpolation displays data
- [ ] Property binding works
- [ ] Classes apply dynamically
- [ ] Styles apply dynamically
- [ ] Pipes format data correctly
- [ ] Safe navigation works
- [ ] Template references work
- [ ] No console errors

---

## 🔗 Next Steps

1. Test all bindings
2. Move to **Prompt #2: Event Binding**

---

**Estimated Time:** 15-20 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Components folder  
**Next:** `2-event-binding.md`
