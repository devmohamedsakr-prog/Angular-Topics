// ES6+ Examples: Classes, Modules, Promises & Arrays

// ====== CLASSES ======

// Basic class
class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }

  getInfo(): string {
    return `${this.name} is ${this.age} years old`;
  }
}

const dog = new Animal("Buddy", 5);
console.log(dog.getInfo()); // Buddy is 5 years old
dog.speak(); // Buddy makes a sound

// ====== INHERITANCE ======

class Dog extends Animal {
  breed: string;

  constructor(name: string, age: number, breed: string) {
    super(name, age); // Call parent constructor
    this.breed = breed;
  }

  speak(): void {
    console.log(`${this.name} barks`);
  }

  getBreedInfo(): string {
    return `${this.name} is a ${this.breed}`;
  }
}

const myDog = new Dog("Max", 3, "Golden Retriever");
console.log(myDog.getInfo()); // Max is 3 years old
console.log(myDog.getBreedInfo()); // Max is a Golden Retriever
myDog.speak(); // Max barks

// ====== STATIC MEMBERS ======

class MathUtils {
  static PI = 3.14159;
  static E = 2.71828;

  static getCircleArea(radius: number): number {
    return this.PI * radius * radius;
  }

  static getCircleCircumference(radius: number): number {
    return 2 * this.PI * radius;
  }

  static power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }
}

console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.getCircleArea(5)); // 78.54
console.log(MathUtils.power(2, 8)); // 256

// ====== GETTERS AND SETTERS ======

class Circle {
  private _radius: number;

  constructor(radius: number) {
    this._radius = radius;
  }

  get radius(): number {
    console.log("Getting radius");
    return this._radius;
  }

  set radius(value: number) {
    if (value < 0) {
      throw new Error("Radius cannot be negative");
    }
    console.log(`Setting radius to ${value}`);
    this._radius = value;
  }

  get area(): number {
    return Math.PI * this._radius ** 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this._radius;
  }
}

const circle = new Circle(5);
console.log(circle.radius); // 5
console.log(circle.area); // 78.54
circle.radius = 10;
console.log(circle.area); // 314.16

// ====== PRIVATE/PUBLIC MEMBERS ======

class BankAccount {
  public accountNumber: string;
  private balance: number;
  protected accountType: string;

