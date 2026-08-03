# TypeScript Interview Questions

## Level 1: Beginner

### Q1: What is TypeScript and why use it with Angular?
**Answer:**
TypeScript is a typed superset of JavaScript that compiles to clean, readable JavaScript code. Angular uses TypeScript because:

1. **Type Safety** - Catches errors at compile time, not runtime
2. **Better IDE Support** - Autocomplete and intelligent refactoring
3. **Self-Documenting Code** - Types serve as inline documentation
4. **OOP Features** - Interfaces, classes, decorators for structured code
5. **Angular Integration** - Angular is built with TypeScript, using decorators and type metadata

```typescript
// TypeScript advantage
interface User {
  id: number;
  name: string;
}

function createUser(user: User): void {
  // IDE knows user.id and user.name exist
  console.log(user.name);
}

createUser({ id: 1, name: "John" }); // ✓ OK
createUser({ id: 1 }); // ✗ ERROR: 'name' missing
```

### Q2: What's the difference between `interface` and `type`?
**Answer:**
Both define object shapes but have key differences:

| Feature | Interface | Type |
|---------|-----------|------|
| Union types | ❌ No | ✓ Yes |
| Primitives | ❌ No | ✓ Yes |
| Declaration merging | ✓ Yes | ❌ No |
| Computed properties | ❌ No | ✓ Yes |
| Use case | Object contracts | Any type definition |

```typescript
// Interface - for object shapes and contracts
interface Animal {
  name: string;
  age: number;
}

// Type - more flexible
type Status = "active" | "inactive";
type ID = string | number;
type Config = { timeout: number; retries: number };

// Declaration merging (interfaces only)
interface Window {
  myProperty: string;
}

interface Window {
  anotherProperty: number;
}
// Window now has both properties

// With types, this would be an error
```

### Q3: Explain union and intersection types
**Answer:**

**Union Types** (|) - value can be ONE of these types:
```typescript
type StringOrNumber = string | number;

function process(value: StringOrNumber) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

**Intersection Types** (&) - value must be ALL of these types:
```typescript
interface HasId { id: number; }
interface HasName { name: string; }

type User = HasId & HasName;

const user: User = {
  id: 1,
  name: "John"
};
```

### Q4: What are generics and why are they useful?
**Answer:**
Generics allow writing reusable code that works with multiple types while maintaining type safety:

```typescript
// Without generics - loses type information
function getArray(arr: any[]): any {
  return arr[0];
}

const first = getArray([1, 2, 3]); // type is 'any'

// With generics - preserves type information
function getArrayGeneric<T>(arr: T[]): T {
  return arr[0];
}

const firstNum = getArrayGeneric<number>([1, 2, 3]); // type is 'number'
const firstStr = getArrayGeneric<string>(["a", "b"]); // type is 'string'
```

Benefits:
- Type safety maintained across transformations
- Reusable across different data types
- Better IDE support and autocomplete

---

## Level 2: Intermediate

### Q5: What's the difference between `readonly` and `const`?
**Answer:**

**const** - prevents variable reassignment:
```typescript
const user = { name: "John" };
user = { name: "Jane" }; // ✗ ERROR: cannot reassign
user.name = "Jane"; // ✓ OK: can modify properties
```

**readonly** - prevents property modification in objects/classes:
```typescript
interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: "John" };
user.id = 2; // ✗ ERROR: cannot modify readonly property
user.name = "Jane"; // ✓ OK

// readonly array
const numbers: readonly number[] = [1, 2, 3];
numbers[0] = 5; // ✗ ERROR
```

### Q6: Explain decorators and their uses in Angular
**Answer:**
Decorators are functions that modify classes, methods, properties, or parameters. They use `@` syntax and are heavily used in Angular:

```typescript
// Class Decorator - modifies class definition
@Component({
  selector: 'app-root',
  template: '<h1>Hello</h1>'
})
export class AppComponent {}

// Property Decorator - adds metadata to properties
@Input() title: string;
@Output() clicked = new EventEmitter();

