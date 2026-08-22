// 1-responsive-basics.ts - Responsive Design Fundamentals Examples

import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';

// Example 1: Basic Responsive Container
@Component({
  selector: 'app-responsive-container',
  template: `
    <div class="container">
      <h1>Responsive Container</h1>
      <p>This container adapts to different screen sizes.</p>
    </div>
  `,
  styles: [`
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    @media (max-width: 768px) {
      .container {
        padding: 15px;
        max-width: 100%;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 10px;
      }
    }
  `]
})
export class ResponsiveContainerComponent {}

// Example 2: Fluid Typography
@Component({
  selector: 'app-fluid-typography',
  template: `
    <div class="typography">
      <h1>Heading 1 - Fluid Size</h1>
      <h2>Heading 2 - Fluid Size</h2>
      <p>Body text that scales with viewport. This paragraph uses clamp() to maintain readability across all devices.</p>
      <small>Small text for captions.</small>
    </div>
  `,
  styles: [`
    .typography {
      padding: 20px;
    }

    h1 {
      font-size: clamp(24px, 5vw, 48px);
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: clamp(20px, 4vw, 36px);
      margin-bottom: 0.8rem;
    }

    p {
      font-size: clamp(16px, 2vw, 20px);
      line-height: 1.6;
      max-width: 65ch;
    }

    small {
      font-size: clamp(12px, 1.5vw, 14px);
    }
  `]
})
export class FluidTypographyComponent {}

// Example 3: Viewport Meta Tag
@Component({
  selector: 'app-viewport-config',
  template: `<p>Viewport configuration is set in index.html</p>`
})
export class ViewportConfigComponent {}

// Viewport configuration (goes in index.html):
/*
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
*/

// Example 4: Breakpoint Service
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

@Component({
  selector: 'app-breakpoint-service',
  template: `
    <div class="breakpoint-info">
      <p>Current Breakpoint: <strong>{{ currentBreakpoint }}</strong></p>
      <p>Viewport Width: <strong>{{ windowWidth }}px</strong></p>
      <p>Is Mobile: <strong>{{ isMobile }}</strong></p>
    </div>
  `,
  styles: [`
    .breakpoint-info {
      padding: 20px;
      background: #e3f2fd;
      border-radius: 4px;
      font-family: monospace;
    }
  `]
})
export class BreakpointServiceComponent implements OnInit {
  currentBreakpoint: string = '';
  windowWidth: number = 0;
  isMobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateBreakpoint();
  }

  ngOnInit() {
    this.updateBreakpoint();
  }

  private updateBreakpoint() {
    this.windowWidth = window.innerWidth;

    if (this.windowWidth >= BREAKPOINTS.xxl) {
      this.currentBreakpoint = 'xxl (≥1400px)';
    } else if (this.windowWidth >= BREAKPOINTS.xl) {
      this.currentBreakpoint = 'xl (≥1200px)';
    } else if (this.windowWidth >= BREAKPOINTS.lg) {
      this.currentBreakpoint = 'lg (≥992px)';
    } else if (this.windowWidth >= BREAKPOINTS.md) {
      this.currentBreakpoint = 'md (≥768px)';
    } else if (this.windowWidth >= BREAKPOINTS.sm) {
      this.currentBreakpoint = 'sm (≥576px)';
    } else {
      this.currentBreakpoint = 'xs (<576px)';
    }

    this.isMobile = this.windowWidth < BREAKPOINTS.md;
  }
}

// Example 5: CSS Units Demo
@Component({
  selector: 'app-css-units',
  template: `
    <div class="units-demo">
      <div class="pixel-box">Pixel Box (200px)</div>
      <div class="percent-box">Percent Box (50%)</div>
      <div class="em-box">EM Box (2em)</div>
      <div class="rem-box">REM Box (3rem)</div>
      <div class="vw-box">VW Box (50vw)</div>
    </div>
  `,
  styles: [`
    .units-demo {
      padding: 20px;
      font-family: monospace;
    }

    div {
      margin: 10px 0;
      padding: 10px;
      background: #ddd;
      border-radius: 4px;
    }

    .pixel-box {
      width: 200px;
    }

    .percent-box {
      width: 50%;
    }

    .em-box {
      width: 2em;
      font-size: 1em;
    }

    .rem-box {
      width: 3rem;
    }

    .vw-box {
      width: 50vw;
    }
  `]
})
export class CssUnitsComponent {}

// Example 6: Responsive Spacing with CSS Variables
@Component({
  selector: 'app-responsive-spacing',
  template: `
    <div class="spacing-demo">
      <div class="component">Component with responsive spacing</div>
      <div class="component">Another component</div>
      <div class="component">Third component</div>
    </div>
  `,
  styles: [`
    :host {
      --spacing-xs: clamp(4px, 1vw, 12px);
      --spacing-sm: clamp(8px, 1.5vw, 16px);
      --spacing-md: clamp(16px, 2vw, 24px);
      --spacing-lg: clamp(24px, 3vw, 36px);
    }

    .spacing-demo {
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .component {
      padding: var(--spacing-md);
      background: #e8f5e9;
      border-radius: 4px;
    }
  `]
})
export class ResponsiveSpacingComponent {}

// Example 7: Touch-Friendly Sizing
@Component({
  selector: 'app-touch-friendly',
  template: `
    <div class="buttons-container">
      <button class="touch-button">Touch Button 1</button>
      <button class="touch-button">Touch Button 2</button>
      <button class="touch-button">Touch Button 3</button>
    </div>
  `,
  styles: [`
    .buttons-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px;
    }

    .touch-button {
      /* Minimum 44px for touch targets */
      min-height: 44px;
      min-width: 44px;
      padding: 12px 20px;
      font-size: 16px;
      border: none;
      background: #2196f3;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .touch-button:hover {
      background: #1976d2;
    }

    .touch-button:active {
      transform: scale(0.98);
    }

    @media (hover: none) {
      /* Touch devices */
      .touch-button {
        min-height: 48px;
        padding: 16px 24px;
      }
    }
  `]
})
export class TouchFriendlyComponent {}

// Example 8: Responsive Display (Show/Hide)
@Component({
  selector: 'app-responsive-display',
  template: `
    <div class="layout">
      <div class="mobile-only">📱 Visible on Mobile Only</div>
      <div class="tablet-only">📱 Visible on Tablet Only</div>
      <div class="desktop-only">🖥️ Visible on Desktop Only</div>
      <div class="hide-mobile">Hidden on Mobile</div>
    </div>
  `,
  styles: [`
    .layout {
      padding: 20px;
    }

    div {
      padding: 10px;
      margin: 10px 0;
      background: #fff3cd;
      border-radius: 4px;
    }

    .mobile-only { display: block; }
    .tablet-only { display: none; }
    .desktop-only { display: none; }
    .hide-mobile { display: block; }

    @media (min-width: 576px) and (max-width: 991px) {
      .mobile-only { display: none; }
      .tablet-only { display: block; }
      .desktop-only { display: none; }
    }

    @media (min-width: 992px) {
      .mobile-only { display: none; }
      .tablet-only { display: none; }
      .desktop-only { display: block; }
      .hide-mobile { display: none; }
    }
  `]
})
export class ResponsiveDisplayComponent {}
