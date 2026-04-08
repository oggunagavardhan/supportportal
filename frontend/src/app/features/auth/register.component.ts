import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { PASSWORD_RULES, matchingFieldsValidator, strongPasswordValidator } from './auth.validators';

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
    I18nPipe,
  ],
  template: `
    <div class="auth-shell theme-register">
      <div class="auth-bg-orb orb-one" aria-hidden="true"></div>
      <div class="auth-bg-orb orb-two" aria-hidden="true"></div>
      <section class="auth-layout single-panel">

        <mat-card class="auth-card register-panel">
          <div class="eyebrow">{{ 'auth.register' | t }}</div>
          <h2>{{ 'auth.create_account' | t }}</h2>

          <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(form.controls.full_name)">
              <mat-label>{{ 'profile.full_name' | t }}</mat-label>
              <input matInput formControlName="full_name" [placeholder]="'auth.full_name_placeholder' | t" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showFieldError(form.controls.full_name)">{{ 'auth.full_name_required' | t }}</div>

            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(form.controls.email)">
              <mat-label>{{ 'auth.email' | t }}</mat-label>
              <input matInput formControlName="email" [placeholder]="'auth.enter_email' | t" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showFieldError(form.controls.email)">{{ 'validation.invalid_email' | t }}</div>

            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showFieldError(form.controls.password)">
              <mat-label>{{ 'auth.password' | t }}</mat-label>
              <input matInput type="password" formControlName="password" [placeholder]="'auth.password_create' | t" />
            </mat-form-field>
            <div class="field-help password-suggestion" *ngIf="showPasswordSuggestion()">
              {{ 'auth.password_suggestion' | t }}
            </div>

            <mat-form-field appearance="outline" class="theme-field" [class.invalid-field]="showConfirmError()">
              <mat-label>{{ 'auth.confirm_password' | t }}</mat-label>
              <input matInput type="password" formControlName="confirm_password" [placeholder]="'auth.confirm_password_placeholder' | t" />
            </mat-form-field>
            <div class="field-help error" *ngIf="showConfirmError()">{{ 'validation.fields_must_match' | t }}</div>

            <button mat-flat-button type="submit" class="theme-primary-btn" [disabled]="isLoading()">
              <div class="btn-loading-content" *ngIf="isLoading()">
                <mat-spinner diameter="20"></mat-spinner> {{ 'auth.creating' | t }}
              </div>
              <span *ngIf="!isLoading()">{{ 'auth.create_account' | t }}</span>
            </button>
          </form>

          <div class="links">
            <a routerLink="/auth/login">{{ 'auth.back_to_login' | t }}</a>
          </div>
        </mat-card>
      </section>
    </div>
  `,
  styles: [AUTH_PAGE_STYLES, `
    .theme-register {
      --auth-bg: #f5f3ff;
      --auth-accent: #2563eb;
      --auth-accent-hover: #1d4ed8;
      --auth-text: #1e3a8a;
      --auth-muted: #6b7280;
      --auth-border: #ddd6fe;
      position: relative;
      overflow: hidden;
    }
    .theme-register .auth-layout {
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
    .register-panel {
      padding: 24px 32px !important; /* COMPACT PADDING */
      border-radius: 22px;
    }
    .auth-form {
      display: grid;
      gap: 2px; /* TIGHTER SPACING */
      margin-top: 10px;
      width: 100%;
    }
    .field-help {
      font-size: 11.5px;
      display: block;
      line-height: 1.2;
      text-align: center;
      color: #dc2626; /* RED */
      font-weight: 700;
      margin-top: -2px; /* PUSH UP TIGHT */
      margin-bottom: 4px; /* CREATE SPACE WHEN SHOWN */
    }
    .eyebrow {
      margin-bottom: 4px;
    }
    h2 {
      margin-bottom: 8px !important;
      font-size: 22px; /* SLIGHTLY SMALLER */
    }
    .btn-loading-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .password-suggestion {
      color: #dc2626 !important;
      font-weight: 700;
    }
    .theme-register .theme-field {
      --mat-form-field-container-height: 46px;
      --mat-form-field-container-vertical-padding: 10px;
    }
    ::ng-deep .btn-loading-content .mat-mdc-progress-spinner circle {
      stroke: currentColor !important;
    }
  `],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router);
  private i18n = inject(I18nService);

  passwordRules = PASSWORD_RULES;
  isLoading = signal(false);

  form = this.fb.nonNullable.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, strongPasswordValidator()]],
    confirm_password: ['', Validators.required],
  }, { validators: matchingFieldsValidator('password', 'confirm_password') });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const { confirm_password: _confirmPassword, ...payload } = this.form.getRawValue();
    this.auth.register(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notify.success(this.i18n.translate('auth.registration_success'));
        void this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.isLoading.set(false);
        this.notify.error(this.i18n.translate('auth.registration_failed'));
      },
    });
  }

  showFieldError(control: { invalid: boolean; touched: boolean; dirty: boolean }): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  showConfirmError(): boolean {
    return !!this.form.errors?.['fieldsMismatch'] && (this.form.controls.confirm_password.touched || this.form.controls.confirm_password.dirty);
  }

  showPasswordSuggestion(): boolean {
    const control = this.form.controls.password;
    return control.hasError('strongPassword') && (control.touched || control.dirty);
  }

  hasRule(rule: 'length' | 'upper' | 'lower' | 'number' | 'special'): boolean {
    const value = this.form.controls.password.value;
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
}
