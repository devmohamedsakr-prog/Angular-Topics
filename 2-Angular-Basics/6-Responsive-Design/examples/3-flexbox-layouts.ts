// 3-flexbox-layouts.ts - Flexbox Responsive Layout Examples

import { Component } from '@angular/core';

// Example 1: Basic Responsive Flexbox
@Component({
  selector: 'app-flex-basic',
  template: `
    <div class="flex-container">
      <div class="flex-item">Item 1</div>
      <div class="flex-item">Item 2</div>
      <div class="flex-item">Item 3</div>
    </div>
  `,
  styles: [`
    .flex-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      width: 100%;
    }

    .flex-item {
      flex: 1 1 250px;
      padding: 20px;
      background: #64b5f6;
      border-radius: 4px;
      text-align: center;
      color: white;
    }

    @media (max-width: 768px) {
      .flex-container {
        flex-direction: column;
      }

      .flex-item {
        flex: 1 1 100%;
      }
    }
  `]
})
export class FlexBasicComponent {}

// Example 2: Navbar with Flexbox
@Component({
  selector: 'app-flex-navbar',
  template: `
    <nav class="navbar">
      <div class="nav-logo">Logo</div>
      <ul class="nav-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div class="nav-toggle">☰</div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: #333;
      color: white;
    }

    .nav-logo {
      font-weight: bold;
      font-size: 24px;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 30px;
      margin: 0;
      padding: 0;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      transition: color 0.3s;
    }

    .nav-menu a:hover {
      color: #2196f3;
    }

    .nav-toggle {
      display: none;
      font-size: 24px;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .navbar {
        flex-wrap: wrap;
      }

      .nav-menu {
        display: none;
        flex-basis: 100%;
        flex-direction: column;
        gap: 10px;
        padding: 15px 0;
      }

      .nav-menu.active {
        display: flex;
      }

      .nav-toggle {
        display: block;
      }
    }
  `]
})
export class FlexNavbarComponent {}

// Example 3: Flexbox Card Grid
@Component({
  selector: 'app-flex-card-grid',
  template: `
    <div class="cards-container">
      <div class="card" *ngFor="let i of [1, 2, 3, 4, 5, 6]">
        <div class="card-header">Card {{ i }}</div>
        <div class="card-body">Content for card {{ i }}</div>
        <div class="card-footer">Footer</div>
      </div>
    </div>
  `,
  styles: [`
    .cards-container {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      padding: 20px;
    }

    .card {
      flex: 1 1 calc(33.333% - 20px);
      display: flex;
      flex-direction: column;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card-header {
      padding: 15px;
      background: #2196f3;
      color: white;
      font-weight: bold;
    }

    .card-body {
      flex: 1;
      padding: 15px;
    }

    .card-footer {
      padding: 10px 15px;
      background: #f5f5f5;
      border-top: 1px solid #ddd;
    }

    @media (max-width: 1024px) {
      .card {
        flex: 1 1 calc(50% - 20px);
      }
    }

    @media (max-width: 600px) {
      .card {
        flex: 1 1 100%;
      }
    }
  `]
})
export class FlexCardGridComponent {}

// Example 4: Sidebar Layout with Flexbox
@Component({
  selector: 'app-flex-sidebar',
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h3>Sidebar</h3>
        <ul>
          <li>Menu Item 1</li>
          <li>Menu Item 2</li>
          <li>Menu Item 3</li>
        </ul>
      </aside>
      <main class="main-content">
        <h1>Main Content</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      gap: 20px;
      min-height: 100vh;
      padding: 20px;
    }

    .sidebar {
      flex: 0 0 250px;
      background: #f5f5f5;
      padding: 20px;
      border-radius: 4px;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background: white;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .layout {
        flex-direction: column;
      }

      .sidebar {
        flex: 0 0 auto;
        order: 2;
      }

      .main-content {
        order: 1;
      }
    }
  `]
})
export class FlexSidebarComponent {}

// Example 5: Flexbox Centering
@Component({
  selector: 'app-flex-center',
  template: `
    <div class="flex-center">
      <div class="centered-content">
        <h2>Centered Content</h2>
        <p>This is centered both horizontally and vertically</p>
      </div>
    </div>
  `,
  styles: [`
    .flex-center {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      background: #e3f2fd;
    }

    .centered-content {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class FlexCenterComponent {}

// Example 6: Flexbox Gap and Alignment
@Component({
  selector: 'app-flex-alignment',
  template: `
    <div class="flex-demo">
      <h3>Flex Direction: Row</h3>
      <div class="flex-row">
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </div>

      <h3>Flex Direction: Column</h3>
      <div class="flex-column">
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </div>

      <h3>Justify Content: Space-Between</h3>
      <div class="flex-space-between">
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </div>

      <h3>Align Items: Center</h3>
      <div class="flex-align-center">
        <div>Short</div>
        <div>This is a longer item</div>
        <div>Medium</div>
      </div>
    </div>
  `,
  styles: [`
    .flex-demo {
      padding: 20px;
    }

    .flex-demo > div {
      display: flex;
      gap: 10px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .flex-demo > div > div {
      padding: 10px 15px;
      background: #2196f3;
      color: white;
      border-radius: 4px;
      min-width: 40px;
      text-align: center;
    }

    .flex-row {
      flex-direction: row;
    }

    .flex-column {
      flex-direction: column;
    }

    .flex-space-between {
      justify-content: space-between;
    }

    .flex-align-center {
      align-items: center;
    }

    h3 {
      margin-top: 20px;
      margin-bottom: 10px;
    }
  `]
})
export class FlexAlignmentComponent {}

// Example 7: Responsive Flex Basis
@Component({
  selector: 'app-flex-basis',
  template: `
    <div class="flex-container">
      <div class="item-1">Item 1</div>
      <div class="item-2">Item 2</div>
      <div class="item-3">Item 3</div>
    </div>
  `,
  styles: [`
    .flex-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }

    .item-1 {
      flex: 2 1 200px;
      background: #ffeb3b;
      padding: 20px;
      border-radius: 4px;
    }

    .item-2 {
      flex: 1 1 200px;
      background: #81c784;
      padding: 20px;
      border-radius: 4px;
    }

    .item-3 {
      flex: 1 1 200px;
      background: #ff7043;
      padding: 20px;
      border-radius: 4px;
    }

    @media (max-width: 600px) {
      .flex-container {
        flex-direction: column;
      }

      .item-1, .item-2, .item-3 {
        flex: 1 1 100%;
      }
    }
  `]
})
export class FlexBasisComponent {}

// Example 8: Hero Section with Flexbox
@Component({
  selector: 'app-flex-hero',
  template: `
    <div class="hero">
      <div class="hero-content">
        <h1>Welcome to Our Site</h1>
        <p>This is a hero section built with Flexbox</p>
        <button class="hero-btn">Get Started</button>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .hero-content {
      text-align: center;
      color: white;
      flex: 0 0 500px;
    }

    .hero-content h1 {
      font-size: clamp(24px, 5vw, 48px);
      margin-bottom: 10px;
    }

    .hero-content p {
      font-size: clamp(16px, 2vw, 20px);
      margin-bottom: 20px;
    }

    .hero-btn {
      padding: 12px 30px;
      font-size: 16px;
      border: none;
      background: white;
      color: #667eea;
      border-radius: 4px;
      cursor: pointer;
      transition: transform 0.3s;
    }

    .hero-btn:hover {
      transform: scale(1.05);
    }

    @media (max-width: 600px) {
      .hero {
        min-height: 300px;
      }

      .hero-content {
        flex: 1;
      }
    }
  `]
})
export class FlexHeroComponent {}
