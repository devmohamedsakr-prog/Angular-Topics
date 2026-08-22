# 4-Directives - Complete Learning & Interview Resource

Angular directives deep dive with 5 focused explanation files, 5 comprehensive example files, 32+ interview Q&A, and best practices.

---

## 📚 Folder Structure

```
4-Directives/
├── explanation/
│   ├── 1-directive-basics-types.md       (2000+ lines, all fundamentals)
│   ├── 2-structural-directives.md        (*ngIf, *ngFor, *ngSwitch deep dive)
│   ├── 3-attribute-directives.md         ([ngClass], [ngStyle], [(ngModel)])
│   ├── 4-custom-directives.md            (@Directive decorator patterns)
│   └── 5-advanced-directives.md          (RxJS, composition, performance)
│
├── examples/
│   ├── 1-directive-basics.ts             (10 selector & binding examples)
│   ├── 2-structural-directives.ts        (12 *ngIf, *ngFor, *ngSwitch examples)
│   ├── 3-attribute-directives.ts         (12 [ngClass], [ngStyle], [(ngModel)] examples)
│   ├── 4-custom-directives.ts            (12 custom directive examples)
│   └── 5-advanced-directives.ts          (14 advanced patterns & optimization)
│
├── interview-questions/
│   ├── 1-directive-basics-qa.md          (10 Q&A: foundations)
│   ├── 2-custom-directives-qa.md         (10 Q&A: custom directives)
│   ├── 3-advanced-directives-qa.md       (12 Q&A: advanced patterns)
│   └── README.md                         (learning paths & index)
│
└── README.md (this file)
```

---

## 🎯 Quick Start

### For Learning
1. **Complete Beginner**: Start with `explanation/1-directive-basics-types.md`
2. **Code Along**: Open `examples/1-directive-basics.ts` in your editor
3. **Interview Prep**: Study `interview-questions/1-directive-basics-qa.md`

### For Interviews
1. Review `interview-questions/README.md` for learning paths
2. Pick your experience level (beginner/intermediate/advanced)
3. Study relevant Q&A files
4. Practice with examples

### For Reference
- Need basics? → `explanation/1-*.md`
- Want code examples? → `examples/3-*.ts`
- Interview prep? → `interview-questions/2-*.md`
- Advanced concepts? → `explanation/5-*.md`

---

## 📊 Content Overview

### Explanation Files (5 files, 2000+ lines)

#### 1-directive-basics-types.md
- What are directives and their types
- Component directives
- Structural directives (*ngIf, *ngFor, *ngSwitch)
- Attribute directives ([ngClass], [ngStyle])
- Directive lifecycle
- Key decorators: @Input, @Output, @HostListener, @HostBinding

#### 2-structural-directives.md
- *ngIf with else/then templates
- *ngFor with context, trackBy, performance
- *ngSwitch with default cases
- Performance comparison
- Common gotchas and best practices

#### 3-attribute-directives.md
- [ngClass] - single, object, array syntax
- [ngStyle] - single, object, units
- [(ngModel)] - two-way binding
- Combining directives
- Form integration

#### 4-custom-directives.md
- Creating custom directives with @Directive
- @Input, @Output, @HostListener, @HostBinding
- ElementRef vs Renderer2
- Directive lifecycle hooks
- exportAs for template access

#### 5-advanced-directives.md
- Directive inheritance and composition
- RxJS integration and reactivity
- Directive factories and patterns
- Performance optimization
- Testing and best practices
- Memory management

### Example Files (5 files, 60+ examples)

**1-directive-basics.ts** (10 examples)
- Element selector directive
- Attribute selector directive
- Class selector directive
- @Input, @HostBinding, @HostListener
- Focus and auto-focus
- Selector variations

**2-structural-directives.ts** (12 examples)
- *ngIf basic and with else
- *ngIf with then/else templates
- *ngFor simple and with context
- *ngFor with even/odd styling
- *ngFor with trackBy optimization
- Nested *ngFor
- *ngSwitch with cases
- Performance comparison

**3-attribute-directives.ts** (12 examples)
- [ngClass] single and object syntax
- [ngClass] array syntax and dynamic
- [ngStyle] single and object syntax
- [ngStyle] theme switching
- [(ngModel)] basic and with change detection
- Combined directives
- Form integration
- Performance patterns (cached vs computed)

**4-custom-directives.ts** (12 examples)
- Simple custom directive
- Custom directive with @Input
- @HostListener & @HostBinding
- Custom directive with @Output
- Validation directive
- Tooltip directive
- Focus trap directive
- Disable directive
- Debounce click directive
- Scroll position directive
- Dynamic style directive
- Permission-based directive

