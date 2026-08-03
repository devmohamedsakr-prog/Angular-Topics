/**
 * E2E Testing Examples for Angular Applications
 * Demonstrates various testing patterns with Cypress and Playwright
 */

// ============================================================================
// EXAMPLE 1: Page Object Model Pattern (Cypress)
// ============================================================================

// page-objects/login.page.ts
export class LoginPage {
  private readonly usernameInput = 'input[data-testid="username"]';
  private readonly passwordInput = 'input[data-testid="password"]';
  private readonly loginButton = 'button[data-testid="login-button"]';
  private readonly errorMessage = '.error-message';
  private readonly rememberMeCheckbox = 'input[type="checkbox"]';
  private readonly forgotPasswordLink = 'a[data-testid="forgot-password"]';

  /**
   * Navigate to login page
   */
  visit() {
    cy.visit('http://localhost:4200/login');
  }

  /**
   * Enter username
   */
  enterUsername(username: string) {
    cy.get(this.usernameInput).clear().type(username);
  }

  /**
   * Enter password
   */
  enterPassword(password: string) {
    cy.get(this.passwordInput).clear().type(password);
  }

  /**
   * Click login button
   */
  clickLogin() {
    cy.get(this.loginButton).click();
  }

  /**
   * Toggle remember me checkbox
   */
  toggleRememberMe() {
    cy.get(this.rememberMeCheckbox).click();
  }

  /**
   * Complete login flow
   */
  login(username: string, password: string, rememberMe = false) {
    this.enterUsername(username);
    this.enterPassword(password);
    if (rememberMe) this.toggleRememberMe();
    this.clickLogin();
  }

  /**
   * Get error message
   */
  getErrorMessage() {
    return cy.get(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  clickForgotPassword() {
    cy.get(this.forgotPasswordLink).click();
  }

  /**
   * Verify login page is displayed
   */
  verifyPageLoaded() {
    cy.get(this.usernameInput).should('be.visible');
  }
}

// page-objects/dashboard.page.ts
export class DashboardPage {
  private readonly welcomeMessage = 'h1.welcome-title';
  private readonly logoutButton = 'button[data-testid="logout"]';
  private readonly userMenu = 'button[data-testid="user-menu"]';
  private readonly profileLink = 'a[data-testid="profile-link"]';
  private readonly settingsLink = 'a[data-testid="settings-link"]';

  /**
   * Verify user is logged in
   */
  verifyLoggedIn(username: string) {
    cy.get(this.welcomeMessage).should('contain', `Welcome, ${username}`);
  }

  /**
   * Open user menu
   */
  openUserMenu() {
    cy.get(this.userMenu).click();
  }

  /**
   * Navigate to profile
   */
  goToProfile() {
    this.openUserMenu();
    cy.get(this.profileLink).click();
  }

  /**
   * Navigate to settings
   */
  goToSettings() {
    this.openUserMenu();
    cy.get(this.settingsLink).click();
  }

  /**
   * Logout
   */
  logout() {
    this.openUserMenu();
    cy.get(this.logoutButton).click();
  }
}

// ============================================================================
// EXAMPLE 2: Complete User Workflows (Cypress)
// ============================================================================

// cypress/integration/auth-flow.spec.ts
describe('Authentication Workflow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    dashboardPage = new DashboardPage();
    loginPage.visit();
  });

  it('should login successfully with valid credentials', () => {
    loginPage.login('testuser@example.com', 'Password123!');
    
    cy.url().should('include', '/dashboard');
    dashboardPage.verifyLoggedIn('Test User');
  });

  it('should show error with invalid credentials', () => {
    loginPage.login('wrong@email.com', 'wrongpassword');
    
    loginPage.getErrorMessage()
      .should('be.visible')
      .should('contain', 'Invalid email or password');
    
    cy.url().should('include', '/login');
  });

  it('should remember user when checkbox is checked', () => {
    loginPage.login('testuser@example.com', 'Password123!', true);
    
    cy.url().should('include', '/dashboard');
    
    // Verify "remember me" token is stored
    cy.getCookie('remember_token').should('exist');
  });

  it('should persist login on page refresh', () => {
    loginPage.login('testuser@example.com', 'Password123!');
    cy.url().should('include', '/dashboard');
    
    // Refresh page
    cy.reload();
    
    // Should still be logged in
    dashboardPage.verifyLoggedIn('Test User');
  });

  it('should logout successfully', () => {
    loginPage.login('testuser@example.com', 'Password123!');
    cy.url().should('include', '/dashboard');
    
    dashboardPage.logout();
    
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing protected page', () => {
    cy.visit('http://localhost:4200/dashboard');
    
    cy.url().should('include', '/login');
  });
});

