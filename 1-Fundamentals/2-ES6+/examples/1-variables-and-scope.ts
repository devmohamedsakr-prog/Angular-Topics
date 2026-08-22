// ES6+ Examples: Variables & Scope

// ====== LET AND CONST ======

// Block scoping example
{
  const x = 1;
  let y = 2;
  var z = 3;
}
// console.log(x, y); // ERROR: not in scope
// console.log(z); // 3 - var is function-scoped

// Temporal Dead Zone - accessing before declaration
// console.log(name); // ERROR: Cannot access 'name' before initialization
const name = "John";

// Using const by default
const age = 30;
const email = "john@example.com";

// Using let when reassignment needed
let counter = 0;
counter++; // OK - let allows reassignment

// Object immutability with const
const user = { name: "Alice", age: 25 };
user.name = "Bob"; // OK - modifying property
user.age = 26;
// user = {}; // ERROR - cannot reassign const variable

// Array immutability with const
const colors = ["red", "green", "blue"];
colors.push("yellow"); // OK - modifying array contents
colors[0] = "orange"; // OK - changing element
// colors = []; // ERROR - cannot reassign const variable

// Best practice: prefer const
const productName = "Laptop";
const productPrice = 999;
const isAvailable = true;

// Function scope with var (old way - avoid)
function oldWayExample() {
  if (true) {
    var oldVar = "I'm function-scoped";
  }
  console.log(oldVar); // Accessible outside if block
}

// Block scope with let (modern way)
function newWayExample() {
  if (true) {
    let newVar = "I'm block-scoped";
  }
  // console.log(newVar); // ERROR - not accessible
}

// Hoisting behavior
console.log(typeof hoistedVar); // "undefined" (hoisted but not initialized)
var hoistedVar = "I'm hoisted";

// let and const are hoisted but not initialized (temporal dead zone)
// console.log(typeof hoistedLet); // ERROR - temporal dead zone
let hoistedLet = "I'm in temporal dead zone";

// Loop scope with var vs let
function loopWithVar() {
  for (var i = 0; i < 3; i++) {
    // i is function-scoped
  }
  console.log(i); // 3 - accessible outside loop
}

function loopWithLet() {
  for (let i = 0; i < 3; i++) {
    // i is block-scoped
  }
  // console.log(i); // ERROR - not accessible
}

// Common pitfall: closures with var
const functionsVar = [];
for (var i = 0; i < 3; i++) {
  functionsVar.push(() => console.log(i)); // All reference same i
}
functionsVar[0](); // Logs 3, not 0 (all functions share same i)

// Solution with let
const functionsLet = [];
for (let i = 0; i < 3; i++) {
  functionsLet.push(() => console.log(i)); // Each gets own i
}
functionsLet[0](); // Logs 0 correctly
functionsLet[1](); // Logs 1
functionsLet[2](); // Logs 2

// Shadowing with let
const globalVar = "global";
{
  const globalVar = "block-scoped"; // Different variable, shadows outer
  console.log(globalVar); // "block-scoped"
}
console.log(globalVar); // "global"

// TypeScript: const assertion for literal types
const config = {
  mode: "production" as const,
  port: 3000 as const
} // Types are 'production' and 3000, not string and number
