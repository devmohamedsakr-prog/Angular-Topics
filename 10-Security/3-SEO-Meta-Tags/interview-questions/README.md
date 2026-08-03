# Angular SEO & Meta Tags - Interview Questions

## Beginner Level

### Q1: What are meta tags and why are they important for SEO?
**Answer:**
Meta tags provide metadata about HTML document to search engines and browsers.

**Importance:**
- Tell search engines what page content is
- Control social media sharing previews
- Improve search result click-through rates
- Help with accessibility

**Common meta tags:**
```html
<meta name="description" content="Page description (155-160 chars)">
<meta name="keywords" content="keyword1, keyword2, keyword3">
<meta name="robots" content="index, follow">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Open Graph (social media) -->
<meta property="og:title" content="Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="image.jpg">
<meta property="og:url" content="https://example.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Title">
<meta name="twitter:description" content="Description">
```

---

### Q2: How do you set dynamic page titles in Angular?
**Answer:**
Use Angular's Title service to dynamically update page title:

```typescript
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  template: '<h1>{{ productName }}</h1>'
})
export class ProductComponent implements OnInit {
  productName = 'Great Product';

  constructor(private titleService: Title) {}

  ngOnInit() {
    // Set page title dynamically
    this.titleService.setTitle('Great Product - Shop');
  }
}
```

**Route-based title:**
```typescript
const routes = [
  {
    path: 'products/:id',
    component: ProductComponent,
    data: { title: 'Product Details' }
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'About Us' }
  }
];

// Track route changes
export class TitleManagerService {
  constructor(private router: Router, private title: Title) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.router.routerState.root;
        const data = route.firstChild?.data;
        if (data['title']) {
          this.title.setTitle(data['title']);
        }
      });
  }
}
```

---

### Q3: How do you manage meta tags in Angular?
**Answer:**
Use Angular's Meta service to add/update meta tags:

```typescript
import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home'
})
export class HomeComponent implements OnInit {
  constructor(private meta: Meta) {}

  ngOnInit() {
    // Add description
    this.meta.addTag({ name: 'description', content: 'Home page description' });

    // Update existing tag
    this.meta.updateTag({ name: 'description', content: 'Updated description' });

    // Add Open Graph tags
    this.meta.addTag({ property: 'og:title', content: 'My App' });
    this.meta.addTag({ property: 'og:description', content: 'App description' });
    this.meta.addTag({ property: 'og:image', content: 'image.jpg' });

    // Add Twitter Card
    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:title', content: 'My App' });

    // Remove tag
    this.meta.removeTag("name='description'");
  }
}
```

---

### Q4: What is the difference between Open Graph and Twitter Cards?
**Answer:**
Both are protocols for rich content sharing on social media:

**Open Graph (Facebook, LinkedIn, Pinterest):**
```html
<meta property="og:title" content="Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="image.jpg">
<meta property="og:url" content="https://example.com">
<meta property="og:type" content="website">
```

**Twitter Cards (Twitter):**
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="image.jpg">
<meta name="twitter:site" content="@yourhandle">
<meta name="twitter:creator" content="@authorhandle">
```

**Differences:**
- Twitter Cards use `name` attribute, OG uses `property`
- Different content formats
- Different best practice dimensions
- Open Graph more universal

---

### Q5: What is structured data and why use it?
**Answer:**
Structured data helps search engines understand content better using standard formats:

**Benefits:**
- Rich snippets in search results (ratings, prices, recipes)
- Enhanced visibility
- Better search rankings
- Machine-readable data

**Common format: JSON-LD:**
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Great Product",
  "description": "A great product",
  "image": "product.jpg",
  "brand": "MyBrand",
  "offers": {
    "@type": "Offer",
    "price": "19.99",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "100"
  }
}
</script>
```

---

## Intermediate Level

### Q6: How do you implement an SEO service for dynamic meta updates?
**Answer:**
Create centralized service for managing all SEO elements:

