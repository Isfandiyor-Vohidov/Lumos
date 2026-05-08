export type Role = 'student' | 'admin';
export type LeadStatus = 'new' | 'contacted' | 'enrolled' | 'rejected';
export type TestSessionStatus = 'in_progress' | 'finished' | 'abandoned';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  telegram_id: number;
  full_name: string;
  phone: string | null;
  role: Role;
  center_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  center_id: string | null;
  title: string;
  description: string;
  price: number;
  mentor_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  course_id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  order: number;
  created_at: string;
}

export interface Lead {
  id: string;
  profile_id: string;
  course_id: string;
  center_id: string | null;
  status: LeadStatus;
  score: number;
  ai_assessment: string;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
  enrolled_at: string | null;
}

export interface TestSession {
  id: string;
  profile_id: string;
  course_id: string;
  status: TestSessionStatus;
  answers: { question_id: string; selected_index: number }[];
  started_at: string;
  finished_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  lead_id: string;
  provider: string;
  external_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}