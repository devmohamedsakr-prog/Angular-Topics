# Add Media Queries & Accessibility

**IDE Prompt:** Use this when adding advanced media queries for dark mode, accessibility, and device capabilities.

---

## 🎯 Task: Implement Advanced Media Queries

**When to use:** Adding dark mode, reduced motion, hover detection, and print styles.

---

## 📋 Features to Add

- [ ] Dark mode support
- [ ] Reduced motion support
- [ ] Hover/touch capability detection
- [ ] Print styles
- [ ] High contrast mode

---

## 🚀 Implementation Patterns

### Pattern 1: Dark Mode Support

**Global Styles:** `src/styles.css`

```css
:root {
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-border: #e0e0e0;
  --color-shadow: rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1e1e1e;
    --color-text: #ffffff;
    --color-border: #444444;
    --color-shadow: rgba(0, 0, 0, 0.3);
  }
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

**Component Example:** `src/app/components/dark-mode-card/dark-mode-card.component.ts`

```typescript
@Component({
  selector: 'app-dark-mode-card',
  template: `
    <div class="card">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
    </div>
  `,
  styles: [`
    .card {
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      padding: var(--spacing-lg);
      border-radius: 8px;
      box-shadow: 0 2px 8px var(--color-shadow);
      transition: background-color 0.3s, color 0.3s;
    }
  `]
})
export class DarkModeCardComponent {
  @Input() title = 'Card Title';
  @Input() content = 'Card content';
}
```

### Pattern 2: Reduced Motion

**Global Styles:** `src/styles.css`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Component with Animation:** `src/app/components/animated-box/animated-box.component.ts`

```typescript
@Component({
  selector: 'app-animated-box',
  template: `<div class="animated-box">{{ content }}</div>`,
  styles: [`
    .animated-box {
      width: 100px;
      height: 100px;
      background: #2196f3;
      border-radius: 4px;
      animation: slide 2s ease-in-out infinite;
    }

    @keyframes slide {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(100px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .animated-box {
        animation: none;
      }
    }
  `]
})
export class AnimatedBoxComponent {
  @Input() content = 'Animated';
}
```

### Pattern 3: Hover/Touch Detection

**Component:** `src/app/components/touch-aware-button/touch-aware-button.component.ts`

```typescript
@Component({
  selector: 'app-touch-aware-button',
  template: `
    <button 
      class="btn"
      (click)="onClick()"
      (touchend)="onTouchEnd()">
      {{ label }}
    </button>
  `,
  styles: [`
    .btn {
      padding: 10px 20px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }

    /* Desktop - mouse hover */
    @media (hover: hover) {
      .btn {
        min-width: 80px;
        min-height: 40px;
      }

      .btn:hover {
        background: #1976d2;
        transform: scale(1.05);
      }
    }

    /* Touch devices - no hover */
    @media (hover: none) {
      .btn {
        min-width: 48px;
        min-height: 48px;
        padding: 12px 24px;
        font-size: 16px;
      }

      .btn:active {
        background: #1565c0;
        transform: scale(0.98);
      }
    }

    /* Coarse pointer (touch) */
    @media (pointer: coarse) {
      .btn {
        padding: 14px 28px;
      }
    }

    /* Fine pointer (mouse/stylus) */
    @media (pointer: fine) {
      .btn {
        padding: 8px 16px;
      }
    }
  `]
})
export class TouchAwareButtonComponent {
  @Input() label = 'Button';
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }

  onTouchEnd() {
    console.log('Touch event');
  }
}
```

### Pattern 4: Print Styles

**Global Styles:** `src/styles.css`

```css
@media print {
  body {
    font-size: 12pt;
    background: white;
    color: black;
  }

  nav, .sidebar, .no-print, button {
    display: none !important;
  }

  .page-break {
    page-break-after: always;
  }

  .no-page-break {
    page-break-inside: avoid;
  }

  a[href]:after {
    content: " (" attr(href) ")";
  }

  img {
    max-width: 100%;
    page-break-inside: avoid;
  }
}
```

**Component:** `src/app/components/printable-content/printable-content.component.ts`

```typescript
@Component({
  selector: 'app-printable-content',
  template: `
    <div class="printable">
      <h1>{{ title }}</h1>
      <ng-content></ng-content>
      <button class="no-print" (click)="print()">Print</button>
    </div>
  `,
  styles: [`
    .printable {
      padding: var(--spacing-lg);
    }

    @media print {
      .printable {
        padding: 0;
        margin: 0;
      }
    }
  `]
})
export class PrintableContentComponent {
  @Input() title = 'Document';

  print() {
    window.print();
  }
}
```

### Pattern 5: High Contrast Mode

**Global Styles:** `src/styles.css`

```css
@media (prefers-contrast: more) {
  body {
    font-weight: 600;
  }

  button {
    border: 2px solid currentColor;
    font-weight: bold;
  }

  input, textarea {
    border: 2px solid currentColor;
  }
}
```

---

## 🔧 Implementation Steps

### Step 1: Add Dark Mode Meta Tag
**File:** `src/index.html`

```html
<head>
  <meta name="color-scheme" content="light dark">
</head>
```

### Step 2: Update Global Styles
Copy all CSS patterns above into `src/styles.css`

### Step 3: Create Theme Variables
**File:** `src/styles.css` - Add to `:root` selector:

```css
:root {
  /* Light theme */
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-bg-secondary: #f5f5f5;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark theme */
    --color-bg: #1e1e1e;
    --color-text: #ffffff;
    --color-bg-secondary: #2d2d2d;
  }
}
```

### Step 4: Create Theme Service (Optional)
```bash
ng generate service services/theme
```

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.darkModeSubject.next(e.matches);
      });
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
```

### Step 5: Test All Modes
- **Dark Mode:** DevTools > Rendering > Emulate CSS media feature prefers-color-scheme
- **Reduced Motion:** DevTools > Rendering > Emulate CSS media feature prefers-reduced-motion
- **Touch:** DevTools > More tools > Touch simulation
- **Print:** Ctrl+P or Cmd+P

---

## ✅ Media Query Checklist

- [ ] Dark mode variables in CSS
- [ ] Reduced motion respected
- [ ] Hover effects only with `@media (hover: hover)`
- [ ] Touch targets 48px+ for touch devices
- [ ] Print styles hide navigation
- [ ] All media queries tested
- [ ] No forced animations for motion-sensitive users

---

## 📊 Testing Commands

```bash
# Check dark mode
# DevTools > F12 > Rendering > Emulate CSS media feature prefers-color-scheme: dark

# Check reduced motion
# DevTools > F12 > Rendering > Emulate CSS media feature prefers-reduced-motion: reduce

# Check touch
# DevTools > F12 > More tools > Touch simulation

# Check print
# Ctrl+P or Cmd+P to open print preview
```

---

## 🔗 Next Steps

1. **Optimize images** → See: `5-optimize-images.md`
2. **Test performance** → See: `6-testing-performance.md`

---

## 📚 Reference Files

- `explanation/2-media-queries.md` - Media query theory
- `examples/2-media-queries.ts` - 8 media query examples

---

**Estimated Time:** 20-30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** `1-setup-responsive-project.md`
