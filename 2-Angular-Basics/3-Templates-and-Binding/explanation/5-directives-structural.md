# Directives & Structural Control

## Overview

Directives are markers on DOM elements that tell Angular to do something to that element or its children. Structural directives modify the DOM structure itself by adding or removing elements.

## Built-in Structural Directives

### *ngIf - Conditional Rendering

The `*ngIf` directive removes or recreates elements based on a condition.

```typescript
export class ConditionalComponent {
  isVisible = true;
  isLoggedIn = false;
  user = null;
}
```

```html
<!-- Basic *ngIf -->
<div *ngIf="isVisible">This is visible</div>

<!-- With else -->
<div *ngIf="isLoggedIn; else notLoggedIn">
  Welcome back!
</div>
<ng-template #notLoggedIn>
  <p>Please log in</p>
</ng-template>

<!-- Multiple conditions -->
<div *ngIf="user; then userTemplate; else guestTemplate"></div>
<ng-template #userTemplate>
  <h1>Welcome {{ user.name }}</h1>
</ng-template>
<ng-template #guestTemplate>
  <h1>Welcome Guest</h1>
</ng-template>

<!-- Nested ngIf -->
<div *ngIf="isLoggedIn">
  <div *ngIf="hasPermission">
    <button>Admin Panel</button>
  </div>
</div>
```

### *ngFor - List Rendering

The `*ngFor` directive repeats elements for each item in a collection.

#### Basic Loop

```typescript
export class ListComponent {
  items = ['Apple', 'Banana', 'Cherry'];
  numbers = [1, 2, 3, 4, 5];
  users = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 }
  ];
}
```

```html
<!-- Simple loop -->
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
<div *ngFor="let item of items; let isEven = even; let isOdd = odd"
     [class.even]="isEven" [class.odd]="isOdd">
  {{ item }}
</div>

<!-- With first/last -->
<div *ngFor="let item of items; let first = first; let last = last">
  <div *ngIf="first" class="separator">--- Start ---</div>
  {{ item }}
  <div *ngIf="last" class="separator">--- End ---</div>
</div>

<!-- Nested loops -->
<div *ngFor="let category of categories">
  <h3>{{ category.name }}</h3>
  <ul>
    <li *ngFor="let item of category.items">
      {{ item }}
    </li>
  </ul>
</div>
```

#### Loop Context Variables

```html
<!-- All available variables -->
<div *ngFor="let item of items; 
             let i = index;
             let even = even;
             let odd = odd;
             let first = first;
             let last = last;
             let count = count">
  
  Index: {{ i }} (of {{ count }})
  Even: {{ even }}, Odd: {{ odd }}
  First: {{ first }}, Last: {{ last }}
</div>
```

#### TrackBy for Performance

```typescript
export class OptimizedListComponent {
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  // TrackBy function - identity function
  trackByFn(index: number, item: any): number {
    return item.id;
  }

  // By index (not recommended for dynamic lists)
  trackByIndex(index: number, item: any): number {
    return index;
  }

  // By complex logic
  trackByCustom(index: number, item: any): string {
    return `${item.id}-${item.name}`;
  }
}
```

```html
<!-- With trackBy - BEST for performance -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

<!-- Without trackBy - DOM recreated on every change -->
<div *ngFor="let item of items">
  {{ item.name }}
</div>
```

### *ngSwitch - Multi-Way Branching

The `*ngSwitch` directive selects one of several alternative views.

```typescript
export class SwitchComponent {
  status = 'active'; // 'active', 'inactive', 'pending'
  theme = 'light';
}
```

```html
<!-- ngSwitch structure -->
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

<!-- Multiple cases with same template -->
<div [ngSwitch]="theme">
  <div *ngSwitchCase="'light'">Light theme active</div>
  <div *ngSwitchCase="'auto'">Auto theme</div>
  <div *ngSwitchDefault>Dark theme active</div>
</div>

<!-- Nested switch -->
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">
    <div [ngSwitch]="priority">
      <div *ngSwitchCase="1">High priority</div>
      <div *ngSwitchCase="2">Medium priority</div>
      <div *ngSwitchDefault>Low priority</div>
    </div>
  </div>
</div>
```

## Attribute Directives

These modify element behavior without changing DOM structure.

### ngClass - Dynamic Classes

```typescript
export class ClassComponent {
  isActive = true;
  isSelected = false;
  size = 'medium';
}
```

