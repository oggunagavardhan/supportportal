import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Ticket } from '../../core/models/ticket.models';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';

interface AuditLogEntry {
  id: number;
  ticketId: number;
  title: string;
  action: string;
  status: Ticket['status'];
  priority: Ticket['priority'];
  actor: string;
  happenedAt: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <section class="page-shell audit-shell">
      <mat-card class="audit-card">
        <div class="section-header">
          <div>
            <div class="chip">System Configuration</div>
            <h1>Audit Logs</h1>
            <p class="intro">Latest ticket activity snapshots for operational review.</p>
          </div>
          <button mat-stroked-button type="button" (click)="load()">Refresh</button>
        </div>

        <div class="table-wrap" *ngIf="entries.length; else emptyState">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Ticket</th>
                <th>Actor</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of entries">
                <td>{{ row.happenedAt | date:'medium' }}</td>
                <td>{{ row.action }}</td>
                <td>#{{ row.ticketId }} - {{ row.title }}</td>
                <td>{{ row.actor }}</td>
                <td>{{ row.status | titlecase }}</td>
                <td>{{ row.priority | titlecase }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #emptyState>
          <p class="empty">No audit records found.</p>
        </ng-template>
      </mat-card>
    </section>
  `,
  styles: [`
    .audit-shell { padding: 18px; }
    .audit-card {
      padding: 22px;
      border-radius: 22px;
      border: 1px solid var(--border);
      background:
        radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.11), transparent 45%),
        radial-gradient(circle at 100% 100%, rgba(14, 165, 233, 0.10), transparent 40%),
        var(--surface);
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
    }
    .section-header { display: flex; justify-content: space-between; gap: 14px; align-items: start; }
    h1 { margin: 10px 0 0; font-size: 32px; color: #17366e; }
    .intro { margin: 8px 0 0; color: var(--muted); max-width: 70ch; line-height: 1.6; }
    .table-wrap {
      overflow: auto;
      margin-top: 14px;
      border: 1px solid #c7d8ff;
      border-radius: 16px;
      background: linear-gradient(180deg, #ffffff, #f8fbff);
    }
    table { width: 100%; border-collapse: collapse; min-width: 820px; }
    th, td { text-align: left; padding: 12px; border-bottom: 1px solid var(--border); }
    thead th {
      background: linear-gradient(145deg, #edf4ff, #f6f9ff);
      color: #17366e;
      font-weight: 800;
    }
    tbody tr:nth-child(odd) { background: rgba(239, 246, 255, 0.55); }
    tbody tr:nth-child(even) { background: rgba(250, 253, 255, 0.90); }
    tbody tr:hover { background: #eaf2ff; }
    .empty { color: var(--muted); margin-top: 14px; }
    :host-context(.dark-theme) .audit-card {
      background: #1b2a46;
      border-color: #6f93cb;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
    }
    :host-context(.dark-theme) h1 {
      color: #f8fbff;
    }
    :host-context(.dark-theme) .intro,
    :host-context(.dark-theme) .empty {
      color: #d0def6;
    }
    :host-context(.dark-theme) .table-wrap {
      border-color: #6f93cb;
      background: #1a2741;
    }
    :host-context(.dark-theme) th,
    :host-context(.dark-theme) td {
      color: #e8f1ff !important;
      border-bottom-color: #486791;
    }
    :host-context(.dark-theme) thead th {
      background: #223555;
      color: #f8fbff !important;
    }
    :host-context(.dark-theme) tbody tr:nth-child(odd) {
      background: rgba(34, 53, 85, 0.9);
    }
    :host-context(.dark-theme) tbody tr:nth-child(even) {
      background: rgba(26, 39, 65, 0.95);
    }
    :host-context(.dark-theme) tbody tr:hover {
      background: #2a426b;
    }
  `],
})
export class AuditLogsComponent {
  private ticketService = inject(TicketService);
  private notify = inject(NotificationService);

  entries: AuditLogEntry[] = [];

  constructor() {
    this.load();
  }

  load(): void {
    this.ticketService.list({ page: 1, ordering: '-updated_at' }).subscribe({
      next: (res) => {
        this.entries = res.results.map((ticket) => ({
          id: ticket.id,
          ticketId: ticket.id,
          title: ticket.title,
          action: this.getAction(ticket),
          status: ticket.status,
          priority: ticket.priority,
          actor: ticket.assigned_to?.full_name || ticket.created_by.full_name,
          happenedAt: ticket.updated_at,
        }));
      },
      error: (err) => {
        const message = err?.error?.detail || 'Unable to load audit logs.';
        this.notify.error(message);
      },
    });
  }

  private getAction(ticket: Ticket): string {
    if (ticket.status === 'closed') {
      return 'Ticket closed';
    }
    if (ticket.assigned_to && ticket.status === 'in_progress') {
      return 'Ticket assigned and in progress';
    }
    if (ticket.assigned_to) {
      return 'Ticket assigned';
    }
    return 'Ticket created';
  }
}
