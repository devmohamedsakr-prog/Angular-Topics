# E2E Testing Interview Questions

## Beginner Level

### Q1: What is E2E testing and how is it different from unit testing?

**Answer:**
E2E (End-to-End) testing simulates real user interactions with the entire application in a browser environment, testing multiple components and systems together. Unit testing, by contrast, tests individual components, functions, or services in isolation with mocked dependencies.

**Key Differences:**

| Aspect | E2E Testing | Unit Testing |
|--------|----------|-------------|
| Scope | Entire application workflow | Single unit/function |
| Dependencies | Real or mocked API calls | Mocked dependencies |
| Browser | Real browser required | Not needed |
| Speed | Slower (minutes to hours) | Fast (milliseconds) |
| Fragility | More brittle | More stable |
| Coverage | User workflows | Code coverage |
| Setup | Complex | Simple |

**Example:**
```typescript
// Unit test - tests component in isolation
it('should display user name', () => {
  component.user = { name: 'John' };
  fixture.detectChanges();
  expect(component.username).toBe('John');
});

// E2E test - tests entire flow
it('should login and display user name', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type('user@example.com');
  cy.get('input[name="password"]').type('password');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
  cy.contains('Welcome, John').should('be.visible');
});
```

---

### Q2: Name popular E2E testing frameworks and compare them.

**Answer:**

| Framework | Pros | Cons | Best For |
|-----------|------|------|----------|
| **Cypress** | Easy to use, great DX, time-travel debugging, good docs | Limited browsers, single tab | Modern, well-maintained apps |
| **Playwright** | Multi-browser, fast, parallel execution, enterprise ready | Steeper learning curve | Cross-browser testing |
| **Protractor** | Built for Angular, familiar syntax | **DEPRECATED** since Angular 12 | Legacy Angular projects |
| **Selenium** | Multi-language, long history, widely used | Flaky, slow, complex setup | Legacy projects |
| **WebdriverIO** | Multi-browser, fluent API, CI/CD friendly | Less adoption than Cypress | Enterprise applications |

**Recommendation:**
- **New projects**: Use Cypress (best DX) or Playwright (need cross-browser)
- **Legacy Angular**: Migrate from Protractor to Cypress
- **Enterprise**: Consider Playwright for scalability

---

### Q3: What are common challenges in E2E testing and how do you address them?

**Answer:**

**Challenge 1: Flaky Tests (Tests that fail randomly)**
```typescript
// ❌ Bad - Flaky test
it('should display element', () => {
  cy.visit('/page');
  cy.get('.element').should('exist'); // May fail if element not yet loaded
});

// ✅ Good - Reliable test
it('should display element', () => {
  cy.visit('/page');
  cy.get('.element', { timeout: 10000 }).should('be.visible'); // Waits up to 10s
});
```

**Challenge 2: Hard to Find Elements**
```typescript
// ❌ Bad - Too generic
cy.get('div').click();
cy.get('button').contains('Save').click();

// ✅ Good - Use data attributes
cy.get('[data-testid="save-button"]').click();
```

**Challenge 3: Test Dependencies**
```typescript
// ❌ Bad - Tests depend on order
it('test 1', () => { cy.login(); });
it('test 2', () => { cy.verify_dashboard(); }); // Depends on test 1

// ✅ Good - Each test is independent
it('test 1', () => {
  cy.login();
  cy.verify_dashboard();
});

it('test 2', () => {
  cy.login();
  cy.verify_user_menu();
});
```

**Challenge 4: Slow Tests**
- Mock external APIs
- Parallelize execution
- Use test fixtures
- Cache authentication state

---

### Q4: Explain the Page Object Model pattern.

**Answer:**

The Page Object Model (POM) is a design pattern that creates an abstraction layer for web pages. Each page has a corresponding class that represents all its elements and interactions.

**Benefits:**
- Maintainability: Changes to page elements only affect the page object
- Readability: Tests focus on what they do, not implementation details
- Reusability: Common actions can be reused across tests
- Scalability: Easier to add new tests

**Example:**
```typescript
// page-objects/login.page.ts
export class LoginPage {
  private usernameInput = 'input[name="username"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'button[type="submit"]';

  login(username: string, password: string) {
    cy.get(this.usernameInput).type(username);
    cy.get(this.passwordInput).type(password);
    cy.get(this.loginButton).click();
  }

  verifyErrorMessage(message: string) {
    cy.contains(message).should('be.visible');
  }
}

// test file
it('should login successfully', () => {
  const loginPage = new LoginPage();
  loginPage.login('user', 'password');
  // Verify on dashboard
});
```

