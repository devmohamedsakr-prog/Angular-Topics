// ES6+ Features Examples for Angular

// ====== LET AND CONST ======

// Block scoping
{
  const x = 1;
  let y = 2;
  var z = 3;
}
// console.log(x, y); // ERROR: not in scope
// console.log(z); // 3 - var is function-scoped

// Temporal Dead Zone
// console.log(name); // ERROR: Cannot access 'name' before initialization
const name = "John";

// ====== ARROW FUNCTIONS ======

// Concise syntax
const add = (a: number, b: number) => a + b;

// Multiple statements
const multiply = (a: number, b: number) => {
  console.log(`Multiplying ${a} and ${b}`);
  return a * b;
};

// Single parameter - parens optional
const square = (x: number) => x * x;

// No parameters
const getRandom = () => Math.random();

// Lexical this binding
class Counter {
  count = 0;

  // This correctly refers to the class instance
  increment = () => {
    this.count++;
  };

  // Using traditional function loses 'this'
  incrementTraditional() {
    this.count++;
  }

  getCount() {
    return this.count;
  }
}

// ====== TEMPLATE LITERALS ======

// String interpolation
const user = { name: "Alice", age: 30 };
const message = `Hello, ${user.name}! You are ${user.age} years old.`;

// Multi-line strings
const html = `
  <div class="user-card">
    <h1>${user.name}</h1>
    <p>Age: ${user.age}</p>
  </div>
`;

// Expressions
const x = 10;
const y = 20;
const expression = `${x} + ${y} = ${x + y}`;

// Tagged templates
function sqlTemplate(strings: TemplateStringsArray, ...values: any[]) {
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
const sql = sqlTemplate`SELECT * FROM users WHERE id = ${userId} AND email = ${email}`;

// ====== DESTRUCTURING ======

// Object destructuring
const person = { name: "Bob", age: 25, city: "NYC", email: "bob@example.com" };
const { name: personName, age: personAge } = person;

// Renaming
const { name: pName, age: pAge } = person;

// Default values
const { phone = "N/A", address = "Unknown" } = person;

// Nested destructuring
const company = {
  name: "TechCorp",
  location: {
    city: "San Francisco",
    country: "USA"
  },
  employees: [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
  ]
};

const { location: { city }, employees: [{ name: emp1Name }] } = company;

// Rest operator in objects
const { name: n, ...rest } = person;
// rest = { age: 25, city: "NYC", email: "bob@example.com" }

// Array destructuring
const colors = ["red", "green", "blue", "yellow"];

const [first, second] = colors;
const [head, , third] = colors; // Skip second element
const [primaryColor, ...otherColors] = colors;

// Swapping with destructuring
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1

// Destructuring in function parameters
function displayUser({ name, age = 18 }: { name: string; age?: number }) {
  console.log(`${name} is ${age} years old`);
}

displayUser({ name: "Charlie" }); // age defaults to 18

// ====== CLASSES ======

class Animal {
  protected name: string;
  private _age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this._age = age;
  }

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value > 0) {
      this._age = value;
    }
  }

  static compareAge(animal1: Animal, animal2: Animal): Animal {
    return animal1.age > animal2.age ? animal1 : animal2;
  }
}

class Dog extends Animal {
  private breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age);
    this.breed = breed;
  }

  speak(): void {
    console.log(`${this.name} barks`);
  }

  getInfo(): string {
    return `${this.name} is a ${this.breed}`;
  }
}

// ====== MODULES ======

// In Angular, imports are typically:
// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// Example module structure
export const API_URL = "https://api.example.com";

export interface UserData {
  id: number;
  name: string;
  email: string;
}

export class UserRepository {
  getUsers(): Promise<UserData[]> {
    return fetch(`${API_URL}/users`).then(r => r.json());
  }
}

export default class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

// ====== PROMISES ======

// Creating a promise
function fetchUserData(userId: number): Promise<UserData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: "John", email: "john@example.com" });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 1000);
  });
}

// Consuming with then/catch
fetchUserData(1)
  .then(user => console.log("User:", user))
  .catch(error => console.error("Error:", error));

// Chaining promises
function processUserData(userId: number): Promise<void> {
  return fetchUserData(userId)
    .then(user => {
      console.log("Processing:", user.name);
      return user;
    })
    .then(user => {
      console.log("Email:", user.email);
    })
    .catch(error => console.error("Failed:", error));
}

// Promise.all - wait for all promises
function loadAllData(): Promise<[UserData[], string[], number]> {
  return Promise.all([
    fetchUserData(1),
    Promise.resolve(["data1", "data2"]),
    Promise.resolve(42)
  ]);
}

// Promise.race - first to complete
function fetchWithTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    )
  ]);
}

// ====== ASYNC/AWAIT ======

// Converting callback-based code to async/await
async function getUserAndPosts(userId: number) {
  try {
    // Simulate fetching user
    const user = await fetchUserData(userId);
    console.log("Fetched user:", user);

    // Simulate fetching posts
    const posts = await fetch(`${API_URL}/posts?userId=${userId}`)
      .then(r => r.json());
    console.log("Fetched posts:", posts);

    return { user, posts };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}

// Async IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    const data = await getUserAndPosts(1);
    console.log("All data:", data);
  } catch (error) {
    console.error(error);
  }
})();

// ====== MODERN ARRAY METHODS ======

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map - transform each element
const doubled = numbers.map(n => n * 2);

// filter - select matching elements
const evens = numbers.filter(n => n % 2 === 0);

// reduce - accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0);
const product = numbers.reduce((acc, n) => acc * n, 1);

// find - get first match
const firstEven = numbers.find(n => n % 2 === 0);

// findIndex - get index of first match
const firstEvenIndex = numbers.findIndex(n => n % 2 === 0);

// some - check if any match
const hasNegative = numbers.some(n => n < 0);

// every - check if all match
const allPositive = numbers.every(n => n > 0);

// forEach - iterate (avoid return)
numbers.forEach(n => console.log(n));

// Chaining array methods
const result = numbers
  .filter(n => n > 3)
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0);

// flat - flatten nested arrays
const nested: number[][] = [[1, 2], [3, 4], [5, 6]];
const flattened = nested.flat();

// flatMap - map then flatten
const words = ["hello", "world"];
const letters = words.flatMap(word => word.split(""));

// Array.from - convert iterable to array
const stringArray = Array.from("hello"); // ['h','e','l','l','o']

// Array.isArray - check if value is array
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray("123")); // false

// ====== SPREAD OPERATOR ======

// Spreading arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Spreading objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Spread in function calls
function sum3(a: number, b: number, c: number): number {
  return a + b + c;
}

const args = [1, 2, 3];
const result2 = sum3(...args);

export {
  Counter,
  Animal,
  Dog,
  UserRepository,
  fetchUserData,
  getUserAndPosts
};