**5-advanced-directives.ts** (14 examples)
- Base directive with inheritance
- Composite directive pattern
- Directive with RxJS Subject
- OnChanges implementation
- Factory pattern
- Performance-optimized directive
- Validation with error messages
- Observer pattern (IntersectionObserver)
- Conditional structural directive
- Accessibility directive
- Analytics tracking directive
- Error handling directive
- State management in directives
- Testing-friendly directive

### Interview Questions (32+ Q&A)

**1-directive-basics-qa.md** (10 Q&A)
1. What are Angular Directives and three types
2. *ngIf vs [hidden]
3. *ngFor with TrackBy
4. Directive Selector types
5. @Input and @Output in directives
6. Directive Lifecycle Hooks
7. @HostListener and @HostBinding
8. ElementRef vs Renderer2
9. Custom Directive creation
10. @Input with setter logic

**2-custom-directives-qa.md** (10 Q&A)
1. Creating custom directives from scratch
2. @HostListener vs @HostBinding
3. @Input with setter logic
4. @HostListener with event modifiers
5. Reusable tooltip directive
6. Form validation directive
7. Combining multiple directives
8. exportAs for template access
9. Memory leak prevention
10. Summary table and takeaways

**3-advanced-directives-qa.md** (12 Q&A)
1. Directive inheritance
2. RxJS integration
3. Composition pattern
4. State management
5. IntersectionObserver usage
6. Performance monitoring
7. Async loading patterns
8. Testing directives
9. Performance best practices
10. Common antipatterns
11. Error handling patterns
12. Summary and key takeaways

---

## 🎓 Learning Paths

### Path 1: Complete Beginner (3 hours)
**Goal:** Understand all directive concepts and practice basics

1. Read `explanation/1-directive-basics-types.md`
2. Code along with `examples/1-directive-basics.ts`
3. Study `interview-questions/1-directive-basics-qa.md` Q1-Q5
4. Read `explanation/2-structural-directives.md`
5. Code along with `examples/2-structural-directives.ts`
6. Study `interview-questions/1-directive-basics-qa.md` Q6-Q10

### Path 2: Intermediate Developer (2 hours)
**Goal:** Master custom directives and patterns

1. Skim `explanation/1-directive-basics-types.md`
2. Deep read `explanation/4-custom-directives.md`
3. Code along with `examples/4-custom-directives.ts`
4. Study `interview-questions/2-custom-directives-qa.md` (all Q&A)
5. Review `explanation/3-attribute-directives.md` for [ngClass]/[ngStyle]

### Path 3: Advanced Developer (1.5 hours)
**Goal:** Advanced patterns, performance, architecture

1. Read `explanation/5-advanced-directives.md`
2. Study code in `examples/5-advanced-directives.ts`
3. Deep dive `interview-questions/3-advanced-directives-qa.md`
4. Focus on Q6-Q10 (performance, testing, patterns)

### Path 4: Interview Prep (2 hours)
**Goal:** Prepare for technical interviews

1. Read `interview-questions/README.md` for learning paths
2. Pick your level (beginner/intermediate/advanced)
3. Study all Q&A in your level files
4. Prepare code examples from memory
5. Practice explaining concepts verbally

---

## 🚀 Key Concepts

### Three Types of Directives
```
1. Components          - Directives with template and style
2. Structural          - Modify DOM structure (*ngIf, *ngFor, *ngSwitch)
3. Attribute           - Modify element appearance/behavior ([ngClass], [ngStyle])
```

### Essential Decorators
```typescript
@Input()              // Receive data from parent
@Output()             // Emit events to parent
@HostListener()       // Listen to host element events
@HostBinding()        // Bind to host element properties
```

### Selector Types
```typescript
selector: '[appHighlight]'        // Attribute selector
selector: 'app-card'              // Element selector
selector: '.card'                 // Class selector
selector: '[appRole="admin"]'      // Attribute with value
```

### Lifecycle Hooks
```typescript
ngOnInit()            // After component initialization
ngOnChanges()         // When inputs change
ngOnDestroy()         // Before component destruction (cleanup!)
ngAfterViewInit()     // After view initialization
```

---

## 💡 Best Practices

✅ **DO:**
- Use `Renderer2` for DOM manipulation
- Implement `ngOnDestroy` and cleanup subscriptions
- Use `trackBy` with `*ngFor`
- Cache computed values for performance
- Test directives with test components
- Document inputs and outputs
- Use TypeScript for type safety
- Keep directives focused and single-responsibility

❌ **DON'T:**
- Access DOM directly with `ElementRef`
- Forget to unsubscribe from observables
- Use `[hidden]` instead of `*ngIf` for performance
- Recompute expensive operations in getters
- Mix multiple responsibilities in one directive
- Forget to handle edge cases
- Skip error handling
- Ignore memory management

---

## 📈 Complexity Levels

