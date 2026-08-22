# Flexbox & CSS Grid - Responsive Layouts

Modern layout technologies for responsive design.

## Flexbox Basics

```css
/* Container */
.flex-container {
  display: flex;
  flex-direction: row; /* row, column, row-reverse, column-reverse */
  justify-content: flex-start; /* Horizontal alignment */
  align-items: flex-start; /* Vertical alignment */
  gap: 20px; /* Space between items */
  flex-wrap: wrap; /* Wrap items */
}

/* Items */
.flex-item {
  flex: 1; /* Grow equally */
  flex-basis: 200px; /* Base size */
  flex-grow: 1; /* Growth factor */
  flex-shrink: 1; /* Shrink factor */
}
```

## Responsive Flexbox

```css
/* Mobile: Stack vertically */
.layout {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sidebar { width: 100%; }
.main { width: 100%; }

/* Tablets: Side by side */
@media (min-width: 768px) {
  .layout {
    flex-direction: row;
    gap: 20px;
  }

  .sidebar { flex: 0 0 250px; }
  .main { flex: 1; }
}

/* Auto-fit wrap */
.grid-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.grid-item {
  flex: 1 1 calc(50% - 10px); /* 2 columns */
}

@media (min-width: 768px) {
  .grid-item {
    flex: 1 1 calc(33.333% - 14px); /* 3 columns */
  }
}
```

## CSS Grid Basics

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr; /* Two columns: 1:2 ratio */
  grid-template-rows: auto 1fr auto; /* Header, content, footer */
  gap: 20px;
  auto-flow: dense; /* Fill gaps intelligently */
}

.grid-item {
  grid-column: 1 / 2; /* Column span */
  grid-row: 1 / 2; /* Row span */
}
```

## Responsive Grid

```css
/* Mobile: Single column */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Tablets: 2 columns */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktops: 3 columns */
@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Auto-fit columns (modern approach) */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Auto-fill (always fills grid) */
.grid-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

## Grid Named Areas

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
}

header { grid-area: header; }
.sidebar { grid-area: sidebar; }
main { grid-area: main; }
footer { grid-area: footer; }

/* Responsive layout */
@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

## Flexbox vs Grid

| Aspect | Flexbox | Grid |
|--------|---------|------|
| Dimension | 1D (row/column) | 2D (rows & columns) |
| Content-driven | Yes | Layout-driven |
| Best for | Navigation, lists | Layouts, pages |
| Nesting | Multiple levels | Simple levels |
| Alignment | Flexible | Precise |

## Best Practices

✅ Use Flexbox for 1D layouts
✅ Use Grid for 2D layouts
✅ Combine both techniques
✅ Use auto-fit/auto-fill for responsive
✅ Test on various devices
✅ Use gap instead of margins
✅ Use minmax() for flexibility
✅ Consider subgrid for nesting
