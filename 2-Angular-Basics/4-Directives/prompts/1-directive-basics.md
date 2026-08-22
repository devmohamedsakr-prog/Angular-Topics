# Directive Basics & Types

**IDE Prompt:** Use this to understand and create Angular directives.

---

## 🎯 Task: Master Angular Directives

**When to use:** Manipulating DOM, adding behavior, and creating reusable logic.

---

## 📋 Checklist

- [ ] Understand directive types
- [ ] Use built-in structural directives (*ngIf, *ngFor)
- [ ] Use built-in attribute directives (ngClass, ngStyle)
- [ ] Create custom attribute directive
- [ ] Test directives

---

## 🚀 Step-by-Step

### Built-in Structural Directives
- **\*ngIf** - Add/remove elements
- **\*ngFor** - Loop arrays
- **\*ngSwitch** - Multiple conditions

### Built-in Attribute Directives
- **[ngClass]** - Dynamic classes
- **[ngStyle]** - Dynamic styles
- **[ngModel]** - Two-way binding

### Create Custom Directive

```bash
ng generate directive directives/highlight
```

```typescript
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight: string = 'yellow';

  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = this.appHighlight;
  }
}
```

**Usage:**
```html
<p [appHighlight]="'lightblue'">Highlighted text</p>
```

### With @HostListener

```typescript
import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHover]'
})
export class HoverDirective {
  @Input() appHover: string = 'yellow';
  @Input() defaultColor: string = 'white';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onHover() {
    this.el.nativeElement.style.backgroundColor = this.appHover;
  }

  @HostListener('mouseleave')
  onLeave() {
    this.el.nativeElement.style.backgroundColor = this.defaultColor;
  }
}
```

---

## ✅ Verification Checklist

- [ ] Built-in directives work
- [ ] Custom directive created
- [ ] @HostListener fires events
- [ ] No console errors

---

**Estimated Time:** 15-20 minutes | **Difficulty:** Intermediate | **Next:** `2-custom-directives.md`
