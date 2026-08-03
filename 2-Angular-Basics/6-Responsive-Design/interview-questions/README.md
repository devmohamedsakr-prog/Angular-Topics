# Angular Responsive Design - Interview Questions

## Beginner Level

### Q1: What is responsive design and why is it important?
**Answer:**
Responsive design makes web applications work on all device sizes and screen resolutions.

**Importance:**
- 60%+ of web traffic is mobile
- Improves SEO (Google prioritizes mobile-friendly)
- Better user experience across devices
- Reduces development/maintenance costs
- Works on future devices of unknown sizes

**Example:**
```css
/* Mobile-first responsive design */
body { font-size: 14px; }

@media (min-width: 768px) {
  body { font-size: 16px; }
}

@media (min-width: 1024px) {
  body { font-size: 18px; }
}
```

---

### Q2: What are common breakpoints in responsive design?
**Answer:**
Breakpoints are screen sizes where layout changes:

```css
/* Common breakpoints */
Extra Small (Mobile): < 480px
Small (Mobile): 480px - 768px
Medium (Tablet): 768px - 1024px
Large (Desktop): 1024px - 1440px
Extra Large (Large Desktop): > 1440px
```

**Using in CSS:**
```css
/* Mobile first */
.container { width: 100%; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { width: 750px; margin: 0 auto; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { width: 970px; }
}

/* Large desktop and up */
@media (min-width: 1440px) {
  .container { width: 1170px; }
}
```

---

### Q3: What is mobile-first design?
**Answer:**
Design for mobile devices first, then enhance for larger screens.

**Advantages:**
- Starts with essential features
- Progressive enhancement
- Better performance on mobile
- Simpler media queries

**Example:**
```css
/* Mobile first approach */

/* Base styles (mobile) */
.card { width: 100%; }
.grid { display: block; }

/* Enhance for tablet */
@media (min-width: 768px) {
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); }
}

/* Enhance for desktop */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
  .card { width: 300px; }
}
```

**vs Desktop-first:**
```css
/* Desktop first (not recommended) */
.grid { display: grid; grid-template-columns: repeat(4, 1fr); }

/* Override for smaller screens */
@media (max-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}
```

---

### Q4: What are Flexbox and CSS Grid for responsive layouts?
**Answer:**

**Flexbox:**
- One-dimensional layout (row or column)
- Flexible alignment and spacing
- Perfect for components

```css
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.flex-item {
  flex: 1 1 250px; /* Flexible width, min 250px */
}
```

**CSS Grid:**
- Two-dimensional layout (rows and columns)
- Complex layouts
- Powerful alignment

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
```

**Choosing between them:**
- Single row/column → Flexbox
- Complex 2D layout → Grid
- Navigation → Flexbox
- Dashboard layout → Grid

---

### Q5: How do you make images responsive?
**Answer:**
Multiple techniques for responsive images:

```html
<!-- 1. Max-width approach -->
<img src="image.jpg" alt="Image" style="max-width: 100%; height: auto;">

<!-- 2. Picture element with sources -->
<picture>
  <source media="(min-width: 1200px)" srcset="image-large.jpg">
  <source media="(min-width: 768px)" srcset="image-medium.jpg">
  <img src="image-small.jpg" alt="Image">
</picture>

<!-- 3. Srcset for different resolutions -->
<img 
  src="image-1x.jpg"
  srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x"
  alt="Image">

<!-- 4. Responsive srcset with sizes -->
<img
  src="image-400w.jpg"
  srcset="
    image-300w.jpg 300w,
    image-600w.jpg 600w,
    image-1200w.jpg 1200w
  "
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Image">

<!-- 5. Lazy loading -->
<img src="image.jpg" loading="lazy" alt="Image">
```

---

## Intermediate Level

### Q6: How do you detect viewport changes in Angular?
**Answer:**
Use Angular CDK BreakpointObserver:

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({})
export class ResponsiveComponent implements OnInit {
  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }
}
```

