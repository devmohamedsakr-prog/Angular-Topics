/**
 * View Access & Queries Example
 * Demonstrates @ViewChild, @ViewChildren, @ContentChild, ElementRef, TemplateRef
 */

import {
  Component,
  ViewChild,
  ViewChildren,
  ContentChild,
  ContentChildren,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewContainerRef,
  AfterViewInit,
  AfterContentInit
} from '@angular/core';

// ============================================================
// EXAMPLE 1: @ViewChild - Accessing DOM Element
// ============================================================

@Component({
  selector: 'app-search-box',
  template: `
    <div>
      <input #searchInput type="text" placeholder="Search..." />
      <button (click)="focus()">Focus</button>
      <button (click)="clear()">Clear</button>
    </div>
  `
})
export class SearchBoxComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    // Safe to access view after initialization
    console.log('Search input:', this.searchInput.nativeElement);
  }

  focus() {
    this.searchInput.nativeElement.focus();
  }

  clear() {
    this.searchInput.nativeElement.value = '';
  }

  getValue(): string {
    return this.searchInput.nativeElement.value;
  }
}

// ============================================================
// EXAMPLE 2: @ViewChild - Accessing Child Component
// ============================================================

// Child Component
@Component({
  selector: 'app-counter'
})
export class CounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  getCount(): number {
    return this.count;
  }

  reset() {
    this.count = 0;
  }
}

// Parent Component
@Component({
  selector: 'app-counter-container',
  template: `
    <div>
      <app-counter #counter></app-counter>
      <button (click)="incrementFromParent()">Parent +</button>
      <button (click)="getCurrentCount()">Get Count</button>
      <p>Parent sees count: {{ displayCount }}</p>
    </div>
  `
})
export class CounterContainerComponent implements AfterViewInit {
  @ViewChild('counter') counterComponent: CounterComponent;
  displayCount = 0;

  ngAfterViewInit() {
    console.log('Counter component:', this.counterComponent);
  }

  incrementFromParent() {
    this.counterComponent.increment();
  }

  getCurrentCount() {
    this.displayCount = this.counterComponent.getCount();
  }
}

// ============================================================
// EXAMPLE 3: @ViewChildren - Multiple Children
// ============================================================

@Component({
  selector: 'app-item'
})
export class ItemComponent {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  highlight() {
    console.log(`Highlighting item: ${this.name}`);
  }
}

@Component({
  selector: 'app-item-list',
  template: `
    <div>
      <app-item #item></app-item>
      <app-item #item></app-item>
      <app-item #item></app-item>
      <button (click)="highlightAll()">Highlight All</button>
      <p>Total items: {{ itemCount }}</p>
    </div>
  `
})
export class ItemListComponent implements AfterViewInit {
  @ViewChildren('item') items: QueryList<ItemComponent>;
  itemCount = 0;

  ngAfterViewInit() {
    this.itemCount = this.items.length;
    console.log('Items found:', this.items.length);
  }

  highlightAll() {
    this.items.forEach(item => {
      item.highlight();
    });
  }

  getFirstItem() {
    return this.items.first;
  }

  getLastItem() {
    return this.items.last;
  }
}

// ============================================================
// EXAMPLE 4: Monitoring QueryList Changes
// ============================================================

@Component({
  selector: 'app-dynamic-list'
})
export class DynamicListComponent implements AfterViewInit {
  @ViewChildren('dynamicItem') items: QueryList<any>;
  items_list: any[] = [];

  ngAfterViewInit() {
    // Listen to changes
    this.items.changes.subscribe(() => {
      console.log('Items changed, new count:', this.items.length);
    });
  }

  addItem() {
    this.items_list.push({ id: Date.now() });
  }

  removeItem(index: number) {
    this.items_list.splice(index, 1);
  }
}

// ============================================================
// EXAMPLE 5: @ViewChild with Read Property
// ============================================================

@Component({
  selector: 'app-form-input'
})
export class FormInputComponent {
  // Read the ElementRef directly
  @ViewChild('input', { read: ElementRef }) inputElement: ElementRef;

  // Read component by type
  @ViewChild(CounterComponent) counter: CounterComponent;

  // Read ViewContainerRef for dynamic components
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
}

// ============================================================
// EXAMPLE 6: @ContentChild - Accessing Projected Content
// ============================================================

// Card Component (receives content via ng-content)
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
export class CardComponent implements AfterContentInit {
  @ContentChild('titleTemplate') titleTemplate: TemplateRef<any>;

  ngAfterContentInit() {
    console.log('Content initialized:', this.titleTemplate);
  }
}

// Parent Usage:
/*
<app-card>
  <div cardHeader>
    <span #titleTemplate>Card Title</span>
  </div>
  <p>Card content goes here</p>
  <div cardFooter>Footer</div>
</app-card>
*/

// ============================================================
// EXAMPLE 7: @ContentChildren - Multiple Projected Elements
// ============================================================

// Menu Item Component
@Component({
  selector: 'app-menu-item'
})
export class MenuItemComponent {
  label: string;

  constructor(label: string) {
    this.label = label;
  }

  activate() {
    console.log(`Menu item activated: ${this.label}`);
  }
}

// Menu Component
@Component({
  selector: 'app-menu',
  template: `
    <ul>
      <li *ngFor="let item of menuItems">
        <ng-content></ng-content>
      </li>
    </ul>
  `
})
export class MenuComponent implements AfterContentInit {
  @ContentChildren(MenuItemComponent) items: QueryList<MenuItemComponent>;
  menuItems: MenuItemComponent[] = [];

