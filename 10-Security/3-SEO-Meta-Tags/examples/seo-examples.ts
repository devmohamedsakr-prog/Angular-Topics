/**
 * Angular SEO & Meta Tags Examples
 * 
 * Covers:
 * - Title management
 * - Meta tag management
 * - Open Graph and Twitter cards
 * - Structured data (JSON-LD)
 * - Canonical URLs
 * - Dynamic meta updates
 * - SEO service patterns
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

// ============================================================================
// 1. SEO SERVICE - Centralized meta tag management
// ============================================================================

import { Injectable } from '@angular/core';

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  author?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {}

  /**
   * Set page title
   */
  setTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  /**
   * Set meta description
   */
  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  /**
   * Set Open Graph tags for social sharing
   */
  setOpenGraph(data: SeoData): void {
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    
    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
      this.meta.updateTag({ property: 'og:image:type', content: 'image/jpeg' });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
    }

    if (data.url) {
      this.meta.updateTag({ property: 'og:url', content: data.url });
    }

    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
  }

  /**
   * Set Twitter Card tags
   */
  setTwitterCard(data: SeoData): void {
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    
    if (data.image) {
      this.meta.updateTag({ name: 'twitter:image', content: data.image });
    }

    this.meta.updateTag({ name: 'twitter:site', content: '@yourTwitterHandle' });
    this.meta.updateTag({ name: 'twitter:creator', content: '@yourTwitterHandle' });
  }

  /**
   * Set canonical URL to prevent duplicate content
   */
  setCanonical(url: string): void {
    let link = this.meta.getTag("rel='canonical'");
    if (!link) {
      link = document.createElement('link');
      document.head.appendChild(link);
    }
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
  }

  /**
   * Set robots meta tag
   */
  setRobots(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  /**
   * Add structured data (JSON-LD)
   */
  setStructuredData(data: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /**
   * Update all SEO data at once
   */
  updateSeoData(data: SeoData): void {
    this.setTitle(data.title);
    this.setDescription(data.description);
    this.setOpenGraph(data);
    this.setTwitterCard(data);
    
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }
    
    if (data.url) {
      this.setCanonical(data.url);
    }
  }

  /**
   * Remove meta tag
   */
  removeTag(selector: string): void {
    this.meta.removeTag(selector);
  }

  /**
   * Reset to default
   */
  resetToDefault(): void {
    this.setTitle('My App');
    this.setDescription('Welcome to my app');
    this.removeTag("property='og:image'");
  }
}

// ============================================================================
// 2. COMPONENT WITH SEO META TAGS
// ============================================================================

/**
 * Product detail component with SEO
 */
@Component({
  selector: 'app-product-detail',
  template: `
    <div class="product-container">
      <h1>{{ product?.name }}</h1>
      <p>{{ product?.description }}</p>
      <p class="price">${{ product?.price }}</p>
      <img [src]="product?.image" [alt]="product?.name">
      <button (click)="addToCart()">Add to Cart</button>
    </div>
  `,
  styles: [`
    .product-container { max-width: 800px; margin: 0 auto; }
    .price { font-size: 24px; font-weight: bold; color: #007bff; }
    img { max-width: 100%; height: auto; margin: 20px 0; }
  `]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: any;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private seo: SeoService,
    private apiService: any
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.loadProduct(params['id']);
    });
  }

  /**
   * Load product and update SEO
   */
  loadProduct(id: string): void {
    this.apiService.getProduct(id).subscribe((product: any) => {
      this.product = product;
      this.updateSeoForProduct();
    });
  }

  /**
   * Update SEO meta tags for product
   */
  updateSeoForProduct(): void {
    if (!this.product) return;

    const seoData: SeoData = {
      title: `${this.product.name} - Shop`,
      description: this.product.description.substring(0, 160),
      image: this.product.image,
      url: window.location.href,
      type: 'product'
    };

    this.seo.updateSeoData(seoData);

    // Add structured data for e-commerce
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: this.product.name,
      description: this.product.description,
      image: this.product.image,
      brand: {
        '@type': 'Brand',
        name: 'MyBrand'
      },
      offers: {
        '@type': 'Offer',
        price: this.product.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: this.product.rating,
        reviewCount: this.product.reviewCount
      }
    };

    this.seo.setStructuredData(structuredData);
  }

  addToCart(): void {
    console.log('Added to cart');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// 3. BLOG POST COMPONENT WITH ARTICLE SCHEMA
// ============================================================================

/**
 * Blog post with Article structured data
 */
@Component({
  selector: 'app-blog-post',
  template: `
    <article class="blog-post">
      <h1>{{ post?.title }}</h1>
      <div class="meta">
        <span>By {{ post?.author }}</span>
        <span>{{ post?.publishedDate | date: 'longDate' }}</span>
      </div>
      <img [src]="post?.featuredImage" [alt]="post?.title">
      <div [innerHTML]="post?.content"></div>
      <div class="tags">
        <span *ngFor="let tag of post?.tags" class="tag">{{ tag }}</span>
      </div>
    </article>
  `,
  styles: [`
    .blog-post { max-width: 800px; margin: 0 auto; }
    .meta { color: #666; margin: 10px 0; }
    img { max-width: 100%; height: auto; margin: 20px 0; }
    .tags { margin-top: 20px; }
    .tag { display: inline-block; margin-right: 10px; padding: 5px 10px; background: #f0f0f0; border-radius: 4px; }
  `]
})
export class BlogPostComponent implements OnInit, OnDestroy {
  post: any;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private seo: SeoService,
    private api: any
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.loadPost(params['slug']);
    });
  }

  loadPost(slug: string): void {
    this.api.getBlogPost(slug).subscribe((post: any) => {
      this.post = post;
      this.updateBlogSeo();
    });
  }

  updateBlogSeo(): void {
    if (!this.post) return;

    // Update basic meta
    this.seo.updateSeoData({
      title: this.post.title + ' | Blog',
      description: this.post.excerpt || this.post.content.substring(0, 160),
      image: this.post.featuredImage,
      url: window.location.href,
      keywords: this.post.tags.join(', '),
      author: this.post.author
    });

    // Add Article structured data
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: this.post.title,
      description: this.post.excerpt,
      image: this.post.featuredImage,
      datePublished: this.post.publishedDate,
      dateModified: this.post.updatedDate || this.post.publishedDate,
      author: {
        '@type': 'Person',
        name: this.post.author,
        url: 'https://example.com/authors/' + this.post.authorId
      },
      publisher: {
        '@type': 'Organization',
        name: 'MyBlog',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.png'
        }
      }
    };

    this.seo.setStructuredData(articleSchema);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// 4. ROUTE-BASED SEO WITH TITLE RESOLVER
