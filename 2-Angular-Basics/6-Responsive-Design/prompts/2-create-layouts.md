# Create Responsive Layouts

**IDE Prompt:** Use this when building responsive page layouts with Flexbox and CSS Grid.

---

## 🎯 Task: Build Responsive Layout System

**When to use:** Creating responsive grid, dashboard, or multi-column layouts.

---

## 📋 Layout Types

- [ ] Hero section layout
- [ ] Card grid layout
- [ ] Sidebar + main layout
- [ ] Navigation layout
- [ ] Dashboard grid layout

---

## 🚀 Layout Patterns

### Pattern 1: Mobile-First Single Column to Multi-Column

**Component:** `src/app/components/card-grid/card-grid.component.ts`

```typescript
import { Component, Input } from '@angular/core';

interface Card { title: string; content: string; }

@Component({
  selector: 'app-card-grid',
  template: `
    <div class="grid">
      <div class="card" *ngFor="let card of cards">
        <h3>{{ card.title }}</h3>
        <p>{{ card.content }}</p>
      </div>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-md);
      width: 100%;
    }

    .card {
      background: #f5f5f5;
      padding: var(--spacing-lg);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h3 { margin-top: 0; font-size: var(--font-size-lg); }
    p { margin-bottom: 0; }

    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
      }
    }
  `]
})
export class CardGridComponent {
  @Input() cards: Card[] = [];
}
```

### Pattern 2: Sidebar + Main Content

**Component:** `src/app/components/sidebar-layout/sidebar-layout.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-layout',
  template: `
    <div class="layout">
      <aside class="sidebar">
        <ng-content select="[sidebar]"></ng-content>
      </aside>
      <main class="main">
        <ng-content select="[main]"></ng-content>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: var(--spacing-lg);
      min-height: 100vh;
    }

    .sidebar {
      background: #f9f9f9;
      padding: var(--spacing-lg);
      border-radius: 8px;
    }

    .main {
      padding: var(--spacing-lg);
    }

    @media (max-width: 768px) {
      .layout {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }

      .sidebar {
        order: 2;
      }

      .main {
        order: 1;
      }
    }
  `]
})
export class SidebarLayoutComponent {}
```

**Usage:**
```html
<app-sidebar-layout>
  <div sidebar>Sidebar Content</div>
  <div main>Main Content</div>
</app-sidebar-layout>
```

### Pattern 3: Flexbox Navigation

**Component:** `src/app/components/flex-navbar/flex-navbar.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-flex-navbar',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">Logo</div>
        <ul class="menu">
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-lg);
    }

    .logo {
      color: white;
      font-weight: bold;
      font-size: var(--font-size-lg);
    }

    .menu {
      display: flex;
      list-style: none;
      gap: var(--spacing-lg);
      margin: 0;
      padding: 0;
    }

    .menu a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
    }

    .menu a:hover {
      color: #2196f3;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .menu {
        flex-direction: column;
        width: 100%;
        gap: var(--spacing-sm);
      }
    }
  `]
})
export class FlexNavbarComponent {}
```

### Pattern 4: Hero Section

**Component:** `src/app/components/hero-section/hero-section.component.ts`

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  template: `
    <section class="hero">
      <div class="hero-content">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
        <button class="cta-button">{{ ctaText }}</button>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: var(--spacing-xl);
    }

    .hero-content {
      text-align: center;
      color: white;
      max-width: 600px;
    }

    h1 { font-size: var(--font-size-xxl); margin-bottom: var(--spacing-md); }
    p { font-size: var(--font-size-lg); margin-bottom: var(--spacing-lg); }

    .cta-button {
      padding: var(--spacing-md) var(--spacing-lg);
      background: white;
      color: #667eea;
      border: none;
      border-radius: 4px;
      font-size: var(--font-size-base);
      cursor: pointer;
      transition: transform 0.3s;
    }

    .cta-button:hover {
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      .hero {
        min-height: 300px;
        padding: var(--spacing-lg);
      }

      h1 { font-size: var(--font-size-xl); }
      p { font-size: var(--font-size-base); }
    }
  `]
})
export class HeroSectionComponent {
  @Input() title = 'Welcome';
  @Input() subtitle = 'Build amazing responsive apps';
  @Input() ctaText = 'Get Started';
}
```

---

## 🔧 Implementation Steps

### Step 1: Generate Components
```bash
ng generate component components/card-grid
ng generate component components/sidebar-layout
ng generate component components/flex-navbar
ng generate component components/hero-section
```

### Step 2: Copy Component Code
- Copy code from patterns above into generated components
- Update selectors and styling

### Step 3: Add to App Module
**File:** `src/app/app.module.ts`

```typescript
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { SidebarLayoutComponent } from './components/sidebar-layout/sidebar-layout.component';
import { FlexNavbarComponent } from './components/flex-navbar/flex-navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';

@NgModule({
  declarations: [
    CardGridComponent,
    SidebarLayoutComponent,
    FlexNavbarComponent,
    HeroSectionComponent
  ],
  imports: [CommonModule]
})
export class AppModule {}
```

### Step 4: Use in App Component
**File:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-flex-navbar></app-flex-navbar>
    <app-hero-section
      title="Responsive Design"
      subtitle="Beautiful layouts on all devices"
      ctaText="Learn More">
    </app-hero-section>
    <app-container>
      <app-card-grid [cards]="cards"></app-card-grid>
    </app-container>
  `
})
export class AppComponent {
  cards = [
    { title: 'Card 1', content: 'Content 1' },
    { title: 'Card 2', content: 'Content 2' },
    { title: 'Card 3', content: 'Content 3' }
  ];
}
```

---

## 📋 CSS Grid vs Flexbox Decision

**Use CSS Grid for:**
- Multi-row, multi-column layouts
- Dashboard grids
- Gallery layouts
- Complex page layouts

**Use Flexbox for:**
- Navigation menus
- Single-row layouts
- Alignment and distribution
- Component-level layouts

---

## ✅ Testing Checklist

- [ ] Layout looks good at 375px (mobile)
- [ ] Layout adjusts at 768px (tablet)
- [ ] Layout optimized at 1920px (desktop)
- [ ] No horizontal scrolling
- [ ] Touch targets 44px+
- [ ] Spacing uses CSS variables
- [ ] Responsive without media queries where possible

---

## 🔗 Next Steps

1. **Add media queries** → See: `4-media-queries.md`
2. **Build components** → See: `3-build-components.md`
3. **Optimize images** → See: `5-optimize-images.md`

---

## 📚 Reference Files

- `explanation/3-flexbox-and-grid.md` - Layout theory
- `examples/3-flexbox-layouts.ts` - 8 flexbox examples
- `examples/4-grid-layouts.ts` - 8 grid examples

---

**Estimated Time:** 20-30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** `1-setup-responsive-project.md`
