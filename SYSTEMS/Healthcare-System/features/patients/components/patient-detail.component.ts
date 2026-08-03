/**
 * Patient Detail Component - Healthcare System
 * HIPAA-compliant patient record display
 */

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  Subject,
  BehaviorSubject,
} from 'rxjs';
import {
  takeUntil,
  switchMap,
  shareReplay,
  tap,
} from 'rxjs/operators';
import { PatientService } from '../services/patient.service';
import {
  Patient,
  VitalSigns,
  LabResult,
  ClinicalNote,
  AuditLog,
} from '../models/patient.model';

/**
 * Patient detail component
 */
@Component({
  selector: 'app-patient-detail',
  template: `
    <div class="patient-detail-container">
      <!-- Header -->
      <header class="patient-header" *ngIf="patient$ | async as patient">
        <div class="patient-info">
          <h1>{{ patient.demographics.firstName }}
              {{ patient.demographics.lastName }}</h1>
          <p class="mrn">MRN: {{ patient.mrn }}</p>
          <p class="age">
            Age: {{ getAge(patient.demographics.dateOfBirth) }} years old
          </p>
        </div>
        <div class="patient-actions">
          <button class="btn btn-primary" (click)="editPatient()">
            ✏️ Edit
          </button>
          <button class="btn btn-secondary" (click)="downloadRecord()">
            📥 Download Record
          </button>
        </div>
      </header>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" 
                [class.active]="activeTab === 'overview'"
                (click)="activeTab = 'overview'">
          Overview
        </button>
        <button class="tab"
                [class.active]="activeTab === 'vitals'"
                (click)="activeTab = 'vitals'">
          Vital Signs
        </button>
        <button class="tab"
                [class.active]="activeTab === 'labs'"
                (click)="activeTab = 'labs'">
          Lab Results
        </button>
        <button class="tab"
                [class.active]="activeTab === 'notes'"
                (click)="activeTab = 'notes'">
          Clinical Notes
        </button>
        <button class="tab"
                [class.active]="activeTab === 'history'"
                (click)="activeTab = 'history'">
          Medical History
        </button>
        <button class="tab"
                [class.active]="activeTab === 'audit'"
                (click)="activeTab = 'audit'">
          Access Log
        </button>
      </div>

      <!-- Content Panels -->
      <main class="patient-content">
        <!-- Overview Tab -->
        <section *ngIf="activeTab === 'overview'" class="tab-content">
          <div *ngIf="patient$ | async as patient" class="overview">
            <!-- Demographics -->
            <div class="section">
              <h2>Demographics</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Date of Birth:</span>
                  <span>{{ patient.demographics.dateOfBirth | date: 'MMM dd, yyyy' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Gender:</span>
                  <span>{{ patient.demographics.gender }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Email:</span>
                  <span>{{ patient.demographics.email }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Phone:</span>
                  <span>{{ patient.demographics.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Contact Address -->
            <div class="section">
              <h2>Address</h2>
              <div *ngFor="let addr of patient.addresses" class="address">
                <p><strong>{{ addr.addressType | titlecase }}:</strong></p>
                <p>{{ addr.street }}</p>
                <p>{{ addr.city }}, {{ addr.state }} {{ addr.zipCode }}</p>
              </div>
            </div>

            <!-- Insurance -->
            <div class="section">
              <h2>Insurance</h2>
              <div *ngFor="let insurance of patient.insurance" class="insurance">
                <p><strong>Provider:</strong> {{ insurance.provider }}</p>
                <p><strong>Member ID:</strong> {{ insurance.memberId }}</p>
                <p><strong>Group:</strong> {{ insurance.groupNumber }}</p>
                <p><strong>Copay:</strong> ${{ insurance.copay }}</p>
                <p><strong>Deductible:</strong> ${{ insurance.deductible }}</p>
              </div>
            </div>

            <!-- Emergency Contact -->
            <div class="section" *ngIf="patient.demographics.emergencyContact">
              <h2>Emergency Contact</h2>
              <p>
                <strong>{{ patient.demographics.emergencyContact.name }}</strong>
                ({{ patient.demographics.emergencyContact.relationship }})
              </p>
              <p>{{ patient.demographics.emergencyContact.phone }}</p>
            </div>

            <!-- Status -->
            <div class="section">
              <h2>Status</h2>
              <p class="status" [class]="patient.status">
                {{ patient.status | titlecase }}
              </p>
            </div>
          </div>
        </section>

        <!-- Vital Signs Tab -->
        <section *ngIf="activeTab === 'vitals'" class="tab-content">
          <div class="section-header">
            <h2>Vital Signs</h2>
            <button class="btn btn-small" (click)="addVitals()">+ Add</button>
          </div>

          <div *ngIf="(vitalSigns$ | async) as vitals" class="vitals-list">
            <div *ngIf="vitals.length > 0; else noVitals" class="vital-records">
              <div *ngFor="let vital of vitals.slice(0, 10)" class="vital-card">
                <p class="recorded">{{ vital.recordedAt | date: 'MMM dd, yyyy HH:mm' }}</p>
                <div class="vital-grid">
                  <div class="vital-item">
                    <span class="value">{{ vital.temperature }}°C</span>
                    <span class="label">Temperature</span>
                  </div>
                  <div class="vital-item">
                    <span class="value">{{ vital.systolicBP }}/{{ vital.diastolicBP }}</span>
                    <span class="label">BP</span>
                  </div>
                  <div class="vital-item">
                    <span class="value">{{ vital.heartRate }}</span>
                    <span class="label">HR</span>
                  </div>
                  <div class="vital-item">
                    <span class="value">{{ vital.respiratoryRate }}</span>
                    <span class="label">RR</span>
                  </div>
                  <div class="vital-item">
                    <span class="value">{{ vital.oxygenSaturation }}%</span>
                    <span class="label">O2</span>
                  </div>
                </div>
              </div>
            </div>
            <ng-template #noVitals>
              <p class="empty-state">No vital signs recorded</p>
            </ng-template>
          </div>
        </section>

        <!-- Lab Results Tab -->
        <section *ngIf="activeTab === 'labs'" class="tab-content">
          <div class="section-header">
            <h2>Lab Results</h2>
            <button class="btn btn-small" (click)="addLabResult()">+ Add</button>
          </div>

          <div *ngIf="(labResults$ | async) as labs" class="labs-list">
            <div *ngIf="labs.length > 0; else noLabs" class="table-responsive">
              <table class="results-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let lab of labs" [class]="lab.status">
                    <td>{{ lab.testName }}</td>
                    <td class="value">{{ lab.value }}</td>
                    <td>{{ lab.unit }}</td>
                    <td class="reference">{{ lab.referenceRange }}</td>
                    <td>
                      <span class="status-badge" [class]="lab.status">
                        {{ lab.status | titlecase }}
                      </span>
                    </td>
                    <td>{{ lab.resultDate | date: 'MMM dd' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ng-template #noLabs>
              <p class="empty-state">No lab results available</p>
            </ng-template>
          </div>
        </section>

        <!-- Clinical Notes Tab -->
        <section *ngIf="activeTab === 'notes'" class="tab-content">
          <div class="section-header">
            <h2>Clinical Notes</h2>
            <button class="btn btn-small" (click)="addNote()">+ Add Note</button>
          </div>

          <div *ngIf="(clinicalNotes$ | async) as notes" class="notes-list">
            <div *ngIf="notes.length > 0; else noNotes" class="note-items">
              <div *ngFor="let note of notes" class="note-card">
                <div class="note-header">
                  <h3>{{ note.type | titlecase }}</h3>
                  <span class="date">{{ note.date | date: 'MMM dd, yyyy' }}</span>
                  <span *ngIf="note.signed" class="signed">✓ Signed</span>
                </div>
                <p class="provider">By: {{ note.provider }}</p>
                <div class="note-content">
                  <p>{{ note.content }}</p>
                  <p *ngIf="note.assessment"><strong>Assessment:</strong> {{ note.assessment }}</p>
                  <p *ngIf="note.plan"><strong>Plan:</strong> {{ note.plan }}</p>
                </div>
              </div>
            </div>
            <ng-template #noNotes>
              <p class="empty-state">No clinical notes</p>
            </ng-template>
          </div>
        </section>

        <!-- Medical History Tab -->
        <section *ngIf="activeTab === 'history'" class="tab-content">
          <div *ngIf="patient$ | async as patient" class="medical-history">
            <!-- Active Conditions -->
            <div class="section">
              <h2>Active Conditions</h2>
              <div *ngFor="let condition of patient.medicalHistory.conditions" 
                   class="list-item">
                <strong>{{ condition.name }}</strong>
                <p>Since: {{ condition.diagnosisDate | date: 'MMM yyyy' }}</p>
              </div>
            </div>

            <!-- Current Medications -->
            <div class="section">
              <h2>Current Medications</h2>
              <div *ngFor="let med of patient.medicalHistory.medications"
                   [hidden]="med.endDate"
                   class="list-item">
                <strong>{{ med.name }}</strong>
                <p>{{ med.dosage }} - {{ med.frequency }}</p>
              </div>
            </div>

            <!-- Allergies -->
            <div class="section">
              <h2>Allergies</h2>
              <div *ngFor="let allergy of patient.medicalHistory.allergies"
                   class="list-item"
                   [class]="'severity-' + allergy.severity">
                <strong>{{ allergy.allergen }}</strong>
                <p>Reaction: {{ allergy.reaction }}</p>
              </div>
            </div>

            <!-- Past Surgeries -->
            <div class="section">
              <h2>Past Surgeries</h2>
              <div *ngFor="let surgery of patient.medicalHistory.surgeries"
                   class="list-item">
                <strong>{{ surgery.name }}</strong>
                <p>{{ surgery.date | date: 'MMM yyyy' }} - {{ surgery.surgeon }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Audit Log Tab -->
        <section *ngIf="activeTab === 'audit'" class="tab-content">
          <h2>Access & Modification Log</h2>
          <p class="info-text">This log shows all access to this patient's record (HIPAA compliance)</p>

          <div *ngIf="(auditLogs$ | async) as logs" class="audit-list">
            <div *ngIf="logs.length > 0; else noLogs" class="audit-table">
              <div *ngFor="let log of logs" class="audit-row" [class.failure]="log.result === 'failure'">
                <span class="action" [class]="log.action">{{ log.action | titlecase }}</span>
                <span class="user">{{ log.userId }}</span>
                <span class="timestamp">{{ log.timestamp | date: 'short' }}</span>
                <span class="result" [class]="log.result">
                  {{ log.result | titlecase }}
                </span>
              </div>
            </div>
            <ng-template #noLogs>
              <p class="empty-state">No access logs</p>
            </ng-template>
          </div>
        </section>
      </main>

      <!-- Error Banner -->
      <div *ngIf="(error$ | async) as error" class="error-banner">
        <p>{{ error }}</p>
        <button (click)="dismissError()" class="close-btn">×</button>
      </div>
    </div>
  `,
  styles: [
    `
      .patient-detail-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;
      }

      .patient-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 32px;
        padding-bottom: 16px;
        border-bottom: 2px solid #eee;
      }

      .patient-info h1 {
        margin: 0 0 8px 0;
        font-size: 28px;
      }

      .mrn,
      .age {
        margin: 4px 0;
        color: #666;
        font-size: 14px;
      }

      .patient-actions {
        display: flex;
        gap: 8px;
      }

      .tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 1px solid #eee;
        overflow-x: auto;
      }

      .tab {
        padding: 12px 16px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 600;
        color: #666;
        white-space: nowrap;
      }

      .tab.active {
        color: #007bff;
        border-bottom-color: #007bff;
      }

      .patient-content {
        display: flex;
        flex-direction: column;
      }

      .tab-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .section {
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 16px;
      }

      .section h2 {
        margin: 0 0 12px 0;
        font-size: 18px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .label {
        font-weight: 600;
        color: #666;
        font-size: 12px;
      }

      .vital-cards,
      .note-items {
        display: grid;
        gap: 12px;
      }

      .vital-card,
      .note-card {
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 12px;
      }

      .vital-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
        gap: 12px;
        margin-top: 12px;
      }

      .vital-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .vital-item .value {
        font-size: 18px;
        font-weight: 700;
        color: #007bff;
      }

      .vital-item .label {
        font-size: 11px;
      }

      .status-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 600;
      }

      .status-badge.normal {
        background: #d4edda;
        color: #155724;
      }

      .status-badge.abnormal {
        background: #f8d7da;
        color: #721c24;
      }

      .status-badge.pending {
        background: #fff3cd;
        color: #856404;
      }

      .results-table {
        width: 100%;
        border-collapse: collapse;
      }

      .results-table th {
        text-align: left;
        padding: 12px;
        border-bottom: 2px solid #eee;
        font-weight: 600;
      }

      .results-table td {
        padding: 12px;
        border-bottom: 1px solid #eee;
      }

      .note-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .note-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .date,
      .signed {
        font-size: 12px;
        color: #666;
      }

      .signed {
        color: #28a745;
        font-weight: 600;
      }

      .note-content {
        margin-top: 8px;
        font-size: 14px;
        color: #333;
      }

      .audit-row {
        display: grid;
        grid-template-columns: 100px 150px 150px 100px;
        gap: 12px;
        padding: 12px;
        border-bottom: 1px solid #eee;
      }

      .audit-row.failure {
        background: #fff5f5;
      }

      .action {
        font-weight: 600;
      }

      .action.view {
        color: #007bff;
      }

      .action.create {
        color: #28a745;
      }

      .action.update {
        color: #ffc107;
      }

      .action.delete {
        color: #dc3545;
      }

      .result {
        font-weight: 600;
      }

      .result.success {
        color: #28a745;
      }

      .result.failure {
        color: #dc3545;
      }

      .empty-state {
        text-align: center;
        color: #999;
        padding: 24px;
      }

      .status {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: 600;
      }

      .status.active {
        background: #d4edda;
        color: #155724;
      }

      .status.inactive {
        background: #e2e3e5;
        color: #383d41;
      }

      .error-banner {
        background: #fff3cd;
        border: 1px solid #ffc107;
        padding: 12px 16px;
        border-radius: 4px;
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      @media (max-width: 768px) {
        .patient-header {
          flex-direction: column;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .vital-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .tabs {
          flex-wrap: wrap;
        }

        .audit-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  // Observables
  patient$: Observable<Patient>;
  vitalSigns$: Observable<VitalSigns[]>;
  labResults$: Observable<LabResult[]>;
  clinicalNotes$: Observable<ClinicalNote[]>;
  auditLogs$: Observable<AuditLog[]>;
  error$ = this.patientService.error$;

  // State
  activeTab = 'overview';
  private patientId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {
    this.patient$ = new Observable<Patient>();
    this.vitalSigns$ = new Observable<VitalSigns[]>();
    this.labResults$ = new Observable<LabResult[]>();
    this.clinicalNotes$ = new Observable<ClinicalNote[]>();
    this.auditLogs$ = new Observable<AuditLog[]>();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => {
          this.patientId = params.get('patientId');
          if (!this.patientId) throw new Error('No patient ID');
          return this.patientService.getPatient(this.patientId);
        }),
        tap((patient) => {
          if (this.patientId) {
            this.vitalSigns$ = this.patientService
              .getVitalSigns(this.patientId!)
              .pipe(shareReplay(1));
            this.labResults$ = this.patientService
              .getLabResults(this.patientId!)
              .pipe(shareReplay(1));
            this.clinicalNotes$ = this.patientService
              .getClinicalNotes(this.patientId!)
              .pipe(shareReplay(1));
            this.auditLogs$ = this.patientService
              .getAuditLogs(this.patientId!)
              .pipe(shareReplay(1));
          }
        })
      )
      .subscribe({
        next: (patient) => {
          this.patient$ = of(patient);
        },
        error: (error) => console.error('Error loading patient:', error),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Get age from date of birth
   */
  getAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - new Date(dob).getFullYear();
    const monthDiff = today.getMonth() - new Date(dob).getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < new Date(dob).getDate())
    ) {
      age--;
    }
    return age;
  }

  /**
   * Edit patient
   */
  editPatient(): void {
    // Implementation
  }

  /**
   * Download record
   */
  downloadRecord(): void {
    if (this.patientId) {
      this.patientService
        .exportPatientRecord(this.patientId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `patient-record-${this.patientId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (error) => console.error('Error downloading record:', error),
        });
    }
  }

  /**
   * Add vitals
   */
  addVitals(): void {
    // Implementation
  }

  /**
   * Add lab result
   */
  addLabResult(): void {
    // Implementation
  }

  /**
   * Add note
   */
  addNote(): void {
    // Implementation
  }

  /**
   * Dismiss error
   */
  dismissError(): void {
    this.patientService.clearError();
  }

  private of(arg0: Patient) {
    throw new Error('Method not implemented.');
  }
}
