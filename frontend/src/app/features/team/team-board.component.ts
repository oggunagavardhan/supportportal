import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { User } from '../../core/models/auth.models';
import { Ticket, TicketUpdatePayload } from '../../core/models/ticket.models';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TicketService } from '../../core/services/ticket.service';

interface TeamMemberSummary {
  user: User;
  assignedCount: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatCardModule, MatSelectModule, MatFormFieldModule],
  template: `
    <section class="team-shell">
      <div class="section-header">
        <div>
          <div class="chip">Pending Issues</div>
          <h1>Agent issue tracker</h1>
          <p class="intro">All user tickets and current queue details for agents and admin.</p>
        </div>
      </div>

      <div class="metrics">
        <mat-card class="metric-card">
          <div class="metric-label">Agents</div>
          <div class="metric-value">{{ agents.length }}</div>
        </mat-card>
        <mat-card class="metric-card">
          <div class="metric-label">Visible Tickets</div>
          <div class="metric-value">{{ visibleTickets.length }}</div>
        </mat-card>
        <mat-card class="metric-card">
          <div class="metric-label">Open</div>
          <div class="metric-value">{{ statusCounts.open }}</div>
        </mat-card>
        <mat-card class="metric-card">
          <div class="metric-label">In Progress</div>
          <div class="metric-value">{{ statusCounts.in_progress }}</div>
        </mat-card>
        <mat-card class="metric-card">
          <div class="metric-label">Closed</div>
          <div class="metric-value">{{ statusCounts.closed }}</div>
        </mat-card>
        <mat-card class="metric-card">
          <div class="metric-label">Unassigned</div>
          <div class="metric-value">{{ unassignedCount }}</div>
        </mat-card>
      </div>

      <div class="team-grid">
        <mat-card class="team-card">
          <h2>Pending Issues</h2>
          <div class="filter-actions">
            <button type="button" class="filter-btn" [class.active]="statusFilter === 'open'" (click)="statusFilter='open'">Open</button>
            <button type="button" class="filter-btn" [class.active]="statusFilter === 'in_progress'" (click)="statusFilter='in_progress'">In Progress</button>
            <button type="button" class="filter-btn" [class.active]="statusFilter === 'closed'" (click)="statusFilter='closed'">Closed</button>
          </div>

          <div class="member-list" *ngIf="filteredTickets.length; else noTickets">
            <div class="member-row" *ngFor="let ticket of filteredTickets">
              <div class="pending-ticket-main">
                <strong>#{{ ticket.id }} {{ ticket.title }}</strong>
                <div>{{ ticket.created_by.email }} - {{ ticketStatusLabel(ticket.status) }} - {{ ticket.priority | titlecase }}</div>
                <div class="small-text">Age: {{ ticketAgeHours(ticket) }}h - Updated: {{ ticket.updated_at | date:'short' }}</div>
              </div>
              <div class="actions-section">
                <mat-form-field
                  *ngIf="ticket.created_by.role === 'customer'"
                  appearance="outline"
                  class="assign-dropdown"
                  (click)="$event.stopPropagation()">
                  <mat-label>Assign to...</mat-label>
                  <mat-select [value]="ticket.assigned_to?.id" (selectionChange)="assignTicket(ticket, $event.value)">
                    <mat-option [value]="null">Unassigned</mat-option>
                    <mat-option *ngFor="let s of agents" [value]="s.id">
                      {{ s.full_name }} ({{ s.role | titlecase }})
                    </mat-option>
                  </mat-select>
                </mat-form-field>
                <button type="button" class="solve-btn" (click)="toggleIssueStatus(ticket, $event)">
                  {{ ticket.status === 'closed' ? 'Mark Pending' : 'Mark Completed' }}
                </button>
                <button type="button" class="reply-btn" (click)="goToTicket(ticket.id, $event)">Reply</button>
              </div>
            </div>
          </div>
          <ng-template #noTickets>
            <p class="empty">No pending user tickets available.</p>
          </ng-template>
        </mat-card>

        <mat-card class="team-card">
          <h2>Staff Directory</h2>
          <div class="member-list" *ngIf="memberSummaries.length; else noStaff">
            <div class="member-row" *ngFor="let member of memberSummaries">
              <div>
                <strong>{{ member.user.full_name }}</strong>
                <div>{{ member.user.role | titlecase }} - {{ member.user.email }}</div>
              </div>
              <div class="member-count">{{ member.assignedCount }} assigned</div>
            </div>
          </div>
          <ng-template #noStaff>
            <p class="empty">No staff records available.</p>
          </ng-template>
        </mat-card>
      </div>
    </section>
  `,
  styles: [`
    .team-shell { display: grid; gap: 22px; }
    .intro { margin: 10px 0 0; color: var(--muted); max-width: 60ch; line-height: 1.6; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .metric-card, .team-card {
      padding: 24px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: #ffffff;
      box-shadow: var(--shadow);
    }
    .metrics .metric-card:nth-child(1) {
      background: linear-gradient(145deg, #eef4ff, #f7faff);
      border-color: #cfe0ff;
    }
    .metrics .metric-card:nth-child(2) {
      background: linear-gradient(145deg, #eaf6ff, #f5fbff);
      border-color: #c9e8ff;
    }
    .metrics .metric-card:nth-child(3) {
      background: linear-gradient(145deg, #fff4de, #fffaf0);
      border-color: #ffe1a8;
    }
    .metrics .metric-card:nth-child(4) {
      background: linear-gradient(145deg, #f3ecff, #faf6ff);
      border-color: #ddcbff;
    }
    .metrics .metric-card:nth-child(5) {
      background: linear-gradient(145deg, #e8fff6, #f4fff9);
      border-color: #b9f3d8;
    }
    .metrics .metric-card:nth-child(6) {
      background: linear-gradient(145deg, #fff1f2, #fff8f8);
      border-color: #fecdd3;
    }
    .metric-label {
      color: var(--muted);
      font-size: 0.95rem;
    }
    .metric-value {
      margin-top: 12px;
      font-size: 28px;
      font-weight: 800;
      color: #17366e;
      line-height: 1.1;
    }
    .team-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
    }
    .team-card h2 {
      margin-top: 0;
      color: #17366e;
    }
    .filter-actions {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    .filter-btn {
      border: 1px solid #d7e3f4;
      border-radius: 10px;
      background: #f8fbff;
      color: #17366e;
      padding: 6px 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .filter-btn.active {
      background: #2563eb;
      border-color: #2563eb;
      color: #fff;
    }
    .member-row[role="button"] {
      cursor: pointer;
    }
    .small-text {
      margin-top: 4px;
      color: #60708c;
      font-size: 0.85rem;
    }
    .member-list {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }
    .member-row {
      padding: 16px;
      border-radius: 16px;
      border: 1px solid #e4e9f2;
      background: #f8fbff;
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: center;
    }
    .pending-ticket-main {
      flex: 1;
      cursor: pointer;
    }
    .actions-section {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
      align-items: center;
    }
    .solve-btn, .reply-btn {
      border: 1px solid #d7e3f4;
      border-radius: 8px;
      background: #fff;
      color: #17366e;
      padding: 6px 10px;
      font-weight: 700;
      cursor: pointer;
    }
    .solve-btn { border-color: #10b981; color: #047857; }
    .reply-btn { border-color: #2563eb; color: #1e40af; }
    .assign-dropdown {
      width: 200px;
      font-size: 13px;
      margin-right: 8px;
    }
    ::ng-deep .assign-dropdown .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .assign-dropdown .mat-mdc-text-field-wrapper { padding-top: 0 !important; padding-bottom: 0 !important; height: 40px !important; }
    ::ng-deep .assign-dropdown .mat-mdc-form-field-flex { height: 40px !important; align-items: center !important; }
    .member-row strong {
      color: #1e293b;
    }
    .member-row div {
      color: var(--muted);
    }
    .member-count {
      font-weight: 700;
      color: #2563eb;
      white-space: nowrap;
    }
    .empty {
      color: var(--muted);
      margin-bottom: 0;
    }
    @media (max-width: 960px) {
      .metrics, .team-grid { grid-template-columns: 1fr; }
    }

    /* DARK MODE REFINEMENTS */
    :host-context(.dark-theme) .team-shell {
      --card-bg: #1e293b;
      --row-bg: #334155;
      --text: #f8fafc;
      --muted-text: #94a3b8;
    }

    :host-context(.dark-theme) h1,
    :host-context(.dark-theme) .team-card h2 {
      color: #ffffff;
    }

    :host-context(.dark-theme) .metric-card,
    :host-context(.dark-theme) .team-card {
      background: var(--card-bg);
      border-color: #334155;
    }

    :host-context(.dark-theme) .metric-value {
      color: #60a5fa;
    }

    :host-context(.dark-theme) .member-row {
      background: var(--row-bg);
      border-color: #475569;
    }

    :host-context(.dark-theme) .member-row strong {
      color: #ffffff;
    }

    :host-context(.dark-theme) .member-row div:not(.member-count) {
      color: var(--muted-text);
    }

    :host-context(.dark-theme) .small-text {
      color: #94a3b8;
    }

    :host-context(.dark-theme) .filter-btn {
      background: #334155;
      border-color: #475569;
      color: #f8fafc;
    }

    :host-context(.dark-theme) .solve-btn {
      background: #10b981;
      border-color: #10b981;
      color: #ffffff;
    }

    :host-context(.dark-theme) .solve-btn:hover {
      background: #059669;
      border-color: #059669;
    }

    :host-context(.dark-theme) .reply-btn {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }

    :host-context(.dark-theme) .reply-btn:hover {
      background: #1d4ed8;
      border-color: #1d4ed8;
    }

    :host-context(.dark-theme) .metric-card:nth-child(1),
    :host-context(.dark-theme) .metric-card:nth-child(2),
    :host-context(.dark-theme) .metric-card:nth-child(3),
    :host-context(.dark-theme) .metric-card:nth-child(4),
    :host-context(.dark-theme) .metric-card:nth-child(5),
    :host-context(.dark-theme) .metric-card:nth-child(6) {
       background: #1e293b !important;
       border-color: #334155;
    }
  `],
})
export class TeamBoardComponent {
  private auth = inject(AuthService);
  private ticketService = inject(TicketService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  staff: User[] = [];
  agents: User[] = [];
  tickets: Ticket[] = [];
  memberSummaries: TeamMemberSummary[] = [];
  unassignedCount = 0;
  visibleTickets: Ticket[] = [];
  statusFilter: 'open' | 'in_progress' | 'closed' = 'open';

  get filteredTickets(): Ticket[] {
    return this.visibleTickets.filter((ticket) => ticket.status === this.statusFilter);
  }

  get statusCounts() {
    return {
      open: this.visibleTickets.filter((t) => t.status === 'open').length,
      in_progress: this.visibleTickets.filter((t) => t.status === 'in_progress').length,
      closed: this.visibleTickets.filter((t) => t.status === 'closed').length,
    };
  }

  ticketAgeHours(ticket: Ticket): number {
    const created = new Date(ticket.created_at).getTime();
    const now = new Date().getTime();
    return Math.floor((now - created) / (1000 * 60 * 60));
  }

  assignCountsByAgent(): Array<{ name: string; count: number }> {
    const counts: Record<string, number> = {};
    this.visibleTickets.forEach((ticket) => {
      const key = ticket.assigned_to?.full_name || 'Unassigned';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  constructor() {
    forkJoin({
      staff: this.auth.getStaffUsers(),
      tickets: this.ticketService.list({ page: 1 }),
    }).subscribe(({ staff, tickets }) => {
      this.staff = staff;
      this.agents = staff.filter((user) => user.role === 'agent');
      this.tickets = tickets.results;
      this.visibleTickets = tickets.results;
      this.unassignedCount = tickets.results.filter((ticket) => !ticket.assigned_to).length;
      this.memberSummaries = this.agents.map((user) => ({
        user,
        assignedCount: tickets.results.filter((ticket) => ticket.assigned_to?.id === user.id).length,
      }));
    });
  }

  goToTicket(ticketId: number, event?: MouseEvent): void {
    event?.stopPropagation();
    this.router.navigate(['/tickets', ticketId]);
  }

  ticketStatusLabel(status: 'open' | 'in_progress' | 'closed'): string {
    if (status === 'closed') {
      return 'Completed';
    }
    if (status === 'in_progress') {
      return 'In Progress';
    }
    return 'Pending';
  }

  toggleIssueStatus(ticket: Ticket, event: MouseEvent): void {
    event.stopPropagation();

    const newStatus = ticket.status === 'closed' ? 'open' : 'closed';
    const payload: TicketUpdatePayload = {
      status: newStatus,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      assigned_to_id: ticket.assigned_to?.id ?? null,
    };

    this.ticketService.update(ticket.id, payload).subscribe({
      next: () => {
        ticket.status = newStatus;
        const text = newStatus === 'closed' ? 'completed' : 'pending';
        this.notify.success(`Issue #${ticket.id} marked ${text}.`);
      },
      error: (err) => {
        const apiMessage = err?.error?.detail || err?.error?.message || 'Unable to contact API';
        this.notify.error(`Failed to update issue #${ticket.id}: ${apiMessage}`);
        console.error('Toggle issue status error', err);
      },
    });
  }

  assignTicket(ticket: Ticket, userId: number | null): void {
    const payload: TicketUpdatePayload = {
      status: userId ? 'in_progress' : ticket.status,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      assigned_to_id: userId,
    };

    this.ticketService.update(ticket.id, payload).subscribe({
      next: (updatedTicket: Ticket) => {
        ticket.assigned_to = updatedTicket.assigned_to;
        this.notify.success(`Ticket #${ticket.id} assigned successfully.`);
        this.refreshData();
      },
      error: () => this.notify.error('Failed to assign ticket.'),
    });
  }

  private refreshData(): void {
    forkJoin({
      staff: this.auth.getStaffUsers(),
      tickets: this.ticketService.list({ page: 1 }),
    }).subscribe(({ staff, tickets }) => {
      this.staff = staff;
      this.agents = staff.filter((user) => user.role === 'agent');
      this.tickets = tickets.results;
      this.visibleTickets = tickets.results;
      this.unassignedCount = tickets.results.filter((ticket) => !ticket.assigned_to).length;
      this.memberSummaries = this.agents.map((user) => ({
        user,
        assignedCount: tickets.results.filter((ticket) => ticket.assigned_to?.id === user.id).length,
      }));
    });
  }
}
