# ES6+ Features for Angular Development

## Overview
ES6 (ECMAScript 2015) introduced major improvements to JavaScript. Understanding these features is crucial for Angular development.

## Table of Contents
1. [Let and Const](#let-and-const)
2. [Arrow Functions](#arrow-functions)
3. [Template Literals](#template-literals)
4. [Destructuring](#destructuring)
5. [Classes](#classes)
6. [Modules](#modules)
7. [Promises and Async/Await](#promises-and-asyncawait)
8. [Modern Array Methods](#modern-array-methods)

---

## Let and Const

### var vs let vs const

```typescript
// var - function-scoped (avoid in modern code)
function example1() {
  var x = 1;
  if (true) {
    var x = 2;
  }
  console.log(x); // 2 (var is function-scoped)
}

// let - block-scoped
function example2() {
  let x = 1;
  if (true) {
    let x = 2;
  }
  console.log(x); // 1 (let is block-scoped)
}

// const - block-scoped, cannot be reassigned (prefer by default)
const name = "John";
name = "Jane"; // ERROR

// But can modify object properties
const user = { name: "John" };
user.name = "Jane"; // OK (modifying property, not reassigning)
user = {}; // ERROR (cannot reassign)
```

### Best Practices
- Use `const` by default
- Use `let` when variable will be reassigned
- Never use `var` in modern code

---

## Arrow Functions

Arrow functions provide a shorter syntax and lexical `this` binding:

```typescript
// Traditional function
function add(a: number, b: number) {
  return a + b;
}

// Arrow function
const add = (a: number, b: number) => {
  return a + b;
};

// Arrow function - concise
const add = (a: number, b: number) => a + b;

// Single parameter - parentheses optional
const square = x => x * x;
const square = (x: number) => x * x; // with type

// No parameters - need parentheses
const getRandom = () => Math.random();

// Lexical this binding (important in classes and callbacks)
class Counter {
  count = 0;

  // This works because arrow function captures 'this' from class scope
  increment = () => {
    this.count++;
  };

  // This doesn't work - 'this' is undefined when called as callback
  incrementTraditional() {
    this.count++;
  }
}

const counter = new Counter();
counter.increment(); // OK
setTimeout(counter.increment, 100); // OK

// With traditional function
const incrementCopy = counter.incrementTraditional;
incrementCopy(); // ERROR: 'this' is undefined
```

### Use in Angular
Arrow functions are extensively used in Angular for:
- Event handlers
- Callbacks
- Method bindings

```typescript
// Component
export class ButtonComponent {
  handleClick = () => {
    console.log('Clicked'); // 'this' refers to component
  };
}
```

---

## Template Literals

Template literals allow string interpolation and multi-line strings:

```typescript
// Basic interpolation
const name = "Alice";
const greeting = `Hello, ${name}!`;

// Expressions
const x = 10;
const y = 20;
const result = `${x} + ${y} = ${x + y}`;

// Multi-line strings
const html = `
  <div>
    <h1>Hello World</h1>
    <p>This is a paragraph</p>
  </div>
`;

// Tagged template literals (advanced)
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

const username = "John";
const message = highlight`Welcome, ${username}!`;
// Output: Welcome, <mark>John</mark>!
```

---

## Destructuring

Destructuring allows extracting values from objects and arrays:

### Object Destructuring

```typescript
// Basic
const user = { name: "John", age: 30, email: "john@example.com" };
const { name, age } = user;
console.log(name, age); // John 30

// Renaming
const { name: userName, age: userAge } = user;

// Default values
const { name, phone = "N/A" } = user;

// Nested destructuring
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

// In function parameters
function printUser({ name, age }: { name: string; age: number }) {
  console.log(`${name} is ${age} years old`);
}

printUser({ name: "John", age: 30 });

// With rest operator
const { name, ...rest } = user;
// rest = { age: 30, email: "john@example.com" }
```

### Array Destructuring

```typescript
const colors = ["red", "green", "blue"];

// Basic
const [first, second] = colors;
console.log(first, second); // red green

// Skip elements
const [first, , third] = colors;
console.log(first, third); // red blue

// Rest operator
const [head, ...tail] = colors;
console.log(head); // "red"
console.log(tail); // ["green", "blue"]

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// Function return
function getUser(): [string, number] {
  return ["John", 30];
}

const [name, age] = getUser();
```

---

## Classes

ES6 introduced class syntax (though JavaScript classes are syntactic sugar over prototypes):

```typescript
// Basic class
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

// Inheritance
class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks`);
  }

  override speak() { // TypeScript 4.3+
    super.speak();
    console.log("Woof!");
  }
}

// Static members
class MathUtils {
  static PI = 3.14159;

  static getCircleArea(radius: number): number {
    return this.PI * radius * radius;
  }
}

console.log(MathUtils.PI);
console.log(MathUtils.getCircleArea(5));

// Getters and Setters
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

const circle = new Circle(5);
console.log(circle.radius); // 5
circle.radius = 10;
console.log(circle.area); // Uses updated radius
```

---

## Modules

Modules organize code into reusable units:

```typescript
// Export named exports
export const MAX_SIZE = 100;

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export class UserService {
  getUser(id: number) {
    return { id, name: "John" };
  }
}

// Export default
export default class Logger {
  log(message: string) {
    console.log(message);
  }
}

// Import in another file
import Logger, { MAX_SIZE, validateEmail, UserService } from "./exports";

// Import everything
import * as utils from "./exports";
console.log(utils.MAX_SIZE);

// Aliasing
import { UserService as Service } from "./exports";
```

---

## Promises and Async/Await

Promises handle asynchronous operations:

```typescript
// Creating a promise
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});

// Consuming with then/catch
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Chaining promises
fetch("/api/users")
  .then(response => response.json())
  .then(users => console.log(users))
  .catch(error => console.error(error));

// Async/Await (cleaner syntax)
async function fetchUsers() {
  try {
    const response = await fetch("/api/users");
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error(error);
  }
}

// Promise.all - wait for multiple promises
async function loadData() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
    fetch("/api/comments").then(r => r.json())
  ]);
}