// ============================================================================
// EXAMPLE 3: E-Commerce Purchase Flow (Cypress)
// ============================================================================

// cypress/integration/purchase-flow.spec.ts
describe('E-Commerce Purchase Flow', () => {
  beforeEach(() => {
    // Setup: Login user
    cy.visit('http://localhost:4200/login');
    cy.get('input[name="email"]').type('customer@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/products');
  });

  it('should complete purchase flow end-to-end', () => {
    // Step 1: Browse products
    cy.get('[data-testid="product-list"]').should('be.visible');
    cy.get('[data-testid="product-item"]').should('have.length.greaterThan', 0);

    // Step 2: Search for product
    cy.get('[data-testid="search-input"]').type('laptop');
    cy.get('[data-testid="search-button"]').click();
    
    cy.get('[data-testid="product-item"]').first().should('contain', 'Laptop');

    // Step 3: View product details
    cy.get('[data-testid="product-item"]').first().click();
    
    cy.url().should('include', '/product/');
    cy.get('[data-testid="product-name"]').should('contain', 'Laptop');
    cy.get('[data-testid="product-price"]').should('contain', '$');

    // Step 4: Add to cart
    cy.get('[data-testid="quantity-input"]').clear().type('2');
    cy.get('[data-testid="add-to-cart"]').click();
    
    cy.contains('[data-testid="toast"]', 'Added to cart').should('be.visible');

    // Step 5: Go to cart
    cy.get('[data-testid="cart-icon"]').click();
    
    cy.url().should('include', '/cart');
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    cy.contains('Quantity: 2').should('be.visible');

    // Step 6: Apply coupon
    cy.get('[data-testid="coupon-input"]').type('SAVE10');
    cy.get('[data-testid="apply-coupon"]').click();
    
    cy.contains('Coupon applied').should('be.visible');

    // Step 7: Proceed to checkout
    cy.get('[data-testid="checkout-button"]').click();
    
    cy.url().should('include', '/checkout');

    // Step 8: Enter shipping information
    cy.get('[data-testid="first-name"]').type('John');
    cy.get('[data-testid="last-name"]').type('Doe');
    cy.get('[data-testid="address"]').type('123 Main St');
    cy.get('[data-testid="city"]').type('New York');
    cy.get('[data-testid="state"]').select('NY');
    cy.get('[data-testid="zip"]').type('10001');

    cy.get('[data-testid="continue-shipping"]').click();

    // Step 9: Enter payment information
    cy.get('[data-testid="card-number"]').type('4532015112830366');
    cy.get('[data-testid="expiry"]').type('12/25');
    cy.get('[data-testid="cvc"]').type('123');

    // Step 10: Review order
    cy.get('[data-testid="order-summary"]').should('be.visible');
    cy.contains('Total:').should('contain', '$');

    // Step 11: Place order
    cy.get('[data-testid="place-order"]').click();

    // Step 12: Verify order confirmation
    cy.url().should('include', '/order-confirmation');
    cy.get('[data-testid="order-number"]').should('be.visible');
    cy.contains('Thank you for your order').should('be.visible');
  });
});

// ============================================================================
// EXAMPLE 4: API Mocking and Intercepts (Cypress)
// ============================================================================

// cypress/integration/api-mocking.spec.ts
describe('API Mocking', () => {
  it('should display users from mocked API', () => {
    // Mock GET request
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
        { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' }
      ]
    }).as('getUsers');

    cy.visit('http://localhost:4200/users');
    
    // Wait for API call to complete
    cy.wait('@getUsers');

    // Verify users are displayed
    cy.contains('Alice').should('be.visible');
    cy.contains('Bob').should('be.visible');
    cy.contains('Charlie').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Mock API error
    cy.intercept('GET', '/api/users', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getUsersError');

    cy.visit('http://localhost:4200/users');
    cy.wait('@getUsersError');

    cy.contains('Error loading users').should('be.visible');
    cy.contains('Please try again later').should('be.visible');
  });

  it('should retry failed requests', () => {
    let requestCount = 0;

    cy.intercept('POST', '/api/submit', (req) => {
      requestCount++;
      
      if (requestCount < 3) {
        req.reply({ statusCode: 503, body: 'Service Unavailable' });
      } else {
        req.reply({ statusCode: 200, body: { success: true } });
      }
    }).as('submitForm');

    cy.visit('http://localhost:4200/form');
    cy.get('[data-testid="submit"]').click();

    cy.wait('@submitForm');
    cy.contains('Success!').should('be.visible');
  });

  it('should modify API responses', () => {
    cy.intercept('GET', '/api/user/profile', (req) => {
      req.reply((res) => {
        // Modify response body
        res.body.isPremium = true;
        res.body.badges = ['verified', 'premium'];
        return res;
      });
    }).as('getProfile');

    cy.visit('http://localhost:4200/profile');
    cy.wait('@getProfile');

    cy.contains('Premium Member').should('be.visible');
  });

  it('should track API request details', () => {
    cy.intercept('POST', '/api/users', {}).as('createUser');

    cy.visit('http://localhost:4200/admin/users');
    cy.get('[data-testid="create-user"]').click();
    cy.get('input[name="name"]').type('New User');
    cy.get('button[type="submit"]').click();

    cy.wait('@createUser').then((interception) => {
      // Verify request headers
      expect(interception.request.headers['content-type']).to.include('application/json');
      
      // Verify request body
      expect(interception.request.body).to.deep.include({ name: 'New User' });
      
      // Verify response status
      expect(interception.response.statusCode).to.equal(201);
    });
  });
});

