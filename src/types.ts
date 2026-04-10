export type UserRole = 'parent' | 'provider' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
}

export type RouteStatus = 'Open' | 'Forming' | 'Covered' | 'Waitlist' | 'Paused' | 'Hidden';
export type RouteVisibility = 'Public' | 'Moderated' | 'Private';

export interface Route {
  id: string;
  school: string;
  pickupNeighborhood: string;
  timing: 'morning' | 'afternoon' | 'both';
  daysOfWeek: string[];
  numStudents: number;
  currentMethod: string;
  painPoint: string;
  desiredOptions: string[];
  budgetRange: string;
  status: RouteStatus;
  visibility: RouteVisibility;
  createdBy: string;
  createdAt: string;
  miamiOnly: boolean;
  activityType: 'school' | 'extracurricular';
  carSeatRequired: boolean;
  specialNeeds: boolean;
  requirementsNote: string;
}

export interface WaitlistRequest {
  id: string;
  email: string;
  county: 'West Palm' | 'Broward' | 'Other';
  note?: string;
  createdAt: string;
}

export interface ProviderProfile {
  userId: string;
  providerType: 'private_bus' | 'independent_driver' | 'carpool_parent';
  serviceAreas: string[];
  capacity: number;
  timingWindows: string[];
  vettingStatus: 'pending' | 'vetted' | 'rejected';
  insuranceNotes?: string;
  transitCompatible: boolean;
}

export interface RouteInterest {
  id: string;
  routeId: string;
  userId: string;
  offerType: string;
  capacityNote: string;
  status: 'Pending' | 'Reviewed' | 'Activated' | 'Declined';
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  routeId: string;
  date: string;
  mode: string;
  providerId: string;
  cost: number;
  parentConfirmed: boolean;
  notes: string;
  reimbursementTags: string[];
}