---

### Q5: How do you handle API mocking in E2E tests?

**Answer:**

API mocking allows you to control API responses without depending on real backends, making tests faster and more reliable.

**Using Cypress Intercept:**
```typescript
it('should mock API response', () => {
  cy.intercept('GET', '/api/users', {
    statusCode: 200,
    body: [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' }
    ]
  }).as('getUsers');

  cy.visit('/users');
  cy.wait('@getUsers');
  
  cy.contains('User 1').should('be.visible');
});
```

**Mocking Error Responses:**
```typescript
it('should handle API errors', () => {
  cy.intercept('POST', '/api/submit', {
    statusCode: 500,
    body: { error: 'Server error' }
  }).as('submitError');

  cy.visit('/form');
  cy.get('button[type="submit"]').click();
  cy.wait('@submitError');
  
  cy.contains('Error').should('be.visible');
});
```

**Benefits:**
- No dependency on backend
- Faster test execution
- Test error scenarios easily
- Control response times

---

## Intermediate Level

### Q6: What's the difference between Cypress and Playwright? When would you choose each?

**Answer:**

**Cypress:**
- Runs in the browser (same process as app)
- Better developer experience
- Time-travel debugging
- JavaScript only
- Single browser tab
- Better for: UI-heavy applications, rapid development

**Playwright:**
- Runs outside the browser via Chrome DevTools Protocol
- Multi-browser support (Chrome, Firefox, Safari, Edge)
- Better performance
- Multiple languages (JS, Python, Java, C#)
- Can control multiple tabs/windows
- Better for: Cross-browser testing, enterprise projects

**Comparison Table:**
```
Feature              | Cypress    | Playwright
---------------------|------------|----------
Single Page Tabs     | ✅ Limited | ✅ Full
Multi-browser        | ⚠️ Improving | ✅ Excellent
Parallel Execution   | ⚠️ Limited | ✅ Native
Performance          | ✅ Good   | ✅✅ Excellent
Time-travel Debug    | ✅ Yes    | ❌ No
Developer Experience | ✅✅ Best | ✅ Good
Speed                | ⚠️ Slow   | ✅ Fast
```

**When to use Cypress:**
```typescript
// Small to medium projects
// Single browser is OK
// Need great dev experience
// Rapid feedback during development
```

**When to use Playwright:**
```typescript
// Need cross-browser testing
// Enterprise applications
// Performance is critical
// Multiple tabs/windows needed
```

---

### Q7: How do you prevent flaky E2E tests?

**Answer:**

**1. Use Explicit Waits Instead of Hard Waits**
```typescript
// ❌ Flaky - Hard wait
cy.wait(2000);
cy.get('.data').should('exist');

// ✅ Good - Explicit wait
cy.get('.data', { timeout: 10000 }).should('be.visible');
cy.get('.spinner').should('not.exist');
```

**2. Use Proper Selectors**
```typescript
// ❌ Bad
cy.get('div').click();
cy.get('button').contains('Save').click();

// ✅ Good
cy.get('[data-testid="save-button"]').click();
```

**3. Handle Async Operations**
```typescript
// ✅ Wait for network to complete
cy.intercept('POST', '/api/**').as('apiCall');
cy.get('button').click();
cy.wait('@apiCall');
cy.contains('Success').should('be.visible');
```

**4. Use Retry Logic**
```typescript
// ✅ Cypress automatically retries assertions
cy.get('.dynamic-element')
  .should('be.visible'); // Retries if not found

// ✅ Playwright also has retry logic
await expect(page.locator('.element')).toBeVisible();
```

**5. Handle Loading States**
```typescript
// ✅ Wait for loading to appear and disappear
cy.get('[data-testid="loader"]').should('be.visible');
cy.get('[data-testid="loader"]').should('not.be.visible');
cy.contains('Data').should('be.visible');
```

**6. Ensure Test Isolation**
```typescript
// ❌ Tests dependent on each other
describe('flow', () => {
  it('login', () => { cy.login(); });
  it('verify', () => { /* depends on login */ });
});

// ✅ Each test is independent
beforeEach(() => {
  cy.login(); // Every test logs in
});
```

---

### Q8: How do you organize E2E tests for a large application?

**Answer:**

**Folder Structure:**
```
e2e/
├── fixtures/              # Test data
│   ├── users.json
│   ├── products.json
│   └── sample.csv
├── page-objects/          # Page object models
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   └── checkout.page.ts
├── support/               # Helper functions
│   ├── commands.ts        # Custom commands
│   ├── auth.helper.ts
│   └── api.helper.ts
├── specs/                 # Test files organized by feature
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── checkout/
│   │   ├── cart.spec.ts
│   │   ├── payment.spec.ts
│   │   └── order-confirmation.spec.ts
│   ├── user-profile/
│   │   ├── view-profile.spec.ts
│   │   └── edit-profile.spec.ts
│   └── smoke/             # Quick sanity tests
│       └── critical-flows.spec.ts
├── cypress.config.ts
└── tsconfig.json
```

**Custom Commands (support/commands.ts):**
```typescript
// Register custom command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Usage in tests
cy.login('user@example.com', 'password');
```

**Test Organization by Feature:**
```typescript
// specs/auth/login.spec.ts
describe('Authentication - Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('when user enters valid credentials', () => {
    it('should navigate to dashboard', () => {
      // Test code
    });
  });

  describe('when user enters invalid credentials', () => {
    it('should display error message', () => {
      // Test code
    });
  });
});
```

---

### Q9: How do you handle authentication in E2E tests?

**Answer:**

**Option 1: Authentication Through UI**
```typescript
// Simple but slow - repeated for each test
beforeEach(() => {
  cy.visit('/login');
  cy.get('input[name="email"]').type('user@example.com');
  cy.get('input[name="password"]').type('password');
  cy.get('button[type="submit"]').click();
});
```

**Option 2: Using Custom Commands (Recommended)**
```typescript
// support/commands.ts
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Usage
beforeEach(() => {
  cy.login('user@example.com', 'password');
});
```

**Option 3: Direct API Authentication (Fastest)**
```typescript
// support/commands.ts
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/login',
    body: { email, password }
  }).then(response => {
    // Save token to localStorage
    localStorage.setItem('authToken', response.body.token);
  });
  
  cy.visit('/dashboard');
});

// Usage - much faster
beforeEach(() => {
  cy.loginViaAPI('user@example.com', 'password');
});
```

**Option 4: Preserve Session Between Tests**
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:4200',
    // Preserve session
    chromeWebSecurity: false,
    viewportWidth: 1280,
    viewportHeight: 720
  },
  
  // Login once before all tests
  setupFilesAfterEnv: ['cypress/support/auth-setup.ts']
});

