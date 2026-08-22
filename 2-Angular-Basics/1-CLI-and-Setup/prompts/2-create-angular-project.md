# Create New Angular Project

**IDE Prompt:** Use this when starting a new Angular project.

---

## 🎯 Task: Generate and Configure New Angular Project

**When to use:** Starting a brand new Angular application.

---

## 📋 Checklist

- [ ] Create new project with `ng new`
- [ ] Choose configuration options
- [ ] Project structure created
- [ ] Dev server runs successfully
- [ ] Git initialized (optional)

---

## 🚀 Step-by-Step Instructions

### Step 1: Create New Project

```bash
ng new my-awesome-app
```

**During creation, you'll be prompted:**

```
? Would you like to add Angular routing? (y/N)
→ Choose: y (Yes)

? Which stylesheet format would you like to use? (Use arrow keys)
→ Choose: CSS

? Which rendering engine would you like to use?
→ Choose: Server and browser rendering

? Do you want to enable Server-Side Rendering (SSR)? (y/N)
→ Choose: n (No - for basic apps)
```

### Step 2: Navigate to Project

```bash
cd my-awesome-app
```

### Step 3: Project Structure Overview

```
my-awesome-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts      (Root component)
│   │   ├── app.component.html    (Root template)
│   │   ├── app.component.css     (Root styles)
│   │   └── app.module.ts         (Root module)
│   ├── assets/                   (Static files)
│   ├── styles.css                (Global styles)
│   ├── main.ts                   (Entry point)
│   └── index.html                (HTML shell)
├── angular.json                  (Project config)
├── tsconfig.json                 (TypeScript config)
├── package.json                  (Dependencies)
├── README.md                     (Documentation)
└── node_modules/                 (Installed packages)
```

### Step 4: Install Dependencies

```bash
# Already installed during ng new, but verify:
npm install

# Or use yarn
yarn install
```

### Step 5: Start Development Server

```bash
ng serve

# With port option
ng serve --port 4201

# With open browser
ng serve --open
```

**Expected Output:**
```
✔ Compiled successfully.

** Angular Live Development Server is listening on localhost:4200 **
```

Visit: http://localhost:4200

### Step 6: Verify Project Works

1. Open http://localhost:4200 in browser
2. You should see Angular welcome page
3. Open DevTools (F12) - no console errors
4. Try editing `src/app/app.component.ts` - page auto-reloads

### Step 7: Generate First Component (Optional)

```bash
ng generate component components/hello

# Short form
ng g c components/hello
```

**Files created:**
- `src/app/components/hello/hello.component.ts`
- `src/app/components/hello/hello.component.html`
- `src/app/components/hello/hello.component.css`
- `src/app/components/hello/hello.component.spec.ts`

### Step 8: Add to App Component

**File:** `src/app/app.component.html`

```html
<app-hello></app-hello>
```

The component should render on page!

---

## 🔧 Project Configuration

### Configure Styling

Choose your preferred CSS preprocessor in `angular.json`:

```json
{
  "projects": {
    "my-awesome-app": {
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"  // or "sass", "less"
        }
      }
    }
  }
}
```

### Configure Development Server

**File:** `angular.json`

```json
{
  "serve": {
    "options": {
      "port": 4200,
      "host": "localhost",
      "browserTarget": "my-awesome-app:build"
    }
  }
}
```

---

## ✅ Verification Checklist

- [ ] Project created with `ng new`
- [ ] Dependencies installed: `npm install`
- [ ] Dev server runs: `ng serve`
- [ ] http://localhost:4200 loads
- [ ] No console errors
- [ ] Angular logo visible
- [ ] Hot reload works (edit file, page updates)

---

## 📁 File Descriptions

**Key Files to Know:**

| File | Purpose |
|------|---------|
| `src/main.ts` | Application entry point |
| `src/app/app.module.ts` | Root module (bootstrap location) |
| `src/app/app.component.ts` | Root component |
| `angular.json` | Build & serve configuration |
| `tsconfig.json` | TypeScript configuration |
| `package.json` | Dependencies and scripts |

---

## 🔗 Next Steps

1. Verify project works
2. Move to **Prompt #3: Configure Project**

---

**Estimated Time:** 10-15 minutes  
**Difficulty:** Beginner  
**Prerequisites:** Prompt #1 (tools installed)  
**Next:** `3-configure-project.md`
