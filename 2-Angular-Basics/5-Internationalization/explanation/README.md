# Angular Internationalization (i18n)

## Overview

Internationalization (i18n) enables your Angular app to support multiple languages and locales. Angular's built-in i18n tools make it easy to translate content, manage locale-specific formatting, and deploy language-specific versions of your app.

## Key Concepts

### 1. **i18n Architecture**

```
App Source Code
    ↓
ng extract-i18n (extracts strings to XLIFF)
    ↓
Translation Files (messages.xlf, messages.de.xlf, etc.)
    ↓
Translate content
    ↓
ng build --i18n-locale=de (builds language-specific bundle)
    ↓
Language-specific apps (deployed separately)
```

### 2. **Locale vs Language**

- **Locale**: Complete regional settings (en-US, de-DE, fr-CA)
- **Language**: Language code (en, de, fr)

### 3. **Translation Methods**

- **Static**: Extract strings, translate files, rebuild
- **Dynamic**: Load translations at runtime
- **Hybrid**: Combine both approaches

## Implementation

### Setup

```bash
# Add i18n support to project
ng add @angular/localize

# Update angular.json for multiple locales
ng generate i18n-locale
```

### String Extraction

```typescript
// Mark strings for translation
<h1>{{ 'welcome' | i18n }}</h1>
<p i18n>Hello, world!</p>
<button i18n-title title="Save">Save</button>
```

### Translation Files

Angular uses XLIFF format:

```xml
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" target-language="de" datatype="plaintext">
    <body>
      <trans-unit id="greeting" datatype="html">
        <source>Hello</source>
        <target>Hallo</target>
      </trans-unit>
    </body>
  </file>
</xliff>
```

### Dynamic Locale Switching

```typescript
// Load translations at runtime
import { loadTranslations } from '@angular/localize';

loadTranslations({
  'greeting': 'Hallo',
  'farewell': 'Auf Wiedersehen'
});
```

## Best Practices

1. **Extract early and often**
2. **Use context for ambiguous terms**
3. **Consider number/date formatting**
4. **Test all locales before deployment**
5. **Use namespace prefixes** (user.profile.name)
6. **Provide translator guidance** (descriptions, regions)

## Advanced Features

- **Plural rules**: Different text for singular/plural
- **Gender rules**: Adapt text based on gender
- **Date/time formatting**: Locale-specific formats
- **Currency formatting**: Region-specific symbols

## Performance Considerations

- **Build-time translation**: Larger initial bundle, no runtime cost
- **Runtime translation**: Smaller initial bundle, runtime overhead
- **Lazy-loaded translations**: Balance between both approaches
