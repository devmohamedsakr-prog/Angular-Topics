# Media Queries - Interview Q&A

## Question 1: What are media queries and how do they work?

**Answer:**

Media queries are CSS rules that apply styles based on device characteristics like screen size, resolution, orientation, and input method.

**Syntax:**
```css
@media (condition) {
  /* CSS rules applied when condition is true */
}
```

**Basic Example:**
```css
@media (min-width: 768px) {
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**How it works:**
1. Browser evaluates the media query condition
2. If TRUE: applies the CSS inside
3. If FALSE: ignores the CSS

**Performance Note:**
- All media queries are evaluated on every viewport change
- CSS inside is parsed even if not applied
- No performance penalty for unused media queries

---

## Question 2: What are media query operators?

**Answer:**

**1. and (AND logic):**
```css
/* Applies if BOTH conditions are true */
@media (min-width: 768px) and (orientation: landscape) {
  .layout { display: grid; }
}
```

**2. or (OR logic) - comma separated:**
```css
/* Applies if ANY condition is true */
@media (max-width: 600px), (orientation: portrait) {
  .layout { display: block; }
}
```

**3. not (NOT logic):**
```css
/* Applies if condition is NOT true */
@media not (min-width: 1200px) {
  .container { width: 100%; }
}
```

**4. only (for old browsers):**
```css
/* Ignored by older browsers */
@media only screen and (min-width: 768px) {
  .container { padding: 20px; }
}
```

**Complex Query Example:**
```css
/* Applies on tablets in portrait, or small phones */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait),
        (max-width: 480px) {
  .layout { display: flex; flex-direction: column; }
}
```

---

## Question 3: What media features can you query?

**Answer:**

**Viewport Dimensions:**
```css
@media (min-width: 768px) { }      /* >= 768px */
@media (max-width: 1024px) { }     /* <= 1024px */
@media (width: 800px) { }          /* Exact width */
@media (aspect-ratio: 16/9) { }    /* Aspect ratio */
```

**Device Characteristics:**
```css
@media (orientation: portrait) { }    /* Portrait vs landscape */
@media (orientation: landscape) { }
@media (monochrome) { }               /* Monochrome devices */
@media (color) { }                    /* Color devices */
@media (min-resolution: 2dppx) { }    /* High DPI (Retina) */
```

**Interaction Capabilities:**
```css
@media (hover: hover) { }             /* Has hover (mouse/trackpad) */
@media (hover: none) { }              /* No hover (touch only) */
@media (pointer: fine) { }            /* Fine pointer (mouse) */
@media (pointer: coarse) { }          /* Coarse pointer (touch) */
```

**System Preferences:**
```css
@media (prefers-color-scheme: dark) { }      /* Dark mode */
@media (prefers-color-scheme: light) { }     /* Light mode */
@media (prefers-reduced-motion: reduce) { }  /* Accessibility */
@media (prefers-contrast: more) { }          /* High contrast */
```

**Viewport Height:**
```css
@media (min-height: 600px) { }               /* Min height */
@media (max-height: 500px) { }               /* Max height */
```

---

## Question 4: How do you detect and respond to dark mode preferences?

**Answer:**

**CSS Implementation:**
```css
/* Light mode (default) */
body {
  background: #ffffff;
  color: #000000;
}

.card {
  background: #f5f5f5;
  border: 1px solid #ddd;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body {
    background: #1e1e1e;
    color: #ffffff;
  }

  .card {
    background: #2d2d2d;
    border: 1px solid #444;
  }
}
```

**Angular Component:**
```typescript
@Component({
  selector: 'app-theme',
  template: `<div [class.dark-mode]="isDarkMode">Content</div>`,
  styles: [`
    :host {
      --bg: #fff;
      --text: #000;
    }

    :host(.dark-mode) {
      --bg: #1e1e1e;
      --text: #fff;
    }

    div {
      background: var(--bg);
      color: var(--text);
    }
  `]
})
export class ThemeComponent {
  isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
}
```

**JavaScript Detection:**
```typescript
// Check system preference
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listen to changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    // System switched to dark mode
  } else {
    // System switched to light mode
  }
});
```

**HTML Meta Tag (optional):**
```html
<meta name="color-scheme" content="light dark">
```

---

## Question 5: How do you detect and respect reduced motion preferences?

**Answer:**

**Why it matters:**
- Accessibility feature for motion sensitivity
- ~15% of users enable this setting
- Can prevent seizures and nausea

**CSS Implementation:**
```css
/* Normal motion (default) */
.animated {
  animation: slide 2s ease-in-out infinite;
}

