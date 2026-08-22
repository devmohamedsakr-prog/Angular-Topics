# Responsive Components - Angular & Web

Building responsive components that adapt across devices.

## Responsive Component Container

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-responsive-container',
  template: `
    <div class="responsive-wrapper" #container>
      <div class="responsive-grid">
        <div class="card" *ngFor="let item of items">{{ item }}</div>
      </div>
    </div>
  `,
  styles: [`
    .responsive-wrapper {
      width: 100%;
      padding: 20px 15px;
    }

    .responsive-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: clamp(10px, 2vw, 20px);
    }

    .card {
      background: #f0f0f0;
      padding: clamp(15px, 3vw, 25px);
      border-radius: 8px;
      aspect-ratio: 1;
    }

    @media (max-width: 600px) {
      .responsive-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ResponsiveContainerComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
}
```

## Responsive Navigation

```typescript
@Component({
  selector: 'app-responsive-nav',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">MyApp</div>
        
        <!-- Hamburger menu for mobile -->
        <button class="menu-toggle" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Navigation menu -->
        <ul class="nav-menu" [class.active]="isMenuOpen">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #333;
      padding: 1rem;
      position: sticky;
      top: 0;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      color: white;
      font-weight: bold;
      font-size: 1.5rem;
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      color: white;
      font-size: 1.5rem;
    }

    .menu-toggle span {
      display: block;
      width: 25px;
      height: 3px;
      background: white;
      margin: 5px 0;
      transition: 0.3s;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
    }

    /* Mobile */
    @media (max-width: 768px) {
      .menu-toggle {
        display: block;
      }

      .nav-menu {
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        flex-direction: column;
        background: #333;
        gap: 0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s;
      }

      .nav-menu.active {
        max-height: 300px;
      }

      .nav-menu li {
        padding: 1rem;
        border-bottom: 1px solid #444;
      }
    }
  `]
})
export class ResponsiveNavComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
```

## Responsive Image Component

```typescript
@Component({
  selector: 'app-responsive-image',
  template: `
    <picture>
      <source 
        media="(max-width: 600px)" 
        [srcset]="imagesMobile">
      <source 
        media="(max-width: 1200px)" 
        [srcset]="imagesTablet">
      <img 
        [src]="imageDesktop" 
        [alt]="alt"
        class="responsive-img">
    </picture>
  `,
  styles: [`
    .responsive-img {
      width: 100%;
      height: auto;
      display: block;
    }
  `]
})
export class ResponsiveImageComponent {
  @Input() imagesMobile = 'image-mobile.jpg';
  @Input() imagesTablet = 'image-tablet.jpg';
  @Input() imageDesktop = 'image-desktop.jpg';
  @Input() alt = 'Responsive image';
}
```

## Responsive Typography Component

```typescript
@Component({
  selector: 'app-responsive-text',
  template: `
    <h1 class="heading">{{ title }}</h1>
    <p class="body-text">{{ content }}</p>
  `,
  styles: [`
    :host {
      --font-size-h1: clamp(1.5rem, 5vw, 3rem);
      --font-size-body: clamp(1rem, 2vw, 1.25rem);
    }

    .heading {
      font-size: var(--font-size-h1);
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    .body-text {
      font-size: var(--font-size-body);
      line-height: 1.6;
      max-width: 65ch;
    }
  `]
})
export class ResponsiveTextComponent {
  @Input() title = '';
  @Input() content = '';
}
```

## Container Query Component

```typescript
@Component({
  selector: 'app-card-container',
  template: `
    <div class="card-container">
      <div class="card">
        <h2>Card Title</h2>
        <p>Card content goes here</p>
      </div>
    </div>
  `,
  styles: [`
    .card-container {
      container-type: inline-size;
      width: 100%;
    }

    .card {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    /* Respond to container width */
    @container (min-width: 400px) {
      .card {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
    }

    @container (min-width: 700px) {
      .card {
        display: grid;
        grid-template-columns: 2fr 1fr;
      }
    }
  `]
})
export class CardContainerComponent {}
```

## HostListener for Responsive Behavior

```typescript
@Component({
  selector: 'app-resize-aware',
  template: `
    <div class="layout" [ngClass]="currentBreakpoint">
      <p>Current breakpoint: {{ currentBreakpoint }}</p>
      <div class="content">Responsive content</div>
    </div>
  `,
  styles: [`
    .layout {
      padding: 20px;
    }

    .layout.mobile {
      display: block;
    }

    .layout.tablet {
      display: flex;
      flex-direction: row;
    }

    .layout.desktop {
      display: grid;
      grid-template-columns: 1fr 3fr;
    }
  `]
})
export class ResizeAwareComponent implements OnInit {
  currentBreakpoint = 'mobile';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkBreakpoint();
  }

  ngOnInit() {
    this.checkBreakpoint();
  }

  private checkBreakpoint() {
    const width = window.innerWidth;
    if (width < 768) {
      this.currentBreakpoint = 'mobile';
    } else if (width < 1200) {
      this.currentBreakpoint = 'tablet';
    } else {
      this.currentBreakpoint = 'desktop';
    }
  }
}
```

## Best Practices

✅ Use CSS Grid/Flexbox
✅ Responsive typography with clamp()
✅ Adaptive images (srcset, picture)
✅ Mobile-first approach
✅ Touch-friendly dimensions (44px+)
✅ CSS variables for themes
✅ Test on real devices
✅ Use HostListener for resize detection
✅ Container queries for component-level responsiveness
✅ Avoid hardcoded breakpoints in TypeScript
