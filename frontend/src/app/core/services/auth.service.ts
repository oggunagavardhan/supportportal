import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { AuthResponse, OtpResponse, User } from '../models/auth.models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(StorageService);
  private apiUrl = 'http://localhost:8000/api/auth';

  private userSignal = signal<User | null>(this.readStoredUser());
  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => this.hasValidAccessToken());

  register(payload: { full_name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register/`, payload);
  }

  loginStart(payload: { email: string; password: string }) {
    return this.http.post<OtpResponse>(`${this.apiUrl}/login/`, payload);
  }

  // For testing only: direct login without OTP verification
  directLogin(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/direct/`, payload).pipe(
      tap((response) => {
        if ('access' in response) {
          this.storeSession(response);
        }
      }),
    );
  }

  verifyOtp(payload: { email: string; otp_code: string; purpose: 'login' | 'password_reset' }) {
    const normalizedPayload = {
      ...payload,
      email: payload.email.trim().toLowerCase(),
      otp_code: payload.otp_code.trim(),
    };
    return this.http.post<AuthResponse | OtpResponse>(`${this.apiUrl}/verify-otp/`, normalizedPayload).pipe(
      tap((response) => {
        if ('access' in response) {
          this.storeSession(response);
        }
      }),
    );
  }

  resendOtp(payload: { email: string; purpose: 'login' | 'password_reset' }) {
    return this.http.post<OtpResponse>(`${this.apiUrl}/resend-otp/`, {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    });
  }

  requestPasswordReset(email: string) {
    return this.http.post<OtpResponse>(`${this.apiUrl}/forgot-password/`, { email });
  }

  resetPassword(payload: { email: string; otp_code: string; new_password: string }) {
    return this.http.post<OtpResponse>(`${this.apiUrl}/reset-password/`, payload);
  }

  loadProfile() {
    return this.http.get<User>(`${this.apiUrl}/profile/`).pipe(
      tap((user) => {
        this.persistUser(user);
      }),
    );
  }

  updateProfile(payload: Partial<Pick<User, 'full_name' | 'email'>>) {
    return this.http.patch<User>(`${this.apiUrl}/profile/`, payload).pipe(
      tap((user) => {
        this.persistUser(user);
      }),
    );
  }

  changePassword(payload: { current_password: string; new_password: string; confirm_password: string }) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password/`, payload);
  }

  getStaffUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/staff-users/`);
  }

  logout(): void {
    this.storage.clearAuth();
    this.userSignal.set(null);
    void this.router.navigate(['/auth/login']);
  }

  hasValidAccessToken(): boolean {
    const token = this.storage.get('access_token');
    if (!token) {
      return false;
    }

    try {
      const [, payload] = token.split('.');
      if (!payload) {
        this.storage.clearAuth();
        this.userSignal.set(null);
        return false;
      }

      const decoded = JSON.parse(atob(this.normalizeBase64(payload))) as { exp?: number };
      if (!decoded.exp) {
        return true;
      }

      const isValid = decoded.exp * 1000 > Date.now();
      if (!isValid) {
        this.storage.clearAuth();
        this.userSignal.set(null);
      }
      return isValid;
    } catch {
      this.storage.clearAuth();
      this.userSignal.set(null);
      return false;
    }
  }

  private storeSession(response: AuthResponse): void {
    this.storage.set('access_token', response.access);
    this.storage.set('refresh_token', response.refresh);
    this.persistUser(response.user);
    window.setTimeout(() => {
      void this.router.navigate(['/dashboard']);
    }, 1500);
  }

  private readStoredUser(): User | null {
    if (!this.hasValidAccessToken()) {
      return null;
    }
    const raw = this.storage.get('user');
    return raw ? (JSON.parse(raw) as User) : null;
  }

  private normalizeBase64(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = normalized.length % 4;
    return padding ? normalized + '='.repeat(4 - padding) : normalized;
  }

  private persistUser(user: User): void {
    this.storage.set('user', JSON.stringify(user));
    this.userSignal.set(user);
  }
}
