# Templates and Binding - IDE Prompts

**Step-by-step guides for Angular template syntax and data binding.**

---

## 📋 Prompt Files Overview

### 1. [Interpolation & Property Binding](./1-interpolation-binding.md)
**Time:** 15-20 minutes | **Level:** Beginner

Display data and bind to element properties:
- Interpolation {{ }}
- Property binding [property]
- Attribute binding [attr.name]
- Class binding [class]
- Style binding [style]
- Pipes | date, | currency

**Outcomes:**
- ✅ Data displays via interpolation
- ✅ Properties bind dynamically
- ✅ Classes apply conditionally
- ✅ Styles update dynamically
- ✅ Pipes format data

---

### 2. [Event Binding & Two-Way](./2-event-binding.md)
**Time:** 20-25 minutes | **Level:** Beginner-Intermediate

Handle user interactions and sync data:
- Event binding (click), (input), (change)
- Two-way binding [(ngModel)]
- Form submission (ngSubmit)
- Keyboard events (keyup.enter)
- Passing event objects ($event)

**Outcomes:**
- ✅ Click events handled
- ✅ Form data synced
- ✅ Two-way binding works
- ✅ Form submission working
- ✅ Keyboard events captured

---

### 3. [Structural Directives](./3-structural-directives.md)
**Time:** 20-25 minutes | **Level:** Beginner-Intermediate

Control template rendering and loops:
- *ngIf for conditionals
- *ngFor for loops with trackBy
- *ngSwitch for multiple cases
- ng-template for complex templates
- Performance optimization

**Outcomes:**
- ✅ Conditional rendering works
- ✅ Loops display arrays
- ✅ trackBy improves performance
- ✅ Switch cases handled
- ✅ Complex templates render

---

### 4. [Advanced Template Techniques](./4-advanced-templates.md)
**Time:** 20-25 minutes | **Level:** Intermediate-Advanced

Master complex template patterns:
- Content projection (ng-content)
- ng-container (no extra DOM)
- Template variables
- Complex conditionals
- Async pipe with observables
- Safe navigation operator

**Outcomes:**
- ✅ Content projection works
- ✅ No DOM bloat
- ✅ Template variables accessible
- ✅ Observables unwrapped
- ✅ Complex patterns implemented

---

## 🚀 Quick Start

**Complete Templates Path (1.5 hours):**

```
1. Interpolation & Binding (20 min)
   ↓
2. Event Binding (25 min)
   ↓
3. Structural Directives (25 min)
   ↓
4. Advanced Techniques (25 min)
```

---

## 📊 Learning Outcomes

After completing all 4 prompts:

✅ Master Angular template syntax  
✅ Implement all types of data binding  
✅ Handle user events  
✅ Loop through arrays efficiently  
✅ Conditionally render templates  
✅ Use pipes to format data  
✅ Handle observables with async pipe  
✅ Build complex, performant templates  

---

## 🛠️ Template Syntax Cheat Sheet

```html
<!-- Interpolation -->
{{ property }}
{{ method() }}
{{ expression }}

<!-- Property Binding -->
[property]="value"
[disabled]="isDisabled"
[src]="imageUrl"

<!-- Event Binding -->
(event)="handler()"
(click)="onClick()"
(input)="onInput($event)"

<!-- Two-Way Binding -->
[(ngModel)]="property"

<!-- Structural Directives -->
*ngIf="condition"
*ngFor="let item of items"
*ngSwitch="value"

<!-- Pipes -->
{{ date | date: 'short' }}
{{ price | currency }}
{{ text | uppercase }}

<!-- Safe Navigation -->
{{ object?.property }}
```

---

## 📁 Template Organization

```
templates/
├── Interpolation      {{ }}
├── Property Binding   [property]
├── Event Binding      (event)
├── Two-Way Binding    [(ngModel)]
├── Structural Dir.    *ngIf, *ngFor
└── Pipes              | pipe
```

---

## 🔑 Key Concepts

### Data Binding Flow

```
Component Property
      ↓
Interpolation {{ }}
Property Binding [property]
Two-Way Binding [(ngModel)]
      ↓
Template Display
```

### Event Flow

```
User Action
      ↓
Event Binding (event)
      ↓
Component Handler
      ↓
Update Component Data
      ↓
Template Re-renders
```

### Conditional Rendering

```
*ngIf       → if/else
*ngSwitch   → switch/case
ng-template → complex logic
```

---

## 💡 Pro Tips

1. Use {{ }} for display  
2. Use [property] for binding  
3. Use (event) for events  
4. Use [(ngModel)] for two-way  
5. Use pipes to format  
6. Use safe navigation (?.)  
7. Use trackBy in loops  
8. Use ng-container for groups  

---

## ✅ Template Best Practices

- [ ] Keep expressions simple
- [ ] Move complex logic to component
- [ ] Use safe navigation for optional properties
- [ ] Always use trackBy in *ngFor
- [ ] Import FormsModule for [(ngModel)]
- [ ] Use async pipe for observables
- [ ] Minimize ng-template complexity
- [ ] Test template rendering

---

## 🔗 Related Files

**Theory & Examples:**
- `../explanation/` - Detailed template theory
- `../examples/` - 5+ working examples

**Interview Questions:**
- `../interview-questions/` - Q&A on templates

**Other Folders:**
- `1-CLI-and-Setup/` - Setup
- `2-Components/` - Components
- `4-Directives/` - Directives
- `5-Internationalization/` - i18n
- `6-Responsive-Design/` - Responsive

---

## ✅ Completion Checklist

- [ ] Prompt 1: Interpolation & binding work
- [ ] Prompt 2: Events handled
- [ ] Prompt 3: Loops and conditions work
- [ ] Prompt 4: Advanced patterns understood
- [ ] Can build complex templates
- [ ] Know performance best practices
- [ ] Ready for Directives

---

## 🎓 Next Steps

After Templates & Binding:

1. **Learn Directives** → `4-Directives/prompts/`
2. **Learn i18n** → `5-Internationalization/prompts/`
3. **Learn Responsive** → `6-Responsive-Design/prompts/`
4. **Build Forms** → Add form validation
5. **Build Services** → Data management

---

**Version:** 1.0  
**Created:** August 22, 2026  
**Status:** ✅ Complete

**Master Angular templates! Start with Prompt #1! 🚀**
