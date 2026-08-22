# Optimize Images for Responsive Design

**IDE Prompt:** Use this when adding responsive images and optimizing for Core Web Vitals.

---

## 🎯 Task: Implement Responsive Image Strategy

**When to use:** Adding images that work on mobile, tablet, and desktop with optimal file sizes.

---

## 📋 Optimization Checklist

- [ ] Use responsive images with srcset
- [ ] Use picture element for art direction
- [ ] Implement lazy loading
- [ ] Use modern formats (WebP)
- [ ] Add aspect-ratio for image dimensions
- [ ] Optimize file sizes
- [ ] Serve appropriate sizes for viewport

---

## 🚀 Image Patterns

### Pattern 1: Responsive Image with srcset

**HTML Template:**

```html
<img
  src="assets/images/hero-800.jpg"
  srcset="
    assets/images/hero-400.jpg 400w,
    assets/images/hero-600.jpg 600w,
    assets/images/hero-800.jpg 800w,
    assets/images/hero-1200.jpg 1200w
  "
  sizes="
    (max-width: 480px) 100vw,
    (max-width: 768px) 100vw,
    (max-width: 1200px) 90vw,
    1200px
  "
  alt="Hero image description"
  loading="lazy">
```

**Component:** `src/app/components/responsive-image/responsive-image.component.ts`

```typescript
import { Component, Input } from '@angular/core';

interface ImageSource {
  width: number;
  src: string;
}

@Component({
  selector: 'app-responsive-image',
  template: `
    <div class="image-container">
      <img
        [src]="src"
        [srcset]="srcset"
        [sizes]="sizes"
        [alt]="alt"
        loading="lazy"
        class="responsive-img">
    </div>
  `,
  styles: [`
    .image-container {
      width: 100%;
      height: auto;
    }

    .responsive-img {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }
  `]
})
export class ResponsiveImageComponent {
  @Input() src = '';
  @Input() srcset = '';
  @Input() sizes = '(max-width: 768px) 100vw, 90vw';
  @Input() alt = 'Image';
}
```

**Usage:**

```html
<app-responsive-image
  src="assets/images/photo-800.jpg"
  srcset="
    assets/images/photo-400.jpg 400w,
    assets/images/photo-800.jpg 800w,
    assets/images/photo-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Product photo">
</app-responsive-image>
```

### Pattern 2: Picture Element for Art Direction

**HTML Template:**

```html
<picture>
  <!-- Mobile: 100vw at max-width 480px -->
  <source
    media="(max-width: 480px)"
    srcset="
      assets/images/hero-mobile-400.jpg 400w,
      assets/images/hero-mobile-600.jpg 600w
    "
    sizes="100vw">

  <!-- Tablet: 90vw at max-width 768px -->
  <source
    media="(max-width: 768px)"
    srcset="
      assets/images/hero-tablet-600.jpg 600w,
      assets/images/hero-tablet-900.jpg 900w
    "
    sizes="90vw">

  <!-- Desktop: 1200px fixed -->
  <source
    srcset="
      assets/images/hero-desktop-1200.jpg 1200w,
      assets/images/hero-desktop-1600.jpg 1600w
    "
    sizes="1200px">

  <!-- Fallback -->
  <img src="assets/images/hero-default.jpg" alt="Hero image">
</picture>
```

**Component:** `src/app/components/adaptive-image/adaptive-image.component.ts`

```typescript
import { Component, Input } from '@angular/core';

interface ResponsiveSource {
  media: string;
  srcset: string;
  sizes: string;
}

@Component({
  selector: 'app-adaptive-image',
  template: `
    <picture>
      <source
        *ngFor="let source of sources"
        [media]="source.media"
        [srcset]="source.srcset"
        [sizes]="source.sizes">
      <img
        [src]="fallbackSrc"
        [alt]="alt"
        loading="lazy"
        class="adaptive-img">
    </picture>
  `,
  styles: [`
    .adaptive-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
  `]
})
export class AdaptiveImageComponent {
  @Input() sources: ResponsiveSource[] = [];
  @Input() fallbackSrc = '';
  @Input() alt = 'Image';
}
```

### Pattern 3: Modern Image Formats with Fallback

**HTML Template:**

```html
<picture>
  <!-- WebP format (modern browsers) -->
  <source
    type="image/webp"
    srcset="
      assets/images/photo-400.webp 400w,
      assets/images/photo-800.webp 800w,
      assets/images/photo-1200.webp 1200w
    "
    sizes="(max-width: 768px) 100vw, 50vw">

  <!-- AVIF format (newest) -->
  <source
    type="image/avif"
    srcset="
      assets/images/photo-400.avif 400w,
      assets/images/photo-800.avif 800w,
      assets/images/photo-1200.avif 1200w
    "
    sizes="(max-width: 768px) 100vw, 50vw">

  <!-- JPEG fallback -->
  <source
    type="image/jpeg"
    srcset="
      assets/images/photo-400.jpg 400w,
      assets/images/photo-800.jpg 800w,
      assets/images/photo-1200.jpg 1200w
    "
    sizes="(max-width: 768px) 100vw, 50vw">

  <img
    src="assets/images/photo-800.jpg"
    alt="Photo description"
    loading="lazy"
    class="responsive-img">
</picture>
```

