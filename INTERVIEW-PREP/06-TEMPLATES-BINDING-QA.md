# Templates & Binding Interview Questions (Quick Reference)

## Q1-Q3: Interpolation, Property & Event Binding
```typescript
// Interpolation {{ }}
{{ expression }}
{{ user.name }}
{{ 1 + 2 }}

// Property binding []
<img [src]="imageUrl">
<button [disabled]="isDisabled">Click</button>

// Event binding ()
<button (click)="onClick()">Click</button>
<input (input)="onInput($event)">

// Two-way binding [()]
<input [(ngModel)]="name">

// Attribute binding [attr.x]
<div [attr.aria-label]="'Menu'"></div>

// Class binding [class.x]
<div [class.active]="isActive"></div>

// Style binding [style.x]
<div [style.color]="textColor"></div>
```

## Q4-Q6: Directives
```typescript
// Structural directives
<div *ngIf="condition">Shown if true</div>
<div *ngFor="let item of items">{{ item }}</div>
<div [ngSwitch]="value">
  <div *ngSwitchCase="1">One</div>
  <div *ngSwitchDefault>Other</div>
</div>

// Attribute directives
<div [ngClass]="{ active: isActive, disabled: isDisabled }"></div>
<div [ngStyle]="{ color: 'red', fontSize: '16px' }"></div>
```

## Q7-Q9: Pipes
```typescript
{{ date | date: 'short' }}
{{ number | number: '1.2-2' }}
{{ text | uppercase }}
{{ text | slice:0:5 }}

// Custom pipe
@Pipe({ name: 'customPipe' })
export class CustomPipe implements PipeTransform {
  transform(value: string): string {
    return value.toUpperCase();
  }
}
```

## Q10-Q12: Template Variables & References
```typescript
// Template variable
<input #myInput>
<button (click)="getValue(myInput.value)">Get</button>

// ViewChild
@ViewChild('myInput') myInput: ElementRef;

// Content projection
<app-card>
  <p>Projected content</p>
</app-card>

@Component({
  template: `<ng-content></ng-content>`
})
export class CardComponent {}
```

## Q13-Q15: Safe Navigation & Best Practices
```typescript
// Safe navigation operator
{{ user?.name }}
{{ items?.[0] }}

// Non-null assertion
{{ user!.name }}

// Async pipe
{{ data$ | async }}

// KeyValue pipe for objects
<div *ngFor="let item of (obj | keyvalue)">
  {{ item.key }}: {{ item.value }}
</div>
```

