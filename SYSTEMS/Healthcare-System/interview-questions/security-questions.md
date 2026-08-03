# Healthcare System - Security & Compliance Interview Questions

## HIPAA Compliance Questions

### Q1: How would you implement HIPAA-compliant data encryption?

**Answer:**
```typescript
// HIPAA-compliant encryption service
@Injectable({ providedIn: 'root' })
export class HIPAAEncryptionService {
  
  /**
   * AES-256 encryption for PHI (Protected Health Information)
   * Algorithm: AES-256-GCM (includes authentication)
   */
  encryptPHI(data: PatientData): EncryptedPHI {
    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(16));
    
    // Derive key from master key
    const key = this.deriveKey();
    
    // Encrypt data with AES-256-GCM
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: 'AES-256-GCM',
      timestamp: Date.now()
    };
  }

  /**
   * Decrypt PHI with integrity verification
   */
  decryptPHI(encryptedPHI: EncryptedPHI): PatientData {
    const key = this.deriveKey();
    const iv = Buffer.from(encryptedPHI.iv, 'hex');
    const authTag = Buffer.from(encryptedPHI.authTag, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    try {
      let decrypted = decipher.update(encryptedPHI.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error('Decryption failed - data may have been tampered');
    }
  }

  /**
   * Key derivation using PBKDF2
   */
  private deriveKey(): Buffer {
    const salt = process.env.ENCRYPTION_SALT;
    return crypto.pbkdf2Sync(
      process.env.MASTER_KEY,
      salt,
      100000, // Iterations
      32, // Key length
      'sha256'
    );
  }

  /**
   * Hash sensitive data for database storage
   */
  hashPHI(data: string): string {
    return crypto
      .createHash('sha256')
      .update(data + process.env.HASH_SALT)
      .digest('hex');
  }
}

// Usage in patient service
@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private encryption: HIPAAEncryptionService) {}

  /**
   * Save patient data securely
   */
  savePatient(patient: Patient): Observable<void> {
    // Encrypt sensitive fields
    const encryptedPatient = {
      id: patient.id,
      name: this.encryption.encryptPHI({ value: patient.name }),
      ssn: this.encryption.hashPHI(patient.ssn), // Only hash, don't store decrypted
      medicalHistory: this.encryption.encryptPHI(patient.medicalHistory)
    };

    return this.http.post('/api/patients', encryptedPatient);
  }

  /**
   * Retrieve and decrypt patient data
   */
  getPatient(patientId: string): Observable<Patient> {
    return this.http.get<any>(`/api/patients/${patientId}`).pipe(
      map(encryptedPatient => ({
        id: encryptedPatient.id,
        name: this.encryption.decryptPHI(encryptedPatient.name).value,
        medicalHistory: this.encryption.decryptPHI(encryptedPatient.medicalHistory)
      }))
    );
  }
}
```

---

### Q2: How do you implement role-based access control (RBAC) for healthcare?

