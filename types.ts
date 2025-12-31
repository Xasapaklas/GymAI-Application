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
  date: string; 
  title: string;
  instructor: string;
  time: string;
  duration: string;
  category: 'Open Gym' | 'Semi Personal' | 'Cardio' | 'Strength' | 'Yoga' | 'Pilates';
  capacity: number;
  booked: number;
}

export interface Incident {
  id: string;
  category: 'Equipment' | 'Member' | 'Injury' | 'Cleaning';
  title: string;
  staffName: string;
  timestamp: Date;
  notes: {
    text: string;
    timestamp: Date;
    staffName: string;
  }[];
  attachments: string[];
  status: 'Open' | 'Resolved';
}

export interface Member {
  id: string;
  gym_id: string;
  name: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Expired' | 'Frozen';
  plan: 'Gold' | 'Silver' | 'Drop-in';
  lastVisit: string;
  image: string;
  expiryDate?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type View = 
  | 'home' | 'schedule' | 'members' | 'analytics' | 'ai' 
  | 'checkins' | 'trainers' | 'bookings' | 'messages' | 'payments' | 'incidents' | 'help' 
  | 'sessions' | 'workouts' | 'stats' | 'challenges' | 'membership' | 'nutrition' | 'profile' | 'settings'
  | 'custom_workouts';