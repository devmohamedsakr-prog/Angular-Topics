# Install Development Tools

**IDE Prompt:** Use this when setting up the development environment for Angular projects.

---

## 🎯 Task: Install Node.js, npm, and Angular CLI

**When to use:** Starting development on a new machine or setting up for the first time.

---

## 📋 Checklist

- [ ] Node.js installed (v16+)
- [ ] npm installed and updated
- [ ] Angular CLI installed globally
- [ ] Verify installations
- [ ] Configure npm settings

---

## 🚀 Step-by-Step Instructions

### Step 1: Install Node.js

**Download from:** https://nodejs.org/

**Choose:** LTS (Long Term Support) version (v18+ or v20+)

**Installation:**
- Windows: Run installer, follow prompts
- Mac: Use Homebrew: `brew install node`
- Linux: Use package manager or nvm

**Verify Installation:**
```bash
node --version
npm --version
```

**Expected Output:**
```
v18.17.0  (or newer)
9.6.7     (or newer)
```

### Step 2: Update npm to Latest

```bash
npm install -g npm@latest
```

Verify:
```bash
npm --version
```

### Step 3: Install Angular CLI Globally

```bash
npm install -g @angular/cli
```

This installs the `ng` command globally.

**Verify Installation:**
```bash
ng version
```

**Expected Output:**
```
     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \  | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \ | | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\|_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/

Angular CLI: 17.x.x
Node: 18.x.x
npm: 9.x.x
```

### Step 4: Configure npm Settings (Optional)

```bash
# Set default npm packages directory
npm config set prefix /usr/local

# Set default package manager
npm config set engine-strict true

# View all npm settings
npm config list
```

### Step 5: Create First Angular Project (Test)

```bash
# Create test project
ng new test-app

# Navigate to project
cd test-app

# Start development server
ng serve
```

**Expected Output:**
```
✔ Packages installed successfully.
✔ Initialization of workspace complete.

✔ Build complete.
Application bundle generated successfully in 5.23 seconds.

Watch mode enabled. Watching for file changes...
⠋ Building...

** Angular Live Development Server is listening on localhost:4200 **
```

Visit: http://localhost:4200

You should see the Angular welcome page!

### Step 6: Verify Project Structure

```bash
# In test-app directory
ls -la

# Expected directories/files:
# src/
# angular.json
# package.json
# tsconfig.json
# README.md
# ...
```

---

## ✅ Verification Checklist

- [ ] `node --version` shows v16+
- [ ] `npm --version` shows latest
- [ ] `ng version` shows Angular CLI version
- [ ] Test project created successfully
- [ ] `ng serve` runs without errors
- [ ] Browser shows Angular welcome page at localhost:4200

---

## 🔧 Troubleshooting

**"ng: command not found"**
```bash
# Install Angular CLI again
npm install -g @angular/cli

# Or use npx (don't need global install)
npx @angular/cli@latest new my-app
```

**"npm ERR! code EACCES"** (Permission denied)
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**"Node version too old"**
```bash
# Update Node.js
# Visit https://nodejs.org/ and download latest LTS
```

---

## 📚 System Requirements

**Minimum:**
- Node.js: v16 (deprecated) or v18+ (recommended)
- npm: 8+ (comes with Node)
- RAM: 4GB+
- Disk: 2GB+

**Recommended:**
- Node.js: v20 LTS
- npm: 9+
- RAM: 8GB+
- Disk: 5GB+ (for node_modules)

---

## 🔗 Next Steps

After verification:
1. Delete test-app: `rm -rf test-app`
2. Move to **Prompt #2: Create New Angular Project**

---

**Estimated Time:** 15-20 minutes  
**Difficulty:** Beginner  
**Next:** `2-create-angular-project.md`
