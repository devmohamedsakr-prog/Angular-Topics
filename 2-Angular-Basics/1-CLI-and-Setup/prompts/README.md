# CLI and Setup - IDE Prompts

**Step-by-step guides for installing, creating, configuring, and deploying Angular projects.**

---

## 📋 Prompt Files Overview

### 1. [Install Development Tools](./1-install-tools.md)
**Time:** 15-20 minutes | **Level:** Beginner

Install and verify development tools:
- Node.js (v18+ LTS)
- npm (latest)
- Angular CLI (globally)
- Create test project to verify

**Outcomes:**
- ✅ Node.js installed
- ✅ npm verified
- ✅ Angular CLI working
- ✅ First project created and tested

---

### 2. [Create New Angular Project](./2-create-angular-project.md)
**Time:** 10-15 minutes | **Level:** Beginner

Create and configure new Angular project:
- Generate project with `ng new`
- Configure routing and styling
- Understand project structure
- Start development server
- Generate first component

**Outcomes:**
- ✅ Angular project created
- ✅ Dev server running
- ✅ Project structure understood
- ✅ First component generated

---

### 3. [Configure Project Settings](./3-configure-project.md)
**Time:** 15-20 minutes | **Level:** Intermediate

Configure TypeScript, linting, and build settings:
- Enable strict TypeScript mode
- Install and configure ESLint
- Configure Prettier (formatter)
- Add npm scripts
- Setup .gitignore

**Outcomes:**
- ✅ Strict TypeScript enabled
- ✅ ESLint configured
- ✅ Prettier configured
- ✅ Build scripts added
- ✅ Git setup complete

---

### 4. [Build & Deploy Application](./4-build-deploy.md)
**Time:** 20-30 minutes | **Level:** Intermediate-Advanced

Build production bundle and deploy:
- Create production build
- Verify build output
- Deploy to Netlify, Vercel, or GitHub Pages
- Environment configuration
- Bundle optimization

**Outcomes:**
- ✅ Production build created
- ✅ Application deployed
- ✅ Live at public URL
- ✅ Deployment verified

---

## 🚀 Quick Start

**Complete Setup Path (1 hour):**

```
1. Install Tools (20 min)
   ↓
2. Create Project (15 min)
   ↓
3. Configure (20 min)
   ↓
4. Deploy (30 min)
```

---

## 📊 Learning Outcomes

After completing all 4 prompts, you will:

✅ Have Node.js and Angular CLI installed  
✅ Be able to create new Angular projects  
✅ Understand project structure and configuration  
✅ Know how to configure TypeScript, linting, and formatting  
✅ Be able to build for production  
✅ Know how to deploy to multiple platforms  
✅ Have a production-ready Angular application

---

## 🛠️ Commands Quick Reference

```bash
# Installation
node --version              # Check Node.js
npm --version              # Check npm
ng version                 # Check Angular CLI

# Project Creation
ng new my-app              # Create project
cd my-app                  # Enter directory
npm install                # Install dependencies

# Development
ng serve                   # Start dev server
npm start                  # Alternative
ng generate component name # Generate component
ng g c name               # Short form

# Linting & Formatting
npm run lint              # Run linting
npm run format            # Format code
npm run format:check      # Check formatting

# Building & Deployment
ng build                  # Development build
ng build --prod           # Production build
npm run build             # Alternative
ng test                   # Run tests
ng e2e                    # End-to-end tests

# Deployment
netlify deploy --prod     # Deploy to Netlify
vercel --prod             # Deploy to Vercel
ngh --dir=dist/my-app     # Deploy to GitHub Pages
```

---

## 📁 File Structure After All Prompts

```
my-awesome-app/
├── src/
│   ├── app/
│   │   ├── components/      (Generated components)
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   ├── main.ts
│   └── index.html
├── dist/                    (Production build output)
├── node_modules/
├── .angular/
├── .eslintrc.json          (Linting config)
├── .prettierrc.json        (Formatting config)
├── .gitignore
├── angular.json
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔑 Key Concepts

### 1. Development vs Production
- **Development:** Fast rebuilds, detailed source maps, not optimized
- **Production:** Optimized, minified, tree-shaken, deployed

### 2. TypeScript Strict Mode
- Enables strict type checking
- Prevents common errors
- Required for best practices

### 3. Linting & Formatting
- **Linting:** Finds code quality issues (ESLint)
- **Formatting:** Makes code consistent (Prettier)

### 4. Environment Configuration
- Different settings for dev/prod
- Different API endpoints
- Different logging levels

---

## 💡 Pro Tips

1. **Use TypeScript Strict Mode** from the start
2. **Enable ESLint** for code quality
3. **Use Prettier** for consistent formatting
4. **Test Locally** before deploying
5. **Use Environment Files** for different settings
6. **Monitor Bundle Size** for performance
7. **Deploy Early** to catch issues early

---

## 🔗 Related Files

**Theory & Examples:**
- `../explanation/` - Detailed explanations
- `../examples/` - Code examples

**Interview Questions:**
- `../interview-questions/` - Q&A

**Other Folders:**
- `2-Components/` - Component building
- `3-Templates-and-Binding/` - Templates
- `4-Directives/` - Directives
- `5-Internationalization/` - i18n
- `6-Responsive-Design/` - Responsive apps

---

## ✅ Completion Checklist

- [ ] Prompt 1: Tools installed and verified
- [ ] Prompt 2: Project created and running
- [ ] Prompt 3: Configuration complete
- [ ] Prompt 4: Application deployed live
- [ ] All commands working
- [ ] Project structure understood
- [ ] Ready to add features

---

## 🎓 Next Steps

After completing CLI & Setup:

1. **Learn Components** → `2-Components/prompts/`
2. **Learn Templates** → `3-Templates-and-Binding/prompts/`
3. **Learn Directives** → `4-Directives/prompts/`
4. **Learn i18n** → `5-Internationalization/prompts/`
5. **Learn Responsive** → `6-Responsive-Design/prompts/`

---

**Version:** 1.0  
**Created:** August 22, 2026  
**Status:** ✅ Complete

**Ready to start building Angular apps? Begin with Prompt #1! 🚀**
