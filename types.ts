
export type UserRole = 'owner' | 'admin' | 'trainer' | 'member' | 'client-og' | 'client-sp';

export interface GymConfig {
  id: string;
  name: string;
  slug: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  businessRules: {
    allowWaitlist: boolean;
    cancellationWindowHours: number;
    advanceBookingDays: number;
    requirePaymentUpfront: boolean;
  };
  features: {
    aiConcierge: boolean;
    analytics: boolean;
    digitalCheckIn: boolean;
  };
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  avatar: string;
  gym_id: string;
  credits: number;
}

export interface ClassSession {
  id: string;
  gym_id: string;
  date: string; // ISO Date string YYYY-MM-DD
  title: string;
  instructor: string;
  time: string;
  duration: string;
  category: 'Open Gym' | 'Semi Personal' | 'Cardio' | 'Strength' | 'Yoga' | 'Pilates';
  capacity: number;
  booked: number;
}

export interface Member {
  id: string;
  gym_id: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Pending';
  plan: 'Gold' | 'Silver' | 'Drop-in';
  lastVisit: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface WorkoutStat {
  id: string;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
}
