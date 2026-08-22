# Build Responsive Components

**IDE Prompt:** Use this when creating reusable responsive Angular components.

---

## 🎯 Task: Build Responsive Component Library

**When to use:** Creating reusable button, card, form, modal, and gallery components.

---

## 📋 Components to Build

- [ ] Responsive Card Component
- [ ] Responsive Button Component
- [ ] Responsive Form Component
- [ ] Responsive Modal Component
- [ ] Responsive Gallery Component

---

## 🚀 Component Patterns

### Component 1: Responsive Card

```bash
ng generate component components/responsive-card
```

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-responsive-card',
  template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="card-body">
        {{ content }}
      </div>
      <div class="card-footer">
        <button class="btn">{{ action }}</button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: box-shadow 0.3s ease;
    }

    .card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .card-header {
      background: #2196f3;
      color: white;
      padding: clamp(15px, 3vw, 25px);
    }

    .card-header h3 {
      margin: 0;
      font-size: clamp(16px, 3vw, 20px);
    }

    .card-body {
      padding: clamp(15px, 3vw, 25px);
      font-size: clamp(14px, 2vw, 16px);
      line-height: 1.6;
    }

    .card-footer {
      padding: clamp(10px, 2vw, 15px);
      background: #f5f5f5;
      text-align: right;
    }

    .btn {
      padding: clamp(8px, 1.5vw, 12px) clamp(15px, 2vw, 24px);
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: clamp(12px, 1.5vw, 14px);
      transition: background 0.3s;
    }

    .btn:hover {
      background: #1976d2;
    }

    @media (max-width: 600px) {
      .card-body { font-size: clamp(14px, 1vw, 16px); }
    }
  `]
})
export class ResponsiveCardComponent {
  @Input() title = 'Card Title';
  @Input() content = 'Card content goes here';
  @Input() action = 'Action';
}
```

**Usage:**
```html
<app-responsive-card
  title="My Card"
  content="This is card content"
  action="Learn More">
</app-responsive-card>
```

### Component 2: Responsive Button

