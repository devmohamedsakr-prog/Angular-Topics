# E2E Testing in Angular

## Overview

End-to-End (E2E) testing verifies that your entire application works correctly from a user's perspective. Unlike unit tests that test individual components or services in isolation, E2E tests simulate real user interactions with your application in a browser environment.

---

## Why E2E Testing Matters

### Benefits
1. **Real User Scenarios** - Tests actual workflows, not mocked components
2. **Browser Compatibility** - Catches issues that only appear in real browsers
3. **Integration Testing** - Verifies entire user flows work together
4. **Regression Prevention** - Catches breaking changes across the whole app
5. **Confidence** - Ensures application works before deployment

### When to Use E2E Tests
- Critical user flows (authentication, checkout, payment)
- Complex multi-step workflows
- Cross-component interactions
- UI/UX regressions
- Before production deployments

### When NOT to Use E2E Tests
- Simple unit logic (use unit tests)
- Edge cases (use integration tests)
- Every possible scenario (too slow)
- Fast feedback needed (too slow for TDD)

---

## Popular E2E Testing Frameworks

### 1. **Cypress** (Recommended - Modern, Developer-Friendly)

#### Advantages
- Easy to write and debug
- Great developer experience
- Time-travel debugging
- Automatic waiting
- Real browser testing
- Excellent documentation

#### Disadvantages
- Limited to Chrome/Electron (Firefox/Edge support improving)
- Cannot test multiple browser tabs
- Slower than Playwright

#### Installation
```bash
npm install --save-dev cypress
npx cypress open
```

#### Basic Cypress Test Structure
```typescript
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should successfully log in with valid credentials', () => {
    // Get username input and type
    cy.get('input[name="username"]').type('testuser');
    
    // Get password input and type
    cy.get('input[name="password"]').type('password123');
    
    // Click login button
    cy.get('button[type="submit"]').click();
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Verify welcome message
    cy.contains('Welcome, testuser').should('be.visible');
  });

  it('should show error message with invalid credentials', () => {
    cy.get('input[name="username"]').type('wrong');
    cy.get('input[name="password"]').type('wrong');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Invalid username or password').should('be.visible');
  });
});
```

#### Common Cypress Commands

```typescript
// Navigation
cy.visit('url')                           // Visit URL
cy.go('back')                             // Navigate back
cy.reload()                               // Reload page

// Finding Elements
cy.get('selector')                        // Find by selector
cy.contains('text')                       // Find by text
cy.get('selector').first()                // Get first element
cy.get('selector').eq(2)                  // Get element at index

// Interactions
cy.type('text')                           // Type text
cy.click()                                // Click element
cy.select('option')                       // Select dropdown
cy.check()                                // Check checkbox
cy.uncheck()                              // Uncheck checkbox
cy.trigger('event')                       // Trigger event

// Assertions
cy.should('be.visible')                   // Element visible
cy.should('be.disabled')                  // Element disabled
cy.should('have.text', 'text')            // Check text
cy.should('have.class', 'class-name')     // Check class
cy.url().should('include', '/path')       // Check URL

// Waiting & Timing
cy.wait(1000)                             // Wait ms
cy.wait('@alias')                         // Wait for intercept
```

---

### 2. **Playwright** (Modern Alternative - Cross-browser)

#### Advantages
- Supports Chrome, Firefox, Safari, Edge
- Parallel execution
- Fast execution
- Better cross-browser support
- Good for CI/CD

#### Disadvantages
- Less mature than Cypress
- Steeper learning curve
- Community smaller than Cypress

#### Installation
```bash
npm install --save-dev @playwright/test
npx playwright install
```

#### Basic Playwright Test
```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/login');
  });

  test('should successfully log in', async ({ page }) => {
    // Fill inputs
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    
    // Click button
    await page.click('button[type="submit"]');
    
    // Verify URL
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Verify text
    await expect(page.locator('text=Welcome, testuser')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[name="username"]', 'wrong');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid username or password')).toBeVisible();
  });
});
```

---

### 3. **Protractor** (Legacy - For Older Angular Projects)

#### Note
Protractor is deprecated as of Angular 12. Use Cypress or Playwright for new projects.

#### Why Deprecated
- Built specifically for Angular
- Maintenance burden
- Community moved to Cypress/Playwright
- Better alternatives available

#### Basic Protractor Syntax (Legacy)
```typescript
describe('Login Page', () => {
  beforeEach(() => {
    browser.get('http://localhost:4200/login');
  });

  it('should login successfully', () => {
    element(by.css('input[name="username"]')).sendKeys('user');
    element(by.css('input[name="password"]')).sendKeys('pass');
    element(by.css('button[type="submit"]')).click();
    
    expect(browser.getCurrentUrl()).toContain('dashboard');
  });
});
```

