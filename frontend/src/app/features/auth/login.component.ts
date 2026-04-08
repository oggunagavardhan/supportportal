import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import { AUTH_PAGE_STYLES } from './auth.shared-styles';
import { OtpInputComponent } from './components/otp-input.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    OtpInputComponent,
    I18nPipe,
  ],
  template: `
    <div class="auth-shell theme-login">
      <div class="auth-bg-orb orb-one" aria-hidden="true"></div>
      <div class="auth-bg-orb orb-two" aria-hidden="true"></div>
      <section class="auth-layout dual-panel" [class.otp-only]="step() === 2">
        <div class="portal-details" *ngIf="step() === 1">
          <div class="portal-tag">{{ 'auth.portal_tag' | t }}</div>
          <h1>{{ 'auth.portal_heading' | t }}</h1>
          <p>{{ 'auth.portal_copy' | t }}</p>
          
          <div class="portal-points">
            <div class="portal-point">
              <span class="point-icon">✓</span>
              <span>{{ 'auth.portal_point_1' | t }}</span>
            </div>
            <div class="portal-point">
              <span class="point-icon">✓</span>
              <span>{{ 'auth.portal_point_2' | t }}</span>
            </div>
            <div class="portal-point">
              <span class="point-icon">✓</span>
              <span>{{ 'auth.portal_point_3' | t }}</span>
            </div>
          </div>
        </div>

        <mat-card class="auth-card login-panel">
          <div class="eyebrow">{{ 'auth.login' | t }}</div>
          <h2>{{ 'auth.welcome_back' | t }}</h2>
          <p>{{ 'auth.enter_credentials' | t }}</p>

          <form class="auth-form" [formGroup]="loginForm" *ngIf="step() === 1" (ngSubmit)="submitCredentials()">
            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(loginForm.controls.email)">
              <mat-label>{{ 'auth.email' | t }}</mat-label>
              <input matInput formControlName="email" [placeholder]="'auth.enter_email' | t" />
            </mat-form-field>
            <div class="field-feedback-container email-feedback-container">
              <div class="field-help error" [style.visibility]="showFieldError(loginForm.controls.email) ? 'visible' : 'hidden'">{{ 'validation.invalid_email' | t }}</div>
            </div>

            <div class="password-field-wrapper">
              <mat-form-field appearance="outline" class="theme-field password-field" [class.invalid-field]="showFieldError(loginForm.controls.password)">
                <mat-label>{{ 'auth.password' | t }}</mat-label>
                <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" [placeholder]="'auth.password_placeholder' | t" />
                <button mat-icon-button matSuffix type="button" class="password-toggle-btn" (click)="togglePasswordVisibility()" tabindex="-1">
                  <span class="eye-icon" [class.eye-open]="showPassword()">
                    <svg *ngIf="!showPassword()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg *ngIf="showPassword()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </span>
                </button>
              </mat-form-field>
              <div class="field-feedback-container">
                <div class="field-help error" [style.visibility]="showFieldError(loginForm.controls.password) ? 'visible' : 'hidden'">{{ 'validation.password_required' | t }}</div>
              </div>
            </div>


            <div
              class="credential-feedback"
              *ngIf="credentialFeedback()"
              [class.error-feedback]="credentialFeedbackType() === 'error'"
              [class.success-feedback]="credentialFeedbackType() === 'success'"
            >
              {{ credentialFeedback() }}
            </div>

            <button mat-flat-button type="submit" class="theme-primary-btn" [disabled]="isLoading()">
              <div class="btn-loading-content" *ngIf="isLoading()">
                <mat-spinner diameter="20"></mat-spinner> {{ 'common.loading' | t }}
              </div>
              <span *ngIf="!isLoading()">{{ 'auth.login' | t }}</span>
            </button>
          </form>

          <form class="auth-form two-actions" [formGroup]="otpForm" *ngIf="step() === 2" (ngSubmit)="submitOtp()">
            <div class="otp-note">{{ 'auth.otp_note_login' | t }}</div>
            <app-otp-input [control]="otpForm.controls.otp_code" [label]="'auth.otp' | t" [errorText]="'auth.otp_error' | t"></app-otp-input>

            <div class="action-row">
              <button mat-flat-button type="submit" class="theme-primary-btn" [disabled]="isLoading()">
                <div class="btn-loading-content" *ngIf="isLoading()">
                  <mat-spinner diameter="20"></mat-spinner> {{ 'auth.verifying' | t }}
                </div>
                <span *ngIf="!isLoading()">{{ 'auth.verify_otp' | t }}</span>
              </button>
              <button mat-stroked-button type="button" class="theme-secondary-btn" [disabled]="countdown() > 0" (click)="resendOtp()">
                {{ countdown() > 0 ? ('auth.resend_in' | t: { seconds: countdown() }) : ('auth.resend_otp' | t) }}
              </button>
            </div>
          </form>

          <div class="links">
            <a routerLink="/auth/register">{{ 'auth.create_account' | t }}</a>
            <a routerLink="/auth/forgot-password">{{ 'auth.forgot_password' | t }}</a>
          </div>
        </mat-card>
      </section>
    </div>
  `,
  styles: [AUTH_PAGE_STYLES, `
    .theme-login {
      --auth-bg: #f3efff;
      --auth-accent: #2563eb;
      --auth-accent-hover: #1d4ed8;
      --auth-text: #2b1552;
      --auth-muted: #6f5b95;
      --auth-border: #dccbff;
      position: relative;
      overflow: hidden;
      font-family: "Manrope", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    }
    .auth-bg-orb {
      position: absolute;
      border-radius: 999px;
      filter: blur(8px);
      pointer-events: none;
    }
    .orb-one {
      width: 340px;
      height: 340px;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.24) 0%, rgba(124, 58, 237, 0) 70%);
      top: -120px;
      right: -90px;
    }
    .orb-two {
      width: 380px;
      height: 380px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0) 72%);
      bottom: -140px;
      left: -120px;
    }
    .btn-loading-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .theme-login .auth-layout {
      width: min(880px, 98vw);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      position: relative;
      z-index: 10;
      margin: 0 auto;
      align-items: stretch;
    }
    .theme-login .auth-layout.otp-only {
      width: min(420px, 90vw);
      grid-template-columns: 1fr;
      justify-items: center;
    }
    .theme-login .auth-layout.otp-only .login-panel {
      width: 100%;
      max-width: 420px;
      padding: 24px !important;
      border-radius: 24px !important;
      box-shadow: 0 24px 46px rgba(91, 33, 182, 0.2) !important;
    }
    .login-panel {
      border-radius: 22px !important;
      background: #ffffff;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 30px !important; /* REDUCED PADDING */
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.7) !important;
    }
    .portal-details {
      border-radius: 22px;
      background: linear-gradient(145deg, #2563eb 0%, #1e3a8a 100%);
      padding: 30px; /* REDUCED PADDING */
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px; /* TIGHTER GAP */
      box-shadow: 0 20px 40px rgba(91, 33, 182, 0.24);
    }
    .portal-tag {
      width: fit-content;
      margin: 0 auto 8px; /* CENTERED */
      padding: 8px 18px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.22);
      font-size: 14px; /* INCREASED FONT SIZE */
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .portal-details h1 {
      text-align: center;
      margin: 0;
      font-size: clamp(22px, 2.2vw, 28px);
      line-height: 1.15;
      color: #ffffff;
    }
    .portal-details p {
      text-align: center;
      margin: 0;
      color: rgba(245, 250, 255, 0.95);
      font-size: 15px;
      line-height: 1.6;
    }
    .auth-form {
      display: grid;
      gap: 2px; /* TIGHTER SPACING */
      margin-top: 10px;
      width: 100%;
    }
    .portal-points {
      display: grid;
      gap: 12px;
      margin-top: 2px;
    }
    .portal-point {
      display: grid;
      grid-template-columns: 34px 1fr;
      gap: 10px;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 14px;
      line-height: 1.5;
    }
    .point-icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
    .login-panel :is(h2, p, .eyebrow, .field-help, .links a, .mat-mdc-form-field) {
      font-family: inherit;
    }
    .login-panel .eyebrow {
      justify-self: center;
      min-width: auto;
      justify-content: center;
      text-align: center;
      background: color-mix(in srgb, var(--auth-accent) 14%, white);
      color: #1d4ed8;
      box-shadow: none;
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 16px;
      letter-spacing: 0.04em;
      width: fit-content;
      margin: 0 auto;
    }
    .login-panel h2,
    .login-panel > p {
      text-align: center;
      justify-self: center;
      width: fit-content;
    }
    .login-panel h2 {
      font-size: 20px;
      margin-top: 12px;
      margin-bottom: 8px;
      margin-left: auto;
      margin-right: auto;
    }
    .login-panel p {
      font-size: 15px;
      color: #111827;
    }
    .field-feedback-container {
      height: 14px; /* slightly tighter spacing */
      margin-top: 2px;
      margin-bottom: 2px;
      overflow: hidden;
    }
    .email-feedback-container .field-help {
      transform: translateY(-2px);
    }
    .field-help {
      font-size: 13px; /* INCREASED FONT SIZE */
      display: block;
      line-height: 18px;
      text-align: center; /* CENTERED */
      color: #dc2626; /* RED */
      font-weight: 700;
    }
    .credential-feedback {
      margin-top: -2px;
      margin-bottom: 2px;
      font-size: 13px;
      font-weight: 700;
    }
    .credential-feedback.error-feedback {
      color: #dc2626;
    }
    .credential-feedback.success-feedback {
      color: #15803d;
    }
    .theme-primary-btn {
      min-height: 50px;
      border-radius: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
      background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
      color: #ffffff;
      border: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 18px rgba(124, 58, 237, 0.34);
      text-transform: none;
      font-size: 16px;
    }

    .theme-primary-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 26px rgba(124, 58, 237, 0.42);
      background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
    }

    .theme-primary-btn:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 4px 10px rgba(91, 33, 182, 0.32);
    }

    .theme-primary-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .password-field-wrapper {
      display: grid;
      gap: 0;
      height: fit-content;
    }

    .password-field {
      position: relative;
      height: fit-content;
    }

    .password-toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: #6b7280;
      transition: color 0.2s ease;
      margin-right: 4px;
      padding: 0;
    }

    .password-toggle-btn:hover {
      color: #2563eb;
    }

    .eye-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    .eye-icon.eye-open {
      animation: slideIn 0.2s ease;
    }

    :host-context(.dark-theme) .password-toggle-btn {
      color: #9ca3af;
    }

    :host-context(.dark-theme) .password-toggle-btn:hover {
      color: #93c5fd;
    }

    :host-context(.dark-theme) .theme-primary-btn {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.34);
    }

    :host-context(.dark-theme) .theme-primary-btn:hover:not(:disabled) {
      box-shadow: 0 10px 26px rgba(139, 92, 246, 0.4);
    }
    .theme-login .auth-layout.otp-only .action-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      align-items: stretch;
    }
    .theme-login .auth-layout.otp-only .theme-primary-btn,
    .theme-login .auth-layout.otp-only .theme-secondary-btn {
      min-height: 54px;
      border-radius: 14px;
      font-size: 17px;
      font-weight: 700;
    }
    .theme-login .auth-layout.otp-only .theme-secondary-btn {
      border-color: #cdb6ff;
      color: #1d4ed8;
      background: linear-gradient(180deg, #fcfaff 0%, #f5f0ff 100%);
    }
    .theme-login .auth-layout.otp-only .theme-secondary-btn:disabled {
      opacity: 0.9;
      color: #8f6ac9;
      background: linear-gradient(180deg, #faf7ff 0%, #f4efff 100%);
    }
    .theme-login .auth-layout.otp-only .otp-note {
      width: 100%;
      max-width: 340px;
      margin: 0 auto 8px;
      border: 1px solid #cdb6ff;
      background: linear-gradient(160deg, #f9f4ff 0%, #f2e8ff 100%);
      color: #43216f;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.55;
      text-align: center;
      padding: 14px 16px;
    }
    @media (max-width: 960px) {
      .theme-login .auth-layout {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
    @media (max-width: 560px) {
      .portal-details {
        padding: 22px;
      }
      .portal-details h1 {
        font-size: 25px;
      }
      .login-panel h2 {
        font-size: 24px;
      }
      .theme-login .auth-layout.otp-only .action-row {
        grid-template-columns: 1fr;
      }
    }
    @keyframes slideIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    ::ng-deep .btn-loading-content .mat-mdc-progress-spinner circle {
      stroke: currentColor !important;
    }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private destroyRef = inject(DestroyRef);
  private i18n = inject(I18nService);

  step = signal(1);
  email = signal('');
  countdown = signal(0);
  isLoading = signal(false);
  credentialFeedback = signal('');
  credentialFeedbackType = signal<'error' | 'success' | null>(null);
  showPassword = signal(false);
  timerId?: number;
  loginDelayId?: number;

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  otpForm = this.fb.nonNullable.group({
    otp_code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timerId) {
        window.clearInterval(this.timerId);
      }
      if (this.loginDelayId) {
        window.clearTimeout(this.loginDelayId);
      }
    });
  }

  submitCredentials(): void {
    this.credentialFeedback.set('');
    this.credentialFeedbackType.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.credentialFeedback.set(this.i18n.translate('auth.verifying_credentials'));
    this.credentialFeedbackType.set('success');

    const { email, password } = this.loginForm.getRawValue();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    this.email.set(cleanEmail);

    // Call loginStart to send OTP to email
    this.auth.loginStart({ email: cleanEmail, password: cleanPassword }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.credentialFeedback.set(this.i18n.translate('auth.otp_sent_login'));
        this.credentialFeedbackType.set('success');
        this.email.set((response as { email?: string }).email?.trim() || cleanEmail);

        // Move to OTP verification step
        this.step.set(2);
        this.otpForm.patchValue({ otp_code: '' });

        const debugOtp = (response as { otp_code?: string }).otp_code;
        if (debugOtp) {
          this.otpForm.patchValue({ otp_code: debugOtp });
        }

        // Start countdown for resend button
        if (response.resend_available_at) {
          this.startCountdownFrom(response.resend_available_at);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.credentialFeedback.set(this.i18n.translate('auth.invalid_credentials'));
        this.credentialFeedbackType.set('error');
      },
    });
  }

  submitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const otpCode = this.otpForm.controls.otp_code.value.trim();
    const email = this.email().trim();
    if (!email) {
      this.isLoading.set(false);
      this.notify.error(this.i18n.translate('validation.user_not_found'));
      return;
    }

    if (!otpCode || otpCode.length !== 6) {
      this.isLoading.set(false);
      this.notify.error(this.i18n.translate('auth.otp_six_digits'));
      return;
    }

    this.auth
      .verifyOtp({ email, otp_code: otpCode, purpose: 'login' })
      .subscribe({
        next: () => {
          window.setTimeout(() => {
            this.isLoading.set(false);
          }, 1500);
        },
        error: (error) => {
          this.isLoading.set(false);
          const errorMsg = this.getErrorMessage(error, this.i18n.translate('auth.otp_verify_failed'));
          this.notify.error(errorMsg);
          console.error('OTP Verification Error:', { email, otpCodeLength: otpCode.length, error });
        },
      });
  }

  resendOtp(): void {
    this.isLoading.set(true);
    this.auth.resendOtp({ email: this.email().trim(), purpose: 'login' }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.notify.success(this.i18n.translate('auth.otp_resent'));
        this.otpForm.patchValue({ otp_code: '' });

        // Restart countdown
        if (response.resend_available_at) {
          this.startCountdownFrom(response.resend_available_at);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.notify.error(this.getErrorMessage(error, this.i18n.translate('auth.otp_resend_failed')));
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  showFieldError(control: { invalid: boolean; touched: boolean; dirty: boolean }): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  private startCountdownFrom(resendAvailableAt?: string): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
    const parsedTarget = resendAvailableAt ? new Date(resendAvailableAt).getTime() : NaN;
    const target = Number.isFinite(parsedTarget) && parsedTarget > Date.now()
      ? parsedTarget
      : Date.now() + 30000;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
      this.countdown.set(seconds);
      if (seconds === 0 && this.timerId) {
        window.clearInterval(this.timerId);
      }
    };
    tick();
    this.timerId = window.setInterval(tick, 1000);
  }

  private getErrorMessage(error: { error?: unknown }, fallback: string): string {
    const payload = error.error;
    if (typeof payload === 'string') {
      return payload;
    }
    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>;
      const detail = record['detail'];
      if (typeof detail === 'string') {
        return detail;
      }
      const nonFieldErrors = record['non_field_errors'];
      if (Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === 'string') {
        return nonFieldErrors[0];
      }
      for (const value of Object.values(record)) {
        if (Array.isArray(value) && typeof value[0] === 'string') {
          return value[0];
        }
        if (typeof value === 'string') {
          return value;
        }
      }
    }
    return fallback;
  }
}
