import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../core/services/auth.service';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';
import { NotificationService } from '../../core/services/notification.service';
import { matchingFieldsValidator } from '../auth/auth.validators';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    I18nPipe,
  ],
  template: `
    <ng-container *ngIf="user() as currentUser">
      <header class="page-head">
        <h1>{{ 'profile.title' | t }}</h1>
        <p>{{ 'profile.subtitle' | t }}</p>
      </header>

      <mat-card class="profile-card">
        <div class="profile-top">
          <div class="identity-block">
            <div class="avatar-wrap">
              <div class="avatar" [class.has-image]="!!avatarPreviewUrl()">
                <img *ngIf="avatarPreviewUrl()" [src]="avatarPreviewUrl()!" alt="Profile picture" class="avatar-image" />
                <span *ngIf="!avatarPreviewUrl()">{{ initials() }}</span>
              </div>
              <input #avatarInput type="file" accept="image/*" class="avatar-input" (change)="onAvatarSelected($event)" />
              <div class="avatar-actions">
                <button mat-stroked-button type="button" class="avatar-btn" (click)="avatarInput.click()">Upload Photo</button>
                <button mat-button type="button" class="avatar-btn remove-btn" *ngIf="avatarPreviewUrl()" (click)="removeAvatar()">Remove</button>
              </div>
            </div>

            <div class="identity-copy">
              <h2>{{ currentUser.full_name }}</h2>
              <p class="identity-email">{{ currentUser.email }}</p>
              <p class="identity-role" [class.support-agent-text]="isSupportAgent()">{{ roleLabel() }}</p>
            </div>
          </div>

          <button mat-flat-button color="primary" type="button" class="edit-trigger" (click)="toggleEdit()">
            {{ editing ? ('profile.cancel_edit' | t) : ('profile.edit_profile' | t) }}
          </button>
        </div>

        <form class="profile-grid" [formGroup]="form" (ngSubmit)="saveProfile()">
          <label class="field-card">
            <span class="field-label">{{ 'profile.full_name' | t }}</span>
            <mat-form-field appearance="outline" floatLabel="always">
              <input matInput formControlName="full_name" [readonly]="!editing" [placeholder]="'auth.full_name_placeholder' | t" />
            </mat-form-field>
          </label>

          <label class="field-card">
            <span class="field-label">{{ 'profile.email' | t }}</span>
            <mat-form-field appearance="outline" floatLabel="always">
              <input matInput formControlName="email" [readonly]="!editing" [placeholder]="'auth.enter_email' | t" />
            </mat-form-field>
          </label>

          <div class="field-card">
            <span class="field-label">{{ 'profile.department' | t }}</span>
            <div class="field-value">{{ departmentLabel() }}</div>
          </div>

          <div class="field-card">
            <span class="field-label">{{ 'profile.role' | t }}</span>
            <div class="field-value" [class.support-agent-text]="isSupportAgent()">{{ roleLabel() }}</div>
          </div>

          <div class="field-card wide-card security-card">
            <span class="field-label">{{ 'profile.password' | t }}</span>
            <div class="field-value multi-line">
              <div class="security-line">
                <span>{{ 'profile.password_copy' | t }}</span>
                <button mat-flat-button type="button" class="change-pass-btn" (click)="togglePasswordForm()">
                  {{ showPasswordForm() ? ('profile.cancel_password_change' | t) : ('profile.change_password' | t) }}
                </button>
              </div>
            </div>
            <div class="password-grid" [formGroup]="passwordForm" *ngIf="showPasswordForm()">
              <label class="field-card">
                <span class="field-label">{{ 'auth.current_password' | t }}</span>
                <mat-form-field appearance="outline" floatLabel="always">
                  <input matInput type="password" formControlName="current_password" placeholder="Enter current password" />
                </mat-form-field>
              </label>
              <label class="field-card">
                <span class="field-label">{{ 'auth.new_password' | t }}</span>
                <mat-form-field appearance="outline" floatLabel="always">
                  <input matInput type="password" formControlName="new_password" placeholder="8+ characters: A-Z, a-z, 0-9, #@$" />
                </mat-form-field>
              </label>
              <label class="field-card">
                <span class="field-label">{{ 'auth.confirm_password' | t }}</span>
                <mat-form-field appearance="outline" floatLabel="always">
                  <input matInput type="password" formControlName="confirm_password" placeholder="Re-enter new password" />
                </mat-form-field>
                <div class="field-help error" [style.visibility]="showPasswordMismatch() ? 'visible' : 'hidden'">
                  {{ 'profile.password_mismatch' | t }}
                </div>
              </label>
              <div class="password-actions">
                <button mat-flat-button type="button" class="change-pass-btn" [disabled]="passwordForm.invalid || isChangingPassword()" (click)="submitPasswordChange()">
                  {{ isChangingPassword() ? ('common.loading' | t) : ('profile.update_password' | t) }}
                </button>
                <button mat-stroked-button type="button" (click)="cancelPasswordForm()">{{ 'common.cancel' | t }}</button>
              </div>
            </div>
          </div>

          <div class="field-card wide-card">
            <span class="field-label">{{ 'profile.account_security' | t }}</span>
            <div class="field-value multi-line">{{ 'profile.otp_enabled' | t }}</div>
          </div>

          <div class="form-actions" *ngIf="editing">
            <button mat-flat-button color="primary" type="submit">{{ 'common.save_changes' | t }}</button>
            <button mat-stroked-button type="button" (click)="cancelEdit()">{{ 'common.cancel' | t }}</button>
          </div>
        </form>
      </mat-card>
    </ng-container>
  `,
  styles: [`
    :host {
      display: block;
      background: transparent !important;
    }
    :host > * + * {
      margin-top: 22px;
    }
    .page-head h1 {
      margin: 0;
      font-size: 1.8rem;
      font-family: 'IBM Plex Sans', 'Segoe UI', Roboto, Arial, sans-serif;
      font-weight: 600;
      color: #17366e;
      letter-spacing: -0.04em;
    }
    .page-head p {
      margin: 8px 0 0;
      color: #60708c;
      font-size: 1.04rem;
    }
    .profile-card {
      padding: 28px;
      border-radius: 26px;
      border: 0 !important;
      background: #ffffff;
      box-shadow: none !important;
    }
    .profile-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      padding: 18px;
      border-radius: 18px;
      border: 0 !important;
      background: #ffffff;
    }
    .identity-block {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .avatar-wrap {
      position: relative;
      display: grid;
      gap: 10px;
      justify-items: center;
    }
    .avatar {
      width: 92px;
      height: 92px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: linear-gradient(180deg, #4f7df4, #4453ea);
      color: #ffffff;
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.06em;
      overflow: hidden;
      border: 3px solid #ffffff;
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.24);
    }
    .avatar.has-image {
      background: #dbeafe;
      color: transparent;
    }
    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .avatar-input {
      display: none;
    }
    .avatar-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .avatar-btn {
      min-height: 32px;
      border-radius: 999px;
      font-size: 0.82rem;
      padding-inline: 12px;
      font-weight: 700;
      border: 1px solid #1d4ed8 !important;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
      color: #ffffff !important;
    }
    .remove-btn {
      border-color: #dc2626 !important;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      color: #ffffff !important;
    }
    .identity-copy h2 {
      margin: 0 0 6px;
      font-size: 1.8rem;
      color: #17366e;
      letter-spacing: -0.04em;
    }
    .identity-copy p {
      margin: 0;
      color: #60708c;
      font-size: 1.08rem;
    }
    .identity-email {
      font-size: 1rem !important;
      margin-bottom: 4px !important;
      color: #3f5a80 !important;
    }
    .identity-role {
      font-size: 0.98rem !important;
    }
    .support-agent-text {
      font-size: 1rem !important;
    }
    .edit-trigger {
      min-width: 136px;
      height: 46px;
      border-radius: 14px;
      padding-inline: 18px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      font-weight: 700;
    }
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    .field-card {
      min-width: 0;
    }
    .field-label {
      display: inline-flex;
      align-items: center;
      margin-bottom: 12px;
      color: #314968;
      font-weight: 700;
      font-size: 1rem;
    }
    .field-help {
      margin-top: 6px;
      font-size: 0.88rem;
      font-weight: 600;
    }
    .field-help.error {
      color: #dc2626;
    }
    .field-card mat-form-field {
      width: 100%;
      --mdc-outlined-text-field-outline-color: #d5c8f7;
      --mdc-outlined-text-field-hover-outline-color: #d5c8f7;
      --mdc-outlined-text-field-focus-outline-color: #d5c8f7;
      --mdc-outlined-text-field-container-shape: 16px;
      --mdc-outlined-text-field-outline-width: 1px;
      --mdc-outlined-text-field-focus-outline-width: 1px;
    }
    .field-value {
      min-height: 56px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      border-radius: 16px;
      border: 1px solid #d5c8f7;
      background: #ffffff;
      color: #53637e;
      font-size: 1rem;
    }
    .multi-line {
      min-height: 76px;
      line-height: 1.55;
      padding-top: 14px;
      padding-bottom: 14px;
    }
    .security-line {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
    }
    .change-pass-btn {
      border-radius: 10px;
      min-height: 38px;
      padding-inline: 14px;
      font-weight: 700;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      white-space: nowrap;
    }
    .password-grid {
      margin-top: 14px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .password-grid > label:last-of-type {
      grid-column: 1 / -1;
    }
    .password-actions {
      grid-column: 1 / -1;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 2px;
    }
    .wide-card {
      grid-column: 1 / -1;
    }
    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 4px;
    }
    :host ::ng-deep .profile-card .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    :host ::ng-deep .profile-card .mdc-text-field--outlined {
      border-radius: 16px;
      background: #ffffff;
      min-height: 56px;
      border: 1px solid #d5c8f7 !important;
      box-shadow: none !important;
      overflow: hidden !important;
    }
    :host ::ng-deep .profile-card .mat-mdc-text-field-wrapper,
    :host ::ng-deep .profile-card .mat-mdc-form-field-flex {
      border-radius: 16px !important;
      overflow: hidden !important;
      background: #ffffff !important;
    }
    :host ::ng-deep .profile-card .mdc-notched-outline {
      border-radius: 16px !important;
      overflow: hidden !important;
    }
    :host ::ng-deep .profile-card .mdc-notched-outline__leading,
    :host ::ng-deep .profile-card .mdc-notched-outline__notch,
    :host ::ng-deep .profile-card .mdc-notched-outline__trailing {
      border-color: transparent !important;
      border-width: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
    }
    :host ::ng-deep .profile-card .mat-mdc-form-field-focus-overlay {
      background: transparent !important;
      opacity: 0 !important;
    }
    :host ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused {
      border-color: #d5c8f7;
    }
    :host ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__leading,
    :host ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__notch,
    :host ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: transparent !important;
      border-width: 0 !important;
    }
    :host ::ng-deep .profile-card .mat-mdc-input-element[readonly] {
      color: #53637e;
      cursor: default;
    }
    @media (max-width: 960px) {
      .profile-top {
        flex-direction: column;
        align-items: stretch;
      }
      .profile-grid {
        grid-template-columns: 1fr;
      }
      .password-grid {
        grid-template-columns: 1fr;
      }
      .identity-block {
        align-items: flex-start;
      }
      .form-actions {
        justify-content: stretch;
        flex-wrap: wrap;
      }
    }
    @media (max-width: 680px) {
      .profile-card {
        padding: 22px 18px;
        border-radius: 22px;
      }
      .identity-block {
        flex-direction: column;
      }
      .identity-copy h2 {
        font-size: 1.65rem;
      }
      .avatar {
        width: 82px;
        height: 82px;
        font-size: 2rem;
      }
    }
    :host-context(.dark-theme) .page-head h1,
    :host-context(.dark-theme) .identity-copy h2 {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .page-head p,
    :host-context(.dark-theme) .identity-copy p {
      color: #d0def6;
    }
    :host-context(.dark-theme) .identity-email {
      color: #e4efff !important;
    }
    :host-context(.dark-theme) .profile-card {
      background: #1b2a46;
      border-color: #6f93cb;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
    }
    :host-context(.dark-theme) .profile-top {
      border-color: #587ab2;
      background: linear-gradient(150deg, #1e3357 0%, #24406d 100%);
    }
    :host-context(.dark-theme) .avatar {
      border-color: #1b2a46;
    }
    :host-context(.dark-theme) .field-label {
      color: #e8f1ff;
    }
    :host-context(.dark-theme) .field-value {
      background: #223555;
      border-color: #7ea1d8;
      color: #d5e6ff;
    }
    :host-context(.dark-theme) .field-card mat-form-field {
      --mdc-outlined-text-field-outline-color: #7b67a8;
      --mdc-outlined-text-field-hover-outline-color: #7b67a8;
      --mdc-outlined-text-field-focus-outline-color: #7b67a8;
    }
    :host-context(.dark-theme) .change-pass-btn {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-text-field--outlined {
      background: #223555 !important;
      border-color: #7b67a8 !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mat-mdc-text-field-wrapper,
    :host-context(.dark-theme) ::ng-deep .profile-card .mat-mdc-form-field-flex {
      background: #223555 !important;
      border-radius: 16px !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused {
      border-color: #93c5fd;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-notched-outline__leading,
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-notched-outline__notch,
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-notched-outline__trailing {
      border-color: transparent !important;
      border-width: 0 !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__leading,
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__notch,
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: transparent !important;
      border-width: 0 !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mat-mdc-input-element {
      color: #e8f1ff !important;
      -webkit-text-fill-color: #e8f1ff !important;
      caret-color: #93c5fd !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mat-mdc-input-element[readonly] {
      color: #d5e6ff !important;
      -webkit-text-fill-color: #d5e6ff !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-floating-label,
    :host-context(.dark-theme) ::ng-deep .profile-card .mat-mdc-form-field-label {
      color: #d8e6ff !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-floating-label {
      color: #d8e6ff !important;
    }
  `],
})
export class ProfileComponent {
  private readonly avatarStorageKey = 'support_portal_profile_avatar';
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);
  private i18n = inject(I18nService);

  user = this.auth.user;
  editing = false;
  showPasswordForm = signal(false);
  isChangingPassword = signal(false);
  avatarPreviewUrl = signal<string | null>(null);
  initials = computed(() => (this.user()?.full_name?.trim()?.charAt(0) ?? 'U').toUpperCase());
  roleLabel = computed(() => {
    const role = this.user()?.role ?? 'customer';
    return role === 'admin' ? 'Administrator' : role === 'agent' ? 'Support Agent' : 'Portal User';
  });
  isSupportAgent = computed(() => this.roleLabel() === 'Support Agent');
  departmentLabel = computed(() => {
    const role = this.user()?.role ?? 'customer';
    return role === 'customer' ? 'Customer Support' : 'Support Operations';
  });

  form = this.fb.nonNullable.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
  passwordForm = this.fb.nonNullable.group({
    current_password: ['', Validators.required],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    confirm_password: ['', [Validators.required, Validators.minLength(8)]],
  }, { validators: matchingFieldsValidator('new_password', 'confirm_password') });

  constructor() {
    this.loadStoredAvatar();
    this.patchForm();
  }

  togglePasswordForm(): void {
    this.showPasswordForm.set(!this.showPasswordForm());
    if (!this.showPasswordForm()) {
      this.passwordForm.reset();
    }
  }

  cancelPasswordForm(): void {
    this.passwordForm.reset();
    this.showPasswordForm.set(false);
  }

  submitPasswordChange(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const payload = this.passwordForm.getRawValue();
    if (payload.new_password !== payload.confirm_password) {
      this.notify.error(this.i18n.translate('profile.password_mismatch'));
      return;
    }

    this.isChangingPassword.set(true);
    this.auth.changePassword(payload).subscribe({
      next: (res) => {
        this.isChangingPassword.set(false);
        this.notify.success(res.message || this.i18n.translate('profile.password_changed'));
        this.cancelPasswordForm();
      },
      error: (error) => {
        this.isChangingPassword.set(false);
        const payload = error?.error;
        const detail = payload?.detail
          ?? payload?.non_field_errors
          ?? payload?.current_password
          ?? payload?.new_password
          ?? payload?.confirm_password
          ?? (typeof payload === 'string' ? payload : null)
          ?? this.i18n.translate('common.generic_error');
        this.notify.error(Array.isArray(detail) ? detail[0] : detail);
      },
    });
  }

  showPasswordMismatch(): boolean {
    return !!this.passwordForm.errors?.['fieldsMismatch']
      && (this.passwordForm.controls.confirm_password.touched || this.passwordForm.controls.confirm_password.dirty);
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    if (this.editing) {
      this.patchForm();
    }
  }

  cancelEdit(): void {
    this.patchForm();
    this.editing = false;
  }

  saveProfile(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.auth.updateProfile(this.form.getRawValue()).subscribe({
      next: () => {
        this.notify.success(this.i18n.translate('profile.profile_updated'));
        this.editing = false;
      },
      error: (error) => {
        this.notify.error(error.error?.email?.[0] ?? this.i18n.translate('common.generic_error'));
      },
    });
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.notify.error(this.i18n.translate('profile.image_type_error'));
      input.value = '';
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      this.notify.error(this.i18n.translate('profile.image_size_error'));
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      this.avatarPreviewUrl.set(result);
      if (result) {
        localStorage.setItem(this.avatarStorageKey, result);
      }
      this.notify.success(this.i18n.translate('profile.photo_updated'));
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.avatarPreviewUrl.set(null);
    localStorage.removeItem(this.avatarStorageKey);
    this.notify.success(this.i18n.translate('profile.photo_removed'));
  }

  private patchForm(): void {
    const currentUser = this.user();
    if (!currentUser) {
      return;
    }
    this.form.patchValue({
      full_name: currentUser.full_name,
      email: currentUser.email,
    });
  }

  private loadStoredAvatar(): void {
    const stored = localStorage.getItem(this.avatarStorageKey);
    this.avatarPreviewUrl.set(stored);
  }
}
