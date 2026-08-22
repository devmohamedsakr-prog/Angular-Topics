# Angular Material Integration Guide

## Installation

```bash
ng add @angular/material
```

## Material Module Setup

```typescript
// app.module.ts
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatAutocompleteModule
  ]
})
export class AppModule { }
```

## Common Components

```typescript
// Button
<button mat-raised-button color="primary">Click me</button>
<button mat-flat-button>Flat</button>
<button mat-icon-button matTooltip="Info">
  <mat-icon>info</mat-icon>
</button>

// Card
<mat-card>
  <mat-card-header>
    <mat-card-title>Title</mat-card-title>
    <mat-card-subtitle>Subtitle</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    Content here
  </mat-card-content>
  <mat-card-actions>
    <button mat-button>Action</button>
  </mat-card-actions>
</mat-card>

// Form Field with Input
<mat-form-field appearance="outline">
  <mat-label>Name</mat-label>
  <input matInput placeholder="Enter your name" formControlName="name">
  <mat-error *ngIf="nameControl.hasError('required')">
    Name is required
  </mat-error>
</mat-form-field>

// Select
<mat-form-field appearance="outline">
  <mat-label>Choose an option</mat-label>
  <mat-select formControlName="selected">
    <mat-option value="option1">Option 1</mat-option>
    <mat-option value="option2">Option 2</mat-option>
  </mat-select>
</mat-form-field>

// Autocomplete
<mat-form-field>
  <mat-label>Select an item</mat-label>
  <input matInput [matAutocomplete]="auto" formControlName="item">
  <mat-autocomplete #auto="matAutocomplete">
    <mat-option *ngFor="let item of filteredItems$ | async" [value]="item">
      {{ item.name }}
    </mat-option>
  </mat-autocomplete>
</mat-form-field>

// Tabs
<mat-tab-group>
  <mat-tab label="Tab 1">
    Content 1
  </mat-tab>
  <mat-tab label="Tab 2">
    Content 2
  </mat-tab>
</mat-tab-group>

// Table
<table mat-table [dataSource]="dataSource" matSort>
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
    <td mat-cell *matCellDef="let element">{{ element.name }}</td>
  </ng-container>

  <ng-container matColumnDef="email">
    <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
    <td mat-cell *matCellDef="let element">{{ element.email }}</td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>

<mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>

// Snackbar
@Component({...})
export class Component {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}

// Dialog
@Component({...})
export class Component {
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed:', result);
    });
  }
}

// Sidenav
<mat-drawer-container>
  <mat-drawer #drawer>
    Drawer content
  </mat-drawer>
  
  <mat-drawer-content>
    <button (click)="drawer.toggle()">Toggle Drawer</button>
    Main content
  </mat-drawer-content>
</mat-drawer-container>
```

## Custom Theme

```scss
// custom-theme.scss
@import '~@angular/material/theming';

// Include the common styles for Angular Material
@include mat-core();

// Define your theme
$custom-palette: (
  50: #e0f7fa,
  100: #b3e5fc,
  200: #81d4fa,
  300: #4fc3f7,
  400: #29b6f6,
  500: #03a9f4,
  600: #039be5,
  700: #0288d1,
  800: #0277bd,
  900: #01579b,
  A100: #80d8ff,
  A200: #40c4ff,
  A400: #00b0ff,
  A700: #0091ea,
  contrast: (
    50: rgba(0, 0, 0, 0.87),
    100: rgba(0, 0, 0, 0.87),
    // ... more contrasts
  )
);

$custom-primary: mat-palette($custom-palette);
$custom-accent: mat-palette($mat-pink, A200, A100, A400);
$custom-warn: mat-palette($mat-red);

// Create your theme
$custom-theme: mat-light-theme($custom-primary, $custom-accent, $custom-warn);

// Include the custom theme
@include angular-material-theme($custom-theme);
```

## Material Icons

```html
<!-- Add to styles.scss -->
@import 'https://fonts.googleapis.com/icon?family=Material+Icons';

<!-- Use in templates -->
<mat-icon>home</mat-icon>
<mat-icon>settings</mat-icon>
<mat-icon>search</mat-icon>
<mat-icon>account_circle</mat-icon>
```

## Best Practices

1. **Lazy load Material components** - Only import used modules
2. **Customize theme** - Create custom color palette
3. **Use Material design principles** - Spacing, typography, shadows
4. **Accessibility** - Use semantic HTML and ARIA labels
5. **Performance** - Monitor bundle size
6. **Responsive design** - Use mat-toolbar breakpoints
7. **Consistent styling** - Follow Material Design guidelines

