# Setup Responsive Angular Project

**IDE Prompt:** Use this when starting a new responsive Angular project.

---

## 🎯 Task: Initialize Responsive Design Project

**When to use:** Starting a brand new Angular application with responsive design from day one.

---

## 📋 Checklist

- [ ] Create new Angular project
- [ ] Configure viewport meta tag
- [ ] Setup CSS variables for breakpoints
- [ ] Create base responsive container component
- [ ] Setup global styles
- [ ] Configure responsive images
- [ ] Create breakpoint service

---

## 🚀 Step-by-Step Instructions

### 1. Create Angular Project
```bash
ng new my-responsive-app
cd my-responsive-app
ng serve
```

### 2. Add Viewport Meta Tag
**File:** `src/index.html`

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <meta name="color-scheme" content="light dark">
</head>
```

### 3. Setup Global CSS Variables
**File:** `src/styles.css`

```css
:root {
  /* Breakpoints */
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1400px;

  /* Spacing */
  --spacing-xs: clamp(4px, 1vw, 12px);
  --spacing-sm: clamp(8px, 1.5vw, 16px);
  --spacing-md: clamp(16px, 2vw, 24px);
  --spacing-lg: clamp(24px, 3vw, 36px);
  --spacing-xl: clamp(32px, 4vw, 48px);

  /* Typography */
  --font-size-xs: clamp(12px, 1.5vw, 14px);
  --font-size-sm: clamp(14px, 1.8vw, 16px);
  --font-size-base: clamp(16px, 2vw, 18px);
  --font-size-lg: clamp(18px, 2.5vw, 24px);
  --font-size-xl: clamp(24px, 4vw, 32px);
  --font-size-xxl: clamp(32px, 5vw, 48px);

  /* Colors */
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-border: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1e1e1e;
    --color-text: #ffffff;
    --color-border: #444444;
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  transition: background-color 0.3s ease;
}
```

### 4. Create Responsive Container Component
```bash
ng generate component components/container
```

**File:** `src/app/components/container/container.component.ts`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-container',
  template: `<div class="container"><ng-content></ng-content></div>`,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: clamp(15px, 3vw, 40px);
      width: 100%;
    }
  `]
})
export class ContainerComponent {}
```

### 5. Create Breakpoint Service
```bash
ng generate service services/breakpoint
```

**File:** `src/app/services/breakpoint.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private breakpointSubject = new BehaviorSubject<Breakpoint>('xs');
  public breakpoint$: Observable<Breakpoint> = this.breakpointSubject.asObservable();

  constructor() {
    this.checkBreakpoint();
    window.addEventListener('resize', () => this.checkBreakpoint());
  }

  private checkBreakpoint(): void {
    const width = window.innerWidth;
    let breakpoint: Breakpoint;

    if (width < 576) breakpoint = 'xs';
    else if (width < 768) breakpoint = 'sm';
    else if (width < 992) breakpoint = 'md';
    else if (width < 1200) breakpoint = 'lg';
    else if (width < 1400) breakpoint = 'xl';
    else breakpoint = 'xxl';

    this.breakpointSubject.next(breakpoint);
  }

  isBreakpoint(bp: Breakpoint): boolean {
    return this.breakpointSubject.value === bp;
  }

  isMinBreakpoint(bp: Breakpoint): boolean {
    const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
    const currentIndex = breakpoints.indexOf(this.breakpointSubject.value);
    const targetIndex = breakpoints.indexOf(bp);
    return currentIndex >= targetIndex;
  }
}
```

### 6. Use in App Component
**File:** `src/app/app.component.ts`

```typescript
import { Component } from '@angular/core';
import { BreakpointService, Breakpoint } from './services/breakpoint.service';

@Component({
  selector: 'app-root',
  template: `
    <app-container>
      <h1>Responsive Angular App</h1>
      <p>Current breakpoint: {{ (breakpoint$ | async) }}</p>
    </app-container>
  `,
  styles: [`
    h1 { font-size: var(--font-size-xxl); }
    p { font-size: var(--font-size-base); }
  `]
})
export class AppComponent {
  breakpoint$ = this.breakpointService.breakpoint$;

  constructor(private breakpointService: BreakpointService) {}
}
```

---

## 📁 Project Structure After Setup

```
src/
├── app/
│   ├── components/
│   │   └── container/
│   ├── services/
│   │   └── breakpoint.service.ts
│   └── app.component.ts
├── styles.css
└── index.html
```

---

## ✅ Verification Checklist

- [ ] `ng serve` runs without errors
- [ ] Viewport meta tag in index.html
- [ ] Global CSS variables defined
- [ ] Container component working
- [ ] Breakpoint service injectable
- [ ] Dark mode meta tag set
- [ ] Can see "Current breakpoint" in browser

---

## 🔗 Next Steps

After setup:
1. **Create responsive layouts** → See: `2-create-layouts.md`
2. **Build responsive components** → See: `3-build-components.md`
3. **Add media queries** → See: `4-media-queries.md`
4. **Optimize images** → See: `5-optimize-images.md`

---

## 📚 Reference Files

- `explanation/1-responsive-fundamentals.md` - Viewport and CSS units
- `examples/1-responsive-basics.ts` - Setup examples
- `interview-questions/1-responsive-fundamentals-qa.md` - Concepts

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Beginner  
**Next:** `2-create-layouts.md`