// ============================================================================
// EXAMPLE 5: Form Testing (Cypress)
// ============================================================================

// cypress/integration/form-testing.spec.ts
describe('Form Testing', () => {
  it('should validate form fields', () => {
    cy.visit('http://localhost:4200/register');

    // Submit empty form
    cy.get('[data-testid="submit"]').click();

    // Check validation messages
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    cy.contains('Password must be at least 8 characters').should('not.exist');
  });

  it('should validate email format', () => {
    cy.visit('http://localhost:4200/register');

    cy.get('[data-testid="email"]').type('invalid-email');
    cy.get('[data-testid="submit"]').click();

    cy.contains('Invalid email format').should('be.visible');
  });

  it('should validate password strength', () => {
    cy.visit('http://localhost:4200/register');

    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('weak');
    cy.get('[data-testid="submit"]').click();

    cy.contains('Password must be at least 8 characters').should('be.visible');
  });

  it('should validate matching passwords', () => {
    cy.visit('http://localhost:4200/register');

    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('StrongPassword123!');
    cy.get('[data-testid="confirm-password"]').type('DifferentPassword456!');
    cy.get('[data-testid="submit"]').click();

    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should handle dynamic form fields', () => {
    cy.visit('http://localhost:4200/form-builder');

    // Add new field
    cy.get('[data-testid="add-field"]').click();
    cy.get('[data-testid="field-name"]').type('Phone');
    cy.get('[data-testid="field-type"]').select('text');

    // Verify field added
    cy.contains('Phone').should('be.visible');

    // Fill field
    cy.get('input[name="phone"]').type('555-1234');
    cy.get('[data-testid="submit"]').click();

    cy.contains('Form submitted successfully').should('be.visible');
  });

  it('should preserve form data on validation error', () => {
    cy.visit('http://localhost:4200/register');

    cy.get('[data-testid="email"]').type('user@example.com');
    cy.get('[data-testid="password"]').type('weak');
    cy.get('[data-testid="submit"]').click();

    // Email should still be filled
    cy.get('[data-testid="email"]').should('have.value', 'user@example.com');
  });
});

// ============================================================================
// EXAMPLE 6: Data Tables and Lists (Cypress)
// ============================================================================

// cypress/integration/table-testing.spec.ts
describe('Data Tables', () => {
  it('should sort table by column', () => {
    cy.visit('http://localhost:4200/users');

    // Click name column header to sort
    cy.get('th').contains('Name').click();

    // Verify first row is 'Alice'
    cy.get('tbody tr').first().should('contain', 'Alice');

    // Click again to reverse sort
    cy.get('th').contains('Name').click();

    // First row should be different
    cy.get('tbody tr').first().should('not.contain', 'Alice');
  });

  it('should filter table rows', () => {
    cy.visit('http://localhost:4200/users');

    // Filter by role
    cy.get('[data-testid="role-filter"]').select('admin');

    // Verify only admin rows shown
    cy.get('tbody tr').each(($row) => {
      cy.wrap($row).should('contain', 'Admin');
    });
  });

  it('should paginate table', () => {
    cy.visit('http://localhost:4200/users');

    // Verify first page loaded
    cy.get('tbody tr').should('have.length', 10);

    // Click next button
    cy.get('[data-testid="next-page"]').click();

    // Verify different rows
    cy.get('tbody tr').first().should('not.contain', 'Alice');

    // Click previous button
    cy.get('[data-testid="prev-page"]').click();

    // Back to first page
    cy.get('tbody tr').first().should('contain', 'Alice');
  });

  it('should select rows', () => {
    cy.visit('http://localhost:4200/users');

    // Select first row
    cy.get('input[type="checkbox"]').first().check();

    // Verify row highlighted
    cy.get('tbody tr').first().should('have.class', 'selected');

    // Select all
    cy.get('[data-testid="select-all"]').check();

    // Verify all selected
    cy.get('tbody tr').should('have.class', 'selected');
  });
});

