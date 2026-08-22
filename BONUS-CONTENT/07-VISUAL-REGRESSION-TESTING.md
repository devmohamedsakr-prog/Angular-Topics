# Visual Regression Testing Guide

## What is Visual Regression Testing?

Visual regression testing automatically detects unintended visual changes by comparing screenshots of UI components or pages.

---

## Percy (Recommended)

```typescript
// Install Percy
npm install --save-dev @percy/cli @percy/cypress

// cypress/support/commands.ts
Cypress.Commands.add('percySnapshot', (name) => {
  cy.percySnapshot(name);
});

// cypress/e2e/visual.spec.ts
describe('Visual Regression Tests', () => {
  it('should match product page screenshot', () => {
    cy.visit('/products');
    cy.percySnapshot('Products Page');
  });

  it('should match product detail', () => {
    cy.visit('/products/123');
    cy.wait('@getProduct');
    cy.percySnapshot('Product Detail Page');
  });

  it('should match responsive design', () => {
    cy.viewport('iphone-x');
    cy.visit('/products');
    cy.percySnapshot('Products Page - Mobile');
  });
});
```

## GitHub Actions with Percy

```yaml
# .github/workflows/visual-testing.yml
name: Visual Regression Testing

on: [pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Run visual tests
        run: npm run e2e
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

---

## Pixelmatch (Open Source)

```typescript
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';

describe('Visual Regression with Pixelmatch', () => {
  it('should match baseline screenshot', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('http://localhost:4200/products');
    await page.screenshot({ path: './screenshots/current.png' });
    
    // Compare with baseline
    const img1 = PNG.sync.read(fs.readFileSync('./screenshots/baseline.png'));
    const img2 = PNG.sync.read(fs.readFileSync('./screenshots/current.png'));
    const { width, height } = img1;
    const diff = new PNG({ width, height });
    
    const numDiffPixels = pixelmatch(
      img1.data, 
      img2.data, 
      diff.data, 
      width, 
      height, 
      { threshold: 0.1 }
    );
    
    expect(numDiffPixels).toBe(0);
    
    fs.writeFileSync('./screenshots/diff.png', PNG.sync.write(diff));
    await browser.close();
  });
});
```

---

## Cypress with Screenshots

```typescript
describe('Visual Testing with Cypress', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('should match hero section', () => {
    cy.get('.hero-section').screenshot('hero-section', {
      blackout: ['.changing-banner'], // Exclude dynamic content
      padding: 10
    });
  });

  it('should match form states', () => {
    cy.get('form').screenshot('form-empty');
    
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('form').screenshot('form-filled');
    
    cy.get('form').submit();
    cy.get('form').screenshot('form-submitted');
  });

  it('should match responsive layouts', () => {
    const viewports = ['iphone-x', 'ipad-2', 'macbook-15'];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport);
      cy.get('.main-container').screenshot(`layout-${viewport}`);
    });
  });
});

// Run with Percy
// npx percy exec -- cypress run
```

---

## Storybook Integration

```typescript
// Button.stories.ts
import { StoryObj, Meta } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  component: ButtonComponent,
  title: 'Components/Button'
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    label: 'Click me'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    label: 'Secondary'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled'
  }
};

export const Loading: Story = {
  args: {
    loading: true,
    label: 'Loading...'
  }
};

// Run visual tests with Storybook
// npm run storybook
// Then use Percy or other tools on http://localhost:6006
```

---

## Best Practices

```
1. Create comprehensive baseline images
2. Review and approve diffs carefully
3. Exclude dynamic/time-based content
4. Test multiple viewports
5. Test component states (hover, focus, disabled)
6. Include loading states
7. Test error states
8. Document visual standards
9. Automate in CI/CD
10. Keep screenshots updated
```

---

## Tools Comparison

| Tool | Type | Cost | Integration | 
|------|------|------|-------------|
| Percy | Cloud | Paid | Excellent |
| Chromatic | Cloud | Paid | Excellent |
| Pixelmatch | Local | Free | Good |
| Cypress | Local | Free | Good |
| Puppeteer | Local | Free | Fair |

---

## Handling False Positives

```typescript
// Exclude dynamic content
cy.percySnapshot('Dashboard', {
  ignore: ['.timestamp', '.counter', '.ad-banner']
});

// Use threshold for minor differences
cy.percySnapshot('Page', {
  tolerance: 0.5 // Allow 0.5% difference
});

// Freeze time for consistent screenshots
cy.clock(); // Freeze date/time
cy.visit('/page');
cy.percySnapshot('Page');
cy.tick(1000);
```

---

## Maintenance Tips

1. Keep baselines in version control
2. Review all new baselines
3. Document why images look certain way
4. Update baselines when intentional changes occur
5. Use CI/CD to catch visual regressions early