```html
<!-- Single class -->
<div [class.active]="isActive">Active</div>

<!-- Multiple classes with object -->
<div [ngClass]="{ active: isActive, selected: isSelected, 'size-medium': size === 'medium' }">
  Content
</div>

<!-- Array of classes -->
<div [ngClass]="['btn', 'btn-primary', isDisabled ? 'disabled' : 'enabled']">
  Button
</div>

<!-- Computed class object -->
<div [ngClass]="getClassObject()">
  Dynamic Classes
</div>
```

```typescript
getClassObject() {
  return {
    active: this.isActive,
    selected: this.isSelected,
    disabled: this.isDisabled
  };
}
```

### ngStyle - Dynamic Styles

```typescript
export class StyleComponent {
  backgroundColor = '#f0f0f0';
  fontSize = '16px';
  opacity = 0.8;
}
```

```html
<!-- Single style -->
<div [style.color]="'red'">Red text</div>

<!-- With units -->
<div [style.width.px]="200">200px wide</div>
<div [style.padding.em]="2">2em padding</div>

<!-- Multiple styles with object -->
<div [ngStyle]="{ 
  'background-color': backgroundColor,
  'font-size': fontSize,
  'opacity': opacity
}">
  Styled div
</div>

<!-- Computed style object -->
<div [ngStyle]="getStyleObject()">
  Dynamic Styles
</div>
```

```typescript
getStyleObject() {
  return {
    'background-color': this.backgroundColor,
    'font-size': this.fontSize + 'px',
    'opacity': this.opacity
  };
}
```

### ngModel - Two-Way Binding

Already covered in detail in the Two-Way Binding section.

```html
<input [(ngModel)]="username" />
<p>{{ username }}</p>
```

## Custom Structural Directives

Create reusable structural directives for custom logic.

### Basic Custom Directive

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

### Using Custom Directive

```html
<!-- Show unless condition is true (opposite of *ngIf) -->
<div *appUnless="isHidden">
  This shows when isHidden is false
</div>
```

## Combining Directives

### ngIf with ngFor

```html
<!-- Show list only if items exist -->
<div *ngIf="items && items.length > 0">
  <ul>
    <li *ngFor="let item of items">
      {{ item.name }}
    </li>
  </ul>
</div>

<!-- Show message if no items -->
<div *ngIf="!items || items.length === 0">
  No items found
</div>
```

### ngSwitch with ngFor

```html
<div [ngSwitch]="viewMode">
  <div *ngSwitchCase="'list'">
    <ul>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
  </div>
  
  <div *ngSwitchCase="'grid'">
    <div class="grid">
      <div class="grid-item" *ngFor="let item of items">
        {{ item }}
      </div>
    </div>
  </div>
</div>
```

## ng-template and ng-container

### ng-template

Template elements not rendered by default:

```html
<!-- ng-template - not rendered -->
<ng-template #successTemplate>
  <p>Operation successful!</p>
</ng-template>

<!-- Reference from directive or code -->
<div *ngIf="success; then successTemplate"></div>
```

### ng-container

Logical grouping without rendering a DOM element:

```html
<!-- Without ng-container - extra div -->
<div>
  <div *ngFor="let item of items">
    <span>{{ item }}</span>
  </div>
</div>

<!-- With ng-container - no extra element -->
<ng-container *ngFor="let item of items">
  <span>{{ item }}</span>
</ng-container>

<!-- Combine multiple directives -->
<ng-container *ngIf="condition">
  <span *ngFor="let item of items">
    {{ item }}
  </span>
</ng-container>
```

## Best Practices

✅ **Use trackBy with *ngFor for performance**
```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item }}
</div>
```

✅ **Use ng-container to avoid extra elements**
```html
<ng-container *ngFor="let item of items">
  <span>{{ item }}</span>
</ng-container>
```

✅ **Prefer *ngIf over hidden display**
```html
<!-- Good - element not in DOM -->
<div *ngIf="show">Content</div>

<!-- Avoid - element in DOM but hidden -->
<div [hidden]="!show">Content</div>
```

✅ **Keep directives simple**
```html
<!-- Good - simple condition -->
<div *ngIf="isActive">Active</div>

<!-- Avoid - complex logic -->
<div *ngIf="user && user.permissions && user.permissions.includes('admin')">
  Admin
</div>
```

## Key Takeaways

- **\*ngIf** - Conditional rendering (add/remove from DOM)
- **\*ngFor** - List iteration with trackBy for performance
- **\*ngSwitch** - Multi-way branching
- **[ngClass]** - Dynamic CSS classes
- **[ngStyle]** - Dynamic inline styles
- **ng-template** - Template definitions
- **ng-container** - Logical grouping without DOM
- Custom directives enable reusable behavior patterns
- Always use trackBy with large lists
- Prefer *ngIf over [hidden] for better performance