**Answer:**
```typescript
// RBAC service for healthcare roles
@Injectable({ providedIn: 'root' })
export class HealthcareRBACService {
  
  // Define healthcare roles
  private readonly ROLES = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    ADMIN: 'admin',
    BILLING: 'billing',
    AUDIT: 'audit'
  };

  // Define permissions per role
  private rolePermissions = {
    [this.ROLES.PATIENT]: [
      'view_own_records',
      'view_appointments',
      'book_appointment',
      'send_message_to_doctor'
    ],
    [this.ROLES.DOCTOR]: [
      'view_patient_records',
      'create_prescription',
      'update_patient_notes',
      'view_all_appointments',
      'send_messages'
    ],
    [this.ROLES.NURSE]: [
      'view_patient_records',
      'update_vitals',
      'view_appointments',
      'send_messages'
    ],
    [this.ROLES.ADMIN]: [
      'manage_users',
      'manage_roles',
      'audit_logs',
      'system_settings'
    ],
    [this.ROLES.BILLING]: [
      'view_invoices',
      'process_payments',
      'insurance_claims'
    ],
    [this.ROLES.AUDIT]: [
      'view_audit_logs',
      'generate_compliance_reports'
    ]
  };

  constructor(private auth: AuthService) {}

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): Observable<boolean> {
    return this.auth.getUserRole().pipe(
      map(role => {
        const permissions = this.rolePermissions[role] || [];
        return permissions.includes(permission);
      })
    );
  }

  /**
   * Check multiple permissions (AND logic)
   */
  hasAllPermissions(permissions: string[]): Observable<boolean> {
    return this.auth.getUserRole().pipe(
      map(role => {
        const rolePermissions = this.rolePermissions[role] || [];
        return permissions.every(p => rolePermissions.includes(p));
      })
    );
  }

  /**
   * Check multiple permissions (OR logic)
   */
  hasAnyPermission(permissions: string[]): Observable<boolean> {
    return this.auth.getUserRole().pipe(
      map(role => {
        const rolePermissions = this.rolePermissions[role] || [];
        return permissions.some(p => rolePermissions.includes(p));
      })
    );
  }

  /**
   * Get allowed fields for current user
   */
  getAllowedFields(dataType: string): Observable<string[]> {
    return this.auth.getUserRole().pipe(
      map(role => this.getFieldRestrictions(role, dataType))
    );
  }

  private getFieldRestrictions(role: string, dataType: string): string[] {
    const fieldRestrictions: any = {
      patient_record: {
        [this.ROLES.PATIENT]: ['name', 'phone', 'email', 'address'],
        [this.ROLES.DOCTOR]: ['name', 'dob', 'gender', 'medical_history', 'allergies', 'current_medications'],
        [this.ROLES.NURSE]: ['vitals', 'notes', 'temperature'],
        [this.ROLES.ADMIN]: ['*'], // All fields
        [this.ROLES.AUDIT]: ['*']
      }
    };

    return fieldRestrictions[dataType]?.[role] || [];
  }
}

// Guard decorator for permission checking
export function RequirePermission(permission: string) {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const rbac = inject(HealthcareRBACService);
      rbac.hasPermission(permission).pipe(
        tap(hasPermission => {
          if (!hasPermission) {
            throw new Error(`Permission denied: ${permission}`);
          }
        })
      ).subscribe();

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// Usage in component
@Component({
  selector: 'app-patient-details'
})
export class PatientDetailsComponent implements OnInit {
  canEditPatient$: Observable<boolean>;
  canViewMedicalHistory$: Observable<boolean>;
  allowedFields$: Observable<string[]>;

  constructor(private rbac: HealthcareRBACService) {}

  ngOnInit() {
    this.canEditPatient$ = this.rbac.hasPermission('update_patient_notes');
    this.canViewMedicalHistory$ = this.rbac.hasPermission('view_medical_history');
    this.allowedFields$ = this.rbac.getAllowedFields('patient_record');
  }
}
```

---

### Q3: How do you implement audit logging for HIPAA compliance?

