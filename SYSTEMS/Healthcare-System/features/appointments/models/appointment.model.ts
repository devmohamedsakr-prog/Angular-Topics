/**
 * Appointment Models - Healthcare System
 * Scheduling, availability, and appointment management
 */

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  VACCINATION = 'vaccination',
  LAB_TEST = 'lab_test',
  TELEHEALTH = 'telehealth',
}

/**
 * Provider schedule/availability
 */
export interface ProviderAvailability {
  providerId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:MM
  endTime: string;
  slotDuration: number; // minutes
  maxPatientsPerSlot: number;
  isAvailable: boolean;
}

/**
 * Appointment slot
 */
export interface AppointmentSlot {
  id: string;
  providerId: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  booked: number;
  isAvailable: boolean;
  type: AppointmentType;
}

/**
 * Appointment
 */
export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  startTime: Date;
  endTime: Date;
  location: string;
  room?: string;
  notes?: string;
  reasonForVisit?: string;
  telehealth: boolean;
  meetingUrl?: string;
  reminders: AppointmentReminder[];
  createdAt: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

/**
 * Appointment reminder
 */
export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  reminderType: 'email' | 'sms' | 'push';
  minutesBefore: number; // Send before appointment
  sent: boolean;
  sentAt?: Date;
}

/**
 * Appointment slot request
 */
export interface SlotRequest {
  patientId: string;
  providerId?: string;
  appointmentType: AppointmentType;
  preferredDate: Date;
  preferredTime?: string;
  duration: number; // minutes
  maxResultsToReturn?: number;
}

/**
 * Appointment state
 */
export interface AppointmentState {
  appointments: Appointment[];
  availableSlots: AppointmentSlot[];
  selectedSlot: AppointmentSlot | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: AppointmentStatus;
    type?: AppointmentType;
    startDate?: Date;
    endDate?: Date;
  };
}