```typescript
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  setTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
  }

  setDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  setOpenGraph(data: {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
  }): void {
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
    
    if (data.image) this.meta.updateTag({ property: 'og:image', content: data.image });
    if (data.url) this.meta.updateTag({ property: 'og:url', content: data.url });
  }

  setTwitterCard(data: any): void {
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    if (data.image) this.meta.updateTag({ name: 'twitter:image', content: data.image });
  }

  updateAll(seoData: any): void {
    this.setTitle(seoData.title);
    this.setDescription(seoData.description);
    this.setOpenGraph(seoData);
    this.setTwitterCard(seoData);
  }
}

// Usage in component
@Component({
  template: '<h1>{{ product.name }}</h1>'
})
export class ProductComponent implements OnInit {
  product: any;

  constructor(private seo: SeoService) {}

  ngOnInit() {
    this.loadProduct().subscribe(product => {
      this.product = product;
      this.seo.updateAll({
        title: product.name,
        description: product.description,
        image: product.image,
        url: window.location.href
      });
    });
  }
}
```

---

### Q7: How do you add structured data to Angular components?
**Answer:**
Inject structured data as JSON-LD script tags:

```typescript
@Component({
  selector: 'app-article'
})
export class ArticleComponent implements OnInit {
  article: any;

  constructor(private seo: SeoService, private renderer: Renderer2) {}

  ngOnInit() {
    this.loadArticle().subscribe(article => {
      this.article = article;
      this.addStructuredData();
    });
  }

  private addStructuredData(): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: this.article.title,
      description: this.article.description,
      image: this.article.image,
      datePublished: this.article.publishedDate,
      dateModified: this.article.updatedDate,
      author: {
        '@type': 'Person',
        name: this.article.author
      }
    };

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.renderer.appendChild(document.head, script);
  }
}
```

---

### Q8: How do you set canonical URLs to prevent duplicate content?
**Answer:**
Canonical URL tells search engines which version to index:

```typescript
@Injectable({ providedIn: 'root' })
export class CanonicalService {
  constructor(private renderer: Renderer2) {}

  setCanonical(url: string): void {
    let link = document.querySelector("link[rel='canonical']");
    
    if (!link) {
      link = this.renderer.createElement('link');
      link.rel = 'canonical';
      this.renderer.appendChild(document.head, link);
    }

    link.href = url;
  }

  removeCanonical(): void {
    const link = document.querySelector("link[rel='canonical']");
    if (link) {
      this.renderer.removeChild(document.head, link);
    }
  }
}

// Usage
@Component({})
export class ProductComponent implements OnInit {
  constructor(private canonical: CanonicalService) {}

  ngOnInit() {
    // Set canonical for pagination
    this.canonical.setCanonical('https://example.com/products?page=1');
    
    // Or for alternate language versions
    this.canonical.setCanonical('https://example.com/en/product');
  }
}
```

---

### Q9: How do you handle SEO for different routes?
**Answer:**
Track route changes and update SEO accordingly:

```typescript
@Injectable({ providedIn: 'root' })
export class RouteSeoService implements OnInit {
  constructor(
    private router: Router,
    private seo: SeoService
  ) {
    this.trackRouteChanges();
  }

  private trackRouteChanges(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.router.routerState.root;
          while (route.firstChild) route = route.firstChild;
          return route.data;
        })
      )
      .subscribe(data => {
        if (data) {
          this.seo.updateAll({
            title: data['title'] || 'Default Title',
            description: data['description'] || 'Default description',
            image: data['image'],
            url: window.location.href
          });
        }
      });
  }
}

// Routes with SEO data
const routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Home - Shop',
      description: 'Welcome to our shop',
      image: 'home-image.jpg'
    }
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: {
      title: 'Products - Shop',
      description: 'Browse our products',
      image: 'products-image.jpg'
    }
  }
];
```

---

