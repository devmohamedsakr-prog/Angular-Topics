# Arrow Functions & Lexical This

## Overview
Arrow functions provide concise syntax and lexical `this` binding, making them essential in Angular.

## Syntax Variations

### Basic Arrow Function
```typescript
const add = (a: number, b: number) => a + b;
```

### Multiple Statements
```typescript
const multiply = (a: number, b: number) => {
  console.log(`Multiplying ${a} and ${b}`);
  return a * b;
};
```

### Single Parameter (Parentheses Optional)
```typescript
const square = (x: number) => x * x;
const square = x => x * x; // Both valid
```

### No Parameters
```typescript
const getRandom = () => Math.random();
```

## Lexical This Binding

Arrow functions capture `this` from their enclosing scope, unlike traditional functions.

### Correct Usage with Arrow Functions
```typescript
class Counter {
  count = 0;

  // Arrow function - 'this' refers to Counter instance
  increment = () => {
    this.count++;
  };

  getCount() {
    return this.count;
  }
}

const counter = new Counter();
counter.increment(); // OK
setTimeout(counter.increment, 100); // OK - 'this' is preserved
```

### Problem with Traditional Functions
```typescript
class Counter {
  count = 0;

  incrementTraditional() {
    this.count++;
  }
}

const counter = new Counter();
const fn = counter.incrementTraditional;
fn(); // ERROR: 'this' is undefined
```

## Use Cases in Angular

Arrow functions are extensively used for:
- Event handlers
- Callbacks
- Method bindings
- RxJS operators

```typescript
export class ButtonComponent {
  handleClick = () => {
    console.log('Clicked'); // 'this' refers to component
  };

  ngOnInit() {
    this.data$.subscribe(data => {
      console.log(data); // 'this' accessible here
    });
  }
}
```

## Key Differences from Traditional Functions

| Feature | Arrow | Traditional |
|---------|-------|-------------|
| `this` binding | Lexical | Dynamic |
| `arguments` | Inherited | Own |
| Can be constructor | No | Yes |
| Syntax | Concise | Verbose |
| `new` keyword | No | Yes |

## Best Practices

✅ Use arrow functions for callbacks and event handlers  
✅ Use arrow functions for RxJS operators  
✅ Use arrow functions in class properties for consistent `this`  
✅ Use traditional functions when you need `new` or `arguments`
