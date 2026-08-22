// 4-grid-layouts.ts - CSS Grid Responsive Layout Examples

import { Component } from '@angular/core';

// Example 1: Basic Responsive Grid
@Component({
  selector: 'app-grid-basic',
  template: `
    <div class="grid-container">
      <div class="grid-item">Item 1</div>
      <div class="grid-item">Item 2</div>
      <div class="grid-item">Item 3</div>
      <div class="grid-item">Item 4</div>
    </div>
  `,
  styles: [`
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }

    .grid-item {
      background: #42a5f5;
      padding: 30px;
      border-radius: 4px;
      text-align: center;
      color: white;
      font-weight: bold;
    }

    @media (max-width: 600px) {
      .grid-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GridBasicComponent {}

// Example 2: Auto-Fit vs Auto-Fill
@Component({
  selector: 'app-grid-auto-fit-fill',
  template: `
    <div class="grid-section">
      <h3>auto-fit</h3>
      <div class="grid-auto-fit">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </div>

      <h3>auto-fill</h3>
      <div class="grid-auto-fill">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </div>
    </div>
  `,
  styles: [`
    .grid-section {
      padding: 20px;
    }

    h3 {
      margin-top: 20px;
    }

    .grid-auto-fit {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 10px;
      margin-bottom: 20px;
    }

    .grid-auto-fit > div {
      background: #66bb6a;
      padding: 20px;
      text-align: center;
    }

    .grid-auto-fill {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
    }

    .grid-auto-fill > div {
      background: #ef5350;
      padding: 20px;
      text-align: center;
    }
  `]
})
export class GridAutoFitFillComponent {}

// Example 3: Grid Areas
@Component({
  selector: 'app-grid-areas',
  template: `
    <div class="grid-layout">
      <header class="header">Header</header>
      <aside class="sidebar">Sidebar</aside>
      <main class="main">Main Content</main>
      <footer class="footer">Footer</footer>
    </div>
  `,
  styles: [`
    .grid-layout {
      display: grid;
      grid-template-columns: 200px 1fr;
      grid-template-rows: auto 1fr auto;
      gap: 15px;
      min-height: 100vh;
      padding: 15px;
      grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    }

    .header {
      grid-area: header;
      background: #333;
      color: white;
      padding: 20px;
      border-radius: 4px;
    }

    .sidebar {
      grid-area: sidebar;
      background: #f5f5f5;
      padding: 20px;
      border-radius: 4px;
    }

    .main {
      grid-area: main;
      background: #fff;
      padding: 20px;
      border-radius: 4px;
    }

    .footer {
      grid-area: footer;
      background: #333;
      color: white;
      padding: 20px;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .grid-layout {
        grid-template-columns: 1fr;
        grid-template-areas:
          "header"
          "sidebar"
          "main"
          "footer";
      }
    }
  `]
})
export class GridAreasComponent {}

// Example 4: Responsive Grid Gallery
@Component({
  selector: 'app-grid-gallery',
  template: `
    <div class="gallery">
      <div class="gallery-item" *ngFor="let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]">
        <img src="placeholder-{{ i }}.jpg" alt="Gallery item {{ i }}">
        <p>Item {{ i }}</p>
      </div>
    </div>
  `,
  styles: [`
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      padding: 20px;
    }

    .gallery-item {
      background: #f5f5f5;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .gallery-item:hover {
      transform: scale(1.05);
    }

    .gallery-item img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .gallery-item p {
      padding: 10px;
      text-align: center;
      margin: 0;
    }

    @media (max-width: 768px) {
      .gallery {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }

    @media (max-width: 480px) {
      .gallery {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class GridGalleryComponent {}

// Example 5: Grid with Explicit Rows
@Component({
  selector: 'app-grid-explicit',
  template: `
    <div class="grid-container">
      <div class="grid-item">1</div>
      <div class="grid-item">2</div>
      <div class="grid-item">3</div>
      <div class="grid-item">4</div>
      <div class="grid-item">5</div>
      <div class="grid-item">6</div>
    </div>
  `,
  styles: [`
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 100px;
      gap: 15px;
      padding: 20px;
    }

    .grid-item {
      background: #ab47bc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .grid-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .grid-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GridExplicitComponent {}

// Example 6: CSS Grid with Asymmetric Layout
@Component({
  selector: 'app-grid-asymmetric',
  template: `
    <div class="grid-layout">
      <div class="item featured">Featured</div>
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
      <div class="item">4</div>
    </div>
  `,
  styles: [`
    .grid-layout {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      padding: 20px;
    }

    .item {
      background: #1976d2;
      padding: 30px;
      border-radius: 4px;
      color: white;
      text-align: center;
      font-weight: bold;
    }

    .item.featured {
      grid-column: 1 / -1;
      background: #f57f17;
    }

    @media (max-width: 600px) {
      .grid-layout {
        grid-template-columns: 1fr;
      }

      .item.featured {
        grid-column: 1;
      }
    }
  `]
})
export class GridAsymmetricComponent {}

// Example 7: Grid Responsive Table
@Component({
  selector: 'app-grid-table',
  template: `
    <div class="grid-table">
      <div class="table-header">Name</div>
      <div class="table-header">Email</div>
      <div class="table-header">Role</div>

      <div class="table-cell">John Doe</div>
      <div class="table-cell">john@example.com</div>
      <div class="table-cell">Admin</div>

      <div class="table-cell">Jane Smith</div>
      <div class="table-cell">jane@example.com</div>
      <div class="table-cell">User</div>

      <div class="table-cell">Bob Johnson</div>
      <div class="table-cell">bob@example.com</div>
      <div class="table-cell">Editor</div>
    </div>
  `,
  styles: [`
    .grid-table {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: #ddd;
      margin: 20px;
      border-radius: 4px;
      overflow: hidden;
    }

    .table-header {
      background: #1976d2;
      color: white;
      padding: 15px;
      font-weight: bold;
    }

    .table-cell {
      background: white;
      padding: 15px;
      border-bottom: 1px solid #ddd;
    }

    @media (max-width: 768px) {
      .grid-table {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .grid-table {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GridTableComponent {}

// Example 8: Clamp with Grid Gap
@Component({
  selector: 'app-grid-clamp',
  template: `
    <div class="grid-clamp">
      <div class="item" *ngFor="let i of [1, 2, 3, 4]">Item {{ i }}</div>
    </div>
  `,
  styles: [`
    .grid-clamp {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: clamp(10px, 2vw, 30px);
      padding: clamp(15px, 3vw, 40px);
    }

    .item {
      background: #26a69a;
      padding: clamp(15px, 3vw, 30px);
      border-radius: 4px;
      text-align: center;
      color: white;
      font-weight: bold;
    }
  `]
})
export class GridClampComponent {}