// support/auth-setup.ts
before(() => {
  cy.login('user@example.com', 'password');
  cy.window().then(win => {
    // Save auth state
    localStorage.setItem('authState', JSON.stringify({
      token: win.localStorage.getItem('token'),
      user: win.localStorage.getItem('user')
    }));
  });
});

// Use saved state in tests
beforeEach(() => {
  cy.window().then(win => {
    const authState = JSON.parse(localStorage.getItem('authState'));
    localStorage.setItem('token', authState.token);
    localStorage.setItem('user', authState.user);
  });
});
```

---

### Q10: How do you test components that rely on external APIs or WebSockets?

**Answer:**

**Mocking External APIs:**
```typescript
it('should handle API data', () => {
  cy.intercept('GET', 'https://external-api.com/data', {
    statusCode: 200,
    body: { data: 'external data' }
  }).as('externalApi');

  cy.visit('/page-with-external-data');
  cy.wait('@externalApi');
  
  cy.contains('external data').should('be.visible');
});
```

**Testing WebSocket Communication:**
```typescript
// ⚠️ WebSockets are harder to test in E2E
// Option 1: Mock WebSocket messages

Cypress.Commands.add('mockWebSocket', (url, messages) => {
  cy.window().then(win => {
    // Override WebSocket
    const originalWebSocket = win.WebSocket;
    
    win.WebSocket = class MockWebSocket {
      constructor(wsUrl) {
        this.url = wsUrl;
        setTimeout(() => {
          this.onopen?.();
          messages.forEach((msg, i) => {
            setTimeout(() => {
              this.onmessage?.({ data: JSON.stringify(msg) });
            }, i * 100);
          });
        }, 100);
      }
      
      send(data) {
        // Handle send
      }
    };
  });
});

