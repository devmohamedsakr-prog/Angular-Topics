/**
 * Product List Component - E-Commerce System
 * Displays products with filtering, search, sorting, and pagination
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  map,
  tap,
  shareReplay,
} from 'rxjs/operators';
import { ProductService } from '../services/product.service';
import {
  Product,
  ProductFilter,
  ProductSearchResult,
  ProductCategory,
} from '../models/product.model';

/**
 * Product list component
 */
@Component({
  selector: 'app-product-list',
  template: `
    <div class="product-list-container">
      <!-- Header -->
      <header class="list-header">
        <h1>Products</h1>
        <p class="count">{{ (searchResult$ | async)?.total || 0 }} products</p>
      </header>

      <!-- Sidebar: Filters -->
      <aside class="filters-sidebar" [class.open]="showFilters">
        <div class="filter-header">
          <h2>Filters</h2>
          <button class="close-btn" (click)="closeFilters()" aria-label="Close filters">×</button>
        </div>

        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="filter-form">
          <!-- Search -->
          <div class="filter-group">
            <label for="search">Search</label>
            <input
              id="search"
              type="text"
              formControlName="search"
              placeholder="Search products..."
              class="filter-input"
            />
          </div>

          <!-- Category -->
          <div class="filter-group">
            <label for="category">Category</label>
            <select id="category" formControlName="category" class="filter-input">
              <option value="">All Categories</option>
              <option *ngFor="let cat of categories$ | async" [value]="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Price Range -->
          <div class="filter-group">
            <label>Price Range</label>
            <div class="price-inputs">
              <input
                type="number"
                formControlName="priceMin"
                placeholder="Min"
                class="filter-input"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                formControlName="priceMax"
                placeholder="Max"
                class="filter-input"
                min="0"
              />
            </div>
          </div>

          <!-- Rating -->
          <div class="filter-group">
            <label for="rating">Minimum Rating</label>
            <select id="rating" formControlName="rating" class="filter-input">
              <option [value]="null">Any Rating</option>
              <option [value]="4">4+ Stars</option>
              <option [value]="3">3+ Stars</option>
              <option [value]="2">2+ Stars</option>
              <option [value]="1">1+ Stars</option>
            </select>
          </div>

          <!-- In Stock -->
          <div class="filter-group">
            <label>
              <input type="checkbox" formControlName="inStock" />
              In Stock Only
            </label>
          </div>

          <!-- Buttons -->
          <div class="filter-actions">
            <button type="submit" class="btn btn-primary">Apply Filters</button>
            <button type="button" class="btn btn-secondary" (click)="resetFilters()">
              Reset
            </button>
          </div>
        </form>
      </aside>

      <!-- Main Content -->
      <main class="products-main">
        <!-- Toolbar -->
        <div class="toolbar">
          <button class="filter-toggle" (click)="toggleFilters()" [class.active]="showFilters">
            ☰ Filters
          </button>

          <!-- Sorting -->
          <div class="sort-controls">
            <label for="sort">Sort by:</label>
            <select id="sort" formControl="sortControl" class="sort-select">
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <!-- View Toggle -->
          <div class="view-toggle">
            <button
              class="view-btn"
              [class.active]="viewMode === 'grid'"
              (click)="viewMode = 'grid'"
              aria-label="Grid view"
            >
              ⊞
            </button>
            <button
              class="view-btn"
              [class.active]="viewMode === 'list'"
              (click)="viewMode = 'list'"
              aria-label="List view"
            >
              ≡
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading$ | async" class="loading">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error$ | async as error" class="error">
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="retry()">Retry</button>
        </div>

        <!-- Products Grid -->
        <div *ngIf="(searchResult$ | async) as result" class="products-grid" [class]="viewMode">
          <ng-container *ngIf="result.products.length > 0; else noProducts">
            <product-card
              *ngFor="let product of result.products; trackBy: trackByProductId"
              [product]="product"
              (click)="selectProduct(product)"
            ></product-card>
          </ng-container>

          <ng-template #noProducts>
            <div class="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          </ng-template>
        </div>

        <!-- Pagination -->
        <div
          *ngIf="(searchResult$ | async) as result"
          class="pagination"
          [hidden]="result.pageSize >= result.total"
        >
          <button
            class="btn"
            (click)="previousPage()"
            [disabled]="result.page === 1"
          >
            ← Previous
          </button>

          <span class="page-info">
            Page {{ result.page }} of {{ getTotalPages(result) }}
          </span>

          <button
            class="btn"
            (click)="nextPage()"
            [disabled]="!result.hasMore"
          >
            Next →
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .product-list-container {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 24px;
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .list-header {
        grid-column: 1 / -1;
        border-bottom: 2px solid #eee;
        padding-bottom: 16px;
        margin-bottom: 16px;
      }

      .list-header h1 {
        margin: 0 0 8px 0;
        font-size: 28px;
      }

      .count {
        margin: 0;
        color: #666;
        font-size: 14px;
      }

      /* Sidebar */
      .filters-sidebar {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .filter-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .filter-group label {
        font-weight: 600;
        font-size: 14px;
      }

      .filter-input,
      .sort-select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .price-inputs {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .price-inputs input {
        flex: 1;
      }

      /* Main */
      .products-main {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .toolbar {
        display: flex;
        gap: 16px;
        align-items: center;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 4px;
      }

      .filter-toggle {
        display: none;
        padding: 8px 12px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
      }

      .sort-controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .view-toggle {
        display: flex;
        gap: 4px;
        margin-left: auto;
      }

      .view-btn {
        padding: 8px 12px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
      }

      .view-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }

      /* Products Grid */
      .products-grid {
        display: grid;
        gap: 16px;
      }

      .products-grid.grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }

      .products-grid.list {
        grid-template-columns: 1fr;
      }

      .no-products {
        grid-column: 1 / -1;
        padding: 60px 20px;
        text-align: center;
        background: #f9f9f9;
        border-radius: 4px;
      }

      /* Pagination */
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        padding: 20px;
        border-top: 1px solid #eee;
      }

      .page-info {
        min-width: 120px;
        text-align: center;
      }

      /* Loading & Error */
      .loading,
      .error {
        grid-column: 1 / -1;
        padding: 40px;
        text-align: center;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .error {
        background: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 4px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .product-list-container {
          grid-template-columns: 1fr;
        }

        .filters-sidebar {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          z-index: 1000;
          padding: 16px;
          border-radius: 0 0 4px 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .filters-sidebar.open {
          display: flex;
        }

        .filter-toggle {
          display: block;
        }

        .products-grid.grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit, OnDestroy {
  // Forms
  filterForm: FormGroup;
  sortControl = new FormControl('name-asc');

  // Observables
  categories$ = this.productService.getCategories().pipe(shareReplay(1));
  searchResult$: Observable<ProductSearchResult>;
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  // State
  showFilters = false;
  viewMode: 'grid' | 'list' = 'grid';

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.filterForm = this.createFilterForm();
    this.searchResult$ = this.getSearchResult();
  }

  ngOnInit(): void {
    this.setupFiltersFromRoute();
    this.setupSortControl();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create filter form
   */
  private createFilterForm(): FormGroup {
    return this.fb.group({
      search: ['', Validators.maxLength(100)],
      category: [''],
      priceMin: [null, [Validators.min(0)]],
      priceMax: [null, [Validators.min(0)]],
      rating: [null],
      inStock: [false],
    });
  }

  /**
   * Get search result observable
   */
  private getSearchResult(): Observable<ProductSearchResult> {
    return combineLatest([
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
      this.sortControl.valueChanges.pipe(startWith('name-asc')),
    ]).pipe(
      tap(() => {
        this.loading$.next(true);
        this.error$.next(null);
      }),
      switchMap(([filterValue, sort]) => {
        const [sortBy, sortOrder] = sort.split('-');
        const filter: ProductFilter = {
          ...filterValue,
          sortBy: sortBy as any,
          sortOrder: sortOrder as any,
          page: 1,
          pageSize: 20,
        };
        return this.productService.searchProducts(filter);
      }),
      tap(() => this.loading$.next(false)),
      catchError((error) => {
        this.error$.next(error.message || 'Error loading products');
        this.loading$.next(false);
        return [{ products: [], total: 0 }] as any;
      }),
      shareReplay(1)
    );
  }

  /**
   * Setup filters from route query params
   */
  private setupFiltersFromRoute(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const formValue = {
          search: params['search'] || '',
          category: params['category'] || '',
          priceMin: params['priceMin'] ? parseInt(params['priceMin']) : null,
          priceMax: params['priceMax'] ? parseInt(params['priceMax']) : null,
          rating: params['rating'] ? parseInt(params['rating']) : null,
          inStock: params['inStock'] === 'true',
        };
        this.filterForm.patchValue(formValue, { emitEvent: false });
      });
  }

  /**
   * Setup sort control
   */
  private setupSortControl(): void {
    this.sortControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((sort) => {
        this.updateRoute();
      });
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    this.updateRoute();
    this.filterForm.markAsPristine();
  }

  /**
   * Reset filters
   */
  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      category: '',
      priceMin: null,
      priceMax: null,
      rating: null,
      inStock: false,
    });
    this.sortControl.setValue('name-asc');
    this.updateRoute();
  }

  /**
   * Toggle filters sidebar
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
   * Close filters sidebar
   */
  closeFilters(): void {
    this.showFilters = false;
  }

  /**
   * Select product
   */
  selectProduct(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  /**
   * Pagination
   */
  nextPage(): void {
    // Implementation for next page
  }

  previousPage(): void {
    // Implementation for previous page
  }

  /**
   * Retry on error
   */
  retry(): void {
    this.filterForm.updateValueAndValidity();
  }

  /**
   * Get total pages
   */
  getTotalPages(result: ProductSearchResult): number {
    return Math.ceil(result.total / result.pageSize);
  }

  /**
   * TrackBy function
   */
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  /**
   * Update route with filter params
   */
  private updateRoute(): void {
    const params: any = {};
    const formValue = this.filterForm.value;

    if (formValue.search) params['search'] = formValue.search;
    if (formValue.category) params['category'] = formValue.category;
    if (formValue.priceMin !== null) params['priceMin'] = formValue.priceMin;
    if (formValue.priceMax !== null) params['priceMax'] = formValue.priceMax;
    if (formValue.rating !== null) params['rating'] = formValue.rating;
    if (formValue.inStock) params['inStock'] = 'true';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  private catchError(arg0: (error: any) => (Observable<{ products: never[]; total: number; }> | Observable<ProductSearchResult>)) {
    throw new Error('Method not implemented.');
  }
}

// Stub: product-card component
@Component({
  selector: 'product-card',
  template: `
    <div class="product-card">
      <img [src]="product.thumbnail" [alt]="product.name" />
      <h3>{{ product.name }}</h3>
      <p class="price">${{ product.price }}</p>
      <div class="rating">
        ⭐ {{ product.rating }} ({{ product.reviewCount }})
      </div>
    </div>
  `,
  styles: [
    `
      .product-card {
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 12px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .product-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 4px;
      }
      h3 {
        margin: 8px 0 4px;
        font-size: 14px;
        font-weight: 600;
      }
      .price {
        margin: 4px 0;
        font-size: 16px;
        font-weight: 700;
        color: #007bff;
      }
      .rating {
        font-size: 12px;
        color: #666;
      }
    `,
  ],
})
export class ProductCardComponent {
  @Input() product!: Product;

  @Output() click = new EventEmitter<Product>();
}

import { Input, Output, EventEmitter } from '@angular/core';
