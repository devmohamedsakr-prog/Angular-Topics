# Angular Core Web Vitals & Performance

## Overview

Core Web Vitals are key metrics that Google uses to measure page experience and rank websites. They focus on three aspects: loading, interactivity, and visual stability.

## The Three Core Web Vitals

### 1. **LCP (Largest Contentful Paint)**
- **What**: Time until largest visible element loads
- **Metric**: Milliseconds
- **Good**: < 2.5s | Needs Improvement: 2.5-4s | Poor: > 4s
- **Affects**: SEO ranking, user perception

### 2. **FID (First Input Delay)**
- **What**: Time from user interaction to browser response
- **Metric**: Milliseconds
- **Good**: < 100ms | Needs Improvement: 100-300ms | Poor: > 300ms
- **Affects**: Responsiveness, user experience

### 3. **CLS (Cumulative Layout Shift)**
- **What**: Sum of layout shift scores during page lifetime
- **Metric**: Unitless (0-1 scale)
- **Good**: < 0.1 | Needs Improvement: 0.1-0.25 | Poor: > 0.25
- **Affects**: Visual stability, user frustration

## Other Important Metrics

- **TTFB (Time to First Byte)**: Server response time
- **FCP (First Contentful Paint)**: First paint of content
- **FIPS (First Input Processing)**: Total interaction time
- **TTI (Time to Interactive)**: Page fully interactive

## Performance Budget

- **Total bundle**: < 250KB gzip
- **Initial load**: < 3s on 4G
- **LCP target**: < 2.5s
- **FID target**: < 100ms
- **CLS target**: < 0.1

## Optimization Strategies

### LCP Optimization
- Lazy load below-fold images
- Minimize critical CSS
- Optimize largest image
- Prefetch critical resources
- Use Content Delivery Network (CDN)

### FID/INP Optimization
- Break long tasks (> 50ms)
- Defer non-critical JavaScript
- Use requestIdleCallback()
- Implement code splitting
- Optimize third-party scripts

### CLS Optimization
- Set explicit dimensions on images/videos
- Avoid inserting content above existing content
- Use transform animations instead of reflow
- Add reserved space for dynamic content

## Tools for Measurement

- Google Lighthouse
- Google PageSpeed Insights
- Chrome DevTools
- Web Vitals library
- Search Console
- CrUX data
