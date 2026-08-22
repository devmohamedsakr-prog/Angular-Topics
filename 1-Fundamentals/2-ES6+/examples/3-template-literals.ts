// ES6+ Examples: Template Literals & String Interpolation

// ====== BASIC INTERPOLATION ======

const name = "Alice";
const age = 30;
const city = "New York";

// Basic template literal
const greeting = `Hello, ${name}!`;
console.log(greeting); // Hello, Alice!

// Multiple interpolations
const introduction = `My name is ${name}, I'm ${age} years old, and I live in ${city}.`;
console.log(introduction);

// Expressions in templates
const x = 10;
const y = 20;
const math = `${x} + ${y} = ${x + y}`;
console.log(math); // 10 + 20 = 30

// Function calls
function getTime(): string {
  return new Date().toLocaleTimeString();
}

const timeMessage = `Current time: ${getTime()}`;
console.log(timeMessage);

// ====== MULTI-LINE STRINGS ======

// Old way with concatenation (avoid)
const oldHtml = "<div class=\"user-card\">\n" +
  "  <h1>User Profile</h1>\n" +
  "  <p>Name: Alice</p>\n" +
  "</div>";

// New way with template literals
const newHtml = `
  <div class="user-card">
    <h1>User Profile</h1>
    <p>Name: Alice</p>
  </div>
`;
console.log(newHtml);

// Multi-line strings preserve whitespace
const poem = `
  Roses are red,
  Violets are blue,
  Template literals,
  Make strings easy too!
`;
console.log(poem);

// ====== CONDITIONAL CONTENT ======

const user = {
  name: "John",
  premium: true,
  verificationLevel: "gold"
};

// Conditional badge
const userCard = `
  <div class="user-card">
    <h2>${user.name}</h2>
    ${user.premium ? '<span class="badge">Premium User</span>' : '<span class="badge">Free User</span>'}
    ${user.verificationLevel === "gold" ? '<span class="verified">✓ Verified</span>' : ''}
  </div>
`;
console.log(userCard);

// ====== NESTED TEMPLATES ======

const items = ["apple", "banana", "orange", "grape"];

// Creating HTML list
const listHtml = `
  <ul class="fruits">
    ${items.map(item => `<li>${item}</li>`).join('')}
  </ul>
`;
console.log(listHtml);

// Nested templates with more complex logic
const users = [
  { name: "Alice", age: 28, active: true },
  { name: "Bob", age: 35, active: false },
  { name: "Charlie", age: 32, active: true }
];

const usersTable = `
  <table>
    <thead>
      <tr><th>Name</th><th>Age</th><th>Status</th></tr>
    </thead>
    <tbody>
      ${users.map(u => `
        <tr>
          <td>${u.name}</td>
          <td>${u.age}</td>
          <td>${u.active ? 'Active' : 'Inactive'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
`;
console.log(usersTable);

// ====== TAGGED TEMPLATE LITERALS ======

// SQL query builder
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
const userEmail = "alice@example.com";
const sqlQuery = sql`SELECT * FROM users WHERE id = ${userId} AND email = ${userEmail}`;
console.log(sqlQuery); // SELECT * FROM users WHERE id = '123' AND email = 'alice@example.com'

// HTML escaping (security)
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function safe(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? escapeHtml(String(values[i])) : '';
    return result + string + value;
  }, '');
}

const userInput = "<script>alert('xss')</script>";
const safeHtml = safe`<div>${userInput}</div>`;
console.log(safeHtml); // Safely escapes malicious content

// CSS-in-JS example
function css(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');
}

const primaryColor = "#007bff";
const textColor = "#333";
const styles = css`
  .card {
    background-color: ${primaryColor};
    color: ${textColor};
    padding: 20px;
    border-radius: 8px;
  }
`;
console.log(styles);

// ====== PRACTICAL ANGULAR EXAMPLES ======

// Error message formatting
function formatError(feature: string, error: any): string {
  return `[${feature}] Error: ${error.message || error}`;
}

try {
  throw new Error("Something went wrong");
} catch (error: any) {
  const message = formatError("UserService", error);
  console.error(message); // [UserService] Error: Something went wrong
}

// Query parameter builder
function buildQuery(params: Record<string, any>): string {
  return `${Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')}`;
}

const queryParams = { search: "typescript", page: 1, limit: 10 };
const queryString = buildQuery(queryParams);
console.log(queryString); // search=typescript&page=1&limit=10

// Log formatting
class Logger {
  info(context: string, message: string): void {
    console.log(`[INFO] [${context}] ${message}`);
  }

  error(context: string, error: any): void {
    console.error(`[ERROR] [${context}] ${error.message}`);
  }

  debug(context: string, data: any): void {
    console.log(`[DEBUG] [${context}] ${JSON.stringify(data)}`);
  }
}

const logger = new Logger();
logger.info("AuthService", "User logged in successfully");
logger.debug("DataService", { userId: 123, timestamp: new Date() });

// ====== STRING FORMATTING HELPER ======

// Format price
function formatPrice(amount: number, currency: string = "USD"): string {
  return `${currency} ${amount.toFixed(2)}`;
}

console.log(formatPrice(99.5)); // USD 99.50
console.log(formatPrice(1234.567, "EUR")); // EUR 1234.57

// Format date with template literal
const now = new Date();
const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
console.log(formattedDate); // YYYY-MM-DD format