### Q10: What is robots meta tag and when to use noindex?
**Answer:**
Robots meta tag controls how search engines crawl/index pages:

```html
<!-- Index and follow links (default) -->
<meta name="robots" content="index, follow">

<!-- Don't index, follow links -->
<meta name="robots" content="noindex, follow">

<!-- Index, don't follow links -->
<meta name="robots" content="index, nofollow">

<!-- Don't index, don't follow -->
<meta name="robots" content="noindex, nofollow">

<!-- Crawl after delay -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">

<!-- Page expires after date -->
<meta name="robots" content="unavailable_after: 2024-12-31">
```

**Use noindex for:**
- Admin pages
- Duplicate pages
- Print versions
- Search results pages
- Staging environments
- Temporary pages

```typescript
@Injectable()
export class RobotsService {
  constructor(private meta: Meta) {}

  setNoindex(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  setIndex(): void {
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }
}
```

---

## Advanced Level

### Q11: How do you implement server-side rendering for SEO?
**Answer:**
SSR pre-renders pages on server for search engines:

```bash
# Add SSR support
ng add @angular/platform-server

# Build for SSR
ng run myapp:server
```

**server.ts setup:**
```typescript
import { AppServerModule } from './app/app.server.module';

export default bootstrap;

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.use(compression());
app.use('/', express.static('dist/myapp/browser'));

// Render pages server-side
app.get('*', (req, res) => {
  res.render('index', { req });
});
```

**Benefits:**
- Search engines see full HTML
- Faster perceived performance
- Better initial Core Web Vitals
- Works with JavaScript disabled

---

### Q12: How do you generate dynamic Open Graph images?
**Answer:**
Create dynamic OG images on-demand:

```typescript
export class DynamicOgImageService {
  /**
   * Generate OG image URL using external service
   */
  generateProductOgImage(product: any): string {
    const params = {
      title: encodeURIComponent(product.name),
      description: encodeURIComponent(product.description),
      price: product.price,
      image: encodeURIComponent(product.image)
    };

    const query = new URLSearchParams(params).toString();
    return `https://og-image-service.example.com/product?${query}`;
  }

  /**
   * Generate article OG image
   */
  generateArticleOgImage(article: any): string {
    return `https://og-image-service.example.com/article?title=${encodeURIComponent(article.title)}&author=${encodeURIComponent(article.author)}`;
  }
}

// Usage in component
@Component({})
export class ProductComponent implements OnInit {
  product: any;

  constructor(private seo: SeoService, private ogImage: DynamicOgImageService) {}

  ngOnInit() {
    this.loadProduct().subscribe(product => {
      this.product = product;
      const ogImageUrl = this.ogImage.generateProductOgImage(product);
      
      this.seo.setOpenGraph({
        title: product.name,
        description: product.description,
        image: ogImageUrl
      });
    });
  }
}
```

---

### Q13: How do you optimize for Core Web Vitals related to SEO?
**Answer:**
Improve loading performance for better search rankings:

```typescript
/**
 * Core Web Vitals monitoring
 */
@Injectable({ providedIn: 'root' })
export class CoreWebVitalsService {
  reportVitals(): void {
    // Largest Contentful Paint (LCP) - loading performance
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID) - interactivity
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        console.log('FID:', entry.processingDuration);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS) - visual stability
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

// Optimization strategies
export class VitalsOptimization {
  /**
   * Reduce LCP - optimize images, lazy load below-fold content
   */
  static optimizeLCP(): void {
    // Use priority hints
    // <link rel="preload" as="image" href="hero.jpg">
    // Lazy load images
    // <img loading="lazy" src="image.jpg">
  }

  /**
   * Reduce FID - break up long JavaScript tasks
   */
  static optimizeFID(): void {
    // Use requestIdleCallback for non-critical work
    requestIdleCallback(() => {
      // Non-critical initialization
    });
    // Split code with code splitting
  }