// ============================================================================
// EXAMPLE 7: Modal and Dialog Testing (Cypress)
// ============================================================================

// cypress/integration/modal-testing.spec.ts
describe('Modals and Dialogs', () => {
  it('should open and close modal', () => {
    cy.visit('http://localhost:4200/users');

    // Modal should not be visible
    cy.get('[data-testid="user-modal"]').should('not.be.visible');

    // Click button to open modal
    cy.get('[data-testid="add-user"]').click();

    // Modal should be visible
    cy.get('[data-testid="user-modal"]').should('be.visible');

    // Fill form
    cy.get('input[name="name"]').type('New User');
    cy.get('input[name="email"]').type('new@example.com');

    // Submit
    cy.get('[data-testid="modal-submit"]').click();

    // Modal should close
    cy.get('[data-testid="user-modal"]').should('not.be.visible');
  });

  it('should confirm delete action', () => {
    cy.visit('http://localhost:4200/users');

    // Click delete button
    cy.get('[data-testid="delete-user"]').first().click();

    // Confirmation dialog appears
    cy.contains('Are you sure?').should('be.visible');

    // Click cancel
    cy.get('[data-testid="cancel"]').click();

    // User should still exist
    cy.get('tbody tr').should('have.length', 5);
  });

  it('should handle confirmation dialog', () => {
    cy.visit('http://localhost:4200/users');

    // Click delete button
    cy.get('[data-testid="delete-user"]').first().click();

    // Confirmation dialog appears
    cy.contains('Are you sure?').should('be.visible');

    // Click confirm
    cy.get('[data-testid="confirm"]').click();

    // User should be deleted
    cy.get('tbody tr').should('have.length', 4);
  });
});

// ============================================================================
// EXAMPLE 8: File Upload (Cypress)
// ============================================================================

// cypress/integration/file-upload.spec.ts
describe('File Upload', () => {
  it('should upload file', () => {
    cy.visit('http://localhost:4200/upload');

    // Create fixture file
    cy.fixture('sample.csv').then(fileContent => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: 'sample.csv',
        mimeType: 'text/csv'
      });
    });

    cy.get('[data-testid="submit"]').click();

    cy.contains('File uploaded successfully').should('be.visible');
  });

  it('should validate file type', () => {
    cy.visit('http://localhost:4200/upload');

    cy.fixture('invalid-file.txt').then(fileContent => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: 'invalid.txt',
        mimeType: 'text/plain'
      });
    });

    cy.get('[data-testid="submit"]').click();

    cy.contains('Invalid file type. Please upload CSV').should('be.visible');
  });

  it('should validate file size', () => {
    cy.visit('http://localhost:4200/upload');

    // Create large file (>10MB)
    const largeContent = new Array(11 * 1024 * 1024).join('a');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(largeContent),
      fileName: 'large-file.csv',
      mimeType: 'text/csv'
    });

    cy.get('[data-testid="submit"]').click();

    cy.contains('File too large. Maximum size is 10MB').should('be.visible');
  });
});

// ============================================================================
// EXAMPLE 9: Playwright Version
// ============================================================================

/*
import { test, expect, Page } from '@playwright/test';

test.describe('Authentication (Playwright)', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    
    // Fill inputs
    await page.fill('input[data-testid="username"]', 'testuser');
    await page.fill('input[data-testid="password"]', 'password123');
    
    // Click login
    await page.click('button[data-testid="login-button"]');
    
    // Wait and verify
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    
    await page.fill('input[data-testid="username"]', 'wrong');
    await page.fill('input[data-testid="password"]', 'wrong');
    await page.click('button[data-testid="login-button"]');
    
    await expect(page.locator('.error-message')).toContainText('Invalid');
  });
});

test.describe('API Mocking (Playwright)', () => {
  test('should mock API response', async ({ page }) => {
    // Mock route
    await page.route('**/api/users', route => {
      route.abort();
    });
    
    await page.goto('http://localhost:4200/users');
    
    await expect(page.locator('text=Error loading users')).toBeVisible();
  });
});
*/
