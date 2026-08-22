# Angular CLI & Setup Guide

Welcome to the Angular CLI & Setup Fundamentals resource! This comprehensive guide covers everything needed to set up Angular development environments and understand the CLI.

## 📚 Learning Structure

This resource is organized by **focus areas** for deep, focused learning:

1. **CLI Installation & Overview** - Install and understand Angular CLI
2. **Creating & Serving Projects** - Set up new projects and development
3. **Project Structure & Configuration** - Understand project files and configuration
4. **Generating & Building** - Code generation and production builds
5. **Testing, Deployment & Best Practices** - Testing, deployment, and workflows

## 🗂️ File Organization

```
1-CLI-and-Setup/
├── README.md (this file)
├── explanation/
│   ├── 1-cli-installation-overview.md
│   ├── 2-creating-serving-projects.md
│   ├── 3-project-structure-configuration.md
│   ├── 4-generating-building.md
│   └── 5-testing-deployment-best-practices.md
└── examples/
    ├── 1-installation-setup-scripts.sh
    ├── 2-project-creation-commands.sh
    ├── 3-generation-commands.sh
    ├── 4-build-deployment-commands.sh
    ├── 5-docker-nginx-config.dockerfile
    └── nginx.conf
```

## 🚀 Quick Navigation

### Focus Area 1: CLI Installation & Overview
- **[Explanation](./explanation/1-cli-installation-overview.md)** - What is Angular CLI, installation, and verification
- **[Scripts](./examples/1-installation-setup-scripts.sh)** - Installation and setup commands

### Focus Area 2: Creating & Serving Projects
- **[Explanation](./explanation/2-creating-serving-projects.md)** - Creating projects, serving with CLI, project structure
- **[Scripts](./examples/2-project-creation-commands.sh)** - Project creation and initialization commands

### Focus Area 3: Project Structure & Configuration
- **[Explanation](./explanation/3-project-structure-configuration.md)** - angular.json, tsconfig, environment files, path aliases
- **[Files](./examples/)** - Configuration file examples

### Focus Area 4: Generating & Building
- **[Explanation](./explanation/4-generating-building.md)** - Code generation and production builds
- **[Scripts](./examples/3-generation-commands.sh)** - Component, service, and other generation commands
- **[Scripts](./examples/4-build-deployment-commands.sh)** - Build and deployment commands

### Focus Area 5: Testing, Deployment & Best Practices
- **[Explanation](./explanation/5-testing-deployment-best-practices.md)** - Testing, deployment, and best practices
- **[Docker](./examples/5-docker-nginx-config.dockerfile)** - Multi-stage Docker build
- **[Nginx](./examples/nginx.conf)** - Nginx configuration for SPA

## 📖 Learning Paths

### Beginner: Start Here
1. CLI Installation & Overview - Get Angular CLI working
2. Creating & Serving Projects - Create your first project
3. Project Structure & Configuration - Understand the project layout
4. Generating & Building - Learn to scaffold components
5. Testing, Deployment & Best Practices - Deploy your app

### Intermediate: Build Skills
- Follow explanations in each focus area
- Review example scripts and commands
- Practice with your own projects
- Combine multiple concepts

### Advanced: Master Angular CLI
- Create complex monorepo setups
- Optimize bundle size and builds
- Set up CI/CD pipelines
- Deploy to various platforms
- Performance tuning

### Quick Reference: Just Commands
Jump to the examples folder for quick command references.

## 💡 Key Concepts

| Concept | Purpose | Location |
|---------|---------|----------|
| **ng new** | Create new project | Area 2 |
| **ng serve** | Development server | Area 2 |
| **ng generate** | Scaffold code | Area 4 |
| **ng build** | Production builds | Area 4 |
| **ng test** | Run tests | Area 5 |
| **angular.json** | CLI config | Area 3 |
| **tsconfig.json** | TypeScript config | Area 3 |
| **Environments** | Build configs | Area 3 |
| **Path Aliases** | Clean imports | Area 3 |
| **Docker** | Containerization | Area 5 |

## ✅ Common Tasks

### Quick Setup
```bash
# 1. Install Node.js and Angular CLI
npm install -g @angular/cli

# 2. Create new project
ng new my-app --routing --style=scss

# 3. Start development server
cd my-app
ng serve

# 4. Open http://localhost:4200
```

### Create Components
```bash
# Generate component
ng generate component components/user-list

# Generate service
ng generate service services/user

# Generate guard
ng generate guard guards/auth
```

### Build for Production
```bash
# Build optimized version
ng build --configuration production

# Analyze bundle
ng build --stats-json
webpack-bundle-analyzer dist/my-app/stats.json

# Preview production build
serve dist/my-app
```

## 🎯 Best Practices

- ✅ Keep Angular CLI updated
- ✅ Use path aliases for clean imports
- ✅ Enable strict mode for type safety
- ✅ Organize code by feature/module
- ✅ Use lazy loading for performance
- ✅ Keep components small and focused
- ✅ Write tests for services and components
- ✅ Use production builds for deployment
- ✅ Monitor bundle size regularly
- ✅ Automate with CI/CD

## 🔗 Related Resources

- **1-Fundamentals TypeScript** - See `../../1-Fundamentals/1-TypeScript/` for type system
- **1-Fundamentals ES6+** - See `../../1-Fundamentals/2-ES6+/` for modern JavaScript
- **2-Components** - See `../2-Components/` for component fundamentals
- **Official Docs** - https://angular.io/cli

## 📊 Statistics

- **5 Focus Areas** - Organized by topic
- **5 Explanation Files** - Deep conceptual coverage
- **5 Example Files** - Practical scripts and configs
- **100+ Commands** - Common CLI commands documented
- **Complete Coverage** - From setup to deployment

## 🏆 Learning Goals

After completing this guide, you will be able to:

1. ✓ Install and verify Angular CLI
2. ✓ Create new Angular projects
3. ✓ Understand project structure and configuration
4. ✓ Generate components, services, and other artifacts
5. ✓ Build applications for production
6. ✓ Test Angular applications
7. ✓ Deploy applications to various platforms
8. ✓ Optimize performance and bundle size
9. ✓ Follow Angular and CLI best practices
10. ✓ Set up professional development workflows

## 🔄 Recommended Study Order

1. **Start** with CLI Installation (Area 1)
2. **Create** your first project (Area 2)
3. **Explore** project structure (Area 3)
4. **Practice** code generation (Area 4)
5. **Build** for production (Area 5)
6. **Deploy** to a hosting service

## 📝 Notes

- All examples use modern Angular (v14+)
- Commands work on Windows, macOS, and Linux
- Adjust paths based on your project structure
- Node.js 18+ required for Angular 17+

## 🤝 Contributing

Found an issue or want to improve this guide? Please contribute!

---

**Last Updated:** August 2026  
**Difficulty:** Beginner to Intermediate  
**Time to Complete:** 3-4 hours  
**Prerequisites:** Basic JavaScript knowledge, installed Node.js