  /**
   * Reduce CLS - reserve space for dynamic content
   */
  static optimizeCLS(): void {
    // Set explicit dimensions for images
    // <img width="400" height="300" src="image.jpg">
    // Avoid inserting content above existing content
  }
}
```

---

### Q14: How do you create and maintain XML sitemaps?
**Answer:**
Generate sitemaps for search engine discovery:

```typescript
@Injectable({ providedIn: 'root' })
export class SitemapService {
  constructor(private api: any) {}

  /**
   * Generate XML sitemap
   */
  async generateSitemap(): Promise<string> {
    const pages = await this.getAllPages();
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    pages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(page.url)}</loc>\n`;
      xml += `    <lastmod>${page.updatedDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changeFreq || 'weekly'}</changefreq>\n`;
      xml += `    <priority>${page.priority || '0.8'}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate sitemap index for large sites
   */
  generateSitemapIndex(): string {
    const sitemaps = [
      'sitemap-pages.xml',
      'sitemap-products.xml',
      'sitemap-blog.xml'
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemaps.forEach(sitemap => {
      xml += '  <sitemap>\n';
      xml += `    <loc>https://example.com/${sitemap}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';
    return xml;
  }

  private async getAllPages(): Promise<any[]> {
    // Fetch all pages from database/API
    return this.api.getAllPages();
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

// In server/backend
app.get('/sitemap.xml', (req, res) => {
  sitemapService.generateSitemap().then(xml => {
    res.type('application/xml');
    res.send(xml);
  });
});
```

---

### Q15: How do you monitor and improve SEO performance?
**Answer:**
Track metrics and implement improvements:

```typescript
@Injectable({ providedIn: 'root' })
export class SeoMonitoringService {
  /**
   * Track SEO metrics
   */
  trackSeoMetrics(): void {
    // Google Analytics 4
    gtag('event', 'page_view', {
      page_title: document.title,
      page_path: window.location.pathname,
      page_location: window.location.href
    });

    // Track meta tags presence
    this.validateMetaTags();

    // Monitor Core Web Vitals
    web.vitals.getCLS(metric => console.log('CLS:', metric.value));
    web.vitals.getFID(metric => console.log('FID:', metric.value));
    web.vitals.getLCP(metric => console.log('LCP:', metric.value));
  }

  /**
   * Validate required meta tags
   */
  private validateMetaTags(): void {
    const required = [
      'description',
      'og:title',
      'og:description',
      'og:image'
    ];

    required.forEach(tag => {
      const exists = document.querySelector(`[name="${tag}"]`) || 
                    document.querySelector(`[property="${tag}"]`);
      if (!exists) {
        console.warn(`Missing SEO tag: ${tag}`);
      }
    });
  }

  /**
   * SEO audit checklist
   */
  runSeoAudit(): SeoAuditReport {
    return {
      titlePresent: !!document.querySelector('title'),
      metaDescriptionPresent: !!document.querySelector('[name="description"]'),
      headingsStructure: this.validateHeadings(),
      imagesHaveAlt: this.validateImageAlt(),
      responsiveViewport: !!document.querySelector('[name="viewport"]'),
      canonicalPresent: !!document.querySelector('link[rel="canonical"]'),
      coreWebVitals: this.getCoreWebVitals()
    };
  }

  private validateHeadings(): boolean {
    // Check H1, H2 hierarchy
    const h1Count = document.querySelectorAll('h1').length;
    return h1Count === 1;
  }

  private validateImageAlt(): boolean {
    const images = document.querySelectorAll('img');
    return Array.from(images).every(img => img.hasAttribute('alt'));
  }

  private getCoreWebVitals(): any {
    // Get CWV scores
    return {};
  }
}

interface SeoAuditReport {
  titlePresent: boolean;
  metaDescriptionPresent: boolean;
  headingsStructure: boolean;
  imagesHaveAlt: boolean;
  responsiveViewport: boolean;
  canonicalPresent: boolean;
  coreWebVitals: any;
}
```
