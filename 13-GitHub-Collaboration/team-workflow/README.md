# Team Workflow & Code Review Process

Structured processes for collaborative development and maintaining code quality.

## Table of Contents

1. [Code Review Process](#code-review-process)
2. [Pull Request Workflow](#pull-request-workflow)
3. [Team Collaboration](#team-collaboration)
4. [Conflict Resolution](#conflict-resolution)
5. [Communication Guidelines](#communication-guidelines)

---

## Code Review Process

### Why Code Review?

```
Benefits of Code Review:
  ✅ Catch bugs before production
  ✅ Knowledge sharing across team
  ✅ Maintain code consistency
  ✅ Identify security issues
  ✅ Improve code quality
  ✅ Prevent technical debt
  ✅ Enforce best practices
```

### Code Review Checklist

#### Functionality
- [ ] Code does what PR description says
- [ ] Edge cases handled
- [ ] Error scenarios covered
- [ ] No infinite loops or recursion
- [ ] All parameters used correctly
- [ ] Return values handled properly

#### Code Quality
- [ ] Follows project conventions
- [ ] DRY principle applied (no duplication)
- [ ] Complexity is reasonable
- [ ] Readable and maintainable
- [ ] Well-named variables/functions
- [ ] Comments explain why, not what

#### Performance
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] Efficient algorithms used
- [ ] No memory leaks
- [ ] API calls minimized
- [ ] Bundle size impact minimal

#### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevention
- [ ] XSS protection (sanitization)
- [ ] CSRF tokens if needed
- [ ] Authentication/authorization checked
- [ ] Rate limiting considered

#### Testing
- [ ] Unit tests added/updated
- [ ] Test coverage >= 80%
- [ ] Integration tests cover critical paths
- [ ] E2E tests for user flows
- [ ] Edge cases tested
- [ ] Mocks used appropriately
- [ ] No flaky tests

#### Documentation
- [ ] README updated if needed
- [ ] Complex logic commented
- [ ] Public APIs documented
- [ ] Type annotations complete
- [ ] Changelog entry added
- [ ] Examples included if applicable

---

## Pull Request Workflow

### Step 1: Create Feature Branch

```bash
# Update local repository
git fetch origin
git checkout develop

# Create feature branch
git checkout -b feature/add-user-profile

# Make your changes
git add .
git commit -m "feat: add user profile page"
```

### Step 2: Push to Remote

```bash
# Push feature branch
git push -u origin feature/add-user-profile

# GitHub creates "Compare & pull request" button
```

### Step 3: Create Pull Request

**PR Title**: Clear and descriptive
```
✅ feat: add user profile page with avatar upload
✅ fix: resolve form validation on mobile devices
✅ perf: optimize product list rendering speed

❌ WIP
❌ fixed stuff
❌ update
```

**PR Description**: Use template

```markdown
## Description
Added user profile page with avatar upload functionality.
Users can now manage their profile information from a dedicated page.

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation

## Changes Made
- Added UserProfileComponent
- Implemented avatar upload with S3 integration
- Added form validation for profile fields
- Added unit tests (coverage: 87%)
- Added E2E test for profile update flow

## Related Issues
Closes #234
Related to #189

## Testing
- [x] Unit tests pass (ng test)
- [x] E2E tests pass (ng e2e)
- [x] Manual testing on Chrome, Firefox, Safari
- [x] Mobile responsive design verified

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Screenshots
[If UI changes: add screenshots before/after]

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Comments added where needed
- [x] Documentation updated
- [x] Tests added and passing
- [x] No console.log statements
- [x] No new warnings from linter
- [x] No breaking changes
```

### Step 4: Request Review

```
1. Add reviewers (1-2 people)
2. Add labels (feature, bug, documentation)
3. Add to milestone if applicable
4. Add to project board
```

### Step 5: Code Review Phase

#### For Reviewers:

```
- Request changes if major issues
- Use "Approve" button when satisfied
- Leave constructive feedback
- Ask clarifying questions
- Suggest improvements
- Approve even if minor nits present
```

#### For PR Author:

```
- Respond to all comments
- Don't get defensive
- Explain your reasoning if disagreeing
- Push updates after feedback
- Mark conversations resolved
- Request re-review if major changes
```

### Step 6: Continuous Integration

All of these run automatically:

```
✓ ESLint (code quality)
✓ Prettier (formatting)
✓ Build (TypeScript compilation)
✓ Unit tests (Jasmine/Karma)
✓ Coverage (must be >= 80%)
✓ E2E tests (Cypress)
✓ Security scan
✓ Bundle size analysis
```

**Status must be:**
```
All checks passed ✅
Approved by 1-2 reviewers ✅
No conflicts with main ✅
```

### Step 7: Merge to Main

```bash
# After approval and all checks pass:
git checkout main
git pull origin main
git merge --no-ff feature/add-user-profile
git push origin main

# Delete feature branch
git branch -d feature/add-user-profile
git push origin --delete feature/add-user-profile
```

### Step 8: Deploy

Automatic deployment:
```
1. Merge to main
2. GitHub Actions triggered
3. Run production build
4. Deploy to staging
5. Run smoke tests
6. Deploy to production
7. Monitor for errors
```

---

## Team Collaboration

### Daily Standup (15 minutes)

```
What each person answers:
1. What I completed yesterday
2. What I'm working on today
3. Blockers or help needed

Example:
"Yesterday I finished user profile component.
Today I'm starting avatar upload feature.
Blocked on API endpoint for file upload."
```

### Planning Meeting (1 hour, weekly)

```
1. Review completed work
2. Estimate upcoming work
3. Assign tasks
4. Identify risks
5. Update project board
```

### Code Review Guidelines (For Reviewers)

```
Tone Matters:
  ✅ "Consider using a more specific variable name"
  ❌ "This variable name is terrible"
  
  ✅ "This approach might have performance issues"
  ❌ "This is inefficient!"
  
  ✅ "Have you considered X?"
  ❌ "You should have done X!"
```

### Review Turnaround

```
SLA (Service Level Agreement):
  - First review: within 24 hours
  - Follow-up review: within 8 hours
  - Emergency hotfixes: within 1 hour
```

---

## Conflict Resolution

### Merge Conflicts

When two people edit the same lines:

```bash
# 1. Pull latest changes
git fetch origin
git pull origin main

# 2. Conflicts appear in files
# 3. Edit conflicted files manually

<<<<<<< HEAD
  my changes
=======
  their changes
>>>>>>> feature/their-work

# 4. Choose which version to keep
# 5. Remove conflict markers
# 6. Test thoroughly
# 7. Commit and push
git add .
git commit -m "chore: resolve merge conflict"
git push
```

### Code Review Disagreement

When reviewer and author disagree:

```
1. Discuss asynchronously in PR comments
2. If not resolved: schedule sync meeting
3. Tech lead makes final decision if needed
4. Document decision in PR

Example:
Author: "This approach is simpler"
Reviewer: "But it won't scale to large datasets"
Decision: "Use database indexing to scale (tech lead decision)"
```

### Technical Direction

When team disagrees on architecture:

```
1. Create GitHub Discussion (not PR)
2. Present pros/cons of each approach
3. Vote if needed
4. Document decision
5. Add to project wiki
```

---

## Communication Guidelines

### Synchronous (Real-time)

**Use for:**
- Urgent issues
- Complex discussions
- Brainstorming
- Unblocking others

**Tools:** Slack, Video call, In-person

### Asynchronous (Recorded)

**Use for:**
- PR reviews
- Architecture decisions
- Documentation
- Meeting notes

**Tools:** GitHub, Email, Wiki

### Slack Best Practices

```
✅ Summary of what you did/found
✅ Link to PR or issue
✅ Questions specific questions
✅ Give context

❌ "hey" (no context)
❌ "did you merge that?" (vague)
❌ Long threads (use GitHub instead)
❌ Direct messages for team decisions
```

### PR Comment Tips

```
✅ GOOD:
"This approach might have O(n²) complexity.
Consider using a hash map instead.
See: [link to example]"

❌ BAD:
"wrong lol"
```

---

## Escalation Path

When issues arise:

```
Level 1: PR Comments
  ↓ (if not resolved in 48 hours)

Level 2: Slack Message
  ↓ (if still not resolved)

Level 3: 1-on-1 Meeting
  ↓ (if still not resolved)

Level 4: Team Meeting + Tech Lead
  ↓ (decision made)

Level 5: Escalate to Manager (if needed)
```

---

## Metrics & Monitoring

### PR Metrics

```
Average review time:      < 24 hours
Average merge time:       < 48 hours from creation
Approval rate:            > 90% on first submission
Rework rate:              < 30% need changes
PR size:                  < 500 lines ideally
```

### Code Quality Metrics

```
Test coverage:            >= 80%
ESLint violations:        0
Code duplication:         < 5%
Critical vulnerabilities: 0
Performance regressions:  0
```

### Team Health

```
Burndown rate:            Consistent with plan
On-time delivery:         > 80%
Production issues:        < 1 per sprint
Team satisfaction:        Survey quarterly
```

---

## GitHub PR Template

Create `.github/pull_request_template.md`:

```markdown
## Description
<!-- Brief summary of changes -->

## Type
- [ ] Feature
- [ ] Bugfix
- [ ] Hotfix
- [ ] Documentation
- [ ] Refactor
- [ ] Performance

## Related Issues
Closes #(issue number)

## Changes
-  Change 1
-  Change 2
-  Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Screenshot/video attached

## Checklist
- [ ] Code follows style guide
- [ ] No console.log statements
- [ ] Documentation updated
- [ ] Tests cover 80%+
- [ ] No breaking changes
- [ ] No security issues
- [ ] No performance regression

## Additional Notes
<!-- Any context for reviewers -->
```

---

## Resources

- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Google Code Review](https://google.github.io/eng-practices/review/)
- [Angular Contribution Guide](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)
- [Conventional Commits](https://www.conventionalcommits.org/)

