import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Notification } from '../../core/models/ticket.models';
import { I18nPipe } from '../../core/pipes/i18n.pipe';
import { I18nService } from '../../core/services/i18n.service';
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
    I18nPipe,
  ],
  template: `
    <section class="page-shell notifications-admin">
      <header class="section-header">
        <div>
          <div class="chip">{{ 'notifications.manage.chip' | t }}</div>
          <h1>{{ 'notifications.manage.title' | t }}</h1>
          <p class="intro">{{ 'notifications.manage.subtitle' | t }}</p>
        </div>
        <button mat-stroked-button type="button" (click)="refresh()">{{ 'notifications.manage.refresh' | t }}</button>
      </header>

      <mat-card class="form-card">
        <div class="form-head">
          <h2>{{ editingId ? ('notifications.manage.edit_title' | t) : ('notifications.manage.create_title' | t) }}</h2>
          <button *ngIf="editingId" mat-button type="button" class="link-btn" (click)="resetForm()">{{ 'notifications.manage.cancel_edit' | t }}</button>
        </div>

        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'notifications.manage.fields.title' | t }}</mat-label>
              <input matInput formControlName="title" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'notifications.manage.fields.type' | t }}</mat-label>
              <mat-select formControlName="type">
                <mat-option *ngFor="let option of typeOptions" [value]="option.value">
                  {{ option.label | t }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'notifications.manage.fields.audience' | t }}</mat-label>
              <mat-select formControlName="audience" [disabled]="!!editingId">
                <mat-option *ngFor="let option of audienceOptions" [value]="option.value">
                  {{ option.label | t }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full">
              <mat-label>{{ 'notifications.manage.fields.message' | t }}</mat-label>
              <textarea matInput rows="3" formControlName="message"></textarea>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
              {{ editingId ? ('notifications.manage.update' | t) : ('notifications.manage.create' | t) }}
            </button>
            <button mat-stroked-button type="button" (click)="resetForm()">{{ 'notifications.manage.reset' | t }}</button>
          </div>
        </form>
      </mat-card>

      <mat-card class="list-card">
        <div class="list-head">
          <div class="list-top">
            <h2>{{ 'notifications.manage.list_title' | t }}</h2>
          </div>
          <div class="filter-bar">
            <div class="filter-title">{{ 'notifications.manage.filter_label' | t }}</div>
            <div class="filter-pills">
              <button type="button" class="pill-btn" [class.active]="roleFilter === 'all'" (click)="setRoleFilter('all')">{{ 'notifications.manage.filter_all' | t }}</button>
              <button type="button" class="pill-btn" [class.active]="roleFilter === 'admin'" (click)="setRoleFilter('admin')">{{ 'notifications.manage.filter_admin' | t }}</button>
              <button type="button" class="pill-btn" [class.active]="roleFilter === 'agent'" (click)="setRoleFilter('agent')">{{ 'notifications.manage.filter_agent' | t }}</button>
              <button type="button" class="pill-btn" [class.active]="roleFilter === 'customer'" (click)="setRoleFilter('customer')">{{ 'notifications.manage.filter_customer' | t }}</button>
            </div>
          </div>
        </div>

        <div class="list" *ngIf="filteredNotifications.length; else emptyList">
          <div class="row" *ngFor="let item of filteredNotifications">
            <div class="row-main">
              <div class="row-top">
                <div class="row-title">
                  <strong>{{ item.title }}</strong>
                  <div class="row-meta">
                    <span class="meta-pill">{{ ('notifications.manage.type_' + item.type) | t }}</span>
                    <span *ngIf="roleFilter === 'all'" class="user-pill">{{ 'notifications.manage.recipients_all' | t }}</span>
                    <ng-container *ngIf="roleFilter !== 'all'">
                      <span *ngIf="item.user_name" class="user-pill">{{ item.user_name }}</span>
                      <span *ngIf="item.user_role" class="role-pill" [class.agent]="item.user_role === 'agent'" [class.customer]="item.user_role === 'customer'" [class.admin]="item.user_role === 'admin'">
                        {{ ('notifications.manage.role_' + item.user_role) | t }}
                      </span>
                    </ng-container>
                    <span class="meta-date">{{ item.created_at | date:'short' }}</span>
                  </div>
                </div>
              </div>
              <p>{{ item.message }}</p>
            </div>
            <div class="row-actions">
              <button mat-stroked-button type="button" class="action-btn edit-btn" (click)="edit(item)">{{ 'notifications.manage.edit' | t }}</button>
              <button mat-stroked-button type="button" class="action-btn delete-btn" (click)="remove(item)">{{ 'notifications.manage.delete' | t }}</button>
            </div>
          </div>
        </div>

        <ng-template #emptyList>
          <div class="empty">
            <strong>{{ 'notifications.manage.empty_title' | t }}</strong>
            <p>{{ 'notifications.manage.empty_copy' | t }}</p>
          </div>
        </ng-template>
      </mat-card>
    </section>
  `,
  styles: [`
    .notifications-admin { display: grid; gap: 18px; }
    .section-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; }
    .section-header h1 { margin: 10px 0 0; font-size: 28px; color: #143b7a; }
    .intro { margin: 8px 0 0; color: #3b5f95; }
    .form-card, .list-card {
      padding: 20px;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .form-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .form-head h2 { margin: 0; font-size: 18px; color: var(--text); }
    .link-btn { font-weight: 600; }
    .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .form-grid .full { grid-column: 1 / -1; }
    .form-actions { display: flex; gap: 10px; margin-top: 10px; }
    .list-head { display: grid; gap: 12px; }
    .list-head h2 { margin: 0; font-size: 18px; color: var(--text); }
    .list-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 16px;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      min-height: 56px;
    }
    .filter-title {
      font-size: 13px;
      font-weight: 800;
      color: #475569;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }
    .filter-pills { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
    .pill-btn {
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #334155;
      padding: 10px 18px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 40px;
    }
    .pill-btn.active {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      border-color: transparent;
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(79, 70, 229, 0.22);
    }
    .ghost-btn {
      border-radius: 999px !important;
      font-weight: 700;
      color: #4f46e5 !important;
      border-color: #c7d2fe !important;
      background: #eef2ff !important;
    }
    .list { margin-top: 12px; display: grid; gap: 12px; }
    .row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 20px;
      background: #ffffff;
      box-shadow: 0 10px 22px rgba(76, 29, 149, 0.08);
      position: relative;
      overflow: hidden;
      min-height: 150px;
    }
    .row-main { padding-left: 0; }
    .row-main strong { display: block; color: #1f1147; font-size: 17px; }
    .row-main p { margin: 12px 0 0; color: #4b5563; line-height: 1.6; }
    .row-top { display: flex; justify-content: space-between; gap: 18px; align-items: flex-start; }
    .row-title { display: grid; gap: 10px; }
    .row-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .meta-pill {
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      background: #ede9fe;
      color: #1d4ed8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .meta-date { font-size: 12px; color: #64748b; }
    .user-pill {
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      background: #e0f2fe;
      color: #0369a1;
    }
    .role-pill {
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      background: #e0f2fe;
      color: #0369a1;
    }
    .role-pill.agent {
      background: #dcfce7;
      color: #15803d;
    }
    .role-pill.customer {
      background: #fef3c7;
      color: #b45309;
    }
    .role-pill.admin {
      background: #dbeafe;
      color: #1d4ed8;
    }
    .tag {
      padding: 2px 8px;
      border-radius: 999px;
      background: #fee2e2;
      color: #b91c1c;
      font-size: 11px;
      font-weight: 700;
    }
    .tag.read {
      background: #dcfce7;
      color: #15803d;
    }
    .row-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; align-self: start; padding-top: 6px; }
    .action-btn {
      border-radius: 999px !important;
      padding: 8px 16px !important;
      font-weight: 800 !important;
      border: none !important;
      color: #ffffff !important;
      box-shadow: 0 8px 16px rgba(15, 23, 42, 0.12);
    }
    .edit-btn {
      background: linear-gradient(135deg, #16a34a, #22c55e) !important;
    }
    .mark-btn {
      background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
    }
    .delete-btn {
      background: linear-gradient(135deg, #ef4444, #dc2626) !important;
    }
    :host-context(.dark-theme) .list-card,
    :host-context(.dark-theme) .form-card {
      background: #1b2a46;
      border-color: #334155;
    }
    :host-context(.dark-theme) .section-header h1 {
      color: #93c5fd;
    }
    :host-context(.dark-theme) .row {
      background: #1e293b;
      border-color: #334155;
      box-shadow: none;
    }
    :host-context(.dark-theme) .row-main strong {
      color: #f8fafc;
    }
    :host-context(.dark-theme) .row-main p,
    :host-context(.dark-theme) .meta-date,
    :host-context(.dark-theme) .intro {
      color: #cbd5f5;
    }
    :host-context(.dark-theme) .meta-pill {
      background: rgba(124, 58, 237, 0.25);
      color: #bfdbfe;
    }
    :host-context(.dark-theme) .user-pill {
      background: rgba(56, 189, 248, 0.2);
      color: #bae6fd;
    }
    :host-context(.dark-theme) .role-pill {
      background: rgba(59, 130, 246, 0.2);
      color: #bfdbfe;
    }
    :host-context(.dark-theme) .role-pill.agent {
      background: rgba(34, 197, 94, 0.2);
      color: #bbf7d0;
    }
    :host-context(.dark-theme) .role-pill.customer {
      background: rgba(251, 191, 36, 0.2);
      color: #fde68a;
    }
    :host-context(.dark-theme) .role-pill.admin {
      background: rgba(96, 165, 250, 0.2);
      color: #bfdbfe;
    }
    :host-context(.dark-theme) .filter-bar {
      background: #0f172a;
      border-color: #334155;
    }
    :host-context(.dark-theme) .filter-title,
    :host-context(.dark-theme) .pill-btn {
      color: #e2e8f0;
    }
    :host-context(.dark-theme) .pill-btn {
      background: #1e293b;
      border-color: #334155;
    }
    :host-context(.dark-theme) .pill-btn.active {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      border-color: transparent;
    }
    .empty { text-align: center; padding: 24px; color: var(--muted); }
    .empty strong { display: block; color: var(--text); }
    @media (max-width: 900px) {
      .section-header { flex-direction: column; align-items: flex-start; }
      .form-grid { grid-template-columns: 1fr; }
      .row { grid-template-columns: 1fr; }
      .row-actions { justify-content: flex-start; }
    }
  `],
})
export class NotificationManagementComponent {
  private ticketService = inject(TicketService);
  private notify = inject(NotificationService);
  private i18n = inject(I18nService);
  private fb = inject(FormBuilder);

