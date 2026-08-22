# Classes, Modules, Promises & Arrays

## Overview
ES6 introduced class syntax, standardized modules, and modern ways to handle async operations and arrays.

## Classes

### Basic Class
```typescript
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

const dog = new Animal("Buddy");
dog.speak(); // Buddy makes a sound
```

### Inheritance
```typescript
class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks`);
  }
}
```

### Static Members
```typescript
class MathUtils {
  static PI = 3.14159;

  static getCircleArea(radius: number): number {
    return this.PI * radius * radius;
  }
}

console.log(MathUtils.PI);
console.log(MathUtils.getCircleArea(5)); // 78.54
```

### Getters and Setters
```typescript
class Circle {
  private _radius: number;

  constructor(radius: number) {
    this._radius = radius;
  }

  get radius(): number {
    return this._radius;
  }

  set radius(value: number) {
    if (value < 0) throw new Error("Radius cannot be negative");
    this._radius = value;
  }

  get area(): number {
    return Math.PI * this._radius ** 2;
  }
}
```

## Modules

### Named Exports
```typescript
// utils.ts
export const MAX_SIZE = 100;

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export class UserService {
  getUser(id: number) {
    return { id, name: "John" };
  }
}
```

### Default Export
```typescript
// logger.ts
export default class Logger {
  log(message: string) {
    console.log(message);
  }
}
```

### Importing
```typescript
// main.ts
import Logger, { MAX_SIZE, validateEmail, UserService } from "./utils";

import * as utils from "./utils"; // Import everything

import { UserService as Service } from "./utils"; // Aliasing
```

## Promises

### Creating Promises
```typescript
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});

myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Chaining Promises
```typescript
fetch("/api/users")
  .then(response => response.json())
  .then(users => console.log(users))
  .catch(error => console.error(error));
```

### Promise.all
```typescript
async function loadAllData() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
    fetch("/api/comments").then(r => r.json())
  ]);
}
```

### Promise.race
```typescript
const firstResult = await Promise.race([
  fetchFromServer1(),
  fetchFromServer2(),
  fetchFromServer3()
]);
```

## Async/Await

### Basic Usage
```typescript
async function fetchUsers() {
  try {
    const response = await fetch("/api/users");
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error(error);
  }
}
```

### Multiple Awaits
```typescript
async function processData() {
  const data1 = await fetchData1();
  const data2 = await fetchData2(data1);
  const result = await processResult(data2);
  return result;
}
```

## Modern Array Methods

### map - Transform Elements
```typescript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]
```

### filter - Select Elements
```typescript
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]
```

### reduce - Accumulate Values
```typescript
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15
```

### find - Get First Match
```typescript
const first = numbers.find(n => n > 3); // 4
```

### some - Check Any Match
```typescript
const hasNegative = numbers.some(n => n < 0); // false
```

### every - Check All Match
```typescript
const allPositive = numbers.every(n => n > 0); // true
```

### flat - Flatten Nested Arrays
```typescript
const nested = [1, [2, 3], [4, [5, 6]]];
const flattened = nested.flat(2); // [1, 2, 3, 4, 5, 6]
```

### flatMap - Map Then Flatten
```typescript
const words = ["hello", "world"];
const letters = words.flatMap(word => word.split("")); 
// ['h','e','l','l','o','w','o','r','l','d']
```

### includes - Check Existence
```typescript
const hasThree = numbers.includes(3); // true
```

## Use Cases in Angular

### Services with Async Operations
```typescript
@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  async loadData(): Promise<any> {
    try {
      return await this.http.get("/api/data").toPromise();
    } catch (error) {
      console.error("Failed to load data", error);
    }
  }
}
```

### RxJS Pipe with Modern Array Methods
```typescript
export class UserComponent {
  users$ = this.http.get<User[]>("/api/users").pipe(
    map(users => users.filter(u => u.active)),
    map(users => users.map(u => ({ ...u, fullName: `${u.firstName} ${u.lastName}` })))
  );
}
```

## Best Practices

✅ Use async/await over promises for readability  
✅ Use classes for object-oriented code  
✅ Use named exports for better tree-shaking  
✅ Use modern array methods instead of for loops  
✅ Handle errors with try/catch in async functions