// Method Decorator - wraps method behavior
@HostListener('click')
onClick(): void {
  console.log('Clicked!');
}

// Parameter Decorator - adds metadata to parameters
constructor(@Inject(HttpClient) http: HttpClient) {}
```

Common Angular decorators:
- `@Component`, `@Directive`, `@Pipe`, `@Injectable` - class decorators
- `@Input`, `@Output`, `@ViewChild` - property decorators
- `@HostListener`, `@HostBinding` - method decorators

### Q7: What are conditional types? When would you use them?
**Answer:**
Conditional types use ternary operator syntax to select one of two types based on a condition:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>; // false

// Practical example: Extract array element type
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number

// Real-world: Promise unwrapping
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type Result = Unwrap<Promise<string>>; // string
```

Use cases:
- Type transformation based on conditions
- Extracting nested types
- Conditional API responses

### Q8: What's `keyof` and how is it useful?
**Answer:**
`keyof` returns a union of all keys in an object type:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User; // "id" | "name" | "email"

// Ensure function accepts only valid property names
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "John", email: "john@example.com" };
const id = getProperty(user, "id"); // ✓ OK, returns number
const email = getProperty(user, "email"); // ✓ OK, returns string
getProperty(user, "invalid"); // ✗ ERROR
```

---

## Level 3: Advanced

### Q9: Explain mapped types and provide an example
**Answer:**
Mapped types create new types by transforming properties of existing types:

```typescript
// Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Create getters for all properties
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  id: number;
  name: string;
}

type UserGetters = Getters<User>;
// Result: {
//   getId: () => number;
//   getName: () => string;
// }
```

Angular use case - form types:
```typescript
type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    touched: boolean;
    error: string | null;
  };
};
```

### Q10: What's the difference between `unknown` and `any`?
**Answer:**

**any** - opt-out of type checking (avoid using):
```typescript
let value: any = 42;
value.toUpperCase(); // No error, but will crash at runtime!
```

**unknown** - safe type when you don't know the type:
```typescript
let value: unknown = 42;
value.toUpperCase(); // ✗ ERROR: must check type first

if (typeof value === "string") {
  value.toUpperCase(); // ✓ OK: TypeScript knows it's string
}
```

**Best practice:** Prefer `unknown` over `any`, then narrow the type:
```typescript
function process(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    console.log(value.toFixed(2));
  }
}
```

### Q11: Explain variance in generics
**Answer:**
Variance describes how type parameters behave in type hierarchies:

```typescript
class Animal {}
class Dog extends Animal {}

// Covariance - can be read from
interface Producer<out T> {
  produce(): T;
}

const dogProducer: Producer<Dog> = {
  produce() { return new Dog(); }
};

const animalProducer: Producer<Animal> = dogProducer; // ✓ OK - covariant

// Contravariance - can be written to
interface Consumer<in T> {
  consume(value: T): void;
}

const animalConsumer: Consumer<Animal> = {
  consume(value: Animal) {}
};

// const dogConsumer: Consumer<Dog> = animalConsumer; // ✗ ERROR
const dogConsumer: Consumer<Dog> = {
  consume(value: Dog) {}
};

const baseConsumer: Consumer<Animal> = dogConsumer; // ✓ OK - contravariant

// Invariance - neither
interface Invariant<T> {
  get(): T;
  set(value: T): void;
}
```

---

## Q12: Real-world Angular scenario
**Question:** How would you create a strongly-typed HTTP service?

**Answer:**
```typescript
interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>('/api/users');
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`/api/users/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>('/api/users', user);
  }
}

// Usage
this.userService.getUsers().subscribe((response: ApiResponse<User[]>) => {
  if (response.status === "success") {
    console.log(response.data); // Fully typed as User[]
  }
});
```

---

## Quick Reference

**When to use Interface:** Defining component props, service contracts, module exports

**When to use Type:** Unions, function signatures, complex transformations

**Use Generics for:** Reusable components, services, utilities that work with multiple types

**Prefer `unknown` to `any`:** For truly unknown types that need narrowing

**Leverage `keyof`:** When accepting object keys as parameters for type safety