// Usage
it('should receive WebSocket messages', () => {
  cy.mockWebSocket('ws://localhost', [
    { type: 'notification', message: 'You have a new message' }
  ]);
  
  cy.visit('/notifications');
  cy.contains('You have a new message').should('be.visible');
});
```

**Option 2: Use Real WebSocket with Test Server:**
```typescript
it('should connect to WebSocket', () => {
  // Assuming test server is running
  cy.visit('/chat');
  
  // Send message
  cy.get('input[name="message"]').type('Hello');
  cy.get('button[type="submit"]').click();
  
  // Verify message appears
  cy.contains('Hello').should('be.visible');
  
  // Wait for response
  cy.contains('Message received', { timeout: 5000 }).should('be.visible');
});
```

---

## Advanced Level

### Q11: How do you structure and scale E2E tests for a microservices architecture?

**Answer:**

**Challenge:** Multiple independent services to test

**Solution - Service API Mocking Strategy:**
```typescript
// cypress/support/mock-services.ts
export class ServiceMocker {
  static mockAllServices() {
    // Mock User Service
    cy.intercept('GET', 'http://user-service/api/**', req => {
      req.reply({ statusCode: 200, body: { /* user data */ } });
    }).as('userService');

    // Mock Order Service
    cy.intercept('GET', 'http://order-service/api/**', req => {
      req.reply({ statusCode: 200, body: { /* order data */ } });
    }).as('orderService');

    // Mock Inventory Service
    cy.intercept('GET', 'http://inventory-service/api/**', req => {
      req.reply({ statusCode: 200, body: { /* inventory data */ } });
    }).as('inventoryService');
  }

  static mockServiceFailure(serviceName: string) {
    const endpoints = {
      userService: 'http://user-service/api/**',
      orderService: 'http://order-service/api/**',
      inventoryService: 'http://inventory-service/api/**'
    };

    cy.intercept(endpoints[serviceName], {
      statusCode: 503,
      body: { error: 'Service Unavailable' }
    }).as(`${serviceName}Failure`);
  }
}

// Usage
describe('Checkout Flow', () => {
  beforeEach(() => {
    ServiceMocker.mockAllServices();
  });

  it('should complete checkout with all services', () => {
    cy.visit('/checkout');
    // All services mocked and working
  });

  it('should handle inventory service failure', () => {
    ServiceMocker.mockServiceFailure('inventoryService');
    cy.visit('/checkout');
    cy.contains('Inventory service unavailable').should('be.visible');
  });
});
```

**Contract Testing:**
```typescript
// Ensure API contracts are followed
it('should receive valid user response format', () => {
  cy.request('GET', 'http://localhost:3000/api/user/123')
    .then(response => {
      // Validate contract
      expect(response.body).to.have.all.keys('id', 'name', 'email', 'roles');
      expect(response.body.id).to.be.a('number');
      expect(response.body.name).to.be.a('string');
      expect(response.body.email).to.be.a('string');
      expect(response.body.roles).to.be.an('array');
    });
});
```

---

### Q12: How do you handle performance testing in E2E tests?

**Answer:**

```typescript
// cypress/support/performance.ts
export class PerformanceHelper {
  static measurePageLoadTime() {
    cy.visit('/');
    cy.window().then(win => {
      const perfData = win.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      cy.log(`Page Load Time: ${pageLoadTime}ms`);
      
      // Assert performance threshold
      expect(pageLoadTime).to.be.lessThan(3000); // Should load in < 3s
    });
  }

  static measureApiResponseTime(endpoint: string) {
    cy.request('GET', endpoint).then(response => {
      const duration = response.duration;
      cy.log(`API Response Time: ${duration}ms`);
      expect(duration).to.be.lessThan(500); // Should respond in < 500ms
    });
  }

  static measureFirstContentfulPaint() {
    cy.visit('/');
    cy.window().then(win => {
      const perfEntries = win.performance.getEntriesByName('first-contentful-paint');
      if (perfEntries.length > 0) {
        const fcp = perfEntries[0].startTime;
        cy.log(`First Contentful Paint: ${fcp}ms`);
        expect(fcp).to.be.lessThan(1500); // FCP < 1.5s
      }
    });
  }
}

