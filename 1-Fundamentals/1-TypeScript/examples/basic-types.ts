// Basic TypeScript Types Examples for Angular

// ====== BASIC TYPES ======

// String
const message: string = "Hello Angular";
const greeting = `Welcome to ${message}`; // Template literal

// Number
const count: number = 42;
const decimal: number = 3.14;

// Boolean
const isActive: boolean = true;

// Array types
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ["a", "b", "c"];
const mixed: (string | number)[] = [1, "two", 3];

// Tuple - fixed-length array with specific types at each position
const tuple: [string, number, boolean] = ["hello", 42, true];

// Enum - set of named constants
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2
}

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING"
}

// Union types - can be one of several types
type ID = string | number;
const userId: ID = 123;
const adminId: ID = "admin-001";

// Literal types - specific values only
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
const method: HttpMethod = "GET";

// Any type (use sparingly!)
let unknownValue: any = "could be anything";
unknownValue = 42;
unknownValue = true;

// ====== WORKING WITH OBJECTS ======

// Object type
interface User {
  id: number;
  name: string;
  email?: string; // optional
  readonly createdAt: Date; // readonly
}

const user: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  createdAt: new Date()
};

// Type object (similar to interface but for simpler cases)
type Product = {
  id: number;
  name: string;
  price: number;
  inStock?: boolean;
};

// ====== FUNCTIONS ======

// Function with type annotations
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Function with optional and default parameters
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}

// Function with rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// Function returning void
function logMessage(message: string): void {
  console.log(message);
}

// Function type
type MathOperation = (a: number, b: number) => number;
const divide: MathOperation = (a, b) => a / b;

// ====== CLASSES ======

class Shape {
  protected name: string; // Protected: accessible in subclasses
  private _area: number = 0; // Private: only accessible in this class
  public color: string; // Public: accessible everywhere

  constructor(name: string, color: string = "black") {
    this.name = name;
    this.color = color;
  }

  // Method
  describe(): string {
    return `${this.name} is ${this.color}`;
  }

  // Getter
  get area(): number {
    return this._area;
  }

  // Setter
  set area(value: number) {
    if (value > 0) {
      this._area = value;
    }
  }

  // Static method
  static compare(shape1: Shape, shape2: Shape): boolean {
    return shape1.name === shape2.name;
  }
}

class Circle extends Shape {
  radius: number;

  constructor(radius: number, color: string = "red") {
    super("Circle", color);
    this.radius = radius;
  }

  describe(): string {
    return super.describe() + ` with radius ${this.radius}`;
  }
}

// ====== GENERICS ======

// Generic function
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = getFirstElement<number>([1, 2, 3]); // number | undefined
const firstStr = getFirstElement<string>(["a", "b"]); // string | undefined

// Generic class
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }

  get length(): number {
    return this.items.length;
  }
}

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);

// Generic with constraints
interface HasName {
  name: string;
}

function printName<T extends HasName>(obj: T): void {
  console.log(obj.name);
}

printName({ name: "John", age: 30 }); // OK
// printName(42); // ERROR

// ====== UTILITY TYPES ======

interface Person {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - make all properties optional
type PartialPerson = Partial<Person>;

// Required - make all properties required
type RequiredPerson = Required<PartialPerson>;

// Readonly - make all properties readonly
type ReadonlyPerson = Readonly<Person>;

// Pick - select specific properties
type PersonPreview = Pick<Person, "id" | "name">;

// Omit - exclude specific properties
type PersonWithoutEmail = Omit<Person, "email">;

// Record - create object with specified keys
type ColorRecord = Record<"red" | "green" | "blue", number>;
const colorValues: ColorRecord = {
  red: 255,
  green: 128,
  blue: 0
};

// ====== TYPE GUARDS ======

type StringOrNumber = string | number;

function processValue(value: StringOrNumber): void {
  // Type guard: typeof
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

// Custom type guard
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return "swim" in pet;
}

function move(pet: Fish | Bird): void {
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly();
  }
}

// ====== DECORATORS ======

// Enable decorators in tsconfig.json: "experimentalDecorators": true

// Class decorator
function Component(config: { selector: string; template: string }) {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      selector = config.selector;
      template = config.template;
    };
  };
}

@Component({ selector: "app-root", template: "<h1>Hello</h1>" })
class AppComponent {}

// Method decorator
function Debounce(delay: number) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let timeoutId: NodeJS.Timeout;

    descriptor.value = function (...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}

class SearchService {
  @Debounce(300)
  search(term: string): void {
    console.log(`Searching for: ${term}`);
  }
}

export {
  User,
  Product,
  Shape,
  Circle,
  Container,
  ColorRecord,
  AppComponent,
  SearchService
};
