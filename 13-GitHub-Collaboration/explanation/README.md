# GitHub Collaboration & Team Workflow

Complete guide to collaborative development using Git and GitHub for Angular teams.

## Overview

Effective Git/GitHub collaboration ensures:
- **Code Quality**: All code reviewed before merging
- **Traceability**: Complete history of all changes
- **Teamwork**: Clear processes for conflict resolution
- **Automation**: CI/CD pipelines catch issues early
- **Documentation**: Commit history tells the story

## Key Concepts

### 1. **Branching Strategy**
- Organize work into feature/bugfix/release branches
- Main branch always production-ready
- Develop branch for integration

### 2. **Pull Requests**
- Propose changes for review
- Discuss code before merging
- Run automated tests

### 3. **Code Review**
- Peer review before merge
- Knowledge sharing
- Catch bugs early

### 4. **CI/CD Pipeline**
- Automated testing
- Build verification
- Auto-deployment

### 5. **Team Communication**
- Clear commit messages
- PR descriptions
- Issue tracking

---

## Git Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Collaboration Workflow                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. CREATE FEATURE BRANCH                                       │
│     git checkout -b feature/user-authentication                │
│                                                                 │
│  2. COMMIT CHANGES                                              │
│     git add .                                                   │
│     git commit -m "feat: add login form"                       │
│                                                                 │
│  3. PUSH TO REMOTE                                              │
│     git push -u origin feature/user-authentication             │
│                                                                 │
│  4. CREATE PULL REQUEST                                         │
│     - Describe changes                                          │
│     - Reference issues                                          │
│     - Request reviewers                                         │
│                                                                 │
│  5. CODE REVIEW                                                 │
│     - Team reviews code                                         │
│     - Suggestions and discussions                               │
│     - Update based on feedback                                  │
│                                                                 │
│  6. RUN CI/CD CHECKS                                            │
│     - Tests pass                                                │
│     - Build succeeds                                            │
│     - Linting/formatting OK                                     │
│                                                                 │
│  7. MERGE TO DEVELOP                                            │
│     - Squash, rebase, or merge                                 │
│     - Delete feature branch                                     │
│                                                                 │
│  8. AUTO-DEPLOY                                                 │
│     - To staging environment                                    │
│     - QA testing                                                │
│     - Release to production                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Roles & Responsibilities

### Developer
- Create feature branches
- Write clean code
- Add tests
- Update documentation
- Request code review
- Respond to feedback

### Code Reviewer
- Review code thoroughly
- Suggest improvements
- Ask clarifying questions
- Approve or request changes
- Check tests and CI status

### Tech Lead
- Set coding standards
- Approve architecture changes
- Resolve conflicts
- Manage releases
- Monitor CI/CD pipeline

### DevOps
- Manage CI/CD infrastructure
- Monitor deployments
- Handle production issues
- Scale services
- Manage secrets/configs

---

## Branch Naming Conventions

```
feature/     → New feature implementation
  feature/user-authentication
  feature/payment-processing

bugfix/      → Bug fixes
  bugfix/login-redirect-issue
  bugfix/form-validation-error

hotfix/      → Production hotfixes
  hotfix/critical-security-patch
  hotfix/data-loss-prevention

chore/       → Maintenance and tooling
  chore/update-dependencies
  chore/refactor-service

docs/        → Documentation only
  docs/update-readme
  docs/add-api-documentation

style/       → Code style/formatting
  style/format-scss
  style/eslint-config-update

test/        → Test additions
  test/add-user-service-tests
  test/e2e-checkout-flow

perf/        → Performance improvements
  perf/optimize-bundle-size
  perf/lazy-load-admin-module

ci/          → CI/CD changes
  ci/add-github-actions
  ci/configure-codecov
```

### Rules

- Use lowercase
- Use forward slash as separator
- Be descriptive (not "feature/test" but "feature/user-authentication")
- Maximum 50 characters
- Use hyphens between words

---

## Commit Message Standards

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

```
feat:      New feature
fix:       Bug fix
docs:      Documentation changes
style:     Code style (no logic change)
refactor:  Code refactoring
perf:      Performance improvement
test:      Test additions or changes
chore:     Dependencies, build config
ci:        CI/CD changes
revert:    Revert previous commit
```

### Examples

```
# ✅ GOOD
feat(auth): implement JWT token refresh
fix(forms): resolve validation error on submit
docs(readme): update installation instructions
perf(bundle): reduce main.js size by 15%

# ❌ BAD
fixed stuff
updated code
final final version
work in progress
```

### Body Guidelines