**Predefined breakpoints:**
- `Handset`: Phone or tablet
- `Tablet`: Tablet
- `Web`: Web browser
- `Small`: < 600px
- `Medium`: 600px - 960px
- `Large`: > 960px
- `XLarge`: > 1280px

**Custom breakpoints:**
```typescript
this.breakpointObserver
  .observe('(min-width: 768px)')
  .subscribe(result => {
    console.log('Tablet or larger');
  });
```

---

### Q7: How do you create responsive navigation in Angular?
**Answer:**
Navigation that adapts to screen size:

```typescript
@Component({
  selector: 'app-nav',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <h1>Logo</h1>
        
        <button class="hamburger" (click)="toggleMenu()" *ngIf="isMobile">
          <span></span><span></span><span></span>
        </button>
        
        <ul class="nav-menu" [class.active]="menuOpen">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { background: #333; }
    .nav-menu { display: flex; }
    .hamburger { display: none; }

    @media (max-width: 768px) {
      .hamburger { display: block; }
      .nav-menu {
        position: absolute;
        max-height: 0;
        overflow: hidden;
        flex-direction: column;
      }
      .nav-menu.active { max-height: 300px; }
    }
  `]
})
export class NavComponent implements OnInit {
  isMobile = false;
  menuOpen = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
```

---

### Q8: How do you create responsive forms?
**Answer:**
Forms that adapt to screen size:

```typescript
@Component({
  template: `
    <form class="form-grid">
      <div class="form-row">
        <input class="form-col" placeholder="First Name">
        <input class="form-col" placeholder="Last Name">
      </div>
      <div class="form-row">
        <input class="form-col" placeholder="Email">
      </div>
      <button class="btn-full">Submit</button>
    </form>
  `,
  styles: [`
    .form-row {
      display: grid;
      gap: 16px;
    }

    /* Mobile: 1 column */
    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
    }

    /* Desktop: 2 columns */
    @media (min-width: 601px) {
      .form-row { grid-template-columns: repeat(2, 1fr); }
    }

    /* Full width on mobile */
    @media (max-width: 600px) {
      .btn-full { width: 100%; }
    }
  `]
})
export class FormComponent {}
```

---

### Q9: How do you optimize responsive design for touch devices?
**Answer:**
Make interfaces touch-friendly:

```css
/* Larger touch targets (min 48x48px) */
button {
  padding: 12px 24px; /* 48px height minimum */
  font-size: 16px;
}

/* Adequate spacing */
button + button { margin-left: 16px; }

/* Remove hover effects on touch */
@media (hover: none) {
  button:hover { background: no change; }
}

/* Support touch gestures */
touch-action: manipulation; /* No double-tap zoom delay */

/* Responsive font sizes */
@media (max-width: 600px) {
  body { font-size: 16px; } /* Prevent zoom on input */
}
```

**Touch event handling:**
```typescript
@Component({})
export class TouchComponent {
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    console.log('Touch started');
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    console.log('Touch ended');
  }
}
```

---

### Q10: How do you handle viewport orientation changes?
**Answer:**
Detect and handle portrait/landscape:

```typescript
@Component({
  template: `
    <div [ngClass]="{ portrait: isPortrait, landscape: !isPortrait }">
      Content changes based on orientation
    </div>
  `,
  styles: [`
    @media (orientation: portrait) {
      .portrait { width: 100%; }
    }

    @media (orientation: landscape) {
      .landscape { width: 100%; height: 100vh; }
    }
  `]
})
export class OrientationComponent implements OnInit {
  isPortrait = true;

  ngOnInit() {
    window.addEventListener('orientationchange', () => {
      this.isPortrait = window.innerHeight > window.innerWidth;
    });
  }
}
```

---

## Advanced Level

### Q11: How do you implement responsive typography?
**Answer:**
Scale fonts based on viewport:

```css
/* Fluid typography */
body {
  font-size: clamp(14px, 2vw, 18px);
  line-height: clamp(1.4, 5vw, 1.8);
}

