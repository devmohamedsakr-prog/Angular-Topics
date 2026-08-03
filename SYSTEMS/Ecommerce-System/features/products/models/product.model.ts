/**
 * Product Models - E-Commerce System
 * Defines interfaces for products, reviews, variants, and pricing
 */

/**
 * Product interface - represents a single product in the catalog
 */
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number; // For sales/discounts
  currency: string;
  stock: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: ProductImage[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  variants: ProductVariant[];
  weight?: number;
  dimensions?: ProductDimensions;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Product image interface
 */
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  thumbnail?: string;
}

/**
 * Product variant interface - for colors, sizes, etc.
 */
export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  type: 'color' | 'size' | 'material' | 'custom';
  value: string;
  price?: number; // Override base price if different
  stock: number;
  images?: ProductImage[];
  isActive: boolean;
}

/**
 * Product review interface
 */
export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Product dimensions
 */
export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'inch';
}

/**
 * Product filter options
 */
export interface ProductFilter {
  search?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

/**
 * Product search result
 */
export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  filters: ProductFilter;
}

/**
 * Product category
 */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  productCount: number;
  isActive: boolean;
}

/**
 * Product inventory tracking
 */
export interface ProductInventory {
  productId: string;
  stock: number;
  reserved: number;
  available: number;
  warehouseLocations?: WarehouseLocation[];
  lastUpdated: Date;
}

/**
 * Warehouse location for inventory
 */
export interface WarehouseLocation {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  shippingTime?: number; // days
}

/**
 * Product comparison
 */
export interface ProductComparison {
  products: Product[];
  attributes: ComparisonAttribute[];
}

/**
 * Comparison attribute for products
 */
export interface ComparisonAttribute {
  name: string;
  values: Record<string, any>; // productId -> value mapping
}

/**
 * Product state for caching
 */
export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  searchResult: ProductSearchResult | null;
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
  filters: ProductFilter;
  lastUpdated: Date | null;
}