- Explain WHAT changed and WHY
- Reference related issues (#123)
- Keep lines under 72 characters
- Use imperative mood ("add" not "added")

### Example Complete Commit

```
feat(user-profile): add avatar upload functionality

- Implement file upload for user avatars
- Add image validation (size, format)
- Store in cloud storage (S3)
- Optimize images for web (WebP, multiple sizes)

Closes #456
```

---

## PR Description Template

```markdown
## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Changes Made
- Point 1
- Point 2
- Point 3

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing done
- [ ] E2E tests pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for clarity
- [ ] Tests pass locally
- [ ] No console.log statements
- [ ] Documentation updated
- [ ] No security issues
```

---

## Code Review Checklist

### Correctness
- [ ] Code accomplishes intended purpose
- [ ] No obvious bugs or edge cases missed
- [ ] Error handling present
- [ ] Type safety maintained

### Quality
- [ ] Code is readable and maintainable
- [ ] Follows project conventions
- [ ] DRY principle applied
- [ ] No unnecessary complexity

### Performance
- [ ] No performance regressions
- [ ] Efficient algorithms used
- [ ] Unnecessary loops eliminated
- [ ] API calls minimized

### Security
- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] No hardcoded secrets
- [ ] OWASP standards followed

### Testing
- [ ] Adequate test coverage (80%+)
- [ ] Tests are meaningful
- [ ] Edge cases covered
- [ ] No flaky tests

### Documentation
- [ ] Code is well-commented
- [ ] Complex logic explained
- [ ] README updated if needed
- [ ] API documentation complete

---

## Common Merge Strategies

### Squash Merge
```
# Before:
commit abc - feat: add login
commit def - fix: validation
commit ghi - refactor: cleanup

# After squash:
commit xyz - feat: add login (squashed)
```

**When**: Feature branch has many small commits

**Pros**: Clean history, single commit per feature

**Cons**: Lose intermediate commit history

### Rebase & Merge
```
# Before:
main:        A - B - C
feature:          D - E - F

# After:
main:        A - B - C - D' - E' - F'
```

**When**: Want linear history without merge commits

**Pros**: Clean, linear history

**Cons**: Rewrites history, can be confusing

### Merge Commit
```
# Before:
main:        A - B - C
feature:          D - E

# After:
main:        A - B - C - M (merge commit)
                   \   /
feature:            D - E
```

**When**: Preserving branch integration history matters

**Pros**: Shows when integration happened

**Cons**: Complex history with merge commits

---

## Conflict Resolution

### When Conflicts Occur

```bash
# 1. Pull latest changes
git pull origin develop

# 2. See conflicted files
git status

# 3. Edit conflicted files
# Look for: <<<<<<, ======, >>>>
```

### Resolving Conflicts

```
<<<<<<< HEAD
  our version of code
=======
  their version of code
>>>>>>> branch-name
```

**Steps:**
1. Decide which version to keep
2. Remove conflict markers
3. Test thoroughly
4. Commit and push

```bash
# After resolution:
git add .
git commit -m "chore: resolve merge conflict"
git push
```

---

## GitHub Features

### Issues

```markdown
# Bug Report
**Description**: Login button not clickable
**Steps to Reproduce**: 
1. Go to /login
2. Click login button
3. Notice no response

**Expected**: Form submits
**Actual**: No action

**Environment**: Chrome, Windows
```

### Milestones

- Group issues/PRs by release
- Track progress towards goals
- Organize by deadlines

### Projects

```
To Do       → In Progress → In Review → Done
  Issue #1    Issue #2      PR #5      Issue #3
  Issue #4    Issue #6      PR #7      
```

### Discussions

- Team conversations
- Architecture decisions
- Best practices sharing
- Q&A forum

---

## GitHub Actions for CI/CD

### What Runs Automatically

```yaml
On Each Push:
✓ Run linter (ESLint, Prettier)
✓ Run tests (Jest, Karma)
✓ Build Angular app
✓ Analyze bundle size
✓ Security scanning

On Pull Request:
✓ All above checks
✓ Code coverage report
✓ Performance comparison
✓ Preview deployment

On Merge to Main:
✓ Build production
✓ Run full test suite
✓ Deploy to staging
✓ Run smoke tests
```

---

## Team Best Practices

### ✅ DO

- [ ] Keep branches small and focused (200-500 lines)
- [ ] Make frequent small commits
- [ ] Write descriptive commit messages
- [ ] Request review from 1-2 people
- [ ] Respond to feedback promptly
- [ ] Test locally before pushing
- [ ] Keep branch up-to-date with main
- [ ] Delete merged branches

### ❌ DON'T

- [ ] Force push to shared branches
- [ ] Commit directly to main/develop
- [ ] Leave branches unmerged for weeks
- [ ] Commit secrets or sensitive data
- [ ] Merge without review
- [ ] Ignore failing CI checks
- [ ] Commit debug code/console.log
- [ ] Rebase public history

---

## Quick Reference

### Common Commands

```bash
# Branch management
git checkout -b feature/new-feature
git branch -d feature/completed-feature
git branch -a

# Stashing work
git stash
git stash pop

# Undo changes
git revert <commit>
git reset --hard HEAD~1

# View history
git log --oneline -10
git log --graph --all --oneline

# Sync with remote
git fetch origin
git pull origin develop
git push -u origin feature/branch
```

---

## Resources

- [GitHub Docs](https://docs.github.com)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [Git Flight Rules](https://github.com/k88hudson/git-flight-rules)
- [Angular Contributing Guide](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)

