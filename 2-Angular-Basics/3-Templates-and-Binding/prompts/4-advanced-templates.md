# Advanced Template Techniques

**IDE Prompt:** Use this for complex template patterns and optimization.

---

## 🎯 Task: Master Advanced Template Patterns

**When to use:** Building complex templates, content projection, and optimization.

---

## 📋 Checklist

- [ ] Use ng-content for projection
- [ ] Implement multi-slot projection
- [ ] Use ng-container
- [ ] Implement complex conditions
- [ ] Use template variables

---

## 🚀 Step-by-Step Instructions

### Step 1: Content Projection with ng-content

```typescript
// Card component - wrapper
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <div class="header">
        <ng-content select="[cardHeader]"></ng-content>
      </div>
      <div class="body">
        <ng-content></ng-content>
      </div>
      <div class="footer">
        <ng-content select="[cardFooter]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {}
```

**Usage:**
```html
<app-card>
  <div cardHeader>
    <h2>Card Title</h2>
  </div>

  <p>Card body content</p>

  <div cardFooter>
    <button>Action</button>
  </div>
</app-card>
```

### Step 2: ng-container - No Extra Elements

```html
<!-- Problem: Extra div -->
<div *ngIf="isAdmin">
  <div>Extra wrapper</div>
</div>

<!-- Solution: ng-container -->
<ng-container *ngIf="isAdmin">
  <div>No extra wrapper</div>
</ng-container>

<!-- Useful for loops -->
<ng-container *ngFor="let item of items">
  <div>{{ item }}</div>
</ng-container>
```

### Step 3: Template Variables & Context

```html
<!-- Local template variable -->
<input #myInput type="text">
<button (click)="search(myInput.value)">Search</button>

<!-- Reference component -->
<app-counter #counter></app-counter>
<button (click)="counter.reset()">Reset</button>

<!-- Form context -->
<form #myForm="ngForm">
  <input name="email" [(ngModel)]="email">
  <button [disabled]="myForm.invalid">Submit</button>
</form>
```

### Step 4: Complex Conditionals

```html
<!-- Multiple conditions -->
<div *ngIf="isLoggedIn && hasPermission && !isLoading">
  <p>Access granted</p>
</div>

<!-- Negation -->
<div *ngIf="!(isLoading)">
  <p>Content loaded</p>
</div>

<!-- Or conditions -->
<div *ngIf="isAdmin || isModerator">
  <button>Manage</button>
</div>

<!-- Nested conditions -->
<div *ngIf="isOpen">
  <div *ngIf="showDetails">
    <p>Detailed info</p>
  </div>
</div>
```

### Step 5: Functional Template Patterns

```typescript
export class FunctionalComponent {
  items = [1, 2, 3, 4, 5];

  // For use in template
  getDoubled = (x: number) => x * 2;
  isEven = (x: number) => x % 2 === 0;
}
```

```html
<!-- Filter in template -->
<div *ngFor="let item of items">
  <p *ngIf="isEven(item)">{{ item }} is even</p>
</div>

<!-- Transform in template -->
<div *ngFor="let item of items">
  <p>{{ getDoubled(item) }}</p>
</div>
```

### Step 6: Safe Navigation with Nullish Coalescing

```html
<!-- Safe navigation -->
<p>{{ user?.name }}</p>

<!-- Nullish coalescing (use default) -->
<p>{{ user?.name ?? 'No name' }}</p>

<!-- Nested -->
<p>{{ user?.profile?.address?.city ?? 'No city' }}</p>
```

### Step 7: Template with Let Context

```html
<!-- Create local variable -->
<ng-container *ngLet="(items | filter: query) as filtered">
  <p *ngIf="filtered.length > 0">
    Found {{ filtered.length }} items
  </p>

  <div *ngFor="let item of filtered">
    {{ item }}
  </div>
</ng-container>
```

### Step 8: Dynamic Component with Context

```html
<!-- Async pipe unwraps observable -->
<div *ngIf="user$ | async as user">
  <h1>{{ user.name }}</h1>
  <p>{{ user.email }}</p>
</div>

<!-- Multiple observables -->
<div *ngIf="(user$ | async) as user">
  <div *ngIf="(posts$ | async) as posts">
    <h1>{{ user.name }}</h1>
    <p>{{ posts.length }} posts</p>
  </div>
</div>
```

---

## 💡 Best Practices

✅ Use ng-container to avoid extra DOM elements  
✅ Use ng-content for component composition  
✅ Use async pipe for observables  
✅ Keep template logic minimal  
✅ Use safe navigation (?.)  
✅ Document complex templates  

---

## ✅ Verification Checklist

- [ ] Content projection works
- [ ] ng-container reduces DOM bloat
- [ ] Template variables accessible
- [ ] Complex conditions work
- [ ] Async pipe unwraps observables
- [ ] Safe navigation handles nulls
- [ ] No extra DOM elements

---

## 🔗 You've Completed Templates & Binding!

Next explore:
- Directives (4-Directives/prompts/)
- Internationalization (5-Internationalization/prompts/)

---

**Estimated Time:** 20-25 minutes  
**Difficulty:** Intermediate-Advanced  
**Prerequisites:** Prompts #1-3  
**Result:** Advanced template mastery
