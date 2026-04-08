import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private i18n = inject(I18nService);
  private messageMap: Record<string, string> = {
    'Current password is incorrect.': 'validation.current_password_incorrect',
    'Passwords do not match.': 'validation.passwords_do_not_match',
    'The password is too similar to the username.': 'validation.password_too_similar',
    'Invalid email or password.': 'validation.invalid_email_or_password',
    'OTP request not found.': 'validation.otp_request_not_found',
    'OTP has expired.': 'validation.otp_expired',
    'Too many OTP attempts. Request a new OTP.': 'validation.otp_too_many',
    'Invalid OTP.': 'validation.otp_invalid',
    'No user found with this email.': 'validation.user_not_found',
  };

  success(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['app-snackbar', 'app-snackbar-success'],
    });
  }

  error(message: unknown): void {
    const normalized = this.normalizeMessage(message);
    const translated = this.translateServerMessage(normalized);
    this.snackBar.open(translated || this.i18n.translate('common.generic_error'), 'Close', {
      duration: 8000,
      panelClass: ['app-snackbar', 'app-snackbar-error'],
    });
  }

  private normalizeMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message)) {
      return message.filter((item) => typeof item === 'string' && item.trim()).join(' ');
    }
    if (message && typeof message === 'object') {
      const candidate = (message as { detail?: unknown; message?: unknown }).detail
        ?? (message as { message?: unknown }).message;
      if (typeof candidate === 'string') {
        return candidate;
      }
      if (Array.isArray(candidate)) {
        return candidate.filter((item) => typeof item === 'string' && item.trim()).join(' ');
      }
      try {
        return JSON.stringify(message);
      } catch {
        return 'Something went wrong.';
      }
    }
    return 'Something went wrong.';
  }

  private translateServerMessage(message: string): string {
    const key = this.messageMap[message];
    if (!key) {
      return message;
    }
    return this.i18n.translate(key);
  }
}
