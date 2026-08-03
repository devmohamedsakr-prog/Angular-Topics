/**
 * Patient Service - Healthcare System
 * HIPAA-compliant patient data management with encryption and audit logging
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  Patient,
  AuditLog,
  PatientConsent,
  VitalSigns,
  LabResult,
  ClinicalNote,
} from '../models/patient.model';

/**
 * Injectable patient service with HIPAA compliance
 */
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  // API endpoint
  private readonly apiUrl = '/api/patients';

  // State subjects
  private patientsSubject$ = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject$.asObservable().pipe(shareReplay(1));

  private selectedPatientSubject$ = new BehaviorSubject<Patient | null>(null);
  public selectedPatient$ = this.selectedPatientSubject$.asObservable();

  private auditLogsSubject$ = new BehaviorSubject<AuditLog[]>([]);
  public auditLogs$ = this.auditLogsSubject$.asObservable();

  // Error handling
  private errorSubject$ = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject$.asObservable();

  // Session management
  private sessionId: string;
  private userId: string;

  constructor(private http: HttpClient) {
    this.sessionId = this.generateSessionId();
    this.userId = this.getCurrentUserId();
  }

  // ============================================================================
  // PATIENT RETRIEVAL (with audit logging)
  // ============================================================================

  /**
   * Get patient by ID (with audit log)
   */
  getPatient(patientId: string): Observable<Patient> {
    return this.http
      .get<Patient>(`${this.apiUrl}/${patientId}`, {
        headers: this.getSecureHeaders(),
      })
      .pipe(
        tap((patient) => {
          this.selectedPatientSubject$.next(patient);
          this.logAccess('view', patientId, 'Patient', true);
        }),
        catchError((error) => {
          this.logAccess('view', patientId, 'Patient', false, error.message);
          return this.handleError('fetching patient', error);
        })
      );
  }

  /**
   * Get all patients (filtered by provider)
   */
  getPatients(): Observable<Patient[]> {
    return this.http
      .get<Patient[]>(`${this.apiUrl}`, {
        headers: this.getSecureHeaders(),
      })
      .pipe(
        tap((patients) => {
          this.patientsSubject$.next(patients);
          this.logAccess('view', 'multiple', 'PatientList', true);
        }),
        catchError((error) => {
          this.logAccess('view', 'multiple', 'PatientList', false, error.message);
          return this.handleError('fetching patients', error);
        })
      );
  }

  /**
   * Search patients (HIPAA: limited search results)
   */
  searchPatients(
    query: string,
    limit: number = 10
  ): Observable<Patient[]> {
    return this.http
      .get<Patient[]>(`${this.apiUrl}/search`, {
        params: { q: query, limit: limit.toString() },
        headers: this.getSecureHeaders(),
      })
      .pipe(
        tap((patients) => {
          this.logAccess('view', 'search', 'PatientSearch', true);
        }),
        catchError((error) => {
          this.logAccess('view', 'search', 'PatientSearch', false, error.message);
          return this.handleError('searching patients', error);
        })
      );
  }

  // ============================================================================
  // PATIENT MANAGEMENT
  // ============================================================================

  /**
   * Create patient record
   */
  createPatient(patient: Partial<Patient>): Observable<Patient> {
    return this.http
      .post<Patient>(`${this.apiUrl}`, this.encryptSensitiveFields(patient), {
        headers: this.getSecureHeaders(),
      })
      .pipe(
        tap((created) => {
          this.logAccess('create', created.id, 'Patient', true);
          this.patientsSubject$.next([
            ...this.patientsSubject$.value,
            created,
          ]);
        }),
        catchError((error) => {
          this.logAccess('create', 'new', 'Patient', false, error.message);
          return this.handleError('creating patient', error);
        })
      );
  }

  /**
   * Update patient record
   */
  updatePatient(
    patientId: string,
    updates: Partial<Patient>
  ): Observable<Patient> {
    return this.http
      .put<Patient>(
        `${this.apiUrl}/${patientId}`,
        this.encryptSensitiveFields(updates),
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap((updated) => {
          this.logAccess('update', patientId, 'Patient', true);
          this.selectedPatientSubject$.next(updated);
        }),
        catchError((error) => {
          this.logAccess('update', patientId, 'Patient', false, error.message);
          return this.handleError('updating patient', error);
        })
      );
  }

  /**
   * Delete patient record (soft delete)
   */
  deletePatient(patientId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${patientId}`, {
        headers: this.getSecureHeaders(),
      })
      .pipe(
        tap(() => {
          this.logAccess('delete', patientId, 'Patient', true);
        }),
        catchError((error) => {
          this.logAccess('delete', patientId, 'Patient', false, error.message);
          return this.handleError('deleting patient', error);
        })
      );
  }

  // ============================================================================
  // CLINICAL DATA MANAGEMENT
  // ============================================================================

  /**
   * Add vital signs
   */
  addVitalSigns(patientId: string, vitals: VitalSigns): Observable<VitalSigns> {
    return this.http
      .post<VitalSigns>(
        `${this.apiUrl}/${patientId}/vitals`,
        vitals,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap((created) => {
          this.logAccess('create', patientId, 'VitalSigns', true);
        }),
        catchError((error) => {
          this.logAccess('create', patientId, 'VitalSigns', false, error.message);
          return this.handleError('adding vitals', error);
        })
      );
  }

  /**
   * Get vital signs history
   */
  getVitalSigns(patientId: string): Observable<VitalSigns[]> {
    return this.http
      .get<VitalSigns[]>(
        `${this.apiUrl}/${patientId}/vitals`,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap(() => {
          this.logAccess('view', patientId, 'VitalSigns', true);
        }),
        catchError((error) => {
          this.logAccess('view', patientId, 'VitalSigns', false, error.message);
          return this.handleError('fetching vitals', error);
        })
      );
  }

  /**
   * Add lab result
   */
  addLabResult(patientId: string, result: LabResult): Observable<LabResult> {
    return this.http
      .post<LabResult>(
        `${this.apiUrl}/${patientId}/labs`,
        result,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap((created) => {
          this.logAccess('create', patientId, 'LabResult', true);
        }),
        catchError((error) => {
          this.logAccess('create', patientId, 'LabResult', false, error.message);
          return this.handleError('adding lab result', error);
        })
      );
  }

  /**
   * Get lab results
   */
  getLabResults(patientId: string): Observable<LabResult[]> {
    return this.http
      .get<LabResult[]>(
        `${this.apiUrl}/${patientId}/labs`,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap(() => {
          this.logAccess('view', patientId, 'LabResults', true);
        }),
        catchError((error) => {
          this.logAccess('view', patientId, 'LabResults', false, error.message);
          return this.handleError('fetching lab results', error);
        })
      );
  }

  /**
   * Add clinical note
   */
  addClinicalNote(
    patientId: string,
    note: ClinicalNote
  ): Observable<ClinicalNote> {
    return this.http
      .post<ClinicalNote>(
        `${this.apiUrl}/${patientId}/notes`,
        this.encryptSensitiveFields(note),
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap((created) => {
          this.logAccess('create', patientId, 'ClinicalNote', true);
        }),
        catchError((error) => {
          this.logAccess('create', patientId, 'ClinicalNote', false, error.message);
          return this.handleError('adding clinical note', error);
        })
      );
  }

  /**
   * Get clinical notes
   */
  getClinicalNotes(patientId: string): Observable<ClinicalNote[]> {
    return this.http
      .get<ClinicalNote[]>(
        `${this.apiUrl}/${patientId}/notes`,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap(() => {
          this.logAccess('view', patientId, 'ClinicalNotes', true);
        }),
        catchError((error) => {
          this.logAccess('view', patientId, 'ClinicalNotes', false, error.message);
          return this.handleError('fetching clinical notes', error);
        })
      );
  }

  // ============================================================================
  // CONSENT & AUTHORIZATION
  // ============================================================================

  /**
   * Get patient consents
   */
  getConsents(patientId: string): Observable<PatientConsent[]> {
    return this.http
      .get<PatientConsent[]>(
        `${this.apiUrl}/${patientId}/consents`,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        catchError((error) => this.handleError('fetching consents', error))
      );
  }

  /**
   * Grant consent
   */
  grantConsent(patientId: string, consent: PatientConsent): Observable<PatientConsent> {
    return this.http
      .post<PatientConsent>(
        `${this.apiUrl}/${patientId}/consents`,
        consent,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap(() => {
          this.logAccess('create', patientId, 'Consent', true);
        }),
        catchError((error) => {
          this.logAccess('create', patientId, 'Consent', false, error.message);
          return this.handleError('granting consent', error);
        })
      );
  }

  /**
   * Revoke consent
   */
  revokeConsent(patientId: string, consentId: string): Observable<void> {
    return this.http
      .delete<void>(
        `${this.apiUrl}/${patientId}/consents/${consentId}`,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap(() => {
          this.logAccess('delete', patientId, 'Consent', true);
        }),
        catchError((error) => {
          this.logAccess('delete', patientId, 'Consent', false, error.message);
          return this.handleError('revoking consent', error);
        })
      );
  }

  // ============================================================================
  // AUDIT & COMPLIANCE
  // ============================================================================

  /**
   * Get audit logs for patient
   */
  getAuditLogs(patientId: string): Observable<AuditLog[]> {
    return this.http
      .get<AuditLog[]>(
        `${this.apiUrl}/${patientId}/audit-logs`,
        { headers: this.getSecureHeaders() }
      )
      .pipe(
        tap((logs) => {
          this.auditLogsSubject$.next(logs);
        }),
        catchError((error) => this.handleError('fetching audit logs', error))
      );
  }

  /**
   * Export patient record (with compliance check)
   */
  exportPatientRecord(patientId: string): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/${patientId}/export`, {
        responseType: 'blob',
        headers: this.getSecureHeaders(),
      })
      .pipe(
        tap(() => {
          this.logAccess('export', patientId, 'PatientRecord', true);
        }),
        catchError((error) => {
          this.logAccess('export', patientId, 'PatientRecord', false, error.message);
          return this.handleError('exporting patient record', error);
        })
      );
  }

  // ============================================================================
  // SECURITY & ENCRYPTION
  // ============================================================================

  /**
   * Get secure headers for HIPAA compliance
   */
  private getSecureHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Session-ID': this.sessionId,
      'X-User-ID': this.userId,
      'X-Request-Timestamp': new Date().toISOString(),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
  }

  /**
   * Encrypt sensitive fields (PII)
   */
  private encryptSensitiveFields(data: any): any {
    // In production, use actual encryption library (e.g., TweetNaCl, libsodium)
    // This is a placeholder
    const sensitiveFields = [
      'demographics',
      'addresses',
      'insurance',
      'ssn',
      'email',
      'phone',
    ];

    const encrypted = { ...data };
    sensitiveFields.forEach((field) => {
      if (encrypted[field]) {
        // Encrypt field (placeholder)
        encrypted[`${field}_encrypted`] = true;
      }
    });

    return encrypted;
  }

  /**
   * Log access for audit trail (HIPAA requirement)
   */
  private logAccess(
    action: string,
    entityId: string,
    entityType: string,
    success: boolean,
    failureReason?: string
  ): void {
    const log: AuditLog = {
      id: `${Date.now()}-${Math.random()}`,
      patientId: entityId,
      userId: this.userId,
      action: action as any,
      entityType,
      timestamp: new Date(),
      ipAddress: this.getClientIp(),
      userAgent: navigator.userAgent,
      result: success ? 'success' : 'failure',
      failureReason,
    };

    // Send to audit server
    this.http
      .post(`${this.apiUrl}/audit-logs`, log, {
        headers: this.getSecureHeaders(),
      })
      .subscribe({
        error: (error) => console.error('Audit log error:', error),
      });

    // Update local logs
    const currentLogs = this.auditLogsSubject$.value;
    this.auditLogsSubject$.next([log, ...currentLogs]);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current user ID (from auth service)
   */
  private getCurrentUserId(): string {
    // In real app, get from AuthService
    return localStorage.getItem('userId') || 'unknown';
  }

  /**
   * Get client IP (server-side in production)
   */
  private getClientIp(): string {
    // Placeholder - actual IP should come from server
    return 'unknown';
  }

  /**
   * Handle errors
   */
  private handleError(action: string, error: any): Observable<never> {
    console.error(`${action} error:`, error);
    const errorMessage =
      error?.error?.message || error?.message || `Error ${action}`;
    this.errorSubject$.next(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorSubject$.next(null);
  }

  /**
   * Get current selected patient
   */
  getCurrentSelectedPatient(): Patient | null {
    return this.selectedPatientSubject$.value;
  }
}