// Promise.race - first to settle wins
const firstResult = await Promise.race([
  fetchFromServer1(),
  fetchFromServer2(),
  fetchFromServer3()
]);
```

---

## Modern Array Methods

```typescript
// map - transform each element
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

// filter - select elements matching condition
const evens = numbers.filter(n => n % 2 === 0); // [2, 4]

// reduce - accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0); // 15

// find - get first matching element
const first = numbers.find(n => n > 3); // 4

// some - check if any element matches
const hasNegative = numbers.some(n => n < 0); // false

// every - check if all elements match
const allPositive = numbers.every(n => n > 0); // true

// forEach - iterate with side effects
numbers.forEach(n => console.log(n));

// flat - flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
const flattened = nested.flat(2); // [1, 2, 3, 4, 5, 6]

// flatMap - map then flatten
const words = ["hello", "world"];
const letters = words.flatMap(word => word.split("")); // ['h','e','l','l','o','w','o','r','l','d']

// includes - check if array contains element
const hasThree = numbers.includes(3); // true
```

---

## Best Practices

1. **Use const by default** for immutability
2. **Prefer arrow functions** for callbacks and shorter syntax
3. **Use destructuring** to extract specific values
4. **Use async/await** over promises for readability
5. **Use modern array methods** instead of for loops
6. **Use template literals** for string interpolation
7. **Leverage class syntax** for object-oriented code
8. **Use named exports** for better tree-shaking

---

## Key Takeaways

- ES6+ provides syntactic improvements that make JavaScript more expressive
- Arrow functions and destructuring reduce boilerplate
- Template literals improve readability of dynamic strings
- Modern array methods enable functional programming patterns
- Promises and async/await handle asynchronous code elegantly
- Classes provide familiar OOP syntax
- Modules enable code organization and reusability
