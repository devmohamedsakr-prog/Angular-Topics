/**
 * Angular Responsive Design Examples
 * 
 * Covers:
 * - Responsive layouts with Flexbox/Grid
 * - Media queries and breakpoints
 * - Angular CDK breakpoint observer
 * - Touch-friendly UI patterns
 * - Responsive components with forms
 * - Adaptive images
 */

import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

// ============================================================================
// 1. RESPONSIVE LAYOUT WITH FLEXBOX
// ============================================================================

/**
 * Responsive container using Flexbox
 */
@Component({
  selector: 'app-flexbox-layout',
  template: `
    <div class="container">
      <div class="header">
        <h1>Responsive App</h1>
      </div>
      <div class="main-content">
        <aside class="sidebar" *ngIf="showSidebar">
          <nav>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </aside>
        <main class="content">
          <article>Main content goes here</article>
        </main>
      </div>
      <footer class="footer">
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      gap: 16px;
    }

    .header {
      background: #3367D6;
      color: white;
      padding: 16px;
    }

    .main-content {
      display: flex;
      flex: 1;
      gap: 16px;
      padding: 0 16px;
    }

    .sidebar {
      width: 250px;
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
    }

    .content {
      flex: 1;
      min-width: 0;
    }

    .footer {
      background: #f5f5f5;
      padding: 16px;
      text-align: center;
      border-top: 1px solid #ddd;
    }

    /* Mobile: Hide sidebar, stack vertically */
    @media (max-width: 768px) {
      .main-content {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        order: -1;
      }
    }

    /* Tablet: Show sidebar, horizontal layout */
    @media (min-width: 768px) {
      .main-content {
        flex-direction: row;
      }
    }

    /* Desktop: Wider layout */
    @media (min-width: 1024px) {
      .main-content {
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }
    }
  `]
})
export class FlexboxLayoutComponent {
  showSidebar = true;
}

// ============================================================================
// 2. RESPONSIVE GRID LAYOUT
// ============================================================================

/**
 * Responsive grid layout with CSS Grid
 */
@Component({
  selector: 'app-grid-layout',
  template: `
    <div class="grid-container">
      <div class="card" *ngFor="let item of items">
        <div class="card-header">{{ item.title }}</div>
        <div class="card-body">{{ item.description }}</div>
      </div>
    </div>
  `,
  styles: [`
    .grid-container {
      display: grid;
      gap: 16px;
      padding: 16px;
      grid-auto-rows: minmax(200px, auto);
    }

    /* Mobile: 1 column */
    @media (max-width: 480px) {
      .grid-container {
        grid-template-columns: 1fr;
      }
    }

    /* Tablet: 2 columns */
    @media (min-width: 481px) and (max-width: 768px) {
      .grid-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Small Desktop: 3 columns */
    @media (min-width: 769px) and (max-width: 1024px) {
      .grid-container {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Large Desktop: 4 columns */
    @media (min-width: 1025px) {
      .grid-container {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      background: #3367D6;
      color: white;
      padding: 12px;
      font-weight: 600;
    }

    .card-body {
      padding: 12px;
    }
  `]
})
export class GridLayoutComponent {
  items = [
    { title: 'Card 1', description: 'Content 1' },
    { title: 'Card 2', description: 'Content 2' },
    { title: 'Card 3', description: 'Content 3' },
    { title: 'Card 4', description: 'Content 4' },
    { title: 'Card 5', description: 'Content 5' },
    { title: 'Card 6', description: 'Content 6' }
  ];
}

// ============================================================================
// 3. CDK BREAKPOINT OBSERVER
// ============================================================================

/**
 * Component using Angular CDK for responsive behavior
 */
@Component({
  selector: 'app-breakpoint-responsive',
  template: `
    <div>
      <div *ngIf="isMobile" class="mobile-view">
        <p>Mobile View (< 768px)</p>
        <button (click)="toggleMenu()">Menu</button>
        <nav *ngIf="menuOpen" class="mobile-menu">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>
      </div>

      <div *ngIf="!isMobile" class="desktop-view">
        <p>Desktop View (>= 768px)</p>
        <nav class="desktop-menu">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .mobile-view, .desktop-view {
      padding: 16px;
    }

    .mobile-menu {
      margin-top: 16px;
      background: #f5f5f5;
      padding: 8px;
      border-radius: 4px;
    }

    .desktop-menu {
      background: white;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 8px;
    }

    a {
      color: #3367D6;
      text-decoration: none;
    }
  `]
})
export class BreakpointResponsiveComponent implements OnInit, OnDestroy {
  isMobile = false;
  menuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    // Predefined breakpoints
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: BreakpointState) => {
        this.isMobile = result.matches;
        if (!this.isMobile) {
          this.menuOpen = false; // Close menu on desktop
        }
      });

    // Custom breakpoint
    this.breakpointObserver
      .observe('(min-width: 1440px)')
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          console.log('Large desktop view');
        }
      });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// 4. RESPONSIVE FORM WITH LAYOUT
// ============================================================================

/**
 * Responsive form component
 */
