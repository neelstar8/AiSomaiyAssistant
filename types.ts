
export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE'
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  credits: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  location?: { lat: number; lng: number };
  timestamp: number;
  isSystem?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface InfraReport {
  id: string;
  description: string;
  imageUrl: string;
  status: 'pending' | 'verified';
  reporterEmail: string;
  count: number;
  location?: { lat: number; lng: number };
  timestamp: number;
}

export interface WithdrawalRequest {
  id: string;
  userEmail: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  amount: number;
  status: 'pending' | 'completed';
  timestamp: number;
}

export interface KnowledgeBaseItem {
  id: string;
  category: 'holiday' | 'form' | 'policy' | 'timetable';
  title: string;
  content: string;
  link?: string;
}