**Answer:**
```typescript
// Audit logging service for HIPAA compliance
@Injectable({ providedIn: 'root' })
export class AuditLoggingService {
  
  private auditLog$ = new Subject<AuditLog>();

  constructor(private http: HttpClient) {
    // Send audit logs to secure server immediately
    this.auditLog$.pipe(
      tap(log => this.sendAuditLog(log))
    ).subscribe();
  }

  /**
   * Log access to PHI
   */
  logPHIAccess(
    userId: string,
    patientId: string,
    action: string,
    result: 'success' | 'failure'
  ): void {
    const auditLog: AuditLog = {
      timestamp: new Date(),
      userId,
      userRole: this.getCurrentUserRole(),
      patientId,
      action,
      result,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      eventType: 'PHI_ACCESS',
      details: {
        fieldsAccessed: this.getAccessedFields(),
        duration: this.getSessionDuration()
      }
    };

    this.auditLog$.next(auditLog);
  }

  /**
   * Log data modifications
   */
  logDataModification(
    userId: string,
    patientId: string,
    fieldName: string,
    oldValue: any,
    newValue: any
  ): void {
    const auditLog: AuditLog = {
      timestamp: new Date(),
      userId,
      userRole: this.getCurrentUserRole(),
      patientId,
      action: 'DATA_MODIFICATION',
      result: 'success',
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      eventType: 'MODIFICATION',
      details: {
        fieldName,
        oldValue: this.maskSensitiveData(oldValue),
        newValue: this.maskSensitiveData(newValue),
        changeTimestamp: new Date()
      }
    };

    this.auditLog$.next(auditLog);
  }

  /**
   * Log authentication events
   */
  logAuthenticationEvent(
    userId: string,
    eventType: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN',
    result: 'success' | 'failure'
  ): void {
    const auditLog: AuditLog = {
      timestamp: new Date(),
      userId,
      userRole: this.getCurrentUserRole(),
      action: eventType,
      result,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      eventType: 'AUTHENTICATION',
      details: {
        loginMethod: 'MFA', // Multi-factor authentication
        deviceFingerprint: this.getDeviceFingerprint()
      }
    };

    this.auditLog$.next(auditLog);
  }

  /**
   * Log security events
   */
  logSecurityEvent(
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string
  ): void {
    const auditLog: AuditLog = {
      timestamp: new Date(),
      userId: 'SYSTEM',
      action: eventType,
      result: 'success',
      ipAddress: 'INTERNAL',
      userAgent: 'SYSTEM',
      eventType: 'SECURITY',
      details: {
        severity,
        description,
        alertSent: severity !== 'low'
      }
    };

    this.auditLog$.next(auditLog);

    // Alert security team for high/critical events
    if (severity === 'high' || severity === 'critical') {
      this.alertSecurityTeam(auditLog);
    }
  }

  /**
   * Send audit log to server securely
   */
  private sendAuditLog(log: AuditLog): void {
    // Never include sensitive patient data in logs
    const sanitizedLog = {
      ...log,
      patientId: this.hashPatientId(log.patientId),
      details: {
        ...log.details,
        fieldsAccessed: this.maskFieldNames(log.details?.fieldsAccessed)
      }
    };

    // Send with encryption
    this.http.post('/api/audit/log', sanitizedLog, {
      headers: {
        'X-Audit-Signature': this.signAuditLog(sanitizedLog)
      }
    }).subscribe({
      error: (err) => {
        console.error('Failed to send audit log', err);
        // Store locally and retry later
        this.storeLocalAuditLog(sanitizedLog);
      }
    });
  }

  /**
   * Retrieve audit logs for compliance reporting
   */
  getAuditLogs(
    filters: AuditLogFilters
  ): Observable<AuditLog[]> {
    return this.http.post<AuditLog[]>(
      '/api/audit/logs/search',
      filters,
      {
        headers: {
          'X-Audit-Report-Request': 'true'
        }
      }
    ).pipe(
      tap(logs => {
        // Log the audit log retrieval itself
        this.logPHIAccess(
          this.getCurrentUserId(),
          'N/A',
          'AUDIT_LOG_RETRIEVAL',
          'success'
        );
      })
    );
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): Observable<ComplianceReport> {
    return this.http.post<ComplianceReport>(
      '/api/audit/compliance-report',
      { startDate, endDate }
    );
  }

  // Helper methods
  private maskSensitiveData(value: any): string {
    if (typeof value !== 'string') return '[REDACTED]';
    return value.substring(0, 2) + '***' + value.substring(value.length - 2);
  }

  private maskFieldNames(fields: string[] | undefined): string[] {
    return fields?.map(f => f.replace(/[a-z]/gi, '*')) || [];
  }

  private hashPatientId(patientId: string): string {
    return crypto.createHash('sha256').update(patientId).digest('hex');
  }

  private signAuditLog(log: any): string {
    // HMAC signature for integrity verification
    return crypto
      .createHmac('sha256', process.env.AUDIT_LOG_SECRET || '')
      .update(JSON.stringify(log))
      .digest('hex');
  }

  private getCurrentUserRole(): string { /* ... */ return 'doctor'; }
  private getCurrentUserId(): string { /* ... */ return 'user123'; }
  private getClientIP(): string { /* ... */ return '192.168.1.1'; }
  private getAccessedFields(): string[] { /* ... */ return []; }
  private getSessionDuration(): number { /* ... */ return 0; }
  private getDeviceFingerprint(): string { /* ... */ return ''; }
  private storeLocalAuditLog(log: any): void { /* ... */ }
  private alertSecurityTeam(log: any): void { /* ... */ }
}

// Interface for audit log
interface AuditLog {
  timestamp: Date;
  userId: string;
  userRole: string;
  patientId?: string;
  action: string;
  result: 'success' | 'failure';
  ipAddress: string;
  userAgent: string;
  eventType: string;
  details?: any;
}

interface AuditLogFilters {
  userId?: string;
  patientId?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  result?: 'success' | 'failure';
}

interface ComplianceReport {
  period: { start: Date; end: Date };
  totalAccesses: number;
  uniqueUsers: number;
  failedAttempts: number;
  anomalies: any[];
  recommendations: string[];
}
```

