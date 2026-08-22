# Structural Directives

**IDE Prompt:** Use this for conditional rendering and looping through data.

---

## 🎯 Task: Control Template Flow with Structural Directives

**When to use:** Showing/hiding elements, looping through arrays, conditional rendering.

---

## 📋 Checklist

- [ ] Use *ngIf for conditionals
- [ ] Use *ngFor for loops
- [ ] Use *ngSwitch for multiple conditions
- [ ] Implement ng-template
- [ ] Use trackBy for performance

---

## 🚀 Step-by-Step Instructions

### Step 1: *ngIf - Conditional Rendering

```typescript
export class ConditionalComponent {
  isVisible = true;
  userRole = 'admin';
}
```

```html
<!-- Show if true -->
<p *ngIf="isVisible">This is visible</p>

<!-- Show if false -->
<p *ngIf="!isVisible">This is hidden</p>

<!-- If/else -->
<div *ngIf="isVisible; else hiddenTemplate">
  <p>Visible content</p>
</div>
<ng-template #hiddenTemplate>
  <p>Hidden content</p>
</ng-template>

<!-- Role-based -->
<button *ngIf="userRole === 'admin'">Admin Panel</button>
```

### Step 2: *ngFor - Loop Through Arrays

```typescript
export class LoopComponent {
  items = ['Apple', 'Banana', 'Orange'];
  users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ];
}
```

```html
<!-- Simple loop -->
<ul>
  <li *ngFor="let item of items">{{ item }}</li>
</ul>

<!-- With index -->
<div *ngFor="let item of items; let i = index">
  Item {{ i }}: {{ item }}
</div>

<!-- With first/last -->
<div *ngFor="let item of items; let first = first; let last = last">
  <span *ngIf="first">FIRST: </span>
  {{ item }}
  <span *ngIf="last"> :LAST</span>
</div>

<!-- Objects in loop -->
<div *ngFor="let user of users">
  <h3>{{ user.name }}</h3>
  <p>ID: {{ user.id }}</p>
</div>
```

### Step 3: trackBy for Performance

```typescript
export class TrackByComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ];

  trackByFn(index: number, item: any) {
    return item.id;  // Return unique identifier
  }

  addItem() {
    this.items.unshift({ id: 0, name: 'New Item' });
  }
}
```

```html
<!-- Without trackBy - recreates all elements -->
<div *ngFor="let item of items">{{ item.name }}</div>

<!-- With trackBy - only updates changed items -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

### Step 4: *ngSwitch - Multiple Conditions

```typescript
export class SwitchComponent {
  status = 'pending';  // pending, active, completed
}
```

```html
<div [ngSwitch]="status">
  <div *ngSwitchCase="'pending'">
    <p>Task is pending</p>
    <button>Start</button>
  </div>

  <div *ngSwitchCase="'active'">
    <p>Task is active</p>
    <button>Complete</button>
  </div>

  <div *ngSwitchCase="'completed'">
    <p>Task completed!</p>
  </div>

  <div *ngSwitchDefault>
    <p>Unknown status</p>
  </div>
</div>
```

### Step 5: ng-template - Hidden Template

```html
<!-- ng-template not rendered directly -->
<ng-template #loadingTemplate>
  <p>Loading...</p>
</ng-template>

<!-- Use with *ngIf -->
<div *ngIf="isLoading; then loadingTemplate; else contentTemplate">
</div>

<ng-template #contentTemplate>
  <p>Content loaded</p>
</ng-template>
```

### Step 6: Complex Conditional

```html
<!-- Nested conditions -->
<div *ngIf="isLoggedIn">
  <p *ngIf="isPremium">
    Welcome Premium User!
  </p>
  <p *ngIf="!isPremium">
    Upgrade to premium
  </p>
</div>

<!-- With else -->
<div *ngIf="isLoggedIn; else loginForm">
  Dashboard
</div>

<ng-template #loginForm>
  <form>Login here</form>
</ng-template>

<!-- Combination with loops -->
<div *ngIf="users.length > 0; else noUsers">
  <div *ngFor="let user of users">
    {{ user.name }}
  </div>
</div>

<ng-template #noUsers>
  <p>No users found</p>
</ng-template>
```

---

## 💡 Best Practices

✅ Use *ngIf for simple conditions  
✅ Use *ngSwitch for multiple cases  
✅ Always use trackBy in *ngFor  
✅ Check array length before looping  
✅ Use ng-template for complex conditionals  
✅ Keep logic simple, move complexity to component  

---

## ✅ Verification Checklist

- [ ] *ngIf shows/hides correctly
- [ ] *ngFor loops through arrays
- [ ] trackBy improves performance
- [ ] *ngSwitch handles multiple cases
- [ ] ng-template renders with *ngIf
- [ ] Complex conditions work
- [ ] No console errors

---

## 🔗 Next Steps

1. Test all directives
2. Move to **Prompt #4: Custom Directives**

---

**Estimated Time:** 20-25 minutes  
**Difficulty:** Beginner-Intermediate  
**Prerequisites:** Prompts #1-2  
**Next:** `4-custom-directives.md`