| Concept | Level | File |
|---------|-------|------|
| Basic selectors | ⭐ | 1-basics |
| *ngIf, *ngFor | ⭐⭐ | 2-structural |
| [ngClass], [ngStyle] | ⭐⭐ | 3-attribute |
| Custom directives | ⭐⭐⭐ | 4-custom |
| Inheritance, RxJS | ⭐⭐⭐⭐ | 5-advanced |
| Performance optimization | ⭐⭐⭐⭐⭐ | 5-advanced |

---

## 🔍 Quick Reference

### Need to find...

**How to use @Input?**
- Explanation: `explanation/1-directive-basics-types.md`
- Example: `examples/1-directive-basics.ts` (Example 4)
- Q&A: `interview-questions/1-directive-basics-qa.md` (Q5)

**How to create custom directive?**
- Explanation: `explanation/4-custom-directives.md`
- Example: `examples/4-custom-directives.ts` (Examples 1-2)
- Q&A: `interview-questions/2-custom-directives-qa.md` (Q1)

**Performance tips?**
- Explanation: `explanation/5-advanced-directives.md`
- Example: `examples/5-advanced-directives.ts`
- Q&A: `interview-questions/3-advanced-directives-qa.md` (Q9-Q10)

**How to test?**
- Q&A: `interview-questions/3-advanced-directives-qa.md` (Q8)

---

## 📊 Statistics

| Metric | Count |
|--------|-------|
| Explanation Files | 5 |
| Example Files | 5 |
| Code Examples | 60+ |
| Interview Q&A | 32+ |
| Topics Covered | 30+ |
| Total Lines | 5000+ |
| Skill Levels | 5 (⭐ to ⭐⭐⭐⭐⭐) |

---

## 🎯 Interview Success Criteria

You're ready when you can:

- ✅ Explain all three directive types
- ✅ Discuss @Input, @Output, @HostListener, @HostBinding
- ✅ Implement a custom directive from scratch
- ✅ Optimize *ngFor with trackBy
- ✅ Explain ElementRef vs Renderer2
- ✅ Handle memory management with OnDestroy
- ✅ Discuss performance considerations
- ✅ Compare different directive patterns
- ✅ Answer follow-up questions confidently
- ✅ Provide code examples from memory

---

## 🔗 Navigation

**Main Topics:**
- [Explanation Files](./explanation/) - Theory and concepts
- [Example Code](./examples/) - Working implementations
- [Interview Q&A](./interview-questions/) - Interview preparation
- [Parent: Angular-Basics](../) - Other folders

**Related Resources:**
- [1-CLI-and-Setup](../1-CLI-and-Setup/) - Angular project setup
- [2-Components](../2-Components/) - Component directives
- [3-Templates-and-Binding](../3-Templates-and-Binding/) - Template syntax
- [5-Internationalization](../5-Internationalization/) - i18n patterns
- [6-Responsive-Design](../6-Responsive-Design/) - Responsive patterns

---

## 📝 How to Use

### For Learning
1. Start with explanation files (top-to-bottom)
2. Code along with examples in your editor
3. Run examples and modify them
4. Practice building variations

### For Reference
1. Use quick reference section above
2. Search for specific concept
3. Check examples for implementation
4. Review best practices

### For Interviews
1. Read interview questions multiple times
2. Practice explaining without reading
3. Prepare code examples from memory
4. Time yourself (1-2 min per question)

---

## ✨ Key Highlights

### Comprehensive Coverage
- From basic selectors to advanced RxJS patterns
- Real-world directive examples
- Best practices and anti-patterns
- Performance optimization techniques

### Interview Ready
- 32+ actual interview questions
- Multiple learning paths
- Categorized by difficulty
- Success criteria checklist

### Production Ready Code
- All examples are working TypeScript
- Follow Angular best practices
- Include error handling
- Demonstrate performance optimization

### Structured Learning
- Clear progression from basic to advanced
- Each file builds on previous knowledge
- Multiple learning paths for different levels
- Quick reference and search-friendly

---

## 📖 Reading Time Estimates

| Section | Time | Difficulty |
|---------|------|-----------|
| Explanation 1 | 30 min | ⭐ |
| Examples 1-2 | 20 min | ⭐ |
| Interview Q&A 1 | 25 min | ⭐ |
| Explanation 3-4 | 40 min | ⭐⭐⭐ |
| Examples 4-5 | 30 min | ⭐⭐⭐ |
| Interview Q&A 2-3 | 50 min | ⭐⭐⭐⭐ |
| **Total** | **195 min** | **Mixed** |

---

## 🎓 Certification Readiness

After completing this folder, you'll be ready for:
- ✅ Angular certification exams (directives section)
- ✅ Technical interviews (directive knowledge)
- ✅ Production code (best practices)
- ✅ Senior roles (advanced patterns)

---

**Last Updated:** August 2026
**Version:** 1.0 - Complete Refactor
**Maintenance:** Actively maintained
**Contributors:** Angular Learning Team
