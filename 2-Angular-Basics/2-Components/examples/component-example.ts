// Angular Component Examples

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ====== BASIC COMPONENT ======

@Component({
  selector: 'app-hello',
  template: '<h1>Hello {{ name }}!</h1>',
  styles: [`
    h1 {
      color: blue;
      font-size: 2rem;
    }
  `]
})
export class HelloComponent {
  name = 'World';
}

// ====== COMPONENT WITH LIFECYCLE HOOKS ======

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <button (click)="onDelete()">Delete</button>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 16px;
      margin: 8px 0;
    }
  `]
})
export class UserCardComponent implements OnInit, OnDestroy {
  @Input() user: { id: number; name: string; email: string };
  @Output() deleted = new EventEmitter<number>();

  private destroy$ = new Subject<void>();

  ngOnInit() {
    console.log('Component initialized');
  }

  ngOnDestroy() {
    console.log('Component destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete() {
    this.deleted.emit(this.user.id);
  }
}

// ====== PARENT-CHILD COMMUNICATION ======

interface User {
  id: number;
  name: string;
  email: string;
}

// Parent component
@Component({
  selector: 'app-user-list',
  template: `
    <h1>Users</h1>
    <div class="filters">
      <input 
        (change)="onFilterChange($event)" 
        placeholder="Search users"
      />
    </div>
    <app-user-card 
      *ngFor="let user of filteredUsers; trackBy: trackByUserId"
      [user]="user"
      (deleted)="onUserDeleted($event)"
    ></app-user-card>
  `,
  styles: [`
    .filters {
      margin: 16px 0;
    }
    input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  `]
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (users) => {
          this.users = users;
          this.applyFilter();
        },
        (error) => console.error('Failed to load users', error)
      );
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(u =>
        u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onUserDeleted(userId: number) {
    this.userService.deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.users = this.users.filter(u => u.id !== userId);
        this.applyFilter();
      });
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ====== COMPONENT WITH VIEW CHILD ======

@Component({
  selector: 'app-input-focus',
  template: `
    <div>
      <input #inputElement type="text" />
      <button (click)="focusInput()">Focus Input</button>
      <button (click)="clearInput()">Clear</button>
    </div>
  `
})
export class InputFocusComponent {
  @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement>;

  focusInput() {
    this.inputElement.nativeElement.focus();
  }

  clearInput() {
    this.inputElement.nativeElement.value = '';
    this.focusInput();
  }
}

// ====== COMPONENT WITH CHANGE DETECTION ======

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <button (click)="increment()">Increment</button>
      <button (click)="markForCheck()">Mark for Check</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  count = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  increment() {
    this.count++;
    // With OnPush strategy, must manually mark for check
    this.cdr.markForCheck();
  }

  markForCheck() {
    this.cdr.markForCheck();
  }
}

// ====== STANDALONE COMPONENT ======

@Component({
  selector: 'app-standalone-button',
  standalone: true,
  template: `
    <button [ngClass]="{ active: isActive }" (click)="toggle()">
      {{ label }}
    </button>
  `,
  styles: [`
    button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
    button.active {
      background-color: blue;
      color: white;
    }
  `]
})
export class StandaloneButtonComponent {
  @Input() label = 'Click me';
  @Output() clicked = new EventEmitter<void>();

  isActive = false;

  toggle() {
    this.isActive = !this.isActive;
    this.clicked.emit();
  }
}

// ====== SMART COMPONENT (CONTAINER) ======

@Component({
  selector: 'app-user-container',
  template: `
    <div>
      <h1>User Management</h1>
      <app-user-form (submitted)="onUserSubmitted($event)"></app-user-form>
      <app-user-list [users]="users$ | async"></app-user-list>
    </div>
  `
})
export class UserContainerComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }

  onUserSubmitted(user: Omit<User, 'id'>) {
    this.userService.createUser(user).subscribe(() => {
      this.users$ = this.userService.getUsers();
    });
  }
}

// ====== PRESENTATIONAL COMPONENT ======

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="profile">
      <h2>{{ user.name }}</h2>
      <p>Email: {{ user.email }}</p>
      <button (click)="onEdit()">Edit</button>
      <button (click)="onDelete()">Delete</button>
    </div>
  `,
  styles: [`
    .profile {
      border: 1px solid #ddd;
      padding: 16px;
      border-radius: 4px;
    }
  `]
})
export class UserProfileComponent {
  @Input() user: User;
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.user);
  }

  onDelete() {
    this.delete.emit(this.user.id);
  }
}

// ====== SERVICE (Mock for examples) ======

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

export {
  HelloComponent,
  UserCardComponent,
  UserListComponent,
  InputFocusComponent,
  CounterComponent,
  StandaloneButtonComponent,
  UserContainerComponent,
  UserProfileComponent
};
