# Variables & Scope - Let and Const

## Overview
ES6 introduced `let` and `const` for block-scoped variables, replacing `var`.

## var vs let vs const

### var - Function Scoped (Avoid)
```typescript
function example() {
  var x = 1;
  if (true) {
    var x = 2;
  }
  console.log(x); // 2 - var is function-scoped
}
```

### let - Block Scoped
```typescript
function example() {
  let x = 1;
  if (true) {
    let x = 2;
  }
  console.log(x); // 1 - let is block-scoped
}
```

### const - Block Scoped, Immutable
```typescript
const name = "John";
name = "Jane"; // ERROR - cannot reassign

// Can modify object properties
const user = { name: "John" };
user.name = "Jane"; // OK - modifying property
user = {}; // ERROR - cannot reassign
```

## Scope Rules

- **var**: Function-scoped, hoisted to top
- **let**: Block-scoped, temporal dead zone
- **const**: Block-scoped, temporal dead zone, cannot reassign

## Temporal Dead Zone

```typescript
console.log(name); // ERROR: Cannot access before initialization
const name = "John";

// Same applies to let
console.log(age); // ERROR
let age = 30;
```

## Best Practices

✅ Use `const` by default  
✅ Use `let` when variable will be reassigned  
✅ Never use `var` in modern code
