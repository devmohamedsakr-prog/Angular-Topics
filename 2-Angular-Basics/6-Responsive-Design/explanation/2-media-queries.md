# Media Queries - Complete Guide

Master media queries for responsive design adaptation across all devices.

## Media Query Syntax

```css
@media (condition) {
  /* CSS rules */
}

/* Multiple conditions */
@media (min-width: 768px) and (max-width: 1024px) {
  /* CSS rules */
}

/* OR condition */
@media (max-width: 600px), (orientation: landscape) {
  /* CSS rules */
}

/* NOT condition */
@media not screen and (color) {
  /* CSS rules */
}
```

## Common Media Query Features

### Width-Based
```css
/* Minimum width */
@media (min-width: 768px) { }

/* Maximum width */
@media (max-width: 767px) { }

/* Exact width range */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Mobile first pattern */
@media (min-width: 576px) { }
@media (min-width: 768px) { }
@media (min-width: 992px) { }
@media (min-width: 1200px) { }
```

### Orientation
```css
/* Portrait orientation */
@media (orientation: portrait) {
  body { flex-direction: column; }
}

/* Landscape orientation */
@media (orientation: landscape) {
  body { flex-direction: row; }
}
```

### Display Features
```css
/* Color devices */
@media (color) { }

/* Monochrome devices */
@media (monochrome) { }

/* High DPI/Retina */
@media (min-resolution: 2dppx) {
  background-image: url('image-2x.jpg');
}

/* Hover capability */
@media (hover: hover) {
  button:hover { background: blue; }
}

/* Touch devices */
@media (hover: none) {
  button { padding: 20px; /* Larger touch target */ }
}

/* Pointer type */
@media (pointer: coarse) {
  /* Touch input */
}

@media (pointer: fine) {
  /* Mouse/stylus input */
}
```

### Aspect Ratio
```css
@media (aspect-ratio: 16/9) { }

@media (min-aspect-ratio: 1/1) {
  /* Square or wider */
}

@media (max-aspect-ratio: 16/9) {
  /* More square */
}
```

## Mobile-First Media Queries

```css
/* Base: Mobile styles */
.container {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding: 10px;
}

/* Small devices: 576px+ */
@media (min-width: 576px) {
  .container { font-size: 15px; }
}

/* Tablets: 768px+ */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    font-size: 16px;
    padding: 15px;
  }
}

/* Desktops: 992px+ */
@media (min-width: 992px) {
  .container {
    font-size: 18px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Large desktops: 1200px+ */
@media (min-width: 1200px) {
  .container {
    font-size: 20px;
    max-width: 1400px;
  }
}
```

## Desktop-First Media Queries (Desktop Down)

```css
/* Base: Desktop styles */
.sidebar {
  width: 25%;
  float: left;
  display: block;
}

/* Tablets and down: max 768px */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    float: none;
    margin-bottom: 20px;
  }
}

/* Mobile: max 600px */
@media (max-width: 600px) {
  .sidebar {
    padding: 10px;
  }
}
```

## Complex Media Queries

```css
/* Multiple conditions (AND) */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  body { background: blue; }
}

/* Multiple selectors (OR) */
@media (max-width: 600px), (orientation: portrait) and (max-width: 800px) {
  .menu { display: none; }
}

/* High DPI and color */
@media (min-resolution: 2dppx) and (color) {
  img { image-rendering: -webkit-optimize-contrast; }
}

/* Touch and landscape */
@media (hover: none) and (orientation: landscape) {
  button { min-height: 44px; }
}
```

## Print Media Queries

```css
/* Print-specific styles */
@media print {
  body { font-size: 12pt; }
  .no-print { display: none; }
  a[href]:after { content: " (" attr(href) ")"; }
  a { text-decoration: underline; }
  page-break-after: always;
}
```

## Dark Mode Media Query

```css
/* Light mode (default) */
body {
  background: white;
  color: black;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #fff;
  }

  img {
    opacity: 0.9;
  }
}
```

## Reduced Motion

```css
/* Animations */
.box {
  animation: slide 1s ease-in-out;
}

/* Disable for users preferring reduced motion */
@media (prefers-reduced-motion: reduce) {
  .box {
    animation: none;
    transition: none;
  }
}
```

## Best Practices

✅ Mobile-first approach (easier to enhance)
✅ Logical breakpoint ordering
✅ Test on real devices
✅ Use standard breakpoints
✅ Combine with CSS Grid/Flexbox
✅ Consider touch devices
✅ Test print styles
✅ Support dark mode
✅ Respect user preferences
