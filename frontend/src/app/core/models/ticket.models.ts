import { User } from './auth.models';

export interface Comment {
  id: number;
  author: User;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'closed';
  attachment?: string | null;
  created_by: User;
  assigned_to?: User | null;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

export interface TicketUpdatePayload {
  title?: string;
  description?: string;
  priority?: Ticket['priority'];
  status?: Ticket['status'];
  assigned_to_id?: number | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Notification {
  id: number;
  user: number;
  user_name?: string;
  user_role?: 'customer' | 'agent' | 'admin';
  type: 'ticket' | 'system' | 'message';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Feedback {
  id: number;
  user: number;
  user_name?: string;
  user_role?: 'customer' | 'agent' | 'admin';
  rating: number;
  category: 'support' | 'platform' | 'feature' | 'other';
  comments: string;
  created_at: string;
}
