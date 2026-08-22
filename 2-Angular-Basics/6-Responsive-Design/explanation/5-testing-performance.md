# Testing & Performance - Responsive Design

Testing responsive designs and optimizing performance.

## Viewport Testing

### Manual Device Testing

```typescript
// Test breakpoints in Angular
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

export class BreakpointService {
  getCurrentBreakpoint(): string {
    const width = window.innerWidth;
    if (width >= BREAKPOINTS.xxl) return 'xxl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }
}
```

### Testing Tools

```
Browser DevTools:
- Chrome DevTools (F12)
- Device emulation (Ctrl+Shift+M)
- Responsive design mode
- Touch simulation
- Network throttling

Online Tools:
- ResponsiveDesignChecker.com
- BrowserStack
- LambdaTest
- Sauce Labs
```

## Unit Testing Responsive Components

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { ResponsiveGridComponent } from './responsive-grid.component';

describe('ResponsiveGridComponent', () => {
  let component: ResponsiveGridComponent;
  let fixture: ComponentFixture<ResponsiveGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponsiveGridComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsiveGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render single column on mobile', () => {
    // Set viewport to mobile
    (window as any).innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    const grid = fixture.debugElement.query(
      el => el.nativeElement.classList.contains('grid')
    );

    expect(grid.nativeElement.style.gridTemplateColumns).toBe('1fr');
  });

  it('should render multiple columns on desktop', () => {
    (window as any).innerWidth = 1400;
    window.dispatchEvent(new Event('resize'));

    const grid = fixture.debugElement.query(
      el => el.nativeElement.classList.contains('grid')
    );

    expect(grid.nativeElement.style.gridTemplateColumns)
      .toContain('repeat(3, 1fr)');
  });

  it('should adjust font size based on viewport', () => {
    (window as any).innerWidth = 768;
    window.dispatchEvent(new Event('resize'));

    const heading = fixture.debugElement.query(el => el.name === 'h1');
    const computedStyle = window.getComputedStyle(heading.nativeElement);
    
    expect(computedStyle.fontSize).toBeTruthy();
  });
});
```

## E2E Testing Responsive Design

```typescript
// Cypress example
describe('Responsive Design E2E', () => {
  it('should be responsive on mobile', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('.hamburger').should('be.visible');
    cy.get('.nav-menu').should('not.be.visible');
  });

  it('should show full menu on desktop', () => {
    cy.viewport('macbook-16');
    cy.visit('/');
    cy.get('.hamburger').should('not.be.visible');
    cy.get('.nav-menu').should('be.visible');
  });

  it('should toggle menu on click', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('.hamburger').click();
    cy.get('.nav-menu').should('have.class', 'active');
  });
});
```

## Performance Metrics

### Core Web Vitals

```typescript
// Monitoring Core Web Vitals
export class PerformanceService {
  // Largest Contentful Paint (LCP)
  // Target: < 2.5s
  measureLCP() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('LCP:', entry.renderTime || entry.loadTime);
      }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // First Input Delay (FID)
  // Target: < 100ms
  measureFID() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingDuration);
      }
    });
    observer.observe({ entryTypes: ['first-input'] });
  }

  // Cumulative Layout Shift (CLS)
  // Target: < 0.1
  measureCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
        }
      }
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  }
}
```

### Image Optimization

```html
<!-- Lazy loading -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- Responsive srcset with sizes -->
<img 
  src="image-default.jpg"
  srcset="image-small.jpg 400w, image-medium.jpg 800w, image-large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 100vw"
  alt="Responsive image">

<!-- Modern formats -->
<picture>
  <source type="image/webp" srcset="image.webp">
  <source type="image/jpeg" srcset="image.jpg">
  <img src="image.jpg" alt="Description">
</picture>
```

### CSS Performance

```css
/* ✅ Good: Use will-change sparingly */
.animated-element {
  will-change: transform;
}

/* ❌ Bad: Using expensive properties */
.bad-animation {
  animation: slide 0.3s;
}

/* Better: Use GPU acceleration */
@keyframes slide {
  to { transform: translateX(100px); }
}

/* ✅ Good: Minimize repaints */
.container {
  contain: layout style paint;
}

/* Reduce selector complexity */
/* ❌ Complex */
div > ul > li > a:hover { }

/* ✅ Simple */
.nav-link:hover { }
```

## Lighthouse Audits

```bash
# CLI audit
npm install -g lighthouse
lighthouse https://example.com --view

# In DevTools:
1. Open DevTools (F12)
2. Lighthouse tab
3. Generate report
4. Check:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
```

## Performance Optimization Checklist

✅ **Images**
- Use responsive images (srcset)
- Optimize formats (WebP)
- Lazy load images
- Use appropriate sizes

✅ **CSS**
- Minimize CSS
- Avoid layout thrashing
- Use CSS containment
- Cache stylesheets

✅ **JavaScript**
- Code splitting
- Lazy loading components
- Tree shaking
- Minimize bundle

✅ **Network**
- HTTP/2 server push
- CDN delivery
- Compression (gzip/brotli)
- Caching headers

✅ **Rendering**
- Minimize repaints
- Use requestAnimationFrame
- Avoid forced reflows
- GPU acceleration

## Best Practices

✅ Test on real devices
✅ Use DevTools emulation
✅ Monitor Core Web Vitals
✅ Optimize images aggressively
✅ Minimize CSS/JS
✅ Use performance budgets
✅ Automate testing
✅ Monitor in production
✅ Test with slow networks
✅ Measure user experience