h1 {
  font-size: clamp(24px, 5vw, 48px);
}

/* Responsive with breakpoints */
body { font-size: 14px; }

@media (min-width: 768px) {
  body { font-size: 16px; }
}

@media (min-width: 1024px) {
  body { font-size: 18px; }
}

/* Responsive line height */
p {
  line-height: 1.4; /* Mobile */
}

@media (min-width: 768px) {
  p { line-height: 1.6; }
}
```

---

### Q12: How do you create responsive grids that auto-fit?
**Answer:**
Auto-flowing responsive grid:

```css
/* Auto-fit columns */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

/* Auto-fill columns */
.grid-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

/* Responsive with aspect ratio */
.grid-aspect {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.grid-aspect img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 1;
}
```

**Difference between auto-fit and auto-fill:**
- `auto-fit`: Collapses empty tracks
- `auto-fill`: Keeps empty tracks

---

### Q13: How do you handle responsive iframes and embedded content?
**Answer:**
Maintain aspect ratio for embedded content:

```css
/* Responsive iframe wrapper */
.iframe-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Alternative: Use aspect-ratio (modern) */
.iframe-modern {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```

**Angular component:**
```typescript
@Component({
  template: `
    <div class="iframe-container">
      <iframe 
        [src]="videoUrl | safe"
        allowfullscreen>
      </iframe>
    </div>
  `,
  styles: [`
    .iframe-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }
    iframe {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
    }
  `]
})
export class VideoComponent {
  videoUrl = 'https://www.youtube.com/embed/VIDEO_ID';
}
```

---

### Q14: How do you test responsive design?
**Answer:**
Multiple testing approaches:

```typescript
// Unit testing with breakpoint observer
describe('ResponsiveComponent', () => {
  it('should show mobile view on small screens', () => {
    const fixture = TestBed.createComponent(ResponsiveComponent);
    const component = fixture.componentInstance;

    // Simulate small screen
    breakpointObserver.emit({ matches: true });
    fixture.detectChanges();

    expect(component.isMobile).toBe(true);
  });
});

// E2E testing with different viewports
describe('Responsive E2E', () => {
  it('should work on mobile', () => {
    cy.viewport(375, 667); // iPhone 8
    cy.visit('/');
    cy.get('.hamburger').should('be.visible');
  });

  it('should work on tablet', () => {
    cy.viewport(768, 1024); // iPad
    cy.visit('/');
    cy.get('.nav-menu').should('be.visible');
  });

  it('should work on desktop', () => {
    cy.viewport(1920, 1080); // Desktop
    cy.visit('/');
    cy.get('nav').should('be.fully.visible');
  });
});

// Manual testing checklist
const testViewports = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1920, height: 1080 }
];
```

---

### Q15: How do you optimize responsive design for performance?
**Answer:**
Performance considerations for responsive layouts:

```css
/* Avoid layout thrashing */
/* ✗ Bad: Recalculates layout each time */
for (let i = 0; i < 100; i++) {
  element.style.width = element.offsetWidth + 10 + 'px';
}

/* ✓ Good: Batch reads and writes */
const width = element.offsetWidth;
for (let i = 0; i < 100; i++) {
  element.style.width = (width + i * 10) + 'px';
}

/* Use will-change sparingly */
.animated {
  will-change: transform;
}

/* Optimize media queries */
/* ✗ Avoid complex selectors in media queries */
@media (min-width: 768px) {
  .container > .row > .col > .card > .content { }
}

/* ✓ Use efficient selectors */
@media (min-width: 768px) {
  .card { }
}

/* Use CSS Grid over floats */
/* ✓ Modern, performant */
.grid { display: grid; grid-template-columns: repeat(3, 1fr); }

/* Container queries for component-level responsive */
@container (min-width: 400px) {
  .card { display: grid; }
}
```

**Measurement tools:**
- Chrome DevTools: Audit tab
- Lighthouse: Performance metrics
- WebPageTest: Waterfall analysis
