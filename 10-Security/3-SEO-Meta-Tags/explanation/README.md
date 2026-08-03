# Angular SEO & Meta Tags

## Overview

SEO (Search Engine Optimization) in Angular involves optimizing your single-page application for search engines. Key aspects include meta tags, title management, structured data, and server-side rendering.

## Core Concepts

### 1. **Meta Tags**
- Inform search engines about page content
- Control social media sharing previews
- Open Graph (og:*) tags for social media
- Twitter Card tags for Twitter
- Schema.org structured data

### 2. **Title & Description**
- Dynamic page titles based on route
- Meta descriptions for search results
- Important for click-through rates

### 3. **Structured Data**
- JSON-LD format for rich snippets
- Organization, Product, Article schemas
- Enhanced search results (star ratings, prices)

### 4. **Canonical URLs**
- Prevent duplicate content penalties
- Point to preferred version
- Important for multi-language sites

### 5. **Robots Meta Tag**
- Control indexing (index, noindex)
- Follow/nofollow for links
- Crawl directives

## Angular SEO Services

- **Title Service**: Manage page title
- **Meta Service**: Manage meta tags
- **Angular Router**: Title resolution
- **Dynamic meta tag updates**

## Best Practices

1. Use dynamic titles per route
2. Update meta descriptions
3. Add Open Graph tags for social sharing
4. Implement structured data (JSON-LD)
5. Use canonical tags for duplicate content
6. Set proper HTTP status codes
7. Optimize images with alt text
8. Create XML sitemap
9. Submit to Search Console
10. Monitor with analytics

## Performance & SEO

- **Server-Side Rendering (SSR)**: Pre-render pages for crawlers
- **Static Generation**: Pre-build static pages
- **Dynamic Pre-rendering**: Render on-demand
- **Optimize Core Web Vitals**: LCP, FID, CLS

## Common Issues

- Meta tags not updating in SPAs
- Search engines not indexing content
- Duplicate content problems
- Missing structured data
- Poor Core Web Vitals scores