  ngAfterContentInit() {
    this.menuItems = this.items.toArray();
    this.items.forEach(item => item.activate());
  }
}

// ============================================================
// EXAMPLE 8: ElementRef - Access Native DOM
// ============================================================

@Component({
  selector: 'app-styled-button'
})
export class StyledButtonComponent {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    const element = this.elementRef.nativeElement;
    
    // Modify native properties
    element.style.backgroundColor = 'blue';
    element.style.color = 'white';
    element.classList.add('custom-button');
  }

  getSize() {
    const element = this.elementRef.nativeElement;
    return {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

  getPosition() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top
    };
  }
}

// ============================================================
// EXAMPLE 9: Template Reference Variables
// ============================================================

@Component({
  selector: 'app-form-example',
  template: `
    <form>
      <input #nameInput placeholder="Name" />
      <input #emailInput placeholder="Email" />
      <button type="button" (click)="submit()">Submit</button>
      <p>Form values: {{ formValues }}</p>
    </form>
  `
})
export class FormExampleComponent {
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('emailInput') emailInput: ElementRef;
  formValues = '';

  submit() {
    const name = this.nameInput.nativeElement.value;
    const email = this.emailInput.nativeElement.value;
    this.formValues = `Name: ${name}, Email: ${email}`;
  }
}

// ============================================================
// EXAMPLE 10: TemplateRef - Dynamic Rendering
// ============================================================

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal" *ngIf="isOpen">
      <div class="modal-content">
        <ng-container *ngTemplateOutlet="content; context: { $implicit: data }"></ng-container>
        <button (click)="close()">Close</button>
      </div>
    </div>
  `
})
export class ModalComponent {
  @ViewChild('modalTemplate') modalTemplate: TemplateRef<any>;
  isOpen = false;
  content: TemplateRef<any>;
  data: any;

  open(template: TemplateRef<any>, data?: any) {
    this.content = template;
    this.data = data;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}

// ============================================================
// EXAMPLE 11: ViewContainerRef - Dynamic Component Creation
// ============================================================

@Component({
  selector: 'app-dynamic-component-host',
  template: `
    <div #container></div>
    <button (click)="loadComponent()">Load Component</button>
  `
})
export class DynamicComponentHostComponent {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  loadComponent() {
    this.container.clear();
    // In real app: use ComponentFactoryResolver to create component
    // this.container.createComponent(SomeComponent);
  }
}

// ============================================================
// EXAMPLE 12: AfterViewInit vs AfterContentInit
// ============================================================

@Component({
  selector: 'app-comparison'
})
export class AfterInitComparisonComponent
  implements AfterViewInit, AfterContentInit {

  @ViewChild(CounterComponent) viewChild: CounterComponent;
  @ContentChild(MenuItemComponent) contentChild: MenuItemComponent;

  ngAfterViewInit() {
    // Called after view and child VIEWS are initialized
    console.log('View initialized:', this.viewChild);
    if (this.viewChild) {
      this.viewChild.increment();
    }
  }

  ngAfterContentInit() {
    // Called after projected CONTENT is initialized
    console.log('Content initialized:', this.contentChild);
    if (this.contentChild) {
      this.contentChild.activate();
    }
  }
}

// ============================================================
// EXAMPLE 13: Complete Pattern - Parent-Child Access
// ============================================================

// Child with public methods
@Component({
  selector: 'app-data-processor'
})
export class DataProcessorComponent {
  data: any[] = [];

  processData(input: any[]) {
    this.data = input.map(item => ({ ...item, processed: true }));
    return this.data;
  }

  clear() {
    this.data = [];
  }
}

// Parent accessing child
@Component({
  selector: 'app-data-manager',
  template: `
    <div>
      <app-data-processor #processor></app-data-processor>
      <button (click)="process()">Process</button>
      <button (click)="show()">Show Data</button>
    </div>
  `
})
export class DataManagerComponent implements AfterViewInit {
  @ViewChild('processor') processor: DataProcessorComponent;
  inputData = [
    { id: 1, value: 'A' },
    { id: 2, value: 'B' }
  ];

  ngAfterViewInit() {
    console.log('Processor available:', this.processor);
  }

  process() {
    this.processor.processData(this.inputData);
  }

  show() {
    console.log('Processed data:', this.processor.data);
  }
}

// ============================================================
// Summary of View Access Techniques
// ============================================================

/**
 * Query Selectors:
 *
 * @ViewChild - Single child element/component
 * @ViewChildren - Multiple children
 * @ContentChild - Single projected element
 * @ContentChildren - Multiple projected elements
 *
 * Access Types:
 *
 * ElementRef - Raw DOM element
 * TemplateRef - ng-template reference
 * ViewContainerRef - Container for dynamic components
 * QueryList - Collection of elements
 *
 * Timing:
 *
 * ngAfterViewInit - Access child VIEWS
 * ngAfterContentInit - Access projected CONTENT
 * Never access before ngAfterViewInit/ngAfterContentInit
 *
 * Best Practices:
 *
 * ✅ Use @ViewChild after AfterViewInit
 * ✅ Use @ContentChild after AfterContentInit
 * ✅ Prefer Angular bindings over nativeElement
 * ✅ Use trackBy with *ngFor
 * ✅ Unsubscribe from QueryList.changes
 */
