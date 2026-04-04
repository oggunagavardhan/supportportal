export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'customer' | 'agent' | 'admin';
  is_superuser: boolean;
  // Only present on some admin endpoints (e.g. user CRUD).
  is_active?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface OtpResponse {
  message: string;
  email?: string;
  expires_at?: string;
  resend_available_at?: string;
}