@keyframes slide {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(100px); }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .animated {
    animation: none;
  }
}
```

**Angular Implementation:**
```typescript
@Component({
  selector: 'app-animation',
  template: `
    <div [class.animate]="!prefersReducedMotion">Animated Content</div>
  `,
  styles: [`
    .animate {
      animation: slide 2s ease-in-out;
    }

    @media (prefers-reduced-motion: reduce) {
      .animate {
        animation: none;
      }
    }
  `]
})
export class AnimationComponent {
  prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
}
```

**Best Practices:**
✅ Disable animations entirely (not just reduce speed)
✅ Test with reduced motion enabled
✅ Keep critical animations (loading spinners) but reduce easing
✅ Respect user choice above all

---

## Question 6: How do you handle print media?

**Answer:**

**Print Stylesheet:**
```css
@media print {
  /* Hide interactive elements */
  button, .nav, .sidebar {
    display: none;
  }

  /* Optimize for printing */
  body {
    font-size: 12pt;
    background: white;
    color: black;
  }

  /* Prevent page breaks */
  .card {
    page-break-inside: avoid;
  }

  /* Show URLs for links */
  a[href]:after {
    content: " (" attr(href) ")";
  }

  /* Optimize images */
  img {
    max-width: 100%;
    page-break-inside: avoid;
  }
}
```

**Angular Component:**
```typescript
@Component({
  selector: 'app-printable',
  template: `
    <div class="print-container">
      <h1>Report</h1>
      <div class="content">Content to print</div>
      <button onclick="window.print()" class="no-print">Print</button>
    </div>
  `,
  styles: [`
    .no-print {
      display: block;
    }

    @media print {
      .no-print {
        display: none;
      }

      .print-container {
        padding: 0;
        margin: 0;
      }

      h1 {
        page-break-after: avoid;
      }
    }
  `]
})
export class PrintableComponent {
  print() {
    window.print();
  }
}
```

**Best Practices:**
✅ Hide navigation, buttons, ads
✅ Use black text on white background
✅ Set font size (12pt for readability)
✅ Prevent unwanted page breaks
✅ Show URLs for external links
✅ Optimize images for print

---

## Question 7: How do you detect hover capability?

**Answer:**

**Why it matters:**
- Touch devices don't support hover
- Different UX for touch vs. mouse
- Prevents awkward interactions

**CSS Media Query:**
```css
/* Devices with hover capability (mouse, trackpad) */
@media (hover: hover) {
  button {
    transition: background 0.3s;
  }

  button:hover {
    background: #2196f3;
    cursor: pointer;
  }
}

/* Touch devices (no hover) */
@media (hover: none) {
  button {
    min-height: 48px;
    min-width: 48px;
  }

  button:active {
    background: #ddd;
  }
}
```

**JavaScript Detection:**
```typescript
const supportsHover = window.matchMedia('(hover: hover)').matches;

if (supportsHover) {
  // Show hover effects
} else {
  // Use active/touch states instead
}
```

**Angular Component:**
```typescript
@Component({
  selector: 'app-interactive-button',
  template: `<button [class.touch]="!supportsHover">Click</button>`,
  styles: [`
    button {
      padding: 10px 20px;
    }

    @media (hover: hover) {
      button:hover {
        background: #2196f3;
      }
    }

    button.touch {
      min-height: 48px;
      min-width: 48px;
    }
  `]
})
export class InteractiveButtonComponent {
  supportsHover = window.matchMedia('(hover: hover)').matches;
}
```

---

## Question 8: How do you detect pointer precision (coarse vs. fine)?

**Answer:**

**Pointer Types:**
```css
/* Fine pointer: mouse, stylus, trackpad */
@media (pointer: fine) {
  .button {
    width: 20px;
    height: 20px;
  }
}

/* Coarse pointer: finger, touch */
@media (pointer: coarse) {
  .button {
    width: 44px;
    height: 44px;
    padding: 12px;
  }
}

/* Combination pointer (both fine and coarse) */
@media (pointer: fine) and (pointer: coarse) {
  /* Hybrid device (mouse + touch) */
}
```

**JavaScript Detection:**
```typescript
// Check for coarse pointer
const isTouch = window.matchMedia('(pointer: coarse)').matches;

if (isTouch) {
  // Increase touch target size
  // Add more spacing
  // Use active states instead of hover
}
```

**Best Sizes:**
```
Fine pointer:  16-20px (mouse)
Coarse pointer: 44-48px (touch - Apple guideline)
```

---

## Question 9: How do you handle orientation changes?

**Answer:**

**CSS Approach:**
```css
/* Portrait (default) */
.layout {
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  height: 300px;
}

/* Landscape */
@media (orientation: landscape) {
  .layout {
    display: flex;
    flex-direction: row;
  }

  .content {
    width: 50%;
    height: 200px;
  }
}

/* Landscape with height constraint */
@media (orientation: landscape) and (max-height: 500px) {
  .content {
    height: 100px;
  }
}
```

**Angular Component:**
```typescript
@Component({
  selector: 'app-orientation',
  template: `<div [ngClass]="orientation">Content</div>`
})
export class OrientationComponent {
  orientation: string = 'portrait';

  @HostListener('window:orientationchange')
  onOrientationChange() {
    this.orientation = window.innerHeight > window.innerWidth
      ? 'portrait'
      : 'landscape';
  }
}
```

**JavaScript Approach:**
```typescript
const mediaQuery = window.matchMedia('(orientation: landscape)');

mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    console.log('Landscape');
  } else {
    console.log('Portrait');
  }
});
```

---

## Question 10: How do you test media queries and responsive design?

**Answer:**

**Browser DevTools:**
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test interactions
5. Check media query evaluation

**Manual Testing:**
```
Mobile Phones:
- iPhone 12 (390x844)
- Pixel 6 (412x915)
- Galaxy S20 (360x800)

Tablets:
- iPad (768x1024)
- iPad Pro (1024x1366)

Desktops:
- 1024x768 (older)
- 1280x720 (HD)
- 1920x1080 (Full HD)
- 2560x1440 (2K)
```

**Chrome DevTools Media Query Inspection:**
```css
/* Shows which media queries are active */
/* Useful for debugging breakpoint issues */
```

**CSS @supports for Feature Detection:**
```css
@supports (display: grid) {
  .container { display: grid; }
}

@supports not (display: grid) {
  .container { display: flex; }
}
```

**Testing Tools:**
- Chrome DevTools (built-in)
- Firefox DevTools
- BrowserStack (real devices)
- LambdaTest (cross-browser)
- Responsive Design Checker

**Best Practices:**
✅ Test on real devices
✅ Test all breakpoints
✅ Test orientation changes
✅ Test with touch
✅ Test with keyboard navigation
✅ Test with reduced motion enabled
✅ Test dark mode
✅ Test with network throttling
