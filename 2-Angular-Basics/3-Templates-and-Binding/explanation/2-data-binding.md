# Data Binding

## Overview

Data binding connects component data to the template. Angular supports four types of binding: property, attribute, class, and style binding.

## Property Binding

Property binding sets an element's DOM property value.

### Basic Property Binding

```typescript
export class PropertyComponent {
  imageUrl = 'https://example.com/image.jpg';
  isDisabled = true;
  title = 'My Title';
  count = 42;
}
```

```html
<!-- Property binding syntax: [property]="expression" -->
<img [src]="imageUrl" />
<button [disabled]="isDisabled">Click me</button>
<input [value]="title" />
<div [innerText]="count"></div>

<!-- Equivalent to -->
<img src="{{ imageUrl }}" />  <!-- Less safe -->
```

### Common Property Bindings

```html
<!-- Image source -->
<img [src]="imagePath" [alt]="altText" />

<!-- Button state -->
<button [disabled]="isProcessing">Submit</button>

<!-- Input value -->
<input [value]="name" [placeholder]="hint" />

<!-- Element visibility (using hidden property) -->
<div [hidden]="isHidden">Hidden content</div>

<!-- Custom properties -->
<app-child [data]="myData"></app-child>

<!-- Text content -->
<p [innerText]="message"></p>
<p [innerHTML]="htmlContent"></p>  <!-- Use with caution -->

<!-- CSS classes -->
<div [className]="cssClass"></div>

<!-- Attributes vs Properties -->
<input [value]="currentValue" />        <!-- DOM property -->
<button [attr.aria-label]="label">OK</button>  <!-- HTML attribute -->
```

### Two-Way Property Reference

```html
<!-- Update component when property changes -->
<img [src]="imageUrl" />
<button [disabled]="isDisabled" (click)="isDisabled = false">Enable</button>
```

## Attribute Binding

When element properties don't exist, use attribute binding.

### When to Use Attribute Binding

```html
<!-- ARIA attributes (no DOM property) -->
<button [attr.aria-label]="buttonLabel">OK</button>
<div [attr.aria-hidden]="isHidden">Content</div>

<!-- Data attributes -->
<div [attr.data-id]="userId" [attr.data-type]="userType">User</div>

<!-- SVG attributes -->
<svg>
  <circle [attr.cx]="centerX" [attr.cy]="centerY" [attr.r]="radius" />
</svg>

<!-- Table headers and other custom attributes -->
<th [attr.colspan]="columnCount">Header</th>
```

### Attribute Binding Syntax

```typescript
export class AttributeComponent {
  buttonLabel = 'Submit';
  userId = 123;
  columnCount = 3;
}
```

```html
<!-- Attribute binding: [attr.attributeName]="expression" -->
<button [attr.aria-label]="buttonLabel">OK</button>
<div [attr.data-id]="userId">User info</div>
<table>
  <tr>
    <th [attr.colspan]="columnCount">Header</th>
  </tr>
</table>

<!-- Binding attributes with hyphens -->
<div [attr.data-test-id]="testId"></div>
```

## Class Binding

Add or remove CSS classes dynamically.

### Single Class Binding

```typescript
export class ClassComponent {
  isActive = true;
  isSelected = false;
  status = 'active';
}
```

```html
<!-- Single class: [class.className]="boolean" -->
<div [class.active]="isActive"></div>
<div [class.selected]="isSelected"></div>

<!-- Multiple single class bindings -->
<div [class.active]="isActive" [class.disabled]="isDisabled" [class.highlighted]="highlight">
  Content
</div>

<!-- CSS class in component -->
<style>
  .active { color: green; font-weight: bold; }
  .selected { background: lightblue; }
</style>
```

### Multiple Class Binding with Object

```html
<!-- Object syntax: [ngClass]="objectExpression" -->
<div [ngClass]="{ active: isActive, disabled: isDisabled, highlighted: highlight }">
  Content
</div>

<!-- More readable for many classes -->
<div [ngClass]="classMap">Content</div>
```

```typescript
export class NgClassComponent {
  isActive = true;
  isDisabled = false;
  highlight = true;

  // Computed class object
  get classMap() {
    return {
      active: this.isActive,
      disabled: this.isDisabled,
      highlighted: this.highlight
    };
  }
}
```

### Array of Classes

```html
<!-- Array syntax: [ngClass]="arrayExpression" -->
<div [ngClass]="['class1', 'class2', 'class3']">Content</div>

<!-- Conditional classes in array -->
<div [ngClass]="['base', isActive ? 'active' : 'inactive']">Content</div>

<!-- Dynamic array -->
<div [ngClass]="getClasses()">Content</div>
```

```typescript
export class ArrayClassComponent {
  activeClasses = ['container', 'visible'];

  getClasses(): string[] {
    return ['btn', this.isPrimary ? 'btn-primary' : 'btn-secondary'];
  }
}
```