```bash
ng generate component components/responsive-button
```

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-responsive-button',
  template: `
    <button 
      [class]="'btn btn-' + variant + ' btn-' + size"
      (click)="onClick()">
      {{ label }}
    </button>
  `,
  styles: [`
    .btn {
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-sm {
      padding: 8px 12px;
      font-size: 12px;
    }

    .btn-md {
      padding: clamp(10px, 1.5vw, 12px) clamp(16px, 2vw, 20px);
      font-size: clamp(13px, 1.2vw, 14px);
    }

    .btn-lg {
      padding: 14px 24px;
      font-size: 16px;
      min-height: 48px;
    }

    .btn-primary {
      background: #2196f3;
      color: white;
    }

    .btn-primary:hover {
      background: #1976d2;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-secondary:hover {
      background: #eee;
    }

    .btn-danger {
      background: #f44336;
      color: white;
    }

    .btn-danger:hover {
      background: #da190b;
    }

    @media (hover: none) {
      .btn { min-height: 48px; }
    }
  `]
})
export class ResponsiveButtonComponent {
  @Input() label = 'Button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
```

### Component 3: Responsive Form

```bash
ng generate component components/responsive-form
```

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-responsive-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
      <div class="form-group">
        <label for="name">Name</label>
        <input 
          id="name"
          type="text" 
          formControlName="name"
          placeholder="Enter your name">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            type="email" 
            formControlName="email"
            placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input 
            id="phone"
            type="tel" 
            formControlName="phone"
            placeholder="Enter your phone">
        </div>
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea 
          id="message"
          formControlName="message"
          placeholder="Enter your message"
          rows="5"></textarea>
      </div>

      <button type="submit" class="submit-btn" [disabled]="!form.valid">
        Submit
      </button>
    </form>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: clamp(15px, 3vw, 30px);
      background: #f5f5f5;
      border-radius: 8px;
    }

    .form-group {
      margin-bottom: clamp(15px, 2vw, 20px);
    }

    .form-group label {
      display: block;
      margin-bottom: clamp(5px, 1vw, 10px);
      font-weight: bold;
      font-size: clamp(13px, 1.5vw, 14px);
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: clamp(10px, 2vw, 15px);
      font-size: clamp(14px, 2vw, 16px);
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 4px rgba(33, 150, 243, 0.3);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: clamp(10px, 2vw, 20px);
    }

    .submit-btn {
      width: 100%;
      padding: clamp(12px, 2vw, 16px);
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: clamp(14px, 2vw, 16px);
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
    }

    .submit-btn:hover:not(:disabled) {
      background: #1976d2;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ResponsiveFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form data:', this.form.value);
    }
  }
}
```

### Component 4: Responsive Gallery

```bash
ng generate component components/responsive-gallery
```

```typescript
import { Component, Input } from '@angular/core';

interface GalleryItem { src: string; alt: string; title: string; }

@Component({
  selector: 'app-responsive-gallery',
  template: `
    <div class="gallery">
      <div class="gallery-item" *ngFor="let item of items">
        <img [src]="item.src" [alt]="item.alt" loading="lazy">
        <p class="gallery-title">{{ item.title }}</p>
      </div>
    </div>
  `,
  styles: [`
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: clamp(10px, 2vw, 20px);
      padding: clamp(15px, 3vw, 30px);
      width: 100%;
    }

    .gallery-item {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .gallery-item:hover {
      transform: scale(1.05);
    }

    .gallery-item img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }

    .gallery-title {
      padding: clamp(10px, 2vw, 15px);
      margin: 0;
      text-align: center;
      background: #f5f5f5;
      font-size: clamp(12px, 1.5vw, 14px);
    }

    @media (max-width: 768px) {
      .gallery {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .gallery-item img {
        height: 150px;
      }
    }

    @media (max-width: 480px) {
      .gallery {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ResponsiveGalleryComponent {
  @Input() items: GalleryItem[] = [];
}
```

---

## 🔧 Implementation Steps

### Step 1: Generate All Components
```bash
ng generate component components/responsive-card
ng generate component components/responsive-button
ng generate component components/responsive-form
ng generate component components/responsive-gallery
```

### Step 2: Copy Component Code
- Copy component code from patterns above
- Adjust styling and functionality as needed

### Step 3: Export from Shared Module
**File:** `src/app/shared/shared.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ResponsiveCardComponent } from '../components/responsive-card/responsive-card.component';
import { ResponsiveButtonComponent } from '../components/responsive-button/responsive-button.component';
import { ResponsiveFormComponent } from '../components/responsive-form/responsive-form.component';
import { ResponsiveGalleryComponent } from '../components/responsive-gallery/responsive-gallery.component';

@NgModule({
  declarations: [
    ResponsiveCardComponent,
    ResponsiveButtonComponent,
    ResponsiveFormComponent,
    ResponsiveGalleryComponent
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    ResponsiveCardComponent,
    ResponsiveButtonComponent,
    ResponsiveFormComponent,
    ResponsiveGalleryComponent
  ]
})
export class SharedModule {}
```

### Step 4: Use Components in App
```html
<app-responsive-card
  title="Card Title"
  content="Card content"
  action="Action">
</app-responsive-card>

<app-responsive-button
  label="Click Me"
  variant="primary"
  size="lg"
  (clicked)="handleClick()">
</app-responsive-button>

<app-responsive-form></app-responsive-form>

<app-responsive-gallery [items]="galleryItems"></app-responsive-gallery>
```

---

## ✅ Component Checklist

- [ ] Component has @Input properties for configuration
- [ ] Component has clamp() for fluid sizing
- [ ] Component handles mobile and desktop views
- [ ] Touch targets are 48px+ (for buttons)
- [ ] Component exported from SharedModule
- [ ] Hover effects only with `@media (hover: hover)`
- [ ] Responsive without breaking layouts

---

## 🔗 Next Steps

1. **Add media queries** → See: `4-media-queries.md`
2. **Optimize images** → See: `5-optimize-images.md`
3. **Test performance** → See: `6-testing-performance.md`

---

## 📚 Reference Files

- `explanation/4-responsive-components.md` - Component theory
- `examples/5-responsive-components.ts` - 7 ready-to-use components

---

**Estimated Time:** 30-40 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** `1-setup-responsive-project.md`, `2-create-layouts.md`
