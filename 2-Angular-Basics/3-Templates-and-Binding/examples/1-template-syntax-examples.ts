/**
 * Template Syntax Examples
 * Demonstrates interpolation, expressions, and template basics
 */

import { Component } from '@angular/core';

// ============================================================
// EXAMPLE 1: Basic Interpolation
// ============================================================

@Component({
  selector: 'app-interpolation',
  template: `
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <p>Welcome, {{ user }}!</p>
  `
})
export class InterpolationComponent {
  title = 'Angular Templates';
  message = 'This is interpolation';
  user = 'John';
}

// ============================================================
// EXAMPLE 2: Template Expressions
// ============================================================

@Component({
  selector: 'app-expressions',
  template: `
    <div>
      <p>Simple math: {{ 5 + 3 }}</p>
      <p>String concat: {{ 'Hello ' + name }}</p>
      <p>Ternary: {{ age > 18 ? 'Adult' : 'Minor' }}</p>
      <p>Logical AND: {{ user && user.name }}</p>
      <p>Logical OR: {{ name || 'Guest' }}</p>
      <p>Method call: {{ getGreeting() }}</p>
      <p>Array access: {{ items[0] }}</p>
    </div>
  `
})
export class ExpressionsComponent {
  name = 'Alice';
  age = 25;
  user = { name: 'Bob', age: 30 };
  items = ['First', 'Second', 'Third'];

  getGreeting() {
    return 'Hello, ' + this.name;
  }
}

// ============================================================
// EXAMPLE 3: Safe Navigation Operator
// ============================================================

@Component({
  selector: 'app-safe-navigation',
  template: `
    <div>
      <!-- Safe navigation with dot -->
      <p>User: {{ user?.name }}</p>
      <p>City: {{ user?.address?.city }}</p>
      
      <!-- Safe navigation with array -->
      <p>First item: {{ items?.[0] }}</p>
      
      <!-- Null coalescing -->
      <p>Email: {{ user?.email ?? 'no-email@example.com' }}</p>
      
      <!-- Without safe navigation (will error if null) -->
      <!-- <p>{{ user.name }}</p> -->
    </div>
  `
})
export class SafeNavigationComponent {
  user: { name?: string; address?: { city?: string }; email?: string } | null = null;
  items: string[] | null = null;
}

// ============================================================
// EXAMPLE 4: Template with Comments
// ============================================================

@Component({
  selector: 'app-template-comments',
  template: `
    <!-- This is a simple comment -->
    <h1>{{ title }}</h1>
    
    <!-- 
      This is a multi-line comment
      explaining the template structure
    -->
    <p>{{ description }}</p>
    
    <!-- TODO: Add error handling -->
    <!-- FIXME: Performance issue here -->
    <div>
      {{ status }}
    </div>
  `
})
export class TemplateCommentsComponent {
  title = 'Comments Example';
  description = 'Templates support HTML comments';
  status = 'Active';
}

// ============================================================
// EXAMPLE 5: Computed Properties in Template
// ============================================================

@Component({
  selector: 'app-computed-properties',
  template: `
    <div>
      <p>Full Name: {{ getFullName() }}</p>
      <p>Is Adult: {{ isAdult() }}</p>
      <p>Status Badge: {{ getStatusBadge() }}</p>
      <p>Total Items: {{ items.length }}</p>
      <p>First Item: {{ items[0]?.toUpperCase() }}</p>
    </div>
  `
})
export class ComputedPropertiesComponent {
  firstName = 'John';
  lastName = 'Doe';
  age = 25;
  status = 'active';
  items = ['apple', 'banana', 'cherry'];

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  isAdult() {
    return this.age >= 18;
  }

  getStatusBadge() {
    return this.status.toUpperCase();
  }
}

// ============================================================
// EXAMPLE 6: Complex Template Expressions
// ============================================================

@Component({
  selector: 'app-complex-expressions',
  template: `
    <div>
      <p>Total Price: {{ items.reduce((sum, item) => sum + item.price, 0) }}</p>
      <p>Has Admin: {{ users.some(u => u.role === 'admin') }}</p>
      <p>Active Users: {{ users.filter(u => u.active).length }}</p>
      <p>Price with Tax: {{ (basePrice * 1.1).toFixed(2) }}</p>
    </div>
  `
})
export class ComplexExpressionsComponent {
  items = [
    { name: 'Item 1', price: 100 },
    { name: 'Item 2', price: 200 }
  ];
  users = [
    { name: 'Alice', role: 'admin', active: true },
    { name: 'Bob', role: 'user', active: false }
  ];
  basePrice = 99.99;
}

