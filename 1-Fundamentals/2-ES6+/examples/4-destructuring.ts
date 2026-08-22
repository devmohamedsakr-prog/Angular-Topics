// ES6+ Examples: Destructuring & Rest Operator

// ====== OBJECT DESTRUCTURING ======

// Basic destructuring
const person = {
  name: "John",
  age: 30,
  email: "john@example.com",
  city: "New York",
  phone: "555-1234"
};

const { name, age } = person;
console.log(name, age); // John 30

// Destructuring only what you need
const { email, city } = person;
console.log(email, city); // john@example.com New York

// ====== RENAMING DESTRUCTURED VARIABLES ======

const { name: personName, age: personAge } = person;
console.log(personName, personAge); // John 30

// Useful for avoiding name conflicts
const { name: employeeName, age: employeeAge } = person;

// ====== DEFAULT VALUES ======

interface User {
  id: number;
  name: string;
  role?: string;
  status?: string;
}

const user: User = { id: 1, name: "Alice" };

const { name: userName, role = "user", status = "active" } = user;
console.log(role, status); // user active

// Nested objects with defaults
const config = {
  app: {
    name: "MyApp",
    version: "1.0"
    // port is missing
  }
};

const { app: { port = 3000 } } = config;
console.log(port); // 3000

// ====== NESTED DESTRUCTURING ======

const data = {
  user: {
    id: 1,
    profile: {
      name: "John",
      email: "john@example.com",
      settings: {
        notifications: true,
        theme: "dark"
      }
    }
  }
};

// Extract nested values
const { user: { profile: { name: profileName, email } } } = data;
console.log(profileName, email); // John john@example.com

// Extract deeply nested value
const { user: { profile: { settings: { theme } } } } = data;
console.log(theme); // dark

// ====== REST OPERATOR WITH OBJECTS ======

const fullUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  phone: "555-5678",
  address: "123 Main St"
};

// Extract specific properties, capture rest
const { id, name, ...userRest } = fullUser;
console.log(id, name);
console.log(userRest); // { email, phone, address }

// Function parameters with rest
function updateUser(user: User, ...updates: Partial<User>[]) {
  console.log("Updating user:", user);
  console.log("Updates:", updates);
}

// ====== FUNCTION PARAMETERS DESTRUCTURING ======

// Object parameter destructuring
interface Product {
  id: number;
  name: string;
  price: number;
}

function printProduct({ id, name, price }: Product) {
  console.log(`Product: ${name} - $${price}`);
}

printProduct({ id: 1, name: "Laptop", price: 999 });

// With default values in parameters
function createUser({ name, role = "user", status = "active" }: Partial<User>) {
  console.log(`Creating user: ${name} (${role}) - ${status}`);
}

createUser({ name: "Bob" }); // Uses default role and status

// Destructuring in arrow functions
const processData = ({ id, name }: Pick<User, 'id' | 'name'>) => {
  return `${id}: ${name}`;
};

console.log(processData({ id: 1, name: "Test" })); // 1: Test

// ====== ARRAY DESTRUCTURING ======

const colors = ["red", "green", "blue", "yellow"];

// Basic array destructuring
const [first, second] = colors;
console.log(first, second); // red green

// Skip elements
const [, , third] = colors;
console.log(third); // blue

// Skip multiple elements
const [head, , , tail] = colors;
console.log(head, tail); // red yellow

// ====== REST OPERATOR WITH ARRAYS ======

const [primary, ...rest] = colors;
console.log(primary); // red
console.log(rest); // [ 'green', 'blue', 'yellow' ]

// Useful for splitting first element from rest
const [first_item, ...otherItems] = [1, 2, 3, 4, 5];
console.log(first_item); // 1
console.log(otherItems); // [ 2, 3, 4, 5 ]

// ====== SWAPPING VARIABLES ======

let a = 1;
let b = 2;

console.log(`Before: a=${a}, b=${b}`);

// Swap using destructuring
[a, b] = [b, a];

console.log(`After: a=${a}, b=${b}`); // a=2, b=1

// ====== FUNCTION RETURN VALUES ======

interface UserResponse {
  success: boolean;
  data?: User;
  error?: string;
}

function getUserData(id: number): [boolean, User | null, string | null] {
  // Simulated API call
  if (id > 0) {
    return [true, { id, name: "John", role: "admin" }, null];
  }
  return [false, null, "User not found"];
}

// Destructure return value
const [success, userData, errorMsg] = getUserData(1);
console.log(success, userData, errorMsg); // true { id, name, role } null

// Named returns (using object)
interface ApiResponse {
  success: boolean;
  data: any;
  error: string | null;
}

function fetchUserById(id: number): ApiResponse {
  return {
    success: true,
    data: { id, name: "Alice" },
    error: null
  };
}

const { success: isSuccess, data, error } = fetchUserById(1);
console.log(isSuccess, data, error);

// ====== PRACTICAL EXAMPLES ======

// React component props destructuring (similar to Angular inputs)
interface ComponentProps {
  title: string;
  count?: number;
  onClose?: () => void;
}

function MyComponent({ title, count = 0, onClose }: ComponentProps) {
  console.log(`Title: ${title}, Count: ${count}`);
}

MyComponent({ title: "Hello" });

// API response handling
interface ApiData {
  users: User[];
  total: number;
  page: number;
}

async function processApiResponse() {
  const response = {
    users: [{ id: 1, name: "Alice" }],
    total: 100,
    page: 1
  };

  const { users, total, page } = response;
  console.log(`Page ${page}: Showing ${users.length} of ${total} users`);
}

// Configuration destructuring
interface Config {
  debug?: boolean;
  port?: number;
  host?: string;
}

function startServer(config: Config) {
  const { debug = false, port = 3000, host = "localhost" } = config;
  console.log(`Starting server at ${host}:${port} (debug: ${debug})`);
}

startServer({ port: 8080, debug: true });

// Array of objects destructuring
const products: Product[] = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 29 },
  { id: 3, name: "Keyboard", price: 79 }
];

// Destructure in loop
for (const { id, name, price } of products) {
  console.log(`${id}: ${name} - $${price}`);
}

// Map destructuring
const productNames = products.map(({ name, price }) => `${name} ($${price})`);
console.log(productNames);

// Filter with destructuring
const cheapProducts = products.filter(({ price }) => price < 100);
console.log(cheapProducts);

// ====== COMPLEX DESTRUCTURING PATTERNS ======

// Mix object and array destructuring
const complexData = {
  name: "Project",
  versions: ["1.0", "1.1", "2.0"],
  metadata: {
    created: "2024-01-01",
    updated: "2024-08-01"
  }
};

const {
  name: projectName,
  versions: [major, minor, ...patches],
  metadata: { created }
} = complexData;

console.log(projectName, major, minor, patches, created);

// Destructuring with validation
function processUser(input: any) {
  const { id = -1, name = "Unknown", ...extra } = input;
  
  if (id < 0) {
    throw new Error("Invalid user ID");
  }
  
  console.log(`User: ${name}`, { extra });
}

processUser({ id: 1, name: "John", email: "john@example.com" });