  constructor(accountNumber: string, initialBalance: number) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.accountType = "savings";
  }

  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited: $${amount}`);
    }
  }

  getBalance(): number {
    return this.balance;
  }

  protected getAccountType(): string {
    return this.accountType;
  }
}

const account = new BankAccount("12345", 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// console.log(account.balance); // ERROR: private property

// ====== PROMISES ======

// Creating a promise
const myPromise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("Operation successful!");
    } else {
      reject("Operation failed!");
    }
  }, 1000);
});

// Consuming with then/catch
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Promise chaining
function fetchUserData(userId: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: "John Doe" });
    }, 500);
  });
}

function fetchUserPosts(userId: number): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Post 1", "Post 2", "Post 3"]);
    }, 500);
  });
}

fetchUserData(1)
  .then(user => {
    console.log("User:", user);
    return fetchUserPosts(user.id);
  })
  .then(posts => {
    console.log("Posts:", posts);
  })
  .catch(error => console.error("Error:", error));

// ====== Promise.all ======

async function loadAllData() {
  const results = await Promise.all([
    fetchUserData(1),
    fetchUserPosts(1),
    new Promise(resolve => setTimeout(() => resolve("Other data"), 300))
  ]);

  console.log("All data loaded:", results);
}

// ====== Promise.race ======

async function fetchFast() {
  const result = await Promise.race([
    new Promise(resolve => setTimeout(() => resolve("Server 1"), 1000)),
    new Promise(resolve => setTimeout(() => resolve("Server 2"), 500)),
    new Promise(resolve => setTimeout(() => resolve("Server 3"), 1500))
  ]);

  console.log("Fastest response:", result); // Server 2
}

// ====== ASYNC/AWAIT ======

async function getUserWithAsync(userId: number) {
  try {
    const user = await fetchUserData(userId);
    console.log("User:", user);

    const posts = await fetchUserPosts(userId);
    console.log("Posts:", posts);

    return { user, posts };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// ====== MODERN ARRAY METHODS ======

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map - transform each element
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter - select matching elements
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens); // [2, 4, 6, 8, 10]

// reduce - accumulate value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum); // 55

// find - get first match
const firstLarge = numbers.find(n => n > 5);
console.log("First > 5:", firstLarge); // 6

// findIndex - get index of first match
const indexLarge = numbers.findIndex(n => n > 5);
console.log("Index of first > 5:", indexLarge); // 5

// some - check if any matches
const hasNegative = numbers.some(n => n < 0);
console.log("Has negative:", hasNegative); // false

// every - check if all match
const allPositive = numbers.every(n => n > 0);
console.log("All positive:", allPositive); // true

// forEach - iterate with side effects
numbers.forEach((n, index) => {
  if (n % 3 === 0) {
    console.log(`${index}: ${n} is divisible by 3`);
  }
});

// flat - flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
const flattened = nested.flat(2);
console.log("Flattened:", flattened); // [1, 2, 3, 4, 5, 6]

// flatMap - map then flatten
const words = ["hello", "world"];
const letters = words.flatMap(word => word.split(""));
console.log("Letters:", letters);
// ['h','e','l','l','o','w','o','r','l','d']

// includes - check existence
const hasThree = numbers.includes(3);
console.log("Has 3:", hasThree); // true

// sort - sort elements (modifies original)
const unsorted = [3, 1, 4, 1, 5, 9, 2, 6];
const sorted = [...unsorted].sort((a, b) => a - b); // Using spread to avoid mutating
console.log("Sorted:", sorted); // [1, 1, 2, 3, 4, 5, 6, 9]

// ====== CHAINING ARRAY METHODS ======

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Mouse", price: 29, category: "Electronics" },
  { id: 3, name: "Desk", price: 299, category: "Furniture" },
  { id: 4, name: "Chair", price: 199, category: "Furniture" },
  { id: 5, name: "Keyboard", price: 79, category: "Electronics" }
];

// Filter expensive electronics, then map to names, then join
const expensiveElectronics = products
  .filter(p => p.category === "Electronics")
  .filter(p => p.price > 50)
  .map(p => p.name)
  .join(", ");

console.log("Expensive Electronics:", expensiveElectronics);
// Laptop, Keyboard

// Calculate total price by category
const categoryTotals = products.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + p.price;
  return acc;
}, {} as Record<string, number>);

console.log("Category Totals:", categoryTotals);
// { Electronics: 1107, Furniture: 498 }

// Group products by category
const groupedByCategory = products.reduce((acc, p) => {
  if (!acc[p.category]) {
    acc[p.category] = [];
  }
  acc[p.category].push(p);
  return acc;
}, {} as Record<string, Product[]>);

console.log("Grouped by Category:", groupedByCategory);

// ====== MODULES (Export/Import) ======

// This would be in separate files in real code:

// utils.ts
export const MAX_SIZE = 100;
export const MIN_SIZE = 10;

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\d{3}-?\d{3}-?\d{4}$/.test(phone);
}

export class UserService {
  getUser(id: number) {
    return { id, name: "John Doe" };
  }

  getUserEmail(id: number) {
    return `user${id}@example.com`;
  }
}

// logger.ts
export default class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }

  error(message: string) {
    console.error(`[ERROR] ${message}`);
  }

  warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }
}

// main.ts (importing)
// import Logger, { MAX_SIZE, validateEmail, UserService } from "./utils";
// import * as utils from "./utils";
// import { UserService as Service } from "./utils";

// ====== PRACTICAL ANGULAR EXAMPLE ======

interface DataResponse {
  items: Product[];
  total: number;
  page: number;
}

async function processProductsAsync(): Promise<void> {
  // Simulated API call
  const response: DataResponse = {
    items: products,
    total: products.length,
    page: 1
  };

  const { items, total, page } = response;

  // Process items with modern array methods
  const summary = items
    .filter(p => p.price < 500)
    .map(p => ({
      ...p,
      discounted: p.price * 0.9
    }))
    .reduce((acc, p) => acc + p.discounted, 0);

  console.log(`Page ${page}: ${items.length} items, Discount Total: $${summary.toFixed(2)}`);
}

// processProductsAsync();
