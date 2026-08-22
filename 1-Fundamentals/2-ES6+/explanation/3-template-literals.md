# Template Literals & String Interpolation

## Overview
Template literals use backticks and allow string interpolation and multi-line strings.

## String Interpolation

### Basic Interpolation
```typescript
const name = "Alice";
const greeting = `Hello, ${name}!`;
```

### Expressions
```typescript
const x = 10;
const y = 20;
const result = `${x} + ${y} = ${x + y}`;
```

### Function Calls
```typescript
function getAge() {
  return 30;
}

const message = `I am ${getAge()} years old`;
```

## Multi-line Strings

### Before (with Escape Sequences)
```typescript
const html = "<div>\n" +
  "  <h1>Hello World</h1>\n" +
  "</div>";
```

### After (Template Literals)
```typescript
const html = `
  <div>
    <h1>Hello World</h1>
    <p>This is a paragraph</p>
  </div>
`;
```

## Conditional Content

```typescript
const user = { premium: true };
const badge = `
  <div>
    <h1>User Profile</h1>
    ${user.premium ? '<span class="badge">Premium</span>' : ''}
  </div>
`;
```

## Nested Templates

```typescript
const items = ["apple", "banana", "orange"];
const listHTML = `
  <ul>
    ${items.map(item => `<li>${item}</li>`).join('')}
  </ul>
`;
```

## Tagged Template Literals (Advanced)

Tagged templates allow custom processing of template strings.

### SQL Query Builder
```typescript
function sql(strings: TemplateStringsArray, ...values: any[]) {
  let query = "";
  for (let i = 0; i < strings.length; i++) {
    query += strings[i];
    if (i < values.length) {
      query += `'${values[i]}'`;
    }
  }
  return query;
}

const userId = 123;
const email = "john@example.com";
const query = sql`SELECT * FROM users WHERE id = ${userId} AND email = ${email}`;
// "SELECT * FROM users WHERE id = '123' AND email = 'john@example.com'"
```

### HTML Escaping
```typescript
function safe(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? escapeHtml(values[i]) : '';
    return result + string + value;
  }, '');
}

const userInput = "<script>alert('xss')</script>";
const html = safe`<div>${userInput}</div>`;
// Safely escapes malicious content
```

## Use Cases in Angular

Template literals are commonly used for:
- Dynamic HTML strings
- Complex string formatting
- Error messages
- Query building
- Log messages

```typescript
export class LogService {
  error(context: string, error: any) {
    console.error(`[${context}] Error: ${error.message}`);
  }
}
```

## Best Practices

✅ Use template literals for string interpolation  
✅ Use template literals for multi-line strings  
✅ Use tagged templates for special processing  
✅ Prefer template literals over string concatenation
