import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.models';
import { Ticket, TicketUpdatePayload } from '../../core/models/ticket.models';
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
    <section class="page-shell" *ngIf="ticket">
      <div class="two-col">
        <mat-card class="glass-card detail-card">
          <div class="card-header">
            <div>
              <div class="chip">Ticket #{{ ticket.id }}</div>
              <h1>{{ ticket.title }}</h1>
              <p>{{ ticket.description }}</p>
            </div>
          </div>

          <div class="meta-grid">
            <div>
              <strong>Status:</strong>
              <span class="badge status-badge" [ngClass]="ticket.status">{{ statusLabel(ticket.status) }}</span>
            </div>
            <div>
              <strong>Priority:</strong>
              <span class="badge priority-badge" [ngClass]="ticket.priority">{{ ticket.priority | titlecase }}</span>
            </div>
            <div><strong>Created:</strong> {{ ticket.created_at | date:'medium' }}</div>
            <div><strong>Assigned:</strong> {{ ticket.assigned_to?.full_name || 'Unassigned' }}</div>
          </div>

          <form [formGroup]="editForm" class="edit-grid" (ngSubmit)="updateTicket()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option value="low">Low</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="high">High</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput rows="5" formControlName="description"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" *ngIf="isStaff">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="open">Open</mat-option>
                <mat-option value="in_progress">In Progress</mat-option>
                <mat-option value="closed">Closed</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" *ngIf="isStaff">
              <mat-label>Assign to</mat-label>
              <mat-select formControlName="assigned_to_id">
                <mat-option [value]="null">Unassigned</mat-option>
                <mat-option *ngFor="let staff of staffUsers" [value]="staff.id">
                  {{ staff.full_name }} ({{ staff.role | titlecase }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="form-actions full-width">
              <button mat-flat-button class="save-btn" type="submit">Save Ticket</button>
              <button mat-stroked-button class="delete-btn" type="button" (click)="deleteTicket()">Delete</button>
            </div>
          </form>
        </mat-card>

      </div>
    </section>
  `,
  styles: [`
    .two-col {
      grid-template-columns: 1fr !important;
    }
    .detail-card {
      padding: 24px;
      border: 1px solid var(--border);
      background: #ffffff;
      box-shadow: var(--shadow);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: start;
    }
    .card-header h1 { margin: 14px 0 8px; font-size: 34px; color: #17366e; }
    .card-header p { margin: 0; color: var(--muted); max-width: 60ch; line-height: 1.6; }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      margin: 18px 0 22px;
    }
    .meta-grid div {
      padding: 14px 16px;
      border-radius: 16px;
      background: #f8fbff;
      border: 1px solid #e7edf7;
    }
    .badge {
      margin-left: 8px;
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid transparent;
      vertical-align: middle;
    }
    .status-badge.open {
      color: #ffffff;
      background: #2563eb;
      border-color: #3b82f6;
    }
    .status-badge.in_progress {
      color: #ffffff;
      background: #d97706;
      border-color: #f59e0b;
    }
    .status-badge.closed {
      color: #ffffff;
      background: #16a34a;
      border-color: #22c55e;
    }
    .priority-badge.low {
      color: #ffffff;
      background: #475569;
      border-color: #64748b;
    }
    .priority-badge.medium {
      color: #ffffff;
      background: #ea580c;
      border-color: #f97316;
    }
    .priority-badge.high {
      color: #ffffff;
      background: #dc2626;
      border-color: #ef4444;
    }
    .edit-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .full-width { grid-column: 1 / -1; }
    .form-actions { display: flex; gap: 12px; }
    .save-btn {
      --mdc-filled-button-container-color: #15803d;
      --mdc-filled-button-label-text-color: #ffffff;
    }
    .delete-btn {
      border: 2px solid #dc2626 !important;
      color: #ffffff !important;
      background: #dc2626 !important;
      font-weight: 600;
    }
    .delete-btn:hover {
      background: #b91c1c !important;
      border-color: #b91c1c !important;
    }
    :host-context(.dark-theme) .detail-card {
      background: #1b2a46;
      border-color: #6f93cb;
    }
    :host-context(.dark-theme) .meta-grid div {
      background: #223555;
      border-color: #6f93cb;
      color: #e8f1ff;
    }
    :host-context(.dark-theme) .card-header h1,
    :host-context(.dark-theme) .card-header h1 {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .card-header p {
      color: #d0def6;
    }
    :host-context(.dark-theme) .status-badge.closed {
      color: #ffffff !important;
      background: #16a34a !important;
      border-color: #22c55e !important;
    }
    :host-context(.dark-theme) .priority-badge.high {
      color: #ffffff;
      background: #dc2626;
      border-color: #ef4444;
    }
    :host-context(.dark-theme) .status-badge.open {
      color: #ffffff;
      background: #2563eb;
      border-color: #3b82f6;
    }
    :host-context(.dark-theme) .status-badge.in_progress {
      color: #ffffff;
      background: #d97706;
      border-color: #f59e0b;
    }
    :host-context(.dark-theme) .priority-badge.medium {
      color: #ffffff;
      background: #ea580c;
      border-color: #f97316;
    }
    :host-context(.dark-theme) .priority-badge.low {
      color: #ffffff;
      background: #475569;
      border-color: #64748b;
    }
    :host-context(.dark-theme) .delete-btn {
      border: 2px solid #dc2626 !important;
      color: #ffffff !important;
      background: #dc2626 !important;
    }
    :host-context(.dark-theme) .delete-btn:hover {
      background: #b91c1c !important;
      border-color: #b91c1c !important;
    }
    @media (max-width: 960px) {
      .meta-grid, .edit-grid { grid-template-columns: 1fr; }
      .card-header { flex-direction: column; }
    }
  `],
})
export class TicketDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private notify = inject(NotificationService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  ticket?: Ticket;
  isStaff =
    ['admin', 'agent'].includes(this.auth.user()?.role ?? '') || !!this.auth.user()?.is_superuser;
  staffUsers: User[] = [];

  editForm = this.fb.nonNullable.group({
    title: [''],
    description: [''],
    priority: 'medium' as Ticket['priority'],
    status: 'open' as TicketUpdatePayload['status'],
    assigned_to_id: [null as number | null],
  });

  constructor() {
    if (this.isStaff) {
      this.auth.getStaffUsers().subscribe((users) => {
        this.staffUsers = users;
      });
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    }
  }

  load(id: string): void {
    this.ticketService.get(id).subscribe((ticket) => {
      this.ticket = ticket;
      this.editForm.patchValue({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        assigned_to_id: ticket.assigned_to?.id ?? null,
      });
    });
  }

  updateTicket(): void {
    if (!this.ticket || this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload: TicketUpdatePayload = {
      title: this.editForm.controls.title.value,
      description: this.editForm.controls.description.value,
      priority: this.editForm.controls.priority.value,
    };

    if (this.isStaff) {
      payload.status = this.editForm.controls.status.value;
      payload.assigned_to_id = this.editForm.controls.assigned_to_id.value;
    }

    this.ticketService.update(this.ticket.id, payload).subscribe({
      next: () => {
        this.notify.success('Ticket updated.');
        this.load(String(this.ticket?.id));
      },
      error: () => this.notify.error('Unable to update ticket.'),
    });
  }

  deleteTicket(): void {
    if (!this.ticket || !window.confirm('Delete this ticket?')) {
      return;
    }
    this.ticketService.delete(this.ticket.id).subscribe({
      next: () => {
        this.notify.success('Ticket deleted.');
        void this.router.navigate(['/tickets']);
      },
      error: () => this.notify.error('Unable to delete ticket.'),
    });
  }

  statusLabel(status: Ticket['status']): string {
    return status === 'in_progress' ? 'In Progress' : status[0].toUpperCase() + status.slice(1);
  }

}
