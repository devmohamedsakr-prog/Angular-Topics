# TypeScript Fundamentals for Angular

## Overview
TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It's the foundation of Angular development.

## Table of Contents
1. [Type System](#type-system)
2. [Interfaces vs Types](#interfaces-vs-types)
3. [Decorators](#decorators)
4. [Generics](#generics)
5. [Advanced Types](#advanced-types)

---

## Type System

### Primitive Types
TypeScript provides several primitive types:

```typescript
// Boolean
let isDone: boolean = false;

// Number (all numeric values)
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// String
let color: string = "blue";
let color2: string = `The color is ${color}`;

// Array
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];

// Any (escape hatch - use sparingly)
let notSure: any = 4;
notSure = "string";
notSure = false;

// Void (absence of type, often used in functions)
function warnUser(): void {
  console.log("Warning");
}

// Never (represents values that never occur)
function error(message: string): never {
  throw new Error(message);
}

// Null and Undefined
let u: undefined = undefined;
let n: null = null;
```

### Type Inference
TypeScript can infer types automatically:

```typescript
let x = 3; // x is inferred as number
x = "hello"; // ERROR: Type 'string' is not assignable to type 'number'
```

---

## Interfaces vs Types

### Interfaces
Interfaces define object shapes and contracts:

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
  readonly created: Date; // Readonly property
}

// Implementing interface in class
class UserImpl implements User {
  id: number;
  name: string;
  email?: string;
  readonly created: Date;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.created = new Date();
  }
}

// Interface inheritance
interface Admin extends User {
  adminLevel: number;
}
```

### Type Aliases
Types can represent any type, not just objects:

```typescript
type ID = string | number;
type Status = "active" | "inactive" | "pending";
type Point = { x: number; y: number };

type Callback = (data: string) => void;
```

### Key Differences
| Aspect | Interface | Type |
|--------|-----------|------|
| Extensibility | Declaration merging | Union types |
| Primitives | No | Yes |
| Unions | No | Yes |
| Tuples | No | Yes |
| Use Case | Object contracts | Flexible type definitions |

---

## Decorators

Decorators are functions that modify classes, methods, properties, or parameters:

```typescript
// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

// Method decorator
function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyName} with`, args);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Property decorator
function Required(target: any, propertyName: string) {
  // Validation logic
}

class Person {
  @Required
  name: string;
}

// Parameter decorator
function Validate(target: any, propertyName: string, parameterIndex: number) {
  // Validation logic
}
```

---

## Generics

Generics allow creating reusable components that work with multiple types:

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString");
let output2 = identity<number>(100);

// Generic interface
interface GenericIdentityFn {
  <T>(arg: T): T;
}

const myIdentity: GenericIdentityFn = identity;

// Generic class
class GenericNumber<T> {
  value: T;
  add: (x: T, y: T) => T;

  constructor(value: T) {
    this.value = value;
  }
}

let myGenericNumber = new GenericNumber<number>(5);

// Generic constraints
interface WithLength {
  length: number;
}

function loggingIdentity<T extends WithLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

---

## Advanced Types

### Union and Intersection Types

```typescript
// Union types (can be one of these types)
type StringOrNumber = string | number;

function printId(id: StringOrNumber) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}

// Intersection types (must be all of these types)
interface Named {
  name: string;
}

interface Aged {
  age: number;
}

type Person = Named & Aged;

// This object must have both name and age
const person: Person = {
  name: "Alice",
  age: 30
};
```

### Literal Types

```typescript
type Direction = "North" | "South" | "East" | "West";
type HttpStatus = 200 | 301 | 404 | 500;

function move(direction: Direction) {}
move("North"); // OK
move("Northeast"); // ERROR
```

### Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>; // false

// Practical example
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number
```

### Mapped Types

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  id: number;
  name: string;
}

type UserGetters = Getters<User>;
// Result: { getId: () => number; getName: () => string }
```

---

## Best Practices

1. **Avoid `any` type** - Use `unknown` instead when you truly don't know the type
2. **Use strict mode** - Enable `strict: true` in tsconfig.json
3. **Leverage type inference** - Let TypeScript infer when obvious
4. **Use descriptive type names** - Make contracts clear
5. **Prefer interfaces for public APIs** - Better for declaration merging
6. **Use types for unions and tuples** - They handle these better
7. **Be careful with decorators** - They have a learning curve

---

## Key Takeaways

- TypeScript provides a robust type system for catching errors at compile time
- Use interfaces and types strategically for code contracts
- Decorators enable metaprogramming capabilities (heavily used in Angular)
- Generics enable flexible, reusable, and type-safe code
- Advanced types like unions, intersections, and conditionals provide powerful typing patterns
