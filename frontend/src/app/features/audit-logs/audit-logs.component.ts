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
                <td class="time-col">{{ row.happenedAt | date:'medium' }}</td>
                <td><span class="pill action" [ngClass]="actionClass(row.action)">{{ row.action }}</span></td>
                <td class="ticket-col">#{{ row.ticketId }} - {{ row.title }}</td>
                <td class="actor-col">{{ row.actor }}</td>
                <td><span class="pill status" [ngClass]="statusClass(row.status)">{{ row.status | titlecase }}</span></td>
                <td><span class="pill priority" [ngClass]="priorityClass(row.priority)">{{ row.priority | titlecase }}</span></td>
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
      padding: 26px;
      border-radius: 22px;
      border: 1px solid var(--border);
      background:
        radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.11), transparent 45%),
        radial-gradient(circle at 100% 100%, rgba(14, 165, 233, 0.10), transparent 40%),
        var(--surface);
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.08);
    }
    .section-header { display: flex; justify-content: space-between; gap: 14px; align-items: start; margin-bottom: 12px; }
    h1 { margin: 10px 0 0; font-size: 28px; color: #17366e; }
    .intro { margin: 8px 0 0; color: var(--muted); max-width: 70ch; line-height: 1.6; }
    .table-wrap {
      overflow: auto;
      margin-top: 16px;
      border: 1px solid #c7d8ff;
      border-radius: 16px;
      background: linear-gradient(180deg, #ffffff, #f8fbff);
    }
    table { width: 100%; border-collapse: collapse; min-width: 820px; }
    th, td { text-align: left; padding: 14px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    thead th {
      background: linear-gradient(145deg, #edf4ff, #f6f9ff);
      color: #17366e;
      font-weight: 800;
      letter-spacing: 0.02em;
    }
    tbody tr:nth-child(odd) { background: rgba(239, 246, 255, 0.55); }
    tbody tr:nth-child(even) { background: rgba(250, 253, 255, 0.90); }
    tbody tr:hover { background: #eaf2ff; }
    .time-col,
    .ticket-col,
    .actor-col { color: #1f355f; font-weight: 600; }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.02em;
      border: 1px solid transparent;
      white-space: nowrap;
    }
    .pill.action.created { background: #e8f1ff; color: #1e63da; border-color: #b8d2ff; }
    .pill.action.assigned { background: #fff5df; color: #a76300; border-color: #ffd992; }
    .pill.action.inprogress { background: #f4ebff; color: #7542d8; border-color: #ddc9ff; }
    .pill.action.closed { background: #e8f8ef; color: #0e8f52; border-color: #b9ebcc; }
    .pill.status.open { background: #e8f1ff; color: #1e63da; border-color: #b8d2ff; }
    .pill.status.in_progress { background: #fff5df; color: #a76300; border-color: #ffd992; }
    .pill.status.closed { background: #e8f8ef; color: #0e8f52; border-color: #b9ebcc; }
    .pill.priority.low { background: #e8f8ef; color: #0e8f52; border-color: #b9ebcc; }
    .pill.priority.medium { background: #fff5df; color: #a76300; border-color: #ffd992; }
    .pill.priority.high { background: #ffe8e8; color: #c43232; border-color: #ffc2c2; }
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
    :host-context(.dark-theme) .time-col,
    :host-context(.dark-theme) .ticket-col,
    :host-context(.dark-theme) .actor-col {
      color: #e8f1ff;
    }
    :host-context(.dark-theme) .pill.action.created,
    :host-context(.dark-theme) .pill.status.open {
      background: #19345f;
      border-color: #315b96;
      color: #a9cbff;
    }
    :host-context(.dark-theme) .pill.action.assigned,
    :host-context(.dark-theme) .pill.status.in_progress,
    :host-context(.dark-theme) .pill.priority.medium {
      background: #4d3b1f;
      border-color: #8f6a2f;
      color: #ffd899;
    }
    :host-context(.dark-theme) .pill.action.inprogress {
      background: #352652;
      border-color: #6641a8;
      color: #ceb7ff;
    }
    :host-context(.dark-theme) .pill.action.closed,
    :host-context(.dark-theme) .pill.status.closed,
    :host-context(.dark-theme) .pill.priority.low {
      background: #1d4b3a;
      border-color: #2b7c5d;
      color: #a8f3ce;
    }
    :host-context(.dark-theme) .pill.priority.high {
      background: #5a2326;
      border-color: #9d3c45;
      color: #ffc0c7;
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

  statusClass(status: Ticket['status']): string {
    return status;
  }

  priorityClass(priority: Ticket['priority']): string {
    return priority;
  }

  actionClass(action: string): string {
    const value = action.toLowerCase();
    if (value.includes('closed')) return 'closed';
    if (value.includes('in progress')) return 'inprogress';
    if (value.includes('assigned')) return 'assigned';
    return 'created';
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
