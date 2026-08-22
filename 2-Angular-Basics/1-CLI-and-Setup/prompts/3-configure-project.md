# Configure Project Settings

**IDE Prompt:** Use this when configuring TypeScript, linting, testing, and build settings.

---

## 🎯 Task: Configure TypeScript, ESLint, and Build Settings

**When to use:** After project creation, before starting development.

---

## 📋 Checklist

- [ ] Enable strict TypeScript mode
- [ ] Install and configure ESLint
- [ ] Configure Prettier (code formatter)
- [ ] Update Angular settings
- [ ] Verify configurations work

---

## 🚀 Step-by-Step Instructions

### Step 1: Enable Strict TypeScript Mode

**File:** `tsconfig.json`

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

### Step 2: Install ESLint

```bash
npm install --save-dev @angular-eslint/eslint-plugin @angular-eslint/builder @angular-eslint/schematics
```

### Step 3: Configure ESLint

Create `.eslintrc.json`:

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
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
        "no-console": ["warn", { "allow": ["warn", "error"] }],
        "@typescript-eslint/explicit-member-accessibility": "warn"
      }
    }
  ]
}
```

### Step 4: Install Prettier

```bash
npm install --save-dev prettier
```

Create `.prettierrc.json`:

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
  "arrowParens": "always"
}
```

### Step 5: Update angular.json

Add lint and format scripts to `angular.json`:

```json
{
  "projects": {
    "my-awesome-app": {
      "lint": {
        "builder": "@angular-eslint/builder:lint",
        "options": {
          "lintFilePatterns": ["src/**/*.ts", "src/**/*.html"]
        }
      }
    }
  }
}
```

### Step 6: Add npm Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "lint": "ng lint",
    "format": "prettier --write \"src/**/*.ts\" \"src/**/*.html\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"src/**/*.html\""
  }
}
```

### Step 7: Configure TypeScript tsconfig.json

Update `tsconfig.json` for strict mode:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": ["ES2022", "dom"]
  }
}
```

### Step 8: Configure .gitignore

Create/update `.gitignore`:

```
# Dependencies
node_modules/
npm-debug.log
yarn-error.log

# Production
dist/
build/

# Misc
.DS_Store
Thumbs.db
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo

# Environment
.env
.env.local
.env.*.local

# Angular
.angular/
```

### Step 9: Test Configurations

```bash
# Test linting
npm run lint

# Test formatting
npm run format:check

# Fix formatting
npm run format

# Run development server
npm start
```

---

## ✅ Configuration Verification

- [ ] `tsconfig.json` has `strict: true`
- [ ] `.eslintrc.json` created
- [ ] `.prettierrc.json` created
- [ ] `package.json` has npm scripts
- [ ] `npm run lint` works
- [ ] `npm run format` works
- [ ] `npm start` runs dev server
- [ ] No configuration errors

---

## 📊 Key Configuration Files

| File | Purpose |
|------|---------|
| `angular.json` | Build & serve config |
| `tsconfig.json` | TypeScript compiler options |
| `.eslintrc.json` | Linting rules |
| `.prettierrc.json` | Code formatting |
| `.gitignore` | Git ignore patterns |
| `package.json` | Dependencies & scripts |

---

## 🔗 Next Steps

1. Verify all configurations work
2. Move to **Prompt #4: Build & Deploy**

---

**Estimated Time:** 15-20 minutes  
**Difficulty:** Intermediate  
**Prerequisites:** Prompt #2 (project created)  
**Next:** `4-build-deploy.md`
