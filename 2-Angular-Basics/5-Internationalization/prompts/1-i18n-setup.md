# i18n Setup & Configuration

**IDE Prompt:** Use this to set up internationalization in Angular.

---

## 🎯 Task: Configure i18n for Multiple Languages

**When to use:** Supporting multiple languages in your app.

---

## 📋 Checklist

- [ ] Install i18n dependencies
- [ ] Configure angular.json
- [ ] Mark strings for translation
- [ ] Generate translation files
- [ ] Test translations

---

## 🚀 Step-by-Step

### Step 1: Install i18n

```bash
ng extract-i18n --output-path locale
```

Creates `messages.xlf` file with strings to translate.

### Step 2: Mark Strings for Translation

```html
<!-- In template -->
<h1 i18n>Hello World</h1>
<p i18n="@@greeting">Welcome!</p>
```

```typescript
// In component
import { marker } from '@angular/localize/init';
const messages = marker('Hello');
```

### Step 3: Create Translation Files

Create `messages.es.xlf` for Spanish, `messages.fr.xlf` for French.

### Step 4: Configure angular.json

```json
{
  "projects": {
    "app": {
      "i18n": {
        "sourceLocale": "en",
        "locales": {
          "es": { "translation": "locale/messages.es.xlf" },
          "fr": { "translation": "locale/messages.fr.xlf" }
        }
      }
    }
  }
}
```

### Step 5: Build for Each Language

```bash
ng build --localize
```

Builds apps for all configured languages.

---

## ✅ Verification

- [ ] Extract-i18n creates files
- [ ] Translation files exist
- [ ] Build succeeds for all languages
- [ ] App loads in different languages

---

**Estimated Time:** 20-25 minutes | **Difficulty:** Intermediate

---

## 📚 Reference Files

- `../explanation/` - Full i18n theory
- `../examples/` - Working i18n examples
- `../interview-questions/` - i18n Q&A
