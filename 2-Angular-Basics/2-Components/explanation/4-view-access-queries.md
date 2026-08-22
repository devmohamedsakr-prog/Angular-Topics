# View Access & Queries

## @ViewChild Decorator

Access single child component or DOM element.

### Accessing DOM Elements

```typescript
@Component({
  selector: 'app-form',
  template: `
    <input #searchInput />
    <button (click)="focusInput()">Focus</button>
  `
})
export class FormComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
    this.searchInput.nativeElement.value = 'Initial value';
  }

  focusInput() {
    this.searchInput.nativeElement.focus();
  }
}
```

### Accessing Child Components

```typescript
// Child Component
@Component({
  selector: 'app-counter'
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  getCount(): number {
    return this.count;
  }
}

// Parent Component
@Component({
  selector: 'app-app',
  template: `
    <app-counter #counter></app-counter>
    <button (click)="callChildMethod()">Increment from Parent</button>
  `
})
export class AppComponent implements AfterViewInit {
  @ViewChild('counter') counterComponent: CounterComponent;

  ngAfterViewInit() {
    console.log('Counter:', this.counterComponent.getCount());
  }

  callChildMethod() {
    this.counterComponent.increment();
  }
}
```

### Read Property

```typescript
@ViewChild('input', { read: ElementRef }) input: ElementRef;
@ViewChild(MatInput) matInput: MatInput;
```

## @ViewChildren Decorator

Access multiple child components or elements.

```typescript
@Component({
  selector: 'app-list',
  template: `
    <app-item #items></app-item>
    <app-item #items></app-item>
    <app-item #items></app-item>
  `
})
export class ListComponent implements AfterViewInit {
  @ViewChildren('items') items: QueryList<ItemComponent>;

  ngAfterViewInit() {
    console.log('Total items:', this.items.length);
    
    this.items.forEach((item, index) => {
      console.log(`Item ${index}:`, item);
    });
  }
}
```

### Monitoring QueryList Changes

```typescript
export class ListComponent implements AfterViewInit {
  @ViewChildren(ItemComponent) items: QueryList<ItemComponent>;

  ngAfterViewInit() {
    // Initial items
    console.log('Initial count:', this.items.length);

    // Listen to changes
    this.items.changes.subscribe(() => {
      console.log('Items changed, new count:', this.items.length);
    });
  }
}
```

## @ContentChild Decorator

Access projected content (ng-content).

```typescript
// Card Component - receives content via ng-content
@Component({
  selector: 'app-card',
  template: `
    <div class="header">
      <ng-content select="[cardHeader]"></ng-content>
    </div>
    <div class="body">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent implements AfterContentInit {
  @ContentChild('titleTemplate') titleTemplate: TemplateRef<any>;
  @ContentChild(IconComponent) icon: IconComponent;

  ngAfterContentInit() {
    console.log('Content initialized:', this.titleTemplate, this.icon);
  }
}

// Parent Component
@Component({
  selector: 'app-app',
  template: `
    <app-card>
      <div cardHeader>
        <span #titleTemplate>My Title</span>
      </div>
      <app-icon></app-icon>
      <p>Card content</p>
    </app-card>
  `
})
export class AppComponent {}
```

## @ContentChildren Decorator

Access multiple projected elements.

```typescript
@Component({
  selector: 'app-menu',
  template: `
    <ul>
      <ng-content></ng-content>
    </ul>
  `
})
export class MenuComponent implements AfterContentInit {
  @ContentChildren(MenuItemComponent) items: QueryList<MenuItemComponent>;

  ngAfterContentInit() {
    console.log('Menu items:', this.items.length);
    
    this.items.forEach(item => {
      item.highlight();
    });
  }
}
```

## ElementRef

Access native DOM elements.

```typescript
@Component({
  selector: 'app-button'
})
export class ButtonComponent {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Access native element
    const nativeElement = this.elementRef.nativeElement;
    nativeElement.style.backgroundColor = 'blue';
    nativeElement.classList.add('active');
  }

  getSize() {
    return {
      width: this.elementRef.nativeElement.offsetWidth,
      height: this.elementRef.nativeElement.offsetHeight
    };
  }
}
```

## Template Reference Variables

Create references in templates using #variableName.

```typescript
@Component({
  selector: 'app-form',
  template: `
    <input #nameInput />
    <input #emailInput />
    <button (click)="submit()">Submit</button>
  `
})
export class FormComponent {
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;

  submit() {
    const name = this.nameInput.nativeElement.value;
    const email = this.emailInput.nativeElement.value;
    console.log(name, email);
  }
}
```

## TemplateRef

Reference to ng-template for dynamic rendering.

```typescript
@Component({
  selector: 'app-app',
  template: `
    <ng-template #messageTemplate let-message="message">
      <div>{{ message }}</div>
    </ng-template>
    <button (click)="show()">Show</button>
  `
})
export class AppComponent {
  @ViewChild('messageTemplate') messageTemplate: TemplateRef<any>;

  constructor(private vcr: ViewContainerRef) {}

  show() {
    this.vcr.clear();
    this.vcr.createEmbeddedView(this.messageTemplate, {
      message: 'Hello from template!'
    });
  }
}
```

## AfterViewInit vs AfterContentInit

### AfterViewInit

Called after view and child views are initialized:

```typescript
export class ParentComponent implements AfterViewInit {
  @ViewChild(ChildComponent) child: ChildComponent;

  ngAfterViewInit() {
    // Access child component
    this.child.doSomething();
  }
}
```

### AfterContentInit

Called after projected content is initialized:

```typescript
export class CardComponent implements AfterContentInit {
  @ContentChild(TitleComponent) title: TitleComponent;

  ngAfterContentInit() {
    // Access projected content
    this.title.style();
  }
}
```

## Common Patterns

### Dynamic Component Creation

```typescript
@Component({
  selector: 'app-container'
})
export class ContainerComponent {
  @ViewChild('placeholder', { read: ViewContainerRef }) placeholder: ViewContainerRef;

  loadComponent(component: any) {
    this.placeholder.clear();
    this.placeholder.createComponent(component);
  }
}
```

### Focus Management

```typescript
@Component({
  selector: 'app-form',
  template: `
    <input #firstInput />
    <input #lastInput />
  `
})
export class FormComponent {
  @ViewChild('firstInput') firstInput: ElementRef;

  ngAfterViewInit() {
    this.firstInput.nativeElement.focus();
  }
}
```

## Best Practices

✅ Use @ViewChild after AfterViewInit  
✅ Use @ContentChild after AfterContentInit  
✅ Store ElementRef references in ViewChild  
✅ Use nativeElement carefully (prefer Angular bindings)  
✅ Unsubscribe from QueryList.changes  
✅ Avoid excessive DOM manipulation  
✅ Use template reference variables for simple access  

## Key Takeaways

- @ViewChild accesses single child or DOM element
- @ViewChildren accesses multiple children
- @ContentChild accesses projected content
- ElementRef provides access to native DOM
- AfterViewInit/AfterContentInit are required
- Template reference variables simplify access
- Prefer Angular bindings over DOM manipulation
