# Directives - Interview Questions Index

Complete interview preparation guide with 32+ Q&A covering directive concepts from basics to advanced patterns.

## Files Overview

### 📋 [1-directive-basics-qa.md](./1-directive-basics-qa.md)
**10 Questions | Foundational Concepts**

Core directive knowledge and common interview questions:
- What are Angular directives and their three types
- *ngIf vs [hidden] differences
- *ngFor with TrackBy optimization
- Directive selectors (attribute, element, class)
- @Input and @Output decorators
- Directive lifecycle hooks
- @HostListener and @HostBinding
- ElementRef vs Renderer2
- Creating custom directives
- @Input with setters and aliases

**Best for:** Foundation knowledge, junior developers, initial interviews

---

### 🛠️ [2-custom-directives-qa.md](./2-custom-directives-qa.md)
**10 Questions | Custom Directive Patterns**

Building custom directives with advanced techniques:
- Creating custom directives from scratch
- @HostListener vs @HostBinding differences
- @Input with setter logic and validation
- @HostListener with event modifiers and $event
- Reusable tooltip directive example
- Form validation directive patterns
- Combining multiple directives
- Directive exportAs for template access
- Memory leak prevention
- Best practices checklist

**Best for:** Mid-level developers, practical implementations, system design

---

### 🚀 [3-advanced-directives-qa.md](./3-advanced-directives-qa.md)
**12 Questions | Advanced Patterns & Optimization**

Complex directive patterns and performance optimization:
- Directive inheritance and composition
- RxJS integration in directives
- Composition pattern with config objects
- Directive state management
- IntersectionObserver for lazy loading
- Performance monitoring directives
- Async loading patterns
- Testing directives comprehensively
- Performance best practices
- Common antipatterns to avoid
- Advanced architectural patterns

**Best for:** Senior developers, system architects, performance optimization

---

## Learning Paths

### Path 1: Complete Beginner
**Time: 2-3 hours | Coverage: 100%**

1. Start with **1-directive-basics-qa.md** (read top-to-bottom)
2. Review each concept with the examples from `../examples/` folder
3. Practice implementing basic directives
4. Move to **2-custom-directives-qa.md**
5. Build custom directives following the patterns
6. Finally review **3-advanced-directives-qa.md** for advanced concepts

### Path 2: Intermediate Developer
**Time: 1-2 hours | Coverage: 70%**

1. Skim **1-directive-basics-qa.md** (focus on Q7-Q10)
2. Deep dive into **2-custom-directives-qa.md** (Q1-Q8)
3. Review examples for custom and advanced directives
4. Study Q1-Q5 of **3-advanced-directives-qa.md**

### Path 3: Senior/Advanced Interview
**Time: 1 hour | Coverage: 50%**

1. Review **3-advanced-directives-qa.md** (all questions)
2. Focus on Q6-Q10 of **2-custom-directives-qa.md**
3. Be ready to discuss performance and architecture trade-offs
4. Prepare code examples from memory

---

## Quick Reference by Topic

### Structural Directives
- **1-directive-basics-qa.md**: Q2, Q3
- **Examples**: `2-structural-directives.ts`

### Attribute Directives
- **1-directive-basics-qa.md**: Q7, Q8
- **Examples**: `3-attribute-directives.ts`

### Custom Directives
- **2-custom-directives-qa.md**: Q1-Q4
- **Examples**: `4-custom-directives.ts`

### Advanced Patterns
- **3-advanced-directives-qa.md**: All questions
- **Examples**: `5-advanced-directives.ts`

### Performance & Optimization
- **2-custom-directives-qa.md**: Q9
- **3-advanced-directives-qa.md**: Q9-Q10
- **Examples**: Performance patterns in `5-advanced-directives.ts`

### Testing & Best Practices
- **2-custom-directives-qa.md**: Q9
- **3-advanced-directives-qa.md**: Q8-Q10

---

## Key Concepts Summary

### Three Types of Directives
1. **Components** - Directives with template
2. **Structural** - Modify DOM (*ngIf, *ngFor, *ngSwitch)
3. **Attribute** - Modify behavior/appearance ([ngClass], [ngStyle])

### Essential Decorators
- `@Input` - Receive data
- `@Output` - Emit events
- `@HostListener` - Listen to host events
- `@HostBinding` - Bind to host properties

### Lifecycle Hooks
- `ngOnInit` - After initialization
- `ngOnChanges` - When inputs change
- `ngOnDestroy` - Before destruction (cleanup here!)

### Best Practices
✅ Always use `Renderer2` instead of direct `ElementRef`
✅ Clean up subscriptions in `ngOnDestroy`
✅ Use `takeUntil(destroy$)` with RxJS
✅ Keep directives focused and single-responsibility
✅ Cache computed values for performance
✅ Test directives with test components

---

## Statistics

| Metric | Count |
|--------|-------|
| Total Q&A | 32+ |
| Beginner Questions | 10 |
| Intermediate Questions | 10 |
| Advanced Questions | 12+ |
| Code Examples | 80+ |
| Topics Covered | 25+ |
| Interview Scenarios | 15+ |

---

## How to Use These Resources

### Before Interview
1. Pick your learning path based on experience level
2. Read each Q&A file thoroughly
3. Study code examples in parallel
4. Practice implementing patterns
5. Review antipatterns and mistakes

### During Interview
1. Reference specific examples from memory
2. Discuss performance trade-offs
3. Mention best practices proactively
4. Ask clarifying questions about requirements
5. Think out loud about design decisions

### After Interview
1. Review areas you struggled with
2. Deepen knowledge with advanced patterns
3. Practice edge cases and error handling
4. Build real-world projects using these concepts

---

## Related Files

- **Explanation Files**: `../explanation/1-5-*.md` (comprehensive theory)
- **Example Code**: `../examples/1-5-*.ts` (working implementations)
- **Main README**: `../README.md` (folder navigation)

---

## Interview Question Categories

### Fundamental Knowledge
Q1-Q3 from File 1 (types, *ngIf, *ngFor)

### Decorators & Binding
Q4-Q8 from File 1 (selectors, @Input/@Output, @Host*)

### Custom Implementation
Q1-Q4 from File 2 (creating, input/output, listeners)

### Real-World Patterns
Q5-Q8 from File 2 (tooltip, validation, composition)

### Architecture & Optimization
Q1-Q10 from File 3 (inheritance, RxJS, performance, testing)

---

## Common Interview Follow-Ups

**After Q1 (What are directives):**
- "Can you give a real-world example?"
- "How would you implement X directive?"

**After Q7 (Custom directives):**
- "How would you test this?"
- "What's the performance impact?"

**After Q10 (Advanced patterns):**
- "How would you handle error scenarios?"
- "What about accessibility?"

---

## Success Criteria

You're ready for an interview when you can:
- ✅ Explain all three directive types clearly
- ✅ Implement a custom directive from scratch
- ✅ Discuss @Input, @Output, @HostListener, @HostBinding
- ✅ Explain memory management and cleanup
- ✅ Discuss performance optimization
- ✅ Answer unexpected follow-up questions
- ✅ Provide code examples without looking up syntax

---

**Last Updated:** August 2026
**Version:** 1.0
**Total Content:** 2000+ lines across 3 files
