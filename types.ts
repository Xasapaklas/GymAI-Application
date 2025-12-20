
export type UserRole = 'admin' | 'client-og' | 'client-sp';

export interface User {
  username: string;
  role: UserRole;
  name: string;
  avatar: string;
}

export interface ClassSession {
  id: string;
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

export interface RevenueData {
  name: string;
  revenue: number;
}
