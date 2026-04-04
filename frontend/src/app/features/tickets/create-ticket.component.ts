import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { User } from '../../core/models/auth.models';
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
    MatSelectModule,
  ],
  template: `
    <section class="ticket-create-shell">
      <mat-card class="glass-card form-card">
        <div class="hero-row">
          <div>
            <div class="chip">New Ticket</div>
            <h1>Create Support Ticket</h1>
            <p class="sub">Share the issue clearly so the team can respond faster.</p>
          </div>
          <button type="button" class="close-btn" (click)="goBackToTickets()">Close</button>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width" floatLabel="always">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" placeholder="Short summary of your issue" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width" floatLabel="always">
            <mat-label>Description</mat-label>
            <textarea matInput rows="4" formControlName="description" placeholder="Explain what happened, what you expected, and any error details"></textarea>
          </mat-form-field>

          <div class="meta-grid">
            <mat-form-field appearance="outline" floatLabel="always">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" *ngIf="isAgent" floatLabel="always">
              <mat-label>Assign to Admin</mat-label>
              <mat-select formControlName="assigned_to_id">
                <mat-option value="">Unassigned</mat-option>
                <mat-option *ngFor="let admin of adminUsers" [value]="admin.id">
                  {{ admin.full_name }} ({{ admin.email }})
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <label class="upload-row">
            <span class="upload-title">Attachment (optional)</span>
            <input type="file" (change)="onFileSelect($event)" />
          </label>

          <button mat-flat-button color="primary" type="submit" class="submit-btn">Submit Ticket</button>
        </form>
      </mat-card>
    </section>
  `,
  styles: [`
    .ticket-create-shell {
      position: fixed;
      inset: 0;
      z-index: 900;
      display: grid;
      place-items: center;
      padding: 20px;
      background:
        radial-gradient(circle at 20% 15%, rgba(96, 165, 250, 0.24), transparent 35%),
        rgba(11, 26, 51, 0.46);
      backdrop-filter: blur(9px);
    }

    .form-card {
      width: min(760px, 100%);
      max-height: none;
      overflow: hidden;
      padding: 22px;
      box-sizing: border-box;
      border-radius: 22px;
      border: 1px solid #d7e3f4;
      background: #ffffff;
      box-shadow: 0 28px 56px rgba(5, 23, 50, 0.28);
    }

    .hero-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .close-btn {
      border: 1px solid #c7d8f5;
      border-radius: 12px;
      background: #f4f8ff;
      color: #17366e;
      padding: 9px 14px;
      font-weight: 700;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #ebf2ff;
      border-color: #9eb9e8;
    }

    h1 {
      margin: 10px 0 0;
      font-size: 22px;
      line-height: 1.1;
      color: #143b7a;
      letter-spacing: -0.02em;
    }

    .sub {
      margin: 8px 0 0;
      color: #4f6790;
      font-size: 14px;
    }

    form {
      display: grid;
      gap: 14px;
      margin-top: 14px;
    }

    .full-width {
      width: 100%;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .upload-row {
      border: 2px solid #b7ccec;
      border-radius: 14px;
      background: #f8fbff;
      padding: 12px 14px;
      display: grid;
      gap: 8px;
    }

    .upload-title {
      font-size: 13px;
      color: #37517d;
      font-weight: 700;
    }

    .upload-row input[type='file'] {
      font: inherit;
      color: #27456f;
    }

    .submit-btn {
      min-height: 46px;
      border-radius: 13px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.01em;
      --mdc-filled-button-container-color: #2563eb;
      --mdc-filled-button-label-text-color: #ffffff;
      box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
    }

    .submit-btn:hover {
      --mdc-filled-button-container-color: #1d4ed8;
    }

    :host-context(.dark-theme) .ticket-create-shell {
      background:
        radial-gradient(circle at 22% 18%, rgba(56, 189, 248, 0.16), transparent 36%),
        rgba(1, 18, 28, 0.64);
    }

    :host-context(.dark-theme) .form-card {
      background: #17283e;
      border-color: #6f93cb;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
    }

    :host-context(.dark-theme) h1 {
      color: #f8fbff;
    }

    :host-context(.dark-theme) .sub,
    :host-context(.dark-theme) .upload-title {
      color: #d0def6;
    }

    :host-context(.dark-theme) .upload-row {
      background: #203650;
      border-color: #7ea1d8;
    }

    :host-context(.dark-theme) .upload-row input[type='file'] {
      color: #e8f1ff;
    }

    :host-context(.dark-theme) .close-btn {
      background: #21364f;
      border-color: #7ea1d8;
      color: #e8f1ff;
    }

    :host-context(.dark-theme) .close-btn:hover {
      background: #274262;
    }

    :host ::ng-deep .form-card .mdc-notched-outline {
      display: none !important;
    }

    :host ::ng-deep .form-card .mat-mdc-text-field-wrapper {
      border: 2px solid #c1d4ee !important;
      border-radius: 14px !important;
      background: #ffffff !important;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    :host ::ng-deep .form-card .mdc-text-field--outlined:hover .mat-mdc-text-field-wrapper {
      border-color: #87a8da !important;
    }

    :host ::ng-deep .form-card .mdc-text-field--focused .mat-mdc-text-field-wrapper {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
    }

    :host ::ng-deep .form-card .mdc-floating-label {
      color: #4f6790 !important;
      font-weight: 600 !important;
    }

    :host ::ng-deep .form-card .mdc-text-field--focused .mdc-floating-label {
      color: #1d4ed8 !important;
    }

    :host ::ng-deep .form-card .mdc-text-field__input,
    :host ::ng-deep .form-card .mat-mdc-select-value-text {
      color: #1f365d !important;
    }

    :host ::ng-deep .form-card .mdc-text-field__input::placeholder {
      color: #758cae !important;
      opacity: 1;
    }

    :host-context(.dark-theme) ::ng-deep .form-card .mat-mdc-text-field-wrapper {
      border-color: #7ea1d8 !important;
      background: #203650 !important;
    }

    :host-context(.dark-theme) ::ng-deep .form-card .mdc-text-field--outlined:hover .mat-mdc-text-field-wrapper {
      border-color: #9ec5ff !important;
    }

    :host-context(.dark-theme) ::ng-deep .form-card .mdc-floating-label {
      color: #c9ddff !important;
    }

    :host-context(.dark-theme) ::ng-deep .form-card .mdc-text-field--focused .mdc-floating-label {
      color: #9ec5ff !important;
    }

    :host-context(.dark-theme) ::ng-deep .form-card .mdc-text-field__input,
    :host-context(.dark-theme) ::ng-deep .form-card .mat-mdc-select-value-text {
      color: #e8f1ff !important;
    }

    :host ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel {
      background: #ffffff !important;
    }

    :host ::ng-deep .cdk-overlay-pane .mat-mdc-option .mdc-list-item__primary-text {
      color: #1f365d !important;
    }

    :host-context(.dark-theme) ::ng-deep .cdk-overlay-pane .mat-mdc-select-panel {
      background: #1b2a46 !important;
    }

    :host-context(.dark-theme) ::ng-deep .cdk-overlay-pane .mat-mdc-option .mdc-list-item__primary-text {
      color: #e8f1ff !important;
    }

    @media (max-width: 980px) {
      .meta-grid {
        grid-template-columns: 1fr;
      }
      h1 {
        font-size: 19px;
      }
    }

    @media (max-width: 680px) {
      .form-card {
        padding: 14px 12px;
      }
      h1 {
        font-size: 17px;
      }
      .submit-btn {
        font-size: 14px;
      }
    }
  `],
})
export class CreateTicketComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private notify = inject(NotificationService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private file?: File;
  adminUsers: User[] = [];
  isAgent = this.auth.user()?.role === 'agent';

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: ['medium', Validators.required],
    assigned_to_id: [''],
  });

  ngOnInit(): void {
    if (!this.isAgent) {
      return;
    }
    this.auth.getStaffUsers().subscribe({
      next: (users) => {
        this.adminUsers = users.filter((u) => u.role === 'admin');
      },
      error: () => {
        this.notify.error('Unable to load admin users for assignment.');
      },
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.file = input.files?.[0];
  }

  submit(): void {
    if (this.form.invalid) return;
    const formData = new FormData();
    Object.entries(this.form.getRawValue()).forEach(([key, value]) => {
      if (value !== '') {
        formData.append(key, value);
      }
    });
    if (this.file) {
      formData.append('attachment', this.file);
    }
    this.ticketService.create(formData).subscribe({
      next: (ticket) => {
        this.notify.success('Ticket created successfully.');
        void this.router.navigate(['/tickets', ticket.id]);
      },
      error: () => this.notify.error('Unable to create ticket.'),
    });
  }

  goBackToTickets(): void {
    void this.router.navigate(['/tickets']);
  }
}
