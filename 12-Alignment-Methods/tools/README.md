# Alignment Tools & Setup

Complete guide to setting up linting, formatting, and testing tools for consistent Angular development.

## Quick Start

```bash
# Install dependencies
npm install --save-dev prettier eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser @angular-eslint/eslint-plugin husky lint-staged

# Initialize Husky
npx husky install

# Run formatting
npm run format

# Run linting
npm run lint

# Run tests
npm run test
```

## Tool Overview

| Tool | Purpose | Setup Time |
|------|---------|-----------|
| **ESLint** | Code quality & standards | 30 min |
| **Prettier** | Code formatting | 15 min |
| **Husky** | Git hooks | 10 min |
| **lint-staged** | Run tools on staged files | 10 min |
| **commitlint** | Enforce commit messages | 10 min |
| **Jasmine** | Unit testing | 20 min |
| **Cypress** | E2E testing | 30 min |

## 1. ESLint Setup

### Installation

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin @angular-eslint/eslint-plugin @angular-eslint/template-parser
```

### Configuration File: `.eslintrc.json`

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "parserOptions": {
        "project": ["tsconfig.json"],
        "createDefaultProgram": true
      },
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ],
        "@typescript-eslint/explicit-function-return-types": [
          "warn",
          {
            "allowExpressions": true,
            "allowTypedFunctionExpressions": true
          }
        ],
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            "argsIgnorePattern": "^_"
          }
        ],
        "no-console": [
          "warn",
          {
            "allow": ["warn", "error"]
          }
        ]
      }
    },
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility"
      ],
      "rules": {}
    }
  ]
}
```

### NPM Scripts for ESLint

```json
{
  "scripts": {
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "lint:report": "eslint src --format json > lint-report.json"
  }
}
```

## 2. Prettier Setup

### Installation

```bash
npm install --save-dev prettier
```

### Configuration File: `.prettierrc.json`

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "parser": "typescript",
  "htmlWhitespaceSensitivity": "css",
  "endOfLine": "lf"
}
```

### Ignore File: `.prettierignore`

```
node_modules
dist
build
.angular
coverage
*.min.js
*.min.css
```

### NPM Scripts for Prettier

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,html,scss,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,scss,json}\"",
    "format:staged": "prettier --write"
  }
}
```

## 3. EditorConfig Setup

### Configuration File: `.editorconfig`

```ini
# EditorConfig is awesome: https://EditorConfig.org

root = true

# All files
[*]
charset = utf-8
insert_final_newline = true
trim_trailing_whitespace = true

# TypeScript files
[*.ts]
indent_style = space
indent_size = 2
max_line_length = 100

# HTML files
[*.html]
indent_style = space
indent_size = 2

# JSON files
[*.json]
indent_style = space
indent_size = 2

# SCSS files
[*.scss]
indent_style = space
indent_size = 2

# Markdown files
[*.md]
trim_trailing_whitespace = false
```

## 4. Husky Setup

### Installation

```bash
npm install husky --save-dev
npx husky install

# Add hook
npx husky add .husky/pre-commit "npm run lint:staged"
npx husky add .husky/commit-msg "npx commitlint --edit"
```

### Pre-commit Hook: `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint:staged
npm run test:staged
```

### Commit Message Hook: `.husky/commit-msg`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitlint --edit $1
```

## 5. lint-staged Setup

### Installation

```bash
npm install --save-dev lint-staged
```

### Configuration: `package.json`

```json
{
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write"],
    "*.html": ["prettier --write"],
    "*.json": ["prettier --write"],
    "*.scss": ["prettier --write"]
  }
}
```

### NPM Scripts

```json
{
  "scripts": {
    "lint:staged": "lint-staged",
    "test:staged": "jest --bail --findRelatedTests"
  }
}
```

## 6. commitlint Setup

### Installation

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

### Configuration: `commitlint.config.js`

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'revert'
      ]
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-period': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100]
  }
};
```

## 7. Jasmine Testing Setup

### Installation

```bash
npm install --save-dev @angular/core @angular/common @angular/platform-browser-dynamic karma karma-jasmine karma-chrome-launcher karma-coverage
```

### Configuration: `karma.conf.js`

```javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        random: false,
        seed: null,
        stopSpecOnExpectationFailure: false
      },
      clearContext: false
    },
    jasmineHtmlReporter: {
      suppressAll: true
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/my-app'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
```

### NPM Scripts for Testing

```json
{
  "scripts": {
    "test": "ng test",
    "test:ci": "ng test --watch=false --code-coverage --browsers=ChromeHeadless",
    "test:coverage": "ng test --code-coverage --watch=false"
  }
}
```

## 8. Cypress E2E Testing Setup

### Installation

```bash
npm install --save-dev cypress
npx cypress open
```

### Base Configuration: `cypress.config.ts`

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    specPattern: 'src/**/*.cy.ts'
  }
});
```

### NPM Scripts for Cypress

```json
{
  "scripts": {
    "e2e": "cypress open",
    "e2e:run": "cypress run",
    "e2e:headless": "cypress run --headless --browser chrome"
  }
}
```

## Complete package.json Scripts

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:ci": "ng test --watch=false --code-coverage --browsers=ChromeHeadless",
    "test:coverage": "ng test --code-coverage --watch=false",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "format": "prettier --write \"src/**/*.{ts,html,scss,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,scss,json}\"",
    "e2e": "cypress open",
    "e2e:run": "cypress run",
    "quality": "npm run lint && npm run format:check && npm run test:ci"
  }
}
```

## Verification Checklist

After setup, verify everything works:

```bash
# 1. Run linter
npm run lint

# 2. Check formatting
npm run format:check

# 3. Run unit tests
npm run test:ci

# 4. Run E2E tests
npm run e2e:run

# 5. Verify git hooks
git commit -m "test: verify alignment tools"
```

## Troubleshooting

### ESLint not detecting errors
```bash
# Clear cache
npx eslint --cache --cache-location .eslintcache --fix src
```

### Prettier conflicts with ESLint
```bash
# Install compatibility layer
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

### Husky hooks not running
```bash
# Reinstall husky
npx husky install

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Tests timing out
```bash
# Increase timeout in karma.conf.js
browserNoActivityTimeout: 30000,
browserDisconnectTimeout: 10000
```

---

**See Also:**
- [Best Practices](../best-practices/README.md)
- [Explanation](../explanation/README.md)
- [Examples](./examples)