  notifications: Notification[] = [];
  editingId: number | null = null;
  roleFilter: 'all' | 'admin' | 'agent' | 'customer' = 'all';

  typeOptions = [
    { value: 'ticket', label: 'notifications.manage.type_ticket' },
    { value: 'system', label: 'notifications.manage.type_system' },
    { value: 'message', label: 'notifications.manage.type_message' },
  ];
  audienceOptions = [
    { value: 'all', label: 'notifications.manage.audience_all' },
    { value: 'agent', label: 'notifications.manage.audience_agent' },
    { value: 'customer', label: 'notifications.manage.audience_customer' },
    { value: 'self', label: 'notifications.manage.audience_self' },
  ];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    message: ['', [Validators.required]],
    type: this.fb.nonNullable.control<Notification['type']>('system'),
    audience: this.fb.nonNullable.control<'all' | 'agent' | 'customer' | 'self'>('all'),
  });

  constructor() {
    this.refresh();
  }

  get filteredNotifications(): Notification[] {
    if (this.roleFilter !== 'all') {
      return this.notifications.filter((item) => item.user_role === this.roleFilter);
    }
    const unique = new Map<string, Notification>();
    this.notifications.forEach((item) => {
      const key = `${item.type}|${item.title}|${item.message}|${item.created_at}`;
      if (!unique.has(key)) {
        unique.set(key, item);
      }
    });
    return Array.from(unique.values());
  }

  refresh(): void {
    this.ticketService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res.results;
      },
      error: (err) => {
        const message = err?.error?.detail || this.i18n.translate('notifications.manage.load_failed');
        this.notify.error(message);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const payload = this.form.getRawValue();
    if (this.editingId) {
      const { title, message, type } = payload;
      this.ticketService.updateNotification(this.editingId, { title, message, type }).subscribe({
        next: () => {
          this.notify.success(this.i18n.translate('notifications.manage.updated'));
          this.resetForm();
          this.refresh();
        },
        error: (err) => this.notify.error(err?.error?.detail || this.i18n.translate('notifications.manage.update_failed')),
      });
      return;
    }
    this.ticketService.createNotification(payload).subscribe({
      next: () => {
        this.notify.success(this.i18n.translate('notifications.manage.created'));
        this.resetForm();
        this.refresh();
      },
      error: (err) => this.notify.error(err?.error?.detail || this.i18n.translate('notifications.manage.create_failed')),
    });
  }

  edit(item: Notification): void {
    this.editingId = item.id;
    this.form.setValue({ title: item.title, message: item.message, type: item.type, audience: 'self' });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({ title: '', message: '', type: 'system', audience: 'all' });
  }

  remove(item: Notification): void {
    this.ticketService.deleteNotification(item.id).subscribe({
      next: () => {
        this.notify.success(this.i18n.translate('notifications.manage.deleted'));
        this.refresh();
      },
      error: (err) => this.notify.error(err?.error?.detail || this.i18n.translate('notifications.manage.delete_failed')),
    });
  }

  toggleRead(item: Notification): void {
    this.ticketService.updateNotification(item.id, { read: !item.read }).subscribe({
      next: () => this.refresh(),
      error: (err) => this.notify.error(err?.error?.detail || this.i18n.translate('notifications.manage.update_failed')),
    });
  }

  markAllRead(): void {
    this.ticketService.markAllNotificationsRead().subscribe({
      next: () => this.refresh(),
      error: (err) => this.notify.error(err?.error?.detail || this.i18n.translate('notifications.manage.update_failed')),
    });
  }

  setRoleFilter(filter: 'all' | 'admin' | 'agent' | 'customer'): void {
    this.roleFilter = filter;
  }
}
