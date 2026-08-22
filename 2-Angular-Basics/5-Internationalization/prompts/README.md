# Internationalization (i18n) - IDE Prompts

**Quick guides for adding multi-language support to Angular apps.**

---

## 📋 Overview

Internationalization (i18n) enables supporting multiple languages.

### Key Steps:
1. **Setup:** Configure Angular i18n
2. **Mark Strings:** Add i18n to templates
3. **Extract:** Generate translation files
4. **Translate:** Fill in translations
5. **Build:** Build for each language

---

## 🚀 Quick Path (1 hour)

1. i18n Setup (20-25 min)
2. Translation Management (20-25 min)
3. Language Switching (15-20 min)

---

## 🛠️ Commands

```bash
# Extract strings for translation
ng extract-i18n --output-path locale

# Build for all locales
ng build --localize

# Build for specific locale
ng build --i18n-locale es
```

---

## 📝 Key Files

- `messages.xlf` - Source language strings
- `messages.es.xlf` - Spanish translations
- `messages.fr.xlf` - French translations
- `angular.json` - i18n configuration

---

## ✅ Best Practices

✅ Mark all user-facing strings  
✅ Provide context for translators  
✅ Use ICU messages for plural/gender  
✅ Test all languages  
✅ Keep translations updated  

---

## 🔗 Related

- `../explanation/` - Full i18n guide
- `../examples/` - Working examples
- `../interview-questions/` - Q&A

---

**Version:** 1.0 | **Status:** ✅ Complete

Ready for multi-language apps! 🚀