// Usage
describe('Performance', () => {
  it('should load page in acceptable time', () => {
    PerformanceHelper.measurePageLoadTime();
  });

  it('should respond to API calls quickly', () => {
    PerformanceHelper.measureApiResponseTime('/api/users');
  });

  it('should paint content quickly', () => {
    PerformanceHelper.measureFirstContentfulPaint();
  });
});
```

---

### Q13: What's your strategy for maintaining E2E tests in CI/CD pipelines?

**Answer:**

**GitHub Actions Example:**
```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  e2e:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chrome, firefox, edge]
        node-version: [18.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Install Cypress
        run: npm install --save-dev cypress
      
      - name: Start application server
        run: npm start > /dev/null 2>&1 &
      
      - name: Wait for server
        run: npx wait-on http://localhost:4200
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          browser: ${{ matrix.browser }}
          spec: cypress/e2e/**/*.cy.ts
          record: false
      
      - name: Upload videos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos-${{ matrix.browser }}
          path: cypress/videos/
      
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots-${{ matrix.browser }}
          path: cypress/screenshots/

  report:
    if: always()
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - name: Publish test report
        run: |
          echo "E2E tests completed"
```

**Best Practices for CI/CD:**
1. **Parallel execution** - Run tests across multiple browsers
2. **Video recording** - Record failures for debugging
3. **Screenshots** - Capture state on failure
4. **Timeout handling** - Set appropriate timeouts
5. **Flakiness monitoring** - Track and fix flaky tests
6. **Test reports** - Generate readable reports

---

### Q14: How do you test accessibility in E2E tests?

**Answer:**

```typescript
// cypress/support/accessibility.ts
import 'cypress-axe';

export class AccessibilityHelper {
  static checkPageAccessibility() {
    cy.injectAxe(); // Inject axe accessibility engine
    cy.checkA11y(); // Check entire page
  }

  static checkComponentAccessibility(selector: string) {
    cy.injectAxe();
    cy.checkA11y(selector);
  }

  static checkAccessibilityViolations() {
    cy.injectAxe();
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
        'image-alt': { enabled: true },
        'button-name': { enabled: true }
      }
    });
  }
}

// Usage
describe('Accessibility', () => {
  it('should meet accessibility standards', () => {
    cy.visit('/');
    AccessibilityHelper.checkPageAccessibility();
  });

  it('should have proper form labels', () => {
    cy.visit('/form');
    cy.get('input').each($input => {
      cy.wrap($input).should('have.attr', 'aria-label');
    });
  });

  it('should be keyboard navigable', () => {
    cy.visit('/');
    cy.get('body').tab(); // Simulate tab key
    cy.focused().should('have.attr', 'tabindex');
  });

  it('should have proper heading hierarchy', () => {
    cy.visit('/');
    cy.get('h1').should('have.length', 1); // Only one h1
    cy.get('h2').then($h2 => {
      cy.get('h3').should('have.length.lessThan', $h2.length + 5);
    });
  });
});
```

---

### Q15: How do you handle browser compatibility testing in E2E tests?

**Answer:**

**Multi-Browser Testing with Playwright:**
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI
  }
});
```

**Browser-Specific Testing:**
```typescript
import { test, expect, devices } from '@playwright/test';

test('should work on Chrome', async ({ page, browserName }) => {
  if (browserName !== 'chromium') {
    test.skip();
  }
  
  await page.goto('http://localhost:4200');
  // Chrome-specific test
});

test('should handle Safari scrolling', async ({ page, browserName }) => {
  if (browserName !== 'webkit') {
    test.skip();
  }
  
  await page.goto('http://localhost:4200');
  await page.scroll(0, 500);
  // Safari-specific verification
});

test('should be responsive on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:4200');
  
  // Verify mobile layout
  await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
});
```

**Running Multi-Browser Tests:**
```bash
# Run all browsers
npx playwright test

# Run specific browser
npx playwright test --project=firefox

# Run specific test on all browsers
npx playwright test --grep "login"
```

---

## Summary

**Key Takeaways:**
1. E2E tests verify entire user flows, not individual units
2. Choose Cypress for great DX, Playwright for cross-browser support
3. Use Page Object Model for maintainability
4. Mock external APIs to speed up tests
5. Avoid flaky tests by using explicit waits
6. Organize tests by feature/user story
7. Integrate with CI/CD for automation
8. Test accessibility and performance
9. Maintain tests regularly
10. Use custom commands for reusability

**Best Practices:**
- Keep tests independent and isolated
- Use semantic selectors (data-testid)
- Don't test implementation details
- Mock external dependencies
- Parallelize execution in CI/CD
- Monitor and fix flaky tests
- Document test patterns
- Review tests during code reviews
