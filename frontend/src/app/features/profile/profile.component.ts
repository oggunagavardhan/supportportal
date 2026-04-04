import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <section class="profile-shell" *ngIf="user() as currentUser">
      <header class="page-head">
        <h1>Profile</h1>
        <p>Manage your personal information</p>
      </header>

      <mat-card class="profile-card">
        <div class="profile-top">
          <div class="identity-block">
            <div class="avatar-wrap">
              <div class="avatar">{{ initials() }}</div>
            </div>

            <div class="identity-copy">
              <h2>{{ currentUser.full_name }}</h2>
              <p class="identity-email">{{ currentUser.email }}</p>
              <p class="identity-role" [class.support-agent-text]="isSupportAgent()">{{ roleLabel() }}</p>
            </div>
          </div>

          <button mat-flat-button color="primary" type="button" class="edit-trigger" (click)="toggleEdit()">
            {{ editing ? 'Cancel Edit' : 'Edit Profile' }}
          </button>
        </div>

        <form class="profile-grid" [formGroup]="form" (ngSubmit)="saveProfile()">
          <label class="field-card">
            <span class="field-label">Full Name</span>
            <mat-form-field appearance="outline" floatLabel="always">
              <input matInput formControlName="full_name" [readonly]="!editing" />
            </mat-form-field>
          </label>

          <label class="field-card">
            <span class="field-label">Email Address</span>
            <mat-form-field appearance="outline" floatLabel="always">
              <input matInput formControlName="email" [readonly]="!editing" />
            </mat-form-field>
          </label>

          <div class="field-card">
            <span class="field-label">Department</span>
            <div class="field-value">{{ departmentLabel() }}</div>
          </div>

          <div class="field-card">
            <span class="field-label">Role</span>
            <div class="field-value" [class.support-agent-text]="isSupportAgent()">{{ roleLabel() }}</div>
          </div>

          <div class="field-card wide-card">
            <span class="field-label">Support Portal Access</span>
            <div class="field-value multi-line">{{ accessSummary() }}</div>
          </div>

          <div class="field-card wide-card">
            <span class="field-label">Ticket Summary</span>
            <div class="field-value multi-line">{{ ticketSummary() }}</div>
          </div>

          <div class="form-actions" *ngIf="editing">
            <button mat-flat-button color="primary" type="submit">Save Changes</button>
            <button mat-stroked-button type="button" (click)="cancelEdit()">Cancel</button>
          </div>
        </form>
      </mat-card>
    </section>
  `,
  styles: [`
    .profile-shell {
      display: grid;
      gap: 22px;
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
      border: 1px solid #d7e3f4;
      background: #ffffff;
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.05);
    }
    .profile-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 28px;
    }
    .identity-block {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .avatar-wrap {
      position: relative;
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
    .field-card mat-form-field {
      width: 100%;
    }
    .field-value {
      min-height: 56px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      border-radius: 14px;
      border: 1px solid #dfe7f3;
      background: #f8fbff;
      color: #53637e;
      font-size: 1rem;
    }
    .multi-line {
      min-height: 76px;
      line-height: 1.55;
      padding-top: 14px;
      padding-bottom: 14px;
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
      border-radius: 14px;
      background: #f8fbff;
      min-height: 56px;
      border: 1px solid #dfe7f3;
    }
    :host ::ng-deep .profile-card .mat-mdc-text-field-wrapper,
    :host ::ng-deep .profile-card .mat-mdc-form-field-flex {
      border-radius: 14px !important;
      overflow: visible;
    }
    :host ::ng-deep .profile-card .mdc-notched-outline {
      border-radius: 14px !important;
    }
    :host ::ng-deep .profile-card .mdc-notched-outline__leading,
    :host ::ng-deep .profile-card .mdc-notched-outline__notch,
    :host ::ng-deep .profile-card .mdc-notched-outline__trailing {
      border-color: transparent !important;
    }
    :host ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused {
      border-color: #93c5fd;
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
    :host-context(.dark-theme) .field-label {
      color: #e8f1ff;
    }
    :host-context(.dark-theme) .field-value {
      background: #223555;
      border-color: #7ea1d8;
      color: #d5e6ff;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-text-field--outlined {
      background: #223555 !important;
      border-color: #7ea1d8;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-text-field--outlined.mdc-text-field--focused {
      border-color: #93c5fd;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mat-mdc-input-element {
      color: #e8f1ff !important;
      -webkit-text-fill-color: #e8f1ff !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mat-mdc-input-element[readonly] {
      color: #d5e6ff !important;
      -webkit-text-fill-color: #d5e6ff !important;
    }
    :host-context(.dark-theme) ::ng-deep .profile-card .mdc-floating-label {
      color: #d8e6ff !important;
    }
  `],
})
export class ProfileComponent {
  private ticketService = inject(TicketService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);

  user = this.auth.user;
  ticketCount = 0;
  editing = false;
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
  accessSummary = computed(() => {
    const role = this.user()?.role ?? 'customer';
    return role === 'customer'
      ? 'Create tickets, track updates, verify OTP login, and manage your account details in the Support Portal.'
      : 'Review incoming tickets, manage assignments, update ticket status, and monitor workspace activity in the Support Portal.';
  });
  ticketSummary = computed(() => {
    const role = this.user()?.role ?? 'customer';
    return role === 'customer'
      ? `${this.ticketCount} ticket${this.ticketCount === 1 ? '' : 's'} linked to your account.`
      : `${this.ticketCount} ticket${this.ticketCount === 1 ? '' : 's'} currently visible in your team workspace.`;
  });

  form = this.fb.nonNullable.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    this.ticketService.list({ page: 1 }).subscribe((response) => {
      this.ticketCount = response.count;
    });
    this.patchForm();
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
        this.notify.success('Profile updated successfully.');
        this.editing = false;
      },
      error: (error) => {
        this.notify.error(error.error?.email?.[0] ?? 'Unable to update profile.');
      },
    });
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
}
