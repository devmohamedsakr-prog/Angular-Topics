# Destructuring & Rest Operator

## Overview
Destructuring allows extracting values from objects and arrays into distinct variables.

## Object Destructuring

### Basic Pattern
```typescript
const user = { name: "John", age: 30, email: "john@example.com" };
const { name, age } = user;
console.log(name, age); // John 30
```

### Renaming Variables
```typescript
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // John 30
```

### Default Values
```typescript
const { name, phone = "N/A" } = user;
console.log(phone); // "N/A" if phone not in object
```

### Nested Destructuring
```typescript
const data = {
  user: {
    id: 1,
    profile: {
      name: "John",
      email: "john@example.com"
    }
  }
};

const { user: { profile: { name } } } = data;
```

### In Function Parameters
```typescript
function printUser({ name, age }: { name: string; age: number }) {
  console.log(`${name} is ${age} years old`);
}

printUser({ name: "John", age: 30 });
```

### Rest Operator with Objects
```typescript
const { name, ...rest } = user;
// rest = { age: 30, email: "john@example.com" }
```

## Array Destructuring

### Basic Pattern
```typescript
const colors = ["red", "green", "blue"];
const [first, second] = colors;
console.log(first, second); // red green
```

### Skip Elements
```typescript
const [first, , third] = colors;
console.log(first, third); // red blue
```

### Rest Operator with Arrays
```typescript
const [head, ...tail] = colors;
console.log(head); // "red"
console.log(tail); // ["green", "blue"]
```

### Swap Variables
```typescript
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1
```

### Function Return Values
```typescript
function getUser(): [string, number] {
  return ["John", 30];
}

const [name, age] = getUser();
```

## Practical Examples

### Component Inputs Destructuring
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

export class UserComponent {
  displayUser({ id, name, email }: User) {
    console.log(`User: ${name} (${email})`);
  }
}
```

### API Response Handling
```typescript
async function loadUsers() {
  const response = await fetch("/api/users");
  const { data, total, page } = await response.json();
  
  console.log(`Page ${page}: ${data.length} of ${total} users`);
}
```

### With Default Values
```typescript
const { 
  name, 
  role = "user", 
  status = "active" 
} = userData;
```

## Benefits

✅ Cleaner, more readable code  
✅ Reduces repetitive property access  
✅ Works with defaults and optional values  
✅ Simplifies function parameters  
✅ Reduces intermediate variables

## Best Practices

✅ Use destructuring in function parameters  
✅ Provide default values for optional properties  
✅ Use rest operator to capture remaining values  
✅ Rename destructured variables for clarity  
✅ Combine with TypeScript types for safety
