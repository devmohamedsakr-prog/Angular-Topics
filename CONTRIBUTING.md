# Contributing to Angular Topics

We appreciate your interest in contributing! This document provides guidelines for contributing to the Angular Topics repository.

## 🤝 How to Contribute

### Reporting Issues

Found a bug or have a suggestion? Please open an issue with:

- **Clear title** - Describe the issue in one line
- **Description** - Explain the problem or suggestion
- **Location** - Which topic/file is affected
- **Expected vs Actual** - What you expected vs what happened

### Submitting Changes

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/your-feature`
3. **Make your changes** - Keep commits atomic and well-described
4. **Push to your fork** - `git push origin feature/your-feature`
5. **Open a Pull Request** - Describe your changes clearly

### Pull Request Guidelines

- ✅ **Clear description** - Explain what and why
- ✅ **Quality code** - Follow existing patterns
- ✅ **Documentation** - Update relevant READMEs
- ✅ **Examples** - Include working code examples
- ✅ **No duplicates** - Check existing content first

## 📝 Content Guidelines

### Topic Documentation

Each topic should include:

```
Topic-Name/
├── README.md                 (Overview & learning outcomes)
├── explanation/              (Detailed concepts)
│   └── *.md
├── examples/                 (Working code)
│   └── *.ts
└── interview-questions/      (Practice questions)
    └── README.md
```

### Code Quality

- ✅ **TypeScript** - Strict type checking enabled
- ✅ **Modern** - Angular 18+ patterns
- ✅ **Production-ready** - Enterprise standards
- ✅ **Tested** - All examples should work
- ✅ **Documented** - Comments for complex logic

### Interview Questions

- ✅ **Clear questions** - One concept per question
- ✅ **Detailed answers** - Include code examples
- ✅ **Multiple levels** - Beginner to Expert
- ✅ **Up-to-date** - Current Angular patterns

## 🎯 Areas Looking for Contributions

- 📚 Additional examples for existing topics
- ❓ Interview questions for uncovered scenarios
- 🧪 Testing scenarios and patterns
- 🐛 Bug fixes and corrections
- 📖 Documentation improvements
- 🌍 Translations to other languages
- ✨ New advanced guide topics

## ✨ Code Style

### TypeScript

```typescript
// Clear, self-documenting code
export class UserService {
  constructor(private http: HttpClient) {}

  // Document public methods
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
}
```

### Markdown

```markdown
# Clear Headings

**Bold** for emphasis  
`code` for inline code  
Code blocks for examples

## Sections
- Use bullets for lists
- Keep it scannable
```

## 🚀 Development Setup

```bash
# Clone the repository
git clone https://github.com/devmohamedsakr-prog/Angular-Topics.git
cd Angular-Topics

# Create your feature branch
git checkout -b feature/your-feature

# Make your changes
# Test locally

# Stage and commit
git add .
git commit -m "Add: Clear description of changes"

# Push to your fork
git push origin feature/your-feature
```

## 📋 Commit Messages

Use clear, descriptive commit messages:

```
Add: New topic on Micro-frontends
Fix: Correct example in RxJS operators
Update: Improve accessibility guide
Docs: Update contributing guidelines
```

## 🔍 Review Process

1. **Automated checks** - Tests and linting pass
2. **Content review** - Quality and accuracy check
3. **Community feedback** - Get feedback from maintainers
4. **Approval** - Merge when ready

## 📞 Questions?

- 💬 Open a discussion on GitHub
- 📧 Check issue discussions
- 🔗 Reference related PRs

## 🎓 Learning Resources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub Contributing Guide](https://guides.github.com/activities/contributing-to-open-source/)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Angular Topics!** Your help makes this resource better for everyone. 🙏
