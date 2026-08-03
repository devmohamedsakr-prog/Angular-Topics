/**
 * Patient Models - Healthcare System
 * HIPAA-compliant interfaces for patient data management
 */

/**
 * Patient demographics
 */
export interface PatientDemographics {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'M' | 'F' | 'Other';
  email: string;
  phone: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

/**
 * Patient address
 */
export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: 'home' | 'work' | 'other';
}

/**
 * Insurance information
 */
export interface InsuranceInfo {
  id: string;
  provider: string;
  memberId: string;
  groupNumber: string;
  copay: number;
  deductible: number;
  maxOutOfPocket: number;
  isPrimary: boolean;
  effectiveDate: Date;
  terminationDate?: Date;
}

/**
 * Medical history
 */
export interface MedicalHistory {
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
  surgeries: Surgery[];
  vaccinationRecords: Vaccination[];
}

/**
 * Condition
 */
export interface Condition {
  id: string;
  icdCode: string;
  name: string;
  diagnosisDate: Date;
  status: 'active' | 'inactive' | 'resolved';
  notes?: string;
}

/**
 * Medication
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: Date;
  endDate?: Date;
  prescriber: string;
  indication?: string;
  sideEffects?: string[];
}

/**
 * Allergy
 */
export interface Allergy {
  id: string;
  allergen: string;
  allergyType: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  recordedDate: Date;
}

/**
 * Surgery record
 */
export interface Surgery {
  id: string;
  name: string;
  date: Date;
  surgeon: string;
  facility: string;
  notes?: string;
}

/**
 * Vaccination record
 */
export interface Vaccination {
  id: string;
  vaccine: string;
  date: Date;
  lot: string;
  nextDue?: Date;
}

/**
 * Patient vital signs
 */
export interface VitalSigns {
  temperature: number;
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  recordedAt: Date;
  recordedBy: string;
}

/**
 * Lab result
 */
export interface LabResult {
  id: string;
  testName: string;
  value: number | string;
  unit: string;
  referenceRange: string;
  resultDate: Date;
  status: 'normal' | 'abnormal' | 'pending';
  notes?: string;
}

/**
 * Clinical note
 */
export interface ClinicalNote {
  id: string;
  type: 'progress' | 'consultation' | 'discharge' | 'procedure';
  date: Date;
  provider: string;
  content: string;
  assessment?: string;
  plan?: string;
  signed: boolean;
  signedAt?: Date;
}

/**
 * Patient record (main entity)
 */
export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  demographics: PatientDemographics;
  addresses: PatientAddress[];
  insurance: InsuranceInfo[];
  medicalHistory: MedicalHistory;
  vitalSigns: VitalSigns[];
  labResults: LabResult[];
  clinicalNotes: ClinicalNote[];
  providers: string[]; // Provider IDs
  status: 'active' | 'inactive' | 'deceased';
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
  consentToTreat: boolean;
  privacyAgreement: boolean;
}

/**
 * Audit log for HIPAA compliance
 */
export interface AuditLog {
  id: string;
  patientId: string;
  userId: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'export';
  entityType: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  changes?: Record<string, any>;
  result: 'success' | 'failure';
  failureReason?: string;
}

/**
 * Encryption metadata for sensitive fields
 */
export interface EncryptedField {
  fieldName: string;
  isEncrypted: boolean;
  encryptionKey: string;
  encryptedAt: Date;
}

/**
 * Patient consent
 */
export interface PatientConsent {
  id: string;
  patientId: string;
  type: 'treatment' | 'privacy' | 'research' | 'disclosure';
  grantedDate: Date;
  expirationDate?: Date;
  status: 'granted' | 'revoked';
  scope: string[];
}

/**
 * Patient state
 */
export interface PatientState {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  auditLogs: AuditLog[];
  searchResults: Patient[];
}
