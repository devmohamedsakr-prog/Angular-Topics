# Git Branching Strategies

Three popular branching models for managing releases, features, and hotfixes.

## Overview

Choosing the right branching strategy depends on:
- Team size
- Release frequency
- Maintenance requirements
- CI/CD maturity

---

## Strategy 1: Git Flow (Most Common)

Ideal for: Projects with scheduled releases and multiple maintenance versions

### Branch Structure

```
main (production-ready)
  ↑
  ├── release/v1.5.0 (release candidate)
  │     ↓
develop (integration branch)
  ├── feature/auth (developer's work)
  ├── feature/payment
  ├── bugfix/form-validation
  └── hotfix/security-patch ← from main
```

### Main Branches

**main**: Production-ready code only
- Tagged with version numbers (v1.0.0)
- Only merged from release or hotfix branches
- Requires code review

**develop**: Integration branch for features
- Always deployable to staging
- Merged from feature branches
- Base for release planning

### Supporting Branches

**feature/**: New features
```
Branch from: develop
Merge back to: develop
Naming: feature/user-authentication, feature/payment-processing
```

**release/**: Release preparation
```
Branch from: develop
Merge back to: main and develop
Naming: release/v1.5.0, release/v2.0.0
Purpose: Final testing, bug fixes, documentation
```

**bugfix/**: Bug fixes during development
```
Branch from: develop
Merge back to: develop
Naming: bugfix/login-redirect, bugfix/form-validation
```

**hotfix/**: Production bugs
```
Branch from: main
Merge back to: main and develop
Naming: hotfix/security-patch, hotfix/data-loss-fix
Purpose: Critical production fixes
```

### Workflow

```
1. Start feature:
   git checkout -b feature/user-auth develop

2. Commit changes:
   git add .
   git commit -m "feat: add authentication"

3. Create Pull Request for code review

4. Merge after approval:
   git checkout develop
   git pull origin develop
   git merge --no-ff feature/user-auth
   git push origin develop

5. Prepare release:
   git checkout -b release/v1.5.0 develop

6. Merge to main:
   git checkout main
   git pull origin main
   git merge --no-ff release/v1.5.0
   git tag -a v1.5.0

7. Merge back to develop:
   git checkout develop
   git merge --no-ff release/v1.5.0

8. Delete release branch:
   git branch -d release/v1.5.0
   git push origin --delete release/v1.5.0
```

### Advantages

✅ Clear separation of concerns
✅ Easy to maintain multiple versions
✅ Organized hotfix process
✅ Familiar to many teams

### Disadvantages

❌ More complex than trunk-based
❌ Longer release cycles
❌ More merge conflicts

---

## Strategy 2: GitHub Flow (Simpler)

Ideal for: Continuous deployment, rapid iterations, smaller teams

### Branch Structure

```
main (always production-ready)
  ├── feature/quick-fix
  ├── feature/dashboard-redesign
  └── feature/bug-report-system
```

Only TWO branches:
- **main**: Production code
- **feature/xxx**: Any work (features, fixes, experiments)

### Workflow

```
1. Create feature branch from main:
   git checkout -b feature/add-dark-mode

2. Commit frequently:
   git add .
   git commit -m "feat: add dark mode toggle"

3. Create Pull Request:
   - Describe what & why
   - Wait for review
   - Run automated tests

4. Discuss and refine:
   - Team reviews code
   - Respond to feedback
   - Push updates

5. Merge to main:
   - All tests pass
   - Code approved
   - Merge and deploy immediately

6. Delete branch:
   git branch -d feature/add-dark-mode
```

### Key Rules

1. **Anything in main is deployable**
2. **Create descriptive pull requests**
3. **Get code reviewed before merging**
4. **Merge, then deploy**
5. **Delete merged branches**

### Advantages

✅ Simple and straightforward
✅ Continuous deployment friendly
✅ Fewer branches to manage
✅ Clear main branch policy

### Disadvantages

❌ Harder to maintain multiple versions
❌ Requires strong CI/CD practices
❌ No staging area between code and production

---

## Strategy 3: Trunk-Based Development

Ideal for: High-performance teams, continuous deployment, microservices

### Branch Structure

```
main (always production-ready)
  ├── developers keep branches short-lived (< 1 day)
  └── continuous integration to main
```

### Workflow

```
1. Create short-lived branch:
   git checkout -b f/quick-ui-fix

2. Minimal work (1-4 hours):
   git add .
   git commit -m "fix: button styling"

3. Quick code review:
   git push origin f/quick-ui-fix
   Create tiny PR

4. Merge to main same day:
   git checkout main
   git pull origin main
   git merge --ff f/quick-ui-fix
   git push origin main

5. Delete branch immediately:
   git branch -d f/quick-ui-fix
```

### Key Principles

1. **Small batches**: Keep changes small
2. **Frequent commits**: Multiple times per day
3. **Quick reviews**: 30-60 minutes max
4. **Fast CI/CD**: Tests run in < 5 minutes
5. **Feature flags**: Hide incomplete work
6. **Delete branches**: Don't accumulate branches

### Feature Flags Example

```typescript
// Feature behind flag
if (environment.features.darkMode) {
  // Show dark mode UI
}

// Incomplete code doesn't block main
```

### Advantages

✅ Fastest delivery
✅ Reduces merge conflicts
✅ Continuous integration natural
✅ Better code quality (rapid feedback)

### Disadvantages

❌ Requires strong CI/CD maturity
❌ Team discipline essential
❌ Can't maintain multiple versions
❌ Needs feature flags expertise

---

## Comparison Matrix

| Aspect | Git Flow | GitHub Flow | Trunk-Based |
|--------|----------|-------------|------------|
| Complexity | High | Low | Medium |
| Release Cycle | Planned | Continuous | Continuous |
| Max Branch Age | 2 weeks+ | 1 week | < 1 day |
| Versions | Multiple | Single | Single |
| Team Size | Large | Small-Medium | Medium-Large |
| CI/CD Maturity | Moderate | High | Very High |
| Learning Curve | Steep | Gentle | Moderate |
| Conflicts | Moderate | Low | Low |
| Time to Deploy | Days | Hours | Minutes |

---

## Choosing Your Strategy

### Use Git Flow if...
- You have multiple versions in production
- Releases are scheduled (monthly/quarterly)
- Team > 10 developers
- Need clear separation between develop/main

### Use GitHub Flow if...
- Single version in production
- Rapid releases (weekly/continuous)
- Team < 10 developers
- Want simplicity and speed

### Use Trunk-Based if...
- High-performing team
- Continuous deployment needed
- Microservices architecture
- Advanced CI/CD infrastructure

---

## Best Practices for All Strategies

### Branch Hygiene

```bash
# List all local branches
git branch -a

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Prune deleted remote branches
git fetch --prune
git branch -r --prune
```

### Keep Branches Updated

```bash
# Before merging, get latest from main
git fetch origin
git rebase origin/main

# Or merge (creates merge commit)
git merge origin/main
```

### Squash Commits for Clean History

```bash
# Interactive rebase last 3 commits
git rebase -i HEAD~3

# Then squash commits in the editor
# s (squash) to combine with previous commit
```

---

## Release Process Example (Git Flow)

### Week 1: Feature Development

```bash
# Developer 1
git checkout -b feature/auth develop
# Code authentication...
git push origin feature/auth
# Create PR, get review, merge

# Developer 2
git checkout -b feature/payment develop
# Code payment...
git push origin feature/payment
# Create PR, get review, merge
```

### Week 2: Release Planning

```bash
# Release manager creates release branch
git checkout -b release/v2.0.0 develop

# Version bump, changelog
# Final testing and fixes
git commit -m "chore: bump to v2.0.0"
```

### Week 3: Release to Production

```bash
# Merge to main
git checkout main
git merge --no-ff release/v2.0.0
git tag -a v2.0.0 -m "Version 2.0.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/v2.0.0
git push origin develop

# Delete release branch
git push origin --delete release/v2.0.0
```

---

## Handling Hotfixes

### Git Flow Style

```bash
# Branch from main
git checkout -b hotfix/critical-bug main

# Fix the bug
git add .
git commit -m "fix: critical security issue"

# Merge to main
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.5.1

# Merge to develop
git checkout develop
git merge --no-ff hotfix/critical-bug

# Delete hotfix branch
git branch -d hotfix/critical-bug
```

### GitHub Flow Style

```bash
# Branch from main
git checkout -b hotfix/critical-bug

# Fix and PR
git commit -m "fix: critical security issue"
git push origin hotfix/critical-bug

# Create PR, review, merge
git checkout main
git merge hotfix/critical-bug
git delete branch
```

---

## Visual Diagrams

See `examples/` folder for:
- Git Flow diagram
- GitHub Flow diagram
- Trunk-Based diagram
- Release timeline examples