// ============================================================
// EXAMPLE 7: Interpolation with Whitespace
// ============================================================

@Component({
  selector: 'app-whitespace-example',
  template: `
    <!-- Extra whitespace is collapsed -->
    <p>This    has     spaces</p>
    
    <!-- Use &nbsp; for preserved spaces -->
    <p>Space&nbsp;preserved&nbsp;here</p>
    
    <!-- Whitespace in tags -->
    <div>
      Line with
      breaks
    </div>
  `
})
export class WhitespaceComponent {}

// ============================================================
// EXAMPLE 8: Template Expressions with Pipes
// ============================================================

@Component({
  selector: 'app-pipes-example',
  template: `
    <div>
      <p>Uppercase: {{ name | uppercase }}</p>
      <p>Lowercase: {{ name | lowercase }}</p>
      <p>Currency: {{ price | currency }}</p>
      <p>Date: {{ today | date: 'short' }}</p>
      <p>Slice: {{ items | slice:0:2 }}</p>
    </div>
  `
})
export class PipesComponent {
  name = 'Angular';
  price = 99.99;
  today = new Date();
  items = ['a', 'b', 'c', 'd', 'e'];
}

// ============================================================
// EXAMPLE 9: Nested Property Access
// ============================================================

@Component({
  selector: 'app-nested-properties',
  template: `
    <div>
      <p>Company: {{ employee.company.name }}</p>
      <p>Address: {{ employee.company.address.city }}, {{ employee.company.address.country }}</p>
      <p>Manager: {{ employee.manager?.name ?? 'No manager' }}</p>
    </div>
  `
})
export class NestedPropertiesComponent {
  employee = {
    name: 'John',
    company: {
      name: 'Tech Corp',
      address: {
        city: 'New York',
        country: 'USA'
      }
    },
    manager: null
  };
}

// ============================================================
// EXAMPLE 10: Performance: Avoid Function Calls
// ============================================================

@Component({
  selector: 'app-performance-example',
  template: `
    <div>
      <!-- ❌ BAD - function called every change detection -->
      <!-- <p>{{ expensiveCalculation() }}</p> -->
      
      <!-- ✅ GOOD - cached value -->
      <p>Result: {{ cachedValue }}</p>
      
      <!-- ✅ GOOD - computed property -->
      <p>Count: {{ items.length }}</p>
    </div>
  `
})
export class PerformanceComponent {
  items = [1, 2, 3, 4, 5];
  
  // Computed once
  cachedValue = this.items.reduce((sum, val) => sum + val, 0);

  // ❌ AVOID - this gets called constantly
  expensiveCalculation() {
    console.log('Calculating...');
    return this.items.reduce((sum, val) => sum + val, 0);
  }
}

// ============================================================
// EXAMPLE 11: Template with Multiple Data Types
// ============================================================

@Component({
  selector: 'app-data-types',
  template: `
    <div>
      <p>String: {{ stringValue }}</p>
      <p>Number: {{ numberValue }}</p>
      <p>Boolean: {{ booleanValue }}</p>
      <p>Array: {{ arrayValue }}</p>
      <p>Object: {{ objectValue | json }}</p>
      <p>Null: {{ nullValue }}</p>
    </div>
  `
})
export class DataTypesComponent {
  stringValue = 'Hello';
  numberValue = 42;
  booleanValue = true;
  arrayValue = [1, 2, 3];
  objectValue = { key: 'value', nested: { prop: 'data' } };
  nullValue = null;
}

// ============================================================
// EXAMPLE 12: Safe Access with Multiple Levels
// ============================================================

@Component({
  selector: 'app-deep-safe-access',
  template: `
    <div>
      <!-- Safe access at each level -->
      <p>{{ data?.user?.profile?.avatar?.url ?? 'default.jpg' }}</p>
      <p>{{ config?.database?.connection?.timeout ?? 5000 }}</p>
    </div>
  `
})
export class DeepSafeAccessComponent {
  data: any = null;  // Could be null
  config: any = {
    database: {
      connection: null  // Could be null
    }
  };
}

// ============================================================
// Summary: Template Syntax Best Practices
// ============================================================

/**
 * ✅ DO:
 * - Keep expressions simple
 * - Use safe navigation for nullable values
 * - Cache computed values
 * - Use pipes for formatting
 * - Comment complex expressions
 * - Pre-compute in component class
 * 
 * ❌ DON'T:
 * - Call functions in templates (performance)
 * - Use complex logic
 * - Forget safe navigation operator
 * - Create objects/arrays inline
 * - Use assignment operators
 */
