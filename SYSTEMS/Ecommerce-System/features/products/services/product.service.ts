/**
 * Product Service - E-Commerce System
 * Handles all product-related API calls and business logic
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  Subject,
  of,
  throwError,
} from 'rxjs';
import {
  map,
  tap,
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  shareReplay,
  withLatestFrom,
} from 'rxjs/operators';
import {
  Product,
  ProductFilter,
  ProductSearchResult,
  ProductCategory,
  ProductReview,
  ProductVariant,
  ProductInventory,
} from '../models/product.model';

/**
 * Injectable product service
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // API endpoint
  private readonly apiUrl = '/api/products';

  // Cache subjects
  private productsCache$ = new BehaviorSubject<Product[]>([]);
  private categoriesCache$ = new BehaviorSubject<ProductCategory[]>([]);
  private selectedProduct$ = new BehaviorSubject<Product | null>(null);

  // Search subject with debounce
  private searchSubject$ = new Subject<ProductFilter>();

  // Public observables
  public products$ = this.productsCache$.asObservable().pipe(shareReplay(1));
  public categories$ = this.categoriesCache$
    .asObservable()
    .pipe(shareReplay(1));
  public selectedProduct$ = this.selectedProduct$.asObservable();

  // Search with debounce
  public search$ = this.searchSubject$.pipe(
    debounceTime(300),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    switchMap((filter) => this.searchProducts(filter)),
    shareReplay(1)
  );

  // Cache management
  private cacheTimestamps = {
    products: null as number | null,
    categories: null as number | null,
  };
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {
    this.initializeSearch();
  }

  /**
   * Initialize search observable
   */
  private initializeSearch(): void {
    this.search$.subscribe({
      error: (error) => console.error('Search error:', error),
    });
  }

  // ============================================================================
  // PRODUCT OPERATIONS
  // ============================================================================

  /**
   * Get all products with optional filtering
   */
  getProducts(filter?: ProductFilter): Observable<Product[]> {
    // Check cache
    const now = Date.now();
    if (
      this.cacheTimestamps.products &&
      now - this.cacheTimestamps.products < this.cacheDuration
    ) {
      return this.products$;
    }

    const params = this.buildHttpParams(filter);
    return this.http
      .get<Product[]>(`${this.apiUrl}`, { params })
      .pipe(
        tap((products) => {
          this.productsCache$.next(products);
          this.cacheTimestamps.products = now;
        }),
        catchError((error) => this.handleError('fetching products', error))
      );
  }

  /**
   * Get single product by ID
   */
  getProduct(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        tap((product) => this.selectedProduct$.next(product)),
        catchError((error) => this.handleError(`fetching product ${id}`, error))
      );
  }

  /**
   * Search products with filters
   */
  searchProducts(filter: ProductFilter): Observable<ProductSearchResult> {
    const params = this.buildHttpParams(filter);
    return this.http
      .get<ProductSearchResult>(`${this.apiUrl}/search`, { params })
      .pipe(
        catchError((error) => this.handleError('searching products', error))
      );
  }

  /**
   * Trigger search from component
   */
  search(filter: ProductFilter): void {
    this.searchSubject$.next(filter);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/category/${categoryId}`)
      .pipe(
        catchError((error) =>
          this.handleError(`fetching category ${categoryId}`, error)
        )
      );
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit: number = 10): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/featured`, {
        params: new HttpParams().set('limit', limit.toString()),
      })
      .pipe(
        catchError((error) => this.handleError('fetching featured', error))
      );
  }

  /**
   * Get related products
   */
  getRelatedProducts(productId: string, limit: number = 5): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/${productId}/related`, {
        params: new HttpParams().set('limit', limit.toString()),
      })
      .pipe(
        catchError((error) => this.handleError('fetching related', error))
      );
  }

  // ============================================================================
  // PRODUCT MANAGEMENT (Admin)
  // ============================================================================

  /**
   * Create new product (admin)
   */
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${this.apiUrl}`, product)
      .pipe(
        tap(() => this.invalidateCache('products')),
        catchError((error) => this.handleError('creating product', error))
      );
  }

  /**
   * Update product (admin)
   */
  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(
        tap(() => this.invalidateCache('products')),
        catchError((error) => this.handleError('updating product', error))
      );
  }

  /**
   * Delete product (admin)
   */
  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.invalidateCache('products')),
        catchError((error) => this.handleError('deleting product', error))
      );
  }

  /**
   * Update product stock/inventory
   */
  updateInventory(
    productId: string,
    quantity: number
  ): Observable<ProductInventory> {
    return this.http
      .patch<ProductInventory>(`${this.apiUrl}/${productId}/inventory`, {
        quantity,
      })
      .pipe(
        tap(() => this.invalidateCache('products')),
        catchError((error) => this.handleError('updating inventory', error))
      );
  }

  // ============================================================================
  // CATEGORY OPERATIONS
  // ============================================================================

  /**
   * Get all categories
   */
  getCategories(): Observable<ProductCategory[]> {
    const now = Date.now();
    if (
      this.cacheTimestamps.categories &&
      now - this.cacheTimestamps.categories < this.cacheDuration
    ) {
      return this.categories$;
    }

    return this.http
      .get<ProductCategory[]>(`${this.apiUrl}/categories`)
      .pipe(
        tap((categories) => {
          this.categoriesCache$.next(categories);
          this.cacheTimestamps.categories = now;
        }),
        catchError((error) => this.handleError('fetching categories', error))
      );
  }

  /**
   * Get category by ID
   */
  getCategory(id: string): Observable<ProductCategory> {
    return this.http
      .get<ProductCategory>(`${this.apiUrl}/categories/${id}`)
      .pipe(
        catchError((error) => this.handleError(`fetching category ${id}`, error))
      );
  }

  // ============================================================================
  // REVIEW OPERATIONS
  // ============================================================================

  /**
   * Get product reviews
   */
  getReviews(productId: string): Observable<ProductReview[]> {
    return this.http
      .get<ProductReview[]>(`${this.apiUrl}/${productId}/reviews`)
      .pipe(
        catchError((error) => this.handleError(`fetching reviews`, error))
      );
  }

  /**
   * Add product review
   */
  addReview(productId: string, review: Partial<ProductReview>): Observable<ProductReview> {
    return this.http
      .post<ProductReview>(`${this.apiUrl}/${productId}/reviews`, review)
      .pipe(
        tap(() => this.invalidateCache('products')),
        catchError((error) => this.handleError('adding review', error))
      );
  }

  /**
   * Mark review as helpful
   */
  markReviewHelpful(productId: string, reviewId: string): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/${productId}/reviews/${reviewId}/helpful`, {})
      .pipe(
        catchError((error) => this.handleError('marking review helpful', error))
      );
  }

  // ============================================================================
  // VARIANT OPERATIONS
  // ============================================================================

  /**
   * Get product variants
   */
  getVariants(productId: string): Observable<ProductVariant[]> {
    return this.http
      .get<ProductVariant[]>(`${this.apiUrl}/${productId}/variants`)
      .pipe(
        catchError((error) => this.handleError('fetching variants', error))
      );
  }

  /**
   * Get specific variant
   */
  getVariant(productId: string, variantId: string): Observable<ProductVariant> {
    return this.http
      .get<ProductVariant>(
        `${this.apiUrl}/${productId}/variants/${variantId}`
      )
      .pipe(
        catchError((error) => this.handleError('fetching variant', error))
      );
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Build HTTP parameters from filter
   */
  private buildHttpParams(filter?: ProductFilter): HttpParams {
    let params = new HttpParams();

    if (!filter) return params;

    if (filter.search)
      params = params.set('search', filter.search);
    if (filter.category)
      params = params.set('category', filter.category);
    if (filter.brand)
      params = params.set('brand', filter.brand);
    if (filter.priceMin !== undefined)
      params = params.set('priceMin', filter.priceMin.toString());
    if (filter.priceMax !== undefined)
      params = params.set('priceMax', filter.priceMax.toString());
    if (filter.rating !== undefined)
      params = params.set('rating', filter.rating.toString());
    if (filter.inStock !== undefined)
      params = params.set('inStock', filter.inStock.toString());
    if (filter.tags && filter.tags.length > 0)
      params = params.set('tags', filter.tags.join(','));
    if (filter.sortBy)
      params = params.set('sortBy', filter.sortBy);
    if (filter.sortOrder)
      params = params.set('sortOrder', filter.sortOrder);
    if (filter.page !== undefined)
      params = params.set('page', filter.page.toString());
    if (filter.pageSize !== undefined)
      params = params.set('pageSize', filter.pageSize.toString());

    return params;
  }

  /**
   * Invalidate cache
   */
  private invalidateCache(type: 'products' | 'categories'): void {
    this.cacheTimestamps[type] = null;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(action: string, error: any): Observable<never> {
    console.error(`${action} error:`, error);
    const errorMessage =
      error?.error?.message || error?.message || `Error ${action}`;
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cacheTimestamps.products = null;
    this.cacheTimestamps.categories = null;
  }

  /**
   * Get current selected product
   */
  getCurrentSelectedProduct(): Product | null {
    return this.selectedProduct$.value;
  }
}
