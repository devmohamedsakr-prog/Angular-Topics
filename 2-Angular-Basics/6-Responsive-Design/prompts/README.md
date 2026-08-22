# Responsive Design - IDE Prompts

**Step-by-step guides for building responsive Angular applications.**

Each prompt file is designed to be used with Kiro IDE or any AI agent for focused, sequential development.

---

## 📋 Prompt Files Overview

### 1. [Setup Responsive Project](./1-setup-responsive-project.md)
**Time:** 10-15 minutes | **Level:** Beginner

Initialize a new responsive Angular project with:
- Viewport meta tag configuration
- CSS variables for breakpoints and spacing
- Responsive container component
- Breakpoint detection service
- Global styles setup

**When to use:** Starting a brand new Angular application.

**Outcomes:**
- ✅ Angular project runs
- ✅ Viewport configured
- ✅ CSS variables defined
- ✅ Breakpoint service working

---

### 2. [Create Responsive Layouts](./2-create-layouts.md)
**Time:** 20-30 minutes | **Level:** Intermediate

Build responsive layout patterns using Flexbox and CSS Grid:
- Mobile-first single column to multi-column
- Sidebar + main content layout
- Flexbox navigation
- Hero section
- Dashboard grid layouts

**When to use:** Building page layouts that adapt to different screen sizes.

**Outcomes:**
- ✅ Card grid component (auto-fit)
- ✅ Sidebar layout component
- ✅ Navigation component
- ✅ Hero section component
- ✅ Layouts tested at 375px, 768px, 1920px

---

### 3. [Build Responsive Components](./3-build-components.md)
**Time:** 30-40 minutes | **Level:** Intermediate

Create reusable responsive components:
- Responsive card component
- Responsive button component (with size variants)
- Responsive form component
- Responsive gallery component
- Image gallery with lazy loading

**When to use:** Building a component library for your application.

**Outcomes:**
- ✅ Card component with clamp() sizing
- ✅ Button component with touch targets
- ✅ Form component with grid layout
- ✅ Gallery component with lazy load
- ✅ SharedModule created and exported

---

### 4. [Add Media Queries & Accessibility](./4-media-queries.md)
**Time:** 20-30 minutes | **Level:** Intermediate

Implement advanced responsive features:
- Dark mode support with CSS variables
- Reduced motion for accessibility
- Hover/touch capability detection
- Print styles
- High contrast mode support

**When to use:** Adding modern CSS features and accessibility support.

**Outcomes:**
- ✅ Dark mode working
- ✅ Reduced motion respected
- ✅ Hover effects only on hover-capable devices
- ✅ Print styles configured
- ✅ High contrast support added

---

### 5. [Optimize Images](./5-optimize-images.md)
**Time:** 20-30 minutes | **Level:** Intermediate

Implement responsive image strategies:
- Responsive images with srcset
- Picture element for art direction
- Modern image formats (WebP) with fallbacks
- Lazy loading implementation
- Aspect ratio preservation
- Image gallery patterns

**When to use:** Adding images that optimize for different devices and browsers.

**Outcomes:**
- ✅ Responsive images with srcset
- ✅ Picture element for different viewports
- ✅ WebP with JPEG fallback
- ✅ Lazy loading enabled
- ✅ LCP optimized

---

### 6. [Testing & Performance](./6-testing-performance.md)
**Time:** 30-40 minutes | **Level:** Advanced

Test and optimize for Core Web Vitals:
- Responsive testing at multiple breakpoints
- Dark mode testing
- Core Web Vitals monitoring (LCP, FID, CLS)
- Lighthouse audit setup
- Performance benchmarks
- Network throttling testing

**When to use:** Before deployment to verify performance and responsiveness.

**Outcomes:**
- ✅ Lighthouse score > 90
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1
- ✅ All breakpoints tested

---

## 🚀 Quick Start Paths

### Path 1: Complete Setup (Full App)
**Total Time:** 2-3 hours | **Difficulty:** Beginner → Advanced

Follow prompts in order:

```
1. Setup (15 min)
   ↓
2. Create Layouts (25 min)
   ↓
3. Build Components (35 min)
   ↓
4. Add Media Queries (25 min)
   ↓
5. Optimize Images (25 min)
   ↓
6. Testing & Performance (35 min)
```

**Result:** Fully responsive, optimized Angular application

---

### Path 2: Quick Layout Build (30 minutes)
**Best for:** Adding responsive layouts to existing project

```
1. Create Layouts (25 min)
   ↓
2. Testing & Performance (5 min - quick check)
```

---

### Path 3: Component Library (45 minutes)
**Best for:** Building component library for team

```
1. Setup (10 min)
   ↓
3. Build Components (35 min)
```

---

### Path 4: Performance Optimization (20 minutes)
**Best for:** Existing app needing optimization

```
5. Optimize Images (15 min)
   ↓
6. Testing & Performance (5 min)
```

---

## 📊 File Structure After All Prompts