**Component:** `src/app/components/optimized-image/optimized-image.component.ts`

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-optimized-image',
  template: `
    <picture>
      <source
        type="image/webp"
        [srcset]="webpSrcset"
        [sizes]="sizes">
      <source
        type="image/jpeg"
        [srcset]="jpgSrcset"
        [sizes]="sizes">
      <img
        [src]="fallback"
        [alt]="alt"
        loading="lazy"
        class="optimized-img">
    </picture>
  `,
  styles: [`
    .optimized-img {
      width: 100%;
      height: auto;
      display: block;
    }
  `]
})
export class OptimizedImageComponent {
  @Input() webpSrcset = '';
  @Input() jpgSrcset = '';
  @Input() fallback = '';
  @Input() sizes = '(max-width: 768px) 100vw, 50vw';
  @Input() alt = 'Image';
}
```

### Pattern 4: Image Gallery with Lazy Loading

**Component:** `src/app/components/lazy-gallery/lazy-gallery.component.ts`

```typescript
import { Component, Input } from '@angular/core';

interface GalleryImage {
  thumb: string;
  src: string;
  srcset: string;
  alt: string;
}

@Component({
  selector: 'app-lazy-gallery',
  template: `
    <div class="gallery">
      <figure class="gallery-item" *ngFor="let image of images">
        <img
          [src]="image.thumb"
          [srcset]="image.srcset"
          [alt]="image.alt"
          loading="lazy"
          class="gallery-img">
        <figcaption>{{ image.alt }}</figcaption>
      </figure>
    </div>
  `,
  styles: [`
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      width: 100%;
    }

    .gallery-item {
      margin: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .gallery-item:hover {
      transform: scale(1.05);
    }

    .gallery-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
      aspect-ratio: 1;
    }

    figcaption {
      padding: var(--spacing-sm);
      text-align: center;
      font-size: clamp(12px, 1.5vw, 14px);
      background: #f5f5f5;
    }

    @media (max-width: 768px) {
      .gallery-img {
        height: 150px;
      }
    }
  `]
})
export class LazyGalleryComponent {
  @Input() images: GalleryImage[] = [];
}
```

### Pattern 5: Aspect Ratio Wrapper

**Component:** `src/app/components/aspect-ratio-image/aspect-ratio-image.component.ts`

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-aspect-ratio-image',
  template: `
    <div class="aspect-ratio-wrapper" [style.--aspect-ratio]="'var(--ar-' + ratio + ')'">
      <img
        [src]="src"
        [alt]="alt"
        loading="lazy"
        class="aspect-image">
    </div>
  `,
  styles: [`
    :host {
      --ar-1-1: 1;
      --ar-4-3: 1.333;
      --ar-16-9: 1.778;
      --ar-16-10: 1.6;
      --ar-3-2: 1.5;
    }

    .aspect-ratio-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: var(--aspect-ratio);
      overflow: hidden;
      border-radius: 8px;
    }

    .aspect-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `]
})
export class AspectRatioImageComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() ratio: '1-1' | '4-3' | '16-9' | '16-10' | '3-2' = '16-9';
}
```

---

## 🔧 Image Optimization Steps

### Step 1: Prepare Image Assets

```bash
# Create image directory
mkdir -p src/assets/images

# Optimize existing images
# Use tools: ImageOptim, TinyPNG, Squoosh, or ImageMagick
```

### Step 2: Generate Multiple Sizes

**Using ImageMagick:**

```bash
# Create responsive sizes
convert hero.jpg -resize 400x hero-400.jpg
convert hero.jpg -resize 800x hero-800.jpg
convert hero.jpg -resize 1200x hero-1200.jpg

# Create WebP versions
cwebp hero-400.jpg -o hero-400.webp
cwebp hero-800.jpg -o hero-800.webp
cwebp hero-1200.jpg -o hero-1200.webp
```

### Step 3: Add Images to Components

Generate image component:

```bash
ng generate component components/responsive-image
```

### Step 4: Use Images in Templates

```html
<app-responsive-image
  src="assets/images/photo-800.jpg"
  srcset="
    assets/images/photo-400.jpg 400w,
    assets/images/photo-800.jpg 800w,
    assets/images/photo-1200.jpg 1200w
  "
  alt="My photo">
</app-responsive-image>
```

---

## ✅ Image Optimization Checklist

- [ ] All images use responsive sizes (srcset)
- [ ] Picture element used for art direction
- [ ] WebP format available with JPEG fallback
- [ ] Lazy loading implemented (loading="lazy")
- [ ] Appropriate aspect-ratio set
- [ ] File sizes optimized (< 100KB for thumbnails)
- [ ] Alt text provided for all images
- [ ] LCP (Largest Contentful Paint) optimized
- [ ] CLS (Cumulative Layout Shift) prevented with aspect-ratio

---

## 📊 File Size Guidelines

```
Thumbnail (100x100):   < 20KB
Small (400x400):       < 50KB
Medium (600x600):      < 80KB
Large (1200x1200):     < 150KB
Hero (1920x1080):      < 300KB
```

---

## 🔗 Next Steps

1. **Test performance** → See: `6-testing-performance.md`

---

## 📚 Reference Files

- `explanation/5-testing-performance.md` - Image optimization theory
- `examples/5-responsive-components.ts` - Gallery examples

---

**Estimated Time:** 20-30 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** `1-setup-responsive-project.md`
