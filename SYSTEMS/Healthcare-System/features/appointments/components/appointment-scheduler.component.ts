/**
 * Appointment Scheduler Component - Healthcare System
 * Calendar-based appointment scheduling with provider availability
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, shareReplay, tap } from 'rxjs/operators';
import { AppointmentService } from '../services/appointment.service';
import {
  AppointmentSlot,
  Appointment,
  AppointmentType,
  SlotRequest,
} from '../models/appointment.model';

/**
 * Appointment scheduler component
 */
@Component({
  selector: 'app-appointment-scheduler',
  template: `
    <div class="scheduler-container">
      <header class="scheduler-header">
        <h1>Schedule Appointment</h1>
      </header>

      <!-- Scheduler Form -->
      <form [formGroup]="schedulerForm" (ngSubmit)="searchSlots()" class="scheduler-form">
        <div class="form-section">
          <h2>Appointment Details</h2>
          
          <div class="form-group">
            <label for="type">Appointment Type *</label>
            <select id="type" formControlName="appointmentType" class="form-input">
              <option value="">Select Type</option>
              <option *ngFor="let type of appointmentTypes" [value]="type">
                {{ type | titlecase }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="date">Preferred Date *</label>
            <input
              id="date"
              type="date"
              formControlName="preferredDate"
              class="form-input"
              [min]="today"
            />
          </div>

          <div class="form-group">
            <label for="time">Preferred Time</label>
            <select id="time" formControlName="preferredTime" class="form-input">
              <option value="">Any time</option>
              <option value="09:00">9:00 AM</option>
              <option value="09:30">9:30 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="10:30">10:30 AM</option>
              <option value="14:00">2:00 PM</option>
              <option value="14:30">2:30 PM</option>
              <option value="15:00">3:00 PM</option>
            </select>
          </div>

          <div class="form-group">
            <label for="duration">Duration (minutes) *</label>
            <select id="duration" formControlName="duration" class="form-input">
              <option value="15">15 minutes</option>
              <option value="30" selected>30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

          <div class="form-group">
            <label for="reason">Reason for Visit</label>
            <textarea
              id="reason"
              formControlName="reason"
              class="form-input"
              rows="3"
            ></textarea>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="!schedulerForm.valid">
          Search Available Slots
        </button>
      </form>

      <!-- Available Slots -->
      <div *ngIf="(availableSlots$ | async) as slots" class="slots-section">
        <h2>Available Time Slots</h2>
        
        <div *ngIf="slots.length > 0; else noSlots" class="slots-grid">
          <div
            *ngFor="let slot of slots"
            class="slot-card"
            [class.selected]="selectedSlot?.id === slot.id"
            (click)="selectSlot(slot)"
          >
            <p class="time">{{ slot.startTime | date: 'HH:mm' }}</p>
            <p class="date">{{ slot.startTime | date: 'EEE, MMM d' }}</p>
            <p class="provider">{{ getProviderName(slot.providerId) }}</p>
            <p class="availability">
              {{ slot.capacity - slot.booked }}/{{ slot.capacity }} available
            </p>
          </div>
        </div>

        <ng-template #noSlots>
          <p class="empty-state">No available slots found. Try different dates or times.</p>
        </ng-template>

        <!-- Confirm Selection -->
        <div *ngIf="selectedSlot" class="confirm-section">
          <h3>Confirm Appointment</h3>
          <div class="appointment-preview">
            <p><strong>Date & Time:</strong>
               {{ selectedSlot.startTime | date: 'EEEE, MMMM d, yyyy \'at\' HH:mm' }}</p>
            <p><strong>Duration:</strong> {{ schedulerForm.get('duration')?.value }} minutes</p>
            <p><strong>Type:</strong> {{ schedulerForm.get('appointmentType')?.value | titlecase }}</p>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" formControlName="confirmConsent" />
              I confirm this appointment and agree to the cancellation policy
            </label>
          </div>

          <button
            (click)="confirmBooking()"
            class="btn btn-success"
            [disabled]="!schedulerForm.get('confirmConsent')?.value"
          >
            Confirm Booking
          </button>
        </div>
      </div>

      <!-- Loading & Error -->
      <div *ngIf="(loading$ | async)" class="loading">
        <div class="spinner"></div>
        <p>Loading available slots...</p>
      </div>

      <div *ngIf="(error$ | async) as error" class="error-banner">
        <p>{{ error }}</p>
        <button (click)="dismissError()" class="close-btn">×</button>
      </div>
    </div>
  `,
  styles: [
    `
      .scheduler-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 24px;
      }

      .scheduler-header {
        margin-bottom: 32px;
        border-bottom: 2px solid #eee;
        padding-bottom: 16px;
      }

      .scheduler-header h1 {
        margin: 0;
        font-size: 28px;
      }

      .scheduler-form {
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 32px;
      }

      .form-section {
        margin-bottom: 24px;
      }

      .form-section h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        font-size: 14px;
      }

      .form-input,
      select,
      textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }

      .slots-section {
        margin-top: 32px;
      }

      .slots-section h2 {
        margin-bottom: 16px;
        font-size: 20px;
      }

      .slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
        margin-bottom: 24px;
      }

      .slot-card {
        padding: 16px;
        border: 2px solid #eee;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
      }

      .slot-card:hover {
        border-color: #007bff;
        box-shadow: 0 2px 8px rgba(0,123,255,0.1);
      }

      .slot-card.selected {
        border-color: #007bff;
        background: #f0f8ff;
      }

      .slot-card .time {
        font-size: 18px;
        font-weight: 700;
        color: #007bff;
        margin: 0 0 4px 0;
      }

      .slot-card .date {
        font-size: 12px;
        color: #666;
        margin: 0 0 4px 0;
      }

      .slot-card .provider {
        font-size: 12px;
        font-weight: 600;
        margin: 4px 0;
      }

      .slot-card .availability {
        font-size: 11px;
        color: #999;
        margin: 4px 0 0 0;
      }

      .confirm-section {
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
      }

      .confirm-section h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
      }

      .appointment-preview {
        background: white;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 12px;
      }

      .appointment-preview p {
        margin: 6px 0;
        font-size: 14px;
      }

      .btn {
        padding: 10px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-success {
        background: #28a745;
        color: white;
        width: 100%;
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .loading {
        text-align: center;
        padding: 40px;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .error-banner {
        background: #fff3cd;
        border: 1px solid #ffc107;
        padding: 12px 16px;
        border-radius: 4px;
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
      }

      .empty-state {
        text-align: center;
        color: #999;
        padding: 24px;
      }

      @media (max-width: 768px) {
        .slots-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentSchedulerComponent implements OnInit, OnDestroy {
  // Form
  schedulerForm: FormGroup;

  // Observables
  availableSlots$: Observable<AppointmentSlot[]>;
  loading$ = new Observable<boolean>();
  error$ = this.appointmentService.error$;

  // State
  selectedSlot: AppointmentSlot | null = null;
  today = new Date().toISOString().split('T')[0];
  appointmentTypes = Object.values(AppointmentType);

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {
    this.schedulerForm = this.createForm();
    this.availableSlots$ = new Observable<AppointmentSlot[]>();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create scheduler form
   */
  private createForm(): FormGroup {
    return this.fb.group({
      appointmentType: ['', Validators.required],
      preferredDate: ['', Validators.required],
      preferredTime: [''],
      duration: ['30', Validators.required],
      reason: [''],
      confirmConsent: [false],
    });
  }

  /**
   * Search available slots
   */
  searchSlots(): void {
    if (this.schedulerForm.invalid) return;

    const formValue = this.schedulerForm.value;
    const request: SlotRequest = {
      patientId: 'current-patient-id', // From auth service
      appointmentType: formValue.appointmentType,
      preferredDate: new Date(formValue.preferredDate),
      preferredTime: formValue.preferredTime,
      duration: parseInt(formValue.duration),
      maxResultsToReturn: 20,
    };

    this.availableSlots$ = this.appointmentService
      .getAvailableSlots(request)
      .pipe(
        tap((slots) => {
          this.selectedSlot = null;
        }),
        shareReplay(1)
      );
  }

  /**
   * Select slot
   */
  selectSlot(slot: AppointmentSlot): void {
    this.selectedSlot = slot;
  }

  /**
   * Confirm booking
   */
  confirmBooking(): void {
    if (!this.selectedSlot) return;

    const appointment: Partial<Appointment> = {
      patientId: 'current-patient-id',
      providerId: this.selectedSlot.providerId,
      type: this.schedulerForm.get('appointmentType')?.value,
      startTime: this.selectedSlot.startTime,
      endTime: this.selectedSlot.endTime,
      reasonForVisit: this.schedulerForm.get('reason')?.value,
      telehealth: false,
    };

    this.appointmentService
      .bookAppointment(appointment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (booked) => {
          alert(`Appointment confirmed! Your booking is #${booked.id}`);
          this.schedulerForm.reset();
          this.selectedSlot = null;
        },
        error: (error) => console.error('Booking error:', error),
      });
  }

  /**
   * Get provider name
   */
  getProviderName(providerId: string): string {
    // In real app, fetch from provider service
    return 'Dr. Smith';
  }

  /**
   * Dismiss error
   */
  dismissError(): void {
    this.appointmentService.clearError();
  }

  private takeUntil(arg0: Subject<void>) {
    throw new Error('Method not implemented.');
  }
}