```
src/
├── app/
│   ├── components/
│   │   ├── container/
│   │   ├── responsive-card/
│   │   ├── responsive-button/
│   │   ├── responsive-form/
│   │   ├── responsive-image/
│   │   ├── responsive-gallery/
│   │   ├── card-grid/
│   │   ├── sidebar-layout/
│   │   └── flex-navbar/
│   ├── services/
│   │   ├── breakpoint.service.ts
│   │   ├── theme.service.ts (optional)
│   │   └── web-vitals.service.ts
│   ├── shared/
│   │   └── shared.module.ts
│   └── app.component.ts
├── assets/
│   └── images/
├── styles.css (global)
└── index.html (with viewport meta tag)
```

---

## 🔑 Key Concepts Used Across Prompts

### CSS Units
- `rem` - Relative to root font-size ✅ Use this
- `em` - Relative to parent font-size
- `clamp()` - Fluid sizing ✅ Use this
- `vw/vh` - Viewport relative (use carefully)

### Breakpoints
```
xs:  0px (mobile)
sm:  576px
md:  768px (tablet)
lg:  992px
xl:  1200px (desktop)
xxl: 1400px
```

### Mobile-First Approach
```
/* Mobile (default) */
.element { width: 100%; }

/* Tablet and up */
@media (min-width: 768px) { /* Add features */ }

/* Desktop */
@media (min-width: 1200px) { /* More features */ }
```

### Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **FID** (First Input Delay): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅

---

## 🎯 Learning Outcomes

After completing all 6 prompts, you will know:

✅ How to set up responsive Angular projects  
✅ How to build responsive layouts with Flexbox/Grid  
✅ How to create reusable responsive components  
✅ How to implement dark mode and accessibility  
✅ How to optimize images for different devices  
✅ How to test and monitor Core Web Vitals  
✅ How to achieve Lighthouse score > 90  
✅ Best practices for responsive Angular development

---

## 📚 Related Documentation

**Detailed Explanations:**
- `../explanation/` - 5 comprehensive theory files

**Code Examples:**
- `../examples/` - 39+ working examples

**Interview Questions:**
- `../interview-questions/` - 30+ Q&A

**Master Reference:**
- `../README.md` - Complete folder overview

---

## 🔄 Workflow

**Typical Development Flow:**

```
1. Read prompt file
   ↓
2. Follow step-by-step instructions
   ↓
3. Copy/modify component code
   ↓
4. Test on multiple breakpoints
   ↓
5. Move to next prompt
```

---

## 💡 Pro Tips

1. **Use Chrome DevTools:** F12 → Device Toolbar → Test all sizes
2. **Reference Examples:** Each prompt links to example files
3. **Test Frequently:** Don't wait until the end to test
4. **Use CSS Variables:** Makes changes easier across components
5. **Mobile-First:** Always design for smallest screen first
6. **Real Devices:** Test on actual phones/tablets if possible

---

## 🛠️ Tools Needed

- **Code Editor:** VS Code with Kiro
- **Browser:** Chrome, Firefox, or Safari
- **DevTools:** F12 for testing
- **CLI:** Angular CLI (`ng` command)
- **Image Tools:** (Optional) ImageOptim or Squoosh

---

## ⚡ Quick Commands

```bash
# Create new project
ng new my-responsive-app
cd my-responsive-app

# Start dev server
ng serve

# Generate component
ng generate component components/my-component

# Build for production
ng build --prod

# Run tests
ng test

# Check performance (Lighthouse)
# DevTools > Lighthouse > Analyze
```

---

## 📞 Getting Help

If you get stuck:

1. **Check the prompt again** - Most answers are in the step-by-step
2. **Review examples** - See `../examples/` for working code
3. **Read explanations** - Deep dive in `../explanation/`
4. **Interview Q&A** - See similar questions in `../interview-questions/`
5. **DevTools** - Use F12 to debug

---

## ✅ Completion Checklist

- [ ] All 6 prompts completed
- [ ] Project builds without errors: `ng build --prod`
- [ ] Lighthouse score > 90
- [ ] Responsive at 375px, 768px, 1920px
- [ ] Dark mode working
- [ ] Images optimized
- [ ] No console errors
- [ ] Touch targets 44px+
- [ ] Core Web Vitals targets met

---

## 🎓 Next Steps After Prompts

After completing all prompts:

1. **Add features** - Build your actual application on this foundation
2. **Add state management** - NgRx, Akita, or Services
3. **Add routing** - Angular Router for multi-page apps
4. **Add services** - HTTP, API calls, data management
5. **Deploy** - Netlify, Vercel, Firebase, or custom server

---

## 📈 Version & Status

**Prompts Version:** 1.0  
**Created:** August 22, 2026  
**Status:** ✅ Complete and tested

**Folder Structure:**
- 6 prompt files (detailed step-by-step)
- 1 README (this file)
- References to 5 explanation files
- References to 39+ code examples
- References to 30+ interview questions

**Total Content:** 6 focused, sequential prompts for responsive Angular development

---

**Ready to build responsive Angular apps? Start with Prompt #1! 🚀**