// ============================================================================

/**
 * Title resolver for routes
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleResolver implements Resolve<string> {
  constructor(private seo: SeoService, private api: any) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    const pageId = route.params['id'];
    
    return this.api.getPageTitle(pageId);
  }
}

/**
 * Routes with title data and resolvers
 */
export const appRoutes = [
  {
    path: 'home',
    component: undefined, // HomeComponent
    data: {
      title: 'Home - My App',
      description: 'Welcome to my app'
    }
  },
  {
    path: 'products/:id',
    component: undefined, // ProductDetailComponent
    resolve: { pageTitle: PageTitleResolver }
  },
  {
    path: 'blog/:slug',
    component: undefined, // BlogPostComponent
    resolve: { pageTitle: PageTitleResolver }
  },
  {
    path: 'about',
    component: undefined, // AboutComponent
    data: {
      title: 'About Us - My App',
      description: 'Learn more about my app'
    }
  }
];

// ============================================================================
// 5. ROUTER-BASED SEO MANAGEMENT
// ============================================================================

/**
 * Service that updates SEO on route changes
 */
@Injectable({
  providedIn: 'root'
})
export class RouteSeoService implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private seo: SeoService,
    private title: Title
  ) {
    this.initializeRouterTracking();
  }

  /**
   * Track route changes and update SEO
   */
  private initializeRouterTracking(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.updateSeoForRoute();
      });
  }

  /**
   * Update SEO based on current route data
   */
  private updateSeoForRoute(): void {
    const route = this.router.routerState.root;
    let child = route;

    while (child) {
      if (child.outlet === 'primary' && child.component) {
        const data = child.data;
        
        if (data['title']) {
          this.seo.setTitle(data['title']);
        }

        if (data['description']) {
          this.seo.setDescription(data['description']);
        }

        if (data['image']) {
          this.seo.setOpenGraph({
            title: data['title'],
            description: data['description'],
            image: data['image'],
            url: window.location.href
          });
        }
      }

      child = child.firstChild as any;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ============================================================================
// 6. SITEMAP AND ROBOTS.TXT GENERATION
// ============================================================================

/**
 * Service to generate sitemap
 */
@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  constructor(private api: any) {}

  /**
   * Generate XML sitemap
   */
  generateSitemap(): string {
    const baseUrl = 'https://example.com';
    const urls = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/about', priority: 0.8, changefreq: 'monthly' },
      { url: '/products', priority: 0.9, changefreq: 'daily' },
      { url: '/blog', priority: 0.9, changefreq: 'daily' }
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(item => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${item.url}</loc>\n`;
      xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      xml += `    <priority>${item.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate robots.txt
   */
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /private
Crawl-delay: 1

User-agent: Googlebot
Allow: /

Sitemap: https://example.com/sitemap.xml
`;
  }
}

// ============================================================================
// 7. DYNAMIC OG IMAGE GENERATION
// ============================================================================

/**
 * Generate dynamic Open Graph image URLs
 */
export class OgImageService {
  /**
   * Generate OG image URL with custom parameters
   */
  static generateOgImageUrl(title: string, description: string, image?: string): string {
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);
    
    // Using og-image.example.com or similar service
    return `https://og-image.vercel.app/${encodedTitle}?description=${encodedDesc}`;
  }

  /**
   * Generate Twitter card image
   */
  static generateTwitterCardImage(title: string, author: string): string {
    const encodedTitle = encodeURIComponent(title);
    const encodedAuthor = encodeURIComponent(author);
    
    return `https://twitter-card.vercel.app/${encodedTitle}?author=${encodedAuthor}`;
  }
}
