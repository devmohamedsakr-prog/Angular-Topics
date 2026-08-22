# WCAG Accessibility Guide for Angular

## WCAG 2.1 Compliance Levels

- **A**: Basic minimum compliance
- **AA**: Enhanced compliance (recommended)
- **AAA**: Advanced compliance

---

## Semantic HTML

```html
<!-- ❌ Wrong -->
<div class="button" onclick="submit()">Click</div>

<!-- ✅ Correct -->
<button type="button" (click)="submit()">Click</button>

<!-- ❌ Wrong -->
<div class="heading">Page Title</div>

<!-- ✅ Correct -->
<h1>Page Title</h1>

<!-- ✅ Use header, nav, main, footer -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
```

---

## ARIA Labels and Attributes

```html
<!-- Provide descriptive labels -->
<label for="email-input">Email Address</label>
<input id="email-input" type="email">

<!-- ARIA labels when visual label not suitable -->
<button aria-label="Close menu">
  <mat-icon>close</mat-icon>
</button>

<!-- ARIA live regions -->
<div aria-live="polite" role="status">
  {{ statusMessage }}
</div>

<!-- ARIA describedby -->
<input aria-describedby="password-hint">
<p id="password-hint">Must be at least 8 characters</p>

<!-- ARIA expanded for dropdowns -->
<button [attr.aria-expanded]="isOpen" (click)="toggle()">
  Menu
</button>

<!-- ARIA hidden for decorative elements -->
<mat-icon aria-hidden="true">star</mat-icon>
```

---

## Keyboard Navigation

```typescript
// Implement keyboard shortcuts
@HostListener('keydown.escape')
onEscapeKey(): void {
  this.close();
}

@HostListener('keydown.enter')
onEnterKey(): void {
  this.submit();
}

// Tab order
<form>
  <input tabindex="0"> <!-- First -->
  <button tabindex="1"> <!-- Second -->
  <input tabindex="2"> <!-- Third -->
</form>

<!-- Skip to main content link -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<main id="main-content">...</main>
```

---

## Color Contrast

```scss
// Minimum contrast ratios
// AA: 4.5:1 for normal text, 3:1 for large text
// AAA: 7:1 for normal text, 4.5:1 for large text

// ✅ Good contrast
.text-primary {
  color: #212121; // Dark text
  background-color: #ffffff; // Light background
  // Contrast ratio: 21:1 (AAA compliant)
}

// ❌ Poor contrast
.text-gray {
  color: #999999;
  background-color: #f5f5f5;
  // Contrast ratio: ~2.3:1 (not compliant)
}

// Use tools to check: WebAIM Contrast Checker
```

---

## Form Accessibility

```html
<!-- Proper form structure -->
<form>
  <fieldset>
    <legend>Select your options</legend>
    
    <div>
      <input type="radio" id="option1" name="options" value="1">
      <label for="option1">Option 1</label>
    </div>
    
    <div>
      <input type="radio" id="option2" name="options" value="2">
      <label for="option2">Option 2</label>
    </div>
  </fieldset>

  <mat-form-field appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput type="email" required aria-required="true">
    <mat-error>Please enter valid email</mat-error>
  </mat-form-field>

  <button type="submit" [disabled]="form.invalid">
    Submit
  </button>
</form>
```

---

## Images and Icons

```html
<!-- Meaningful alt text -->
<img src="dog.jpg" alt="Brown dog playing in grass">

<!-- Decorative images -->
<img src="divider.jpg" alt="">

<!-- Icons with text alternative -->
<button>
  <mat-icon aria-hidden="true">search</mat-icon>
  <span>Search</span>
</button>

<!-- Icon-only button with aria-label -->
<button aria-label="Delete item">
  <mat-icon>delete</mat-icon>
</button>
```

---

## Focus Management

```typescript
// Maintain focus
@ViewChild('submitButton') submitButton: ElementRef;

submit(): void {
  // Do something
  this.submitButton.nativeElement.focus();
}

// Trap focus in modal
@Component({
  host: {
    'role': 'dialog',
    '[attr.aria-modal]': 'true',
    '[attr.aria-labelledby]': 'dialogTitle'
  }
})
export class ModalComponent {
  @ViewChild('firstButton') firstButton: ElementRef;
  @ViewChild('lastButton') lastButton: ElementRef;

  @HostListener('keydown.tab', ['$event'])
  onTabKey(event: KeyboardEvent): void {
    if (event.shiftKey) {
      if (document.activeElement === this.firstButton.nativeElement) {
        this.lastButton.nativeElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === this.lastButton.nativeElement) {
        this.firstButton.nativeElement.focus();
        event.preventDefault();
      }
    }
  }
}

:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

---

## Links and Text

```html
<!-- Descriptive link text -->
<!-- ❌ -->
<a href="/more">Learn more</a>

<!-- ✅ -->
<a href="/about">Learn more about our company</a>

<!-- Headings hierarchy -->
<h1>Page Title</h1>
<h2>Section 1</h2>
<h3>Subsection 1.1</h3>
<h2>Section 2</h2>

<!-- Text content -->
Don't rely only on color:
<span style="color: red">Error</span> <!-- ❌ -->

<span style="color: red">
  <mat-icon>error</mat-icon> Error
</span> <!-- ✅ -->
```

---

## Lists and Navigation

```html
<!-- Proper list structure -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>

<!-- Breadcrumb navigation -->
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Product Detail</li>
  </ol>
</nav>
```

---

## Testing for Accessibility

```typescript
// Axe DevTools for automated testing
import { AxeBuilder } from '@axe-core/react';

it('should have no accessibility violations', async () => {
  const results = await new AxeBuilder(page)
    .analyze();
  
  expect(results.violations).toHaveLength(0);
});

// Use WAVE browser extension
// Use Lighthouse in Chrome DevTools
// Use WebAIM contrast checker
```

---

## Accessibility Checklist

- [ ] All form fields have associated labels
- [ ] Color is not the only means of conveying information
- [ ] Images have alt text
- [ ] Links have descriptive text
- [ ] Heading hierarchy is logical
- [ ] Focus indicators are visible
- [ ] Page is keyboard navigable
- [ ] Contrast ratio meets WCAG AA (4.5:1)
- [ ] Form errors are clearly indicated
- [ ] Modal focus is trapped
- [ ] Content is readable (font size, line height)
- [ ] Page structure uses semantic HTML
- [ ] Videos have captions
- [ ] Buttons and links are distinguishable

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Accessibility](https://angular.io/guide/accessibility)
- [WebAIM](https://webaim.org/)
- [Accessibility Insights](https://accessibilityinsights.io/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

