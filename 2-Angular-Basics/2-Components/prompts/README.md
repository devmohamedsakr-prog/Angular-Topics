# Components - IDE Prompts

**Step-by-step guides for building Angular components and managing component architecture.**

---

## 📋 Prompt Files Overview

### 1. [Component Basics](./1-component-basics.md)
**Time:** 15-20 minutes | **Level:** Beginner

Create your first Angular components:
- Understand component structure (@Component decorator)
- Generate components with CLI
- External vs inline templates
- Component styling options
- Simple component logic

**Outcomes:**
- ✅ First component created
- ✅ Component renders on page
- ✅ Click handlers work
- ✅ Styles applied

---

### 2. [Component Input & Output](./2-input-output.md)
**Time:** 20-25 minutes | **Level:** Intermediate

Master parent-child component communication:
- @Input for passing data
- @Output for emitting events
- Two-way binding with @Input/@Output
- Passing objects and complex data
- Event handling

**Outcomes:**
- ✅ Parent passes data via @Input
- ✅ Child emits events via @Output
- ✅ Two-way binding works
- ✅ Parent-child communication established

---

### 3. [Component Lifecycle Hooks](./3-lifecycle-hooks.md)
**Time:** 20-25 minutes | **Level:** Intermediate

Handle component lifecycle and state management:
- Lifecycle phases (9 hooks)
- OnInit for initialization
- OnChanges for input detection
- OnDestroy for cleanup
- Memory leak prevention
- Observable subscription management

**Outcomes:**
- ✅ OnInit initializes component
- ✅ OnChanges detects input changes
- ✅ OnDestroy cleans up properly
- ✅ No memory leaks
- ✅ Subscriptions managed

---

### 4. [Advanced Component Patterns](./4-advanced-patterns.md)
**Time:** 25-30 minutes | **Level:** Intermediate-Advanced

Build production-ready component patterns:
- Smart (container) vs Dumb (presentational) components
- ViewChild and ContentChild
- Component composition
- Content projection (ng-content)
- Reusable form components
- Component inheritance

**Outcomes:**
- ✅ Smart/dumb pattern implemented
- ✅ ViewChild accesses child component
- ✅ Component composition works
- ✅ Reusable components created

---

## 🚀 Quick Start

**Complete Components Path (1.5 hours):**

```
1. Component Basics (20 min)
   ↓
2. Input & Output (25 min)
   ↓
3. Lifecycle Hooks (25 min)
   ↓
4. Advanced Patterns (30 min)
```

---

## 📊 Learning Outcomes

After completing all 4 prompts, you will:

✅ Be able to create Angular components  
✅ Understand @Component decorator  
✅ Implement parent-child communication  
✅ Manage component lifecycle  
✅ Build reusable, composable components  
✅ Handle memory leaks properly  
✅ Follow component best practices  
✅ Implement advanced patterns (smart/dumb)

---

## 🛠️ Commands Quick Reference

```bash
# Generate component
ng generate component components/name
ng g c components/name

# Generate module
ng generate module modules/name
ng g m modules/name

# Generate service
ng generate service services/name
ng g s services/name

# Development server
ng serve
npm start

# Run tests
ng test
npm test
```

---

## 📁 Component File Structure

```
components/
├── hello-world/
│   ├── hello-world.component.ts       (Logic)
│   ├── hello-world.component.html     (Template)
│   ├── hello-world.component.css      (Styles)
│   └── hello-world.component.spec.ts  (Tests)
├── button-component/
│   ├── button-component.component.ts
│   ├── button-component.component.html
│   ├── button-component.component.css
│   └── button-component.component.spec.ts
└── ...
```

---

## 🔑 Key Concepts

### @Input - Pass Data Down
```typescript
@Input() data: any;
```
```html
[data]="parentData"
```

### @Output - Emit Events Up
```typescript
@Output() eventName = new EventEmitter<any>();
```
```html
(eventName)="handleEvent($event)"
```

### Lifecycle Hooks
- **OnInit:** After component created
- **OnChanges:** When @Input changes
- **OnDestroy:** Before component destroyed
- **AfterViewInit:** After view rendered

### Smart vs Dumb
- **Smart:** Handles logic, API calls, state
- **Dumb:** Just displays data, emits events

---

## 💡 Pro Tips

1. **Keep components small** - Single responsibility
2. **Use @Input/@Output** - Make components reusable
3. **Unsubscribe in OnDestroy** - Prevent memory leaks
4. **Extract components** - Reuse across app
5. **Document @Input/@Output** - Clear interfaces
6. **Use smart/dumb pattern** - Separate concerns
7. **Test components** - Write unit tests

---

## 📚 Component Checklist

**Before using a component:**
- [ ] Component name is descriptive
- [ ] @Input properties documented
- [ ] @Output events documented
- [ ] Styles scoped to component
- [ ] OnDestroy cleans up
- [ ] No console errors/warnings
- [ ] Follows naming conventions

---

## 🔗 Related Files

**Theory & Examples:**
- `../explanation/` - Detailed component theory
- `../examples/` - 5+ working examples

**Interview Questions:**
- `../interview-questions/` - Q&A on components

**Other Folders:**
- `1-CLI-and-Setup/` - Setup & CLI
- `3-Templates-and-Binding/` - Template syntax
- `4-Directives/` - Angular directives
- `5-Internationalization/` - i18n
- `6-Responsive-Design/` - Responsive apps

---

## ✅ Completion Checklist

- [ ] Prompt 1: Basic component created and working
- [ ] Prompt 2: @Input and @Output implemented
- [ ] Prompt 3: Lifecycle hooks managing state
- [ ] Prompt 4: Advanced patterns understood
- [ ] Can create reusable components
- [ ] Know smart/dumb pattern
- [ ] Ready for Templates & Binding

---

## 🎓 Next Steps

After Components:

1. **Learn Templates** → `3-Templates-and-Binding/prompts/`
2. **Learn Directives** → `4-Directives/prompts/`
3. **Build Forms** → Add form control
4. **Add Services** → Data management
5. **Responsive Design** → `6-Responsive-Design/prompts/`

---

**Version:** 1.0  
**Created:** August 22, 2026  
**Status:** ✅ Complete

**Ready to master Angular components? Start with Prompt #1! 🚀**