@Component({
  selector: 'app-responsive-form',
  template: `
    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-layout">
        <div class="form-row">
          <div class="form-col">
            <label>First Name</label>
            <input 
              type="text" 
              formControlName="firstName"
              placeholder="Enter first name">
          </div>
          <div class="form-col">
            <label>Last Name</label>
            <input 
              type="text" 
              formControlName="lastName"
              placeholder="Enter last name">
          </div>
        </div>

        <div class="form-row">
          <div class="form-col">
            <label>Email</label>
            <input 
              type="email" 
              formControlName="email"
              placeholder="Enter email">
          </div>
        </div>

        <div class="form-row">
          <div class="form-col">
            <label>Message</label>
            <textarea 
              formControlName="message"
              placeholder="Enter message"
              rows="4"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Submit</button>
          <button type="reset" class="btn-secondary">Reset</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 100%;
      padding: 16px;
    }

    .form-layout {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .form-row {
      display: grid;
      gap: 16px;
      margin-bottom: 16px;
    }

    /* Mobile: Stack vertically */
    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }

    /* Tablet & Desktop: Two columns */
    @media (min-width: 601px) {
      .form-row {
        grid-template-columns: repeat(2, 1fr);
      }

      .form-row:last-child {
        grid-template-columns: 1fr;
      }
    }

    .form-col {
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    input, textarea {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      font-family: inherit;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #3367D6;
      box-shadow: 0 0 0 3px rgba(51, 103, 214, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      min-width: 120px;
    }

    .btn-primary {
      background: #3367D6;
      color: white;
    }

    .btn-secondary {
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }

    /* Mobile: Full width buttons */
    @media (max-width: 600px) {
      button {
        flex: 1;
        min-width: 100px;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ResponsiveFormComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      message: ['']
    });
  }

  ngOnInit() {}

  onSubmit() {
    console.log(this.form.value);
  }
}

// ============================================================================
// 5. RESPONSIVE NAVIGATION
// ============================================================================

/**
 * Responsive navigation component
 */
@Component({
  selector: 'app-responsive-nav',
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>MyApp</h1>
        </div>

        <button class="hamburger" (click)="toggleMenu()" *ngIf="isMobile">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="nav-menu" [class.active]="menuOpen">
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
      background: #3367D6;
      padding: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .nav-brand h1 {
      margin: 0;
      color: white;
      font-size: 24px;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 32px;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.3s;
    }

    .nav-menu a:hover {
      opacity: 0.8;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      gap: 6px;
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background: white;
      border-radius: 2px;
      transition: 0.3s;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(8px, 8px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -7px);
    }

    /* Mobile */
    @media (max-width: 768px) {
      .hamburger {
        display: flex;
      }

      .nav-menu {
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        flex-direction: column;
        background: #3367D6;
        gap: 0;
        padding: 0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }

      .nav-menu.active {
        max-height: 300px;
      }

      .nav-menu li {
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      .nav-menu a {
        display: block;
        padding: 16px;
      }
    }
  `]
})
export class ResponsiveNavComponent implements OnInit {
  isMobile = false;
  menuOpen = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe('(max-width: 768px)')
      .subscribe(result => {
        this.isMobile = result.matches;
        if (!this.isMobile) {
          this.menuOpen = false;
        }
      });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}

// ============================================================================
// 6. RESPONSIVE IMAGES WITH PICTURE ELEMENT
// ============================================================================

/**
 * Component with responsive image handling
 */
@Component({
  selector: 'app-responsive-images',
  template: `
    <div class="image-gallery">
      <picture class="hero-image">
        <source 
          media="(min-width: 1200px)"
          srcset="hero-1200w.webp 1200w, hero-1200w.jpg 1200w">
        <source 
          media="(min-width: 768px)"
          srcset="hero-768w.webp 768w, hero-768w.jpg 768w">
        <img 
          src="hero-400w.jpg"
          alt="Hero banner"
          loading="lazy"
          width="1200"
          height="400">
      </picture>

      <div class="gallery-grid">
        <img 
          *ngFor="let image of images"
          [src]="image.src"
          [alt]="image.alt"
          [srcset]="image.srcset"
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          width="300"
          height="200">
      </div>
    </div>
  `,
  styles: [`
    .image-gallery {
      padding: 16px;
    }

    .hero-image {
      display: block;
      width: 100%;
      margin-bottom: 32px;
    }

    .hero-image img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 8px;
    }

    .gallery-grid {
      display: grid;
      gap: 16px;
    }

    /* Mobile: 1 column */
    @media (max-width: 600px) {
      .gallery-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Tablet: 2 columns */
    @media (min-width: 601px) and (max-width: 1024px) {
      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Desktop: 3 columns */
    @media (min-width: 1025px) {
      .gallery-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      object-fit: cover;
    }
  `]
})
export class ResponsiveImagesComponent {
  images = [
    { 
      src: 'gallery-1.jpg',
      srcset: 'gallery-1-300w.jpg 300w, gallery-1-600w.jpg 600w, gallery-1-1200w.jpg 1200w',
      alt: 'Gallery image 1'
    },
    { 
      src: 'gallery-2.jpg',
      srcset: 'gallery-2-300w.jpg 300w, gallery-2-600w.jpg 600w, gallery-2-1200w.jpg 1200w',
      alt: 'Gallery image 2'
    },
    { 
      src: 'gallery-3.jpg',
      srcset: 'gallery-3-300w.jpg 300w, gallery-3-600w.jpg 600w, gallery-3-1200w.jpg 1200w',
      alt: 'Gallery image 3'
    }
  ];
}
