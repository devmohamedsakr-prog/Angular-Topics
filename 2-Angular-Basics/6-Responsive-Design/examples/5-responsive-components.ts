// 5-responsive-components.ts - Responsive Angular Components Examples

import { Component, Input, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Example 1: Responsive Card Component
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
        <button>Action</button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: box-shadow 0.3s;
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
      font-size: clamp(18px, 4vw, 24px);
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

    button {
      padding: clamp(8px, 1.5vw, 12px) clamp(15px, 2vw, 24px);
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ResponsiveCardComponent {
  @Input() title = 'Card Title';
  @Input() content = 'Card content goes here';
}

// Example 2: Breakpoint-Aware Component
@Component({
  selector: 'app-breakpoint-aware',
  template: `
    <div class="container" [ngClass]="'breakpoint-' + currentBreakpoint">
      <div class="content">
        <h2>Breakpoint: {{ currentBreakpoint }}</h2>
        <p>Width: {{ windowWidth }}px</p>
        <p *ngIf="currentBreakpoint === 'mobile'">📱 Mobile View</p>
        <p *ngIf="currentBreakpoint === 'tablet'">📱 Tablet View</p>
        <p *ngIf="currentBreakpoint === 'desktop'">🖥️ Desktop View</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      background: #e3f2fd;
      border-radius: 4px;
    }

    .breakpoint-mobile {
      background: #ffe0b2;
    }

    .breakpoint-tablet {
      background: #c8e6c9;
    }

    .breakpoint-desktop {
      background: #b3e5fc;
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      margin-top: 0;
    }
  `]
})
export class BreakpointAwareComponent implements OnInit {
  currentBreakpoint: string = '';
  windowWidth: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateBreakpoint();
  }

  ngOnInit() {
    this.updateBreakpoint();
  }

  private updateBreakpoint() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 768) {
      this.currentBreakpoint = 'mobile';
    } else if (this.windowWidth < 1024) {
      this.currentBreakpoint = 'tablet';
    } else {
      this.currentBreakpoint = 'desktop';
    }
  }
}

// Example 3: Responsive Image Gallery
@Component({
  selector: 'app-responsive-gallery',
  template: `
    <div class="gallery">
      <div class="gallery-item" *ngFor="let item of items">
        <img [src]="item.src" [alt]="item.alt" loading="lazy">
        <p>{{ item.title }}</p>
      </div>
    </div>
  `,
  styles: [`
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: clamp(10px, 2vw, 20px);
      padding: clamp(15px, 3vw, 30px);
    }

    .gallery-item {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s;
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

    .gallery-item p {
      padding: clamp(10px, 2vw, 15px);
      margin: 0;
      text-align: center;
      background: #f5f5f5;
    }
  `]
})
export class ResponsiveGalleryComponent {
  items = [
    { src: 'img1.jpg', alt: 'Gallery 1', title: 'Image 1' },
    { src: 'img2.jpg', alt: 'Gallery 2', title: 'Image 2' },
    { src: 'img3.jpg', alt: 'Gallery 3', title: 'Image 3' },
    { src: 'img4.jpg', alt: 'Gallery 4', title: 'Image 4' },
  ];
}

// Example 4: Responsive Navigation Component
@Component({
  selector: 'app-responsive-nav',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">MyApp</div>
        
        <button class="hamburger" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="nav-menu" [class.active]="isMenuOpen">
          <li><a href="#home" (click)="closeMenu()">Home</a></li>
          <li><a href="#about" (click)="closeMenu()">About</a></li>
          <li><a href="#services" (click)="closeMenu()">Services</a></li>
          <li><a href="#contact" (click)="closeMenu()">Contact</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #333;
      padding: 1rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .nav-logo {
      color: white;
      font-weight: bold;
      font-size: clamp(18px, 4vw, 24px);
    }

    .hamburger {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      flex-direction: column;
      gap: 5px;
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background: white;
      transition: 0.3s;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: clamp(1rem, 2vw, 2rem);
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

    @media (max-width: 768px) {
      .hamburger {
        display: flex;
      }

      .nav-menu {
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        flex-direction: column;
        background: #333;
        gap: 0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s;
      }

      .nav-menu.active {
        max-height: 400px;
      }

      .nav-menu li {
        padding: 1rem 20px;
        border-bottom: 1px solid #444;
      }
    }
  `]
})
export class ResponsiveNavComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}

// Example 5: Responsive Form Component
@Component({
  selector: 'app-responsive-form',
  template: `
    <form class="form-container">
      <div class="form-group">
        <label>Name</label>
        <input type="text" placeholder="Enter your name">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" placeholder="Enter your phone">
        </div>
      </div>

      <div class="form-group">
        <label>Message</label>
        <textarea placeholder="Enter your message" rows="5"></textarea>
      </div>

      <button type="submit" class="submit-btn">Submit</button>
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
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: clamp(10px, 2vw, 15px);
      font-size: clamp(14px, 2vw, 16px);
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
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

    .submit-btn:hover {
      background: #1976d2;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ResponsiveFormComponent {}

// Example 6: Responsive Modal Component
@Component({
  selector: 'app-responsive-modal',
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeModal()">×</button>
        <h2>Modal Dialog</h2>
        <p>This modal is responsive and works on all screen sizes.</p>
        <button (click)="closeModal()" class="modal-btn">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 8px;
      padding: clamp(20px, 5vw, 40px);
      max-width: 90vw;
      width: clamp(300px, 80vw, 600px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #999;
    }

    .close-btn:hover {
      color: #000;
    }

    .modal h2 {
      margin-top: 0;
      font-size: clamp(18px, 4vw, 24px);
    }

    .modal-btn {
      padding: clamp(10px, 2vw, 12px) clamp(20px, 3vw, 30px);
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ResponsiveModalComponent {
  isOpen = false;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }
}

// Example 7: Container Query Component
@Component({
  selector: 'app-container-query',
  template: `
    <div class="container-query-wrapper">
      <div class="card-container">
        <h3>Card Title</h3>
        <p>Content inside a container query-aware card.</p>
      </div>
    </div>
  `,
  styles: [`
    .container-query-wrapper {
      container-type: inline-size;
      width: 100%;
    }

    .card-container {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    @container (min-width: 400px) {
      .card-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
    }

    @container (min-width: 600px) {
      .card-container {
        display: grid;
        grid-template-columns: 2fr 1fr;
      }
    }
  `]
})
export class ContainerQueryComponent {}