### Class Binding Best Practices

```html
<!-- ✅ GOOD - Single important class -->
<button [class.loading]="isLoading">Submit</button>

<!-- ✅ GOOD - Multiple classes with object -->
<div [ngClass]="{ 'btn-primary': isPrimary, 'btn-large': isLarge }">
  Button
</div>

<!-- ✅ GOOD - Computed from method -->
<div [ngClass]="getClassObject()">Content</div>

<!-- ❌ AVOID - Complex logic in template -->
<div [ngClass]="{ 'cls1': a && b, 'cls2': c || d, 'cls3': !e }">Content</div>
```

## Style Binding

Set inline styles dynamically.

### Single Style Binding

```typescript
export class StyleComponent {
  textColor = 'red';
  fontSize = '16px';
  boxWidth = 200;
}
```

```html
<!-- Single style: [style.property]="expression" -->
<div [style.color]="textColor">Red text</div>
<p [style.font-size]="fontSize">Large text</p>
<div [style.width.px]="boxWidth">200px wide</div>

<!-- With units -->
<div [style.padding.em]="2">Padding</div>
<div [style.margin.%]="10">Margin</div>
```

### Multiple Styles with Object

```html
<!-- Object syntax: [ngStyle]="objectExpression" -->
<div [ngStyle]="{ color: textColor, fontSize: fontSize, fontWeight: 'bold' }">
  Styled text
</div>

<!-- More readable version -->
<div [ngStyle]="styleObject">Content</div>
```

```typescript
export class NgStyleComponent {
  textColor = 'blue';
  fontSize = '20px';

  // Computed style object
  get styleObject() {
    return {
      color: this.textColor,
      fontSize: this.fontSize,
      fontWeight: this.isBold ? 'bold' : 'normal',
      textDecoration: this.isUnderlined ? 'underline' : 'none'
    };
  }
}
```

### Style Binding with Units

```html
<!-- Explicit unit specification -->
<div [style.width.px]="100">100 pixels</div>
<div [style.padding.em]="2">2 em</div>
<div [style.margin.%]="5">5%</div>
<div [style.opacity]="0.5">50% opacity</div>

<!-- No unit suffix for unitless properties -->
<div [style.z-index]="10">Z-index</div>
<div [style.line-height]="1.5">Line height</div>
```

### Style Binding Best Practices

```html
<!-- ✅ GOOD - Simple single style -->
<button [style.background-color]="buttonColor">Click</button>

<!-- ✅ GOOD - Multiple styles with object -->
<div [ngStyle]="{ color: color, fontSize: size, fontWeight: weight }">
  Text
</div>

<!-- ✅ GOOD - Computed styles -->
<div [ngStyle]="getStyles()">Content</div>

<!-- ❌ AVOID - Complex calculations in template -->
<div [ngStyle]="{ width: (totalWidth - padding - border) + 'px' }">
  Content
</div>
```

## Binding Priority

When combining property, class, and style bindings:

```html
<!-- All can be used together -->
<div 
  [style.color]="textColor"
  [class.active]="isActive"
  [attr.aria-label]="label"
  [disabled]="isDisabled">
  Content
</div>
```

## Preventing XSS Attacks

Angular automatically sanitizes property binding values:

```typescript
export class SecurityComponent {
  userContent = '<script>alert("XSS")</script>';
  trustedContent = this.sanitizer.sanitize(SecurityContext.HTML, userContent);
}
```

```html
<!-- Safe - automatically escaped -->
<div [innerText]="userContent"></div>

<!-- NOT RECOMMENDED - bypasses security -->
<!-- <div [innerHTML]="userContent"></div> -->

<!-- Use DomSanitizer for trusted HTML -->
<div [innerHTML]="trustedContent"></div>
```

## Performance Optimization

```html
<!-- ❌ BAD - Recomputes every change detection -->
<div [ngClass]="getClasses()">Content</div>

<!-- ✅ GOOD - Pre-computed property -->
<div [ngClass]="computedClasses">Content</div>

<!-- ❌ BAD - Object created every time -->
<div [ngStyle]="{ color: color, size: size }">Content</div>

<!-- ✅ GOOD - Cached object -->
<div [ngStyle]="cachedStyleObject">Content</div>
```

## Key Takeaways

- **Property binding** - Sets DOM properties `[prop]="expr"`
- **Attribute binding** - Sets HTML attributes `[attr.name]="expr"`
- **Class binding** - Toggle CSS classes `[class.name]="bool"`
- **Style binding** - Set inline styles `[style.prop]="expr"`
- Angular **sanitizes** all bindings by default
- Always use **safe navigation** `?.`
- Cache **computed values** for performance
- Use **[ngClass]** and **[ngStyle]** for multiple bindings
