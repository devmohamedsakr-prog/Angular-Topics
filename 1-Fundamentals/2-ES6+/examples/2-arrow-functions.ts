// ES6+ Examples: Arrow Functions & Lexical This

// ====== ARROW FUNCTIONS ======

// Concise syntax
const add = (a: number, b: number) => a + b;
console.log(add(5, 3)); // 8

// Multiple statements - needs braces and return
const multiply = (a: number, b: number) => {
  console.log(`Multiplying ${a} and ${b}`);
  return a * b;
};
console.log(multiply(5, 3)); // 15

// Single parameter - parentheses optional
const square = (x: number) => x * x;
const squareNoParens = x => x * x;
console.log(square(5)); // 25

// No parameters - need parentheses
const getRandom = () => Math.random();
console.log(getRandom()); // Random number

// Arrow function with objects - need extra parentheses
const createUser = (name: string, age: number) => ({ name, age });
const user = createUser("John", 30);
console.log(user); // { name: 'John', age: 30 }

// ====== LEXICAL THIS BINDING ======

// Arrow functions capture 'this' from enclosing scope
class Counter {
  count = 0;

  // Arrow function - 'this' refers to Counter instance
  increment = () => {
    this.count++;
  };

  // Regular method
  getCount() {
    return this.count;
  }

  // Demonstrate the problem with traditional function
  incrementTraditional() {
    this.count++;
  }
}

const counter = new Counter();
counter.increment();
console.log(counter.getCount()); // 1

// Arrow function works correctly as callback
setTimeout(counter.increment, 100); // 'this' is preserved
// But traditional method would fail:
// setTimeout(counter.incrementTraditional, 100); // ERROR: 'this' is undefined

// ====== PRACTICAL EXAMPLES ======

// Array methods with arrow functions
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

const first = numbers.find(n => n > 3);
console.log(first); // 4

// Object methods with arrow functions
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 29 },
  { id: 3, name: "Keyboard", price: 79 }
];

// Map products to formatted strings
const productNames = products.map(p => `${p.name} ($${p.price})`);
console.log(productNames); // ['Laptop ($999)', 'Mouse ($29)', 'Keyboard ($79)']

// Filter expensive items
const expensive = products.filter(p => p.price > 100);
console.log(expensive); // [{ id: 1, name: 'Laptop', price: 999 }]

// Calculate total price
const totalPrice = products.reduce((total, p) => total + p.price, 0);
console.log(totalPrice); // 1107

// ====== EVENT HANDLERS IN ANGULAR ======

// Angular component example (pseudo-code)
export class ButtonComponent {
  clickCount = 0;

  // Arrow function - 'this' refers to component
  handleClick = () => {
    this.clickCount++;
    console.log(`Clicked ${this.clickCount} times`);
  };

  // Method that can use arrow function as handler
  setupHandlers() {
    // This works because arrow function preserves 'this'
    document.addEventListener('click', this.handleClick);
  }

  cleanup() {
    document.removeEventListener('click', this.handleClick);
  }
}

// ====== COMPARISONS ======

// Traditional function vs arrow function
const traditional = function(x: number) {
  return x * 2;
};

const arrow = (x: number) => x * 2;

// Traditional function as method loses 'this'
const obj = {
  value: 42,
  getValue: function() {
    return this.value;
  },
  getValueArrow: () => {
    // Arrow function looks for 'this' in enclosing scope
    return (this as any).value; // Different 'this'
  }
};

// ====== HIGHER-ORDER FUNCTIONS ======

// Function returning arrow function
const multiplier = (factor: number) => (n: number) => n * factor;
const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Function decorator with arrow function
const logExecution = (fn: (x: number) => number) => {
  return (x: number) => {
    console.log(`Executing with argument: ${x}`);
    const result = fn(x);
    console.log(`Result: ${result}`);
    return result;
  };
};

const loggedSquare = logExecution(n => n * n);
loggedSquare(5);
// Logs: Executing with argument: 5
// Logs: Result: 25

// ====== ASYNC ARROW FUNCTIONS ======

// Promise handling
const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
  }
};

// Array of async operations
const urls = [
  "https://api.example.com/user/1",
  "https://api.example.com/user/2",
  "https://api.example.com/user/3"
];

const fetchAllUsers = async () => {
  return Promise.all(urls.map(url => fetchData(url)));
};