---

## Practical E2E Testing Patterns

### Pattern 1: Page Object Model (Recommended)

Organize tests using page objects to make them maintainable:

```typescript
// page-objects/login.page.ts
export class LoginPage {
  private usernameInput = 'input[name="username"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'button[type="submit"]';
  private errorMessage = '.error-message';

  visit() {
    cy.visit('http://localhost:4200/login');
  }

  enterUsername(username: string) {
    cy.get(this.usernameInput).type(username);
  }

  enterPassword(password: string) {
    cy.get(this.passwordInput).type(password);
  }

  clickLogin() {
    cy.get(this.loginButton).click();
  }

  getErrorMessage() {
    return cy.get(this.errorMessage);
  }

  login(username: string, password: string) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
  }
}

// tests/login.spec.ts
import { LoginPage } from '../page-objects/login.page';

describe('Login', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    loginPage.visit();
  });

  it('should login successfully', () => {
    loginPage.login('testuser', 'password123');
    cy.url().should('include', '/dashboard');
  });

  it('should show error with invalid credentials', () => {
    loginPage.login('wrong', 'wrong');
    loginPage.getErrorMessage().should('contain', 'Invalid');
  });
});
```

### Pattern 2: Testing User Workflows

```typescript
describe('Complete Purchase Workflow', () => {
  it('should complete full purchase flow', () => {
    // 1. User visits product page
    cy.visit('http://localhost:4200/products');
    
    // 2. User searches for product
    cy.get('input[placeholder="Search"]').type('laptop');
    cy.contains('button', 'Search').click();
    
    // 3. User clicks first product
    cy.get('.product-list').first().click();
    
    // 4. User adds to cart
    cy.contains('button', 'Add to Cart').click();
    cy.contains('Added to cart').should('be.visible');
    
    // 5. User goes to cart
    cy.get('a[href="/cart"]').click();
    cy.url().should('include', '/cart');
    
    // 6. User checks out
    cy.contains('button', 'Checkout').click();
    
    // 7. User fills payment details
    cy.get('input[name="cardNumber"]').type('4532015112830366');
    cy.get('input[name="expiryDate"]').type('12/25');
    cy.get('input[name="cvc"]').type('123');
    
    // 8. User confirms purchase
    cy.contains('button', 'Complete Purchase').click();
    
    // 9. Verify order confirmation
    cy.url().should('include', '/order-confirmation');
    cy.contains('Thank you for your order').should('be.visible');
  });
});
```

### Pattern 3: API Mocking & Intercepts

```typescript
describe('Product List with API Mocking', () => {
  it('should display products from API', () => {
    // Mock API response
    cy.intercept('GET', '/api/products', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Product 1', price: 99.99 },
        { id: 2, name: 'Product 2', price: 149.99 }
      ]
    }).as('getProducts');

    cy.visit('http://localhost:4200/products');
    
    // Wait for API call
    cy.wait('@getProducts');
    
    // Verify products displayed
    cy.contains('Product 1').should('be.visible');
    cy.contains('Product 2').should('be.visible');
  });

  it('should handle API error', () => {
    // Mock API error
    cy.intercept('GET', '/api/products', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('getProducts');

    cy.visit('http://localhost:4200/products');
    cy.wait('@getProducts');
    
    // Verify error message
    cy.contains('Error loading products').should('be.visible');
  });
});
```

### Pattern 4: Authentication & Session Management

```typescript
describe('Authentication Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.visit('http://localhost:4200/login');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should access protected page when logged in', () => {
    cy.visit('http://localhost:4200/protected');
    cy.contains('Protected Content').should('be.visible');
  });

  it('should redirect to login when accessing protected page without auth', () => {
    // Clear localStorage to simulate logout
    cy.window().then(win => {
      win.localStorage.clear();
    });
    
    cy.visit('http://localhost:4200/protected');
    cy.url().should('include', '/login');
  });
});
```

### Pattern 5: Testing Dynamic Content

