# Directives Interview Questions (Quick Reference)

## Q1-Q5: Structural Directives
```typescript
// *ngIf
<div *ngIf="condition; else elseTemplate">True</div>
<ng-template #elseTemplate>False</ng-template>

// *ngFor with trackBy
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

trackByFn(index: number, item: any) {
  return item.id;
}

// *ngSwitch
<div [ngSwitch]="type">
  <div *ngSwitchCase="'user'">User type</div>
  <div *ngSwitchDefault>Default</div>
</div>
```

## Q6-Q10: Attribute Directives
```typescript
// Custom attribute directive
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'yellow');
  }
}

// With @Input
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight(this.appHighlight);
  }

  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}

// Usage
<div appHighlight="red">Highlighted</div>
```

## Q11-Q15: Advanced Directives
```typescript
// Directive with @HostBinding
@Directive({
  selector: '[appButton]'
})
export class ButtonDirective {
  @HostBinding('class.btn') btnClass = true;
  @HostBinding('class.btn-primary') isPrimary = true;
}

// Directive with @Output
@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.clickOutside.emit();
    }
  }

  constructor(private el: ElementRef) {}
}

// Structural directive with parameters
@Directive({
  selector: '[appIfRole]'
})
export class IfRoleDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appIfRole(role: string) {
    if (this.authService.hasRole(role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

// Usage
<div *appIfRole="'admin'">Admin only</div>
```

