# Micro-Frontends Implementation Guide

## Overview

Micro-frontends architecture allows multiple independent Angular applications to coexist in a single browser context.

---

## Approach 1: Module Federation (Webpack 5+)

```typescript
// Shell application (host)
// shell/webpack.config.js
module.exports = {
  output: {
    uniqueName: 'shell'
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        products: 'products@http://localhost:3001/remoteEntry.js',
        cart: 'cart@http://localhost:3002/remoteEntry.js',
        checkout: 'checkout@http://localhost:3003/remoteEntry.js'
      },
      shared: ['@angular/core', '@angular/common', 'rxjs']
    })
  ]
};

// Shell routing
const routes: Routes = [
  {
    path: 'products',
    loadChildren: () => import('products/ProductsModule').then(m => m.ProductsModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('cart/CartModule').then(m => m.CartModule)
  }
];

// Micro app (products)
// products/webpack.config.js
module.exports = {
  output: {
    uniqueName: 'products'
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'products',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductsModule': './src/app/products/products.module.ts'
      },
      shared: ['@angular/core', '@angular/common', 'rxjs']
    })
  ]
};
```

---

## Approach 2: Web Components with Custom Elements

```typescript
// Micro app: Products
@NgModule({
  declarations: [ProductsComponent],
  imports: [BrowserModule]
})
export class ProductsModule {
  ngDoBootstrap(appRef: ApplicationRef) {
    // Convert Angular component to web component
    const productsCE = createCustomElement(ProductsComponent, { injector: this.injector });
    customElements.define('app-products', productsCE);
  }

  constructor(private injector: Injector) {}
}

// main.ts - Don't bootstrap normally
platformBrowserDynamic().bootstrapModule(ProductsModule);

// Shell app HTML
<html>
  <body>
    <app-shell></app-shell>
    <app-products></app-products>
    <app-cart></app-cart>
  </body>
</html>
```

---

## Approach 3: Single-SPA (Recommended)

```typescript
// Main registration (shell)
// main.ts
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: '@myapp/products',
  app: () => System.import('@myapp/products'),
  activeWhen: '/products'
});

registerApplication({
  name: '@myapp/cart',
  app: () => System.import('@myapp/cart'),
  activeWhen: '/cart'
});

start();

// Products micro-app
// products/main.ts
import { NgZone, platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { singleSpaAngular } from 'single-spa-angular';
import { ProductsModule } from './app/products.module';

const lifecycles = singleSpaAngular({
  zone: NgZone,
  bootstrapFunction: () => platformBrowserDynamic().bootstrapModule(ProductsModule),
  template: '<app-root></app-root>'
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
export const update = lifecycles.update;

// webpack.config.js
module.exports = {
  output: {
    library: '@myapp/products',
    libraryTarget: 'umd'
  }
};
```

---

## Communication Between Micro-Frontends

```typescript
// Shared event service
@Injectable({ providedIn: 'root' })
export class MicroFrontendEventService {
  private events$ = new Subject<MFEvent>();

  emit(event: MFEvent): void {
    this.events$.next(event);
  }

  on(eventType: string): Observable<MFEvent> {
    return this.events$.pipe(
      filter(e => e.type === eventType)
    );
  }
}

// Products micro-app
@Component({...})
export class ProductsComponent {
  constructor(private eventService: MicroFrontendEventService) {}

  addToCart(product: Product): void {
    this.eventService.emit({
      type: 'PRODUCT_ADDED_TO_CART',
      payload: product
    });
  }
}

// Cart micro-app
@Component({...})
export class CartComponent implements OnInit {
  constructor(private eventService: MicroFrontendEventService) {}

  ngOnInit(): void {
    this.eventService.on('PRODUCT_ADDED_TO_CART').subscribe(event => {
      this.addItemToCart(event.payload);
    });
  }
}
```

---

## Shared State Management

```typescript
// Root store (shared between micro-apps)
@Injectable({ providedIn: 'root' })
export class SharedCartStore {
  private cart$ = new BehaviorSubject<CartItem[]>([]);

  addItem(item: CartItem): void {
    const current = this.cart$.value;
    this.cart$.next([...current, item]);
  }

  getCart(): Observable<CartItem[]> {
    return this.cart$.asObservable();
  }
}

// Used by all micro-apps
@Component({...})
export class ProductsComponent {
  constructor(private cartStore: SharedCartStore) {}

  addToCart(product: Product): void {
    this.cartStore.addItem({ ...product, quantity: 1 });
  }
}
```

---

## Testing Micro-Frontends

```typescript
describe('Micro-Frontend Integration', () => {
  let shell: Shell;
  let productsApp: ProductsApp;

  beforeEach(async () => {
    shell = new Shell();
    productsApp = new ProductsApp();
    
    await shell.bootstrap();
    await productsApp.mount();
  });

  it('should communicate between apps', fakeAsync(() => {
    let addedProduct: Product;
    
    shell.cartStore.getCart().subscribe(items => {
      if (items.length > 0) {
        addedProduct = items[0];
      }
    });

    productsApp.addToCart({ id: 1, name: 'Test Product', price: 10 });
    
    tick();
    expect(addedProduct.name).toBe('Test Product');
  }));

  afterEach(async () => {
    await productsApp.unmount();
    await shell.destroy();
  });
});
```

---

## Best Practices

1. **Independent Deployments** - Each micro-app deploys independently
2. **Clear Contracts** - Define interfaces between micro-apps
3. **Error Isolation** - Errors in one app shouldn't break others
4. **Shared Libraries** - Common utilities in shared package
5. **Performance** - Monitor bundle sizes individually
6. **Versioning** - Version each micro-app separately

---

## Performance Considerations

- Lazy load micro-apps on demand
- Share common dependencies (Angular, RxJS)
- Use differential loading
- Monitor bundle sizes with tools like Webpack Bundle Analyzer

---

## Drawbacks

- Increased complexity
- Shared dependency conflicts
- Testing challenges
- Development experience becomes harder
- Debugging across multiple apps

**Use micro-frontends only when you have:**
- Large teams working independently
- Continuous deployment requirements
- Multiple technology stacks
- Performance is not the primary concern

