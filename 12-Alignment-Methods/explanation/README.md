# Code Alignment & Quality Standards

Complete guide to maintaining code quality, consistency, and best practices across Angular projects.

## Overview

Code alignment ensures that all team members follow the same standards, making code:
- **Consistent**: Same style everywhere
- **Maintainable**: Easy to understand and modify
- **Quality**: Catches bugs before production
- **Collaborative**: Team works efficiently together

## Key Pillars

### 1. **Code Formatting**
Automatic code style enforcement (indentation, spacing, line length)

### 2. **Code Linting**
Static analysis to find problematic code patterns

### 3. **Type Safety**
TypeScript strict mode for type checking

### 4. **Testing**
Unit tests, integration tests, E2E tests

### 5. **Git Hooks**
Automated checks before commits

### 6. **CI/CD**
Automated testing and deployment

---

## Code Quality Metrics

### What We Measure

```
┌─────────────────────────────────────────────┐
│  Code Quality Dimensions                    │
├─────────────────────────────────────────────┤
│ • Complexity: McCabe complexity < 10        │
│ • Coverage: Unit test coverage > 80%        │
│ • Duplication: DRY principle violations     │
│ • Documentation: JSDoc/comments coverage    │
│ • Performance: Bundle size, Core Web Vitals│
│ • Security: SAST scanning, vulnerability   │
│ • Accessibility: WCAG AA compliance        │
│ • Maintainability: Cyclomatic complexity   │
└─────────────────────────────────────────────┘
```

### Standards by Team

| Metric | Target | Tool | Enforcement |
|--------|--------|------|-------------|
| Lint Errors | 0 | ESLint | Pre-commit |
| Format Issues | 0 | Prettier | Pre-commit |
| Test Coverage | 80%+ | Istanbul | CI Pipeline |
| Code Duplication | <5% | SonarQube | CI Pipeline |
| Type Coverage | 100% | TypeScript | Compile time |
| Cyclomatic Complexity | <10 | ESLint | CI Pipeline |

---

## Angular Code Standards

### Component Structure

```typescript
// ✅ GOOD
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // Lifecycle
  // Inputs
  // Outputs
  // Public properties
  // Private properties
  // Constructor
  // Lifecycle hooks
  // Public methods
  // Private methods
}

// ❌ BAD
@Component({...})
export class UserProfileComponent {
  // Mixed order, hard to navigate
  private x: any;
  public method1() {}
  @Input() prop;
  ngOnInit() {}
  private method2() {}
}
```

### Service Pattern

```typescript
// ✅ GOOD
@Injectable({ providedIn: 'root' })
export class UserService {
  private userCache$ = new BehaviorSubject<User[]>([]);
  readonly users$ = this.userCache$.asObservable();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      tap((users) => this.userCache$.next(users)),
      shareReplay(1)
    );
  }
}

// ❌ BAD
export class UserService {
  users = [];

  constructor(private http: HttpClient) {}

  getUsers() {
    this.http.get('/api/users').subscribe((data) => {
      this.users = data; // Not observable, hard to track
    });
  }
}
```

### Reactive Forms Pattern

```typescript
// ✅ GOOD
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  age: [null, [Validators.required, Validators.min(18)]],
});

// ❌ BAD
this.form = new FormGroup({
  email: new FormControl(),
  age: new FormControl(),
});
```

---

## TypeScript Strict Mode

### Enable in tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Impact

```typescript
// With strict mode, these errors caught at compile time:

// ❌ Error: Object is possibly 'undefined'
const name = user.name.toUpperCase();

// ✅ Fixed:
const name = user?.name?.toUpperCase() ?? 'Unknown';

// ❌ Error: Parameter 'id' implicitly has type 'any'
function getUserId(id) { }

// ✅ Fixed:
function getUserId(id: string): string { }
```

---

## Documentation Standards

### JSDoc Comments

```typescript
/**
 * Calculates the total price including tax
 *
 * @param price - Base price before tax
 * @param taxRate - Tax rate as decimal (0.1 for 10%)
 * @returns Total price including tax
 * @throws Error if price is negative
 *
 * @example
 * const total = calculateTotal(100, 0.1); // Returns 110
 */
export function calculateTotal(price: number, taxRate: number): number {
  if (price < 0) throw new Error('Price cannot be negative');
  return price * (1 + taxRate);
}
```

### Comment Types

```typescript
// TODO: Add error handling for network failures
// FIXME: Memory leak in subscription
// HACK: Workaround for Angular bug #12345
// NOTE: This is intentionally slow for safety reasons
```

---

## Performance Standards

### Bundle Size Targets

```
Initial Bundle: < 100 KB (gzipped)
Lazy Chunk: < 50 KB (gzipped)
Total Bundle: < 300 KB (gzipped)

Measured with: ng build --stats-json
Analyzed with: webpack-bundle-analyzer
```

### Core Web Vitals Targets

| Metric | Target | Tool |
|--------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| FID (First Input Delay) | < 100ms | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Web Vitals |

---

## Security Standards

### OWASP Top 10 Compliance

```typescript
// ✅ SAFE: Use DomSanitizer
constructor(private sanitizer: DomSanitizer) {}

render(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}

// ❌ UNSAFE: Direct innerHTML
element.innerHTML = userInput; // XSS vulnerability
```

### Environment Variables

```typescript
// ✅ Use environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  apiKey: 'dev-key-only-for-development'
};

// ❌ Hardcode secrets
const API_KEY = 'secret-prod-key'; // NEVER hardcode!
```

---

## Accessibility Standards

### WCAG 2.1 Level AA

```html
<!-- ✅ GOOD: Semantic HTML -->
<button aria-label="Close dialog">×</button>
<label for="email">Email:</label>
<input id="email" type="email" required />
<nav aria-label="Main navigation">...</nav>

<!-- ❌ BAD: No semantic meaning -->
<div onclick="close()">×</div>
<input type="text" placeholder="Email" />
```

### Color Contrast

```scss
// ✅ GOOD: 4.5:1 ratio for normal text
color: #000;
background: #fff;

// ❌ BAD: 2:1 ratio (fails AA)
color: #666;
background: #999;
```

---

## Team Alignment Workflow

### Code Review Checklist

- [ ] Follows naming conventions
- [ ] Has unit tests (80%+ coverage)
- [ ] No console.log statements
- [ ] TypeScript strict mode compliant
- [ ] ESLint/Prettier check passes
- [ ] No security vulnerabilities
- [ ] Accessibility compliance checked
- [ ] Performance impact analyzed

### Quality Gates

```
PRE-COMMIT
├── Prettier (format)
├── ESLint (linting)
└── Husky (git hooks)

ON PUSH (CI/CD)
├── Build success
├── Unit tests (80%+)
├── E2E tests pass
├── SonarQube scan
├── Security scan
└── Performance budget

ON MERGE
└── Auto-deploy to staging
```

---

## Getting Started

1. **Install Tools**: See [Tools](../tools/README.md)
2. **Review Best Practices**: See [Best Practices](../best-practices/README.md)
3. **Setup Git Hooks**: Configure Husky and commitlint
4. **Run Quality Check**: `npm run quality`
5. **Create PR**: Follow team workflow in GitHub

---

## Resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [WCAG 2.1 Standards](https://www.w3.org/WAI/WCAG21/quickref/)

