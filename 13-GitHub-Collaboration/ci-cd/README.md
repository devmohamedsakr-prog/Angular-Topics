# GitHub Actions & CI/CD Pipeline

Automated testing, building, and deployment for Angular applications.

## Overview

CI/CD Pipeline ensures:
- **Code Quality**: Lint, format, type checks
- **Reliability**: Automated tests before merge
- **Speed**: Faster feedback to developers
- **Safety**: Consistent builds and deployments
- **Traceability**: Every change tracked and logged

---

## CI/CD Pipeline Stages

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Actions Pipeline                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TRIGGER: Push to PR or Merge to Main                   │
│                                                         │
│  ┌─────────────────────────────────────────────┐        │
│  │ Stage 1: Quality Checks (5 min)             │        │
│  │  ✓ ESLint                                   │        │
│  │  ✓ Prettier                                 │        │
│  │  ✓ TypeScript compilation                  │        │
│  └─────────────────────────────────────────────┘        │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────┐        │
│  │ Stage 2: Build (8 min)                      │        │
│  │  ✓ Angular build production                 │        │
│  │  ✓ Generate artifacts                       │        │
│  │  ✓ Analyze bundle size                      │        │
│  └─────────────────────────────────────────────┘        │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────┐        │
│  │ Stage 3: Tests (15 min)                     │        │
│  │  ✓ Unit tests (Jest/Karma)                 │        │
│  │  ✓ Code coverage report                     │        │
│  │  ✓ E2E tests (Cypress)                     │        │
│  └─────────────────────────────────────────────┘        │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────┐        │
│  │ Stage 4: Security (3 min)                   │        │
│  │  ✓ SAST scanning                            │        │
│  │  ✓ Dependency vulnerabilities               │        │
│  │  ✓ Secret detection                         │        │
│  └─────────────────────────────────────────────┘        │
│                       ↓                                  │
│  ┌─────────────────────────────────────────────┐        │
│  │ Stage 5: Deploy (5 min)                     │        │
│  │  ✓ Build Docker image                       │        │
│  │  ✓ Push to registry                         │        │
│  │  ✓ Deploy to staging                        │        │
│  │  ✓ Smoke tests                              │        │
│  └─────────────────────────────────────────────┘        │
│                                                         │
│  TOTAL TIME: ~36 minutes                                │
│                                                         │
│  ✅ All checks passed → Merge allowed                   │
│  ❌ Any check failed → Block merge, show error          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## GitHub Actions Workflows

### Workflow 1: Pull Request Checks

**Trigger**: When PR created or updated

```yaml
name: PR Checks
on:
  pull_request:
    branches: [develop, main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Format check
        run: npm run format:check
      
      - name: Build
        run: npm run build
      
      - name: Tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-summary.json
      
      - name: E2E tests
        run: npm run e2e:ci
      
      - name: Security scan
        run: npm run security:scan
```

### Workflow 2: Merge to Main (Deploy)

**Trigger**: When PR merged to main

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install & test
        run: |
          npm ci
          npm run test:ci
          npm run build
      
      - name: Build Docker image
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker tag myapp:${{ github.sha }} myapp:latest
      
      - name: Push to registry
        run: |
          docker login -u ${{ secrets.DOCKER_USER }} -p ${{ secrets.DOCKER_PASS }}
          docker push myapp:${{ github.sha }}
      
      - name: Deploy to production
        run: |
          kubectl set image deployment/myapp myapp=myapp:${{ github.sha }}
      
      - name: Verify deployment
        run: |
          ./scripts/smoke-tests.sh
```

### Workflow 3: Scheduled Checks

**Trigger**: Daily at 2 AM

```yaml
name: Nightly Checks
on:
  schedule:
    - cron: '0 2 * * *'

jobs:
  full-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Full test suite
        run: npm run test:full
      
      - name: Performance tests
        run: npm run perf:test
      
      - name: Lighthouse audit
        run: npm run lighthouse:audit
      
      - name: Report results
        if: failure()
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
            -d '{"text":"Nightly tests failed!"}'
