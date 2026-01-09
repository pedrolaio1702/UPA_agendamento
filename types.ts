
export interface Location {
  state: string;
  cities: string[];
}

export interface UPA {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  specialties: string[];
  waitingTime: string; // "Baixo", "Médio", "Alto"
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  cpf: string;
  email: string;
  phone: string;
  upaId: string;
  upaName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'canceled' | 'completed';
  notificationChannel: 'sms' | 'whatsapp' | 'both';
  rating?: number;
  comment?: string;
}

export enum Step {
  CONSENT = 0,
  LOCATION = 1,
  UPA_SELECTION = 2,
  SPECIALTY_TIME = 3,
  PATIENT_INFO = 4,
  CONFIRMATION = 5
}

export type AdminRole = 'GLOBAL' | 'STATE' | 'UPA';

export interface AdminUser {
  role: AdminRole;
  state?: string;
  upaId?: string;
}