---

### Q4: How do you handle data breach response in HIPAA?

**Answer:**
```typescript
// Data breach response service
@Injectable({ providedIn: 'root' })
export class DataBreachResponseService {
  
  /**
   * Immediate response to suspected breach
   */
  respondToSuspectedBreach(
    breachDetails: BreachDetails
  ): Observable<BreachResponse> {
    return new Observable(observer => {
      // Step 1: Immediate containment
      this.containBreach(breachDetails).subscribe(() => {
        // Step 2: Assess scope
        this.assessBreachScope(breachDetails).subscribe(scope => {
          // Step 3: Notify stakeholders
          this.notifyStakeholders(breachDetails, scope).subscribe(() => {
            // Step 4: Investigate
            this.investigateBreach(breachDetails).subscribe(investigation => {
              // Step 5: Document
              const response: BreachResponse = {
                breachId: this.generateBreachId(),
                discoveredDate: new Date(),
                containedDate: new Date(),
                scope,
                investigation,
                notifications: this.getNotificationStatus(),
                affectedIndividuals: scope.affectedCount,
                reportingDeadline: this.calculateReportingDeadline()
              };

              observer.next(response);
              observer.complete();
            });
          });
        });
      });
    });
  }

  /**
   * Contain the breach immediately
   */
  private containBreach(breachDetails: BreachDetails): Observable<void> {
    return new Observable(observer => {
      // 1. Isolate affected systems
      this.isolateAffectedSystems(breachDetails.affectedSystems);

      // 2. Revoke compromised credentials
      this.revokeCredentials(breachDetails.compromisedUsers);

      // 3. Block suspicious access
      this.blockSuspiciousAccess(breachDetails.suspiciousIPs);

      // 4. Enable enhanced monitoring
      this.enableEnhancedMonitoring();

      observer.next();
      observer.complete();
    });
  }

  /**
   * Assess the scope of the breach
   */
  private assessBreachScope(
    breachDetails: BreachDetails
  ): Observable<BreachScope> {
    return this.http.post<BreachScope>(
      '/api/security/breach-assessment',
      breachDetails
    ).pipe(
      tap(scope => {
        console.log(`Breach scope: ${scope.affectedCount} individuals`);
        
        // Notify if more than 500 individuals affected
        if (scope.affectedCount > 500) {
          this.notifyMediaAndPublic(scope);
        }
      })
    );
  }

  /**
   * Notify affected individuals
   * HIPAA requires notification within 60 days
   */
  private notifyStakeholders(
    breachDetails: BreachDetails,
    scope: BreachScope
  ): Observable<void> {
    const notifications: any[] = [];

    // Notify affected individuals
    notifications.push(
      this.notifyAffectedIndividuals(scope.affectedIndividuals)
    );

    // Notify media (if more than 500)
    if (scope.affectedCount > 500) {
      notifications.push(
        this.notifyMedia(breachDetails, scope)
      );
    }

    // Notify HHS (Department of Health and Human Services)
    notifications.push(
      this.notifyHHS(breachDetails, scope)
    );

    // Notify business associates
    notifications.push(
      this.notifyBusinessAssociates(breachDetails, scope)
    );

    return forkJoin(notifications).pipe(map(() => void 0));
  }

  /**
   * Investigate the breach
   */
  private investigateBreach(
    breachDetails: BreachDetails
  ): Observable<BreachInvestigation> {
    return new Observable(observer => {
      const investigation: BreachInvestigation = {
        startDate: new Date(),
        rootCause: '',
        affectedDataTypes: [],
        timeline: [],
        recommendations: []
      };

      // Collect evidence
      this.collectEvidence(breachDetails).subscribe(evidence => {
        investigation.evidence = evidence;

        // Determine root cause
        this.analyzeEvidence(evidence).subscribe(analysis => {
          investigation.rootCause = analysis.rootCause;
          investigation.timeline = analysis.timeline;

          // Generate recommendations
          investigation.recommendations = this.generateRemediationPlan(analysis);

          observer.next(investigation);
          observer.complete();
        });
      });
    });
  }

  /**
   * Generate breach notification letter
   */
  private generateNotificationLetter(
    individual: string,
    breachDetails: BreachDetails,
    scope: BreachScope
  ): string {
    return `
