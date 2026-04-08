import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../core/services/auth.service';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import { AUTH_PAGE_STYLES } from './auth.shared-styles';
import { OtpInputComponent } from './components/otp-input.component';
import { matchingFieldsValidator, strongPasswordValidator } from './auth.validators';

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
    OtpInputComponent,
    I18nPipe,
  ],
  template: `
    <div class="auth-shell theme-forgot">
      <div class="auth-bg-orb orb-one" aria-hidden="true"></div>
      <div class="auth-bg-orb orb-two" aria-hidden="true"></div>
      <section class="auth-layout single-panel">

        <mat-card class="auth-card forgot-panel">
          <div class="eyebrow">{{ 'auth.forgot_password' | t }}</div>
          <h2>{{ stepTitle() }}</h2>
          <p>{{ stepCopy() }}</p>

          <form class="auth-form" [formGroup]="emailForm" *ngIf="step() === 1" (ngSubmit)="requestOtp()">
            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(emailForm.controls.email)">
              <mat-label>{{ 'auth.email' | t }}</mat-label>
              <input matInput formControlName="email" placeholder="name@company.com" />
            </mat-form-field>
            <div class="field-feedback-container">
              <div class="field-help error" [style.visibility]="showFieldError(emailForm.controls.email) ? 'visible' : 'hidden'">{{ 'validation.invalid_email' | t }}</div>
            </div>

            <button mat-flat-button type="submit" class="theme-primary-btn">{{ 'auth.send_otp' | t }}</button>
          </form>

          <form class="auth-form two-actions" [formGroup]="otpForm" *ngIf="step() === 2" (ngSubmit)="continueToPasswordStep()">
            <div class="otp-note">{{ 'auth.otp_note_reset' | t: { email: email() } }}</div>
            <app-otp-input [control]="otpForm.controls.otp_code" [label]="'auth.otp' | t" [errorText]="'auth.otp_error' | t"></app-otp-input>

            <div class="action-row">
              <button mat-flat-button type="submit" class="theme-primary-btn">{{ 'auth.continue' | t }}</button>
              <button mat-stroked-button type="button" class="theme-secondary-btn" [disabled]="countdown() > 0" (click)="resendOtp()">
                {{ countdown() > 0 ? ('auth.resend_in' | t: { seconds: countdown() }) : ('auth.resend_otp' | t) }}
              </button>
            </div>
          </form>

          <form class="auth-form" [formGroup]="resetForm" *ngIf="step() === 3" (ngSubmit)="resetPassword()">
            <mat-form-field appearance="outline" class="theme-field password-field" [class.invalid-field]="showFieldError(resetForm.controls.new_password)">
              <mat-label>{{ 'auth.new_password' | t }}</mat-label>
              <input matInput type="password" formControlName="new_password" [placeholder]="'auth.new_password_placeholder' | t" />
            </mat-form-field>

            <div class="password-rules" *ngIf="resetForm.controls.new_password.dirty || resetForm.controls.new_password.touched">
              <span [class.valid]="hasRule('length')" [class.invalid]="!hasRule('length')">{{ 'auth.password_rules.length' | t }}</span>
              <span [class.valid]="hasRule('upper')" [class.invalid]="!hasRule('upper')">{{ 'auth.password_rules.upper' | t }}</span>
              <span [class.valid]="hasRule('lower')" [class.invalid]="!hasRule('lower')">{{ 'auth.password_rules.lower' | t }}</span>
              <span [class.valid]="hasRule('number')" [class.invalid]="!hasRule('number')">{{ 'auth.password_rules.number' | t }}</span>
              <span [class.valid]="hasRule('special')" [class.invalid]="!hasRule('special')">{{ 'auth.password_rules.special' | t }}</span>
            </div>

            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showConfirmError()">
              <mat-label>{{ 'auth.confirm_password' | t }}</mat-label>
              <input matInput type="password" formControlName="confirm_password" [placeholder]="'auth.confirm_password_placeholder' | t" />
            </mat-form-field>
            <div class="field-feedback-container">
              <div class="field-help error" [style.visibility]="showConfirmError() ? 'visible' : 'hidden'">{{ 'validation.fields_must_match' | t }}</div>
            </div>

            <button mat-flat-button type="submit" class="theme-primary-btn">{{ 'auth.reset_password' | t }}</button>
            <div class="success-text" *ngIf="successMessage()">{{ successMessage() }}</div>
          </form>

          <div class="links">
            <a routerLink="/auth/login">{{ 'auth.back_to_login' | t }}</a>
          </div>
        </mat-card>
      </section>
    </div>
  `,
  styles: [AUTH_PAGE_STYLES, `
    .theme-forgot {
      --auth-bg: #f5f3ff;
      --auth-accent: #2563eb;
      --auth-accent-hover: #1d4ed8;
      --auth-text: #2e1065;
      --auth-muted: #6b7280;
      --auth-border: #ddd6fe;
      position: relative;
      overflow: hidden;
    }
    .theme-forgot .auth-layout {
      width: min(480px, 92vw);
      display: block;
      position: relative;
      z-index: 10;
      margin: 0 auto;
    }
    .auth-bg-orb {
      position: absolute;
      border-radius: 999px;
      filter: blur(8px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.6;
    }
    .orb-one {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
      top: -100px;
      left: -100px;
    }
    .orb-two {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%);
      bottom: -80px;
      right: -80px;
    }
    .theme-forgot .eyebrow,
    .theme-forgot h2,
    .theme-forgot > p {
      text-align: center;
    }
  `],
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private i18n = inject(I18nService);

  step = signal(1);
  email = signal('');
  otpCode = signal('');
  countdown = signal(0);
  successMessage = signal('');
  timerId?: number;
  redirectTimerId?: number;

  emailForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  otpForm = this.fb.nonNullable.group({
    otp_code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  resetForm = this.fb.nonNullable.group({
    new_password: ['', [Validators.required, strongPasswordValidator()]],
    confirm_password: ['', Validators.required],
  }, { validators: matchingFieldsValidator('new_password', 'confirm_password') });

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.timerId) {
        window.clearInterval(this.timerId);
      }
      if (this.redirectTimerId) {
        window.clearTimeout(this.redirectTimerId);
      }
    });
  }

  requestOtp(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    const email = this.emailForm.controls.email.value;
    this.auth.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.email.set(email);
        this.step.set(2);
        this.successMessage.set('');
        this.otpForm.patchValue({ otp_code: '' });
        this.startCountdownFrom(response.resend_available_at);
        this.notify.success(response.message || this.i18n.translate('auth.otp_sent'));
      },
      error: (error) => this.notify.error(this.getErrorMessage(error, this.i18n.translate('auth.otp_send_failed'))),
    });
  }

  continueToPasswordStep(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.otpCode.set(this.otpForm.controls.otp_code.value);
    this.step.set(3);
  }

  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.auth
      .resetPassword({ email: this.email(), otp_code: this.otpCode(), new_password: this.resetForm.controls.new_password.value })
      .subscribe({
        next: (response) => {
          this.successMessage.set(this.i18n.translate('auth.password_reset_success'));
          this.notify.success(response.message || this.i18n.translate('auth.password_reset_success'));
          this.redirectTimerId = window.setTimeout(() => {
            void this.router.navigate(['/auth/login']);
          }, 1500);
        },
        error: (error) => this.notify.error(error.error?.non_field_errors?.[0] ?? this.i18n.translate('auth.password_reset_failed')),
      });
  }

  resendOtp(): void {
    this.auth.resendOtp({ email: this.email(), purpose: 'password_reset' }).subscribe({
      next: (response) => {
        this.notify.success(response.message || this.i18n.translate('auth.otp_resent'));
        this.otpForm.patchValue({ otp_code: '' });
        this.startCountdownFrom(response.resend_available_at);
      },
      error: (error) => this.notify.error(this.getErrorMessage(error, this.i18n.translate('auth.otp_resend_failed'))),
    });
  }

  stepTitle(): string {
    switch (this.step()) {
      case 1:
        return this.i18n.translate('auth.recover_account');
      case 2:
        return this.i18n.translate('auth.verify_otp');
      default:
        return this.i18n.translate('auth.create_new_password');
    }
  }

  stepCopy(): string {
    switch (this.step()) {
      case 1:
        return this.i18n.translate('auth.recover_copy');
      case 2:
        return this.i18n.translate('auth.verify_copy');
      default:
        return this.i18n.translate('auth.reset_copy');
    }
  }

  showFieldError(control: { invalid: boolean; touched: boolean; dirty: boolean }): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  showConfirmError(): boolean {
    return !!this.resetForm.errors?.['fieldsMismatch'] && (this.resetForm.controls.confirm_password.touched || this.resetForm.controls.confirm_password.dirty);
  }

  hasRule(rule: 'length' | 'upper' | 'lower' | 'number' | 'special'): boolean {
    const value = this.resetForm.controls.new_password.value;
    if (!value) {
      return false;
    }
    switch (rule) {
      case 'length':
        return value.length >= 8;
      case 'upper':
        return /[A-Z]/.test(value);
      case 'lower':
        return /[a-z]/.test(value);
      case 'number':
        return /\d/.test(value);
      case 'special':
        return /[^A-Za-z\d]/.test(value);
    }
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
      const email = record['email'];
      if (Array.isArray(email) && typeof email[0] === 'string') {
        return email[0];
      }
    }
    return fallback;
  }
}
