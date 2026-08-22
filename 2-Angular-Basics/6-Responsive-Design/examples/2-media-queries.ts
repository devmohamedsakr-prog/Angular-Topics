// 2-media-queries.ts - Media Queries Examples

import { Component, HostListener, OnInit } from '@angular/core';

// Example 1: Mobile-First Media Queries
@Component({
  selector: 'app-mobile-first',
  template: `
    <div class="card">
      <h2>Mobile-First Design</h2>
      <p>This card uses mobile-first media queries for responsive layout.</p>
    </div>
  `,
  styles: [`
    .card {
      /* Base: Mobile styles */
      display: block;
      width: 100%;
      padding: 15px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    p {
      font-size: 14px;
      line-height: 1.5;
    }

    /* Tablets: 768px+ */
    @media (min-width: 768px) {
      .card {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px;
      }

      p {
        font-size: 16px;
      }
    }

    /* Desktops: 992px+ */
    @media (min-width: 992px) {
      .card {
        max-width: 1000px;
        margin: 0 auto;
        padding: 30px;
      }

      p {
        font-size: 18px;
      }
    }
  `]
})
export class MobileFirstComponent {}

// Example 2: Orientation Media Query
@Component({
  selector: 'app-orientation-aware',
  template: `
    <div class="orientation-layout">
      <h2>Orientation Detection</h2>
      <p>Content adapts based on device orientation.</p>
      <div class="content">Content area</div>
    </div>
  `,
  styles: [`
    .orientation-layout {
      padding: 20px;
    }

    /* Portrait (default) */
    .content {
      width: 100%;
      height: 300px;
      background: #bbdefb;
      border-radius: 4px;
    }

    /* Landscape */
    @media (orientation: landscape) {
      .orientation-layout {
        display: flex;
        align-items: center;
        gap: 20px;
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
  `]
})
export class OrientationAwareComponent {}

// Example 3: Print Media Query
@Component({
  selector: 'app-print-styles',
  template: `
    <div class="print-demo">
      <h2>Print-Friendly Content</h2>
      <p>This content is optimized for printing.</p>
      <button (click)="print()">Print This Page</button>
      <div class="print-only">ℹ️ This section only appears when printing</div>
      <div class="no-print">❌ This section is hidden when printing</div>
    </div>
  `,
  styles: [`
    .print-demo {
      padding: 20px;
    }

    .print-only {
      display: none;
    }

    .no-print {
      display: block;
    }

    @media print {
      body {
        font-size: 12pt;
        background: white;
      }

      .print-demo {
        page-break-inside: avoid;
      }

      .print-only {
        display: block;
        border: 1px solid #000;
        padding: 10px;
      }

      .no-print {
        display: none;
      }

      button {
        display: none;
      }

      a[href]:after {
        content: " (" attr(href) ")";
      }
    }
  `]
})
export class PrintStylesComponent {
  print() {
    window.print();
  }
}

// Example 4: Color and Resolution Media Queries
@Component({
  selector: 'app-color-resolution',
  template: `
    <div class="color-demo">
      <h2>Color & Resolution Detection</h2>
      <div class="high-res-image">Image (optimized for DPI)</div>
      <p class="color-text">Color support detection</p>
    </div>
  `,
  styles: [`
    .color-demo {
      padding: 20px;
    }

    .high-res-image {
      width: 200px;
      height: 200px;
      background: url('image-1x.png');
      background-size: cover;
    }

    /* High DPI / Retina displays */
    @media (min-resolution: 2dppx) {
      .high-res-image {
        background-image: url('image-2x.png');
      }
    }

    .color-text {
      color: #333;
    }

    /* Monochrome devices */
    @media (monochrome) {
      .color-text {
        color: black;
      }
    }

    /* Color devices */
    @media (color) {
      .color-text {
        color: #2196f3;
      }
    }
  `]
})
export class ColorResolutionComponent {}

// Example 5: Hover and Touch Capability
@Component({
  selector: 'app-hover-touch',
  template: `
    <div class="interaction-demo">
      <h2>Interaction Capability Detection</h2>
      <button class="interactive-button">Hover/Touch Me</button>
      <p class="interaction-info">Behavior adapts based on input method</p>
    </div>
  `,
  styles: [`
    .interaction-demo {
      padding: 20px;
    }

    .interactive-button {
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      background: #4caf50;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    /* Devices with hover capability (mouse, trackpad) */
    @media (hover: hover) {
      .interactive-button:hover {
        background: #45a049;
        transform: scale(1.05);
      }

      .interaction-info:before {
        content: '🖱️ ';
      }
    }

    /* Touch devices */
    @media (hover: none) {
      .interactive-button {
        min-height: 48px;
        min-width: 48px;
      }

      .interaction-info:before {
        content: '👆 ';
      }
    }

    /* Coarse pointer (touch) */
    @media (pointer: coarse) {
      .interactive-button {
        padding: 16px 32px;
        font-size: 18px;
      }
    }

    /* Fine pointer (mouse/stylus) */
    @media (pointer: fine) {
      .interactive-button {
        padding: 8px 16px;
        font-size: 14px;
      }
    }
  `]
})
export class HoverTouchComponent {}

// Example 6: Dark Mode Media Query
@Component({
  selector: 'app-dark-mode',
  template: `
    <div class="theme-wrapper">
      <h2>Dark Mode Support</h2>
      <p>Content automatically adapts to system theme preference.</p>
      <div class="card-theme">Card with theme adaptation</div>
    </div>
  `,
  styles: [`
    /* Light mode (default) */
    .theme-wrapper {
      background: #ffffff;
      color: #000000;
      padding: 20px;
      border-radius: 8px;
    }

    .card-theme {
      background: #f5f5f5;
      color: #333;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      .theme-wrapper {
        background: #1e1e1e;
        color: #ffffff;
      }

      .card-theme {
        background: #2d2d2d;
        color: #e0e0e0;
        border-color: #444;
      }
    }
  `]
})
export class DarkModeComponent {}

// Example 7: Reduced Motion Media Query
@Component({
  selector: 'app-reduced-motion',
  template: `
    <div class="animation-demo">
      <h2>Reduced Motion Support</h2>
      <div class="animated-box">Animated Box</div>
      <p>Animations respect user preferences</p>
    </div>
  `,
  styles: [`
    .animation-demo {
      padding: 20px;
    }

    .animated-box {
      width: 100px;
      height: 100px;
      background: #ff9800;
      border-radius: 4px;
      animation: slide 2s ease-in-out infinite;
    }

    @keyframes slide {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(100px); }
    }

    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .animated-box {
        animation: none;
      }

      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class ReducedMotionComponent {}

// Example 8: Complex Media Query
@Component({
  selector: 'app-complex-media',
  template: `
    <div class="complex-layout">
      <h2>Complex Media Query</h2>
      <p>Responds to multiple conditions simultaneously</p>
    </div>
  `,
  styles: [`
    .complex-layout {
      padding: 20px;
      background: #e1f5fe;
    }

    /* Mobile landscape */
    @media (max-width: 600px) and (orientation: landscape) {
      .complex-layout {
        background: #fff3e0;
      }
    }

    /* Tablet portrait */
    @media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
      .complex-layout {
        background: #f3e5f5;
      }
    }

    /* Desktop with hover */
    @media (min-width: 1200px) and (hover: hover) {
      .complex-layout {
        background: #e8f5e9;
        cursor: pointer;
      }
    }

    /* High resolution touch */
    @media (min-resolution: 2dppx) and (pointer: coarse) {
      .complex-layout {
        font-size: 18px;
      }
    }
  `]
})
export class ComplexMediaComponent {}