```typescript
describe('Dynamic Content Testing', () => {
  it('should handle dynamic list rendering', () => {
    cy.visit('http://localhost:4200/users');
    
    // Get initial count
    cy.get('.user-item').should('have.length', 10);
    
    // Scroll to bottom (triggers load more)
    cy.get('.user-list').scrollTo('bottom');
    
    // Wait for new items to load
    cy.get('.user-item').should('have.length.greaterThan', 10);
  });

  it('should handle real-time updates', () => {
    cy.visit('http://localhost:4200/notifications');
    
    // Wait for WebSocket connection
    cy.window().should('have.property', 'socketConnected', true);
    
    // Simulate notification
    cy.window().then(win => {
      win.dispatchEvent(new CustomEvent('notification', {
        detail: { message: 'New notification' }
      }));
    });
    
    // Verify notification displayed
    cy.contains('New notification').should('be.visible');
  });
});
```

---

## Best Practices for E2E Testing

### 1. **Use Selectors Wisely**
```typescript
// ❌ Bad - Too generic
cy.get('div')
cy.get('.container > .item')

// ✅ Good - Specific and semantic
cy.get('[data-testid="submit-button"]')
cy.get('button[aria-label="Save"]')
```

### 2. **Avoid Hard Waits**
```typescript
// ❌ Bad - Hard waits are unreliable
cy.wait(2000);
cy.get('.element').should('exist');

// ✅ Good - Let framework handle waits
cy.get('.element', { timeout: 5000 }).should('be.visible');
cy.get('.spinner').should('not.exist');
cy.get('.data').should('have.length.greaterThan', 0);
```

### 3. **Keep Tests Independent**
```typescript
// ❌ Bad - Test depends on previous test
it('test 1', () => { cy.create_user(); });
it('test 2', () => { cy.get_user(); }); // Depends on test 1

// ✅ Good - Each test sets up what it needs
it('test 1', () => {
  cy.create_user();
  cy.verify_user_created();
});

it('test 2', () => {
  cy.create_user();
  cy.get_user();
  cy.verify_user_retrieved();
});
```

### 4. **Use Data Attributes for Selection**
```typescript
// In your component template
<button [data-testid]="'submit-button'">Submit</button>

// In your test
cy.get('[data-testid="submit-button"]').click();
```

### 5. **Organize Tests by User Story**
```typescript
// Good test organization
describe('User Dashboard', () => {
  describe('As a logged-in user', () => {
    describe('when viewing my profile', () => {
      it('should display my information', () => {});
      it('should allow editing', () => {});
    });
  });
});
```

---

## Running E2E Tests

### Cypress

```bash
# Run tests interactively
npx cypress open

# Run all tests headlessly
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/integration/login.spec.js"

# Run tests in specific browser
npx cypress run --browser firefox

# Run tests in parallel
npx cypress run --parallel --record

# Run with video recording
npx cypress run --record
```

### Playwright

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test login.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run in specific browser
npx playwright test --project=firefox

# Debug mode
npx playwright test --debug

# View test report
npx playwright show-report
```

---

## CI/CD Integration

### GitHub Actions with Cypress

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      
      - name: Start server
        run: npm start &
        
      - name: Run E2E tests
        run: npx cypress run
      
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
```

### GitHub Actions with Playwright

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Performance Optimization

### Tips for Faster E2E Tests

1. **Parallelize execution**
   - Run tests across multiple machines
   - Disable browser caches where safe

2. **Use test fixtures**
   - Pre-create test data
   - Reduce setup time

3. **Minimize API calls**
   - Mock external APIs
   - Use realistic response times

4. **Optimize database**
   - Use test database
   - Reset between tests

---

## Troubleshooting E2E Tests

### Common Issues

**Elements not found**
```typescript
// Increase timeout
cy.get('.element', { timeout: 10000 })

// Check if element exists
cy.get('body').then($body => {
  if ($body.find('.element').length === 0) {
    // Handle missing element
  }
});
```

**Timing issues**
```typescript
// Wait for network idle
cy.intercept('GET', '/api/**').as('apiCalls');
cy.visit('/');
cy.wait('@apiCalls');

// Wait for animations
cy.get('.animated-element').should('have.css', 'opacity', '1');
```

**Authentication problems**
```typescript
// Save and restore auth state
beforeEach(() => {
  cy.clearLocalStorage();
  cy.login('user', 'pass');
});
```

---

## Summary

E2E testing is crucial for production Angular applications. Key takeaways:

1. **Choose the right tool** - Cypress for ease, Playwright for cross-browser
2. **Use Page Object Model** - Keep tests maintainable
3. **Test user workflows** - Not implementation details
4. **Avoid hard waits** - Use explicit waits
5. **Mock external APIs** - Speed up tests
6. **Integrate with CI/CD** - Automate test running
7. **Keep tests independent** - Each test is self-contained

Start with critical user flows, expand coverage gradually, and maintain tests regularly.
