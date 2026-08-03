/**
 * Appointment Service - Healthcare System
 * Manages scheduling, availability, and appointment lifecycle
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  throwError,
} from 'rxjs';
import {
  map,
  tap,
  catchError,
  shareReplay,
} from 'rxjs/operators';
import {
  Appointment,
  AppointmentSlot,
  AppointmentStatus,
  ProviderAvailability,
  SlotRequest,
  AppointmentReminder,
} from '../models/appointment.model';

/**
 * Injectable appointment service
 */
@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly apiUrl = '/api/appointments';

  // State
  private appointmentsSubject$ = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject$.asObservable().pipe(shareReplay(1));

  private slotsSubject$ = new BehaviorSubject<AppointmentSlot[]>([]);
  public slots$ = this.slotsSubject$.asObservable().pipe(shareReplay(1));

  private errorSubject$ = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject$.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get available slots
   */
  getAvailableSlots(request: SlotRequest): Observable<AppointmentSlot[]> {
    return this.http
      .post<AppointmentSlot[]>(`${this.apiUrl}/available-slots`, request)
      .pipe(
        tap((slots) => this.slotsSubject$.next(slots)),
        catchError((error) => this.handleError('fetching slots', error))
      );
  }

  /**
   * Get provider availability
   */
  getProviderAvailability(providerId: string): Observable<ProviderAvailability[]> {
    return this.http
      .get<ProviderAvailability[]>(
        `${this.apiUrl}/providers/${providerId}/availability`
      )
      .pipe(
        catchError((error) => this.handleError('fetching availability', error))
      );
  }

  /**
   * Book appointment
   */
  bookAppointment(appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http
      .post<Appointment>(`${this.apiUrl}`, appointment)
      .pipe(
        tap((booked) => {
          this.appointmentsSubject$.next([
            ...this.appointmentsSubject$.value,
            booked,
          ]);
        }),
        catchError((error) => this.handleError('booking appointment', error))
      );
  }

  /**
   * Get patient appointments
   */
  getPatientAppointments(patientId: string): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`)
      .pipe(
        tap((appointments) => this.appointmentsSubject$.next(appointments)),
        catchError((error) => this.handleError('fetching appointments', error))
      );
  }

  /**
   * Get appointment by ID
   */
  getAppointment(appointmentId: string): Observable<Appointment> {
    return this.http
      .get<Appointment>(`${this.apiUrl}/${appointmentId}`)
      .pipe(
        catchError((error) => this.handleError('fetching appointment', error))
      );
  }

  /**
   * Reschedule appointment
   */
  rescheduleAppointment(
    appointmentId: string,
    newSlot: AppointmentSlot
  ): Observable<Appointment> {
    return this.http
      .patch<Appointment>(`${this.apiUrl}/${appointmentId}/reschedule`, {
        slotId: newSlot.id,
        newStartTime: newSlot.startTime,
        newEndTime: newSlot.endTime,
      })
      .pipe(
        tap((updated) => {
          const appointments = this.appointmentsSubject$.value.map((a) =>
            a.id === appointmentId ? updated : a
          );
          this.appointmentsSubject$.next(appointments);
        }),
        catchError((error) => this.handleError('rescheduling appointment', error))
      );
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(
    appointmentId: string,
    reason?: string
  ): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/${appointmentId}/cancel`, { reason })
      .pipe(
        tap(() => {
          const appointments = this.appointmentsSubject$.value.map((a) =>
            a.id === appointmentId
              ? { ...a, status: AppointmentStatus.CANCELLED, cancelReason: reason }
              : a
          );
          this.appointmentsSubject$.next(appointments as any);
        }),
        catchError((error) => this.handleError('cancelling appointment', error))
      );
  }

  /**
   * Confirm appointment
   */
  confirmAppointment(appointmentId: string): Observable<Appointment> {
    return this.http
      .patch<Appointment>(`${this.apiUrl}/${appointmentId}/confirm`, {})
      .pipe(
        tap((confirmed) => {
          const appointments = this.appointmentsSubject$.value.map((a) =>
            a.id === appointmentId ? confirmed : a
          );
          this.appointmentsSubject$.next(appointments);
        }),
        catchError((error) => this.handleError('confirming appointment', error))
      );
  }

  /**
   * Set appointment reminders
   */
  setReminders(
    appointmentId: string,
    reminders: Partial<AppointmentReminder>[]
  ): Observable<AppointmentReminder[]> {
    return this.http
      .post<AppointmentReminder[]>(
        `${this.apiUrl}/${appointmentId}/reminders`,
        reminders
      )
      .pipe(
        catchError((error) => this.handleError('setting reminders', error))
      );
  }

  /**
   * Get upcoming appointments for provider
   */
  getProviderSchedule(
    providerId: string,
    startDate: Date,
    endDate: Date
  ): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(
        `${this.apiUrl}/provider/${providerId}/schedule`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      )
      .pipe(
        catchError((error) => this.handleError('fetching schedule', error))
      );
  }

  /**
   * Update provider availability
   */
  updateProviderAvailability(
    providerId: string,
    availability: ProviderAvailability[]
  ): Observable<ProviderAvailability[]> {
    return this.http
      .put<ProviderAvailability[]>(
        `${this.apiUrl}/providers/${providerId}/availability`,
        availability
      )
      .pipe(
        catchError((error) => this.handleError('updating availability', error))
      );
  }

  /**
   * Handle errors
   */
  private handleError(action: string, error: any): Observable<never> {
    const message = error?.error?.message || error?.message || `Error ${action}`;
    this.errorSubject$.next(message);
    return throwError(() => new Error(message));
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorSubject$.next(null);
  }
}