Dear ${individual},

We are writing to inform you of a security incident that may have affected your personal health information.

INCIDENT DETAILS:
- Date of Breach: ${breachDetails.breachDate}
- Date Discovered: ${new Date()}
- Type of Information Affected: ${scope.dataTypesAffected.join(', ')}

STEPS WE HAVE TAKEN:
- Immediately secured the affected systems
- Began investigating the incident
- Are implementing additional security measures

YOUR RIGHTS:
- Right to access your medical records
- Right to request correction of information
- Right to request restriction of use
- Right to request alternative notification

For more information, please contact:
Privacy Officer: privacy@healthcare.com
Phone: 1-800-XXX-XXXX

Sincerely,
Healthcare Organization
    `;
  }

  private isolateAffectedSystems(systems: string[]): void { /* ... */ }
  private revokeCredentials(users: string[]): void { /* ... */ }
  private blockSuspiciousAccess(ips: string[]): void { /* ... */ }
  private enableEnhancedMonitoring(): void { /* ... */ }
  private notifyAffectedIndividuals(individuals: string[]): Observable<void> { return of(void 0); }
  private notifyMedia(details: BreachDetails, scope: BreachScope): Observable<void> { return of(void 0); }
  private notifyHHS(details: BreachDetails, scope: BreachScope): Observable<void> { return of(void 0); }
  private notifyBusinessAssociates(details: BreachDetails, scope: BreachScope): Observable<void> { return of(void 0); }
  private notifyMediaAndPublic(scope: BreachScope): void { /* ... */ }
  private collectEvidence(details: BreachDetails): Observable<any> { return of({}); }
  private analyzeEvidence(evidence: any): Observable<any> { return of({}); }
  private generateRemediationPlan(analysis: any): string[] { return []; }
  private generateBreachId(): string { return 'BR_' + Date.now(); }
  private calculateReportingDeadline(): Date {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 60);
    return deadline;
  }
  private getNotificationStatus(): any { return {}; }
}

// Interfaces
interface BreachDetails {
  breachDate: Date;
  affectedSystems: string[];
  compromisedUsers: string[];
  suspiciousIPs: string[];
}

interface BreachScope {
  affectedCount: number;
  affectedIndividuals: string[];
  dataTypesAffected: string[];
}

interface BreachInvestigation {
  startDate: Date;
  rootCause: string;
  affectedDataTypes: string[];
  timeline: any[];
  recommendations: string[];
  evidence?: any;
}

interface BreachResponse {
  breachId: string;
  discoveredDate: Date;
  containedDate: Date;
  scope: BreachScope;
  investigation: BreachInvestigation;
  notifications: any;
  affectedIndividuals: number;
  reportingDeadline: Date;
}
```

This comprehensive approach ensures HIPAA compliance and proper incident response procedures.