```

---

## Status Checks

### Required Checks Before Merge

```
✓ Lint (ESLint)
✓ Format (Prettier)
✓ Type Check (TypeScript)
✓ Build (ng build)
✓ Unit Tests (Jest)
✓ Code Coverage (80%+)
✓ E2E Tests (Cypress)
✓ Security Scan
```

### Branch Protection Rules

Go to Repository Settings → Branches → Add Rule

```
Branch: main
Requirements:
  ✓ Require pull request reviews (1 approval)
  ✓ Require status checks to pass before merging
  ✓ Include administrators in restrictions
  ✓ Require branches to be up to date
  ✓ Require code reviews before merging
  ✓ Require signed commits
```

---

## Environment Secrets

Store sensitive data securely:

```
GitHub Settings → Secrets and variables → Actions

DOCKER_USER        → Docker Hub username
DOCKER_PASS        → Docker Hub password
SLACK_WEBHOOK      → Slack webhook URL
AWS_ACCESS_KEY_ID  → AWS credentials
AWS_SECRET_ACCESS_KEY
DATABASE_URL       → Production database
API_KEY            → Third-party API keys
```

Usage in workflow:

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npm run deploy
```

---

## Artifacts & Reports

### Store Build Artifacts

```yaml
- name: Upload build
  uses: actions/upload-artifact@v3
  with:
    name: dist
    path: dist/
    retention-days: 30
```

### Code Coverage Reports

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: unittests
    fail_ci_if_error: true
```

### Test Reports

```yaml
- name: Publish test results
  uses: dorny/test-reporter@v1
  if: always()
  with:
    name: Test Results
    path: 'reports/*.xml'
    reporter: 'java-junit'
```

---

## Common Issues & Fixes

### Issue: Flaky Tests (Pass/Fail Randomly)

```yaml
# Retry failed tests
- name: Run tests
  run: npm run test:ci -- --retry=2
```

### Issue: Timeout

```yaml
# Increase timeout
jobs:
  tests:
    runs-on: ubuntu-latest
    timeout-minutes: 60
```

### Issue: Out of Disk Space

```yaml
# Clear cache before build
- name: Clear cache
  run: npm cache clean --force
```

### Issue: Slow Dependency Installation

```yaml
# Use npm ci instead of npm install (faster)
- name: Install
  run: npm ci
```

---

## Notifications

### Slack Notifications

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Build failed! 🔴",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Build Failed* in ${{ github.repository }}\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View logs>"
            }
          }
        ]
      }
```

### Email Notifications

GitHub default: Notifications sent to push committer

Configure in: Settings → Notifications → Email

---

## Performance Tips

### Cache Dependencies

```yaml
- name: Cache npm dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### Parallel Jobs

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    runs-on: ubuntu-latest
    steps: [...]
  
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]  # Runs after lint and test complete
    steps: [...]
```

### Matrix Strategy

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest]
    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
```

---

## Monitoring & Metrics

### Track Pipeline Health

```
Metrics to monitor:
  - Pipeline success rate (target: > 95%)
  - Average pipeline duration (target: < 40 min)
  - Test coverage trend (target: > 80%)
  - Failed deployments (target: 0)
  - MTTR (Mean Time To Recovery)
```

### Dashboard View

GitHub Actions → Artifacts section shows:
- Success/failure rates
- Execution times
- Trends over time

---

## Best Practices

✅ **DO:**
- Keep workflows simple and focused
- Cache dependencies
- Run jobs in parallel when possible
- Monitor CI/CD health metrics
- Document workflow purpose
- Use reusable workflows
- Set reasonable timeouts
- Clean up artifacts

❌ **DON'T:**
- Store secrets in code/config
- Make workflows too complex
- Run unnecessary checks
- Ignore workflow failures
- Leave long-running jobs unattended
- Delete important artifacts
- Hard-code environment-specific values

---

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Awesome GitHub Actions](https://github.com/sdras/awesome-actions)
- [Act - Run Actions Locally](https://github.com/nektos/act)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Cypress Documentation](https://docs.cypress.io/)

